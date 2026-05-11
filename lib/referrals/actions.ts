'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { randomBytes } from 'crypto';
import { logAuditEvent } from '@/lib/audit/log';
import { requireSession } from '@/lib/auth/session';

/**
 * Server Actions — Programme parrainage Atelier Frisson.
 *
 * Mécanique : 20 € pour le parrain, 20 € pour le filleul, à la 1ère commande
 * du filleul (≥ 60 €). Crédit attribué J+14 après livraison (délai retours).
 *
 * Tables Drizzle utilisées :
 *   - `referrals`                       (1 row par code unique généré)
 *   - `loyalty_points_transactions`     (crédit du parrain en points / cents)
 *
 * **État (Sprint P3 du pivot)** : stubs avec ID déterministe basé sur la
 * session. À brancher sur Drizzle queries quand `DATABASE_URL` est défini
 * et la table `referrals` est seedée.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS ZOD
// ─────────────────────────────────────────────────────────────────────────────

const ApplyReferralCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^AF-[A-Z0-9-]{4,20}$/, 'Format de code invalide'),
});

// ─────────────────────────────────────────────────────────────────────────────
// RESULT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface GenerateCodeResult {
  code: string;
  shareUrl: string;
  alreadyExisted: boolean;
}

interface ApplyCodeResult {
  referralId: string;
  refereeRewardCents: number;
}

interface ReferralStats {
  totalShared: number;
  signedUp: number;
  firstPurchases: number;
  rewarded: number;
  pendingRewardCents: number;
  totalCreditedCents: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère (ou récupère) le code de parrainage unique du parrain courant.
 *
 * Idempotent : si un code existe déjà pour le user, on le retourne tel quel.
 * Le code est généré sur 6 caractères alphanumériques (sans I/O/0/1 pour
 * éviter les confusions visuelles) après un préfixe "AF-".
 *
 * Format : `AF-A4F2KX` — 8 chars total, lisible, copiable.
 */
export async function generateReferralCodeAction(): Promise<ActionResult<GenerateCodeResult>> {
  const user = await requireSession('/compte/parrainage');
  const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://atelierfrisson.fr';

  // TODO : SELECT code FROM referrals WHERE referrer_id = $1 LIMIT 1
  // → si match, retourner { code, alreadyExisted: true }
  // Sinon : générer + INSERT INTO referrals (referrer_id, code, status, expires_at)

  // Stub déterministe basé sur user.id pour cohérence dev
  const code = generateDeterministicCode(user.id);
  const shareUrl = `${siteUrl}/?ref=${code}`;

  try {
    await logAuditEvent({
      actorType: 'customer',
      actorId: user.id,
      action: 'referral.code_generated',
      resourceType: 'referral',
      resourceId: code,
      changes: { generated: true },
    });
  } catch {
    /* graceful */
  }

  return {
    ok: true,
    data: {
      code,
      shareUrl,
      alreadyExisted: true, // toujours true en stub car déterministe
    },
  };
}

/**
 * Applique un code de parrainage au panier de l'utilisateur courant.
 *
 * Validations :
 *   - Code existe en DB et statut != 'expired'
 *   - L'utilisateur n'est pas le parrain lui-même (pas d'auto-parrainage)
 *   - L'utilisateur n'a pas déjà été filleul d'un autre code (1× par compte)
 *   - L'utilisateur n'a pas encore commandé (filleul = nouveau client)
 *
 * Effet : associe le code au cart courant. Le crédit s'applique au checkout.
 */
export async function applyReferralCodeAction(
  rawInput: unknown,
): Promise<ActionResult<ApplyCodeResult>> {
  const user = await requireSession('/checkout');
  const parsed = ApplyReferralCodeSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Code invalide' };
  }

  // TODO :
  //   1. SELECT * FROM referrals WHERE code = $1 AND status IN ('pending', 'signed_up')
  //      AND (expires_at IS NULL OR expires_at > NOW())
  //   2. Reject si referral.referrer_id = user.id (auto-parrainage)
  //   3. SELECT count(*) FROM orders WHERE customer_id = user.id
  //      → reject si > 0 (filleul = nouveau client uniquement)
  //   4. UPDATE carts SET referral_code = $1 WHERE customer_id = user.id
  //      (ou stocker dans cookie côté checkout pour invité→signup → checkout)
  //   5. UPDATE referrals SET referee_id = user.id, status = 'signed_up',
  //      signed_up_at = NOW() WHERE code = $1

  if (parsed.data.code === 'AF-VALID-DEMO') {
    try {
      await logAuditEvent({
        actorType: 'customer',
        actorId: user.id,
        action: 'referral.code_applied',
        resourceType: 'referral',
        resourceId: parsed.data.code,
        changes: { applied: true, refereeRewardCents: 2000 },
      });
    } catch {
      /* */
    }
    return {
      ok: true,
      data: {
        referralId: '00000000-0000-0000-0000-000000000000',
        refereeRewardCents: 2000,
      },
    };
  }

  return { ok: false, error: 'Code introuvable ou déjà utilisé.' };
}

