/** Types partagés wishlist — neutre (pas 'use server' / 'use client'). */

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  tagline: string | null;
  priceCents: number;
  imageUrl: string | null;
  imageAlt: string | null;
  collection:
    | 'couples'
    | 'elle'
    | 'lui'
    | 'cadeaux'
    | 'jour'
    | 'nuit'
    | 'inaugurale'
    | 'signature'
    | null;
  /** Timestamp epoch ms — tri par ajout récent. */
  addedAt: number;
}

export interface WishlistSnapshot {
  items: readonly WishlistItem[];
  itemCount: number;
  currency: string;
}

export const EMPTY_WISHLIST: WishlistSnapshot = {
  items: [],
  itemCount: 0,
  currency: 'EUR',
} as const;

/** Cookie name pour les favoris invité — persiste 90 jours (plus long que le panier). */
export const WISHLIST_COOKIE = 'af_wishlist';
export const WISHLIST_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 jours

/** Limite raisonnable pour éviter un cookie qui dépasse les 4KB. */
export const WISHLIST_MAX_ITEMS = 40;
