import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Stamp } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { getMockBundles, MOCK_BUNDLE_COMPOSITIONS } from '@/lib/mock/bundles';
import { formatPriceCents } from '@/lib/format';
import type { Bundle } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Coffrets — Soirée à Deux, Lune de Miel, Saint-Valentin | Atelier Frisson',
  description:
    'Six coffrets composés à la main : Soirée à Deux, Évasion Week-end, Anniversaire de Mariage, Lune de Miel, Premier Cadeau, Saint-Valentin. Économisez jusqu\'à 66 €.',
  alternates: { canonical: '/bundles' },
  openGraph: {
    type: 'website',
    title: 'Coffrets — Atelier Frisson',
    description: 'Six coffrets signés à la main, prêts à offrir.',
  },
};

const OCCASION_FILTERS: ReadonlyArray<{
  value: Bundle['occasion'] | 'all';
  label: string;
}> = [
  { value: 'all', label: 'Tous les coffrets' },
  { value: 'pas_d_occasion', label: 'Toute occasion' },
  { value: 'saint_valentin', label: 'Saint-Valentin' },
  { value: 'anniversaire', label: 'Anniversaire' },
  { value: 'mariage', label: 'Mariage' },
  { value: 'evjf', label: 'EVJF' },
];

const OCCASION_LABEL: Record<Bundle['occasion'], string> = {
  pas_d_occasion: 'Toute occasion',
  saint_valentin: 'Saint-Valentin',
  anniversaire: 'Anniversaire',
  evjf: 'EVJF',
  evg: 'EVG',
  noel: 'Noël',
  mariage: 'Mariage',
};

interface BundlesSearchParams {
  occasion?: Bundle['occasion'] | 'all';
}

