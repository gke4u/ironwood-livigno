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
//
// Photos are compressed in the browser before upload (see admin.ts), so the
// Worker only stores and serves bytes. They live in KV: each photo under
// `photo:<id>`, plus one `index` key with the ordered list. The list is kept
// in its own key because KV list() is capped at 1,000 calls a day on the free
// plan, while get() allows 100,000.
import { adminPage } from './admin';
import { OFFER_KEY, isLive, parseOffer, publicOffer, type Offer } from './offer';

export interface Env {
  ASSETS: Fetcher;
  PHOTOS: KVNamespace;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
}

type PhotoMeta = { id: string; type: string; w: number; h: number; bytes: number; created: string };

// Login credentials chosen in the admin. Only a PBKDF2 hash of the password
// is stored. `ver` changes with every change of credentials and is part of
// every session cookie, so changing them logs out all other devices.
type AuthRecord = { user: string; salt: string; hash: string; iterations: number; ver: string };

const INDEX_KEY = 'index';
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
// Shown when no photo has been uploaded yet, so the homepage section is never empty.
const FALLBACK_IMAGE = '/images/livigno-skilift-vallata-nebbia.jpg';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (path === '/foto-del-giorno') return await photoOfTheDay(request, env, ctx);
      if (path.startsWith('/foto/')) return await photoById(path.slice('/foto/'.length), env);
      if (path === '/api/offer') return await offerApi(request, env);
      if (path === '/admin') return html(adminPage());
      if (path.startsWith('/api/admin/')) return await adminApi(request, env, path.slice('/api/admin/'.length));
    } catch (err) {
      console.error(err);
      return json({ error: 'Errore interno' }, 500);
    }
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;

// ---------- public ----------

async function photoOfTheDay(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const index = await readIndex(env);
  if (index.length === 0) {
    // Nothing uploaded yet: a short cache, so the first real photo shows up quickly.
    const fallback = await env.ASSETS.fetch(new Request(new URL(FALLBACK_IMAGE, request.url)));
    return new Response(fallback.body, {
      headers: { 'Content-Type': fallback.headers.get('Content-Type') ?? 'image/jpeg', 'Cache-Control': 'public, max-age=300' }
    });
  }

  const meta = pickForDate(index, romeDate());
  // Edge cache keyed by the chosen photo, not the date: deleting today's
  // photo switches to the next one right away instead of at midnight.
  const cacheKey = new Request(`${new URL(request.url).origin}/foto-del-giorno?id=${meta.id}`);
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  const res = hit
    ? new Response(hit.body, hit)
    : await (async () => {
        const bytes = await env.PHOTOS.get(`photo:${meta.id}`, { type: 'arrayBuffer', cacheTtl: 86400 });
        if (!bytes) return null;
        const fresh = new Response(bytes, { headers: { 'Content-Type': meta.type, 'Cache-Control': 'public, max-age=86400' } });
        ctx.waitUntil(cache.put(cacheKey, fresh.clone()));
        return fresh;
      })();
  if (!res) return new Response('Not found', { status: 404 });

  // Browsers keep it until the next midnight in Italy, when the photo changes.
  res.headers.set('Cache-Control', `public, max-age=${secondsToRomeMidnight()}`);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  return res;
}

async function photoById(id: string, env: Env): Promise<Response> {
  if (!/^[a-z0-9-]{8,40}$/.test(id)) return new Response('Not found', { status: 404 });
  const { value, metadata } = await env.PHOTOS.getWithMetadata<PhotoMeta>(`photo:${id}`, { type: 'arrayBuffer', cacheTtl: 86400 });
  if (!value || !metadata) return new Response('Not found', { status: 404 });
  return new Response(value, {
    headers: {
      'Content-Type': metadata.type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex'
    }
  });
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

  const auth = await readAuth(env);
  if (!(await isLoggedIn(request, env, auth))) return json({ error: 'Accesso richiesto' }, 401);

  if (route === 'credentials' && request.method === 'POST') return changeCredentials(request, env, auth);

  if (route === 'offer' && request.method === 'GET') return json({ offer: await readOffer(env, 0), today: romeDate() });
  if (route === 'offer' && request.method === 'PUT') {
    const parsed = parseOffer((await request.json().catch(() => ({}))) as Record<string, unknown>);
    if (typeof parsed === 'string') return json({ error: parsed }, 400);
    await env.PHOTOS.put(OFFER_KEY, JSON.stringify(parsed));
    return json({ offer: parsed, today: romeDate() });
  }

  if (route === 'photos' && request.method === 'GET') {
    const index = await readIndex(env, 0);
    const today = romeDate();
    return json({
      user: auth?.user ?? DEFAULT_USER,
      photos: index,
      todayId: index.length ? pickForDate(index, today).id : null,
      tomorrowId: index.length ? pickForDate(index, addDays(today, 1)).id : null
    });
  }
  if (route === 'photos' && request.method === 'POST') return upload(request, env);

  const del = route.match(/^photos\/([a-z0-9-]{8,40})$/);
  if (del && request.method === 'DELETE') {
    const index = await readIndex(env, 0);
    await env.PHOTOS.put(INDEX_KEY, JSON.stringify(index.filter((p) => p.id !== del[1])));
    await env.PHOTOS.delete(`photo:${del[1]}`);
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

  const meta: PhotoMeta = {
    id: crypto.randomUUID().replace(/-/g, '').slice(0, 20),
    type,
    w: Math.round(w),
    h: Math.round(h),
    bytes: bytes.byteLength,
    created: new Date().toISOString()
  };
  await env.PHOTOS.put(`photo:${meta.id}`, bytes, { metadata: meta });
  const index = await readIndex(env, 0);
  index.push(meta);
  await env.PHOTOS.put(INDEX_KEY, JSON.stringify(index));
  return json({ ok: true, photo: meta });
}

// ---------- helpers ----------

async function readIndex(env: Env, cacheTtl = 60): Promise<PhotoMeta[]> {
  // cacheTtl 0 = always fresh (admin); the public route tolerates a minute of lag.
  const raw = await env.PHOTOS.get(INDEX_KEY, cacheTtl ? { cacheTtl } : undefined);
  return raw ? (JSON.parse(raw) as PhotoMeta[]) : [];
}

// Photos take turns in upload order, one per day, restarting from the first
// after the last. Deterministic from the date alone: no cron job needed.
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
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }
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
