'use client';

import { useEffect, useState } from 'react';
import { AddToCartButton } from './AddToCartButton';
import { PriceTag } from './PriceTag';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/db/schema';

interface StickyProductBarProps {
  product: Product;
  /** Offset scroll à partir duquel afficher la barre (défaut 500px). */
  revealAfterScrollY?: number;
}

/**
 * Barre sticky mobile pour la fiche produit — apparaît au scroll quand
 * le bouton principal n'est plus visible. Desktop : masquée (lg:hidden).
 *
 * Animations : fade-up 250ms à l'apparition/disparition, respect
 * prefers-reduced-motion.
 */
export function StickyProductBar({ product, revealAfterScrollY = 500 }: StickyProductBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > revealAfterScrollY);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [revealAfterScrollY]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden',
        'border-encre/10 bg-ivoire-light/95 border-t backdrop-blur-md',
        'transition-transform duration-300 ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0' : 'translate-y-full',
        visible && 'pointer-events-auto',
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex flex-col">
          <p className="font-display text-noir text-sm font-medium">{product.name}</p>
          <PriceTag priceCents={product.priceCents} size="sm" />
        </div>
        <AddToCartButton
          slug={product.slug}
          productName={product.name}
          collection={product.collection}
          openDrawerAfterAdd
          size="sm"
          className="shrink-0"
        />
      </div>
    </div>
  );
}
