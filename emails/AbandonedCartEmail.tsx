import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface AbandonedCartItem {
  name: string;
  imageUrl: string;
  priceCents: number;
  quantity: number;
}

export interface AbandonedCartEmailProps {
  customerFirstName: string;
  items: readonly AbandonedCartItem[];
  totalCents: number;
  resumeUrl: string;
  freeShippingThresholdReached: boolean;
}

/**
 * Email envoyé J+24h après abandon panier (cart.updatedAt + 24h sans checkout).
 *
 * Pas de pression urgente — ton « la maison vous garde une place ».
 * Mention discrète de la livraison offerte si le seuil est atteint.
 *
 * Trigger : cron `processAbandonedCarts` quotidien.
 */
export function AbandonedCartEmail({
  customerFirstName,
  items,
  totalCents,
  resumeUrl,
  freeShippingThresholdReached,
}: AbandonedCartEmailProps) {
  const formatEUR = (cents: number) =>
    `${(cents / 100).toFixed(0)} €`;

  return (
    <Html lang="fr">
      <Head>
        <title>Votre panier vous attend — Atelier Frisson</title>
      </Head>
      <Preview>{customerFirstName}, votre sélection est gardée — pas de pression.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>Le rituel intime à deux.</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              {customerFirstName}, votre sélection vous attend.
            </Heading>
            <Text style={paragraph}>
              Pas de pression — votre panier reste en place, vous décidez quand. Voici ce que vous
              aviez choisi :
            </Text>

            <Section style={itemsBox}>
              {items.map((item, i) => (
                <Section key={i} style={itemRow}>
                  <Section style={itemImageBox}>
                    {item.imageUrl ? (
                      <Img
                        src={item.imageUrl}
                        alt={item.name}
                        width="60"
                        height="75"
                        style={itemImage}
                      />
                    ) : null}
                  </Section>
                  <Section style={itemDetails}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemMeta}>
                      Quantité : {item.quantity} — {formatEUR(item.priceCents * item.quantity)}
                    </Text>
                  </Section>
                </Section>
              ))}
              <Hr style={itemsHr} />
              <Section style={totalRow}>
                <Text style={totalLabel}>TOTAL</Text>
                <Text style={totalValue}>{formatEUR(totalCents)}</Text>
              </Section>
              {freeShippingThresholdReached ? (
                <Text style={shippingNote}>✓ Livraison offerte — votre panier dépasse 60 €</Text>
              ) : null}
            </Section>

            <Section style={cta}>
              <Link href={resumeUrl} style={button}>
                Reprendre ma commande
              </Link>
            </Section>

            <Text style={paragraph}>
              Une question avant de finaliser ? Répondez à cet email — réponse sous 24 h, par une
              vraie personne.
            </Text>

            <Text style={signoff}>
              <em>L’équipe Atelier Frisson — Paris</em>
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Atelier Frisson — Maison française du rituel intime à deux. Livraison discrète,
              emballage neutre signé à la main.
            </Text>
            <Text style={footerLinks}>
              <Link
                href="https://atelierfrisson.fr/compte/preferences#emails"
                style={footerLink}
              >
                Préférences d’email
              </Link>{' '}
              ·{' '}
              <Link href="https://atelierfrisson.fr/confidentialite" style={footerLink}>
                Confidentialité
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: '#F2EADF',
  fontFamily: 'Inter, -apple-system, sans-serif',
  margin: 0,
};
const container: React.CSSProperties = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#F8F2E9',
};
const header: React.CSSProperties = {
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
const hr: React.CSSProperties = { borderTop: '1px solid rgba(201,163,107,0.3)' };
const content: React.CSSProperties = { padding: '40px 32px' };
const h1: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '26px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '0 0 18px',
};
const paragraph: React.CSSProperties = {
  fontSize: '15px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 16px',
};
const itemsBox: React.CSSProperties = {
  backgroundColor: '#F2EADF',
  border: '1px solid rgba(201,163,107,0.3)',
  padding: '20px 24px',
  margin: '24px 0',
};
const itemRow: React.CSSProperties = {
  display: 'block',
  paddingBottom: '14px',
};
const itemImageBox: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '60px',
};
const itemImage: React.CSSProperties = {
  border: '1px solid rgba(201,163,107,0.2)',
};
const itemDetails: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingLeft: '14px',
  width: 'calc(100% - 80px)',
};
const itemName: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '16px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '0 0 4px',
};
const itemMeta: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(28,26,23,0.65)',
  margin: 0,
};
const itemsHr: React.CSSProperties = {
  borderTop: '1px solid rgba(28,26,23,0.1)',
  margin: '12px 0',
};
const totalRow: React.CSSProperties = {
  textAlign: 'right',
};
const totalLabel: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '11px',
  letterSpacing: '0.18em',
  color: 'rgba(28,26,23,0.55)',
  marginRight: '12px',
};
const totalValue: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '20px',
  fontWeight: 600,
  color: '#0A0706',
};
const shippingNote: React.CSSProperties = {
  fontSize: '12px',
  color: '#8B1424',
  margin: '8px 0 0',
  textAlign: 'right',
};
const cta: React.CSSProperties = { marginTop: '32px', textAlign: 'center' };
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
const signoff: React.CSSProperties = {
  marginTop: '40px',
  fontSize: '14px',
  color: 'rgba(28,26,23,0.7)',
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
};
const footer: React.CSSProperties = {
  padding: '20px 32px 32px',
  textAlign: 'center',
};
const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(28,26,23,0.55)',
  margin: '0 0 8px',
};
const footerLinks: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(28,26,23,0.5)',
  margin: 0,
};
const footerLink: React.CSSProperties = {
  color: '#8B1424',
  textDecoration: 'none',
};
