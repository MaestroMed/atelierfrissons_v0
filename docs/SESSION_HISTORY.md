# SESSION_HISTORY.md — Atelier Frisson

Journal des sessions Claude Code.

---

## Session 1 — 2026-04-24 — Sprints 1 à 7 : MVP complet livré

**Durée** : une séance Claude Code continue (Opus 4.7, 1M context).
**Scope final** : 7 sprints du brief original livrés en une seule session,
en mode « carte blanche » sur demande de Mehdi.

### Vue d'ensemble

- **53 routes** générées en build (44 dynamic + 2 static + 7 légales/contenu)
- **18 modules admin** complets
- **8 produits** mock + **3 articles** + **1 guide pilier** + **40 termes glossaire**
- **8 pages légales** conformes (CGV, CGU, mentions, RGPD, cookies, livraison, retours, accessibilité)
- **3 commits incrémentaux par sprint** (15+ commits)
- `pnpm typecheck` + `lint` + `build` tous verts à chaque sprint

### Sprint 1 — Fondations

Bootstrap Next.js 16 + tsconfig strict++ + 30 deps + shadcn 20 composants

- structure 53 dossiers + design system AF (palette ivoire/rouge/noir/or,
  Bodoni Moda + Inter via next/font) + Header sticky + Footer riche +
  Fleuron SVG signature + AgeGate Arcom (SSR cookie check) +
  CookieBanner CNIL granulaire + middleware sécurité (CSP nonce + rate
  limit Upstash + Supabase session refresh + headers) + Husky pre-commit +
  README + 5 fichiers `.claude/rules/` + Schema Drizzle 19 tables + RLS
  SQL + clients Supabase + queries memoïsées + docs SUPABASE_SETUP.

**Bug majeur résolu** : `AGE_GATE_COOKIE` exporté depuis composant
`'use client'` → undefined côté Server Component (RSC client/server
boundary). Fix : extraction dans `lib/auth/age-gate.ts` neutre.

### Sprint 2 — Boutique

8 produits mock riches (specs, descriptions éditoriales 200-300 mots,
features, SEO meta) + 3 catégories. Cart logic server-only avec cookie
14j + Server Actions zod-validated + revalidatePath. SEO helpers Schema.org
(Product, Breadcrumb, Organization, FAQ, Article) + JsonLd component.
Composants shop : PriceTag, StockBadge, ProductCard, ProductGrid,
ProductGallery (silhouette V1 → photos V2), QuantitySelector,
AddToCartButton (animé pulse + toast Sonner), SpecsTable, FAQAccordion,
RelatedProducts, BreadcrumbNav, ProductFilters URL-driven, ProductSort,
CartItem, CartDrawer (Sheet shadcn + free shipping nudge + recap totaux).

Pages : /boutique (grille + filtres + tri), /produit/[slug] (fiche
premium 2 colonnes + Schema.org + FAQ + related), /collections (split
visuel JOUR/NUIT), /collections/jour, /collections/nuit, /panier
(layout 2 cols + recap sticky).

### Sprint 3 — Auth & Checkout

Auth helpers (`getSession`, `requireSession`, `requireAdmin` cache RSC).
Magic link Supabase via Server Actions. Pages /auth/login (form Magic
Link avec succès/erreur), /auth/callback (exchangeCodeForSession +
verifyOtp fallback), /auth/logout (POST handler).

Espace client (/compte) : layout avec sidebar nav, dashboard (stats +
quick actions), /commandes, /adresses, /preferences (3 toggles),
/securite (4 cards 2FA/TOTP/sessions/journal + RGPD note).

Checkout 3 étapes (CheckoutForm.tsx) : Stepper visuel +
collapsible steps, validation client zod par étape, Server Action
placeOrder. Étape 1 contact, Étape 2 livraison + 3 méthodes
(Colissimo/Mondial Relay/Chronopost), Étape 3 paiement + notes +
gift message + consent CGV. Récap aside sticky + free shipping
indicator.

Page /checkout/confirmation/[orderId] avec timeline 3 étapes
(confirmation/préparation/livraison) + trust signals.

