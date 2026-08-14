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
import { buildNotificationHtml, buildBlankReplyText, buildOutboundEmailHtml, nightsBetween, renderReplyEditorPage, renderReplySentPage } from './email-template';
import { translateMessageToItalian } from './translate';
import { draftReply } from './draft';
import { replyLabelsFor, formatGuestsSentence } from './reply-labels';
import { buildGuestReceipt } from './guest-receipt';
import { quickReplyText } from './quick-replies';
import { checkPassword, createSessionCookie, clearSessionCookie, hasValidSession } from './auth';
import { validate, isSpam } from './validation';
import {
  STATUS_FOR_KIND,
  isStatusFilter,
  fetchStatusCounts,
  fetchSubmissions,
  fetchSubmissionById,
  fetchOverlappingConfirmed,
  rowToSubmission,
  renderDashboardPage,
  renderLoginPage,
  type StatusFilter,
  type DetailView
} from './admin';

export interface Env {
  DB: D1Database;
  BACKUPS: R2Bucket;
  FORM_RATE_LIMITER: RateLimit;
  ADMIN_LOGIN_RATE_LIMITER: RateLimit;
  AI: Ai;
  SMTP_PASSWORD: string;
  // Shared password for the /admin dashboard, and the key used to sign its
  // session cookie (see auth.ts) — deliberately two separate secrets, so
  // rotating the login password alone doesn't also invalidate anything
  // relying on the signing key having stayed the same.
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_SECRET: string;
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
const RETENTION_MONTHS = 24;

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
    `Ospiti: ${formatGuestsSentence(replyLabelsFor('it'), data.adults, data.children, data.children_ages)}`,
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
      html: buildNotificationHtml(data, id, country, translation, token)
    }
  );
}

function htmlPage(body: string, status = 200): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
}

// Shared row lookup for every /reply/:token/* route below — looks up the
// submission by its random token (not the sequential id, so this can't be
// enumerated by guessing numbers) and maps it back into a Submission, the
// same shape draftReply/quickReplyText/buildBlankReplyText all expect.
async function loadSubmissionByToken(env: Env, token: string): Promise<{ submission: Submission; nights: number | null } | null> {
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

  if (!row) return null;

  const submission: Submission = {
    name: row.name,
    email: row.email,
    checkin: row.checkin_display,
    checkin_iso: row.checkin_iso,
    checkout: row.checkout_display,
    checkout_iso: row.checkout_iso,
    guests: row.guests,
    // Older rows (saved before this column existed) have adults = NULL —
    // fall back to the plain guest total so this still works for them
    // instead of showing "0 adulti".
    adults: row.adults ?? row.guests,
    children: row.children ?? 0,
    children_ages: row.children_ages ? JSON.parse(row.children_ages) : undefined,
    extra_breakfast: Boolean(row.extra_breakfast),
    extra_ebike: Boolean(row.extra_ebike),
    message: row.message ?? undefined,
    locale: row.locale ?? undefined
  };
  return { submission, nights: nightsBetween(row.checkin_iso, row.checkout_iso) };
}

export type ReplyKind = 'available' | 'unavailable' | 'pending' | 'booking' | 'blank' | 'ai';

// Italian only — shown to Francesco on the editor page, never to the guest.
const REPLY_KIND_LABELS: Record<ReplyKind, string> = {
  available: '✓ Disponibile',
  unavailable: 'Non disponibile',
  pending: 'Confermiamo a breve',
  booking: '✓ Conferma prenotazione',
  blank: 'Risposta libera',
  ai: 'Bozza AI'
};

