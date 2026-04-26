# GO LIVE CHECKLIST — Atelier Frisson

**Document de bord** pour la mise en production. À cocher dans l'ordre.
Sans tout cocher, **on ne déploie pas**.

---

## A. Pré-requis juridiques (côté Odelie)

- [ ] **K-Bis SASU France reçu** (Kairos / Numelite ne peut rien faire avant)
- [ ] **Compte bancaire Qonto pro ouvert** (RIB + IBAN dispo)
- [ ] **Statuts SASU déposés** au greffe
- [ ] **N° SIRET attribué** (à mettre dans `lib/invoices/generate-invoice-html.ts` `DEFAULT_SELLER`)
- [ ] **N° RCS Paris attribué** (idem)
- [ ] **N° TVA intracommunautaire FR** (idem)

## B. Comptes services tiers

- [ ] **Supabase** projet créé en **EU region** (Frankfurt ou Paris)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only, jamais exposé)
  - [ ] `DATABASE_URL` (pooler Transaction port 6543 + `?pgbouncer=true`)
- [ ] **CCBill** onboardé (2-5 sem après K-Bis)
  - [ ] `CCBILL_ACCOUNT_ID`
  - [ ] `CCBILL_SUB_ACCOUNT`
  - [ ] `CCBILL_SALT`
  - [ ] `CCBILL_WEBHOOK_SECRET`
- [ ] **CJdropshipping B2B** validé
  - [ ] `CJ_API_EMAIL`
  - [ ] `CJ_API_KEY`
  - [ ] `CJ_WAREHOUSE_CODE=CJPL` (Pologne UE)
