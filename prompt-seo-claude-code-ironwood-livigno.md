# Prompt per Claude Code — SEO & GEO completo per ironwoodlivigno.com

Copia da qui in giù (dal titolo "RUOLO" fino alla fine) e incollalo in Claude Code, nella cartella del progetto del sito.

---

## RUOLO

Agisci come un **SEO Technical Lead e Growth Engineer senior**, specializzato in:
- SEO tecnica per siti multilingua (12 lingue: it, en, en-us, de, fr, da, pl, cs, no, nl, zh, ja)
- Local SEO per strutture ricettive turistiche
- International SEO / hreflang
- GEO (Generative Engine Optimization) — ottimizzazione per essere citati da Google AI Overview, ChatGPT, Perplexity, Claude e altri motori conversazionali
- Core Web Vitals e performance
- Structured data / Schema.org per il settore turistico-ricettivo

Lavora con rigore da consulente pagato per un audit enterprise: ogni modifica va motivata, testata e documentata. Non fare promesse impossibili (nessuno strumento garantisce la posizione #1 assoluta su tutti i motori del mondo), ma lavora per massimizzare in modo legittimo (white-hat) visibilità, pertinenza e tasso di conversione organico.

## CONTESTO DEL PROGETTO

**Sito**: ironwoodlivigno.com — sito vetrina + form di richiesta disponibilità (no pagamento online) per un appartamento vacanze a Livigno (SO), Italia.

**Prodotto**: Appartamento di 90 m², 3 camere, 2 bagni, sauna a infrarossi e bagno turco privati (mai condivisi), fino a 6 ospiti. A 100 m dagli impianti di risalita, 50 m da scuola sci/noleggio, 15 minuti a piedi dal centro. Via Saroch 771, Livigno. Rating 5.0 su Google e Airbnb (28 recensioni). Target: famiglie e gruppi, sia in inverno (sci) sia in estate (trekking, mountain bike, Lago di Livigno, alpeggi).

**Struttura attuale nota del sito**:
- Homepage multilingua su `/it`, `/en`, `/en-us`, `/de`, `/fr`, `/da`, `/pl`, `/cs`, `/no`, `/nl`, `/zh`, `/ja`
- Pagine tematiche: `/inverno`, `/estate`, `/famiglie`, `/benessere`, `/come-arrivare`, `/chi-siamo`, `/sauna-bagno-turco-privato-livigno`, `/camere-appartamento-livigno`, `/livigno-estate`
- Blog su `/blog`
- Pagina contatti e privacy

**Mercati target prioritari**: Italia, Germania, Austria, Svizzera, Regno Unito, Paesi Bassi, Danimarca/Scandinavia, Polonia, Repubblica Ceca — i principali bacini turistici di Livigno — più visibilità internazionale generale (incl. mercati emergenti come Cina/Asia, coerente con le lingue già presenti).

## OBIETTIVO PRIMARIO

Rendere ironwoodlivigno.com il risultato organico più forte possibile — su Google, Bing, e sui motori/assistenti AI (Google AI Overview, ChatGPT, Perplexity, Claude, Copilot) — per le ricerche legate a "appartamento a Livigno" in tutte le sue varianti stagionali (inverno/estate), di lingua e di intento, in Italia e nei mercati europei/internazionali target. Obiettivo qualitativo: nessun aspetto di SEO on-page, tecnica, local, internazionale o di ottimizzazione per le AI dev'essere trascurato.

## MODALITÀ DI LAVORO

1. Lavora per fasi (elencate sotto), una alla volta. Al termine di ogni fase, presenta un riepilogo di cosa hai trovato/cambiato e i risultati di eventuali test, prima di passare alla successiva.
2. Usa un branch git dedicato (`seo/audit-completo`) e commit atomici e descrittivi per ogni categoria di modifica. Non modificare mai direttamente il branch di produzione.
3. Prima di ogni modifica strutturale (form di prenotazione, routing, redirect), crea un backup/snapshot e verifica che nulla si rompa (build, link interni, form funzionante).
4. Fai un audit **prima** di agire: non applicare cambiamenti "alla cieca". Motiva ogni raccomandazione con dati (Search Console, Lighthouse, PageSpeed Insights, crawl del sito) quando disponibili.
5. Rispetta rigorosamente le linee guida Google Search Essentials: niente keyword stuffing, niente contenuti duplicati o cloaking, niente link building manipolativo o farm di link. Solo tecniche white-hat sostenibili nel lungo periodo.
6. Alla fine, produci un report finale in Markdown con: interventi fatti, interventi consigliati ma non ancora fatti (con priorità), KPI da monitorare, prossimi passi.

---

## FASE 0 — Audit iniziale

- Crawl completo del sito (tutte le lingue e pagine) per individuare: pagine orfane, catene di redirect, link rotti (interni ed esterni), contenuti duplicati o quasi-duplicati tra lingue.
- Verifica indicizzazione attuale: quali URL sono indicizzati da Google (site:ironwoodlivigno.com) e quali no.
- Se disponibile l'accesso, collega/verifica Google Search Console e Bing Webmaster Tools; se non ancora collegati, guidami passo passo nella configurazione (proprietà per dominio, invio sitemap, verifica DNS).
- Controlla `robots.txt` e `sitemap.xml`: esistenza, correttezza, tutte le lingue incluse, nessun blocco involontario di risorse CSS/JS/immagini.
- Verifica presenza e correttezza di `llms.txt` (o creane uno) per l'ottimizzazione verso i crawler delle AI.
- Audit Core Web Vitals (LCP, INP, CLS) via PageSpeed Insights/Lighthouse su mobile e desktop, per homepage e almeno le 3 pagine più importanti (inverno, estate, camere).

## FASE 1 — SEO tecnica

- HTTPS corretto ovunque, nessun contenuto misto (mixed content).
- Struttura URL pulita, coerente, senza parametri superflui; canonical corretti su ogni pagina e ogni lingua (self-referencing canonical).
- Un solo tag `<h1>` per pagina, gerarchia H1→H2→H3 semanticamente corretta, coerente col contenuto.
- Meta title e meta description **unici** per ogni pagina/lingua, entro i limiti di lunghezza consigliati (title ~50-60 caratteri, description ~140-160), con keyword primaria + value proposition + call-to-action impliciti.
- Alt text descrittivo e ottimizzato per **tutte** le immagini (attualmente molte foto senza contesto keyword: camere, sauna, esterni, cibo colazione, e-bike, panorami estivi/invernali).
- Immagini in formato moderno (WebP/AVIF), dimensionate correttamente, lazy loading sotto la piega, nessuna immagine non compressa.
- Verifica mobile-first: tap target, leggibilità font, nessun contenuto tagliato su schermi piccoli.
- Verifica velocità: minimizzazione CSS/JS, preconnect/preload per risorse critiche, font-display swap, CDN se non già presente.
- Nessun contenuto duplicato tra le pagine tematiche (es. `/inverno` vs `/livigno-estate` vs homepage): differenzia intenti e keyword target per pagina, evitando cannibalizzazione.
- Verifica breadcrumb (visivi + markup) su tutte le pagine interne.

## FASE 2 — Keyword research e content mapping

Crea (o arricchisci) una **matrice keyword → pagina → lingua → intento (informativo/transazionale/locale) → stagione** basata su ricerca reale (usa Google Keyword Planner, Google Trends, Google Autosuggest, "Le persone hanno chiesto anche", dati Search Console se disponibili, e strumenti tipo Ahrefs/Semrush/Ubersuggest se accessibili).

Di seguito una lista di partenza di cluster e keyword da validare, ampliare con varianti long-tail e localizzare per ogni lingua del sito (non limitarti a queste, usale come seed):

**IT — Inverno / transazionali**
- appartamento a Livigno
- appartamento Livigno vicino impianti di risalita
- casa vacanze Livigno con sauna privata
- appartamento con sauna a infrarossi Livigno
- dove dormire a Livigno con la famiglia
- appartamento Livigno 6 persone
- affitto appartamento settimana bianca Livigno
- appartamento Livigno Mottolino / Carosello 3000 (verificare nomi impianti corretti vicini)
- casa vacanze Livigno con bagno turco privato

**IT — Estate / transazionali e informative**
- appartamento Livigno estate
- cosa fare a Livigno in estate
- appartamento vicino Lago di Livigno
- dove dormire a Livigno per mountain bike
- trekking Livigno alloggio
- vacanza estiva in Alta Valtellina

**IT — Locali/branded/informative**
- Livigno cosa vedere
- Livigno con bambini cosa fare
- miglior alloggio Livigno recensioni
- Via Saroch Livigno appartamento

**EN — Winter/Summer**
- Livigno apartment private sauna
- ski apartment Livigno near lifts
- family apartment Livigno ski resort
- Livigno accommodation for groups
- best apartment Livigno reviews
- Livigno summer apartment lake
- mountain bike accommodation Livigno
- self-catering apartment Livigno Italy

**DE**
- Ferienwohnung Livigno Sauna
- Ferienwohnung Livigno Skigebiet
- Familienwohnung Livigno
- Unterkunft Livigno mit privater Sauna
- Ferienwohnung Livigno Sommer

**FR**
- appartement Livigno sauna privée
- location appartement Livigno ski
- appartement Livigno famille

**Altre lingue (NL, DA, PL, CS, NO, ZH, JA)**: replica la stessa logica cluster (inverno-transazionale, estate-transazionale, family, wellness/sauna, locale/informativo) con un madrelingua o strumento di verifica qualità della traduzione — mai traduzione automatica lasciata senza revisione, specialmente per zh e ja.

Per ogni cluster definisci: pagina di destinazione univoca, keyword primaria, 3-5 keyword secondarie, intento di ricerca, e se serve una nuova pagina o un rafforzamento di una esistente.

## FASE 3 — Ottimizzazione on-page per pagina/lingua

Per ciascuna pagina e lingua, riscrivi/ottimizza (mantenendo il tono di voce attuale, caldo e accogliente):
- Title tag e meta description univoci e persuasivi
- H1 allineato alla keyword primaria della pagina
- Primi 100 parole con keyword primaria in modo naturale
- Sezioni FAQ ampliate con domande reali (usa "People Also Ask" e ricerche correlate) — ottimo sia per SEO tradizionale sia per GEO (vedi Fase 7)
- Link interni contestuali tra le pagine tematiche (inverno↔estate↔camere↔sauna↔come-arrivare) con anchor text descrittivi, non generici
- CTA chiare verso il form di richiesta disponibilità

## FASE 4 — Dati strutturati (Schema.org)

Implementa/valida JSON-LD per:
- `LodgingBusiness` o `VacationRental` (nome, indirizzo, geo, telefono, immagini, rating aggregato, servizi)
- `AggregateRating` + `Review` (collegati alle recensioni reali riportate sul sito, con attribuzione corretta alla fonte)
- `FAQPage` sulle sezioni FAQ
- `BreadcrumbList` su tutte le pagine interne
- `ImageObject` con didascalie per la galleria
- Eventuale `Organization`/`LocalBusiness` nel footer/contatti con NAP (Nome, Indirizzo, Telefono) coerente ovunque

Valida tutto con il Rich Results Test di Google e lo Schema Markup Validator prima di pubblicare.

## FASE 5 — SEO internazionale / hreflang

- Verifica che ogni pagina abbia i tag `hreflang` reciproci e corretti per tutte le 12 lingue + `x-default`.
- Verifica che i contenuti tradotti siano equivalenti nell'intento (non solo tradotti parola per parola) e localizzati per il mercato (valuta, unità di misura, riferimenti culturali, nomi delle festività per l'alta stagione).
- Verifica che il selettore lingua sia crawlabile (link `<a href>` reali, non solo JS) e che non ci siano loop di redirect basati su geolocalizzazione che impediscano a Googlebot di accedere a tutte le versioni.
- Sitemap XML separata o segmentata per lingua, inviata in Search Console per ogni property/lingua se pertinente.

