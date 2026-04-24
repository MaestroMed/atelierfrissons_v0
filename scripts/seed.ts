/**
 * scripts/seed.ts — peuplement de la base de dev/staging.
 *
 * Usage : `pnpm db:seed`
 *
 * Prérequis : `.env.local` rempli (DATABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 *             Schéma appliqué via `pnpm db:push` + RLS SQL.
 *
 * Idempotent : utilise upsert on conflict. Peut être rejoué sans casser.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock/products';
import { MOCK_ARTICLES } from '@/lib/mock/articles';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    '\n❌ Supabase non configuré. Renseignez dans .env.local :\n' +
      '   NEXT_PUBLIC_SUPABASE_URL\n' +
      '   SUPABASE_SERVICE_ROLE_KEY\n\n' +
      '   Voir docs/SUPABASE_SETUP.md\n',
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedCategories() {
  console.info(`▸ Catégories (${MOCK_CATEGORIES.length})…`);
  const rows = MOCK_CATEGORIES.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    seo_title: c.seoTitle,
    seo_description: c.seoDescription,
    hero_image_url: c.heroImageUrl,
    parent_id: c.parentId,
    display_order: c.displayOrder,
    is_active: c.isActive,
  }));
  const { error } = await admin.from('categories').upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`categories seed failed: ${error.message}`);
  console.info(`   ✓ ${rows.length} catégories upserted`);
}

async function seedProducts() {
  console.info(`▸ Produits (${MOCK_PRODUCTS.length})…`);
  const rows = MOCK_PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_short: p.nameShort,
    tagline: p.tagline,
    description_short: p.descriptionShort,
    description_long: p.descriptionLong,
    description_editorial: p.descriptionEditorial,
    specs: p.specs,
    features: p.features,
    price_cents: p.priceCents,
    compare_at_price_cents: p.compareAtPriceCents,
    cost_cents: p.costCents,
    currency: p.currency,
    tax_rate: p.taxRate,
    images: p.images,
    video_mux_playback_id: p.videoMuxPlaybackId,
    video_poster_url: p.videoPosterUrl,
    category_id: p.categoryId,
    collection: p.collection,
    tags: p.tags,
    supplier_id: p.supplierId,
    supplier_sku: p.supplierSku,
    supplier_product_id: p.supplierProductId,
    supplier_warehouse: p.supplierWarehouse,
    supplier_shipping_days: p.supplierShippingDays,
    stock_quantity: p.stockQuantity,
    stock_status: p.stockStatus,
    low_stock_threshold: p.lowStockThreshold,
    seo_title: p.seoTitle,
    seo_description: p.seoDescription,
    seo_keywords: p.seoKeywords,
    schema_org_data: p.schemaOrgData,
    status: p.status,
    is_featured: p.isFeatured,
    published_at: p.publishedAt?.toISOString(),
  }));
  const { error } = await admin.from('products').upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`products seed failed: ${error.message}`);
  console.info(`   ✓ ${rows.length} produits upserted`);
}

async function seedArticles() {
  console.info(`▸ Articles (${MOCK_ARTICLES.length})…`);
  const rows = MOCK_ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    content_type: 'html' as const,
    category: a.category,
    tags: [a.category.toLowerCase().replace(' ', '-')],
    author: a.author,
    author_bio: a.authorBio ?? null,
    author_role: a.authorRole,
    reading_time_minutes: a.readingTimeMinutes,
    seo_title: a.title,
    seo_description: a.excerpt,
    related_product_ids: [] as string[], // Les slugs sont dans le content HTML — Sprint 8 : resolution produits réelle
    related_article_ids: [] as string[],
    status: 'published' as const,
    is_featured: a.isFeatured,
    published_at: a.publishedAt.toISOString(),
  }));
  const { error } = await admin.from('articles').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error(`articles seed failed: ${error.message}`);
  console.info(`   ✓ ${rows.length} articles upserted`);
}

async function seedAdminUser() {
  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
  if (!bootstrapEmail) {
    console.info('▸ Admin bootstrap skippé (ADMIN_BOOTSTRAP_EMAIL absent)');
    return;
  }
  console.info(`▸ Admin user bootstrap (${bootstrapEmail})…`);
  // Créer l'utilisateur Supabase Auth s'il n'existe pas
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  let userId = existingUsers?.users.find((u) => u.email === bootstrapEmail)?.id;
  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: bootstrapEmail,
      email_confirm: true,
    });
    if (error) throw new Error(`admin user creation failed: ${error.message}`);
    userId = data.user?.id;
  }
  if (!userId) {
    console.warn('   ⚠ user id introuvable, admin_users skippé');
    return;
  }
  // Insert dans admin_users (owner avec tous les droits)
  const { error } = await admin.from('admin_users').upsert(
    {
      id: userId,
      email: bootstrapEmail,
      first_name: 'Bootstrap',
      last_name: 'Admin',
      role: 'owner' as const,
      permissions: ['*'],
      two_factor_enabled: false,
      is_active: true,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`admin_users seed failed: ${error.message}`);
  console.info(`   ✓ admin_users owner créé/mis à jour (${userId})`);
}

async function main() {
  console.info('\n🌱 Atelier Frisson — seed de la base de développement\n');
  try {
    await seedCategories();
    await seedProducts();
    await seedArticles();
    await seedAdminUser();
    console.info('\n✅ Seed terminé avec succès.\n');
  } catch (err) {
    console.error('\n❌ Seed échoué :', (err as Error).message, '\n');
    process.exit(1);
  }
}

main();
