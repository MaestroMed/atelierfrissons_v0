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

export interface SubscriptionWelcomeEmailProps {
  customerFirstName: string;
  planName: string;
  firstChargeDate: string;
  firstShipmentDate: string;
  manageUrl: string;
}

/**
 * Email envoyé après confirmation d'abonnement Box Mensuelle.
 *
 * Trigger CCBill webhook `NewSaleSuccess` avec event.subscriptionId.
 * Resend envoie depuis no-reply@atelierfrisson.fr (DKIM signé).
 */
export function SubscriptionWelcomeEmail({
  customerFirstName,
  planName,
  firstChargeDate,
  firstShipmentDate,
  manageUrl,
}: SubscriptionWelcomeEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Votre abonnement {planName} est confirmé</title>
      </Head>
      <Preview>
        {customerFirstName}, votre première Box Mensuelle est expédiée le {firstShipmentDate}.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>Le rituel intime à deux.</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              Bienvenue, {customerFirstName}.
            </Heading>
            <Text style={paragraph}>
              Votre abonnement <strong>{planName}</strong> est confirmé. Première box expédiée le{' '}
              <strong>{firstShipmentDate}</strong>, prochain prélèvement le{' '}
              <strong>{firstChargeDate}</strong>.
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>VOTRE PROCHAIN CHAPITRE</Text>
              <Text style={infoTitle}>Box {planName} — chapitre n°1</Text>
              <Text style={infoBody}>
                Boîte ivoire neutre, livraison Colissimo Suivi 48 h. Aucune mention extérieure du
                contenu.
              </Text>
            </Section>

            <Text style={paragraph}>
              Vous gardez la main : pause, skip, annulation — depuis votre espace client, en deux
              clics, sans frais.
            </Text>

            <Section style={cta}>
              <Link href={manageUrl} style={button}>
                Gérer mon abonnement
              </Link>
            </Section>

            <Text style={signoff}>
              <em>Pour vous deux. Pour elle. Pour lui.</em>
              <br />
              L’équipe Atelier Frisson — Paris
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Atelier Frisson — Maison française du rituel intime à deux.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://atelierfrisson.fr/cgv" style={footerLink}>
                CGV
              </Link>{' '}
              ·{' '}
              <Link href="https://atelierfrisson.fr/confidentialite" style={footerLink}>
                Confidentialité
              </Link>{' '}
              ·{' '}
              <Link href={manageUrl} style={footerLink}>
                Gérer mon abonnement
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
  fontSize: '28px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '0 0 20px',
};
const paragraph: React.CSSProperties = {
  fontSize: '15px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 16px',
};
const infoBox: React.CSSProperties = {
  backgroundColor: '#F2EADF',
  border: '1px solid rgba(201,163,107,0.3)',
  padding: '20px 24px',
  margin: '24px 0',
};
const infoLabel: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#8B1424',
  margin: 0,
};
const infoTitle: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '20px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '8px 0 6px',
};
const infoBody: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(28,26,23,0.75)',
  lineHeight: 1.5,
  margin: 0,
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
