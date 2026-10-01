// Visit counter for the admin: page views per day, country, page and source.
// No personal data: no IP address, no cookie, no visitor id — only counts.
//
// Every page of the site sends a POST beacon to /api/visita once on load
// (from the offer pop-up component, mounted on every page, see
// src/components/OfferPopup.tsx): only real browsers running the page count,
// not bots. One SQLite-backed Durable Object keeps the table (free plan:
// 100,000 writes a day).

import { DurableObject } from 'cloudflare:workers';

const KEEP_DAYS = 400;

export type Hit = { day: string; path: string; country: string; source: string };

export type StatsSummary = {
  since: string | null;
  days: { day: string; views: number }[]; // last 30 days, oldest first, including empty days
  today: number;
  week: number;
  month: number;
  countries: { key: string; views: number }[];
  pages: { key: string; views: number }[];
  sources: { key: string; views: number }[];
};

export class Stats extends DurableObject {
  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS views (
         day TEXT NOT NULL, path TEXT NOT NULL, country TEXT NOT NULL, source TEXT NOT NULL,
         n INTEGER NOT NULL, PRIMARY KEY (day, path, country, source))`
    );
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
      await this.ctx.storage.put('pruned', h.day);
    }
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
    return {
      since,
      days,
      today: perDay.get(today) ?? 0,
      week: sum(from7),
      month: sum(from30),
      countries: top('country'),
      pages: top('path'),
      sources: top('source')
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
