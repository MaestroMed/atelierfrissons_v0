import { cn } from '@/lib/utils';

type WordmarkSize = 'xs' | 'sm' | 'md' | 'lg' | 'hero';
type WordmarkColor = 'or' | 'ivoire' | 'noir';
type WordmarkLayout = 'inline' | 'stacked';

interface WordmarkProps {
  as?: 'h1' | 'h2' | 'p' | 'span' | 'div';
  size?: WordmarkSize;
  color?: WordmarkColor;
  layout?: WordmarkLayout;
  /** Masque le texte aux lecteurs d'écran (utile quand dupliqué). */
  ariaHidden?: boolean;
  /** Label accessible si masqué ou si `as='span'` */
  srLabel?: string;
  /** Animation lettre-par-lettre (hero uniquement). */
  animate?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<WordmarkSize, string> = {
  xs: 'text-xs md:text-sm',
  sm: 'text-sm md:text-base',
  md: 'text-lg md:text-xl',
  lg: 'text-3xl md:text-4xl',
  hero: 'text-[clamp(3.5rem,10vw,9rem)]',
};

const COLOR_CLASS: Record<WordmarkColor, string> = {
  or: 'text-or',
  ivoire: 'text-ivoire',
  noir: 'text-noir',
};

/**
 * Wordmark « ATELIER FRISSON » — composant réutilisable.
 *
 * - `inline` (défaut) : une seule ligne « ATELIER FRISSON »
 * - `stacked`         : deux lignes « ATELIER / FRISSON » pour le hero
 * - `animate`         : révélation lettre-par-lettre (hero scene)
 *
 * Typographie Bodoni Moda 600, tracking serré (0.04-0.08em), couleur or par défaut.
 * Conforme à la capture homepage validée par Odelie.
 */
export function Wordmark({
  as: Tag = 'span',
  size = 'md',
  color = 'or',
  layout = 'inline',
  ariaHidden = false,
  srLabel = 'Atelier Frisson',
  animate = false,
  className,
}: WordmarkProps) {
  const isHero = size === 'hero' || layout === 'stacked';
  const classes = cn(
    isHero ? 'wordmark-hero' : 'wordmark',
    SIZE_CLASS[size],
    COLOR_CLASS[color],
    'uppercase',
    className,
  );

  const extraProps = ariaHidden ? { 'aria-hidden': true as const } : {};

  if (layout === 'stacked') {
    return (
      <Tag className={cn(classes, 'flex flex-col items-center')} {...extraProps}>
        {!ariaHidden ? <span className="sr-only">{srLabel}</span> : null}
        <AnimatedLine text="ATELIER" animate={animate} delayStart={0} />
        <AnimatedLine text="FRISSON" animate={animate} delayStart={7} />
      </Tag>
    );
  }

  if (animate) {
    return (
      <Tag className={cn(classes, 'reveal-letters')} {...extraProps}>
        {!ariaHidden ? <span className="sr-only">{srLabel}</span> : null}
        <AnimatedLine text="ATELIER FRISSON" animate delayStart={0} />
      </Tag>
    );
  }

  return (
    <Tag className={classes} {...extraProps}>
      {ariaHidden ? 'ATELIER FRISSON' : <span aria-label={srLabel}>ATELIER FRISSON</span>}
    </Tag>
  );
}

function AnimatedLine({
  text,
  animate,
  delayStart,
}: {
  text: string;
  animate: boolean;
  delayStart: number;
}) {
  if (!animate) {
    return <span aria-hidden="true">{text}</span>;
  }
  return (
    <span aria-hidden="true" className="inline-flex">
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{ animationDelay: `${(delayStart + i) * 55}ms` }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
