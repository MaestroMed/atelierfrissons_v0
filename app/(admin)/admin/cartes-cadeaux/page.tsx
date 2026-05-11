import type { Metadata } from 'next';
import { Gift, Mail, Clock, AlertCircle, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Cartes cadeaux — Admin Atelier Frisson',
  robots: { index: false, follow: false },
};

interface MockGiftCardRow {
  id: string;
  code: string;
  initialBalanceCents: number;
  remainingBalanceCents: number;
  status: 'pending' | 'active' | 'consumed' | 'expired' | 'cancelled';
  recipientName: string | null;
  recipientEmail: string | null;
  scheduledSendAt: string | null;
  expiresAt: string;
  createdAt: string;
}

function getMockGiftCardStats() {
  return {
    totalSoldCents: 41_500_00,
    totalRedeemedCents: 12_840_00,
    activeCount: 89,
    pendingCount: 3,
    expiringIn30Days: 7,
    averageAmountCents: 11200,
    sparkline: [3200, 3850, 4220, 4860, 5310, 6042, 6880, 7445], // by week
  };
}

function getMockGiftCardList(): readonly MockGiftCardRow[] {
  const now = new Date();
  return [
    {
      id: 'gc-001',
      code: 'AF-XYZA-1234-5678-MNOP',
      initialBalanceCents: 15_000,
      remainingBalanceCents: 15_000,
      status: 'active',
      recipientName: 'Marie Dubois',
      recipientEmail: 'marie***@gmail.com',
      scheduledSendAt: addDays(now, 2).toISOString(),
      expiresAt: addMonths(now, 12).toISOString(),
      createdAt: addDays(now, -1).toISOString(),
    },
    {
      id: 'gc-002',
      code: 'AF-AAAA-2222-3333-BBBB',
      initialBalanceCents: 10_000,
      remainingBalanceCents: 4_500,
      status: 'active',
      recipientName: 'Sophie L.',
      recipientEmail: 'sophie***@yahoo.fr',
      scheduledSendAt: null,
      expiresAt: addMonths(now, 9).toISOString(),
      createdAt: addDays(now, -45).toISOString(),
    },
    {
      id: 'gc-003',
      code: 'AF-CCCC-4444-5555-DDDD',
      initialBalanceCents: 20_000,
      remainingBalanceCents: 0,
      status: 'consumed',
      recipientName: 'Camille M.',
      recipientEmail: 'camille***@orange.fr',
      scheduledSendAt: null,
      expiresAt: addMonths(now, 6).toISOString(),
      createdAt: addDays(now, -120).toISOString(),
    },
    {
      id: 'gc-004',
      code: 'AF-EEEE-6666-7777-FFFF',
      initialBalanceCents: 5_000,
      remainingBalanceCents: 5_000,
      status: 'pending',
      recipientName: 'Hélène R.',
      recipientEmail: 'helene***@hotmail.fr',
      scheduledSendAt: addDays(now, 5).toISOString(),
      expiresAt: addMonths(now, 13).toISOString(),
      createdAt: addDays(now, -2).toISOString(),
    },
  ];
}

