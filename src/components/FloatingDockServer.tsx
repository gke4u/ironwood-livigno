import { getMessages } from 'next-intl/server';
import FloatingDock, { type DockStrings } from './FloatingDock';

// The contact corner with its texts in the page's language. Like
// OfferPopupServer, it works on pages outside the [locale] tree too.
export default async function FloatingDockServer({ locale }: { locale: string }) {
  const m = (await getMessages({ locale })) as unknown as {
    dock: DockStrings;
    chat: { suggestions: string[] };
  };
  return <FloatingDock strings={m.dock} bookHref={`/${locale}#prenota`} firstQuestion={m.chat.suggestions[0]} />;
}
