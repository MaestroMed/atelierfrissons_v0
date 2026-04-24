'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  addToCart as addToCartStore,
  clearCart as clearCartStore,
  getCartSnapshot,
  removeFromCart as removeFromCartStore,
  setCartQuantity as setCartQuantityStore,
} from './store';
import type { CartSnapshot } from './types';

/**
 * Server Actions panier — wrappers autour de `lib/cart/store.ts` avec
 * validation zod + revalidation des routes touchées.
 *
 * Toutes les mutations panier passent par ici (jamais directement par store
 * depuis un Client Component) pour avoir une seule frontière de validation
 * et un seul point d'invalidation cache.
 */

const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, 'slug invalide');

const quantitySchema = z.number().int().min(0).max(99);

export async function addToCartAction(slug: string, quantity = 1): Promise<CartSnapshot> {
  const parsedSlug = slugSchema.parse(slug);
  const parsedQty = quantitySchema.parse(quantity);
  const result = await addToCartStore(parsedSlug, parsedQty);
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');
  return result;
}

export async function setCartQuantityAction(slug: string, quantity: number): Promise<CartSnapshot> {
  const parsedSlug = slugSchema.parse(slug);
  const parsedQty = quantitySchema.parse(quantity);
  const result = await setCartQuantityStore(parsedSlug, parsedQty);
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');
  return result;
}

export async function removeFromCartAction(slug: string): Promise<CartSnapshot> {
  const parsedSlug = slugSchema.parse(slug);
  const result = await removeFromCartStore(parsedSlug);
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');
  return result;
}

export async function clearCartAction(): Promise<CartSnapshot> {
  const result = await clearCartStore();
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');
  return result;
}

export async function getCartSnapshotAction(): Promise<CartSnapshot> {
  return getCartSnapshot();
}
