'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { checkoutSchema, type CheckoutInput, getShippingMethod } from './schemas';
import { clearCart, getCartSnapshot } from '@/lib/cart/store';
import { generateLocalOrderNumber } from '@/lib/orders/generate-order-number';
import { trackEvent } from '@/lib/klaviyo/track';

/**
 * Server Action `placeOrder` — création de commande + paiement.
 *
 * Flow :
 *   1. Valide le payload checkout (zod)
 *   2. Récupère le snapshot panier (re-vérifie les prix côté serveur)
 *   3. Crée la commande dans DB (Sprint 4 : table `orders` réelle).
 *      En attendant : génère un numéro local et logge.
 *   4. Crée la session Stripe Checkout (si configuré) ou mock l'order paid
 *   5. Track Klaviyo `Placed Order` event
 *   6. Vide le panier
 *   7. Redirige vers `/checkout/confirmation/[orderNumber]`
 *
 * Sprint 7 : remplacer Stripe par CCBill FlexForms iframe (high-risk adulte).
 */

export interface PlaceOrderResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  orderNumber?: string;
}

export async function placeOrderAction(input: CheckoutInput): Promise<PlaceOrderResult> {
  const result = checkoutSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      fieldErrors[path] = issue.message;
    }
    return { ok: false, message: 'Vérifiez les informations du formulaire', fieldErrors };
  }

  const data = result.data;
  const cart = await getCartSnapshot();
  if (cart.itemCount === 0) {
    return { ok: false, message: 'Votre panier est vide.' };
  }

  // Re-calcul shipping côté serveur selon la méthode choisie
  const shipping = getShippingMethod(data.shippingMethod);
  const shippingCents = cart.subtotalCents >= 6000 ? 0 : (shipping?.priceCents ?? 690);
  const totalCents = cart.subtotalCents + shippingCents;

  const orderNumber = generateLocalOrderNumber();

  // TODO Sprint 4 : INSERT INTO orders + order_items + invoices
  console.info('[placeOrder] new order', {
    orderNumber,
    customerEmail: data.contact.email,
    itemCount: cart.itemCount,
    totalCents,
    shippingMethod: data.shippingMethod,
    isGift: data.isGift,
    giftWrap: data.giftWrap,
    hasGiftMessage: data.giftMessage ? data.giftMessage.length > 0 : false,
  });

  // Track Klaviyo "Placed Order" (no-op si pas de creds)
  await trackEvent('Placed Order', {
    email: data.contact.email,
    properties: {
      $value: totalCents / 100,
      orderNumber,
      itemCount: cart.itemCount,
      items: cart.items.map((it) => ({
        product_id: it.productId,
        sku: it.slug,
        product_name: it.name,
        quantity: it.quantity,
        item_price: it.unitPriceCents / 100,
      })),
    },
  });

  // TODO Sprint 4 : créer Stripe Checkout Session ici si STRIPE_SECRET_KEY
  // disponible — sinon mock direct vers /confirmation.

  await clearCart();
  revalidatePath('/panier');
  revalidatePath('/(shop)', 'layout');

  redirect(`/checkout/confirmation/${orderNumber}`);
}
