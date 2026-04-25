import { cn } from '@/lib/utils';

export interface PressQuote {
  /** Citation courte (max ~25 mots). */
  quote: string;
  /** Nom du média (ex: « ELLE Beauté », « Madame Figaro »). */
  source: string;
  /** Sous-titre / contexte (ex: « Sélection automne », optionnel). */
  context?: string;
  /** URL externe optionnelle (article complet). */
  href?: string;
}

interface PressQuotesProps {
  quotes: readonly PressQuote[];
  className?: string;
}

/**
 * Citations presse — Server Component, layout 3 colonnes desktop.
 *
 * Pas de logos média (souvent restrictifs sur l'usage). On mise sur la
 * typographie : nom du média en small-caps or, citation en blockquote
 * Bodoni italique, séparateur fleuron entre.
 */
export function PressQuotes({ quotes, className }: PressQuotesProps) {
  return (
    <ul
      className={cn('bg-encre/8 grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3', className)}
    >
      {quotes.map((q, i) => {
        const inner = (
          <article className="bg-ivoire flex h-full flex-col gap-4 p-7 md:p-9">
            <p className="ui-caps text-or-dark text-[10px]">{q.source}</p>
            {q.context ? <p className="text-encre/55 text-[11px]">{q.context}</p> : null}
            <blockquote className="font-italic-editorial text-encre/85 mt-auto text-base leading-relaxed md:text-lg">
              <span aria-hidden="true" className="text-or mr-1">
                «
              </span>
              {q.quote}
              <span aria-hidden="true" className="text-or ml-1">
                »
              </span>
            </blockquote>
          </article>
        );
        return (
          <li key={`${q.source}-${i}`}>
            {q.href ? (
              <a
                href={q.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-ivoire-light block h-full transition-colors"
              >
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
