# Fase 0 — Audit iniziale

Data: 2026-08-12
Branch: `seo/audit-completo`

## 1. Crawl e struttura del sito

- **Build pulita**: `npm run build` genera 97 route statiche senza errori (12 homepage locale, 12 pagine contatto, 9 pagine tematiche satellite, `/blog` + 23 articoli IT + traduzioni EN/DE, privacy ×12, sitemap.xml).
- **Sitemap reale**: 80 `<url>` con contenuto indicizzabile (generata dinamicamente da `src/app/sitemap.ts` a build time — non più il vecchio file statico `public/sitemap.xml`, rimosso correttamente).
- **hreflang**: verificato via script corretto sul sitemap fresco — **tutte le 80 entry sono reciproche e risolvono a un `<loc>` reale**. Nessun link hreflang rotto o unidirezionale.
- **Redirect**: `public/_redirects` è già stato costruito con cura chirurgica a partire da dati reali di Search Console (commenti nel file datati 2026-08-11, un giorno prima di oggi). Copre URL legacy del vecchio sito multipagina in tutte le lingue, mappati 1:1 alla destinazione più vicina — **nessuna catena di redirect** (ogni regola è diretta, un solo hop). Rimosso in passato un pattern catch-all `/lingua/*` che causava soft-404 su tutto il dominio: buona pratica già applicata.
- **Pagine satellite isolate dalla homepage (finding corretto e risolto in Fase 1)**: `/inverno`, `/estate`, `/famiglie`, `/benessere`, `/come-arrivare`, `/chi-siamo`, `/sauna-bagno-turco-privato-livigno`, `/camere-appartamento-livigno`, `/livigno-estate` — priorità 0.8 in sitemap. La formulazione originale di questo finding era imprecisa: **`Footer.tsx` linkava già tutte le 9 pagine dall'homepage `/it`** (array `itLandingPages`, presente da prima dell'audit, con link intenzionalmente omessi sulle altre 11 lingue perché il contenuto è IT-only). Il gap reale era solo nella **Nav** (barra di navigazione principale, desktop e mobile), dove le pagine satellite non comparivano affatto. Risolto aggiungendo un menu a tendina "Scopri" nella Nav desktop (`Nav.tsx`, tra "Posizione" e "Blog") e la stessa lista nel menu mobile (`MobileMenu.tsx`). Lista delle 9 pagine estratta in `src/data/satellite-pages.ts`, condivisa da Footer/Nav/MobileMenu per evitare tripla duplicazione.

Prima iterazione: dropdown visibile solo per `locale === 'it'` (stessa logica del footer, contenuto italiano-only). **Su richiesta esplicita dell'utente, esteso a tutte le 12 lingue** — il dropdown "Scopri" ora compare in Nav/MobileMenu per ogni locale, anche se le 9 pagine di destinazione restano contenuto solo in italiano (nessuna versione tradotta esiste). Nota per il futuro: questo introduce un'incoerenza volontaria — un visitatore che clicca "Scopri" dalla nav tedesca o giapponese atterra su una pagina interamente in italiano. Il Footer resta invece IT-only (non modificato, la richiesta riguardava solo la Nav). Build verificata pulita (97/97 pagine); confermato via grep sull'export che il link compare su tutti i 12 file `out/{locale}.html`.
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

## 5. Script di manutenzione: bug trovato e risolto (Fase 1)

`scripts/check-hreflang-reciprocity.mjs` puntava ancora a `public/sitemap.xml`, file che non esiste più (rimosso quando la sitemap è diventata dinamica). Andava in crash (`ENOENT`) se eseguito.

**Fix applicato**: script aggiornato per puntare a `out/sitemap.xml` (generato da `npm run build`), con un errore chiaro invece di un `ENOENT` criptico se la build manca. Rieseguito dopo il fix: `80 <url> entries`, **0 problemi** — hreflang tutto reciproco, confermando quanto già verificato manualmente in Fase 0.

## 6. Indicizzazione Google — dati reali da Search Console

Export "Copertura" fornito dall'utente (`ironwoodlivigno.com-Coverage-2026-08-12.zip`), dati aggiornati al 2026-08-07.

