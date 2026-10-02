// SEO / GEO audit engine for ironwoodlivigno.com.
//
//   node scripts/seo/audit.mjs                 audit the build in out/ (before a deploy)
//   node scripts/seo/audit.mjs --live          audit the live site
//   node scripts/seo/audit.mjs --report=DIR    also write the CSV/JSON tables to DIR
//
// Every URL comes from the sitemap. For each page it records status,
// indexability, canonical, hreflang, metadata, headings, landmarks, JSON-LD,
// Open Graph, links and images; then it checks the whole set (reciprocal
// hreflang, unique titles, broken links, click depth, orphans, near-duplicate
// text, property facts against seo-engineering/09_PROPERTY_FACTS.json).
// Exit code 1 when a P0 or P1 problem is found, so `npm run deploy` stops.

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { checkFacts, checkTextFile } from './facts.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const LIVE = Boolean(args.live);
const SITE = 'https://ironwoodlivigno.com';
const OUT = path.resolve('out');
const REPORT = typeof args.report === 'string' ? path.resolve(args.report) : null;

// ---------- fetching ----------

function fileFor(url) {
  const u = new URL(url);
  let p = decodeURIComponent(u.pathname).replace(/\/$/, '');
  if (p === '') p = '/index';
  const candidates = [path.join(OUT, p + '.html'), path.join(OUT, p, 'index.html'), path.join(OUT, p)];
  return candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile()) ?? null;
}

async function get(url) {
  if (!LIVE) {
    const f = fileFor(url);
    if (!f) return { status: 404, html: '', headers: {} };
    return { status: 200, html: f.endsWith('.html') || f.endsWith('.xml') || f.endsWith('.txt') ? fs.readFileSync(f, 'utf8') : '', headers: {}, bytes: fs.statSync(f).size };
  }
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'IronwoodSEOAudit/1.0' } });
      const body = r.status === 200 && /text|xml|json/.test(r.headers.get('content-type') ?? '') ? await r.text() : '';
      return { status: r.status, html: body, headers: Object.fromEntries(r.headers), location: r.headers.get('location') };
    } catch {
      await new Promise((res) => setTimeout(res, 400));
    }
  }
  return { status: 0, html: '', headers: {} };
}

async function pool(items, n, fn) {
  const q = [...items];
  const results = [];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) { const it = q.shift(); results.push(await fn(it)); } }));
  return results;
}

// ---------- page analysis ----------

const norm = (u) => u.split('#')[0].split('?')[0].replace(/\/$/, '') || SITE;
const decodeEnt = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

