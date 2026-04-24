import type { Metadata } from 'next';
import { Building2, ExternalLink } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';

export const metadata: Metadata = {
  title: 'Fournisseurs',
};

export default async function AdminFournisseursPage() {
  return (
    <>
      <AdminPageHeader
        title="Fournisseurs"
        description="CJdropshipping (B2B), futurs ateliers européens partenaires."
        actions={
          <a
            href="https://app.cjdropshipping.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            CJ Dashboard
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        }
      />
      <div className="space-y-8 px-8 py-10 md:px-12">
        <section className="border-encre/10 bg-ivoire border p-6">
          <div className="flex items-start gap-5">
            <Building2 className="text-or-dark size-6" aria-hidden="true" />
            <div className="flex-1">
              <h2 className="font-display text-noir text-2xl font-medium">
                CJdropshipping — entrepôt CJPL Pologne
              </h2>
              <p className="text-encre/75 mt-2 text-sm">
                Fournisseur B2B principal. Entrepôt Pologne (CJPL) prioritaire pour éviter les
                douanes UE 2026. Délai cible 2-4 jours en France.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Statut" value="—" hint="Compte CJ B2B à ouvrir" />
                <StatCard label="Produits sync" value="0" subline="0 / 8 actifs" />
                <StatCard label="Commandes pushed" value="0" />
                <StatCard label="Délai moyen" value="—" hint="Mesure post-lancement" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-encre/15 bg-ivoire-light/50 border border-dashed p-6">
          <p className="ui-caps text-or-dark">À prévoir Sprint 6+</p>
          <h3 className="font-display text-noir mt-2 text-xl font-medium">Ateliers européens</h3>
          <p className="text-encre/75 mt-2 text-sm">
            Diversification fournisseurs : ateliers de confection français (Roubaix pour étuis) +
            partenaires italiens silicone médical certifié ISO 10993.
          </p>
        </section>
      </div>
    </>
  );
}
