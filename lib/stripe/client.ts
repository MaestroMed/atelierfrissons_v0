import 'server-only';
import Stripe from 'stripe';

/**
 * Singleton Stripe (Node SDK) — server-only.
 *
 * Mode test : utiliser des clés `sk_test_…` qui fonctionnent **sans K-Bis**.
 * Mode live : nécessite SIREN + activation compte Stripe France après K-Bis SASU.
 *
 * Variables d'env :
 *   - STRIPE_SECRET_KEY                 (sk_test_… ou sk_live_…)
 *   - STRIPE_WEBHOOK_SECRET             (whsec_… pour vérification webhooks)
 *   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_… côté client)
 *
 * Si `STRIPE_SECRET_KEY` est absente : le client retourne null et les helpers
 * font no-op (graceful pour le dev sans config).
 */

let _client: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (_client) return _client;
  const apiKey = process.env['STRIPE_SECRET_KEY'];
  if (!apiKey) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn(
        '[stripe] STRIPE_SECRET_KEY non défini — Stripe en mode no-op (dev OK).',
      );
    }
    return null;
  }
  _client = new Stripe(apiKey, {
    // Pin à la version actuelle stable Stripe
    apiVersion: '2025-08-27.basil',
    typescript: true,
    // Identifie nos requêtes côté Stripe Dashboard
    appInfo: {
      name: 'Atelier Frisson',
      version: '1.0.0',
      url: process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://atelierfrisson.fr',
    },
    // Retry automatique sur erreurs réseau (max 2 retries, exponential backoff)
    maxNetworkRetries: 2,
    timeout: 20_000,
  });
  return _client;
}

/**
 * Mode actif : 'test' si la clé commence par sk_test_, 'live' si sk_live_.
 * Utile pour afficher un badge "MODE TEST" dans l'admin.
 */
export function getStripeMode(): 'test' | 'live' | 'none' {
  const apiKey = process.env['STRIPE_SECRET_KEY'];
  if (!apiKey) return 'none';
  if (apiKey.startsWith('sk_test_')) return 'test';
  if (apiKey.startsWith('sk_live_')) return 'live';
  return 'none';
}

/** Publishable key côté client (NEXT_PUBLIC_*). Safe à exposer. */
export function getStripePublishableKey(): string | null {
  return process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'] ?? null;
}
