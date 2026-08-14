// The "Ironwood Desk" dashboard: a single, server-rendered view over the
// submissions D1 already stores, so Francesco doesn't have to work request
// by request from separate email links anymore. Deliberately no client-side
// framework or JSON API, same as the rest of this Worker (email-template.ts,
// index.ts) — every view is a full page render per request, master/detail
// navigation is plain links with query params (?status=&q=&open=&kind=),
// and the only client JS is the existing copy-to-clipboard snippet already
// used on the standalone reply-editor page. That keeps this dashboard
// testable with plain HTTP requests and gives it nothing new that could
// silently break independently of the pages already in production.
import type { ReplyKind, Submission } from './index';
import { FONT_DISPLAY, FONT_BODY, escapeHtml } from './email-template';

export type SubmissionRow = {
  id: number;
  token: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  checkin_display: string;
  checkout_display: string;
  checkin_iso: string;
  checkout_iso: string;
  guests: number;
  adults: number | null;
  children: number;
  children_ages: string | null;
  extra_breakfast: number;
  extra_ebike: number;
  source: string | null;
  message: string | null;
  locale: string | null;
  status: string;
  cf_country: string | null;
};

// What a sent reply turns the request's status into — the column already
// existed in schema.sql (default 'new') but nothing ever wrote to it until
// now; wiring it up here is what makes the dashboard's status filters mean
// anything; see handleReplySend in index.ts, the only place that writes it.
export const STATUS_FOR_KIND: Record<ReplyKind, string> = {
  available: 'confirmed',
  unavailable: 'declined',
  pending: 'pending',
  blank: 'replied',
  ai: 'replied'
};

// Duplicated from index.ts's REPLY_KIND_LABELS rather than imported —
// index.ts imports D1 query helpers from this module, so importing a value
// back the other way would be circular (same reasoning already used for
// PHOTOS_URL/FORMS_BASE_URL between email-template.ts and quick-replies.ts).
const REPLY_KIND_LABELS: Record<ReplyKind, string> = {
  available: '✓ Disponibile',
  unavailable: 'Non disponibile',
  pending: 'Confermiamo a breve',
  blank: 'Risposta libera',
  ai: 'Bozza AI'
};

const STATUS_META: Record<string, { label: string; cssClass: string }> = {
  new: { label: 'Nuova', cssClass: 'new' },
  pending: { label: 'In attesa', cssClass: 'pending' },
  confirmed: { label: 'Confermata', cssClass: 'confirmed' },
  declined: { label: 'Non disponibile', cssClass: 'declined' },
  replied: { label: 'Risposta inviata', cssClass: 'replied' }
};

const STATUS_FILTERS = ['all', 'new', 'pending', 'confirmed', 'declined', 'replied'] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];
export function isStatusFilter(value: string): value is StatusFilter {
  return (STATUS_FILTERS as readonly string[]).includes(value);
}

const STATUS_NAV_LABELS: Record<StatusFilter, string> = {
  all: 'Tutte',
  new: 'Nuove',
  pending: 'In attesa',
  confirmed: 'Confermate',
  declined: 'Non disponibili',
  replied: 'Risposte inviate'
};

// ---------- D1 queries ----------

const ROW_COLUMNS = `id, token, created_at, name, email, phone, checkin_display, checkout_display, checkin_iso, checkout_iso,
   guests, adults, children, children_ages, extra_breakfast, extra_ebike, source, message, locale, status, cf_country`;

export async function fetchStatusCounts(db: D1Database): Promise<Record<string, number>> {
  const { results } = await db.prepare(`SELECT status, COUNT(*) as n FROM submissions WHERE is_spam = 0 GROUP BY status`).all<{
    status: string;
    n: number;
  }>();
  const counts: Record<string, number> = { all: 0 };
  for (const row of results ?? []) {
    counts[row.status] = row.n;
    counts.all += row.n;
  }
  return counts;
}

export const PAGE_SIZE = 50;

