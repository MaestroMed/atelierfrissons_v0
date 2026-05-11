import { test, expect } from '@playwright/test';

/**
 * Scénario 4 — Achat carte cadeau
 *
 * Parcours :
 *   1. Visite /cartes-cadeaux
 *   2. Vérifie hero + 4 étapes + formulaire
 *   3. Sélectionne montant 100 €
 *   4. Sélectionne format physical card (+9 €)
 *   5. Remplit destinataire + expéditeur + date + accepte CGV
 *   6. Soumet → state success avec orderRef simulé
 */

test.describe('Carte cadeau — achat', () => {
  test('landing /cartes-cadeaux structure complète', async ({ page }) => {
    await page.goto('/cartes-cadeaux');

    // Hero
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/cartes/i);

    // 4 étapes
    await expect(page.getByText(/01.*choisir le montant/i)).toBeVisible();
    await expect(page.getByText(/02.*composer la carte/i)).toBeVisible();
    await expect(page.getByText(/03.*choisir la date/i)).toBeVisible();
    await expect(page.getByText(/04.*recevoir la confirmation/i)).toBeVisible();

    // Formulaire présent
    await expect(page.getByText(/01.*montant/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /50 €/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /100 €/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /150 €/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /200 €/ })).toBeVisible();
  });

  test('formulaire validation — soumission incomplète refusée', async ({ page }) => {
    await page.goto('/cartes-cadeaux');

    // Sélectionne 100 €
    await page.getByRole('button', { name: /100 €/ }).click();

    // Soumet sans remplir le reste
    await page.getByRole('button', { name: /procéder au paiement/i }).click();

    // Erreur visible
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 3000 });
  });

  test('formulaire complet → success state', async ({ page }) => {
    await page.goto('/cartes-cadeaux');

    // Montant 100
    await page.getByRole('button', { name: /100 €/ }).click();

    // Destinataire
    await page.getByLabel(/nom du destinataire/i).fill('Camille Mercier');
    await page.getByLabel(/email du destinataire/i).fill('camille@test.fr');

    // Message + date (date par défaut = aujourd'hui, donc OK)
    await page.getByLabel(/message/i).fill('Joyeux anniversaire !');

    // Expéditeur
    await page.getByLabel(/votre nom/i).fill('Mehdi');
    await page.getByLabel(/votre email/i).fill('mehdi@test.fr');

    // Accepte CGV
    await page.getByRole('checkbox').last().check();

    // Soumet
    await page.getByRole('button', { name: /procéder au paiement/i }).click();

    // Success state visible (stub déterministe, renvoie orderRef)
    await expect(page.getByText(/référence AF-GC-/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/un email de confirmation/i)).toBeVisible();
  });
});
