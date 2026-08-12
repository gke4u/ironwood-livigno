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
import type { Draft } from './draft';

const FONT_DISPLAY = "Georgia,'Times New Roman',serif";
const FONT_BODY = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const PHOTOS_URL = 'https://ironwoodlivigno.com/it#galleria';

function escapeHtml(value: string): string {
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

// Pre-fills the reply with the guest's own request quoted underneath, so
// Francesco can start typing straight away without switching back to this
// email to check dates/message — cursor lands on the three blank lines
// above the quote, meant for HIS OWN greeting (not a pre-written "Ciao
// {name}," — he may want to write it in the guest's language, or phrase it
// differently, and a hardcoded Italian greeting isn't his to have decided
// for him). The quote itself opens with the Ironwood Livigno name and the
// stay dates instead, as a neutral reference header.
//
// Subject and field labels are localized to the guest's own site language
// (data.locale) via reply-labels.ts — a German guest shouldn't get a reply
// whose subject and labels are in Italian. Only the guest's own free-text
// message is left exactly as they wrote it.
//
// mailto: bodies are plain text everywhere — no client renders HTML/CSS in
// a compose window pre-filled via the `body` param, so this leans on
// simple ASCII structure (a divider rule, ALL-CAPS section labels) to keep
// EXTRA and NOTE scannable without any formatting to lean on.
function buildReplyMailto(data: Submission, nights: number | null): string {
  const t = replyLabelsFor(data.locale);
  const extras = [data.extra_breakfast ? t.breakfast : null, data.extra_ebike ? t.ebike : null].filter(Boolean).join(' + ');
  const nightsWord = nights === 1 ? t.night : t.nights;
  const quoteLines = [
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
    data.message ? `"${data.message}"` : null,
    '',
    // No label text here on purpose — a bare URL with a camera emoji needs
    // no translation to be understood. The destination (the site's own
    // photo gallery section) already scrolls through the real photos, so
    // nothing further to build for that.
    `📷 ${PHOTOS_URL}`
  ]
    .filter((l) => l !== null)
    .join('\n');

  const subject = encodeURIComponent(t.subject);
  const body = encodeURIComponent(quoteLines);
  // Only the query params (subject/body) get percent-encoded — the
  // recipient address before the "?" must stay as plain addr-spec per
  // RFC 6068. Running encodeURIComponent on it too turns "@" into "%40",
  // which some mail clients paste verbatim into the To field instead of
  // decoding it back.
  return `mailto:${data.email}?subject=${subject}&body=${body}`;
}

export function buildNotificationHtml(data: Submission, id: number, country: string, token: string, translation: Translation): string {
  const nights = nightsBetween(data.checkin_iso, data.checkout_iso);
  const firstName = escapeHtml(data.name.trim().split(/\s+/)[0] || data.name);

  const rows = [
    row('Nome', escapeHtml(data.name)),
    row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#A8462F;text-decoration:none;">${escapeHtml(data.email)}</a>`),
    data.phone ? row('Telefono', `<a href="tel:${escapeHtml(data.phone)}" style="color:#A8462F;text-decoration:none;">${escapeHtml(data.phone)}</a>`) : '',
    row('Ospiti', String(data.guests)),
    data.source ? row('Come ci ha trovato', escapeHtml(data.source)) : '',
    data.locale ? row('Lingua sito', escapeHtml(localeDisplayName(data.locale))) : '',
    country ? row('Paese (da IP)', escapeHtml(country)) : ''
  ]
    .filter(Boolean)
    .join('');

  const extraPills = [data.extra_breakfast ? 'Colazione' : null, data.extra_ebike ? 'Noleggio e-bike' : null]
    .filter((e): e is string => e !== null)
    .map(
      (e) =>
        `<td style="padding:0 8px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background-color:#C9A059;border-radius:999px;padding:8px 16px;"><span style="font-family:${FONT_BODY};font-size:13px;font-weight:700;color:#241C15;white-space:nowrap;">✓ ${escapeHtml(e)}</span></td></tr></table></td>`
    )
    .join('');

  const replyHref = buildReplyMailto(data, nights);

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
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>${extraPills}</tr></table>
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

            <!-- CTA -->
            <tr>
              <td style="padding:16px 36px 36px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background-color:#A8462F;">
                      <a href="${replyHref}"
                         style="display:inline-block;color:#ffffff;text-decoration:none;font-family:${FONT_BODY};font-size:15px;font-weight:600;padding:14px 30px;">
                        Rispondi a ${firstName} →
                      </a>
                    </td>
                    <td style="width:12px;"></td>
                    <td style="border-radius:999px;border:1px solid #EFE6D8;">
                      <a href="${PHOTOS_URL}"
                         style="display:inline-block;color:#241C15;text-decoration:none;font-family:${FONT_BODY};font-size:15px;font-weight:600;padding:14px 24px;">
                        Foto dell'appartamento
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:12px 0 0;font-family:${FONT_BODY};font-size:12px;color:#241C15;opacity:0.45;">La risposta parte già con la richiesta di ${firstName} in citazione.</p>
                <p style="margin:10px 0 0;"><a href="https://forms.ironwoodlivigno.com/draft/${token}" style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:#A8462F;text-decoration:none;">✍️ Genera bozza di risposta con l'AI →</a></p>
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
// sits inside an inline <script> block — JSON.stringify already escapes
// quotes/backslashes, this just additionally neutralizes a literal
// "</script" sequence so it can't prematurely close the tag.
function jsonForScript(value: string): string {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}

// Standalone page for GET /draft/:token — same fonts/colors as the
// notification email. Shows the AI-generated reply draft (in the guest's
// own language) in an editable textarea, an Italian rendering underneath
// so the owner can verify what it says before sending, and two actions:
// copy the (possibly edited) text to the clipboard, or open it directly in
// the owner's mail client via a client-built mailto: link — built in JS
// from the textarea's live value, not a static href, so edits are
// reflected in whichever action is used.
export function renderDraftPage(
  params: { error: string } | { name: string; email: string; subject: string; draft: Draft }
): string {
  const body =
    'error' in params
      ? `<p style="margin:0;font-family:${FONT_BODY};font-size:16px;color:#241C15;">${escapeHtml(params.error)}</p>`
      : `
      <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">Bozza di risposta per ${escapeHtml(params.name)} · ${escapeHtml(params.draft.replyLanguageLabel)}</p>
      <textarea id="draftBody" style="width:100%;box-sizing:border-box;min-height:220px;padding:16px;border-radius:14px;border:1px solid #EAD9BE;background-color:#FBF1E7;font-family:${FONT_BODY};font-size:15px;color:#241C15;line-height:1.6;resize:vertical;">${escapeHtml(params.draft.replyText)}</textarea>
      <div style="margin:14px 0 0;">
        <button type="button" id="copyBtn" style="cursor:pointer;background-color:#A8462F;color:#ffffff;border:none;border-radius:999px;padding:12px 22px;font-family:${FONT_BODY};font-size:14px;font-weight:600;margin-right:10px;">📋 Copia testo</button>
        <button type="button" id="mailBtn" style="cursor:pointer;background-color:#ffffff;color:#241C15;border:1px solid #EFE6D8;border-radius:999px;padding:12px 22px;font-family:${FONT_BODY};font-size:14px;font-weight:600;">✉️ Apri in client di posta</button>
      </div>
      ${
        params.draft.italianText
          ? `
      <p style="margin:22px 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#241C15;opacity:0.45;">Traduzione in italiano (per verifica)</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;"><tr><td style="padding:16px 20px;font-family:${FONT_BODY};font-size:15px;color:#241C15;opacity:0.85;line-height:1.6;">${escapeHtml(params.draft.italianText).replace(/\n/g, '<br>')}</td></tr></table>`
          : ''
      }
      <script>
        (function () {
          var ta = document.getElementById('draftBody');
          var copyBtn = document.getElementById('copyBtn');
          var mailBtn = document.getElementById('mailBtn');
          var to = ${jsonForScript(params.email)};
          var subject = ${jsonForScript(params.subject)};
          copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(ta.value).then(function () {
              var original = copyBtn.textContent;
              copyBtn.textContent = 'Copiato ✓';
              setTimeout(function () { copyBtn.textContent = original; }, 1800);
            });
          });
          mailBtn.addEventListener('click', function () {
            window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(ta.value);
          });
        })();
      </script>`;

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bozza di risposta — Ironwood Livigno</title>
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
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
