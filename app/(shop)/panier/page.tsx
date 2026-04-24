import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { CartItem } from '@/components/shop/CartItem';
import { getCartSnapshot } from '@/lib/cart/store';
import { formatPriceCents, pluralize } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Votre panier',
  description:
    'Récapitulatif de votre panier Atelier Frisson — livraison discrète, paiement sécurisé.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/panier' },
};

export default async function PanierPage() {
  const cart = await getCartSnapshot();
  const isEmpty = cart.itemCount === 0;
  const remainingForFreeShipping = Math.max(0, 6000 - cart.subtotalCents);

  return (
    <Container className="py-12 md:py-16">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Panier', href: '/panier' },
        ]}
        className="mb-8"
      />

      <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-14">
        <p className="ui-caps text-or-dark">Votre composition</p>
        <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">Panier</h1>
        <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
        {!isEmpty ? (
          <p className="font-italic-editorial text-encre/70">
            {cart.itemCount} {pluralize(cart.itemCount, 'objet', 'objets')} en réflexion.
          </p>
        ) : null}
      </header>

      {isEmpty ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
          <ShoppingBag className="text-encre/25 size-12 stroke-[1.2]" aria-hidden="true" />
          <p className="font-italic-editorial text-encre/70 text-lg">
            Votre panier est en attente d’un premier rituel.
          </p>
          <Link
            href="/boutique"
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-8 py-3.5 transition-colors"
          >
            Découvrir la collection
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          {/* Liste items */}
          <ul className="flex flex-col gap-6">
            {cart.items.map((item) => (
              <li key={item.productId}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>

          {/* Récap */}
          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <div className="border-encre/10 bg-ivoire-light border p-6 md:p-8">
              <h2 className="font-display text-noir text-2xl font-medium">Récapitulatif</h2>
              <Fleuron variant="divider" size="sm" color="or" className="mt-4 opacity-70" />

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-encre/70">Sous-total</dt>
                  <dd className="tabular text-encre">{formatPriceCents(cart.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-encre/70">Livraison</dt>
                  <dd className="tabular text-encre">
                    {cart.shippingCents === 0 ? 'Offerte' : formatPriceCents(cart.shippingCents)}
                  </dd>
                </div>
                <div className="text-encre/55 flex justify-between text-xs">
                  <dt>dont TVA 20 %</dt>
                  <dd className="tabular">{formatPriceCents(cart.taxCents)}</dd>
                </div>
                <div className="border-encre/15 mt-4 flex justify-between border-t pt-4 text-lg">
                  <dt className="text-encre font-medium">Total TTC</dt>
                  <dd className="tabular text-encre font-medium">
                    {formatPriceCents(cart.totalCents)}
                  </dd>
                </div>
              </dl>

              {remainingForFreeShipping > 0 ? (
                <p className="text-encre/65 mt-5 text-xs">
                  Plus que{' '}
                  <span className="tabular text-or-dark font-medium">
                    {formatPriceCents(remainingForFreeShipping)}
                  </span>{' '}
                  pour la livraison offerte.
                </p>
              ) : (
                <p className="ui-caps text-or-dark mt-5">✓ Livraison offerte</p>
              )}

              <Link
                href="/checkout"
                className="ui-caps bg-noir text-ivoire hover:bg-rouge mt-7 inline-flex w-full items-center justify-center gap-3 px-6 py-4 transition-colors"
              >
                Procéder à la commande
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="/boutique"
                className="ui-caps text-encre/65 hover:text-or-dark mt-3 inline-flex w-full items-center justify-center underline underline-offset-4"
              >
                Continuer mes découvertes
              </Link>
            </div>

            {/* Trust */}
            <ul className="text-encre/65 mt-8 space-y-3 text-xs">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="bg-or mt-1.5 size-1 shrink-0 rounded-full" />
                Livraison discrète · emballage neutre signé
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="bg-or mt-1.5 size-1 shrink-0 rounded-full" />
                Paiement sécurisé · CCBill / SSL strict
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="bg-or mt-1.5 size-1 shrink-0 rounded-full" />
                Aucune trace bancaire mentionnant le secteur
              </li>
            </ul>
          </aside>
        </div>
      )}
    </Container>
  );
}
