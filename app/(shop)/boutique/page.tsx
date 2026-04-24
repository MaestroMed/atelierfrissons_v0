import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { ProductSort, applyProductSort, type SortKey } from '@/components/shop/ProductSort';
import { getMockCategories, getMockProducts } from '@/lib/mock/products';
import type { Product } from '@/lib/db/schema';

export const metadata: Metadata = {
  title: 'Boutique — la collection complète',
  description:
    'Tous les objets Atelier Frisson — silicone médical, design éditorial, livraison discrète France. Filtres par collection JOUR/NUIT et par catégorie.',
  alternates: { canonical: '/boutique' },
};

interface BoutiqueSearchParams {
  collection?: 'jour' | 'nuit';
  category?: string;
  sort?: SortKey;
}

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<BoutiqueSearchParams>;
}) {
  const params = await searchParams;
  const allProducts = getMockProducts();
  const categories = getMockCategories();

  let filtered: Product[] = [...allProducts];
  if (params.collection) {
    filtered = filtered.filter((p) => p.collection === params.collection);
  }
  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    if (cat) filtered = filtered.filter((p) => p.categoryId === cat.id);
  }
  const sorted = applyProductSort(filtered, params.sort ?? 'featured');

  // Counts par filtre
  const collectionCounts = {
    jour: allProducts.filter((p) => p.collection === 'jour').length,
    nuit: allProducts.filter((p) => p.collection === 'nuit').length,
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
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">La collection complète</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              Boutique
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Huit objets composés en silicone médical certifié, livrés dans un emballage neutre
              signé de la main.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Filtres */}
          <ProductFilters
            collections={[
              { value: 'jour', label: 'JOUR', count: collectionCounts.jour },
              { value: 'nuit', label: 'NUIT', count: collectionCounts.nuit },
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
                {sorted.length} objet{sorted.length > 1 ? 's' : ''} en composition
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
