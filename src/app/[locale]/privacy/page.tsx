import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import { privacyContent } from '@/content/privacy';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const content = privacyContent[locale] || privacyContent.it;
  return {
    title: `${content.title} — Ironwood Livigno`,
    description: content.intro,
    alternates: { canonical: `${siteUrl}/${locale}/privacy` },
    // Thin, largely boilerplate legal text repeated near-identically across
    // 12 locales — indexing it risks diluting the site with duplicate-ish
    // content and competing against the pages that actually convert.
    // `follow: true` still lets crawlers reach it from the footer link and
    // pass through any signals; it's just kept out of search results and
    // out of sitemap.xml (see public/sitemap.xml — the 12 /privacy URLs
    // were removed from it in the same change).
    robots: { index: false, follow: true }
  };
}

export default async function PrivacyPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'footer' });
  const content = privacyContent[locale] || privacyContent.it;

  return (
    <main className="bg-mist min-h-screen">
      <div className="pt-32 pb-8 bg-ink">
        <Nav locale={locale} />
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-20">
        <a href={`/${locale}`} className="text-brick text-sm font-medium hover:underline">
          ← {t('back_home')}
        </a>
        <h1 className="font-display text-3xl md:text-5xl text-ink mt-6 mb-3 leading-tight">{content.title}</h1>
        <p className="text-ink/65 text-sm mb-10">{content.lastUpdated}</p>
        <p className="text-ink/80 text-base md:text-lg leading-relaxed mb-12 max-w-3xl">{content.intro}</p>

        <div className="space-y-10 max-w-3xl">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl md:text-2xl text-ink mb-3">{section.heading}</h2>
              {section.body.split('\n\n').map((para, i) => (
                <p key={i} className="text-ink/70 leading-relaxed whitespace-pre-line mb-3">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer locale={locale} />
    </main>
  );
}
