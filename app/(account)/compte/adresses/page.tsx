import type { Metadata } from 'next';
import { MapPin, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Carnet d’adresses',
  robots: { index: false, follow: false },
};

export default async function AdressesPage() {
  // TODO Sprint 4 : query addresses WHERE customer_id = user.id
  const addresses: Array<{
    id: string;
    type: 'shipping' | 'billing';
    firstName: string;
    lastName: string;
    line1: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }> = [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
            Carnet d’adresses
          </h2>
          <p className="text-encre/65 mt-2 text-sm">
            Vos adresses de livraison et de facturation. La discrétion par défaut.
          </p>
        </div>
        <button
          type="button"
          className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
        >
          <Plus className="size-4" aria-hidden="true" />
          Ajouter
        </button>
      </header>

      {addresses.length === 0 ? (
        <div className="border-encre/10 bg-ivoire-light flex flex-col items-center gap-3 border py-16 text-center">
          <MapPin className="text-encre/30 size-10 stroke-[1.2]" aria-hidden="true" />
          <p className="font-italic-editorial text-encre/65">
            Aucune adresse enregistrée. Elles seront créées automatiquement lors de votre première
            commande.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <li key={addr.id} className="border-encre/10 bg-ivoire border p-5">
              <p className="ui-caps text-or-dark">
                {addr.type === 'shipping' ? 'Livraison' : 'Facturation'}
                {addr.isDefault ? ' · Défaut' : ''}
              </p>
              <p className="font-display text-noir mt-2 text-lg">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="text-encre/75 mt-1 text-sm">
                {addr.line1}
                <br />
                {addr.postalCode} {addr.city}
                <br />
                {addr.country}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
