'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { clearRecentlyViewed, readRecentlyViewed } from '@/lib/recently-viewed/storage';
import type { RecentlyViewedItem } from '@/lib/recently-viewed/types';
import { formatPriceCents } from '@/lib/format';

interface RecentlyViewedSectionProps {
  /** Titre éditorial de la section. */
  title?: string;
  /** Sous-titre optionnel (italic small). */
  subtitle?: string;
  /** Slug à exclure (typiquement la page produit en cours). */
  excludeSlug?: string;
  /** Limite d'affichage (défaut 8). */
  limit?: number;
  /** Variante de fond — `light` pour bandeau ivoire clair, `dark` pour fond noir. */
  background?: 'light' | 'default' | 'dark';
  /** Autorise l'affichage du bouton « Effacer l'historique ». */
  clearable?: boolean;
  className?: string;
}

/**
 * Section « Récemment consultés » — lit le localStorage au mount et renvoie
 * un carousel horizontal d'objets déjà visités.
 *
 * S'auto-rafraîchit via `af:recently-viewed-updated` (dispatché par les
 * helpers push/remove/clear) pour rester synchrone même si une autre
 * instance de la section est montée ailleurs.
 *
 * Renvoie `null` s'il n'y a rien à afficher — zéro layout shift, pas de
 * bloc vide.
 */
export function RecentlyViewedSection({
  title = 'Récemment consultés',
  subtitle,
  excludeSlug,
  limit = 8,
  background = 'default',
  clearable = false,
  className,
}: RecentlyViewedSectionProps) {
  const [items, setItems] = useState<readonly RecentlyViewedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setItems(readRecentlyViewed());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    refresh();
    const onStorage = () => refresh();
    window.addEventListener('af:recently-viewed-updated', onStorage as EventListener);
    // Cross-tab sync via `storage` event
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('af:recently-viewed-updated', onStorage as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const visible = useMemo(() => {
    const filtered = excludeSlug ? items.filter((i) => i.slug !== excludeSlug) : items;
    return filtered.slice(0, limit);
  }, [items, excludeSlug, limit]);

  if (!mounted) return null;
  if (visible.length === 0) return null;

  const isDark = background === 'dark';
  const isLight = background === 'light';

  return (
    <section
      aria-labelledby="recently-viewed-heading"
      className={cn(
        'py-14 md:py-20',
        isDark && 'bg-noir text-ivoire',
        isLight && 'bg-ivoire-light text-encre',
        background === 'default' && 'bg-ivoire text-encre',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <header className="mb-8 flex flex-col items-start justify-between gap-3 md:mb-10 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <p className={cn('ui-caps', isDark ? 'text-or' : 'text-or-dark')}>Pour vous</p>
            <h2
              id="recently-viewed-heading"
              className="font-display text-3xl font-medium md:text-4xl"
            >
              {title}
            </h2>
            {subtitle ? <p className="font-italic-editorial opacity-70">{subtitle}</p> : null}
          </div>
          {clearable ? (
            <button
              type="button"
              onClick={() => {
                clearRecentlyViewed();
                // UX : scroll vers le haut pour que l'utilisateur voie que la section a disparu
              }}
              className={cn(
                'ui-caps inline-flex items-center gap-2 text-xs transition-colors',
                isDark ? 'text-ivoire/60 hover:text-or' : 'text-encre/55 hover:text-rouge',
              )}
            >
              Effacer l’historique
            </button>
          ) : null}
        </header>

        <ul
          className={cn(
            '-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:-mx-10 md:gap-6',
            'scroll-px-6 md:scroll-px-10',
            // Masque scrollbar native (Webkit + Firefox)
            '[scrollbar-width:thin] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {visible.map((item) => {
            const isNuit = item.collection === 'nuit';
            return (
              <li
                key={item.slug}
                className="shrink-0 snap-start first:ml-6 last:mr-6 md:first:ml-10 md:last:mr-10"
              >
                <Link
                  href={`/produit/${item.slug}`}
                  className={cn(
                    'group flex w-[240px] flex-col overflow-hidden border border-transparent',
                    'transition-[border-color,box-shadow] duration-300',
                    isNuit
                      ? 'bg-rouge text-ivoire hover:border-or'
                      : 'bg-ivoire text-encre hover:border-or',
                    'hover:shadow-card-hover md:w-[280px]',
                  )}
                >
                  <div
                    className={cn(
                      'relative flex aspect-[4/5] overflow-hidden',
                      isNuit ? 'bg-rouge' : 'bg-ivoire',
                    )}
                  >
                    <ProductSilhouette
                      variant={isNuit ? 'nuit' : 'jour'}
                      className={cn(
                        'm-auto h-[78%] transition-transform duration-700 ease-out',
                        'group-hover:scale-[1.04]',
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-4">
                    <p className={cn('ui-caps text-[10px]', isNuit ? 'text-or' : 'text-or-dark')}>
                      {collectionLabel(item.collection)}
                    </p>
                    <p className="font-display truncate text-base font-medium">{item.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="tabular text-sm">{formatPriceCents(item.priceCents)}</span>
                      <ArrowRight
                        className={cn(
                          'size-3.5 transition-transform duration-300 group-hover:translate-x-1',
                          isNuit ? 'text-or' : 'text-or-dark',
                        )}
                        aria-hidden="true"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function collectionLabel(collection: RecentlyViewedItem['collection']): string {
  switch (collection) {
    case 'jour':
      return 'Collection JOUR';
    case 'nuit':
      return 'Collection NUIT';
    case 'inaugurale':
      return 'Collection inaugurale';
    case 'signature':
      return 'Pièce signature';
    default:
      return 'Atelier Frisson';
  }
}
