import type { Bundle } from '@/lib/db/schema';

/**
 * Mock bundles — combos pré-fabriqués 79-149 € qui boostent l'AOV.
 * Données substituables par les queries Drizzle quand la table sera seedée.
 *
 * Convention : `compareAtPriceCents` = somme des produits unitaires, le
 * `priceCents` est l'avantage bundle. Affichage : « -16 € pack ».
 */
export const MOCK_BUNDLES: readonly Bundle[] = [
  {
    id: '05000000-0000-0000-0000-000000000001',
    slug: 'soiree-a-deux',
    name: 'Soirée à deux',
    tagline: 'Le rituel essentiel, en quatre pièces',
    descriptionShort:
      'Un objet doux, une huile de massage, un jeu de cartes conversation, un foulard de soie. À partager.',
    descriptionLong:
      'Pensé comme un coffret-cadeau, le bundle « Soirée à deux » réunit les essentiels d’un rituel à deux : un objet en silicone médical, une huile chauffante au monoï, un jeu de cartes pour amorcer la conversation, un foulard de soie pour la mise en scène. Livré dans une boîte ivoire signée à la main.',
    priceCents: 8900,
    compareAtPriceCents: 10500,
    heroImageUrl: null,
    images: [],
    occasion: 'pas_d_occasion',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Bundle Soirée à deux — Atelier Frisson',
    seoDescription:
      'Coffret rituel à deux : objet silicone médical, huile chauffante, jeu de cartes, foulard. Économisez 16 €.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 1,
    publishedAt: new Date('2026-04-26T00:00:00Z'),
    createdAt: new Date('2026-04-26T00:00:00Z'),
    updatedAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000002',
    slug: 'evasion-week-end',
    name: 'Évasion week-end',
    tagline: 'Pour la valise complice — discret, signé, livré',
    descriptionShort:
      'Une lingerie capsule, un objet voyage, une cosmétique intime, une trousse de cuir grainé.',
    descriptionLong:
      'Le bundle pensé pour les week-ends à deux. Une lingerie capsule en jersey ivoire, un objet de voyage compact en silicone médical, une cosmétique intime au pH adapté, une trousse en cuir grainé italien gravée du monogramme AF.',
    priceCents: 11900,
    compareAtPriceCents: 14200,
    heroImageUrl: null,
    images: [],
    occasion: 'pas_d_occasion',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Bundle Évasion week-end — Atelier Frisson',
    seoDescription:
      'Coffret week-end : lingerie capsule, objet voyage, cosmétique intime, trousse cuir. Économisez 23 €.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 2,
    publishedAt: new Date('2026-04-26T00:00:00Z'),
    createdAt: new Date('2026-04-26T00:00:00Z'),
    updatedAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000003',
    slug: 'anniversaire-de-mariage',
    name: 'Anniversaire de mariage',
    tagline: 'Marquer l’étape — emballage écrin',
    descriptionShort:
      'Un objet de complicité, un set de lingerie haut de gamme, une cosmétique signature, deux verres gravés.',
    descriptionLong:
      'Le coffret pour célébrer un anniversaire de mariage à deux. Pensé comme un écrin, livré avec carte personnalisable et ruban or.',
    priceCents: 14900,
    compareAtPriceCents: 17800,
    heroImageUrl: null,
    images: [],
    occasion: 'mariage',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Coffret Anniversaire de mariage — Atelier Frisson',
    seoDescription:
      'Cadeau anniversaire de mariage : objet, lingerie, cosmétique, verres gravés. Coffret écrin signé.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    displayOrder: 3,
    publishedAt: new Date('2026-04-26T00:00:00Z'),
    createdAt: new Date('2026-04-26T00:00:00Z'),
    updatedAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000004',
    slug: 'saint-valentin-2027',
    name: 'Saint-Valentin — Édition limitée',
    tagline: 'Disponible 1er janvier → 14 février',
    descriptionShort:
      'Coffret saisonnier : un objet rouge laqué, une cosmétique rose poudré, une carte de Pierre Assouline.',
    descriptionLong:
      'Édition saisonnière. Un objet en silicone rouge laqué, une cosmétique au monoï rose poudré, et une citation littéraire choisie. Livré sous emballage écrin avec ruban grenat.',
    priceCents: 9900,
    compareAtPriceCents: 11500,
    heroImageUrl: null,
    images: [],
    occasion: 'saint_valentin',
    availableFrom: new Date('2027-01-01T00:00:00Z'),
    availableUntil: new Date('2027-02-14T23:59:59Z'),
    seoTitle: 'Saint-Valentin Édition limitée — Atelier Frisson',
    seoDescription:
      'Coffret Saint-Valentin : objet rouge laqué, cosmétique monoï, carte signature. Édition limitée.',
    schemaOrgData: null,
    status: 'draft',
    isFeatured: false,
    displayOrder: 4,
    publishedAt: null,
    createdAt: new Date('2026-04-26T00:00:00Z'),
    updatedAt: new Date('2026-04-26T00:00:00Z'),
  },
] as const;

export function getMockBundles(): readonly Bundle[] {
  return MOCK_BUNDLES.filter((b) => b.status === 'active');
}

export function findMockBundleBySlug(slug: string): Bundle | undefined {
  return MOCK_BUNDLES.find((b) => b.slug === slug);
}
