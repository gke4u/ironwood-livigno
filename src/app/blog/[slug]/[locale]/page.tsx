import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/content/blog';
import { blogTranslations, translatedBlogLocales, type TranslatedBlogLocale } from '@/content/blogTranslations';
import RelatedPosts from '@/components/RelatedPosts';
import { BlogHeader, BlogFooter, BlogWhatsAppCta, InlineApartmentCta } from '@/components/BlogChrome';
import Pic from '@/components/Pic';
import { renderInlineLinks } from '@/lib/renderInlineLinks';
import { buildTitle } from '@/lib/buildTitle';
import { organizationRef, livignoPlace, countWords } from '@/lib/structuredDataIds';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

// URL shape is /blog/<slug>/<locale> (locale nested AFTER slug), not the
// more conventional /blog/<locale>/<slug> — that's a Next.js constraint,
// not a stylistic choice: app/blog/[slug]/page.tsx (the Italian original)
// already claims the single-segment dynamic route directly under /blog/,
// and Next.js requires every dynamic segment at the same directory level
// to share one parameter name. Nesting [locale] one level inside [slug]
// avoids the name clash entirely, at the cost of a slightly less usual
// URL — both variants are wired into sitemap.xml either way.
//
// Small per-locale UI strings for just the bits of chrome that live inside
// this page template (back link, closing CTA, date/reading-time format).
// BlogHeader/BlogFooter take the article's locale and translate themselves
// (see BlogChrome.tsx); these few strings cover the rest of the template.
const UI: Record<TranslatedBlogLocale, { backLink: string; relatedTitle: string; ctaText: string; ctaButton: string; readingSuffix: string; dateLocale: string; ogLocale: string }> = {
  en: {
    backLink: '← All guides',
    relatedTitle: 'Continue exploring Ironwood Livigno',
    ctaText: 'Ready to plan your stay in Livigno?',
    ctaButton: 'Check availability',
    readingSuffix: 'min read',
    dateLocale: 'en-GB',
    ogLocale: 'en_GB'
  },
  de: {
    backLink: '← Alle Guides',
    relatedTitle: 'Mehr über Ironwood Livigno',
    ctaText: 'Bereit, Ihren Aufenthalt in Livigno zu planen?',
    ctaButton: 'Verfügbarkeit prüfen',
    readingSuffix: 'Min. Lesezeit',
    dateLocale: 'de-DE',
    ogLocale: 'de_DE'
  },
  pl: {
    backLink: '← Wszystkie przewodniki',
    relatedTitle: 'Poznaj Ironwood Livigno',
    ctaText: 'Gotowy, by zaplanować pobyt w Livigno?',
    ctaButton: 'Sprawdź dostępność',
    readingSuffix: 'min czytania',
    dateLocale: 'pl-PL',
    ogLocale: 'pl_PL'
  },
  nl: {
    backLink: '← Alle gidsen',
    relatedTitle: 'Ontdek meer over Ironwood Livigno',
    ctaText: 'Klaar om je verblijf in Livigno te plannen?',
    ctaButton: 'Beschikbaarheid bekijken',
    readingSuffix: 'min leestijd',
    dateLocale: 'nl-NL',
    ogLocale: 'nl_NL'
  },
  cs: {
    backLink: '← Všichni průvodci',
    relatedTitle: 'Objevte Ironwood Livigno',
    ctaText: 'Chcete si naplánovat pobyt v Livignu?',
    ctaButton: 'Ověřit dostupnost',
    readingSuffix: 'min čtení',
    dateLocale: 'cs-CZ',
    ogLocale: 'cs_CZ'
  },
  fr: {
    backLink: '← Tous les guides',
    relatedTitle: 'Découvrez Ironwood Livigno',
    ctaText: 'Prêt à organiser votre séjour à Livigno ?',
    ctaButton: 'Vérifier les disponibilités',
    readingSuffix: 'min de lecture',
    dateLocale: 'fr-FR',
    ogLocale: 'fr_FR'
  },
  da: {
    backLink: '← Alle guides',
    relatedTitle: 'Oplev mere om Ironwood Livigno',
    ctaText: 'Klar til at planlægge dit ophold i Livigno?',
    ctaButton: 'Se ledighed',
    readingSuffix: 'min. læsning',
    dateLocale: 'da-DK',
    ogLocale: 'da_DK'
  },
  no: {
    backLink: '← Alle guider',
    relatedTitle: 'Oppdag mer om Ironwood Livigno',
    ctaText: 'Klar til å planlegge oppholdet i Livigno?',
    ctaButton: 'Sjekk ledighet',
    readingSuffix: 'min lesing',
    dateLocale: 'nb-NO',
    ogLocale: 'nb_NO'
  },
  zh: {
    backLink: '← 全部指南',
    relatedTitle: '进一步了解 Ironwood Livigno',
    ctaText: '准备好规划你的利维尼奥之旅了吗？',
    ctaButton: '查询空房',
    readingSuffix: '分钟阅读',
    dateLocale: 'zh-CN',
    ogLocale: 'zh_CN'
  },
  ja: {
    backLink: '← すべてのガイド',
    relatedTitle: 'Ironwood Livignoをもっと知る',
    ctaText: 'リヴィーニョでの滞在を計画しませんか？',
    ctaButton: '空室を確認する',
    readingSuffix: '分で読めます',
    dateLocale: 'ja-JP',
    ogLocale: 'ja_JP'
  }
};

