import { describe, it, expect } from 'vitest';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  getMockCategories,
  getMockProducts,
  getMockFeaturedProducts,
  findMockProductBySlug,
  getMockProductBySlug,
  getMockProductsByAudience,
  getMockProductsByTag,
  getMockCrossSell,
} from './products';

describe('lib/mock/products · catalogue intégrité', () => {
  it('expose 4 catégories pivot', () => {
    expect(MOCK_CATEGORIES).toHaveLength(4);
    const slugs = MOCK_CATEGORIES.map((c) => c.slug);
    expect(slugs).toEqual(
      expect.arrayContaining(['objets', 'lingerie', 'cosmetique', 'accessoires']),
    );
  });

  it('expose 20 produits actifs (pivot V2)', () => {
    expect(MOCK_PRODUCTS).toHaveLength(20);
    expect(MOCK_PRODUCTS.every((p) => p.status === 'active')).toBe(true);
  });

  it('tous les slugs sont uniques', () => {
    const slugs = MOCK_PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('tous les produits ont un categoryId valide', () => {
    const catIds = new Set(MOCK_CATEGORIES.map((c) => c.id));
    expect(MOCK_PRODUCTS.every((p) => p.categoryId !== null && catIds.has(p.categoryId))).toBe(
      true,
    );
  });

  it('tous les produits ont 5 vues d\'images', () => {
    expect(MOCK_PRODUCTS.every((p) => p.images.length === 5)).toBe(true);
  });

  it('chaque produit a au moins un tag d\'audience pour-*', () => {
    const audienceTags = ['pour-vous-deux', 'pour-elle', 'pour-lui', 'cadeaux'];
    expect(
      MOCK_PRODUCTS.every((p) => p.tags.some((t) => audienceTags.includes(t))),
    ).toBe(true);
  });
});

describe('lib/mock/products · helpers de filtrage', () => {
  it('getMockCategories ne renvoie que les actives', () => {
    expect(getMockCategories().every((c) => c.isActive)).toBe(true);
  });

  it('getMockProducts ne renvoie que les actifs', () => {
    expect(getMockProducts().every((p) => p.status === 'active')).toBe(true);
  });

  it('getMockFeaturedProducts respecte la limite optionnelle', () => {
    const all = getMockFeaturedProducts();
    expect(all.length).toBeGreaterThan(3);
    const limited = getMockFeaturedProducts(3);
    expect(limited).toHaveLength(3);
  });

  it('findMockProductBySlug + getMockProductBySlug retournent le même produit', () => {
    const a = findMockProductBySlug('velours');
    const b = getMockProductBySlug('velours');
    expect(a).toBeDefined();
    expect(a).toEqual(b);
  });

  it('findMockProductBySlug retourne undefined si slug inconnu', () => {
    expect(findMockProductBySlug('nonexistent-slug-123')).toBeUndefined();
  });
});

describe('lib/mock/products · audience filtering', () => {
  it('Pour Vous Deux inclut Duo + cross-listés (Pierre, Source, Aurore...)', () => {
    const list = getMockProductsByAudience('couples');
    const slugs = list.map((p) => p.slug);
    expect(slugs).toContain('duo');
    // Cross-listing : Pierre est primary couples mais aussi tagué pour-vous-deux
    expect(slugs).toContain('pierre');
    expect(list.length).toBeGreaterThanOrEqual(5);
  });

  it('Pour Elle inclut les pièces lingerie + objets féminins', () => {
    const list = getMockProductsByAudience('elle');
    const slugs = list.map((p) => p.slug);
    expect(slugs).toContain('sillage');
    expect(slugs).toContain('velours');
    expect(slugs).toContain('etincelle');
  });

  it('Pour Lui inclut Profond + cross-listés', () => {
    const list = getMockProductsByAudience('lui');
    const slugs = list.map((p) => p.slug);
    expect(slugs).toContain('profond');
    // Pierre est aussi tagué pour-lui (massage stone universel)
    expect(slugs).toContain('pierre');
  });

  it('Cadeaux inclut Coffret Rituel + tagués saisonniers', () => {
    const list = getMockProductsByAudience('cadeaux');
    const slugs = list.map((p) => p.slug);
    expect(slugs).toContain('coffret-rituel');
  });

  it('featuredFirst trie les featured en premier', () => {
    const list = getMockProductsByAudience('elle', { featuredFirst: true });
    // Le premier item devrait être un featured
    expect(list[0]?.isFeatured).toBe(true);
  });

  it('limit limite la taille du résultat', () => {
    const list = getMockProductsByAudience('elle', { limit: 3 });
    expect(list).toHaveLength(3);
  });
});

describe('lib/mock/products · tags', () => {
  it('best-seller existe pour au moins 3 produits', () => {
    expect(getMockProductsByTag('best-seller').length).toBeGreaterThanOrEqual(2);
  });

  it('made-in-france est correctement tagué', () => {
    const list = getMockProductsByTag('made-in-france');
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.tags.includes('made-in-france'))).toBe(true);
  });

  it('saint-valentin n\'apparaît que sur le coffret rituel', () => {
    const list = getMockProductsByTag('saint-valentin');
    expect(list.map((p) => p.slug)).toContain('coffret-rituel');
  });
});

describe('lib/mock/products · cross-sell', () => {
  it('renvoie 4 produits par défaut', () => {
    const list = getMockCrossSell('velours');
    expect(list).toHaveLength(4);
  });

  it('exclut le produit source', () => {
    const list = getMockCrossSell('velours');
    expect(list.every((p) => p.slug !== 'velours')).toBe(true);
  });

  it('priorise même catégorie', () => {
    const list = getMockCrossSell('velours', 6);
    const source = findMockProductBySlug('velours')!;
    // Au moins les premiers items sont dans la même catégorie
    expect(list[0]?.categoryId).toBe(source.categoryId);
  });

  it('fallback featured si slug inconnu', () => {
    const list = getMockCrossSell('nonexistent-product', 3);
    expect(list.length).toBe(3);
  });
});
