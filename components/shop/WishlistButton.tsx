'use client';

import { useEffect, useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { WISHLIST_COOKIE } from '@/lib/wishlist/types';
import { toggleWishlistAction } from '@/lib/wishlist/actions';

interface WishlistButtonProps {
  slug: string;
  productName: string;
  /** Variante visuelle — `overlay` pour par-dessus une carte, `inline` pour pleine page. */
  variant?: 'overlay' | 'inline' | 'inline-compact';
  /** Appliqué en plus du style de base. */
  className?: string;
  /** Si renseigné, sera utilisé comme état initial (évite le flash côté serveur). */
  initialActive?: boolean;
}

/**
 * Bouton « ajouter aux favoris » — toggle optimiste avec persistance cookie
 * via Server Action `toggleWishlistAction`.
 *
 * Hydratation : lit le cookie `af_wishlist` au mount pour éviter un flash
 * si le bouton est rendu depuis un Server Component qui ne connaît pas
 * l'état wishlist (ex: ProductCard sur la boutique). Si le parent peut
 * passer `initialActive` (ex: depuis `/compte/favoris`), on l'utilise
 * d'emblée sans lire le cookie.
 *
 * Trois variantes visuelles :
 *   - `overlay` : bouton rond glossy à poser sur une card produit
 *   - `inline`  : bouton carré minimal, pour la colonne sticky fiche produit
 *   - `inline-compact` : idem inline mais plus petit (panier drawer)
 *
 * Utilise `sonner` pour feedback (ajouté / retiré), avec action « Voir mes
 * favoris » dans le toast pour ajouter de la découvrabilité.
 */
export function WishlistButton({
  slug,
  productName,
  variant = 'overlay',
  className,
  initialActive,
}: WishlistButtonProps) {
  const [active, setActive] = useState<boolean>(initialActive ?? false);
  const [mounted, setMounted] = useState(false);
  const [pending, startTransition] = useTransition();

  // ── Hydratation depuis le cookie ──────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (initialActive !== undefined) return;
    // Lit le cookie côté client pour déterminer l'état initial sans round-trip
    const cookie = document.cookie.split('; ').find((c) => c.startsWith(`${WISHLIST_COOKIE}=`));
    if (!cookie) return;
    const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
    const slugs = value
      .split(',')
      .map((entry) => entry.split(':')[0])
      .filter(Boolean);
    setActive(slugs.includes(slug));
  }, [slug, initialActive]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Optimistic flip
    const next = !active;
    setActive(next);

    startTransition(async () => {
      try {
        const result = await toggleWishlistAction(slug);
        // Synchronise avec la source de vérité (au cas où)
        setActive(result.added);
        toast(
          result.added ? `${productName} ajouté aux favoris` : `${productName} retiré des favoris`,
          result.added
            ? {
                duration: 3500,
                action: {
                  label: 'Voir mes favoris',
                  onClick: () => {
                    window.location.href = '/compte/favoris';
                  },
                },
              }
            : { duration: 2500 },
        );
      } catch (err) {
        // Rollback si erreur
        setActive(!next);
        toast.error('Impossible de mettre à jour les favoris');
        console.error('[WishlistButton] toggle failed:', err);
      }
    });
  };

  const label = active
    ? `Retirer ${productName} des favoris`
    : `Ajouter ${productName} aux favoris`;

  // ── Styles par variante ───────────────────────────────────────────
  const baseStyles = cn(
    'inline-flex items-center justify-center transition-all duration-300',
    'focus-visible:outline-offset-2',
    'disabled:opacity-60',
  );

  const variantStyles =
    variant === 'overlay'
      ? cn(
          'size-10 rounded-full shadow-card',
          'bg-ivoire/92 supports-backdrop-filter:bg-ivoire/75 supports-backdrop-filter:backdrop-blur-sm',
          'hover:scale-110 hover:bg-ivoire active:scale-95',
          active ? 'text-rouge' : 'text-noir/70 hover:text-noir',
        )
      : variant === 'inline'
        ? cn(
            'size-12 rounded-sm border',
            active
              ? 'border-rouge bg-rouge/5 text-rouge'
              : 'border-noir/20 text-noir hover:border-noir',
          )
        : cn('size-8 rounded-sm', active ? 'text-rouge' : 'text-noir/60 hover:text-noir');

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      aria-busy={pending ? 'true' : undefined}
      disabled={!mounted && initialActive === undefined}
      className={cn(baseStyles, variantStyles, className)}
    >
      <Heart
        className={cn(
          'transition-all duration-300',
          variant === 'overlay' ? 'size-4' : variant === 'inline' ? 'size-5' : 'size-4',
          active ? 'scale-110' : 'scale-100',
        )}
        aria-hidden="true"
        strokeWidth={1.5}
        fill={active ? 'currentColor' : 'none'}
      />
    </button>
  );
}
