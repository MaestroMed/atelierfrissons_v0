import 'server-only';
import { db } from '@/lib/db';
import { auditLog } from '@/lib/db/schema';

/** Type Drizzle inféré de la table `audit_log` (export de schema). */
export type AuditLogRow = typeof auditLog.$inferSelect;

/**
 * Audit log centralisé — toutes les mutations sensibles passent ici.
 *
 * Comportement graceful : si la DB n'est pas configurée (`DATABASE_URL`
 * absent), on log côté serveur en `console.info` pour conserver une trace
 * en dev sans planter. En prod la table `audit_log` reçoit toutes les
 * entrées (RLS owner-only en lecture).
 *
 * Usage typique :
 *   await logAuditEvent({
 *     actorId: session.user.id,
 *     actorType: 'admin',
 *     action: 'product.update',
 *     resourceType: 'product',
 *     resourceId: product.id,
 *     changes: { before: oldData, after: newData },
 *     ipAddress: req.headers.get('x-forwarded-for'),
 *     userAgent: req.headers.get('user-agent'),
 *   });
 */

export type ActorType = 'admin' | 'customer' | 'system' | 'anonymous';

export interface AuditEventInput {
  /** UUID de l'acteur (admin_users.id, customers.id, ou null pour system/anonymous). */
  actorId?: string | null;
  actorType: ActorType;
  /** Action en notation point : `product.update`, `order.refund`, `auth.login`. */
  action: string;
  /** Type de ressource ciblée : `product`, `order`, `customer`, `forge_page`. */
  resourceType: string;
  /** UUID de la ressource. */
  resourceId?: string | null;
  /** Détails de la modification (before/after, ou payload partiel). */
  changes?: Record<string, unknown> | null;
  /** Métadonnées contextuelles (IP, user-agent, etc.). */
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Persist un événement d'audit. Ne lève jamais — on ne veut pas qu'une
 * erreur de log fasse échouer la mutation principale.
 */
export async function logAuditEvent(event: AuditEventInput): Promise<void> {
  // Sans DB, on log en console pour garder la trace en dev
  if (!process.env.DATABASE_URL) {
    console.info('[audit]', {
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      actorType: event.actorType,
      actorId: event.actorId,
      changes: event.changes,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    await db.insert(auditLog).values({
      actorId: event.actorId ?? null,
      actorType: event.actorType,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId ?? null,
      changes: event.changes ?? null,
      ipAddress: event.ipAddress ?? null,
      userAgent: event.userAgent ?? null,
    });
  } catch (err) {
    // Ne casse pas le flow principal — on log l'échec et on continue.
    // Sentry capturera ces erreurs en prod (Sprint 8).
    console.error('[audit] insert failed:', err, { event });
  }
}
