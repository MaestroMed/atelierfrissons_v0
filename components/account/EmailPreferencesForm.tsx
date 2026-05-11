'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailPreference {
  key: 'newsletter' | 'product_launches' | 'promotions' | 'subscription_winback' | 'birthday';
  title: string;
  description: string;
  rhythm: string;
  defaultEnabled: boolean;
}

const PREFERENCES: readonly EmailPreference[] = [
  {
    key: 'newsletter',
    title: 'Newsletter éditoriale',
    description:
      'Une lettre éditoriale — rituels, portraits, conseils sexologue. Jamais de pression commerciale, juste du contenu.',
    rhythm: '2 par mois maximum',
    defaultEnabled: true,
  },
  {
    key: 'product_launches',
    title: 'Lancements produits',
    description:
      'Avant-premières des nouvelles pièces et collections capsule (Saint-Valentin, Noël, anniversaires).',
    rhythm: '5 à 8 par an',
    defaultEnabled: false,
  },
  {
    key: 'promotions',
    title: 'Offres saisonnières',
    description:
      'Codes promo et soldes saisonnières uniquement. Pas de pression, juste l\'info au moment opportun.',
    rhythm: '4 à 6 par an',
    defaultEnabled: false,
  },
  {
    key: 'subscription_winback',
    title: 'Box mensuelle — relance',
    description:
      'Si vous avez résilié votre abonnement, on vous écrit une seule fois pour proposer de revenir avec une remise.',
    rhythm: '1 fois max après résiliation',
    defaultEnabled: true,
  },
  {
    key: 'birthday',
    title: 'Anniversaire',
    description:
      'Un mot et 50 points fidélité offerts le jour de votre anniversaire. Date renseignée dans le compte.',
    rhythm: '1 fois par an',
    defaultEnabled: true,
  },
] as const;

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function EmailPreferencesForm() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFERENCES.map((p) => [p.key, p.defaultEnabled])),
  );
  const [state, setState] = useState<SaveState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(key: string) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setState('saving');
    setErrorMessage(null);
    // Debounce save : on attend 600ms pour batcher si l'user clique vite
    startTransition(async () => {
      try {
        // TODO : Server Action `updateEmailPreferencesAction(prefs)` à brancher
        // sur Klaviyo subscriptions API + table customers.
        await new Promise((r) => setTimeout(r, 400));
        setState('saved');
        setTimeout(() => setState('idle'), 2000);
      } catch (err) {
        setState('error');
        setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="border-encre/10 divide-encre/8 divide-y border">
        {PREFERENCES.map((p) => {
          const enabled = prefs[p.key] ?? p.defaultEnabled;
          return (
            <li
              key={p.key}
              className="bg-ivoire flex items-start justify-between gap-6 p-5 md:p-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-noir text-base font-medium md:text-lg">
                    {p.title}
                  </h3>
                  <span className="ui-caps text-encre/55 text-[9px] tracking-widest">
                    · {p.rhythm}
                  </span>
                </div>
                <p className="text-encre/70 mt-2 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
              <label
                htmlFor={`pref-${p.key}`}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center"
              >
                <input
                  id={`pref-${p.key}`}
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggle(p.key)}
                  className="peer sr-only"
                  disabled={pending}
                />
                <span
                  className={cn(
                    'absolute inset-0 rounded-full transition-colors',
                    enabled ? 'bg-or' : 'bg-encre/20',
                    pending && 'opacity-60',
                  )}
                />
                <span
                  className={cn(
                    'bg-ivoire absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform',
                    enabled ? 'translate-x-5' : 'translate-x-0',
                  )}
                />
              </label>
            </li>
          );
        })}
      </ul>

      {/* Save state */}
      <div className="flex min-h-[24px] items-center justify-end gap-2">
        {state === 'saving' ? (
          <p className="text-encre/55 text-xs">
            <span
              aria-hidden="true"
              className="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]"
            />
            Enregistrement…
          </p>
        ) : state === 'saved' ? (
          <p
            className="text-or-dark inline-flex items-center gap-1.5 text-xs"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="size-3" aria-hidden="true" />
            Préférences sauvegardées
          </p>
        ) : state === 'error' ? (
          <p
            role="alert"
            className="text-rouge inline-flex items-center gap-1.5 text-xs"
          >
            <AlertCircle className="size-3" aria-hidden="true" />
            {errorMessage ?? 'Erreur de sauvegarde'}
          </p>
        ) : (
          <p className="text-encre/45 text-xs">
            Sauvegarde automatique à chaque changement
          </p>
        )}
      </div>

      <p className="text-encre/55 mt-2 text-xs leading-relaxed">
        Pour vous désinscrire complètement, utilisez le lien « se désabonner » en bas de chaque
        email — désopt-in instantané, conformément au RGPD art. 21.
      </p>
    </div>
  );
}
