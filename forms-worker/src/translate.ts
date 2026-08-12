// Translates the guest's free-text message to Italian using Cloudflare
// Workers AI's m2m100 model (env.AI binding) — same Cloudflare account as
// everything else in this Worker, no third-party translation API/key.
//
// Source language is taken from the site locale the guest was browsing
// (already captured as `data.locale`) rather than running language
// detection — a guest writing on the Polish version of the site is
// overwhelmingly likely to have written in Polish. Good enough for a
// booking-request note; not attempting to be a general-purpose translator.

// Site locale -> full language name m2m100 expects (its parameter docs
// show short codes like 'en'/'es' but the worked example uses full English
// words like "english"/"french" — following the example, since that's
// what's demonstrated as actually working).
const LOCALE_TO_M2M100: Partial<Record<string, string>> = {
  en: 'english',
  'en-us': 'english',
  de: 'german',
  fr: 'french',
  da: 'danish',
  pl: 'polish',
  cs: 'czech',
  no: 'norwegian',
  nl: 'dutch',
  zh: 'chinese',
  ja: 'japanese'
};

// Displayed prominently next to the translation so Francesco always knows
// what language the guest actually wrote in, even though the notification
// shows the Italian translation first.
const LOCALE_DISPLAY_NAME: Partial<Record<string, string>> = {
  en: 'Inglese',
  'en-us': 'Inglese (US)',
  de: 'Tedesco',
  fr: 'Francese',
  da: 'Danese',
  pl: 'Polacco',
  cs: 'Ceco',
  no: 'Norvegese',
  nl: 'Olandese',
  zh: 'Cinese',
  ja: 'Giapponese',
  it: 'Italiano'
};

export function localeDisplayName(locale: string | undefined): string {
  return (locale && LOCALE_DISPLAY_NAME[locale]) || 'lingua sconosciuta';
}

export type Translation = { translatedText: string; sourceLanguageLabel: string } | null;

export async function translateMessageToItalian(ai: Ai, message: string, locale: string | undefined): Promise<Translation> {
  if (!locale || locale === 'it') return null; // already Italian, nothing to do
  const sourceLang = LOCALE_TO_M2M100[locale];
  if (!sourceLang) return null; // unrecognized locale — skip rather than guess

  try {
    const result = (await ai.run('@cf/meta/m2m100-1.2b', {
      text: message,
      source_lang: sourceLang,
      target_lang: 'italian'
    })) as { translated_text?: string };

    if (!result?.translated_text) return null;
    return { translatedText: result.translated_text, sourceLanguageLabel: localeDisplayName(locale) };
  } catch {
    // Translation is a nice-to-have on top of the notification, not a
    // reason to fail the whole submission — the original text is always
    // shown regardless, so nothing is lost if this errors.
    return null;
  }
}
