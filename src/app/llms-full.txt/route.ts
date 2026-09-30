// /llms-full.txt: the full text of every guide on the site (Italian
// originals plus English and German translations) as one plain Markdown
// file, the companion to the hand-written summary in public/llms.txt.
// AI answer engines and assistants can read the whole guide in a single
// request instead of crawling ~70 HTML pages. Generated at build time from
// the same content files the pages render, so it can never drift from them.
import { blogPosts, postModified } from '@/content/blog';
import { blogTranslations, translatedBlogLocales } from '@/content/blogTranslations';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

// "[label](/path)" inline links become absolute so they still work out of context.
const absolute = (text: string) => text.replace(/\]\((\/[^)]*)\)/g, `](${siteUrl}$1)`);

function article(
  url: string,
  lang: string,
  modified: string,
  title: string,
  description: string,
  intro: string,
  sections: { heading: string; paragraphs: string[] }[]
) {
  return [
    `## ${title}`,
    '',
    `URL: ${url}`,
    `Language: ${lang} · Last updated: ${modified}`,
    '',
    `> ${description}`,
    '',
    absolute(intro),
    '',
    ...sections.flatMap((s) => [`### ${s.heading}`, '', ...s.paragraphs.map((p) => absolute(p) + '\n')])
  ].join('\n');
}

export function GET() {
  const parts: string[] = [
    '# Ironwood Livigno — full guide text',
    '',
    '> Holiday apartment in Livigno (Italy): 90 m², 3 bedrooms, 2 bathrooms, up to 6 guests, private infrared sauna and steam bath, 100 m from the ski lifts, Via Saroch 771, 23041 Livigno (SO). Summary, FAQ and contacts: ' +
      `${siteUrl}/llms.txt`,
    '',
    'This file contains the complete text of every guide published on ironwoodlivigno.com, in Italian and, where available, English and German.',
    ''
  ];

  for (const locale of ['it', ...translatedBlogLocales] as const) {
    parts.push(`# ${locale === 'it' ? 'Guida a Livigno (italiano)' : locale === 'en' ? 'Livigno guide (English)' : 'Livigno-Reiseführer (Deutsch)'}`, '');
    for (const post of blogPosts) {
      if (locale === 'it') {
        parts.push(article(`${siteUrl}/blog/${post.slug}`, 'it', postModified(post), post.title, post.description, post.intro, post.sections));
        continue;
      }
      const t = blogTranslations[post.slug]?.[locale];
      if (!t) continue;
      parts.push(article(`${siteUrl}/blog/${post.slug}/${locale}`, locale, t.updated ?? post.date, t.title, t.description, t.intro, t.sections));
    }
  }

  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
