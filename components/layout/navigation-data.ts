/**
 * Données de navigation partagées entre Header, MegaMenu, MobileNav et Footer.
 * Source de vérité unique pour éviter les dérives entre vues.
 *
 * Pivot V2 « Couples 30-50 » (mai 2026) :
 *   - Boutique segmentée par audience : Pour Vous Deux / Pour Elle / Pour Lui / Cadeaux
 *   - Coffrets et Box Mensuelle remontés au top-level
 *   - Le Journal : renommé « Inspirations » (vocable Pinterest-friendly)
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
  /**
   * Audience pivot ou capsule legacy. Pilote la palette du mini-aperçu :
   *   - 'couples' / 'elle' / 'cadeaux' → fond ivoire
   *   - 'lui' / 'nuit'                 → fond noir velours
   *   - 'jour' / 'inaugurale' / 'signature' → fond ivoire (legacy)
   */
  collection: 'couples' | 'elle' | 'lui' | 'cadeaux' | 'jour' | 'nuit' | 'inaugurale' | 'signature';
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
    hint: 'Pour vous deux, pour elle, pour lui',
    megaMenu: {
      groups: [
        {
          title: 'Pour qui',
          items: [
            {
              label: 'Pour Vous Deux',
              href: '/collections/couples',
              description: 'Le rituel partagé, à deux',
            },
            {
              label: 'Pour Elle',
              href: '/collections/elle',
              description: 'Objets, lingerie soie, cosmétique',
            },
            {
              label: 'Pour Lui',
              href: '/collections/lui',
              description: 'Massagers, bandeau soie, huile bois de oud',
            },
            {
              label: 'Cadeaux',
              href: '/collections/cadeaux',
              description: 'Saint-Valentin, anniversaire, mariage',
            },
          ],
        },
        {
          title: 'Par catégorie',
          items: [
            { label: 'Objets', href: '/boutique?category=objets' },
            { label: 'Lingerie', href: '/boutique?category=lingerie' },
            { label: 'Cosmétique intime', href: '/boutique?category=cosmetique' },
            { label: 'Accessoires', href: '/boutique?category=accessoires' },
            { label: 'Toute la boutique', href: '/boutique' },
          ],
        },
      ],
      products: [
        {
          slug: 'velours',
          name: 'Velours',
          tagline: 'La pièce signature, le rituel du soir.',
          priceCents: 16900,
          collection: 'elle',
        },
        {
          slug: 'duo',
          name: 'Duo',
          tagline: 'Le geste partagé, sans intrusion visuelle.',
          priceCents: 11900,
          collection: 'couples',
        },
      ],
      editorial: {
        caption: 'Emballage signature',
        headline: 'Livré dans une boîte neutre, signée à la main',
        body: 'Aucun logo extérieur. Carte cotton letterpress, ruban oxblood, sceau cire à la main, monogramme AF en or champagne — <em>pour respecter la confidentialité du rituel</em>.',
        ctaLabel: 'Voir la livraison',
        ctaHref: '/livraison',
        tone: 'or',
      },
    },
  },
  {
    label: 'Coffrets',
    href: '/bundles',
    hint: 'Soirée à deux, week-end, anniversaire de mariage',
    megaMenu: {
      groups: [
        {
          title: 'Coffrets signature',
          items: [
            {
              label: 'Soirée à Deux',
              href: '/bundle/soiree-a-deux',
              description: 'Quatre pièces — 139 €',
            },
            {
              label: 'Évasion Week-end',
              href: '/bundle/evasion-week-end',
              description: 'Voyage complice — 199 €',
            },
            {
              label: 'Lune de Miel',
              href: '/bundle/lune-de-miel',
              description: 'Cinq pièces signature — 299 €',
            },
            {
              label: 'Tous les coffrets',
              href: '/bundles',
              description: 'Six coffrets pré-fabriqués',
            },
          ],
        },
        {
          title: 'À offrir',
          items: [
            { label: 'Coffret Rituel', href: '/produit/coffret-rituel', description: 'Bougie + huile + plume + carte' },
            { label: 'Cartes cadeaux', href: '/cartes-cadeaux' },
            { label: 'Box mensuelle à offrir', href: '/box-mensuelle#cadeau' },
            { label: 'Personnaliser', href: '/contact?sujet=coffret' },
          ],
        },
      ],
      products: [
        {
          slug: 'coffret-rituel',
          name: 'Coffret Rituel',
          tagline: 'Le rituel offert, prêt à célébrer.',
          priceCents: 11900,
          collection: 'cadeaux',
        },
        {
          slug: 'lune-de-miel',
          name: 'Lune de Miel',
          tagline: 'Cinq pièces signature — coffret écrin.',
          priceCents: 29900,
          collection: 'couples',
        },
      ],
      editorial: {
        caption: 'Le geste',
        headline: 'Carte personnalisable, ruban oxblood, sceau cire',
        body: 'Chaque coffret est emballé à la main dans notre atelier de Roubaix. <em>Aucune mention extérieure du contenu.</em>',
        ctaLabel: 'Voir les coffrets',
        ctaHref: '/bundles',
        tone: 'or',
      },
    },
  },
  {
    label: 'Box Mensuelle',
    href: '/box-mensuelle',
    hint: 'Trois plans, sans engagement, livraison discrète',
  },
  {
    label: 'Inspirations',
    href: '/rituels',
    hint: 'Idées cadeaux, conseils rituels, inspirations',
    megaMenu: {
      groups: [
        {
          title: 'Le Journal',
          items: [
            { label: 'Tous les articles', href: '/rituels', description: 'Le magazine éditorial' },
            {
              label: 'Idées cadeaux',
              href: '/rituels/categorie/cadeaux',
              description: 'Saint-Valentin, anniversaire, mariage',
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
            { label: 'Choisir un objet pour deux', href: '/guides/choisir-objet-couple' },
            { label: 'Silicone médical', href: '/guides/silicone-medical' },
            { label: 'Comparer les objets', href: '/comparer' },
          ],
        },
      ],
      editorial: {
        caption: 'À lire maintenant',
        headline: 'Pourquoi on sous-estime le pouvoir d\'un rituel lent',
        body: 'Dans une époque qui célèbre la vitesse, <em>ralentir devient un acte radical de soin</em>. 7 minutes de lecture.',
        ctaLabel: 'Lire l\'article',
        ctaHref: '/rituels/pouvoir-rituel-lent',
        tone: 'jour',
      },
    },
  },
  {
    label: 'À propos',
    href: '/a-propos',
    hint: 'L\'atelier, la fondatrice, nos engagements',
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
    title: 'Boutique',
    items: [
      { label: 'Pour Vous Deux', href: '/collections/couples' },
      { label: 'Pour Elle', href: '/collections/elle' },
      { label: 'Pour Lui', href: '/collections/lui' },
      { label: 'Cadeaux', href: '/collections/cadeaux' },
      { label: 'Coffrets', href: '/bundles' },
      { label: 'Box mensuelle', href: '/box-mensuelle' },
    ],
  },
  {
    title: 'La Maison',
    items: [
      { label: 'À propos', href: '/a-propos' },
      { label: 'La fondatrice', href: '/a-propos#fondatrice' },
      { label: 'Nos engagements', href: '/a-propos#engagements' },
      { label: 'Avant-première · liste', href: '/lancement' },
      { label: 'Programme ambassadrice', href: '/ambassadrices' },
      { label: 'Inspirations', href: '/rituels' },
    ],
  },
  {
    title: 'Service discret',
    items: [
      { label: 'Livraison', href: '/livraison' },
      { label: 'Emballage neutre', href: '/livraison#emballage' },
      { label: 'Retours', href: '/retours' },
      { label: 'Programme parrainage', href: '/compte/parrainage' },
      { label: 'Cartes cadeaux', href: '/cartes-cadeaux' },
      { label: 'Programme fidélité', href: '/compte/fidelite' },
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
      { label: 'DPO · RGPD', href: '/dpo' },
      { label: 'Accessibilité', href: '/accessibilite' },
    ],
  },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/atelierfrisson', icon: 'instagram' as const },
  { label: 'Pinterest', href: 'https://pinterest.com/atelierfrisson', icon: 'pinterest' as const },
] as const;
