// Minimal SMTP submission client over Cloudflare Workers' TCP Sockets API
// (connect() from `cloudflare:sockets`). Talks directly to the site owner's
// existing mailbox.org mailbox — no third-party email service, no new
// account, no new company touching guest data. Only port 587 (authenticated
// submission, STARTTLS) is used; Workers blocks outbound port 25 (MTA
// relay) but not 587, which is what any normal mail client uses too.
//
// Hand-rolled rather than a library because nothing in the npm SMTP
// ecosystem targets the Workers `cloudflare:sockets` API directly (they
// assume Node's `net`/`tls` modules) — this implements just the subset of
// RFC 5321 needed for a single authenticated submission: EHLO, STARTTLS,
// AUTH LOGIN, MAIL FROM/RCPT TO/DATA, QUIT.
import { connect } from 'cloudflare:sockets';

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
};

export type SmtpMessage = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
};

class SmtpError extends Error {}

function b64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

// Dot-stuffing (RFC 5321 4.5.2): any line starting with '.' gets an extra
// leading '.' so the SMTP server doesn't mistake it for the end-of-DATA
// marker, and all line endings must be CRLF.
function stuffDots(body: string): string {
  return body
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => (line.startsWith('.') ? '.' + line : line))
    .join('\r\n');
}

async function sendAll(writer: WritableStreamDefaultWriter<Uint8Array>, text: string) {
  await writer.write(new TextEncoder().encode(text));
}

// Reads one SMTP response "block" — a single line, or the full run of a
// multi-line response (e.g. EHLO's capability list: "250-STARTTLS" ...
// "250 AUTH LOGIN"). Returns the numeric code and the full raw block, and
// throws if the server reports an error (4xx/5xx).
async function readResponse(reader: ReadableStreamDefaultReader<Uint8Array>, state: { buf: string }): Promise<{ code: number; lines: string[] }> {
  const lines: string[] = [];
  for (;;) {
    while (!state.buf.includes('\r\n')) {
      const { value, done } = await reader.read();
      if (done) throw new SmtpError('connection closed while reading response');
      state.buf += new TextDecoder().decode(value);
    }
    const idx = state.buf.indexOf('\r\n');
    const line = state.buf.slice(0, idx);
    state.buf = state.buf.slice(idx + 2);
    lines.push(line);
    // "250-..." continues, "250 ..." (space) or "250" (bare) is the last line.
    if (!/^\d{3}-/.test(line)) break;
  }
  const code = Number(lines[0].slice(0, 3));
  if (code >= 400) throw new SmtpError(`SMTP error ${code}: ${lines.join(' | ')}`);
  return { code, lines };
}

export async function sendMail(config: SmtpConfig, message: SmtpMessage): Promise<void> {
  const socket = connect({ hostname: config.host, port: config.port }, { secureTransport: 'starttls', allowHalfOpen: false });
  const state = { buf: '' };

  try {
    await socket.opened;
    let reader = socket.readable.getReader();
    let writer = socket.writable.getWriter();

    await readResponse(reader, state); // 220 greeting

    await sendAll(writer, `EHLO forms.ironwoodlivigno.com\r\n`);
    await readResponse(reader, state); // 250 capabilities (pre-TLS)

    await sendAll(writer, `STARTTLS\r\n`);
    await readResponse(reader, state); // 220 ready to start TLS

    // Upgrading closes the plaintext socket's streams — release the locks
    // before switching to the new TLS socket's own reader/writer.
    reader.releaseLock();
    writer.releaseLock();
    const secureSocket = socket.startTls();
    const secureState = { buf: '' };
    const secureReader = secureSocket.readable.getReader();
    const secureWriter = secureSocket.writable.getWriter();

    await sendAll(secureWriter, `EHLO forms.ironwoodlivigno.com\r\n`);
    await readResponse(secureReader, secureState); // 250 capabilities (post-TLS)

    await sendAll(secureWriter, `AUTH LOGIN\r\n`);
    await readResponse(secureReader, secureState); // 334 base64("Username:")
    await sendAll(secureWriter, `${b64(config.user)}\r\n`);
    await readResponse(secureReader, secureState); // 334 base64("Password:")
    await sendAll(secureWriter, `${b64(config.password)}\r\n`);
    await readResponse(secureReader, secureState); // 235 authenticated

    // Envelope sender is the visible/branded address (message.from), not
    // necessarily the SMTP AUTH login (config.user) — mailbox.org accounts
    // with multiple aliases authenticate as the primary address but can
    // send as any alias on the account.
    await sendAll(secureWriter, `MAIL FROM:<${message.from}>\r\n`);
    await readResponse(secureReader, secureState);

    await sendAll(secureWriter, `RCPT TO:<${message.to}>\r\n`);
    await readResponse(secureReader, secureState);

    await sendAll(secureWriter, `DATA\r\n`);
    await readResponse(secureReader, secureState); // 354 start mail input

    const commonHeaders = [
      `From: Ironwood Livigno <${message.from}>`,
      `To: ${message.to}`,
      message.replyTo ? `Reply-To: ${message.replyTo}` : null,
      `Subject: ${message.subject}`,
      'MIME-Version: 1.0'
    ].filter(Boolean);

    let body: string;
    if (message.html) {
      // multipart/alternative: mail clients that render HTML show the
      // formatted version; anything that can't (or is set to prefer plain
      // text) falls back to the text part instead of showing raw markup.
      const boundary = `ironwood_${crypto.randomUUID().replace(/-/g, '')}`;
      const parts = [
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        message.text,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        message.html,
        '',
        `--${boundary}--`
      ].join('\r\n');
      body = [...commonHeaders, `Content-Type: multipart/alternative; boundary="${boundary}"`, '', parts].join('\r\n');
    } else {
      body = [...commonHeaders, 'Content-Type: text/plain; charset="UTF-8"', 'Content-Transfer-Encoding: 8bit', '', message.text].join(
        '\r\n'
      );
    }
    await sendAll(secureWriter, `${stuffDots(body)}\r\n.\r\n`);
    await readResponse(secureReader, secureState); // 250 message accepted

    await sendAll(secureWriter, `QUIT\r\n`);
    try {
      await readResponse(secureReader, secureState);
    } catch {
      // Some servers close the connection immediately after QUIT's 221
      // rather than waiting for us to read it — not a delivery failure.
    }

    secureReader.releaseLock();
    secureWriter.releaseLock();
  } finally {
    await socket.close().catch(() => {});
  }
}
