import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest config — tests unitaires pour Atelier Frisson.
 *
 * - Environnement : `happy-dom` (DOM-light, plus rapide que jsdom).
 * - Imports : alias `@/*` aligné sur tsconfig.
 * - Couverture cible (Sprint P2) :
 *   - lib/payments/router.ts        (multi-PSP routing logic)
 *   - lib/mock/*                    (helpers de filtrage)
 *   - lib/format.ts, lib/utils.ts   (purs, faciles à tester)
 *   - lib/cart/promo.ts             (calculs panier)
 *   - lib/checkout/schemas.ts       (validations Zod)
 *
 * Lancer : `pnpm test` (CI), `pnpm test:watch` (dev), `pnpm test:ui` (interactif).
 */
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['{lib,components,app}/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.ts'],
    exclude: ['node_modules', '.next', 'tests/e2e/**'],
    setupFiles: ['./tests/setup.ts'],
    pool: 'threads',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
