'use client';

import { useState, useTransition } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { applyPromoCodeAction, removePromoCodeAction } from '@/lib/cart/actions';
import type { CartSnapshot } from '@/lib/cart/types';
import { formatPriceCents } from '@/lib/format';

interface PromoCodeFieldProps {
  /** Snapshot courant — utilisé pour détecter l'état appliqué. */
  snapshot: CartSnapshot;
  /** Callback appelé avec le nouveau snapshot après apply/remove. */
  onSnapshotChange?: (snapshot: CartSnapshot) => void;
  className?: string;
}

/**
 * Champ d'application d'un code promo — collapsible.
 *
 * État fermé : lien « Appliquer un code » discret.
 * État ouvert : input + bouton Appliquer, erreur inline si invalide.
 * État appliqué : affichage du code + montant remise + bouton X pour
 * retirer.
 *
 * Codes mock actifs (lib/cart/promo.ts) : WELCOME10 · DUO15 · GIFT500.
 */
export function PromoCodeField({ snapshot, onSnapshotChange, className }: PromoCodeFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const applied = snapshot.discountCode !== null;

  const handleApply = () => {
    if (!code.trim()) {
      setError('Saisissez un code');
      return;
    }
    startTransition(async () => {
      setError(null);
      const result = await applyPromoCodeAction(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setCode('');
      setExpanded(false);
      onSnapshotChange?.(result.snapshot);
      toast.success(`Code appliqué · ${formatPriceCents(result.snapshot.discountCents)} de remise`);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      setError(null);
      const next = await removePromoCodeAction();
      onSnapshotChange?.(next);
      toast('Code retiré', { duration: 2000 });
    });
  };

  // ── État appliqué ────────────────────────────────────────────────
  if (applied) {
    return (
      <div
        className={cn(
          'border-or/40 bg-or/8 flex items-center justify-between gap-3 border px-4 py-3',
          className,
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          <Check className="text-or-dark size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
          <div className="flex flex-col gap-0.5">
            <span className="ui-caps tabular text-noir">{snapshot.discountCode}</span>
            <span className="tabular text-or-dark text-xs">
              − {formatPriceCents(snapshot.discountCents)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={pending}
          aria-label="Retirer le code promo"
          className="text-encre/55 hover:text-rouge inline-flex size-7 items-center justify-center transition-colors disabled:opacity-50"
        >
          <X className="size-4" aria-hidden="true" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // ── État collapsed ────────────────────────────────────────────────
  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={cn(
          'ui-caps text-encre/65 hover:text-or-dark inline-flex items-center gap-2 text-xs transition-colors',
          className,
        )}
      >
        <Tag className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        Appliquer un code
      </button>
    );
  }

  // ── État expanded ─────────────────────────────────────────────────
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor="promo-code-input" className="ui-caps text-encre/65 text-[10px]">
        Code promo
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code-input"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
          }}
          placeholder="WELCOME10"
          autoComplete="off"
          autoFocus
          aria-invalid={!!error}
          aria-describedby={error ? 'promo-code-error' : undefined}
          className={cn(
            'border-encre/20 text-encre focus:border-or flex-1 border bg-transparent px-3 py-2 text-sm transition-colors focus:outline-none',
            'tabular placeholder:text-encre/35',
            error && 'border-rouge-light',
          )}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={pending || !code.trim()}
          className={cn(
            'ui-caps bg-noir text-ivoire hover:bg-rouge inline-flex items-center justify-center px-4 py-2 text-xs transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {pending ? '…' : 'Appliquer'}
        </button>
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setCode('');
            setError(null);
          }}
          aria-label="Annuler"
          className="text-encre/55 hover:text-encre inline-flex size-[34px] items-center justify-center transition-colors"
        >
          <X className="size-4" aria-hidden="true" strokeWidth={1.5} />
        </button>
      </div>
      {error ? (
        <p id="promo-code-error" role="alert" className="text-rouge-light text-xs">
          {error}
        </p>
      ) : (
        <p className="text-encre/50 text-[11px]">
          Essayez{' '}
          <button
            type="button"
            onClick={() => setCode('WELCOME10')}
            className="hover:text-or-dark underline underline-offset-2"
          >
            WELCOME10
          </button>
        </p>
      )}
    </div>
  );
}
