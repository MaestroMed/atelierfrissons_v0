import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Cron — relance des paniers abandonnés.
 *
 * Schedule recommandé : toutes les 4 heures (cron `0 *\/4 * * *`).
 * Cible : carts modifiés il y a 24h-48h, customer identifié (email connu),
 * pas encore de checkout terminé.
 *
 * Workflow :
 *   1. SELECT carts WHERE
 *        updated_at BETWEEN now() - 48h AND now() - 24h
 *        AND customer_id IS NOT NULL  (ou email connu via session)
 *        AND not converted (pas d'order avec ce cart_id)
 *        AND email_sent IS FALSE      (1 seul email par cart)
 *   2. Pour chacun :
 *      a. Vérifier que les produits du cart sont toujours en stock
 *      b. Construire le payload AbandonedCartEmail (items + total + URL)
 *      c. Resend.send avec template AbandonedCartEmail
 *      d. UPDATE carts SET email_sent_at = NOW()
 *      e. Klaviyo event 'Abandoned Cart' (en parallèle pour le flow)
 *   3. Si l'email Resend échoue : retry 1× après 60s, sinon log + skip
 *
 * Idempotency : `email_sent_at` non-null = on ne renvoie pas.
 */

interface CronResult {
  ok: boolean;
  startedAt: string;
  durationMs: number;
  processed: {
    cartsScanned: number;
    emailsSent: number;
    emailsFailed: number;
    cartsSkipped: number;
  };
  errors: ReadonlyArray<{ cartId: string; reason: string }>;
}

export async function GET(request: Request): Promise<NextResponse<CronResult>> {
  const authError = checkCronAuth(request);
  if (authError) {
    return NextResponse.json(authError as never, { status: 401 });
  }

  const start = Date.now();
  const errors: Array<{ cartId: string; reason: string }> = [];

  // TODO :
  //   const candidates = await db.select()
  //     .from(carts)
  //     .innerJoin(customers, eq(carts.customerId, customers.id))
  //     .where(and(
  //       gt(carts.updatedAt, sql`now() - interval '48 hours'`),
  //       lt(carts.updatedAt, sql`now() - interval '24 hours'`),
  //       isNull(carts.emailSentAt),
  //     ));
  //
  //   for (const cart of candidates) {
  //     try {
  //       const items = await loadCartItems(cart.id);
  //       const total = computeCartTotal(items);
  //       await sendEmail(AbandonedCartEmail, {
  //         to: cart.customerEmail,
  //         data: { items, totalCents: total, resumeUrl: `${SITE}/panier`, ... }
  //       });
  //       await db.update(carts).set({ emailSentAt: new Date() }).where(eq(carts.id, cart.id));
  //       await trackAbandonedCart({...});
  //     } catch (e) {
  //       errors.push({ cartId: cart.id, reason: (e as Error).message });
  //     }
  //   }

  const result: CronResult = {
    ok: true,
    startedAt: new Date(start).toISOString(),
    durationMs: Date.now() - start,
    processed: {
      cartsScanned: 0,
      emailsSent: 0,
      emailsFailed: errors.length,
      cartsSkipped: 0,
    },
    errors,
  };

  console.info('[cron/abandoned-carts]', JSON.stringify(result));
  return NextResponse.json(result);
}

function checkCronAuth(request: Request): { ok: false; error: string } | null {
  const expected = process.env['CRON_SECRET'];
  if (!expected) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('[cron] CRON_SECRET non défini — auth bypass DEV');
      return null;
    }
    return { ok: false, error: 'CRON_SECRET not configured' };
  }
  const headerAuth = request.headers.get('authorization');
  if (headerAuth === `Bearer ${expected}`) return null;
  const url = new URL(request.url);
  const queryAuth = url.searchParams.get('secret');
  if (queryAuth && queryAuth === expected) return null;
  return { ok: false, error: 'Unauthorized' };
}
