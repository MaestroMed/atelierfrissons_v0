import 'server-only';
import { getStripeClient } from './client';
import type Stripe from 'stripe';

/**
 * Helpers Stripe Checkout pour les commandes one-time.
 *
 * **Mode test fonctionne sans K-Bis** : créer un compte Stripe en perso →
 * mode test activé immédiatement → clés `sk_test_…` / `pk_test_…` →
 * checkout fonctionnel avec cartes test (4242 4242 4242 4242).
 *
 * Mode live nécessite K-Bis + activation Stripe France (~3-5 jours review).
 */

interface CheckoutLineItem {
  productSlug: string;
  productName: string;
  description?: string;
  unitPriceCents: number;
  quantity: number;
  imageUrl?: string;
}

interface CreateCheckoutSessionInput {
  customerEmail?: string;
  lineItems: readonly CheckoutLineItem[];
  /** Référence de notre order interne — sert à reconnecter le webhook. */
  orderRef: string;
  /** Code promo appliqué (carte cadeau, parrainage, fidélité). */
  discountAmountCents?: number;
  shippingCents?: number;
  /** Methods autorisées : 'card' (par défaut), 'paypal', etc. */
  paymentMethodTypes?: ReadonlyArray<Stripe.Checkout.SessionCreateParams.PaymentMethodType>;
  successUrl: string;
  cancelUrl: string;
  /** Metadata pour reconnexion webhook → notre commande interne. */
  metadata?: Record<string, string>;
  /** Locale Stripe (ex: 'fr'). Auto-detect par défaut. */
  locale?: Stripe.Checkout.SessionCreateParams.Locale;
}

interface CheckoutSessionResult {
  ok: true;
  sessionId: string;
  url: string;
}

interface CheckoutSessionError {
  ok: false;
  error: string;
}

/**
 * Crée une Stripe Checkout Session pour une commande one-time.
 *
 * Retourne `{ ok: true, url }` à rediriger côté client, ou `{ ok: false, error }`.
 *
 * - Calcule automatiquement le total (line items + shipping − discount)
 * - Active automatic_tax si Stripe Tax est configuré
 * - Idempotency key basée sur orderRef pour éviter double-création
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CheckoutSessionResult | CheckoutSessionError> {
  const stripe = getStripeClient();
  if (!stripe) {
    return {
      ok: false,
      error: 'Stripe non configuré (STRIPE_SECRET_KEY absente).',
    };
  }

  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      input.lineItems.map((item) => ({
        price_data: {
          currency: 'eur',
          unit_amount: item.unitPriceCents,
          product_data: {
            name: item.productName,
            ...(item.description ? { description: item.description } : {}),
            ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
            metadata: { slug: item.productSlug },
          },
        },
        quantity: item.quantity,
      }));

    // Shipping en line item séparé — garde la TVA cohérente
    if (input.shippingCents && input.shippingCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          unit_amount: input.shippingCents,
          product_data: {
            name: 'Livraison Colissimo Suivi',
          },
        },
        quantity: 1,
      });
    }

    // Discount via Stripe coupon créé à la volée (one-shot)
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (input.discountAmountCents && input.discountAmountCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: input.discountAmountCents,
        currency: 'eur',
        duration: 'once',
        name: 'Remise',
        metadata: { orderRef: input.orderRef },
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        payment_method_types: [
          ...(input.paymentMethodTypes ?? ['card']),
        ],
        line_items: lineItems,
        ...(discounts ? { discounts } : {}),
        ...(input.customerEmail ? { customer_email: input.customerEmail } : {}),
        success_url: `${input.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: input.cancelUrl,
        locale: input.locale ?? 'fr',
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'IT', 'ES', 'NL'],
        },
        // Pas de TVA auto — on calcule nous-même via Drizzle pour l'instant
        // Sprint pivot suivant : activer Stripe Tax si compte FR registered
        metadata: {
          orderRef: input.orderRef,
          ...(input.metadata ?? {}),
        },
        // Expire après 30 min — le user peut recommencer
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      },
      {
        // Idempotency : 2 clics rapides sur "Procéder à la commande" ne créeront
        // qu'UNE seule session
        idempotencyKey: `checkout-${input.orderRef}`,
      },
    );

    if (!session.url) {
      return { ok: false, error: 'Stripe a créé la session mais sans URL.' };
    }

    return { ok: true, sessionId: session.id, url: session.url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe checkout error';
    console.error('[stripe/checkout] create session failed:', message);
    return { ok: false, error: message };
  }
}

/**
 * Récupère une session par son ID. Utile pour la page `/checkout/confirmation`
 * qui doit afficher le statut au retour de Stripe.
 */
export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripeClient();
  if (!stripe) return null;
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent', 'customer'],
    });
  } catch (error) {
    console.error('[stripe/checkout] retrieve failed:', error);
    return null;
  }
}
