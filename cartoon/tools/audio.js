const fs = require('fs');
const SC = JSON.parse(fs.readFileSync('cues.json'));
const SR = 44100, TOTAL = SC.reduce((a, x) => a + x.dur, 0), N = SR * TOTAL, buf = new Float32Array(N);
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function tone(f, at, dur, type, vol, f2) {
  const s0 = Math.floor(at * SR), n = Math.floor((dur + .05) * SR); let ph = 0;
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR, fr = f2 ? f * Math.pow(f2 / f, Math.min(1, t / dur)) : f;
    ph += fr / SR; const x = ph % 1;
    let w = type === 'sine' ? Math.sin(2 * Math.PI * x) : type === 'square' ? (x < .5 ? 1 : -1) : 1 - 4 * Math.abs(x - .5);
    const env = t < .015 ? t / .015 : Math.max(0, Math.exp(-5 * (t - .015) / dur));
    buf[s0 + i] += w * vol * env;
  }
}
const MEL = [72,76,79,76,77,81,79,0,76,79,84,79,81,79,76,0,74,77,81,77,79,77,76,74,72,76,74,71,72,0,0,0];
const BASS = [48,53,48,57,50,55,55,48], BEAT = .42, MV = .08;
for (let step = 0, at = .05; at < TOTAL - 2; step++, at += BEAT) {
  const m = MEL[step % MEL.length]; if (m) tone(mtof(m), at, BEAT * .9, 'triangle', .5 * MV);
  if (step % 2 === 0) tone(mtof(BASS[Math.floor(step / 4) % BASS.length]), at, BEAT * 1.6, 'sine', .55 * MV);
}
const S = .5;
const fx = { ding: t => { tone(mtof(88), t, .5, 'sine', .5*S); tone(mtof(91), t+.12, .7, 'sine', .45*S); },
  boing: t => tone(220, t, .35, 'square', .18*S, 660), pop: t => tone(500, t, .12, 'sine', .4*S, 1200),
  error: t => { tone(220, t, .2, 'square', .2*S); tone(180, t+.22, .3, 'square', .2*S); },
  power: t => tone(200, t, .7, 'sine', .4*S, 900), drop: t => tone(600, t, .25, 'triangle', .3*S, 150),
  fanfare: t => [72,76,79,84].forEach((m,i) => tone(mtof(m), t+i*.14, .5, 'triangle', .4*S)) };
SC.forEach(x => x.sfx.forEach(([t, n]) => fx[n](x.start + t)));
// fade out last 3 s
for (let i = 0; i < 3 * SR; i++) buf[N - 1 - i] *= i / (3 * SR);
const pcm = Buffer.alloc(N * 2); for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i])) * 32000), i * 2);
const h = Buffer.alloc(44); h.write('RIFF',0); h.writeUInt32LE(36+pcm.length,4); h.write('WAVE',8); h.write('fmt ',12);
h.writeUInt32LE(16,16); h.writeUInt16LE(1,20); h.writeUInt16LE(1,22); h.writeUInt32LE(SR,24); h.writeUInt32LE(SR*2,28); h.writeUInt16LE(2,32); h.writeUInt16LE(16,34);
h.write('data',36); h.writeUInt32LE(pcm.length,40); fs.writeFileSync('music.wav', Buffer.concat([h,pcm]));
