import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sun } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CollectionImmersiveHero } from '@/components/marketing/CollectionImmersiveHero';
import {
  CollectionRitualSteps,
  type RitualStep,
} from '@/components/marketing/CollectionRitualSteps';
import { getMockProductsByCollection } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Collection JOUR — légèreté du rituel quotidien',
  description:
    'La collection JOUR : objets en silicone médical mat ivoire, format compact, ergonomie pour les rituels rapides. Maison française, livraison discrète.',
  alternates: { canonical: '/collections/jour' },
  openGraph: {
    type: 'website',
    title: 'Collection JOUR — Atelier Frisson',
    description: 'Pour la légèreté, le rituel rapide, le moment volé.',
  },
};

const PERSONAS = [
  {
    title: 'La femme qui s’appartient au matin',
    body: 'Avant le café, avant les enfants, avant le premier message — quelques minutes pour soi, sans se justifier.',
  },
  {
    title: 'La cadre qui vole un instant',
    body: 'Entre deux rendez-vous, dans un hôtel, en déplacement. La discrétion absolue de la collection JOUR rend l’objet voyageur.',
  },
  {
    title: 'Celle qui découvre',
    body: 'Premier objet, premier geste. Les courbes claires et les vibrations douces de JOUR ont été pensées pour rassurer.',
  },
] as const;

const RITUAL: readonly RitualStep[] = [
  {
    numeral: 'I',
    word: 'L’eau',
    detail: 'Tiède, jamais chaude.',
    body: 'Le rituel JOUR commence par un nettoyage à l’eau tiède (≤ 40&nbsp;°C) avec un savon doux. C’est un geste presque banal — c’est précisément pour ça qu’il importe.',
    duration: '2 min',
  },
  {
    numeral: 'II',
    word: 'L’objet',
    detail: 'Pris en main, lentement.',
    body: 'On le sort de son écrin. On l’observe une seconde. On le tient dans la paume — la matière prend la tiédeur du corps en quelques secondes. <strong>L’intention vient avant le geste.</strong>',
    duration: '1 min',
  },
  {
    numeral: 'III',
    word: 'Le silence',
    detail: 'Notifications éteintes, lumière douce.',
    body: 'Le téléphone en mode avion. La fenêtre entrouverte. Une infusion à côté. Le rituel JOUR n’a pas besoin d’une heure — il a besoin d’une parenthèse.',
    duration: '5 à 12 min',
  },
] as const;

export default function CollectionJourPage() {
  const products = getMockProductsByCollection('jour');

  return (
    <>
      {/* Breadcrumb sobre au-dessus du hero */}
      <div className="bg-ivoire-light pt-6 md:pt-8">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'JOUR', href: '/collections/jour' },
            ]}
          />
        </Container>
      </div>

      {/* ─── HERO IMMERSIF ──────────────────────────────────────────── */}
      <CollectionImmersiveHero
        variant="jour"
        caption={`Collection · ${products.length} objets composés`}
        title="JOUR"
        subtitle="Pour la légèreté, le rituel rapide, le moment volé."
        manifesto="La collection JOUR rassemble nos objets pensés pour la facilité — silicone médical mat, format compact, vibrations discrètes. Pour les rituels du matin, ceux qu’on s’offre entre deux rendez-vous, ou le simple plaisir d’un moment volé à la journée."
        ambientWord="MATINS"
      />

      {/* ─── POUR QUI ────────────────────────────────────────────────── */}
      <section aria-labelledby="personas-jour-heading" className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark inline-flex items-center gap-3 text-xs">
                <Sun className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
                Pour qui
                <Sun className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              </p>
              <h2
                id="personas-jour-heading"
                className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Trois manières{' '}
                <span className="font-italic-editorial text-or-dark">d’être à soi</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
            {PERSONAS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-5 p-7 md:p-9">
                  <span className="font-display tabular text-or-dark text-3xl font-medium">
                    {`0${i + 1}`.slice(-2)}
                  </span>
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

      {/* ─── GRID PRODUITS ──────────────────────────────────────────── */}
      <section className="bg-ivoire-light py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Les objets</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                La sélection <span className="font-italic-editorial text-or-dark">JOUR</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>
          <ProductGrid products={products} />
        </Container>
      </section>

      {/* ─── LE RITUEL JOUR ─────────────────────────────────────────── */}
      <CollectionRitualSteps
        variant="jour"
        caption="Le rituel JOUR"
        title="Trois gestes, trois respirations"
        subtitle="Une suggestion de protocole — à adopter, à adapter."
        steps={RITUAL}
      />

      {/* ─── CROSS-NAV VERS NUIT ─────────────────────────────────────── */}
      <section className="bg-rouge text-ivoire relative isolate overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_70%_30%,rgba(255,220,180,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_15%_75%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
        />
        <Container className="relative z-10 max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or/80">Une autre suite</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              Quand le soir tombe,{' '}
              <span className="font-italic-editorial text-or">on change de collection.</span>
            </h2>
            <p className="text-ivoire/80 mt-6 text-base md:text-lg">
              La collection NUIT prend le relais — laque profonde, courbes pleines, intensités
              modulables. Pour les rituels qui prennent leur temps.
            </p>
            <Link
              href="/collections/nuit"
              className="ui-caps bg-or text-noir hover:bg-or-light mt-10 inline-flex items-center gap-3 px-8 py-4 transition-colors"
            >
              Découvrir la collection NUIT
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
