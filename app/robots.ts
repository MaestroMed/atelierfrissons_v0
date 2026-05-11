import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr';

/**
 * robots.txt généré par Next.js sur /robots.txt.
 *
 * Bloque :
 *  - Espaces sensibles (api, admin, compte, auth, checkout, panier, recherche)
 *  - User-agents IA (GPTBot, CCBot, ClaudeBot) — pour empêcher l'entraînement
 *    sur notre contenu sans consentement. Robots.txt n'est pas légalement
 *    contraignant mais c'est l'industry signal standard.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/compte/',
          '/auth/',
          '/checkout/',
          '/panier',
          '/recherche',
          '/_next/',
          '/*.json$',
        ],
      },
      // Bloquer crawlers IA (CLAUDE.md §10 + .claude/rules/seo.md)
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'PerplexityBot', disallow: '/' },
      // Pinterest crawler — autorisé partout (sauf espaces sensibles via wildcard)
      {
        userAgent: 'Pinterestbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/compte/', '/auth/', '/checkout/'],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-images.xml`],
    host: SITE_URL,
  };
}
