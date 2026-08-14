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
import { replyLabelsFor, formatGuestsSentence } from './reply-labels';
import { nightsBetween, escapeHtml, FONT_MONO, PHOTOS_URL } from './email-template';

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

// A fax cover sheet's ASCII furniture — rules and a perforation strip —
// needs no translation, so it's the same in every locale; only the actual
// copy inside still comes from reply-labels.ts.
const RULE = '─'.repeat(34);
const PERFORATION = '· '.repeat(17).trimEnd();

function formatGuestTimestamp(locale: string | undefined): string {
  const intlLocale = (locale && INTL_LOCALE[locale]) || 'it-IT';
  return new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());
}

function buildGuestReceiptText(data: Submission, nightsPhrase: string): string {
  const labels = replyLabelsFor(data.locale);
  const firstName = data.name.trim().split(/\s+/)[0] || data.name;

  const guestsLine = `${labels.guests}: ${formatGuestsSentence(labels, data.adults, data.children, data.children_ages)}`;

  const lines = [
    PERFORATION,
    'IRONWOOD LIVIGNO',
    formatGuestTimestamp(data.locale),
    RULE,
    '',
    labels.receiptGreeting.replace('{name}', firstName),
    '',
    labels.receiptIntro,
    '',
    labels.requestHeading,
    RULE,
    `${labels.checkin}:  ${formatGuestDate(data.checkin_iso, data.locale)}`,
    `${labels.checkout}: ${formatGuestDate(data.checkout_iso, data.locale)}${nightsPhrase}`,
    guestsLine
  ];

  const extras = [data.extra_breakfast ? labels.breakfast : null, data.extra_ebike ? labels.ebike : null].filter(Boolean);
  if (extras.length > 0) lines.push(`${labels.extra}: ${extras.join(' + ')}`);
  lines.push(RULE);
  if (data.message) lines.push('', `${labels.note}:`, `"${data.message}"`);

  lines.push('', labels.receiptClosing, '', RULE, '✓ OK', PERFORATION);

  return lines.join('\n');
}

