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

export interface AmbassadorAcknowledgmentEmailProps {
  firstName: string;
  applicationId: string;
  estimatedResponseDays: number;
}

/**
 * Accusé de réception envoyé immédiatement après soumission de candidature
 * via /ambassadrices. Pas de promesse, juste un mot honnête : « on lit, on
 * vous répond personnellement, sous N jours ».
 */
export function AmbassadorAcknowledgmentEmail({
  firstName,
  applicationId,
  estimatedResponseDays,
}: AmbassadorAcknowledgmentEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Votre candidature ambassadrice — Atelier Frisson</title>
      </Head>
      <Preview>{firstName}, on a bien reçu votre candidature.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>Programme ambassadrice</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              Merci, {firstName}.
            </Heading>
            <Text style={paragraph}>
              On a bien reçu votre candidature au programme ambassadrice. Référence{' '}
              <strong style={{ fontFamily: 'monospace' }}>{applicationId}</strong>.
            </Text>
            <Text style={paragraph}>
              Réponse personnelle d'Odelie sous <strong>{estimatedResponseDays} jours</strong>.
              On lit chaque candidature en personne — qu'on dise oui, non, ou « pas tout de suite »,
              il y aura toujours un mot.
            </Text>

            <Section style={pullQuote}>
              <Text style={quoteText}>
                « On ne cherche pas du chiffre. On cherche dix voix qui aiment vraiment ce qu'on
                fait. »
              </Text>
            </Section>

            <Text style={paragraph}>
              D'ici là, n'hésitez pas à explorer la maison —{' '}
              <Link
                href="https://atelierfrisson.fr/a-propos"
                style={inlineLink}
              >
                la fondatrice et nos engagements
              </Link>
              {' '}sont publics, et la{' '}
              <Link href="https://atelierfrisson.fr/lancement" style={inlineLink}>
                liste avant-première
              </Link>{' '}
              est ouverte aussi (sans contrepartie côté Insta).
            </Text>

            <Text style={signoff}>
              <em>Avec attention,</em>
              <br />
              Odelie & l'équipe — Paris
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Email envoyé suite à votre candidature sur atelierfrisson.fr/ambassadrices.
            </Text>
            <Text style={footerLinks}>
              <Link
                href="mailto:presse@atelierfrisson.fr"
                style={footerLink}
              >
                presse@atelierfrisson.fr
              </Link>{' '}
              ·{' '}
              <Link href="https://atelierfrisson.fr/dpo" style={footerLink}>
                Mes données (RGPD)
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
  backgroundColor: '#0A0706',
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
const pullQuote: React.CSSProperties = {
  borderLeft: '2px solid #C9A36B',
  padding: '12px 0 12px 20px',
  margin: '24px 0',
};
const quoteText: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontStyle: 'italic',
  fontSize: '17px',
  color: '#0A0706',
  lineHeight: 1.5,
  margin: 0,
};
const inlineLink: React.CSSProperties = {
  color: '#8B1424',
  textDecoration: 'underline',
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
