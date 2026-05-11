'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Bell,
  ShieldCheck,
  LogOut,
  Repeat,
  Users,
  Sparkles,
  FileText,
} from 'lucide-react';

interface AccountSidebarProps {
  email: string;
}

const NAV = [
  { label: 'Tableau de bord', href: '/compte', icon: LayoutDashboard, exact: true },
  { label: 'Mes commandes', href: '/compte/commandes', icon: Package, exact: false },
  { label: 'Abonnements', href: '/compte/abonnements', icon: Repeat, exact: false },
  { label: 'Parrainage', href: '/compte/parrainage', icon: Users, exact: false },
  { label: 'Fidélité', href: '/compte/fidelite', icon: Sparkles, exact: false },
  { label: 'Mes favoris', href: '/compte/favoris', icon: Heart, exact: false },
  { label: 'Adresses', href: '/compte/adresses', icon: MapPin, exact: false },
  { label: 'Préférences', href: '/compte/preferences', icon: Bell, exact: false },
  { label: 'Sécurité', href: '/compte/securite', icon: ShieldCheck, exact: false },
  { label: 'Mes données (RGPD)', href: '/compte/donnees', icon: FileText, exact: false },
] as const;

export function AccountSidebar({ email }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-6">
      <div className="border-encre/10 bg-ivoire-light border p-5">
        <p className="ui-caps text-or-dark">Connectée</p>
        <p className="font-display text-encre mt-2 text-base break-all">{email}</p>
      </div>

      <nav aria-label="Navigation espace client">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 border-l-2 px-4 py-3 text-sm transition-colors',
                    active
                      ? 'border-or bg-or/8 text-noir'
                      : 'text-encre/75 hover:border-or/40 hover:text-or-dark border-transparent',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="font-sans">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form action="/auth/logout" method="post" className="px-4">
        <button
          type="submit"
          className="ui-caps text-encre/65 hover:text-rouge inline-flex items-center gap-2 transition-colors"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Se déconnecter
        </button>
      </form>
    </aside>
  );
}
