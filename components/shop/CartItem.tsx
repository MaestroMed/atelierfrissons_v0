'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { removeFromCartAction, setCartQuantityAction } from '@/lib/cart/actions';
import type { CartLineItem } from '@/lib/cart/types';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { PriceTag } from './PriceTag';
import { QuantitySelector } from './QuantitySelector';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartLineItem;
  className?: string;
  /** Variante compacte pour le drawer (vs page panier). */
  compact?: boolean;
}

export function CartItem({ item, className, compact = false }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  const isNuit = item.collection === 'nuit';

  const handleQuantityChange = (newQty: number) => {
    startTransition(async () => {
      await setCartQuantityAction(item.slug, newQty);
      window.dispatchEvent(new CustomEvent('af:cart-updated'));
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCartAction(item.slug);
      window.dispatchEvent(new CustomEvent('af:cart-updated'));
    });
  };

  return (
    <div
      className={cn(
        'border-encre/10 flex gap-4 border-b pb-4 last:border-b-0 last:pb-0',
        isPending && 'opacity-70 transition-opacity',
        className,
      )}
    >
      {/* Visuel */}
      <Link
        href={`/produit/${item.slug}`}
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden',
          compact ? 'size-20' : 'size-24 md:size-28',
          isNuit ? 'bg-rouge' : 'bg-ivoire-dark/50',
        )}
        aria-label={`Voir ${item.name}`}
      >
        <ProductSilhouette
          variant={isNuit ? 'nuit' : 'jour'}
          animationDelayMs={0}
          className="h-[75%]"
        />
      </Link>

      {/* Détails */}
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <Link
            href={`/produit/${item.slug}`}
            className="font-display text-encre hover:text-or-dark text-base font-medium transition-colors md:text-lg"
          >
            {item.name}
          </Link>
          <PriceTag priceCents={item.unitPriceCents} size="sm" className="mt-1" />
        </div>

        <div className="flex items-end justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            disabled={isPending}
            size="sm"
            ariaLabel={`Quantité ${item.name}`}
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="ui-caps text-encre/60 hover:text-rouge inline-flex items-center gap-1.5 transition-colors disabled:opacity-40"
            aria-label={`Retirer ${item.name} du panier`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
