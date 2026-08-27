import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { landingPages } from '@/content/landingPages';
import {
  landingPageTranslations,
  translatedLandingLocales,
  landingPageUi,
  localizeLandingLink,
  type TranslatedLandingLocale
} from '@/content/landingPageTranslations';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import LandingPageBody from '@/components/LandingPageBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';
const SLUG = 'livigno-estate';

export function generateStaticParams() {
  return translatedLandingLocales.filter((l) => landingPageTranslations[SLUG]?.[l]).map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

function getData(locale: string) {
  if (!translatedLandingLocales.includes(locale as TranslatedLandingLocale)) return null;
  const original = landingPages.find((p) => p.slug === SLUG);
  const translation = landingPageTranslations[SLUG]?.[locale as TranslatedLandingLocale];
  if (!original || !translation) return null;
  return { original, translation, locale: locale as TranslatedLandingLocale };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const data = getData(locale);
  if (!data) return {};
  const { original, translation } = data;

  const url = `${siteUrl}/${SLUG}/${locale}`;
  const languages: Record<string, string> = { it: `${siteUrl}/${SLUG}`, 'x-default': `${siteUrl}/${SLUG}` };
  translatedLandingLocales.forEach((l) => {
    if (landingPageTranslations[SLUG]?.[l]) languages[l] = `${siteUrl}/${SLUG}/${l}`;
  });

  return {
    title: `${translation.metaTitle} | Ironwood Livigno`,
    description: translation.metaDescription,
    alternates: { canonical: url, languages },
    openGraph: {
      title: translation.metaTitle,
      description: translation.metaDescription,
      url,
      siteName: 'Ironwood Livigno',
      images: [{ url: `${siteUrl}${original.image.src}`, width: original.image.w, height: original.image.h, alt: original.image.alt }],
      locale: landingPageUi[data.locale].ogLocale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.metaTitle,
      description: translation.metaDescription,
      images: [`${siteUrl}${original.image.src}`]
    }
  };
}

export default async function TranslatedLandingPage({ params }: { params: Params }) {
  const { locale } = await params;
  const data = getData(locale);
  if (!data) notFound();
  const { original, translation } = data;
  const ui = landingPageUi[data.locale];
  const url = `${siteUrl}/${SLUG}/${data.locale}`;

  const page = {
    ...original,
    title: translation.title,
    eyebrow: translation.eyebrow,
    intro: translation.intro,
    sections: translation.sections,
    highlights: translation.highlights,
    ctaText: translation.ctaText,
    breadcrumbName: translation.breadcrumbName,
    faq: translation.faq,
    internalLinks: original.internalLinks?.map((link, i) => ({
      href: localizeLandingLink(link.href, data.locale),
      label: translation.internalLinkLabels?.[i] ?? link.label
    })),
    relatedLink: {
      href: localizeLandingLink(original.relatedLink.href, data.locale),
      label: translation.relatedLinkLabel
    }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${data.locale}` },
      { '@type': 'ListItem', position: 2, name: translation.breadcrumbName, item: url }
    ]
  };

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: translation.title,
    description: translation.metaDescription,
    url,
    inLanguage: data.locale,
    isPartOf: { '@type': 'WebSite', name: 'Ironwood Livigno', url: siteUrl },
    about: { '@type': 'LodgingBusiness', name: 'Ironwood Livigno', url: `${siteUrl}/${data.locale}` },
    translationOfWork: { '@type': 'WebPage', url: `${siteUrl}/${SLUG}` }
  };

  const faqPageLd = page.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      }
    : null;

  return (
    <html lang={data.locale}>
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
        {faqPageLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }} />
        )}
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <LandingPageBody
            page={page}
            ui={{
              backLabel: ui.backLabel,
              backHref: `/${data.locale}`,
              whyTitle: ui.whyTitle,
              discoverMoreLabel: ui.discoverMoreLabel,
              faqTitle: ui.faqTitle,
              ctaHref: `/${data.locale}#prenota`
            }}
          />
        </main>
        <BlogWhatsAppCta />
        <BlogFooter />
      </body>
    </html>
  );
}
