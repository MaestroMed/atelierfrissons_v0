'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { HoneypotFields } from '@/components/shared/HoneypotFields';
import { purchaseGiftCardAction } from '@/lib/giftcards/actions';

const PRESET_AMOUNTS = [50, 100, 150, 200] as const;
const MIN_CUSTOM_AMOUNT = 30;
const MAX_CUSTOM_AMOUNT = 500;

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; orderRef: string }
  | { kind: 'error'; message: string };

/**
 * Formulaire d'achat de carte cadeau.
 *
 * Server Action stub : `purchaseGiftCardAction` retourne un orderRef simulé
 * tant que le multi-PSP n'est pas branché. Le formulaire est complet côté
 * UX (validation, états, accessibilité) — il suffira de remplacer le stub
 * par l'appel réel quand CCBill/Stripe sont configurés.
 */
export function GiftCardForm() {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [usingCustom, setUsingCustom] = useState(false);
  const [physicalCard, setPhysicalCard] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendDate, setSendDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [pending, startTransition] = useTransition();

  const totalCents =
    (usingCustom
      ? Math.max(MIN_CUSTOM_AMOUNT, Math.min(MAX_CUSTOM_AMOUNT, Number(customAmount) || 0))
      : amount) *
      100 +
    (physicalCard ? 900 : 0);

  const formatEUR = (cents: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
      .format(cents / 100);

  function validate(): string | null {
    const valueEur = totalCents / 100;
    if (valueEur < MIN_CUSTOM_AMOUNT) return `Le montant minimum est ${MIN_CUSTOM_AMOUNT} €.`;
    if (valueEur > MAX_CUSTOM_AMOUNT + 9)
      return `Le montant maximum est ${MAX_CUSTOM_AMOUNT} €.`;
    if (!recipientName.trim()) return 'Indiquez le nom du destinataire.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) return 'Email destinataire invalide.';
    if (!senderName.trim()) return 'Indiquez votre nom.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) return 'Email expéditeur invalide.';
    if (!acceptedTerms) return 'Acceptez les conditions de vente pour continuer.';
    const sd = new Date(sendDate);
    if (Number.isNaN(sd.getTime())) return 'Date d\'envoi invalide.';
    return null;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setState({ kind: 'error', message: error });
      return;
    }
    const formData = new FormData(e.currentTarget);
    const honeypot = {
      _hp: formData.get('_hp') ?? '',
      _t: formData.get('_t') ?? '',
    };
    setState({ kind: 'submitting' });
    startTransition(async () => {
      try {
        const result = await purchaseGiftCardAction({
          ...honeypot,
          amountCents: usingCustom
            ? Math.max(
                MIN_CUSTOM_AMOUNT,
                Math.min(MAX_CUSTOM_AMOUNT, Number(customAmount) || 0),
              ) * 100
            : amount * 100,
          physicalCard,
          recipientName,
          recipientEmail,
          senderName,
          senderEmail,
          message,
          sendDate,
          acceptedTerms: true as const,
        });
        if (!result.ok) {
          // Premier message d'erreur de champ s'il existe, sinon message global
          const firstFieldError =
            result.fieldErrors &&
            Object.values(result.fieldErrors).flat().filter(Boolean)[0];
          setState({
            kind: 'error',
            message: (firstFieldError as string | undefined) ?? result.error,
          });
          return;
        }
        setState({ kind: 'success', orderRef: result.data.orderRef });
        // Une vraie intégration redirigerait vers result.data.paymentUrl :
        // window.location.href = result.data.paymentUrl;
      } catch (err) {
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Erreur inconnue. Réessayez.',
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
          Carte cadeau composée
        </p>
        <h3 className="font-display text-noir text-2xl font-medium md:text-3xl">
          Référence{' '}
          <span className="font-italic-editorial text-or-dark">{state.orderRef}</span>
        </h3>
        <p className="text-encre/75 max-w-md text-sm leading-relaxed">
          Un email de confirmation a été envoyé à <strong>{senderEmail}</strong> avec le reçu PDF.
          Le destinataire ({recipientName}) recevra son code à la date du{' '}
          <strong>{new Date(sendDate).toLocaleDateString('fr-FR')}</strong>.
        </p>
        <p className="text-encre/55 text-xs">
          Mode démonstration — le paiement sera activé après onboarding CCBill / Stripe live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10" noValidate>
      <HoneypotFields />

      {/* MONTANT */}
      <fieldset className="flex flex-col gap-4">
        <legend className="ui-caps text-or-dark mb-1">01 · Montant</legend>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {PRESET_AMOUNTS.map((preset) => {
            const active = !usingCustom && amount === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setUsingCustom(false);
                }}
                className={cn(
                  'border px-4 py-4 text-center transition-all',
                  active
                    ? 'bg-noir border-noir text-ivoire'
                    : 'bg-ivoire border-encre/15 text-encre/80 hover:border-or-dark',
                )}
              >
                <span className="font-display tabular text-2xl font-medium">{preset} €</span>
              </button>
            );
          })}
        </div>
        <label
          className={cn(
            'flex items-center gap-3 border px-4 py-3.5 transition-all',
            usingCustom
              ? 'bg-ivoire-light border-or-dark'
              : 'bg-ivoire border-encre/15 hover:border-or-dark',
          )}
        >
          <input
            type="checkbox"
            checked={usingCustom}
            onChange={(e) => setUsingCustom(e.target.checked)}
            className="border-encre/30 text-or-dark size-4"
            aria-label="Utiliser un montant personnalisé"
          />
          <span className="ui-caps text-encre/85 text-[11px] tracking-widest">
            Montant personnalisé
          </span>
          <input
            type="number"
            min={MIN_CUSTOM_AMOUNT}
            max={MAX_CUSTOM_AMOUNT}
            step={5}
            disabled={!usingCustom}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={`${MIN_CUSTOM_AMOUNT} – ${MAX_CUSTOM_AMOUNT}`}
            className="text-encre placeholder:text-encre/40 ml-auto w-32 border-0 bg-transparent text-right text-base outline-none disabled:opacity-50"
            aria-label="Montant personnalisé en euros"
          />
          <span className="text-encre/70 text-sm">€</span>
        </label>
      </fieldset>

      {/* OPTIONS */}
      <fieldset className="flex flex-col gap-3">
        <legend className="ui-caps text-or-dark mb-1">02 · Format</legend>
        <label
          className={cn(
            'flex items-start gap-3 border px-4 py-4 transition-all',
            !physicalCard
              ? 'bg-ivoire-light border-or-dark'
              : 'bg-ivoire border-encre/15 hover:border-or-dark',
          )}
        >
          <input
            type="radio"
            name="format"
            checked={!physicalCard}
            onChange={() => setPhysicalCard(false)}
            className="mt-0.5"
          />
          <span className="flex-1">
            <span className="font-display text-noir block text-base font-medium">
              Email seul · Inclus
            </span>
            <span className="text-encre/65 mt-1 block text-sm">
              Envoyé à la date programmée. Reçu PDF immédiat à l\'expéditeur.
            </span>
          </span>
        </label>
        <label
          className={cn(
            'flex items-start gap-3 border px-4 py-4 transition-all',
            physicalCard
              ? 'bg-ivoire-light border-or-dark'
              : 'bg-ivoire border-encre/15 hover:border-or-dark',
          )}
        >
          <input
            type="radio"
            name="format"
            checked={physicalCard}
            onChange={() => setPhysicalCard(true)}
            className="mt-0.5"
          />
          <span className="flex-1">
            <span className="font-display text-noir block text-base font-medium">
              Email + carte cotton letterpress · +9 €
            </span>
            <span className="text-encre/65 mt-1 block text-sm">
              Carte papier coton 350 g/m², impression letterpress, sceau cire à la main, livrée
              sous 5 jours.
            </span>
          </span>
        </label>
      </fieldset>

      {/* DESTINATAIRE */}
      <fieldset className="flex flex-col gap-4">
        <legend className="ui-caps text-or-dark mb-1">03 · Destinataire</legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id="recipient-name"
            label="Nom du destinataire"
            value={recipientName}
            onChange={setRecipientName}
            placeholder="Camille Mercier"
            autoComplete="name"
          />
          <Field
            id="recipient-email"
            label="Email du destinataire"
            type="email"
            value={recipientEmail}
            onChange={setRecipientEmail}
            placeholder="camille@exemple.fr"
            autoComplete="email"
          />
        </div>
        <Field
          id="message"
          label="Message (optionnel · 280 caractères max)"
          value={message}
          onChange={(v) => setMessage(v.slice(0, 280))}
          placeholder="Pour notre anniversaire — choisis ton rituel."
          textarea
        />
        <Field
          id="send-date"
          label="Date d\'envoi"
          type="date"
          value={sendDate}
          onChange={setSendDate}
          min={new Date().toISOString().slice(0, 10)}
          max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
        />
      </fieldset>

      {/* EXPÉDITEUR */}
      <fieldset className="flex flex-col gap-4">
        <legend className="ui-caps text-or-dark mb-1">04 · Vous</legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id="sender-name"
            label="Votre nom"
            value={senderName}
            onChange={setSenderName}
            placeholder="Mehdi Nafaa"
            autoComplete="name"
          />
          <Field
            id="sender-email"
            label="Votre email"
            type="email"
            value={senderEmail}
            onChange={setSenderEmail}
            placeholder="vous@exemple.fr"
            autoComplete="email"
          />
        </div>
      </fieldset>

      {/* CGV + CTA */}
      <div className="border-encre/10 flex flex-col gap-5 border-t pt-6">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 size-4"
          />
          <span className="text-encre/80 leading-relaxed">
            J\'accepte les{' '}
            <a href="/cgv" className="text-or-dark underline underline-offset-4 hover:text-or">
              Conditions Générales de Vente
            </a>{' '}
            et la{' '}
            <a
              href="/confidentialite"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              Politique de confidentialité
            </a>
            .
          </span>
        </label>

        {state.kind === 'error' ? (
          <p
            role="alert"
            className="text-rouge bg-rouge/5 border-rouge/20 flex items-start gap-2 border px-4 py-3 text-sm"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <span>{state.message}</span>
          </p>
        ) : null}

        <div className="border-encre/10 bg-ivoire-light flex flex-col gap-3 border p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="ui-caps text-encre/65 text-[10px] tracking-widest">À régler</p>
            <p className="font-display text-noir mt-1 text-3xl tabular-nums font-medium">
              {formatEUR(totalCents)}
            </p>
          </div>
          <button
            type="submit"
            disabled={pending || state.kind === 'submitting'}
            className={cn(
              'ui-caps-md inline-flex items-center justify-center gap-3 px-8 py-4 transition-colors',
              'bg-noir text-ivoire hover:bg-rouge',
              'disabled:cursor-wait disabled:opacity-60',
            )}
          >
            {pending || state.kind === 'submitting' ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Composition…
              </>
            ) : (
              <>
                Procéder au paiement
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'date';
  placeholder?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
  textarea?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  min,
  max,
  textarea,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ui-caps text-encre/75 text-[10px] tracking-widest">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="bg-ivoire border-encre/20 focus:border-or-dark text-encre placeholder:text-encre/40 resize-y border px-4 py-3 text-base outline-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min}
          max={max}
          className="bg-ivoire border-encre/20 focus:border-or-dark text-encre placeholder:text-encre/40 border px-4 py-3 text-base outline-none"
        />
      )}
    </div>
  );
}
