# SUPABASE_SETUP.md — Guide de configuration

**À faire côté Odelie/Mehdi — prérequis pour que le projet se lance en dev.**

---

## 1. Créer le projet Supabase

1. Aller sur [app.supabase.com](https://app.supabase.com) → **New project**.
2. **Region** : choisir **Europe West 3 (Frankfurt, eu-central-1)** ou **Europe West 2 (London, eu-west-2)**.
   Si Paris apparaît dans la liste Supabase Pro (2026), préférer Paris.
   Jamais de région hors UE (obligation RGPD + hébergement UE).
3. **Plan** : Free pour le dev. Passer en **Pro** avant la mise en production (PITR 7j + backups + support).
4. **Database password** : générer un mot de passe fort (32+ chars) et le stocker dans un gestionnaire.

---

## 2. Récupérer les credentials

Une fois le projet créé, aller dans **Project Settings**.

### 2.1 `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- **Settings → API** → section "Project URL" et "Project API keys"
- Copier :
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` (clé publique) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2 `SUPABASE_SERVICE_ROLE_KEY`

- Même page, toujours dans "Project API keys"
- Copier `service_role` (clé SECRET, ne jamais exposer au navigateur)
- ⚠️ Cette clé bypasse RLS — usage strictement serveur (webhooks, crons, admin).

### 2.3 `DATABASE_URL`

- **Settings → Database** → section "Connection string"
- Choisir **Transaction pooler (Port 6543)** — recommandé pour Next.js sur Vercel
- Format :
  ```
  postgresql://postgres.<project-ref>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- Le paramètre `?pgbouncer=true` est **obligatoire** (cf. `lib/db/index.ts`, `prepare: false`).

---

## 3. Remplir `.env.local`

Créer le fichier `.env.local` à la racine du projet (ne jamais le commiter — `.gitignore` le couvre) :

```bash
cp .env.example .env.local
```

Puis renseigner les 4 lignes Supabase :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Les autres credentials (Stripe, CCBill, CJ, Mux, etc.) seront renseignés au fil des sprints.

---

## 4. Appliquer le schéma DB (19 tables Drizzle)

```bash
pnpm db:push
```

Cette commande :
- Lit `lib/db/schema.ts`
- Compare avec l'état actuel de la DB Supabase
- Applique les différences (DDL) directement

> 💡 Alternative : `pnpm db:generate` produit un fichier SQL dans `drizzle/` que vous pouvez appliquer manuellement via Supabase Dashboard → SQL Editor.

---

## 5. Appliquer les policies Row Level Security

Le fichier `supabase/migrations/0001_row_level_security.sql` contient :

- Sequence `af_order_number_seq` (numéros AF-YYYY-NNNNNN atomiques)
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` sur les 19 tables
- Helpers `public.is_admin()` et `public.is_admin_with_role(role)`
- Policies par table (lecture publique, écriture admin, lecture propre à l'utilisateur, etc.)
- Triggers `updated_at`

**Application :**

Option A — Supabase Dashboard (recommandé) :

1. **SQL Editor** → **New query**
2. Coller le contenu du fichier
3. **Run**

Option B — CLI :

```bash
# Requiert supabase CLI (https://supabase.com/docs/guides/cli)
supabase db push --db-url "$DATABASE_URL" --file supabase/migrations/0001_row_level_security.sql
```

**Vérification** après application :

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Toutes les tables doivent avoir `rowsecurity = true`.

---

## 6. Vérification finale

Lancer le projet :

```bash
pnpm dev
```

Si aucune erreur Supabase n'apparaît au chargement de `http://localhost:3000`, la configuration est bonne.

Pour inspecter la DB : `pnpm db:studio` ouvre Drizzle Studio.

---

## 7. Checklist récapitulative

- [ ] Projet Supabase créé en région **EU**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` dans `.env.local`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`
- [ ] `DATABASE_URL` (Transaction pooler, port 6543) dans `.env.local`
- [ ] `pnpm db:push` exécuté sans erreur (19 tables créées)
- [ ] `0001_row_level_security.sql` appliqué dans Supabase SQL Editor
- [ ] `pnpm dev` démarre sans erreur
- [ ] `pnpm db:studio` montre les 19 tables

---

**Dès que tu as fait ça, tu me dis et je passe à l'Étape 4 (HeroSplit).**
