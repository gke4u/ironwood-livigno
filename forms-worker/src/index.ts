// Ironwood Livigno — form submission backend.
//
// Replaces Web3Forms (a third-party SaaS the site used to POST directly to)
// with a small Cloudflare-native service the site owner fully controls: D1
// for durable storage, and the ratelimit binding for abuse protection.
// Deliberately NOT Formlander (the self-hosted project originally
// requested) — Formlander needs a real persistent filesystem for its
// SQLite file, which Cloudflare Containers cannot give it (container disk
// is ephemeral there).
//
// The notification email is sent over SMTP directly to the site owner's
// existing mailbox.org mailbox (see smtp.ts) — NOT Cloudflare's own
// send_email binding. That binding can only deliver to destination
// addresses "verified" through Email Routing, which requires Email Routing
// to be enabled on the domain — and ironwoodlivigno.com's MX records
// already point to mailbox.org for the real, working inbox. Enabling
// Email Routing would mean replacing those MX records, breaking live
// mail delivery. Reusing the existing mailbox.org SMTP credentials avoids
// that entirely and introduces no third-party email service.
//
// Only SMTP_PASSWORD is a secret (`wrangler secret put`, encrypted, never
// in this repo). D1/ratelimit need no secrets at all — bindings,
// authenticated implicitly by the deployment itself.

import { sendMail } from './smtp';
import { buildNotificationHtml, nightsBetween, renderDraftPage } from './email-template';
import { translateMessageToItalian } from './translate';
import { draftReply } from './draft';
import { replyLabelsFor } from './reply-labels';

export interface Env {
  DB: D1Database;
  FORM_RATE_LIMITER: RateLimit;
  AI: Ai;
  SMTP_PASSWORD: string;
}

const ALLOWED_ORIGIN = 'https://ironwoodlivigno.com';
const NOTIFY_TO = 'info@ironwoodlivigno.com';
const SMTP_HOST = 'smtp.mailbox.org';
const SMTP_PORT = 587;
// The mailbox.org account login is a different address (guanafoto.com)
// than the ironwoodlivigno.com alias that actually receives the
// notification — mailbox.org (like most providers with multiple aliases
// under one account) requires SMTP AUTH with the primary account address,
// not the alias, even though the mail is sent/received as the alias.
const SMTP_USER = 'info@guanafoto.com';
// Personal address to alert alongside the business inbox when something is
// actually broken (not just "a translation didn't work") — best-effort:
// this alert goes out over the same SMTP connection as everything else, so
// if mailbox.org itself is unreachable, the alert won't arrive either.
// There's currently no second, independent channel to catch that specific
// case without adding a paid service.
const ALERT_TO = 'gkemag@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Any C0 control character, including CR/LF — name/phone/source end up
// either in the notification email's headers (name becomes the visible
// From display name and part of the Subject) or its plain-text body.
// Rejecting control characters outright at the boundary is the primary
// defense against email header injection (an embedded \r\n could
// otherwise terminate a header early and smuggle in an extra one); the
// SMTP layer also sanitizes defensively, but this is where a malformed
// submission should actually be refused rather than silently cleaned up.
const CONTROL_CHAR_RE = /[\x00-\x1F\x7F]/;
const MAX_NAME_LEN = 200;
const MAX_MESSAGE_LEN = 2000;
const RETENTION_MONTHS = 24;

export type Submission = {
  name: string;
  email: string;
  phone?: string;
  checkin: string; // dd/mm/yyyy, display only
  checkin_iso: string; // yyyy-mm-dd, source of truth for validation
  checkout: string;
  checkout_iso: string;
  guests: number;
  extra_breakfast?: boolean;
  extra_ebike?: boolean;
  source?: string;
  message?: string;
  locale?: string;
  company?: string; // honeypot — real visitors never fill this in
};

function corsHeaders(origin: string | null): HeadersInit {
  if (origin !== ALLOWED_ORIGIN) return {};
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  });
}

function validate(data: Partial<Submission>): string | null {
  if (!data.name?.trim()) return 'name required';
  if (data.name.length > MAX_NAME_LEN) return 'name too long';
  if (CONTROL_CHAR_RE.test(data.name)) return 'invalid name';
  if (!data.email?.trim() || !EMAIL_RE.test(data.email.trim())) return 'invalid email';
  if (data.phone && CONTROL_CHAR_RE.test(data.phone)) return 'invalid phone';
  if (data.source && CONTROL_CHAR_RE.test(data.source)) return 'invalid source';
  if (!data.checkin_iso || !ISO_DATE_RE.test(data.checkin_iso)) return 'invalid checkin date';
  if (!data.checkout_iso || !ISO_DATE_RE.test(data.checkout_iso)) return 'invalid checkout date';
  if (data.checkout_iso <= data.checkin_iso) return 'checkout must be after checkin';
  const today = new Date().toISOString().slice(0, 10);
  if (data.checkin_iso < today) return 'checkin cannot be in the past';
  const guests = Number(data.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 6) return 'invalid guest count';
  if (data.message && data.message.length > MAX_MESSAGE_LEN) return 'message too long';
  return null;
}

