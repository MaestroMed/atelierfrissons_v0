import { BadgeCheck } from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import { ReviewStars } from './ReviewStars';
import { formatDate } from '@/lib/format';
import type { MockReview, ReviewSummary } from '@/lib/mock/reviews';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  reviews: readonly MockReview[];
  summary: ReviewSummary | null;
  className?: string;
}

/**
 * Section avis sur fiche produit — sobre, éditoriale, sans CTA de collecte
 * (la collecte se fait en post-purchase via Klaviyo flow).
 *
 * Structure :
 *   1. Synthèse : moyenne + nombre d'avis + histogramme par étoile
 *   2. Liste complète (tous les avis — max 20 par design, ce qui tient sans
 *      pagination pour la V1)
 *
 * Rendu Server Component — aucun JS client pour ne pas alourdir le LCP.
 * Ajout d'un modal de filtre / tri en Sprint 8 si besoin.
 */
export function ReviewsSection({ reviews, summary, className }: ReviewsSectionProps) {
  if (!summary || reviews.length === 0) return null;

  const maxCount = Math.max(...summary.distribution);

  return (
    <section
      aria-labelledby="reviews-heading"
      className={cn(
        'border-encre/10 grid gap-10 border-t pt-16 md:grid-cols-[1fr_2fr] md:gap-16',
        className,
      )}
    >
      <div>
        <p className="ui-caps text-or-dark">Paroles de clientes</p>
        <h2
          id="reviews-heading"
          className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl"
        >
          Les avis <span className="font-italic-editorial text-or-dark">vérifiés</span>
        </h2>
        <Fleuron variant="divider" size="md" color="or" className="mt-5 opacity-70" />

        {/* Synthèse */}
        <div className="mt-8 flex flex-col gap-5">
          <div className="flex items-baseline gap-3">
            <span className="font-display tabular text-noir text-5xl font-medium">
              {summary.averageRating.toFixed(1)}
            </span>
            <span className="text-encre/55 text-sm">/ 5</span>
          </div>
          <ReviewStars rating={summary.averageRating} size="lg" />
          <p className="text-encre/65 text-sm">
            {summary.count} avis vérifié{summary.count > 1 ? 's' : ''} — achats clients confirmés
          </p>

          {/* Histogramme par étoile */}
          <ul className="mt-4 flex flex-col gap-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = summary.distribution[star - 1] ?? 0;
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <li key={star} className="flex items-center gap-3 text-xs">
                  <span className="tabular text-encre/65 w-4">{star}</span>
                  <span
                    aria-hidden="true"
                    className="text-or-dark inline-block"
                    style={{ fontSize: '0.7rem' }}
                  >
                    ★
                  </span>
                  <span className="bg-encre/10 relative h-1.5 flex-1 overflow-hidden">
                    <span
                      className="bg-or-dark absolute inset-y-0 left-0"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="tabular text-encre/55 w-8 text-right">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Liste des avis */}
      <ul className="flex flex-col gap-8">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-encre/10 flex flex-col gap-3 border-b pb-8 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <ReviewStars rating={review.rating} size="sm" />
              <time
                dateTime={review.createdAt.toISOString()}
                className="ui-caps text-encre/50 text-[10px]"
              >
                {formatDate(review.createdAt)}
              </time>
            </div>
            {review.title ? (
              <h3 className="font-display text-noir text-lg font-medium md:text-xl">
                {review.title}
              </h3>
            ) : null}
            <blockquote className="font-italic-editorial text-encre/85 text-base leading-relaxed md:text-lg">
              <span aria-hidden="true" className="text-or">
                «&nbsp;
              </span>
              {review.body}
              <span aria-hidden="true" className="text-or">
                &nbsp;»
              </span>
            </blockquote>
            <footer className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="ui-caps text-noir">— {review.authorName}</span>
              {review.authorLocation ? (
                <span className="text-encre/55">· {review.authorLocation}</span>
              ) : null}
              {review.isVerifiedPurchase ? (
                <span className="ui-caps text-or-dark/80 inline-flex items-center gap-1 text-[10px]">
                  <BadgeCheck className="size-3" aria-hidden="true" strokeWidth={1.5} />
                  Achat vérifié
                </span>
              ) : null}
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
