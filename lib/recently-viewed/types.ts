/** Types partagés Recently Viewed — neutre (pas 'use client' / 'use server'). */

export interface RecentlyViewedItem {
  slug: string;
  name: string;
  tagline: string | null;
  priceCents: number;
  imageUrl: string | null;
  imageAlt: string | null;
  collection: 'jour' | 'nuit' | 'inaugurale' | 'signature' | null;
  viewedAt: number;
}

export const RECENTLY_VIEWED_STORAGE_KEY = 'af_recently_viewed';
export const RECENTLY_VIEWED_MAX_ITEMS = 12;
/** Durée de vie d'une vue — au-delà, on drop l'item. 60 jours. */
export const RECENTLY_VIEWED_TTL_MS = 60 * 24 * 60 * 60 * 1000;
