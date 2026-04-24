# SESSION_HISTORY.md — Atelier Frisson

Journal des sessions Claude Code. À tenir à jour en fin de chaque session
(voir `Prompt_Session1_ClaudeCode.md` §Conseils d'usage).

---

## Session 1 — 2026-04-24 — Sprint 1 : Fondations

**Durée** : une séance Claude Code continue (Opus 4.7, 1M context).
**Scope** : bootstrap complet du projet, design system, base de données,
homepage, compliance Arcom+CNIL, sécurité middleware, docs.

### Fichiers créés / modifiés (principal)

**Config racine**

- `CLAUDE.md` (1398 l, préfixé `@AGENTS.md`)
- `AGENTS.md` (warning Next 16 breaking changes — conservé)
- `tsconfig.json` (strict++ : noUncheckedIndexedAccess, exactOptionalPropertyTypes, noUnusedLocals/Parameters)
- `next.config.ts` (images Mux/Supabase/AF, headers HSTS/XFO/Referrer/Permissions)
- `drizzle.config.ts` (Supabase PostgreSQL, snake_case)
- `.env.example` (14 groupes de variables)
- `.prettierrc.json` + `.prettierignore`
- `.gitignore` (Supabase CLI, Sentry, editor, OS)
- `.gitattributes` (LF normalisation cross-platform)
- `package.json` (scripts dev/build/typecheck/lint/db/format/forge + lint-staged config)
- `.husky/pre-commit` (typecheck + lint-staged)
- `middleware.ts` (CSP nonce + rate limit Upstash + Supabase session + headers)

**Design system (`app/globals.css`, `components/layout/`)**

- `globals.css` (tokens AF palette/typo/animations + alias shadcn + reset + a11y reduced-motion)
- `Fleuron.tsx` (SVG ornement signature 3 variants divider/mark/crown)
- `Wordmark.tsx` (ATELIER FRISSON réutilisable, inline/stacked/animate letter-by-letter)
- `Container.tsx` (narrow/default/wide/full max-widths)
- `AnnouncementBar.tsx` (marquee CSS continu, 4 messages)
- `Header.tsx` (sticky noir, grille 3 cols, underline or hover, mobile hamburger)
- `MobileNav.tsx` (Sheet shadcn, nav numérotée 01-04, tuiles secondaires)
- `Footer.tsx` (4 sections : newsletter + 4 cols liens + wordmark final + baseline légale)
- `NewsletterForm.tsx` (validation client + feedback, stub API Sprint 3)
- `navigation-data.ts` (source de vérité nav partagée)
- `AgeGate.tsx` (Arcom self-declaration, SSR cookie check, z-100 modal)
- `CookieBanner.tsx` (CNIL granulaire : strictly_necessary/analytics/marketing/personalization)
- `app/layout.tsx` (Bodoni Moda + Inter next/font, metadata FR, Header/Footer/AgeGate/Toaster)

**Homepage (`app/(marketing)/`, `components/marketing/`)**

- `page.tsx` — 8 sections (hero/manifeste/collection/bannière éditoriale/journal/newsletter/trust/wordmark signature)
- `HeroSplit.tsx` (split JOUR/NUIT + wordmark or stacked + CTA outline)
- `ProductSilhouette.tsx` (SVG abstrait sculpturale — remplace photo en attendant CJ)
- `ProductCardPreview.tsx` (carte produit + mini-silhouette, alternance ivoire/rouge)
- `ArticleCardPreview.tsx` (carte article avec gradient placeholder)
- `TrustSignals.tsx` (4 signaux réassurance avant footer)

**Base de données (`lib/db/`, `lib/supabase/`, `supabase/migrations/`)**

- `schema.ts` — 19 tables Drizzle (customers, addresses, categories, products,
  product_variants, carts, cart_items, orders, order_items, promotions, reviews,
  articles, forge_pages, redirects, marketing_events, admin_users, audit_log,
  invoices, newsletter_subscribers) + relations + types inferred
- `lib/db/index.ts` (Drizzle postgres.js, prepare:false pgbouncer, globalThis singleton dev)
- `lib/db/queries/{products,orders,customers,articles,forge}.ts` (memoïsées React cache)
- `lib/supabase/{client,server,admin,middleware}.ts` (SSR + service role server-only)
- `drizzle/0000_foamy_medusa.sql` (409 l, auto-généré)
- `supabase/migrations/0001_row_level_security.sql` (220 l : RLS + sequence + triggers)

**Sécurité (`lib/security/`)**

- `csp.ts` (generateNonce + buildCsp : default/script/style/img/font/connect/frame/worker)
- `rate-limit.ts` (Upstash Ratelimit 4 limiters : auth/api/forge/checkout, fallback dev)
- `sanitize.ts` (escapeHtml, stripTags, normalizeEmail, sanitizeSlug, truncate, anti-SSRF)

**Shared**

- `components/shared/SocialIcons.tsx` (Instagram + Pinterest SVG inline — lucide v1 a retiré brand icons)

**Documentation**

- `docs/SUPABASE_SETUP.md` (guide étape-par-étape Supabase EU + credentials + RLS + checklist)
- `.claude/rules/` : content, seo, accessibility, security, performance (30-80 l chacun)
- `README.md` (refonte complète)
- `docs/SESSION_HISTORY.md` (ce fichier)

### Décisions structurantes

1. **Dossier projet `AtelierFrisson_v0` avec majuscules** rejeté par npm →
   bootstrap dans sous-dossier `atelier-frisson` puis remontée du contenu.
   `package.json.name = "atelier-frisson"`.
2. **`next-themes` retiré** car pas de dark mode V1 (brief). `sonner.tsx`
   simplifié avec `theme="light"` hardcodé.
3. **AGENTS.md préservé** (warning Next 16 "breaking changes vs training
   data"). `CLAUDE.md` préfixé avec `@AGENTS.md` pour chaîner la lecture.
4. **Lucide v1 : brand icons retirés** → Instagram + Pinterest redéfinis en
   SVG inline dans `components/shared/SocialIcons.tsx`.
5. **Drizzle 0.45 : `text({length})` déprécié** → utilisation de `varchar()`
   pour country (ISO 2) et currency (ISO 3).
6. **Silhouettes produits en SVG abstrait** (inspiration Brancusi/Noguchi) :
   remplaceront les photos quand le catalogue CJ sera validé. Forme
   sculpturale évocatrice sans littéralité explicite.
7. **Age Gate SSR** : lu via `cookies()` dans Root Layout — pas de FOUC.
8. **Middleware CSP nonce-based** : nonce injecté dans requestHeaders puis
   dans response, Next.js auto-ajoute aux scripts inline.
9. **RLS helpers `is_admin()` + `is_admin_with_role()`** : `SECURITY DEFINER`
   pour permettre aux policies client de valider sans exposer admin_users.
10. **Scripts FORJA stubs** (`seed`, `forge-import`, `forge-validate`) :
    implémentation réelle en Sprints 2, 5.

### État du build

- `pnpm typecheck` : ✅ 0 erreurs
- `pnpm lint` : ✅ 0 warnings
- `pnpm build` : ✅ 12-14s compile, routes dynamiques (`ƒ`) à cause de
  `cookies()` du root layout, middleware détecté comme Proxy actif.

### Commits

1. `587e06a` Initial commit from Create Next App (auto)
2. `d93aaf4` feat: bootstrap Next.js 16 + Supabase/Drizzle stack + shadcn + project structure
3. (étape 2) feat(design-system): AF tokens + Bodoni+Inter + Header + Footer + Fleuron signature
4. (étape 3) feat(db): Drizzle schema 19 tables + Supabase clients SSR + queries + RLS SQL
5. (étape 4) feat(homepage): HeroSplit JOUR/NUIT + 8 sections éditoriales complètes
6. (étape 5) feat(compliance): AgeGate Arcom + CookieBanner CNIL granulaire
7. (étape 6) feat(security): middleware CSP nonce + rate limit Upstash + headers
8. (étape 7, final) feat(docs): README + .claude/rules + Husky + SESSION_HISTORY

### Reste à faire côté Odelie / Mehdi

**Avant Session 2** :

- [ ] Créer projet Supabase en région EU (Frankfurt/Paris) — `docs/SUPABASE_SETUP.md`
- [ ] Remplir `.env.local` (Supabase URL + anon + service_role + DATABASE_URL)
- [ ] `pnpm db:push` pour appliquer le schéma 19 tables
- [ ] Copier `supabase/migrations/0001_row_level_security.sql` dans Supabase SQL Editor → Run
- [ ] Installer `gh` (winget) ou créer le repo GitHub manuellement et configurer le remote

**À prévoir sur les sprints 2-7** :

- Installer Upstash Redis (rate limit prod)
- Connecter Sentry + PostHog (errors + funnels)
- CJdropshipping B2B credentials (Sprint 2, stub en dev)
- CCBill staging (Sprint 7, après K-Bis)
- VerifyMy / AnonymAGE API (Sprint 7, pré-prod Arcom)
- Resend API key + domaine vérifié (Sprint 3)
- Klaviyo public + private keys + liste principale (Sprint 3)
- Mux account + signing keys (Sprint 2)
- Cabinet expert-comptable (M1)

### Prochaine session (Session 2 — Sprint 2 Boutique)

Scope : page boutique + filtres + fiche produit premium (schema.org) +
collections JOUR/NUIT + panier drawer + intégration CJ sync (stub en dev).
Prérequis : Supabase setup + seed de 5-8 produits minimum.

---

_Fin de la Session 1. Mehdi : on passe sur Session 2 quand Supabase est setup._