// GET /reply/:token/:kind — the editor page opened from one of the
// notification email's buttons (the 3 quick replies, "Rispondi", or
// "Genera bozza di risposta con l'AI"). Prefills the textarea for whichever
// kind was clicked; nothing is sent yet, that only happens on the POST
// below once Francesco has reviewed/edited it and hit "Invia".
async function handleReplyEditor(env: Env, token: string, kind: ReplyKind): Promise<Response> {
  const loaded = await loadSubmissionByToken(env, token);
  if (!loaded) return htmlPage(renderReplyEditorPage({ error: 'Richiesta non trovata.' }), 404);
  const { submission, nights } = loaded;
  const firstName = submission.name.trim().split(/\s+/)[0] || submission.name;

  if (kind === 'ai') {
    const draft = await draftReply(env.AI, submission, nights);
    if (!draft) {
      return htmlPage(renderReplyEditorPage({ error: 'Generazione della bozza non riuscita al momento. Riprova tra poco.' }), 200);
    }
    return htmlPage(
      renderReplyEditorPage({
        token,
        kind,
        kindLabel: `${REPLY_KIND_LABELS.ai} · ${draft.replyLanguageLabel}`,
        name: firstName,
        body: draft.replyText,
        italianText: draft.italianText
      })
    );
  }

  const body = kind === 'blank' ? buildBlankReplyText(submission, nights) : quickReplyText(submission, nights, kind);
  return htmlPage(renderReplyEditorPage({ token, kind, kindLabel: REPLY_KIND_LABELS[kind], name: firstName, body }));
}

// POST /reply/:token/send — sends whatever text Francesco ended up with
// (edited or not) directly from our own system, styled with the same
// branded HTML as the automatic receipt (buildOutboundEmailHtml) — this is
// what actually leaves the building; the GET editor above never sends
// anything on its own. Bcc'd to the business inbox so Francesco keeps a
// copy, since — unlike the old mailto: flow — this no longer goes out
// through his own mail client's Sent folder.
async function handleReplySend(request: Request, env: Env, token: string): Promise<Response> {
  const loaded = await loadSubmissionByToken(env, token);
  if (!loaded) return htmlPage(renderReplyEditorPage({ error: 'Richiesta non trovata.' }), 404);
  const { submission } = loaded;

  const form = await request.formData();
  const text = form.get('text');
  const kindLabel = form.get('kindLabel');
  const name = form.get('name');
  const kindRaw = form.get('kind');
  const kind: ReplyKind = typeof kindRaw === 'string' && kindRaw in STATUS_FOR_KIND ? (kindRaw as ReplyKind) : 'blank';
  // Only ever redirects back into our own /admin dashboard — never an
  // arbitrary external URL — since this value round-trips through a hidden
  // form field an attacker could otherwise substitute to build an open
  // redirect off this domain.
  const returnToRaw = form.get('returnTo');
  const returnTo = typeof returnToRaw === 'string' && returnToRaw.startsWith('/admin') ? returnToRaw : undefined;
  const echoBack = {
    token,
    kind,
    kindLabel: typeof kindLabel === 'string' && kindLabel ? kindLabel : 'Risposta',
    name: typeof name === 'string' && name ? name : submission.name,
    returnTo
  };

  if (typeof text !== 'string' || !text.trim()) {
    return htmlPage(renderReplyEditorPage({ ...echoBack, body: typeof text === 'string' ? text : '', sendError: 'Il messaggio non può essere vuoto.' }), 400);
  }
  if (text.length > 8000) {
    return htmlPage(renderReplyEditorPage({ ...echoBack, body: text, sendError: 'Messaggio troppo lungo.' }), 400);
  }

  try {
    await sendMail(
      { host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, password: env.SMTP_PASSWORD },
      {
        from: NOTIFY_TO,
        fromName: 'Ironwood Livigno',
        to: submission.email,
        bcc: NOTIFY_TO,
        subject: replyLabelsFor(submission.locale).subject,
        text,
        html: buildOutboundEmailHtml(text, submission.locale)
      }
    );
  } catch (err) {
    console.error('reply send failed', err);
    return htmlPage(
      renderReplyEditorPage({ ...echoBack, body: text, sendError: "Invio non riuscito. Riprova, oppure copia il testo e invialo dal tuo client di posta." }),
      502
    );
  }

  // Best-effort: the reply itself already went out above, so a failure here
  // only means the dashboard's status filter is stale for this one request,
  // never a reason to tell Francesco the send itself failed.
  try {
    await env.DB.prepare(`UPDATE submissions SET status = ? WHERE token = ?`).bind(STATUS_FOR_KIND[kind], token).run();
  } catch (err) {
    console.error('status update after reply send failed', err);
  }

  if (returnTo) {
    const url = new URL(request.url);
    const separator = returnTo.includes('?') ? '&' : '?';
    return Response.redirect(`${url.origin}${returnTo}${separator}sent=1`, 302);
  }

  return htmlPage(renderReplySentPage(submission.email));
}

