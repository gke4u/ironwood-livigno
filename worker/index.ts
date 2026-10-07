// The only server-side code of the site: everything else is the static export
// in out/, served straight from the assets store. wrangler.jsonc routes just
// these paths here (run_worker_first), so every other page costs no Worker
// invocation and behaves exactly as before:
//
//   /admin                 photo admin page (password protected)
//   /api/admin/*           its JSON API
//   /foto-del-giorno       today's photo, the same one for everyone all day
//   /foto/<id>             a single uploaded photo (admin thumbnails)
//   /api/offer             the special offer to show in the site pop-up, if any
//   /api/chat              NIGI, the site chat: on/off for the page, and AI answers (worker/chat.ts)
//   /api/chat/evento       chat opened / FAQ button used, for the admin's chat counters
//   /it, /en, …            the homepages, to apply the section order (and hidden sections) chosen in the admin
//   /recensione            short link to the "write a review" page on Google
//   /api/sezioni           the homepage sections hidden in the admin (to hide links to them)
//   /api/visita            page-view beacon for the admin's visit stats (worker/stats.ts)
//   /foto-google/<id>.jpg  a photo as JPEG, only with a short-lived signature
//                          (Google fetches the weekly photo from here)
//
// A cron trigger (wrangler.jsonc) runs every Monday morning and sends one
// photo to the Google Business Profile, if the admin connected it
// (see google.ts).
//
// Photos are compressed in the browser before upload (see admin.ts), so the
// Worker only stores and serves bytes. The files live in R2 (FILES): each
// photo under `photo/<id>` (its PhotoMeta in the custom metadata) and its JPEG
// copy for Google under `jpg/<id>`. Until 1 October 2026 they were in KV
// (`photo:<id>`, `jpg:<id>`), whose free plan allows only 1,000 writes a day
// (one big upload of ~250 photos used half of it). All 243 were copied to R2
// that day; reads still fall back to the KV copies, which can be deleted later. The small settings (index, layout, offer,
// seasons, login…) stay in KV: they change rarely. The ordered list is kept in
// its own `index` key so the public pages never have to list the files.
import { adminPage } from './admin';
import { OFFER_KEY, isLive, parseOffer, publicOffer, type Offer } from './offer';
import * as google from './google';
import { HOME_PATHS, LAYOUT_KEY, SECTIONS, isDefault, layoutCss, parseLayout } from './layout';
import { weatherFact } from './weather';
import { ICAL_KEY, fetchIcal, parseIcalUrl, type IcalSettings } from './ical';
import { EVENT_KINDS, pagePath, sourceName, type EventKind, type QuestionStatus, type Stats } from './stats';
import { CHAT_KEY, DAILY_NEURONS, FULL_KEY, KB_KEY, MAX_FULL, MAX_KB_ITEMS, askAI, availabilityNote, extractStay, lastExchange, parseFull, parseKb, parseMessages, replyLanguageNote, siteLanguage, systemPrompt, type ChatSettings, type Full, type Kb } from './chat';

// The Durable Object class must be exported by the Worker's main module.
export { Stats } from './stats';

export interface Env {
  ASSETS: Fetcher;
  PHOTOS: KVNamespace;
  FILES: R2Bucket;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  // OAuth client of the Google Cloud project approved for the Business
  // Profile APIs. Until both are set the Google link stays switched off.
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  // Visit counter for the admin (worker/stats.ts).
  STATS: DurableObjectNamespace<Stats>;
  // NIGI, the site chat (worker/chat.ts): Workers AI and a per-visitor rate limit.
  AI: Ai;
  CHAT_LIMIT: RateLimit;
}

type PhotoMeta = { id: string; type: string; w: number; h: number; bytes: number; created: string; season?: Season };

// When a photo may appear: 'neve' (snow, ski) only while the lifts are open,
// 'verde' (no snow) only the rest of the year, 'sempre' (interiors etc.) all
// year. Chosen in the admin at upload and changeable later; later changes go
// in the SEASONS_KEY map, so the photo itself never has to be rewritten.
type Season = 'neve' | 'verde' | 'sempre';
const SEASONS: Season[] = ['neve', 'verde', 'sempre'];
// Livigno's lifts run roughly from late November/early December to the start
// of May: snow photos are shown December to April. Same months as
// LIFT_MONTHS in admin.ts and src/components/OfferPopup.tsx.
const LIFT_MONTHS = [12, 1, 2, 3, 4];
const SEASONS_KEY = 'seasons';

// Login credentials chosen in the admin. Only a PBKDF2 hash of the password
// is stored. `ver` changes with every change of credentials and is part of
// every session cookie, so changing them logs out all other devices.
type AuthRecord = { user: string; salt: string; hash: string; iterations: number; ver: string };

const INDEX_KEY = 'index';
// Photos deleted in the last few minutes: KV list() can still return them for
// up to a minute, and reindex must not bring them back into the rotation.
const DELETED_KEY = 'deleted';
const TOMBSTONE_MS = 10 * 60_000;
const AUTH_KEY = 'auth';
// Until credentials are changed from the admin, the login is this username
// with the ADMIN_PASSWORD secret. Deleting the `auth` KV key restores it
// (the recovery path if the chosen password is forgotten).
const DEFAULT_USER = 'ironwood';
const PBKDF2_ITERATIONS = 100_000; // the Workers runtime maximum
const MIN_PASSWORD = 8;
const MAX_BYTES = 3 * 1024 * 1024;
const SESSION_COOKIE = 'iw_admin';
const SESSION_DAYS = 30;
// Google's "write a review" link for the Ironwood Livigno profile (from the
// profile's "Ottieni altre recensioni" box), behind the short /recensione.
const REVIEW_URL = 'https://g.page/r/CZk9VLvq1xaQEBM/review';
// Shown when no photo has been uploaded yet, so the homepage section is never empty.
const FALLBACK_IMAGE = '/images/livigno-skilift-vallata-nebbia.jpg';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (HOME_PATHS.includes(path)) return await homePage(request, env);
      if (path === '/recensione') return Response.redirect(REVIEW_URL, 302);
      if (path === '/api/sezioni') {
        const raw = await env.PHOTOS.get(LAYOUT_KEY, { cacheTtl: 60 });
        return json({ hidden: parseLayout(raw ? JSON.parse(raw) : null).hidden }, 200, { 'Cache-Control': 'public, max-age=60' });
      }
      if (path === '/foto-del-giorno') return await photoOfTheDay(request, env, ctx);
      if (path.startsWith('/foto/')) return await photoById(request, path.slice('/foto/'.length), env);
      if (path.startsWith('/foto-google/')) return await photoForGoogle(request, path.slice('/foto-google/'.length), env);
      if (path === '/api/offer') return await offerApi(request, env);
      if (path === '/api/chat') return await chatApi(request, env, ctx);
      if (path === '/api/chat/evento' && request.method === 'POST') {
        ctx.waitUntil(countChat(request, env).catch((err) => console.error(err)));
        return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
      }
      if (path === '/api/evento' && request.method === 'POST') {
        ctx.waitUntil(countEvent(request, env).catch((err) => console.error(err)));
        return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
      }
      if (path === '/api/visita' && request.method === 'POST') {
        ctx.waitUntil(countVisit(request, env).catch((err) => console.error(err)));
        return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
      }
      if (path === '/admin') return html(adminPage());
      if (path.startsWith('/api/admin/')) return await adminApi(request, env, path.slice('/api/admin/'.length));
    } catch (err) {
      console.error(err);
      return json({ error: 'Errore interno' }, 500);
    }
    return env.ASSETS.fetch(request);
  },

  // Monday morning: one photo of the season to the Google profile.
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(weeklyGooglePhoto(env, SITE_ORIGIN).catch((err) => console.error(err)));
  }
} satisfies ExportedHandler<Env>;

