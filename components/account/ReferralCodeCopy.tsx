'use client';

import { useState } from 'react';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralCodeCopyProps {
  code: string;
  shareUrl: string;
}

/**
 * Bloc copy-clipboard pour le code parrainage + lien de partage.
 *
 * Chaque bouton a son propre feedback (✓ Copié pendant 2s).
 */
export function ReferralCodeCopy({ code, shareUrl }: ReferralCodeCopyProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  async function copy(text: string, kind: 'code' | 'url') {
    try {
      await navigator.clipboard.writeText(text);
      if (kind === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch {
      /* Clipboard refused — fallback : on laisse l'utilisateur sélectionner manuellement */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Code */}
      <div className="bg-ivoire border-encre/15 flex items-center gap-3 border px-4 py-3.5">
        <span className="font-display tabular text-noir flex-1 text-2xl font-medium tracking-wider md:text-3xl">
          {code}
        </span>
        <button
          type="button"
          onClick={() => copy(code, 'code')}
          aria-label="Copier le code de parrainage"
          className={cn(
            'ui-caps inline-flex items-center gap-2 px-4 py-2 transition-colors',
            copiedCode
              ? 'bg-or text-noir border-or border'
              : 'border-noir/30 text-noir hover:bg-noir hover:text-ivoire border',
          )}
        >
          {copiedCode ? (
            <>
              <Check className="size-3.5" aria-hidden="true" />
              Copié
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden="true" />
              Copier
            </>
          )}
        </button>
      </div>

      {/* Lien personnalisé */}
      <div className="bg-ivoire-light border-encre/15 flex items-center gap-3 border px-4 py-3">
        <LinkIcon className="text-encre/55 size-4 shrink-0" aria-hidden="true" />
        <span className="text-encre/75 flex-1 truncate font-mono text-xs md:text-sm">
          {shareUrl}
        </span>
        <button
          type="button"
          onClick={() => copy(shareUrl, 'url')}
          aria-label="Copier le lien de partage"
          className={cn(
            'text-or-dark hover:text-or inline-flex items-center gap-1.5 text-xs transition-colors',
            copiedUrl && 'text-or font-medium',
          )}
        >
          {copiedUrl ? (
            <>
              <Check className="size-3" aria-hidden="true" />
              Copié
            </>
          ) : (
            <>
              <Copy className="size-3" aria-hidden="true" />
              Copier le lien
            </>
          )}
        </button>
      </div>
    </div>
  );
}
