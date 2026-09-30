import { getMessages } from 'next-intl/server';
import OfferPopup, { type OfferStrings } from './OfferPopup';

// Hands the pop-up only its own strings, in the page's language. Works on
// pages outside the [locale] tree too (blog, theme pages), which have no
// next-intl provider for a client component to read from.
export default async function OfferPopupServer({ locale }: { locale: string }) {
  const messages = await getMessages({ locale });
  return <OfferPopup locale={locale} strings={messages.offer as unknown as OfferStrings} />;
}