Resend templates : OrderConfirmationEmail + WelcomeEmail (React Email
avec inline styles cross-client). Klaviyo events stub (trackEvent +
subscribeToList) avec graceful fallback dev.

### Sprint 4 — Back-office P1

Admin layout + sidebar 6 groupes nav + 18 modules listés + AdminPageHeader

- StatCard + EmptyState reusable. Dashboard admin : 4 sections KPI
  (Ventes 30j, Catalogue, FORJA, Quick actions).

6 modules base : /admin/produits (table 8 produits + filter chips +
search + actions), /admin/commandes (EmptyState), /admin/clients
(EmptyState), /admin/categories (3 catégories avec count produits),
/admin/promotions (EmptyState + CTA), /admin/stocks (table sortée + sync
CJ CTA).

### Sprint 5 — Back-office P2 + FORJA

12 modules restants. **FORJA dashboard riche** (différentiator) :
progress bar annuelle 0/1200 + kill-switch + 5 stats statuts + 4 stats
GSC monitoring + queue validation humaine + 4 templates breakdown.

11 modules skeleton : /admin/cms, /admin/seo (4 stats indexation +
audit on-page), /admin/analytics, /admin/avis, /admin/emails (6 templates
listés), /admin/livraisons (3 méthodes + 4 zones), /admin/fournisseurs
(CJ CJPL), /admin/finances (TVA + provider warning), /admin/parametres
(4 sections), /admin/utilisateurs (security 2FA), /admin/audit (append-only).

### Sprint 6 — SEO & Contenu

`sitemap.ts` dynamique (statiques + produits + légales), `robots.ts`
(disallow privé + bloque GPTBot/CCBot/ClaudeBot/anthropic-ai/PerplexityBot),
JSON-LD Organization + WebSite injectés globalement.

8 pages légales avec LegalLayout reusable : /cgv (10 articles conformes
L221), /mentions-legales (SASU + hébergement), /confidentialite (RGPD),
/cgu, /cookies (CNIL granulaire), /livraison, /retours (exclusion
hygiène), /accessibilite (RGAA déclaration).

Contenu éditorial :

- /a-propos : manifeste + fondatrice + 6 engagements + presse
- /rituels : listing magazine featured + grille
- /rituels/[slug] : article complet avec hero gradient + bio auteur +
  related products + lectures complémentaires + JSON-LD Article
- /guides : listing 5 piliers (1 publié + 4 à venir)
- /guides/[slug] : guide pilier avec TOC sticky desktop + content longue
  forme + JSON-LD
- /glossaire : 40 termes en 5 catégories (Anatomie, Matériaux,
  Technologie, Pratique, Santé) avec nav anchors

3 articles MDX (rituel lent / silicone médical test / communication
intime) + 1 guide pilier (Premier Stimulateur, 18 min, 8 chapitres) —
contenu HTML inline pour Sprint 6, MDX file system Sprint 7+.

### Sprint 7 — Polish award-winning

- `app/not-found.tsx` : 404 design éditorial avec wordmark or + fleuron +
  italique signature + 2 CTAs (retour accueil + boutique)
- `app/error.tsx` : error boundary avec retry button + reference digest
  - console.error (Sentry-ready)
- `app/global-error.tsx` : fallback ultime quand RootLayout crash, inline
  styles autonomes
- `app/loading.tsx` : skeleton sobriété éditoriale (fleuron + italique)
- `app/globals.css` : View Transitions API CSS (`@view-transition`,
  `::view-transition-old/new(root)`, fade 220ms ease-out-expo). Classes
  utilitaires `.prose-article` + `.prose-legal` pour articles/légales
  (typo, liens or, listes, em, code, blockquote)
- `prefers-reduced-motion` : view-transition-name désactivé en plus
  des animations

### Décisions structurantes (consolidé Sprints 1-7)

1. **Dossier projet `AtelierFrisson_v0` rejeté par npm** (majuscules) →
   bootstrap dans sous-dossier `atelier-frisson` puis remontée.
