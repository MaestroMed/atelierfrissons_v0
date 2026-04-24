'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Wordmark } from './Wordmark';
import { Fleuron } from './Fleuron';
import { cn } from '@/lib/utils';

/** Cookie name — aligné avec le check serveur dans app/layout.tsx et middleware. */
export const AGE_GATE_COOKIE = 'af_age_verified';
const AGE_GATE_MAX_AGE_DAYS = 30;

interface AgeGateProps {
  /** URL de sortie si l'utilisateur n'est pas majeur (défaut : google.com). */
  exitUrl?: string;
}

/**
 * Age Gate — conformité Arcom (art. 227-24 Code pénal, décret 2023-566).
 *
 * Modal bloquant full-screen à l'arrivée. Rendu conditionnellement par
 * `app/layout.tsx` via lecture de `cookies()` côté serveur — donc **pas de
 * FOUC** : si la cookie est présente, l'utilisateur ne voit jamais la modale.
 *
 * Phase 1 (actuelle) : self-declaration (« J'ai 18 ans ou plus ») — suffisant
 * en dev/staging, **insuffisant pour production** à partir de juin 2026.
 * Phase 2 (pré-prod) : intégration VerifyMy ou AnonymAGE pour double
 * anonymat Arcom — voir CLAUDE.md §11.7 et TODO ci-dessous.
 *
 * Événement `af:age-verified` dispatché sur `window` après validation pour
 * que les scripts analytics puissent réagir.
 */
export function AgeGate({ exitUrl = 'https://www.google.com' }: AgeGateProps = {}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const accept = () => {
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const maxAge = AGE_GATE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = [
      `${AGE_GATE_COOKIE}=1`,
      'path=/',
      `max-age=${maxAge}`,
      'SameSite=Lax',
      secure ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');

    // Notifie les scripts analytics (ex: PostHog, Klaviyo) de l'activation.
    window.dispatchEvent(new CustomEvent('af:age-verified', { detail: { method: 'self_declared' } }));

    // TODO Sprint 3 : POST /api/auth/verify-age pour log audit + préparer
    // l'intégration VerifyMy (double anonymat Arcom prod-ready).

    startTransition(() => {
      router.refresh();
    });
  };

  const refuse = () => {
    window.location.href = exitUrl;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-description"
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-noir/97 backdrop-blur-md',
        '[animation:var(--animate-fade-in)]',
      )}
    >
      <div
        className={cn(
          'mx-4 max-w-xl w-full border border-or/30 bg-noir/80',
          'px-8 py-12 text-center text-ivoire md:px-12 md:py-14',
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Wordmark as="p" size="md" color="or" />
          <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
          <p className="font-italic-editorial text-ivoire/70">Maison du rituel intime</p>
        </div>

        <h2
          id="age-gate-title"
          className="mt-10 font-display text-2xl font-medium leading-tight md:text-3xl"
        >
          Ce site présente des objets de{' '}
          <span className="font-italic-editorial text-or">bien-être intime</span> destinés à un
          public adulte.
        </h2>

        <p id="age-gate-description" className="mt-6 text-sm text-ivoire/75 md:text-base">
          Vous devez être majeur·e pour continuer. En entrant, vous confirmez avoir{' '}
          <span className="whitespace-nowrap">18 ans ou plus</span> et consulter ce site de votre
          propre initiative.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={accept}
            disabled={isPending}
            className={cn(
              'ui-caps-md inline-flex items-center justify-center gap-3 px-8 py-4',
              'bg-or text-noir transition-all duration-300',
              'hover:bg-or-light focus-visible:bg-or-light',
              'disabled:cursor-wait disabled:opacity-70',
            )}
          >
            {isPending ? 'Un instant…' : 'J’ai 18 ans ou plus'}
          </button>
          <button
            type="button"
            onClick={refuse}
            className={cn(
              'ui-caps-md inline-flex items-center justify-center px-8 py-4',
              'border border-ivoire/30 text-ivoire/80 transition-colors duration-300',
              'hover:border-ivoire hover:text-ivoire',
            )}
          >
            Je quitte le site
          </button>
        </div>

        <p className="mt-10 text-xs text-ivoire/40">
          Conformité{' '}
          <a href="https://www.arcom.fr" className="underline underline-offset-2 hover:text-or">
            Arcom
          </a>
          {' · '}
          <a href="/confidentialite" className="underline underline-offset-2 hover:text-or">
            Politique de confidentialité
          </a>
          {' · '}
          <a href="/mentions-legales" className="underline underline-offset-2 hover:text-or">
            Mentions légales
          </a>
        </p>
      </div>
    </div>
  );
}
