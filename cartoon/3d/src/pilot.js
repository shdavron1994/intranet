// Pilot: the first minute of episode 1 in 3D.
import * as THREE from 'three';
import { makeDilshod, makeTomiris, makeMom } from './cast.js';
import { W, H, seg, ease, lerp, clamp, makeRenderer, makeTablet, makeChiston, makeBedroom, sneaker, sock, toyCar, backpack, sphere, at, camAt, mat } from './world.js';

const canvas3d = document.getElementById('gl');
const renderer = makeRenderer(canvas3d);
const comp = document.getElementById('out'), cx = comp.getContext('2d');
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(38, W / H, .05, 60);

const hemi = new THREE.HemisphereLight('#e3f2ff', '#c99a6b', .5); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1d6', .3); sun.position.set(-3, 6, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 5, bottom: -3 }); sun.shadow.bias = -.0005; scene.add(sun);
const winLight = new THREE.SpotLight('#ffe8b0', 0, 12, .7, .6); winLight.position.set(1.6, 2.4, -2.6); winLight.target.position.set(0, 0, .6); winLight.castShadow = true; winLight.shadow.mapSize.set(1024, 1024); scene.add(winLight, winLight.target);

const room = makeBedroom(); scene.add(room.group);
const D = makeDilshod({ shirt: '#9fc3ff', pants: '#9fc3ff', pajama: true });
const T = makeTomiris({ shirt: '#ffc2d6', pants: '#ffc2d6', pajama: true, flowers: false, collar: false, belt: false, shoes: '#ff9fbd' });
const M = makeMom();
scene.add(D.root, T.root, M.root);
const pix = makeTablet(); scene.add(pix.root);
const mirror = makeChiston(); mirror.root.scale.setScalar(.45); mirror.root.position.set(-2.55, 1.95, -2.95); scene.add(mirror.root);
// the mess
const MESS = {
  sneakA: [sneaker(), [.9, 0, .9], 0.4], sneakB: [sneaker(), [1.25, 0, .7], -.3],
  sock1: [sock(), [-.2, 0, 1.1], 1.5], sock2: [sock(), [.3, 2.1, -.5], 0],
  car1: [toyCar('#ffd23f'), [.4, 0, .4], .6], car2: [toyCar('#5dff9a'), [-.9, 0, .9], -.4],
  back: [backpack(), [2.4, 0, -.3], .3]
};
Object.values(MESS).forEach(([o, p, r]) => { o.position.set(...p); o.rotation.y = r; scene.add(o); });

// floating soap bubbles for the title
const bubbles = []; for (let i = 0; i < 26; i++) { const b = sphere(.05 + (i % 4) * .03, mat('#dff6ff', { transparent: true, opacity: .35, roughness: .05, metalness: .2 }), 20); b.castShadow = false; bubbles.push(b); scene.add(b); }

/* ---------- timeline ---------- */
let CUR = null;
const speaking = name => { if (!CUR) return false; const c = CUR.sc.cues.find(c => CUR.t >= c[0] && CUR.t < c[1]); if (!c) return false; return c[2] === name || (c[2] === 'Дети' && (name === 'Дилшод' || name === 'Томирис')); };
const BED = [-3.4, -1.7];
function lie(P, bedX, t, who) { P.root.position.set(bedX, .66, -1.54); P.body.rotation.set(-Math.PI / 2, 0, 0); P.set({ t, sleep: true, talk: speaking(who), armL: .1, armR: .1 }); }
function stand(P) { P.body.rotation.set(0, 0, 0); }
function blankets(sleep) { room.beds.forEach(b => { b.userData.blanket.scale.y = sleep ? 2.2 : 1; b.userData.blanket.position.y = sleep ? .7 : .58; }); }
function lights(k) { sun.intensity = lerp(.25, 1.5, k); hemi.intensity = lerp(.35, .9, k); winLight.intensity = lerp(0, 22, k); }
function curtains(k) { room.curtL.position.x = lerp(1.15, .55, k); room.curtL.scale.x = lerp(1, .45, k); room.curtR.position.x = lerp(2.05, 2.65, k); room.curtR.scale.x = lerp(1, .45, k); }
function doorOpen(k) { room.door.rotation.y = -k * 1.6; }
function messAt() { Object.values(MESS).forEach(([o, p, r]) => { o.visible = true; o.position.set(...p); o.rotation.set(0, r, 0); }); }
function hideBubbles() { bubbles.forEach(b => b.visible = false); }
function walkTo(P, from, to, t0, t1, t) { const k = seg(t, t0, t1); P.root.position.set(lerp(from[0], to[0], k), 0, lerp(from[1], to[1], k)); const moving = k > 0 && k < 1; if (moving) P.root.rotation.y = Math.atan2(to[0] - from[0], to[1] - from[1]); return moving ? (t - t0) * 9 : 0; }

