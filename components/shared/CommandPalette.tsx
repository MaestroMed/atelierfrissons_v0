'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Command Palette ⌘K — overlay de recherche + navigation rapide.
 *
 * Déclencheurs :
 *   - Raccourci clavier ⌘K (Mac) / Ctrl+K (Win/Linux)
 *   - CustomEvent `af:palette-open` (dispatché depuis le Header)
 *
 * Contenus indexés : pages principales, collections, objets (produits mock),
 * actions (ouvrir le panier). Le filtrage est une simple substring insensible
 * aux accents — suffisant pour une home avec ~20 items.
 *
 * Clavier :
 *   - ↑ / ↓ pour naviguer
 *   - Enter pour valider
 *   - Esc pour fermer
 *
 * Focus trap simple : l'input reçoit le focus à l'ouverture, le focus
 * précédent est restauré à la fermeture.
 *
 * Respecte `prefers-reduced-motion` : pas d'animation de scale.
 */

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group: 'Navigation' | 'Collections' | 'Objets' | 'Compte' | 'Aide' | 'Actions';
  href?: string;
  onSelect?: () => void;
  /** Mots-clés additionnels pour améliorer le matching. */
  keywords?: string[];
}

const ITEMS: readonly CommandItem[] = [
  // Navigation principale
  { id: 'home', label: 'Accueil', group: 'Navigation', href: '/', keywords: ['homepage', 'home'] },
  {
    id: 'shop',
    label: 'Boutique',
    group: 'Navigation',
    href: '/boutique',
    keywords: ['produits', 'catalogue'],
  },
  {
    id: 'rituels',
    label: 'Le Journal',
    description: 'Articles & rituels',
    group: 'Navigation',
    href: '/rituels',
    keywords: ['blog', 'journal', 'articles'],
  },
  {
    id: 'guides',
    label: 'Les Guides',
    description: 'Guides piliers',
    group: 'Navigation',
    href: '/guides',
  },
  {
    id: 'about',
    label: 'À propos',
    group: 'Navigation',
    href: '/a-propos',
    keywords: ['maison', 'fondatrice', 'manifeste'],
  },

  // Collections (pivot V2)
  {
    id: 'col-couples',
    label: 'Pour Vous Deux',
    description: 'Le rituel partagé, à deux',
    group: 'Collections',
    href: '/collections/couples',
    keywords: ['couples', 'deux', 'partagé', 'ensemble'],
  },
  {
    id: 'col-elle',
    label: 'Pour Elle',
    description: 'Objets, lingerie soie, cosmétique',
    group: 'Collections',
    href: '/collections/elle',
    keywords: ['elle', 'femme', 'lingerie', 'soie'],
  },
  {
    id: 'col-lui',
    label: 'Pour Lui',
    description: 'Massagers, bandeau soie, oud',
    group: 'Collections',
    href: '/collections/lui',
    keywords: ['lui', 'homme', 'masculin', 'oud'],
  },
  {
    id: 'col-cadeaux',
    label: 'Cadeaux',
    description: 'Saint-Valentin, anniversaire, mariage',
    group: 'Collections',
    href: '/collections/cadeaux',
    keywords: ['cadeaux', 'saint-valentin', 'anniversaire', 'mariage', 'evjf'],
  },

  // Produits signature (mock — remplacé par queries Sprint 2+)
  {
    id: 'p-velours',
    label: 'Velours',
    description: 'Pièce signature — 169 €',
    group: 'Objets',
    href: '/produit/velours',
  },
  {
    id: 'p-duo',
    label: 'Duo',
    description: 'Stimulateur couple — 119 €',
    group: 'Objets',
    href: '/produit/duo',
  },
  {
    id: 'p-onde',
    label: 'Onde',
    description: 'Wand massager — 149 €',
    group: 'Objets',
    href: '/produit/onde',
  },
  {
    id: 'p-profond',
    label: 'Profond',
    description: 'Massager prostatique — 99 €',
    group: 'Objets',
    href: '/produit/profond',
  },
  {
    id: 'p-sillage',
    label: 'Sillage',
    description: 'Nuisette soie 22 momme — 129 €',
    group: 'Lingerie',
    href: '/produit/sillage',
  },
  {
    id: 'p-dentelle-noire',
    label: 'Dentelle Noire',
    description: 'Body dentelle Caudry — 189 €',
    group: 'Lingerie',
    href: '/produit/dentelle-noire',
  },
  {
    id: 'p-aurore',
    label: 'Aurore',
    description: 'Bougie de massage — 42 €',
    group: 'Cosmétique',
    href: '/produit/aurore',
  },
  {
    id: 'p-coffret-rituel',
    label: 'Coffret Rituel',
    description: 'Cadeau prêt-à-offrir — 119 €',
    group: 'Coffrets',
    href: '/produit/coffret-rituel',
  },

  // Compte
  { id: 'account', label: 'Mon compte', group: 'Compte', href: '/compte' },
  { id: 'orders', label: 'Mes commandes', group: 'Compte', href: '/compte/commandes' },
  { id: 'addresses', label: 'Carnet d’adresses', group: 'Compte', href: '/compte/adresses' },
  {
    id: 'login',
    label: 'Se connecter',
    group: 'Compte',
    href: '/auth/login',
    keywords: ['connexion', 'login'],
  },

  // Aide / légal
  { id: 'shipping', label: 'Livraison & délais', group: 'Aide', href: '/livraison' },
  {
    id: 'returns',
    label: 'Retours',
    group: 'Aide',
    href: '/retours',
    keywords: ['retour', 'remboursement'],
  },
  { id: 'cgv', label: 'Conditions générales de vente', group: 'Aide', href: '/cgv' },
  {
    id: 'privacy',
    label: 'Confidentialité',
    group: 'Aide',
    href: '/confidentialite',
    keywords: ['rgpd', 'données'],
  },

  // Actions
  {
    id: 'open-cart',
    label: 'Ouvrir le panier',
    group: 'Actions',
    onSelect: () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('af:cart-open'));
      }
    },
  },
] as const;

