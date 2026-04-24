import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, Truck, CheckCircle2 } from 'lucide-react';
import { formatPriceCents, formatDate } from '@/lib/format';
import { Fleuron } from '@/components/layout/Fleuron';

export const metadata: Metadata = {
  title: 'Détail de commande',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ orderId: string }>;
}

/**
 * Détail d'une commande client. Sprint 8 : query réelle DB filtrée par
 * customer_id = user.id. Pour l'instant, fallback sur un mock minimal
 * si l'orderId suit le format AF-YYYY-NNNNNN.
 */
export default async function CommandeDetailPage({ params }: PageProps) {
  const { orderId } = await params;

  // Validation format basique
  if (!/^AF-\d{4}-\d{6}$/.test(orderId)) notFound();

  type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  // Mock data — Sprint 8 : query orders + order_items réelle
  const order: {
    orderNumber: string;
    status: OrderStatus;
    createdAt: Date;
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
    items: Array<{ name: string; quantity: number; unitPriceCents: number; slug: string }>;
    shippingAddress: { line1: string; postalCode: string; city: string; country: string };
    carrier: string | null;
    trackingNumber: string | null;
  } = {
    orderNumber: orderId,
    status: 'paid',
    createdAt: new Date(),
    subtotalCents: 21800,
    shippingCents: 0,
    totalCents: 21800,
    items: [
      { name: 'Premier Frisson', quantity: 1, unitPriceCents: 8900, slug: 'premier-frisson' },
      { name: 'Velours Rouge', quantity: 1, unitPriceCents: 12900, slug: 'velours-rouge' },
    ],
    shippingAddress: {
      line1: '12 rue de la Maison',
      postalCode: '75011',
      city: 'Paris',
      country: 'France',
    },
    carrier: 'Colissimo',
    trackingNumber: null,
  };

  const statusSteps = [
    {
      key: 'paid',
      label: 'Confirmée',
      icon: CheckCircle2,
      date: formatDate(order.createdAt),
      done: true,
    },
    {
      key: 'processing',
      label: 'En préparation',
      icon: Package,
      date: 'Sous 24h',
      done:
        order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered',
    },
    {
      key: 'shipped',
      label: 'Expédiée',
      icon: Truck,
      date: '2-4 jours',
      done: order.status === 'shipped' || order.status === 'delivered',
    },
  ] as const;

  return (
    <div className="flex flex-col gap-10">
      <Link
        href="/compte/commandes"
        className="ui-caps text-encre/65 hover:text-or-dark inline-flex items-center gap-2 self-start"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Retour aux commandes
      </Link>

      <header className="flex flex-col gap-2">
        <p className="ui-caps text-or-dark">Commande</p>
        <h2 className="font-display tabular text-noir text-3xl font-medium md:text-4xl">
          {order.orderNumber}
        </h2>
        <p className="text-encre/65 text-sm">Passée le {formatDate(order.createdAt)}</p>
      </header>

      {/* Timeline */}
      <section
        aria-labelledby="timeline"
        className="border-encre/10 bg-ivoire-light border p-6 md:p-8"
      >
        <h3 id="timeline" className="ui-caps text-or-dark">
          Progression
        </h3>
        <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {statusSteps.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.key}
                className={`flex flex-col gap-2 border p-4 ${
                  s.done ? 'border-or bg-or/5' : 'border-encre/10 bg-ivoire'
                }`}
              >
                <Icon
                  className={`size-5 ${s.done ? 'text-or-dark' : 'text-encre/40'}`}
                  aria-hidden="true"
                />
                <p className="font-display text-noir text-base font-medium">{s.label}</p>
                <p className="text-encre/65 text-xs">{s.date}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Détails */}
      <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h3 className="ui-caps text-or-dark mb-4">Composition</h3>
          <ul className="divide-encre/10 border-encre/10 divide-y border-y">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 py-4">
                <div>
                  <Link
                    href={`/produit/${item.slug}`}
                    className="font-display text-noir hover:text-or-dark text-base font-medium"
                  >
                    {item.name}
                  </Link>
                  <p className="text-encre/55 text-xs">Quantité × {item.quantity}</p>
                </div>
                <span className="tabular text-encre font-medium">
                  {formatPriceCents(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="ui-caps text-or-dark mt-10 mb-4">Livraison</h3>
          <div className="border-encre/10 bg-ivoire border p-5">
            <p className="font-display text-noir text-base font-medium">
              {order.carrier ?? 'Colissimo'}
            </p>
            <address className="text-encre/85 mt-3 text-sm not-italic">
              {order.shippingAddress.line1}
              <br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
              <br />
              {order.shippingAddress.country}
            </address>
            {order.trackingNumber ? (
              <p className="text-encre/65 mt-3 text-xs">
                Numéro de suivi :{' '}
                <span className="ui-caps tabular text-or-dark">{order.trackingNumber}</span>
              </p>
            ) : (
              <p className="text-encre/55 mt-3 text-xs italic">
                Un numéro de suivi vous sera envoyé dès l’expédition.
              </p>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="border-encre/10 bg-ivoire border p-6">
            <h3 className="font-display text-noir text-xl font-medium">Récapitulatif</h3>
            <Fleuron variant="divider" size="sm" color="or" className="mt-3 opacity-70" />
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-encre/70">Sous-total</dt>
                <dd className="tabular text-encre">{formatPriceCents(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-encre/70">Livraison</dt>
                <dd className="tabular text-encre">
                  {order.shippingCents === 0 ? 'Offerte' : formatPriceCents(order.shippingCents)}
                </dd>
              </div>
              <div className="border-encre/15 mt-3 flex justify-between border-t pt-3 text-base">
                <dt className="text-encre font-medium">Total TTC</dt>
                <dd className="tabular text-encre font-medium">
                  {formatPriceCents(order.totalCents)}
                </dd>
              </div>
            </dl>
            <p className="text-encre/55 mt-5 text-xs">
              Facture disponible après expédition. Une question ?{' '}
              <a
                href={`mailto:contact@atelierfrisson.fr?subject=Commande%20${order.orderNumber}`}
                className="hover:text-or-dark underline underline-offset-2"
              >
                Contactez-nous
              </a>
              .
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
