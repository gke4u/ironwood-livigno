# 13 — Core Web Vitals

Lab data (Lighthouse mobile, live site). Field data (CrUX) was not accessible from this environment; check it in Search Console → Core Web Vitals.

## Before / after (2026-10-02)

| Page | Perf before | Perf after | LCP before | LCP after | CLS before | CLS after | TBT before | TBT after |
|---|---|---|---|---|---|---|---|---|
| /it | 88 | 82–87 (3 runs) | 3.6 s | 3.7–4.4 s | 0.008 | **0.002** | 80 ms | 100 ms |
| /en | 82 | 84 | 3.7 s | 4.0 s | 0.129 | **0.012** | 80 ms | 120 ms |
| /inverno | 87 | 91 | 3.3 s | 3.4 s | 0.002 | **0** | 240 ms | 90 ms |
| /blog/sci-a-livigno-guida-carosello-3000 | 76 | 88 | 3.8 s | 3.7 s | 0.186 | **0.034** | 210 ms | 130 ms |

Accessibility 100 and SEO 100 on all four pages, before and after.

Reading the numbers honestly: CLS improved clearly and for a known reason (PERF-1). LCP and TBT moved inside Lighthouse's run-to-run noise (three /it runs: 3.7 / 3.8 / 4.4 s); no LCP improvement is claimed.

## LCP element

Measured, not assumed: on mobile the LCP element is the **hero H1 text**, not the hero photo (the photo is behind a dark gradient and starts with a slow zoom). Its time is spent waiting for the main CSS and the Fraunces font, then for hydration-free paint.

## CLS root cause (fixed)

Trace with PerformanceObserver under throttling:

- /en: at ~1.1 s the hero block moved up 40 px (stats list re-wrapped when Poppins replaced the system font), at ~1.4 s the H1 grew from 2 to 3 lines (Fraunces).
- Blog posts: at ~1.35 s the "Disponibile anche in" line re-wrapped from 2 to 3 lines, pushing the 16:9 photo down 20 px (0.186).

Fix: `@font-face` fallbacks with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` computed from the real font metrics (@capsizecss/metrics, same formula as next/font): Arial/Times New Roman on desktop, Roboto/Noto Serif on Android.

## INP

No field data. Lab proxies: TBT 90–130 ms, no long third-party tasks before interaction. Event handlers are small (menus, lightbox, pop-up). Risk: low.

## Remaining LCP options (not done — trade-offs)

1. Inline the critical CSS of the hero (removes one render-blocking request; Next static export doesn't do it natively).
2. `font-display: optional` for Fraunces on the H1 (faster LCP, but first-time visitors may see the fallback serif).
3. Preload only the Fraunces 400 latin woff2 used by the H1.

Each must be measured with ≥5 Lighthouse runs before/after because the current spread is ±0.4 s.
