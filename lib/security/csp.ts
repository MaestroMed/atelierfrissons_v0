/**
 * Content Security Policy (CSP) Atelier Frisson.
 *
 * Voir CLAUDE.md §8 (4 couches sécurité).
 *
 * Principes :
 *   - script-src : 'self' + nonce + 'unsafe-inline' (fallback). Pas de
 *     `strict-dynamic` car notre middleware ne peut pas propager le nonce
 *     à Next.js via `NextResponse.next({ request: { headers } })` sans
 *     casser la propagation des Set-Cookie des route handlers en aval
 *     (bug reproductible en Next 16 — cf. fix age-gate, Sprint 1).
 *     Les navigateurs CSP3 (Chrome/Safari/Firefox récents) ignorent
 *     `'unsafe-inline'` dès qu'un nonce est présent — donc le fallback
 *     ne s'applique qu'aux très vieux navigateurs.
 *   - style-src  : 'self' + 'unsafe-inline' (Tailwind v4 JIT styles inline)
 *   - img-src    : Mux + Supabase + AF domains + data/blob
 *   - connect-src: Supabase, Mux, Klaviyo, PostHog, Sentry, Vercel
 *   - frame-src  : lecteur Mux uniquement
 *   - frame-ancestors 'none' + form-action 'self' : anti-clickjacking
 *
 * Sprint 7+ : migration `middleware.ts` → `proxy.ts` pour rétablir
 * `strict-dynamic` proprement via request headers.
 */

export function generateNonce(): string {
  // Web Crypto API — disponible côté Edge runtime Next.js.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(nonce: string): string {
  const isProd = process.env.NODE_ENV === 'production';

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'unsafe-inline'", // fallback vieux navigateurs — ignoré si nonce support
      // `'unsafe-eval'` requis en dev pour React Fast Refresh / Turbopack
      ...(isProd ? [] : ["'unsafe-eval'"]),
    ],
    'script-src-elem': ["'self'", `'nonce-${nonce}'`, "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'style-src-elem': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://image.mux.com',
      'https://stream.mux.com',
      'https://*.supabase.co',
      'https://*.supabase.in',
      'https://atelierfrisson.fr',
      'https://atelierfrisson.com',
    ],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'media-src': ["'self'", 'blob:', 'https://stream.mux.com', 'https://image.mux.com'],
    'connect-src': [
      "'self'",
      'https://*.supabase.co',
      'https://*.supabase.in',
      'wss://*.supabase.co',
      'https://*.mux.com',
      'https://api.klaviyo.com',
      'https://a.klaviyo.com',
      'https://eu.posthog.com',
      'https://*.ingest.sentry.io',
      'https://*.ingest.eu.sentry.io',
      'https://vitals.vercel-insights.com',
      'https://vercel.live',
      // En dev, autoriser le Hot Reload (localhost WebSocket)
      ...(isProd ? [] : ['ws://localhost:*', 'http://localhost:*']),
    ],
    'frame-src': ["'self'", 'https://player.mux.com'],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
  };

  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`);
  if (isProd) {
    parts.push('upgrade-insecure-requests');
  }

  return parts.join('; ');
}
