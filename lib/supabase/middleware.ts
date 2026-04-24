import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Rafraîchit la session Supabase (JWT expiré → nouvelle paire access/refresh token)
 * à chaque requête passant par le middleware.
 *
 * À appeler depuis `middleware.ts`. Renvoie le NextResponse à retourner ensuite.
 * Voir CLAUDE.md §8 et Sprint 1 Étape 6 (middleware complet avec rate limit, CSP).
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // En dev/CI sans credentials, on ne bloque pas la requête.
    return response;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Critique : getUser() valide le JWT et déclenche le refresh si expiré.
  // Ne pas remplacer par getSession() qui lit juste le cookie sans validation.
  await supabase.auth.getUser();

  return response;
}
