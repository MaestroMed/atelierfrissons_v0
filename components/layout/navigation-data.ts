/**
 * Données de navigation partagées entre Header, MobileNav et Footer.
 * Centralise la source de vérité pour éviter les dérives entre vues.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Description courte pour MobileNav + aria-label du Footer. */
  hint?: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Boutique', href: '/boutique', hint: 'Tous nos objets de rituel' },
  { label: 'Collections', href: '/collections', hint: 'Jour, Nuit et capsules signatures' },
  { label: 'À propos', href: '/a-propos', hint: 'La maison, la fondatrice, nos engagements' },
  { label: 'Rituels', href: '/rituels', hint: 'Le magazine éditorial Atelier Frisson' },
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
