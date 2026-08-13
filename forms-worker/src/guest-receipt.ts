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
import { nightsBetween, escapeHtml, FONT_DISPLAY, FONT_BODY, PHOTOS_URL } from './email-template';

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

function buildGuestReceiptText(data: Submission, nightsPhrase: string): string {
  const labels = replyLabelsFor(data.locale);
  const firstName = data.name.trim().split(/\s+/)[0] || data.name;

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

  return lines.join('\n');
}

// Branded HTML twin of the plain-text receipt above — same card layout,
// fonts and brand colors as the internal notification email
// (email-template.ts's buildNotificationHtml), so the guest's first
// impression after submitting the form isn't a bare wall of text while
// Francesco's own copy of the same request looks designed. No new copy is
// introduced here: every label/sentence still comes from reply-labels.ts
// (already translated across all 12 locales), this only changes how it's
// laid out. sendMail sends html-only when present (smtp.ts), so the plain
// text above stays as the fallback for message.text even though it won't
// itself be transmitted alongside the HTML.
//
// Deliberately kept plain — no hero photo, no confirmation badge, no
// WhatsApp button. This is an automatic, unconditional "we got it" receipt
// sent before Francesco has even looked at the request; the full branded
// treatment (hero photo, CTAs) is reserved for the actual reply Francesco
// sends once he's confirmed availability (see buildOutboundEmailHtml in
// email-template.ts), so the two don't look identical and the receipt
// doesn't overpromise before there's anything to promise.
function buildGuestReceiptHtml(data: Submission, nights: number | null): string {
  const labels = replyLabelsFor(data.locale);
  const firstName = escapeHtml(data.name.trim().split(/\s+/)[0] || data.name);
  const nightsWord = nights === 1 ? labels.night : labels.nights;

  const guestsValue =
    data.children > 0 ? `${data.adults} + ${data.children} ${labels.children.toLowerCase()}` : String(data.adults);

  // A distinct emoji per extra (croissant / e-bike) instead of a repeated
  // checkmark — purely decorative, no new copy, but reads faster at a
  // glance than an identical glyph on every pill.
  const extraPills = [
    data.extra_breakfast ? { icon: '🥐', label: labels.breakfast } : null,
    data.extra_ebike ? { icon: '🚲', label: labels.ebike } : null
  ]
    .filter((e): e is { icon: string; label: string } => e !== null)
    .map(
      (e) =>
        `<span style="display:inline-block;background-color:#C9A059;border-radius:999px;padding:8px 16px;margin:0 8px 8px 0;font-family:${FONT_BODY};font-size:13px;font-weight:700;color:#241C15;white-space:nowrap;">${e.icon} ${escapeHtml(e.label)}</span>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="${escapeHtml(data.locale || 'it')}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#F7F3EC;font-family:${FONT_BODY};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(labels.receiptIntro)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(36,28,21,0.10);">

            <!-- Header -->
            <tr>
              <td style="background-color:#241C15;padding:32px 36px 28px;">
                <p style="margin:0;color:#C9A059;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;">Ironwood Livigno</p>
                <p style="margin:10px 0 0;color:#ffffff;font-family:${FONT_DISPLAY};font-size:22px;line-height:1.4;">${escapeHtml(labels.receiptGreeting.replace('{name}', firstName))}</p>
              </td>
            </tr>

            <!-- Intro -->
            <tr>
              <td style="padding:26px 36px 0;">
                <p style="margin:0;font-family:${FONT_BODY};font-size:15px;color:#241C15;line-height:1.6;">${escapeHtml(labels.receiptIntro)}</p>
              </td>
            </tr>

            <!-- Check-in / nights / check-out -->
            <tr>
              <td style="padding:26px 36px 0;">
                <p style="margin:0 0 10px;font-family:${FONT_BODY};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#241C15;opacity:0.45;">${escapeHtml(labels.requestHeading)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:16px;">
                  <tr>
                    <td style="padding:20px 12px;width:38%;text-align:center;">
                      <p style="margin:0;font-family:${FONT_BODY};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#241C15;opacity:0.5;">${escapeHtml(labels.checkin)}</p>
                      <p style="margin:5px 0 0;font-family:${FONT_DISPLAY};font-size:18px;color:#241C15;">${escapeHtml(formatGuestDate(data.checkin_iso, data.locale))}</p>
                    </td>
                    <td style="width:24%;text-align:center;vertical-align:middle;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                        <tr><td style="background-color:#A8462F;border-radius:999px;padding:6px 14px;">
                          <span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;">${nights !== null ? `${nights} ${escapeHtml(nightsWord)}` : '→'}</span>
                        </td></tr>
                      </table>
                    </td>
                    <td style="padding:20px 12px;width:38%;text-align:center;">
                      <p style="margin:0;font-family:${FONT_BODY};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#241C15;opacity:0.5;">${escapeHtml(labels.checkout)}</p>
                      <p style="margin:5px 0 0;font-family:${FONT_DISPLAY};font-size:18px;color:#241C15;">${escapeHtml(formatGuestDate(data.checkout_iso, data.locale))}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Guests -->
            <tr>
              <td style="padding:20px 36px 0;">
                <p style="margin:0;font-family:${FONT_BODY};font-size:14px;color:#241C15;">
                  <span style="opacity:0.5;text-transform:uppercase;font-size:11px;letter-spacing:0.07em;">${escapeHtml(labels.guests)}</span>
                  &nbsp;&nbsp;${escapeHtml(guestsValue)}
                </p>
              </td>
            </tr>

            ${
              extraPills
                ? `
            <tr>
              <td style="padding:16px 36px 0;">
                <div>${extraPills}</div>
              </td>
            </tr>`
                : ''
            }

            ${
              data.message
                ? `
            <!-- Note: the guest's own free-text message, quoted back so
                 they can confirm it arrived exactly as written. -->
            <tr>
              <td style="padding:24px 36px 0;">
                <p style="margin:0 0 8px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">${escapeHtml(labels.note)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF1E7;border-radius:14px;border:1px solid #EAD9BE;border-left:5px solid #A8462F;">
                  <tr><td style="padding:16px 18px;font-family:${FONT_BODY};font-size:14px;color:#241C15;line-height:1.6;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr>
                </table>
              </td>
            </tr>`
                : ''
            }

            <!-- Photos: bare URL with a camera emoji, same convention as
                 the mailto templates (quick-replies.ts) — needs no
                 per-locale translation. -->
            <tr>
              <td style="padding:26px 36px 0;">
                <a href="${PHOTOS_URL}" style="display:inline-block;color:#241C15;text-decoration:none;font-family:${FONT_BODY};font-size:13px;font-weight:600;padding:11px 22px;border:1px solid #EFE6D8;border-radius:999px;">📷 ${PHOTOS_URL}</a>
              </td>
            </tr>

            <!-- Closing -->
            <tr>
              <td style="padding:22px 36px 30px;">
                <p style="margin:0;font-family:${FONT_BODY};font-size:14px;color:#241C15;white-space:pre-line;line-height:1.6;">${escapeHtml(labels.receiptClosing)}</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 36px;background-color:#F7F3EC;border-top:1px solid #EFE6D8;">
                <p style="margin:0;font-family:${FONT_BODY};font-size:12px;color:#241C15;opacity:0.5;">Ironwood Livigno · ironwoodlivigno.com</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildGuestReceipt(data: Submission): { subject: string; text: string; html: string } {
  const labels = replyLabelsFor(data.locale);
  const nights = nightsBetween(data.checkin_iso, data.checkout_iso);
  const nightsWord = nights === 1 ? labels.night : labels.nights;
  const nightsPhrase = nights !== null ? ` (${nights} ${nightsWord})` : '';

  return {
    subject: labels.receiptSubject,
    text: buildGuestReceiptText(data, nightsPhrase),
    html: buildGuestReceiptHtml(data, nights)
  };
}
