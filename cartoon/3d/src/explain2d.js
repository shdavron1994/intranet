// 2D explainer screens (throat, animal show, sugar) drawn with the 2D library onto #cv.
function setCur(c) { CUR = c; }
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
function sugarShow(t) {
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
   }
