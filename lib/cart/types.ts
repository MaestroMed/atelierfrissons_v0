/** Types partagés panier — neutre (pas 'use server' / 'use client'). */

export interface CartLineItem {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  imageUrl: string | null;
  imageAlt: string | null;
  collection: 'jour' | 'nuit' | 'inaugurale' | 'signature' | null;
}

export interface CartSnapshot {
  items: readonly CartLineItem[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  /** Code promo appliqué (Sprint 4+). */
  discountCode: string | null;
  discountCents: number;
}

export const EMPTY_CART: CartSnapshot = {
  items: [],
  itemCount: 0,
  subtotalCents: 0,
  shippingCents: 0,
  taxCents: 0,
  totalCents: 0,
  currency: 'EUR',
  discountCode: null,
  discountCents: 0,
} as const;

/** Cookie name pour le panier invité (session). */
export const CART_COOKIE = 'af_cart';
export const CART_COOKIE_MAX_AGE_SECONDS = 14 * 24 * 60 * 60; // 14 jours

/** TVA française par défaut (Sprint 5 : configurable par produit/pays). */
export const DEFAULT_TAX_RATE = 0.2;

/** Frais de port forfaitaires (Sprint 5 : zones via admin). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000; // 60 €
export const STANDARD_SHIPPING_CENTS = 690; // 6,90 €
