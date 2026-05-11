'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, AlertCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { HoneypotFields } from '@/components/shared/HoneypotFields';
import { submitAmbassadorApplicationAction } from '@/lib/ambassadors/actions';

const AUDIENCE_OPTIONS = [
  { value: 'under_5k', label: 'Moins de 5K' },
  { value: '5k_15k', label: '5K – 15K' },
  { value: '15k_50k', label: '15K – 50K' },
  { value: '50k_150k', label: '50K – 150K' },
  { value: 'over_150k', label: 'Plus de 150K' },
] as const;

const NICHE_OPTIONS = [
  { value: 'lifestyle_couple', label: 'Lifestyle couple' },
  { value: 'beauty_wellness', label: 'Beauty / Wellness' },
  { value: 'fashion_lingerie', label: 'Fashion / Lingerie' },
  { value: 'sexology_education', label: 'Sexologie / Éducation' },
  { value: 'art_culture', label: 'Art / Culture' },
  { value: 'autre', label: 'Autre' },
] as const;

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; applicationId: string; estimatedDays: number }
  | { kind: 'error'; message: string };

export function AmbassadorApplicationForm() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [audienceSize, setAudienceSize] = useState<(typeof AUDIENCE_OPTIONS)[number]['value']>(
    '5k_15k',
  );
  const [niche, setNiche] = useState<(typeof NICHE_OPTIONS)[number]['value']>('lifestyle_couple');
  const [bio, setBio] = useState('');
  const [pourquoi, setPourquoi] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const honeypot = {
      _hp: formData.get('_hp') ?? '',
      _t: formData.get('_t') ?? '',
    };

    setState({ kind: 'submitting' });
    startTransition(async () => {
      try {
        const result = await submitAmbassadorApplicationAction({
          firstName,
          email,
          instagramHandle,
          audienceSize,
          niche,
          bio,
          pourquoi,
          acceptedTerms: true as const,
          ...honeypot,
        });

        if (!result.ok) {
          const firstFieldError =
            result.fieldErrors &&
            Object.values(result.fieldErrors).flat().filter(Boolean)[0];
          setState({
            kind: 'error',
            message: (firstFieldError as string | undefined) ?? result.error,
          });
          return;
        }

        setState({
          kind: 'success',
          applicationId: result.data.applicationId,
          estimatedDays: result.data.estimatedResponseDays,
        });
      } catch (err) {
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Erreur — réessayez',
        });
      }
    });
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
          Candidature reçue
        </p>
        <h3 className="font-display text-noir text-2xl font-medium md:text-3xl">
          Référence{' '}
          <span className="font-italic-editorial text-or-dark">{state.applicationId}</span>
        </h3>
        <p className="text-encre/75 max-w-md text-sm leading-relaxed">
          On lit votre candidature en personne. Réponse sous{' '}
          <strong>{state.estimatedDays} jours</strong>, toujours avec un mot — qu\'on dise oui, non,
          ou « pas tout de suite ».
        </p>
        <p className="text-encre/55 text-xs">
          Un email de confirmation vous a été envoyé à <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-ivoire border-encre/15 flex flex-col gap-7 border p-6 md:p-10"
    >
      <HoneypotFields />

      {/* Section identité */}
      <fieldset className="flex flex-col gap-4">
        <legend className="ui-caps text-or-dark mb-1 text-[10px] tracking-widest">
          01 · Identité
        </legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id="firstName"
            label="Prénom"
            value={firstName}
            onChange={setFirstName}
            placeholder="Camille"
            required
            autoComplete="given-name"
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="vous@exemple.fr"
            required
            autoComplete="email"
          />
        </div>
      </fieldset>

      {/* Section réseaux */}
      <fieldset className="flex flex-col gap-4">
        <legend className="ui-caps text-or-dark mb-1 text-[10px] tracking-widest">
          02 · Votre voix
        </legend>
        <Field
          id="instagram"
          label="Pseudo Instagram (ou autre plateforme dominante)"
          value={instagramHandle}
          onChange={setInstagramHandle}
          placeholder="@votrehandle"
          required
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField
            id="audience"
            label="Taille de votre audience"
            value={audienceSize}
            onChange={(v) => setAudienceSize(v as typeof audienceSize)}
            options={AUDIENCE_OPTIONS}
          />
          <SelectField
            id="niche"
            label="Univers principal"
            value={niche}
            onChange={(v) => setNiche(v as typeof niche)}
            options={NICHE_OPTIONS}
          />
        </div>
      </fieldset>

      {/* Section présentation */}
      <fieldset className="flex flex-col gap-4">
        <legend className="ui-caps text-or-dark mb-1 text-[10px] tracking-widest">
          03 · Votre travail
        </legend>
        <TextareaField
          id="bio"
          label="Décrivez votre contenu en quelques lignes"
          value={bio}
          onChange={(v) => setBio(v.slice(0, 800))}
          maxLength={800}
          placeholder="Style, fréquence, valeurs, sujets récurrents…"
          required
        />
        <TextareaField
          id="pourquoi"
          label="Pourquoi Atelier Frisson ?"
          value={pourquoi}
          onChange={(v) => setPourquoi(v.slice(0, 800))}
          maxLength={800}
          placeholder="Ce que la maison vous évoque, ce que vous aimeriez raconter…"
          required
        />
      </fieldset>

      {/* CGV */}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="border-encre/30 text-or-dark mt-1 size-4 shrink-0"
          required
        />
        <span className="text-encre/80 leading-relaxed">
          J\'accepte que mes données soient traitées pour étudier ma candidature (RGPD art. 6§1.b),
          conservées 12 mois maximum, et supprimées à ma demande. Voir la{' '}
          <a
            href="/confidentialite"
            className="text-or-dark underline underline-offset-4 hover:text-or"
          >
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      {/* Error */}
      {state.kind === 'error' ? (
        <p
          role="alert"
          className="text-rouge bg-rouge/5 border-rouge/30 flex items-start gap-2 border px-3 py-2 text-xs"
        >
          <AlertCircle className="mt-0.5 size-3 shrink-0" aria-hidden="true" strokeWidth={1.5} />
          <span>{state.message}</span>
        </p>
      ) : null}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending || !acceptedTerms}
        className={cn(
          'ui-caps-md inline-flex items-center justify-center gap-3 px-6 py-4 transition-colors',
          acceptedTerms
            ? 'bg-noir text-ivoire hover:bg-rouge'
            : 'bg-encre/10 text-encre/40 cursor-not-allowed',
          'disabled:cursor-wait disabled:opacity-60',
        )}
      >
        {pending ? (
          <>
            <span
              aria-hidden="true"
              className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Envoyer ma candidature
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELDS
// ─────────────────────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ui-caps text-encre/70 text-[10px] tracking-widest">
        {label} {required ? <span className="text-rouge">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="bg-ivoire-light border-encre/20 focus:border-or-dark text-encre placeholder:text-encre/40 border px-4 py-3 text-base outline-none"
      />
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
}

function SelectField({ id, label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ui-caps text-encre/70 text-[10px] tracking-widest">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-ivoire-light border-encre/20 focus:border-or-dark text-encre border px-4 py-3 text-base outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength: number;
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ui-caps text-encre/70 text-[10px] tracking-widest">
        {label} {required ? <span className="text-rouge">*</span> : null}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={4}
        maxLength={maxLength}
        className="bg-ivoire-light border-encre/20 focus:border-or-dark text-encre placeholder:text-encre/40 resize-y border px-4 py-3 text-base outline-none"
      />
      <span className="text-encre/45 text-right text-[10px]">
        {value.length} / {maxLength}
      </span>
    </div>
  );
}
