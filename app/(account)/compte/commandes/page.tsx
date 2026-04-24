import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mes commandes',
  robots: { index: false, follow: false },
};

export default async function CommandesPage() {
  // TODO Sprint 4 : query orders WHERE customer_id = user.id ORDER BY created_at DESC
  const orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalCents: number;
    createdAt: Date;
    itemCount: number;
  }> = [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">Mes commandes</h2>
        <p className="text-encre/65 mt-2 text-sm">
          Historique complet de vos compositions Atelier Frisson.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="border-encre/10 bg-ivoire-light flex flex-col items-center gap-4 border py-16 text-center">
          <Package className="text-encre/30 size-10 stroke-[1.2]" aria-hidden="true" />
          <p className="font-italic-editorial text-encre/65">
            Aucune commande pour le moment — votre prochaine collection commence ici.
          </p>
          <Link
            href="/boutique"
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire mt-2 inline-flex items-center gap-2 border px-5 py-2.5 transition-colors"
          >
            Découvrir la collection
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id} className="border-encre/10 bg-ivoire border p-5">
              <Link
                href={`/compte/commandes/${order.id}`}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="ui-caps text-or-dark">Commande {order.orderNumber}</p>
                  <p className="font-display text-noir mt-1 text-lg">{order.itemCount} objets</p>
                </div>
                <ArrowRight className="text-encre/40 size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
