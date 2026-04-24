import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ArticleCardPreview } from '@/components/marketing/ArticleCardPreview';
import { getMockArticles } from '@/lib/mock/articles';

export const metadata: Metadata = {
  title: 'Le Journal — Rituels',
  description:
    'Le magazine éditorial Atelier Frisson — bien-être, conseils sexologue, couple, décryptage matières. Lecture lente, recommandations sourcées.',
  alternates: { canonical: '/rituels' },
};

export default function RituelsPage() {
  const articles = getMockArticles();
  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <>
      <section className="bg-ivoire-light py-12 md:py-16">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Rituels', href: '/rituels' },
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">Le Journal — magazine éditorial</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              Les Rituels
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Lecture lente — bien-être, conseil sexologue, couple, décryptage. Trois publications
              par mois, toujours signées.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        {featured ? (
          <article className="border-encre/10 mb-16 grid gap-10 border-b pb-16 md:grid-cols-[1.3fr_1fr] md:gap-14">
            <div
              className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${
                featured.heroGradient === 'rouge'
                  ? 'from-rouge-dark via-rouge to-rouge-light'
                  : featured.heroGradient === 'noir'
                    ? 'from-noir-velours via-noir to-noir-light'
                    : 'from-ivoire-light via-ivoire to-ivoire-dark'
              }`}
            >
              <div className="absolute bottom-6 left-6">
                <span className="ui-caps border-ivoire/40 bg-noir/30 text-ivoire inline-flex items-center gap-2 border px-3 py-1.5 backdrop-blur-sm">
                  À la une · {featured.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="ui-caps text-or-dark">
                Lecture · {featured.readingTimeMinutes} min · {featured.author}
              </p>
              <h2 className="font-display text-noir text-3xl leading-tight font-medium md:text-4xl lg:text-5xl">
                {featured.title}
              </h2>
              <p className="text-encre/75 text-base md:text-lg">{featured.excerpt}</p>
              <Link
                href={`/rituels/${featured.slug}`}
                className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-3 inline-flex items-center gap-3 self-start border px-6 py-3 transition-colors"
              >
                Lire l’article
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ) : null}

        {others.length > 0 ? (
          <section aria-labelledby="autres-articles">
            <header className="mb-10 flex items-end justify-between">
              <h2 id="autres-articles" className="font-display text-2xl font-medium md:text-3xl">
                Autres lectures
              </h2>
              <p className="ui-caps text-encre/55">{others.length} articles</p>
            </header>
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {others.map((a) => (
                <li key={a.slug}>
                  <ArticleCardPreview
                    article={{
                      slug: a.slug,
                      title: a.title,
                      excerpt: a.excerpt,
                      category: a.category,
                      readingTimeMinutes: a.readingTimeMinutes,
                      gradient: a.heroGradient,
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
