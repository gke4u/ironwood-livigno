// Pings the IndexNow API (used by Bing, Yandex, Seznam, Naver...) so new or
// changed pages get picked up much faster than waiting for a normal crawl.
// Google does not use IndexNow (it has its own Search Console/Indexing
// mechanisms), but every other major engine listed here does — and Bing's
// index is also what ChatGPT search and Copilot answer from.
//
// Run manually after a deploy: `npm run indexnow`
// Or wire it into your CI right after `npm run deploy`.
//
// URLs come from the built sitemap (out/sitemap.xml), so blog posts and
// landing pages are included, not just the locale homepages. By default
// only pages whose <lastmod> is recent are sent (IndexNow is meant for
// changed URLs); `npm run indexnow -- --all` sends every URL in the sitemap.

import { readFileSync } from 'node:fs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';
const KEY = 'fe5658eb3315e4118eb566649f881415';
const LOCALES = ['it', 'en', 'en-us', 'de', 'fr', 'da', 'pl', 'cs', 'no', 'nl', 'zh', 'ja'];
const RECENT_DAYS = 14;

function sitemapUrls() {
  const xml = readFileSync(new URL('../out/sitemap.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
    lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]
  }));
}

function buildUrlList() {
  const sendAll = process.argv.includes('--all');
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const urls = new Set(LOCALES.map((locale) => `${SITE_URL}/${locale}`));
  try {
    for (const { loc, lastmod } of sitemapUrls()) {
      if (!loc) continue;
      if (sendAll || !lastmod || Date.parse(lastmod) >= cutoff) urls.add(loc);
    }
  } catch (err) {
    // No build output (e.g. run before `npm run build`): the locale
    // homepages alone are still worth sending.
    console.warn(`IndexNow: sitemap not readable (${err.message}), sending homepages only`);
  }
  return [...urls];
}

async function main() {
  const urlList = buildUrlList();
  const body = {
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  });

  console.log(`IndexNow: submitted ${urlList.length} URLs — status ${res.status}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(text);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
