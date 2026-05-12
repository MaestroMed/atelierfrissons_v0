'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper Client Component qui charge en dynamique les helpers UI rares :
 *
 *   - `CommandPalette` : ouvert uniquement par Cmd+K (~95 % des sessions ne
 *     l'utilisent jamais)
 *   - `CompareBar`     : visible seulement après sélection produits à comparer
 *
 * Économie ~25 KB sur le bundle initial. `ssr: false` est nécessaire car les
 * deux composants dépendent de `window` (hotkeys, localStorage). Next 16 exige
 * que ces dynamic imports soient dans un Client Component, d'où ce wrapper.
 *
 * Le SEO n'est pas impacté : aucun contenu critique n'est porté par ces
 * composants.
 */
const CommandPalette = dynamic(
  () => import('@/components/shared/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false },
);

const CompareBar = dynamic(
  () => import('@/components/shop/CompareBar').then((m) => m.CompareBar),
  { ssr: false },
);

export function LayoutClientHelpers() {
  return (
    <>
      <CommandPalette />
      <CompareBar />
    </>
  );
}
