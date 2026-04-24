import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Avis',
};

export default async function AdminAvisPage() {
  return (
    <>
      <AdminPageHeader
        title="Avis clients"
        description="File de modération — pending → approved/rejected/spam. Réservé aux verified purchases."
      />
      <div className="px-8 py-10 md:px-12">
        <EmptyState
          icon={Star}
          title="Aucun avis en attente"
          description="Les avis sont demandés automatiquement 14 jours après l'expédition (Klaviyo flow post-purchase). Modération obligatoire avant publication. Schema.org Review + AggregateRating injectés sur fiche produit."
        />
      </div>
    </>
  );
}