**Trend indicizzazione** (da `Grafico.csv`):

| Data | Non indicizzate | Indicizzate |
|---|---|---|
| 2026-05-15 | 48 | 14 |
| 2026-06-30 | 39 | 15 |
| 2026-07-01 | 166 | 99 |
| 2026-07-11 | 162 | 123 |
| 2026-08-07 | **199** | **142** |

Crescita reale e continua delle pagine indicizzate (14 → 142 in meno di 3 mesi), con un salto netto l'11 luglio accompagnato da un'impennata di impressioni giornaliere (da ~10-30 a 60-172/giorno) — coerente con l'espansione recente di contenuti (blog, traduzioni, pagine satellite). Buon segnale di trazione organica in corso.

**Pagine non indicizzate (199 totali) — breakdown per motivo** (da `Problemi critici.csv`, somma = 199, coerente col grafico):

| Motivo | Pagine | Sorgente | Stato convalida | Gravità |
|---|---|---|---|---|
| **Non trovata (404)** | **41** | Sito web | **Non riuscita** ⚠️ | **Alta — fix già tentato e fallito secondo Google** |
| Pagina alternativa con tag canonical appropriato | 82 | Sito web | Non iniziata | Bassa — normalmente non è un errore (duplicati/varianti che puntano correttamente a un canonical) |
| Esclusa per tag "noindex" | 10 | Sito web | Non iniziata | Da verificare — intenzionale? |
| Pagina con reindirizzamento | 40 | Sito web | Iniziata | Bassa — atteso, coerente con le ~80 regole in `_redirects` |
| Pagina scansionata ma non indicizzata | 18 | Google | Non iniziata | Media — possibile segnale di contenuto sottile/duplicato |
| Pagina duplicata, canonical scelto da Google diverso da quello dichiarato | 6 | Google | Non iniziata | Media — Google non si fida del canonical dichiarato su queste pagine |
| Errore del server (5xx) | 1 | Sito web | Non iniziata | Media — singola pagina, da identificare |
| Bloccata per accesso non autorizzato (403) | 1 | Sito web | Iniziata | Media — singola pagina, da identificare |

`Problemi non critici.csv` è vuoto — nessun problema non critico segnalato.

**Il finding più urgente**: i **41 errori 404** hanno stato di convalida **"Non riuscita"** — significa che in passato è già stato inviato un fix a Google ("Convalida la correzione" in Search Console) ma alla riverifica le pagine risultavano ancora 404. Considerando che `public/_redirects` copre già ~80 URL legacy con successo, questi 41 sono probabilmente URL scoperti *dopo* l'ultima validazione, oppure casi non coperti dalle regole attuali. **Serve l'elenco esatto degli URL** (Search Console → Indicizzazione → Pagine → clic su "Non trovata (404)" → tabella esportabile) per poterli mappare uno a uno in Fase 1, con lo stesso approccio chirurgico già usato per il resto del file.

Anche i **6 casi di canonical non rispettato da Google** meritano l'elenco URL: possono indicare un problema reale di contenuti troppo simili tra loro (es. tra pagine satellite e sezioni della homepage, un rischio già segnalato al punto 1).

**Core Web Vitals**: questo export è solo "Copertura/Indicizzazione", non contiene i dati di Segnali web essenziali. Serve un secondo export da Search Console → Esperienza → Segnali web essenziali (mobile + desktop), oppure il via libera a ritentare PageSpeed Insights.

### 6bis. Elenco completo dei 41 URL 404 (drilldown Search Console)

Ricevuto ed incrociato con `public/_redirects` attuale. Tre gruppi distinti:

