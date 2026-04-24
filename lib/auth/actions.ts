'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Server Actions auth — magic link Supabase + sign out.
 *
 * Magic link flow :
 *   1. User submits email → server action calls supabase.auth.signInWithOtp()
 *   2. Supabase envoie email avec lien `https://<site>/auth/callback?token_hash=...`
 *   3. Callback route handler échange le token contre une session
 *   4. Cookie session posé → redirect home (ou redirectTo)
 */

const emailSchema = z.string().min(1, 'Email requis').email('Adresse e-mail invalide').max(255);

export interface AuthActionResult {
  ok: boolean;
  message?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Envoie un magic link à l'adresse fournie. */
export async function signInWithMagicLink(formData: FormData): Promise<AuthActionResult> {
  const rawEmail = formData.get('email');
  const redirectTo = formData.get('redirect');
  const result = emailSchema.safeParse(rawEmail);
  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? 'Email invalide' };
  }
  const email = result.data.toLowerCase().trim();

  try {
    const supabase = await createSupabaseServerClient();
    const callbackUrl = `${SITE_URL}/auth/callback?next=${encodeURIComponent(
      typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/compte',
    )}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true, // Sign up + sign in unifié
      },
    });
    if (error) {
      console.error('[auth/signInWithMagicLink]', error);
      return { ok: false, message: 'Impossible d’envoyer le lien — réessayez dans un instant.' };
    }
    return { ok: true, message: `Un lien de connexion a été envoyé à ${email}.` };
  } catch (err) {
    console.error('[auth/signInWithMagicLink] exception', err);
    return {
      ok: false,
      message: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? 'Une erreur est survenue, réessayez.'
        : 'Authentification non configurée en dev (cf. docs/SUPABASE_SETUP.md).',
    };
  }
}

/** Déconnecte l'utilisateur courant et redirige vers home. */
export async function signOut(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[auth/signOut]', err);
  }
  revalidatePath('/', 'layout');
  redirect('/');
}
