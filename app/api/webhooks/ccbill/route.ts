import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * CCBill webhook handler — `/api/webhooks/ccbill`.
 *
 * Reçoit les événements de CCBill DataLink + FlexForms :
 *   - NewSaleSuccess        (paiement initial réussi)
 *   - NewSaleFailure        (paiement initial refusé)
 *   - Renewal               (recurring billing — Box Mensuelle)
 *   - Cancellation          (annulation abonnement)
 *   - Chargeback            (chargeback bancaire)
 *   - Refund                (remboursement)
 *
 * Signature : CCBill envoie une signature HMAC-SHA256 dans l'en-tête
 * `X-CCBill-Signature` calculée sur le raw body avec `CCBILL_WEBHOOK_SECRET`.
 *
 * Idempotency : chaque event a un `transactionId` unique CCBill — à stocker
 * dans une table `webhook_events` pour éviter le double-traitement (retries
 * CCBill peuvent renvoyer le même event jusqu'à 5 fois).
 *
 * RGPD : pas de PII dans les logs, seulement transactionId + type d'event.
 *
 * **Stub mode** : si `CCBILL_WEBHOOK_SECRET` n'est pas défini, le handler
 * répond 503 — utile pour ne pas accepter de webhooks en dev / staging.
 */
export async function POST(request: Request) {
  const secret = process.env['CCBILL_WEBHOOK_SECRET'];
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook handler not configured', psp: 'ccbill' },
      { status: 503 },
    );
  }

  // ── 1) Lire le raw body pour la signature ──────────────────────────
  const rawBody = await request.text();
  const signatureHeader = request.headers.get('x-ccbill-signature');
  if (!signatureHeader) {
    return NextResponse.json(
      { error: 'Missing X-CCBill-Signature header' },
      { status: 401 },
    );
  }

  // ── 2) Vérifier la signature HMAC ──────────────────────────────────
  if (!verifyCCBillSignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── 3) Parser le payload ──────────────────────────────────────────
  let event: CCBillEvent;
  try {
    event = JSON.parse(rawBody) as CCBillEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // ── 4) Idempotency check (stub — à brancher sur table webhook_events) ─
  const isDuplicate = await checkIdempotency(event.transactionId);
  if (isDuplicate) {
    return NextResponse.json({ ok: true, status: 'already_processed' });
  }

  // ── 5) Router par type d'event ────────────────────────────────────
  try {
    switch (event.eventType) {
      case 'NewSaleSuccess':
        await handleNewSaleSuccess(event);
        break;
      case 'NewSaleFailure':
        await handleNewSaleFailure(event);
        break;
      case 'Renewal':
        await handleRenewal(event);
        break;
      case 'Cancellation':
        await handleCancellation(event);
        break;
      case 'Chargeback':
      case 'Refund':
        await handleRefundOrChargeback(event);
        break;
      default:
        console.warn('[ccbill webhook] Unknown event type:', event.eventType);
    }

    // ── 6) Marquer event traité (idempotency) ───────────────────────
    await markProcessed(event.transactionId);

    return NextResponse.json({ ok: true, transactionId: event.transactionId });
  } catch (error) {
    console.error('[ccbill webhook] Handler failure:', error);
    // CCBill réessaiera le webhook si on renvoie 5xx
    return NextResponse.json(
      { error: 'Handler failure — will retry' },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFICATION HMAC
// ─────────────────────────────────────────────────────────────────────────────

function verifyCCBillSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(signature, 'hex');
    if (expectedBuf.length !== actualBuf.length) return false;
    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface CCBillEvent {
  eventType:
    | 'NewSaleSuccess'
    | 'NewSaleFailure'
    | 'Renewal'
    | 'Cancellation'
    | 'Chargeback'
    | 'Refund';
  transactionId: string;
  subscriptionId?: string;
  customerEmail?: string;
  amount?: string;
  currency?: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLERS — stubs à compléter quand DB live + email Klaviyo branché
// ─────────────────────────────────────────────────────────────────────────────

async function handleNewSaleSuccess(event: CCBillEvent): Promise<void> {
  // TODO Sprint P2 :
  //   1. Trouver l'order via paymentIntentId = event.transactionId
  //   2. Mettre status à 'paid' + paidAt = now
  //   3. Enqueuer la création supplier_order (CJ)
  //   4. Trigger email Resend "confirmation commande"
  //   5. Track Pinterest checkout via server-side conversion API
  console.info('[ccbill] NewSaleSuccess', event.transactionId);
}

async function handleNewSaleFailure(event: CCBillEvent): Promise<void> {
  // TODO : update order status to 'cancelled', email "paiement refusé" + relance
  console.info('[ccbill] NewSaleFailure', event.transactionId);
}

async function handleRenewal(event: CCBillEvent): Promise<void> {
  // TODO : créer subscription_shipment + enqueue box composition + email
  console.info('[ccbill] Renewal', event.subscriptionId);
}

async function handleCancellation(event: CCBillEvent): Promise<void> {
  // TODO : update subscription status to 'cancelled', trigger winback email J+7
  console.info('[ccbill] Cancellation', event.subscriptionId);
}

async function handleRefundOrChargeback(event: CCBillEvent): Promise<void> {
  // TODO : update order status to 'refunded' / 'chargeback', alert admin
  console.info('[ccbill] Refund/Chargeback', event.transactionId);
}

// ─────────────────────────────────────────────────────────────────────────────
// IDEMPOTENCY (stub mémoire — remplacer par table DB en prod)
// ─────────────────────────────────────────────────────────────────────────────

const processedIds = new Set<string>();

async function checkIdempotency(transactionId: string): Promise<boolean> {
  return processedIds.has(transactionId);
}

async function markProcessed(transactionId: string): Promise<void> {
  processedIds.add(transactionId);
  // ⚠️ En prod : INSERT INTO webhook_events (psp, transaction_id, processed_at)
  // VALUES ('ccbill', $1, now()) ON CONFLICT DO NOTHING
  // — pour survivre aux redémarrages serveur.
}
