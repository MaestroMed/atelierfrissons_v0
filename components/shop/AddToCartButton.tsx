'use client';

import { useState, useTransition } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { addToCartAction } from '@/lib/cart/actions';
import { cn } from '@/lib/utils';
import { QuantitySelector } from './QuantitySelector';

interface AddToCartButtonProps {
  slug: string;
  productName: string;
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
  /** Affiche le sélecteur de quantité au-dessus du bouton (fiche produit). */
  showQuantity?: boolean;
  /** Ouvre automatiquement le drawer panier après ajout. */
  openDrawerAfterAdd?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Bouton ajout au panier — compose Server Action + feedback UX.
 *
 * - Pending state : « Ajout en cours… » avec spinner doré
 * - Success state : check ✓ « Ajouté » 1.5s puis retour
 * - Error state : toast Sonner + retour bouton normal
 * - Animation : micro-pulse sur le bouton à l'ajout
 *
 * Émet `af:cart-updated` event pour que le CartDrawer/Header se rafraîchissent.
 */
export function AddToCartButton({
  slug,
  productName,
  collection,
  showQuantity = false,
  openDrawerAfterAdd = false,
  className,
  size = 'md',
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const isNuit = collection === 'nuit';

  const handleAdd = () => {
    startTransition(async () => {
      try {
        const snapshot = await addToCartAction(slug, quantity);
        setJustAdded(true);
        // Notify drawer + header
        window.dispatchEvent(new CustomEvent('af:cart-updated', { detail: { snapshot } }));
        if (openDrawerAfterAdd) {
          window.dispatchEvent(new CustomEvent('af:cart-open'));
        } else {
          toast.success(`${productName} ajouté au panier`, {
            description: `${quantity} article${quantity > 1 ? 's' : ''} dans le panier.`,
            action: {
              label: 'Voir le panier',
              onClick: () => {
                window.location.href = '/panier';
              },
            },
          });
        }
        setTimeout(() => setJustAdded(false), 1800);
      } catch (err) {
        console.error('[AddToCartButton]', err);
        toast.error('Une erreur est survenue, réessayez.');
      }
    });
  };

  const sizeClass =
    size === 'sm'
      ? 'px-4 py-2.5 text-xs'
      : size === 'lg'
        ? 'px-8 py-4 text-sm'
        : 'px-6 py-3 text-sm';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showQuantity ? (
        <div className="flex items-center gap-4">
          <span className="ui-caps text-encre/70">Quantité</span>
          <QuantitySelector value={quantity} onChange={setQuantity} disabled={isPending} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleAdd}
        disabled={isPending}
        className={cn(
          'group/cta ui-caps inline-flex items-center justify-center gap-3',
          sizeClass,
          'border transition-all duration-300',
          isNuit
            ? 'border-or bg-or text-noir hover:bg-or-light'
            : 'border-noir bg-noir text-ivoire hover:border-or hover:bg-or hover:text-noir',
          'disabled:cursor-wait disabled:opacity-70',
          justAdded && 'border-af-success bg-af-success text-ivoire',
          'relative overflow-hidden',
        )}
        aria-live="polite"
      >
        {/* Highlight wipe animation on hover */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent',
            'transition-transform duration-700 group-hover/cta:translate-x-full',
          )}
        />
        {justAdded ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Ajouté
          </>
        ) : isPending ? (
          <>
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Ajout…
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" aria-hidden="true" />
            Ajouter au panier
          </>
        )}
      </button>
    </div>
  );
}
