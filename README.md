# Atelier Frisson

> Maison française du rituel intime — e-commerce wellness premium.
> _Pour tous les rituels. Pour tous les moments._

**Client** : Odelie (Sandrine Ada Ben Ayish) · **Prestataire** : Numelite SASU (Mehdi Nafaa)
**Contrat** : Setup 4 000 € HT + Retainer 3 000 € HT/mois × 12 mois · **Pack SEO Forge inclus** (1 200 pages FORJA)

---

## 📚 Documentation

- [`CLAUDE.md`](./CLAUDE.md) — **brief de production** (source de vérité, 1397 lignes)
- [`docs/SEO_STRATEGY.md`](./docs/SEO_STRATEGY.md) — stratégie SEO YMYL + exemples de pages
- [`docs/FORGE_WORKFLOW.md`](./docs/FORGE_WORKFLOW.md) — intégration factory pSEO FORJA
- [`docs/SUPABASE_SETUP.md`](./docs/SUPABASE_SETUP.md) — configuration Supabase étape-par-étape
- [`docs/SESSION_HISTORY.md`](./docs/SESSION_HISTORY.md) — journal des sessions Claude Code
- [`.claude/rules/`](./.claude/rules) — règles éditoriales, SEO, a11y, sécurité, perf

## 🧱 Stack

- **Framework** : Next.js 16 (App Router, Server Components, PPR, Turbopack)
- **Langage** : TypeScript 5 strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`
- **Styling** : Tailwind CSS v4 + shadcn/ui (`base-nova` + Base UI primitives)
- **Base de données** : Supabase PostgreSQL (région EU) + Drizzle ORM
- **Auth** : Supabase Auth (magic link + 2FA TOTP obligatoire admin)
- **Paiement** : Stripe (dev/test) / **CCBill** (prod, high-risk adulte)
- **Emails** : Resend + React Email (transac) / Klaviyo (marketing)
- **Vidéo** : Mux (HLS adaptatif, posters auto)
- **Âge** : VerifyMy / AnonymAGE (Arcom double anonymat, à activer pré-prod)
- **Hébergement** : Vercel Pro + Cloudflare (WAF, bot management, rate limiting)
- **Observabilité** : Sentry (errors/perf/session replay anonymisé) + PostHog (funnels)
- **Rate limiting** : Upstash Redis
- **Factory pSEO** : FORJA (Numelite) — 1 200 pages premium sur 12 mois

## 🚀 Pré-requis

- **Node.js** ≥ 20
- **pnpm** ≥ 9
- **Git** ≥ 2.30
- Compte **Supabase** en région EU ([guide](./docs/SUPABASE_SETUP.md))

## ⚡ Démarrer en dev

```bash
# 1. Installer
pnpm install

# 2. Configurer .env.local (voir docs/SUPABASE_SETUP.md)
cp .env.example .env.local
# → remplir NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, DATABASE_URL

# 3. Appliquer le schéma DB (19 tables)
pnpm db:push

# 4. Appliquer les policies RLS
# Copier supabase/migrations/0001_row_level_security.sql
# dans Supabase Dashboard → SQL Editor → Run