function analyse(url, html) {
  const root = parse(html, { comment: false });
  const head = root.querySelector('head');
  const meta = (sel) => decodeEnt(root.querySelector(sel)?.getAttribute('content') ?? '');
  const d = { url };
  d.lang = root.querySelector('html')?.getAttribute('lang') ?? '';
  d.title = decodeEnt(head?.querySelector('title')?.text ?? '').trim();
  d.description = meta('meta[name="description"]');
  d.robots = meta('meta[name="robots"]');
  d.canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  d.hreflang = root.querySelectorAll('link[rel="alternate"][hreflang], link[rel="alternate"][hrefLang]').map((l) => [l.getAttribute('hreflang') ?? l.getAttribute('hrefLang'), l.getAttribute('href')]);
  d.og = {};
  for (const m of root.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')) {
    const k = m.getAttribute('property') ?? m.getAttribute('name');
    (d.og[k] ??= []).push(decodeEnt(m.getAttribute('content') ?? ''));
  }
  // JSON-LD
  d.jsonld = [];
  d.jsonldErrors = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const j = JSON.parse(s.text);
      const flat = (x) => (Array.isArray(x) ? x.flatMap(flat) : x['@graph'] ? flat(x['@graph']) : [x]);
      d.jsonld.push(...flat(j));
    } catch (e) {
      d.jsonldErrors.push(e.message);
    }
  }
  d.schemaTypes = d.jsonld.map((x) => [].concat(x['@type']).join('+'));
  // body without scripts/styles, for text and links
  const body = root.querySelector('body') ?? root;
  body.querySelectorAll('script, style, noscript, template').forEach((n) => n.remove());
  d.landmarks = ['header', 'nav', 'main', 'footer'].filter((t) => body.querySelector(t));
  const main = body.querySelector('main') ?? body;
  d.text = main.structuredText.replace(/\s+/g, ' ').trim();
  d.fullText = body.structuredText.replace(/\s+/g, ' ').trim();
  // Same text with one line per block element: fact checks must not read
  // across a label and the next value ("Sleeps 1–6" + "Bedrooms …").
  d.factText = body.structuredText.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
  const cjk = /^(zh|ja)/.test(d.lang);
  d.words = cjk ? d.text.replace(/\s/g, '').length : d.text.split(' ').filter(Boolean).length;
  d.headings = body.querySelectorAll('h1, h2, h3, h4, h5, h6').map((h) => [Number(h.tagName[1]), h.text.replace(/\s+/g, ' ').trim()]);
  d.h1 = d.headings.filter(([l]) => l === 1).map(([, t]) => t);
  d.headingSkips = [];
  let prev = 0;
  for (const [l, t] of d.headings) {
    if (prev && l > prev + 1) d.headingSkips.push(`h${prev}→h${l} "${t.slice(0, 40)}"`);
    prev = l;
  }
  d.links = body.querySelectorAll('a[href]').map((a) => ({ href: a.getAttribute('href'), anchor: a.text.replace(/\s+/g, ' ').trim() || a.getAttribute('aria-label') || '', rel: a.getAttribute('rel') ?? '' }));
  d.internalLinks = [];
  d.externalLinks = [];
  for (const l of d.links) {
    if (/^(mailto|tel|javascript|data):/.test(l.href) || l.href.startsWith('#')) continue;
    let abs;
    try { abs = new URL(l.href, url).href; } catch { continue; }
    if (abs.startsWith(SITE)) d.internalLinks.push({ ...l, target: norm(abs) });
    else d.externalLinks.push({ ...l, target: abs });
  }
  d.images = body.querySelectorAll('img').map((i) => ({
    src: i.getAttribute('src') ?? '',
    alt: i.getAttribute('alt'),
    width: i.getAttribute('width'),
    height: i.getAttribute('height'),
    loading: i.getAttribute('loading') ?? '',
    fetchpriority: i.getAttribute('fetchpriority') ?? '',
    srcset: Boolean(i.getAttribute('srcset') || i.parentNode?.querySelector?.('source')),
    ariaHidden: i.getAttribute('aria-hidden') === 'true'
  }));
  d.buttonsNoName = body.querySelectorAll('button').filter((b) => !b.text.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')).length;
  d.inputsNoLabel = body.querySelectorAll('input:not([type=hidden]):not([type=submit]), select, textarea').filter((i) => {
    const id = i.getAttribute('id');
    return !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') && !(id && body.querySelector(`label[for="${id}"]`)) && !i.closest('label');
  }).length;
  return d;
}

// ---------- run ----------

const findings = [];
const add = (sev, code, url, detail = '') => findings.push({ sev, code, url, detail });

const smRes = await get(`${SITE}/sitemap.xml`);
if (smRes.status !== 200) {
  console.error('sitemap.xml not found');
  process.exit(1);
}
const sitemap = smRes.html;
const smUrls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
  const loc = m[1].match(/<loc>([^<]+)<\/loc>/)[1];
  const alts = [...m[1].matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((a) => [a[1], a[2]]);
  return { loc, alts };
});
const urls = smUrls.map((u) => u.loc);
if (new Set(urls).size !== urls.length) add('P1', 'sitemap-duplicate-loc', 'sitemap.xml');

