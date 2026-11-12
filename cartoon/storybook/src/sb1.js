// Episode 1 as a "living storybook": illustrated frames with slow camera moves, overlays, voices and music.
import { W, H, seg, ease, lerp } from './world.js';
import { startEpisode, speaking, banner, timerRing, checklist } from './eng3d.js';
import { drawToonFace } from './sets2.js';

const gl = document.createElement('canvas'); gl.width = W; gl.height = H; const g = gl.getContext('2d');
const IMG = {}; const load = n => new Promise(r => { const i = new Image(); i.onload = () => { IMG[n] = i; r(); }; i.src = `./sbimg/${n}.jpg`; });

// draw a frame with a slow zoom/pan: from [zoom, cx, cy] to [zoom, cx, cy] (centre in 0..1 of the image)
function kb(name, t, dur, a, b) {
  const im = IMG[name], k = ease(seg(t, 0, dur));
  const z = lerp(a[0], b[0], k), cx = lerp(a[1], b[1], k), cy = lerp(a[2], b[2], k);
  const sw = im.width / z, sh = im.height / z;
  const sx = Math.max(0, Math.min(im.width - sw, cx * im.width - sw / 2)), sy = Math.max(0, Math.min(im.height - sh, cy * im.height - sh / 2));
  g.drawImage(im, sx, sy, sw, sh, 0, 0, W, H);
}
// two frames inside one scene with a soft cross-fade
function two(t, dur, A, B, at) {
  kb(A[0], t, dur, A[1], A[2]);
  const f = seg(t, at - .5, at + .5); if (f > 0) { g.globalAlpha = f; kb(B[0], t, dur, B[1], B[2]); g.globalAlpha = 1; }
}
// Chiston: a magic round mirror with a face, floating in the corner
function chiston(cx, x, y, r, t, on = 1) {
  if (on <= 0) return;
  cx.save(); cx.globalAlpha = on; cx.shadowColor = 'rgba(143,230,245,.9)'; cx.shadowBlur = 40;
  cx.fillStyle = '#e9eff5'; cx.beginPath(); cx.ellipse(x, y, r * 1.08, r * 1.26, 0, 0, 7); cx.fill(); cx.shadowBlur = 0;
  cx.beginPath(); cx.ellipse(x, y, r, r * 1.18, 0, 0, 7); cx.clip(); cx.translate(x - r, y - r * 1.18);
  drawToonFace(cx, r * 2, r * 2.36, { t, talk: speaking('Чистон') }); cx.restore();
}
const STEPS = ['Почистить зубы', 'Умыться', 'Сделать зарядку', 'Вещи — по местам', 'Одеться — и завтракать'];

// frame plan per scene (p1 family, p2 mama wakes, p3 tablet & mess, p4 things run, p5 exercise, p6 teeth at the sink, p7 face washing)
const PLAN = {
  'Заставка': t => kb('p1', t, 5, [1.0, .5, .5], [1.12, .5, .45]),
  'Мама будит': t => kb('p2', t, 14.5, [1.25, .55, .45], [1.0, .5, .5]),
  'Планшет ругается': t => kb('p3', t, 14, [1.0, .5, .5], [1.35, .38, .55]),
  'Вещи сбегают': t => kb('p10', t, 13, [1.0, .5, .5], [1.25, .45, .55]),
  'Чистон в зеркале': t => kb('p6', t, 16, [1.0, .5, .5], [1.08, .5, .45]),
  'Шаг 1 · Зубы': t => kb('p6', t, 16, [1.15, .5, .4], [1.45, .5, .38]),
  'Шаг 2 · Умыться': t => kb('p7', t, 12, [1.0, .5, .5], [1.25, .5, .45]),
  'Шаг 3 · Зарядка': t => kb('p9', t, 18, [1.0, .5, .5], [1.2, .4, .5]),
  'Шаг 4 · Порядок': t => two(t, 18, ['p3', [1.2, .75, .5], [1.0, .5, .5]], ['p1', [1.0, .5, .5], [1.1, .5, .5]], 12),
  'Шаг 5 · Одеться': t => two(t, 16, ['p2', [1.0, .5, .5], [1.15, .62, .4]], ['p8', [1.15, .5, .5], [1.0, .5, .5]], 9),
  'Конец': t => kb('p8', t, 6, [1.12, .5, .45], [1.0, .5, .5]),
};
const TITLES = { 'Заставка': ['Чистон', 'Серия 1. Вещи сбежали'], 'Конец': ['Конец', 'первой серии'] };
const OVER = {
  'Чистон в зеркале': (cx, t) => { chiston(cx, 1110, 190, 105, t, seg(t, 0, .8)); if (t > 6) checklist(cx, 'План утреннего героя', STEPS, Math.min(5, Math.floor(seg(t, 6, 13) * 5) + 1), 0, 40, 60); },
  'Шаг 1 · Зубы': (cx, t, tr) => { banner(cx, 'Шаг 1 из 5 · Зубы'); const left = Math.max(0, 120 - (t / 15) * 120); timerRing(cx, 1150, 120, 60, left / 120, `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`, 'ускорено ×10'); chiston(cx, 1150, 520, 70, tr, speaking('Чистон') ? 1 : 0); },
  'Шаг 2 · Умыться': (cx, t, tr) => { banner(cx, 'Шаг 2 из 5 · Умыться'); chiston(cx, 1150, 170, 80, tr); },
  'Шаг 3 · Зарядка': (cx, t, tr) => { banner(cx, 'Шаг 3 из 5 · Зарядка'); chiston(cx, 110, 560, 70, tr); },
  'Шаг 4 · Порядок': cx => banner(cx, 'Шаг 4 из 5 · Порядок'),
  'Шаг 5 · Одеться': cx => banner(cx, 'Шаг 5 из 5 · Одеться'),
};

(async () => {
  await Promise.all(['p1', 'p2', 'p3', 'p6', 'p7', 'p8', 'p9', 'p10'].map(load));
  const src = await (await fetch('./cq1_cues.json')).json();
  const SCENES = src.map(s => ({ name: s.name, dur: s.dur, cues: s.cues, sfx: s.sfx, quiet: s.quiet, clip: s.clip || undefined, title: TITLES[s.name],
    update(to) { (PLAN[s.name] || PLAN['Заставка'])(to); },
    overlay: OVER[s.name] ? (cx, to, t) => OVER[s.name](cx, to, t) : undefined }));
  startEpisode(SCENES, { scene: null, cam: null, renderer: { render() {} }, gl, warpUrl: './warp3d_1.json' });
})();
