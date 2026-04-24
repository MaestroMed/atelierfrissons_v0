import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  className?: string;
}

const ANNOUNCEMENTS = [
  'Livraison discrète partout en France',
  'Emballage neutre signé de la main',
  'Atelier fondé à Paris — Maison du rituel intime',
  'Expédié sous 48h depuis l\u2019Union européenne',
] as const;

/**
 * Barre d'annonce fine au-dessus du header — style Aesop/Byredo.
 *
 * Messages qui défilent en marquee continu (CSS pur, pas de JS).
 * Duplique le ruban deux fois pour un défilement sans couture.
 * Respecte automatiquement `prefers-reduced-motion` via globals.css.
 */
export function AnnouncementBar({ className }: AnnouncementBarProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-ivoire/5 bg-noir text-ivoire/80',
        className,
      )}
    >
      <div className="relative flex overflow-hidden py-2">
        <div
          className="flex shrink-0 items-center gap-12 pr-12 [animation:var(--animate-marquee)] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
          aria-hidden="true"
        >
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((msg, i) => (
            <AnnouncementItem key={`a-${i}`} text={msg} />
          ))}
        </div>
        <div
          className="flex shrink-0 items-center gap-12 pr-12 [animation:var(--animate-marquee)] motion-reduce:hidden"
          aria-hidden="true"
        >
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((msg, i) => (
            <AnnouncementItem key={`b-${i}`} text={msg} />
          ))}
        </div>
      </div>
      {/* Version accessible : un seul message pour les lecteurs d'écran */}
      <span className="sr-only">{ANNOUNCEMENTS.join(' — ')}</span>
    </div>
  );
}

function AnnouncementItem({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-6">
      <span className="ui-caps whitespace-nowrap">{text}</span>
      <span aria-hidden="true" className="inline-block size-[3px] rounded-full bg-or/70" />
    </span>
  );
}
