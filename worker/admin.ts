// The /admin page: one self-contained HTML document (inline CSS and JS, no
// build step). Photos are resized and re-encoded in the browser before
// upload — longest side 1600 px, WebP (JPEG where the browser can't encode
// WebP, e.g. older Safari) — so a 5 MB phone photo goes up as ~200 KB and
// the Worker never has to process images itself. The Ironwood logo is
// drawn into every photo at the same step, so it is part of the file.
export function adminPage(): string {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Foto del giorno — Admin Ironwood Livigno</title>
<style>
  :root { --ink:#1f1a17; --mist:#f6f3ee; --brick:#9c4a2f; --line:#e2dcd3; --ok:#2f6b3a; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:var(--mist); color:var(--ink); }
  header { background:var(--ink); color:var(--mist); padding:16px 20px; display:flex; justify-content:space-between; align-items:center; }
  header h1 { font-size:18px; margin:0; font-weight:600; }
  main { max-width:960px; margin:0 auto; padding:24px 16px 64px; }
  .card { background:#fff; border-radius:16px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,.06); margin-bottom:24px; }
  h2 { font-size:17px; margin:0 0 12px; }
  p.hint { color:#6b625b; font-size:14px; margin:0 0 16px; line-height:1.5; }
  button, .btn { font:inherit; border:0; border-radius:999px; padding:12px 22px; cursor:pointer; background:var(--brick); color:#fff; font-weight:600; min-height:44px; }
  button.secondary { background:transparent; color:var(--mist); border:1px solid rgba(255,255,255,.4); padding:8px 16px; min-height:36px; }
  /* The header's style above is for the dark bar; inside the page cards it needs dark text. */
  main button.secondary { background:#fff; color:var(--brick); border:1px solid var(--line); }
  button.danger { background:transparent; color:#a33; border:1px solid #e3b5b5; padding:6px 14px; min-height:36px; font-weight:500; }
  button:disabled { opacity:.5; cursor:default; }
  input[type=password], input[type=text] { font:inherit; width:100%; padding:12px 14px; border:1px solid var(--line); border-radius:12px; margin-bottom:12px; }
  label.field { display:block; font-size:14px; font-weight:600; margin-bottom:6px; }
  input[type=date], input[type=number], select { font:inherit; width:100%; padding:11px 12px; border:1px solid var(--line); border-radius:12px; margin-bottom:12px; background:#fff; color:var(--ink); }
  .row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .switch { display:flex; align-items:center; gap:12px; margin:4px 0 18px; cursor:pointer; font-weight:600; }
  .switch input { position:absolute; opacity:0; width:1px; height:1px; }
  .switch .track { width:52px; height:30px; border-radius:999px; background:#cfc6bb; position:relative; transition:.2s; flex:none; }
  .switch .track::after { content:''; position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:.2s; }
  .switch input:checked + .track { background:var(--ok); }
  .switch input:checked + .track::after { transform:translateX(22px); }
  .switch .on { color:var(--ok); }
  .switch .off { color:#a33; }
  .warn { color:#8a5a00; background:#fbf1dc; border-radius:12px; padding:10px 12px; }
  .switch input:focus-visible + .track { outline:2px solid var(--brick); outline-offset:2px; }
  .status { border-radius:12px; padding:12px 14px; font-size:14px; margin-bottom:16px; line-height:1.45; }
  .status.live { background:#e7f3ea; color:#1f5a2b; }
  .status.wait { background:#fbf1dc; color:#7a5a12; }
  .status.off { background:#f1ece6; color:#6b625b; }
  .sub { font-size:13px; color:#6b625b; margin:-6px 0 14px; }
  .actions { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
  .pics { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:16px; }
  @media (max-width: 520px) { .pics { grid-template-columns:repeat(2, 1fr); } }
  .pic { position:relative; cursor:pointer; border-radius:12px; overflow:hidden; border:3px solid transparent; }
  .pic input { position:absolute; opacity:0; }
  .pic img { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; }
  .pic span { position:absolute; left:0; right:0; bottom:0; font-size:11px; color:#fff; padding:14px 6px 5px; background:linear-gradient(transparent, rgba(0,0,0,.7)); }
  .pic:has(input:checked) { border-color:var(--brick); }
  .pic:has(input:checked)::after { content:'✓'; position:absolute; top:6px; right:6px; width:24px; height:24px; border-radius:50%; background:var(--brick); color:#fff; font-size:14px; display:flex; align-items:center; justify-content:center; }
  .pic:has(input:focus-visible) { outline:2px solid var(--brick); outline-offset:2px; }
  a.btn-link { color:var(--brick); font-weight:600; text-decoration:none; padding:10px 4px; }
  .okmsg { color:var(--ok); }
  .drop { display:block; border:2px dashed var(--line); border-radius:16px; padding:32px 16px; text-align:center; cursor:pointer; transition:.2s; }
  .drop.over { border-color:var(--brick); background:#fbf6f2; }
  .drop strong { display:block; margin-bottom:6px; }
  #progress { margin-top:14px; font-size:14px; }
  #progress div { padding:4px 0; }
  #progressBar { height:8px; border-radius:999px; background:#eee; overflow:hidden; margin-top:14px; }
  #progressBar div { height:100%; width:0; background:var(--ok); transition:width .3s; }
  #progressSummary { font-weight:600; margin-top:8px; }
  .more { margin-top:16px; background:transparent; color:var(--brick); border:1px solid var(--line); }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); gap:14px; }
  .ph { background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; display:flex; flex-direction:column; }
  .ph img { width:100%; aspect-ratio:3/2; object-fit:cover; display:block; background:#eee; }
  .ph .meta { padding:10px 12px; font-size:13px; flex:1; display:flex; flex-direction:column; gap:8px; }
  .badge { align-self:flex-start; display:inline-block; font-size:12px; font-weight:600; padding:3px 9px; border-radius:999px; background:var(--ok); color:#fff; }
  .badge.tomorrow { background:#b08a2e; }
  .muted { color:#6b625b; }
  .check { display:flex; gap:10px; align-items:center; margin:0 0 6px; font-weight:600; cursor:pointer; }
  .check input { width:20px; height:20px; margin:0; }
  .check:has(input:disabled) { opacity:.55; cursor:default; }
  a.btn { display:inline-block; background:var(--brick); color:#fff; text-decoration:none; font-weight:600; padding:12px 18px; border-radius:12px; }
  .log { list-style:none; padding:0; margin:0; font-size:13px; }
  .kpis { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:16px; }
  .kpi { background:#fbf6f2; border-radius:12px; padding:12px; text-align:center; }
  .kpi b { display:block; font-size:28px; line-height:1.1; }
  .kpi span { font-size:12px; color:#6b625b; }
  .bars { display:flex; align-items:flex-end; gap:3px; height:110px; padding:6px 0; border-bottom:1px solid var(--line); }
  .bars div { flex:1; background:var(--brick); border-radius:3px 3px 0 0; min-height:2px; opacity:.85; }
  .bars div.we { opacity:.55; }
  .bars-x { display:flex; justify-content:space-between; font-size:11px; color:#6b625b; margin:4px 0 16px; }
  .tops { display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:14px; }
  .tops h3 { font-size:13px; margin:0 0 6px; color:#6b625b; font-weight:600; }
  .tops ol { list-style:none; margin:0; padding:0; font-size:13px; }
  .tops li { display:flex; justify-content:space-between; gap:8px; padding:4px 0; border-bottom:1px solid var(--line); }
  .tops li span:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sections { list-style:none; padding:0; margin:0 0 14px; counter-reset:sec; }
  .sections li { display:flex; align-items:center; gap:10px; padding:8px 10px; border:1px solid var(--line); border-radius:12px; margin-bottom:6px; background:#fff; counter-increment:sec; }
  .sections li::before { content:counter(sec); width:24px; text-align:right; color:#6b625b; font-size:13px; }
  .sections li span { flex:1; font-weight:600; }
  .sections li button { padding:6px 12px; font-size:16px; line-height:1; background:#fff; color:var(--brick); border:1px solid var(--line); }
  .sections li button:disabled { opacity:.3; }
  .sections li.moved { background:#fbf6f2; }
  .sections li.off span { color:#a39a92; text-decoration:line-through; }
  .sections li.off { background:#f4f1ed; }
  .vis { display:flex; align-items:center; gap:6px; font-size:12px; color:#6b625b; cursor:pointer; margin-right:6px; white-space:nowrap; }
  .vis input { width:18px; height:18px; margin:0; }
  .panel { border:1px solid var(--line); border-radius:14px; padding:14px; margin-top:14px; background:#fffdf9; }
  .panel ol { padding-left:20px; margin:0; }
  .panel li { margin-bottom:14px; line-height:1.45; }
  .copyrow { display:flex; gap:8px; align-items:flex-start; margin-top:6px; }
  .copyrow textarea, .copyrow input { flex:1; font:inherit; font-size:14px; padding:8px 10px; border:1px solid var(--line); border-radius:10px; margin:0; }
  .copyrow button { flex:none; padding:8px 14px; font-size:13px; font-weight:600; background:#fff; color:var(--brick); border:1px solid var(--brick); opacity:1; }
  .panel img { max-width:260px; width:100%; border-radius:10px; display:block; margin-top:6px; }
  .field-label { font-size:12px; color:#6b625b; margin-top:8px; display:block; }
  .log li { padding:6px 0; border-bottom:1px solid var(--line); }
  .log .ko { color:#a33; }
  .ph select.season { font-size:13px; padding:6px 8px; margin:0; border-radius:10px; }
  .ph select.season.neve { background:#e8f0fa; }
  .ph select.season.verde { background:#e7f3ea; }
  .season-pick { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
  .season-pick label { flex:1 1 150px; border:2px solid var(--line); border-radius:12px; padding:10px 12px; cursor:pointer; font-size:14px; line-height:1.35; }
  .season-pick input { margin-right:6px; }
  .season-pick label:has(input:checked) { border-color:var(--brick); background:#fbf6f2; }
  .season-pick small { display:block; color:#6b625b; font-size:12px; margin-top:2px; }
  .error { color:#a33; }
  .hidden { display:none !important; }
  .today { display:grid; grid-template-columns: 1fr; gap:16px; align-items:center; }
  .today img { width:100%; max-height:360px; object-fit:cover; border-radius:12px; }
  @media (min-width: 700px) { .today { grid-template-columns: 1.4fr 1fr; } }
</style>
</head>
<body>
<header>
  <h1>Ironwood Livigno · Foto del giorno</h1>
  <button id="logout" class="secondary hidden">Esci</button>
</header>
<main>
  <section id="login" class="card hidden">
    <h2>Accesso</h2>
    <p class="hint">Inserisci nome utente e password dell'area admin.</p>
    <form id="loginForm">
      <input type="text" id="user" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="Nome utente" required>
      <input type="password" id="password" autocomplete="current-password" placeholder="Password" required>
      <button type="submit">Entra</button>
      <p id="loginError" class="error"></p>
    </form>
  </section>

  <div id="panel" class="hidden">
    <section class="card" id="visite">
      <h2>Visite al sito</h2>
      <div id="statsBox"><p class="hint">Caricamento…</p></div>
      <div class="actions"><button type="button" id="statsReset" class="danger">Azzera statistiche</button></div>
      <p id="statsResetMsg" class="sub"></p>
    </section>

    <section class="card" id="nigi">
      <h2>Assistente NIGI (chat sul sito)</h2>
      <p class="hint">NIGI risponde ai visitatori in tutte le lingue, 24 ore su 24. Le risposte usano l’intelligenza artificiale gratuita di Cloudflare (fino a 500 al giorno, poi NIGI propone WhatsApp). Per date, prezzi e prenotazioni NIGI rimanda sempre a WhatsApp, email o al modulo.</p>
      <div id="chatStatus" class="status off">Caricamento…</div>
      <label class="switch"><input type="checkbox" id="chatActive" disabled><span class="track"></span><span id="chatSwitchText">…</span></label>
      <div id="chatStats"></div>
      <div class="actions"><a class="btn-link" href="/it?anteprima-nigi" target="_blank" rel="noopener">Prova NIGI →</a></div>
      <p id="chatMsg" class="sub"></p>
    </section>

    <section class="card">
      <h2>Offerta speciale (pop-up sul sito)</h2>
      <p class="hint">Inserisci date e prezzo: il pop-up, già pronto e tradotto in tutte le 12 lingue, compare ai visitatori del sito nel periodo che scegli, con i pulsanti per prenotare via WhatsApp o email.</p>
      <div id="offerStatus" class="status off">Nessuna offerta salvata.</div>
      <form id="offerForm" autocomplete="off">
        <label class="switch"><input type="checkbox" id="offerActive" checked><span class="track"></span><span id="offerSwitchText">Pop-up ACCESO</span></label>
        <div class="row2">
          <div><label class="field" for="offerCheckIn">Arrivo</label><input type="date" id="offerCheckIn" required></div>
          <div><label class="field" for="offerCheckOut">Partenza</label><input type="date" id="offerCheckOut" required></div>
        </div>
        <p id="offerNights" class="sub"></p>
        <details id="offerMore">
          <summary class="field">Altri periodi allo stesso prezzo (facoltativi)</summary>
          <p class="sub" style="margin-top:6px">Es. i due weekend successivi: nel pop-up il cliente sceglie il periodo che preferisce. I periodi già iniziati spariscono da soli dal sito.</p>
          <div id="offerExtra"></div>
          <button type="button" id="offerAddStay" class="secondary">+ Aggiungi un periodo</button>
        </details>
        <div class="row2">
          <div><label class="field" for="offerPrice">Prezzo offerta (€)</label><input type="number" id="offerPrice" min="1" step="1" inputmode="numeric" required></div>
          <div><label class="field" for="offerUnit">Il prezzo è</label>
            <select id="offerUnit"><option value="stay">per tutto il soggiorno</option><option value="night">a notte</option></select></div>
        </div>
        <label class="field" for="offerOriginal">Prezzo pieno, facoltativo (€)</label>
        <input type="number" id="offerOriginal" min="1" step="1" inputmode="numeric" placeholder="es. 1200 — sul sito appare barrato con lo sconto in %">
        <div class="row2">
          <div><label class="field" for="offerFrom">Inizio offerta</label><input type="date" id="offerFrom" required></div>
          <div><label class="field" for="offerUntil">Fine offerta</label><input type="date" id="offerUntil" required></div>
        </div>
        <p class="sub">Il pop-up è visibile dall’inizio alla fine dell’offerta (compresa), se l’interruttore è attivo.</p>
        <label class="field">Foto del pop-up</label>
        <div class="pics" id="offerPics"></div>
        <label class="check" id="offerGoogleRow"><input type="checkbox" id="offerGoogle"> Pubblica anche su Google come post “Offerta”</label>
        <p class="sub" id="offerGoogleHint"></p>
        <div class="actions">
          <button type="submit">Salva offerta</button>
          <a class="btn-link" href="/it?anteprima-offerta" target="_blank" rel="noopener">Vedi anteprima →</a>
        </div>
        <p id="offerMsg"></p>
      </form>
    </section>

    <section class="card">
      <h2>Oggi sul sito</h2>
      <div id="todayBox" class="today"></div>
    </section>

    <section class="card">
      <h2>Aggiungi foto</h2>
      <p class="hint">Scegli una o più foto, anche direttamente dal telefono. Vengono ridotte e alleggerite automaticamente prima dell'invio (lato lungo 1600 px, circa 150–300 KB). Ogni giorno a mezzanotte la foto sul sito cambia, seguendo l'ordine di caricamento, e ricomincia dalla prima dopo l'ultima.</p>
      <p class="hint"><strong>1. Di che stagione sono le foto che carichi?</strong> Le foto con la neve compaiono solo da dicembre ad aprile, quando gli impianti sono aperti; quelle senza neve da maggio a novembre. Puoi cambiarla dopo, foto per foto, qui sotto.</p>
      <div class="season-pick" id="seasonPick">
        <label><input type="radio" name="uploadSeason" value="neve">❄️ Con neve<small>dicembre – aprile</small></label>
        <label><input type="radio" name="uploadSeason" value="verde">🌿 Senza neve<small>maggio – novembre</small></label>
        <label><input type="radio" name="uploadSeason" value="sempre">🏠 Tutto l'anno<small>interni, dettagli, foto senza stagione</small></label>
      </div>
      <p class="hint"><strong>2. Scegli le foto</strong></p>
      <label class="drop" id="drop">
        <strong>Tocca per scegliere le foto</strong>
        <span class="muted">oppure trascinale qui</span>
        <input type="file" id="files" accept="image/*" multiple hidden>
      </label>
      <div id="progressBar" class="hidden"><div></div></div>
      <p id="progressSummary"></p>
      <div id="progress"></div>
    </section>

    <section class="card">
      <h2>Foto in rotazione <span id="count" class="muted"></span></h2>
      <div id="grid" class="grid"></div>
      <button type="button" id="more" class="more hidden">Mostra altre foto</button>
      <p id="empty" class="hint hidden">Nessuna foto ancora: finché non ne carichi una, sul sito compare una foto di Livigno già presente.</p>
    </section>

    <section class="card" id="ordine">
      <h2>Sezioni della home</h2>
      <p class="hint">Sposta le sezioni con le frecce e nascondi quelle che non vuoi con l’interruttore, poi premi “Salva”: la home cambia in tutte le lingue entro un paio di minuti. Una sezione nascosta non è cancellata: la riaccendi quando vuoi. Con lei spariscono anche le voci del menu e i pulsanti che portano lì. La foto grande in cima resta sempre la prima.</p>
      <ol id="sectionList" class="sections"></ol>
      <div class="actions">
        <button type="button" id="saveOrder">Salva</button>
        <button type="button" id="resetOrder" class="secondary">Ripristina tutto com’era</button>
        <a class="btn-link" href="/it" target="_blank" rel="noopener">Vedi la home →</a>
      </div>
      <p id="orderMsg"></p>
    </section>

    <section class="card" id="recensioni">
      <h2>Chiedi una recensione</h2>
      <p class="hint">Più recensioni su Google = più visibilità su Google Maps. Quando un ospite parte, mandagli il messaggio qui sotto su WhatsApp: il link porta dritto alla pagina “Scrivi una recensione” di Ironwood Livigno.</p>
      <div id="reviewBox"></div>
    </section>

    <section class="card" id="google">
      <h2>Google Business Profile</h2>
      <p class="hint">Porta su Google le offerte e una foto a settimana. Il sito prepara tutto (testo già scritto per la stagione, foto in JPG, il formato che Google accetta): tu copi, incolli e premi Pubblica.</p>
      <div class="actions">
        <button type="button" id="prepOffer">Prepara post dell’offerta</button>
        <button type="button" id="prepPhoto">Prepara foto della settimana</button>
      </div>
      <p id="manualLast" class="sub"></p>
      <div id="manualPanel" class="panel hidden"></div>
      <div id="googleStatus" class="status off">Caricamento…</div>
      <div id="googleConnected" class="hidden">
        <label class="switch"><input type="checkbox" id="googleWeekly"><span class="track"></span><span>Foto della settimana su Google (ogni lunedì)</span></label>
        <div class="actions">
          <button type="button" id="googlePhotoNow" class="secondary">Pubblica ora una foto</button>
          <button type="button" id="googleDisconnect" class="secondary">Scollega</button>
        </div>
        <p id="googleMsg"></p>
        <h3 class="sub">Ultime attività</h3>
        <ul id="googleLog" class="log"></ul>
      </div>
      <div class="actions"><a id="googleConnect" class="btn hidden" href="/api/admin/google/connect">Collega a Google</a></div>
    </section>

    <section class="card">
      <h2>Utente e password</h2>
      <p class="hint">Qui puoi cambiare il nome utente e la password per entrare. La password deve avere almeno 8 caratteri. Dopo il cambio, gli altri dispositivi collegati dovranno rientrare con i nuovi dati.</p>
      <form id="credForm" autocomplete="off">
        <label class="field" for="newUser">Nome utente</label>
        <input type="text" id="newUser" autocomplete="username" autocapitalize="none" spellcheck="false" required minlength="3" maxlength="40">
        <label class="field" for="newPassword">Nuova password</label>
        <input type="password" id="newPassword" autocomplete="new-password" required minlength="8" maxlength="128">
        <label class="field" for="newPassword2">Ripeti la nuova password</label>
        <input type="password" id="newPassword2" autocomplete="new-password" required minlength="8" maxlength="128">
        <label class="field" for="currentPassword">Password attuale (per conferma)</label>
        <input type="password" id="currentPassword" autocomplete="current-password" required>
        <button type="submit">Salva</button>
        <p id="credMsg"></p>
      </form>
    </section>
  </div>
</main>

<script>
const $ = (id) => document.getElementById(id);
const MAX_SIDE = 1600;

async function api(path, options = {}) {
  const res = await fetch('/api/admin/' + path, { credentials: 'same-origin', ...options });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) { showLogin(); throw new Error(data.error || 'Accesso richiesto'); }
  if (!res.ok) { const e = new Error(data.error || ('Errore ' + res.status)); e.data = data; e.status = res.status; throw e; }
  return data;
}

function showLogin() {
  $('login').classList.remove('hidden');
  $('panel').classList.add('hidden');
  $('logout').classList.add('hidden');
  $('user').focus();
}

function showPanel() {
  $('login').classList.add('hidden');
  $('panel').classList.remove('hidden');
  $('logout').classList.remove('hidden');
}

$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('loginError').textContent = '';
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    await api('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: $('user').value, password: $('password').value }) });
    $('password').value = '';
    await load();
  } catch (err) {
    $('loginError').textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});

// ---- special offer ----
function addDaysISO(date, n) { return new Date(Date.parse(date + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10); }
function fmtDate(date) { return new Date(date + 'T00:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
function nights() {
  const a = $('offerCheckIn').value, b = $('offerCheckOut').value;
  if (!a || !b) return 0;
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}
function updateNights() {
  const n = nights();
  $('offerNights').textContent = n > 0 ? n + (n === 1 ? ' notte' : ' notti') : (n < 0 ? 'La partenza deve essere dopo l’arrivo' : '');
}
['offerCheckIn', 'offerCheckOut'].forEach((id) => $(id).addEventListener('change', updateNights));

function updateSwitchText() {
  const on = $('offerActive').checked;
  const el = $('offerSwitchText');
  el.textContent = on ? 'Pop-up ACCESO' : 'Pop-up SPENTO';
  el.className = on ? 'on' : 'off';
}

function showOfferStatus(offer, today) {
  const box = $('offerStatus');
  if (!offer) { box.className = 'status off'; box.textContent = 'Nessuna offerta salvata.'; return; }
  const stays = [offer].concat(offer.extraStays || []);
  const period = (stays.length > 1 ? 'soggiorni ' : 'soggiorno ') + stays.map((s) => 'dal ' + fmtDate(s.checkIn) + ' al ' + fmtDate(s.checkOut)).join(' oppure ') + ', ' + offer.price + ' €' + (offer.unit === 'night' ? ' a notte' : '');
  if (!offer.active) { box.className = 'status off'; box.textContent = 'Pop-up spento (' + period + ').'; }
  else if (today < offer.showFrom) { box.className = 'status wait'; box.textContent = 'Programmato: il pop-up comparirà dal ' + fmtDate(offer.showFrom) + ' (' + period + ').'; }
  else if (today > offer.showUntil) { box.className = 'status off'; box.textContent = 'Offerta scaduta il ' + fmtDate(offer.showUntil) + ': il pop-up non si vede più.'; }
  else { box.className = 'status live'; box.textContent = '● Visibile ora sul sito fino al ' + fmtDate(offer.showUntil) + ' (' + period + ').'; }
}

let offerBaseId = null;

// Extra periods at the same price: one row per period, added with the button.
// Same limit as MAX_EXTRA_STAYS in worker/offer.ts.
const EXTRA_ROWS = 9;
function addStayRow(st) {
  const box = $('offerExtra');
  const row = document.createElement('div');
  row.className = 'row2';
  row.innerHTML = '<div><label class="field">Arrivo</label><input type="date"></div><div><label class="field">Partenza</label><input type="date"></div>';
  const [a, b] = row.querySelectorAll('input');
  a.value = st ? st.checkIn : '';
  b.value = st ? st.checkOut : '';
  // A new arrival proposes the same length of stay as the main period.
  a.addEventListener('change', () => { if (a.value && !b.value && nights() > 0) b.value = addDaysISO(a.value, nights()); });
  box.appendChild(row);
  $('offerAddStay').hidden = box.children.length >= EXTRA_ROWS;
  return a;
}
$('offerAddStay').addEventListener('click', () => addStayRow().focus());

// Same list and default as OFFER_IMAGES in worker/offer.ts.
const OFFER_PICS = [
  ['esterno-giorno', 'La casa di giorno (foto piccola: sul computer meno nitida)'],
  ['esterno-notte', 'La casa di notte, con la neve'],
  ['hero-ironwood', 'Soggiorno con camino'],
  ['soggiorno', 'Divano e legno'],
  ['sauna-vista-montagna', 'Sauna con vista'],
  ['camera1', 'Camera matrimoniale'],
  ['lago-livigno-panorama', 'Lago di Livigno in autunno (foto piccola: sul computer meno nitida)'],
  ['livigno-ghiaccioli-vista-vallata', 'Vallata d’inverno']
];
$('offerPics').innerHTML = OFFER_PICS.map(([key, label]) =>
  '<label class="pic"><input type="radio" name="offerImage" value="' + key + '"><img src="/images/' + key + '-480.webp" alt="" loading="lazy"><span>' + label + '</span></label>'
).join('');
function selectedPic() { const r = document.querySelector('input[name=offerImage]:checked'); return r ? r.value : OFFER_PICS[0][0]; }

function fillOffer(offer, today) {
  offerBaseId = offer ? offer.id : null;
  const pic = (offer && offer.image) || OFFER_PICS[0][0];
  document.querySelectorAll('input[name=offerImage]').forEach((r) => { r.checked = r.value === pic; });
  // A new offer starts switched on: the point of filling it in is to show it.
  $('offerActive').checked = offer ? offer.active : true;
  updateSwitchText();
  $('offerCheckIn').value = offer ? offer.checkIn : '';
  $('offerCheckOut').value = offer ? offer.checkOut : '';
  const extra = (offer && offer.extraStays) || [];
  $('offerExtra').innerHTML = '';
  extra.forEach((st) => addStayRow(st));
  $('offerMore').open = extra.length > 0;
  $('offerPrice').value = offer ? offer.price : '';
  $('offerUnit').value = offer ? offer.unit : 'stay';
  $('offerOriginal').value = offer && offer.originalPrice ? offer.originalPrice : '';
  $('offerFrom').value = offer ? offer.showFrom : today;
  $('offerUntil').value = offer ? offer.showUntil : addDaysISO(today, 14);
  $('offerGoogle').checked = Boolean(offer && offer.google);
  updateNights();
  showOfferStatus(offer, today);
}

// ---- NIGI chat ----
function showChat(data) {
  const on = data.settings.active;
  $('chatActive').checked = on;
  $('chatActive').disabled = false;
  const t = $('chatSwitchText');
  t.textContent = on ? 'NIGI ACCESO' : 'NIGI SPENTO';
  t.className = on ? 'on' : 'off';
  const st = $('chatStatus');
  st.className = 'status ' + (on ? 'live' : 'off');
  st.textContent = on
    ? 'NIGI è attivo: i visitatori vedono il pulsante della chat in basso a destra su tutte le pagine.'
    : 'NIGI è spento: sul sito la chat non compare. Puoi comunque provarlo con “Prova NIGI”.';
  const d = data.stats.today, m = data.stats.month;
  const row = (label, v) => '<div><strong>' + v + '</strong><span class="muted"> ' + label + '</span></div>';
  let html = '<div class="row2" style="margin-bottom:12px">'
    + '<div><p style="font-weight:600;margin:0 0 6px">Oggi</p>' + row('chat aperte', d.open) + row('risposte AI su ' + data.limit + ' al giorno', d.ai) + '</div>'
    + '<div><p style="font-weight:600;margin:0 0 6px">Ultimi 30 giorni</p>' + row('chat aperte', m.open) + row('risposte AI', m.ai) + '</div>'
    + '</div>';
  if (d.limited) html += '<p class="warn">Oggi il limite di ' + data.limit + ' risposte AI è stato raggiunto ' + d.limited + ' volte: a quei visitatori NIGI ha proposto WhatsApp. Il limite si azzera a mezzanotte.</p>';
  if (d.error) html += '<p class="sub">Oggi l’AI non ha risposto ' + d.error + ' volte (NIGI ha proposto WhatsApp).</p>';
  html += '<p class="sub">Contiamo solo i numeri: quello che scrivono i visitatori non viene salvato. Le tue prove dall’admin non contano nelle chat aperte.</p>';
  $('chatStats').innerHTML = html;
}

async function loadChat() {
  showChat(await api('chat'));
}

$('chatActive').addEventListener('change', async () => {
  const box = $('chatActive');
  const want = box.checked;
  box.disabled = true;
  $('chatMsg').className = 'sub';
  $('chatMsg').textContent = 'Salvataggio…';
  try {
    await api('chat', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: want }) });
    await loadChat();
    $('chatMsg').className = 'okmsg';
    $('chatMsg').textContent = (want ? 'NIGI acceso.' : 'NIGI spento.') + ' Sul sito il cambiamento si vede entro 1–2 minuti.';
  } catch (err) {
    box.checked = !want;
    box.disabled = false;
    $('chatMsg').className = 'error';
    $('chatMsg').textContent = err.message;
  }
});

async function loadOffer() {
  const data = await api('offer');
  fillOffer(data.offer, data.today);
}

$('offerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('offerMsg');
  msg.className = ''; msg.textContent = '';
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    const data = await api('offer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseId: offerBaseId,
        image: selectedPic(),
        active: $('offerActive').checked,
        checkIn: $('offerCheckIn').value,
        checkOut: $('offerCheckOut').value,
        extraStays: Array.from(document.querySelectorAll('#offerExtra .row2')).map((row) => {
          const [a, b] = row.querySelectorAll('input');
          return { checkIn: a.value, checkOut: b.value };
        }),
        price: $('offerPrice').value,
        unit: $('offerUnit').value,
        originalPrice: $('offerOriginal').value,
        showFrom: $('offerFrom').value,
        showUntil: $('offerUntil').value,
        google: $('offerGoogle').checked
      })
    });
    fillOffer(data.offer, data.today);
    const o = data.offer;
    $('offerGoogleHint').textContent = data.googleMessage || '';
    if (data.googleMessage) loadGoogle().catch(() => {});
    if (!o.active) {
      msg.className = 'warn';
      msg.textContent = 'Offerta salvata, ma il pop-up è SPENTO: sul sito non si vede. Tocca l’interruttore per accenderlo.';
    } else if (data.today < o.showFrom) {
      msg.className = 'warn';
      msg.textContent = 'Offerta salvata: comparirà sul sito dal ' + fmtDate(o.showFrom) + '.';
    } else if (data.today > o.showUntil) {
      msg.className = 'warn';
      msg.textContent = 'Offerta salvata, ma la fine offerta è già passata: sposta la data di fine per mostrarla.';
    } else {
      msg.className = 'okmsg';
      msg.textContent = 'Offerta salvata e visibile sul sito (entro un paio di minuti).';
    }
  } catch (err) {
    msg.className = 'error';
    msg.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});
// Switching the pop-up on or off saves right away.
$('offerActive').addEventListener('change', () => {
  updateSwitchText();
  if (!$('offerCheckIn').value || !$('offerPrice').value) return;
  const form = $('offerForm');
  // requestSubmit is missing on older iPhones (Safari before 16).
  if (form.requestSubmit) form.requestSubmit(); else form.querySelector('button[type=submit]').click();
});

// ---- Google Business Profile ----
async function loadGoogle() {
  const g = await api('google');
  const box = $('googleStatus');
  $('googleConnect').classList.toggle('hidden', !g.configured || g.connected);
  $('googleConnected').classList.toggle('hidden', !g.connected);
  $('offerGoogle').disabled = !g.connected;
  if (!g.connected) $('offerGoogle').checked = false;
  $('offerGoogleRow').classList.toggle('hidden', !g.configured);
  refreshManualLast();
  if (!layout) loadLayout().catch(() => {});
  loadStats().catch((err) => { $('statsBox').innerHTML = '<p class="warn"></p>'; $('statsBox').firstChild.textContent = 'Visite non disponibili: ' + err.message; });
  if (!g.configured) {
    box.className = 'status off';
    box.textContent = 'Google non concede la pubblicazione automatica a una singola struttura: usa i due pulsanti qui sopra, ci vuole meno di un minuto.';
  } else if (!g.connected) {
    box.className = 'status off';
    box.textContent = 'Non collegato. Premi “Collega a Google” ed entra con l’account proprietario del profilo.';
  } else {
    box.className = 'status live';
    box.textContent = '● Collegato a “' + g.title + '” · foto inviate finora: ' + g.sentPhotos;
    $('googleWeekly').checked = g.weekly;
  }
  $('googleLog').innerHTML = '';
  g.log.forEach((l) => {
    const li = document.createElement('li');
    li.className = l.ok ? '' : 'ko';
    li.textContent = new Date(l.at).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' · ' + l.text;
    $('googleLog').append(li);
  });
}
$('googleWeekly').addEventListener('change', async () => {
  try { await api('google', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ weekly: $('googleWeekly').checked }) }); await loadGoogle(); }
  catch (err) { alert(err.message); }
});
$('googlePhotoNow').addEventListener('click', async (e) => {
  e.target.disabled = true;
  try { const r = await api('google/photo-now', { method: 'POST' }); $('googleMsg').textContent = r.message; await loadGoogle(); }
  catch (err) { $('googleMsg').textContent = err.message; }
  finally { e.target.disabled = false; }
});
$('googleDisconnect').addEventListener('click', async () => {
  if (!confirm('Scollegare il profilo Google? Offerte e foto non verranno più pubblicate su Google.')) return;
  try { await api('google/disconnect', { method: 'POST' }); await loadGoogle(); }
  catch (err) { alert(err.message); }
});
// ---- visits ----
const regionName = (() => { try { return new Intl.DisplayNames(['it'], { type: 'region' }); } catch (e) { return null; } })();
function flag(cc) { return /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : '🌍'; }
function countryLabel(cc) { if (cc === 'XX') return '🌍 Sconosciuto'; let n = cc; try { n = regionName ? regionName.of(cc) : cc; } catch (e) {} return flag(cc) + ' ' + n; }
function pageLabel(p) {
  if (p === '(sconosciuta)') return 'Pagina sconosciuta';
  const m = p.match(new RegExp('^/(it|en|de|fr|da|pl|cs|no|nl|zh|ja|en-us)$'));
  if (m) return 'Home (' + m[1].toUpperCase() + ')';
  return p;
}
function topList(title, rows, label) {
  const box = document.createElement('div');
  const h = document.createElement('h3'); h.textContent = title;
  const ol = document.createElement('ol');
  if (!rows.length) { const li = document.createElement('li'); li.textContent = 'Ancora nessun dato'; ol.append(li); }
  rows.forEach((r) => {
    const li = document.createElement('li');
    const a = document.createElement('span'); a.textContent = label(r.key); a.title = r.key;
    const b = document.createElement('span'); b.textContent = r.views;
    li.append(a, b); ol.append(li);
  });
  box.append(h, ol);
  return box;
}
async function loadStats() {
  // This device belongs to the owner: stop counting its visits and clicks (see isOwnerDevice in index.ts).
  document.cookie = 'iw_nostats=1; Max-Age=63072000; Path=/; Secure; SameSite=Lax';
  const s = await api('stats');
  const box = $('statsBox');
  box.innerHTML = '';
  const kpis = document.createElement('div'); kpis.className = 'kpis';
  [['Oggi', s.today], ['Ultimi 7 giorni', s.week], ['Ultimi 30 giorni', s.month]].forEach(([l, v]) => {
    const k = document.createElement('div'); k.className = 'kpi';
    k.innerHTML = '<b></b><span></span>'; k.querySelector('b').textContent = v; k.querySelector('span').textContent = l + ' (pagine viste)';
    kpis.append(k);
  });
  const max = Math.max(1, ...s.days.map((d) => d.views));
  const bars = document.createElement('div'); bars.className = 'bars';
  s.days.forEach((d) => {
    const bar = document.createElement('div');
    const dow = new Date(d.day + 'T00:00:00Z').getUTCDay();
    if (dow === 0 || dow === 6) bar.className = 'we';
    bar.style.height = Math.round((d.views / max) * 100) + '%';
    bar.title = new Date(d.day + 'T00:00:00Z').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }) + ': ' + d.views;
    bars.append(bar);
  });
  const x = document.createElement('div'); x.className = 'bars-x';
  const fmt = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  x.innerHTML = '<span></span><span>oggi</span>'; x.firstChild.textContent = fmt(s.days[0].day);
  const tops = document.createElement('div'); tops.className = 'tops';
  tops.append(topList('Da quali paesi (30 giorni)', s.countries, countryLabel), topList('Pagine più viste', s.pages, pageLabel), topList('Da dove arrivano', s.sources, (k) => k));
  // Contact actions (clicks counted by the site, no personal data).
  const EVENT_LABELS = { whatsapp: 'WhatsApp aperto', email: 'Email aperta', phone: 'Telefono (chiamata)', form: 'Modulo di richiesta inviato', tour: 'Tour 360° aperto', map: 'Mappa aperta' };
  const ev = s.events || [];
  tops.append(
    topList('Contatti e azioni (30 giorni)', ev, (k) => EVENT_LABELS[k] || k),
    topList('Da quali pagine partono i contatti', s.eventPages || [], pageLabel)
  );
  const note = document.createElement('p'); note.className = 'sub';
  note.style.marginTop = '14px';
  note.textContent = (s.since ? 'Conteggio attivo dal ' + fmt(s.since) + '. ' : 'Il conteggio parte con la prossima visita. ') +
    'Conta le pagine aperte da persone vere (non i robot); nessun dato personale, niente cookie. Passa il dito o il mouse su una barra per vedere il giorno.' +
    (s.eventsSince ? ' Contatti e azioni contati dal ' + fmt(s.eventsSince) + '.' : ' Contatti e azioni: il conteggio parte con il primo clic.') +
    ' Le tue visite da questo dispositivo (e da ogni dispositivo su cui apri l’admin) non vengono contate dal 2 ottobre 2026.';
  box.append(kpis, bars, x, tops, note);
}

$('statsReset').addEventListener('click', async (e) => {
  if (!confirm('Cancellare TUTTE le visite e i clic contati finora? Non si possono recuperare. Il conteggio ripartirà da zero (senza contare i tuoi dispositivi).')) return;
  e.target.disabled = true;
  try {
    await api('stats/reset', { method: 'POST' });
    await loadStats();
    $('statsResetMsg').textContent = 'Statistiche azzerate: da ora si contano solo gli ospiti.';
  } catch (err) {
    $('statsResetMsg').textContent = 'Non è riuscito: ' + err.message;
  } finally {
    e.target.disabled = false;
  }
});

// ---- homepage section order ----
let layout = null;
function renderSections() {
  const ol = $('sectionList');
  ol.innerHTML = '';
  const label = (id) => layout.sections.find((s) => s.id === id).label;
  layout.order.forEach((id, i) => {
    const li = document.createElement('li');
    if (layout.sections[i].id !== id) li.className = 'moved';
    const shown = !layout.hidden.includes(id);
    if (!shown) li.className = 'off';
    li.innerHTML = '<span></span><label class="vis"><input type="checkbox"><em></em></label>' +
      '<button type="button" aria-label="Sposta su">↑</button><button type="button" aria-label="Sposta giù">↓</button>';
    li.querySelector('span').textContent = label(id);
    const box = li.querySelector('.vis input');
    box.checked = shown;
    box.setAttribute('aria-label', 'Mostra ' + label(id));
    li.querySelector('.vis em').textContent = shown ? 'Visibile' : 'Nascosta';
    box.addEventListener('change', () => toggleHidden(id, box));
    const [up, down] = li.querySelectorAll('button');
    up.disabled = i === 0;
    down.disabled = i === layout.order.length - 1;
    up.addEventListener('click', () => move(i, -1));
    down.addEventListener('click', () => move(i, 1));
    ol.append(li);
  });
}
// Sections that menus and buttons elsewhere on the site link to.
// Links to a hidden section disappear by themselves on the pages with the site
// menu; the booking form is the one whose loss matters, so it still asks.
const LINKED = {
  prenota: 'è il modulo per prenotare. Nascondendola spariscono anche i pulsanti “Richiedi disponibilità” della home e del menu, ma quelli negli articoli del blog e nelle pagine tematiche continuerebbero a portare alla home senza modulo.'
};
function toggleHidden(id, box) {
  if (!box.checked && LINKED[id] && !confirm('Attenzione: ' + LINKED[id] + ' Nasconderla lo stesso?')) { box.checked = true; return; }
  layout.hidden = box.checked ? layout.hidden.filter((h) => h !== id) : layout.hidden.concat(id);
  $('orderMsg').className = 'warn';
  $('orderMsg').textContent = 'Ricorda di premere “Salva”.';
  renderSections();
}
function move(i, dir) {
  const o = layout.order;
  [o[i], o[i + dir]] = [o[i + dir], o[i]];
  $('orderMsg').className = 'warn';
  $('orderMsg').textContent = 'Ricorda di premere “Salva”.';
  renderSections();
  const btn = $('sectionList').children[i + dir].querySelectorAll('button')[dir < 0 ? 0 : 1];
  if (!btn.disabled) btn.focus();
}
async function loadLayout() {
  layout = await api('layout');
  renderSections();
}
async function saveLayout(order, hidden, okText) {
  const msg = $('orderMsg');
  try {
    const r = await api('layout', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order, hidden }) });
    layout.order = r.order;
    layout.hidden = r.hidden;
    renderSections();
    msg.className = 'okmsg';
    msg.textContent = okText;
  } catch (err) {
    msg.className = 'error';
    msg.textContent = err.message;
  }
}
$('saveOrder').addEventListener('click', () => {
  const n = layout.hidden.length;
  saveLayout(layout.order, layout.hidden, 'Salvato: la home si aggiorna entro un paio di minuti' + (n ? ' (' + n + (n === 1 ? ' sezione nascosta).' : ' sezioni nascoste).') : '.'));
});
$('resetOrder').addEventListener('click', () => {
  if (!confirm('Rimettere tutte le sezioni nell’ordine originale e tutte visibili?')) return;
  saveLayout(layout.sections.map((s) => s.id), [], 'Ripristinato: ordine originale, tutte le sezioni visibili.');
});

// ---- review request ----
const REVIEW_LINK = 'https://ironwoodlivigno.com/recensione';
const REVIEW_MSGS = [
  ['Italiano', 'Ciao! Grazie di cuore per aver soggiornato a Ironwood Livigno 🙏 Se vi siete trovati bene, ci aiutereste tantissimo con una recensione su Google: bastano 30 secondi 👉 ' + REVIEW_LINK + ' A presto a Livigno! Francesco'],
  ['English', 'Hi! Thank you so much for staying with us at Ironwood Livigno 🙏 If you enjoyed your stay, a Google review would help us a lot – it only takes 30 seconds 👉 ' + REVIEW_LINK + ' Hope to welcome you back to Livigno soon! Francesco'],
  ['Deutsch', 'Hallo! Vielen Dank, dass Sie bei uns im Ironwood Livigno zu Gast waren 🙏 Wenn es Ihnen gefallen hat, würde uns eine Google-Bewertung sehr helfen – es dauert nur 30 Sekunden 👉 ' + REVIEW_LINK + ' Wir freuen uns, Sie bald wieder in Livigno zu begrüßen! Francesco']
];
(function () {
  const box = $('reviewBox');
  box.append(copyField('Link breve per le recensioni', REVIEW_LINK));
  REVIEW_MSGS.forEach(([lang, text]) => {
    box.append(copyField('Messaggio in ' + lang, text, true));
    const a = document.createElement('a');
    a.className = 'btn-link';
    a.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Apri in WhatsApp (' + lang + ') →';
    box.append(a);
  });
})();

// ---- manual publishing helpers ----
async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) {
    const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select();
    document.execCommand('copy'); t.remove();
  }
  const old = btn.textContent; btn.textContent = 'Copiato ✓'; setTimeout(() => { btn.textContent = old; }, 1800);
}
function copyField(label, value, multiline) {
  const wrap = document.createElement('div');
  const l = document.createElement('span'); l.className = 'field-label'; l.textContent = label;
  const row = document.createElement('div'); row.className = 'copyrow';
  const f = document.createElement(multiline ? 'textarea' : 'input');
  f.value = value; f.readOnly = true; if (multiline) f.rows = 6;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'secondary'; b.textContent = 'Copia';
  b.addEventListener('click', () => copyText(value, b));
  row.append(f, b); wrap.append(l, row);
  return wrap;
}
function step(html) { const li = document.createElement('li'); li.innerHTML = html; return li; }
const GBP_URL = 'https://business.google.com/locations';
function itDate(d) { return d.slice(8, 10) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4); }

$('prepOffer').addEventListener('click', async (e) => {
  const panel = $('manualPanel');
  e.target.disabled = true;
  try {
    const o = await api('google/manual/offer');
    panel.innerHTML = '<strong>Post dell’offerta per Google</strong>';
    const ol = document.createElement('ol');
    ol.append(step('Apri <a href="' + GBP_URL + '" target="_blank" rel="noopener">Google Business</a>; accanto a <b>Ironwood Livigno</b> clicca l’icona <b>Crea post</b>, poi scegli <b>Offerta</b>.'));
    const s2 = step('Copia e incolla ogni campo nella casella con lo stesso nome:');
    s2.append(copyField('Titolo dell’offerta', o.title), copyField('Data di inizio', itDate(o.start)), copyField('Data di fine', itDate(o.end)),
      copyField('Descrizione', o.text, true), copyField('Link per riscattare l’offerta (Altri dettagli)', o.link), copyField('Termini e condizioni', o.terms));
    ol.append(s2);
    ol.append(step('Aggiungi la foto: <a href="' + o.image + '" download="ironwood-livigno-offerta.jpg">scarica la foto dell’offerta</a> e caricala nel post.<br><img src="' + o.image + '" alt="">'));
    ol.append(step('Premi <b>Pubblica</b>. Google controlla il post e di solito lo mostra entro poche ore.'));
    panel.append(ol);
    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    panel.innerHTML = '<p class="warn">' + err.message + '</p>';
    panel.classList.remove('hidden');
  } finally {
    e.target.disabled = false;
  }
});

$('prepPhoto').addEventListener('click', async (e) => {
  const panel = $('manualPanel');
  e.target.disabled = true;
  try {
    const ph = await api('google/manual/photo');
    const url = '/api/admin/google/manual/photo/' + ph.id + '.jpg';
    panel.innerHTML = '<strong>Foto della settimana per Google</strong>';
    const ol = document.createElement('ol');
    ol.append(step('<a href="' + url + '" download>Scarica la foto (JPG)</a> — scelta tra quelle della stagione, mai pubblicata prima.<br><img src="/foto/' + ph.id + '" alt="">'));
    ol.append(step('Apri <a href="' + GBP_URL + '" target="_blank" rel="noopener">Google Business</a>; accanto a <b>Ironwood Livigno</b> clicca l’icona <b>Aggiungi foto</b> e carica la foto scaricata.'));
    const done = step('');
    const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Fatto, l’ho pubblicata';
    b.addEventListener('click', async () => {
      b.disabled = true;
      try {
        await api('google/manual/photo-done', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ph.id }) });
        done.innerHTML = '<span class="okmsg">Segnata come pubblicata: la prossima settimana il sito ti proporrà un’altra foto.</span>';
        refreshManualLast();
      } catch (err) { b.disabled = false; alert(err.message); }
    });
    done.append(b);
    ol.append(done);
    panel.append(ol);
    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    panel.innerHTML = '<p class="warn">' + err.message + '</p>';
    panel.classList.remove('hidden');
  } finally {
    e.target.disabled = false;
  }
});

// Reminder: how long since the last photo went on Google.
async function refreshManualLast() {
  const el = $('manualLast');
  try {
    const ph = await api('google/manual/photo');
    if (!ph.lastAt) { el.className = 'sub'; el.textContent = 'Nessuna foto ancora pubblicata su Google da qui.'; return; }
    const days = Math.floor((Date.now() - Date.parse(ph.lastAt)) / 86400000);
    el.className = days >= 7 ? 'warn' : 'sub';
    el.textContent = 'Ultima foto su Google: ' + new Date(ph.lastAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) +
      (days >= 7 ? ' — è ora della foto della settimana!' : ' (' + ph.sent + ' in tutto)');
  } catch (err) { el.textContent = ''; }
}
// Message from the return trip of "Collega a Google".
(function () {
  const m = new URLSearchParams(location.search).get('google');
  if (!m) return;
  $('googleMsg').textContent = m;
  history.replaceState(null, '', '/admin#google');
})();

$('credForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('credMsg');
  msg.className = '';
  msg.textContent = '';
  const newPassword = $('newPassword').value;
  if (newPassword.length < 8) { msg.className = 'error'; msg.textContent = 'La nuova password deve avere almeno 8 caratteri.'; return; }
  if (newPassword !== $('newPassword2').value) { msg.className = 'error'; msg.textContent = 'Le due nuove password non coincidono.'; return; }
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  try {
    const res = await api('credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: $('currentPassword').value, newUser: $('newUser').value.trim(), newPassword })
    });
    ['newPassword', 'newPassword2', 'currentPassword'].forEach((id) => { $(id).value = ''; });
    $('newUser').value = res.user;
    msg.className = 'okmsg';
    msg.textContent = 'Salvato. D’ora in poi entra con utente "' + res.user + '" e la nuova password.';
  } catch (err) {
    msg.className = 'error';
    msg.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});

$('logout').addEventListener('click', async () => {
  await api('logout', { method: 'POST' }).catch(() => {});
  showLogin();
});

// ---- seasons and rotation dates (same rules as the Worker) ----
// Snow photos only while the lifts are open (December to April), photos
// without snow the rest of the year, all-year ones always. Each day the
// photos in season take turns: day number modulo their count.
const LIFT_MONTHS = [12, 1, 2, 3, 4];
const SEASON_LABELS = { neve: '❄️ Con neve (dic–apr)', verde: '🌿 Senza neve (mag–nov)', sempre: '🏠 Tutto l’anno' };
function inSeasonList(photos, date) {
  const now = LIFT_MONTHS.includes(Number(date.slice(5, 7))) ? 'neve' : 'verde';
  const fit = photos.filter((p) => p.season === 'sempre' || p.season === now);
  return fit.length ? fit : photos;
}
// First day (within two years) each photo is on the site.
function schedule(photos, today) {
  const first = {};
  const d0 = dayNumber(today);
  for (let k = 0; k < 730 && photos.length; k++) {
    const day = d0 + k;
    const list = inSeasonList(photos, new Date(day * 86400000).toISOString().slice(0, 10));
    const p = list[day % list.length];
    if (!(p.id in first)) first[p.id] = new Date(day * 86400000);
  }
  return first;
}
function romeToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
}
function dayNumber(date) { return Math.floor(Date.parse(date + 'T00:00:00Z') / 86400000); }
function formatDay(date) {
  return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}
function formatKB(bytes) { return Math.round(bytes / 1024) + ' KB'; }

async function load() {
  const data = await api('photos');
  showPanel();
  // Once per page load: reloading after every photo change would wipe unsaved edits.
  if (!window.offerLoaded) {
    window.offerLoaded = true;
    loadGoogle().catch(() => {}).finally(() => loadOffer().catch(() => {}));
    loadChat().catch((err) => { $('chatStatus').className = 'status wait'; $('chatStatus').textContent = 'Impossibile leggere lo stato di NIGI: ' + err.message + '. Ricarica la pagina.'; });
  }
  if (document.activeElement !== $('newUser')) $('newUser').value = data.user;
  const photos = data.photos;
  const today = romeToday();
  $('count').textContent = photos.length ? '(' + photos.length + ')' : '';
  $('empty').classList.toggle('hidden', photos.length > 0);

  const todayPhoto = photos.find((p) => p.id === data.todayId);
  $('todayBox').innerHTML = '';
  const img = document.createElement('img');
  img.src = '/foto-del-giorno?t=' + Date.now();
  img.alt = 'Foto del giorno';
  const info = document.createElement('div');
  info.innerHTML = todayPhoto
    ? '<p class="hint">Questa è la foto che i visitatori vedono oggi in home page, in tutte le lingue. Domani cambia automaticamente.</p>'
    : '<p class="hint">Non hai ancora caricato foto: oggi compare la foto di riserva di Livigno.</p>';
  $('todayBox').append(img, info);

  $('grid').innerHTML = '';
  gridState = { photos, data, today, shown: 0, when: schedule(photos, today) };
  renderMore();
}

// With hundreds of photos, thumbnails are added 40 at a time.
const PAGE = 40;
let gridState = null;
function renderMore() {
  const { photos, data, today } = gridState;
  const slice = photos.slice(gridState.shown, gridState.shown + PAGE);
  slice.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'ph';
    el.innerHTML = '<img loading="lazy" alt="">' +
      '<div class="meta"><span class="when"></span>' +
      '<select class="season" aria-label="Stagione della foto">' +
      Object.keys(SEASON_LABELS).map((k) => '<option value="' + k + '">' + SEASON_LABELS[k] + '</option>').join('') + '</select>' +
      '<span class="muted">' + p.w + '×' + p.h + ' · ' + formatKB(p.bytes) + '</span>' +
      '<button class="danger">Elimina</button></div>';
    el.dataset.id = p.id;
    el.querySelector('img').src = '/foto/' + p.id;
    const sel = el.querySelector('select');
    sel.value = p.season;
    sel.className = 'season ' + p.season;
    sel.addEventListener('change', () => {
      // Updated here at once, then saved in turn: each save sends the whole,
      // latest map, so quick changes to several photos can't undo each other.
      p.season = sel.value;
      sel.className = 'season ' + p.season;
      gridState.when = schedule(photos, today);
      refreshWhen();
      saveSeasons(photos);
    });
    el.querySelector('button').addEventListener('click', async () => {
      if (!confirm('Eliminare questa foto dalla rotazione?')) return;
      try { await api('photos/' + p.id, { method: 'DELETE' }); await load(); }
      catch (err) { alert(err.message); }
    });
    $('grid').append(el);
  });
  gridState.shown += slice.length;
  refreshWhen();
  const left = photos.length - gridState.shown;
  $('more').classList.toggle('hidden', left <= 0);
  $('more').textContent = 'Mostra altre ' + Math.min(PAGE, left) + ' (ne restano ' + left + ')';
}
$('more').addEventListener('click', renderMore);

// Season changes are saved one after the other, each with the current map.
let seasonQueue = Promise.resolve();
function saveSeasons(photos) {
  seasonQueue = seasonQueue.then(async () => {
    const seasons = {};
    photos.forEach((x) => { seasons[x.id] = x.season; });
    try {
      await api('photos/seasons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seasons }) });
    } catch (err) {
      alert('Stagione non salvata: ' + err.message + ' — la pagina si ricarica con i dati salvati.');
      await load().catch(() => {});
    }
  });
}

// "Oggi" / "Domani" / next date on the site, recomputed when a season changes.
function refreshWhen() {
  const { today, when } = gridState;
  const tomorrow = new Date((dayNumber(today) + 1) * 86400000).getTime();
  document.querySelectorAll('#grid .ph').forEach((el) => {
    const d = when[el.dataset.id];
    const box = el.querySelector('.when');
    if (d && d.getTime() === dayNumber(today) * 86400000) box.innerHTML = '<span class="badge">Oggi</span>';
    else if (d && d.getTime() === tomorrow) box.innerHTML = '<span class="badge tomorrow">Domani</span>';
    else box.innerHTML = '<span class="muted">' + (d ? 'Sul sito: ' + formatDay(d) : 'Fuori stagione') + '</span>';
  });
}

// ---- compression in the browser ----
// createImageBitmap first (fast, applies the EXIF rotation of phone photos);
// an <img> element as fallback for browsers that can't decode the file that
// way but can display it (e.g. HEIC on Safari).
async function decode(file) {
  try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) {}
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

// The Ironwood logo (same mark as the site header: roofline icon with the
// gold dot, "iron" + gold "wood" in Fraunces), bottom-right, sized to the photo.
const logoFont = new FontFace('Fraunces', 'url(/fonts/fraunces-400.woff2)');
const logoFontReady = logoFont.load().then((f) => { document.fonts.add(f); }).catch(() => {});
async function drawLogo(ctx, w, h) {
  await logoFontReady;
  const unit = Math.max(w, h) / 1600;
  const fontSize = Math.round(62 * unit);
  const iconH = fontSize * 0.95;
  const iconW = iconH * 120 / 110;
  const gap = fontSize * 0.32;
  const margin = 44 * unit;
  ctx.save();
  ctx.font = '400 ' + fontSize + 'px Fraunces, Georgia, serif';
  const ironW = ctx.measureText('iron').width;
  const woodW = ctx.measureText('wood').width;
  const x = w - margin - (iconW + gap + ironW + woodW);
  const baseline = h - margin;
  ctx.globalAlpha = 0.92;
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 14 * unit;
  // icon, drawn in its own 120x110 box
  ctx.save();
  ctx.translate(x, baseline - iconH * 0.86);
  ctx.scale(iconH / 110, iconH / 110);
  ctx.fillStyle = '#C9A059';
  ctx.beginPath(); ctx.arc(10, 46, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#F7F3EC';
  ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  [[24,60],[46,26],[66,50],[94,10],[118,60],[118,96],[20,96],[20,64]].forEach(([px, py], k) => k ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
  ctx.stroke();
  ctx.restore();
  // wordmark
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#F7F3EC';
  ctx.fillText('iron', x + iconW + gap, baseline);
  ctx.fillStyle = '#C9A059';
  ctx.fillText('wood', x + iconW + gap + ironW, baseline);
  ctx.restore();
}

async function compress(file) {
  const source = await decode(file);
  const sw = source.naturalWidth || source.width;
  const sh = source.naturalHeight || source.height;
  const scale = Math.min(1, MAX_SIDE / Math.max(sw, sh));
  const w = Math.round(sw * scale);
  const h = Math.round(sh * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);
  await drawLogo(ctx, w, h);
  source.close && source.close();
  const toBlob = (type, q) => new Promise((r) => canvas.toBlob(r, type, q));
  let blob = await toBlob('image/webp', 0.75);
  // A JPEG copy too: Google Business Profile doesn't accept WebP.
  const jpeg = await toBlob('image/jpeg', 0.82);
  // Browsers that can't encode WebP silently return PNG instead.
  if (!blob || blob.type !== 'image/webp') blob = jpeg;
  return { blob, jpeg, w, h };
}

async function handleFiles(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/') || /\\.(heic|heif)$/i.test(f.name));
  if (!files.length) return;
  const picked = document.querySelector('input[name=uploadSeason]:checked');
  if (!picked) {
    $('files').value = '';
    $('progressSummary').textContent = '';
    $('progress').innerHTML = '<div class="warn">Prima scegli la stagione delle foto (punto 1), poi selezionale di nuovo.</div>';
    $('seasonPick').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const season = picked.value;
  const progress = $('progress');
  const bar = $('progressBar');
  const summary = $('progressSummary');
  progress.innerHTML = '';
  bar.classList.remove('hidden');
  let done = 0, failed = 0, savedIn = 0, savedOut = 0, sinceIndex = 0, stopped = false;
  const update = (i) => {
    bar.firstElementChild.style.width = Math.round((i / files.length) * 100) + '%';
    summary.textContent = 'Caricate ' + done + ' di ' + files.length + (failed ? ' · ' + failed + ' non riuscite' : '') +
      (done ? ' · ' + formatKB(savedIn) + ' → ' + formatKB(savedOut) : '');
  };
  const current = document.createElement('div');
  current.className = 'muted';
  progress.append(current);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    current.textContent = (i + 1) + '/' + files.length + ' · ' + file.name + ': riduzione e logo…';
    try {
      const { blob, jpeg, w, h } = await compress(file);
      const form = new FormData();
      form.append('file', blob, 'foto.' + (blob.type === 'image/webp' ? 'webp' : 'jpg'));
      form.append('w', String(w));
      form.append('h', String(h));
      form.append('season', season);
      if (jpeg) form.append('jpeg', jpeg, 'foto.jpg');
      await api('photos', { method: 'POST', body: form });
      done++; savedIn += file.size; savedOut += blob.size; sinceIndex++;
      if (sinceIndex >= 20) { await api('photos/reindex', { method: 'POST' }).catch(() => {}); sinceIndex = 0; }
    } catch (err) {
      if (err.status === 401) {
        stopped = true;
        const line = document.createElement('div');
        line.className = 'warn';
        line.textContent = 'Accesso scaduto: rientra e ricarica le foto da "' + file.name + '" in poi (' + (files.length - i) + ' rimaste). Quelle già caricate sono salve.';
        progress.append(line);
        break;
      }
      if (err.data && err.data.limit) {
        stopped = true;
        const line = document.createElement('div');
        line.className = 'warn';
        line.textContent = err.message + ' Non caricate: ' + (files.length - i) + ' (da "' + file.name + '" in poi).';
        progress.append(line);
        break;
      }
      failed++;
      const line = document.createElement('div');
      line.className = 'error';
      line.textContent = '✗ ' + file.name + ': ' + (err.message || 'formato non leggibile');
      progress.append(line);
    }
    update(i + 1);
  }
  current.textContent = stopped ? '' : 'Finito.';
  await api('photos/reindex', { method: 'POST' }).catch(() => {});
  $('files').value = '';
  await load().catch(() => {});
}

$('files').addEventListener('change', (e) => handleFiles(e.target.files));
const drop = $('drop');
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));

// Also picks up photos from a batch that was interrupted before its last reindex.
api('photos/reindex', { method: 'POST' }).catch(() => {}).finally(() => load().catch(() => {}));
</script>
</body>
</html>`;
}
