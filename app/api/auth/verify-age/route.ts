import { NextResponse } from 'next/server';
import { AGE_GATE_COOKIE, AGE_GATE_MAX_AGE_SECONDS } from '@/lib/auth/age-gate';

/**
 * Route Handler Arcom — pose le cookie `af_age_verified` via un header
 * `Set-Cookie` HTTP brut (bypass les API Next.js cookies qui ont des
 * comportements imprévisibles en Next 16 + proxy).
 *
 * Le client fera ensuite `window.location.reload()` pour déclencher un
 * GET complet qui portera le cookie.
 */
export async function POST() {
  const isProd = process.env.NODE_ENV === 'production';
  const setCookie = [
    `${AGE_GATE_COOKIE}=1`,
    'Path=/',
    `Max-Age=${AGE_GATE_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': setCookie,
      'Cache-Control': 'no-store',
    },
  });
}
