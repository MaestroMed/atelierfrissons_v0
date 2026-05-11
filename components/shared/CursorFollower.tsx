'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cursor follower — petit fleuron doré qui suit la souris dans la zone
 * marquée `data-cursor-follower-zone="true"` (typiquement le hero homepage
 * ou les pages collection avec hero immersif).
 *
 * Comportement :
 *   - S'active uniquement sur device pointer fin (souris/trackpad)
 *   - Désactivé si `prefers-reduced-motion: reduce`
 *   - Désactivé sur touch (aucun pointer)
 *   - Ne fonctionne que dans la zone marquée — sort = follower disparait
 *   - Sur hover d'un CTA `[data-magnetic]`, le follower s'agrandit (44px)
 *
 * Performance : un seul rAF, transform3d uniquement, will-change. Rien d'autre.
 *
 * À mounter UNE FOIS dans le layout root (ou dans le hero qui en a besoin).
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<'idle' | 'hover-cta'>('idle');
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Pointer fin requis (mouse/trackpad), pas touch
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!pointerFine || reducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      // Le suivi est limité aux zones explicitement marquées
      const target = e.target as HTMLElement | null;
      const zone = target?.closest('[data-cursor-follower-zone="true"]');
      if (!zone) {
        if (dotRef.current) dotRef.current.style.opacity = '0';
        return;
      }
      if (dotRef.current) dotRef.current.style.opacity = '1';

      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      // Détecte hover CTA magnetic
      const onCta = !!target?.closest('[data-magnetic]');
      const newState = onCta ? 'hover-cta' : 'idle';
      if (newState !== stateRef.current && dotRef.current) {
        stateRef.current = newState;
        dotRef.current.dataset['state'] = newState;
      }
    };

    const tick = () => {
      // Lerp pour smoothness (suit avec léger décalage)
      const lerpFactor = 0.18;
      positionRef.current.x +=
        (targetRef.current.x - positionRef.current.x) * lerpFactor;
      positionRef.current.y +=
        (targetRef.current.y - positionRef.current.y) * lerpFactor;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="af-cursor-follower"
      data-state="idle"
      style={{ opacity: 0 }}
    />
  );
}
