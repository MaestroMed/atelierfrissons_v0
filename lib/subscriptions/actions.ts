'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { logAuditEvent } from '@/lib/audit/log';
import { requireSession } from '@/lib/auth/session';

/**
 * Server Actions — Abonnements Box Mensuelle Atelier Frisson.
 *
 * Toutes les mutations passent par CCBill DataLink API (recurring billing).
 * Tables Drizzle : `subscriptions`, `subscription_plans`, `subscription_shipments`.
 *
 * Workflow CCBill :
 *   1. Action client → Server Action ici
 *   2. Server Action appelle CCBill DataLink (auth basic + signature)
 *   3. CCBill renvoie le statut → on update notre table
 *   4. CCBill envoie un webhook async → idempotency check + double-update OK
 *
 * **État (Sprint P2 du pivot)** : stubs avec lecture session.
 * Le binding CCBill DataLink est en TODO — clés env documentées dans
 * `lib/payments/router.ts` (REQUIRED_PAYMENT_ENV.ccbill).
 */

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS ZOD
// ─────────────────────────────────────────────────────────────────────────────

const SubscriptionIdSchema = z.string().uuid('ID abonnement invalide');

const PauseSchema = z.object({
  subscriptionId: SubscriptionIdSchema,
  /** Durée de pause en mois (1 → 12). NULL = pause indéfinie. */
  pauseMonths: z.number().int().min(1).max(12).nullable().default(1),
});

const SkipSchema = z.object({
  subscriptionId: SubscriptionIdSchema,
});

const CancelSchema = z.object({
  subscriptionId: SubscriptionIdSchema,
  /** Raison facultative (utile pour l'analyse churn + winback). */
  reason: z
    .enum([
      'too_expensive',
      'not_satisfied',
      'temporary_pause',
      'enough_for_now',
      'switching_plan',
      'other',
    ])
    .optional(),
  feedback: z.string().max(1000).optional(),
});

const ChangePlanSchema = z.object({
  subscriptionId: SubscriptionIdSchema,
  newPlanSlug: z.enum(['box-decouverte', 'box-premium', 'box-trio']),
});

// ─────────────────────────────────────────────────────────────────────────────
// RESULT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTIONS — gestion abonnements
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Met l'abonnement en pause N mois (ou indéfiniment si null).
 * CCBill DataLink : `chargebackByTransactionId` ne s'applique pas — on
 * utilise `pauseSubscription` (oui, le nom CCBill est cohérent).
 */
export async function pauseSubscriptionAction(
  rawInput: unknown,
): Promise<ActionResult<{ pausedUntil: string | null }>> {
  const user = await requireSession('/compte/abonnements');
  const parsed = PauseSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Input invalide' };
  }

  // TODO :
  //   1. SELECT subscription WHERE id = $1 AND customer_id = $user
  //      (RLS + check)
  //   2. CCBill DataLink call : POST /datalink/services/frontend.cgi
  //      ?action=pauseSubscription&subscriptionId=ccbill_id&pauseTime=N
  //   3. Si OK → UPDATE subscriptions SET status='paused', paused_until=...
  //   4. Trigger Klaviyo event `Subscription Paused` (pour winback ciblé)

  const pausedUntil =
    parsed.data.pauseMonths != null
      ? addMonths(new Date(), parsed.data.pauseMonths).toISOString()
      : null;

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'subscription.paused',
      resourceType: 'subscription',
      resourceId: parsed.data.subscriptionId,
      changes: { pauseMonths: parsed.data.pauseMonths, pausedUntil },
    });
  } catch {
    /* */
  }

  revalidatePath('/compte/abonnements');
  return { ok: true, data: { pausedUntil } };
}

/**
 * Reprend un abonnement précédemment mis en pause.
 * Le prochain prélèvement est calculé à J+30 du resume.
 */
export async function resumeSubscriptionAction(
  rawInput: unknown,
): Promise<ActionResult<{ nextChargeAt: string }>> {
  const user = await requireSession('/compte/abonnements');
  const parsed = z.object({ subscriptionId: SubscriptionIdSchema }).safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'ID abonnement invalide' };
  }

  // TODO : CCBill DataLink resumeSubscription + UPDATE subscriptions
  const nextChargeAt = addMonths(new Date(), 1).toISOString();

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'subscription.resumed',
      resourceType: 'subscription',
      resourceId: parsed.data.subscriptionId,
      changes: { nextChargeAt },
    });
  } catch {
    /* */
  }

  revalidatePath('/compte/abonnements');
  return { ok: true, data: { nextChargeAt } };
}

