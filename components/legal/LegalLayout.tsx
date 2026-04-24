import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { formatDate } from '@/lib/format';

interface LegalLayoutProps {
  title: string;
  intro?: string;
  lastUpdated: Date;
  children: React.ReactNode;
}

export function LegalLayout({ title, intro, lastUpdated, children }: LegalLayoutProps) {
  return (
    <Container className="py-12 md:py-16">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: title, href: '#' },
        ]}
        className="mb-10"
      />
      <header className="mx-auto max-w-3xl text-center">
        <p className="ui-caps text-or-dark">Mention légale</p>
        <h1 className="font-display text-noir mt-3 text-4xl font-medium md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-4 opacity-80" />
        {intro ? (
          <p className="font-italic-editorial text-encre/75 mt-6 text-base md:text-lg">{intro}</p>
        ) : null}
        <p className="text-encre/55 mt-4 text-xs">
          Dernière mise à jour : {formatDate(lastUpdated)}
        </p>
      </header>

      <article className="prose-legal text-encre/85 mx-auto mt-14 max-w-3xl md:mt-20">
        {children}
      </article>
    </Container>
  );
}
