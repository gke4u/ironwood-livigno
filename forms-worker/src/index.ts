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

import { sendMail, checkSmtpConnection } from './smtp';
import { buildNotificationHtml, nightsBetween, renderDraftPage } from './email-template';
import { translateMessageToItalian } from './translate';
import { draftReply } from './draft';
import { replyLabelsFor } from './reply-labels';
import { buildGuestReceipt } from './guest-receipt';

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
// Deliberately narrower than a full RFC 5321 grammar: this address is later
// embedded raw (unencoded) into `mailto:` hrefs (email-template.ts,
// quick-replies.ts) — the "reply to the guest" buttons — and into the
// notification email's Reply-To header. Real addresses never need the
// characters this excludes, but a raw '#' would start a URI fragment and
// corrupt the mailto link (RFC 3986), and '<>"\\`' have no legitimate
// reason to appear unquoted either. This is the actual boundary that keeps
// those downstream consumers safe, not a general-purpose email validator.
const EMAIL_RE = /^[^\s@#<>"'\\`]+@[^\s@#<>"'\\`]+\.[^\s@#<>"'\\`]+$/;
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
const MAX_GUESTS = 6; // the apartment's real occupancy limit — 3 bedrooms, sleeps up to 6 total (adults + children)
const MAX_CHILD_AGE = 17;

export type Submission = {
  name: string;
  email: string;
  phone?: string;
  checkin: string; // "15 agosto 2026" (Italian, spelled-out month), display only
  checkin_iso: string; // yyyy-mm-dd, source of truth for validation
  checkout: string;
  checkout_iso: string;
  guests: number; // adults + children combined — kept so existing templates (quick-replies.ts, email-template.ts, guest-receipt.ts) that only care about a headcount don't need to change
  adults: number;
  children: number;
  children_ages?: number[]; // one entry per child, 0–17; only present when children > 0
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
  // Every field is read straight out of request.json() into a type the
  // compiler trusts (Partial<Submission>) but never actually checks at
  // runtime — a numeric or object `name`/`email`/etc. (malformed client,
  // hand-crafted request) would otherwise reach `.trim()`/regex calls that
  // only exist on strings and throw a TypeError, which propagates out of
  // this synchronous call with no surrounding try/catch and turns into an
  // unhandled exception instead of the intended 400 response.
  if (typeof data.name !== 'string' || !data.name.trim()) return 'name required';
  if (data.name.length > MAX_NAME_LEN) return 'name too long';
  if (CONTROL_CHAR_RE.test(data.name)) return 'invalid name';
  if (typeof data.email !== 'string' || !data.email.trim() || !EMAIL_RE.test(data.email.trim())) return 'invalid email';
  if (data.phone && (typeof data.phone !== 'string' || CONTROL_CHAR_RE.test(data.phone))) return 'invalid phone';
  if (data.source && (typeof data.source !== 'string' || CONTROL_CHAR_RE.test(data.source))) return 'invalid source';
  if (typeof data.checkin_iso !== 'string' || !ISO_DATE_RE.test(data.checkin_iso)) return 'invalid checkin date';
  if (typeof data.checkout_iso !== 'string' || !ISO_DATE_RE.test(data.checkout_iso)) return 'invalid checkout date';
  if (data.checkout_iso <= data.checkin_iso) return 'checkout must be after checkin';
  const today = new Date().toISOString().slice(0, 10);
  if (data.checkin_iso < today) return 'checkin cannot be in the past';
  const adults = Number(data.adults);
  const children = Number(data.children);
  if (!Number.isInteger(adults) || adults < 1) return 'invalid adults count';
  if (!Number.isInteger(children) || children < 0) return 'invalid children count';
  if (adults + children > MAX_GUESTS) return 'too many guests';
  if (children > 0) {
    // Booking-style: one age (0–17) per child, not just a headcount — lets
    // Francesco see at a glance whether a crib/high chair request (the
    // extras below) actually matches an infant/toddler in the party.
    if (!Array.isArray(data.children_ages) || data.children_ages.length !== children) return 'invalid children ages';
    if (!data.children_ages.every((age) => Number.isInteger(age) && age >= 0 && age <= MAX_CHILD_AGE)) return 'invalid children ages';
  }
  if (data.message && (typeof data.message !== 'string' || data.message.length > MAX_MESSAGE_LEN)) return 'message too long';
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

async function sendNotification(env: Env, data: Submission, country: string, id: number) {
  const extras = [data.extra_breakfast ? 'Colazione' : null, data.extra_ebike ? 'Noleggio e-bike' : null]
    .filter(Boolean)
    .join(' + ');

  const lines = [
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    `Telefono: ${data.phone || '-'}`,
    `Check-in: ${data.checkin}`,
    `Check-out: ${data.checkout}`,
    data.children > 0
      ? `Ospiti: ${data.adults} adulti + ${data.children} bambini (età: ${(data.children_ages ?? []).join(', ')})`
      : `Ospiti: ${data.guests}`,
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
      html: buildNotificationHtml(data, id, country, translation)
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
    `SELECT name, email, message, locale, checkin_display, checkin_iso, checkout_display, checkout_iso, guests, adults, children, children_ages, extra_breakfast, extra_ebike
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
      adults: number | null;
      children: number | null;
      children_ages: string | null;
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
    // Older rows (saved before this column existed) have adults = NULL —
    // fall back to the plain guest total so the draft page still works for
    // them instead of showing "0 adulti".
    adults: row.adults ?? row.guests,
    children: row.children ?? 0,
    children_ages: row.children_ages ? JSON.parse(row.children_ages) : undefined,
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
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

    // Authoritative headcount, computed server-side rather than trusting
    // whatever total the client happened to send in `guests` — adults and
    // children are the fields validate() actually checked above, so they're
    // the source of truth `guests` (kept around for the templates that only
    // care about a plain headcount) gets derived from.
    const adults = Number(data.adults) || 1;
    const children = Number(data.children) || 0;
    data.guests = adults + children;
    data.adults = adults;
    data.children = children;

    try {
      const result = await env.DB.prepare(
        `INSERT INTO submissions
          (created_at, name, email, phone, checkin_display, checkin_iso, checkout_display, checkout_iso,
           guests, adults, children, children_ages, extra_breakfast, extra_ebike, source, message, locale, status, is_spam, cf_country, token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)`
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
          data.guests,
          data.adults,
          data.children,
          children > 0 && Array.isArray(data.children_ages) ? JSON.stringify(data.children_ages) : null,
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
      // part that must never silently fail, and the only part the guest's
      // response should wait on. The notification email is a secondary
      // effect that talks to mailbox.org over a hand-rolled SMTP session
      // (smtp.ts) with real network latency and no way to know in advance
      // how long a given send will take. It used to be awaited right here,
      // meaning the guest's "Invio in corso..." spinner was actually
      // waiting on that whole SMTP round-trip — any slowness talking to
      // mailbox.org read as the form "freezing". ctx.waitUntil keeps the
      // Worker alive to finish the email after the response has already
      // gone out, so the guest gets confirmed instantly once their request
      // is safely in the database, and a slow/stuck send no longer blocks
      // them at all.
      //
      // Bots that trip the honeypot get a normal-looking success response
      // (so the script has no signal its submission was rejected) but no
      // notification email — same principle the old client-side-only
      // honeypot already used, now enforced server-side too.
      if (!spam) {
        ctx.waitUntil(
          sendNotification(env, data as Submission, country, Number(result.meta.last_row_id)).catch((err) => {
            console.error('notification email failed (submission was still saved)', err);
            // This is the case most worth an alert: a real guest request
            // exists in D1 but nobody was told — without this, it would sit
            // unnoticed until someone happened to check the database.
            return sendAlert(
              env,
              'Notifica non inviata per una richiesta salvata',
              `La richiesta #${result.meta.last_row_id} (${data.name ?? '-'}, ${data.email ?? '-'}) e' stata salvata correttamente ma l'email di notifica non e' partita.\n\nErrore: ${err instanceof Error ? err.message : String(err)}\n\nControlla la riga nel database: SELECT * FROM submissions WHERE id = ${result.meta.last_row_id}`
            );
          })
        );

        // Best-effort receipt to the guest themselves, in the language of
        // the site they wrote from — see guest-receipt.ts for why this has
        // no bounce/retry handling and no alert-on-failure by design (only
        // a server log): unlike the notification above, a guest email
        // that never arrives isn't a broken business process, since the
        // guest still saw the on-screen success confirmation either way.
        ctx.waitUntil(
          (async () => {
            const receipt = buildGuestReceipt(data as Submission);
            await sendMail(
              { host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, password: env.SMTP_PASSWORD },
              {
                from: NOTIFY_TO,
                fromName: 'Ironwood Livigno',
                to: data.email as string,
                subject: receipt.subject,
                text: receipt.text,
                html: receipt.html
              }
            );
          })().catch((err) => {
            console.error('guest receipt email failed', err);
          })
        );
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

  // Two independent schedules share this handler (see wrangler.jsonc
  // triggers.crons) — controller.cron tells them apart.
  async scheduled(controller: ScheduledController, env: Env): Promise<void> {
    if (controller.cron === '0 3 1 * *') {
      // Monthly retention sweep. Keeps the dataset from growing forever —
      // 24 months comfortably covers a vacation-rental's typical
      // rebooking/reference window without holding guest contact data
      // indefinitely.
      await env.DB.prepare(`DELETE FROM submissions WHERE created_at < datetime('now', ?)`)
        .bind(`-${RETENTION_MONTHS} months`)
        .run();
      return;
    }

    // Daily SMTP connectivity check. Every other alert in this Worker only
    // fires as a side effect of a real submission — during a quiet spell
    // with no bookings, a broken mailbox.org connection would otherwise go
    // unnoticed until the next real guest is affected. This proactively
    // exercises the exact same connect/TLS/auth path sendMail() uses, just
    // without sending anything, and alerts (over that same path — the one
    // failure mode this can't catch is mailbox.org being fully
    // unreachable, a known, accepted limit with no independent channel)
    // the moment it stops working.
    try {
      await checkSmtpConnection({ host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, password: env.SMTP_PASSWORD });
    } catch (err) {
      console.error('SMTP health check failed', err);
      await sendAlert(
        env,
        'Controllo di connessione SMTP fallito',
        `Il controllo giornaliero di connessione a ${SMTP_HOST} non è riuscito.\n\nErrore: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
} satisfies ExportedHandler<Env>;
