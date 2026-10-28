import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteFile = path.resolve(here, '../index.html');
const storeDir = path.join(here, 'data');
const storeFile = path.join(storeDir, 'state.json');
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';
const token = process.env.ADMIN_TOKEN || '';
const maxBody = 20 * 1024 * 1024;
if (token.length < 24) { console.error('Set ADMIN_TOKEN to a random secret of at least 24 characters.'); process.exit(1); }

const send = (res, code, data, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
};
function authorized(req) {
  const given = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given), b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
async function readState() {
  try { return JSON.parse(await fs.readFile(storeFile, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return { records: [], config: null, updatedAt: null }; throw e; }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/') {
    try { return send(res, 200, await fs.readFile(siteFile, 'utf8'), 'text/html; charset=utf-8'); }
    catch { return send(res, 500, 'Website file not found', 'text/plain; charset=utf-8'); }
  }
  if (req.method === 'GET' && url.pathname === '/manifest.webmanifest') {
    return send(res, 200, JSON.stringify({ name: 'চরশী স্কুল রেজাল্ট', short_name: 'চরশী রেজাল্ট', start_url: '/', display: 'standalone', background_color: '#f4f7f4', theme_color: '#16734c', lang: 'bn' }), 'application/manifest+json; charset=utf-8');
  }
  if (req.method === 'GET' && url.pathname === '/sw.js') {
    const js = `const CACHE='charshi-site-v1';self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.add('/'))));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/')))))});`;
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-cache', 'Service-Worker-Allowed': '/' });
    return res.end(js);
  }
  if (url.pathname.startsWith('/api/')) {
    if (!authorized(req)) return send(res, 401, { error: 'Unauthorized' });
    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, updatedAt: (await readState()).updatedAt });
    if (req.method === 'GET' && url.pathname === '/api/state') {
      try { return send(res, 200, await readState()); } catch { return send(res, 500, { error: 'Stored data could not be read' }); }
    }
    if (req.method === 'PUT' && url.pathname === '/api/state') {
      try {
        let raw = '', tooLarge = false;
        for await (const chunk of req) { raw += chunk; if (raw.length > maxBody) { tooLarge = true; break; } }
        if (tooLarge) return send(res, 413, { error: 'Backup exceeds 20 MB' });
        const state = JSON.parse(raw);
        if (!state || !Array.isArray(state.records) || !state.config || typeof state.config !== 'object') return send(res, 400, { error: 'Invalid backup format' });
        state.updatedAt = new Date().toISOString();
        await fs.mkdir(storeDir, { recursive: true });
        const tmp = storeFile + '.tmp';
        await fs.writeFile(tmp, JSON.stringify(state, null, 2), { mode: 0o600 });
        await fs.rename(tmp, storeFile);
        return send(res, 200, { ok: true, updatedAt: state.updatedAt });
      } catch { return send(res, 400, { error: 'Invalid JSON or save failed' }); }
    }
    return send(res, 404, { error: 'Not found' });
  }
  return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
});
server.listen(port, host, () => console.log(`Charshi results listening on ${host}:${port}`));
