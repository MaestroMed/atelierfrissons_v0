import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  alternates: { canonical: '/confidentialite' },
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      intro="Atelier Frisson respecte le RGPD et la LIL. Cette politique détaille l'usage de vos données."
      lastUpdated={new Date('2026-04-01')}
    >
      <h2>Responsable du traitement</h2>
      <p>
        SASU Atelier Frisson, contact@atelierfrisson.fr. Pas de DPO désigné (pas obligatoire pour
        notre taille).
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Compte client :</strong> email, prénom, nom, téléphone (optionnel), date
          d’inscription, adresses de livraison et de facturation
        </li>
        <li>
          <strong>Commandes :</strong> historique, montant, méthode de paiement, statut
          d’expédition, méthode de livraison
        </li>
        <li>
          <strong>Communications :</strong> consentement newsletter (granulaire), historique
          d’ouverture des emails (Resend, Klaviyo)
        </li>
        <li>
          <strong>Navigation :</strong> avec votre consentement explicite uniquement (CookieBanner)
          — anonymisé chez PostHog (IP masquée)
        </li>
        <li>
          <strong>Vérification d’âge :</strong> cookie <code>af_age_verified</code> (30 jours,
          self-declaration en V1)
        </li>
      </ul>

      <h2>Finalités</h2>
      <ul>
        <li>Exécution de la commande et du contrat de vente</li>
        <li>Service client et SAV</li>
        <li>Envoi de la newsletter éditoriale (consentement explicite)</li>
        <li>Mesure d’audience anonymisée (Vercel Analytics, PostHog) — consentement granulaire</li>
        <li>Obligations légales (facturation, comptabilité, lutte anti-fraude)</li>
      </ul>

      <h2>Durée de conservation</h2>
      <ul>
        <li>
          <strong>Compte client :</strong> tant qu’il est actif + 3 ans après dernière commande
        </li>
        <li>
          <strong>Factures :</strong> 10 ans (obligation comptable)
        </li>
        <li>
          <strong>Données newsletter :</strong> jusqu’au désabonnement
        </li>
        <li>
          <strong>Logs techniques :</strong> 13 mois maximum (LCEN)
        </li>
      </ul>

      <h2>Vos droits RGPD</h2>
      <p>Vous disposez à tout moment des droits suivants :</p>
      <ul>
        <li>
          <strong>Accès :</strong> recevoir une copie de toutes vos données (export CSV depuis
          /compte/securite)
        </li>
        <li>
          <strong>Rectification :</strong> modifier vos données depuis votre espace client
        </li>
        <li>
          <strong>Effacement :</strong> demander la suppression de votre compte (soft-delete
          immédiat, hard-delete sous 30 jours)
        </li>
        <li>
          <strong>Opposition :</strong> vous désabonner de la newsletter en un clic
        </li>
        <li>
          <strong>Portabilité :</strong> recevoir vos données au format JSON
        </li>
        <li>
          <strong>Réclamation :</strong> auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          )
        </li>
      </ul>

      <h2>Sous-traitants</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — hébergement Edge UE
        </li>
        <li>
          <strong>Supabase</strong> — base de données (région Frankfurt, eu-central-1)
        </li>
        <li>
          <strong>Cloudflare</strong> — CDN, sécurité
        </li>
        <li>
          <strong>Stripe</strong> (dev) / <strong>CCBill</strong> (prod) — paiement
        </li>
        <li>
          <strong>Resend</strong> — emails transactionnels
        </li>
        <li>
          <strong>Klaviyo</strong> — emails marketing (consentement requis)
        </li>
        <li>
          <strong>Mux</strong> — vidéo (HLS adaptatif)
        </li>
        <li>
          <strong>PostHog EU</strong> — analytics (consentement requis)
        </li>
        <li>
          <strong>Sentry</strong> — error monitoring (anonymisé)
        </li>
      </ul>
    </LegalLayout>
  );
}
