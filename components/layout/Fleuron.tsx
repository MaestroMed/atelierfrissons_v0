import { cn } from '@/lib/utils';

type FleuronVariant = 'divider' | 'mark' | 'crown';
type FleuronSize = 'sm' | 'md' | 'lg' | 'xl';

interface FleuronProps {
  variant?: FleuronVariant;
  size?: FleuronSize;
  color?: 'or' | 'ivoire' | 'noir' | 'rouge' | 'current';
  className?: string;
  /** Si true, masqué aux AT (purement ornemental). */
  decorative?: boolean;
  /** Animation « filet qui se déploie » à l'entrée. */
  animate?: boolean;
}

const WIDTH_BY_SIZE: Record<FleuronSize, string> = {
  sm: 'w-20',
  md: 'w-32',
  lg: 'w-48',
  xl: 'w-72',
};

const COLOR_CLASS: Record<NonNullable<FleuronProps['color']>, string> = {
  or: 'text-or',
  ivoire: 'text-ivoire',
  noir: 'text-noir',
  rouge: 'text-rouge',
  current: 'text-current',
};

/**
 * Ornement signature Atelier Frisson — un motif Didone inspiré du moodboard
 * (filets dorés ponctués d'un œil/amande central symbolisant l'éveil).
 *
 * 3 variants :
 *  - `divider` : filet + motif central + filet (séparateur horizontal)
 *  - `mark`    : motif central isolé (sans filets)
 *  - `crown`   : filet au-dessus + motif, sans filet bas (sous wordmark)
 *
 * Utilisé sous le wordmark du header/footer, en intro de sections éditoriales,
 * et en ponctuation sur les guides piliers.
 */
export function Fleuron({
  variant = 'divider',
  size = 'md',
  color = 'or',
  className,
  decorative = true,
  animate = false,
}: FleuronProps) {
  const commonProps = {
    ...(decorative ? { 'aria-hidden': true, role: 'presentation' } : {}),
    className: cn(
      WIDTH_BY_SIZE[size],
      COLOR_CLASS[color],
      animate && 'origin-center [animation:var(--animate-fleuron)]',
      className,
    ),
  } as const;

  if (variant === 'mark') {
    return (
      <svg viewBox="0 0 32 16" fill="none" {...commonProps}>
        <MotifCentral cx={16} cy={8} />
      </svg>
    );
  }

  if (variant === 'crown') {
    return (
      <svg viewBox="0 0 200 16" fill="none" {...commonProps}>
        <line x1="0" y1="8" x2="78" y2="8" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="82" cy="8" r="0.9" fill="currentColor" />
        <MotifCentral cx={100} cy={8} />
        <circle cx="118" cy="8" r="0.9" fill="currentColor" />
        <line x1="122" y1="8" x2="200" y2="8" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    );
  }

  // divider (défaut)
  return (
    <svg viewBox="0 0 240 16" fill="none" {...commonProps}>
      <line x1="0" y1="8" x2="95" y2="8" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="99" cy="8" r="1" fill="currentColor" />
      <line x1="103" y1="8" x2="112" y2="8" stroke="currentColor" strokeWidth="0.6" />
      <MotifCentral cx={120} cy={8} />
      <line x1="128" y1="8" x2="137" y2="8" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="141" cy="8" r="1" fill="currentColor" />
      <line x1="145" y1="8" x2="240" y2="8" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

/** Motif central : amande verticale + point central (œil/éveil stylisé). */
function MotifCentral({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <path
        d="M-5 0 Q-2.5 -3.5 0 -3.5 Q2.5 -3.5 5 0 Q2.5 3.5 0 3.5 Q-2.5 3.5 -5 0 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <circle cx="0" cy="0" r="0.9" fill="currentColor" />
    </g>
  );
}
