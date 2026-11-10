// Episode 7 in 3D: «Спокойной ночи». Ends with Surah Ya-Sin, ayat 1–4, with the music muted.
import * as THREE from 'three';
import { seg, ease, lerp, rbox, at, makeChiston } from './world.js';
import { startEpisode, speaking } from './eng3d.js';
import { makeKit } from './kit.js';
import { duck, drawToonFace, chair } from './sets2.js';
import { toothbrush, foam } from './sets.js';

const K = makeKit(['living', 'bathroom', 'tub', 'bedroom', 'pajama']);
const { D, T, M, P, Dp, Tp, scene } = K, L = K.living, B = K.bedroom;
const YASIN = '/home/user/intranet/cartoon/series/audio/yasin-1-4.mp3';
const brushes = [K.hold(Dp, toothbrush('#4cc3ff')), K.hold(Tp, toothbrush('#ff7aa2'))]; brushes.forEach(b => b.rotation.x = -1.4);
const dk = duck(); dk.position.set(-3.0, .58, -2.3); K.bathroom.group.add(dk);
const book = K.hold(P, rbox(.22, .03, .3, '#ff7a59', .01)); book.rotation.set(-1.2, 0, 0); book.position.set(-.05, -.04, .08);
const papaChair = chair(); papaChair.position.set(-2.55, 0, -.6); papaChair.rotation.y = Math.PI; B.group.add(papaChair);
const wallMirror = makeChiston(); wallMirror.root.position.set(-.4, 1.75, -2.94); wallMirror.root.scale.setScalar(.5); B.group.add(wallMirror.root);
B.curtL.position.x = .55; B.curtL.scale.x = .45; B.curtR.position.x = 2.65; B.curtR.scale.x = .45;
const bubbles = []; for (let i = 0; i < 18; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.04 + (i % 4) * .025, 16, 12), new THREE.MeshStandardMaterial({ color: '#dff6ff', transparent: true, opacity: .45, roughness: .05, metalness: .2 })); scene.add(b); bubbles.push(b); }