// Where Google fetches photos from (the cron has no request to take it from).
const SITE_ORIGIN = 'https://ironwoodlivigno.com';

// ---------- public ----------

// The static homepage, plus the section order from the admin as CSS. Any
// problem with the saved order serves the page exactly as built.
async function homePage(request: Request, env: Env): Promise<Response> {
  // Without the browser's If-None-Match/If-Modified-Since: the static file
  // doesn't change when the section order does, so a 304 from it would keep
  // a returning visitor on the old order (or old hidden sections).
  const headers = new Headers(request.headers);
  headers.delete('If-None-Match');
  headers.delete('If-Modified-Since');
  const res = await env.ASSETS.fetch(new Request(request, { headers }));
  if (!res.ok || !(res.headers.get('Content-Type') ?? '').includes('text/html')) return res;
  try {
    const raw = await env.PHOTOS.get(LAYOUT_KEY, { cacheTtl: 60 });
    if (!raw) return res;
    const layout = parseLayout(JSON.parse(raw));
    if (isDefault(layout)) return res;
    const css = layoutCss(layout);
    return new HTMLRewriter()
      .on('head', { element: (el) => { el.append(`<style id="iw-ordine">${css}</style>`, { html: true }); } })
      .transform(res);
  } catch (err) {
    console.error(err);
    return res;
  }
}

async function photoOfTheDay(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const index = inSeason(await readIndex(env), romeDate());
  if (index.length === 0) {
    // Nothing uploaded yet: a short cache, so the first real photo shows up quickly.
    const fallback = await env.ASSETS.fetch(new Request(new URL(FALLBACK_IMAGE, request.url)));
    return new Response(fallback.body, {
      headers: { 'Content-Type': fallback.headers.get('Content-Type') ?? 'image/jpeg', 'Cache-Control': 'public, max-age=300', 'X-Robots-Tag': 'noindex' }
    });
  }

  // Today's photo, or — if its file is missing for any reason — the next ones
  // in the rotation, so the homepage section is never left empty.
  const first = index.indexOf(pickForDate(index, romeDate()));
  let res: Response | null = null;
  for (let step = 0; step < Math.min(index.length, 5) && !res; step++) {
    const meta = index[(first + step) % index.length];
    // Edge cache keyed by the chosen photo, not the date: deleting today's
    // photo switches to the next one right away instead of at midnight.
    const cacheKey = new Request(`${new URL(request.url).origin}/foto-del-giorno?id=${meta.id}`);
    const cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) {
      res = new Response(hit.body, hit);
      break;
    }
    const photo = await readPhoto(env, meta.id);
    if (!photo) continue;
    res = new Response(photo.bytes, { headers: { 'Content-Type': photo.type, 'Cache-Control': 'public, max-age=86400' } });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
  }
  if (!res) {
    const fallback = await env.ASSETS.fetch(new Request(new URL(FALLBACK_IMAGE, request.url)));
    res = new Response(fallback.body, { headers: { 'Content-Type': fallback.headers.get('Content-Type') ?? 'image/jpeg' } });
  }

  // Browsers keep it until the next midnight in Italy, when the photo changes.
  res.headers.set('Cache-Control', `public, max-age=${secondsToRomeMidnight()}`);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Kept out of image search: the owner doesn't want the photos copied around.
  res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}

// Single photos by id are only for the admin's thumbnails: visitors see just
// today's photo, never the ones still to come.
async function photoById(request: Request, id: string, env: Env): Promise<Response> {
  if (!env.SESSION_SECRET || !(await isLoggedIn(request, env, await readAuth(env)))) return new Response('Not found', { status: 404 });
  if (!/^[a-z0-9-]{8,40}$/.test(id)) return new Response('Not found', { status: 404 });
  const photo = await readPhoto(env, id);
  if (!photo) return new Response('Not found', { status: 404 });
  return new Response(photo.bytes, {
    headers: {
      'Content-Type': photo.type,
      'Cache-Control': 'private, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex'
    }
  });
}

