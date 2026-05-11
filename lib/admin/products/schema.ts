import { z } from 'zod';

/**
 * Schéma zod partagé client + serveur pour l'édition produit côté admin.
 *
 * Les champs correspondent à ce que le Sprint 4 DB persistera. Tout est
 * optionnel sauf name + slug + priceCents — les valeurs existantes sont
 * conservées si vide côté serveur.
 */

export const productEditSchema = z.object({
  id: z.string().uuid(),
  slug: z
    .string()
    .min(2, 'Slug trop court')
    .max(200, 'Slug trop long')
    .regex(/^[a-z0-9-]+$/, 'Slug : minuscules + chiffres + tirets'),
  name: z.string().min(2, 'Nom requis').max(200, 'Nom trop long'),
  nameShort: z.string().max(80).optional().or(z.literal('')),
  tagline: z.string().max(200).optional().or(z.literal('')),
  descriptionShort: z.string().min(10, 'Au moins 10 caractères').max(600),
  descriptionLong: z.string().max(5000).optional().or(z.literal('')),
  descriptionEditorial: z.string().max(8000).optional().or(z.literal('')),

  priceCents: z.coerce
    .number()
    .int('Centimes entiers uniquement')
    .min(0, 'Prix non négatif')
    .max(1_000_000, 'Prix max 10 000 €'),
  compareAtPriceCents: z.coerce
    .number()
    .int()
    .min(0)
    .max(1_000_000)
    .optional()
    .nullable()
    .catch(null),

  stockQuantity: z.coerce.number().int().min(0).max(99_999),
  stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock', 'preorder']),
  lowStockThreshold: z.coerce.number().int().min(0).max(1000).default(5),

  collection: z
    .enum(['couples', 'elle', 'lui', 'cadeaux', 'jour', 'nuit', 'inaugurale', 'signature'])
    .nullable()
    .or(z.literal(''))
    .transform((v) => (v === '' ? null : v)),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  isFeatured: z.coerce.boolean().default(false),

  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
  features: z.array(z.string().min(1).max(100)).max(20).default([]),
  specs: z
    .record(z.string().max(40), z.string().max(200))
    .default({})
    .refine((obj) => Object.keys(obj).length <= 20, { message: 'Max 20 specs' }),

  seoTitle: z.string().max(70).optional().or(z.literal('')),
  seoDescription: z.string().max(180).optional().or(z.literal('')),
  seoKeywords: z.array(z.string().min(1).max(40)).max(20).default([]),
});

export type ProductEditInput = z.infer<typeof productEditSchema>;

/**
 * Liste des collections / audiences pour les selects.
 *
 * Pivot V2 : `couples` / `elle` / `lui` / `cadeaux` sont les audiences
 * primaires utilisées en navigation. Les anciennes capsules `jour` / `nuit`
 * etc. sont conservées pour back-compat (produits historiques) mais ne
 * sont plus à choisir pour les nouveaux produits du pivot.
 */
export const COLLECTION_OPTIONS = [
  { value: '', label: '— Aucune —' },
  { value: 'couples', label: 'Pour Vous Deux', group: 'Pivot V2' },
  { value: 'elle', label: 'Pour Elle', group: 'Pivot V2' },
  { value: 'lui', label: 'Pour Lui', group: 'Pivot V2' },
  { value: 'cadeaux', label: 'Cadeaux', group: 'Pivot V2' },
  { value: 'jour', label: 'JOUR (legacy)', group: 'Capsules legacy' },
  { value: 'nuit', label: 'NUIT (legacy)', group: 'Capsules legacy' },
  { value: 'inaugurale', label: 'Inaugurale (legacy)', group: 'Capsules legacy' },
  { value: 'signature', label: 'Signature (legacy)', group: 'Capsules legacy' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'active', label: 'Actif (visible sur le site)' },
  { value: 'archived', label: 'Archivé' },
] as const;

export const STOCK_STATUS_OPTIONS = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'low_stock', label: 'Stock bas' },
  { value: 'out_of_stock', label: 'Rupture' },
  { value: 'preorder', label: 'Pré-commande' },
] as const;
