# Performance — Atelier Frisson

**Objectifs Core Web Vitals P75 (mobile) : LCP < 1.5s · CLS < 0.05 · INP < 100ms.**

## Techniques obligatoires

- **Server Components par défaut.** `"use client"` uniquement si hooks
  React ou event handlers. Chaque `"use client"` doit être justifié en
  commentaire.
- **Partial Prerendering (PPR)** activé dans `next.config.ts`. Composer
  les pages avec un squelette static + suspense sur les fragments dynamiques.
- **ISR** pour produits (`revalidate: 60`), articles (`revalidate: 3600`),
  pages FORJA (`revalidate: 86400`).

## Images

- `next/image` partout. Jamais de `<img>` brut.
- Formats AVIF > WebP > PNG (configuré dans `next.config.ts`).
- `priority` uniquement sur la hero image above-the-fold.
- `placeholder="blur"` + `blurDataURL` pour les images produits.
- `alt` riche, descriptif, sans keyword stuffing.
- Tailles responsive via `sizes` cohérent avec la grille.

## Vidéo (Mux)

- HLS adaptatif natif.
- Poster auto < 150KB.
- `preload="metadata"` uniquement.
- Fallback image si `prefers-reduced-motion: reduce` ou connexion 2G.

## Typographies

- `next/font/google` avec `display: 'swap'`, `preload: true`, `subsets: ['latin']`.
- 2 familles seulement (Bodoni Moda + Inter).
- Weights : uniquement ceux utilisés (400, 500, 600 pour Inter ; 400, 500,
  600, 700 pour Bodoni + italic).

## Bundle

- **First load JS < 120KB gzipped** (monitoring à chaque build).
- `optimizePackageImports` pour `lucide-react`, `date-fns` (déjà activé).
- Dynamic imports pour les modules lourds (TipTap admin, Mux player,
  PostHog recorder).
- Pas de CSS-in-JS runtime (Tailwind v4 only).

## 3rd-party

- **Partytown** pour Klaviyo, PostHog autoCapture, GA si ajouté.
- Sentry : sample rate 10% en prod, traces 5%.
- Consentement préalable avant chargement de tout cookie non strictly-necessary.

## Mesure

- Vercel Speed Insights activé dès Sprint 3.
- Lighthouse CI en Sprint 7 (fail PR si régression > 5%).
- `pnpm analyze` pour bundle inspection locale.

## Layout & CLS

- Toujours `width`/`height` sur images et iframes.
- Web fonts `display: swap` (déjà).
- Skeleton loaders (shadcn) pour async UI.
- Pas de layout shift dû aux ads (jamais d'ads externes).
