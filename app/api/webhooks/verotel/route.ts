import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verotel webhook handler — `/api/webhooks/verotel`.
 *
 * Verotel est notre PSP **backup** pour les commandes high-risk en cas de
 * panne ou refus CCBill. Active dès que `VEROTEL_WEBHOOK_SECRET` est défini.
 *
 * Verotel utilise FlexPay et envoie les événements en POST avec un paramètre
 * `signature` calculé en MD5 (oui, MD5 — c'est l'ancien protocole Verotel)
 * sur la concatération secret + paramètres triés.
 *
 * Évents :
 *   - approved        (paiement OK)
 *   - denied          (paiement refusé)
 *   - rebill          (recurring billing)
 *   - cancel          (annulation abonnement)
 *   - chargeback
 *   - credit          (refund)
 */
export async function POST(request: Request) {
  const secret = process.env['VEROTEL_WEBHOOK_SECRET'];
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook handler not configured', psp: 'verotel' },
      { status: 503 },
    );
  }

  // Verotel envoie en application/x-www-form-urlencoded
  let formData: URLSearchParams;
  try {
    const text = await request.text();
    formData = new URLSearchParams(text);
  } catch {
    return NextResponse.json({ error: 'Invalid form payload' }, { status: 400 });
  }

  const signature = formData.get('signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature parameter' }, { status: 401 });
  }

  if (!verifyVerotelSignature(formData, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event: VerotelEvent = {
    eventType: formData.get('event') ?? '',
    saleId: formData.get('saleID') ?? '',
    referenceId: formData.get('referenceID') ?? '',
    subscriptionId: formData.get('subscriptionID') ?? null,
    customerEmail: formData.get('email') ?? null,
    amount: formData.get('amount') ?? null,
    currency: formData.get('currency') ?? null,
  };

  if (!event.saleId) {
    return NextResponse.json({ error: 'Missing saleID' }, { status: 400 });
  }

  if (await checkIdempotency(event.saleId)) {
    return NextResponse.json({ ok: true, status: 'already_processed' });
  }

  try {
    switch (event.eventType) {
      case 'approved':
        await handleApproved(event);
        break;
      case 'denied':
        await handleDenied(event);
        break;
      case 'rebill':
        await handleRebill(event);
        break;
      case 'cancel':
        await handleCancel(event);
        break;
      case 'chargeback':
      case 'credit':
        await handleRefundOrChargeback(event);
        break;
      default:
        console.warn('[verotel webhook] Unknown event type:', event.eventType);
    }

    await markProcessed(event.saleId);
    return NextResponse.json({ ok: true, saleId: event.saleId });
  } catch (error) {
    console.error('[verotel webhook] Handler failure:', error);
    return NextResponse.json(
      { error: 'Handler failure — will retry' },
      { status: 500 },
    );
  }
}

/**
 * Verotel signature : MD5(secret + sorted_params_concat).
 * Les params sont triés alphabétiquement, concaténés en `key=value`,
 * sans le param `signature` lui-même.
 */
function verifyVerotelSignature(
  params: URLSearchParams,
  signature: string,
  secret: string,
): boolean {
  try {
    const entries: Array<[string, string]> = [];
    for (const [key, value] of params.entries()) {
      if (key !== 'signature') entries.push([key, value]);
    }
    entries.sort(([a], [b]) => a.localeCompare(b));
    const payload = secret + entries.map(([k, v]) => `${k}=${v}`).join('');
    const expected = createHash('md5').update(payload).digest('hex');
    return expected.toLowerCase() === signature.toLowerCase();
  } catch {
    return false;
  }
}

interface VerotelEvent {
  eventType: string;
  saleId: string;
  referenceId: string;
  subscriptionId: string | null;
  customerEmail: string | null;
  amount: string | null;
  currency: string | null;
}

async function handleApproved(event: VerotelEvent): Promise<void> {
  console.info('[verotel] Approved', event.saleId);
}

async function handleDenied(event: VerotelEvent): Promise<void> {
  console.info('[verotel] Denied', event.saleId);
}

async function handleRebill(event: VerotelEvent): Promise<void> {
  console.info('[verotel] Rebill', event.subscriptionId);
}

async function handleCancel(event: VerotelEvent): Promise<void> {
  console.info('[verotel] Cancel', event.subscriptionId);
}

async function handleRefundOrChargeback(event: VerotelEvent): Promise<void> {
  console.info('[verotel] Refund/Chargeback', event.saleId);
}

const processedIds = new Set<string>();

async function checkIdempotency(saleId: string): Promise<boolean> {
  return processedIds.has(saleId);
}

async function markProcessed(saleId: string): Promise<void> {
  processedIds.add(saleId);
}
