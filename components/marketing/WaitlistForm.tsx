'use client';

import { useState } from 'react';
import { ArrowRight, MailCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { HoneypotFields } from '@/components/shared/HoneypotFields';

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

/**
 * Formulaire d'inscription waitlist — pivot V2 Atelier Frisson.
 *
 * Utilise l'endpoint `/api/newsletter/subscribe` existant (DOI flow CNIL).
 * Spécifique waitlist : `source: 'waitlist'` permet à Klaviyo de déclencher
 * un flow dédié (welcome lancement + reminder J-7 ouverture + code remise
 * J0 ouverture).
 *
 * Capture aussi `?ref=` URL param si présent (parrainage pré-launch).
 */
export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [acceptedNewsletter, setAcceptedNewsletter] = useState(false);
  const [state, setState] = useState<FormState>({ kind: 'idle' });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const trimmed = email.trim();
    if (!trimmed) {
      setState({ kind: 'error', message: 'Indiquez votre adresse email.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState({ kind: 'error', message: 'Cette adresse ne semble pas valide.' });
      return;
    }
    if (!acceptedNewsletter) {
      setState({
        kind: 'error',
        message: 'Cochez la case pour confirmer votre inscription.',
      });
      return;
    }

    setState({ kind: 'submitting' });

    try {
      // Capture éventuel code parrainage en URL (?ref=AF-XXXXXX)
      const refCode =
        typeof window !== 'undefined'
          ? new URL(window.location.href).searchParams.get('ref')
          : null;

      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: trimmed,
          source: refCode ? `waitlist:ref:${refCode}` : 'waitlist',
          // Honeypot fields lus depuis le DOM
          _hp: formData.get('_hp') ?? '',
          _t: formData.get('_t') ?? '',
        }),
      });

      const data: { ok: boolean; message?: string } = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? 'Erreur — réessayez dans un instant.');
      }

      setState({ kind: 'success' });
      setEmail('');
    } catch (err) {
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Erreur — réessayez dans un instant.',
      });
    }
  }

  if (state.kind === 'success') {
    return (
      <div
        className="bg-or/10 border-or/40 flex flex-col items-center gap-4 border p-8 text-center md:p-10"
        role="status"
        aria-live="polite"
      >
        <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
        <p className="ui-caps text-or-dark text-[11px] tracking-[0.22em]">
          Dernière étape — vérifiez votre boîte mail
        </p>
        <h3 className="font-display text-noir text-2xl font-medium md:text-3xl">
          Un email de confirmation{' '}
          <span className="font-italic-editorial text-or-dark">vous attend.</span>
        </h3>
        <p className="text-encre/75 max-w-md text-sm leading-relaxed">
          Cliquez sur le lien dans cet email pour valider votre inscription. Sans clic, l'inscription
          n'est pas effective et nous n'enverrons rien d'autre.
        </p>
        <p className="text-encre/55 text-xs">
          Pas reçu sous 5 minutes ? Vérifiez le dossier spam — ou{' '}
          <button
            type="button"
            onClick={() => setState({ kind: 'idle' })}
            className="text-or-dark hover:text-or underline underline-offset-4"
          >
            réessayez
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-ivoire border-encre/15 flex flex-col gap-5 border p-6 md:p-8"
    >
      <HoneypotFields />
      <label htmlFor="waitlist-email" className="flex flex-col gap-2">
        <span className="ui-caps text-or-dark text-[10px] tracking-widest">
          Votre adresse email
        </span>
        <input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state.kind === 'error') setState({ kind: 'idle' });
          }}
          placeholder="vous@exemple.fr"
          className={cn(
            'bg-ivoire-light text-encre placeholder:text-encre/40 border px-4 py-4 text-base outline-none transition-colors',
            state.kind === 'error'
              ? 'border-rouge focus:border-rouge'
              : 'border-encre/20 focus:border-or-dark',
          )}
          aria-invalid={state.kind === 'error'}
          aria-describedby={state.kind === 'error' ? 'waitlist-error' : undefined}
        />
      </label>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={acceptedNewsletter}
          onChange={(e) => {
            setAcceptedNewsletter(e.target.checked);
            if (state.kind === 'error') setState({ kind: 'idle' });
          }}
          className="border-encre/30 text-or-dark mt-1 size-4 shrink-0"
        />
        <span className="text-encre/80 leading-relaxed">
          J'accepte de recevoir la lettre éditoriale Atelier Frisson (1 fois/mois max). Je peux me
          désabonner à tout moment via le lien en bas de chaque email. Mes données sont conservées
          conformément à la{' '}
          <a
            href="/confidentialite"
            className="text-or-dark underline underline-offset-4 hover:text-or"
          >
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      {state.kind === 'error' ? (
        <p
          id="waitlist-error"
          role="alert"
          className="text-rouge bg-rouge/5 border-rouge/30 flex items-start gap-2 border px-3 py-2 text-xs"
        >
          <AlertCircle className="mt-0.5 size-3 shrink-0" aria-hidden="true" strokeWidth={1.5} />
          <span>{state.message}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state.kind === 'submitting'}
        className={cn(
          'ui-caps-md bg-noir text-ivoire hover:bg-rouge inline-flex items-center justify-center gap-3 px-6 py-4 transition-colors',
          'disabled:cursor-wait disabled:opacity-60',
        )}
      >
        {state.kind === 'submitting' ? (
          <>
            <span
              aria-hidden="true"
              className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Inscription en cours…
          </>
        ) : (
          <>
            <MailCheck className="size-4" aria-hidden="true" />
            Rejoindre la liste avant-première
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
