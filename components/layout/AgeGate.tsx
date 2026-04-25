'use client';

import { useEffect, useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
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
 * Age Gate cinématique — conformité Arcom (art. 227-24 Code pénal,
 * décret 2023-566).
 *
 * Modal bloquant full-screen à l'arrivée. Rendu conditionnellement par
 * `app/layout.tsx` via lecture de `cookies()` côté serveur — donc **pas de
 * FOUC** : si la cookie est présente, l'utilisateur ne voit jamais la modale.
 *
 * Mise en scène (sequence step 0 → 3 sur 1.5s) :
 *   0. Écran noir + glow radial qui s'allume
 *   1. Wordmark + Fleuron + tagline apparaissent
 *   2. Titre + description se révèlent
 *   3. Boutons + trust line (Arcom + RGPD + Mentions)
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
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    // Body scroll lock pendant l'AgeGate
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(3);
    } else {
      const t1 = window.setTimeout(() => setStep(1), 250);
      const t2 = window.setTimeout(() => setStep(2), 800);
      const t3 = window.setTimeout(() => setStep(3), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        document.body.style.overflow = prevOverflow;
      };
    }

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

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
        'fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto',
        'bg-noir',
      )}
    >
      {/* Glow radial dual (or + rouge) qui s'allume */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] ease-out motion-reduce:transition-none',
          '[background:radial-gradient(ellipse_at_30%_25%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_75%,rgba(139,20,36,0.15)_0%,transparent_60%)]',
          step >= 1 ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Grain de texture */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-[1500ms]',
          '[background-image:radial-gradient(rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:3px_3px]',
          step >= 1 ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-6 py-16 text-center md:px-10 md:py-20">
        {/* ── Step 1 : Wordmark + tagline ─────────────────────────── */}
        <div
          className={cn(
            'flex flex-col items-center gap-4 transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
            step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
          )}
        >
          <Wordmark as="p" size="md" color="or" />
          <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
          <p className="font-italic-editorial text-ivoire/65 text-sm">
            Maison du rituel intime — Paris
          </p>
        </div>

        {/* ── Step 2 : Titre + description ────────────────────────── */}
        <div
          className={cn(
            'mt-4 flex flex-col items-center gap-6 transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
            step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          )}
        >
          <h2
            id="age-gate-title"
            className="font-display text-ivoire text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-medium"
          >
            Ce site présente des objets de{' '}
            <span className="font-italic-editorial text-or">bien-être intime</span> destinés à un
            public adulte.
          </h2>

          <p
            id="age-gate-description"
            className="font-italic-editorial text-ivoire/75 max-w-lg text-base leading-relaxed md:text-lg"
          >
            Vous devez être majeur·e pour continuer. En entrant, vous confirmez avoir{' '}
            <span className="text-ivoire whitespace-nowrap not-italic">18 ans ou plus</span> et
            consulter ce site de votre propre initiative.
          </p>
        </div>

        {/* ── Step 3 : Boutons + trust line ──────────────────────── */}
        <div
          className={cn(
            'flex w-full flex-col items-center gap-8 transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
            step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          )}
        >
          <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <button
              type="button"
              onClick={accept}
              disabled={isPending || step < 3}
              className={cn(
                'ui-caps-md group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden px-10 py-4',
                'bg-or text-noir transition-colors duration-300',
                'hover:bg-or-light focus-visible:bg-or-light',
                'disabled:cursor-wait disabled:opacity-70',
              )}
            >
              {/* Wipe shine au hover */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent',
                  'transition-transform duration-700 group-hover/btn:translate-x-full',
                )}
              />
              <span className="relative">{isPending ? 'Un instant…' : 'J’ai 18 ans ou plus'}</span>
            </button>
            <button
              type="button"
              onClick={refuse}
              disabled={step < 3}
              className={cn(
                'ui-caps-md inline-flex items-center justify-center px-8 py-4',
                'border-ivoire/30 text-ivoire/80 border transition-colors duration-300',
                'hover:border-ivoire hover:text-ivoire',
                'disabled:opacity-50',
              )}
            >
              Je quitte le site
            </button>
          </div>

          {/* Trust line — Arcom, RGPD, Lock */}
          <div className="mt-2 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px]">
              <span className="ui-caps text-ivoire/55 inline-flex items-center gap-1.5">
                <ShieldCheck className="text-or/70 size-3" aria-hidden="true" strokeWidth={1.5} />
                Conformité Arcom
              </span>
              <span aria-hidden="true" className="text-ivoire/25">
                ·
              </span>
              <span className="ui-caps text-ivoire/55 inline-flex items-center gap-1.5">
                <Lock className="text-or/70 size-3" aria-hidden="true" strokeWidth={1.5} />
                Aucune donnée transmise
              </span>
              <span aria-hidden="true" className="text-ivoire/25">
                ·
              </span>
              <span className="ui-caps text-ivoire/55">Cookie de session uniquement</span>
            </div>
            <p className="text-ivoire/35 text-[11px]">
              <a
                href="https://www.arcom.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-or underline underline-offset-2 transition-colors"
              >
                Arcom
              </a>
              {' · '}
              <a
                href="/confidentialite"
                className="hover:text-or underline underline-offset-2 transition-colors"
              >
                Politique de confidentialité
              </a>
              {' · '}
              <a
                href="/mentions-legales"
                className="hover:text-or underline underline-offset-2 transition-colors"
              >
                Mentions légales
              </a>
            </p>
          </div>

          {/* Signature ornement final */}
          <Fleuron variant="divider" size="sm" color="or" className="mt-2 opacity-40" />
        </div>
      </div>
    </div>
  );
}
