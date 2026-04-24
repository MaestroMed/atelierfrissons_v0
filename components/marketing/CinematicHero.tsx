'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Wordmark } from '@/components/layout/Wordmark';
import { Fleuron } from '@/components/layout/Fleuron';

interface CinematicHeroProps {
  /** Petit label éditorial en haut ("Une expérience", "Un rituel"...). */
  overline: string;
  /** Titre hero (peut contenir du HTML pour <em>). */
  title: string;
  /** Sous-titre italique discret. */
  subtitle: string;
  /** Durée estimée de lecture / d'expérience. */
  duration?: string;
}

/**
 * Splash hero plein écran — ouvre une expérience éditoriale.
 *
 * Séquence d'ouverture (piloté par un state unique `step` 0→3) :
 *   0. Écran noir vide
 *   1. Wordmark ATELIER FRISSON en or apparaît
 *   2. Titre du rituel Bodoni + subtitle italique
 *   3. Flèche chevron + overline, prêt à scroll
 *
 * Respect prefers-reduced-motion : step 3 d'emblée.
 */
export function CinematicHero({ overline, title, subtitle, duration }: CinematicHeroProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(3);
      return;
    }
    const t1 = window.setTimeout(() => setStep(1), 300);
    const t2 = window.setTimeout(() => setStep(2), 1100);
    const t3 = window.setTimeout(() => setStep(3), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section
      aria-labelledby="cinematic-hero-title"
      className="bg-noir text-ivoire relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient glow qui révèle progressivement */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-[1800ms] ease-out motion-reduce:transition-none',
          '[background:radial-gradient(ellipse_at_center,rgba(201,163,107,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_30%_20%,rgba(139,20,36,0.08)_0%,transparent_50%)]',
          step >= 1 ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Grain de texture noir profond */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-[1800ms]',
          '[background-image:radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:3px_3px]',
          step >= 1 ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-20 text-center md:px-10">
        {/* Wordmark step 1 */}
        <div
          className={cn(
            'flex flex-col items-center gap-3 transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
            step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          )}
        >
          <Wordmark as="p" size="md" color="or" />
          <Fleuron variant="divider" size="sm" color="or" className="opacity-80" />
        </div>

        {/* Overline + title + subtitle — step 2 */}
        <div
          className={cn(
            'flex flex-col items-center gap-6 transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
            step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          )}
        >
          <p className="ui-caps text-or/80 mt-4 text-xs">{overline}</p>
          <h1
            id="cinematic-hero-title"
            className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] font-medium md:text-[clamp(3.5rem,6vw,6.5rem)]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="font-italic-editorial text-ivoire/75 max-w-xl text-lg md:text-xl">
            {subtitle}
          </p>
        </div>

        {/* Scroll cue — step 3 */}
        <div
          className={cn(
            'mt-12 flex flex-col items-center gap-3 transition-opacity duration-1000 ease-out motion-reduce:transition-none',
            step >= 3 ? 'opacity-100' : 'opacity-0',
          )}
        >
          {duration ? <span className="ui-caps text-ivoire/55 text-[10px]">{duration}</span> : null}
          <span
            className={cn(
              'border-or/40 text-or/80 inline-flex size-10 items-center justify-center rounded-full border',
              'motion-safe:animate-[float-arrow_2.2s_ease-in-out_infinite]',
            )}
            aria-hidden="true"
          >
            <ChevronDown className="size-4" strokeWidth={1.5} />
          </span>
          <span className="sr-only">Faites défiler pour commencer</span>
        </div>
      </div>

      {/* Keyframes locales pour le chevron */}
      <style>{`
        @keyframes float-arrow {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
