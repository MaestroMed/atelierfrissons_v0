import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';

export interface RitualStep {
  /** Numéro romain (« I », « II », « III »). */
  numeral: string;
  /** Mot principal de l'étape (ex: « L'eau »). */
  word: string;
  /** Verbe d'action court (ex: « tiède, jamais chaude »). */
  detail: string;
  /** Paragraphe court (peut contenir HTML). */
  body: string;
  /** Durée estimée. */
  duration?: string;
}

interface CollectionRitualStepsProps {
  /** Tonalité visuelle de la section. */
  variant: 'jour' | 'nuit';
  /** Caption (ex: « Le rituel JOUR »). */
  caption: string;
  /** Titre éditorial (ex: « Trois gestes, trois respirations »). */
  title: string;
  /** Sous-titre italique optionnel. */
  subtitle?: string;
  /** Les 3 étapes du rituel. */
  steps: readonly RitualStep[];
  className?: string;
}

/**
 * Section éditoriale « Le rituel » — 3 étapes en grid avec numérotation
 * romaine + mot principal Bodoni + détail italique + paragraphe.
 *
 * Visuel : fond ivoire pour JOUR, noir pour NUIT, séparateurs gap-px
 * en or. Server Component, aucune animation JS.
 */
export function CollectionRitualSteps({
  variant,
  caption,
  title,
  subtitle,
  steps,
  className,
}: CollectionRitualStepsProps) {
  const isJour = variant === 'jour';
  return (
    <section
      aria-labelledby={`ritual-${variant}-heading`}
      className={cn(
        'py-20 md:py-28',
        isJour ? 'bg-ivoire-light text-encre' : 'bg-noir text-ivoire',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <header className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16">
          <p className={cn('ui-caps', isJour ? 'text-or-dark' : 'text-or')}>{caption}</p>
          <h2
            id={`ritual-${variant}-heading`}
            className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
          <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
          {subtitle ? (
            <p
              className={cn(
                'font-italic-editorial text-lg md:text-xl',
                isJour ? 'text-or-dark' : 'text-or-light',
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </header>

        <ol
          className={cn('grid grid-cols-1 gap-px md:grid-cols-3', isJour ? 'bg-or/15' : 'bg-or/20')}
        >
          {steps.map((step) => (
            <li
              key={step.numeral}
              className={cn(
                'flex flex-col gap-5 p-8 md:p-10',
                isJour ? 'bg-ivoire' : 'bg-noir-velours',
              )}
            >
              <span
                className={cn(
                  'font-display tabular text-4xl font-medium md:text-5xl',
                  isJour ? 'text-or-dark' : 'text-or',
                )}
                aria-hidden="true"
              >
                {step.numeral}
              </span>
              <h3 className="font-display text-2xl leading-tight font-medium md:text-3xl">
                {step.word}
              </h3>
              <p
                className={cn(
                  'font-italic-editorial text-base',
                  isJour ? 'text-or-dark' : 'text-or-light',
                )}
              >
                {step.detail}
              </p>
              <p
                className={cn(
                  'text-sm leading-relaxed md:text-base',
                  isJour ? 'text-encre/80' : 'text-ivoire/80',
                )}
                dangerouslySetInnerHTML={{ __html: step.body }}
              />
              {step.duration ? (
                <p
                  className={cn(
                    'ui-caps mt-auto text-[10px]',
                    isJour ? 'text-encre/45' : 'text-ivoire/45',
                  )}
                >
                  ≈ {step.duration}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
