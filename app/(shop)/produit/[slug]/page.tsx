import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { JsonLd } from '@/components/shared/JsonLd';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { PriceTag } from '@/components/shop/PriceTag';
import { StockBadge } from '@/components/shop/StockBadge';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/shop/WishlistButton';
import { StickyProductBar } from '@/components/shop/StickyProductBar';
import { RecentlyViewedTracker } from '@/components/shop/RecentlyViewedTracker';
import { RecentlyViewedSection } from '@/components/shop/RecentlyViewedSection';
import { ReviewsSection } from '@/components/shop/ReviewsSection';
import { ReviewStars } from '@/components/shop/ReviewStars';
import { ArticleShareRow } from '@/components/articles/ArticleShareRow';
import { SpecsTable } from '@/components/shop/SpecsTable';
import { FAQAccordion, type FAQItem } from '@/components/shop/FAQAccordion';
import { RelatedProducts } from '@/components/shop/RelatedProducts';
import { getMockCategories, getMockProductBySlug, getMockProducts } from '@/lib/mock/products';
import { getMockReviewsForProduct, summarizeReviews } from '@/lib/mock/reviews';
import { buildProductSchema, buildFAQSchema } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PRODUCT_FAQ: readonly FAQItem[] = [
  {
    question: 'Comment nettoyer cet objet ?',
    answer:
      'Au savon doux et à l’eau tiède (≤ 40 °C), avant et après chaque usage. Séchage à l’air libre sur un linge propre. Pour une désinfection complète : trempage 5 minutes dans une solution antibactérienne sans alcool. Ne pas utiliser de lave-vaisselle ni de stérilisateur UV.',
  },
  {
    question: 'Quel lubrifiant utiliser ?',
    answer:
      'Toujours un lubrifiant à base d’eau (jamais à base de silicone, qui dégraderait la matière). Notre Rituel du Matin a été formulé spécialement pour cet usage : 8 ingrédients seulement, sans paraben, sans glycérine.',
  },
  {
    question: 'Combien de temps dure la batterie ?',
    answer:
      'Selon le mode de vibration utilisé, 60 à 180 minutes en usage continu. La recharge complète prend 75 à 150 minutes via USB-C magnétique. Un voyant LED ambre signale l’état de charge.',
  },
  {
    question: 'Comment se passe la livraison ?',
    answer:
      'Expédition sous 48h depuis notre entrepôt UE (Pologne) via Colissimo, Mondial Relay ou Chronopost. L’emballage extérieur est neutre — aucun logo, aucune mention du contenu ni de la marque. Boîte cartonnée standard de 22 × 18 × 6 cm.',
  },
  {
    question: 'Puis-je retourner cet objet ?',
    answer:
      'Pour des raisons d’hygiène (article L221-28 5° du Code de la consommation), les objets intimes descellés ne sont pas retournables. En revanche, tout objet dont l’emballage scellé n’a pas été ouvert peut être retourné dans les 14 jours suivant la réception, sans justification, contre remboursement intégral.',
  },
] as const;

