import { NextResponse } from 'next/server';
import { generateInvoiceHtml, generateMockInvoice } from '@/lib/invoices/generate-invoice-html';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/admin/invoices/[orderNumber]
 *
 * Renvoie le HTML imprimable d'une facture pour un orderNumber donné.
 * L'utilisateur peut « Imprimer → Enregistrer en PDF » depuis le navigateur.
 *
 * V1 : utilise generateMockInvoice. Sprint 4 : query Drizzle réelle
 * (orders + orderItems + customers + addresses) → buildInvoiceFromOrder.
 *
 * Auth : vérifie session admin. Pour V1, on accepte toute session
 * (le dev bypass donne accès). En prod il faut un check role admin.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
): Promise<Response> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { orderNumber } = await params;
  if (!/^[A-Z0-9-]{4,40}$/i.test(orderNumber)) {
    return NextResponse.json({ error: 'Numéro de commande invalide' }, { status: 400 });
  }

  // V1 : mock data — Sprint 4 remplacer par fetch DB
  const invoiceData = generateMockInvoice(orderNumber);
  const html = generateInvoiceHtml(invoiceData);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, must-revalidate',
      // X-Frame-Options spécifique : permet d'embed dans une iframe admin
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
