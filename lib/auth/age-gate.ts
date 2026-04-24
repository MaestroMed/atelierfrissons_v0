/**
 * Constantes Age Gate Arcom — partagées entre Server Components, Client
 * Components et Route Handlers.
 *
 * ⚠️ Ce fichier ne contient AUCUNE directive `'use client'` pour pouvoir
 * être importé de partout. La constante `AGE_GATE_COOKIE` doit être
 * importée d'ici (et nulle part ailleurs) afin de garantir la cohérence
 * du nom de cookie entre :
 *
 *   - `app/layout.tsx`              (Server Component, lit le cookie)
 *   - `components/layout/AgeGate.tsx` (Client Component, déclenche le set)
 *   - `app/api/auth/verify-age/route.ts` (Route Handler, pose le cookie)
 *
 * Tentative précédente : exporter cette constante depuis `AgeGate.tsx`
 * (`'use client'`). Résultat : import depuis Server Component renvoyait
 * `undefined` car React Server Components ne propage pas les exports
 * non-composants à travers la frontière client/serveur — ce qui rendait
 * toute lecture cookie côté serveur impossible (boucle age-gate à l'infini).
 */

export const AGE_GATE_COOKIE = 'af_age_verified';
export const AGE_GATE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
