import { getMessages } from 'next-intl/server';
import ChatWidget, { type ChatStrings } from './ChatWidget';

// Hands NIGI only what it needs, in the page's language: its own strings and
// the site's FAQ (the chat's free, instant answers). Like OfferPopupServer,
// it works on pages outside the [locale] tree too (blog, theme pages).
export default async function ChatWidgetServer({ locale }: { locale: string }) {
  const m = (await getMessages({ locale })) as unknown as {
    chat: ChatStrings;
    faq: Record<string, string>;
    booking_panel: { whatsapp_cta: string };
    request: { wa_intro: string };
  };
  const faq: { q: string; a: string }[] = [];
  for (let i = 1; m.faq[`q${i}_q`]; i++) faq.push({ q: m.faq[`q${i}_q`], a: m.faq[`q${i}_a`] });
  return <ChatWidget strings={m.chat} faq={faq} whatsappLabel={m.booking_panel.whatsapp_cta} whatsappText={m.request.wa_intro} />;
}
