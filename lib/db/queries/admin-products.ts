import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { products, type Product } from '../schema';

/**
 * Queries admin écriture produits — UPDATE / INSERT / DELETE.
 *
 * Toutes ces queries sont appelées depuis des Server Actions admin qui
 * ont déjà validé l'auth + zod. L'audit_log est inséré par le caller
 * (lib/admin/products/actions.ts) pour conserver une vue cohérente.
 *
 * Comportement graceful : si `DATABASE_URL` n'est pas défini, ces
 * fonctions throw — le caller doit catch et basculer sur le mode
 * dev-log. Voir `lib/admin/products/actions.ts` pour le pattern.
 */

/** UPDATE par ID. Renvoie la ligne mise à jour ou null si non trouvée. */
export async function updateProductById(
  id: string,
  patch: Partial<Omit<Product, 'id' | 'createdAt'>>,
): Promise<Product | null> {
  const updated = await db
    .update(products)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return updated[0] ?? null;
}

/** Lecture par ID — utilisée pour le diff before/after dans l'audit log. */
export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Soft-delete : passe le statut à 'archived' (pas de hard delete pour préserver l'historique). */
export async function archiveProductById(id: string): Promise<Product | null> {
  const updated = await db
    .update(products)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return updated[0] ?? null;
}
