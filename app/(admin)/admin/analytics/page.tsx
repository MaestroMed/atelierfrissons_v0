import type { Metadata } from 'next';
import { BarChart3, ExternalLink } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default async function AdminAnalyticsPage() {
  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="Vercel Speed Insights + PostHog (funnels, heatmaps, session replay anonymisé)."
        actions={
          <a
            href="https://eu.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            Ouvrir PostHog
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        }
      />
      <div className="px-8 py-10 md:px-12">
        <EmptyState
          icon={BarChart3}
          title="PostHog pas encore configuré"
          description="Une fois NEXT_PUBLIC_POSTHOG_KEY défini, embed du dashboard funnel checkout + cohorts trafic SEO sera affiché ici. Anonymisation IP + replay masking par défaut (CNIL)."
        />
      </div>
    </>
  );
}
