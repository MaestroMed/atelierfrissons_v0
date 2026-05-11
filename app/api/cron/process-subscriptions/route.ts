import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Cron quotidien — traitement des abonnements Box Mensuelle.
 *
 * Schedule recommandé : tous les jours à 03:00 UTC (cf. `vercel.json` ou
 * GitHub Actions cron). Sur Vercel : ajouter au `crons` array dans
 * `vercel.json` :
 *   ```
 *   {
 *     "crons": [{
 *       "path": "/api/cron/process-subscriptions",
 *       "schedule": "0 3 * * *"
 *     }]
 *   }
 *   ```
 *
 * Workflow :
 *   1. Authent : header `Authorization: Bearer ${CRON_SECRET}`
 *      (Vercel injecte automatiquement, ailleurs : à configurer)
 *   2. Pour chaque abonnement actif :
 *      a. Vérifier next_charge_at <= NOW (la box doit être facturée)
 *      b. Vérifier que pas en pause / skip
 *      c. Composer la box (cf. lib/subscriptions/composer.ts à créer)
 *      d. CCBill DataLink renewSubscription (déclenche webhook async)
 *      e. INSERT subscription_shipment status='pending'
 *      f. Klaviyo event "Renewed Subscription"
 *   3. Pour chaque abonnement paused dont paused_until <= NOW :
 *      → reprendre automatiquement (status='active')
 *   4. Logger les exceptions sans bloquer le run (audit + Sentry)
 *
 * **État** : skeleton avec logs + structure de réponse JSON pour debug.
 */

interface CronResult {
  ok: boolean;
  startedAt: string;
  durationMs: number;
  processed: {
    subscriptionsBilled: number;
    subscriptionsAutoResumed: number;
    skippedFromPause: number;
    errors: number;
  };
  errors: ReadonlyArray<{ subscriptionId: string; reason: string }>;
}

export async function GET(request: Request): Promise<NextResponse<CronResult>> {
  // ── 1) Auth check ────────────────────────────────────────────────
  const authError = checkCronAuth(request);
  if (authError) {
    return NextResponse.json(authError as never, { status: 401 });
  }

  const start = Date.now();
  const errors: Array<{ subscriptionId: string; reason: string }> = [];

  // ── 2) TODO : SELECT subscriptions à traiter ──────────────────────
  //   - Subscriptions à renouveler :
  //     SELECT * FROM subscriptions
  //     WHERE status = 'active' AND next_charge_at <= NOW()
  //   - Subscriptions à reprendre auto :
  //     SELECT * FROM subscriptions
  //     WHERE status = 'paused' AND paused_until <= NOW()
  //
  // Pour chacune, appeler `processSubscription(sub)` qui :
  //   - Compose la box du mois (3-5 produits selon plan)
  //   - Insert subscription_shipments (pending)
  //   - CCBill DataLink renew → trigger webhook
  //   - Klaviyo event
  //   - Si erreur : push dans `errors`, ne pas throw

  const result: CronResult = {
    ok: true,
    startedAt: new Date(start).toISOString(),
    durationMs: Date.now() - start,
    processed: {
      subscriptionsBilled: 0,
      subscriptionsAutoResumed: 0,
      skippedFromPause: 0,
      errors: errors.length,
    },
    errors,
  };

  console.info('[cron/process-subscriptions]', JSON.stringify(result));
  return NextResponse.json(result);
}

/**
 * Vérifie que la requête vient bien de Vercel Cron (ou un caller authentifié
 * en dev avec ?secret=).
 *
 * Vercel Cron envoie `Authorization: Bearer ${CRON_SECRET}` automatiquement
 * si la variable d'env est définie au projet.
 */
function checkCronAuth(request: Request): { ok: false; error: string } | null {
  const expected = process.env['CRON_SECRET'];
  if (!expected) {
    // En dev sans secret : on log mais on autorise (utile pour curl local)
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('[cron] CRON_SECRET non défini — auth bypass DEV');
      return null;
    }
    return { ok: false, error: 'CRON_SECRET not configured' };
  }

  const headerAuth = request.headers.get('authorization');
  if (headerAuth === `Bearer ${expected}`) return null;

  // Fallback : ?secret=... pour les appels manuels (admin debug)
  const url = new URL(request.url);
  const queryAuth = url.searchParams.get('secret');
  if (queryAuth && queryAuth === expected) return null;

  return { ok: false, error: 'Unauthorized' };
}
