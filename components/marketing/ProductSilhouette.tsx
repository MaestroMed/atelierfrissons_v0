import { cn } from '@/lib/utils';

type Variant = 'jour' | 'nuit';

interface ProductSilhouetteProps {
  variant: Variant;
  className?: string;
  /** Masque aux lecteurs d'écran (par défaut : décoratif). */
  decorative?: boolean;
  /** Retarde l'animation d'entrée (en ms) pour séquencer avec le wordmark. */
  animationDelayMs?: number;
}

/**
 * Silhouette d'objet Atelier Frisson — version SVG abstraite et éditoriale.
 *
 * Remplacera les photos produit réelles une fois le catalogue CJ validé et
 * les shootings livrés. La forme est volontairement sculpturale (inspiration
 * Brancusi, Noguchi) — objet ergonomique avec une branche secondaire et une
 * base portant le monogramme AF en or.
 *
 * Deux variantes :
 *   - `jour` : silicone crème, lumière diffuse, fond ivoire
 *   - `nuit` : silicone noir glossy, éclairage directionnel, fond rouge laqué
 *
 * Le dégradé intérieur simule le rendu silicone médical mat/glossy et donne
 * volume sans recourir à une photo réelle.
 */
export function ProductSilhouette({
  variant,
  className,
  decorative = true,
  animationDelayMs = 120,
}: ProductSilhouetteProps) {
  const isJour = variant === 'jour';
  const gradientId = `af-silhouette-${variant}`;
  const shadowId = `af-shadow-${variant}`;
  const monogramId = `af-monogram-${variant}`;

  return (
    <svg
      viewBox="0 0 200 560"
      {...(decorative ? { 'aria-hidden': true, role: 'presentation' } : {})}
      className={cn(
        'block h-auto w-auto max-h-[70vh] drop-shadow-lg will-change-transform',
        '[animation:var(--animate-fade-up)]',
        className,
      )}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <defs>
        {/* Gradient vertical — simule le reflet silicone */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          {isJour ? (
            <>
              <stop offset="0%" stopColor="#FBF7EF" />
              <stop offset="45%" stopColor="#F0E4CF" />
              <stop offset="100%" stopColor="#D8C9AE" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#26201D" />
              <stop offset="40%" stopColor="#0A0706" />
              <stop offset="100%" stopColor="#161110" />
            </>
          )}
        </linearGradient>

        {/* Highlight glossy (côté NUIT surtout) */}
        <linearGradient id={`${gradientId}-highlight`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={isJour ? 0.6 : 0.35} />
          <stop offset="35%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Ombre portée sous la base */}
        <radialGradient id={shadowId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(10,7,6,0.4)" />
          <stop offset="100%" stopColor="rgba(10,7,6,0)" />
        </radialGradient>

        {/* Pattern monogramme AF */}
        <symbol id={monogramId} viewBox="0 0 40 20">
          <text
            x="20"
            y="14"
            textAnchor="middle"
            fontFamily="Bodoni Moda, Didot, serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.5"
            fill="#C9A36B"
          >
            AF
          </text>
        </symbol>
      </defs>

      {/* Ombre portée sous la base */}
      <ellipse cx="100" cy="535" rx="62" ry="10" fill={`url(#${shadowId})`} />

      {/* Corps principal — forme élancée avec branche secondaire */}
      <g>
        {/* Corps vertical principal */}
        <path
          d="
            M 100 40
            C 72 40, 58 70, 58 110
            C 58 155, 66 180, 70 220
            C 74 260, 72 310, 74 360
            C 76 410, 80 450, 88 480
            L 112 480
            C 120 450, 124 410, 126 360
            C 128 310, 126 260, 130 220
            C 134 180, 142 155, 142 110
            C 142 70, 128 40, 100 40
            Z
          "
          fill={`url(#${gradientId})`}
          stroke={isJour ? 'rgba(168,132,73,0.08)' : 'rgba(0,0,0,0.4)'}
          strokeWidth="0.5"
        />

        {/* Branche secondaire (le « second geste ») */}
        <path
          d="
            M 134 160
            C 150 155, 165 150, 170 135
            C 175 120, 172 105, 160 105
            C 150 105, 140 125, 136 145
            C 134 155, 133 160, 134 160
            Z
          "
          fill={`url(#${gradientId})`}
          stroke={isJour ? 'rgba(168,132,73,0.08)' : 'rgba(0,0,0,0.4)'}
          strokeWidth="0.5"
        />

        {/* Highlight glossy vertical */}
        <path
          d="
            M 100 42
            C 80 42, 66 70, 66 110
            C 66 150, 72 185, 76 230
            L 82 230
            C 78 185, 72 150, 72 110
            C 72 70, 82 42, 100 42
            Z
          "
          fill={`url(#${gradientId}-highlight)`}
          opacity={isJour ? '0.55' : '0.4'}
        />

        {/* Base pedestal */}
        <rect
          x="72"
          y="478"
          width="56"
          height="24"
          rx="2"
          fill={isJour ? '#E5DAC9' : '#080606'}
        />
        <rect
          x="72"
          y="502"
          width="56"
          height="5"
          rx="1"
          fill="#C9A36B"
          opacity="0.9"
        />

        {/* Monogramme AF */}
        <use href={`#${monogramId}`} x="80" y="482" width="40" height="20" />
      </g>
    </svg>
  );
}
