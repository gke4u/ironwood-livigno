# 28 — Final QA (release gate, spec 85 and 133)

| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | All important URLs = 200 | ✅ 361/361 | live audit |
| 2 | Canonical valid | ✅ 361 self-canonical | 03_CANONICAL_MATRIX.csv |
| 3 | Hreflang valid | ✅ reciprocal, x-default everywhere | 04_HREFLANG_MATRIX.csv |
| 4 | Sitemap valid | ✅ 361 URLs, all 200, indexable, with alternates | audit |
| 5 | Robots valid | ✅ Allow all + AI crawlers, sitemap declared, nothing needed for rendering blocked | robots.txt |
| 6 | JSON-LD valid | ✅ 0 parse errors; FAQ parity with visible text | 10_SCHEMA_AUDIT.csv |
| 7 | No accidental noindex | ✅ (only /privacy pages are noindex, by design, and not in the sitemap) | 02_INDEXABILITY_AUDIT.csv |
| 8 | No broken internal links | ✅ | 07_INTERNAL_LINK_GRAPH.csv |
| 9 | No broken images | ✅ | 11_IMAGE_AUDIT.csv |
| 10 | Forms work | ✅ validation + endpoint reachable (no real submission sent) | 25_TEST_RESULTS.md |
| 11 | Mobile works | ✅ | Playwright 390×844 |
| 12 | Desktop works | ✅ | Playwright 1366×800 |
| — | No fact conflicts | ✅ 12 languages + llms files | facts.mjs |
| — | No language inconsistencies found by the checks | ✅ ("Also available in" on Italian pages fixed) | — |
| — | No accidental URL loss | ✅ same 361 URLs before/after; no URL created or removed | baseline vs post-change |
| — | Redirects verified | ✅ 165/165 | 23_REDIRECT_MAP.csv |
| — | CTA working | ✅ | 21_CRO_AUDIT.md |
| — | Analytics working where applicable | ✅ page-view beacon + Cloudflare Web Analytics; click events not available (documented) | 21_CRO_AUDIT.md |
| — | No major performance regression | ✅ CLS improved; LCP within noise | 13_CORE_WEB_VITALS.md |
| — | Rollback documented | ✅ | 27_ROLLBACK_PLAN.md |

## The question of spec 136

> If a user searches in Italian, English, German, Danish or Polish for a place in Livigno for 6 people, 3 bedrooms, near the lifts, with a private sauna — does the site contain clear, structured, consistent information that a search engine can understand and an AI system can retrieve?

**On the site: yes.** Each of those languages has a homepage with an "at a glance" block (size, 1–6 guests, 3 bedrooms · 2 bathrooms, private infrared sauna and steam bath, 100 m from the lifts, address, direct booking), a dedicated sauna page, a rooms page, FAQ, and JSON-LD (VacationRental with occupancy, bedrooms, bathrooms, CIN, coordinates). The 150-question test set is fully answerable from the expected URLs.

**Off the site: not yet.** Search results for these queries are dominated by OTAs; the official tourism portal uses the name variant "Appartamenti Iron Wood"; one OTA overstates ski access. These need the owner (19_LOCAL_SEO_AUDIT.md). This work does not and cannot promise rankings or AI citations.
