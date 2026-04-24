import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Politique de cookies',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Politique de cookies"
      intro="Conforme aux recommandations CNIL (délibération 2020-091) — consentement granulaire."
      lastUpdated={new Date('2026-04-01')}
    >
      <h2>Cookies strictement nécessaires</h2>
      <p>Indispensables au fonctionnement du site — exemptés de consentement (CNIL). Inclus :</p>
      <ul>
        <li>
          <code>af_age_verified</code> — vérification d’âge Arcom (30 jours)
        </li>
        <li>
          <code>af_consent_v1</code> — mémoire de vos choix cookies (180 jours)
        </li>
        <li>
          <code>af_cart</code> — panier session (14 jours)
        </li>
        <li>Cookies de session Supabase (auth) — durée de connexion</li>
      </ul>

      <h2>Cookies de mesure d’audience (consentement)</h2>
      <p>
        Vercel Analytics et PostHog (anonymisés) — pour comprendre les usages et améliorer
        l’expérience. <strong>Aucun chargement avant votre acceptation explicite.</strong>
      </p>

      <h2>Cookies marketing (consentement)</h2>
      <p>
        Klaviyo — pour la newsletter et les emails marketing personnalisés. Désactivé par défaut.
      </p>

      <h2>Cookies de personnalisation (consentement)</h2>
      <p>
        Recommandations produits, contenus éditoriaux adaptés à vos centres d’intérêt. Désactivé par
        défaut.
      </p>

      <h2>Modifier vos choix</h2>
      <p>
        Vous pouvez modifier vos préférences à tout moment via le bandeau cookies au bas du site, ou
        en supprimant le cookie <code>af_consent_v1</code> dans les paramètres de votre navigateur
        (le bandeau réapparaîtra à la prochaine visite).
      </p>

      <h2>Durée maximale</h2>
      <p>
        Conformément à la CNIL, la durée maximale de conservation du consentement est de{' '}
        <strong>6 mois</strong>. Au-delà, le bandeau réapparaît.
      </p>
    </LegalLayout>
  );
}
