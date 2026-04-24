import { cn } from '@/lib/utils';

interface SparklineProps {
  /** Série de valeurs (min 2 points). */
  data: readonly number[];
  /** Largeur du SVG. */
  width?: number;
  /** Hauteur du SVG. */
  height?: number;
  /** Couleur du trait (classe Tailwind `text-…`). */
  color?: 'or' | 'noir' | 'rouge' | 'success';
  /** Affiche un remplissage dégradé sous la courbe. */
  filled?: boolean;
  /** Épaisseur du trait. */
  strokeWidth?: number;
  className?: string;
  /** Label accessible pour screen readers (ex: « Tendance CA 7 derniers jours, hausse »). */
  ariaLabel: string;
}

const COLOR_CLASS = {
  or: 'text-or-dark',
  noir: 'text-noir',
  rouge: 'text-rouge',
  success: 'text-af-success',
} as const;

/**
 * Sparkline SVG pure — pas de lib charting. Affiche une micro-tendance
 * dans un KPI card ou un header de widget admin.
 *
 * Normalise les valeurs dans la bande [strokeWidth/2, height - strokeWidth/2]
 * pour que le trait ne soit pas coupé en haut ou en bas. Lisse avec une
 * courbe de Catmull-Rom approximée en Bézier cubique pour un rendu plus
 * doux que le polyline.
 */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = 'or',
  filled = true,
  strokeWidth = 1.5,
  className,
  ariaLabel,
}: SparklineProps) {
  if (data.length < 2) return null;

  const padding = strokeWidth / 2;
  const innerHeight = height - padding * 2;
  const innerWidth = width - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((v - min) / range) * innerHeight;
    return { x, y };
  });

  // Path smooth (Catmull-Rom → cubic Bézier)
  let d = `M ${points[0]!.x.toFixed(2)},${points[0]!.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  const filledPath = `${d} L ${points[points.length - 1]!.x.toFixed(2)},${height} L ${points[0]!.x.toFixed(2)},${height} Z`;
  const gradientId = `sparkline-grad-${data
    .join('-')
    .slice(0, 12)
    .replace(/[^a-z0-9]/gi, '')}`;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn(COLOR_CLASS[color], 'inline-block', className)}
    >
      {filled ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={filledPath} fill={`url(#${gradientId})`} stroke="none" />
        </>
      ) : null}
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot sur le dernier point */}
      <circle
        cx={points[points.length - 1]!.x}
        cy={points[points.length - 1]!.y}
        r={strokeWidth * 1.3}
        fill="currentColor"
      />
    </svg>
  );
}