const STATUS_LABEL: Record<MockGiftCardRow['status'], { label: string; className: string }> = {
  pending: { label: 'En attente envoi', className: 'bg-or/15 text-or-dark border-or/40' },
  active: { label: 'Active', className: 'bg-af-success/15 text-af-success border-af-success/40' },
  consumed: { label: 'Consommée', className: 'bg-encre/10 text-encre/70 border-encre/20' },
  expired: { label: 'Expirée', className: 'bg-rouge/10 text-rouge border-rouge/30' },
  cancelled: { label: 'Annulée', className: 'bg-encre/10 text-encre/55 border-encre/20' },
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatRowDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminGiftCardsPage() {
  const stats = getMockGiftCardStats();
  const list = getMockGiftCardList();

  return (
    <div className="flex flex-col">
      <AdminPageHeader
        title="Cartes cadeaux"
        description="Suivi achats + statuts + envois programmés."
      />

      <div className="flex flex-col gap-8 p-6 md:p-12">
        {/* KPIs */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total vendu"
            value={formatPriceCents(stats.totalSoldCents).replace(',00', '')}
            delta={{ value: 14, period: '30 j' }}
            sparkline={stats.sparkline}
            sparklineColor="success"
          />
          <StatCard
            label="Restant à utiliser"
            value={formatPriceCents(stats.totalSoldCents - stats.totalRedeemedCents).replace(
              ',00',
              '',
            )}
            subline={`${Math.round((stats.totalRedeemedCents / stats.totalSoldCents) * 100)} % redeemé`}
            hint="Provision comptable obligatoire"
          />
          <StatCard
            label="Cartes actives"
            value={stats.activeCount.toString()}
            subline={`${stats.pendingCount} en attente d'envoi`}
          />
          <StatCard
            label="Expirent < 30 j"
            value={stats.expiringIn30Days.toString()}
            sparklineColor="rouge"
            hint="Email de relance auto J-7"
          />
        </section>

        {/* Liste */}
        <section className="border-encre/10 bg-ivoire-light flex flex-col gap-5 border p-6 md:p-8">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Gift className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
              <h2 className="font-display text-noir text-2xl font-medium">
                Dernières cartes émises
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="border-encre/15 bg-ivoire flex items-center gap-2 border px-3 py-2">
                <Search className="text-encre/55 size-3.5" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Code ou email destinataire…"
                  className="text-encre placeholder:text-encre/40 w-56 border-0 bg-transparent text-xs outline-none"
                />
              </label>
            </div>
          </header>

          <table className="border-encre/10 w-full border text-sm">
            <thead>
              <tr className="bg-ivoire">
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Code
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Destinataire
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-right text-[10px]">
                  Solde
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Statut
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b border-r p-3 text-left text-[10px]">
                  Envoi
                </th>
                <th className="border-encre/10 ui-caps text-encre/65 border-b p-3 text-left text-[10px]">
                  Expire
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="bg-ivoire">
                  <td className="border-encre/10 border-r p-3 font-mono text-xs">
                    {row.code}
                  </td>
                  <td className="border-encre/10 border-r p-3">
                    <p className="font-display text-noir text-sm">{row.recipientName ?? '—'}</p>
                    <p className="text-encre/55 text-xs">{row.recipientEmail ?? '—'}</p>
                  </td>
                  <td className="border-encre/10 tabular border-r p-3 text-right">
                    <p className="font-display text-noir font-medium">
                      {formatPriceCents(row.remainingBalanceCents).replace(',00', '')}
                    </p>
                    <p className="text-encre/55 text-[10px]">
                      / {formatPriceCents(row.initialBalanceCents).replace(',00', '')}
                    </p>
                  </td>
                  <td className="border-encre/10 border-r p-3">
                    <span
                      className={`ui-caps inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px] ${STATUS_LABEL[row.status].className}`}
                    >
                      {STATUS_LABEL[row.status].label}
                    </span>
                  </td>
                  <td className="border-encre/10 border-r p-3 text-xs">
                    {row.scheduledSendAt ? (
                      <span className="text-or-dark inline-flex items-center gap-1.5">
                        <Mail className="size-3" aria-hidden="true" />
                        {formatRowDate(row.scheduledSendAt)}
                      </span>
                    ) : (
                      <span className="text-encre/55">Envoyée</span>
                    )}
                  </td>
                  <td className="text-encre/85 p-3 text-xs">
                    {formatRowDate(row.expiresAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-encre/55 text-xs">
            <Clock className="inline size-3 -translate-y-px" aria-hidden="true" /> Données
            agrégées toutes les 5 minutes. Liste tronquée aux 50 dernières — utilisez la recherche
            pour les autres.
          </p>
        </section>

        {/* Alerte provisions */}
        <section className="border-or/30 bg-or/8 flex items-start gap-3 border p-5">
          <AlertCircle
            className="text-or-dark mt-0.5 size-4 shrink-0"
            aria-hidden="true"
            strokeWidth={1.5}
          />
          <div className="flex-1">
            <p className="font-display text-noir text-base font-medium">
              Rappel comptable
            </p>
            <p className="text-encre/75 mt-1 text-sm leading-relaxed">
              Les cartes cadeaux sont une <strong>dette commerciale</strong> jusqu'à utilisation
              ou expiration. Le montant restant à utiliser (
              <span className="font-medium">
                {formatPriceCents(stats.totalSoldCents - stats.totalRedeemedCents).replace(
                  ',00',
                  '',
                )}
              </span>
              ) doit figurer au passif du bilan. À transmettre au comptable trimestriellement.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
