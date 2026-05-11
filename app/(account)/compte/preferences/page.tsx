import type { Metadata } from 'next';
import { Mail, Bell, Sparkles, Heart, Repeat, Users, Globe, Anchor } from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import { EmailPreferencesForm } from '@/components/account/EmailPreferencesForm';

export const metadata: Metadata = {
  title: 'Préférences',
  robots: { index: false, follow: false },
};

/**
 * Préférences emails groupées par flux Klaviyo.
 *
 * Conformément au RGPD art. 21 (opposition), chaque catégorie est désopt-in
 * indépendante. Le strictly-necessary (transactional) ne peut pas être désactivé
 * car il est nécessaire à l'exécution du contrat (commande, livraison).
 */
export default async function PreferencesPage() {
  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* HERO */}
      <section className="bg-ivoire-light border-encre/10 flex flex-col gap-3 border p-6 md:p-8">
        <Fleuron variant="divider" size="sm" color="or" className="opacity-70" />
        <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
          Vos préférences de correspondance
        </h2>
        <p className="text-encre/70 text-sm leading-relaxed">
          Choisissez le rythme et la nature des emails que vous recevez. Tous les changements sont
          appliqués immédiatement et synchronisés avec notre fournisseur Klaviyo.
        </p>
      </section>

      {/* Préférences emails — formulaire interactif */}
      <section id="emails" className="flex flex-col gap-5">
        <header className="flex items-center gap-3">
          <Mail className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">Emails marketing</h2>
        </header>
        <EmailPreferencesForm />
      </section>

      {/* Emails transactionnels — info uniquement */}
      <section className="border-encre/10 bg-ivoire-light flex flex-col gap-4 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <Bell className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">
            Emails transactionnels
          </h2>
        </header>
        <p className="text-encre/75 text-sm leading-relaxed">
          Les emails liés à vos commandes, abonnements et compte ne peuvent pas être désactivés —
          ils sont nécessaires à l'exécution de notre contrat (RGPD art. 6§1.b).
        </p>
        <ul className="border-encre/10 divide-encre/8 mt-2 divide-y border">
          <TransactionalRow
            icon={Bell}
            label="Confirmation de commande"
            note="Envoyé immédiatement après chaque commande."
          />
          <TransactionalRow
            icon={Repeat}
            label="Box mensuelle"
            note="Notification à l'expédition + tracking."
          />
          <TransactionalRow
            icon={Users}
            label="Parrainage récompensé"
            note="Quand un filleul passe sa première commande."
          />
          <TransactionalRow
            icon={Sparkles}
            label="Points fidélité"
            note="Récap mensuel + alerte expiration J-30."
          />
          <TransactionalRow
            icon={Heart}
            label="Sécurité compte"
            note="Connexion depuis un nouvel appareil, modification du mot de passe."
          />
        </ul>
      </section>

      {/* Préférences langue / locale */}
      <section className="border-encre/10 bg-ivoire flex flex-col gap-4 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <Globe className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">Langue & devise</h2>
        </header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="ui-caps text-encre/55 text-[10px] tracking-widest">Langue</p>
            <p className="font-display text-noir mt-1 text-base">Français (FR)</p>
            <p className="text-encre/55 text-xs">
              Une seule langue pour l'instant. Anglais (EN) prévu sprint Q3 2026.
            </p>
          </div>
          <div>
            <p className="ui-caps text-encre/55 text-[10px] tracking-widest">Devise</p>
            <p className="font-display text-noir mt-1 text-base">Euro (€)</p>
            <p className="text-encre/55 text-xs">
              Tous les prix sont affichés en euros TTC.
            </p>
          </div>
        </div>
      </section>

      {/* Confidentialité — lien vers RGPD */}
      <section className="border-encre/10 bg-ivoire-light flex items-start gap-3 border p-6">
        <Anchor className="text-or-dark mt-0.5 size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="font-display text-noir text-base font-medium">Aller plus loin</p>
          <p className="text-encre/70 mt-1 text-sm leading-relaxed">
            Pour exporter ou effacer vos données, ou modifier vos consentements cookies, rendez-vous
            sur la page{' '}
            <a
              href="/compte/donnees"
              className="text-or-dark underline underline-offset-4 hover:text-or"
            >
              Mes données (RGPD)
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function TransactionalRow({
  icon: Icon,
  label,
  note,
}: {
  icon: typeof Bell;
  label: string;
  note: string;
}) {
  return (
    <li className="bg-ivoire flex items-start gap-3 p-4">
      <Icon className="text-or-dark mt-0.5 size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
      <div className="flex-1">
        <p className="font-display text-noir text-sm font-medium">{label}</p>
        <p className="text-encre/65 mt-0.5 text-xs">{note}</p>
      </div>
      <span className="ui-caps bg-or/10 text-or-dark border-or/30 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]">
        Toujours actif
      </span>
    </li>
  );
}
