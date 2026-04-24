import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  /** Étoiles sur 5 (optionnel). */
  rating?: number;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'Le premier objet qui ne me fait pas rougir en vitrine. Packaging irréprochable, finition qui évoque un parfum de niche plus qu’un accessoire.',
    author: 'Camille, 34 ans',
    role: 'Journaliste, Paris',
    rating: 5,
  },
  {
    quote:
      'J’avais peur de commander ce genre d’objet. Tout a été fait pour que la démarche soit douce — livraison discrète, emballage signé, service client qui répond vite et juste.',
    author: 'Sophie, 42 ans',
    role: 'Architecte d’intérieur, Bordeaux',
    rating: 5,
  },
  {
    quote:
      'Le site est un vrai magazine. J’ai commandé après avoir lu trois articles — le rapport aux matières et au rituel m’a convaincue.',
    author: 'Léa, 29 ans',
    role: 'Directrice artistique, Lyon',
    rating: 5,
  },
] as const;

interface TestimonialsProps {
  testimonials?: readonly Testimonial[];
  title?: string;
  subtitle?: string;
}

/**
 * Section témoignages — utilisée sur la homepage et potentiellement fiche
 * produit. Sobriété maximale : citations en Bodoni italique, auteur en
 * small caps, séparateurs au fleuron.
 *
 * Sprint 8+ : remplacer mock par vraies reviews (table `reviews` +
 * AggregateRating Schema.org injecté sur produit).
 */
export function Testimonials({
  testimonials = TESTIMONIALS,
  title = 'Ce que disent celles qui nous lisent',
  subtitle = 'Trois retours — sélectionnés parmi les lettres reçues au service client.',
}: TestimonialsProps) {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-ivoire-light py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <header className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-20">
            <p className="ui-caps text-or-dark">Paroles</p>
            <h2
              id="testimonials-heading"
              className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            <Fleuron variant="divider" size="md" color="or" className="opacity-70" />
            <p className="font-italic-editorial text-encre/70 text-base md:text-lg">{subtitle}</p>
          </header>
        </ScrollReveal>

        <ul className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 120} as="div">
              <li className="flex h-full flex-col">
                <figure className="border-or/30 flex h-full flex-col gap-5 border-t pt-6">
                  <Fleuron variant="mark" size="sm" color="or" className="opacity-60" />
                  <blockquote className="font-italic-editorial text-encre/90 text-lg leading-relaxed md:text-xl">
                    <span aria-hidden="true" className="text-or">
                      «&nbsp;
                    </span>
                    {t.quote}
                    <span aria-hidden="true" className="text-or">
                      &nbsp;»
                    </span>
                  </blockquote>
                  <figcaption className="mt-auto flex flex-col gap-1">
                    <span className="ui-caps text-noir">— {t.author}</span>
                    <span className="text-encre/60 text-xs">{t.role}</span>
                  </figcaption>
                </figure>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
