import { cn } from '@/lib/utils';

type ContainerWidth = 'default' | 'narrow' | 'wide' | 'full';

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'nav';
  width?: ContainerWidth;
  /** Retire les gouttières horizontales (pour overflow ou hero full-bleed). */
  noPadding?: boolean;
}

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-[1440px]',
  wide: 'max-w-[1680px]',
  full: 'max-w-none',
};

/**
 * Conteneur responsive avec max-width éditoriale.
 *
 * - `narrow` (768px) pour corps d'articles longs
 * - `default` (1440px) pour layout standard
 * - `wide` (1680px) pour listings produits denses
 * - `full` (100%) pour sections full-bleed (hero split, grands visuels)
 */
export function Container({
  as: Tag = 'div',
  width = 'default',
  noPadding = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full',
        WIDTH_CLASS[width],
        !noPadding && 'px-6 md:px-10',
        className,
      )}
      {...props}
    />
  );
}
