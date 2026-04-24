'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Sélection signature' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name-asc', label: 'Nom A → Z' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

interface ProductSortProps {
  className?: string;
}

export function ProductSort({ className }: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const active = (params.get('sort') as SortKey | null) ?? 'featured';

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const next = new URLSearchParams(params.toString());
    if (value === 'featured') {
      next.delete('sort');
    } else {
      next.set('sort', value);
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  return (
    <label
      className={cn(
        'text-encre inline-flex items-center gap-3 text-sm',
        isPending && 'opacity-70',
        className,
      )}
    >
      <span className="ui-caps text-encre/65">Trier par</span>
      <select
        value={active}
        onChange={onChange}
        className="border-encre/20 text-encre hover:border-or focus:border-or border bg-transparent px-3 py-2 font-sans text-sm transition-colors focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function applyProductSort<
  T extends { isFeatured: boolean; publishedAt: Date | null; priceCents: number; name: string },
>(products: readonly T[], sort: SortKey | null = 'featured'): T[] {
  const arr = [...products];
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
    case 'price-asc':
      return arr.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-desc':
      return arr.sort((a, b) => b.priceCents - a.priceCents);
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    case 'featured':
    default:
      return arr.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}
