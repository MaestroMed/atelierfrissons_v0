import 'server-only';

/**
 * Honeypot anti-bot — protection des forms publics (waitlist, ambassadrice,
 * gift card, candidature DPO).
 *
 * Pattern :
 *   1. Le form a un champ caché `_hp` (visuellement invisible mais présent
 *      dans le DOM, sans `display: none` — sinon les bots intelligents le
 *      détectent). Plutôt `aria-hidden + opacity:0 + position:absolute`.
 *   2. Un humain ne le remplit jamais (autocomplete OFF, label off-screen).
 *   3. Un bot brute-force remplit tous les champs.
 *   4. Si `_hp` non vide à la soumission → REJET silencieux (200 OK
 *      pour ne pas révéler la détection).
 *
 * Combiné avec rate limiting Upstash, c'est ~99 % des bots filtrés.
 */

export interface HoneypotCheckResult {
  ok: boolean;
  reason?: 'honeypot_filled' | 'submission_too_fast';
}

const MIN_SUBMISSION_DELAY_MS = 1500; // un humain met au moins 1.5s à remplir un form

/**
 * Vérifie deux signaux anti-bot :
 *   - `_hp` non vide → bot
 *   - `_t` (timestamp de rendu) trop récent → bot trop rapide
 *
 * À utiliser côté Server Action / API route au tout début, avant validation Zod :
 *
 * ```ts
 * const honeypot = checkHoneypot(rawInput);
 * if (!honeypot.ok) {
 *   // Réponse "success" feinte pour ne pas signaler la détection
 *   return { ok: true, message: 'Merci.' };
 * }
 * ```
 */
export function checkHoneypot(input: unknown): HoneypotCheckResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: true };
  }
  const obj = input as Record<string, unknown>;

  // Honeypot field
  const hp = obj['_hp'];
  if (typeof hp === 'string' && hp.trim() !== '') {
    return { ok: false, reason: 'honeypot_filled' };
  }

  // Timestamp field — soumission trop rapide
  const t = obj['_t'];
  if (typeof t === 'string' || typeof t === 'number') {
    const tNum = typeof t === 'number' ? t : Number.parseInt(t, 10);
    if (!Number.isNaN(tNum) && tNum > 0) {
      const elapsed = Date.now() - tNum;
      if (elapsed >= 0 && elapsed < MIN_SUBMISSION_DELAY_MS) {
        return { ok: false, reason: 'submission_too_fast' };
      }
    }
  }

  return { ok: true };
}
