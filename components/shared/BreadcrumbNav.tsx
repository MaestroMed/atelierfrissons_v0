import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from './JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo/structured-data';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  items: readonly BreadcrumbItem[];
  className?: string;
}

/**
 * Fil d'Ariane — partout sur les pages internes (produit, catégorie,
 * article, FORJA). Inclut le Schema.org BreadcrumbList obligatoire.
 *
 * Le dernier item est rendu en text statique (pas de lien) selon les
 * recommandations W3C/W3.org `aria-current="page"`.
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  if (items.length === 0) return null;
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([...items])} />
      <nav aria-label="Fil d'Ariane" className={cn('text-encre/65 text-xs', className)}>
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span className="ui-caps text-encre" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="ui-caps text-encre/65 hover:text-or-dark transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                {!isLast ? (
                  <ChevronRight className="text-encre/40 size-3" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
