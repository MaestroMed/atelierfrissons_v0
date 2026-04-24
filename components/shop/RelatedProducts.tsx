import type { Product } from '@/lib/db/schema';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: readonly Product[];
  title?: string;
  subtitle?: string;
}

export function RelatedProducts({
  products,
  title = 'Dans le même univers',
  subtitle = 'Trois objets qui prolongent ce rituel.',
}: RelatedProductsProps) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="bg-ivoire-light py-20 md:py-24">
      <Container>
        <header className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
          <p className="ui-caps text-or-dark">Compositions</p>
          <h2 id="related-heading" className="font-display text-3xl font-medium md:text-4xl">
            {title}
          </h2>
          <Fleuron variant="divider" size="md" color="or" className="opacity-70" />
          <p className="font-italic-editorial text-encre/70">{subtitle}</p>
        </header>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {products.slice(0, 3).map((p) => (
            <li key={p.id}>
              <ProductCard product={p} variant="compact" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
