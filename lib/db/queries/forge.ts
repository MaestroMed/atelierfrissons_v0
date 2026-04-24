import 'server-only';
import { cache } from 'react';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../index';
import { forgePages } from '../schema';
import type { ForgePage } from '../schema';

/**
 * Queries pages FORJA (pSEO) — cf. docs/FORGE_WORKFLOW.md.
 *
 * Public :
 *  - Toujours `status = 'published'`, jamais `pending_review` ni `draft`.
 *  - ISR 24h au niveau Next (configuré dans les pages `app/(forge)/...`).
 *
 * Admin (Sprint 5) :
 *  - Queries séparées dans `lib/db/queries/admin/forge.ts` pour inclure
 *    les pending_review et le monitoring (scores qualité, impressions, etc.).
 */

export type ForgeTemplate = NonNullable<ForgePage['template']>;

export const getPublishedForgePageBySlug = cache(
  async (slug: string): Promise<ForgePage | null> => {
    const rows = await db
      .select()
      .from(forgePages)
      .where(and(eq(forgePages.slug, slug), eq(forgePages.status, 'published')))
      .limit(1);
    return rows[0] ?? null;
  },
);

export const getPublishedForgePagesByTemplate = cache(
  async (template: ForgeTemplate, limit = 500): Promise<ForgePage[]> => {
    return db
      .select()
      .from(forgePages)
      .where(and(eq(forgePages.status, 'published'), eq(forgePages.template, template)))
      .orderBy(desc(forgePages.publishedAt))
      .limit(limit);
  },
);

/** Liste complète des slugs publiés — pour le sitemap et generateStaticParams(). */
export const getPublishedForgeSlugs = cache(
  async (
    template?: ForgeTemplate,
  ): Promise<Array<{ slug: string; template: ForgeTemplate; updatedAt: Date }>> => {
    const whereClauses = [eq(forgePages.status, 'published')];
    if (template) whereClauses.push(eq(forgePages.template, template));
    return db
      .select({
        slug: forgePages.slug,
        template: forgePages.template,
        updatedAt: forgePages.updatedAt,
      })
      .from(forgePages)
      .where(and(...whereClauses));
  },
);

export const countForgePagesByStatus = cache(
  async (): Promise<Record<NonNullable<ForgePage['status']>, number>> => {
    const rows = await db
      .select({
        status: forgePages.status,
        count: sql<number>`count(*)::int`,
      })
      .from(forgePages)
      .groupBy(forgePages.status);
    const base: Record<NonNullable<ForgePage['status']>, number> = {
      draft: 0,
      pending_review: 0,
      published: 0,
      archived: 0,
      penalized: 0,
    };
    for (const row of rows) {
      base[row.status] = row.count;
    }
    return base;
  },
);