## FASE 6 — Local SEO

- Crea/ottimizza il profilo **Google Business Profile** (categoria corretta, foto, orari, area servita, descrizione con keyword, post periodici, gestione recensioni).
- Verifica/crea presenza su Bing Places, Apple Maps/Apple Business Connect.
- Consistenza NAP (Nome/Indirizzo/Telefono) identica su sito, Google Business Profile, Airbnb, Booking, Holidu e qualsiasi directory turistica di Livigno/Valtellina/Lombardia.
- Valuta citazioni locali: portale turistico ufficiale di Livigno, consorzio turistico, Alta Valtellina, directory di settore (case vacanza, chalet alpini).
- Incoraggia/struttura la raccolta recensioni post-soggiorno (link diretto Google Review nel messaggio di check-out).

## FASE 7 — Ottimizzazione per i motori AI (GEO)

Gli assistenti AI (Google AI Overview, ChatGPT, Perplexity, Claude, Copilot) non funzionano come Google classico: premiano contenuto fattuale, ben strutturato, facilmente estraibile e citabile. Quindi:

- Crea/mantieni un file `llms.txt` in root con un riepilogo chiaro e fattuale della struttura, servizi, prezzi indicativi, posizione e policy del sito, in linguaggio semplice.
- Scrivi (o rafforza) blocchi di contenuto in formato "domanda diretta → risposta diretta e autosufficiente" (le FAQ esistenti sono un'ottima base: ampliale e rendile ancora più autosufficienti, senza richiedere contesto esterno per essere capite).
- Usa dati strutturati (Fase 4) in modo estensivo: le AI generative si affidano molto a Schema.org per estrarre fatti verificabili (prezzo, capienza, servizi, posizione, valutazione).
- Garantisci coerenza assoluta dei fatti (numero posti letto, m², distanza dagli impianti, prezzi) su tutte le pagine e lingue: le AI penalizzano le fonti con informazioni contraddittorie.
- Ottimizza per query conversazionali long-tail tipiche delle AI ("qual è il miglior appartamento a Livigno con sauna privata per una famiglia di 5 persone", "dove dormire a Livigno vicino agli impianti con bambini piccoli") integrando risposte dirette nel testo.
- Verifica che il sito sia perfettamente crawlabile dai bot delle AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) nel `robots.txt`, decidendo consapevolmente quali autorizzare per massimizzare la citabilità.

