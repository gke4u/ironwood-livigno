// Pure request-shape validation for /submit — split out from index.ts so it
// has zero Workers-runtime imports (no D1, no cloudflare:sockets via
// smtp.ts) and can be unit-tested with plain vitest, no Workers pool
// needed.
import type { Submission } from './index';

// Deliberately narrower than a full RFC 5321 grammar: this address is later
// embedded raw (unencoded) into `mailto:` hrefs (email-template.ts,
// quick-replies.ts) — the "reply to the guest" buttons — and into the
// notification email's Reply-To header. Real addresses never need the
// characters this excludes, but a raw '#' would start a URI fragment and
// corrupt the mailto link (RFC 3986), and '<>"\\`' have no legitimate
// reason to appear unquoted either. This is the actual boundary that keeps
// those downstream consumers safe, not a general-purpose email validator.
const EMAIL_RE = /^[^\s@#<>"'\\`]+@[^\s@#<>"'\\`]+\.[^\s@#<>"'\\`]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Any C0 control character, including CR/LF — name/phone/source end up
// either in the notification email's headers (name becomes the visible
// From display name and part of the Subject) or its plain-text body.
// Rejecting control characters outright at the boundary is the primary
// defense against email header injection (an embedded \r\n could
// otherwise terminate a header early and smuggle in an extra one); the
// SMTP layer also sanitizes defensively, but this is where a malformed
// submission should actually be refused rather than silently cleaned up.
const CONTROL_CHAR_RE = /[\x00-\x1F\x7F]/;
const MAX_NAME_LEN = 200;
const MAX_MESSAGE_LEN = 2000;
const MAX_GUESTS = 6; // the apartment's real occupancy limit — 3 bedrooms, sleeps up to 6 total (adults + children)
const MAX_CHILD_AGE = 17;

export function validate(data: Partial<Submission>): string | null {
  // Every field is read straight out of request.json() into a type the
  // compiler trusts (Partial<Submission>) but never actually checks at
  // runtime — a numeric or object `name`/`email`/etc. (malformed client,
  // hand-crafted request) would otherwise reach `.trim()`/regex calls that
  // only exist on strings and throw a TypeError, which propagates out of
  // this synchronous call with no surrounding try/catch and turns into an
  // unhandled exception instead of the intended 400 response.
  if (typeof data.name !== 'string' || !data.name.trim()) return 'name required';
  if (data.name.length > MAX_NAME_LEN) return 'name too long';
  if (CONTROL_CHAR_RE.test(data.name)) return 'invalid name';
  if (typeof data.email !== 'string' || !data.email.trim() || !EMAIL_RE.test(data.email.trim())) return 'invalid email';
  if (data.phone && (typeof data.phone !== 'string' || CONTROL_CHAR_RE.test(data.phone))) return 'invalid phone';
  if (data.source && (typeof data.source !== 'string' || CONTROL_CHAR_RE.test(data.source))) return 'invalid source';
  if (typeof data.checkin_iso !== 'string' || !ISO_DATE_RE.test(data.checkin_iso)) return 'invalid checkin date';
  if (typeof data.checkout_iso !== 'string' || !ISO_DATE_RE.test(data.checkout_iso)) return 'invalid checkout date';
  if (data.checkout_iso <= data.checkin_iso) return 'checkout must be after checkin';
  const today = new Date().toISOString().slice(0, 10);
  if (data.checkin_iso < today) return 'checkin cannot be in the past';
  const adults = Number(data.adults);
  const children = Number(data.children);
  if (!Number.isInteger(adults) || adults < 1) return 'invalid adults count';
  if (!Number.isInteger(children) || children < 0) return 'invalid children count';
  if (adults + children > MAX_GUESTS) return 'too many guests';
  if (children > 0) {
    // Booking-style: one age (0–17) per child, not just a headcount — lets
    // Francesco see at a glance whether a crib/high chair request (the
    // extras below) actually matches an infant/toddler in the party.
    if (!Array.isArray(data.children_ages) || data.children_ages.length !== children) return 'invalid children ages';
    if (!data.children_ages.every((age) => Number.isInteger(age) && age >= 0 && age <= MAX_CHILD_AGE)) return 'invalid children ages';
  }
  if (data.message && (typeof data.message !== 'string' || data.message.length > MAX_MESSAGE_LEN)) return 'message too long';
  return null;
}

export function isSpam(data: Partial<Submission>): boolean {
  return Boolean(data.company && data.company.trim().length > 0);
}
