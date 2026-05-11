import * as Sentry from '@sentry/nextjs';

const dsn = process.env['SENTRY_DSN'];

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? process.env['NODE_ENV'] ?? 'development',
    release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ?? 'unknown',

    // Edge runtime = middleware + edge functions (image OG, etc.)
    // On échantillonne plus bas — moins critique que le serveur principal
    tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.05 : 0,

    sendDefaultPii: false,

    beforeSend(event) {
      if (event.user) event.user = { id: event.user.id };
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
  });
}
