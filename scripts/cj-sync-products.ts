/**
 * CJdropshipping product sync — Atelier Frisson V2 pivot.
 *
 * Importe le catalogue 150-300 SKUs depuis l'API CJdropshipping vers la
 * table `products`. Idempotent : peut être ré-exécuté pour mettre à jour
 * stock, prix, descriptions sans dupliquer les rows.
 *
 * Usage :
 *   pnpm tsx scripts/cj-sync-products.ts            # sync tous les SKUs validés
 *   pnpm tsx scripts/cj-sync-products.ts --dry-run  # validation sans write DB
 *   pnpm tsx scripts/cj-sync-products.ts --sku=SKU1 # un SKU précis
 *
 * Variables d'env requises :
 *   - CJ_API_EMAIL          (compte B2B CJ)
 *   - CJ_API_PASSWORD       (mot de passe API)
 *   - DATABASE_URL          (Supabase Postgres)
 *
 * Workflow :
 *   1. Login CJ → access_token (TTL 7 jours, à cacher dans /tmp ou Redis)
 *   2. Lecture liste blanche SKUs depuis `data/cj-skus-validated.json`
 *      (curatée par Odelie, format : { sku, audience, category, mapping })
 *   3. Pour chaque SKU :
 *      a. GET /api/v2/product/query?productSku=SKU
 *      b. Mapping CJ → schema Atelier Frisson :
 *         - cj.productNameEn → name (ou productNameZh→name si plus pertinent)
 *         - cj.sellPrice → priceCents (* 100, conversion CNY→EUR via taux du jour)
 *         - cj.images → images[] (téléchargement vers Supabase Storage en parallèle)
 *         - cj.weight, cj.dimensions → specs jsonb
 *         - cj.description → descriptionLong (sanitize HTML + traduction si EN→FR)
 *         - audience/category de la liste blanche → collection + categoryId
 *      c. UPSERT dans table `products` (ON CONFLICT supplier_sku DO UPDATE)
 *      d. Si nouvelles images : upload vers Supabase Storage + update images[].url
 *   4. Logger le résultat (synced / failed / skipped)
 *
 * Curation manuelle obligatoire :
 *   - Odelie review chaque SKU avant publication (statut = 'draft' au sync,
 *     puis ALTER status = 'active' depuis admin UI)
 *   - SEO title/description sont GÉNÉRÉS par le script (template) mais
 *     RELUS par Odelie avant activation
 *   - tags audience (pour-elle, pour-lui, pour-vous-deux, cadeaux) viennent
 *     de la liste blanche, pas de l'auto-detection
 */

// Note : ce fichier est un skeleton TypeScript exécuté via `tsx`.
// Les imports DB (drizzle) et fetch CJ ne sont pas encore branchés.

interface CJSkuWhitelistEntry {
  sku: string;
  audience: 'couples' | 'elle' | 'lui' | 'cadeaux';
  category: 'objets' | 'lingerie' | 'cosmetique' | 'accessoires';
  /** Slug souhaité côté Atelier Frisson (override du nom auto). */
  desiredSlug?: string;
  /** Tags additionnels (saint-valentin, cadeau, voyage, etc.). */
  tags?: readonly string[];
  /** Multiplicateur de prix vs sellPrice CJ (ex: 4 = marge 75%). */
  priceMultiplier: number;
  /** Notes Odelie pour la review (visibles admin uniquement). */
  notes?: string;
}

interface CJProductResponse {
  productSku: string;
  productName: string;
  productNameEn: string;
  sellPrice: string; // CNY décimal en string
  weight: string;
  productLength: string;
  productWidth: string;
  productHeight: string;
  description: string;
  productImages: string[];
  productVideo?: string;
  variants?: Array<{
    sku: string;
    sellPrice: string;
    image?: string;
    attributes: Record<string, string>;
  }>;
  inventoryQuantity: number;
}

