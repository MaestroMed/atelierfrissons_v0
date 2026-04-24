import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { HeroSplit } from '@/components/marketing/HeroSplit';
import { TrustSignals } from '@/components/marketing/TrustSignals';
import {
  ProductCardPreview,
  type ProductCardPreviewData,
} from '@/components/marketing/ProductCardPreview';
import {
  ArticleCardPreview,
  type ArticleCardPreviewData,
} from '@/components/marketing/ArticleCardPreview';

export const metadata: Metadata = {
  title: 'Atelier Frisson — Maison du rituel intime',
  description:
    'Objets de bien-être intime en silicone médical, conçus à Paris. Livraison discrète, emballage neutre. Pour tous les rituels, pour tous les moments.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'Atelier Frisson — Maison du rituel intime',
    description:
      'Objets de bien-être intime en silicone médical. Livraison discrète en France et UE.',
  },
};

/** Données de démonstration — remplacées par les queries produits en Sprint 2. */
const PREVIEW_PRODUCTS: readonly ProductCardPreviewData[] = [
  {
    slug: 'premier-frisson',
    name: 'Premier Frisson',
    tagline: 'Un objet pensé pour les premiers gestes lents.',
    priceCents: 8900,
    collection: 'jour',
    badge: 'Nouveauté',
  },
  {
    slug: 'velours-rouge',
    name: 'Velours Rouge',
    tagline: 'Le rituel du soir, en silicone glossy finition miroir.',
    priceCents: 12900,
    collection: 'nuit',
  },
  {
    slug: 'essentiel-jour',
    name: 'Essentiel Jour',
    tagline: 'La silhouette signature, tout en légèreté.',
    priceCents: 7900,
    collection: 'jour',
  },
  {
    slug: 'noir-profond',
    name: 'Noir Profond',
    tagline: 'Présence sculptée — la collection NUIT à son apogée.',
    priceCents: 14900,
    collection: 'nuit',
    badge: 'Signature',
  },
  {
    slug: 'albatre',
    name: 'Albâtre',
    tagline: 'Matière mate, toucher velouté, calme absolu.',
    priceCents: 10900,
    collection: 'jour',
  },
  {
    slug: 'laque-minuit',
    name: 'Laque Minuit',
    tagline: 'Géométrie patiente, finition laquée rouge profond.',
    priceCents: 13900,
    collection: 'nuit',
  },
] as const;

