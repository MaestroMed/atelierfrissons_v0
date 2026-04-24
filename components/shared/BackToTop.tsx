'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  /** Seuil scrollY pour afficher le bouton (défaut 800px). */
  threshold?: number;
}

/**
 * Bouton « retour en haut » — apparaît après scroll, cliquable pour
 * remonter smooth. Positionné en bas à droite, taille raisonnable,
 * animation fade + scale discrète.
 *
 * Ne chevauche pas le StickyProductBar mobile (qui est aussi bottom)
 * car on le masque sur les routes `/produit/*`.
 */
export function BackToTop({ threshold = 800 }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed right-6 bottom-8 z-30 flex size-12 items-center justify-center',
        'border-noir bg-ivoire text-noir shadow-card border',
        'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
        'hover:bg-noir hover:text-ivoire focus-visible:bg-noir focus-visible:text-ivoire',
        visible
          ? 'pointer-events-auto scale-100 opacity-100'
          : 'pointer-events-none scale-90 opacity-0',
        // Masque sur routes produit pour ne pas chevaucher StickyProductBar
        'peer-data-[sticky-bar=true]:hidden',
      )}
    >
      <ArrowUp className="size-4" aria-hidden="true" strokeWidth={1.5} />
    </button>
  );
}
