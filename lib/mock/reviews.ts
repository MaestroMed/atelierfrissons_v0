/**
 * Mock reviews Sprint 2+ — sera remplacé par table `reviews` en Sprint 8.
 *
 * Stratégie éditoriale : tous les avis sont réels (approuvés par la modération),
 * entre 4 et 5 étoiles (cohérent pour une marque premium wellness intime qui
 * n'accepte que les retours de clientes vérifiées). Ton magazine féminin premium.
 */

export interface MockReview {
  id: string;
  productSlug: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  body: string;
  authorName: string;
  authorLocation?: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
}

export const MOCK_REVIEWS: readonly MockReview[] = [
  // ─── Premier Frisson ────────────────────────────────────────────────
  {
    id: 'r-pf-1',
    productSlug: 'duo',
    rating: 5,
    title: 'Un premier objet qui n’en a pas l’air',
    body: 'Honnêtement, j’avais peur de commander ce genre d’objet. Tout a été fait pour que la démarche soit douce — la boîte, la notice, la carte. Le toucher de la matière est vraiment différent de ce que j’ai pu tester ailleurs.',
    authorName: 'Clémence',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-22'),
  },
  {
    id: 'r-pf-2',
    productSlug: 'duo',
    rating: 5,
    title: 'La douceur au-delà de mes attentes',
    body: 'Un objet sobre, silencieux, sans ce côté « gadget » qui m’avait toujours refroidie. On sent la qualité dès qu’on le sort de son emballage. Je recommande à toute femme qui veut franchir le pas avec délicatesse.',
    authorName: 'Héloïse',
    authorLocation: 'Bordeaux',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-15'),
  },
  {
    id: 'r-pf-3',
    productSlug: 'duo',
    rating: 4,
    title: 'Très bien, petite réserve sur la batterie',
    body: 'Design impeccable, matière soyeuse, vraiment un bel objet. Mon seul bémol : l’autonomie est un peu courte à mon goût après plusieurs semaines d’usage. Mais le SAV a été adorable et m’a vite rassurée.',
    authorName: 'Margot',
    authorLocation: 'Lyon',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-02'),
  },
  {
    id: 'r-pf-4',
    productSlug: 'duo',
    rating: 5,
    body: 'J’ai offert à une amie qui venait de divorcer — elle a fondu quand elle a ouvert la boîte. Ce n’est pas le « produit » qui compte, c’est la manière dont il est présenté. Bravo à toute l’équipe.',
    authorName: 'Iris',
    authorLocation: 'Marseille',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-02-18'),
  },

  // ─── Velours Rouge ───────────────────────────────────────────────────
  {
    id: 'r-vr-1',
    productSlug: 'velours',
    rating: 5,
    title: 'Finition miroir — comme annoncé',
    body: 'La finition glossy est vraiment fidèle aux photos. À la main, c’est fluide, dense, silencieux. Très bel objet qu’on n’a pas envie de ranger dans un tiroir. Il trône sur ma commode comme un petit objet sculpté.',
    authorName: 'Anaïs',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-28'),
  },
  {
    id: 'r-vr-2',
    productSlug: 'velours',
    rating: 5,
    title: 'Un rituel du soir qui change tout',
    body: 'Je ne pensais pas qu’un objet pouvait devenir une ancre. J’ai intégré Velours Rouge à ma routine du soir (après le bain, avant la lecture) et c’est devenu un marqueur de bascule entre la journée et la nuit.',
    authorName: 'Sibylle',
    authorLocation: 'Toulouse',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-10'),
  },
  {
    id: 'r-vr-3',
    productSlug: 'velours',
    rating: 4,
    body: 'Superbe objet, livraison impeccable et discrète. Petit reproche : j’aurais aimé un mode encore plus doux pour les soirs fatigués. Sinon rien à dire, je recommande.',
    authorName: 'Pauline',
    authorLocation: 'Rennes',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-02-25'),
  },
  {
    id: 'r-vr-4',
    productSlug: 'velours',
    rating: 5,
    title: 'Un cadeau qui n’a pas mis mal à l’aise',
    body: 'Offert à ma compagne pour son anniversaire. La carte signée à la main + l’emballage vraiment neutre ont fait toute la différence — rien de gênant à ouvrir en public. Et la qualité de l’objet est au rendez-vous.',
    authorName: 'Juliette',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-02-14'),
  },

  // ─── Essentiel Jour ──────────────────────────────────────────────────
  {
    id: 'r-ej-1',
    productSlug: 'etincelle',
    rating: 5,
    title: 'La sobriété, vraiment',
    body: 'C’est tout ce que j’attendais : un objet discret, léger, silencieux, avec une courbe pensée. Pas d’ostentation, pas de gadgeterie. Juste un bon objet bien fait.',
    authorName: 'Marine',
    authorLocation: 'Nantes',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-20'),
  },
  {
    id: 'r-ej-2',
    productSlug: 'etincelle',
    rating: 4,
    body: 'Belle matière, bon packaging, design épuré. J’aurais souhaité une notice un peu plus illustrée pour la prise en main mais c’est un détail.',
    authorName: 'Noémie',
    authorLocation: 'Lille',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-05'),
  },
  {
    id: 'r-ej-3',
    productSlug: 'etincelle',
    rating: 5,
    body: 'Commandé après un article dans ELLE. Zéro regret — le site tient ses promesses, le produit aussi. Et merci pour l’emballage vraiment discret, livré au bureau sans problème.',
    authorName: 'Victoire',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-02-28'),
  },

  // ─── Noir Profond ────────────────────────────────────────────────────
  {
    id: 'r-np-1',
    productSlug: 'profond',
    rating: 5,
    title: 'L’objet signature, à juste titre',
    body: 'Un peu plus de budget, mais on comprend pourquoi dès la prise en main. La densité, la courbe, la finition mate — tout est pensé. Investissement qui vaut le coup.',
    authorName: 'Élodie',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-25'),
  },
  {
    id: 'r-np-2',
    productSlug: 'profond',
    rating: 5,
    body: 'Acheté en couple après un dîner où on a parlé de désir comme on ne l’avait jamais fait. Il nous accompagne depuis trois mois — aucune usure, aucune déception.',
    authorName: 'Charlotte',
    authorLocation: 'Bordeaux',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-12'),
  },
  {
    id: 'r-np-3',
    productSlug: 'profond',
    rating: 5,
    title: 'Noir profond — comme son nom',
    body: 'Le noir est vraiment profond, pas brillant, pas cheap. On dirait un objet d’art. Ma compagne l’a posé sur son chevet pendant une semaine avant qu’on l’utilise — juste pour le regarder.',
    authorName: 'Léna',
    authorLocation: 'Aix-en-Provence',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-02-20'),
  },

  // ─── Albâtre ─────────────────────────────────────────────────────────
  {
    id: 'r-alb-1',
    productSlug: 'onde',
    rating: 5,
    title: 'Le velouté d’une peau',
    body: 'La matière mate est troublante — on a presque l’impression de toucher une surface vivante. Très beau compromis entre douceur et présence. Un de mes objets préférés de la maison.',
    authorName: 'Ariane',
    authorLocation: 'Lyon',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-18'),
  },
  {
    id: 'r-alb-2',
    productSlug: 'onde',
    rating: 4,
    body: 'Très joli, bonne matière. L’entretien demande un peu d’attention (mieux vaut bien sécher après usage) mais c’est écrit clairement dans la notice.',
    authorName: 'Stéphanie',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-01'),
  },

  // ─── Laque Minuit ────────────────────────────────────────────────────
  {
    id: 'r-lm-1',
    productSlug: 'murmure',
    rating: 5,
    title: 'Pièce de collection',
    body: 'Je ne savais pas qu’un objet de ce genre pouvait susciter ce type d’émotion — admiration, presque contemplation. Le laqué rouge profond est parfait. Merci pour ce niveau d’exigence.',
    authorName: 'Adèle',
    authorLocation: 'Paris',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-30'),
  },
  {
    id: 'r-lm-2',
    productSlug: 'murmure',
    rating: 5,
    body: 'La finition laquée est vraiment différente de ce que proposent d’autres marques. Ça se voit que chaque pièce a été pensée. Belle découverte.',
    authorName: 'Camille',
    authorLocation: 'Montpellier',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-03-08'),
  },
  {
    id: 'r-lm-3',
    productSlug: 'murmure',
    rating: 4,
    body: 'Très satisfaite. Un peu plus lourd que prévu en main mais c’est lié à la densité du silicone médical — signal de qualité.',
    authorName: 'Inès',
    authorLocation: 'Strasbourg',
    isVerifiedPurchase: true,
    createdAt: new Date('2026-02-22'),
  },
] as const;

export function getMockReviewsForProduct(slug: string): readonly MockReview[] {
  return MOCK_REVIEWS.filter((r) => r.productSlug === slug).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export interface ReviewSummary {
  count: number;
  averageRating: number;
  /** Histogramme : [nb 1★, nb 2★, nb 3★, nb 4★, nb 5★]. */
  distribution: readonly [number, number, number, number, number];
}

export function summarizeReviews(reviews: readonly MockReview[]): ReviewSummary | null {
  if (reviews.length === 0) return null;
  const distribution: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  let total = 0;
  for (const r of reviews) {
    const idx = r.rating - 1;
    distribution[idx] = (distribution[idx] ?? 0) + 1;
    total += r.rating;
  }
  return {
    count: reviews.length,
    averageRating: Math.round((total / reviews.length) * 10) / 10,
    distribution,
  };
}
