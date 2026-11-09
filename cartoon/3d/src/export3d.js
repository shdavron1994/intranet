// render every frame of a 3D page into an mp4 (no audio)
const { open } = require('./serve'); const { spawn } = require('child_process');
(async () => {
  const [page, out, fpsArg, port] = process.argv.slice(2); const FPS = +(fpsArg || 24);
  const { p, errs, close } = await open(process.cwd(), page, +(port || 8770));
  const total = await p.evaluate(() => window.__total), N = Math.round(total * FPS);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', out]);
  const t0 = Date.now();
  for (let i = 0; i < N; i++) {
    const u = await p.evaluate(t => window.frameAt(t, .92), i / FPS);
    if (!ff.stdin.write(Buffer.from(u.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 240 === 0) console.log('frame', i, '/', N, Math.round((Date.now() - t0) / 1000) + 's');
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('done', N, 'frames', errs.slice(0, 3)); await close();
})();
