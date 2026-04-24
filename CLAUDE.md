@AGENTS.md

# CLAUDE.md — ATELIER FRISSON

**Production brief v3.0 — 24 avril 2026**
**Client : Odelie (Sandrine Ada Ben Ayish) — Prestataire : Numelite SASU (Mehdi Nafaa)**
**Contrat : Setup 4 000 € HT + Retainer 3 000 € HT/mois × 12 mois (Pack SEO Forge inclus)**

---

## 0. RÈGLES POUR CLAUDE CODE — À LIRE AVANT TOUT

Ce document est la **source de vérité** du projet. Il est volumineux par nécessité : Atelier Frisson n'est pas un e-commerce standard, c'est un projet sensible (secteur adulte positionné wellness, conformité Arcom, paiement high-risk, SEO YMYL) qui demande une rigueur supérieure à un projet classique.

Avant toute action :

1. **Lire ce document en entier** une fois, puis revenir aux sections pertinentes.
2. **Lire aussi** `docs/SEO_STRATEGY.md` (stratégie éditoriale et exemples de pages) et `docs/FORGE_WORKFLOW.md` (intégration FORJA pSEO).
3. **Toujours utiliser shadcn/ui via CLI** (`npx shadcn@latest add`) — jamais de copie manuelle.
4. **Toujours Server Components par défaut** — `"use client"` uniquement si hooks React ou event handlers.
5. **Toujours typer strictement** — pas de `any`, pas de `as unknown as`.
6. **Jamais de secret en dur** — tout passe par `.env.local` et variables Vercel.
7. **Jamais de vocabulaire explicite** dans le code, les variables, les commentaires — voir section "Règles éditoriales".
8. **Avant un commit** : `pnpm typecheck && pnpm lint && pnpm test`.
9. **En cas de doute** sur une décision stratégique → s'arrêter, proposer 2-3 options avec trade-offs, demander validation.
10. **Avancer par étapes validées** — pas de livraison monolithique. Chaque sprint a un review point.

---

## 1. VISION & CONTEXTE

### 1.1 Le projet

**Atelier Frisson** est une maison française dédiée au bien-être intime féminin et au rituel de couple, positionnée sur le segment **wellness premium haut de gamme**. La cliente, Odelie, est entrepreneuse basée en Israël et vend sur le marché français en dropshipping via fournisseurs chinois (CJdropshipping, entrepôt Pologne UE prioritaire).

**Domaines** : atelierfrisson.fr (principal) + atelierfrisson.com (défensif).

### 1.2 Positionnement critique

Le site doit pouvoir **passer pour une marque de cosmétiques haut de gamme ou de parfumerie niche**. Références visuelles validées avec la cliente :

- **Dior Haute Couture** (typographie Didone, solennité, esprit couture)
- **Byredo, Le Labo, Tom Ford Beauty** (photographie produit cinématique, moody)
- **Aesop, Typology, Glossier** (minimalisme éditorial, wellness codes)
- **Smile Makers, Dame Products, Maude, Womanizer** (codes sectoriels wellness intime)