export async function fetchSubmissions(
  db: D1Database,
  status: StatusFilter,
  q: string,
  page: number
): Promise<{ rows: SubmissionRow[]; hasMore: boolean }> {
  let sql = `SELECT ${ROW_COLUMNS} FROM submissions WHERE is_spam = 0`;
  const binds: unknown[] = [];
  if (status !== 'all') {
    sql += ' AND status = ?';
    binds.push(status);
  }
  const term = q.trim();
  if (term) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    binds.push(`%${term}%`, `%${term}%`);
  }
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  // Fetch one extra row instead of a separate COUNT(*) query — enough to
  // know whether a "Successivo" page exists without a second round-trip,
  // then trimmed back down to PAGE_SIZE before returning.
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  binds.push(PAGE_SIZE + 1, (safePage - 1) * PAGE_SIZE);
  const { results } = await db
    .prepare(sql)
    .bind(...binds)
    .all<SubmissionRow>();
  const rows = results ?? [];
  return { rows: rows.slice(0, PAGE_SIZE), hasMore: rows.length > PAGE_SIZE };
}

export async function fetchSubmissionById(db: D1Database, id: number): Promise<SubmissionRow | null> {
  const row = await db
    .prepare(`SELECT ${ROW_COLUMNS} FROM submissions WHERE id = ? AND is_spam = 0`)
    .bind(id)
    .first<SubmissionRow>();
  return row ?? null;
}

// Other non-spam requests already marked 'confirmed' whose stay overlaps
// this one's — the half-open-interval check (checkin < otherCheckout AND
// otherCheckin < checkout) treats checkout day as a same-day changeover,
// same convention every booking calendar uses, so a checkout and the next
// checkin on the same date don't falsely flag as a conflict. This only
// warns; nothing here blocks marking a request "Disponibile" — Francesco
// still decides, the dashboard just makes sure he isn't doing it blind.
export async function fetchOverlappingConfirmed(db: D1Database, row: SubmissionRow): Promise<SubmissionRow[]> {
  const { results } = await db
    .prepare(`SELECT ${ROW_COLUMNS} FROM submissions WHERE is_spam = 0 AND status = 'confirmed' AND id != ? AND checkin_iso < ? AND ? < checkout_iso`)
    .bind(row.id, row.checkout_iso, row.checkin_iso)
    .all<SubmissionRow>();
  return results ?? [];
}

export function rowToSubmission(row: SubmissionRow): Submission {
  return {
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    checkin: row.checkin_display,
    checkin_iso: row.checkin_iso,
    checkout: row.checkout_display,
    checkout_iso: row.checkout_iso,
    guests: row.guests,
    adults: row.adults ?? row.guests,
    children: row.children ?? 0,
    children_ages: row.children_ages ? JSON.parse(row.children_ages) : undefined,
    extra_breakfast: Boolean(row.extra_breakfast),
    extra_ebike: Boolean(row.extra_ebike),
    source: row.source ?? undefined,
    message: row.message ?? undefined,
    locale: row.locale ?? undefined
  };
}

// ---------- rendering ----------