export default async function BundlesPage({
  searchParams,
}: {
  searchParams: Promise<BundlesSearchParams>;
}): Promise<React.ReactElement> {
  const params = await searchParams;
  const activeOccasion = params.occasion ?? 'all';
  const all = getMockBundles();
  const bundles =
    activeOccasion === 'all' ? all : all.filter((b) => b.occasion === activeOccasion);

  return (
    <>
      {/* HERO premium */}
      <section className="bg-ivoire-light relative isolate overflow-hidden py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(201,163,107,0.1)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Coffrets', href: '/bundles' },
            ]}
            className="mb-12"
          />
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">
              Coffrets composés à la main
            </p>
            <h1 className="font-display text-noir mt-4 text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] font-medium">
              Coffrets &{' '}
              <span className="font-italic-editorial text-or-dark">bundles</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <p className="font-italic-editorial text-encre/75 mt-6 text-lg md:text-xl">
              Six coffrets pensés comme des écrins.
            </p>
            <p className="text-encre/70 mx-auto mt-6 max-w-2xl text-base leading-relaxed">
              Boîte ivoire signée à la main, ruban de soie oxblood, sceau cire à la maison, carte
              cotton letterpress. Aucune mention extérieure du contenu.{' '}
              <span className="text-or-dark font-medium">Économisez jusqu\'à 66 € vs les pièces séparées.</span>
            </p>
          </div>

          {/* Filtres occasion */}
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {OCCASION_FILTERS.map((f) => {
              const isActive = activeOccasion === f.value;
              const href = f.value === 'all' ? '/bundles' : `/bundles?occasion=${f.value}`;
              return (
                <li key={f.value}>
                  <Link
                    href={href}
                    className={cn(
                      'ui-caps inline-flex items-center gap-2 border px-4 py-2 text-[10px] tracking-[0.18em] transition-colors',
                      isActive
                        ? 'bg-noir border-noir text-ivoire'
                        : 'bg-ivoire border-encre/15 text-encre/75 hover:border-or-dark hover:text-encre',
                    )}
                  >
                    {f.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* GRID BUNDLES */}
      <section className="bg-ivoire">
        <Container className="py-16 md:py-20">
          {bundles.length === 0 ? (
            <p className="text-encre/60 font-italic-editorial py-20 text-center text-lg">
              Aucun coffret pour cette occasion. <Link href="/bundles" className="text-or-dark underline underline-offset-4">Voir tous les coffrets</Link>
            </p>
          ) : (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {bundles.map((bundle, i) => {
                const composition = MOCK_BUNDLE_COMPOSITIONS[bundle.slug] ?? [];
                const savings =
                  bundle.compareAtPriceCents != null
                    ? bundle.compareAtPriceCents - bundle.priceCents
                    : 0;

                return (
                  <ScrollReveal key={bundle.slug} delay={i * 90} as="div">
                    <li>
                      <article className="bg-ivoire-light border-encre/10 group flex h-full flex-col overflow-hidden border transition-all hover:border-or hover:shadow-card-hover">
                        <div className="bg-or/8 relative flex aspect-[4/5] items-center justify-center overflow-hidden">
                          <Fleuron
                            variant="crown"
                            size="lg"
                            color="or"
                            className="opacity-50 transition-all group-hover:scale-110 group-hover:opacity-70"
                          />
                          {bundle.isFeatured ? (
                            <span className="bg-or text-noir ui-caps absolute top-4 left-4 px-3 py-1.5 text-[10px] tracking-widest">
                              Coffret signature
                            </span>
                          ) : null}
                          {bundle.occasion !== 'pas_d_occasion' ? (
                            <span className="bg-rouge text-ivoire ui-caps absolute top-4 right-4 px-3 py-1.5 text-[10px] tracking-widest">
                              {OCCASION_LABEL[bundle.occasion]}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-1 flex-col p-6 md:p-7">
                          <h2 className="font-display text-noir text-2xl font-medium">
                            {bundle.name}
                          </h2>
                          <p className="font-italic-editorial text-encre/70 mt-1 text-base">
                            {bundle.tagline}
                          </p>
                          <p className="text-encre/80 mt-4 text-sm leading-relaxed">
                            {bundle.descriptionShort}
                          </p>

                          {composition.length > 0 ? (
                            <p className="text-encre/55 mt-3 text-xs">
                              <span className="ui-caps text-or-dark mr-1.5 text-[10px]">
                                Inclus
                              </span>
                              {composition.length} pièces
                            </p>
                          ) : null}

                          <div className="mt-auto pt-5">
                            <div className="flex items-baseline gap-3">
                              <span className="font-display text-noir text-2xl tabular-nums">
                                {formatPriceCents(bundle.priceCents).replace(',00', '')}
                              </span>
                              {bundle.compareAtPriceCents ? (
                                <>
                                  <span className="text-encre/40 text-sm tabular-nums line-through">
                                    {formatPriceCents(bundle.compareAtPriceCents).replace(',00', '')}
                                  </span>
                                  <span className="text-rouge ui-caps text-[10px] tracking-widest">
                                    −{formatPriceCents(savings).replace(',00', '')}
                                  </span>
                                </>
                              ) : null}
                            </div>

                            <Link
                              href={`/bundle/${bundle.slug}`}
                              className="ui-caps-md bg-noir text-ivoire hover:bg-rouge mt-5 inline-flex w-full items-center justify-center gap-2 px-6 py-3 transition-colors"
                            >
                              Découvrir le coffret
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>
          )}
        </Container>
      </section>

      {/* Le geste — réassurance premium */}
      <section className="bg-ivoire-light border-y border-encre/5 py-12 md:py-14">
        <Container>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <li className="flex flex-col gap-2">
              <Stamp className="text-or size-5 stroke-[1.5]" aria-hidden="true" />
              <p className="ui-caps text-encre">Sceau cire main</p>
              <p className="text-encre/65 text-xs leading-relaxed">
                Apposé à la main par notre atelier — il signe le don.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <Fleuron variant="divider" size="sm" color="or" />
              <p className="ui-caps text-encre">Carte personnalisable</p>
              <p className="text-encre/65 text-xs leading-relaxed">
                Cotton letterpress, message ajouté au checkout.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <Fleuron variant="divider" size="sm" color="or" />
              <p className="ui-caps text-encre">Boîte écrin neutre</p>
              <p className="text-encre/65 text-xs leading-relaxed">
                Aucune mention extérieure du contenu.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <Fleuron variant="divider" size="sm" color="or" />
              <p className="ui-caps text-encre">Livraison Colissimo 48h</p>
              <p className="text-encre/65 text-xs leading-relaxed">
                Suivi inclus France métropolitaine.
              </p>
            </li>
          </ul>
        </Container>
      </section>

      {/* CTA secondaire box mensuelle */}
      <section className="bg-rouge text-ivoire relative isolate overflow-hidden py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,220,180,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_80%_70%,rgba(201,163,107,0.15)_0%,transparent_55%)]"
        />
        <Container className="relative mx-auto max-w-3xl text-center">
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-3xl font-medium md:text-4xl">
            Chaque mois, un nouveau chapitre
          </h2>
          <p className="font-italic-editorial text-ivoire/80 mt-4 text-lg">
            Découvrez la box mensuelle Rituel Frisson — sans engagement.
          </p>
          <Link
            href="/box-mensuelle"
            className="ui-caps bg-or text-noir hover:bg-or-light mt-8 inline-flex items-center gap-3 px-8 py-3 transition-colors"
          >
            Découvrir la box
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>
    </>
  );
}