export function generateStaticParams() {
  const params: { slug: string; locale: string }[] = [];
  for (const slug of Object.keys(blogTranslations)) {
    for (const locale of translatedBlogLocales) {
      if (blogTranslations[slug]?.[locale]) params.push({ slug, locale });
    }
  }
  return params;
}

type Params = Promise<{ slug: string; locale: string }>;

function getData(slug: string, locale: string) {
  if (!translatedBlogLocales.includes(locale as TranslatedBlogLocale)) return null;
  const post = blogPosts.find((p) => p.slug === slug);
  const translation = blogTranslations[slug]?.[locale as TranslatedBlogLocale];
  if (!post || !translation) return null;
  return { post, translation, locale: locale as TranslatedBlogLocale };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, locale } = await params;
  const data = getData(slug, locale);
  if (!data) return {};
  const { post, translation } = data;

  const url = `${siteUrl}/blog/${slug}/${locale}`;
  const languages: Record<string, string> = { it: `${siteUrl}/blog/${slug}`, 'x-default': `${siteUrl}/blog/${slug}` };
  translatedBlogLocales.forEach((l) => {
    if (blogTranslations[slug]?.[l]) languages[l] = `${siteUrl}/blog/${slug}/${l}`;
  });

  return {
    title: buildTitle(translation.title),
    description: translation.description,
    alternates: { canonical: url, languages },
    openGraph: {
      title: translation.title,
      description: translation.description,
      url,
      images: [{ url: `${siteUrl}${post.image.src}`, width: post.image.w, height: post.image.h, alt: post.image.alt }],
      locale: UI[data.locale].ogLocale,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.title,
      description: translation.description,
      images: [`${siteUrl}${post.image.src}`]
    }
  };
}

export default async function TranslatedBlogArticle({ params }: { params: Params }) {
  const { slug, locale } = await params;
  const data = getData(slug, locale);
  if (!data) notFound();
  const { post, translation } = data;
  const ui = UI[data.locale];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translation.title,
    description: translation.description,
    image: { '@type': 'ImageObject', url: `${siteUrl}${post.image.src}`, width: post.image.w, height: post.image.h },
    datePublished: post.date,
    dateModified: translation.updated ?? post.date,
    inLanguage: data.locale,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}/${data.locale}`,
    articleSection: translation.sections.map((s) => s.heading),
    wordCount: countWords(translation.intro, ...translation.sections.flatMap((s) => [s.heading, ...s.paragraphs])),
    contentLocation: livignoPlace,
    isPartOf: { '@id': `${siteUrl}/blog/${data.locale}#blog` },
    author: organizationRef(siteUrl),
    publisher: organizationRef(siteUrl),
    // Points back at the Italian original this translation is derived
    // from — accurate (it is a translation, not an independent piece) and
    // avoids any appearance of duplicate/unattributed content.
    translationOfWork: { '@type': 'BlogPosting', url: `${siteUrl}/blog/${post.slug}` }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${data.locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog/${data.locale}` },
      { '@type': 'ListItem', position: 3, name: translation.title, item: `${siteUrl}/blog/${post.slug}/${data.locale}` }
    ]
  };

  return (
    <html lang={data.locale}>
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <BlogHeader locale={data.locale} />
        <main className="bg-mist min-h-screen">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-20">
            <Link href={`/blog/${data.locale}`} className="text-brick text-sm font-medium hover:underline">
              {ui.backLink}
            </Link>

            <p className="text-ink/65 text-xs mt-6 mb-3">
              {new Date(post.date).toLocaleDateString(ui.dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
              {post.readingTime.replace(/\s*min$/, '')} {ui.readingSuffix}
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-8 leading-tight max-w-3xl">{translation.title}</h1>

            <div className="rounded-3xl overflow-hidden shadow-soft mb-10 max-w-3xl aspect-[16/9]">
              <Pic
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.w}
                height={post.image.h}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="text-ink/75 text-base md:text-lg leading-relaxed">{renderInlineLinks(translation.intro)}</p>
              {translation.sections.map((section, i) => (
                <Fragment key={i}>
                  <div className="pt-3">
                    <h2 className="font-display text-xl md:text-2xl text-ink mb-3">{section.heading}</h2>
                    {section.paragraphs.map((para, j) => (
                      <p key={j} className="text-ink/75 text-base md:text-lg leading-relaxed mb-4 last:mb-0">
                        {renderInlineLinks(para)}
                      </p>
                    ))}
                  </div>
                  {translation.inlineCta && i === Math.floor((translation.sections.length - 1) / 2) && (
                    <InlineApartmentCta {...translation.inlineCta} />
                  )}
                </Fragment>
              ))}
            </div>

            {translation.relatedLinks && translation.relatedLinks.length > 0 && (
              <div className="max-w-3xl mt-14">
                <p className="text-ink/65 text-xs uppercase tracking-widest mb-3">{ui.relatedTitle}</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {translation.relatedLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-brick text-sm font-medium hover:underline underline-offset-2">
                        {link.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <RelatedPosts slug={post.slug} locale={data.locale} />

            <div className="max-w-3xl mt-8 p-8 bg-white rounded-3xl shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-display text-lg text-ink">{ui.ctaText}</p>
              <a
                href={`/${data.locale}#prenota`}
                className="bg-brick text-mist rounded-full px-7 py-3 font-medium hover:bg-brick/90 transition-colors whitespace-nowrap"
              >
                {ui.ctaButton}
              </a>
            </div>
          </div>
        </main>
        <BlogWhatsAppCta locale={data.locale} />
        <BlogFooter locale={data.locale} />
      </body>
    </html>
  );
}
