# Pivot Roadmap — Atelier Frisson V2 « Couples 30-50 »

**Direction validée** : dropship couples premium-discret + paid ads adultes + recurring box.
**Cible go-live pivot** : T0 + 6 semaines (post-K-Bis SASU + onboarding CCBill).
**Document de pilotage** — mis à jour après chaque sprint.

---

## Sprints du pivot (4 sprints × ~1 semaine)

### Sprint P1 — Foundations DB & UX (semaine 1) ⏳ EN COURS

- [x] Schéma DB étendu : 9 nouvelles tables (subscriptions, plans, shipments, bundles,
      bundle_items, gift_cards, gift_card_transactions, loyalty_points, referrals)
- [x] Brief Odelie + état des lieux + roadmap publiés dans `docs/`
- [ ] Mock data pivot : 30 produits "Couples 30-50" pour préview catalogue
- [ ] Homepage refondue : split « Pour Vous Deux / Pour Elle / Pour Lui »
- [ ] Nav refondue : Boutique > Pour Vous Deux | Pour Elle | Pour Lui | Cadeaux | Box Mensuelle
- [ ] Collections renommées : `/collections/couples` `/collections/elle` `/collections/lui`
      `/collections/cadeaux` (redirects 301 depuis jour/nuit)
- [ ] Landing `/box-mensuelle` (3 plans : Découverte 39€ / Premium 49€ / Trio 59€)
- [ ] Pages `/bundles` + `/bundle/[slug]`

### Sprint P2 — Multi-PSP + Box recurring (semaine 2)

- [ ] `lib/payments/router.ts` : routing PSP par catégorie produit (Stripe soft / CCBill hard /
      Verotel backup)
- [ ] Webhook handlers : `/api/webhooks/{ccbill,verotel,stripe}/route.ts`
      (idempotency, signature verify, retry queue)
- [ ] Client recurring CCBill : création abonnement, modification, annulation
- [ ] Page client `/compte/abonnements` (statut, pause, skip mois, annuler)
- [ ] Module admin `/admin/abonnements` (liste, MRR, churn, contenus à venir)
- [ ] Email Klaviyo flow "subscription" (welcome, prochaine box, skip rappel, churn winback)
- [ ] Cron `/api/cron/process-subscriptions` (tous les jours, génère shipments due)

### Sprint P3 — Marketing & acquisition (semaine 3)

- [ ] Pinterest Tag (config ID + events ViewContent, AddToCart, Checkout, PageVisit)
- [ ] Pinterest Rich Pins via meta `og:type=product` + `product:price:amount`/`currency`
- [ ] OG images dynamiques portrait 1000x1500 optimisées Pinterest (route `/api/og/pin`)
- [ ] TrafficJunky / ExoClick / Plugrush conversion pixels (Sale event)
- [ ] Programme parrainage : génération codes uniques, page `/compte/parrainage`,
      attribution récompense post-1ère commande filleul
- [ ] Cartes cadeaux : page `/cartes-cadeaux`, checkout dédié, email envoi à destinataire
- [ ] Programme fidélité points : UI compte + débit/crédit auto par event order
- [ ] Sitemap optimisé Pinterest (XML séparé pour images)

### Sprint P4 — Catalogue 150 SKUs + recette (semaine 4)

- [ ] `scripts/cj-sync-products.ts` (import + mapping fields CJ → schema)
- [ ] `scripts/shewin-sync.ts` + `scripts/spocket-sync.ts` (import lingerie + cosmétique)
- [ ] Génération descriptions SEO 200-400 mots × 150 SKUs (assistance IA + revue Odelie)
- [ ] Photos produit retouchées + uploadées Supabase Storage
- [ ] Bundles préfabriqués 20-30 combos (admin saisie + composition vérifiée)
- [ ] Tests E2E Playwright : checkout one-time, checkout subscription, parrainage,
      gift card redemption
- [ ] Lighthouse ≥ 95 mobile sur homepage + boutique + produit + bundle + box-mensuelle
- [ ] `pnpm audit:security` 8/8 ✓ sur staging
- [ ] Recette Odelie complète bout-en-bout

---

## Stack pivot — adds vs original brief

