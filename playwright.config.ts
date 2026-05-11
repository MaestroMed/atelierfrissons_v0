import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — Atelier Frisson E2E.
 *
 * Cibles :
 *   - 5 scénarios critiques : checkout one-time, checkout subscription,
 *     parrainage redemption, gift card purchase, refund flow.
 *   - Browsers : Chromium (desktop) + WebKit (Safari iOS) + Firefox.
 *   - CI : GitHub Actions / Vercel preview deploys via webhook.
 *
 * Lancer :
 *   pnpm playwright install        # install browsers
 *   pnpm test:e2e                  # tous tests
 *   pnpm test:e2e:ui               # mode UI interactif
 *   pnpm test:e2e -- checkout      # un seul test
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'html',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    /**
     * Cookie consent + age gate présents dans `tests/e2e/fixtures/state.json`
     * pour skip les modals au démarrage de chaque test.
     */
    storageState: 'tests/e2e/fixtures/state.json',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 14 Pro'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: process.env['CI']
    ? undefined // CI : déjà déployé sur Vercel preview
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env['CI'],
        timeout: 120_000,
      },
});
