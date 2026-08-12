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
  fromName?: string; // display name on the From header — defaults to "Ironwood Livigno"
  to: string | string[]; // multiple recipients (e.g. the internal notification + a failure alert to a personal address) get one RCPT TO each
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
};

class SmtpError extends Error {}

function b64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

// Strips CR/LF from a value before it's used inside a header line. Guest-
// supplied text (the name, which becomes both the visible From display
// name and part of the Subject) isn't restricted upstream against control
// characters — without this, an embedded "\r\n" could terminate that
// header early and inject an arbitrary extra one (classic email header
// injection, e.g. a smuggled Bcc: line). This is the single choke point
// every outgoing header value passes through, so it's the real defense
// regardless of what upstream validation does or misses.
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

// RFC 5322 headers must be 7-bit ASCII — any non-ASCII character (an
// accented letter, an em dash, an emoji) has to be wrapped as an RFC 2047
// "encoded word" instead of written raw. Raw UTF-8 bytes in a header is
// invalid and a strong, well-known spam signal — every message this Worker
// sends has one guaranteed non-ASCII character in its subject ("disponibilità",
// the — em dash, or the ⚠ alert prefix), so this was silently getting every
// single email penalized.
function encodeHeaderWord(value: string): string {
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${b64(value)}?=`;
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

type SmtpSocket = ReturnType<typeof connect>;

// Connects, upgrades to TLS, and authenticates — the identical handshake
// needed both before sending a real message and for the standalone
// connectivity check below. Returns the live socket/reader/writer,
// authenticated and ready for whatever comes next (MAIL FROM/RCPT TO/DATA,
// or just an immediate QUIT for a health check).
async function openAuthenticatedSession(
  config: SmtpConfig
): Promise<{ socket: SmtpSocket; reader: ReadableStreamDefaultReader<Uint8Array>; writer: WritableStreamDefaultWriter<Uint8Array>; state: { buf: string } }> {
  const socket = connect({ hostname: config.host, port: config.port }, { secureTransport: 'starttls', allowHalfOpen: false });

  await socket.opened;
  const state = { buf: '' };
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

  return { socket, reader: secureReader, writer: secureWriter, state: secureState };
}

// Connects, authenticates, and immediately quits without sending anything —
// used by the daily health-check cron (see index.ts scheduled()) to catch a
// broken mailbox.org connection during a quiet period with no real form
// submissions, instead of only discovering it when a real guest request
// fails to notify. Throws on any failure (connection, TLS, or auth); the
// caller decides what to do about it.
export async function checkSmtpConnection(config: SmtpConfig): Promise<void> {
  const { socket, reader, writer, state } = await openAuthenticatedSession(config);
  try {
    await sendAll(writer, `QUIT\r\n`);
    try {
      await readResponse(reader, state);
    } catch {
      // Some servers close the connection immediately after QUIT's 221
      // rather than waiting for us to read it — not a failure.
    }
  } finally {
    await socket.close().catch(() => {});
  }
}

export async function sendMail(config: SmtpConfig, message: SmtpMessage): Promise<void> {
  const { socket, reader: secureReader, writer: secureWriter, state: secureState } = await openAuthenticatedSession(config);

  try {
    // Envelope sender is the visible/branded address (message.from), not
    // necessarily the SMTP AUTH login (config.user) — mailbox.org accounts
    // with multiple aliases authenticate as the primary address but can
    // send as any alias on the account.
    await sendAll(secureWriter, `MAIL FROM:<${message.from}>\r\n`);
    await readResponse(secureReader, secureState);

    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    for (const recipient of recipients) {
      await sendAll(secureWriter, `RCPT TO:<${recipient}>\r\n`);
      await readResponse(secureReader, secureState);
    }

    await sendAll(secureWriter, `DATA\r\n`);
    await readResponse(secureReader, secureState); // 354 start mail input

    // Date and Message-ID are required/expected by RFC 5322 and checked by
    // essentially every spam filter (missing either is a well-known,
    // significant spam signal — SpamAssassin's MISSING_DATE/MISSING_MID
    // rules, mailbox.org's own filter likely similar). Easy to miss when
    // hand-building headers since most SMTP libraries add these silently.
    const fromName = sanitizeHeaderValue(message.fromName ?? 'Ironwood Livigno');
    const isAsciiFromName = /^[\x00-\x7F]*$/.test(fromName);
    // A pure-ASCII display name keeps the familiar quoted "Name" <addr>
    // form; a non-ASCII one (a guest's accented name, an emoji prefix on
    // the alert sender) has to be an encoded word instead, unquoted — a
    // quoted encoded-word is non-standard and some clients don't decode it.
    const fromHeader = isAsciiFromName ? `"${fromName.replace(/"/g, "'")}" <${message.from}>` : `${encodeHeaderWord(fromName)} <${message.from}>`;

    const commonHeaders = [
      `From: ${fromHeader}`,
      `To: ${recipients.join(', ')}`,
      message.replyTo ? `Reply-To: ${sanitizeHeaderValue(message.replyTo)}` : null,
      `Subject: ${encodeHeaderWord(sanitizeHeaderValue(message.subject))}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@forms.ironwoodlivigno.com>`,
      'MIME-Version: 1.0'
    ].filter(Boolean);

    // Single-part HTML (no multipart/alternative): a hand-rolled multipart
    // boundary was rendering unreliably across mail clients (no styling,
    // dead links) — one Content-Type is simpler and has far fewer ways to
    // go wrong for an internal notification email that doesn't need a
    // plain-text fallback.
    const contentType = message.html ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';
    const body = [...commonHeaders, `Content-Type: ${contentType}`, 'Content-Transfer-Encoding: 8bit', '', message.html ?? message.text].join(
      '\r\n'
    );
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
