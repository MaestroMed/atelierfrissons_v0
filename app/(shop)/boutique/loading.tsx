import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Skeleton, ProductGridSkeleton } from '@/components/shared/Skeleton';

/**
 * Loading skeleton pour /boutique — affiché pendant le streaming SSR
 * de la page (Server Components qui chargent les produits).
 *
 * Reproduit la structure visuelle de la page réelle pour minimiser
 * le CLS et donner l'impression que le contenu arrive immédiatement.
 */
export default function BoutiqueLoading() {
  return (
    <>
      <section className="bg-ivoire-light py-10 md:py-14">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Skeleton variant="text" className="h-3 w-40" />
            <Skeleton variant="text" className="h-12 w-48" />
            <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-40" />
            <Skeleton variant="text" className="h-4 w-2/3" />
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Filtres skeleton */}
          <aside className="flex flex-col gap-6">
            <Skeleton variant="text" className="h-3 w-24" />
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} variant="text" className="h-4" />
              ))}
            </div>
            <Skeleton variant="text" className="h-3 w-24" />
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} variant="text" className="h-4" />
              ))}
            </div>
          </aside>

          {/* Grille produits skeleton */}
          <div className="flex flex-col gap-6">
            <div className="border-encre/10 flex items-center justify-between border-b pb-4">
              <Skeleton variant="text" className="h-3 w-40" />
              <Skeleton variant="text" className="h-8 w-32" />
            </div>
            <ProductGridSkeleton count={6} />
          </div>
        </div>
      </Container>
    </>
  );
}
