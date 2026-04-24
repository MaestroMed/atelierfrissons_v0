import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Double Opt-In (DOI) stateless tokens — HMAC-signed payload, pas de DB.
 *
 * Structure :
 *   payload  = `${email}|${timestampMs}|${purpose}`
 *   signature = HMAC-SHA256(SECRET, payload) — hex truncé à 24 chars
 *   token    = base64url(payload).base64url(signature)
 *
 * Expiration : 48h par défaut (large pour ne pas frustrer les utilisateurs).
 * Aucune persistance : si quelqu'un réémet un token identique dans la fenêtre,
 * il est accepté — c'est OK pour un DOI newsletter (idempotent). Pour des
 * actions destructives, on ajouterait un nonce persisté.
 */

const DEFAULT_TTL_MS = 48 * 60 * 60 * 1000; // 48h
const SIGNATURE_HEX_LENGTH = 24; // 12 octets tronqués — résistance suffisante pour un DOI

export type DoiPurpose = 'newsletter-subscribe' | 'newsletter-unsubscribe';

export interface DoiPayload {
  email: string;
  purpose: DoiPurpose;
  issuedAt: number;
}

function getSecret(): string {
  // Fallback dev : secret déterministe pour que les tokens restent valides
  // entre restarts de dev server. À remplacer en prod.
  return (
    process.env.NEWSLETTER_DOI_SECRET ??
    process.env.FORGE_INGEST_SECRET ??
    'dev-insecure-doi-secret-please-rotate-in-production'
  );
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  // Padding back to multiple of 4
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64').toString('utf8');
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret())
    .update(payload, 'utf8')
    .digest('hex')
    .slice(0, SIGNATURE_HEX_LENGTH);
}

/** Crée un token DOI signé. */
export function createDoiToken(email: string, purpose: DoiPurpose): string {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) throw new Error('Email required to create DOI token');
  const payload = `${normalizedEmail}|${Date.now()}|${purpose}`;
  const signature = sign(payload);
  return `${base64urlEncode(payload)}.${base64urlEncode(signature)}`;
}

export type VerifyResult =
  | { ok: true; payload: DoiPayload }
  | { ok: false; reason: 'malformed' | 'signature' | 'expired' };

/** Vérifie un token DOI et retourne le payload s'il est valide. */
export function verifyDoiToken(token: string, ttlMs: number = DEFAULT_TTL_MS): VerifyResult {
  if (!token || typeof token !== 'string') return { ok: false, reason: 'malformed' };

  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'malformed' };
  const [encodedPayload, encodedSig] = parts;
  if (!encodedPayload || !encodedSig) return { ok: false, reason: 'malformed' };

  let payloadStr: string;
  let providedSig: string;
  try {
    payloadStr = base64urlDecode(encodedPayload);
    providedSig = base64urlDecode(encodedSig);
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const expectedSig = sign(payloadStr);
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  const providedBuf = Buffer.from(providedSig, 'utf8');
  if (expectedBuf.length !== providedBuf.length) return { ok: false, reason: 'signature' };
  if (!timingSafeEqual(expectedBuf, providedBuf)) return { ok: false, reason: 'signature' };

  const segments = payloadStr.split('|');
  if (segments.length !== 3) return { ok: false, reason: 'malformed' };
  const [email, tsStr, purpose] = segments;
  if (!email || !tsStr || !purpose) return { ok: false, reason: 'malformed' };
  const issuedAt = Number.parseInt(tsStr, 10);
  if (!Number.isFinite(issuedAt)) return { ok: false, reason: 'malformed' };

  if (purpose !== 'newsletter-subscribe' && purpose !== 'newsletter-unsubscribe') {
    return { ok: false, reason: 'malformed' };
  }

  if (Date.now() - issuedAt > ttlMs) {
    return { ok: false, reason: 'expired' };
  }

  return {
    ok: true,
    payload: { email, purpose, issuedAt },
  };
}
