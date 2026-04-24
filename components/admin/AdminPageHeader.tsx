import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** Boutons d'action (export, créer, etc.) à droite. */
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, description, actions, className }: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        'border-encre/10 flex flex-col gap-4 border-b px-8 py-8 md:flex-row md:items-end md:justify-between md:px-12 md:py-10',
        className,
      )}
    >
      <div>
        <h1 className="font-display text-noir text-3xl font-medium md:text-4xl">{title}</h1>
        {description ? <p className="text-encre/70 mt-2 max-w-2xl text-sm">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
