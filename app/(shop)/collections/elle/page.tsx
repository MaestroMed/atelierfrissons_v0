import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Venus } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CollectionAudienceHero } from '@/components/marketing/CollectionAudienceHero';
import { getMockProductsByAudience } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Pour Elle — Objets, lingerie soie, cosmétique | Atelier Frisson',
  description:
    'Pour Elle : objets de rituel, nuisettes soie 22 momme, body dentelle Caudry, sels de bain. Confection Roubaix, livraison discrète.',
  alternates: { canonical: '/collections/elle' },
  openGraph: {
    type: 'website',
    title: 'Pour Elle — Atelier Frisson',
    description: 'Objets, lingerie soie, body dentelle Caudry, sels de bain rituels.',
  },
};

const FACETS = [
  {
    title: 'Objets',
    body: 'Velours (signature laque oxblood), Onde (wand bicolore), Étincelle (bullet poche), Crescendo (Bolero progressif).',
  },
  {
    title: 'Lingerie soie',
    body: 'Sillage (nuisette 22 momme), Dentelle Noire (body Caudry), Kimono (robe sablée), Jarretelles, Bas Couture.',
  },
  {
    title: 'Cosmétique',
    body: 'Source (lubrifiant base eau), Bain Rituel (sels mer Morte duo), Huile (oud + rose Grasse).',
  },
] as const;

export default function CollectionEllePage() {
  const products = getMockProductsByAudience('elle', { featuredFirst: true });

  return (
    <>
      <div className="bg-ivoire-light pt-6 md:pt-8">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'Pour Elle', href: '/collections/elle' },
            ]}
          />
        </Container>
      </div>

      <CollectionAudienceHero
        tone="elle"
        caption={`Collection · ${products.length} pièces`}
        title="Pour Elle"
        subtitle="Le rituel à soi — objets, lingerie soie, cosmétique."
        manifesto="Une sélection complète conçue autour de la peau féminine : silicone médical certifié pour les objets, soie 22 momme et dentelle Leavers de Caudry pour la lingerie, formules courtes France pour la cosmétique. Confection à Roubaix, parfumerie grassoise."
        ambientWord="ELLE"
      />

      {/* Trois facettes */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark inline-flex items-center gap-3 text-xs">
                <Venus className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
                Trois familles
                <Venus className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              </p>
              <h2 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
                Objets · Lingerie ·{' '}
                <span className="font-italic-editorial text-or-dark">Cosmétique</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
            {FACETS.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-5 p-7 md:p-9">
                  <span className="font-display tabular text-or-dark text-3xl font-medium">
                    {`0${i + 1}`.slice(-2)}
                  </span>
                  <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                    {f.title}
                  </h3>
                  <p className="font-italic-editorial text-encre/80 text-base leading-relaxed">
                    {f.body}
                  </p>
                  <Fleuron variant="divider" size="sm" color="or" className="mt-auto opacity-50" />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Grille produits */}
      <section className="bg-ivoire-light py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Les pièces</p>
              <h2 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                La sélection{' '}
                <span className="font-italic-editorial text-or-dark">Pour Elle</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>
          <ProductGrid products={products} />
        </Container>
      </section>

      {/* Cross-link Pour Vous Deux */}
      <section className="bg-rouge text-ivoire relative isolate overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_70%_30%,rgba(255,220,180,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_15%_75%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
        />
        <Container className="relative z-10 max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or/80">À deux</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              Le rituel se partage{' '}
              <span className="font-italic-editorial text-or">aussi à deux</span>
            </h2>
            <p className="text-ivoire/80 mt-6 text-base md:text-lg">
              Découvrez la collection Pour Vous Deux — objets calibrés pour la complicité,
              cosmétique partageable, accessoires de mise en scène.
            </p>
            <Link
              href="/collections/couples"
              className="ui-caps bg-or text-noir hover:bg-or-light mt-10 inline-flex items-center gap-3 px-8 py-4 transition-colors"
            >
              Découvrir Pour Vous Deux
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </Container>
      </section>

      <section className="bg-ivoire py-16 md:py-20" aria-hidden="true">
        <div className="flex flex-col items-center gap-3 text-center">
          <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
          <Wordmark as="p" size="sm" color="noir" className="opacity-70" />
          <p className="font-italic-editorial text-encre/55 text-xs">
            Maison du rituel intime — Paris
          </p>
        </div>
      </section>
    </>
  );
}
