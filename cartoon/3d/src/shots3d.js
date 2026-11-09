const { open } = require('./serve'); const fs = require('fs');
(async () => {
  const [page, out, ...times] = process.argv.slice(2);
  const { p, errs, close } = await open(process.cwd(), page);
  const t0 = Date.now(); let i = 0;
  for (const t of times) { const u = await p.evaluate(t => window.frameAt(+t, .85), t); fs.writeFileSync(`${out}_${String(i++).padStart(2, '0')}.jpg`, Buffer.from(u.split(',')[1], 'base64')); }
  fs.writeFileSync(`${out}_cues.json`, JSON.stringify(await p.evaluate(() => window.__scenes)));
  console.log('total', await p.evaluate(() => window.__total), 'ms/frame', Math.round((Date.now() - t0) / times.length), 'errors', errs.slice(0, 4));
  await close();
})();
