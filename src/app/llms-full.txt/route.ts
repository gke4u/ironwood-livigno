// /llms-full.txt: the full text of every guide on the site (Italian
// originals plus every translation of them) as one plain Markdown
// file, the companion to the hand-written summary in public/llms.txt.
// AI answer engines and assistants can read the whole guide in a single
// request instead of crawling every article page. Generated at build time from
// the same content files the pages render, so it can never drift from them.
import { blogPosts, postModified } from '@/content/blog';
import { blogTranslations, translatedBlogLocales } from '@/content/blogTranslations';

export const dynamic = 'force-static';

const SECTION_TITLE: Record<'it' | (typeof translatedBlogLocales)[number], string> = {
  it: 'Guida a Livigno (italiano)',
  en: 'Livigno guide (English)',
  de: 'Livigno-Reiseführer (Deutsch)',
  pl: 'Przewodnik po Livigno (polski)',
  nl: 'Reisgids Livigno (Nederlands)',
  cs: 'Průvodce Livignem (čeština)',
  fr: 'Guide de Livigno (français)',
  da: 'Rejseguide til Livigno (dansk)',
  no: 'Reiseguide til Livigno (norsk)',
  zh: '利维尼奥旅游指南（中文）',
  ja: 'リヴィーニョ旅行ガイド（日本語）'
};

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
    'This file contains the complete text of every guide published on ironwoodlivigno.com, in Italian, English, German, French, Polish, Dutch, Czech, Danish, Norwegian, Chinese and Japanese.',
    ''
  ];

  for (const locale of ['it', ...translatedBlogLocales] as const) {
    parts.push(`# ${SECTION_TITLE[locale]}`, '');
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
