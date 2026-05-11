import type { Product, Category } from '@/lib/db/schema';

/**
 * Données produit / catégorie placeholder — pivot V2 « Couples 30-50 »
 * (avr 2026). Source de vérité tant que le seed CJ + photos n'est pas appliqué.
 *
 * Le shape suit `lib/db/schema.ts` (`Product`, `Category`).
 *
 * Convention pivot :
 *   - `categoryId` → TYPE de produit (objets / lingerie / cosmétique / accessoires)
 *   - `collection` → AUDIENCE primaire (couples / elle / lui / cadeaux)
 *   - `tags`       → AUDIENCES additionnelles (pour-vous-deux, pour-elle, pour-lui,
 *                    cadeaux, saint-valentin, anniversaire, etc.) + thématiques
 *                    (silicone-medical, soie, dentelle, etc.)
 *
 * Mapping des images : `/images/products/{slug}/{view}.webp` — slots prêts pour
 * recevoir les rendus issus de `docs/IMAGE_PROMPTS_PRODUCTS.md`.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES — types de produit
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: readonly Category[] = [
  {
    id: '01000000-0000-0000-0000-000000000001',
    slug: 'objets',
    name: 'Objets',
    description: 'Stimulateurs, wands, télécommandés et pierres de massage en silicone médical et matériaux nobles.',
    seoTitle: 'Objets de rituel — Atelier Frisson',
    seoDescription: 'Objets de rituel intime en silicone médical certifié. Pour elle, pour lui, pour vous deux. Livraison discrète France.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 1,
    isActive: true,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '01000000-0000-0000-0000-000000000002',
    slug: 'lingerie',
    name: 'Lingerie',
    description: 'Soie, dentelle Calais, coupe couture. Mise en scène discrète, geste premium.',
    seoTitle: 'Lingerie — Atelier Frisson',
    seoDescription: 'Nuisettes soie, body dentelle Leavers, kimonos et bas couture. Pour le rituel à deux.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 2,
    isActive: true,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '01000000-0000-0000-0000-000000000003',
    slug: 'cosmetique',
    name: 'Cosmétique intime',
    description: 'Lubrifiants, bougies de massage, huiles sensuelles, sels de bain rituels — formules courtes EU.',
    seoTitle: 'Cosmétique intime — Atelier Frisson',
    seoDescription: 'Lubrifiants base eau, huiles, bougies de massage et sels de bain. Compositions transparentes, fabriquées EU.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 3,
    isActive: true,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '01000000-0000-0000-0000-000000000004',
    slug: 'accessoires',
    name: 'Accessoires',
    description: 'Bandeaux soie, plumes caresse, coffrets cadeaux. La mise en scène du rituel.',
    seoTitle: 'Accessoires — Atelier Frisson',
    seoDescription: 'Bandeaux soie, plumes caresse, coffrets cadeaux signés. Le geste qui prolonge le rituel.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 4,
    isActive: true,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
] as const;

const CAT_OBJETS = MOCK_CATEGORIES[0]!.id;
const CAT_LINGERIE = MOCK_CATEGORIES[1]!.id;
const CAT_COSMETIQUE = MOCK_CATEGORIES[2]!.id;
const CAT_ACCESSOIRES = MOCK_CATEGORIES[3]!.id;

// ─────────────────────────────────────────────────────────────────────────────
// IMAGES — helper pour générer les 5 vues d'un produit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère les 5 vues standardisées (Hero / 3-4 angle / Macro / Packaging /
 * Lifestyle). Les fichiers seront produits via `docs/IMAGE_PROMPTS_PRODUCTS.md`
 * et déposés dans `public/images/products/{slug}/{view}.webp`.
 */
function fiveViews(slug: string, name: string): Product['images'] {
  const views = [
    { suffix: '01-hero', alt: `${name} — vue principale`, w: 2400, h: 3000 },
    { suffix: '02-angle', alt: `${name} — vue 3/4`, w: 2400, h: 2400 },
    { suffix: '03-detail', alt: `${name} — détail matière`, w: 2400, h: 2400 },
    { suffix: '04-packaging', alt: `${name} — emballage signé`, w: 2400, h: 3000 },
    { suffix: '05-lifestyle', alt: `${name} — mise en scène`, w: 2400, h: 3000 },
  ] as const;
  return views.map((v) => ({
    url: `/images/products/${slug}/${v.suffix}.webp`,
    alt: v.alt,
    width: v.w,
    height: v.h,
  }));
}

