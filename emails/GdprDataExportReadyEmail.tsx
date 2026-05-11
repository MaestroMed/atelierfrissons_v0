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

export interface GdprDataExportReadyEmailProps {
  firstName?: string;
  jobId: string;
  format: 'json' | 'csv';
  downloadUrl: string;
  /** Date d'expiration du lien signé (ISO). 7 jours en standard. */
  expiresAt: string;
}

/**
 * Envoyé quand l'export DSAR (RGPD art. 15 + 20) est prêt à télécharger.
 * Lien Supabase Storage signé valide 7 jours.
 */
export function GdprDataExportReadyEmail({
  firstName,
  jobId,
  format,
  downloadUrl,
  expiresAt,
}: GdprDataExportReadyEmailProps) {
  const expiry = new Date(expiresAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Html lang="fr">
      <Head>
        <title>Votre export RGPD est prêt — Atelier Frisson</title>
      </Head>
      <Preview>Votre export de données est disponible au téléchargement.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={wordmark}>ATELIER FRISSON</Heading>
            <Text style={tagline}>RGPD · Export de données</Text>
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading as="h1" style={h1}>
              {firstName ? `${firstName},` : 'Bonjour,'}
            </Heading>
            <Text style={paragraph}>
              Votre export de données (RGPD art. 15 et 20 — droit d'accès et portabilité) est
              prêt. Référence{' '}
              <strong style={{ fontFamily: 'monospace' }}>{jobId}</strong>.
            </Text>

            <Section style={cta}>
              <Link href={downloadUrl} style={button}>
                Télécharger l'export ({format.toUpperCase()})
              </Link>
            </Section>

            <Text style={paragraph}>
              Le lien expire le <strong>{expiry}</strong>. Au-delà, faites une nouvelle demande
              depuis votre compte → <em>Mes données</em>.
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>CE QUE CONTIENT L'EXPORT</Text>
              <Text style={infoListItem}>· Compte (email, nom, préférences, dates)</Text>
              <Text style={infoListItem}>· Adresses</Text>
              <Text style={infoListItem}>· Commandes (one-time + abonnements + factures)</Text>
              <Text style={infoListItem}>· Avis publiés</Text>
              <Text style={infoListItem}>· Points fidélité (historique complet)</Text>
              <Text style={infoListItem}>· Parrainages (codes générés + filleuls)</Text>
              <Text style={infoListItem}>· Cartes cadeaux achetées</Text>
              <Text style={infoListItem}>· Audit log (connexions, modifications RGPD)</Text>
            </Section>

            <Text style={paragraph}>
              Le fichier est <strong>signé HMAC</strong> pour vérifier l'intégrité. Pas de PII en
              clair dans les noms de champs : votre email apparait une seule fois en en-tête.
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
              Question RGPD ?{' '}
              <Link href="mailto:dpo@atelierfrisson.fr" style={footerLink}>
                dpo@atelierfrisson.fr
              </Link>{' '}
              — réponse sous 30 jours max.
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
const cta: React.CSSProperties = { marginTop: '24px', textAlign: 'center' };
const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#0A0706',
  color: '#F2EADF',
  padding: '16px 32px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textDecoration: 'none',
};
const infoBox: React.CSSProperties = {
  backgroundColor: '#F2EADF',
  border: '1px solid rgba(201,163,107,0.3)',
  padding: '18px 24px',
  margin: '24px 0',
};
const infoLabel: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#8B1424',
  margin: '0 0 12px',
};
const infoListItem: React.CSSProperties = {
  fontSize: '13px',
  color: '#1C1A17',
  lineHeight: 1.6,
  margin: '0 0 4px',
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
