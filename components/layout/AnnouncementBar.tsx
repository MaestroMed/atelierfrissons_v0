'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  className?: string;
}

/** localStorage key pour la persistance du dismiss. */
const DISMISS_KEY = 'af_announcement_dismissed';
/**
 * Version du texte — incrémente quand on modifie la liste pour ré-afficher
 * la barre à tous les utilisateurs qui avaient dismissé l'ancienne.
 */
const ANNOUNCEMENTS_VERSION = 1;

const ANNOUNCEMENTS = [
  'Livraison discrète partout en France',
  'Emballage neutre signé de la main',
  'Atelier fondé à Paris — Maison du rituel intime',
  'Expédié sous 48h depuis l\u2019Union européenne',
] as const;

/**
 * Barre d'annonce fine au-dessus du header — style Aesop/Byredo.
 *
 * Messages qui défilent en marquee continu (CSS pur). Duplique le ruban
 * deux fois pour un défilement sans couture. Respecte `prefers-reduced-motion`.
 *
 * Dismissable : un bouton X à droite ferme la barre pour la session. Le
 * choix est persisté en localStorage avec un numéro de version — si on
 * change les textes, on bump la version pour que l'utilisateur revoie
 * le nouveau message.
 */
export function AnnouncementBar({ className }: AnnouncementBarProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(DISMISS_KEY);
      if (raw && Number.parseInt(raw, 10) === ANNOUNCEMENTS_VERSION) {
        setDismissed(true);
      }
    } catch {
      // localStorage bloqué — on reste visible
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(ANNOUNCEMENTS_VERSION));
    } catch {
      // Ignore — on persiste juste la session
    }
  };

  // SSR / pre-hydration : render comme si pas dismissé pour éviter le CLS.
  // Après mount, si dismissed, on renvoie null.
  if (mounted && dismissed) return null;

  return (
    <div
      className={cn(
        'border-ivoire/5 bg-noir text-ivoire/80 relative flex items-stretch overflow-hidden border-b',
        className,
      )}
    >
      <div className="relative flex flex-1 overflow-hidden py-2">
        <div
          className="flex shrink-0 [animation:var(--animate-marquee)] items-center gap-12 pr-12 motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
          aria-hidden="true"
        >
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((msg, i) => (
            <AnnouncementItem key={`a-${i}`} text={msg} />
          ))}
        </div>
        <div
          className="flex shrink-0 [animation:var(--animate-marquee)] items-center gap-12 pr-12 motion-reduce:hidden"
          aria-hidden="true"
        >
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((msg, i) => (
            <AnnouncementItem key={`b-${i}`} text={msg} />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Masquer la barre d'annonce"
        className={cn(
          'text-ivoire/50 hover:text-or hover:bg-ivoire/5 inline-flex shrink-0 items-center justify-center',
          'border-ivoire/10 w-8 border-l transition-colors',
          'focus-visible:outline-offset-[-2px]',
        )}
      >
        <X className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
      </button>
      {/* Version accessible : un seul message pour les lecteurs d'écran */}
      <span className="sr-only">{ANNOUNCEMENTS.join(' — ')}</span>
    </div>
  );
}

function AnnouncementItem({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-6">
      <span className="ui-caps whitespace-nowrap">{text}</span>
      <span aria-hidden="true" className="bg-or/70 inline-block size-[3px] rounded-full" />
    </span>
  );
}