## FASE 8 — Content/editoriale (blog)

Proponi un calendario editoriale (almeno 12 articoli, 6 a tema inverno/6 a tema estate) mirato ai cluster keyword della Fase 2, ad esempio:
- "Cosa fare a Livigno in estate: guida completa"
- "Livigno con bambini: attività e consigli pratici"
- "Sauna dopo lo sci: benefici e perché sceglierla privata"
- "Come arrivare a Livigno: guida da Italia, Svizzera, Germania"
- "Lago di Livigno: itinerari e punti panoramici"
- "Mountain bike a Livigno: i migliori sentieri per famiglie ed esperti"

Ogni articolo: keyword primaria, struttura H2/H3, FAQ finale, link interno verso la pagina di prenotazione pertinente, immagini ottimizzate con alt text.

## FASE 9 — Performance e Core Web Vitals

- Porta LCP, INP, CLS entro le soglie "Good" di Google su mobile e desktop.
- Ottimizza il caricamento della galleria immagini (principale collo di bottiglia probabile).
- Verifica e ottimizza il form di richiesta disponibilità: deve restare velocissimo e funzionante durante ogni modifica SEO.

## FASE 10 — Autorevolezza e link building (white-hat)

- Identifica opportunità di backlink locali e di settore: consorzio turistico Livigno, blog di viaggio/sci/famiglia, guest post su siti di turismo alpino, collaborazioni con attività locali (scuola sci, noleggio bici a 50m).
- Valuta digital PR stagionale (comunicati per apertura stagione sci/estate) verso testate di settore.
- Nessun acquisto di link, nessuna link farm, nessuno scambio massivo di link.

