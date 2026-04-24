/**
 * Données de navigation partagées entre Header, MobileNav et Footer.
 * Centralise la source de vérité pour éviter les dérives entre vues.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Description courte pour MobileNav + aria-label du Footer. */
  hint?: string;
  /** Configuration MegaMenu optionnelle (desktop uniquement). */
  megaMenu?: MegaMenuConfig;
}

export interface MegaMenuLinkGroup {
  title: string;
  items: readonly { label: string; href: string; description?: string }[];
}

export interface MegaMenuProductPreview {
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  collection: 'jour' | 'nuit';
}

export interface MegaMenuEditorial {
  caption: string;
  headline: string;
  /** HTML court, peut contenir <em> ou <strong>. */
  body: string;
  ctaLabel: string;
  ctaHref: string;
  /** Tonalité visuelle du panneau éditorial (fond). */
  tone: 'jour' | 'nuit' | 'or';
}

export interface MegaMenuConfig {
  /** Groupes de liens (colonne gauche, 1-2 colonnes). */
  groups: readonly MegaMenuLinkGroup[];
  /** 2-3 produits mis en avant (colonne centre). Optionnel. */
  products?: readonly MegaMenuProductPreview[];
  /** Bloc éditorial (colonne droite). Optionnel. */
  editorial?: MegaMenuEditorial;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  {
    label: 'Boutique',
    href: '/boutique',
    hint: 'Tous nos objets de rituel',
    megaMenu: {
      groups: [
        {
          title: 'Parcourir',
          items: [
            {
              label: 'Toute la boutique',
              href: '/boutique',
              description: 'Huit objets en silicone médical',
            },
            {
              label: 'Collection JOUR',
              href: '/collections/jour',
              description: 'Matins lents, matières claires',
            },
            {
              label: 'Collection NUIT',
              href: '/collections/nuit',
              description: 'Rituels du soir, laque profonde',
            },
            {
              label: 'Sélection signature',
              href: '/boutique?sort=featured',
              description: 'Les pièces mises en lumière',
            },
          ],
        },
        {
          title: 'Pratique',
          items: [
            { label: 'Livraison discrète', href: '/livraison' },
            { label: 'Politique de retours', href: '/retours' },
            { label: 'Certification des matières', href: '/guides/silicone-medical' },
            { label: 'Comparer les objets', href: '/comparer' },
          ],
        },
      ],
      products: [
        {
          slug: 'premier-frisson',
          name: 'Premier Frisson',
          tagline: 'Un objet pensé pour les premiers gestes lents.',
          priceCents: 8900,
          collection: 'jour',
        },
        {
          slug: 'velours-rouge',
          name: 'Velours Rouge',
          tagline: 'Le rituel du soir, finition miroir.',
          priceCents: 12900,
          collection: 'nuit',
        },
      ],
      editorial: {
        caption: 'Emballage signature',
        headline: 'Livré dans une boîte neutre, signée à la main',
        body: 'Aucun logo visible à l’extérieur. Une carte ivoire, un ruban or, un monogramme AF gaufré — <em>notre manière de respecter la confidentialité du rituel</em>.',
        ctaLabel: 'Voir la livraison',
        ctaHref: '/livraison',
        tone: 'or',
      },
    },
  },
  {
    label: 'Collections',
    href: '/collections',
    hint: 'Jour, Nuit et capsules signatures',
    megaMenu: {
      groups: [
        {
          title: 'Les deux registres',
          items: [
            {
              label: 'JOUR — Ivoire & Albâtre',
              href: '/collections/jour',
              description: 'Lumière, douceur, matière claire',
            },
            {
              label: 'NUIT — Rouge laqué & Noir profond',
              href: '/collections/nuit',
              description: 'Présence, densité, rituel du soir',
            },
          ],
        },
        {
          title: 'Capsules signatures',
          items: [
            {
              label: 'Collection inaugurale',
              href: '/boutique?sort=newest',
              description: 'Les six premières pièces',
            },
            {
              label: 'Édition limitée — Laque Minuit',
              href: '/produit/laque-minuit',
              description: 'Pièce de collection, 100 exemplaires',
            },
          ],
        },
      ],
      editorial: {
        caption: 'Expérience éditoriale',
        headline: 'Le rituel inaugural',
        body: 'Six chapitres pour comprendre pourquoi un objet bien conçu change le rapport au temps. <em>Un scrollytelling de trois minutes.</em>',
        ctaLabel: 'Commencer l’expérience',
        ctaHref: '/rituel-inaugural',
        tone: 'nuit',
      },
    },
  },
  {
    label: 'À propos',
    href: '/a-propos',
    hint: 'La maison, la fondatrice, nos engagements',
  },
  {
    label: 'Rituels',
    href: '/rituels',
    hint: 'Le magazine éditorial Atelier Frisson',
    megaMenu: {
      groups: [
        {
          title: 'Le Journal',
          items: [
            { label: 'Tous les articles', href: '/rituels', description: 'Le magazine éditorial' },
            {
              label: 'Bien-être',
              href: '/rituels/categorie/bien-etre',
              description: 'Rituels lents, conseils sexologue',
            },
            {
              label: 'Couple',
              href: '/rituels/categorie/couple',
              description: 'Communication, désir, long terme',
            },
            {
              label: 'Décryptage',
              href: '/rituels/categorie/decryptage',
              description: 'Matières, normes, fabrication',
            },
          ],
        },
        {
          title: 'Guides piliers',
          items: [
            { label: 'Tous les guides', href: '/guides' },
            { label: 'Silicone médical', href: '/guides/silicone-medical' },
            { label: 'Le glossaire', href: '/glossaire' },
          ],
        },
      ],
      editorial: {
        caption: 'À lire maintenant',
        headline: 'Pourquoi on sous-estime le pouvoir d’un rituel lent',
        body: 'Dans une époque qui célèbre la vitesse, <em>ralentir devient un acte radical de soin</em>. 7 minutes de lecture.',
        ctaLabel: 'Lire l’article',
        ctaHref: '/rituels/pouvoir-rituel-lent',
        tone: 'jour',
      },
    },
  },
] as const;

