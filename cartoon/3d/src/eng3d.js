// Shared 3D episode engine: timeline, warp to fit voices, subtitles and 2D overlays, frame export.
import { W, H, seg, ease } from './world.js';

export const FONT = '"Pangolin","Nunito","DejaVu Sans",sans-serif';
export const state = { CUR: null };
const KIDS = ['Дилшод', 'Томирис'];
export function speaking(name) {
  const C = state.CUR; if (!C) return false;
  const c = C.sc.cues.find(c => C.t >= c[0] && C.t < c[1]); if (!c) return false;
  if (c[2] === name) return true;
  if ((c[2] === 'Дети' || c[2] === 'Песня') && KIDS.includes(name)) return true;
  if (c[2] === 'Все' && (KIDS.includes(name) || name === 'Мама' || name === 'Папа' || name === 'Чистон')) return true;
  return false;
}
function mapK(k, v, a, b) {
  for (let i = 1; i < k.length; i++) if (v <= k[i][a] || i === k.length - 1) { const p = (v - k[i - 1][a]) / ((k[i][a] - k[i - 1][a]) || 1); return k[i - 1][b] + p * (k[i][b] - k[i - 1][b]); }
  return v;
}

/* ---------- 2D overlay helpers (drawn on top of the 3D frame) ---------- */
export function pill(cx, x, y, s, size, bg, fg, anchor = 'left') {
  cx.font = `${size}px ${FONT}`; const w = cx.measureText(s).width + size * 1.3, h = size * 1.75;
  const left = anchor === 'left' ? x : anchor === 'right' ? x - w : x - w / 2;
  cx.fillStyle = bg; cx.beginPath(); cx.roundRect(left, y, w, h, h / 2); cx.fill();
  cx.fillStyle = fg; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(s, left + w / 2, y + h / 2 + 1);
}
export function banner(cx, s) { pill(cx, 28, 26, s, 30, '#ffd23f', '#0e3a46'); }
export function timerRing(cx, x, y, r, frac, label, sub) {
  cx.fillStyle = 'rgba(14,58,70,.85)'; cx.beginPath(); cx.arc(x, y, r + 14, 0, 7); cx.fill();
  cx.lineWidth = 12; cx.strokeStyle = 'rgba(255,255,255,.18)'; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.stroke();
  cx.strokeStyle = '#ffd23f'; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, frac))); cx.stroke();
  cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = `${r * .5}px ${FONT}`; cx.fillText(label, x, y - 4);
  if (sub) { cx.font = `17px ${FONT}`; cx.fillStyle = '#a7cdd2'; cx.fillText(sub, x, y + r * .42); }
}
export function checklist(cx, title, items, shown, done, x = 820, y = 110) {
  const h = 70 + items.length * 52;
  cx.fillStyle = 'rgba(14,58,70,.9)'; cx.beginPath(); cx.roundRect(x, y, 420, h, 20); cx.fill();
  cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = `28px ${FONT}`; cx.fillStyle = '#ffd23f'; cx.fillText(title, x + 210, y + 36);
  items.forEach((s, i) => {
    if (i >= shown) return;
    const yy = y + 80 + i * 52, ok = i < done;
    cx.fillStyle = ok ? '#5dff9a' : 'rgba(255,255,255,.2)'; cx.beginPath(); cx.arc(x + 40, yy, 16, 0, 7); cx.fill();
    cx.fillStyle = ok ? '#0b2d36' : '#fff'; cx.font = `20px ${FONT}`; cx.textAlign = 'center'; cx.fillText(ok ? '✓' : String(i + 1), x + 40, yy + 1);
    cx.textAlign = 'left'; cx.font = `25px ${FONT}`; cx.fillStyle = ok ? '#a7cdd2' : '#fff'; cx.fillText(s, x + 70, yy + 1);
  });
}
export function stars(cx, x, y, n, filled, pop) {
  cx.fillStyle = 'rgba(255,255,255,.92)'; cx.beginPath(); cx.roundRect(x - 120, y - 60, 240, 150, 16); cx.fill();
  cx.fillStyle = '#0e3a46'; cx.font = `20px ${FONT}`; cx.textAlign = 'center'; cx.fillText('Звёздочки', x, y - 40);
  for (let i = 0; i < n; i++) {
    const sx = x - 90 + (i % 4) * 60, sy = y + Math.floor(i / 4) * 50;
    const k = i < filled ? (i === filled - 1 && pop != null ? Math.min(1, pop) : 1) : 0;
    cx.save(); cx.translate(sx, sy); cx.beginPath();
    for (let j = 0; j < 10; j++) { const rr = (j % 2 ? 9 : 20) * (k || 1), a = -Math.PI / 2 + j * Math.PI / 5; cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    cx.closePath(); if (k) { cx.fillStyle = '#ffd23f'; cx.fill(); } else { cx.strokeStyle = '#c9d4de'; cx.lineWidth = 3; cx.stroke(); }
    cx.restore();
  }
}

/* ---------- engine ---------- */
export async function startEpisode(SCENES, { scene, cam, renderer, gl, warpUrl }) {
  const comp = document.getElementById('out'), cx = comp.getContext('2d');
  let WARP = {};
  if (warpUrl) try { const r = await fetch(warpUrl); if (r.ok) WARP = await r.json(); } catch (e) {}
  SCENES.forEach((s, i) => {
    s.sfx = s.sfx || [];
    const k = WARP[i]; if (!k) return;
    const toReal = v => mapK(k, v, 0, 1);
    s.knots = k; s.cues = s.cues.map(c => [toReal(c[0]), toReal(c[1]), c[2], c[3]]); s.sfx = s.sfx.map(x => [toReal(x[0]), x[1]]);
    if (s.clip) s.clip = Object.assign({}, s.clip, { at: toReal(s.clip.at) });
    s.dur = k[k.length - 1][1];
  });
  let acc = 0; SCENES.forEach(s => { s.start = acc; acc += s.dur; });
  const TOTAL = acc;
  const sceneAt = time => { for (let i = SCENES.length - 1; i >= 0; i--) if (time >= SCENES[i].start) return SCENES[i]; return SCENES[0]; };
  function overlay(sc, t, to) {
    cx.drawImage(gl, 0, 0);
    if (sc.overlay) { cx.save(); sc.overlay(cx, to, t); cx.restore(); }
    if (sc.title) {
      const g = cx.createLinearGradient(0, 380, 0, 720); g.addColorStop(0, 'rgba(6,30,38,0)'); g.addColorStop(1, 'rgba(6,30,38,.85)'); cx.fillStyle = g; cx.fillRect(0, 380, W, 340);
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.shadowColor = 'rgba(0,0,0,.35)'; cx.shadowBlur = 18;
      cx.font = `110px ${FONT}`; cx.fillStyle = '#ffd23f'; cx.fillText(sc.title[0], 640, 560);
      cx.font = `48px ${FONT}`; cx.fillStyle = '#ffffff'; cx.fillText(sc.title[1], 640, 640); cx.shadowBlur = 0;
    }
    const c = sc.cues.find(c => t >= c[0] && t < c[1]);
    if (c && !sc.title) {
      cx.font = `30px ${FONT}`; const s = c[2] + ': ' + c[3], w = Math.min(cx.measureText(s).width + 44, W - 80);
      cx.fillStyle = 'rgba(8,22,28,.75)'; cx.beginPath(); cx.roundRect(640 - w / 2, 640, w, 52, 14); cx.fill();
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = '#ffffff'; cx.fillText(s, 640, 667, W - 100);
    }
    const fadeIn = sc.start > 0 ? 1 - seg(t, 0, .35) : 0, fadeOut = seg(t, sc.dur - .35, sc.dur), f = Math.max(fadeIn, fadeOut);
    if (f > 0) { cx.fillStyle = `rgba(6,18,22,${f})`; cx.fillRect(0, 0, W, H); }
  }
  window.__total = TOTAL;
  window.__scenes = SCENES.map(s => ({ name: s.name, start: s.start, dur: s.dur, cues: s.cues, sfx: s.sfx, quiet: !!s.quiet, clip: s.clip || null }));
  window.frameAt = (time, q = .9) => {
    const sc = sceneAt(Math.min(time, TOTAL - .001)), t = Math.min(time, TOTAL - .001) - sc.start;
    state.CUR = { sc, t };
    const to = sc.knots ? mapK(sc.knots, t, 1, 0) : t;
    sc.update(to, t);
    renderer.render(scene, cam);
    overlay(sc, t, to);
    return comp.toDataURL('image/jpeg', q);
  };
  try { await document.fonts.load('40px Pangolin'); } catch (e) {}
  window.ready = true;
}
