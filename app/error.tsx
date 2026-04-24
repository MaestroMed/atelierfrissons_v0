'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[error.tsx]', error);
    // TODO Sprint 7+ : capture Sentry — `Sentry.captureException(error)`
  }, [error]);

  return (
    <Container className="flex min-h-[calc(100dvh-15rem)] items-center py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <p className="ui-caps text-rouge-light">Une erreur est survenue</p>
        <Wordmark as="p" size="md" color="or" />
        <Fleuron variant="divider" size="md" color="or" className="opacity-80" />

        <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
          Quelque chose s’est{' '}
          <span className="font-italic-editorial text-rouge-light">interrompu</span>
        </h1>

        <p className="font-italic-editorial text-encre/75 max-w-lg text-lg md:text-xl">
          Notre équipe a été notifiée — vous pouvez réessayer ou rentrer à l’accueil. Nos excuses
          pour cette parenthèse.
        </p>

        {error.digest ? (
          <p className="ui-caps tabular text-encre/55 text-xs">
            Référence technique : {error.digest}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Réessayer
          </button>
          <Link
            href="/"
            className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-3 underline underline-offset-4"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </Container>
  );
}
