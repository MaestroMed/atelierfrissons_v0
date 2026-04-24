import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, AlertTriangle, CheckCircle2, Eye, Power } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';

export const metadata: Metadata = {
  title: 'FORJA — pSEO',
};

export default async function AdminForgePage() {
  // TODO Sprint 5 : countForgePagesByStatus() depuis DB
  const stats = {
    total: 0,
    published: 0,
    pending_review: 0,
    archived: 0,
    penalized: 0,
    draft: 0,
    indexedByGoogle: 0,
    impressions30d: 0,
    avgQualityScore: 0,
  };

  const targetTotal = 1200;
  const progress = (stats.published / targetTotal) * 100;

  return (
    <>
      <AdminPageHeader
        title="FORJA — pSEO"
        description={`Factory programmatique 1 200 pages sur 12 mois — ${stats.published} publiées, ${stats.pending_review} en attente de validation humaine.`}
        actions={
          <button
            type="button"
            className="ui-caps border-rouge-light/40 bg-rouge-light/10 text-rouge-light hover:bg-rouge-light hover:text-ivoire inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            <Power className="size-4" aria-hidden="true" />
            Kill switch global
          </button>
        }
      />

      <div className="space-y-10 px-8 py-8 md:px-12">
        {/* Progress bar */}
        <section
          aria-labelledby="progress-heading"
          className="border-encre/10 bg-ivoire border p-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="ui-caps text-or-dark">Progression annuelle</p>
              <p
                id="progress-heading"
                className="font-display tabular text-noir mt-2 text-3xl font-medium"
              >
                {stats.published} <span className="text-encre/40">/ {targetTotal} pages</span>
              </p>
            </div>
            <p className="ui-caps tabular text-or-dark">{progress.toFixed(1)} %</p>
          </div>
          <div className="bg-encre/10 mt-4 h-1 w-full overflow-hidden">
            <div
              className="bg-or h-full transition-all duration-700"
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>
          <p className="text-encre/55 mt-3 text-xs">
            Rythme cible (CLAUDE.md §FORJA §5) : M1 100 pages, M2 100, M3-6 100-150/mois, M7-12
            50-100/mois.
          </p>
        </section>

        {/* KPIs FORJA */}
        <section aria-labelledby="kpi-forge">
          <h2 id="kpi-forge" className="ui-caps text-or-dark mb-4">
            Statuts
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard
              label="Publiées"
              value={stats.published.toString()}
              subline="status='published'"
            />
            <StatCard
              label="En attente"
              value={stats.pending_review.toString()}
              hint="Validation humaine requise"
            />
            <StatCard
              label="Brouillons"
              value={stats.draft.toString()}
              subline="Pas encore validées"
            />
            <StatCard
              label="Archivées"
              value={stats.archived.toString()}
              hint="Manuelles ou kill-switch"
            />
            <StatCard label="Pénalisées" value={stats.penalized.toString()} hint="Détection algo" />
          </div>
        </section>

        {/* Monitoring SEO */}
        <section aria-labelledby="monitoring">
          <h2 id="monitoring" className="ui-caps text-or-dark mb-4">
            Monitoring Search Console
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Indexées Google"
              value={stats.indexedByGoogle.toString()}
              hint="Crawl GSC quotidien"
            />
            <StatCard label="Impressions 30j" value={stats.impressions30d.toString()} />
            <StatCard
              label="Score qualité moyen"
              value={stats.avgQualityScore.toString()}
              hint="seuil min publication : 70/100"
            />
            <StatCard label="CTR moyen" value="—" hint="GSC non branché" />
          </div>
        </section>

        {/* Queue de validation */}
        <section aria-labelledby="queue">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="queue" className="ui-caps text-or-dark">
              File de validation humaine
            </h2>
            {stats.pending_review > 0 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="ui-caps border-af-success/40 text-af-success hover:bg-af-success/10 inline-flex items-center gap-2 border px-4 py-2"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Bulk approuver score ≥ 80
                </button>
                <button
                  type="button"
                  className="ui-caps border-rouge-light/40 text-rouge-light hover:bg-rouge-light/10 inline-flex items-center gap-2 border px-4 py-2"
                >
                  <AlertTriangle className="size-4" aria-hidden="true" />
                  Bulk rejeter score &lt; 70
                </button>
              </div>
            ) : null}
          </div>

          {stats.pending_review === 0 ? (
            <div className="border-encre/15 bg-ivoire-light/50 flex flex-col items-center gap-4 border border-dashed px-6 py-16 text-center">
              <Sparkles className="text-encre/30 size-10 stroke-[1.2]" aria-hidden="true" />
              <h3 className="font-display text-noir text-xl font-medium">Aucune page en attente</h3>
              <p className="text-encre/65 max-w-md text-sm">
                FORJA injecte les batches via{' '}
                <code className="bg-encre/5 rounded-sm px-1.5 py-0.5">/api/forge/ingest</code>{' '}
                (HMAC). La queue se peuplera dès le premier batch ingéré.
              </p>
            </div>
          ) : null}
        </section>

        {/* Templates */}
        <section aria-labelledby="templates">
          <h2 id="templates" className="ui-caps text-or-dark mb-4">
            Répartition par template
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <TemplateCard
              name="livraison_ville"
              count={0}
              target={500}
              description="500 villes FR — SEO local"
              href="/admin/forge?template=livraison_ville"
            />
            <TemplateCard
              name="conseil_longtail"
              count={0}
              target={400}
              description="Longue traîne informationnelle"
              href="/admin/forge?template=conseil_longtail"
            />
            <TemplateCard
              name="guide_specialise"
              count={0}
              target={200}
              description="Micro-guides thématiques"
              href="/admin/forge?template=guide_specialise"
            />
            <TemplateCard
              name="produit_contexte"
              count={0}
              target={100}
              description="Pages produit contextualisées"
              href="/admin/forge?template=produit_contexte"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function TemplateCard({
  name,
  count,
  target,
  description,
  href,
}: {
  name: string;
  count: number;
  target: number;
  description: string;
  href: string;
}) {
  const progress = (count / target) * 100;
  return (
    <Link
      href={href}
      className="group border-encre/10 bg-ivoire hover:border-or hover:shadow-card flex flex-col gap-3 border p-5 transition-all"
    >
      <p className="ui-caps text-or-dark">{name}</p>
      <p className="font-display tabular text-noir text-2xl font-medium">
        {count}
        <span className="text-encre/40 text-base"> / {target}</span>
      </p>
      <p className="text-encre/65 text-xs">{description}</p>
      <div className="bg-encre/10 mt-2 h-0.5 w-full overflow-hidden">
        <div
          className="bg-or h-full transition-all"
          style={{ width: `${Math.max(1, progress)}%` }}
        />
      </div>
      <span className="ui-caps text-or-dark group-hover:text-or mt-1 inline-flex items-center gap-2 transition-all group-hover:gap-3">
        <Eye className="size-3" aria-hidden="true" />
        Inspecter
      </span>
    </Link>
  );
}
