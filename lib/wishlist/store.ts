import 'server-only';
import { cookies } from 'next/headers';
import { getMockProductBySlug } from '@/lib/mock/products';
import {
  EMPTY_WISHLIST,
  WISHLIST_COOKIE,
  WISHLIST_COOKIE_MAX_AGE_SECONDS,
  WISHLIST_MAX_ITEMS,
  type WishlistItem,
  type WishlistSnapshot,
} from './types';

/**
 * Source de vérité wishlist — version invité (Sprint 2).
 *
 * Stratégie :
 *   - Invité : liste sérialisée dans le cookie `af_wishlist` (90 jours)
 *   - Connecté : table `wishlist_items` (Sprint 8+ — migration à la connexion)
 *
 * Format cookie : `slug:addedAtMs,slug:addedAtMs` — compact, lisible.
 * La source des métadonnées (name, price, image) est le mock produit ;
 * on ne sérialise QUE slug + addedAt pour éviter d'avoir à invalider si le
 * prix ou le nom change côté catalogue.
 *
 * Limite 40 items max (≈ 1-2KB cookie).
 */

interface RawWishlistEntry {
  slug: string;
  addedAt: number;
}

function parseWishlistCookie(value: string | undefined): RawWishlistEntry[] {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => {
      const [slug, ts] = entry.split(':');
      const addedAt = Number.parseInt(ts ?? '0', 10);
      if (!slug || !Number.isFinite(addedAt) || addedAt <= 0) return null;
      return { slug, addedAt };
    })
    .filter((e): e is RawWishlistEntry => e !== null);
}

function serializeWishlistCookie(entries: readonly RawWishlistEntry[]): string {
  return entries.map((e) => `${e.slug}:${e.addedAt}`).join(',');
}

function itemFromProduct(slug: string, addedAt: number): WishlistItem | null {
  const product = getMockProductBySlug(slug);
  if (!product || product.status !== 'active') return null;
  const firstImage = product.images[0];
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline ?? null,
    priceCents: product.priceCents,
    imageUrl: firstImage?.url ?? null,
    imageAlt: firstImage?.alt ?? null,
    collection: product.collection,
    addedAt,
  };
}

/** Récupère le snapshot wishlist courant. */
export async function getWishlistSnapshot(): Promise<WishlistSnapshot> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(WISHLIST_COOKIE)?.value;
  const entries = parseWishlistCookie(raw);
  if (entries.length === 0) return EMPTY_WISHLIST;

  // Tri du plus récent au plus ancien
  const sorted = [...entries].sort((a, b) => b.addedAt - a.addedAt);
  const items: WishlistItem[] = [];
  for (const entry of sorted) {
    const item = itemFromProduct(entry.slug, entry.addedAt);
    if (item) items.push(item);
  }
  return {
    items,
    itemCount: items.length,
    currency: 'EUR',
  };
}

/** Vérifie (sans récupérer les détails) si un slug est dans la wishlist. */
export async function isInWishlist(slug: string): Promise<boolean> {
  const cookieStore = await cookies();
  const entries = parseWishlistCookie(cookieStore.get(WISHLIST_COOKIE)?.value);
  return entries.some((e) => e.slug === slug);
}

/** Ajoute un produit à la wishlist. Idempotent — pas de doublon. */
export async function addToWishlist(slug: string): Promise<WishlistSnapshot> {
  const cookieStore = await cookies();
  const product = getMockProductBySlug(slug);
  if (!product || product.status !== 'active') {
    throw new Error(`Produit introuvable : ${slug}`);
  }
  const current = parseWishlistCookie(cookieStore.get(WISHLIST_COOKIE)?.value);
  if (!current.some((e) => e.slug === slug)) {
    current.push({ slug, addedAt: Date.now() });
  }
  // Respect de la limite : on garde les N plus récents
  const next =
    current.length > WISHLIST_MAX_ITEMS
      ? [...current].sort((a, b) => b.addedAt - a.addedAt).slice(0, WISHLIST_MAX_ITEMS)
      : current;
  await persistWishlistCookie(next);
  return getWishlistSnapshot();
}

/** Retire un produit de la wishlist. */
export async function removeFromWishlist(slug: string): Promise<WishlistSnapshot> {
  const cookieStore = await cookies();
  const current = parseWishlistCookie(cookieStore.get(WISHLIST_COOKIE)?.value);
  const next = current.filter((e) => e.slug !== slug);
  await persistWishlistCookie(next);
  return getWishlistSnapshot();
}

/** Toggle — ajoute si absent, retire si présent. Renvoie l'état final (`true` = ajouté). */
export async function toggleWishlist(
  slug: string,
): Promise<{ snapshot: WishlistSnapshot; added: boolean }> {
  const present = await isInWishlist(slug);
  const snapshot = present ? await removeFromWishlist(slug) : await addToWishlist(slug);
  return { snapshot, added: !present };
}

/** Vide la wishlist. */
export async function clearWishlist(): Promise<WishlistSnapshot> {
  await persistWishlistCookie([]);
  return EMPTY_WISHLIST;
}

async function persistWishlistCookie(entries: readonly RawWishlistEntry[]) {
  const cookieStore = await cookies();
  if (entries.length === 0) {
    cookieStore.delete(WISHLIST_COOKIE);
    return;
  }
  cookieStore.set(WISHLIST_COOKIE, serializeWishlistCookie(entries), {
    path: '/',
    maxAge: WISHLIST_COOKIE_MAX_AGE_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Le bouton client peut le lire pour hydrater l'état initial
  });
}
