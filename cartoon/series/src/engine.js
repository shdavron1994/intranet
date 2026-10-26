function mapK(k, v, a, b) {
  for (let i = 1; i < k.length; i++) if (v <= k[i][a] || i === k.length - 1) { const p = (v - k[i - 1][a]) / ((k[i][a] - k[i - 1][a]) || 1); return k[i - 1][b] + p * (k[i][b] - k[i - 1][b]); }
  return v;
}
// stretch scenes so every voiced line fits: cues and sfx move to real time, draw() still gets the original timeline
SCENES.forEach((s, i) => {
  const k = WARP[i]; if (!k) return;
  const toReal = v => mapK(k, v, 0, 1);
  s.knots = k; s.cues = s.cues.map(c => [toReal(c[0]), toReal(c[1]), c[2], c[3]]); s.sfx = (s.sfx || []).map(x => [toReal(x[0]), x[1]]); s.dur = k[k.length - 1][1];
});
let acc = 0;
SCENES.forEach(s => { s.start = acc; acc += s.dur; s.sfx = s.sfx || []; });
const TOTAL = acc;

/* ---------- audio ---------- */
let actx = null, master = null, musicGain = null;
function ensureAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!actx) {
    actx = new AC(); master = actx.createGain(); master.gain.value = .5; master.connect(actx.destination);
    musicGain = actx.createGain(); musicGain.gain.value = .16; musicGain.connect(master);
  }
  if (actx.state === 'suspended') actx.resume().catch(() => {});
  return actx;
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function tone(f, at, dur, type, vol, dest, f2) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, at);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur);
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .015);
  g.gain.exponentialRampToValueAtTime(.0005, at + dur);
  o.connect(g); g.connect(dest || master); o.start(at); o.stop(at + dur + .05);
}
const MEL = [72, 76, 79, 76, 77, 81, 79, 0, 76, 79, 84, 79, 81, 79, 76, 0, 74, 77, 81, 77, 79, 77, 76, 74, 72, 76, 74, 71, 72, 0, 0, 0];
const BASS = [48, 53, 48, 57, 50, 55, 55, 48];
const BEAT = .42;
let step = 0, nextAt = 0;
setInterval(() => {
  if (!actx || !playing || !musicOn) return;
  while (nextAt < actx.currentTime + .25) {
    const m = MEL[step % MEL.length];
    if (m) tone(mtof(m), nextAt, BEAT * .9, 'triangle', .5, musicGain);
    if (step % 2 === 0) tone(mtof(BASS[Math.floor(step / 4) % BASS.length]), nextAt, BEAT * 1.6, 'sine', .55, musicGain);
    step++; nextAt += BEAT;
  }
}, 60);
function sfx(name) {
  if (!actx) return;
  const t = actx.currentTime + .01;
  if (name === 'ding') { tone(mtof(88), t, .5, 'sine', .5); tone(mtof(91), t + .12, .7, 'sine', .45); }
  if (name === 'boing') tone(220, t, .35, 'square', .18, null, 660);
  if (name === 'pop') tone(500, t, .12, 'sine', .4, null, 1200);
  if (name === 'error') { tone(220, t, .2, 'square', .2); tone(180, t + .22, .3, 'square', .2); }
  if (name === 'power') tone(200, t, .7, 'sine', .4, null, 900);
  if (name === 'drop') tone(600, t, .25, 'triangle', .3, null, 150);
  if (name === 'fanfare') [72, 76, 79, 84].forEach((m, i) => tone(mtof(m), t + i * .14, .5, 'triangle', .4));
}

