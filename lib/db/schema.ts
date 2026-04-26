/**
 * Atelier Frisson — schéma base de données (Drizzle ORM).
 *
 * Source de vérité : CLAUDE.md §5. 18 tables logiques (19 physiques avec
 * `newsletterSubscribers`). RLS activée sur toutes les tables — policies
 * dans `supabase/migrations/0001_row_level_security.sql`.
 *
 * Conventions :
 *  - `snake_case` côté DB (configuré via drizzle.config.ts `casing`)
 *  - `camelCase` côté TS
 *  - Prix toujours en `*_cents` (entier) pour éviter les erreurs flottantes
 *  - Soft-delete via `deleted_at` pour RGPD (`customers`)
 *  - `jsonb` typé via `.$type<T>()` pour une sécurité de type stricte
 *
 * Les relations() sont déclarées pour permettre l'API `db.query.x.findMany({ with: … })`.
 */

import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────────────────────
export const customers = pgTable(
  'customers',
  {
    /** `auth.users.id` — aligné 1:1 avec Supabase Auth. */
    id: uuid('id').primaryKey(),
    email: text('email').notNull().unique(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    phone: text('phone'),
    dateOfBirth: timestamp('date_of_birth', { withTimezone: true }),
    ageVerifiedAt: timestamp('age_verified_at', { withTimezone: true }),
    /** 'self_declared' | 'verifymy' | 'idxlab' */
    ageVerifiedMethod: text('age_verified_method'),
    marketingConsent: boolean('marketing_consent').default(false).notNull(),
    marketingConsentAt: timestamp('marketing_consent_at', { withTimezone: true }),
    klaviyoProfileId: text('klaviyo_profile_id'),
    notes: text('notes'),
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),
    ltvCents: integer('ltv_cents').default(0).notNull(),
    totalOrders: integer('total_orders').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    /** Soft-delete RGPD : hard-delete 30j après ce timestamp. */
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('customers_email_idx').on(t.email),
    index('customers_klaviyo_idx').on(t.klaviyoProfileId),
    index('customers_deleted_at_idx').on(t.deletedAt),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────────────────────────────────────
export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id')
      .references(() => customers.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type', { enum: ['shipping', 'billing'] }).notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    company: text('company'),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    postalCode: text('postal_code').notNull(),
    state: text('state'),
    country: varchar('country', { length: 2 }).default('FR').notNull(),
    phone: text('phone'),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('addresses_customer_idx').on(t.customerId)],
);

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES — taxonomie produit (arbre simple parent/children)
// ─────────────────────────────────────────────────────────────────────────────
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    heroImageUrl: text('hero_image_url'),
    parentId: uuid('parent_id'),
    displayOrder: integer('display_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('categories_slug_idx').on(t.slug),
    index('categories_parent_idx').on(t.parentId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    nameShort: text('name_short'),
    tagline: text('tagline'),
    descriptionShort: text('description_short').notNull(),
    descriptionLong: text('description_long'),
    descriptionEditorial: text('description_editorial'),
    specs: jsonb('specs').$type<Record<string, string>>(),
    features: jsonb('features').$type<string[]>().default([]).notNull(),

    priceCents: integer('price_cents').notNull(),
    compareAtPriceCents: integer('compare_at_price_cents'),
    costCents: integer('cost_cents'),
    currency: varchar('currency', { length: 3 }).default('EUR').notNull(),
    taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('20.00').notNull(),

    images: jsonb('images')
      .$type<Array<{ url: string; alt: string; width: number; height: number }>>()
      .default([])
      .notNull(),
    videoMuxPlaybackId: text('video_mux_playback_id'),
    videoPosterUrl: text('video_poster_url'),

    categoryId: uuid('category_id').references(() => categories.id),
    /** 'jour' | 'nuit' | 'inaugurale' | 'signature' — capsules éditoriales */
    collection: text('collection', { enum: ['jour', 'nuit', 'inaugurale', 'signature'] }),
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),

    supplierId: uuid('supplier_id'),
    supplierSku: text('supplier_sku'),
    supplierProductId: text('supplier_product_id'),
    supplierWarehouse: text('supplier_warehouse'),
    supplierShippingDays: integer('supplier_shipping_days'),

    stockQuantity: integer('stock_quantity').default(0).notNull(),
    stockStatus: text('stock_status', {
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'preorder'],
    })
      .default('in_stock')
      .notNull(),
    lowStockThreshold: integer('low_stock_threshold').default(5).notNull(),

    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    seoKeywords: jsonb('seo_keywords').$type<string[]>().default([]).notNull(),
    schemaOrgData: jsonb('schema_org_data').$type<Record<string, unknown>>(),

    status: text('status', { enum: ['draft', 'active', 'archived'] })
      .default('draft')
      .notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('products_slug_idx').on(t.slug),
    index('products_status_idx').on(t.status),
    index('products_category_idx').on(t.categoryId),
    index('products_collection_idx').on(t.collection),
    index('products_featured_idx').on(t.isFeatured),
  ],
);

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    sku: text('sku').notNull().unique(),
    name: text('name').notNull(),
    priceCents: integer('price_cents'),
    stockQuantity: integer('stock_quantity').default(0).notNull(),
    supplierSku: text('supplier_sku'),
    images: jsonb('images').$type<Array<{ url: string; alt: string }>>().default([]).notNull(),
    attributes: jsonb('attributes').$type<Record<string, string>>(),
    displayOrder: integer('display_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (t) => [
    uniqueIndex('product_variants_sku_idx').on(t.sku),
    index('product_variants_product_idx').on(t.productId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// CARTS
// ─────────────────────────────────────────────────────────────────────────────
export const carts = pgTable(
  'carts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: text('session_id').unique(),
    customerId: uuid('customer_id').references(() => customers.id),
    discountCode: text('discount_code'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [index('carts_customer_idx').on(t.customerId)],
);

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cartId: uuid('cart_id')
      .references(() => carts.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id),
    quantity: integer('quantity').default(1).notNull(),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('cart_items_cart_idx').on(t.cartId)],
);

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** AF-2026-000001 — généré applicativement (voir lib/db/queries/orders.ts) */
    orderNumber: text('order_number').notNull().unique(),
    customerId: uuid('customer_id').references(() => customers.id),
    customerEmail: text('customer_email').notNull(),

    status: text('status', {
      enum: [
        'pending_payment',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
        'partial_refund',
      ],
    })
      .default('pending_payment')
      .notNull(),

    subtotalCents: integer('subtotal_cents').notNull(),
    shippingCents: integer('shipping_cents').default(0).notNull(),
    taxCents: integer('tax_cents').notNull(),
    discountCents: integer('discount_cents').default(0).notNull(),
    totalCents: integer('total_cents').notNull(),
    currency: varchar('currency', { length: 3 }).default('EUR').notNull(),

    paymentProvider: text('payment_provider', { enum: ['stripe', 'ccbill'] }),
    paymentIntentId: text('payment_intent_id'),
    paymentStatus: text('payment_status'),
    paidAt: timestamp('paid_at', { withTimezone: true }),

    shippingMethod: text('shipping_method'),
    shippingAddress: jsonb('shipping_address').$type<Record<string, unknown>>(),
    billingAddress: jsonb('billing_address').$type<Record<string, unknown>>(),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    trackingNumber: text('tracking_number'),
    trackingUrl: text('tracking_url'),
    carrier: text('carrier'),

    supplierOrderId: text('supplier_order_id'),
    supplierStatus: text('supplier_status'),

    discountCode: text('discount_code'),
    notes: text('notes'),
    customerNote: text('customer_note'),
    giftMessage: text('gift_message'),

    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('orders_customer_idx').on(t.customerId),
    index('orders_status_idx').on(t.status),
    index('orders_email_idx').on(t.customerEmail),
    uniqueIndex('orders_order_number_idx').on(t.orderNumber),
    index('orders_created_at_idx').on(t.createdAt),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id),
    productName: text('product_name').notNull(),
    productSlug: text('product_slug').notNull(),
    variantName: text('variant_name'),
    sku: text('sku').notNull(),
    imageUrl: text('image_url'),
    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    totalPriceCents: integer('total_price_cents').notNull(),
    taxCents: integer('tax_cents').notNull(),
  },
  (t) => [index('order_items_order_idx').on(t.orderId)],
);

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const promotions = pgTable('promotions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  type: text('type', { enum: ['percentage', 'fixed', 'free_shipping', 'bxgy'] }).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minOrderCents: integer('min_order_cents'),
  maxUsages: integer('max_usages'),
  usageCount: integer('usage_count').default(0).notNull(),
  usagePerCustomer: integer('usage_per_customer').default(1).notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  applicableProducts: jsonb('applicable_products').$type<string[]>(),
  applicableCategories: jsonb('applicable_categories').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS — avec workflow modération obligatoire
// ─────────────────────────────────────────────────────────────────────────────
export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    customerId: uuid('customer_id').references(() => customers.id),
    orderId: uuid('order_id').references(() => orders.id),
    rating: integer('rating').notNull(),
    title: text('title'),
    body: text('body').notNull(),
    authorName: text('author_name').notNull(),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false).notNull(),
    status: text('status', { enum: ['pending', 'approved', 'rejected', 'spam'] })
      .default('pending')
      .notNull(),
    moderatedBy: uuid('moderated_by'),
    moderatedAt: timestamp('moderated_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('reviews_product_idx').on(t.productId), index('reviews_status_idx').on(t.status)],
);

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES — blog éditorial & guides piliers (MDX/HTML)
// ─────────────────────────────────────────────────────────────────────────────
export const articles = pgTable(
  'articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    contentType: text('content_type', { enum: ['mdx', 'html'] })
      .default('mdx')
      .notNull(),
    category: text('category'),
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),
    author: text('author'),
    authorBio: text('author_bio'),
    authorRole: text('author_role'),
    heroImageUrl: text('hero_image_url'),
    heroImageAlt: text('hero_image_alt'),
    readingTimeMinutes: integer('reading_time_minutes'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    schemaOrgData: jsonb('schema_org_data').$type<Record<string, unknown>>(),
    relatedProductIds: jsonb('related_product_ids').$type<string[]>().default([]).notNull(),
    relatedArticleIds: jsonb('related_article_ids').$type<string[]>().default([]).notNull(),
    status: text('status', { enum: ['draft', 'published', 'archived'] })
      .default('draft')
      .notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('articles_slug_idx').on(t.slug),
    index('articles_status_idx').on(t.status),
    index('articles_category_idx').on(t.category),
    index('articles_featured_idx').on(t.isFeatured),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// FORGE PAGES — pSEO (cf. docs/FORGE_WORKFLOW.md)
// Ingestion via webhook HMAC, validation humaine obligatoire avant publication.
// ─────────────────────────────────────────────────────────────────────────────
export const forgePages = pgTable(
  'forge_pages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    template: text('template', {
      enum: ['livraison_ville', 'conseil_longtail', 'guide_specialise', 'produit_contexte'],
    }).notNull(),
    title: text('title').notNull(),
    metaDescription: text('meta_description').notNull(),
    /** HTML sanitisé ou MDX compilé côté factory FORJA. */
    content: text('content').notNull(),
    /** Variables d'interpolation du template (ville, produit_id, etc.). */
    contentData: jsonb('content_data').$type<Record<string, unknown>>(),

    // SEO
    h1: text('h1').notNull(),
    keywords: jsonb('keywords').$type<string[]>().default([]).notNull(),
    canonicalUrl: text('canonical_url'),
    schemaOrgData: jsonb('schema_org_data').$type<Record<string, unknown>>(),

    // Qualité & modération
    qualityScore: integer('quality_score'),
    humanReviewed: boolean('human_reviewed').default(false).notNull(),
    reviewedBy: uuid('reviewed_by'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),

    // Monitoring (remontée Google Search Console)
    indexedByGoogle: boolean('indexed_by_google').default(false).notNull(),
    lastSearchAppearance: timestamp('last_search_appearance', { withTimezone: true }),
    impressions30d: integer('impressions_30d').default(0).notNull(),
    clicks30d: integer('clicks_30d').default(0).notNull(),
    avgPosition30d: decimal('avg_position_30d', { precision: 5, scale: 2 }),

    // State machine
    status: text('status', {
      enum: ['draft', 'pending_review', 'published', 'archived', 'penalized'],
    })
      .default('draft')
      .notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('forge_pages_slug_idx').on(t.slug),
    index('forge_pages_status_idx').on(t.status),
    index('forge_pages_template_idx').on(t.template),
    index('forge_pages_quality_idx').on(t.qualityScore),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// SEO REDIRECTS — table des 301/302 gérables depuis l'admin
