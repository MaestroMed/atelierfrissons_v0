/**
 * Content Security Policy (CSP) Atelier Frisson — nonce-based.
 *
 * Voir CLAUDE.md §8 (4 couches sécurité).
 *
 * Principes :
 *   - script-src : 'self' + nonce + strict-dynamic (Next.js injecte le nonce
 *     automatiquement sur ses scripts inline, et strict-dynamic propage la
 *     confiance aux modules chargés dynamiquement)
 *   - style-src  : 'self' + 'unsafe-inline' (Tailwind v4 + shadcn utilisent
 *     des styles inline via JIT ; nonce-based ne fonctionne pas bien ici)
 *   - img-src    : sources d'images (Mux, Supabase, AF, data/blob)
 *   - connect-src: APIs autorisées (Supabase, Mux, Klaviyo, PostHog, Sentry)
 *   - frame-src  : lecteur Mux uniquement (pas d'iframe externe arbitraire)
 *   - frame-ancestors 'none' + form-action 'self' : anti-clickjacking
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
      // `'unsafe-eval'` requis en dev pour React Fast Refresh / Turbopack
      ...(isProd ? [] : ["'unsafe-eval'"]),
    ],
    'script-src-elem': ["'self'", `'nonce-${nonce}'`],
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
