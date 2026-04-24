import 'server-only';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Client Drizzle ORM → Supabase PostgreSQL.
 *
 * ⚠️ Note Supabase : utilise impérativement le connection string du pooler
 * Transaction (port 6543) avec `?pgbouncer=true` en production. Le driver
 * `postgres` est configuré `prepare: false` car pgbouncer mode transaction
 * ne supporte pas les prepared statements partagés.
 *
 * Le singleton est mémorisé sur `globalThis` en dev pour éviter l'ouverture
 * de connexions multiples au rechargement Turbopack.
 */

type DrizzleDatabase = PostgresJsDatabase<typeof schema>;

const DATABASE_URL = process.env.DATABASE_URL;

declare global {
  var __af_db_client: ReturnType<typeof postgres> | undefined;
  var __af_db: DrizzleDatabase | undefined;
}

function buildClient() {
  if (!DATABASE_URL) {
    throw new Error(
      'DATABASE_URL est requis. Configurez-le dans `.env.local` (pooler Transaction Supabase port 6543 avec ?pgbouncer=true).',
    );
  }
  return postgres(DATABASE_URL, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

const client = globalThis.__af_db_client ?? buildClient();
const database: DrizzleDatabase = globalThis.__af_db ?? drizzle(client, { schema, casing: 'snake_case' });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__af_db_client = client;
  globalThis.__af_db = database;
}

export { schema };
export const db: DrizzleDatabase = database;
export type Database = DrizzleDatabase;
