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

Page views and referrer host per day (beacon `/api/visita`) + Cloudflare Web Analytics, and **since 2026-10-02 contact events**: `POST /api/evento?e=whatsapp|email|phone|form|tour|map` → table `events (day, kind, path, n)` in the same Durable Object. No cookie, no IP, no visitor id, nothing typed in the form (spec 73: no PII).

| Event (spec 73) | Implemented as | Trigger |
|---|---|---|
| whatsapp_click | `whatsapp` | any `wa.me` link on any page (one capture listener in OfferPopup, mounted site-wide) |
| email_click | `email` | any `mailto:` link |
| phone_click | `phone` | any `tel:` link |
| availability_submit / booking_start | `form` | request form sent successfully (not the honeypot path) |
| tour_open | `tour` | 360° tour poster clicked |
| map_open | `map` | map consent button clicked |
| booking_complete | — | happens off-site (WhatsApp/email); not measurable on the site |

Admin → Visite: "Contatti e azioni (30 giorni)" and "Da quali pagine partono i contatti". Tested locally with Playwright (all kinds recorded, 204 responses; unknown kinds ignored).

## Findings

| ID | Finding | Severity |
|---|---|---|
| CRO-1 | No published prices: price-intent visitors must ask | P2 (owner decision) |
| CRO-2 | No click-event measurement | P2 → **fixed 2026-10-02** |
| CRO-3 | Cancellation policy vague | P3 (owner decision) |
