/**
 * Next.js instrumentation client — Sentry browser init.
 *
 * Activé automatiquement quand le bundle client se charge.
 * Doc : https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */

import * as Sentry from '@sentry/nextjs';

const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN'];

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? 'development',
    release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ?? 'unknown',

    // Performance traces : 10 % en prod
    tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 0,

    // Session Replay : 10 % des sessions normales, 100 % des sessions avec erreur
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.replayIntegration({
        // RGPD : on masque tout par défaut, opt-in fine-grained
        maskAllText: true,
        blockAllMedia: true,
        // Capture rage-clicks + dead-clicks pour debug UX
        mutationLimit: 5000,
      }),
    ],

    sendDefaultPii: false,

    // Filtre client — strip URL query params, cookies, etc.
    beforeSend(event) {
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url);
          url.search = '';
          event.request.url = url.toString();
        } catch {
          /* */
        }
      }
      // Ne log pas les erreurs des extensions navigateur
      const message = event.message ?? event.exception?.values?.[0]?.value ?? '';
      if (
        /chrome-extension:|moz-extension:|safari-extension:/.test(JSON.stringify(event)) ||
        /ResizeObserver loop|Non-Error promise rejection captured/i.test(message)
      ) {
        return null;
      }
      return event;
    },
  });
}

/**
 * Hook obligatoire Next 16 instrumentation-client.
 * Lance le router transition tracker — observabilité automatique du temps
 * que prennent les `router.push()` côté client.
 */
export const onRouterTransitionStart = (
  href: string,
  navigationType: 'push' | 'replace' | 'traverse',
): void => {
  if (!dsn) return;
  Sentry.startBrowserTracingNavigationSpan(Sentry.getClient()!, {
    name: `${navigationType.toUpperCase()} ${href}`,
    op: 'navigation',
  });
};
