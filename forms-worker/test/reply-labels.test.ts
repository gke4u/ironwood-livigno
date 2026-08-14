import { describe, expect, it } from 'vitest';
import { replyLabelsFor, formatGuestsSentence } from '../src/reply-labels';

describe('formatGuestsSentence', () => {
  it('spells out adults, children, and each child age as plain text — the example from the request', () => {
    const labels = replyLabelsFor('it');
    expect(formatGuestsSentence(labels, 4, 2, [5, 12])).toBe('4 adulti 2 bambini 5 anni e 12 anni');
  });

  it('omits the children/ages clause entirely when there are no children', () => {
    const labels = replyLabelsFor('it');
    expect(formatGuestsSentence(labels, 2, 0, undefined)).toBe('2 adulti');
  });

  it('uses singular forms for exactly one adult, one child, and a one-year-old', () => {
    const labels = replyLabelsFor('it');
    expect(formatGuestsSentence(labels, 1, 1, [1])).toBe('1 adulto 1 bambino 1 anno');
  });

  it('joins three or more ages with commas and "e" before the last one', () => {
    const labels = replyLabelsFor('it');
    expect(formatGuestsSentence(labels, 2, 3, [3, 7, 9])).toBe('2 adulti 3 bambini 3 anni, 7 anni e 9 anni');
  });

  it('never emits parentheses or an "età:" label', () => {
    const labels = replyLabelsFor('it');
    const sentence = formatGuestsSentence(labels, 4, 2, [5, 12]);
    expect(sentence).not.toContain('(');
    expect(sentence).not.toContain(')');
    expect(sentence).not.toContain('età');
  });

  it('uses the guest locale\'s own words, not Italian, for a non-Italian locale', () => {
    const labels = replyLabelsFor('de');
    expect(formatGuestsSentence(labels, 4, 2, [5, 12])).toBe('4 Erwachsene 2 Kinder 5 Jahre und 12 Jahre');
  });

  it('falls back to Italian for an unknown locale', () => {
    const labels = replyLabelsFor('xx');
    expect(formatGuestsSentence(labels, 2, 0)).toBe('2 adulti');
  });
});
