// Integration tests that go through the real fetch() handler and real
// (isolated, per-file) local D1 — the same routing, auth, and rendering
// code path a real request hits, not mocks of it.
//
// Deliberately never exercised here: a successful /submit from a real
// (non-honeypot) guest, and a successful /reply/:token/send. Both call
// sendMail() (smtp.ts), which opens a real TCP connection to
// smtp.mailbox.org over cloudflare:sockets — there is no interception
// point for that below the HTTP layer, so a test hitting either path all
// the way through would make a real, network-dependent connection attempt
// against the production mailbox on every test run. Everything upstream of
// that call (validation, rate limiting, auth, rendering, the D1 write
// itself via the honeypot path below) is covered instead.
import { env, createExecutionContext, waitOnExecutionContext, createScheduledController } from 'cloudflare:test';
import { describe, expect, it, beforeEach } from 'vitest';
import worker from '../src/index';

const ORIGIN = 'https://ironwoodlivigno.com';

// Storage isolation in this vitest-pool-workers version is per test *file*
// (D1 rows, and this Worker's rate-limiter counters), not per test — so a
// leftover row from an earlier test would leak into a later one's listing,
// and every fresh login() call spends part of the same 5-per-60s admin
// login budget the whole file shares. D1 gets wiped between tests below;
// the login budget is handled by sharedCookie() reusing one session
// instead of logging in again for every test that merely needs to be
// authenticated.
beforeEach(async () => {
  await env.DB.exec('DELETE FROM submissions');
});

let cachedCookie: string | null = null;
async function sharedCookie(): Promise<string> {
  if (!cachedCookie) cachedCookie = await login();
  return cachedCookie;
}

async function call(request: Request): Promise<Response> {
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

function validPayload(overrides: Record<string, unknown> = {}) {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + 10);
  const checkout = new Date();
  checkout.setDate(checkout.getDate() + 13);
  return {
    name: 'Test Guest',
    email: 'guest@example.com',
    checkin: '10 settembre 2026',
    checkin_iso: checkin.toISOString().slice(0, 10),
    checkout: '13 settembre 2026',
    checkout_iso: checkout.toISOString().slice(0, 10),
    adults: 2,
    children: 0,
    ...overrides
  };
}

async function login(): Promise<string> {
  const res = await call(
    new Request('https://forms.ironwoodlivigno.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'password=test-password'
    })
  );
  const setCookie = res.headers.get('Set-Cookie');
  if (!setCookie) throw new Error('login did not set a cookie');
  return setCookie.split(';')[0];
}

