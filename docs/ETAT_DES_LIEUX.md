# État des lieux Atelier Frisson — Avril 2026

**Document interne Numelite — base de décision pour le pivot**

---

## 1. Code livré à ce jour

### Volumétrie

| Métrique                       | Valeur                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Fichiers TypeScript (.ts/.tsx) | **239**                                                                      |
| Lignes de code total           | ~29 400 LOC                                                                  |
| Routes Next.js (pages)         | **56 pages + 16 routes API = 72 routes**                                     |
| Composants React               | ~95 (UI + layout + marketing + shop + admin + account + articles + checkout) |
| Tables DB Drizzle              | **19 tables**                                                                |
| Modules admin                  | **18 + 2FA**                                                                 |
| Pages légales                  | **8**                                                                        |
| TODOs/FIXMEs résiduels         | 14 (dans 13 fichiers)                                                        |
| Commits réalisés               | ~25 (Sprints 1 → 7 + post-livraison)                                         |

### Stack figée

```
Framework      Next.js 16.2.4 (App Router, Server Components, Server Actions, Turbopack)
Language       TypeScript 5 strict++ (noUncheckedIndexedAccess, exactOptionalPropertyTypes,
               noImplicitOverride, noUnusedLocals, noUnusedParameters)
Styling        Tailwind v4 + shadcn/ui base-nova + Base UI primitives
DB             Supabase PostgreSQL + Drizzle ORM 0.45
Auth           Supabase Auth SSR + 2FA TOTP RFC 6238 (admin obligatoire, client optionnel)
Email          Resend + React Email + Klaviyo events
Video          Mux (HLS adaptatif, signed URLs)
Storage        Supabase Storage (Mux pour vidéos)
Rate limit     Upstash Redis
Validation     Zod
Sécurité       CSP nonce + strict-dynamic, HSTS preload prod, COOP same-origin,
               CORP same-site, RLS 19 tables (migration écrite, pas appliquée)
```

---

## 2. Ce qui est OPÉRATIONNEL (réutilisable tel quel pour le pivot)

### Architecture & infra

- ✅ Next.js 16 App Router, structure groupes `(marketing)` `(shop)` `(account)` `(admin)` `(legal)`
- ✅ Middleware `proxy.ts` avec headers durcis (CSP nonce, HSTS, COOP, CORP, etc.)
- ✅ Build : 72 routes, ~2 MB chunks JS, build vert
- ✅ Cookie banner CNIL + Age Gate soft (case majorité simple — conforme wellness sans porno)
- ✅ Skip link a11y, focus-visible ring or, lang fr, sémantique correcte

### Base de données (`lib/db/schema.ts`)

| Table                   | Statut | Réutilisable pour pivot ?                                          |
| ----------------------- | ------ | ------------------------------------------------------------------ |
| `customers`             | OK     | ✅ tel quel                                                        |
| `addresses`             | OK     | ✅ tel quel                                                        |
| `categories`            | OK     | ✅ refonte taxonomie (couples, lingerie, cosmétique)               |
| `products`              | OK     | ✅ champs riches déjà présents (specs, features, tags, schema.org) |
| `productVariants`       | OK     | ✅ utile pour tailles lingerie                                     |
| `carts` + `cartItems`   | OK     | ✅ tel quel                                                        |
| `orders` + `orderItems` | OK     | ✅ tel quel                                                        |
| `promotions`            | OK     | ✅ tel quel                                                        |
| `reviews`               | OK     | ✅ tel quel (importer reviews CJ)                                  |
| `articles`              | OK     | ⚠️ pivot vers articles SEO bundles + cadeaux                       |
| `forgePages`            | OK     | ⏸️ désactivé pour V1 pivot (utile si scaling SEO V2)               |
| `redirects`             | OK     | ✅ tel quel                                                        |
| `marketingEvents`       | OK     | ✅ tel quel                                                        |
| `adminUsers`            | OK     | ✅ tel quel                                                        |
| `auditLog`              | OK     | ✅ tel quel                                                        |
| `invoices`              | OK     | ✅ tel quel                                                        |
| `newsletterSubscribers` | OK     | ✅ tel quel                                                        |

### Modules admin (18 + 2FA)

