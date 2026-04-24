import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

/**
 * Icônes sociales custom — lucide-react v1 a retiré les logos brand
 * (Instagram, Pinterest, etc.) pour cause de contraintes marques.
 * On les redéfinit ici en SVG inline, stroke/fill en currentColor.
 */

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden="true"
      role="presentation"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.6" cy="6.4" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(className)}
      aria-hidden="true"
      role="presentation"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.17-.11-.95-.2-2.4.04-3.44.22-.94 1.39-6 1.39-6s-.36-.71-.36-1.77c0-1.65.96-2.89 2.15-2.89 1.02 0 1.51.76 1.51 1.68 0 1.02-.65 2.55-.99 3.97-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.75-2.24 3.75-5.47 0-2.86-2.05-4.86-4.98-4.86-3.39 0-5.38 2.54-5.38 5.17 0 1.02.39 2.12.88 2.71.1.12.11.22.08.34-.09.38-.29 1.19-.33 1.35-.05.22-.17.27-.4.16-1.49-.69-2.42-2.88-2.42-4.63 0-3.77 2.74-7.23 7.9-7.23 4.15 0 7.37 2.95 7.37 6.9 0 4.12-2.6 7.44-6.21 7.44-1.21 0-2.35-.63-2.74-1.37l-.75 2.84c-.27 1.04-1 2.34-1.49 3.13.72.22 1.48.34 2.28.34 6.63 0 12-5.37 12-12C24 5.37 18.63 0 12 0z" />
    </svg>
  );
}
