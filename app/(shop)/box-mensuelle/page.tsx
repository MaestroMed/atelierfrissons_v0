import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Pause, Truck, Sparkles, Gift, Heart } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { getMockSubscriptionPlans } from '@/lib/mock/subscription-plans';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Box Mensuelle Rituel Frisson — abonnement intime discret',
  description:
    'Recevez chaque mois 3 à 5 pièces sélectionnées : objet, lingerie capsule, cosmétique intime, carte rituel. Sans engagement, livraison discrète, dès 39 € / mois.',
  alternates: { canonical: '/box-mensuelle' },
  openGraph: {
    type: 'website',
    title: 'Box Mensuelle Rituel Frisson — Atelier Frisson',
    description:
      'Trois plans, sans engagement, livraison neutre. Le rituel intime à deux, renouvelé chaque mois.',
  },
};

const PILLARS = [
  {
    icon: Sparkles,
    label: 'Sélection thématique',
    body: 'Chaque mois, un fil conducteur — saison, couleur, matière, occasion.',
  },
  {
    icon: Truck,
    label: 'Livraison discrète',
    body: 'Boîte ivoire neutre, aucun logo extérieur, signée à la main.',
  },
  {
    icon: Pause,
    label: 'Sans engagement',
    body: 'Mettez en pause un mois, annulez en deux clics, reprenez quand vous voulez.',
  },
  {
    icon: Heart,
    label: 'Réservé aux abonnées',
    body: 'Pièces capsules introuvables au catalogue, conçues pour la box.',
  },
];

const FAQ = [
  {
    q: 'Comment fonctionne l’abonnement ?',
    a: 'Vous choisissez un plan parmi les trois proposés. La première box est expédiée sous 5 jours ouvrés à compter du paiement. Les box suivantes sont expédiées chaque mois à la même date.',
  },
  {
    q: 'Puis-je sauter un mois ?',
    a: 'Oui, sans frais. Depuis votre compte, vous pouvez sauter le mois en cours jusqu’à 48 heures avant la date de prélèvement. Le suivant reprend normalement.',
  },
  {
    q: 'Quelle est la durée d’engagement ?',
    a: 'Aucune. Vous pouvez annuler depuis votre compte à tout moment, en deux clics. Le remboursement de la dernière box n’est possible que si elle n’a pas encore été expédiée.',
  },
  {
    q: 'Comment se passe la livraison ?',
    a: 'Colissimo Suivi 48h pour la France, Mondial Relay pour les points relais, DHL Express pour la Suisse. Boîte neutre signée Atelier Frisson sans aucune mention extérieure du contenu.',
  },
  {
    q: 'Puis-je personnaliser le contenu ?',
    a: 'Vous remplissez un court questionnaire de préférences à l’inscription (niveau d’expérience, exclusions, vibe). Le contenu reste une surprise, mais respecte vos choix.',
  },
  {
    q: 'L’abonnement est-il facturé en une seule fois ?',
    a: 'Au choix : mensuel (prélèvement chaque mois) ou annuel (10 à 15 % de remise selon le plan, prélevé en une fois).',
  },
];

