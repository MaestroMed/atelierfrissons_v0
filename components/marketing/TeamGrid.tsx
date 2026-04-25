import { cn } from '@/lib/utils';
import { Fleuron } from '@/components/layout/Fleuron';

export interface TeamMember {
  /** Rôle anonymisé (pas de nom de personne pour la V1). */
  role: string;
  /** Phrase éditoriale qui décrit la contribution. */
  description: string;
  /** Initiales pour l'avatar typographique (ex: « S.A. »). */
  initials: string;
  /** Tonalité de l'avatar. */
  tone?: 'or' | 'noir' | 'rouge';
}

interface TeamGridProps {
  members: readonly TeamMember[];
  className?: string;
}

/**
 * Grille équipe — utilisée sur /a-propos. Avatars typographiques (initiales
 * dans un cercle) plutôt que photos pour respecter l'anonymat de l'équipe
 * (médecins, sexologues qui consultent en discrétion).
 *
 * Layout responsive : 1 col mobile, 2 cols tablet, 3 cols desktop.
 * Server Component — aucun JS.
 */
export function TeamGrid({ members, className }: TeamGridProps) {
  return (
    <ul className={cn('bg-or/15 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3', className)}>
      {members.map((m, i) => {
        const toneClass =
          m.tone === 'noir'
            ? 'bg-noir text-ivoire'
            : m.tone === 'rouge'
              ? 'bg-rouge text-ivoire'
              : 'bg-or/15 text-noir';
        return (
          <li key={`${m.role}-${i}`} className="bg-ivoire flex flex-col gap-5 p-7 md:p-9">
            <div
              className={cn(
                'border-or/40 inline-flex size-14 items-center justify-center rounded-full border',
                toneClass,
              )}
              aria-hidden="true"
            >
              <span className="font-display tabular text-base font-medium tracking-wider">
                {m.initials}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="ui-caps text-or-dark text-[10px]">{m.role}</p>
              <p
                className="font-italic-editorial text-encre/80 text-sm leading-relaxed md:text-base"
                dangerouslySetInnerHTML={{ __html: m.description }}
              />
            </div>
            <Fleuron variant="divider" size="sm" color="or" className="mt-auto opacity-50" />
          </li>
        );
      })}
    </ul>
  );
}