- ✅ Dashboard (KPIs)
- ✅ Produits (CRUD + variants)
- ✅ Commandes
- ✅ Clients
- ✅ Catégories
- ✅ Promotions
- ✅ Stocks
- ✅ CMS (articles)
- ⏸️ FORJA (désactivé pour V1 pivot)
- ✅ SEO (redirections, sitemap)
- ✅ Analytics
- ✅ Avis (modération)
- ✅ Emails (templates + logs)
- ✅ Livraisons (zones)
- ✅ Fournisseurs (CJ)
- ✅ Finances (TVA, factures)
- ✅ Paramètres
- ✅ Utilisateurs admin
- ✅ Audit log
- ✅ Sécurité 2FA TOTP

### Sécurité

- ✅ TOTP natif Web Crypto (RFC 6238 — pas de dépendance npm)
- ✅ Audit log centralisé (`lib/audit/log.ts`)
- ✅ CSP nonce + strict-dynamic via `proxy.ts`
- ✅ Headers : HSTS preload prod, COOP same-origin, CORP same-site, X-Frame DENY,
  X-Content-Type-Options nosniff, Referrer-Policy strict-origin, Permissions-Policy stricte
- ✅ Migration RLS écrite (`supabase/migrations/0001_row_level_security.sql`) — **à appliquer
  manuellement dans Supabase SQL Editor**
- ✅ Script `pnpm audit:security` (8 checks)

### Intégrations

- ✅ Supabase client/server/admin/middleware (4 contextes SSR-safe)
- ✅ Klaviyo events (`lib/klaviyo/track.ts`)
- ✅ Resend + templates React Email
- ✅ Mux upload (signed URLs, status check, asset playback)
- ✅ Storage uploads (validation MIME, ALLOWED_MIMES set)
- ✅ Drizzle queries typées (products, orders, customers, articles, forge, admin-products)

---

## 3. Ce qui doit CHANGER pour le pivot dropship couples

### Refonte UX (~3-4 jours)

