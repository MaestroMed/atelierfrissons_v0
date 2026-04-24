import { createBrowserClient } from '@supabase/ssr';

/**
 * Client Supabase côté navigateur (Client Components).
 *
 * Utilise la clé ANON — les droits sont appliqués par Row Level Security (RLS)
 * en fonction de `auth.uid()`. Jamais de service role ici.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définis.',
    );
  }
  return createBrowserClient(url, anon);
}
