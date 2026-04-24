# FORGE_WORKFLOW.md — INTÉGRATION FORJA

**Workflow d'intégration de la factory pSEO FORJA dans Atelier Frisson**
**Version 1.0 — 24 avril 2026**

---

## 0. CONTEXTE

FORJA est la factory programmatique SEO de Numelite. Elle génère des pages SEO premium à partir de templates Jinja2 enrichis de données structurées et d'appels LLM (Claude Haiku pour la rédaction, GPT pour le QA).

Dans le Pack SEO Forge annuel (inclus dans le retainer 3 000 €/mois), FORJA génère **1 200 pages premium** sur 12 mois pour Atelier Frisson.

---

## 1. VOLUMES ET TEMPLATES

### Répartition des 1 200 pages

| Template | Volume | Route | Objectif SEO |
|---|---|---|---|
| `livraison_ville` | 500 | `/livraison/[ville]` | SEO local (villes FR) |
| `conseil_longtail` | 400 | `/conseils/[slug]` | Longue traîne informationnelle |
| `guide_specialise` | 200 | `/guides/[slug]` | Micro-guides thématiques |
| `produit_contexte` | 100 | `/produit/[slug]/[contexte]` | Pages produit contextualisées |

### Templates détaillés

**1. Template `livraison_ville`** (500 pages)

Variables Jinja2 :
- `{ville}`, `{region}`, `{codepostal_principal}`
- `{nb_habitants}`, `{departement}`
- `{delai_transporteur_principal}`, `{nb_points_relais}`
- `{temoignage_locale}` (rédigé manuellement ou via LLM)

Structure page :
- H1 : "Livraison discrète [Ville] en 48h — Atelier Frisson"
- Hero avec carte + délais
- Transporteurs disponibles (Colissimo, Mondial Relay, Chronopost)
- Points relais (OpenData La Poste)
- FAQ locale (4-6 questions)
- CTA boutique
- Maillage vers autres villes département + région

**2. Template `conseil_longtail`** (400 pages)

Variables :
- `{question}` (ex: "Quel stimulateur pour débutante discrète ?")
- `{contexte}` (budget, usage, matière, etc.)
- `{produits_recommandes}` (2-3 produits liés)

Structure :
- H1 = la question en long tail
- Introduction (200 mots) qui reformule la question
- 3-4 sections de réponse (H2) avec conseils concrets
- Sélection produits Atelier Frisson
- FAQ complémentaire
- Liens vers guides piliers

**3. Template `guide_specialise`** (200 pages)

Micro-guides sur sujets précis :
- "Comment entretenir un objet en silicone médical"
- "Matières à éviter pour un jouet intime"
- "Lubrifiants : eau, silicone, hybride — comparatif"
- etc.

Structure : 800-1 200 mots, plus court que guides piliers mais plus long que conseils longtail.

**4. Template `produit_contexte`** (100 pages)

Pages produit contextualisées : "Premier Frisson pour débutante", "Premier Frisson en cadeau pour sa partenaire", etc.

Canonical pointe vers la fiche produit principale, pour éviter duplicate content.

---

## 2. WORKFLOW D'INGESTION

### 2.1 Schéma global

```
┌────────────────┐   ┌──────────────┐   ┌─────────────────┐   ┌──────────────┐
│ FORJA factory  │──▶│ /api/forge/  │──▶│ forge_pages DB  │──▶│ /admin/forge │
│ (Numelite)     │   │ ingest       │   │ (status: draft) │   │ (validation) │
└────────────────┘   └──────────────┘   └─────────────────┘   └──────┬───────┘
                                                                       │
                                                                       ▼
                                                              ┌────────────────┐
                                                              │ forge_pages DB │
                                                              │ (status:       │
                                                              │  published)    │
                                                              └────────┬───────┘
                                                                       │
                                                                       ▼
                                                              ┌────────────────┐
                                                              │ Rendu public   │
                                                              │ Next.js ISR    │
                                                              └────────────────┘
```

### 2.2 Endpoint d'ingestion

Fichier : `app/api/forge/ingest/route.ts`

