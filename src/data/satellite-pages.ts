import type { Locale } from '@/i18n/routing';
import { landingPageTranslations, type TranslatedLandingLocale } from '@/content/landingPageTranslations';

// The 9 SEO landing/satellite pages living outside the [locale] tree (see
// README). The Italian original of each is always at /<slug>; translated
// variants, where they exist, live at /<slug>/<locale> (src/content/
// landingPageTranslations.ts). Shared between Footer.tsx, Nav.tsx and
// MobileMenu.tsx so this list stays in one place instead of three.
const IT_PAGES = [
  { href: '/inverno', label: 'Inverno' },
  { href: '/estate', label: 'Estate' },
  { href: '/famiglie', label: 'Famiglie' },
  { href: '/benessere', label: 'Benessere' },
  { href: '/come-arrivare', label: 'Come arrivare' },
  { href: '/chi-siamo', label: 'Chi siamo' },
  { href: '/sauna-bagno-turco-privato-livigno', label: 'Sauna privata' },
  { href: '/camere-appartamento-livigno', label: 'Le camere' },
  { href: '/livigno-estate', label: "Livigno d'estate" }
];

export function getSatellitePages(locale: Locale): { href: string; label: string }[] {
  if (locale === 'it') return IT_PAGES;

  return IT_PAGES.map(({ href, label }) => {
    const slug = href.slice(1);
    const translation = landingPageTranslations[slug]?.[locale as TranslatedLandingLocale];
    return translation ? { href: `${href}/${locale}`, label: translation.navLabel } : { href, label };
  });
}
