import type { Metadata } from 'next';
import { Users, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Clients',
};

export default async function AdminClientsPage() {
  // TODO Sprint 5 : query customers (filtre deletedAt IS NULL) + segments LTV
  return (
    <>
      <AdminPageHeader
        title="Clients"
        description="Profils, segments LTV, communications, droits RGPD."
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
        <EmptyState
          icon={Users}
          title="Aucun client enregistré"
          description="Les profils apparaîtront ici dès la première inscription via magic link Supabase. Sprint 5 : segments LTV, abandon panier, communications Klaviyo."
        />
      </div>
    </>
  );
}
