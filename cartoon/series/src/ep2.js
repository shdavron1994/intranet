/* ---------- episode 2: Завтрак ---------- */
const TX = 480, TY = 640; // Timur at the table
function seated(t, o) {
  chairBack(TX);
  const p = kid(TX, TY, 1, Object.assign({ dirty: 0, dirtyHands: 0, t, talk: speaking('Тимур') }, o));
  table();
  return p;
}
function phoneOnTable(x) { box(x - 30, 486, 60, 14, 5, '#1f2430'); box(x - 26, 488, 52, 8, 3, '#3a4152'); }
function throat(t) {
  ctx.fillStyle = '#fff1f4'; ctx.fillRect(0, 0, W, H);
  pill(28, 26, 'Как устроено горло', 30, '#ffd23f', '#0e3a46');
  miniChiston(1160, 150, .55, 1, { talk: speaking('Чистон'), t });
  ctx.save(); ctx.translate(0, -60);
  // funnel and two tubes
  ctx.beginPath(); ctx.moveTo(460, 130); ctx.lineTo(820, 130); ctx.lineTo(760, 300); ctx.lineTo(530, 300); ctx.closePath(); ctx.fillStyle = '#ffb3c1'; ctx.fill();
  box(540, 296, 80, 300, 30, '#9ad0ff'); for (let y = 320; y < 590; y += 26) line(548, y, 612, y, 'rgba(40,110,180,.35)', 4);
  box(670, 296, 80, 300, 30, '#ffcf99');
  ell(520, 640, 60, 70, '#ff8fab'); ell(640, 640, 60, 70, '#ff8fab'); box(570, 560, 20, 60, 8, '#9ad0ff');
  ctx.beginPath(); ctx.ellipse(760, 640, 80, 56, -.3, 0, TAU); ctx.fillStyle = '#ffab5c'; ctx.fill();
  const la = seg(t, 0, 1.5);
  ctx.globalAlpha = la;
  pill(250, 400, 'для воздуха', 30, '#3b8beb', '#ffffff'); line(470, 432, 535, 432, '#3b8beb', 5);
  pill(830, 400, 'для еды', 30, '#ff9f1c', '#ffffff'); line(755, 432, 825, 432, '#ff9f1c', 5);
  txt('лёгкие', 400, 610, 26, '#c2185b'); txt('желудок', 920, 610, 26, '#b35a00');
  ctx.globalAlpha = 1;
  // the little door over the air tube
  const closed = (t >= 4.4 && t < 8.6) ? 1 : 0;
  const k = closed ? seg(t, 4.4, 5) : 1 - seg(t, 8.6, 9.2);
  const ang = lerp(-Math.PI * .62, -Math.PI, ease(k));
  line(622, 300, 622 + Math.cos(ang) * 82, 300 + Math.sin(ang) * 82, '#ff4f7a', 14);
  if (t >= 4 && t < 9.5) pill(330, 230, 'дверка', 26, '#ff4f7a', '#ffffff');
  function crumb(x, y, scared) { circ(x, y, 17, '#f0b73c'); circ(x - 6, y - 3, 4, '#1b2a41'); circ(x + 6, y - 3, 4, '#1b2a41'); if (scared) ell(x, y + 7, 4, 5, '#1b2a41'); }
  if (t >= 4.6 && t < 9) {
    const c = seg(t, 4.8, 8.4);
    const p = c < .35 ? [lerp(640, 710, c / .35), lerp(150, 310, c / .35)] : [710, lerp(310, 620, (c - .35) / .65)];
    crumb(p[0], p[1], false);
  }
  if (t >= 9.2 && t < 16.2) {
    let p;
    if (t < 14.4) { const c = seg(t, 9.6, 11.2); p = [lerp(640, 580, c), lerp(150, 380, c)]; }
    else { const c = seg(t, 14.4, 16); p = [lerp(580, 640, c), lerp(380, 60, c)]; }
    crumb(p[0], p[1], true);
    if (t >= 11.2 && t < 14.4) { const pu = .5 + .5 * Math.sin(t * 10); ctx.beginPath(); ctx.arc(580, 380, 40 + pu * 8, 0, TAU); ctx.strokeStyle = 'rgba(230,30,60,.8)'; ctx.lineWidth = 6; ctx.stroke(); speech(500, 300, 'Ой!', 30); }
    if (t >= 14.4) { for (let i = 0; i < 3; i++) line(560 + i * 20, 420, 560 + i * 20, 340 - seg(t, 14.4, 15) * 40, 'rgba(59,139,235,.8)', 5); speech(820, 200, 'Кхе-кхе!', 32); }
  }
  ctx.restore();
  if (t >= 18) pill(640, 520, 'Прожевал, проглотил — потом говори!', 36, '#0e3a46', '#ffd23f', 'center');
}

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия вторая: «Завтрак».']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 2. Завтрак', 'мультфильм-прототип'); } },

  { name: 'Телефон за столом', dur: 13,
    cues: [[1, 4.6, 'Мама', 'Тимур, убери телефон. За столом не смотрят.'],
      [5, 8, 'Тимур', 'Ну мам, ещё одну серию!']],
    draw(t) {
      kitchen(); stovePot(t);
      mom(1010, 702, .95, { t, talk: speaking('Мама'), apron: true, armL: t < 1 || t > 9 ? 1.2 + Math.sin(t * 4) * .25 : .3 });
      seated(t, { hold: 'phone', handR: [30, -150], glow: '#7fe3ff', look: [0, .7], redEyes: seg(t, 8, 12), mood: 'happy' });
      kettle(660, 498, .7, 0, false, t);
    } },

  { name: 'Чистон в чайнике', dur: 15,
    cues: [[.6, 4.4, 'Чистон', 'Тимур, посмотри на себя: глаза красные!'],
      [4.6, 10, 'Чистон', 'Когда долго смотришь в экран, глаза устают. Они чешутся, слезятся и могут хуже видеть вдаль.'],
      [10.2, 12, 'Тимур', 'А что же делать?'],
      [12.2, 15, 'Чистон', 'Давать глазкам отдых! Давай гимнастику для глаз!']],
    sfx: [[.2, 'power']],
    draw(t) {
      kitchen(); stovePot(t);
      mom(1010, 702, .95, { t, apron: true, armL: 1.2 + Math.sin(t * 4) * .25 });
      const rub = t >= 6.5 && t < 9.5, sc = Math.sin(t * 12) * 5;
      const phone = t < 10;
      seated(t, Object.assign({ redEyes: 1, mood: t < 6.5 ? 'wow' : 'happy', look: [.8, 0] },
        rub ? { handL: [-24 + sc, -268], handR: [24 - sc, -268], closed: true } : phone ? { hold: 'phone', handR: [30, -150], glow: '#7fe3ff' } : {}));
      if (!phone) phoneOnTable(380);
      kettle(660, 498, .7, seg(t, 0, 1), speaking('Чистон'), t);
    } },

  { name: 'Гимнастика для глаз', dur: 23,
    cues: [[0, 3.5, 'Чистон', 'Глазки вверх — вниз!'],
      [3.5, 7, 'Чистон', 'Вправо — влево!'],
      [7, 10.5, 'Чистон', 'Поморгай быстро-быстро!'],
      [10.5, 14, 'Чистон', 'А теперь посмотри в окно, вдаль.'],
      [14, 17, 'Чистон', 'А за едой экран выключаем.'],
      [17.2, 20.4, 'Тимур', 'Мама, возьми телефон. Я потом посмотрю.'],
      [20.6, 23, 'Мама', 'Спасибо, сынок!']],
    draw(t) {
      kitchen(); stovePot(t);
      const mx = t < 17.5 ? 1010 : lerp(1010, 720, ease(seg(t, 17.5, 19)));
      const took = t >= 20.4;
      const m = mom(mx, 702, .95, { t, talk: speaking('Мама'), apron: true, armL: t > 19 && t < 20.6 ? 1.2 : (t < 17.5 ? 1.2 + Math.sin(t * 4) * .25 : .3) });
      let look = [0, 0], closed = false;
      if (t < 3.5) look = [0, Math.sin(t * 3)];
      else if (t < 7) look = [Math.sin(t * 3), 0];
      else if (t < 10.5) closed = Math.sin(t * 22) > 0;
      else if (t < 14) look = [-1, -.6];
      const give = t >= 17.2 && t < 20.4;
      seated(t, Object.assign({ redEyes: 1 - seg(t, 10.5, 14), look, closed, mood: 'happy' }, give ? { hold: 'phone', armR: 1.5 + seg(t, 17.2, 18.5) * .3, glow: '#2d3142' } : {}));
      if (t < 17.2) phoneOnTable(380);
      if (took) { ctx.save(); ctx.translate(m.hl[0], m.hl[1]); box(-14, -40, 28, 46, 6, '#1f2430'); ctx.restore(); }
      kettle(660, 498, .7, 1, speaking('Чистон'), t);
    } },

  { name: 'Не в то горло', dur: 16,
    cues: [[3, 6, 'Тимур', 'Мам, а знаешь, вчера в садике…'],
      [8, 11, 'Мама', 'Тише, тише, откашляйся.'],
      [11.6, 13.8, 'Тимур', 'Кхе… Всё, нормально.'],
      [14, 16, 'Чистон', 'Знаешь, почему так вышло? Смотри!']],
    draw(t) {
      kitchen(); stovePot(t, false);
      const bring = seg(t, 0, 1.6);
      mom(lerp(1010, 720, ease(bring)), 702, .95, { t, talk: speaking('Мама'), apron: true, hold: t < 1.8 ? 'bowl' : null, armL: t < 1.8 ? 1.1 : (t > 8 && t < 11 ? 1.5 : .3), armR: t < 1.8 ? 1.1 : .2 });
      const cough = t >= 6.6 && t < 11.2;
      const shake = cough ? Math.sin(t * 40) * 5 : 0;
      const eat = t >= 1.8 && t < 3;
      const spoonUp = eat ? Math.abs(Math.sin((t - 1.8) * Math.PI * 1.6)) : 0;
      chairBack(TX);
      kid(TX + shake, TY, 1, { t, talk: speaking('Тимур') || (t >= 6 && t < 6.6), full: t >= 2.6 && t < 6.6, mood: cough ? 'sad' : 'happy', closed: cough && Math.sin(t * 9) > 0,
        hold: t < 6.6 ? 'spoon' : null, handR: t < 6.6 ? [40, -150 - spoonUp * 50] : (cough ? [10, -226] : null), spoonTo: t < 6.6 ? [6, -184 - spoonUp * 50] : null });
      table();
      if (t >= 1.8) bowl(TX, 500, 1);
      if (cough) speech(TX + 120, 300, 'Кхе-кхе!', 30);
      kettle(660, 498, .7, 1, speaking('Чистон'), t);
    } },

  { name: 'Две дорожки', dur: 22,
    cues: [[0, 4, 'Чистон', 'В горле две дорожки: одна для еды, другая для воздуха.'],
      [4.2, 9, 'Чистон', 'Над дорожкой для воздуха есть маленькая дверка. Когда глотаешь, она закрывается.'],
      [9.2, 14, 'Чистон', 'А если говоришь или смеёшься с полным ртом, дверка открыта — и крошка сворачивает не туда!'],
      [14.2, 17.8, 'Чистон', 'Тогда горло кашляет, чтобы её выгнать.'],
      [18, 22, 'Чистон', 'Поэтому: прожевал, проглотил — потом говори!']],
    sfx: [[11.2, 'error'], [14.4, 'boing']],
    draw(t) { throat(t); } },

  { name: 'Правила завтрака', dur: 14,
    cues: [[0, 4, 'Чистон', 'Правила завтрака: сидим ровно и едим не спеша.'],
      [4.2, 8, 'Чистон', 'Хорошо жуём. Прожевал, проглотил — потом говори!'],
      [9.6, 12.2, 'Тимур', 'Мам, каша очень вкусная!'],
      [12.4, 14, 'Мама', 'Я рада!']],
    draw(t) {
      kitchen(); stovePot(t, false);
      mom(720, 702, .95, { t, talk: speaking('Мама'), apron: true });
      const cyc = (t % 2.4) / 2.4, eating = t < 9.4, up = eating ? Math.max(0, Math.sin(cyc * Math.PI * 2)) : 0;
      chairBack(TX);
      kid(TX, TY, 1, { t, talk: speaking('Тимур'), mood: 'happy', full: eating && cyc > .45, hold: 'spoon', handR: [40, -150 - up * 50], spoonTo: [6, -184 - up * 50] });
      table(); bowl(TX, 500, 1 - seg(t, 0, 14) * .8);
      kettle(660, 498, .7, 1, speaking('Чистон'), t);
      const rules = ['Сидим ровно', 'Едим не спеша', 'Хорошо жуём', 'Прожевал — потом говори'];
      checklist(rules, Math.min(4, Math.floor(seg(t, .3, 7.5) * 4) + 1), t > 8 ? 4 : 0, 800, 60, 'Правила завтрака');
    } },

  { name: 'Спасибо, мама', dur: 16,
    cues: [[0, 2.8, 'Тимур', 'Спасибо, мама! Я всё доел.'],
      [7, 9.4, 'Чистон', 'А теперь что?'],
      [9.6, 13, 'Тимур', 'Помыть руки и прополоскать рот!']],
    sfx: [[15, 'ding']],
    draw(t) {
      kitchen(); stovePot(t, false);
      mom(660, 702, .95, { t, apron: true, mood: 'happy' });
      const walk = seg(t, 3, 6.4);
      if (t < 3) { chairBack(TX); kid(TX, TY, 1, { t, talk: speaking('Тимур'), mood: 'happy' }); table(); bowl(TX, 500, 0); kettle(560, 498, .7, 1, speaking('Чистон'), t); return; }
      table();
      kettle(560, 498, .7, 1, speaking('Чистон'), t);
      box(990, 640, 110, 60, 8, '#ffd23f');
      const x = lerp(TX, 1045, ease(walk)), y = walk < 1 ? 700 - Math.abs(Math.sin(t * 8)) * 6 : 640;
      const wash = t >= 11 && t < 15.6, sc = Math.sin(t * 14) * 8;
      const pr = kid(x, y, 1, Object.assign({ t, talk: speaking('Тимур'), mood: 'happy' },
        wash ? { handL: [-26 + sc, -218], handR: [26 - sc, -218] } : walk < 1 ? { handL: [-20, -170], handR: [20, -170] } : {}));
      if (walk < 1) bowl(x, 700 - 170 + 14, 0);
      else if (!wash || t < 11) bowl(1040, 430, 0);
      if (wash) { ctx.fillStyle = 'rgba(120,200,255,.75)'; ctx.fillRect(1036, 396, 8, pr.hl[1] - 396); foam((pr.hl[0] + pr.hr[0]) / 2, pr.hl[1], seg(t, 11, 11.8) * (1 - seg(t, 15, 15.6)), t); }
    } },

  { name: 'В садик', dur: 20,
    cues: [[.5, 3, 'Кроссовки', 'Мы здесь! Обувайся!'],
      [5, 7.6, 'Мама', 'Молодец! Поехали в садик.'],
      [12, 14.4, 'Тимур', 'Пока, Чистон!'],
      [14.6, 18, 'Чистон', 'До завтра, утренний герой!']],
    sfx: [[3.2, 'boing'], [8.4, 'power']],
    draw(t) {
      if (t < 8) {
        hallway();
        const k = seg(t, 0, 2.4), bk = seg(t, 3, 4.6);
        if (bk < 1) { const p = fly([440, 232], [560, 470], bk, 120); backpack(p[0], p[1], 1); }
        else backpack(600, 470, 1);
        kid(640, 690, 1, { t, talk: speaking('Тимур'), mood: 'happy', armL: t > 5 ? 2.6 + Math.sin(t * 6) * .25 : .25 });
        if (bk >= 1) { line(600, 486, 610, 560, '#c46f00', 7); line(680, 486, 670, 560, '#c46f00', 7); }
        sneaker(lerp(1400, 720, ease(k)), 700 - Math.abs(Math.sin(t * 9)) * 26 * (k < 1), 1, true, -2);
        sneaker(lerp(1500, 800, ease(k)), 704 - Math.abs(Math.sin(t * 9 + 1)) * 26 * (k < 1), 1, true, -2);
        if (t >= 4.4) mom(lerp(1300, 880, ease(seg(t, 4.4, 5.4))), 702, .95, { t, talk: speaking('Мама'), armL: t > 5.4 ? 1.2 : .15 });
        if (t > 7.5) { ctx.fillStyle = `rgba(6,18,22,${seg(t, 7.5, 8)})`; ctx.fillRect(0, 0, W, H); }
        return;
      }
      const s = t - 8, moving = s < 10.6 || true;
      street(t, s < 2 ? 260 * seg(s, 0, 2) : 260);
      const cx = s < 2 ? lerp(-260, 560, ease(seg(s, 0, 2))) : s < 10 ? 560 : lerp(560, 1600, ease(seg(s, 10, 12)));
      car(cx, 640 - Math.abs(Math.sin(t * 6)) * 3, t, moving);
      if (s >= 3.6 && s < 10.4) {
        const a = seg(s, 3.6, 4.2) * (1 - seg(s, 9.8, 10.4));
        ctx.globalAlpha = a;
        box(860, 50, 380, 150, 40, '#2d3142'); box(872, 62, 356, 126, 32, '#c9f4ff');
        faceOf(1050, 122, .5, speaking('Чистон'), t);
        txt('зеркало заднего вида', 1050, 222, 20, '#ffffff');
        ctx.globalAlpha = 1;
      }
      if (s < .5) { ctx.fillStyle = `rgba(6,18,22,${1 - seg(s, 0, .5)})`; ctx.fillRect(0, 0, W, H); }
    } },

  { name: 'Конец', dur: 7,
    cues: [[.8, 5.6, 'Рассказчик', 'Конец второй серии. Тимур — настоящий утренний герой!']],
    draw(t) { titleCard(t, 'Конец', 'второй серии', 'Утренний герой едет в садик'); } }
];
