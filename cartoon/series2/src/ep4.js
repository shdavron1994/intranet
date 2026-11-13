/* ---------- episode 4: Папа дома ---------- */
const TX = 480, TY = 640, TX2 = 650, TY2 = 630, KX = 330; // kids at the table, kettle on the right
const PX = 330; // papa's seat
function wallTV(state, t, talk) {
  box(396, 106, 248, 158, 12, '#1f2430');
  const sx = 408, sy = 118, sw = 224, sh = 134;
  if (state === 'on') {
    box(sx, sy, sw, sh, 6, '#7fd3ff');
    ctx.save(); rr(sx, sy, sw, sh, 6); ctx.clip();
    ell(sx + 112, sy + 140, 160, 40, '#5fbf6a');
    const bx = sx + 112 + Math.sin(t * 3) * 70, by = sy + 70 - Math.abs(Math.sin(t * 6)) * 30;
    circ(bx, by, 18, '#ff5a5f'); circ(bx - 6, by - 4, 3, '#fff'); circ(bx + 6, by - 4, 3, '#fff');
    ctx.restore();
  } else box(sx, sy, sw, sh, 6, '#2d3142');
}
function family(t, o) {
  // kids at the table; o.d / o.tm are options for Dilshod / Tomiris
  chairBack(TX); chairBack(TX2);
  kid(TX, TY, 1, Object.assign({ t, talk: speaking('Дилшод') }, o.d || {}));
  tomiris(TX2, TY2, 1, Object.assign({ t }, o.tm || {}));
}
const NAMES = { cat: ['кошка', 'кот', 'котёнок'], dog: ['собака', 'пёс', 'щенок'], cow: ['корова', 'бык', 'телёнок'], horse: ['лошадь', 'конь', 'жеребёнок'], sheep: ['овца', 'баран', 'ягнёнок'], chicken: ['курица', 'петух', 'цыплёнок'] };
const SOUND = { cat: 'Мяу!', dog: 'Гав-гав!', cow: 'Му-у!', horse: 'И-го-го!', sheep: 'Бе-е-е!', chicken: 'Пи-пи-пи!' };
function tvShow(t, spec, soundOn) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9fdcff'); g.addColorStop(.55, '#e8f7ff'); g.addColorStop(.55, '#9ad86d'); g.addColorStop(1, '#7cc657');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  circ(1110, 110, 40, '#ffe066'); ell(260, 120, 70, 20, '#ffffff'); ell(300, 110, 50, 18, '#ffffff');
  // fence
  for (let x = 20; x < W; x += 70) box(x, 330, 14, 90, 4, '#d9a46c'); box(0, 350, W, 12, 4, '#d9a46c'); box(0, 390, W, 12, 4, '#d9a46c');
  pill(640, 30, 'Мама, папа и малыш', 34, '#ff7aa2', '#ffffff', 'center');
  if (spec) {
    const n = NAMES[spec], scl = spec === 'horse' ? [.85, .95, .6] : spec === 'cow' ? [.85, .95, .55] : spec === 'chicken' ? [1, 1.1, .9] : [1, 1.15, .65];
    const xs = [270, 640, 1010], roles = ['mom', 'dad', 'baby'], tags = ['мама', 'папа', 'малыш'], at = [.4, 2.1, 3.8];
    roles.forEach((r, i) => {
      const k = ease(seg(t, at[i], at[i] + .5));
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = k;
      const hop = r === 'baby' ? Math.abs(Math.sin(t * 5)) * 14 : 0;
      animal(spec, r, xs[i] - 30, 555 - hop, scl[i] * (.7 + .3 * k), t);
      pill(xs[i], 572, `${tags[i]} — ${n[i]}`, 30, '#ffffff', '#0e3a46', 'center');
      ctx.restore();
    });
    if (soundOn) speech(1010, 220, SOUND[spec], 36);
  }
  // TV bezel
  ctx.lineWidth = 26; ctx.strokeStyle = '#1f2430'; rr(13, 13, W - 26, H - 26, 30); ctx.stroke();
  circ(W - 40, H - 22, 5, '#5dff9a');
}
function animalScene(spec, line) {
  return { name: NAMES[spec][2][0].toUpperCase() + NAMES[spec][2].slice(1), dur: 9,
    cues: [[.3, 6, 'Ведущий', line], [6.3, 8.8, 'Дети', SOUND[spec]]],
    sfx: [[.2, 'pop']],
    draw(t) { tvShow(t, spec, t >= 6.3); } };
}

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия четвёртая: «Папа дома!»']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 4. Папа дома!', 'мультфильм-прототип'); } },

  { name: 'Ужин и экраны', dur: 13,
    cues: [[1, 4.4, 'Мама', 'Ужин готов! Дети, кушайте, пока горячее.'],
      [4.8, 6.4, 'Дилшод', 'Ага…'],
      [6.8, 8.6, 'Томирис', 'Сейчас, мультик…'],
      [9, 13, 'Рассказчик', 'Каша остывала, а дети смотрели в экраны.']],
    draw(t) {
      kitchen(); stovePot(t); wallTV('on', t);
      mom(880, 702, .95, { t, talk: speaking('Мама'), apron: true, armL: t > 1 && t < 4.4 ? 1.4 : .3 });
      family(t, { d: { hold: 'phone', handR: [30, -150], glow: '#7fe3ff', look: [0, .7], mood: 'happy' }, tm: { look: [-.4, -1], mood: 'happy' } });
      table(); bowl(TX, 500, 1); bowl(TX2, 500, 1);
      kettle(KX, 498, .6, 0, false, t);
    } },

  { name: 'Папа пришёл', dur: 14,
    cues: [[1.5, 4, 'Папа', 'Всем привет! Я дома!'],
      [4.3, 6, 'Мама', 'Привет, дорогой!'],
      [7, 10, 'Папа', 'Эй, а где мои обнимашки?'],
      [10.5, 14, 'Рассказчик', 'Но дети ничего не заметили…']],
    draw(t) {
      kitchen(); stovePot(t); wallTV('on', t);
      mom(880, 702, .95, { t, talk: speaking('Мама'), apron: true, armR: t > 4.3 && t < 6 ? 2.4 : .3 });
      const k = ease(seg(t, 0, 1.4));
      papa(lerp(1420, 1050, k), 702 - Math.abs(Math.sin(t * 8)) * 6 * (k < 1), .9, { t, talk: speaking('Папа'), bag: t < 7, armL: t > 7 && t < 10 ? 2.2 : (t > 1.5 && t < 4 ? 2.6 : .2), mood: t > 10.5 ? 'wow' : 'happy' });
      family(t, { d: { hold: 'phone', handR: [30, -150], glow: '#7fe3ff', look: [0, .7], mood: 'happy', tilt: .06 }, tm: { look: [-.4, -1], mood: 'happy', tilt: -.05 } });
      table(); bowl(TX, 500, 1); bowl(TX2, 500, 1);
      kettle(KX, 498, .6, 0, false, t);
    } },

  { name: 'Чистон в чайнике', dur: 18,
    cues: [[.5, 4.8, 'Чистон', 'Дилшод, Томирис! Папа пришёл, а вы даже не заметили!'],
      [5, 8.5, 'Чистон', 'Во время еды экраны выключаем.'],
      [9, 14, 'Чистон', 'Сидим ровно, едим не спеша. Прожевал, проглотил — потом говори!'],
      [14.3, 18, 'Дети', 'Хорошо, Чистон!']],
    sfx: [[.2, 'power'], [8.6, 'pop']],
    draw(t) {
      kitchen(); stovePot(t); wallTV(t < 8.6 ? 'on' : 'off', t);
      mom(880, 702, .95, { t, apron: true, armL: t > 8 && t < 9.2 ? 1.5 : .3 });
      if (t > 8 && t < 9.2) box(745, 480, 20, 34, 5, '#555b70');
      papa(1050, 702, .9, { t, mood: 'happy' });
      const off = t >= 8.6;
      family(t, { d: off ? { mood: 'happy', look: [1, -.3] } : { hold: 'phone', handR: [30, -150], glow: '#7fe3ff', look: [0, .7], mood: t < 4.8 ? 'wow' : 'happy' },
        tm: { look: off ? [1, -.3] : [-.4, -1], mood: t < 4.8 ? 'wow' : 'happy' } });
      table(); bowl(TX, 500, 1); bowl(TX2, 500, 1);
      if (off) { box(540, 488, 50, 12, 4, '#1f2430'); }
      kettle(KX, 498, .6, seg(t, 0, 1), speaking('Чистон'), t);
    } },

  { name: 'Обнимашки', dur: 10,
    cues: [[.5, 2.5, 'Дети', 'Папа!'],
      [3, 6.5, 'Папа', 'Вот теперь я точно дома!'],
      [7, 10, 'Мама', 'Мойте руки — и ужинаем все вместе!']],
    sfx: [[.6, 'boing']],
    draw(t) {
      kitchen(); stovePot(t, false); wallTV('off', t);
      mom(880, 702, .95, { t, talk: speaking('Мама'), apron: true });
      const k = ease(seg(t, .3, 1.6));
      papa(1050, 702, .9, { t, talk: speaking('Папа'), armL: k >= 1 ? .7 : .2, armR: k >= 1 ? .7 : .2 });
      table(); bowl(TX, 500, 1); bowl(TX2, 500, 1); kettle(KX, 498, .6, 1, false, t);
      kid(lerp(TX, 980, k), 690 - Math.abs(Math.sin(t * 9)) * 10 * (k < 1), 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: k >= 1 ? 1.9 : 2.4 });
      tomiris(lerp(TX2, 1120, k), 704 - Math.abs(Math.sin(t * 9 + 1)) * 10 * (k < 1), 1, { t, mood: 'happy', armL: k >= 1 ? 1.9 : 2.4 });
      if (k >= 1) { const hk = seg(t, 1.6, 2.4); [[1010, 300], [1100, 330], [1050, 260]].forEach((p, i) => { ctx.globalAlpha = hk * (1 - seg(t, 8, 10)); txt('♥', p[0] + Math.sin(t * 2 + i) * 6, p[1] - (t - 1.6) * 8, 36, '#ff5a7a'); ctx.globalAlpha = 1; }); }
    } },

  { name: 'Ужин вместе', dur: 15,
    cues: [[.5, 3, 'Папа', 'Приятного аппетита!'],
      [3.3, 5, 'Дети', 'Спасибо, папа!'],
      [6, 11, 'Рассказчик', 'Все ели не спеша, а разговаривали — только когда прожуют.'],
      [11.4, 15, 'Дилшод', 'Прожевал… Папа, а я сегодня рисовал!']],
    draw(t) {
      kitchen(); stovePot(t, false); wallTV('off', t);
      mom(150, 702, .95, { t, apron: true, mood: 'happy' });
      const cyc = (t % 2.4) / 2.4, up = Math.max(0, Math.sin(cyc * Math.PI * 2)), up2 = Math.max(0, Math.sin(cyc * Math.PI * 2 + 1.5));
      chairBack(PX);
      papa(PX, 700, .85, { t, talk: speaking('Папа'), jacket: false, handR: [56, -246 - up2 * 30], mood: 'happy' });
      family(t, { d: { mood: 'happy', full: cyc > .45 && t < 11, hold: 'spoon', handR: [40, -150 - up * 50], spoonTo: [6, -184 - up * 50] },
        tm: { mood: 'happy', hold: 'spoon', handR: [40, -150 - up2 * 50], spoonTo: [6, -184 - up2 * 50] } });
      table(); bowl(PX, 500, 1); bowl(TX, 500, 1); bowl(TX2, 500, 1);
      checklist(['Экраны выключены', 'Сидим ровно', 'Едим не спеша', 'Прожевал — потом говори'], 4, 4, 800, 40, 'Правила ужина');
    } },

  { name: 'Давай учиться', dur: 12,
    cues: [[.5, 3.5, 'Папа', 'Дилшод, давай учиться!'],
      [3.8, 6, 'Дилшод', 'А что будем учить?'],
      [6.3, 8, 'Томирис', 'И я хочу!'],
      [8.3, 12, 'Папа', 'Сейчас узнаете! Смотрим передачу про домашних животных.']],
    draw(t) {
      livingRoom({ tv: t > 11.4 ? 'on' : 'off', sky: 1, clock: 7, t });
      ctx.fillStyle = 'rgba(30,40,90,.12)'; ctx.fillRect(0, 0, W, H);
      sofaBack();
      kid(920, 640, 1, { t, talk: speaking('Дилшод'), mood: t > 3.8 ? 'wow' : 'happy' });
      tomiris(1070, 650, 1, { t, mood: 'happy', armL: t > 6.3 && t < 8 ? 2.6 : .2 });
      sofaFront();
      papa(560, 702, .9, { t, talk: speaking('Папа'), jacket: false, armL: t > 11 ? 1.5 : .2 });
    } },

  { name: 'Передача', dur: 6,
    cues: [[.4, 5.8, 'Ведущий', 'Передача «Мама, папа и малыш»! Кто у кого малыш?']],
    sfx: [[.2, 'fanfare']],
    draw(t) { tvShow(t, null); } },
  animalScene('cat', 'Мама — кошка. Папа — кот. А малыш — котёнок!'),
  animalScene('dog', 'Мама — собака. Папа — пёс. А малыш — щенок!'),
  animalScene('cow', 'Мама — корова. Папа — бык. А малыш — телёнок!'),
  animalScene('horse', 'Мама — лошадь. Папа — конь. А малыш — жеребёнок!'),
  animalScene('sheep', 'Мама — овца. Папа — баран. А малыш — ягнёнок!'),
  animalScene('chicken', 'Мама — курица. Папа — петух. А малыш — цыплёнок!'),

  { name: 'Папины вопросы', dur: 16,
    cues: [[.5, 3.5, 'Папа', 'А как зовут малыша коровы?'],
      [3.8, 5.6, 'Дилшод', 'Телёнок!'],
      [6, 8.8, 'Папа', 'А малыша курицы?'],
      [9.1, 10.8, 'Томирис', 'Цыплёнок!'],
      [11.2, 16, 'Папа', 'Молодцы! Вот это учёба! Я вами горжусь.']],
    sfx: [[5.6, 'ding'], [10.8, 'ding']],
    draw(t) {
      livingRoom({ tv: 'off', sky: 1, clock: 7.5, t });
      ctx.fillStyle = 'rgba(30,40,90,.12)'; ctx.fillRect(0, 0, W, H);
      sofaBack();
      kid(920, 640, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: t > 3.8 && t < 5.6 ? 2.6 : .2 });
      tomiris(1070, 650, 1, { t, mood: 'happy', armL: t > 9.1 && t < 10.8 ? 2.6 : .2 });
      sofaFront();
      papa(560, 702, .9, { t, talk: speaking('Папа'), jacket: false, armR: t > 11.2 ? 2.4 : .2 });
      if (t > 3.8 && t < 6) { animal('cow', 'baby', 800, 330, .45, t); }
      if (t > 9.1 && t < 11.2) { animal('chicken', 'baby', 1130, 330, .7, t); }
      if (t > 11.2) { star(920, 340, 22, 10, '#ffd23f'); star(1070, 370, 20, 9, '#ffd23f'); }
    } },

  { name: 'Спокойной ночи', dur: 10,
    cues: [[.5, 6, 'Чистон', 'Экран может и учить — если смотреть недолго и вместе с мамой и папой!'],
      [6.5, 9.6, 'Дети', 'Спокойной ночи, Чистон!']],
    sfx: [[.2, 'power']],
    draw(t) {
      livingRoom({ tv: 'chiston', talk: speaking('Чистон'), sky: 1, clock: 8, t });
      ctx.fillStyle = `rgba(30,40,90,${.12 + seg(t, 7, 10) * .3})`; ctx.fillRect(0, 0, W, H);
      sofaBack();
      kid(920, 640, 1, { t, talk: speaking('Дилшод'), mood: 'happy', look: [-1, -.4], armL: t > 6.5 ? 2.6 + Math.sin(t * 6) * .25 : .2 });
      tomiris(1070, 650, 1, { t, mood: 'happy', look: [-1, -.4], armR: t > 6.5 ? 2.6 + Math.sin(t * 6) * .25 : .2 });
      sofaFront();
      papa(560, 702, .9, { t, jacket: false, mood: 'happy' });
    } },

  { name: 'Конец', dur: 6,
    cues: [[.8, 5.4, 'Рассказчик', 'Конец четвёртой серии. Ужинаем вместе — и учимся вместе!']],
    draw(t) { titleCard(t, 'Конец', 'четвёртой серии', 'Ужинаем вместе — учимся вместе'); } }
];
