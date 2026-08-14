import { describe, expect, it } from 'vitest';
import { buildGuestReceipt } from '../src/guest-receipt';
import type { Submission } from '../src/index';

function baseSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    name: 'Anna Kowalski',
    email: 'anna@example.com',
    checkin: '22 agosto 2026',
    checkin_iso: '2026-08-22',
    checkout: '29 agosto 2026',
    checkout_iso: '2026-08-29',
    guests: 2,
    adults: 2,
    children: 0,
    ...overrides
  };
}

function countTag(html: string, tag: string): { open: number; close: number } {
  return {
    open: (html.match(new RegExp(`<${tag}[ >]`, 'g')) ?? []).length,
    close: (html.match(new RegExp(`</${tag}>`, 'g')) ?? []).length
  };
}

describe('buildGuestReceipt', () => {
  it('produces well-formed, tag-balanced HTML for a full submission', () => {
    const receipt = buildGuestReceipt(
      baseSubmission({
        children: 1,
        children_ages: [6],
        extra_breakfast: true,
        extra_ebike: true,
        message: 'Ciao! Avete un seggiolone disponibile?',
        locale: 'it'
      })
    );
    for (const tag of ['table', 'tr', 'td']) {
      const { open, close } = countTag(receipt.html, tag);
      expect(open, `${tag} open/close mismatch`).toBe(close);
    }
  });

  it('stays well-formed with no message and no extras (minimal submission)', () => {
    const receipt = buildGuestReceipt(baseSubmission());
    for (const tag of ['table', 'tr', 'td']) {
      const { open, close } = countTag(receipt.html, tag);
      expect(open).toBe(close);
    }
  });

  it('escapes a guest name/message containing HTML instead of injecting it', () => {
    const receipt = buildGuestReceipt(
      baseSubmission({
        name: '<b>Evil</b> "Name" & Co',
        message: '<script>alert(1)</script> & "quotes" <here>'
      })
    );
    expect(receipt.html).not.toContain('<script>alert(1)</script>');
    expect(receipt.html).not.toContain('<b>Evil</b>');
    expect(receipt.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('renders the subject and greeting in the guest site locale, not hardcoded Italian', () => {
    const it_ = buildGuestReceipt(baseSubmission({ locale: 'it' }));
    const en = buildGuestReceipt(baseSubmission({ locale: 'en' }));
    const de = buildGuestReceipt(baseSubmission({ locale: 'de' }));
    expect(it_.subject).not.toBe(en.subject);
    expect(en.subject).not.toBe(de.subject);
    expect(en.html.toLowerCase()).toContain('anna');
  });
});
