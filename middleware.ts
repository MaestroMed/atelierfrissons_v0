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
 * Middleware racine Atelier Frisson.
 *
 * Responsabilités (ordre d'exécution) :
 *  1. Rate-limit sur routes sensibles (auth 5/min, forge 10/h, api 100/min)
 *  2. Génère un nonce CSP et compose la politique
 *  3. Injecte `x-nonce` dans les headers de requête (Next.js le lit pour
 *     injecter automatiquement le nonce sur ses scripts inline SSR)
 *  4. Rafraîchit la session Supabase (getUser() valide le JWT)
 *  5. Attache les headers sécurité à la réponse (CSP, HSTS, XFO, Referrer)
 *
 * Les headers statiques sont aussi dans next.config.ts (defense in depth).
 * Ici on ajoute ce qui est dynamique (nonce différent à chaque requête).
 */

export async function middleware(request: NextRequest) {
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

  // ── 2. CSP nonce + rafraîchit session Supabase ──────────────────────
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // ⚠️ Important : on utilise `NextResponse.next()` SANS l'option
  // `request: { headers }` (qui était utilisée pour propager `x-nonce` en
  // upstream). En Next 16, cette option semble interférer avec les
  // Set-Cookie émis par les route handlers / server actions en aval
  // (le proxy crée un nouveau response qui n'hérite pas correctement des
  // cookies de l'inner response). On accepte de perdre l'auto-injection du
  // nonce sur les scripts inline Next pour l'instant — sera réglé en
  // Sprint 7 (migration `middleware.ts` → `proxy.ts` + audit nonce).
  let response = NextResponse.next();

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
          response = NextResponse.next();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    // Critique : getUser() valide le JWT et déclenche le refresh token si expiré.
    await supabase.auth.getUser();
  }

  // ── 3. Security headers sur la réponse ──────────────────────────────
  // Important : n'utilise JAMAIS `response.cookies.set/delete` ici sans raison
  // — cela interfère avec les Set-Cookie émis par les route handlers en aval.
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
