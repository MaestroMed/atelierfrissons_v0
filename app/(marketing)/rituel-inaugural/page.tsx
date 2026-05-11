import { permanentRedirect } from 'next/navigation';

/**
 * Pivot V2 (mai 2026) : la page « Le rituel inaugural » (scrollytelling
 * 6 chapitres wellness éditorial) est dépréciée. Le contenu n'est plus
 * cohérent avec le positionnement couples 30-50.
 *
 * Redirect 301 permanent vers le journal /rituels.
 */
export default function RituelInauguralLegacyPage(): never {
  permanentRedirect('/rituels');
}
