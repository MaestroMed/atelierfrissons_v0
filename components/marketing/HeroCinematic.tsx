import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Wordmark } from '@/components/layout/Wordmark';
import { Fleuron } from '@/components/layout/Fleuron';
import { cn } from '@/lib/utils';
import {
  HEROS,
  VIDEOS,
  getAssetUrl,
  getVideoUrl,
} from '@/lib/assets/atelier-frisson-visuals';

interface HeroCinematicProps {
  className?: string;
  /** Bouton CTA principal — destination + libellé. */
  ctaHref?: string;
  ctaLabel?: string;
}

/**
 * HeroCinematic — Hero full-bleed 21:9 cinemascope.
 *
 * Hiérarchie de rendu (du meilleur au fallback) :
 *   1. Vidéo `seedance_2_0` Hero master (8s, 1080p, dolly-in lent + flicker bougie),
 *      jouée en `autoplay muted loop playsinline`.
 *   2. Si la vidéo n'est pas disponible (génération en cours, ou
 *      `prefers-reduced-motion: reduce`) → image poster cinemascope statique
 *      (Hero #8 `rituelCinematic`, blue-hour bedroom Wong Kar-wai).
 *
 * Conformité a11y :
 *   - Vidéo muette + `aria-hidden` (décorative)
 *   - Fallback poster respecté pour `prefers-reduced-motion: reduce` via CSS
 *     `motion-reduce:hidden` sur le <video>
 *   - Texte critique (Wordmark + tagline + CTA) en SSR — pas de dépendance JS
 *     pour le contenu indexable
 *
 * Usage : peut remplacer ou compléter `HeroSplit` sur la home. Si déployé en
 * complément, placer en `<section>` au-dessus de `HeroSplit`.
 */
export function HeroCinematic({
  className,
  ctaHref = '/collections/couples',
  ctaLabel = 'Découvrir le rituel à deux',
}: HeroCinematicProps) {
  const hero = HEROS.rituelCinematic;
  const video = VIDEOS.heroMaster;
  const heroUrl = getAssetUrl(hero);
  const videoUrl = getVideoUrl(video);

  return (
    <section
      aria-label="Atelier Frisson — l'heure bleue"
      data-cursor-follower-zone="true"
      className={cn(
        'relative isolate overflow-hidden bg-noir',
        // 21:9 sur desktop, hauteur fixe contrôlée sur mobile pour densité info
        'aspect-[21/9] min-h-[60dvh] md:min-h-[70dvh]',
        className,
      )}
    >
      {/* ── Background : video > image fallback ─────────────────────────── */}
      {videoUrl ? (
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroUrl ?? undefined}
          className="absolute inset-0 size-full object-cover motion-reduce:hidden"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}
      {/* Image poster — toujours rendue (en dessous de la vidéo) pour SSR/SEO
          et activée en fallback `motion-reduce`. */}
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className={cn(
            'absolute inset-0 size-full object-cover',
            // Quand la vidéo joue, on cache l'image (sauf en reduced-motion).
            videoUrl ? '-z-10 motion-reduce:z-0' : '',
          )}
        />
      ) : null}

      {/* ── Vignette sombre + grain subtil pour lisibilité ───────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(10,7,6,0.55)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:3px_3px]"
      />

      {/* ── Contenu textuel ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex size-full items-center justify-center px-6 text-center md:px-12">
        <div className="flex max-w-3xl flex-col items-center">
          <Fleuron variant="divider" size="md" color="or" className="mb-6 opacity-80" />
          <Wordmark
            as="h1"
            size="hero"
            color="or"
            layout="stacked"
            animate
            className="scroll-italic-axis [text-shadow:0_2px_24px_rgba(10,7,6,0.5)]"
          />
          <p
            className="font-italic-editorial text-or md:text-xl lg:text-2xl mt-6 max-w-xl text-lg [animation:var(--animate-fade-in)_900ms_700ms_both]"
            style={{ textShadow: '0 1px 14px rgba(10,7,6,0.5)' }}
          >
            Pour tous les rituels. Pour tous les moments.
          </p>
          <Link
            href={ctaHref}
            className={cn(
              'mt-10 inline-flex items-center gap-3',
              'border-or/80 border px-8 py-4',
              'ui-caps-md text-or',
              'transition-[background-color,color,border-color] duration-300',
              'hover:border-or hover:bg-or hover:text-noir',
              'focus-visible:border-or focus-visible:bg-or focus-visible:text-noir',
              '[animation:var(--animate-fade-up)_900ms_900ms_both]',
            )}
          >
            <span>{ctaLabel}</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
