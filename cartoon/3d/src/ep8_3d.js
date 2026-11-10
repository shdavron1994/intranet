// Episode 8 in 3D: «Парк Лимпопо» — season finale.
import * as THREE from 'three';
import { seg, ease, lerp } from './world.js';
import { startEpisode, speaking } from './eng3d.js';
import { makeKit } from './kit.js';
import { ball, iceCream, drawToonFace } from './sets2.js';

const K = makeKit(['kitchen', 'park']);
const { D, T, M, P, scene } = K, kit = K.kitchen, PK = K.park;
const bl = ball('#4cc3ff', '#ffd23f'); scene.add(bl);
const ice = [[D, '#ffb3c1'], [T, '#fff3b0'], [M, '#b5f2c6'], [P, '#d9b38c']].map(([X, c]) => { const ic = K.hold(X, iceCream(c)); ic.position.set(0, -.02, .06); return ic; });

function kitchen(t, stars, pop = 1) { K.env('kitchen'); kit.kettle.set({ t, on: 1, talk: speaking('Чистон') }); kit.tv.set(null); kit.chart.userData.set(stars, pop); bl.visible = false; ice.forEach(i => i.visible = false); }
function park(t) {
  K.env('park'); kit.tv.set(null); bl.visible = false; ice.forEach(i => i.visible = false);
  PK.carousel.userData.spin.rotation.y = t * .6; PK.carousel.userData.seats.forEach((s, i) => s.userData.horse.position.y = .9 + Math.sin(t * 3 + i) * .12);
  PK.giraffe.userData.neck.rotation.z = -.3 + Math.sin(t * .8) * .08; PK.hippo.userData.jaw.rotation.z = -Math.max(0, Math.sin(t * 1.2)) * .5; PK.elephant.userData.head.rotation.z = Math.sin(t * 1.5) * .06;
}
// Tomiris on the carousel horse with index 0 (world position follows the spin)
function onCarousel(X, t) {
  const c = PK.carousel, a = c.userData.spin.rotation.y, r = 1.5;
  X.root.position.set(5 + Math.cos(-a) * r, .9 + Math.sin(t * 3) * .12 + .12 - .344 + .1, -5 + Math.sin(-a) * r);
  X.root.rotation.set(0, a + Math.PI, 0);
  X.set({ t, sit: true, mood: 'happy', armLx: 1.1, armRx: 1.1, elbowL: .8, elbowR: .8 });
}

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 8. Парк «Лимпопо»'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия восьмая: «Парк Лимпопо».']],
    update(t) { park(t); K.cast(); K.fov(42); K.cam(t, [[0, [0, 1.6, 14], [0, 3, 6]], [5, [0, 2.4, 9.5], [0, 3.2, 6]]], .4); } },

  { name: 'Наша неделя', dur: 19,
    cues: [[.5, 6, 'Рассказчик', 'Всю неделю Дилшод и Томирис были молодцами.'],
      [6.6, 9.6, 'Папа', 'Осталась последняя звёздочка…'],
      [10, 14, 'Мама', 'А сегодня утром дети сами заправили кровати!'],
      [14.4, 19, 'Папа', 'Вот она — седьмая звёздочка! Ура!']],
    sfx: [[15.6, 'fanfare']],
    update(t) {
      const n = t < 15.6 ? Math.min(6, 1 + Math.floor(seg(t, .5, 5.5) * 6)) : 7;
      kitchen(t, n, t < 15.6 ? seg(t, .5 + (n - 1) * .83, .9 + (n - 1) * .83) : seg(t, 15.6, 16.1)); K.cast(D, T, M, P); K.fov(40);
      K.place(P, 3.9, -.9, -.6); K.place(M, 2.2, -.1, 2.3); K.place(D, 2.8, .4, 2.6); K.place(T, 3.4, .35, 2.9);
      const cheer = t > 15.6;
      P.set({ t, talk: speaking('Папа'), mood: 'happy', armRx: t > 14.6 && t < 15.8 ? 1.5 : .2, elbowR: .3, armL: cheer ? 2.4 : .12 });
      M.set({ t, talk: speaking('Мама'), mood: 'happy', armL: cheer ? 2.4 : .12 });
      [D, T].forEach((X, i) => X.set({ t: t + i, mood: cheer ? 'wow' : 'happy', armL: cheer ? 2.5 : .15, armR: cheer ? 2.5 : .15, jump: cheer ? Math.abs(Math.sin(t * 6 + i)) * .1 : 0 }));
      if (t < 6.6) K.cam(t, [[0, [3.4, 1.4, -1.2], [4.3, 1.35, -2.1]], [6.6, [3.2, 1.4, -1.0], [4.3, 1.35, -2.1]]]);
      else if (t < 14.4) K.cam(t, [[6.6, [3.3, 1.45, -1.7], [2.7, 1.0, .2]], [14.4, [3.1, 1.5, -1.9], [2.8, 1.0, .2]]]);
      else if (t < 16.6) K.cam(t, [[14.4, [3.4, 1.4, -1.0], [4.3, 1.35, -2.1]]]);
      else K.cam(t, [[16.6, [3.3, 1.45, -1.7], [2.7, 1.0, .2]]]);
    } },

  { name: 'Идём в парк', dur: 9,
    cues: [[.5, 3.6, 'Папа', 'Как обещали — идём в парк «Лимпопо»!'],
      [4, 6.6, 'Дети', 'Ура! В парк!']],
    update(t) {
      kitchen(t, 7); K.cast(D, T, M, P); K.fov(40);
      K.place(P, 3.9, -.9, -.6); K.place(M, 2.2, -.1, 2.3); K.place(D, 2.8, .4, 2.6); K.place(T, 3.4, .35, 2.9);
      P.set({ t, talk: speaking('Папа'), mood: 'happy', armL: t < 3.6 ? 1.3 : .12 }); M.set({ t, mood: 'happy' });
      [D, T].forEach((X, i) => X.set({ t: t + i, talk: speaking(X === D ? 'Дилшод' : 'Томирис'), mood: 'happy', armL: t > 4 ? 2.5 : .15, armR: t > 4 ? 2.5 : .15, jump: t > 4 ? Math.abs(Math.sin(t * 7 + i)) * .12 : 0 }));
      if (t < 4) K.cam(t, [[0, [2.6, 1.6, .9], [3.9, 1.5, -.9]]]); else K.cam(t, [[4, [3.3, 1.35, -1.6], [3.0, .9, .4]], [9, [3.4, 1.45, -1.9], [3.0, .9, .4]]]);
    } },

  { name: 'В парке', dur: 26,
    cues: [[.5, 4, 'Рассказчик', 'В парке «Лимпопо» было солнечно и весело.'],
      [4.5, 6.6, 'Дилшод', 'Папа, лови!'],
      [7, 9, 'Папа', 'Поймал!'],
      [9.6, 12.4, 'Томирис', 'Мама, смотри — жираф!'],
      [12.8, 15.4, 'Мама', 'Какой высокий! А вон — слон и бегемот!'],
      [16, 26, 'Рассказчик', 'Томирис каталась на карусели, Дилшод играл с папой в мяч, и все смеялись вместе.']],
    sfx: [[5, 'boing'], [7.4, 'boing']],
    update(t) {
      park(t); K.cast(D, T, M, P); K.fov(42); bl.visible = t > 4;
      if (t < 4.5) {
        const z = lerp(9, 3, seg(t, 0, 4.5));
        [[P, -.9], [D, -.3], [T, .3], [M, .9]].forEach(([X, x], i) => { K.place(X, x, z, Math.PI); X.set({ t: t + i, walk: t * 8 + i, mood: 'happy', armL: X === T || X === D ? .5 : .15, armR: .5 }); });
        bl.visible = false; K.cam(t, [[0, [0, 1.6, 1], [0, 1.2, 8]], [4.5, [1.5, 1.8, -1], [0, 1, 3.5]]]); return;
      }
      // ball between Dilshod and papa
      K.place(D, .9, 2.4, -Math.PI / 2 + .2); K.place(P, -.9, 2.2, Math.PI / 2 - .2);
      const k = (t % 2.4) / 2.4, dir = Math.floor(t / 2.4) % 2, a = dir ? [-.75, 2.2] : [.75, 2.4], b = dir ? [.75, 2.4] : [-.75, 2.2];
      bl.position.set(lerp(a[0], b[0], k), .9 + Math.sin(Math.PI * k) * 1.1, lerp(a[1], b[1], k));
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armLx: 1.2, armRx: 1.2, elbowL: .4, elbowR: .4, jump: Math.abs(Math.sin(t * 4)) * .03 });
      P.set({ t, talk: speaking('Папа'), mood: 'happy', armLx: 1.1, armRx: 1.1, elbowL: .4, elbowR: .4 });
      if (t < 16) {
        K.place(T, -1.2, -1.2, -Math.PI / 2 - .5); K.place(M, -1.0, -.4, -Math.PI / 2 - .3);
        T.set({ t, talk: speaking('Томирис'), mood: 'wow', armRx: t > 9.6 ? 1.6 : .2, armR: t > 9.6 ? .6 : .15, elbowR: .2, nod: -.3 });
        M.set({ t, talk: speaking('Мама'), mood: 'happy', armLx: t > 12.8 ? 1.4 : .2, elbowL: .3, turn: t > 13.5 ? .5 : 0 });
      } else { onCarousel(T, t); K.place(M, 3.0, -2.6, .9); M.set({ t, mood: 'happy', armL: 1.5 + Math.sin(t * 4) * .4 }); }
      if (t < 9.6) K.cam(t, [[4.5, [0, 1.5, 5.4], [0, 1.1, 2.3]], [9.6, [.4, 1.6, 5.8], [0, 1.2, 2.3]]]);
      else if (t < 12.8) K.cam(t, [[9.6, [.4, 1.7, .6], [-5, 2.6, -6]], [12.8, [.0, 2.0, .2], [-5, 3, -6]]]);
      else if (t < 16) K.cam(t, [[12.8, [-.6, 1.6, 1.2], [-6, 1.2, -2.5]], [16, [-1.2, 1.5, .6], [-4.5, .8, -8]]]);
      else if (t < 21) K.cam(t, [[16, [1.2, 2.2, 1.2], [5, 1.2, -5]], [21, [2.0, 2.0, -.2], [5, 1.2, -5]]]);
      else K.cam(t, [[21, [3.6, 2.4, 4.4], [1.5, 1, -1]], [26, [-2.4, 3.0, 4.6], [1.5, 1, -1.5]]]);
    } },

  { name: 'Мороженое', dur: 14,
    cues: [[.5, 4, 'Мама', 'А теперь — по одному мороженому!'],
      [4.5, 8.4, 'Дилшод', 'Немножко сладкого можно, а потом почистим зубки!'],
      [8.8, 13.6, 'Папа', 'Правильно! Вы всё-всё запомнили.']],
    update(t) {
      park(t); K.cast(D, T, M, P); K.fov(40); ice.forEach(i => i.visible = t > 2);
      K.place(M, 1.5, 2.2, .3); K.place(D, 2.0, 2.6, 0); K.place(T, 2.6, 2.7, -.2); K.place(P, 3.1, 2.3, -.4);
      const lick = k => ({ armRx: 1.3 + Math.max(0, Math.sin(t * 2 + k)) * .4, elbowR: 1.4 + Math.max(0, Math.sin(t * 2 + k)) * .6 });
      M.set(Object.assign({ t, talk: speaking('Мама'), mood: 'happy' }, t > 2 ? lick(0) : { armL: t < 2 ? 1.2 : .12 }));
      D.set(Object.assign({ t, talk: speaking('Дилшод'), mood: 'happy' }, t > 2 ? lick(1) : {})); T.set(Object.assign({ t, mood: 'happy' }, t > 2 ? lick(2) : {})); P.set(Object.assign({ t, talk: speaking('Папа'), mood: 'happy' }, t > 2 ? lick(3) : {}));
      if (t < 4.5) K.cam(t, [[0, [2.3, 1.5, 6.2], [2.3, 1.1, 2.0]], [4.5, [2.3, 1.4, 5.4], [2.3, 1.1, 2.3]]]); else if (t < 8.8) K.cam(t, [[4.5, [2.0, 1.1, 3.9], [2.0, .95, 2.6]]]); else K.cam(t, [[8.8, [2.9, 1.6, 4.4], [3.1, 1.5, 2.3]], [13.6, [2.4, 1.7, 5.6], [2.4, 1.2, 2.4]]]);
    } },

  { name: 'Самый лучший день', dur: 17,
    cues: [[.5, 4.8, 'Дети', 'Спасибо, мама и папа! Это самый лучший день!'],
      [5.2, 10, 'Папа', 'А мы вами гордимся. Вы всю неделю росли и учились.'],
      [10.4, 17, 'Чистон', 'Хорошие дела делают день радостным. До новых встреч, утренние герои!']],
    sfx: [[10.2, 'power']],
    update(t) {
      park(t); K.env('park', 'evening'); K.cast(D, T, M, P); K.fov(40);
      const seat = (x, kid) => ({ x: -.5 + (x), z: -1.5 + .05, ry: Math.PI / 2, y: .48 });
      K.sit(P, { x: -.5, z: -2.15, ry: Math.PI / 2, y: .48 }); K.sit(D, { x: -.5, z: -1.75, ry: Math.PI / 2, y: .48 }); K.sit(T, { x: -.5, z: -1.35, ry: Math.PI / 2, y: .48 }); K.sit(M, { x: -.5, z: -.9, ry: Math.PI / 2, y: .48 });
      [D, T].forEach((X, i) => X.set({ t: t + i, sit: true, talk: speaking(X === D ? 'Дилшод' : 'Томирис'), mood: 'happy', swingLegs: 1, armL: t < 4.8 ? 1.2 : .15 }));
      P.set({ t, sit: true, talk: speaking('Папа'), mood: 'happy', armR: 1.0 }); M.set({ t, sit: true, mood: 'happy', armL: 1.0 });
      if (t < 5.2) K.cam(t, [[0, [2.6, 1.15, -1.5], [-.5, .95, -1.5]], [5.2, [2.2, 1.1, -1.5], [-.5, .95, -1.5]]]); else if (t < 10.4) K.cam(t, [[5.2, [1.4, 1.3, -2.6], [-.5, 1.3, -2.1]]]); else K.cam(t, [[10.4, [3.4, 1.6, -1.5], [-.5, 1.0, -1.5]], [17, [6, 2.6, 1], [-.5, 1.0, -1.5]]]);
    },
    overlay(cx, t) { if (t < 10.2) return; const a = seg(t, 10.2, 10.8); cx.globalAlpha = a; cx.fillStyle = '#e9eff5'; cx.beginPath(); cx.ellipse(1110, 170, 118, 138, 0, 0, 7); cx.fill(); cx.save(); cx.beginPath(); cx.ellipse(1110, 170, 104, 124, 0, 0, 7); cx.clip(); cx.translate(1006, 46); drawToonFace(cx, 208, 248, { t, talk: speaking('Чистон') }); cx.restore(); cx.globalAlpha = 1; } },

  { name: 'Конец сезона', dur: 11, title: ['Конец сезона', 'Чистые руки, добрые дела!'],
    cues: [[1, 8.6, 'Все', 'Чистые руки, добрые дела — вот какая наша семья!']],
    sfx: [[.4, 'fanfare']],
    update(t) {
      park(t); K.env('park', 'evening'); K.cast(D, T, M, P); K.fov(42);
      [[P, -.9], [D, -.3], [T, .3], [M, .9]].forEach(([X, x], i) => { K.place(X, x, 4.6, 0); X.set({ t: t + i, talk: speaking(X === D ? 'Дилшод' : X === T ? 'Томирис' : X === M ? 'Мама' : 'Папа'), mood: 'happy', armL: 2.4 + Math.sin(t * 5 + i) * .25, armR: X === D || X === T ? 2.4 : .3 }); });
      K.cam(t, [[0, [0, 1.3, 7.6], [0, 1.2, 4.6]], [11, [0, 2.6, 12], [0, 2.4, 4.6]]], .5);
    } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_8.json' });
