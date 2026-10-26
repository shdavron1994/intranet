const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
  await p.goto('file://' + process.cwd() + '/' + process.argv[2]); await p.waitForTimeout(800);
  const info = await p.evaluate(() => {
    window.__burnSubs = true; const cv = document.getElementById('cv'); cv.width = 1280; cv.height = 720;
    window.removeEventListener('resize', () => {});
    return { total: window.__total };
  });
  const FPS = 24, N = Math.round(info.total * FPS);
  const ff = spawn('ffmpeg', ['-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','20',process.argv[3]]);
  for (let i = 0; i < N; i++) {
    const url = await p.evaluate(t => { const cv = document.getElementById('cv'); if (cv.width !== 1280) { cv.width = 1280; cv.height = 720; } window.__seek(t); return cv.toDataURL('image/jpeg', .92); }, i / FPS);
    if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  // timeline of sfx for the audio track
  const sfx = await p.evaluate(() => null);
  console.log('frames', N); await b.close();
})();