```ts
import { createHmac } from 'crypto';
import { z } from 'zod';
import { db } from '@/lib/db';
import { forgePages } from '@/lib/db/schema';

const IngestSchema = z.object({
  pages: z.array(z.object({
    slug: z.string().min(1).max(200),
    template: z.enum(['livraison_ville', 'conseil_longtail', 'guide_specialise', 'produit_contexte']),
    title: z.string().min(10).max(80),
    metaDescription: z.string().min(50).max(160),
    content: z.string().min(500),
    contentData: z.record(z.unknown()).optional(),
    h1: z.string().min(10).max(100),
    keywords: z.array(z.string()).max(20),
    canonicalUrl: z.string().url().optional(),
    schemaOrgData: z.record(z.unknown()).optional(),
    qualityScore: z.number().min(0).max(100),
  })),
});

export async function POST(request: Request) {
  // 1. Validation signature HMAC
  const signature = request.headers.get('x-forge-signature');
  const rawBody = await request.text();
  const expectedSig = createHmac('sha256', process.env.FORGE_INGEST_SECRET!)
    .update(rawBody).digest('hex');

  if (signature !== expectedSig) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // 2. Validation zod
  const body = JSON.parse(rawBody);
  const parsed = IngestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 });
  }

  // 3. Insertion batch en status='draft'
  const inserted = await db.insert(forgePages).values(
    parsed.data.pages.map(p => ({
      slug: p.slug,
      template: p.template,
      title: p.title,
      metaDescription: p.metaDescription,
      content: p.content,
      contentData: p.contentData,
      h1: p.h1,
      keywords: p.keywords,
      canonicalUrl: p.canonicalUrl,
      schemaOrgData: p.schemaOrgData,
      qualityScore: p.qualityScore,
      status: 'pending_review' as const,
    }))
  ).onConflictDoUpdate({
    target: forgePages.slug,
    set: { updatedAt: new Date() },
  }).returning();

  return Response.json({ ingested: inserted.length });
}
```

### 2.3 Validation humaine `/admin/forge`

Interface admin qui liste les pages en `status='pending_review'` avec :
- Preview de la page
- Score qualité (0-100)
- Actions : approuver → `status='published'`, rejeter → `status='archived'`, éditer inline
- Actions bulk : approuver top 50 / rejeter low-quality <70
- Filtres par template, score, date

**Règle critique** : aucune page FORJA n'est publique tant que `status != 'published'` ET `humanReviewed = true`.

### 2.4 Rendu public

Pages rendues en ISR avec `revalidate: 86400` (24h).

```ts
// app/(forge)/livraison/[ville]/page.tsx
export async function generateStaticParams() {
  const pages = await db.select({ slug: forgePages.slug })
    .from(forgePages)
    .where(and(
      eq(forgePages.status, 'published'),
      eq(forgePages.template, 'livraison_ville'),
    ));
  return pages.map(p => ({ ville: p.slug.replace('livraison-', '') }));
}

export async function generateMetadata({ params }) {
  const { ville } = await params;
  const page = await getForgePageBySlug(`livraison-${ville}`);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: page.canonicalUrl },
  };
}

export default async function ForgeLivraisonPage({ params }) {
  const { ville } = await params;
  const page = await getForgePageBySlug(`livraison-${ville}`);
  if (!page) notFound();
  return <ForgeLocalHero page={page} />;
}
```

---

## 3. QUALITÉ & E-E-A-T

### 3.1 Score qualité (0-100)

Calculé par FORJA avant ingestion :

- **+20** si longueur > 600 mots
- **+15** si structure H1/H2/H3 correcte
- **+15** si FAQ intégrée
- **+10** si données sourcées (citations)
- **+10** si maillage interne ≥ 3 liens
- **+10** si images avec alt descriptif
- **+10** si Schema.org présent et valide
- **+10** si pas de duplicate content (Simhash distance > 30 vs pages existantes)

**Seuil minimum publication** : 70/100. En dessous, la page est mise en queue pour enrichissement humain.

### 3.2 Enrichissement humain

Chaque lot de pages validées manuellement reçoit :

- **Relecture** et ajustement du ton sur 10 % aléatoire du lot
- **Ajout de témoignage** local réel (pour `livraison_ville`)
- **Validation expertise** (pour `guide_specialise` et `conseil_longtail`) : référencement à un sexologue ou pharmacien partenaire identifié

### 3.3 E-E-A-T requirements

Chaque page FORJA doit avoir :

