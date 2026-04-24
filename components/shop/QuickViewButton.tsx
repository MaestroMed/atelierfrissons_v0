'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { AddToCartButton } from './AddToCartButton';
import { WishlistButton } from './WishlistButton';
import { PriceTag } from './PriceTag';
import { StockBadge } from './StockBadge';
import { ReviewStars } from './ReviewStars';

export interface QuickViewProduct {
  slug: string;
  name: string;
  tagline: string | null;
  descriptionShort: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  stockStatus: string;
  stockQuantity: number;
  collection: 'jour' | 'nuit' | 'inaugurale' | 'signature' | null;
  /** Note moyenne (0-5) — optionnel, affiche ReviewStars si fourni. */
  averageRating?: number;
  reviewCount?: number;
}

interface QuickViewButtonProps {
  product: QuickViewProduct;
  /** Variante du bouton trigger. */
  variant?: 'overlay' | 'inline';
  className?: string;
}

/**
 * Bouton + dialogue « Aperçu rapide » — permet de consulter les détails
 * essentiels d'un produit sans quitter la grille boutique.
 *
 * Trigger (variant overlay) : apparaît au hover de la carte produit, centré
 * en bas de la zone image. Pour variant inline : bouton plain.
 *
 * Dialog : overlay full-screen avec card centrée, image à gauche +
 * détails à droite (name, tagline, rating, price, stock, description,
 * AddToCart + Wishlist, lien vers fiche complète). Custom impl (pas Base UI
 * pour pouvoir adapter la largeur, garder la cohérence avec le
 * CommandPalette, et éviter le cap sm:max-w-sm du Dialog shadcn).
 *
 * Clavier :
 *   - Escape pour fermer
 *   - Focus trap simple : body scroll locked
 *
 * Respecte prefers-reduced-motion.
 */
export function QuickViewButton({ product, variant = 'overlay', className }: QuickViewButtonProps) {
  const [open, setOpen] = useState(false);
  const isNuit = product.collection === 'nuit';
  const isJour = product.collection === 'jour' || product.collection === 'inaugurale';

  const openDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    // Lock body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDialog = () => {
    setOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // Escape handler est inline sur le dialog

  const triggerStyles =
    variant === 'overlay'
      ? cn(
          // Centré en bas, apparaît au hover via opacity
          'ui-caps absolute inset-x-4 bottom-4 z-20',
          'inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-[10px]',
          'bg-ivoire/92 text-noir border-noir/15 supports-backdrop-filter:bg-ivoire/80 supports-backdrop-filter:backdrop-blur-sm',
          'opacity-0 transition-all duration-300',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          'hover:bg-noir hover:text-ivoire hover:border-noir',
          'translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0',
          'motion-reduce:transition-none',
        )
      : cn(
          'ui-caps border-noir/20 text-noir hover:border-noir hover:bg-noir hover:text-ivoire',
          'inline-flex items-center gap-2 border px-4 py-2 transition-colors',
        );

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Aperçu rapide — ${product.name}`}
        className={cn(triggerStyles, className)}
      >
        <Eye className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        Aperçu rapide
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Aperçu rapide — ${product.name}`}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              closeDialog();
            }
          }}
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="animate-in fade-in-0 bg-noir/55 fixed inset-0 duration-200 supports-backdrop-filter:backdrop-blur-sm motion-reduce:animate-none"
            onClick={closeDialog}
          />

          {/* Card */}
          <div
            className={cn(
              'relative z-10 flex w-full max-w-4xl flex-col overflow-hidden',
              'bg-ivoire border-or/30 border shadow-2xl',
              'animate-in fade-in-0 zoom-in-95 duration-200 motion-reduce:animate-none',
              'max-h-[90vh] overflow-y-auto',
            )}
          >
            {/* Close button (absolute top-right) */}
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Fermer l'aperçu"
              autoFocus
              className={cn(
                'absolute top-4 right-4 z-20 inline-flex size-10 items-center justify-center rounded-full',
                'bg-ivoire/92 border-noir/15 text-noir/70 hover:bg-noir hover:text-ivoire',
                'border transition-colors',
                'supports-backdrop-filter:bg-ivoire/75 supports-backdrop-filter:backdrop-blur-sm',
              )}
            >
              <X className="size-4" aria-hidden="true" strokeWidth={1.5} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
              {/* Image / Silhouette */}
              <div
                className={cn(
                  'relative flex aspect-[4/5] items-center justify-center overflow-hidden md:aspect-auto md:min-h-[500px]',
                  isNuit ? 'bg-rouge' : isJour ? 'bg-ivoire-light' : 'bg-noir',
                )}
              >
                <ProductSilhouette
                  variant={isNuit ? 'nuit' : 'jour'}
                  className="h-[78%] max-h-[520px]"
                />
                {/* Watermark AF */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-display absolute right-4 bottom-4 text-[10px] tracking-[0.3em]',
                    isNuit ? 'text-or/80' : isJour ? 'text-or-dark/60' : 'text-or/80',
                  )}
                >
                  AF
                </span>
              </div>

              {/* Info panel */}
              <div className="flex flex-col gap-5 p-6 md:p-10">
                <p className="ui-caps text-or-dark">{collectionLabel(product.collection)}</p>
                <h2 className="font-display text-noir text-3xl font-medium md:text-4xl">
                  {product.name}
                </h2>
                {product.tagline ? (
                  <p className="font-italic-editorial text-or-dark text-base md:text-lg">
                    {product.tagline}
                  </p>
                ) : null}

                {product.averageRating && product.reviewCount ? (
                  <div className="flex items-center gap-2.5 text-sm">
                    <ReviewStars rating={product.averageRating} size="sm" />
                    <span className="tabular text-encre/75 font-medium">
                      {product.averageRating.toFixed(1)}
                    </span>
                    <span className="text-encre/55">{product.reviewCount} avis</span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <PriceTag
                    priceCents={product.priceCents}
                    compareAtPriceCents={product.compareAtPriceCents}
                    size="lg"
                    showTaxNotice
                  />
                  <StockBadge
                    stockStatus={product.stockStatus}
                    stockQuantity={product.stockQuantity}
                  />
                </div>

                <p className="text-encre/80 text-sm leading-relaxed md:text-base">
                  {product.descriptionShort}
                </p>

                <div className="flex items-stretch gap-3">
                  <AddToCartButton
                    slug={product.slug}
                    productName={product.name}
                    collection={product.collection}
                    showQuantity
                    size="md"
                    className="flex-1"
                  />
                  <WishlistButton
                    slug={product.slug}
                    productName={product.name}
                    variant="inline"
                    className="shrink-0 self-end"
                  />
                </div>

                <Link
                  href={`/produit/${product.slug}`}
                  onClick={closeDialog}
                  className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2 self-start underline underline-offset-4 transition-all hover:gap-3"
                >
                  Voir la fiche complète
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function collectionLabel(collection: QuickViewProduct['collection']): string {
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
