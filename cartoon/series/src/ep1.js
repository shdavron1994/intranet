/* ---------- episode 1: Вещи сбежали ---------- */
const PJ = '#9fc3ff';
const MESS = { sock: [700, 112, .15], sock2: [420, 700, 1.4], car1: [770, 690, 0], car2: [350, 706, 0], sneakA: [585, 696, 0], sneakB: [990, 664, 0],
  back: [455, 610, 0], pixel: [520, 706, 0], shirt: [880, 688, .3], pants: [1070, 690, -.2] };
const PLACE = { sock: [1020, 452, 0], sock2: [1020, 452, 0], car1: [785, 600, 0], car2: [785, 600, 0], sneakA: [1190, 702, 0], sneakB: [1248, 706, 0],
  back: [1120, 336, 0], pixel: [1060, 410, 0], shirt: [190, 372, 0], pants: [240, 372, 0] };
const HIDE_AT_PLACE = { sock: 1, sock2: 1, car1: 1, car2: 1 };
const RUNNERS = ['pixel', 'sneakA', 'sneakB', 'sock', 'sock2', 'car1', 'car2', 'back'];

function thing(id, p, alive, t, o = {}) {
  if (!p || o.alpha === 0) return;
  const [x, y, r] = p;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (id === 'sock' || id === 'sock2') sockChar(x, y, 1, r, alive, t);
  else if (id === 'car1') carChar(x, y, 1.2, '#ffd23f', alive, t);
  else if (id === 'car2') carChar(x, y, 1.2, '#5dff9a', alive, t);
  else if (id === 'sneakA') sneaker(x, y, 1, !!o.flip);
  else if (id === 'sneakB') sneaker(x, y, 1, !!o.flip);
  else if (id === 'back') { backpack(x, y, 1); if (alive) eyesOn(x, y + 26); }
  else if (id === 'pixel') pixel(x, y, o.s || .6, Object.assign({ t }, o.px || {}));
  else if (id === 'shirt') shirtShape(x, y, 1, r, '#3b8beb');
  else if (id === 'pants') pantsShape(x, y, 1, r, '#2b3f73');
  ctx.restore();
}
function messy(t, skip = {}) { Object.keys(MESS).forEach(id => { if (!skip[id]) thing(id, MESS[id], false, t, id === 'pixel' ? { px: { sleep: true, smudge: 1 } } : {}); }); }
function tidy(t, o = {}) {
  ['sneakA', 'sneakB', 'back', 'shirt', 'pants'].forEach(id => { if (!(o.skip || {})[id]) thing(id, PLACE[id], false, t); });
  if (!(o.skip || {}).pixel) thing('pixel', PLACE.pixel, false, t, { s: .5, px: Object.assign({ mood: 'happy' }, o.px || {}) });
  line(1060, 410, 1100, 412, '#2d3142', 3);
}
const PAJAMA = { pajama: true, shirt: PJ, pants: PJ };
const STEPS = ['Почистить зубы', 'Умыться', 'Сделать зарядку', 'Вещи — по местам', 'Одеться — и завтракать'];

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия первая: «Вещи сбежали».']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 1. Вещи сбежали', 'мультфильм-прототип'); } },

  { name: 'Мама будит', dur: 14.5,
    cues: [[1.4, 4.6, 'Мама', 'Дилшод, Томирис, солнышки, просыпайтесь! Утро!'],
      [4.8, 7, 'Дети', 'Ещё пять минуточек…'],
      [7.4, 11, 'Мама', 'Вставайте, в садик пора. Я пошла готовить завтрак.']],
    draw(t) {
      bedroom({ curtain: ease(seg(t, 1.2, 2.6)), door: t < 12.6 ? seg(t, 0, .5) : 1 - seg(t, 13.4, 14.2), t });
      messy(t);
      sleepyHead(95, 352, t); sleepyHead(385, 354, t + 1.3, true);
      const mx = t < 11.2 ? lerp(1260, 990, ease(seg(t, 0, 1.2))) : lerp(990, 1400, ease(seg(t, 11.2, 12.8)));
      const walking = t < 1.2 || t > 11.2;
      const up = t >= 1.2 && t < 2.8;
      mom(mx, 702 - (walking ? Math.abs(Math.sin(t * 8)) * 6 : 0), .95, { t, talk: speaking('Мама'), armL: up ? 2.7 : .15, armR: up ? 2.7 : (t > 3 && t < 11 ? .9 : .15) });
    } },

  { name: 'Планшет ругается', dur: 14,
    cues: [[2.5, 6.6, 'Пиксель', 'Фу-у! Руки липкие, экран в пятнах! Ты даже не умылся!'],
      [7, 11, 'Пиксель', 'И посмотри вокруг! Как будто ураган прошёл!'],
      [11.3, 14, 'Дилшод', 'Ну и что? Мне и так нормально.']],
    sfx: [[2.4, 'error']],
    draw(t) {
      bedroom({ t });
      messy(t, { pixel: 1 });
      const k = ease(seg(t, 0, 1.2));
      const tx = lerp(130, 640, k), ty = 690 - Math.sin(Math.PI * k) * 90;
      const awake = t >= 2.4;
      thing('pixel', [lerp(520, 520, 0), 706, 0], false, t, { s: .62, px: { sleep: !awake, error: awake && t < 7, smudge: 1, mood: 'angry', talk: speaking('Пиксель'), wave: awake } });
      if (t >= 7 && t < 11) {
        const pulse = .5 + .5 * Math.sin(t * 8);
        ['sock', 'sock2', 'car1', 'car2', 'shirt', 'pants', 'back', 'sneakB'].forEach(id => {
          const p = MESS[id]; ctx.beginPath(); ctx.arc(p[0], p[1] - 14, 44, 0, TAU); ctx.strokeStyle = `rgba(255,210,63,${.4 + .5 * pulse})`; ctx.lineWidth = 5; ctx.stroke();
        });
      }
      const k2 = ease(seg(t, .15, 1.35));
      tomiris(lerp(420, 880, k2), 704 - Math.sin(Math.PI * k2) * 80, 1, { t, shirt: TPJ, mood: t > 7 && t < 11 ? 'wow' : 'happy', armL: t < 1.35 ? 2.4 : .2, armR: t < 1.35 ? 2.4 : .2 });
      const look = t >= 7 && t < 11 ? [Math.sin(t * 1.6), -.2] : [0, 0];
      kid(tx, ty, 1, Object.assign({}, PAJAMA, { dirty: .5, dirtyHands: 1, t, talk: speaking('Дилшод'), look,
        mood: t < 2.4 ? 'happy' : t < 11 ? 'wow' : 'happy', armL: t < 1.2 ? 2.4 : .25, armR: t < 1.2 ? 2.4 : (t > 1.4 && t < 2.4 ? 1.2 : .25) }));
    } },

  { name: 'Вещи сбегают', dur: 13,
    cues: [[0, 2.4, 'Пиксель', 'Всё, я ухожу!'],
      [2.6, 6.2, 'Вещи', 'И мы! И мы! Нам тут неуютно!'],
      [7, 10.4, 'Дилшод', 'Стойте! Вернитесь!'],
      [10.6, 13, 'Томирис', 'Ой! И машинки убежали!']],
    sfx: [[1, 'boing'], [2.8, 'boing'], [4.6, 'boing']],
    draw(t) {
      bedroom({ door: t < 10.4 ? seg(t, 0, .8) : 1 - seg(t, 10.6, 11.6), t });
      ['shirt', 'pants'].forEach(id => thing(id, MESS[id], false, t));
      const DOOR = [1215, 560, 0];
      RUNNERS.forEach((id, i) => {
        const st = 1 + i * .6, k = seg(t, st, st + 2.6);
        let from = MESS[id].slice();
        if (id === 'sock') { const d = seg(t, st - .6, st); from = [700, lerp(112, 690, d * d), 0]; }
        const p = k > 0 ? [lerp(from[0], DOOR[0], k), lerp(from[1], DOOR[1] + (id === 'back' ? 40 : 120), k) - Math.abs(Math.sin(k * Math.PI * 4)) * 40, 0] : from;
        const a = 1 - seg(k, .85, 1);
        thing(id, p, true, t, id === 'pixel' ? { alpha: a, s: .62, px: { smudge: 1, mood: 'angry', talk: speaking('Пиксель'), walk: k > 0 ? t * 14 : 0 } } : { alpha: a });
      });
      tomiris(860, 704, 1, { t, shirt: TPJ, mood: t < 10.6 ? 'wow' : 'sad' });
      kid(640, 690, 1, Object.assign({}, PAJAMA, { dirty: .5, dirtyHands: 1, t, talk: speaking('Дилшод'), mood: t < 7 ? 'wow' : 'sad',
        armL: t >= 7 ? 2.5 + Math.sin(t * 8) * .25 : .3, armR: t >= 7 ? 2.5 - Math.sin(t * 8) * .25 : .3 }));
    } },

  { name: 'Чистон в зеркале', dur: 16,
    cues: [[2.5, 6, 'Чистон', 'Доброе утро, Дилшод и Томирис! Хотите вернуть вещи?'],
      [6.2, 8, 'Дети', 'Очень хотим!'],
      [8.2, 11.4, 'Чистон', 'Тогда вот план утреннего героя. Пять шагов!'],
      [11.6, 16, 'Чистон', 'Зубы, умыться, зарядка, вещи по местам — и одеться!']],
    sfx: [[2, 'power']],
    draw(t) {
      bathroom(); sink();
      chiston(640, 215, seg(t, 2, 3), { talk: speaking('Чистон'), t });
      const k = ease(seg(t, 0, 2));
      tomiris(lerp(-280, 140, k), 704 - Math.abs(Math.sin(t * 8 + 1)) * 8 * (k < 1), 1, { t, shirt: TPJ, mood: t < 2.5 ? 'sad' : 'wow' });
      kid(lerp(-120, 290, k), 700 - Math.abs(Math.sin(t * 8)) * 8 * (k < 1), 1, Object.assign({}, PAJAMA, { dirty: .5, dirtyHands: 1, t, talk: speaking('Дилшод'), mood: t < 2.5 ? 'sad' : 'wow' }));
      if (t >= 11.4) checklist(STEPS, Math.min(5, Math.floor(seg(t, 11.6, 15.2) * 5) + 1), 0);
    } },

  { name: 'Шаг 1 · Зубы', dur: 16,
    cues: [[2, 6, 'Песня', 'Щёткой вверх и щёткой вниз —'],
      [6, 10, 'Песня', 'каждый зубик, улыбнись!'],
      [10, 14, 'Песня', 'Справа, слева и внутри — две минуты, посмотри!'],
      [14, 16, 'Чистон', 'Шаг первый — готово!']],
    sfx: [[14, 'ding']],
    draw(t) {
      bathroom();
      chiston(640, 215, 1, { talk: speaking('Чистон'), t });
      const brushing = t >= 2 && t < 14, sc = Math.sin(t * 22) * 6;
      kid(DXS, SY, 1.1, Object.assign({}, PAJAMA, { dirty: .5, dirtyHands: 1, t, mood: 'happy', hold: 'brush' },
        brushing ? { handR: [26 + sc, -214], brushTo: [-6 + sc, -234] } : { armR: .35, talk: speaking('Дилшод') }));
      const ls = Math.sin(t * 22 + 1) * 5;
      tomiris(TXS, TYS, TSC, Object.assign({ t, shirt: TPJ, hold: 'brush' }, brushing ? { handR: [24 + ls, -214], brushTo: [-6 + ls, -234] } : { armR: .35 }));
      sink();
      const rem = t < 2 ? 120 : Math.max(0, 120 - (t - 2) * 10);
      timerRing(1130, 230, 70, rem / 120, t >= 14 ? '✓' : mmss(rem), 'ускорено ×10');
      banner('Шаг 1 из 5 · Зубы');
    } },

  { name: 'Шаг 2 · Умыться', dur: 12,
    cues: [[0, 3.6, 'Чистон', 'Теперь умываемся: лицо — водой, руки — с мылом.'],
      [4.2, 7, 'Дилшод', 'Бр-р, холодная! Зато бодрит!'],
      [9.6, 12, 'Чистон', 'Шаг второй — готово!']],
    sfx: [[9.6, 'ding']],
    draw(t) {
      bathroom();
      chiston(640, 215, 1, { talk: speaking('Чистон'), t });
      const face = t >= 3.6 && t < 7, hands = t >= 7 && t < 9.6, sc = Math.sin(t * 14) * 8;
      const fc = { handL: [-32 + sc * .5, -250], handR: [32 - sc * .5, -250] };
      kid(DXS, SY, 1.1, Object.assign({}, PAJAMA, face ? fc : hands ? DHANDS(sc) : {}, { dirty: .5 * (1 - seg(t, 3.6, 6.5)), dirtyHands: 1 - seg(t, 7, 9.4), t,
        talk: speaking('Дилшод'), mood: face ? 'sleepy' : 'happy' }));
      tomiris(TXS, TYS, TSC, Object.assign({ t, shirt: TPJ, mood: face ? 'sleepy' : 'happy' }, face ? fc : hands ? THANDS(sc) : {}));
      sink();
      if (face || hands) water();
      if (face) [[DXS, SY - 268 * 1.1], [TXS, TYS - 268 * TSC * .8]].forEach(([fx, fy]) => { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t * 2, d = 60 + ((t * 90 + i * 20) % 40); circ(fx + Math.cos(a) * d, fy + Math.sin(a) * d * .7, 5, 'rgba(120,200,255,.85)'); } });
      if (hands) { const k = seg(t, 7, 7.8) * (1 - seg(t, 9, 9.6)); foam(...DFOAM(), k, t); foam(...TFOAM(), k * .8, t); }
      banner('Шаг 2 из 5 · Умыться');
    } },

  { name: 'Шаг 3 · Зарядка', dur: 18,
    cues: [[0, 3, 'Чистон', 'Шаг третий — зарядка! Повторяй за мной!'],
      [3, 6, 'Чистон', 'Потянулись к солнцу — раз!'],
      [6, 9.5, 'Чистон', 'Наклон вправо, наклон влево — два!'],
      [9.5, 12.5, 'Чистон', 'Приседаем — три!'],
      [12.5, 15.5, 'Чистон', 'Прыгаем, как зайчик, — четыре!'],
      [15.7, 18, 'Дети', 'Ух! Вот теперь мы проснулись!']],
    draw(t) {
      bedroom({ mirrorOn: 1, mirrorTalk: speaking('Чистон'), door: t > 7 ? .3 : 0, t });
      ['shirt', 'pants'].forEach(id => thing(id, MESS[id], false, t));
      if (t > 7.5) {
        const peek = seg(t, 7.5, 8.5);
        thing('pixel', [lerp(1230, 1205, peek), 556, 0], true, t, { s: .45, px: { mood: 'happy' } });
        sneaker(1215 - 20 * peek, 700, .8, true);
      }
      let o = { armL: .2, armR: .2, tilt: 0, squat: 0 }, dy = 0;
      if (t >= 3 && t < 6) { o.armL = o.armR = 2.95; dy = -Math.abs(Math.sin((t - 3) * 3)) * 10; }
      else if (t >= 6 && t < 9.5) { o.tilt = Math.sin((t - 6) * 2.6) * .22; o.armL = o.armR = 2.7; }
      else if (t >= 9.5 && t < 12.5) { o.squat = (1 - Math.cos((t - 9.5) * Math.PI * 1.4)) / 2 * .85; o.armL = o.armR = 1.55; }
      else if (t >= 12.5 && t < 15.5) { dy = -Math.abs(Math.sin((t - 12.5) * Math.PI * 1.6)) * 70; o.armL = o.armR = 2.3; }
      kid(540, 690 + dy, 1, Object.assign({}, PAJAMA, o, { dirty: 0, dirtyHands: 0, t, talk: speaking('Дилшод'), mood: 'happy' }));
      tomiris(770, 704 + dy * .8, 1, Object.assign({ shirt: TPJ }, o, { t, mood: 'happy' }));
      banner('Шаг 3 из 5 · Зарядка');
    } },

  { name: 'Шаг 4 · Порядок', dur: 18,
    cues: [[.4, 3.8, 'Пиксель', 'Ладно, мы вернёмся… если наведёшь порядок!'],
      [4.2, 6, 'Дилшод', 'Носки — в ящик!'],
      [6.1, 7.9, 'Томирис', 'А машинки — в коробку!'],
      [8.2, 11.6, 'Дилшод', 'Кроссовки — к двери, планшет — на зарядку!'],
      [12, 15.4, 'Пиксель', 'Вот теперь другое дело! Здесь я остаюсь!'],
      [15.6, 18, 'Вещи', 'Ура! Мы дома!']],
    sfx: [[13.5, 'ding']],
    draw(t) {
      bedroom({ door: t < 12 ? seg(t, 0, .6) : 1 - seg(t, 12, 13), t });
      const STAGE = { pixel: [900, 706, 0], sneakA: [980, 696, 0], sneakB: [1040, 700, 0], sock: [820, 700, 0], sock2: [860, 700, 0], car1: [940, 690, 0], car2: [1010, 690, 0], back: [1060, 610, 0] };
      const SLOT = { sock: 4.6, sock2: 5.2, car1: 6, car2: 6.6, sneakA: 8.6, sneakB: 9.2, back: 9.8, pixel: 10.6, shirt: 11.4, pants: 11.9 };
      Object.keys(MESS).forEach(id => {
        let p;
        const placed = seg(t, SLOT[id], SLOT[id] + .9);
        if (id === 'shirt' || id === 'pants') p = placed > 0 ? fly(MESS[id], PLACE[id], placed, 160) : MESS[id];
        else {
          const ent = seg(t, .3 + RUNNERS.indexOf(id) * .3, 1.8 + RUNNERS.indexOf(id) * .3);
          const door = [1215, STAGE[id][1], 0];
          p = placed > 0 ? fly(STAGE[id], PLACE[id], placed, 150) : [lerp(door[0], STAGE[id][0], ent), STAGE[id][1] - Math.abs(Math.sin(ent * Math.PI * 3)) * 30 * (ent < 1), 0];
          if (ent <= 0) return;
        }
        const alpha = HIDE_AT_PLACE[id] ? 1 - seg(placed, .8, 1) : 1;
        thing(id, p, id !== 'shirt' && id !== 'pants', t, id === 'pixel' ? { alpha, s: lerp(.6, .5, placed), px: { mood: 'happy', talk: speaking('Пиксель'), wave: placed >= 1 } } : { alpha });
      });
      if (t > 10.6) line(1060, 410, 1100, 412, '#2d3142', 3);
      tomiris(680, 704, 1, { t, shirt: TPJ, mood: 'happy', armR: t > 6.1 && t < 7.9 ? 1.3 : .2, armL: t > 15.6 ? 2.6 + Math.sin(t * 7 + 1) * .3 : .2 });
      kid(560, 690, 1, Object.assign({}, PAJAMA, { dirty: 0, dirtyHands: 0, t, talk: speaking('Дилшод'), mood: 'happy',
        armR: (t > 4.2 && t < 12.2) ? 1.3 + Math.sin(t * 3) * .2 : .25, armL: t > 15.6 ? 2.6 + Math.sin(t * 7) * .3 : .25 }));
      banner('Шаг 4 из 5 · Порядок');
    } },

  { name: 'Шаг 5 · Одеться', dur: 16,
    cues: [[6, 8.4, 'Мама', 'Дети, завтрак готов!'],
      [8.6, 11, 'Дети', 'Идём, мама! Мы уже готовы!'],
      [11.8, 16, 'Мама', 'Сами? И порядок навели? Вот это да!']],
    sfx: [[4.5, 'pop'], [12, 'fanfare']],
    draw(t) {
      bedroom({ door: seg(t, 10.6, 11.4), t });
      tidy(t, { skip: { shirt: 1, pants: 1 } });
      const ks = seg(t, 1, 3), kp = seg(t, 2.5, 4.5);
      if (ks < 1) thing('shirt', fly(PLACE.shirt, [640, 520, 0], ks, 200), false, t);
      if (kp < 1) thing('pants', fly(PLACE.pants, [640, 640, 0], kp, 220), false, t);
      const dressed = t >= 4.5;
      kid(640, 690, 1, Object.assign(dressed ? {} : PAJAMA, { dirty: 0, dirtyHands: 0, t, talk: speaking('Дилшод'), mood: t > 11.8 && t < 13 ? 'wow' : 'happy',
        armL: t < 4.5 ? 1.6 : .25, armR: t < 4.5 ? 1.6 : (t > 8.6 && t < 11 ? 2.5 : .25) }));
      tomiris(820, 704, 1, { t, shirt: dressed ? TDRESS : TPJ, mood: 'happy', armL: t < 4.5 ? 1.6 : (t > 8.6 && t < 11 ? 2.5 : .2) });
      if (t >= 4.5 && t < 5.4) { const k = seg(t, 4.5, 5.4); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; star(640 + Math.cos(a) * 160 * k, 470 + Math.sin(a) * 160 * k, 16 * (1 - k), 7 * (1 - k), '#ffd23f'); } }
      if (t >= 6 && t < 8.4) speech(1180, 140, 'Дети, завтрак готов!', 26);
      if (t >= 11) mom(lerp(1400, 1060, ease(seg(t, 11, 12))), 702, .95, { t, talk: speaking('Мама'), mood: 'wow', armL: t > 12 ? 2.6 : .15 });
      if (t >= 12) confetti(t);
      banner('Шаг 5 из 5 · Одеться');
    } },

  { name: 'Конец', dur: 6,
    cues: [[.8, 5.2, 'Рассказчик', 'Конец первой серии. А дальше — завтрак!']],
    draw(t) { titleCard(t, 'Конец', 'первой серии', 'Дальше: серия 2 «Завтрак»'); } }
];
