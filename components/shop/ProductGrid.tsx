import type { Product } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: readonly Product[];
  className?: string;
  /** Nombre d'items considérés "above the fold" pour priority loading. */
  abovefoldCount?: number;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  className,
  abovefoldCount = 3,
  emptyMessage = 'Aucun objet ne correspond à votre sélection.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="font-italic-editorial text-encre/70 text-lg">{emptyMessage}</p>
        <p className="ui-caps text-or-dark">Atelier Frisson — Maison du rituel intime</p>
      </div>
    );
  }

  return (
    <ul className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8', className)}>
      {products.map((product, i) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} priority={i < abovefoldCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