describe('POST /submit', () => {
  it('rejects a request with no Origin header', async () => {
    const res = await call(new Request('https://forms.ironwoodlivigno.com/submit', { method: 'POST', body: '{}' }));
    expect(res.status).toBe(403);
  });

  it('rejects malformed JSON from the allowed origin', async () => {
    const res = await call(
      new Request('https://forms.ironwoodlivigno.com/submit', {
        method: 'POST',
        headers: { Origin: ORIGIN },
        body: 'not json'
      })
    );
    expect(res.status).toBe(400);
  });

  it('rejects a submission failing validation, before ever touching D1', async () => {
    const res = await call(
      new Request('https://forms.ironwoodlivigno.com/submit', {
        method: 'POST',
        headers: { Origin: ORIGIN, 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload({ name: '' }))
      })
    );
    expect(res.status).toBe(400);
    const body = await res.json<{ ok: boolean; error: string }>();
    expect(body.error).toBe('name required');
  });

  it('saves a honeypot-tripped submission as spam without sending any email, and returns a normal-looking success', async () => {
    const res = await call(
      new Request('https://forms.ironwoodlivigno.com/submit', {
        method: 'POST',
        headers: { Origin: ORIGIN, 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload({ company: 'I am a bot' }))
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json<{ ok: boolean }>();
    expect(body.ok).toBe(true);

    const row = await env.DB.prepare('SELECT is_spam FROM submissions WHERE email = ?').bind('guest@example.com').first<{ is_spam: number }>();
    expect(row?.is_spam).toBe(1);
  });
});

describe('/admin auth', () => {
  it('redirects to /admin/login when there is no session', async () => {
    const res = await call(new Request('https://forms.ironwoodlivigno.com/admin', { redirect: 'manual' }));
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toContain('/admin/login');
  });

  it('rejects a wrong password', async () => {
    const res = await call(
      new Request('https://forms.ironwoodlivigno.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'password=wrong'
      })
    );
    expect(res.status).toBe(401);
  });

  it('accepts the right password and the resulting cookie unlocks /admin', async () => {
    const cookie = await login();
    const res = await call(new Request('https://forms.ironwoodlivigno.com/admin', { headers: { Cookie: cookie } }));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Ironwood Desk');
  });

  it('logout clears the session so /admin redirects again', async () => {
    const cookie = await login();
    const logoutRes = await call(new Request('https://forms.ironwoodlivigno.com/admin/logout', { method: 'POST', headers: { Cookie: cookie }, redirect: 'manual' }));
    const clearedCookie = logoutRes.headers.get('Set-Cookie')!.split(';')[0];

    const res = await call(new Request('https://forms.ironwoodlivigno.com/admin', { headers: { Cookie: clearedCookie }, redirect: 'manual' }));
    expect(res.status).toBe(302);
  });
});

async function seedSubmission(overrides: Record<string, unknown> = {}) {
  const token = (overrides.token as string) ?? crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO submissions
      (created_at, name, email, checkin_display, checkin_iso, checkout_display, checkout_iso, guests, adults, children, extra_breakfast, extra_ebike, status, is_spam, token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 0, ?)`
  )
    .bind(
      overrides.created_at ?? '2026-08-14T08:00:00.000Z',
      overrides.name ?? 'Marco Bianchi',
      overrides.email ?? 'marco@example.it',
      '5 settembre 2026',
      '2026-09-05',
      '8 settembre 2026',
      '2026-09-08',
      2,
      2,
      0,
      overrides.status ?? 'new',
      token
    )
    .run();
  const row = await env.DB.prepare('SELECT id FROM submissions WHERE token = ?').bind(token).first<{ id: number }>();
  return { id: row!.id, token };
}

describe('/admin dashboard', () => {
  it('lists and filters submissions', async () => {
    const cookie = await sharedCookie();
    await seedSubmission({ name: 'Marco Bianchi', status: 'new' });
    await seedSubmission({ name: 'Julia van Dijk', status: 'confirmed' });

    const all = await call(new Request('https://forms.ironwoodlivigno.com/admin', { headers: { Cookie: cookie } }));
    const allText = await all.text();
    expect(allText).toContain('Marco Bianchi');
    expect(allText).toContain('Julia van Dijk');

    const filtered = await call(new Request('https://forms.ironwoodlivigno.com/admin?status=confirmed', { headers: { Cookie: cookie } }));
    const filteredText = await filtered.text();
    expect(filteredText).toContain('Julia van Dijk');
    expect(filteredText).not.toContain('Marco Bianchi');
  });

  it('shows the reply-editor detail with the request already quoted, without sending anything', async () => {
    const cookie = await sharedCookie();
    const { id } = await seedSubmission({ name: 'Marco Bianchi' });

    const res = await call(new Request(`https://forms.ironwoodlivigno.com/admin?open=${id}`, { headers: { Cookie: cookie } }));
    const text = await res.text();
    expect(text).toContain('Marco Bianchi');
    expect(text).toContain('name="kind" value="blank"');
  });
});

