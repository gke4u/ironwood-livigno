import { getMessages } from 'next-intl/server';
import FloatingDock, { type DockStrings } from './FloatingDock';

// The contact dock with its texts and WhatsApp link in the page's language
// (the pre-filled message is the request form's own `wa_intro`). Like
// OfferPopupServer, it works on pages outside the [locale] tree too.
export default async function FloatingDockServer({ locale }: { locale: string }) {
  const m = (await getMessages({ locale })) as unknown as {
    request: { wa_intro: string };
    dock: DockStrings;
  };
  return (
    <FloatingDock
      strings={m.dock}
      whatsappHref={`https://wa.me/390342929285?text=${encodeURIComponent(m.request.wa_intro)}`}
      bookHref={`/${locale}#prenota`}
    />
  );
}
