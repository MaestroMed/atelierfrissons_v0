import 'server-only';

/**
 * TOTP (Time-based One-Time Password) — implémentation native RFC 6238.
 *
 * Utilise Web Crypto API (subtleCrypto.importKey + sign) pour HMAC-SHA1.
 * Pas de dépendance npm — tout est en standard Node.js / WebCrypto.
 *
 * Compatible Google Authenticator, Authy, 1Password, Bitwarden, etc.
 *
 * Référence : https://datatracker.ietf.org/doc/html/rfc6238
 */

const TOTP_PERIOD_SEC = 30;
const TOTP_DIGITS = 6;
const TOTP_ALGO = 'SHA-1';

/** Encode un buffer en base32 (RFC 4648, pas de padding). */
export function bufferToBase32(buf: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < buf.length; i++) {
    value = (value << 8) | buf[i]!;
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }
  return output;
}

/** Décode une chaîne base32 (RFC 4648) en Uint8Array. */
export function base32ToBuffer(base32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = base32.replace(/=+$/g, '').toUpperCase().replace(/\s+/g, '');
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of cleaned) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Uint8Array.from(bytes);
}

/** Génère un secret aléatoire (160 bits = 20 octets) encodé en base32. */
export function generateTotpSecret(): string {
  const buf = new Uint8Array(20);
  crypto.getRandomValues(buf);
  return bufferToBase32(buf);
}

/** Calcule un code TOTP à 6 chiffres pour un secret base32 et un timestamp. */
export async function generateTotpCode(
  base32Secret: string,
  timestampMs: number = Date.now(),
): Promise<string> {
  const counter = Math.floor(timestampMs / 1000 / TOTP_PERIOD_SEC);
  const counterBuf = new ArrayBuffer(8);
  const view = new DataView(counterBuf);
  // Counter 64-bit big-endian (high 32 zéros pour les timestamps réalistes)
  view.setUint32(0, Math.floor(counter / 0x100000000), false);
  view.setUint32(4, counter & 0xffffffff, false);

  const keyBuf = base32ToBuffer(base32Secret);
  // Cast vers ArrayBuffer (le buffer de Uint8Array peut être SharedArrayBuffer
  // ce que WebCrypto refuse — on slice pour forcer une copie ArrayBuffer pure)
  const keyArrayBuf = keyBuf.buffer.slice(
    keyBuf.byteOffset,
    keyBuf.byteOffset + keyBuf.byteLength,
  ) as ArrayBuffer;
  const key = await crypto.subtle.importKey(
    'raw',
    keyArrayBuf,
    { name: 'HMAC', hash: TOTP_ALGO },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, counterBuf);
  const sig = new Uint8Array(sigBuf);

  // Dynamic truncation (RFC 4226 §5.3)
  const offset = sig[sig.length - 1]! & 0x0f;
  const code =
    ((sig[offset]! & 0x7f) << 24) |
    ((sig[offset + 1]! & 0xff) << 16) |
    ((sig[offset + 2]! & 0xff) << 8) |
    (sig[offset + 3]! & 0xff);

  const mod = 10 ** TOTP_DIGITS;
  return (code % mod).toString().padStart(TOTP_DIGITS, '0');
}

/**
 * Vérifie un code TOTP utilisateur. Tolère ±1 fenêtre (90 secondes au total)
 * pour absorber le clock drift entre serveur et téléphone.
 */
export async function verifyTotpCode(
  base32Secret: string,
  userCode: string,
  windowsTolerance = 1,
): Promise<boolean> {
  const cleaned = userCode.replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleaned)) return false;

  const now = Date.now();
  for (let w = -windowsTolerance; w <= windowsTolerance; w++) {
    const ts = now + w * TOTP_PERIOD_SEC * 1000;
    const expected = await generateTotpCode(base32Secret, ts);
    // Comparaison constant-time
    if (timingSafeStringEqual(expected, cleaned)) return true;
  }
  return false;
}

/** Comparaison de strings en temps constant pour éviter les timing attacks. */
function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Construit l'URI `otpauth://` à passer dans un QR code.
 * Compatible avec toutes les apps authenticator standard.
 *
 * Exemple rendu :
 *   otpauth://totp/Atelier%20Frisson:odelie@maison.fr?secret=ABCD...&issuer=Atelier%20Frisson&algorithm=SHA1&digits=6&period=30
 */
export function buildOtpauthUri(params: {
  issuer: string;
  accountName: string;
  base32Secret: string;
}): string {
  const { issuer, accountName, base32Secret } = params;
  const label = encodeURIComponent(`${issuer}:${accountName}`);
  const search = new URLSearchParams({
    secret: base32Secret,
    issuer,
    algorithm: 'SHA1',
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD_SEC),
  });
  return `otpauth://totp/${label}?${search.toString()}`;
}

/**
 * Génère 10 codes de récupération (16 caractères alphanumériques).
 * Stockés hashés en DB (admin_users.recovery_codes) — Sprint 4 : ajouter
 * la colonne via migration.
 */
export function generateRecoveryCodes(count = 10): string[] {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // pas de 0/O/1/I pour éviter ambiguïté
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let code = '';
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    for (let j = 0; j < 16; j++) {
      code += alphabet[buf[j]! % alphabet.length];
    }
    // Format XXXX-XXXX-XXXX-XXXX pour la lisibilité
    codes.push(
      `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`,
    );
  }
  return codes;
}

/** Hash SHA-256 d'un recovery code pour stockage DB. */
export async function hashRecoveryCode(code: string): Promise<string> {
  const buf = new TextEncoder().encode(code.toUpperCase().replace(/\s+/g, ''));
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