/**
 * Saute le mois courant — décale d'un mois sans annuler.
 * Spécifique : pas de prélèvement ce mois-ci, prochain à +60j au lieu de +30.
 */
export async function skipNextBoxAction(
  rawInput: unknown,
): Promise<ActionResult<{ nextChargeAt: string }>> {
  const user = await requireSession('/compte/abonnements');
  const parsed = SkipSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'ID abonnement invalide' };
  }

  // TODO :
  //   1. Vérifier que la prochaine box n'est pas déjà expédiée
  //      (next_charge_at - 48h doit être > NOW)
  //   2. CCBill DataLink updateNextBilling avec nouvelle date +30j
  //   3. INSERT INTO subscription_shipments avec status 'skipped'
  //      (pour traçabilité)

  const nextChargeAt = addMonths(new Date(), 2).toISOString();

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'subscription.skip_month',
      resourceType: 'subscription',
      resourceId: parsed.data.subscriptionId,
      changes: { nextChargeAt },
    });
  } catch {
    /* */
  }

  revalidatePath('/compte/abonnements');
  return { ok: true, data: { nextChargeAt } };
}

/**
 * Annule définitivement l'abonnement.
 *
 * Sans frais. La dernière box payée est expédiée normalement. Le statut
 * passe à 'cancelled' immédiatement, mais le service reste actif jusqu'à
 * end_of_billing_period.
 *
 * La raison est stockée pour analyse churn + déclencher l'email winback J+7.
 */
export async function cancelSubscriptionAction(
  rawInput: unknown,
): Promise<ActionResult<{ cancelledAt: string; serviceEndsAt: string }>> {
  const user = await requireSession('/compte/abonnements');
  const parsed = CancelSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Input invalide' };
  }

  // TODO :
  //   1. CCBill DataLink cancelSubscription
  //   2. UPDATE subscriptions SET status='cancelled', cancelled_at=NOW(),
  //      cancellation_reason=$, cancellation_feedback=$
  //   3. Trigger cron `winbackEmailJ7` (sera émis dans 7 jours)
  //   4. Klaviyo event `Subscription Cancelled` avec reason

  const cancelledAt = new Date().toISOString();
  const serviceEndsAt = addMonths(new Date(), 1).toISOString();

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'subscription.cancelled',
      resourceType: 'subscription',
      resourceId: parsed.data.subscriptionId,
      changes: {
        reason: parsed.data.reason ?? 'unspecified',
        feedbackProvided: !!parsed.data.feedback,
        cancelledAt,
        serviceEndsAt,
      },
    });
  } catch {
    /* */
  }

  revalidatePath('/compte/abonnements');
  return { ok: true, data: { cancelledAt, serviceEndsAt } };
}

/**
 * Change de plan (Découverte / Premium / Trio).
 *
 * Effet immédiat : le nouveau prix s'applique au prochain prélèvement.
 * Pas de prorata sur la box en cours.
 */
export async function changeSubscriptionPlanAction(
  rawInput: unknown,
): Promise<ActionResult<{ newPlanSlug: string; effectiveAt: string }>> {
  const user = await requireSession('/compte/abonnements');
  const parsed = ChangePlanSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'Plan invalide' };
  }

  // TODO :
  //   1. SELECT plan_id par slug
  //   2. CCBill DataLink updateSubscription avec nouveau price + period
  //   3. UPDATE subscriptions SET plan_id = $newPlanId

  const effectiveAt = addMonths(new Date(), 1).toISOString();

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'subscription.plan_changed',
      resourceType: 'subscription',
      resourceId: parsed.data.subscriptionId,
      changes: { newPlanSlug: parsed.data.newPlanSlug, effectiveAt },
    });
  } catch {
    /* */
  }

  revalidatePath('/compte/abonnements');
  return { ok: true, data: { newPlanSlug: parsed.data.newPlanSlug, effectiveAt } };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
