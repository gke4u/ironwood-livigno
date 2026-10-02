# 22 — Security audit

Checked live on 2026-10-02 (`curl -I` on /it, /inverno, a blog post, /de/kontakt).

| Check | Result |
|---|---|
| HTTPS | ✅ all URLs; `http://` → 301 to `https://` |
| HSTS | ✅ `max-age=63072000; includeSubDomains; preload` |
| Content-Security-Policy | ✅ `default-src 'self'`, explicit allow-list (Cloudflare Insights, Open-Meteo, form endpoint, Holidu/Google/Lapentor frames), `frame-ancestors 'self'`, `object-src 'none'`, `upgrade-insecure-requests` |
| X-Content-Type-Options | ✅ nosniff |
| X-Frame-Options | ✅ SAMEORIGIN |
| Referrer-Policy | ✅ strict-origin-when-cross-origin |
| Permissions-Policy | ✅ camera, microphone, geolocation disabled |
| Mixed content | ✅ none (audit: no `http://` resources) |
| Admin area | `/admin` and `/api/admin/*` behind login (Worker), `X-Robots-Tag: noindex` on private routes |
| Secrets | Stored as Wrangler secrets; none in the repository or in the static output |
| Source maps | Not published in `out/` |
| Forms | Honeypot + minimum fill time + privacy consent; no data stored in the browser |
| Dependencies | Next.js 15.5.26; `npm audit` not part of this review |

Notes:
- CSP keeps `'unsafe-inline'` for scripts and styles (required by the static Next.js export and JSON-LD). Moving to nonces would need a server-rendered setup — not worth the risk for a static site.
- `http://www.` takes 2 hops (http→https, then www→apex). Fix in one hop with a Cloudflare zone Redirect Rule (dashboard, not in the repo). P3.
