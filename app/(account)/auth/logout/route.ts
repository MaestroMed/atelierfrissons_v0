import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Déconnexion — POST pour éviter CSRF (un GET pourrait être déclenché par
 * un lien malveillant). Le bouton de logout du compte fait un POST via form.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[auth/logout]', err);
  }
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
