import { cn } from '@/lib/utils';
import { formatStockBadge } from '@/lib/format';

interface StockBadgeProps {
  stockStatus: string;
  stockQuantity: number;
  className?: string;
}

const TONE_CLASS = {
  success: 'border-af-success/40 text-af-success bg-af-success/8',
  warning: 'border-af-warning/40 text-af-warning bg-af-warning/8',
  error: 'border-af-error/40 text-af-error bg-af-error/8',
  info: 'border-af-info/40 text-af-info bg-af-info/8',
} as const;

export function StockBadge({ stockStatus, stockQuantity, className }: StockBadgeProps) {
  const { label, tone } = formatStockBadge(stockStatus, stockQuantity);
  return (
    <span
      className={cn(
        'ui-caps inline-flex items-center gap-2 border px-2.5 py-1 text-[10px]',
        TONE_CLASS[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
