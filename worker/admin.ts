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
    <section class="card">
      <h2>Oggi sul sito</h2>
      <div id="todayBox" class="today"></div>
    </section>

    <section class="card">
      <h2>Aggiungi foto</h2>
      <p class="hint">Scegli una o più foto, anche direttamente dal telefono. Vengono ridotte e alleggerite automaticamente prima dell'invio (lato lungo 1600 px, circa 150–300 KB). Ogni giorno a mezzanotte la foto sul sito cambia, seguendo l'ordine di caricamento, e ricomincia dalla prima dopo l'ultima.</p>
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
        <div class="actions">
          <button type="submit">Salva offerta</button>
          <a class="btn-link" href="/it?anteprima-offerta" target="_blank" rel="noopener">Vedi anteprima →</a>
        </div>
        <p id="offerMsg"></p>
      </form>
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
  const btn = e.target.querySelector('button');
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
  const period = 'soggiorno dal ' + fmtDate(offer.checkIn) + ' al ' + fmtDate(offer.checkOut) + ', ' + offer.price + ' €' + (offer.unit === 'night' ? ' a notte' : '');
  if (!offer.active) { box.className = 'status off'; box.textContent = 'Pop-up spento (' + period + ').'; }
  else if (today < offer.showFrom) { box.className = 'status wait'; box.textContent = 'Programmato: il pop-up comparirà dal ' + fmtDate(offer.showFrom) + ' (' + period + ').'; }
  else if (today > offer.showUntil) { box.className = 'status off'; box.textContent = 'Offerta scaduta il ' + fmtDate(offer.showUntil) + ': il pop-up non si vede più.'; }
  else { box.className = 'status live'; box.textContent = '● Visibile ora sul sito fino al ' + fmtDate(offer.showUntil) + ' (' + period + ').'; }
}

let offerBaseId = null;

// Same list and default as OFFER_IMAGES in worker/offer.ts.
const OFFER_PICS = [
  ['esterno-giorno', 'La casa di giorno'],
  ['esterno-notte', 'La casa di notte, con la neve'],
  ['hero-ironwood', 'Soggiorno con camino'],
  ['soggiorno', 'Divano e legno'],
  ['sauna-vista-montagna', 'Sauna con vista'],
  ['camera1', 'Camera matrimoniale'],
  ['lago-livigno-panorama', 'Lago di Livigno in autunno'],
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
  $('offerPrice').value = offer ? offer.price : '';
  $('offerUnit').value = offer ? offer.unit : 'stay';
  $('offerOriginal').value = offer && offer.originalPrice ? offer.originalPrice : '';
  $('offerFrom').value = offer ? offer.showFrom : today;
  $('offerUntil').value = offer ? offer.showUntil : addDaysISO(today, 14);
  updateNights();
  showOfferStatus(offer, today);
}

async function loadOffer() {
  const data = await api('offer');
  fillOffer(data.offer, data.today);
}

$('offerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('offerMsg');
  msg.className = ''; msg.textContent = '';
  const btn = e.target.querySelector('button');
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
        price: $('offerPrice').value,
        unit: $('offerUnit').value,
        originalPrice: $('offerOriginal').value,
        showFrom: $('offerFrom').value,
        showUntil: $('offerUntil').value
      })
    });
    fillOffer(data.offer, data.today);
    const o = data.offer;
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

// ---- rotation dates (same rule as the Worker: day number modulo count) ----
function romeToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
}
function dayNumber(date) { return Math.floor(Date.parse(date + 'T00:00:00Z') / 86400000); }
function nextShowing(i, n, today) {
  const d = dayNumber(today);
  const offset = ((i - (d % n)) % n + n) % n;
  return new Date((d + offset) * 86400000);
}
function formatDay(date) {
  return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}
function formatKB(bytes) { return Math.round(bytes / 1024) + ' KB'; }

async function load() {
  const data = await api('photos');
  showPanel();
  // Once per page load: reloading after every photo change would wipe unsaved edits.
  if (!window.offerLoaded) { window.offerLoaded = true; loadOffer().catch(() => {}); }
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
  gridState = { photos, data, today, shown: 0 };
  renderMore();
}

// With hundreds of photos, thumbnails are added 40 at a time.
const PAGE = 40;
let gridState = null;
function renderMore() {
  const { photos, data, today } = gridState;
  const slice = photos.slice(gridState.shown, gridState.shown + PAGE);
  slice.forEach((p, j) => {
    const i = gridState.shown + j;
    const el = document.createElement('div');
    el.className = 'ph';
    const when = nextShowing(i, photos.length, today);
    const badge = p.id === data.todayId ? '<span class="badge">Oggi</span>'
      : p.id === data.tomorrowId ? '<span class="badge tomorrow">Domani</span>'
      : '<span class="muted">Sul sito: ' + formatDay(when) + '</span>';
    el.innerHTML = '<img loading="lazy" alt="">' +
      '<div class="meta">' + badge +
      '<span class="muted">' + p.w + '×' + p.h + ' · ' + formatKB(p.bytes) + '</span>' +
      '<button class="danger">Elimina</button></div>';
    el.querySelector('img').src = '/foto/' + p.id;
    el.querySelector('button').addEventListener('click', async () => {
      if (!confirm('Eliminare questa foto dalla rotazione?')) return;
      try { await api('photos/' + p.id, { method: 'DELETE' }); await load(); }
      catch (err) { alert(err.message); }
    });
    $('grid').append(el);
  });
  gridState.shown += slice.length;
  const left = photos.length - gridState.shown;
  $('more').classList.toggle('hidden', left <= 0);
  $('more').textContent = 'Mostra altre ' + Math.min(PAGE, left) + ' (ne restano ' + left + ')';
}
$('more').addEventListener('click', renderMore);

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
  // Browsers that can't encode WebP silently return PNG instead.
  if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', 0.78);
  return { blob, w, h };
}

async function handleFiles(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/') || /\\.(heic|heif)$/i.test(f.name));
  if (!files.length) return;
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
      const { blob, w, h } = await compress(file);
      const form = new FormData();
      form.append('file', blob, 'foto.' + (blob.type === 'image/webp' ? 'webp' : 'jpg'));
      form.append('w', String(w));
      form.append('h', String(h));
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
