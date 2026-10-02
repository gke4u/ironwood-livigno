# 00 — Executive summary (2026-10-02)

Scope: the MASTER SEO + GEO ENGINEERING SPECIFICATION for ironwoodlivigno.com, executed in order AUDIT → EVIDENCE → MODEL → PLAN → IMPLEMENT → TEST → VALIDATE → DOCUMENT. No ranking or traffic promise is made; scores here are internal engineering metrics.

## Current state

A static, 12-language site (361 indexable URLs) on Cloudflare Workers. After this work: 0 issues of any severity in the automated audit (build and live), every page self-canonical with reciprocal hreflang, valid JSON-LD everywhere, every fact consistent with one database in all languages, 150/150 GEO questions answerable from the expected page, Lighthouse mobile Accessibility 100 and SEO 100, CLS ≤ 0.034.

## Critical problems found (and fixed)

1. hreflang: Italian topic pages did not list their translations (154 non-reciprocal pairs); contact pages used a different x-default from the sitemap.
2. Fact conflict for AI systems: llms.txt said "ski-in/ski-out di fatto" while the FAQ says it is not ski-in/ski-out.
3. Layout shift from web-font swap: CLS 0.186 on blog posts, 0.129 on /en.
4. 133 URLs (articles in 11 languages) with at most 2 internal links.
5. Floor area (90 m²) missing on every homepage → "how big is it?" not answerable there.

## Biggest opportunities (outside the code)

- **Address corrected 2026-10-02**: the owner confirmed **Via Saroch 767** (the site said 771 on every page, JSON-LD and llms files; livigno.eu was right). Fixed everywhere. Official tourism portal livigno.eu still uses the name "Appartamenti Iron Wood" — ask for "Ironwood Livigno" + a website link.
- **Holidu listing** (syndicated to Expedia) says "direct access to the ski slopes" and uses "Iron Wood" — align.
- **Prices**: nothing published; price-intent searches and AI answers can only say "ask".
- **Search Console data**: needed for real query/CTR work (not accessible in this session).

## What changed (details in 24_SEO_CHANGELOG.md)

- Structural: property-facts.json as the single source of truth; JSON-LD generated from it (LodgingBusiness + VacationRental, CIN identifier, EntirePlace, beds, occupancy, Google Business Profile in sameAs).
- Content: "At a glance" fact block on all 12 homepages; "Leggi anche" topic clusters on 242 article URLs; Italian label fix.
- International: hreflang complete and consistent; glossary of terms per language.
- GEO: llms.txt corrected + identity/disambiguation block; 150-question retrieval test set.
- Performance: metric-matched fallback fonts (CLS).
- Quality system: audit engine + fact checker + GEO test run before every deploy (`predeploy`) and in GitHub Actions; deploy is blocked on P0/P1 or GEO regression.

## Risks

Low. No URL was created, removed or redirected. Rollback = one command (27_ROLLBACK_PLAN.md). The new blocks add page length (rooms section +~500 px).

## Implementation order from here

1. Owner: livigno.eu correction, Holidu text, Search Console sitemap resubmission (26_ROLLOUT_PLAN.md).
2. Owner decisions → Claude: prices, check-in times, nearby shops, lift name.
3. Native-speaker review of translations.
4. LCP experiments; click-event measurement.
5. Monthly monitoring with `npm run audit:live` and the GEO set.

## Files

`seo-engineering/` contains the 29 deliverables (00–28), `property-facts.json` (source of truth), `localization-glossary.json`, and `baseline/`, `post-change/`, `live/` audit snapshots. Tools: `scripts/seo/`. How it fits together: `README.md`.
