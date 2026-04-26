/**
 * Génération facture HTML imprimable (PDF via navigateur).
 *
 * Pas de dépendance lourde (jsPDF, puppeteer, react-pdf) — on génère
 * un HTML stylé spécifiquement pour le @media print, et l'utilisateur
 * peut faire « Imprimer → Enregistrer en PDF ».
 *
 * Format : conformité française L441-9 + L441-10 Code de commerce :
 *  - SIRET, RCS, TVA intra
 *  - Mention « Facture » + numéro chronologique
 *  - Date de la facture + date de livraison
 *  - Identification vendeur + acheteur
 *  - Détail des lignes (désignation, quantité, PU HT, total HT)
 *  - Taux et montant TVA
 *  - Total HT, total TVA, total TTC
 *  - Mention paiement (date d'échéance + pénalités de retard)
 *
 * Pour brancher en Sprint 8 sur de vraies données : passer un orderId,
 * fetch via Drizzle (orders + orderItems + customers), et hydrater.
 */

export interface InvoiceLineItem {
  designation: string;
  sku: string;
  quantity: number;
  unitPriceHtCents: number;
  totalHtCents: number;
  vatRate: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  deliveryDate?: Date | null;
  orderNumber: string;
  /** Le vendeur — Atelier Frisson SASU. */
  seller: {
    name: string;
    address: string[];
    siret: string;
    rcs: string;
    vatNumber: string;
    email: string;
  };
  /** L'acheteur (client). */
  buyer: {
    name: string;
    address: string[];
    email: string;
  };
  items: readonly InvoiceLineItem[];
  /** Frais de port HT. */
  shippingHtCents: number;
  /** Code promo appliqué + remise HT. */
  discount?: { code: string; amountHtCents: number } | null;
}

const DEFAULT_SELLER: InvoiceData['seller'] = {
  name: 'Atelier Frisson — SASU',
  address: ['12, rue [à compléter]', '75012 Paris', 'France'],
  siret: '[SIRET à compléter après K-Bis]',
  rcs: 'Paris [à compléter]',
  vatNumber: 'FR[à compléter]',
  email: 'contact@atelierfrisson.fr',
};

/** Calcule un total TVA à partir du HT et du taux. */
function vatAmount(htCents: number, rate: number): number {
  return Math.round(htCents * rate);
}

/**
 * Génère le HTML imprimable d'une facture.
 * Le document est self-contained (style inline) pour pouvoir être servi
 * tel quel par un Route Handler et imprimé via le navigateur.
 */
