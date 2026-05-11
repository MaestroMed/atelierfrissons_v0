import { permanentRedirect } from 'next/navigation';

/**
 * Pivot V2 (mai 2026) : le glossaire wellness éditorial 40+ termes médicaux
 * est déprécié. Le contenu était trop YMYL (Your Money Your Life) pour le
 * positionnement dropship couples 30-50.
 *
 * Redirect 301 permanent vers /faq qui répond aux questions concrètes pivot
 * (livraison, retours, paiement, RGPD, abonnement, parrainage).
 */
export default function GlossaireLegacyPage(): never {
  permanentRedirect('/faq');
}