function isSpam(data: Partial<Submission>): boolean {
  return Boolean(data.company && data.company.trim().length > 0);
}

// Fires on real failures — a submission that couldn't be saved, or one
// that was saved but whose notification never went out — sent to both the
// business inbox and the personal address, so a broken system doesn't go
// unnoticed just because nobody happened to check the D1 table.
async function sendAlert(env: Env, subject: string, details: string) {
  try {
    await sendMail(
      { host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, password: env.SMTP_PASSWORD },
      {
        from: NOTIFY_TO,
        fromName: 'Ironwood Livigno — Avviso di sistema',
        to: [NOTIFY_TO, ALERT_TO],
        subject: `⚠ ${subject}`,
        text: `${details}\n\n(Avviso automatico da forms.ironwoodlivigno.com — ${new Date().toISOString()})`
      }
    );
  } catch (err) {
    // Nothing further to fall back to — logged so it's at least visible in
    // Workers Logs even if no email made it out.
    console.error('alert email itself failed to send', err);
  }
}

async function sendNotification(env: Env, data: Submission, country: string, id: number, token: string) {
  const extras = [data.extra_breakfast ? 'Colazione' : null, data.extra_ebike ? 'Noleggio e-bike' : null]
    .filter(Boolean)
    .join(' + ');

  const lines = [
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    `Telefono: ${data.phone || '-'}`,
    `Check-in: ${data.checkin}`,
    `Check-out: ${data.checkout}`,
    `Ospiti: ${data.guests}`,
    extras ? `Extra: ${extras}` : null,
    data.source ? `Come ci ha trovato: ${data.source}` : null,
    data.locale ? `Lingua sito: ${data.locale}` : null,
    country ? `Paese (da IP): ${country}` : null,
    data.message ? `Messaggio: ${data.message}` : null
  ].filter(Boolean);

  // Translation now runs automatically at send time and is embedded
  // directly in the notification (shown right under the guest's original
  // note — see buildNotificationHtml), rather than behind the earlier
  // on-demand /translate/:token click-through. That page only existed
  // because translation used to fail for infra reasons (Workers AI
  // capacity, then a deprecated model); now that the model call is
  // reliable, gating it behind a click added a step with no remaining
  // purpose. translateMessageToItalian never throws — a translation
  // failure here just means the email is sent without the extra box, never
  // a reason to delay or break the notification itself.
  const translation = data.message ? await translateMessageToItalian(env.AI, data.message, data.locale) : null;

  await sendMail(
    { host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, password: env.SMTP_PASSWORD },
    {
      from: NOTIFY_TO,
      fromName: data.name || 'Ironwood Livigno',
      to: NOTIFY_TO,
      replyTo: data.email,
      subject: `${data.name} — richiesta disponibilità Ironwood Livigno`,
      text: lines.join('\n'),
      html: buildNotificationHtml(data, id, country, token, translation)
    }
  );
}

function htmlPage(body: string, status = 200): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
}

