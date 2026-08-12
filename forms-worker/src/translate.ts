// Translates the guest's free-text message to Italian using Cloudflare
// Workers AI (env.AI binding) — same Cloudflare account as everything else
// in this Worker, no third-party translation API/key.
//
// Uses a general chat model (llama-3.1-8b-instruct) with a translation
// prompt rather than the dedicated m2m100 translation model: m2m100 is a
// small, lightly-provisioned model that returned "Capacity temporarily
// exceeded" on every attempt when this was first tested (verified
// directly against the API, not a fluke — three retries, same error).
// Llama is Cloudflare's most heavily provisioned model and translates
// perfectly well with a direct instruction, so it's simply more reliably
// available for something a real guest is waiting on an answer to.
//
// Source language is taken from the site locale the guest was browsing
// (already captured as `data.locale`) rather than running language
// detection — a guest writing on the Polish version of the site is
// overwhelmingly likely to have written in Polish. Good enough for a
// booking-request note; not attempting to be a general-purpose translator.

// Site locale -> English language name, used only in the translation
// prompt (models follow English instructions most reliably).
const LOCALE_TO_LANGUAGE_NAME: Partial<Record<string, string>> = {
  en: 'English',
  'en-us': 'English',
  de: 'German',
  fr: 'French',
  da: 'Danish',
  pl: 'Polish',
  cs: 'Czech',
  no: 'Norwegian',
  nl: 'Dutch',
  zh: 'Chinese',
  ja: 'Japanese'
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
  const languageName = LOCALE_TO_LANGUAGE_NAME[locale];
  if (!languageName) return null; // unrecognized locale — skip rather than guess

  try {
    const result = (await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the user's message from ${languageName} to Italian. Reply with ONLY the translation — no commentary, no quotes, no explanations.`
        },
        { role: 'user', content: message }
      ]
    })) as { response?: string };

    const translatedText = result?.response?.trim();
    if (!translatedText) return null;
    return { translatedText, sourceLanguageLabel: localeDisplayName(locale) };
  } catch {
    // Translation is a nice-to-have on top of the notification, not a
    // reason to fail the whole submission — the original text is always
    // shown regardless, so nothing is lost if this errors.
    return null;
  }
}
