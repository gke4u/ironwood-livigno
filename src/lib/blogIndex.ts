// Kept apart from src/content/blogTranslations.ts on purpose: Nav and
// MobileMenu are client components, and importing the translations file
// there would ship every translated article in the client bundle.

const BLOG_LOCALES = ['en', 'de', 'pl', 'nl', 'cs', 'fr', 'da', 'no', 'zh', 'ja'] as const;
type BlogLocale = (typeof BLOG_LOCALES)[number];

// Which blog translation a site locale should read: en-us shares the
// British English articles.
export function blogLocaleFor(locale: string): BlogLocale | null {
  if (locale === 'en-us') return 'en';
  return (BLOG_LOCALES as readonly string[]).includes(locale) ? (locale as BlogLocale) : null;
}

// The blog index a site locale should link to: /blog (Italian) or the
// locale's own /blog/<locale>, with /blog/en as the fallback for any
// future locale without a blog translation yet.
export function blogIndexHref(locale: string): string {
  if (locale === 'it') return '/blog';
  return `/blog/${blogLocaleFor(locale) ?? 'en'}`;
}
