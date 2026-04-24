'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  /** Source utilisée pour tracker l'origine (ex: 'footer', 'popup'). */
  source?: string;
  className?: string;
}

/**
 * Formulaire newsletter Atelier Frisson.
 * POST vers `/api/newsletter/subscribe` qui persiste dans Supabase
 * `newsletter_subscribers`, track Klaviyo, et envoie l'email de bienvenue.
 */
export function NewsletterForm({ source = 'footer', className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(data.message ?? 'Merci. Vous recevrez nos prochaines parutions.');
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
          'border-or/40 bg-or/5 text-ivoire flex items-start gap-3 border px-5 py-4',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <Check className="text-or size-4 shrink-0" aria-hidden="true" />
        <p className="font-italic-editorial text-sm">{successMessage}</p>
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
          'border-ivoire/30 flex items-center gap-2 border-b pb-3',
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
            'text-ivoire placeholder:text-ivoire/40 flex-1 border-0 bg-transparent px-0 text-base',
            'outline-none focus-visible:outline-none',
          )}
          aria-invalid={state === 'error'}
          aria-describedby={errorMessage ? 'newsletter-error' : undefined}
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className={cn(
            'ui-caps text-or inline-flex items-center gap-2 transition-colors',
            'hover:text-or-light disabled:opacity-60',
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
        <p className="text-ivoire/45 mt-3 text-xs">
          Vous pouvez vous désabonner à tout moment. Consultez notre{' '}
          <a href="/confidentialite" className="hover:text-or underline underline-offset-2">
            politique de confidentialité
          </a>
          .
        </p>
      )}
    </form>
  );
}