/** Normalise une chaîne : minuscules + suppression des accents. */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matches(item: CommandItem, query: string): boolean {
  if (!query) return true;
  const q = normalize(query.trim());
  if (!q) return true;
  const haystack = normalize(
    [item.label, item.description ?? '', item.group, (item.keywords ?? []).join(' ')].join(' '),
  );
  // Match tous les tokens (AND)
  return q.split(/\s+/).every((token) => haystack.includes(token));
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // ── Filtrage et groupement ─────────────────────────────────────────
  const filtered = useMemo(() => ITEMS.filter((item) => matches(item, query)), [query]);

  const grouped = useMemo(() => {
    const map = new Map<CommandItem['group'], CommandItem[]>();
    for (const item of filtered) {
      const bucket = map.get(item.group) ?? [];
      bucket.push(item);
      map.set(item.group, bucket);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // ── Handlers ouverture/fermeture ───────────────────────────────────
  const openPalette = useCallback(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    // Restaure le focus après la fermeture
    setTimeout(() => {
      previouslyFocused.current?.focus();
    }, 0);
  }, []);

  const selectItem = useCallback(
    (item: CommandItem) => {
      closePalette();
      if (item.href) {
        router.push(item.href);
      } else if (item.onSelect) {
        // Petit délai pour laisser le palette se fermer avant d'exécuter l'action
        setTimeout(() => item.onSelect?.(), 50);
      }
    },
    [closePalette, router],
  );

  // ── Raccourci global ⌘K / Ctrl+K + event custom ───────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key === 'k' || e.key === 'K';
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      } else if (e.key === '/' && !open) {
        // Slash pour ouvrir — si pas déjà dans un input
        const target = e.target as HTMLElement | null;
        const isEditable =
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          openPalette();
        }
      }
    };
    const onOpenEvent = () => openPalette();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('af:palette-open', onOpenEvent as EventListener);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('af:palette-open', onOpenEvent as EventListener);
    };
  }, [open, openPalette, closePalette]);

  // ── Focus input à l'ouverture ──────────────────────────────────────
  useEffect(() => {
    if (open) {
      // Lock du scroll body
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Focus le champ
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
    return;
  }, [open]);

  // ── Gestion clavier dans le palette ───────────────────────────────
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) selectItem(item);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
    }
  };

  // ── Scroll l'item actif dans la vue ───────────────────────────────
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recherche rapide"
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[15vh] md:pt-[20vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePalette();
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="animate-in fade-in-0 bg-noir/50 fixed inset-0 duration-200 supports-backdrop-filter:backdrop-blur-sm motion-reduce:animate-none"
        onClick={closePalette}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative z-10 flex w-full max-w-xl flex-col overflow-hidden',
          'bg-ivoire border-or/40 border shadow-2xl',
          'animate-in fade-in-0 zoom-in-95 duration-200 motion-reduce:animate-none',
        )}
      >
        {/* Input */}
        <div className="border-noir/10 flex items-center gap-3 border-b px-5 py-4">
          <Search className="text-or-dark size-4" aria-hidden="true" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Rechercher un objet, une page, un rituel…"
            aria-label="Rechercher"
            aria-controls="command-palette-list"
            aria-activedescendant={
              filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined
            }
            className={cn(
              'text-noir flex-1 bg-transparent text-base outline-none',
              'placeholder:text-encre/40',
              'font-body',
            )}
          />
          <kbd className="ui-caps border-or/30 text-encre/50 rounded-sm border px-1.5 py-0.5 text-[10px]">
            Esc
          </kbd>
        </div>

        {/* Résultats */}
        <div
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
              <Sparkle className="text-or/60 size-5" aria-hidden="true" strokeWidth={1.5} />
              <p className="font-italic-editorial text-encre/70">
                Aucun résultat pour «&nbsp;{query}&nbsp;»
              </p>
              <p className="text-encre/50 text-xs">
                Essayez «&nbsp;jour&nbsp;», «&nbsp;compte&nbsp;», «&nbsp;livraison&nbsp;»…
              </p>
            </div>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="px-2">
                <p className="ui-caps text-or-dark/70 px-3 pt-3 pb-1 text-[10px]">{group}</p>
                {items.map((item) => {
                  const idx = filtered.indexOf(item);
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      id={`cmd-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-idx={idx}
                      // eslint-disable-next-line react-hooks/refs
                      onClick={() => selectItem(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left',
                        'transition-colors duration-150',
                        isActive ? 'bg-noir text-ivoire' : 'text-encre hover:bg-ivoire-dark/50',
                      )}
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{item.label}</span>
                        {item.description && (
                          <span
                            className={cn(
                              'truncate text-xs',
                              isActive ? 'text-ivoire/70' : 'text-encre/55',
                            )}
                          >
                            {item.description}
                          </span>
                        )}
                      </div>
                      <ArrowRight
                        className={cn(
                          'size-3.5 shrink-0 transition-opacity',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                        aria-hidden="true"
                        strokeWidth={1.5}
                      />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer : hints clavier */}
        <div className="ui-caps border-noir/10 bg-ivoire-light/60 text-encre/55 flex items-center justify-between gap-3 border-t px-5 py-2.5 text-[10px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="border-or/30 rounded-sm border px-1 py-px">↑</kbd>
              <kbd className="border-or/30 rounded-sm border px-1 py-px">↓</kbd>
              Naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border-or/30 rounded-sm border px-1 py-px">↵</kbd>
              Valider
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="border-or/30 rounded-sm border px-1 py-px">⌘</kbd>
            <kbd className="border-or/30 rounded-sm border px-1 py-px">K</kbd>
            Fermer
          </span>
        </div>
      </div>
    </div>
  );
}
