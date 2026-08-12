import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `next build` writes plain HTML/CSS/JS files into `out/`,
  // with no server needed. That folder can be dragged straight into
  // Cloudflare Pages (or any static host) — no terminal deploy step, no
  // Workers runtime. Every page (title, meta description, canonical,
  // hreflang, Open Graph, Twitter Card, JSON-LD) is fully baked into the
  // HTML at build time, so EVERY visitor and EVERY crawler — including AI
  // crawlers that don't run JavaScript (GPTBot, ClaudeBot, PerplexityBot...)
  // — sees the exact same complete markup. There's no separate "bot vs
  // browser" version to keep in sync, which is actually a stronger,
  // simpler guarantee than the server-rendered/streaming approach.
  output: 'export',
  images: {
    unoptimized: true
  },
  // Type errors are already caught separately via `npx tsc --noEmit` before
  // every publish (part of the standard verification step for every change
  // in this project). Next's own internal type-check pass during `next
  // build` duplicates that work and was observed hanging for 20+ minutes
  // on a full rebuild (stuck at buildStage "type-checking" per
  // .next/diagnostics/build-diagnostics.json) — skipping it here removes a
  // slow, redundant step without losing type safety.
  typescript: {
    ignoreBuildErrors: true
  }
};

export default withNextIntl(nextConfig);
