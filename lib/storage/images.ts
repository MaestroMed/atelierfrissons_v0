import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Helpers Supabase Storage pour l'upload d'images produit + autres assets.
 *
 * Bucket recommandé : `products-images` (public read, signed write).
 * Stratégie path : `products/{slug}/{timestamp}-{filename}` pour éviter
 * les collisions et pouvoir versionner.
 *
 * Flow d'upload :
 *   1. Admin sélectionne fichier dans /admin/produits/[slug]
 *   2. Server Action `generateUploadSignedUrlAction` crée une URL signée
 *   3. Client PUT le fichier directement vers Supabase Storage
 *   4. Server Action `confirmImageUploadAction` UPDATE products.images
 *      avec la URL publique
 *
 * En dev sans Supabase configuré : les fonctions throw avec message clair.
 */

const PRODUCTS_BUCKET = 'products-images';

export interface UploadSignedUrl {
  /** URL signée à utiliser côté client pour PUT le fichier. */
  signedUrl: string;
  /** URL publique finale (à stocker dans products.images). */
  publicUrl: string;
  /** Path interne au bucket (utile pour suppression). */
  path: string;
  /** Token attendu par Supabase pour finaliser le PUT. */
  token: string;
}

/**
 * Génère une URL signée pour upload Supabase Storage.
 * Le client peut PUT le fichier (binaire) directement à `signedUrl` —
 * pas de proxy serveur, économise bande passante.
 */
export async function generateProductImageUploadUrl(options: {
  productSlug: string;
  filename: string;
  /** MIME type validé côté client (image/jpeg, image/png, image/avif, image/webp). */
  contentType: string;
}): Promise<UploadSignedUrl> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY requis pour Supabase Storage.',
    );
  }
  if (!isAllowedImageMime(options.contentType)) {
    throw new Error(`Type MIME non autorisé : ${options.contentType}`);
  }
  if (!/^[a-z0-9-]+$/.test(options.productSlug)) {
    throw new Error('Slug produit invalide');
  }
  const cleanFilename = options.filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .toLowerCase()
    .slice(0, 80);
  const path = `products/${options.productSlug}/${Date.now()}-${cleanFilename}`;

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage.from(PRODUCTS_BUCKET).createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(`Supabase Storage signed URL failed: ${error?.message ?? 'unknown'}`);
  }

  // URL publique finale (le bucket doit être public read)
  const { data: publicData } = admin.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);

  return {
    signedUrl: data.signedUrl,
    publicUrl: publicData.publicUrl,
    path,
    token: data.token,
  };
}

/** Supprime une image du bucket — utilisé quand un produit retire une image. */
export async function deleteProductImage(path: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase Storage non configuré');
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.storage.from(PRODUCTS_BUCKET).remove([path]);
  if (error) {
    throw new Error(`Supabase Storage delete failed: ${error.message}`);
  }
}

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);

function isAllowedImageMime(mime: string): boolean {
  return ALLOWED_MIMES.has(mime.toLowerCase());
}
