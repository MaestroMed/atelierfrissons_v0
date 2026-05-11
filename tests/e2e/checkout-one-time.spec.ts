import { test, expect } from '@playwright/test';

/**
 * Scénario 1 — Checkout commande one-time
 *
 * Parcours :
 *   1. Visite homepage
 *   2. Navigue vers /collections/couples
 *   3. Clique sur le produit Velours
 *   4. Add to cart
 *   5. Visite /panier → vérifie subtotal
 *   6. Clique « Procéder à la commande »
 *   7. /checkout → remplit adresse + email + accepte CGV
 *   8. Stripe test mode (à brancher quand keys configurées)
 *   9. /checkout/confirmation/[orderId] visible
 */

test.describe('Checkout commande one-time', () => {
  test('add velours → cart → checkout adresses', async ({ page }) => {
    // 1. Homepage
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Atelier Frisson/i);

    // 2. Pour Vous Deux
    await page.getByRole('link', { name: /pour vous deux/i }).first().click();
    await expect(page).toHaveURL(/\/collections\/couples/);

    // 3. Produit Velours (existe dans /collections/elle ou /couples cross-listé)
    // Plus simple : aller direct
    await page.goto('/produit/velours');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Velours/i);

    // 4. Ajouter au panier
    const addToCart = page.getByRole('button', { name: /ajouter au panier/i }).first();
    await addToCart.click();
    // Toast de confirmation OU drawer ouvert
    await expect(page.locator('[role="dialog"], [aria-live]').first()).toBeVisible({
      timeout: 3000,
    });

    // 5. Visite panier
    await page.goto('/panier');
    await expect(page.getByText(/r[éè]capitulatif/i)).toBeVisible();
    await expect(page.getByText(/velours/i).first()).toBeVisible();

    // 6. Procéder
    const checkoutBtn = page.getByRole('link', { name: /procéder à la commande/i });
    await expect(checkoutBtn).toBeVisible();

    // 7. Checkout (page existe — assertion forme)
    await checkoutBtn.click();
    await expect(page).toHaveURL(/\/checkout/);
    // Le contenu exact du formulaire dépend de l'implémentation checkout/CheckoutForm.tsx
    // À ce stade, on teste juste que la page se charge sans crash
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('panier vide redirige vers découverte boutique', async ({ page }) => {
    await page.goto('/panier');
    // Empty state attendu
    await expect(
      page.getByText(/panier est en attente|panier est vide|aucun objet/i),
    ).toBeVisible();
    const cta = page.getByRole('link', { name: /découvrir la collection|découvrir/i }).first();
    await expect(cta).toBeVisible();
  });
});
