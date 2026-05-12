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

declare global {
  var __af_db_client: ReturnType<typeof postgres> | undefined;
  var __af_db: DrizzleDatabase | undefined;
}

function buildClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL est requis. Configurez-le dans `.env.local` (pooler Transaction Supabase port 6543 avec ?pgbouncer=true).',
    );
  }
  return postgres(url, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

/**
 * Lazy initialization du singleton DB.
 *
 * On évite d'instancier le client au top-level pour ne pas crasher l'import
 * du module quand `DATABASE_URL` n'est pas défini (cas du build Next 16 qui
 * collecte la config des pages sans secrets dispo). Le client est créé à la
 * première requête, donc on échoue seulement si la DB est vraiment requise
 * — pas dès l'import.
 */
function getDatabase(): DrizzleDatabase {
  if (globalThis.__af_db) return globalThis.__af_db;
  const client = globalThis.__af_db_client ?? buildClient();
  const database = drizzle(client, { schema, casing: 'snake_case' });
  if (process.env.NODE_ENV !== 'production') {
    globalThis.__af_db_client = client;
    globalThis.__af_db = database;
  }
  return database;
}

export { schema };

/**
 * Singleton DB exposé en `Proxy` paresseux : le client n'est créé qu'à la
 * première utilisation. Permet aux imports en chaîne (server actions, queries)
 * de fonctionner même quand `DATABASE_URL` n'est pas défini en build.
 */
export const db: DrizzleDatabase = new Proxy({} as DrizzleDatabase, {
  get(_target, prop, receiver) {
    const real = getDatabase() as unknown as Record<PropertyKey, unknown>;
    const value = Reflect.get(real, prop, receiver);
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(real) : value;
  },
});
export type Database = DrizzleDatabase;
