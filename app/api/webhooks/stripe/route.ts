import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook handler — `/api/webhooks/stripe`.
 *
 * Reçoit les événements Stripe (catégories soft : cosmétique, accessoires).
 * Évents principaux :
 *   - checkout.session.completed   (Checkout Sessions)
 *   - payment_intent.succeeded
 *   - payment_intent.payment_failed
 *   - charge.refunded
 *   - customer.subscription.deleted (si on utilisait Stripe Subscriptions —
 *     mais on préfère CCBill pour le recurring)
 *
 * Signature : Stripe envoie `Stripe-Signature` en `t=...,v1=...`.
 * On peut utiliser le SDK `stripe` officiel `webhooks.constructEvent` ou
 * vérifier manuellement (ce qu'on fait ici pour rester sans dep).
 *
 * Idempotency : `event.id` Stripe est unique. Stripe peut retry jusqu'à 3
 * jours en cas de 5xx — il faut absolument dédupliquer.
 */
export async function POST(request: Request) {
  const secret = process.env['STRIPE_WEBHOOK_SECRET'];
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook handler not configured', psp: 'stripe' },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get('stripe-signature');
  if (!signatureHeader) {
    return NextResponse.json(
      { error: 'Missing Stripe-Signature header' },
      { status: 401 },
    );
  }

  if (!verifyStripeSignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (await checkIdempotency(event.id)) {
    return NextResponse.json({ ok: true, status: 'already_processed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event);
        break;
      case 'charge.refunded':
        await handleRefund(event);
        break;
      default:
        // Stripe envoie beaucoup d'events qu'on ignore (charge.created, etc.)
        // — on log seulement pour debug
        console.debug('[stripe webhook] Ignored event type:', event.type);
    }

    await markProcessed(event.id);
    return NextResponse.json({ ok: true, eventId: event.id });
  } catch (error) {
    console.error('[stripe webhook] Handler failure:', error);
    return NextResponse.json(
      { error: 'Handler failure — Stripe will retry' },
      { status: 500 },
    );
  }
}

/**
 * Stripe-Signature header format : `t=<timestamp>,v1=<signature>,v0=<legacy>`
 * Signature : HMAC-SHA256 de `<timestamp>.<rawBody>` avec le webhook secret.
 * Tolérance temporelle : 5 minutes max pour éviter les replays.
 */
function verifyStripeSignature(rawBody: string, header: string, secret: string): boolean {
  try {
    const parts = header.split(',').reduce<Record<string, string>>((acc, kv) => {
      const [key, val] = kv.split('=');
      if (key && val) acc[key] = val;
      return acc;
    }, {});
    const ts = parts['t'];
    const v1 = parts['v1'];
    if (!ts || !v1) return false;

    // Tolérance 5 min (anti-replay)
    const tsNum = Number(ts);
    if (Number.isNaN(tsNum)) return false;
    const ageSeconds = Math.abs(Date.now() / 1000 - tsNum);
    if (ageSeconds > 300) return false;

    const signedPayload = `${ts}.${rawBody}`;
    const expected = createHmac('sha256', secret).update(signedPayload).digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(v1, 'hex');
    if (expectedBuf.length !== actualBuf.length) return false;
    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

interface StripeEvent {
  id: string;
  type: string;
  created: number;
  data: { object: Record<string, unknown> };
}

async function handlePaymentSuccess(event: StripeEvent): Promise<void> {
  // TODO P2 : update order paid, trigger fulfilment, Klaviyo "Placed Order"
  console.info('[stripe] PaymentSuccess', event.id);
}

async function handlePaymentFailed(event: StripeEvent): Promise<void> {
  console.info('[stripe] PaymentFailed', event.id);
}

async function handleRefund(event: StripeEvent): Promise<void> {
  console.info('[stripe] Refund', event.id);
}

const processedIds = new Set<string>();

async function checkIdempotency(eventId: string): Promise<boolean> {
  return processedIds.has(eventId);
}

async function markProcessed(eventId: string): Promise<void> {
  processedIds.add(eventId);
}
