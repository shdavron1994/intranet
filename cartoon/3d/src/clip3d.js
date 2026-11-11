// clip3d.js page out.mp4 t0 t1: render a time range (no audio) for checks
const { open } = require('./serve'); const { spawn } = require('child_process');
(async () => {
  const [page, out, a, b] = process.argv.slice(2); const FPS = 24;
  const { p, close } = await open(process.cwd(), page, 8899);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', out]);
  for (let t = +a; t < +b; t += 1 / FPS) { const u = await p.evaluate(t => window.frameAt(t, .9), t); ff.stdin.write(Buffer.from(u.split(',')[1], 'base64')); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await close();
})();