// ─────────────────────────────────────────────────────────────────────────────
export const redirects = pgTable(
  'redirects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fromPath: text('from_path').notNull().unique(),
    toPath: text('to_path').notNull(),
    statusCode: integer('status_code').default(301).notNull(),
    hitsCount: integer('hits_count').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('redirects_from_path_idx').on(t.fromPath)],
);

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING EVENTS — funnel + sync Klaviyo
// ─────────────────────────────────────────────────────────────────────────────
export const marketingEvents = pgTable(
  'marketing_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id').references(() => customers.id),
    sessionId: text('session_id'),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>(),
    syncedToKlaviyo: boolean('synced_to_klaviyo').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('events_customer_idx').on(t.customerId),
    index('events_type_idx').on(t.eventType),
    index('events_synced_idx').on(t.syncedToKlaviyo),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN USERS — 2FA TOTP OBLIGATOIRE en production (voir CLAUDE.md §8.1)
// ─────────────────────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum: ['owner', 'manager', 'support', 'contributor'] }).notNull(),
  permissions: jsonb('permissions').$type<string[]>().default([]).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  /** Chiffré applicatif avec `ADMIN_2FA_ENCRYPTION_KEY` (jamais en clair). */
  twoFactorSecret: text('two_factor_secret'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  lastLoginIp: text('last_login_ip'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG — append-only, lu par owner uniquement
// ─────────────────────────────────────────────────────────────────────────────
export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorId: uuid('actor_id'),
    actorType: text('actor_type', {
      enum: ['admin', 'customer', 'system', 'anonymous'],
    }).notNull(),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: uuid('resource_id'),
    changes: jsonb('changes').$type<{
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
    }>(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('audit_actor_idx').on(t.actorId),
    index('audit_resource_idx').on(t.resourceType, t.resourceId),
    index('audit_created_idx').on(t.createdAt),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES — PDF générés, mentions TVA conformes
// ─────────────────────────────────────────────────────────────────────────────
export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    invoiceNumber: text('invoice_number').notNull().unique(),
    orderId: uuid('order_id')
      .references(() => orders.id)
      .notNull(),
    pdfUrl: text('pdf_url'),
    totalHtCents: integer('total_ht_cents').notNull(),
    totalTvaCents: integer('total_tva_cents').notNull(),
    totalTtcCents: integer('total_ttc_cents').notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('invoices_invoice_number_idx').on(t.invoiceNumber)],
);

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER SUBSCRIBERS — double opt-in, sync Klaviyo
// ─────────────────────────────────────────────────────────────────────────────
export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    status: text('status', { enum: ['subscribed', 'unsubscribed', 'bounced'] })
      .default('subscribed')
      .notNull(),
    source: text('source'),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    klaviyoProfileId: text('klaviyo_profile_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('newsletter_email_idx').on(t.email)],
);

// ═════════════════════════════════════════════════════════════════════════════
// PIVOT V2 — DROPSHIP COUPLES 30-50 ANS
// Ces 9 tables ajoutent : abonnement box mensuelle, bundles, parrainage,
// fidélité, cartes cadeaux. Voir docs/ETAT_DES_LIEUX.md §3.
// ═════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION PLANS — box mensuelle (Découverte 39€ / Premium 49€ / Trio 59€)
// ─────────────────────────────────────────────────────────────────────────────
export const subscriptionPlans = pgTable(
  'subscription_plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    tagline: text('tagline'),
    description: text('description'),
    /** Prix mensuel en cents (3900 = 39 €). */
    priceCents: integer('price_cents').notNull(),
    /** Nombre d'articles inclus dans la box. */
    itemsPerBox: integer('items_per_box').default(3).notNull(),
    /** Engagement minimum en mois (0 = sans engagement). */
    minCommitmentMonths: integer('min_commitment_months').default(0).notNull(),
    /** Pourcentage de réduction sur le prix annuel (paiement annuel). */
    annualDiscountPercent: integer('annual_discount_percent').default(0).notNull(),
    heroImageUrl: text('hero_image_url'),
    isActive: boolean('is_active').default(true).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('subscription_plans_slug_idx').on(t.slug),
    index('subscription_plans_active_idx').on(t.isActive),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTIONS — instances actives client × plan, billing CCBill recurring
// ─────────────────────────────────────────────────────────────────────────────
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id')
      .references(() => customers.id, { onDelete: 'cascade' })
      .notNull(),
    planId: uuid('plan_id')
      .references(() => subscriptionPlans.id)
      .notNull(),
    status: text('status', {
      enum: ['active', 'paused', 'past_due', 'cancelled', 'expired'],
    })
      .default('active')
      .notNull(),
    /** Cycle de facturation : mensuel ou annuel. */
    billingCycle: text('billing_cycle', { enum: ['monthly', 'annual'] })
      .default('monthly')
      .notNull(),
    /** ID interne du PSP recurring (CCBill subscription_id ou Verotel). */
    pspProvider: text('psp_provider', { enum: ['ccbill', 'verotel', 'stripe'] }).notNull(),
    pspSubscriptionId: text('psp_subscription_id'),
    /** Date du prochain prélèvement. */
    nextChargeAt: timestamp('next_charge_at', { withTimezone: true }),
    /** Skip : permet à la cliente de sauter 1 mois sans annuler. */
    skipNextShipment: boolean('skip_next_shipment').default(false).notNull(),
    /** Adresse livraison snapshot (peut différer de l'adresse par défaut). */
    shippingAddress: jsonb('shipping_address'),
    /** Préférences contenu (allergies, exclusions, niveau d'expérience). */
    preferences: jsonb('preferences').$type<{
      excludeCategories?: string[];
      experienceLevel?: 'debutant' | 'intermediaire' | 'avance';
      preferredVibe?: 'doux' | 'audacieux' | 'classique';
      notes?: string;
    }>(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    pausedAt: timestamp('paused_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancellationReason: text('cancellation_reason'),
    /** Montant cumulé facturé sur cette souscription en cents. */
    lifetimeValueCents: integer('lifetime_value_cents').default(0).notNull(),
    shipmentsCount: integer('shipments_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('subscriptions_customer_idx').on(t.customerId),
    index('subscriptions_status_idx').on(t.status),
    index('subscriptions_next_charge_idx').on(t.nextChargeAt),
    uniqueIndex('subscriptions_psp_id_idx').on(t.pspSubscriptionId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION SHIPMENTS — un envoi mensuel par souscription active
// ─────────────────────────────────────────────────────────────────────────────
export const subscriptionShipments = pgTable(
  'subscription_shipments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subscriptionId: uuid('subscription_id')
      .references(() => subscriptions.id, { onDelete: 'cascade' })
      .notNull(),
    /** Numéro de box (1 = première box, incrémental). */
    boxNumber: integer('box_number').notNull(),
    /** Mois logique de la box au format YYYY-MM. */
    period: text('period').notNull(),
    status: text('status', {
      enum: ['pending', 'preparing', 'shipped', 'delivered', 'returned'],
    })
      .default('pending')
      .notNull(),
    /** Snapshot des produits inclus (id + nom + image + quantité). */
    items: jsonb('items')
      .$type<
        Array<{
          productId: string;
          productName: string;
          productSlug: string;
          imageUrl: string | null;
          quantity: number;
          unitPriceCents: number;
        }>
      >()
      .default([])
      .notNull(),
    /** Coût d'achat fournisseur (pour calcul marge). */
    cogsCents: integer('cogs_cents').default(0).notNull(),
    /** Prix payé par la cliente (snapshot). */
    revenueCents: integer('revenue_cents').notNull(),
    trackingNumber: text('tracking_number'),
    trackingUrl: text('tracking_url'),
    carrier: text('carrier'),
    chargedAt: timestamp('charged_at', { withTimezone: true }),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('shipments_subscription_idx').on(t.subscriptionId),
    index('shipments_status_idx').on(t.status),
    uniqueIndex('shipments_sub_box_idx').on(t.subscriptionId, t.boxNumber),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// BUNDLES — combos pré-fabriqués 79-149 € (Soirée à deux, Évasion week-end…)
// ─────────────────────────────────────────────────────────────────────────────
export const bundles = pgTable(
  'bundles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    tagline: text('tagline'),
    descriptionShort: text('description_short').notNull(),
    descriptionLong: text('description_long'),
    /** Prix bundle en cents (avantage vs somme des articles unitaires). */
    priceCents: integer('price_cents').notNull(),
    /** Prix barré (somme normale des produits) pour affichage économie. */
    compareAtPriceCents: integer('compare_at_price_cents'),
    heroImageUrl: text('hero_image_url'),
    images: jsonb('images')
      .$type<Array<{ url: string; alt: string; width: number; height: number }>>()
      .default([])
      .notNull(),
    /** Niveau d'occasion : Saint-Valentin, anniversaire, EVJF… */
    occasion: text('occasion', {
      enum: ['saint_valentin', 'anniversaire', 'evjf', 'evg', 'noel', 'mariage', 'pas_d_occasion'],
    })
      .default('pas_d_occasion')
      .notNull(),
    /** Disponibilité saisonnière (NULL = toute l'année). */
    availableFrom: timestamp('available_from', { withTimezone: true }),
    availableUntil: timestamp('available_until', { withTimezone: true }),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    schemaOrgData: jsonb('schema_org_data'),
    status: text('status', { enum: ['draft', 'active', 'archived'] })
      .default('draft')
      .notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('bundles_slug_idx').on(t.slug),
    index('bundles_status_idx').on(t.status),
    index('bundles_occasion_idx').on(t.occasion),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// BUNDLE ITEMS — composition d'un bundle (one-to-many)
// ─────────────────────────────────────────────────────────────────────────────
export const bundleItems = pgTable(
  'bundle_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bundleId: uuid('bundle_id')
      .references(() => bundles.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id),
    quantity: integer('quantity').default(1).notNull(),
    /** Si vrai, le bundle ne peut pas être ajouté au panier sans cet item. */
    isRequired: boolean('is_required').default(true).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
  },
  (t) => [
    index('bundle_items_bundle_idx').on(t.bundleId),
    index('bundle_items_product_idx').on(t.productId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// GIFT CARDS — codes uniques avec solde, expirent 12 mois
// ─────────────────────────────────────────────────────────────────────────────
export const giftCards = pgTable(
  'gift_cards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Code humain-lisible XXXX-XXXX-XXXX-XXXX (cf. lib/auth/totp.ts). */
    code: text('code').notNull().unique(),
    /** Hash du code pour validation constant-time côté serveur. */
    codeHash: text('code_hash').notNull(),
    /** Montant initial en cents. */
    initialBalanceCents: integer('initial_balance_cents').notNull(),
    /** Solde restant en cents (peut être 0 quand totalement consommée). */
    remainingBalanceCents: integer('remaining_balance_cents').notNull(),
    currency: varchar('currency', { length: 3 }).default('EUR').notNull(),
    /** Achetée par (NULL = générée admin/promo). */
    purchaserCustomerId: uuid('purchaser_customer_id').references(() => customers.id),
    purchaserOrderId: uuid('purchaser_order_id').references(() => orders.id),
    /** Destinataire si donnée en cadeau (email + message personnalisé). */
    recipientEmail: text('recipient_email'),
    recipientName: text('recipient_name'),
    giftMessage: text('gift_message'),
    /** Date d'envoi prévue (ex: Saint-Valentin J-J). */
    scheduledSendAt: timestamp('scheduled_send_at', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    status: text('status', { enum: ['pending', 'active', 'consumed', 'expired', 'cancelled'] })
      .default('pending')
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('gift_cards_code_idx').on(t.code),
    uniqueIndex('gift_cards_code_hash_idx').on(t.codeHash),
    index('gift_cards_status_idx').on(t.status),
    index('gift_cards_recipient_email_idx').on(t.recipientEmail),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// GIFT CARD TRANSACTIONS — utilisation partielle/totale lors d'une commande
// ─────────────────────────────────────────────────────────────────────────────
export const giftCardTransactions = pgTable(
  'gift_card_transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    giftCardId: uuid('gift_card_id')
      .references(() => giftCards.id, { onDelete: 'cascade' })
      .notNull(),
    orderId: uuid('order_id').references(() => orders.id),
    /** Montant débité (ou crédité si remboursement). */
    amountCents: integer('amount_cents').notNull(),
    /** Solde après l'opération. */
    balanceAfterCents: integer('balance_after_cents').notNull(),
    type: text('type', { enum: ['redeem', 'refund', 'topup', 'issue', 'expire'] }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('gift_card_tx_card_idx').on(t.giftCardId),
    index('gift_card_tx_order_idx').on(t.orderId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// LOYALTY POINTS TRANSACTIONS — programme fidélité (1 € = 1 point)
// ─────────────────────────────────────────────────────────────────────────────
export const loyaltyPointsTransactions = pgTable(
  'loyalty_points_transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id')
      .references(() => customers.id, { onDelete: 'cascade' })
      .notNull(),
    /** Points gagnés (positif) ou dépensés (négatif). */
    points: integer('points').notNull(),
    /** Source : achat, parrainage, anniversaire, expiration… */
    reason: text('reason', {
      enum: [
        'order_earned',
        'order_redeemed',
        'referral_bonus',
        'birthday_bonus',
        'review_bonus',
        'admin_adjustment',
        'expiration',
      ],
    }).notNull(),
    orderId: uuid('order_id').references(() => orders.id),
    /** Solde cumulé après l'opération (sum running). */
    balanceAfter: integer('balance_after').notNull(),
    /** Date d'expiration de ces points (12 mois standard). */
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('loyalty_tx_customer_idx').on(t.customerId),
    index('loyalty_tx_reason_idx').on(t.reason),
    index('loyalty_tx_expires_idx').on(t.expiresAt),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// REFERRALS — programme parrainage 20 € offert / 20 € gagné
// ─────────────────────────────────────────────────────────────────────────────
export const referrals = pgTable(
  'referrals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Le parrain. */
    referrerId: uuid('referrer_id')
      .references(() => customers.id, { onDelete: 'cascade' })
      .notNull(),
    /** Le filleul (NULL tant qu'il ne s'est pas inscrit). */
    refereeId: uuid('referee_id').references(() => customers.id),
    /** Code unique du parrain (ex: ODELIE-AB12CD). */
    code: text('code').notNull().unique(),
    /** Email du filleul saisi avant inscription (capture intent). */
    refereeEmail: text('referee_email'),
    /** Statut du parrainage. */
    status: text('status', {
      enum: ['pending', 'signed_up', 'first_purchase', 'rewarded', 'expired'],
    })
      .default('pending')
      .notNull(),
    /** Montant en cents offert au parrain (gagné après 1ère commande filleul). */
    referrerRewardCents: integer('referrer_reward_cents').default(2000).notNull(),
    /** Montant en cents offert au filleul (utilisable dès inscription). */
    refereeRewardCents: integer('referee_reward_cents').default(2000).notNull(),
    /** Première commande qui a déclenché la récompense. */
    triggeringOrderId: uuid('triggering_order_id').references(() => orders.id),
    signedUpAt: timestamp('signed_up_at', { withTimezone: true }),
    rewardedAt: timestamp('rewarded_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('referrals_code_idx').on(t.code),
    index('referrals_referrer_idx').on(t.referrerId),
    index('referrals_referee_idx').on(t.refereeId),
    index('referrals_status_idx').on(t.status),
  ],
);

// ═════════════════════════════════════════════════════════════════════════════
// RELATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  carts: many(carts),
  reviews: many(reviews),
  marketingEvents: many(marketingEvents),
  subscriptions: many(subscriptions),
  loyaltyPointsTransactions: many(loyaltyPointsTransactions),
  referralsAsReferrer: many(referrals, { relationName: 'referrer' }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'categoryHierarchy',
  }),
  children: many(categories, { relationName: 'categoryHierarchy' }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  reviews: many(reviews),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [carts.customerId],
    references: [customers.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  invoices: many(invoices),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  customer: one(customers, { fields: [reviews.customerId], references: [customers.id] }),
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, { fields: [invoices.orderId], references: [orders.id] }),
}));

export const marketingEventsRelations = relations(marketingEvents, ({ one }) => ({
  customer: one(customers, {
    fields: [marketingEvents.customerId],
    references: [customers.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// PIVOT V2 RELATIONS — abonnements, bundles, fidélité, parrainage, cartes
// ─────────────────────────────────────────────────────────────────────────────
export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  customer: one(customers, {
    fields: [subscriptions.customerId],
    references: [customers.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
  shipments: many(subscriptionShipments),
}));

export const subscriptionShipmentsRelations = relations(subscriptionShipments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [subscriptionShipments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const bundlesRelations = relations(bundles, ({ many }) => ({
  items: many(bundleItems),
}));

export const bundleItemsRelations = relations(bundleItems, ({ one }) => ({
  bundle: one(bundles, {
    fields: [bundleItems.bundleId],
    references: [bundles.id],
  }),
  product: one(products, {
    fields: [bundleItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [bundleItems.variantId],
    references: [productVariants.id],
  }),
}));

export const giftCardsRelations = relations(giftCards, ({ one, many }) => ({
  purchaserCustomer: one(customers, {
    fields: [giftCards.purchaserCustomerId],
    references: [customers.id],
  }),
  purchaserOrder: one(orders, {
    fields: [giftCards.purchaserOrderId],
    references: [orders.id],
  }),
  transactions: many(giftCardTransactions),
}));

export const giftCardTransactionsRelations = relations(giftCardTransactions, ({ one }) => ({
  giftCard: one(giftCards, {
    fields: [giftCardTransactions.giftCardId],
    references: [giftCards.id],
  }),
  order: one(orders, {
    fields: [giftCardTransactions.orderId],
    references: [orders.id],
  }),
}));

export const loyaltyPointsTransactionsRelations = relations(
  loyaltyPointsTransactions,
  ({ one }) => ({
    customer: one(customers, {
      fields: [loyaltyPointsTransactions.customerId],
      references: [customers.id],
    }),
    order: one(orders, {
      fields: [loyaltyPointsTransactions.orderId],
      references: [orders.id],
    }),
  }),
);

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(customers, {
    fields: [referrals.referrerId],
    references: [customers.id],
    relationName: 'referrer',
  }),
  referee: one(customers, {
    fields: [referrals.refereeId],
    references: [customers.id],
    relationName: 'referee',
  }),
  triggeringOrder: one(orders, {
    fields: [referrals.triggeringOrderId],
    references: [orders.id],
  }),
}));

// ═════════════════════════════════════════════════════════════════════════════
// TYPES INFERRED — à importer depuis les queries / composants
// ═════════════════════════════════════════════════════════════════════════════

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type Promotion = typeof promotions.$inferSelect;
export type NewPromotion = typeof promotions.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type ForgePage = typeof forgePages.$inferSelect;
export type NewForgePage = typeof forgePages.$inferInsert;

export type Redirect = typeof redirects.$inferSelect;
export type NewRedirect = typeof redirects.$inferInsert;

export type MarketingEvent = typeof marketingEvents.$inferSelect;
export type NewMarketingEvent = typeof marketingEvents.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Pivot V2

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type SubscriptionShipment = typeof subscriptionShipments.$inferSelect;
export type NewSubscriptionShipment = typeof subscriptionShipments.$inferInsert;

export type Bundle = typeof bundles.$inferSelect;
export type NewBundle = typeof bundles.$inferInsert;

export type BundleItem = typeof bundleItems.$inferSelect;
export type NewBundleItem = typeof bundleItems.$inferInsert;

export type GiftCard = typeof giftCards.$inferSelect;
export type NewGiftCard = typeof giftCards.$inferInsert;

export type GiftCardTransaction = typeof giftCardTransactions.$inferSelect;
export type NewGiftCardTransaction = typeof giftCardTransactions.$inferInsert;

export type LoyaltyPointsTransaction = typeof loyaltyPointsTransactions.$inferSelect;
export type NewLoyaltyPointsTransaction = typeof loyaltyPointsTransactions.$inferInsert;

export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
