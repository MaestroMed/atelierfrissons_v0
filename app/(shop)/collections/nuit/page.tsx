import { permanentRedirect } from 'next/navigation';

/**
 * Pivot V2 (mai 2026) : la collection éditoriale « NUIT » est dépréciée
 * au profit de la collection audience « Pour Vous Deux ». Redirect 301 permanent
 * pour préserver le SEO existant.
 */
export default function CollectionNuitLegacyPage(): never {
  permanentRedirect('/collections/couples');
}
