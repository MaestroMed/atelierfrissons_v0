import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description:
    'Conditions générales de vente Atelier Frisson — droit de rétractation, livraison, garanties, responsabilité.',
  alternates: { canonical: '/cgv' },
};

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      intro="Les présentes CGV régissent toutes les ventes d'objets Atelier Frisson aux consommateurs."
      lastUpdated={new Date('2026-04-01')}
    >
      <p className="text-encre/60 text-sm italic">
        ⚠️ Document de travail — relecture juridique avant mise en production. Conformité visée :
        articles L.221-5 à L.221-29 du Code de la consommation, RGPD, directive européenne
        2011/83/UE.
      </p>

      <h2>Article 1 — Identification du vendeur</h2>
      <p>
        Atelier Frisson est exploité par <strong>SASU Atelier Frisson</strong> (en cours
        d’immatriculation), siège social à Paris, capital social à venir, RCS Paris à venir, SIRET à
        venir. Email : contact@atelierfrisson.fr. Directeur de la publication : Odelie (Sandrine Ada
        Ben Ayish).
      </p>

      <h2>Article 2 — Objet et champ d’application</h2>
      <p>
        Les présentes CGV s’appliquent à toute commande passée sur le site{' '}
        <code>atelierfrisson.fr</code> par un consommateur (B2C) résidant en France métropolitaine
        ou dans l’Union européenne.
      </p>

      <h2>Article 3 — Produits et prix</h2>
      <p>
        Les produits proposés sont ceux figurant sur le site au moment de la consultation. Les prix
        sont indiqués TTC en euros, incluant la TVA française à 20 %. Les frais de port sont
        indiqués au moment de la commande, et offerts dès 60 € d’achat.
      </p>

      <h2>Article 4 — Commande et paiement</h2>
      <p>
        La commande est validée après acceptation des CGV et confirmation du paiement par le
        prestataire (Stripe en environnement de test, CCBill en production). Un email de
        confirmation est envoyé sous quelques minutes.
      </p>

      <h2>Article 5 — Livraison</h2>
      <p>
        Les commandes sont expédiées sous 24 à 48 heures depuis notre entrepôt européen, dans un
        emballage neutre (sans logo, sans mention du contenu), via Colissimo, Mondial Relay ou
        Chronopost selon le choix au checkout. Délais 2 à 5 jours ouvrés en France.
      </p>

      <h2>Article 6 — Droit de rétractation</h2>
      <p>
        Conformément à l’article L.221-18 du Code de la consommation, vous disposez d’un délai de 14
        jours à compter de la réception pour exercer votre droit de rétractation, sans avoir à
        motiver votre décision.
      </p>
      <p>
        <strong>Exclusion (article L.221-28 5°)</strong> : pour des raisons d’hygiène et de
        protection de la santé, le droit de rétractation ne peut être exercé pour les objets intimes{' '}
        <strong>descellés</strong> après livraison. Ces objets sont scellés à l’emballage usine —
        l’acheteur identifie le scellé visiblement.
      </p>

      <h2>Article 7 — Garanties</h2>
      <p>
        Tous nos objets bénéficient de la garantie légale de conformité (2 ans, art. L.217-3 et
        suivants du Code de la consommation) et de la garantie contre les vices cachés (art. 1641 à
        1649 du Code civil). Garantie commerciale : 2 ans à compter de la date de livraison.
      </p>

      <h2>Article 8 — Service client</h2>
      <p>
        Email : <a href="mailto:contact@atelierfrisson.fr">contact@atelierfrisson.fr</a> — réponse
        sous 24 heures ouvrées (lundi-vendredi 9h-18h, hors jours fériés FR).
      </p>

      <h2>Article 9 — Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est régi par notre{' '}
        <a href="/confidentialite">Politique de confidentialité</a>. Hébergement Vercel Inc. en UE.
        Données stockées sur Supabase (région Frankfurt, eu-central-1).
      </p>

      <h2>Article 10 — Médiation et droit applicable</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige, le consommateur peut
        saisir gratuitement le médiateur de la consommation. À défaut de résolution amiable, les
        tribunaux français sont seuls compétents.
      </p>
    </LegalLayout>
  );
}
