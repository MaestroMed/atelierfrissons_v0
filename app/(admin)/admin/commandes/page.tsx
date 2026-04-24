import type { Metadata } from 'next';
import { ShoppingBag, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Commandes',
};

export default async function AdminCommandesPage() {
  // TODO Sprint 5 : query orders ORDER BY created_at DESC LIMIT 50
  const orders: Array<{
    id: string;
    orderNumber: string;
    customerEmail: string;
    status: string;
    totalCents: number;
    createdAt: Date;
  }> = [];

  return (
    <>
      <AdminPageHeader
        title="Commandes"
        description="Liste des commandes — filtres par statut, export CSV, push CJ."
        actions={
          <button
            type="button"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            <Download className="size-4" aria-hidden="true" />
            Exporter CSV
          </button>
        }
      />

      <div className="px-8 py-10 md:px-12">
        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Aucune commande pour le moment"
            description="Les commandes apparaîtront ici dès la première transaction. Le backend est prêt — il suffit que Stripe (test) ou CCBill (prod) confirme un paiement."
          />
        ) : null}
      </div>
    </>
  );
}
