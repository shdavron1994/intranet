// Episode 6 in 3D: «Помощники».
import * as THREE from 'three';
import { seg, ease, lerp, rbox, cyl, at, toyCar, sock } from './world.js';
import { startEpisode, speaking } from './eng3d.js';
import { makeKit } from './kit.js';
import { plate, spoon, block, drawToonFace } from './sets2.js';

const K = makeKit(['living', 'kitchen']);
const { D, T, Ma, P, scene } = K, L = K.living, kit = K.kitchen;
const tab = K.holdBoth(D, rbox(.3, .21, .02, '#2d3142', .02));
const tabScr = at(new THREE.Mesh(new THREE.PlaneGeometry(.27, .18), new THREE.MeshStandardMaterial({ color: '#7fe3ff', emissive: '#7fe3ff', emissiveIntensity: .8 })), 0, 0, .0105); tab.add(tabScr);
const can = new THREE.Group(); can.add(at(cyl(.07, .08, .14, '#3b8beb', 16), 0, 0, 0)); const spout = at(cyl(.012, .02, .18, '#3b8beb', 8), .1, .04, 0); spout.rotation.z = -1; can.add(spout); K.hold(T, can, 1); can.position.set(0, -.08, .05);
const drops = []; for (let i = 0; i < 8; i++) { const d = at(new THREE.Mesh(new THREE.SphereGeometry(.012, 8, 6), new THREE.MeshStandardMaterial({ color: '#8fd3ff' })), 0, 0, 0); scene.add(d); drops.push(d); }
// mess in the living room
const TOYS = [[toyCar('#ffd23f'), [-1.2, 0, .1]], [toyCar('#5dff9a'), [.9, 0, -.6]], [block('#ff5a5f'), [-.6, .06, -1.0]], [block('#3b8beb'), [.2, .06, -1.3]], [block('#ffd23f'), [1.5, .06, .2]], [sock(), [2.2, 0, -.3]]];
TOYS.forEach(([o]) => scene.add(o));
const basket = at(cyl(.22, .18, .35, '#d9a46c', 16), 3.4, .17, -2.4); L.group.add(basket);
const plates = [[-.42, -1.05], [.42, -1.05], [-.75, -.7], [.75, -.7]].map(([x, z]) => { const p = plate(); p.position.set(x, .785, z); scene.add(p); const s = spoon(); s.position.set(x + .2, .79, z); scene.add(s); return [p, s]; });
const SOFA = { D: { x: -.55, z: 1.3, ry: Math.PI, y: .55 }, T: { x: .55, z: 1.3, ry: Math.PI, y: .55 } };
const tvFace = t => (g, w, h) => drawToonFace(g, w, h, { t, talk: speaking('Чистон') });

