import 'server-only';
import { cache } from 'react';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../index';
import { products, productVariants, categories } from '../schema';
import type { Product, ProductVariant, Category } from '../schema';

/**
 * Queries produits — toutes memoïsées via React `cache()` pour dé-dupliquer
 * les appels dans un même rendu RSC.
 *
 * Conventions :
 *  - On filtre toujours `status = 'active'` côté public
 *  - Les requêtes admin passent par `/admin/...` avec leurs propres queries
 *    (non filtrées par status) — voir lib/db/queries/admin/products.ts (Sprint 4).
 */

export type ProductWithVariants = Product & { variants: ProductVariant[] };
export type ProductWithCategory = Product & { category: Category | null };

/** Liste des produits actifs, triés par publication décroissante puis nom. */
export const getActiveProducts = cache(
  async (options: { limit?: number; offset?: number } = {}): Promise<Product[]> => {
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    return db
      .select()
      .from(products)
      .where(eq(products.status, 'active'))
      .orderBy(desc(products.publishedAt), desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  },
);

/** Produits mis en avant sur la homepage. */
export const getFeaturedProducts = cache(async (limit = 6): Promise<Product[]> => {
  return db
    .select()
    .from(products)
    .where(and(eq(products.status, 'active'), eq(products.isFeatured, true)))
    .orderBy(desc(products.publishedAt))
    .limit(limit);
});

/** Produits d'une collection (jour/nuit/inaugurale/signature). */
export const getProductsByCollection = cache(
  async (collection: NonNullable<Product['collection']>, limit = 24): Promise<Product[]> => {
    return db
      .select()
      .from(products)
      .where(and(eq(products.status, 'active'), eq(products.collection, collection)))
      .orderBy(desc(products.isFeatured), desc(products.publishedAt))
      .limit(limit);
  },
);

/** Produit par slug, avec ses variants. */
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductWithVariants | null> => {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.status, 'active')))
      .limit(1);
    const product = rows[0];
    if (!product) return null;

    const variants = await db
      .select()
      .from(productVariants)
      .where(and(eq(productVariants.productId, product.id), eq(productVariants.isActive, true)))
      .orderBy(productVariants.displayOrder);

    return { ...product, variants };
  },
);

/** Produits d'une catégorie par slug. */
export const getProductsByCategorySlug = cache(
  async (categorySlug: string, limit = 24): Promise<Product[]> => {
    const category = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.slug, categorySlug), eq(categories.isActive, true)))
      .limit(1);
    const categoryId = category[0]?.id;
    if (!categoryId) return [];

    return db
      .select()
      .from(products)
      .where(and(eq(products.status, 'active'), eq(products.categoryId, categoryId)))
      .orderBy(desc(products.isFeatured), desc(products.publishedAt))
      .limit(limit);
  },
);

/** Produits liés — par IDs (utilisé dans articles et fiches produit). */
export const getProductsByIds = cache(async (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return [];
  return db
    .select()
    .from(products)
    .where(and(eq(products.status, 'active'), inArray(products.id, ids)));
});

/** Compteur global des produits actifs — utilisé dans sitemap + admin dashboard. */
export const countActiveProducts = cache(async (): Promise<number> => {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.status, 'active'));
  return row?.count ?? 0;
});
