# Fase 0 — Audit iniziale

Data: 2026-08-12
Branch: `seo/audit-completo`

## 1. Crawl e struttura del sito

- **Build pulita**: `npm run build` genera 97 route statiche senza errori (12 homepage locale, 12 pagine contatto, 9 pagine tematiche satellite, `/blog` + 23 articoli IT + traduzioni EN/DE, privacy ×12, sitemap.xml).
- **Sitemap reale**: 80 `<url>` con contenuto indicizzabile (generata dinamicamente da `src/app/sitemap.ts` a build time — non più il vecchio file statico `public/sitemap.xml`, rimosso correttamente).
- **hreflang**: verificato via script corretto sul sitemap fresco — **tutte le 80 entry sono reciproche e risolvono a un `<loc>` reale**. Nessun link hreflang rotto o unidirezionale.
- **Redirect**: `public/_redirects` è già stato costruito con cura chirurgica a partire da dati reali di Search Console (commenti nel file datati 2026-08-11, un giorno prima di oggi). Copre URL legacy del vecchio sito multipagina in tutte le lingue, mappati 1:1 alla destinazione più vicina — **nessuna catena di redirect** (ogni regola è diretta, un solo hop). Rimosso in passato un pattern catch-all `/lingua/*` che causava soft-404 su tutto il dominio: buona pratica già applicata.
- **Pagine satellite isolate dalla homepage**: `/inverno`, `/estate`, `/famiglie`, `/benessere`, `/come-arrivare`, `/chi-siamo`, `/sauna-bagno-turco-privato-livigno`, `/camere-appartamento-livigno`, `/livigno-estate` — priorità 0.8 in sitemap, quindi pensate come pagine SEO importanti — **non hanno alcun link diretto da Nav o Footer della homepage in nessuna delle 12 lingue**. Sono ben interlinkate tra loro (footer condiviso `BlogFooter`) e dal blog (i 23 articoli linkano generosamente verso di esse), ma per raggiungerle da una homepage locale serve passare per `/blog` → un articolo → la pagina satellite (2-3 click). Questo è un gap di link-equity interno reale: le pagine con priorità più alta nella sitemap non ricevono link diretti dalla pagina che riceve più traffico e autorità (l'homepage). Da affrontare in Fase 1/3.
- **Contenuto solo italiano**: le 9 pagine satellite sono Italian-only per scelta di design (fuori dall'albero `[locale]`). Dato il target multi-mercato (DE/EN/FR/altri), è un limite di copertura internazionale su pagine tematiche ad alta priorità — da valutare in Fase 2/5 se tradurle o mantenerle come hub IT-only con link dal blog tradotto.
- **Nessuna pagina orfana in senso stretto**: ogni pagina della sitemap è raggiungibile via link interni (anche se con distanza variabile dalla homepage).

## 2. robots.txt

Verificato in produzione (`https://ironwoodlivigno.com/robots.txt`):
- `User-agent: *` → `Allow: /`, nessun `Disallow`.
- Bot AI esplicitamente autorizzati: GPTBot, ChatGPT-User, OAI-SearchBot (OpenAI), ClaudeBot, Claude-User, anthropic-ai (Anthropic), PerplexityBot, Perplexity-User, cohere-ai, Google-Extended, Applebot-Extended, CCBot, Bytespider, Meta-ExternalAgent, Amazonbot.
- Riferimento `Sitemap: https://ironwoodlivigno.com/sitemap.xml` presente e corretto.
- **Nessun blocco involontario** di CSS/JS/immagini rilevato.

Buona base per la Fase 7 (GEO) — la scelta di autorizzare esplicitamente tutti i bot AI è già coerente con l'obiettivo di citabilità.

## 3. sitemap.xml

- Generato dinamicamente a build time da `src/app/sitemap.ts`, non più hand-maintained — elimina il rischio (già occorso in passato, vedi commento nel codice: "sitemap last submitted 2026-07-08, missing every post and translation added since") di sitemap che va stale.
- Include immagini (`<image:image>`) sulla homepage IT e sulle pagine satellite/blog.
- **Le pagine satellite non hanno alternates cross-lingua** (solo `it` + `x-default` su sé stesse) — coerente con l'essere IT-only, ma da rivedere se si decide di tradurle.

## 4. llms.txt

Presente e ben strutturato (`https://ironwoodlivigno.com/llms.txt`): riepilogo fattuale di prodotto (90 m², 3 camere, 6 ospiti, sauna+bagno turco privati, 100 m dagli impianti), indirizzo, contatti, rating (5.0/5, 28 recensioni), stagionalità, e link a 6 articoli guida. Buona base già presente per la Fase 7 — da rafforzare con blocchi FAQ diretti più estesi come richiesto dal piano.

## 5. Script di manutenzione: bug trovato

`scripts/check-hreflang-reciprocity.mjs` punta ancora a `public/sitemap.xml`, **file che non esiste più** (rimosso quando la sitemap è diventata dinamica). Lo script va in crash (`ENOENT`) se eseguito oggi:
```
Error: ENOENT: no such file or directory, open '...\public\sitemap.xml'
```
Ho verificato manualmente la reciprocità hreflang contro `out/sitemap.xml` (generato da una build fresca): **tutto corretto**, ma lo script di controllo automatico è rotto e va aggiornato per puntare a `out/sitemap.xml` post-build (o essere eseguito dopo `npm run build`). Fix semplice, da includere in Fase 1.

## 6. Indicizzazione Google — serve il tuo aiuto

Non ho accesso diretto al tuo account Search Console. La ricerca `site:ironwoodlivigno.com` via strumento di ricerca generico non ha restituito risultati attendibili (probabilmente perché non supporta l'operatore `site:` in modo affidabile, non perché il sito non sia indicizzato). Per completare questo punto della Fase 0 mi servirebbe che tu condivida (screenshot o copia-incolla):
- Search Console → **Copertura/Indicizzazione delle pagine**: quante pagine indicizzate vs escluse, e i motivi di esclusione se presenti.
- Search Console → **Esperienza → Core Web Vitals**: stato mobile/desktop (URL "Good"/"Need improvement"/"Poor").

## 7. Core Web Vitals (PageSpeed Insights)

Ho provato a interrogare l'API pubblica di PageSpeed Insights su `/it`, `/inverno`, `/camere-appartamento-livigno` (mobile) ma sono stato rate-limitato (HTTP 429) dopo pochi tentativi — l'API pubblica senza chiave ha una quota condivisa molto bassa. Due strade, a tua scelta:
1. Ti fornisco il report Search Console Core Web Vitals (punto 6) come dato reale sugli utenti (più affidabile dei dati lab di PSI).
2. Riprovo PageSpeed Insights più avanti con richieste distanziate nel tempo, oppure se hai una API key Google (gratuita) la uso per bypassare il rate limit.

## Riepilogo priorità emerse dalla Fase 0

| Priorità | Finding | Fase di intervento |
|---|---|---|
| Alta | Pagine satellite (9, priorità 0.8) non linkate da Nav/Footer della homepage in nessuna lingua | Fase 1 / Fase 3 |
| Alta | Script `check-hreflang-reciprocity.mjs` rotto (punta a file inesistente) | Fase 1 |
| Media | Pagine satellite solo in italiano nonostante mercati target multilingua | Fase 2 / Fase 5 |
| Media | Core Web Vitals non ancora misurati in questa sessione (serve Search Console o retry PSI) | Fase 9 |
| Bassa | `CF_ANALYTICS_TOKEN` in `src/app/[locale]/layout.tsx` è ancora il placeholder — nessun analytics attivo | Fase 11 |
| — | hreflang: **nessun problema**, tutto reciproco | — |
| — | Redirect: **nessuna catena**, mapping legacy già curato con dati reali Search Console | — |
| — | robots.txt / llms.txt: **già ben configurati**, buona base per GEO | — |
| — | Build: **pulita**, 97/97 pagine generate senza errori | — |

## Cosa mi serve da te per chiudere la Fase 0

1. Dati Copertura/Indicizzazione da Search Console (punto 6).
2. Dati Core Web Vitals reali da Search Console, oppure via libera a ritentare PageSpeed Insights più tardi (punto 7).

Con questi due elementi la Fase 0 è completa. Vuoi che nel frattempo proceda con la **Fase 1 (SEO tecnica)** sui punti già verificabili da codice, o preferisci fornire prima questi dati?
