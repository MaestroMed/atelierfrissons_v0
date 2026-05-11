import type { MetadataRoute } from 'next';
import { getMockProducts } from '@/lib/mock/products';
import { getMockBundles } from '@/lib/mock/bundles';
import { getMockArticles, MOCK_GUIDES } from '@/lib/mock/articles';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr';

/**
 * Sitemap dynamique — Next.js le sert sur /sitemap.xml.
 *
 * Inclut :
 *  - Pages statiques (homepage, à propos, boutique, collections, rituels, guides)
 *  - Produits actifs (mock data en attendant DB)
 *  - Articles publiés (Sprint 6 MDX)
 *  - Pages FORJA publiées (Sprint 6+ depuis DB)
 *  - Pages légales
 *
 * Exclu : auth, compte, admin, checkout, panier (robots.ts les bloque déjà).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = getMockProducts().filter((p) => p.status === 'active');

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'daily', lastModified: now },
    { url: `${SITE_URL}/boutique`, priority: 0.95, changeFrequency: 'daily', lastModified: now },
    {
      url: `${SITE_URL}/box-mensuelle`,
      priority: 0.9,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    { url: `${SITE_URL}/bundles`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
    {
      url: `${SITE_URL}/collections`,
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    {
      url: `${SITE_URL}/collections/couples`,
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    {
      url: `${SITE_URL}/collections/elle`,
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    {
      url: `${SITE_URL}/collections/lui`,
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    {
      url: `${SITE_URL}/collections/cadeaux`,
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    { url: `${SITE_URL}/cartes-cadeaux`, priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/a-propos`, priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/rituels`, priority: 0.85, changeFrequency: 'weekly', lastModified: now },
    { url: `${SITE_URL}/guides`, priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    { url: `${SITE_URL}/faq`, priority: 0.6, changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/dpo`, priority: 0.3, changeFrequency: 'yearly', lastModified: now },
    { url: `${SITE_URL}/lancement`, priority: 0.95, changeFrequency: 'daily', lastModified: now },
    { url: `${SITE_URL}/ambassadrices`, priority: 0.85, changeFrequency: 'weekly', lastModified: now },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produit/${p.slug}`,
    priority: p.isFeatured ? 0.85 : 0.75,
    changeFrequency: 'weekly' as const,
    lastModified: p.updatedAt,
    images: p.images.map((img) => `${SITE_URL}${img.url}`),
  }));

  // Bundles (coffrets cadeaux)
  const bundlePages: MetadataRoute.Sitemap = getMockBundles().map((b) => ({
    url: `${SITE_URL}/bundle/${b.slug}`,
    priority: b.isFeatured ? 0.8 : 0.7,
    changeFrequency: 'weekly' as const,
    lastModified: b.updatedAt,
    images: [`${SITE_URL}/api/og/pin/${b.slug}?type=bundle`],
  }));

  // Articles éditoriaux
  const articlePages: MetadataRoute.Sitemap = getMockArticles().map((a) => ({
    url: `${SITE_URL}/rituels/${a.slug}`,
    priority: a.isFeatured ? 0.7 : 0.6,
    changeFrequency: 'monthly' as const,
    lastModified: a.publishedAt,
  }));

  // Guides piliers (long-form SEO)
  const guidePages: MetadataRoute.Sitemap = MOCK_GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    priority: 0.75,
    changeFrequency: 'monthly' as const,
    lastModified: g.publishedAt,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    'cgv',
    'cgu',
    'mentions-legales',
    'confidentialite',
    'cookies',
    'livraison',
    'retours',
    'accessibilite',
  ].map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    priority: 0.3,
    changeFrequency: 'yearly' as const,
    lastModified: now,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...bundlePages,
    ...articlePages,
    ...guidePages,
    ...legalPages,
  ];
}