/* ---------- voice ---------- */
const PITCH = { 'Тимур': 1.45, 'Лея': 1.9, 'Чистон': .85, 'Пиксель': 1.7, 'Хрум': .5, 'Кроссовки': 1.8, 'Рассказчик': 1, 'Песня': 1.3, 'Липучки': 2, 'Все': 1.3 };
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let ruVoice = null;
function pickVoice() {
  if (!synth) return;
  try { ruVoice = synth.getVoices().find(v => /^ru/i.test(v.lang)) || null; } catch (e) { ruVoice = null; }
}
if (synth) { pickVoice(); try { synth.onvoiceschanged = pickVoice; } catch (e) {} }
function speak(text, who) {
  if (!synth || !voiceOn) return;
  if (!ruVoice) pickVoice();
  if (!ruVoice) { statusEl.textContent = 'Не удалось загрузить озвучку. Смотрите с субтитрами.'; return; }
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU'; if (ruVoice) u.voice = ruVoice;
    u.pitch = Math.min(2, PITCH[who] || 1); u.rate = 1.12;
    synth.speak(u);
  } catch (e) {}
}
/* recorded voice clips (voice/c{scene}_{cue}.mp3); the browser voice is only a fallback */
const clips = {};
let clipsLoading = false, clipsFailed = 0, curSrc = null;
function loadClips() {
  if (clipsLoading || !actx) return;
  clipsLoading = true;
  SCENES.forEach((sc, si) => sc.cues.forEach((c, ci) => {
    const key = si + '_' + ci;
    fetch('voice/c' + key + '.mp3')
      .then(r => r.ok ? r.arrayBuffer() : Promise.reject(r.status))
      .then(ab => new Promise((ok, bad) => actx.decodeAudioData(ab, ok, bad)))
      .then(buf => { clips[key] = buf; })
      .catch(() => { clips[key] = null; clipsFailed++; });
  }));
}
function say(si, ci, offset = 0) {
  if (!voiceOn) return;
  const c = SCENES[si].cues[ci], buf = clips[si + '_' + ci];
  stopClip();
  if (buf && actx) {
    if (offset >= buf.duration - .2) return;
    const src = actx.createBufferSource(); src.buffer = buf;
    const g = actx.createGain(); g.gain.value = 1.6; src.connect(g); g.connect(master);
    src.start(0, offset); curSrc = src;
  } else if (buf === null || buf === undefined) speak(c[3], c[2]);
}
function stopClip() { if (curSrc) { try { curSrc.stop(); } catch (e) {} curSrc = null; } }
function hush() { stopClip(); if (synth) try { synth.cancel(); } catch (e) {} }

/* ---------- engine ---------- */
let T = 0, playing = false, last = 0, voiceOn = true, musicOn = true, lastSubKey = '';
const $ = id => document.getElementById(id);
const subEl = $('sub'), whoEl = $('who'), lineEl = $('line'), seek = $('seek'), timeEl = $('time');
const playBtn = $('play'), big = $('bigplay'), statusEl = $('status');
seek.max = TOTAL.toFixed(1);
const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

const chapters = $('chapters');
SCENES.forEach((s, i) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.innerHTML = `<span>${i + 1}. ${s.name}</span><span class="t">${fmt(s.start)}</span>`;
  b.addEventListener('click', () => { hush(); T = s.start + .01; render(); if (!playing) setPlaying(true); });
  li.appendChild(b); chapters.appendChild(li); s.btn = b;
});

