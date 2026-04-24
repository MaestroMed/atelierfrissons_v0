import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { ProductEditForm } from '@/components/admin/ProductEditForm';
import { getMockProductBySlug } from '@/lib/mock/products';
import { cn } from '@/lib/utils';
import type { ProductEditInput } from '@/lib/admin/products/schema';

export const metadata: Metadata = {
  title: 'Édition produit',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);
  if (!product) notFound();

  const isNuit = product.collection === 'nuit';

  // Hydrate le formulaire depuis le produit existant
  const initialFormValues: ProductEditInput = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameShort: product.nameShort ?? '',
    tagline: product.tagline ?? '',
    descriptionShort: product.descriptionShort,
    descriptionLong: product.descriptionLong ?? '',
    descriptionEditorial: product.descriptionEditorial ?? '',
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents ?? null,
    stockQuantity: product.stockQuantity,
    stockStatus: product.stockStatus,
    lowStockThreshold: product.lowStockThreshold,
    collection: product.collection,
    status: product.status,
    isFeatured: product.isFeatured,
    tags: [...product.tags],
    features: [...product.features],
    specs: { ...(product.specs ?? {}) },
    seoTitle: product.seoTitle ?? '',
    seoDescription: product.seoDescription ?? '',
    seoKeywords: [...product.seoKeywords],
  };

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description={product.tagline ?? 'Édition produit'}
        actions={
          <Link
            href={`/produit/${product.slug}`}
            target="_blank"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Voir sur le site
          </Link>
        }
      />

      <div className="px-8 py-8 md:px-12">
        <Link
          href="/admin/produits"
          className="ui-caps text-encre/65 hover:text-or-dark mb-6 inline-flex items-center gap-2"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Retour aux produits
        </Link>

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* Sticky media preview (colonne gauche) */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
            <h2 className="ui-caps text-or-dark">Aperçu visuel</h2>
            <div
              className={cn(
                'flex aspect-[3/4] items-center justify-center border',
                isNuit ? 'bg-rouge border-or/30' : 'bg-ivoire-dark/40 border-encre/10',
              )}
            >
              <ProductSilhouette
                variant={isNuit ? 'nuit' : 'jour'}
                animationDelayMs={0}
                className="h-[75%]"
              />
            </div>
            <p className="text-encre/55 text-xs">
              {product.images.length} image{product.images.length > 1 ? 's' : ''} · upload Mux +
              re-ordering en Sprint 8
            </p>
            <div className="border-encre/10 bg-ivoire-light/40 border p-4 text-xs">
              <p className="ui-caps text-or-dark">ID interne</p>
              <p className="text-encre/70 mt-1.5 font-mono text-[11px] break-all">{product.id}</p>
            </div>
          </aside>

          {/* Formulaire (colonne droite) */}
          <div>
            <ProductEditForm initial={initialFormValues} />
          </div>
        </div>
      </div>
    </>
  );
}