- [ ] **Resend** domaine `atelierfrisson.fr` vérifié (SPF + DKIM + DMARC)
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL=contact@atelierfrisson.fr`
- [ ] **Klaviyo** liste principale créée + flows configurés
  - [ ] `KLAVIYO_PUBLIC_KEY`
  - [ ] `KLAVIYO_PRIVATE_KEY`
- [ ] **Mux** account + signing keys
  - [ ] `MUX_TOKEN_ID`
  - [ ] `MUX_TOKEN_SECRET`
  - [ ] `MUX_WEBHOOK_SECRET`
- [ ] **Upstash Redis** (rate limit prod actif)
  - [ ] `UPSTASH_REDIS_URL`
  - [ ] `UPSTASH_REDIS_TOKEN`
- [ ] **Sentry** projet créé
  - [ ] `SENTRY_DSN`
  - [ ] `SENTRY_AUTH_TOKEN`
- [ ] **PostHog** projet
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY`
  - [ ] `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] **VerifyMy ou AnonymAGE** (Arcom Phase 2 obligatoire juin 2026)
  - [ ] `VERIFYMY_API_KEY`
  - [ ] `VERIFYMY_MERCHANT_ID`
- [ ] **Cloudflare** zone configurée devant Vercel (WAF, bot management)

## C. Configuration Supabase

- [ ] `pnpm db:push` exécuté → 19 tables créées
- [ ] **Migration RLS** appliquée : `supabase/migrations/0001_row_level_security.sql`
      copiée dans Supabase SQL Editor → Run
- [ ] Bucket `products-images` créé (Storage > New bucket > Public read)
- [ ] Bucket `editorial-assets` créé pour articles & guides
- [ ] `pnpm db:seed` exécuté (catégories + produits + 1er admin)
- [ ] Premier admin user inséré dans `admin_users` (email Odelie)

## D. Configuration Vercel

- [ ] Repo GitHub privé `atelier-frisson` créé + push
- [ ] Import du repo dans Vercel
- [ ] **Toutes les variables env** ci-dessus copiées dans Vercel Settings → Environment Variables
- [ ] Domaines configurés :
  - [ ] `atelierfrisson.fr` (apex)
  - [ ] `www.atelierfrisson.fr` (redirect 301 → apex)
  - [ ] `atelierfrisson.com` (redirect 301 → .fr)
- [ ] DNS pointé vers Vercel (A + AAAA + CNAME)
- [ ] SSL automatique vérifié (Let's Encrypt via Vercel)
- [ ] **`vercel.json`** validé (build optimization main only — voir CLAUDE user prefs)

## E. Validation technique avant go-live

- [ ] `pnpm typecheck` ✓
- [ ] `pnpm lint` ✓
- [ ] `pnpm build` ✓ (70+ routes générées)
- [ ] `pnpm audit:security http://localhost:3000` → 8/8 ✓
- [ ] `pnpm audit:security https://staging.atelierfrisson.fr` → 8/8 ✓
- [ ] **Lighthouse staging** : ≥ 95 mobile + desktop sur `/` et `/produit/[slug]`
- [ ] **Mozilla Observatory** grade A+ sur staging URL
- [ ] **SSL Labs** grade A+ sur staging URL
- [ ] **Schema.org Validator** : Product, Article, BreadcrumbList, FAQPage, Organization
      passent tous (https://validator.schema.org/)
- [ ] **Tests E2E Playwright** (Sprint 8) : checkout, age gate, palette, panier ✓
- [ ] **Audit RGAA AA** automatisé (axe-core via Playwright)

## F. Validation business avant go-live

- [ ] Catalogue 8 produits avec **vraies photos** (pas silhouettes SVG)
      uploadées dans Supabase Storage
- [ ] Description éditoriale + FAQ + specs validées par Odelie
- [ ] **8 pages légales** relues juridiquement (CGV par avocat)
- [ ] **Politique RGPD** validée par DPO ou avocat data
- [ ] **Première commande test** via CCBill staging → reçue chez Odelie,
      facture PDF générée, email Resend reçu, événement Klaviyo loggé
- [ ] **Ordre de paiement** réel testé sur compte CCBill prod (1 €) puis
      refund pour valider le flow complet
- [ ] **Premier remboursement** testé via admin
- [ ] **Première inscription newsletter** + DOI + welcome email reçu
- [ ] **Age gate** testé avec cookie clear

## G. Sécurité finale

- [ ] **2FA TOTP activée** sur tous les admin users (`/admin/securite-2fa`)
- [ ] Recovery codes admin **archivés en gestionnaire mots de passe**
- [ ] `.env.local` non committé (vérifier `git ls-files | grep env`)
- [ ] Aucun secret en dur dans le code (`grep -r "sk_live\|sb_secret\|whsec_" --include="*.ts"`)
- [ ] `NEWSLETTER_DOI_SECRET` rotaté (≠ valeur dev)
- [ ] `FORGE_INGEST_SECRET` rotaté
- [ ] Cloudflare WAF activé avec règles OWASP
- [ ] Rate limit Upstash actif (5/min auth, 100/min API)
- [ ] **Audit log instrumenté** sur toutes les Server Actions admin sensibles
- [ ] **Sentry alertes** Slack configurées (erreurs > 1% / 5 min)

## H. Performance

- [ ] **Mux video heros** uploadées pour les 6 produits signature
- [ ] **Vercel Analytics** activé (`@vercel/analytics`)
- [ ] **Vercel Speed Insights** activé (`@vercel/speed-insights`)
- [ ] **PostHog autoCapture** activé via Partytown (script offload)
- [ ] **`pnpm analyze`** : first load JS < 120 KB gzip
- [ ] **CDN cache Cloudflare** vérifié (HIT sur assets statiques)
- [ ] **ISR `revalidate: 60`** vérifié sur produits (changement reflété en < 1 min)

## I. Sitemap & SEO

- [ ] `/sitemap.xml` accessible et valide (https://www.xml-sitemaps.com/)
- [ ] `/robots.txt` bloque `/api/`, `/admin/`, `/compte/`, `/checkout/`,
      `/auth/`, GPTBot, CCBot
- [ ] **Search Console** sites apex + www soumis + sitemap submit
- [ ] **Bing Webmaster Tools** idem
- [ ] **Open Graph images** vérifiées sur Twitter Card Validator + Facebook Sharing Debugger
- [ ] **Schema.org rich results** vérifiés via https://search.google.com/test/rich-results

## J. Communication go-live

- [ ] Note Odelie : « Le site est live » + URL + admin login
- [ ] Note presse (3 emails préparés) — Madame Figaro, ELLE, Vogue France
- [ ] Post Instagram d'ouverture programmé
- [ ] Newsletter d'ouverture envoyée (segment « inscrits avant lancement »)
- [ ] Statut « Maison du rituel intime — Paris » épinglé sur le profil

---

## Estimation totale jusqu'au go-live

Une fois K-Bis SASU reçu :

| Phase                              | Durée                       |
| ---------------------------------- | --------------------------- |
| Onboarding CCBill                  | 2-5 semaines                |
| Configuration tous services tiers  | 3-5 jours                   |
| Migration DB + seed + RLS          | 1 jour                      |
| Tests E2E Playwright (Sprint 8)    | 2 jours                     |
| Photos produits + uploads          | 5-10 jours (shoot prévu)    |
| Pentest sommaire                   | 1 jour                      |
| Lighthouse / Mozilla / SSL Labs    | 0.5 jour                    |
| Premier commande test bout-en-bout | 1 jour                      |
| **TOTAL minimal**                  | **~3 semaines** après K-Bis |

---

## Fichiers de référence

- Variables env : `.env.example`
- Schema DB : `lib/db/schema.ts` (19 tables)
- Migrations RLS : `supabase/migrations/0001_row_level_security.sql`
- Audit security script : `scripts/audit-security-headers.ts`
- Tests E2E : `tests/e2e/` (Sprint 8)
- Performance budgets : `.claude/rules/performance.md`
- Conformité éditoriale : `.claude/rules/content.md`
- Conformité SEO YMYL : `docs/SEO_STRATEGY.md`
- Conformité Arcom + RGPD + TVA : `docs/COMPLIANCE.md` (à créer Sprint 8)
