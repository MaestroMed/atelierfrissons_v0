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
 *
 * V1 : validation client + feedback visuel. L'envoi vers Klaviyo sera
 * branché en Sprint 3 (action serveur /api/newsletter/subscribe qui
 * pushera vers `newsletter_subscribers` + Klaviyo via KLAVIYO_PRIVATE_KEY).
 */
export function NewsletterForm({ source = 'footer', className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setState('error');
      setErrorMessage('Merci d’indiquer votre adresse e-mail.');
      return;
    }
    // Validation RFC 5322 simplifiée — suffisante côté client.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState('error');
      setErrorMessage('Cette adresse ne semble pas valide.');
      return;
    }
    setState('submitting');
    setErrorMessage(null);
    try {
      // TODO Sprint 3 — remplacer par fetch('/api/newsletter/subscribe').
      await new Promise((resolve) => setTimeout(resolve, 400));
      console.info('[newsletter] subscribe queued', { email: trimmed, source });
      setState('success');
      setEmail('');
    } catch {
      setState('error');
      setErrorMessage('Un instant — réessayez dans quelques secondes.');
    }
  }

  if (state === 'success') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 border border-or/40 bg-or/5 px-5 py-4 text-ivoire',
          className,
        )}
        role="status"
      >
        <Check className="size-4 text-or" aria-hidden="true" />
        <p className="font-italic-editorial text-sm">
          Merci. Vous recevrez nos prochaines parutions.
        </p>
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
          'flex items-center gap-2 border-b border-ivoire/30 pb-3',
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
            'flex-1 border-0 bg-transparent px-0 text-base text-ivoire placeholder:text-ivoire/40',
            'outline-none focus-visible:outline-none',
          )}
          aria-invalid={state === 'error'}
          aria-describedby={errorMessage ? 'newsletter-error' : undefined}
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className={cn(
            'ui-caps inline-flex items-center gap-2 text-or transition-colors',
            'hover:text-or-light disabled:opacity-60',
          )}
        >
          {state === 'submitting' ? 'Envoi…' : 'Je m’inscris'}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      {errorMessage ? (
        <p id="newsletter-error" className="mt-2 text-xs text-rouge-light" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className="mt-3 text-xs text-ivoire/45">
          Vous pouvez vous désabonner à tout moment. Consultez notre{' '}
          <a href="/confidentialite" className="underline underline-offset-2 hover:text-or">
            politique de confidentialité
          </a>
          .
        </p>
      )}
    </form>
  );
}
