// Episode 1 in 3D: «Вещи сбежали».
import * as THREE from 'three';
import { makeDilshod, makeTomiris, makeMom } from './cast.js';
import { W, H, seg, ease, lerp, makeRenderer, makeTablet, makeBedroom, sneaker, sock, toyCar, backpack, sphere, at, camAt, mat } from './world.js';
import { makeBathroom, toothbrush, foam, sparkles, hook, foldedClothes } from './sets.js';
import { startEpisode, speaking, banner, timerRing, checklist } from './eng3d.js';

const gl = document.getElementById('gl');
const renderer = makeRenderer(gl);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#9fd4ff');
const cam = new THREE.PerspectiveCamera(38, W / H, .05, 80);
const hemi = new THREE.HemisphereLight('#e3f2ff', '#c99a6b', .5); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1d6', .3); sun.position.set(-3, 6, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 5, bottom: -3 }); sun.shadow.bias = -.0005; scene.add(sun, sun.target);
const winLight = new THREE.SpotLight('#ffe8b0', 0, 12, .7, .6); winLight.position.set(1.6, 2.4, -2.6); winLight.target.position.set(0, 0, .6); winLight.castShadow = true; winLight.shadow.mapSize.set(1024, 1024); scene.add(winLight, winLight.target);

/* sets: bedroom at the origin, bathroom far to the right */
const room = makeBedroom(); scene.add(room.group);
const BX = 20;
const bath = makeBathroom(); bath.group.position.x = BX; scene.add(bath.group);
const bathLight = new THREE.PointLight('#fff4e0', 0, 9); bathLight.position.set(BX, 2.8, -.5); bathLight.castShadow = true; scene.add(bathLight);
const coatHook = hook(); coatHook.position.set(2.9, 1.45, -2.95); scene.add(coatHook);

/* cast: pajama and day versions */
const D = makeDilshod({ shirt: '#9fc3ff', pants: '#9fc3ff', pajama: true });
const T = makeTomiris({ shirt: '#ffc2d6', pants: '#ffc2d6', pajama: true, flowers: false, collar: false, belt: false, shoes: '#ff9fbd' });
const Dd = makeDilshod(), Td = makeTomiris();
const M = makeMom({ apron: true });
[D, T, Dd, Td, M].forEach(P => scene.add(P.root));
const pix = makeTablet(); scene.add(pix.root);
const mirror = bath.mirror;
const brushD = toothbrush('#4cc3ff'), brushT = toothbrush('#ff7aa2');
D.arms[1].userData.hand.add(brushD); T.arms[1].userData.hand.add(brushT); brushD.rotation.x = brushT.rotation.x = -1.4;
const foamD = foam(), foamT = foam(); D.arms[1].userData.hand.add(foamD); T.arms[1].userData.hand.add(foamT);
const spark = sparkles(); scene.add(spark);
const clothesD = foldedClothes('#2fb5a0'), clothesT = foldedClothes('#e64980'); scene.add(clothesD, clothesT);

const MESS = {
  sneakA: [sneaker(), [.9, 0, .9], .4, [3.9, 0, -2.1]], sneakB: [sneaker(), [1.25, 0, .7], -.3, [4.15, 0, -1.9]],
  sock1: [sock(), [-.2, 0, 1.1], 1.5, [3.6, .7, -2.5]], sock2: [sock(), [.3, 2.1, -.5], 0, [3.6, .7, -2.5]],
  car1: [toyCar('#ffd23f'), [.4, 0, .4], .6, [.8, .5, -2.5]], car2: [toyCar('#5dff9a'), [-.9, 0, .9], -.4, [.8, .5, -2.5]],
  back: [backpack(), [2.4, 0, -.3], .3, [2.9, 1.0, -2.85]]
};
const HIDE_AT_PLACE = { sock1: 1, sock2: 1, car1: 1, car2: 1 };
Object.values(MESS).forEach(([o]) => scene.add(o));
const bubbles = []; for (let i = 0; i < 26; i++) { const b = sphere(.05 + (i % 4) * .03, mat('#dff6ff', { transparent: true, opacity: .35, roughness: .05, metalness: .2 }), 20); b.castShadow = false; bubbles.push(b); scene.add(b); }

