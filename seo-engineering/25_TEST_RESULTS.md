# 25 — Test results

Final release: Worker version **734fc83e-0b06-456c-89d6-43d9e558890f**, 2026-10-02.

## Automated suite (`npm run test:seo`, runs before every deploy)

| Suite | Scope | Baseline (before) | Final (build) | Final (live) |
|---|---|---|---|---|
| Status / indexability | 361 sitemap URLs | 0 issues | 0 | 0 |
| Canonical | self-canonical on 361 URLs | 0 | 0 | 0 |
| hreflang | reciprocity, self, x-default, codes, lang match, page vs sitemap | **154 non-reciprocal (morning) + 12 page/sitemap mismatches** | 0 | 0 |
| Metadata | title present/unique, description present, length | 0 P1 | 0 | 0 |
| Headings | exactly one H1, no level skips | 0 | 0 | 0 |
| JSON-LD | valid JSON on every page; FAQ questions visible on page | 0 | 0 | 0 |
| Links | internal links → 200 (7,600+ edges) | 0 broken | 0 | 0 |
| Images | alt present, width/height, file exists | 0 | 0 | 0 |
| Accessibility basics | buttons with names, inputs with labels, `<main>` landmark | 0 | 0 | 0 |
| Facts | guests, bedrooms, bathrooms, m², lift distance in 12 languages; no ski-in/ski-out; no Finnish sauna; llms.txt + llms-full.txt | **8 P1** (incl. llms.txt "ski-in/ski-out di fatto") | 0 | 0 |
| Near-duplicate text | 5-word shingles, same language, Jaccard > 0.35 | 0 | 0 | 0 |
| Internal linking | orphans, pages with 1 inbound link, click depth > 3 | 133 pages with ≤2 inbound | every URL ≥3 inbound, max depth 3 | same |
| GEO answerability | 150 questions, 12 languages (internal metric) | 0.944 mean, 2 real gaps (floor area) | **1.000** | **1.000** |
| Redirects | 165 rules in `_redirects` | — | — | 165/165 one hop to 200 |

## Fault injection (proves the gate works)

Injected into `out/inverno.html`: wrong canonical, H1 removed, alt removed → audit reported P0 canonical-not-self, P1 h1-count, P1 img-alt-missing and exited with code 1. Fact checker unit test: "150 m dagli impianti", "Up to 8 guests", "4 Schlafzimmern", "ski-in/ski-out apartment", "finnische Sauna", "200 m from the ski lifts" all flagged; "Non è ski-in/ski-out", "90 m² con 3 camere", "Sleeps 1–6" correctly not flagged.

## Lighthouse mobile (live)

See `13_CORE_WEB_VITALS.md`: CLS 0.186 → 0.034 (blog), 0.129 → 0.012 (/en); Accessibility 100 and SEO 100 on all tested pages.

## Manual / browser QA (Playwright, live, 2026-10-02)

| Check | Mobile 390×844 | Desktop 1366×800 |
|---|---|---|
| No horizontal overflow | ✅ | ✅ |
| Booking form present; empty submit shows validation (10 messages), nothing sent | ✅ | ✅ |
| Form endpoint reachable (CORS preflight 204) | ✅ | ✅ |
| WhatsApp CTAs present | ✅ | ✅ |
| "At a glance" block: 8 rows | ✅ | ✅ |
| JavaScript errors (excluding the known analytics CORS message) | 0 | 0 |
| "Leggi anche" block (it, de) | ✅ screenshot | ✅ screenshot |
| Offer pop-up (earlier today) | ✅ price above the buttons | ✅ |

Not tested: Safari/WebKit (local WebKit failed to load the page in this environment), a real form submission (would send a real request to the owner).