function sceneAt(time) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (time >= SCENES[i].start) return SCENES[i];
  return SCENES[0];
}
function resize() {
  const r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
  let w = r.width, h = r.height;
  if (w / h > 16 / 9) w = h * 16 / 9; else h = w * 9 / 16;
  cv.width = Math.max(320, Math.round(w * d)); cv.height = Math.max(180, Math.round(h * d));
  render();
}
let activeBtn = null;
function render() {
  const sc = sceneAt(Math.min(T, TOTAL - .001)), t = Math.min(T, TOTAL - .001) - sc.start;
  CUR = { sc, t };
  ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.save(); sc.draw(sc.knots ? mapK(sc.knots, t, 1, 0) : t); ctx.restore();
  ctx.globalAlpha = 1;
  const fadeIn = sc.start > 0 ? 1 - seg(t, 0, .35) : 0, fadeOut = seg(t, sc.dur - .35, sc.dur);
  const f = Math.max(fadeIn, fadeOut);
  if (f > 0) { ctx.fillStyle = `rgba(6,18,22,${f})`; ctx.fillRect(0, 0, W, H); }
  const c = sc.cues.find(c => t >= c[0] && t < c[1]);
  if (window.__burnSubs && c) burnSub(c);
  const key = c ? sc.name + c[0] : '';
  if (key !== lastSubKey) {
    lastSubKey = key;
    if (c && !window.__burnSubs) { whoEl.textContent = c[2] + ':'; lineEl.textContent = c[3]; subEl.hidden = false; } else subEl.hidden = true;
  }
  seek.value = T.toFixed(1); timeEl.textContent = fmt(T) + ' / ' + fmt(TOTAL);
  if (activeBtn !== sc.btn) { if (activeBtn) activeBtn.classList.remove('on'); sc.btn.classList.add('on'); activeBtn = sc.btn; }
}
function burnSub(c) {
  ctx.font = `30px ${FONT}`;
  const s = c[2] + ': ' + c[3], w = Math.min(ctx.measureText(s).width + 44, W - 80);
  box(640 - w / 2, 640, w, 52, 14, 'rgba(8,22,28,.8)');
  ctx.font = `30px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff'; ctx.fillText(s, 640, 667, W - 100);
}
function triggers(a, b) {
  SCENES.forEach(sc => {
    const si = SCENES.indexOf(sc);
    sc.cues.forEach((c, ci) => { const g = sc.start + c[0]; if (g > a && g <= b) say(si, ci); });
    sc.sfx.forEach(x => { const g = sc.start + x[0]; if (g > a && g <= b) sfx(x[1]); });
  });
}
function frame(ts) {
  if (!playing) return;
  const dt = Math.min(.1, (ts - last) / 1000); last = ts;
  const prev = T; T = Math.min(TOTAL, T + dt);
  triggers(prev, T);
  render();
  if (T >= TOTAL) { setPlaying(false); return; }
  requestAnimationFrame(frame);
}
function setPlaying(on) {
  playing = on;
  playBtn.textContent = on ? 'Пауза' : (T >= TOTAL ? 'Ещё раз' : 'Смотреть');
  big.hidden = on;
  if (on) {
    if (T >= TOTAL) T = 0;
    if (ensureAudio()) nextAt = actx.currentTime + .05;
    loadClips();
    const sc = sceneAt(T), c = sc.cues.find(c => T - sc.start >= c[0] && T - sc.start < c[1]);
    if (c) say(SCENES.indexOf(sc), sc.cues.indexOf(c), T - sc.start - c[0]);
    last = performance.now(); requestAnimationFrame(frame);
  } else hush();
}
playBtn.addEventListener('click', () => setPlaying(!playing));
big.addEventListener('click', () => setPlaying(true));
cv.addEventListener('click', () => setPlaying(!playing));
$('restart').addEventListener('click', () => { hush(); T = 0; render(); setPlaying(true); });
seek.addEventListener('input', () => { hush(); T = parseFloat(seek.value) || 0; render(); });
$('voice').addEventListener('click', e => { voiceOn = !voiceOn; e.currentTarget.setAttribute('aria-pressed', voiceOn); e.currentTarget.textContent = 'Голос: ' + (voiceOn ? 'вкл' : 'выкл'); if (!voiceOn) { hush(); statusEl.textContent = ''; } });
$('music').addEventListener('click', e => { musicOn = !musicOn; e.currentTarget.setAttribute('aria-pressed', musicOn); e.currentTarget.textContent = 'Музыка: ' + (musicOn ? 'вкл' : 'выкл'); if (musicOn && actx) nextAt = actx.currentTime + .05; });
$('fs').addEventListener('click', () => {
  const p = $('player');
  try {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (p.requestFullscreen) p.requestFullscreen().catch(() => { statusEl.textContent = 'Полноэкранный режим здесь недоступен.'; });
    else statusEl.textContent = 'Полноэкранный режим здесь недоступен.';
  } catch (e) { statusEl.textContent = 'Полноэкранный режим здесь недоступен.'; }
});
document.addEventListener('fullscreenchange', () => setTimeout(resize, 60));
window.addEventListener('resize', resize);
window.__seek = time => { T = time; render(); };
window.__total = TOTAL;
window.__scenes = SCENES.map(s => ({ name: s.name, start: s.start, dur: s.dur, cues: s.cues, sfx: s.sfx }));
resize();
if (document.fonts && document.fonts.load) document.fonts.load(`40px Pangolin`).then(() => { lastSubKey = '-'; render(); }).catch(() => {});
