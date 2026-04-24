import type { Metadata } from 'next';
import { Plus, Tag } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Promotions',
};

export default async function AdminPromotionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Promotions"
        description="Codes promo, bundles BxGy, flash sales — limites d'usage par client."
        actions={
          <button
            type="button"
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouveau code
          </button>
        }
      />

      <div className="px-8 py-10 md:px-12">
        <EmptyState
          icon={Tag}
          title="Aucune promotion active"
          description="Créez votre premier code de réduction — pourcentage, montant fixe, livraison offerte ou bundle. Limites configurables par utilisation totale et par client."
        />
      </div>
    </>
  );
}
