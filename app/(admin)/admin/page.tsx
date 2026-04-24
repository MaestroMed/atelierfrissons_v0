import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package, ShoppingBag, Users, Sparkles } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { getMockProducts } from '@/lib/mock/products';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function AdminDashboard() {
  const products = getMockProducts();
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const lowStock = products.filter((p) => p.stockStatus === 'low_stock').length;
  const featured = products.filter((p) => p.isFeatured).length;

  // TODO Sprint 5 : remplacer par queries Drizzle réelles + GSC + Klaviyo
  const stats = {
    revenueCents: 0,
    orders: 0,
    avgCart: 0,
    customers: 0,
    forgePagesPublished: 0,
    forgePagesPending: 0,
  };

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité Atelier Frisson — commandes, catalogue, contenu programmatique."
      />

      <div className="space-y-10 px-8 py-10 md:px-12">
        {/* KPIs ventes */}
        <section aria-labelledby="kpi-ventes">
          <h2 id="kpi-ventes" className="ui-caps text-or-dark mb-4">
            Ventes — 30 derniers jours
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Chiffre d'affaires"
              value={formatPriceCents(stats.revenueCents)}
              hint="Les commandes paid uniquement"
            />
            <StatCard
              label="Commandes"
              value={stats.orders.toString()}
              subline="0 en attente d'expédition"
            />
            <StatCard label="Panier moyen" value={formatPriceCents(stats.avgCart)} />
            <StatCard
              label="Nouveaux clients"
              value={stats.customers.toString()}
              hint="Magic-link signups"
            />
          </div>
        </section>

        {/* Catalogue */}
        <section aria-labelledby="kpi-catalogue">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="kpi-catalogue" className="ui-caps text-or-dark">
              Catalogue
            </h2>
            <Link
              href="/admin/produits"
              className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2"
            >
              Voir les produits
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Produits actifs"
              value={activeProducts.toString()}
              subline={`${products.length} au total`}
            />
            <StatCard
              label="Stock bas"
              value={lowStock.toString()}
              hint="< seuil de réapprovisionnement"
            />
            <StatCard
              label="Sélection signature"
              value={featured.toString()}
              subline="Mis en avant homepage"
            />
            <StatCard label="Sync CJ" value="—" hint="Brancher CJ B2B en Sprint 5" />
          </div>
        </section>

        {/* FORJA pSEO */}
        <section aria-labelledby="kpi-forge">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="kpi-forge" className="ui-caps text-or-dark">
              FORJA — pSEO
            </h2>
            <Link
              href="/admin/forge"
              className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2"
            >
              Gestion FORJA
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Pages publiées"
              value={stats.forgePagesPublished.toString()}
              subline="sur 1 200 prévues"
            />
            <StatCard
              label="En attente"
              value={stats.forgePagesPending.toString()}
              hint="Validation humaine requise"
            />
            <StatCard label="Indexées Google" value="—" hint="GSC non branché" />
            <StatCard label="Trafic 30j" value="—" hint="GSC non branché" />
          </div>
        </section>

        {/* Quick actions */}
        <section aria-labelledby="quick-actions">
          <h2 id="quick-actions" className="ui-caps text-or-dark mb-4">
            Actions rapides
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              icon={Package}
              title="Nouveau produit"
              description="Créer un objet manuellement ou importer depuis CJ."
              href="/admin/produits/nouveau"
            />
            <QuickAction
              icon={ShoppingBag}
              title="Commandes en attente"
              description="Lister les commandes à expédier vers le fournisseur."
              href="/admin/commandes?status=paid"
            />
            <QuickAction
              icon={Sparkles}
              title="Valider FORJA"
              description="Files pages pSEO en attente de validation humaine."
              href="/admin/forge?status=pending_review"
            />
            <QuickAction
              icon={Users}
              title="Segments clients"
              description="Top LTV, abandons panier, désabonnés newsletter."
              href="/admin/clients"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Package;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group border-encre/10 bg-ivoire hover:border-or hover:shadow-card flex flex-col gap-3 border p-5 transition-all"
    >
      <Icon className="text-or-dark size-5" aria-hidden="true" />
      <h3 className="font-display text-noir text-base font-medium">{title}</h3>
      <p className="text-encre/70 text-sm">{description}</p>
      <span className="ui-caps text-or-dark group-hover:text-or mt-auto inline-flex items-center gap-2 transition-all group-hover:gap-3">
        Ouvrir
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
