import { z } from 'zod';

/** Schémas zod partagés client + serveur pour la validation checkout. */

export const contactSchema = z.object({
  email: z.string().email('Adresse e-mail invalide').max(255),
  firstName: z.string().min(1, 'Prénom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  phone: z
    .string()
    .max(30)
    .regex(/^[+0-9\s().-]*$/, 'Format téléphone invalide')
    .optional()
    .or(z.literal('')),
});

export const addressSchema = z.object({
  line1: z.string().min(1, 'Adresse requise').max(200),
  line2: z.string().max(200).optional().or(z.literal('')),
  postalCode: z
    .string()
    .min(4, 'Code postal requis')
    .max(10)
    .regex(/^[0-9A-Z\s-]+$/i, 'Code postal invalide'),
  city: z.string().min(1, 'Ville requise').max(120),
  country: z.string().length(2, 'Code pays ISO-2').default('FR'),
});

export const checkoutSchema = z
  .object({
    contact: contactSchema,
    shippingAddress: addressSchema,
    /** Si true, billingAddress = shippingAddress */
    billingSameAsShipping: z.boolean().default(true),
    billingAddress: addressSchema.optional(),
    shippingMethod: z.enum(['standard', 'point-relais', 'express']).default('standard'),
    notes: z.string().max(500).optional().or(z.literal('')),
    /** Si true, le message cadeau est pris en compte et l'emballage signature est ciré. */
    isGift: z.boolean().default(false),
    /** Emballage cadeau signé de la main (offert, brand signature). */
    giftWrap: z.boolean().default(false),
    giftMessage: z.string().max(280).optional().or(z.literal('')),
    consentMarketing: z.boolean().default(false),
    /** Acceptation CGV — obligatoire (L221-5). */
    consentTerms: z
      .boolean()
      .refine((v) => v === true, { message: 'Vous devez accepter les conditions de vente' }),
  })
  .refine(
    (data) =>
      data.billingSameAsShipping ||
      (data.billingAddress &&
        data.billingAddress.line1.length > 0 &&
        data.billingAddress.city.length > 0),
    {
      message: 'Adresse de facturation incomplète',
      path: ['billingAddress'],
    },
  );

export type ContactInput = z.infer<typeof contactSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const SHIPPING_METHODS = [
  {
    value: 'standard',
    label: 'Colissimo Domicile',
    delay: '2 à 4 jours ouvrés',
    priceCents: 690,
    description: 'Livraison à domicile, signature à la livraison.',
  },
  {
    value: 'point-relais',
    label: 'Mondial Relay',
    delay: '3 à 5 jours ouvrés',
    priceCents: 490,
    description: 'Retrait dans un point relais — plus de 12 000 en France.',
  },
  {
    value: 'express',
    label: 'Chronopost Express',
    delay: '24h en France',
    priceCents: 1290,
    description: 'Livraison le lendemain avant 13h, traçabilité en temps réel.',
  },
] as const;

export type ShippingMethodKey = (typeof SHIPPING_METHODS)[number]['value'];

export function getShippingMethod(key: ShippingMethodKey) {
  return SHIPPING_METHODS.find((m) => m.value === key) ?? SHIPPING_METHODS[0];
}
