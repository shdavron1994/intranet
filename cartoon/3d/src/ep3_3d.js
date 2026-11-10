// Episode 3 in 3D: «Пойдём гулять!».
import * as THREE from 'three';
import { seg, ease, lerp, rbox } from './world.js';
import { startEpisode, speaking } from './eng3d.js';
import { makeKit } from './kit.js';
import { phone, ball, drawToonFace } from './sets2.js';
import { foam } from './sets.js';

const K = makeKit(['living', 'yard', 'bathroom', 'friends']);
const { D, T, M, Boy, Girl, scene } = K, L = K.living, Y = K.yard;
const ph = K.holdBoth(D, phone());
const remote = K.hold(T, rbox(.04, .14, .02, '#2d3142', .01)); remote.rotation.set(-1.3, 0, 0);
const bl = ball(); scene.add(bl);
const foams = [foam(), foam()]; K.hold(D, foams[0]); K.hold(T, foams[1]);
const SOFA = { D: { x: -.55, z: 1.3, ry: Math.PI, y: .55 }, T: { x: .55, z: 1.3, ry: Math.PI, y: .55 } };

function cartoon(g, w, h, t) {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7fd3ff'); gr.addColorStop(.6, '#c9f0ff'); gr.addColorStop(.6, '#5fbf6a'); gr.addColorStop(1, '#4caf62'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const bx = w / 2 + Math.sin(t * 3) * 200, by = h * .55 - Math.abs(Math.sin(t * 6)) * 120;
  g.fillStyle = '#ff5a5f'; g.beginPath(); g.arc(bx, by, 50, 0, 7); g.fill(); g.fillStyle = '#fff'; [[-16, -12], [16, -12]].forEach(([x, y]) => { g.beginPath(); g.arc(bx + x, by + y, 9, 0, 7); g.fill(); });
  g.fillStyle = '#ffe066'; g.beginPath(); g.arc(560, 60, 34, 0, 7); g.fill();
}
const tvFace = t => (g, w, h) => drawToonFace(g, w, h, { t, talk: speaking('Чистон') });
function home(t, tv) { K.env('living'); L.tv.set(tv); L.door.rotation.y = -Math.PI / 2; bl.visible = false; foams.forEach(f => f.visible = false); }
function couch(t, o = {}) {
  K.cast(D, T); K.sit(D, SOFA.D); K.sit(T, SOFA.T); ph.visible = o.phone !== false; remote.visible = o.phone !== false;
  D.set(Object.assign({ t, sit: true, talk: speaking('Дилшод'), swingLegs: 1 }, o.phone !== false ? { armRx: 1.0, elbowR: 1.3, armLx: .9, elbowL: 1.3, nod: .35, look: [0, -.6] } : {}, o.d));
  T.set(Object.assign({ t, sit: true, talk: speaking('Томирис'), swingLegs: 1 }, o.phone !== false ? { armRx: .8, elbowR: 1.0 } : {}, o.t));
}
const C = { tv: [[0, 1.25, -2.2], [0, .9, 1.3]], over: [[1.0, 1.45, 3.4], [0, 1.25, -2.9]], wide: [[3.6, 1.9, -1.8], [0, .8, 1.4]], kids: [[0, 1.05, -.2], [0, .95, 1.3]] };
const shot = (t, a, b, t0 = 0, t1 = 8) => K.cam(t, [[t0, ...C[a]], [t1, ...C[b || a]]]);