// Branded page — same fonts/colors as the notification email — shown when
// Francesco clicks "Genera bozza di risposta con l'AI". Looks up the
// submission by its random token (not the sequential id, so this can't be
// enumerated by guessing numbers) and drafts a reply on the spot, so a
// draft failure only ever affects this one click, never the email
// delivery itself.
async function handleDraftPage(env: Env, token: string): Promise<Response> {
  const row = await env.DB.prepare(
    `SELECT name, email, message, locale, checkin_display, checkin_iso, checkout_display, checkout_iso, guests, extra_breakfast, extra_ebike
     FROM submissions WHERE token = ?`
  )
    .bind(token)
    .first<{
      name: string;
      email: string;
      message: string | null;
      locale: string | null;
      checkin_display: string;
      checkin_iso: string;
      checkout_display: string;
      checkout_iso: string;
      guests: number;
      extra_breakfast: number;
      extra_ebike: number;
    }>();

  if (!row) return htmlPage(renderDraftPage({ error: 'Richiesta non trovata.' }), 404);

  const submission: Submission = {
    name: row.name,
    email: row.email,
    checkin: row.checkin_display,
    checkin_iso: row.checkin_iso,
    checkout: row.checkout_display,
    checkout_iso: row.checkout_iso,
    guests: row.guests,
    extra_breakfast: Boolean(row.extra_breakfast),
    extra_ebike: Boolean(row.extra_ebike),
    message: row.message ?? undefined,
    locale: row.locale ?? undefined
  };
  const nights = nightsBetween(row.checkin_iso, row.checkout_iso);

  const draft = await draftReply(env.AI, submission, nights);
  if (!draft) {
    return htmlPage(renderDraftPage({ error: 'Generazione della bozza non riuscita al momento. Riprova tra poco.' }), 200);
  }

  return htmlPage(renderDraftPage({ name: row.name, email: row.email, subject: replyLabelsFor(row.locale ?? undefined).subject, draft }));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    // /draft/:token — opened directly in a browser from a link in the
    // notification email (not an AJAX call from the site), so it's a plain
    // GET returning an HTML page, no CORS/Origin check needed here.
    const draftMatch = /^\/draft\/([a-f0-9-]{36})$/.exec(url.pathname);
    if (draftMatch && request.method === 'GET') {
      return handleDraftPage(env, draftMatch[1]);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname !== '/submit' || request.method !== 'POST') {
      return json({ ok: false, error: 'not found' }, 404, origin);
    }

    if (origin !== ALLOWED_ORIGIN) {
      return json({ ok: false, error: 'origin not allowed' }, 403, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.FORM_RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json({ ok: false, error: 'too many requests' }, 429, origin);
    }

    let data: Partial<Submission>;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: 'invalid JSON' }, 400, origin);
    }

    const spam = isSpam(data);

    if (!spam) {
      const error = validate(data);
      if (error) return json({ ok: false, error }, 400, origin);
    }

    const country = request.headers.get('CF-IPCountry') || '';
    const now = new Date().toISOString();

    const token = crypto.randomUUID();

    try {
      const result = await env.DB.prepare(
        `INSERT INTO submissions
          (created_at, name, email, phone, checkin_display, checkin_iso, checkout_display, checkout_iso,
           guests, extra_breakfast, extra_ebike, source, message, locale, status, is_spam, cf_country, token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)`
      )
        .bind(
          now,
          data.name ?? '',
          data.email ?? '',
          data.phone ?? null,
          data.checkin ?? '',
          data.checkin_iso ?? '',
          data.checkout ?? '',
          data.checkout_iso ?? '',
          Number(data.guests) || 0,
          data.extra_breakfast ? 1 : 0,
          data.extra_ebike ? 1 : 0,
          data.source ?? null,
          data.message ?? null,
          data.locale ?? null,
          spam ? 1 : 0,
          country,
          token
        )
        .run();

      // The submission is durably saved in D1 at this point — that's the
      // part that must never silently fail. The notification email is a
      // secondary effect: if it errors (e.g. Email Service misconfigured),
      // the guest's request is still safely recorded, so this must not
      // turn into a false "submission failed" for them. Log and move on.
      //
      // Bots that trip the honeypot get a normal-looking success response
      // (so the script has no signal its submission was rejected) but no
      // notification email — same principle the old client-side-only
      // honeypot already used, now enforced server-side too.
      if (!spam) {
        try {
          await sendNotification(env, data as Submission, country, Number(result.meta.last_row_id), token);
        } catch (err) {
          console.error('notification email failed (submission was still saved)', err);
          // This is the case most worth an alert: a real guest request
          // exists in D1 but nobody was told — without this, it would sit
          // unnoticed until someone happened to check the database.
          await sendAlert(
            env,
            'Notifica non inviata per una richiesta salvata',
            `La richiesta #${result.meta.last_row_id} (${data.name ?? '-'}, ${data.email ?? '-'}) e' stata salvata correttamente ma l'email di notifica non e' partita.\n\nErrore: ${err instanceof Error ? err.message : String(err)}\n\nControlla la riga nel database: SELECT * FROM submissions WHERE id = ${result.meta.last_row_id}`
          );
        }
      }

      return json({ ok: true, id: result.meta.last_row_id }, 200, origin);
    } catch (err) {
      // Never leak stack traces, D1 error text, or binding details to the
      // client — log server-side (Workers Logs) and return a generic error.
      console.error('submission failed', err);
      await sendAlert(
        env,
        'Richiesta form non salvata — errore di sistema',
        `Un tentativo di invio dal form non e' andato a buon fine e la richiesta NON e' stata salvata.\n\nErrore: ${err instanceof Error ? err.message : String(err)}`
      );
      return json({ ok: false, error: 'internal error' }, 500, origin);
    }
  },

  // Monthly retention sweep (see wrangler.jsonc triggers.crons). Keeps the
  // dataset from growing forever — 24 months comfortably covers a
  // vacation-rental's typical rebooking/reference window without holding
  // guest contact data indefinitely.
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await env.DB.prepare(`DELETE FROM submissions WHERE created_at < datetime('now', ?)`)
      .bind(`-${RETENTION_MONTHS} months`)
      .run();
  }
} satisfies ExportedHandler<Env>;
