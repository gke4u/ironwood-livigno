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

function nightsBetween(checkinIso: string, checkoutIso: string): number | null {
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
// email to check dates/message — cursor lands on the two blank lines above
// the quote.
// mailto: bodies are plain text everywhere — no client renders HTML/CSS in
// a compose window pre-filled via the `body` param, so this leans on
// simple ASCII structure (a divider rule, ALL-CAPS section labels) to keep
// EXTRA and NOTA scannable without any formatting to lean on.
function buildReplyMailto(data: Submission, nights: number | null): string {
  const firstName = data.name.trim().split(/\s+/)[0] || data.name;
  const extras = [data.extra_breakfast ? 'Colazione' : null, data.extra_ebike ? 'Noleggio e-bike' : null].filter(Boolean).join(' + ');
  const quoteLines = [
    `Ciao ${firstName},`,
    '',
    '',
    '',
    '────────────────────',
    'LA TUA RICHIESTA',
    '────────────────────',
    `Check-in:  ${data.checkin}`,
    `Check-out: ${data.checkout}${nights ? ` (${nights} ${nights === 1 ? 'notte' : 'notti'})` : ''}`,
    `Ospiti:    ${data.guests}`,
    extras ? `EXTRA:     ${extras}` : null,
    data.message ? '' : null,
    data.message ? 'NOTA DEL CLIENTE:' : null,
    data.message ? `"${data.message}"` : null,
    '',
    // No label text here on purpose — the guest may not read Italian, and
    // a bare URL with a camera emoji needs no translation to be
    // understood. The destination (the site's own photo gallery section)
    // already scrolls through the real photos, so nothing further to
    // build for that.
    `📷 ${PHOTOS_URL}`
  ]
    .filter((l) => l !== null)
    .join('\n');

  const subject = encodeURIComponent('Re: la tua richiesta a Ironwood Livigno');
  const body = encodeURIComponent(quoteLines);
  return `mailto:${encodeURIComponent(data.email)}?subject=${subject}&body=${body}`;
}

export function buildNotificationHtml(data: Submission, id: number, country: string, token: string): string {
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
                 not Italian, next to a "Traduci in italiano" button that
                 opens the on-demand translation page (GET /translate/:token)
                 — translation is a click away, not attempted automatically
                 at send time (that repeatedly failed for infra reasons
                 unrelated to this email itself; decoupling it means a
                 translation problem can never delay the notification). -->
            <tr>
              <td style="padding:24px 36px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">✎ Nota di ${firstName}</td>
                    ${
                      data.locale && data.locale !== 'it'
                        ? `<td align="right">
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-left:auto;"><tr>
                              <td style="padding-right:6px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background-color:#241C15;border-radius:999px;padding:3px 12px;"><span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:#EFE6D8;white-space:nowrap;">Scritta in ${escapeHtml(localeDisplayName(data.locale))}</span></td></tr></table></td>
                              <td><a href="https://forms.ironwoodlivigno.com/translate/${token}" style="display:inline-block;background-color:#A8462F;border-radius:999px;padding:3px 12px;text-decoration:none;"><span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;">🌐 Traduci in italiano</span></a></td>
                            </tr></table>
                          </td>`
                        : ''
                    }
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF1E7;border-radius:14px;border:1px solid #EAD9BE;border-left:5px solid #A8462F;">
                  <tr>
                    <td style="padding:18px 20px;font-family:${FONT_BODY};font-size:16px;font-weight:500;color:#241C15;line-height:1.6;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</td>
                  </tr>
                </table>
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

// Small standalone page for GET /translate/:token — same fonts/colors as
// the notification email so it doesn't feel like a different product.
export function renderTranslatePage(
  params: { error: string; original?: string } | { name: string; original: string; translation: NonNullable<Translation> }
): string {
  const body =
    'error' in params
      ? `
      <p style="margin:0 0 16px;font-family:${FONT_BODY};font-size:16px;color:#241C15;">${escapeHtml(params.error)}</p>
      ${
        params.original
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;margin-top:8px;"><tr><td style="padding:16px 20px;font-family:${FONT_BODY};font-size:15px;color:#241C15;line-height:1.6;">${escapeHtml(params.original).replace(/\n/g, '<br>')}</td></tr></table>`
          : ''
      }`
      : `
      <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#A8462F;">Traduzione automatica · nota di ${escapeHtml(params.name)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF1E7;border-radius:14px;border:1px solid #EAD9BE;border-left:5px solid #A8462F;margin-bottom:20px;">
        <tr><td style="padding:18px 20px;font-family:${FONT_BODY};font-size:16px;font-weight:500;color:#241C15;line-height:1.6;">${escapeHtml(params.translation.translatedText).replace(/\n/g, '<br>')}</td></tr>
      </table>
      <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#241C15;opacity:0.45;">Testo originale (${escapeHtml(params.translation.sourceLanguageLabel)})</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:14px;"><tr><td style="padding:16px 20px;font-family:${FONT_BODY};font-size:15px;color:#241C15;opacity:0.75;font-style:italic;line-height:1.6;">${escapeHtml(params.original).replace(/\n/g, '<br>')}</td></tr></table>`;

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traduzione — Ironwood Livigno</title>
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
