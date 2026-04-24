/**
 * Utilitaires de sanitisation — défense en profondeur pour les inputs
 * utilisateur. Complémentaire de la validation zod et du paramétrage Drizzle.
 *
 * ⚠️ Ne remplacent pas une vraie librairie (DOMPurify, sanitize-html) pour
 * le contenu HTML utilisateur. Voir lib/cms/sanitize-mdx.ts (Sprint 5).
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

/** Échappe les caractères HTML dans une chaîne (anti-XSS basique). */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'/]/g, (c) => HTML_ESCAPES[c] ?? c);
}

/** Retire toutes les balises HTML. Pour inputs courts (titres, meta, etc.). */
export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/** Normalise un email : trim + lowercase. Jamais d'espace, toujours bas. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Transforme une chaîne quelconque en slug URL-safe.
 * Gère les accents français (é → e, à → a, etc.).
 */
export function sanitizeSlug(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les diacritiques
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

/** Limite la taille d'une chaîne avec ellipsis éditoriale (« … »). */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return `${input.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Retire les caractères de contrôle invisibles (NUL, ANSI, zero-width…). */
export function removeControlChars(input: string): string {
  return input.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\uFEFF]/g, '');
}

/** Sanitise un input de recherche : trim + strip tags + limite longueur. */
export function sanitizeSearchQuery(input: string): string {
  return truncate(stripTags(removeControlChars(input.trim())), 200);
}

/**
 * Vérifie qu'une chaîne est une URL http(s) valide et ne pointe pas vers un
 * réseau interne (SSRF defense basique). Renvoie null si invalide.
 */
export function sanitizeExternalUrl(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    // SSRF : bloquer localhost, private ranges, metadata endpoints
    const host = url.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '169.254.169.254' ||
      host.endsWith('.internal') ||
      host.endsWith('.local')
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
