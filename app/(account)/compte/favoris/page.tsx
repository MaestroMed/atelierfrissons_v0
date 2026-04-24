import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { getWishlistSnapshot } from '@/lib/wishlist/store';
import { getMockProductBySlug } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Mes favoris',
  description: 'Retrouvez les objets Atelier Frisson que vous avez mis de côté.',
  robots: { index: false, follow: false },
};

export default async function FavorisPage() {
  const snapshot = await getWishlistSnapshot();
  // On enrichit depuis le catalogue pour avoir toutes les métadonnées ProductCard
  const products = snapshot.items
    .map((item) => getMockProductBySlug(item.slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">Mes favoris</h2>
          <p className="text-encre/65 mt-2 text-sm">
            {products.length > 0
              ? `${products.length} objet${products.length > 1 ? 's' : ''} mis de côté.`
              : 'Les objets que vous mettez de côté apparaissent ici.'}
          </p>
        </div>
        {products.length > 0 ? (
          <p className="ui-caps text-or-dark/80 hidden shrink-0 md:inline-flex">Gardé pour vous</p>
        ) : null}
      </header>

      {products.length === 0 ? (
        <div className="border-encre/10 bg-ivoire-light flex flex-col items-center gap-4 border py-16 text-center">
          <Heart
            className="text-encre/30"
            aria-hidden="true"
            strokeWidth={1.2}
            style={{ width: '2.5rem', height: '2.5rem' }}
          />
          <p className="font-italic-editorial text-encre/70 max-w-md">
            Aucun favori pour le moment. Parcourez la collection et appuyez sur le cœur pour
            composer votre petite sélection privée.
          </p>
          <Link
            href="/boutique"
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-2 inline-flex items-center gap-2 border px-5 py-2.5 transition-colors"
          >
            Découvrir la collection
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} variant="compact" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
