import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Route Handler d'ingestion FORJA (Numelite pSEO factory).
 *
 * Voir `docs/FORGE_WORKFLOW.md` §2.2.
 *
 * Flow :
 *   1. Valide la signature HMAC-SHA256 du body avec `FORGE_INGEST_SECRET`
 *      (header `x-forge-signature`). Temps constant via `timingSafeEqual`.
 *   2. Parse + valide le payload (array de pages, max 50 par batch).
 *   3. UPSERT batch dans `forge_pages` avec `status='pending_review'`.
 *   4. Returns `{ ingested, skipped, errors }`.
 *
 * Rate limit : géré dans `proxy.ts` à 10 req/h (cf. `lib/security/rate-limit.ts`).
 * Sécurité : aucune page n'est auto-publiée — validation humaine obligatoire
 * via `/admin/forge` (cf. CLAUDE.md §5.1 RLS forge_pages).
 */

export const runtime = 'nodejs'; // HMAC via node:crypto (pas Web Crypto)
export const dynamic = 'force-dynamic';

const forgePageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  template: z.enum(['livraison_ville', 'conseil_longtail', 'guide_specialise', 'produit_contexte']),
  title: z.string().min(10).max(80),
  metaDescription: z.string().min(50).max(160),
  content: z.string().min(500),
  contentData: z.record(z.string(), z.unknown()).optional(),
  h1: z.string().min(10).max(100),
  keywords: z.array(z.string()).max(20).default([]),
  canonicalUrl: z.string().url().optional(),
  schemaOrgData: z.record(z.string(), z.unknown()).optional(),
  qualityScore: z.number().int().min(0).max(100),
});

const bodySchema = z.object({
  pages: z.array(forgePageSchema).min(1).max(50),
});

export async function POST(request: Request) {
  // ── 1. Validation signature HMAC ──────────────────────────────────
  const secret = process.env.FORGE_INGEST_SECRET;
  if (!secret) {
    // Dev sans secret : on accepte mais on loggue (ne JAMAIS laisser ça en prod)
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'FORGE_INGEST_SECRET not configured on server' },
        { status: 500 },
      );
    }
    console.warn(
      '[api/forge/ingest] FORGE_INGEST_SECRET absent — signature bypass en dev uniquement.',
    );
  }

  const providedSig = request.headers.get('x-forge-signature') ?? '';
  const rawBody = await request.text();

  if (secret) {
    const expectedSig = createHmac('sha256', secret).update(rawBody).digest('hex');
    const provided = Buffer.from(providedSig, 'utf8');
    const expected = Buffer.from(expectedSig, 'utf8');
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  // ── 2. Parse + valide le payload ──────────────────────────────────
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const pages = parsed.data.pages;

  // ── 3. Upsert dans forge_pages ────────────────────────────────────
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.info(`[api/forge/ingest] received ${pages.length} pages (DB not configured — dry run)`);
    return NextResponse.json({
      ingested: 0,
      skipped: pages.length,
      errors: [],
      mode: 'dry-run',
      message: "Supabase non configuré — payload validé, rien n'a été persisté.",
    });
  }

  const admin = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const rows = pages.map((p) => ({
    slug: p.slug,
    template: p.template,
    title: p.title,
    meta_description: p.metaDescription,
    content: p.content,
    content_data: p.contentData ?? null,
    h1: p.h1,
    keywords: p.keywords,
    canonical_url: p.canonicalUrl ?? null,
    schema_org_data: p.schemaOrgData ?? null,
    quality_score: p.qualityScore,
    human_reviewed: false,
    status: p.qualityScore >= 70 ? 'pending_review' : 'draft',
    generated_at: now,
    updated_at: now,
  }));

  const { data, error } = await admin
    .from('forge_pages')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id, slug, status');

  if (error) {
    console.error('[api/forge/ingest] upsert failed:', error);
    return NextResponse.json(
      { error: 'Database insertion failed', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ingested: data?.length ?? 0,
    skipped: 0,
    errors: [],
    pages: data?.map((p) => ({ id: p.id, slug: p.slug, status: p.status })) ?? [],
  });
}
