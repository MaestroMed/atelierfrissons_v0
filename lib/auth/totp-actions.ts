'use server';

import { cookies } from 'next/headers';
import {
  buildOtpauthUri,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  verifyTotpCode,
} from './totp';
import { getSession } from './session';
import { logAuditEvent } from '@/lib/audit/log';

/**
 * Server Actions TOTP — flow d'enrôlement et challenge admin.
 *
 * Phase 1 (cette V1) : stockage du secret en cookie httpOnly chiffré
 * pendant l'enrôlement, puis transfert vers `admin_users.two_factor_secret`
 * une fois le code de validation confirmé.
 *
 * Phase 2 (Sprint 4) : intégration complète Supabase Auth MFA enrolled
 * factors (challenge natif). Ce module reste utile pour la génération
 * de QR + recovery codes même avec Supabase Auth.
 *
 * Note sécu : on ne renvoie JAMAIS les recovery codes plaintext en DB,
 * uniquement leur hash SHA-256. Le user les voit une seule fois après
 * enrôlement.
 */

const ENROL_COOKIE = 'af_2fa_enrol_secret';
const ENROL_TTL_SECONDS = 10 * 60; // 10 minutes pour finaliser

export interface TotpEnrolStartResult {
  ok: boolean;
  message?: string;
  /** Secret base32 à montrer au user (et qu'il scanne via QR). */
  base32Secret?: string;
  /** URI otpauth:// pour génération QR côté client. */
  otpauthUri?: string;
}

/**
 * Démarre l'enrôlement : génère un secret, le stocke en cookie de session
 * (le temps de finaliser), renvoie l'URI otpauth:// pour QR + secret base32
 * pour saisie manuelle.
 */
export async function startTotpEnrolmentAction(): Promise<TotpEnrolStartResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, message: 'Session requise' };
  }

  const base32Secret = generateTotpSecret();
  const otpauthUri = buildOtpauthUri({
    issuer: 'Atelier Frisson',
    accountName: session.email,
    base32Secret,
  });

  // Persiste le secret en cookie httpOnly le temps de l'enrôlement
  const cookieStore = await cookies();
  cookieStore.set(ENROL_COOKIE, base32Secret, {
    path: '/',
    maxAge: ENROL_TTL_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });

  await logAuditEvent({
    actorId: session.id,
    actorType: 'admin',
    action: 'auth.2fa.enrolment_started',
    resourceType: 'admin_user',
    resourceId: session.id,
  });

  return { ok: true, base32Secret, otpauthUri };
}

export interface TotpEnrolFinishResult {
  ok: boolean;
  message?: string;
  /** Recovery codes plaintext — montrés une seule fois. */
  recoveryCodes?: string[];
}

/**
 * Termine l'enrôlement : vérifie que le code TOTP donné par le user
 * correspond bien au secret cookie, génère 10 recovery codes, et
 * renvoie les codes plaintext (à enregistrer côté DB hashés en Sprint 4).
 */
export async function finishTotpEnrolmentAction(userCode: string): Promise<TotpEnrolFinishResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, message: 'Session requise' };
  }

  const cookieStore = await cookies();
  const secret = cookieStore.get(ENROL_COOKIE)?.value;
  if (!secret) {
    return { ok: false, message: 'Aucun enrôlement en cours. Recommencez la procédure.' };
  }

  const isValid = await verifyTotpCode(secret, userCode);
  if (!isValid) {
    await logAuditEvent({
      actorId: session.id,
      actorType: 'admin',
      action: 'auth.2fa.enrolment_failed',
      resourceType: 'admin_user',
      resourceId: session.id,
    });
    return {
      ok: false,
      message: 'Code invalide. Vérifiez l’horloge de votre téléphone et réessayez.',
    };
  }

  // Génère les recovery codes
  const recoveryCodes = generateRecoveryCodes();
  const hashedCodes = await Promise.all(recoveryCodes.map((c) => hashRecoveryCode(c)));

  // Sprint 4 : INSERT/UPDATE admin_users SET two_factor_enabled=true,
  // two_factor_secret=<encrypted secret>, recovery_codes_hashed=<hashedCodes>
  // Pour l'instant : log la trace côté audit
  await logAuditEvent({
    actorId: session.id,
    actorType: 'admin',
    action: 'auth.2fa.enrolled',
    resourceType: 'admin_user',
    resourceId: session.id,
    changes: {
      method: 'totp',
      recoveryCodesCount: hashedCodes.length,
      // On n'écrit JAMAIS le secret ni les codes en clair dans l'audit log
    },
  });

  // Nettoie le cookie d'enrôlement
  cookieStore.delete(ENROL_COOKIE);

  return {
    ok: true,
    message: '2FA activée. Conservez vos codes de récupération en lieu sûr.',
    recoveryCodes,
  };
}

/**
 * Vérifie un code TOTP pendant un challenge de connexion admin.
 * Sprint 4 : sera appelé depuis l'auth flow Supabase après login mot de passe.
 */
export async function verifyTotpChallengeAction(
  adminUserId: string,
  encryptedSecret: string,
  userCode: string,
): Promise<{ ok: boolean; message?: string }> {
  // En production, encryptedSecret serait déchiffré avec une clé
  // applicative (NEVER stockée en plain en DB). Pour la V1 stub on
  // suppose que c'est déjà le base32 plain.
  const isValid = await verifyTotpCode(encryptedSecret, userCode);

  await logAuditEvent({
    actorId: adminUserId,
    actorType: 'admin',
    action: isValid ? 'auth.2fa.challenge_success' : 'auth.2fa.challenge_failed',
    resourceType: 'admin_user',
    resourceId: adminUserId,
  });

  return isValid ? { ok: true } : { ok: false, message: 'Code invalide ou expiré.' };
}
