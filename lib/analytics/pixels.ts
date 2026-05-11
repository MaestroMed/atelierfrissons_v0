/**
 * Tracking pixels — Pinterest Tag + ad networks adultes (TrafficJunky, ExoClick).
 *
 * Module 100 % client-only. Toutes les fonctions sont des **no-op silencieux**
 * si :
 *   - le consentement marketing n'a pas été accordé (CookieBanner)
 *   - les variables d'env nécessaires ne sont pas définies
 *
 * Conformité CNIL/ePrivacy/RGPD :
 *   - Aucun pixel ne se charge avant accord explicite
 *   - Le consentement est lu depuis le cookie `af_consent_v1` géré par CookieBanner
 *   - L'event `af:consent` permet de réagir aux changements live
 *
 * Variables d'env attendues (toutes optionnelles — pixel skip si absente) :
 *   - NEXT_PUBLIC_PINTEREST_TAG_ID
 *   - NEXT_PUBLIC_TRAFFICJUNKY_ZONE_ID
 *   - NEXT_PUBLIC_EXOCLICK_ZONE_ID
 *   - NEXT_PUBLIC_PLUGRUSH_ZONE_ID
 */

import { readConsent } from '@/components/layout/CookieBanner';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface TrackedProduct {
  slug: string;
  name: string;
  priceCents: number;
  category?: string | null;
  quantity?: number;
}

export interface CheckoutData {
  orderId: string;
  totalCents: number;
  currency: 'EUR';
  items: readonly TrackedProduct[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSENT GATE
// ─────────────────────────────────────────────────────────────────────────────

function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = readConsent();
  return consent?.marketing === true;
}

function envOrNull(key: string): string | null {
  const v = process.env[key];
  return v && v.trim() !== '' ? v.trim() : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PINTEREST TAG
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    pintrk?: ((...args: unknown[]) => void) & {
      queue?: unknown[];
      version?: string;
      pageVisit?: () => void;
    };
    af_pixels_loaded?: boolean;
  }
}

/**
 * Charge le script Pinterest Tag une seule fois (idempotent).
 * Rien ne se passe si pas de consentement OU pas d'ID configuré.
 */
export function loadPinterestTag(): void {
  if (!hasMarketingConsent()) return;
  if (typeof window === 'undefined') return;
  if (window.pintrk) return;

  const tagId = envOrNull('NEXT_PUBLIC_PINTEREST_TAG_ID');
  if (!tagId) return;

  // Bootstrap conforme à la doc Pinterest officielle
  // (https://help.pinterest.com/business/article/install-the-pinterest-tag)
  window.pintrk = function (...args: unknown[]) {
    (window.pintrk!.queue = window.pintrk!.queue ?? []).push(args);
  } as typeof window.pintrk;
  window.pintrk!.queue = [];
  window.pintrk!.version = '3.0';

  const s = document.createElement('script');
  s.async = true;
  s.defer = true;
  s.src = 'https://s.pinimg.com/ct/core.js';
  document.head.appendChild(s);

  window.pintrk('load', tagId, { em: '<user_email_address>' });
  window.pintrk('page');
}

export function trackPinterestPageView(): void {
  if (!hasMarketingConsent() || typeof window === 'undefined' || !window.pintrk) return;
  window.pintrk('page');
}

export function trackPinterestProductView(product: TrackedProduct): void {
  if (!hasMarketingConsent() || typeof window === 'undefined' || !window.pintrk) return;
  window.pintrk('track', 'pagevisit', {
    line_items: [
      {
        product_name: product.name,
        product_id: product.slug,
        product_category: product.category ?? '',
        product_price: (product.priceCents / 100).toFixed(2),
        product_quantity: product.quantity ?? 1,
      },
    ],
    value: (product.priceCents / 100).toFixed(2),
    currency: 'EUR',
  });
}

