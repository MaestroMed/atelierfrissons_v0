'use client';

import { useState, useTransition } from 'react';
import { Download, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { requestErasureAction, requestExportAction } from '@/lib/gdpr/actions';

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting'; action: 'export' | 'erasure' }
  | { kind: 'export-success'; jobId: string; estimatedDeliveryMinutes: number }
  | { kind: 'erasure-success'; scheduledFor: string; cancelUrl: string }
  | { kind: 'error'; message: string };

/**
 * Bloc d'actions RGPD interactif — formulaires d'export DSAR + effacement compte.
 *
 * Effacement : nécessite une confirmation textuelle stricte (« SUPPRIMER MON
 * COMPTE ») pour éviter les clics accidentels (RGPD-compatible : on peut
 * toujours demander, mais on protège l'utilisateur d'un suicide compte).
 */
export function GdprActionsForm() {
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [pending, startTransition] = useTransition();

  // Erasure form state
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const isExpected = confirmText.trim().toUpperCase() === 'SUPPRIMER MON COMPTE';

  function handleExport() {
    setState({ kind: 'submitting', action: 'export' });
    startTransition(async () => {
      try {
        const result = await requestExportAction({ format: exportFormat });
        if (!result.ok) {
          setState({ kind: 'error', message: result.error });
          return;
        }
        setState({
          kind: 'export-success',
          jobId: result.data.jobId,
          estimatedDeliveryMinutes: result.data.estimatedDeliveryMinutes,
        });
      } catch (err) {
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Erreur inconnue',
        });
      }
    });
  }

  function handleErasure() {
    if (!isExpected) {
      setState({
        kind: 'error',
        message: "Saisissez exactement « SUPPRIMER MON COMPTE » pour confirmer",
      });
      return;
    }
    setState({ kind: 'submitting', action: 'erasure' });
    startTransition(async () => {
      try {
        const result = await requestErasureAction({
          confirmText: 'SUPPRIMER MON COMPTE' as const,
          reason: reason || undefined,
        });
        if (!result.ok) {
          setState({ kind: 'error', message: result.error });
          return;
        }
        setState({
          kind: 'erasure-success',
          scheduledFor: result.data.scheduledFor,
          cancelUrl: result.data.cancelUrl,
        });
      } catch (err) {
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Erreur inconnue',
        });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* EXPORT DSAR */}
      <section className="bg-ivoire-light border-encre/10 flex flex-col gap-5 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <Download className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-xl font-medium">
            Export de mes données (DSAR)
          </h3>
        </header>
        <p className="text-encre/75 text-sm leading-relaxed">
          Reçoit un fichier complet par email contenant toutes vos données : compte, commandes,
          adresses, abonnements, points fidélité, parrainage. Délai estimé : 15 minutes. Lien
          valable 7 jours.
        </p>

        <fieldset className="flex flex-col gap-2">
          <legend className="ui-caps text-encre/65 text-[10px] tracking-widest mb-1">
            Format
          </legend>
          <div className="flex gap-2">
            {(['json', 'csv'] as const).map((fmt) => (
              <label
                key={fmt}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 border px-4 py-2 transition-colors',
                  exportFormat === fmt
                    ? 'border-noir bg-noir text-ivoire'
                    : 'border-encre/15 bg-ivoire text-encre/80 hover:border-or-dark',
                )}
              >
                <input
                  type="radio"
                  name="export-format"
                  value={fmt}
                  checked={exportFormat === fmt}
                  onChange={() => setExportFormat(fmt)}
                  className="sr-only"
                />
                <span className="ui-caps text-[11px] tracking-widest">{fmt.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {state.kind === 'export-success' ? (
          <div
            className="bg-or/10 border-or/40 flex items-start gap-3 border p-4"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="text-or-dark mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="text-encre/85 text-sm">
              <p className="font-medium">Demande enregistrée.</p>
              <p className="mt-1 text-xs">
                Référence : <code className="bg-ivoire/60 px-1 font-mono text-[11px]">{state.jobId}</code>
              </p>
              <p className="mt-1 text-xs">
                Vous recevrez un email d'ici environ {state.estimatedDeliveryMinutes} minutes avec
                votre export.
              </p>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleExport}
          disabled={pending && state.kind === 'submitting' && state.action === 'export'}
          className="ui-caps-md bg-noir text-ivoire hover:bg-rouge mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 transition-colors disabled:opacity-60"
        >
          {pending && state.kind === 'submitting' && state.action === 'export' ? (
            <>
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              Demande en cours…
            </>
          ) : (
            <>
              <Download className="size-4" aria-hidden="true" />
              Demander mon export
            </>
          )}
        </button>
      </section>

      {/* ERASURE */}
      <section className="bg-rouge/5 border-rouge/30 flex flex-col gap-5 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <Trash2 className="text-rouge size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-xl font-medium">
            Supprimer mon compte
          </h3>
        </header>
        <p className="text-encre/75 text-sm leading-relaxed">
          Délai de grâce <strong>30 jours</strong> pendant lequel vous pouvez annuler. Au-delà :
          effacement irréversible. Vos commandes restent archivées 10 ans pour obligation
          comptable mais sont anonymisées (nom, email, adresses retirés).
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="ui-caps text-encre/65 text-[10px] tracking-widest">
              Raison (facultative)
            </span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              rows={2}
              placeholder="Pourquoi partez-vous ? (utile pour s'améliorer)"
              className="bg-ivoire border-encre/20 focus:border-or-dark text-encre placeholder:text-encre/40 resize-none border px-3 py-2 text-sm outline-none"
            />
            <span className="text-encre/45 text-right text-[10px]">{reason.length} / 500</span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="ui-caps text-rouge text-[10px] tracking-widest font-medium">
              Confirmation requise *
            </span>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Saisissez exactement : SUPPRIMER MON COMPTE"
              className={cn(
                'bg-ivoire border placeholder:text-encre/40 px-3 py-2 text-sm outline-none transition-colors',
                isExpected
                  ? 'border-or-dark text-encre'
                  : 'border-encre/20 focus:border-rouge text-encre',
              )}
            />
          </label>
        </div>

        {state.kind === 'erasure-success' ? (
          <div
            className="bg-rouge/10 border-rouge/40 flex items-start gap-3 border p-4"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="text-rouge mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="text-encre/85 text-sm">
              <p className="font-medium">Suppression programmée.</p>
              <p className="mt-1 text-xs">
                Effective le{' '}
                <time>
                  {new Date(state.scheduledFor).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                .
              </p>
              <p className="mt-1 text-xs">
                Un email de confirmation vous a été envoyé avec un lien d'annulation valable 30 jours.
              </p>
            </div>
          </div>
        ) : null}

        {state.kind === 'error' ? (
          <p
            role="alert"
            className="text-rouge bg-rouge/5 border-rouge/30 flex items-start gap-2 border px-3 py-2 text-xs"
          >
            <AlertCircle className="mt-0.5 size-3 shrink-0" aria-hidden="true" strokeWidth={1.5} />
            <span>{state.message}</span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleErasure}
          disabled={!isExpected || (pending && state.kind === 'submitting')}
          className={cn(
            'ui-caps-md mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 transition-colors disabled:cursor-not-allowed',
            isExpected
              ? 'bg-rouge text-ivoire hover:bg-rouge-dark'
              : 'bg-encre/10 text-encre/40',
          )}
        >
          {pending && state.kind === 'submitting' && state.action === 'erasure' ? (
            <>
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              Programmation…
            </>
          ) : (
            <>
              <Trash2 className="size-4" aria-hidden="true" />
              Supprimer mon compte
            </>
          )}
        </button>
      </section>
    </div>
  );
}