## FASE 11 — Tracking e reportistica

- Verifica/configura Google Search Console, Bing Webmaster Tools, Google Analytics 4 (eventi su invio form, click WhatsApp, click chiamata).
- Definisci i KPI da monitorare mensilmente: impressioni e posizione media per cluster keyword (per lingua), CTR organico, pagine indicizzate, Core Web Vitals, conversioni da organico (richieste form/WhatsApp).
- Proponi una cadenza di revisione (es. mensile) e cosa controllare ogni volta.

---

## VINCOLI

- Non rompere mai il form di richiesta disponibilità o i link WhatsApp/telefono/email.
- Non alterare il tono di voce caldo, curato e "premium ma familiare" già presente nei testi.
- Nessuna tecnica black-hat/gray-hat (cloaking, keyword stuffing, contenuti nascosti, link a pagamento non dichiarati, doorway pages).
- Ogni claim fattuale (prezzi, distanze, servizi) deve restare accurato e verificato con il proprietario prima della pubblicazione.
- Lavora in modo incrementale e testabile: niente deploy massivi non verificati.

## DEFINIZIONE DI "FATTO BENE" (criteri di accettazione)

- Tutte le pagine/lingue hanno title, meta description, H1 univoci e ottimizzati.
- Zero errori critici in Search Console (copertura, mobile usability, Core Web Vitals).
- Dati strutturati validi su tutte le pagine pertinenti, senza errori nel Rich Results Test.
- hreflang corretto e reciproco su tutte le 12 lingue.
- llms.txt e robots.txt ottimizzati per i bot AI.
- Matrice keyword→pagina completa e senza cannibalizzazione.
- Calendario editoriale consegnato con almeno 12 articoli pianificati.
- Report finale con priorità (quick win vs. lungo termine) e KPI di partenza da cui misurare i progressi.

Al termine di ogni fase, fermati e mostrami un riepilogo chiaro prima di procedere alla fase successiva.
