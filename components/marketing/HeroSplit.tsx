import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Wordmark } from '@/components/layout/Wordmark';
import { Fleuron } from '@/components/layout/Fleuron';
import { ProductSilhouette } from './ProductSilhouette';
import { cn } from '@/lib/utils';

interface HeroSplitProps {
  className?: string;
  /** Texte du CTA principal. */
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * HeroSplit JOUR/NUIT — signature Atelier Frisson.
 *
 * - Desktop : deux moitiés 50/50 (ivoire crème à gauche, rouge laqué à droite)
 *             avec deux silhouettes d'objet en miroir et le wordmark or
 *             superposé au centre sur les deux colonnes.
 * - Mobile  : stacked (JOUR au-dessus, NUIT au-dessous) avec le wordmark
 *             inséré entre les deux blocs.
 *
 * Animations :
 *   - Révélation lettre-par-lettre du wordmark (700ms, stagger 55ms)
 *   - Silhouettes : fade-up décalé (120ms/240ms)
 *   - Tagline : fade-in 900ms après le wordmark
 *
 * Vidéo Mux en background : phase 2 (voir CLAUDE.md §4.5).
 */
export function HeroSplit({
  className,
  ctaLabel = 'Découvrir la collection',
  ctaHref = '/boutique',
}: HeroSplitProps) {
  return (
    <section
      aria-label="Atelier Frisson — collection JOUR et NUIT"
      className={cn('relative isolate overflow-hidden', className)}
    >
      {/* ─────────── Deux moitiés ─────────── */}
      <div className="relative grid min-h-[calc(100dvh-7rem)] grid-cols-1 md:grid-cols-2 md:min-h-[calc(100dvh-5rem)]">
        {/* JOUR */}
        <div className="relative flex items-center justify-center overflow-hidden bg-ivoire">
          <span
            aria-hidden="true"
            className="ui-caps-md absolute left-6 top-6 font-display text-sm tracking-[0.2em] text-noir/80 md:left-10 md:top-8"
          >
            JOUR
          </span>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8)_0%,transparent_55%)]"
          />
          <ProductSilhouette
            variant="jour"
            animationDelayMs={120}
            className="relative z-10 pl-6 pr-6 md:-translate-x-6 md:pl-0"
          />
        </div>

        {/* NUIT */}
        <div className="relative flex items-center justify-center overflow-hidden bg-rouge">
          <span
            aria-hidden="true"
            className="ui-caps-md absolute right-6 top-6 font-display text-sm tracking-[0.2em] text-ivoire/90 md:right-10 md:top-8"
          >
            NUIT
          </span>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_70%_30%,rgba(255,220,180,0.15)_0%,transparent_60%)]"
          />
          <ProductSilhouette
            variant="nuit"
            animationDelayMs={240}
            className="relative z-10 md:translate-x-6"
          />
        </div>

        {/* ─────────── Overlay wordmark centré ─────────── */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center',
            'px-6 text-center',
          )}
        >
          <Fleuron
            variant="divider"
            size="md"
            color="or"
            className="pointer-events-auto mb-5 opacity-80 [animation:var(--animate-fleuron)]"
          />
          <Wordmark
            as="h1"
            size="hero"
            color="or"
            layout="stacked"
            animate
            className="pointer-events-auto [text-shadow:0_1px_16px_rgba(10,7,6,0.25)]"
          />
          <p
            className={cn(
              'pointer-events-auto mt-6 max-w-2xl font-italic-editorial text-lg text-or md:text-xl lg:text-2xl',
              '[animation:var(--animate-fade-in)_800ms_700ms_both]',
            )}
            style={{ textShadow: '0 1px 12px rgba(10,7,6,0.3)' }}
          >
            Pour tous les rituels. Pour tous les moments.
          </p>
          <Link
            href={ctaHref}
            className={cn(
              'pointer-events-auto mt-10 inline-flex items-center gap-3',
              'border border-or/80 px-8 py-4',
              'ui-caps-md text-or',
              'transition-all duration-300',
              'hover:border-or hover:bg-or hover:text-noir',
              'focus-visible:border-or focus-visible:bg-or focus-visible:text-noir',
              '[animation:var(--animate-fade-up)_800ms_900ms_both]',
            )}
          >
            <span>{ctaLabel}</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Fleuron
            variant="divider"
            size="md"
            color="or"
            className="pointer-events-auto mt-10 opacity-50 [animation:var(--animate-fleuron)_800ms_1100ms_both]"
          />
        </div>
      </div>
    </section>
  );
}
