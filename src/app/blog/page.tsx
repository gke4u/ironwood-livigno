import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, postModified } from '@/content/blog';
import { translatedBlogLocales } from '@/content/blogTranslations';
import { organizationRef, websiteId } from '@/lib/structuredDataIds';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import Pic from '@/components/Pic';
import { OG_LOCALE } from '@/lib/ogLocale';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

// Links to the translated blog indexes, each labelled in its own language.
const HUB_LINKS = [
  { locale: 'en', label: 'Guides in English' },
  { locale: 'de', label: 'Reiseführer auf Deutsch' },
  { locale: 'pl', label: 'Przewodniki po polsku' },
  { locale: 'nl', label: 'Gidsen in het Nederlands' },
  { locale: 'cs', label: 'Průvodci v češtině' },
  { locale: 'fr', label: 'Guides en français' },
  { locale: 'da', label: 'Guides på dansk' },
  { locale: 'no', label: 'Guider på norsk' },
  { locale: 'zh', label: '中文指南' },
  { locale: 'ja', label: '日本語ガイド' }
];

export const metadata: Metadata = {
  title: 'Guida a Livigno — Blog | Ironwood Livigno',
  description: "Guide pratiche su Livigno: come arrivare, sci, mountain bike, trekking e come organizzare al meglio la tua vacanza.",
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: {
      it: `${siteUrl}/blog`,
      ...Object.fromEntries(translatedBlogLocales.map((l) => [l, `${siteUrl}/blog/${l}`])),
      'x-default': `${siteUrl}/blog`
    }
  },
  openGraph: {
    title: 'Guida a Livigno — Blog | Ironwood Livigno',
    description: 'Guide pratiche su Livigno: come arrivare, sci, mountain bike, trekking e come organizzare al meglio la tua vacanza.',
    url: `${siteUrl}/blog`,
    siteName: 'Ironwood Livigno',
    images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630 }],
    locale: 'it_IT',
    alternateLocale: translatedBlogLocales.map((l) => OG_LOCALE[l]),
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guida a Livigno — Blog | Ironwood Livigno',
    description: 'Guide pratiche su Livigno: come arrivare, sci, mountain bike, trekking e come organizzare al meglio la tua vacanza.',
    images: [`${siteUrl}/images/og-image.jpg`]
  }
};

export default function BlogIndex() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/it` },
      { '@type': 'ListItem', position: 2, name: 'Guida a Livigno', item: `${siteUrl}/blog` }
    ]
  };

  // Tells search engines and AI assistants this page is the index of a
  // blog and which articles belong to it (each linked to its own page).
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/blog#blog`,
    name: 'Guida a Livigno',
    description: metadata.description,
    url: `${siteUrl}/blog`,
    inLanguage: 'it',
    isPartOf: { '@id': websiteId(siteUrl) },
    publisher: organizationRef(siteUrl),
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: postModified(post),
      image: `${siteUrl}${post.image.src}`
    }))
  };

  return (
    <html lang="it">
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">
            <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Guida a Livigno</p>
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-4 leading-tight">
              Consigli pratici per la tua vacanza a Livigno
            </h1>
            <p className="text-ink/70 text-base md:text-lg max-w-2xl mb-4">
              Guide su come arrivare, sciare e vivere Livigno d&apos;estate — scritte da chi ospita viaggiatori in questa
              valle tutto l&apos;anno.
            </p>
            <p className="text-ink/65 text-sm mb-14">
              {HUB_LINKS.map((h, i) => (
                <span key={h.locale}>
                  {i > 0 && ' · '}
                  <Link
                    href={`/blog/${h.locale}`}
                    hrefLang={h.locale}
                    lang={h.locale}
                    className="underline underline-offset-2 hover:text-brick"
                  >
                    {h.label}
                  </Link>
                </span>
              ))}
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              {[
                { href: '/inverno', label: 'Inverno a Livigno' },
                { href: '/estate', label: 'Estate a Livigno' },
                { href: '/famiglie', label: 'Famiglie' },
                { href: '/sauna-bagno-turco-privato-livigno', label: 'Sauna privata' },
                { href: '/come-arrivare', label: 'Come arrivare' }
              ].map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="border border-ink/15 text-ink rounded-full px-5 py-2.5 text-sm font-medium hover:bg-ink/5 transition-colors"
                >
                  {p.label}
                </a>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-3xl overflow-hidden shadow-soft bg-white flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Pic
                      src={post.image.src}
                      alt={post.image.alt}
                      width={post.image.w}
                      height={post.image.h}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-ink/65 text-xs mb-2">{post.readingTime} di lettura</p>
                    <h2 className="font-display text-xl text-ink mb-2 leading-snug">{post.title}</h2>
                    <p className="text-ink/70 text-sm">{post.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
        <BlogWhatsAppCta />
        <BlogFooter />
      </body>
    </html>
  );
}
