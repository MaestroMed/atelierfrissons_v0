/**
 * Content Security Policy (CSP) Atelier Frisson — nonce-based + strict-dynamic.
 *
 * Voir CLAUDE.md §8 (4 couches sécurité).
 *
 * Principes :
 *   - script-src : 'self' + nonce + `strict-dynamic`. Le `proxy.ts` racine
 *     propage le nonce à Next.js via `x-nonce` request header — Next.js
 *     inject automatiquement le nonce sur ses scripts inline SSR, et
 *     `strict-dynamic` permet à ces scripts nonced de charger d'autres
 *     scripts dynamiquement (chunks RSC, etc.).
 *   - style-src  : 'self' + 'unsafe-inline' (Tailwind v4 JIT styles inline).
 *   - img-src    : Mux + Supabase + AF domains + data/blob
 *   - connect-src: Supabase, Mux, Klaviyo, PostHog, Sentry, Vercel
 *   - frame-src  : lecteur Mux uniquement
 *   - frame-ancestors 'none' + form-action 'self' : anti-clickjacking
 *
 * `'unsafe-inline'` sur script-src conservé comme fallback pour les vieux
 * navigateurs CSP2 (rare — ignoré par tous les navigateurs CSP3 qui
 * privilégient le nonce + strict-dynamic).
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
      "'strict-dynamic'",
      "'unsafe-inline'", // fallback CSP2 — ignoré par les navigateurs CSP3 (nonce win)
      // `'unsafe-eval'` requis en dev pour React Fast Refresh / Turbopack
      ...(isProd ? [] : ["'unsafe-eval'"]),
    ],
    'script-src-elem': ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "'unsafe-inline'"],
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
      // CDN Higgsfield (visuels nano_banana_2 + thumbnails seedance_2_0)
      // — phase transitoire avant migration Supabase Storage / Mux (Sprint 7).
      'https://*.cloudfront.net',
      'https://cdn.higgsfield.ai',
    ],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'media-src': [
      "'self'",
      'blob:',
      'https://stream.mux.com',
      'https://image.mux.com',
      // Vidéos Higgsfield (seedance_2_0 MP4) — phase transitoire avant Mux.
      'https://*.cloudfront.net',
      'https://cdn.higgsfield.ai',
    ],
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