export const SECONDARY_NAV: readonly NavItem[] = [
  { label: 'Recherche', href: '/recherche' },
  { label: 'Compte', href: '/compte' },
  { label: 'Panier', href: '/panier' },
] as const;

export interface FooterColumn {
  title: string;
  items: readonly { label: string; href: string }[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'La Maison',
    items: [
      { label: 'À propos', href: '/a-propos' },
      { label: 'La fondatrice', href: '/a-propos#fondatrice' },
      { label: 'Nos engagements', href: '/a-propos#engagements' },
      { label: 'Contact presse', href: '/a-propos#presse' },
      { label: 'Le Journal', href: '/rituels' },
    ],
  },
  {
    title: 'Les Rituels',
    items: [
      { label: 'Le magazine', href: '/rituels' },
      { label: 'Guides piliers', href: '/guides' },
      { label: 'Glossaire', href: '/glossaire' },
      { label: 'Rituel du soir', href: '/rituels/categorie/rituel-du-soir' },
      { label: 'Conseils sexologue', href: '/rituels/categorie/conseil-sexologue' },
    ],
  },
  {
    title: 'Service discret',
    items: [
      { label: 'Livraison', href: '/livraison' },
      { label: 'Emballage neutre', href: '/livraison#emballage' },
      { label: 'Retours', href: '/retours' },
      { label: 'Traçabilité', href: '/retours#tracabilite' },
      { label: 'Questions fréquentes', href: '/faq' },
    ],
  },
  {
    title: 'Légal',
    items: [
      { label: 'CGV', href: '/cgv' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Accessibilité', href: '/accessibilite' },
    ],
  },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/atelierfrisson', icon: 'instagram' as const },
  { label: 'Pinterest', href: 'https://pinterest.com/atelierfrisson', icon: 'pinterest' as const },
] as const;
