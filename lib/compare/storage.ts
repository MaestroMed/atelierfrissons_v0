/**
 * Helpers localStorage pour la liste de produits à comparer.
 *
 * Stocke juste les slugs (max 3) — la page `/comparer` reconstruit les
 * détails via une query serveur. Ce qui permet de partager une URL de
 * comparaison (`/comparer?ids=slug1,slug2`) et d'avoir la même vue que
 * via le bouton UI.
 *
 * 100 % client — importable depuis Client Components seulement.
 */

import { COMPARE_MAX_ITEMS, COMPARE_STORAGE_KEY, type CompareSlugList } from './types';

/** Renvoie `[]` en SSR ou storage indispo. */
export function readCompareSlugs(): CompareSlugList {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is string => typeof s === 'string' && /^[a-z0-9-]+$/.test(s))
      .slice(0, COMPARE_MAX_ITEMS);
  } catch (err) {
    console.warn('[compare] read failed:', err);
    return [];
  }
}

function writeCompareSlugs(slugs: readonly string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      COMPARE_STORAGE_KEY,
      JSON.stringify(slugs.slice(0, COMPARE_MAX_ITEMS)),
    );
  } catch (err) {
    console.warn('[compare] write failed:', err);
  }
  window.dispatchEvent(new CustomEvent('af:compare-updated'));
}

/**
 * Ajoute un slug à la liste.
 * Renvoie `{ ok, reason }` — `reason: 'full'` si la limite est atteinte.
 */
export function addToCompare(slug: string): { ok: boolean; reason?: 'full' } {
  const current = readCompareSlugs();
  if (current.includes(slug)) return { ok: true };
  if (current.length >= COMPARE_MAX_ITEMS) {
    return { ok: false, reason: 'full' };
  }
  writeCompareSlugs([...current, slug]);
  return { ok: true };
}

export function removeFromCompare(slug: string): void {
  const current = readCompareSlugs();
  writeCompareSlugs(current.filter((s) => s !== slug));
}

/** Toggle — ajoute si absent, retire si présent. */
export function toggleCompare(slug: string): { added: boolean; full: boolean } {
  const current = readCompareSlugs();
  if (current.includes(slug)) {
    writeCompareSlugs(current.filter((s) => s !== slug));
    return { added: false, full: false };
  }
  if (current.length >= COMPARE_MAX_ITEMS) {
    return { added: false, full: true };
  }
  writeCompareSlugs([...current, slug]);
  return { added: true, full: false };
}

export function clearCompare(): void {
  writeCompareSlugs([]);
}
