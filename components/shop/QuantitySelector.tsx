'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  ariaLabel = 'Quantité',
}: QuantitySelectorProps) {
  const isSm = size === 'sm';
  const buttonClass = cn(
    'flex items-center justify-center text-encre transition-colors',
    'hover:text-or focus-visible:text-or disabled:cursor-not-allowed disabled:opacity-30',
    isSm ? 'size-8' : 'size-10',
  );

  return (
    <div
      className={cn(
        'border-encre/20 inline-flex items-center border',
        'hover:border-or focus-within:border-or transition-colors',
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className={buttonClass}
        aria-label="Diminuer la quantité"
      >
        <Minus className={isSm ? 'size-3' : 'size-4'} aria-hidden="true" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        min={min}
        max={max}
        disabled={disabled}
        className={cn(
          'tabular border-0 bg-transparent text-center outline-none focus:outline-none',
          isSm ? 'h-8 w-10 text-sm' : 'h-10 w-12 text-base',
        )}
        aria-label={ariaLabel}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className={buttonClass}
        aria-label="Augmenter la quantité"
      >
        <Plus className={isSm ? 'size-3' : 'size-4'} aria-hidden="true" />
      </button>
    </div>
  );
}
