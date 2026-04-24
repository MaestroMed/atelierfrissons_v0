import type { Product, Category } from '@/lib/db/schema';

/**
 * Données produit / catégorie placeholder — utilisées tant que le seed DB
 * n'est pas appliqué (avant que CJ valide le catalogue + photos shootées).
 *
 * Le shape suit `lib/db/schema.ts` (`Product`, `Category`) pour garantir une
 * substitution sans douleur quand on bascule sur Drizzle queries en Sprint 3+.
 *
 * IDs UUID v4 fixes pour éviter les hydration mismatches RSC.
 */

export const MOCK_CATEGORIES: readonly Category[] = [
  {
    id: '01000000-0000-0000-0000-000000000001',
    slug: 'plaisir-solo',
    name: 'Plaisir solo',
    description:
      'Objets pensés pour les rituels d’exploration intime, en silicone médical certifié.',
    seoTitle: 'Plaisir solo — collection Atelier Frisson',
    seoDescription:
      'La collection plaisir solo : ergonomie, silicone médical, design éditorial. Livraison discrète France.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 1,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: '01000000-0000-0000-0000-000000000002',
    slug: 'complicite-couple',
    name: 'Complicité couple',
    description: 'Pour les rituels à deux — douceur, complicité, geste lent.',
    seoTitle: 'Complicité couple — collection Atelier Frisson',
    seoDescription:
      'Objets de rituel à deux, conçus pour la complicité. Maison française, silicone médical.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 2,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: '01000000-0000-0000-0000-000000000003',
    slug: 'bien-etre-intime',
    name: 'Bien-être intime',
    description: 'Soins, lubrifiants, accessoires pour un rituel complet.',
    seoTitle: 'Bien-être intime — collection Atelier Frisson',
    seoDescription:
      'Soins et accessoires pour le rituel intime : lubrifiants, nettoyants, étuis discrets.',
    heroImageUrl: null,
    parentId: null,
    displayOrder: 3,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
] as const;

function placeholderImages(variant: 'jour' | 'nuit'): Product['images'] {
  return [
    {
      url: `/images/products/silhouette-${variant}-1.svg`,
      alt: `Objet de rituel ${variant === 'jour' ? 'JOUR' : 'NUIT'} — vue principale`,
      width: 1200,
      height: 1600,
    },
    {
      url: `/images/products/silhouette-${variant}-2.svg`,
      alt: `Objet de rituel ${variant === 'jour' ? 'JOUR' : 'NUIT'} — vue détail`,
      width: 1200,
      height: 1600,
    },
  ];
}

const baseDate = new Date('2026-04-01T00:00:00Z');

export const MOCK_PRODUCTS: readonly Product[] = [
  {
    id: '02000000-0000-0000-0000-000000000001',
    slug: 'premier-frisson',
    name: 'Premier Frisson',
    nameShort: 'Premier Frisson',
    tagline: 'Un objet pensé pour les premiers gestes lents.',
    descriptionShort:
      'Stimulateur ergonomique en silicone médical, finition mate ivoire. Pensé pour les premiers rituels.',
    descriptionLong:
      'Le Premier Frisson est notre objet inaugural. Une silhouette ergonomique étudiée pendant 18 mois pour s’adapter à toutes les morphologies, taillée dans un silicone médical certifié ISO 10993, avec une base ornée du monogramme AF en or champagne. Sa finition mate, douce au toucher, évoque la pierre polie ; son moteur silencieux (< 50 dB) propose six modes de vibration progressive.',
    descriptionEditorial: `Il existe des objets que l’on garde toute une vie — et d’autres que l’on choisit pour marquer un commencement. Le Premier Frisson appartient à cette seconde famille.

Conçu en collaboration avec une sexologue clinicienne et une designer industrielle parisienne, il est l’aboutissement de 18 mois de recherches sur l’ergonomie féminine, la perception sensorielle du silicone médical, et l’intention sculpturale d’un objet de rituel.

Chaque pièce sort d’un atelier européen partenaire, est contrôlée individuellement, puis envoyée dans son écrin neutre — sans logo apparent, signé à la main.`,
    specs: {
      Matériau: 'Silicone médical certifié ISO 10993',
      Dimensions: '18 cm × 3,5 cm',
      Poids: '180 g',
      Autonomie: '90 min en usage continu',
      Recharge: 'USB-C magnétique, 90 min',
      Étanchéité: 'IPX7',
      'Niveau sonore': '< 50 dB',
      Modes: '6 vibrations progressives',
      Garantie: '2 ans',
    },
    features: [
      'Silicone médical certifié',
      'Étanche IPX7',
      'Recharge USB-C magnétique',
      '6 modes de vibration',
      'Moteur silencieux',
      'Garantie 2 ans',
      'Emballage neutre signé',
      'Livraison discrète',
    ],
    priceCents: 8900,
    compareAtPriceCents: null,
    costCents: 1800,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('jour'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[0]!.id,
    collection: 'jour',
    tags: ['silicone-medical', 'ergonomique', 'premier-objet', 'sans-bpa'],
    supplierId: null,
    supplierSku: 'CJ-AF-001-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 47,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Premier Frisson — Stimulateur silicone médical | Atelier Frisson',
    seoDescription:
      'Premier Frisson : stimulateur ergonomique en silicone médical certifié, design éditorial signé Paris. Livraison discrète France 48h.',
    seoKeywords: [
      'stimulateur silicone médical',
      'objet bien-être intime',
      'premier stimulateur',
      'wellness intime français',
    ],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000002',
    slug: 'velours-rouge',
    name: 'Velours Rouge',
    nameShort: 'Velours Rouge',
    tagline: 'Le rituel du soir, en silicone glossy finition miroir.',
    descriptionShort:
      'Stimulateur double action en silicone laqué profond. Finition miroir, pensé pour les rituels du soir.',
    descriptionLong:
      'Velours Rouge est la pièce signature de la collection NUIT. Sa finition glossy laquée, obtenue par double polissage, évoque les laques chinoises traditionnelles. Son design double-action combine stimulation interne et externe synchronisées, avec sept rythmes de vibration distincts.',
    descriptionEditorial: `La nuit a ses propres règles. Velours Rouge en respecte deux : la lenteur, et l’attention.

Inspiré des laques de la dynastie Ming et des sculptures de Constantin Brancusi, cet objet propose une expérience double — interne et externe — synchronisée par un moteur sans à-coup.

Sa finition glossy n’est pas seulement esthétique : elle facilite l’usage avec un lubrifiant à base d’eau et permet un nettoyage instantané.`,
    specs: {
      Matériau: 'Silicone médical certifié ISO 10993',
      Dimensions: '20 cm × 4 cm',
      Poids: '220 g',
      Autonomie: '120 min en usage continu',
      Recharge: 'USB-C magnétique, 120 min',
      Étanchéité: 'IPX7',
      'Niveau sonore': '< 45 dB',
      Modes: '7 rythmes synchronisés',
      Garantie: '2 ans',
    },
    features: [
      'Silicone médical certifié',
      'Double action interne + externe',
      'Étanche IPX7',
      'Recharge USB-C magnétique',
      '7 rythmes synchronisés',
      'Garantie 2 ans',
      'Emballage neutre signé',
    ],
    priceCents: 12900,
    compareAtPriceCents: null,
    costCents: 2400,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('nuit'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[0]!.id,
    collection: 'nuit',
    tags: ['silicone-medical', 'double-action', 'glossy', 'rituel-soir'],
    supplierId: null,
    supplierSku: 'CJ-AF-002-NOIR',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 28,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Velours Rouge — Stimulateur double action | Atelier Frisson',
    seoDescription:
      'Velours Rouge : stimulateur double action silicone médical glossy. Maison française, livraison discrète, garantie 2 ans.',
    seoKeywords: [
      'stimulateur double action',
      'silicone médical glossy',
      'objet rituel soir',
      'wellness intime premium',
    ],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000003',
    slug: 'essentiel-jour',
    name: 'Essentiel Jour',
    nameShort: 'Essentiel Jour',
    tagline: 'La silhouette signature, tout en légèreté.',
    descriptionShort:
      'Format compact, silicone médical mat, vibration discrète. Pour les rituels rapides et confidentiels.',
    descriptionLong:
      'Essentiel Jour est notre objet de poche : taille compacte, silicone médical mat ivoire, trois modes de vibration. Conçu pour glisser dans la trousse de toilette ou le sac à main, il est livré dans un étui de voyage en lin écru.',
    descriptionEditorial: `Tout, dans Essentiel Jour, est une question de mesure. La taille — la plus petite de la collection. Le bruit — quasi inaudible. Le toucher — un silicone mat à peine perceptible. Et l’étui de voyage, en lin écru, qui évoque davantage un porte-cartes qu’un accessoire intime.`,
    specs: {
      Matériau: 'Silicone médical ISO 10993',
      Dimensions: '12 cm × 2,5 cm',
      Poids: '95 g',
      Autonomie: '60 min',
      Recharge: 'USB-C, 75 min',
      Étanchéité: 'IPX6',
      'Niveau sonore': '< 40 dB',
      Modes: '3 vibrations discrètes',
      Inclus: 'Étui de voyage lin écru',
    },
    features: [
      'Format compact voyage',
      'Silicone médical mat',
      'Étui en lin inclus',
      'Très silencieux',
    ],
    priceCents: 7900,
    compareAtPriceCents: null,
    costCents: 1500,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('jour'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[0]!.id,
    collection: 'jour',
    tags: ['compact', 'voyage', 'discret'],
    supplierId: null,
    supplierSku: 'CJ-AF-003-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 62,
    stockStatus: 'in_stock',
    lowStockThreshold: 10,
    seoTitle: 'Essentiel Jour — Format compact silicone médical | Atelier Frisson',
    seoDescription:
      'Essentiel Jour : objet compact en silicone médical avec étui de voyage en lin. Maison française, livraison discrète.',
    seoKeywords: ['objet voyage discret', 'compact silicone médical', 'wellness intime'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000004',
    slug: 'noir-profond',
    name: 'Noir Profond',
    nameShort: 'Noir Profond',
    tagline: 'Présence sculptée — la collection NUIT à son apogée.',
    descriptionShort:
      'Pièce signature de la maison. Silicone médical noir glossy, ergonomie poussée à son maximum.',
    descriptionLong:
      'Noir Profond est l’objet le plus abouti de la maison. Quatre années de R&D, dix-sept prototypes, une finition glossy obtenue par triple polissage. Son moteur double couple offre neuf modes synchronisés, dont trois rythmes inspirés de partitions musicales (Satie, Glass, Eno).',
    descriptionEditorial: `Quatre années pour aboutir à un seul objet. Dix-sept prototypes. Trois sexologues consultantes, deux designers, un musicien — Brian Eno a composé l’un des trois rythmes signature, baptisé « Discreet Music » en hommage à son album de 1975.

Noir Profond n’est pas seulement notre pièce la plus aboutie. C’est notre déclaration : faire de l’objet de rituel intime un objet de design, au même titre qu’une lampe Tizio ou un fauteuil Egg.`,
    specs: {
      Matériau: 'Silicone médical ISO 10993, finition triple polissage',
      Dimensions: '22 cm × 4,5 cm',
      Poids: '290 g',
      Autonomie: '180 min',
      Recharge: 'USB-C magnétique, 150 min',
      Étanchéité: 'IPX8',
      'Niveau sonore': '< 38 dB',
      Modes: '9 rythmes (dont 3 signature musicale)',
      Garantie: 'Garantie à vie',
    },
    features: [
      'Pièce signature maison',
      'Silicone médical triple polissage',
      'Moteur double couple',
      '9 modes dont 3 signature musicale',
      'Étanche IPX8 (immersion totale)',
      'Garantie à vie',
    ],
    priceCents: 14900,
    compareAtPriceCents: null,
    costCents: 3200,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('nuit'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[0]!.id,
    collection: 'nuit',
    tags: ['signature', 'haut-de-gamme', 'glossy', 'rituel-soir'],
    supplierId: null,
    supplierSku: 'CJ-AF-004-NOIR',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 12,
    stockStatus: 'low_stock',
    lowStockThreshold: 5,
    seoTitle: 'Noir Profond — Pièce signature | Atelier Frisson',
    seoDescription:
      'Noir Profond : la pièce signature Atelier Frisson. Silicone médical glossy, 9 modes synchronisés, garantie à vie.',
    seoKeywords: [
      'stimulateur premium français',
      'pièce signature wellness',
      'objet design intime',
    ],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000005',
    slug: 'albatre',
    name: 'Albâtre',
    nameShort: 'Albâtre',
    tagline: 'Matière mate, toucher velouté, calme absolu.',
    descriptionShort:
      'Stimulateur clitoridien externe en silicone mat ivoire. Six modes d’ondes pulsées.',
    descriptionLong:
      'Albâtre est notre stimulateur externe à ondes pulsées. Sa technologie d’air pulsé crée une sensation d’aspiration douce, sans contact direct. Six modes progressifs, taille de poche, finition mate ivoire évoquant la pierre.',
    descriptionEditorial: `L’albâtre, en sculpture, est la matière des transitions douces. C’est cet objet — la transition entre le soin et le rituel.`,
    specs: {
      Matériau: 'Silicone médical mat',
      Technologie: 'Ondes pulsées (air pulse)',
      Dimensions: '15 cm × 6 cm',
      Poids: '160 g',
      Autonomie: '75 min',
      Étanchéité: 'IPX7',
      Modes: '6 ondes progressives',
    },
    features: ['Technologie air pulsé', 'Sans contact direct', 'Format compact', 'Silicone mat'],
    priceCents: 10900,
    compareAtPriceCents: null,
    costCents: 2100,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('jour'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[0]!.id,
    collection: 'jour',
    tags: ['air-pulse', 'externe', 'mat'],
    supplierId: null,
    supplierSku: 'CJ-AF-005-IVO',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 35,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Albâtre — Stimulateur ondes pulsées | Atelier Frisson',
    seoDescription:
      'Albâtre : stimulateur externe à ondes pulsées en silicone mat. Maison française, livraison discrète.',
    seoKeywords: ['stimulateur ondes pulsées', 'air pulse français', 'wellness externe'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000006',
    slug: 'laque-minuit',
    name: 'Laque Minuit',
    nameShort: 'Laque Minuit',
    tagline: 'Géométrie patiente, finition laquée rouge profond.',
    descriptionShort:
      'Œuf vibrant connecté en silicone médical laqué. Pilotable à distance via application Bluetooth.',
    descriptionLong:
      'Laque Minuit est notre objet connecté. Œuf vibrant en silicone médical laqué rouge profond, contrôlé via application iOS/Android, avec mode duo synchronisé. Discret, autonome, pensé pour la complicité longue distance.',
    descriptionEditorial: `Une distance peut s’apprivoiser. Laque Minuit a été conçu pour les couples qui ne vivent pas sous le même toit, ou pour les rituels solitaires qui s’inventent à deux. L’application — disponible sur iOS et Android, sans tracking publicitaire — propose un mode synchronisation entre deux objets, des programmes éditoriaux mensuels, et un journal d’usage strictement local.`,
    specs: {
      Matériau: 'Silicone médical laqué',
      Connectivité: 'Bluetooth 5.3 + application iOS/Android',
      Dimensions: '8 cm × 3,5 cm',
      Poids: '110 g',
      Autonomie: '90 min',
      Étanchéité: 'IPX7',
      Modes: 'Programmable via application',
      'Vie privée': 'Pas de cloud, tracking off par défaut',
    },
    features: [
      'Connecté Bluetooth',
      'Application iOS/Android',
      'Mode duo synchronisé',
      'Pas de tracking',
    ],
    priceCents: 13900,
    compareAtPriceCents: null,
    costCents: 2700,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('nuit'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[1]!.id,
    collection: 'nuit',
    tags: ['connecte', 'duo', 'application', 'distance'],
    supplierId: null,
    supplierSku: 'CJ-AF-006-NOIR',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 18,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Laque Minuit — Objet connecté duo | Atelier Frisson',
    seoDescription:
      'Laque Minuit : œuf vibrant connecté Bluetooth, application iOS/Android, mode duo. Maison française, vie privée respectée.',
    seoKeywords: ['objet intime connecté', 'duo bluetooth', 'distance couple'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: true,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000007',
    slug: 'rituel-du-matin-lubrifiant',
    name: 'Rituel du Matin — Lubrifiant',
    nameShort: 'Rituel du Matin',
    tagline: 'Hydratant intime à base d’eau — formule maison.',
    descriptionShort:
      'Lubrifiant intime à base d’eau, formule courte (8 ingrédients), flacon ambré 100 ml.',
    descriptionLong:
      'Notre lubrifiant Rituel du Matin est formulé en France avec huit ingrédients seulement, sans glycérine, sans paraben, sans parfum. Compatible silicone médical et latex. Texture aqueuse fluide, pH adapté à la flore intime.',
    descriptionEditorial: `Le lubrifiant n’est pas un accessoire. C’est un soin. Notre formule a été développée avec une pharmacienne en officine, en partant d’une question simple : que mettrait-on dans un soin pour la peau la plus délicate du corps ?`,
    specs: {
      Volume: '100 ml',
      Base: 'Eau (aqueuse)',
      Ingrédients: '8 (sans glycérine, paraben, parfum)',
      Compatibilité: 'Silicone médical, latex, polyuréthane',
      pH: '4,5 (compatible flore intime)',
      Made: 'Formulé et conditionné en France',
    },
    features: [
      'Base eau',
      'Formule courte 8 ingrédients',
      'Sans paraben/glycérine',
      'Made in France',
      'Compatible silicone',
    ],
    priceCents: 1900,
    compareAtPriceCents: null,
    costCents: 350,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('jour'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[2]!.id,
    collection: 'jour',
    tags: ['lubrifiant', 'eau', 'made-in-france', 'soin'],
    supplierId: null,
    supplierSku: 'CJ-AF-007-LUB',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 84,
    stockStatus: 'in_stock',
    lowStockThreshold: 15,
    seoTitle: 'Rituel du Matin — Lubrifiant intime made in France | Atelier Frisson',
    seoDescription:
      'Lubrifiant intime à base d’eau, formule courte 8 ingrédients, sans paraben. Made in France.',
    seoKeywords: ['lubrifiant eau français', 'formule courte', 'lubrifiant sans paraben'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
  {
    id: '02000000-0000-0000-0000-000000000008',
    slug: 'etui-velours',
    name: 'Étui Velours',
    nameShort: 'Étui Velours',
    tagline: 'Rangement de voyage en velours côtelé.',
    descriptionShort:
      'Étui de rangement en velours côtelé écru avec doublure satin. Pour transporter discrètement.',
    descriptionLong:
      'L’Étui Velours protège vos objets pendant les déplacements. Conçu en velours côtelé écru à l’extérieur, doublé de satin de soie naturelle à l’intérieur, avec fermeture aimantée. Atelier de confection : Roubaix.',
    descriptionEditorial: `Un objet précieux mérite son écrin. L’Étui Velours est confectionné dans un atelier de Roubaix, à partir de chutes de velours côtelé certifié OEKO-TEX. Doublure satin de soie naturelle, fermeture aimantée invisible.`,
    specs: {
      Dimensions: '22 cm × 8 cm × 5 cm',
      Extérieur: 'Velours côtelé écru OEKO-TEX',
      Intérieur: 'Satin de soie naturelle',
      Fermeture: 'Aimantée invisible',
      Made: 'Atelier Roubaix, France',
    },
    features: ['Velours OEKO-TEX', 'Doublure soie', 'Fermeture aimantée', 'Made in Roubaix'],
    priceCents: 3900,
    compareAtPriceCents: null,
    costCents: 850,
    currency: 'EUR',
    taxRate: '20.00',
    images: placeholderImages('jour'),
    videoMuxPlaybackId: null,
    videoPosterUrl: null,
    categoryId: MOCK_CATEGORIES[2]!.id,
    collection: 'inaugurale',
    tags: ['etui', 'voyage', 'velours', 'made-in-france'],
    supplierId: null,
    supplierSku: 'CJ-AF-008-ETUI',
    supplierProductId: null,
    supplierWarehouse: 'CJPL',
    supplierShippingDays: 4,
    stockQuantity: 23,
    stockStatus: 'in_stock',
    lowStockThreshold: 5,
    seoTitle: 'Étui Velours — Rangement voyage français | Atelier Frisson',
    seoDescription:
      'Étui de voyage en velours côtelé OEKO-TEX, doublé soie. Confectionné à Roubaix.',
    seoKeywords: ['etui velours intime', 'rangement voyage', 'made in roubaix'],
    schemaOrgData: null,
    status: 'active',
    isFeatured: false,
    publishedAt: baseDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  },
] as const;

/** Helpers de lookup — interface miroir des queries Drizzle. */

export function getMockProducts(): readonly Product[] {
  return MOCK_PRODUCTS;
}

export function getMockProductBySlug(slug: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getMockFeaturedProducts(limit = 6): readonly Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
}

export function getMockProductsByCollection(
  collection: NonNullable<Product['collection']>,
): readonly Product[] {
  return MOCK_PRODUCTS.filter((p) => p.collection === collection);
}

export function getMockProductsByCategorySlug(slug: string): readonly Product[] {
  const cat = MOCK_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return [];
  return MOCK_PRODUCTS.filter((p) => p.categoryId === cat.id);
}

export function getMockCategories(): readonly Category[] {
  return MOCK_CATEGORIES;
}

export function getMockCategoryBySlug(slug: string): Category | null {
  return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