### Nouvelles dépendances envisagées

- `@types/uuid` (déjà présent via Drizzle)
- `qrcode` (déjà présent via TOTP, réutilisable pour cartes cadeaux)
- **Aucune nouvelle dépendance npm requise** pour les fondations
- **CCBill SDK** : pas de SDK officiel, on intègre via signature HMAC + REST (cf. docs CCBill
  Datalink + FlexForms)
- **Verotel SDK** : idem, signature HMAC + REST
- **Pinterest Conversion API** : via fetch direct, token applicatif

### Variables env supplémentaires

```
# CCBill recurring
CCBILL_DATALINK_USERNAME=
CCBILL_DATALINK_PASSWORD=
CCBILL_FLEXFORM_ID=
CCBILL_RECURRING_PRICING_ID=

# Verotel backup
VEROTEL_SHOP_ID=
VEROTEL_SIGNATURE_KEY=

# Pinterest
PINTEREST_TAG_ID=
PINTEREST_CONVERSION_ACCESS_TOKEN=

# Ad networks (optionnel, conversion pixels uniquement)
TRAFFICJUNKY_PIXEL_ID=
EXOCLICK_PIXEL_ID=
PLUGRUSH_PIXEL_ID=

# Affiliate program (Goaffpro ou Refersion)
AFFILIATE_PROVIDER=goaffpro
AFFILIATE_API_KEY=
```

---

## KPI cibles à 6 mois

| Métrique                   | Mois 3  | Mois 6   |
| -------------------------- | ------- | -------- |
| Visiteurs uniques mensuels | 2 000   | 8 000    |
| Conversion DTC             | 1,2 %   | 1,8 %    |
| AOV (one-time)             | 75 €    | 85 €     |
| Commandes one-time / mois  | 30      | 145      |
| Abonnés Box mensuelle      | 20      | 120      |
| MRR Box                    | 800 €   | 5 200 €  |
| Newsletter optin           | 600     | 3 500    |
| ROAS ads (blended)         | 1,2x    | 2,0x     |
| CA mensuel total           | 3 000 € | 16 000 € |
| Marge nette %              | -10 %   | 12 %     |

---

## Owner par chantier

| Chantier                        | Owner                  | Validation                          |
| ------------------------------- | ---------------------- | ----------------------------------- |
| Schéma DB pivot                 | Mehdi (Numelite)       | ✅ Validé typecheck                 |
| UX homepage / collections / nav | Mehdi                  | ⏳ Maquette à valider Odelie        |
| Box mensuelle (DB + UI + admin) | Mehdi                  | ⏳ Concept Odelie                   |
| Multi-PSP + webhooks            | Mehdi                  | ⏳ Compte CCBill ouvert             |
| Pinterest + tracking ads        | Mehdi                  | ⏳ Compte Pinterest Business Odelie |
| Catalogue 150 SKUs CJ + Shewin  | **Odelie** + Mehdi     | ⏳ Sélection visio                  |
| Photos / descriptions × 150     | **Odelie** + freelance | —                                   |
| Onboarding CCBill / Verotel     | **Odelie**             | ⏳ Post K-Bis SASU                  |
| Onboarding CJ B2B               | **Odelie**             | ⏳                                  |
| Comptable spécialisé            | **Odelie**             | ⏳                                  |
| Pinterest Business + Tailwind   | **Odelie**             | ⏳                                  |

---

## Décisions à acter avant Sprint P2

1. ✅ **Niche couples 30-50** validée (par défaut, modifiable)
2. ⏳ **Plans Box** : Découverte 39 € / Premium 49 € / Trio 59 € (à confirmer)
3. ⏳ **Récompense parrainage** : 20 € / 20 € (vs 15 € / 15 € ou 25 € / 25 €)
4. ⏳ **Récompense fidélité** : 1 € = 1 point, 100 pts = 5 € (vs autre ratio)
5. ⏳ **Carte cadeau expiration** : 12 mois (vs 18 ou 24)
6. ⏳ **FORJA** : on garde en latence ou on supprime ?
7. ⏳ **Mux** : on garde pour videos produits (~25 $/mois) ou on supprime ?
