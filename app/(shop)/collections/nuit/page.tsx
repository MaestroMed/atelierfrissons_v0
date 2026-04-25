import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Moon } from 'lucide-react';
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
  title: 'Collection NUIT — profondeur du rituel attentif',
  description:
    'La collection NUIT : objets en silicone médical glossy, finition laquée, ergonomie pour les rituels du soir et de la complicité. Maison française, livraison discrète.',
  alternates: { canonical: '/collections/nuit' },
  openGraph: {
    type: 'website',
    title: 'Collection NUIT — Atelier Frisson',
    description: 'Pour la profondeur, le geste lent, la complicité.',
  },
};

const PERSONAS = [
  {
    title: 'La femme qui clôt sa journée avec densité',
    body: 'Le rituel du soir comme une porte qu’on ferme — pour qu’aucune urgence ne franchisse plus le seuil. NUIT a été pensée pour ce passage.',
  },
  {
    title: 'Le couple qui se redécouvre',
    body: 'Trois soirs par semaine, ou un seul. Les pièces NUIT ont été conçues pour être tenues à deux mains, partagées, transmises sans gêne.',
  },
  {
    title: 'Celle qui aime la matière',
    body: 'Laque rouge profond, noir glossy finition miroir, poids dense. La collection NUIT est faite pour celles qui apprécient un objet pour ce qu’il est — autant que pour ce qu’il fait.',
  },
] as const;

const RITUAL: readonly RitualStep[] = [
  {
    numeral: 'I',
    word: 'La lumière',
    detail: 'Tamisée, chaude, basse.',
    body: 'Une lampe au sol, une bougie discrète, le store baissé. Le rituel NUIT commence par <strong>un changement de lumière</strong> — pas par un objet.',
    duration: '1 min',
  },
  {
    numeral: 'II',
    word: 'La matière',
    detail: 'L’objet, sorti de son écrin lentement.',
    body: 'On le pose sur un linge propre. On l’observe. On apprécie le poids, la courbe, la finition laquée. NUIT demande qu’on prenne le temps de <em>regarder ce que l’on va tenir.</em>',
    duration: '2 min',
  },
  {
    numeral: 'III',
    word: 'La durée',
    detail: 'Pas d’horloge, pas de but.',
    body: 'Le rituel NUIT n’a pas de minuterie. Il dure <strong>aussi longtemps qu’il faut</strong> — quinze minutes ou une heure. C’est l’absence de but qui change tout.',
    duration: '15 à 60 min',
  },
] as const;

export default function CollectionNuitPage() {
  const products = getMockProductsByCollection('nuit');

  return (
    <>
      {/* Breadcrumb sobre au-dessus du hero — fond rouge */}
      <div className="bg-rouge pt-6 md:pt-8">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'NUIT', href: '/collections/nuit' },
            ]}
            className="[&_*]:!text-ivoire/70"
          />
        </Container>
      </div>

      {/* ─── HERO IMMERSIF ──────────────────────────────────────────── */}
      <CollectionImmersiveHero
        variant="nuit"
        caption={`Collection · ${products.length} objets composés`}
        title="NUIT"
        subtitle="Pour la profondeur, le geste lent, la complicité."
        manifesto="La collection NUIT rassemble nos pièces les plus abouties — silicone laqué glossy, finition triple polissage, moteurs synchronisés. Pour les rituels du soir, ceux qui prennent leur temps, et la complicité à deux."
        ambientWord="NUITS"
      />

      {/* ─── POUR QUI ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="personas-nuit-heading"
        className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_25%_30%,rgba(201,163,107,0.1)_0%,transparent_55%)]"
        />
        <Container className="relative z-10">
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or inline-flex items-center gap-3 text-xs">
                <Moon className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
                Pour qui
                <Moon className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              </p>
              <h2
                id="personas-nuit-heading"
                className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Trois manières{' '}
                <span className="font-italic-editorial text-or">d’habiter le soir</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/20 grid grid-cols-1 gap-px md:grid-cols-3">
            {PERSONAS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80} as="div">
                <li className="bg-noir-velours flex h-full flex-col gap-5 p-7 md:p-9">
                  <span className="font-display tabular text-or text-3xl font-medium">
                    {`0${i + 1}`.slice(-2)}
                  </span>
                  <h3 className="font-display text-xl leading-tight font-medium md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="font-italic-editorial text-ivoire/80 text-base leading-relaxed">
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
      <section className="bg-rouge text-ivoire py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or">Les pièces</p>
              <h2 className="font-display text-4xl font-medium md:text-5xl lg:text-6xl">
                La sélection <span className="font-italic-editorial text-or">NUIT</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>
          <ProductGrid products={products} />
        </Container>
      </section>

      {/* ─── LE RITUEL NUIT ─────────────────────────────────────────── */}
      <CollectionRitualSteps
        variant="nuit"
        caption="Le rituel NUIT"
        title="Pas de minuterie, pas de but"
        subtitle="Le seul rituel qu’on se permet sans urgence."
        steps={RITUAL}
      />

      {/* ─── CROSS-NAV VERS JOUR ─────────────────────────────────────── */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or-dark">Et pour le matin ?</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display text-noir mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              La collection JOUR{' '}
              <span className="font-italic-editorial text-or-dark">prend la suite.</span>
            </h2>
            <p className="text-encre/80 mt-6 text-base md:text-lg">
              Silicone mat ivoire, format compact, vibrations discrètes. Pour les rituels du matin
              et les moments volés à la journée.
            </p>
            <Link
              href="/collections/jour"
              className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-10 inline-flex items-center gap-3 border px-8 py-4 transition-colors"
            >
              Découvrir la collection JOUR
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
