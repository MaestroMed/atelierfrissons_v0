import type { Metadata } from 'next';
import { UserPlus, TrendingUp, Award, Trophy } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Parrainage — Admin Atelier Frisson',
  robots: { index: false, follow: false },
};

interface MockTopReferrer {
  rank: number;
  customerEmail: string;
  signups: number;
  firstPurchases: number;
  totalCreditedCents: number;
  pendingCents: number;
  status: 'active' | 'ambassador';
}

function getMockReferralStats() {
  return {
    totalCodesGenerated: 1248,
    totalSignups: 287,
    totalFirstPurchases: 142,
    conversionRate: 11.4, // signups / codes
    activationRate: 49.5, // first purchases / signups
    totalRewardCents: 5_680_00, // 142 × 20 € parrain + 142 × 20 € filleul
    pendingRewardCents: 220_00,
    averageOrderValueRefereeCents: 8_900_00,
    averageOrderValueOrganicCents: 7_240_00,
    aovUpliftPercent: 22.9,
    sparkline: [4, 9, 12, 16, 22, 31, 38, 45, 52, 61, 70, 84, 96, 142],
  };
}

function getMockTopReferrers(): readonly MockTopReferrer[] {
  return [
    {
      rank: 1,
      customerEmail: 'sophie***@gmail.com',
      signups: 18,
      firstPurchases: 12,
      totalCreditedCents: 240_00,
      pendingCents: 40_00,
      status: 'ambassador',
    },
    {
      rank: 2,
      customerEmail: 'camille***@yahoo.fr',
      signups: 14,
      firstPurchases: 9,
      totalCreditedCents: 180_00,
      pendingCents: 0,
      status: 'ambassador',
    },
    {
      rank: 3,
      customerEmail: 'helene***@orange.fr',
      signups: 9,
      firstPurchases: 6,
      totalCreditedCents: 120_00,
      pendingCents: 20_00,
      status: 'active',
    },
    {
      rank: 4,
      customerEmail: 'aline***@hotmail.fr',
      signups: 7,
      firstPurchases: 5,
      totalCreditedCents: 100_00,
      pendingCents: 0,
      status: 'active',
    },
    {
      rank: 5,
      customerEmail: 'marie***@gmail.com',
      signups: 6,
      firstPurchases: 4,
      totalCreditedCents: 80_00,
      pendingCents: 20_00,
      status: 'active',
    },
  ];
}

export default function AdminParrainagePage() {
  const stats = getMockReferralStats();
  const top = getMockTopReferrers();

  return (
    <div className="flex flex-col">
      <AdminPageHeader
        title="Programme parrainage"
        description="20 € pour le parrain · 20 € pour le filleul · acquisition à coût zéro."
      />

      <div className="flex flex-col gap-8 p-6 md:p-12">
        {/* KPIs principaux */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Codes générés"
            value={stats.totalCodesGenerated.toLocaleString('fr-FR')}
            delta={{ value: 18, period: '30 j' }}
            sparkline={stats.sparkline}
            sparklineColor="success"
          />
          <StatCard
            label="Inscriptions filleul"
            value={stats.totalSignups.toString()}
            delta={{ value: 12, period: '30 j' }}
            subline={`Conversion code→signup : ${stats.conversionRate} %`}
          />
          <StatCard
            label="1ère commande"
            value={stats.totalFirstPurchases.toString()}
            delta={{ value: 9, period: '30 j' }}
            subline={`Activation : ${stats.activationRate} %`}
          />
          <StatCard
            label="Crédit attribué"
            value={formatPriceCents(stats.totalRewardCents).replace(',00', '')}
            hint={`${formatPriceCents(stats.pendingRewardCents).replace(',00', '')} en attente J+14`}
          />
        </section>

        {/* AOV uplift */}
        <section className="border-or/30 bg-or/8 flex items-start gap-4 border p-5 md:p-6">
          <TrendingUp
            className="text-or-dark mt-1 size-5 shrink-0"
            aria-hidden="true"
            strokeWidth={1.5}
          />
          <div className="flex-1">
            <p className="font-display text-noir text-lg font-medium">
              Les filleul achètent <span className="text-or-dark">{stats.aovUpliftPercent} % plus</span> que les
              clients organiques.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-6 text-sm md:max-w-md">
              <div>
                <p className="ui-caps text-encre/55 text-[10px] tracking-widest">AOV filleul</p>
                <p className="font-display tabular text-or-dark mt-1 text-2xl font-medium">
                  {formatPriceCents(stats.averageOrderValueRefereeCents).replace(',00', '')}
                </p>
              </div>
              <div>
                <p className="ui-caps text-encre/55 text-[10px] tracking-widest">AOV organique</p>
                <p className="font-display tabular text-encre mt-1 text-2xl font-medium">
                  {formatPriceCents(stats.averageOrderValueOrganicCents).replace(',00', '')}
                </p>
              </div>
            </div>
            <p className="text-encre/65 mt-3 text-xs leading-relaxed">
              Hypothèse : la recommandation arrive avec un signal de confiance élevé qui réduit le
              prix-réticence — le filleul prend un coffret au lieu d'un produit unitaire.
            </p>
          </div>
        </section>

        {/* Top parrains */}
        <section className="border-encre/10 bg-ivoire-light flex flex-col gap-5 border p-6 md:p-8">
          <header className="flex items-center gap-3">
            <Trophy className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
            <h2 className="font-display text-noir text-2xl font-medium">
              Top parrains 30 jours
            </h2>
          </header>

          <table className="border-encre/10 w-full border text-sm">
            <thead>
              <tr className="bg-ivoire">
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Rang
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Email
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  Inscriptions
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  Achats
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  Crédité
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b p-3 text-left text-[10px]">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {top.map((row) => (
                <tr key={row.rank} className="bg-ivoire">
                  <td className="border-encre/10 border-r p-3">
                    <span className="font-display tabular text-or-dark text-lg font-medium">
                      {row.rank}
                    </span>
                  </td>
                  <td className="border-encre/10 text-encre/85 border-r p-3 font-mono text-xs">
                    {row.customerEmail}
                  </td>
                  <td className="border-encre/10 tabular text-noir border-r p-3 text-right font-medium">
                    {row.signups}
                  </td>
                  <td className="border-encre/10 tabular text-noir border-r p-3 text-right font-medium">
                    {row.firstPurchases}
                  </td>
                  <td className="border-encre/10 tabular text-noir border-r p-3 text-right font-medium">
                    {formatPriceCents(row.totalCreditedCents).replace(',00', '')}
                    {row.pendingCents > 0 ? (
                      <span className="text-or-dark mt-0.5 block text-[9px]">
                        +{formatPriceCents(row.pendingCents).replace(',00', '')} attendu
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3">
                    {row.status === 'ambassador' ? (
                      <span className="ui-caps bg-or/15 text-or-dark border-or/40 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]">
                        <Award className="size-3" aria-hidden="true" />
                        Ambassadrice
                      </span>
                    ) : (
                      <span className="ui-caps bg-encre/8 text-encre/70 border-encre/15 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px]">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-encre/55 text-xs leading-relaxed">
            <UserPlus className="inline size-3 -translate-y-px" aria-hidden="true" /> Statut
            « Ambassadrice » attribué automatiquement au-delà de 10 parrainages effectifs sur 12
            mois — déclenche un email proposant un statut commercial négocié.
          </p>
        </section>
      </div>
    </div>
  );
}
