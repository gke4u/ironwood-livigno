import type { MetadataRoute } from 'next';
import { locales, contactSlugs } from '@/i18n/routing';

// Required for `output: 'export'`: without this, `next build` fails with
// "export const dynamic = 'force-static' ... not configured on route
// /sitemap.xml" — sitemap.ts compiles to a route handler, and static
// export needs it explicitly marked static rather than inferring it.
export const dynamic = 'force-static';
import { blogPosts } from '@/content/blog';
import { blogTranslations, translatedBlogLocales } from '@/content/blogTranslations';
import { landingPageTranslations, translatedLandingLocales } from '@/content/landingPageTranslations';
import { satelliteSlugs } from '@/data/satellite-pages';

// Generated automatically at build time from the site's own content
// (blogPosts, blogTranslations, routing locales) instead of the old
// hand-maintained public/sitemap.xml, which silently went stale every time
// a page or blog post was added or translated — new content kept being
// left out of the sitemap Google actually reads, slowing down discovery
// of everything published after the sitemap was last hand-edited (see
// Search Console: sitemap last submitted 2026-07-08, missing every post
// and translation added since). Next.js statically generates this file
// into out/sitemap.xml at build time, same as any other route, so it's
// compatible with `output: 'export'` and can never fall out of sync again.
//
// Image *captions* from the old file are not reproduced here — Next's
// typed sitemap `images` field only accepts image URLs, not the
// `<image:caption>` extension. Captions are optional per Google's image
// sitemap spec and not something rankings depend on, so this is an
// acceptable trade for a sitemap that's always accurate.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

// Only the homepage carries the full photo set (matches the previous
// sitemap; duplicating the same 11 images across all 12 locale homepages
// would add ~130 near-duplicate <image:image> entries for no real gain).
const homeImages = [
  '/images/hero-ironwood.jpg',
  '/images/esterno-notte.jpg',
  '/images/soggiorno.jpg',
  '/images/cucina.jpg',
  '/images/sauna-vista-montagna.jpg',
  '/images/bagno-extra.jpg',
  '/images/camera1.jpg',
  '/images/camera2.jpg',
  '/images/camera3.jpg',
  '/images/esterno-giorno.jpg',
  '/images/lago-livigno-panorama.jpg',
  '/images/mountain-bike-estate.jpg'
].map((src) => `${siteUrl}${src}`);

// Satellite/landing pages: single-locale (Italian) pages with their own
// dedicated URL, not part of the /[locale] tree. The list of *which* pages
// exist now comes from satelliteSlugs (src/data/satellite-pages.ts) — the
// same list Footer/Nav/MobileMenu use — so it can't drift out of sync with
// them. Only the sitemap-specific metadata (image, priority, crawl
// frequency) lives here, keyed by slug.
const satellitePageMeta: Record<string, { image: string; priority: number; changeFrequency: 'monthly' | 'yearly' }> = {
  inverno: { image: '/images/livigno-skilift-vallata-nebbia.jpg', priority: 0.8, changeFrequency: 'monthly' },
  estate: { image: '/images/mountain-bike-estate.jpg', priority: 0.8, changeFrequency: 'monthly' },
  famiglie: { image: '/images/appartamento-soggiorno.jpg', priority: 0.8, changeFrequency: 'monthly' },
  benessere: { image: '/images/sauna-vista-montagna.jpg', priority: 0.8, changeFrequency: 'monthly' },
  'come-arrivare': { image: '/images/esterno-giorno.jpg', priority: 0.8, changeFrequency: 'monthly' },
  'chi-siamo': { image: '/images/esterno-giorno.jpg', priority: 0.6, changeFrequency: 'yearly' },
  'sauna-bagno-turco-privato-livigno': { image: '/images/sauna.jpg', priority: 0.8, changeFrequency: 'monthly' },
  'camere-appartamento-livigno': { image: '/images/camera3.jpg', priority: 0.8, changeFrequency: 'monthly' },
  'livigno-estate': { image: '/images/mucca-alpeggio-livigno.jpg', priority: 0.8, changeFrequency: 'monthly' }
};

// A slug present in satelliteSlugs but missing here would otherwise silently
// produce a sitemap entry with an undefined image URL — fail the build
// instead, at the one place that would actually surface the mistake.
satelliteSlugs.forEach((slug) => {
  if (!satellitePageMeta[slug]) throw new Error(`sitemap.ts: no metadata for satellite page "${slug}" — add an entry to satellitePageMeta`);
});

// Priority weights per locale, matching the old sitemap's home-page
// entries (it highest, en/de/en-us next, the rest equal).
const homePriority: Record<string, number> = {
  it: 1.0,
  en: 0.9,
  de: 0.8,
  'en-us': 0.8,
  fr: 0.8
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1. Locale homepages
  const homeLanguages: Record<string, string> = {};
  locales.forEach((l) => {
    homeLanguages[l] = `${siteUrl}/${l}`;
  });
  homeLanguages['x-default'] = `${siteUrl}/it`;

  locales.forEach((locale) => {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: homePriority[locale] ?? 0.7,
      alternates: { languages: homeLanguages },
      ...(locale === 'it' ? { images: homeImages } : {})
    });
  });

  // 2. Contact pages (translated slug per locale)
  const contactLanguages: Record<string, string> = {};
  locales.forEach((l) => {
    contactLanguages[l] = `${siteUrl}/${l}/${contactSlugs[l]}`;
  });
  contactLanguages['x-default'] = `${siteUrl}/it/${contactSlugs.it}`;

  locales.forEach((locale) => {
    entries.push({
      url: `${siteUrl}/${locale}/${contactSlugs[locale]}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: contactLanguages }
    });
  });

  // 3. Blog index
  entries.push({
    url: `${siteUrl}/blog`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  });

  // 4. Blog posts (Italian original + any EN/DE translation pages)
  blogPosts.forEach((post) => {
    const itUrl = `${siteUrl}/blog/${post.slug}`;
    const translations = blogTranslations[post.slug] ?? {};
    const languages: Record<string, string> = { it: itUrl };
    translatedBlogLocales.forEach((l) => {
      if (translations[l]) languages[l] = `${siteUrl}/blog/${post.slug}/${l}`;
    });
    languages['x-default'] = itUrl;

    entries.push({
      url: itUrl,
      lastModified: post.date,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages },
      images: [`${siteUrl}${post.image.src}`]
    });

    translatedBlogLocales.forEach((l) => {
      if (!translations[l]) return;
      entries.push({
        url: `${siteUrl}/blog/${post.slug}/${l}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: { languages },
        images: [`${siteUrl}${post.image.src}`]
      });
    });
  });

  // 5. Satellite / landing pages (Italian original + any translated /slug/<locale> pages)
  satelliteSlugs.forEach((path) => {
    const { image, priority, changeFrequency } = satellitePageMeta[path];
    const itUrl = `${siteUrl}/${path}`;
    const translations = landingPageTranslations[path] ?? {};
    const languages: Record<string, string> = { it: itUrl };
    translatedLandingLocales.forEach((l) => {
      if (translations[l]) languages[l] = `${siteUrl}/${path}/${l}`;
    });
    languages['x-default'] = itUrl;

    entries.push({
      url: itUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
      images: [`${siteUrl}${image}`]
    });

    translatedLandingLocales.forEach((l) => {
      if (!translations[l]) return;
      entries.push({
        url: `${siteUrl}/${path}/${l}`,
        lastModified: now,
        changeFrequency,
        priority: Math.max(priority - 0.1, 0.1),
        alternates: { languages },
        images: [`${siteUrl}${image}`]
      });
    });
  });

  return entries;
}
