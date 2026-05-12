import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WishlistButton } from '@/components/shop/WishlistButton';

/** Audience pivot V2 + capsules legacy. */
export type ProductCollection =
  | 'couples'
  | 'elle'
  | 'lui'
  | 'cadeaux'
  | 'jour'
  | 'nuit'
  | 'inaugurale'
  | 'signature';

export interface ProductCardPreviewData {
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  collection: ProductCollection;
  badge?: string;
  /** URL de l'image hero produit (Vue 1, 4:5). Si absent → silhouette placeholder. */
  imageUrl?: string | null;
  /** Alt text descriptif WCAG-conforme. Requis si `imageUrl` fourni. */
  imageAlt?: string;
}

interface ProductCardPreviewProps {
  product: ProductCardPreviewData;
  className?: string;
  /** Priorité de chargement de l'image (true pour les 2 premières). */
  priority?: boolean;
}

/**
 * Carte produit « preview » utilisée sur la homepage et collections.
 *
 * Variantes visuelles selon l'audience :
 *   - lui / nuit                                → fond noir velours, accent or champagne
 *   - couples / elle / cadeaux / jour / autres  → fond ivoire, accent oxblood discret
 *
 * Les images réelles seront servies depuis `/images/products/{slug}/01-hero.webp`
 * une fois les rendus GPT Image 2 livrés (cf. docs/IMAGE_PROMPTS_PRODUCTS.md).
 */
export function ProductCardPreview({ product, className, priority = false }: ProductCardPreviewProps) {
  const isDark = product.collection === 'lui' || product.collection === 'nuit';
  const collectionLabel = COLLECTION_LABELS[product.collection];
  const hasCompareAt =
    typeof product.compareAtPriceCents === 'number' &&
    product.compareAtPriceCents > product.priceCents;

  return (
    <Link
      href={`/produit/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden border border-transparent',
        'transition-[border-color,transform,box-shadow] duration-500',
        isDark
          ? 'bg-noir text-ivoire hover:border-or'
          : 'bg-ivoire text-encre hover:border-or-dark',
        'hover:shadow-card-hover',
        className,
      )}
    >
      <div
        className={cn(
          'relative flex aspect-[3/4] items-center justify-center overflow-hidden',
          isDark ? 'bg-noir' : 'bg-ivoire-light',
        )}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? `${product.name} — ${product.tagline}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <PreviewSilhouette dark={isDark} />
        )}

        {product.badge ? (
          <span
            className={cn(
              'ui-caps absolute top-5 left-5 border px-3 py-1.5 backdrop-blur-sm',
              isDark
                ? 'border-or/40 bg-noir/60 text-or'
                : 'border-encre/15 bg-ivoire/70 text-encre/85',
            )}
          >
            {product.badge}
          </span>
        ) : null}

        <WishlistButton
          slug={product.slug}
          productName={product.name}
          variant="overlay"
          className="absolute top-4 right-4 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-6 py-6">
        <p className={cn('ui-caps', isDark ? 'text-or' : 'text-or-dark')}>{collectionLabel}</p>
        <h3 className="font-display text-2xl leading-tight font-medium md:text-[26px]">
          {product.name}
        </h3>
        <p
          className={cn(
            'font-italic-editorial text-sm md:text-base',
            isDark ? 'text-ivoire/80' : 'text-encre/70',
          )}
        >
          {product.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="tabular flex items-baseline gap-2 text-base font-medium">
            <span>{(product.priceCents / 100).toFixed(0)} €</span>
            {hasCompareAt ? (
              <span
                className={cn(
                  'text-xs line-through',
                  isDark ? 'text-ivoire/45' : 'text-encre/40',
                )}
              >
                {(product.compareAtPriceCents! / 100).toFixed(0)} €
              </span>
            ) : null}
          </span>
          <span
            className={cn(
              'ui-caps transition-colors',
              isDark ? 'text-or group-hover:text-or-light' : 'text-or-dark group-hover:text-or',
            )}
          >
            Découvrir
          </span>
        </div>
      </div>
    </Link>
  );
}

const COLLECTION_LABELS: Record<ProductCollection, string> = {
  couples: 'Pour Vous Deux',
  elle: 'Pour Elle',
  lui: 'Pour Lui',
  cadeaux: 'Cadeau',
  jour: 'Collection JOUR',
  nuit: 'Collection NUIT',
  inaugurale: 'Collection inaugurale',
  signature: 'Pièce signature',
};

/**
 * Silhouette neutre — placeholder visuel en attendant les rendus produit.
 * Sera remplacée par <Image src={product.images[0].url} ... /> une fois les
 * rendus livrés.
 */
function PreviewSilhouette({ dark }: { dark: boolean }) {
  return (
    <svg
      viewBox="0 0 200 280"
      aria-hidden="true"
      role="presentation"
      className="h-[60%] max-h-[320px] w-auto transition-transform duration-700 group-hover:scale-[1.03]"
    >
      <defs>
        <linearGradient id={`pcp-${dark ? 'd' : 'l'}`} x1="0" y1="0" x2="1" y2="1">
          {dark ? (
            <>
              <stop offset="0%" stopColor="#2A2320" />
              <stop offset="60%" stopColor="#0A0706" />
              <stop offset="100%" stopColor="#161110" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FBF7EF" />
              <stop offset="55%" stopColor="#F0E4CF" />
              <stop offset="100%" stopColor="#D8C9AE" />
            </>
          )}
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="270" rx="48" ry="6" fill={dark ? 'rgba(0,0,0,0.4)' : 'rgba(168,132,73,0.18)'} />
      <path
        d="
          M 100 30
          C 72 30, 58 60, 58 100
          C 58 140, 66 168, 70 200
          C 74 232, 80 250, 88 262
          L 112 262
          C 120 250, 126 232, 130 200
          C 134 168, 142 140, 142 100
          C 142 60, 128 30, 100 30 Z
        "
        fill={`url(#pcp-${dark ? 'd' : 'l'})`}
      />
      <rect x="76" y="258" width="48" height="3" rx="1" fill="#C9A36B" opacity="0.85" />
    </svg>
  );
}
