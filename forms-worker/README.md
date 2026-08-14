# ironwood-forms

Backend del form di richiesta disponibilità di Ironwood Livigno, più la dashboard interna ("Ironwood Desk") da cui Francesco gestisce le richieste. Cloudflare Worker + D1 + invio via SMTP diretto a mailbox.org — nessun VPS, nessun Docker, nessun servizio email di terze parti. Sostituisce la precedente integrazione diretta con Web3Forms.

Deployato su `forms.ironwoodlivigno.com`, separato dal Worker del sito principale (`ironwood-livigno`) così un problema nell'uno non tocca l'altro.

## Perché SMTP diretto e non il binding email di Cloudflare

Il binding nativo `send_email` di Cloudflare può inviare solo a indirizzi verificati tramite **Email Routing**, che richiede Email Routing attivo sul dominio — cioè sostituire i record MX. `ironwoodlivigno.com` ha già 4 record MX attivi su **mailbox.org**, la casella reale e funzionante di `info@ironwoodlivigno.com`: attivare Email Routing li avrebbe rotti. Scartata anche l'idea di un servizio email transazionale di terze parti (Resend/Postmark/ecc.) su richiesta esplicita dell'utente, per non introdurre un nuovo attore esterno.

La soluzione: il Worker si collega direttamente al server SMTP di mailbox.org (`smtp.mailbox.org:587`, STARTTLS) usando l'API `connect()` di Cloudflare Workers (`cloudflare:sockets` — la porta 587 non è bloccata, solo la 25 lo è). Client SMTP scritto a mano in `src/smtp.ts` (niente libreria: l'ecosistema npm per SMTP assume moduli Node `net`/`tls` non disponibili in Workers).

**Nota sulle credenziali**: l'account mailbox.org usato per l'autenticazione SMTP è `info@guanafoto.com` (non `info@ironwoodlivigno.com`) — `info@ironwoodlivigno.com` è un alias sullo stesso account. mailbox.org richiede l'autenticazione con l'indirizzo principale dell'account anche quando si invia "come" un alias. Vedi `SMTP_USER` in `src/index.ts` se l'account cambia in futuro.

## Struttura

```
wrangler.jsonc        # binding D1/R2/ratelimit/AI, custom domain, cron (niente send_email)
schema.sql             # tabella submissions
src/smtp.ts             # client SMTP minimale (EHLO/STARTTLS/AUTH LOGIN/MAIL FROM/RCPT TO/DATA)
src/validation.ts       # validazione richiesta form — nessuna dipendenza da D1/SMTP, testabile in isolamento
src/index.ts             # handler fetch (submit, /reply, /admin/*) + scheduled (retention, SMTP check, backup)
src/auth.ts               # login password + cookie di sessione firmato (dashboard /admin)
src/admin.ts               # query D1 + rendering della dashboard "Ironwood Desk"
src/email-template.ts       # email di notifica interna + pagina "rispondi al cliente"
src/guest-receipt.ts         # ricevuta automatica al cliente (stile fax)
src/quick-replies.ts          # testi delle 3 risposte rapide, in 12 lingue
src/reply-labels.ts            # etichette localizzate per risposte/ricevuta
src/draft.ts                    # bozza di risposta generata con Workers AI
src/translate.ts                 # traduzione automatica del messaggio dell'ospite
test/                              # suite automatica (vitest + Workers runtime reale)
```

## Comandi

```bash
npm install                 # una tantum
npm test                    # suite di test automatici (locale, nessuna rete reale)
npm run typecheck           # controllo tipi (src/ + test/)
npm run deploy               # wrangler deploy — esegue prima typecheck + test (predeploy hook)
npm run db:schema            # riapplica schema.sql al DB remoto (idempotente solo se le tabelle non esistono già)
```

## Test automatici

