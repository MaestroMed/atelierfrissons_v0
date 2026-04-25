'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineMilestone {
  /** Année + mois (ex: « Avril 2026 »). */
  date: string;
  /** Titre éditorial du jalon. */
  title: string;
  /** Paragraphe court (peut contenir du HTML). */
  body: string;
  /** Icône caractère Unicode optionnelle (ex: « ✦ », « ✧ »). */
  glyph?: string;
}

interface TimelineProps {
  milestones: readonly TimelineMilestone[];
  className?: string;
}

/**
 * Timeline éditoriale verticale — pour la page /a-propos.
 *
 * Visuel :
 *   - Filet vertical or sur la gauche
 *   - Pastille or par milestone (devient pleine quand l'item entre dans le viewport)
 *   - Date small-caps + titre Bodoni + body italique
 *
 * Animation : chaque milestone se révèle avec fade + translate-x au scroll
 * via IntersectionObserver. Respect prefers-reduced-motion.
 */
export function Timeline({ milestones, className }: TimelineProps) {
  return (
    <ol className={cn('relative pl-10 md:pl-14', className)}>
      {/* Filet vertical or */}
      <span
        aria-hidden="true"
        className="bg-or/30 absolute top-2 bottom-2 left-2.5 w-px md:left-4"
      />
      {milestones.map((m, i) => (
        <TimelineItem key={`${m.date}-${i}`} milestone={m} index={i} />
      ))}
    </ol>
  );
}

function TimelineItem({ milestone, index }: { milestone: TimelineMilestone; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
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
        if (entry?.isIntersecting) setRevealed(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={cn(
        'relative pb-12 transition-[opacity,transform] duration-700 ease-out last:pb-0 motion-reduce:transition-none',
        revealed ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0',
      )}
      style={{ transitionDelay: revealed ? `${Math.min(index * 60, 240)}ms` : '0ms' }}
    >
      {/* Pastille — vide → pleine au reveal */}
      <span
        aria-hidden="true"
        className={cn(
          'border-or bg-ivoire absolute top-1.5 left-0 inline-flex size-5 items-center justify-center rounded-full border transition-colors duration-700',
          revealed ? 'bg-or' : 'bg-ivoire',
          'md:left-2',
        )}
      >
        {milestone.glyph ? (
          <span
            className={cn(
              'text-[10px] transition-colors duration-700',
              revealed ? 'text-noir' : 'text-or',
            )}
          >
            {milestone.glyph}
          </span>
        ) : null}
      </span>

      <p className="ui-caps text-or-dark text-[10px]">{milestone.date}</p>
      <h3 className="font-display text-noir mt-1.5 text-xl font-medium md:text-2xl">
        {milestone.title}
      </h3>
      <p
        className="text-encre/80 mt-3 text-sm leading-relaxed md:text-base"
        dangerouslySetInnerHTML={{ __html: milestone.body }}
      />
    </li>
  );
}
