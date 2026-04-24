# Conventions SEO — Atelier Frisson

**Source de vérité : `docs/SEO_STRATEGY.md` + `CLAUDE.md` §10.**

## Zone YMYL

Secteur traité « Your Money Your Life » par Google. Critères E-E-A-T
appliqués sévèrement → **chaque page** doit avoir :

- Auteur identifié (`Person` ou `Organization` dans schema.org)
- Date de publication + « dernière mise à jour »
- Sources pour affirmations factuelles (HAS, INSERM, Mayo Clinic, NHS…)
- Mentions légales accessibles en 1 clic

## Metadata Next.js (convention projet)

Chaque page (marketing/shop/forge/guide) exporte un `metadata` ou
`generateMetadata()` avec **au minimum** :

- `title` (50-60 chars)
- `description` (140-160 chars, verbes d'action, zéro vocabulaire banni)
- `alternates.canonical` (jamais deux URLs avec le même contenu)
- `openGraph` (title, description, images 1200×630, locale `fr_FR`)
- `twitter` (card `summary_large_image`)
- `robots` : par défaut `{ index: true, follow: true }` — explicit
  `noindex` pour admin, auth, compte, recherche.

## Schema.org (obligatoire)

- `Product` sur fiches produit (prix, disponibilité, aggregateRating,
  merchantReturnPolicy, shippingDetails — cf. `docs/SEO_STRATEGY.md` §6.1)
- `Article` + `Person` sur articles et guides (auteur avec bio/credentials)
- `FAQPage` dès qu'une FAQ est intégrée (produit ou guide)
- `BreadcrumbList` partout (produit / catégorie / article / forge)
- `Organization` + `WebSite` sur la homepage (layout.tsx)

## Contenu programmatique (FORJA)

- Seuil qualité 70/100 minimum. `human_reviewed=true` avant publication.
- ISR 24h (`revalidate: 86400`) sur les pages `/livraison/[ville]`,
  `/conseils/[slug]`.
- Rythme de publication étalé (M1 100 pages → M7-12 50-100/mois).
- Kill-switch admin global (410 Gone + retrait sitemap) en cas de
  signal de pénalité (voir `docs/FORGE_WORKFLOW.md` §4.2).

## Technique

- `sitemap.ts` dynamique (produits + articles + guides + forge publié).
- `robots.ts` bloque `/api/`, `/admin/`, `/compte/`, `/checkout/`, et les
  user-agents IA (`GPTBot`, `CCBot`).
- `canonical` obligatoire, même pour les listings paginés (page 1 canonical).
- Breadcrumbs visibles + schema.org sur toutes les pages internes.
- Alt text riche (descriptif, pas de keyword stuffing).

## Anti-blocage Google

- Zero backlink PBN / adult directories / échange massif.
- Cible 10 backlinks qualité/mois (tier 1 : Madame Figaro, ELLE, Vogue…).
- Monitoring mensuel Search Console + PostHog.
