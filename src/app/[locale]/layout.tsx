import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import LangSuggestBanner from '@/components/LangSuggestBanner';
import BackToTop from '@/components/BackToTop';

// Cloudflare Web Analytics: cookieless, GDPR-friendly page-view tracking.
// Replace this with the token from your Cloudflare dashboard
// (Analytics & Logs → Web Analytics → Add a site) to activate it.
const CF_ANALYTICS_TOKEN = 'REPLACE_WITH_YOUR_CLOUDFLARE_ANALYTICS_TOKEN';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#241C15'
};

type LayoutParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params
}: {
  params: LayoutParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${siteUrl}/${l}`;
  });
  languages['x-default'] = `${siteUrl}/it`;

  // `seo_title`/`seo_description` are dedicated strings for search
  // results — deliberately separate from the on-page H1 (`title`, long and
  // emotional for on-page UX) and kept within Google's practical display
  // budget (title ≤60 chars including the brand prefix, description
  // 140–158 chars) for every one of the 12 locales. See messages/*.json.
  const title = t('seo_title');
  const description = t('seo_description');
  const ogLocaleMap: Record<string, string> = {
    it: 'it_IT',
    en: 'en_GB',
    de: 'de_DE',
    fr: 'fr_FR',
    da: 'da_DK',
    pl: 'pl_PL',
    cs: 'cs_CZ',
    no: 'nb_NO',
    nl: 'nl_NL',
    zh: 'zh_CN',
    ja: 'ja_JP',
    'en-us': 'en_US'
  };

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    manifest: '/manifest.json',
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: 'Ironwood Livigno',
      images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630, alt: title }],
      locale: ogLocaleMap[locale] || 'en_US',
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleMap[l] || l),
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/images/og-image.jpg`]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: LayoutParams;
}) {
  const { locale } = await params;

  // Required for static export: without this, next-intl falls back to
  // reading the locale from request headers, which forces dynamic
  // (server-rendered) pages and breaks `output: 'export'`. This makes the
  // locale available to every Server Component rendered under this layout.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      {/* Resource hint for the Google Maps embed on the homepage: opens the
          connection early so the iframe loads faster once scrolled into
          view, without delaying the page's own critical resources. */}
      <link rel="preconnect" href="https://www.google.com" />
      <body>
        <NextIntlClientProvider messages={messages}>
          <LangSuggestBanner current={locale as Locale} />
          {children}
          <BackToTop />
        </NextIntlClientProvider>
        {CF_ANALYTICS_TOKEN !== 'REPLACE_WITH_YOUR_CLOUDFLARE_ANALYTICS_TOKEN' && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_ANALYTICS_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
