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

export interface WelcomeEmailProps {
  customerFirstName: string;
  shopUrl: string;
}

export function WelcomeEmail({ customerFirstName, shopUrl }: WelcomeEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Bienvenue chez Atelier Frisson</title>
      </Head>
      <Preview>{customerFirstName}, bienvenue dans la maison du rituel intime.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>Pour tous les rituels. Pour tous les moments.</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              Bienvenue {customerFirstName},
            </Heading>
            <Text style={paragraph}>
              Vous venez de rejoindre une maison qui croit qu’un objet de rituel mérite la même
              attention qu’une lampe Tizio ou un parfum de niche.
            </Text>
            <Text style={paragraph}>
              Nous concevons en France des objets de bien-être intime en silicone médical, livrés
              dans un emballage neutre signé à la main. Notre lettre éditoriale arrive deux fois par
              mois — jamais plus, jamais de promotion forcée.
            </Text>
            <Section style={cta}>
              <Link href={shopUrl} style={button}>
                Découvrir la collection
              </Link>
            </Section>
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
