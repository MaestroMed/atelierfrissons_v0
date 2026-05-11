/**
 * Multi-PSP routing — pivot V2 « Couples 30-50 ».
 *
 * Décide quel PSP utiliser pour une commande donnée selon la catégorie
 * dominante des produits. Trois PSPs sont prévus :
 *
 *   - Stripe  : catégories soft (cosmétique intime, accessoires) — process
 *               Stripe standard, frais ~1.4 % + 0.25 €.
 *   - CCBill  : catégories hard (objets, lingerie de séduction) — high-risk
 *               adulte, frais ~10-15 % + abonnement, mais accepte le secteur.
 *   - Verotel : backup auto si CCBill ferme le compte ou refuse une transaction.
 *
 * Module 100 % pur, sans effets de bord. Aucune dépendance npm. Testable
 * unitairement.
 *
 * Voir docs/PIVOT_ROADMAP.md §Sprint P2 et docs/BRIEF_ODELIE.md §3.
 */

import type { Category } from '@/lib/db/schema';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type PSP = 'stripe' | 'ccbill' | 'verotel';

export interface CartLineForRouting {
  /** Slug catégorie (`objets` / `lingerie` / `cosmetique` / `accessoires`). */
  categorySlug: string | null;
  /** Slug produit (utilisé pour les exceptions par produit). */
  productSlug?: string;
  quantity: number;
}

