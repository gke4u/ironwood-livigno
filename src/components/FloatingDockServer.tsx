import { getMessages } from 'next-intl/server';
import FloatingDock, { type DockStrings } from './FloatingDock';

// The contact corner with its texts in the page's language. Like
// OfferPopupServer, it works on pages outside the [locale] tree too.
export default async function FloatingDockServer({ locale }: { locale: string }) {
  const m = (await getMessages({ locale })) as unknown as {
    dock: DockStrings;
    request: { wa_intro: string };
    chat: { cta: string; status: string };
  };
  return <FloatingDock strings={m.dock} label={m.chat.cta} sub={m.chat.status} locale={locale} whatsappText={m.request.wa_intro} />;
}
