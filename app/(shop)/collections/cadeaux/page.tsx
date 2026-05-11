import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gift, Heart, Sparkles, Stamp } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CollectionAudienceHero } from '@/components/marketing/CollectionAudienceHero';
import { getMockProductsByAudience } from '@/lib/mock/products';
import { getMockFeaturedBundles } from '@/lib/mock/bundles';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Cadeaux — Saint-Valentin, anniversaire, mariage | Atelier Frisson',
  description:
    'Coffrets cadeaux signés à la main : Saint-Valentin, anniversaire, mariage, EVJF. Boîte écrin ivoire, carte personnalisable, sceau cire.',
  alternates: { canonical: '/collections/cadeaux' },
  openGraph: {
    type: 'website',
    title: 'Cadeaux — Atelier Frisson',
    description: 'Six coffrets signés à la main + cartes cadeaux + box mensuelle à offrir.',
  },
};

const OCCASIONS = [
  {
    icon: Heart,
    label: 'Saint-Valentin',
    body: 'Édition limitée 2027 — coffret rose poudré + sceau cire oxblood. Disponible 1ᵉʳ janvier → 14 février.',
    href: '/bundle/saint-valentin-2027',
  },
  {
    icon: Sparkles,
    label: 'Anniversaire',
    body: 'Premier Cadeau (3 pièces accessibles) ou Coffret Rituel (bougie + huile + plume) — selon la complicité.',
    href: '/bundle/premier-cadeau',
  },
  {
    icon: Stamp,
    label: 'Mariage',
    body: 'Anniversaire de Mariage (3 pièces signature) ou Lune de Miel (5 pièces complètes). Carte cotton letterpress incluse.',
    href: '/bundle/lune-de-miel',
  },
  {
    icon: Gift,
    label: 'EVJF / EVG',
    body: 'Premier Cadeau ou Coffret Rituel — accessibles, élégants, jamais embarrassants. Livraison adresse au choix.',
    href: '/bundle/premier-cadeau',
  },
] as const;

export default function CollectionCadeauxPage() {
  const products = getMockProductsByAudience('cadeaux', { featuredFirst: true });
  const bundles = getMockFeaturedBundles().slice(0, 3);

  return (
    <>
      <div className="bg-ivoire-light pt-6 md:pt-8">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'Cadeaux', href: '/collections/cadeaux' },
            ]}
          />
        </Container>
      </div>

      <CollectionAudienceHero
        tone="cadeaux"
        caption="Le geste prêt-à-offrir"
        title="Cadeaux"
        subtitle="Saint-Valentin, anniversaire, mariage, EVJF."
        manifesto="Six coffrets composés à la main, signés au sceau de cire oxblood, carte cotton letterpress personnalisable. Boîte écrin ivoire avec ruban de soie. Aucune mention extérieure du contenu — la maison respecte la confidentialité du don."
        ambientWord="OFFRIR"
      />

      {/* Occasions */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Selon l\'occasion</p>
              <h2 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
                Quatre moments,{' '}
                <span className="font-italic-editorial text-or-dark">quatre coffrets</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((o, i) => {
              const Icon = o.icon;
              return (
                <ScrollReveal key={o.label} delay={i * 70} as="div">
                  <li>
                    <Link
                      href={o.href}
                      className="group bg-ivoire hover:bg-ivoire-light flex h-full flex-col gap-5 p-7 transition-colors md:p-8"
                    >
                      <Icon
                        aria-hidden="true"
                        className="text-or-dark size-6 stroke-[1.5]"
                      />
                      <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                        {o.label}
                      </h3>
                      <p className="font-italic-editorial text-encre/80 text-sm leading-relaxed md:text-base">
                        {o.body}
                      </p>
                      <span className="ui-caps text-or-dark group-hover:text-or mt-auto inline-flex items-center gap-1.5 text-[10px] transition-all group-hover:gap-2">
                        Voir le coffret
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                </ScrollReveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Coffrets featured */}
      <section className="bg-ivoire-light py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Coffrets signature</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                Composés{' '}
                <span className="font-italic-editorial text-or-dark">à la main</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
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
                      className="group bg-ivoire border-noir/5 hover:border-or flex h-full flex-col overflow-hidden border transition-all hover:shadow-card-hover"
                    >
                      <div className="bg-or/10 relative flex aspect-[4/5] items-center justify-center overflow-hidden">
                        <Fleuron
                          variant="crown"
                          size="lg"
                          color="or"
                          className="opacity-50 transition-opacity group-hover:opacity-70"
                        />
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

          <ScrollReveal delay={180}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/bundles"
                className="ui-caps-md border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-8 py-4 transition-all"
              >
                Voir les six coffrets
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Pièces taguées Cadeaux */}
      {products.length > 0 ? (
        <section className="bg-ivoire py-16 md:py-24">
          <Container>
            <ScrollReveal>
              <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
                <p className="ui-caps text-or-dark">À l\'unité</p>
                <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                  Pièces{' '}
                  <span className="font-italic-editorial text-or-dark">à offrir seules</span>
                </h2>
                <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
              </header>
            </ScrollReveal>
            <ProductGrid products={products} />
          </Container>
        </section>
      ) : null}

      {/* CTA cartes cadeaux + box à offrir */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.18)_0%,transparent_60%)]"
        />
        <Container className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <ScrollReveal>
              <div>
                <Gift className="text-or size-8" aria-hidden="true" />
                <p className="ui-caps text-or mt-4">Indécis ?</p>
                <h2 className="font-display mt-3 text-3xl font-medium md:text-4xl lg:text-5xl">
                  Carte cadeau ou{' '}
                  <span className="font-italic-editorial text-or">box à offrir</span>
                </h2>
                <p className="text-ivoire/80 mt-6 text-base md:text-lg">
                  Cartes cadeaux 50, 100, 150, 200 € — valables 12 mois, envoyées par email à la
                  date de votre choix. Box mensuelle à offrir 3, 6 ou 12 mois — sans renouvellement
                  automatique.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/cartes-cadeaux"
                    className="ui-caps-md bg-or hover:bg-or-light text-noir inline-flex items-center gap-3 px-7 py-3 transition-colors"
                  >
                    Carte cadeau
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/box-mensuelle#cadeau"
                    className="ui-caps-md border-or/60 text-or hover:bg-or/10 inline-flex items-center gap-3 border px-7 py-3 transition-colors"
                  >
                    Box à offrir
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <figure className="border-or/30 relative aspect-[4/5] overflow-hidden border">
                <div className="bg-rouge/40 absolute inset-0 flex items-center justify-center">
                  <Fleuron variant="crown" size="lg" color="or" className="opacity-60" />
                </div>
                <figcaption className="font-italic-editorial text-or absolute bottom-6 left-6 right-6 text-sm">
                  « Coffret Rituel — boîte écrin ivoire, sceau cire oxblood. »
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="bg-ivoire py-16 md:py-20" aria-hidden="true">
        <div className="flex flex-col items-center gap-3 text-center">
          <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
          <Wordmark as="p" size="sm" color="noir" className="opacity-70" />
          <p className="font-italic-editorial text-encre/55 text-xs">
            Maison du rituel intime — Paris
          </p>
        </div>
      </section>
    </>
  );
}
