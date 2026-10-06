// Visit counter for the admin: page views per day, country, page and source.
// No personal data: no IP address, no cookie, no visitor id — only counts.
//
// Every page of the site sends a POST beacon to /api/visita once on load
// (from the offer pop-up component, mounted on every page, see
// src/components/OfferPopup.tsx): only real browsers running the page count,
// not bots (crawlers that do run JavaScript are filtered by User-Agent in
// worker/index.ts, see isBot). One SQLite-backed Durable Object keeps the table (free plan:
// 100,000 writes a day).

import { DurableObject } from 'cloudflare:workers';

const KEEP_DAYS = 400;

export type Hit = { day: string; path: string; country: string; source: string };

// Contact actions and engagement, counted the same way (no personal data):
// the visitor's click sends a beacon to /api/evento?e=<kind>.
export const EVENT_KINDS = ['whatsapp', 'email', 'phone', 'form', 'tour', 'map'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];
export type EventHit = { day: string; kind: EventKind; path: string };

// NIGI, the site chat (worker/chat.ts): per day, how often it was opened,
// FAQ buttons used, AI answers given, questions refused by the daily cap and
// AI failures. 'neurons' is not a count of events but the Workers AI Neurons used that day.
export const CHAT_KINDS = ['open', 'faq', 'ai', 'limited', 'error', 'neurons'] as const;
export type ChatKind = (typeof CHAT_KINDS)[number];
export type ChatSummary = {
  today: Record<ChatKind, number>;
  week: Record<ChatKind, number>; // last 7 days
  month: Record<ChatKind, number>; // last 30 days
  since: string | null;
};

// NIGI's latest questions, for the admin: what the visitor wrote and what
// NIGI answered, with time, site language and page. Nothing about the
// visitor (no IP, no cookie, no id): questions of one conversation are tied
// together only because the browser sends NIGI's previous answer back with
// the next question. Kept QUESTIONS_DAYS days, the owner can delete them.
export const QUESTIONS_DAYS = 90;
const QUESTIONS_MAX = 3000;
export type QuestionStatus = 'ok' | 'limit' | 'error';
export type QuestionIn = {
  question: string;
  answer: string | null;
  prevAnswer: string | null; // NIGI's answer just before this question, if any
  status: QuestionStatus;
  lang: string | null;
  page: string;
  owner: boolean; // asked from the owner's own device (admin preview, tests)
};
export type Question = { id: number; at: string; question: string; answer: string | null; status: QuestionStatus; lang: string | null; page: string; owner: boolean };
export type Conversation = { conv: number; questions: Question[] };
export type QuestionsPage = { conversations: Conversation[]; more: boolean; total: number; days: number };

export type StatsSummary = {
  since: string | null;
  days: { day: string; views: number }[]; // last 30 days, oldest first, including empty days
  today: number;
  week: number;
  month: number;
  countries: { key: string; views: number }[];
  pages: { key: string; views: number }[];
  sources: { key: string; views: number }[];
  events: { key: string; views: number }[]; // last 30 days, per kind
  eventPages: { key: string; views: number }[]; // pages where contacts started (whatsapp/email/phone/form)
  eventsSince: string | null;
};