const STYLES = `
  :root {
    --bg: #F7F3EC; --surface: #FFFFFF; --surface-2: #FBF1E7; --surface-inset: #F2E9DC;
    --border: #EAD9BE; --border-soft: #EFE6D8;
    --text: #241C15; --text-muted: rgba(36,28,21,.60); --text-faint: rgba(36,28,21,.42);
    --accent: #A8462F; --accent-contrast: #FFFFFF; --accent-soft: rgba(168,70,47,.10);
    --gold: #C9A059; --gold-ink: #8A6B2E; --gold-soft: rgba(201,160,89,.18);
    --green: #4F6B45; --green-soft: rgba(79,107,69,.14);
    --slate: #4F6E86; --slate-soft: rgba(79,110,134,.14);
    --grey-soft: rgba(36,28,21,.08);
    --sidebar-bg: #241C15; --sidebar-text: #F2EAE0; --sidebar-text-muted: rgba(242,234,224,.55);
    --sidebar-active-bg: rgba(201,160,89,.16); --sidebar-border: rgba(242,234,224,.10);
    --danger: #B3241C; --danger-soft: rgba(179,36,28,.08);
    --font-display: ${FONT_DISPLAY}; --font-body: ${FONT_BODY};
    --font-mono: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
  button, input, textarea { font-family: inherit; color: inherit; }
  a { color: var(--accent); }
  .app-scroll { overflow-x: auto; }
  .app { display: grid; grid-template-columns: 240px 360px minmax(460px, 1fr); min-width: 1080px; min-height: 100vh; }

  .sidebar { background: var(--sidebar-bg); color: var(--sidebar-text); display: flex; flex-direction: column; padding: 34px 22px; gap: 38px; }
  .brand { padding: 0 8px; }
  .brand-eyebrow { margin: 0; font-size: 10px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); }
  .brand-name { margin: 9px 0 0; font-family: var(--font-display); font-size: 22px; }
  .nav { display: flex; flex-direction: column; gap: 5px; }
  .nav-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-radius: 10px;
    text-decoration: none; font-size: 13.5px; color: var(--sidebar-text); opacity: .82; }
  .nav-item:hover { background: rgba(242,234,224,.06); opacity: 1; }
  .nav-item.active { background: var(--sidebar-active-bg); opacity: 1; font-weight: 600; }
  .nav-item .count { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: 11.5px; color: var(--sidebar-text-muted); }
  .nav-item.active .count { color: var(--gold); }
  .sidebar-foot { margin-top: auto; padding: 20px 12px 0; border-top: 1px solid var(--sidebar-border); font-size: 11.5px; color: var(--sidebar-text-muted); }
  .sidebar-foot form { margin-top: 10px; }
  .logout-btn { background: none; border: none; color: var(--sidebar-text-muted); font-size: 11.5px; text-decoration: underline; cursor: pointer; padding: 0; }

  .list-pane { border-right: 1px solid var(--border-soft); display: flex; flex-direction: column; min-width: 0; }
  .list-head { padding: 28px 26px 20px; border-bottom: 1px solid var(--border-soft); }
  .list-head h1 { margin: 0 0 18px; font-family: var(--font-display); font-size: 20px; font-weight: 400; }
  .search { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border-soft); }
  .search input { border: none; background: transparent; outline: none; font-size: 13px; color: var(--text); width: 100%; }
  .search input::placeholder { color: var(--text-faint); }
  .list { overflow-y: auto; flex: 1; }
  .row { display: block; padding: 19px 26px; border-bottom: 1px solid var(--border-soft); text-decoration: none; color: inherit; position: relative; }
  .row:hover { background: var(--surface-2); }
  .row.selected { background: var(--accent-soft); }
  .row.selected::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); }
  .row-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .row-name { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .row-name span.n { font-family: var(--font-display); font-size: 15.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row.unread .row-name span.n { font-weight: 700; }
  .dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }
  .row-time { font-size: 11px; color: var(--text-faint); font-family: var(--font-mono); flex: none; }
  .row-meta { margin-top: 8px; font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .row-meta .dates { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  .row-bottom { margin-top: 12px; display: flex; align-items: center; gap: 8px; }
  .pill { font-size: 10.5px; font-weight: 700; letter-spacing: .02em; padding: 4px 10px; border-radius: 999px; display: inline-block; }
  .pill.new { background: var(--gold-soft); color: var(--gold-ink); }
  .pill.pending { background: var(--gold-soft); color: var(--gold-ink); }
  .pill.confirmed { background: var(--green-soft); color: var(--green); }
  .pill.declined { background: var(--grey-soft); color: var(--text-muted); }
  .pill.replied { background: var(--slate-soft); color: var(--slate); }
  .extra-icon { font-size: 12px; opacity: .7; }
  .locale-tag { font-size: 10.5px; color: var(--text-faint); font-family: var(--font-mono); text-transform: uppercase; margin-left: auto; }
  .empty-list { padding: 40px 26px; color: var(--text-faint); font-size: 13.5px; }
  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 26px; border-top: 1px solid var(--border-soft); }
  .page-btn { font-size: 12.5px; font-weight: 600; color: var(--accent); text-decoration: none; }
  .page-btn:hover { text-decoration: underline; }
  .page-num { font-size: 11.5px; color: var(--text-faint); font-family: var(--font-mono); }

  .detail-pane { overflow-y: auto; background: var(--surface-2); }
  .detail-inner { max-width: 660px; padding: 44px 52px 84px; }
  .empty-detail { max-width: 420px; margin: 80px auto; text-align: center; color: var(--text-faint); font-size: 14px; }
  .detail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .detail-head h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: 28px; }
  .ref { font-family: var(--font-mono); font-size: 11.5px; color: var(--text-faint); margin-top: 6px; }
  .contact-line { margin-top: 16px; display: flex; gap: 18px; flex-wrap: wrap; font-size: 12.5px; color: var(--text-muted); }
  .contact-line a { text-decoration: none; }
  .contact-line a:hover { text-decoration: underline; }
  .sent-flag { margin: 24px 0 0; padding: 12px 16px; background: var(--green-soft); color: var(--green); border-radius: 10px; font-size: 13px; font-weight: 600; }

  /* Amber, not the delete zone's red — this only warns (another confirmed
     request already claims these dates), it never blocks the click. */
  .conflict-warning { margin: 0 0 28px; padding: 16px 20px; background: var(--gold-soft); border: 1px solid var(--gold); border-radius: 14px; }
  .conflict-title { margin: 0; font-size: 13px; font-weight: 700; color: var(--gold-ink); }
  .conflict-body { margin: 6px 0 0; font-size: 12.5px; color: var(--text-muted); }
  .conflict-list { margin: 6px 0 0; padding-left: 18px; font-size: 13px; color: var(--text); }
  .conflict-list li { margin-top: 2px; }

  /* Every part of the detail view below the header is its own physically
     separate card on the mist-colored pane background, rather than one
     continuous block divided only by rules — a request's date range,
     message, and reply tools now read as distinct panels you look at one
     at a time, not one long form. */
  .detail-sections { margin-top: 40px; display: flex; flex-direction: column; gap: 28px; }
  .section-card { background: var(--surface); border: 1px solid var(--border-soft); border-radius: 18px; padding: 30px 32px; box-shadow: 0 2px 10px rgba(36,28,21,.03); }

  .stay-box { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; background: var(--surface-2);
    border: 1px solid var(--border-soft); border-radius: 14px; padding: 22px 16px; }
  .stay-cell { text-align: center; }
  .stay-cell .lbl { font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text-faint); margin: 0; }
  .stay-cell .val { margin: 7px 0 0; font-family: var(--font-display); font-size: 17px; }
  .nights-badge { background: var(--accent); color: var(--accent-contrast); border-radius: 999px; padding: 5px 13px; font-size: 11px; font-weight: 700; font-family: var(--font-mono); }

  .extras-row { margin-top: 22px; display: flex; gap: 10px; flex-wrap: wrap; }
  .extra-pill { background: var(--gold); color: #241C15; border-radius: 999px; padding: 7px 15px; font-size: 12px; font-weight: 700; }

  .detail-grid { margin-top: 22px; }
  .detail-grid .drow { display: grid; grid-template-columns: 130px 1fr; padding: 13px 0; border-top: 1px solid var(--border-soft); font-size: 13.5px; }
  .detail-grid .drow:first-child { border-top: none; padding-top: 0; }
  .detail-grid .drow .k { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--text-faint); font-weight: 600; }

  .msg-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); margin: 0 0 12px; }
  .msg-box { background: var(--surface-2); border: 1px solid var(--border-soft); border-left: 4px solid var(--accent); border-radius: 12px;
    padding: 19px 22px; font-size: 14.5px; line-height: 1.65; }

  .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-faint); margin: 0 0 14px; }
  .qr-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .qr-btn { border-radius: 999px; padding: 10px 18px; font-size: 13px; font-weight: 600; background: var(--surface); text-decoration: none; display: inline-block; border: 1px solid var(--border); color: var(--text); }
  .qr-btn.available { border-color: var(--accent); color: var(--accent); }
  .qr-btn.unavailable { border-color: var(--text-muted); color: var(--text-muted); }
  .qr-btn.pending { border-color: var(--gold); color: var(--gold-ink); }
  .qr-btn.active { background: var(--text); color: var(--bg); border-color: var(--text); }

  textarea.reply-body { width: 100%; min-height: 210px; box-sizing: border-box; padding: 18px 20px; border-radius: 14px; border: 1px solid var(--border);
    background: var(--surface-inset); font-family: var(--font-body); font-size: 14.5px; color: var(--text); line-height: 1.65; resize: vertical; }
  textarea.reply-body:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .compose-actions { margin-top: 16px; display: flex; align-items: center; gap: 14px; }
  .btn { cursor: pointer; border-radius: 999px; padding: 12px 22px; font-size: 13.5px; font-weight: 600; border: 1px solid var(--border); }
  .btn.ghost { background: var(--surface); color: var(--text); }
  .btn.primary { background: var(--accent); color: var(--accent-contrast); border-color: var(--accent); }
  .btn.danger { background: var(--surface); color: var(--danger); border-color: var(--danger); }
  .btn.danger:hover { background: var(--danger-soft); }
  .compose-note { font-size: 11.5px; color: var(--text-faint); margin: 14px 0 0; line-height: 1.6; }
  .ai-error { margin: 0 0 16px; padding: 12px 16px; background: var(--accent-soft); color: var(--accent); border-radius: 10px; font-size: 13px; }

  /* Set apart from the rest of the reply tools by extra distance, not just
     a different color — reaching the delete action should take a
     deliberate scroll, not be one click away from "invia". */
  .danger-card { margin-top: 12px; border-color: var(--danger-soft); }
  .danger-card .section-label { color: var(--danger); }
  .danger-card p.hint { margin: 0 0 18px; font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .back-link { display: none; }

  /* Below ~900px the three-column desk stops fitting side by side. Nothing
     gets hidden the way an icon-only sidebar would — the status filters
     become a horizontally-scrollable strip instead of a vertical list (all
     still one tap away), and list/detail stack full-width, showing
     whichever one the URL's ?open= already points at (a "← Richieste" link
     is the way back, the same server-rendered navigation this whole
     dashboard already uses everywhere else, no client state to keep in
     sync). */
  @media (max-width: 900px) {
    .app-scroll { overflow-x: visible; }
    .app { grid-template-columns: 1fr; min-width: 0; }
    .sidebar { flex-direction: row; align-items: center; padding: 14px 18px; gap: 18px; overflow-x: auto; }
    .brand { padding: 0; flex: none; }
    .brand-eyebrow { display: none; }
    .brand-name { margin: 0; font-size: 17px; }
    .nav { flex-direction: row; gap: 6px; flex: none; }
    .nav-item { padding: 8px 12px; white-space: nowrap; }
    .sidebar-foot { display: none; }

    .list-pane { border-right: none; }
    .app.has-detail .list-pane { display: none; }
    .app:not(.has-detail) .detail-pane { display: none; }

    .detail-inner { padding: 28px 20px 60px; }
    .back-link { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 22px; color: var(--accent); text-decoration: none; font-size: 13px; font-weight: 600; }
  }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .login-card { width: 100%; max-width: 360px; background: var(--surface); border-radius: 20px; box-shadow: 0 20px 50px -24px rgba(36,28,21,.35); overflow: hidden; }
  .login-head { background: var(--sidebar-bg); padding: 28px 32px; }
  .login-head p { margin: 0; color: var(--gold); font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; }
  .login-body { padding: 32px; }
  .login-body label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
  .login-body input { width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface-2); font-size: 14px; }
  .login-body input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .login-error { margin: 0 0 16px; padding: 12px 14px; background: var(--accent-soft); color: var(--accent); border-radius: 10px; font-size: 13px; }
  .login-body button { margin-top: 18px; width: 100%; }
`;

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} — Ironwood Desk</title>
    <style>${STYLES}</style>
  </head>
  <body>${bodyHtml}</body>
