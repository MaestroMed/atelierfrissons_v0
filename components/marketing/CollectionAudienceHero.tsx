import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';

export type AudienceTone = 'couples' | 'elle' | 'lui' | 'cadeaux';

interface CollectionAudienceHeroProps {
  /** Tonalité audience pivot V2. */
  tone: AudienceTone;
  /** Petit label (ex: « Collection — 12 pièces »). */
  caption: string;
  /** Titre XXL (« Pour Vous Deux », « Pour Elle »…). */
  title: string;
  /** Sous-titre italique. */
  subtitle: string;
  /** Manifeste court (2-4 lignes). */
  manifesto: string;
  /** Optionnel : un mot-clé d'ambiance affiché en filigrane énorme. */
  ambientWord?: string;
}

/**
 * Hero immersif des pages /collections/{couples,elle,lui,cadeaux}.
 *
 * Variantes visuelles :
 *   - couples → rouge laqué + or
 *   - elle    → ivoire + or
 *   - lui     → noir velours + or
 *   - cadeaux → ivoire + or + accents oxblood
 *
 * Layout 2 colonnes : silhouette grand format + bloc éditorial.
 * Server Component, no JS.
 */
export function CollectionAudienceHero({
  tone,
  caption,
  title,
  subtitle,
  manifesto,
  ambientWord,
}: CollectionAudienceHeroProps) {
  const isDark = tone === 'lui';
  const isCouples = tone === 'couples';

  const bgClass = isCouples
    ? 'bg-rouge text-ivoire'
    : isDark
      ? 'bg-noir text-ivoire'
      : 'bg-ivoire-light text-encre';

  const titleClass = isCouples || isDark ? 'text-or' : 'text-noir';
  const subtitleClass = isCouples || isDark ? 'text-or-light' : 'text-or-dark';
  const manifestoClass = isCouples || isDark ? 'text-ivoire/85' : 'text-encre/85';
  const captionClass = isCouples || isDark ? 'text-or' : 'text-or-dark';
  const ambientClass = isCouples
    ? 'text-or/[0.06]'
    : isDark
      ? 'text-or/[0.06]'
      : 'text-noir/[0.04]';

  const glowClass = isCouples
    ? '[background:radial-gradient(ellipse_at_25%_30%,rgba(255,220,180,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_85%_70%,rgba(201,163,107,0.18)_0%,transparent_55%)]'
    : isDark
      ? '[background:radial-gradient(ellipse_at_25%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_85%_70%,rgba(139,20,36,0.15)_0%,transparent_60%)]'
      : '[background:radial-gradient(ellipse_at_25%_30%,rgba(255,255,255,0.7)_0%,transparent_60%),radial-gradient(ellipse_at_85%_70%,rgba(201,163,107,0.12)_0%,transparent_55%)]';

  return (
    <section
      aria-labelledby={`collection-${tone}-title`}
      className={cn('relative isolate flex min-h-[80dvh] items-stretch overflow-hidden', bgClass)}
    >
      {/* Glow ambient */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 opacity-60', glowClass)}
      />

      {/* Mot d'ambiance en filigrane énorme */}
      {ambientWord ? (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none',
            'font-display leading-none font-medium tracking-tighter',
            'text-[clamp(10rem,28vw,24rem)]',
            ambientClass,
          )}
        >
          {ambientWord}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 py-16 md:px-10 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Silhouette grand format */}
        <div className="flex items-center justify-center">
          <ProductSilhouette
            variant={tone === 'lui' ? 'nuit' : 'jour'}
            className="h-[50vh] max-h-[560px] motion-safe:animate-[float-audience_8s_ease-in-out_infinite]"
          />
          <style>{`
            @keyframes float-audience {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(0.5deg); }
            }
          `}</style>
        </div>

        {/* Bloc éditorial */}
        <div className="flex flex-col gap-6">
          <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
          <p className={cn('ui-caps inline-flex items-center gap-3 text-xs', captionClass)}>
            <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
            {caption}
          </p>
          <h1
            id={`collection-${tone}-title`}
            className={cn(
              'font-display font-medium tracking-tight',
              'text-[clamp(3rem,9vw,7.5rem)] leading-[0.95]',
              titleClass,
            )}
          >
            {title}
          </h1>
          <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
          <p className={cn('font-italic-editorial text-lg md:text-xl', subtitleClass)}>
            {subtitle}
          </p>
          <p className={cn('mt-3 max-w-xl text-base leading-relaxed md:text-lg', manifestoClass)}>
            {manifesto}
          </p>
        </div>
      </div>
    </section>
  );
}