interface SyncStats {
  total: number;
  synced: number;
  created: number;
  updated: number;
  failed: number;
  skipped: number;
  imagesUploaded: number;
  errors: ReadonlyArray<{ sku: string; reason: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('  CJ SYNC — Atelier Frisson V2');
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info(`  Mode    : ${args.dryRun ? 'DRY RUN (no DB write)' : 'LIVE'}`);
  console.info(`  Filter  : ${args.singleSku ?? 'all whitelist SKUs'}`);
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // ── 1) Login CJ ─────────────────────────────────────────────────────
  const email = process.env['CJ_API_EMAIL'];
  const password = process.env['CJ_API_PASSWORD'];
  if (!email || !password) {
    console.error(
      '✗ CJ_API_EMAIL ou CJ_API_PASSWORD non définis. Configurer .env.local.',
    );
    process.exit(1);
  }

  const accessToken = await loginCJ(email, password);
  if (!accessToken) {
    console.error('✗ Échec login CJdropshipping. Vérifier credentials.');
    process.exit(1);
  }
  console.info('✓ Login CJ OK');

  // ── 2) Liste blanche ───────────────────────────────────────────────
  const whitelist = await loadWhitelist();
  console.info(`✓ Whitelist : ${whitelist.length} SKUs validés par Odelie`);

  const filtered = args.singleSku
    ? whitelist.filter((e) => e.sku === args.singleSku)
    : whitelist;

  // ── 3) Sync ─────────────────────────────────────────────────────────
  const stats: SyncStats = {
    total: filtered.length,
    synced: 0,
    created: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
    imagesUploaded: 0,
    errors: [],
  };

  for (const entry of filtered) {
    try {
      const result = await syncOneSku({
        entry,
        accessToken,
        dryRun: args.dryRun,
      });
      stats.synced++;
      if (result.action === 'created') stats.created++;
      if (result.action === 'updated') stats.updated++;
      if (result.action === 'skipped') stats.skipped++;
      stats.imagesUploaded += result.imagesUploaded;
    } catch (err) {
      stats.failed++;
      (stats.errors as Array<{ sku: string; reason: string }>).push({
        sku: entry.sku,
        reason: (err as Error).message,
      });
      console.error(`  ✗ ${entry.sku} — ${(err as Error).message}`);
    }
  }

  // ── 4) Récap ────────────────────────────────────────────────────────
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info(`  Total    : ${stats.total}`);
  console.info(`  Synced   : ${stats.synced}  (created ${stats.created} / updated ${stats.updated} / skipped ${stats.skipped})`);
  console.info(`  Failed   : ${stats.failed}`);
  console.info(`  Images   : ${stats.imagesUploaded} uploadées`);
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (stats.failed > 0) {
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CJ API CLIENT (stub)
// ─────────────────────────────────────────────────────────────────────────────

async function loginCJ(email: string, password: string): Promise<string | null> {
  // TODO :
  //   POST https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken
  //   body { email, password }
  //   → { accessToken, accessTokenExpiryDate, refreshToken, ... }
  //   Cache token dans /tmp/cj-token.json (TTL 7 jours)
  void email;
  void password;
  return 'STUB_TOKEN_REPLACE_ME';
}

async function fetchCJProduct(
  accessToken: string,
  sku: string,
): Promise<CJProductResponse | null> {
  // TODO :
  //   GET https://developers.cjdropshipping.com/api2.0/v1/product/query
  //   ?productSku=SKU
  //   header CJ-Access-Token: ${accessToken}
  //   → réponse paginée, on prend data[0]
  void accessToken;
  void sku;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC LOGIC
// ─────────────────────────────────────────────────────────────────────────────

interface SyncResult {
  action: 'created' | 'updated' | 'skipped';
  imagesUploaded: number;
}

async function syncOneSku(args: {
  entry: CJSkuWhitelistEntry;
  accessToken: string;
  dryRun: boolean;
}): Promise<SyncResult> {
  const cj = await fetchCJProduct(args.accessToken, args.entry.sku);
  if (!cj) {
    throw new Error(`CJ returned null for SKU ${args.entry.sku}`);
  }

  // 1. Conversion prix CNY → EUR — taux du jour via une API publique
  //    (ou env var CJ_CNY_EUR_RATE pour fixer)
  const cnyEurRate = Number(process.env['CJ_CNY_EUR_RATE'] ?? '0.13');
  const cjPriceCents = Math.round(parseFloat(cj.sellPrice) * cnyEurRate * 100);
  const finalPriceCents = Math.round(cjPriceCents * args.entry.priceMultiplier);

  // 2. Slug : utiliser desiredSlug ou kebab-case du nom EN
  const slug = args.entry.desiredSlug ?? slugify(cj.productNameEn);

  // 3. Mapping audience → collection enum
  const collection = args.entry.audience;

  // 4. Construire le payload Drizzle
  const productPayload = {
    slug,
    name: cj.productNameEn, // sera retraduit FR par Odelie en review
    descriptionShort: truncate(cj.description, 200),
    descriptionLong: cj.description,
    priceCents: finalPriceCents,
    costCents: cjPriceCents,
    currency: 'EUR' as const,
    taxRate: '20.00' as const,
    images: cj.productImages.map((url, i) => ({
      url, // TODO : télécharger + uploader Supabase Storage
      alt: `${cj.productNameEn} — vue ${i + 1}`,
      width: 1200,
      height: 1500,
    })),
    collection,
    tags: [
      `pour-${collection === 'couples' ? 'vous-deux' : collection}`,
      ...(args.entry.tags ?? []),
    ],
    supplierSku: args.entry.sku,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: cj.inventoryQuantity,
    stockStatus:
      cj.inventoryQuantity > 10
        ? ('in_stock' as const)
        : cj.inventoryQuantity > 0
          ? ('low_stock' as const)
          : ('out_of_stock' as const),
    status: 'draft' as const, // ⚠ toujours draft, Odelie review puis active
    isFeatured: false,
  };

  // 5. UPSERT
  if (args.dryRun) {
    console.info(`  ✓ ${args.entry.sku} (DRY) → ${slug} (${finalPriceCents} cents)`);
    return { action: 'skipped', imagesUploaded: 0 };
  }

  // TODO :
  //   const existing = await db.query.products.findFirst({
  //     where: eq(products.supplierSku, args.entry.sku)
  //   });
  //   if (existing) {
  //     await db.update(products).set({...payload, updatedAt: new Date()})
  //       .where(eq(products.id, existing.id));
  //     return { action: 'updated', imagesUploaded: payload.images.length };
  //   } else {
  //     await db.insert(products).values(payload);
  //     return { action: 'created', imagesUploaded: payload.images.length };
  //   }

  void productPayload;
  console.info(`  ✓ ${args.entry.sku} → ${slug} (stub)`);
  return { action: 'created', imagesUploaded: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

interface CliArgs {
  dryRun: boolean;
  singleSku: string | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const dryRun = argv.includes('--dry-run');
  const skuArg = argv.find((a) => a.startsWith('--sku='));
  const singleSku = skuArg ? skuArg.slice('--sku='.length) : null;
  return { dryRun, singleSku };
}

async function loadWhitelist(): Promise<readonly CJSkuWhitelistEntry[]> {
  // TODO :
  //   const raw = await fs.readFile('data/cj-skus-validated.json', 'utf-8');
  //   return JSON.parse(raw) as CJSkuWhitelistEntry[];
  // En attendant, retourner stub (3 SKUs exemple).
  return [
    {
      sku: 'CJ-AF-DUO-IVO',
      audience: 'couples',
      category: 'objets',
      desiredSlug: 'duo',
      tags: ['silicone-medical', 'best-seller'],
      priceMultiplier: 4.5,
      notes: 'Stimulateur couple en U — référence CJ poste fixe',
    },
    {
      sku: 'SHEW-AF-SILL-IVO',
      audience: 'elle',
      category: 'lingerie',
      desiredSlug: 'sillage',
      tags: ['soie', 'made-in-france'],
      priceMultiplier: 3.2,
      notes: 'Nuisette soie 22 momme — sourcing Italie via Shewin',
    },
    {
      sku: 'SPOC-AF-SOUR-LUB',
      audience: 'couples',
      category: 'cosmetique',
      desiredSlug: 'source',
      tags: ['lubrifiant', 'eau', 'consommable'],
      priceMultiplier: 5.0,
      notes: 'Lubrifiant base eau — sourcing EU via Spocket',
    },
  ];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error('✗ Sync FAILED:', err);
  process.exit(1);
});
