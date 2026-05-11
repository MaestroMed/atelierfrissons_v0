/**
 * Définition des funnels de conversion clés Atelier Frisson.
 *
 * Centralise les noms d'event PostHog + les attributs attendus pour
 * faciliter la maintenance (renommage = 1 endroit) et l'analyse côté
 * dashboard PostHog.
 *
 * Convention : noms d'events en `snake_case`, properties en `camelCase`.
 */

export const FUNNELS = {
  /**
   * Funnel principal — visite → conversion.
   * Chaque step doit être tracké pour permettre l'analyse drop-off.
   */
  acquisition: [
    'page_view_homepage',
    'page_view_collection',
    'page_view_product',
    'product_added_to_cart',
    'cart_viewed',
    'checkout_started',
    'checkout_address_filled',
    'checkout_payment_initiated',
    'order_completed',
  ] as const,

  /**
   * Funnel abonnement Box Mensuelle — souvent un parcours différent
   * du checkout one-time (landing dédié + 3 plans + cadeau).
   */
  subscription: [
    'page_view_box_mensuelle',
    'subscription_plan_selected',
    'subscription_checkout_started',
    'subscription_started',
    'subscription_first_box_shipped',
  ] as const,

  /**
   * Funnel parrainage — share → activation.
   */
  referral: [
    'referral_code_generated',
    'referral_code_shared',
    'referral_link_clicked',
    'referral_signup',
    'referral_first_purchase',
    'referral_rewarded',
  ] as const,

  /**
   * Funnel coffret cadeau — peut être one-shot ou récurrent.
   */
  giftcard: [
    'page_view_gift_cards',
    'gift_card_amount_selected',
    'gift_card_form_completed',
    'gift_card_payment_initiated',
    'gift_card_purchased',
    'gift_card_redeemed',
  ] as const,

  /**
   * Funnel newsletter — capture email.
   */
  newsletter: [
    'newsletter_form_viewed',
    'newsletter_form_submitted',
    'newsletter_double_opt_in_clicked',
    'newsletter_subscribed',
  ] as const,
} as const;

export type FunnelName = keyof typeof FUNNELS;
export type FunnelStep<F extends FunnelName> = (typeof FUNNELS)[F][number];

/**
 * Tableau aplati de tous les events trackés.
 * Utile pour valider qu'un event passé en argument est connu.
 */
export const ALL_TRACKED_EVENTS: ReadonlyArray<string> = Object.values(FUNNELS).flatMap((f) => [
  ...f,
]);

export function isTrackedEvent(name: string): boolean {
  return ALL_TRACKED_EVENTS.includes(name);
}

/**
 * Properties obligatoires par event — pour validation au capture-time.
 *
 * Si un event est tracké sans les properties obligatoires, ça pourrit le
 * funnel PostHog (data integrity). On warn en dev.
 */
export const REQUIRED_PROPERTIES: Record<string, readonly string[]> = {
  product_added_to_cart: ['productSlug', 'priceCents', 'quantity', 'cartTotalCents'],
  checkout_started: ['cartTotalCents', 'itemCount'],
  order_completed: ['orderId', 'totalCents', 'paymentProvider', 'itemCount'],
  subscription_started: ['subscriptionId', 'planSlug', 'monthlyPriceCents'],
  referral_first_purchase: ['referralCode', 'orderId'],
  gift_card_purchased: ['giftCardId', 'amountCents'],
  newsletter_subscribed: ['source'],
} as const;

export function validateProperties(
  event: string,
  properties: Record<string, unknown>,
): { valid: boolean; missing: readonly string[] } {
  const required = REQUIRED_PROPERTIES[event];
  if (!required) return { valid: true, missing: [] };
  const missing = required.filter((key) => !(key in properties));
  return { valid: missing.length === 0, missing };
}
