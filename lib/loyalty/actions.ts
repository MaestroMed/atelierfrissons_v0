'use server';

import { z } from 'zod';
import { logAuditEvent } from '@/lib/audit/log';
import { requireSession } from '@/lib/auth/session';
import {
  LOYALTY_RATE_REDEEM,
  LOYALTY_MIN_REDEEM,
  LOYALTY_EXPIRY_MONTHS,
} from './constants';

/**
 * Server Actions — Programme fidélité Atelier Frisson.
 *
 * Mécanique :
 *   - 1 € dépensé = 1 point gagné (à la livraison effective + délai retour 14j)
 *   - 100 points = 5 € de remise (taux 5 %)
 *   - Points expirent 12 mois après attribution (CGV)
 *   - Anniversaire : +50 points bonus
 *   - Avis publié : +20 points bonus
 *   - Parrainage abouti : +200 points bonus (équivalent 10 €)
 *
 * Table Drizzle : `loyalty_points_transactions` (event-sourcing — chaque
 * mutation est une row, le solde est la somme courante).
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES MÉTIER → voir `./constants.ts` (extraites pour respecter la
// contrainte Next 16 `'use server';` = exports = async functions uniquement).
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const ApplyPointsSchema = z.object({
  /** Nombre de points à utiliser sur la commande courante. */
  points: z
    .number()
    .int()
    .min(LOYALTY_MIN_REDEEM, `Minimum ${LOYALTY_MIN_REDEEM} points pour utiliser`)
    .max(20000, 'Maximum 20 000 points par commande'),
});

// ─────────────────────────────────────────────────────────────────────────────
// RESULT TYPES
// ─────────────────────────────────────────────────────────────────────────────

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface BalanceResult {
  totalPoints: number;
  /** Valeur en cents si tous les points étaient utilisés. */
  estimatedValueCents: number;
  /** Nombre de points qui expirent dans les 30 prochains jours. */
  expiringSoonPoints: number;
  /** Date d'expiration des points expirant le plus tôt. */
  nextExpiryDate: string | null;
}

interface TransactionRow {
  id: string;
  points: number;
  reason: string;
  notes: string | null;
  balanceAfter: number;
  expiresAt: string | null;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lit le solde de points de fidélité du user courant.
 *
 * Le solde = sum des `points` (positifs et négatifs) sur
 * `loyalty_points_transactions WHERE customer_id = $user`.
 */
export async function getLoyaltyBalanceAction(): Promise<ActionResult<BalanceResult>> {
  const user = await requireSession('/compte/fidelite');

  // TODO : SELECT
  //   COALESCE(SUM(points), 0) AS total,
  //   COALESCE(SUM(points) FILTER (
  //     WHERE points > 0 AND expires_at < NOW() + INTERVAL '30 days'
  //   ), 0) AS expiring_soon,
  //   MIN(expires_at) FILTER (WHERE points > 0 AND expires_at > NOW()) AS next_expiry
  // FROM loyalty_points_transactions WHERE customer_id = $1

  // Stub déterministe basé sur user
  const seed = parseInt(user.id.replace(/[^0-9]/g, '').slice(0, 4) || '0', 10);
  const totalPoints = (seed % 8) * 50 + 120;
  const expiringSoonPoints = totalPoints > 200 ? 30 : 0;
  const estimatedValueCents = Math.round(totalPoints * LOYALTY_RATE_REDEEM * 100);
  const nextExpiry = new Date();
  nextExpiry.setMonth(nextExpiry.getMonth() + 8);

  return {
    ok: true,
    data: {
      totalPoints,
      estimatedValueCents,
      expiringSoonPoints,
      nextExpiryDate: nextExpiry.toISOString(),
    },
  };
}

/**
 * Lit les 20 dernières transactions points du user.
 * Utilisé sur /compte/fidelite pour afficher l'historique.
 */
export async function getLoyaltyHistoryAction(): Promise<ActionResult<readonly TransactionRow[]>> {
  const user = await requireSession('/compte/fidelite');

  // TODO : SELECT * FROM loyalty_points_transactions
  // WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 20

  // Stub : 5 transactions plausibles
  const now = new Date();
  const stub: TransactionRow[] = [
    {
      id: '01',
      points: 169,
      reason: 'order_earned',
      notes: 'Commande AF-2026-001245 — Velours',
      balanceAfter: 169,
      expiresAt: addMonths(now, LOYALTY_EXPIRY_MONTHS).toISOString(),
      createdAt: addDays(now, -45).toISOString(),
    },
    {
      id: '02',
      points: 50,
      reason: 'birthday_bonus',
      notes: 'Cadeau anniversaire',
      balanceAfter: 219,
      expiresAt: addMonths(now, LOYALTY_EXPIRY_MONTHS).toISOString(),
      createdAt: addDays(now, -30).toISOString(),
    },
    {
      id: '03',
      points: 20,
      reason: 'review_bonus',
      notes: 'Avis publié sur Velours',
      balanceAfter: 239,
      expiresAt: addMonths(now, LOYALTY_EXPIRY_MONTHS).toISOString(),
      createdAt: addDays(now, -25).toISOString(),
    },
    {
      id: '04',
      points: -100,
      reason: 'order_redeemed',
      notes: 'Commande AF-2026-001312 — −5 €',
      balanceAfter: 139,
      expiresAt: null,
      createdAt: addDays(now, -10).toISOString(),
    },
    {
      id: '05',
      points: 89,
      reason: 'order_earned',
      notes: 'Commande AF-2026-001312 — Sillage',
      balanceAfter: 228,
      expiresAt: addMonths(now, LOYALTY_EXPIRY_MONTHS).toISOString(),
      createdAt: addDays(now, -3).toISOString(),
    },
  ];

  // Inutile pour la stub : le user n'est utilisé qu'à l'auth check
  void user;

  return { ok: true, data: stub.reverse() };
}

/**
 * Applique N points au panier courant du user (en attendant le checkout).
 *
 * Validations :
 *   - User authentifié
 *   - points >= LOYALTY_MIN_REDEEM
 *   - points <= solde courant
 *   - points <= max applicable selon total panier (max 20% du sous-total)
 */
export async function applyLoyaltyPointsAction(
  rawInput: unknown,
): Promise<ActionResult<{ pointsApplied: number; discountCents: number }>> {
  const user = await requireSession('/checkout');
  const parsed = ApplyPointsSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Input invalide' };
  }

