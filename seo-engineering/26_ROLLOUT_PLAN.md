# 26 — Rollout plan and roadmap

Every deploy goes through the same gate: `npm run build` → `npm run deploy` (runs `predeploy` = `npm run test:seo` first) → `npm run audit:live` → `npm run indexnow`.

## Done (2026-10-02)

Phase 1 (technical foundation), Phase 2 (international: hreflang and x-default), Phase 3 (entity: fact DB, VacationRental JSON-LD, CIN, sameAs), Phase 5 (GEO: at-a-glance block, llms.txt, 150-question test set), part of Phase 4 (topic clusters via "Leggi anche") and Phase 7 (CLS).

## Next phases

| Phase | Work | Owner | Depends on |
|---|---|---|---|
| 4 Content | Add confirmed local facts (grocery 20 m, supermarkets 80 m, name of nearest lift) | Claude after owner confirmation | owner |
| 4 Content | Publish seasonal "from" prices → `rates.ts` → Offer JSON-LD | Claude | owner prices |
| 4 Content | Native-speaker review: de, pl, cs, da, no, nl, zh, ja (use `localization-glossary.json`) | translators | budget |
| 6 Authority / local | Correct livigno.eu listing (name, Via Saroch **771**, website link) | owner | — |
| 6 Authority / local | Fix Holidu title/description ("Ironwood Livigno", "about 100 m on foot", no "direct access to slopes") — syndicates to Expedia | owner | — |
| 6 Authority / local | Ski-school outreach emails (mid-October), Google Business posts | owner | — |
| 7 Performance | LCP experiments (critical CSS inline / font strategy), ≥5 runs before/after | Claude | — |
| 8 CRO | Click-event counting (WhatsApp, email, form, tour, map) in the existing beacon | Claude | owner OK |
| 9 Monitoring | Monthly: `npm run audit:live`, GEO set, Lighthouse 4 pages, Search Console (coverage, queries, CWV) | Claude + owner | GSC access |

## Search Console tasks (owner, needs login)

1. Submit `https://ironwoodlivigno.com/sitemap.xml` again (lastmod changed on all pages).
2. URL inspection → request indexing for /it, /en, /de.
3. After 4–6 weeks: Performance report by query/country → feed real queries into `15_KEYWORD_INTENT_MAP.csv` (striking distance, high-impression/low-CTR).