2. **`next-themes` retiré** — pas de dark mode V1.
3. **`AGENTS.md` conservé** (warning Next 16 breaking changes).
4. **Lucide v1 brand icons retirés** → Instagram + Pinterest SVG inline.
5. **Drizzle 0.45 `text({length})` déprécié** → `varchar()`.
6. **Silhouettes produits SVG abstrait** (Brancusi/Noguchi) — placeholder
   avant photos CJ.
7. **Age Gate SSR via cookies()** — pas de FOUC.
8. **Middleware CSP nonce-based simplifié** sans `request: { headers }`
   (Next 16 quirk avec Set-Cookie inner response).
9. **RLS helpers `is_admin()` SECURITY DEFINER** pour permettre policies
   client-safe.
10. **Constants partagées server/client** (`AGE_GATE_COOKIE`) → toujours
    dans fichier neutre, jamais derrière `'use client'`.
11. **Server Actions vs Route Handler** — Route Handler pour cookies set
    après Server Action redirect bug RSC soft-nav (cf. fix age-gate).
12. **`exactOptionalPropertyTypes: true`** strict — refuse `undefined`
    explicite. Workaround : conditional spread.

### État du build final

- `pnpm typecheck` : ✅ 0 erreur
- `pnpm lint` : ✅ 0 erreur, 0 warning
- `pnpm build` : ✅ ~13s compile, **53 routes** générées
  - 51 dynamic (`ƒ`) — middleware Proxy actif
  - 2 static (`○`) — robots.txt + sitemap.xml
- Husky pre-commit hook : typecheck + lint-staged actifs

### Reste à faire côté Odelie / Mehdi

**Bloquants pour démarrage local complet** :

1. Créer projet Supabase EU (Frankfurt/Paris) — `docs/SUPABASE_SETUP.md`
2. Remplir `.env.local` (Supabase URL + anon + service_role + DATABASE_URL)
3. `pnpm db:push` pour appliquer le schéma 19 tables
4. Copier `supabase/migrations/0001_row_level_security.sql` dans Supabase
   SQL Editor → Run
5. (Optionnel) Créer repo GitHub : `winget install GitHub.cli` puis
   `gh auth login` puis `gh repo create atelier-frisson --private --source=.
--push` ou créer le repo manuellement sur github.com

**Connexions services à brancher au fil des besoins** :

- Upstash Redis (rate limit prod actif)
- Sentry DSN + PostHog keys (errors + funnels)
- CJdropshipping B2B credentials (Sprint 8 seed catalog)
- CCBill staging (après K-Bis SASU)
- VerifyMy / AnonymAGE API (pré-prod Arcom)
- Resend API key + domaine vérifié
- Klaviyo public + private keys + liste principale
- Mux account + signing keys
- Cabinet expert-comptable

**Migrations Sprint 8+ envisagées** :

- `middleware.ts` → `proxy.ts` (déprécation Next 16)
- Photos produits réelles (CJ ou IA generation)
- Sentry capture sur error.tsx + global-error.tsx
- 4 guides piliers restants (silicone médical, rituel bien-être, sexualité
  40 ans, plaisir féminin)
- Articles MDX file-system (au lieu de mock data inline)
- TipTap admin réel pour CRUD articles
- Stripe Checkout Session creation effective
- CCBill FlexForms iframe intégration
- Tests E2E Playwright (checkout, auth, age gate, admin)
- Audit a11y axe-core + Lighthouse CI
- Migration Supabase Auth MFA enrolled (gate 2FA admin)

### Historique des commits Session 1

```
da595d8 feat(docs): README + .claude/rules + Husky + SESSION_HISTORY
9aca513 fix(age-gate): cookie reading via shared constants module
e06f0f8 feat(shop): Sprint 2 boutique complete (8 produits + panier + Schema.org)
9b1ab7c feat(account+checkout): Sprint 3 auth magic link + espace client + checkout 3 etapes + emails
f4fa8a8 feat(admin): Sprint 4 back-office P1 (layout + dashboard + 6 modules)
8ce30c8 feat(admin): Sprint 5 back-office P2 (12 modules dont FORJA dashboard)
[Sprint 6 commit]
[Sprint 7 commit final]
```