export interface PaymentRouting {
  /** PSP choisi en priorité. */
  primary: PSP;
  /**
   * Chaîne de fallback en cas de refus / panne du primary. Premier élément
   * = essai immédiat ; second = essai après notification admin.
   */
  fallbacks: readonly PSP[];
  /**
   * Raison du choix (label humain pour log + admin dashboard).
   */
  reason: string;
  /**
   * Vrai si la commande contient au moins un produit "hard" qui force CCBill
   * — utile pour afficher un message au checkout sur le PSP utilisé.
   */
  isHighRisk: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY → PSP MAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mapping catégorie → PSP préférentiel.
 * Si une commande mélange plusieurs catégories, la règle "le hard l'emporte"
 * s'applique (cf. `pickPrimaryPSP`).
 */
const CATEGORY_PSP_PREFERENCE: Record<string, PSP> = {
  // Hard — high-risk adulte
  objets: 'ccbill',
  lingerie: 'ccbill',
  // Soft — Stripe accepte
  cosmetique: 'stripe',
  accessoires: 'stripe',
} as const;

/**
 * Exceptions par slug produit. Permet de surclasser la catégorie pour des
 * cas-limites (ex : un coffret cadeau qui contient des produits hard sera
 * routé en CCBill malgré sa catégorie `accessoires`).
 */
const PRODUCT_PSP_OVERRIDE: Record<string, PSP> = {
  // Le Coffret Rituel contient bougie + huile + plume + carte → soft : Stripe OK
  'coffret-rituel': 'stripe',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Route une commande vers le PSP optimal.
 *
 * @example
 * ```ts
 * const routing = routePayment([
 *   { categorySlug: 'lingerie', productSlug: 'sillage', quantity: 1 },
 *   { categorySlug: 'cosmetique', productSlug: 'source', quantity: 2 },
 * ]);
 * // → { primary: 'ccbill', fallbacks: ['verotel', 'stripe'], reason: '...',
 * //     isHighRisk: true }
 * ```
 */
export function routePayment(lines: readonly CartLineForRouting[]): PaymentRouting {
  if (lines.length === 0) {
    return {
      primary: 'stripe',
      fallbacks: ['ccbill', 'verotel'] as const,
      reason: 'Panier vide — fallback Stripe',
      isHighRisk: false,
    };
  }

  const psps = lines.map(pspForLine);
  const primary = pickPrimaryPSP(psps);
  const isHighRisk = psps.some((p) => p === 'ccbill');

  // Chaîne de fallback : on ordonne les PSPs alternatifs selon la sensibilité
  // de la commande. Si high-risk : Verotel d'abord (autre high-risk-friendly),
  // Stripe en dernier (refusera probablement).
  const fallbacks: readonly PSP[] = isHighRisk
    ? primary === 'ccbill'
      ? ['verotel', 'stripe']
      : ['ccbill', 'verotel']
    : primary === 'stripe'
      ? ['ccbill', 'verotel']
      : ['stripe', 'verotel'];

  const reason = explainReason(primary, isHighRisk, lines.length);

  return { primary, fallbacks, reason, isHighRisk };
}

/**
 * Résout le PSP préférentiel pour une ligne donnée.
 * Override produit > catégorie > défaut Stripe.
 */
export function pspForLine(line: CartLineForRouting): PSP {
  if (line.productSlug && PRODUCT_PSP_OVERRIDE[line.productSlug]) {
    return PRODUCT_PSP_OVERRIDE[line.productSlug]!;
  }
  if (line.categorySlug && CATEGORY_PSP_PREFERENCE[line.categorySlug]) {
    return CATEGORY_PSP_PREFERENCE[line.categorySlug]!;
  }
  return 'stripe';
}

/**
 * Helper : route un panier déjà résolu en `Category[]` + slugs.
 * Utile depuis les Server Actions checkout.
 */
export function routePaymentFromCategories(
  categoriesWithCounts: ReadonlyArray<{
    category: Pick<Category, 'slug'> | null;
    productSlug: string;
    quantity: number;
  }>,
): PaymentRouting {
  return routePayment(
    categoriesWithCounts.map(({ category, productSlug, quantity }) => ({
      categorySlug: category?.slug ?? null,
      productSlug,
      quantity,
    })),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIQUE INTERNE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Règle "le hard l'emporte" : dès qu'une seule ligne est CCBill, la commande
 * entière passe en CCBill (Stripe refuserait probablement la commande mixte).
 */
function pickPrimaryPSP(psps: readonly PSP[]): PSP {
  if (psps.includes('ccbill')) return 'ccbill';
  if (psps.includes('verotel')) return 'verotel';
  return 'stripe';
}

function explainReason(primary: PSP, isHighRisk: boolean, lineCount: number): string {
  if (primary === 'ccbill') {
    return `Commande contient au moins un produit catégorie objets/lingerie (${lineCount} ligne${lineCount > 1 ? 's' : ''}) — routée vers CCBill (high-risk adulte certifié).`;
  }
  if (primary === 'verotel') {
    return 'Routage vers Verotel (CCBill indisponible ou catégorie spécifique).';
  }
  return isHighRisk
    ? 'Routage Stripe — vérifier compatibilité (high-risk présent).'
    : `Commande soft uniquement (${lineCount} ligne${lineCount > 1 ? 's' : ''}) — Stripe optimal.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIABLES D'ENVIRONNEMENT ATTENDUES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Variables d'environnement nécessaires. À documenter dans `.env.example`.
 * Cette liste sert de check au démarrage — appeler `assertPaymentEnv()`
 * dans le boot du serveur (`instrumentation.ts`).
 */
export const REQUIRED_PAYMENT_ENV: Record<PSP, readonly string[]> = {
  stripe: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
  ccbill: [
    'CCBILL_ACCOUNT_NUM',
    'CCBILL_SUB_ACCOUNT_NUM',
    'CCBILL_FLEXFORM_ID',
    'CCBILL_DATALINK_USERNAME',
    'CCBILL_DATALINK_PASSWORD',
    'CCBILL_WEBHOOK_SECRET',
  ],
  verotel: [
    'VEROTEL_SHOP_ID',
    'VEROTEL_SECRET',
    'VEROTEL_WEBHOOK_SECRET',
  ],
} as const;

/**
 * Vérifie que les variables d'env d'un PSP sont définies. Retourne le tableau
 * des variables manquantes (vide si tout est OK). Ne lève pas — l'appelant
 * décide de l'action à prendre (degrade vers fallback PSP, log, etc).
 */
export function checkPaymentEnv(psp: PSP): readonly string[] {
  const required = REQUIRED_PAYMENT_ENV[psp];
  return required.filter((key) => {
    const val = process.env[key];
    return !val || val.trim() === '';
  });
}

/**
 * Boot-time check : lève si l'un des PSPs prévus en prod n'est pas configuré.
 * À appeler depuis `instrumentation.ts` ou un Server Action de boot.
 */
export function assertPaymentEnv(psps: readonly PSP[] = ['stripe']): void {
  const errors: string[] = [];
  for (const psp of psps) {
    const missing = checkPaymentEnv(psp);
    if (missing.length > 0) {
      errors.push(`[${psp}] missing env: ${missing.join(', ')}`);
    }
  }
  if (errors.length > 0) {
    throw new Error(`Payment env check failed:\n${errors.join('\n')}`);
  }
}