export function generateInvoiceHtml(data: InvoiceData): string {
  const subtotalHtCents = data.items.reduce((acc, l) => acc + l.totalHtCents, 0);
  const discountHtCents = data.discount?.amountHtCents ?? 0;
  const subtotalAfterDiscountHt = subtotalHtCents - discountHtCents;
  const totalShippingHt = data.shippingHtCents;
  const totalHtCents = subtotalAfterDiscountHt + totalShippingHt;
  // TVA — agrégée par taux pour l'affichage (en V1 on a 20% partout)
  const totalVatCents = data.items.reduce(
    (acc, l) => acc + vatAmount(l.totalHtCents, l.vatRate),
    0,
  );
  // Approximation : TVA sur shipping/promo en proportion du subtotal
  const vatOnShipping = vatAmount(totalShippingHt, 0.2);
  const vatOnDiscount = vatAmount(discountHtCents, 0.2);
  const totalVatFinal = totalVatCents + vatOnShipping - vatOnDiscount;
  const totalTtcCents = totalHtCents + totalVatFinal;

  const fmtPrice = (cents: number) =>
    (cents / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  const fmtDate = (d: Date) =>
    d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Facture ${escapeHtml(data.invoiceNumber)} — Atelier Frisson</title>
<style>
  @media print {
    @page { margin: 1.5cm; size: A4; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1C1A17;
    background: #F8F2E9;
    padding: 2.5rem;
    max-width: 210mm;
    margin: 0 auto;
    line-height: 1.5;
  }
  .invoice {
    background: #FFFFFF;
    padding: 3rem;
    border: 1px solid rgba(28,26,23,0.1);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #C9A36B;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }
  .wordmark {
    font-family: 'Bodoni Moda', 'Didot', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #C9A36B;
    margin: 0;
  }
  .tagline {
    font-style: italic;
    font-size: 0.75rem;
    color: rgba(28,26,23,0.6);
    margin-top: 0.25rem;
  }
  .invoice-meta {
    text-align: right;
  }
  .invoice-title {
    font-family: 'Bodoni Moda', serif;
    font-size: 1.75rem;
    font-weight: 500;
    margin: 0;
  }
  .invoice-number {
    font-family: 'Inter', monospace;
    font-size: 0.875rem;
    color: rgba(28,26,23,0.7);
    margin-top: 0.25rem;
  }
  .parties {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .party {
    border-left: 2px solid #C9A36B;
    padding-left: 1rem;
  }
  .party-label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.6875rem;
    color: #A88449;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .party-name {
    font-family: 'Bodoni Moda', serif;
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0 0 0.25rem;
  }
  .party-detail {
    font-size: 0.8125rem;
    color: rgba(28,26,23,0.75);
    margin: 0.125rem 0;
  }
  .dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(201,163,107,0.08);
  }
  .date-block {
    font-size: 0.8125rem;
  }
  .date-label {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.625rem;
    color: #A88449;
    margin: 0 0 0.25rem;
  }
  .date-value {
    font-family: 'Bodoni Moda', serif;
    font-weight: 500;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  thead th {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.625rem;
    font-weight: 600;
    color: #A88449;
    border-bottom: 1px solid #C9A36B;
    padding: 0.75rem 0.5rem;
  }
  thead th.right { text-align: right; }
  tbody td {
    padding: 0.875rem 0.5rem;
    border-bottom: 1px solid rgba(28,26,23,0.08);
    font-size: 0.875rem;
    vertical-align: top;
  }
  tbody td.right { text-align: right; font-variant-numeric: tabular-nums; }
  .designation {
    font-family: 'Bodoni Moda', serif;
    font-weight: 500;
  }
  .sku {
    font-family: monospace;
    font-size: 0.75rem;
    color: rgba(28,26,23,0.5);
    margin-top: 0.125rem;
    display: block;
  }
  .totals {
    margin-left: auto;
    width: 320px;
    margin-top: 1.5rem;
    font-size: 0.875rem;
  }
  .totals-row {
    display: flex;
    justify-content: space-between;
    padding: 0.375rem 0;
  }
  .totals-row.discount {
    color: #A88449;
  }
  .totals-row.subtotal {
    border-top: 1px solid rgba(28,26,23,0.1);
    margin-top: 0.5rem;
    padding-top: 0.75rem;
  }
  .totals-row.total-ttc {
    border-top: 2px solid #C9A36B;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    font-family: 'Bodoni Moda', serif;
    font-size: 1.125rem;
    font-weight: 500;
  }
  .legal {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(28,26,23,0.08);
    font-size: 0.75rem;
    color: rgba(28,26,23,0.6);
    line-height: 1.6;
  }
  .legal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .footer {
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
    color: rgba(28,26,23,0.5);
    font-size: 0.75rem;
  }
  .print-cta {
    text-align: center;
    margin: 1.5rem 0;
  }
  .print-button {
    background: #0A0706;
    color: #F2EADF;
    border: none;
    padding: 0.875rem 2rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
  }
  .print-button:hover { background: #C9A36B; color: #0A0706; }
</style>
</head>
<body>

<div class="print-cta no-print">
  <button class="print-button" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
</div>

<div class="invoice">
  <div class="header">
    <div>
      <p class="wordmark">ATELIER FRISSON</p>
      <p class="tagline">Maison du rituel intime — Paris</p>
    </div>
    <div class="invoice-meta">
      <h1 class="invoice-title">Facture</h1>
      <p class="invoice-number">${escapeHtml(data.invoiceNumber)}</p>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <p class="party-label">Émetteur</p>
      <p class="party-name">${escapeHtml(data.seller.name)}</p>
      ${data.seller.address.map((line) => `<p class="party-detail">${escapeHtml(line)}</p>`).join('')}
      <p class="party-detail">SIRET&nbsp;: ${escapeHtml(data.seller.siret)}</p>
      <p class="party-detail">RCS&nbsp;: ${escapeHtml(data.seller.rcs)}</p>
      <p class="party-detail">TVA intra&nbsp;: ${escapeHtml(data.seller.vatNumber)}</p>
      <p class="party-detail">${escapeHtml(data.seller.email)}</p>
    </div>
    <div class="party">
      <p class="party-label">Destinataire</p>
      <p class="party-name">${escapeHtml(data.buyer.name)}</p>
      ${data.buyer.address.map((line) => `<p class="party-detail">${escapeHtml(line)}</p>`).join('')}
      <p class="party-detail">${escapeHtml(data.buyer.email)}</p>
    </div>
  </div>

  <div class="dates">
    <div class="date-block">
      <p class="date-label">Date de facture</p>
      <p class="date-value">${fmtDate(data.invoiceDate)}</p>
    </div>
    <div class="date-block">
      <p class="date-label">Commande&nbsp;n°</p>
      <p class="date-value">${escapeHtml(data.orderNumber)}</p>
    </div>
    ${
      data.deliveryDate
        ? `
    <div class="date-block">
      <p class="date-label">Date de livraison</p>
      <p class="date-value">${fmtDate(data.deliveryDate)}</p>
    </div>`
        : ''
    }
  </div>

  <table>
    <thead>
      <tr>
        <th>Désignation</th>
        <th class="right">Qté</th>
        <th class="right">PU HT</th>
        <th class="right">TVA</th>
        <th class="right">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${data.items
        .map(
          (item) => `
      <tr>
        <td>
          <span class="designation">${escapeHtml(item.designation)}</span>
          <span class="sku">SKU ${escapeHtml(item.sku)}</span>
        </td>
        <td class="right">${item.quantity}</td>
        <td class="right">${fmtPrice(item.unitPriceHtCents)}</td>
        <td class="right">${(item.vatRate * 100).toFixed(0)}&nbsp;%</td>
        <td class="right">${fmtPrice(item.totalHtCents)}</td>
      </tr>`,
        )
        .join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Sous-total HT</span>
      <span>${fmtPrice(subtotalHtCents)}</span>
    </div>
    ${
      data.discount
        ? `
    <div class="totals-row discount">
      <span>Remise (${escapeHtml(data.discount.code)})</span>
      <span>− ${fmtPrice(data.discount.amountHtCents)}</span>
    </div>`
        : ''
    }
    <div class="totals-row">
      <span>Frais de port HT</span>
      <span>${fmtPrice(totalShippingHt)}</span>
    </div>
    <div class="totals-row subtotal">
      <span>Total HT</span>
      <span>${fmtPrice(totalHtCents)}</span>
    </div>
    <div class="totals-row">
      <span>TVA (20&nbsp;%)</span>
      <span>${fmtPrice(totalVatFinal)}</span>
    </div>
    <div class="totals-row total-ttc">
      <span>Total TTC</span>
      <span>${fmtPrice(totalTtcCents)}</span>
    </div>
  </div>

  <div class="legal">
    <div class="legal-grid">
      <div>
        <p><strong>Conditions de paiement.</strong> Facture acquittée à réception. Aucun escompte
        pour règlement anticipé.</p>
      </div>
      <div>
        <p><strong>Pénalités de retard.</strong> Trois fois le taux d'intérêt légal en cas de
        retard de paiement. Indemnité forfaitaire pour frais de recouvrement&nbsp;: 40&nbsp;€
        (art. L441-10 II Code de commerce).</p>
      </div>
    </div>
    <p>TVA acquittée sur les débits. Conformément à l'article 293 B du Code général des impôts,
    Atelier Frisson SASU est assujettie à la TVA française.</p>
  </div>

  <p class="footer">Atelier Frisson — Maison du rituel intime — Paris</p>
</div>

</body>
</html>`;
}

/** Génère une facture mockée pour les routes admin de démo. */
export function generateMockInvoice(orderNumber: string): InvoiceData {
  return {
    invoiceNumber: `AF-FACT-${orderNumber.replace(/^AF-/, '')}`,
    invoiceDate: new Date(),
    orderNumber,
    seller: DEFAULT_SELLER,
    buyer: {
      name: 'Cliente exemple',
      address: ['12 rue de Rivoli', '75004 Paris', 'France'],
      email: 'cliente@exemple.fr',
    },
    items: [
      {
        designation: 'Premier Frisson — Collection JOUR',
        sku: 'AF-PREMIER-FRISSON',
        quantity: 1,
        unitPriceHtCents: 7417, // 89€ TTC / 1.2
        totalHtCents: 7417,
        vatRate: 0.2,
      },
    ],
    shippingHtCents: 575, // 6.90€ TTC / 1.2
    discount: null,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
