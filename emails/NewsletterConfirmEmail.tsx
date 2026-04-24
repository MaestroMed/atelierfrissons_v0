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

export interface NewsletterConfirmEmailProps {
  confirmUrl: string;
  /** TTL du token en heures, pour rassurer l'utilisateur sur le délai. */
  expiresInHours?: number;
}

/**
 * Email de confirmation Double Opt-In (DOI) — RGPD / CNIL.
 *
 * L'utilisateur vient de soumettre son email sur la homepage. Ce mail lui
 * confirme qu'il doit cliquer sur le bouton pour valider son inscription.
 * Aucune personnalisation (on n'a pas encore son prénom) — ton éditorial
 * sobre, signé maison.
 */
export function NewsletterConfirmEmail({
  confirmUrl,
  expiresInHours = 48,
}: NewsletterConfirmEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Confirmez votre inscription à la correspondance Atelier Frisson</title>
      </Head>
      <Preview>Un clic pour confirmer — votre lettre éditoriale arrive après.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>La correspondance éditoriale</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              Un geste pour confirmer,
              <br />
              <em style={hEmph}>et nous commençons.</em>
            </Heading>
            <Text style={paragraph}>
              Vous venez de demander à recevoir notre lettre éditoriale. Pour que nous soyons
              certains que c’est bien vous — et conformément à la RGPD — un simple clic suffit.
            </Text>

            <Section style={cta}>
              <Link href={confirmUrl} style={button}>
                Confirmer mon inscription
              </Link>
            </Section>

            <Text style={paragraphSmall}>
              Si le bouton ne fonctionne pas, copiez-collez cette adresse dans votre navigateur :
              <br />
              <Link href={confirmUrl} style={inlineLink}>
                {confirmUrl}
              </Link>
            </Text>

            <Hr style={hrLight} />

            <Text style={paragraphSmall}>
              Ce lien expire dans {expiresInHours}&nbsp;heures. Si vous n’êtes pas à l’origine de
              cette demande, vous pouvez ignorer ce message — aucune inscription ne sera créée.
            </Text>
            <Text style={signoff}>
              <em>L’équipe Atelier Frisson</em>
              <br />
              Paris
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
const hrLight: React.CSSProperties = {
  borderTop: '1px solid rgba(28,26,23,0.1)',
  margin: '32px 0',
};
const content: React.CSSProperties = { padding: '40px 32px' };
const h1: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '28px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '0 0 20px',
  lineHeight: 1.3,
};
const hEmph: React.CSSProperties = {
  color: '#A88449',
  fontStyle: 'italic',
  fontWeight: 400,
};
const paragraph: React.CSSProperties = {
  fontSize: '15px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 16px',
};
const paragraphSmall: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(28,26,23,0.65)',
  lineHeight: 1.6,
  margin: '16px 0 0',
};
const cta: React.CSSProperties = { marginTop: '32px', textAlign: 'center' };
const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#0A0706',
  color: '#F2EADF',
  padding: '14px 32px',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  textDecoration: 'none',
};
const inlineLink: React.CSSProperties = {
  color: '#A88449',
  textDecoration: 'underline',
  wordBreak: 'break-all',
};
const signoff: React.CSSProperties = {
  marginTop: '32px',
  fontSize: '14px',
  color: 'rgba(28,26,23,0.7)',
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
};
