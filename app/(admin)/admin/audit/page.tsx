import type { Metadata } from 'next';
import { ScrollText, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Audit log',
};

export default async function AdminAuditPage() {
  return (
    <>
      <AdminPageHeader
        title="Journal d'audit"
        description="Append-only — chaque action sur la base est tracée. Lecture restreinte au rôle owner."
        actions={
          <button
            type="button"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            <Download className="size-4" aria-hidden="true" />
            Export 90 jours
          </button>
        }
      />
      <div className="px-8 py-10 md:px-12">
        <EmptyState
          icon={ScrollText}
          title="Journal vide"
          description="Toute action admin (création produit, validation FORJA, refund, modification utilisateur, etc.) sera tracée ici avec actor_id, IP, user-agent, before/after JSON. Conservation 90 jours rolling."
        />
      </div>
    </>
  );
}
