/**
 * Constantes métier du programme fidélité Atelier Frisson.
 *
 * Sortie du module `actions.ts` (qui est marqué `'use server';` et n'autorise
 * donc QUE des async functions exportées). Ces constantes sont consommées
 * côté client et serveur.
 */

export const LOYALTY_RATE_EARN = 1; // 1 € → 1 point
export const LOYALTY_RATE_REDEEM = 0.05; // 100 points → 5 € (5 %)
export const LOYALTY_MIN_REDEEM = 100; // pas de redemption sous 100 points
export const LOYALTY_EXPIRY_MONTHS = 12;
