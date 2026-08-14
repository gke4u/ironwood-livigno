// Minimal signed-cookie session for the /admin dashboard. Deliberately not
// Cloudflare Access: Access would need Zero Trust configured on the
// account/domain outside this codebase, so a self-contained password +
// HMAC-signed cookie (Web Crypto only, no dependency) keeps the whole
// login mechanism reviewable and deployable from this repo alone, same as
// everything else this Worker does.
const COOKIE_NAME = 'ironwood_admin';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function sha256(input: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return new Uint8Array(digest);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toBase64Url(new Uint8Array(signature));
}

// Constant-time comparison via a SHA-256 digest of each side first, rather
// than comparing the raw strings — that sidesteps both a length-based
// short-circuit and any difference in per-character comparison time,
// without needing the two inputs to already be equal length.
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

export async function checkPassword(candidate: string, expected: string): Promise<boolean> {
  return safeEqual(candidate, expected);
}

export async function createSessionCookie(secret: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  const sig = await hmac(secret, payload);
  return `${COOKIE_NAME}=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

export async function hasValidSession(request: Request, secret: string): Promise<boolean> {
  const value = readCookie(request, COOKIE_NAME);
  if (!value) return false;
  const dot = value.indexOf('.');
  if (dot === -1) return false;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = await hmac(secret, payload);
  if (!(await safeEqual(sig, expected))) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return true;
}
