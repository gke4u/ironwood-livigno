// Google Business Profile link: publishes the special offer as an Offer post
// and one photo a week (Monday morning, cron trigger) to the owner's profile.
//
// Stays switched off until the two secrets GOOGLE_CLIENT_ID and
// GOOGLE_CLIENT_SECRET are set (OAuth client of the Google Cloud project that
// Google approved for the Business Profile APIs). The owner then presses
// "Collega a Google" in the admin once; the refresh token Google returns is
// kept in KV under GOOGLE_KEY, never shown again.
//
// API reference: https://developers.google.com/my-business/reference/rest

export const GOOGLE_KEY = 'google';

const SCOPE = 'https://www.googleapis.com/auth/business.manage';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ACCOUNTS_URL = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
const INFO_URL = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const V4_URL = 'https://mybusiness.googleapis.com/v4';
// The profile to post to, if the Google account manages more than one.
const LOCATION_TITLE = /ironwood/i;
const LOG_SIZE = 15;

export type GoogleEnv = { GOOGLE_CLIENT_ID?: string; GOOGLE_CLIENT_SECRET?: string; SESSION_SECRET: string; PHOTOS: KVNamespace };

export type GoogleState = {
  refreshToken: string;
  account: string; // accounts/123
  location: string; // locations/456
  title: string;
  connectedAt: string;
  weekly: boolean; // one photo a week to the profile
  postedPhotos: string[]; // ids already sent, never sent twice
  log: { at: string; text: string; ok: boolean }[];
};

export function isConfigured(env: GoogleEnv): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export async function readGoogle(env: GoogleEnv): Promise<GoogleState | null> {
  const raw = await env.PHOTOS.get(GOOGLE_KEY);
  return raw ? (JSON.parse(raw) as GoogleState) : null;
}

export async function writeGoogle(env: GoogleEnv, state: GoogleState): Promise<void> {
  await env.PHOTOS.put(GOOGLE_KEY, JSON.stringify(state));
}

export function addLog(state: GoogleState, text: string, ok: boolean) {
  state.log = [{ at: new Date().toISOString(), text, ok }, ...state.log].slice(0, LOG_SIZE);
}

// ---------- OAuth ----------

export function redirectUri(origin: string): string {
  return `${origin}/api/admin/google/callback`;
}

// The login cookie is SameSite=Strict, so it is not sent when Google
// redirects back: the callback trusts this signed, short-lived state instead.
export async function authUrl(env: GoogleEnv, origin: string, sign: (v: string) => Promise<string>): Promise<string> {
  const exp = String(Date.now() + 10 * 60_000);
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(origin),
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    state: `${exp}.${await sign(`google:${exp}`)}`
  });
  return `${AUTH_URL}?${params}`;
}

export async function checkState(state: string, sign: (v: string) => Promise<string>, equal: (a: string, b: string) => Promise<boolean>): Promise<boolean> {
  const [exp, sig] = state.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return equal(sig, await sign(`google:${exp}`));
}

// Exchanges the code, then finds the Ironwood profile among those the account manages.
export async function connect(env: GoogleEnv, origin: string, code: string): Promise<GoogleState> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(origin),
      grant_type: 'authorization_code'
    })
  });
  const tok = (await res.json()) as { access_token?: string; refresh_token?: string; error_description?: string };
  if (!tok.access_token || !tok.refresh_token) throw new Error(tok.error_description || 'Google non ha restituito l’autorizzazione');

  const found = await findLocation(tok.access_token);
  const previous = await readGoogle(env);
  const state: GoogleState = {
    refreshToken: tok.refresh_token,
    ...found,
    connectedAt: new Date().toISOString(),
    weekly: previous?.weekly ?? true,
    postedPhotos: previous?.postedPhotos ?? [],
    log: previous?.log ?? []
  };
  addLog(state, `Collegato al profilo “${found.title}”`, true);
  await writeGoogle(env, state);
  return state;
}

async function findLocation(token: string): Promise<{ account: string; location: string; title: string }> {
  const accounts = await gget<{ accounts?: { name: string }[] }>(ACCOUNTS_URL, token);
  let fallback: { account: string; location: string; title: string } | null = null;
  for (const acc of accounts.accounts ?? []) {
    const list = await gget<{ locations?: { name: string; title: string }[] }>(`${INFO_URL}/${acc.name}/locations?readMask=name,title&pageSize=100`, token);
    for (const loc of list.locations ?? []) {
      const hit = { account: acc.name, location: loc.name, title: loc.title };
      if (LOCATION_TITLE.test(loc.title)) return hit;
      fallback ??= hit;
    }
  }
  if (!fallback) throw new Error('Nessun profilo dell’attività trovato in questo account Google');
  return fallback;
}