# 5. Lancer
pnpm dev
# → http://localhost:3000
```

## 🧪 Commandes utiles

| Commande            | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Serveur de développement (Turbopack) |
| `pnpm build`        | Build de production                  |
| `pnpm typecheck`    | `tsc --noEmit` strict                |
| `pnpm lint`         | ESLint (Next config)                 |
| `pnpm lint:fix`     | ESLint auto-fix                      |
| `pnpm format`       | Prettier sur tout le repo            |
| `pnpm db:generate`  | Générer une migration Drizzle        |
| `pnpm db:push`      | Appliquer le schéma sur Supabase     |
| `pnpm db:studio`    | Drizzle Studio UI                    |
| `pnpm db:seed`      | Seed de dev (Sprint 2+)              |
| `pnpm forge:import` | Import batch FORJA (Sprint 5+)       |
| `pnpm analyze`      | Bundle analyzer                      |

## 🗂 Architecture

```
atelier-frisson/
├── CLAUDE.md                    # Brief — source de vérité
├── AGENTS.md                    # Warning Next 16 breaking changes
├── .claude/rules/               # Règles Claude (content, seo, a11y, security, perf)
├── docs/                        # SEO, FORGE, Supabase setup, session history
├── app/
│   ├── (marketing)/             # Homepage, à propos, rituels, guides, glossaire
│   ├── (shop)/                  # Boutique, produit, collections, panier, checkout
│   ├── (forge)/                 # Pages FORJA : /livraison/[ville], /conseils/[slug]
│   ├── (account)/               # /compte, auth
│   ├── (admin)/                 # Back-office 18 modules
│   ├── (legal)/                 # CGV, mentions, confidentialité, cookies, accessibilité
│   ├── api/                     # Webhooks (CCBill, CJ, Klaviyo), crons, ingest FORJA
│   ├── globals.css              # Tokens AF (palette, fonts, animations)
│   └── layout.tsx               # Root : fonts, AgeGate, CookieBanner, Header, Footer
├── components/
│   ├── ui/                      # Primitives shadcn
│   ├── layout/                  # Header, Footer, AgeGate, CookieBanner, Fleuron, Wordmark
│   ├── marketing/               # HeroSplit, ProductSilhouette, TrustSignals…
│   ├── shop/                    # (Sprint 2)
│   ├── forge/                   # (Sprint 5)
│   └── admin/                   # (Sprint 4-5)
├── lib/
│   ├── supabase/                # Clients browser / server / admin / middleware
│   ├── db/                      # Drizzle schema + queries typées memoïsées
│   ├── security/                # CSP, rate limit Upstash, sanitize
│   ├── cj/ · ccbill/ · klaviyo/ · mux/ · resend/ · forge/ · seo/ · search/ · analytics/
│   └── utils.ts
├── supabase/migrations/         # RLS policies + sequences
├── drizzle/                     # Migrations Drizzle générées
├── scripts/                     # seed, forge-import, forge-validate
├── middleware.ts                # CSP nonce + rate limit + session Supabase
└── next.config.ts               # Images, headers statiques, remotePatterns
```

## 🎨 Identité visuelle

- **Palette** : `#F2EADF` ivoire · `#8B1424` rouge laqué · `#0A0706` noir velours · `#C9A36B` or champagne · `#1C1A17` encre
- **Typographies** : [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda) (display) + [Inter](https://fonts.google.com/specimen/Inter) (UI)
- **Références** : Dior × Byredo × Smile Makers × Aesop × Typology
- **Test éditorial** : _« une CSP+ parisienne partagerait-elle ce lien comme elle partagerait Typology ou Byredo ? »_

## ⚖️ Statut juridique / blocages go-live

Le code est développable en dev. **La mise en production est conditionnée à :**

- [ ] K-Bis SASU France reçu
- [ ] Compte Qonto avec IBAN FR
- [ ] Compte CCBill validé (2-5 sem après K-Bis)
- [ ] Compte CJdropshipping B2B
- [ ] Catalogue 25-30 produits validé
- [ ] Photos produits HD

**Stripe en dev uniquement** — jamais de paiement réel (bannissement compte).

## 🗓 Sprints

1. ✅ **S1 — Fondations** (cette session) : bootstrap + design system + DB + homepage + compliance + sécurité
2. ⏭ **S2 — Boutique** : grille + filtres + fiche produit + collections + panier + CJ stub
3. ⏭ **S3 — Checkout & Account** : magic link + espace client + Stripe test + Resend + Klaviyo
4. ⏭ **S4 — Back-office P1** : admin + 2FA + Dashboard + Produits/Commandes/Clients/Catégories/Promotions/Stocks
5. ⏭ **S5 — Back-office P2 + FORJA** : CMS + FORJA + SEO + Analytics + Avis + Emails + …
6. ⏭ **S6 — SEO & Contenu** : blog + guides + MDX + sitemap + structured data + pages légales
7. ⏭ **S7 — Polish & Launch** : E2E + a11y + OWASP + CCBill staging + prod

---

**Conçu à Paris — Maison du rituel intime.**
