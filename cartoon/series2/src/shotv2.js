const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const [page, out, ...ts] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/' + page); await p.waitForTimeout(800);
  await p.evaluate(() => { window.__burnSubs = true; const cv = document.getElementById('cv'); cv.width = 1280; cv.height = 720; });
  let i = 0; for (const t of ts) { const u = await p.evaluate(t => { const cv = document.getElementById('cv'); if (cv.width !== 1280) { cv.width = 1280; cv.height = 720; } window.__seek(+t); return cv.toDataURL('image/jpeg', .85); }, t); fs.writeFileSync(`${out}_${String(i++).padStart(2, '0')}.jpg`, Buffer.from(u.split(',')[1], 'base64')); }
  if (out === 'cuesdump') {} fs.writeFileSync(`${out}_scenes.json`, JSON.stringify(await p.evaluate(() => window.__scenes)));
  console.log('total', await p.evaluate(() => window.__total), errs.slice(0, 3)); await b.close(); })();
