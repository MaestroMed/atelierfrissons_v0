'use client';

import { useEffect } from 'react';

/**
 * Global error boundary — fallback ultime quand même le RootLayout crash.
 * Doit définir `<html>` et `<body>` car le layout n'est pas rendu.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error.tsx]', error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2EADF',
          color: '#1C1A17',
          fontFamily: 'Inter, -apple-system, sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontSize: '0.75rem',
              color: '#A88449',
              marginBottom: '1rem',
            }}
          >
            Atelier Frisson — erreur critique
          </p>
          <h1
            style={{
              fontFamily: '"Bodoni Moda", Georgia, serif',
              fontSize: '2rem',
              fontWeight: 500,
              color: '#0A0706',
              marginBottom: '1rem',
            }}
          >
            Une erreur a interrompu le rituel
          </h1>
          <p style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
            Nous sommes notifiés. Vous pouvez recharger la page — nos excuses pour ce désagrément.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#0A0706',
              color: '#F2EADF',
              border: 'none',
              padding: '0.875rem 2rem',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}
