import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface OrderItemPayload {
  name: string;
  quantity: number;
  unitPriceCents: number;
}

export interface OrderConfirmationEmailProps {
  customerFirstName: string;
  orderNumber: string;
  items: readonly OrderItemPayload[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    postalCode: string;
    city: string;
    country: string;
  };
  trackOrderUrl: string;
}

const fmt = (cents: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);

/**
 * Email de confirmation de commande — design éditorial, sobriété maximale.
 * Compatible clients e-mail (Gmail, Apple Mail, Outlook) — table-based layout
 * implicite via @react-email/components.
 */
export function OrderConfirmationEmail({
  customerFirstName,
  orderNumber,
  items,
  subtotalCents,
  shippingCents,
  totalCents,
  shippingAddress,
  trackOrderUrl,
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Commande confirmée — Atelier Frisson</title>
      </Head>
      <Preview>
        Merci {customerFirstName} — votre commande {orderNumber} est confirmée.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>Maison du rituel intime</Text>
          </Section>

          <Hr style={hr} />

          <Section style={contentSection}>
            <Heading as="h1" style={h1}>
              Merci {customerFirstName},
            </Heading>
            <Text style={paragraph}>
              Votre commande <strong>{orderNumber}</strong> est bien enregistrée. Nous la préparons
              dans les 24 heures et l’expédierons depuis notre entrepôt européen.
            </Text>

            <Section style={subSection}>
              <Heading as="h2" style={h2}>
                Votre composition
              </Heading>
              {items.map((item, i) => (
                <Section key={i} style={lineItem}>
                  <Text style={lineItemText}>
                    {item.name} <span style={muted}>× {item.quantity}</span>
                  </Text>
                  <Text style={lineItemPrice}>{fmt(item.unitPriceCents * item.quantity)}</Text>
                </Section>
              ))}

              <Hr style={hrLight} />

              <Section style={lineItem}>
                <Text style={muted}>Sous-total</Text>
                <Text style={amount}>{fmt(subtotalCents)}</Text>
              </Section>
              <Section style={lineItem}>
                <Text style={muted}>Livraison</Text>
                <Text style={amount}>{shippingCents === 0 ? 'Offerte' : fmt(shippingCents)}</Text>
              </Section>
              <Section style={lineItemTotal}>
                <Text style={totalLabel}>Total TTC</Text>
                <Text style={totalAmount}>{fmt(totalCents)}</Text>
              </Section>
            </Section>

            <Section style={subSection}>
              <Heading as="h2" style={h2}>
                Livraison à
              </Heading>
              <Text style={addressText}>
                {shippingAddress.line1}
                {shippingAddress.line2 ? (
                  <>
                    <br />
                    {shippingAddress.line2}
                  </>
                ) : null}
                <br />
                {shippingAddress.postalCode} {shippingAddress.city}
                <br />
                {shippingAddress.country}
              </Text>
              <Text style={paragraph}>
                <em>
                  Votre colis est expédié dans un emballage neutre — sans logo, sans mention du
                  contenu, signé à la main.
                </em>
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Link href={trackOrderUrl} style={button}>
                Suivre ma commande
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>Atelier Frisson · Maison du rituel intime · Paris</Text>
            <Text style={footerSmall}>
              Une question ?{' '}
              <Link href="mailto:contact@atelierfrisson.fr" style={footerLink}>
                contact@atelierfrisson.fr
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles inline (compatibilité clients e-mail) ─────────────────────────
const body: React.CSSProperties = {
  backgroundColor: '#F2EADF',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: 0,
  padding: 0,
};
const container: React.CSSProperties = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#F8F2E9',
};
const headerSection: React.CSSProperties = {
  backgroundColor: '#0A0706',
  padding: '32px 24px',
  textAlign: 'center',
};
const wordmark: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '24px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  color: '#C9A36B',
  margin: 0,
};
const tagline: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontStyle: 'italic',
  fontSize: '13px',
  color: 'rgba(242,234,223,0.7)',
  marginTop: '8px',
};
const hr: React.CSSProperties = {
  borderTop: '1px solid rgba(201,163,107,0.3)',
  margin: 0,
};
const hrLight: React.CSSProperties = {
  borderTop: '1px solid rgba(10,7,6,0.1)',
  margin: '20px 0',
};
const contentSection: React.CSSProperties = {
  padding: '40px 32px',
};
const subSection: React.CSSProperties = {
  marginTop: '36px',
};
const h1: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '28px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '0 0 20px',
};
const h2: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '18px',
  fontWeight: 500,
  color: '#0A0706',
  marginBottom: '16px',
};
const paragraph: React.CSSProperties = {
  fontSize: '15px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 12px',
};
const lineItem: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0',
};
const lineItemText: React.CSSProperties = {
  fontSize: '14px',
  color: '#1C1A17',
  margin: 0,
};
const lineItemPrice: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#1C1A17',
  margin: 0,
  fontVariantNumeric: 'tabular-nums',
};
const lineItemTotal: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px solid rgba(10,7,6,0.15)',
  paddingTop: '12px',
  marginTop: '12px',
};
const muted: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(28,26,23,0.65)',
  margin: 0,
};
const amount: React.CSSProperties = {
  fontSize: '13px',
  color: '#1C1A17',
  margin: 0,
  fontVariantNumeric: 'tabular-nums',
};
const totalLabel: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#0A0706',
  margin: 0,
};
const totalAmount: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#0A0706',
  margin: 0,
  fontVariantNumeric: 'tabular-nums',
};
const addressText: React.CSSProperties = {
  fontSize: '14px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 16px',
};
const ctaSection: React.CSSProperties = {
  marginTop: '36px',
  textAlign: 'center',
};
const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#0A0706',
  color: '#F2EADF',
  padding: '14px 28px',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  textDecoration: 'none',
};
const footerSection: React.CSSProperties = {
  padding: '24px 32px 32px',
  textAlign: 'center',
};
const footerText: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontStyle: 'italic',
  fontSize: '13px',
  color: 'rgba(28,26,23,0.65)',
  margin: '0 0 8px',
};
const footerSmall: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(28,26,23,0.55)',
  margin: 0,
};
const footerLink: React.CSSProperties = {
  color: '#A88449',
  textDecoration: 'underline',
};
