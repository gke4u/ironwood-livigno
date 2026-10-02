# 21 — Conversion (CRO) audit

Booking model: **direct availability request** (form that opens WhatsApp with the message ready, WhatsApp, email). No online payment or instant booking on the site — intentional.

## CTA inventory (homepage, all 12 languages)

| CTA | Where | Works | Note |
|---|---|---|---|
| "Richiedi disponibilità" (hero) | above the fold | ✅ anchor `#prenota` | primary |
| Booking section form | `#prenota` | ✅ labels, validation, honeypot, privacy consent | dates, guests, extras |
| Sticky WhatsApp button | every page, bottom right | ✅ pre-filled message per language | |
| Offer pop-up | after 5 s visible, every visit; reopen pill | ✅ (tested 2026-10-02 on 360×640 and desktop) | price visible without scrolling on phones |
| Blog "Verifica disponibilità" | end of every article | ✅ | |
| Contact pages | 12 languages | ✅ email / phone / WhatsApp / form | |

## CTA ↔ intent matching (spec 45)

| Intent | Landing | CTA shown |
|---|---|---|
| where to stay / accommodation | home, /camere-… | availability request |
| price | /blog/quanto-costa-…, home rates | availability request (no published rates) |
| sauna | /sauna-bagno-turco-privato-livigno | availability request |
| near Carosello | /inverno, home location | availability request + map |
| book | home `#prenota`, offer pop-up | form / WhatsApp |

## Trust elements (spec 99)

Real photos (gallery, rooms, 360° tour), 51 real reviews with platform links, hosts page (Francesco and family), full address + CIN in every footer, map, clear extras pricing (breakfast €15, e-bike €35). **Missing:** published nightly rates and cancellation terms in detail (FAQ says "partial refund before a deadline").

## Measurement (spec 73)

Available: page views and referrer host per day (internal beacon `/api/visita`, no cookies, no IP) + Cloudflare Web Analytics. **Not available:** click events (whatsapp_click, email_click, form submit, tour_open, map_open).

Recommendation (Phase 8, not implemented — needs a decision on what to count): extend the existing beacon with an event name (`?e=whatsapp|email|form|tour|map`), counted per day in the same Durable Object, no personal data.

## Findings

| ID | Finding | Severity |
|---|---|---|
| CRO-1 | No published prices: price-intent visitors must ask | P2 (owner decision) |
| CRO-2 | No click-event measurement | P2 |
| CRO-3 | Cancellation policy vague | P3 (owner decision) |
