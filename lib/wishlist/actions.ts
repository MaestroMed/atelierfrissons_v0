'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  addToWishlist as addToWishlistStore,
  clearWishlist as clearWishlistStore,
  getWishlistSnapshot,
  removeFromWishlist as removeFromWishlistStore,
  toggleWishlist as toggleWishlistStore,
} from './store';
import type { WishlistSnapshot } from './types';

/**
 * Server Actions wishlist — wrappers autour de `lib/wishlist/store.ts` avec
 * validation zod + revalidation de la page favoris.
 */

const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, 'slug invalide');

export async function addToWishlistAction(slug: string): Promise<WishlistSnapshot> {
  const parsed = slugSchema.parse(slug);
  const result = await addToWishlistStore(parsed);
  revalidatePath('/compte/favoris');
  return result;
}

export async function removeFromWishlistAction(slug: string): Promise<WishlistSnapshot> {
  const parsed = slugSchema.parse(slug);
  const result = await removeFromWishlistStore(parsed);
  revalidatePath('/compte/favoris');
  return result;
}

export async function toggleWishlistAction(
  slug: string,
): Promise<{ snapshot: WishlistSnapshot; added: boolean }> {
  const parsed = slugSchema.parse(slug);
  const result = await toggleWishlistStore(parsed);
  revalidatePath('/compte/favoris');
  return result;
}

export async function clearWishlistAction(): Promise<WishlistSnapshot> {
  const result = await clearWishlistStore();
  revalidatePath('/compte/favoris');
  return result;
}

export async function getWishlistSnapshotAction(): Promise<WishlistSnapshot> {
  return getWishlistSnapshot();
}
