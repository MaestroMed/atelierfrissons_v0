import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getMockProductsByCollection } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Collection JOUR — légèreté du rituel quotidien',
  description:
    'La collection JOUR : objets en silicone médical mat ivoire, format compact, ergonomie pour les rituels rapides. Maison française.',
  alternates: { canonical: '/collections/jour' },
};

export default function CollectionJourPage() {
  const products = getMockProductsByCollection('jour');

  return (
    <>
      <section className="bg-ivoire relative isolate overflow-hidden py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.7)_0%,transparent_55%)]"
        />
        <Container className="relative">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'JOUR', href: '/collections/jour' },
            ]}
            className="mb-10"
          />
          <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">Collection · {products.length} objets</p>
            <h1 className="font-display text-noir text-5xl leading-none font-medium md:text-7xl lg:text-8xl">
              JOUR
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-2 opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-lg md:text-xl">
              Pour la légèreté, le rituel rapide, le moment volé.
            </p>
            <p className="text-encre/75 mt-4 max-w-xl text-base leading-relaxed">
              La collection JOUR rassemble nos objets pensés pour la facilité — silicone médical
              mat, format compact, vibrations discrètes. Pour les rituels du matin, ceux qu’on
              s’offre entre deux rendez-vous, ou le simple plaisir d’un moment volé à la journée.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