export class Stats extends DurableObject {
  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS views (
         day TEXT NOT NULL, path TEXT NOT NULL, country TEXT NOT NULL, source TEXT NOT NULL,
         n INTEGER NOT NULL, PRIMARY KEY (day, path, country, source))`
    );
    ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS events (
         day TEXT NOT NULL, kind TEXT NOT NULL, path TEXT NOT NULL,
         n INTEGER NOT NULL, PRIMARY KEY (day, kind, path))`
    );
    ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS chat (
         day TEXT NOT NULL, kind TEXT NOT NULL,
         n INTEGER NOT NULL, PRIMARY KEY (day, kind))`
    );
    ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS questions (
         id INTEGER PRIMARY KEY AUTOINCREMENT, conv INTEGER NOT NULL, at TEXT NOT NULL,
         question TEXT NOT NULL, answer TEXT, status TEXT NOT NULL, lang TEXT,
         page TEXT NOT NULL, owner INTEGER NOT NULL)`
    );
    ctx.storage.sql.exec('CREATE INDEX IF NOT EXISTS questions_conv ON questions (conv)');
    // One-off clean-ups, each run once.
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS cleanups (name TEXT PRIMARY KEY)');
    // From 2 to 6 October 2026 Meta's AI crawler (no referrer, from the US)
    // was counted as 200-300 direct visits a day, before isBot existed.
    // There were no direct US visits on 1 October, so the rows go whole
    // (the owner approved removing them on 6 October).
    if (!ctx.storage.sql.exec("SELECT 1 FROM cleanups WHERE name = 'meta-crawler'").toArray().length) {
      ctx.storage.sql.exec(
        `DELETE FROM views WHERE country = 'US' AND source = 'Diretto o interno'
         AND day BETWEEN '2026-10-02' AND '2026-10-06'`
      );
      ctx.storage.sql.exec("INSERT INTO cleanups (name) VALUES ('meta-crawler')");
    }
  }

  async hit(h: Hit): Promise<void> {
    this.ctx.storage.sql.exec(
      `INSERT INTO views (day, path, country, source, n) VALUES (?, ?, ?, ?, 1)
       ON CONFLICT (day, path, country, source) DO UPDATE SET n = n + 1`,
      h.day, h.path, h.country, h.source
    );
    // Old rows go once a day, on the first visit after midnight.
    const last = await this.ctx.storage.get<string>('pruned');
    if (last !== h.day) {
      const cutoff = new Date(Date.parse(`${h.day}T00:00:00Z`) - KEEP_DAYS * 86400_000).toISOString().slice(0, 10);
      this.ctx.storage.sql.exec('DELETE FROM views WHERE day < ?', cutoff);
      this.ctx.storage.sql.exec('DELETE FROM events WHERE day < ?', cutoff);
      this.ctx.storage.sql.exec('DELETE FROM chat WHERE day < ?', cutoff);
      await this.ctx.storage.put('pruned', h.day);
    }
  }

  async event(e: EventHit): Promise<void> {
    this.ctx.storage.sql.exec(
      `INSERT INTO events (day, kind, path, n) VALUES (?, ?, ?, 1)
       ON CONFLICT (day, kind, path) DO UPDATE SET n = n + 1`,
      e.day, e.kind, e.path
    );
  }

  async chatCount(day: string, kind: ChatKind, by = 1): Promise<void> {
    this.ctx.storage.sql.exec(
      `INSERT INTO chat (day, kind, n) VALUES (?, ?, ?) ON CONFLICT (day, kind) DO UPDATE SET n = n + excluded.n`,
      day, kind, by
    );
  }

  // Counts one AI answer if today's Neuron budget isn't used up yet. The
  // Neurons of each answer are added afterwards (chatCount 'neurons'), from
  // the model's real usage.
  async chatAllow(day: string, budget: number): Promise<boolean> {
    const used = this.ctx.storage.sql.exec<{ n: number }>("SELECT n FROM chat WHERE day = ? AND kind = 'neurons'", day).toArray()[0]?.n ?? 0;
    if (used >= budget) {
      await this.chatCount(day, 'limited');
      return false;
    }
    await this.chatCount(day, 'ai');
    return true;
  }

  async chatSummary(today: string): Promise<ChatSummary> {
    const sql = this.ctx.storage.sql;
    const from30 = new Date(Date.parse(`${today}T00:00:00Z`) - 29 * 86400_000).toISOString().slice(0, 10);
    const zero = () => Object.fromEntries(CHAT_KINDS.map((k) => [k, 0])) as Record<ChatKind, number>;
    const from7 = new Date(Date.parse(`${today}T00:00:00Z`) - 6 * 86400_000).toISOString().slice(0, 10);
    const todayCounts = zero();
    const week = zero();
    const month = zero();
    for (const r of sql.exec<{ day: string; kind: ChatKind; n: number }>('SELECT day, kind, n FROM chat WHERE day >= ?', from30)) {
      if (!(r.kind in month)) continue;
      month[r.kind] += r.n;
      if (r.day >= from7) week[r.kind] += r.n;
      if (r.day === today) todayCounts[r.kind] += r.n;
    }
    const since = sql.exec<{ d: string | null }>('SELECT MIN(day) AS d FROM chat').one().d;
    return { today: todayCounts, week, month, since };
  }

  async logQuestion(q: QuestionIn): Promise<void> {
    const sql = this.ctx.storage.sql;
    const now = new Date();
    // Same conversation as the question NIGI answered just before (within 2 days).
    const since = new Date(now.getTime() - 2 * 86400_000).toISOString();
    const prev = q.prevAnswer
      ? sql.exec<{ conv: number }>('SELECT conv FROM questions WHERE answer = ? AND at >= ? ORDER BY id DESC LIMIT 1', q.prevAnswer, since).toArray()[0]
      : undefined;
    const id = sql
      .exec<{ id: number }>(
        `INSERT INTO questions (conv, at, question, answer, status, lang, page, owner) VALUES (0, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
        now.toISOString(), q.question, q.answer, q.status, q.lang, q.page, q.owner ? 1 : 0
      )
      .one().id;
    sql.exec('UPDATE questions SET conv = ? WHERE id = ?', prev?.conv ?? id, id);
    const cutoff = new Date(now.getTime() - QUESTIONS_DAYS * 86400_000).toISOString();
    sql.exec('DELETE FROM questions WHERE at < ? OR id <= ?', cutoff, id - QUESTIONS_MAX);
  }

  // The latest conversations, newest started first, `limit` at a time: `before` is
  // the last conversation of the previous page.
  async questions(before: number | null, limit: number): Promise<QuestionsPage> {
    const sql = this.ctx.storage.sql;
    const convs = sql
      .exec<{ conv: number }>('SELECT conv FROM questions WHERE conv < ? GROUP BY conv ORDER BY conv DESC LIMIT ?', before ?? Number.MAX_SAFE_INTEGER, limit + 1)
      .toArray()
      .map((r) => r.conv);
    const more = convs.length > limit;
    const page = convs.slice(0, limit);
    const byConv = new Map<number, Question[]>(page.map((c) => [c, []]));
    if (page.length) {
      const rows = sql.exec<{ id: number; conv: number; at: string; question: string; answer: string | null; status: QuestionStatus; lang: string | null; page: string; owner: number }>(
        `SELECT * FROM questions WHERE conv IN (${page.map(() => '?').join(',')}) ORDER BY id`,
        ...page
      );
      for (const r of rows) byConv.get(r.conv)?.push({ id: r.id, at: r.at, question: r.question, answer: r.answer, status: r.status, lang: r.lang, page: r.page, owner: r.owner === 1 });
    }
    const total = sql.exec<{ n: number }>('SELECT COUNT(*) AS n FROM questions').one().n;
    return { conversations: page.map((conv) => ({ conv, questions: byConv.get(conv) ?? [] })), more, total, days: QUESTIONS_DAYS };
  }

  // Admin delete: one question, one whole conversation, or everything.
  async deleteQuestions(what: { id: number } | { conv: number } | 'all'): Promise<void> {
    const sql = this.ctx.storage.sql;
    if (what === 'all') sql.exec('DELETE FROM questions');
    else if ('id' in what) sql.exec('DELETE FROM questions WHERE id = ?', what.id);
    else sql.exec('DELETE FROM questions WHERE conv = ?', what.conv);
  }

  // Admin "Azzera statistiche": deletes every counted visit and click
  // (not the chat counters, which also hold today's AI cap).
  async reset(): Promise<void> {
    this.ctx.storage.sql.exec('DELETE FROM views');
    this.ctx.storage.sql.exec('DELETE FROM events');
  }

  async summary(today: string): Promise<StatsSummary> {
    const sql = this.ctx.storage.sql;
    const back = (n: number) => new Date(Date.parse(`${today}T00:00:00Z`) - n * 86400_000).toISOString().slice(0, 10);
    const from30 = back(29);
    const from7 = back(6);
    const perDay = new Map(
      sql.exec<{ day: string; v: number }>('SELECT day, SUM(n) AS v FROM views WHERE day >= ? GROUP BY day', from30).toArray().map((r) => [r.day, r.v])
    );
    const days = Array.from({ length: 30 }, (_, i) => back(29 - i)).map((day) => ({ day, views: perDay.get(day) ?? 0 }));
    const sum = (from: string) => days.filter((d) => d.day >= from).reduce((a, d) => a + d.views, 0);
    const top = (col: 'country' | 'path' | 'source') =>
      sql
        .exec<{ key: string; views: number }>(`SELECT ${col} AS key, SUM(n) AS views FROM views WHERE day >= ? GROUP BY ${col} ORDER BY views DESC LIMIT 8`, from30)
        .toArray();
    const since = sql.exec<{ d: string | null }>('SELECT MIN(day) AS d FROM views').one().d;
    const events = sql
      .exec<{ key: string; views: number }>('SELECT kind AS key, SUM(n) AS views FROM events WHERE day >= ? GROUP BY kind ORDER BY views DESC', from30)
      .toArray();
    const eventPages = sql
      .exec<{ key: string; views: number }>(
        `SELECT path AS key, SUM(n) AS views FROM events WHERE day >= ? AND kind IN ('whatsapp','email','phone','form')
         GROUP BY path ORDER BY views DESC LIMIT 8`,
        from30
      )
      .toArray();
    const eventsSince = sql.exec<{ d: string | null }>('SELECT MIN(day) AS d FROM events').one().d;
    return {
      since,
      days,
      today: perDay.get(today) ?? 0,
      week: sum(from7),
      month: sum(from30),
      countries: top('country'),
      pages: top('path'),
      sources: top('source'),
      events,
      eventPages,
      eventsSince
    };
  }
}

// Where the visitor came from, from the page's document.referrer host (sent
// with the beacon as ?r=). Grouped into a few names the owner recognises.
export function sourceName(refHost: string | null, siteHost: string): string {
  const h = (refHost ?? '').toLowerCase().replace(/^www\./, '');
  if (!h || h === siteHost.replace(/^www\./, '')) return 'Diretto o interno';
  if (/(^|\.)google\./.test(h)) return 'Google';
  if (/(^|\.)bing\.com$/.test(h)) return 'Bing';
  if (/duckduckgo\.com$/.test(h)) return 'DuckDuckGo';
  if (/(^|\.)(instagram\.com|l\.instagram\.com)$/.test(h)) return 'Instagram';
  if (/(^|\.)(facebook\.com|fb\.com|m\.facebook\.com|l\.facebook\.com)$/.test(h)) return 'Facebook';
  if (/(chatgpt\.com|openai\.com)$/.test(h)) return 'ChatGPT';
  if (/(perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/.test(h)) return 'Assistenti AI';
  if (/airbnb\./.test(h)) return 'Airbnb';
  if (/booking\.com$/.test(h)) return 'Booking.com';
  if (/holidu\./.test(h)) return 'Holidu';
  // Anything else as its host name, if it looks like one (the beacon is public).
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(h) && h.length <= 60 ? h : 'Altro';
}

// The page that was viewed: path of the same-origin Referer, without query or hash.
export function pagePath(referer: string | null, origin: string): string {
  if (!referer || !referer.startsWith(origin)) return '(sconosciuta)';
  const path = new URL(referer).pathname.replace(/\/+$/, '') || '/';
  return /^\/[a-z0-9/_-]{0,119}$/i.test(path) ? path : '(sconosciuta)';
}
