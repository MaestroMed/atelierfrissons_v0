/**
 * Codes promo mock — sera remplacé par la table `promotions` en Sprint 5
 * (cf. lib/db/schema.ts). Logique centralisée ici, pas dans la Server Action,
 * pour pouvoir partager la validation entre drawer cart et checkout.
 */

export type PromoKind = 'percentage' | 'fixed';

export interface PromoDefinition {
  code: string;
  kind: PromoKind;
  /** Si percentage : valeur en % (ex: 10). Si fixed : montant en centimes. */
  value: number;
  /** Panier minimum en centimes pour que le code s'applique. */
  minCents: number;
  /** Libellé affiché dans le drawer après application. */
  label: string;
}

/** Codes mock actifs (Sprint 1-4). Ajouter/retirer ici avant la table DB. */
export const MOCK_PROMOS: readonly PromoDefinition[] = [
  {
    code: 'WELCOME10',
    kind: 'percentage',
    value: 10,
    minCents: 0,
    label: 'Bienvenue — -10 %',
  },
  {
    code: 'DUO15',
    kind: 'percentage',
    value: 15,
    minCents: 15000, // 150 €
    label: 'Duo sélection — -15 % dès 150 €',
  },
  {
    code: 'GIFT500',
    kind: 'fixed',
    value: 500, // 5 €
    minCents: 0,
    label: 'Cadeau éditorial — -5 €',
  },
] as const;

export interface PromoValidationResult {
  ok: boolean;
  /** La définition si ok. */
  promo?: PromoDefinition;
  /** Montant de remise en centimes (arrondi). */
  discountCents?: number;
  /** Message d'erreur éventuel (UX). */
  message?: string;
}

/** Normalise un code : uppercase + trim, utilisé avant toute comparaison. */
export function normalizePromoCode(raw: string): string {
  return raw.trim().toUpperCase().slice(0, 50);
}

/**
 * Valide un code et calcule le montant de remise pour un sous-total donné.
 * Sprint 5 : remplacer par query `promotions WHERE code = ? AND is_active`.
 */
export function validatePromo(code: string, subtotalCents: number): PromoValidationResult {
  const normalized = normalizePromoCode(code);
  if (!normalized) {
    return { ok: false, message: 'Code manquant' };
  }
  const promo = MOCK_PROMOS.find((p) => p.code === normalized);
  if (!promo) {
    return { ok: false, message: 'Code invalide' };
  }
  if (subtotalCents < promo.minCents) {
    return {
      ok: false,
      message:
        promo.minCents > 0
          ? `Code valable à partir de ${(promo.minCents / 100).toFixed(0)} € de panier`
          : 'Code invalide pour ce panier',
    };
  }
  const discountCents =
    promo.kind === 'percentage'
      ? Math.round((subtotalCents * promo.value) / 100)
      : Math.min(promo.value, subtotalCents); // on ne descend jamais sous 0
  return { ok: true, promo, discountCents };
}
