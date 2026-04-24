import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: {
    value: number;
    period: string;
  };
  hint?: string;
  /** Sous-titre supplémentaire (ex: "5 nouvelles aujourd'hui"). */
  subline?: string;
  className?: string;
}

export function StatCard({ label, value, delta, hint, subline, className }: StatCardProps) {
  const trend = delta ? (delta.value > 0 ? 'up' : delta.value < 0 ? 'down' : 'flat') : null;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        'border-encre/10 bg-ivoire hover:border-or flex flex-col gap-3 border p-6 transition-colors',
        className,
      )}
    >
      <p className="ui-caps text-encre/55">{label}</p>
      <p className="font-display tabular text-noir text-3xl font-medium md:text-4xl">{value}</p>
      {subline ? <p className="text-encre/65 text-xs">{subline}</p> : null}
      {delta ? (
        <p
          className={cn(
            'inline-flex items-center gap-1.5 text-xs',
            trend === 'up' && 'text-af-success',
            trend === 'down' && 'text-rouge-light',
            trend === 'flat' && 'text-encre/55',
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          <span className="tabular">
            {delta.value > 0 ? '+' : ''}
            {delta.value} %
          </span>
          <span className="text-encre/55">{delta.period}</span>
        </p>
      ) : null}
      {hint ? <p className="text-encre/50 mt-2 text-[11px] italic">{hint}</p> : null}
    </div>
  );
}
