import { test, expect } from '@playwright/test';

/**
 * Scénario 2 — Abonnement Box Mensuelle
 *
 * Parcours :
 *   1. Visite /box-mensuelle
 *   2. Vérifie 3 plans + section "Chapitre n°5"
 *   3. Clique CTA Box Premium
 *   4. /checkout?subscribe=box-premium → page checkout subscription
 *   5. Remplit formulaire + valide CCBill recurring (mock)
 *   6. /checkout/confirmation visible
 *
 * Notes : sans CCBill live, on teste seulement la nav + structure.
 */

test.describe('Box Mensuelle — souscription', () => {
  test('landing 3 plans + Chapitre du mois affichés', async ({ page }) => {
    await page.goto('/box-mensuelle');

    // Hero
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/box du rituel intime/i);

    // 3 plans présents
    await expect(page.getByText(/box découverte/i)).toBeVisible();
    await expect(page.getByText(/box premium/i)).toBeVisible();
    await expect(page.getByText(/box trio/i)).toBeVisible();

    // Plan Premium = "Le plus choisi"
    await expect(page.getByText(/le plus choisi/i)).toBeVisible();

    // Section "Ce mois-ci dans la box"
    await expect(page.getByText(/chapitre n°5/i)).toBeVisible();

    // Témoignages
    await expect(page.getByText(/témoignages abonnées/i)).toBeVisible();

    // FAQ
    await expect(page.getByText(/questions fréquentes/i)).toBeVisible();
  });

  test('clic CTA Premium dirige vers /checkout?subscribe=box-premium', async ({ page }) => {
    await page.goto('/box-mensuelle#plans');

    // Trouver le CTA dans la card Premium (le « plus choisi »)
    const premiumCta = page.getByRole('link', { name: /choisir box premium/i });
    await expect(premiumCta).toBeVisible();
    await expect(premiumCta).toHaveAttribute('href', /\/checkout\?subscribe=box-premium/);
  });

  test('section "Offrir l\'abonnement" présente', async ({ page }) => {
    await page.goto('/box-mensuelle#cadeau');
    await expect(page.getByRole('heading', { name: /offrir l['’]abonnement/i })).toBeVisible();
    const giftLink = page.getByRole('link', { name: /offrir une box/i });
    await expect(giftLink).toBeVisible();
    await expect(giftLink).toHaveAttribute('href', /\/cartes-cadeaux/);
  });
});
