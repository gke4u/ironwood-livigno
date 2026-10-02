import { blogPosts } from '@/content/blog';
import { blogTranslations, type TranslatedBlogLocale } from '@/content/blogTranslations';
import { relatedPosts, relatedHeading } from '@/content/blogRelated';

// "Leggi anche": three articles on the same topic, in the article's language
// (see src/content/blogRelated.ts). Plain links with the target article's own
// title as anchor text, so each guide is linked from its topic neighbours.
export default function RelatedPosts({ slug, locale }: { slug: string; locale: 'it' | TranslatedBlogLocale }) {
  const items = (relatedPosts[slug] ?? [])
    .map((s) => {
      const post = blogPosts.find((p) => p.slug === s);
      if (!post) return null;
      if (locale === 'it') return { href: `/blog/${s}`, title: post.title, description: post.description };
      const tr = blogTranslations[s]?.[locale];
      return tr ? { href: `/blog/${s}/${locale}`, title: tr.title, description: tr.description } : null;
    })
    .filter((x): x is { href: string; title: string; description: string } => x !== null);
  if (!items.length) return null;

  return (
    <nav aria-labelledby="related-heading" className="max-w-3xl mt-14">
      <h2 id="related-heading" className="font-display text-2xl text-ink mb-5">
        {relatedHeading[locale]}
      </h2>
      <ul className="grid sm:grid-cols-3 gap-4">
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href} className="block h-full rounded-2xl bg-white p-5 shadow-soft hover:shadow-xl transition-shadow">
              <span className="font-display text-lg text-ink leading-snug block mb-2">{it.title}</span>
              <span className="text-ink/70 text-sm leading-relaxed line-clamp-3">{it.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
