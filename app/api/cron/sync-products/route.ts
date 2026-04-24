import { NextResponse } from 'next/server';

/**
 * Route cron — sync nocturne des produits depuis CJdropshipping.
 *
 * À invoquer via Vercel Cron (`vercel.json` ou Vercel dashboard) :
 *   `0 3 * * *` (chaque jour à 3h UTC, pour éviter les heures de pointe).
 *
 * Sécurité : vérifie le header `authorization: Bearer <CRON_SECRET>`.
 * Vercel Cron l'envoie automatiquement.
 *
 * Flow (Sprint 6+ quand CJ B2B configuré) :
 *   1. `GET /api/v2/products/list` sur CJ pour chaque supplier_sku en DB
 *   2. Comparer stock + prix. Update si diff.
 *   3. Si un produit disparait du catalogue CJ → mark out_of_stock.
 *   4. Log résultat dans `audit_log` (actor_type='system').
 *
 * En l'état (Sprint 8-) : stub qui loggue et renvoie 200.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // ── Vérification cron secret ──────────────────────────────────────
  const authHeader = request.headers.get('authorization') ?? '';
  const expected = process.env.CRON_SECRET ?? '';
  if (!expected) {
    console.warn('[cron/sync-products] CRON_SECRET absent — bypass (dev only)');
  } else if (authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cjEmail = process.env.CJ_API_EMAIL;
  const cjKey = process.env.CJ_API_KEY;

  if (!cjEmail || !cjKey) {
    console.info(
      '[cron/sync-products] CJ credentials absents — skip (Sprint 8+ : configurer CJ B2B).',
    );
    return NextResponse.json({
      ok: true,
      mode: 'skip',
      reason: 'CJ credentials not configured',
      timestamp: new Date().toISOString(),
    });
  }

  // TODO Sprint 8 : branche CJ API réelle.
  // const { token } = await cjAuth(cjEmail, cjKey);
  // const products = await cjListProducts(token, { warehouseCode: 'CJPL' });
  // for each : upsert stock + prix, log deltas.

  console.info('[cron/sync-products] stub — CJ sync à implémenter Sprint 8');

  return NextResponse.json({
    ok: true,
    mode: 'stub',
    message: 'CJ sync endpoint ready, awaiting Sprint 8 implementation',
    timestamp: new Date().toISOString(),
  });
}