// Builds the compose panel embedded in a dashboard detail view — same
// prefill logic handleReplyEditor already uses for the standalone
// /reply/:token/:kind page (quick-reply template, blank quoted request, or
// an AI draft), just returning data for admin.ts to render inline instead
// of a full page of its own.
async function buildAdminDetail(env: Env, row: NonNullable<Awaited<ReturnType<typeof fetchSubmissionById>>>, kindParam: string | null): Promise<DetailView> {
  const submission = rowToSubmission(row);
  const nights = nightsBetween(row.checkin_iso, row.checkout_iso);
  const kind: ReplyKind = kindParam && kindParam in REPLY_KIND_LABELS ? (kindParam as ReplyKind) : 'blank';
  const conflicts = await fetchOverlappingConfirmed(env.DB, row);

  if (kind === 'ai') {
    const draft = await draftReply(env.AI, submission, nights);
    if (!draft) {
      return { row, nights, kind, body: '', aiError: 'Generazione della bozza non riuscita al momento. Riprova tra poco.', conflicts };
    }
    return { row, nights, kind, body: draft.replyText, italianText: draft.italianText, conflicts };
  }

  const body = kind === 'blank' ? buildBlankReplyText(submission, nights) : quickReplyText(submission, nights, kind);
  return { row, nights, kind, body, conflicts };
}

async function handleAdminDashboard(env: Env, url: URL): Promise<Response> {
  const statusParam = url.searchParams.get('status') || 'all';
  const activeStatus: StatusFilter = isStatusFilter(statusParam) ? statusParam : 'all';
  const q = url.searchParams.get('q') || '';
  const openParam = url.searchParams.get('open');
  const selectedId = openParam && /^\d+$/.test(openParam) ? Number(openParam) : undefined;
  const sent = url.searchParams.get('sent') === '1';
  const pageParam = url.searchParams.get('page');
  const page = pageParam && /^\d+$/.test(pageParam) ? Number(pageParam) : 1;

  const [counts, { rows, hasMore }] = await Promise.all([fetchStatusCounts(env.DB), fetchSubmissions(env.DB, activeStatus, q, page)]);

  let detail: DetailView | null = null;
  if (selectedId !== undefined) {
    const row = await fetchSubmissionById(env.DB, selectedId);
    if (row) detail = await buildAdminDetail(env, row, url.searchParams.get('kind'));
  }

  return htmlPage(renderDashboardPage({ counts, rows, activeStatus, q, page, hasMore, selectedId, detail, sent }));
}

async function handleAdminLogin(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { success } = await env.ADMIN_LOGIN_RATE_LIMITER.limit({ key: ip });
  if (!success) {
    return htmlPage(renderLoginPage('Troppi tentativi. Riprova tra un minuto.'), 429);
  }

  const form = await request.formData();
  const password = form.get('password');
  if (typeof password !== 'string' || !password || !(await checkPassword(password, env.ADMIN_PASSWORD))) {
    return htmlPage(renderLoginPage('Password errata.'), 401);
  }

  return new Response(null, { status: 302, headers: { Location: '/admin', 'Set-Cookie': await createSessionCookie(env.ADMIN_SESSION_SECRET) } });
}

