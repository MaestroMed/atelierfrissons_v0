'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Search, UserRound, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { Wordmark } from './Wordmark';
import { Fleuron } from './Fleuron';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileNav } from './MobileNav';
import { PRIMARY_NAV } from './navigation-data';

interface HeaderProps {
  /** Nombre d'articles dans le panier (défaut 0 tant que la DB n'est pas branchée). */
  cartCount?: number;
}

/**
 * Header Atelier Frisson — sticky noir, grille 3 colonnes.
 *
 * Desktop :  [NAV GAUCHE] ——— [WORDMARK + FLEURON] ——— [ACTIONS DROITE]
 * Mobile  :  [menu] — [wordmark] — [panier]
 *
 * Barre d'annonce en marquee au-dessus (JOUR→NUIT, discrétion, maison française).
 * Ombre fine + léger backdrop-blur quand scrollé.
 */
export function Header({ cartCount = 0 }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'bg-noir text-ivoire sticky top-0 z-40',
        'transition-[box-shadow,backdrop-filter] duration-300',
        'data-[scrolled=true]:shadow-[0_1px_0_rgba(201,163,107,0.2)]',
        'supports-backdrop-filter:data-[scrolled=true]:bg-noir/92',
        'supports-backdrop-filter:data-[scrolled=true]:backdrop-blur-sm',
      )}
    >
      <AnnouncementBar />

      <Container as="div" className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 lg:py-5">
        {/* ──────── Colonne gauche : nav desktop + hamburger mobile ──────── */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            aria-label="Ouvrir la navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className={cn(
              'inline-flex items-center justify-center',
              '-ml-2 size-10 rounded-sm',
              'text-ivoire/90 hover:text-or transition-colors',
              'focus-visible:outline-offset-2',
              'lg:hidden',
            )}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-7 lg:flex xl:gap-10"
          >
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'ui-caps text-ivoire/85 transition-colors',
                  'hover:text-or focus-visible:text-or',
                  'relative after:absolute after:right-0 after:-bottom-1.5 after:left-0',
                  'after:bg-or after:h-px after:origin-center after:scale-x-0',
                  'after:transition-transform after:duration-300',
                  'hover:after:scale-x-100 focus-visible:after:scale-x-100',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ──────── Centre : wordmark + fleuron ──────── */}
        <Link
          href="/"
          aria-label="Atelier Frisson — retour à l'accueil"
          className="group flex flex-col items-center gap-1.5 px-4"
        >
          <Wordmark
            as="p"
            size="md"
            color="or"
            className="group-hover:text-or-light transition-colors"
          />
          <Fleuron variant="divider" size="sm" color="or" className="opacity-70" />
        </Link>

        {/* ──────── Colonne droite : actions ──────── */}
        <div className="flex items-center justify-end gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('af:palette-open'));
              }
            }}
            aria-label="Ouvrir la recherche rapide (⌘K)"
            aria-keyshortcuts="Meta+K Control+K"
            className="text-ivoire/85 hover:text-or hidden items-center gap-2 transition-colors sm:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="ui-caps hidden xl:inline">Recherche</span>
            <kbd
              aria-hidden="true"
              className="ui-caps border-or/40 text-ivoire/60 hidden rounded-sm border px-1.5 py-0.5 text-[10px] xl:inline"
            >
              ⌘K
            </kbd>
          </button>
          <Link
            href="/compte"
            aria-label="Mon compte"
            className="text-ivoire/85 hover:text-or hidden items-center gap-2 transition-colors sm:inline-flex"
          >
            <UserRound className="size-4" aria-hidden="true" />
            <span className="ui-caps hidden xl:inline">Compte</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('af:cart-open'));
              }
            }}
            aria-label={`Ouvrir le panier (${cartCount} article${cartCount > 1 ? 's' : ''})`}
            className={cn(
              'text-ivoire/90 hover:text-or flex items-center gap-2 transition-colors',
              'relative',
            )}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span className="ui-caps hidden md:inline">Panier</span>
            <span
              aria-hidden="true"
              className="tabular text-or text-[11px] leading-none transition-transform"
              data-cart-count
            >
              ({cartCount.toString().padStart(2, '0')})
            </span>
          </button>
        </div>
      </Container>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} cartCount={cartCount} />
    </header>
  );
}
