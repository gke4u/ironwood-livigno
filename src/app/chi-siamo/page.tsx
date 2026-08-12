import type { Metadata } from 'next';
import { landingPages } from '@/content/landingPages';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import LandingPageBody from '@/components/LandingPageBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';
const page = landingPages.find((p) => p.slug === 'chi-siamo')!;
const url = `${siteUrl}/${page.slug}`;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: url, languages: { it: url, 'x-default': url } },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url,
    siteName: 'Ironwood Livigno',
    images: [{ url: `${siteUrl}${page.image.src}`, width: page.image.w, height: page.image.h, alt: page.image.alt }],
    locale: 'it_IT',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: page.metaTitle,
    description: page.metaDescription,
    images: [`${siteUrl}${page.image.src}`]
  }
};

export default function ChiSiamoPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/it` },
      { '@type': 'ListItem', position: 2, name: page.breadcrumbName, item: url }
    ]
  };

  // AboutPage + Person, not another LodgingBusiness/VacationRental block —
  // the property itself is already fully described once, sitewide, by the
  // LodgingBusiness schema in StructuredData.tsx (homepage). Duplicating
  // that here would risk two slightly-diverging copies of the same facts;
  // instead this page's markup describes what's actually unique to it: the
  // host, referencing the existing business listing via `about` rather
  // than re-declaring it.
  const aboutPageLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    description: page.metaDescription,
    url,
    inLanguage: 'it',
    isPartOf: { '@type': 'WebSite', name: 'Ironwood Livigno', url: siteUrl },
    about: { '@type': 'LodgingBusiness', name: 'Ironwood Livigno', url: `${siteUrl}/it` },
    mainEntity: {
      '@type': 'Person',
      name: 'Francesco',
      jobTitle: 'Host e proprietario',
      worksFor: { '@type': 'LodgingBusiness', name: 'Ironwood Livigno', url: `${siteUrl}/it` },
      homeLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: 'Livigno', addressRegion: 'SO', addressCountry: 'IT' }
      }
    }
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }} />
        {faqPageLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }} />
        )}
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <LandingPageBody page={page} />
        </main>
        <BlogWhatsAppCta />
        <BlogFooter />
      </body>
    </html>
  );
}
