'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Fleuron } from './Fleuron';

/** Cookie name — bumper la version (v2, v3…) invalide tous les consentements. */
export const CONSENT_COOKIE = 'af_consent_v1';
const CONSENT_MAX_AGE_DAYS = 180;

export type ConsentState = {
  strictly_necessary: true; // Toujours true — techniquement requis.
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

const DEFAULT_REFUSED: ConsentState = {
  strictly_necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

const DEFAULT_ACCEPTED: ConsentState = {
  strictly_necessary: true,
  analytics: true,
  marketing: true,
  personalization: true,
};

/**
 * Bandeau Cookies Atelier Frisson — conforme CNIL / ePrivacy / RGPD art. 7.
 *
 * Règles :
 *  - Boutons « Tout accepter » et « Tout refuser » à proéminence équivalente
 *  - Consentement granulaire par catégorie (obligatoire pour CNIL 2020 ss.)
 *  - Aucun cookie analytics/marketing chargé avant choix explicite
 *  - Choix révocable depuis /cookies
 *  - Durée du consentement : 6 mois max (CNIL)
 *
 * Les catégories sont :
 *  - strictly_necessary  (auth, session, panier, sécurité) — non bloquable
 *  - analytics           (Vercel Analytics, PostHog anonymisé)
 *  - marketing           (Klaviyo, remarketing, pixels)
 *  - personalization     (recommandations produits, contenus éditoriaux)
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_REFUSED);

  useEffect(() => {
    // Lecture client-only de document.cookie après hydration — pattern
    // nécessaire car `useState(init)` ne peut pas lire `document` côté serveur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    persistConsent(DEFAULT_ACCEPTED);
    setVisible(false);
  };

  const handleRefuseAll = () => {
    persistConsent(DEFAULT_REFUSED);
    setVisible(false);
  };

  const handleSaveCustom = () => {
    persistConsent(consent);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className={cn(
        'fixed inset-x-0 bottom-0 z-[90]',
        'border-t border-or/20 bg-noir/95 text-ivoire backdrop-blur-md',
        'shadow-elevated supports-backdrop-filter:bg-noir/90',
        '[animation:var(--animate-fade-up)_400ms_100ms_both]',
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-10 md:py-7">
        {!expanded ? (
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <h2
                id="cookie-banner-title"
                className="flex items-center gap-3 font-display text-lg font-medium md:text-xl"
              >
                <Fleuron variant="mark" size="sm" color="or" className="w-6 opacity-80" />
                Votre confidentialité
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-ivoire/75 md:text-[15px]">
                Nous déposons uniquement les cookies strictement nécessaires au fonctionnement du
                site. Vous pouvez accepter les cookies d’analyse, de marketing et de
                personnalisation pour nous aider à améliorer l’expérience — ou les refuser en un
                clic. Choix modifiable à tout moment depuis la page{' '}
                <a
                  href="/cookies"
                  className="underline underline-offset-2 hover:text-or"
                >
                  cookies
                </a>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="ui-caps text-ivoire/70 underline underline-offset-4 transition-colors hover:text-or"
              >
                Préférences
              </button>
              <button
                type="button"
                onClick={handleRefuseAll}
                className="ui-caps-md border border-ivoire/30 px-5 py-2.5 transition-colors hover:border-ivoire hover:text-ivoire"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="ui-caps-md bg-or px-5 py-2.5 text-noir transition-colors hover:bg-or-light"
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="flex items-center gap-3 font-display text-xl font-medium">
                <Fleuron variant="mark" size="sm" color="or" className="w-6" />
                Personnaliser mes choix
              </h2>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ui-caps text-ivoire/60 hover:text-or"
              >
                Fermer
              </button>
            </div>

            <ul className="grid gap-4 md:grid-cols-2">
              <ConsentRow
                title="Strictement nécessaires"
                description="Authentification, panier, sécurité, conformité légale. Ne peuvent être désactivés."
                checked={true}
                required
                onChange={() => {
                  /* noop */
                }}
              />
              <ConsentRow
                title="Mesure d’audience"
                description="Vercel Analytics et PostHog (anonymisés) pour comprendre les usages et améliorer le site."
                checked={consent.analytics}
                onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
              />
              <ConsentRow
                title="Marketing"
                description="Cookies Klaviyo pour l’envoi de la newsletter et pour personnaliser vos communications."
                checked={consent.marketing}
                onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
              />
              <ConsentRow
                title="Personnalisation"
                description="Recommandations produits et contenus éditoriaux adaptés à vos centres d’intérêt."
                checked={consent.personalization}
                onChange={(v) => setConsent((c) => ({ ...c, personalization: v }))}
              />
            </ul>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ivoire/10 pt-5">
              <button
                type="button"
                onClick={handleRefuseAll}
                className="ui-caps text-ivoire/70 underline underline-offset-4 hover:text-or"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="ui-caps-md border border-or/50 px-6 py-2.5 text-or hover:bg-or hover:text-noir"
              >
                Enregistrer mes choix
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="ui-caps-md bg-or px-6 py-2.5 text-noir hover:bg-or-light"
              >
                Tout accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConsentRowProps {
  title: string;
  description: string;
  checked: boolean;
  required?: boolean;
  onChange: (value: boolean) => void;
}

function ConsentRow({ title, description, checked, required = false, onChange }: ConsentRowProps) {
  const inputId = `consent-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`;
  return (
    <li className="flex items-start gap-4 border border-ivoire/10 p-4">
      <div className="relative mt-0.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={required}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className={cn(
            'flex size-9 cursor-pointer items-center justify-center rounded-sm border',
            'transition-colors duration-200',
            checked
              ? 'border-or bg-or/15 text-or'
              : 'border-ivoire/30 bg-transparent text-ivoire/60 hover:border-or/60',
            required && 'cursor-not-allowed opacity-90',
          )}
          aria-label={`Activer ${title}`}
        >
          {checked ? (
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                d="M5 12l5 5L20 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </label>
      </div>
      <div className="flex-1">
        <p className="ui-caps text-ivoire">{title}</p>
        <p className="mt-1.5 text-xs text-ivoire/65 md:text-sm">{description}</p>
        {required ? (
          <p className="mt-1 text-[11px] text-or/70">Toujours actifs · requis</p>
        ) : null}
      </div>
    </li>
  );
}

// ── Helpers exportables (utilisés aussi par /cookies plus tard) ────────────

function persistConsent(state: ConsentState) {
  const encoded = encodeURIComponent(JSON.stringify(state));
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = [
    `${CONSENT_COOKIE}=${encoded}`,
    'path=/',
    `max-age=${maxAge}`,
    'SameSite=Lax',
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
  window.dispatchEvent(new CustomEvent('af:consent', { detail: state }));
}

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!cookie) return null;
  try {
    const raw = decodeURIComponent(cookie.split('=')[1] ?? '');
    const parsed = JSON.parse(raw) as ConsentState;
    return parsed;
  } catch {
    return null;
  }
}
