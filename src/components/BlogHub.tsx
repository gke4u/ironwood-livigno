// English and German blog index (/blog/en, /blog/de): the translated
// articles used to be reachable only from the small "Also available in"
// line on each Italian post, so no English or German page linked to them.
// Rendered by app/blog/[slug]/page.tsx when the slug is a blog locale (the
// only way to get this URL shape, see the note in [slug]/[locale]/page.tsx).
import type { Metadata } from 'next';
import { blogPosts } from '@/content/blog';
import { blogTranslations, translatedBlogLocales, type TranslatedBlogLocale } from '@/content/blogTranslations';
import { organizationRef, websiteId } from '@/lib/structuredDataIds';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import Pic from '@/components/Pic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

const HUB: Record<
  TranslatedBlogLocale,
  {
    title: string;
    description: string;
    kicker: string;
    h1: string;
    lead: string;
    readingSuffix: string;
    homeLabel: string;
    ogLocale: string;
    topics: { href: string; label: string }[];
    ctaText: string;
    ctaButton: string;
  }
> = {
  en: {
    title: 'Livigno Travel Guide: Skiing, Summer and Practical Tips',
    description:
      'Practical guides to Livigno written by a local host: getting there, skiing and ski pass prices, summer hiking and biking, duty-free shopping and when to book.',
    kicker: 'Livigno travel guide',
    h1: 'Practical tips for your holiday in Livigno',
    lead: 'Guides on getting there, skiing, summer in the mountains and planning your stay — written by people who host travellers in this valley all year round.',
    readingSuffix: 'min read',
    homeLabel: 'Home',
    ogLocale: 'en_GB',
    topics: [
      { href: '/inverno/en', label: 'Winter in Livigno' },
      { href: '/estate/en', label: 'Summer in Livigno' },
      { href: '/famiglie/en', label: 'Families' },
      { href: '/sauna-bagno-turco-privato-livigno/en', label: 'Private sauna' },
      { href: '/come-arrivare/en', label: 'Getting here' }
    ],
    ctaText: 'Ready to plan your stay in Livigno?',
    ctaButton: 'Check availability'
  },
  de: {
    title: 'Livigno Reiseführer: Skifahren, Sommer und praktische Tipps',
    description:
      'Praktische Guides zu Livigno von Gastgebern vor Ort: Anreise, Skifahren und Skipass-Preise, Wandern und Biken im Sommer, zollfreies Einkaufen und beste Reisezeit.',
    kicker: 'Livigno Reiseführer',
    h1: 'Praktische Tipps für Ihren Urlaub in Livigno',
    lead: 'Guides zu Anreise, Skifahren, Sommer in den Bergen und Urlaubsplanung – geschrieben von Gastgebern, die das ganze Jahr über Reisende in diesem Tal empfangen.',
    readingSuffix: 'Min. Lesezeit',
    homeLabel: 'Startseite',
    ogLocale: 'de_DE',
    topics: [
      { href: '/inverno/de', label: 'Winter in Livigno' },
      { href: '/estate/de', label: 'Sommer in Livigno' },
      { href: '/famiglie/de', label: 'Familien' },
      { href: '/sauna-bagno-turco-privato-livigno/de', label: 'Private Sauna' },
      { href: '/come-arrivare/de', label: 'Anreise' }
    ],
    ctaText: 'Bereit, Ihren Aufenthalt in Livigno zu planen?',
    ctaButton: 'Verfügbarkeit prüfen'
  }
};

export function isBlogLocale(slug: string): slug is TranslatedBlogLocale {
  return (translatedBlogLocales as readonly string[]).includes(slug);
}

const hubUrl = (locale: TranslatedBlogLocale) => `${siteUrl}/blog/${locale}`;

function hubPosts(locale: TranslatedBlogLocale) {
  return blogPosts.flatMap((post) => {
    const translation = blogTranslations[post.slug]?.[locale];
    return translation ? [{ post, translation }] : [];
  });
}

export function blogHubMetadata(locale: TranslatedBlogLocale): Metadata {
  const hub = HUB[locale];
  const languages: Record<string, string> = { it: `${siteUrl}/blog`, 'x-default': `${siteUrl}/blog` };
  translatedBlogLocales.forEach((l) => {
    languages[l] = hubUrl(l);
  });
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: hubUrl(locale), languages },
    openGraph: {
      title: hub.title,
      description: hub.description,
      url: hubUrl(locale),
      siteName: 'Ironwood Livigno',
      images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630 }],
      locale: hub.ogLocale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.title,
      description: hub.description,
      images: [`${siteUrl}/images/og-image.jpg`]
    }
  };
}

export function BlogHub({ locale }: { locale: TranslatedBlogLocale }) {
  const hub = HUB[locale];
  const posts = hubPosts(locale);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: hub.homeLabel, item: `${siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: hub.kicker, item: hubUrl(locale) }
    ]
  };

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${hubUrl(locale)}#blog`,
    name: hub.kicker,
    description: hub.description,
    url: hubUrl(locale),
    inLanguage: locale,
    isPartOf: { '@id': websiteId(siteUrl) },
    publisher: organizationRef(siteUrl),
    blogPost: posts.map(({ post, translation }) => ({
      '@type': 'BlogPosting',
      headline: translation.title,
      description: translation.description,
      url: `${siteUrl}/blog/${post.slug}/${locale}`,
      datePublished: post.date,
      dateModified: translation.updated ?? post.date,
      image: `${siteUrl}${post.image.src}`,
      inLanguage: locale
    }))
  };

  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">
            <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{hub.kicker}</p>
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-4 leading-tight">{hub.h1}</h1>
            <p className="text-ink/70 text-base md:text-lg max-w-2xl mb-14">{hub.lead}</p>

            <div className="flex flex-wrap gap-3 mb-14">
              {hub.topics.map((p) => (
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
              {posts.map(({ post, translation }) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}/${locale}`}
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
                    <p className="text-ink/65 text-xs mb-2">
                      {post.readingTime.replace(/\s*min$/, '')} {hub.readingSuffix}
                    </p>
                    <h2 className="font-display text-xl text-ink mb-2 leading-snug">{translation.title}</h2>
                    <p className="text-ink/60 text-sm">{translation.description}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-14 p-8 bg-white rounded-3xl shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-display text-lg text-ink">{hub.ctaText}</p>
              <a
                href={`/${locale}#prenota`}
                className="bg-brick text-mist rounded-full px-7 py-3 font-medium hover:bg-brick/90 transition-colors whitespace-nowrap"
              >
                {hub.ctaButton}
              </a>
            </div>
          </div>
        </main>
        <BlogWhatsAppCta />
        <BlogFooter />
      </body>
    </html>
  );
}
