// Episode 5 in 3D: «Копилка».
import * as THREE from 'three';
import { seg, ease, lerp, makeChiston } from './world.js';
import { startEpisode, speaking } from './eng3d.js';
import { makeKit } from './kit.js';
import { bowl, spoon, coin, piggyBank } from './sets2.js';
import { toothbrush, foam } from './sets.js';

const K = makeKit(['kitchen', 'bedroom', 'bathroom', 'street', 'pajama']);
const { D, T, Ma, P, Dp, Tp, scene } = K, kit = K.kitchen, S = kit.seats, B = K.bedroom;
const sp = [K.hold(D, spoon()), K.hold(T, spoon()), K.hold(P, spoon()), K.hold(Ma, spoon())]; sp.forEach(s => { s.rotation.set(-1.4, 0, 0); s.position.set(0, -.02, .05); });
const bowls = [bowl(), bowl(), bowl(), bowl()]; bowls.forEach(b => scene.add(b));
const BOWL_AT = [[-.42, -1.05], [.42, -1.05], [-.75, -.7], [.75, -.7]];
const brushes = [K.hold(Dp, toothbrush('#4cc3ff')), K.hold(Tp, toothbrush('#ff7aa2'))]; brushes.forEach(b => b.rotation.x = -1.4);
const foams = [foam(), foam()]; K.hold(Dp, foams[0]); K.hold(Tp, foams[1]);
const coins = [K.hold(D, coin()), K.hold(T, coin())]; coins.forEach(c => c.position.set(0, -.04, .05));
const falling = [coin(), coin()]; falling.forEach(c => scene.add(c));
const pig = piggyBank(); pig.position.set(.8, .45, -2.5); pig.rotation.y = .3; B.group.add(pig);
B.curtL.position.x = .55; B.curtL.scale.x = .45; B.curtR.position.x = 2.65; B.curtR.scale.x = .45;
const wallMirror = makeChiston(); wallMirror.root.position.set(-.4, 1.75, -2.94); wallMirror.root.scale.setScalar(.5); B.group.add(wallMirror.root);

