import type { SubscriptionPlan } from '@/lib/db/schema';

/**
 * Mock plans box mensuelle — utilisés tant que la table `subscription_plans`
 * n'est pas seedée. Source de vérité tarifaire pour la landing `/box-mensuelle`
 * et le module admin `/admin/abonnements` jusqu'au seed Sprint P2.
 *
 * Convention prix : entiers en cents, EUR. `min_commitment_months` = 0 → sans
 * engagement (case prioritaire UX, exigence Odelie).
 */
export const MOCK_SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  {
    id: '04000000-0000-0000-0000-000000000001',
    slug: 'box-decouverte',
    name: 'Box Découverte',
    tagline: 'Trois objets pour entamer le rituel',
    description:
      'Chaque mois, trois pièces pensées pour démarrer en douceur — un objet doux, une huile, une carte rituel. Idéal pour explorer à deux sans engagement.',
    priceCents: 3900,
    itemsPerBox: 3,
    minCommitmentMonths: 0,
    annualDiscountPercent: 10,
    heroImageUrl: null,
    isActive: true,
    displayOrder: 1,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '04000000-0000-0000-0000-000000000002',
    slug: 'box-premium',
    name: 'Box Premium',
    tagline: 'Quatre pièces, cosmétique intime incluse',
    description:
      'La box signature : un objet, une lingerie capsule, une cosmétique intime, un accessoire. Renouvellement mensuel, livraison discrète.',
    priceCents: 4900,
    itemsPerBox: 4,
    minCommitmentMonths: 0,
    annualDiscountPercent: 12,
    heroImageUrl: null,
    isActive: true,
    displayOrder: 2,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
  {
    id: '04000000-0000-0000-0000-000000000003',
    slug: 'box-trio',
    name: 'Box Trio',
    tagline: 'L’expérience à deux, en cinq pièces',
    description:
      'Cinq pièces pour le rituel à deux : deux objets complémentaires, une cosmétique, une lingerie capsule, une carte conversation.',
    priceCents: 5900,
    itemsPerBox: 5,
    minCommitmentMonths: 0,
    annualDiscountPercent: 15,
    heroImageUrl: null,
    isActive: true,
    displayOrder: 3,
    createdAt: new Date('2026-04-26T00:00:00Z'),
  },
] as const;

export function getMockSubscriptionPlans(): readonly SubscriptionPlan[] {
  return MOCK_SUBSCRIPTION_PLANS;
}

export function findMockSubscriptionPlanBySlug(slug: string): SubscriptionPlan | undefined {
  return MOCK_SUBSCRIPTION_PLANS.find((p) => p.slug === slug);
}
