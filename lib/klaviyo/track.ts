import 'server-only';

/**
 * Klaviyo events — server-side tracking.
 *
 * Si KLAVIYO_PRIVATE_KEY n'est pas configuré, les events sont juste loggés
 * (pas de bruit en dev). En production, posts vers a.klaviyo.com/api/events.
 *
 * Events à tracker (CLAUDE.md §11.5) :
 *   - Viewed Product, Added to Cart, Started Checkout, Placed Order, Fulfilled Order
 *
 * Sprint 4 : ajouter helper queue + retry pour les events critiques.
 */

interface KlaviyoEventInput {
  email?: string;
  customerId?: string;
  properties?: Record<string, unknown>;
}

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_API_REVISION = '2024-10-15';

export async function trackEvent(eventName: string, input: KlaviyoEventInput): Promise<void> {
  const apiKey = process.env.KLAVIYO_PRIVATE_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[klaviyo] (skip — no key) ${eventName}`, input);
    }
    return;
  }
  if (!input.email && !input.customerId) {
    console.warn(`[klaviyo] ${eventName} skipped — no identifier`);
    return;
  }
  try {
    const res = await fetch(`${KLAVIYO_API_BASE}/events/`, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        revision: KLAVIYO_API_REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            properties: input.properties ?? {},
            metric: { data: { type: 'metric', attributes: { name: eventName } } },
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  ...(input.email ? { email: input.email } : {}),
                  ...(input.customerId ? { external_id: input.customerId } : {}),
                },
              },
            },
          },
        },
      }),
    });
    if (!res.ok) {
      console.warn(`[klaviyo] ${eventName} returned ${res.status}`);
    }
  } catch (err) {
    // Ne jamais throw — analytics ne doit pas casser le flow business.
    console.warn(`[klaviyo] ${eventName} failed:`, (err as Error).message);
  }
}

export async function subscribeToList(email: string, listId?: string): Promise<void> {
  const apiKey = process.env.KLAVIYO_PRIVATE_KEY;
  const targetList = listId ?? process.env.KLAVIYO_DEFAULT_LIST_ID;
  if (!apiKey || !targetList) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[klaviyo] subscribe skipped (missing key or list)', { email });
    }
    return;
  }
  try {
    await fetch(`${KLAVIYO_API_BASE}/profile-subscription-bulk-create-jobs/`, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        revision: KLAVIYO_API_REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                    subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                  },
                },
              ],
            },
          },
          relationships: { list: { data: { type: 'list', id: targetList } } },
        },
      }),
    });
  } catch (err) {
    console.warn('[klaviyo] subscribe failed:', (err as Error).message);
  }
}