// JPEG copies (`jpg:<id>`, Google doesn't take WebP) are reachable only with
// a signature that expires after a day, so the photos still to come stay private.
async function photoForGoogle(request: Request, file: string, env: Env): Promise<Response> {
  const id = file.replace(/\.jpg$/, '');
  const url = new URL(request.url);
  const exp = url.searchParams.get('exp') ?? '';
  const sig = url.searchParams.get('sig') ?? '';
  if (!/^[a-z0-9-]{8,40}$/.test(id) || !env.SESSION_SECRET || Number(exp) < Date.now()) return new Response('Not found', { status: 404 });
  if (!(await safeEqual(sig, await sign(`gphoto:${id}:${exp}`, env.SESSION_SECRET)))) return new Response('Not found', { status: 404 });
  const bytes = await readJpg(env, id);
  if (!bytes) return new Response('Not found', { status: 404 });
  return new Response(bytes, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=3600', 'X-Robots-Tag': 'noindex' } });
}

async function signedGooglePhotoUrl(origin: string, id: string, env: Env): Promise<string> {
  const exp = String(Date.now() + 86400_000);
  return `${origin}/foto-google/${id}.jpg?exp=${exp}&sig=${await sign(`gphoto:${id}:${exp}`, env.SESSION_SECRET)}`;
}

// The photo of the season due today, or the next in the rotation, that was
// never sent to Google and has a JPEG copy.
async function weeklyGooglePhoto(env: Env, origin: string, force = false): Promise<string> {
  if (!google.isConfigured(env)) return 'Collegamento Google non ancora attivo';
  const state = await google.readGoogle(env);
  if (!state) return 'Google non collegato';
  if (!state.weekly && !force) return 'Foto settimanale spenta';
  const today = romeDate();
  const list = inSeason(await readIndex(env, 0), today);
  if (!list.length) return 'Nessuna foto';
  const start = list.indexOf(pickForDate(list, today));
  let text = 'Tutte le foto di stagione sono già state inviate a Google';
  let ok = true;
  for (let step = 0; step < list.length; step++) {
    const p = list[(start + step) % list.length];
    if (state.postedPhotos.includes(p.id)) continue;
    if (!(await hasJpg(env, p.id))) continue;
    try {
      await google.uploadPhoto(env, state, await signedGooglePhotoUrl(origin, p.id, env));
      state.postedPhotos.push(p.id);
      text = 'Foto della settimana pubblicata su Google';
    } catch (err) {
      text = 'Foto della settimana non pubblicata: ' + (err as Error).message;
      ok = false;
    }
    break;
  }
  google.addLog(state, text, ok);
  await google.writeGoogle(env, state);
  return text;
}

// Keeps the Offer post on Google in step with the saved offer: the old post
// goes, a new one is created while the offer is on and "also on Google" is ticked.
async function syncGoogleOffer(env: Env, offer: Offer, previous: Offer | null, origin: string): Promise<string | null> {
  if (!google.isConfigured(env)) return null;
  const state = await google.readGoogle(env);
  if (!state) return offer.google ? 'Google non è collegato: l’offerta è solo sul sito.' : null;
  let message: string | null = null;
  try {
    if (previous?.googlePost) await google.deletePost(env, state, previous.googlePost);
    if (offer.google && offer.active && offer.showUntil >= romeDate()) {
      offer.googlePost = await google.createOfferPost(env, state, offerForPost(offer), origin);
      message = 'Pubblicata anche su Google (Google la controlla prima di mostrarla).';
      google.addLog(state, `Offerta ${offer.checkIn} – ${offer.checkOut} pubblicata`, true);
    } else if (previous?.googlePost) {
      message = 'Post dell’offerta tolto da Google.';
      google.addLog(state, 'Post dell’offerta precedente tolto', true);
    }
  } catch (err) {
    message = 'Su Google non è riuscita: ' + (err as Error).message;
    google.addLog(state, message, false);
  }
  await google.writeGoogle(env, state);
  return message;
}

// The saved offer as the Google post needs it: the periods still to come and
// whether any of them is in the ski season.
function offerForPost(offer: Offer) {
  const { stays } = publicOffer(offer, romeDate());
  return { ...offer, stays, checkIn: stays[0].checkIn, checkOut: stays[0].checkOut, skiStay: stays.some((s) => isSkiStay(s.checkIn, s.checkOut)) };
}

// Same months as LIFT_MONTHS above: does the stay have a night in the ski season?
function isSkiStay(checkIn: string, checkOut: string): boolean {
  for (let t = Date.parse(checkIn); t < Date.parse(checkOut); t += 86400_000) {
    if (LIFT_MONTHS.includes(new Date(t).getUTCMonth() + 1)) return true;
  }
  return false;
}

// Photos the owner already put on Google by hand (see google/manual/*).
const MANUAL_KEY = 'google-manual';
type ManualState = { postedPhotos: string[]; lastAt: string | null };
async function readManual(env: Env): Promise<ManualState> {
  const raw = await env.PHOTOS.get(MANUAL_KEY);
  return raw ? (JSON.parse(raw) as ManualState) : { postedPhotos: [], lastAt: null };
}

// ---------- offer (public) ----------

async function offerApi(request: Request, env: Env): Promise<Response> {
  // ?preview=1 from a logged-in admin shows the saved offer even when it is
  // switched off or outside its dates (the admin's "Anteprima" button).
  if (new URL(request.url).searchParams.has('preview')) {
    const offer = await readOffer(env, 0);
    if (offer && env.SESSION_SECRET && (await isLoggedIn(request, env, await readAuth(env)))) {
      return json({ offer: publicOffer(offer, romeDate()) });
    }
    return json({ offer: null });
  }
  const offer = await readOffer(env);
  const today = romeDate();
  const body = offer && isLive(offer, today) ? { offer: publicOffer(offer, today) } : { offer: null };
  return json(body, 200, { 'Cache-Control': 'public, max-age=60' });
}

// The owner's own devices: any browser that has opened the admin carries
// iw_nostats=1 (set by the admin page, 2 years) or the admin session cookie.
// Their page views and clicks are not counted, so the stats show guests only.
function isOwnerDevice(request: Request): boolean {
  const cookie = request.headers.get('Cookie') ?? '';
  return /(^|;\s*)iw_nostats=1(;|$)/.test(cookie) || cookie.includes(`${SESSION_COOKIE}=`);
}

// Crawlers that run the page's JavaScript like a browser, so they send the
// beacons too. Meta's AI crawler (meta-externalagent, from the United States,
// with no referrer) was most of the "direct" visits in October 2026.
const BOT_UA = /bot|crawl|spider|slurp|externalagent|externalhit|headless|lighthouse|pagespeed|preview|python|curl|wget|httpclient|okhttp|go-http|java\/|scrapy|phantom|puppeteer|playwright|selenium/i;

function isBot(request: Request): boolean {
  const ua = request.headers.get('User-Agent') ?? '';
  return ua.length < 20 || BOT_UA.test(ua);
}

async function countVisit(request: Request, env: Env): Promise<void> {
  if (isOwnerDevice(request) || isBot(request)) return;
  const url = new URL(request.url);
  const country = (request.cf?.country as string | undefined) ?? 'XX';
  await env.STATS.getByName('site').hit({
    day: romeDate(),
    path: pagePath(request.headers.get('Referer'), url.origin),
    country: /^[A-Z]{2}$/.test(country) ? country : 'XX',
    source: sourceName(url.searchParams.get('r'), url.hostname)
  });
}

// A contact action or engagement click (WhatsApp, email, phone, form sent,
// 360° tour or map opened): kind and page only, nothing about the visitor.
async function countEvent(request: Request, env: Env): Promise<void> {
  if (isOwnerDevice(request) || isBot(request)) return;
  const url = new URL(request.url);
  const kind = url.searchParams.get('e');
  if (!kind || !(EVENT_KINDS as readonly string[]).includes(kind)) return;
  await env.STATS.getByName('site').event({
    day: romeDate(),
    kind: kind as EventKind,
    path: pagePath(request.headers.get('Referer'), url.origin)
  });
}

// ---------- NIGI chat (public) ----------

async function readChat(env: Env, cacheTtl = 60): Promise<ChatSettings> {
  const raw = await env.PHOTOS.get(CHAT_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as ChatSettings) : { active: false, updated: '' };
}

async function readKb(env: Env, cacheTtl = 60): Promise<Kb> {
  const raw = await env.PHOTOS.get(KB_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as Kb) : { items: [], updated: '', ver: '' };
}

async function readIcal(env: Env, cacheTtl = 60): Promise<IcalSettings | null> {
  const raw = await env.PHOTOS.get(ICAL_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as IcalSettings) : null;
}

async function readFull(env: Env, cacheTtl = 60): Promise<Full> {
  const raw = await env.PHOTOS.get(FULL_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as Full) : { periods: [], updated: '', ver: '' };
}

// The admin's preview link (?anteprima-nigi) shows and runs the chat for the
// logged-in owner even while it is switched off.
async function isAdmin(request: Request, env: Env): Promise<boolean> {
  return Boolean(env.SESSION_SECRET) && (await isLoggedIn(request, env, await readAuth(env)));
}

//   GET  /api/chat   { active } — whether the site shows the chat button
//   POST /api/chat   { messages } -> { reply } or { error: 'off' | 'busy' | 'limit' | 'invalid' }
async function chatApi(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const preview = new URL(request.url).searchParams.has('preview');
  if (request.method === 'GET') {
    if (preview) return json({ active: (await readChat(env, 0)).active || (await isAdmin(request, env)) });
    return json({ active: (await readChat(env)).active }, 200, { 'Cache-Control': 'public, max-age=60' });
  }
  if (request.method !== 'POST') return json({ error: 'invalid' }, 405);

  // Only the site's own pages may ask: the AI is not a public API.
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) return json({ error: 'invalid' }, 403);

  const settings = await readChat(env);
  if (!settings.active && !(preview && (await isAdmin(request, env)))) return json({ error: 'off' }, 503);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (!(await env.CHAT_LIMIT.limit({ key: ip })).success) return json({ error: 'busy' }, 429);

  const body = await request.json().catch(() => null);
  const messages = parseMessages(body);
  if (!messages) return json({ error: 'invalid' }, 400);

  const today = romeDate();
  const stats = env.STATS.getByName('site');
  // Every question goes to the admin's list, answered or not.
  const log = (status: QuestionStatus, answer: string | null) =>
    ctx.waitUntil(
      stats
        .logQuestion({
          ...lastExchange(body),
          answer,
          status,
          lang: siteLanguage(body),
          page: pagePath(request.headers.get('Referer'), new URL(request.url).origin),
          owner: isOwnerDevice(request)
        })
        .catch((err) => console.error(err))
    );
  if (!(await stats.chatAllow(today, DAILY_NEURONS))) {
    log('limit', null);
    return json({ error: 'limit' }, 429);
  }

  const [offer, kb, weather, full] = await Promise.all([readOffer(env), readKb(env), weatherFact(), readFull(env)]);
  const live = offer && isLive(offer, today) ? publicOffer(offer, today) : null;
  // The dates asked about are checked here, not by the model: booked periods
  // and Saturday-to-Saturday winter weeks (see availabilityNote). A failed
  // check just leaves the note out.
  const check = await extractStay(env.AI, messages, today).catch((err) => {
    console.error(err);
    return { asked: null, lang: null, neurons: 0 };
  });
  // Booked stays: the owner's own list plus the Holidu calendar, if linked
  // (an unreadable calendar just leaves its stays out).
  const ical = check.asked ? await readIcal(env) : null;
  const synced = ical?.url ? await fetchIcal(ical.url, today) : [];
  const booked = [...full.periods, ...(Array.isArray(synced) ? synced : [])];
  if (typeof synced === 'string') console.error('ical:', synced);
  const availability = availabilityNote(check.asked, booked, today);
  // The reply language goes as a note on the visitor's last message (see replyLanguageNote).
  const last = messages[messages.length - 1];
  const notes = [replyLanguageNote(last.content, siteLanguage(body), check.lang), availability].filter(Boolean).join('\n');
  const toAsk = [...messages.slice(0, -1), { ...last, content: `${last.content}

${notes}` }];
  const answer = await askAI(env.AI, systemPrompt(today, live, kb.items, weather), toAsk).catch((err) => {
    console.error(err);
    return null;
  });
  const reply = answer && { ...answer, neurons: answer.neurons + check.neurons };
  if (!reply) {
    ctx.waitUntil(stats.chatCount(today, 'error').catch((err) => console.error(err)));
    log('error', null);
    return json({ error: 'busy' }, 503);
  }
  ctx.waitUntil(stats.chatCount(today, 'neurons', reply.neurons).catch((err) => console.error(err)));
  log('ok', reply.text.trim());
  return json({ reply: reply.text });
}

