import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { JsonLd } from '@/components/shared/JsonLd';
import { buildArticleSchema } from '@/lib/seo/structured-data';
import { getMockGuideBySlug, getMockGuides } from '@/lib/mock/articles';
import { formatDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getMockGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getMockGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePilierPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getMockGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: guide.title,
          excerpt: guide.excerpt,
          slug: guide.slug,
          author: guide.author,
          authorRole: guide.authorRole,
          publishedAt: guide.publishedAt,
          updatedAt: guide.publishedAt,
        })}
      />

      <Container className="py-10 md:py-14">
        <BreadcrumbNav
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: guide.title, href: `/guides/${guide.slug}` },
          ]}
          className="mb-10"
        />

        <header className="mx-auto max-w-3xl text-center">
          <p className="ui-caps text-or-dark">
            Guide pilier · co-signé sexologue + pharmacien D.E.
          </p>
          <h1 className="font-display text-noir mt-3 text-4xl leading-tight font-medium md:text-5xl lg:text-6xl">
            {guide.title}
          </h1>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-4 opacity-80" />
          <p className="font-italic-editorial text-encre/75 mt-6 text-lg md:text-xl">
            {guide.excerpt}
          </p>
          <div className="text-encre/65 mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <span className="ui-caps">Par {guide.author}</span>
            <span className="ui-caps inline-flex items-center gap-1.5">
              <Clock className="size-3" aria-hidden="true" />
              {guide.readingTimeMinutes} min
            </span>
            <span className="ui-caps">Publié {formatDate(guide.publishedAt)}</span>
          </div>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* TOC sticky */}
          <aside className="hidden lg:sticky lg:top-32 lg:block lg:h-fit">
            <p className="ui-caps text-or-dark">Sommaire</p>
            <ol className="border-encre/10 mt-4 space-y-2.5 border-l pl-4 text-sm">
              {guide.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-encre/75 hover:text-or-dark transition-colors"
                  >
                    <span className="ui-caps text-or-dark mr-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          {/* Content */}
          <article
            className="prose-article text-encre/85 max-w-none text-base leading-relaxed md:text-lg"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </div>
      </Container>
    </>
  );
}
