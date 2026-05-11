'use client';

import { useCallback, useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MagneticBaseProps {
  /** Force d'attraction maximale en pixels (par défaut 6 px). */
  magnetism?: number;
  /** Distance d'activation autour du bouton (par défaut 80 px). */
  proximity?: number;
  className?: string;
  children: ReactNode;
}

type MagneticAnchorProps = MagneticBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & {
    href: string;
  };

type MagneticButtonProps = MagneticBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className'>;

/**
 * Magnétisme subtil sur CTA premium.
 *
 * À utiliser uniquement sur les **héros et CTA principaux** — pas dans
 * les listes de boutons (effet bavard si trop répété).
 *
 * Comportement :
 *   - Le bouton se déplace vers le curseur quand celui-ci entre dans
 *     la zone `proximity` (80 px par défaut)
 *   - Translation max `magnetism` px (6 par défaut, intentionnellement subtil)
 *   - Easing 240ms pour la sortie de zone (smooth back to origin)
 *   - Désactivé via CSS si `prefers-reduced-motion` ou pointer non-fin
 *
 * Marqué `data-magnetic` pour que `CursorFollower` détecte le hover et
 * grossisse le pointeur en réponse.
 */
export function MagneticLink({
  magnetism = 6,
  proximity = 80,
  className,
  children,
  href,
  ...rest
}: MagneticAnchorProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const onMouseMove = useMagnetic(ref, magnetism, proximity);

  return (
    <Link
      ref={ref}
      href={href}
      data-magnetic="true"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.style.setProperty('--mx', '0px');
          ref.current.style.setProperty('--my', '0px');
        }
      }}
      className={cn('af-magnetic', className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function MagneticButton({
  magnetism = 6,
  proximity = 80,
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const onMouseMove = useMagnetic(ref, magnetism, proximity);

  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      data-magnetic="true"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.style.setProperty('--mx', '0px');
          ref.current.style.setProperty('--my', '0px');
        }
      }}
      className={cn('af-magnetic', className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Hook qui calcule l'attraction et écrit `--mx` / `--my` en CSS custom prop.
 * Tout le styling (transition, will-change, transform) est dans `.af-magnetic`.
 */
function useMagnetic<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  magnetism: number,
  proximity: number,
) {
  // Vérification proximité au mount — si reduced-motion, on no-op
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!ref.current) return;
    if (reduced || !fine) {
      ref.current.style.setProperty('transition', 'none');
    }
  }, [ref]);

  return useCallback(
    (e: React.MouseEvent<T>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > proximity) return;
      const ratio = 1 - distance / proximity;
      const mx = (dx / proximity) * magnetism * ratio;
      const my = (dy / proximity) * magnetism * ratio;
      ref.current.style.setProperty('--mx', `${mx.toFixed(2)}px`);
      ref.current.style.setProperty('--my', `${my.toFixed(2)}px`);
    },
    [ref, magnetism, proximity],
  );
}