const robots = await get(`${SITE}/robots.txt`);
if (robots.status !== 200) add('P1', 'robots-missing', 'robots.txt');
else {
  if (!/Sitemap:\s*https:\/\/ironwoodlivigno\.com\/sitemap\.xml/.test(robots.html)) add('P1', 'robots-no-sitemap', 'robots.txt');
  if (/^\s*Disallow:\s*\/\s*$/m.test(robots.html)) add('P0', 'robots-disallow-all', 'robots.txt');
}

const pages = {};
await pool(urls, LIVE ? 8 : 32, async (u) => {
  const r = await get(u);
  if (r.status !== 200) {
    add('P0', `sitemap-url-status-${r.status}`, u, r.location ?? '');
    pages[u] = { url: u, status: r.status };
    return;
  }
  const d = analyse(u, r.html);
  d.status = 200;
  d.xRobots = r.headers['x-robots-tag'] ?? '';
  pages[u] = d;
});

// ---------- per-page checks ----------
for (const d of Object.values(pages)) {
  if (d.status !== 200) continue;
  const u = d.url;
  if (/noindex/i.test(d.robots) || /noindex/i.test(d.xRobots)) add('P0', 'noindex-in-sitemap', u);
  if (!d.canonical) add('P0', 'canonical-missing', u);
  else if (d.canonical !== u) add('P0', 'canonical-not-self', u, d.canonical);
  if (d.jsonldErrors.length) add('P0', 'jsonld-invalid', u, d.jsonldErrors.join('; '));
  if (!d.title) add('P1', 'title-missing', u);
  if (!d.description) add('P1', 'description-missing', u);
  if (d.h1.length !== 1) add('P1', 'h1-count', u, String(d.h1.length));
  if (!d.lang) add('P1', 'html-lang-missing', u);
  if (!d.og['og:image']) add('P2', 'og-image-missing', u);
  if (!d.og['og:title']) add('P2', 'og-title-missing', u);
  if (!d.og['og:locale']) add('P2', 'og-locale-missing', u);
  if (d.hreflang.filter(([l]) => l !== 'x-default').length > 1 && !d.og['og:locale:alternate']) add('P3', 'og-locale-alternate-missing', u);
  if (!d.landmarks.includes('main')) add('P2', 'no-main-landmark', u);
  for (const s of d.headingSkips) add('P2', 'heading-level-skip', u, s);
  const cjk = /^(zh|ja)/.test(d.lang);
  const tl = d.title.length;
  if (!cjk && tl > 65) add('P3', 'title-long', u, `${tl} chars`);
  if (!cjk && tl < 25) add('P3', 'title-short', u, `${tl} chars`);
  const dl = d.description.length;
  if (!cjk && (dl > 165 || dl < 70)) add('P3', 'description-length', u, `${dl} chars`);
  for (const i of d.images) {
    if (i.alt === null || i.alt === undefined) add('P1', 'img-alt-missing', u, i.src);
    if (!i.width || !i.height) add('P2', 'img-no-dimensions', u, i.src);
  }
  if (d.buttonsNoName) add('P1', 'button-without-name', u, String(d.buttonsNoName));
  if (d.inputsNoLabel) add('P1', 'input-without-label', u, String(d.inputsNoLabel));
  const ldTypes = new Set(d.schemaTypes);
  if (!ldTypes.has('BreadcrumbList') && !/\/(it|en|en-us|de|fr|da|pl|cs|no|nl|zh|ja)$/.test(u)) add('P3', 'no-breadcrumb-schema', u);
  // FAQPage must match visible questions
  for (const node of d.jsonld) {
    if ([].concat(node['@type']).includes('FAQPage')) {
      for (const q of node.mainEntity ?? []) {
        const name = String(q.name ?? '').replace(/\s+/g, ' ').trim();
        if (name && !d.fullText.includes(name.slice(0, 40))) add('P1', 'faq-schema-not-visible', u, name.slice(0, 60));
      }
    }
  }
}

