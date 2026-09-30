// Kept apart from src/content/blogTranslations.ts on purpose: Nav and
// MobileMenu are client components, and importing the translations file
// there would ship every translated article in the client bundle.

const BLOG_LOCALES = ['en', 'de', 'pl', 'nl', 'cs'] as const;
type BlogLocale = (typeof BLOG_LOCALES)[number];

// Which blog translation a site locale should read: en-us shares the
// British English articles; da, no, fr, zh and ja have none.
export function blogLocaleFor(locale: string): BlogLocale | null {
  if (locale === 'en-us') return 'en';
  return (BLOG_LOCALES as readonly string[]).includes(locale) ? (locale as BlogLocale) : null;
}

// The blog index a site locale should link to: /blog (Italian), the
// locale's own /blog/<locale>, or /blog/en for the locales with no blog
// translation (da, no, fr, zh, ja), whose readers are far likelier to read
// English than Italian.
export function blogIndexHref(locale: string): string {
  if (locale === 'it') return '/blog';
  return `/blog/${blogLocaleFor(locale) ?? 'en'}`;
}
