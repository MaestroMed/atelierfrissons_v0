'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';

interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductGalleryProps {
  images: readonly GalleryImage[];
  collection: 'jour' | 'nuit' | 'inaugurale' | 'signature' | null;
  productSlug: string;
  className?: string;
}

/**
 * Galerie produit avec image principale + miniatures.
 *
 * V1 (actuelle) : utilise ProductSilhouette pour les images placeholder
 * tant que les photos shootées CJ ne sont pas livrées.
 *
 * V2 (Sprint 2 polish) : `next/image` avec blurDataURL + zoom au clic.
 * V3 (Sprint 7) : Mux video player en option pour les hero produits.
 */
export function ProductGallery({
  images,
  collection,
  productSlug,
  className,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isNuit = collection === 'nuit';
  const variant = isNuit ? 'nuit' : 'jour';

  // V1 : silhouette pour chaque "image" (toutes pareilles pour l'instant)
  const slides = images.length > 0 ? images : [{ url: '', alt: '', width: 1200, height: 1600 }];

  return (
    <div className={cn('flex flex-col gap-4 lg:flex-row-reverse lg:gap-6', className)}>
      {/* Image active */}
      <div
        className={cn(
          'relative flex aspect-[4/5] flex-1 items-center justify-center overflow-hidden',
          isNuit ? 'bg-rouge' : 'bg-ivoire-light',
        )}
        style={{ viewTransitionName: `product-${productSlug}` }}
      >
        <ProductSilhouette
          variant={variant}
          animationDelayMs={0}
          className="h-[80%] max-h-[640px]"
        />
        <span
          aria-hidden="true"
          className={cn(
            'font-display absolute right-4 bottom-4 text-xs tracking-[0.3em]',
            isNuit ? 'text-or' : 'text-or-dark',
          )}
        >
          ATELIER FRISSON · AF
        </span>
      </div>

      {/* Thumbnails */}
      {slides.length > 1 ? (
        <ul className="flex gap-3 lg:flex-col lg:gap-4">
          {slides.map((img, i) => (
            <li key={`${img.url}-${i}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Voir image ${i + 1}`}
                aria-current={i === activeIndex}
                className={cn(
                  'group/thumb relative flex aspect-square size-16 items-center justify-center overflow-hidden border transition-all md:size-20',
                  i === activeIndex ? 'border-or' : 'border-encre/15 hover:border-or/60',
                  isNuit ? 'bg-rouge/30' : 'bg-ivoire-dark/40',
                )}
              >
                <ProductSilhouette variant={variant} animationDelayMs={0} className="h-[75%]" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
