/* ---------- episode 3: Пойдём гулять! ---------- */
function ballAt(x, y, t) { circ(x, y, 20, '#ffffff'); ctx.save(); ctx.beginPath(); ctx.arc(x, y, 20, 0, TAU); ctx.clip(); box(x - 22, y - 5 + Math.sin(t * 8) * 6, 44, 10, 0, '#ff5a5f'); ctx.restore(); }
function playground(t, o) {
  o = Object.assign({ sky: .2 }, o);
  const g = ctx.createLinearGradient(0, 0, 0, 480); g.addColorStop(0, skyCol(o.sky)); g.addColorStop(1, '#e8f7ff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 500);
  circ(1120, 100, 44, o.sky > .6 ? '#ffb347' : '#ffe066');
  [[90, 380, 70], [190, 400, 56], [1220, 390, 64]].forEach(p => { box(p[0] - 8, p[1], 16, 110, 4, '#8a5a3c'); circ(p[0], p[1], p[2], '#5fbf6a'); });
  ell(400, 120, 80, 22, '#ffffff'); ell(450, 110, 56, 20, '#ffffff');
  ctx.fillStyle = '#8fd16a'; ctx.fillRect(0, 490, W, 230);
  ell(640, 640, 520, 60, '#a8dc84');
  // slide
  box(300, 330, 16, 220, 4, '#ff9f1c'); box(372, 330, 16, 220, 4, '#ff9f1c');
  for (let y = 360; y < 540; y += 36) line(306, y, 382, y, '#ff9f1c', 6);
  ctx.beginPath(); ctx.moveTo(380, 340); ctx.lineTo(560, 540); ctx.lineTo(530, 552); ctx.lineTo(372, 368); ctx.closePath(); ctx.fillStyle = '#ffd23f'; ctx.fill();
  // swings frame
  line(820, 290, 780, 560, '#3b8beb', 12); line(1060, 290, 1100, 560, '#3b8beb', 12); line(810, 290, 1070, 290, '#3b8beb', 14);
  // sandbox
  box(560, 560, 200, 60, 10, '#c98b55'); box(572, 566, 176, 40, 8, '#f3dca0');
}
function swing(px, py, L, a, rider) {
  const sx = px + Math.sin(a) * L, sy = py + Math.cos(a) * L;
  line(px - 28, py, sx - 28, sy, '#555', 4); line(px + 28, py, sx + 28, sy, '#555', 4);
  if (rider) rider(sx, sy);
  box(sx - 40, sy - 6, 80, 12, 4, '#ff5a5f');
  return [sx, sy];
}
const BOY = { shirt: '#5fbf6a', pants: '#3a3f5c' }, GIRL = { girl: true, shirt: '#ffd23f' };

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия третья: «Пойдём гулять!»']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 3. Пойдём гулять!', 'мультфильм-прототип'); } },

  { name: 'Дома после садика', dur: 12,
    cues: [[1.2, 4.6, 'Мама', 'Ну вот мы и дома! Разувайтесь и мойте руки.'],
      [4.9, 7, 'Дети', 'Хорошо, мама!'],
      [7.6, 11.6, 'Рассказчик', 'Дети помыли руки… а потом…']],
    draw(t) {
      hallway();
      box(1000, 170, 160, 390, 4, '#3b2a1e');
      const k = ease(seg(t, 0, 1.4));
      mom(lerp(1100, 860, k), 702 - Math.abs(Math.sin(t * 8)) * 6 * (k < 1), .95, { t, talk: speaking('Мама') });
      kid(lerp(1060, 620, k), 690 - Math.abs(Math.sin(t * 8 + 1)) * 8 * (k < 1), 1, { t, talk: speaking('Дилшод'), mood: 'happy', armL: t > 4.9 && t < 7 ? 2.5 : .2 });
      tomiris(lerp(1080, 440, k), 704 - Math.abs(Math.sin(t * 8 + 2)) * 8 * (k < 1), 1, { t, mood: 'happy', armR: t > 4.9 && t < 7 ? 2.5 : .2 });
      if (t > 8) { ctx.fillStyle = `rgba(6,18,22,${seg(t, 8, 11.5) * .5})`; ctx.fillRect(0, 0, W, H); }
    } },

  { name: 'Телефон и телевизор', dur: 14,
    cues: [[.5, 5, 'Рассказчик', 'Дилшод взял телефон, а Томирис включила телевизор.'],
      [6, 10.5, 'Рассказчик', 'Прошёл час… потом ещё один…'],
      [11, 13.8, 'Дилшод', 'Ещё один уровень…']],
    draw(t) {
      const pass = seg(t, 6, 11);
      livingRoom({ tv: 'on', sky: pass * .8, clock: 3 + pass * 2, t });
      sofaBack();
      kid(SOFA_X, 640, 1, { t, talk: speaking('Дилшод'), hold: 'phone', handR: [30, -150], glow: '#7fe3ff', look: [0, .7], redEyes: pass, mood: 'happy', tilt: pass * .08 });
      sofaFront();
      tomiris(470, 704, 1, { t, look: [-1, 0], redEyes: pass, mood: 'happy', tilt: -pass * .06 });
      if (t > 6 && t < 11) pill(1180, 210, '+1 час', 24, '#ff5a5f', '#ffffff', 'center');
    } },

  { name: 'Чистон в телевизоре', dur: 22,
    cues: [[1, 5, 'Чистон', 'Стоп-стоп-стоп! Дилшод, Томирис, вы уже два часа смотрите в экраны!'],
      [5.2, 9.5, 'Чистон', 'Глазки устали, спинка устала, а ножки совсем заскучали.'],
      [9.8, 12, 'Дилшод', 'Но мне интересно!'],
      [12.2, 14, 'Томирис', 'А мне мультик!'],
      [14.3, 18.5, 'Чистон', 'Экран — как конфета: немножко можно, а много — вредно.'],
      [18.7, 22, 'Чистон', 'Посмотрите-ка в окно. Кто там играет?']],
    sfx: [[.5, 'power']],
    draw(t) {
      livingRoom({ tv: t < .5 ? 'on' : 'chiston', talk: speaking('Чистон'), sky: .8, clock: 5, t });
      if (t >= .5 && t < .8) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(80, 290, 300, 162); }
      sofaBack();
      const toWin = t >= 19;
      kid(SOFA_X, 640, 1, { t, talk: speaking('Дилшод'), hold: t < 9.8 ? 'phone' : null, handR: t < 9.8 ? [30, -150] : null, glow: '#7fe3ff', look: toWin ? [-1, -1] : [-1, 0], redEyes: 1, mood: t < 5 ? 'wow' : 'happy' });
      sofaFront();
      tomiris(470, 704, 1, { t, look: toWin ? [1, -1] : [-1, 0], redEyes: 1, mood: t < 5 ? 'wow' : 'happy' });
    } },

  { name: 'За окном', dur: 10.5,
    cues: [[1, 4, 'Дилшод', 'Ой, там ребята в мяч играют!'],
      [4.3, 6.6, 'Томирис', 'И качели!'],
      [7, 10.5, 'Дети', 'Пойдём гулять!']],
    draw(t) {
      livingRoom({ tv: 'chiston', sky: .8, clock: 5, t });
      ctx.fillStyle = 'rgba(6,18,22,.35)'; ctx.fillRect(0, 0, W, H);
      const k = ease(seg(t, 0, .8));
      ctx.save(); ctx.translate(640, 330); ctx.scale(lerp(.3, .78, k), lerp(.3, .78, k)); ctx.translate(-640, -360);
      box(-14, -14, W + 28, H + 28, 30, '#ffffff');
      ctx.save(); rr(0, 0, W, H, 20); ctx.clip();
      playground(t, { sky: .4 });
      const bx = lerp(420, 760, (Math.sin(t * 2) + 1) / 2), by = 470 - Math.abs(Math.cos(t * 2)) * 120;
      kid(360, 640, 1, Object.assign({ t, mood: 'happy', armL: 1.4 }, BOY));
      kid(820, 650, .85, Object.assign({ t, mood: 'happy', armR: 1.4, shirt: '#ff9f1c' }, {}));
      ballAt(bx, by, t);
      swing(940, 290, 200, Math.sin(t * 2.2) * .4, (sx, sy) => kid(sx, sy + 70, .75, Object.assign({ t, mood: 'happy', squat: .6, armL: 2.9, armR: 2.9 }, GIRL)));
      ctx.restore(); ctx.restore();
      pill(640, 40, 'За окном', 28, '#ffd23f', '#0e3a46', 'center');
      kid(1020, 820, 1.1, { t, talk: speaking('Дилшод'), mood: 'wow' });
      tomiris(240, 820, 1.4, { t, mood: 'wow' });
    } },

  { name: 'Экраны отдыхают', dur: 14,
    cues: [[1, 5, 'Чистон', 'Молодцы! Экраны отдыхают — и вы тоже!'],
      [6.5, 8.5, 'Мама', 'Куда собрались?'],
      [8.7, 11, 'Дети', 'Гулять, мама! Можно?'],
      [11.2, 14, 'Мама', 'Конечно! Одевайтесь, я пойду с вами.']],
    sfx: [[.6, 'pop'], [4.8, 'pop']],
    draw(t) {
      livingRoom({ tv: t < 5.2 ? 'chiston' : 'off', talk: speaking('Чистон'), sky: .8, clock: 5, t });
      box(300, 448, 70, 14, 4, '#2d3142');
      const put = seg(t, .3, 1.6);
      kid(lerp(SOFA_X, 470, ease(put)), 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armL: put > 0 && put < 1 ? 1.5 : .2 });
      if (put < 1) { const px = lerp(SOFA_X - 40, 335, ease(put)); box(px - 18, 470 - put * 30, 36, 60, 6, '#1f2430'); } else box(318, 420, 34, 28, 4, '#1f2430');
      tomiris(700, 704, 1, { t, mood: 'happy', armL: t > 3.6 && t < 5 ? 1.3 : .2 });
      if (t > 3.6 && t < 5.4) box(610, 520, 24, 40, 6, '#555b70');
      if (t >= 6) mom(lerp(1400, 1020, ease(seg(t, 6, 7))), 702, .95, { t, talk: speaking('Мама'), mood: t < 8.7 ? 'wow' : 'happy', armR: t > 11.2 ? 2.4 : .15 });
      if (t >= 8.7 && t < 11) { star(470, 360, 16, 7, '#ffd23f'); star(700, 400, 14, 6, '#ffd23f'); }
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
    draw(t) {
      playground(t, { sky: .3 });
      if (t < 20.5) {
        const ph = (t - 4.5) * 1.6, k = (Math.sin(ph - Math.PI / 2) + 1) / 2;
        const bx = t < 4.5 ? 330 : lerp(330, 620, k), by = t < 4.5 ? 560 : 540 - Math.sin(Math.PI * k) * 140;
        kid(280, 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: 1.3 + (1 - k) * .6 });
        kid(670, 690, 1, Object.assign({ t, talk: speaking('Мальчик'), mood: 'happy', armL: 1.3 + k * .6 }, BOY));
        ballAt(bx, by, t);
        const a = Math.sin(t * 2.2) * .45;
        swing(940, 290, 210, a, (sx, sy) => tomiris(sx, sy + 70, 1, { t, mood: 'happy', squat: .6, armL: 2.9, armR: 2.9 }));
        mom(1180, 702, .95, { t, talk: speaking('Мама'), armL: a > .2 ? 1.6 : 1.1 });
        kid(480, 600 + (t > 15.5 ? 0 : 0), .8, Object.assign({ t, talk: speaking('Девочка'), mood: 'happy', armR: t > 15.5 && t < 18 ? 2.4 : .2 }, GIRL));
      } else {
        const s = t - 20.5;
        [[0, 'kid', {}], [1, 'tom', {}], [2, 'kid', BOY], [3, 'kid', GIRL]].forEach(([i, who, look]) => {
          const x = 640 + Math.sin(s * 1.4 + i * 1.6) * 420, y = 690 - Math.abs(Math.sin(s * 8 + i)) * 40;
          if (who === 'tom') tomiris(x, y + 14, 1, { t, mood: 'happy', armL: 2.4, armR: 2.4 });
          else kid(x, y, i === 3 ? .8 : 1, Object.assign({ t, mood: 'happy', armL: 2.4, armR: 2.4 }, look));
        });
        mom(1180, 702, .95, { t, mood: 'happy' });
        confetti(t);
      }
    } },

  { name: 'Домой', dur: 13,
    cues: [[1, 3.5, 'Томирис', 'Сегодня было так весело!'],
      [3.8, 6.5, 'Дилшод', 'Мама, давай завтра опять гулять!'],
      [7, 13, 'Мама', 'Обязательно! Я так рада, что вы играли с ребятами, а не сидели в телефоне.']],
    draw(t) {
      street(t, 60);
      ctx.fillStyle = 'rgba(255,150,80,.22)'; ctx.fillRect(0, 0, W, 520);
      const b = i => Math.abs(Math.sin(t * 6 + i)) * 6;
      mom(640, 702 - b(0), .95, { t, talk: speaking('Мама'), handL: [-120, -190], handR: [120, -190] });
      kid(500, 700 - b(1), 1, { t, talk: speaking('Дилшод'), mood: 'happy', handR: [50, -140] });
      tomiris(780, 712 - b(2), 1, { t, mood: 'happy', handL: [-55, -150] });
    } },

  { name: 'Моем руки', dur: 13,
    cues: [[0, 3.6, 'Чистон', 'Нагулялись? Теперь — мыть руки с мылом!'],
      [4, 9.4, 'Чистон', 'Запомните: мультики — немножко, а играть, бегать и дружить — много-много!'],
      [9.8, 12.6, 'Дети', 'Запомнили!']],
    sfx: [[9.8, 'fanfare']],
    draw(t) {
      bathroom();
      chiston(640, 215, 1, { talk: speaking('Чистон'), t });
      const wash = t >= 1 && t < 9.6, sc = wash ? Math.sin(t * 14) * 8 : 0;
      kid(DXS, SY, 1.1, Object.assign({ t, talk: speaking('Дилшод'), mood: 'happy' }, wash ? DHANDS(sc) : { armL: t > 9.8 ? 2.6 : .2 }));
      tomiris(TXS, TYS, TSC, Object.assign({ t, mood: 'happy' }, wash ? THANDS(sc) : { armR: t > 9.8 ? 2.6 : .2 }));
      sink();
      if (wash) { const k = seg(t, 1, 2) * (1 - seg(t, 9, 9.6)); water(); foam(...DFOAM(), k, t); foam(...TFOAM(), k * .8, t); }
      if (t > 9.8) confetti(t);
    } },

  { name: 'Конец', dur: 6,
    cues: [[.8, 5.4, 'Рассказчик', 'Конец третьей серии. Играйте и дружите!']],
    draw(t) { titleCard(t, 'Конец', 'третьей серии', 'Мультик — немножко, игры — много-много!'); } }
];