  // TODO :
  //   1. Lire balance courante via getLoyaltyBalanceAction
  //   2. Vérifier points <= balance
  //   3. Lire cart courant — vérifier points * REDEEM_RATE * 100 <= 0.20 * cart.subtotal
  //      (max 20 % du panier en points)
  //   4. UPDATE carts SET loyalty_points_applied = $points
  //   5. Le checkout finalisera : INSERT INTO loyalty_points_transactions
  //      (customer_id, points = -$points, reason='order_redeemed', order_id, balance_after)

  const discountCents = Math.round(parsed.data.points * LOYALTY_RATE_REDEEM * 100);

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'loyalty.points_applied_to_cart',
      resourceType: 'cart',
      resourceId: null,
      changes: {
        pointsApplied: parsed.data.points,
        discountCents,
      },
    });
  } catch {
    /* */
  }

  return {
    ok: true,
    data: { pointsApplied: parsed.data.points, discountCents },
  };
}

/**
 * Crédite des points de fidélité au customer (appelé en interne par les
 * webhooks PSP `payment.success` ou par les crons bonus / parrainage).
 *
 * Idempotent : si une transaction existe déjà pour `(customer_id, order_id, reason)`,
 * on ne re-crédite pas. À implémenter avec contrainte unique DB.
 */
export async function awardLoyaltyPointsAction(input: {
  customerId: string;
  points: number;
  reason:
    | 'order_earned'
    | 'referral_bonus'
    | 'birthday_bonus'
    | 'review_bonus'
    | 'admin_adjustment';
  orderId?: string | null;
  notes?: string;
}): Promise<ActionResult<{ newBalance: number }>> {
  if (input.points <= 0) {
    return { ok: false, error: 'Le crédit de points doit être positif' };
  }
  if (input.points > 5000) {
    return {
      ok: false,
      error: 'Crédit > 5000 points : nécessite admin_adjustment manuel',
    };
  }

  // TODO :
  //   1. SELECT COALESCE(SUM(points), 0) FROM loyalty_points_transactions
  //      WHERE customer_id = $1
  //   2. INSERT INTO loyalty_points_transactions (
  //        customer_id, points, reason, order_id, balance_after, expires_at
  //      ) VALUES (
  //        $1, $2, $3, $4, $1+balance_currently, NOW() + INTERVAL '12 months'
  //      ) ON CONFLICT (customer_id, order_id, reason) DO NOTHING
  //   3. Klaviyo event `Loyalty Points Earned` (avec montant + raison)

  try {
    await logAuditEvent({
      actorType: 'system',
      actorId: null,
      action: 'loyalty.points_awarded',
      resourceType: 'customer',
      resourceId: input.customerId,
      changes: {
        points: input.points,
        reason: input.reason,
        orderId: input.orderId ?? null,
        notes: input.notes ?? null,
      },
    });
  } catch {
    /* */
  }

  return { ok: true, data: { newBalance: 0 /* TODO: lire balance + points */ } };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
