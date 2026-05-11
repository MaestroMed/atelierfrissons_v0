import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Health check — `/api/health`
 *
 * À appeler par les uptime monitors (Better Stack, UptimeRobot…).
 * Retourne 200 + JSON status si tout est sain, 503 si une dépendance est down.
 *
 * Vérifications :
 *   - Process up (toujours OK si la route répond)
 *   - DATABASE_URL configuré (présence env var)
 *   - Optionnel : ping DB SELECT 1 (ajouté quand Drizzle live)
 *   - Optionnel : ping Redis (Upstash)
 */
export async function GET() {
  const start = Date.now();
  const checks: Record<string, { ok: boolean; latencyMs?: number; note?: string }> = {};

  // ── Process ────────────────────────────────────────────────────────
  checks['process'] = { ok: true };

  // ── Env critiques ─────────────────────────────────────────────────
  checks['env'] = {
    ok:
      !!process.env['NEXT_PUBLIC_APP_URL'] &&
      // En prod, on exige aussi DATABASE_URL
      (process.env['NODE_ENV'] !== 'production' || !!process.env['DATABASE_URL']),
    note: 'Vérification présence env vars critiques',
  };

  // ── DB (TODO : ping SELECT 1 quand Drizzle live) ────────────────────
  checks['database'] = process.env['DATABASE_URL']
    ? { ok: true, note: 'Configured (ping non-implémenté)' }
    : { ok: process.env['NODE_ENV'] !== 'production', note: 'Not configured (dev OK)' };

  // ── Redis Upstash (TODO : ping PING quand live) ────────────────────
  checks['redis'] = process.env['UPSTASH_REDIS_REST_URL']
    ? { ok: true, note: 'Configured' }
    : { ok: process.env['NODE_ENV'] !== 'production', note: 'Not configured (dev OK)' };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - start,
      version: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA']?.slice(0, 7) ?? 'local',
      environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? process.env['NODE_ENV'] ?? 'unknown',
      checks,
    },
    {
      status: allOk ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