/**
 * Crédite le parrain après confirmation de la 1ère commande du filleul.
 *
 * Appelé depuis le webhook PSP `payment.success` quand l'order paid contient
 * un referral_code. Le crédit s'effectue J+14 après delivered_at pour
 * couvrir le délai légal de retour (cron quotidien `processReferralCredits`).
 *
 * Ce n'est PAS exposé comme Server Action côté client — c'est interne.
 * Mais on le met ici pour cohérence avec le module.
 */
export async function creditReferralRewardAction(input: {
  referralCode: string;
  triggeringOrderId: string;
}): Promise<ActionResult<{ creditedCents: number }>> {
  // TODO :
  //   1. SELECT * FROM referrals WHERE code = $1 AND status = 'first_purchase'
  //   2. Si déjà 'rewarded' → no-op idempotent
  //   3. INSERT INTO loyalty_points_transactions
  //      (customer_id, points, reason='referral_bonus', notes, balance_after)
  //   4. UPDATE referrals SET status='rewarded', rewarded_at=NOW(),
  //      triggering_order_id=$2 WHERE code=$1
  //   5. Trigger Klaviyo event `Referral Rewarded` → email "20 € de crédit gagné"

  try {
    await logAuditEvent({
      actorType: 'system',
      actorId: null,
      action: 'referral.rewarded',
      resourceType: 'referral',
      resourceId: input.referralCode,
      changes: {
        triggeringOrderId: input.triggeringOrderId,
        creditedCents: 2000,
      },
    });
  } catch {
    /* */
  }

  return { ok: true, data: { creditedCents: 2000 } };
}

/**
 * Lecture des stats de parrainage du parrain courant.
 *
 * Aggregé depuis la table `referrals` filtré par `referrer_id`.
 * Cache 60s côté server (cf. requireSession qui est cached par requête).
 */
export async function getReferralStatsAction(): Promise<ActionResult<ReferralStats>> {
  const user = await requireSession('/compte/parrainage');

  // TODO : SELECT
  //   count(*) FILTER (WHERE status != 'expired') AS total_shared,
  //   count(*) FILTER (WHERE status IN ('signed_up','first_purchase','rewarded')) AS signed_up,
  //   count(*) FILTER (WHERE status IN ('first_purchase','rewarded')) AS first_purchases,
  //   count(*) FILTER (WHERE status = 'rewarded') AS rewarded,
  //   sum(referrer_reward_cents) FILTER (WHERE status = 'first_purchase') AS pending,
  //   sum(referrer_reward_cents) FILTER (WHERE status = 'rewarded') AS credited
  // FROM referrals WHERE referrer_id = $1

  // Stub déterministe pour cohérence dev (mêmes valeurs entre refresh)
  const seed = parseInt(user.id.replace(/[^0-9]/g, '').slice(0, 4) || '0', 10);
  return {
    ok: true,
    data: {
      totalShared: (seed % 7) + 2,
      signedUp: (seed % 4) + 1,
      firstPurchases: (seed % 3) + 1,
      rewarded: seed % 3,
      pendingRewardCents: ((seed % 3) + 1) * 2000,
      totalCreditedCents: (seed % 3) * 2000,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans I, O, 0, 1

/**
 * Génère un code à 6 caractères depuis 16 octets aléatoires.
 * Utilisé en backend pour la création initiale (1 row referrals).
 */
function generateRandomCode(): string {
  const buf = randomBytes(8);
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += ALPHABET[buf[i]! % ALPHABET.length];
  }
  return `AF-${out}`;
}

/**
 * Stub déterministe pour dev (même user → même code à chaque appel).
 * Sera remplacé par lecture DB en prod.
 */
function generateDeterministicCode(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  let n = Math.abs(hash);
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += ALPHABET[n % ALPHABET.length];
    n = Math.floor(n / ALPHABET.length);
  }
  return `AF-${out}`;
}

// Exporté pour usage admin / cron (création directe d'un code unique pour
// un user qui n'en a pas encore). Garde la fonction utilisable sans Server Action.
export { generateRandomCode };
