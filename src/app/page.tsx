import { defaultLocale } from '@/i18n/routing';

// Static export has no server, so this can't be a server-side redirect()
// like a dynamic Next.js app would use. Instead this renders a tiny static
// HTML page that redirects immediately: a <meta http-equiv="refresh"> for
// crawlers/no-JS visitors (fires with zero delay) and a JS replace() as a
// fast path for everyone else. Search engines follow meta-refresh-0 exactly
// like a redirect.
export default function RootPage() {
  const target = `/${defaultLocale}`;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
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
