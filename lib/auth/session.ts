import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Helpers session — Server Components + Server Actions.
 *
 * Pattern :
 *   - `getSession()` : retourne user | null (jamais throw, safe à appeler partout)
 *   - `requireSession()` : throw redirect('/auth/login') si pas authentifié
 *   - `requireAdmin()` : throw redirect('/auth/login') si pas admin actif
 *
 * `cache()` mémoïse au sein d'une même requête RSC pour éviter les
 * round-trips Supabase répétés (sidebar, header, page tous demandent).
 */

export interface AuthUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export const getSession = cache(async (): Promise<AuthUser | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email ?? '',
      emailConfirmed: !!data.user.email_confirmed_at,
      createdAt: data.user.created_at,
      metadata: data.user.user_metadata ?? {},
    };
  } catch (err) {
    // Supabase non configuré (dev sans .env.local) — silencieux.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[auth/session] getSession failed (Supabase not configured?):',
        (err as Error).message,
      );
    }
    return null;
  }
});

/** Force la présence d'une session — redirect /auth/login sinon. */
export async function requireSession(redirectTo?: string): Promise<AuthUser> {
  const user = await getSession();
  if (!user) {
    const param = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
    redirect(`/auth/login${param}`);
  }
  return user;
}

/** Force admin actif (cf. table `admin_users`) — Sprint 4. */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireSession('/admin');
  // TODO Sprint 4 : check `admin_users` table + 2FA + role gates.
  // En attendant : tout user authentifié peut accéder à /admin en dev.
  return user;
}
