import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration — connecte l'ORM à Supabase PostgreSQL (région EU).
 * Les migrations sont générées dans ./drizzle et versionnées en git.
 *
 * Voir : docs/FORGE_WORKFLOW.md, docs/SEO_STRATEGY.md, CLAUDE.md section 5.
 */
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  casing: 'snake_case',
  strict: true,
  verbose: true,
});
