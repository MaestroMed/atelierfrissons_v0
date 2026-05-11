import { permanentRedirect } from 'next/navigation';

/**
 * Pivot V2 (mai 2026) : la collection éditoriale « JOUR » est dépréciée
 * au profit de la collection audience « Pour Elle ». Redirect 301 permanent
 * pour préserver le SEO existant.
 */
export default function CollectionJourLegacyPage(): never {
  permanentRedirect('/collections/elle');
}
