import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { getMockGuides } from '@/lib/mock/articles';

export const metadata: Metadata = {
  title: 'Les Guides piliers',
  description:
    'Guides longs (15-25 min de lecture) co-rédigés avec sexologues et pharmaciens partenaires. Anatomie, choix, entretien, sexualité féminine.',
  alternates: { canonical: '/guides' },
};

export default function GuidesPage() {
  const guides = getMockGuides();

  return (
    <>
      <section className="bg-ivoire-light py-12 md:py-16">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Guides', href: '/guides' },
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">5 guides piliers · 15-25 min de lecture</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              Les Guides
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Co-rédigés avec sexologues, pharmaciens et gynécologues. Sources HAS, INSERM, Mayo
              Clinic. Mises à jour chaque trimestre.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <ul className="space-y-8">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="group border-encre/10 bg-ivoire hover:border-or hover:shadow-card flex flex-col gap-6 border p-8 transition-all md:flex-row md:p-10"
              >
                <BookOpen
                  className="text-or-dark size-8 shrink-0 stroke-[1.2]"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="ui-caps text-or-dark">Guide pilier · {g.author}</p>
                  <h2 className="font-display text-noir group-hover:text-or-dark mt-3 text-3xl font-medium transition-colors md:text-4xl">
                    {g.title}
                  </h2>
                  <p className="text-encre/75 mt-3 text-base md:text-lg">{g.excerpt}</p>
                  <div className="text-encre/65 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                    <span className="ui-caps inline-flex items-center gap-1.5">
                      <Clock className="size-3" aria-hidden="true" />
                      {g.readingTimeMinutes} min
                    </span>
                    <span className="ui-caps">{g.sections.length} chapitres</span>
                    <span className="ui-caps">Co-signé {g.authorRole}</span>
                  </div>
                </div>
                <ArrowRight
                  className="text-or-dark size-5 self-center opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-encre/55 mt-12 text-center text-sm italic">
          4 guides supplémentaires en cours de rédaction (silicone médical, rituel bien-être intime,
          sexualité féminine 40 ans, plaisir féminin) — publication étalée Mois 2 à 12.
        </p>
      </Container>
    </>
  );
}
