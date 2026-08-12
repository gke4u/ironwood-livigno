// Generates a reply draft for the site owner to review, edit, and send —
// opened on demand from a link in the notification email (GET
// /draft/:token), using the same Cloudflare Workers AI binding as
// translate.ts (free tier included in the account, no paid third-party AI
// service). Nothing is ever sent automatically: the owner always reads,
// edits if needed, and sends it himself.
//
// The draft is written directly in the guest's own site language
// (data.locale) so it can be sent as-is, with an Italian rendering
// underneath — reusing translateMessageToItalian — so the owner can verify
// what it actually says before sending, the same "original above, Italian
// translation below" pattern used for the guest's note itself.
//
// The model is deliberately instructed not to confirm availability or
// quote a price: it has no access to either, and a warm acknowledgment
// that promises a follow-up is honest, where a confident-sounding
// fabricated confirmation would not be.
import type { Submission } from './index';
import { LOCALE_TO_LANGUAGE_NAME, localeDisplayName, translateMessageToItalian } from './translate';

export type Draft = {
  replyText: string;
  replyLanguageLabel: string;
  italianText: string | null;
};

function buildContext(data: Submission, nights: number | null): string {
  const extras = [data.extra_breakfast ? 'breakfast' : null, data.extra_ebike ? 'e-bike rental' : null].filter(Boolean).join(', ');
  return [
    `Guest name: ${data.name}`,
    `Check-in: ${data.checkin}`,
    `Check-out: ${data.checkout}${nights !== null ? ` (${nights} night${nights === 1 ? '' : 's'})` : ''}`,
    `Guests: ${data.guests}`,
    extras ? `Extras requested: ${extras}` : null,
    data.message ? `Guest's message: "${data.message}"` : `Guest left no additional message beyond the booking dates.`
  ]
    .filter(Boolean)
    .join('\n');
}

export async function draftReply(ai: Ai, data: Submission, nights: number | null): Promise<Draft | null> {
  const locale = data.locale && data.locale !== 'it' ? data.locale : 'it';
  const languageName = locale === 'it' ? 'Italian' : LOCALE_TO_LANGUAGE_NAME[locale];
  if (!languageName) return null; // unrecognized locale — skip rather than guess

  const context = buildContext(data, nights);
  const prompt = [
    'You are replying, on behalf of the host, to a booking inquiry for "Ironwood Livigno", a mountain apartment rental in Livigno, Italy.',
    `Write a warm, professional, concise reply (3-6 sentences) in ${languageName}, addressed to the guest by name.`,
    "Thank them for their interest, briefly acknowledge their stay dates, and answer any specific question from their message if there is one — using only general, safe information.",
    'Do NOT invent or confirm availability, prices, or a booking — you do not have that information. Say the host will follow up shortly with availability and pricing.',
    'Sign off as "Ironwood Livigno".',
    'Reply with ONLY the message text — no subject line, no commentary, no quotes around it.'
  ].join(' ');

  try {
    const result = (await ai.run('@cf/zai-org/glm-4.7-flash', {
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: context }
      ]
    })) as { choices?: { message?: { content?: string } }[] };

    const replyText = result?.choices?.[0]?.message?.content?.trim();
    if (!replyText) return null;

    const italianText = locale === 'it' ? null : ((await translateMessageToItalian(ai, replyText, locale))?.translatedText ?? null);

    return { replyText, replyLanguageLabel: localeDisplayName(locale), italianText };
  } catch (err) {
    console.error('draft reply call threw', err);
    // Not a reason to break anything upstream — the caller shows a plain
    // "try again" message on the draft page, same principle as translation.
    return null;
  }
}
