// Open Graph locale for each site language, and the og:locale:alternate list
// for a page: every other language the same page exists in (the keys of its
// hreflang map, without x-default). Same codes as the homepage layout.
export const OG_LOCALE: Record<string, string> = {
  it: 'it_IT',
  en: 'en_GB',
  'en-us': 'en_US',
  de: 'de_DE',
  fr: 'fr_FR',
  da: 'da_DK',
  pl: 'pl_PL',
  cs: 'cs_CZ',
  no: 'nb_NO',
  nl: 'nl_NL',
  zh: 'zh_CN',
  ja: 'ja_JP'
};

export function ogAlternates(languages: Record<string, string>, current: string): string[] {
  return Object.keys(languages)
    .filter((l) => l !== 'x-default' && l !== current)
    .map((l) => OG_LOCALE[l] ?? l);
}
