'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, GitCompareArrows, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearCompare, readCompareSlugs, removeFromCompare } from '@/lib/compare/storage';
import { COMPARE_MAX_ITEMS } from '@/lib/compare/types';

/**
 * Barre flottante en bas d'écran listant les produits sélectionnés
 * pour comparaison. Apparaît dès qu'il y a 1+ items, s'efface sur la
 * page `/comparer` elle-même (inutile d'en remettre une couche).
 *
 * Chips avec X pour retirer individuellement, bouton « Comparer (N) »
 * qui mène à `/comparer`.
 *
 * Persiste en bas même au scroll, masquée sur `/comparer` pour éviter
 * la redondance.
 */
export function CompareBar() {
  const pathname = usePathname();
  const [slugs, setSlugs] = useState<readonly string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const refresh = () => setSlugs(readCompareSlugs());
    refresh();
    window.addEventListener('af:compare-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('af:compare-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Ne s'affiche pas sur /comparer, sur le checkout, ni si vide
  const hideOnPath =
    pathname.startsWith('/comparer') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth');

  if (!mounted || slugs.length === 0 || hideOnPath) return null;

  const compareHref = `/comparer?ids=${encodeURIComponent(slugs.join(','))}`;

  return (
    <div
      role="region"
      aria-label="Objets sélectionnés pour comparaison"
      className={cn(
        'fixed right-4 bottom-6 left-4 z-40',
        'mx-auto flex max-w-2xl items-center gap-3',
        'bg-noir text-ivoire border-or/30 border px-4 py-3 shadow-2xl',
        'supports-backdrop-filter:bg-noir/92 supports-backdrop-filter:backdrop-blur-md',
        'animate-in slide-in-from-bottom-4 fade-in duration-300 motion-reduce:animate-none',
        'md:bottom-8',
      )}
    >
      <GitCompareArrows className="text-or size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
      <div className="flex-1 overflow-x-auto">
        <ul className="flex items-center gap-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:hidden">
          {slugs.map((slug) => (
            <li key={slug} className="shrink-0">
              <span
                className={cn(
                  'ui-caps border-ivoire/30 text-ivoire/85 inline-flex items-center gap-1.5 border px-2.5 py-1',
                  'text-[10px]',
                )}
              >
                {formatSlugLabel(slug)}
                <button
                  type="button"
                  onClick={() => removeFromCompare(slug)}
                  aria-label={`Retirer ${formatSlugLabel(slug)} de la comparaison`}
                  className="text-ivoire/65 hover:text-rouge-light -mr-1 ml-0.5 inline-flex size-4 items-center justify-center transition-colors"
                >
                  <X className="size-3" aria-hidden="true" strokeWidth={1.5} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {slugs.length >= 2 ? (
        <Link
          href={compareHref}
          className={cn(
            'ui-caps bg-or text-noir hover:bg-or-light shrink-0 border-0 transition-colors',
            'inline-flex items-center gap-2 px-4 py-2 text-[10px]',
          )}
        >
          Comparer ({slugs.length})
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : (
        <span className="ui-caps text-ivoire/55 shrink-0 text-[10px]">
          Ajoutez un 2<sup>e</sup> objet ({slugs.length} / {COMPARE_MAX_ITEMS})
        </span>
      )}

      <button
        type="button"
        onClick={clearCompare}
        aria-label="Vider la comparaison"
        className="text-ivoire/50 hover:text-rouge-light ml-1 inline-flex size-7 shrink-0 items-center justify-center transition-colors"
      >
        <X className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/** Décapitalise un slug `premier-frisson` → `Premier frisson` (pour le chip). */
function formatSlugLabel(slug: string): string {
  const words = slug.split('-');
  if (words.length === 0) return slug;
  const first = words[0]!;
  const rest = words.slice(1).join(' ');
  return `${first.charAt(0).toUpperCase()}${first.slice(1)}${rest ? ' ' + rest : ''}`;
}
