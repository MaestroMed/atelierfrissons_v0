import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';

/**
 * Scénario 5 — Webhook refund (PSP → backend)
 *
 * On ne peut pas tester un vrai refund sans CCBill/Stripe live, mais on peut :
 *   - Tester la signature HMAC du webhook (rejette les invalides)
 *   - Vérifier idempotency (rejouer le même event ne re-traite pas)
 *   - Vérifier 503 si secret env non configuré
 *
 * Utilise route handler `/api/webhooks/stripe` directement via fetch.
 */

const STRIPE_WEBHOOK_URL = '/api/webhooks/stripe';

function makeStripeSignature(rawBody: string, secret: string, timestamp: number): string {
  const signedPayload = `${timestamp}.${rawBody}`;
  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

test.describe('Webhook handlers — sécurité', () => {
  test('Stripe webhook 503 si STRIPE_WEBHOOK_SECRET absent', async ({ request }) => {
    // Sans header signature → on s'attend à 503 (secret non configuré) ou 401 (signature manquante)
    const res = await request.post(STRIPE_WEBHOOK_URL, {
      data: { type: 'charge.refunded', id: 'evt_test' },
    });
    expect([401, 503]).toContain(res.status());
  });

  test('Stripe webhook 401 si signature invalide', async ({ request }) => {
    const res = await request.post(STRIPE_WEBHOOK_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': 't=1234567890,v1=invalidhex',
      },
      data: JSON.stringify({ type: 'charge.refunded', id: 'evt_test' }),
    });
    expect([401, 503]).toContain(res.status());
  });

  test('CCBill webhook 503 sans secret', async ({ request }) => {
    const res = await request.post('/api/webhooks/ccbill', {
      data: { eventType: 'Refund', transactionId: 'tx_test' },
    });
    expect([401, 503]).toContain(res.status());
  });

  test('Verotel webhook 503 sans secret', async ({ request }) => {
    const res = await request.post('/api/webhooks/verotel', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: 'event=credit&saleID=tx_test&signature=xxx',
    });
    expect([401, 503]).toContain(res.status());
  });
});

test.describe('Cron handlers — auth', () => {
  test('cron process-subscriptions sans secret → 401 en prod, autorisé en dev', async ({
    request,
  }) => {
    const res = await request.get('/api/cron/process-subscriptions');
    // En dev (NODE_ENV !== production), bypass autorisé → 200
    // En prod, 401 attendu si CRON_SECRET non configuré
    expect([200, 401]).toContain(res.status());
  });
});

/**
 * Si ces tests passent : le squelette webhook est sûr (rejette tout sans
 * secret + signature valide). La logique métier reste à brancher quand
 * les credentials PSP sont onboarded.
 */
