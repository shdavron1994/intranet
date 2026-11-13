/* ---------- episode 6: Помощники ---------- */
const TOYS = [['car', 600, 690, '#ffd23f'], ['car', 380, 700, '#5dff9a'], ['block', 520, 700, '#ff5a5f'], ['block', 760, 696, '#3b8beb'], ['block', 440, 690, '#b06bff'], ['sock', 860, 700]];
function toyAt(tp, x, y, t) {
  if (tp[0] === 'car') carChar(x, y, 1.1, tp[3], false, t);
  else if (tp[0] === 'block') block(x, y, tp[3]);
  else sockChar(x, y, .9, 1.3, false, t);
}
function basket(x, y) { box(x - 50, y - 40, 100, 60, 14, '#d9a46c'); for (let i = 0; i < 4; i++) line(x - 44 + i * 28, y - 36, x - 44 + i * 28, y + 16, '#b8834f', 3); ell(x - 10, y - 42, 30, 10, '#9fc3ff'); ell(x + 20, y - 44, 24, 9, '#ffc2d6'); }

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия шестая: «Помощники».']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 6. Помощники', 'мультфильм-прототип'); } },

  { name: 'Много дел', dur: 14,
    cues: [[1, 4.6, 'Мама', 'Ох, сколько сегодня дел: уборка, цветы, обед…'],
      [5, 8.2, 'Рассказчик', 'Мама устала, а дети сидели в планшете.'],
      [9, 14, 'Чистон', 'Дилшод, Томирис! Посмотрите на маму. Ей нужна помощь!']],
    sfx: [[8.6, 'power']],
    draw(t) {
      livingRoom({ tv: t < 8.6 ? 'off' : 'chiston', talk: speaking('Чистон'), sky: .2, clock: 1, t });
      toyBox(780, 625);
      TOYS.forEach(tp => toyAt(tp, tp[1], tp[2], t));
      sofaBack();
      kid(920, 640, 1, { t, hold: 'phone', handR: [30, -150], glow: '#7fe3ff', look: [0, .7], mood: t > 9 ? 'wow' : 'happy' });
      tomiris(1070, 650, 1, { t, look: [-1, .6], mood: t > 9 ? 'wow' : 'happy' });
      sofaFront();
      const m = mom(560, 702, .95, { t, talk: speaking('Мама'), handL: [-40, -200], handR: [40, -200], mood: 'happy' });
      basket((m.hl[0] + m.hr[0]) / 2, m.hl[1] + 10);
    } },

  { name: 'Мы поможем', dur: 11,
    cues: [[.5, 3, 'Дети', 'Мама, мы поможем!'],
      [3.4, 6, 'Мама', 'Правда? Вот спасибо!'],
      [6.4, 11, 'Чистон', 'Папа и мама помогают друг другу. И вы — как они!']],
    draw(t) {
      livingRoom({ tv: 'chiston', talk: speaking('Чистон'), sky: .2, clock: 1, t });
      toyBox(780, 625);
      TOYS.forEach(tp => toyAt(tp, tp[1], tp[2], t));
      const k = ease(seg(t, 0, 1.2));
      mom(560, 702, .95, { t, talk: speaking('Мама'), mood: t > 3.4 ? 'wow' : 'happy', armL: t > 3.4 && t < 6 ? 2.4 : .2, armR: t > 3.4 && t < 6 ? 2.4 : .2 });
      kid(lerp(920, 720, k), 690 - Math.abs(Math.sin(t * 9)) * 10 * (k < 1), 1, { t, talk: speaking('Дилшод'), mood: 'happy', armL: 2.4 });
      tomiris(lerp(1070, 880, k), 704 - Math.abs(Math.sin(t * 9 + 1)) * 10 * (k < 1), 1, { t, mood: 'happy', armR: 2.4 });
    } },

  { name: 'Игрушки в коробку', dur: 14,
    cues: [[1, 4.4, 'Дилшод', 'Машинки — в коробку, кубики — тоже!'],
      [5, 8, 'Томирис', 'И носочек — в корзину!'],
      [10, 13.6, 'Мама', 'Какой порядок! Спасибо, мои хорошие!']],
    sfx: [[2, 'pop'], [3, 'pop'], [4, 'pop'], [5.2, 'pop'], [6.2, 'pop'], [7.4, 'pop']],
    draw(t) {
      livingRoom({ tv: 'off', sky: .25, clock: 1.5, t });
      toyBox(780, 625);
      basket(1150, 690);
      TOYS.forEach((tp, i) => {
        const st = 1.5 + i * 1, k = seg(t, st, st + .8);
        const to = tp[0] === 'sock' ? [1150, 640] : [780, 590];
        if (k >= 1) return;
        toyAt(tp, lerp(tp[1], to[0], k), lerp(tp[2], to[1], k) - Math.sin(Math.PI * k) * 150, t);
      });
      kid(640, 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: t > 1.5 && t < 6 ? 1.2 + Math.sin(t * 6) * .4 : .2 });
      tomiris(990, 704, 1, { t, mood: 'happy', armR: t > 6.5 && t < 8 ? 1.5 : .2 });
      if (t > 9) mom(300, 702, .95, { t, talk: speaking('Мама'), mood: 'wow', armL: 2.4, armR: 2.4 });
      pill(28, 26, 'Помогаем маме: 1 из 3', 30, '#ffd23f', '#0e3a46');
    } },

  { name: 'Цветы', dur: 12,
    cues: [[1, 3.8, 'Томирис', 'Цветочки, пейте водичку!'],
      [6, 11.4, 'Рассказчик', 'Цветы попили водички и раскрыли лепестки.']],
    draw(t) {
      livingRoom({ tv: 'off', sky: .3, clock: 2, t });
      box(460, 300, 320, 18, 6, '#ffffff');
      const g = seg(t, 2, 8);
      flowerPot(520, 300, g, t, '#ff7aa2'); flowerPot(620, 300, seg(t, 3, 9), t, '#b06bff'); flowerPot(720, 300, seg(t, 4, 10), t, '#ff9f1c');
      const cx = lerp(470, 760, seg(t, 1.5, 9));
      if (t > 1.5 && t < 9.5) for (let i = 0; i < 4; i++) { const k = ((t * 2 + i / 4) % 1); circ(cx + 60, 250 + k * 60, 4, 'rgba(80,170,255,.8)'); }
      tomiris(cx - 40, 704, 1.2, { t, mood: 'happy', handR: [10, -330] });
      wateringCan(cx, 250, t > 1.5 && t < 9.5 ? .4 : 0);
      kid(1050, 690, 1, { t, mood: 'happy' });
      pill(28, 26, 'Помогаем маме: 2 из 3', 30, '#ffd23f', '#0e3a46');
    } },

  { name: 'Накрываем на стол', dur: 14,
    cues: [[1, 3.8, 'Дилшод', 'Тарелки — на стол!'],
      [4.4, 7, 'Томирис', 'А я ложки разложу!'],
      [9, 13.6, 'Мама', 'Вы мои самые лучшие помощники!']],
    sfx: [[2, 'pop'], [2.8, 'pop'], [3.6, 'pop'], [5.2, 'pop'], [6, 'pop'], [6.8, 'pop']],
    draw(t) {
      kitchen(); stovePot(t); fridgeChart(0, null, t);
      mom(900, 702, .95, { t, talk: speaking('Мама'), apron: true, mood: t > 9 ? 'wow' : 'happy', armL: t > 9 ? 2.4 : 1.2 + Math.sin(t * 4) * .2 });
      kid(lerp(820, 380, ease(seg(t, .5, 4))), 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', handL: [-30, -160], handR: [30, -160] });
      tomiris(lerp(860, 600, ease(seg(t, 4, 7))), 704, 1, { t, mood: 'happy', armR: 1.3 });
      table();
      [[330, 2], [480, 2.8], [650, 3.6]].forEach(([x, st]) => plate(x, 500, seg(t, st - .3, st)));
      [[390, 5.2], [540, 6], [710, 6.8]].forEach(([x, st]) => { if (t > st) spoonOnTable(x, 505); });
      pill(28, 26, 'Помогаем маме: 3 из 3', 30, '#ffd23f', '#0e3a46');
    } },

  { name: 'Папа пришёл', dur: 18,
    cues: [[1, 4, 'Папа', 'Ого! Кто так всё убрал?'],
      [4.4, 7, 'Мама', 'Это наши помощники!'],
      [7.4, 11.6, 'Папа', 'Молодцы! За помощь — первая звёздочка на холодильник!'],
      [12, 18, 'Папа', 'Соберёте семь звёздочек — в выходной пойдём в парк!']],
    sfx: [[10.4, 'ding']],
    draw(t) {
      kitchen(); stovePot(t, false);
      fridgeChart(t > 10.4 ? 1 : 0, seg(t, 10.4, 11), t);
      table(); [330, 480, 650].forEach(x => plate(x, 500, 1)); [390, 540, 710].forEach(x => spoonOnTable(x, 505));
      mom(860, 702, .95, { t, talk: speaking('Мама'), apron: true, mood: 'happy' });
      const k = ease(seg(t, 0, 1.2));
      papa(lerp(1420, 1040, k), 702, .9, { t, talk: speaking('Папа'), mood: t < 4 ? 'wow' : 'happy', armR: t > 9.6 && t < 11 ? 2.2 : .2 });
      kid(420, 690, 1, { t, mood: 'happy', armL: t > 12 ? 2.4 : .2 });
      tomiris(600, 704, 1, { t, mood: 'happy', armR: t > 12 ? 2.4 : .2 });
      if (t > 12) speech(1000, 140, '7 ★ = парк!', 30);
    } },

  { name: 'Ура, звёздочка', dur: 11,
    cues: [[.5, 2.6, 'Дети', 'Ура! В парк!'],
      [3, 10.6, 'Чистон', 'Помогать маме и папе — значит расти большими и добрыми!']],
    sfx: [[.4, 'fanfare']],
    draw(t) {
      kitchen(); stovePot(t, false); fridgeChart(1, null, t);
      table(); [330, 480, 650].forEach(x => plate(x, 500, 1));
      kettle(760, 498, .6, seg(t, 2.6, 3.4), speaking('Чистон'), t);
      mom(900, 702, .95, { t, apron: true, mood: 'happy' }); papa(1040, 702, .9, { t, mood: 'happy' });
      kid(420, 690 - Math.abs(Math.sin(t * 8)) * 30 * (t < 3), 1, { t, talk: speaking('Дилшод'), mood: 'happy', armL: 2.6, armR: 2.6 });
      tomiris(600, 704 - Math.abs(Math.sin(t * 8 + 1)) * 30 * (t < 3), 1, { t, mood: 'happy', armL: 2.6, armR: 2.6 });
      if (t < 3) confetti(t);
    } },

  { name: 'Конец', dur: 6,
    cues: [[.8, 5.4, 'Рассказчик', 'Конец шестой серии. Помогайте маме и папе!']],
    draw(t) { titleCard(t, 'Конец', 'шестой серии', 'Помогать — значит любить'); } }
];
