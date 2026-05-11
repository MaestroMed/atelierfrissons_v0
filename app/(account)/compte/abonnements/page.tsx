import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Pause, Play, X, Repeat, Truck, Edit3 } from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import { getMockSubscriptionPlans } from '@/lib/mock/subscription-plans';
import { formatPriceCents } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Mes abonnements — Box Mensuelle Atelier Frisson',
  description:
    'Gérez votre Box Mensuelle Rituel Frisson : pause, skip, annulation, modification du contenu — tout en deux clics.',
  alternates: { canonical: '/compte/abonnements' },
};

/**
 * Mock subscription state — sera remplacé par lecture DB `subscriptions` + relations
 * en Sprint P2. Pour l'instant, on simule une abonnée Box Premium active.
 */
interface MockSubscription {
  id: string;
  planSlug: string;
  status: 'active' | 'paused' | 'cancelled';
  startedAt: Date;
  nextChargeAt: Date | null;
  pausedUntil: Date | null;
  totalBoxesReceived: number;
  totalSpentCents: number;
  ccbillSubscriptionId: string | null;
}

function getMockUserSubscription(): MockSubscription | null {
  // En attendant l'auth + DB live, on simule une abonnée active
  const now = new Date();
  const nextCharge = new Date(now);
  nextCharge.setDate(nextCharge.getDate() + 18);

  return {
    id: 'sub_mock_001',
    planSlug: 'box-premium',
    status: 'active',
    startedAt: new Date(now.getTime() - 4 * 30 * 24 * 60 * 60 * 1000),
    nextChargeAt: nextCharge,
    pausedUntil: null,
    totalBoxesReceived: 4,
    totalSpentCents: 4 * 4900,
    ccbillSubscriptionId: 'CCB_mock_xxxx',
  };
}

const NEXT_BOX_PREVIEW = {
  chapterNumber: 6,
  monthLabel: 'juin 2026',
  theme: 'L\'évasion',
  hint: '4 pièces — un objet, une lingerie capsule, une cosmétique, une carte rituel.',
};

