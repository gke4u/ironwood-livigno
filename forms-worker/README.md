# ironwood-forms

Backend del form di richiesta disponibilità di Ironwood Livigno. Cloudflare Worker + D1 + invio via SMTP diretto a mailbox.org — nessun VPS, nessun Docker, nessun servizio email di terze parti. Sostituisce la precedente integrazione diretta con Web3Forms.

Deployato su `forms.ironwoodlivigno.com`, separato dal Worker del sito principale (`ironwood-livigno`) così un problema nell'uno non tocca l'altro.

## Perché SMTP diretto e non il binding email di Cloudflare

Il binding nativo `send_email` di Cloudflare può inviare solo a indirizzi verificati tramite **Email Routing**, che richiede Email Routing attivo sul dominio — cioè sostituire i record MX. `ironwoodlivigno.com` ha già 4 record MX attivi su **mailbox.org**, la casella reale e funzionante di `info@ironwoodlivigno.com`: attivare Email Routing li avrebbe rotti. Scartata anche l'idea di un servizio email transazionale di terze parti (Resend/Postmark/ecc.) su richiesta esplicita dell'utente, per non introdurre un nuovo attore esterno.

La soluzione: il Worker si collega direttamente al server SMTP di mailbox.org (`smtp.mailbox.org:587`, STARTTLS) usando l'API `connect()` di Cloudflare Workers (`cloudflare:sockets` — la porta 587 non è bloccata, solo la 25 lo è). Client SMTP scritto a mano in `src/smtp.ts` (niente libreria: l'ecosistema npm per SMTP assume moduli Node `net`/`tls` non disponibili in Workers).

**Nota sulle credenziali**: l'account mailbox.org usato per l'autenticazione SMTP è `info@guanafoto.com` (non `info@ironwoodlivigno.com`) — `info@ironwoodlivigno.com` è un alias sullo stesso account. mailbox.org richiede l'autenticazione con l'indirizzo principale dell'account anche quando si invia "come" un alias. Vedi `SMTP_USER` in `src/index.ts` se l'account cambia in futuro.

## Struttura

```
wrangler.jsonc   # binding D1/ratelimit, custom domain, cron retention (niente send_email)
schema.sql       # tabella submissions
src/smtp.ts      # client SMTP minimale (EHLO/STARTTLS/AUTH LOGIN/MAIL FROM/RCPT TO/DATA)
src/index.ts     # handler fetch (submit) + scheduled (retention mensile)
```

## Comandi

```bash
npm install                # una tantum
npm run deploy              # wrangler deploy
npm run db:schema           # riapplica schema.sql al DB remoto (idempotente solo se le tabelle non esistono già)
```

## Secret

```bash
npx wrangler secret put SMTP_PASSWORD
```

Password dell'account mailbox.org `info@guanafoto.com` usato per l'autenticazione SMTP. Se cambia, va aggiornata con lo stesso comando (richiede conferma interattiva, non si può scriptare senza incollarla) — non è mai nel codice né nel repo.

## Verificare le richieste ricevute

```bash
npx wrangler d1 execute ironwood-forms --remote --command "SELECT id, created_at, name, email, checkin_display, checkout_display, source, status FROM submissions ORDER BY id DESC LIMIT 20"
```

`status` parte sempre da `'new'` — pensato per un futuro collegamento a un gestionale (che potrebbe aggiornarlo a `contacted`/`confirmed`/`declined`), non usato altrove per ora.

## Backup

```bash
npx wrangler d1 export ironwood-forms --remote --output=backup-$(date +%Y%m%d).sql
```

Da ripetere periodicamente (es. mensile) e conservare altrove — D1 non ha uno strumento di backup automatico integrato lato Cloudflare oltre alla sua replica interna.

## Rollback

```bash
npx wrangler rollback          # torna alla versione precedente del Worker
```

Se serve tornare temporaneamente a Web3Forms lato frontend: la vecchia access key (`2b74f827-dd36-44b3-b791-b3e4a83db65f`) resta valida finché non la revochi da web3forms.com — ripristinare il blocco `fetch('https://api.web3forms.com/submit', ...)` in `src/components/RequestForm.tsx` dalla cronologia git è sufficiente, non serve altro lato Worker.

## Retention automatica

Cron mensile (`scheduled()` in `src/index.ts`, trigger `0 3 1 * *` in `wrangler.jsonc`) cancella le righe più vecchie di 24 mesi. Per cambiare la finestra, modifica `RETENTION_MONTHS` in `src/index.ts` e rideploya.

## Perché non Formlander, e perché niente autorisponditore al cliente

Formlander (self-hosted, la richiesta iniziale) richiede un filesystem persistente reale che Cloudflare Containers non garantisce (disco effimero), rischio concreto di perdita dati — scartato.

L'autorisposta automatica al cliente (email di conferma ricezione, richiesta nel brief iniziale) non è implementata: il client SMTP qui parla solo con mailbox.org per la notifica interna a `info@ironwoodlivigno.com`, non è pensato per inviare a indirizzi arbitrari di ospiti con la stessa affidabilità di un servizio email dedicato (reputazione IP, gestione bounce, retry). Il sito mostra già una conferma a schermo dopo l'invio, che copre la stessa esigenza UX. Se in futuro si vuole comunque l'autorisposta, è un'aggiunta isolata (richiederebbe probabilmente tornare a valutare un servizio email dedicato solo per quello, mantenendo la notifica interna via SMTP com'è).
