import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';

/**
 * Placeholder homepage — Sprint 1 / Étape 2.
 *
 * Le vrai HeroSplit JOUR/NUIT sera implémenté en Étape 4 et déplacé dans
 * `app/(marketing)/page.tsx`. Pour l'instant, cette page permet de visualiser
 * Header + Footer + tokens avec une mise en attente éditoriale soignée.
 */
export default function HomePagePlaceholder() {
  return (
    <Container as="section" className="flex min-h-[70dvh] flex-col items-center justify-center py-24 text-center">
      <p className="ui-caps text-or">Étape 2 · design system</p>
      <Fleuron variant="divider" size="md" color="or" className="my-6" />
      <Wordmark
        as="h1"
        size="hero"
        color="noir"
        layout="stacked"
        animate
        className="mx-auto max-w-4xl"
      />
      <p className="mt-8 max-w-xl font-italic-editorial text-xl text-encre/80">
        Pour tous les rituels. <span className="text-or">Pour tous les moments.</span>
      </p>
      <Fleuron variant="divider" size="md" color="or" className="mt-10 opacity-60" />
      <p className="mt-6 max-w-lg text-sm text-encre/60">
        Le HeroSplit JOUR / NUIT sera révélé à l’Étape 4. En attendant, le design
        system, la palette et les composants de layout sont en place.
      </p>
    </Container>
  );
}
