import type { MetadataRoute } from 'next';

/**
 * Web App Manifest — permet l'installation PWA-like (iOS Add to Home Screen,
 * Chrome install prompt). Discret — pas de splash screen agressif, pas de
 * notifications push.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atelier Frisson',
    short_name: 'Atelier Frisson',
    description: 'Maison française du rituel intime — objets de bien-être en silicone médical.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F2EADF',
    theme_color: '#0A0706',
    categories: ['shopping', 'lifestyle', 'health'],
    lang: 'fr-FR',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
