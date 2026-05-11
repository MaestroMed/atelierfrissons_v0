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

export interface SubscriptionWinbackEmailProps {
  customerFirstName: string;
  cancellationDate: string;
  reactivateUrl: string;
  /** Code promo offert pour ré-activer (ex: 'RETOUR-15'). */
  winbackCode?: string;
}

/**
 * Email de winback envoyé J+7 après annulation d'abonnement Box Mensuelle.
 *
 * Ton volontairement modeste — pas de désespoir commercial, pas de pression.
 * Une note humaine + une petite remise (15 %) pour reprendre quand l'envie revient.
 *
 * Trigger : cron quotidien qui scan subscriptions cancelled depuis 7 jours.
 */
export function SubscriptionWinbackEmail({
  customerFirstName,
  cancellationDate,
  reactivateUrl,
  winbackCode,
}: SubscriptionWinbackEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        <title>Une note de la maison — {customerFirstName}</title>
      </Head>
      <Preview>
        Une note de Sophie — pas de pression, juste un mot.
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
              {customerFirstName},
            </Heading>
            <Text style={paragraph}>
              Vous avez quitté la box mensuelle le <strong>{cancellationDate}</strong>. Ce n’est
              pas un drame — chaque rituel a son rythme, et celui de la box ne convient pas
              forcément à tous les moments.
            </Text>
            <Text style={paragraph}>
              Si l’envie revient un jour, la maison sera là. Et pour faciliter le geste — voici un
              code de remise valable trois mois :
            </Text>

            {winbackCode ? (
              <Section style={codeBox}>
                <Text style={codeLabel}>15 % SUR LA PROCHAINE BOX</Text>
                <Text style={codeValue}>{winbackCode}</Text>
                <Text style={codeNote}>Valable jusqu’au mois prochain × 3</Text>
              </Section>
            ) : null}

            <Text style={paragraph}>
              Vous pouvez aussi simplement nous écrire pour nous dire ce qui n’a pas fonctionné —
              c’est ce qui nous fait avancer. Réponse en personne sous 24 h.
            </Text>

            <Section style={cta}>
              <Link href={reactivateUrl} style={button}>
                Reprendre mon abonnement
              </Link>
            </Section>

            <Text style={signoff}>
              <em>Avec attention,</em>
              <br />
              Odelie — Atelier Frisson
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Vous recevez ce mail car vous étiez abonnée à la Box Mensuelle. C’est le seul email
              winback que nous enverrons — promis.
            </Text>
            <Text style={footerLinks}>
              <Link
                href="https://atelierfrisson.fr/compte/preferences#emails"
                style={footerLink}
              >
                Désabonner ces emails
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles (même palette que SubscriptionWelcomeEmail) ─────────────────
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
const codeBox: React.CSSProperties = {
  backgroundColor: '#0A0706',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center',
};
const codeLabel: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#C9A36B',
  margin: 0,
};
const codeValue: React.CSSProperties = {
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
  fontSize: '32px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: '#C9A36B',
  margin: '12px 0 8px',
};
const codeNote: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(242,234,223,0.55)',
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
  fontStyle: 'italic',
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
