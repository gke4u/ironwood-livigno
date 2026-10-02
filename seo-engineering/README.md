# SEO / GEO engineering — architecture (spec 127)

## Fact model

`property-facts.json` is the single source of truth. `src/data/propertyFacts.ts` imports it; `StructuredData.tsx` (JSON-LD) and `PropertyFacts.tsx` (the visible "at a glance" block) read numbers, address, coordinates, contacts and identifiers from it. Page texts in 12 languages live in `messages/*.json` and `src/content/*`; `scripts/seo/facts.mjs` checks them against the database before every deploy. To change a fact: edit the JSON first, then the texts; the deploy fails until they agree.

## URL architecture

| Pattern | Example | Languages |
|---|---|---|
| `/{locale}` homepage | `/de` | it, en, en-us, de, fr, da, pl, cs, no, nl, zh, ja |
| `/{locale}/{contact-slug}` | `/de/kontakt` | 12 |
| `/{topic}` + `/{topic}/{locale}` | `/inverno`, `/inverno/de` | Italian original + 11 |
| `/blog`, `/blog/{locale}` | `/blog/de` | index per language |
| `/blog/{slug}` + `/blog/{slug}/{locale}` | `/blog/come-arrivare-a-livigno/de` | Italian original + 10 |

x-default is always the Italian version. `en-us` exists only for the homepage and contact page (different spelling/units); other pages serve `en`.

## Multilingual

hreflang is emitted on every page (`<link rel="alternate">`) and in the sitemap (`src/app/sitemap.ts`), from the same translation tables, and must match (audit check `hreflang-page-vs-sitemap`).

## Schema

| Page type | JSON-LD |
|---|---|
| Homepages | LodgingBusiness + VacationRental (`#organization`), WebSite (`#website`), FAQPage |
| Topic pages | WebPage / AboutPage (chi-siamo), BreadcrumbList, FAQPage where visible |
| Articles | BlogPosting (publisher = `#organization`, contentLocation = Livigno), BreadcrumbList, HowTo (getting there) |
| Contact | ContactPage, BreadcrumbList |

No Review/AggregateRating markup (self-serving reviews are not eligible).

## Internal links

Navigation + footer (topic pages, blog), contextual links in articles, `relatedLinks` (article → topic pages), and `src/content/blogRelated.ts` (article → 3 related articles, all languages).

## Deployment process

```
npm run build          # static export to out/
npm run deploy         # predeploy runs npm run test:seo; stops on P0/P1 or GEO regression
npm run audit:live     # same audit against the live site → seo-engineering/live/
npm run indexnow       # notify Bing/Yandex/Seznam of changed URLs
```

GitHub Actions (`.github/workflows/seo.yml`) runs build + `test:seo` on every push.

## Tools (`scripts/seo/`)

| Script | Does |
|---|---|
| `audit.mjs` | crawl from the sitemap (build or `--live`), all checks, CSV tables with `--report=DIR` |
| `facts.mjs` | fact consistency engine (12 languages + llms files) |
| `geo-questions.mjs` | 150-question GEO/AEO retrieval set → 17/18 CSVs; `--strict` fails on regression |

Severity: P0 critical indexing/security · P1 major visibility (blocks deploy) · P2 important · P3 nice-to-have.
