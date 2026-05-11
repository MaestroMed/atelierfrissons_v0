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

export interface GdprErasureConfirmEmailProps {
  firstName?: string;
  scheduledFor: string;
  cancelUrl: string;
}

/**
 * Confirmation envoyée immédiatement après une demande d'effacement RGPD.
 * Délai de grâce de 30 jours, lien d'annulation valide pendant ce délai.
 */
export function GdprErasureConfirmEmail({
  firstName,
  scheduledFor,
  cancelUrl,
}: GdprErasureConfirmEmailProps) {
  const formattedDate = new Date(scheduledFor).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Html lang="fr">
      <Head>
        <title>Confirmation de demande d'effacement — Atelier Frisson</title>
      </Head>
      <Preview>Votre demande d'effacement RGPD est enregistrée.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>RGPD · Droit à l'effacement</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              {firstName ? `${firstName},` : 'Bonjour,'}
            </Heading>
            <Text style={paragraph}>
              Votre demande d'effacement de compte est bien enregistrée. Conformément à l'article
              17 du RGPD, vos données seront définitivement supprimées le{' '}
              <strong>{formattedDate}</strong>.
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>DÉLAI DE GRÂCE</Text>
              <Text style={infoTitle}>30 jours</Text>
              <Text style={infoBody}>
                Pendant ce délai, vous pouvez annuler la suppression et restaurer votre compte
                en cliquant ci-dessous.
              </Text>
            </Section>

            <Section style={cta}>
              <Link href={cancelUrl} style={button}>
                Annuler la suppression
              </Link>
            </Section>

            <Text style={paragraph}>
              <strong>Données supprimées</strong> : compte, adresses, préférences, points fidélité,
              parrainages.
            </Text>
            <Text style={paragraph}>
              <strong>Données conservées 10 ans</strong> (obligation comptable LME) : commandes
              passées, factures — ces données seront <em>anonymisées</em> (votre nom et email
              retirés).
            </Text>

            <Text style={signoff}>
              <em>Avec considération,</em>
              <br />
              DPO Atelier Frisson — Paris
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Pour toute question, écrivez à{' '}
              <Link href="mailto:dpo@atelierfrisson.fr" style={footerLink}>
                dpo@atelierfrisson.fr
              </Link>
              . Réponse sous 30 jours max (RGPD art. 12§3).
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
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
  fontSize: '24px',
  fontWeight: 500,
  color: '#0A0706',
  margin: '0 0 20px',
};
const paragraph: React.CSSProperties = {
  fontSize: '14px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 14px',
};
const infoBox: React.CSSProperties = {
  backgroundColor: '#F2EADF',
  border: '1px solid rgba(201,163,107,0.4)',
  padding: '20px 24px',
  margin: '24px 0',
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
  fontSize: '32px',
  fontWeight: 600,
  color: '#0A0706',
  margin: '8px 0',
};
const infoBody: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(28,26,23,0.75)',
  lineHeight: 1.5,
  margin: 0,
};
const cta: React.CSSProperties = { marginTop: '24px', textAlign: 'center' };
const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#C9A36B',
  color: '#0A0706',
  padding: '14px 32px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textDecoration: 'none',
};
const signoff: React.CSSProperties = {
  marginTop: '32px',
  fontSize: '13px',
  color: 'rgba(28,26,23,0.7)',
  fontFamily: '"Bodoni Moda", "Didot", Georgia, serif',
};
const footer: React.CSSProperties = {
  padding: '20px 32px 32px',
  textAlign: 'center',
};
const footerText: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(28,26,23,0.55)',
  margin: 0,
  lineHeight: 1.5,
};
const footerLink: React.CSSProperties = {
  color: '#8B1424',
  textDecoration: 'underline',
};