async function accessToken(env: GoogleEnv, state: GoogleState): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      refresh_token: state.refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const tok = (await res.json()) as { access_token?: string; error?: string };
  if (!tok.access_token) {
    throw new Error(tok.error === 'invalid_grant' ? 'Autorizzazione Google scaduta o revocata: premi di nuovo “Collega a Google”' : 'Google non risponde, riprova più tardi');
  }
  return tok.access_token;
}

async function gget<T>(url: string, token: string): Promise<T> {
  return gcall<T>(url, token, 'GET');
}

async function gcall<T>(url: string, token: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { message?: string; status?: string } };
  if (!res.ok) {
    // Before Google approves the project the quota is 0 and every call fails this way.
    if (res.status === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') throw new Error('Google non ha ancora abilitato l’accesso (quota 0): attendi l’approvazione');
    throw new Error(data.error?.message || `Errore Google ${res.status}`);
  }
  return data;
}

// The v4 API addresses the profile as accounts/{a}/locations/{l}.
function v4Parent(state: GoogleState): string {
  return `${V4_URL}/${state.account}/${state.location}`;
}

// ---------- offer post ----------

export type OfferForPost = {
  checkIn: string;
  checkOut: string;
  price: number;
  unit: 'stay' | 'night';
  originalPrice: number | null;
  showFrom: string;
  showUntil: string;
  image: string;
  skiStay: boolean;
};

const fmtDay = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const fmtEuro = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(2).replace('.', ',')} €`;
const gdate = (d: string) => ({ year: Number(d.slice(0, 4)), month: Number(d.slice(5, 7)), day: Number(d.slice(8, 10)) });

// Text of the post (Italian, like the profile). The lifts are mentioned only
// for stays in the ski season, as on the site's pop-up.
export function offerPostBody(o: OfferForPost, siteOrigin: string) {
  const nights = Math.round((Date.parse(o.checkOut) - Date.parse(o.checkIn)) / 86400_000);
  const price = fmtEuro(o.price) + (o.unit === 'night' ? ' a notte' : '');
  const was = o.originalPrice ? ` invece di ${fmtEuro(o.originalPrice)} (-${Math.round(((o.originalPrice - o.price) / o.originalPrice) * 100)}%)` : '';
  const where = o.skiStay ? '100 m dagli impianti' : '15 minuti a piedi dal centro';
  const summary =
    `Offerta speciale a Ironwood Livigno: soggiorno dal ${fmtDay(o.checkIn)} al ${fmtDay(o.checkOut)} ` +
    `(${nights} ${nights === 1 ? 'notte' : 'notti'}) a ${price}${was}. ` +
    `Sauna e bagno turco privati, fino a 6 ospiti in 3 camere, ${where}. ` +
    `Una sola casa: quando è prenotata, l’offerta finisce. Scrivici su WhatsApp al 0342 929285.`;
  return {
    languageCode: 'it',
    topicType: 'OFFER',
    summary,
    event: {
      title: `${price} · ${nights} ${nights === 1 ? 'notte' : 'notti'}`,
      schedule: { startDate: gdate(o.showFrom), endDate: gdate(o.showUntil) }
    },
    offer: {
      redeemOnlineUrl: `${siteOrigin}/it?utm_source=google&utm_medium=gbp&utm_campaign=offerta`,
      termsConditions: 'Soggetto a disponibilità. Prezzo per tutta la casa, fino a 6 ospiti.'
    },
    media: [{ mediaFormat: 'PHOTO', sourceUrl: `${siteOrigin}/images/${o.image}.jpg` }]
  };
}

export async function createOfferPost(env: GoogleEnv, state: GoogleState, o: OfferForPost, siteOrigin: string): Promise<string> {
  const token = await accessToken(env, state);
  const post = await gcall<{ name: string }>(`${v4Parent(state)}/localPosts`, token, 'POST', offerPostBody(o, siteOrigin));
  return post.name;
}

// `name` is the full resource name returned at creation.
export async function deletePost(env: GoogleEnv, state: GoogleState, name: string): Promise<void> {
  const token = await accessToken(env, state);
  await gcall(`${V4_URL}/${name}`, token, 'DELETE').catch((err: Error) => {
    if (!/not found|404/i.test(err.message)) throw err;
  });
}

// ---------- weekly photo ----------

export async function uploadPhoto(env: GoogleEnv, state: GoogleState, sourceUrl: string): Promise<void> {
  const token = await accessToken(env, state);
  await gcall(`${v4Parent(state)}/media`, token, 'POST', { mediaFormat: 'PHOTO', locationAssociation: { category: 'ADDITIONAL' }, sourceUrl });
}
