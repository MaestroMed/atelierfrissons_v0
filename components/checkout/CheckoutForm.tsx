'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Gift, Lock } from 'lucide-react';
import { placeOrderAction } from '@/lib/checkout/actions';
import {
  contactSchema,
  addressSchema,
  type CheckoutInput,
  SHIPPING_METHODS,
  type ShippingMethodKey,
} from '@/lib/checkout/schemas';
import type { CartSnapshot } from '@/lib/cart/types';
import { Fleuron } from '@/components/layout/Fleuron';
import { formatPriceCents } from '@/lib/format';
import { cn } from '@/lib/utils';

interface CheckoutFormProps {
  initialEmail?: string;
  cart: CartSnapshot;
}

type Step = 1 | 2 | 3;

const STEPS = [
  { n: 1, label: 'Coordonnées' },
  { n: 2, label: 'Livraison' },
  { n: 3, label: 'Paiement' },
] as const;

export function CheckoutForm({ initialEmail = '', cart }: CheckoutFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form state — single object pour simplifier
  const [form, setForm] = useState<CheckoutInput>({
    contact: {
      email: initialEmail,
      firstName: '',
      lastName: '',
      phone: '',
    },
    shippingAddress: {
      line1: '',
      line2: '',
      postalCode: '',
      city: '',
      country: 'FR',
    },
    billingSameAsShipping: true,
    shippingMethod: 'standard',
    notes: '',
    isGift: false,
    giftWrap: false,
    giftMessage: '',
    consentMarketing: false,
    consentTerms: true,
  });

  const shippingPrice = useMemo(() => {
    if (cart.subtotalCents >= 6000) return 0;
    return SHIPPING_METHODS.find((m) => m.value === form.shippingMethod)?.priceCents ?? 690;
  }, [form.shippingMethod, cart.subtotalCents]);

  const finalTotal = cart.subtotalCents + shippingPrice;

  const goNext = () => {
    setGlobalError(null);
    if (step === 1) {
      const result = contactSchema.safeParse(form.contact);
      if (!result.success) {
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          errors[`contact.${String(issue.path[0])}`] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setStep(2);
    } else if (step === 2) {
      const result = addressSchema.safeParse(form.shippingAddress);
      if (!result.success) {
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          errors[`shippingAddress.${String(issue.path[0])}`] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setStep(3);
    }
  };

  const goPrev = () => {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
    setFieldErrors({});
    setGlobalError(null);
  };

  const handleSubmit = () => {
    if (!form.consentTerms) {
      setGlobalError('Vous devez accepter les conditions de vente.');
      return;
    }
    startTransition(async () => {
      const res = await placeOrderAction(form);
      if (!res.ok) {
        setGlobalError(res.message ?? 'Une erreur est survenue.');
        setFieldErrors(res.fieldErrors ?? {});
        return;
      }
      // placeOrderAction redirige déjà — fallback :
      if (res.orderNumber) router.push(`/checkout/confirmation/${res.orderNumber}`);
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      {/* Form */}
      <div className="flex flex-col gap-8">
        <Stepper currentStep={step} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) goNext();
            else handleSubmit();
          }}
          className="flex flex-col gap-8"
          noValidate
        >
          {/* ──────── Étape 1 — Coordonnées ──────── */}
          {step === 1 && (
            <section aria-labelledby="step1-heading" className="flex flex-col gap-5">
              <h2 id="step1-heading" className="font-display text-noir text-2xl font-medium">
                Vos coordonnées
              </h2>
              <Field
                id="email"
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                required
                value={form.contact.email}
                onChange={(v) => setForm((p) => ({ ...p, contact: { ...p.contact, email: v } }))}
                error={fieldErrors['contact.email']}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="firstName"
                  label="Prénom"
                  autoComplete="given-name"
                  required
                  value={form.contact.firstName}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, contact: { ...p.contact, firstName: v } }))
                  }
                  error={fieldErrors['contact.firstName']}
                />
                <Field
                  id="lastName"
                  label="Nom"
                  autoComplete="family-name"
                  required
                  value={form.contact.lastName}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, contact: { ...p.contact, lastName: v } }))
                  }
                  error={fieldErrors['contact.lastName']}
                />
              </div>
              <Field
                id="phone"
                label="Téléphone (optionnel)"
                type="tel"
                autoComplete="tel"
                value={form.contact.phone ?? ''}
                onChange={(v) => setForm((p) => ({ ...p, contact: { ...p.contact, phone: v } }))}
                error={fieldErrors['contact.phone']}
                hint="Pour le suivi de livraison uniquement — jamais utilisé pour vous démarcher."
              />
              <CheckboxField
                id="consentMarketing"
                label="Je souhaite recevoir la newsletter éditoriale Atelier Frisson (max 2/mois)."
                checked={form.consentMarketing}
                onChange={(v) => setForm((p) => ({ ...p, consentMarketing: v }))}
              />
            </section>
          )}

          {/* ──────── Étape 2 — Livraison ──────── */}
          {step === 2 && (
            <section aria-labelledby="step2-heading" className="flex flex-col gap-6">
              <h2 id="step2-heading" className="font-display text-noir text-2xl font-medium">
                Adresse de livraison
              </h2>
              <Field
                id="line1"
                label="Adresse"
                autoComplete="address-line1"
                required
                value={form.shippingAddress.line1}
                onChange={(v) =>
                  setForm((p) => ({ ...p, shippingAddress: { ...p.shippingAddress, line1: v } }))
                }
                error={fieldErrors['shippingAddress.line1']}
              />
              <Field
                id="line2"
                label="Complément (optionnel)"
                autoComplete="address-line2"
                value={form.shippingAddress.line2 ?? ''}
                onChange={(v) =>
                  setForm((p) => ({ ...p, shippingAddress: { ...p.shippingAddress, line2: v } }))
                }
              />
              <div className="grid gap-5 sm:grid-cols-[150px_1fr_120px]">
                <Field
                  id="postalCode"
                  label="Code postal"
                  autoComplete="postal-code"
                  required
                  value={form.shippingAddress.postalCode}
                  onChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      shippingAddress: { ...p.shippingAddress, postalCode: v },
                    }))
                  }
                  error={fieldErrors['shippingAddress.postalCode']}
                />
                <Field
                  id="city"
                  label="Ville"
                  autoComplete="address-level2"
                  required
                  value={form.shippingAddress.city}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, shippingAddress: { ...p.shippingAddress, city: v } }))
                  }
                  error={fieldErrors['shippingAddress.city']}
                />
                <Field
                  id="country"
                  label="Pays"
                  autoComplete="country"
                  required
                  value={form.shippingAddress.country}
                  onChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      shippingAddress: { ...p.shippingAddress, country: v.toUpperCase() },
                    }))
                  }
                  maxLength={2}
                />
              </div>

              <fieldset className="mt-4 flex flex-col gap-3">
                <legend className="ui-caps text-or-dark">Mode de livraison</legend>
                {SHIPPING_METHODS.map((method) => {
                  const isFree = cart.subtotalCents >= 6000;
                  return (
                    <label
                      key={method.value}
                      className={cn(
                        'flex cursor-pointer items-start justify-between gap-4 border p-4 transition-colors',
                        form.shippingMethod === method.value
                          ? 'border-or bg-or/5'
                          : 'border-encre/20 hover:border-or/60',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.value}
                          checked={form.shippingMethod === method.value}
                          onChange={() =>
                            setForm((p) => ({
                              ...p,
                              shippingMethod: method.value as ShippingMethodKey,
                            }))
                          }
                          className="accent-or mt-1.5 size-3.5"
                        />
                        <div>
                          <p className="font-display text-noir text-base font-medium">
                            {method.label}
                          </p>
                          <p className="text-encre/65 mt-0.5 text-xs">{method.delay}</p>
                          <p className="text-encre/55 mt-1 text-xs">{method.description}</p>
                        </div>
                      </div>
                      <span className="tabular text-encre text-sm font-medium">
                        {isFree ? 'Offerte' : formatPriceCents(method.priceCents)}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            </section>
          )}

          {/* ──────── Étape 3 — Paiement ──────── */}
          {step === 3 && (
            <section aria-labelledby="step3-heading" className="flex flex-col gap-5">
              <h2 id="step3-heading" className="font-display text-noir text-2xl font-medium">
                Paiement
              </h2>

              <div className="border-or/30 bg-or/5 border p-5">
                <p className="font-display text-noir flex items-center gap-2 text-base">
                  <Lock className="text-or-dark size-4" aria-hidden="true" />
                  Mode développement
                </p>
                <p className="text-encre/75 mt-2 text-sm">
                  En production, le paiement passera par <strong>CCBill FlexForms</strong>{' '}
                  (high-risk adulte certifié). En développement, la commande est créée sans débit
                  réel — usage interne uniquement.
                </p>
              </div>

              <Field
                id="notes"
                label="Notes pour la livraison (optionnel)"
                value={form.notes ?? ''}
                onChange={(v) => setForm((p) => ({ ...p, notes: v }))}
                maxLength={500}
                hint="Code d’immeuble, instructions discrètes, etc."
              />

              {/* ──────── Gift options — bloc éditorial révélable ──────── */}
              <fieldset
                className={cn(
                  'flex flex-col gap-4 border p-5 transition-colors',
                  form.isGift ? 'border-or bg-or/5' : 'border-encre/15',
                )}
              >
                <legend className="sr-only">Options cadeau</legend>
                <label htmlFor="isGift" className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    id="isGift"
                    name="isGift"
                    type="checkbox"
                    checked={form.isGift}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        isGift: e.target.checked,
                        // Reset automatique des sous-options si on décoche
                        giftWrap: e.target.checked ? p.giftWrap : false,
                        giftMessage: e.target.checked ? p.giftMessage : '',
                      }))
                    }
                    className="accent-or mt-1 size-4"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-noir inline-flex items-center gap-2 text-base font-medium">
                      <Gift className="text-or-dark size-4" aria-hidden="true" strokeWidth={1.5} />
                      Offrir ce rituel
                    </span>
                    <span className="text-encre/65 text-xs">
                      La boîte reçoit une carte signée à la main, sans prix imprimé.
                    </span>
                  </span>
                </label>

                {/* Sous-options — révélées seulement si isGift */}
                {form.isGift ? (
                  <div className="border-or/20 animate-in slide-in-from-top-2 fade-in flex flex-col gap-4 border-t pt-4 duration-300 motion-reduce:animate-none">
                    <label
                      htmlFor="giftWrap"
                      className="flex cursor-pointer items-start gap-3 text-sm"
                    >
                      <input
                        id="giftWrap"
                        name="giftWrap"
                        type="checkbox"
                        checked={form.giftWrap}
                        onChange={(e) => setForm((p) => ({ ...p, giftWrap: e.target.checked }))}
                        className="accent-or mt-1 size-4"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-noir font-medium">
                          Emballage cadeau signé{' '}
                          <span className="ui-caps text-or-dark ml-1 text-[10px]">Offert</span>
                        </span>
                        <span className="text-encre/65 text-xs">
                          Papier crème, ruban or champagne, monogramme AF gaufré.
                        </span>
                      </span>
                    </label>

                    <Field
                      id="giftMessage"
                      label="Message de la carte (optionnel)"
                      value={form.giftMessage ?? ''}
                      onChange={(v) => setForm((p) => ({ ...p, giftMessage: v }))}
                      maxLength={280}
                      hint="280 caractères max · écrit sur une carte épaisse ivoire par notre équipe."
                    />
                  </div>
                ) : null}
              </fieldset>

              <CheckboxField
                id="consentTerms"
                label={
                  <>
                    J’accepte les{' '}
                    <Link
                      href="/cgv"
                      target="_blank"
                      className="hover:text-or-dark underline underline-offset-2"
                    >
                      conditions générales de vente
                    </Link>{' '}
                    et la politique de confidentialité.
                  </>
                }
                checked={form.consentTerms}
                onChange={(v) => setForm((p) => ({ ...p, consentTerms: v }))}
                required
              />
            </section>
          )}

          {globalError ? (
            <p role="alert" className="text-rouge-light text-sm">
              {globalError}
            </p>
          ) : null}

          {/* Footer actions */}
          <div className="border-encre/10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                className="ui-caps text-encre/65 hover:text-or-dark inline-flex items-center gap-2"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Étape précédente
              </button>
            ) : (
              <Link
                href="/panier"
                className="ui-caps text-encre/65 hover:text-or-dark inline-flex items-center gap-2"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Retour au panier
              </Link>
            )}
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'ui-caps inline-flex items-center justify-center gap-3 px-8 py-4',
                'bg-noir text-ivoire hover:bg-rouge transition-colors',
                'disabled:cursor-wait disabled:opacity-70',
              )}
            >
              {isPending ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                  />
                  Validation…
                </>
              ) : step < 3 ? (
                <>
                  Continuer
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  <Check className="size-4" aria-hidden="true" />
                  Confirmer la commande
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Récap */}
      <aside className="lg:sticky lg:top-32 lg:h-fit">
        <div className="border-encre/10 bg-ivoire-light border p-6 md:p-8">
          <h2 className="font-display text-noir text-xl font-medium">Votre commande</h2>
          <Fleuron variant="divider" size="sm" color="or" className="mt-3 opacity-70" />

          {form.isGift ? (
            <div className="border-or/40 bg-or/8 mt-4 flex items-start gap-2.5 border px-3 py-2.5 text-xs">
              <Gift
                className="text-or-dark mt-0.5 size-3.5 shrink-0"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              <div className="flex flex-col gap-0.5">
                <span className="ui-caps text-or-dark">Commande offerte</span>
                <span className="text-encre/70">
                  {form.giftWrap ? 'Emballage signé · ' : ''}
                  {form.giftMessage ? 'Carte signée à la main' : 'Sans prix imprimé'}
                </span>
              </div>
            </div>
          ) : null}

          <ul className="mt-5 space-y-3 text-sm">
            {cart.items.map((item) => (
              <li key={item.productId} className="flex items-baseline justify-between gap-3">
                <span>
                  <span className="font-display text-noir">{item.name}</span>{' '}
                  <span className="text-encre/55">× {item.quantity}</span>
                </span>
                <span className="tabular text-encre">
                  {formatPriceCents(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="border-encre/10 mt-5 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-encre/70">Sous-total</dt>
              <dd className="tabular text-encre">{formatPriceCents(cart.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-encre/70">Livraison</dt>
              <dd className="tabular text-encre">
                {shippingPrice === 0 ? 'Offerte' : formatPriceCents(shippingPrice)}
              </dd>
            </div>
            <div className="border-encre/15 mt-3 flex justify-between border-t pt-3 text-lg">
              <dt className="text-encre font-medium">Total TTC</dt>
              <dd className="tabular text-encre font-medium">{formatPriceCents(finalTotal)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: Step }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = currentStep > s.n;
        const active = currentStep === s.n;
        return (
          <li key={s.n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'tabular flex size-7 shrink-0 items-center justify-center rounded-full border text-xs',
                done
                  ? 'border-or bg-or text-noir'
                  : active
                    ? 'border-noir bg-noir text-ivoire'
                    : 'border-encre/30 text-encre/50',
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : s.n}
            </span>
            <span
              className={cn(
                'ui-caps hidden md:inline',
                active ? 'text-encre' : done ? 'text-or-dark' : 'text-encre/45',
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn('flex-1 border-t', done ? 'border-or' : 'border-encre/20')}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  hint?: string;
  maxLength?: number;
}

function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  required = false,
  value,
  onChange,
  error,
  hint,
  maxLength,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="ui-caps text-encre/65">
        {label} {required ? <span className="text-rouge-light">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete ?? undefined}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength ?? undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          'border-encre/20 text-encre border bg-transparent px-4 py-3 text-base transition-colors',
          'placeholder:text-encre/40 focus:border-or focus:outline-none',
          error && 'border-rouge-light',
        )}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-rouge-light text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-encre/55 text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
}

function CheckboxField({ id, label, checked, onChange, required = false }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="text-encre flex items-start gap-3 text-sm">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="accent-or mt-1 size-4"
      />
      <span className="leading-relaxed">{label}</span>
    </label>
  );
}
