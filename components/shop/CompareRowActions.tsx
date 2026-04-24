'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { removeFromCompare } from '@/lib/compare/storage';

interface CompareRowActionsProps {
  slug: string;
  productName: string;
  className?: string;
}

/**
 * Actions dans la colonne d'un produit sur `/comparer`.
 * Clique sur X → retire de la liste localStorage + met à jour l'URL en
 * supprimant le slug du query `ids` (sans recharger).
 */
export function CompareRowActions({ slug, productName, className }: CompareRowActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRemove = () => {
    removeFromCompare(slug);
    const currentIds = (searchParams.get('ids') ?? '').split(',').filter(Boolean);
    const nextIds = currentIds.filter((s) => s !== slug);
    if (nextIds.length === 0) {
      router.push('/comparer');
    } else {
      router.push(`/comparer?ids=${encodeURIComponent(nextIds.join(','))}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      aria-label={`Retirer ${productName} de la comparaison`}
      className={cn(
        'ui-caps text-encre/55 hover:text-rouge inline-flex items-center gap-1.5 self-start text-[10px] transition-colors',
        className,
      )}
    >
      <X className="size-3" aria-hidden="true" strokeWidth={1.5} />
      Retirer
    </button>
  );
}
