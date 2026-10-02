# 12 — Performance audit

Measured 2026-10-02 on the live site with Lighthouse (mobile emulation: Moto G power class, simulated slow 4G, 4× CPU) from a local Chromium, plus a Playwright trace of layout shifts under throttling. PageSpeed Insights API was not used (anonymous quota often exhausted).

## Architecture (why the site is already fast)

| Layer | What it does | Evidence |
|---|---|---|
| Hosting | Cloudflare Workers static assets, HTTP/3 (`alt-svc: h3`), Brotli | `curl -I` headers |
| TTFB | 40–100 ms for HTML | Lighthouse `server-response-time` |
| HTML | Static export (Next.js `output: export`): every page is pre-rendered HTML; the homepages pass through the Worker only to inject the section order and the photo of the day | `wrangler.jsonc` `run_worker_first` |
| Hashed assets | `/_next/static/*` → `max-age=31536000, immutable` | `public/_headers` |
| Images | AVIF + WebP + JPG, `srcset` 480…1920, width/height, lazy below the fold, hero `fetchpriority=high` | `scripts/generate-responsive-images.mjs`, `Pic.tsx` |
| Below-the-fold sections | `content-visibility: auto` + measured `contain-intrinsic-size` per section | `globals.css` |
| Fonts | Self-hosted Fontsource woff2 (Poppins 300–600, Fraunces 400/400i); since 2026-10-02 metric-matched local fallbacks | `layout.tsx`, `globals.css` |

## Third-party inventory (spec 69)

| Third party | Loaded when | Decision |
|---|---|---|
| Cloudflare Web Analytics beacon | `lazyOnload` after load | KEEP (privacy-friendly, no cookies). Causes a harmless CORS console error → Best-Practices 96 instead of 100 on homepages. |
| Open-Meteo weather API | IntersectionObserver, only when the weather section approaches the viewport | KEEP — not in the LCP path, no crawlable content generated |
| Google Maps iframe | Click-to-load poster (consent gate), `loading="lazy"` | KEEP |
| Lapentor 360° tour | Click-to-load poster; text description always in HTML | KEEP — crawl-safe, no weight before click |
| Holidu booking widget | Only inside the booking section, on interaction | KEEP |
| Fonts from Google | none (self-hosted) | — |

## Budgets (internal, measurable)

| Budget | Limit | Now |
|---|---|---|
| CLS mobile (Lighthouse) | ≤ 0.05 | 0.000–0.034 ✅ |
| TBT mobile | ≤ 200 ms | 90–130 ms ✅ |
| HTML TTFB | ≤ 200 ms | 40–100 ms ✅ |
| LCP mobile (Lighthouse simulated) | ≤ 2.5 s target | 3.4–4.0 s ❌ (see 13) |
| CSS total | ≤ 80 KB | 59 KB ✅ |
| Third-party requests before interaction | 1 (analytics) | 1 ✅ |

## Findings and actions

| ID | Finding | Severity | Status |
|---|---|---|---|
| PERF-1 | CLS 0.186 on blog posts, 0.129 on /en: web-font swap re-wrapped the H1 / "available in" line and pushed content | P1 | **Fixed** (metric-matched fallbacks) |
| PERF-2 | Mobile LCP 3.4–4.0 s (lab); LCP element is the H1 text; experiments show the bottleneck is the Next.js JavaScript requested before the paint, not fonts or the hero photo | P2 | Open — 2 experiments rejected with data (13); JS reduction to be planned |
| PERF-3 | Best-Practices 96 on homepages from the analytics CORS error | P3 | Accepted (data is received; verified via Cloudflare GraphQL on 2026-09-30) |
| PERF-4 | Trailing-slash variants answer 307 (Cloudflare `auto-trailing-slash`) instead of 301/308 | P3 | Open — canonical tags already consolidate; low impact |
