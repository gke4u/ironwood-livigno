import { describe, expect, it } from 'vitest';
import { quickReplyText, buildQuickReplies } from '../src/quick-replies';
import type { Submission } from '../src/index';

function baseSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    name: 'Marco Bianchi',
    email: 'marco@example.it',
    checkin: '22 agosto 2026',
    checkin_iso: '2026-08-22',
    checkout: '29 agosto 2026',
    checkout_iso: '2026-08-29',
    guests: 6,
    adults: 4,
    children: 2,
    children_ages: [5, 12],
    ...overrides
  };
}

describe('quickReplyText', () => {
  it('never wraps the dates/guest count in parentheses, in any locale', () => {
    for (const locale of ['it', 'en', 'de', 'fr', 'da', 'pl', 'cs', 'no', 'nl', 'zh', 'ja']) {
      const data = baseSubmission({ locale });
      for (const kind of ['available', 'unavailable', 'pending'] as const) {
        const text = quickReplyText(data, 7, kind);
        expect(text, `${locale}/${kind}`).not.toContain('(');
        expect(text, `${locale}/${kind}`).not.toContain(')');
      }
    }
  });

  it('spells out the guest count with each child\'s age, in the guest\'s own locale', () => {
    const it_ = quickReplyText(baseSubmission({ locale: 'it' }), 7, 'available');
    expect(it_).toContain('4 adulti 2 bambini 5 anni e 12 anni');

    const de = quickReplyText(baseSubmission({ locale: 'de' }), 7, 'pending');
    expect(de).toContain('4 Erwachsene 2 Kinder 5 Jahre und 12 Jahre');
  });

  it('omits the guest count entirely for "unavailable" (dates only)', () => {
    const text = quickReplyText(baseSubmission({ locale: 'it' }), 7, 'unavailable');
    expect(text).not.toContain('adulti');
  });
});

describe('buildQuickReplies', () => {
  it('shows the Italian preview using Italian guest-count words even for a non-Italian guest', () => {
    const options = buildQuickReplies(baseSubmission({ locale: 'de' }), 7, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    const available = options.find((o) => o.id === 'available')!;
    expect(available.italianPreview).toContain('4 adulti 2 bambini 5 anni e 12 anni');
    expect(available.italianPreview).not.toContain('(');
  });
});
