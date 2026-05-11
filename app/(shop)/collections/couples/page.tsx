import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CollectionAudienceHero } from '@/components/marketing/CollectionAudienceHero';
import { getMockProductsByAudience } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Pour Vous Deux — Le rituel partagé | Atelier Frisson',
  description:
    'Pour Vous Deux : objets, cosmétiques et accessoires pensés pour le rituel à deux. Couple 30-50 ans, livraison discrète France et UE.',
  alternates: { canonical: '/collections/couples' },
  openGraph: {
    type: 'website',
    title: 'Pour Vous Deux — Atelier Frisson',
    description: 'Le rituel partagé. Objets, bougies de massage, accessoires premium.',
  },
};

const PROMISES = [
  {
    title: 'Pensé pour deux',
    body: 'Forme, mécanique, rythme — chaque pièce de cette collection a été calibrée pour la complicité, pas pour l\'usage solo.',
  },
  {
    title: 'Discrétion absolue',
    body: 'Boîte ivoire neutre, aucune mention extérieure du contenu, livraison Colissimo Suivi 48h en France.',
  },
  {
    title: 'Renouvelable mensuellement',
    body: 'Compatibles avec la Box Mensuelle — chaque mois, une nouvelle pièce capsule rejoint le rituel.',
  },
] as const;

export default function CollectionCouplesPage() {
  const products = getMockProductsByAudience('couples', { featuredFirst: true });

  return (
    <>
      <div className="bg-rouge pt-6 md:pt-8">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'Pour Vous Deux', href: '/collections/couples' },
            ]}
            className="text-ivoire/70"
          />
        </Container>
      </div>

      <CollectionAudienceHero
        tone="couples"
        caption={`Collection · ${products.length} pièces`}
        title="Pour Vous Deux"
        subtitle="Le rituel partagé, sans intrusion visuelle."
        manifesto="Cette collection rassemble nos pièces conçues pour le geste à deux : Duo (forme en U), Murmure (toy télécommandé), Pierre (massage chauffant), Aurore (bougie qui devient huile). Chacune calibrée pour s\'effacer pendant l\'usage et durer dans la mémoire après."
        ambientWord="DEUX"
      />

      {/* Promesses pivot */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark inline-flex items-center gap-3 text-xs">
                <Heart className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
                Pourquoi cette collection
                <Heart className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              </p>
              <h2 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
                Trois engagements{' '}
                <span className="font-italic-editorial text-or-dark">pour le rituel à deux</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
            {PROMISES.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-5 p-7 md:p-9">
                  <span className="font-display tabular text-or-dark text-3xl font-medium">
                    {`0${i + 1}`.slice(-2)}
                  </span>
                  <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="font-italic-editorial text-encre/80 text-base leading-relaxed">
                    {p.body}
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
                <span className="font-italic-editorial text-or-dark">à deux</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>
          <ProductGrid products={products} />
        </Container>
      </section>

      {/* Cross-link Coffrets */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.18)_0%,transparent_60%)]"
        />
        <Container className="relative z-10 max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or">Le geste prêt-à-offrir</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              Six coffrets{' '}
              <span className="font-italic-editorial text-or">pensés pour le rituel à deux</span>
            </h2>
            <p className="text-ivoire/80 mt-6 text-base md:text-lg">
              Soirée à Deux, Évasion Week-end, Lune de Miel — chaque coffret combine objet,
              cosmétique et accessoire dans une boîte écrin signée à la main.
            </p>
            <Link
              href="/bundles"
              className="ui-caps bg-or text-noir hover:bg-or-light mt-10 inline-flex items-center gap-3 px-8 py-4 transition-colors"
            >
              Voir les coffrets
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
