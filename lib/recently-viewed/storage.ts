/**
 * Helpers localStorage typés pour Recently Viewed.
 *
 * Stockage 100% client — aucun cookie, aucun call serveur. Les items sont
 * sérialisés en JSON. Lecture safe (catch + fallback []) pour éviter tout
 * crash si le JSON devient corrompu (ex: quota exceeded partial write).
 *
 * Ce module ne doit être importé que depuis des Client Components (hook ou
 * tracker). Pas besoin de 'use client' ici — c'est juste des fonctions
 * utilitaires.
 */

import {
  RECENTLY_VIEWED_MAX_ITEMS,
  RECENTLY_VIEWED_STORAGE_KEY,
  RECENTLY_VIEWED_TTL_MS,
  type RecentlyViewedItem,
} from './types';

/** Renvoie `[]` si SSR, storage indispo, ou parse failed. */
export function readRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed
      .filter((item): item is RecentlyViewedItem => {
        if (!item || typeof item !== 'object') return false;
        const i = item as Record<string, unknown>;
        return (
          typeof i.slug === 'string' &&
          typeof i.name === 'string' &&
          typeof i.priceCents === 'number' &&
          typeof i.viewedAt === 'number' &&
          now - i.viewedAt < RECENTLY_VIEWED_TTL_MS
        );
      })
      .slice(0, RECENTLY_VIEWED_MAX_ITEMS);
  } catch (err) {
    console.warn('[recently-viewed] read failed:', err);
    return [];
  }
}

/** Écrit (remplace). Silencieux en cas d'erreur quota. */
function writeRecentlyViewed(items: readonly RecentlyViewedItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      RECENTLY_VIEWED_STORAGE_KEY,
      JSON.stringify(items.slice(0, RECENTLY_VIEWED_MAX_ITEMS)),
    );
  } catch (err) {
    console.warn('[recently-viewed] write failed:', err);
  }
}

/**
 * Pousse un item en tête. Si le slug existe déjà, on le remonte en tête
 * et on met à jour viewedAt. La liste est cappée à MAX_ITEMS.
 */
export function pushRecentlyViewed(item: Omit<RecentlyViewedItem, 'viewedAt'>): void {
  if (typeof window === 'undefined') return;
  const current = readRecentlyViewed();
  const filtered = current.filter((i) => i.slug !== item.slug);
  const next: RecentlyViewedItem[] = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
    0,
    RECENTLY_VIEWED_MAX_ITEMS,
  );
  writeRecentlyViewed(next);
  // Notifie les sections qui écoutent
  window.dispatchEvent(new CustomEvent('af:recently-viewed-updated'));
}

/** Retire un slug (utile pour purger un produit supprimé ou un doublon). */
export function removeRecentlyViewed(slug: string): void {
  if (typeof window === 'undefined') return;
  const current = readRecentlyViewed();
  writeRecentlyViewed(current.filter((i) => i.slug !== slug));
  window.dispatchEvent(new CustomEvent('af:recently-viewed-updated'));
}

/** Purge complète. */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECENTLY_VIEWED_STORAGE_KEY);
  } catch (err) {
    console.warn('[recently-viewed] clear failed:', err);
  }
  window.dispatchEvent(new CustomEvent('af:recently-viewed-updated'));
}