function cartoon(g, w, h, t) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff9fd0'); gr.addColorStop(1, '#7f8cff'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { g.fillStyle = ['#ffd23f', '#5dff9a', '#4cc3ff'][i % 3]; g.beginPath(); g.arc((i * 120 + t * 160) % w, h / 2 + Math.sin(t * 5 + i) * 90, 30, 0, 7); g.fill(); } }
function props(o = {}) { brushes.forEach(b => b.visible = !!o.brush); book.visible = !!o.book; bubbles.forEach(b => b.visible = !!o.bubbles); dk.visible = !!o.duck; }
function bedtime(t, o = {}) {
  K.env('bedroom', 'night'); K.lampAt(-2.55, 1.6, -.9, o.lamp ?? 3.5); B.door.rotation.y = -(o.door ?? 0) * 1.4;
  B.beds.forEach(b => { b.userData.blanket.scale.y = 2.2; b.userData.blanket.position.y = .7; });
  [[Dp, -3.4], [Tp, -1.7]].forEach(([X, bx], i) => { X.root.position.set(bx, .66, -1.54); X.root.rotation.set(0, 0, 0); X.body.rotation.set(-Math.PI / 2, 0, 0); X.set({ t: t + i * 1.3, sleep: o.sleep || (o.sleepT != null && t > o.sleepT + i), talk: speaking(X === Dp ? 'Дилшод' : 'Томирис'), turn: o.look ? (i ? -.5 : .5) : 0, mood: 'happy' }); });
}

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 7. Спокойной ночи'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия седьмая: «Спокойной ночи».']],
    update(t) { bedtime(t, { sleep: true, lamp: 1.5 }); K.cast(); props(); wallMirror.set({ t, on: 0 }); K.fov(40); K.cam(t, [[0, [1.6, 1.8, -1.0], [1.6, 1.75, -2.98]], [5, [0, 1.6, 1.4], [-1.6, .8, -1.8]]], .4); } },

  { name: 'Вечер', dur: 15,
    cues: [[1, 4.2, 'Мама', 'Дети, уже вечер. Пора готовиться ко сну!'],
      [4.6, 6.6, 'Дети', 'Ещё чуть-чуть!'],
      [7.4, 15, 'Чистон', 'Перед сном экраны выключаем. От яркого экрана сон убегает, и утром трудно проснуться.']],
    sfx: [[7, 'power']],
    update(t) {
      K.env('living', 'evening2'); L.lamp.intensity = 2.5; K.cast(D, T, M); props(); K.fov(40);
      L.tv.set(t < 7 ? (g, w, h) => cartoon(g, w, h, t) : (g, w, h) => drawToonFace(g, w, h, { t, talk: speaking('Чистон') }));
      K.sit(D, { x: -.55, z: 1.3, ry: Math.PI, y: .55 }); K.sit(T, { x: .55, z: 1.3, ry: Math.PI, y: .55 });
      D.set({ t, sit: true, talk: speaking('Дилшод'), mood: t > 7 ? 'wow' : 'bored', swingLegs: 1, turn: t > 4.6 && t < 6.6 ? -.6 : 0 }); T.set({ t, sit: true, talk: speaking('Томирис'), mood: t > 7 ? 'wow' : 'bored', swingLegs: 1, turn: t > 4.6 && t < 6.6 ? -.6 : 0 });
      const wM = K.walk(M, [5.6, 2.6], [2.2, 1.4], 0, 1.6, t, -Math.PI / 2); M.set({ t, walk: wM, talk: speaking('Мама'), mood: 'happy', armL: t > 1.6 && t < 4.2 ? 1.0 : .12 });
      L.door.rotation.y = -Math.PI / 2 + seg(t, 0, .5) * 1.4;
      if (t < 4.6) K.cam(t, [[0, [-1.6, 1.5, -1.6], [1.4, 1.1, 1.4]]]); else if (t < 7.4) K.cam(t, [[4.6, [0, 1.25, -1.8], [0, .9, 1.3]]]); else K.cam(t, [[7.4, [.9, 1.5, 3.6], [0, 1.3, -2.9]], [15, [.3, 1.45, 2.0], [0, 1.4, -2.9]]]);
    } },

  { name: 'Купание', dur: 14,
    cues: [[.5, 3, 'Чистон', 'А теперь — купаться!'],
      [3.5, 8, 'Песня', 'Буль-буль, пузыри — чистые щёчки, посмотри!'],
      [8.6, 10.6, 'Томирис', 'Уточка плывёт!'],
      [11, 14, 'Дилшод', 'А у меня пузырь — как шарик!']],
    update(t) {
      K.env('bathroom'); K.cast(D, T); props({ bubbles: true, duck: true }); K.bathroom.mirror.set({ t, on: 1, talk: speaking('Чистон') }); K.fov(42);
      K.sit(D, { x: -3.7, z: -2.4, ry: Math.PI / 2, y: .27 }); K.sit(T, { x: -2.7, z: -2.4, ry: -Math.PI / 2, y: .3 });
      D.set({ t, sit: true, talk: speaking('Дилшод'), mood: t > 11 ? 'wow' : 'happy', armLx: t > 11 ? 1.3 : .6, armRx: t > 11 ? 1.3 : .6, elbowL: .5, elbowR: .5 });
      T.set({ t, sit: true, talk: speaking('Томирис'), mood: 'happy', armLx: .9 + Math.sin(t * 4) * .3, elbowL: .5, look: [.3, -.5], nod: .2 });
      dk.position.set(-3.2 + Math.sin(t * .8) * .45, .6 + Math.sin(t * 3) * .01, -2.3 + Math.cos(t * .8) * .2); dk.rotation.y = -t * .8;
      bubbles.forEach((b, i) => { const a = i * 2.3; b.position.set(-3.2 + Math.cos(a) * .7, .7 + ((t * (.2 + (i % 4) * .05) + i * .23) % 1.6), -2.3 + Math.sin(a) * .35); });
      if (t < 3.5) K.cam(t, [[0, [-1.2, 1.7, .4], [0, 1.6, -2.9]], [3.5, [-1.6, 1.6, .2], [-3.2, .8, -2.4]]]); else if (t < 11) K.cam(t, [[3.5, [-2.3, 1.3, -.6], [-3.1, .8, -2.4]], [11, [-2.0, 1.25, -.9], [-2.8, .8, -2.4]]]); else K.cam(t, [[11, [-2.8, 1.2, -1.1], [-3.7, .9, -2.4]]]);
    } },

  { name: 'Пижамы и зубки', dur: 12,
    cues: [[1, 5, 'Песня', 'Щёткой вверх и щёткой вниз — каждый зубик, улыбнись!'],
      [6, 11.6, 'Чистон', 'Чистые зубки на ночь — и сон будет сладким!']],
    sfx: [[5.6, 'ding']],
    update(t) {
      K.env('bathroom'); K.cast(Dp, Tp); props({ brush: t < 5.6 }); K.bathroom.mirror.set({ t, on: 1, talk: speaking('Чистон') });
      K.place(Dp, -.32, -2.02, Math.PI); K.place(Tp, .42, -2.06, Math.PI, .18);
      const pose = t < 5.6 ? { armRx: 1.5, elbowR: 1.9 + Math.sin(t * 16) * .15, armR: .3 } : { mood: 'happy' };
      Dp.set(Object.assign({ t, mood: 'happy' }, pose)); Tp.set(Object.assign({ t: t + 1.3, mood: 'happy' }, pose));
      if (t < 6) { K.fov(62); K.cam(t, [[0, [.05, 1.4, -2.86], [.05, 1.0, -1.95]]]); } else { K.fov(40); K.cam(t, [[6, [1.6, 1.6, 1.2], [0, 1.5, -2.6]], [12, [1.0, 1.7, .2], [0, 1.6, -2.8]]]); }
    } },

  { name: 'Сказка на ночь', dur: 22,
    cues: [[1, 6, 'Папа', 'Жили-были кошка, кот и маленький котёнок…'],
      [6.5, 11, 'Папа', 'Котёнок умылся, почистил зубки — и сладко уснул.'],
      [11.5, 13.5, 'Томирис', 'Как я…'],
      [14, 16, 'Дилшод', 'Спокойной ночи, папа…'],
      [16.5, 20.5, 'Мама', 'Спокойной ночи, мои хорошие!']],
    update(t) {
      bedtime(t, { look: t < 16, sleepT: 18.5, door: 1 }); K.cast(Dp, Tp, P, M); props({ book: t < 14 }); wallMirror.set({ t, on: 0 }); K.fov(40);
      K.sit(P, { x: -2.55, z: -.6, ry: Math.PI, y: papaChair.userData.seat }); P.root.rotation.y = Math.PI;
      P.set({ t, sit: true, talk: speaking('Папа'), mood: 'happy', armRx: t < 14 ? 1.1 : .2, elbowR: t < 14 ? 1.2 : .3, armLx: t < 14 ? 1.0 : .2, elbowL: 1.1, nod: t < 14 ? .25 : 0 });
      K.place(M, 3.9, -1.8, -Math.PI / 2 - .3); M.set({ t, talk: speaking('Мама'), mood: 'happy', armL: t > 16.5 && t < 20.5 ? 1.2 : .12 });
      if (t < 11.5) K.cam(t, [[0, [-4.3, 1.55, .1], [-2.6, .95, -1.1]], [11.5, [-4.0, 1.5, -.2], [-2.6, .9, -1.2]]]);
      else if (t < 16.5) K.cam(t, [[11.5, [-2.55, 1.6, .2], [-2.55, .7, -1.6]], [16.5, [-2.55, 1.4, -.3], [-2.55, .7, -1.6]]]);
      else K.cam(t, [[16.5, [-1.8, 1.6, .9], [3.5, 1.4, -1.8]], [22, [-.2, 2.2, 1.6], [-2.5, .6, -1.8]]]);
    } },

  { name: 'Звёздочка', dur: 13,
    cues: [[.5, 5.6, 'Чистон', 'Сегодня вы сами выключили экраны и легли вовремя.'],
      [6, 13, 'Чистон', 'За это — ещё одна звёздочка! Спокойной ночи, утренние герои!']],
    sfx: [[7.4, 'ding']],
    update(t) { bedtime(t, { sleep: true, lamp: 1.2 }); K.cast(Dp, Tp); props(); wallMirror.set({ t, on: 1, talk: speaking('Чистон') }); K.fov(40); if (t < 6) K.cam(t, [[0, [-.4, 1.65, -1.6], [-.4, 1.75, -2.94]]]); else K.cam(t, [[6, [0, 1.8, .2], [-2, .8, -1.8]], [13, [.6, 2.0, .8], [-2, .8, -1.8]]]); },
    overlay(cx, t) { if (t > 7.4) { const k = Math.min(1, seg(t, 7.4, 8)); cx.save(); cx.translate(640, 300); cx.scale(k, k); cx.fillStyle = '#ffc61a'; cx.shadowColor = '#ffe066'; cx.shadowBlur = 40; cx.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 40 : 95, a = -Math.PI / 2 + j * Math.PI / 5; cx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } cx.closePath(); cx.fill(); cx.restore(); } } },

  { name: 'Сура Ясин', dur: 28, quiet: true, cues: [], clip: { file: YASIN, at: 1.4 },
    update(t) { bedtime(t, { sleep: true, lamp: .8 }); K.cast(Dp, Tp); props(); wallMirror.set({ t, on: 0 }); K.fov(40); K.cam(t, [[0, [-.6, 1.9, .9], [-2.5, .7, -1.7]], [28, [.8, 1.9, -.6], [1.6, 1.75, -2.98]]], .3); },
    overlay(cx, t) {
      const a = seg(t, .3, 1.4) * (1 - seg(t, 26.6, 28)); cx.globalAlpha = a;
      cx.fillStyle = 'rgba(10,20,50,.72)'; cx.beginPath(); cx.roundRect(390, 470, 500, 140, 30); cx.fill();
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = '#ffd23f'; cx.font = '44px Pangolin'; cx.fillText('Сура Ясин', 640, 515);
      cx.fillStyle = '#cfd8ff'; cx.font = '26px Pangolin'; cx.fillText('аяты 1–4', 640, 570); cx.globalAlpha = 1;
    } },

  { name: 'Конец', dur: 6, quiet: true, title: ['Конец', 'седьмой серии'],
    cues: [[.8, 5.4, 'Рассказчик', 'Конец седьмой серии. Сладких снов!']],
    update(t) { bedtime(t, { sleep: true, lamp: .6 }); K.cast(Dp, Tp); props(); K.fov(40); K.cam(t, [[0, [1.6, 1.8, -1.0], [1.6, 1.75, -2.98]]], .3); } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_7.json' });
