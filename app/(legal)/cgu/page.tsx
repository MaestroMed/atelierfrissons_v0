import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Conditions générales d’utilisation',
  alternates: { canonical: '/cgu' },
};

export default function CguPage() {
  return (
    <LegalLayout title="Conditions générales d’utilisation" lastUpdated={new Date('2026-04-01')}>
      <h2>Accès au site</h2>
      <p>
        Le site atelierfrisson.fr est accessible aux personnes physiques majeures. La vérification
        d’âge à l’arrivée est obligatoire (Arcom décret 2023-566).
      </p>

      <h2>Compte client</h2>
      <p>
        Vous êtes responsable de la confidentialité de vos identifiants (lien magique envoyé par
        email). Notification immédiate à contact@atelierfrisson.fr en cas d’usage frauduleux.
      </p>

      <h2>Comportement attendu</h2>
      <ul>
        <li>Pas de tentative d’attaque (DDoS, injection, scraping massif)</li>
        <li>Pas de revente non autorisée des produits</li>
        <li>Pas de publication de contenus diffamants ou inappropriés</li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus (textes, images, design, code) sont la propriété d’Atelier Frisson ou
        utilisés sous licence. Reproduction interdite sans autorisation.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Atelier Frisson ne peut être tenu responsable des indisponibilités temporaires du site liées
        à la maintenance, aux mises à jour, ou à des cas de force majeure.
      </p>
    </LegalLayout>
  );
}
