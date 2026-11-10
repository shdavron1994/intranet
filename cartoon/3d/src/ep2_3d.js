// Episode 2 in 3D: «Завтрак».
import * as THREE from 'three';
import { seg, ease, lerp, sneaker, backpack } from './world.js';
import { startEpisode, speaking, checklist } from './eng3d.js';
import { makeKit } from './kit.js';
import { bowl, spoon, phone, drawToonFace } from './sets2.js';

const K = makeKit(['kitchen', 'living', 'street']);
const { D, T, Ma, scene } = K, kit = K.kitchen, S = kit.seats;
const ph = K.holdBoth(D, phone());
const spD = K.hold(D, spoon()), spT = K.hold(T, spoon()); [spD, spT].forEach(s => { s.rotation.set(-1.4, 0, 0); s.position.set(0, -.02, .05); });
const bD = bowl(), bT = bowl(), bD2 = bowl(), bT2 = bowl(); scene.add(bD, bT);
K.hold(Ma, bD2, 0); K.hold(Ma, bT2, 1); [bD2, bT2].forEach(b => b.position.set(0, -.06, .06));
const momPhone = K.hold(Ma, phone(), 0); momPhone.rotation.set(-1.4, 0, 0);
const shoes = [sneaker(), sneaker()], bag = backpack(); shoes.forEach(s => scene.add(s)); scene.add(bag);

