'use client';

import { useState } from 'react';
import { Wordmark } from './Wordmark';
import { Fleuron } from './Fleuron';
import { cn } from '@/lib/utils';

// Note : la constante AGE_GATE_COOKIE vit dans `lib/auth/age-gate.ts`
// pour pouvoir traverser la frontière server/client RSC. Voir le commentaire
// dans ce fichier pour le détail du bug évité.

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
 * Flow accept :
 *   1. POST /api/auth/verify-age (Route Handler) qui pose `Set-Cookie`
 *      `af_age_verified=1` — HTTP standard, toujours propagé.
 *   2. `window.location.reload()` déclenche un GET complet qui porte le
 *      cookie. Le layout serveur le lit et démonte l'AgeGate.
 *
 * On a préféré le Route Handler au Server Action + redirect() : avec
 * `useTransition`, Next 16 traite `redirect()` comme une soft-nav RSC et
 * le Set-Cookie est mal propagé vers le rendu suivant (cf. docs proxy.ts).
 *
 * Phase 1 (actuelle) : self-declaration — suffisant en dev/staging,
 * insuffisant pour production à partir de juin 2026. Phase 2 (pré-prod) :
 * intégration VerifyMy ou AnonymAGE (double anonymat Arcom prod-ready).
 */
export function AgeGate({ exitUrl = 'https://www.google.com' }: AgeGateProps = {}) {
  const [isPending, setIsPending] = useState(false);

  const accept = async () => {
    setIsPending(true);
    // Notifie les scripts analytics (ex: PostHog) de l'activation.
    window.dispatchEvent(
      new CustomEvent('af:age-verified', { detail: { method: 'self_declared' } }),
    );
    try {
      // Route Handler POST → pose le cookie via Set-Cookie HTTP standard.
      // Ensuite reload full-page → le GET porte le cookie dans `Cookie:`.
      const res = await fetch('/api/auth/verify-age', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        throw new Error(`verify-age failed: ${res.status}`);
      }
      window.location.reload();
    } catch (err) {
      console.error('[AgeGate] accept failed', err);
      setIsPending(false);
    }
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
          'border-or/30 bg-noir/80 mx-4 w-full max-w-xl border',
          'text-ivoire px-8 py-12 text-center md:px-12 md:py-14',
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Wordmark as="p" size="md" color="or" />
          <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
          <p className="font-italic-editorial text-ivoire/70">Maison du rituel intime</p>
        </div>

        <h2
          id="age-gate-title"
          className="font-display text-ivoire mt-10 text-2xl leading-tight font-medium md:text-3xl"
        >
          Ce site présente des objets de{' '}
          <span className="font-italic-editorial text-or">bien-être intime</span> destinés à un
          public adulte.
        </h2>

        <p id="age-gate-description" className="text-ivoire/75 mt-6 text-sm md:text-base">
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
              'border-ivoire/30 text-ivoire/80 border transition-colors duration-300',
              'hover:border-ivoire hover:text-ivoire',
            )}
          >
            Je quitte le site
          </button>
        </div>

        <p className="text-ivoire/40 mt-10 text-xs">
          Conformité{' '}
          <a href="https://www.arcom.fr" className="hover:text-or underline underline-offset-2">
            Arcom
          </a>
          {' · '}
          <a href="/confidentialite" className="hover:text-or underline underline-offset-2">
            Politique de confidentialité
          </a>
          {' · '}
          <a href="/mentions-legales" className="hover:text-or underline underline-offset-2">
            Mentions légales
          </a>
        </p>
      </div>
    </div>
  );
}
