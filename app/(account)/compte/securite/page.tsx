import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Clock,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import { TotpEnrollmentCard } from '@/components/account/TotpEnrollmentCard';

export const metadata: Metadata = {
  title: 'Sécurité du compte',
  robots: { index: false, follow: false },
};

/**
 * Page sécurité — méthodes de connexion + 2FA TOTP + sessions actives.
 *
 * En l'absence de TOTP enrollement live (Sprint admin uniquement à ce stade),
 * la carte Activer 2FA reste fonctionnelle pour le user — elle déclenche le
 * wizard `TotpEnrolWizard` (déjà existant pour admin) qui marche aussi côté
 * customer.
 */
export default async function SecuritePage() {
  // TODO : lire depuis la session le statut TOTP réel
  const totpEnabled = false;

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* HERO */}
      <section className="bg-ivoire-light border-encre/10 flex flex-col gap-3 border p-6 md:p-8">
        <Fleuron variant="divider" size="sm" color="or" className="opacity-70" />
        <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
          Sécurité du compte
        </h2>
        <p className="text-encre/70 text-sm leading-relaxed">
          Authentification, double facteur, sessions actives, journal de connexions.
        </p>
      </section>

      {/* TOTP Enrollment — section interactive */}
      <section id="2fa" className="flex flex-col gap-5">
        <header className="flex items-center gap-3">
          <Smartphone className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">
            Double authentification (2FA)
          </h2>
        </header>
        <TotpEnrollmentCard initiallyEnabled={totpEnabled} />
      </section>

      {/* Méthodes de connexion */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center gap-3">
          <KeyRound className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">
            Méthode de connexion
          </h2>
        </header>
        <div className="border-encre/10 bg-ivoire flex items-start gap-4 border p-5 md:p-6">
          <KeyRound className="text-or-dark mt-1 size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
          <div className="flex-1">
            <h3 className="font-display text-noir text-base font-medium">Lien magique</h3>
            <p className="text-encre/55 mt-0.5 text-xs">Méthode active</p>
            <p className="text-encre/75 mt-3 text-sm leading-relaxed">
              Connexion par lien unique envoyé à votre email. Pas de mot de passe à mémoriser, pas
              de risque de fuite. Ce lien expire 60 minutes après envoi et ne peut être utilisé
              qu'une seule fois.
            </p>
            <p className="text-encre/55 mt-3 text-xs leading-relaxed">
              Souhaitez-vous activer aussi un mot de passe classique ? Cette option sera disponible
              sprint Q3 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Sessions actives */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center gap-3">
          <Clock className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">Sessions actives</h2>
        </header>
        <div className="border-encre/10 bg-ivoire-light border p-5 md:p-6">
          <ul className="border-encre/10 divide-encre/8 divide-y border">
            <li className="bg-ivoire flex items-center justify-between gap-4 p-4">
              <div className="flex items-start gap-3">
                <span
                  className="bg-af-success size-2 mt-1.5 shrink-0 rounded-full"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-display text-noir text-sm font-medium">
                    Session courante
                  </p>
                  <p className="text-encre/55 text-xs">
                    Navigateur · Paris · IP terminée par .***.42
                  </p>
                  <p className="text-encre/45 text-[11px]">Dernière activité : maintenant</p>
                </div>
              </div>
              <span className="ui-caps bg-af-success/10 text-af-success border-af-success/30 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]">
                Active
              </span>
            </li>
          </ul>
          <form action="/auth/logout-all" method="post" className="mt-4">
            <button
              type="submit"
              className="ui-caps text-rouge hover:text-rouge-dark inline-flex items-center gap-2 text-[10px] underline underline-offset-4"
            >
              Se déconnecter de toutes les sessions
            </button>
          </form>
        </div>
      </section>

      {/* Journal de connexions */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center gap-3">
          <ShieldCheck className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">
            Journal de connexions
          </h2>
        </header>
        <div className="border-encre/10 bg-ivoire flex flex-col gap-3 border p-5 md:p-6">
          <p className="text-encre/75 text-sm leading-relaxed">
            Toutes les connexions de votre compte (réussies et échouées) sont stockées 30 jours
            pour la sécurité. Ces données ne sont consultables qu'à votre demande, conformément à
            la doctrine RGPD de minimisation.
          </p>
          <p className="text-encre/65 text-xs">
            Pour récupérer le journal complet, utilisez l'export DSAR depuis{' '}
            <Link
              href="/compte/donnees"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              Mes données
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Suspicious activity callout */}
      <section className="border-rouge/30 bg-rouge/5 flex items-start gap-3 border p-5">
        <AlertTriangle
          className="text-rouge mt-0.5 size-4 shrink-0"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <div className="flex-1">
          <p className="font-display text-noir text-base font-medium">
            Activité suspecte ?
          </p>
          <p className="text-encre/75 mt-1 text-sm leading-relaxed">
            Si vous suspectez une connexion non-autorisée à votre compte, déconnectez-vous de
            toutes les sessions ci-dessus et écrivez immédiatement à{' '}
            <a
              href="mailto:securite@atelierfrisson.fr"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              securite@atelierfrisson.fr
            </a>
            . Réponse sous 4h en jours ouvrés.
          </p>
        </div>
      </section>

      {/* Suppression compte */}
      <section className="border-encre/10 bg-ivoire-light flex items-start gap-3 border p-6">
        <Trash2 className="text-encre/55 mt-0.5 size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="font-display text-noir text-base font-medium">
            Suppression définitive
          </p>
          <p className="text-encre/65 mt-1 text-sm leading-relaxed">
            Pour supprimer définitivement votre compte (RGPD art. 17), rendez-vous sur la page{' '}
            <Link
              href="/compte/donnees"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              Mes données
            </Link>
            . Délai de grâce 30 jours pour annuler.
          </p>
        </div>
      </section>
    </div>
  );
}
