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

// Nothing in this file previously bounded how long a socket connect or a
// response read could take — cloudflare:sockets gives no built-in timeout,
// so a stalled TCP handshake or a mailbox.org response that never arrives
// left every await here pending indefinitely. With sendNotification() now
// run via ctx.waitUntil() (see index.ts) that no longer blocks the guest's
// HTTP response, but an unbounded hang still keeps the Worker invocation
// alive doing nothing and — worse, for the daily cron health check in
// index.ts's scheduled() — can silently prevent the "SMTP is broken" alert
// from ever firing, since that alert only runs after checkSmtpConnection
// itself settles.
const SMTP_CONNECT_TIMEOUT_MS = 10_000;
const SMTP_READ_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new SmtpError(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

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

// Safety net against a real bug found in production: three long mailto:
// links (percent-encoded reply text, each 700+ characters) concatenated
// with no separator produced one ~2000+ character line. Some mail relay
// along the way force-wraps lines past a length limit, and the wrap
// landed inside an href="..." attribute — corrupting that <a> tag, so the
// raw percent-encoded text spilled out as visible garbled text in the
// recipient's inbox instead of staying hidden inside the link. The
// template itself no longer produces that specific case (see
// email-template.ts), but this is the actual choke point every line
// passes through before transmission, so it's the right place for a
// general safeguard against the same failure mode recurring — e.g. a
// guest's free-text message (up to 2000 characters) pushes the "Rispondi"
// mailto link itself past a safe length on its own.
//
// Only breaks at an actual space character, never mid-token — a
// percent-encoded URL has no literal spaces in it (encodeURIComponent
// turns them into %20), so this can never land inside one and corrupt a
// %XX escape sequence or a URL. If a line has no space within the limit
// (i.e. is one unbroken token, like a bare long URL) it's left as is:
// leaving a line long is the pre-existing risk this doesn't newly
// introduce, whereas a blind mid-token break would.
function foldLongLines(body: string, maxLen = 900): string {
  return body
    .split('\n')
    .map((line) => {
      if (line.length <= maxLen) return line;
      const parts: string[] = [];
      let rest = line;
      while (rest.length > maxLen) {
        const breakAt = rest.lastIndexOf(' ', maxLen);
        if (breakAt <= 0) break; // no safe break point — leave the rest as one line
        parts.push(rest.slice(0, breakAt));
        rest = rest.slice(breakAt + 1);
      }
      parts.push(rest);
      return parts.join('\n');
    })
    .join('\n');
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

// One TCP chunk from the socket is not guaranteed to end on a UTF-8
// character boundary — a multi-byte sequence (an accented character in a
// mailbox.org response) can be split across two reads. A fresh
// `new TextDecoder().decode(value)` per chunk (the previous approach) treats
// each fragment as complete on its own, so a split sequence's dangling
// bytes get silently replaced with U+FFFD instead of being carried over.
// One decoder per connection, called with `{ stream: true }`, buffers any
// incomplete trailing bytes and prepends them to the next chunk instead.
type ReadState = { buf: string; decoder: TextDecoder };

function newReadState(): ReadState {
  return { buf: '', decoder: new TextDecoder() };
}

// Reads one SMTP response "block" — a single line, or the full run of a
// multi-line response (e.g. EHLO's capability list: "250-STARTTLS" ...
// "250 AUTH LOGIN"). Returns the numeric code and the full raw block, and
// throws if the server reports an error (4xx/5xx).
async function readResponse(reader: ReadableStreamDefaultReader<Uint8Array>, state: ReadState): Promise<{ code: number; lines: string[] }> {
  const lines: string[] = [];
  for (;;) {
    while (!state.buf.includes('\r\n')) {
      const { value, done } = await withTimeout(reader.read(), SMTP_READ_TIMEOUT_MS, 'timed out waiting for SMTP response');
      if (done) throw new SmtpError('connection closed while reading response');
      state.buf += state.decoder.decode(value, { stream: true });
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
): Promise<{ socket: SmtpSocket; reader: ReadableStreamDefaultReader<Uint8Array>; writer: WritableStreamDefaultWriter<Uint8Array>; state: ReadState }> {
  const socket = connect({ hostname: config.host, port: config.port }, { secureTransport: 'starttls', allowHalfOpen: false });

  // Everything from here on can throw (connect timeout, a rejected/garbled
  // response, a timed-out read) — previously none of it was guarded, so a
  // failure at any step left this `socket` connected but abandoned: neither
  // caller's own try/finally starts until *after* this function returns,
  // so it never runs. Closing here on the way out keeps a bad handshake
  // from leaking an open TCP connection.
  try {
    await withTimeout(socket.opened, SMTP_CONNECT_TIMEOUT_MS, 'timed out connecting to SMTP server');
    const state = newReadState();
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
    const secureState = newReadState();
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
  } catch (err) {
    await socket.close().catch(() => {});
    throw err;
  }
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
    // foldLongLines only applies to the content, not the headers above —
    // header values are already bounded/sanitized and folding one would
    // need proper RFC 5322 continuation-line syntax, a different mechanism
    // from plain line breaks.
    const content = foldLongLines(message.html ?? message.text);
    const body = [...commonHeaders, `Content-Type: ${contentType}`, 'Content-Transfer-Encoding: 8bit', '', content].join(
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