// POST /admin/delete/:id — permanent, no soft-delete/undo: the dashboard's
// own confirm() dialog (admin.ts) is the only guard between a click and the
// row being gone, same as the rest of this Worker favors simplicity over
// building out recovery machinery nothing has asked for yet.
async function handleAdminDelete(request: Request, env: Env, id: number): Promise<Response> {
  await env.DB.prepare(`DELETE FROM submissions WHERE id = ?`).bind(id).run();

  const form = await request.formData();
  const returnToRaw = form.get('returnTo');
  const returnTo = typeof returnToRaw === 'string' && returnToRaw.startsWith('/admin') ? returnToRaw : '/admin';
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}${returnTo}`, 302);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    // /reply/:token/:kind and /reply/:token/send — opened/submitted directly
    // in a browser from a button in the notification email (not an AJAX
    // call from the site), so no CORS/Origin check needed here.
    const replyEditMatch = /^\/reply\/([a-f0-9-]{36})\/(available|unavailable|pending|blank|ai)$/.exec(url.pathname);
    if (replyEditMatch && request.method === 'GET') {
      return handleReplyEditor(env, replyEditMatch[1], replyEditMatch[2] as ReplyKind);
    }
    const replySendMatch = /^\/reply\/([a-f0-9-]{36})\/send$/.exec(url.pathname);
    if (replySendMatch && request.method === 'POST') {
      return handleReplySend(request, env, replySendMatch[1]);
    }

    // /draft/:token — the old AI-draft link, kept as a redirect so
    // already-sent notification emails still sitting in Francesco's inbox
    // keep working after the AI draft flow merged into /reply/:token/ai.
    const draftMatch = /^\/draft\/([a-f0-9-]{36})$/.exec(url.pathname);
    if (draftMatch && request.method === 'GET') {
      return Response.redirect(`${url.origin}/reply/${draftMatch[1]}/ai`, 302);
    }

    // /admin — the dashboard (admin.ts) listing every request in one place,
    // and its own password-gated session (auth.ts). Opened directly in a
    // browser, same as /reply above, so no CORS/Origin check here either.
    if (url.pathname === '/admin/login' && request.method === 'GET') {
      return htmlPage(renderLoginPage());
    }
    if (url.pathname === '/admin/login' && request.method === 'POST') {
      return handleAdminLogin(request, env);
    }
    if (url.pathname === '/admin/logout' && request.method === 'POST') {
      return new Response(null, { status: 302, headers: { Location: '/admin/login', 'Set-Cookie': clearSessionCookie() } });
    }
    if (url.pathname === '/admin' && request.method === 'GET') {
      if (!(await hasValidSession(request, env.ADMIN_SESSION_SECRET))) {
        return Response.redirect(`${url.origin}/admin/login`, 302);
      }
      return handleAdminDashboard(env, url);
    }
    const adminDeleteMatch = /^\/admin\/delete\/(\d+)$/.exec(url.pathname);
    if (adminDeleteMatch && request.method === 'POST') {
      if (!(await hasValidSession(request, env.ADMIN_SESSION_SECRET))) {
        return Response.redirect(`${url.origin}/admin/login`, 302);
      }
      return handleAdminDelete(request, env, Number(adminDeleteMatch[1]));
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
          sendNotification(env, data as Submission, country, Number(result.meta.last_row_id), token).catch((err) => {
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
                // Same convention as the manual reply flow (handleReplySend)
                // — Francesco gets a copy of what actually went out under
                // his name, without it showing as a second recipient to the
                // guest.
                bcc: NOTIFY_TO,
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

  // Three independent schedules share this handler (see wrangler.jsonc
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

    if (controller.cron === '0 4 * * SUN') {
      // Weekly D1 → R2 backup. D1's own replication protects against
      // Cloudflare infrastructure failure, not against a bad migration or
      // an accidental DELETE with the wrong WHERE clause — this is the
      // independent copy that survives those. Every column, every row
      // (including spam-flagged ones — a backup that quietly excludes data
      // isn't a complete backup), so restoring from it needs no judgment
      // calls about what was left out.
      try {
        const { results } = await env.DB.prepare(`SELECT * FROM submissions ORDER BY id ASC`).all();
        const key = `submissions-${new Date().toISOString().slice(0, 10)}.json`;
        await env.BACKUPS.put(key, JSON.stringify(results), { httpMetadata: { contentType: 'application/json' } });
      } catch (err) {
        console.error('weekly R2 backup failed', err);
        await sendAlert(
          env,
          'Backup settimanale su R2 non riuscito',
          `L'esportazione settimanale della tabella submissions verso R2 non è andata a buon fine.\n\nErrore: ${err instanceof Error ? err.message : String(err)}`
        );
      }
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