// Fax-styled HTML twin of the plain-text receipt above — a "just came off
// the machine" cover sheet look (monospace type, a perforation strip top
// and bottom, bracketed fields, a rubber-stamp "OK") instead of the
// rounded-card look the rest of this Worker's emails use. Still built from
// the exact same source data and the same localized copy as before
// (reply-labels.ts, all 12 locales) — nothing here introduces new
// guest-facing text, it only changes how that text is dressed. sendMail
// sends html-only when present (smtp.ts), so the plain text above stays as
// the fallback for message.text even though it won't itself be
// transmitted alongside the HTML.
//
// Deliberately kept plain otherwise — no hero photo, no WhatsApp button.
// This is an automatic, unconditional "we got it" receipt sent before
// Francesco has even looked at the request; the full branded treatment
// (hero photo, CTAs) is reserved for the actual reply Francesco sends once
// he's confirmed availability (see buildOutboundEmailHtml in
// email-template.ts), so the two don't look identical and the receipt
// doesn't overpromise before there's anything to promise.
function buildGuestReceiptHtml(data: Submission, nights: number | null): string {
  const labels = replyLabelsFor(data.locale);
  const firstName = escapeHtml(data.name.trim().split(/\s+/)[0] || data.name);
  const nightsWord = nights === 1 ? labels.night : labels.nights;

  const guestsValue = formatGuestsSentence(labels, data.adults, data.children, data.children_ages);

  // Typewriter-style checkbox fields rather than pill badges — only the
  // extras actually requested are listed at all, same as before, just a
  // "[x]" prefix instead of a colored pill.
  const extraLines = [
    data.extra_breakfast ? { icon: '🥐', label: labels.breakfast } : null,
    data.extra_ebike ? { icon: '🚲', label: labels.ebike } : null
  ].filter((e): e is { icon: string; label: string } => e !== null);

  // A row of small dots standing in for a fax sheet's perforated edge —
  // plain characters, not an image, so it survives every mail client's
  // "block remote images" default the same way the rest of this email does.
  const perforation = `<p style="margin:0;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.3em;color:#C9BBA0;white-space:nowrap;overflow:hidden;">${'· '.repeat(30)}</p>`;

  return `<!doctype html>
<html lang="${escapeHtml(data.locale || 'it')}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#E7DFCE;font-family:${FONT_MONO};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(labels.receiptIntro)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E7DFCE;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#FBF9F4;border:1px solid #D8CFB8;border-radius:3px;box-shadow:0 10px 30px rgba(36,28,21,0.16);">

            <!-- Perforation -->
            <tr><td style="padding:14px 30px 0;">${perforation}</td></tr>

            <!-- Header: brand name as the one wordmark — the monospace type
                 and dashed rule underneath already carry the cover-sheet
                 look without needing a literal label. -->
            <tr>
              <td style="padding:18px 36px 20px;border-bottom:2px dashed #C9A059;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <p style="margin:0;font-family:${FONT_MONO};font-size:22px;font-weight:700;letter-spacing:0.06em;color:#241C15;">Ironwood Livigno</p>
                    </td>
                    <td align="right" style="vertical-align:bottom;">
                      <p style="margin:0;font-family:${FONT_MONO};font-size:11px;color:#241C15;opacity:0.55;white-space:nowrap;">${escapeHtml(formatGuestTimestamp(data.locale))}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Greeting + intro -->
            <tr>
              <td style="padding:26px 36px 0;">
                <p style="margin:0;font-family:${FONT_MONO};font-size:15px;font-weight:700;color:#241C15;">${escapeHtml(labels.receiptGreeting.replace('{name}', firstName))}</p>
                <p style="margin:12px 0 0;font-family:${FONT_MONO};font-size:13.5px;color:#241C15;line-height:1.7;">${escapeHtml(labels.receiptIntro)}</p>
              </td>
            </tr>

            <!-- Request heading -->
            <tr>
              <td style="padding:24px 36px 0;">
                <p style="margin:0 0 12px;font-family:${FONT_MONO};font-size:11.5px;font-weight:700;letter-spacing:0.14em;color:#A8462F;text-transform:uppercase;border-bottom:1px dashed #D8CFB8;padding-bottom:10px;">${escapeHtml(labels.requestHeading)}</p>
              </td>
            </tr>

            <!-- Check-in / nights / check-out, cover-sheet fields -->
            <tr>
              <td style="padding:0 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:38%;">
                      <p style="margin:0;font-family:${FONT_MONO};font-size:10px;font-weight:700;letter-spacing:0.08em;color:#241C15;opacity:0.5;text-transform:uppercase;">${escapeHtml(labels.checkin)}</p>
                      <p style="margin:4px 0 0;font-family:${FONT_MONO};font-size:14.5px;font-weight:700;color:#241C15;">${escapeHtml(formatGuestDate(data.checkin_iso, data.locale))}</p>
                    </td>
                    <td style="width:24%;text-align:center;vertical-align:bottom;padding-bottom:2px;">
                      <span style="font-family:${FONT_MONO};font-size:11px;font-weight:700;color:#A8462F;white-space:nowrap;">[ ${nights !== null ? `${nights} ${escapeHtml(nightsWord)}` : '→'} ]</span>
                    </td>
                    <td style="width:38%;">
                      <p style="margin:0;font-family:${FONT_MONO};font-size:10px;font-weight:700;letter-spacing:0.08em;color:#241C15;opacity:0.5;text-transform:uppercase;">${escapeHtml(labels.checkout)}</p>
                      <p style="margin:4px 0 0;font-family:${FONT_MONO};font-size:14.5px;font-weight:700;color:#241C15;">${escapeHtml(formatGuestDate(data.checkout_iso, data.locale))}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Guests -->
            <tr>
              <td style="padding:20px 36px 0;">
                <p style="margin:0;font-family:${FONT_MONO};font-size:13.5px;color:#241C15;">
                  <span style="opacity:0.5;text-transform:uppercase;font-size:10px;letter-spacing:0.08em;font-weight:700;">${escapeHtml(labels.guests)}:</span>
                  &nbsp;${escapeHtml(guestsValue)}
                </p>
              </td>
            </tr>

            ${
              extraLines.length
                ? `
            <tr>
              <td style="padding:10px 36px 0;">
                ${extraLines.map((e) => `<p style="margin:4px 0 0;font-family:${FONT_MONO};font-size:13.5px;color:#241C15;">[x] ${e.icon} ${escapeHtml(e.label)}</p>`).join('')}
              </td>
            </tr>`
                : ''
            }

            ${
              data.message
                ? `
            <!-- Note: the guest's own free-text message, quoted back
                 teletype-style so they can confirm it arrived exactly as
                 written. -->
            <tr>
              <td style="padding:22px 36px 0;">
                <p style="margin:0 0 8px;font-family:${FONT_MONO};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">${escapeHtml(labels.note)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px dashed #C9A059;">
                  <tr><td style="padding:2px 0 2px 16px;font-family:${FONT_MONO};font-size:13.5px;color:#241C15;line-height:1.7;">» ${escapeHtml(data.message).replace(/\n/g, '<br>» ')}</td></tr>
                </table>
              </td>
            </tr>`
                : ''
            }

            <!-- Photos -->
            <tr>
              <td style="padding:26px 36px 0;">
                <a href="${PHOTOS_URL}" style="display:inline-block;color:#241C15;text-decoration:none;font-family:${FONT_MONO};font-size:12.5px;font-weight:700;padding:10px 18px;border:1px dashed #241C15;">[ 📷 ${PHOTOS_URL} ]</a>
              </td>
            </tr>

            <!-- Closing -->
            <tr>
              <td style="padding:24px 36px 0;">
                <p style="margin:0;font-family:${FONT_MONO};font-size:13.5px;color:#241C15;white-space:pre-line;line-height:1.7;">${escapeHtml(labels.receiptClosing)}</p>
              </td>
            </tr>

            <!-- Stamp -->
            <tr>
              <td style="padding:22px 36px 0;border-top:2px dashed #C9A059;margin-top:10px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                  <tr><td style="border:2px solid #4F6B45;border-radius:4px;padding:6px 14px;">
                    <span style="font-family:${FONT_MONO};font-size:12px;font-weight:700;letter-spacing:0.12em;color:#4F6B45;">✓ OK</span>
                  </td></tr>
                </table>
              </td>
            </tr>

            <!-- Perforation + footer -->
            <tr><td style="padding:18px 30px 0;">${perforation}</td></tr>
            <tr>
              <td style="padding:12px 36px 20px;">
                <p style="margin:0;font-family:${FONT_MONO};font-size:11px;color:#241C15;opacity:0.5;">Ironwood Livigno · ironwoodlivigno.com</p>
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
