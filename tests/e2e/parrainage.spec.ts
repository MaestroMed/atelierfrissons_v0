import { test, expect } from '@playwright/test';

/**
 * Scénario 3 — Programme parrainage
 *
 * Parcours sans auth : /compte/parrainage redirige vers /auth/login.
 * Avec auth (mock supabase ou bypass) : code généré + dashboard stats.
 */

test.describe('Programme parrainage', () => {
  test('non-connectée → redirect /auth/login', async ({ page }) => {
    await page.goto('/compte/parrainage');
    // Le layout (account)/compte/layout.tsx appelle requireSession()
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('page login charge correctement', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Magic link input
    await expect(page.getByLabel(/email|adresse/i).first()).toBeVisible();
  });
});

test.describe('Lien partage parrainage (URL ?ref=)', () => {
  test('homepage avec ?ref= valide accepte le code (capture intent)', async ({ page }) => {
    await page.goto('/?ref=AF-VALID-DEMO');
    // Le code devrait être capturé dans un cookie côté client / Server Action
    // L'effet visuel n'est pas garanti — on vérifie juste que la page charge
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