`npm test` (vitest + `@cloudflare/vitest-pool-workers`) esegue la suite dentro un vero runtime Workers locale, con un D1 isolato per file di test — non mock. Copre: validazione del form, login/sessione della dashboard, query e filtri della dashboard, escaping HTML (protezione XSS su nome/messaggio dell'ospite), aggiornamento dello stato dopo una risposta, eliminazione di una richiesta (con e senza sessione valida), avviso di sovrapposizione date, ed esportazione di backup su R2.

**Deliberatamente non testato end-to-end**: un invio reale da `/submit` (non honeypot) e un invio reale da `/reply/:token/send` — entrambi chiamano `sendMail()`, che apre una connessione TCP reale a `smtp.mailbox.org`. Un test che arrivasse fino in fondo aprirebbe una connessione reale verso la casella di produzione ad ogni esecuzione della suite; tutto ciò che sta prima di quella chiamata (validazione, rate limiting, autenticazione, rendering) è comunque coperto.

`npm run deploy` esegue `typecheck` e `test` automaticamente prima del deploy vero e proprio (vedi `predeploy` in `package.json`) — un deploy con test falliti o errori di tipo si ferma prima di toccare `forms.ironwoodlivigno.com`.

## Dashboard admin — "Ironwood Desk"

`https://forms.ironwoodlivigno.com/admin` — tutte le richieste in un'unica vista, con filtri per stato, ricerca, paginazione (50 per pagina), risposta rapida/libera/AI direttamente dalla scheda della richiesta, ed eliminazione. Responsive: sotto ~900px di larghezza mostra lista o dettaglio (mai entrambi), con un link "← Richieste" per tornare indietro — nessun elemento è mai nascosto in modo permanente, solo raggiungibile con un tap in più.

Protetta da password (cookie di sessione firmato, 30 giorni, limite di 5 tentativi di login al minuto per IP). Password e chiave di firma sono secret separati:

```bash
npx wrangler secret put ADMIN_PASSWORD          # password di accesso alla dashboard
npx wrangler secret put ADMIN_SESSION_SECRET    # chiave di firma del cookie — una stringa lunga a caso, mai digitata al login
```

Inviare una risposta da lì aggiorna anche lo stato della richiesta (Nuova → Confermata/Non disponibile/In attesa/Risposta inviata), che è quello che alimenta i filtri e i contatori.

### Avviso di sovrapposizione date

Aprendo una richiesta, se le sue date si sovrappongono a un'altra richiesta già segnata "Confermata", compare un avviso in cima alla scheda con nome e date del conflitto. È solo un avviso — non impedisce di rispondere "Disponibile", la decisione resta a Francesco.

## Secret

```bash
npx wrangler secret put SMTP_PASSWORD           # password mailbox.org (info@guanafoto.com)
npx wrangler secret put ADMIN_PASSWORD          # password dashboard /admin
npx wrangler secret put ADMIN_SESSION_SECRET    # chiave di firma del cookie di sessione
```

Nessuno di questi è mai nel codice né nel repo. Se una password cambia, va aggiornata con lo stesso comando (richiede conferma interattiva).

## Verificare le richieste ricevute

Dalla dashboard (`/admin`), oppure da riga di comando:

```bash
npx wrangler d1 execute ironwood-forms --remote --command "SELECT id, created_at, name, email, checkin_display, checkout_display, source, status FROM submissions ORDER BY id DESC LIMIT 20"
```

`status` parte da `'new'` e viene aggiornato automaticamente quando una risposta viene inviata dalla dashboard o dal link nell'email di notifica (`confirmed`/`declined`/`pending`/`replied`).

## Backup

Automatico: ogni domenica alle 04:00 UTC (cron `0 4 * * SUN` in `wrangler.jsonc`, gestito in `scheduled()` in `src/index.ts`) l'intera tabella `submissions` — comprese le righe segnate come spam, per un backup davvero completo — viene esportata come JSON e caricata sul bucket R2 `ironwood-forms-backups` (binding `BACKUPS`), con un file per settimana (`submissions-AAAA-MM-GG.json`). Un fallimento invia un avviso via email, come gli altri controlli automatici di questo Worker.

Per un export manuale on-demand (oltre a quello automatico):

```bash
npx wrangler d1 export ironwood-forms --remote --output=backup-$(date +%Y%m%d).sql
```

## Rollback

```bash
npx wrangler rollback          # torna alla versione precedente del Worker
```

Se serve tornare temporaneamente a Web3Forms lato frontend: la vecchia access key (`2b74f827-dd36-44b3-b791-b3e4a83db65f`) resta valida finché non la revochi da web3forms.com — ripristinare il blocco `fetch('https://api.web3forms.com/submit', ...)` in `src/components/RequestForm.tsx` dalla cronologia git è sufficiente, non serve altro lato Worker.

## Retention automatica

Cron mensile (`scheduled()` in `src/index.ts`, trigger `0 3 1 * *` in `wrangler.jsonc`) cancella le righe più vecchie di 24 mesi. Per cambiare la finestra, modifica `RETENTION_MONTHS` in `src/index.ts` e rideploya. Il backup settimanale su R2 (sopra) resta comunque disponibile anche dopo che una riga è stata rimossa da D1 dalla retention.

## Perché non Formlander

Formlander (self-hosted, la richiesta iniziale) richiede un filesystem persistente reale che Cloudflare Containers non garantisce (disco effimero), rischio concreto di perdita dati — scartato.