// ---------- hreflang ----------
const smAlt = Object.fromEntries(smUrls.map((s) => [s.loc, s.alts]));
for (const d of Object.values(pages)) {
  if (d.status !== 200) continue;
  if (!d.hreflang.length) { add('P1', 'hreflang-missing', d.url); continue; }
  if (!d.hreflang.some(([l]) => l === 'x-default')) add('P1', 'hreflang-no-x-default', d.url);
  if (!d.hreflang.some(([, h]) => h === d.url)) add('P1', 'hreflang-no-self', d.url);
  const codes = d.hreflang.map(([l]) => l);
  if (new Set(codes).size !== codes.length) add('P1', 'hreflang-duplicate-code', d.url);
  for (const [l, h] of d.hreflang) {
    if (!/^(x-default|[a-z]{2}(-[a-z]{2})?)$/i.test(l)) add('P1', 'hreflang-invalid-code', d.url, l);
    const t = pages[h];
    if (!t) { add('P1', 'hreflang-target-not-in-sitemap', d.url, `${l} ${h}`); continue; }
    if (t.status === 200 && !t.hreflang.some(([, x]) => x === d.url)) add('P1', 'hreflang-not-reciprocal', d.url, `${l} → ${h}`);
    if (t.status === 200 && l !== 'x-default' && t.lang && t.lang.toLowerCase() !== l.toLowerCase()) add('P1', 'hreflang-lang-mismatch', d.url, `${l} → ${h} has lang=${t.lang}`);
  }
  // page tags vs sitemap alternates
  const sm = (smAlt[d.url] ?? []).map(([l, h]) => `${l} ${h}`).sort().join('|');
  const pg = d.hreflang.map(([l, h]) => `${l} ${h}`).sort().join('|');
  if (sm && sm !== pg) add('P2', 'hreflang-page-vs-sitemap', d.url);
}

// ---------- duplicates ----------
const dupe = (key, sev, code) => {
  const m = {};
  for (const d of Object.values(pages)) if (d[key]) (m[d[key]] ??= []).push(d.url);
  for (const [v, us] of Object.entries(m)) if (us.length > 1) add(sev, code, us.join(' , '), v.slice(0, 80));
};
dupe('title', 'P1', 'title-duplicate');
dupe('description', 'P2', 'description-duplicate');
const h1m = {};
for (const d of Object.values(pages)) if (d.h1?.[0]) (h1m[d.h1[0]] ??= []).push(d.url);
for (const [v, us] of Object.entries(h1m)) if (us.length > 1) add('P2', 'h1-duplicate', us.join(' , '), v.slice(0, 80));

// ---------- link graph ----------
const linkTargets = new Set();
const inbound = {};
const edges = [];
for (const d of Object.values(pages)) {
  if (d.status !== 200) continue;
  for (const l of d.internalLinks) {
    edges.push([d.url, l.target, l.anchor, l.rel]);
    linkTargets.add(l.target);
    if (l.target !== d.url) (inbound[l.target] ??= new Set()).add(d.url);
  }
}
const extraStatus = {};
await pool([...linkTargets].filter((t) => !pages[t]), 8, async (t) => {
  const r = await get(t);
  extraStatus[t] = r.status;
});
for (const [from, to] of edges) {
  const st = pages[to]?.status ?? extraStatus[to];
  if (st === 404 || st === 0) add('P0', 'broken-internal-link', from, to);
  else if (LIVE && (st === 301 || st === 302 || st === 307 || st === 308)) add('P2', 'link-to-redirect', from, to);
}
// orphans and click depth from the Italian homepage
for (const u of urls) if (!inbound[u]?.size) add('P2', 'orphan-page', u);
for (const u of urls) if (inbound[u]?.size === 1) add('P3', 'underlinked-page', u, 'only 1 page links here');
const depth = { [`${SITE}/it`]: 0 };
let frontier = [`${SITE}/it`];
while (frontier.length) {
  const next = [];
  for (const u of frontier) for (const l of pages[u]?.internalLinks ?? []) if (depth[l.target] === undefined && pages[l.target]) { depth[l.target] = depth[u] + 1; next.push(l.target); }
  frontier = next;
}
for (const u of urls) if (depth[u] === undefined) add('P2', 'unreachable-from-home', u);
else if (depth[u] > 3) add('P3', 'deep-page', u, `depth ${depth[u]}`);