// Chat opened, or a FAQ button used (answered in the browser): counts only.
async function countChat(request: Request, env: Env): Promise<void> {
  const kind = new URL(request.url).searchParams.get('k');
  if (kind !== 'open' && kind !== 'faq') return;
  if (isOwnerDevice(request) || isBot(request)) return;
  await env.STATS.getByName('site').chatCount(romeDate(), kind);
}

async function readOffer(env: Env, cacheTtl = 60): Promise<Offer | null> {
  const raw = await env.PHOTOS.get(OFFER_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as Offer) : null;
}

// ---------- admin API ----------

async function adminApi(request: Request, env: Env, route: string): Promise<Response> {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: 'Admin non configurato' }, 503);

  // Same-origin only for anything that changes data (the session cookie is
  // SameSite=Strict too; this is a second, independent check).
  if (request.method !== 'GET') {
    const origin = request.headers.get('Origin');
    if (!origin || origin !== new URL(request.url).origin) return json({ error: 'Origine non valida' }, 403);
  }

  if (route === 'login' && request.method === 'POST') return login(request, env);
  if (route === 'logout' && request.method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict` });
  }

  // Google sends the browser back here without the (SameSite=Strict) login
  // cookie: the signed state from authUrl proves the round trip started in the admin.
  if (route === 'google/callback' && request.method === 'GET') {
    const url = new URL(request.url);
    const back = (msg: string) => Response.redirect(`${url.origin}/admin?google=${encodeURIComponent(msg)}#google`, 302);
    if (!google.isConfigured(env)) return back('Collegamento Google non ancora configurato');
    const ok = await google.checkState(url.searchParams.get('state') ?? '', (v) => sign(v, env.SESSION_SECRET), safeEqual);
    if (!ok) return back('Richiesta scaduta: premi di nuovo “Collega a Google”');
    const code = url.searchParams.get('code');
    if (!code) return back('Collegamento annullato');
    try {
      const state = await google.connect(env, url.origin, code);
      return back(`Collegato al profilo “${state.title}”`);
    } catch (err) {
      return back((err as Error).message);
    }
  }

  const auth = await readAuth(env);
  if (!(await isLoggedIn(request, env, auth))) return json({ error: 'Accesso richiesto' }, 401);

  if (route === 'google/connect' && request.method === 'GET') {
    if (!google.isConfigured(env)) return json({ error: 'Collegamento Google non ancora configurato' }, 503);
    return Response.redirect(await google.authUrl(env, new URL(request.url).origin, (v) => sign(v, env.SESSION_SECRET)), 302);
  }
  if (route === 'google' && request.method === 'GET') {
    const state = await google.readGoogle(env);
    return json({
      configured: google.isConfigured(env),
      connected: Boolean(state),
      title: state?.title ?? null,
      weekly: state?.weekly ?? true,
      sentPhotos: state?.postedPhotos.length ?? 0,
      log: state?.log ?? []
    });
  }
  if (route === 'google' && request.method === 'PUT') {
    const state = await google.readGoogle(env);
    if (!state) return json({ error: 'Google non collegato' }, 400);
    const body = (await request.json().catch(() => ({}))) as { weekly?: unknown };
    state.weekly = body.weekly === true;
    google.addLog(state, state.weekly ? 'Foto settimanale accesa' : 'Foto settimanale spenta', true);
    await google.writeGoogle(env, state);
    return json({ ok: true });
  }
  if (route === 'google/photo-now' && request.method === 'POST') {
    return json({ message: await weeklyGooglePhoto(env, new URL(request.url).origin, true) });
  }
  // Manual publishing (Google didn't grant API access): the admin gets the
  // post ready to paste and the photo as JPEG; the owner publishes by hand.
  if (route === 'google/manual/offer' && request.method === 'GET') {
    const offer = await readOffer(env, 0);
    const today = romeDate();
    if (!offer || !offer.active || offer.showUntil < today) return json({ error: 'Nessuna offerta attiva da pubblicare: salvane una qui sotto.' }, 404);
    // Always the public site: the link ends up on Google.
    const body = google.offerPostBody(offerForPost(offer), SITE_ORIGIN);
    return json({
      title: body.event.title,
      start: offer.showFrom,
      end: offer.showUntil,
      text: body.summary,
      link: body.offer.redeemOnlineUrl,
      terms: body.offer.termsConditions,
      image: `/images/${offer.image}.jpg`
    });
  }
  if (route === 'google/manual/photo' && request.method === 'GET') {
    const manual = await readManual(env);
    const today = romeDate();
    const list = inSeason(await readIndex(env, 0), today);
    if (!list.length) return json({ error: 'Nessuna foto caricata.' }, 404);
    const start = list.indexOf(pickForDate(list, today));
    for (let step = 0; step < list.length; step++) {
      const p = list[(start + step) % list.length];
      if (manual.postedPhotos.includes(p.id)) continue;
      if (!(await hasJpg(env, p.id))) continue;
      return json({ id: p.id, season: p.season, lastAt: manual.lastAt, sent: manual.postedPhotos.length });
    }
    return json({ error: 'Tutte le foto di questa stagione sono già state pubblicate su Google.' }, 404);
  }
  const manualJpg = route.match(/^google\/manual\/photo\/([a-z0-9-]{8,40})\.jpg$/);
  if (manualJpg && request.method === 'GET') {
    const bytes = await readJpg(env, manualJpg[1]);
    if (!bytes) return json({ error: 'Foto non trovata' }, 404);
    return new Response(bytes, {
      headers: { 'Content-Type': 'image/jpeg', 'Content-Disposition': `attachment; filename="ironwood-livigno-${romeDate()}.jpg"`, 'Cache-Control': 'private, no-store' }
    });
  }
  if (route === 'google/manual/photo-done' && request.method === 'POST') {
    const body = (await request.json().catch(() => ({}))) as { id?: unknown };
    if (typeof body.id !== 'string' || !/^[a-z0-9-]{8,40}$/.test(body.id)) return json({ error: 'Foto non valida' }, 400);
    const manual = await readManual(env);
    if (!manual.postedPhotos.includes(body.id)) manual.postedPhotos.push(body.id);
    manual.lastAt = new Date().toISOString();
    try {
      await env.PHOTOS.put(MANUAL_KEY, JSON.stringify(manual));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ ok: true });
  }

  if (route === 'google/disconnect' && request.method === 'POST') {
    await env.PHOTOS.delete(google.GOOGLE_KEY);
    return json({ ok: true });
  }

  if (route === 'credentials' && request.method === 'POST') return changeCredentials(request, env, auth);

  if (route === 'stats' && request.method === 'GET') {
    return json(await env.STATS.getByName('site').summary(romeDate()));
  }
  if (route === 'stats/reset' && request.method === 'POST') {
    await env.STATS.getByName('site').reset();
    return json(await env.STATS.getByName('site').summary(romeDate()));
  }

  if (route === 'layout' && request.method === 'GET') {
    const raw = await env.PHOTOS.get(LAYOUT_KEY);
    return json({ sections: SECTIONS, ...parseLayout(raw ? JSON.parse(raw) : null) });
  }
  if (route === 'layout' && request.method === 'PUT') {
    const layout = parseLayout(await request.json().catch(() => ({})));
    try {
      if (isDefault(layout)) await env.PHOTOS.delete(LAYOUT_KEY);
      else await env.PHOTOS.put(LAYOUT_KEY, JSON.stringify(layout));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ ok: true, ...layout });
  }

  if (route === 'chat' && request.method === 'GET') {
    return json({ settings: await readChat(env, 0), budget: DAILY_NEURONS, stats: await env.STATS.getByName('site').chatSummary(romeDate()) });
  }
  // NIGI's latest questions: 20 conversations a page (?before=<conv> for the next).
  if (route === 'chat/questions' && request.method === 'GET') {
    const before = Number(new URL(request.url).searchParams.get('before'));
    return json(await env.STATS.getByName('site').questions(Number.isSafeInteger(before) && before > 0 ? before : null, 20));
  }
  if (route === 'chat/questions/delete' && request.method === 'POST') {
    const body = (await request.json().catch(() => ({}))) as { id?: unknown; conv?: unknown; all?: unknown };
    const ok = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
    const what = body.all === true ? 'all' : ok(body.id) ? { id: body.id } : ok(body.conv) ? { conv: body.conv } : null;
    if (!what) return json({ error: 'Richiesta non valida' }, 400);
    await env.STATS.getByName('site').deleteQuestions(what);
    return json({ ok: true });
  }
  if (route === 'chat/kb' && request.method === 'GET') return json({ kb: await readKb(env, 0), max: MAX_KB_ITEMS });
  if (route === 'chat/kb' && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    // Refuse to overwrite answers saved meanwhile from another tab or device.
    const current = await readKb(env, 0);
    if (current.ver && body.baseVer !== current.ver) {
      return json({ error: 'Le domande sono state modificate da un’altra pagina o da un altro dispositivo. Ricarica questa pagina e riprova.' }, 409);
    }
    const parsed = parseKb(body);
    if (typeof parsed === 'string') return json({ error: parsed }, 400);
    try {
      await env.PHOTOS.put(KB_KEY, JSON.stringify(parsed));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ kb: parsed, max: MAX_KB_ITEMS });
  }
  // The Holidu calendar link: GET shows it with the stays read from it right now.
  if (route === 'chat/ical' && request.method === 'GET') {
    const ical = await readIcal(env, 0);
    if (!ical?.url) return json({ url: '' });
    const stays = await fetchIcal(ical.url, romeDate(), true);
    return json(typeof stays === 'string' ? { url: ical.url, error: stays } : { url: ical.url, stays });
  }
  if (route === 'chat/ical' && request.method === 'PUT') {
    const parsed = parseIcalUrl(await request.json().catch(() => ({})));
    if (typeof parsed === 'string') return json({ error: parsed }, 400);
    // Check the link before saving it, so a wrong one is caught at once.
    const stays = parsed.url ? await fetchIcal(parsed.url, romeDate(), true) : [];
    if (typeof stays === 'string') return json({ error: stays }, 400);
    try {
      if (parsed.url) await env.PHOTOS.put(ICAL_KEY, JSON.stringify(parsed));
      else await env.PHOTOS.delete(ICAL_KEY);
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ url: parsed.url, stays });
  }
  // "Periodi al completo": dates NIGI tells visitors are already booked.
  if (route === 'chat/full' && request.method === 'GET') {
    const full = await readFull(env, 0);
    const today = romeDate();
    return json({ full: { ...full, periods: full.periods.filter((p) => p.to > today) }, max: MAX_FULL, today });
  }
  if (route === 'chat/full' && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const current = await readFull(env, 0);
    if (current.ver && body.baseVer !== current.ver) {
      return json({ error: 'I periodi sono stati modificati da un’altra pagina o da un altro dispositivo. Ricarica questa pagina e riprova.' }, 409);
    }
    const today = romeDate();
    const parsed = parseFull(body, today);
    if (typeof parsed === 'string') return json({ error: parsed }, 400);
    try {
      await env.PHOTOS.put(FULL_KEY, JSON.stringify(parsed));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ full: parsed, max: MAX_FULL, today });
  }
  if (route === 'chat' && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    if (typeof body.active !== 'boolean') return json({ error: 'Richiesta non valida' }, 400);
    const settings: ChatSettings = { active: body.active, updated: new Date().toISOString() };
    try {
      await env.PHOTOS.put(CHAT_KEY, JSON.stringify(settings));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ settings });
  }

  if (route === 'offer' && request.method === 'GET') return json({ offer: await readOffer(env, 0), today: romeDate() });
  if (route === 'offer' && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    // The page sends the id of the offer it was showing: if the stored one
    // has changed since (saved from another tab or device), refuse instead
    // of silently overwriting it with stale values.
    const current = await readOffer(env, 0);
    if (current && body.baseId !== current.id) {
      return json({ error: 'L’offerta è stata modificata da un’altra pagina o da un altro dispositivo. Ricarica questa pagina e riprova.' }, 409);
    }
    const parsed = parseOffer(body);
    if (typeof parsed === 'string') return json({ error: parsed }, 400);
    const googleMessage = await syncGoogleOffer(env, parsed, current, new URL(request.url).origin);
    await env.PHOTOS.put(OFFER_KEY, JSON.stringify(parsed));
    return json({ offer: parsed, today: romeDate(), googleMessage });
  }

  if (route === 'photos' && request.method === 'GET') {
    const index = await readIndex(env, 0);
    const today = romeDate();
    return json({
      user: auth?.user ?? DEFAULT_USER,
      photos: index,
      todayId: index.length ? pickForDate(inSeason(index, today), today).id : null,
      tomorrowId: index.length ? pickForDate(inSeason(index, addDays(today, 1)), addDays(today, 1)).id : null
    });
  }
  if (route === 'photos' && request.method === 'POST') return upload(request, env);
  if (route === 'photos/reindex' && request.method === 'POST') return reindex(env);

  // The admin sends the season of every photo it lists, not just the one
  // changed: rebuilding the map from a fresh KV read could miss a change made
  // a second earlier (KV reads can lag behind writes), and quick changes to
  // several photos would undo each other.
  if (route === 'photos/seasons' && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as { seasons?: unknown };
    if (!body.seasons || typeof body.seasons !== 'object') return json({ error: 'Stagioni non valide' }, 400);
    const map: Record<string, Season> = {};
    for (const [id, season] of Object.entries(body.seasons as Record<string, unknown>)) {
      if (/^[a-z0-9-]{8,40}$/.test(id) && SEASONS.includes(season as Season)) map[id] = season as Season;
    }
    try {
      await env.PHOTOS.put(SEASONS_KEY, JSON.stringify(map));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ ok: true });
  }

  const del = route.match(/^photos\/([a-z0-9-]{8,40})$/);
  if (del && request.method === 'DELETE') {
    try {
      const index = await readIndex(env, 0);
      await env.PHOTOS.put(INDEX_KEY, JSON.stringify(index.filter((p) => p.id !== del[1])));
      const deleted = await readTombstones(env);
      deleted[del[1]] = Date.now();
      await env.PHOTOS.put(DELETED_KEY, JSON.stringify(deleted));
      await env.FILES.delete([`photo/${del[1]}`, `jpg/${del[1]}`]);
      // Old copy in KV, if still there (each KV delete counts towards its daily cap: only when needed).
      if (await env.PHOTOS.get(`photo:${del[1]}`, { type: 'stream' })) {
        await env.PHOTOS.delete(`photo:${del[1]}`);
        await env.PHOTOS.delete(`jpg:${del[1]}`);
      }
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ ok: true });
  }
  return json({ error: 'Non trovato' }, 404);
}

