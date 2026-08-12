#!/usr/bin/env node
// Verifies hreflang reciprocity in public/sitemap.xml: if page A declares an
// hreflang alternate pointing at page B, page B must declare one pointing
// back at A (Google's documented requirement — one-way hreflang links are
// silently ignored). Also checks that every hreflang target actually
// exists as a <loc> somewhere in the sitemap, catching dead/renamed URLs
// (the exact class of bug that caused the /contact → /contatti slug
// mismatch this project hit earlier).
//
// Run after a build (the sitemap is generated at build time, not hand-maintained):
//   npm run build && node scripts/check-hreflang-reciprocity.mjs
// Exits non-zero on any failure, so it can be wired into CI later if a
// build pipeline gets added.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(__dirname, '..', 'out', 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  console.error(`✗ ${sitemapPath} not found. The sitemap is generated at build time (src/app/sitemap.ts) — run "npm run build" first.`);
  process.exit(1);
}
const xml = readFileSync(sitemapPath, 'utf8');

// Split into <url>...</url> blocks.
const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];

/** @type {Map<string, {loc: string, alternates: Map<string, string>}>} */
const pages = new Map();

for (const block of urlBlocks) {
  const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
  if (!locMatch) continue;
  const loc = locMatch[1];

  const alternates = new Map();
  const altRe = /<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\s*\/>/g;
  let m;
  while ((m = altRe.exec(block))) {
    alternates.set(m[1], m[2]);
  }
  pages.set(loc, { loc, alternates });
}

console.log(`Parsed ${pages.size} <url> entries with ${urlBlocks.length} total blocks.\n`);

let errors = 0;

for (const [loc, { alternates }] of pages) {
  for (const [hreflang, target] of alternates) {
    if (hreflang === 'x-default') continue; // x-default is not required to be reciprocal

    const targetPage = pages.get(target);
    if (!targetPage) {
      console.error(`✗ ${loc}\n    hreflang="${hreflang}" → ${target}  (target not found as a <loc> in the sitemap)`);
      errors++;
      continue;
    }

    // targetPage must have an alternate pointing back at `loc`.
    const backLink = [...targetPage.alternates.values()].includes(loc);
    if (!backLink) {
      console.error(`✗ ${loc}\n    hreflang="${hreflang}" → ${target}  (${target} does not link back)`);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log('✓ All hreflang alternates are reciprocal and resolve to a real <loc>.');
  process.exit(0);
} else {
  console.error(`\n${errors} hreflang issue(s) found.`);
  process.exit(1);
}
