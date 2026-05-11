import type { Metadata } from 'next';
import {
  Heart,
  Gift,
  Sparkles,
  Mail,
  Camera,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { AmbassadorApplicationForm } from '@/components/marketing/AmbassadorApplicationForm';

export const metadata: Metadata = {
  title: 'Programme ambassadrice — Atelier Frisson',
  description:
    'Dix ambassadrices pour le lancement Atelier Frisson. Coffret offert, partenariat sur-mesure, vraie maison française du rituel intime à deux.',
  alternates: { canonical: '/ambassadrices' },
  openGraph: {
    type: 'website',
    title: 'Programme ambassadrice — Atelier Frisson',
    description: '10 ambassadrices pour le lancement. Coffret offert, partenariat sur-mesure.',
  },
};

const PROFILES_SOUGHT = [
  {
    icon: Heart,
    title: 'Couples authentiques',
    body: 'Lifestyle couple 30-50 ans, contenu Instagram régulier — la vraie vie d\'un duo qui a une histoire.',
  },
  {
    icon: Sparkles,
    title: 'Beauty & wellness éditorial',
    body: 'Voix posées sur le rituel, la matière, le geste lent. Pas de pression commerciale. Aesop, Byredo, Le Labo dans les références.',
  },
  {
    icon: Camera,
    title: 'Fashion & lingerie',
    body: 'Œil aiguisé sur la matière (soie, dentelle Caudry, satin). Photographie premium ou direction artistique.',
  },
  {
    icon: Award,
    title: 'Sexologie & éducation',
    body: 'Sexologues, gynécologues, autrices, podcasteuses. Voix légitimes pour parler de désir au long-terme.',
  },
] as const;

const WHAT_WE_OFFER = [
  {
    title: 'Coffret offert · valeur 199-299 €',
    body: 'Au choix : Coffret Soirée à Deux, Évasion Week-end ou Lune de Miel. Boîte écrin signée à la main, livrée à votre adresse.',
  },
  {
    title: 'Code parrainage personnalisé',
    body: '20 % de remise pour votre audience. Vous touchez 15 € de commission par commande référée (versée mensuellement).',
  },
  {
    title: 'Partenariat sur-mesure',
    body: 'Création de contenus rémunérée selon votre tarif (entre 200 € et 2000 € par post selon votre audience). Briefing co-construit.',
  },
  {
    title: 'Accès VIP avant lancement',
    body: 'Découverte du catalogue 2 semaines avant l\'ouverture publique. Possibilité de proposer un produit qui manque.',
  },
] as const;

const WHAT_WE_EXPECT = [
  {
    n: '01',
    title: 'Authenticité',
    body: 'Vous n\'êtes pas obligée d\'aimer chaque produit. Si quelque chose ne vous parle pas, on en parle ensemble — on ne forcera jamais.',
  },
  {
    n: '02',
    title: 'Régularité',
    body: '1 publication minimum lors du lancement (post + story) + 2 publications/an. Pas de calendrier intrusif.',
  },
  {
    n: '03',
    title: 'Transparence',
    body: 'Mention partenariat selon les règles ARPP/CNIL — c\'est légal et c\'est aussi votre crédibilité.',
  },
  {
    n: '04',
    title: 'Confidentialité',
    body: 'Pas de divulgation des prochaines pièces avant ouverture publique. Réciproquement, on protège votre image (briefings privés).',
  },
] as const;

const PROCESS = [
  {
    step: '1',
    title: 'Vous candidatez',
    body: 'Formulaire ci-dessous (5 minutes). On regarde Instagram + audience + ton.',
    icon: Mail,
  },
  {
    step: '2',
    title: 'Réponse < 7 jours',
    body: 'Un mail personnel d\'Odelie. On vous dit oui, non, ou « pas tout de suite ». Toujours avec un mot.',
    icon: Clock,
  },
  {
    step: '3',
    title: 'Visio de 30 minutes',
    body: 'Si oui, on cale ensemble : briefing, calendrier, conditions financières. Pas de contrat-type, c\'est sur-mesure.',
    icon: Camera,
  },
  {
    step: '4',
    title: 'Coffret + accompagnement',
    body: 'Envoi du coffret + photo brief + ressources (visuels HD, manifeste, biographies sourcées).',
    icon: Gift,
  },
] as const;

export default function AmbassadricesPage() {
  return (
    <>
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Ambassadrices', href: '/ambassadrices' },
        ]}
        className="mx-auto max-w-7xl px-6 pt-10 md:px-10"
      />

      {/* HERO premium */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_25%_30%,rgba(201,163,107,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_85%_70%,rgba(139,20,36,0.15)_0%,transparent_55%)]"
        />
        <Container className="relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or text-xs tracking-[0.3em]">Programme ambassadrice</p>
            <h1 className="font-display mt-4 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-medium">
              Dix voix{' '}
              <span className="font-italic-editorial text-or">pour le lancement.</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <p className="font-italic-editorial text-or-light mt-6 text-lg md:text-xl">
              Pas du marketing — une histoire écrite à plusieurs.
            </p>
            <p className="text-ivoire/80 mt-6 text-base leading-relaxed md:text-lg">
              Pour le lancement d\'Atelier Frisson en juin 2026, on cherche dix ambassadrices —
              pas pour faire des publicités, pour participer à la fondation d\'une maison.
              Coffret offert, partenariat sur-mesure, vraie collaboration.
            </p>
          </div>
        </Container>
      </section>

      {/* Profils recherchés */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Profils recherchés</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                Quatre univers,{' '}
                <span className="font-italic-editorial text-or-dark">une exigence commune</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
              <p className="font-italic-editorial text-encre/70 max-w-xl text-base md:text-lg">
                Audience minimale : 5 000 abonnées qualifiées. La taille n\'est pas le critère
                principal — c\'est la qualité du lien.
              </p>
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2">
            {PROFILES_SOUGHT.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-4 p-7 md:p-9">
                  <p.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
                  <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="font-italic-editorial text-encre/80 text-base leading-relaxed">
                    {p.body}
                  </p>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Ce qu'on offre + ce qu'on attend */}
      <section className="bg-ivoire-light py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <div>
                <p className="ui-caps text-or-dark">Ce que vous obtenez</p>
                <h2 className="font-display text-noir mt-4 text-3xl font-medium md:text-4xl">
                  Quatre éléments tangibles
                </h2>
                <Fleuron variant="divider" size="md" color="or" className="mt-3 opacity-70" />
                <ul className="mt-8 flex flex-col gap-6">
                  {WHAT_WE_OFFER.map((item) => (
                    <li
                      key={item.title}
                      className="border-encre/10 bg-ivoire flex flex-col gap-2 border-l-2 border-l-or-dark/60 pl-5"
                    >
                      <h3 className="font-display text-noir text-lg font-medium">{item.title}</h3>
                      <p className="text-encre/75 text-sm leading-relaxed">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div>
                <p className="ui-caps text-or-dark">Ce qu\'on attend</p>
                <h2 className="font-display text-noir mt-4 text-3xl font-medium md:text-4xl">
                  Quatre engagements simples
                </h2>
                <Fleuron variant="divider" size="md" color="or" className="mt-3 opacity-70" />
                <ul className="mt-8 flex flex-col gap-6">
                  {WHAT_WE_EXPECT.map((item) => (
                    <li
                      key={item.title}
                      className="border-encre/10 bg-ivoire flex flex-col gap-2 border-l-2 border-l-or-dark/60 pl-5"
                    >
                      <p className="ui-caps text-or-dark text-[10px] tracking-widest">
                        {item.n}
                      </p>
                      <h3 className="font-display text-noir text-lg font-medium">{item.title}</h3>
                      <p className="text-encre/75 text-sm leading-relaxed">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Le process</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                De la candidature{' '}
                <span className="font-italic-editorial text-or-dark">au coffret</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 70} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-3 p-6 md:p-7">
                  <span className="font-display tabular text-or-dark text-3xl font-medium">
                    {step.step}
                  </span>
                  <step.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
                  <h3 className="font-display text-noir text-base leading-tight font-medium">
                    {step.title}
                  </h3>
                  <p className="text-encre/75 text-sm leading-relaxed">{step.body}</p>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Form candidature */}
      <section
        id="candidature"
        className="bg-ivoire-light relative isolate overflow-hidden py-20 md:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_50%_30%,rgba(201,163,107,0.18)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">Candidature</p>
            <h2 className="font-display text-noir mt-4 text-3xl font-medium md:text-4xl lg:text-5xl">
              Cinq minutes pour candidater
            </h2>
            <p className="text-encre/70 mt-6 text-base leading-relaxed md:text-lg">
              On lit chaque candidature en personne. Réponse sous 7 jours, toujours avec un mot.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <AmbassadorApplicationForm />
          </div>

          <p className="text-encre/55 mx-auto mt-10 max-w-md text-center text-xs leading-relaxed">
            Vos données sont conservées 12 mois (RGPD). Si la candidature n\'aboutit pas, on les
            supprime à votre demande.
          </p>
        </Container>
      </section>

      {/* CTA preview lancement */}
      <section className="bg-rouge text-ivoire relative isolate overflow-hidden py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_70%_30%,rgba(255,220,180,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_15%_75%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
        />
        <Container className="relative max-w-3xl text-center">
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-3xl font-medium md:text-4xl">
            Pas ambassadrice, mais{' '}
            <span className="font-italic-editorial text-or">curieuse ?</span>
          </h2>
          <p className="font-italic-editorial text-ivoire/85 mt-4 text-lg">
            Rejoignez la liste avant-première — −15 % à l\'ouverture, accès VIP 48 h avant le
            public.
          </p>
          <a
            href="/lancement#inscription"
            className="ui-caps bg-or text-noir hover:bg-or-light mt-8 inline-flex items-center gap-3 px-8 py-3 transition-colors"
          >
            Liste avant-première
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </Container>
      </section>

      {/* Wordmark footer */}
      <section aria-hidden="true" className="bg-ivoire py-12 text-center">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-80" />
        <Wordmark as="p" size="sm" color="noir" className="mt-3 opacity-70" />
        <p className="font-italic-editorial text-encre/55 mt-2 text-xs">
          Maison du rituel intime — Paris · Lancement juin 2026
        </p>
      </section>
    </>
  );
}
