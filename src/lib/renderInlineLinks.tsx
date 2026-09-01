import Link from 'next/link';
import { Fragment } from 'react';

// Recognizes a lightweight `[anchor text](/href)` markdown-link syntax
// inside an otherwise plain-text blog paragraph, and renders it as a real
// <Link> — lets article body copy carry contextual internal links (higher
// SEO/GEO signal than the end-of-article "related links" list alone)
// without turning BlogSection.paragraphs into a rich-text/JSX structure.
const LINK_RE = /\[([^\]]+)\]\((\/[^)]+)\)/g;

export function renderInlineLinks(text: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link key={key++} href={match[2]} className="text-brick underline underline-offset-2 hover:no-underline">
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts.length > 0 ? <Fragment>{parts}</Fragment> : text;
}