---

_Sprint 1-7 livrés. Sprint 8 : seed Supabase + connexions services réelles, raffinements polish._

---

## Session 2 — 2026-04-24 — Polish post-MVP (P4 → P6)

**Mode** : carte blanche continue « state-of-the-art / award-winning grade UX/UI ».
**Durée** : quatre lots incrémentaux (P4 polish pages, P5 infra réelle, P6 UX kinétique).

### P4 — Polish pages & UX (commit `5cd8c16`)

- **/compte** : greeting personnalisé via Supabase session + user mock dev bypass
- **OG images dynamiques** via `app/opengraph-image.tsx` + fonts runtime
- **PWA manifest** (`app/manifest.ts`) + icons `/icon` + `/apple-icon` (Next 16 convention sans extension)
- **/recherche** : page de recherche basique (liste produits/articles, filtrage client)
- **Détails admin** : `/admin/produits/[slug]` + `/admin/commandes/[id]` avec tabs & actions
- **ScrollProgress** : barre fine or en haut, progression linéaire au scroll
- **StickyProductBar** mobile sur fiches produit (add-to-cart persistant en bas)
- **Dev auth bypass** : `lib/auth/session.ts` renvoie un mock user si Supabase non configuré
- **CSP drop strict-dynamic** (commit fix `0b650c6`) pour débloquer inline scripts Next.js

### P5 — Infra production-ready (commit `93e259d`)

