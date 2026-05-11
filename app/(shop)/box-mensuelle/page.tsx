import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Pause, Truck, Sparkles, Gift, Heart, Stamp } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { getMockSubscriptionPlans } from '@/lib/mock/subscription-plans';
import { formatPriceCents } from '@/lib/format';
import { cn } from '@/lib/utils';

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

const TESTIMONIALS = [
  {
    quote:
      '« Un cadeau qu\'on se fait. La carte signée à la main change tout — on attend la box comme on attendait le courrier autrefois. »',
    author: 'Camille, 38 ans',
    location: 'Paris',
  },
  {
    quote:
      '« J\'ai pris l\'annuel. Le calcul est simple : trois box premium offertes sur l\'année. Et la confidentialité est totale. »',
    author: 'Margaux, 42 ans',
    location: 'Lyon',
  },
  {
    quote:
      '« Mon mari et moi, c\'est devenu notre rendez-vous mensuel. La box arrive le premier jeudi — on l\'ouvre ensemble le soir. »',
    author: 'Hélène, 45 ans',
    location: 'Bordeaux',
  },
];

const FAQ = [
  {
    q: 'Comment fonctionne l\'abonnement ?',
    a: 'Vous choisissez un plan parmi les trois proposés. La première box est expédiée sous 5 jours ouvrés à compter du paiement. Les box suivantes sont expédiées chaque mois à la même date.',
  },
  {
    q: 'Puis-je sauter un mois ?',
    a: 'Oui, sans frais. Depuis votre compte, vous pouvez sauter le mois en cours jusqu\'à 48 heures avant la date de prélèvement. Le suivant reprend normalement.',
  },
  {
    q: 'Quelle est la durée d\'engagement ?',
    a: 'Aucune. Vous pouvez annuler depuis votre compte à tout moment, en deux clics. Le remboursement de la dernière box n\'est possible que si elle n\'a pas encore été expédiée.',
  },
  {
    q: 'Comment se passe la livraison ?',
    a: 'Colissimo Suivi 48h pour la France, Mondial Relay pour les points relais, DHL Express pour la Suisse. Boîte neutre signée Atelier Frisson sans aucune mention extérieure du contenu.',
  },
  {
    q: 'Puis-je personnaliser le contenu ?',
    a: 'Vous remplissez un court questionnaire de préférences à l\'inscription (niveau d\'expérience, exclusions, vibe). Le contenu reste une surprise, mais respecte vos choix.',
  },
  {
    q: 'L\'abonnement est-il facturé en une seule fois ?',
    a: 'Au choix : mensuel (prélèvement chaque mois) ou annuel (10 à 15 % de remise selon le plan, prélevé en une fois).',
  },
];

