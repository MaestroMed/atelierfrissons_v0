import 'server-only';
import { render } from '@react-email/components';
import { FROM_EMAIL, getResendClient } from './client';
import {
  OrderConfirmationEmail,
  type OrderConfirmationEmailProps,
} from '@/emails/OrderConfirmationEmail';
import { WelcomeEmail, type WelcomeEmailProps } from '@/emails/WelcomeEmail';
import {
  NewsletterConfirmEmail,
  type NewsletterConfirmEmailProps,
} from '@/emails/NewsletterConfirmEmail';
import {
  WaitlistWelcomeEmail,
  type WaitlistWelcomeEmailProps,
} from '@/emails/WaitlistWelcomeEmail';
import {
  AmbassadorAcknowledgmentEmail,
  type AmbassadorAcknowledgmentEmailProps,
} from '@/emails/AmbassadorAcknowledgmentEmail';
import {
  GdprErasureConfirmEmail,
  type GdprErasureConfirmEmailProps,
} from '@/emails/GdprErasureConfirmEmail';
import {
  GdprDataExportReadyEmail,
  type GdprDataExportReadyEmailProps,
} from '@/emails/GdprDataExportReadyEmail';

/**
 * Wrappers Resend pour chaque template — server-only, gracieux si pas de clé.
 *
 * Usage : `await sendOrderConfirmation({ to: 'foo@bar.com', ...payload })`.
 *
 * Si RESEND_API_KEY est absent, on log + render quand même le HTML pour
 * faciliter le debug visuel en dev.
 */

interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
  skipped?: boolean;
}

export async function sendOrderConfirmation(
  to: string,
  props: OrderConfirmationEmailProps,
): Promise<SendResult> {
  const html = await render(OrderConfirmationEmail(props));
  const text = await render(OrderConfirmationEmail(props), { plainText: true });
  return sendRaw({
    to,
    subject: `Votre commande ${props.orderNumber} est confirmée`,
    html,
    text,
  });
}

export async function sendWelcome(to: string, props: WelcomeEmailProps): Promise<SendResult> {
  const html = await render(WelcomeEmail(props));
  const text = await render(WelcomeEmail(props), { plainText: true });
  return sendRaw({
    to,
    subject: 'Bienvenue chez Atelier Frisson',
    html,
    text,
  });
}

/** Email Double Opt-In newsletter — envoyé après l'inscription au formulaire. */
export async function sendNewsletterConfirmation(
  to: string,
  props: NewsletterConfirmEmailProps,
): Promise<SendResult> {
  const html = await render(NewsletterConfirmEmail(props));
  const text = await render(NewsletterConfirmEmail(props), { plainText: true });
  return sendRaw({
    to,
    subject: 'Confirmez votre inscription à notre correspondance',
    html,
    text,
  });
}

/** Email envoyé après confirmation Double Opt-In si source = waitlist*. */
export async function sendWaitlistWelcome(
  to: string,
  props: WaitlistWelcomeEmailProps,
): Promise<SendResult> {
  const html = await render(WaitlistWelcomeEmail(props));
  const text = await render(WaitlistWelcomeEmail(props), { plainText: true });
  return sendRaw({
    to,
    subject: 'Vous êtes sur la liste avant-première Atelier Frisson',
    html,
    text,
  });
}

/** Accusé de réception candidature ambassadrice. */
export async function sendAmbassadorAcknowledgment(
  to: string,
  props: AmbassadorAcknowledgmentEmailProps,
): Promise<SendResult> {
  const html = await render(AmbassadorAcknowledgmentEmail(props));
  const text = await render(AmbassadorAcknowledgmentEmail(props), {
    plainText: true,
  });
  return sendRaw({
    to,
    subject: 'Votre candidature ambassadrice — Atelier Frisson',
    html,
    text,
    replyTo: 'presse@atelierfrisson.fr',
  });
}

/** Confirmation de demande d'effacement RGPD avec lien d'annulation. */
export async function sendGdprErasureConfirm(
  to: string,
  props: GdprErasureConfirmEmailProps,
): Promise<SendResult> {
  const html = await render(GdprErasureConfirmEmail(props));
  const text = await render(GdprErasureConfirmEmail(props), { plainText: true });
  return sendRaw({
    to,
    subject: "Confirmation de demande d'effacement — Atelier Frisson",
    html,
    text,
    replyTo: 'dpo@atelierfrisson.fr',
  });
}

/** Notification que l'export DSAR est prêt à télécharger. */
export async function sendGdprDataExportReady(
  to: string,
  props: GdprDataExportReadyEmailProps,
): Promise<SendResult> {
  const html = await render(GdprDataExportReadyEmail(props));
  const text = await render(GdprDataExportReadyEmail(props), { plainText: true });
  return sendRaw({
    to,
    subject: 'Votre export RGPD est prêt — Atelier Frisson',
    html,
    text,
    replyTo: 'dpo@atelierfrisson.fr',
  });
}

interface RawEmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

async function sendRaw(payload: RawEmailPayload): Promise<SendResult> {
  const client = getResendClient();
  if (!client) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[resend] (skip — no RESEND_API_KEY)', {
        to: payload.to,
        subject: payload.subject,
      });
    }
    return { ok: true, skipped: true };
  }
  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
    });
    if (error) {
      console.error('[resend] error', error);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('[resend] exception', err);
    return { ok: false, error: (err as Error).message };
  }
}
