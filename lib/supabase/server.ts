import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Client Supabase côté serveur (Server Components, Server Actions, Route Handlers).
 *
 * Lit/écrit les cookies de session via `next/headers`. Les appels Server Component
 * ne peuvent pas écrire les cookies ; le `try/catch` silencieux est la convention
 * officielle Supabase — la session sera rafraîchie par le middleware.
 *
 * Utilise la clé ANON (RLS auth.uid() applique les policies).
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définis.',
    );
  }
  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Appel depuis un Server Component — les cookies ne peuvent pas être
          // modifiés ici. Le middleware s'en chargera.
        }
      },
    },
  });
}
