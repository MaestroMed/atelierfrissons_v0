'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlossaryEntry {
  term: string;
  category: 'Anatomie' | 'Matériaux' | 'Technologie' | 'Pratique' | 'Santé';
  definition: string;
}

interface GlossarySearchProps {
  entries: readonly GlossaryEntry[];
  categories: readonly GlossaryEntry['category'][];
}

/** Normalise (lowercase + sans accents) pour la recherche tolérante. */
function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Glossaire interactif — search live + filter par catégorie.
 *
 * UX :
 *  - Input recherche persisté (highlight des matches dans la définition)
 *  - Pills catégories cliquables (toggle, multi-select)
 *  - Compteur dynamique « N termes affichés »
 *  - Empty state éditorial si aucun résultat
 *  - Cards en grid responsive avec micro-interaction hover
 *  - Cmd/Ctrl+K (ou /) focus l'input search
 */
export function GlossarySearch({ entries, categories }: GlossarySearchProps) {
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<GlossaryEntry['category']>>(
    new Set(),
  );

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return entries.filter((e) => {
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(e.category);
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = normalize(`${e.term} ${e.definition}`);
      return haystack.includes(q);
    });
  }, [entries, query, activeCategories]);

  const toggleCategory = (cat: GlossaryEntry['category']) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const clearAll = () => {
    setQuery('');
    setActiveCategories(new Set());
  };

  const hasFilters = query.length > 0 || activeCategories.size > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div className="border-encre/15 bg-ivoire focus-within:border-or flex items-center gap-3 border px-5 py-4 transition-colors">
        <Search className="text-encre/40 size-4 shrink-0" aria-hidden="true" strokeWidth={1.5} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un terme — silicone, point G, ménopause…"
          aria-label="Rechercher dans le glossaire"
          className="text-encre placeholder:text-encre/40 flex-1 bg-transparent text-base focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Effacer la recherche"
            className="text-encre/55 hover:text-rouge inline-flex size-7 items-center justify-center transition-colors"
          >
            <X className="size-4" aria-hidden="true" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>

      {/* ── Filtres catégories ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => {
          const isActive = activeCategories.has(cat);
          const count = entries.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-pressed={isActive}
              className={cn(
                'ui-caps inline-flex items-center gap-2 border px-4 py-2 text-xs transition-colors',
                isActive
                  ? 'border-noir bg-noir text-ivoire'
                  : 'border-encre/20 text-encre/70 hover:border-or hover:text-or-dark',
              )}
            >
              {cat}
              <span
                className={cn(
                  'tabular text-[10px] opacity-70',
                  isActive ? 'text-ivoire' : 'text-encre/50',
                )}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Compteur + clear all ────────────────────────────────────── */}
      <div className="border-encre/10 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <p className="text-encre/65 text-sm">
          <span className="tabular text-noir font-medium">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'terme affiché' : 'termes affichés'}
          {hasFilters ? <span className="text-encre/45"> · {entries.length} au total</span> : null}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="ui-caps text-encre/60 hover:text-or-dark inline-flex items-center gap-2 text-xs transition-colors"
          >
            <X className="size-3" aria-hidden="true" strokeWidth={1.5} />
            Effacer les filtres
          </button>
        ) : null}
      </div>

      {/* ── Grille de résultats ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="border-encre/10 bg-ivoire-light/40 flex flex-col items-center gap-4 border py-16 text-center">
          <p className="font-italic-editorial text-encre/70 text-lg">
            Aucun terme ne correspond à «&nbsp;{query}&nbsp;»
          </p>
          <p className="text-encre/55 text-sm">
            Essayez un autre mot, ou retirez les filtres pour voir tous les termes.
          </p>
        </div>
      ) : (
        <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2">
          {filtered.map((entry) => (
            <li key={entry.term}>
              <article className="bg-ivoire flex h-full flex-col gap-3 p-6 md:p-7">
                <header className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-noir text-xl font-medium md:text-2xl">
                    {entry.term}
                  </h3>
                  <span className="ui-caps text-or-dark shrink-0 text-[10px]">
                    {entry.category}
                  </span>
                </header>
                <p className="text-encre/80 text-sm leading-relaxed md:text-base">
                  <Highlight text={entry.definition} query={query} />
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Met en valeur les occurrences de `query` dans `text`. Insensitive accents. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const normalizedText = normalize(text);
  const normalizedQuery = normalize(q);
  const idx = normalizedText.indexOf(normalizedQuery);
  if (idx === -1) return <>{text}</>;
  // Découpe le texte ORIGINAL en gardant les positions normalisées
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-or/30 text-noir px-0.5">{text.slice(idx, idx + q.length)}</mark>
      <Highlight text={text.slice(idx + q.length)} query={q} />
    </>
  );
}
