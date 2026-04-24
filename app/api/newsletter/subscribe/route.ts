import { NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeEmail } from '@/lib/security/sanitize';
import { subscribeToList, trackEvent } from '@/lib/klaviyo/track';
import { sendWelcome } from '@/lib/resend/send';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Route Handler d'inscription newsletter — appelée par NewsletterForm.
 *
 * Flow :
 *   1. Valide le payload (email + source)
 *   2. UPSERT dans `newsletter_subscribers` via service role (ignore les
 *      double opt-ins — idempotent)
 *   3. Track Klaviyo `Subscribed to List` event
 *   4. Envoi email de bienvenue Resend
 *   5. Renvoie { ok, message }
 *
 * En dev sans Supabase : skip étape 2 mais exécute 3+4 (graceful fallback).
 */

const bodySchema = z.object({
  email: z.string().email('Email invalide').max(255),
  source: z.string().max(50).optional().default('unknown'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Payload invalide' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? 'Email invalide',
      },
      { status: 400 },
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const source = parsed.data.source;

  // ── 1. Persist DB (si Supabase configuré) ─────────────────────────
  let persistedOk = false;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createSupabaseAdminClient();
      // upsert : ne casse pas si l'email existe déjà
      const { error } = await admin.from('newsletter_subscribers').upsert(
        {
          email,
          status: 'subscribed',
          source,
          confirmed_at: new Date().toISOString(),
        },
        { onConflict: 'email' },
      );
      if (error) {
        console.error('[newsletter/subscribe] DB upsert failed:', error);
      } else {
        persistedOk = true;
      }
    }
  } catch (err) {
    console.error('[newsletter/subscribe] DB exception:', err);
  }

  // ── 2. Klaviyo subscribe + track ──────────────────────────────────
  try {
    await Promise.all([
      subscribeToList(email),
      trackEvent('Subscribed to List', {
        email,
        properties: { source, persistedDb: persistedOk },
      }),
    ]);
  } catch (err) {
    console.error('[newsletter/subscribe] Klaviyo exception:', err);
  }

  // ── 3. Welcome email ──────────────────────────────────────────────
  try {
    const firstName = email.split('@')[0]?.split(/[._-]/)[0] ?? 'vous';
    await sendWelcome(email, {
      customerFirstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      shopUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr'}/boutique`,
    });
  } catch (err) {
    console.error('[newsletter/subscribe] Resend exception:', err);
  }

  return NextResponse.json({
    ok: true,
    message:
      'Merci. Un email de confirmation vous est envoyé sous quelques minutes — vérifiez aussi votre dossier spams.',
  });
}