// internal PageRank (internal engineering metric, not a Google value)
const ids = urls.filter((u) => pages[u]?.status === 200);
let pr = Object.fromEntries(ids.map((u) => [u, 1 / ids.length]));
const outs = Object.fromEntries(ids.map((u) => [u, [...new Set(pages[u].internalLinks.map((l) => l.target).filter((t) => pages[t]?.status === 200 && t !== u))]]));
for (let it = 0; it < 30; it++) {
  const n = Object.fromEntries(ids.map((u) => [u, 0.15 / ids.length]));
  for (const u of ids) { const o = outs[u]; if (!o.length) continue; for (const t of o) n[t] += (0.85 * pr[u]) / o.length; }
  pr = n;
}

// ---------- images (live only: sizes) ----------
const imgIndex = {};
for (const d of Object.values(pages)) for (const i of d.images ?? []) {
  const k = i.src.split('?')[0];
  const e = (imgIndex[k] ??= { src: k, pages: 0, alts: new Set(), width: i.width, height: i.height, loading: new Set(), srcset: i.srcset, bytes: '' });
  e.pages++;
  e.alts.add(i.alt ?? '(missing)');
  e.loading.add(i.loading || 'eager');
}
for (const e of Object.values(imgIndex)) {
  if (e.src.startsWith('/') && !LIVE) {
    const f = path.join(OUT, decodeURIComponent(e.src));
    e.bytes = fs.existsSync(f) ? fs.statSync(f).size : 'MISSING';
    if (e.bytes === 'MISSING' && !e.src.startsWith('/api/') && !e.src.startsWith('/foto/')) add('P0', 'broken-image', e.src);
  }
}

// ---------- near-duplicate text (same language) ----------
const shingles = (t) => { const w = t.toLowerCase().split(/\s+/); const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(' ')); return s; };
const byLang = {};
for (const d of Object.values(pages)) if (d.status === 200 && !/^(zh|ja)/.test(d.lang)) (byLang[d.lang] ??= []).push([d.url, shingles(d.text)]);
const similar = [];
for (const list of Object.values(byLang)) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
  const [a, sa] = list[i], [b, sb] = list[j];
  if (!sa.size || !sb.size) continue;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const jac = inter / (sa.size + sb.size - inter);
  if (jac > 0.35) similar.push([a, b, jac.toFixed(2)]);
}
for (const [a, b, j] of similar) add(j > 0.6 ? 'P1' : 'P3', 'near-duplicate-text', a, `${b} jaccard=${j}`);

// ---------- facts ----------
const factFindings = checkFacts(Object.values(pages).filter((d) => d.status === 200).map((d) => ({ url: d.url, fullText: d.factText })));
for (const f of factFindings) add(f.sev, f.code, f.url, f.detail);
for (const name of ['llms.txt', 'llms-full.txt']) {
  const r = await get(`${SITE}/${name}`);
  if (r.status !== 200) { add('P1', 'llms-file-missing', name); continue; }
  for (const f of checkTextFile(name, r.html)) add(f.sev, f.code, f.url, f.detail);
}

