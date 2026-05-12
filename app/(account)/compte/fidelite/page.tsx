import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift, Calendar, Star, ShoppingBag } from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import {
  getLoyaltyBalanceAction,
  getLoyaltyHistoryAction,
} from '@/lib/loyalty/actions';
import { LOYALTY_RATE_REDEEM, LOYALTY_MIN_REDEEM } from '@/lib/loyalty/constants';
import { formatPriceCents, formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Programme fidélité — Mes points',
  description:
    'Consultez votre solde de points fidélité Atelier Frisson. 1 € dépensé = 1 point. 100 points = 5 € de remise.',
  alternates: { canonical: '/compte/fidelite' },
};

const REASON_LABELS: Record<string, { label: string; icon: typeof Sparkles; tone: 'earn' | 'redeem' }> = {
  order_earned: { label: 'Commande', icon: ShoppingBag, tone: 'earn' },
  order_redeemed: { label: 'Remise utilisée', icon: ShoppingBag, tone: 'redeem' },
  referral_bonus: { label: 'Parrainage', icon: Gift, tone: 'earn' },
  birthday_bonus: { label: 'Anniversaire', icon: Calendar, tone: 'earn' },
  review_bonus: { label: 'Avis publié', icon: Star, tone: 'earn' },
  admin_adjustment: { label: 'Ajustement', icon: Sparkles, tone: 'earn' },
  expiration: { label: 'Expiration', icon: Calendar, tone: 'redeem' },
};

const HOW_TO_EARN = [
  {
    icon: ShoppingBag,
    title: 'Commander',
    body: '1 € dépensé = 1 point. Crédités 14 jours après livraison.',
  },
  {
    icon: Calendar,
    title: 'Anniversaire',
    body: '+50 points le jour de votre anniversaire (date renseignée dans le compte).',
  },
  {
    icon: Star,
    title: 'Publier un avis',
    body: '+20 points pour chaque avis publié et modéré (max 1 par commande).',
  },
  {
    icon: Gift,
    title: 'Parrainer',
    body: '+200 points (10 €) à chaque filleul qui passe sa première commande.',
  },
] as const;

