import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Gift, Heart, Mail, Shield, Stamp, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { WaitlistForm } from '@/components/marketing/WaitlistForm';
import { JsonLd } from '@/components/shared/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Avant-première — Atelier Frisson · Inscription liste',
  description:
    'Maison française du rituel intime à deux. Liste d\'attente avant ouverture publique : −15 % sur la 1ère commande, accès VIP aux pièces signature avant tout le monde.',
  alternates: { canonical: '/lancement' },
  openGraph: {
    type: 'website',
    title: 'Atelier Frisson — Avant-première',
    description: '−15 % sur la 1ère commande pour les inscrites en avant-première.',
  },
};

const PROMISES = [
  {
    icon: Gift,
    title: '−15 % sur la 1ère commande',
    body: 'Code unique envoyé à l\'ouverture — valable une seule fois, sur tout le catalogue.',
  },
  {
    icon: Calendar,
    title: 'Accès VIP 48 h en avance',
    body: 'Vous découvrez la collection avant l\'ouverture publique. Les pièces capsule partent vite.',
  },
  {
    icon: Mail,
    title: 'Une lettre éditoriale',
    body: 'Ni urgent, ni intrusif. Une fois par mois, on partage les coulisses de la maison + un guide rituel.',
  },
] as const;

const ENGAGEMENTS = [
  {
    icon: Stamp,
    title: 'Le geste signé',
    body: 'Boîte écrin ivoire, sceau cire, carte cotton letterpress. Aucune mention extérieure du contenu.',
  },
  {
    icon: Shield,
    title: 'Matières nobles',
    body: 'Silicone médical ISO 10993, soie 22 momme Italie, dentelle Caudry, parfumerie Grasse.',
  },
  {
    icon: Truck,
    title: 'Livraison discrète',
    body: 'Colissimo Suivi 48 h. Trace bancaire générique, email expéditeur neutre.',
  },
  {
    icon: Heart,
    title: 'Vie privée respectée',
    body: 'Aucune revente de données, jamais. Tracking publicitaire sur consentement strict uniquement.',
  },
] as const;

/**
 * Mock counter — sera remplacé par lecture DB
 * `SELECT COUNT(*) FROM newsletter_subscribers WHERE source = 'waitlist'`
 * une fois Supabase live.
 *
 * Stub déterministe basé sur la date du jour pour donner un effet "compteur"
 * crédible en dev. Évolue lentement (~3-8 inscrites/jour visibles).
 */
function getWaitlistCount(): number {
  const baseLine = 1247;
  const daysSinceLaunch = Math.floor(
    (Date.now() - new Date('2026-04-01').getTime()) / (24 * 60 * 60 * 1000),
  );
  return baseLine + daysSinceLaunch * 5;
}

export default function LancementPage() {
  const count = getWaitlistCount();

  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />

      {/* HERO premium */}
      <section className="bg-rouge text-ivoire relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,220,180,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_75%_70%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:3px_3px]"
        />
        <Container className="relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-6 opacity-85" />
            <p className="ui-caps text-or text-xs tracking-[0.3em]">
              Avant-première — ouverture juin 2026
            </p>
            <Wordmark
              as="h1"
              size="hero"
              color="or"
              layout="stacked"
              animate
              className="mt-6 [text-shadow:0_2px_24px_rgba(10,7,6,0.4)]"
            />
            <Fleuron
              variant="divider"
              size="md"
              color="or"
              className="mx-auto mt-6 opacity-70"
            />
            <p className="font-italic-editorial text-or mt-8 text-xl leading-relaxed md:text-2xl lg:text-3xl">
              Le rituel intime à deux —{' '}
              <span className="text-or-light">choisi comme une cravate de cérémonie.</span>
            </p>
            <p className="text-ivoire/80 mt-6 text-base leading-relaxed md:text-lg">
              Maison française. Boîte écrin signée à la main. Aucune mention extérieure.
              <br className="hidden md:block" />
              Inscrivez-vous à la liste d\'attente — vous serez parmi les premières informées de
              l\'ouverture, avec une remise réservée.
            </p>

            {/* Compteur dynamique */}
            <p className="ui-caps text-or/85 mt-10 text-[11px] tracking-[0.18em]">
              <span className="text-or font-display tabular text-base font-medium">
                {count.toLocaleString('fr-FR')}
              </span>{' '}
              inscrites avant vous
            </p>
          </div>
        </Container>
      </section>

      {/* Formulaire waitlist */}
      <section
        id="inscription"
        className="bg-ivoire-light relative isolate overflow-hidden py-16 md:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_50%_30%,rgba(201,163,107,0.18)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">L\'inscription</p>
            <h2 className="font-display text-noir mt-4 text-3xl font-medium md:text-4xl lg:text-5xl">
              Rejoignez la liste{' '}
              <span className="font-italic-editorial text-or-dark">avant-première</span>
            </h2>
            <p className="text-encre/70 mt-6 text-base leading-relaxed md:text-lg">
              Une seule lettre par mois, jamais plus. Code de remise envoyé à l\'ouverture.
              Désinscription en un clic.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <WaitlistForm />
          </div>

          <p className="text-encre/55 mx-auto mt-8 max-w-md text-center text-xs leading-relaxed">
            Double opt-in CNIL — vous recevrez un email de confirmation. Sans clic dans cet email,
            l\'inscription n\'est pas effective et nous n\'enverrons rien.
          </p>
        </Container>
      </section>

      {/* 3 promesses */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Ce que vous obtenez</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                Trois engagements,{' '}
                <span className="font-italic-editorial text-or-dark">aucun spam</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
            {PROMISES.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-4 p-7 md:p-9">
                  <span className="font-display tabular text-or-dark text-3xl font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
                  <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="font-italic-editorial text-encre/80 text-base leading-relaxed">
                    {p.body}
                  </p>
                  <Fleuron variant="divider" size="sm" color="or" className="mt-auto opacity-50" />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Engagements maison */}
      <section className="bg-ivoire-light py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">La maison</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                Quatre engagements,{' '}
                <span className="font-italic-editorial text-or-dark">aucun compromis</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2">
            {ENGAGEMENTS.map((e, i) => (
              <ScrollReveal key={e.title} delay={i * 60} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-3 p-6 md:p-7">
                  <e.icon
                    className="text-or-dark size-5 stroke-[1.5]"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-noir text-lg font-medium leading-tight">
                    {e.title}
                  </h3>
                  <p className="text-encre/75 text-sm leading-relaxed">{e.body}</p>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Cross-link ambassadrices */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.15)_0%,transparent_60%)]"
        />
        <Container className="relative max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or">Programme ambassadrice</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              Vous avez{' '}
              <span className="font-italic-editorial text-or">une voix qui compte ?</span>
            </h2>
            <p className="text-ivoire/80 mt-6 text-base leading-relaxed md:text-lg">
              On cherche dix ambassadrices pour le lancement — micro-influenceuses, autrices,
              podcasteuses, sexologues. Coffret offert, partenariat sur-mesure.
            </p>
            <Link
              href="/ambassadrices"
              className="ui-caps bg-or text-noir hover:bg-or-light mt-10 inline-flex items-center gap-3 px-8 py-4 transition-colors"
            >
              Découvrir le programme
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </Container>
      </section>

      {/* Wordmark signature footer */}
      <section aria-hidden="true" className="bg-ivoire py-12 text-center">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-80" />
        <Wordmark as="p" size="sm" color="noir" className="mt-3 opacity-70" />
        <p className="font-italic-editorial text-encre/55 mt-2 text-xs">
          Maison du rituel intime — Paris · Ouverture juin 2026
        </p>
      </section>
    </>
  );
}
