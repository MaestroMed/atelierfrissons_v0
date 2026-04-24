import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ProductCardPreviewData {
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  collection: 'jour' | 'nuit';
  badge?: string;
}

interface ProductCardPreviewProps {
  product: ProductCardPreviewData;
  className?: string;
  /** Priorité de chargement de l'image (true pour les 2 premières). */
  priority?: boolean;
}

/**
 * Carte produit « preview » utilisée sur la homepage pour faire monter la
 * boutique. Version finale (avec variants, ratings, etc.) en Sprint 2.
 *
 * Le fond de la carte suit la collection : crème pour JOUR, rouge laqué pour
 * NUIT — continue le thème du HeroSplit tout au long du scroll.
 */
export function ProductCardPreview({ product, className }: ProductCardPreviewProps) {
  const isJour = product.collection === 'jour';
  return (
    <Link
      href={`/produit/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden border border-transparent',
        'transition-[border-color,transform,box-shadow] duration-500',
        isJour
          ? 'bg-ivoire text-encre hover:border-or'
          : 'bg-rouge text-ivoire hover:border-or',
        'hover:shadow-card-hover',
        className,
      )}
    >
      <div
        className={cn(
          'relative flex aspect-[3/4] items-center justify-center overflow-hidden',
          isJour ? 'bg-ivoire' : 'bg-rouge',
        )}
      >
        {/* Silhouette mini (pourra être remplacée par next/image en Sprint 2) */}
        <MiniSilhouette variant={product.collection} />
        {product.badge ? (
          <span
            className={cn(
              'ui-caps absolute left-5 top-5 border px-3 py-1.5',
              isJour ? 'border-noir/20 text-noir/80' : 'border-ivoire/40 text-ivoire/90',
            )}
          >
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-6 py-6">
        <p
          className={cn(
            'ui-caps',
            isJour ? 'text-or-dark' : 'text-or',
          )}
        >
          {product.collection === 'jour' ? 'Collection JOUR' : 'Collection NUIT'}
        </p>
        <h3 className="font-display text-2xl font-medium leading-tight md:text-[26px]">
          {product.name}
        </h3>
        <p
          className={cn(
            'font-italic-editorial text-sm md:text-base',
            isJour ? 'text-encre/70' : 'text-ivoire/80',
          )}
        >
          {product.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="tabular text-base font-medium">
            {(product.priceCents / 100).toFixed(0)} €
          </span>
          <span
            className={cn(
              'ui-caps transition-colors',
              isJour ? 'text-or-dark group-hover:text-or' : 'text-or group-hover:text-or-light',
            )}
          >
            Découvrir
          </span>
        </div>
      </div>
    </Link>
  );
}

function MiniSilhouette({ variant }: { variant: 'jour' | 'nuit' }) {
  const isJour = variant === 'jour';
  return (
    <svg
      viewBox="0 0 200 280"
      aria-hidden="true"
      role="presentation"
      className="h-[60%] max-h-[320px] w-auto transition-transform duration-700 group-hover:scale-[1.03]"
    >
      <defs>
        <linearGradient id={`mini-${variant}`} x1="0" y1="0" x2="1" y2="1">
          {isJour ? (
            <>
              <stop offset="0%" stopColor="#FBF7EF" />
              <stop offset="100%" stopColor="#D8C9AE" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#2A2320" />
              <stop offset="100%" stopColor="#0A0706" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        d="
          M 100 20
          C 74 20, 60 48, 60 85
          C 60 130, 68 155, 72 195
          C 76 225, 82 250, 90 262
          L 110 262
          C 118 250, 124 225, 128 195
          C 132 155, 140 130, 140 85
          C 140 48, 126 20, 100 20 Z
        "
        fill={`url(#mini-${variant})`}
      />
      <path
        d="
          M 132 135
          C 148 130, 160 120, 160 105
          C 160 92, 152 85, 142 90
          C 136 94, 132 115, 132 135 Z
        "
        fill={`url(#mini-${variant})`}
      />
      <rect x="74" y="256" width="52" height="12" rx="1.5" fill={isJour ? '#E5DAC9' : '#080606'} />
      <rect x="74" y="268" width="52" height="3" rx="1" fill="#C9A36B" opacity="0.9" />
    </svg>
  );
}