**Gruppo A — già coperti da una regola esistente in `_redirects`** (Google mostra ancora 404 solo perché non ha ancora ripassato dall'ultima scansione, 2026-08-07/08): `/da/beliggenhed.html`, `/no/blog/index.html`, `/nl/locatie.html`, `/nl/privacybeleid.html`, `/da/saesoner.html`, `/en/apartment.html`, `/no/sesonger.html`, `/fr/avis.html`, `/en/seasons.html`, `/en/location.html`. → Nessuna azione, si risolvono da sole quando Google riscansiona (si può accelerare con "Convalida la correzione" in Search Console).

**Gruppo B — variante NON coperta, serve una nuova regola** (spesso è il gemello "senza .html" di una regola che esiste solo con ".html", o un URL mai mappato):

| URL rotto | Nuova regola proposta |
|---|---|
| `/cs/ochrana-soukromi` | → `/cs/privacy` |
| `/fr/reserver.html` | → `/fr#prenota` |
| `/home` | → `/it` |
| `/en/dove-siamo` | → `/en#posizione` |
| `/fr/avis` | → `/fr` |
| `/no/sesonger` | → `/no` |
| `/pl/sezony` e `/pl/sezony.html` | → `/pl` |
| `/de/jahreszeiten` | → `/de` |
| `/en/book` | → `/en#prenota` |
| `/nl/diensten` | → `/nl#esperienza` |
| `/it/contact` | → `/it/contatti` |
| `/pl/lokalizacja` | → `/pl#posizione` |
| `/appartamento` | → `/it#camere` |
| `/pl/polityka-prywatnosci` | → `/pl/privacy` |
| `/fr/saisons` | → `/fr` |
| `/nl/seizoenen` | → `/nl` |
| `/pl/apartament` | → `/pl#camere` |
| `/fr/blog/` (slash finale) | → `/blog` |
| `/nl/appartement` | → `/nl#camere` |
| `/en/apartment` | → `/en#camere` |
| `/da/faq` | → `/da` |
| `/en/prices.html` | → `/en#tariffe` |
| `/pl/rezerwacja` | → `/pl#prenota` |
| `/Ironwood_livigno` | → `/it` |

Target verificati contro `src/i18n/routing.ts` (contactSlugs reali per lingua) e gli id sezione reali nel codice (`#camere`, `#esperienza`, `#posizione`, `#prenota`, `#tariffe` — quest'ultimo per la tabella tariffe, non ovvio dal nome pagina "prices").

**Gruppo C — tutti con prefisso `www.`, sospetta falla nel redirect di zona Cloudflare** (non risolvibile da `_redirects`, che vede solo richieste già arrivate su apex): `www.ironwoodlivigno.com/home`, `/en/dove-siamo`, `/cs/dove-siamo`, `/en/photogallery`, `/it/home`, `/cs/prova`, `/cs/`. **Aggiornamento Fase 1 (2026-08-12)**: verificato live con `curl` tutti e 7 i path — **oggi redirigono tutti correttamente** (301 www→apex in un solo hop, poi 200 sulla destinazione finale). Il redirect di zona Cloudflare funziona come previsto; il finding era basato su dati Search Console già stale al momento dell'audit. Nessuna azione necessaria: si risolve da solo alla prossima scansione di Google (stesso meccanismo del Gruppo A sopra).

### 6ter. I 6 casi di canonical non rispettato (drilldown Search Console, Fase 1)

Export "Pagina duplicata, Google ha scelto una pagina canonica diversa da quella specificata dall'utente" (`ironwoodlivigno.com-Coverage-Drilldown-2026-08-12 (2).zip`), 6 URL:

| URL | Ultima scansione | Diagnosi |
|---|---|---|
| `www.ironwoodlivigno.com/en/prenota` | 2026-06-21 | www→apex ok (301, 1 hop), apex era un 404 nudo senza regola |
| `www.ironwoodlivigno.com/en/prova` | 2026-06-20 | idem |
| `www.ironwoodlivigno.com/de/prenota` | 2026-06-20 | idem |
| `www.ironwoodlivigno.com/de/dove-siamo` | 2026-06-18 | idem |
| `www.ironwoodlivigno.com/de/prova` | 2026-06-16 | idem |
| `ironwoodlivigno.com/pl/kontakt` | 2026-08-08 | pagina reale, **non un problema di redirect** — vedi sotto |

**5 su 6 sono lo stesso pattern del Gruppo C** (punto 6bis): scansionati a metà giugno, con prefisso `www.`, ben prima che esistesse il redirect di zona www→apex. Verificato live: oggi `www.` fa già 301 pulito verso apex in un solo hop, ma l'apex di destinazione non aveva nessuna regola in `_redirects` e cadeva su un 404 nudo — quindi Google, alla prossima scansione, vedrebbe un redirect che porta a un vicolo cieco. Aggiunte le 5 regole mancanti (`/en/prenota`, `/en/prova`, `/de/prenota`, `/de/dove-siamo`, `/de/prova`), stessa convenzione delle regole apex-only già esistenti (`/prenota`, `/prova`, `/dove-siamo`). Nessuna necessità di intervenire lato Cloudflare: il redirect di zona funziona già correttamente (vedi aggiornamento Gruppo C sopra).

**`/pl/kontakt` è un caso diverso**: pagina viva, scansionata di recente (8 agosto), risponde 200, e dichiara correttamente `<link rel="canonical" href="https://ironwoodlivigno.com/pl/kontakt"/>` — non c'è nulla di rotto nel markup. Google sta comunque scegliendo un altro URL come rappresentante. Cause più probabili:
- Le 12 pagine di contatto (`/{locale}/{contactSlug}`) condividono lo stesso template (`src/app/[locale]/[contactSlug]/page.tsx`) e differiscono soprattutto per stringhe tradotte — contenuto strutturalmente molto simile tra le lingue è la causa più comune di questo tipo di consolidamento lato Google, ed è generalmente considerato normale/a bassa severità quando l'hreflang è corretto (verificato in Fase 0: tutte le 80 entry sono reciproche).
- Il dato grezzo dell'export non include la colonna "canonical scelto da Google" (visibile solo aprendo il dettaglio del singolo URL in Search Console → Ispeziona URL), quindi non posso confermare quale pagina Google stia effettivamente preferendo senza quel dato aggiuntivo.

**Nessuna azione di codice consigliata su `/pl/kontakt`** salvo che tu veda un impatto reale su traffico/posizionamento per quella pagina — in tal caso vale la pena aprire "Ispeziona URL" su di essa in Search Console per vedere il canonical scelto da Google e valutare se differenziare maggiormente il contenuto.

### 6quater. L'unica pagina in errore 5xx (drilldown Search Console, Fase 1)

Export "Errore del server (5xx)" (`ironwoodlivigno.com-Coverage-Drilldown-2026-08-12 (3).zip`), 1 URL: `http://www.ironwoodlivigno.com/`, ultima scansione **2026-07-30** (13 giorni prima dell'audit).

Nota già dall'URL stesso: **HTTP** (non HTTPS) su **www** — la combinazione meno comune, quella con più hop di normalizzazione da attraversare. Verificato live (3 tentativi ripetuti): oggi risolve sempre pulito, `200` finale dopo una catena di 2 redirect entrambi a livello di infrastruttura Cloudflare (non gestiti da `public/_redirects`, che accetta solo path relativi):

```
http://www.ironwoodlivigno.com/  → 301 → https://www.ironwoodlivigno.com/  → 301 → https://ironwoodlivigno.com/  (200)
```

Nessun 5xx riprodotto. Diagnosi: probabile blip transitorio del 30 luglio (deploy, cold start del Worker, o simile) già superato — stesso pattern "dato Search Console stale" già visto per il Gruppo C e per 5 dei 6 casi di canonical. Nessuna azione di codice necessaria.

Unica osservazione non urgente: la catena è a 2 hop (HTTP→HTTPS, poi www→apex) invece di 1, perché sono due redirect di zona Cloudflare distinti. Accorciarla a un solo hop richiederebbe una configurazione lato dashboard Cloudflare (una singola Redirect Rule che normalizza schema e host insieme) — fuori dalla portata del codice in questo repo, e comunque non un problema segnalato altrove nell'audit.

### 6quinquies. L'unica pagina bloccata 403 (drilldown Search Console, Fase 1)

Export "Bloccata a causa di un accesso non autorizzato (403)" (`ironwoodlivigno.com-Coverage-Drilldown-2026-08-12 (5).zip`), 1 URL: `https://www.ironwoodlivigno.com/cs/prenota`, ultima scansione **2026-06-15** — stesso pattern stale già visto per Gruppo C, 5xx e 5 dei 6 casi di canonical.

Verificato live: `www.ironwoodlivigno.com/cs/prenota` → 301 pulito verso l'apex (1 hop), ma l'apex `/cs/prenota` non aveva nessuna regola in `_redirects` e cadeva su un 404 nudo (probabile causa del 403 osservato da Google a metà giugno su un'infrastruttura diversa da quella attuale). Aggiunta la regola mancante `/cs/prenota → /cs#prenota`, stessa convenzione di `/en/prenota` e `/de/prenota` già chiuse nel punto 6ter. Build e check hreflang rieseguiti dopo la modifica: puliti.

### 6sexies. Le 18 pagine scansionate ma non indicizzate (drilldown Search Console, Fase 1)

Export "Pagina scansionata, ma attualmente non indicizzata" (`ironwoodlivigno.com-Coverage-Drilldown-2026-08-12 (6).zip`), 18 URL. A differenza di tutti i gruppi precedenti, qui non è un problema di redirect — sono due categorie diverse per natura.

**10 URL legacy (scansionati tra il 2026-02-12 e il 2026-04-07)** — le date più vecchie viste finora nell'intero audit, precedenti a praticamente tutto il lavoro fatto su `_redirects`:

| URL | Stato live (2026-08-12) | Azione |
|---|---|---|
| `www.ironwoodlivigno.com/sauna` | apex 404, nessuna regola | **Fix**: `/sauna → /sauna-bagno-turco-privato-livigno` |
| `www.ironwoodlivigno.com/en/sauna` | apex 404, nessuna regola | **Fix**: `/en/sauna → /sauna-bagno-turco-privato-livigno` (pagina satellite più vicina, anche se IT-only) |
| `www.ironwoodlivigno.com/it/photogallery` | apex 404, nessuna regola | **Fix**: `/it/photogallery → /it` |
| `www.ironwoodlivigno.com/it/dove-siamo` | apex 404, nessuna regola | **Fix**: `/it/dove-siamo → /it#posizione` |
| `www.ironwoodlivigno.com/contatti?l=en` | 200, già risolve via regola `/contatti` esistente | Nessuna azione |
| `www.ironwoodlivigno.com/contatti?l=it` | 200, idem | Nessuna azione |
| `www.ironwoodlivigno.com/it/contatti` | 200, pagina reale corrente | Nessuna azione |
| `www.ironwoodlivigno.com/photogallery?l=it` | 200, già risolve via regola `/photogallery` esistente | Nessuna azione |
| `www.ironwoodlivigno.com/dove-siamo?l=it` | 200, già risolve via regola `/dove-siamo` esistente | Nessuna azione |
| `www.ironwoodlivigno.com/home?l=it` | 200, già risolve via regola `/home` esistente | Nessuna azione |

Aggiunte le 4 regole mancanti. Le altre 6 (varianti con query string `?l=...`) già passano correttamente attraverso le regole esistenti — la query string sopravvive al redirect ma non ha alcun effetto funzionale sul sito (nessun codice legge quel parametro).

**8 URL di contenuto reale e attuale** (articoli blog + `/ja/contact`), tutti live e rispondono `200` — qui non c'è nulla da reindirizzare, il problema (se c'è) è editoriale, non tecnico:

- **5 articoli del blog** (`natale-capodanno-a-livigno`, `migliori-piste-sci-livigno-famiglie`, `quanto-costa-sciare-a-livigno-guida-prezzi` IT+EN, `carosello-3000-vs-mottolino-quale-scegliere/en`, più le versioni IT già in indice) risultano **pubblicati il 2026-08-03/06** — scansionati da Google appena 1-2 giorni dopo (7-8 agosto), 6-9 giorni prima di questo audit. È il ritardo fisiologico tra prima scansione e decisione di indicizzazione, non un segnale di contenuto sottile: coerente con il trend di crescita reale dell'indicizzazione già documentato al punto 6 (14→142 pagine in 3 mesi). Nessuna azione consigliata, da ricontrollare tra qualche settimana se restano fuori indice.
- **`/ja/contact`**: verificato che la dimensione della pagina (69 KB) è paragonabile a `/en/contact` (63 KB) — non è contenuto sottile. Stessa causa già ipotizzata per `/pl/kontakt` nel punto 6ter: le 12 pagine di contatto condividono template e differiscono solo per traduzione, e Google talvolta ne "assorbe" una nel cluster invece di indicizzarla separatamente. Nessuna azione di codice consigliata.

Build e check hreflang rieseguiti dopo le modifiche: puliti.

**Con questo, tutti i finding della Fase 0 con dato reale disponibile sono chiusi.**

## 7. Core Web Vitals (PageSpeed Insights)

Ho provato a interrogare l'API pubblica di PageSpeed Insights su `/it`, `/inverno`, `/camere-appartamento-livigno` (mobile) ma sono stato rate-limitato (HTTP 429) dopo pochi tentativi — l'API pubblica senza chiave ha una quota condivisa molto bassa. Due strade, a tua scelta:
1. Ti fornisco il report Search Console Core Web Vitals (punto 6) come dato reale sugli utenti (più affidabile dei dati lab di PSI).
2. Riprovo PageSpeed Insights più avanti con richieste distanziate nel tempo, oppure se hai una API key Google (gratuita) la uso per bypassare il rate limit.

## Riepilogo priorità emerse dalla Fase 0

| Priorità | Finding | Fase di intervento |
|---|---|---|
| Alta | ~~41 pagine 404 in Search Console con convalida "Non riuscita"~~ — 25 nuove regole redirect aggiunte (gruppo B) | ✅ Fase 1 |
| Alta | ~~Pagine satellite (9, priorità 0.8) non linkate da Nav della homepage~~ — dropdown "Scopri" aggiunto in Nav/MobileMenu, tutte e 12 le lingue | ✅ Fase 1 |
| Alta | ~~Script `check-hreflang-reciprocity.mjs` rotto~~ — fixato, punta a `out/sitemap.xml` | ✅ Fase 1 |
| Media | ~~6 pagine dove Google sceglie un canonical diverso~~ — 5/6 erano il Gruppo C (www, redirect ora funzionante ma mancava la regola apex, aggiunta); 1/6 (`/pl/kontakt`) è contenuto duplicato tra i 12 template di contatto, probabilmente benigno | ✅ Fase 1 |
| Media | ~~18 pagine scansionate ma non indicizzate~~ — 10 legacy (4 avevano bisogno di una regola, aggiunta), 8 contenuto reale (5 articoli appena pubblicati, `/ja/contact` benigno come `/pl/kontakt`) | ✅ Fase 1 |
| Media | Pagine satellite solo in italiano nonostante mercati target multilingua | Fase 2 / Fase 5 |
| Media | Core Web Vitals non ancora misurati (serve secondo export Search Console o retry PSI) | Fase 9 |
| Bassa | `CF_ANALYTICS_TOKEN` in `src/app/[locale]/layout.tsx` è ancora il placeholder — nessun analytics attivo | Fase 11 |
| Bassa | ~~1 pagina in errore 5xx~~ — verificato live, dato stale del 30/07, oggi risolve pulito (200) | ✅ Fase 1 |
| Bassa | ~~1 pagina bloccata 403~~ — `/cs/prenota`, stesso pattern www stale, regola redirect aggiunta | ✅ Fase 1 |
| — | hreflang: **nessun problema**, tutto reciproco | — |
| — | Redirect: **nessuna catena**, mapping legacy già curato con dati reali Search Console | — |
| — | robots.txt / llms.txt: **già ben configurati**, buona base per GEO | — |
| — | Build: **pulita**, 97/97 pagine generate senza errori | — |
| — | Indicizzazione in crescita reale: 14→142 pagine indicizzate e impressioni in salita da maggio ad oggi | — |

## Cosa mi serve da te per chiudere la Fase 0

1. Dati Copertura/Indicizzazione da Search Console (punto 6).
2. Dati Core Web Vitals reali da Search Console, oppure via libera a ritentare PageSpeed Insights più tardi (punto 7).

Con questi due elementi la Fase 0 è completa. Vuoi che nel frattempo proceda con la **Fase 1 (SEO tecnica)** sui punti già verificabili da codice, o preferisci fornire prima questi dati?
