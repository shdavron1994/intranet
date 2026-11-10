// Episode 4 in 3D: «Папа дома!».
import * as THREE from 'three';
import { seg, ease, lerp } from './world.js';
import { startEpisode, speaking } from './eng3d.js';
import { makeKit } from './kit.js';
import { bowl, spoon, phone, drawToonFace } from './sets2.js';

const K = makeKit(['kitchen', 'living']);
const { D, T, Ma, P, scene } = K, kit = K.kitchen, S = kit.seats, L = K.living;
const ph = K.hold(D, phone()); ph.rotation.set(-1.2, 0, 0); ph.position.set(0, -.02, .05);
const sp = [K.hold(D, spoon()), K.hold(T, spoon()), K.hold(P, spoon()), K.hold(Ma, spoon())]; sp.forEach(s => { s.rotation.set(-1.4, 0, 0); s.position.set(0, -.02, .05); });
const bowls = [bowl(), bowl(), bowl(), bowl()]; bowls.forEach(b => scene.add(b));
const BOWL_AT = [[-.42, -1.05], [.42, -1.05], [-.75, -.7], [.75, -.7]];

function cartoon(g, w, h, t) {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7fd3ff'); gr.addColorStop(.6, '#c9f0ff'); gr.addColorStop(.6, '#5fbf6a'); gr.addColorStop(1, '#4caf62'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const bx = w / 2 + Math.sin(t * 3) * 200, by = h * .55 - Math.abs(Math.sin(t * 6)) * 120;
  g.fillStyle = '#ff5a5f'; g.beginPath(); g.arc(bx, by, 50, 0, 7); g.fill(); g.fillStyle = '#fff'; [[-16, -12], [16, -12]].forEach(([x, y]) => { g.beginPath(); g.arc(bx + x, by + y, 9, 0, 7); g.fill(); });
}
function kitchen(t, o = {}) {
  K.env('kitchen'); kit.kettle.set({ t, on: o.kettle ?? 0, talk: speaking('Чистон') });
  kit.tv.set(o.tv ? (g, w, h) => cartoon(g, w, h, t) : null);
  bowls.forEach((b, i) => { b.visible = i < (o.bowls ?? 2); b.position.set(BOWL_AT[i][0], .78, BOWL_AT[i][1]); b.userData.food.scale.setScalar(o.food ?? 1); });
  ph.visible = !!o.phone; sp.forEach((s, i) => s.visible = !!o.spoons && i < (o.bowls ?? 2));
}
const C = { wide: [[0, 1.6, 3.4], [0, .95, -1.2]], kids: [[0, 1.22, .75], [0, 1.05, -1.45]], kettle: [[.85, 1.2, -1.55], [1.25, 1.1, -2.6]], tvkids: [[-2.4, 1.3, -.4], [0, 1.0, -1.45]], papa: [[.6, 1.55, 1.8], [-.6, 1.5, 2.6]] };
const shot = (t, a, b, t0 = 0, t1 = 8) => K.cam(t, [[t0, ...C[a]], [t1, ...C[b || a]]]);
// living room: the whole family on the sofa watching «Мама, папа и малыш»
const SOFA = { P: { x: -.85, z: 1.3, ry: Math.PI, y: .55 }, D: { x: -.28, z: 1.3, ry: Math.PI, y: .55 }, T: { x: .28, z: 1.3, ry: Math.PI, y: .55 }, M: { x: .85, z: 1.3, ry: Math.PI, y: .55 } };
function sofa(t, show, pose = {}) {
  K.env('living'); K.cast(D, T, K.M, P); ph.visible = false; sp.forEach(s => s.visible = false); bowls.forEach(b => b.visible = false);
  L.tv.set(show ? (g, w, h) => g.drawImage(K.draw2D(show), 0, 0, w, h) : null);
  K.sit(P, SOFA.P); K.sit(D, SOFA.D); K.sit(T, SOFA.T); K.sit(K.M, SOFA.M);
  P.set(Object.assign({ t, sit: true, talk: speaking('Папа'), mood: 'happy', armR: .5 }, pose.P)); K.M.set(Object.assign({ t, sit: true, talk: speaking('Мама'), mood: 'happy' }, pose.M));
  D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод'), mood: 'happy', swingLegs: 1 }, pose.D)); T.set(Object.assign({ t, sit: true, talk: speaking('Томирис'), mood: 'happy', swingLegs: 1 }, pose.T));
}
const SC = { tv: [[0, 1.25, -2.0], [0, .9, 1.3]], over: [[.9, 1.5, 3.6], [0, 1.3, -2.9]] };
const NAMES = { cat: ['кошка', 'кот', 'котёнок'], dog: ['собака', 'пёс', 'щенок'], cow: ['корова', 'бык', 'телёнок'], horse: ['лошадь', 'конь', 'жеребёнок'], sheep: ['овца', 'баран', 'ягнёнок'], chicken: ['курица', 'петух', 'цыплёнок'] };
const SOUND = { cat: 'Мяу!', dog: 'Гав-гав!', cow: 'Му-у!', horse: 'И-го-го!', sheep: 'Бе-е-е!', chicken: 'Пи-пи-пи!' };
function animalScene(spec, line, i) {
  const name = NAMES[spec][2];
  return { name: name[0].toUpperCase() + name.slice(1), dur: 9,
    cues: [[.3, 6, 'Ведущий', line], [6.3, 8.8, 'Дети', SOUND[spec]]], sfx: [[.2, 'pop']],
    update(t) {
      sofa(t, () => tvShow(t, spec, t >= 6.3), { D: { mood: t > 6.3 ? 'wow' : 'happy', armL: t > 6.3 ? 2.4 : .15, armR: t > 6.3 ? 2.4 : .15 }, T: { mood: t > 6.3 ? 'wow' : 'happy', armL: t > 6.3 ? 2.4 : .15, armR: t > 6.3 ? 2.4 : .15 } });
      const side = i % 2 ? -1 : 1;
      K.cam(t, [[6.3, [side * .5, 1.3, -1.9], [0, .95, 1.3]], [9, [side * .2, 1.2, -1.4], [0, .95, 1.3]]]);
    },
    overlay(cx, t) { if (t < 6.3) cx.drawImage(K.draw2D(() => tvShow(t, spec, false)), 0, 0); } };
}

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 4. Папа дома!'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия четвёртая: «Папа дома!»']],
    update(t) { kitchen(t, { kettle: 0, bowls: 0 }); K.cast(); K.fov(40); K.cam(t, [[0, [-1.5, 1.8, 3.6], [0, 1, -2]], [5, [1.5, 1.6, 2.2], [0, 1, -1]]], .4); } },

  { name: 'Ужин и экраны', dur: 13,
    cues: [[1, 4.4, 'Мама', 'Ужин готов! Дети, кушайте, пока горячее.'],
      [4.8, 6.4, 'Дилшод', 'Ага…'],
      [6.8, 8.6, 'Томирис', 'Сейчас, мультик…'],
      [9, 13, 'Рассказчик', 'Каша остывала, а дети смотрели в экраны.']],
    update(t) {
      kitchen(t, { tv: true, phone: true }); K.cast(D, T, Ma); K.fov(38);
      K.sit(D, S.D); K.sit(T, S.T); K.place(Ma, 1.5, -.25, -2.3);
      Ma.set({ t, talk: speaking('Мама'), mood: 'happy', armL: t > 1 && t < 4.4 ? 1.0 : .12 });
      D.set({ t, sit: true, talk: speaking('Дилшод'), mood: 'bored', armRx: 1.0, elbowR: 1.3, armLx: .9, elbowL: 1.3, nod: .35, look: [0, -.6] });
      T.set({ t, sit: true, talk: speaking('Томирис'), mood: 'bored', turn: 1.0, look: [-1, 0] });
      if (t < 4.8) shot(t, 'wide', 'kids', 0, 4.8); else if (t < 9) shot(t, 'kids', 'tvkids', 4.8, 9); else K.cam(t, [[9, [0, 1.4, .3], [0, .85, -1.1]], [13, [0, 1.3, -.1], [0, .85, -1.1]]]);
    } },

  { name: 'Папа пришёл', dur: 14,
    cues: [[1.5, 4, 'Папа', 'Всем привет! Я дома!'],
      [4.3, 6, 'Мама', 'Привет, дорогой!'],
      [7, 10, 'Папа', 'Эй, а где мои обнимашки?'],
      [10.5, 14, 'Рассказчик', 'Но дети ничего не заметили…']],
    update(t) {
      kitchen(t, { tv: true, phone: true }); K.cast(D, T, Ma, P); K.fov(38);
      K.sit(D, S.D); K.sit(T, S.T);
      const wP = K.walk(P, [-.6, 4.5], [-.6, 1.4], 0, 2.2, t, Math.PI);
      P.set({ t, walk: wP, talk: speaking('Папа'), mood: t > 10 ? 'sad' : 'happy', armL: t > 1.5 && t < 4 ? 2.4 + Math.sin(t * 6) * .2 : t > 7 && t < 10 ? 1.4 : .12, armR: t > 7 && t < 10 ? 1.4 : .12 });
      const wM = K.walk(Ma, [1.5, -.25], [.3, 1.0], 3, 4.3, t, Math.PI * 1.2);
      Ma.set({ t, walk: wM, talk: speaking('Мама'), mood: 'happy', armR: t > 4.3 && t < 6 ? 1.1 : .12 });
      D.set({ t, sit: true, mood: 'bored', armRx: 1.0, elbowR: 1.3, armLx: .9, elbowL: 1.3, nod: .35, look: [0, -.6] });
      T.set({ t, sit: true, mood: 'bored', turn: 1.0, look: [-1, 0] });
      if (t < 7) K.cam(t, [[0, [.8, 1.5, -.6], [-.6, 1.4, 3]], [7, [.6, 1.5, -.3], [-.6, 1.5, 1.6]]]);
      else if (t < 10.5) shot(t, 'papa', 'papa', 7, 10.5);
      else K.cam(t, [[10.5, [1.3, 1.6, 2.4], [-.2, 1.1, -.6]], [14, [1.0, 1.45, 1.8], [-.2, 1.0, -1.0]]]);
    } },

  { name: 'Чистон в чайнике', dur: 18,
    cues: [[.5, 4.8, 'Чистон', 'Дилшод, Томирис! Папа пришёл, а вы даже не заметили!'],
      [5, 8.5, 'Чистон', 'Во время еды экраны выключаем.'],
      [9, 14, 'Чистон', 'Сидим ровно, едим не спеша. Прожевал, проглотил — потом говори!'],
      [14.3, 18, 'Дети', 'Хорошо, Чистон!']],
    sfx: [[.2, 'power'], [8.6, 'pop']],
    update(t) {
      kitchen(t, { kettle: seg(t, 0, 1), tv: t < 8.6, phone: t < 8.6 }); K.cast(D, T, Ma, P); K.fov(38);
      K.sit(D, S.D); K.sit(T, S.T); K.place(P, -.6, 1.4, Math.PI); K.place(Ma, .3, 1.0, Math.PI * 1.2);
      P.set({ t, mood: 'happy' }); Ma.set({ t, mood: 'happy' });
      D.set(Object.assign({ t, sit: true, mood: t < 5 ? 'wow' : 'happy', turn: t < 8.6 ? .6 : 0 }, t < 8.6 ? { armRx: 1.0, elbowR: 1.3 } : {}));
      T.set({ t, sit: true, mood: t < 5 ? 'wow' : 'happy', turn: t < 8.6 ? .6 : 0, nod: t > 14.3 ? Math.sin(t * 8) * .1 : 0 });
      if (t < 5) shot(t, 'kettle', 'kettle', 0, 5); else if (t < 9) K.cam(t, [[5, ...C.tvkids], [9, ...C.kids]]); else if (t < 14.3) shot(t, 'kettle', 'kettle', 9, 14.3); else shot(t, 'kids');
    } },

  { name: 'Обнимашки', dur: 10,
    cues: [[.5, 2.5, 'Дети', 'Папа!'],
      [3, 6.5, 'Папа', 'Вот теперь я точно дома!'],
      [7, 10, 'Мама', 'Мойте руки — и ужинаем все вместе!']],
    sfx: [[.6, 'boing']],
    update(t) {
      kitchen(t, { kettle: 1 }); K.cast(D, T, Ma, P); K.fov(40);
      const wD = K.walk(D, [-.42, -.6], [-.75, .95], 0, 1.8, t, Math.PI), wT = K.walk(T, [.42, -.6], [-.35, 1.0], .2, 2, t, Math.PI);
      D.root.position.y = T.root.position.y = 0;
      const hug = t > 1.8;
      K.place(P, -.6, 1.4, Math.PI); P.set({ t, talk: speaking('Папа'), mood: 'happy', crouch: hug ? .45 : 0, armLx: hug ? 1.3 : .2, armRx: hug ? 1.3 : .2, elbowL: hug ? 1.3 : .3, elbowR: hug ? 1.3 : .3 });
      D.set({ t, walk: wD, talk: speaking('Дилшод'), mood: 'happy', armLx: hug ? 1.4 : .2, armRx: hug ? 1.4 : .2, elbowL: .6, elbowR: .6 });
      T.set({ t, walk: wT, talk: speaking('Томирис'), mood: 'happy', armL: hug ? 2.4 : .15, armR: hug ? 2.4 : .15 });
      K.place(Ma, 1.4, .2, -2.0); Ma.set({ t, talk: speaking('Мама'), mood: 'happy', armL: t > 7 ? 1.1 : .12 });
      if (t < 3) K.cam(t, [[0, [.3, 1.4, -1.6], [-.5, 1, 1.2]], [3, [.4, 1.3, -.4], [-.6, 1, 1.3]]]);
      else if (t < 7) K.cam(t, [[3, [.6, 1.25, -.2], [-.6, 1.05, 1.3]], [7, [.4, 1.2, 0], [-.6, 1.05, 1.3]]]);
      else K.cam(t, [[7, [-1.6, 1.6, -.6], [.2, 1.1, .9]]]);
    } },

  { name: 'Ужин вместе', dur: 15,
    cues: [[.5, 3, 'Папа', 'Приятного аппетита!'],
      [3.3, 5, 'Дети', 'Спасибо, папа!'],
      [6, 11, 'Рассказчик', 'Все ели не спеша, а разговаривали — только когда прожуют.'],
      [11.4, 15, 'Дилшод', 'Прожевал… Папа, а я сегодня рисовал!']],
    update(t) {
      kitchen(t, { kettle: 1, bowls: 4, spoons: true, food: 1 - seg(t, 3, 14) * .7 }); K.cast(D, T, Ma, P); K.fov(38);
      K.sit(D, S.D); K.sit(T, S.T); K.sit(P, S.P); K.sit(Ma, S.M);
      const cyc = k => Math.max(0, Math.sin((t / 2.4 + k) * Math.PI * 2)), eating = t > 5 && t < 11.2;
      [[D, 'Дилшод', 0], [T, 'Томирис', .4], [P, 'Папа', .7], [Ma, 'Мама', .2]].forEach(([X, n, k]) => X.set(Object.assign({ t, sit: true, talk: speaking(n), mood: 'happy' }, K.eat(X, eating ? cyc(k) : 0), X === D && t > 11.4 ? { turn: -.6 } : {})));
      if (t < 6) shot(t, 'wide', 'wide', 0, 6); else if (t < 11.4) K.cam(t, [[6, [1.8, 1.5, .8], [0, 1.0, -.9]], [11.4, [-1.8, 1.5, .8], [0, 1.0, -.9]]]); else K.cam(t, [[11.4, [.3, 1.2, .2], [-.6, 1.08, -1.2]]]);
    } },

  { name: 'Давай учиться', dur: 12,
    cues: [[.5, 3.5, 'Папа', 'Дилшод, давай учиться!'],
      [3.8, 6, 'Дилшод', 'А что будем учить?'],
      [6.3, 8, 'Томирис', 'И я хочу!'],
      [8.3, 12, 'Папа', 'Сейчас узнаете! Смотрим передачу про домашних животных.']],
    update(t) {
      kitchen(t, { kettle: 1, bowls: 4, food: .2 }); K.cast(D, T, Ma, P); K.fov(38);
      K.sit(D, S.D); K.sit(T, S.T); K.sit(P, S.P); K.sit(Ma, S.M);
      P.set({ t, sit: true, talk: speaking('Папа'), mood: 'happy', armR: t > 8.3 ? 1.3 : .3 }); Ma.set({ t, sit: true, mood: 'happy' });
      D.set({ t, sit: true, talk: speaking('Дилшод'), mood: t > 3.8 ? 'wow' : 'happy', turn: -.7 }); T.set({ t, sit: true, talk: speaking('Томирис'), mood: 'happy', turn: -.5, armR: t > 6.3 && t < 8 ? 2.5 : .15 });
      if (t < 3.8) K.cam(t, [[0, [.2, 1.3, .3], [-1.25, 1.35, -.7]]]); else if (t < 8.3) shot(t, 'kids'); else K.cam(t, [[8.3, [.2, 1.3, .3], [-1.25, 1.35, -.7]], [12, [.6, 1.5, 1.2], [-.6, 1.2, -.8]]]);
    } },

  { name: 'Передача', dur: 6, cues: [[.4, 5.8, 'Ведущий', 'Передача «Мама, папа и малыш»! Кто у кого малыш?']], sfx: [[.2, 'fanfare']],
    update(t) { sofa(t, () => tvShow(t, null, false)); K.fov(40); K.cam(t, [[0, ...SC.over], [6, [.3, 1.4, 2.4], [0, 1.4, -2.9]]]); },
    overlay(cx, t) { if (t > 3) { cx.globalAlpha = seg(t, 3, 3.6); cx.drawImage(K.draw2D(() => tvShow(t, null, false)), 0, 0); cx.globalAlpha = 1; } } },
  animalScene('cat', 'Мама — кошка. Папа — кот. А малыш — котёнок!', 0),
  animalScene('dog', 'Мама — собака. Папа — пёс. А малыш — щенок!', 1),
  animalScene('cow', 'Мама — корова. Папа — бык. А малыш — телёнок!', 2),
  animalScene('horse', 'Мама — лошадь. Папа — конь. А малыш — жеребёнок!', 3),
  animalScene('sheep', 'Мама — овца. Папа — баран. А малыш — ягнёнок!', 4),
  animalScene('chicken', 'Мама — курица. Папа — петух. А малыш — цыплёнок!', 5),

  { name: 'Папины вопросы', dur: 16,
    cues: [[.5, 3.5, 'Папа', 'А как зовут малыша коровы?'],
      [3.8, 5.6, 'Дилшод', 'Телёнок!'],
      [6, 8.8, 'Папа', 'А малыша курицы?'],
      [9.1, 10.8, 'Томирис', 'Цыплёнок!'],
      [11.2, 16, 'Папа', 'Молодцы! Вот это учёба! Я вами горжусь.']],
    sfx: [[5.6, 'ding'], [10.8, 'ding']],
    update(t) {
      sofa(t, null, { P: { turn: -.5, armL: t > 11.2 ? 1.6 : .12, armR: t > 11.2 ? 1.6 : .4 }, D: { turn: .5, armL: t > 3.8 && t < 5.6 ? 2.5 : .15 }, T: { turn: .3, armR: t > 9.1 && t < 10.8 ? 2.5 : .15 } });
      K.fov(40);
      if (t < 3.8 || (t > 6 && t < 9.1)) K.cam(t, [[0, [-.3, 1.3, -.6], [-.7, 1.3, 1.3]]]); else if (t < 6) K.cam(t, [[3.8, [-.1, 1.05, .1], [-.28, 1.0, 1.3]]]); else if (t < 11.2) K.cam(t, [[9.1, [.2, 1.0, .1], [.28, .95, 1.3]]]); else K.cam(t, [[11.2, ...SC.tv], [16, [0, 1.3, -1.4], [0, .9, 1.3]]]);
    } },

  { name: 'Спокойной ночи', dur: 10,
    cues: [[.5, 6, 'Чистон', 'Экран может и учить — если смотреть недолго и вместе с мамой и папой!'],
      [6.5, 9.6, 'Дети', 'Спокойной ночи, Чистон!']],
    sfx: [[.2, 'power']],
    update(t) { sofa(t, null, { D: { armR: t > 6.5 ? 2.4 + Math.sin(t * 6) * .3 : .15 }, T: { armL: t > 6.5 ? 2.4 + Math.sin(t * 6) * .3 : .15 } }); K.env('living', 'evening2'); L.tv.set((g, w, h) => drawToonFace(g, w, h, { t, talk: speaking('Чистон') })); K.fov(40); if (t < 6.5) K.cam(t, [[0, ...SC.over], [6.5, [.4, 1.4, 2.4], [0, 1.4, -2.9]]]); else K.cam(t, [[6.5, ...SC.tv]]); } },

  { name: 'Конец', dur: 6, title: ['Конец', 'четвёртой серии'],
    cues: [[.8, 5.4, 'Рассказчик', 'Конец четвёртой серии. Ужинаем вместе — и учимся вместе!']],
    update(t) { sofa(t, null, { P: { armL: 1.8 }, M: { armR: 1.8 } }); K.fov(40); K.cam(t, [[0, [0, 1.2, -.8], [0, .95, 1.3]], [6, [0, 1.5, -2.2], [0, .95, 1.3]]], .5); } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_4.json' });
