# Sécurité — Atelier Frisson

**Source de vérité : `CLAUDE.md` §8 (4 couches) + `docs/SECURITY.md` (TBD).**

## Principes

- **Never trust client input.** Validation zod systématique sur toute
  frontière (API, Server Action, Server Component qui reçoit des params).
- **Least privilege.** Clé anon côté client ; service role **server-only**
  (marquée `import 'server-only'` dans `lib/supabase/admin.ts`).
- **Defense in depth.** Cloudflare WAF > Next middleware > app validation > DB RLS.

## Secrets

- **Jamais de secret en dur** dans le code, les commentaires, les commits.
- Tout passe par `.env.local` (dev) et Vercel env vars (prod).
- `.env*` ignoré par git sauf `.env.example`.
- Rotation : CCBill SALT, FORGE_INGEST_SECRET, Supabase service role, Resend,
  Sentry — à prévoir chaque 6 mois + à chaque fuite suspectée.

## Auth (clients & admins)

- Clients : magic link par défaut (Supabase Auth), 2FA TOTP optionnel.
- Admins : magic link + **2FA TOTP OBLIGATOIRE**. Sessions 7j max.
  Log IP/UA à chaque connexion, alerte email nouvelle IP.
- Rate limit auth : 5 tentatives/15 min/IP (Upstash). Admin : 3/15 min, lock 1h.

## CSP & headers

- CSP nonce-based dans `middleware.ts` (voir `lib/security/csp.ts`).
- HSTS preload, X-Frame-Options DENY, X-Content-Type-Options nosniff,
  Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy stricte.
- `frame-ancestors 'none'` (anti-clickjacking).

## RLS

- Activée sur les 19 tables. Policies : public read actif, own read/write,
  admin-only writes, owner-only audit log.
- Voir `supabase/migrations/0001_row_level_security.sql`.

## RGPD / Arcom

- Age Gate obligatoire (Arcom décret 2023-566). Pré-prod : VerifyMy ou
  AnonymAGE (double anonymat).
- Consentement granulaire analytics/marketing/personnalisation (CNIL).
- Droit à l'oubli : soft-delete immédiat + hard-delete cron J+30.
- Breach notification CNIL < 72h.

## Code

- Zéro `any`, zéro `as unknown as`.
- Sanitization côté applicatif via `lib/security/sanitize.ts`.
- CSRF : Server Actions protègent nativement (tokens Origin). Pour les
  routes API, vérifier `Origin` + `Content-Type`.
- Uploads (Supabase Storage, Mux) : MIME validation, scan virus en Sprint 4.
- Pas de `dangerouslySetInnerHTML` sauf Schema.org JSON-LD + MDX sanitisé.

## Dev

- `pnpm typecheck && pnpm lint && pnpm build` avant chaque PR.
- Husky pre-commit : typecheck + lint-staged (voir `.husky/pre-commit`).
- Ne jamais bypass les hooks (`--no-verify`) sans justification écrite.
