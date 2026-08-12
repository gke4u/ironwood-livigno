// NOTE: with `output: 'export'` in next.config.mjs (static export, for
// drag-and-drop deploys), Next.js disables middleware entirely — this file
// is not used and `next build` prints a harmless warning about it. It's
// kept only in case the project ever switches to a dynamic/server
// deployment (e.g. Cloudflare Workers via OpenNext), where it would be
// needed again for automatic locale detection on "/".
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/routing';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(it|en|de|fr|da|pl|cs|no|nl|zh|ja|en-us)/:path*']
};
