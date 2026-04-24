import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';

export const metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[calc(100dvh-15rem)] items-center py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <p className="ui-caps text-or-dark">Erreur 404</p>
        <Wordmark as="p" size="md" color="or" />
        <Fleuron variant="divider" size="md" color="or" className="opacity-80" />

        <h1 className="font-display text-noir text-5xl font-medium md:text-6xl lg:text-7xl">
          Cette page <span className="font-italic-editorial text-or-dark">s’est perdue</span>
        </h1>

        <p className="font-italic-editorial text-encre/75 max-w-lg text-lg md:text-xl">
          La maison ne reconnaît pas cette adresse. Elle a peut-être été déplacée, ou n’existe plus
          — un rituel inconnu de notre catalogue.
        </p>

        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à l’accueil
          </Link>
          <Link
            href="/boutique"
            className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-3 underline underline-offset-4"
          >
            <Search className="size-4" aria-hidden="true" />
            Voir la collection
          </Link>
        </div>

        <Fleuron variant="divider" size="md" color="or" className="mt-8 opacity-50" />

        <p className="text-encre/55 text-xs">
          Si vous pensez qu’il s’agit d’une erreur, écrivez-nous à{' '}
          <a
            href="mailto:contact@atelierfrisson.fr"
            className="hover:text-or-dark underline underline-offset-2"
          >
            contact@atelierfrisson.fr
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
