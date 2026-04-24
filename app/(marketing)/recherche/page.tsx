import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search, Sparkle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getMockProducts } from '@/lib/mock/products';
import { getMockArticles } from '@/lib/mock/articles';
import { sanitizeSearchQuery } from '@/lib/security/sanitize';

/** Suggestions de recherche curées — guident l'utilisateur quand la recherche est vide. */
const POPULAR_QUERIES: readonly { label: string; query: string }[] = [
  { label: 'Silicone médical', query: 'silicone' },
  { label: 'Premier Frisson', query: 'premier frisson' },
  { label: 'Collection NUIT', query: 'nuit' },
  { label: 'Rituel lent', query: 'rituel' },
  { label: 'Couple', query: 'couple' },
  { label: 'Ménopause', query: 'menopause' },
  { label: 'Vibration douce', query: 'vibration' },
  { label: 'Lubrifiant', query: 'lubrifiant' },
] as const;

export const metadata: Metadata = {
  title: 'Recherche',
  description: 'Recherchez parmi les objets, articles et guides Atelier Frisson.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function RecherchePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ? sanitizeSearchQuery(params.q).toLowerCase() : '';

  const products = getMockProducts();
  const articles = getMockArticles();

  const matchedProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tagline?.toLowerCase().includes(query) ||
          p.descriptionShort.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)),
      )
    : [];

  const matchedArticles = query
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query),
      )
    : [];

  return (
    <>
      <section className="bg-ivoire-light py-12 md:py-16">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Recherche', href: '/recherche' },
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">Recherche dans la maison</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">
              Trouver un{' '}
              <span className="font-italic-editorial text-or-dark">objet ou une lecture</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <form
              method="get"
              action="/recherche"
              className="border-encre/20 bg-ivoire focus-within:border-or mt-4 flex w-full max-w-xl items-center border"
            >
              <Search aria-hidden="true" className="text-encre/40 ml-4 size-4 shrink-0" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Produit, article, matière, rituel…"
                className="text-encre placeholder:text-encre/40 flex-1 bg-transparent px-4 py-3.5 text-base focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir shrink-0 px-6 py-3.5 transition-colors"
              >
                Chercher
              </button>
            </form>
          </header>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {!query ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <p className="font-italic-editorial text-encre/70 text-lg">
              Tapez un mot-clé pour explorer la maison — objets, articles, rituels.
            </p>
            <div className="flex flex-col items-center gap-4">
              <p className="ui-caps text-or-dark">Recherches populaires</p>
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {POPULAR_QUERIES.map((q) => (
                  <li key={q.query}>
                    <Link
                      href={`/recherche?q=${encodeURIComponent(q.query)}`}
                      className="ui-caps border-or/30 text-encre/75 hover:border-noir hover:bg-noir hover:text-ivoire inline-flex items-center border px-3 py-1.5 text-[11px] transition-colors"
                    >
                      {q.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : matchedProducts.length === 0 && matchedArticles.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-10 text-center">
            <Sparkle className="text-or/70 size-6" aria-hidden="true" strokeWidth={1.5} />
            <p className="font-italic-editorial text-encre/80 text-lg md:text-xl">
              Aucune correspondance pour «&nbsp;{query}&nbsp;».
            </p>
            <p className="text-encre/65 text-sm">
              Peut-être une faute de frappe ? Essayez un terme plus large, ou explorez ces pistes :
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {POPULAR_QUERIES.slice(0, 6).map((q) => (
                <li key={q.query}>
                  <Link
                    href={`/recherche?q=${encodeURIComponent(q.query)}`}
                    className="ui-caps border-or/30 text-encre/75 hover:border-noir hover:bg-noir hover:text-ivoire inline-flex items-center border px-3 py-1.5 text-[11px] transition-colors"
                  >
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/boutique"
                className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-2 border px-5 py-2.5 transition-colors"
              >
                Parcourir la boutique
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/rituels"
                className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2 underline underline-offset-4"
              >
                Ou lire le journal
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {/* Résultats produits */}
            <section aria-labelledby="res-produits">
              <div className="mb-6 flex items-end justify-between">
                <h2
                  id="res-produits"
                  className="font-display text-noir text-2xl font-medium md:text-3xl"
                >
                  Objets <span className="text-or-dark">·</span> {matchedProducts.length} résultat
                  {matchedProducts.length > 1 ? 's' : ''}
                </h2>
                {matchedProducts.length > 0 ? (
                  <Link
                    href="/boutique"
                    className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2"
                  >
                    Voir la boutique
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
              <ProductGrid
                products={matchedProducts}
                emptyMessage={`Aucun objet ne correspond à « ${query} ».`}
              />
            </section>

            {/* Résultats articles */}
            <section aria-labelledby="res-articles">
              <h2
                id="res-articles"
                className="font-display text-noir mb-6 text-2xl font-medium md:text-3xl"
              >
                Articles <span className="text-or-dark">·</span> {matchedArticles.length} résultat
                {matchedArticles.length > 1 ? 's' : ''}
              </h2>
              {matchedArticles.length > 0 ? (
                <ul className="grid gap-4 md:grid-cols-2">
                  {matchedArticles.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/rituels/${a.slug}`}
                        className="group border-encre/10 bg-ivoire hover:border-or flex flex-col gap-2 border p-5 transition-colors"
                      >
                        <p className="ui-caps text-or-dark">
                          {a.category} · {a.readingTimeMinutes} min
                        </p>
                        <h3 className="font-display text-noir group-hover:text-or-dark text-lg font-medium">
                          {a.title}
                        </h3>
                        <p className="text-encre/70 text-sm">{a.excerpt}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-encre/60 text-sm italic">
                  Aucun article ne correspond à « {query} ».
                </p>
              )}
            </section>
          </div>
        )}
      </Container>
    </>
  );
}
