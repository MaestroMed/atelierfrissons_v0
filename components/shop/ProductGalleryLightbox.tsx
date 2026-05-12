'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';

interface LightboxImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductGalleryLightboxProps {
  images: readonly LightboxImage[];
  /** Variante visuelle pour les silhouettes placeholder. */
  variant: 'jour' | 'nuit';
  /** Index ouvert initialement. */
  initialIndex?: number;
  /** Est-ce que le lightbox est ouvert ? */
  open: boolean;
  /** Notifie la fermeture au parent. */
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal lightbox plein écran pour la galerie produit.
 *
 * Fonctionnalités :
 *   - Image active en grand (utilise ProductSilhouette pour les placeholders,
 *     basculera sur next/image en Sprint 8 quand les photos réelles arrivent)
 *   - Navigation ← → (clavier + boutons visibles)
 *   - Miniatures en bas avec scroll snap
 *   - Compteur 1 / N en haut à gauche
 *   - Close top-right + Escape
 *   - Click sur backdrop pour fermer
 *   - Body scroll lock
 *   - Respect prefers-reduced-motion
 */
export function ProductGalleryLightbox({
  images,
  variant,
  initialIndex = 0,
  open,
  onOpenChange,
}: ProductGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const total = images.length;

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  // Sync l'index actif quand on ouvre/change d'initialIndex
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setActiveIndex(initialIndex);
  }, [open, initialIndex]);

  // Body scroll lock + keyboard handlers
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange, goPrev, goNext]);

  if (!open) return null;

  const isNuit = variant === 'nuit';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie produit en plein écran"
      className="fixed inset-0 z-[80] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="animate-in fade-in-0 bg-noir/92 fixed inset-0 duration-200 supports-backdrop-filter:backdrop-blur-md motion-reduce:animate-none"
        onClick={() => onOpenChange(false)}
      />

      {/* Header — compteur + close */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-5 md:p-8">
        <span className="ui-caps tabular text-ivoire/85 text-xs">
          {(activeIndex + 1).toString().padStart(2, '0')}
          <span className="text-ivoire/45 mx-1">/</span>
          {total.toString().padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Fermer la galerie"
          autoFocus
          className="ui-caps text-ivoire/85 hover:text-or inline-flex items-center gap-2 text-xs transition-colors"
        >
          Fermer
          <X className="size-4" aria-hidden="true" strokeWidth={1.5} />
        </button>
      </div>

      {/* Image active */}
      <div
        className={cn(
          'relative z-[5] flex max-h-[80vh] w-full max-w-5xl items-center justify-center px-12 md:px-20',
          'animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'relative flex aspect-[4/5] w-full max-w-2xl items-center justify-center overflow-hidden',
            isNuit ? 'bg-rouge' : 'bg-ivoire-light',
          )}
        >
          {images[activeIndex]?.url ? (
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              priority
              sizes="(min-width: 768px) 640px, 90vw"
              className="object-contain"
            />
          ) : (
            <ProductSilhouette variant={variant} className="h-[80%] max-h-[580px]" />
          )}
          <span
            aria-hidden="true"
            className={cn(
              'font-display pointer-events-none absolute right-4 bottom-4 text-xs tracking-[0.3em]',
              images[activeIndex]?.url
                ? 'bg-noir/55 supports-backdrop-filter:bg-noir/35 text-ivoire/85 supports-backdrop-filter:backdrop-blur-sm px-2 py-1'
                : isNuit
                  ? 'text-or'
                  : 'text-or-dark',
            )}
          >
            ATELIER FRISSON · AF
          </span>
        </div>
      </div>

      {/* Arrow navigation — desktop uniquement (mobile = swipe au snap-x) */}
      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Image précédente"
            className={cn(
              'absolute top-1/2 left-4 z-10 -translate-y-1/2',
              'inline-flex size-12 items-center justify-center rounded-full border',
              'bg-ivoire/10 border-ivoire/30 text-ivoire/85 hover:bg-ivoire/20 hover:text-or',
              'transition-colors supports-backdrop-filter:backdrop-blur-sm',
              'md:left-8',
            )}
          >
            <ChevronLeft className="size-5" aria-hidden="true" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Image suivante"
            className={cn(
              'absolute top-1/2 right-4 z-10 -translate-y-1/2',
              'inline-flex size-12 items-center justify-center rounded-full border',
              'bg-ivoire/10 border-ivoire/30 text-ivoire/85 hover:bg-ivoire/20 hover:text-or',
              'transition-colors supports-backdrop-filter:backdrop-blur-sm',
              'md:right-8',
            )}
          >
            <ChevronRight className="size-5" aria-hidden="true" strokeWidth={1.5} />
          </button>
        </>
      ) : null}

      {/* Thumbnails strip bottom */}
      {total > 1 ? (
        <div className="absolute right-0 bottom-6 left-0 z-10 flex justify-center px-6">
          <ul className="flex max-w-full gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:hidden">
            {images.map((img, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={`${img.url}-${i}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Voir image ${i + 1}`}
                    aria-current={isActive}
                    className={cn(
                      'relative flex size-14 items-center justify-center overflow-hidden border transition-all md:size-16',
                      isActive
                        ? 'border-or scale-105'
                        : 'border-ivoire/25 hover:border-ivoire/60 opacity-50 hover:opacity-80',
                      isNuit ? 'bg-rouge/40' : 'bg-ivoire-dark/30',
                    )}
                  >
                    {img.url ? (
                      <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
                    ) : (
                      <ProductSilhouette variant={variant} className="h-[70%]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Icône réutilisable pour le bouton trigger du lightbox — exporté pour conso. */
export { ZoomIn };
