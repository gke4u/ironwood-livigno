# 19 — Local SEO audit

## Official NAP (from property-facts.json)

| Field | Value |
|---|---|
| Name | **Ironwood Livigno** |
| Address | Via Saroch 767, 23041 Livigno (SO), Italia |
| Phone / WhatsApp | +39 0342 929285 |
| Email | info@ironwoodlivigno.com |
| Website | https://ironwoodlivigno.com |
| Coordinates | 46.525061, 10.126967 (owner's Google Maps pin) |
| National ID | CIN IT014037C274OJ27T8 |

On the site the NAP is identical on every page (footer of all 361 URLs, contact pages in 12 languages, JSON-LD). **2026-10-02:** the owner confirmed the street number is **767**; the site had 771 everywhere (footer, contact, JSON-LD, privacy, llms files, 12 languages) and was corrected the same day. Google Business Profile already shows 767 (owner, 2026-10-02); still to check: Airbnb and Holidu.

## Consistency across the web (evidence: web searches 2026-10-02)

| Source | What it shows | Conflict | Action (who) |
|---|---|---|---|
| Google Business Profile | Linked from the site (reviews section, CID) | — | Now also in JSON-LD `sameAs` |
| **livigno.eu** (official tourism portal) | "Appartamenti Iron Wood", Via Saroch 767, star classification | **Name differs** (address matches) | Owner: ask APT Livigno to show "Ironwood Livigno" and a link to ironwoodlivigno.com |
| Expedia (Holidu syndication) | "Holiday Apartment Iron Wood Near Slopes With 2 Balconies Wi-Fi" — "direct access to the ski slopes" | Name variant; **ski access overstated** | Owner: edit the Holidu listing title/description ("Ironwood Livigno", "about 100 m on foot from the lifts") |
| Holidu / livigno.eu | "grocery shop 20 m, 2 supermarkets 80 m" | Not on the site | Owner to confirm → then add to location points |
| Airbnb | Listing linked in `sameAs` | — | Keep name "Ironwood Livigno" in the title |
| Instagram | @ironwood_livigno | — | Bio: add "Via Saroch 767, Livigno" + site link |

Naming rule (spec 54): the official name is **Ironwood Livigno**. Do not use "Iron Wood", "Appartamenti Iron Wood", "Ironwood Apartment" or "Casa IronWood" on new listings.

## Local relations used on the site (verified only)

Ironwood → Via Saroch → about 100 m on foot to the San Rocco ski lift (linked on skis to Carosello 3000), Doss 18 lift ~200 m, Carosello 3000 ~400 m (owner, 2026-10-02) → ski school and ski/bike rental ~50 m → pedestrian duty-free centre ~15 min on foot → Lago di Livigno, cycling and hiking (summer guides). Not used: "ski-in/ski-out" (not true).

## Citations / digital PR (spec 52–53) — quality over quantity

| Opportunity | Relevance | Status |
|---|---|---|
| livigno.eu listing correction + website link | official, highest | Owner |
| 5 ski schools / rentals in Via Saroch (emails ready in `seo-audit/fase-11-outreach-scuole-sci.md`) | local, real neighbours | Owner, mid-October |
| Google Business posts (texts in `testi-google-business-profile.md`, phone numbers removed) | local pack | Owner |
| Valtellina / Lombardy tourism directories (in-lombardia.it lists Livigno properties) | regional | Optional |
| livignoitaly.it / livignoitaly.eu (local apartment directory with a "sauna" filter; ranks for Italian queries) | local, vertical | Owner — free listing request |
| snowplaza.nl (Dutch ski portal, ranks for "appartement Livigno …") | NL market | Owner |
| yesalps.com (Valtellina lodging directory) | regional | Optional |

Listing texts seen on Holidu and Airbnb (31_REVIEW_ANALYSIS.md): "Eisenholz" (German translation of the name), "Iron Wood", "85–90 m²", "direct access to the slopes" → align with the site.

No paid links, no directory spam. Backlink data (referring domains) was not available in this session — needs Search Console "Links" report or an SEO tool.
