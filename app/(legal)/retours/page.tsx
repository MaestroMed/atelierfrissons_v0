import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Retours et remboursements',
  alternates: { canonical: '/retours' },
};

export default function RetoursPage() {
  return (
    <LegalLayout
      title="Retours et remboursements"
      intro="Droit de rétractation 14 jours — exclusion légale pour les objets intimes descellés."
      lastUpdated={new Date('2026-04-01')}
    >
      <h2>Droit de rétractation</h2>
      <p>
        Conformément à l’article L.221-18 du Code de la consommation, vous disposez d’un délai de{' '}
        <strong>14 jours</strong> à compter de la réception pour exercer votre droit de
        rétractation, sans avoir à motiver votre décision.
      </p>

      <h2 id="exclusion">Exclusion d’hygiène (L.221-28 5°)</h2>
      <p>
        Pour des raisons d’hygiène et de protection de la santé,{' '}
        <strong>
          le droit de rétractation ne peut être exercé pour les objets intimes descellés
        </strong>{' '}
        après livraison. Tous nos objets sont scellés en usine — vérifiez le scellé avant ouverture
        si vous souhaitez exercer votre droit.
      </p>

      <h2>Comment retourner un produit</h2>
      <ol>
        <li>
          Envoyez un email à{' '}
          <a href="mailto:contact@atelierfrisson.fr">contact@atelierfrisson.fr</a> avec votre numéro
          de commande
        </li>
        <li>Nous vous transmettons une étiquette de retour Colissimo prépayée</li>
        <li>Glissez le produit dans son emballage d’origine, scellé non ouvert</li>
        <li>Déposez le colis dans n’importe quel point relais ou bureau de poste sous 14 jours</li>
        <li>Remboursement intégral sous 14 jours après réception de votre retour</li>
      </ol>

      <h2 id="tracabilite">Traçabilité</h2>
      <p>
        Chaque colis a un numéro de suivi unique. En cas de perte transporteur, nous prenons en
        charge la procédure de réclamation et vous renvoyons un produit neuf gratuitement.
      </p>

      <h2>Garantie 2 ans</h2>
      <p>
        Tous nos objets bénéficient d’une garantie de 2 ans à compter de la date de livraison. En
        cas de défaut technique (moteur, étanchéité, batterie), nous remplaçons l’objet sans frais.
      </p>
    </LegalLayout>
  );
}
