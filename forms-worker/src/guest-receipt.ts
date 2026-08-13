// Automatic "we've got your request" receipt, sent to the guest right after
// they submit — unconditionally, before Francesco has looked at it, so the
// guest has written confirmation their request actually arrived instead of
// wondering whether the form worked. Separate from sendNotification()'s
// internal email (index.ts, always to info@ironwoodlivigno.com in Italian)
// and from the owner's own manual reply (quick-replies.ts / draft.ts) —
// this one goes out to whatever address the guest typed in, in the
// language of the site they were browsing (data.locale), via the same
// sendMail() SMTP path everything else in this Worker uses.
import type { Submission } from './index';
import { replyLabelsFor } from './reply-labels';
import { nightsBetween } from './email-template';

// Matches the ogLocale mapping in src/content/landingPageTranslations.ts on
// the main site — same 12 locale codes, mapped to a real BCP-47 tag so
// Intl.DateTimeFormat spells the month out correctly for that language
// rather than falling back to the runtime's default locale.
const INTL_LOCALE: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  'en-us': 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  da: 'da-DK',
  pl: 'pl-PL',
  cs: 'cs-CZ',
  no: 'nb-NO',
  nl: 'nl-NL',
  zh: 'zh-CN',
  ja: 'ja-JP'
};

function formatGuestDate(iso: string, locale: string | undefined): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const intlLocale = (locale && INTL_LOCALE[locale]) || 'it-IT';
  return new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function buildGuestReceipt(data: Submission): { subject: string; text: string } {
  const labels = replyLabelsFor(data.locale);
  const firstName = data.name.trim().split(/\s+/)[0] || data.name;
  const nights = nightsBetween(data.checkin_iso, data.checkout_iso);
  const nightsWord = nights === 1 ? labels.night : labels.nights;
  const nightsPhrase = nights !== null ? ` (${nights} ${nightsWord})` : '';

  const guestsLine =
    data.children > 0
      ? `${labels.guests}: ${data.adults} + ${data.children} ${labels.children.toLowerCase()}`
      : `${labels.guests}: ${data.adults}`;

  const lines = [
    labels.receiptGreeting.replace('{name}', firstName),
    '',
    labels.receiptIntro,
    '',
    labels.requestHeading,
    `${labels.checkin}: ${formatGuestDate(data.checkin_iso, data.locale)}`,
    `${labels.checkout}: ${formatGuestDate(data.checkout_iso, data.locale)}${nightsPhrase}`,
    guestsLine
  ];

  const extras = [data.extra_breakfast ? labels.breakfast : null, data.extra_ebike ? labels.ebike : null].filter(Boolean);
  if (extras.length > 0) lines.push(`${labels.extra}: ${extras.join(' + ')}`);
  if (data.message) lines.push(`${labels.note}: ${data.message}`);

  lines.push('', labels.receiptClosing);

  return { subject: labels.receiptSubject, text: lines.join('\n') };
}
