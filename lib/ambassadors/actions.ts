'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { logAuditEvent } from '@/lib/audit/log';
import { trackEvent } from '@/lib/klaviyo/track';
import { checkHoneypot } from '@/lib/security/honeypot';

/**
 * Server Action — candidature programme ambassadrice Atelier Frisson.
 *
 * Workflow :
 *   1. Validation Zod stricte (handle Instagram + audience size + bio)
 *   2. Audit log (trace + RGPD)
 *   3. Klaviyo event `Submitted Ambassador Application` → flow auto :
 *      - Email auto à candidate "On a bien reçu votre candidature, réponse < 7j"
 *      - Email à `presse@atelierfrisson.fr` avec le détail de la candidature
 *   4. INSERT dans une table dédiée (à créer en sprint pivot suivant)
 *
 * Les candidatures sont reviewed manuellement par Odelie.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS ZOD
// ─────────────────────────────────────────────────────────────────────────────

const SUBMIT_SCHEMA = z.object({
  firstName: z.string().trim().min(2, 'Prénom trop court').max(60),
  email: z.string().email('Email invalide').max(120),
  instagramHandle: z
    .string()
    .trim()
    .min(2, 'Pseudo Instagram requis')
    .max(40)
    .regex(/^@?[a-zA-Z0-9._]+$/, 'Pseudo Instagram invalide')
    .transform((v) => (v.startsWith('@') ? v : `@${v}`)),
  audienceSize: z.enum([
    'under_5k',
    '5k_15k',
    '15k_50k',
    '50k_150k',
    'over_150k',
  ]),
  niche: z.enum([
    'lifestyle_couple',
    'beauty_wellness',
    'fashion_lingerie',
    'sexology_education',
    'art_culture',
    'autre',
  ]),
  bio: z
    .string()
    .trim()
    .min(40, 'Décrivez votre contenu en 40 caractères minimum')
    .max(800, 'Limite 800 caractères'),
  pourquoi: z
    .string()
    .trim()
    .min(40, 'Cette section est obligatoire')
    .max(800),
  acceptedTerms: z.literal(true, {
    message: 'Acceptez les conditions de candidature',
  }),
});

export type SubmitAmbassadorInput = z.infer<typeof SUBMIT_SCHEMA>;

// ─────────────────────────────────────────────────────────────────────────────
// RESULT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

interface SubmitResult {
  applicationId: string;
  estimatedResponseDays: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTION
// ─────────────────────────────────────────────────────────────────────────────

export async function submitAmbassadorApplicationAction(
  rawInput: unknown,
): Promise<ActionResult<SubmitResult>> {
  // Honeypot — réponse "success" feinte si déclenché (anti-fingerprinting)
  const hp = checkHoneypot(rawInput);
  if (!hp.ok) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.info(`[ambassador] honeypot triggered: ${hp.reason}`);
    }
    return {
      ok: true,
      data: {
        applicationId: 'AMB-DEMO-FILTERED',
        estimatedResponseDays: 7,
      },
    };
  }

  const parsed = SUBMIT_SCHEMA.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation échouée',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;

  const applicationId = `AMB-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;

  // ── 1) Audit log (trace + RGPD) ──────────────────────────────────────
  try {
    const h = await headers();
    await logAuditEvent({
      actorType: 'anonymous',
      actorId: null,
      action: 'ambassador.application_submitted',
      resourceType: 'ambassador_application',
      resourceId: applicationId,
      changes: {
        instagramHandle: data.instagramHandle,
        audienceSize: data.audienceSize,
        niche: data.niche,
        // Email hashé pour pas garder PII en clair en log
        emailHash: hashEmail(data.email),
      },
      ipAddress: h.get('x-forwarded-for'),
      userAgent: h.get('user-agent'),
    });
  } catch {
    /* graceful */
  }

  // ── 2) Klaviyo event — déclenche flow d'ack auto ────────────────────
  try {
    await trackEvent('Submitted Ambassador Application', {
      email: data.email,
      properties: {
        ApplicationId: applicationId,
        InstagramHandle: data.instagramHandle,
        AudienceSize: data.audienceSize,
        Niche: data.niche,
        BioPreview: data.bio.slice(0, 200),
        WhyMessage: data.pourquoi.slice(0, 200),
      },
    });
  } catch {
    /* */
  }

  // TODO Sprint pivot suivant :
  //   3. INSERT INTO ambassador_applications (id, email, ig_handle, ...) VALUES ($1, ...)
  //      - table à créer (pas dans schema.ts encore)
  //      - status 'pending' jusqu'à review Odelie
  //   4. Send notification email Odelie (via Resend) avec lien admin pour
  //      review/approve/reject

  if (process.env['NODE_ENV'] !== 'production') {
    console.info('[ambassador] application received:', {
      applicationId,
      handle: data.instagramHandle,
      audience: data.audienceSize,
      niche: data.niche,
    });
  }

  return {
    ok: true,
    data: {
      applicationId,
      estimatedResponseDays: 7,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function hashEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf('@');
  if (at < 2) return '***';
  return `${trimmed[0]}***${trimmed.slice(at)}`;
}
