import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-encre/15 bg-ivoire-light/50 flex flex-col items-center gap-4 border border-dashed px-6 py-20 text-center',
        className,
      )}
    >
      <Icon className="text-encre/30 size-10 stroke-[1.2]" aria-hidden="true" />
      <h3 className="font-display text-noir text-xl font-medium">{title}</h3>
      <p className="text-encre/65 max-w-md text-sm">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
