import Link from 'next/link';
import type { Product } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { PriceTag } from './PriceTag';
import { StockBadge } from './StockBadge';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Variante visuelle compacte (utilisée en related/upsell). */
  variant?: 'default' | 'compact';
  /** Préchargement de l'image hero pour LCP (premiers items). */
  priority?: boolean;
}

/**
 * Carte produit — utilisée sur /boutique, /collections, related products.
 *
 * Le fond suit la collection JOUR/NUIT (continue le thème split du Hero).
 * Hover : élévation discrète + scale silhouette + underline or sur le label.
 *
 * `view-transition-name` cible chaque carte pour permettre le morphing
 * vers la page produit (Next.js View Transitions API — Sprint 7).
 */
export function ProductCard({
  product,
  className,
  variant = 'default',
  priority = false,
}: ProductCardProps) {
  const isJour = product.collection === 'jour' || product.collection === 'inaugurale';
  const isNuit = product.collection === 'nuit';
  const isCompact = variant === 'compact';

  return (
    <Link
      href={`/produit/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden border border-transparent',
        'transition-[border-color,transform,box-shadow] duration-500',
        isJour ? 'bg-ivoire-light text-encre hover:border-or' : '',
        isNuit ? 'bg-rouge text-ivoire hover:border-or' : '',
        !isJour && !isNuit ? 'bg-noir text-ivoire hover:border-or' : '',
        'hover:shadow-card-hover',
        className,
      )}
      style={{ viewTransitionName: `product-${product.slug}` }}
      data-collection={product.collection ?? 'inaugurale'}
      data-priority={priority ? 'true' : undefined}
    >
      {/* Visuel produit */}
      <div
        className={cn(
          'relative flex overflow-hidden',
          isCompact ? 'aspect-square' : 'aspect-[4/5]',
          isJour ? 'bg-ivoire' : isNuit ? 'bg-rouge' : 'bg-noir',
        )}
      >
        <ProductSilhouette
          variant={isNuit ? 'nuit' : 'jour'}
          animationDelayMs={priority ? 0 : 200}
          className={cn(
            'm-auto h-[78%] transition-transform duration-700 ease-out',
            'group-hover:scale-[1.04]',
          )}
        />

        {/* Badge stock + featured */}
        <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-2">
          {product.isFeatured ? (
            <span className="ui-caps border-or/60 bg-noir/70 text-or inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] backdrop-blur-sm">
              <span className="bg-or size-1 rounded-full" aria-hidden="true" />
              Sélection signature
            </span>
          ) : null}
          {product.stockStatus !== 'in_stock' ? (
            <StockBadge
              stockStatus={product.stockStatus}
              stockQuantity={product.stockQuantity}
              className="bg-noir/70 backdrop-blur-sm"
            />
          ) : null}
        </div>

        {/* Watermark fleuron au coin inférieur (signature visuelle) */}
        <span
          aria-hidden="true"
          className={cn(
            'font-display absolute right-3 bottom-3 text-[10px] tracking-[0.3em] opacity-50',
            isJour ? 'text-or-dark' : 'text-or',
          )}
        >
          AF
        </span>

        {/* Bouton favoris — overlay top-right */}
        <WishlistButton
          slug={product.slug}
          productName={product.name}
          variant="overlay"
          className="absolute top-3 right-3 z-10"
        />
      </div>

      {/* Métadonnées textuelles */}
      <div className="flex flex-1 flex-col gap-2 px-5 py-5 md:px-6 md:py-6">
        <p className={cn('ui-caps', isJour ? 'text-or-dark' : 'text-or')}>
          {collectionLabel(product.collection)}
        </p>
        <h3
          className={cn(
            'font-display leading-tight font-medium transition-colors',
            isCompact ? 'text-lg md:text-xl' : 'text-2xl md:text-[26px]',
          )}
        >
          {product.name}
        </h3>
        {!isCompact ? (
          <p
            className={cn(
              'font-italic-editorial text-sm md:text-base',
              isJour ? 'text-encre/70' : 'text-ivoire/80',
            )}
          >
            {product.tagline}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <PriceTag
            priceCents={product.priceCents}
            compareAtPriceCents={product.compareAtPriceCents}
            size={isCompact ? 'md' : 'lg'}
            className={cn(
              isNuit && 'text-ivoire [&_*]:text-ivoire',
              !isJour && !isNuit && 'text-ivoire [&_*]:text-ivoire',
            )}
          />
          <span
            className={cn(
              'ui-caps inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3',
              isJour ? 'text-or-dark group-hover:text-or' : 'text-or group-hover:text-or-light',
            )}
          >
            Découvrir
            <svg
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function collectionLabel(collection: Product['collection']): string {
  switch (collection) {
    case 'jour':
      return 'Collection JOUR';
    case 'nuit':
      return 'Collection NUIT';
    case 'inaugurale':
      return 'Collection inaugurale';
    case 'signature':
      return 'Pièce signature';
    default:
      return 'Atelier Frisson';
  }
}
