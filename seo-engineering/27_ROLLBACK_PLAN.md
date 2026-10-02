# 27 — Rollback plan

## Fast rollback (seconds): previous Worker version

Cloudflare keeps every deployed version. Version before this specification's changes: **0b79a544-a2d7-4578-98f7-c8241594eb70** (offer pop-up with 7 weekends).

```
npx wrangler deployments list
npx wrangler rollback 0b79a544-a2d7-4578-98f7-c8241594eb70
```

Versions deployed during this work (newest last): `0f36d649…` (facts, VacationRental, at-a-glance, CLS fix, llms.txt), `e615029d…` (related guides), then the final release (see `25_TEST_RESULTS.md`).

Note: a rollback restores pages and Worker code; KV data (offer, photos, layout) is not touched.

## Code rollback (git)

Each change set is a separate commit on `main` (see `24_SEO_CHANGELOG.md`). To undo one: `git revert <commit>` → `npm run build` → `npm run deploy` (the SEO gate still runs).

## What to check after a rollback

`npm run audit:live` (expects 0 P0/P1), then `npm run indexnow`. No URL was created, removed or redirected by this work, so a rollback cannot produce 404s or redirect changes.
