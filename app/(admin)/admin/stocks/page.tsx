import type { Metadata } from 'next';
import { Boxes, RefreshCw } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getMockProducts } from '@/lib/mock/products';
import { StockBadge } from '@/components/shop/StockBadge';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Stocks',
};

export default async function AdminStocksPage() {
  const products = getMockProducts();
  const sortedByStock = [...products].sort((a, b) => a.stockQuantity - b.stockQuantity);
  const totalStock = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const lowStockCount = products.filter((p) => p.stockStatus === 'low_stock').length;

  return (
    <>
      <AdminPageHeader
        title="Stocks"
        description={`${totalStock} unités au total — ${lowStockCount} produits en stock bas. Sync nocturne CJ + alertes seuil.`}
        actions={
          <button
            type="button"
            className="ui-caps border-encre/20 text-encre/80 hover:border-or hover:text-or inline-flex items-center gap-2 border px-4 py-2.5 transition-colors"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Sync CJ maintenant
          </button>
        }
      />

      <div className="px-8 py-8 md:px-12">
        <div className="border-encre/10 bg-ivoire overflow-x-auto border">
          <table className="w-full text-sm">
            <thead className="bg-ivoire-light">
              <tr className="border-encre/10 border-b">
                <th className="ui-caps text-encre/65 px-4 py-3 text-left text-[10px]">
                  <Boxes className="inline size-3.5" aria-hidden="true" /> Produit
                </th>
                <th className="ui-caps text-encre/65 px-4 py-3 text-right text-[10px]">Stock</th>
                <th className="ui-caps text-encre/65 px-4 py-3 text-right text-[10px]">Seuil</th>
                <th className="ui-caps text-encre/65 px-4 py-3 text-left text-[10px]">Statut</th>
                <th className="ui-caps text-encre/65 px-4 py-3 text-left text-[10px]">SKU CJ</th>
                <th className="ui-caps text-encre/65 px-4 py-3 text-left text-[10px]">Entrepôt</th>
              </tr>
            </thead>
            <tbody className="divide-encre/8 divide-y">
              {sortedByStock.map((p) => {
                const isLow = p.stockStatus === 'low_stock';
                return (
                  <tr
                    key={p.id}
                    className={cn('hover:bg-ivoire-light/60', isLow && 'bg-af-warning/5')}
                  >
                    <td className="px-4 py-3">
                      <span className="font-display text-noir text-base font-medium">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'tabular text-base font-medium',
                          isLow ? 'text-af-warning' : 'text-encre',
                        )}
                      >
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="tabular text-encre/65">{p.lowStockThreshold}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StockBadge stockStatus={p.stockStatus} stockQuantity={p.stockQuantity} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="ui-caps text-encre/65">{p.supplierSku}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="ui-caps text-or-dark">{p.supplierWarehouse}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-encre/55 mt-6 text-xs">
          Sprint 5 : alertes email automatiques quand un stock passe sous le seuil. Sync CJ nocturne
          via cron <code>/api/cron/sync-products</code>.
        </p>
      </div>
    </>
  );
}
