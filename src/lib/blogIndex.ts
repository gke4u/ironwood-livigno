// Kept apart from src/content/blogTranslations.ts on purpose: Nav and
// MobileMenu are client components, and importing the translations file
// there would ship every translated article in the client bundle.

// Which blog translation a site locale should read: en-us shares the
// British English articles, the other non-Italian locales have none.
export function blogLocaleFor(locale: string): 'en' | 'de' | null {
  if (locale === 'de') return 'de';
  if (locale === 'en' || locale === 'en-us') return 'en';
  return null;
}

// The blog index a site locale should link to: /blog (Italian), /blog/de,
// or /blog/en — also for the locales with no blog translation of their own
// (nl, da, no, pl, cs, zh, ja), whose readers are far likelier to read
// English than Italian.
export function blogIndexHref(locale: string): string {
  if (locale === 'it') return '/blog';
  return `/blog/${blogLocaleFor(locale) ?? 'en'}`;
}
