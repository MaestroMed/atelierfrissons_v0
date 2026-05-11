import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { ReviewStars } from '@/components/shop/ReviewStars';

interface ProductCinematicHeroProps {
  /** Tonalité de la collection. */
  collection:
    | 'couples'
    | 'elle'
    | 'lui'
    | 'cadeaux'
    | 'jour'
    | 'nuit'
    | 'inaugurale'
    | 'signature'
    | null;
  /** Caption (ex: « Collection NUIT · Pièce signature »). */
  caption: string;
  /** Nom du produit (devient h1). */
  name: string;
  /** Tagline éditoriale italique (peut contenir <em>). */
  tagline?: string | null | undefined;
  /** Note moyenne 0-5 + count, optionnel. */
  rating?: { average: number; count: number } | undefined;
  /** Mot d'ambiance affiché en filigrane (souvent JOUR ou NUIT). */
  ambientWord?: string | undefined;
  /** Texte du CTA scroll-down. */
  scrollCueLabel?: string | undefined;
  /**
   * Slug produit — utilisé pour `view-transition-name` afin de morpher la
   * silhouette de la grille (`product-${slug}`) vers ce hero en navigation.
   */
  slug?: string;
}

/**
 * Hero cinématique en bandeau au-dessus de la fiche produit.
 *
 * Mise en scène inspirée de Dior / Aesop / Byredo :
 *   - Tonalité du fond pilotée par la collection (ivoire pour JOUR, rouge
 *     pour NUIT, noir velours pour signature/inaugurale)
 *   - Mot d'ambiance énorme en filigrane derrière (text-white/[0.04])
 *   - Caption small-caps avec filets, h1 Bodoni clamp(2.5–6rem),
 *     tagline italique, fleuron divider, rating cliquable optionnel
 *   - Scroll cue avec ancre vers la zone d'achat (#buy-section)
 *
 * Server Component — aucun JS. La hauteur est un compromis : suffisamment
 * grand pour faire sentir l'objet (60vh), pas trop pour ne pas pousser
 * la zone d'achat sous la pli desktop.
 */
export function ProductCinematicHero({
  collection,
  caption,
  name,
  tagline,
  rating,
  ambientWord,
  scrollCueLabel = 'Voir, lire, acheter',
  slug,
}: ProductCinematicHeroProps) {
  const isNuit = collection === 'nuit';
  const isDarkSignature = collection === 'signature' || collection === 'inaugurale';
  const isDark = isNuit || isDarkSignature;

  const bgClass = isNuit
    ? 'bg-rouge text-ivoire'
    : isDarkSignature
      ? 'bg-noir-velours text-ivoire'
      : 'bg-ivoire-light text-encre';

  const captionTone = isDark ? 'text-or' : 'text-or-dark';
  const fleuronClass = 'opacity-80';
  const taglineTone = isDark ? 'text-or-light' : 'text-or-dark';
  const scrollCueTone = isDark
    ? 'text-ivoire/65 hover:text-or border-ivoire/30 hover:border-or'
    : 'text-encre/55 hover:text-or-dark border-encre/20 hover:border-or';

  return (
    <section
      aria-label={`Présentation — ${name}`}
      className={cn(
        'product-hero relative isolate flex min-h-[60vh] items-center overflow-hidden md:min-h-[65vh]',
        bgClass,
      )}
      style={slug ? { viewTransitionName: `product-${slug}` } : undefined}
    >
      {/* Glow ambient adapté à la tonalité */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-60',
          isNuit &&
            '[background:radial-gradient(ellipse_at_70%_30%,rgba(255,220,180,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_15%_75%,rgba(201,163,107,0.18)_0%,transparent_55%)]',
          isDarkSignature &&
            '[background:radial-gradient(ellipse_at_50%_30%,rgba(201,163,107,0.12)_0%,transparent_55%)]',
          !isDark &&
            '[background:radial-gradient(ellipse_at_25%_30%,rgba(255,255,255,0.7)_0%,transparent_60%),radial-gradient(ellipse_at_85%_70%,rgba(201,163,107,0.12)_0%,transparent_55%)]',
        )}
      />

      {/* Mot d'ambiance énorme en filigrane */}
      {ambientWord ? (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none',
            'font-display leading-none font-medium tracking-tighter',
            'text-[clamp(8rem,22vw,20rem)]',
            isDark ? 'text-or/[0.06]' : 'text-noir/[0.04]',
          )}
        >
          {ambientWord}
        </div>
      ) : null}

      {/* Grain texture (uniquement dark tones) */}
      {isDark ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:3px_3px] mix-blend-overlay"
        />
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-6 py-16 text-center md:px-10 md:py-20">
        <Fleuron variant="crown" size="md" color="or" className={fleuronClass} />

        <p className={cn('ui-caps inline-flex items-center gap-3 text-xs', captionTone)}>
          <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
          {caption}
          <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
        </p>

        <h1
          className={cn(
            'font-display font-medium tracking-tight',
            'text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.96]',
          )}
          style={{ viewTransitionName: `product-name-${name.toLowerCase().replace(/\s+/g, '-')}` }}
        >
          {name}
        </h1>

        <Fleuron variant="divider" size="md" color="or" className={fleuronClass} />

        {tagline ? (
          <p
            className={cn(
              'font-italic-editorial max-w-2xl text-lg leading-relaxed md:text-2xl',
              taglineTone,
            )}
            dangerouslySetInnerHTML={{ __html: tagline }}
          />
        ) : null}

        {/* Rating cliquable — ancre vers la section avis */}
        {rating ? (
          <a
            href="#reviews-heading"
            className={cn(
              'group mt-2 inline-flex items-center gap-2.5 text-sm transition-colors',
              isDark ? 'text-ivoire/85 hover:text-or' : 'text-encre/75 hover:text-or-dark',
            )}
            aria-label={`${rating.count} avis (${rating.average.toFixed(1)} sur 5)`}
          >
            <ReviewStars rating={rating.average} size="sm" />
            <span className="tabular font-medium">{rating.average.toFixed(1)}</span>
            <span
              className={cn('underline underline-offset-2', isDark ? 'opacity-75' : 'opacity-65')}
            >
              {rating.count} avis
            </span>
          </a>
        ) : null}

        {/* Scroll cue — ancre vers la section achat */}
        <Link
          href="#buy-section"
          className={cn(
            'ui-caps mt-8 inline-flex items-center gap-2 border px-5 py-2 text-[10px] transition-colors',
            scrollCueTone,
          )}
        >
          <ArrowDown
            className="size-3.5 motion-safe:animate-[float-arrow-down_2.2s_ease-in-out_infinite]"
            aria-hidden="true"
            strokeWidth={1.5}
          />
          {scrollCueLabel}
        </Link>
        <style>{`
          @keyframes float-arrow-down {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50% { transform: translateY(3px); opacity: 1; }
          }
        `}</style>
      </div>
    </section>
  );
}
