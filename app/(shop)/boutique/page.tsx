import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { ProductSort } from '@/components/shop/ProductSort';
import { applyProductSort, type SortKey } from '@/lib/shop/sort';
import { getMockCategories, getMockProducts } from '@/lib/mock/products';
import type { Product } from '@/lib/db/schema';

export const metadata: Metadata = {
  title: 'Boutique — Pour vous deux, pour elle, pour lui | Atelier Frisson',
  description:
    'Toute la boutique Atelier Frisson — objets, lingerie soie, cosmétique intime, accessoires. Filtres par audience et catégorie. Livraison discrète France.',
  alternates: { canonical: '/boutique' },
};

interface BoutiqueSearchParams {
  audience?: 'couples' | 'elle' | 'lui' | 'cadeaux';
  category?: string;
  sort?: SortKey;
}

const AUDIENCE_TO_TAG = {
  couples: 'pour-vous-deux',
  elle: 'pour-elle',
  lui: 'pour-lui',
  cadeaux: 'cadeaux',
} as const;

const AUDIENCE_LABELS = {
  couples: 'Pour Vous Deux',
  elle: 'Pour Elle',
  lui: 'Pour Lui',
  cadeaux: 'Cadeaux',
} as const;

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<BoutiqueSearchParams>;
}) {
  const params = await searchParams;
  const allProducts = getMockProducts();
  const categories = getMockCategories();

  let filtered: Product[] = [...allProducts];
  if (params.audience) {
    const tag = AUDIENCE_TO_TAG[params.audience];
    filtered = filtered.filter(
      (p) => p.collection === params.audience || p.tags.includes(tag),
    );
  }
  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    if (cat) filtered = filtered.filter((p) => p.categoryId === cat.id);
  }
  const sorted = applyProductSort(filtered, params.sort ?? 'featured');

  // Counts par audience (croisé sur tags)
  const audienceCounts = {
    couples: allProducts.filter((p) => p.collection === 'couples' || p.tags.includes('pour-vous-deux')).length,
    elle: allProducts.filter((p) => p.collection === 'elle' || p.tags.includes('pour-elle')).length,
    lui: allProducts.filter((p) => p.collection === 'lui' || p.tags.includes('pour-lui')).length,
    cadeaux: allProducts.filter((p) => p.collection === 'cadeaux' || p.tags.includes('cadeaux')).length,
  };

  const categoryCounts = Object.fromEntries(
    categories.map((c) => [c.id, allProducts.filter((p) => p.categoryId === c.id).length]),
  );

  return (
    <>
      <section className="bg-ivoire-light py-10 md:py-14">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Boutique', href: '/boutique' },
              ...(params.audience
                ? [
                    {
                      label: AUDIENCE_LABELS[params.audience],
                      href: `/boutique?audience=${params.audience}`,
                    },
                  ]
                : []),
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">La collection complète</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              {params.audience ? AUDIENCE_LABELS[params.audience] : 'Boutique'}
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Vingt pièces signature — silicone médical certifié, soie 22 momme, dentelle Caudry,
              parfumerie Grasse. Livraison discrète France et UE.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Filtres */}
          <ProductFilters
            audiencesTitle="Pour qui"
            categoriesTitle="Catégorie"
            audiences={[
              { value: 'couples', label: AUDIENCE_LABELS.couples, count: audienceCounts.couples },
              { value: 'elle', label: AUDIENCE_LABELS.elle, count: audienceCounts.elle },
              { value: 'lui', label: AUDIENCE_LABELS.lui, count: audienceCounts.lui },
              { value: 'cadeaux', label: AUDIENCE_LABELS.cadeaux, count: audienceCounts.cadeaux },
            ]}
            categories={categories.map((c) => ({
              value: c.slug,
              label: c.name,
              count: categoryCounts[c.id] ?? 0,
            }))}
          />

          {/* Grille */}
          <div className="flex flex-col gap-6">
            <div className="border-encre/10 flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
              <p className="ui-caps text-encre/65">
                {sorted.length} pièce{sorted.length > 1 ? 's' : ''} en composition
              </p>
              <ProductSort />
            </div>
            <ProductGrid products={sorted} />
          </div>
        </div>
      </Container>
    </>
  );
}
