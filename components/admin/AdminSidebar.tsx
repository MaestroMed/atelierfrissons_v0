'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Tag,
  Boxes,
  FileText,
  Sparkles,
  Search,
  BarChart3,
  Star,
  Mail,
  Truck,
  Building2,
  CreditCard,
  Settings,
  ShieldCheck,
  ScrollText,
  LogOut,
  Repeat,
  Gift,
  UserPlus,
  Activity,
} from 'lucide-react';
import { Wordmark } from '@/components/layout/Wordmark';
import { Fleuron } from '@/components/layout/Fleuron';
import { cn } from '@/lib/utils';

const NAV_GROUPS = [
  {
    title: 'Pilotage',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, exact: false },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { label: 'Produits', href: '/admin/produits', icon: Package, exact: false },
      { label: 'Catégories', href: '/admin/categories', icon: FolderTree, exact: false },
      { label: 'Stocks', href: '/admin/stocks', icon: Boxes, exact: false },
      { label: 'Promotions', href: '/admin/promotions', icon: Tag, exact: false },
    ],
  },
  {
    title: 'Activité',
    items: [
      { label: 'Commandes', href: '/admin/commandes', icon: ShoppingBag, exact: false },
      { label: 'Abonnements', href: '/admin/abonnements', icon: Repeat, exact: false },
      { label: 'Clients', href: '/admin/clients', icon: Users, exact: false },
      { label: 'Avis', href: '/admin/avis', icon: Star, exact: false },
    ],
  },
  {
    title: 'Pivot V2 — Croissance',
    items: [
      { label: 'Cartes cadeaux', href: '/admin/cartes-cadeaux', icon: Gift, exact: false },
      { label: 'Parrainage', href: '/admin/parrainage', icon: UserPlus, exact: false },
    ],
  },
  {
    title: 'Contenu & SEO',
    items: [
      { label: 'CMS', href: '/admin/cms', icon: FileText, exact: false },
      { label: 'FORJA', href: '/admin/forge', icon: Sparkles, exact: false },
      { label: 'SEO', href: '/admin/seo', icon: Search, exact: false },
    ],
  },
  {
    title: 'Opérations',
    items: [
      { label: 'Emails', href: '/admin/emails', icon: Mail, exact: false },
      { label: 'Livraisons', href: '/admin/livraisons', icon: Truck, exact: false },
      { label: 'Fournisseurs', href: '/admin/fournisseurs', icon: Building2, exact: false },
      { label: 'Finances', href: '/admin/finances', icon: CreditCard, exact: false },
    ],
  },
  {
    title: 'Système',
    items: [
      { label: 'Paramètres', href: '/admin/parametres', icon: Settings, exact: false },
      { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: ShieldCheck, exact: false },
      { label: 'Observabilité', href: '/admin/observabilite', icon: Activity, exact: false },
      { label: 'Audit log', href: '/admin/audit', icon: ScrollText, exact: false },
    ],
  },
] as const;

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-ivoire/10 bg-noir text-ivoire sticky top-0 flex h-dvh w-72 flex-col border-r">
      {/* Header sidebar */}
      <div className="border-ivoire/10 flex flex-col items-center gap-2 border-b px-6 py-6 text-center">
        <Wordmark as="p" size="sm" color="or" />
        <Fleuron variant="divider" size="sm" color="or" className="opacity-60" />
        <p className="ui-caps text-or/70 text-[10px]">Back-office</p>
      </div>

      {/* Nav scrollable */}
      <nav className="scrollbar-fin flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-6">
          {NAV_GROUPS.map((group) => (
            <li key={group.title}>
              <p className="ui-caps text-ivoire/40 mb-2 px-3 text-[10px]">{group.title}</p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-or/10 text-or'
                            : 'text-ivoire/70 hover:bg-ivoire/5 hover:text-ivoire',
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        <span className="font-sans">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer sidebar */}
      <div className="border-ivoire/10 flex flex-col gap-2 border-t px-4 py-4 text-xs">
        <p className="text-ivoire/55 break-all">{email}</p>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="ui-caps text-ivoire/70 hover:text-rouge-light inline-flex items-center gap-2 transition-colors"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