La DA validée est le split **JOUR / NUIT** :
- Moitié crème ivoire (#F2EADF)
- Moitié rouge laqué profond (#8B1424)
- Typographie Didone dorée (#C9A36B)
- Monogramme "AF" discret sur les produits
- Tagline : *"Pour tous les rituels. Pour tous les moments."*

### 1.3 Test de validation éditoriale

Pour chaque page, chaque texte, chaque visuel, appliquer ce test :
> *"Est-ce qu'une femme CSP+ parisienne partagerait spontanément ce lien à une amie comme elle partagerait un lien Typology ou Byredo ?"*

Si oui → OK. Si non → reformuler.

### 1.4 Objectifs business

- **CA cible mois 1-3** : 3 000 à 8 000 € / mois
- **CA cible mois 6** : 15 000 à 25 000 € / mois
- **CA cible mois 12** : 25 000 à 50 000 € / mois
- **Panier moyen cible** : 95 à 140 €
- **Taux de conversion cible** : 1,5 à 2,5 %
- **SEO cible mois 12** : 5 000 à 15 000 visites organiques / mois, 150-400 keywords top 10

### 1.5 Statut juridique — IMPORTANT

La cliente est actuellement en **Osek Patur** (équivalent micro-entrepreneur israélien), plafond CA ~30 000 €/an. Elle est en cours de création d'une **SASU française** pour exploiter Atelier Frisson (démarche en parallèle du développement, 2-4 semaines).

**Impact sur le dev** : le site peut être développé. La mise en production est conditionnée à :
- K-Bis SASU France reçu
- Compte bancaire pro Qonto ouvert
- Compte CCBill validé (2-5 semaines après K-Bis)
- Compte CJdropshipping B2B ouvert
- Représentant fiscal UE non requis (SASU = entité UE)

Tant que la structure n'est pas en place, **pas de mise en production**. Le code est prêt, les intégrations paiement/fournisseur sont en mode stub/mock en dev.

---

## 2. STACK TECHNIQUE — FIGÉE

```
Framework          Next.js 16 (App Router, Server Components, Server Actions, PPR)
Language           TypeScript 5 strict mode
Styling            Tailwind CSS v4 + shadcn/ui (tokens custom)
Database           Supabase PostgreSQL (Pro plan pour PITR + backups)
ORM                Drizzle ORM (typé, rapide, migrations propres)
Auth               Supabase Auth (magic link primaire, 2FA TOTP optionnel client / obligatoire admin)
Storage            Supabase Storage (images produits, assets CMS)
Payment dev        Stripe en mode test
Payment prod       CCBill (high-risk adulte validé)
Email transac      Resend + React Email
Email marketing    Klaviyo (segments, flows, abandonment)
Video              Mux (HLS adaptatif, preview, posters auto, bandwidth optimisé)
Age verif          VerifyMy / AnonymAGE (conformité Arcom double anonymat)
Hosting            Vercel Pro (edge network, ISR, image optimization)
CDN + Security     Cloudflare (WAF, bot management, DDoS, rate limiting)
Analytics          Vercel Analytics + PostHog (events, funnels, heatmaps)
Error tracking     Sentry (erreurs, performance, session replay anonymisé)
Search             MeiliSearch (self-hosted) ou Algolia (selon budget)
Rate limiting      Upstash Redis
Testing            Vitest (unit) + Playwright (E2E) + MSW (mocks)
CI/CD              GitHub Actions → Vercel (preview par branche)
Linting            ESLint + Prettier + Husky + lint-staged
Monitoring         Vercel Observability + UptimeRobot (external)
Content factory    FORJA (pSEO generator custom Numelite — voir FORGE_WORKFLOW.md)
Rich text editor   TipTap (admin CMS)
```

### 2.1 Justifications des choix sensibles

**CCBill vs Stripe** : Stripe interdit la vente d'objets intimes adultes (clause 4.a de leur Prohibited Businesses). CCBill est le standard historique high-risk adulte (validation 2-5 semaines, frais 3-6 % par transaction). En dev on utilise Stripe en mode test pour itérer vite, on bascule CCBill en staging avant production.

**Mux vs Vercel video** : Mux gère le HLS adaptatif, les posters automatiques, les thumbnails, et surtout le bandwidth optimization critique pour les hero videos. Coût : ~0,08 $/1000 min vue. ROI largement démontré sur performance + taux de conversion.

**Cloudflare devant Vercel** : double CDN volontaire. Cloudflare en amont pour le WAF, bot management, rate limiting, règles "challenge adult content". Vercel en aval pour l'edge computing et l'image optimization.

**FORJA intégré** : la cliente a souscrit au Pack SEO Forge qui inclut 1 200 pages programmatiques premium générées via FORJA (factory Numelite). Voir `docs/FORGE_WORKFLOW.md`.

---

## 3. ARCHITECTURE DU PROJET

```
atelier-frisson/
├── CLAUDE.md                           # Ce fichier — source de vérité
├── .claude/
│   ├── rules/
│   │   ├── content.md                  # Règles éditoriales strictes
│   │   ├── seo.md                      # Conventions SEO
│   │   ├── accessibility.md            # WCAG 2.2 AA
│   │   ├── security.md                 # CSP, sanitization, etc.
│   │   └── performance.md              # Budget perf + techniques
│   ├── agents/
│   │   ├── product-writer.md           # Rédaction fiches wellness
│   │   ├── seo-editor.md               # Articles SEO YMYL-safe
│   │   └── a11y-auditor.md             # Audit accessibilité
│   └── skills/
│       └── atelier-frisson-brand/      # Skill chartegraphique
│
├── docs/
│   ├── SEO_STRATEGY.md                 # Stratégie SEO complète + exemples pages
│   ├── FORGE_WORKFLOW.md               # Intégration FORJA pSEO
│   ├── COMPETITIVE_ANALYSIS.md         # Analyse concurrence
│   ├── SECURITY.md                     # Politique sécurité détaillée
│   ├── PERFORMANCE.md                  # Budget perf + techniques
│   ├── COMPLIANCE.md                   # Arcom + RGPD + TVA
│   ├── BACKOFFICE_SPEC.md              # Spec détaillée admin 18 modules
│   └── SESSION_HISTORY.md              # Journal des sessions Claude Code
│
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    # Homepage split JOUR/NUIT
│   │   ├── a-propos/page.tsx
│   │   ├── rituels/                    # Blog éditorial
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── categorie/[cat]/page.tsx
│   │   ├── guides/                     # Guides piliers longs
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── glossaire/page.tsx          # Glossaire wellness intime
│   │   └── layout.tsx
│   │
│   ├── (shop)/
│   │   ├── boutique/
│   │   │   ├── page.tsx                # Grille complète
│   │   │   └── [categorie]/page.tsx    # Catégorie
│   │   ├── produit/
│   │   │   └── [slug]/page.tsx
│   │   ├── collections/
│   │   │   ├── page.tsx
│   │   │   ├── jour/page.tsx
│   │   │   └── nuit/page.tsx
│   │   ├── panier/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx                # Checkout 3 étapes
│   │   │   └── confirmation/[orderId]/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (forge)/                        # Pages générées par FORJA
│   │   ├── livraison/[ville]/page.tsx  # 500 pages livraison ville
│   │   ├── conseils/[slug]/page.tsx    # Pages longue traîne
│   │   └── layout.tsx
│   │
│   ├── (account)/
│   │   ├── compte/
│   │   │   ├── page.tsx
│   │   │   ├── commandes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [orderId]/page.tsx
│   │   │   ├── adresses/page.tsx
│   │   │   ├── preferences/page.tsx
│   │   │   └── securite/page.tsx       # 2FA, sessions
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── callback/route.ts
│   │   │   └── logout/route.ts
│   │   └── layout.tsx
│   │
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx                # Dashboard KPIs
│   │   │   ├── commandes/
│   │   │   ├── produits/
│   │   │   ├── clients/
│   │   │   ├── categories/
│   │   │   ├── promotions/
│   │   │   ├── stocks/
│   │   │   ├── cms/                    # Articles + pages
│   │   │   ├── forge/                  # Gestion pages FORJA
│   │   │   ├── seo/                    # Redirections, sitemap
│   │   │   ├── analytics/
│   │   │   ├── avis/
│   │   │   ├── emails/
│   │   │   ├── livraisons/
│   │   │   ├── fournisseurs/
│   │   │   ├── finances/
│   │   │   ├── parametres/
│   │   │   ├── utilisateurs/
│   │   │   └── audit/
│   │   └── layout.tsx
│   │
│   ├── (legal)/
│   │   ├── cgv/page.tsx
│   │   ├── cgu/page.tsx
│   │   ├── mentions-legales/page.tsx
│   │   ├── confidentialite/page.tsx
│   │   ├── cookies/page.tsx
│   │   ├── livraison/page.tsx
│   │   ├── retours/page.tsx
│   │   └── accessibilite/page.tsx
│   │
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── ccbill/route.ts
│   │   │   ├── stripe/route.ts
│   │   │   ├── cj/route.ts
│   │   │   └── klaviyo/route.ts
│   │   ├── cron/
│   │   │   ├── sync-products/route.ts  # Daily CJ sync
│   │   │   ├── sitemap/route.ts        # Regen nightly
│   │   │   ├── cleanup-carts/route.ts
│   │   │   └── forge-publish/route.ts  # Publication pages FORJA
│   │   ├── auth/
│   │   │   └── verify-age/route.ts
│   │   ├── forge/
│   │   │   └── ingest/route.ts         # Webhook ingestion FORJA
│   │   ├── search/route.ts
│   │   └── og/route.tsx                # OG images dynamiques
│   │
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── manifest.ts
│   ├── layout.tsx                      # Root (AgeGate wrapper)
│   ├── globals.css
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                             # shadcn primitives
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AgeGate.tsx
│   │   ├── CookieBanner.tsx
│   │   └── MobileNav.tsx
│   ├── marketing/
│   │   ├── HeroSplit.tsx               # Hero JOUR/NUIT
│   │   ├── ProductShowcase.tsx
│   │   ├── EditorialSection.tsx
│   │   ├── Newsletter.tsx
│   │   ├── TrustBadges.tsx
│   │   └── ArticleCard.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductGalleryVideo.tsx     # Mux player
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSort.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── CheckoutSteps.tsx
│   │   └── OrderSummary.tsx
│   ├── forge/
│   │   ├── ForgePageRenderer.tsx       # Rendu pages FORJA
│   │   └── ForgeLocalHero.tsx          # Template livraison/ville
│   ├── admin/
│   │   ├── DataTable.tsx
│   │   ├── StatsCard.tsx
│   │   ├── Chart.tsx
│   │   ├── RichTextEditor.tsx          # TipTap
│   │   ├── ImageUploader.tsx
│   │   └── (modules admin complets)
│   └── shared/
│       ├── OptimizedImage.tsx
│       ├── VideoPlayer.tsx             # Mux wrapper
│       ├── BreadcrumbSchema.tsx
│       └── SearchBar.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   └── middleware.ts
│   ├── db/
│   │   ├── schema.ts                   # Drizzle complet
│   │   ├── queries/
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── customers.ts
│   │   │   ├── articles.ts
│   │   │   └── forge.ts                # Queries FORJA
│   │   └── index.ts
│   ├── cj/
│   │   ├── client.ts
│   │   ├── sync-products.ts
│   │   ├── create-order.ts
│   │   └── webhook-handler.ts
│   ├── ccbill/
│   │   ├── client.ts
│   │   ├── signature.ts
│   │   └── refund.ts
│   ├── stripe/
│   │   └── client.ts                   # Dev uniquement
│   ├── klaviyo/
│   │   ├── track.ts
│   │   ├── subscribe.ts
│   │   └── flows.ts
│   ├── mux/
│   │   ├── upload.ts
│   │   └── player.ts
│   ├── resend/
│   │   ├── client.ts
│   │   └── templates.ts
│   ├── forge/
│   │   ├── ingest.ts                   # Traitement pages FORJA
│   │   ├── validator.ts                # Validation qualité
│   │   └── publish.ts                  # Publication programmée
│   ├── seo/
│   │   ├── metadata.ts
│   │   ├── structured-data.ts
│   │   └── sitemap-builder.ts
│   ├── search/
│   │   └── meili-client.ts
│   ├── security/
│   │   ├── csp.ts
│   │   ├── rate-limit.ts
│   │   └── sanitize.ts
│   ├── analytics/
│   │   └── events.ts
│   └── utils.ts
│
├── types/
│   ├── product.ts
│   ├── order.ts
│   ├── customer.ts
│   ├── forge.ts
│   ├── admin.ts
│   └── supabase.ts                     # Généré par CLI
│
├── content/                            # MDX articles + guides
│   ├── rituels/
│   └── guides/
│
├── public/
├── drizzle/
├── tests/
├── scripts/
│   ├── seed.ts
│   ├── generate-sitemap.ts
│   └── forge-import.ts                 # Import batch FORJA
│
├── middleware.ts                       # Root middleware
├── next.config.ts
├── drizzle.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── package.json
└── README.md
```

---

## 4. DESIGN SYSTEM — ATELIER FRISSON

### 4.1 Tokens `app/globals.css`

```css
@theme {
  /* Palette validée cliente */
  --color-ivoire: #F2EADF;         /* fond crème primaire */
  --color-ivoire-light: #F8F2E9;
  --color-ivoire-dark: #E5DAC9;

  --color-rouge: #8B1424;          /* rouge laqué Dior */
  --color-rouge-light: #A42A3A;
  --color-rouge-dark: #6B0F1B;
  --color-rouge-glossy: #B01828;

  --color-noir: #0A0706;           /* noir profond */
  --color-noir-velours: #1C1A17;   /* off-black texte corps */
  --color-noir-light: #2A2724;

  --color-or: #C9A36B;             /* or champagne */
  --color-or-light: #E0C89A;
  --color-or-dark: #A88449;

  /* Sémantiques */
  --color-success: #4A6B4E;
  --color-warning: #B08D57;
  --color-error: #8B2A2A;
  --color-info: #5A6B7A;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 6rem;

  /* Radius (très minimal, Dior-style) */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-full: 9999px;

  /* Typographies */
  --font-display: 'Bodoni Moda', 'Didot', 'Playfair Display', serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-italic: 'Bodoni Moda', 'Didot', serif;

  /* Echelle typo fluid */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --text-3xl: clamp(2rem, 1.75rem + 1.25vw, 3rem);
  --text-4xl: clamp(2.5rem, 2rem + 2.5vw, 4rem);
  --text-hero: clamp(3rem, 2rem + 5vw, 7rem);
}
```

### 4.2 Principes layout

- **Mobile first strict** — maquettes 375px d'abord
- **Grille 12 colonnes** desktop, max-width 1440px centrée
- **Gouttières** 24px mobile / 40px desktop
- **Whitespace généreux** — jamais de compacité
- **Bordures** 0.5-1px maximum
- **Pas de glassmorphism / gradient / shadow lourde**
- **Ombres discrètes** cartes produits : `0 2px 8px rgba(0,0,0,0.04)`
- **Transitions** 200-300ms ease-out, pas de spring ni bounce
- **Pas de dark mode V1**

### 4.3 Typographies

```ts
// app/layout.tsx
import { Bodoni_Moda, Inter } from 'next/font/google';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});
```

### 4.4 Conventions d'usage typographique

- **H1, H2 titres éditoriaux** : Bodoni Moda 500 ou 600
- **Wordmark hero** : Bodoni Moda 600 avec tracking serré
- **Sous-titres italiques** : Bodoni Moda italic 400
- **Texte courant** : Inter 400
- **UI (boutons, labels)** : Inter 500 en small caps (tracking +0.1em)
- **Prix et chiffres** : Inter 500 tabular-nums

### 4.5 Composants visuels critiques

**HeroSplit.tsx** doit reproduire EXACTEMENT la capture validée par la cliente :

- Split vertical : 50% crème ivoire / 50% rouge laqué
- Produit JOUR à gauche (objet silicone crème, rabbit shape, monogramme AF doré)
- Produit NUIT à droite (même objet en noir glossy sur fond rouge laqué)
- "JOUR" en haut à gauche + "NUIT" en haut à droite (Bodoni regular, taille modeste)
- Centre : wordmark "ATELIER FRISSON" en Bodoni or sur 2 lignes, très grand
- Sous-titre italique : *"Pour tous les rituels. Pour tous les moments."*
- Bouton outline or "DÉCOUVRIR LA COLLECTION"
- Mobile : stacked (JOUR dessus, NUIT dessous), wordmark centré entre
- Animation entrée subtle : fade + légère montée, 600ms
- Support vidéo Mux en background optionnel (phase 2)

---

## 5. BASE DE DONNÉES — SCHÉMA DRIZZLE COMPLET

Fichier : `lib/db/schema.ts`

```ts
import { pgTable, uuid, text, integer, decimal, timestamp, boolean, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey(),                              // = auth.users.id
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth'),
  ageVerifiedAt: timestamp('age_verified_at'),
  ageVerifiedMethod: text('age_verified_method'),          // 'self_declared' | 'verifymy' | 'idxlab'
  marketingConsent: boolean('marketing_consent').default(false).notNull(),
  marketingConsentAt: timestamp('marketing_consent_at'),
  klaviyoProfileId: text('klaviyo_profile_id'),
  notes: text('notes'),
  tags: jsonb('tags').$type<string[]>().default([]),
  ltvCents: integer('ltv_cents').default(0).notNull(),
  totalOrders: integer('total_orders').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  deletedAt: timestamp('deleted_at'),                       // Soft delete RGPD
}, (t) => ({
  emailIdx: uniqueIndex('customers_email_idx').on(t.email),
  klaviyoIdx: index('customers_klaviyo_idx').on(t.klaviyoProfileId),
}));

// ─── ADDRESSES ───────────────────────────────────────────────────────────────
export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }).notNull(),
  type: text('type', { enum: ['shipping', 'billing'] }).notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  company: text('company'),
  line1: text('line1').notNull(),
  line2: text('line2'),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  state: text('state'),
  country: text('country', { length: 2 }).default('FR').notNull(),
  phone: text('phone'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  customerIdx: index('addresses_customer_idx').on(t.customerId),
}));

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  heroImageUrl: text('hero_image_url'),
  parentId: uuid('parent_id'),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  nameShort: text('name_short'),
  tagline: text('tagline'),
  descriptionShort: text('description_short').notNull(),
  descriptionLong: text('description_long'),
  descriptionEditorial: text('description_editorial'),
  specs: jsonb('specs').$type<Record<string, string>>(),
  features: jsonb('features').$type<string[]>().default([]),

  priceCents: integer('price_cents').notNull(),
  compareAtPriceCents: integer('compare_at_price_cents'),
  costCents: integer('cost_cents'),
  currency: text('currency', { length: 3 }).default('EUR').notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('20.00').notNull(),

  images: jsonb('images').$type<Array<{ url: string; alt: string; width: number; height: number }>>().default([]).notNull(),
  videoMuxPlaybackId: text('video_mux_playback_id'),
  videoPosterUrl: text('video_poster_url'),

  categoryId: uuid('category_id').references(() => categories.id),
  collection: text('collection', { enum: ['jour', 'nuit', 'inaugurale', 'signature'] }),
  tags: jsonb('tags').$type<string[]>().default([]),

  supplierId: uuid('supplier_id'),
  supplierSku: text('supplier_sku'),
  supplierProductId: text('supplier_product_id'),
  supplierWarehouse: text('supplier_warehouse'),
  supplierShippingDays: integer('supplier_shipping_days'),

  stockQuantity: integer('stock_quantity').default(0).notNull(),
  stockStatus: text('stock_status', { enum: ['in_stock', 'low_stock', 'out_of_stock', 'preorder'] }).default('in_stock').notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5).notNull(),

  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: jsonb('seo_keywords').$type<string[]>().default([]),
  schemaOrgData: jsonb('schema_org_data'),

  status: text('status', { enum: ['draft', 'active', 'archived'] }).default('draft').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  slugIdx: uniqueIndex('products_slug_idx').on(t.slug),
  statusIdx: index('products_status_idx').on(t.status),
  categoryIdx: index('products_category_idx').on(t.categoryId),
  collectionIdx: index('products_collection_idx').on(t.collection),
}));

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  priceCents: integer('price_cents'),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  supplierSku: text('supplier_sku'),
  images: jsonb('images').$type<Array<{ url: string; alt: string }>>().default([]),
  attributes: jsonb('attributes').$type<Record<string, string>>(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// ─── CARTS ───────────────────────────────────────────────────────────────────
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').unique(),
  customerId: uuid('customer_id').references(() => customers.id),
  discountCode: text('discount_code'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').default(1).notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(),     // AF-2026-000001
  customerId: uuid('customer_id').references(() => customers.id),
  customerEmail: text('customer_email').notNull(),

  status: text('status', {
    enum: ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partial_refund']
  }).default('pending_payment').notNull(),

  subtotalCents: integer('subtotal_cents').notNull(),
  shippingCents: integer('shipping_cents').default(0).notNull(),
  taxCents: integer('tax_cents').notNull(),
  discountCents: integer('discount_cents').default(0).notNull(),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency', { length: 3 }).default('EUR').notNull(),

  paymentProvider: text('payment_provider', { enum: ['stripe', 'ccbill'] }),
  paymentIntentId: text('payment_intent_id'),
  paymentStatus: text('payment_status'),
  paidAt: timestamp('paid_at'),

  shippingMethod: text('shipping_method'),
  shippingAddress: jsonb('shipping_address'),
  billingAddress: jsonb('billing_address'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  trackingNumber: text('tracking_number'),
  trackingUrl: text('tracking_url'),
  carrier: text('carrier'),

  supplierOrderId: text('supplier_order_id'),
  supplierStatus: text('supplier_status'),

  discountCode: text('discount_code'),
  notes: text('notes'),
  customerNote: text('customer_note'),
  giftMessage: text('gift_message'),

  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  customerIdx: index('orders_customer_idx').on(t.customerId),
  statusIdx: index('orders_status_idx').on(t.status),
  emailIdx: index('orders_email_idx').on(t.customerEmail),
  orderNumberIdx: uniqueIndex('orders_order_number_idx').on(t.orderNumber),
}));

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id),
  productName: text('product_name').notNull(),
  productSlug: text('product_slug').notNull(),
  variantName: text('variant_name'),
  sku: text('sku').notNull(),
  imageUrl: text('image_url'),
  quantity: integer('quantity').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
  totalPriceCents: integer('total_price_cents').notNull(),
  taxCents: integer('tax_cents').notNull(),
});

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────
export const promotions = pgTable('promotions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  type: text('type', { enum: ['percentage', 'fixed', 'free_shipping', 'bxgy'] }).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minOrderCents: integer('min_order_cents'),
  maxUsages: integer('max_usages'),
  usageCount: integer('usage_count').default(0).notNull(),
  usagePerCustomer: integer('usage_per_customer').default(1).notNull(),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  isActive: boolean('is_active').default(true).notNull(),
  applicableProducts: jsonb('applicable_products').$type<string[]>(),
  applicableCategories: jsonb('applicable_categories').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  customerId: uuid('customer_id').references(() => customers.id),
  orderId: uuid('order_id').references(() => orders.id),
  rating: integer('rating').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  authorName: text('author_name').notNull(),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false).notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected', 'spam'] }).default('pending').notNull(),
  moderatedBy: uuid('moderated_by'),
  moderatedAt: timestamp('moderated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── ARTICLES (blog/guides éditoriaux) ───────────────────────────────────────
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  contentType: text('content_type', { enum: ['mdx', 'html'] }).default('mdx').notNull(),
  category: text('category'),
  tags: jsonb('tags').$type<string[]>().default([]),
  author: text('author'),
  authorBio: text('author_bio'),
  authorRole: text('author_role'),
  heroImageUrl: text('hero_image_url'),
  heroImageAlt: text('hero_image_alt'),
  readingTimeMinutes: integer('reading_time_minutes'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  schemaOrgData: jsonb('schema_org_data'),
  relatedProductIds: jsonb('related_product_ids').$type<string[]>().default([]),
  relatedArticleIds: jsonb('related_article_ids').$type<string[]>().default([]),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── FORGE PAGES (générées par FORJA pSEO) ───────────────────────────────────
export const forgePages = pgTable('forge_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  template: text('template', { enum: ['livraison_ville', 'conseil_longtail', 'guide_specialise', 'produit_contexte'] }).notNull(),
  title: text('title').notNull(),
  metaDescription: text('meta_description').notNull(),
  content: text('content').notNull(),                       // HTML ou MDX
  contentData: jsonb('content_data'),                       // variables template (ville, produit, etc.)

  // SEO
  h1: text('h1').notNull(),
  keywords: jsonb('keywords').$type<string[]>().default([]),
  canonicalUrl: text('canonical_url'),
  schemaOrgData: jsonb('schema_org_data'),

  // Qualité & modération
  qualityScore: integer('quality_score'),                   // 0-100
  humanReviewed: boolean('human_reviewed').default(false).notNull(),
  reviewedBy: uuid('reviewed_by'),
  reviewedAt: timestamp('reviewed_at'),

  // Monitoring
  indexedByGoogle: boolean('indexed_by_google').default(false),
  lastSearchAppearance: timestamp('last_search_appearance'),
  impressions30d: integer('impressions_30d').default(0),
  clicks30d: integer('clicks_30d').default(0),
  avgPosition30d: decimal('avg_position_30d', { precision: 5, scale: 2 }),

  // State
  status: text('status', { enum: ['draft', 'pending_review', 'published', 'archived', 'penalized'] }).default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  slugIdx: uniqueIndex('forge_pages_slug_idx').on(t.slug),
  statusIdx: index('forge_pages_status_idx').on(t.status),
  templateIdx: index('forge_pages_template_idx').on(t.template),
}));

// ─── SEO REDIRECTS ───────────────────────────────────────────────────────────
export const redirects = pgTable('redirects', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromPath: text('from_path').notNull().unique(),
  toPath: text('to_path').notNull(),
  statusCode: integer('status_code').default(301).notNull(),
  hitsCount: integer('hits_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── MARKETING EVENTS ────────────────────────────────────────────────────────
export const marketingEvents = pgTable('marketing_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id),
  sessionId: text('session_id'),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload'),
  syncedToKlaviyo: boolean('synced_to_klaviyo').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  customerIdx: index('events_customer_idx').on(t.customerId),
  typeIdx: index('events_type_idx').on(t.eventType),
}));

// ─── ADMIN USERS ─────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum: ['owner', 'manager', 'support', 'contributor'] }).notNull(),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  twoFactorSecret: text('two_factor_secret'),
  lastLoginAt: timestamp('last_login_at'),
  lastLoginIp: text('last_login_ip'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── AUDIT LOG ───────────────────────────────────────────────────────────────
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: uuid('actor_id'),
  actorType: text('actor_type', { enum: ['admin', 'customer', 'system', 'anonymous'] }).notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: uuid('resource_id'),
  changes: jsonb('changes'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  actorIdx: index('audit_actor_idx').on(t.actorId),
  resourceIdx: index('audit_resource_idx').on(t.resourceType, t.resourceId),
  createdIdx: index('audit_created_idx').on(t.createdAt),
}));

// ─── INVOICES ────────────────────────────────────────────────────────────────
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  pdfUrl: text('pdf_url'),
  totalHtCents: integer('total_ht_cents').notNull(),
  totalTvaCents: integer('total_tva_cents').notNull(),
  totalTtcCents: integer('total_ttc_cents').notNull(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
});

// ─── NEWSLETTER SUBSCRIBERS ──────────────────────────────────────────────────
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  status: text('status', { enum: ['subscribed', 'unsubscribed', 'bounced'] }).default('subscribed').notNull(),
  source: text('source'),
  confirmedAt: timestamp('confirmed_at'),
  unsubscribedAt: timestamp('unsubscribed_at'),
  klaviyoProfileId: text('klaviyo_profile_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.1 Row Level Security (RLS)

Activer RLS sur TOUTES les tables. Policies critiques :

```sql
-- Products : lecture publique active, écriture admin only
CREATE POLICY "products_read_public" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "products_write_admin" ON products FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
);

-- ForgePages : lecture publique pour status='published', écriture admin
CREATE POLICY "forge_read_published" ON forge_pages FOR SELECT USING (status = 'published');
CREATE POLICY "forge_write_admin" ON forge_pages FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
);

-- Customers : chacun ne voit que son enregistrement
CREATE POLICY "customers_read_own" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "customers_update_own" ON customers FOR UPDATE USING (auth.uid() = id);

-- Orders : idem
CREATE POLICY "orders_read_own" ON orders FOR SELECT USING (auth.uid() = customer_id);

-- Audit log : write-only pour apps, read-only pour owner
CREATE POLICY "audit_write_all" ON audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "audit_read_owner" ON audit_log FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admin_users WHERE role = 'owner')
);
```

---

## 6. PAGES & FONCTIONNALITÉS

### 6.1 Pages publiques marketing

| Route | Description | SEO priorité |
|---|---|---|
| `/` | Homepage split JOUR/NUIT | ★★★ |
| `/a-propos` | Manifesto marque, fondatrice | ★★★ |
| `/rituels` | Liste articles blog | ★★★ |
| `/rituels/[slug]` | Article blog MDX | ★★★ |
| `/rituels/categorie/[cat]` | Filtre catégorie | ★★ |
| `/guides` | Liste guides piliers | ★★★ |
| `/guides/[slug]` | Guide pilier MDX | ★★★ |
| `/glossaire` | Glossaire 50+ termes | ★★ |

### 6.2 Boutique

| Route | Description |
|---|---|
| `/boutique` | Grille + filtres |
| `/boutique/[categorie]` | Grille catégorie |
| `/produit/[slug]` | Fiche produit premium |
| `/collections` | Liste collections |
| `/collections/jour` | Collection JOUR |
| `/collections/nuit` | Collection NUIT |
| `/panier` | Page panier |
| `/checkout` | Checkout 3 étapes |
| `/checkout/confirmation/[orderId]` | Confirmation |

### 6.3 Pages FORJA (pSEO)

| Route | Description |
|---|---|
| `/livraison/[ville]` | 500 pages livraison ville FR |
| `/conseils/[slug]` | 400 pages longue traîne |
| `/guides/[slug]` | 200 guides spécialisés (mélangé avec éditorial) |

### 6.4 Espace client

| Route | Description |
|---|---|
| `/compte` | Dashboard |
| `/compte/commandes` | Liste + détail |
| `/compte/adresses` | Carnet |
| `/compte/preferences` | Newsletter |
| `/compte/securite` | Password, 2FA, sessions |
| `/auth/login` | Magic link |
| `/auth/signup` | Création |

### 6.5 Pages légales

| Route | Contenu |
|---|---|
| `/cgv` | Conditions générales vente |
| `/cgu` | Conditions utilisation |
| `/mentions-legales` | Éditeur, hébergeur, directeur publication |
| `/confidentialite` | RGPD |
| `/cookies` | Politique cookies + préférences |
| `/livraison` | Zones, tarifs, délais |
| `/retours` | Politique 14j + conditions hygiène |
| `/accessibilite` | Déclaration RGAA |

---

## 7. BACK-OFFICE — 18 MODULES

Niveau ambition : **Intershop Premium / Shopify Plus / Magento Commerce**. Utilisable par Odelie sans doc, en français, responsive mobile + desktop.

Voir `docs/BACKOFFICE_SPEC.md` pour détails par module.

**Les 18 modules** :

1. **Dashboard** — KPIs temps réel, graphiques, alertes
2. **Produits** — CRUD + variants + médias Mux + SEO + sync CJ
3. **Commandes** — liste + détail + actions (refund, push CJ, etc.)
4. **Clients** — profils + segments + communication + RGPD
5. **Catégories** — taxonomie drag & drop
6. **Promotions** — codes, bundles, flash sales
7. **Stocks** — vue consolidée multi-entrepôts
8. **CMS** — articles blog + pages (TipTap MDX)
9. **FORJA** — gestion pages programmatiques (validation, monitoring, kill-switch)
10. **SEO** — redirections, sitemap, meta fallbacks
11. **Analytics** — dashboard PostHog embed
12. **Avis** — modération queue
13. **Emails** — templates + historique + logs
14. **Livraisons** — zones + tarifs + transporteurs
15. **Fournisseurs** — stats CJ + credentials
16. **Finances** — rapports TVA + factures + refunds + export compta
17. **Paramètres** — site, contact, légal, fiscal, intégrations
18. **Utilisateurs** — rôles admins + 2FA obligatoire + Audit

---

## 8. SÉCURITÉ — 4 COUCHES

Voir `docs/SECURITY.md`.

**Couche 1 — Cloudflare amont** : WAF OWASP, bot management, rate limiting 100 req/min (20/min auth), DDoS L3/L4/L7, geo-blocking.

**Couche 2 — Next.js middleware** : HSTS preload, CSP nonce-based, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin, Permissions-Policy, cookies HttpOnly+Secure+SameSite=Lax.

**Couche 3 — Application** : zod validation partout, CSRF via Server Actions, upload validation MIME+scan virus, rate limit auth via Upstash Redis.

**Couche 4 — Database** : RLS toutes tables, chiffrement at-rest Supabase, PITR 7j, 2FA secret chiffré applicatif.

### 8.1 Auth

**Clients** : magic link default, password optionnel (12+ chars zxcvbn ≥ 3), 2FA TOTP optionnel, sessions 30j, logout everywhere, rate limit 5 tentatives / 15 min / IP.

**Admins** : magic link + **2FA TOTP OBLIGATOIRE**, sessions 7j max, log IP+UA, alerte email nouvelle IP, rate limit 3 tentatives / 15 min puis lock 1h.

### 8.2 RGPD

- Registre des traitements documenté
- Consentement granulaire (analytics / marketing / personnalisation)
- Droit d'accès : export CSV depuis compte
- Droit à l'oubli : soft-delete immédiat + hard-delete 30j
- Breach notification CNIL < 72h

### 8.3 Arcom (contenu adulte)

- Age Gate modal full-screen à l'arrivée
- Intégration VerifyMy ou AnonymAGE pour double anonymat
- Cookie session 30j
- Logs vérification (preuve en cas de contrôle)

---

## 9. PERFORMANCE

Voir `docs/PERFORMANCE.md`.

### 9.1 Budget Core Web Vitals

| Métrique | P75 mobile | P75 desktop |
|---|---|---|
| LCP | < 1.5s | < 1.0s |
| CLS | < 0.05 | < 0.05 |
| INP | < 100ms | < 50ms |
| TTFB | < 400ms | < 200ms |
| FCP | < 1.0s | < 0.8s |

Bundles : First load JS < 120 KB gzipped, total page < 1 MB hors médias, image hero < 300 KB (AVIF), video poster < 150 KB.

### 9.2 Techniques obligatoires

- Server Components par défaut
- Static + ISR pour produits (revalidate 60s)
- Partial Prerendering (PPR) activé
- `next/image` partout (AVIF auto, blur placeholder)
- **Mux pour hero videos** : HLS adaptatif, poster auto, preload metadata, fallback image si `prefers-reduced-motion` ou 2G
- `next/font` preload
- Dynamic imports pour modules lourds
- Partytown pour scripts tiers
- Service Worker cache offline-first
- Tailwind v4 JIT purge automatique

### 9.3 Monitoring

Vercel Speed Insights + Sentry Performance + Lighthouse CI sur PR (fail si regression > 5 %).

---

## 10. RÈGLES ÉDITORIALES — STRICTES

### 10.1 Vocabulaire AUTORISÉ

objet, objet de rituel, objet intime, rituel, bien-être, intimité, douceur, geste lent, sensualité, plaisir, éveil, sensation, vibration, stimulation, massage, silicone médical, wellness, soin, confidence, exploration, découverte, moment à soi.

### 10.2 Vocabulaire BANNI

sextoy, sex toy, gode, vibro, vibromasseur (en H1/H2 uniquement — accepté dans le corps éditorial si le SEO l'exige), coquin, torride, hot, sexy, chaud, porno, excitant, hardcore.

### 10.3 Ton général

- Style magazine féminin premium (Vogue, Marie Claire, ELLE)
- Phrases ciselées
- Italiques rares, pour l'émotion
- Ponctuation classique, pas de `!` à tout va
- Références culturelles fines (Marivaux, Colette, Beauvoir)
- Jamais de tutoiement dans le copy produit (sauf dans les CTA courts)

### 10.4 Images

- Jamais de corps nus, jamais de visages de modèles
- Objets cadrés proprement, photographie produit premium
- Fonds unis (crème, rouge laqué, noir), jamais cheap
- Lifestyle : mains, tissus, textures, ambiance — jamais de modèle identifié
- Direction photo : chiaroscuro, éclairage directionnel, ombres longues

---

## 11. INTÉGRATIONS — SPÉCIFICATIONS

### 11.1 CJdropshipping

Flow : admin valide catalogue en visio (25-30 produits) → cron nocturne `/api/cron/sync-products` sync stock + prix → checkout confirmé déclenche POST /shopping/order/createOrder à CJ → webhook CJ `order.shipped` met à jour order + email Resend.

Entrepôt Pologne prioritaire (CJPL) pour éviter les douanes UE 2026.

### 11.2 CCBill

Onboarding 2-5 semaines après K-Bis SASU. Docs requis : K-Bis + ID Odelie + RIB Qonto + statuts SASU. Setup 750 $ + 3,5-6 % par transaction + 0,55 $ fixed. Intégration FlexForms iframe. Webhooks : payment.succeeded, payment.failed, refund, chargeback.

### 11.3 Stripe (DEV uniquement)

Mode test pour itérer en dev. À désactiver totalement en prod. Never accept real Stripe payments — compte sera banni.

### 11.4 Resend

Templates : welcome, verify email, magic link, order confirmation, shipping, delivery, password reset, 2FA code.

### 11.5 Klaviyo

Flows : welcome series (3 emails), abandoned cart (3 emails / 7j), browse abandonment, post-purchase (review request), win-back 60j, VIP > 500 €.

Events : Viewed Product, Added to Cart, Started Checkout, Placed Order, Fulfilled Order.

### 11.6 Mux

Upload via signed URL, playback Mux Player React, signed URLs anti-hotlink, Mux Data analytics.

### 11.7 FORJA (factory pSEO Numelite)

Voir `docs/FORGE_WORKFLOW.md`.

FORJA génère 1 200 pages premium sur 12 mois. Ingestion via webhook `/api/forge/ingest`. Stockage dans table `forge_pages`. Validation humaine obligatoire (admin `/admin/forge`) avant passage status = 'published'. Monitoring qualité via Search Console API. Kill-switch global si Google pénalise.

### 11.8 Sentry

Errors + Performance + Session replay (anonymisé RGPD). Alertes Slack si erreur critique > 1 %.

---

## 12. CONFORMITÉ LÉGALE — CHECKLIST

- [ ] SIRET / SIREN / TVA intra affichés (footer + factures)
- [ ] Mentions légales complètes
- [ ] CGV conformes L221-5 Code conso
- [ ] Politique confidentialité RGPD
- [ ] Bandeau cookies CNIL (Axeptio ou équivalent)
- [ ] Age Gate Arcom à l'arrivée
- [ ] Double anonymat vérification âge
- [ ] Représentant fiscal UE : **NON REQUIS** (SASU France = entité UE)
- [ ] TVA 20 % appliquée automatiquement
- [ ] Facture conforme (mentions obligatoires)
- [ ] Droit de rétractation 14j affiché
- [ ] Exclusion rétractation produits intimes descellés (argumentée hygiène, art. L221-28 5°)
- [ ] Accessibilité RGAA AA
- [ ] Hébergement UE (Supabase EU region Paris/Frankfurt)

---

## 13. WORKFLOW DE DÉVELOPPEMENT — 7 SPRINTS

### Sprint 1 — Fondations (Semaine 1)

**J1-2** : Bootstrap Next.js 16 + TS + Tailwind v4 + tokens + fonts + shadcn + structure dossiers
**J3-4** : Supabase EU + schema Drizzle complet + migrations + RLS + seed
**J5** : Root layout + Header/Footer/MobileNav + AgeGate + CookieBanner + Homepage HeroSplit

Livrable : projet bootstrappé, homepage visible fidèle à la capture validée.

### Sprint 2 — Boutique (Semaine 2)

Page boutique + filtres + tri + fiche produit premium (schema.org complet) + collections JOUR/NUIT + panier drawer + intégration CJ sync (stub en dev).

Livrable : boutique navigable avec 5-8 produits seedés.

### Sprint 3 — Checkout & Account (Semaine 3)

Auth Supabase magic link + espace client (commandes, adresses, sécurité) + checkout 3 étapes + Stripe test + Resend + Klaviyo + emails transactionnels complets.

Livrable : parcours commande complet testable bout-en-bout.

### Sprint 4 — Back-office partie 1 (Semaine 4)

Layout admin + 2FA obligatoire + Dashboard KPIs + modules Produits, Commandes, Clients, Catégories, Promotions, Stocks.

Livrable : Odelie peut gérer catalogue + commandes sans intervention dev.

### Sprint 5 — Back-office partie 2 + FORJA (Semaine 5)

Modules CMS + FORJA (validation pages) + SEO + Analytics + Avis + Emails + Livraisons + Fournisseurs + Finances + Paramètres + Utilisateurs + Audit.

Livrable : back-office complet 18 modules opérationnels.

### Sprint 6 — SEO & Contenu (Semaine 6)

Blog + guides MDX + 3 articles + 1 guide pilier rédigés selon SEO_STRATEGY.md + sitemap dynamique + robots + structured data + toutes pages légales rédigées + premiers lots FORJA ingérés.

Livrable : site prêt à être indexé par Google, contenu éditorial initial en place.

### Sprint 7 — Polish & Launch (Semaine 7)

Tests E2E Playwright (checkout, auth, age gate, admin) + audit a11y + audit sécu OWASP + intégration CCBill staging (après K-Bis SASU reçu) + migration prod + Sentry activé + documentation handover (README + CLAUDE.md à jour + video Loom démo back-office pour Odelie).

Livrable : site live ou prêt pour le go-live dès que CCBill validé.

---

## 14. COMMANDES

```bash
# Dev
pnpm dev                  # Local
pnpm build                # Production build
pnpm start                # Production local

