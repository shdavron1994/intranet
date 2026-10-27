/* ---------- episode 5: Копилка ---------- */
const TX = 480, TY = 640, TX2 = 650, TY2 = 630, PX = 330, KX = 760;
function wallTV(state, t) {
  box(396, 106, 248, 158, 12, '#1f2430');
  if (state === 'on') { box(408, 118, 224, 134, 6, '#fff1f4'); gummy(470, 200, .55, '#ff5a5f', t); chocolate(570, 190, .45); }
  else box(408, 118, 224, 134, 6, '#2d3142');
}
function family(t, o) {
  chairBack(PX); chairBack(TX); chairBack(TX2);
  papa(PX, 700, .85, Object.assign({ t, talk: speaking('Папа'), jacket: false }, o.p || {}));
  kid(TX, TY, 1, Object.assign({ t, talk: speaking('Дилшод') }, o.d || {}));
  tomiris(TX2, TY2, 1, Object.assign({ t }, o.tm || {}));
  table(); bowl(PX, 500, o.food ?? 1); bowl(TX, 500, o.food ?? 1); bowl(TX2, 500, o.food ?? 1);
}
function gummy(x, y, s, col, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = .92;
  circ(-34, -86, 18, col); circ(34, -86, 18, col); circ(0, -60, 44, col);
  ell(0, 10, 50, 60, col); circ(-50, -10, 18, col); circ(50, -10, 18, col); circ(-30, 66, 20, col); circ(30, 66, 20, col);
  ctx.globalAlpha = 1; circ(-14, -66, 5, '#1b2a41'); circ(14, -66, 5, '#1b2a41'); circ(-10, -2, 8, 'rgba(255,255,255,.5)');
  ctx.restore();
}
function chocolate(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  box(-80, -120, 160, 240, 12, '#6b3e26');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) box(-70 + c * 75, -110 + r * 57, 65, 50, 6, '#7d4a2e');
  box(-86, 20, 172, 110, 10, '#3b8beb'); txt('ШОКОЛАД', 0, 75, 26, '#ffffff');
  ctx.restore();
}
function sugarCube(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); box(-20, -20, 40, 40, 6, '#ffffff'); ctx.strokeStyle = '#7f95a8'; ctx.lineWidth = 3; rr(-20, -20, 40, 40, 6); ctx.stroke(); circ(-8, -8, 2, '#e8eef3'); circ(6, 4, 2, '#e8eef3'); ctx.restore(); }
function tooth(x, y, s, hole, sad, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-90, -70); ctx.quadraticCurveTo(-95, -150, -40, -150); ctx.quadraticCurveTo(0, -130, 40, -150); ctx.quadraticCurveTo(95, -150, 90, -70);
  ctx.quadraticCurveTo(88, 40, 60, 110); ctx.quadraticCurveTo(40, 130, 30, 60); ctx.quadraticCurveTo(0, 30, -30, 60); ctx.quadraticCurveTo(-40, 130, -60, 110); ctx.quadraticCurveTo(-88, 40, -90, -70); ctx.closePath();
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = '#d9e4ea'; ctx.lineWidth = 6; ctx.stroke();
  if (hole > 0) { ell(40, -100, 26 * hole, 18 * hole, '#5a4632'); ell(40, -100, 16 * hole, 10 * hole, '#2d2116'); }
  circ(-30, -60, 9, '#1b2a41'); circ(30, -60, 9, '#1b2a41');
  ctx.beginPath(); if (sad) ctx.arc(0, -10, 22, 1.2 * Math.PI, 1.8 * Math.PI); else ctx.arc(0, -40, 22, .2 * Math.PI, .8 * Math.PI);
  ctx.strokeStyle = '#1b2a41'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
  if (sad) { circ(-46, -46, 5, '#7fd3ff'); }
  ctx.restore();
}
function piggy(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 4, 90, 12, 'rgba(0,0,0,.15)');
  [-50, -20, 20, 50].forEach(lx => box(lx - 10, -30, 20, 34, 6, '#ff8fb1'));
  ell(0, -80, 100, 70, '#ffa8c5');
  ctx.beginPath(); ctx.moveTo(-50, -140); ctx.lineTo(-30, -175); ctx.lineTo(-14, -142); ctx.closePath(); ctx.fillStyle = '#ff8fb1'; ctx.fill();
  ell(96, -80, 24, 30, '#ff8fb1'); circ(90, -84, 5, '#c2185b'); circ(102, -76, 5, '#c2185b');
  circ(56, -104, 7, '#1b2a41');
  box(-30, -152, 60, 10, 5, '#c2185b');
  ctx.beginPath(); ctx.arc(-104, -80, 14, 0, Math.PI * 1.5); ctx.strokeStyle = '#ff8fb1'; ctx.lineWidth = 6; ctx.stroke();
  ctx.restore();
}
function coin(x, y, r) { circ(x, y, r, '#f2b705'); circ(x, y, r * .75, '#ffd23f'); line(x - r * .3, y, x + r * .3, y, '#f2b705', r * .18); }

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия пятая: «Копилка».']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 5. Копилка', 'мультфильм-прототип'); } },

  { name: 'Утро', dur: 13,
    cues: [[1.4, 4.4, 'Мама', 'Доброе утро, мои хорошие! Просыпайтесь!'],
      [4.8, 7, 'Дети', 'Доброе утро, мама!'],
      [7.6, 12.6, 'Рассказчик', 'В этот раз дети встали сразу — и в комнате уже порядок!']],
    draw(t) {
      bedroom({ curtain: ease(seg(t, 1.2, 2.6)), door: seg(t, 0, .5), t });
      line(1060, 410, 1100, 412, '#2d3142', 3); pixel(1060, 410, .5, { t, mood: 'happy' });
      sneaker(1190, 702, 1, false); sneaker(1248, 706, 1, false); backpack(1120, 336, 1);
      mom(lerp(1260, 990, ease(seg(t, 0, 1.2))), 702, .95, { t, talk: speaking('Мама'), armL: t > 1.2 && t < 2.8 ? 2.7 : .15, armR: t > 1.2 && t < 2.8 ? 2.7 : .15 });
      if (t < 4.6) { sleepyHead(95, 352, t); sleepyHead(385, 354, t + 1.3, true); }
      else {
        const k = ease(seg(t, 4.6, 5.6));
        kid(lerp(130, 560, k), 690 - Math.sin(Math.PI * k) * 80, 1, { t, talk: speaking('Дилшод'), pajama: true, shirt: '#9fc3ff', pants: '#9fc3ff', mood: 'happy', armL: 2.4, armR: k < 1 ? 2.4 : .3 });
        tomiris(lerp(420, 760, k), 704 - Math.sin(Math.PI * k) * 70, 1, { t, shirt: TPJ, mood: 'happy', armL: k < 1 ? 2.4 : .3, armR: 2.4 });
      }
    } },

  { name: 'Умываемся', dur: 13,
    cues: [[.5, 4.4, 'Песня', 'Щёткой вверх и щёткой вниз — каждый зубик, улыбнись!'],
      [5, 8.6, 'Песня', 'Мыло, водичка — чистое личико!'],
      [9.2, 13, 'Чистон', 'Вот это утренние герои! Даже напоминать не пришлось!']],
    sfx: [[9, 'ding']],
    draw(t) {
      bathroom(); chiston(640, 215, 1, { talk: speaking('Чистон'), t });
      const brush = t < 4.8, wash = t >= 4.8 && t < 9, sc = Math.sin(t * 22) * 6, sw = Math.sin(t * 14) * 8;
      const fc = { handL: [-32 + sw * .5, -250], handR: [32 - sw * .5, -250] };
      kid(DXS, SY, 1.1, Object.assign({ t, pajama: true, shirt: '#9fc3ff', pants: '#9fc3ff', mood: wash ? 'sleepy' : 'happy', talk: speaking('Дилшод') && !brush },
        brush ? { hold: 'brush', handR: [26 + sc, -214], brushTo: [-6 + sc, -234] } : wash ? fc : { armL: 2.5 }));
      tomiris(TXS, TYS, TSC, Object.assign({ t, shirt: TPJ, mood: wash ? 'sleepy' : 'happy' },
        brush ? { hold: 'brush', handR: [24 + sc, -214], brushTo: [-6 + sc, -234] } : wash ? fc : { armR: 2.5 }));
      sink();
      if (wash) water();
    } },

  { name: 'Завтрак всей семьёй', dur: 15,
    cues: [[.5, 4, 'Папа', 'Доедайте, дети, и идём в садик!'],
      [4.4, 8, 'Дилшод', 'Папа, а давай по дороге зайдём в магазин?'],
      [8.4, 11.4, 'Томирис', 'Купим мармеладки и шоколадки!'],
      [11.8, 15, 'Папа', 'Хм… Что скажет Чистон?']],
    draw(t) {
      kitchen(); stovePot(t, false); wallTV('off', t);
      mom(900, 702, .95, { t, apron: true, mood: 'happy' });
      family(t, { food: .3, d: { mood: 'happy', armR: t > 4.4 && t < 8 ? 1.8 : .25 }, tm: { mood: 'happy', armL: t > 8.4 && t < 11.4 ? 2.5 : .2 }, p: { mood: t > 11.8 ? 'wow' : 'happy' } });
      kettle(KX, 498, .6, seg(t, 14, 15), false, t);
      if (t > 8.4 && t < 11.4) { gummy(TX2 + 60, 330, .35, '#ff5a5f', t); chocolate(TX2 + 130, 330, .25); }
    } },

  { name: 'Чистон в чайнике', dur: 7,
    cues: [[.3, 6.6, 'Чистон', 'Подождите! Давайте я покажу по телевизору, что внутри сладостей.']],
    sfx: [[.1, 'power'], [6.4, 'pop']],
    draw(t) {
      kitchen(); stovePot(t, false); wallTV(t > 6.4 ? 'on' : 'off', t);
      mom(900, 702, .95, { t, apron: true });
      family(t, { food: .3, d: { mood: 'wow', look: [1, 0] }, tm: { mood: 'wow', look: [1, 0] }, p: { mood: 'happy' } });
      kettle(KX, 498, .6, 1, speaking('Чистон'), t);
    } },

  { name: 'Что внутри сладостей', dur: 26,
    cues: [[.5, 5, 'Ведущий', 'В мармеладках и шоколадках очень-очень много сахара.'],
      [5.4, 10, 'Ведущий', 'А сахар обожают микробы-Липучки, которые живут на зубках.'],
      [10.4, 15.4, 'Липучки', 'Ням-ням! Сахар! Сейчас мы сделаем дырочку!'],
      [15.8, 21, 'Ведущий', 'Липучки едят сахар — и в зубике появляется дырочка. Зубик болит.'],
      [21.4, 26, 'Ведущий', 'Поэтому сладкое — только чуть-чуть, а потом — почистить зубки.']],
    sfx: [[2, 'boing'], [14, 'error']],
    draw(t) {
      ctx.fillStyle = '#fff1f4'; ctx.fillRect(0, 0, W, H);
      pill(640, 30, 'Что внутри сладостей?', 34, '#ff7aa2', '#ffffff', 'center');
      if (t < 10.4) {
        gummy(330, 380, 1.3, '#ff5a5f', t); chocolate(950, 380, 1);
        const k = seg(t, 1.5, 5);
        box(495, 290, 290, 210, 24, '#3b8beb'); txt('сахар', 640, 520, 30, '#3b8beb');
        for (let i = 0; i < 12; i++) { const ki = seg(k, i / 14, i / 14 + .3); if (ki <= 0) continue; sugarCube(520 + (i % 4) * 60, 330 + Math.floor(i / 4) * 60 - (1 - ki) * 200, .9); }
        if (t > 5.4) for (let i = 0; i < 4; i++) microbe(560 + i * 60 + Math.sin(t * 3 + i) * 8, 560 + Math.cos(t * 3 + i) * 6, 22, MCOL[i], t, i, seg(t, 5.4 + i * .3, 6 + i * .3));
      } else {
        const hole = seg(t, 13, 18);
        tooth(640, 420, 1.5, hole, t > 15.8, t);
        if (t < 21.4) for (let i = 0; i < 4; i++) { const a = t * 1.5 + i * Math.PI / 2; const mx = 640 + Math.cos(a) * 230, my = 300 + Math.sin(a) * 90; microbe(mx, my, 24, MCOL[i], t, i); sugarCube(mx + 26, my + 20, .5 * (1 - hole)); }
        if (t > 15.8 && t < 21.4) speech(860, 160, 'Ой, болит!', 32);
        if (t >= 21.4) { pill(640, 600, 'Сладкое — чуть-чуть, а потом — щётка!', 34, '#0e3a46', '#ffd23f', 'center'); }
      }
      ctx.lineWidth = 26; ctx.strokeStyle = '#1f2430'; rr(13, 13, W - 26, H - 26, 30); ctx.stroke();
    } },

  { name: 'Дети передумали', dur: 18,
    cues: [[.5, 3.6, 'Дилшод', 'Ой! Я не хочу дырочки в зубках!'],
      [3.9, 5.6, 'Томирис', 'И я не хочу!'],
      [6, 10.2, 'Дилшод', 'Папа, лучше дай нам денежку — мы положим её в копилку!'],
      [10.5, 13, 'Томирис', 'И купим что-то полезное!'],
      [13.4, 18, 'Папа', 'Вот это умные дети! Держите — по монетке каждому.']],
    sfx: [[15, 'ding'], [15.6, 'ding']],
    draw(t) {
      kitchen(); stovePot(t, false); wallTV('off', t);
      mom(900, 702, .95, { t, apron: true, mood: t > 13.4 ? 'wow' : 'happy' });
      family(t, { food: 0, d: { mood: t < 3.6 ? 'wow' : 'happy', armR: t > 6 && t < 10.2 ? 1.8 : (t > 15 ? 1.4 : .25) }, tm: { mood: 'happy', armL: t > 15.6 ? 1.4 : .2 }, p: { armR: t > 14.6 && t < 16.4 ? 1.6 : .2 } });
      kettle(KX, 498, .6, 1, false, t);
      if (t > 15) coin(TX + 70, 420 - Math.sin(t * 4) * 4, 14);
      if (t > 15.6) coin(TX2 + 60, 430 - Math.sin(t * 4 + 1) * 4, 14);
    } },

  { name: 'Копилка', dur: 13,
    cues: [[.5, 2.8, 'Дети', 'Дзинь! Дзинь!'],
      [3.2, 7.4, 'Чистон', 'Монетка к монетке — и копилка растёт!'],
      [7.8, 10.2, 'Дилшод', 'Мы накопим на мяч!'],
      [10.5, 13, 'Томирис', 'А я — на книжку!']],
    sfx: [[1, 'ding'], [2, 'ding']],
    draw(t) {
      bedroom({ mirrorOn: 1, mirrorTalk: speaking('Чистон'), t });
      line(1060, 410, 1100, 412, '#2d3142', 3); pixel(1060, 410, .5, { t, mood: 'happy' });
      piggy(980, 412, .55, t);
      [1, 2].forEach((tt, i) => { const k = seg(t, tt - .6, tt); if (k > 0 && k < 1) coin(980, 300 + k * 30, 12); });
      kid(700, 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: t < 1.2 ? 1.6 : (t > 7.8 && t < 10.2 ? 2.6 : .2) });
      tomiris(850, 704, 1, { t, mood: 'happy', armR: t > 1 && t < 2.2 ? 2 : .2, armL: t > 10.5 ? 2.6 : .2 });
      if (t > 7.8 && t < 10.5) { ballAt(560, 330, t); }
      if (t > 10.5) { box(880, 300, 80, 60, 6, '#3b8beb'); box(918, 300, 4, 60, 0, '#ffffff'); txt('АБВ', 920, 330, 18, '#ffffff'); }
    } },

  { name: 'В садик', dur: 11,
    cues: [[.5, 3, 'Папа', 'А теперь — в садик!'],
      [3.4, 10.6, 'Рассказчик', 'Иногда немножко сладкого можно — после еды. А потом обязательно почистить зубки!']],
    draw(t) {
      street(t, 70);
      const b = i => Math.abs(Math.sin(t * 6 + i)) * 6;
      papa(640, 702 - b(0), .9, { t, talk: speaking('Папа'), handL: [-130, -230], handR: [130, -230] });
      kid(470, 700 - b(1), 1, { t, mood: 'happy', handR: [60, -150] });
      tomiris(810, 712 - b(2), 1, { t, mood: 'happy', handL: [-60, -160] });
      backpack(400, 470, 1);
    } },

  { name: 'Конец', dur: 6,
    cues: [[.8, 5.4, 'Рассказчик', 'Конец пятой серии. Береги зубки — и копи монетки!']],
    draw(t) { titleCard(t, 'Конец', 'пятой серии', 'Береги зубки — копи монетки'); } }
];
function ballAt(x, y, t) { circ(x, y, 20, '#ffffff'); ctx.save(); ctx.beginPath(); ctx.arc(x, y, 20, 0, TAU); ctx.clip(); box(x - 22, y - 5 + Math.sin(t * 8) * 6, 44, 10, 0, '#ff5a5f'); ctx.restore(); }
