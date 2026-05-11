/**
 * Setup global pour Vitest.
 *
 * - Variables d'env de test (NEXT_PUBLIC_* déterministes)
 * - Mocks globaux si nécessaires
 */

import { afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  // Variables d'env utilisées par les helpers — valeurs fictives
  process.env['NEXT_PUBLIC_APP_URL'] = 'https://atelierfrisson.test';
});

afterEach(() => {
  // Reset éventuels états globaux entre tests
});
