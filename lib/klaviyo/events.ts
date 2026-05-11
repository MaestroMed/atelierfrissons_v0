import 'server-only';
import { trackEvent } from './track';

/**
 * Wrappers typés pour les events Klaviyo de la maison Atelier Frisson.
 *
 * Convention de nommage : `<Verbe au passé> <Sujet>` — c'est la convention
 * Klaviyo standard pour que les flows automatiques (Welcome, Abandoned Cart,
 * Browse Abandonment) s'auto-attachent aux bons triggers.
 *
 * Tous les helpers sont async no-throw — un échec analytics ne doit jamais
 * casser le flow business.
 */

interface ProfileIdentifier {
  email: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
}

interface OrderItem {
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  collection?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT BROWSE EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function trackViewedProduct(params: {
  profile: ProfileIdentifier;
  product: OrderItem;
}): Promise<void> {
  await trackEvent('Viewed Product', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      ProductName: params.product.name,
      ProductSlug: params.product.slug,
      ProductCategory: params.product.category ?? '',
      ProductCollection: params.product.collection ?? '',
      Price: (params.product.priceCents / 100).toFixed(2),
      Currency: 'EUR',
      ImageURL: params.product.imageUrl ?? '',
    },
  });
}

export async function trackAddedToCart(params: {
  profile: ProfileIdentifier;
  product: OrderItem;
  cartTotalCents: number;
  cartItemCount: number;
}): Promise<void> {
  await trackEvent('Added to Cart', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      ProductName: params.product.name,
      ProductSlug: params.product.slug,
      Price: (params.product.priceCents / 100).toFixed(2),
      Quantity: params.product.quantity,
      Currency: 'EUR',
      $value: (params.product.priceCents / 100).toFixed(2),
      CartTotal: (params.cartTotalCents / 100).toFixed(2),
      CartItemCount: params.cartItemCount,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT & ORDER EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function trackStartedCheckout(params: {
  profile: ProfileIdentifier;
  cartTotalCents: number;
  items: readonly OrderItem[];
  checkoutUrl: string;
}): Promise<void> {
  await trackEvent('Started Checkout', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      $value: (params.cartTotalCents / 100).toFixed(2),
      Currency: 'EUR',
      ItemCount: params.items.length,
      CheckoutURL: params.checkoutUrl,
      Items: params.items.map((i) => ({
        SKU: i.slug,
        ProductName: i.name,
        Quantity: i.quantity,
        ItemPrice: (i.priceCents / 100).toFixed(2),
      })),
    },
  });
}

export async function trackPlacedOrder(params: {
  profile: ProfileIdentifier;
  orderId: string;
  totalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  items: readonly OrderItem[];
  paymentProvider: 'stripe' | 'ccbill' | 'verotel';
}): Promise<void> {
  await trackEvent('Placed Order', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      $event_id: params.orderId,
      $value: (params.totalCents / 100).toFixed(2),
      Currency: 'EUR',
      OrderId: params.orderId,
      Subtotal: ((params.totalCents - params.shippingCents - params.taxCents) / 100).toFixed(2),
      Shipping: (params.shippingCents / 100).toFixed(2),
      Tax: (params.taxCents / 100).toFixed(2),
      Discount: (params.discountCents / 100).toFixed(2),
      PaymentProvider: params.paymentProvider,
      Items: params.items.map((i) => ({
        SKU: i.slug,
        ProductName: i.name,
        Quantity: i.quantity,
        ItemPrice: (i.priceCents / 100).toFixed(2),
        ImageURL: i.imageUrl ?? '',
      })),
    },
  });
}

export async function trackFulfilledOrder(params: {
  profile: ProfileIdentifier;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
}): Promise<void> {
  await trackEvent('Fulfilled Order', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      OrderId: params.orderId,
      TrackingNumber: params.trackingNumber,
      Carrier: params.carrier,
      TrackingURL: params.trackingUrl,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION EVENTS (Box Mensuelle)
// ─────────────────────────────────────────────────────────────────────────────

export async function trackStartedSubscription(params: {
  profile: ProfileIdentifier;
  subscriptionId: string;
  planName: string;
  planSlug: string;
  monthlyPriceCents: number;
  isAnnual: boolean;
}): Promise<void> {
  await trackEvent('Started Subscription', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      SubscriptionId: params.subscriptionId,
      PlanName: params.planName,
      PlanSlug: params.planSlug,
      MonthlyPrice: (params.monthlyPriceCents / 100).toFixed(2),
      Currency: 'EUR',
      IsAnnualBilling: params.isAnnual,
    },
  });
}

