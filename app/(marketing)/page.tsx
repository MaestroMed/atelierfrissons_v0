import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gift, Heart, Mars, Venus, VenusAndMars } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { HeroCinematic } from '@/components/marketing/HeroCinematic';
import { TrustSignals } from '@/components/marketing/TrustSignals';
import { Testimonials } from '@/components/marketing/Testimonials';
import { ProductCardPreview } from '@/components/marketing/ProductCardPreview';
import {
  ArticleCardPreview,
  type ArticleCardPreviewData,
} from '@/components/marketing/ArticleCardPreview';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { getMockFeaturedProducts } from '@/lib/mock/products';
import { getMockFeaturedBundles } from '@/lib/mock/bundles';
import { formatPriceCents } from '@/lib/format';
import { HEROS, getAssetUrl } from '@/lib/assets/atelier-frisson-visuals';

export const metadata: Metadata = {
  title: 'Atelier Frisson — Le rituel intime à deux',
  description:
    'Maison française du rituel intime — pour vous deux, pour elle, pour lui. Objets, lingerie soie, cosmétique intime, coffrets. Livraison discrète France et UE.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'Atelier Frisson — Le rituel intime à deux',
    description:
      'Pour vous deux, pour elle, pour lui. Maison française. Livraison discrète France et UE.',
  },
};

/** Articles éditoriaux — substitué par MDX en Sprint 6. */
const PREVIEW_ARTICLES: readonly ArticleCardPreviewData[] = [
  {
    slug: 'choisir-objet-couple-30-50',
    title: 'Choisir un premier objet à deux — guide pour 30-50',
    excerpt:
      'Pas un produit, un rituel. Comment choisir l\'objet qui s\'efface pendant l\'usage et reste dans la mémoire après.',
    category: 'Couple',
    readingTimeMinutes: 8,
    gradient: 'ivoire',
  },
  {
    slug: 'soie-22-momme-difference',
    title: 'Soie 22 momme — pourquoi cette densité change tout',
    excerpt:
      'La densité du linge de luxe vs la soie translucide bas de gamme. Test main, test peau, test sommeil.',
    category: 'Décryptage',
    readingTimeMinutes: 6,
    gradient: 'noir',
  },
  {
    slug: 'cadeau-anniversaire-mariage',
    title: 'Cadeau anniversaire de mariage — 5, 10, 25 ans',
    excerpt:
      'Trois coffrets pour trois étapes. Comment choisir selon les noces et la complicité actuelle du couple.',
    category: 'Couple',
    readingTimeMinutes: 7,
    gradient: 'rouge',
  },
] as const;

const AUDIENCE_TILES = [
  {
    slug: 'couples',
    href: '/collections/couples',
    label: 'Pour Vous Deux',
    tagline: 'Le rituel partagé, à deux.',
    icon: VenusAndMars,
    accent: 'rouge',
  },
  {
    slug: 'elle',
    href: '/collections/elle',
    label: 'Pour Elle',
    tagline: 'Objets, lingerie soie, cosmétique.',
    icon: Venus,
    accent: 'or',
  },
  {
    slug: 'lui',
    href: '/collections/lui',
    label: 'Pour Lui',
    tagline: 'Massagers, bandeau soie, huile bois de oud.',
    icon: Mars,
    accent: 'noir',
  },
  {
    slug: 'cadeaux',
    href: '/collections/cadeaux',
    label: 'Cadeaux',
    tagline: 'Saint-Valentin, anniversaire, mariage.',
    icon: Gift,
    accent: 'or',
  },
] as const;

