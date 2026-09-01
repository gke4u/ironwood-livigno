import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/content/blog';
import { blogTranslations, translatedBlogLocales } from '@/content/blogTranslations';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import Pic from '@/components/Pic';
import { renderInlineLinks } from '@/lib/renderInlineLinks';
import { buildTitle } from '@/lib/buildTitle';

const LANG_LABEL: Record<string, string> = { en: 'English', de: 'Deutsch' };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${post.slug}`;
  const languages: Record<string, string> = { it: url, 'x-default': url };
  translatedBlogLocales.forEach((l) => {
    if (blogTranslations[post.slug]?.[l]) languages[l] = `${siteUrl}/blog/${post.slug}/${l}`;
  });

  return {
    title: buildTitle(post.title),
    description: post.description,
    alternates: { canonical: url, languages },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      images: [{ url: `${siteUrl}${post.image.src}`, width: post.image.w, height: post.image.h, alt: post.image.alt }],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`${siteUrl}${post.image.src}`]
    }
  };
}

export default async function BlogArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const availableTranslations = translatedBlogLocales.filter((l) => blogTranslations[post.slug]?.[l]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.image.src}`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'it',
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    articleSection: post.sections.map((s) => s.heading),
    author: { '@type': 'Organization', name: 'Ironwood Livigno' },
    publisher: {
      '@type': 'Organization',
      name: 'Ironwood Livigno',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/apple-touch-icon.png` }
    }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/it` },
      { '@type': 'ListItem', position: 2, name: 'Guida a Livigno', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` }
    ]
  };

  // HowTo schema: only "come arrivare a Livigno" is genuinely a step-by-step
  // guide (train / car / plane) — HowTo shouldn't be forced onto posts that
  // aren't actually instructional, so this stays scoped to that one slug
  // rather than becoming a generic field on every BlogPost.
  const howToLd =
    post.slug === 'come-arrivare-a-livigno'
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Come arrivare a Livigno',
          description: post.description,
          step: post.sections
            .filter((s) => ['In treno', 'In auto', 'In aereo'].includes(s.heading))
            .map((s) => ({
              '@type': 'HowToStep',
              name: s.heading,
              text: s.paragraphs.join(' ')
            }))
        }
      : null;

  return (
    <html lang="it">
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {howToLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
        )}
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-20">
            <Link href="/blog" className="text-brick text-sm font-medium hover:underline">
              ← Tutte le guide
            </Link>

            <p className="text-ink/65 text-xs mt-6 mb-3">
              {new Date(post.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
              {post.readingTime} di lettura
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-4 leading-tight max-w-3xl">{post.title}</h1>

            {availableTranslations.length > 0 && (
              <p className="text-ink/65 text-sm mb-8">
                Also available in:{' '}
                {availableTranslations.map((l, i) => (
                  <span key={l}>
                    {i > 0 && ' · '}
                    <a href={`/blog/${post.slug}/${l}`} className="underline underline-offset-2 hover:text-brick">
                      {LANG_LABEL[l]}
                    </a>
                  </span>
                ))}
              </p>
            )}

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
              <p className="text-ink/75 text-base md:text-lg leading-relaxed">{renderInlineLinks(post.intro)}</p>
              {post.sections.map((section, i) => (
                <div key={i} className="pt-3">
                  <h2 className="font-display text-xl md:text-2xl text-ink mb-3">{section.heading}</h2>
                  {section.paragraphs.map((para, j) => (
                    <p key={j} className="text-ink/75 text-base md:text-lg leading-relaxed mb-4 last:mb-0">
                      {renderInlineLinks(para)}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {post.relatedLinks && post.relatedLinks.length > 0 && (
              <div className="max-w-3xl mt-14">
                <p className="text-ink/50 text-xs uppercase tracking-widest mb-3">Continua a scoprire Ironwood Livigno</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {post.relatedLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-brick text-sm font-medium hover:underline underline-offset-2">
                        {link.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="max-w-3xl mt-8 p-8 bg-white rounded-3xl shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-display text-lg text-ink">Pronto a organizzare il tuo soggiorno a Livigno?</p>
              <Link
                href="/it#prenota"
                className="bg-brick text-mist rounded-full px-7 py-3 font-medium hover:bg-brick/90 transition-colors whitespace-nowrap"
              >
                Verifica disponibilità
              </Link>
            </div>
          </div>
        </main>
        <BlogWhatsAppCta />
        <BlogFooter />
      </body>
    </html>
  );
}
