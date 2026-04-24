import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format';

interface PriceTagProps {
  priceCents: number;
  compareAtPriceCents?: number | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'right' | 'center';
  className?: string;
  /** Affiche « TVA incluse » en petit dessous (sur fiche produit). */
  showTaxNotice?: boolean;
}

const SIZE_CLASS = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl md:text-3xl',
} as const;

/**
 * Prix avec discount éventuel — chiffres tabular pour alignement vertical.
 * Mention « TVA incluse » CNIL/L121 quand affiché sur fiche produit.
 */
export function PriceTag({
  priceCents,
  compareAtPriceCents,
  currency = 'EUR',
  size = 'md',
  align = 'left',
  className,
  showTaxNotice = false,
}: PriceTagProps) {
  const hasDiscount = typeof compareAtPriceCents === 'number' && compareAtPriceCents > priceCents;
  const alignClass =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={cn(alignClass, className)}>
      <div className="flex items-baseline gap-3">
        {hasDiscount ? (
          <span className="text-encre/45 tabular font-sans text-sm line-through">
            {formatPriceCents(compareAtPriceCents, currency)}
          </span>
        ) : null}
        <span
          className={cn(
            'tabular text-encre font-sans font-medium',
            SIZE_CLASS[size],
            hasDiscount && 'text-rouge',
          )}
        >
          {formatPriceCents(priceCents, currency)}
        </span>
      </div>
      {showTaxNotice ? (
        <p className="text-encre/55 mt-1 text-xs">TVA française 20 % incluse</p>
      ) : null}
    </div>
  );
}