/* helpers */
const BED = [-3.4, -1.7];
const PAJAMA = [D, T], DAY = [Dd, Td];
function cast(...on) { [D, T, Dd, Td, M].forEach(P => P.root.visible = on.includes(P)); }
function lie(P, bedX, t, who) { P.root.position.set(bedX, .66, -1.54); P.root.rotation.set(0, 0, 0); P.body.rotation.set(-Math.PI / 2, 0, 0); P.set({ t, sleep: true, talk: speaking(who), armL: .1, armR: .1 }); }
function stand(P, x, z, ry) { P.body.rotation.set(0, 0, 0); P.root.position.set(x, P === T || P === Td ? 0 : 0, z); P.root.rotation.set(0, ry || 0, 0); }
function blankets(sleep) { room.beds.forEach(b => { b.userData.blanket.scale.y = sleep ? 2.2 : 1; b.userData.blanket.position.y = sleep ? .7 : .58; }); }
function lights(k) { sun.intensity = lerp(.25, 1.5, k); hemi.intensity = lerp(.35, .9, k); winLight.intensity = lerp(0, 22, k); bathLight.intensity = 0; }
function bathLights() { sun.intensity = .35; hemi.intensity = .7; winLight.intensity = 0; bathLight.intensity = 8; }
function fov(f) { if (cam.fov !== f) { cam.fov = f; cam.updateProjectionMatrix(); } }
function curtains(k) { room.curtL.position.x = lerp(1.15, .55, k); room.curtL.scale.x = lerp(1, .45, k); room.curtR.position.x = lerp(2.05, 2.65, k); room.curtR.scale.x = lerp(1, .45, k); }
function doorOpen(k) { room.door.rotation.y = -k * 1.6; }
function messAt(skip = {}) { Object.entries(MESS).forEach(([k, [o, p, r]]) => { o.visible = !skip[k]; o.position.set(...p); o.rotation.set(0, r, 0); }); }
function placed(skip = {}) { Object.entries(MESS).forEach(([k, [o, , , pl]]) => { o.visible = !HIDE_AT_PLACE[k] && !skip[k]; o.position.set(...pl); o.rotation.set(0, 0, 0); }); }
function noBubbles() { bubbles.forEach(b => b.visible = false); }
function walkTo(P, from, to, t0, t1, t) { const k = seg(t, t0, t1); P.root.position.set(lerp(from[0], to[0], k), 0, lerp(from[1], to[1], k)); const moving = k > 0 && k < 1; if (moving) P.root.rotation.y = Math.atan2(to[0] - from[0], to[1] - from[1]); return moving ? (t - t0) * 9 : 0; }
function tabletOnDresser(t, talk) { pix.root.visible = true; pix.root.position.set(3.6, .9, -2.6); pix.root.rotation.set(0, -.3, 0); pix.set({ t, mood: 'happy', talk, wave: talk }); }
function props(on) { [brushD, brushT].forEach(b => b.visible = on === 'brush'); [foamD, foamT].forEach(f => f.visible = on === 'foam'); }
function clothes(on) { clothesD.visible = clothesT.visible = on; clothesD.position.set(-3.4, .68, -1.4); clothesT.position.set(-1.7, .68, -1.4); }
function sinkKids(t, pose) {
  // both children at the sink facing the mirror; Tomiris stands on the step stool
  cast(D, T); stand(D, BX - .32, -2.02, Math.PI); stand(T, BX + .42, -2.06, Math.PI); T.root.position.y = .18;
  D.set(Object.assign({ t, talk: speaking('Дилшод') }, pose)); T.set(Object.assign({ t: t + 1.3, talk: speaking('Томирис') }, pose));
}
const STEPS = ['Почистить зубы', 'Умыться', 'Сделать зарядку', 'Вещи — по местам', 'Одеться — и завтракать'];

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 1. Вещи сбежали'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия первая: «Вещи сбежали».']],
    update(t) {
      fov(38);
      cast(); pix.root.visible = false; Object.values(MESS).forEach(([o]) => o.visible = false); props(); clothes(false); spark.visible = false;
      lights(1); scene.background = new THREE.Color('#0e3a46'); room.group.visible = false; bath.group.visible = true;
      bathLights();
      bubbles.forEach((b, i) => { b.visible = true; const a = i * 2.4; b.position.set(BX + Math.cos(a) * (1.2 + (i % 5) * .35), ((t * (.25 + (i % 4) * .08) + i * .37) % 3.4) - .3, Math.sin(a) * 1.4 - 1.6); });
      mirror.set({ t, on: 1 });
      camAt(cam, t, [[0, [BX, 1.85, 1.4], [BX, 1.8, -2.9]], [5, [BX, 1.85, -.6], [BX, 1.85, -2.9]]], .4);
    } },

  { name: 'Мама будит', dur: 14.5,
    cues: [[1.4, 4.6, 'Мама', 'Дилшод, Томирис, солнышки, просыпайтесь! Утро!'],
      [4.8, 7, 'Дети', 'Ещё пять минуточек…'],
      [7.4, 11, 'Мама', 'Вставайте, в садик пора. Я пошла готовить завтрак.']],
    update(t) {
      fov(38);
      room.group.visible = true; scene.background = new THREE.Color('#9fd4ff'); noBubbles(); props(); clothes(false); spark.visible = false;
      pix.root.visible = true; pix.root.position.set(-.5, 0, -.5); pix.root.rotation.set(-1.45, 0, 0); pix.set({ t, sleep: true, smudge: 1 });
      cast(D, T, M); messAt(); blankets(true);
      lie(D, BED[0], t, 'Дилшод'); lie(T, BED[1], t + 1.3, 'Томирис');
      const k = ease(seg(t, .6, 1.8)); curtains(k); lights(k); doorOpen(t < 12.2 ? seg(t, 0, .5) : 1 - seg(t, 13.6, 14.4));
      M.body.rotation.set(0, 0, 0); let w = 0;
      if (t < .6) { M.root.position.set(1.6, 0, -2.1); M.root.rotation.y = Math.PI; }
      else if (t < 2.2) { M.root.position.set(1.6, 0, -2.1); M.root.rotation.y = Math.PI; }
      else if (t < 11.2) { w = walkTo(M, [1.6, -2.1], [-.4, -.6], 2.2, 3.4, t); if (t >= 3.4) M.root.rotation.y = -1.1; }
      else w = walkTo(M, [-.4, -.6], [4.1, -2.4], 11.2, 14, t);
      const up = t < 1.8;
      M.set({ t, walk: w, talk: speaking('Мама'), armL: up ? 2.6 : (t > 3.4 && t < 11.2 ? .9 : .1), armR: up ? 2.6 : .1, armLx: up ? .3 : null, armRx: up ? .3 : null, mood: 'happy' });
      if (t < 1.4) camAt(cam, t, [[0, [4.6, 2.4, 3.8], [1, 1.1, -1.6]], [1.4, [3.8, 2.2, 3], [1.4, 1.4, -2]]]);
      else if (t < 4.8) camAt(cam, t - 1.4, [[0, [.9, 1.75, .9], [-.4, 1.55, -.6]], [3.4, [.7, 1.7, .6], [-.4, 1.6, -.6]]]);
      else if (t < 7.4) camAt(cam, t - 4.8, [[0, [-2.5, 2.3, -.3], [-2.5, .7, -2.6]], [2.6, [-2.5, 2.1, -.7], [-2.5, .7, -2.5]]]);
      else camAt(cam, t - 7.4, [[0, [2.8, 2.1, 3.2], [-.2, 1.1, -1]], [7, [3.6, 2.2, 3.8], [1.5, 1.2, -1.8]]]);
    } },

  { name: 'Планшет ругается', dur: 14,
    cues: [[2.6, 6.6, 'Пиксель', 'Фу-у! Руки липкие, экран в пятнах! Ты даже не умылся!'],
      [7, 11, 'Пиксель', 'И посмотри вокруг! Как будто ураган прошёл!'],
      [11.3, 14, 'Дилшод', 'Ну и что? Мне и так нормально.']],
    sfx: [[2.4, 'error']],
    update(t) {
      fov(38);
      room.group.visible = true; noBubbles(); curtains(1); lights(1); doorOpen(0); blankets(false); messAt(); props(); clothes(false);
      cast(D, T);
      const k = ease(seg(t, 0, 1.1));
      [[D, BED[0], [-1.2, .2]], [T, BED[1], [.2, .5]]].forEach(([P, bx, to], i) => {
        P.root.position.set(lerp(bx, to[0], k), lerp(.66, 0, k) + Math.sin(Math.PI * k) * .6, lerp(-1.54, to[1], k));
        P.body.rotation.set(lerp(-Math.PI / 2, 0, k), 0, 0); P.root.rotation.y = lerp(0, i ? -.3 : .4, k);
      });
      const dReach = t > 1.4 && t < 2.6;
      if (t >= 1.1) { const dk = seg(t, 1.4, 2); D.root.position.set(lerp(-1.2, -.95, dk), 0, lerp(.2, -.05, dk)); D.root.rotation.y = t > 7 && t < 11 ? Math.sin(t) * .6 : .4; }
      const look = t >= 7 && t < 11 ? [Math.sin(t * 1.4), .2] : [0, -.4];
      D.set({ t, talk: speaking('Дилшод'), walk: t > 1.4 && t < 2 ? t * 9 : 0, mood: t < 2.6 ? 'happy' : t < 11 ? 'wow' : 'happy', armL: k < 1 ? 2.6 : .15, armR: k < 1 ? 2.6 : (dReach ? 1.2 : .15), armRx: dReach ? 1 : null, look });
      T.set({ t: t + 1.3, mood: t > 7 && t < 11 ? 'wow' : 'happy', armL: k < 1 ? 2.6 : .12, armR: k < 1 ? 2.6 : .12, look });
      const st = ease(seg(t, 2, 2.6));
      pix.root.visible = true; pix.root.position.set(-.5, 0, -.5); pix.root.rotation.set(lerp(-1.45, 0, st), .3, 0);
      pix.set({ t, sleep: t < 2.4, error: t >= 2.4 && t < 7, smudge: 1, mood: 'angry', talk: speaking('Пиксель'), wave: t > 2.6 });
      if (t < 2.6) camAt(cam, t, [[0, [1.5, 2.2, 3.2], [-1.4, .8, -1]], [2.6, [.8, 1.6, 2.2], [-.8, .7, -.4]]]);
      else if (t < 7) camAt(cam, t - 2.6, [[0, [.25, .62, .5], [-.5, .45, -.5]], [4.4, [.12, .56, .28], [-.5, .45, -.5]]]);
      else if (t < 11) camAt(cam, t - 7, [[0, [2.6, 1.6, 2.6], [.5, .3, .6]], [4, [-1.6, 1.7, 2.8], [.3, .4, .4]]]);
      else camAt(cam, t - 11, [[0, [-.4, 1.15, 1.1], [-.7, 1, -.1]], [3, [-.5, 1.12, .95], [-.7, 1, -.1]]]);
    } },

  { name: 'Вещи сбегают', dur: 13,
    cues: [[0, 2.4, 'Пиксель', 'Всё, я ухожу!'],
      [2.6, 6.2, 'Вещи', 'И мы! И мы! Нам тут неуютно!'],
      [7, 10.4, 'Дилшод', 'Стойте! Вернитесь!'],
      [10.6, 13, 'Томирис', 'Ой! И машинки убежали!']],
    sfx: [[1, 'boing'], [2.8, 'boing'], [4.6, 'boing']],
    update(t) {
      fov(38);
      room.group.visible = true; noBubbles(); curtains(1); lights(1); blankets(false); props(); clothes(false);
      doorOpen(t < 10.4 ? seg(t, .2, 1) : 1 - seg(t, 11, 12)); cast(D, T);
      stand(D, -.95, -.05, .9); stand(T, .2, .5, .9);
      const shout = t >= 7;
      D.set({ t, talk: speaking('Дилшод'), mood: shout ? 'sad' : 'wow', armL: shout ? 2.4 + Math.sin(t * 8) * .2 : .2, armR: shout ? 2.4 - Math.sin(t * 8) * .2 : .2, look: [1, 0] });
      T.set({ t: t + 1.3, talk: speaking('Томирис'), mood: t > 10.6 ? 'sad' : 'wow', look: [1, 0], armL: t > 10.6 ? 1.4 : .1 });
      const DOOR = [4.1, -2.3];
      Object.keys(MESS).forEach((key, i) => {
        const [o, p] = MESS[key];
        if (key === 'sock2' && t < 2.6) { o.position.set(...p); o.visible = true; return; }
        const from = key === 'sock2' ? [.3, 0, -.5] : p, k = seg(t, 1.2 + i * .55, 3.8 + i * .55);
        const hop = Math.abs(Math.sin(k * Math.PI * 5)) * .18 * (k > 0 && k < 1);
        o.position.set(lerp(from[0], DOOR[0], k), hop, lerp(from[2], DOOR[1], k)); o.rotation.set(0, Math.atan2(DOOR[0] - from[0], DOOR[1] - from[2]), 0); o.visible = k < 1;
      });
      const pk = seg(t, .4, 3.2); pix.root.visible = pk < 1; pix.root.rotation.set(0, Math.atan2(DOOR[0] + .5, DOOR[1] + .5), 0);
      pix.root.position.set(lerp(-.5, DOOR[0], pk), 0, lerp(-.5, DOOR[1], pk)); pix.set({ t, smudge: 1, mood: 'angry', talk: speaking('Пиксель'), walk: pk > 0 && pk < 1 ? t * 14 : 0 });
      if (t < 7) camAt(cam, t, [[0, [.6, .45, 1.6], [1.6, .2, -.6]], [7, [2.6, .5, .6], [4, .4, -2.2]]], .6);
      else if (t < 10.6) camAt(cam, t - 7, [[0, [1.6, 1.2, 1.7], [-.4, 1, 0]], [3.6, [1.3, 1.15, 1.4], [-.4, 1, .1]]]);
      else camAt(cam, t - 10.6, [[0, [.9, .95, 1.6], [.2, .85, .5]], [2.4, [.8, .9, 1.4], [.2, .85, .5]]]);
    } },

  { name: 'Чистон в зеркале', dur: 16,
    cues: [[2.5, 6, 'Чистон', 'Доброе утро, Дилшод и Томирис! Хотите вернуть вещи?'],
      [6.2, 8, 'Дети', 'Очень хотим!'],
      [8.2, 11.4, 'Чистон', 'Тогда вот план утреннего героя. Пять шагов!'],
      [11.6, 16, 'Чистон', 'Зубы, умыться, зарядка, вещи по местам — и одеться!']],
    sfx: [[2, 'power']],
    overlay(cx, t) { if (t >= 11.4) checklist(cx, 'План утреннего героя', STEPS, Math.min(5, Math.floor(seg(t, 11.6, 15.2) * 5) + 1), 0, 820, 90); },
    update(t) {
      fov(38);
      room.group.visible = false; bath.group.visible = true; scene.background = new THREE.Color('#dff3f0'); noBubbles(); bathLights(); props(); clothes(false); pix.root.visible = false; Object.values(MESS).forEach(([o]) => o.visible = false); spark.visible = false;
      cast(D, T);
      const k = ease(seg(t, 0, 2));
      stand(D, BX + lerp(-3, -.6, k), lerp(.6, -1.2, k), Math.PI * .85); stand(T, BX + lerp(-2.4, .3, k), lerp(.9, -1.0, k), Math.PI * 1.1);
      D.set({ t, walk: k < 1 ? t * 9 : 0, talk: speaking('Дилшод'), mood: t < 2.5 ? 'sad' : 'wow', nod: -.15 });
      T.set({ t: t + 1.3, walk: k < 1 ? t * 9 : 0, mood: t < 2.5 ? 'sad' : 'wow', nod: -.15 });
      mirror.set({ t, on: seg(t, 2, 3), talk: speaking('Чистон') });
      if (t < 2.5) camAt(cam, t, [[0, [BX + 2.8, 1.6, 2.2], [BX, 1.2, -1.6]], [2.5, [BX + 2, 1.6, 1.4], [BX, 1.4, -2.2]]]);
      else if (t < 8.2) camAt(cam, t - 2.5, [[0, [BX + .2, 1.5, -.2], [BX, 1.8, -2.9]], [5.7, [BX + .1, 1.6, -.8], [BX, 1.85, -2.9]]]);
      else if (t < 11.4) { fov(60); camAt(cam, t - 8.2, [[0, [BX, 1.42, -2.86], [BX, 1.0, -1.1]], [3.2, [BX, 1.4, -2.88], [BX, 1.0, -1.1]]]); }
      else camAt(cam, t - 11.4, [[0, [BX + 1.0, 1.8, -.7], [BX + 1.0, 1.75, -2.9]], [4.6, [BX + 1.0, 1.8, -1.0], [BX + 1.0, 1.75, -2.9]]], .4);
    } },

  { name: 'Шаг 1 · Зубы', dur: 16,
    cues: [[2, 6, 'Песня', 'Щёткой вверх и щёткой вниз —'],
      [6, 10, 'Песня', 'каждый зубик, улыбнись!'],
      [10, 14, 'Песня', 'Справа, слева и внутри — две минуты, посмотри!'],
      [14, 16, 'Чистон', 'Шаг первый — готово!']],
    sfx: [[14, 'ding']],
    overlay(cx, t) { const rem = t < 2 ? 120 : Math.max(0, 120 - (t - 2) * 10); timerRing(cx, 1130, 230, 70, rem / 120, t >= 14 ? '✓' : `${Math.floor(rem / 60)}:${String(Math.ceil(rem) % 60).padStart(2, '0')}`, 'ускорено ×10'); banner(cx, 'Шаг 1 из 5 · Зубы'); },
    update(t) {
      fov(38);
      bath.group.visible = true; room.group.visible = false; bathLights(); props('brush'); bath.water.visible = false;
      const br = t >= 2 && t < 14, sc = Math.sin(t * 18) * .25;
      sinkKids(t, br ? { armRx: 1.75 + sc * .4, elbowR: 2.1, armR: .35, mood: 'happy' } : { armR: .2, mood: 'happy' });
      mirror.set({ t, on: 1, talk: speaking('Чистон') });
      if (t < 6) { fov(64); camAt(cam, t, [[0, [BX + .05, 1.36, -2.86], [BX + .05, .98, -1.95]], [6, [BX + .05, 1.34, -2.88], [BX + .05, .98, -1.95]]], .5); }
      else if (t < 11) camAt(cam, t - 6, [[0, [BX + 1.8, 1.5, -.6], [BX, 1.2, -2.3]], [5, [BX - 1.6, 1.5, -.5], [BX, 1.2, -2.3]]]);
      else { fov(56); camAt(cam, t - 11, [[0, [BX + .3, 1.34, -2.86], [BX + .35, 1.0, -2.0]], [5, [BX + .32, 1.32, -2.88], [BX + .35, 1.0, -2.0]]], .4); }
    } },

  { name: 'Шаг 2 · Умыться', dur: 12,
    cues: [[0, 3.6, 'Чистон', 'Теперь умываемся: лицо — водой, руки — с мылом.'],
      [4.2, 7, 'Дилшод', 'Бр-р, холодная! Зато бодрит!'],
      [9.6, 12, 'Чистон', 'Шаг второй — готово!']],
    sfx: [[9.6, 'ding']],
    overlay(cx) { banner(cx, 'Шаг 2 из 5 · Умыться'); },
    update(t) {
      fov(38);
      bath.group.visible = true; room.group.visible = false; bathLights();
      const face = t >= 3.6 && t < 7, hands = t >= 7 && t < 9.6, sc = Math.sin(t * 14) * .12;
      props(hands ? 'foam' : null); bath.water.visible = face || hands;
      [foamD, foamT].forEach(f => f.userData.update(t, seg(t, 7, 7.6) * (1 - seg(t, 9, 9.6))));
      const pose = face ? { armLx: 1.55 + sc, armRx: 1.55 - sc, elbowL: 2.2, elbowR: 2.2, armL: .25, armR: .25, mood: 'happy', sleep: true }
        : hands ? { armLx: .9 + sc, armRx: .9 - sc, elbowL: .9, elbowR: .9, armL: .3, armR: .3, mood: 'happy', nod: .3 } : { mood: 'happy' };
      sinkKids(t, pose);
      mirror.set({ t, on: 1, talk: speaking('Чистон') });
      if (t < 3.6) camAt(cam, t, [[0, [BX + 2.2, 1.7, .4], [BX, 1.6, -2.7]], [3.6, [BX + 1.6, 1.6, -.2], [BX, 1.5, -2.6]]]);
      else if (t < 7) { fov(60); camAt(cam, t - 3.6, [[0, [BX - .1, 1.36, -2.87], [BX - .2, 1.0, -2.0]], [3.4, [BX - .1, 1.34, -2.88], [BX - .2, 1.0, -2.0]]], .4); }
      else camAt(cam, t - 7, [[0, [BX + 1.5, 1.65, -.7], [BX, .95, -2.4]], [5, [BX + 1.2, 1.6, -.9], [BX, .95, -2.4]]]);
    } },

  { name: 'Шаг 3 · Зарядка', dur: 18,
    cues: [[0, 3, 'Чистон', 'Шаг третий — зарядка! Повторяй за мной!'],
      [3, 6, 'Чистон', 'Потянулись к солнцу — раз!'],
      [6, 9.5, 'Чистон', 'Наклон вправо, наклон влево — два!'],
      [9.5, 12.5, 'Чистон', 'Приседаем — три!'],
      [12.5, 15.5, 'Чистон', 'Прыгаем, как зайчик, — четыре!'],
      [15.7, 18, 'Дети', 'Ух! Вот теперь мы проснулись!']],
    overlay(cx) { banner(cx, 'Шаг 3 из 5 · Зарядка'); },
    update(t) {
      fov(38);
      room.group.visible = true; bath.group.visible = false; scene.background = new THREE.Color('#9fd4ff'); curtains(1); lights(1); doorOpen(t > 7 ? .25 : 0); blankets(false); props(); clothes(false);
      Object.entries(MESS).forEach(([k, [o]]) => o.visible = false);
      cast(D, T); stand(D, -.5, .3, .15); stand(T, .5, .4, -.15);
      let o = { armL: .2, armR: .2, lean: 0, crouch: 0, jump: 0 };
      if (t >= 3 && t < 6) { o.armL = o.armR = 2.95; o.jump = Math.abs(Math.sin((t - 3) * 3)) * .04; }
      else if (t >= 6 && t < 9.5) { o.lean = Math.sin((t - 6) * 2.6) * .3; o.armL = o.armR = 2.7; }
      else if (t >= 9.5 && t < 12.5) { o.crouch = (1 - Math.cos((t - 9.5) * Math.PI * 1.4)) / 2 * .55; o.armLx = o.armRx = 1.5; o.elbowL = o.elbowR = .1; }
      else if (t >= 12.5 && t < 15.5) { o.jump = Math.abs(Math.sin((t - 12.5) * Math.PI * 1.6)) * .3; o.armL = o.armR = 2.3; }
      D.set(Object.assign({ t, talk: speaking('Дилшод'), mood: 'happy' }, o)); T.set(Object.assign({ t: t + 1.3, talk: speaking('Томирис'), mood: 'happy' }, o));
      pix.root.visible = t > 7.5; pix.root.position.set(4.25, 0, -2.1); pix.root.rotation.set(0, -.9, 0); pix.set({ t, mood: 'happy', smudge: 1 });
      camAt(cam, t, [[0, [0, 1.2, 3.6], [0, .8, .3]], [6, [-2.2, 1.4, 2.8], [0, .8, .3]], [12, [2.4, .7, 2.2], [0, .7, .3]], [18, [0, 1.3, 2.6], [0, .8, .3]]]);
    } },

  { name: 'Шаг 4 · Порядок', dur: 18,
    cues: [[.4, 3.8, 'Пиксель', 'Ладно, мы вернёмся… если наведёшь порядок!'],
      [4.2, 6, 'Дилшод', 'Носки — в ящик!'],
      [6.1, 7.9, 'Томирис', 'А машинки — в коробку!'],
      [8.2, 11.6, 'Дилшод', 'Кроссовки — к двери, планшет — на зарядку!'],
      [12, 15.4, 'Пиксель', 'Вот теперь другое дело! Здесь я остаюсь!'],
      [15.6, 18, 'Вещи', 'Ура! Мы дома!']],
    sfx: [[13.5, 'ding']],
    overlay(cx) { banner(cx, 'Шаг 4 из 5 · Порядок'); },
    update(t) {
      fov(38);
      room.group.visible = true; bath.group.visible = false; curtains(1); lights(1); doorOpen(t < 12 ? seg(t, 0, .6) : 1 - seg(t, 12, 13)); blankets(false); props(); clothes(t > 12);
      cast(D, T); stand(D, -.3, .3, .5); stand(T, .6, .5, .3);
      const SLOT = { sock1: 4.4, sock2: 5, car1: 6.1, car2: 6.8, sneakA: 8.4, sneakB: 9, back: 9.8 };
      const STAGE = { sneakA: [2.6, 0, -.6], sneakB: [2.9, 0, -.4], sock1: [2.2, 0, -.2], sock2: [2.4, 0, .1], car1: [2.0, 0, .4], car2: [2.3, 0, .6], back: [3.1, 0, .1] };
      Object.entries(MESS).forEach(([key, [o, , , pl]], i) => {
        const ent = seg(t, .3 + i * .3, 1.8 + i * .3), pk = seg(t, SLOT[key], SLOT[key] + .9);
        if (ent <= 0) { o.visible = false; return; }
        const door = [4.1, 0, -2.3], st = STAGE[key];
        let p = pk > 0 ? [lerp(st[0], pl[0], pk), lerp(st[1], pl[1], pk) + Math.sin(Math.PI * pk) * .9, lerp(st[2], pl[2], pk)] : [lerp(door[0], st[0], ent), Math.abs(Math.sin(ent * Math.PI * 4)) * .15 * (ent < 1), lerp(door[2], st[2], ent)];
        o.position.set(...p); o.rotation.set(0, pk > 0 ? 0 : -2.4, 0); o.visible = !(HIDE_AT_PLACE[key] && pk >= 1);
      });
      const pk = seg(t, 10.6, 11.6);
      if (pk >= 1) tabletOnDresser(t, speaking('Пиксель'));
      else { pix.root.visible = true; const st = [2.7, 0, .3]; pix.root.position.set(lerp(st[0], 3.6, pk), lerp(0, .9, pk) + Math.sin(Math.PI * pk) * .7, lerp(st[2], -2.6, pk)); pix.root.rotation.set(0, -.6, 0); pix.set({ t, mood: 'happy', talk: speaking('Пиксель'), smudge: 0 }); }
      const point = t > 4.2 && t < 11.6;
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armR: point ? 1.3 : .2, armRx: point ? .6 : null, turn: point ? .4 : 0 });
      T.set({ t: t + 1.3, talk: speaking('Томирис'), mood: 'happy', armL: t > 6.1 && t < 7.9 ? 1.3 : (t > 15.6 ? 2.6 : .2), armR: t > 15.6 ? 2.6 : .2 });
      if (t < 4.2) camAt(cam, t, [[0, [1.2, 1.3, 2.8], [3, .6, -.5]], [4.2, [1.8, 1.2, 2.2], [3.2, .6, -.6]]]);
      else if (t < 12) camAt(cam, t - 4.2, [[0, [-1.6, 1.8, 3.2], [1.4, .8, -1.2]], [7.8, [-.4, 1.9, 3.4], [2.4, .9, -1.6]]]);
      else camAt(cam, t - 12, [[0, [2.6, 1.4, -.8], [3.6, 1.1, -2.6]], [6, [2.2, 1.35, -1.1], [3.6, 1.1, -2.6]]]);
    } },

  { name: 'Шаг 5 · Одеться', dur: 16,
    cues: [[6, 8.4, 'Мама', 'Дети, завтрак готов!'],
      [8.6, 11, 'Дети', 'Идём, мама! Мы уже готовы!'],
      [11.8, 16, 'Мама', 'Сами? И порядок навели? Вот это да!']],
    sfx: [[4.5, 'pop'], [12, 'fanfare']],
    overlay(cx) { banner(cx, 'Шаг 5 из 5 · Одеться'); },
    update(t) {
      fov(38);
      room.group.visible = true; bath.group.visible = false; curtains(1); lights(1); doorOpen(seg(t, 10.6, 11.4)); blankets(false); props();
      placed(); tabletOnDresser(t, false);
      const dressed = t >= 4.5;
      const kd = seg(t, 1, 3), kt = seg(t, 2, 4);
      clothesD.visible = kd < 1; clothesT.visible = kt < 1;
      clothesD.position.set(lerp(-3.4, -.3, kd), lerp(.68, 1.0, kd) + Math.sin(Math.PI * kd) * .8, lerp(-1.4, .3, kd)); clothesD.rotation.y = kd * 6;
      clothesT.position.set(lerp(-1.7, .6, kt), lerp(.68, .9, kt) + Math.sin(Math.PI * kt) * .8, lerp(-1.4, .5, kt)); clothesT.rotation.y = kt * 6;
      spark.visible = t >= 4.5 && t < 5.5; spark.position.set(.15, 0, .4); spark.userData.update(seg(t, 4.5, 5.5));
      const A = dressed ? Dd : D, B = dressed ? Td : T;
      cast(A, B, ...(t >= 10.6 ? [M] : []));
      stand(A, -.3, .3, .2); stand(B, .6, .5, -.2);
      A.set({ t, talk: speaking('Дилшод'), mood: t > 11.8 && t < 13 ? 'wow' : 'happy', armL: t < 4.5 ? 1.5 : .2, armR: t < 4.5 ? 1.5 : (t > 8.6 && t < 11 ? 2.5 : .2) });
      B.set({ t: t + 1.3, talk: speaking('Томирис'), mood: 'happy', armL: t < 4.5 ? 1.5 : (t > 8.6 && t < 11 ? 2.5 : .2), armR: t < 4.5 ? 1.5 : .2 });
      if (t >= 10.6) { const w = walkTo(M, [4.1, -2.4], [2.4, -.9], 10.6, 11.8, t); if (t >= 11.8) M.root.rotation.y = -1.1; M.set({ t, walk: w, talk: speaking('Мама'), mood: t < 12.6 ? 'wow' : 'happy', armL: t > 12 ? 2.5 : .15, armR: t > 12 ? 2.5 : .15 }); }
      if (t < 6) camAt(cam, t, [[0, [-2.2, 1.5, 2.8], [-1, .8, -.4]], [6, [0, 1.3, 2.6], [.15, .85, .4]]]);
      else if (t < 11.8) camAt(cam, t - 6, [[0, [.15, 1.0, 2.0], [.15, .9, .4]], [5.8, [.15, 1.05, 1.8], [.15, .9, .4]]]);
      else camAt(cam, t - 11.8, [[0, [-1.2, 1.6, 2.6], [1.4, 1.1, -.6]], [4.2, [-1.6, 1.7, 3.2], [1.2, 1.1, -.6]]]);
    } },

  { name: 'Конец', dur: 6, title: ['Конец', 'первой серии'],
    cues: [[.8, 5.2, 'Рассказчик', 'Конец первой серии. А дальше — завтрак!']],
    update(t) {
      fov(38);
      cast(); pix.root.visible = false; Object.values(MESS).forEach(([o]) => o.visible = false); props(); clothes(false); spark.visible = false;
      room.group.visible = false; bath.group.visible = true; scene.background = new THREE.Color('#0e3a46'); bathLights();
      bubbles.forEach((b, i) => { b.visible = true; const a = i * 2.4; b.position.set(BX + Math.cos(a) * (1.2 + (i % 5) * .35), ((t * (.25 + (i % 4) * .08) + i * .37) % 3.4) - .3, Math.sin(a) * 1.4 - 1.6); });
      mirror.set({ t, on: 1 });
      camAt(cam, t, [[0, [BX, 1.85, -.4], [BX, 1.85, -2.9]], [6, [BX, 1.85, 1.2], [BX, 1.8, -2.9]]], .4);
    } }
];

startEpisode(SCENES, { scene, cam, renderer, gl, warpUrl: './warp3d_1.json' });
