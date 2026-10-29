/* CMAK Shirts PWA – shared client. Edit API_URL only. */
const API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'; // ends with /exec

const QUEUE_KEY = 'cmak_shirt_queue';

async function api(params, timeoutMs = 20000) {
  if (API_URL.indexOf('PASTE') === 0) throw new Error('API_URL not set in app.js');
  const url = API_URL + '?' + new URLSearchParams(params).toString();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch (e) { throw new Error('Unexpected reply from server'); }
  } finally { clearTimeout(t); }
}

/* Offline queue: a submission made without network is kept and retried on next open. */
function queueSubmission(p) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(p)); } catch (e) {}
}
function readQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || 'null'); } catch (e) { return null; }
}
function clearQueue() { try { localStorage.removeItem(QUEUE_KEY); } catch (e) {} }

async function flushQueue(onResult) {
  const q = readQueue();
  if (!q || !navigator.onLine) return;
  try {
    const r = await api(Object.assign({ action: 'submit' }, q));
    if (r.ok) { clearQueue(); onResult && onResult(r); }
    else if (/not match|not found|not on the shirt list|Pick a size/i.test(r.message)) { clearQueue(); onResult && onResult(r); }
  } catch (e) { /* still offline; keep */ }
}

/* Service worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

/* Install prompt (Android/Chrome). iOS uses Share > Add to Home Screen. */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredInstall = e;
  const b = document.getElementById('installBtn'); if (b) b.style.display = 'inline-block';
});
function promptInstall() {
  if (!deferredInstall) return;
  deferredInstall.prompt(); deferredInstall = null;
  const b = document.getElementById('installBtn'); if (b) b.style.display = 'none';
}