# DB
pnpm db:generate          # Drizzle migrations
pnpm db:push              # Apply to Supabase
pnpm db:studio            # Drizzle Studio UI
pnpm db:seed              # Seed dev data
pnpm supabase:types       # Regen TS types

# Qualité
pnpm typecheck            # tsc --noEmit
pnpm lint                 # ESLint
pnpm lint:fix             # ESLint --fix
pnpm format               # Prettier

# Tests
pnpm test                 # Vitest unit
pnpm test:e2e             # Playwright
pnpm test:e2e:ui          # Playwright UI mode

# FORJA
pnpm forge:import         # Import batch pages FORJA depuis JSON
pnpm forge:validate       # Validation qualité batch

# Utils
pnpm analyze              # Bundle analyzer
pnpm lighthouse           # Lighthouse CI local
```

---

## 15. VARIABLES D'ENVIRONNEMENT

```bash
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Stripe dev
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# CCBill prod (rempli après onboarding)
CCBILL_ACCOUNT_ID=
CCBILL_SUB_ACCOUNT=
CCBILL_SALT=
CCBILL_WEBHOOK_SECRET=

# CJdropshipping
CJ_API_URL=https://developers.cjdropshipping.com
CJ_API_EMAIL=
CJ_API_KEY=
CJ_WAREHOUSE_CODE=CJPL

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=contact@atelierfrisson.fr

