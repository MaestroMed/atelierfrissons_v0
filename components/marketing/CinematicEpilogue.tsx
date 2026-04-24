'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';

interface CinematicEpilogueProps {
  overline: string;
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/**
 * Épilogue plein écran — clôture éditoriale d'une expérience cinématique.
 * Noir → glow or au reveal, wordmark + fleuron + CTAs.
 */
export function CinematicEpilogue({
  overline,
  headline,
  body,
  primaryCta,
  secondaryCta,
}: CinematicEpilogueProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-noir text-ivoire relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] ease-out motion-reduce:transition-none',
          '[background:radial-gradient(ellipse_at_center,rgba(201,163,107,0.22)_0%,transparent_55%)]',
          revealed ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center md:px-10',
          'transition-[opacity,transform] duration-1200 ease-out motion-reduce:transition-none',
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        )}
      >
        <Wordmark as="p" size="md" color="or" />
        <Fleuron variant="crown" size="md" color="or" className="opacity-90" />

        <p className="ui-caps text-or/75 text-xs">{overline}</p>

        <h2
          className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] font-medium md:text-[clamp(3rem,6vw,6rem)]"
          dangerouslySetInnerHTML={{ __html: headline }}
        />

        <p
          className="font-italic-editorial text-ivoire/80 max-w-2xl text-lg md:text-xl"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href={primaryCta.href}
            className="ui-caps bg-or text-noir hover:bg-or-light inline-flex items-center gap-3 px-8 py-4 transition-colors"
          >
            {primaryCta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="ui-caps text-ivoire/75 hover:text-or inline-flex items-center gap-3 underline underline-offset-4 transition-colors"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>

        <Fleuron variant="divider" size="md" color="or" className="mt-8 opacity-50" />
        <p className="font-italic-editorial text-ivoire/50 text-xs">
          Atelier Frisson — Paris, maison du rituel intime
        </p>
      </div>
    </section>
  );
}