export default async function FidelitePage() {
  const balance = await getLoyaltyBalanceAction();
  const history = await getLoyaltyHistoryAction();

  if (!balance.ok || !history.ok) {
    return (
      <div className="border-encre/10 bg-ivoire-light flex flex-col items-center gap-4 border p-10 text-center">
        <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
        <p className="font-italic-editorial text-encre/70 text-base">
          Votre solde fidélité est temporairement indisponible. Réessayez dans un instant.
        </p>
      </div>
    );
  }

  const { totalPoints, estimatedValueCents, expiringSoonPoints, nextExpiryDate } = balance.data;
  const canRedeem = totalPoints >= LOYALTY_MIN_REDEEM;

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* HERO solde */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden p-8 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.15)_0%,transparent_60%)]"
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div>
            <Fleuron variant="crown" size="md" color="or" className="mb-4 opacity-80" />
            <p className="ui-caps text-or text-[11px] tracking-[0.22em]">Votre solde</p>
            <h2 className="font-display mt-4 text-5xl leading-tight font-medium tabular md:text-6xl">
              {totalPoints} <span className="text-or text-3xl md:text-4xl">points</span>
            </h2>
            <p className="font-italic-editorial text-or-light mt-4 text-lg md:text-xl">
              Soit environ{' '}
              <span className="text-or font-medium">
                {formatPriceCents(estimatedValueCents).replace(',00', '')}
              </span>{' '}
              de remise utilisable.
            </p>

            {expiringSoonPoints > 0 && nextExpiryDate ? (
              <p className="text-rouge-light mt-4 text-sm">
                ⚠ {expiringSoonPoints} points expirent le {formatDate(nextExpiryDate)} — utilisez-les
                avant.
              </p>
            ) : null}

            <div className="mt-8">
              {canRedeem ? (
                <Link
                  href="/boutique"
                  className="ui-caps-md bg-or text-noir hover:bg-or-light inline-flex items-center gap-3 px-8 py-4 transition-colors"
                >
                  Utiliser mes points
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <p className="ui-caps text-ivoire/60 text-[11px] tracking-widest">
                  Minimum {LOYALTY_MIN_REDEEM} points pour utiliser ({Math.max(0, LOYALTY_MIN_REDEEM - totalPoints)} restants à gagner).
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Comment gagner */}
      <section>
        <header className="mb-6 flex items-center gap-3">
          <Sparkles className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
            Quatre façons de gagner des points
          </h2>
        </header>
        <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-4">
          {HOW_TO_EARN.map((step, i) => (
            <li key={step.title} className="bg-ivoire flex flex-col gap-3 p-6 md:p-7">
              <span className="font-display tabular text-or-dark text-2xl font-medium">
                {`0${i + 1}`.slice(-2)}
              </span>
              <step.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-display text-noir text-base font-medium">{step.title}</h3>
              <p className="text-encre/70 text-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Calculatrice */}
      <section className="border-encre/10 bg-ivoire-light grid grid-cols-1 gap-8 border p-6 md:grid-cols-3 md:gap-10 md:p-10">
        <div>
          <p className="ui-caps text-or-dark text-[10px] tracking-widest">Taux d'attribution</p>
          <p className="font-display text-noir mt-2 text-2xl font-medium">
            1 € = 1 point
          </p>
          <p className="text-encre/65 mt-1 text-xs">
            Sur le sous-total HT (hors livraison + TVA), crédité J+14 après livraison.
          </p>
        </div>
        <div>
          <p className="ui-caps text-or-dark text-[10px] tracking-widest">Taux d'utilisation</p>
          <p className="font-display text-noir mt-2 text-2xl font-medium">
            100 points = {formatPriceCents(Math.round(100 * LOYALTY_RATE_REDEEM * 100)).replace(',00', '')}
          </p>
          <p className="text-encre/65 mt-1 text-xs">
            Maximum 20 % du panier en points. Combinable avec codes promo.
          </p>
        </div>
        <div>
          <p className="ui-caps text-or-dark text-[10px] tracking-widest">Validité</p>
          <p className="font-display text-noir mt-2 text-2xl font-medium">12 mois</p>
          <p className="text-encre/65 mt-1 text-xs">
            À partir de la date de crédit. Les points expirent les premiers (FIFO).
          </p>
        </div>
      </section>

      {/* Historique */}
      <section>
        <header className="mb-6 flex items-center gap-3">
          <Calendar className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
            Historique
          </h2>
        </header>

        {history.data.length === 0 ? (
          <p className="font-italic-editorial text-encre/65 border-encre/10 bg-ivoire-light border p-8 text-center text-base">
            Vous n'avez pas encore de transactions de points. Votre première commande commencera
            le compteur.
          </p>
        ) : (
          <ul className="border-encre/10 divide-encre/8 divide-y border">
            {history.data.map((tx) => {
              const meta = REASON_LABELS[tx.reason] ?? {
                label: tx.reason,
                icon: Sparkles,
                tone: 'earn' as const,
              };
              const isPositive = tx.points > 0;
              return (
                <li
                  key={tx.id}
                  className="bg-ivoire flex flex-col items-start justify-between gap-3 px-5 py-4 md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <meta.icon
                      className={
                        isPositive ? 'text-or-dark size-4' : 'text-rouge size-4'
                      }
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="font-display text-noir text-base font-medium">
                        {meta.label}
                      </p>
                      {tx.notes ? (
                        <p className="text-encre/60 text-xs">{tx.notes}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="text-right">
                      <p
                        className={
                          isPositive
                            ? 'font-display tabular text-or-dark text-lg font-medium'
                            : 'font-display tabular text-rouge text-lg font-medium'
                        }
                      >
                        {isPositive ? '+' : ''}
                        {tx.points} pts
                      </p>
                      <p className="text-encre/55 text-[10px] tracking-widest uppercase">
                        Solde : {tx.balanceAfter}
                      </p>
                    </div>
                    <p className="text-encre/55 text-xs tabular">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