/** Articles de démonstration — remplacés par MDX + queries articles en Sprint 6. */
const PREVIEW_ARTICLES: readonly ArticleCardPreviewData[] = [
  {
    slug: 'pouvoir-rituel-lent',
    title: 'Pourquoi on sous-estime le pouvoir d’un rituel lent',
    excerpt:
      'Dans une époque qui célèbre la vitesse, ralentir devient un acte radical de soin et d’écoute.',
    category: 'Bien-être',
    readingTimeMinutes: 7,
    gradient: 'ivoire',
  },
  {
    slug: 'silicone-medical-le-test',
    title: 'Silicone médical vs silicone classique — le test',
    excerpt:
      'Pourquoi la norme ISO 10993 fait toute la différence — analyse, comparatif, et recommandations.',
    category: 'Décryptage',
    readingTimeMinutes: 6,
    gradient: 'noir',
  },
  {
    slug: 'communication-intime-couple',
    title: 'Parler de ses envies — 7 phrases pour démarrer',
    excerpt:
      'Un guide pratique, sans injonction, pour oser la conversation la plus intime du quotidien.',
    category: 'Couple',
    readingTimeMinutes: 8,
    gradient: 'rouge',
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* ═══════ 1. HERO SPLIT ═══════ */}
      <HeroSplit />

      {/* ═══════ 2. MANIFESTE ═══════ */}
      <section
        aria-labelledby="manifeste-heading"
        className="relative bg-ivoire py-20 md:py-28"
      >
        <Container className="max-w-3xl text-center">
          <p className="ui-caps text-or-dark">Le manifeste</p>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5" />
          <h2
            id="manifeste-heading"
            className="mt-6 font-display text-3xl font-medium leading-tight text-noir md:text-4xl lg:text-5xl"
          >
            Atelier Frisson conçoit des objets de bien-être intime{' '}
            <span className="font-italic-editorial text-or-dark">
              comme des rituels contemporains.
            </span>
          </h2>
          <p className="mt-8 text-base leading-relaxed text-encre/75 md:text-lg">
            La maison privilégie la précision du geste, la douceur des matières et une présence
            éditoriale silencieuse. Chaque pièce est pensée comme un objet de soin, fabriquée en
            silicone médical certifié, livrée dans un emballage neutre signé de la main.
          </p>
          <p className="mt-6 font-italic-editorial text-lg text-or-dark md:text-xl">
            Pour les matins lents. Pour les nuits attentives. Pour le simple plaisir d’être à soi.
          </p>
        </Container>
      </section>

      {/* ═══════ 3. LA COLLECTION ═══════ */}
      <section
        aria-labelledby="collection-heading"
        className="bg-ivoire-light py-20 md:py-28"
      >
        <Container>
          <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
            <p className="ui-caps text-or-dark">Sélection signature</p>
            <h2
              id="collection-heading"
              className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
            >
              La Collection
            </h2>
            <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
            <p className="max-w-xl text-base text-encre/70 md:text-lg">
              Six objets, deux collections — JOUR et NUIT. Chaque pièce est une invitation à un
              rituel différent.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {PREVIEW_PRODUCTS.map((product) => (
              <li key={product.slug}>
                <ProductCardPreview product={product} />
              </li>
            ))}
          </ul>

          <div className="mt-14 flex justify-center">
            <Link
              href="/boutique"
              className="ui-caps-md inline-flex items-center gap-3 border border-noir px-8 py-4 text-noir transition-all duration-300 hover:bg-noir hover:text-ivoire"
            >
              Voir toute la boutique
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══════ 4. BANNIÈRE ÉDITORIALE ═══════ */}
      <section
        aria-label="Citation éditoriale"
        className="relative isolate overflow-hidden bg-noir py-24 text-ivoire md:py-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_30%_40%,rgba(201,163,107,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_80%_60%,rgba(139,20,36,0.2)_0%,transparent_55%)]"
        />
        <Container className="relative max-w-4xl text-center">
          <Fleuron variant="divider" size="lg" color="or" className="mx-auto mb-8 opacity-80" />
          <blockquote className="font-display text-3xl font-medium leading-tight md:text-5xl lg:text-6xl">
            <span aria-hidden="true" className="font-italic-editorial text-or">
              «&nbsp;
            </span>
            Ralentir n’est pas perdre du temps.{' '}
            <span className="font-italic-editorial text-or">C’est un acte de soin profond.</span>
            <span aria-hidden="true" className="font-italic-editorial text-or">
              &nbsp;»
            </span>
          </blockquote>
          <footer className="mt-10">
            <p className="ui-caps text-or/80">Atelier Frisson — Paris</p>
          </footer>
          <Fleuron variant="divider" size="lg" color="or" className="mx-auto mt-8 opacity-60" />
        </Container>
      </section>

      {/* ═══════ 5. LE JOURNAL ═══════ */}
      <section
        aria-labelledby="journal-heading"
        className="bg-ivoire py-20 md:py-28"
      >
        <Container>
          <header className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <p className="ui-caps text-or-dark">Le Journal</p>
              <h2
                id="journal-heading"
                className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Les Rituels{' '}
                <span className="font-italic-editorial text-or-dark">en éditorial</span>
              </h2>
            </div>
            <Link
              href="/rituels"
              className="ui-caps inline-flex items-center gap-2 text-or-dark transition-all hover:gap-3 hover:text-or"
            >
              Tous les articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </header>

          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
            {PREVIEW_ARTICLES.map((article) => (
              <li key={article.slug}>
                <ArticleCardPreview article={article} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ═══════ 6. NEWSLETTER ÉDITORIALE ═══════ */}
      <section
        aria-label="Newsletter éditoriale"
        className="relative bg-ivoire-dark py-24 md:py-28"
      >
        <Container className="max-w-3xl text-center">
          <p className="ui-caps text-or-dark">La correspondance</p>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
          <h2 className="mt-6 font-display text-3xl font-medium md:text-4xl lg:text-5xl">
            Recevez nos rituels en avant-première
          </h2>
          <p className="mt-6 text-base text-encre/75 md:text-lg">
            Une lettre éditoriale, jamais plus de deux fois par mois. Des rituels, des portraits,
            des guides — et de temps en temps, une découverte produit en avant-première.
          </p>
          <NewsletterForm source="homepage" className="mx-auto mt-10 max-w-xl text-left" />
        </Container>
      </section>

      {/* ═══════ 7. TRUST SIGNALS ═══════ */}
      <TrustSignals />

      {/* ═══════ 8. Wordmark signature (transition vers footer) ═══════ */}
      <section aria-hidden="true" className="bg-ivoire-light py-12 text-center">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-80" />
        <Wordmark as="p" size="sm" color="noir" className="mt-3 opacity-70" />
        <p className="mt-2 font-italic-editorial text-xs text-encre/50">
          Paris — Maison du rituel intime
        </p>
      </section>
    </>
  );
}
