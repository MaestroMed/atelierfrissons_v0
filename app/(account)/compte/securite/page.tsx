import type { Metadata } from 'next';
import { ShieldCheck, KeyRound, Smartphone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sécurité du compte',
  robots: { index: false, follow: false },
};

export default async function SecuritePage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
          Sécurité du compte
        </h2>
        <p className="text-encre/65 mt-2 text-sm">
          Authentification, sessions actives, journal de connexions.
        </p>
      </header>

      <section className="space-y-4">
        <SecurityCard
          icon={KeyRound}
          title="Méthode de connexion"
          status="Lien magique (e-mail)"
          description="Connexion par lien unique envoyé à votre adresse e-mail. Pas de mot de passe à mémoriser."
          ctaLabel="Activer aussi un mot de passe"
          disabled
        />
        <SecurityCard
          icon={Smartphone}
          title="Double authentification (2FA)"
          status="Désactivée"
          description="Application TOTP (Authy, Google Authenticator, 1Password). Recommandée pour les comptes avec historique de commandes."
          ctaLabel="Activer la 2FA"
          disabled
        />
        <SecurityCard
          icon={Clock}
          title="Sessions actives"
          status="1 session active"
          description="Cette session uniquement. Vous pouvez vous déconnecter de toutes les sessions à distance."
          ctaLabel="Se déconnecter partout"
          disabled
        />
        <SecurityCard
          icon={ShieldCheck}
          title="Journal de connexions"
          status="Disponible sur demande"
          description="Historique des 30 dernières connexions (IP, user-agent, date). Disponible sur simple demande à contact@atelierfrisson.fr."
          ctaLabel="Demander le journal"
          disabled
        />
      </section>

      <div className="border-or/30 bg-or/5 text-encre/85 border p-5 text-sm">
        <p className="font-display text-noir text-base">Conformité RGPD</p>
        <p className="mt-2">
          Vous pouvez exporter ou supprimer toutes vos données personnelles depuis cette page.
          L’export se fait au format CSV ; la suppression est immédiate (puis hard-delete sous 30
          jours, conformément au registre des traitements).
        </p>
      </div>
    </div>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  status,
  description,
  ctaLabel,
  disabled,
}: {
  icon: typeof ShieldCheck;
  title: string;
  status: string;
  description: string;
  ctaLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="border-encre/10 bg-ivoire flex flex-col gap-4 border p-5 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <Icon className="text-or-dark mt-1 size-4 shrink-0" aria-hidden="true" />
        <div>
          <h3 className="font-display text-noir text-base font-medium">{title}</h3>
          <p className="text-encre/65 mt-1 text-sm">{status}</p>
          <p className="text-encre/75 mt-2 text-sm">{description}</p>
        </div>
      </div>
      <button
        type="button"
        disabled={disabled}
        className="ui-caps border-encre/20 text-encre/70 hover:border-or hover:text-or shrink-0 self-start border px-4 py-2 transition-colors disabled:opacity-50"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
