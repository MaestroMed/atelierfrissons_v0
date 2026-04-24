import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Minus, GitCompareArrows } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { PriceTag } from '@/components/shop/PriceTag';
import { StockBadge } from '@/components/shop/StockBadge';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { ReviewStars } from '@/components/shop/ReviewStars';
import { CompareRowActions } from '@/components/shop/CompareRowActions';
import { getMockProductBySlug } from '@/lib/mock/products';
import { getMockReviewsForProduct, summarizeReviews } from '@/lib/mock/reviews';
import { cn } from '@/lib/utils';
import { COMPARE_MAX_ITEMS } from '@/lib/compare/types';
import type { Product } from '@/lib/db/schema';

export const metadata: Metadata = {
  title: 'Comparer les objets',
  description: 'Comparez les objets de la collection Atelier Frisson côte à côte.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

/** Attributs de spec qu'on veut afficher si présents, dans cet ordre. */
const SPEC_KEYS: readonly string[] = [
  'Matière',
  'Matiere',
  'Hauteur',
  'Largeur',
  'Poids',
  'Autonomie',
  'Charge',
  'Certifications',
  'Niveau',
  'Silence',
  'Garantie',
];

export default async function ComparerPage({ searchParams }: PageProps) {
  const { ids } = await searchParams;

  const slugs = (ids ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[a-z0-9-]+$/.test(s))
    .slice(0, COMPARE_MAX_ITEMS);

  const products = slugs
    .map((slug) => getMockProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  // Summaries d'avis pour chaque produit — server-side
  const summaries = products.map((p) => summarizeReviews(getMockReviewsForProduct(p.slug)));

  return (
    <Container className="py-10 md:py-14">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Boutique', href: '/boutique' },
          { label: 'Comparer', href: '/comparer' },
        ]}
        className="mb-8"
      />

      <header className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16">
        <p className="ui-caps text-or-dark">Sélection côte à côte</p>
        <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
          Comparer{' '}
          <span className="font-italic-editorial text-or-dark">
            jusqu’à {COMPARE_MAX_ITEMS} objets
          </span>
        </h1>
        <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
        <p className="font-italic-editorial text-encre/70 text-base md:text-lg">
          Matières, dimensions, vibrations, avis — pour choisir le rituel qui vous appartient.
        </p>
      </header>

      {products.length === 0 ? <EmptyState /> : null}

      {products.length > 0 ? <ComparisonTable products={products} summaries={summaries} /> : null}
    </Container>
  );
}

// ── Empty state ───────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="border-encre/10 bg-ivoire-light mx-auto flex max-w-xl flex-col items-center gap-5 border py-16 text-center">
      <GitCompareArrows
        className="text-encre/30"
        aria-hidden="true"
        strokeWidth={1.2}
        style={{ width: '2.5rem', height: '2.5rem' }}
      />
      <p className="font-italic-editorial text-encre/75 max-w-md text-lg">
        Aucun objet à comparer pour le moment.
      </p>
      <p className="text-encre/65 text-sm">
        Depuis la boutique ou la grille d’une collection, sélectionnez 2&nbsp;à&nbsp;
        {COMPARE_MAX_ITEMS}
        &nbsp;objets via le bouton « Comparer » qui apparaît sur la carte au survol.
      </p>
      <Link
        href="/boutique"
        className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-2 inline-flex items-center gap-3 border px-7 py-3 transition-colors"
      >
        Découvrir la collection
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

// ── Table principale ──────────────────────────────────────────────────
interface ComparisonTableProps {
  products: readonly Product[];
  summaries: readonly ReturnType<typeof summarizeReviews>[];
}

