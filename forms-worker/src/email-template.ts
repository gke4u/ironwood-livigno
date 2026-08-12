// HTML template for the internal notification email. Table-based layout
// with inline styles throughout — email clients (especially Outlook's Word
// rendering engine) ignore or mis-render <style> blocks and modern CSS
// (flexbox/grid), so inline styles on tables/cells is still the only
// approach that renders consistently everywhere. Colors match the site's
// own palette (tailwind.config.ts: brick #A8462F, ink #241C15, gold
// #C9A059, cream #EFE6D8, mist #F7F3EC).
import type { Submission } from './index';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EFE6D8;font-size:13px;color:#241C15;opacity:0.55;text-transform:uppercase;letter-spacing:0.06em;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EFE6D8;font-size:15px;color:#241C15;vertical-align:top;">${value}</td>
    </tr>`;
}

export function buildNotificationHtml(data: Submission, id: number, country: string): string {
  const extras = [data.extra_breakfast ? 'Colazione' : null, data.extra_ebike ? 'Noleggio e-bike' : null].filter(Boolean).join(' + ');

  const rows = [
    row('Nome', escapeHtml(data.name)),
    row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#A8462F;text-decoration:none;">${escapeHtml(data.email)}</a>`),
    data.phone ? row('Telefono', `<a href="tel:${escapeHtml(data.phone)}" style="color:#A8462F;text-decoration:none;">${escapeHtml(data.phone)}</a>`) : '',
    row('Ospiti', String(data.guests)),
    extras ? row('Extra richiesti', escapeHtml(extras)) : '',
    data.source ? row('Come ci ha trovato', escapeHtml(data.source)) : '',
    data.locale ? row('Lingua sito', escapeHtml(data.locale)) : '',
    country ? row('Paese (da IP)', escapeHtml(country)) : ''
  ]
    .filter(Boolean)
    .join('');

  return `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:0;background-color:#F7F3EC;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(36,28,21,0.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:#241C15;padding:28px 32px;">
                <p style="margin:0;color:#EFE6D8;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Ironwood Livigno</p>
                <p style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:bold;">Nuova richiesta di disponibilità</p>
              </td>
            </tr>

            <!-- Check-in / check-out highlight -->
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;width:50%;text-align:center;border-right:1px solid #EFE6D8;">
                      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#241C15;opacity:0.55;">Check-in</p>
                      <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#A8462F;">${escapeHtml(data.checkin)}</p>
                    </td>
                    <td style="padding:18px 20px;width:50%;text-align:center;">
                      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#241C15;opacity:0.55;">Check-out</p>
                      <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#A8462F;">${escapeHtml(data.checkout)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Guest details -->
            <tr>
              <td style="padding:24px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
              </td>
            </tr>

            ${
              data.message
                ? `
            <!-- Message -->
            <tr>
              <td style="padding:8px 32px 24px;">
                <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#241C15;opacity:0.55;">Messaggio</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F3EC;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;font-size:15px;color:#241C15;line-height:1.5;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</td>
                  </tr>
                </table>
              </td>
            </tr>`
                : ''
            }

            <!-- CTA -->
            <tr>
              <td style="padding:8px 32px 32px;">
                <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent('Re: la tua richiesta a Ironwood Livigno')}"
                   style="display:inline-block;background-color:#A8462F;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:13px 28px;border-radius:999px;">
                  Rispondi a ${escapeHtml(data.name.split(' ')[0] || data.name)} →
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 32px;background-color:#F7F3EC;border-top:1px solid #EFE6D8;">
                <p style="margin:0;font-size:12px;color:#241C15;opacity:0.55;">
                  Richiesta #${id} · salvata nel database · questa email arriva direttamente da forms.ironwoodlivigno.com
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