</html>`;
}

export function renderLoginPage(error?: string): string {
  return shell(
    'Accedi',
    `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-head"><p>Ironwood Desk</p></div>
        <div class="login-body">
          ${error ? `<p class="login-error">${escapeHtml(error)}</p>` : ''}
          <form method="POST" action="/admin/login">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" autocomplete="current-password" autofocus>
            <button type="submit" class="btn primary">Accedi</button>
          </form>
        </div>
      </div>
    </div>`
  );
}

function buildQuery(params: { status: StatusFilter; q: string; open?: number; kind?: ReplyKind; page?: number }): string {
  const usp = new URLSearchParams();
  if (params.status !== 'all') usp.set('status', params.status);
  if (params.q) usp.set('q', params.q);
  if (params.open !== undefined) usp.set('open', String(params.open));
  if (params.kind) usp.set('kind', params.kind);
  if (params.page !== undefined && params.page > 1) usp.set('page', String(params.page));
  const s = usp.toString();
  return s ? `?${s}` : '';
}

function formatListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function renderSidebar(counts: Record<string, number>, activeStatus: StatusFilter, q: string): string {
  const items = STATUS_FILTERS.map((s) => {
    const active = s === activeStatus;
    const href = `/admin${buildQuery({ status: s, q: '' })}`;
    return `<a class="nav-item${active ? ' active' : ''}" href="${escapeHtml(href)}"><span>${STATUS_NAV_LABELS[s]}</span><span class="count">${counts[s] ?? 0}</span></a>`;
  }).join('');

  return `
    <aside class="sidebar">
      <div class="brand">
        <p class="brand-eyebrow">Ironwood Livigno</p>
        <p class="brand-name">Desk</p>
      </div>
      <nav class="nav">${items}</nav>
      <div class="sidebar-foot">
        <span>info@ironwoodlivigno.com</span>
        <form method="POST" action="/admin/logout"><button type="submit" class="logout-btn">Esci</button></form>
      </div>
    </aside>`;
}

function guestsLabel(row: SubmissionRow): string {
  const adults = row.adults ?? row.guests;
  if (row.children > 0) {
    const ages: number[] = row.children_ages ? JSON.parse(row.children_ages) : [];
    return `${adults} adulti + ${row.children} bambini${ages.length ? ` (età: ${ages.join(', ')})` : ''}`;
  }
  return `${adults} adulti`;
}

function renderRow(row: SubmissionRow, selectedId: number | undefined, activeStatus: StatusFilter, q: string, page: number): string {
  const meta = STATUS_META[row.status] ?? STATUS_META.new;
  const selected = row.id === selectedId;
  const extras =
    (row.extra_breakfast ? '<span class="extra-icon" title="Colazione">☕</span>' : '') +
    (row.extra_ebike ? '<span class="extra-icon" title="E-bike">🚲</span>' : '');
  const adults = row.adults ?? row.guests;
  const guestsShort = row.children > 0 ? `${adults} ad. + ${row.children} bimbi` : `${adults} adulti`;
  const href = `/admin${buildQuery({ status: activeStatus, q, open: row.id, page })}`;
  return `<a class="row${row.status === 'new' ? ' unread' : ''}${selected ? ' selected' : ''}" href="${escapeHtml(href)}">
      <div class="row-top">
        <div class="row-name"><span class="dot" style="background:${row.status === 'confirmed' ? 'var(--green)' : row.status === 'declined' ? 'var(--text-faint)' : row.status === 'replied' ? 'var(--slate)' : 'var(--gold)'}"></span><span class="n">${escapeHtml(row.name)}</span></div>
        <span class="row-time">${escapeHtml(formatListDate(row.created_at))}</span>
      </div>
      <div class="row-meta"><span class="dates">${escapeHtml(row.checkin_display)} → ${escapeHtml(row.checkout_display)}</span><span>· ${guestsShort}</span>${extras}</div>
      <div class="row-bottom"><span class="pill ${meta.cssClass}">${meta.label}</span>${row.locale ? `<span class="locale-tag">${escapeHtml(row.locale)}</span>` : ''}</div>
    </a>`;
}

export type DetailView = {
  row: SubmissionRow;
  nights: number | null;
  kind: ReplyKind;
  body: string;
  italianText?: string | null;
  aiError?: string | null;
  conflicts?: SubmissionRow[];
};

function renderDetail(detail: DetailView | null, activeStatus: StatusFilter, q: string, sent: boolean, page: number): string {
  if (!detail) {
    return `<div class="empty-detail">Seleziona una richiesta dalla lista per vederne il dettaglio e rispondere.</div>`;
  }
  const { row, nights, kind, body, italianText, aiError, conflicts } = detail;
  const meta = STATUS_META[row.status] ?? STATUS_META.new;
  const extras: string[] = [];
  if (row.extra_breakfast) extras.push('Colazione');
  if (row.extra_ebike) extras.push('Noleggio e-bike');
  const firstName = escapeHtml(row.name.trim().split(/\s+/)[0] || row.name);
  const returnTo = `/admin${buildQuery({ status: activeStatus, q, open: row.id, page })}`;

  const qrRow = (['available', 'unavailable', 'pending', 'blank', 'ai'] as ReplyKind[])
    .map((k) => {
      const active = k === kind;
      const cls = k === 'blank' || k === 'ai' ? '' : ` ${k}`;
      const href = `/admin${buildQuery({ status: activeStatus, q, open: row.id, kind: k, page })}`;
      return `<a class="qr-btn${cls}${active ? ' active' : ''}" href="${escapeHtml(href)}">${REPLY_KIND_LABELS[k]}</a>`;
    })
    .join('');

  const listReturnTo = `/admin${buildQuery({ status: activeStatus, q, page })}`;

  const conflictWarning =
    conflicts && conflicts.length > 0
      ? `<div class="conflict-warning">
      <p class="conflict-title">⚠ Date già confermate per un'altra richiesta</p>
      <p class="conflict-body">Si sovrappone a:</p>
      <ul class="conflict-list">
        ${conflicts
          .map(
            (c) =>
              `<li><strong>${escapeHtml(c.name)}</strong> — ${escapeHtml(c.checkin_display)} → ${escapeHtml(c.checkout_display)}</li>`
          )
          .join('')}
      </ul>
    </div>`
      : '';

  return `
    <a class="back-link" href="${escapeHtml(listReturnTo)}">← Richieste</a>
    ${conflictWarning}
    <div class="detail-head">
      <div>
        <h2>${escapeHtml(row.name)}</h2>
        <p class="ref">Richiesta #${row.id} · ${escapeHtml(row.source || 'Sito')}${row.cf_country ? ` · ${escapeHtml(row.cf_country)}` : ''}</p>
      </div>
      <span class="pill ${meta.cssClass}" style="font-size:11.5px;padding:5px 12px;">${meta.label}</span>
    </div>
    <div class="contact-line"><a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a>${row.phone ? `<a href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a>` : ''}</div>

    ${sent ? `<p class="sent-flag">✓ Risposta inviata a ${escapeHtml(row.email)}</p>` : ''}

    <div class="detail-sections">
      <div class="section-card">
        <div class="stay-box">
          <div class="stay-cell"><p class="lbl">Check-in</p><p class="val">${escapeHtml(row.checkin_display)}</p></div>
          <div class="stay-cell"><span class="nights-badge">${nights !== null ? `${nights} ${nights === 1 ? 'notte' : 'notti'}` : '→'}</span></div>
          <div class="stay-cell"><p class="lbl">Check-out</p><p class="val">${escapeHtml(row.checkout_display)}</p></div>
        </div>
        ${extras.length ? `<div class="extras-row">${extras.map((e) => `<span class="extra-pill">✓ ${escapeHtml(e)}</span>`).join('')}</div>` : ''}
        <div class="detail-grid">
          <div class="drow"><span class="k">Ospiti</span><span>${guestsLabel(row)}</span></div>
          ${row.locale ? `<div class="drow"><span class="k">Lingua sito</span><span>${escapeHtml(row.locale)}</span></div>` : ''}
        </div>
      </div>

      ${
        row.message
          ? `<div class="section-card">
        <p class="msg-label">✎ Nota di ${firstName}</p>
        <div class="msg-box">${escapeHtml(row.message).replace(/\n/g, '<br>')}</div>
      </div>`
          : ''
      }

      <div class="section-card">
        <p class="section-label">⚡ Risposte rapide</p>
        <div class="qr-row">${qrRow}</div>
      </div>

      <div class="section-card">
        <p class="section-label">Risposta</p>
        ${aiError ? `<p class="ai-error">${escapeHtml(aiError)}</p>` : ''}
        <form method="POST" action="/reply/${row.token}/send">
          <input type="hidden" name="kind" value="${kind}">
          <input type="hidden" name="kindLabel" value="${escapeHtml(REPLY_KIND_LABELS[kind])}">
          <input type="hidden" name="name" value="${firstName}">
          <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}">
          <textarea name="text" class="reply-body" id="replyBody">${escapeHtml(body)}</textarea>
          <div class="compose-actions">
            <button type="submit" class="btn primary">✉️ Invia al cliente →</button>
            <button type="button" class="btn ghost" id="copyBtn">📋 Copia testo</button>
          </div>
        </form>
        ${italianText ? `<p class="section-label" style="margin-top:22px;">Traduzione in italiano (per verifica)</p><div class="msg-box">${escapeHtml(italianText).replace(/\n/g, '<br>')}</div>` : ''}
        <p class="compose-note">Parte dal nostro sistema con lo stesso stile grafico della ricevuta automatica. Copia in copia nascosta a info@ironwoodlivigno.com.</p>
      </div>

      <div class="section-card danger-card">
        <p class="section-label">Zona pericolosa</p>
        <p class="hint">Elimina definitivamente questa richiesta dal sistema. L'azione non può essere annullata.</p>
        <form method="POST" action="/admin/delete/${row.id}" onsubmit="return confirm('Eliminare definitivamente questa richiesta? L\\'azione non può essere annullata.');">
          <input type="hidden" name="returnTo" value="${escapeHtml(listReturnTo)}">
          <button type="submit" class="btn danger">🗑 Elimina richiesta</button>
        </form>
      </div>
    </div>
    <script>
      (function () {
        var ta = document.getElementById('replyBody');
        var copyBtn = document.getElementById('copyBtn');
        if (!ta || !copyBtn) return;
        copyBtn.addEventListener('click', function () {
          navigator.clipboard.writeText(ta.value).then(function () {
            var original = copyBtn.textContent;
            copyBtn.textContent = 'Copiato ✓';
            setTimeout(function () { copyBtn.textContent = original; }, 1800);
          });
        });
      })();
    </script>`;
}

export function renderDashboardPage(params: {
  counts: Record<string, number>;
  rows: SubmissionRow[];
  activeStatus: StatusFilter;
  q: string;
  page: number;
  hasMore: boolean;
  selectedId?: number;
  detail: DetailView | null;
  sent: boolean;
}): string {
  const { counts, rows, activeStatus, q, page, hasMore, selectedId, detail, sent } = params;
  const listHtml = rows.length
    ? rows.map((r) => renderRow(r, selectedId, activeStatus, q, page)).join('')
    : `<div class="empty-list">Nessuna richiesta in questa vista.</div>`;

  const pagination =
    page > 1 || hasMore
      ? `<div class="pagination">
          ${page > 1 ? `<a class="page-btn" href="/admin${buildQuery({ status: activeStatus, q, page: page - 1 })}">← Precedente</a>` : '<span></span>'}
          <span class="page-num">Pagina ${page}</span>
          ${hasMore ? `<a class="page-btn" href="/admin${buildQuery({ status: activeStatus, q, page: page + 1 })}">Successivo →</a>` : '<span></span>'}
        </div>`
      : '';

  return shell(
    'Richieste',
    `
    <div class="app-scroll">
      <div class="app${detail ? ' has-detail' : ''}">
        ${renderSidebar(counts, activeStatus, q)}
        <section class="list-pane">
          <div class="list-head">
            <h1>Richieste</h1>
            <form class="search" method="GET" action="/admin">
              ${activeStatus !== 'all' ? `<input type="hidden" name="status" value="${activeStatus}">` : ''}
              <span>🔍</span>
              <input type="text" name="q" value="${escapeHtml(q)}" placeholder="Cerca per nome o email…">
            </form>
          </div>
          <div class="list">${listHtml}</div>
          ${pagination}
        </section>
        <section class="detail-pane">
          <div class="detail-inner">${renderDetail(detail, activeStatus, q, sent, page)}</div>
        </section>
      </div>
    </div>`
  );
}