async function login(request: Request, env: Env): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { user?: unknown; password?: unknown };
  const user = typeof body.user === 'string' ? body.user.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const auth = await readAuth(env);
  if (!(await checkCredentials(user, password, auth, env))) {
    // Slows down password guessing.
    await new Promise((r) => setTimeout(r, 1500));
    return json({ error: 'Utente o password errati' }, 401);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie(env, auth) });
}

async function changeCredentials(request: Request, env: Env, auth: AuthRecord | null): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { currentPassword?: unknown; newUser?: unknown; newPassword?: unknown };
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newUser = typeof body.newUser === 'string' ? body.newUser.trim() : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

  if (!(await checkCredentials(auth?.user ?? DEFAULT_USER, currentPassword, auth, env))) {
    await new Promise((r) => setTimeout(r, 1500));
    return json({ error: 'La password attuale non è corretta' }, 403);
  }
  if (!/^[A-Za-z0-9._@-]{3,40}$/.test(newUser)) {
    return json({ error: 'Nome utente: da 3 a 40 caratteri, solo lettere, numeri e . _ @ -' }, 400);
  }
  if (newPassword.length < MIN_PASSWORD || newPassword.length > 128) {
    return json({ error: `La nuova password deve avere almeno ${MIN_PASSWORD} caratteri` }, 400);
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const record: AuthRecord = {
    user: newUser,
    salt: toBase64(salt),
    hash: await pbkdf2(newPassword, salt, PBKDF2_ITERATIONS),
    iterations: PBKDF2_ITERATIONS,
    ver: crypto.randomUUID()
  };
  await env.PHOTOS.put(AUTH_KEY, JSON.stringify(record));
  // New cookie for this device; every other device's cookie no longer matches `ver`.
  return json({ ok: true, user: newUser }, 200, { 'Set-Cookie': await sessionCookie(env, record) });
}

