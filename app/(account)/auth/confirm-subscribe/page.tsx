import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, AlertCircle, Clock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { verifyDoiToken } from '@/lib/auth/doi-token';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { subscribeToList, trackEvent } from '@/lib/klaviyo/track';
import { sendWelcome, sendWaitlistWelcome } from '@/lib/resend/send';

export const metadata: Metadata = {
  title: 'Confirmation inscription',
  description: 'Validation de votre inscription à la correspondance Atelier Frisson.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string; source?: string }>;
}

type ConfirmState =
  | { kind: 'success'; email: string }
  | { kind: 'expired' }
  | { kind: 'invalid' }
  | { kind: 'missing' };

/**
 * Landing page de confirmation DOI — Server Component qui valide le token,
 * effectue la bascule `pending → subscribed` en DB, push Klaviyo, envoie
 * l'email de bienvenue, puis rend un message éditorial de succès ou d'erreur.
 *
 * Logique inline dans la page plutôt qu'un endpoint dédié : un seul round-trip,
 * mieux pour l'UX + le SEO (pas d'écran blanc).
 *
 * Idempotence : si l'email est déjà `subscribed`, on ne refait pas les
 * side-effects mais on renvoie quand même un succès (le lien a été cliqué
 * deux fois — on ne veut pas montrer une erreur).
 */
export default async function ConfirmSubscribePage({ searchParams }: PageProps) {
  const { token, source } = await searchParams;

  const state = await processToken(token, source ?? 'unknown');

  return (
    <Container className="flex min-h-[calc(100dvh-15rem)] items-center py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <p className="ui-caps text-or-dark">La correspondance</p>
        <Wordmark as="p" size="md" color="or" />
        <Fleuron variant="divider" size="md" color="or" className="opacity-80" />

        {state.kind === 'success' ? <Success email={state.email} /> : null}
        {state.kind === 'expired' ? <Expired /> : null}
        {state.kind === 'invalid' ? <Invalid /> : null}
        {state.kind === 'missing' ? <Missing /> : null}

        <Fleuron variant="divider" size="md" color="or" className="mt-4 opacity-50" />
      </div>
    </Container>
  );
}

// ── Logique serveur — validation + subscribe ─────────────────────────
async function processToken(token: string | undefined, source: string): Promise<ConfirmState> {
  if (!token) return { kind: 'missing' };

  const result = verifyDoiToken(token);
  if (!result.ok) {
    if (result.reason === 'expired') return { kind: 'expired' };
    return { kind: 'invalid' };
  }

  const { email, purpose } = result.payload;
  if (purpose !== 'newsletter-subscribe') return { kind: 'invalid' };

  // ── Bascule DB pending → subscribed ─────────────────────────────
  let alreadySubscribed = false;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createSupabaseAdminClient();
      const { data: existing } = await admin
        .from('newsletter_subscribers')
        .select('status')
        .eq('email', email)
        .maybeSingle();

      if (existing?.status === 'subscribed') {
        alreadySubscribed = true;
      } else {
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
          console.error('[confirm-subscribe] DB upsert failed:', error);
        }
      }
    }
  } catch (err) {
    console.error('[confirm-subscribe] DB exception:', err);
  }

  // ── Klaviyo + welcome email — seulement si pas déjà subscribed ─────
  if (!alreadySubscribed) {
    try {
      await Promise.all([
        subscribeToList(email),
        trackEvent('Subscribed to List', {
          email,
          properties: { source, confirmedAt: new Date().toISOString(), doi: true },
        }),
      ]);
    } catch (err) {
      console.error('[confirm-subscribe] Klaviyo exception:', err);
    }

    try {
      const firstName = (email.split('@')[0]?.split(/[._-]/)[0] ?? 'vous').replace(/^./, (c) =>
        c.toUpperCase(),
      );
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr';

      // Source-aware : si l'inscription vient de la waitlist, on envoie un
      // email dédié pivot V2 (annonce ouverture + −15 % à venir) plutôt que
      // le welcome générique.
      const isWaitlist = source.startsWith('waitlist');
      if (isWaitlist) {
        await sendWaitlistWelcome(email, {
          firstName,
          estimatedLaunchMonth: 'juin 2026',
          preferenceUrl: `${appUrl}/compte/preferences`,
        });
      } else {
        await sendWelcome(email, {
          customerFirstName: firstName,
          shopUrl: `${appUrl}/boutique`,
        });
      }
    } catch (err) {
      console.error('[confirm-subscribe] Welcome email exception:', err);
    }
  }

  return { kind: 'success', email };
}

// ── Presentational components ─────────────────────────────────────────
function Success({ email }: { email: string }) {
  return (
    <>
      <Check className="text-af-success size-10" aria-hidden="true" strokeWidth={1.2} />
      <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
        C’est confirmé, <span className="font-italic-editorial text-or-dark">bienvenue</span>
      </h1>
      <p className="font-italic-editorial text-encre/75 max-w-lg text-lg md:text-xl">
        Votre inscription est active pour <span className="text-noir not-italic">{email}</span>.
        Notre prochaine lettre éditoriale arrive dans votre boîte — deux fois par mois, jamais plus.
      </p>
      <p className="text-encre/65 text-sm">
        Un email de bienvenue vous a été envoyé avec quelques clés de lecture.
      </p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/boutique"
          className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
        >
          Découvrir la collection
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/rituels"
          className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-3 underline underline-offset-4"
        >
          Lire le journal
        </Link>
      </div>
    </>
  );
}

function Expired() {
  return (
    <>
      <Clock className="text-af-warning size-10" aria-hidden="true" strokeWidth={1.2} />
      <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">
        Ce lien <span className="font-italic-editorial text-or-dark">a expiré</span>
      </h1>
      <p className="font-italic-editorial text-encre/75 max-w-lg text-lg">
        Les liens de confirmation ne restent valables que 48 heures — sécurité oblige. Pour
        rejoindre la correspondance, refaites simplement une inscription depuis la page d’accueil.
      </p>
      <Link
        href="/#newsletter"
        className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-4 inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
      >
        Retour à l’accueil
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </>
  );
}

function Invalid() {
  return (
    <>
      <AlertCircle className="text-af-error size-10" aria-hidden="true" strokeWidth={1.2} />
      <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">
        Ce lien <span className="font-italic-editorial text-or-dark">n’est pas valide</span>
      </h1>
      <p className="font-italic-editorial text-encre/75 max-w-lg text-lg">
        Le lien semble incomplet ou altéré. Si vous avez reçu plusieurs emails, essayez le plus
        récent. Sinon, refaites une inscription depuis la page d’accueil.
      </p>
      <Link
        href="/"
        className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-4 inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
      >
        Retour à l’accueil
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </>
  );
}

function Missing() {
  return (
    <>
      <AlertCircle className="text-encre/40 size-10" aria-hidden="true" strokeWidth={1.2} />
      <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">Aucun lien fourni</h1>
      <p className="font-italic-editorial text-encre/75 max-w-lg text-lg">
        Pour confirmer une inscription, il faut cliquer sur le lien reçu par email. Si vous cherchez
        à vous inscrire, utilisez le formulaire de la page d’accueil.
      </p>
      <Link
        href="/"
        className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-4 inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
      >
        Retour à l’accueil
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </>
  );
}
