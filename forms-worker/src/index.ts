// Ironwood Livigno — form submission backend.
//
// Replaces Web3Forms (a third-party SaaS the site used to POST directly to)
// with a small Cloudflare-native service the site owner fully controls: D1
// for durable storage, the native send_email binding for the internal
// notification, and the native ratelimit binding for abuse protection.
// Deliberately NOT Formlander (the self-hosted project originally
// requested) — Formlander needs a real persistent filesystem for its
// SQLite file, which Cloudflare Containers cannot give it (container disk
// is ephemeral there); this rebuilds the same outcome — self-owned data,
// no third-party SaaS, ready for a future booking-system webhook — on
// primitives that are actually durable on this platform.
//
// No secrets anywhere: D1/send_email/ratelimit are Worker bindings,
// authenticated implicitly by the deployment itself. Unlike the old
// Web3Forms integration, there is no access key sitting in client-side JS.

export interface Env {
  DB: D1Database;
  EMAIL: SendEmail;
  FORM_RATE_LIMITER: RateLimit;
}

const ALLOWED_ORIGIN = 'https://ironwoodlivigno.com';
const NOTIFY_TO = 'info@ironwoodlivigno.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_MESSAGE_LEN = 2000;
const RETENTION_MONTHS = 24;

type Submission = {
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
  if (!data.email?.trim() || !EMAIL_RE.test(data.email.trim())) return 'invalid email';
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

async function sendNotification(env: Env, data: Submission, country: string) {
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

  // Built as a raw MIME message rather than the createMimeMessage() helper
  // shown in Cloudflare's docs, to avoid pulling in the extra
  // `mimetext` dependency for what is a single plain-text email.
  const raw = [
    `From: Ironwood Livigno <${NOTIFY_TO}>`,
    `To: ${NOTIFY_TO}`,
    `Reply-To: ${data.email}`,
    `Subject: Richiesta disponibilità — Ironwood Livigno`,
    'MIME-Version: 1.0',
    `Content-Type: text/plain; charset="UTF-8"`,
    'Content-Transfer-Encoding: 7bit',
    '',
    lines.join('\n')
  ].join('\r\n');

  const { EmailMessage } = await import('cloudflare:email');
  const message = new EmailMessage(NOTIFY_TO, NOTIFY_TO, raw);
  await env.EMAIL.send(message);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

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

    try {
      const result = await env.DB.prepare(
        `INSERT INTO submissions
          (created_at, name, email, phone, checkin_display, checkin_iso, checkout_display, checkout_iso,
           guests, extra_breakfast, extra_ebike, source, message, locale, status, is_spam, cf_country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`
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
          country
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
          await sendNotification(env, data as Submission, country);
        } catch (err) {
          console.error('notification email failed (submission was still saved)', err);
        }
      }

      return json({ ok: true, id: result.meta.last_row_id }, 200, origin);
    } catch (err) {
      // Never leak stack traces, D1 error text, or binding details to the
      // client — log server-side (Workers Logs) and return a generic error.
      console.error('submission failed', err);
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