export default function BoxMensuellePage(): React.ReactElement {
  const plans = getMockSubscriptionPlans();

  return (
    <>
      {/* HERO ── ivoire + or, signature visuelle Atelier Frisson */}
      <section className="bg-ivoire-light relative overflow-hidden">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron className="text-or mx-auto mb-6 h-6 w-auto" />
            <p className="text-or font-body text-xs tracking-[0.3em] uppercase">
              Abonnement mensuel
            </p>
            <h1 className="font-display text-noir-velours mt-4 text-4xl leading-tight md:text-6xl">
              La box du rituel intime
            </h1>
            <p className="font-display text-noir-light mt-6 text-xl italic md:text-2xl">
              Chaque mois, un nouveau chapitre — dans une boîte signée à la main.
            </p>
            <p className="text-noir-velours/80 font-body mx-auto mt-8 max-w-2xl text-base leading-relaxed md:text-lg">
              Trois plans, sans engagement, livraison neutre. Pour entamer un rituel à deux, ou pour
              le renouveler.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#plans"
                className="bg-rouge text-ivoire hover:bg-rouge-dark font-body inline-flex items-center gap-2 rounded-sm px-8 py-3 text-sm font-medium tracking-wider uppercase transition"
              >
                Choisir mon plan
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#fonctionnement"
                className="text-noir-velours border-noir-velours/30 hover:border-noir-velours font-body inline-flex items-center gap-2 rounded-sm border px-8 py-3 text-sm font-medium tracking-wider uppercase transition"
              >
                Comment ça marche
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* PILIERS ── 4 raisons de s'abonner */}
      <section id="fonctionnement" className="bg-ivoire">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="text-center">
                <pillar.icon className="text-or mx-auto h-8 w-8" aria-hidden="true" />
                <h3 className="font-display text-noir-velours mt-4 text-lg">{pillar.label}</h3>
                <p className="text-noir-velours/70 font-body mt-2 text-sm leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PLANS ── 3 cards comparatives, plan central mis en avant */}
      <section id="plans" className="bg-ivoire-light">
        <Container className="py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Fleuron className="text-or mx-auto mb-4 h-5 w-auto" />
            <h2 className="font-display text-noir-velours text-3xl md:text-4xl">
              Trois plans. Aucune contrainte.
            </h2>
            <p className="text-noir-velours/70 font-body mt-4 text-base leading-relaxed">
              Engagement : zéro. Annulation : deux clics. Pause : un mois ou plus. Vous décidez.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, idx) => {
              const isFeatured = idx === 1; // Plan Premium mis en avant
              const annualPrice = Math.round(
                ((plan.priceCents * 12) / 100) * (1 - plan.annualDiscountPercent / 100),
              );

              return (
                <article
                  key={plan.id}
                  className={
                    isFeatured
                      ? 'bg-noir-velours text-ivoire relative -translate-y-2 rounded-sm p-8 shadow-lg md:p-10'
                      : 'bg-ivoire text-noir-velours border-noir-velours/10 rounded-sm border p-8 md:p-10'
                  }
                >
                  {isFeatured && (
                    <span className="bg-or text-noir-velours font-body absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                      Le plus choisi
                    </span>
                  )}
                  <h3 className="font-display text-2xl md:text-3xl">{plan.name}</h3>
                  <p
                    className={
                      isFeatured
                        ? 'text-ivoire/70 font-display mt-2 text-base italic'
                        : 'text-noir-velours/70 font-display mt-2 text-base italic'
                    }
                  >
                    {plan.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl tabular-nums md:text-5xl">
                      {formatPriceCents(plan.priceCents, 'EUR').replace(',00', '')}
                    </span>
                    <span
                      className={
                        isFeatured
                          ? 'text-ivoire/60 font-body text-sm'
                          : 'text-noir-velours/60 font-body text-sm'
                      }
                    >
                      / mois
                    </span>
                  </div>
                  <p
                    className={
                      isFeatured
                        ? 'text-or font-body mt-1 text-xs tracking-wider uppercase'
                        : 'text-or font-body mt-1 text-xs tracking-wider uppercase'
                    }
                  >
                    Ou {annualPrice} € / an (−{plan.annualDiscountPercent} %)
                  </p>

                  <p
                    className={
                      isFeatured
                        ? 'text-ivoire/85 font-body mt-6 text-sm leading-relaxed'
                        : 'text-noir-velours/80 font-body mt-6 text-sm leading-relaxed'
                    }
                  >
                    {plan.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    <li className="font-body flex items-start gap-2 text-sm">
                      <Check
                        className={
                          isFeatured
                            ? 'text-or mt-0.5 h-4 w-4 shrink-0'
                            : 'text-or mt-0.5 h-4 w-4 shrink-0'
                        }
                        aria-hidden="true"
                      />
                      <span>{plan.itemsPerBox} pièces par box</span>
                    </li>
                    <li className="font-body flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Sans engagement, pause ou annulation libre</span>
                    </li>
                    <li className="font-body flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Livraison Colissimo Suivi 48h incluse</span>
                    </li>
                    <li className="font-body flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Pièces capsules réservées aux abonnées</span>
                    </li>
                  </ul>

                  <Link
                    href={`/checkout?subscribe=${plan.slug}`}
                    className={
                      isFeatured
                        ? 'bg-or text-noir-velours hover:bg-or-light font-body mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wider uppercase transition'
                        : 'bg-noir-velours text-ivoire hover:bg-noir-light font-body mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wider uppercase transition'
                    }
                  >
                    Choisir {plan.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <p className="text-noir-velours/60 font-body mt-10 text-center text-xs">
            TVA incluse · Paiement sécurisé · Données chiffrées · Annulation deux clics
          </p>
        </Container>
      </section>

      {/* CADEAU ── encart pour offrir l'abonnement */}
      <section className="bg-rouge text-ivoire">
        <Container className="py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Gift className="text-or h-10 w-10" aria-hidden="true" />
              <h2 className="font-display mt-6 text-3xl md:text-4xl">Offrir l’abonnement</h2>
              <p className="font-display text-ivoire/80 mt-4 text-lg italic">
                Pour un anniversaire, un mariage, une renaissance.
              </p>
              <p className="text-ivoire/80 font-body mt-6 text-base leading-relaxed">
                Choisissez la durée (3, 6 ou 12 mois), composez la carte, prélèvement immédiat,
                envoi de la box à la date de votre choix. Aucun renouvellement automatique.
              </p>
              <Link
                href="/cartes-cadeaux"
                className="bg-ivoire text-noir-velours hover:bg-ivoire-dark font-body mt-8 inline-flex items-center gap-2 rounded-sm px-8 py-3 text-sm font-medium tracking-wider uppercase transition"
              >
                Offrir une box
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-or/30 hidden border-l pl-10 md:block">
              <p className="font-display text-ivoire/90 text-2xl leading-relaxed italic">
                « J’ai offert la box Trio à mes meilleures amies pour leur anniversaire. La carte de
                Pierre Assouline était parfaite. »
              </p>
              <p className="text-or font-body mt-4 text-xs tracking-wider uppercase">
                — Témoignage Camille, 38 ans, Paris
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ ── accordéon natif details/summary */}
      <section className="bg-ivoire-light">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Fleuron className="text-or mx-auto mb-4 h-5 w-auto" />
            <h2 className="font-display text-noir-velours text-center text-3xl md:text-4xl">
              Questions fréquentes
            </h2>
            <div className="mt-12 space-y-2">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border-noir-velours/10 border-b py-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-noir-velours font-display flex cursor-pointer items-center justify-between text-lg">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="text-or ml-4 text-2xl leading-none transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-noir-velours/80 font-body mt-3 text-base leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
