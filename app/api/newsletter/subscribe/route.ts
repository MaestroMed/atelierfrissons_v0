import { NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeEmail } from '@/lib/security/sanitize';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createDoiToken } from '@/lib/auth/doi-token';
import { sendNewsletterConfirmation } from '@/lib/resend/send';

/**
 * Route Handler d'inscription newsletter — flow Double Opt-In (DOI).
 *
 * Flow :
 *   1. Valide le payload (email + source)
 *   2. UPSERT dans `newsletter_subscribers` avec status='pending_confirmation'
 *      (si Supabase configuré)
 *   3. Génère un token HMAC signé (lib/auth/doi-token.ts) valide 48h
 *   4. Envoie un email « Confirmer mon inscription » via Resend
 *   5. Renvoie { ok, message } — ne pas révéler si l'email existait déjà
 *      (protection contre l'énumération)
 *
 * L'inscription effective (status='subscribed' + Klaviyo + welcome) se
 * fait dans /api/auth/confirm-subscribe après validation du token.
 *
 * En dev sans Supabase / sans Resend : flow graceful (log + retour success).
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

  // ── 1. Persist DB (pending) — si Supabase configuré ─────────────────
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createSupabaseAdminClient();
      // UPSERT en pending : si l'email existe déjà subscribed, on ne
      // downgrade pas son statut
      const { data: existing } = await admin
        .from('newsletter_subscribers')
        .select('status')
        .eq('email', email)
        .maybeSingle();

      if (!existing || existing.status !== 'subscribed') {
        const { error } = await admin.from('newsletter_subscribers').upsert(
          {
            email,
            status: 'pending_confirmation',
            source,
            confirmed_at: null,
          },
          { onConflict: 'email' },
        );
        if (error) {
          console.error('[newsletter/subscribe] DB upsert failed:', error);
        }
      }
    }
  } catch (err) {
    console.error('[newsletter/subscribe] DB exception:', err);
  }

  // ── 2. Génération token DOI + envoi email ──────────────────────────
  try {
    const token = createDoiToken(email, 'newsletter-subscribe');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr';
    const confirmUrl = `${appUrl}/auth/confirm-subscribe?token=${encodeURIComponent(token)}&source=${encodeURIComponent(source)}`;
    await sendNewsletterConfirmation(email, {
      confirmUrl,
      expiresInHours: 48,
    });
    if (process.env.NODE_ENV !== 'production') {
      // Pratique dev : log l'URL de confirmation pour pouvoir cliquer sans mail
      console.info('[newsletter/subscribe] DOI link:', confirmUrl);
    }
  } catch (err) {
    console.error('[newsletter/subscribe] DOI send exception:', err);
  }

  // Message anti-énumération : identique qu'on soit déjà inscrit ou non
  return NextResponse.json({
    ok: true,
    status: 'pending',
    message:
      'Merci. Un email de confirmation vous est envoyé sous quelques minutes — vérifiez aussi votre dossier spams.',
  });
}
