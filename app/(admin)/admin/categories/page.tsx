import type { Metadata } from 'next';
import { Plus, FolderTree } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getMockCategories, getMockProducts } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Catégories',
};

export default async function AdminCategoriesPage() {
  const categories = getMockCategories();
  const products = getMockProducts();

  return (
    <>
      <AdminPageHeader
        title="Catégories"
        description="Taxonomie produit — drag & drop, ordre d'affichage, SEO meta."
        actions={
          <button
            type="button"
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouvelle catégorie
          </button>
        }
      />

      <div className="px-8 py-8 md:px-12">
        <ul className="flex flex-col gap-3">
          {categories.map((cat) => {
            const productCount = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <li
                key={cat.id}
                className="border-encre/10 bg-ivoire hover:border-or flex items-center justify-between gap-4 border p-5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <FolderTree className="text-or-dark mt-0.5 size-5" aria-hidden="true" />
                  <div>
                    <p className="font-display text-noir text-lg font-medium">{cat.name}</p>
                    <p className="text-encre/65 mt-0.5 text-xs">/{cat.slug}</p>
                    {cat.description ? (
                      <p className="text-encre/75 mt-2 max-w-2xl text-sm">{cat.description}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="ui-caps text-encre/55">{productCount} objets</span>
                  <button type="button" className="ui-caps text-or-dark hover:text-or">
                    Éditer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
