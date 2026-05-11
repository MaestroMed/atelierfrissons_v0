import { getMockProducts } from '@/lib/mock/products';
import { getMockBundles } from '@/lib/mock/bundles';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 h

const SITE_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://atelierfrisson.fr';

/**
 * Sitemap images dédié — pour Pinterest crawler + image search engines.
 *
 * Format : sitemap XML avec namespace `image:` (https://www.sitemaps.org/protocol.html).
 * Chaque URL liste TOUTES les images du produit/bundle (jusqu'à 1 000 par URL).
 *
 * À déclarer dans `robots.ts` :
 *   ```
 *   Sitemap: https://atelierfrisson.fr/sitemap.xml
 *   Sitemap: https://atelierfrisson.fr/sitemap-images.xml
 *   ```
 *
 * Pourquoi un sitemap images séparé : Pinterest et Google Image Search
 * privilégient les sitemaps qui exposent explicitement les images avec
 * leur URL canonique + alt text. Ça améliore les Rich Pins et le SEO image.
 */
export async function GET() {
  const products = getMockProducts();
  const bundles = getMockBundles();

  const productEntries = products.map((p) => ({
    pageUrl: `${SITE_URL}/produit/${p.slug}`,
    images: [
      {
        url: `${SITE_URL}/api/og/pin/${p.slug}?type=product`,
        title: p.name,
        caption: p.tagline ?? p.descriptionShort,
      },
      ...p.images.map((img) => ({
        url: `${SITE_URL}${img.url}`,
        title: p.name,
        caption: img.alt,
      })),
    ],
  }));

  const bundleEntries = bundles.map((b) => ({
    pageUrl: `${SITE_URL}/bundle/${b.slug}`,
    images: [
      {
        url: `${SITE_URL}/api/og/pin/${b.slug}?type=bundle`,
        title: b.name,
        caption: b.tagline ?? b.descriptionShort,
      },
      ...b.images.map((img) => ({
        url: `${SITE_URL}${img.url}`,
        title: b.name,
        caption: img.alt,
      })),
    ],
  }));

  const allEntries = [...productEntries, ...bundleEntries];

  const xml = renderSitemapXml(allEntries);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

interface SitemapEntry {
  pageUrl: string;
  images: ReadonlyArray<{
    url: string;
    title: string;
    caption: string;
  }>;
}

function renderSitemapXml(entries: readonly SitemapEntry[]): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${escape(entry.pageUrl)}</loc>
${entry.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escape(img.url)}</image:loc>
      <image:title>${escape(img.title)}</image:title>
      <image:caption>${escape(img.caption)}</image:caption>
    </image:image>`,
  )
  .join('\n')}
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlNodes}
</urlset>`;
}