| Page actuelle                             | Pivot                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/` Homepage split JOUR/NUIT wellness     | Homepage split « Pour Vous Deux / Pour Elle / Pour Lui » + bandeau bundles + bandeau box mensuelle |
| `/collections/jour` + `/collections/nuit` | `/collections/couples` + `/collections/elle` + `/collections/lui` + `/collections/cadeaux`         |
| `/rituels` blog éditorial wellness        | `/inspirations` blog SEO (bundles, idées cadeaux Saint-Valentin/Noël/anniv)                        |
| `/guides/[slug]` guides piliers wellness  | Garder structure, contenu basculé "Comment choisir un cadeau couple"                               |
| `/glossaire` wellness                     | Renommer en `/faq` ou supprimer                                                                    |
| `/rituel-inaugural`                       | Renommer ou supprimer (inutile dans le modèle dropship)                                            |
| `/a-propos` manifesto wellness            | Page "L'Atelier" simple (qui sommes-nous, livraison, garanties, contact)                           |

### Catalogue (~3-5 jours dev + 5-10 jours données)

- ❌ Mock 8 produits silhouettes SVG → ✅ 150-300 SKUs réels CJ + Shewin + Spocket
- ✅ Structure `products` table déjà OK (champs jsonb specs/features/images/tags présents)
- 🆕 Script d'import CJ via API (`scripts/cj-sync-products.ts`)
- 🆕 Génération templates descriptions SEO 200-400 mots × 150 SKUs (assistance IA + revue
  humaine)
- 🆕 Photos produit : récupérer depuis CJ + retouches Canva/Photoshop (Odelie + freelance)

### Multi-PSP routing (~2-3 jours)

- ✅ Stripe stub déjà en dev
- 🆕 Adapter `lib/payments/router.ts` : choisit PSP selon catégorie produit
  - Cosmétique intime + accessoires soft → Stripe
  - Objets + lingerie sexy → CCBill
  - Backup auto → Verotel
- 🆕 Webhooks `app/api/webhooks/{ccbill,verotel,stripe}/route.ts`
- 🆕 Module admin "Paramètres > Paiements" pour piloter les routings

### Box mensuelle abonnement (~4-6 jours)

- 🆕 Table DB `subscriptions` (customer_id, plan_id, status, next_charge_at, ccbill_subscription_id)
- 🆕 Table DB `subscription_plans` (Box Découverte 39€, Box Premium 49€, Box Trio 59€)
- 🆕 Table DB `subscription_shipments` (one-to-many, contenu de chaque envoi mensuel)
- 🆕 Page client `/compte/abonnements` (statut, pause, skip mois, annuler)
- 🆕 Module admin `/admin/abonnements` (liste, contenus à venir, MRR)
- 🆕 Webhook CCBill recurring billing handler
- 🆕 Page `/box-mensuelle` (landing dédiée vente abonnement)
- 🆕 Email Klaviyo flow "subscription"

### Bundles (~2-3 jours)

- 🆕 Table DB `bundles` (slug, name, description, included_product_ids[], price_cents)
- 🆕 Page `/bundles` + `/bundle/[slug]`
- 🆕 Module admin `/admin/bundles`
- 🆕 Composant `BundleCard.tsx` + logique panier "ajouter le bundle = ajouter les N produits"

### Tracking & marketing (~2-3 jours)

- 🆕 Pinterest Tag (config ID + events ViewContent, AddToCart, Checkout)
- 🆕 TrafficJunky / ExoClick / Plugrush conversion pixels
- 🆕 Pinterest Rich Pins (Open Graph enrichi : prix, dispo, marque)
- 🆕 OG images dynamiques optimisées Pinterest (1000x1500 portrait)
- 🆕 Programme parrainage : codes uniques, attribution, dashboard client `/compte/parrainage`
- 🆕 Cartes cadeaux : table `gift_cards` + checkout + page activation
- 🆕 Programme fidélité points : table `loyalty_points_transactions` + UI compte

### Acquisition prête à brancher (~1-2 jours)

- 🆕 Sitemap optimisé Pinterest crawl (XML séparé pour images)
- 🆕 robots.txt mis à jour : autoriser Pinterest bot, ExoClick crawler, etc.
- 🆕 Programme affiliés via Goaffpro ou Refersion (config + tracking)

---

## 4. Ce qui doit être SUPPRIMÉ ou DÉSACTIVÉ

### Supprimé du dev V1 pivot

- ❌ Page `/rituel-inaugural` (concept wellness, hors sujet)
- ❌ Composants `CinematicHero.tsx`, `CinematicChapter.tsx`, `CinematicEpilogue.tsx` (édito,
  inutiles)
- ❌ `Timeline.tsx`, `TeamGrid.tsx`, `PressQuotes.tsx` (édito brand wellness — gardés en réserve
  fichier mais non importés)
- ❌ Glossaire wellness (50+ termes médicaux) — table `articles` reset

### Désactivé temporairement (réactivable V2)

- ⏸️ Module FORJA pSEO (1 200 pages programmatiques) — utile si scaling SEO V2
- ⏸️ Stratégie comité scientifique / E-E-A-T YMYL (overkill pour dropship cash)
- ⏸️ AnonymAGE / VerifyMy intégration (non-applicable wellness sans porno)

### Conservé "tel quel" malgré pivot

- ✅ DA visuelle Bodoni Moda + ivoire/rouge laqué (parfait pour couples premium)
- ✅ Toute l'infra Sécurité / Audit / 2FA / RLS (essentielle même en dropship)
- ✅ Toute l'infra paiement (Stripe + ajout CCBill/Verotel)
- ✅ Email transac Resend
- ✅ Module Klaviyo events (essentiel email marketing)
- ✅ Mux video (utile pour vidéos produits + lives TikTok cross-post)

---

## 5. Effort estimé pour livrer le pivot

| Chantier                                                      | Effort                              | Priorité  |
| ------------------------------------------------------------- | ----------------------------------- | --------- |
| Refonte UX (homepage, collections, nav)                       | 3-4 j                               | P0        |
| Schéma DB pivot (subscriptions, bundles, loyalty, gift_cards) | 1-2 j                               | P0        |
| Multi-PSP routing                                             | 2-3 j                               | P0        |
| Box mensuelle (table + page client + admin + landing)         | 4-6 j                               | P0        |
| Bundles (table + pages + admin)                               | 2-3 j                               | P0        |
| Tracking pixels + Pinterest Rich Pins + OG portrait           | 2-3 j                               | P1        |
| Programme parrainage                                          | 2 j                                 | P1        |
| Programme fidélité + cartes cadeaux                           | 3 j                                 | P2        |
| Script CJ sync 150 SKUs                                       | 1-2 j                               | P0        |
| Génération contenu 150 SKUs (descriptions + alt text)         | 5-10 j                              | P0 (data) |
| Recette + bug fixes + lighthouse + audit sécurité             | 2-3 j                               | P0        |
| **TOTAL pivot complet**                                       | **~30-40 j de dev + ~10 j de data** | —         |

→ Livrable pivot : **~4-5 semaines** à temps plein, ou **6-8 semaines** en mode mixte
avec validations Odelie.

---

## 6. État des dépendances externes

| Dépendance                   | Statut                                                                |
| ---------------------------- | --------------------------------------------------------------------- |
| K-Bis SASU France            | ⏳ En cours (Odelie)                                                  |
| Compte Qonto                 | ⏳ Conditionnel K-Bis                                                 |
| **CCBill onboarding**        | ⏳ 2-5 sem après K-Bis                                                |
| **Verotel onboarding**       | 🆕 À démarrer en parallèle (backup PSP)                               |
| Stripe compte test           | ✅ OK (utilisable dev)                                                |
| Stripe compte prod           | ⏳ Approche directe possible pour catégories cosmétique/lingerie soft |
| CJdropshipping B2B           | ⏳ À valider (Odelie)                                                 |
| Shewin compte                | 🆕 À ouvrir (Odelie)                                                  |
| Spocket compte               | 🆕 À ouvrir (Odelie)                                                  |
| Resend domaine               | ⏳ DNS à configurer (atelierfrisson.fr)                               |
| Klaviyo compte               | ⏳ Free tier OK pour démarrer                                         |
| Mux compte                   | ⏳ Optionnel V1 pivot (vidéos produits seulement)                     |
| Supabase EU project          | ⏳ À créer (Frankfurt ou Paris)                                       |
| Vercel project               | ⏳ À configurer + DNS atelierfrisson.fr                               |
| Cloudflare zone              | ⏳ Recommandé devant Vercel (WAF)                                     |
| Pinterest Business           | 🆕 À ouvrir (Odelie)                                                  |
| Tailwind Pinterest scheduler | 🆕 14 $/mois                                                          |
| Comptable                    | ⏳ À choisir (Dougs / Indy / Numbr)                                   |

---

## 7. Risques techniques résiduels du pivot

| Risque                                         | Mitigation                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| CCBill webhook flaky / coupures aléatoires     | Idempotency keys + retry queue + Verotel fallback                          |
| Pinterest serre les règles wellness intime     | Diversification ad networks dès mois 4 + organique TikTok                  |
| Stripe ferme compte si catégorisation "adulte" | Multi-PSP routing strict par catégorie produit                             |
| Shewin / CJ rupture stock + livraison délai    | AutoDS sync stock toutes 4h + fallback "expédié sous 7-10j" mention claire |
| Pic de trafic ad networks → DDoS Vercel        | Cloudflare WAF + rate limit Upstash agressif                               |
| Reviews import CJ qualité douteuse             | Modération admin avant publication + Trustpilot widget                     |
| Box mensuelle taux de churn élevé              | Email Klaviyo "winback subscription" + skip-month feature                  |
| TVA OSS cross-border EU complexité comptable   | Comptable spécialisé dropship dès J1 (Dougs / Numbr)                       |

---

## 8. Décisions à acter avant pivot

1. **Validation brief Odelie** (les 3 points du brief)
2. **Choix niche définitive** : Couples 30-50 (recommandé) / Cadeau pour elle / Pleasure femme premium / Long distance
3. **Budget engagé** : confirmer 30-45 k€ sur 6 mois
4. **Calendrier go-live** : objectif T0 + 6 semaines (post-K-Bis SASU + onboarding CCBill)
5. **Décision FORJA** : on garde le code en latence ou on le supprime totalement ?
6. **Décision Mux** : on garde pour videos produits ou on supprime (économie ~25 $/mois et ~3 dépendances) ?

→ Réponses attendues d'Odelie (visio 45 min cette semaine).
