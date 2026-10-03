import { getMessages } from 'next-intl/server';
import FloatingDock from './FloatingDock';

// The contact dock with its WhatsApp link in the page's language (the
// pre-filled message is the request form's own `wa_intro`). Like
// OfferPopupServer, it works on pages outside the [locale] tree too.
export default async function FloatingDockServer({ locale }: { locale: string }) {
  const m = (await getMessages({ locale })) as unknown as {
    request: { wa_intro: string };
    contactPage: { whatsapp_cta: string };
  };
  return (
    <FloatingDock
      whatsappHref={`https://wa.me/390342929285?text=${encodeURIComponent(m.request.wa_intro)}`}
      whatsappShort="WhatsApp"
      whatsappLong={m.contactPage.whatsapp_cta}
    />
  );
}
