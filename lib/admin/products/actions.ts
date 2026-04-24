'use server';

import { revalidatePath } from 'next/cache';
import { productEditSchema, type ProductEditInput } from './schema';

/**
 * Server Actions admin — CRUD produit.
 *
 * Sprint 4 : branche Drizzle UPDATE/INSERT/DELETE sur `products` table
 * avec check admin_users + audit_log.
 *
 * V1 (ce commit) : validation zod + log console + revalidate. Permet à
 * Odelie de tester le formulaire UX avant branchement DB.
 */

export interface AdminActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Produit mis à jour (renvoyé par le backend, utile pour sync UI). */
  product?: ProductEditInput;
}

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

  // TODO Sprint 4 : wrapper dans une transaction avec audit_log insert
  // + check admin_users via Supabase session
  console.info('[admin/products] update', {
    id: data.id,
    slug: data.slug,
    name: data.name,
    priceCents: data.priceCents,
    stockQuantity: data.stockQuantity,
    status: data.status,
    isFeatured: data.isFeatured,
    tagsCount: data.tags.length,
    featuresCount: data.features.length,
    specsCount: Object.keys(data.specs).length,
  });

  // Invalide toutes les vues qui affichent des produits
  revalidatePath('/admin/produits');
  revalidatePath(`/admin/produits/${data.slug}`);
  revalidatePath(`/produit/${data.slug}`);
  revalidatePath('/boutique');
  revalidatePath('/collections/jour');
  revalidatePath('/collections/nuit');
  revalidatePath('/');

  return {
    ok: true,
    message: 'Produit enregistré — changements visibles à la prochaine navigation.',
    product: data,
  };
}
