'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  /** Selector CSS du conteneur dont mesurer la progression (article principal). */
  targetSelector?: string;
  className?: string;
}

/**
 * Barre de progression scroll — filet or fin tout en haut du viewport,
 * largeur proportionnelle à la position de lecture dans l'article.
 *
 * Sobriété éditoriale : 2px de haut max, opacity 0.7, couleur or.
 * Respecte prefers-reduced-motion (saut instantané sans transition).
 */
export function ScrollProgress({
  targetSelector = 'article.prose-article',
  className,
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  const computeProgress = useCallback(() => {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrolled = -rect.top;
    const total = rect.height - window.innerHeight;
    if (total <= 0) {
      setProgress(0);
      return;
    }
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    setProgress(pct);
  }, [targetSelector]);

  useEffect(() => {
    // Lecture initiale + listeners (scroll/resize) — setState legitime car
    // reflete un etat externe (position scroll) au mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeProgress();
    window.addEventListener('scroll', computeProgress, { passive: true });
    window.addEventListener('resize', computeProgress);
    return () => {
      window.removeEventListener('scroll', computeProgress);
      window.removeEventListener('resize', computeProgress);
    };
  }, [computeProgress]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed top-0 right-0 left-0 z-[60] h-0.5 bg-transparent',
        className,
      )}
    >
      <div
        className="bg-or h-full transition-[width] duration-100 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%`, opacity: progress > 1 ? 0.8 : 0 }}
      />
    </div>
  );
}
