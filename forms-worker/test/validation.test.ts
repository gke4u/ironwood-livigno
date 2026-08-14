import { describe, expect, it } from 'vitest';
import { validate, isSpam } from '../src/validation';

function validSubmission() {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + 10);
  const checkout = new Date();
  checkout.setDate(checkout.getDate() + 13);
  return {
    name: 'Anna Kowalski',
    email: 'anna@example.com',
    checkin_iso: checkin.toISOString().slice(0, 10),
    checkout_iso: checkout.toISOString().slice(0, 10),
    adults: 2,
    children: 0
  };
}

describe('validate', () => {
  it('accepts a well-formed submission', () => {
    expect(validate(validSubmission())).toBeNull();
  });

  it('rejects a missing name', () => {
    expect(validate({ ...validSubmission(), name: '' })).toBe('name required');
  });

  it('rejects a name carrying a control character (header-injection guard)', () => {
    expect(validate({ ...validSubmission(), name: 'Anna\r\nBcc: evil@example.com' })).toBe('invalid name');
  });

  it('rejects an invalid email', () => {
    expect(validate({ ...validSubmission(), email: 'not-an-email' })).toBe('invalid email');
  });

  it('rejects an email containing a fragment character', () => {
    expect(validate({ ...validSubmission(), email: 'a#b@example.com' })).toBe('invalid email');
  });

  it('rejects checkout on or before checkin', () => {
    const s = validSubmission();
    expect(validate({ ...s, checkout_iso: s.checkin_iso })).toBe('checkout must be after checkin');
  });

  it('rejects a checkin date in the past', () => {
    expect(validate({ ...validSubmission(), checkin_iso: '2000-01-01', checkout_iso: '2000-01-03' })).toBe('checkin cannot be in the past');
  });

  it('rejects a party larger than the apartment sleeps', () => {
    expect(validate({ ...validSubmission(), adults: 5, children: 3 })).toBe('too many guests');
  });

  it('requires one age per child', () => {
    expect(validate({ ...validSubmission(), children: 2, children_ages: [5] })).toBe('invalid children ages');
  });

  it('accepts valid children ages', () => {
    expect(validate({ ...validSubmission(), adults: 2, children: 1, children_ages: [7] })).toBeNull();
  });

  it('rejects a child age out of range', () => {
    expect(validate({ ...validSubmission(), children: 1, children_ages: [18] })).toBe('invalid children ages');
  });

  it('rejects an overlong message', () => {
    expect(validate({ ...validSubmission(), message: 'x'.repeat(2001) })).toBe('message too long');
  });
});

describe('isSpam', () => {
  it('is false when the honeypot field is empty', () => {
    expect(isSpam({ company: '' })).toBe(false);
    expect(isSpam({})).toBe(false);
  });

  it('is true when the honeypot field was filled in', () => {
    expect(isSpam({ company: 'Acme Bots Inc' })).toBe(true);
  });
});
