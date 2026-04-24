import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package, MapPin, Bell, ShieldCheck } from 'lucide-react';
import { getSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Tableau de bord',
  robots: { index: false, follow: false },
};

export default async function CompteDashboard() {
  const user = await getSession();
  if (!user) return null; // layout redirige déjà

  // TODO Sprint 4 : récupérer LTV + total_orders depuis customers table
  const stats = {
    totalOrders: 0,
    ltvCents: 0,
    addresses: 0,
    newsletter: false,
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Bandeau de bienvenue */}
      <section className="border-encre/10 bg-ivoire-light border p-8 md:p-10">
        <p className="ui-caps text-or-dark">Bienvenue</p>
        <h2 className="font-display text-noir mt-3 text-2xl font-medium md:text-3xl">
          Votre rituel personnel,{' '}
          <span className="font-italic-editorial text-or-dark">à votre rythme</span>
        </h2>
        <p className="text-encre/75 mt-4 max-w-xl text-sm md:text-base">
          Retrouvez ici l’historique de vos compositions, vos adresses de livraison, et les
          paramètres de votre compte. Toujours discret, toujours sécurisé.
        </p>
      </section>

      {/* Stats grid */}
      <section aria-label="Synthèse" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Commandes"
          value={stats.totalOrders.toString()}
          href="/compte/commandes"
          icon={Package}
        />
        <StatCard
          label="LTV"
          value={(stats.ltvCents / 100).toFixed(0) + ' €'}
          href="/compte/commandes"
          icon={Package}
        />
        <StatCard
          label="Adresses"
          value={stats.addresses.toString()}
          href="/compte/adresses"
          icon={MapPin}
        />
        <StatCard
          label="Newsletter"
          value={stats.newsletter ? 'Active' : 'Désactivée'}
          href="/compte/preferences"
          icon={Bell}
        />
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions" className="grid gap-4 md:grid-cols-2">
        <ActionCard
          title="Reprendre un rituel"
          description="Retrouvez les objets ajoutés à votre panier ou vos précédentes commandes."
          href="/compte/commandes"
          cta="Mes commandes"
        />
        <ActionCard
          title="Sécurité du compte"
          description="Activez l’authentification en deux étapes (TOTP) pour une protection maximale."
          href="/compte/securite"
          cta="Renforcer la sécurité"
          icon={ShieldCheck}
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: typeof Package;
}) {
  return (
    <Link
      href={href}
      className="group border-encre/10 bg-ivoire hover:border-or hover:shadow-card flex flex-col gap-3 border p-5 transition-all"
    >
      <Icon className="text-or-dark size-4" aria-hidden="true" />
      <p className="ui-caps text-encre/65">{label}</p>
      <p className="font-display tabular text-noir text-2xl font-medium">{value}</p>
    </Link>
  );
}

function ActionCard({
  title,
  description,
  href,
  cta,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon?: typeof Package;
}) {
  return (
    <Link
      href={href}
      className="group border-encre/10 bg-ivoire-light hover:border-or hover:shadow-card flex flex-col gap-3 border p-6 transition-all md:p-8"
    >
      {Icon ? <Icon className="text-or-dark size-5" aria-hidden="true" /> : null}
      <h3 className="font-display text-noir text-xl font-medium">{title}</h3>
      <p className="text-encre/75 text-sm">{description}</p>
      <span className="ui-caps text-or-dark group-hover:text-or mt-3 inline-flex items-center gap-2 transition-all group-hover:gap-3">
        {cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
