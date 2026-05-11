'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { logAuditEvent } from '@/lib/audit/log';
import { routePayment } from '@/lib/payments/router';
import type { PSP } from '@/lib/payments/router';
import { checkHoneypot } from '@/lib/security/honeypot';

/**
 * Server Actions — Cartes cadeaux Atelier Frisson.
 *
 * Pattern : validation Zod stricte, audit log systématique, retour
 * `{ ok: true } | { ok: false, error: string }` discriminé.
 *
 * Branchement DB live : table `gift_cards` + `gift_card_transactions`
 * existent au schéma. Insert via Drizzle quand `DATABASE_URL` est défini.
 *
 * **État actuel (Sprint P2 du pivot)** : stubs avec orderRef simulé.
 * À brancher quand multi-PSP est live (CCBill webhook handler validé).
 */

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS ZOD
// ─────────────────────────────────────────────────────────────────────────────

const PurchaseGiftCardSchema = z
  .object({
    amountCents: z
      .number()
      .int()
      .min(3000, 'Montant minimum 30 €')
      .max(50000, 'Montant maximum 500 €'),
    physicalCard: z.boolean().default(false),
    recipientName: z.string().trim().min(1).max(80),
    recipientEmail: z.string().email().max(120),
    senderName: z.string().trim().min(1).max(80),
    senderEmail: z.string().email().max(120),
    message: z.string().max(280).default(''),
    sendDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide (YYYY-MM-DD)'),
    acceptedTerms: z.literal(true, {
      message: 'Acceptez les CGV pour continuer',
    }),
  })
  .superRefine((data, ctx) => {
    const sd = new Date(data.sendDate);
    if (Number.isNaN(sd.getTime())) {
      ctx.addIssue({ code: 'custom', message: 'Date invalide', path: ['sendDate'] });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sd.getTime() < today.getTime()) {
      ctx.addIssue({
        code: 'custom',
        message: "La date d'envoi doit être aujourd'hui ou ultérieure",
        path: ['sendDate'],
      });
    }
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    if (sd.getTime() > oneYear.getTime()) {
      ctx.addIssue({
        code: 'custom',
        message: "La date d'envoi est limitée à 12 mois",
        path: ['sendDate'],
      });
    }
  });

export type PurchaseGiftCardInput = z.infer<typeof PurchaseGiftCardSchema>;

const RedeemGiftCardSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{12,24}$/, 'Format de code invalide'),
});

// ─────────────────────────────────────────────────────────────────────────────
// RESULT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

interface PurchaseGiftCardResult {
  orderRef: string;
  paymentUrl: string;
  primaryPSP: PSP;
}

interface RedeemGiftCardResult {
  cardId: string;
  remainingBalanceCents: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Achat d'une carte cadeau — démarre le checkout via PSP routeur.
 *
 * Workflow :
 *   1. Validation Zod (montant, emails, date d'envoi)
 *   2. Calcul total (carte + 9 € si physique)
 *   3. Routage PSP (cartes cadeaux = catégorie soft → Stripe par défaut)
 *   4. Création gift_card en status 'pending' + initialBalance / remainingBalance
 *   5. Création checkout intent côté PSP, retour URL de paiement
 *   6. Webhook PSP `payment.success` → status 'active' + envoi email
 */
export async function purchaseGiftCardAction(
  rawInput: unknown,
): Promise<ActionResult<PurchaseGiftCardResult>> {
  // 0) Honeypot anti-bot
  const hp = checkHoneypot(rawInput);
  if (!hp.ok) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.info(`[giftcards] honeypot triggered: ${hp.reason}`);
    }
    // Réponse feinte success + URL paiement bidon (le bot suivra le lien et abandonnera)
    return {
      ok: true,
      data: {
        orderRef: 'AF-GC-FILTERED',
        paymentUrl: '/checkout/gift-card/AF-GC-FILTERED',
        primaryPSP: 'stripe',
      },
    };
  }