async function checkCredentials(user: string, password: string, auth: AuthRecord | null, env: Env): Promise<boolean> {
  if (!auth) {
    const userOk = user.toLowerCase() === DEFAULT_USER;
    const passOk = await safeEqual(password, env.ADMIN_PASSWORD);
    return userOk && passOk;
  }
  const userOk = user.toLowerCase() === auth.user.toLowerCase();
  const hash = await pbkdf2(password, fromBase64(auth.salt), auth.iterations);
  const passOk = await safeEqual(hash, auth.hash);
  return userOk && passOk;
}

async function readAuth(env: Env): Promise<AuthRecord | null> {
  const raw = await env.PHOTOS.get(AUTH_KEY);
  return raw ? (JSON.parse(raw) as AuthRecord) : null;
}

async function sessionCookie(env: Env, auth: AuthRecord | null): Promise<string> {
  const expires = String(Date.now() + SESSION_DAYS * 86400_000);
  const ver = auth?.ver ?? 'initial';
  const token = `${expires}.${ver}.${await sign(`${expires}.${ver}`, env.SESSION_SECRET)}`;
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Strict`;
}

async function isLoggedIn(request: Request, env: Env, auth: AuthRecord | null): Promise<boolean> {
  const cookie = request.headers.get('Cookie') ?? '';
  const token = cookie.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  if (!token) return false;
  const [expires, ver, mac] = token.split('.');
  if (!expires || !ver || !mac || Number(expires) < Date.now()) return false;
  if (ver !== (auth?.ver ?? 'initial')) return false;
  return safeEqual(mac, await sign(`${expires}.${ver}`, env.SESSION_SECRET));
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return toBase64(new Uint8Array(bits));
}

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function upload(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const file = form.get('file');
  const w = Number(form.get('w'));
  const h = Number(form.get('h'));
  if (!(file instanceof File)) return json({ error: 'Nessun file' }, 400);
  if (file.size > MAX_BYTES) return json({ error: 'File troppo grande (max 3 MB dopo la compressione)' }, 413);
  if (!(w > 0 && h > 0 && w <= 4000 && h <= 4000)) return json({ error: 'Dimensioni non valide' }, 400);

  const bytes = await file.arrayBuffer();
  const type = sniffImageType(new Uint8Array(bytes));
  if (!type) return json({ error: 'Formato non supportato (solo JPEG o WebP)' }, 415);
  const season = form.get('season');
  if (!SEASONS.includes(season as Season)) return json({ error: 'Scegli la stagione delle foto' }, 400);

  const meta: PhotoMeta = {
    id: crypto.randomUUID().replace(/-/g, '').slice(0, 20),
    type,
    w: Math.round(w),
    h: Math.round(h),
    bytes: bytes.byteLength,
    created: new Date().toISOString(),
    season: season as Season
  };
  // JPEG copy for Google (made by the admin page next to the WebP).
  const jpeg = form.get('jpeg');
  const jpegBytes = jpeg instanceof File && jpeg.size <= MAX_BYTES ? await jpeg.arrayBuffer() : null;
  if (jpegBytes && sniffImageType(new Uint8Array(jpegBytes)) !== 'image/jpeg') return json({ error: 'Copia JPEG non valida' }, 415);
  try {
    await putPhotoFiles(env, meta, bytes, jpegBytes);
  } catch (err) {
    console.error(err);
    return json({ error: 'Salvataggio non riuscito per un problema temporaneo. Riprova tra qualche istante.' }, 503);
  }
  // The rotation list (a KV key) is rebuilt by photos/reindex after a batch of
  // uploads, not here: KV's free plan allows 1,000 writes a day.
  return json({ ok: true, photo: meta });
}

// Rebuilds the rotation list from the stored photos (their metadata in R2,
// plus any old KV photo not copied yet), oldest first. Called by the admin
// every few uploads and after deletions, so a batch interrupted half-way never
// leaves photos out of the rotation.
async function reindex(env: Env): Promise<Response> {
  const byId = new Map<string, PhotoMeta>();
  const deleted = await readTombstones(env);
  let cursor: string | undefined;
  do {
    const page = await env.FILES.list({ prefix: 'photo/', cursor, include: ['customMetadata'] });
    for (const o of page.objects) {
      const meta = parseMeta(o.customMetadata?.meta);
      if (meta && !deleted[meta.id]) byId.set(meta.id, meta);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  do {
    const page = await env.PHOTOS.list<PhotoMeta>({ prefix: 'photo:', cursor });
    for (const k of page.keys) if (k.metadata && !deleted[k.metadata.id] && !byId.has(k.metadata.id)) byId.set(k.metadata.id, k.metadata);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  const photos = [...byId.values()];
  photos.sort((a, b) => a.created.localeCompare(b.created));
  const next = JSON.stringify(photos);
  if (next !== ((await env.PHOTOS.get(INDEX_KEY)) ?? '[]')) {
    try {
      await env.PHOTOS.put(INDEX_KEY, next);
    } catch (err) {
      return kvWriteError(err);
    }
  }
  return json({ ok: true, count: photos.length });
}

async function readTombstones(env: Env): Promise<Record<string, number>> {
  const raw = await env.PHOTOS.get(DELETED_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, number>) : {};
  const fresh: Record<string, number> = {};
  for (const [id, at] of Object.entries(all)) if (Date.now() - at < TOMBSTONE_MS) fresh[id] = at;
  return fresh;
}

// ---------- photo files (R2, with the old KV copies as fallback) ----------

async function putPhotoFiles(env: Env, meta: PhotoMeta, bytes: ArrayBuffer, jpegBytes: ArrayBuffer | null): Promise<void> {
  // JPEG first: the photo only counts as uploaded (reindex) once its main file is there.
  if (jpegBytes) await env.FILES.put(`jpg/${meta.id}`, jpegBytes, { httpMetadata: { contentType: 'image/jpeg' } });
  await env.FILES.put(`photo/${meta.id}`, bytes, { httpMetadata: { contentType: meta.type }, customMetadata: { meta: JSON.stringify(meta) } });
}

function parseMeta(raw: string | undefined): PhotoMeta | null {
  if (!raw) return null;
  try {
    const meta = JSON.parse(raw) as PhotoMeta;
    return typeof meta.id === 'string' && typeof meta.type === 'string' ? meta : null;
  } catch {
    return null;
  }
}

async function readPhoto(env: Env, id: string): Promise<{ bytes: ArrayBuffer; type: string } | null> {
  const obj = await env.FILES.get(`photo/${id}`);
  if (obj) return { bytes: await obj.arrayBuffer(), type: obj.httpMetadata?.contentType ?? 'image/webp' };
  const { value, metadata } = await env.PHOTOS.getWithMetadata<PhotoMeta>(`photo:${id}`, { type: 'arrayBuffer', cacheTtl: 86400 });
  return value && metadata ? { bytes: value, type: metadata.type } : null;
}

async function readJpg(env: Env, id: string): Promise<ArrayBuffer | null> {
  const obj = await env.FILES.get(`jpg/${id}`);
  if (obj) return obj.arrayBuffer();
  return env.PHOTOS.get(`jpg:${id}`, { type: 'arrayBuffer' });
}

async function hasJpg(env: Env, id: string): Promise<boolean> {
  if (await env.FILES.head(`jpg/${id}`)) return true;
  return (await env.PHOTOS.get(`jpg:${id}`, { type: 'stream' })) !== null;
}

function kvWriteError(err: unknown): Response {
  console.error(err);
  // The free plan's daily write cap surfaces as an error mentioning the limit.
  if (!/limit/i.test(String(err))) {
    return json({ error: 'Salvataggio non riuscito per un problema temporaneo. Riprova tra qualche istante.' }, 503);
  }
  return json(
    { error: 'Limite giornaliero di salvataggi delle impostazioni di Cloudflare raggiunto (piano gratuito: 1.000 al giorno). Le foto già caricate sono salve: riprova domani.', limit: true },
    429
  );
}

// ---------- helpers ----------

// The rotation list, each photo with its current season (a later change from
// the admin wins over the one chosen at upload; photos from before seasons
// existed count as all-year until one is set).
async function readIndex(env: Env, cacheTtl = 60): Promise<PhotoMeta[]> {
  // cacheTtl 0 = always fresh (admin); the public route tolerates a minute of lag.
  const [raw, seasons] = await Promise.all([env.PHOTOS.get(INDEX_KEY, cacheTtl ? { cacheTtl } : undefined), readSeasons(env, cacheTtl)]);
  const index = raw ? (JSON.parse(raw) as PhotoMeta[]) : [];
  return index.map((p) => ({ ...p, season: seasons[p.id] ?? p.season ?? 'sempre' }));
}

async function readSeasons(env: Env, cacheTtl = 60): Promise<Record<string, Season>> {
  const raw = await env.PHOTOS.get(SEASONS_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as Record<string, Season>) : {};
}

// The photos that fit the season of `date`. If none do (e.g. only snow
// photos uploaded, in summer), all of them, so the section is never empty.
function inSeason(index: PhotoMeta[], date: string): PhotoMeta[] {
  const now: Season = LIFT_MONTHS.includes(Number(date.slice(5, 7))) ? 'neve' : 'verde';
  const fit = index.filter((p) => p.season === 'sempre' || p.season === now);
  return fit.length ? fit : index;
}

// The photos in season take turns in upload order, one per day, restarting
// from the first after the last. Deterministic from the date alone: no cron job needed.
function pickForDate(index: PhotoMeta[], date: string): PhotoMeta {
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400_000);
  return index[day % index.length];
}

// Today's date in Italy, as YYYY-MM-DD.
function romeDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(now);
}

function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400_000).toISOString().slice(0, 10);
}

function secondsToRomeMidnight(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const elapsed = get('hour') * 3600 + get('minute') * 60 + get('second');
  return Math.max(60, 86400 - elapsed);
}

function sniffImageType(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  return null;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(mac))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Compares hashes of both strings, so neither length nor content leaks through timing.
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', ...headers }
  });
}

function html(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'"
    }
  });
}
