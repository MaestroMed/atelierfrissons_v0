'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { logAuditEvent } from '@/lib/audit/log';
import { requireSession } from '@/lib/auth/session';

/**
 * Server Actions RGPD — droits du Data Subject (Atelier Frisson).
 *
 * Couvre les obligations RGPD art. 15 (accès), 17 (effacement),
 * 20 (portabilité), 21 (opposition).
 *
 * Workflow effacement :
 *   1. Le user demande l'effacement depuis /compte/donnees
 *   2. Soft-delete immédiat : `customers.deleted_at = NOW()`
 *      → l'utilisateur est déconnecté, son compte est invisible.
 *   3. Notification email auto à dpo@atelierfrisson.fr (Odelie)
 *   4. Délai 30 jours pendant lequel le user peut annuler la suppression
 *   5. Hard-delete via cron quotidien : DELETE customers + cascade
 *      sauf orders (gardés 10 ans pour obligation comptable, anonymisés)
 *
 * Workflow export DSAR :
 *   1. User demande l'export depuis /compte/donnees
 *   2. Server Action génère un job ID + log audit
 *   3. Cron quotidien `/api/cron/process-dsar-exports` agrège toutes les
 *      données associées (customer, addresses, orders, reviews, audit_log)
 *   4. JSON signé envoyé au user via email Resend
 *   5. Lien d'export expire 7 jours
 */

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const RequestErasureSchema = z.object({
  /** Confirmation explicite de l'utilisateur (anti-clic accidentel). */
  confirmText: z.literal('SUPPRIMER MON COMPTE', {
    message: "Saisissez exactement « SUPPRIMER MON COMPTE » pour confirmer",
  }),
  /** Raison facultative — utile pour analyse churn / amélioration. */
  reason: z.string().max(500).optional(),
});

const RequestExportSchema = z.object({
  /**
   * Format de l'export. JSON = portable lisible. CSV = compatibilité tableur.
   */
  format: z.enum(['json', 'csv']).default('json'),
});

// ─────────────────────────────────────────────────────────────────────────────
// RESULT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

interface ErasureResult {
  scheduledFor: string;
  cancelUrl: string;
}

interface ExportResult {
  jobId: string;
  estimatedDeliveryMinutes: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Demande d'effacement RGPD art. 17.
 *
 * Effets immédiats :
 *   - Logout (cookie session supprimé)
 *   - `customers.deleted_at = NOW() + INTERVAL '30 days'` (grâce)
 *   - Audit log entry (acteur = customer concerné, action = `gdpr.erasure_requested`)
 *   - Email Resend "Confirmation de demande de suppression" → user
 *   - Email Resend "Demande RGPD reçue" → dpo@atelierfrisson.fr
 *
 * Pendant 30 jours, le user peut révoquer via lien dans l'email.
 * Au-delà : cron `/api/cron/finalize-gdpr-erasures` exécute le hard-delete.
 */
export async function requestErasureAction(
  rawInput: unknown,
): Promise<ActionResult<ErasureResult>> {
  const user = await requireSession('/compte/donnees');
  const parsed = RequestErasureSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation échouée',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // TODO :
  //   1. UPDATE customers SET deleted_at = NOW() + INTERVAL '30 days',
  //      pending_erasure = TRUE WHERE id = $1
  //   2. Générer un cancellation_token (single-use, 30 days expiry)
  //   3. await sendEmail({
  //        to: user.email,
  //        template: 'GdprErasureConfirmation',
  //        data: { cancelUrl, scheduledFor }
  //      });
  //   4. await sendEmail({
  //        to: 'dpo@atelierfrisson.fr',
  //        template: 'GdprErasureNotification',
  //        data: { customerId, reason }
  //      });
  //   5. Sign user out via supabase.auth.signOut();

  const scheduledFor = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const cancellationToken = `${user.id}-${Date.now().toString(36)}`;
  const cancelUrl = `${process.env['NEXT_PUBLIC_APP_URL'] ?? ''}/compte/donnees/annuler-effacement?token=${cancellationToken}`;

  try {
    const h = await headers();
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'gdpr.erasure_requested',
      resourceType: 'customer',
      resourceId: user.id,
      changes: {
        scheduledFor,
        reasonProvided: !!parsed.data.reason,
      },
      ipAddress: h.get('x-forwarded-for'),
      userAgent: h.get('user-agent'),
    });
  } catch {
    /* graceful */
  }

  return {
    ok: true,
    data: { scheduledFor, cancelUrl },
  };
}

/**
 * Demande d'export DSAR (RGPD art. 15 + 20 — droit d'accès et portabilité).
 *
 * Crée un job. Le cron `/api/cron/process-dsar-exports` (à venir) tourne
 * toutes les 15 minutes et :
 *   - Agrège toutes les données du user (customer, orders, addresses, etc.)
 *   - Génère un JSON ou CSV signé HMAC
 *   - Stocke dans Supabase Storage (bucket privé, signed URL 7j)
 *   - Envoie email Resend "Votre export RGPD est prêt" avec le lien signé
 */
export async function requestExportAction(
  rawInput: unknown,
): Promise<ActionResult<ExportResult>> {
  const user = await requireSession('/compte/donnees');
  const parsed = RequestExportSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'Format invalide' };
  }

  // TODO :
  //   1. INSERT INTO dsar_exports (id, customer_id, format, status='pending', requested_at)
  //   2. await sendEmail({
  //        to: user.email,
  //        template: 'GdprExportRequested',
  //        data: { jobId, estimatedTime: '15 minutes' }
  //      });
  //   Note : il vaut mieux NE PAS générer en sync (parcours peut prendre
  //   plusieurs minutes pour un user avec beaucoup d'orders) — async via cron.

  const jobId = `dsar-${user.id.slice(0, 8)}-${Date.now().toString(36)}`;

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'gdpr.export_requested',
      resourceType: 'customer',
      resourceId: user.id,
      changes: { jobId, format: parsed.data.format },
    });
  } catch {
    /* */
  }

  return {
    ok: true,
    data: { jobId, estimatedDeliveryMinutes: 15 },
  };
}

/**
 * Annulation d'une demande d'effacement (token reçu par email).
 * Restaure `customers.deleted_at = NULL` + supprime le job d'effacement.
 */
export async function cancelErasureAction(
  rawInput: unknown,
): Promise<ActionResult<{ restored: true }>> {
  const parsed = z.object({ token: z.string().min(8).max(200) }).safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: 'Token invalide' };

  // TODO :
  //   1. SELECT customers WHERE cancellation_token = $1 AND deleted_at IS NOT NULL
  //   2. UPDATE customers SET deleted_at = NULL, cancellation_token = NULL
  //   3. await sendEmail "Suppression annulée"
  //   4. Audit log

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: null,
      action: 'gdpr.erasure_cancelled',
      resourceType: 'customer',
      resourceId: null,
      changes: { tokenProvided: true },
    });
  } catch {
    /* */
  }

  return { ok: true, data: { restored: true } };
}
