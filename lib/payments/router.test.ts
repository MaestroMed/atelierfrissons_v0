import { describe, it, expect } from 'vitest';
import {
  routePayment,
  pspForLine,
  routePaymentFromCategories,
  checkPaymentEnv,
  REQUIRED_PAYMENT_ENV,
} from './router';

describe('lib/payments/router · pspForLine', () => {
  it('route lingerie → CCBill', () => {
    expect(pspForLine({ categorySlug: 'lingerie', quantity: 1 })).toBe('ccbill');
  });

  it('route objets → CCBill', () => {
    expect(pspForLine({ categorySlug: 'objets', quantity: 1 })).toBe('ccbill');
  });

  it('route cosmétique → Stripe', () => {
    expect(pspForLine({ categorySlug: 'cosmetique', quantity: 1 })).toBe('stripe');
  });

  it('route accessoires → Stripe', () => {
    expect(pspForLine({ categorySlug: 'accessoires', quantity: 1 })).toBe('stripe');
  });

  it('catégorie inconnue → fallback Stripe', () => {
    expect(pspForLine({ categorySlug: 'inconnue', quantity: 1 })).toBe('stripe');
  });

  it('pas de catégorie → fallback Stripe', () => {
    expect(pspForLine({ categorySlug: null, quantity: 1 })).toBe('stripe');
  });

  it('Coffret Rituel override → Stripe (malgré catégorie accessoires)', () => {
    expect(
      pspForLine({
        categorySlug: 'accessoires',
        productSlug: 'coffret-rituel',
        quantity: 1,
      }),
    ).toBe('stripe');
  });
});

describe('lib/payments/router · routePayment', () => {
  it('panier vide → Stripe avec fallbacks', () => {
    const r = routePayment([]);
    expect(r.primary).toBe('stripe');
    expect(r.fallbacks).toEqual(['ccbill', 'verotel']);
    expect(r.isHighRisk).toBe(false);
  });

  it('panier soft uniquement → Stripe', () => {
    const r = routePayment([
      { categorySlug: 'cosmetique', productSlug: 'source', quantity: 1 },
      { categorySlug: 'accessoires', productSlug: 'bandeau', quantity: 1 },
    ]);
    expect(r.primary).toBe('stripe');
    expect(r.isHighRisk).toBe(false);
    expect(r.fallbacks).toEqual(['ccbill', 'verotel']);
  });

  it('panier mixte → CCBill (le hard l’emporte)', () => {
    const r = routePayment([
      { categorySlug: 'cosmetique', productSlug: 'source', quantity: 1 },
      { categorySlug: 'lingerie', productSlug: 'sillage', quantity: 1 },
    ]);
    expect(r.primary).toBe('ccbill');
    expect(r.isHighRisk).toBe(true);
    // Les fallbacks high-risk priorisent Verotel sur Stripe
    expect(r.fallbacks).toEqual(['verotel', 'stripe']);
  });

  it('panier hard uniquement → CCBill', () => {
    const r = routePayment([
      { categorySlug: 'objets', productSlug: 'velours', quantity: 1 },
      { categorySlug: 'lingerie', productSlug: 'dentelle-noire', quantity: 1 },
    ]);
    expect(r.primary).toBe('ccbill');
    expect(r.isHighRisk).toBe(true);
  });

  it('Coffret Rituel seul → Stripe (override produit)', () => {
    const r = routePayment([
      { categorySlug: 'accessoires', productSlug: 'coffret-rituel', quantity: 1 },
    ]);
    expect(r.primary).toBe('stripe');
    expect(r.isHighRisk).toBe(false);
  });

  it('reason explique le choix', () => {
    const r = routePayment([
      { categorySlug: 'objets', productSlug: 'duo', quantity: 1 },
    ]);
    expect(r.reason).toContain('CCBill');
    expect(r.reason).toContain('high-risk');
  });
});

describe('lib/payments/router · routePaymentFromCategories', () => {
  it('mappe les categories Drizzle vers le router', () => {
    const r = routePaymentFromCategories([
      {
        category: { slug: 'objets' },
        productSlug: 'velours',
        quantity: 1,
      },
      {
        category: { slug: 'cosmetique' },
        productSlug: 'source',
        quantity: 2,
      },
    ]);
    expect(r.primary).toBe('ccbill');
    expect(r.isHighRisk).toBe(true);
  });

  it('gère les categories null', () => {
    const r = routePaymentFromCategories([
      { category: null, productSlug: 'unknown', quantity: 1 },
    ]);
    expect(r.primary).toBe('stripe');
    expect(r.isHighRisk).toBe(false);
  });
});

describe('lib/payments/router · checkPaymentEnv', () => {
  it('retourne toutes les vars manquantes pour stripe en env vide', () => {
    // Sauvegarde + reset des env vars Stripe
    const saved: Record<string, string | undefined> = {};
    for (const key of REQUIRED_PAYMENT_ENV.stripe) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
    const missing = checkPaymentEnv('stripe');
    expect(missing).toEqual([...REQUIRED_PAYMENT_ENV.stripe]);
    // Restore
    for (const key of REQUIRED_PAYMENT_ENV.stripe) {
      if (saved[key]) process.env[key] = saved[key];
    }
  });

  it('retourne tableau vide si toutes les vars sont définies', () => {
    for (const key of REQUIRED_PAYMENT_ENV.stripe) {
      process.env[key] = 'sk_test_dummy';
    }
    expect(checkPaymentEnv('stripe')).toEqual([]);
    for (const key of REQUIRED_PAYMENT_ENV.stripe) {
      delete process.env[key];
    }
  });
});
