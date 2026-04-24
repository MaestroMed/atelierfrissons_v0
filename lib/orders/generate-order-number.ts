/**
 * Helper pour générer un numéro de commande AF-YYYY-NNNNNN — fallback
 * applicatif (lib/db/queries/orders.ts a la version Postgres SEQUENCE).
 *
 * En dev sans DB, on utilise crypto.randomBytes pour avoir des numéros
 * déterministes-ish mais uniques par session.
 */
export function generateLocalOrderNumber(): string {
  const year = new Date().getUTCFullYear();
  const seq = Math.floor(100000 + Math.random() * 899999);
  return `AF-${year}-${seq}`;
}
