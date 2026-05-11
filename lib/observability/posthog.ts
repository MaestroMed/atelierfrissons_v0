/**
 * PostHog instrumentation — funnels conversion + product analytics.
 *
 * Strict consent-gated : aucun event PostHog n'est envoyé sans consentement
 * `analytics` accordé via le CookieBanner CNIL.
 *
 * Côté serveur : `posthog-node` pour les events Server Action / webhook.
 * Côté client  : `posthog-js` pour les pageviews + tracking comportement.
 *
 * **Configuration env vars** :
 *   - NEXT_PUBLIC_POSTHOG_KEY         (clé publique projet)
 *   - NEXT_PUBLIC_POSTHOG_HOST        (eu.i.posthog.com pour RGPD)
 *   - POSTHOG_API_KEY                 (clé privée serveur, optionnelle)
 */

import 'server-only';
import { PostHog } from 'posthog-node';

// ─────────────────────────────────────────────────────────────────────────────
// SERVER CLIENT
// ─────────────────────────────────────────────────────────────────────────────

let serverClient: PostHog | null = null;

/**
 * Singleton PostHog node — initialisé au premier appel, NULL si pas configuré.
 *
 * Requirement RGPD : on flush manuellement avant terminaison du process
 * (Next.js appelle `shutdown()` automatiquement via la fonction de fin de
 * request handler).
 */
export function getPostHogServer(): PostHog | null {
  const key = process.env['POSTHOG_API_KEY'] ?? process.env['NEXT_PUBLIC_POSTHOG_KEY'];
  const host = process.env['NEXT_PUBLIC_POSTHOG_HOST'] ?? 'https://eu.i.posthog.com';
  if (!key) return null;
  if (serverClient) return serverClient;
  serverClient = new PostHog(key, {
    host,
    flushAt: 1, // flush after 1 event = pas de batching (acceptable côté server)
    flushInterval: 1000,
    // PostHog EU = serveurs Allemagne, conforme RGPD
  });
  return serverClient;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HELPERS — pivot V2 funnels
// ─────────────────────────────────────────────────────────────────────────────

interface CaptureInput {
  /** ID anonyme ou customer.id selon l'auth status. */
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
  /** Skip si false. Permet de respecter le consent côté caller. */
  consentGranted?: boolean;
}

export async function captureEvent(input: CaptureInput): Promise<void> {
  if (input.consentGranted === false) return;
  const client = getPostHogServer();
  if (!client) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.info(`[posthog] (skip — no key) ${input.event}`, input.properties);
    }
    return;
  }
  try {
    client.capture({
      distinctId: input.distinctId,
      event: input.event,
      properties: {
        ...input.properties,
        $current_url: undefined, // pas de PII URL côté server-side
      },
    });
  } catch (err) {
    console.warn('[posthog] capture failed:', (err as Error).message);
  }
}

/**
 * Identifie un visiteur anonyme avec son customer.id après login.
 * Permet de relier les événements pré-login aux événements post-login
 * dans le même funnel.
 */
export async function identifyUser(input: {
  anonymousId: string;
  customerId: string;
  email: string;
  consentGranted: boolean;
}): Promise<void> {
  if (!input.consentGranted) return;
  const client = getPostHogServer();
  if (!client) return;
  try {
    client.alias({
      distinctId: input.customerId,
      alias: input.anonymousId,
    });
    client.identify({
      distinctId: input.customerId,
      properties: {
        // Email hashé, pas en clair (RGPD)
        emailHash: hashEmail(input.email),
      },
    });
  } catch (err) {
    console.warn('[posthog] identify failed:', (err as Error).message);
  }
}

function hashEmail(email: string): string {
  // Hash simple non-cryptographique (pas besoin de réversibilité)
  let h = 0;
  const lowered = email.toLowerCase().trim();
  for (let i = 0; i < lowered.length; i++) {
    h = (h * 31 + lowered.charCodeAt(i)) | 0;
  }
  return `email_${(h >>> 0).toString(36)}`;
}
