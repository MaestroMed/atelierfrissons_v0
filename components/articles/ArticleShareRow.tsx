'use client';

import { useState } from 'react';
import { Link2, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ArticleShareRowProps {
  title: string;
  excerpt?: string;
  className?: string;
}

/**
 * Rangée de partage article — 2 actions :
 *   1. Partager (navigator.share si dispo — mobile surtout)
 *   2. Copier le lien (toujours disponible)
 *
 * Design très sobre : 2 boutons outline or avec micro-états. Aucun réseau
 * social explicite (on évite Twitter/Facebook tracking — compatible RGPD).
 */
export function ArticleShareRow({ title, excerpt, className }: ArticleShareRowProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = (): string => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const handleShare = async () => {
    const url = getUrl();
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt ?? title,
          url,
        });
      } catch (err) {
        // L'utilisateur a annulé ou erreur — on ignore silencieusement
        if ((err as Error).name !== 'AbortError') {
          console.error('[share] failed:', err);
        }
      }
    } else {
      // Fallback : copie + toast
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    const url = getUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[copy] failed:', err);
      toast.error('Impossible de copier le lien');
    }
  };

  return (
    <div
      className={cn(
        'border-encre/10 flex flex-col gap-3 border-t border-b py-5 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="ui-caps text-or-dark">Partager cette lecture</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className={cn(
            'ui-caps border-or/40 text-noir hover:border-noir hover:bg-noir hover:text-ivoire',
            'inline-flex items-center gap-2 border px-4 py-2 transition-colors',
          )}
        >
          <Share2 className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
          Partager
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copier le lien de l'article"
          className={cn(
            'ui-caps border-or/40 hover:border-noir hover:bg-noir hover:text-ivoire',
            'inline-flex items-center gap-2 border px-4 py-2 transition-colors',
            copied ? 'border-af-success bg-af-success text-ivoire' : 'text-noir',
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              Copié
            </>
          ) : (
            <>
              <Link2 className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              Copier le lien
            </>
          )}
        </button>
      </div>
    </div>
  );
}
