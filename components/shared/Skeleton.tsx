import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  /** Variante visuelle — `card` pour les rectangles produit, `text` pour les lignes. */
  variant?: 'card' | 'text' | 'circle' | 'block';
}

/**
 * Bloc skeleton de chargement — tonalité maison (ivoire-dark + or pulse).
 *
 * Pas de `animate-pulse` Tailwind par défaut (trop saccadé) — on utilise
 * un shimmer linéaire 2s ease-in-out infinite via gradient.
 *
 * Respecte `prefers-reduced-motion` : devient un bloc statique.
 */
export function Skeleton({ className, variant = 'block' }: SkeletonProps) {
  const variantClass =
    variant === 'card'
      ? 'aspect-[4/5] w-full'
      : variant === 'text'
        ? 'h-3 w-full'
        : variant === 'circle'
          ? 'aspect-square rounded-full'
          : '';
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-encre/8 relative overflow-hidden',
        'motion-safe:from-encre/8 motion-safe:via-or/15 motion-safe:to-encre/8 motion-safe:bg-gradient-to-r',
        'motion-safe:bg-[length:200%_100%]',
        'motion-safe:animate-[shimmer_2s_ease-in-out_infinite]',
        variantClass,
        className,
      )}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Card skeleton calé sur les dimensions d'un ProductCardPreview.
 * Layout : image carrée + 3 lignes texte + prix.
 */
export function ProductCardSkeleton() {
  return (
    <div className="border-encre/5 bg-ivoire flex flex-col gap-3 border p-4">
      <Skeleton variant="card" className="mb-3" />
      <Skeleton variant="text" className="h-4 w-1/3" />
      <Skeleton variant="text" className="h-5 w-2/3" />
      <Skeleton variant="text" className="w-full" />
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <Skeleton variant="text" className="h-5 w-16" />
        <Skeleton variant="text" className="h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * Grille de cards skeleton — utilisée comme fallback Suspense
 * sur /boutique, /collections/{jour,nuit}, /admin/produits.
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

/** Skeleton pour les lignes de liste (commandes, clients admin). */
export function ListRowSkeleton() {
  return (
    <div className="border-encre/8 flex items-center gap-4 border-b py-4">
      <Skeleton variant="circle" className="size-10 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-3 w-1/3" />
        <Skeleton variant="text" className="h-3 w-2/3" />
      </div>
      <Skeleton variant="text" className="h-3 w-20 shrink-0" />
    </div>
  );
}

/** Skeleton pour le compte dashboard. */
export function AccountDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton variant="text" className="h-8 w-1/2" />
      <Skeleton variant="text" className="h-4 w-2/3" />
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    </div>
  );
}
