// The contact address never appears whole in the static HTML: spam bots
// harvest anything shaped like name@domain from page source (the 2026-10
// spam wave on info@). Pages ship the readable "info [at] ..." form, and
// the real address is put together in the browser after load
// (see components/EmailLink.tsx). The "@" comes from a char code so the
// minifier can't fold the parts back into one literal in the JS bundle.
const USER = 'info';
const DOMAIN = 'ironwoodlivigno.com';

/** Human-readable, bot-unfriendly form — safe to put in HTML, JSON-LD, llms.txt. */
export const EMAIL_SAFE = `${USER} [at] ${DOMAIN}`;

/** The real address. Call only in the browser (event handlers / effects). */
export function contactEmail(): string {
  return USER + String.fromCharCode(64) + DOMAIN;
}
