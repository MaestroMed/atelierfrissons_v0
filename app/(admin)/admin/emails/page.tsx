import type { Metadata } from 'next';
import { Mail, ExternalLink } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Emails',
};

const TEMPLATES = [
  { name: 'OrderConfirmation', sent: 0, status: 'Prêt' },
  { name: 'Welcome', sent: 0, status: 'Prêt' },
  { name: 'ShippingNotification', sent: 0, status: 'Sprint 4' },
  { name: 'PasswordReset', sent: 0, status: 'Supabase Auth natif' },
  { name: 'MagicLink', sent: 0, status: 'Supabase Auth natif' },
  { name: 'AbandonedCart', sent: 0, status: 'Klaviyo flow' },
] as const;

export default async function AdminEmailsPage() {
  return (
    <>
      <AdminPageHeader
        title="Emails transactionnels"
        description="Templates Resend + React Email. Logs d'envoi + statut delivery (open/click/bounce)."
        actions={
          <a
            href="https://resend.com/emails"
            target="_blank"
            rel="noopener noreferrer"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            Ouvrir Resend
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        }
      />
      <div className="space-y-8 px-8 py-10 md:px-12">
        <section>
          <h2 className="ui-caps text-or-dark mb-4">Volume 30j</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Envoyés" value="0" hint="Resend non configuré" />
            <StatCard label="Délivrés" value="0" />
            <StatCard label="Ouverts" value="0" subline="Open rate moyen" />
            <StatCard label="Bounces" value="0" hint="Hard + soft" />
          </div>
        </section>

        <section>
          <h2 className="ui-caps text-or-dark mb-4">Templates</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {TEMPLATES.map((t) => (
              <li
                key={t.name}
                className="border-encre/10 bg-ivoire flex items-center justify-between border p-5"
              >
                <div className="flex items-center gap-4">
                  <Mail className="text-or-dark size-4" aria-hidden="true" />
                  <div>
                    <p className="font-display text-noir text-base font-medium">{t.name}</p>
                    <p className="text-encre/65 mt-0.5 text-xs">{t.status}</p>
                  </div>
                </div>
                <span className="ui-caps tabular text-encre/65">{t.sent} envoyés</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="ui-caps text-or-dark mb-4">Logs récents</h2>
          <EmptyState
            icon={Mail}
            title="Aucun email envoyé"
            description="Les logs d'envoi apparaîtront ici dès que RESEND_API_KEY est configuré et qu'une commande est passée."
          />
        </section>
      </div>
    </>
  );
}
