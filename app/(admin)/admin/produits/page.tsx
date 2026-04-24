import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Download, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getMockProducts } from '@/lib/mock/products';
import { formatPriceCents } from '@/lib/format';
import { StockBadge } from '@/components/shop/StockBadge';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Produits',
};

export default async function AdminProduitsPage() {
  const products = getMockProducts();

  return (
    <>
      <AdminPageHeader
        title="Produits"
        description={`${products.length} objets dans le catalogue. CRUD complet, sync CJ, médias Mux.`}
        actions={
          <>
            <button
              type="button"
              className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
            >
              <Download className="size-4" aria-hidden="true" />
              Exporter CSV
            </button>
            <Link
              href="/admin/produits/nouveau"
              className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
            >
              <Plus className="size-4" aria-hidden="true" />
              Nouveau produit
            </Link>
          </>
        }
      />

      <div className="space-y-6 px-8 py-8 md:px-12">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative flex w-full max-w-sm items-center">
            <Search
              aria-hidden="true"
              className="text-encre/40 pointer-events-none absolute left-3 size-4"
            />
            <input
              type="search"
              placeholder="Rechercher un produit, SKU, slug…"
              className="border-encre/20 bg-ivoire placeholder:text-encre/40 focus:border-or w-full border px-3 py-2.5 pl-10 text-sm focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip label="Tous" active count={products.length} />
            <FilterChip
              label="Actifs"
              count={products.filter((p) => p.status === 'active').length}
            />
            <FilterChip label="Brouillons" count={0} />
            <FilterChip label="Archivés" count={0} />
            <FilterChip
              label="Stock bas"
              count={products.filter((p) => p.stockStatus === 'low_stock').length}
            />
          </div>
        </div>

        {/* Table */}
        <div className="border-encre/10 bg-ivoire overflow-x-auto border">
          <table className="w-full text-sm">
            <thead className="bg-ivoire-light">
              <tr className="border-encre/10 border-b">
                <Th>Produit</Th>
                <Th>Collection</Th>
                <Th>SKU</Th>
                <Th align="right">Prix</Th>
                <Th align="right">Stock</Th>
                <Th>Statut</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-encre/8 divide-y">
              {products.map((product) => {
                const isNuit = product.collection === 'nuit';
                return (
                  <tr key={product.id} className="hover:bg-ivoire-light/60">
                    <Td>
                      <Link
                        href={`/admin/produits/${product.slug}`}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={cn(
                            'flex size-12 shrink-0 items-center justify-center overflow-hidden',
                            isNuit ? 'bg-rouge' : 'bg-ivoire-dark/40',
                          )}
                        >
                          <ProductSilhouette
                            variant={isNuit ? 'nuit' : 'jour'}
                            animationDelayMs={0}
                            className="h-[80%]"
                          />
                        </span>
                        <span>
                          <span className="font-display text-noir block text-base font-medium">
                            {product.name}
                          </span>
                          <span className="text-encre/55 text-xs">{product.tagline}</span>
                        </span>
                      </Link>
                    </Td>
                    <Td>
                      {product.collection ? (
                        <span className="ui-caps text-or-dark">
                          {product.collection.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-encre/40">—</span>
                      )}
                    </Td>
                    <Td>
                      <span className="ui-caps text-encre/65">{product.supplierSku}</span>
                    </Td>
                    <Td align="right">
                      <span className="tabular text-encre">
                        {formatPriceCents(product.priceCents)}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="tabular text-encre">{product.stockQuantity}</span>
                    </Td>
                    <Td>
                      <StockBadge
                        stockStatus={product.stockStatus}
                        stockQuantity={product.stockQuantity}
                      />
                    </Td>
                    <Td align="right">
                      <Link
                        href={`/admin/produits/${product.slug}`}
                        className="ui-caps text-or-dark hover:text-or"
                      >
                        Éditer
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-encre/55 text-xs">
          Sprint 5 : édition produit complète, sync CJ, upload médias Mux, variantes, suppression
          soft-delete.
        </p>
      </div>
    </>
  );
}

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <th
      className={cn(
        'ui-caps text-encre/65 px-4 py-3 text-[10px]',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <td
      className={cn(
        'px-4 py-3',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
      )}
    >
      {children}
    </td>
  );
}

function FilterChip({
  label,
  active = false,
  count,
}: {
  label: string;
  active?: boolean;
  count: number;
}) {
  return (
    <button
      type="button"
      className={cn(
        'ui-caps inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] transition-colors',
        active
          ? 'border-or bg-or/10 text-noir'
          : 'border-encre/20 text-encre/65 hover:border-or/60 hover:text-or-dark',
      )}
    >
      {label}
      <span className="tabular text-[10px] opacity-70">({count})</span>
    </button>
  );
}
