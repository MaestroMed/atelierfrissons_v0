import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  GitCommit,
  ExternalLink,
  Server,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { FUNNELS } from '@/lib/observability/funnels';

export const metadata: Metadata = {
  title: 'Observabilité — Admin Atelier Frisson',
  robots: { index: false, follow: false },
};

/**
 * Page admin observabilité — agrège Sentry + PostHog + Vercel Analytics.
 *
 * En prod : appelle leurs APIs (Sentry events, PostHog Insights) et calcule
 * un snapshot 24h. En dev / sans clés API : affiche les statuts de
 * configuration et les liens vers les dashboards externes.
 */
export default function ObservabilitePage() {
  const sentryConfigured = !!process.env['SENTRY_DSN'];
  const posthogConfigured =
    !!process.env['NEXT_PUBLIC_POSTHOG_KEY'] || !!process.env['POSTHOG_API_KEY'];
  const vercelEnv = process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? 'development';
  const release = process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ?? 'local';

  const funnelEvents = Object.values(FUNNELS).reduce((sum, f) => sum + f.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Observabilité"
        description="Sentry · PostHog · Vercel Analytics — santé technique de la maison"
      />

      {/* Status integrations */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <IntegrationCard
          name="Sentry"
          icon={AlertTriangle}
          configured={sentryConfigured}
          dashboardUrl="https://sentry.io"
          description="Error tracking + Performance + Session Replay"
        />
        <IntegrationCard
          name="PostHog"
          icon={TrendingUp}
          configured={posthogConfigured}
          dashboardUrl="https://eu.posthog.com"
          description="Funnels conversion + Product analytics"
        />
        <IntegrationCard
          name="Vercel Analytics"
          icon={Activity}
          configured={vercelEnv !== 'development'}
          dashboardUrl="https://vercel.com/analytics"
          description="Web Vitals + Top pages + Audience"
        />
      </section>

      {/* Snapshot stats — TODO : query APIs en prod */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Erreurs 24 h"
          value={sentryConfigured ? '—' : 'N/A'}
          hint={sentryConfigured ? 'Sentry API à brancher' : 'Sentry non configuré'}
        />
        <StatCard
          label="Sessions actives"
          value={posthogConfigured ? '—' : 'N/A'}
          hint={posthogConfigured ? 'PostHog Insights API' : 'PostHog non configuré'}
        />
        <StatCard
          label="Conversion home→cart"
          value="—"
          hint={`${funnelEvents} events trackés total`}
        />
        <StatCard label="Releases déployées" value="1" hint={`Latest: ${release.slice(0, 7)}`} />
      </section>

      {/* Funnels configurés */}
      <section className="border-encre/10 bg-ivoire-light flex flex-col gap-5 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <Activity className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">
            Funnels de conversion suivis
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(FUNNELS).map(([name, steps]) => (
            <li key={name} className="bg-ivoire border-encre/10 border p-5">
              <p className="ui-caps text-or-dark text-[10px] tracking-widest">{name}</p>
              <p className="font-display text-noir mt-2 text-lg font-medium">
                {steps.length} étapes
              </p>
              <ol className="text-encre/65 mt-3 space-y-1 text-xs">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="text-or-dark tabular shrink-0">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <code className="font-mono">{step}</code>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>

      {/* Release info */}
      <section className="border-encre/10 bg-ivoire-light flex flex-col gap-4 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <GitCommit className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">Release courante</h2>
        </header>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-4">
          <Definition label="Environnement" value={vercelEnv} />
          <Definition label="Commit SHA" value={release.slice(0, 7)} mono />
          <Definition
            label="Runtime Node"
            value={process.env['NEXT_RUNTIME'] === 'edge' ? 'edge' : 'nodejs'}
          />
          <Definition label="Mode" value={process.env['NODE_ENV'] ?? 'development'} />
        </dl>
        <div className="border-encre/10 border-t pt-4">
          <p className="text-encre/70 text-xs leading-relaxed">
            Pour wirer Sentry release tracking : ajouter{' '}
            <code className="bg-encre/5 px-1.5 py-0.5 font-mono text-[11px]">
              SENTRY_DSN
            </code>{' '}
            +{' '}
            <code className="bg-encre/5 px-1.5 py-0.5 font-mono text-[11px]">
              SENTRY_AUTH_TOKEN
            </code>{' '}
            (pour upload des sourcemaps), puis exécuter{' '}
            <code className="bg-encre/5 px-1.5 py-0.5 font-mono text-[11px]">
              pnpm sentry-cli releases new …
            </code>{' '}
            via le hook post-deploy Vercel.
          </p>
        </div>
      </section>

      {/* Health check link */}
      <section className="border-encre/10 bg-ivoire flex items-center justify-between border p-6">
        <div className="flex items-center gap-3">
          <Server className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <div>
            <p className="font-display text-noir text-base font-medium">Health check</p>
            <p className="text-encre/65 text-xs">
              Endpoint à appeler par les uptime monitors externes (Better Stack, UptimeRobot…)
            </p>
          </div>
        </div>
        <Link
          href="/api/health"
          target="_blank"
          rel="noreferrer"
          className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-2 text-[10px]"
        >
          /api/health
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

interface IntegrationCardProps {
  name: string;
  icon: typeof Activity;
  configured: boolean;
  dashboardUrl: string;
  description: string;
}

function IntegrationCard({ name, icon: Icon, configured, dashboardUrl, description }: IntegrationCardProps) {
  return (
    <div className="bg-ivoire-light border-encre/10 flex flex-col gap-3 border p-6">
      <div className="flex items-center justify-between">
        <Icon className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
        <span
          className={
            configured
              ? 'bg-or/15 text-or-dark border-or/40 ui-caps inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]'
              : 'bg-rouge/10 text-rouge border-rouge/30 ui-caps inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]'
          }
        >
          {configured ? '● Actif' : '○ Inactif'}
        </span>
      </div>
      <h3 className="font-display text-noir text-lg font-medium">{name}</h3>
      <p className="text-encre/65 text-xs leading-relaxed">{description}</p>
      <Link
        href={dashboardUrl}
        target="_blank"
        rel="noreferrer"
        className="ui-caps text-or-dark hover:text-or mt-auto inline-flex items-center gap-1.5 text-[10px]"
      >
        Dashboard externe
        <ExternalLink className="size-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

function Definition({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="ui-caps text-encre/55 text-[10px] tracking-widest">{label}</dt>
      <dd
        className={
          mono
            ? 'font-mono text-encre mt-1 text-sm'
            : 'font-display text-noir mt-1 text-base font-medium'
        }
      >
        {value}
      </dd>
    </div>
  );
}
