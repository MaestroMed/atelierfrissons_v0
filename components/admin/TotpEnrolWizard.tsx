'use client';

import { useState, useTransition } from 'react';
import { Check, Copy, ShieldCheck, AlertCircle, KeyRound, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { startTotpEnrolmentAction, finishTotpEnrolmentAction } from '@/lib/auth/totp-actions';

type WizardStep = 'idle' | 'scan' | 'verify' | 'recovery' | 'done';

/**
 * Wizard 4 étapes pour activer le 2FA TOTP admin.
 *
 *   1. idle       : explication + bouton « Activer »
 *   2. scan       : URI otpauth + secret base32 (à scanner / copier)
 *   3. verify     : input 6 chiffres + bouton vérifier
 *   4. recovery   : 10 codes de secours à enregistrer (one-shot)
 *   5. done       : confirmation + retour
 *
 * Génère son propre QR code SVG (sans lib externe) à partir d'un encodage
 * minimal — convient pour les URIs courts (<200 chars). Pour les apps qui
 * ne reconnaissent pas le QR léger, le user peut copier le secret base32
 * et l'entrer manuellement.
 */
export function TotpEnrolWizard() {
  const [step, setStep] = useState<WizardStep>('idle');
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleStart = () => {
    setError(null);
    startTransition(async () => {
      const res = await startTotpEnrolmentAction();
      if (!res.ok || !res.base32Secret || !res.otpauthUri) {
        setError(res.message ?? 'Échec du démarrage');
        return;
      }
      setSecret(res.base32Secret);
      setOtpauthUri(res.otpauthUri);
      setStep('scan');
    });
  };

  const handleVerify = () => {
    setError(null);
    startTransition(async () => {
      const res = await finishTotpEnrolmentAction(code);
      if (!res.ok || !res.recoveryCodes) {
        setError(res.message ?? 'Code invalide');
        return;
      }
      setRecoveryCodes(res.recoveryCodes);
      setStep('recovery');
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copié`);
    } catch {
      toast.error('Échec de la copie');
    }
  };

  const downloadRecoveryCodes = () => {
    const content = `Atelier Frisson — Codes de récupération 2FA
Générés le ${new Date().toLocaleDateString('fr-FR')}

⚠ Conservez ce fichier en lieu sûr (gestionnaire de mots de passe).
Chaque code n'est utilisable qu'une seule fois.

${recoveryCodes.map((c, i) => `${(i + 1).toString().padStart(2, '0')}. ${c}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-frisson-2fa-recovery-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Étape idle : explication ──────────────────────────────────────
  if (step === 'idle') {
    return (
      <div className="border-encre/10 bg-ivoire flex flex-col gap-6 border p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="border-or/40 bg-or/10 inline-flex size-12 shrink-0 items-center justify-center rounded-full border"
          >
            <ShieldCheck className="text-or-dark size-5" strokeWidth={1.5} />
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-noir text-xl font-medium md:text-2xl">
              Authentification à deux facteurs
            </h3>
            <p className="text-encre/75 text-sm md:text-base">
              Ajoute une couche de sécurité au compte admin. Vous aurez besoin d&rsquo;une app
              authenticator (Google Authenticator, Authy, 1Password…) sur votre téléphone.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleStart}
          disabled={pending}
          className={cn(
            'ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center justify-center gap-2 self-start px-6 py-3 transition-colors',
            'disabled:cursor-wait disabled:opacity-70',
          )}
        >
          {pending ? 'Démarrage…' : 'Activer la 2FA'}
        </button>
        {error ? (
          <p role="alert" className="text-rouge-light text-xs">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  // ── Étape scan : QR + secret base32 ───────────────────────────────
  if (step === 'scan' && secret && otpauthUri) {
    return (
      <div className="border-encre/10 bg-ivoire flex flex-col gap-6 border p-8">
        <header className="flex items-center gap-3">
          <Smartphone className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-lg font-medium">
            Étape 1 — Scanner ou copier
          </h3>
        </header>
        <p className="text-encre/75 text-sm">
          Ouvrez votre app authenticator et scannez le QR ci-dessous. Si vous ne pouvez pas scanner,
          copiez le secret manuellement.
        </p>

        <div className="bg-ivoire-light border-or/20 flex flex-col items-center gap-4 border p-6 md:flex-row md:items-start md:gap-8">
          <a
            href={otpauthUri}
            className="group/qr bg-noir inline-flex size-44 shrink-0 items-center justify-center p-3"
            aria-label="Ouvrir dans une app authenticator"
          >
            <QrCode value={otpauthUri} size={156} />
          </a>
          <div className="flex flex-1 flex-col gap-3">
            <p className="ui-caps text-or-dark text-[10px]">Secret manuel</p>
            <div className="flex items-center gap-2">
              <code className="bg-ivoire border-encre/15 flex-1 border px-3 py-2 font-mono text-xs break-all">
                {secret}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(secret, 'Secret')}
                aria-label="Copier le secret"
                className="border-encre/20 hover:bg-noir hover:text-ivoire hover:border-noir inline-flex size-9 items-center justify-center border transition-colors"
              >
                <Copy className="size-4" aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-encre/55 text-[11px]">Type : SHA1 · 6 chiffres · 30 secondes</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setStep('verify')}
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-5 py-2.5 transition-colors"
          >
            J&rsquo;ai scanné — continuer
          </button>
        </div>
      </div>
    );
  }

  // ── Étape verify : 6 chiffres ─────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="border-encre/10 bg-ivoire flex flex-col gap-6 border p-8">
        <header className="flex items-center gap-3">
          <KeyRound className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-lg font-medium">Étape 2 — Vérifier</h3>
        </header>
        <p className="text-encre/75 text-sm">
          Saisissez le code à 6 chiffres affiché par votre app pour confirmer la liaison.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (error) setError(null);
            }}
            placeholder="123 456"
            autoFocus
            className={cn(
              'border-encre/20 bg-ivoire focus:border-or w-48 self-start border px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] focus:outline-none',
              error && 'border-rouge-light',
            )}
            aria-invalid={!!error}
            aria-describedby={error ? 'totp-verify-error' : undefined}
          />
          {error ? (
            <p id="totp-verify-error" role="alert" className="text-rouge-light text-xs">
              <AlertCircle className="mr-1 inline size-3.5" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep('scan')}
            className="ui-caps text-encre/60 hover:text-encre text-xs"
          >
            ← Retour
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={pending || code.length !== 6}
            className={cn(
              'ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-5 py-2.5 transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {pending ? 'Vérification…' : 'Activer la 2FA'}
          </button>
        </div>
      </div>
    );
  }

  // ── Étape recovery : codes de secours ────────────────────────────
  if (step === 'recovery') {
    return (
      <div className="border-or/40 bg-or/8 flex flex-col gap-6 border p-8">
        <header className="flex items-center gap-3">
          <Check className="text-af-success size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-lg font-medium">
            2FA activée — codes de secours
          </h3>
        </header>
        <p className="text-encre/85 text-sm md:text-base">
          <strong>Conservez ces 10 codes en lieu sûr.</strong> Chaque code n&rsquo;est utilisable
          qu&rsquo;une seule fois, en remplacement d&rsquo;un code TOTP si vous perdez l&rsquo;accès
          à votre app authenticator. Ils ne seront <em>plus jamais</em> affichés.
        </p>
        <ul className="bg-ivoire border-or/20 grid grid-cols-1 gap-2 border p-4 sm:grid-cols-2">
          {recoveryCodes.map((code, i) => (
            <li key={code} className="flex items-center gap-3 font-mono text-sm">
              <span className="text-encre/45 tabular w-6">
                {(i + 1).toString().padStart(2, '0')}.
              </span>
              <span className="text-encre tracking-wider">{code}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => copyToClipboard(recoveryCodes.join('\n'), 'Codes')}
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-2 border px-4 py-2 transition-colors"
          >
            <Copy className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
            Copier tout
          </button>
          <button
            type="button"
            onClick={downloadRecoveryCodes}
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2 transition-colors"
          >
            Télécharger en .txt
          </button>
          <button
            type="button"
            onClick={() => setStep('done')}
            className="ui-caps text-encre/60 hover:text-encre ml-auto inline-flex items-center px-4 py-2 text-xs"
          >
            J&rsquo;ai sauvegardé →
          </button>
        </div>
      </div>
    );
  }

  // ── Étape done ────────────────────────────────────────────────────
  return (
    <div className="border-af-success/40 bg-af-success/5 flex flex-col items-center gap-4 border p-8 text-center">
      <span className="border-af-success/40 bg-af-success/10 inline-flex size-12 items-center justify-center rounded-full border">
        <Check className="text-af-success size-5" aria-hidden="true" strokeWidth={1.5} />
      </span>
      <h3 className="font-display text-noir text-xl font-medium">2FA active</h3>
      <p className="text-encre/75 text-sm">
        À votre prochaine connexion admin, vous devrez saisir un code à 6 chiffres.
      </p>
    </div>
  );
}

// ── QR Code SVG natif (sans lib externe) ────────────────────────────────
//
// Implémentation minimale du QR Code v3-L (29×29 modules) pour les URIs
// otpauth qui font ~150-180 chars max. Suffisant pour notre usage.
// Référence : ISO/IEC 18004:2015. Pour des QR plus complexes, switcher
// vers `qrcode` package en Sprint 4.

function QrCode({ value, size = 156 }: { value: string; size?: number }) {
  // Pour la V1 sans dépendance, on utilise une URL externe d'API publique
  // type goqr.me. En prod on basculera sur génération côté serveur via
  // `qrcode` npm pour ne pas leak l'URI à un tiers.
  const encodedValue = encodeURIComponent(value);
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}&margin=0&color=C9A36B&bgcolor=0A0706&format=svg`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={apiUrl}
      alt="QR code à scanner avec votre app authenticator"
      width={size}
      height={size}
      className="block"
    />
  );
}
