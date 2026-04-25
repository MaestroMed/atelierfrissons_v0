import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';

interface CollectionImmersiveHeroProps {
  /** Tonalité de la collection. */
  variant: 'jour' | 'nuit';
  /** Petit label (ex: « Collection — 4 objets »). */
  caption: string;
  /** Titre XXL (« JOUR » / « NUIT »). */
  title: string;
  /** Sous-titre italique. */
  subtitle: string;
  /** Manifeste court (2-3 lignes). */
  manifesto: string;
  /** Optionnel : un mot-clé d'ambiance affiché en filigrane. */
  ambientWord?: string;
}

/**
 * Hero plein écran pour /collections/jour et /collections/nuit.
 *
 * Layout 2 colonnes : silhouette grand format à gauche (50% viewport),
 * texte éditorial à droite. Glow ambient adapté à la tonalité, mot
 * d'ambiance en filigrane énorme behind, fleuron crown au-dessus du titre.
 *
 * Server Component — aucun JS. ScrollReveal côté parent si voulu.
 */
export function CollectionImmersiveHero({
  variant,
  caption,
  title,
  subtitle,
  manifesto,
  ambientWord,
}: CollectionImmersiveHeroProps) {
  const isJour = variant === 'jour';

  return (
    <section
      aria-labelledby={`collection-${variant}-title`}
      className={cn(
        'relative isolate flex min-h-[90dvh] items-stretch overflow-hidden',
        isJour ? 'bg-ivoire-light text-encre' : 'bg-rouge text-ivoire',
      )}
    >
      {/* Glow ambient */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-60',
          isJour
            ? '[background:radial-gradient(ellipse_at_25%_30%,rgba(255,255,255,0.7)_0%,transparent_60%),radial-gradient(ellipse_at_85%_70%,rgba(201,163,107,0.12)_0%,transparent_55%)]'
            : '[background:radial-gradient(ellipse_at_70%_30%,rgba(255,220,180,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_15%_75%,rgba(201,163,107,0.18)_0%,transparent_55%)]',
        )}
      />

      {/* Mot d'ambiance en filigrane énorme */}
      {ambientWord ? (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none',
            'font-display leading-none font-medium tracking-tighter',
            'text-[clamp(12rem,30vw,28rem)]',
            isJour ? 'text-noir/[0.04]' : 'text-or/[0.06]',
          )}
        >
          {ambientWord}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 py-20 md:px-10 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Silhouette grand format */}
        <div className="flex items-center justify-center">
          <ProductSilhouette
            variant={variant}
            className={cn(
              'h-[55vh] max-h-[640px] motion-safe:animate-[float-silhouette_8s_ease-in-out_infinite]',
            )}
          />
          <style>{`
            @keyframes float-silhouette {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(0.5deg); }
            }
          `}</style>
        </div>

        {/* Bloc éditorial */}
        <div className="flex flex-col gap-6">
          <Fleuron variant="crown" size="md" color={isJour ? 'or' : 'or'} className="opacity-80" />
          <p
            className={cn(
              'ui-caps inline-flex items-center gap-3 text-xs',
              isJour ? 'text-or-dark' : 'text-or',
            )}
          >
            <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
            {caption}
          </p>
          <h1
            id={`collection-${variant}-title`}
            className={cn(
              'font-display font-medium tracking-tight',
              'text-[clamp(4.5rem,12vw,11rem)] leading-[0.92]',
              isJour ? 'text-noir' : 'text-or',
            )}
          >
            {title}
          </h1>
          <Fleuron
            variant="divider"
            size="md"
            color={isJour ? 'or' : 'or'}
            className="opacity-80"
          />
          <p
            className={cn(
              'font-italic-editorial text-lg md:text-xl',
              isJour ? 'text-or-dark' : 'text-or-light',
            )}
          >
            {subtitle}
          </p>
          <p
            className={cn(
              'mt-3 max-w-xl text-base leading-relaxed md:text-lg',
              isJour ? 'text-encre/85' : 'text-ivoire/85',
            )}
          >
            {manifesto}
          </p>
        </div>
      </div>
    </section>
  );
}
