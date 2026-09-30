// The /admin page: one self-contained HTML document (inline CSS and JS, no
// build step). Photos are resized and re-encoded in the browser before
// upload — longest side 1600 px, WebP (JPEG where the browser can't encode
// WebP, e.g. older Safari) — so a 5 MB phone photo goes up as ~200 KB and
// the Worker never has to process images itself.
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
  .okmsg { color:var(--ok); }
  .drop { display:block; border:2px dashed var(--line); border-radius:16px; padding:32px 16px; text-align:center; cursor:pointer; transition:.2s; }
  .drop.over { border-color:var(--brick); background:#fbf6f2; }
  .drop strong { display:block; margin-bottom:6px; }
  #progress { margin-top:14px; font-size:14px; }
  #progress div { padding:4px 0; }
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
      <div id="progress"></div>
    </section>

    <section class="card">
      <h2>Foto in rotazione <span id="count" class="muted"></span></h2>
      <div id="grid" class="grid"></div>
      <p id="empty" class="hint hidden">Nessuna foto ancora: finché non ne carichi una, sul sito compare una foto di Livigno già presente.</p>
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
  if (!res.ok) throw new Error(data.error || ('Errore ' + res.status));
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
  photos.forEach((p, i) => {
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
  progress.innerHTML = '';
  for (const file of files) {
    const line = document.createElement('div');
    line.textContent = file.name + ': riduzione in corso…';
    progress.append(line);
    try {
      const { blob, w, h } = await compress(file);
      line.textContent = file.name + ': invio (' + formatKB(file.size) + ' → ' + formatKB(blob.size) + ')…';
      const form = new FormData();
      form.append('file', blob, 'foto.' + (blob.type === 'image/webp' ? 'webp' : 'jpg'));
      form.append('w', String(w));
      form.append('h', String(h));
      await api('photos', { method: 'POST', body: form });
      line.textContent = '✓ ' + file.name + ': caricata (' + formatKB(file.size) + ' → ' + formatKB(blob.size) + ')';
    } catch (err) {
      line.className = 'error';
      line.textContent = '✗ ' + file.name + ': ' + (err.message || 'formato non leggibile');
    }
  }
  $('files').value = '';
  await load().catch(() => {});
}

$('files').addEventListener('change', (e) => handleFiles(e.target.files));
const drop = $('drop');
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));

load().catch(() => {});
</script>
</body>
</html>`;
}
