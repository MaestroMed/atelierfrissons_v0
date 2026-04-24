import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Save } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StockBadge } from '@/components/shop/StockBadge';
import { PriceTag } from '@/components/shop/PriceTag';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { getMockProductBySlug } from '@/lib/mock/products';
import { cn } from '@/lib/utils';

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

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description={product.tagline ?? 'Édition produit'}
        actions={
          <>
            <Link
              href={`/produit/${product.slug}`}
              target="_blank"
              className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Voir sur le site
            </Link>
            <button
              type="button"
              disabled
              className="ui-caps bg-noir text-ivoire inline-flex items-center gap-2 px-4 py-2.5 opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="size-4" aria-hidden="true" />
              Sauvegarder (Sprint 8)
            </button>
          </>
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

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Media preview */}
          <section aria-labelledby="media" className="flex flex-col gap-4">
            <h2 id="media" className="ui-caps text-or-dark">
              Visuels
            </h2>
            <div
              className={cn(
                'flex aspect-[3/4] items-center justify-center',
                isNuit ? 'bg-rouge' : 'bg-ivoire-dark/40',
              )}
            >
              <ProductSilhouette
                variant={isNuit ? 'nuit' : 'jour'}
                animationDelayMs={0}
                className="h-[75%]"
              />
            </div>
            <p className="text-encre/55 text-xs">
              {product.images.length} image{product.images.length > 1 ? 's' : ''} · Sprint 7+ :
              upload Mux + re-ordering.
            </p>
          </section>

          {/* Form preview */}
          <section aria-labelledby="details" className="flex flex-col gap-8">
            <div>
              <h2 id="details" className="ui-caps text-or-dark">
                Informations
              </h2>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <AdminField label="Nom" value={product.name} />
                <AdminField label="Slug" value={product.slug} mono />
                <AdminField label="SKU fournisseur" value={product.supplierSku ?? '—'} mono />
                <AdminField label="Collection" value={product.collection ?? '—'} />
                <AdminField label="Catégorie ID" value={product.categoryId ?? '—'} mono />
                <AdminField label="Statut" value={product.status} />
              </div>
            </div>

            <div>
              <h2 className="ui-caps text-or-dark">Prix et stock</h2>
              <div className="border-encre/10 bg-ivoire mt-4 flex flex-wrap items-center gap-6 border p-5">
                <PriceTag
                  priceCents={product.priceCents}
                  compareAtPriceCents={product.compareAtPriceCents}
                  size="xl"
                />
                <span className="bg-encre/10 h-8 w-px" aria-hidden="true" />
                <div>
                  <p className="ui-caps text-encre/55">Stock</p>
                  <p className="font-display tabular text-noir text-2xl font-medium">
                    {product.stockQuantity}
                  </p>
                </div>
                <StockBadge
                  stockStatus={product.stockStatus}
                  stockQuantity={product.stockQuantity}
                />
              </div>
            </div>

            <div>
              <h2 className="ui-caps text-or-dark">Description courte</h2>
              <p className="border-or text-encre/85 mt-3 border-l-2 pl-4 text-sm">
                {product.descriptionShort}
              </p>
            </div>

            {product.specs ? (
              <div>
                <h2 className="ui-caps text-or-dark">Caractéristiques</h2>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <li key={k} className="border-encre/5 flex justify-between border-b pb-1.5">
                      <span className="text-encre/65">{k}</span>
                      <span className="text-encre">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h2 className="ui-caps text-or-dark">SEO</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-encre/55">Title</p>
                  <p className="text-encre">{product.seoTitle ?? product.name}</p>
                </div>
                <div>
                  <p className="text-encre/55">Description</p>
                  <p className="text-encre">{product.seoDescription ?? product.descriptionShort}</p>
                </div>
                <div>
                  <p className="text-encre/55">Mots-clés</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {product.seoKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="ui-caps border-encre/15 text-encre/70 inline-flex items-center border px-2.5 py-1 text-[10px]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-encre/15 bg-ivoire-light/50 text-encre/70 border border-dashed p-5 text-sm">
              <p className="ui-caps text-or-dark">À venir Sprint 8</p>
              <p className="mt-2">
                Formulaire d’édition complet (tous les champs writable), upload d’images via Mux
                signed URL, gestion des variants, historique des versions, preview live.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function AdminField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="ui-caps text-encre/55">{label}</span>
      <span className={cn('text-encre text-sm', mono && 'font-mono text-xs')}>{value}</span>
    </div>
  );
}
