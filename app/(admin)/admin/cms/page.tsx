import type { Metadata } from 'next';
import { FileText, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'CMS',
};

export default async function AdminCmsPage() {
  return (
    <>
      <AdminPageHeader
        title="CMS éditorial"
        description="Articles blog Rituels + guides piliers + pages personnalisées. Éditeur TipTap MDX avec composants custom."
        actions={
          <button
            type="button"
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouvel article
          </button>
        }
      />
      <div className="px-8 py-10 md:px-12">
        <EmptyState
          icon={FileText}
          title="Aucun article publié"
          description="Sprint 6 livre l'éditeur TipTap complet (MDX, embeds produits, citations, schema.org Article). En attendant, les 3 articles de Sprint 6 sont rédigés en MDX statiques dans content/rituels/."
        />
      </div>
    </>
  );
}
