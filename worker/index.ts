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
//   /it, /en, …            the homepages, to apply the section order chosen in the admin
//   /recensione            short link to the "write a review" page on Google
//   /foto-google/<id>.jpg  a photo as JPEG, only with a short-lived signature
//                          (Google fetches the weekly photo from here)
//
// A cron trigger (wrangler.jsonc) runs every Monday morning and sends one
// photo to the Google Business Profile, if the admin connected it
// (see google.ts).
//
// Photos are compressed in the browser before upload (see admin.ts), so the
// Worker only stores and serves bytes. They live in KV: each photo under
// `photo:<id>`, plus one `index` key with the ordered list. The list is kept
// in its own key because KV list() is capped at 1,000 calls a day on the free
// plan, while get() allows 100,000.
import { adminPage } from './admin';
import { OFFER_KEY, isLive, parseOffer, publicOffer, type Offer } from './offer';
import * as google from './google';
import { HOME_PATHS, LAYOUT_KEY, SECTIONS, isDefault, normalizeOrder, orderCss } from './layout';

export interface Env {
  ASSETS: Fetcher;
  PHOTOS: KVNamespace;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  // OAuth client of the Google Cloud project approved for the Business
  // Profile APIs. Until both are set the Google link stays switched off.
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
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
      if (path === '/foto-del-giorno') return await photoOfTheDay(request, env, ctx);
      if (path.startsWith('/foto/')) return await photoById(request, path.slice('/foto/'.length), env);
      if (path.startsWith('/foto-google/')) return await photoForGoogle(request, path.slice('/foto-google/'.length), env);
      if (path === '/api/offer') return await offerApi(request, env);
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
  const res = await env.ASSETS.fetch(request);
  if (!res.ok || !(res.headers.get('Content-Type') ?? '').includes('text/html')) return res;
  try {
    const raw = await env.PHOTOS.get(LAYOUT_KEY, { cacheTtl: 60 });
    if (!raw) return res;
    const order = normalizeOrder(JSON.parse(raw));
    if (isDefault(order)) return res;
    const css = orderCss(order);
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
    const bytes = await env.PHOTOS.get(`photo:${meta.id}`, { type: 'arrayBuffer', cacheTtl: 86400 });
    if (!bytes) continue;
    res = new Response(bytes, { headers: { 'Content-Type': meta.type, 'Cache-Control': 'public, max-age=86400' } });
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
  const { value, metadata } = await env.PHOTOS.getWithMetadata<PhotoMeta>(`photo:${id}`, { type: 'arrayBuffer', cacheTtl: 86400 });
  if (!value || !metadata) return new Response('Not found', { status: 404 });
  return new Response(value, {
    headers: {
      'Content-Type': metadata.type,
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
  const bytes = await env.PHOTOS.get(`jpg:${id}`, { type: 'arrayBuffer' });
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
    if (!(await env.PHOTOS.get(`jpg:${p.id}`, { type: 'stream' }))) continue;
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
      offer.googlePost = await google.createOfferPost(env, state, { ...offer, skiStay: isSkiStay(offer.checkIn, offer.checkOut) }, origin);
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
      return json({ offer: publicOffer(offer) });
    }
    return json({ offer: null });
  }
  const offer = await readOffer(env);
  const body = offer && isLive(offer, romeDate()) ? { offer: publicOffer(offer) } : { offer: null };
  return json(body, 200, { 'Cache-Control': 'public, max-age=60' });
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
    const body = google.offerPostBody({ ...offer, skiStay: isSkiStay(offer.checkIn, offer.checkOut) }, SITE_ORIGIN);
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
      if (!(await env.PHOTOS.get(`jpg:${p.id}`, { type: 'stream' }))) continue;
      return json({ id: p.id, season: p.season, lastAt: manual.lastAt, sent: manual.postedPhotos.length });
    }
    return json({ error: 'Tutte le foto di questa stagione sono già state pubblicate su Google.' }, 404);
  }
  const manualJpg = route.match(/^google\/manual\/photo\/([a-z0-9-]{8,40})\.jpg$/);
  if (manualJpg && request.method === 'GET') {
    const bytes = await env.PHOTOS.get(`jpg:${manualJpg[1]}`, { type: 'arrayBuffer' });
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

  if (route === 'layout' && request.method === 'GET') {
    const raw = await env.PHOTOS.get(LAYOUT_KEY);
    return json({ sections: SECTIONS, order: normalizeOrder(raw ? JSON.parse(raw) : null) });
  }
  if (route === 'layout' && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as { order?: unknown };
    const order = normalizeOrder(body.order);
    try {
      if (isDefault(order)) await env.PHOTOS.delete(LAYOUT_KEY);
      else await env.PHOTOS.put(LAYOUT_KEY, JSON.stringify(order));
    } catch (err) {
      return kvWriteError(err);
    }
    return json({ ok: true, order });
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

  const seasonRoute = route.match(/^photos\/([a-z0-9-]{8,40})\/season$/);
  if (seasonRoute && request.method === 'PUT') {
    const body = (await request.json().catch(() => ({}))) as { season?: unknown };
    if (!SEASONS.includes(body.season as Season)) return json({ error: 'Stagione non valida' }, 400);
    try {
      const map = await readSeasons(env, 0);
      map[seasonRoute[1]] = body.season as Season;
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
      await env.PHOTOS.delete(`photo:${del[1]}`);
      await env.PHOTOS.delete(`jpg:${del[1]}`);
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
    await env.PHOTOS.put(`photo:${meta.id}`, bytes, { metadata: meta });
    if (jpegBytes) await env.PHOTOS.put(`jpg:${meta.id}`, jpegBytes);
  } catch (err) {
    return kvWriteError(err);
  }
  // The rotation list is rebuilt by photos/reindex after a batch of uploads,
  // not here: one index write per photo would double the KV writes, and the
  // free plan allows 1,000 a day.
  return json({ ok: true, photo: meta });
}

// Rebuilds the rotation list from the stored photos (their KV metadata),
// oldest first. Called by the admin every few uploads and after deletions,
// so a batch interrupted half-way never leaves photos out of the rotation.
async function reindex(env: Env): Promise<Response> {
  const photos: PhotoMeta[] = [];
  const deleted = await readTombstones(env);
  let cursor: string | undefined;
  do {
    const page = await env.PHOTOS.list<PhotoMeta>({ prefix: 'photo:', cursor });
    for (const k of page.keys) if (k.metadata && !deleted[k.metadata.id]) photos.push(k.metadata);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
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

function kvWriteError(err: unknown): Response {
  console.error(err);
  // The free plan's daily write cap surfaces as an error mentioning the limit.
  if (!/limit/i.test(String(err))) {
    return json({ error: 'Salvataggio non riuscito per un problema temporaneo. Riprova tra qualche istante.' }, 503);
  }
  return json(
    { error: 'Limite giornaliero di caricamenti di Cloudflare raggiunto (piano gratuito: circa 1.000 salvataggi al giorno, cioè circa 450 foto). Le foto già caricate sono salve: riprendi domani con le restanti.', limit: true },
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
