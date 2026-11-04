/* ---------- episode 8: Парк (финал сезона) ---------- */
function holdCone(p, side) { const h = side === 'L' ? p.hl : p.hr; iceCream(h[0], h[1] - 20, 1); }

const SCENES = [
  { name: 'Заставка', dur: 5,
    cues: [[.8, 4.6, 'Рассказчик', 'Чистон. Серия восьмая: «Парк».']],
    draw(t) { titleCard(t, 'Чистон', 'Серия 8. Парк', 'финал сезона'); } },

  { name: 'Наша неделя', dur: 19,
    cues: [[.5, 6, 'Рассказчик', 'Всю неделю Дилшод и Томирис были молодцами.'],
      [6.6, 9.6, 'Папа', 'Осталась последняя звёздочка…'],
      [10, 14, 'Мама', 'А сегодня утром дети сами заправили кровати!'],
      [14.4, 19, 'Папа', 'Вот она — седьмая звёздочка! Ура!']],
    sfx: [[15.6, 'fanfare']],
    draw(t) {
      kitchen(); stovePot(t, false);
      mom(860, 702, .95, { t, talk: speaking('Мама'), apron: true, mood: 'happy' });
      papa(1030, 702, .9, { t, talk: speaking('Папа'), mood: 'happy', armR: t > 15 && t < 16.4 ? 2.2 : .2 });
      kid(420, 690, 1, { t, mood: 'happy', armL: t > 15.6 ? 2.6 : .2, armR: t > 15.6 ? 2.6 : .2 });
      tomiris(600, 704, 1, { t, mood: 'happy', armL: t > 15.6 ? 2.6 : .2, armR: t > 15.6 ? 2.6 : .2 });
      checklist(['Убирали игрушки', 'Помогали маме', 'Выключали экраны', 'Ложились вовремя'], Math.min(4, Math.floor(seg(t, .5, 5.5) * 4) + 1), t > 6 ? 4 : 0, 40, 40, 'Наша неделя');
      starChart(1200, 260, 1.1, t > 15.6 ? 7 : 6, seg(t, 15.6, 16.4), t);
      if (t > 15.6) confetti(t);
    } },

  { name: 'Идём в парк', dur: 9,
    cues: [[.5, 3.6, 'Папа', 'Как обещали — идём в парк!'],
      [4, 6.6, 'Дети', 'Ура! В парк!']],
    draw(t) {
      hallway();
      papa(880, 702, .9, { t, talk: speaking('Папа'), jacket: false, armL: 1.2 });
      mom(1060, 702, .95, { t, mood: 'happy' });
      kid(560, 690 - Math.abs(Math.sin(t * 8)) * 26 * (t > 4), 1, { t, talk: speaking('Дилшод'), mood: 'happy', armL: t > 4 ? 2.6 : .2 });
      tomiris(400, 704 - Math.abs(Math.sin(t * 8 + 1)) * 26 * (t > 4), 1, { t, mood: 'happy', armR: t > 4 ? 2.6 : .2 });
      if (t > 7.4) { ctx.fillStyle = `rgba(6,18,22,${seg(t, 7.4, 9)})`; ctx.fillRect(0, 0, W, H); }
    } },

  { name: 'В парке', dur: 26,
    cues: [[.5, 4, 'Рассказчик', 'В парке было солнечно и весело.'],
      [4.5, 6.6, 'Дилшод', 'Папа, лови!'],
      [7, 9, 'Папа', 'Поймал!'],
      [9.6, 12.4, 'Томирис', 'Мама, смотри — уточки!'],
      [12.8, 15.4, 'Мама', 'Какие красивые!'],
      [16, 26, 'Рассказчик', 'Они катались на качелях, играли в мяч и смеялись все вместе.']],
    sfx: [[5, 'boing'], [7.4, 'boing']],
    draw(t) {
      playground(t, { sky: .15 });
      pond(t, 0);
      const ph = (t - 4.5) * 1.6, k = t < 4.5 ? 0 : (Math.sin(ph - Math.PI / 2) + 1) / 2;
      kid(470, 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: 1.3 + (1 - k) * .6 });
      papa(760, 702, .9, { t, talk: speaking('Папа'), jacket: false, mood: 'happy', armL: 1.3 + k * .6 });
      ballAt(lerp(520, 700, k), 540 - Math.sin(Math.PI * k) * 150, t);
      const a = Math.sin(t * 2.2) * .4;
      if (t < 16) { tomiris(300, 704, 1, { t, mood: 'happy', look: [-1, .3], armL: t > 9.6 && t < 12.4 ? 1.4 : .2 }); mom(1170, 702, .95, { t, talk: speaking('Мама'), mood: t > 9.6 ? 'wow' : 'happy' }); swing(940, 290, 210, 0, null); }
      else { swing(940, 290, 210, a, (sx, sy) => tomiris(sx, sy + 70, 1, { t, mood: 'happy', squat: .6, armL: 2.9, armR: 2.9 })); mom(1170, 702, .95, { t, mood: 'happy', armL: a > .2 ? 1.6 : 1.1 }); }
    } },

  { name: 'Мороженое', dur: 14,
    cues: [[.5, 4, 'Мама', 'А теперь — по одному мороженому!'],
      [4.5, 8.4, 'Дилшод', 'Немножко сладкого можно, а потом почистим зубки!'],
      [8.8, 13.6, 'Папа', 'Правильно! Вы всё-всё запомнили.']],
    draw(t) {
      playground(t, { sky: .45 });
      pond(t, 0);
      mom(780, 702, .95, { t, talk: speaking('Мама'), mood: 'happy' });
      papa(960, 702, .9, { t, talk: speaking('Папа'), jacket: false, mood: 'happy' });
      const has = t > 2;
      const d = kid(430, 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armR: has ? 2.1 : .2 });
      const tm = tomiris(600, 704, 1, { t, mood: 'happy', armL: has ? 2.1 : .2 });
      if (has) { holdCone(d, 'R'); holdCone(tm, 'L'); }
    } },

  { name: 'Самый лучший день', dur: 17,
    cues: [[.5, 4.8, 'Дети', 'Спасибо, мама и папа! Это самый лучший день!'],
      [5.2, 10, 'Папа', 'А мы вами гордимся. Вы всю неделю росли и учились.'],
      [10.4, 17, 'Чистон', 'Хорошие дела делают день радостным. До новых встреч, утренние герои!']],
    sfx: [[10.2, 'power']],
    draw(t) {
      playground(t, { sky: .9 });
      ctx.fillStyle = 'rgba(255,140,70,.18)'; ctx.fillRect(0, 0, W, H);
      pond(t, seg(t, 10, 11), speaking('Чистон'));
      mom(820, 702, .95, { t, mood: 'happy', handR: [90, -220] });
      papa(1010, 702, .9, { t, talk: speaking('Папа'), jacket: false, mood: 'happy', handL: [-90, -250] });
      kid(470, 690, 1, { t, talk: speaking('Дилшод'), mood: 'happy', armL: 2.6, armR: .9 });
      tomiris(640, 704, 1, { t, mood: 'happy', armL: .9, armR: 2.6 });
      if (t > 10.4) { star(170, 560, 14, 6, '#ffd23f'); }
    } },

  { name: 'Конец сезона', dur: 11,
    cues: [[1, 8.6, 'Все', 'Чистые руки, добрые дела — вот какая наша семья!']],
    sfx: [[.4, 'fanfare']],
    draw(t) { titleCard(t, 'Конец', 'первого сезона', 'Дилшод, Томирис, мама, папа и Чистон'); confetti(t); } }
];
