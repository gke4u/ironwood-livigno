// The owner's booking calendar from Holidu (or any channel with an iCal
// export link), so NIGI knows the booked stays without the owner typing them
// into "Periodi al completo". The link is pasted once in the admin (KV key
// `chat_ical`); the calendar is fetched when NIGI needs it, through
// Cloudflare's cache (at most every 15 minutes), never stored in KV (the
// free plan allows 1,000 writes a day).

import type { FullPeriod } from './chat';

export const ICAL_KEY = 'chat_ical';
export type IcalSettings = { url: string; updated: string };

const CACHE_SECONDS = 900;
const TIMEOUT_MS = 5000;
const MAX_BYTES = 1_000_000;

// Only a web address the owner could have copied from a booking channel.
export function parseIcalUrl(body: unknown): IcalSettings | string {
  const raw = (body as { url?: unknown } | null)?.url;
  const url = typeof raw === 'string' ? raw.trim().replace(/^webcal:\/\//i, 'https://') : '';
  if (!url) return { url: '', updated: new Date().toISOString() };
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return 'Il link non è valido: copialo di nuovo da Holidu';
  }
  if (parsed.protocol !== 'https:' || url.length > 1000) return 'Il link deve iniziare con https://';
  return { url: parsed.toString(), updated: new Date().toISOString() };
}

// "20261213" or "20261213T150000Z" -> "2026-12-13".
function isoDay(v: string): string {
  return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
}

function nextDay(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// The stays in an iCal file: each VEVENT from its start day to its end day
// (the departure day, as iCal's DTEND is exclusive), still to come.
export function parseIcal(text: string, today: string): FullPeriod[] {
  // Long lines are folded onto the next line, which then starts with a space.
  const lines = text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  const out: FullPeriod[] = [];
  let from = '';
  let to = '';
  let inEvent = false;
  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      from = to = '';
    } else if (line.startsWith('END:VEVENT')) {
      inEvent = false;
      if (!from) continue;
      if (!to || to <= from) to = nextDay(from);
      if (to > today) out.push({ from, to });
    } else if (inEvent) {
      const m = line.match(/^(DTSTART|DTEND)[^:]*:(\d{8})/);
      if (m) m[1] === 'DTSTART' ? (from = isoDay(m[2])) : (to = isoDay(m[2]));
    }
  }
  return out.sort((a, b) => a.from.localeCompare(b.from));
}

// The calendar's stays, or an error in Italian for the admin.
export async function fetchIcal(url: string, today: string, fresh = false): Promise<FullPeriod[] | string> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'text/calendar, text/plain, */*' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cf: fresh ? { cacheTtl: 0 } : { cacheTtl: CACHE_SECONDS, cacheEverything: true }
    });
    if (!res.ok) return `Holidu ha risposto con un errore (${res.status}): controlla il link`;
    const text = (await res.text()).slice(0, MAX_BYTES);
    if (!text.includes('BEGIN:VCALENDAR')) return 'Il link non porta a un calendario iCal: copia il link di esportazione iCal da Holidu';
    return parseIcal(text, today);
  } catch {
    return 'Impossibile leggere il calendario (link sbagliato o Holidu non raggiungibile)';
  }
}
