import { PackageCheck, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

interface TrustSignal {
  title: string;
  description: string;
  icon: 'package' | 'shield' | 'truck' | 'sparkle';
}

const DEFAULT_SIGNALS: readonly TrustSignal[] = [
  {
    title: 'Silicone médical certifié',
    description: 'ISO 10993 biocompatible, hypoallergénique.',
    icon: 'shield',
  },
  {
    title: 'Livraison discrète',
    description: 'Emballage neutre signé de la main, sous 48h en France.',
    icon: 'truck',
  },
  {
    title: 'Maison française',
    description: 'Atelier fondé à Paris, entrepôt UE prioritaire.',
    icon: 'sparkle',
  },
  {
    title: 'Retours 14 jours',
    description: 'Objets descellés exclus pour raisons d’hygiène.',
    icon: 'package',
  },
] as const;

const ICON_MAP = {
  package: PackageCheck,
  shield: ShieldCheck,
  truck: Truck,
  sparkle: Sparkles,
} as const;

interface TrustSignalsProps {
  signals?: readonly TrustSignal[];
  className?: string;
}

/**
 * Bande de réassurance avant footer.
 * 4 signaux alignés en grille, séparés par un filet vertical discret en desktop.
 */
export function TrustSignals({ signals = DEFAULT_SIGNALS, className }: TrustSignalsProps) {
  return (
    <section
      aria-label="Nos engagements"
      className={cn('border-y border-noir/5 bg-ivoire-light py-10 md:py-14', className)}
    >
      <Container>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-0">
          {signals.map((signal, i) => {
            const Icon = ICON_MAP[signal.icon];
            return (
              <li
                key={signal.title}
                className={cn(
                  'flex items-start gap-4 lg:px-8',
                  i > 0 && 'lg:border-l lg:border-noir/10',
                )}
              >
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 stroke-[1.6] text-or"
                />
                <div>
                  <h3 className="ui-caps text-encre">{signal.title}</h3>
                  <p className="mt-2 text-sm text-encre/70">{signal.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
