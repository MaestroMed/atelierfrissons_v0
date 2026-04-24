'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { getCartSnapshotAction } from '@/lib/cart/actions';
import type { CartSnapshot } from '@/lib/cart/types';
import { EMPTY_CART } from '@/lib/cart/types';
import { Fleuron } from '@/components/layout/Fleuron';
import { cn } from '@/lib/utils';
import { formatPriceCents, pluralize } from '@/lib/format';
import { CartItem } from './CartItem';

interface CartDrawerProps {
  /** Snapshot initial du panier (depuis le Server Component Header). */
  initialSnapshot: CartSnapshot;
}

/**
 * Drawer panier — déclenché par le bouton Panier du Header (event
 * `af:cart-open`) ou automatiquement après un add-to-cart si configuré.
 *
 * Re-fetch le snapshot à chaque ouverture (et sur event `af:cart-updated`)
 * pour rester synchro même après mutations cross-tab.
 */
export function CartDrawer({ initialSnapshot }: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<CartSnapshot>(initialSnapshot);
  const [isRefreshing, startRefresh] = useTransition();

  const refresh = useCallback(() => {
    startRefresh(async () => {
      const next = await getCartSnapshotAction();
      setSnapshot(next);
    });
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      refresh();
    };
    const onUpdate = () => {
      refresh();
    };
    window.addEventListener('af:cart-open', onOpen);
    window.addEventListener('af:cart-updated', onUpdate);
    return () => {
      window.removeEventListener('af:cart-open', onOpen);
      window.removeEventListener('af:cart-updated', onUpdate);
    };
  }, [refresh]);

  const isEmpty = snapshot.itemCount === 0;
  const remainingForFreeShipping = Math.max(0, 6000 - snapshot.subtotalCents);
  const freeShippingProgress = Math.min(100, (snapshot.subtotalCents / 6000) * 100);

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) refresh();
      }}
    >
      <SheetContent
        side="right"
        className="border-encre/10 bg-ivoire-light text-encre w-full border-l sm:max-w-md md:max-w-lg"
      >
        <div className="flex h-full flex-col">
          <header className="border-encre/10 flex flex-col items-center gap-3 border-b px-6 pt-10 pb-5 text-center">
            <SheetTitle className="font-display text-noir text-2xl font-medium">
              Votre panier
            </SheetTitle>
            <Fleuron variant="divider" size="sm" color="or" className="opacity-70" />
            <SheetDescription className="font-italic-editorial text-encre/65">
              {isEmpty
                ? 'Aucun objet pour le moment.'
                : `${snapshot.itemCount} ${pluralize(snapshot.itemCount, 'objet', 'objets')} en réflexion.`}
            </SheetDescription>
          </header>

          {/* Free shipping nudge */}
          {!isEmpty && remainingForFreeShipping > 0 ? (
            <div className="border-encre/10 bg-ivoire border-b px-6 py-4">
              <p className="text-encre/75 text-xs">
                Plus que{' '}
                <span className="tabular text-or-dark font-medium">
                  {formatPriceCents(remainingForFreeShipping)}
                </span>{' '}
                pour la livraison offerte.
              </p>
              <div className="bg-encre/10 mt-2 h-0.5 w-full">
                <div
                  className="bg-or h-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : null}
          {!isEmpty && remainingForFreeShipping === 0 ? (
            <div className="border-encre/10 bg-or/10 border-b px-6 py-3 text-center">
              <p className="ui-caps text-or-dark">✓ Livraison offerte</p>
            </div>
          ) : null}

          {/* Items */}
          <div
            className={cn(
              'scrollbar-fin flex-1 overflow-y-auto px-6 py-5',
              isRefreshing && 'opacity-70 transition-opacity',
            )}
          >
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ul className="flex flex-col gap-5">
                {snapshot.items.map((item) => (
                  <li key={item.productId}>
                    <CartItem item={item} compact />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer (récap + CTA) */}
          {!isEmpty ? (
            <footer className="border-encre/10 bg-ivoire border-t px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-encre/70">Sous-total</dt>
                  <dd className="tabular text-encre">{formatPriceCents(snapshot.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-encre/70">Livraison</dt>
                  <dd className="tabular text-encre">
                    {snapshot.shippingCents === 0
                      ? 'Offerte'
                      : formatPriceCents(snapshot.shippingCents)}
                  </dd>
                </div>
                <div className="border-encre/10 mt-3 flex justify-between border-t pt-3 text-base">
                  <dt className="text-encre font-medium">Total</dt>
                  <dd className="tabular text-encre font-medium">
                    {formatPriceCents(snapshot.totalCents)}
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="ui-caps bg-noir text-ivoire hover:bg-rouge mt-5 inline-flex w-full items-center justify-center gap-3 px-6 py-4 transition-colors"
                onClick={() => setOpen(false)}
              >
                Procéder à la commande
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/panier"
                className="ui-caps text-encre/65 hover:text-or-dark mt-3 inline-flex w-full items-center justify-center underline underline-offset-4"
                onClick={() => setOpen(false)}
              >
                Voir le détail du panier
              </Link>
            </footer>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
      <ShoppingBag className="text-encre/30 size-10 stroke-[1.2]" aria-hidden="true" />
      <p className="font-italic-editorial text-encre/65 text-base">
        Votre panier est en attente d’un premier rituel.
      </p>
      <Link
        href="/boutique"
        className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-2 inline-flex items-center gap-2 border px-5 py-2.5 transition-colors"
      >
        Découvrir la collection
      </Link>
    </div>
  );
}

export { EMPTY_CART };
