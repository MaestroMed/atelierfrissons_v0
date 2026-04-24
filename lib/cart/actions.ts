'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  addToCart as addToCartStore,
  applyPromoCode as applyPromoCodeStore,
  clearCart as clearCartStore,
  getCartSnapshot,
  removeFromCart as removeFromCartStore,
  removePromoCode as removePromoCodeStore,
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

const promoCodeSchema = z
  .string()
  .min(1, 'Code manquant')
  .max(50, 'Code trop long')
  .regex(/^[A-Za-z0-9 _-]+$/, 'Caractères invalides');

export async function applyPromoCodeAction(
  code: string,
): Promise<{ snapshot: CartSnapshot; error: string | null }> {
  const parsed = promoCodeSchema.safeParse(code);
  if (!parsed.success) {
    const snapshot = await getCartSnapshot();
    return { snapshot, error: parsed.error.issues[0]?.message ?? 'Code invalide' };
  }
  const result = await applyPromoCodeStore(parsed.data);
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');
  return result;
}

export async function removePromoCodeAction(): Promise<CartSnapshot> {
  const result = await removePromoCodeStore();
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');
  return result;
}