const SCENES = [
  { name: 'Заставка', dur: 6, title: ['Чистон', 'Серия 1. Вещи сбежали'],
    cues: [[1, 5.6, 'Рассказчик', 'Чистон. Серия первая: «Вещи сбежали».']],
    update(t) {
      [D, T, M].forEach(P => P.root.visible = false); pix.root.visible = false; Object.values(MESS).forEach(([o]) => o.visible = false);
      lights(1); curtains(1); room.group.visible = false; scene.background = new THREE.Color('#0e3a46');
      mirror.root.visible = true; mirror.root.position.set(0, 1.5, 0); mirror.root.scale.setScalar(1); mirror.root.rotation.y = Math.sin(t * .8) * .35;
      mirror.set({ t, on: 1 });
      bubbles.forEach((b, i) => { b.visible = true; const a = i * 2.4; b.position.set(Math.cos(a) * (1.2 + (i % 5) * .35), ((t * (.25 + (i % 4) * .08) + i * .37) % 3.4) - .3, Math.sin(a) * 1.4 - .6); });
      camAt(cam, t, [[0, [0, 1.6, 6], [0, 1.4, 0]], [6, [0, 1.5, 3.4], [0, 1.45, 0]]], .5);
    } },

  { name: 'Мама будит', dur: 15,
    cues: [[4.6, 7.8, 'Мама', 'Дилшод, Томирис, солнышки, просыпайтесь! Утро!'],
      [8.2, 10.4, 'Дети', 'Ещё пять минуточек…'],
      [10.8, 14.2, 'Мама', 'Вставайте, в садик пора. Я пошла готовить завтрак.']],
    update(t) {
      room.group.visible = true; scene.background = new THREE.Color('#9fd4ff'); hideBubbles();
      mirror.root.position.set(-2.55, 1.95, -2.95); mirror.root.scale.setScalar(.45); mirror.root.rotation.set(0, 0, 0); mirror.set({ t, on: 0 });
      pix.root.visible = true; pix.root.position.set(-.5, 0, -.5); pix.root.rotation.set(-1.45, 0, 0); pix.set({ t, sleep: true, smudge: 1 });
      [D, T, M].forEach(P => P.root.visible = true); messAt(); blankets(true);
      lie(D, BED[0], t, 'Дилшод'); lie(T, BED[1], t + 1.3, 'Томирис');
      const k = ease(seg(t, 2.2, 3.6)); curtains(k); lights(k); doorOpen(t < 12.6 ? seg(t, 0, .8) : 1 - seg(t, 14, 14.8));
      stand(M); let w = 0;
      if (t < 2.2) w = walkTo(M, [4.1, -2.4], [1.6, -2.1], .3, 2.2, t);
      else if (t < 4.2) { M.root.position.set(1.6, 0, -2.1); M.root.rotation.y = Math.PI; }
      else if (t < 12.6) { w = walkTo(M, [1.6, -2.1], [-.4, -.6], 4.2, 5.6, t); if (t >= 5.6) M.root.rotation.y = -1.1; }
      else w = walkTo(M, [-.4, -.6], [4.1, -2.4], 12.6, 15, t);
      const up = t >= 2.2 && t < 3.8;
      M.set({ t, walk: w, talk: speaking('Мама'), armL: up ? 2.6 : (t > 5.6 && t < 12.6 ? .9 : .1), armR: up ? 2.6 : .1, armLx: up ? .3 : null, armRx: up ? .3 : null, mood: 'happy' });
      if (t < 4.6) camAt(cam, t, [[0, [4.6, 2.4, 3.8], [1, 1.1, -1.6]], [4.6, [3.4, 2, 2.6], [1.4, 1.4, -2]]]);
      else if (t < 8.2) camAt(cam, t - 4.6, [[0, [.9, 1.75, .9], [-.4, 1.55, -.6]], [3.6, [.7, 1.7, .6], [-.4, 1.6, -.6]]]);
      else if (t < 10.8) camAt(cam, t - 8.2, [[0, [-2.5, 2.3, -.3], [-2.5, .7, -2.6]], [2.6, [-2.5, 2.1, -.7], [-2.5, .7, -2.5]]]);
      else camAt(cam, t - 10.8, [[0, [2.8, 2.1, 3.2], [-.2, 1.1, -1]], [4.2, [3.6, 2.2, 3.8], [1.5, 1.2, -1.8]]]);
    } },

  { name: 'Подъём', dur: 14,
    cues: [[2.6, 6.6, 'Пиксель', 'Фу-у! Руки липкие, экран в пятнах! Ты даже не умылся!'],
      [7, 11, 'Пиксель', 'И посмотри вокруг! Как будто ураган прошёл!'],
      [11.3, 14, 'Дилшод', 'Ну и что? Мне и так нормально.']],
    sfx: [[2.4, 'error']],
    update(t) {
      room.group.visible = true; hideBubbles(); curtains(1); lights(1); doorOpen(0); blankets(false); messAt();
      [D, T, M].forEach(P => P.root.visible = true); M.root.visible = false;
      // jump out of bed
      const k = ease(seg(t, 0, 1.1));
      [[D, BED[0], [-1.2, .2]], [T, BED[1], [.2, .5]]].forEach(([P, bx, to], i) => {
        P.root.position.set(lerp(bx, to[0], k), lerp(.66, 0, k) + Math.sin(Math.PI * k) * .6, lerp(-1.54, to[1], k));
        P.body.rotation.set(lerp(-Math.PI / 2, 0, k), 0, 0); P.root.rotation.y = lerp(0, i ? -.3 : .4, k);
      });
      const dReach = t > 1.4 && t < 2.6;
      const dPos = t < 1.4 ? [-1.2, .2] : [lerp(-1.2, -.95, seg(t, 1.4, 2)), lerp(.2, -.05, seg(t, 1.4, 2))];
      if (t >= 1.1) { D.root.position.set(dPos[0], 0, dPos[1]); D.root.rotation.y = t > 7 && t < 11 ? Math.sin(t) * .6 : .4; }
      const look = t >= 7 && t < 11 ? [Math.sin(t * 1.4), .2] : [0, -.4];
      D.set({ t, talk: speaking('Дилшод'), walk: t > 1.4 && t < 2 ? t * 9 : 0, mood: t < 2.6 ? 'happy' : t < 11 ? 'wow' : 'happy', armL: k < 1 ? 2.6 : .15, armR: k < 1 ? 2.6 : (dReach ? 1.2 : .15), armRx: dReach ? 1 : null, look });
      T.set({ t: t + 1.3, mood: t > 7 && t < 11 ? 'wow' : 'happy', armL: k < 1 ? 2.6 : .12, armR: k < 1 ? 2.6 : .12, look });
      // the tablet stands up and complains
      const st = ease(seg(t, 2, 2.6));
      pix.root.visible = true; pix.root.position.set(-.5, 0, -.5); pix.root.rotation.set(lerp(-1.45, 0, st), .3, 0);
      pix.set({ t, sleep: t < 2.4, error: t >= 2.4 && t < 7, smudge: 1, mood: 'angry', talk: speaking('Пиксель'), wave: t > 2.6 });
      if (t < 2.6) camAt(cam, t, [[0, [1.5, 2.2, 3.2], [-1.4, .8, -1]], [2.6, [.8, 1.6, 2.2], [-.8, .7, -.4]]]);
      else if (t < 7) camAt(cam, t - 2.6, [[0, [.25, .62, .5], [-.5, .45, -.5]], [4.4, [.12, .56, .28], [-.5, .45, -.5]]]);
      else if (t < 11) { const a = seg(t, 7, 11); camAt(cam, t - 7, [[0, [2.6, 1.6, 2.6], [.5, .3, .6]], [4, [-1.6, 1.7, 2.8], [.3, .4, .4]]]); }
      else camAt(cam, t - 11, [[0, [-.4, 1.15, 1.1], [-.7, 1, -.1]], [3, [-.5, 1.12, .95], [-.7, 1, -.1]]]);
    } },

  { name: 'Вещи сбегают', dur: 13,
    cues: [[0, 2.4, 'Пиксель', 'Всё, я ухожу!'],
      [2.6, 6.2, 'Вещи', 'И мы! И мы! Нам тут неуютно!'],
      [7, 10.4, 'Дети', 'Стойте! Вернитесь!'],
      [10.6, 13, 'Томирис', 'Ой! И машинки убежали!']],
    sfx: [[1, 'boing'], [2.8, 'boing'], [4.6, 'boing']],
    update(t) {
      room.group.visible = true; hideBubbles(); curtains(1); lights(1); blankets(false);
      doorOpen(t < 10.4 ? seg(t, .2, 1) : 1 - seg(t, 11, 12)); M.root.visible = false;
      D.root.visible = T.root.visible = true; D.body.rotation.set(0, 0, 0); T.body.rotation.set(0, 0, 0);
      D.root.position.set(-.95, 0, -.05); T.root.position.set(.2, 0, .5); D.root.rotation.y = T.root.rotation.y = .9;
      const shout = t >= 7;
      D.set({ t, talk: speaking('Дилшод'), mood: shout ? 'sad' : 'wow', armL: shout ? 2.4 + Math.sin(t * 8) * .2 : .2, armR: shout ? 2.4 - Math.sin(t * 8) * .2 : .2, look: [1, 0] });
      T.set({ t: t + 1.3, mood: t > 10.6 ? 'sad' : 'wow', look: [1, 0], armL: t > 10.6 ? 1.4 : .1 });
      const DOOR = [4.1, -2.3];
      const run = (o, from, st, i) => { const k = seg(t, st, st + 2.6); const hop = Math.abs(Math.sin(k * Math.PI * 5)) * .18 * (k > 0 && k < 1); o.position.set(lerp(from[0], DOOR[0], k), (from[1] > .5 && k === 0 ? from[1] : hop), lerp(from[2], DOOR[1], k)); o.rotation.y = Math.atan2(DOOR[0] - from[0], DOOR[1] - from[2]); o.visible = k < 1; };
      const ks = Object.keys(MESS); ks.forEach((key, i) => { const [o, p] = MESS[key]; const from = key === 'sock2' && t < 2.6 ? p : (key === 'sock2' ? [.3, 0, -.5] : p); if (key === 'sock2' && t < 2.6) { o.position.set(...p); o.visible = true; return; } run(o, from, 1.2 + i * .55, i); });
      const pk = seg(t, .4, 3.2); pix.root.visible = pk < 1; pix.root.rotation.set(0, Math.atan2(DOOR[0] + .5, DOOR[1] + .5), 0);
      pix.root.position.set(lerp(-.5, DOOR[0], pk), 0, lerp(-.5, DOOR[1], pk)); pix.set({ t, smudge: 1, mood: 'angry', talk: speaking('Пиксель'), walk: pk > 0 && pk < 1 ? t * 14 : 0 });
      if (t < 7) camAt(cam, t, [[0, [.6, .45, 1.6], [1.6, .2, -.6]], [7, [2.6, .5, .6], [4, .4, -2.2]]], .6);
      else if (t < 10.6) camAt(cam, t - 7, [[0, [1.6, 1.2, 1.7], [-.4, 1, 0]], [3.6, [1.3, 1.15, 1.4], [-.4, 1, .1]]]);
      else camAt(cam, t - 10.6, [[0, [.9, .95, 1.6], [.2, .85, .5]], [2.4, [.8, .9, 1.4], [.2, .85, .5]]]);
    } }
];

