import type { Metadata } from 'next';
import {
  Repeat,
  TrendingUp,
  Pause,
  Calendar,
  PieChart,
  ChevronRight,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { getMockSubscriptionPlans } from '@/lib/mock/subscription-plans';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Abonnements — Admin Atelier Frisson',
  robots: { index: false, follow: false },
};

/**
 * Mock stats — sera remplacé par queries Drizzle agrégées sur la table
 * `subscriptions` quand DATABASE_URL est défini.
 */
function getMockSubscriptionStats() {
  return {
    activeCount: 412,
    pausedCount: 38,
    cancelledCount: 91,
    mrrCents: 19_868_00, // 19 868 € MRR
    arrCents: 19_868_00 * 12,
    averageTenureMonths: 5.4,
    churnRatePercent: 4.8,
    upcomingChargesCount: 142,
    nextBatchInDays: 3,
    sparkline: [
      18200_00, 18540_00, 18760_00, 19100_00, 19360_00, 19580_00, 19868_00,
    ],
    planBreakdown: {
      'box-decouverte': { count: 188, mrrCents: 7332_00 },
      'box-premium': { count: 156, mrrCents: 7644_00 },
      'box-trio': { count: 68, mrrCents: 4012_00 },
    },
  };
}

export default function AdminAbonnementsPage() {
  const stats = getMockSubscriptionStats();
  const plans = getMockSubscriptionPlans();

  const totalActiveAndPaused = stats.activeCount + stats.pausedCount;
  const pausedRatio =
    totalActiveAndPaused > 0
      ? Math.round((stats.pausedCount / totalActiveAndPaused) * 100)
      : 0;

  return (
    <div className="flex flex-col">
      <AdminPageHeader
        title="Abonnements Box Mensuelle"
        description="MRR, churn, prochaines facturations CCBill — pivot V2 récurrent."
      />

      <div className="flex flex-col gap-8 p-6 md:p-12">
        {/* KPIs principaux */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="MRR"
            value={formatPriceCents(stats.mrrCents).replace(',00', '')}
            delta={{ value: 9.2, period: 'vs mois -1' }}
            sparkline={stats.sparkline}
            sparklineColor="success"
            subline={`ARR projeté : ${formatPriceCents(stats.arrCents).replace(',00', '')}`}
          />
          <StatCard
            label="Abonnées actives"
            value={stats.activeCount.toString()}
            delta={{ value: 6.4, period: '30 j' }}
            subline={`${stats.upcomingChargesCount} prélèvements dans ${stats.nextBatchInDays} j`}
          />
          <StatCard
            label="En pause"
            value={stats.pausedCount.toString()}
            hint={`${pausedRatio} % du parc actif — auto-resume cron quotidien`}
          />
          <StatCard
            label="Churn 30 j"
            value={`${stats.churnRatePercent} %`}
            delta={{ value: -1.1, period: 'vs mois -1' }}
            sparklineColor="success"
            hint={`Tenure moyenne : ${stats.averageTenureMonths} mois`}
          />
        </section>

        {/* Breakdown par plan */}
        <section className="border-encre/10 bg-ivoire-light flex flex-col gap-5 border p-6 md:p-8">
          <header className="flex items-center gap-3">
            <PieChart className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
            <h2 className="font-display text-noir text-2xl font-medium">
              Répartition par plan
            </h2>
          </header>

          <table className="border-encre/10 w-full border text-sm">
            <thead>
              <tr className="bg-ivoire">
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Plan
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  Tarif
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  Abonnées
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  MRR
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b p-3 text-right text-[10px]">
                  Part
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const breakdown =
                  stats.planBreakdown[plan.slug as keyof typeof stats.planBreakdown];
                const sharePct = breakdown
                  ? Math.round((breakdown.mrrCents / stats.mrrCents) * 100)
                  : 0;
                return (
                  <tr key={plan.slug} className="bg-ivoire">
                    <td className="border-encre/10 border-r p-3 align-middle">
                      <p className="font-display text-noir text-base font-medium">{plan.name}</p>
                      <p className="text-encre/60 text-xs">{plan.tagline}</p>
                    </td>
                    <td className="border-encre/10 tabular text-encre/85 border-r p-3 text-right">
                      {formatPriceCents(plan.priceCents).replace(',00', '')}/mois
                    </td>
                    <td className="border-encre/10 tabular text-noir border-r p-3 text-right font-medium">
                      {breakdown?.count ?? 0}
                    </td>
                    <td className="border-encre/10 tabular text-noir border-r p-3 text-right font-medium">
                      {breakdown
                        ? formatPriceCents(breakdown.mrrCents).replace(',00', '')
                        : '0 €'}
                    </td>
                    <td className="tabular text-encre/85 p-3 text-right">{sharePct} %</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Prochaines facturations */}
        <section className="border-encre/10 bg-ivoire flex flex-col gap-5 border p-6 md:p-8">
          <header className="flex items-center gap-3">
            <Calendar className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
            <h2 className="font-display text-noir text-2xl font-medium">
              Prochaines facturations CCBill
            </h2>
          </header>
          <p className="text-encre/70 text-sm">
            Cron <code className="bg-encre/5 px-1.5 py-0.5 font-mono text-[11px]">0 3 * * *</code>{' '}
            traite les renouvellements quotidiennement (cf.{' '}
            <code className="bg-encre/5 px-1.5 py-0.5 font-mono text-[11px]">
              /api/cron/process-subscriptions
            </code>
            ).
          </p>
          <ul className="border-encre/10 divide-encre/8 divide-y border">
            {[
              { label: 'Aujourd\'hui', count: 23, mrrCents: 1_127_00 },
              { label: 'Demain', count: 51, mrrCents: 2_499_00 },
              { label: 'Dans 2 jours', count: 38, mrrCents: 1_862_00 },
              { label: 'Dans 3 jours', count: 30, mrrCents: 1_470_00 },
            ].map((batch) => (
              <li
                key={batch.label}
                className="bg-ivoire flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <Repeat className="text-or-dark size-4" aria-hidden="true" strokeWidth={1.5} />
                  <div>
                    <p className="font-display text-noir text-base font-medium">{batch.label}</p>
                    <p className="text-encre/55 text-xs">{batch.count} abonnées</p>
                  </div>
                </div>
                <p className="font-display tabular text-or-dark text-lg font-medium">
                  {formatPriceCents(batch.mrrCents).replace(',00', '')}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* État système */}
        <section className="border-encre/10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-ivoire-light border-encre/10 flex flex-col gap-3 border p-6">
            <Pause className="text-or-dark size-4" aria-hidden="true" strokeWidth={1.5} />
            <h3 className="font-display text-noir text-base font-medium">Pauses actives</h3>
            <p className="text-encre/70 text-sm leading-relaxed">
              {stats.pausedCount} abonnées en pause — dont 14 dont la pause prend fin cette
              semaine, auto-resume programmé.
            </p>
            <button
              type="button"
              className="ui-caps text-or-dark hover:text-or mt-auto inline-flex w-fit items-center gap-2 text-[10px] underline underline-offset-4"
            >
              Voir la liste
              <ChevronRight className="size-3" aria-hidden="true" />
            </button>
          </div>
          <div className="bg-ivoire-light border-encre/10 flex flex-col gap-3 border p-6">
            <TrendingUp className="text-or-dark size-4" aria-hidden="true" strokeWidth={1.5} />
            <h3 className="font-display text-noir text-base font-medium">Cohort dernière box</h3>
            <p className="text-encre/70 text-sm leading-relaxed">
              Box n°5 (mai 2026) — 412 envois, 11 retours signalés, 401 livrées sans incident
              (97,3 %).
            </p>
            <button
              type="button"
              className="ui-caps text-or-dark hover:text-or mt-auto inline-flex w-fit items-center gap-2 text-[10px] underline underline-offset-4"
            >
              Voir le détail
              <ChevronRight className="size-3" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
