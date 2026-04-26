import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Gift } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { findMockBundleBySlug, getMockBundles } from '@/lib/mock/bundles';
import { formatPriceCents } from '@/lib/format';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = findMockBundleBySlug(slug);
  if (!bundle) {
    return {
      title: 'Coffret introuvable — Atelier Frisson',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: bundle.seoTitle ?? `${bundle.name} — Atelier Frisson`,
    description: bundle.seoDescription ?? bundle.descriptionShort,
    alternates: { canonical: `/bundle/${bundle.slug}` },
    openGraph: {
      type: 'website',
      title: `${bundle.name} — Atelier Frisson`,
      description: bundle.descriptionShort,
    },
  };
}

export default async function BundleDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const bundle = findMockBundleBySlug(slug);
  if (!bundle || bundle.status !== 'active') {
    notFound();
  }

  const savings = bundle.compareAtPriceCents ? bundle.compareAtPriceCents - bundle.priceCents : 0;

  const otherBundles = getMockBundles()
    .filter((b) => b.slug !== bundle.slug)
    .slice(0, 3);

  return (
    <>
      {/* HERO produit ── 2 colonnes : visuel + commande */}
      <section className="bg-ivoire-light">
        <Container className="py-12 md:py-20">
          <nav aria-label="Fil d'Ariane" className="text-noir-velours/60 font-body mb-6 text-xs">
            <Link href="/" className="hover:text-noir-velours">
              Accueil
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link href="/bundles" className="hover:text-noir-velours">
              Coffrets
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-noir-velours">{bundle.name}</span>
          </nav>

          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            {/* Visuel */}
            <div className="bg-ivoire border-noir-velours/10 relative aspect-[4/5] overflow-hidden rounded-sm border">
              <div className="absolute inset-0 flex items-center justify-center">
                <Fleuron className="text-or/40 h-16 w-auto" />
              </div>
              {bundle.isFeatured && (
                <span className="bg-or text-noir-velours font-body absolute top-4 left-4 rounded-sm px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                  Coffret signature
                </span>
              )}
            </div>

            {/* Commande */}
            <div>
              <Fleuron className="text-or h-5 w-auto" />
              <h1 className="font-display text-noir-velours mt-4 text-4xl leading-tight md:text-5xl">
                {bundle.name}
              </h1>
              <p className="font-display text-noir-light mt-3 text-xl italic">{bundle.tagline}</p>

              <div className="mt-8 flex items-baseline gap-3">
                <span className="font-display text-noir-velours text-4xl tabular-nums">
                  {formatPriceCents(bundle.priceCents, 'EUR').replace(',00', '')}
                </span>
                {bundle.compareAtPriceCents && (
                  <>
                    <span className="text-noir-velours/40 font-body text-base tabular-nums line-through">
                      {formatPriceCents(bundle.compareAtPriceCents, 'EUR').replace(',00', '')}
                    </span>
                    <span className="bg-rouge text-ivoire font-body rounded-sm px-2 py-0.5 text-xs tracking-wider uppercase">
                      Économisez {formatPriceCents(savings, 'EUR').replace(',00', '')}
                    </span>
                  </>
                )}
              </div>

              <p className="text-noir-velours/85 font-body mt-8 text-base leading-relaxed">
                {bundle.descriptionLong ?? bundle.descriptionShort}
              </p>

              <ul className="mt-8 space-y-3">
                <li className="text-noir-velours/85 font-body flex items-start gap-2 text-sm">
                  <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Livré sous 5 jours ouvrés en boîte ivoire signée</span>
                </li>
                <li className="text-noir-velours/85 font-body flex items-start gap-2 text-sm">
                  <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Carte personnalisable et ruban or inclus</span>
                </li>
                <li className="text-noir-velours/85 font-body flex items-start gap-2 text-sm">
                  <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Aucune mention extérieure du contenu — confidentialité garantie</span>
                </li>
                <li className="text-noir-velours/85 font-body flex items-start gap-2 text-sm">
                  <Check className="text-or mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Retours sous 14 jours pour les pièces non descellées</span>
                </li>
              </ul>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="bg-noir-velours text-ivoire hover:bg-noir-light font-body inline-flex flex-1 items-center justify-center gap-2 rounded-sm px-8 py-3 text-sm font-medium tracking-wider uppercase transition"
                >
                  Ajouter au panier
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <Link
                  href="/cartes-cadeaux"
                  className="text-noir-velours border-noir-velours/30 hover:border-noir-velours font-body inline-flex items-center justify-center gap-2 rounded-sm border px-6 py-3 text-sm font-medium tracking-wider uppercase transition"
                >
                  <Gift className="h-4 w-4" aria-hidden="true" />
                  Offrir
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* AUTRES COFFRETS */}
      {otherBundles.length > 0 && (
        <section className="bg-ivoire">
          <Container className="py-16 md:py-20">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <Fleuron className="text-or mb-3 h-5 w-auto" />
                <h2 className="font-display text-noir-velours text-2xl md:text-3xl">
                  Autres coffrets
                </h2>
              </div>
              <Link
                href="/bundles"
                className="text-noir-velours hover:text-or font-body inline-flex items-center gap-1 text-xs tracking-wider uppercase transition"
              >
                Tout voir
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {otherBundles.map((b) => (
                <Link
                  key={b.id}
                  href={`/bundle/${b.slug}`}
                  className="bg-ivoire-light border-noir-velours/10 group flex flex-col rounded-sm border p-6 transition hover:shadow-md"
                >
                  <div className="bg-noir-velours/5 relative mb-4 aspect-[4/5] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Fleuron className="text-or/40 h-10 w-auto" />
                    </div>
                  </div>
                  <h3 className="font-display text-noir-velours text-xl">{b.name}</h3>
                  <p className="text-noir-velours/70 font-display mt-1 text-sm italic">
                    {b.tagline}
                  </p>
                  <p className="font-display text-noir-velours mt-3 text-lg tabular-nums">
                    {formatPriceCents(b.priceCents, 'EUR').replace(',00', '')}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
