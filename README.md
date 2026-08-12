# Ironwood Livigno — Sito web

Sito completo nelle sue fondamenta: design system "Refuge Moderno", 10 sezioni homepage, 12 lingue attive, SEO multilingua, widget di prenotazione, CTA WhatsApp. Esportato come sito statico, pronto per essere trascinato su Cloudflare Pages (nessun terminale necessario per pubblicarlo).

## Novità v29 (5 agosto 2026)
- **Font veri in produzione**: Fraunces e Poppins ora sono self-hosted (Fontsource) dentro il sito stesso — prima erano "stubbati" e il sito renderizzava coi font di sistema. Niente più richieste a Google Fonts: più veloce e più semplice lato GDPR.
- **CSS e font condivisi da tutto il sito**: spostati nel layout radice, così anche la sezione /blog eredita stili e font (prima ne era esclusa).
- **Hero più leggero**: creata la versione WebP dell'immagine hero (−30% peso sull'elemento LCP) con fallback JPG automatico; rigenerati i 2 WebP che pesavano più del JPG.
- **Redirect 301 per le vecchie URL .html** (appartamento.html, faq.html, blog/*.html…): recuperano backlink e pagine indicizzate della versione precedente del sito invece di dare 404.
- **Dati strutturati più ricchi**: aggiunta Accommodation dettagliata (90 m², 3 camere, 2 bagni, 6 ospiti in formato machine-readable) e schema WebSite; sitemap con immagini anche per gli articoli del blog.
- **Accessibilità**: skip link "Vai al contenuto" tradotto in tutte le 12 lingue (WCAG 2.4.1), markup semantico corretto nell'hero.
- **Caching**: header Cache-Control per immagini e asset statici (visite ripetute molto più veloci).

## Stack
- Next.js 15 (App Router) + TypeScript + React 19, con `output: 'export'` — genera solo file HTML/CSS/JS statici, nessun server richiesto
- Tailwind CSS (design tokens personalizzati: colori, font, animazioni)
- next-intl v4 per il multilingua: it, en, de, fr, da, pl, cs, no, nl — tutte tradotte
- Widget di prenotazione Holidu integrato + CTA fissa WhatsApp
- Meta tag, hreflang e dati strutturati per SEO multilingua, tutti "cotti" direttamente nell'HTML in fase di build

## Avvio in locale (solo se vuoi sviluppare/modificare il codice)
```
npm install
npm run dev
```
Poi apri http://localhost:3000/it.

## Come pubblicare il sito (drag-and-drop, senza terminale)

1. **Genera i file del sito.** Serve un solo comando da terminale, una volta sola (o chiedimelo di nuovo in futuro e te lo preparo io): dentro la cartella del progetto:
   ```
   npm install
   npm run build
   ```
   Questo crea una cartella `out/` con dentro il sito completo, già pronto — solo file HTML, immagini, CSS, JS.

2. **Crea un account Cloudflare** (gratis) su https://dash.cloudflare.com/sign-up, se non ne hai già uno.

3. **Vai su Workers & Pages → Create → Pages → Upload assets** (o "Direct Upload").

4. **Trascina la cartella `out/`** (o il suo contenuto) nella pagina di upload. Cloudflare ti chiede un nome progetto e in un minuto ti dà un indirizzo pubblico tipo `ironwood-livigno.pages.dev`.

5. **(Consigliato) Collega il tuo dominio vero.** Se possiedi già `ironwoodlivigno.com`: nel progetto appena creato vai su **Custom domains** → **Add a custom domain** → inserisci il dominio. Cloudflare configura DNS e certificato SSL da sola.

6. **Aggiornamenti futuri**: ogni volta che cambi un testo o una foto, rifai `npm run build` e trascina la nuova cartella `out/` sullo stesso progetto Cloudflare (Cloudflare tiene lo storico delle versioni, puoi tornare indietro se serve).

### Se il caricamento su Cloudflare si blocca (tanti file, upload che non finisce mai)

È un problema noto della pagina di upload di Cloudflare quando ci sono più di ~100 file insieme (questo sito, con 9 lingue, ne genera 150+) — non è un problema del sito, è la pagina web di Cloudflare che si blocca. La soluzione ufficiale di Cloudflare stessa in questi casi è pubblicare da riga di comando invece che trascinando la cartella:

```
npx wrangler login
npm run deploy
```

`npx wrangler login` va fatto una sola volta: apre il browser per autorizzare l'accesso al tuo account Cloudflare. `npm run deploy` (comando già pronto in `package.json`, punta al file `wrangler.jsonc` già configurato con lo stesso nome del progetto esistente `ironwood-livigno`) carica il sito direttamente, senza passare dalla pagina di upload che si blocca. Aggiorna lo stesso sito che oggi gira su ironwoodlivigno.com — non crea un progetto nuovo, non serve toccare DNS o dominio.

Prima di generare il sito la prima volta, imposta il dominio reale in un file `.env.local` nella cartella del progetto:
```
NEXT_PUBLIC_SITE_URL=https://ironwoodlivigno.com
```
(serve per generare correttamente i tag hreflang/canonical/Open Graph — altrimenti punteranno al dominio di esempio).

### Dopo il primo deploy: motori di ricerca
- Registra il sito su [Google Search Console](https://search.google.com/search-console) e su [Bing Webmaster Tools](https://www.bing.com/webmasters), inviando `https://tuodominio.com/sitemap.xml` in entrambi.
- Lancia `npm run indexnow` per notificare subito Bing/Yandex/Naver (Google non usa IndexNow, viene indicizzato tramite Search Console).

### Dopo il primo deploy: statistiche visite (Cloudflare Web Analytics)
Per sapere quante persone visitano il sito, da dove arrivano e quali pagine guardano — senza toccare una riga di codice e senza il banner dei cookie (perché non usa cookie):

1. Collega il dominio `ironwoodlivigno.com` a Cloudflare (se non l'hai già fatto per il custom domain di Cloudflare Pages, è già a posto).
2. Nella dashboard Cloudflare vai su **Analytics & Logs → Web Analytics** (oppure cerca "Web Analytics" nel menu laterale).
3. Clicca **Add a site**, seleziona `ironwoodlivigno.com` dall'elenco dei domini già connessi alla tua zona Cloudflare.
4. Fatto. Se il dominio è già proxato da Cloudflare ("nuvoletta arancione" attiva nel DNS), i dati iniziano ad arrivare da soli, senza inserire nessuno script nelle pagine.
5. Le statistiche (visite, pagine più viste, paesi, dispositivi) si vedono da quella stessa schermata, aggiornate ogni giorno.

Perché questa soluzione e non Google Analytics: zero codice da aggiungere o mantenere, nessun cookie quindi nessun banner di consenso da mostrare ai visitatori, e i dati restano più semplici e rispettosi della privacy — coerente con la privacy policy del sito.

## Note
- I font (Fraunces + Poppins) vengono scaricati da Google Fonts in fase di build: funziona normalmente su qualsiasi ambiente con accesso a internet standard.
- Il widget di prenotazione (`BookingSection.tsx`) punta all'iframe Holidu fornito.
- Il numero WhatsApp è in `StickyWhatsApp.tsx` e nel footer.
- Le recensioni in `Reviews.tsx` / `messages/*.json` sono 6 recensioni reali (Google, Airbnb), riprese da ironwoodlivigno.com/recensioni.html, dove sono verificate. Le citazioni restano nella lingua originale in tutti i file lingua (non tradotte, per non alterare le parole reali degli ospiti); solo il testo di contorno (`disclaimer`) è tradotto.
- La homepage (`/`) è una pagina statica che reindirizza subito a `/it` (lingua predefinita); il selettore lingua in alto permette di cambiare lingua in qualsiasi momento.
- **Privacy policy** (`/{locale}/privacy`, es. `/it/privacy`): pagina dedicata, tradotta in tutte le 9 lingue, con informativa GDPR completa (titolare del trattamento, dati raccolti tramite WhatsApp/widget Holidu/Google Maps/Cloudflare Analytics, base giuridica, cookie, conservazione, diritti dell'interessato, trasferimento dati extra-UE, reclami al Garante Privacy). Linkata dal footer di ogni pagina. **Importante**: questo testo è stato scritto per essere sostanzialmente conforme al GDPR, ma non sostituisce una revisione legale vera e propria — prima di pubblicare, è consigliabile farla controllare da un avvocato o da un servizio come iubenda, soprattutto per i flussi di dati verso terzi (Holidu, Google Maps).
- **Blog** (`/blog`): sezione editoriale separata dalla homepage, solo in italiano, con 6 articoli pensati per intercettare ricerche informative (Google/AI) su Livigno: "Come arrivare a Livigno", "Sci a Livigno: guida al Carosello 3000", "Livigno d'estate: mountain bike, trekking e lago", "Cosa mangiare a Livigno", "Shopping duty-free a Livigno" e "Livigno con bambini". Ogni articolo ha markup `BlogPosting` + `BreadcrumbList` (JSON-LD) e un box che rimanda alla prenotazione dell'appartamento. Per aggiungere altri articoli in futuro: basta aggiungere una nuova voce in `src/content/blog.ts` con lo stesso formato (e una riga in più in `public/sitemap.xml`).

## Sezioni implementate
Hero, Esperienza (sauna/bagno turco privati), Camere, Servizi, Posizione (con mappa), Estate a Livigno, Galleria, Prenotazione (widget Holidu + WhatsApp), Recensioni, FAQ (accordion), Footer, Privacy (pagina dedicata), Blog (sezione separata).

## Foto e logo
Tutte le immagini sono foto reali dell'appartamento, fornite dal proprietario, salvate in `public/images/`. Il logo Ironwood (icona a montagna + testo) è ricostruito come SVG in `src/components/Logo.tsx`, usato in Nav e Footer. Favicon e apple-touch-icon sono già impostati in `src/app/layout.tsx`. Tutte le foto disponibili sono ora integrate: nella Galleria (compresi bagno, bagno extra, cucina in dettaglio, soggiorno), nella sezione Estate (comprese le foto e-bike) e negli articoli del blog.

Ogni foto usata su una pagina esiste in due formati: il `.jpg` originale e una versione `.webp` generata dallo stesso file (20-40% più leggera a parità di qualità visiva). Il componente `src/components/Pic.tsx` serve automaticamente il WebP ai browser che lo supportano e il JPG a tutti gli altri (browser datati, crawler che leggono solo il fallback) tramite `<picture>` — nessuna azione richiesta per le foto già presenti. Se aggiungi una nuova foto in futuro, genera anche la sua versione `.webp` (stesso nome, estensione diversa) per beneficiare dello stesso meccanismo.

## Struttura lingue
`messages/{it,en,de,fr,da,pl,cs,no,nl}.json` — un file per lingua, stessa struttura di chiavi. Per modificare un testo, basta editare la chiave corrispondente in ciascun file, poi rifare `npm run build`.

## SEO & AI (GEO)
- `robots.txt`: consente esplicitamente Googlebot, Bingbot e i crawler AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider, Applebot-Extended...).
- `sitemap.xml`: tutte le 9 lingue con hreflang incrociati.
- `llms.txt`: sintesi della proprietà pensata per i motori di risposta AI.
- JSON-LD (`LodgingBusiness` + `FAQPage`) sempre presente, direttamente nell'HTML generato in fase di build — nessuna dipendenza da JavaScript o dallo user-agent del visitatore.
- Title, meta description, canonical, hreflang, Open Graph e Twitter Card: essendo il sito esportato come pagine statiche, questi tag sono già scritti nell'HTML di ogni pagina fin dal primo byte, per qualsiasi visitatore o crawler (incluso chi non esegue JavaScript, come molti bot AI).
- Header di sicurezza (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) via `public/_headers`, riconosciuto automaticamente da Cloudflare Pages.
- IndexNow: chiave pubblicata in `public/<key>.txt`; `npm run indexnow` notifica Bing/Yandex/Naver dopo ogni deploy (Google non usa questo protocollo, viene gestito separatamente tramite Search Console).
- Immagine hero precaricata con priorità alta (è l'elemento LCP della pagina); tutte le altre foto usano `loading="lazy"` per non competere con essa.
- `aggregateRating` (5,0/5 su 28 recensioni, dato reale da Google/Airbnb) e 6 `review` reali nel JSON-LD `LodgingBusiness` — abilita le stelline nei risultati di ricerca Google.
- `sameAs` verso il profilo recensioni Holidu verificato — rafforza l'identità dell'attività agli occhi di Google e dei motori AI.
- `image` multiplo nel JSON-LD (foto reali: esterno, sauna, soggiorno, camera) invece di una singola immagine.
- Immagine Open Graph dedicata (`og-image.jpg`, 1200×630 — il formato universale per anteprime social) invece di riusare l'hero a piena risoluzione: anteprime pulite e non ritagliate male su WhatsApp, Facebook, LinkedIn, X.
- `theme-color` e `manifest.json`: la barra del browser su mobile assume il colore del brand, e il sito è "installabile" come icona sulla schermata home.
- Tutte le foto hanno larghezza/altezza dichiarate nell'HTML (oltre al contenitore a rapporto fisso già presente) — elimina qualunque possibile scatto di layout (CLS) durante il caricamento, controllo esplicito richiesto dagli audit Lighthouse/PageSpeed.
- Sitemap: aggiunta `<lastmod>` su ogni pagina e tag immagine (`image:image`) sulle foto principali, per una migliore scoperta anche su Google Immagini.
- Pagina 404 personalizzata (con il brand, non quella generica di Next.js), per evitare la pagina 404 generica di Next.js. Se in futuro colleghi anche `www.ironwoodlivigno.com` come dominio secondario, il redirect verso il dominio principale va impostato come Redirect Rule a livello di zona Cloudflare (dashboard del dominio → Rules → Redirect Rules), non nel file `public/_redirects` — quel file, per questo tipo di progetto (Worker con asset statici, non Cloudflare Pages classico), accetta solo percorsi relativi.
- Nota: Google dal 2023 mostra il rich snippet visivo delle FAQ (con le domande espandibili nei risultati di ricerca) solo per siti governativi/sanitari autorevoli — il markup FAQPage resta comunque prezioso perché è esattamente il formato che i motori di risposta AI (ChatGPT, Perplexity, ecc.) leggono per rispondere a domande sulla struttura.

## Prossimi miglioramenti facoltativi
- Far rivedere la privacy policy da un legale prima della pubblicazione definitiva.
- Dominio custom e DNS su Cloudflare (vedi sopra).
- Aggiungere altri articoli al blog nel tempo, per continuare a intercettare ricerche informative su Livigno.
- Aprire e verificare la scheda Google Business Profile (testi già pronti in un documento separato, `testi-google-business-profile.md`) — pesa molto per le ricerche locali tipo "dove dormire a Livigno".
- Costruire backlink reali (menzioni da blog di viaggio, directory locali, partner) — nessun lavoro sul sito da solo sostituisce link esterni autentici.

---

## Metodo avanzato (facoltativo): Cloudflare Workers

Il sito è impostato per l'export statico (drag-and-drop). Se in futuro servissero funzioni lato server (es. contenuti che cambiano in base al visitatore, API personalizzate), è possibile passare al deploy dinamico su **Cloudflare Workers** tramite l'adapter **OpenNext**:

1. Rimuovi `output: 'export'` da `next.config.mjs`.
2. Reinstalla le dipendenze necessarie: `npm install --save-dev @opennextjs/cloudflare wrangler`.
3. Ripristina l'import in `open-next.config.ts` (istruzioni nel file stesso) e riattiva `src/middleware.ts` (già pronto, gestisce il redirect automatico in base alla lingua del browser).
4. Aggiungi in `package.json`: `"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"`.
5. Da terminale: `npx wrangler login`, poi `npm run deploy`.

Per un sito vetrina come questo, però, la versione statica è più semplice da mantenere e altrettanto valida per la SEO — consigliata salvo esigenze specifiche.

### Costi
Cloudflare Pages è gratuito per siti come questo (illimitate richieste per contenuti statici sul piano free); il dominio custom, se non già posseduto, va acquistato separatamente.
