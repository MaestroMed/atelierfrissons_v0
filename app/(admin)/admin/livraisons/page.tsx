import type { Metadata } from 'next';
import { Truck, MapPin, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SHIPPING_METHODS } from '@/lib/checkout/schemas';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Livraisons',
};

export default async function AdminLivraisonsPage() {
  return (
    <>
      <AdminPageHeader
        title="Livraisons"
        description="Zones, transporteurs, tarifs, délais. France métropolitaine + UE étendue."
        actions={
          <button
            type="button"
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouvelle zone
          </button>
        }
      />
      <div className="space-y-8 px-8 py-10 md:px-12">
        <section>
          <h2 className="ui-caps text-or-dark mb-4">Méthodes actives</h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {SHIPPING_METHODS.map((m) => (
              <li key={m.value} className="border-encre/10 bg-ivoire border p-5">
                <Truck className="text-or-dark size-5" aria-hidden="true" />
                <p className="font-display text-noir mt-3 text-lg font-medium">{m.label}</p>
                <p className="text-encre/65 mt-1 text-xs">{m.delay}</p>
                <p className="text-encre/75 mt-3 text-sm">{m.description}</p>
                <p className="tabular text-encre mt-4 text-base font-medium">
                  {formatPriceCents(m.priceCents)}{' '}
                  <span className="text-encre/55 text-xs">offerte dès 60 €</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="ui-caps text-or-dark mb-4">Zones de livraison</h2>
          <div className="space-y-3">
            <ZoneCard zone="France métropolitaine" countries="FR" status="active" />
            <ZoneCard
              zone="Union européenne"
              countries="DE, BE, NL, IT, ES, AT, PT, IE, LU"
              status="planned"
            />
            <ZoneCard zone="Royaume-Uni" countries="GB" status="planned" />
            <ZoneCard zone="Suisse" countries="CH" status="planned" />
          </div>
        </section>
      </div>
    </>
  );
}

function ZoneCard({
  zone,
  countries,
  status,
}: {
  zone: string;
  countries: string;
  status: 'active' | 'planned';
}) {
  return (
    <div className="border-encre/10 bg-ivoire flex items-center justify-between gap-4 border p-5">
      <div className="flex items-start gap-4">
        <MapPin className="text-or-dark mt-0.5 size-4" aria-hidden="true" />
        <div>
          <p className="font-display text-noir text-base font-medium">{zone}</p>
          <p className="ui-caps text-encre/65 mt-0.5">{countries}</p>
        </div>
      </div>
      <span
        className={`ui-caps inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] ${
          status === 'active'
            ? 'border-af-success/40 bg-af-success/10 text-af-success'
            : 'border-encre/20 text-encre/55'
        }`}
      >
        {status === 'active' ? '✓ Active' : 'Prévue Sprint 7'}
      </span>
    </div>
  );
}
