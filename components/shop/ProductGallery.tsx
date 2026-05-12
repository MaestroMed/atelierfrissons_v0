'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { ProductGalleryLightbox } from './ProductGalleryLightbox';

interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductGalleryProps {
  images: readonly GalleryImage[];
  collection:
    | 'couples'
    | 'elle'
    | 'lui'
    | 'cadeaux'
    | 'jour'
    | 'nuit'
    | 'inaugurale'
    | 'signature'
    | null;
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isNuit = collection === 'nuit';
  const variant = isNuit ? 'nuit' : 'jour';

  // V1 : silhouette pour chaque "image" (toutes pareilles pour l'instant)
  const slides = images.length > 0 ? images : [{ url: '', alt: '', width: 1200, height: 1600 }];

  const openLightbox = () => setLightboxOpen(true);

  return (
    <>
      <div className={cn('flex flex-col gap-4 lg:flex-row-reverse lg:gap-6', className)}>
        {/* Image active — cliquable pour ouvrir le lightbox */}
        <button
          type="button"
          onClick={openLightbox}
          aria-label="Agrandir l'image produit"
          className={cn(
            'group/main relative flex aspect-[4/5] flex-1 cursor-zoom-in items-center justify-center overflow-hidden',
            'hover:shadow-card-hover transition-shadow duration-300',
            'focus-visible:outline-offset-4',
            isNuit ? 'bg-rouge' : 'bg-ivoire-light',
          )}
          style={{ viewTransitionName: `product-${productSlug}` }}
        >
          {slides[activeIndex]?.url ? (
            <Image
              src={slides[activeIndex].url}
              alt={slides[activeIndex].alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover/main:scale-[1.02]"
            />
          ) : (
            <ProductSilhouette
              variant={variant}
              animationDelayMs={0}
              className="h-[80%] max-h-[640px] transition-transform duration-500 group-hover/main:scale-[1.02]"
            />
          )}
          <span
            aria-hidden="true"
            className={cn(
              'font-display pointer-events-none absolute right-4 bottom-4 text-xs tracking-[0.3em]',
              slides[activeIndex]?.url
                ? 'bg-ivoire/80 supports-backdrop-filter:bg-ivoire/60 text-noir supports-backdrop-filter:backdrop-blur-sm px-2 py-1'
                : isNuit
                  ? 'text-or'
                  : 'text-or-dark',
            )}
          >
            ATELIER FRISSON · AF
          </span>

          {/* Bouton zoom — signal affordance, apparaît au hover */}
          <span
            aria-hidden="true"
            className={cn(
              'ui-caps absolute top-4 right-4 inline-flex items-center gap-2 border px-3 py-1.5 text-[10px]',
              'bg-ivoire/92 border-noir/15 text-noir supports-backdrop-filter:bg-ivoire/75 supports-backdrop-filter:backdrop-blur-sm',
              'opacity-0 transition-opacity duration-300 group-hover/main:opacity-100 group-focus-visible/main:opacity-100',
              'motion-reduce:transition-none',
            )}
          >
            <ZoomIn className="size-3.5" strokeWidth={1.5} />
            Agrandir
          </span>
        </button>

        {/* Thumbnails */}
        {slides.length > 1 ? (
          <ul className="flex gap-3 lg:flex-col lg:gap-4">
            {slides.map((img, i) => (
              <li key={`${img.url}-${i}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  onDoubleClick={openLightbox}
                  aria-label={`Voir image ${i + 1}`}
                  aria-current={i === activeIndex}
                  className={cn(
                    'group/thumb relative flex aspect-square size-16 items-center justify-center overflow-hidden border transition-all md:size-20',
                    i === activeIndex ? 'border-or' : 'border-encre/15 hover:border-or/60',
                    isNuit ? 'bg-rouge/30' : 'bg-ivoire-dark/40',
                  )}
                >
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <ProductSilhouette variant={variant} animationDelayMs={0} className="h-[75%]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Lightbox — monté unconditionnellement, open contrôle le rendu interne */}
      <ProductGalleryLightbox
        images={slides}
        variant={variant}
        initialIndex={activeIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}
