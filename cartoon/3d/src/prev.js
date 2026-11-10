// prev.js page out [fracs]: two frames per scene -> out_grid.jpg
const { open } = require('./serve'); const fs = require('fs'); const { execSync } = require('child_process');
(async () => {
  const [page, out, fr] = process.argv.slice(2); const fracs = (fr || '.3,.8').split(',').map(Number);
  const { p, errs, close } = await open(process.cwd(), page, 8790 + Math.floor(Math.random() * 100));
  const sc = await p.evaluate(() => window.__scenes); let i = 0; const files = [];
  for (const s of sc) for (const f of fracs) { const u = await p.evaluate(t => window.frameAt(t, .8), s.start + s.dur * f); const fn = `${out}_${String(i++).padStart(2, '0')}.jpg`; fs.writeFileSync(fn, Buffer.from(u.split(',')[1], 'base64')); files.push(fn); }
  console.log('errors', errs.slice(0, 5)); await close();
  execSync(`python3 -c "
from PIL import Image
import sys
fs=sys.argv[1:]; n=len(fs); cols=4; rows=(n+cols-1)//cols
g=Image.new('RGB',(426*cols,240*rows))
for i,f in enumerate(fs): g.paste(Image.open(f).resize((426,240)),((i%cols)*426,(i//cols)*240))
g.save('${out}_grid.jpg')" ${files.join(' ')}`);
})();
