import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Magic link callback — Supabase redirige ici avec `code` + `next` après
 * que l'utilisateur a cliqué le lien dans son e-mail.
 *
 * `exchangeCodeForSession` valide le PKCE token et pose les cookies de
 * session côté serveur (auth-token + refresh-token).
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next = url.searchParams.get('next') ?? '/compte';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchange failed:', error);
      return NextResponse.redirect(new URL('/auth/login?error=callback-failed', request.url));
    }
  } else if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'magiclink' | 'email' | 'recovery' | 'invite',
      token_hash: tokenHash,
    });
    if (error) {
      console.error('[auth/callback] verifyOtp failed:', error);
      return NextResponse.redirect(new URL('/auth/login?error=otp-failed', request.url));
    }
  } else {
    return NextResponse.redirect(new URL('/auth/login?error=missing-token', request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