function living(t, o = {}) {
  K.env('living'); L.tv.set(o.tv || null); L.door.rotation.y = -Math.PI / 2;
  plates.forEach(([p, s]) => p.visible = s.visible = false); drops.forEach(d => d.visible = false);
  const tidy = o.tidy ?? 0;
  TOYS.forEach(([obj, pos], i) => { const k = seg(tidy, i / TOYS.length, (i + 1) / TOYS.length), to = i === 5 ? [3.4, .45, -2.4] : [-3.2, .55, -.4]; obj.visible = k < 1; obj.position.set(lerp(pos[0], to[0], k), lerp(pos[1], to[1], k) + Math.sin(Math.PI * k) * .8, lerp(pos[2], to[2], k)); obj.rotation.set(0, i + k * 6, 0); });
  L.pots.forEach((p, i) => { const k = o.bloom ?? 1; p.userData.head.scale.setScalar(lerp(.35, 1, seg(k, i * .2, i * .2 + .6))); p.userData.head.rotation.x = lerp(.8, 0, k); });
  tab.visible = !!o.tablet; can.visible = !!o.can;
}
function kitchen(t, o = {}) {
  K.env('kitchen'); kit.kettle.set({ t, on: o.kettle ?? 1, talk: speaking('Чистон') }); kit.tv.set(null); kit.chart.userData.set(o.stars ?? 0, o.pop ?? 1);
  TOYS.forEach(([obj]) => obj.visible = false); tab.visible = can.visible = false; drops.forEach(d => d.visible = false);
  plates.forEach(([p, s], i) => { const kp = seg(o.set ?? 1, i * .12, i * .12 + .15), ks = seg(o.set ?? 1, .5 + i * .12, .5 + i * .12 + .15); p.visible = kp > 0; s.visible = ks > 0; p.position.y = .785 + (1 - kp) * .3; s.position.y = .79 + (1 - ks) * .3; });
}
const momTired = t => ({ mood: 'sad', nod: .2, armLx: .2, armRx: 1.2, elbowR: 2.2, lean: Math.sin(t) * .03 });

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 6. Помощники'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия шестая: «Помощники».']],
    update(t) { living(t, { bloom: 1 }); K.cast(); K.fov(40); K.cam(t, [[0, [0, 1.6, 3.8], [0, 1.6, 4.9]], [5, [-1.5, 1.8, 2.4], [0, 1, -1]]], .4); } },

  { name: 'Много дел', dur: 14,
    cues: [[1, 4.6, 'Мама', 'Ох, сколько сегодня дел: уборка, цветы, обед…'],
      [5, 8.2, 'Рассказчик', 'Мама устала, а дети сидели в планшете.'],
      [9, 14, 'Чистон', 'Дилшод, Томирис! Посмотрите на маму. Ей нужна помощь!']],
    sfx: [[8.6, 'power']],
    update(t) {
      living(t, { tablet: true, bloom: 0, tv: t > 8.6 ? tvFace(t) : null }); K.cast(D, T, Ma); K.fov(40);
      K.sit(D, SOFA.D); K.sit(T, SOFA.T);
      D.set({ t, sit: true, mood: t > 8.6 ? 'wow' : 'happy', armRx: 1.0, elbowR: 1.3, armLx: .9, elbowL: 1.3, nod: .35, look: [.5, -.6] });
      T.set({ t, sit: true, mood: t > 8.6 ? 'wow' : 'happy', turn: -.5, nod: .3, look: [-1, -.5] });
      const wM = K.walk(Ma, [3.2, -1.2], [1.8, -.4], 0, 1.4, t, -2.4); Ma.set(Object.assign({ t, walk: wM, talk: speaking('Мама') }, momTired(t)));
      if (t < 5) K.cam(t, [[0, [-1.4, 1.5, -1.6], [1.8, 1.3, -.4]], [5, [-.6, 1.5, -1.8], [1.8, 1.3, -.4]]]);
      else if (t < 9) K.cam(t, [[5, [0, 1.15, -.3], [0, .9, 1.3]], [9, [0, 1.1, .1], [0, .9, 1.3]]]);
      else K.cam(t, [[9, [.9, 1.5, 3.6], [0, 1.3, -2.9]], [14, [.4, 1.45, 2.4], [0, 1.3, -2.9]]]);
    } },

  { name: 'Мы поможем', dur: 11,
    cues: [[.5, 3, 'Дети', 'Мама, мы поможем!'],
      [3.4, 6, 'Мама', 'Правда? Вот спасибо!'],
      [6.4, 11, 'Чистон', 'Папа и мама помогают друг другу. И вы — как они!']],
    update(t) {
      living(t, { bloom: 0, tv: tvFace(t) }); K.cast(D, T, Ma); K.fov(40);
      const wD = K.walk(D, [-.55, .8], [1.0, .1], 0, 1.4, t, 2.3), wT = K.walk(T, [.55, .8], [1.4, .55], .2, 1.4, t, 2.6);
      D.set({ t, walk: wD, talk: speaking('Дилшод'), mood: 'happy', armL: t > 1.4 && t < 3 ? 2.4 : .15 }); T.set({ t, walk: wT, talk: speaking('Томирис'), mood: 'happy', armR: t > 1.4 && t < 3 ? 2.4 : .15 });
      K.place(Ma, 1.8, -.4, -1.2); Ma.set({ t, talk: speaking('Мама'), mood: t > 3 ? 'happy' : 'wow', armL: .4, armR: .4, armLx: t > 3.4 && t < 6 ? 1.1 : .1, armRx: t > 3.4 && t < 6 ? 1.1 : .1, elbowL: .7, elbowR: .7 });
      if (t < 6.4) K.cam(t, [[0, [-.8, 1.4, -1.6], [1.3, 1.0, .2]], [6.4, [-.4, 1.3, -1.2], [1.4, 1.1, 0]]]); else K.cam(t, [[6.4, [0, 1.45, -1.6], [0, 1.45, -2.9]], [11, [0, 1.45, -2.0], [0, 1.45, -2.9]]]);
    } },

  { name: 'Игрушки в коробку', dur: 14,
    cues: [[1, 4.4, 'Дилшод', 'Машинки — в коробку, кубики — тоже!'],
      [5, 8, 'Томирис', 'И носочек — в корзину!'],
      [10, 13.6, 'Мама', 'Какой порядок! Спасибо, мои хорошие!']],
    sfx: [[2, 'pop'], [3, 'pop'], [4, 'pop'], [5.2, 'pop'], [6.2, 'pop'], [7.4, 'pop']],
    update(t) {
      living(t, { bloom: 0, tidy: seg(t, 1.6, 7.8) }); K.cast(D, T, Ma); K.fov(42);
      K.place(D, -2.4, -.2, -1.6); K.place(T, 2.6, -1.4, 2.4);
      const bend = Math.max(0, Math.sin(t * 3)) * .4;
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armLx: t < 8 ? 1 + bend : .2, armRx: t < 8 ? 1 + bend : .2, elbowL: .4, elbowR: .4, nod: t < 8 ? .2 : 0 });
      T.set({ t, talk: speaking('Томирис'), mood: 'happy', armRx: t > 5 && t < 8 ? 1.4 : .2, elbowR: .4 });
      K.place(Ma, 1.0, 1.0, Math.PI); Ma.set({ t, talk: speaking('Мама'), mood: t > 10 ? 'happy' : 'wow', armL: .3, armR: .3, armLx: t > 10 ? 1.1 : .1, armRx: t > 10 ? 1.1 : .1, elbowL: .7, elbowR: .7 });
      if (t < 10) K.cam(t, [[0, [0, 2.4, 3.2], [0, .2, -.8]], [10, [1, 2.6, 3.6], [0, .2, -.8]]]); else K.cam(t, [[10, [-.6, 1.6, -1.8], [1.0, 1.4, 1.0]]]);
    } },

  { name: 'Цветы', dur: 12,
    cues: [[1, 3.8, 'Томирис', 'Цветочки, пейте водичку!'],
      [6, 11.4, 'Рассказчик', 'Цветы попили водички и раскрыли лепестки.']],
    update(t) {
      living(t, { bloom: seg(t, 4, 10), can: true, tidy: 1 }); K.cast(T); K.fov(38);
      const x = lerp(-.6, .5, seg(t, 1, 5)); K.place(T, x, 4.35, 0, .25);
      T.set({ t, talk: speaking('Томирис'), mood: 'happy', armRx: 1.5, elbowR: .4, armR: .2 });
      drops.forEach((d, i) => { const k = ((t * 1.6 + i / 8) % 1); d.visible = t > 1 && t < 5.5; d.position.set(x + .15, 1.55 - k * .3, 4.62 + k * .15); });
      if (t < 6) K.cam(t, [[0, [-1.8, 1.3, 3.4], [0, 1.15, 4.5]], [6, [1.8, 1.35, 3.5], [.3, 1.2, 4.5]]]); else K.cam(t, [[6, [.2, 1.55, 3.0], [.2, 1.5, 4.8]], [12, [0, 1.6, 3.8], [0, 1.65, 4.85]]]);
    } },

  { name: 'Накрываем на стол', dur: 14,
    cues: [[1, 3.8, 'Дилшод', 'Тарелки — на стол!'],
      [4.4, 7, 'Томирис', 'А я ложки разложу!'],
      [9, 13.6, 'Мама', 'Вы мои самые лучшие помощники!']],
    sfx: [[2, 'pop'], [2.8, 'pop'], [3.6, 'pop'], [5.2, 'pop'], [6, 'pop'], [6.8, 'pop']],
    update(t) {
      kitchen(t, { set: seg(t, 1.8, 7.2), kettle: 1 }); K.cast(D, T, Ma); K.fov(38);
      K.place(D, -.4, .1, Math.PI); K.place(T, .5, .1, Math.PI);
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armLx: t > 1.6 && t < 4 ? 1.3 : .2, armRx: t > 1.6 && t < 4 ? 1.3 : .2, elbowL: .5, elbowR: .5 });
      T.set({ t, talk: speaking('Томирис'), mood: 'happy', armRx: t > 4.4 && t < 7.2 ? 1.3 : .2, elbowR: .5 });
      K.place(Ma, 2.6, -1.85, t > 8.6 ? -1.6 : Math.PI); Ma.set({ t, talk: speaking('Мама'), mood: 'happy', armL: .3, armR: .3, armLx: t > 9 ? 1.1 : .1, armRx: t > 9 ? 1.1 : .1, elbowL: .7, elbowR: .7 });
      if (t < 8.6) K.cam(t, [[0, [0, 2.2, -1.9], [0, .6, .2]], [8.6, [-.4, 2.0, -2.0], [0, .7, .2]]]); else K.cam(t, [[8.6, [-.2, 1.5, 1.4], [1.6, 1.2, -1.5]]]);
    } },

  { name: 'Папа пришёл', dur: 18,
    cues: [[1, 4, 'Папа', 'Ого! Кто так всё убрал?'],
      [4.4, 7, 'Мама', 'Это наши помощники!'],
      [7.4, 11.6, 'Папа', 'Молодцы! За помощь — первая звёздочка на холодильник!'],
      [12, 18, 'Папа', 'Соберёте семь звёздочек — в выходной пойдём в парк!']],
    sfx: [[10.4, 'ding']],
    update(t) {
      kitchen(t, { stars: t > 10.4 ? 1 : 0, pop: seg(t, 10.4, 10.9) }); K.cast(D, T, Ma, P); K.fov(40);
      const wP = K.walk(P, [-.6, 4.5], [2.0, -.2], 0, 2.4, t, -2.4);
      const toFridge = t > 9 && t < 11.2;
      if (toFridge) { const w = K.walk(P, [2.0, -.2], [3.7, -1.85], 9, 10.2, t, Math.PI / 2); P.set({ t, walk: w, armRx: t > 10 ? 1.5 : .2, elbowR: .3 }); } else if (t >= 11.2) { K.place(P, 3.5, -1.5, -2.2); P.set({ t, talk: speaking('Папа'), mood: 'happy', armL: 1.3 }); } else P.set({ t, walk: wP, talk: speaking('Папа'), mood: t > 1 && t < 4 ? 'wow' : 'happy', armL: t > 1 && t < 4 ? 1.4 : .12, armR: t > 1 && t < 4 ? 1.4 : .12 });
      K.place(D, .4, .6, 1.8); K.place(T, .9, .9, 2.0); K.place(Ma, 1.0, -.2, 1.6);
      const cheer = t > 12;
      D.set({ t, mood: 'happy', armL: cheer ? 2.5 : .15, armR: cheer ? 2.5 : .15, jump: cheer ? Math.abs(Math.sin(t * 6)) * .08 : 0, turn: t > 9 && t < 12 ? .8 : 0 });
      T.set({ t, mood: 'happy', armL: cheer ? 2.5 : .15, armR: cheer ? 2.5 : .15, jump: cheer ? Math.abs(Math.sin(t * 6 + 1)) * .08 : 0, turn: t > 9 && t < 12 ? .8 : 0 });
      Ma.set({ t, talk: speaking('Мама'), mood: 'happy', armR: t > 4.4 && t < 7 ? 1.2 : .12 });
      if (t < 9) K.cam(t, [[0, [3.0, 1.55, 2.0], [.8, 1.0, .1]], [9, [2.7, 1.5, 2.3], [.8, 1.0, .1]]]);
      else if (t < 12) K.cam(t, [[9, [2.4, 1.5, .4], [4.3, 1.3, -2.1]], [12, [3.2, 1.4, -.6], [4.3, 1.35, -2.1]]]);
      else K.cam(t, [[12, [2.6, 1.6, 2.4], [1.4, 1.0, -.4]], [18, [2.2, 1.5, 2.8], [1.4, 1.0, -.4]]]);
    } },

  { name: 'Ура, звёздочка', dur: 11,
    cues: [[.5, 2.6, 'Дети', 'Ура! В парк!'],
      [3, 10.6, 'Чистон', 'Помогать маме и папе — значит расти большими и добрыми!']],
    sfx: [[.4, 'fanfare']],
    update(t) {
      kitchen(t, { stars: 1 }); K.cast(D, T, Ma, P); K.fov(40);
      K.place(D, .4, .6, .4); K.place(T, .9, .7, -.2); K.place(Ma, 1.5, .3, -.6); K.place(P, -.2, .4, .6);
      [D, T].forEach((X, i) => X.set({ t: t + i, talk: speaking(X === D ? 'Дилшод' : 'Томирис'), mood: 'happy', armL: 2.5, armR: 2.5, jump: Math.abs(Math.sin(t * 6 + i)) * .1 }));
      [Ma, P].forEach(X => X.set({ t, mood: 'happy' }));
      if (t < 3) K.cam(t, [[0, [.6, 1.3, 2.6], [.6, 1.0, .5]]]); else K.cam(t, [[3, [.45, 1.2, -1.55], [.85, 1.1, -2.6]], [10.6, [.3, 1.3, -1.1], [.85, 1.1, -2.6]]]);
    } },

  { name: 'Конец', dur: 6, title: ['Конец', 'шестой серии'],
    cues: [[.8, 5.4, 'Рассказчик', 'Конец шестой серии. Помогайте маме и папе!']],
    update(t) { kitchen(t, { stars: 1 }); K.cast(); K.fov(40); K.cam(t, [[0, [3.4, 1.4, -1.2], [4.3, 1.35, -2.1]], [6, [2.6, 1.6, .2], [4.0, 1.2, -2.1]]], .4); } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_6.json' });
