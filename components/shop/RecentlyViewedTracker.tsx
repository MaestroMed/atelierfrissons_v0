'use client';

import { useEffect } from 'react';
import { pushRecentlyViewed } from '@/lib/recently-viewed/storage';
import type { RecentlyViewedItem } from '@/lib/recently-viewed/types';

interface RecentlyViewedTrackerProps {
  item: Omit<RecentlyViewedItem, 'viewedAt'>;
}

/**
 * Composant « invisible » monté sur `/produit/[slug]` — pousse l'item dans
 * le localStorage recently-viewed au mount. Ne rend rien, n'ajoute aucun
 * overhead DOM.
 *
 * Placé côté client parce qu'il a besoin de localStorage. Le parent Server
 * Component lui passe un snapshot minimal sérialisable (pas le Product
 * complet — juste les champs utiles pour l'affichage carousel).
 */
export function RecentlyViewedTracker({ item }: RecentlyViewedTrackerProps) {
  useEffect(() => {
    pushRecentlyViewed(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.slug]);

  return null;
}
