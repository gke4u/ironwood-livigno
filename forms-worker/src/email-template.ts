// HTML template for the internal notification email. Table-based layout
// with inline styles throughout — email clients (especially Outlook's Word
// rendering engine) ignore or mis-render <style> blocks and modern CSS
// (flexbox/grid), so inline styles on tables/cells is still the only
// approach that renders consistently everywhere. Colors match the site's
// own palette (tailwind.config.ts: brick #A8462F, ink #241C15, gold
// #C9A059, cream #EFE6D8, mist #F7F3EC); fonts fall back to the same
// stacks the site's Fraunces/Poppins declare for when the real webfonts
// aren't available (globals.css) — Georgia/serif for display, system-ui
// sans-serif for body — since email clients don't load @font-face reliably.
import type { Submission } from './index';
import { localeDisplayName, type Translation } from './translate';
import { replyLabelsFor } from './reply-labels';
import { buildQuickReplies, type QuickReplyId } from './quick-replies';

// Exported so guest-receipt.ts's HTML version can match this template's
// look exactly (same fonts, same brand colors) instead of drifting from it.
export const FONT_DISPLAY = "Georgia,'Times New Roman',serif";
export const FONT_BODY = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export const PHOTOS_URL = 'https://ironwoodlivigno.com/it#galleria';

// Base URL for the reply-editor pages (/reply/:token/:kind, see index.ts) —
// links from the internal notification email have to be absolute since
// that email is read in Francesco's own mail client, not on this domain.
const FORMS_BASE_URL = 'https://forms.ironwoodlivigno.com';