export default function AbonnementsClientPage() {
  const subscription = getMockUserSubscription();
  const plans = getMockSubscriptionPlans();

  if (!subscription) {
    return <EmptyState />;
  }

  const plan = plans.find((p) => p.slug === subscription.planSlug);
  const monthsActive = Math.max(
    1,
    Math.floor((Date.now() - subscription.startedAt.getTime()) / (30 * 24 * 60 * 60 * 1000)),
  );

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* HERO statut */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden p-8 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.15)_0%,transparent_60%)]"
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div>
            <Fleuron variant="crown" size="md" color="or" className="mb-4 opacity-80" />
            <p className="ui-caps text-or text-[11px] tracking-[0.22em]">
              Abonnement {subscription.status === 'active' ? '· Actif' : '· En pause'}
            </p>
            <h2 className="font-display mt-4 text-4xl leading-tight font-medium md:text-5xl">
              {plan?.name ?? 'Box Mensuelle'}{' '}
              <span className="font-italic-editorial text-or">— chapitre {monthsActive + 1}</span>
            </h2>
            <p className="text-ivoire/80 mt-4 max-w-xl text-base leading-relaxed">
              {plan?.description ?? ''}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:grid-cols-3">
              <div>
                <dt className="ui-caps text-or text-[10px] tracking-widest">Tarif mensuel</dt>
                <dd className="font-display tabular text-ivoire mt-1 text-xl font-medium">
                  {plan ? formatPriceCents(plan.priceCents).replace(',00', '') : '—'}
                </dd>
              </div>
              <div>
                <dt className="ui-caps text-or text-[10px] tracking-widest">Box reçues</dt>
                <dd className="font-display tabular text-ivoire mt-1 text-xl font-medium">
                  {subscription.totalBoxesReceived}
                </dd>
              </div>
              <div>
                <dt className="ui-caps text-or text-[10px] tracking-widest">Total versé</dt>
                <dd className="font-display tabular text-ivoire mt-1 text-xl font-medium">
                  {formatPriceCents(subscription.totalSpentCents).replace(',00', '')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Prochain chapitre + actions */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <NextBoxCard nextChargeAt={subscription.nextChargeAt} />
        <ActionsCard subscription={subscription} />
      </section>

      {/* Historique récent */}
      <section>
        <header className="mb-6 flex items-center gap-3">
          <Truck className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
            Historique des envois
          </h2>
        </header>
        <ul className="border-encre/10 divide-encre/8 divide-y border">
          {Array.from({ length: subscription.totalBoxesReceived }).map((_, i) => {
            const boxNum = subscription.totalBoxesReceived - i;
            const date = new Date(subscription.startedAt);
            date.setMonth(date.getMonth() + boxNum - 1);
            return (
              <li
                key={boxNum}
                className="bg-ivoire flex flex-col items-start justify-between gap-3 px-5 py-4 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display tabular text-or-dark text-xl font-medium">
                    n°{boxNum}
                  </span>
                  <div>
                    <p className="font-display text-noir text-base font-medium">
                      Box {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-encre/60 text-xs">
                      Livrée · 4 pièces · Colissimo Suivi 48 h
                    </p>
                  </div>
                </div>
                <Link
                  href={`/compte/commandes/box-${boxNum}`}
                  className="ui-caps text-or-dark hover:text-or inline-flex items-center gap-1.5 text-[10px]"
                >
                  Voir le détail
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Info CCBill / paiement */}
      <section className="border-encre/10 bg-ivoire-light flex flex-col gap-4 border p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="ui-caps text-or-dark text-[10px] tracking-widest">Moyen de paiement</p>
          <p className="font-display text-noir mt-2 text-lg">
            CCBill · Visa ••••{' '}
            <span className="text-encre/55 font-sans text-sm">
              (expire 06/2028)
            </span>
          </p>
          <p className="text-encre/65 mt-1 text-xs">
            Données chiffrées, jamais stockées sur nos serveurs (PCI-DSS niveau 1).
          </p>
        </div>
        <Link
          href="/compte/preferences#paiement"
          className="ui-caps-md border-noir/30 text-noir hover:border-noir inline-flex items-center gap-2 border px-5 py-2.5 transition-colors"
        >
          <Edit3 className="size-4" aria-hidden="true" />
          Modifier
        </Link>
      </section>
    </div>
  );
}

function NextBoxCard({ nextChargeAt }: { nextChargeAt: Date | null }) {
  if (!nextChargeAt) {
    return (
      <div className="border-encre/10 bg-ivoire-light flex h-full flex-col gap-4 border p-6 md:p-8">
        <Calendar className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
        <h3 className="font-display text-noir text-xl font-medium">
          Aucun prélèvement programmé
        </h3>
        <p className="text-encre/70 text-sm">L\'abonnement est en pause ou annulé.</p>
      </div>
    );
  }

  const dateLabel = nextChargeAt.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="border-encre/10 bg-ivoire-light flex flex-col gap-5 border p-6 md:p-8">
      <div className="flex items-center gap-3">
        <Calendar className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
        <p className="ui-caps text-or-dark text-[11px] tracking-widest">Prochain chapitre</p>
      </div>
      <div>
        <p className="font-display text-noir text-2xl font-medium md:text-3xl">
          Chapitre n°{NEXT_BOX_PREVIEW.chapterNumber}{' '}
          <span className="font-italic-editorial text-or-dark">— {NEXT_BOX_PREVIEW.monthLabel}</span>
        </p>
        <p className="font-italic-editorial text-encre/70 mt-2 text-base">
          Thème : « {NEXT_BOX_PREVIEW.theme} »
        </p>
        <p className="text-encre/75 mt-3 text-sm leading-relaxed">{NEXT_BOX_PREVIEW.hint}</p>
      </div>
      <div className="border-encre/10 mt-2 border-t pt-4">
        <p className="text-encre/65 text-xs">Date de prélèvement</p>
        <p className="font-display tabular text-noir mt-1 text-base font-medium">
          {dateLabel}
        </p>
        <p className="text-encre/55 mt-1 text-xs leading-relaxed">
          Vous pouvez sauter ce mois jusqu\'à 48 h avant cette date — sans frais.
        </p>
      </div>
      <Fleuron variant="divider" size="sm" color="or" className="mt-2 opacity-50" />
    </div>
  );
}

function ActionsCard({ subscription }: { subscription: MockSubscription }) {
  const isActive = subscription.status === 'active';

  return (
    <div className="border-encre/10 bg-ivoire flex h-full flex-col gap-3 border p-6 md:p-8">
      <p className="ui-caps text-or-dark text-[11px] tracking-widest">Gestion</p>

      <ActionButton
        icon={Calendar}
        label="Sauter le mois"
        body="Décale d'un mois sans annuler. Reprend automatiquement le mois suivant."
        formAction="/api/subscriptions/skip"
        variant="default"
      />
      <ActionButton
        icon={isActive ? Pause : Play}
        label={isActive ? 'Mettre en pause' : 'Reprendre'}
        body={
          isActive
            ? 'Suspend les prélèvements. Vous pouvez reprendre quand vous voulez.'
            : 'Reprend les prélèvements à la date que vous choisissez.'
        }
        formAction={isActive ? '/api/subscriptions/pause' : '/api/subscriptions/resume'}
        variant="default"
      />
      <ActionButton
        icon={Repeat}
        label="Changer de plan"
        body="Passez du Découverte au Premium ou Trio à tout moment."
        formAction="/compte/abonnements/changer-plan"
        variant="default"
      />
      <ActionButton
        icon={X}
        label="Annuler l\'abonnement"
        body="Aucun frais. Vous gardez l\'accès jusqu\'à la dernière box payée."
        formAction="/api/subscriptions/cancel"
        variant="danger"
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  body,
  formAction,
  variant,
}: {
  icon: typeof Calendar;
  label: string;
  body: string;
  formAction: string;
  variant: 'default' | 'danger';
}) {
  // Stub : pas de Server Action live tant que CCBill recurring webhook n'est pas
  // branché. On rend des liens GET vers les routes API qui rendront 503 + UX
  // de fallback.
  return (
    <a
      href={formAction}
      className={
        variant === 'danger'
          ? 'group hover:border-rouge hover:bg-rouge/5 border-encre/15 flex items-start gap-3 border p-4 transition-colors'
          : 'group border-encre/15 hover:border-or-dark hover:bg-or/5 flex items-start gap-3 border p-4 transition-colors'
      }
    >
      <Icon
        className={
          variant === 'danger'
            ? 'text-rouge mt-0.5 size-4 shrink-0'
            : 'text-or-dark mt-0.5 size-4 shrink-0'
        }
        aria-hidden="true"
        strokeWidth={1.5}
      />
      <div className="flex-1">
        <p className="font-display text-noir text-base font-medium">{label}</p>
        <p className="text-encre/65 mt-0.5 text-xs leading-relaxed">{body}</p>
      </div>
      <ArrowRight
        className="text-encre/40 group-hover:text-or-dark mt-1 size-4 shrink-0 transition-all group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}

function EmptyState() {
  return (
    <div className="border-encre/10 bg-ivoire-light flex flex-col items-center gap-5 border p-10 text-center md:p-16">
      <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
      <p className="ui-caps text-or-dark text-[11px] tracking-widest">Aucun abonnement actif</p>
      <h2 className="font-display text-noir text-3xl font-medium md:text-4xl">
        Pas encore abonnée à la{' '}
        <span className="font-italic-editorial text-or-dark">Box Mensuelle</span>
      </h2>
      <p className="text-encre/70 max-w-md text-sm leading-relaxed md:text-base">
        Trois plans, sans engagement, livraison neutre. Chaque mois, un nouveau chapitre — dans une
        boîte signée à la main.
      </p>
      <Link
        href="/box-mensuelle"
        className="ui-caps-md bg-noir text-ivoire hover:bg-rouge mt-2 inline-flex items-center gap-3 px-8 py-4 transition-colors"
      >
        Découvrir la Box Mensuelle
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
