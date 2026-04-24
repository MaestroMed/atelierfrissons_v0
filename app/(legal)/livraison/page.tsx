import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { SHIPPING_METHODS } from '@/lib/checkout/schemas';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Livraison',
  description: 'Modes, délais, tarifs, zones, discrétion d’emballage.',
  alternates: { canonical: '/livraison' },
};

export default function LivraisonPage() {
  return (
    <LegalLayout
      title="Livraison"
      intro="Discrétion garantie, emballage neutre signé, expédition sous 48h depuis l'UE."
      lastUpdated={new Date('2026-04-01')}
    >
      <h2 id="emballage">Emballage neutre</h2>
      <p>
        Toutes nos commandes sont expédiées dans une boîte cartonnée standard{' '}
        <strong>sans logo ni mention du contenu</strong>. L’expéditeur indiqué est{' '}
        <em>« A.F. — Paris »</em>. La trace bancaire ne mentionne pas le secteur ni le nom de la
        marque.
      </p>

      <h2>Modes de livraison</h2>
      <ul>
        {SHIPPING_METHODS.map((m) => (
          <li key={m.value}>
            <strong>{m.label}</strong> — {m.delay} — {formatPriceCents(m.priceCents)} (offerte dès
            60 €). {m.description}
          </li>
        ))}
      </ul>

      <h2>Zones de livraison</h2>
      <ul>
        <li>
          <strong>France métropolitaine :</strong> active, 2 à 5 jours ouvrés selon le transporteur
        </li>
        <li>
          <strong>Union européenne :</strong> à venir Sprint 7 (Belgique, Pays-Bas, Allemagne,
          Italie, Espagne, etc.)
        </li>
        <li>
          <strong>Royaume-Uni & Suisse :</strong> à venir Sprint 8 (douanes spécifiques)
        </li>
      </ul>

      <h2>Suivi de commande</h2>
      <p>
        Un email avec le numéro de suivi vous est envoyé dès l’expédition. Suivi temps réel
        disponible dans votre <Link href="/compte/commandes">espace personnel</Link>.
      </p>
    </LegalLayout>
  );
}
