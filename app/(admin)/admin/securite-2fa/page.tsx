import type { Metadata } from 'next';
import { ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { TotpEnrolWizard } from '@/components/admin/TotpEnrolWizard';

export const metadata: Metadata = {
  title: 'Sécurité — 2FA',
};

/**
 * Page admin de gestion du 2FA.
 *
 * V1 (cette page) : permet d'activer la 2FA TOTP via wizard 4 étapes.
 * Le secret est stocké en cookie httpOnly pendant l'enrôlement, puis
 * loggé dans audit_log. Sprint 4 : persistance dans `admin_users.
 * two_factor_secret` (chiffré applicatif) + `recovery_codes` hashés.
 *
 * V2 (Sprint 4) : challenge à la connexion, gestion révocation,
 * visualisation des sessions actives, alertes nouvelle IP.
 */
export default function AdminSecurite2FAPage() {
  return (
    <>
      <AdminPageHeader
        title="Authentification à deux facteurs"
        description="Renforce la sécurité du compte admin avec un code à 6 chiffres généré toutes les 30 secondes par votre app authenticator."
      />

      <div className="max-w-3xl px-8 py-8 md:px-12">
        {/* Pourquoi le 2FA */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <Pillar
            icon={ShieldCheck}
            title="Sécurité réelle"
            body="Même si votre mot de passe fuit, l'attaquant a besoin de votre téléphone."
          />
          <Pillar
            icon={KeyRound}
            title="Standard ouvert"
            body="TOTP RFC 6238 — compatible Google Authenticator, Authy, 1Password, Bitwarden."
          />
          <Pillar
            icon={AlertTriangle}
            title="Codes de secours"
            body="10 codes uniques générés à l'enrôlement, en cas de perte du téléphone."
          />
        </section>

        <TotpEnrolWizard />

        {/* Note de fin */}
        <div className="border-encre/10 bg-ivoire-light/40 border-l-or mt-10 border-l-2 p-5 text-sm">
          <p className="ui-caps text-or-dark mb-2 text-[10px]">Note</p>
          <p className="text-encre/75 leading-relaxed">
            En l&rsquo;absence de DB Supabase configurée, l&rsquo;enrôlement valide le code mais ne
            persiste ni le secret ni les codes de récupération en base. Les actions sont tracées
            dans l&rsquo;audit log applicatif. Sprint 4 : persistance complète dans{' '}
            <code className="bg-ivoire border-encre/15 border px-1 text-xs">
              admin_users.two_factor_secret
            </code>{' '}
            + challenge à la connexion via Supabase Auth MFA.
          </p>
        </div>
      </div>
    </>
  );
}

function Pillar({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <div className="border-encre/10 bg-ivoire flex flex-col gap-3 border p-5">
      <Icon className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
      <h3 className="font-display text-noir text-base font-medium">{title}</h3>
      <p className="text-encre/70 text-xs leading-relaxed">{body}</p>
    </div>
  );
}
