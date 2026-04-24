'use client';

import { useEffect, useState } from 'react';
import { GitCompareArrows } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { readCompareSlugs, toggleCompare } from '@/lib/compare/storage';
import { COMPARE_MAX_ITEMS } from '@/lib/compare/types';

interface CompareToggleButtonProps {
  slug: string;
  productName: string;
  variant?: 'overlay' | 'inline';
  className?: string;
}

/**
 * Bouton « Comparer » — toggle localStorage + feedback toast.
 *
 * Variants :
 *   - overlay : petit bouton rond sur une carte produit (avec WishlistButton)
 *   - inline : pour la fiche produit (à côté des autres CTA)
 *
 * Écoute `af:compare-updated` pour rester synchro quand d'autres instances
 * (CompareBar, autres cartes) modifient la liste.
 */
export function CompareToggleButton({
  slug,
  productName,
  variant = 'overlay',
  className,
}: CompareToggleButtonProps) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const refresh = () => setActive(readCompareSlugs().includes(slug));
    refresh();
    window.addEventListener('af:compare-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('af:compare-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [slug]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(slug);
    if (result.full) {
      toast.error(`Vous pouvez comparer ${COMPARE_MAX_ITEMS} objets maximum`, {
        duration: 3000,
      });
      return;
    }
    setActive(result.added);
    if (result.added) {
      toast(`${productName} ajouté à la comparaison`, {
        duration: 2500,
        action: {
          label: 'Comparer',
          onClick: () => {
            window.location.href = '/comparer';
          },
        },
      });
    } else {
      toast(`${productName} retiré de la comparaison`, { duration: 2000 });
    }
  };

  const label = active
    ? `Retirer ${productName} de la comparaison`
    : `Ajouter ${productName} à la comparaison`;

  const baseStyles = cn(
    'inline-flex items-center justify-center transition-all duration-300',
    'focus-visible:outline-offset-2',
    'disabled:opacity-60',
  );

  const variantStyles =
    variant === 'overlay'
      ? cn(
          'size-10 rounded-full shadow-card',
          'supports-backdrop-filter:bg-ivoire/75 bg-ivoire/92 supports-backdrop-filter:backdrop-blur-sm',
          'hover:scale-110 hover:bg-ivoire active:scale-95',
          active ? 'text-or-dark' : 'text-noir/70 hover:text-noir',
        )
      : cn(
          'ui-caps inline-flex items-center gap-2 border px-4 py-2 text-[10px] transition-colors',
          active
            ? 'border-or-dark bg-or/8 text-or-dark'
            : 'border-noir/20 text-noir hover:border-noir',
        );

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        disabled={!mounted}
        className={cn(baseStyles, variantStyles, className)}
      >
        <GitCompareArrows className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        {active ? 'En comparaison' : 'Comparer'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      disabled={!mounted}
      className={cn(baseStyles, variantStyles, className)}
    >
      <GitCompareArrows
        className={cn('size-4 transition-transform duration-300', active && 'scale-110')}
        aria-hidden="true"
        strokeWidth={1.5}
      />
    </button>
  );
}
