import * as Sentry from '@sentry/nextjs';

const dsn = process.env['SENTRY_DSN'];

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? process.env['NODE_ENV'] ?? 'development',
    release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ?? 'unknown',

    // Sample rates conservateurs — adultes peut générer du volume
    tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 0,
    profilesSampleRate: 0.1,

    // PII : on supprime tout
    sendDefaultPii: false,

    /**
     * Filtre serveur — supprime toute donnée sensible avant l'envoi.
     */
    beforeSend(event) {
      // Pas de PII : retirer email, IP, user-agent détaillé
      if (event.user) {
        event.user = { id: event.user.id }; // ne garde que l'ID
      }
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
          delete event.request.headers['x-supabase-auth'];
        }
        // URL : strip query params qui pourraient contenir des codes/tokens
        if (event.request.url) {
          try {
            const url = new URL(event.request.url);
            url.search = '';
            event.request.url = url.toString();
          } catch {
            /* malformed URL — ignore */
          }
        }
      }
      // Ne pas log les 404 (pollution)
      const status = (event.contexts?.['response'] as { status_code?: number })?.status_code;
      if (status === 404) return null;
      return event;
    },

    /**
     * Erreurs ignorées (bruit habituel).
     */
    ignoreErrors: [
      // Erreurs réseau client (souvent dues à AdBlocker / connexion mobile)
      'NetworkError',
      'Failed to fetch',
      // Cancelled fetches (next/navigation)
      'AbortError',
    ],
  });
} else if (process.env['NODE_ENV'] === 'production') {
  console.warn('[sentry] SENTRY_DSN not set — error tracking disabled.');
}
