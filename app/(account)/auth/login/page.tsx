import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { LoginForm } from '@/components/account/LoginForm';
import { getSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Connexion à votre compte',
  description:
    'Connectez-vous via un lien magique envoyé par e-mail. Pas de mot de passe à retenir.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/auth/login' },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();
  if (session) redirect(params.redirect ?? '/compte');

  return (
    <Container className="flex min-h-[calc(100dvh-15rem)] items-center py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 text-center">
        <Wordmark as="p" size="md" color="or" />
        <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
        <header className="space-y-3">
          <h1 className="font-display text-noir text-3xl font-medium md:text-4xl">
            Connexion à votre{' '}
            <span className="font-italic-editorial text-or-dark">espace personnel</span>
          </h1>
          <p className="text-encre/70 text-sm">
            Recevez un lien sécurisé par e-mail — pas de mot de passe à retenir, pas de friction.
          </p>
        </header>
        <LoginForm redirectTo={params.redirect ?? null} />
        <p className="text-encre/55 text-xs">
          En vous connectant, vous acceptez nos{' '}
          <Link href="/cgu" className="hover:text-or-dark underline underline-offset-2">
            conditions d’utilisation
          </Link>{' '}
          et notre{' '}
          <Link href="/confidentialite" className="hover:text-or-dark underline underline-offset-2">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