const SCENES = [
  { name: 'Заставка', dur: 5, title: ['Чистон', 'Серия 3. Пойдём гулять!'],
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия третья: «Пойдём гулять!»']],
    update(t) { K.env('yard'); K.cast(Boy, Girl); bl.visible = true; K.place(Boy, -1, 0, .9); K.place(Girl, 1.4, .4, -1.2); Boy.set({ t, mood: 'happy', armL: 2 }); Girl.set({ t, mood: 'happy', armR: 2 }); const k = (t * .8) % 1; bl.position.set(lerp(-.7, 1.1, k), .3 + Math.sin(Math.PI * k) * 1.2, lerp(.1, .4, k)); Y.swing.rotation.x = Math.sin(t * 2) * .4; K.fov(40); K.cam(t, [[0, [-4, 1.4, 6], [0, 1, -1]], [5, [3, 2.2, 5], [0, 1, -1]]], .4); } },

  { name: 'Дома после садика', dur: 12,
    cues: [[1.2, 4.6, 'Мама', 'Ну вот мы и дома! Разувайтесь и мойте руки.'],
      [4.9, 7, 'Дети', 'Хорошо, мама!'],
      [7.6, 11.6, 'Рассказчик', 'Дети помыли руки… а потом…']],
    update(t) {
      home(t, null); K.cast(D, T, M); ph.visible = remote.visible = false;
      L.door.rotation.y = -Math.PI / 2 + seg(t, 0, .8) * 1.4 * (1 - seg(t, 10, 11));
      const wD = K.walk(D, [5.6, 2.6], [3.6, 2.2], .4, 2.4, t, -Math.PI / 2 + .3), wT = K.walk(T, [5.8, 3.0], [3.7, 3.0], .8, 2.8, t, -Math.PI / 2 - .3), wM = K.walk(M, [5.8, 2.4], [4.2, 3.6], 1.2, 3.2, t, -Math.PI / 2 - .5);
      D.set({ t, walk: wD, talk: speaking('Дилшод'), mood: 'happy' }); T.set({ t, walk: wT, talk: speaking('Томирис'), mood: 'happy' }); M.set({ t, walk: wM, talk: speaking('Мама'), armL: t > 3.2 && t < 4.6 ? 1.1 : .12 });
      if (t > 7.6) { const w2 = K.walk(D, [3.6, 2.2], [-.6, 1.0], 8, 11, t), w3 = K.walk(T, [3.7, 3.0], [.4, 1.0], 8.2, 11.2, t); D.set({ t, walk: w2, mood: 'happy' }); T.set({ t, walk: w3, mood: 'happy' }); }
      K.fov(40); K.cam(t, [[0, [1.2, 1.5, -.6], [4.6, 1, 2.6]], [7.6, [1.6, 1.45, -.2], [3.9, 1, 2.8]], [12, [2.4, 1.7, -1.5], [.6, .9, 1.4]]]);
    } },

  { name: 'Телефон и телевизор', dur: 14,
    cues: [[.5, 5, 'Рассказчик', 'Дилшод взял телефон, а Томирис включила телевизор.'],
      [6, 10.5, 'Рассказчик', 'Прошёл час… потом ещё один…'],
      [11, 13.8, 'Дилшод', 'Ещё один уровень…']],
    update(t) {
      home(t, (g, w, h) => cartoon(g, w, h, t)); couch(t, { d: { mood: t > 6 ? 'bored' : 'happy' }, t: { mood: t > 6 ? 'bored' : 'wow' } });
      if (t < 6) shot(t, 'over', 'over', 0, 6); else if (t < 11) shot(t, 'tv', 'kids', 6, 11); else K.cam(t, [[11, [-.4, 1.05, .2], [-.55, 1.0, 1.3]]]);
    },
    overlay(cx, t) { if (t > 6 && t < 10.8) { const n = t < 8.2 ? 1 : 2, a = seg(t, 6, 6.4); cx.globalAlpha = a; cx.fillStyle = 'rgba(14,58,70,.88)'; cx.beginPath(); cx.roundRect(980, 40, 260, 90, 20); cx.fill(); cx.fillStyle = '#ffd23f'; cx.font = '44px Pangolin'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(`+${n} ${n === 1 ? 'час' : 'часа'}`, 1110, 86); cx.globalAlpha = 1; } } },

  { name: 'Чистон в телевизоре', dur: 22,
    cues: [[1, 5, 'Чистон', 'Стоп-стоп-стоп! Дилшод, Томирис, вы уже два часа смотрите в экраны!'],
      [5.2, 9.5, 'Чистон', 'Глазки устали, спинка устала, а ножки совсем заскучали.'],
      [9.8, 12, 'Дилшод', 'Но мне интересно!'],
      [12.2, 14, 'Томирис', 'А мне мультик!'],
      [14.3, 18.5, 'Чистон', 'Экран — как конфета: немножко можно, а много — вредно.'],
      [18.7, 22, 'Чистон', 'Посмотрите-ка в окно. Кто там играет?']],
    sfx: [[.5, 'power']],
    update(t) {
      home(t, t < .5 ? (g, w, h) => cartoon(g, w, h, t) : tvFace(t));
      const back = t > 19.5;
      couch(t, { phone: t < 9.8 || (t > 9.8 && t < 14.3), d: { mood: t < 5 ? 'wow' : 'happy', turn: back ? Math.PI * .6 : 0, nod: back ? 0 : undefined }, t: { mood: t < 5 ? 'wow' : 'happy', turn: back ? -Math.PI * .6 : 0 } });
      if (t < 5.2) K.cam(t, [[0, ...C.over], [5.2, [.4, 1.3, 1.6], [0, 1.4, -2.9]]]);
      else if (t < 9.8) shot(t, 'tv', 'kids', 5.2, 9.8);
      else if (t < 14.3) K.cam(t, [[9.8, [-.3, 1.05, .3], [-.3, .95, 1.3]], [14.3, [.4, 1.05, .3], [.4, .95, 1.3]]]);
      else if (t < 18.7) K.cam(t, [[14.3, [0, 1.45, -.5], [0, 1.45, -2.9]], [18.7, [0, 1.45, -1.6], [0, 1.45, -2.9]]]);
      else shot(t, 'tv', 'tv', 18.7, 22);
    } },

  { name: 'За окном', dur: 10.5,
    cues: [[1, 4, 'Дилшод', 'Ой, там ребята в мяч играют!'],
      [4.3, 6.6, 'Томирис', 'И качели!'],
      [7, 10.5, 'Дети', 'Пойдём гулять!']],
    update(t) {
      if (t < 6.6) {
        K.env('yard'); K.cast(Boy, Girl); bl.visible = true; ph.visible = remote.visible = false;
        const sw = Math.sin(t * 2.2) * .5; Y.swing.rotation.x = sw;
        K.place(Girl, -2.5, -1.5 + Math.sin(sw) * 1.7, 0, 2.2 - Math.cos(sw) * 1.7 - .36 * .9 + .03); Girl.root.rotation.x = sw; Girl.set({ t, sit: true, mood: 'happy', armL: 2.6, armR: 2.6, elbowL: .2, elbowR: .2 });
        K.place(Boy, .5, 1, -.6); Boy.set({ t, mood: 'happy', armL: 1.5 + Math.sin(t * 5) * .3, armR: 1.5 - Math.sin(t * 5) * .3, jump: Math.abs(Math.sin(t * 5)) * .08 });
        bl.position.set(.2 + Math.sin(t * 2) * .6, .2 + Math.abs(Math.sin(t * 5)) * 1.0, 1.6);
        K.fov(40); if (t < 4.3) K.cam(t, [[0, [2, 2.5, 7], [0, 1, 0]], [4.3, [1.5, 2, 5.5], [0, .9, 0]]]); else K.cam(t, [[4.3, [0, 1.8, 3], [-2.5, 1, -1.5]], [6.6, [-.5, 1.6, 2.5], [-2.5, 1, -1.5]]]);
        return;
      }
      Girl.root.rotation.x = 0; home(t, null); K.cast(D, T); ph.visible = remote.visible = false;
      K.place(D, -.35, 4.3, Math.PI - .2); K.place(T, .35, 4.3, Math.PI + .2);
      D.set({ t, talk: speaking('Дилшод'), mood: 'wow', armL: 2.6, armR: 2.6, jump: Math.abs(Math.sin(t * 7)) * .06 }); T.set({ t, talk: speaking('Томирис'), mood: 'wow', armL: 2.6, armR: 2.6, jump: Math.abs(Math.sin(t * 7 + 1)) * .06 });
      K.cam(t, [[6.6, [0, 1.2, 2.4], [0, .95, 4.3]], [10.5, [0, 1.15, 2.9], [0, .95, 4.3]]]);
    } },

  { name: 'Экраны отдыхают', dur: 14,
    cues: [[1, 5, 'Чистон', 'Молодцы! Экраны отдыхают — и вы тоже!'],
      [6.5, 8.5, 'Мама', 'Куда собрались?'],
      [8.7, 11, 'Дети', 'Гулять, мама! Можно?'],
      [11.2, 14, 'Мама', 'Конечно! Одевайтесь, я пойду с вами.']],
    sfx: [[.6, 'pop'], [4.8, 'pop']],
    update(t) {
      home(t, t < 4.8 ? tvFace(t) : null); K.cast(D, T, M); ph.visible = remote.visible = false;
      K.place(D, -.5, .4, 0); K.place(T, .4, .4, 0);
      const wM = K.walk(M, [5.6, 2.6], [2.0, 1.0], 5.4, 7, t, -Math.PI / 2 - .4);
      L.door.rotation.y = -Math.PI / 2 + seg(t, 5, 5.6) * 1.4;
      const toMom = t > 6.5 ? Math.PI / 2 : 0;
      D.root.rotation.y = toMom; T.root.rotation.y = toMom;
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armL: t < 5 ? 2.5 + Math.sin(t * 6) * .3 : .15 }); T.set({ t, talk: speaking('Томирис'), mood: 'happy', armR: t < 5 ? 2.5 + Math.sin(t * 6) * .3 : .15 });
      M.set({ t, walk: wM, talk: speaking('Мама'), mood: 'happy', armR: t > 11.2 ? 1.1 : .12 });
      if (t < 6.5) K.cam(t, [[0, [0, 1.3, -2.0], [0, .95, .4]], [6.5, [0, 1.3, -1.4], [0, 1.0, .4]]]);
      else K.cam(t, [[6.5, [-1.3, 1.45, -1.3], [1.2, 1.05, .8]], [14, [-1.6, 1.5, -1.0], [1.0, 1.05, .8]]]);
    } },

  { name: 'Во дворе', dur: 26,
    cues: [[.5, 4, 'Рассказчик', 'И вот они во дворе!'],
      [4.5, 6.5, 'Дилшод', 'Лови мяч!'],
      [7, 9.5, 'Мальчик', 'Поймал! Давай ещё!'],
      [10, 12.5, 'Томирис', 'Мама, выше! Выше!'],
      [12.8, 15, 'Мама', 'Держись крепче, доченька!'],
      [15.5, 18, 'Девочка', 'Томирис, пойдём на горку!'],
      [18.3, 20, 'Томирис', 'Пойдём!'],
      [20.5, 26, 'Рассказчик', 'Дети бегали, прыгали, смеялись — и совсем забыли про экраны.']],
    sfx: [[5, 'boing'], [8, 'boing']],
    update(t) {
      K.env('yard'); K.cast(D, T, M, Boy, Girl); bl.visible = true; ph.visible = remote.visible = false; K.fov(40);
      // ball game between Dilshod and the neighbour boy
      K.place(D, -.2, 1.6, Math.PI / 2 - .2); K.place(Boy, 2.6, 1.4, -Math.PI / 2 + .2);
      const throwK = (t % 3) / 3, from = Math.floor(t / 3) % 2 ? [2.4, 1.4] : [0, 1.6], to = Math.floor(t / 3) % 2 ? [0, 1.6] : [2.4, 1.4];
      bl.position.set(lerp(from[0], to[0], throwK), .8 + Math.sin(Math.PI * throwK) * 1.3, lerp(from[1], to[1], throwK));
      const catchD = Math.floor(t / 3) % 2 && throwK > .7, catchB = !(Math.floor(t / 3) % 2) && throwK > .7;
      D.set({ t, talk: speaking('Дилшод'), mood: 'happy', armLx: catchD || throwK < .2 ? 1.3 : .3, armRx: catchD || throwK < .2 ? 1.3 : .3, elbowL: .4, elbowR: .4, jump: Math.abs(Math.sin(t * 4)) * .03 });
      Boy.set({ t, talk: speaking('Мальчик'), mood: 'happy', armLx: catchB || throwK < .2 ? 1.3 : .3, armRx: catchB || throwK < .2 ? 1.3 : .3, elbowL: .4, elbowR: .4 });
      // Tomiris on the swing, then off to the slide with the girl
      const onSwing = t < 15.5, sw = onSwing ? Math.sin(t * 2.2) * lerp(.25, .55, seg(t, 10, 13)) : 0; Y.swing.rotation.x = sw;
      if (onSwing) { K.place(T, -2.5, -1.5 + Math.sin(sw) * 1.7, 0, 2.2 - Math.cos(sw) * 1.7 - .344 + .03); T.root.rotation.x = sw; T.set({ t, sit: true, talk: speaking('Томирис'), mood: 'happy', armL: 2.6, armR: 2.6, elbowL: .2, elbowR: .2 }); }
      else { T.root.rotation.x = 0; T.root.position.y = 0; const w = K.walk(T, [-2.5, -.9], [2.3, -.9], 18.3, 22, t, Math.PI / 2); T.set({ t, walk: w, talk: speaking('Томирис'), mood: 'happy' }); }
      K.place(M, -2.5, .3, Math.PI); M.set({ t, talk: speaking('Мама'), mood: 'happy', armLx: onSwing ? 1.2 + Math.max(0, -Math.sin(t * 2.2)) * .4 : .2, armRx: onSwing ? 1.2 + Math.max(0, -Math.sin(t * 2.2)) * .4 : .2, elbowL: .3, elbowR: .3 });
      const wG = K.walk(Girl, [1.8, -4], [-1.6, -.9], 13, 15.5, t, -Math.PI / 2); if (t > 18.3) { const w2 = K.walk(Girl, [-1.6, -.9], [2.9, -.9], 18.3, 22, t, Math.PI / 2); Girl.set({ t, walk: w2, mood: 'happy' }); } else Girl.set({ t, walk: wG, talk: speaking('Девочка'), mood: 'happy', armR: t > 15.5 ? 1.4 : .12 });
      if (t > 22) { [T, Girl].forEach((P, i) => { const k = ((t - 22 + i * .9) % 1.8) / 1.8; P.root.position.set(2.8, lerp(1.45, 0, k), lerp(-2.5, -.6, k)); P.root.rotation.y = 0; P.root.rotation.x = 0; P.set({ t, sit: true, mood: 'wow', armL: 2.3, armR: 2.3 }); }); }
      if (t < 4.5) K.cam(t, [[0, [0, 3, 9], [0, 1, -1]], [4.5, [1, 2, 6], [1, 1, 1]]]);
      else if (t < 10) K.cam(t, [[4.5, [1.2, 1.4, 4.4], [1.2, 1.1, 1.5]], [10, [1.4, 1.5, 4.6], [1.2, 1.1, 1.5]]]);
      else if (t < 15.5) K.cam(t, [[10, [-1.2, 1.5, 2.5], [-2.5, 1, -1.5]], [15.5, [-.6, 1.6, 2.8], [-2.3, 1, -1.2]]]);
      else if (t < 20.5) K.cam(t, [[15.5, [-.2, 1.4, 2.2], [-1.8, .9, -.9]], [20.5, [1.5, 1.6, 2.6], [1.8, .9, -1]]]);
      else K.cam(t, [[20.5, [5.5, 2.4, 4], [1.5, 1, -1.2]], [26, [-3, 3, 7], [1, 1, -1]]]);
    } },

  { name: 'Домой', dur: 13,
    cues: [[1, 3.5, 'Томирис', 'Сегодня было так весело!'],
      [3.8, 6.5, 'Дилшод', 'Мама, давай завтра опять гулять!'],
      [7, 13, 'Мама', 'Обязательно! Я так рада, что вы играли с ребятами, а не сидели в телефоне.']],
    update(t) {
      K.env('yard', 'evening'); K.cast(D, T, M); bl.visible = false; Y.swing.rotation.x = 0; K.fov(38);
      const z = lerp(3.5, -3.5, t / 13);
      K.place(M, 0, z, Math.PI); K.place(D, -.7, z + .1, Math.PI); K.place(T, .65, z + .1, Math.PI);
      [D, T, M].forEach((P, i) => P.set({ t, walk: t * 7 + i, talk: speaking(['Дилшод', 'Томирис', 'Мама'][i]), mood: 'happy', armL: P === T ? .5 : P === M ? .6 : .12, armR: P === D ? .5 : P === M ? .6 : .12, turn: speaking(['Дилшод', 'Томирис', 'Мама'][i]) ? (P === M ? .4 : P === D ? -.4 : .5) : 0 }));
      K.cam(t, [[0, [0, 1.3, z - 3], [0, .95, z]], [13, [.6, 1.4, z - 3.3], [0, 1, z]]]);
    } },

  { name: 'Моем руки', dur: 13,
    cues: [[0, 3.6, 'Чистон', 'Нагулялись? Теперь — мыть руки с мылом!'],
      [4, 9.4, 'Чистон', 'Запомните: мультики — немножко, а играть, бегать и дружить — много-много!'],
      [9.8, 12.6, 'Дети', 'Запомнили!']],
    sfx: [[9.8, 'fanfare']],
    update(t) {
      K.env('bathroom'); K.cast(D, T); bl.visible = false; K.bathroom.water.visible = t > .5 && t < 9; K.bathroom.mirror.set({ t, on: 1, talk: speaking('Чистон') });
      K.place(D, -.32, -2.02, Math.PI); K.place(T, .42, -2.06, Math.PI, .18);
      const wash = t > .8 && t < 9.4, sc = Math.sin(t * 14) * .2, cheer = t > 9.8;
      foams.forEach(f => { f.visible = wash; f.userData.update(t, seg(t, .8, 1.5) * (1 - seg(t, 8.6, 9.4))); });
      const pose = wash ? { armLx: 1.3 + sc, elbowL: .9, armRx: 1.3 - sc, elbowR: .9 } : cheer ? { armL: 2.6, armR: 2.6, elbowL: .2, elbowR: .2 } : {};
      D.set(Object.assign({ t, talk: speaking('Дилшод'), mood: 'happy', nod: wash ? .3 : 0 }, pose)); T.set(Object.assign({ t: t + 1.3, talk: speaking('Томирис'), mood: 'happy', nod: wash ? .3 : 0 }, pose));
      if (t < 4) { K.fov(40); K.cam(t, [[0, [1.6, 1.6, 1.2], [0, 1.4, -2.6]]]); }
      else if (t < 9.8) { K.fov(40); K.cam(t, [[4, [.2, 1.85, -1.2], [0, 1.85, -2.94]], [9.8, [.1, 1.8, -1.6], [0, 1.8, -2.94]]]); }
      else { K.fov(62); K.cam(t, [[9.8, [.05, 1.36, -2.86], [.05, .98, -1.95]]]); }
    } },

  { name: 'Конец', dur: 6, title: ['Конец', 'третьей серии'],
    cues: [[.8, 5.4, 'Рассказчик', 'Конец третьей серии. Играйте и дружите!']],
    update(t) { K.env('yard'); K.cast(D, T, Boy, Girl); K.fov(40); bl.visible = true; Y.swing.rotation.x = 0; [[D, -1.2], [T, -.4], [Girl, .4], [Boy, 1.2]].forEach(([P, x], i) => { P.root.rotation.x = 0; K.place(P, x, 1.5, 0); P.set({ t: t + i, mood: 'happy', armL: 2.5, armR: 2.5, jump: Math.abs(Math.sin(t * 5 + i)) * .1 }); }); bl.position.set(0, .13, 2.2); K.cam(t, [[0, [0, 1.3, 5], [0, 1, 1.5]], [6, [0, 2.2, 8], [0, 1, 1.5]]], .5); } }
];

startEpisode(SCENES, { scene, cam: K.camObj, renderer: K.renderer, gl: K.gl, warpUrl: './warp3d_3.json' });