- **Auteur identifié** : soit "L'équipe éditoriale Atelier Frisson", soit un expert nommé avec bio (sexologue partenaire, pharmacien D.E.)
- **Date de publication** et "Dernière mise à jour"
- **Schema.org Article** avec `author` typé `Person` ou `Organization`
- **Sources** pour les affirmations factuelles (études, sites médicaux officiels HAS, INSERM)
- **Mentions légales** accessibles en 1 clic depuis la page

---

## 4. MONITORING & KILL SWITCH

### 4.1 Monitoring via Google Search Console API

Job cron quotidien `/api/cron/forge-monitor` :

- Fetch des metrics GSC par URL FORJA :
  - `impressions`, `clicks`, `position`, `ctr`
- Update des champs `forgePages.impressions30d`, `clicks30d`, `avgPosition30d`, `indexedByGoogle`

Alertes admin :
- Si 100+ pages FORJA ont `position > 80` et `impressions < 10` pendant 30 jours → signal de pénalité
- Si trafic organique global chute > 30 % d'une semaine sur l'autre → alerte rouge

### 4.2 Kill switch global

Interface admin `/admin/forge/settings` :

- **Toggle "Publier les pages FORJA"** (on/off global)
- Si off : toutes les pages FORJA renvoient 410 Gone (pas 404 : on dit à Google qu'on a retiré volontairement)
- Sitemap regénéré sans ces URLs
- Redirections 301 optionnelles vers catégories pertinentes

### 4.3 Déindexation ciblée

Si des pages spécifiques sous-performent (score GSC bas) :
- Action admin : "Désindexer" → `status='archived'` + meta robots `noindex, nofollow` + retrait sitemap
- Si amélioration possible : retour en `pending_review` pour enrichissement humain

---

## 5. RYTHME DE PUBLICATION

Pour éviter un pic suspect dans les yeux de Google :

- **Mois 1** : 100 pages max (premières villes livraison)
- **Mois 2** : 100 pages additionnelles
- **Mois 3-6** : 100-150 pages / mois
- **Mois 7-12** : 50-100 pages / mois

Objectif : avoir un volume de publication qui ressemble à une activité éditoriale humaine soutenue, pas à un dump programmatique.

---

## 6. SÉCURITÉ & COMPLIANCE

### 6.1 Séparation des environnements

FORJA génère d'abord en **staging** (sous-domaine `forge-staging.atelierfrisson.fr` protégé par auth basic). Les pages sont validées en staging avant ingestion prod.

### 6.2 Pas de secret en dur

- `FORGE_INGEST_SECRET` : HMAC signature webhook ingestion
- `FORGE_WEBHOOK_SECRET` : pour les callbacks FORJA (par ex. alerte qualité)

### 6.3 Rate limiting

Endpoint `/api/forge/ingest` limité à 10 req/heure (au-delà c'est suspect). Ingestion par batch de 50 pages max par requête.

### 6.4 Logs d'audit

Toute action sur `forge_pages` (création, update status, archivage) est loggée dans `audit_log` avec :
- `actor_id` (admin qui valide) ou `actor_type='system'` si automatique
- `changes` (before / after)

---

## 7. COMMANDES UTILES

```bash
# Import batch manuel depuis JSON local
pnpm forge:import --file=./batch-livraison-villes-001.json

# Validation qualité d'un batch sans insérer
pnpm forge:validate --file=./batch.json

# Dump statistiques actuelles
pnpm forge:stats

# Regénération sitemap après ingestion
pnpm forge:sitemap-rebuild

# Kill switch en ligne de commande (urgence)
pnpm forge:kill-switch --enable
pnpm forge:kill-switch --disable
```

---

## 8. CRITÈRES DE SUCCÈS FORJA

- [ ] 100 premières pages publiées fin mois 1
- [ ] Taux d'indexation Google ≥ 80 % à M+2 de la publication
- [ ] Score qualité moyen ≥ 75/100
- [ ] Aucune pénalité manuelle Google Search Console
- [ ] Trafic organique FORJA : 500 visites/mois à M3, 3 000 à M12
- [ ] Conversion FORJA : 0,5-1 % (vers page boutique)
- [ ] Kill switch testé et fonctionnel

---

**Fin du workflow FORGE. Document à mettre à jour au fil des itérations.**