let acc = 0; SCENES.forEach(s => { s.start = acc; acc += s.dur; s.sfx = s.sfx || []; });
const TOTAL = acc;
const FONT = '"Pangolin","Nunito","DejaVu Sans",sans-serif';
function sceneAt(time) { for (let i = SCENES.length - 1; i >= 0; i--) if (time >= SCENES[i].start) return SCENES[i]; return SCENES[0]; }
function overlay(sc, t) {
  cx.drawImage(canvas3d, 0, 0);
  const fadeIn = sc.start > 0 ? 1 - seg(t, 0, .35) : 0, fadeOut = seg(t, sc.dur - .35, sc.dur), f = Math.max(fadeIn, fadeOut);
  if (sc.title) {
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.font = `110px ${FONT}`; cx.fillStyle = '#ffd23f'; cx.shadowColor = 'rgba(0,0,0,.35)'; cx.shadowBlur = 18; cx.fillText(sc.title[0], 640, 560);
    cx.font = `48px ${FONT}`; cx.fillStyle = '#ffffff'; cx.fillText(sc.title[1], 640, 640); cx.shadowBlur = 0;
  }
  const c = sc.cues.find(c => t >= c[0] && t < c[1]);
  if (c && !sc.title) {
    cx.font = `30px ${FONT}`; const s = c[2] + ': ' + c[3], w = Math.min(cx.measureText(s).width + 44, W - 80);
    cx.fillStyle = 'rgba(8,22,28,.75)'; cx.beginPath(); cx.roundRect(640 - w / 2, 640, w, 52, 14); cx.fill();
    cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = '#ffffff'; cx.fillText(s, 640, 667, W - 100);
  }
  if (f > 0) { cx.fillStyle = `rgba(6,18,22,${f})`; cx.fillRect(0, 0, W, H); }
}
window.__total = TOTAL;
window.__scenes = SCENES.map(s => ({ name: s.name, start: s.start, dur: s.dur, cues: s.cues, sfx: s.sfx }));
window.frameAt = (time, q = .9) => {
  const sc = sceneAt(Math.min(time, TOTAL - .001)), t = Math.min(time, TOTAL - .001) - sc.start;
  CUR = { sc, t };
  sc.update(t);
  renderer.render(scene, cam);
  overlay(sc, t);
  return comp.toDataURL('image/jpeg', q);
};
document.fonts.load('40px Pangolin').finally(() => { window.ready = true; });
