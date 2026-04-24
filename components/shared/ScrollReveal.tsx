'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Délai d'animation (en ms) à partir du moment où l'élément entre dans le viewport. */
  delay?: number;
  /** Distance verticale de départ (en px). */
  offsetY?: number;
  /** Trigger en % du viewport — défaut 0.15 (15% visible). */
  threshold?: number;
  /** Ne déclenche qu'une fois (défaut true). */
  once?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer';
}

/**
 * Wrapper qui révèle son contenu avec un fade-up doux quand il entre dans
 * le viewport. Intersection Observer natif, aucun lib externe.
 *
 * Respect prefers-reduced-motion : révélation instantanée sans animation.
 *
 * Usage :
 *   <ScrollReveal delay={120}>
 *     <h2>...</h2>
 *   </ScrollReveal>
 */
export function ScrollReveal({
  children,
  delay = 0,
  offsetY = 20,
  threshold = 0.15,
  once = true,
  className,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion : révèle immédiatement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      style={{
        transitionDelay: `${delay}ms`,
        transform: revealed ? 'translateY(0)' : `translateY(${offsetY}px)`,
        opacity: revealed ? 1 : 0,
      }}
      className={cn(
        'transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
