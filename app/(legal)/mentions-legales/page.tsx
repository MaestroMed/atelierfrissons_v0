import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Mentions légales',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="Conformes à l'article 6-III de la loi n°2004-575 du 21 juin 2004 (LCEN)."
      lastUpdated={new Date('2026-04-01')}
    >
      <h2>Éditeur du site</h2>
      <ul>
        <li>
          <strong>Raison sociale :</strong> SASU Atelier Frisson (en cours d’immatriculation)
        </li>
        <li>
          <strong>Siège social :</strong> Paris, France (adresse exacte à venir)
        </li>
        <li>
          <strong>Capital social :</strong> à venir
        </li>
        <li>
          <strong>RCS :</strong> Paris (à venir)
        </li>
        <li>
          <strong>SIRET :</strong> à venir
        </li>
        <li>
          <strong>TVA intracommunautaire :</strong> à venir
        </li>
        <li>
          <strong>Email :</strong> contact@atelierfrisson.fr
        </li>
        <li>
          <strong>Directrice de la publication :</strong> Odelie (Sandrine Ada Ben Ayish)
        </li>
      </ul>

      <h2>Hébergeur</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong>
        </li>
        <li>440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
        <li>Données stockées dans l’Union européenne (Vercel Edge + Supabase Frankfurt)</li>
        <li>
          Site :{' '}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
        </li>
      </ul>

      <h2>CDN & sécurité</h2>
      <p>
        <strong>Cloudflare Inc.</strong> — Web Application Firewall, anti-DDoS, bot management, rate
        limiting.
      </p>

      <h2>Conception et réalisation</h2>
      <p>
        Site conçu et développé par <strong>Numelite SASU</strong>, prestataire technique partenaire
        d’Atelier Frisson.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus de ce site (textes, photographies, illustrations, logos) est protégé
        par le droit d’auteur. Toute reproduction, même partielle, est strictement interdite sans
        autorisation écrite préalable d’Atelier Frisson.
      </p>

      <h2>Conformité Arcom</h2>
      <p>
        Le site présente des objets de bien-être intime destinés à un public adulte. La vérification
        d’âge à l’arrivée est conforme au décret n°2023-566 du 7 juillet 2023. Pour la mise en
        production, intégration <strong>VerifyMy</strong> ou <strong>AnonymAGE</strong> (double
        anonymat Arcom).
      </p>
    </LegalLayout>
  );
}
