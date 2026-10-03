import type { Metadata } from 'next';
import { orgId, websiteId } from '@/lib/structuredDataIds';
import { landingPages } from '@/content/landingPages';
import { landingLanguages } from '@/content/landingPageTranslations';
import { buildTitle } from '@/lib/buildTitle';
import { BlogHeader, BlogFooter } from '@/components/BlogChrome';
import LandingPageBody from '@/components/LandingPageBody';
import PropertyFacts from '@/components/PropertyFacts';
import { OG_LOCALE, ogAlternates } from '@/lib/ogLocale';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';
const page = landingPages.find((p) => p.slug === 'famiglie')!;
const url = `${siteUrl}/${page.slug}`;

export const metadata: Metadata = {
  title: buildTitle(page.metaTitle),
  description: page.metaDescription,
  alternates: { canonical: url, languages: landingLanguages(page.slug, siteUrl) },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url,
    siteName: 'Ironwood Livigno',
    images: [{ url: `${siteUrl}${page.image.src}`, width: page.image.w, height: page.image.h, alt: page.image.alt }],
    locale: 'it_IT',
    alternateLocale: ogAlternates(landingLanguages(page.slug, siteUrl), 'it'),
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: page.metaTitle,
    description: page.metaDescription,
    images: [`${siteUrl}${page.image.src}`]
  }
};

export default function FamigliePage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/it` },
      { '@type': 'ListItem', position: 2, name: page.breadcrumbName, item: url }
    ]
  };

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.metaDescription,
    url,
    inLanguage: 'it',
    isPartOf: { '@type': 'WebSite', '@id': websiteId(siteUrl), name: 'Ironwood Livigno', url: siteUrl },
    about: { '@type': 'LodgingBusiness', '@id': orgId(siteUrl), name: 'Ironwood Livigno', url: `${siteUrl}/it` }
  };

  const faqPageLd = page.faq
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
    <html lang="it">
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
        {faqPageLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }} />
        )}
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <LandingPageBody page={page} facts={<PropertyFacts locale="it" />} />
        </main>
        <BlogFooter />
      </body>
    </html>
  );
}