# Klaviyo
KLAVIYO_PUBLIC_KEY=
KLAVIYO_PRIVATE_KEY=

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=

# Age verification
VERIFYMY_API_KEY=
VERIFYMY_MERCHANT_ID=

# Security
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Monitoring
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Search
MEILI_HOST=
MEILI_API_KEY=

# FORJA
FORGE_INGEST_SECRET=
FORGE_WEBHOOK_SECRET=
```

---

## 16. CRITÈRES DE SUCCÈS — LIVRAISON

- [ ] Tests E2E critiques passent (checkout, auth, age gate, admin)
- [ ] Lighthouse ≥ 95 mobile ET desktop
- [ ] Core Web Vitals green partout
- [ ] WCAG 2.2 AA audit automatisé passe
- [ ] Mozilla Observatory : grade A+
- [ ] SSL Labs : grade A+
- [ ] Sitemap + robots.txt + structured data valides (validator.schema.org)
- [ ] Flows Klaviyo actifs
- [ ] Pages légales présentes et relues juridiquement
- [ ] Age Gate fonctionnel
- [ ] Back-office utilisable sans doc (test usabilité avec Odelie)
- [ ] 100 premières pages FORJA validées et publiées
- [ ] Documentation handover (README + CLAUDE.md à jour + video Loom démo)
- [ ] Sentry configuré avec alertes
- [ ] Plan de maintenance M+1 documenté

---

**Fin du brief principal.**

**Documents complémentaires à consulter** :
- `docs/SEO_STRATEGY.md` — stratégie SEO YMYL + exemples pages premium
- `docs/FORGE_WORKFLOW.md` — intégration FORJA pSEO
- `docs/BACKOFFICE_SPEC.md` — spec détaillée 18 modules admin
- `docs/SECURITY.md` — politique sécurité complète
- `docs/PERFORMANCE.md` — budget perf + techniques
- `docs/COMPLIANCE.md` — Arcom + RGPD + TVA
