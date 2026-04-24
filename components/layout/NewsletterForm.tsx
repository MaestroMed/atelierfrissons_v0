'use client';

import { useState } from 'react';
import { ArrowRight, MailCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  /** Source utilisée pour tracker l'origine (ex: 'footer', 'popup'). */
  source?: string;
  /**
   * Tonalité visuelle — `dark` pour le Footer (fond noir/rouge),
   * `light` pour la section homepage (fond ivoire).
   */
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * Formulaire newsletter Atelier Frisson — flow Double Opt-In (DOI).
 *
 * POST vers `/api/newsletter/subscribe` qui crée un enregistrement pending
 * + envoie un mail « Confirmer mon inscription » via Resend. L'inscription
 * effective se fait après clic sur le lien → `/auth/confirm-subscribe`.
 *
 * Le message de succès reflète donc l'attente du mail de confirmation.
 */
export function NewsletterForm({
  source = 'footer',
  tone = 'dark',
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDark = tone === 'dark';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setState('error');
      setErrorMessage('Merci d’indiquer votre adresse e-mail.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState('error');
      setErrorMessage('Cette adresse ne semble pas valide.');
      return;
    }
    setState('submitting');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: trimmed, source }),
      });
      const data: { ok: boolean; message?: string } = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? 'Échec de l’inscription.');
      }
      setState('success');
      setSuccessMessage(
        data.message ??
          'Un email de confirmation vous a été envoyé — cliquez sur le lien pour valider votre inscription.',
      );
      setEmail('');
    } catch (err) {
      setState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Un instant — réessayez dans quelques secondes.',
      );
    }
  }

  if (state === 'success') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 border px-5 py-4',
          isDark
            ? 'border-or/40 bg-noir/40 text-ivoire supports-backdrop-filter:backdrop-blur-sm'
            : 'border-or/50 bg-ivoire text-encre',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <MailCheck
          className={cn('mt-0.5 size-4 shrink-0', isDark ? 'text-or' : 'text-or-dark')}
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <div className="flex flex-col gap-1">
          <p className="ui-caps text-[10px]">
            <span className={isDark ? 'text-or' : 'text-or-dark'}>
              Dernière étape — vérifiez votre boîte mail
            </span>
          </p>
          <p className="font-italic-editorial text-sm leading-relaxed">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse e-mail
      </label>
      <div
        className={cn(
          'flex items-center gap-2 border-b pb-3',
          isDark ? 'border-ivoire/30' : 'border-encre/25',
          state === 'error' && 'border-rouge-light/80',
          'focus-within:border-or',
        )}
      >
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder="votre adresse e-mail"
          className={cn(
            'flex-1 border-0 bg-transparent px-0 text-base',
            isDark
              ? 'text-ivoire placeholder:text-ivoire/40'
              : 'text-encre placeholder:text-encre/40',
            'outline-none focus-visible:outline-none',
          )}
          aria-invalid={state === 'error'}
          aria-describedby={errorMessage ? 'newsletter-error' : undefined}
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className={cn(
            'ui-caps inline-flex items-center gap-2 transition-colors disabled:opacity-60',
            isDark ? 'text-or hover:text-or-light' : 'text-or-dark hover:text-or',
          )}
        >
          {state === 'submitting' ? 'Envoi…' : 'Je m’inscris'}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      {errorMessage ? (
        <p id="newsletter-error" className="text-rouge-light mt-2 text-xs" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className={cn('mt-3 text-xs', isDark ? 'text-ivoire/45' : 'text-encre/55')}>
          Double opt-in · vous pouvez vous désabonner à tout moment. Consultez notre{' '}
          <a href="/confidentialite" className="hover:text-or underline underline-offset-2">
            politique de confidentialité
          </a>
          .
        </p>
      )}
    </form>
  );
}
