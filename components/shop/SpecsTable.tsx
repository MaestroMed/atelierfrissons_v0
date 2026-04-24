import { cn } from '@/lib/utils';

interface SpecsTableProps {
  specs: Record<string, string>;
  className?: string;
}

/**
 * Table de caractéristiques produit — sobre, alignée sur la grille typo.
 * Chaque ligne : label en small caps gauche / valeur tabular droite.
 */
export function SpecsTable({ specs, className }: SpecsTableProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;
  return (
    <dl className={cn('divide-encre/10 border-encre/10 divide-y border-y', className)}>
      {entries.map(([label, value]) => (
        <div key={label} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
          <dt className="ui-caps text-encre/65">{label}</dt>
          <dd className="text-encre font-sans text-base">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