export function trackPinterestAddToCart(product: TrackedProduct): void {
  if (!hasMarketingConsent() || typeof window === 'undefined' || !window.pintrk) return;
  window.pintrk('track', 'addtocart', {
    value: ((product.priceCents * (product.quantity ?? 1)) / 100).toFixed(2),
    currency: 'EUR',
    line_items: [
      {
        product_name: product.name,
        product_id: product.slug,
        product_price: (product.priceCents / 100).toFixed(2),
        product_quantity: product.quantity ?? 1,
      },
    ],
  });
}

export function trackPinterestCheckout(data: CheckoutData): void {
  if (!hasMarketingConsent() || typeof window === 'undefined' || !window.pintrk) return;
  window.pintrk('track', 'checkout', {
    value: (data.totalCents / 100).toFixed(2),
    order_quantity: data.items.length,
    currency: data.currency,
    line_items: data.items.map((i) => ({
      product_name: i.name,
      product_id: i.slug,
      product_price: (i.priceCents / 100).toFixed(2),
      product_quantity: i.quantity ?? 1,
    })),
  });
}

export function trackPinterestLead(): void {
  if (!hasMarketingConsent() || typeof window === 'undefined' || !window.pintrk) return;
  window.pintrk('track', 'lead');
}

// ─────────────────────────────────────────────────────────────────────────────
// AD NETWORKS ADULTES — pixels GET (img-based)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fire un tracking pixel GET (img-based). Utilisé par TrafficJunky, ExoClick,
 * Plugrush et autres ad networks adultes qui acceptent ce format universel.
 *
 * Aucun cookie tiers déposé directement par nous — la responsabilité du
 * cookie est portée par le réseau côté serveur.
 */
function fireImgPixel(url: string): void {
  if (typeof window === 'undefined') return;
  const img = new Image(1, 1);
  img.style.position = 'absolute';
  img.style.width = '1px';
  img.style.height = '1px';
  img.style.opacity = '0';
  img.referrerPolicy = 'no-referrer-when-downgrade';
  img.src = url;
  // L'image n'a pas besoin d'être dans le DOM pour fire la requête HTTP
}

export function trackAdNetworksConversion(data: CheckoutData): void {
  if (!hasMarketingConsent()) return;

  const tjZone = envOrNull('NEXT_PUBLIC_TRAFFICJUNKY_ZONE_ID');
  if (tjZone) {
    fireImgPixel(
      `https://ads.trafficjunky.net/conversion?zone=${encodeURIComponent(tjZone)}&order_id=${encodeURIComponent(data.orderId)}&value=${(data.totalCents / 100).toFixed(2)}&currency=EUR`,
    );
  }

  const exoZone = envOrNull('NEXT_PUBLIC_EXOCLICK_ZONE_ID');
  if (exoZone) {
    fireImgPixel(
      `https://syndication.exoclick.com/conversion.php?zone_id=${encodeURIComponent(exoZone)}&order=${encodeURIComponent(data.orderId)}&value=${(data.totalCents / 100).toFixed(2)}&currency=EUR`,
    );
  }

  const plugZone = envOrNull('NEXT_PUBLIC_PLUGRUSH_ZONE_ID');
  if (plugZone) {
    fireImgPixel(
      `https://plugrush.com/track/conversion?zone=${encodeURIComponent(plugZone)}&order=${encodeURIComponent(data.orderId)}&v=${(data.totalCents / 100).toFixed(2)}`,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API HAUTE NIVEAU — fonctions à appeler depuis l'app
// ─────────────────────────────────────────────────────────────────────────────

export function trackPageView(): void {
  trackPinterestPageView();
}

export function trackProductView(product: TrackedProduct): void {
  trackPinterestProductView(product);
}

export function trackAddToCart(product: TrackedProduct): void {
  trackPinterestAddToCart(product);
}

export function trackCheckout(data: CheckoutData): void {
  trackPinterestCheckout(data);
  trackAdNetworksConversion(data);
}

export function trackNewsletterSignup(): void {
  trackPinterestLead();
}
