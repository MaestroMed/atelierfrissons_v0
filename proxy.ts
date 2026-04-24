import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { buildCsp, generateNonce } from '@/lib/security/csp';
import {
  applyRateLimit,
  getApiRateLimit,
  getAuthRateLimit,
  getClientIp,
  getForgeIngestRateLimit,
} from '@/lib/security/rate-limit';

/**
 * Proxy racine Atelier Frisson (Next.js 16 convention, ex-`middleware.ts`).
 *
 * Responsabilités (ordre d'exécution) :
 *  1. Rate-limit sur routes sensibles (auth 5/min, forge 10/h, api 100/min)
 *  2. Génère un nonce CSP et compose la politique
 *  3. Injecte `x-nonce` dans les headers de requête via
 *     `NextResponse.next({ request: { headers: requestHeaders } })` — Next.js
 *     lit ce header pour ajouter automatiquement l'attribut `nonce` sur ses
 *     scripts inline SSR, ce qui active `strict-dynamic` côté navigateur.
 *  4. Rafraîchit la session Supabase (getUser() valide le JWT)
 *  5. Attache les headers sécurité à la réponse (CSP, HSTS, XFO, Referrer,
 *     Permissions-Policy)
 *
 * Les headers statiques sont aussi dans `next.config.ts` (defense in depth) —
 * ici on ajoute uniquement ce qui est dynamique (nonce différent par requête).
 *
 * Sprint 1-7 historique : nous avions dû retirer `{ request: { headers } }`
 * et `'strict-dynamic'` suite à un bug suspecté de Set-Cookie propagation.
 * Root cause identifiée par la suite (client/server RSC boundary — cf. fix
 * age-gate Sprint 1). Ces optimisations sont maintenant restaurées.
 */

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Rate limit — routes sensibles ────────────────────────────────
  const ip = getClientIp(request.headers);

  if (pathname.startsWith('/api/auth/')) {
    const result = await applyRateLimit(getAuthRateLimit(), ip);
    if (!result.success) return tooManyRequests(result);
  } else if (pathname === '/api/forge/ingest') {
    const result = await applyRateLimit(getForgeIngestRateLimit(), ip);
    if (!result.success) return tooManyRequests(result);
  } else if (pathname.startsWith('/api/')) {
    const result = await applyRateLimit(getApiRateLimit(), ip);
    if (!result.success) return tooManyRequests(result);
  }

  // ── 2. CSP nonce — propagation vers les scripts inline SSR de Next ──
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // ── 3. Rafraîchit la session Supabase ───────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseAnon) {
    const supabase = createServerClient(supabaseUrl, supabaseAnon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    // Critique : getUser() valide le JWT et déclenche le refresh si expiré.
    // Ne pas remplacer par getSession() (qui ne valide pas la signature).
    await supabase.auth.getUser();
  }

  // ── 4. Security headers sur la réponse sortante ─────────────────────
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()',
  );

  return response;
}

function tooManyRequests(result: { limit: number; remaining: number; reset: number }) {
  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: 'Trop de requêtes. Réessayez dans quelques instants.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    },
  );
}

export const config = {
  // Exclut les assets statiques Next.js et les fichiers avec extension.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*$).*)',
  ],
};