  // 1) Validate
  const parsed = PurchaseGiftCardSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation échouée',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;

  // 2) Total cents = amount + frais carte physique (9 €)
  const totalCents = data.amountCents + (data.physicalCard ? 900 : 0);

  // 3) Route PSP — gift card = soft pure (catégorie 'cosmetique' équivalente)
  const routing = routePayment([
    { categorySlug: 'cosmetique', productSlug: 'gift-card', quantity: 1 },
  ]);

  // 4) TODO : INSERT INTO gift_cards (...) VALUES (...) RETURNING id
  //    + générer code humain-lisible XXXX-XXXX-XXXX-XXXX (cf. lib/auth/totp.ts crypto helpers)
  //    + hash bcrypt/argon2 du code → `code_hash`
  //    + status = 'pending' jusqu'au webhook payment.success
  const stubOrderRef = `AF-GC-${Date.now().toString(36).toUpperCase()}`;

  // 5) TODO : créer Stripe Checkout Session ou CCBill FlexForm
  //    avec metadata.giftCardId pour reconnexion webhook → order
  const stubPaymentUrl = `/checkout/gift-card/${stubOrderRef}`;

  // 6) Audit
  try {
    const h = await headers();
    await logAuditEvent({
      actorType: 'customer',
      actorId: null, // anonymous purchase OK
      action: 'gift_card.purchase_initiated',
      resourceType: 'gift_card',
      resourceId: stubOrderRef,
      changes: {
        amountCents: data.amountCents,
        physicalCard: data.physicalCard,
        totalCents,
        recipientEmail: hashEmail(data.recipientEmail),
        senderEmail: hashEmail(data.senderEmail),
        psp: routing.primary,
        sendDate: data.sendDate,
      },
      ipAddress: h.get('x-forwarded-for'),
      userAgent: h.get('user-agent'),
    });
  } catch (err) {
    // Audit log graceful — ne bloque pas la commande
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('[giftcards] audit log skipped:', (err as Error).message);
    }
  }

  return {
    ok: true,
    data: {
      orderRef: stubOrderRef,
      paymentUrl: stubPaymentUrl,
      primaryPSP: routing.primary,
    },
  };
}

/**
 * Validation et application d'une carte cadeau au panier courant.
 *
 * - Constant-time comparison du code via codeHash
 * - Vérifie status = 'active', non-expired, remainingBalance > 0
 * - Retourne le solde disponible pour application au checkout
 */
export async function redeemGiftCardAction(
  rawInput: unknown,
): Promise<ActionResult<RedeemGiftCardResult>> {
  const parsed = RedeemGiftCardSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Code invalide',
    };
  }

  // TODO :
  //   1. Hash du code en input avec même algo que codeHash
  //   2. SELECT * FROM gift_cards WHERE code_hash = $1 AND status = 'active'
  //      AND expires_at > NOW() AND remaining_balance_cents > 0
  //   3. Si match : retourner remainingBalanceCents
  //   4. Application effective faite au moment du checkout (transaction
  //      atomique : gift_card_transactions.insert + gift_cards.update solde
  //      + orders.discountCents += min(balance, total))
  //   5. Audit log

  // Stub : on accepte tout code "AF-VALID-XXXXXXXX" en dev pour tests
  if (parsed.data.code.startsWith('AF-VALID-')) {
    return {
      ok: true,
      data: {
        cardId: '00000000-0000-0000-0000-000000000000',
        remainingBalanceCents: 5000,
      },
    };
  }

  return {
    ok: false,
    error: 'Code invalide ou carte expirée.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hash léger d'email pour ne pas log de PII en clair.
 * Pas un hash cryptographique — juste un offuscation pour les logs.
 */
function hashEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf('@');
  if (at < 2) return '***';
  return `${trimmed[0]}***${trimmed.slice(at)}`;
}
