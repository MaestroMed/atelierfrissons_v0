'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadPinterestTag, trackPinterestPageView } from '@/lib/analytics/pixels';

/**
 * Mounts les tracking pixels marketing — Pinterest Tag + ad networks.
 *
 * Comportement :
 *   - Au premier render, écoute le `cookie consent` initial. Si marketing OK
 *     ET env var Pinterest Tag définie → charge le script Pinterest.
 *   - À chaque change de route, fire un `pageView` Pinterest (si ID défini).
 *   - Réagit aussi aux changements de consentement live via l'event
 *     `af:consent` dispatché par CookieBanner.
 *
 * Conformité : aucun pixel ne se charge avant accord explicite. Module
 * silencieux si IDs absentes — utile en dev / staging.
 */
export function MarketingPixels() {
  const pathname = usePathname();

  // Charge Pinterest Tag (idempotent) + écoute consent updates
  useEffect(() => {
    loadPinterestTag();

    const onConsent = () => {
      loadPinterestTag();
    };
    window.addEventListener('af:consent', onConsent);
    return () => window.removeEventListener('af:consent', onConsent);
  }, []);

  // Page view sur changement de route
  useEffect(() => {
    trackPinterestPageView();
  }, [pathname]);

  return null;
}
