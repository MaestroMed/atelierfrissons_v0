import type { Metadata } from 'next';
import { CreditCard, FileText, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Finances',
};

export default async function AdminFinancesPage() {
  return (
    <>
      <AdminPageHeader
        title="Finances"
        description="TVA, factures, refunds, export comptable. Format conforme L223-1 (mentions obligatoires)."
        actions={
          <button
            type="button"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            <Download className="size-4" aria-hidden="true" />
            Export FEC mois
          </button>
        }
      />
      <div className="space-y-10 px-8 py-10 md:px-12">
        <section>
          <h2 className="ui-caps text-or-dark mb-4">Mois en cours</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="CA HT" value="0 €" hint="hors TVA 20 %" />
            <StatCard label="TVA collectée" value="0 €" subline="à reverser DGFIP" />
            <StatCard label="CA TTC" value="0 €" />
            <StatCard label="Refunds" value="0 €" hint="0 commandes" />
          </div>
        </section>

        <section>
          <h2 className="ui-caps text-or-dark mb-4">Factures émises</h2>
          <EmptyState
            icon={FileText}
            title="Aucune facture pour le moment"
            description="Les factures sont générées automatiquement à chaque commande payée — PDF stocké dans Supabase Storage, mentions légales SASU + TVA conformes."
          />
        </section>

        <section className="border-or/30 bg-or/5 border p-5">
          <h3 className="font-display text-noir flex items-center gap-2 text-lg font-medium">
            <CreditCard className="text-or-dark size-4" aria-hidden="true" />
            Provider de paiement
          </h3>
          <p className="text-encre/75 mt-2 text-sm">
            <strong>Dev :</strong> Stripe TEST uniquement (jamais de vraie transaction —
            bannissement compte garanti pour secteur adulte). <strong>Prod :</strong> CCBill
            FlexForms après K-Bis SASU (onboarding 2-5 sem).
          </p>
        </section>
      </div>
    </>
  );
}
