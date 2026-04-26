import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { getMockBundles } from '@/lib/mock/bundles';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Coffrets & Bundles — Atelier Frisson',
  description:
    'Coffrets pré-fabriqués pour rituel à deux, week-end, anniversaire de mariage. Économisez jusqu’à 25 € par rapport aux pièces séparées.',
  alternates: { canonical: '/bundles' },
  openGraph: {
    type: 'website',
    title: 'Coffrets & Bundles — Atelier Frisson',
    description: 'Soirée à deux, Évasion week-end, Anniversaire de mariage — coffrets signés.',
  },
};

const OCCASION_LABEL: Record<string, string> = {
  pas_d_occasion: 'Toute occasion',
  saint_valentin: 'Saint-Valentin',
  anniversaire: 'Anniversaire',
  evjf: 'EVJF',
  evg: 'EVG',
  noel: 'Noël',
  mariage: 'Mariage',
};

export default function BundlesPage(): React.ReactElement {
  const bundles = getMockBundles();

  return (
    <>
      {/* HERO */}
      <section className="bg-ivoire-light">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron className="text-or mx-auto mb-6 h-6 w-auto" />
            <p className="text-or font-body text-xs tracking-[0.3em] uppercase">Coffrets signés</p>
            <h1 className="font-display text-noir-velours mt-4 text-4xl leading-tight md:text-6xl">
              Bundles & coffrets
            </h1>
            <p className="font-display text-noir-light mt-6 text-xl italic md:text-2xl">
              Une sélection assemblée pour chaque moment.
            </p>
            <p className="text-noir-velours/80 font-body mx-auto mt-8 max-w-2xl text-base leading-relaxed">
              Conçus comme des écrins, livrés dans une boîte ivoire signée à la main, avec carte
              personnalisable et ruban or. Économisez jusqu’à 25 € vs les pièces séparées.
            </p>
          </div>
        </Container>
      </section>

      {/* GRID BUNDLES */}
      <section className="bg-ivoire">
        <Container className="py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle) => {
              const savings = bundle.compareAtPriceCents
                ? bundle.compareAtPriceCents - bundle.priceCents
                : 0;

              return (
                <article
                  key={bundle.id}
                  className="bg-ivoire-light border-noir-velours/10 group flex flex-col overflow-hidden rounded-sm border transition hover:shadow-md"
                >
                  {/* Image placeholder en attendant les visuels CJ */}
                  <div className="bg-noir-velours/5 relative aspect-[4/5] w-full overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Fleuron className="text-or/40 h-12 w-auto" />
                    </div>
                    {bundle.isFeatured && (
                      <span className="bg-or text-noir-velours font-body absolute top-4 left-4 rounded-sm px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                        Coffret signature
                      </span>
                    )}
                    {bundle.occasion !== 'pas_d_occasion' && (
                      <span className="bg-rouge text-ivoire font-body absolute top-4 right-4 rounded-sm px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                        {OCCASION_LABEL[bundle.occasion]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h2 className="font-display text-noir-velours text-2xl">{bundle.name}</h2>
                    <p className="text-noir-velours/70 font-display mt-1 text-base italic">
                      {bundle.tagline}
                    </p>
                    <p className="text-noir-velours/80 font-body mt-4 text-sm leading-relaxed">
                      {bundle.descriptionShort}
                    </p>

                    <div className="mt-auto pt-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-noir-velours text-2xl tabular-nums">
                          {formatPriceCents(bundle.priceCents, 'EUR').replace(',00', '')}
                        </span>
                        {bundle.compareAtPriceCents && (
                          <>
                            <span className="text-noir-velours/40 font-body text-sm tabular-nums line-through">
                              {formatPriceCents(bundle.compareAtPriceCents, 'EUR').replace(
                                ',00',
                                '',
                              )}
                            </span>
                            <span className="text-rouge font-body text-xs tracking-wider uppercase">
                              −{formatPriceCents(savings, 'EUR').replace(',00', '')}
                            </span>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/bundle/${bundle.slug}`}
                        className="bg-noir-velours text-ivoire hover:bg-noir-light font-body mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wider uppercase transition"
                      >
                        Découvrir le coffret
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {bundles.length === 0 && (
            <p className="text-noir-velours/60 font-body py-20 text-center text-base">
              Les premiers coffrets seront publiés dès l’ouverture de la maison.
            </p>
          )}
        </Container>
      </section>

      {/* CTA secondaire vers box mensuelle */}
      <section className="bg-rouge text-ivoire">
        <Container className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron className="text-or mx-auto mb-4 h-5 w-auto" />
            <h2 className="font-display text-3xl md:text-4xl">Chaque mois, un nouveau chapitre</h2>
            <p className="font-display text-ivoire/80 mt-4 text-lg italic">
              Découvrez la box mensuelle Rituel Frisson — sans engagement.
            </p>
            <Link
              href="/box-mensuelle"
              className="bg-ivoire text-noir-velours hover:bg-ivoire-dark font-body mt-8 inline-flex items-center gap-2 rounded-sm px-8 py-3 text-sm font-medium tracking-wider uppercase transition"
            >
              Découvrir la box
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
