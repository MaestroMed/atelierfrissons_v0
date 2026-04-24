import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { JsonLd } from '@/components/shared/JsonLd';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { buildArticleSchema } from '@/lib/seo/structured-data';
import { ProductCard } from '@/components/shop/ProductCard';
import {
  getMockArticleBySlug,
  getMockArticles,
  getMockFeaturedArticles,
} from '@/lib/mock/articles';
import { getMockProductBySlug } from '@/lib/mock/products';
import { formatDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getMockArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getMockArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/rituels/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      authors: [article.author],
      publishedTime: article.publishedAt.toISOString(),
    },
  };
}

export default async function RituelArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getMockArticleBySlug(slug);
  if (!article) notFound();

  const relatedProducts = article.relatedProductSlugs
    .map((s) => getMockProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== null);
  const otherArticles = getMockFeaturedArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  return (
    <>
      <ScrollProgress targetSelector="article.prose-article" />
      <JsonLd
        data={buildArticleSchema({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          author: article.author,
          authorRole: article.authorRole,
          publishedAt: article.publishedAt,
          updatedAt: article.publishedAt,
        })}
      />

      <Container className="py-10 md:py-14" width="narrow">
        <BreadcrumbNav
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Rituels', href: '/rituels' },
            { label: article.title, href: `/rituels/${article.slug}` },
          ]}
          className="mb-10"
        />

        <header className="flex flex-col items-center gap-5 text-center">
          <p className="ui-caps text-or-dark">{article.category}</p>
          <h1 className="font-display text-noir text-4xl leading-tight font-medium md:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <Fleuron variant="divider" size="md" color="or" className="opacity-70" />
          <p className="font-italic-editorial text-encre/75 max-w-xl text-lg md:text-xl">
            {article.excerpt}
          </p>
          <div className="text-encre/65 mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <span className="ui-caps">Par {article.author}</span>
            <span className="ui-caps inline-flex items-center gap-1.5">
              <Clock className="size-3" aria-hidden="true" />
              {article.readingTimeMinutes} min
            </span>
            <span className="ui-caps">{formatDate(article.publishedAt)}</span>
          </div>
        </header>

        <div
          className={`mt-10 aspect-[16/10] overflow-hidden bg-gradient-to-br ${
            article.heroGradient === 'rouge'
              ? 'from-rouge-dark via-rouge to-rouge-light'
              : article.heroGradient === 'noir'
                ? 'from-noir-velours via-noir to-noir-light'
                : 'from-ivoire-light via-ivoire to-ivoire-dark'
          }`}
          aria-hidden="true"
        />

        <article
          className="prose-article text-encre/85 mt-16 text-base leading-relaxed md:text-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.authorBio ? (
          <aside className="border-encre/10 mt-16 flex flex-col gap-3 border-t pt-10">
            <p className="ui-caps text-or-dark">À propos de l’auteur</p>
            <h3 className="font-display text-noir text-xl font-medium">{article.author}</h3>
            <p className="text-encre/75 text-sm">{article.authorBio}</p>
          </aside>
        ) : null}
      </Container>

      {relatedProducts.length > 0 ? (
        <section aria-labelledby="related-prods" className="bg-ivoire-light py-16 md:py-20">
          <Container>
            <header className="mb-10 text-center">
              <p className="ui-caps text-or-dark">Pour aller plus loin</p>
              <h2 id="related-prods" className="font-display mt-3 text-3xl font-medium md:text-4xl">
                Objets cités dans cet article
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-4 opacity-70" />
            </header>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} variant="compact" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {otherArticles.length > 0 ? (
        <Container className="py-14 md:py-20" width="narrow">
          <h2 className="ui-caps text-or-dark mb-8">Lectures complémentaires</h2>
          <ul className="space-y-6">
            {otherArticles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/rituels/${a.slug}`}
                  className="group border-encre/10 hover:border-or flex items-center justify-between gap-4 border-b pb-6"
                >
                  <div>
                    <p className="ui-caps text-or-dark">{a.category}</p>
                    <p className="font-display text-noir group-hover:text-or-dark mt-2 text-xl font-medium transition-colors">
                      {a.title}
                    </p>
                    <p className="text-encre/65 mt-2 text-sm">{a.excerpt}</p>
                  </div>
                  <ArrowLeft
                    className="text-encre/40 group-hover:text-or size-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  );
}
