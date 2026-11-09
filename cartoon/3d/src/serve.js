// tiny static server + headless chromium with software WebGL
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.mp3': 'audio/mpeg', '.json': 'application/json' };
exports.open = async (dir, page, port = 8765) => {
  const srv = http.createServer((q, s) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(fs.readFileSync(f)); }).listen(port);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`http://localhost:${port}/${page}`); await p.waitForFunction(() => window.ready, null, { timeout: 60000 });
  return { p, errs, close: async () => { await b.close(); srv.close(); } };
};