function props(o = {}) { brushes.forEach(b => b.visible = !!o.brush); foams.forEach(f => f.visible = !!o.foam); coins.forEach((c, i) => c.visible = !!(o.coins && o.coins[i])); falling.forEach(c => c.visible = false); sp.forEach(s => s.visible = !!o.spoons); bowls.forEach(b => b.visible = !!o.bowls); }
function kitchen(t, o = {}) {
  K.env('kitchen'); kit.kettle.set({ t, on: o.kettle ?? 1, talk: speaking('Чистон') }); kit.tv.set(o.tv || null);
  bowls.forEach((b, i) => { b.position.set(BOWL_AT[i][0], .78, BOWL_AT[i][1]); b.userData.food.scale.setScalar(o.food ?? .3); });
  K.cast(D, T, Ma, P); K.sit(D, S.D); K.sit(T, S.T); K.sit(P, S.P); K.sit(Ma, S.M);
}
const C = { wide: [[0, 1.6, 3.4], [0, .95, -1.2]], kids: [[0, 1.22, .75], [0, 1.05, -1.45]], kettle: [[.45, 1.2, -1.55], [.85, 1.1, -2.6]], papa: [[.4, 1.3, .2], [-1.25, 1.35, -.7]], tv: [[-2.6, 1.4, .8], [-4.9, 1.6, -.9]] };
const shot = (t, a, b, t0 = 0, t1 = 8) => K.cam(t, [[t0, ...C[a]], [t1, ...C[b || a]]]);
const sugarTV = t => (g, w, h) => g.drawImage(K.draw2D(() => sugarShow(t)), 0, 0, w, h);

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 5. Копилка'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия пятая: «Копилка».']],
    update(t) { K.env('bedroom'); K.cast(); props(); wallMirror.set({ t, on: 0 }); K.fov(40); K.cam(t, [[0, [1.5, 1.4, 2], [.8, .7, -2.5]], [5, [1.2, 1.0, -1.2], [.8, .65, -2.5]]], .4); } },

  { name: 'Утро', dur: 13,
    cues: [[1.4, 4.4, 'Мама', 'Доброе утро, мои хорошие! Просыпайтесь!'],
      [4.8, 7, 'Дети', 'Доброе утро, мама!'],
      [7.6, 12.6, 'Рассказчик', 'В этот раз дети встали сразу — и в комнате уже порядок!']],
    update(t) {
      K.env('bedroom'); K.cast(Dp, Tp, Ma); props(); wallMirror.set({ t, on: 0 }); K.fov(40);
      B.door.rotation.y = -seg(t, 0, .8) * 1.6;
      const wM = K.walk(Ma, [4.1, -2.4], [-.6, -1.0], .4, 2.2, t, -Math.PI / 2); Ma.set({ t, walk: wM, talk: speaking('Мама'), mood: 'happy', armL: t > 2 && t < 4.4 ? 1.2 : .12 });
      const up = t > 4.6;
      [[Dp, -3.4, 'Дилшод'], [Tp, -1.7, 'Томирис']].forEach(([X, bx, n], i) => {
        B.beds[i].userData.blanket.scale.y = up ? 1 : 2.2; B.beds[i].userData.blanket.position.y = up ? .58 : .7;
        if (!up) { X.root.position.set(bx, .66, -1.54); X.root.rotation.set(0, 0, 0); X.body.rotation.set(-Math.PI / 2, 0, 0); X.set({ t: t + i, sleep: t < 4, mood: 'happy' }); }
        else if (t < 7.6) { K.sit(X, { x: bx, z: -1.3, ry: 0, y: .55 }); X.set({ t: t + i, sit: true, talk: speaking(n), mood: 'happy', armL: 2.4, armR: 2.4, elbowL: .3, elbowR: .3 }); }
        else { const w = K.walk(X, [bx, -.6], [bx + 3.4, .6], 7.8, 11, t); X.root.position.y = 0; X.body.rotation.set(0, 0, 0); X.set({ t: t + i, walk: w, mood: 'happy' }); B.beds[i].userData.blanket.scale.y = .9; }
      });
      if (t < 4.6) K.cam(t, [[0, [-4.2, 1.6, .9], [-2.0, .8, -1.6]], [4.6, [-3.8, 1.4, .6], [-2.2, .8, -1.6]]]); else if (t < 7.6) K.cam(t, [[4.6, [-2.5, 1.1, .4], [-2.5, .95, -1.4]]]); else K.cam(t, [[7.6, [3, 1.8, 2.6], [-1.5, .8, -1.5]], [13, [2, 2, 3.2], [-1, .7, -1.5]]]);
    } },

  { name: 'Умываемся', dur: 13,
    cues: [[.5, 4.4, 'Песня', 'Щёткой вверх и щёткой вниз — каждый зубик, улыбнись!'],
      [5, 8.6, 'Песня', 'Мыло, водичка — чистое личико!'],
      [9.2, 13, 'Чистон', 'Вот это утренние герои! Даже напоминать не пришлось!']],
    sfx: [[9, 'ding']],
    update(t) {
      K.env('bathroom'); K.cast(Dp, Tp); K.bathroom.mirror.set({ t, on: 1, talk: speaking('Чистон') }); K.bathroom.water.visible = t > 4.8 && t < 8.8;
      K.place(Dp, -.32, -2.02, Math.PI); K.place(Tp, .42, -2.06, Math.PI, .18);
      const brush = t < 4.8, wash = t >= 4.8 && t < 8.8, sc = Math.sin(t * 14) * .2;
      props({ brush, foam: wash }); foams.forEach(f => f.userData.update(t, seg(t, 4.8, 5.4) * (1 - seg(t, 8.2, 8.8))));
      const pose = brush ? { armRx: 1.5, elbowR: 1.9 + Math.sin(t * 16) * .15, armR: .3 } : wash ? { armLx: 1.3 + sc, elbowL: .9, armRx: 1.3 - sc, elbowR: .9, nod: .3 } : { armL: 2.4, armR: 2.4, elbowL: .3, elbowR: .3 };
      Dp.set(Object.assign({ t, mood: 'happy' }, pose)); Tp.set(Object.assign({ t: t + 1.3, mood: 'happy' }, pose));
      if (t < 9.2) { K.fov(62); K.cam(t, [[0, [.05, 1.4, -2.86], [.05, 1.0, -1.95]], [9.2, [.05, 1.36, -2.88], [.05, .98, -1.95]]]); } else { K.fov(40); K.cam(t, [[9.2, [1.6, 1.6, 1.2], [0, 1.4, -2.6]]]); }
    } },

  { name: 'Завтрак всей семьёй', dur: 15,
    cues: [[.5, 4, 'Папа', 'Доедайте, дети, и идём в садик!'],
      [4.4, 8, 'Дилшод', 'Папа, а давай по дороге зайдём в магазин?'],
      [8.4, 11.4, 'Томирис', 'Купим мармеладки и шоколадки!'],
      [11.8, 15, 'Папа', 'Хм… Что скажет Чистон?']],
    update(t) {
      kitchen(t, { kettle: 0, food: lerp(.8, .2, t / 15) }); props({ bowls: true, spoons: t < 4.4 }); K.fov(38);
      const cyc = k => Math.max(0, Math.sin((t / 2.4 + k) * Math.PI * 2));
      P.set(Object.assign({ t, sit: true, talk: speaking('Папа'), mood: 'happy' }, t < 4.4 ? K.eat(P, cyc(.3)) : t > 11.8 ? { armRx: 1.6, elbowR: 2.2, tilt: .2 } : {}));
      Ma.set(Object.assign({ t, sit: true, mood: 'happy' }, t < 4.4 ? K.eat(Ma, cyc(.7)) : {}));
      D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод'), mood: 'happy', turn: t > 4.4 ? -.7 : 0 }, t < 4.4 ? K.eat(D, cyc(0)) : {}));
      T.set(Object.assign({ t, sit: true, talk: speaking('Томирис'), mood: t > 8.4 && t < 11.4 ? 'wow' : 'happy', turn: t > 8.4 ? -.5 : 0, armL: t > 8.4 && t < 11.4 ? 2.4 : .15, armR: t > 8.4 && t < 11.4 ? 2.4 : .15 }, t < 4.4 ? K.eat(T, cyc(.5)) : {}));
      if (t < 4.4) shot(t, 'wide', 'wide', 0, 4.4); else if (t < 11.8) shot(t, 'kids', 'kids', 4.4, 11.8); else shot(t, 'papa', 'papa', 11.8, 15);
    } },

  { name: 'Чистон в чайнике', dur: 7,
    cues: [[.3, 6.6, 'Чистон', 'Подождите! Давайте я покажу по телевизору, что внутри сладостей.']],
    sfx: [[.1, 'power'], [6.4, 'pop']],
    update(t) { kitchen(t, { kettle: seg(t, 0, .8), tv: t > 6.4 ? sugarTV(0) : null }); props({ bowls: true }); [D, T, P, Ma].forEach(X => X.set({ t, sit: true, mood: t < 2 ? 'wow' : 'happy', turn: X === P ? -.4 : .5 })); K.fov(38); if (t < 5) shot(t, 'kettle', 'kettle', 0, 5); else shot(t, 'tv'); } },

  { name: 'Что внутри сладостей', dur: 26,
    cues: [[.5, 5, 'Ведущий', 'В мармеладках и шоколадках очень-очень много сахара.'],
      [5.4, 10, 'Ведущий', 'А сахар обожают микробы-Липучки, которые живут на зубках.'],
      [10.4, 15.4, 'Липучки', 'Ням-ням! Сахар! Сейчас мы сделаем дырочку!'],
      [15.8, 21, 'Ведущий', 'Липучки едят сахар — и в зубике появляется дырочка. Зубик болит.'],
      [21.4, 26, 'Ведущий', 'Поэтому сладкое — только чуть-чуть, а потом — почистить зубки.']],
    sfx: [[2, 'boing'], [14, 'error']],
    update(t) {
      kitchen(t, { tv: sugarTV(t) }); props({ bowls: true });
      [D, T].forEach(X => X.set({ t, sit: true, mood: t > 15.8 ? 'sad' : 'wow', turn: 1.1, look: [-1, 0], armLx: t > 16 ? 1.7 : .2, elbowL: t > 16 ? 2.2 : .3 }));
      [P, Ma].forEach(X => X.set({ t, sit: true, mood: 'happy', turn: X === P ? .3 : 1.0 }));
      K.fov(38); K.cam(t, [[0, [-3.6, 1.5, -.3], [0, 1.0, -1.3]], [26, [-3.3, 1.45, -.5], [0, 1.0, -1.3]]]);
    },
    overlay(cx, t) { const cut = (t > 8.5 && t < 10.2) || (t > 16.2 && t < 18); if (!cut) cx.drawImage(K.draw2D(() => sugarShow(t)), 0, 0); } },

  { name: 'Дети передумали', dur: 18,
    cues: [[.5, 3.6, 'Дилшод', 'Ой! Я не хочу дырочки в зубках!'],
      [3.9, 5.6, 'Томирис', 'И я не хочу!'],
      [6, 10.2, 'Дилшод', 'Папа, лучше дай нам денежку — мы положим её в копилку!'],
      [10.5, 13, 'Томирис', 'И купим что-то полезное!'],
      [13.4, 18, 'Папа', 'Вот это умные дети! Держите — по монетке каждому.']],
    sfx: [[15, 'ding'], [15.6, 'ding']],
    update(t) {
      kitchen(t, {}); props({ bowls: true, coins: [t > 15, t > 15.6] }); K.fov(38);
      D.set({ t, sit: true, talk: speaking('Дилшод'), mood: t < 3.6 ? 'wow' : 'happy', turn: t > 6 ? -.7 : 0, armLx: t < 3.6 ? 1.8 : .2, elbowL: t < 3.6 ? 2.2 : .3, armRx: t > 15 ? 1.2 : .2, elbowR: t > 15 ? 1 : .3 });
      T.set({ t, sit: true, talk: speaking('Томирис'), mood: 'happy', turn: t > 10 ? -.5 : 0, armRx: t > 15.6 ? 1.2 : .2, elbowR: t > 15.6 ? 1 : .3 });
      P.set({ t, sit: true, talk: speaking('Папа'), mood: t > 13.4 ? 'wow' : 'happy', armRx: t > 14.6 && t < 16.4 ? 1.3 : .2, elbowR: .4 }); Ma.set({ t, sit: true, mood: 'happy' });
      if (t < 6) shot(t, 'kids', 'kids', 0, 6); else if (t < 13.4) K.cam(t, [[6, [.6, 1.2, .3], [-.3, 1.05, -1.45]], [13.4, [.8, 1.25, .4], [0, 1.05, -1.45]]]); else K.cam(t, [[13.4, ...C.papa], [18, [1.2, 1.4, 1.2], [-.5, 1.1, -1.1]]]);
    } },

  { name: 'Копилка', dur: 13,
    cues: [[.5, 2.8, 'Дети', 'Дзинь! Дзинь!'],
      [3.2, 7.4, 'Чистон', 'Монетка к монетке — и копилка растёт!'],
      [7.8, 10.2, 'Дилшод', 'Мы накопим на мяч!'],
      [10.5, 13, 'Томирис', 'А я — на книжку!']],
    sfx: [[1, 'ding'], [2, 'ding']],
    update(t) {
      K.env('bedroom'); K.cast(D, T); props({ coins: [t < .7, t < 1.7] }); wallMirror.set({ t, on: 1, talk: speaking('Чистон') }); K.fov(40);
      B.door.rotation.y = 0; B.beds.forEach(b => { b.userData.blanket.scale.y = .9; b.userData.blanket.position.y = .58; });
      const after = t > 2.6; if (after) { K.place(D, .05, -2.25, .3); K.place(T, 1.55, -2.25, -.3); } else { K.place(D, .35, -1.9, Math.PI - .4); K.place(T, 1.25, -1.95, Math.PI + .4); }
      [[0, .7], [1, 1.7]].forEach(([i, t0]) => { const c = falling[i], k = seg(t, t0, t0 + .3); c.visible = t > t0 && k < 1; c.position.set(.8, lerp(.95, .85, k), -2.5); c.rotation.set(0, .3, Math.PI / 2); });
      pig.scale.setScalar(1 + Math.max(0, Math.sin((t - 1) * 8)) * .06 * (t < 2.4));
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armRx: t < 1 ? 1.4 : .2, elbowR: .4, armL: t > 7.8 && t < 10.2 ? 2.4 : .15 });
      T.set({ t, talk: speaking('Томирис'), mood: 'happy', armLx: t > .8 && t < 2 ? 1.4 : .2, elbowL: .4, armR: t > 10.5 ? 2.4 : .15 });
      if (t < 3.2) K.cam(t, [[0, [.6, 1.25, -1.0], [.8, .7, -2.5]], [3.2, [1.0, 1.2, -1.0], [.8, .7, -2.5]]]); else if (t < 7.8) K.cam(t, [[3.2, [-.2, 1.6, -1.6], [-.4, 1.7, -2.94]]]); else K.cam(t, [[7.8, [.8, 1.15, -.1], [.8, .9, -2.3]], [13, [.8, 1.2, .2], [.8, .9, -2.3]]]);
    } },

  { name: 'В садик', dur: 11,
    cues: [[.5, 3, 'Папа', 'А теперь — в садик!'],
      [3.4, 10.6, 'Рассказчик', 'Иногда немножко сладкого можно — после еды. А потом обязательно почистить зубки!']],
    update(t) {
      K.env('street'); K.cast(); props(); K.car.mirror.visible = false;
      const x = lerp(-10, 22, t / 11); K.car.root.position.set(x, 0, .9); K.car.set({ t, moving: true, dist: x });
      K.fov(40); K.cam(t, [[0, [x - 4, 1.7, 5.5], [x, .8, .9]], [11, [x - 3, 2.2, 6.5], [x + 2, .8, .9]]], .4);
    } },

  { name: 'Конец', dur: 6, title: ['Конец', 'пятой серии'],
    cues: [[.8, 5.4, 'Рассказчик', 'Конец пятой серии. Береги зубки — и копи монетки!']],
    update(t) { K.env('bedroom'); K.cast(); props(); wallMirror.set({ t, on: 1 }); pig.scale.setScalar(1); K.fov(40); K.cam(t, [[0, [.8, .95, -1.6], [.8, .7, -2.5]], [6, [1.4, 1.3, -.8], [.8, .7, -2.5]]], .4); } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_5.json' });
