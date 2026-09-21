import type { Metadata } from 'next';
import { defaultLocale } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

// Real title/description, matching the /it homepage (messages/it.json
// seo_title/seo_description) — even with the canonical below pointing at
// /it, Google was observed (GSC Performance, Sept 2026) still ranking this
// bare "/" URL directly, with no <title> of its own, presumably falling
// back to this page's only visible text ("Continue to Ironwood Livigno")
// as its SERP snippet. That's a broken-looking result users have little
// reason to click, dragging this URL's CTR to well under half of /it's at
// a similar position. A real title/description at least gives Google a
// proper snippet to show for as long as it keeps surfacing "/" instead of
// fully consolidating onto the canonical.
export const metadata: Metadata = {
  title: 'Ironwood Livigno — Appartamento a Livigno con sauna privata',
  description:
    'Appartamento di 90 m² a Livigno con sauna a infrarossi e bagno turco privati, 3 camere, 2 bagni, a 100 m dagli impianti. Per famiglie e gruppi fino a 6.'
};

// Static export has no server, so this can't be a server-side redirect()
// like a dynamic Next.js app would use. Instead this renders a tiny static
// HTML page that redirects immediately: a <meta http-equiv="refresh"> for
// crawlers/no-JS visitors (fires with zero delay) and a JS replace() as a
// fast path for everyone else. Search engines follow meta-refresh-0 exactly
// like a redirect.
//
// The canonical must be an absolute URL: a relative href="/it" is valid
// HTML but Google's documentation recommends absolute canonicals, since a
// relative one is resolved against whatever URL the crawler happened to
// fetch (including http:// or www. variants). The real 301 for "/" lives in
// public/_redirects (see the note there); this page is the fallback for
// when that rule isn't applied.
export default function RootPage() {
  const target = `/${defaultLocale}`;
  const canonical = `${siteUrl}${target}`;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={canonical} />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: `window.location.replace(${JSON.stringify(target)});` }}
        />
        <p>
          <a href={target}>Continue to Ironwood Livigno</a>
        </p>
      </body>
    </html>
  );
}
