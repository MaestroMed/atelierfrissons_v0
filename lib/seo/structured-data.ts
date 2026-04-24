import type { Product } from '@/lib/db/schema';

/**
 * Helpers Schema.org JSON-LD pour le SEO YMYL.
 * Source de vérité : docs/SEO_STRATEGY.md §6.1 + .claude/rules/seo.md.
 *
 * À sérialiser dans `<script type="application/ld+json">` via
 * `dangerouslySetInnerHTML` (la seule exception légitime à cette API).
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr';
const ORGANIZATION_NAME = 'Atelier Frisson';

interface ProductReviewsSummary {
  count: number;
  averageRating: number;
}

interface ProductReviewEntry {
  rating: number;
  title?: string;
  body: string;
  authorName: string;
  createdAt: Date;
}

export function buildProductSchema(
  product: Product,
  reviews: ProductReviewsSummary | null = null,
  reviewEntries: readonly ProductReviewEntry[] = [],
): Record<string, unknown> {
  const priceValidUntil = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.descriptionShort,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: ORGANIZATION_NAME,
      logo: `${SITE_URL}/logo.png`,
    },
    category: 'Wellness intime',
    image: product.images.map((img) => `${SITE_URL}${img.url}`),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produit/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      priceValidUntil,
      availability:
        product.stockStatus === 'in_stock' || product.stockStatus === 'low_stock'
          ? 'https://schema.org/InStock'
          : product.stockStatus === 'preorder'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: ORGANIZATION_NAME },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'EUR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'FR' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 4, unitCode: 'DAY' },
        },
      },
    },
    ...(reviews && reviews.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.averageRating,
            reviewCount: reviews.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviewEntries.length > 0
      ? {
          review: reviewEntries.slice(0, 10).map((r) => ({
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            author: { '@type': 'Person', name: r.authorName },
            datePublished: r.createdAt.toISOString(),
            ...(r.title ? { name: r.title } : {}),
            reviewBody: r.body,
          })),
        }
      : {}),
    additionalProperty: Object.entries(product.specs ?? {}).map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value,
    })),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ label: string; href: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
}

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Atelier Frisson conçoit des objets de bien-être intime comme des rituels contemporains. Maison française, silicone médical, livraison discrète.',
    sameAs: ['https://instagram.com/atelierfrisson', 'https://pinterest.com/atelierfrisson'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@atelierfrisson.fr',
      contactType: 'customer service',
      availableLanguage: ['fr', 'en'],
    },
  };
}

export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    inLanguage: 'fr-FR',
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/recherche?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(items: readonly FAQItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildArticleSchema(article: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  authorRole: string;
  publishedAt: Date;
  updatedAt: Date;
  heroImageUrl?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/rituels/${article.slug}`,
    },
    ...(article.heroImageUrl ? { image: `${SITE_URL}${article.heroImageUrl}` } : {}),
    inLanguage: 'fr-FR',
  };
}

/**
 * Composant React pour insérer un script JSON-LD.
 * Usage : `<JsonLd data={buildProductSchema(product)} />`
 */
export interface JsonLdProps {
  data: Record<string, unknown>;
}
