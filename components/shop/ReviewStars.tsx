import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewStarsProps {
  /** Note sur 5, décimale supportée (ex: 4.7 → 4 étoiles pleines + 70% remplissage). */
  rating: number;
  /** Taille visuelle des étoiles. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Afficher la note numérique à côté. */
  showValue?: boolean;
  /** Couleur des étoiles pleines (défaut or). */
  color?: 'or' | 'noir';
  className?: string;
}

const SIZE_CLASS = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
} as const;

const GAP_CLASS = {
  xs: 'gap-0.5',
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1',
} as const;

/**
 * Affichage accessible d'une note sur 5 — rendu avec 5 étoiles dont la
 * dernière peut être partiellement remplie via un clip CSS (overflow-hidden
 * sur un span avec width calculée).
 *
 * Lecteur d'écran : reçoit un aria-label unique (ex: « 4.7 sur 5 »), les
 * étoiles visuelles sont `aria-hidden`.
 */
export function ReviewStars({
  rating,
  size = 'md',
  showValue = false,
  color = 'or',
  className,
}: ReviewStarsProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const partialPct = (clamped - fullStars) * 100;

  const filledColor = color === 'or' ? 'text-or-dark' : 'text-noir';
  const emptyColor = color === 'or' ? 'text-or/25' : 'text-noir/15';

  const starSize = SIZE_CLASS[size];
  const gap = GAP_CLASS[size];

  return (
    <span
      className={cn('inline-flex items-center', gap, className)}
      aria-label={`${clamped.toFixed(1)} étoile${clamped > 1 ? 's' : ''} sur 5`}
    >
      <span aria-hidden="true" className={cn('inline-flex items-center', gap)}>
        {[0, 1, 2, 3, 4].map((i) => {
          if (i < fullStars) {
            return (
              <Star
                key={i}
                className={cn(starSize, filledColor)}
                strokeWidth={1.5}
                fill="currentColor"
              />
            );
          }
          if (i === fullStars && partialPct > 0) {
            // Étoile partielle — on superpose deux Star, la remplie dans un wrapper overflow-hidden
            return (
              <span key={i} className={cn('relative inline-flex', starSize)}>
                <Star
                  className={cn(starSize, emptyColor, 'absolute inset-0')}
                  strokeWidth={1.5}
                  fill="currentColor"
                />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${partialPct}%` }}
                >
                  <Star
                    className={cn(starSize, filledColor)}
                    strokeWidth={1.5}
                    fill="currentColor"
                  />
                </span>
              </span>
            );
          }
          return (
            <Star
              key={i}
              className={cn(starSize, emptyColor)}
              strokeWidth={1.5}
              fill="currentColor"
            />
          );
        })}
      </span>
      {showValue ? (
        <span className={cn('tabular text-encre/75 ml-1.5 font-medium')}>{clamped.toFixed(1)}</span>
      ) : null}
    </span>
  );
}
