import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { getCartSnapshot } from '@/lib/cart/store';
import { getSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Commande sécurisée',
  description: 'Finalisez votre commande Atelier Frisson — livraison discrète, paiement sécurisé.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/checkout' },
};

export default async function CheckoutPage() {
  const cart = await getCartSnapshot();
  if (cart.itemCount === 0) {
    redirect('/panier');
  }
  const session = await getSession();

  return (
    <Container className="py-10 md:py-14">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Panier', href: '/panier' },
          { label: 'Commande', href: '/checkout' },
        ]}
        className="mb-8"
      />
      <header className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
        <p className="ui-caps text-or-dark">Étape finale</p>
        <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">Votre commande</h1>
        <Fleuron variant="divider" size="md" color="or" className="opacity-70" />
        <p className="font-italic-editorial text-encre/70">
          Trois étapes — coordonnées, livraison, confirmation.
        </p>
      </header>

      <CheckoutForm initialEmail={session?.email ?? ''} cart={cart} />
    </Container>
  );
}
