import type { MetadataRoute } from 'next';
import { locales, contactSlugs } from '@/i18n/routing';

// Required for `output: 'export'`: without this, `next build` fails with
// "export const dynamic = 'force-static' ... not configured on route
// /sitemap.xml" — sitemap.ts compiles to a route handler, and static
// export needs it explicitly marked static rather than inferring it.
export const dynamic = 'force-static';
import { blogPosts } from '@/content/blog';
import { blogTranslations, translatedBlogLocales } from '@/content/blogTranslations';

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
// dedicated URL, not part of the /[locale] tree. Config lives here rather
// than being derived from a data file because there's no shared content
// module for them (each is its own page.tsx under src/app/).
const satellitePages: { path: string; image: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: 'inverno', image: '/images/livigno-skilift-vallata-nebbia.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'estate', image: '/images/mountain-bike-estate.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'famiglie', image: '/images/appartamento-soggiorno.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'benessere', image: '/images/sauna-vista-montagna.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'come-arrivare', image: '/images/esterno-giorno.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'chi-siamo', image: '/images/esterno-giorno.jpg', priority: 0.6, changeFrequency: 'yearly' },
  { path: 'sauna-bagno-turco-privato-livigno', image: '/images/sauna.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'camere-appartamento-livigno', image: '/images/camera3.jpg', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'livigno-estate', image: '/images/mucca-alpeggio-livigno.jpg', priority: 0.8, changeFrequency: 'monthly' }
];

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

  // 5. Satellite / landing pages (Italian-only, own top-level URL)
  satellitePages.forEach(({ path, image, priority, changeFrequency }) => {
    const url = `${siteUrl}/${path}`;
    entries.push({
      url,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages: { it: url, 'x-default': url } },
      images: [`${siteUrl}${image}`]
    });
  });

  return entries;
}
