'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { SORT_OPTIONS, type SortKey } from '@/lib/shop/sort';

// NOTE : `applyProductSort` + `SortKey` sont importés depuis `@/lib/shop/sort`
// (module neutre). Ce fichier est 'use client' — exporter la logique pure
// d'ici ferait crasher tout Server Component qui l'importerait
// (« Attempted to call applyProductSort() from the server »).

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
