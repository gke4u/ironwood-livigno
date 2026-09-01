// Every page title concatenated " | Ironwood Livigno" unconditionally,
// regardless of how long the base title already was — Google truncates
// title tags past roughly 60 characters, and an audit of the built site
// found 130 pages (blog posts and satellite landing pages, across all
// locales) over that limit, several past 90 characters. The suffix is
// only worth the space when it still fits the budget; past that point a
// truncated brand suffix wastes the characters a real keyword could use,
// and Google usually appends the site name in the SERP display anyway.
const SUFFIX = ' | Ironwood Livigno';
const MAX_TITLE_LENGTH = 60;

export function buildTitle(base: string): string {
  return base.length + SUFFIX.length <= MAX_TITLE_LENGTH ? `${base}${SUFFIX}` : base;
}
