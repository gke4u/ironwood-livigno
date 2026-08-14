import { describe, expect, it } from 'vitest';
import { checkPassword, createSessionCookie, clearSessionCookie, hasValidSession } from '../src/auth';

function requestWithCookie(cookie: string | null): Request {
  const headers = new Headers();
  if (cookie) headers.set('Cookie', cookie);
  return new Request('https://forms.ironwoodlivigno.com/admin', { headers });
}

describe('checkPassword', () => {
  it('accepts the correct password', async () => {
    expect(await checkPassword('correct-horse', 'correct-horse')).toBe(true);
  });

  it('rejects a wrong password', async () => {
    expect(await checkPassword('wrong', 'correct-horse')).toBe(false);
  });

  it('rejects a password differing only in length (no early length-based bypass)', async () => {
    expect(await checkPassword('correct-horse-extra', 'correct-horse')).toBe(false);
  });
});

describe('session cookie', () => {
  it('round-trips: a freshly created cookie is valid', async () => {
    const cookie = await createSessionCookie('secret-1');
    const cookieValue = cookie.split(';')[0];
    expect(await hasValidSession(requestWithCookie(cookieValue), 'secret-1')).toBe(true);
  });

  it('rejects a cookie signed with a different secret', async () => {
    const cookie = await createSessionCookie('secret-1');
    const cookieValue = cookie.split(';')[0];
    expect(await hasValidSession(requestWithCookie(cookieValue), 'secret-2')).toBe(false);
  });

  it('rejects a tampered cookie payload', async () => {
    const cookie = await createSessionCookie('secret-1');
    const cookieValue = cookie.split(';')[0];
    const [name, value] = cookieValue.split('=');
    const [payload, sig] = value.split('.');
    // Push the expiry far into the future without the matching signature.
    const tampered = `${name}=${Number(payload) + 1_000_000_000}.${sig}`;
    expect(await hasValidSession(requestWithCookie(tampered), 'secret-1')).toBe(false);
  });

  it('rejects when there is no cookie at all', async () => {
    expect(await hasValidSession(requestWithCookie(null), 'secret-1')).toBe(false);
  });

  it('clearSessionCookie produces a cookie that immediately expires', () => {
    const cleared = clearSessionCookie();
    expect(cleared).toContain('Max-Age=0');
  });
});
