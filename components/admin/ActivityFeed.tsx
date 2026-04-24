import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  UserPlus,
  FileCheck,
  AlertCircle,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActivityKind = 'order' | 'stock' | 'customer' | 'forge' | 'alert';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  description?: string;
  timestamp: Date;
  href?: string;
}

const ICON_MAP: Record<ActivityKind, LucideIcon> = {
  order: ShoppingBag,
  stock: Package,
  customer: UserPlus,
  forge: FileCheck,
  alert: AlertCircle,
};

const COLOR_MAP: Record<ActivityKind, string> = {
  order: 'text-af-success bg-af-success/10 border-af-success/30',
  stock: 'text-or-dark bg-or/10 border-or/40',
  customer: 'text-af-info bg-af-info/10 border-af-info/30',
  forge: 'text-noir bg-encre/8 border-encre/25',
  alert: 'text-af-error bg-af-error/10 border-af-error/30',
};

/** Formate un timestamp en format relatif français (« il y a 3 min »). */
function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours} h`;
  if (days < 7) return `il y a ${days} j`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

interface ActivityFeedProps {
  items: readonly ActivityItem[];
  emptyMessage?: string;
  className?: string;
}

/**
 * Flux d'activité admin — commandes reçues, stock bas, nouveaux clients,
 * pages FORJA en attente, alertes système.
 *
 * Rendu Server Component — les dates sont converties côté serveur avec
 * la locale fr-FR par défaut. Pour une vue temps réel, brancher un
 * `revalidate: 30` sur la page qui consomme + websocket/SSE en Sprint 8.
 */
export function ActivityFeed({
  items,
  emptyMessage = 'Aucune activité récente.',
  className,
}: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className={cn('border-encre/10 bg-ivoire-light border p-6 text-center', className)}>
        <p className="font-italic-editorial text-encre/65 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className={cn('border-encre/10 bg-ivoire divide-encre/8 divide-y border', className)}>
      {items.map((item) => {
        const Icon = ICON_MAP[item.kind];
        const colors = COLOR_MAP[item.kind];
        const Inner = (
          <div className="flex items-start gap-4 px-5 py-4">
            <span
              className={cn(
                'inline-flex size-9 shrink-0 items-center justify-center border',
                colors,
              )}
              aria-hidden="true"
            >
              <Icon className="size-4" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-noir text-sm font-medium md:text-base">
                {item.title}
              </p>
              {item.description ? (
                <p className="text-encre/65 mt-0.5 text-xs">{item.description}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <time
                dateTime={item.timestamp.toISOString()}
                className="ui-caps text-encre/50 text-[10px]"
                title={item.timestamp.toLocaleString('fr-FR')}
              >
                {formatRelative(item.timestamp)}
              </time>
              {item.href ? (
                <ArrowRight
                  className="text-encre/40 size-3.5"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              ) : null}
            </div>
          </div>
        );
        return (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className="hover:bg-ivoire-light block transition-colors">
                {Inner}
              </Link>
            ) : (
              Inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
