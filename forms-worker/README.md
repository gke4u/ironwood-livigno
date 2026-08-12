# ironwood-forms

Backend del form di richiesta disponibilità di Ironwood Livigno. Cloudflare Worker + D1 + Email Service — nessun VPS, nessun Docker, nessun secret da gestire. Sostituisce la precedente integrazione diretta con Web3Forms.

Deployato su `forms.ironwoodlivigno.com`, separato dal Worker del sito principale (`ironwood-livigno`) così un problema nell'uno non tocca l'altro.

## Passaggio che manca — da fare tu, una volta sola

Il binding email (`env.EMAIL`) può inviare solo a un indirizzo del dominio già **onboardato per Email Sending** su Cloudflare — oggi non lo è ancora, quindi la notifica interna non parte finché non lo fai (i dati della richiesta vengono comunque salvati regolarmente in D1, questo passaggio riguarda solo l'email di avviso).

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) → il tuo account → **Compute** → **Email Service** → **Email Sending**.
2. **Onboard Domain** → seleziona `ironwoodlivigno.com`.
3. Rivedi i record DNS che Cloudflare propone di aggiungere (MX di bounce su `cf-bounce`, SPF, DKIM, DMARC su `_dmarc`) → **Done**. Sono aggiunti in automatico, non serve toccare nulla a mano.
4. Aspetta la propagazione (di solito 5-15 minuti, dominio già su Cloudflare DNS).

Fatto questo, le notifiche partiranno da sole — nessuna modifica di codice necessaria.

## Struttura

```
wrangler.jsonc   # binding D1/send_email/ratelimit, custom domain, cron retention
schema.sql       # tabella submissions
src/index.ts     # handler fetch (submit) + scheduled (retention mensile)
```

## Comandi

```bash
npm install                # una tantum
npm run deploy              # wrangler deploy
npm run db:schema           # riapplica schema.sql al DB remoto (idempotente solo se le tabelle non esistono già)
```

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

Vedi il commento in testa a `src/index.ts` e la cronologia della conversazione che ha portato a questa architettura: Formlander (self-hosted) richiede un filesystem persistente reale che Cloudflare Containers non garantisce (disco effimero), rischio concreto di perdita dati. Il binding email nativo di Cloudflare può inviare solo a indirizzi verificati sull'account (adatto a notifiche interne, non a rispondere in automatico a indirizzi arbitrari di ospiti) — l'autorisposta al cliente non è quindi possibile restando 100% Cloudflare-nativi; il sito mostra già una conferma a schermo dopo l'invio, che copre la stessa esigenza senza dipendenze esterne.