export default function HomePage() {
  const featured = getMockFeaturedProducts().slice(0, 6);
  const bundles = getMockFeaturedBundles().slice(0, 3);
  const boxMensuelleUrl = getAssetUrl(HEROS.boxMensuelle);

  return (
    <>
      {/* ═══════ 1. HERO CINEMATIC pivot Couples — full-bleed 21:9 avec vidéo Mux/Seedance + fallback poster ═══════ */}
      <HeroCinematic />

      {/* ═══════ 2. AUDIENCE TILES — quick funnel sous le hero ═══════ */}
      <section
        aria-label="Choisissez votre rituel"
        className="bg-ivoire-light border-y border-noir/5 py-10 md:py-12"
      >
        <Container>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {AUDIENCE_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <li key={tile.slug}>
                  <Link
                    href={tile.href}
                    className="group border-encre/10 hover:border-or-dark bg-ivoire focus-visible:border-or-dark flex h-full flex-col items-start gap-3 border p-5 transition-all md:p-6"
                  >
                    <Icon
                      aria-hidden="true"
                      className="text-or-dark size-5 stroke-[1.5] md:size-6"
                    />
                    <p className="ui-caps text-or-dark text-[11px] tracking-[0.18em]">
                      {tile.label}
                    </p>
                    <p className="font-italic-editorial text-encre/75 text-sm md:text-base">
                      {tile.tagline}
                    </p>
                    <span className="ui-caps text-encre group-hover:text-or-dark mt-auto inline-flex items-center gap-1.5 text-[10px] transition-colors group-hover:gap-2">
                      Découvrir
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ═══════ 3. MANIFESTE pivot ═══════ */}
      <section aria-labelledby="manifeste-heading" className="bg-ivoire relative py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or-dark">Le manifeste</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5" />
            <h2
              id="manifeste-heading"
              className="font-display text-noir mt-6 text-3xl leading-tight font-medium md:text-4xl lg:text-5xl"
            >
              Atelier Frisson conçoit le rituel intime{' '}
              <span className="font-italic-editorial text-or-dark">
                comme une maison de parfums conçoit un sillage.
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="text-encre/75 mt-8 text-base leading-relaxed md:text-lg">
              Nos objets sont sélectionnés pour la précision du geste, la douceur des matières et
              une présence éditoriale discrète. Lingerie tissée à Roubaix, dentelle Leavers de
              Caudry, parfumerie grassoise, silicone médical certifié — chaque pièce passe par
              l\'épreuve du quotidien avant d\'entrer au catalogue.
            </p>
            <p className="font-italic-editorial text-or-dark mt-6 text-lg md:text-xl">
              Pour vous deux. Pour elle. Pour lui. — Sans logo, sans mention extérieure.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════ 4. BEST-SELLERS / SÉLECTION ═══════ */}
      <section
        aria-labelledby="selection-heading"
        className="bg-ivoire-light py-20 md:py-28"
      >
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">La sélection</p>
              <h2
                id="selection-heading"
                className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Les pièces les plus offertes
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
              <p className="text-encre/70 max-w-xl text-base md:text-lg">
                Six pièces signature — la pièce maîtresse, l\'objet pour deux, la lingerie soie,
                l\'huile parfumée, le coffret prêt-à-offrir.
              </p>
            </header>
          </ScrollReveal>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {featured.map((p, i) => {
              const hero = p.images[0];
              return (
                <ScrollReveal key={p.slug} delay={i * 90} as="div">
                  <li>
                    <ProductCardPreview
                      priority={i < 2}
                      product={{
                        slug: p.slug,
                        name: p.name,
                        tagline: p.tagline ?? '',
                        priceCents: p.priceCents,
                        compareAtPriceCents: p.compareAtPriceCents,
                        collection: p.collection ?? 'couples',
                        imageUrl: hero?.url || null,
                        imageAlt: hero?.alt ?? `${p.name} — ${p.tagline ?? ''}`,
                        ...(p.tags.includes('best-seller')
                          ? { badge: 'Best-seller' }
                          : p.stockStatus === 'low_stock'
                            ? { badge: 'Stock limité' }
                            : p.tags.includes('signature')
                              ? { badge: 'Signature' }
                              : {}),
                      }}
                    />
                  </li>
                </ScrollReveal>
              );
            })}
          </ul>

          <ScrollReveal delay={180}>
            <div className="mt-14 flex justify-center">
              <Link
                href="/boutique"
                className="ui-caps-md border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-8 py-4 transition-all duration-300"
              >
                Voir toute la boutique
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════ 5. BOX MENSUELLE — bandeau récurrent revenue ═══════ */}
      <section
        aria-labelledby="box-mensuelle-heading"
        className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_25%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(139,20,36,0.15)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <ScrollReveal>
              <div>
                <p className="ui-caps text-or">Abonnement mensuel</p>
                <h2
                  id="box-mensuelle-heading"
                  className="font-display mt-4 text-4xl leading-tight font-medium md:text-5xl lg:text-6xl"
                >
                  Le rituel renouvelé,{' '}
                  <span className="font-italic-editorial text-or">chaque mois.</span>
                </h2>
                <p className="text-ivoire/80 mt-6 text-base leading-relaxed md:text-lg">
                  Trois plans à partir de 39 €/mois. Sans engagement, pause libre, livraison
                  discrète Colissimo Suivi 48h. Pièces capsules réservées aux abonnées.
                </p>
                <ul className="mt-8 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <li className="text-ivoire/85 flex items-start gap-2">
                    <span className="text-or mt-1 size-1.5 shrink-0 rounded-full bg-current" />
                    <span>3 à 5 pièces par box selon le plan</span>
                  </li>
                  <li className="text-ivoire/85 flex items-start gap-2">
                    <span className="text-or mt-1 size-1.5 shrink-0 rounded-full bg-current" />
                    <span>Pause / annulation en deux clics</span>
                  </li>
                  <li className="text-ivoire/85 flex items-start gap-2">
                    <span className="text-or mt-1 size-1.5 shrink-0 rounded-full bg-current" />
                    <span>Boîte neutre signée à la main</span>
                  </li>
                  <li className="text-ivoire/85 flex items-start gap-2">
                    <span className="text-or mt-1 size-1.5 shrink-0 rounded-full bg-current" />
                    <span>Réduction 10-15 % en annuel</span>
                  </li>
                </ul>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/box-mensuelle"
                    className="ui-caps-md bg-or hover:bg-or-light text-noir inline-flex items-center gap-3 px-8 py-4 transition-all duration-300"
                  >
                    Choisir mon plan
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/box-mensuelle#cadeau"
                    className="ui-caps-md border-or/60 text-or hover:bg-or/10 inline-flex items-center gap-3 border px-8 py-4 transition-all duration-300"
                  >
                    Offrir la box
                    <Gift className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} as="div">
              <figure className="border-or/30 relative aspect-[4/5] overflow-hidden border">
                {boxMensuelleUrl ? (
                  <Image
                    src={boxMensuelleUrl}
                    alt={HEROS.boxMensuelle.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-rouge/40 absolute inset-0 flex items-center justify-center">
                    <Fleuron variant="crown" size="lg" color="or" className="opacity-60" />
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 [background:linear-gradient(to_top,rgba(10,7,6,0.6)_0%,transparent_45%)]"
                />
                <figcaption className="font-italic-editorial text-or absolute bottom-6 left-6 right-6 text-sm">
                  « Box Premium — chapitre n°4, mai 2026. »
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ═══════ 6. COFFRETS / BUNDLES ═══════ */}
      <section
        aria-labelledby="coffrets-heading"
        className="bg-ivoire py-20 md:py-28"
      >
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-3">
                <p className="ui-caps text-or-dark">Coffrets prêt-à-offrir</p>
                <h2
                  id="coffrets-heading"
                  className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
                >
                  Le geste{' '}
                  <span className="font-italic-editorial text-or-dark">déjà composé.</span>
                </h2>
              </div>
              <Link
                href="/bundles"
                className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2 transition-all hover:gap-3"
              >
                Tous les coffrets
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </header>
          </ScrollReveal>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {bundles.map((bundle, i) => {
              const savings =
                bundle.compareAtPriceCents != null
                  ? bundle.compareAtPriceCents - bundle.priceCents
                  : 0;
              return (
                <ScrollReveal key={bundle.slug} delay={i * 110} as="div">
                  <li>
                    <Link
                      href={`/bundle/${bundle.slug}`}
                      className="group bg-ivoire-light border-noir/5 hover:border-or flex h-full flex-col overflow-hidden border transition-all hover:shadow-card-hover"
                    >
                      <div className="bg-noir/5 relative flex aspect-[4/5] items-center justify-center overflow-hidden">
                        <Fleuron
                          variant="crown"
                          size="lg"
                          color="or"
                          className="opacity-40 transition-opacity group-hover:opacity-60"
                        />
                        {bundle.isFeatured ? (
                          <span className="bg-or text-noir ui-caps absolute top-4 left-4 px-3 py-1.5 text-[10px] tracking-widest">
                            Coffret signature
                          </span>
                        ) : null}
                        {savings > 0 ? (
                          <span className="bg-rouge text-ivoire ui-caps absolute top-4 right-4 px-3 py-1.5 text-[10px] tracking-widest">
                            −{Math.round(savings / 100)} €
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 px-6 py-6">
                        <h3 className="font-display text-noir text-2xl font-medium">
                          {bundle.name}
                        </h3>
                        <p className="font-italic-editorial text-encre/70 text-sm md:text-base">
                          {bundle.tagline}
                        </p>
                        <div className="mt-auto flex items-baseline gap-3 pt-3">
                          <span className="font-display text-noir text-2xl tabular-nums">
                            {formatPriceCents(bundle.priceCents).replace(',00', '')}
                          </span>
                          {bundle.compareAtPriceCents ? (
                            <span className="text-encre/40 text-sm tabular-nums line-through">
                              {formatPriceCents(bundle.compareAtPriceCents).replace(',00', '')}
                            </span>
                          ) : null}
                          <span className="ui-caps text-or-dark group-hover:text-or ml-auto inline-flex items-center gap-1.5 text-[10px] transition-all group-hover:gap-2">
                            Découvrir
                            <ArrowRight className="size-3" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ScrollReveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ═══════ 7. BANNIÈRE ÉDITORIALE ═══════ */}
      <section
        aria-label="Citation éditoriale"
        className="bg-rouge text-ivoire relative isolate overflow-hidden py-24 md:py-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_30%_40%,rgba(201,163,107,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_80%_60%,rgba(10,7,6,0.2)_0%,transparent_55%)]"
        />
        <Container className="relative max-w-4xl text-center">
          <ScrollReveal>
            <Fleuron variant="divider" size="lg" color="or" className="mx-auto mb-8 opacity-80" />
            <blockquote className="font-display text-3xl leading-tight font-medium md:text-5xl lg:text-6xl">
              <span aria-hidden="true" className="font-italic-editorial text-or">
                «&nbsp;
              </span>
              Le rituel à deux n\'est pas une performance.{' '}
              <span className="font-italic-editorial text-or">
                C\'est une attention partagée.
              </span>
              <span aria-hidden="true" className="font-italic-editorial text-or">
                &nbsp;»
              </span>
            </blockquote>
            <footer className="mt-10">
              <p className="ui-caps text-or/80">Atelier Frisson — Paris</p>
            </footer>
            <Fleuron variant="divider" size="lg" color="or" className="mx-auto mt-8 opacity-60" />
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════ 8. INSPIRATIONS / JOURNAL ═══════ */}
      <section aria-labelledby="journal-heading" className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-3">
                <p className="ui-caps text-or-dark">Inspirations</p>
                <h2
                  id="journal-heading"
                  className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
                >
                  Le journal{' '}
                  <span className="font-italic-editorial text-or-dark">en éditorial</span>
                </h2>
              </div>
              <Link
                href="/rituels"
                className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2 transition-all hover:gap-3"
              >
                Tous les articles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </header>
          </ScrollReveal>

          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
            {PREVIEW_ARTICLES.map((article, i) => (
              <ScrollReveal key={article.slug} delay={i * 120} as="div">
                <li>
                  <ArticleCardPreview article={article} />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ═══════ 9. TÉMOIGNAGES ═══════ */}
      <Testimonials />

      {/* ═══════ 10. NEWSLETTER ÉDITORIALE ═══════ */}
      <section
        aria-label="Newsletter éditoriale"
        className="bg-ivoire-dark relative py-24 md:py-28"
      >
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or-dark">La correspondance</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              −10 % sur la première commande
            </h2>
            <p className="text-encre/75 mt-6 text-base md:text-lg">
              Une lettre éditoriale, jamais plus de deux fois par mois. Idées rituels, portraits,
              guides — et une découverte produit en avant-première. <span className="font-italic-editorial text-or-dark">Code envoyé après inscription.</span>
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <NewsletterForm
              source="homepage"
              tone="light"
              className="mx-auto mt-10 max-w-xl text-left"
            />
            <p className="text-encre/50 mt-4 text-xs">
              Conforme RGPD · désinscription en un clic · jamais de partage avec des tiers
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════ 11. TRUST SIGNALS ═══════ */}
      <TrustSignals />

      {/* ═══════ 12. Wordmark signature (transition footer) ═══════ */}
      <section aria-hidden="true" className="bg-ivoire-light py-12 text-center">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-80" />
        <Wordmark as="p" size="sm" color="noir" className="mt-3 opacity-70" />
        <p className="font-italic-editorial text-encre/50 mt-2 text-xs">
          <Heart className="text-or-dark mr-1.5 inline size-3 -translate-y-px" aria-hidden="true" />
          Paris — Maison du rituel intime
        </p>
      </section>
    </>
  );
}
