import 'server-only';
import { cookies } from 'next/headers';
import { getMockProductBySlug } from '@/lib/mock/products';
import type { Product } from '@/lib/db/schema';
import {
  CART_COOKIE,
  CART_COOKIE_MAX_AGE_SECONDS,
  DEFAULT_TAX_RATE,
  EMPTY_CART,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
  type CartLineItem,
  type CartSnapshot,
} from './types';

/**
 * Source de vérité du panier — version Sprint 2.
 *
 * Stratégie :
 *   - Invité : panier sérialisé dans le cookie `af_cart` (14 jours)
 *   - Connecté : table `carts` + `cart_items` (à brancher Sprint 3, après
 *     que Supabase Auth soit en place)
 *
 * Le format cookie est compact : `slug:qty,slug:qty` (lisible, court, facile
 * à debugger). Pas de signature HMAC ici car le panier n'est pas sensible —
 * on revalide les prix côté serveur à chaque calcul.
 *
 * Tous les calculs (subtotal, TVA, shipping) sont faits côté serveur pour
 * éviter toute manipulation client.
 */

interface RawCartEntry {
  slug: string;
  quantity: number;
}

function parseCartCookie(value: string | undefined): RawCartEntry[] {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => {
      const [slug, qtyStr] = entry.split(':');
      const quantity = Number.parseInt(qtyStr ?? '0', 10);
      if (!slug || !Number.isFinite(quantity) || quantity <= 0) return null;
      return { slug, quantity: Math.min(quantity, 99) };
    })
    .filter((e): e is RawCartEntry => e !== null);
}

function serializeCartCookie(entries: readonly RawCartEntry[]): string {
  return entries.map((e) => `${e.slug}:${e.quantity}`).join(',');
}

function lineItemFromProduct(product: Product, quantity: number): CartLineItem {
  const firstImage = product.images[0];
  return {
    productId: product.id,
    variantId: null,
    slug: product.slug,
    name: product.name,
    unitPriceCents: product.priceCents,
    quantity,
    imageUrl: firstImage?.url ?? null,
    imageAlt: firstImage?.alt ?? null,
    collection: product.collection,
  };
}

function computeTotals(items: readonly CartLineItem[]): CartSnapshot {
  const subtotalCents = items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const taxCents = Math.round(subtotalCents * (DEFAULT_TAX_RATE / (1 + DEFAULT_TAX_RATE)));
  const shippingCents =
    subtotalCents === 0
      ? 0
      : subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : STANDARD_SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;

  return {
    items,
    itemCount,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    currency: 'EUR',
    discountCode: null,
    discountCents: 0,
  };
}

/** Récupère le snapshot du panier courant (sync, lit le cookie). */
export async function getCartSnapshot(): Promise<CartSnapshot> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  const entries = parseCartCookie(raw);
  if (entries.length === 0) return EMPTY_CART;

  const items: CartLineItem[] = [];
  for (const entry of entries) {
    const product = getMockProductBySlug(entry.slug);
    if (!product || product.status !== 'active') continue;
    items.push(lineItemFromProduct(product, entry.quantity));
  }
  return computeTotals(items);
}

/** Ajoute un produit au panier (ou augmente la quantité). */
export async function addToCart(slug: string, quantityDelta = 1): Promise<CartSnapshot> {
  const cookieStore = await cookies();
  const product = getMockProductBySlug(slug);
  if (!product || product.status !== 'active') {
    throw new Error(`Produit introuvable : ${slug}`);
  }
  const current = parseCartCookie(cookieStore.get(CART_COOKIE)?.value);
  const idx = current.findIndex((e) => e.slug === slug);
  if (idx === -1) {
    current.push({ slug, quantity: Math.max(1, quantityDelta) });
  } else {
    const existing = current[idx]!;
    const newQty = Math.max(1, Math.min(99, existing.quantity + quantityDelta));
    current[idx] = { slug, quantity: newQty };
  }
  await persistCartCookie(current);
  return getCartSnapshot();
}

/** Met à jour la quantité d'un item (remplace, ne pas additionner). */
export async function setCartQuantity(slug: string, quantity: number): Promise<CartSnapshot> {
  const cookieStore = await cookies();
  const current = parseCartCookie(cookieStore.get(CART_COOKIE)?.value);
  if (quantity <= 0) {
    const next = current.filter((e) => e.slug !== slug);
    await persistCartCookie(next);
    return getCartSnapshot();
  }
  const idx = current.findIndex((e) => e.slug === slug);
  const safeQty = Math.min(99, quantity);
  if (idx === -1) {
    current.push({ slug, quantity: safeQty });
  } else {
    current[idx] = { slug, quantity: safeQty };
  }
  await persistCartCookie(current);
  return getCartSnapshot();
}

/** Retire un item du panier. */
export async function removeFromCart(slug: string): Promise<CartSnapshot> {
  const cookieStore = await cookies();
  const current = parseCartCookie(cookieStore.get(CART_COOKIE)?.value);
  const next = current.filter((e) => e.slug !== slug);
  await persistCartCookie(next);
  return getCartSnapshot();
}

/** Vide le panier complet. */
export async function clearCart(): Promise<CartSnapshot> {
  await persistCartCookie([]);
  return EMPTY_CART;
}

async function persistCartCookie(entries: readonly RawCartEntry[]) {
  const cookieStore = await cookies();
  if (entries.length === 0) {
    cookieStore.delete(CART_COOKIE);
    return;
  }
  cookieStore.set(CART_COOKIE, serializeCartCookie(entries), {
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // CartDrawer client peut le lire pour update sans round-trip
  });
}
