'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MegaMenuConfig, MegaMenuProductPreview } from './navigation-data';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { formatPriceCents } from '@/lib/format';

const MEGA_COLLECTION_LABELS: Record<MegaMenuProductPreview['collection'], string> = {
  couples: 'Pour Vous Deux',
  elle: 'Pour Elle',
  lui: 'Pour Lui',
  cadeaux: 'Cadeau',
  jour: 'Collection JOUR',
  nuit: 'Collection NUIT',
  inaugurale: 'Collection inaugurale',
  signature: 'Pièce signature',
};

interface MegaMenuProps {
  config: MegaMenuConfig;
  /** Est-il ouvert ? — contrôlé par le parent Header. */
  open: boolean;
  /** ID pour `aria-controls` sur le trigger. */
  id: string;
  /** Callback pour signaler la fermeture (ex: clic sur un lien, Escape). */
  onClose: () => void;
  /** Gestion focus/hover — le parent peut décider si hover ou click-to-open. */
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Panneau MegaMenu desktop — style Dior / Byredo. 3 colonnes :
 *   1. Groupes de liens (nav hiérarchique)
 *   2. Produits vedettes (silhouette + prix)
 *   3. Bloc éditorial (caption + headline + body + CTA)
 *
 * Le wrapper reste SSR-safe (className fixe), l'animation open/close est
 * pilotée par `data-open` + transitions Tailwind.
 *
 * Accessibilité :
 *   - role="menu" sur la zone
 *   - chaque lien est focusable et ferme le panneau au clic
 *   - Esc ferme (géré par le Header via keydown global)
 *   - Focus visible via ring or champagne (globals.css)
 */
export function MegaMenu({ config, open, id, onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const { groups, products, editorial } = config;

  const editorialToneClass =
    editorial?.tone === 'nuit'
      ? 'bg-rouge text-ivoire'
      : editorial?.tone === 'or'
        ? 'bg-or/15 text-noir'
        : 'bg-ivoire-light text-encre';

  return (
    <div
      id={id}
      role="menu"
      aria-hidden={!open}
      data-open={open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        // Position : sous le header, sur toute la largeur
        'bg-ivoire border-encre/10 text-encre absolute inset-x-0 top-full z-30 border-b',
        'shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
        // Animation open/close
        'origin-top transition-[opacity,transform] duration-200 ease-out',
        'supports-backdrop-filter:bg-ivoire/96 supports-backdrop-filter:backdrop-blur-md',
        'motion-reduce:transition-none',
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0',
        // Masqué sur < lg (mobile utilise MobileNav)
        'hidden lg:block',
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] px-10 py-10">
        <div
          className={cn(
            'grid gap-10',
            // Layout dynamique selon la présence des blocs
            products && editorial
              ? 'grid-cols-[1.1fr_1fr_1fr]'
              : products || editorial
                ? 'grid-cols-[1.1fr_1fr]'
                : 'grid-cols-1',
          )}
        >
          {/* ── Colonne 1 : groupes de liens ─────────────────────────── */}
          <div
            className={cn(
              'flex flex-col gap-10',
              groups.length > 1 && 'md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10',
            )}
          >
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <p className="ui-caps text-or-dark">{group.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        role="menuitem"
                        onClick={onClose}
                        className={cn(
                          'group/link text-encre flex flex-col gap-0.5',
                          'hover:text-or-dark focus-visible:text-or-dark transition-colors',
                        )}
                      >
                        <span className="font-display text-base font-medium md:text-lg">
                          {item.label}
                        </span>
                        {item.description ? (
                          <span className="text-encre/60 group-hover/link:text-encre/80 text-xs transition-colors">
                            {item.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Colonne 2 : produits vedettes ────────────────────────── */}
          {products && products.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="ui-caps text-or-dark">À l’honneur</p>
              <ul className="flex flex-col gap-3">
                {products.map((p) => {
                  const isDark = p.collection === 'lui' || p.collection === 'nuit';
                  const collectionLabel = MEGA_COLLECTION_LABELS[p.collection];
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/produit/${p.slug}`}
                        role="menuitem"
                        onClick={onClose}
                        className="group/prod border-encre/10 bg-ivoire hover:border-or flex items-center gap-3 border p-3 transition-colors"
                      >
                        <span
                          className={cn(
                            'flex size-14 shrink-0 items-center justify-center overflow-hidden border',
                            isDark ? 'bg-noir border-or/30' : 'bg-ivoire-light border-or/15',
                          )}
                        >
                          <ProductSilhouette
                            variant={isDark ? 'nuit' : 'jour'}
                            className="h-[70%]"
                          />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="ui-caps text-or-dark text-[10px]">
                            {collectionLabel}
                          </span>
                          <span className="font-display text-noir group-hover/prod:text-or-dark truncate text-base font-medium transition-colors">
                            {p.name}
                          </span>
                          <span className="font-italic-editorial text-encre/60 truncate text-xs">
                            {p.tagline}
                          </span>
                        </div>
                        <span className="tabular text-encre/80 shrink-0 text-sm font-medium">
                          {formatPriceCents(p.priceCents)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {/* ── Colonne 3 : bloc éditorial ──────────────────────────── */}
          {editorial ? (
            <div className={cn('flex flex-col gap-4 p-6', editorialToneClass)}>
              <p className={cn('ui-caps', editorial.tone === 'nuit' ? 'text-or' : 'text-or-dark')}>
                {editorial.caption}
              </p>
              <h3 className="font-display text-xl leading-tight font-medium md:text-2xl">
                {editorial.headline}
              </h3>
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  editorial.tone === 'nuit' ? 'text-ivoire/85' : 'text-encre/80',
                )}
                dangerouslySetInnerHTML={{ __html: editorial.body }}
              />
              <Link
                href={editorial.ctaHref}
                role="menuitem"
                onClick={onClose}
                className={cn(
                  'ui-caps mt-auto inline-flex items-center gap-2 self-start transition-all hover:gap-3',
                  editorial.tone === 'nuit'
                    ? 'text-or hover:text-or-light'
                    : 'text-or-dark hover:text-or',
                )}
              >
                {editorial.ctaLabel}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
