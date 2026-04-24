/**
 * Helpers de formatage — neutres (server + client).
 * Utilise `Intl.NumberFormat` côté serveur pour cohérence FR.
 */

const PRICE_FORMATTER = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const DATE_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatPriceCents(cents: number, currency = 'EUR'): string {
  if (currency !== 'EUR') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  }
  return PRICE_FORMATTER.format(cents / 100);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATE_FORMATTER.format(d);
}

export function formatStockBadge(
  stockStatus: string,
  stockQuantity: number,
): { label: string; tone: 'success' | 'warning' | 'error' | 'info' } {
  switch (stockStatus) {
    case 'in_stock':
      return { label: 'En stock', tone: 'success' };
    case 'low_stock':
      return { label: `Plus que ${stockQuantity} en stock`, tone: 'warning' };
    case 'preorder':
      return { label: 'Précommande', tone: 'info' };
    case 'out_of_stock':
    default:
      return { label: 'Rupture', tone: 'error' };
  }
}

/** Plurialise sans regex compliquée — usage : `pluralize(2, 'objet', 'objets')`. */
export function pluralize(count: number, singular: string, plural: string): string {
  return count <= 1 ? singular : plural;
}
