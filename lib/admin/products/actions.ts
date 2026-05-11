'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { productEditSchema, type ProductEditInput } from './schema';
import {
  updateProductById,
  getProductByIdAdmin,
  archiveProductById,
} from '@/lib/db/queries/admin-products';
import { logAuditEvent } from '@/lib/audit/log';
import { getSession } from '@/lib/auth/session';

/**
 * Server Actions admin — CRUD produit avec branchement Drizzle réel
 * + audit log + auth check.
 *
 * Comportement graceful :
 *   - Si DATABASE_URL absent : log la mutation en console.info via audit
 *     log (mode dev sans DB). UI reçoit `ok: true` pour permettre de
 *     tester le formulaire.
 *   - Si DATABASE_URL présent : UPDATE réel en DB + insert audit_log.
 *
 * Auth : passe par `getSession()` qui supporte le dev bypass mock user.
 * En production il faut vérifier que l'utilisateur est dans `admin_users`
 * — fait en Sprint 4 via middleware admin (cf. proxy.ts).
 */

export interface AdminActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  product?: ProductEditInput;
}

const DB_AVAILABLE = !!process.env.DATABASE_URL;

export async function updateProductAction(input: ProductEditInput): Promise<AdminActionResult> {
  const parsed = productEditSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.');
      if (path) fieldErrors[path] = issue.message;
    }
    return {
      ok: false,
      message: 'Vérifiez les champs du formulaire',
      fieldErrors,
    };
  }

  const data = parsed.data;
  const session = await getSession();
  const headersList = await headers();
  const ipAddress = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip');
  const userAgent = headersList.get('user-agent');

  // ── Mode DB réel ──────────────────────────────────────────────────
  if (DB_AVAILABLE) {
    try {
      // 1. Snapshot avant pour l'audit log
      const before = await getProductByIdAdmin(data.id);
      if (!before) {
        return {
          ok: false,
          message: 'Produit introuvable. Il a peut-être été supprimé.',
        };
      }

      // 2. UPDATE
      const after = await updateProductById(data.id, {
        slug: data.slug,
        name: data.name,
        nameShort: data.nameShort || null,
        tagline: data.tagline || null,
        descriptionShort: data.descriptionShort,
        descriptionLong: data.descriptionLong || null,
        descriptionEditorial: data.descriptionEditorial || null,
        priceCents: data.priceCents,
        compareAtPriceCents: data.compareAtPriceCents ?? null,
        stockQuantity: data.stockQuantity,
        stockStatus: data.stockStatus,
        lowStockThreshold: data.lowStockThreshold,
        collection: data.collection,
        status: data.status,
        isFeatured: data.isFeatured,
        tags: [...data.tags],
        features: [...data.features],
        specs: { ...data.specs },
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        seoKeywords: [...data.seoKeywords],
      });

      if (!after) {
        return {
          ok: false,
          message: 'Échec de la mise à jour en base.',
        };
      }

      // 3. Audit log (non-bloquant — n'attend pas)
      await logAuditEvent({
        actorId: session?.id ?? null,
        actorType: 'admin',
        action: 'product.update',
        resourceType: 'product',
        resourceId: data.id,
        changes: {
          before: pickAuditableFields(before),
          after: pickAuditableFields(after),
        },
        ipAddress,
        userAgent,
      });
    } catch (err) {
      console.error('[admin/products] update DB exception:', err);
      return {
        ok: false,
        message: 'Erreur serveur. Réessayez dans quelques secondes.',
      };
    }
  } else {
    // ── Mode dev sans DB : log + audit log via console ──────────────
    await logAuditEvent({
      actorId: session?.id ?? null,
      actorType: 'admin',
      action: 'product.update',
      resourceType: 'product',
      resourceId: data.id,
      changes: { mode: 'dev-no-db', payload: pickAuditableFields(data) },
      ipAddress,
      userAgent,
    });
  }

  // ── Invalidation cache ────────────────────────────────────────────
  revalidatePath('/admin/produits');
  revalidatePath(`/admin/produits/${data.slug}`);
  revalidatePath(`/produit/${data.slug}`);
  revalidatePath('/boutique');
  revalidatePath('/collections/couples');
  revalidatePath('/collections/elle');
  revalidatePath('/collections/lui');
  revalidatePath('/collections/cadeaux');
  revalidatePath('/');

  return {
    ok: true,
    message: DB_AVAILABLE
      ? 'Produit enregistré — changements visibles à la prochaine navigation.'
      : 'Produit validé (mode dev sans DB) — payload loggé côté serveur.',
    product: data,
  };
}

/**
 * Soft-delete d'un produit (passage en `archived`).
 * Le produit reste visible dans l'admin pour rollback.
 */
export async function archiveProductAction(productId: string): Promise<AdminActionResult> {
  if (!productId || !/^[0-9a-f-]{36}$/.test(productId)) {
    return { ok: false, message: 'ID produit invalide' };
  }

  const session = await getSession();
  const headersList = await headers();
  const ipAddress = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip');
  const userAgent = headersList.get('user-agent');

  if (DB_AVAILABLE) {
    try {
      const before = await getProductByIdAdmin(productId);
      if (!before) {
        return { ok: false, message: 'Produit introuvable' };
      }
      const after = await archiveProductById(productId);
      if (!after) {
        return { ok: false, message: 'Échec de l’archivage' };
      }
      await logAuditEvent({
        actorId: session?.id ?? null,
        actorType: 'admin',
        action: 'product.archive',
        resourceType: 'product',
        resourceId: productId,
        changes: { before: { status: before.status }, after: { status: after.status } },
        ipAddress,
        userAgent,
      });
    } catch (err) {
      console.error('[admin/products] archive exception:', err);
      return { ok: false, message: 'Erreur serveur' };
    }
  } else {
    await logAuditEvent({
      actorId: session?.id ?? null,
      actorType: 'admin',
      action: 'product.archive',
      resourceType: 'product',
      resourceId: productId,
      changes: { mode: 'dev-no-db' },
      ipAddress,
      userAgent,
    });
  }

  revalidatePath('/admin/produits');
  revalidatePath('/boutique');

  return { ok: true, message: 'Produit archivé' };
}

/**
 * Sélection des champs « audit-friendly » — on ne logue pas le HTML brut
 * des descriptions longues (trop verbeux), mais on logue leur longueur
 * pour détecter les changements.
 */
function pickAuditableFields(
  p: ProductEditInput | { [k: string]: unknown },
): Record<string, unknown> {
  return {
    slug: (p as Record<string, unknown>).slug,
    name: (p as Record<string, unknown>).name,
    priceCents: (p as Record<string, unknown>).priceCents,
    stockQuantity: (p as Record<string, unknown>).stockQuantity,
    stockStatus: (p as Record<string, unknown>).stockStatus,
    status: (p as Record<string, unknown>).status,
    isFeatured: (p as Record<string, unknown>).isFeatured,
    collection: (p as Record<string, unknown>).collection,
    descriptionEditorialLength:
      typeof (p as Record<string, unknown>).descriptionEditorial === 'string'
        ? ((p as Record<string, unknown>).descriptionEditorial as string).length
        : 0,
    descriptionLongLength:
      typeof (p as Record<string, unknown>).descriptionLong === 'string'
        ? ((p as Record<string, unknown>).descriptionLong as string).length
        : 0,
  };
}
