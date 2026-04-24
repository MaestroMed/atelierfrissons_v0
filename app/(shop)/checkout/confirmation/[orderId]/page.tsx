import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Mail, Package, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';

export const metadata: Metadata = {
  title: 'Commande confirmée',
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <Container className="flex min-h-[calc(100dvh-15rem)] items-center py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <span className="bg-or text-noir flex size-16 items-center justify-center rounded-full">
          <Check className="size-8" aria-hidden="true" strokeWidth={1.6} />
        </span>

        <header className="space-y-3">
          <p className="ui-caps text-or-dark">Commande confirmée</p>
          <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">
            Merci pour <span className="font-italic-editorial text-or-dark">votre confiance</span>
          </h1>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto opacity-70" />
          <p className="text-encre/70 text-sm">
            Votre commande <span className="ui-caps tabular text-noir">{orderId}</span> a bien été
            enregistrée. Un e-mail de confirmation vous est envoyé sous quelques minutes.
          </p>
        </header>

        <ul className="grid w-full gap-3 sm:grid-cols-3">
          <Step icon={Mail} label="Confirmation" status="Maintenant" active />
          <Step icon={Package} label="Préparation" status="Sous 24h" />
          <Step icon={Truck} label="Livraison" status="2 à 4 jours" />
        </ul>

        <div className="border-encre/10 bg-ivoire-light border p-6 text-left">
          <p className="ui-caps text-or-dark">Discrétion garantie</p>
          <p className="text-encre/80 mt-2 text-sm">
            Votre colis est expédié dans un emballage neutre, sans logo ni mention du contenu. La
            trace bancaire n’indique pas le secteur ni le nom de la marque.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/compte/commandes"
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
          >
            Suivre ma commande
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/boutique"
            className="ui-caps text-encre/65 hover:text-or-dark underline underline-offset-4"
          >
            Continuer mes découvertes
          </Link>
        </div>

        <Wordmark as="p" size="sm" color="or" className="mt-8 opacity-70" />
      </div>
    </Container>
  );
}

function Step({
  icon: Icon,
  label,
  status,
  active = false,
}: {
  icon: typeof Mail;
  label: string;
  status: string;
  active?: boolean;
}) {
  return (
    <li
      className={`flex flex-col items-center gap-2 border p-5 ${
        active ? 'border-or bg-or/5' : 'border-encre/10 bg-ivoire'
      }`}
    >
      <Icon className={`size-5 ${active ? 'text-or-dark' : 'text-encre/50'}`} aria-hidden="true" />
      <p className="ui-caps text-encre">{label}</p>
      <p className="text-encre/65 text-xs">{status}</p>
    </li>
  );
}