// Per-option accent for the quick-reply buttons — brick for the good-news
// case, gold for "pending", a plain muted border/text for "unavailable" —
// using only colors already in the site's own palette.
const QUICK_REPLY_ACCENT: Record<QuickReplyId, { border: string; text: string }> = {
  available: { border: '#A8462F', text: '#A8462F' },
  unavailable: { border: '#241C15', text: '#241C15' },
  pending: { border: '#C9A059', text: '#8A6B2E' }
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function nightsBetween(checkinIso: string, checkoutIso: string): number | null {
  const a = new Date(`${checkinIso}T00:00:00Z`).getTime();
  const b = new Date(`${checkoutIso}T00:00:00Z`).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86_400_000);
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #EFE6D8;font-family:${FONT_BODY};font-size:12px;color:#241C15;opacity:0.5;text-transform:uppercase;letter-spacing:0.07em;width:130px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:11px 0;border-bottom:1px solid #EFE6D8;font-family:${FONT_BODY};font-size:15px;color:#241C15;vertical-align:top;">${value}</td>
    </tr>`;
}

// Pre-fills the reply-editor page with the guest's own request quoted
// underneath, so Francesco can start typing straight away without switching
// back to this email to check dates/message — cursor lands on the three
// blank lines above the quote, meant for HIS OWN greeting (not a
// pre-written "Ciao {name}," — he may want to write it in the guest's
// language, or phrase it differently, and a hardcoded Italian greeting
// isn't his to have decided for him). The quote itself opens with the
// Ironwood Livigno name and the stay dates instead, as a neutral reference
// header.
//
// Field labels are localized to the guest's own site language (data.locale)
// via reply-labels.ts — a German guest shouldn't get a reply whose labels
// are in Italian. Only the guest's own free-text message is left exactly as
// they wrote it.
//
// Used to be URL-encoded straight into a mailto: link (plain text only, no
// formatting at all available). Now it's the initial value of an editable
// textarea on /reply/:token/blank (index.ts) — kept as plain text with the
// same ASCII structure (divider rule, ALL-CAPS section labels) since
// Francesco still edits it as text before sending; the actual outgoing
// email gets real HTML formatting from buildOutboundEmailHtml below.
export function buildBlankReplyText(data: Submission, nights: number | null): string {
  const t = replyLabelsFor(data.locale);
  const extras = [data.extra_breakfast ? t.breakfast : null, data.extra_ebike ? t.ebike : null].filter(Boolean).join(' + ');
  const nightsWord = nights === 1 ? t.night : t.nights;
  return [
    '',
    '',
    '',
    '────────────────────',
    'IRONWOOD LIVIGNO',
    t.requestHeading,
    '────────────────────',
    `${t.checkin}:  ${data.checkin}`,
    `${t.checkout}: ${data.checkout}${nights !== null ? ` (${nights} ${nightsWord})` : ''}`,
    `${t.guests}:   ${data.guests}`,
    extras ? `${t.extra.toUpperCase()}: ${extras}` : null,
    data.message ? '' : null,
    data.message ? `${t.note.toUpperCase()}:` : null,
    data.message ? `"${data.message}"` : null
  ]
    .filter((l) => l !== null)
    .join('\n');
}

export function buildNotificationHtml(data: Submission, id: number, country: string, translation: Translation, token: string): string {
  const nights = nightsBetween(data.checkin_iso, data.checkout_iso);
  const firstName = escapeHtml(data.name.trim().split(/\s+/)[0] || data.name);

  const rows = [
    row('Nome', escapeHtml(data.name)),
    row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#A8462F;text-decoration:none;">${escapeHtml(data.email)}</a>`),
    data.phone ? row('Telefono', `<a href="tel:${escapeHtml(data.phone)}" style="color:#A8462F;text-decoration:none;">${escapeHtml(data.phone)}</a>`) : '',
    row(
      'Ospiti',
      data.children > 0
        ? `${data.adults} adulti + ${data.children} bambini (età: ${escapeHtml((data.children_ages ?? []).join(', '))})`
        : String(data.guests)
    ),
    data.source ? row('Come ci ha trovato', escapeHtml(data.source)) : '',
    data.locale ? row('Lingua sito', escapeHtml(localeDisplayName(data.locale))) : '',
    country ? row('Paese (da IP)', escapeHtml(country)) : ''
  ]
    .filter(Boolean)
    .join('\n');

  // display:inline-block spans in a plain div — not table cells side by
  // side — so on a narrow phone screen the second pill wraps onto its own
  // line instead of running off the edge (table cells never wrap; a <tr>
  // wider than the screen just gets visually cut off with no way to scroll
  // to the rest on most mobile mail apps).
  const extraPills = [data.extra_breakfast ? 'Colazione' : null, data.extra_ebike ? 'Noleggio e-bike' : null]
    .filter((e): e is string => e !== null)
    .map(
      (e) =>
        `<span style="display:inline-block;background-color:#C9A059;border-radius:999px;padding:8px 16px;margin:0 8px 8px 0;font-family:${FONT_BODY};font-size:13px;font-weight:700;color:#241C15;white-space:nowrap;">✓ ${escapeHtml(e)}</span>`
    )
    .join('\n');

  const replyHref = `${FORMS_BASE_URL}/reply/${token}/blank`;
  const aiDraftHref = `${FORMS_BASE_URL}/reply/${token}/ai`;
  const quickReplies = buildQuickReplies(data, nights, token);

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#F7F3EC;font-family:${FONT_BODY};">
    <!-- Preheader: shown as the preview snippet in inbox lists, hidden in the body -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(data.name)} · ${escapeHtml(data.checkin)} → ${escapeHtml(data.checkout)}${nights ? ` · ${nights} notti` : ''} · ${data.guests} ospiti
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(36,28,21,0.10);">

            <!-- Header -->
            <tr>
              <td style="background-color:#241C15;padding:36px 36px 30px;">
                <p style="margin:0;color:#C9A059;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;">Ironwood Livigno</p>
                <p style="margin:10px 0 0;color:#ffffff;font-family:${FONT_DISPLAY};font-size:24px;line-height:1.3;">Nuova richiesta da<br><span style="color:#EFE6D8;">${escapeHtml(data.name)}</span></p>
              </td>
            </tr>

            <!-- Check-in / nights / check-out -->
            <tr>
              <td style="padding:28px 36px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;">
                  <tr>
                    <td style="padding:20px 12px;width:38%;text-align:center;">
                      <p style="margin:0;font-family:${FONT_BODY};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#241C15;opacity:0.5;">Check-in</p>
                      <p style="margin:5px 0 0;font-family:${FONT_DISPLAY};font-size:19px;color:#241C15;">${escapeHtml(data.checkin)}</p>
                    </td>
                    <td style="width:24%;text-align:center;vertical-align:middle;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                        <tr><td style="background-color:#A8462F;border-radius:999px;padding:6px 14px;">
                          <span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;">${nights !== null ? `${nights} ${nights === 1 ? 'notte' : 'notti'}` : '→'}</span>
                        </td></tr>
                      </table>
                    </td>
                    <td style="padding:20px 12px;width:38%;text-align:center;">
                      <p style="margin:0;font-family:${FONT_BODY};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#241C15;opacity:0.5;">Check-out</p>
                      <p style="margin:5px 0 0;font-family:${FONT_DISPLAY};font-size:19px;color:#241C15;">${escapeHtml(data.checkout)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${
              extraPills
                ? `
            <!-- Extras: high-visibility pills, own section above the plain
                 details table — these are add-on requests that affect prep
                 (breakfast order, e-bikes to have ready), easy to miss as a
                 plain text row. -->
            <tr>
              <td style="padding:28px 36px 0;">
                <p style="margin:0 0 10px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">⚑ Extra richiesti</p>
                <div>${extraPills}</div>
              </td>
            </tr>`
                : ''
            }

            ${
              data.message
                ? `
            <!-- Note: the highest-priority freeform content in the email —
                 heavier border, warm tinted background, bold label, so it
                 can't be skimmed past the way a table row would be. The
                 language it was written in gets its own loud badge when
                 not Italian. Translation now runs automatically at send
                 time and is shown directly below the original in the same
                 language block (not a separate on-demand page anymore —
                 the earlier click-through /translate/:token page existed
                 only because translation used to fail for infra reasons;
                 once that was fixed, gating it behind an extra click had
                 no remaining purpose). A translation failure here still
                 can't break the email itself — it just means this second
                 box is silently omitted and only the original shows. -->
            <tr>
              <td style="padding:24px 36px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">✎ Nota di ${firstName}</td>
                    ${
                      data.locale && data.locale !== 'it'
                        ? `<td align="right"><table role="presentation" cellpadding="0" cellspacing="0" style="margin-left:auto;"><tr><td style="background-color:#241C15;border-radius:999px;padding:3px 12px;"><span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:#EFE6D8;white-space:nowrap;">Scritta in ${escapeHtml(localeDisplayName(data.locale))}</span></td></tr></table></td>`
                        : ''
                    }
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF1E7;border-radius:14px;border:1px solid #EAD9BE;border-left:5px solid #A8462F;">
                  <tr>
                    <td style="padding:18px 20px;font-family:${FONT_BODY};font-size:16px;font-weight:500;color:#241C15;line-height:1.6;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</td>
                  </tr>
                </table>
                ${
                  translation
                    ? `
                <p style="margin:14px 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#241C15;opacity:0.45;">Traduzione automatica (italiano)</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;">
                  <tr><td style="padding:16px 20px;font-family:${FONT_BODY};font-size:15px;color:#241C15;line-height:1.6;">${escapeHtml(translation.translatedText).replace(/\n/g, '<br>')}</td></tr>
                </table>`
                    : ''
                }
              </td>
            </tr>`
                : ''
            }

            <!-- Guest details -->
            <tr>
              <td style="padding:28px 36px 4px;">
                <p style="margin:0 0 4px;font-family:${FONT_BODY};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#241C15;opacity:0.45;">Dettagli</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
              </td>
            </tr>

            <!-- CTA: inline-block anchors in a plain div, not table cells
                 side by side — on a narrow phone the second button wraps
                 onto its own line below the first instead of running off
                 the edge of the screen (the earlier <table><tr><td> layout
                 had no way to wrap, so it just got visually cut off).
                 replyHref/aiDraftHref point at this Worker's own domain
                 (built from token, our own generated UUID, not
                 guest-controlled input), so escaping here is defense in
                 depth rather than neutralizing anything untrusted. -->
            <tr>
              <td style="padding:16px 36px 36px;">
                <div>
                  <a href="${escapeHtml(replyHref)}"
                     style="display:inline-block;color:#ffffff;text-decoration:none;font-family:${FONT_BODY};font-size:15px;font-weight:600;padding:14px 30px;background-color:#A8462F;border-radius:999px;margin:0 10px 10px 0;">
                    Rispondi a ${firstName} →
                  </a>
                  <a href="${PHOTOS_URL}"
                     style="display:inline-block;color:#241C15;text-decoration:none;font-family:${FONT_BODY};font-size:15px;font-weight:600;padding:14px 24px;border:1px solid #EFE6D8;border-radius:999px;margin:0 0 10px 0;">
                    Foto dell'appartamento
                  </a>
                </div>
                <p style="margin:2px 0 0;font-family:${FONT_BODY};font-size:12px;color:#241C15;opacity:0.45;">Si apre una pagina con la richiesta di ${firstName} già in citazione, pronta da modificare e inviare.</p>
                <p style="margin:10px 0 0;"><a href="${escapeHtml(aiDraftHref)}" style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:#A8462F;text-decoration:none;">✍️ Genera bozza di risposta con l'AI →</a></p>
              </td>
            </tr>

            <!-- Quick replies: three pre-written templates for the most
                 common scenarios — no AI call, so no wait. Each button
                 opens a page on this Worker's own domain with the reply
                 already written in the GUEST's own language (data.locale)
                 and a clearly marked placeholder for price/notes, editable
                 before a real "Invia" sends it directly from our system
                 (see /reply/:token/:kind and /reply/:token/send in
                 index.ts) — not a mailto: link anymore, so the outgoing
                 email gets the same branded HTML look as the automatic
                 receipt instead of being limited to plain text. Since the
                 guest-language text isn't something the owner can
                 necessarily read, the Italian master text (not a
                 translation — it's what the other 11 versions were
                 translated FROM) is still shown right below each button,
                 so it's always clear what a click is about to prefill. -->
            <tr>
              <td style="padding:0 36px 36px;">
                <p style="margin:0 0 10px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#241C15;opacity:0.45;">⚡ Risposte rapide</p>
                <div>
                  ${quickReplies
                    .map((qr) => {
                      // Accent color per option instead of a leading emoji
                      // (✗/⏳ didn't render reliably in every mail client/
                      // font) — brick for the good-news case, gold for
                      // "pending", a plain muted border for "unavailable".
                      const accent = QUICK_REPLY_ACCENT[qr.id];
                      return `<a href="${escapeHtml(qr.href)}" style="display:inline-block;color:${accent.text};text-decoration:none;font-family:${FONT_BODY};font-size:14px;font-weight:600;padding:10px 18px;background-color:#F7F3EC;border:1px solid ${accent.border};border-radius:999px;margin:0 8px 8px 0;">${qr.label}</a>`;
                    })
                    // A real newline between anchors, not concatenated onto
                    // one line — a real bug found in production once: a line
                    // long enough got force-wrapped by a mail relay along the
                    // delivery path, corrupting an href mid-string (see
                    // foldLongLines in smtp.ts, the general safeguard added
                    // after that).
                    .join('\n')}
                </div>
                ${quickReplies
                  .map(
                    (qr) => `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;margin-top:8px;">
                  <tr>
                    <td style="padding:12px 16px;">
                      <p style="margin:0 0 4px;font-family:${FONT_BODY};font-size:11px;font-weight:700;color:${QUICK_REPLY_ACCENT[qr.id].text};opacity:0.8;text-transform:uppercase;letter-spacing:0.05em;">${qr.label}</p>
                      <p style="margin:0;font-family:${FONT_BODY};font-size:13px;color:#241C15;opacity:0.75;line-height:1.5;">${escapeHtml(qr.italianPreview).replace(/\n/g, '<br>')}</p>
                    </td>
                  </tr>
                </table>`
                  )
                  .join('\n')}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 36px;background-color:#F7F3EC;border-top:1px solid #EFE6D8;">
                <p style="margin:0;font-family:${FONT_BODY};font-size:12px;color:#241C15;opacity:0.5;">
                  Richiesta #${id} · ${escapeHtml(new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }))} · forms.ironwoodlivigno.com
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Escapes a string for safe embedding inside a JSON literal that itself
// The site's real mountain hero photo — loaded by the guest's mail client
// from the live domain, not embedded, so it costs nothing in the SMTP
// payload. Plain .jpg rather than the site's .webp/.avif variants: Outlook
// desktop's rendering engine doesn't support either.
const HERO_IMAGE_URL = 'https://ironwoodlivigno.com/images/hero-ironwood.jpg';

// Turns bare "https://..." URLs already present in the (already-escaped)
// text into real clickable links — the quick-reply/blank-reply text bodies
// end with a bare photo-gallery URL by convention (see
// buildBlankReplyText/quick-replies.ts), which read fine as plain text in a
// mailto: compose window but would just sit there unclickable in an actual
// HTML email if left as-is.
function linkify(escapedText: string): string {
  return escapedText.replace(/(https?:\/\/[^\s<]+)/g, (url) => `<a href="${url}" style="color:#A8462F;text-decoration:underline;">${url}</a>`);
}

// Branded shell for the actual reply Francesco sends to a guest — the same
// "wow" look (hero photo, brand header) originally built for the automatic
// receipt, moved here because this is the one email that's a considered
// response (availability confirmed/declined, or a free-form answer)
// composed on /reply/:token/:kind and sent directly by our system via SMTP
// (see /reply/:token/send in index.ts), not through Francesco's own mail
// client — a mailto: link can only ever be plain text. bodyText is
// whatever Francesco wrote/edited, taken as-is: split into paragraphs on
// blank lines, single newlines within a paragraph become <br>, and any bare
// URL becomes a real link.
export function buildOutboundEmailHtml(bodyText: string, locale?: string): string {
  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;font-family:${FONT_BODY};font-size:15px;color:#241C15;line-height:1.7;">${linkify(escapeHtml(block)).replace(/\n/g, '<br>')}</p>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="${escapeHtml(locale || 'it')}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#F7F3EC;font-family:${FONT_BODY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(36,28,21,0.14);">

            <!-- Hero photo -->
            <tr>
              <td style="padding:0;line-height:0;font-size:0;">
                <img src="${HERO_IMAGE_URL}" width="600" alt="Ironwood Livigno" style="display:block;width:100%;max-width:600px;height:auto;">
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background-color:#241C15;padding:26px 40px;">
                <p style="margin:0;color:#C9A059;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;">Ironwood Livigno</p>
              </td>
            </tr>

            <!-- Body: Francesco's reply, verbatim -->
            <tr>
              <td style="padding:32px 40px 28px;">
                ${paragraphs}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 40px;background-color:#F7F3EC;border-top:1px solid #EFE6D8;">
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

// Standalone page for GET /reply/:token/:kind (index.ts) — same fonts/
// colors as the notification email. One shared editor for all five kinds
// (available/unavailable/pending/blank/ai): shows the prefilled text (a
// quick-reply template, the blank quoted request, or the AI draft) in an
// editable textarea, with an Italian rendering underneath for the "ai" kind
// only (so Francesco can verify what it actually says before sending, same
// as before). A real HTML <form> POSTs the (possibly edited) textarea value
// straight to /reply/:token/send, which sends it — no client-side mailto:
// building needed anymore, just a form submit.
export function renderReplyEditorPage(
  params: { error: string } | { token: string; kindLabel: string; name: string; body: string; italianText?: string | null; sendError?: string }
): string {
  const inner =
    'error' in params
      ? `<p style="margin:0;font-family:${FONT_BODY};font-size:16px;color:#241C15;">${escapeHtml(params.error)}</p>`
      : `
      ${
        params.sendError
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF1E7;border-radius:12px;border:1px solid #EAD9BE;border-left:4px solid #A8462F;margin-bottom:16px;"><tr><td style="padding:12px 16px;font-family:${FONT_BODY};font-size:13px;color:#241C15;">${escapeHtml(params.sendError)}</td></tr></table>`
          : ''
      }
      <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">${escapeHtml(params.kindLabel)} · ${escapeHtml(params.name)}</p>
      <form method="POST" action="/reply/${params.token}/send">
        <input type="hidden" name="kindLabel" value="${escapeHtml(params.kindLabel)}">
        <input type="hidden" name="name" value="${escapeHtml(params.name)}">
        <textarea name="text" id="replyBody" style="width:100%;box-sizing:border-box;min-height:220px;padding:16px;border-radius:14px;border:1px solid #EAD9BE;background-color:#FBF1E7;font-family:${FONT_BODY};font-size:15px;color:#241C15;line-height:1.6;resize:vertical;">${escapeHtml(params.body)}</textarea>
        <div style="margin:14px 0 0;">
          <button type="button" id="copyBtn" style="cursor:pointer;background-color:#ffffff;color:#241C15;border:1px solid #EFE6D8;border-radius:999px;padding:12px 22px;font-family:${FONT_BODY};font-size:14px;font-weight:600;margin-right:10px;">📋 Copia testo</button>
          <button type="submit" style="cursor:pointer;background-color:#A8462F;color:#ffffff;border:none;border-radius:999px;padding:12px 22px;font-family:${FONT_BODY};font-size:14px;font-weight:600;">✉️ Invia al cliente →</button>
        </div>
      </form>
      <p style="margin:14px 0 0;font-family:${FONT_BODY};font-size:12px;color:#241C15;opacity:0.45;">Parte subito dal nostro sistema, con lo stesso stile grafico della ricevuta automatica. Riceverai una copia in copia nascosta su info@ironwoodlivigno.com.</p>
      ${
        params.italianText
          ? `
      <p style="margin:22px 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#241C15;opacity:0.45;">Traduzione in italiano (per verifica)</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;"><tr><td style="padding:16px 20px;font-family:${FONT_BODY};font-size:15px;color:#241C15;opacity:0.85;line-height:1.6;">${escapeHtml(params.italianText).replace(/\n/g, '<br>')}</td></tr></table>`
          : ''
      }
      <script>
        (function () {
          var ta = document.getElementById('replyBody');
          var copyBtn = document.getElementById('copyBtn');
          copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(ta.value).then(function () {
              var original = copyBtn.textContent;
              copyBtn.textContent = 'Copiato ✓';
              setTimeout(function () { copyBtn.textContent = original; }, 1800);
            });
          });
        })();
      </script>`;

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rispondi al cliente — Ironwood Livigno</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F7F3EC;font-family:${FONT_BODY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(36,28,21,0.10);">
            <tr>
              <td style="background-color:#241C15;padding:24px 32px;">
                <p style="margin:0;color:#C9A059;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;">Ironwood Livigno</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 32px;">
                ${inner}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Confirmation page after POST /reply/:token/send succeeds.
export function renderReplySentPage(email: string): string {
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inviata — Ironwood Livigno</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F7F3EC;font-family:${FONT_BODY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(36,28,21,0.10);">
            <tr>
              <td style="background-color:#241C15;padding:24px 32px;">
                <p style="margin:0;color:#C9A059;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;">Ironwood Livigno</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;text-align:center;">
                <p style="margin:0;font-family:${FONT_BODY};font-size:17px;color:#241C15;">✓ Risposta inviata a<br><strong>${escapeHtml(email)}</strong></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

