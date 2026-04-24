/**
 * Logique pure de tri produits — neutre (ni 'use client' ni 'use server').
 *
 * Les valeurs et la fonction sont partagées entre le Server Component
 * `/boutique` (qui trie côté serveur avant render) et le Client Component
 * `ProductSort` (qui lit l'option active depuis l'URL).
 *
 * Extrait de components/shop/ProductSort.tsx pour éviter le bug Next 16
 * « Attempted to call applyProductSort() from the server » — un fichier
 * 'use client' ne peut pas exporter de fonctions vers le serveur.
 */

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Sélection signature' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name-asc', label: 'Nom A → Z' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

export function applyProductSort<
  T extends { isFeatured: boolean; publishedAt: Date | null; priceCents: number; name: string },
>(products: readonly T[], sort: SortKey | null = 'featured'): T[] {
  const arr = [...products];
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
    case 'price-asc':
      return arr.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-desc':
      return arr.sort((a, b) => b.priceCents - a.priceCents);
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    case 'featured':
    default:
      return arr.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}