export async function generateStaticParams() {
  return getMockProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.descriptionShort,
    keywords: product.seoKeywords,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: {
      type: 'website',
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? product.descriptionShort,
      url: `/produit/${product.slug}`,
      images: product.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);
  if (!product) notFound();

  const categories = getMockCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  const allProducts = getMockProducts();
  const related = allProducts
    .filter((p) => p.id !== product.id && p.collection === product.collection)
    .slice(0, 3);
  const reviews = getMockReviewsForProduct(product.slug);
  const reviewSummary = summarizeReviews(reviews);

  const breadcrumb = [
    { label: 'Accueil', href: '/' },
    { label: 'Boutique', href: '/boutique' },
    ...(category ? [{ label: category.name, href: `/boutique?category=${category.slug}` }] : []),
    { label: product.name, href: `/produit/${product.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={buildProductSchema(
          product,
          reviewSummary
            ? { count: reviewSummary.count, averageRating: reviewSummary.averageRating }
            : null,
          reviews,
        )}
      />
      <JsonLd data={buildFAQSchema(PRODUCT_FAQ)} />

      <Container className="py-8 md:py-12">
        <BreadcrumbNav items={breadcrumb} className="mb-10 md:mb-12" />

        {/* Layout 2 colonnes : galerie + infos */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Galerie */}
          <ProductGallery
            images={product.images}
            collection={product.collection}
            productSlug={product.slug}
          />

          {/* Info panel sticky desktop */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:h-fit">
            <div className="flex flex-col gap-3">
              <p className="ui-caps text-or-dark">{collectionLabel(product.collection)}</p>
              <h1 className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              {product.tagline ? (
                <p className="font-italic-editorial text-or-dark text-lg md:text-xl">
                  {product.tagline}
                </p>
              ) : null}

              {/* Note moyenne — cliquable pour scroller à la section avis */}
              {reviewSummary ? (
                <a
                  href="#reviews-heading"
                  className="group inline-flex items-center gap-2.5 text-sm"
                  aria-label={`Voir les ${reviewSummary.count} avis (${reviewSummary.averageRating.toFixed(1)} sur 5)`}
                >
                  <ReviewStars rating={reviewSummary.averageRating} size="sm" />
                  <span className="tabular text-encre/75 font-medium">
                    {reviewSummary.averageRating.toFixed(1)}
                  </span>
                  <span className="text-encre/55 group-hover:text-or-dark underline underline-offset-2 transition-colors">
                    {reviewSummary.count} avis
                  </span>
                </a>
              ) : null}

              <Fleuron variant="divider" size="md" color="or" className="mt-2 opacity-70" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <PriceTag
                priceCents={product.priceCents}
                compareAtPriceCents={product.compareAtPriceCents}
                size="xl"
                showTaxNotice
              />
              <StockBadge stockStatus={product.stockStatus} stockQuantity={product.stockQuantity} />
            </div>

            <p className="text-encre/85 text-base leading-relaxed">{product.descriptionShort}</p>

            <div className="flex items-stretch gap-3">
              <AddToCartButton
                slug={product.slug}
                productName={product.name}
                collection={product.collection}
                showQuantity
                size="lg"
                className="flex-1"
              />
              <WishlistButton
                slug={product.slug}
                productName={product.name}
                variant="inline"
                className="shrink-0 self-end"
              />
            </div>

            {/* Engagements en colonne à côté du panier */}
            <ul className="border-encre/10 mt-2 space-y-3 border-y py-5 text-sm">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="bg-or mt-1.5 size-1.5 shrink-0 rounded-full" />
                <span>Livraison discrète sous 48h en France · emballage neutre signé</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="bg-or mt-1.5 size-1.5 shrink-0 rounded-full" />
                <span>Silicone médical certifié ISO 10993, hypoallergénique</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="bg-or mt-1.5 size-1.5 shrink-0 rounded-full" />
                <span>Garantie 2 ans · service client 7j/7 par e-mail</span>
              </li>
            </ul>

            {/* Tags */}
            {product.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="ui-caps border-encre/15 text-encre/65 inline-flex items-center border px-2.5 py-1 text-[10px]"
                  >
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Share row — permet au bouche-à-oreille sans passer par un réseau social */}
            <ArticleShareRow
              title={product.name}
              excerpt={product.tagline ?? product.descriptionShort}
              label="Partager cet objet"
              className="mt-2"
            />
          </div>
        </div>

        {/* Description éditoriale */}
        {product.descriptionEditorial ? (
          <section
            aria-labelledby="story-heading"
            className="border-encre/10 mt-24 grid gap-10 border-t pt-16 md:grid-cols-[1fr_2fr] md:gap-16"
          >
            <div>
              <p className="ui-caps text-or-dark">L’histoire</p>
              <h2
                id="story-heading"
                className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl"
              >
                Le geste{' '}
                <span className="font-italic-editorial text-or-dark">qui précède l’objet</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="mt-5 opacity-70" />
            </div>
            <div className="prose-editorial text-encre/85 space-y-5 text-base leading-relaxed md:text-lg">
              {product.descriptionEditorial.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : null}

        {/* Description longue + features */}
        {product.descriptionLong ? (
          <section
            aria-labelledby="description-heading"
            className="border-encre/10 mt-20 grid gap-10 border-t pt-16 md:grid-cols-[1fr_2fr] md:gap-16"
          >
            <div>
              <p className="ui-caps text-or-dark">L’objet en détail</p>
              <h2
                id="description-heading"
                className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl"
              >
                Conception
              </h2>
            </div>
            <div className="text-encre/85 space-y-6 text-base leading-relaxed">
              <p>{product.descriptionLong}</p>
              {product.features.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span
                        aria-hidden="true"
                        className="bg-or mt-2 size-1 shrink-0 rounded-full"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Specs table */}
        {product.specs ? (
          <section
            aria-labelledby="specs-heading"
            className="border-encre/10 mt-20 grid gap-10 border-t pt-16 md:grid-cols-[1fr_2fr] md:gap-16"
          >
            <div>
              <p className="ui-caps text-or-dark">Caractéristiques</p>
              <h2
                id="specs-heading"
                className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl"
              >
                Les détails
              </h2>
            </div>
            <SpecsTable specs={product.specs} />
          </section>
        ) : null}

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="border-encre/10 mt-20 grid gap-10 border-t pt-16 md:grid-cols-[1fr_2fr] md:gap-16"
        >
          <div>
            <p className="ui-caps text-or-dark">Questions fréquentes</p>
            <h2
              id="faq-heading"
              className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl"
            >
              Pratique
            </h2>
            <p className="text-encre/65 mt-4 text-sm">
              Une autre question ? Notre équipe répond sous 24h via{' '}
              <a
                href="mailto:contact@atelierfrisson.fr"
                className="hover:text-or-dark underline underline-offset-2"
              >
                contact@atelierfrisson.fr
              </a>
              .
            </p>
          </div>
          <FAQAccordion items={PRODUCT_FAQ} />
        </section>

        {/* Avis clients — Schema.org reviews + AggregateRating injectés au top */}
        <ReviewsSection reviews={reviews} summary={reviewSummary} className="mt-20" />
      </Container>

      {/* Related products */}
      <RelatedProducts products={related} />

      {/* Récemment consultés — exclut le produit courant, exclut le fond rouge pour éviter la collision */}
      <RecentlyViewedSection
        excludeSlug={product.slug}
        background="light"
        subtitle="Les objets que vous avez récemment ouverts."
      />

      {/* Tracker invisible — pousse le produit courant dans localStorage au mount */}
      <RecentlyViewedTracker
        item={{
          slug: product.slug,
          name: product.name,
          tagline: product.tagline ?? null,
          priceCents: product.priceCents,
          imageUrl: product.images[0]?.url ?? null,
          imageAlt: product.images[0]?.alt ?? null,
          collection: product.collection,
        }}
      />

      {/* Sticky mobile CTA — apparait au scroll quand le bouton principal n'est plus visible */}
      <StickyProductBar product={product} />
    </>
  );
}

function collectionLabel(collection: string | null): string {
  switch (collection) {
    case 'jour':
      return 'Collection JOUR';
    case 'nuit':
      return 'Collection NUIT';
    case 'inaugurale':
      return 'Collection inaugurale';
    case 'signature':
      return 'Pièce signature';
    default:
      return 'Atelier Frisson';
  }
}
