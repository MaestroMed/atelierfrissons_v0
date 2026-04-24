'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { signInWithMagicLink, type AuthActionResult } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  redirectTo: string | null;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<AuthActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    const formData = new FormData(e.currentTarget);
    if (redirectTo) formData.append('redirect', redirectTo);
    startTransition(async () => {
      const res = await signInWithMagicLink(formData);
      setResult(res);
      if (res.ok) setEmail('');
    });
  };

  if (result?.ok) {
    return (
      <div
        className="border-or/40 bg-or/5 w-full border p-6 text-left"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          <span className="bg-or text-noir mt-0.5 flex size-8 items-center justify-center rounded-full">
            <Check className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-noir text-lg font-medium">Vérifiez votre boîte mail</p>
            <p className="text-encre/75 mt-2 text-sm">{result.message}</p>
            <p className="text-encre/55 mt-3 text-xs">
              Le lien expire dans 60 minutes. Pensez à vérifier les spams si vous ne recevez rien.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4" noValidate>
      <label htmlFor="login-email" className="ui-caps text-encre/65 text-left">
        Adresse e-mail
      </label>
      <div className="relative">
        <Mail
          aria-hidden="true"
          className="text-encre/40 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
        />
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (result) setResult(null);
          }}
          placeholder="vous@maison.fr"
          aria-invalid={result?.ok === false}
          aria-describedby={result?.ok === false ? 'login-error' : undefined}
          className="border-encre/20 text-encre placeholder:text-encre/40 focus:border-or w-full border bg-transparent py-3.5 pr-4 pl-11 text-base transition-colors focus:outline-none"
        />
      </div>

      {result && !result.ok ? (
        <p id="login-error" role="alert" className="text-rouge-light text-left text-xs">
          {result.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'ui-caps mt-2 inline-flex items-center justify-center gap-3 px-6 py-4',
          'bg-noir text-ivoire hover:bg-or hover:text-noir transition-all',
          'disabled:cursor-wait disabled:opacity-70',
        )}
      >
        {isPending ? (
          <>
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Envoi du lien…
          </>
        ) : (
          <>
            Recevoir le lien
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
