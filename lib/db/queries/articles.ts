import 'server-only';
import { cache } from 'react';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../index';
import { articles } from '../schema';
import type { Article } from '../schema';

/**
 * Queries articles (blog éditorial + guides piliers).
 *
 * Filtre toujours `status = 'published'` côté public. L'admin a ses propres
 * queries avec accès à tous les statuts.
 */

export const getPublishedArticles = cache(
  async (options: { limit?: number; offset?: number; category?: string } = {}): Promise<Article[]> => {
    const limit = options.limit ?? 24;
    const offset = options.offset ?? 0;
    const whereClauses = [eq(articles.status, 'published')];
    if (options.category) {
      whereClauses.push(eq(articles.category, options.category));
    }
    return db
      .select()
      .from(articles)
      .where(and(...whereClauses))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);
  },
);

export const getFeaturedArticles = cache(async (limit = 3): Promise<Article[]> => {
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.status, 'published'), eq(articles.isFeatured, true)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
    .limit(1);
  return rows[0] ?? null;
});

export const getRelatedArticles = cache(
  async (ids: string[], limit = 3): Promise<Article[]> => {
    if (ids.length === 0) return [];
    return db
      .select()
      .from(articles)
      .where(and(eq(articles.status, 'published'), inArray(articles.id, ids)))
      .limit(limit);
  },
);

export const countPublishedArticles = cache(async (): Promise<number> => {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(articles)
    .where(eq(articles.status, 'published'));
  return row?.count ?? 0;
});
