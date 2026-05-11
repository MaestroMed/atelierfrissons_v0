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

export interface WaitlistWelcomeEmailProps {
  firstName?: string;
  estimatedLaunchMonth: string;
  preferenceUrl: string;
}

/**
 * Envoyé après confirmation Double Opt-In d'une inscription `source: 'waitlist*'`.
 * Pas de code promo dans cet email — le code arrive le jour J par flow Klaviyo
 * « Waitlist Launch Day ».
 */
export function WaitlistWelcomeEmail({
  firstName,
  estimatedLaunchMonth,
  preferenceUrl,
}: WaitlistWelcomeEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Vous êtes sur la liste avant-première</title>
      </Head>
      <Preview>
        Vous serez parmi les premières informées de l'ouverture en {estimatedLaunchMonth}.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>Avant-première</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              {firstName ? `${firstName}, vous êtes sur la liste.` : 'Vous êtes sur la liste.'}
            </Heading>
            <Text style={paragraph}>
              Votre inscription à l'avant-première est confirmée. La maison ouvre ses portes en{' '}
              <strong>{estimatedLaunchMonth}</strong>. Vous serez parmi les premières informées —
              48 h avant l'ouverture publique.
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>VOTRE BÉNÉFICE</Text>
              <Text style={infoTitle}>−15 % sur la 1ère commande</Text>
              <Text style={infoBody}>
                Code unique envoyé le jour de l'ouverture. Valable 30 jours, une seule fois, sur
                tout le catalogue (hors cartes cadeaux).
              </Text>
            </Section>

            <Text style={paragraph}>
              D'ici là, on vous écrira <strong>une fois par mois</strong> avec un guide rituel ou
              une coulisse de la maison. Jamais plus, jamais d'urgence.
            </Text>

            <Text style={signoff}>
              <em>Avec attention,</em>
              <br />
              Odelie — Atelier Frisson, Paris
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Vous recevez ce mail car vous avez confirmé votre inscription. Désinscription
              possible à tout moment.
            </Text>
            <Text style={footerLinks}>
              <Link href={preferenceUrl} style={footerLink}>
                Préférences emails
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
  backgroundColor: '#8B1424',
  padding: '36px 24px',
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
  color: 'rgba(242,234,223,0.75)',
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
  padding: '24px',
  margin: '28px 0',
  textAlign: 'center' as const,
};
const infoLabel: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#8B1424',
  margin: 0,
};
const infoTitle: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '28px',
  fontWeight: 600,
  color: '#0A0706',
  margin: '12px 0',
};
const infoBody: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(28,26,23,0.75)',
  lineHeight: 1.5,
  margin: 0,
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
