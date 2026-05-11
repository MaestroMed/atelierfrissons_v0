import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';
import { Wordmark } from '@/components/layout/Wordmark';
import { Fleuron } from '@/components/layout/Fleuron';
import { ProductSilhouette } from './ProductSilhouette';
import { MagneticLink } from '@/components/shared/MagneticButton';
import { cn } from '@/lib/utils';

interface HeroSplitProps {
  className?: string;
  /** Si vrai, affiche le bandeau saisonnier Cadeaux Saint-Valentin sous le hero. */
  showSeasonalGiftBanner?: boolean;
}

/**
 * HeroSplit — pivot V2 « Couples 30-50 ».
 *
 * Trois panneaux audience à hauteur d'écran :
 *   - Pour Elle    → ivoire crème, silhouette claire
 *   - Pour Vous Deux → rouge laqué (centre, wordmark + tagline + CTA principal)
 *   - Pour Lui     → noir velours, silhouette sombre
 *
 * Mobile : stack vertical avec le panneau central en hero principal et les
 * deux audiences secondaires en grille 2-col compacte.
 *
 * Animations préservées : reveal lettre-par-lettre du wordmark, fade-up des
 * silhouettes, fade-in du tagline. Cadeaux saisonnier optionnel en bandeau.
 */
export function HeroSplit({ className, showSeasonalGiftBanner = false }: HeroSplitProps) {
  return (
    <section
      aria-label="Atelier Frisson — Pour vous deux, pour elle, pour lui"
      data-cursor-follower-zone="true"
      className={cn('relative isolate overflow-hidden', className)}
    >
      {/* ═══════════ DESKTOP : 3 panels horizontaux ═══════════ */}
      <div className="relative hidden md:grid md:min-h-[calc(100dvh-5rem)] md:grid-cols-[1fr_1.4fr_1fr]">
        {/* ── Panel ELLE (gauche) ──────────────────────────── */}
        <Link
          href="/collections/elle"
          aria-label="Pour Elle — collection objets, lingerie, cosmétique pour elle"
          className="bg-ivoire group relative flex items-center justify-center overflow-hidden focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="ui-caps-md font-display text-noir/85 group-hover:text-or-dark absolute top-8 left-10 text-sm tracking-[0.22em] transition-colors"
          >
            POUR ELLE
          </span>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.85)_0%,transparent_55%)]"
          />
          <ProductSilhouette
            variant="jour"
            animationDelayMs={120}
            className="relative z-10 transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="ui-caps text-or-dark group-hover:text-or absolute bottom-10 left-10 inline-flex items-center gap-2 text-xs transition-all group-hover:gap-3">
            Découvrir
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </Link>

        {/* ── Panel COUPLES (centre, hero principal) ──────── */}
        <div className="bg-rouge text-ivoire relative flex items-center justify-center overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_50%_30%,rgba(255,220,180,0.18)_0%,transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:3px_3px]"
          />
          <span
            aria-hidden="true"
            className="ui-caps-md font-display text-or/90 absolute top-8 left-1/2 -translate-x-1/2 text-sm tracking-[0.22em]"
          >
            POUR VOUS DEUX
          </span>

          {/* Overlay wordmark + tagline + CTA */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center md:px-10">
            <Fleuron
              variant="divider"
              size="md"
              color="or"
              className="mb-5 opacity-80 [animation:var(--animate-fleuron)]"
            />
            <Wordmark
              as="h1"
              size="hero"
              color="or"
              layout="stacked"
              animate
              className="scroll-italic-axis [text-shadow:0_1px_16px_rgba(10,7,6,0.3)]"
            />
            <p
              className="font-italic-editorial text-or md:text-xl lg:text-2xl mt-6 max-w-2xl text-lg [animation:var(--animate-fade-in)_800ms_700ms_both]"
              style={{ textShadow: '0 1px 12px rgba(10,7,6,0.35)' }}
            >
              Pour vous deux. Pour elle. Pour lui.
            </p>
            <MagneticLink
              href="/collections/couples"
              magnetism={8}
              proximity={120}
              className={cn(
                'mt-10 inline-flex items-center gap-3',
                'border-or/80 border px-8 py-4',
                'ui-caps-md text-or',
                'transition-[background-color,color,border-color] duration-300',
                'hover:border-or hover:bg-or hover:text-noir',
                'focus-visible:border-or focus-visible:bg-or focus-visible:text-noir',
                '[animation:var(--animate-fade-up)_800ms_900ms_both]',
              )}
            >
              <span>Découvrir le rituel à deux</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </MagneticLink>
            <Fleuron
              variant="divider"
              size="md"
              color="or"
              className="mt-10 opacity-50 [animation:var(--animate-fleuron)_800ms_1100ms_both]"
            />
          </div>
        </div>

        {/* ── Panel LUI (droite) ──────────────────────────── */}
        <Link
          href="/collections/lui"
          aria-label="Pour Lui — collection objets, accessoires, cosmétique pour lui"
          className="bg-noir text-ivoire group relative flex items-center justify-center overflow-hidden focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="ui-caps-md font-display text-ivoire/85 group-hover:text-or absolute top-8 right-10 text-sm tracking-[0.22em] transition-colors"
          >
            POUR LUI
          </span>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_70%_30%,rgba(201,163,107,0.12)_0%,transparent_60%)]"
          />
          <ProductSilhouette
            variant="nuit"
            animationDelayMs={240}
            className="relative z-10 transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="ui-caps text-or group-hover:text-or-light absolute right-10 bottom-10 inline-flex items-center gap-2 text-xs transition-all group-hover:gap-3">
            Découvrir
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </Link>
      </div>

      {/* ═══════════ MOBILE : 1 hero rouge + grille 2 cols ═══════════ */}
      <div className="md:hidden">
        {/* Hero central rouge */}
        <div className="bg-rouge text-ivoire relative flex min-h-[80dvh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_50%_30%,rgba(255,220,180,0.18)_0%,transparent_60%)]"
          />
          <span
            aria-hidden="true"
            className="ui-caps-md font-display text-or/90 absolute top-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.22em]"
          >
            POUR VOUS DEUX
          </span>
          <Fleuron variant="divider" size="md" color="or" className="mb-4 opacity-80" />
          <Wordmark as="h1" size="hero" color="or" layout="stacked" animate />
          <p className="font-italic-editorial text-or mt-5 text-base">
            Pour vous deux. Pour elle. Pour lui.
          </p>
          <Link
            href="/collections/couples"
            className="border-or/80 ui-caps text-or hover:bg-or hover:text-noir mt-8 inline-flex items-center gap-2 border px-6 py-3 transition-all"
          >
            Découvrir le rituel à deux
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {/* Grille Elle / Lui */}
        <div className="grid grid-cols-2">
          <Link
            href="/collections/elle"
            className="bg-ivoire flex aspect-square flex-col items-center justify-center gap-3 px-4 py-6 text-center"
          >
            <span className="ui-caps-md font-display text-noir/85 text-[11px] tracking-[0.22em]">
              POUR ELLE
            </span>
            <ProductSilhouette variant="jour" className="h-32 w-auto" />
            <span className="ui-caps text-or-dark inline-flex items-center gap-1.5 text-[10px]">
              Découvrir
              <ArrowRight className="size-3" aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/collections/lui"
            className="bg-noir text-ivoire flex aspect-square flex-col items-center justify-center gap-3 px-4 py-6 text-center"
          >
            <span className="ui-caps-md font-display text-ivoire/85 text-[11px] tracking-[0.22em]">
              POUR LUI
            </span>
            <ProductSilhouette variant="nuit" className="h-32 w-auto" />
            <span className="ui-caps text-or inline-flex items-center gap-1.5 text-[10px]">
              Découvrir
              <ArrowRight className="size-3" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {/* ═══════════ Bandeau saisonnier Cadeaux (optionnel) ═══════════ */}
      {showSeasonalGiftBanner ? (
        <Link
          href="/collections/cadeaux"
          className="bg-noir/95 text-ivoire group hover:bg-noir flex items-center justify-center gap-3 border-t border-or/20 px-6 py-4 text-center transition-colors"
        >
          <Gift className="text-or size-4" aria-hidden="true" />
          <span className="ui-caps text-or text-[11px] tracking-[0.18em]">
            Édition Saint-Valentin 2027 — disponible en pré-commande
          </span>
          <ArrowRight
            className="text-or size-3.5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </section>
  );
}
