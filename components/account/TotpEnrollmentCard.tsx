'use client';

import { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TotpEnrollmentCardProps {
  initiallyEnabled: boolean;
}

type Step = 'idle' | 'enroll-qr' | 'enroll-verify' | 'enrolled' | 'disable-confirm';

interface PendingEnrollment {
  secret: string;
  qrDataUrl: string;
  recoveryCodes: readonly string[];
}

/**
 * Wizard d'enrollment TOTP pour les comptes client.
 *
 * Workflow :
 *   1. Idle (TOTP désactivé) → bouton « Activer la 2FA »
 *   2. Step QR : on appelle Server Action `generateTotpSecret()` qui retourne
 *      QR data-URL + secret + 6 codes de récupération
 *   3. Step Verify : user scanne avec son authenticator (Authy, Google Authenticator,
 *      1Password) et entre un code TOTP de vérification
 *   4. Server Action valide, persiste secret hashé, retourne success
 *   5. Page recharge avec status enabled
 *
 * Le code TOTP existe déjà côté admin (RFC 6238 natif Web Crypto, sans dépendance
 * npm — cf. lib/auth/totp.ts). On réutilise tel quel.
 */
export function TotpEnrollmentCard({ initiallyEnabled }: TotpEnrollmentCardProps) {
  const [step, setStep] = useState<Step>(initiallyEnabled ? 'enrolled' : 'idle');
  const [pendingEnrollment, _setPending] = useState<PendingEnrollment | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Stub : la génération de secret se fait côté server (lib/auth/totp.ts existe)
  async function startEnrollment() {
    setError(null);
    setStep('enroll-qr');
    // TODO : await generateTotpEnrollmentAction()
    //   → setPendingEnrollment({ secret, qrDataUrl, recoveryCodes })
  }

  async function verifyCode() {
    if (!/^\d{6}$/.test(verificationCode)) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }
    setError(null);
    // TODO : await verifyTotpEnrollmentAction({ code: verificationCode })
    //   → setStep('enrolled')
    setStep('enrolled');
  }

  async function disable() {
    // TODO : await disableTotpAction({ confirmCurrentTotp: '...' })
    setStep('idle');
  }

  if (step === 'enrolled') {
    return (
      <div className="bg-or/8 border-or/30 flex flex-col gap-4 border p-5 md:p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-base font-medium">2FA active</h3>
          <span className="ui-caps bg-af-success/15 text-af-success border-af-success/40 ml-auto inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]">
            <CheckCircle2 className="size-3" aria-hidden="true" />
            Activée
          </span>
        </div>
        <p className="text-encre/75 text-sm leading-relaxed">
          Votre compte est protégé par un code TOTP à 6 chiffres généré toutes les 30 secondes par
          votre application d'authentification.
        </p>
        <div className="border-encre/10 grid grid-cols-1 gap-3 border-t pt-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setStep('disable-confirm')}
            className="ui-caps text-rouge hover:text-rouge-dark border-rouge/30 hover:border-rouge inline-flex items-center justify-center gap-2 border px-4 py-2 text-[10px] transition-colors"
          >
            Désactiver la 2FA
          </button>
          <button
            type="button"
            className="ui-caps border-encre/15 text-encre/75 hover:border-or hover:text-or-dark inline-flex items-center justify-center gap-2 border px-4 py-2 text-[10px] transition-colors"
          >
            Régénérer codes de récupération
          </button>
        </div>

        {step === ('disable-confirm' as Step) ? (
          <div className="border-rouge/30 bg-rouge/5 mt-3 flex flex-col gap-3 border p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="text-rouge mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-display text-noir text-sm font-medium">
                  Confirmer la désactivation
                </p>
                <p className="text-encre/75 mt-1 text-xs leading-relaxed">
                  Désactiver la 2FA réduit la sécurité de votre compte. Pour confirmer, entrez un
                  code TOTP courant.
                </p>
              </div>
            </div>
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]{6}"
              placeholder="123 456"
              className="bg-ivoire border-rouge/30 focus:border-rouge text-encre placeholder:text-encre/40 tabular border px-3 py-2 text-center font-mono text-lg outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('enrolled')}
                className="ui-caps text-encre/65 hover:text-encre flex-1 px-4 py-2 text-[10px] underline underline-offset-4"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={disable}
                className="ui-caps bg-rouge text-ivoire hover:bg-rouge-dark flex-1 px-4 py-2 text-[10px]"
              >
                Confirmer la désactivation
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (step === 'enroll-qr' || step === 'enroll-verify') {
    return (
      <div className="border-or/30 bg-or/5 flex flex-col gap-5 border p-5 md:p-6">
        <header className="flex items-center gap-3">
          <Smartphone className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h3 className="font-display text-noir text-base font-medium">
            Activer la double authentification
          </h3>
        </header>

        <ol className="text-encre/85 list-decimal space-y-3 pl-5 text-sm">
          <li>
            Installez une application d'authentification :{' '}
            <a
              href="https://authy.com/"
              target="_blank"
              rel="noreferrer"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              Authy
            </a>
            ,{' '}
            <a
              href="https://1password.com/"
              target="_blank"
              rel="noreferrer"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              1Password
            </a>
            , Google Authenticator, ou similaire.
          </li>
          <li>
            Scannez le QR code ci-dessous avec votre application (ou copiez le secret manuellement).
          </li>
          <li>Entrez le code à 6 chiffres généré par l'application pour valider.</li>
        </ol>

        {/* QR + secret */}
        <div className="border-encre/10 bg-ivoire grid grid-cols-1 gap-5 border p-5 md:grid-cols-[auto_1fr]">
          <div className="flex items-center justify-center">
            {pendingEnrollment?.qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pendingEnrollment.qrDataUrl}
                alt="QR code TOTP"
                className="size-40"
              />
            ) : (
              <div className="border-encre/15 bg-ivoire-light flex size-40 items-center justify-center border text-xs text-encre/55 text-center p-2">
                QR code généré côté serveur
                <br />
                (stub — Server Action à brancher)
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <p className="ui-caps text-encre/55 text-[10px] tracking-widest">
              Ou entrez ce secret manuellement
            </p>
            <div className="bg-ivoire-light border-encre/15 flex items-center justify-between border p-3">
              <code className="font-mono text-sm tracking-wider">
                {pendingEnrollment?.secret ?? 'STUB-XXXX-XXXX-XXXX'}
              </code>
              <button
                type="button"
                onClick={() => {
                  if (pendingEnrollment?.secret) {
                    void navigator.clipboard.writeText(pendingEnrollment.secret);
                  }
                }}
                className="text-encre/55 hover:text-or-dark"
                aria-label="Copier le secret"
              >
                <Copy className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-encre/55 text-xs leading-relaxed">
              Ne partagez jamais ce secret. Toute personne y ayant accès peut générer vos codes
              TOTP.
            </p>
          </div>
        </div>

        {/* Verification */}
        <div className="flex flex-col gap-3">
          <label htmlFor="totp-code" className="ui-caps text-encre/65 text-[10px] tracking-widest">
            Code à 6 chiffres
          </label>
          <input
            id="totp-code"
            type="text"
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]{6}"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123 456"
            className={cn(
              'bg-ivoire border focus:border-or-dark text-encre placeholder:text-encre/30 tabular px-4 py-3 text-center font-mono text-2xl tracking-wider outline-none',
              error ? 'border-rouge/40' : 'border-encre/20',
            )}
          />
          {error ? (
            <p className="text-rouge inline-flex items-center gap-1.5 text-xs" role="alert">
              <AlertTriangle className="size-3" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep('idle')}
            className="ui-caps text-encre/65 hover:text-encre flex-1 px-4 py-3 text-[10px] underline underline-offset-4"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={verifyCode}
            disabled={verificationCode.length !== 6}
            className="ui-caps bg-noir text-ivoire hover:bg-rouge flex-1 px-6 py-3 text-[11px] disabled:opacity-50"
          >
            Vérifier & activer
          </button>
        </div>
      </div>
    );
  }

  // step === 'idle'
  return (
    <div className="border-encre/10 bg-ivoire flex flex-col gap-4 border p-5 md:flex-row md:items-start md:justify-between md:p-6">
      <div className="flex items-start gap-4">
        <Smartphone className="text-or-dark mt-1 size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
        <div>
          <h3 className="font-display text-noir text-base font-medium">
            Pas encore activée
          </h3>
          <p className="text-encre/75 mt-2 text-sm leading-relaxed">
            La 2FA ajoute une seconde couche de sécurité : un code à 6 chiffres requis à chaque
            connexion, en plus du lien magique. Recommandée pour les comptes avec historique de
            commandes.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={startEnrollment}
        className="ui-caps bg-noir text-ivoire hover:bg-rouge inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-[11px] transition-colors"
      >
        Activer la 2FA
      </button>
    </div>
  );
}
