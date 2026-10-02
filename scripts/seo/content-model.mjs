// Content governance (spec 94) and content depth model (spec 63).
//
//   node scripts/seo/content-model.mjs DIR
//
// Reads DIR/pages.json (audit.mjs --report=DIR) and the build's sitemap, and
// writes DIR/29_CONTENT_GOVERNANCE.csv and DIR/30_CONTENT_DEPTH_MODEL.csv.
// Depth is NOT word count: each page is scored on what it should cover for
// its type (facts, entities, questions, links, trust, conversion). Scores are
// an internal engineering metric for prioritising edits, nothing more.

import fs from 'node:fs';
import path from 'node:path';
import { F } from './patterns.mjs';

const dir = process.argv[2] ?? 'seo-engineering/.last-run';
const pages = JSON.parse(fs.readFileSync(path.join(dir, 'pages.json'), 'utf8'));
const sitemap = fs.existsSync('out/sitemap.xml') ? fs.readFileSync('out/sitemap.xml', 'utf8') : '';
const lastmod = Object.fromEntries([...sitemap.matchAll(/<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2].slice(0, 10)]));
const links = fs.existsSync(path.join(dir, '07_INTERNAL_LINK_GRAPH.csv'))
  ? fs.readFileSync(path.join(dir, '07_INTERNAL_LINK_GRAPH.csv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split(','))
  : [];
const outLinks = {};
for (const [from, to] of links) (outLinks[from] ??= new Set()).add(to);

const S = 'https://ironwoodlivigno.com';
const LOCALES = 'it|en|en-us|de|fr|da|pl|cs|no|nl|zh|ja';
function pageType(u) {
  const p = u.replace(S, '');
  if (new RegExp(`^/(${LOCALES})$`).test(p)) return 'home';
  if (/\/(contatti|contact|kontakt)$/.test(p)) return 'contact';
  if (new RegExp(`^/blog(/(${LOCALES}))?$`).test(p)) return 'blog-index';
  if (p.startsWith('/blog/')) return 'article';
  return 'topic';
}
function topic(u) {
  if (/sci|carosello|piste|deposito|natale|inverno/.test(u)) return 'winter';
  if (/estate|tramonto|e-bike|10-esperienze/.test(u)) return 'summer';
  if (/sauna|appartamento|gruppi|bambini|famiglie|camere|chi-siamo/.test(u)) return 'apartment';
  if (/arrivare|prenotare|periodi|tax-free|cane/.test(u)) return 'travel';
  if (/mangiare|shopping/.test(u)) return 'food-shopping';
  return 'general';
}
// Review dates: seasonal content is checked before its season starts.
const REVIEW_BY = { winter: '2026-11-15', summer: '2027-05-01', apartment: '2027-01-15', travel: '2027-03-01', 'food-shopping': '2027-03-01', general: '2027-01-15' };

// What each page type is expected to cover.
const FACTS_COMMERCIAL = ['guests6', 'bedrooms3', 'bathrooms2', 'infrared', 'steam', 'lifts100', 'address', 'area90'];
const ENTITIES = [/Ironwood Livigno/, /Livigno|利维尼奥|リヴィーニョ/, /Carosello/, /Mottolino/, /Via Saroch/];
const TRUST = [/recension|review|Bewertung|avis|anmeldelse|omtale|opini|recenz|beoordeling|评价|レビュー|口コミ/i, /Francesco/, /Via Saroch/, /CIN IT014037C274OJ27T8/];

const csv = (rows) => rows.map((r) => r.map((c) => { const s = String(c ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n') + '\n';
const gov = [['url', 'lang', 'page_type', 'topic', 'owner', 'factual_source', 'last_updated', 'review_by', 'translation_of', 'native_review']];
const depth = [['url', 'lang', 'page_type', 'intent_coverage', 'fact_coverage', 'entity_coverage', 'question_coverage', 'internal_link_coverage', 'trust_coverage', 'conversion_coverage', 'depth_index', 'weakest_dimension']];

for (const p of pages) {
  const type = pageType(p.url);
  const t = topic(p.url);
  const hay = `${p.title} ${p.description} ${p.text}`;
  const lang = p.lang;
  // The Italian original of a translated page: same URL without the language suffix.
  const original = type === 'home' ? `${S}/it` : type === 'contact' ? `${S}/it/contatti` : p.url.replace(new RegExp(`/(${LOCALES})$`), '');
  gov.push([
    p.url, lang, type, t,
    'Francesco (Ironwood Livigno)',
    type === 'article' || type === 'blog-index' ? 'local first-hand knowledge + property-facts.json for any apartment fact' : 'property-facts.json',
    lastmod[p.url] ?? '',
    REVIEW_BY[t],
    lang === 'it' ? '(original)' : original,
    lang === 'it' ? 'n/a' : lang === 'en' || lang === 'en-us' ? 'done (2026-10-01)' : lang === 'de' ? 'partial (Sie form, 2026-10-01)' : 'pending'
  ]);

  const h2 = p.headings.filter(([l]) => l === 2).length;
  const intent = (p.h1 ? 1 : 0) * 0.4 + (p.description ? 0.2 : 0) + Math.min(h2 / 3, 1) * 0.4;
  const factsExpected = type === 'home' || type === 'topic' ? FACTS_COMMERCIAL : type === 'article' ? ['address', 'lifts100'] : ['address'];
  const fact = factsExpected.filter((f) => F[f].test(hay + JSON.stringify(p.schema))).length / factsExpected.length;
  const entity = ENTITIES.filter((re) => re.test(hay)).length / ENTITIES.length;
  const faq = p.schema.filter((s) => [].concat(s['@type']).includes('FAQPage')).reduce((n, s) => n + (s.mainEntity?.length ?? 0), 0);
  const qHeadings = p.headings.filter(([, h]) => /[?？]$/.test(h)).length;
  const question = type === 'contact' || type === 'blog-index' ? 1 : Math.min((faq + qHeadings) / 5, 1);
  const link = Math.min((outLinks[p.url]?.size ?? 0) / 15, 1);
  const trust = TRUST.filter((re) => re.test(hay)).length / TRUST.length;
  const conv = /#prenota|wa\.me|contatti|contact|kontakt/.test(JSON.stringify(p.text)) || /WhatsApp/.test(hay) ? 1 : 0;
  const dims = { intent, fact, entity, question, link, trust, conversion: conv };
  const index = Object.values(dims).reduce((a, b) => a + b, 0) / Object.keys(dims).length;
  const weakest = Object.entries(dims).sort((a, b) => a[1] - b[1])[0][0];
  depth.push([p.url, lang, type, ...Object.values(dims).map((v) => v.toFixed(2)), index.toFixed(2), weakest]);
}

fs.writeFileSync(path.join(dir, '29_CONTENT_GOVERNANCE.csv'), csv(gov));
fs.writeFileSync(path.join(dir, '30_CONTENT_DEPTH_MODEL.csv'), csv(depth));

// Summary by page type
const byType = {};
for (const r of depth.slice(1)) (byType[r[2]] ??= []).push(r);
console.log(`content model: ${pages.length} pages (internal metric)`);
for (const [ty, rows] of Object.entries(byType)) {
  const avg = (i) => (rows.reduce((s, r) => s + Number(r[i]), 0) / rows.length).toFixed(2);
  const weak = {};
  for (const r of rows) weak[r[11]] = (weak[r[11]] ?? 0) + 1;
  console.log(`  ${ty.padEnd(10)} n=${String(rows.length).padStart(3)} depth ${avg(10)} · facts ${avg(4)} · entities ${avg(5)} · questions ${avg(6)} · links ${avg(7)} · trust ${avg(8)} · conversion ${avg(9)} · weakest: ${JSON.stringify(weak)}`);
}