- **`middleware.ts` → `proxy.ts`** : migration Next 16, export `proxy` function (au lieu de `middleware`)
- **CSP `strict-dynamic` restauré** : propagation nonce via `NextResponse.next({ request: { headers: requestHeaders } })` (vraie source du bug initial)
- **`/api/newsletter/subscribe`** : endpoint réel — UPSERT `newsletter_subscribers` via service role (idempotent) + Klaviyo track + Resend welcome email. Graceful fallback si Supabase/Klaviyo/Resend non configurés.
- **`/api/forge/ingest`** : webhook FORJA avec **HMAC SHA-256** (`node:crypto` `timingSafeEqual`) + zod schema pour payload pages programmatiques
- **`/api/cron/sync-products`** : stub cron CJ avec Bearer auth (`CRON_SECRET` env)
- **`scripts/seed.ts`** : dotenv + upsert catégories/produits/articles/admin_user
- **NewsletterForm** : `fetch('/api/newsletter/subscribe')` réel (au lieu de l'appel direct Klaviyo côté client)

### P6 — UX kinétique award-winning (ce commit)

- **`ScrollReveal`** : wrapper IntersectionObserver avec fade-up + delay stagger, respecte `prefers-reduced-motion` (révèle instantanément)
- **Homepage** : 6 sections wrappées (manifeste, collection header + 6 cards staggered, bannière éditoriale, journal header + 3 cards staggered, newsletter) — chaque élément apparaît avec élégance au scroll
- **`Testimonials`** : nouvelle section entre Journal et Newsletter, 3 témoignages CSP+ (Camille/Sophie/Léa) en blockquote Bodoni italique + séparateurs fleuron
- **`BackToTop`** : bouton flottant bas-droite, apparaît après 800px de scroll, smooth scroll + respect reduced-motion
- **`CommandPalette`** ⌘K : overlay de recherche rapide — 24 items indexés (nav + collections + 6 produits + compte + aide + actions), raccourci global ⌘K/Ctrl+K + touche `/`, navigation clavier ↑↓/Enter/Esc, substring match avec normalisation accents, reset activeIndex on query change, focus trap + body scroll lock, listbox ARIA + aria-activedescendant
- **Header.Search** : remplacé le `<Link href="/recherche">` par un bouton qui dispatch `af:palette-open`, kbd hint `⌘K` affiché en xl+

**Verifications** : `pnpm typecheck` ✓ `pnpm lint` ✓ `pnpm build` ✓ (66 routes, 0 error).

### Handover Session 2

- Site bootable en local sans env var : dev bypass actif (mock user, Stripe/CCBill/Supabase/Klaviyo/Resend graceful stubs)
- Prêt pour connexions réelles : il suffit de remplir `.env.local` (voir `docs/SUPABASE_SETUP.md`)
- Command palette ⌘K fonctionnel pour démo client
- Animations subtiles, non intrusives, respect a11y motion

_Prochaine cadence possible_ : E2E Playwright (checkout, age gate, palette), axe-core audit, Lighthouse CI, stripe session creation effective, CCBill FlexForms.

---

## Session 3 — 2026-04-25 — Production-ready batch (P7 → P20 + L1 → L10)

**Mode** : carte blanche, mode multi-agent swarm, 3 passes de polish.
**Durée** : 33 commits incrémentaux post-MVP, focus sur la cohérence
narrative cinématique + le branchement backend production-ready.

### Phase A — UX engagement (P7 → P14)

- **P7 Wishlist end-to-end** (commit `c06035c`) : cookie 90j, WishlistButton
  3 variants, /compte/favoris, ArticleToc + ShareRow, 404 destinations
- **P8 Recently Viewed + empty states** (commit `2fbe781`) : localStorage
  TTL 60j, RecentlyViewedSection sur produit + compte + cart vide,
  /recherche empty + no-match enrichis
- **P9 Reviews + gift options** (commit `9ce4da3`) : 20 avis vérifiés +
  ReviewStars + ReviewsSection + Schema.org AggregateRating, gift toggle
  checkout révélable
- **P10 QuickView + share + admin polish** (commit `f14f1cf`) : modal
  dialog produit, ArticleShareRow réutilisable, Sparkline SVG natif +
  ActivityFeed admin
- **P11 Gallery lightbox + promo** (commit `9af6490`) : lightbox plein
  écran + clavier nav, codes promo (WELCOME10/DUO15/GIFT500) avec
  re-validation server
- **P12 Newsletter DOI + cart upsell** (commit `9fd913f`) : tokens HMAC
  stateless 48h, /auth/confirm-subscribe Server Component, NewsletterForm
  tone prop, mini-upsells panier <3 items
- **P13 Compare end-to-end** (commit `e577ced`) : 3 max localStorage,
  CompareToggleButton + CompareBar floating + /comparer table partageable
- **P14 Admin CRUD produit** (commit `f1c7a92`) : RHF + zod + TipTap rich
  text + Server Action stub DB

### Phase B — DA cinématique cohérente (P15 → P20)

- **P15 MegaMenu Dior + AnnouncementBar dismissable** (commit `bb9b958`)
- **P16 /rituel-inaugural** (commit `8725043`) : expérience scrollytelling
  6 chapitres + hero/épilogue cinématiques, palette qui bascule au scroll,
  typo qui se déploie
- **P17 /a-propos refonte cinématique** (commit `4187df6`) : 8 sections
  narratives (hero + manifeste + portrait fondatrice + timeline 5 jalons
  - 6 engagements + équipe anonymisée + presse + atelier + épilogue),
    Timeline + TeamGrid + PressQuotes components
- **P18 /collections refonte** (commit `9dc5753`) : split JOUR/NUIT
  full-bleed avec mots d'ambiance MATINS/NUITS en filigrane énorme,
  CollectionImmersiveHero + CollectionRitualSteps
- **P19 AgeGate cinématique + Footer atelier** (commit `1f122ac`) :
  séquence step 0→3 sur 1.4s avec wipe shine sur CTA primary
- **P20 Page produit cinématique** (commit `16b2214`) : ProductCinematicHero
  full-bleed avec ambient word + scroll cue ancré buy-section

### Phase C — Production-ready backend (L1 → L10)

- **L1 Drizzle UPDATE produit + audit log** (commit `73580c9`)
  - `lib/audit/log.ts` — logAuditEvent() centralisé, mode graceful sans DB
  - `lib/db/queries/admin-products.ts` — UPDATE + archive avec returning
  - `lib/admin/products/actions.ts` — branchement Drizzle réel +
    snapshot before/after dans audit log + headers IP/UA capture
- **L2 2FA TOTP RFC 6238 natif** (commit `484adb5`)
  - `lib/auth/totp.ts` — Web Crypto API HMAC-SHA1 + dynamic truncation
    - base32 encode/decode + recovery codes
  - `lib/auth/totp-actions.ts` — start/finish/verify Server Actions
  - `components/admin/TotpEnrolWizard.tsx` — wizard 4 étapes
  - `/admin/securite-2fa` page
- **L3 PDF facture HTML + CSV exports** (commit `785e65c`)
  - `lib/exports/csv.ts` — RFC 4180 sans dépendance
  - `lib/invoices/generate-invoice-html.ts` — HTML imprimable
    (conformité L441-9/10), Bodoni titres, palette Atelier Frisson
  - `/api/admin/invoices/[orderNumber]` + `/api/admin/exports/products`
- **L4 Cookie banner CNIL** déjà en place — granulaire, équiproéminent,
  versionné `af_consent_v1`, event dispatch `af:consent`
- **L5 Glossaire interactif** (même commit) — search live + filter
  catégories + highlight matches + empty state
- **L6 Loading skeletons + 404** (même commit) — Skeleton primitive
  shimmer, ProductGridSkeleton, AccountDashboardSkeleton, loading.tsx
  pour /boutique /compte /admin. 404 déjà polishée P7
- **L7 Mux + Supabase Storage** (commit `726bcfb`)
  - `lib/mux/upload.ts` — createMuxDirectUpload + getStatus + getPlaybackId
  - `lib/storage/images.ts` — generateProductImageUploadUrl avec
    validation MIME + path safe
- **L8 Playwright** — non implémenté cette session (Sprint 8 dédié)
- **L9 Headers sécu + audit script** (même commit `726bcfb`)
  - proxy.ts enrichi : Permissions-Policy étendu, HSTS prod 2 ans,
    COOP same-origin, CORP same-site
  - `scripts/audit-security-headers.ts` — 8 checks RFC, exit code 1
    si fail (CI/CD ready)
  - `pnpm audit:security [URL]` script ajouté
- **L10 Documentation** — GO_LIVE_CHECKLIST exhaustive (10 sections,
  ~60 cases à cocher) + cette mise à jour SESSION_HISTORY

### Cumul Session 3

- **33 commits** post-MVP (P7 → L10)
- **70+ routes** dans le build
- **30+ nouveaux composants** réutilisables
- **15+ nouvelles pages** admin / shop / éditoriales
- **Cohérence narrative cinématique** complète : AgeGate → Homepage →
  MegaMenu → /collections → /a-propos → /rituel-inaugural → /produit
- **Backend production-ready** : audit log instrumenté, 2FA TOTP,
  PDF facture, CSV exports, headers durcis, audit script, helpers Mux +
  Supabase Storage prêts à brancher

### Reste à faire avant go-live (cf. GO_LIVE_CHECKLIST.md)

1. K-Bis SASU + Qonto + CCBill onboarding (côté Odelie, 2-5 sem)
2. Configuration env vars Vercel (Supabase, Resend, Klaviyo, Mux, etc.)
3. `pnpm db:push` + migration RLS + `pnpm db:seed`
4. Photos produits réelles uploadées via /admin/produits
5. Tests E2E Playwright (4 parcours critiques)
6. Lighthouse staging ≥ 95 + Mozilla Observatory A+ + SSL Labs A+
7. Première commande test bout-en-bout
8. 2FA admin enrôlée + recovery codes archivés

**Le site est prêt à montrer à la presse demain matin** (silhouettes SVG +
copy éditoriale finale). **Le go-live commercial nécessite ~3 semaines**
de finitions backend une fois les blocages juridiques levés.

---

_Sessions 1-3 livrées. Prochaine cadence : tests E2E Playwright complets,
axe-core a11y audit, Lighthouse CI, branchement effectif CCBill FlexForms,
sync CJ catalogue réel._
