# Accessibilité — WCAG 2.2 AA / RGAA

**Objectif : respecter WCAG 2.2 AA + obligations RGAA FR (sites
e-commerce > 250 salariés ou CA > 250M€ — anticipation projet).**

## Bases non négociables

- `<html lang="fr">` partout (déjà dans `app/layout.tsx`).
- Skip link « Aller au contenu principal » visible au focus (déjà en place).
- Hiérarchie `<h1>` → `<h6>` correcte, un seul `<h1>` par page.
- Landmarks sémantiques : `<header>`, `<main id="contenu-principal">`,
  `<footer>`, `<nav aria-label="…">`, `<section aria-labelledby="…">`.
- Tous les `<img>` / `next/image` avec `alt` descriptif (vide si décoratif :
  `alt=""` + `aria-hidden`).
- SVG décoratifs : `aria-hidden="true"` + `role="presentation"`.
- SVG informatifs : `<title>` ou `aria-label`.
- Contrast AA : texte/fond ≥ 4.5:1 (≥ 3:1 pour large text). Vérifier toute
  combinaison or/ivoire ou or/noir avec un outil (Chrome DevTools, axe).

## Focus & clavier

- `:focus-visible` ring or champagne déjà configuré dans `globals.css`.
- Ordre de tabulation logique — ne pas utiliser `tabindex > 0`.
- Chaque interaction souris doit être disponible au clavier.
- Dialogs (AgeGate, Sheet) : focus trap, `Esc` pour fermer, focus restauré.
- Menus drop-down : `aria-expanded`, `aria-haspopup`, `aria-controls`.

## Formulaires

- `<label>` lié à chaque `<input>` (`htmlFor` / `id`).
- Erreurs : `aria-invalid`, `aria-describedby` vers le message d'erreur,
  `role="alert"` pour feedback live.
- Groupes de champs : `<fieldset>` + `<legend>`.

## Médias

- Vidéos Mux : sous-titres français + transcription pour les hero vidéos.
- `prefers-reduced-motion` respecté (fallback poster pour videos, animations
  désactivées — déjà géré dans `globals.css`).
- Autoplay uniquement si muted et `prefers-reduced-motion: no-preference`.

## Checkout & Age Gate

- Age Gate : `role="dialog"` + `aria-modal="true"` + `aria-labelledby` +
  `aria-describedby` (déjà en place).
- Boutons « Tout accepter » / « Tout refuser » à proéminence égale (CNIL).
- Sélecteurs de consentement : vraie `<input type="checkbox">` (label visible).

## Tests automatiques

- Lighthouse CI : objectif a11y score ≥ 95.
- axe-core intégré en Sprint 7 (avant go-live).
- Playwright E2E pour les parcours critiques (checkout, auth, age gate).