const baseDate = new Date('2026-05-07T00:00:00Z');

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS — 20 archétypes pivotés (mapping 1:1 avec docs/IMAGE_PROMPTS_PRODUCTS.md)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: readonly Product[] = [
  // ── OBJETS — 8 ─────────────────────────────────────────────────────────────
  {
    id: '02000000-0000-0000-0000-000000000001',
    slug: 'duo',
    name: 'Duo',
    nameShort: 'Duo',
    tagline: 'Le geste partagé, sans intrusion visuelle.',
    descriptionShort:
      'Stimulateur couple en U, silicone médical mat ivoire, base or champagne. Pensé pour le rituel à deux.',
    descriptionLong:
      'Duo est notre stimulateur couple : une silhouette en U taillée dans un silicone médical certifié ISO 10993, finition mate ivoire, base sertie d\'un anneau or champagne. Sept rythmes synchronisés, moteur silencieux (< 45 dB), recharge USB-C magnétique.',
    descriptionEditorial: `Duo n\'est pas un objet pour soi — c\'est un objet pour deux. La silhouette en U a été dessinée pour s\'effacer pendant l\'usage, laisser la place au geste. Sa finition mate ivoire évoque la pierre polie ; son anneau or, la signature discrète de la maison.

Compatible avec tous les lubrifiants à base d\'eau. Étanche IPX7. Garantie 2 ans.`,
    specs: {
      Matériau: 'Silicone médical ISO 10993, base ABS or champagne',
      Dimensions: '10 cm × 4 cm',
      Poids: '95 g',
      Autonomie: '90 min en usage continu',
      Recharge: 'USB-C magnétique, 90 min',
      Étanchéité: 'IPX7',
      'Niveau sonore': '< 45 dB',
      Modes: '7 rythmes synchronisés',
      Garantie: '2 ans',
    },
    features: [
      'Forme en U pour usage à deux',
      'Silicone médical certifié',
      'Étanche IPX7',
      'Recharge USB-C magnétique',
      '7 rythmes synchronisés',
      'Moteur silencieux < 45 dB',
      'Garantie 2 ans',
      'Emballage neutre signé',
    ],
    priceCents: 11900,
    compareAtPriceCents: null,
    costCents: 2400,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('duo', 'Duo'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'couples',
    tags: ['pour-vous-deux', 'pour-elle', 'pour-lui', 'silicone-medical', 'best-seller'],
    supplierId: null,
    supplierSku: 'CJ-AF-DUO-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 47,
    stockStatus: 'in_stock',
    lowStockThreshold: 10,
    seoTitle: 'Duo — Stimulateur couple silicone médical | Atelier Frisson',
    seoDescription:
      'Duo : stimulateur couple en silicone médical, 7 rythmes synchronisés. Maison française, livraison discrète, garantie 2 ans.',
    seoKeywords: ['stimulateur couple', 'objet couple silicone médical', 'wellness intime à deux'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000002',
    slug: 'onde',
    name: 'Onde',
    nameShort: 'Onde',
    tagline: 'La vague qui parcourt.',
    descriptionShort:
      'Wand massager. Manche brossé champagne, tête en silicone laqué oxblood, finition miroir.',
    descriptionLong:
      'Onde est notre wand : un manche slim en métal brossé champagne, une tête bulbeuse en silicone laqué oxblood polie miroir. Onze intensités, six rythmes, moteur silencieux. Pensé pour le rituel externe long et progressif.',
    descriptionEditorial: `Inspiré des laques de la dynastie Ming et de la rigueur des objets Dyson, Onde marie deux écoles : l\'artisanat du laque et l\'ingénierie de précision. Sa tête mirror-finish facilite l\'usage avec un lubrifiant et permet un nettoyage instantané.`,
    specs: {
      Matériau: 'Silicone laqué + métal brossé champagne',
      Dimensions: '22 cm × 5 cm (tête)',
      Poids: '320 g',
      Autonomie: '120 min en usage continu',
      Recharge: 'USB-C magnétique, 120 min',
      Étanchéité: 'IPX7',
      'Niveau sonore': '< 50 dB',
      Modes: '11 intensités × 6 rythmes',
      Garantie: '2 ans',
    },
    features: [
      'Tête laquée mirror-finish',
      'Manche métal brossé champagne',
      '11 intensités × 6 rythmes',
      'Étanche IPX7',
      'Garantie 2 ans',
    ],
    priceCents: 14900,
    compareAtPriceCents: null,
    costCents: 3100,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('onde', 'Onde'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'elle',
    tags: ['pour-elle', 'pour-vous-deux', 'wand', 'oxblood', 'signature'],
    supplierId: null,
    supplierSku: 'CJ-AF-ONDE-OXB',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 28,
    stockStatus: 'in_stock',
    lowStockThreshold: 8,
    seoTitle: 'Onde — Wand massager laqué oxblood | Atelier Frisson',
    seoDescription:
      'Onde : wand massager, tête laquée oxblood mirror-finish, manche métal brossé champagne. 11 intensités × 6 rythmes.',
    seoKeywords: ['wand massager français', 'baguette stimulation externe', 'wand laqué premium'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000003',
    slug: 'etincelle',
    name: 'Étincelle',
    nameShort: 'Étincelle',
    tagline: 'Discrétion absolue, geste rapide.',
    descriptionShort:
      'Bullet vibrator format poche. Silicone mat ivoire, anneau or champagne, trois modes silencieux.',
    descriptionLong:
      'Étincelle est notre objet de poche : 9 cm, 95 g, silicone mat ivoire, anneau et bouton uniques en or champagne. Trois modes très silencieux (< 40 dB), étui de voyage en lin écru inclus.',
    descriptionEditorial: `La taille la plus petite, le bruit le plus discret, la trousse de toilette la plus innocente. Étincelle ne paie pas de mine — c\'est le point.`,
    specs: {
      Matériau: 'Silicone médical mat',
      Dimensions: '9 cm × 2 cm',
      Poids: '50 g',
      Autonomie: '60 min',
      Recharge: 'USB-C, 75 min',
      Étanchéité: 'IPX6',
      'Niveau sonore': '< 40 dB',
      Modes: '3 vibrations discrètes',
      Inclus: 'Étui de voyage lin écru',
    },
    features: [
      'Format compact voyage',
      'Silicone médical mat',
      'Très silencieux < 40 dB',
      'Étui en lin inclus',
      'USB-C',
    ],
    priceCents: 5900,
    compareAtPriceCents: null,
    costCents: 1100,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('etincelle', 'Étincelle'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'elle',
    tags: ['pour-elle', 'compact', 'voyage', 'discret', 'cadeaux'],
    supplierId: null,
    supplierSku: 'CJ-AF-ETIN-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 84,
    stockStatus: 'in_stock',
    lowStockThreshold: 12,
    seoTitle: 'Étincelle — Bullet compact silicone médical | Atelier Frisson',
    seoDescription:
      'Étincelle : bullet vibrator format poche, silicone mat, étui lin inclus. Très silencieux, idéal voyage.',
    seoKeywords: ['bullet vibrator discret', 'objet voyage compact', 'silicone médical petit format'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000004',
    slug: 'murmure',
    name: 'Murmure',
    nameShort: 'Murmure',
    tagline: 'Le geste à distance, le secret partagé.',
    descriptionShort:
      'Toy télécommandé pour couples. Silicone mat ivoire, télécommande slim or champagne, portée 10 m.',
    descriptionLong:
      'Murmure est conçu pour les couples qui jouent à distance ou en duo : un objet en silicone mat ivoire, une télécommande slim en métal brossé champagne (5 cm, sans écran, un seul bouton), portée 10 m. Compatible application iOS/Android sans tracking, vie privée respectée.',
    descriptionEditorial: `Murmure inverse le rapport — c\'est l\'autre qui choisit. La télécommande, fine comme une carte de crédit, tient dans une poche de costume ou sur la table d\'un dîner. L\'application est optionnelle, sans cloud, sans publicité.`,
    specs: {
      Matériau: 'Silicone médical + métal brossé',
      Connectivité: 'Bluetooth 5.3 + RF 10 m',
      Application: 'iOS/Android optionnelle, sans tracking',
      Dimensions: '10 cm × 3 cm (objet)',
      Poids: '95 g (objet) + 35 g (télécommande)',
      Autonomie: '90 min',
      Recharge: 'USB-C magnétique',
      Étanchéité: 'IPX7',
    },
    features: [
      'Télécommande slim métal brossé',
      'Portée 10 m',
      'Application sans tracking',
      'Silicone médical',
      'USB-C magnétique',
    ],
    priceCents: 13900,
    compareAtPriceCents: null,
    costCents: 2900,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('murmure', 'Murmure'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'couples',
    tags: ['pour-vous-deux', 'telecommande', 'distance', 'connecte', 'cadeaux'],
    supplierId: null,
    supplierSku: 'CJ-AF-MURM-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 22,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Murmure — Toy télécommandé couple | Atelier Frisson',
    seoDescription:
      'Murmure : objet télécommandé pour couples, télécommande slim métal brossé, portée 10 m. Application iOS/Android sans tracking.',
    seoKeywords: ['toy télécommandé couple', 'objet distance discret', 'application sans tracking'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000005',
    slug: 'velours',
    name: 'Velours',
    nameShort: 'Velours',
    tagline: 'La pièce signature, le rituel du soir.',
    descriptionShort:
      'Stimulateur interne sculptural en silicone laqué oxblood mirror-finish, base or champagne. 9 modes synchronisés.',
    descriptionLong:
      'Velours est la pièce signature de la maison : une silhouette sculpturale de 18 cm, surface en silicone laqué oxblood polie en triple polissage, base ABS or champagne. Neuf modes synchronisés, étanchéité totale IPX8, garantie à vie.',
    descriptionEditorial: `Inspiré de Brancusi et des laques de la dynastie Ming, Velours n\'est pas un objet utilitaire — c\'est une déclaration d\'intention. Faire de l\'objet de rituel intime un objet de design, au même titre qu\'une lampe Tizio ou un fauteuil Egg.`,
    specs: {
      Matériau: 'Silicone médical laqué triple polissage',
      Dimensions: '18 cm × 4 cm',
      Poids: '240 g',
      Autonomie: '180 min',
      Recharge: 'USB-C magnétique, 150 min',
      Étanchéité: 'IPX8 (immersion totale)',
      'Niveau sonore': '< 38 dB',
      Modes: '9 rythmes',
      Garantie: 'Garantie à vie',
    },
    features: [
      'Pièce signature maison',
      'Triple polissage laque',
      'Étanche IPX8',
      'Garantie à vie',
      '9 rythmes',
    ],
    priceCents: 16900,
    compareAtPriceCents: null,
    costCents: 3500,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('velours', 'Velours'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'elle',
    tags: ['pour-elle', 'pour-vous-deux', 'signature', 'oxblood', 'haut-de-gamme', 'best-seller'],
    supplierId: null,
    supplierSku: 'CJ-AF-VELO-OXB',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 14,
    stockStatus: 'low_stock',
    lowStockThreshold: 5,
    seoTitle: 'Velours — Pièce signature laque oxblood | Atelier Frisson',
    seoDescription:
      'Velours : pièce signature Atelier Frisson, silicone laqué oxblood triple polissage, garantie à vie. 9 rythmes, IPX8.',
    seoKeywords: ['stimulateur signature français', 'objet design intime', 'laque oxblood premium'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000006',
    slug: 'profond',
    name: 'Profond',
    nameShort: 'Profond',
    tagline: 'Le territoire à explorer, ensemble.',
    descriptionShort:
      'Massager prostatique anatomique en silicone mat noir velours, base or champagne. 7 rythmes, étanche IPX7.',
    descriptionLong:
      'Profond est notre massager prostatique : silhouette anatomique en S de 12 cm, silicone mat noir velours, base or champagne. Sept rythmes, recharge USB-C magnétique, étanche IPX7. Pensé pour l\'usage solo ou à deux.',
    descriptionEditorial: `Profond a été développé en collaboration avec un urologue parisien et un designer industriel. La courbe en S a été calibrée sur 14 morphologies pour atteindre la zone P sans effort, sans impatience.`,
    specs: {
      Matériau: 'Silicone médical mat',
      Dimensions: '12 cm × 3 cm',
      Poids: '110 g',
      Autonomie: '90 min',
      Recharge: 'USB-C magnétique, 90 min',
      Étanchéité: 'IPX7',
      'Niveau sonore': '< 45 dB',
      Modes: '7 rythmes',
      Garantie: '2 ans',
    },
    features: [
      'Anatomie prostate calibrée',
      'Silicone mat noir velours',
      'Étanche IPX7',
      'Recharge USB-C',
      '7 rythmes',
    ],
    priceCents: 9900,
    compareAtPriceCents: null,
    costCents: 2000,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('profond', 'Profond'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'lui',
    tags: ['pour-lui', 'pour-vous-deux', 'prostate', 'masculin'],
    supplierId: null,
    supplierSku: 'CJ-AF-PROF-NOIR',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 31,
    stockStatus: 'in_stock',
    lowStockThreshold: 7,
    seoTitle: 'Profond — Massager prostatique premium | Atelier Frisson',
    seoDescription:
      'Profond : massager prostatique anatomique, silicone mat noir velours, 7 rythmes. Conçu avec un urologue.',
    seoKeywords: ['massager prostate français', 'objet masculin premium', 'plaisir homme silicone médical'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000007',
    slug: 'pierre',
    name: 'Pierre',
    nameShort: 'Pierre',
    tagline: 'Le poids juste, la chaleur lente.',
    descriptionShort:
      'Pierre de massage chauffante. Basalte poli noir, anneau or champagne. Chauffe en 60 secondes par induction USB-C.',
    descriptionLong:
      'Pierre est notre objet le plus tactile : un ovoïde de 9 cm taillé dans du basalte volcanique poli, anneau or champagne. Chauffe en 60 secondes (37-42°C contrôlé) sur dock à induction USB-C. Aucune électronique embarquée — la pierre est passive, le dock seul est connecté.',
    descriptionEditorial: `Pierre est l\'un des rares objets de la maison à n\'avoir aucune fonction « vibrante ». C\'est une pierre, simplement. Sa matière et son poids font tout.`,
    specs: {
      Matériau: 'Basalte volcanique poli',
      Dimensions: '9 cm × 6 cm × 4 cm',
      Poids: '210 g',
      Chauffe: '37-42°C contrôlé, 60 sec',
      Dock: 'Induction USB-C',
      Étanchéité: 'IPX8 (pierre seulement)',
      Garantie: '5 ans (dock 2 ans)',
    },
    features: [
      'Basalte poli volcanique',
      'Chauffe contrôlée 60 sec',
      'Dock induction USB-C',
      'Aucune électronique dans la pierre',
      'IPX8',
    ],
    priceCents: 8900,
    compareAtPriceCents: null,
    costCents: 1900,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('pierre', 'Pierre'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'couples',
    tags: ['pour-vous-deux', 'pour-lui', 'pour-elle', 'massage', 'basalte'],
    supplierId: null,
    supplierSku: 'CJ-AF-PIER-BAS',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 26,
    stockStatus: 'in_stock',
    lowStockThreshold: 6,
    seoTitle: 'Pierre — Pierre de massage chauffante basalte | Atelier Frisson',
    seoDescription:
      'Pierre : pierre de massage en basalte poli, chauffe contrôlée 37-42°C en 60 sec, dock induction USB-C.',
    seoKeywords: ['pierre massage chauffante', 'basalte massage couple', 'objet massage premium'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000008',
    slug: 'crescendo',
    name: 'Crescendo',
    nameShort: 'Crescendo',
    tagline: 'La progression, l\'intensité construite.',
    descriptionShort:
      'Wand multi-rythmes. Manche or champagne, tête en silicone mat ivoire à nervures sculpturales Art Déco.',
    descriptionLong:
      'Crescendo est notre wand long format : manche slim en métal brossé champagne (24 cm), tête sculptée en silicone mat ivoire avec nervures parallèles inspirées de l\'architecture Art Déco. Douze intensités progressives, sept rythmes signature, un mode « crescendo » qui monte automatiquement de 0 à 100 sur 7 minutes.',
    descriptionEditorial: `Crescendo est l\'objet le plus narratif de la maison. Son mode signature, baptisé « Bolero », joue sur la progression — comme la composition de Ravel, il commence à peine perceptible et prend toute la place à la fin.`,
    specs: {
      Matériau: 'Silicone médical à nervures + métal brossé',
      Dimensions: '24 cm × 4,5 cm (tête)',
      Poids: '290 g',
      Autonomie: '120 min',
      Recharge: 'USB-C magnétique, 120 min',
      Étanchéité: 'IPX7',
      Modes: '12 intensités × 7 rythmes + Bolero',
      Garantie: '2 ans',
    },
    features: [
      'Mode Bolero progressif 0-100 en 7 min',
      'Tête nervurée Art Déco',
      'Manche métal brossé champagne',
      'IPX7',
      'Garantie 2 ans',
    ],
    priceCents: 13900,
    compareAtPriceCents: null,
    costCents: 2900,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('crescendo', 'Crescendo'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_OBJETS,
    collection: 'elle',
    tags: ['pour-elle', 'pour-vous-deux', 'wand', 'art-deco', 'progression'],
    supplierId: null,
    supplierSku: 'CJ-AF-CRES-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 19,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Crescendo — Wand Bolero progressif | Atelier Frisson',
    seoDescription:
      'Crescendo : wand long format avec mode Bolero progressif 7 min. Nervures Art Déco, métal brossé champagne.',
    seoKeywords: ['wand long format', 'mode progressif', 'wand art déco premium'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },

  // ── LINGERIE — 5 ───────────────────────────────────────────────────────────
  {
    id: '02000000-0000-0000-0000-000000000009',
    slug: 'sillage',
    name: 'Sillage',
    nameShort: 'Sillage',
    tagline: 'Le drapé qui suit, jamais ne pèse.',
    descriptionShort:
      'Nuisette en soie 22 momme ivoire perle, coupe slip dress, bordure dentelle Calais champagne. Tailles XS-XL.',
    descriptionLong:
      'Sillage est notre nuisette signature : soie 22 momme tissée en Italie, ivoire perle, coupe slip dress mi-cuisse avec bretelles ajustables fines, bordure en dentelle Calais champagne sur le buste et l\'ourlet. Confection à Roubaix, France.',
    descriptionEditorial: `La soie 22 momme est la densité du linge de maison de luxe — pas la soie translucide des nuisettes bas de gamme. Sillage tient dans la main avec un poids juste, glisse sans glissade, dort dans le placard sans plier.`,
    specs: {
      Matériau: 'Soie 22 momme tissée Italie',
      Dentelle: 'Calais champagne, fait main',
      Tailles: 'XS / S / M / L / XL',
      Confection: 'Atelier Roubaix, France',
      Entretien: 'Lavage à la main, eau froide, séchage à plat',
      Inclus: 'Pochon de rangement satin',
    },
    features: [
      'Soie 22 momme Italie',
      'Dentelle Calais champagne',
      'Confection Roubaix',
      'Bretelles ajustables',
      'Pochon satin inclus',
    ],
    priceCents: 12900,
    compareAtPriceCents: null,
    costCents: 4200,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('sillage', 'Sillage'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_LINGERIE,
    collection: 'elle',
    tags: ['pour-elle', 'cadeaux', 'soie', 'lingerie', 'made-in-france'],
    supplierId: null,
    supplierSku: 'SHEW-AF-SILL-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 5,
    stockQuantity: 38,
    stockStatus: 'in_stock',
    lowStockThreshold: 8,
    seoTitle: 'Sillage — Nuisette soie 22 momme | Atelier Frisson',
    seoDescription:
      'Sillage : nuisette en soie 22 momme ivoire, dentelle Calais. Confection Roubaix. Tailles XS-XL.',
    seoKeywords: ['nuisette soie made in france', 'lingerie soie premium', 'nuisette dentelle Calais'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000010',
    slug: 'dentelle-noire',
    name: 'Dentelle Noire',
    nameShort: 'Dentelle Noire',
    tagline: 'L\'architecture du désir.',
    descriptionShort:
      'Body en dentelle Leavers noire, doublure soie noire, agrafes or champagne. Tailles XS-XL.',
    descriptionLong:
      'Dentelle Noire est notre body signature : dentelle Leavers (Caudry, France) sur l\'ensemble du corps, doublure invisible en soie noire, agrafes en métal or champagne sur le devant et l\'entrejambe. Coupe ajustée sans baleines, bretelles ajustables fines.',
    descriptionEditorial: `La dentelle Leavers de Caudry est inscrite au Patrimoine Vivant. Chaque mètre demande 16 heures de tissage sur métiers du XIXe. Dentelle Noire utilise un dessin floral exclusif retravaillé à partir des archives 1923 de la maison Sophie Hallette.`,
    specs: {
      Dentelle: 'Leavers Caudry, dessin exclusif 1923',
      Doublure: 'Soie noire',
      Agrafes: 'Métal or champagne',
      Tailles: 'XS / S / M / L / XL',
      Confection: 'Atelier Roubaix, France',
      Entretien: 'Lavage à la main, eau froide',
    },
    features: [
      'Dentelle Leavers Caudry',
      'Doublure soie',
      'Agrafes or champagne',
      'Confection Roubaix',
      'Coupe ajustée sans baleines',
    ],
    priceCents: 18900,
    compareAtPriceCents: null,
    costCents: 6800,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('dentelle-noire', 'Dentelle Noire'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_LINGERIE,
    collection: 'elle',
    tags: ['pour-elle', 'cadeaux', 'dentelle', 'caudry', 'haut-de-gamme', 'made-in-france'],
    supplierId: null,
    supplierSku: 'SHEW-AF-DENT-NOIR',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 5,
    stockQuantity: 21,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Dentelle Noire — Body dentelle Leavers Caudry | Atelier Frisson',
    seoDescription:
      'Dentelle Noire : body en dentelle Leavers Caudry, doublure soie. Confection Roubaix. Tailles XS-XL.',
    seoKeywords: ['body dentelle Caudry', 'lingerie dentelle leavers', 'body luxe made in france'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000011',
    slug: 'kimono',
    name: 'Kimono',
    nameShort: 'Kimono',
    tagline: 'Le geste du matin, la robe d\'écriture.',
    descriptionShort:
      'Robe kimono en soie sablée ivoire crème, ceinture nouée, bordure rouge laqué, monogramme AF brodé.',
    descriptionLong:
      'Kimono est notre robe d\'intérieur : soie sablée 19 momme ivoire crème, manches longues fluides, ceinture nouée à la taille, bordure piping rouge laqué, monogramme AF brodé en or champagne sur la poitrine. Confection à Roubaix.',
    descriptionEditorial: `Kimono est la robe qu\'on enfile pour le café du matin avant les autres vêtements, et qu\'on garde pour le verre du soir après les vêtements. Les jours sans, c\'est l\'unique vêtement de la journée.`,
    specs: {
      Matériau: 'Soie sablée 19 momme',
      Bordure: 'Piping oxblood',
      Monogramme: 'Broderie or champagne',
      Tailles: 'Taille unique (S à L), longueur ajustable',
      Confection: 'Atelier Roubaix, France',
      Entretien: 'Lavage à la main, eau froide',
    },
    features: [
      'Soie sablée 19 momme',
      'Piping oxblood',
      'Monogramme brodé or',
      'Confection Roubaix',
      'Taille unique',
    ],
    priceCents: 22900,
    compareAtPriceCents: null,
    costCents: 7400,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('kimono', 'Kimono'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_LINGERIE,
    collection: 'elle',
    tags: ['pour-elle', 'cadeaux', 'soie', 'robe', 'made-in-france', 'haut-de-gamme'],
    supplierId: null,
    supplierSku: 'SHEW-AF-KIMO-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 5,
    stockQuantity: 17,
    stockStatus: 'in_stock',
    lowStockThreshold: 4,
    seoTitle: 'Kimono — Robe soie sablée monogramme | Atelier Frisson',
    seoDescription:
      'Kimono : robe en soie sablée 19 momme, monogramme AF brodé or. Confection Roubaix. Taille unique.',
    seoKeywords: ['robe kimono soie', 'robe intérieur premium', 'robe monogramme'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000012',
    slug: 'jarretelles',
    name: 'Jarretelles',
    nameShort: 'Jarretelles',
    tagline: 'Le geste structurant, la couture du désir.',
    descriptionShort:
      'Set porte-jarretelles en satin ivoire, bandes structurées soie noire, accroches or champagne. Tailles 36-44.',
    descriptionLong:
      'Jarretelles est notre porte-jarretelles couture : satin ivoire 19 momme à l\'extérieur, bandes structurées en soie noire, quatre attaches en métal or champagne avec finition haute joaillerie. Coupe taille naturelle. Confection à Roubaix.',
    descriptionEditorial: `Le porte-jarretelles n\'est pas un objet de fonction — c\'est un objet de cérémonie. Jarretelles assume cette élégance, sans transparence vulgaire.`,
    specs: {
      Matériau: 'Satin 19 momme + soie noire',
      Attaches: 'Métal or champagne haute joaillerie',
      Tailles: '36 / 38 / 40 / 42 / 44',
      Confection: 'Atelier Roubaix, France',
      Entretien: 'Lavage à la main, eau froide',
    },
    features: [
      'Satin + soie noire',
      'Attaches or champagne',
      'Coupe taille naturelle',
      'Confection Roubaix',
    ],
    priceCents: 9900,
    compareAtPriceCents: null,
    costCents: 3300,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('jarretelles', 'Jarretelles'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_LINGERIE,
    collection: 'elle',
    tags: ['pour-elle', 'cadeaux', 'satin', 'jarretelles', 'made-in-france'],
    supplierId: null,
    supplierSku: 'SHEW-AF-JARR-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 5,
    stockQuantity: 24,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Jarretelles — Set porte-jarretelles satin couture | Atelier Frisson',
    seoDescription:
      'Jarretelles : set en satin ivoire et soie noire, attaches or champagne. Confection Roubaix. Tailles 36-44.',
    seoKeywords: ['porte-jarretelles couture', 'set satin made in france', 'jarretelles or champagne'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000013',
    slug: 'bas-couture',
    name: 'Bas Couture',
    nameShort: 'Bas Couture',
    tagline: 'La couture qui guide le regard, sans l\'imposer.',
    descriptionShort:
      'Bas autofixants 15 deniers noir mat, couture arrière, bande dentelle Calais champagne. Tailles 1-4.',
    descriptionLong:
      'Bas Couture sont nos bas autofixants : voile 15 deniers noir mat (pas brillant), couture arrière fine, bande dentelle Calais champagne en haut, bande silicone non-glissante. Fabrication Filodoro, Italie.',
    descriptionEditorial: `Le 15 deniers est la finesse à laquelle on voit le grain de peau. La couture arrière est tracée pour rappeler les bas couture des années 1950 — sans la fragilité.`,
    specs: {
      Matériau: 'Voile 15 deniers, polyamide / élasthanne',
      Bande: 'Dentelle Calais champagne',
      Tailles: '1 (XS) / 2 (S/M) / 3 (M/L) / 4 (L/XL)',
      Fabrication: 'Filodoro, Italie',
      Entretien: 'Lavage à la main, eau froide, ne pas tordre',
    },
    features: [
      'Voile 15 deniers mat',
      'Couture arrière',
      'Dentelle Calais',
      'Silicone non-glissant',
      'Fabrication Italie',
    ],
    priceCents: 3900,
    compareAtPriceCents: null,
    costCents: 1100,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('bas-couture', 'Bas Couture'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_LINGERIE,
    collection: 'elle',
    tags: ['pour-elle', 'cadeaux', 'bas', 'cousu-italie'],
    supplierId: null,
    supplierSku: 'SHEW-AF-BAS-NOIR',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 5,
    stockQuantity: 76,
    stockStatus: 'in_stock',
    lowStockThreshold: 12,
    seoTitle: 'Bas Couture — Bas autofixants 15 deniers couture | Atelier Frisson',
    seoDescription:
      'Bas Couture : bas 15 deniers noir mat, couture arrière, dentelle Calais champagne. Fabrication Italie.',
    seoKeywords: ['bas autofixants couture', 'bas 15 deniers noir', 'bas dentelle calais'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },

  // ── COSMÉTIQUE — 4 ─────────────────────────────────────────────────────────
  {
    id: '02000000-0000-0000-0000-000000000014',
    slug: 'source',
    name: 'Source',
    nameShort: 'Source',
    tagline: 'La transparence essentielle.',
    descriptionShort:
      'Lubrifiant intime à base d\'eau, formule courte 9 ingrédients, flacon verre dépoli ivoire 100 ml.',
    descriptionLong:
      'Source est notre lubrifiant : neuf ingrédients seulement, sans glycérine, sans paraben, sans parfum. pH 4,5 compatible flore intime, formulé en France avec une pharmacienne en officine. Compatible silicone médical, latex, polyuréthane.',
    descriptionEditorial: `La question initiale : « Que mettrait-on dans un soin pour la peau la plus délicate du corps ? ». Source est la réponse — neuf ingrédients, et le bon pH.`,
    specs: {
      Volume: '100 ml',
      Base: 'Eau',
      Ingrédients: '9 (sans glycérine, paraben, parfum)',
      Compatibilité: 'Silicone médical, latex, polyuréthane',
      pH: '4,5',
      Made: 'Formulé France',
      Conditionnement: 'Verre dépoli, pompe or champagne',
    },
    features: [
      'Base eau',
      'Formule courte 9 ingrédients',
      'pH 4,5 flore intime',
      'Made in France',
      'Compatible silicone',
    ],
    priceCents: 2400,
    compareAtPriceCents: null,
    costCents: 480,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('source', 'Source'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_COSMETIQUE,
    collection: 'couples',
    tags: ['pour-vous-deux', 'pour-elle', 'pour-lui', 'lubrifiant', 'eau', 'made-in-france', 'consommable'],
    supplierId: null,
    supplierSku: 'SPOC-AF-SOUR-LUB',
    supplierProductId: null,
    supplierWarehouse: 'EU',
    supplierShippingDays: 3,
    stockQuantity: 142,
    stockStatus: 'in_stock',
    lowStockThreshold: 25,
    seoTitle: 'Source — Lubrifiant intime base eau formule courte | Atelier Frisson',
    seoDescription:
      'Source : lubrifiant base eau, 9 ingrédients, pH 4,5, formulé France. Compatible silicone, latex, polyuréthane.',
    seoKeywords: ['lubrifiant eau français', 'lubrifiant formule courte', 'lubrifiant ph flore intime'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000015',
    slug: 'aurore',
    name: 'Aurore',
    nameShort: 'Aurore',
    tagline: 'La cire qui devient huile, la flamme qui devient toucher.',
    descriptionShort:
      'Bougie de massage en verre fumé ambre 200 ml, mèche bois, cire végétale, parfum vanille-musc.',
    descriptionLong:
      'Aurore est notre bougie de massage : cire 100% végétale (soja + colza), mèche bois qui crépite légèrement, parfum vanille-musc-bois de oud. Une fois fondue à 38°C, la cire devient huile de massage tiède. Verre soufflé en Bohême, étiquette letterpress cotton.',
    descriptionEditorial: `Aurore réunit deux objets en un : la bougie qu\'on allume pour la soirée, et l\'huile chaude qu\'on verse à la fin pour le rituel.`,
    specs: {
      Volume: '200 ml',
      Cire: '100% végétale (soja + colza)',
      Mèche: 'Bois qui crépite',
      Parfum: 'Vanille-musc-bois de oud',
      Brûlage: '40 heures',
      'Point de fusion': '38°C',
      Verre: 'Soufflé Bohême',
      Made: 'France',
    },
    features: [
      'Cire végétale',
      'Devient huile de massage à 38°C',
      'Mèche bois crépitant',
      'Verre soufflé Bohême',
      'Made in France',
    ],
    priceCents: 4200,
    compareAtPriceCents: null,
    costCents: 980,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('aurore', 'Aurore'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_COSMETIQUE,
    collection: 'couples',
    tags: ['pour-vous-deux', 'pour-lui', 'cadeaux', 'bougie', 'massage', 'made-in-france', 'consommable'],
    supplierId: null,
    supplierSku: 'SPOC-AF-AURO-VAN',
    supplierProductId: null,
    supplierWarehouse: 'EU',
    supplierShippingDays: 3,
    stockQuantity: 68,
    stockStatus: 'in_stock',
    lowStockThreshold: 15,
    seoTitle: 'Aurore — Bougie de massage cire végétale vanille-musc | Atelier Frisson',
    seoDescription:
      'Aurore : bougie de massage cire 100% végétale, mèche bois, vanille-musc-oud. Devient huile à 38°C. 40h de brûlage.',
    seoKeywords: ['bougie de massage made in france', 'bougie cire végétale couple', 'bougie vanille musc oud'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000016',
    slug: 'huile',
    name: 'Huile',
    nameShort: 'Huile',
    tagline: 'Le geste long, la peau qui boit.',
    descriptionShort:
      'Huile sensuelle pour le corps. Base jojoba + argan, parfum bois de oud + rose poudrée. Verre dépoli ambre 100 ml.',
    descriptionLong:
      'Huile est notre soin signature pour le corps : base jojoba bio + argan pressé à froid + huile de pépin de raisin, parfum exclusif bois de oud + rose poudrée + ambre blanc. Pipette en métal brossé champagne. Compatible peaux sensibles. Pas compatible silicone (utiliser Source pour les objets).',
    descriptionEditorial: `Huile a été développée avec un parfumeur grassois pour évoquer un climat — pas une fleur. Bois de oud chauffé, rose poudrée du matin, ambre blanc en arrière-plan. Le sillage tient 4 à 6 heures sur peau.`,
    specs: {
      Volume: '100 ml',
      Base: 'Jojoba bio + argan + pépin de raisin',
      Parfum: 'Bois de oud + rose + ambre blanc',
      Compatibilité: 'Peau (pas avec objets silicone)',
      Conditionnement: 'Verre dépoli ambre, pipette champagne',
      Made: 'France (parfumerie grassoise)',
    },
    features: [
      'Jojoba bio + argan + pépin de raisin',
      'Parfum exclusif Grasse',
      'Pipette métal brossé',
      'Made in France',
      'Sillage 4-6 h',
    ],
    priceCents: 6900,
    compareAtPriceCents: null,
    costCents: 1500,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('huile', 'Huile'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_COSMETIQUE,
    collection: 'couples',
    tags: ['pour-vous-deux', 'pour-elle', 'pour-lui', 'cadeaux', 'huile', 'massage', 'consommable'],
    supplierId: null,
    supplierSku: 'SPOC-AF-HUIL-OUD',
    supplierProductId: null,
    supplierWarehouse: 'EU',
    supplierShippingDays: 3,
    stockQuantity: 53,
    stockStatus: 'in_stock',
    lowStockThreshold: 10,
    seoTitle: 'Huile — Huile corps oud + rose Grasse | Atelier Frisson',
    seoDescription:
      'Huile : base jojoba + argan, parfum bois de oud + rose + ambre blanc. Parfumerie grassoise. 100 ml.',
    seoKeywords: ['huile sensuelle made in france', 'huile corps oud rose', 'huile jojoba argan'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000017',
    slug: 'bain-rituel',
    name: 'Bain Rituel',
    nameShort: 'Bain Rituel',
    tagline: 'Deux temps, deux ambiances, un même rituel.',
    descriptionShort:
      'Sels de bain duo. Flacon « jour » rose pâle (rose + bergamote), flacon « nuit » ambre profond (musc + cèdre). 2 × 250 ml.',
    descriptionLong:
      'Bain Rituel est un duo de sels : un flacon « jour » à la rose poudrée et bergamote (énergisant doux), un flacon « nuit » au musc et cèdre fumé (relaxant profond). Sels de la mer Morte + huiles essentielles bio. Verre dépoli, bouchons or champagne.',
    descriptionEditorial: `Le bain n\'est pas le même selon l\'heure. Bain Rituel encode cette idée — deux flacons, deux compositions, deux moments.`,
    specs: {
      Volume: '2 × 250 g',
      Sels: 'Mer Morte',
      'Huiles essentielles': 'Bio (rose, bergamote, musc, cèdre)',
      Conditionnement: 'Verre dépoli, bouchons or champagne',
      Made: 'France',
      Doses: '~10 bains chacun',
    },
    features: [
      'Sels de la mer Morte',
      'Huiles essentielles bio',
      'Duo jour + nuit',
      'Verre dépoli',
      'Made in France',
    ],
    priceCents: 4900,
    compareAtPriceCents: null,
    costCents: 1100,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('bain-rituel', 'Bain Rituel'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_COSMETIQUE,
    collection: 'elle',
    tags: ['pour-elle', 'cadeaux', 'bain', 'sels', 'consommable', 'made-in-france'],
    supplierId: null,
    supplierSku: 'SPOC-AF-BAIN-DUO',
    supplierProductId: null,
    supplierWarehouse: 'EU',
    supplierShippingDays: 3,
    stockQuantity: 41,
    stockStatus: 'in_stock',
    lowStockThreshold: 8,
    seoTitle: 'Bain Rituel — Duo sels mer Morte huiles essentielles | Atelier Frisson',
    seoDescription:
      'Bain Rituel : duo de sels mer Morte, huiles bio rose-bergamote (jour) + musc-cèdre (nuit). 2 × 250 g.',
    seoKeywords: ['sels de bain duo', 'sels mer morte huiles essentielles', 'bain rituel made in france'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },

  // ── ACCESSOIRES — 3 ────────────────────────────────────────────────────────
  {
    id: '02000000-0000-0000-0000-000000000018',
    slug: 'bandeau',
    name: 'Bandeau',
    nameShort: 'Bandeau',
    tagline: 'La privation choisie, l\'écoute amplifiée.',
    descriptionShort:
      'Bandeau de soie satin ivoire, doublure soie noire, attaches velours noir. Confection Roubaix.',
    descriptionLong:
      'Bandeau est notre masque : soie satin 22 momme ivoire crème en façade, doublure soie noire, attaches plates en velours noir. Coupe enveloppante anti-lumière. Confection à Roubaix. Étui de rangement satin inclus.',
    descriptionEditorial: `Bandeau n\'est pas un accessoire de chambre — c\'est aussi un masque de sieste, un masque d\'avion. La discrétion totale tient à ses attaches plates qui ne marquent pas le visage.`,
    specs: {
      Matériau: 'Soie 22 momme + velours noir',
      Coupe: 'Anti-lumière',
      Confection: 'Atelier Roubaix, France',
      Inclus: 'Étui satin',
      Entretien: 'Lavage à la main, eau froide',
    },
    features: [
      'Soie 22 momme',
      'Doublure soie noire',
      'Attaches velours plates',
      'Anti-lumière',
      'Confection Roubaix',
    ],
    priceCents: 4900,
    compareAtPriceCents: null,
    costCents: 1300,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('bandeau', 'Bandeau'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_ACCESSOIRES,
    collection: 'couples',
    tags: ['pour-vous-deux', 'pour-elle', 'pour-lui', 'cadeaux', 'soie', 'voyage', 'made-in-france'],
    supplierId: null,
    supplierSku: 'CJ-AF-BAND-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 56,
    stockStatus: 'in_stock',
    lowStockThreshold: 10,
    seoTitle: 'Bandeau — Masque soie 22 momme velours | Atelier Frisson',
    seoDescription:
      'Bandeau : masque en soie 22 momme ivoire, doublure soie noire, attaches velours. Confection Roubaix.',
    seoKeywords: ['bandeau soie premium', 'masque soie made in france', 'masque velours intime'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000019',
    slug: 'plume',
    name: 'Plume',
    nameShort: 'Plume',
    tagline: 'Le toucher qui n\'en est pas un.',
    descriptionShort:
      'Plume de caresse en autruche teintée oxblood, manche ébène, virole or champagne. 25 cm.',
    descriptionLong:
      'Plume est notre objet le plus minimaliste : une plume d\'autruche entière teintée à la main en oxblood profond, fixée à un manche en ébène poli par une virole en métal brossé champagne. Objet artisanal, chaque pièce est unique (légère variation de longueur de barbes).',
    descriptionEditorial: `Plume n\'a aucune fonction au-delà du toucher. C\'est sa qualité.`,
    specs: {
      Plume: 'Autruche teintée à la main',
      Manche: 'Ébène poli',
      Virole: 'Métal brossé champagne',
      Dimensions: '25 cm',
      Confection: 'Artisan plumassier France',
    },
    features: [
      'Plume autruche teinte main',
      'Manche ébène',
      'Virole champagne',
      'Pièce artisanale unique',
    ],
    priceCents: 3900,
    compareAtPriceCents: null,
    costCents: 1100,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('plume', 'Plume'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_ACCESSOIRES,
    collection: 'couples',
    tags: ['pour-vous-deux', 'cadeaux', 'plume', 'artisanal', 'made-in-france'],
    supplierId: null,
    supplierSku: 'CJ-AF-PLUM-OXB',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 32,
    stockStatus: 'in_stock',
    lowStockThreshold: 6,
    seoTitle: 'Plume — Plume de caresse autruche oxblood | Atelier Frisson',
    seoDescription:
      'Plume : plume d\'autruche teintée oxblood, manche ébène, virole champagne. Pièce artisanale. 25 cm.',
    seoKeywords: ['plume caresse premium', 'plume autruche manche ébène', 'objet artisanal couple'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000020',
    slug: 'coffret-rituel',
    name: 'Coffret Rituel',
    nameShort: 'Coffret Rituel',
    tagline: 'Le rituel offert, prêt à célébrer.',
    descriptionShort:
      'Coffret cadeau Saint-Valentin / anniversaire. 1 bougie Aurore + 1 huile + 1 plume + 1 carte. Boîte écrin signée.',
    descriptionLong:
      'Coffret Rituel est notre cadeau prêt-à-offrir : une bougie de massage Aurore, un flacon d\'huile sensuelle Huile, une plume de caresse, une carte cotton letterpress avec message à compléter. Le tout dans une boîte écrin ivoire avec ruban oxblood, embossage AF or champagne, sceau cire à la main.',
    descriptionEditorial: `Coffret Rituel a été pensé pour le moment où on veut offrir le geste lui-même, pas un produit. Le sceau cire est apposé à la main par notre atelier — il se brise à l\'ouverture, il signe le don.`,
    specs: {
      Contenu: '1 bougie Aurore (200 ml) + 1 huile Huile (100 ml) + 1 plume + 1 carte',
      Boîte: 'Écrin ivoire 30 cm × 22 cm × 8 cm, ruban oxblood, sceau cire',
      'Carte personnalisable': 'Oui (message ajouté au checkout)',
      Made: 'France (assemblage atelier Roubaix)',
    },
    features: [
      'Bougie + huile + plume + carte',
      'Boîte écrin signée à la main',
      'Sceau cire',
      'Carte personnalisable',
      'Économisez 25 € vs séparément',
    ],
    priceCents: 11900,
    compareAtPriceCents: 14400,
    costCents: 3100,
    currency: 'EUR',
    taxRate: '20.00',
    images: fiveViews('coffret-rituel', 'Coffret Rituel'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: CAT_ACCESSOIRES,
    collection: 'cadeaux',
    tags: ['cadeaux', 'saint-valentin', 'anniversaire', 'pour-vous-deux', 'pret-a-offrir', 'best-seller'],
    supplierId: null,
    supplierSku: 'AF-COFF-RITUEL',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 18,
    stockStatus: 'in_stock',
    lowStockThreshold: 4,
    seoTitle: 'Coffret Rituel — Cadeau Saint-Valentin / anniversaire | Atelier Frisson',
    seoDescription:
      'Coffret Rituel : bougie + huile + plume + carte. Boîte écrin signée à la main, sceau cire. Économisez 25 €.',
    seoKeywords: ['coffret cadeau couple', 'cadeau saint-valentin premium', 'coffret rituel anniversaire'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — accès filtré + audience
// ─────────────────────────────────────────────────────────────────────────────

/** Toutes les catégories actives. */
export function getMockCategories(): readonly Category[] {
  return MOCK_CATEGORIES.filter((c) => c.isActive);
}

/** Tous les produits (status active uniquement). */
export function getMockProducts(): readonly Product[] {
  return MOCK_PRODUCTS.filter((p) => p.status === 'active');
}

/** Produits mis en avant (`isFeatured: true`). */
export function getMockFeaturedProducts(limit?: number): readonly Product[] {
  const list = MOCK_PRODUCTS.filter((p) => p.status === 'active' && p.isFeatured);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

/** Recherche d'un produit par slug. */
export function findMockProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

/** Alias rétro-compatible pour le code existant qui utilisait `getMockProductBySlug`. */
export function getMockProductBySlug(slug: string): Product | undefined {
  return findMockProductBySlug(slug);
}

/** Type d'audience pour les pages collection pivot V2. */
export type AudienceCollection = 'couples' | 'elle' | 'lui' | 'cadeaux';

/**
 * Retourne les produits qui « appartiennent » à une audience —
 * via la `collection` primaire OU via la présence du tag correspondant.
 *
 * Pour les pages collection pivot (`/collections/elle`, etc.) on veut
 * inclure les produits cross-listés (ex : Pierre est primary couples
 * mais aussi tagué `pour-lui`).
 */
export function getMockProductsByAudience(
  audience: AudienceCollection,
  options: { limit?: number; featuredFirst?: boolean } = {},
): readonly Product[] {
  const tagMap: Record<AudienceCollection, string> = {
    couples: 'pour-vous-deux',
    elle: 'pour-elle',
    lui: 'pour-lui',
    cadeaux: 'cadeaux',
  };
  const tag = tagMap[audience];

  let list = MOCK_PRODUCTS.filter(
    (p) => p.status === 'active' && (p.collection === audience || p.tags.includes(tag)),
  );

  if (options.featuredFirst) {
    list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
  if (options.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

/** Produits par tag (filtres saisonniers, thématiques). */
export function getMockProductsByTag(tag: string): readonly Product[] {
  return MOCK_PRODUCTS.filter((p) => p.status === 'active' && p.tags.includes(tag));
}

/**
 * Cross-sell : 4 produits suggérés à partir d'un slug source.
 * Stratégie : même catégorie (priorité 1), puis même audience (priorité 2),
 * exclu le produit source.
 */
export function getMockCrossSell(sourceSlug: string, count = 4): readonly Product[] {
  const source = findMockProductBySlug(sourceSlug);
  if (!source) return getMockFeaturedProducts().slice(0, count);

  const sameCategory = MOCK_PRODUCTS.filter(
    (p) => p.status === 'active' && p.slug !== sourceSlug && p.categoryId === source.categoryId,
  );
  const sameAudience = MOCK_PRODUCTS.filter(
    (p) =>
      p.status === 'active' &&
      p.slug !== sourceSlug &&
      p.categoryId !== source.categoryId &&
      (p.collection === source.collection ||
        p.tags.some((t) => source.tags.includes(t) && t.startsWith('pour-'))),
  );

  return [...sameCategory, ...sameAudience].slice(0, count);
}