describe('/admin/delete/:id', () => {
  it('refuses to delete without a valid session, and leaves the row in place', async () => {
    const { id, token } = await seedSubmission();
    const res = await call(new Request(`https://forms.ironwoodlivigno.com/admin/delete/${id}`, { method: 'POST', body: 'returnTo=/admin', redirect: 'manual' }));
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toContain('/admin/login');

    const still = await env.DB.prepare('SELECT 1 FROM submissions WHERE token = ?').bind(token).first();
    expect(still).not.toBeNull();
  });

  it('deletes the row when authenticated, and only that row', async () => {
    const cookie = await sharedCookie();
    const { id: keepId, token: keepToken } = await seedSubmission({ name: 'Keep Me' });
    const { id: deleteId, token: deleteToken } = await seedSubmission({ name: 'Delete Me' });

    const res = await call(
      new Request(`https://forms.ironwoodlivigno.com/admin/delete/${deleteId}`, {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'returnTo=/admin',
        redirect: 'manual'
      })
    );
    expect(res.status).toBe(302);

    expect(await env.DB.prepare('SELECT 1 FROM submissions WHERE token = ?').bind(deleteToken).first()).toBeNull();
    expect(await env.DB.prepare('SELECT 1 FROM submissions WHERE token = ?').bind(keepToken).first()).not.toBeNull();
    expect(keepId).not.toBe(deleteId);
  });
});

describe('/reply/:token/:kind and /reply/:token/send', () => {
  it('renders the blank editor for a real token', async () => {
    const { token } = await seedSubmission();
    const res = await call(new Request(`https://forms.ironwoodlivigno.com/reply/${token}/blank`));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('name="kind" value="blank"');
  });

  it('404s for an unknown token', async () => {
    const res = await call(new Request('https://forms.ironwoodlivigno.com/reply/00000000-0000-0000-0000-000000000000/blank'));
    expect(res.status).toBe(404);
  });

  it('rejects an empty reply body before ever attempting to send', async () => {
    const { token } = await seedSubmission();
    const res = await call(
      new Request(`https://forms.ironwoodlivigno.com/reply/${token}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'text=&kind=blank'
      })
    );
    expect(res.status).toBe(400);
  });

  it('rejects a reply body over the length limit before ever attempting to send', async () => {
    const { token } = await seedSubmission();
    const res = await call(
      new Request(`https://forms.ironwoodlivigno.com/reply/${token}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `text=${encodeURIComponent('x'.repeat(8001))}&kind=blank`
      })
    );
    expect(res.status).toBe(400);
  });
});

describe('scheduled() weekly backup', () => {
  it('writes every row (including spam) to R2 as one JSON snapshot', async () => {
    await seedSubmission({ name: 'Real Guest' });
    await env.DB.prepare(
      `INSERT INTO submissions (created_at, name, email, checkin_display, checkin_iso, checkout_display, checkout_iso, guests, adults, children, extra_breakfast, extra_ebike, status, is_spam, token)
       VALUES ('2026-08-14T08:00:00.000Z', 'Spam Bot', 'spam@example.com', '1 gen', '2026-01-01', '2 gen', '2026-01-02', 1, 1, 0, 0, 0, 'new', 1, ?)`
    )
      .bind(crypto.randomUUID())
      .run();

    // Our scheduled() handler awaits the R2 write directly rather than
    // deferring it to ctx.waitUntil, so calling it needs no execution
    // context here — by the time this resolves the backup is already done.
    await worker.scheduled!(createScheduledController({ cron: '0 4 * * SUN' }), env);

    const listed = await env.BACKUPS.list();
    expect(listed.objects).toHaveLength(1);
    const object = await env.BACKUPS.get(listed.objects[0].key);
    const rows = await object!.json<Array<{ name: string; is_spam: number }>>();
    expect(rows.map((r) => r.name).sort()).toEqual(['Real Guest', 'Spam Bot']);
    // A backup that silently dropped spam-flagged rows would be an
    // incomplete backup — this is the one place in the whole app that
    // deliberately does NOT filter is_spam = 0.
    expect(rows.some((r) => r.is_spam === 1)).toBe(true);
  });
});
