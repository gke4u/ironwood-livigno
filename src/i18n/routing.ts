export const locales = ['it', 'en', 'de', 'fr', 'da', 'pl', 'cs', 'no', 'nl', 'zh', 'ja', 'en-us'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

export const localeLabels: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  da: 'Dansk',
  pl: 'Polski',
  cs: 'Čeština',
  no: 'Norsk',
  nl: 'Nederlands',
  zh: '中文',
  ja: '日本語',
  'en-us': 'English (US)'
};

// Translated slug for the Contact page per locale — e.g. /it/contatti,
// /de/kontakt, /en/contact. zh and ja deliberately keep the Latin "contact"
// slug rather than a Han/Kana transliteration: most CJK business sites do
// the same for URL segments (readability/typability in a browser bar,
// avoids percent-encoding), even though on-page copy is fully localized.
// Used by src/app/[locale]/[contactSlug]/page.tsx (generateStaticParams +
// the notFound() guard for any locale/slug pair that doesn't match) and by
// every component that links to the contact page (Nav, MobileMenu, Footer).
export const contactSlugs: Record<Locale, string> = {
  it: 'contatti',
  en: 'contact',
  de: 'kontakt',
  fr: 'contact',
  da: 'kontakt',
  pl: 'kontakt',
  cs: 'kontakt',
  no: 'kontakt',
  nl: 'contact',
  zh: 'contact',
  ja: 'contact',
  'en-us': 'contact'
};
