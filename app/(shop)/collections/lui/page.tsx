import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Mars } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CollectionAudienceHero } from '@/components/marketing/CollectionAudienceHero';
import { getMockProductsByAudience } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Pour Lui — Massagers, bandeau soie, huile bois de oud | Atelier Frisson',
  description:
    'Pour Lui : massager prostatique anatomique, pierre de massage chauffante, bandeau soie, huile parfum bois de oud. Maison française.',
  alternates: { canonical: '/collections/lui' },
  openGraph: {
    type: 'website',
    title: 'Pour Lui — Atelier Frisson',
    description: 'Massagers, accessoires soie, huile bois de oud — pour le rituel masculin.',
  },
};

const PROMISES = [
  {
    title: 'Anatomie calibrée',
    body: 'Profond a été développé avec un urologue parisien. La courbe en S est calibrée sur 14 morphologies pour une approche sans effort.',
  },
  {
    title: 'Matières nobles',
    body: 'Silicone médical mat, bandeau soie 22 momme, basalte volcanique poli, parfum bois de oud Grasse — pas d\'arrangement bas de gamme.',
  },
  {
    title: 'Discrétion totale',
    body: 'Boîte ivoire neutre, aucun marquage extérieur. Livraison Colissimo Suivi 48h. Pas de mention « adulte » sur la facture.',
  },
] as const;

export default function CollectionLuiPage() {
  const products = getMockProductsByAudience('lui', { featuredFirst: true });

  return (
    <>
      <div className="bg-noir pt-6 md:pt-8">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'Pour Lui', href: '/collections/lui' },
            ]}
            className="text-ivoire/70"
          />
        </Container>
      </div>

      <CollectionAudienceHero
        tone="lui"
        caption={`Collection · ${products.length} pièces`}
        title="Pour Lui"
        subtitle="Le rituel masculin — calibré, dense, discret."
        manifesto="Une sélection conçue pour la peau et l\'anatomie masculines : Profond (massager prostatique calibré), Pierre (basalte volcanique chauffant), Bandeau (soie 22 momme), Huile (oud + rose Grasse), Aurore (bougie cire végétale). Tout ce qui se choisit comme on choisit une cravate de cérémonie."
        ambientWord="LUI"
      />

      {/* Trois engagements */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark inline-flex items-center gap-3 text-xs">
                <Mars className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
                Trois engagements
                <Mars className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              </p>
              <h2 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
                Précision ·{' '}
                <span className="font-italic-editorial text-or-dark">matières · discrétion</span>
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
                <span className="font-italic-editorial text-or-dark">Pour Lui</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>
          <ProductGrid products={products} />
        </Container>
      </section>

      {/* Cross-link Couples */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.15)_0%,transparent_60%)]"
        />
        <Container className="relative z-10 max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or">À deux</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2 className="font-display mt-6 text-3xl font-medium md:text-4xl lg:text-5xl">
              Le rituel se partage{' '}
              <span className="font-italic-editorial text-or">aussi à deux</span>
            </h2>
            <p className="text-ivoire/80 mt-6 text-base md:text-lg">
              Découvrez la collection Pour Vous Deux — objets calibrés pour la complicité, bougie de
              massage qui devient huile, accessoires de mise en scène.
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
