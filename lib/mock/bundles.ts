import type { Bundle, Product } from '@/lib/db/schema';
import { findMockProductBySlug } from './products';

/**
 * Mock bundles — coffrets pré-fabriqués alignés sur le pivot V2 « Couples 30-50 ».
 * Source de vérité tant que les tables `bundles` + `bundle_items` ne sont pas seedées.
 *
 * Convention :
 *   - `priceCents`           : prix bundle (avantage)
 *   - `compareAtPriceCents`  : somme normale des produits unitaires
 *   - L'économie = compareAt - price → affichée sur la card
 *   - `MOCK_BUNDLE_COMPOSITIONS` lie chaque bundle à ses produits (slug)
 */

export const MOCK_BUNDLES: readonly Bundle[] = [
  {
    id: '05000000-0000-0000-0000-000000000001',
    slug: 'soiree-a-deux',
    name: 'Soirée à Deux',
    tagline: 'Le rituel essentiel, en quatre pièces.',
    descriptionShort:
      'Une bougie de massage, une plume de caresse, un bandeau de soie, un lubrifiant base eau. Pour la soirée qui prend son temps.',
    descriptionLong:
      'Coffret pensé pour la soirée à deux qui se construit lentement. Aurore (bougie de massage qui devient huile à 38°C), une plume de caresse en autruche oxblood, un bandeau de soie, un flacon de Source (lubrifiant base eau formulé France). Livré dans une boîte écrin ivoire avec ruban oxblood et sceau cire à la main.',
    priceCents: 13900,
    compareAtPriceCents: 16700,
    heroImageUrl: '/images/bundles/soiree-a-deux/hero.webp',
    images: [
      {
        url: '/images/bundles/soiree-a-deux/hero.webp',
        alt: 'Coffret Soirée à Deux — vue principale',
        width: 2400,
        height: 3000,
      },
      {
        url: '/images/bundles/soiree-a-deux/contents.webp',
        alt: 'Coffret Soirée à Deux — contenu disposé',
        width: 2400,
        height: 2400,
      },
    ],
    occasion: 'pas_d_occasion',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Coffret Soirée à Deux — bougie + plume + bandeau + lubrifiant | Atelier Frisson',
    seoDescription:
      'Coffret rituel à deux : bougie de massage Aurore, plume de caresse, bandeau soie, lubrifiant Source. Économisez 28 €.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 1,
    publishedAt: new Date('2026-05-07T00:00:00Z'),
    createdAt: new Date('2026-05-07T00:00:00Z'),
    updatedAt: new Date('2026-05-07T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000002',
    slug: 'evasion-week-end',
    name: 'Évasion Week-end',
    tagline: 'Pour la valise complice — discret, signé, livré.',
    descriptionShort:
      'Un objet compact pour le voyage, une nuisette soie, un lubrifiant compact, un bandeau de sieste. Pour le week-end qui sort de la routine.',
    descriptionLong:
      'Le coffret pour les week-ends à deux. Étincelle (bullet compact, 50 g, étui lin inclus), Sillage (nuisette soie 22 momme, taille au choix), Source (lubrifiant base eau, 100 ml), Bandeau (masque soie). Boîte écrin ivoire avec carte personnalisable.',
    priceCents: 19900,
    compareAtPriceCents: 23700,
    heroImageUrl: '/images/bundles/evasion-week-end/hero.webp',
    images: [
      {
        url: '/images/bundles/evasion-week-end/hero.webp',
        alt: 'Coffret Évasion Week-end — vue principale',
        width: 2400,
        height: 3000,
      },
    ],
    occasion: 'pas_d_occasion',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Coffret Évasion Week-end — voyage couple discret | Atelier Frisson',
    seoDescription:
      'Coffret week-end couple : Étincelle + nuisette soie Sillage + lubrifiant Source + masque Bandeau. Économisez 38 €.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 2,
    publishedAt: new Date('2026-05-07T00:00:00Z'),
    createdAt: new Date('2026-05-07T00:00:00Z'),
    updatedAt: new Date('2026-05-07T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000003',
    slug: 'anniversaire-de-mariage',
    name: 'Anniversaire de Mariage',
    tagline: 'Marquer l\'étape — emballage écrin.',
    descriptionShort:
      'Pièce signature, dentelle Caudry, bougie de massage signature. Pensé pour les noces qui comptent (5, 10, 25 ans).',
    descriptionLong:
      'Le coffret pour célébrer un anniversaire de mariage à deux. Velours (pièce signature laquée oxblood, garantie à vie), Dentelle Noire (body en dentelle Leavers Caudry, taille au choix), Aurore (bougie de massage cire végétale). Coffret écrin double-fond avec carte sur cotton paper letterpress signée à la main.',
    priceCents: 36900,
    compareAtPriceCents: 42700,
    heroImageUrl: '/images/bundles/anniversaire-de-mariage/hero.webp',
    images: [
      {
        url: '/images/bundles/anniversaire-de-mariage/hero.webp',
        alt: 'Coffret Anniversaire de Mariage — vue principale',
        width: 2400,
        height: 3000,
      },
    ],
    occasion: 'mariage',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Coffret Anniversaire de Mariage — pièce signature | Atelier Frisson',
    seoDescription:
      'Cadeau anniversaire de mariage : Velours signature + Dentelle Noire Caudry + Aurore. Coffret écrin signé. Économisez 58 €.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 3,
    publishedAt: new Date('2026-05-07T00:00:00Z'),
    createdAt: new Date('2026-05-07T00:00:00Z'),
    updatedAt: new Date('2026-05-07T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000004',
    slug: 'saint-valentin-2027',
    name: 'Saint-Valentin — Édition 2027',
    tagline: 'Disponible 1ᵉʳ janvier → 14 février 2027.',
    descriptionShort:
      'Édition saisonnière. Coffret Rituel, nuisette Sillage, sels de bain Bain Rituel. Carte personnalisable.',
    descriptionLong:
      'Édition saisonnière limitée. Coffret Rituel (bougie + huile + plume + carte), Sillage (nuisette soie), Bain Rituel (duo de sels mer Morte). Boîte écrin avec ruban oxblood et sceau cire à la main, carte personnalisable au checkout.',
    priceCents: 19900,
    compareAtPriceCents: 25700,
    heroImageUrl: '/images/bundles/saint-valentin-2027/hero.webp',
    images: [
      {
        url: '/images/bundles/saint-valentin-2027/hero.webp',
        alt: 'Coffret Saint-Valentin 2027 — vue principale',
        width: 2400,
        height: 3000,
      },
    ],
    occasion: 'saint_valentin',
    availableFrom: new Date('2027-01-01T00:00:00Z'),
    availableUntil: new Date('2027-02-14T23:59:59Z'),
    seoTitle: 'Coffret Saint-Valentin 2027 — édition limitée | Atelier Frisson',
    seoDescription:
      'Coffret Saint-Valentin : Coffret Rituel + nuisette Sillage + sels Bain Rituel. Édition limitée 2027.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 4,
    publishedAt: new Date('2026-05-07T00:00:00Z'),
    createdAt: new Date('2026-05-07T00:00:00Z'),
    updatedAt: new Date('2026-05-07T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000005',
    slug: 'premier-cadeau',
    name: 'Premier Cadeau',
    tagline: 'L\'introduction la plus douce — pour anniversaire ou EVJF.',
    descriptionShort:
      'Étincelle (bullet compact très silencieux), Source (lubrifiant base eau), Aurore (bougie). Trois pièces accessibles, packaging signature.',
    descriptionLong:
      'Le coffret pour offrir sans intimider. Étincelle (notre objet le plus discret, < 40 dB, étui lin inclus), Source (lubrifiant base eau, 9 ingrédients), Aurore (bougie de massage cire végétale). Boîte écrin ivoire avec carte cotton letterpress.',
    priceCents: 9900,
    compareAtPriceCents: 12500,
    heroImageUrl: '/images/bundles/premier-cadeau/hero.webp',
    images: [
      {
        url: '/images/bundles/premier-cadeau/hero.webp',
        alt: 'Coffret Premier Cadeau — vue principale',
        width: 2400,
        height: 3000,
      },
    ],
    occasion: 'anniversaire',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Coffret Premier Cadeau — anniversaire / EVJF | Atelier Frisson',
    seoDescription:
      'Coffret cadeau accessible : Étincelle + Source + Aurore. Idéal anniversaire, EVJF, premier rituel. Économisez 26 €.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    displayOrder: 5,
    publishedAt: new Date('2026-05-07T00:00:00Z'),
    createdAt: new Date('2026-05-07T00:00:00Z'),
    updatedAt: new Date('2026-05-07T00:00:00Z'),
  },
  {
    id: '05000000-0000-0000-0000-000000000006',
    slug: 'lune-de-miel',
    name: 'Lune de Miel',
    tagline: 'Cinq pièces pour le voyage qui marque.',
    descriptionShort:
      'Duo (objet couple), Huile (parfum de Grasse), Plume, Sillage (nuisette soie), Bandeau. Le coffret le plus complet de la maison.',
    descriptionLong:
      'Notre coffret le plus complet, pensé pour la lune de miel ou les noces. Duo (stimulateur couple en U), Huile (huile sensuelle bois de oud + rose Grasse, 100 ml), Plume de caresse oxblood, Sillage (nuisette soie 22 momme), Bandeau (masque soie). Coffret écrin double-fond, carte personnalisable.',
    priceCents: 29900,
    compareAtPriceCents: 36500,
    heroImageUrl: '/images/bundles/lune-de-miel/hero.webp',
    images: [
      {
        url: '/images/bundles/lune-de-miel/hero.webp',
        alt: 'Coffret Lune de Miel — vue principale',
        width: 2400,
        height: 3000,
      },
    ],
    occasion: 'mariage',
    availableFrom: null,
    availableUntil: null,
    seoTitle: 'Coffret Lune de Miel — 5 pièces signature | Atelier Frisson',
    seoDescription:
      'Coffret lune de miel : Duo + Huile + Plume + Sillage + Bandeau. Économisez 66 €. Carte personnalisable.',
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    displayOrder: 6,
    publishedAt: new Date('2026-05-07T00:00:00Z'),
    createdAt: new Date('2026-05-07T00:00:00Z'),
    updatedAt: new Date('2026-05-07T00:00:00Z'),
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITIONS — slugs des produits inclus (pour pages /bundle/[slug])
// ─────────────────────────────────────────────────────────────────────────────

/** Map bundle.slug → list of product slugs included. */
export const MOCK_BUNDLE_COMPOSITIONS: Record<string, readonly string[]> = {
  'soiree-a-deux': ['aurore', 'plume', 'bandeau', 'source'],
  'evasion-week-end': ['etincelle', 'sillage', 'source', 'bandeau'],
  'anniversaire-de-mariage': ['velours', 'dentelle-noire', 'aurore'],
  'saint-valentin-2027': ['coffret-rituel', 'sillage', 'bain-rituel'],
  'premier-cadeau': ['etincelle', 'source', 'aurore'],
  'lune-de-miel': ['duo', 'huile', 'plume', 'sillage', 'bandeau'],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getMockBundles(): readonly Bundle[] {
  return MOCK_BUNDLES.filter((b) => b.status === 'active');
}

export function findMockBundleBySlug(slug: string): Bundle | undefined {
  return MOCK_BUNDLES.find((b) => b.slug === slug);
}

/** Récupère les produits qui composent un bundle. */
export function getMockBundleComposition(slug: string): readonly Product[] {
  const composition = MOCK_BUNDLE_COMPOSITIONS[slug];
  if (!composition) return [];
  return composition
    .map((s) => findMockProductBySlug(s))
    .filter((p): p is Product => p !== undefined);
}

/** Bundles filtrés par occasion. */
export function getMockBundlesByOccasion(occasion: Bundle['occasion']): readonly Bundle[] {
  return MOCK_BUNDLES.filter((b) => b.status === 'active' && b.occasion === occasion);
}

/** Bundles featured (pour homepage / mega menu). */
export function getMockFeaturedBundles(): readonly Bundle[] {
  return MOCK_BUNDLES.filter((b) => b.status === 'active' && b.isFeatured);
}
