/** Types partagés Compare — neutre (pas 'use client' / 'use server'). */

export const COMPARE_STORAGE_KEY = 'af_compare';
export const COMPARE_MAX_ITEMS = 3;

/** Item minimal stocké en localStorage (juste les slugs pour rester léger). */
export type CompareSlugList = readonly string[];
