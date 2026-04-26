import { NextResponse } from 'next/server';
import { csvResponseHeaders, toCsv } from '@/lib/exports/csv';
import { getMockProducts } from '@/lib/mock/products';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/admin/exports/products
 *
 * Exporte tous les produits en CSV. Utilisé par le bouton « Exporter CSV »
 * de /admin/produits.
 *
 * V1 : utilise getMockProducts (catalogue figé). Sprint 4 : remplacer par
 * `db.select().from(products)` (sans filtre status pour récupérer aussi
 * les drafts/archived côté admin).
 *
 * Format : UTF-8 BOM + délimiteur `;` pour Excel français.
 */
export async function GET(): Promise<Response> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const products = getMockProducts();

  const rows = products.map((p) => ({
    sku: p.supplierSku ?? '',
    slug: p.slug,
    nom: p.name,
    collection: p.collection ?? '',
    statut: p.status,
    'prix TTC (€)': (p.priceCents / 100).toFixed(2),
    'prix barré (€)': p.compareAtPriceCents ? (p.compareAtPriceCents / 100).toFixed(2) : '',
    stock: p.stockQuantity,
    'état stock': p.stockStatus,
    featured: p.isFeatured,
    'créé le': p.createdAt,
    'mis à jour': p.updatedAt,
  }));

  const csv = toCsv(rows, {
    delimiter: ';',
    bom: true,
  });

  const filename = `atelier-frisson-produits-${new Date().toISOString().split('T')[0]}.csv`;
  return new Response(csv, { headers: csvResponseHeaders(filename) });
}