function ComparisonTable({ products, summaries }: ComparisonTableProps) {
  // Calcule l'union des clés de specs présentes, filtrée et ordonnée selon SPEC_KEYS
  const allSpecKeys = new Set<string>();
  for (const p of products) {
    if (p.specs) {
      for (const k of Object.keys(p.specs)) {
        allSpecKeys.add(k);
      }
    }
  }
  // Ordre : d'abord les clés connues dans SPEC_KEYS, puis le reste alphabétique
  const orderedSpecs = [
    ...SPEC_KEYS.filter((k) => allSpecKeys.has(k)),
    ...[...allSpecKeys].filter((k) => !SPEC_KEYS.includes(k)).sort(),
  ];

  // Union des features pour la ligne « caractéristiques »
  const allFeatures = new Set<string>();
  for (const p of products) {
    for (const f of p.features) {
      allFeatures.add(f);
    }
  }
  const orderedFeatures = [...allFeatures].sort();

  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'w-full border-separate [border-spacing:0]',
          // Force une largeur min pour activer le scroll horizontal sur mobile
          'min-w-[640px]',
        )}
      >
        <caption className="sr-only">Comparaison des objets sélectionnés</caption>
        <thead>
          <tr>
            <th scope="col" className="sr-only">
              Attribut
            </th>
            {products.map((p) => (
              <th
                key={p.id}
                scope="col"
                className="bg-ivoire-light border-encre/10 border-b p-4 text-left align-top"
              >
                <ProductHeader product={p} />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <Row label="Collection">
            {products.map((p) => (
              <td key={p.id} className="border-encre/8 border-b p-4">
                <span className="ui-caps text-or-dark">{collectionLabel(p.collection)}</span>
              </td>
            ))}
          </Row>

          <Row label="Prix">
            {products.map((p) => (
              <td key={p.id} className="border-encre/8 border-b p-4">
                <PriceTag
                  priceCents={p.priceCents}
                  compareAtPriceCents={p.compareAtPriceCents}
                  size="md"
                />
              </td>
            ))}
          </Row>

          <Row label="Disponibilité">
            {products.map((p) => (
              <td key={p.id} className="border-encre/8 border-b p-4">
                <StockBadge stockStatus={p.stockStatus} stockQuantity={p.stockQuantity} />
              </td>
            ))}
          </Row>

          <Row label="Avis">
            {products.map((p, i) => {
              const s = summaries[i];
              if (!s) {
                return (
                  <td key={p.id} className="border-encre/8 border-b p-4">
                    <span className="text-encre/40 inline-flex items-center gap-1 text-xs">
                      <Minus className="size-3" aria-hidden="true" />
                      Pas encore d’avis
                    </span>
                  </td>
                );
              }
              return (
                <td key={p.id} className="border-encre/8 border-b p-4">
                  <div className="flex flex-col gap-1">
                    <ReviewStars rating={s.averageRating} size="sm" />
                    <span className="text-encre/65 text-xs">
                      {s.averageRating.toFixed(1)} · {s.count} avis
                    </span>
                  </div>
                </td>
              );
            })}
          </Row>

          {/* Specs dynamiques */}
          {orderedSpecs.map((specKey) => (
            <Row key={specKey} label={specKey}>
              {products.map((p) => {
                const value = p.specs?.[specKey];
                return (
                  <td key={p.id} className="border-encre/8 border-b p-4 text-sm">
                    {value ? (
                      <span className="text-encre/80">{value}</span>
                    ) : (
                      <Minus className="text-encre/30 size-3.5" aria-label="Non applicable" />
                    )}
                  </td>
                );
              })}
            </Row>
          ))}

          {/* Features checklist */}
          {orderedFeatures.length > 0 ? (
            <Row label="Caractéristiques">
              {products.map((p) => (
                <td key={p.id} className="border-encre/8 border-b p-4 align-top">
                  <ul className="flex flex-col gap-1.5 text-xs">
                    {orderedFeatures.map((f) => {
                      const has = p.features.includes(f);
                      return (
                        <li
                          key={f}
                          className={cn(
                            'flex items-start gap-2',
                            has ? 'text-encre/85' : 'text-encre/35',
                          )}
                        >
                          {has ? (
                            <Check
                              className="text-af-success mt-0.5 size-3 shrink-0"
                              aria-hidden="true"
                              strokeWidth={2}
                            />
                          ) : (
                            <Minus
                              className="mt-0.5 size-3 shrink-0"
                              aria-hidden="true"
                              strokeWidth={1.5}
                            />
                          )}
                          <span>{f}</span>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              ))}
            </Row>
          ) : null}

          {/* CTAs */}
          <tr>
            <th scope="row" className="sr-only">
              Action
            </th>
            {products.map((p) => (
              <td key={p.id} className="border-encre/8 border-b p-4 align-top">
                <div className="flex flex-col gap-2.5">
                  <AddToCartButton
                    slug={p.slug}
                    productName={p.name}
                    collection={p.collection}
                    size="sm"
                  />
                  <Link
                    href={`/produit/${p.slug}`}
                    className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2 self-start underline underline-offset-4 transition-all hover:gap-3"
                  >
                    Fiche complète
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Row helper (label + cells) ────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th
        scope="row"
        className="ui-caps text-encre/60 border-encre/8 bg-ivoire-light/40 sticky left-0 z-[1] border-b p-4 text-left align-top text-[10px] md:static md:w-40"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}

// ── Product header cell ───────────────────────────────────────────────
function ProductHeader({ product }: { product: Product }) {
  const isNuit = product.collection === 'nuit';
  return (
    <div className="flex min-w-[220px] flex-col gap-3">
      <Link
        href={`/produit/${product.slug}`}
        className={cn(
          'flex aspect-[4/5] items-center justify-center overflow-hidden border',
          isNuit ? 'border-or/30 bg-rouge' : 'border-or/15 bg-ivoire',
        )}
      >
        <ProductSilhouette variant={isNuit ? 'nuit' : 'jour'} className="h-[78%]" />
      </Link>
      <div className="flex flex-col gap-1">
        <Link
          href={`/produit/${product.slug}`}
          className="font-display text-noir hover:text-or-dark text-base font-medium transition-colors md:text-lg"
        >
          {product.name}
        </Link>
        {product.tagline ? (
          <p className="font-italic-editorial text-encre/65 text-xs">{product.tagline}</p>
        ) : null}
      </div>
      <CompareRowActions slug={product.slug} productName={product.name} />
    </div>
  );
}

function collectionLabel(collection: string | null): string {
  switch (collection) {
    case 'jour':
      return 'JOUR';
    case 'nuit':
      return 'NUIT';
    case 'inaugurale':
      return 'Inaugurale';
    case 'signature':
      return 'Signature';
    default:
      return '—';
  }
}
