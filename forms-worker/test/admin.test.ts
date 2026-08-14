import { env } from 'cloudflare:test';
import { describe, expect, it, beforeEach } from 'vitest';
import {
  fetchStatusCounts,
  fetchSubmissions,
  fetchSubmissionById,
  fetchOverlappingConfirmed,
  rowToSubmission,
  renderDashboardPage,
  STATUS_FOR_KIND,
  PAGE_SIZE,
  type SubmissionRow
} from '../src/admin';

type SeedRow = Partial<SubmissionRow> & { name: string; email: string; token?: string };

// Storage isolation in this vitest-pool-workers version is per test *file*,
// not per test — every `it()` below shares one D1 instance, so leftover
// rows from an earlier test would otherwise leak into a later one's counts
// and search results.
beforeEach(async () => {
  await env.DB.exec('DELETE FROM submissions');
});

async function seed(input: SeedRow) {
  const row = { ...input, token: input.token ?? crypto.randomUUID() };
  await env.DB.prepare(
    `INSERT INTO submissions
      (created_at, name, email, phone, checkin_display, checkin_iso, checkout_display, checkout_iso,
       guests, adults, children, children_ages, extra_breakfast, extra_ebike, source, message, locale, status, is_spam, cf_country, token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      row.created_at ?? '2026-08-14T08:00:00.000Z',
      row.name,
      row.email,
      row.phone ?? null,
      row.checkin_display ?? '1 settembre 2026',
      row.checkin_iso ?? '2026-09-01',
      row.checkout_display ?? '3 settembre 2026',
      row.checkout_iso ?? '2026-09-03',
      row.guests ?? 2,
      row.adults ?? 2,
      row.children ?? 0,
      row.children_ages ?? null,
      row.extra_breakfast ?? 0,
      row.extra_ebike ?? 0,
      row.source ?? null,
      row.message ?? null,
      row.locale ?? 'it',
      row.status ?? 'new',
      // @ts-expect-error test-only field, not part of SubmissionRow
      row.is_spam ?? 0,
      row.cf_country ?? null,
      row.token
    )
    .run();
}

describe('fetchStatusCounts', () => {
  it('counts by status and excludes spam', async () => {
    await seed({ name: 'A', email: 'a@example.com', token: 't1', status: 'new' });
    await seed({ name: 'B', email: 'b@example.com', token: 't2', status: 'new' });
    await seed({ name: 'C', email: 'c@example.com', token: 't3', status: 'confirmed' });
    // @ts-expect-error test-only field
    await seed({ name: 'Spam', email: 'spam@example.com', token: 't4', status: 'new', is_spam: 1 });

    const counts = await fetchStatusCounts(env.DB);
    expect(counts.all).toBe(3);
    expect(counts.new).toBe(2);
    expect(counts.confirmed).toBe(1);
  });
});

async function rowsOf(status: Parameters<typeof fetchSubmissions>[1], q: string, page = 1) {
  return (await fetchSubmissions(env.DB, status, q, page)).rows;
}

describe('fetchSubmissions', () => {
  it('filters by status', async () => {
    await seed({ name: 'A', email: 'a@example.com', token: 't1', status: 'new' });
    await seed({ name: 'B', email: 'b@example.com', token: 't2', status: 'confirmed' });

    const confirmed = await rowsOf('confirmed', '');
    expect(confirmed.map((r) => r.name)).toEqual(['B']);
  });

  it('searches by name or email, case-insensitively', async () => {
    await seed({ name: 'Marco Bianchi', email: 'marco@example.it', token: 't1' });
    await seed({ name: 'Sophie Bernard', email: 'sophie@example.fr', token: 't2' });

    expect((await rowsOf('all', 'marco')).map((r) => r.name)).toEqual(['Marco Bianchi']);
    expect((await rowsOf('all', 'EXAMPLE.FR')).map((r) => r.name)).toEqual(['Sophie Bernard']);
    expect(await rowsOf('all', 'no-such-guest')).toEqual([]);
  });

  it('never returns spam-flagged rows, regardless of filter', async () => {
    // @ts-expect-error test-only field
    await seed({ name: 'Spam Bot', email: 'spam@example.com', token: 't1', is_spam: 1 });
    expect(await rowsOf('all', '')).toEqual([]);
    expect(await rowsOf('all', 'Spam')).toEqual([]);
  });

  it('orders newest first', async () => {
    await seed({ name: 'Older', email: 'a@example.com', token: 't1', created_at: '2026-08-01T00:00:00.000Z' });
    await seed({ name: 'Newer', email: 'b@example.com', token: 't2', created_at: '2026-08-10T00:00:00.000Z' });
    const rows = await rowsOf('all', '');
    expect(rows.map((r) => r.name)).toEqual(['Newer', 'Older']);
  });

  it('paginates: page 2 picks up where page 1 left off, and hasMore reflects whether a next page exists', async () => {
    for (let i = 0; i < PAGE_SIZE + 5; i++) {
      await seed({ name: `Guest ${i}`, email: `guest${i}@example.com`, created_at: `2026-08-01T00:${String(i).padStart(2, '0')}:00.000Z` });
    }
    const page1 = await fetchSubmissions(env.DB, 'all', '', 1);
    expect(page1.rows).toHaveLength(PAGE_SIZE);
    expect(page1.hasMore).toBe(true);

    const page2 = await fetchSubmissions(env.DB, 'all', '', 2);
    expect(page2.rows).toHaveLength(5);
    expect(page2.hasMore).toBe(false);

    const page1Ids = new Set(page1.rows.map((r) => r.id));
    for (const row of page2.rows) expect(page1Ids.has(row.id)).toBe(false);
  });
});

describe('fetchSubmissionById', () => {
  it('returns the row for a real, non-spam id', async () => {
    await seed({ name: 'Marco', email: 'marco@example.it', token: 't1' });
    const rows = await rowsOf('all', '');
    const found = await fetchSubmissionById(env.DB, rows[0].id);
    expect(found?.name).toBe('Marco');
  });

  it('returns null for a spam row even by exact id', async () => {
    // @ts-expect-error test-only field
    await seed({ name: 'Spam', email: 'spam@example.com', token: 't1', is_spam: 1 });
    const row = await env.DB.prepare('SELECT id FROM submissions WHERE token = ?').bind('t1').first<{ id: number }>();
    expect(await fetchSubmissionById(env.DB, row!.id)).toBeNull();
  });

  it('returns null for a non-existent id', async () => {
    expect(await fetchSubmissionById(env.DB, 999999)).toBeNull();
  });
});

describe('fetchOverlappingConfirmed', () => {
  it('flags a confirmed request whose stay overlaps this one', async () => {
    await seed({ name: 'Existing', email: 'a@example.com', token: 't1', status: 'confirmed', checkin_iso: '2026-09-01', checkout_iso: '2026-09-10' });
    await seed({ name: 'New Request', email: 'b@example.com', token: 't2', status: 'new', checkin_iso: '2026-09-05', checkout_iso: '2026-09-12' });

    const viewed = await fetchSubmissionById(env.DB, (await rowsOf('all', 'New Request'))[0].id);
    const conflicts = await fetchOverlappingConfirmed(env.DB, viewed!);
    expect(conflicts.map((c) => c.name)).toEqual(['Existing']);
  });

  it('does not flag a confirmed request with no date overlap', async () => {
    await seed({ name: 'Existing', email: 'a@example.com', token: 't1', status: 'confirmed', checkin_iso: '2026-09-01', checkout_iso: '2026-09-10' });
    await seed({ name: 'New Request', email: 'b@example.com', token: 't2', status: 'new', checkin_iso: '2026-10-01', checkout_iso: '2026-10-05' });

    const viewed = await fetchSubmissionById(env.DB, (await rowsOf('all', 'New Request'))[0].id);
    expect(await fetchOverlappingConfirmed(env.DB, viewed!)).toEqual([]);
  });

  it('treats a same-day checkout/checkin changeover as adjacent, not overlapping', async () => {
    await seed({ name: 'Existing', email: 'a@example.com', token: 't1', status: 'confirmed', checkin_iso: '2026-09-01', checkout_iso: '2026-09-10' });
    await seed({ name: 'New Request', email: 'b@example.com', token: 't2', status: 'new', checkin_iso: '2026-09-10', checkout_iso: '2026-09-15' });

    const viewed = await fetchSubmissionById(env.DB, (await rowsOf('all', 'New Request'))[0].id);
    expect(await fetchOverlappingConfirmed(env.DB, viewed!)).toEqual([]);
  });

  it('ignores an overlapping request that is not itself confirmed', async () => {
    await seed({ name: 'Also Pending', email: 'a@example.com', token: 't1', status: 'pending', checkin_iso: '2026-09-01', checkout_iso: '2026-09-10' });
    await seed({ name: 'New Request', email: 'b@example.com', token: 't2', status: 'new', checkin_iso: '2026-09-05', checkout_iso: '2026-09-12' });

    const viewed = await fetchSubmissionById(env.DB, (await rowsOf('all', 'New Request'))[0].id);
    expect(await fetchOverlappingConfirmed(env.DB, viewed!)).toEqual([]);
  });

  it('never flags a request against itself', async () => {
    await seed({ name: 'Solo', email: 'a@example.com', token: 't1', status: 'confirmed', checkin_iso: '2026-09-01', checkout_iso: '2026-09-10' });
    const viewed = await fetchSubmissionById(env.DB, (await rowsOf('all', 'Solo'))[0].id);
    expect(await fetchOverlappingConfirmed(env.DB, viewed!)).toEqual([]);
  });
});

describe('rowToSubmission', () => {
  it('parses children_ages JSON and falls back adults to guests when null', () => {
    const row = {
      name: 'Lena', email: 'lena@example.de', phone: null,
      checkin_display: '1 sett', checkin_iso: '2026-09-01', checkout_display: '3 sett', checkout_iso: '2026-09-03',
      guests: 4, adults: null, children: 2, children_ages: '[5,9]',
      extra_breakfast: 1, extra_ebike: 0, source: null, message: null, locale: 'de', status: 'new', cf_country: null,
      id: 1, token: 't1', created_at: '2026-08-14T00:00:00.000Z'
    } satisfies SubmissionRow;
    const submission = rowToSubmission(row);
    expect(submission.adults).toBe(4);
    expect(submission.children_ages).toEqual([5, 9]);
    expect(submission.extra_breakfast).toBe(true);
    expect(submission.extra_ebike).toBe(false);
  });
});

describe('STATUS_FOR_KIND', () => {
  it('maps every reply kind to the status the dashboard filters on', () => {
    expect(STATUS_FOR_KIND.available).toBe('confirmed');
    expect(STATUS_FOR_KIND.unavailable).toBe('declined');
    expect(STATUS_FOR_KIND.pending).toBe('pending');
    expect(STATUS_FOR_KIND.blank).toBe('replied');
    expect(STATUS_FOR_KIND.ai).toBe('replied');
  });
});

describe('renderDashboardPage escaping', () => {
  it('never emits guest-controlled markup unescaped, in the list or the detail panel', async () => {
    const row: SubmissionRow = {
      id: 1,
      token: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      created_at: '2026-08-14T08:00:00.000Z',
      name: '<b>Evil</b> "Name"',
      email: 'evil@example.com',
      phone: null,
      checkin_display: '1 settembre 2026',
      checkout_display: '3 settembre 2026',
      checkin_iso: '2026-09-01',
      checkout_iso: '2026-09-03',
      guests: 2,
      adults: 2,
      children: 0,
      children_ages: null,
      extra_breakfast: 0,
      extra_ebike: 0,
      source: null,
      message: '<script>alert(1)</script>',
      locale: 'it',
      status: 'new',
      cf_country: null
    };

    const html = renderDashboardPage({
      counts: { all: 1, new: 1, pending: 0, confirmed: 0, declined: 0, replied: 0 },
      rows: [row],
      activeStatus: 'all',
      q: '',
      page: 1,
      hasMore: false,
      selectedId: 1,
      detail: { row, nights: 2, kind: 'blank', body: 'quoted text' },
      sent: false
    });

    expect(html).not.toContain('<b>Evil</b>');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;b&gt;Evil&lt;/b&gt;');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('marks the app as having a detail open only when one is selected (drives the mobile list/detail toggle)', () => {
    const row: SubmissionRow = {
      id: 1, token: 't1', created_at: '2026-08-14T08:00:00.000Z', name: 'Marco', email: 'marco@example.it', phone: null,
      checkin_display: '1 settembre 2026', checkout_display: '3 settembre 2026', checkin_iso: '2026-09-01', checkout_iso: '2026-09-03',
      guests: 2, adults: 2, children: 0, children_ages: null, extra_breakfast: 0, extra_ebike: 0, source: null, message: null,
      locale: 'it', status: 'new', cf_country: null
    };
    const baseParams = { counts: { all: 1 }, rows: [row], activeStatus: 'all' as const, q: '', page: 1, hasMore: false, sent: false };

    const withDetail = renderDashboardPage({ ...baseParams, selectedId: 1, detail: { row, nights: 2, kind: 'blank', body: 'x' } });
    expect(withDetail).toContain('class="app has-detail"');
    expect(withDetail).toContain('back-link');

    // The STYLES block's own CSS selectors (`.app.has-detail`) always
    // contain the substring "has-detail", so assert on the actual class
    // attribute on the .app div, not a bare substring match.
    const withoutDetail = renderDashboardPage({ ...baseParams, detail: null });
    expect(withoutDetail).toContain('<div class="app">');
    expect(withoutDetail).not.toContain('class="app has-detail"');
  });

  it('shows the guest count with each child\'s age spelled out, not a parenthetical', () => {
    const row: SubmissionRow = {
      id: 1, token: 't1', created_at: '2026-08-14T08:00:00.000Z', name: 'Lena Fischer', email: 'lena@example.de', phone: null,
      checkin_display: '1 settembre 2026', checkout_display: '3 settembre 2026', checkin_iso: '2026-09-01', checkout_iso: '2026-09-03',
      guests: 6, adults: 4, children: 2, children_ages: '[5,12]', extra_breakfast: 0, extra_ebike: 0, source: null, message: null,
      locale: 'de', status: 'new', cf_country: null
    };
    const html = renderDashboardPage({
      counts: { all: 1 },
      rows: [row],
      activeStatus: 'all',
      q: '',
      page: 1,
      hasMore: false,
      selectedId: 1,
      detail: { row, nights: 2, kind: 'blank', body: 'x' },
      sent: false
    });
    // Always Italian in the dashboard, regardless of the guest's own site
    // locale (de here) — this is Francesco's own view of the request.
    expect(html).toContain('4 adulti 2 bambini 5 anni e 12 anni');
    expect(html).not.toContain('età:');
  });
});
