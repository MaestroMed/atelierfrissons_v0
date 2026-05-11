import type { Metadata } from 'next';
import { Gift, Mail, CalendarHeart, Stamp } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { GiftCardForm } from '@/components/checkout/GiftCardForm';

export const metadata: Metadata = {
  title: 'Cartes cadeaux — Atelier Frisson',
  description:
    'Offrez une carte cadeau Atelier Frisson — 50, 100, 150 ou 200 €. Valable 12 mois, envoyée par email à la date de votre choix. Boîte écrin signée pour la version physique.',
  alternates: { canonical: '/cartes-cadeaux' },
  openGraph: {
    type: 'website',
    title: 'Cartes cadeaux — Atelier Frisson',
    description:
      'Cartes cadeaux 50, 100, 150, 200 € — valables 12 mois, envoi à la date de votre choix.',
  },
};

const STEPS = [
  {
    icon: Gift,
    label: 'Choisir le montant',
    body: '50, 100, 150 ou 200 € — ou un montant personnalisé entre 30 et 500 €.',
  },
  {
    icon: Mail,
    label: 'Composer la carte',
    body: 'Email destinataire, nom, message — texte signé Sophie Antonelli (sexologue) inclus en option.',
  },
  {
    icon: CalendarHeart,
    label: 'Choisir la date d\'envoi',
    body: 'Aujourd\'hui, à minuit le jour J, ou jusqu\'à 12 mois plus tard. Aucun renouvellement automatique.',
  },
  {
    icon: Stamp,
    label: 'Recevoir la confirmation',
    body: 'Reçu PDF immédiat. Le destinataire reçoit son code à la date programmée + une carte cotton letterpress en option (+9 €).',
  },
] as const;

const FAQ = [
  {
    q: 'Combien de temps la carte est-elle valable ?',
    a: '12 mois à compter de la date d\'envoi au destinataire. Au-delà, le solde reste utilisable mais nous demandons un email de réactivation.',
  },
  {
    q: 'Le destinataire peut-il l\'utiliser en plusieurs fois ?',
    a: 'Oui. Le solde décrémente à chaque commande, jusqu\'à épuisement. La carte fonctionne comme un avoir — le destinataire peut combiner avec une autre méthode de paiement.',
  },
  {
    q: 'Et si la carte n\'arrive pas ?',
    a: 'Nous renvoyons gratuitement. Vous pouvez aussi consulter le statut depuis votre compte → Mes commandes → carte cadeau.',
  },
  {
    q: 'Peut-on offrir une box mensuelle plutôt qu\'une carte ?',
    a: 'Oui — voir Box Mensuelle → Offrir l\'abonnement (3, 6 ou 12 mois). C\'est différent : pas de renouvellement automatique, contrairement à un abonnement classique.',
  },
];

export default function CartesCadeauxPage(): React.ReactElement {
  return (
    <>
      {/* HERO premium */}
      <section className="bg-ivoire-light relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(201,163,107,0.12)_0%,transparent_60%)]"
        />
        <Container className="relative py-16 md:py-24">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Cartes cadeaux', href: '/cartes-cadeaux' },
            ]}
            className="mb-12"
          />
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">
              Le geste, sans choisir le geste
            </p>
            <h1 className="font-display text-noir mt-4 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-medium">
              Cartes{' '}
              <span className="font-italic-editorial text-or-dark">cadeaux</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <p className="font-italic-editorial text-encre/75 mt-6 text-lg md:text-xl">
              Quand on n\'ose pas choisir, on offre la liberté de choisir.
            </p>
            <p className="text-encre/70 mx-auto mt-6 max-w-2xl text-base leading-relaxed">
              50, 100, 150 ou 200 € — ou un montant personnalisé. Envoi par email à la date que vous
              choisissez, ou en version physique cotton letterpress (+9 €). Valable 12 mois,
              utilisable en plusieurs fois, sans frais cachés.
            </p>
          </div>
        </Container>
      </section>

      {/* 4 ÉTAPES */}
      <section className="bg-ivoire">
        <Container className="py-16 md:py-20">
          <ul className="bg-or/15 mx-auto grid max-w-5xl grid-cols-2 gap-px md:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.label} className="bg-ivoire flex flex-col gap-3 p-6 md:p-7">
                <span className="font-display tabular text-or-dark text-2xl font-medium">
                  {`0${i + 1}`.slice(-2)}
                </span>
                <step.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
                <h3 className="font-display text-noir text-base font-medium">{step.label}</h3>
                <p className="text-encre/70 text-sm leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FORMULAIRE */}
      <section className="bg-ivoire-light">
        <Container className="py-16 md:py-24">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="ui-caps text-or-dark">Composer la carte</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <h2 className="font-display text-noir mt-5 text-3xl md:text-4xl">
              Quatre minutes,{' '}
              <span className="font-italic-editorial text-or-dark">aucun emballage à faire</span>
            </h2>
          </div>

          <div className="mx-auto max-w-2xl">
            <GiftCardForm />
          </div>

          <p className="text-encre/55 mx-auto mt-10 max-w-md text-center text-xs leading-relaxed">
            Paiement sécurisé via Stripe ou CCBill selon le montant. Reçu PDF envoyé immédiatement à
            l\'expéditeur. Code carte envoyé au destinataire à la date programmée.
          </p>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ivoire">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-noir text-center text-3xl md:text-4xl">
              Questions fréquentes
            </h2>
            <div className="mt-12 space-y-2">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border-encre/10 border-b py-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-noir font-display flex cursor-pointer items-center justify-between text-lg">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="text-or ml-4 text-2xl leading-none transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-encre/80 mt-3 text-base leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
