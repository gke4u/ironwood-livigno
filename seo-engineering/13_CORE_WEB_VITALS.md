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

1. ~~Inline the critical CSS~~ — already the case: Next inlines the CSS in a `<style>` element (Lighthouse: 0 render-blocking resources).
2. `font-display: optional` for Fraunces on the H1 (first-time visitors may see the fallback serif) — not tried: the experiments below show fonts are not the bottleneck.
3. Font preload — tried, rejected (see below).

Each must be measured with ≥5 Lighthouse runs before/after because the current spread is ±0.4 s.

## LCP experiments run (2026-10-02, local Worker, Lighthouse mobile, 5 runs each)

| Variant | Perf | LCP | FCP | TBT | CLS | Decision |
|---|---|---|---|---|---|---|
| Baseline | 89 | 3,425 ms | 1,548 ms | 163 ms | 0.002 | — |
| Preload Fraunces 400 + Poppins 400/500 (latin) | 84 | 3,567 ms | **1,257 ms** | 286 ms | 0.000 | **Rejected**: LCP not better (worse), TBT worse |
| Hero photo without `fetchpriority=high` | 89 | 3,433 ms | 1,545 ms | 154 ms | 0.002 | **Rejected**: no effect |
| Control page /de (baseline) | 88 | 3,470 ms | 1,543 ms | 191 ms | 0.022 | — |

What the trace shows: unthrottled, the H1 is painted at ~0.46 s (TTFB 17 ms + render delay 443 ms). The 3.4 s is Lighthouse's simulation of slow 4G over everything requested before that paint — mainly ~150 KB of Next.js JavaScript chunks (requested at low priority but before the LCP). Fonts and the hero photo are not the bottleneck. Lowering it further means shipping less JavaScript on the homepage (e.g. turning client components such as the gallery, rooms tilt, weather and pop-up into lazily hydrated islands) — a refactor with regression risk, to be planned and measured separately, not done in this pass. Field data (CrUX in Search Console) should decide whether it is worth it.