const CAM = {
  wide: [[0, 1.6, 3.4], [0, .95, -1.2]], kids: [[0, 1.22, .75], [0, 1.05, -1.45]], dil: [[-.32, 1.15, .1], [-.42, 1.08, -1.45]],
  tom: [[.36, 1.1, .1], [.42, 1.0, -1.45]], kettle: [[.85, 1.2, -1.55], [1.25, 1.1, -2.6]], mom: [[.9, 1.55, .4], [2.4, 1.4, -1.9]]
};
const shot = (t, a, b, t0 = 0, t1 = 6) => K.cam(t, [[t0, ...CAM[a]], [t1, ...CAM[b || a]]]);
function props(o = {}) { ph.visible = !!o.phone; [spD, spT].forEach(s => s.visible = !!o.spoon); bD.visible = bT.visible = !!o.bowls; bD2.visible = bT2.visible = !!o.carry; momPhone.visible = !!o.momPhone; shoes.forEach(s => s.visible = false); bag.visible = false; }
function table(t, o = {}) {
  K.env('kitchen'); K.cast(D, T, Ma); kit.tv.set(null);
  K.sit(D, S.D); K.sit(T, S.T);
  bD.position.set(-.42, .78, -1.05); bT.position.set(.42, .78, -1.05);
  [bD, bT].forEach(b => b.userData.food.scale.setScalar(o.food ?? 1));
  kit.kettle.set({ t, on: o.kettle ?? 0, talk: speaking('Чистон') });
}
function momAt(x, z, ry, pose, t) { K.place(Ma, x, z, ry); Ma.set(Object.assign({ t, talk: speaking('Мама') }, pose)); }
const stir = t => ({ armRx: .9 + Math.sin(t * 4) * .2, elbowR: 1.1, armLx: .6, elbowL: 1 });

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 2. Завтрак'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия вторая: «Завтрак».']],
    update(t) { table(t, { kettle: seg(t, 1, 2.5) }); props(); K.cast(); K.fov(40); K.cam(t, [[0, [-1.5, 1.8, 3.6], [0, 1, -2]], [5, [.4, 1.3, -.6], [1.25, 1.1, -2.6]]], .4); } },

  { name: 'Телефон за столом', dur: 13,
    cues: [[1, 4.6, 'Мама', 'Дилшод, убери телефон. За столом не смотрят.'],
      [5, 8, 'Дилшод', 'Ну мам, ещё одну серию!'],
      [8.4, 11, 'Томирис', 'А я тоже хочу мультики!']],
    update(t) {
      table(t); props({ phone: true }); K.fov(38);
      momAt(2.6, -1.85, t > 1 && t < 4.6 ? -1.9 : Math.PI, t > 1 && t < 4.6 ? { armL: .2 } : stir(t), t);
      D.set({ t, sit: true, talk: speaking('Дилшод'), armRx: 1.0, elbowR: 1.3, armLx: .9, elbowL: 1.3, nod: .35, look: [0, -.6] });
      T.set({ t, sit: true, talk: speaking('Томирис'), turn: t > 8.4 ? -.5 : -.25, look: [-.8, 0], mood: t > 8.4 && t < 11 ? 'wow' : 'happy' });
      if (t < 4.6) K.cam(t, [[0, ...CAM.wide], [4.6, [1.2, 1.45, 1.6], [1.6, 1.2, -1.6]]]);
      else if (t < 8.4) shot(t, 'dil', 'dil', 4.6, 8.4);
      else shot(t, 'tom', 'kids', 8.4, 13);
    } },

  { name: 'Чистон в чайнике', dur: 15,
    cues: [[.6, 4.4, 'Чистон', 'Дилшод, посмотри на себя: глаза красные!'],
      [4.6, 10, 'Чистон', 'Когда долго смотришь в экран, глаза устают. Они чешутся, слезятся и могут хуже видеть вдаль.'],
      [10.2, 12, 'Дилшод', 'А что же делать?'],
      [12.2, 15, 'Чистон', 'Давать глазкам отдых! Давайте гимнастику для глаз — все вместе!']],
    sfx: [[.2, 'power']],
    update(t) {
      table(t, { kettle: seg(t, 0, 1) }); props({ phone: t < 10 }); K.fov(38);
      momAt(2.6, -1.85, Math.PI, stir(t), t);
      const rub = t >= 6.5 && t < 9.5, sc = Math.sin(t * 12) * .15;
      D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод'), turn: .6, mood: t < 6.5 ? 'wow' : 'happy' },
        rub ? { armLx: 2.1 + sc, elbowL: 2.1, armRx: 2.1 - sc, elbowR: 2.1, closed: true } : t < 10 ? { armRx: 1.0, elbowR: 1.3 } : {}));
      T.set({ t, sit: true, turn: .6, mood: t < 4.4 ? 'wow' : 'happy' });
      if (t < 4.4) shot(t, 'kettle', 'kettle', 0, 4.4);
      else if (t < 10.2) K.cam(t, [[4.4, ...CAM.kids], [10.2, ...CAM.dil]]);
      else if (t < 12.2) shot(t, 'dil');
      else K.cam(t, [[12.2, [.4, 1.4, .6], [.6, 1.05, -2]], [15, ...CAM.wide]]);
    } },

  { name: 'Гимнастика для глаз', dur: 25.6,
    cues: [[0, 3.5, 'Чистон', 'Глазки вверх — вниз!'],
      [3.5, 7, 'Чистон', 'Вправо — влево!'],
      [7, 10.5, 'Чистон', 'Поморгай быстро-быстро!'],
      [10.5, 14, 'Чистон', 'А теперь посмотри в окно, вдаль.'],
      [14, 17, 'Чистон', 'А за едой экран выключаем.'],
      [17.2, 20.4, 'Дилшод', 'Мама, возьми телефон. Я потом посмотрю.'],
      [20.6, 23, 'Томирис', 'И я не буду смотреть, пока кушаю!'],
      [23.2, 25.6, 'Мама', 'Спасибо, мои хорошие!']],
    update(t) {
      table(t, { kettle: 1 }); K.fov(38);
      let look = [0, 0], closed = false, nod = 0, turn = 0;
      if (t < 3.5) { look = [0, Math.sin(t * 3)]; nod = -Math.sin(t * 3) * .15; }
      else if (t < 7) { look = [Math.sin(t * 3), 0]; turn = Math.sin(t * 3) * .2; }
      else if (t < 10.5) closed = Math.sin(t * 22) > 0;
      else if (t < 14) { turn = -.5; nod = -.15; look = [-1, .4]; }
      const give = t >= 17.2 && t < 20.4, took = t >= 19.6;
      props({ phone: give && !took, momPhone: took });
      const mk = ease(seg(t, 17.5, 19));
      momAt(lerp(2.6, -.1, mk), lerp(-1.85, -1.75, mk), t < 17.5 ? Math.PI : t < 19 ? -Math.PI / 2 : 0, t < 17.5 ? stir(t) : t < 20 ? { armLx: 1.1, elbowL: .6 } : { armLx: .5, elbowL: 1.3 }, t + (t > 17.5 && t < 19 ? 0 : 0));
      if (t > 17.5 && t < 19) Ma.set({ t, walk: (t - 17.5) * 9 });
      D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод'), look, closed, nod, turn, mood: 'happy' }, give ? { armRx: 1.2, elbowR: .5, turn: .5 } : {}));
      T.set({ t, sit: true, talk: speaking('Томирис'), look, closed, nod, turn, mood: 'happy' });
      if (t < 7) K.cam(t, [[0, ...CAM.kids], [7, [-.1, 1.18, .5], [0, 1.05, -1.45]]]);
      else if (t < 14) K.cam(t, [[7, [.2, 1.15, .4], [0, 1.05, -1.45]], [14, [-.8, 1.4, .8], [-1.6, 1.6, -2.9]]]);
      else if (t < 17.2) shot(t, 'kettle');
      else if (t < 20.6) K.cam(t, [[17.2, [.9, 1.35, .9], [-.2, 1.15, -1.5]], [20.6, ...CAM.kids]]);
      else if (t < 23.2) shot(t, 'tom');
      else shot(t, 'wide');
    } },

  { name: 'Не в то горло', dur: 16,
    cues: [[3, 6, 'Дилшод', 'Мам, а знаешь, вчера в садике…'],
      [8, 11, 'Мама', 'Тише, тише, откашляйся.'],
      [11.6, 13.8, 'Дилшод', 'Кхе… Всё, нормально.'],
      [14, 16, 'Чистон', 'Знаешь, почему так вышло? Смотри!']],
    sfx: [[6.6, 'error']],
    update(t, tr) {
      table(t, { kettle: 1 }); K.fov(38);
      const bring = ease(seg(t, 0, 1.6)), served = t >= 1.8;
      props({ carry: !served, bowls: served, spoon: served && t < 6.6 });
      momAt(lerp(2.4, 1.0, bring), lerp(-1.6, -.45, bring), t < 1.6 ? -1.6 : -2.2, !served ? { armLx: 1.2, elbowL: .8, armRx: 1.2, elbowR: .8 } : t > 8 && t < 11 ? { armRx: 1.3, elbowR: .3, armR: .4 } : {}, t);
      if (t < 1.6) Ma.set({ t, walk: t * 9, armLx: 1.2, elbowL: .8, armRx: 1.2, elbowR: .8 });
      const cough = t >= 6.6 && t < 11.2, shake = cough ? Math.sin(t * 40) * .02 : 0;
      const up = t >= 1.8 && t < 3 ? Math.abs(Math.sin((t - 1.8) * Math.PI * 1.6)) : 0;
      D.root.position.x += shake;
      D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод') || (t >= 6 && t < 6.6), mood: cough ? 'sad' : 'happy', closed: cough && Math.sin(t * 9) > 0, nod: cough ? .25 : 0 },
        t < 6.6 ? K.eat(D, up) : cough ? { armRx: 1.9, elbowR: 2.1 } : {}));
      T.set({ t, sit: true, turn: -.4, mood: cough ? 'wow' : 'happy' });
      if (t < 3) shot(t, 'wide');
      else if (t < 8) K.cam(t, [[3, ...CAM.dil], [8, [-.3, 1.2, .3], [-.42, 1.1, -1.45]]]);
      else if (t < 14) K.cam(t, [[8, [.8, 1.4, .9], [-.2, 1.1, -1.3]], [14, [.6, 1.35, .7], [-.2, 1.1, -1.3]]]);
      else shot(t, 'kettle');
    },
    overlay(cx, t) { if (t >= 6.6 && t < 11.2) { cx.font = '40px Pangolin'; cx.fillStyle = '#fff'; cx.strokeStyle = '#0e3a46'; cx.lineWidth = 6; cx.textAlign = 'center'; cx.strokeText('Кхе-кхе!', 760, 200); cx.fillText('Кхе-кхе!', 760, 200); } } },

  { name: 'Две дорожки', dur: 22,
    cues: [[0, 4, 'Чистон', 'В горле две дорожки: одна для еды, другая для воздуха.'],
      [4.2, 9, 'Чистон', 'Над дорожкой для воздуха есть маленькая дверка. Когда глотаешь, она закрывается.'],
      [9.2, 14, 'Чистон', 'А если говоришь или смеёшься с полным ртом, дверка открыта — и крошка сворачивает не туда!'],
      [14.2, 17.8, 'Чистон', 'Тогда горло кашляет, чтобы её выгнать.'],
      [18, 22, 'Чистон', 'Поэтому: прожевал, проглотил — потом говори!']],
    sfx: [[11.2, 'error'], [14.4, 'boing']],
    update(t) { table(t, { kettle: 1 }); K.cast(); props(); K.cam(t, [[0, ...CAM.kettle]]); },
    overlay(cx, t) { cx.drawImage(K.draw2D(() => throat(t)), 0, 0); } },

  { name: 'Правила завтрака', dur: 16,
    cues: [[0, 4, 'Чистон', 'Правила завтрака: сидим ровно и едим не спеша.'],
      [4.2, 8, 'Чистон', 'Хорошо жуём. Прожевал, проглотил — потом говори!'],
      [9.6, 12.2, 'Дилшод', 'Мам, каша очень вкусная!'],
      [12.4, 14, 'Томирис', 'Очень-очень!'],
      [14.2, 16, 'Мама', 'Я рада!']],
    update(t) {
      table(t, { kettle: 1, food: 1 - seg(t, 0, 14) * .8 }); props({ bowls: true, spoon: true }); K.fov(38);
      momAt(1.5, -.25, -2.3, {}, t);
      const cyc = (t % 2.4) / 2.4, eating = t < 9.4;
      const up = eating ? Math.max(0, Math.sin(cyc * Math.PI * 2)) : 0, up2 = eating ? Math.max(0, Math.sin(cyc * Math.PI * 2 + 1.5)) : 0;
      D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод'), mood: 'happy' }, K.eat(D, up)));
      T.set(Object.assign({ t, sit: true, talk: speaking('Томирис'), mood: 'happy' }, K.eat(T, up2)));
      if (t < 9.6) K.cam(t, [[0, [-.9, 1.35, .9], [-.2, 1.0, -1.45]], [9.6, [.9, 1.35, .9], [.2, 1.0, -1.45]]]);
      else if (t < 14.2) shot(t, 'kids');
      else K.cam(t, [[14.2, [.3, 1.4, -1.25], [1.5, 1.45, -.25]]]);
    },
    overlay(cx, t) { if (t < 9.6) checklist(cx, 'Правила завтрака', ['Сидим ровно', 'Едим не спеша', 'Хорошо жуём', 'Прожевал — потом говори'], Math.min(4, Math.floor(seg(t, .3, 7.5) * 4) + 1), t > 8 ? 4 : 0, 830, 60); } },

  { name: 'Спасибо, мама', dur: 16,
    cues: [[0, 2.6, 'Дилшод', 'Спасибо, мама! Я всё доел.'],
      [2.7, 4.6, 'Томирис', 'И я всё доела!'],
      [7, 9.4, 'Чистон', 'А теперь что?'],
      [9.6, 13, 'Дилшод', 'Помыть руки и прополоскать рот!']],
    sfx: [[15, 'ding']],
    update(t) {
      table(t, { kettle: 1, food: 0 }); K.fov(38);
      momAt(1.5, -.25, -2.3, { mood: 'happy' }, t);
      props({ bowls: true });
      T.set({ t, sit: true, talk: speaking('Томирис'), mood: 'happy', armL: t > 3 ? 2.4 + Math.sin(t * 6) * .3 : .15 });
      if (t < 3) { D.set({ t, sit: true, talk: speaking('Дилшод'), mood: 'happy' }); shot(t, 'kids'); return; }
      // Dilshod gets down and carries his bowl to the counter, then washes his hands
      const w = K.walk(D, [-.42, -.2], [1.75, -2.05], 3.4, 6.4, t, Math.PI);
      D.root.position.y = t < 3.4 ? lerp(S.D.y - .4, 0, seg(t, 3, 3.4)) : 0;
      const wash = t >= 11 && t < 15.6, sc = Math.sin(t * 14) * .2;
      bD.visible = t < 3.4 || t > 6.4; if (t >= 3.4 && t <= 6.4) { bD.visible = true; bD.position.set(D.root.position.x, .62, D.root.position.z + (D.root.rotation.y > 2 ? -.15 : .15)); } else if (t > 6.4) bD.position.set(1.55, .95, -2.5);
      D.set(Object.assign({ t, talk: speaking('Дилшод'), mood: 'happy', walk: w }, wash ? { armLx: 1.3 + sc, elbowL: .9, armRx: 1.3 - sc, elbowR: .9 } : t < 6.4 ? { armLx: 1.1, elbowL: .7, armRx: 1.1, elbowR: .7 } : { turn: t > 7 && t < 9.4 ? -.8 : 0 }));
      if (t < 7) K.cam(t, [[3, ...CAM.wide], [7, [1.2, 1.4, .2], [1.6, .9, -2.2]]]);
      else if (t < 9.6) shot(t, 'kettle');
      else K.cam(t, [[9.6, [1.0, 1.3, -.9], [1.7, .9, -2.2]], [16, [.8, 1.35, -.6], [1.7, .9, -2.2]]]);
    } },

  { name: 'В садик', dur: 20,
    cues: [[.5, 3, 'Кроссовки', 'Мы здесь! Обувайся!'],
      [5, 7.6, 'Мама', 'Молодец! Поехали в садик.'],
      [12, 14.4, 'Дети', 'Пока, Чистон!'],
      [14.6, 18, 'Чистон', 'До завтра, утренний герой!']],
    sfx: [[3.2, 'boing'], [8.4, 'power']],
    update(t) {
      props(); K.fov(40);
      if (t < 8) {
        K.env('living'); K.cast(D, T, K.M); K.living.tv.set(null);
        K.place(D, 3.4, 2.4, Math.PI / 2); K.place(T, 3.2, 3.0, Math.PI / 2);
        D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armL: t > 5 ? 2.5 + Math.sin(t * 6) * .25 : .15, look: t < 3 ? [-.6, -.6] : [0, 0], nod: t < 3 ? .3 : 0 });
        T.set({ t, mood: 'happy', armR: t > 5 ? 2.5 + Math.sin(t * 6 + 1) * .25 : .12 });
        const k = ease(seg(t, 0, 2.4));
        shoes.forEach((s, i) => { s.visible = true; s.position.set(lerp(1 + i * .3, 3.55 + i * .1, k), Math.abs(Math.sin(t * 9 + i)) * .2 * (k < 1), 2.0 - i * .25); s.rotation.y = Math.PI / 2; });
        const bk = seg(t, 3, 4.6); bag.visible = true; bag.position.set(lerp(4.5, 3.3, bk), .3 + Math.sin(Math.PI * bk) * .5 + (bk >= 1 ? .4 : 0), lerp(.9, 2.25, bk)); bag.rotation.y = Math.PI / 2;
        K.place(K.M, lerp(5.6, 4.3, ease(seg(t, 4.4, 5.4))), 2.6, -Math.PI / 2); K.M.set({ t, talk: speaking('Мама'), armL: t > 5.4 ? 1.1 : .12, walk: t > 4.4 && t < 5.4 ? t * 9 : 0 });
        K.living.door.rotation.y = -Math.PI / 2 + seg(t, 4, 4.6) * 1.4;
        K.cam(t, [[0, [.6, 1.1, .6], [3.4, .3, 2.2]], [4, [.2, 1.45, .8], [3.6, .8, 2.4]], [8, [.4, 1.5, 1.4], [3.8, 1.0, 2.5]]]);
        return;
      }
      const s = t - 8; K.env('street'); K.cast();
      const x = s < 2 ? lerp(-14, 0, ease(seg(s, 0, 2))) : s < 10 ? Math.sin(s) * .02 : lerp(0, 18, ease(seg(s, 10, 12)));
      K.car.root.position.set(x, 0, .9); K.car.mirror.visible = false;
      K.car.set({ t, moving: true, dist: s * 6 });
      if (s < 3.6) K.cam(t, [[8, [-6, 1.6, 6], [-2, .8, .9]], [11.6, [2, 1.4, 5.2], [0, .9, .9]]]);
      else K.cam(t, [[11.6, [2, 1.4, 5.2], [0, .9, .9]], [18, [2.6, 1.5, 5.4], [0, .9, .9]], [20, [5, 1.8, 6], [8, .9, .9]]], .6);
    },
    overlay(cx, to) {
      const s = to - 8; if (s < 3.6 || s >= 10.4) return;
      const a = seg(s, 3.6, 4.2) * (1 - seg(s, 9.8, 10.4)); cx.globalAlpha = a;
      cx.fillStyle = '#2d3142'; cx.beginPath(); cx.roundRect(860, 50, 380, 150, 40); cx.fill();
      cx.save(); cx.beginPath(); cx.roundRect(872, 62, 356, 126, 32); cx.clip(); cx.translate(872, 62); drawToonFace(cx, 356, 126, { t: to, talk: speaking('Чистон') }); cx.restore();
      cx.fillStyle = '#fff'; cx.font = '20px Pangolin'; cx.textAlign = 'center'; cx.fillText('зеркало заднего вида', 1050, 222); cx.globalAlpha = 1;
    } },

  { name: 'Конец', dur: 7, title: ['Конец', 'второй серии'],
    cues: [[.8, 5.6, 'Рассказчик', 'Конец второй серии. Дилшод и Томирис — настоящие утренние герои!']],
    update(t) { table(t, { kettle: 1, food: 0 }); K.cast(D, T); props({ bowls: true }); D.set({ t, sit: true, mood: 'happy', armL: 2.4 + Math.sin(t * 5) * .3 }); T.set({ t, sit: true, mood: 'happy', armR: 2.4 + Math.sin(t * 5 + 1) * .3 }); K.cam(t, [[0, ...CAM.kids], [7, ...CAM.wide]], .5); } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_2.json' });
