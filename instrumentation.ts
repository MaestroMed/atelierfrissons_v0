/**
 * Next.js instrumentation — point d'entrée pour Sentry server-side init.
 *
 * Cette fonction est appelée automatiquement par Next.js au démarrage du
 * runtime serveur (nodejs ou edge). On délègue à `sentry.server.config.ts`
 * et `sentry.edge.config.ts` qui contiennent la config dédiée par runtime.
 *
 * Doc : https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

export async function register(): Promise<void> {
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env['NEXT_RUNTIME'] === 'edge') {
    await import('./sentry.edge.config');
  }
}

/**
 * Hook async error capture — appelé pour chaque erreur dans les Server
 * Components / Server Actions / Route Handlers. Sentry les remontera
 * automatiquement (ou les loggera si pas configuré).
 */
export const onRequestError = async (
  error: unknown,
  request: Readonly<{
    path: string;
    method: string;
    headers: Record<string, string | string[] | undefined>;
  }>,
  context: Readonly<{
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
    renderSource?: 'react-server-components' | 'react-server-components-payload' | 'server-rendering';
    revalidateReason?: 'on-demand' | 'stale' | undefined;
    renderType?: 'dynamic' | 'dynamic-resume';
  }>,
): Promise<void> => {
  // Sentry capture si dispo, sinon log
  if (process.env['SENTRY_DSN']) {
    try {
      const Sentry = await import('@sentry/nextjs');
      Sentry.captureRequestError(error, request, context);
    } catch {
      console.error('[instrumentation] Sentry import failed', error);
    }
    return;
  }

  console.error('[onRequestError]', {
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
  });
};
