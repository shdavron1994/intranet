/* ---------- episode 7: Спокойной ночи ---------- */
const PJD = { pajama: true, shirt: '#9fc3ff', pants: '#9fc3ff' };
function book(x, y, open) { box(x - 40, y - 28, 80, 56, 6, '#ff7aa2'); if (open) { box(x - 38, y - 26, 37, 52, 4, '#ffffff'); box(x + 1, y - 26, 37, 52, 4, '#ffffff'); circ(x - 20, y + 2, 9, '#f4a259'); circ(x - 25, y - 6, 4, '#f4a259'); circ(x - 15, y - 6, 4, '#f4a259'); line(x + 8, y - 10, x + 30, y - 10, '#c9d4de', 3); line(x + 8, y, x + 30, y, '#c9d4de', 3); line(x + 8, y + 10, x + 26, y + 10, '#c9d4de', 3); } }

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия седьмая: «Спокойной ночи».']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 7. Спокойной ночи', 'мультфильм-прототип'); } },

  { name: 'Вечер', dur: 15,
    cues: [[1, 4.2, 'Мама', 'Дети, уже вечер. Пора готовиться ко сну!'],
      [4.6, 6.6, 'Дети', 'Ещё чуть-чуть!'],
      [7.4, 15, 'Чистон', 'Перед сном экраны выключаем. От яркого экрана сон убегает, и утром трудно проснуться.']],
    sfx: [[7, 'power']],
    draw(t) {
      livingRoom({ tv: t < 7 ? 'on' : 'chiston', talk: speaking('Чистон'), sky: 1, clock: 8, t });
      box(482, 92, 276, 196, 6, '#1d2b5a'); circ(700, 140, 22, '#fff4c2'); line(620, 92, 620, 288, '#ffffff', 8);
      night(.18);
      sofaBack();
      kid(920, 640, 1, { t, hold: t < 12 ? 'phone' : null, handR: t < 12 ? [30, -150] : null, glow: '#7fe3ff', look: t < 7 ? [0, .7] : [-1, -.3], mood: t > 7 ? 'wow' : 'happy' });
      tomiris(1070, 650, 1, { t, look: [-1, -.3], mood: t > 7 ? 'wow' : 'happy' });
      sofaFront();
      mom(560, 702, .95, { t, talk: speaking('Мама'), mood: 'happy' });
    } },

  { name: 'Купание', dur: 14,
    cues: [[.5, 3, 'Чистон', 'А теперь — купаться!'],
      [3.5, 8, 'Песня', 'Буль-буль, пузыри — чистые щёчки, посмотри!'],
      [8.6, 10.6, 'Томирис', 'Уточка плывёт!'],
      [11, 14, 'Дилшод', 'А у меня пузырь — как шарик!']],
    draw(t) {
      bathroom(); chiston(640, 215, 1, { talk: speaking('Чистон'), t });
      bathtub(t);
      kid(250, 660, 1, { t, talk: speaking('Дилшод'), shirt: SKIN, pants: SKIN, mood: 'happy', armL: 2.6 + Math.sin(t * 5) * .3 });
      tomiris(440, 670, 1, { t, shirt: SKIN, pants: SKIN, mood: 'happy', armR: 2.5 + Math.sin(t * 5 + 1) * .3 });
      box(100, 520, 480, 130, 46, '#ffffff'); ell(340, 522, 230, 16, '#9ad7f0');
      bubblesOn(340, 500, 420, t);
      duck(lerp(160, 480, (Math.sin(t * .8) + 1) / 2), 494, .9, t);
      if (t > 11) { const r = 20 + seg(t, 11, 13) * 30; ctx.beginPath(); ctx.arc(250, 330 - seg(t, 11, 14) * 80, r, 0, TAU); ctx.fillStyle = 'rgba(200,240,255,.5)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.stroke(); }
      sink();
    } },

  { name: 'Пижамы и зубки', dur: 12,
    cues: [[1, 5, 'Песня', 'Щёткой вверх и щёткой вниз — каждый зубик, улыбнись!'],
      [6, 11.6, 'Чистон', 'Чистые зубки на ночь — и сон будет сладким!']],
    sfx: [[5.6, 'ding']],
    draw(t) {
      bathroom(); chiston(640, 215, 1, { talk: speaking('Чистон'), t });
      const brush = t < 5.6, sc = Math.sin(t * 22) * 6;
      kid(DXS, SY, 1.1, Object.assign({}, PJD, { t, mood: 'happy', hold: 'brush' }, brush ? { handR: [26 + sc, -214], brushTo: [-6 + sc, -234] } : { armR: .35 }));
      tomiris(TXS, TYS, TSC, Object.assign({ t, shirt: TPJ, mood: 'happy', hold: 'brush' }, brush ? { handR: [24 + sc, -214], brushTo: [-6 + sc, -234] } : { armR: .35 }));
      sink();
    } },

  { name: 'Сказка на ночь', dur: 22,
    cues: [[1, 6, 'Папа', 'Жили-были кошка, кот и маленький котёнок…'],
      [6.5, 11, 'Папа', 'Котёнок умылся, почистил зубки — и сладко уснул.'],
      [11.5, 13.5, 'Томирис', 'Как я…'],
      [14, 16, 'Дилшод', 'Спокойной ночи, папа…'],
      [16.5, 20.5, 'Мама', 'Спокойной ночи, мои хорошие!']],
    draw(t) {
      bedroom({ door: t > 16 ? .4 : 0, t });
      nightWindow(t);
      night(.3 + seg(t, 19, 22) * .25);
      const sleepy = t > 13;
      sleepyHead(95, 352, t, false, t < 14); sleepyHead(385, 354, t + 1.3, true, t < 11.5);
      chairBack(640);
      const p = papa(640, 700, .85, { t, talk: speaking('Папа'), jacket: false, handL: [-30, -230], handR: [30, -230] });
      book((p.hl[0] + p.hr[0]) / 2, p.hl[1] - 10, true);
      if (t > 16) mom(1170, 702, .95, { t, talk: speaking('Мама'), mood: 'happy', armL: 2.4 });
      if (sleepy) { ctx.globalAlpha = .6; txt('z', 140, 280 - (t % 2) * 20, 26, '#cfd8ff'); ctx.globalAlpha = 1; }
    } },

  { name: 'Звёздочка', dur: 13,
    cues: [[.5, 5.6, 'Чистон', 'Сегодня вы сами выключили экраны и легли вовремя.'],
      [6, 13, 'Чистон', 'За это — ещё одна звёздочка! Спокойной ночи, утренние герои!']],
    sfx: [[7.4, 'ding']],
    draw(t) {
      bedroom({ mirrorOn: 1, mirrorTalk: speaking('Чистон'), t });
      nightWindow(t);
      night(.5);
      miniChiston(300, 170, .48, 1, { talk: speaking('Чистон'), t });
      sleepyHead(95, 352, t, false); sleepyHead(385, 354, t + 1.3, true);
      if (t > 7) { const k = ease(seg(t, 7, 8.4)); starChart(640, 360, 1.6 * k + .01, 3, seg(t, 7.4, 8.2), t); }
    } },

  { name: 'Сура Ясин', dur: 28, quiet: true, cues: [], clip: { file: 'audio/yasin.mp3', at: 1.4 },
    draw(t) {
      bedroom({ t });
      nightWindow(t);
      night(.55);
      sleepyHead(95, 352, t, false); sleepyHead(385, 354, t + 1.3, true);
      for (let i = 0; i < 14; i++) { const sx = 60 + (i * 97) % 1160, sy = 60 + (i * 61) % 260; ctx.globalAlpha = .35 + .35 * Math.sin(t * 1.2 + i); star(sx, sy, 6, 2.5, '#fff4c2'); ctx.globalAlpha = 1; }
      const a = seg(t, .3, 1.4) * (1 - seg(t, 26.6, 28));
      ctx.globalAlpha = a;
      box(390, 470, 500, 140, 30, 'rgba(10,20,50,.72)');
      txt('Сура «Ясин»', 640, 515, 44, '#ffd23f');
      txt('аяты 1–4 · читает Мишари Рашид аль-Афаси', 640, 570, 24, '#cfd8ff');
      ctx.globalAlpha = 1;
    } },

  { name: 'Конец', dur: 6, quiet: true,
    cues: [[.8, 5.4, 'Рассказчик', 'Конец седьмой серии. Сладких снов!']],
    draw(t) { titleCard(t, 'Конец', 'седьмой серии', 'Экраны спят — и мы спим'); } }
];
