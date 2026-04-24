'use client';

import Link from 'next/link';
import { Search, UserRound, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Wordmark } from './Wordmark';
import { Fleuron } from './Fleuron';
import { PRIMARY_NAV, SOCIAL_LINKS } from './navigation-data';
import { InstagramIcon, PinterestIcon } from '@/components/shared/SocialIcons';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartCount?: number;
}

export function MobileNav({ open, onOpenChange, cartCount = 0 }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full border-none bg-noir text-ivoire sm:max-w-md"
        showCloseButton
      >
        <div className="flex h-full flex-col">
          {/* Header interne drawer */}
          <div className="flex flex-col items-center gap-2 border-b border-ivoire/10 px-6 pb-6 pt-10">
            <SheetTitle className="wordmark text-lg uppercase text-or">
              ATELIER FRISSON
            </SheetTitle>
            <Fleuron variant="divider" size="md" color="or" />
            <SheetDescription className="font-italic-editorial text-ivoire/70">
              Maison du rituel intime
            </SheetDescription>
            <span className="sr-only">
              <Wordmark as="span" size="md" srLabel="Atelier Frisson" />
            </span>
          </div>

          {/* Navigation principale */}
          <nav
            aria-label="Navigation principale"
            className="flex flex-col gap-1 px-6 py-8"
          >
            {PRIMARY_NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className="group flex items-baseline justify-between border-b border-ivoire/10 py-4 last:border-b-0"
              >
                <span className="flex items-baseline gap-4">
                  <span className="ui-caps text-or/60 tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-2xl font-medium text-ivoire transition-colors group-hover:text-or">
                    {item.label}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Secondaire + compte / panier */}
          <div className="mt-auto border-t border-ivoire/10 px-6 py-6">
            <div className="grid grid-cols-3 gap-3">
              <SecondaryTile href="/recherche" label="Recherche" onClick={() => onOpenChange(false)}>
                <Search className="size-4" aria-hidden="true" />
              </SecondaryTile>
              <SecondaryTile href="/compte" label="Compte" onClick={() => onOpenChange(false)}>
                <UserRound className="size-4" aria-hidden="true" />
              </SecondaryTile>
              <SecondaryTile
                href="/panier"
                label={`Panier (${cartCount})`}
                onClick={() => onOpenChange(false)}
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
              </SecondaryTile>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="ui-caps text-ivoire/40">Suivre la maison</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-ivoire/60 transition-colors hover:text-or"
                  >
                    {s.icon === 'instagram' ? (
                      <InstagramIcon className="size-4" />
                    ) : (
                      <PinterestIcon className="size-4" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SecondaryTile({
  href,
  label,
  onClick,
  children,
}: {
  href: string;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 border border-ivoire/10 px-3 py-4',
        'transition-colors hover:border-or hover:text-or',
      )}
    >
      {children}
      <span className="ui-caps">{label}</span>
    </Link>
  );
}

