import type { MetadataRoute } from 'next';
import { getMockProducts } from '@/lib/mock/products';

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
    { url: `${SITE_URL}/boutique`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
    { url: `${SITE_URL}/collections`, priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    {
      url: `${SITE_URL}/collections/jour`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    {
      url: `${SITE_URL}/collections/nuit`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: now,
    },
    { url: `${SITE_URL}/a-propos`, priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/rituels`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
    { url: `${SITE_URL}/guides`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
    { url: `${SITE_URL}/glossaire`, priority: 0.6, changeFrequency: 'monthly', lastModified: now },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produit/${p.slug}`,
    priority: p.isFeatured ? 0.85 : 0.75,
    changeFrequency: 'weekly' as const,
    lastModified: p.updatedAt,
    images: p.images.map((img) => `${SITE_URL}${img.url}`),
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

  // TODO Sprint 6 : importer articles MDX + queries forge
  return [...staticPages, ...productPages, ...legalPages];
}
