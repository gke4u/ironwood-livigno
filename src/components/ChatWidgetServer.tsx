import { getMessages } from 'next-intl/server';
import ChatWidget, { type ChatStrings } from './ChatWidget';

// Hands NIGI only its own strings, in the page's language. Like
// OfferPopupServer, it works on pages outside the [locale] tree too (blog,
// theme pages).
export default async function ChatWidgetServer({ locale }: { locale: string }) {
  const m = (await getMessages({ locale })) as unknown as {
    chat: ChatStrings;
    booking_panel: { whatsapp_cta: string };
    request: { wa_intro: string };
  };
  return <ChatWidget strings={m.chat} whatsappLabel={m.booking_panel.whatsapp_cta} whatsappText={m.request.wa_intro} />;
}
