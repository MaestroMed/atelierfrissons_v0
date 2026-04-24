'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ArticleTocProps {
  /** Sélecteur CSS de l'article contenant les headings. */
  targetSelector: string;
  /** Titre de la liste (défaut « Dans cet article »). */
  label?: string;
  className?: string;
}

/** Slugifie un texte en ID DOM-safe. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Table des matières auto-générée à partir des <h2> et <h3> d'un article
 * rendu via `dangerouslySetInnerHTML`.
 *
 * Fonctionnement :
 *   1. Au mount, parse les headings et leur assigne un ID slug si absent.
 *   2. Utilise IntersectionObserver pour tracker le heading courant (rootMargin
 *      ajusté pour activer un peu avant que le heading atteigne le haut).
 *   3. Click : scroll smooth vers le heading + met à jour l'URL hash (history).
 *
 * Respecte prefers-reduced-motion. Masqué si l'article a moins de 2 H2.
 */
export function ArticleToc({
  targetSelector,
  label = 'Dans cet article',
  className,
}: ArticleTocProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // ── Parse headings + assign IDs ───────────────────────────────────
  useEffect(() => {
    const article = document.querySelector(targetSelector);
    if (!article) return;

    const headings = article.querySelectorAll<HTMLHeadingElement>('h2, h3');
    const parsed: TocItem[] = [];
    const usedIds = new Set<string>();

    headings.forEach((el) => {
      const text = (el.textContent ?? '').trim();
      if (!text) return;
      let id = el.id || slugify(text);
      // Dédoublonne si conflit
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${slugify(text)}-${suffix++}`;
      }
      el.id = id;
      usedIds.add(id);
      parsed.push({
        id,
        text,
        level: el.tagName === 'H3' ? 3 : 2,
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(parsed);
  }, [targetSelector]);

  // ── IntersectionObserver pour scroll-spy ───────────────────────────
  useEffect(() => {
    if (items.length === 0) return;
    const article = document.querySelector(targetSelector);
    if (!article) return;

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        // Le heading « actif » est celui le plus proche du haut du viewport
        // parmi les intersectants. En cas d'absence, on garde l'actuel.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) {
          setActiveId(first.target.id);
        }
      },
      {
        // Zone d'activation : 80px du haut (sous le header), jusqu'au milieu du viewport
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 1],
      },
    );
    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, targetSelector]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    // Offset de 96px pour ne pas se retrouver sous le header sticky
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior });
    // Met à jour l'URL sans forcer un jump
    if (window.history) {
      window.history.replaceState(null, '', `#${id}`);
    }
    setActiveId(id);
  };

  // Masque si peu de headings (moins de 2 H2 → pas utile)
  const h2Count = useMemo(() => items.filter((i) => i.level === 2).length, [items]);
  if (h2Count < 2) return null;

  return (
    <nav aria-label={label} className={cn('flex flex-col gap-3', className)}>
      <p className="ui-caps text-or-dark">{label}</p>
      <ol className="border-or/25 flex flex-col gap-2 border-l pl-5 text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${item.id}`}
                onClick={(e) => onClick(e, item.id)}
                className={cn(
                  'block transition-all duration-200',
                  'hover:text-or-dark',
                  isActive ? 'text-noir font-medium' : 'text-encre/60',
                  item.level === 3 ? 'text-xs' : '',
                  'relative',
                )}
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="bg-or absolute top-1/2 -left-[22px] h-4 w-px -translate-y-1/2"
                  />
                ) : null}
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
