'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  collections: readonly FilterOption[];
  categories: readonly FilterOption[];
  className?: string;
}

/**
 * Filtres boutique — collection + catégorie via URL searchParams (pas
 * de state local : le rendu serveur reste source de vérité).
 *
 * Cliquer un filtre push une nouvelle URL `?collection=jour&category=plaisir-solo`.
 * `useTransition` empêche le blocage UI pendant le re-render serveur.
 */
export function ProductFilters({ collections, categories, className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCollection = params.get('collection');
  const activeCategory = params.get('category');

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== next.get(key)) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page'); // reset pagination
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  };

  return (
    <aside
      aria-label="Filtres produits"
      className={cn('flex flex-col gap-8', isPending && 'opacity-70 transition-opacity', className)}
    >
      <FilterGroup
        title="Collection"
        options={collections}
        active={activeCollection}
        onChange={(v) => setParam('collection', v)}
      />
      <FilterGroup
        title="Catégorie"
        options={categories}
        active={activeCategory}
        onChange={(v) => setParam('category', v)}
      />
      {(activeCollection || activeCategory) && (
        <button
          type="button"
          onClick={() => {
            startTransition(() => router.push(pathname, { scroll: false }));
          }}
          className="ui-caps text-or-dark hover:text-or self-start underline underline-offset-4"
        >
          Réinitialiser les filtres
        </button>
      )}
    </aside>
  );
}

function FilterGroup({
  title,
  options,
  active,
  onChange,
}: {
  title: string;
  options: readonly FilterOption[];
  active: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="ui-caps text-or-dark">{title}</legend>
      <ul className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isActive = active === opt.value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onChange(isActive ? null : opt.value)}
                className={cn(
                  'group/filter flex w-full items-center justify-between gap-3 py-1.5 text-left transition-colors',
                  isActive ? 'text-encre' : 'text-encre/70 hover:text-encre',
                )}
                aria-pressed={isActive}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-3 border transition-all',
                      isActive
                        ? 'border-or bg-or'
                        : 'border-encre/30 group-hover/filter:border-or/60',
                    )}
                  />
                  <span className="font-sans text-sm">{opt.label}</span>
                </span>
                {typeof opt.count === 'number' ? (
                  <span className="tabular text-encre/45 text-xs">{opt.count}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