export async function trackRenewedSubscription(params: {
  profile: ProfileIdentifier;
  subscriptionId: string;
  shipmentNumber: number;
  amountCents: number;
}): Promise<void> {
  await trackEvent('Renewed Subscription', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      SubscriptionId: params.subscriptionId,
      ShipmentNumber: params.shipmentNumber,
      $value: (params.amountCents / 100).toFixed(2),
      Currency: 'EUR',
    },
  });
}

export async function trackPausedSubscription(params: {
  profile: ProfileIdentifier;
  subscriptionId: string;
  pausedUntil: string | null;
}): Promise<void> {
  await trackEvent('Paused Subscription', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      SubscriptionId: params.subscriptionId,
      PausedUntil: params.pausedUntil ?? 'indefinite',
    },
  });
}

export async function trackCancelledSubscription(params: {
  profile: ProfileIdentifier;
  subscriptionId: string;
  reason: string | null;
  feedback: string | null;
}): Promise<void> {
  await trackEvent('Cancelled Subscription', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      SubscriptionId: params.subscriptionId,
      CancellationReason: params.reason ?? 'unspecified',
      HasFeedback: !!params.feedback,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CART ABANDONMENT
// ─────────────────────────────────────────────────────────────────────────────

export async function trackAbandonedCart(params: {
  profile: ProfileIdentifier;
  cartId: string;
  cartTotalCents: number;
  itemCount: number;
  resumeUrl: string;
  hoursAgo: number;
}): Promise<void> {
  await trackEvent('Abandoned Cart', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      CartId: params.cartId,
      $value: (params.cartTotalCents / 100).toFixed(2),
      Currency: 'EUR',
      ItemCount: params.itemCount,
      ResumeURL: params.resumeUrl,
      HoursAbandonedAgo: params.hoursAgo,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERRAL EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function trackReferralCodeShared(params: {
  profile: ProfileIdentifier;
  code: string;
  channel: 'email' | 'whatsapp' | 'link' | 'sms' | 'other';
}): Promise<void> {
  await trackEvent('Shared Referral Code', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      ReferralCode: params.code,
      Channel: params.channel,
    },
  });
}

export async function trackReferralRewarded(params: {
  profile: ProfileIdentifier;
  code: string;
  triggeringOrderId: string;
  creditedCents: number;
}): Promise<void> {
  await trackEvent('Referral Rewarded', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      ReferralCode: params.code,
      TriggeringOrderId: params.triggeringOrderId,
      CreditedAmount: (params.creditedCents / 100).toFixed(2),
      Currency: 'EUR',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// LOYALTY EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function trackLoyaltyPointsEarned(params: {
  profile: ProfileIdentifier;
  points: number;
  reason: string;
  newBalance: number;
}): Promise<void> {
  await trackEvent('Loyalty Points Earned', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      PointsEarned: params.points,
      Reason: params.reason,
      NewBalance: params.newBalance,
    },
  });
}

export async function trackLoyaltyPointsRedeemed(params: {
  profile: ProfileIdentifier;
  points: number;
  discountCents: number;
  orderId: string;
}): Promise<void> {
  await trackEvent('Loyalty Points Redeemed', {
    email: params.profile.email,
    ...(params.profile.customerId ? { customerId: params.profile.customerId } : {}),
    properties: {
      PointsRedeemed: params.points,
      DiscountAmount: (params.discountCents / 100).toFixed(2),
      Currency: 'EUR',
      OrderId: params.orderId,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GIFT CARD EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function trackGiftCardPurchased(params: {
  senderEmail: string;
  recipientEmail: string;
  recipientName: string;
  amountCents: number;
  physicalCard: boolean;
  scheduledSendDate: string;
  giftCardId: string;
}): Promise<void> {
  // Track sur le profil sender
  await trackEvent('Purchased Gift Card', {
    email: params.senderEmail,
    properties: {
      GiftCardId: params.giftCardId,
      RecipientEmail: params.recipientEmail,
      RecipientName: params.recipientName,
      Amount: (params.amountCents / 100).toFixed(2),
      Currency: 'EUR',
      PhysicalCard: params.physicalCard,
      ScheduledSendDate: params.scheduledSendDate,
    },
  });
}

export async function trackGiftCardRedeemed(params: {
  recipientEmail: string;
  giftCardId: string;
  redeemedCents: number;
  remainingBalanceCents: number;
  orderId: string;
}): Promise<void> {
  await trackEvent('Redeemed Gift Card', {
    email: params.recipientEmail,
    properties: {
      GiftCardId: params.giftCardId,
      RedeemedAmount: (params.redeemedCents / 100).toFixed(2),
      RemainingBalance: (params.remainingBalanceCents / 100).toFixed(2),
      Currency: 'EUR',
      OrderId: params.orderId,
    },
  });
}