export default function BoxMensuellePage(): React.ReactElement {
  const plans = getMockSubscriptionPlans();

  return (
    <>
      {/* HERO */}
      <section className="bg-ivoire-light relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(201,163,107,0.1)_0%,transparent_60%)]"
        />
        <Container className="relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">
              Abonnement mensuel · 1 200+ abonnées
            </p>
            <h1 className="font-display text-noir mt-4 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-medium">
              La box du{' '}
              <span className="font-italic-editorial text-or-dark">rituel intime</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <p className="font-italic-editorial text-encre/75 mt-6 text-lg md:text-xl">
              Chaque mois, un nouveau chapitre — dans une boîte signée à la main.
            </p>
            <p className="text-encre/70 mx-auto mt-6 max-w-2xl text-base leading-relaxed">
              Trois plans, sans engagement, livraison neutre. Pour entamer un rituel à deux, ou pour
              le renouveler.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#plans"
                className="ui-caps-md bg-noir text-ivoire hover:bg-rouge inline-flex items-center gap-3 px-8 py-4 transition-colors"
              >
                Choisir mon plan
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#fonctionnement"
                className="ui-caps-md text-noir border-noir/30 hover:border-noir inline-flex items-center gap-3 border px-8 py-4 transition-colors"
              >
                Comment ça marche
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* PILIERS */}
      <section id="fonctionnement" className="bg-ivoire">
        <Container className="py-16 md:py-20">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {PILLARS.map((pillar) => (
              <li key={pillar.label} className="text-center">
                <pillar.icon className="text-or mx-auto h-8 w-8" aria-hidden="true" />
                <h3 className="font-display text-noir mt-4 text-lg">{pillar.label}</h3>
                <p className="text-encre/70 mt-2 text-sm leading-relaxed">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* « Ce mois-ci dans la box » — preview content */}
      <section className="bg-ivoire-light relative isolate overflow-hidden py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(ellipse_at_50%_30%,rgba(201,163,107,0.15)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="ui-caps text-or-dark">Chapitre n°5 · mai 2026</p>
            <h2 className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl">
              Ce mois-ci dans la box{' '}
              <span className="font-italic-editorial text-or-dark">Premium</span>
            </h2>
            <p className="font-italic-editorial text-encre/70 mt-4 text-base">
              Thème : « Le sillage » — soie, parfum de Grasse, geste lent.
            </p>
          </div>

          <ul className="bg-or/15 mx-auto grid max-w-4xl grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Étincelle compact',
                body: 'Bullet poche, étui lin écru.',
              },
              {
                label: 'Bandeau de soie',
                body: 'Soie 22 momme + velours noir.',
              },
              {
                label: 'Huile capsule',
                body: 'Bois de oud + rose poudrée Grasse.',
              },
              {
                label: 'Carte rituel',
                body: 'Texte signé Sophie Antonelli, sexologue.',
              },
            ].map((item, i) => (
              <li
                key={item.label}
                className="bg-ivoire flex flex-col gap-2 p-6 md:p-7"
              >
                <span className="font-display tabular text-or-dark text-2xl font-medium">
                  {`0${i + 1}`.slice(-2)}
                </span>
                <h3 className="font-display text-noir text-base font-medium">{item.label}</h3>
                <p className="text-encre/70 text-sm leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>

          <p className="text-encre/55 mt-8 text-center text-xs">
            Disponible jusqu\'au 28 mai 2026 — la box n°6 (juin) ouvrira le 1ᵉʳ juin.
          </p>
        </Container>
      </section>

      {/* PLANS */}
      <section id="plans" className="bg-ivoire">
        <Container className="py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-noir text-3xl md:text-4xl">
              Trois plans.{' '}
              <span className="font-italic-editorial text-or-dark">Aucune contrainte.</span>
            </h2>
            <p className="text-encre/70 mt-4 text-base leading-relaxed">
              Engagement : zéro. Annulation : deux clics. Pause : un mois ou plus. Vous décidez.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, idx) => {
              const isFeatured = idx === 1;
              const annualPrice = Math.round(
                ((plan.priceCents * 12) / 100) * (1 - plan.annualDiscountPercent / 100),
              );

              return (
                <article
                  key={plan.id}
                  className={cn(
                    'relative flex flex-col p-8 md:p-10',
                    isFeatured
                      ? 'bg-noir text-ivoire -translate-y-2 shadow-lg'
                      : 'bg-ivoire-light text-encre border-encre/10 border',
                  )}
                >
                  {isFeatured && (
                    <span className="bg-or text-noir ui-caps absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] tracking-widest">
                      Le plus choisi
                    </span>
                  )}
                  <h3 className="font-display text-2xl md:text-3xl">{plan.name}</h3>
                  <p
                    className={cn(
                      'font-italic-editorial mt-2 text-base',
                      isFeatured ? 'text-ivoire/70' : 'text-encre/65',
                    )}
                  >
                    {plan.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display tabular text-4xl md:text-5xl">
                      {formatPriceCents(plan.priceCents).replace(',00', '')}
                    </span>
                    <span
                      className={cn(
                        'text-sm',
                        isFeatured ? 'text-ivoire/60' : 'text-encre/55',
                      )}
                    >
                      / mois
                    </span>
                  </div>
                  <p className="text-or ui-caps mt-1 text-xs tracking-widest">
                    Ou {annualPrice} € / an (−{plan.annualDiscountPercent} %)
                  </p>

                  <p
                    className={cn(
                      'mt-6 text-sm leading-relaxed',
                      isFeatured ? 'text-ivoire/85' : 'text-encre/80',
                    )}
                  >
                    {plan.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{plan.itemsPerBox} pièces par box</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Sans engagement, pause ou annulation libre</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Livraison Colissimo Suivi 48h incluse</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Pièces capsules réservées aux abonnées</span>
                    </li>
                    {isFeatured ? (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Cosmétique intime incluse 1 mois sur 2</span>
                      </li>
                    ) : null}
                  </ul>

                  <Link
                    href={`/checkout?subscribe=${plan.slug}`}
                    className={cn(
                      'ui-caps-md mt-10 inline-flex w-full items-center justify-center gap-2 px-6 py-3 transition-colors',
                      isFeatured
                        ? 'bg-or text-noir hover:bg-or-light'
                        : 'bg-noir text-ivoire hover:bg-rouge',
                    )}
                  >
                    Choisir {plan.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <p className="text-encre/60 mt-10 text-center text-xs">
            TVA incluse · Paiement sécurisé · Données chiffrées · Annulation deux clics
          </p>
        </Container>
      </section>

      {/* TÉMOIGNAGES — social proof premium */}
      <section className="bg-ivoire-light py-16 md:py-20">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="ui-caps text-or-dark">Témoignages abonnées</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <h2 className="font-display text-noir mt-5 text-3xl md:text-4xl">
              Ce qu\'en disent nos{' '}
              <span className="font-italic-editorial text-or-dark">premières abonnées</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.author} delay={i * 100} as="div">
                <li>
                  <figure className="bg-ivoire border-encre/10 flex h-full flex-col gap-5 border p-7">
                    <Stamp className="text-or size-5 stroke-[1.5]" aria-hidden="true" />
                    <blockquote className="font-italic-editorial text-encre/85 text-base leading-relaxed">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-auto">
                      <p className="ui-caps text-or-dark text-[10px] tracking-widest">
                        {t.author} · {t.location}
                      </p>
                    </figcaption>
                  </figure>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* CADEAU */}
      <section id="cadeau" className="bg-rouge text-ivoire">
        <Container className="py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Gift className="text-or h-10 w-10" aria-hidden="true" />
              <h2 className="font-display mt-6 text-3xl md:text-4xl">Offrir l\'abonnement</h2>
              <p className="font-italic-editorial text-ivoire/80 mt-4 text-lg">
                Pour un anniversaire, un mariage, une renaissance.
              </p>
              <p className="text-ivoire/80 mt-6 text-base leading-relaxed">
                Choisissez la durée (3, 6 ou 12 mois), composez la carte, prélèvement immédiat,
                envoi de la box à la date de votre choix. Aucun renouvellement automatique.
              </p>
              <Link
                href="/cartes-cadeaux"
                className="ui-caps-md bg-ivoire text-noir hover:bg-or hover:text-noir mt-8 inline-flex items-center gap-3 px-8 py-3 transition-colors"
              >
                Offrir une box
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-or/30 hidden border-l pl-10 md:block">
              <p className="font-italic-editorial text-ivoire/90 text-2xl leading-relaxed">
                « J\'ai offert la box Trio à mes meilleures amies pour leur anniversaire. La carte
                de Sophie Antonelli, sexologue, était parfaite. »
              </p>
              <p className="text-or ui-caps mt-4 text-xs tracking-widest">
                — Camille, 38 ans, Paris
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ivoire-light">
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
