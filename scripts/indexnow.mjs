// Pings the IndexNow API (used by Bing, Yandex, Seznam, Naver...) so new or
// changed pages get picked up much faster than waiting for a normal crawl.
// Google does not use IndexNow (it has its own Search Console/Indexing
// mechanisms), but every other major engine listed here does.
//
// Run manually after a deploy: `npm run indexnow`
// Or wire it into your CI right after `npm run deploy`.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';
const KEY = 'fe5658eb3315e4118eb566649f881415';
const LOCALES = ['it', 'en', 'de', 'fr', 'da', 'pl', 'cs', 'no', 'nl'];

const urlList = LOCALES.map((locale) => `${SITE_URL}/${locale}`);

async function main() {
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