// ---------- output ----------
const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.code.localeCompare(b.code));
const count = (s) => findings.filter((f) => f.sev === s).length;
console.log(`${LIVE ? 'LIVE' : 'BUILD (out/)'} · ${urls.length} URL in sitemap · P0 ${count('P0')} · P1 ${count('P1')} · P2 ${count('P2')} · P3 ${count('P3')}`);
const byCode = {};
for (const f of findings) (byCode[`${f.sev} ${f.code}`] ??= []).push(f);
for (const [k, list] of Object.entries(byCode)) {
  console.log(`  ${k}: ${list.length}`);
  for (const f of list.slice(0, args.verbose ? 1000 : 3)) console.log(`      ${f.url}${f.detail ? '  ·  ' + f.detail : ''}`);
}

if (REPORT) {
  fs.mkdirSync(REPORT, { recursive: true });
  const csv = (rows) => rows.map((r) => r.map((c) => { const s = String(c ?? ''); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n') + '\n';
  const w = (name, rows) => fs.writeFileSync(path.join(REPORT, name), csv(rows));
  const P = ids.map((u) => pages[u]);
  const intent = (u) => (/\/blog\/[^/]+/.test(u) && !/\/blog\/(it|en|de|fr|da|pl|cs|no|nl|zh|ja)$/.test(u) ? 'informational' : /\/blog/.test(u) ? 'navigational (hub)' : /inverno|estate|famiglie|sauna|camere|come-arrivare|chi-siamo/.test(u) ? 'commercial / topic' : /contact|kontakt|contatti|contacto|kontakt|yhteys|privacy/.test(u) ? 'navigational' : 'transactional (home)');
  w('01_URL_INVENTORY.csv', [['url', 'status', 'indexable', 'canonical_ok', 'lang', 'h1', 'title', 'meta_description', 'words', 'schema', 'internal_links_out', 'internal_links_in', 'images', 'click_depth', 'internal_pagerank_x1000', 'intent', 'decision'],
    ...P.map((d) => [d.url, d.status, /noindex/.test(d.robots) ? 'no' : 'yes', d.canonical === d.url ? 'yes' : 'NO', d.lang, d.h1[0] ?? '', d.title, d.description, d.words, [...new Set(d.schemaTypes)].join(' '), new Set(d.internalLinks.map((l) => l.target)).size, inbound[d.url]?.size ?? 0, d.images.length, depth[d.url] ?? '', (pr[d.url] * 1000).toFixed(2), intent(d.url), 'KEEP'])]);
  w('02_INDEXABILITY_AUDIT.csv', [['url', 'http_status', 'meta_robots', 'x_robots_tag', 'in_sitemap', 'canonical', 'self_canonical', 'indexable'],
    ...Object.values(pages).map((d) => [d.url, d.status, d.robots ?? '', d.xRobots ?? '', 'yes', d.canonical ?? '', d.canonical === d.url ? 'yes' : 'no', d.status === 200 && !/noindex/.test(d.robots ?? '') && d.canonical === d.url ? 'yes' : 'no'])]);
  w('03_CANONICAL_MATRIX.csv', [['url', 'canonical', 'match', 'og_url', 'og_url_match'], ...P.map((d) => [d.url, d.canonical, d.canonical === d.url, d.og['og:url']?.[0] ?? '', (d.og['og:url']?.[0] ?? '') === d.url])]);
  // hreflang matrix: one row per x-default group
  const locs = ['it', 'en', 'en-us', 'de', 'fr', 'da', 'pl', 'cs', 'no', 'nl', 'zh', 'ja', 'x-default'];
  const groups = {};
  for (const d of P) { const xd = d.hreflang.find(([l]) => l === 'x-default')?.[1] ?? d.url; (groups[xd] ??= {}); for (const [l, h] of d.hreflang) groups[xd][l] = h; }
  w('04_HREFLANG_MATRIX.csv', [['group', ...locs, 'reciprocal_errors'], ...Object.entries(groups).map(([g, m]) => [g, ...locs.map((l) => m[l] ? m[l].replace(SITE, '') : '—'), findings.filter((f) => f.code === 'hreflang-not-reciprocal' && Object.values(m).includes(f.url)).length])]);
  w('05_METADATA_AUDIT.csv', [['url', 'lang', 'title', 'title_len', 'description', 'description_len', 'og_title', 'og_description', 'og_image', 'og_locale', 'og_locale_alternate', 'twitter_card'],
    ...P.map((d) => [d.url, d.lang, d.title, d.title.length, d.description, d.description.length, d.og['og:title']?.[0] ?? '', d.og['og:description']?.[0] ?? '', d.og['og:image']?.[0] ?? '', d.og['og:locale']?.[0] ?? '', (d.og['og:locale:alternate'] ?? []).length, d.og['twitter:card']?.[0] ?? ''])]);
  w('06_HEADING_AUDIT.csv', [['url', 'h1_count', 'h1', 'h2_count', 'h3_count', 'level_skips', 'outline', 'landmarks'],
    ...P.map((d) => [d.url, d.h1.length, d.h1.join(' | '), d.headings.filter(([l]) => l === 2).length, d.headings.filter(([l]) => l === 3).length, d.headingSkips.join(' ; '), d.headings.map(([l, t]) => `${'  '.repeat(l - 1)}h${l} ${t}`).join(' / ').slice(0, 1500), d.landmarks.join(' ')])]);
  const seen = new Set();
  w('07_INTERNAL_LINK_GRAPH.csv', [['from', 'to', 'anchor', 'rel', 'target_status'], ...edges.filter(([a, b, c]) => { const k = a + b + c; if (seen.has(k)) return false; seen.add(k); return true; }).map(([a, b, c, r]) => [a, b, c, r, pages[b]?.status ?? extraStatus[b]])]);
  w('10_SCHEMA_AUDIT.csv', [['url', 'types', 'valid_json', 'faq_questions', 'breadcrumb_items', 'has_org_ref'],
    ...P.map((d) => [d.url, d.schemaTypes.join(' '), d.jsonldErrors.length ? 'NO' : 'yes', d.jsonld.filter((x) => [].concat(x['@type']).includes('FAQPage')).reduce((s, x) => s + (x.mainEntity?.length ?? 0), 0), d.jsonld.filter((x) => x['@type'] === 'BreadcrumbList').reduce((s, x) => s + (x.itemListElement?.length ?? 0), 0), JSON.stringify(d.jsonld).includes('#organization')])]);
  w('11_IMAGE_AUDIT.csv', [['src', 'pages_using', 'alt_variants', 'width', 'height', 'loading', 'responsive_sources', 'bytes', 'format'],
    ...Object.values(imgIndex).map((e) => [e.src, e.pages, [...e.alts].slice(0, 4).join(' | '), e.width, e.height, [...e.loading].join(' '), e.srcset, e.bytes, path.extname(e.src)])]);
  w('findings.csv', [['severity', 'code', 'url', 'detail'], ...findings.map((f) => [f.sev, f.code, f.url, f.detail])]);
  w('similarity.csv', [['page_a', 'page_b', 'jaccard_5word_shingles'], ...similar]);
  // plain text per page, for the GEO answerability audit
  fs.writeFileSync(path.join(REPORT, 'pages.json'), JSON.stringify(P.map((d) => ({ url: d.url, lang: d.lang, title: d.title, description: d.description, h1: d.h1[0], headings: d.headings, text: d.fullText, schema: d.jsonld })), null, 0));
  console.log(`report → ${REPORT}`);
}

// The deliverable 09_PROPERTY_FACTS.json is always a fresh copy of the single
// source of truth (never edit it by hand: edit property-facts.json).
fs.copyFileSync(path.resolve('seo-engineering/property-facts.json'), path.resolve('seo-engineering/09_PROPERTY_FACTS.json'));

process.exit(count('P0') + count('P1') > 0 ? 1 : 0);
