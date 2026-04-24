import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getMockProductsByCollection } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Collection NUIT — profondeur du rituel attentif',
  description:
    'La collection NUIT : objets en silicone médical glossy, finition laquée, ergonomie pour les rituels du soir et de la complicité.',
  alternates: { canonical: '/collections/nuit' },
};

export default function CollectionNuitPage() {
  const products = getMockProductsByCollection('nuit');

  return (
    <>
      <section className="bg-rouge text-ivoire relative isolate overflow-hidden py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_at_70%_30%,rgba(255,220,180,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_20%_70%,rgba(201,163,107,0.12)_0%,transparent_55%)]"
        />
        <Container className="relative">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'NUIT', href: '/collections/nuit' },
            ]}
            className="[&_*]:!text-ivoire/70 mb-10"
          />
          <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or">Collection · {products.length} objets</p>
            <h1 className="font-display text-or text-5xl leading-none font-medium md:text-7xl lg:text-8xl">
              NUIT
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-2 opacity-80" />
            <p className="font-italic-editorial text-or text-lg md:text-xl">
              Pour la profondeur, le geste lent, la complicité.
            </p>
            <p className="text-ivoire/85 mt-4 max-w-xl text-base leading-relaxed">
              La collection NUIT rassemble nos pièces les plus abouties — silicone laqué glossy,
              finition triple polissage, moteurs synchronisés. Pour les rituels du soir, ceux qui
              prennent leur temps, et la complicité à deux.
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
