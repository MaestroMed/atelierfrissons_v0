import 'server-only';
import { render } from '@react-email/components';
import { FROM_EMAIL, getResendClient } from './client';
import {
  OrderConfirmationEmail,
  type OrderConfirmationEmailProps,
} from '@/emails/OrderConfirmationEmail';
import { WelcomeEmail, type WelcomeEmailProps } from '@/emails/WelcomeEmail';

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
