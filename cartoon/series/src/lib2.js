/* ---------- series characters ---------- */
const MOMHAIR = '#6b3e26', DRESS = '#8e6cd8';
function mom(x, y, s, o) {
  o = Object.assign({ talk: false, t: 0, armL: .15, armR: .15, handL: null, handR: null, apron: false, hold: null, mood: 'happy' }, o);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 0, 72, 12, 'rgba(0,0,0,.16)');
  box(-30, -122, 22, 122, 10, SKIN); box(8, -122, 22, 122, 10, SKIN);
  ell(-20, -6, 22, 9, '#5b3b8c'); ell(20, -6, 22, 9, '#5b3b8c');
  ctx.beginPath(); ctx.moveTo(-40, -300); ctx.lineTo(40, -300); ctx.lineTo(80, -104);
  ctx.quadraticCurveTo(0, -90, -80, -104); ctx.closePath(); ctx.fillStyle = DRESS; ctx.fill();
  if (o.apron) { box(-42, -252, 84, 142, 18, '#ffffff'); box(-22, -196, 44, 30, 8, '#ffd6e4'); }
  const hl = o.handL || [-38 - Math.sin(o.armL) * 100, -288 + Math.cos(o.armL) * 100];
  const hr = o.handR || [38 + Math.sin(o.armR) * 100, -288 + Math.cos(o.armR) * 100];
  arm([-38, -288], hl, DRESS); arm([38, -288], hr, DRESS);
  if (o.hold === 'bowl') { const bx = (hl[0] + hr[0]) / 2, by = (hl[1] + hr[1]) / 2 - 8; ell(bx, by - 6, 46, 12, '#f3e2b8'); ctx.beginPath(); ctx.ellipse(bx, by - 4, 50, 34, 0, 0, Math.PI); ctx.fillStyle = '#ff9f1c'; ctx.fill(); }
  if (o.hold === 'spoon') { line(hr[0], hr[1], hr[0] - 10, hr[1] - 70, '#a0643c', 8); ell(hr[0] - 12, hr[1] - 78, 10, 14, '#a0643c'); circ(hr[0], hr[1], 14, SKIN); }
  box(-12, -322, 24, 30, 8, SKIN);
  box(-66, -372, 16, 78, 8, MOMHAIR); box(50, -372, 16, 78, 8, MOMHAIR);
  circ(0, -364, 56, SKIN);
  circ(0, -430, 28, MOMHAIR);
  ctx.beginPath(); ctx.arc(0, -366, 60, Math.PI, TAU); ctx.lineTo(58, -342);
  ctx.quadraticCurveTo(44, -384, 0, -388); ctx.quadraticCurveTo(-44, -384, -58, -342); ctx.closePath();
  ctx.fillStyle = MOMHAIR; ctx.fill();
  const blink = (o.t % 4.1) < .12;
  [-20, 20].forEach(ex => {
    if (blink) line(ex - 8, -362, ex + 8, -362, '#2a1c16', 3);
    else { ell(ex, -362, 9, 11, '#fff'); circ(ex, -360, 5, '#2a1c16'); circ(ex + 2, -363, 1.8, '#fff'); line(ex + 6, -374, ex + 11, -379, '#2a1c16', 2.5); }
  });
  circ(-36, -342, 9, 'rgba(255,110,140,.35)'); circ(36, -342, 9, 'rgba(255,110,140,.35)');
  circ(-56, -344, 4, '#ffd23f'); circ(56, -344, 4, '#ffd23f');
  if (o.talk) ell(0, -333, 11, 3 + Math.abs(Math.sin(o.t * 16)) * 8, '#9b2f45');
  else if (o.mood === 'wow') ell(0, -333, 8, 10, '#9b2f45');
  else { ctx.beginPath(); ctx.arc(0, -344, 15, .2 * Math.PI, .8 * Math.PI); ctx.strokeStyle = '#9b2f45'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
  return { hl: [x + hl[0] * s, y + hl[1] * s], hr: [x + hr[0] * s, y + hr[1] * s] };
}

function sleepyHead(x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.35);
  circ(0, 0, 50, SKIN);
  ctx.beginPath(); ctx.arc(0, -4, 52, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(30, -32); ctx.lineTo(12, -24); ctx.lineTo(-8, -34); ctx.lineTo(-28, -24); ctx.closePath(); ctx.fillStyle = HAIR; ctx.fill();
  [-18, 18].forEach(ex => { ctx.beginPath(); ctx.arc(ex, 2, 8, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = '#2a1c16'; ctx.lineWidth = 3.5; ctx.stroke(); });
  ell(0, 26, 6, 5 + Math.sin(t * 2) * 1.5, MOUTH);
  ctx.restore();
  for (let i = 0; i < 3; i++) {
    const k = ((t * .5 + i / 3) % 1);
    ctx.globalAlpha = 1 - k; txt('z', x + 50 + k * 40, y - 60 - k * 90, 26 + i * 6, '#5b6fb5'); ctx.globalAlpha = 1;
  }
}

function sockChar(x, y, s, rot, alive, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-12, -40); ctx.lineTo(12, -40); ctx.lineTo(12, 4); ctx.quadraticCurveTo(12, 16, 26, 16);
  ctx.lineTo(30, 16); ctx.quadraticCurveTo(40, 22, 30, 30); ctx.lineTo(-4, 30); ctx.quadraticCurveTo(-12, 30, -12, 18); ctx.closePath();
  ctx.fillStyle = '#ffffff'; ctx.fill();
  box(-12, -40, 24, 7, 2, '#ff5a5f'); box(-12, -28, 24, 5, 2, '#3b8beb');
  if (alive) { circ(-3, -12, 4, '#1b2a41'); circ(6, -12, 4, '#1b2a41'); ctx.beginPath(); ctx.arc(1, -4, 5, .2 * Math.PI, .8 * Math.PI); ctx.strokeStyle = '#1b2a41'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}
function carChar(x, y, s, col, alive, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  box(-34, -26, 68, 18, 8, col); box(-20, -40, 38, 18, 8, col); box(-15, -36, 12, 10, 3, '#c4f1ff'); box(1, -36, 12, 10, 3, '#c4f1ff');
  [-20, 20].forEach(wx => { circ(wx, -6, 9, '#2d3142'); line(wx, -6, wx + Math.cos(t * 12) * 6, -6 + Math.sin(t * 12) * 6, '#9aa5b1', 3); });
  if (alive) { circ(30, -18, 4, '#fff'); circ(31, -18, 2, '#1b2a41'); }
  ctx.restore();
}
function shirtShape(x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-30, -30); ctx.lineTo(-12, -38); ctx.quadraticCurveTo(0, -30, 12, -38); ctx.lineTo(30, -30); ctx.lineTo(44, -12); ctx.lineTo(30, -4); ctx.lineTo(26, -14);
  ctx.lineTo(26, 30); ctx.lineTo(-26, 30); ctx.lineTo(-26, -14); ctx.lineTo(-30, -4); ctx.lineTo(-44, -12); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = '#ffd23f'; [[-7, -8], [3, -8], [-10, -1], [-3, -1], [4, -1], [-6, 6], [1, 6]].forEach(p => ctx.fillRect(p[0], p[1], 6, 6));
  ctx.restore();
}
function pantsShape(x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-28, -34); ctx.lineTo(28, -34); ctx.lineTo(32, 34); ctx.lineTo(8, 34); ctx.lineTo(0, -6); ctx.lineTo(-8, 34); ctx.lineTo(-32, 34); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}
function eyesOn(x, y, k = 1) { circ(x - 9 * k, y, 6 * k, '#fff'); circ(x + 9 * k, y, 6 * k, '#fff'); circ(x - 8 * k, y + 1, 3 * k, '#1b2a41'); circ(x + 10 * k, y + 1, 3 * k, '#1b2a41'); }

/* a small Chiston face that can live in any shiny thing */
function faceOf(cx, cy, k, talk, t) {
  const blink = (t % 3.7) < .12, eh = (blink ? 4 : 30) * k;
  box(cx - 54 * k, cy - 38 * k - eh / 2, 24 * k, eh, 11 * k, INK); box(cx + 30 * k, cy - 38 * k - eh / 2, 24 * k, eh, 11 * k, INK);
  if (talk) ell(cx, cy + 34 * k, 26 * k, (6 + Math.abs(Math.sin(t * 15)) * 16) * k, INK);
  else { ctx.beginPath(); ctx.arc(cx, cy + 12 * k, 36 * k, .18 * Math.PI, .82 * Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 7 * k; ctx.lineCap = 'round'; ctx.stroke(); }
  circ(cx - 70 * k, cy + 14 * k, 12 * k, 'rgba(255,120,160,.45)'); circ(cx + 70 * k, cy + 14 * k, 12 * k, 'rgba(255,120,160,.45)');
}
function miniChiston(x, y, k, on, o) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); chiston(0, 0, on, o); ctx.restore(); }
function kettle(x, y, s, on, talk, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 6, 90, 12, 'rgba(0,0,0,.15)');
  ctx.beginPath(); ctx.moveTo(70, -60); ctx.quadraticCurveTo(120, -70, 130, -120); ctx.lineTo(116, -122); ctx.quadraticCurveTo(104, -84, 68, -84); ctx.fillStyle = '#b7c6d3'; ctx.fill();
  ctx.beginPath(); ctx.arc(-80, -90, 40, Math.PI * .5, Math.PI * 1.5); ctx.strokeStyle = '#2d3142'; ctx.lineWidth = 12; ctx.stroke();
  const g = ctx.createLinearGradient(-80, -170, 80, 0); g.addColorStop(0, '#f4f8fb'); g.addColorStop(.5, '#c3d2de'); g.addColorStop(1, '#8fa4b6');
  ctx.beginPath(); ctx.ellipse(0, -80, 86, 82, 0, 0, TAU); ctx.fillStyle = g; ctx.fill();
  box(-50, -172, 100, 20, 10, '#9fb6c9'); circ(0, -178, 12, '#2d3142');
  ctx.globalAlpha = .5; box(-60, -140, 14, 50, 7, '#ffffff'); ctx.globalAlpha = 1;
  if (on > 0) {
    ctx.save(); ctx.globalAlpha = on; ctx.shadowColor = 'rgba(120,240,255,.9)'; ctx.shadowBlur = 30;
    ell(0, -80, 70, 64, 'rgba(200,250,255,.55)'); ctx.restore();
    ctx.globalAlpha = on; faceOf(0, -78, .62, talk, t); ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/* ---------- series scenery ---------- */
function curtains(k) {
  line(880, 74, 1150, 74, '#a0643c', 8);
  const w = 18 + 105 * (1 - k);
  box(886, 76, w, 228, 10, '#ff8f8f'); box(1144 - w, 76, w, 228, 10, '#ff8f8f');
  for (let i = 1; i < 4; i++) { line(886 + w * i / 4, 90, 886 + w * i / 4, 296, 'rgba(160,40,40,.25)', 3); line(1144 - w * i / 4, 90, 1144 - w * i / 4, 296, 'rgba(160,40,40,.25)', 3); }
}
function bedroom(o) {
  o = Object.assign({ curtain: 1, door: 0, mirrorOn: 0, mirrorTalk: false, t: 0 }, o);
  room();
  curtains(o.curtain);
  // door
  box(1150, 170, 120, 372, 8, '#c98b55');
  if (o.door > 0) { box(1150, 170, 120 * o.door, 372, 4, '#3b2a1e'); }
  circ(1166 + 92 * (1 - o.door), 370, 7, '#ffd23f');
  // dresser + toy box + hook
  box(930, 410, 180, 130, 10, '#d39b62'); box(942, 424, 156, 50, 6, '#e8b77a'); box(942, 480, 156, 50, 6, '#e8b77a');
  circ(1020, 449, 5, '#7a4b25'); circ(1020, 505, 5, '#7a4b25');
  box(720, 575, 130, 90, 10, '#3b8beb'); txt('ИГРУШКИ', 785, 620, 18, '#ffffff');
  circ(1120, 330, 7, '#7a4b25');
  // lamp
  line(700, 0, 700, 60, '#555', 3); ctx.beginPath(); ctx.moveTo(660, 92); ctx.lineTo(740, 92); ctx.lineTo(718, 58); ctx.lineTo(682, 58); ctx.closePath(); ctx.fillStyle = '#ffd23f'; ctx.fill();
  // small wall mirror over the bed: Chiston lives here too
  miniChiston(300, 170, .48, o.mirrorOn, { talk: o.mirrorTalk, t: o.t });
}
function kitchen() {
  ctx.fillStyle = '#ffe9c7'; ctx.fillRect(0, 0, W, 560);
  for (let x = 760; x < 1120; x += 40) for (let y = 300; y < 440; y += 40) { ctx.fillStyle = ((x + y) / 40) % 2 ? '#ffffff' : '#ffd9a8'; ctx.fillRect(x, y, 40, 40); }
  ctx.fillStyle = '#d9a46c'; ctx.fillRect(0, 560, W, 160);
  for (let y = 590; y < H; y += 40) line(0, y, W, y, 'rgba(120,70,30,.2)', 2);
  box(90, 90, 240, 190, 10, '#ffffff'); box(102, 102, 216, 166, 6, '#8fd3ff'); circ(150, 150, 26, '#ffe066');
  line(210, 102, 210, 268, '#ffffff', 8);
  box(80, 80, 60, 210, 10, '#7cc6a4'); box(280, 80, 60, 210, 10, '#7cc6a4');
  // counter, stove, fridge
  box(760, 440, 360, 260, 8, '#f4f7fa'); box(760, 430, 360, 22, 6, '#9b6b43');
  [[800, 520], [960, 520]].forEach(p => { box(p[0], p[1], 130, 150, 8, '#e3e9ef'); circ(p[0] + 110, p[1] + 75, 5, '#9fb6c9'); });
  box(1130, 170, 140, 530, 16, '#eef3f7'); line(1130, 330, 1270, 330, '#c9d4de', 4); box(1145, 200, 10, 90, 5, '#9fb6c9'); box(1145, 350, 10, 120, 5, '#9fb6c9');
  box(985, 424, 110, 12, 6, '#c9d4de'); box(1032, 392, 12, 34, 5, '#b7c6d3'); box(1008, 388, 40, 10, 5, '#b7c6d3');
}
function stovePot(t, steam = true) {
  ell(860, 432, 46, 8, '#2d3142');
  box(818, 380, 84, 52, 10, '#ff5a5f'); box(808, 376, 104, 12, 6, '#d63b40');
  if (steam) for (let i = 0; i < 3; i++) { const k = (t * .6 + i / 3) % 1; ctx.globalAlpha = .5 * (1 - k); circ(840 + i * 20 + Math.sin(t * 3 + i) * 6, 360 - k * 90, 10 + k * 14, '#ffffff'); ctx.globalAlpha = 1; }
}
function table() {
  box(280, 520, 20, 180, 6, '#a86a3a'); box(700, 520, 20, 180, 6, '#a86a3a');
  box(250, 498, 500, 26, 10, '#c98b55');
  box(256, 512, 488, 112, 10, '#fff4dc');
  ctx.fillStyle = 'rgba(255,90,95,.35)'; for (let x = 268; x < 740; x += 36) ctx.fillRect(x, 512, 16, 112);
}
function chairBack(x) { box(x - 60, 380, 120, 20, 8, '#a86a3a'); box(x - 60, 380, 16, 200, 6, '#a86a3a'); box(x + 44, 380, 16, 200, 6, '#a86a3a'); }
function bowl(x, y, food) { ell(x, y - 6, 44, 11, food > 0 ? '#f3e2b8' : '#ffd9a8'); ctx.beginPath(); ctx.ellipse(x, y - 4, 48, 30, 0, 0, Math.PI); ctx.fillStyle = '#3b8beb'; ctx.fill(); }
function hallway() {
  ctx.fillStyle = '#dfeeff'; ctx.fillRect(0, 0, W, 560); ctx.fillStyle = '#c9a27a'; ctx.fillRect(0, 560, W, 160);
  box(980, 150, 200, 410, 10, '#8a5a3c'); circ(1150, 370, 9, '#ffd23f'); box(1020, 190, 120, 90, 8, '#9e6c4b');
  line(140, 220, 520, 220, '#8a5a3c', 10);
  [200, 320, 440].forEach(x => circ(x, 232, 8, '#5b3b28'));
  ctx.beginPath(); ctx.moveTo(300, 236); ctx.lineTo(360, 236); ctx.lineTo(392, 430); ctx.lineTo(270, 430); ctx.closePath(); ctx.fillStyle = '#ff9f1c'; ctx.fill();
  box(160, 600, 360, 20, 6, '#8a5a3c');
}
function street(t, speed) {
  const g = ctx.createLinearGradient(0, 0, 0, 500); g.addColorStop(0, '#8fd3ff'); g.addColorStop(1, '#d8f1ff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 520);
  circ(1100, 110, 46, '#ffe066');
  const off = (t * speed * .35) % 400;
  for (let i = -1; i < 5; i++) {
    const x = i * 400 - off;
    box(x + 30, 230, 160, 290, 6, ['#ffb4a2', '#b5e48c', '#ffd6a5', '#a0c4ff'][(i + 8) % 4]);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) box(x + 55 + c * 70, 260 + r * 80, 40, 46, 4, '#ffffff');
    circ(x + 300, 400, 60, '#5fbf6a'); box(x + 292, 430, 16, 90, 4, '#8a5a3c');
  }
  ctx.fillStyle = '#5a6270'; ctx.fillRect(0, 520, W, 200); ctx.fillStyle = '#9aa5b1'; ctx.fillRect(0, 512, W, 12);
  const doff = (t * speed) % 160;
  for (let x = -doff; x < W; x += 160) box(x, 610, 80, 10, 4, '#ffffff');
}
function car(x, y, t, moving) {
  ctx.save(); ctx.translate(x, y);
  ell(0, 6, 210, 14, 'rgba(0,0,0,.25)');
  ctx.beginPath(); ctx.moveTo(-200, -30); ctx.quadraticCurveTo(-200, -90, -140, -96); ctx.lineTo(-90, -96); ctx.lineTo(-50, -160); ctx.lineTo(90, -160); ctx.lineTo(140, -96); ctx.lineTo(180, -90); ctx.quadraticCurveTo(210, -80, 205, -30); ctx.closePath();
  ctx.fillStyle = '#ff5a5f'; ctx.fill();
  box(-38, -148, 56, 50, 8, '#c4f1ff'); box(28, -148, 56, 50, 8, '#c4f1ff');
  // passengers: mom drives (front), Timur in the back
  circ(60, -118, 20, SKIN); ctx.beginPath(); ctx.arc(60, -122, 21, Math.PI, TAU); ctx.fillStyle = MOMHAIR; ctx.fill();
  circ(-62, -112, 15, SKIN); ctx.beginPath(); ctx.arc(-62, -116, 16, Math.PI, TAU); ctx.fillStyle = HAIR; ctx.fill(); circ(-79, -120, 7, HAIR); circ(-45, -120, 7, HAIR);
  circ(-8, -116, 18, SKIN); ctx.beginPath(); ctx.arc(-8, -120, 19, Math.PI, TAU); ctx.fillStyle = HAIR; ctx.fill();
  circ(-14, -116, 2.5, '#2a1c16'); circ(-2, -116, 2.5, '#2a1c16');
  [-120, 120].forEach(wx => { circ(wx, -20, 34, '#2d3142'); circ(wx, -20, 16, '#c9d4de'); const a = moving ? t * 10 : 0; line(wx, -20, wx + Math.cos(a) * 14, -20 + Math.sin(a) * 14, '#5a6270', 4); });
  circ(196, -60, 8, '#ffe066');
  ctx.restore();
}
function checklist(items, shown, done, x = 820, y = 110, title = 'План утреннего героя') {
  const h = 70 + items.length * 52;
  box(x, y, 420, h, 20, 'rgba(14,58,70,.92)');
  txt(title, x + 210, y + 36, 28, '#ffd23f');
  items.forEach((s, i) => {
    if (i >= shown) return;
    const yy = y + 80 + i * 52, ok = i < done;
    circ(x + 40, yy, 16, ok ? '#5dff9a' : 'rgba(255,255,255,.2)');
    if (ok) txt('✓', x + 40, yy + 1, 22, '#0b2d36'); else txt(String(i + 1), x + 40, yy + 1, 20, '#ffffff');
    txt(s, x + 70, yy + 1, 25, ok ? '#a7cdd2' : '#ffffff', 'left');
    if (ok) line(x + 70, yy + 2, x + 70 + ctx.measureText(s).width, yy + 2, 'rgba(167,205,210,.8)', 2);
  });
}
function speech(x, y, s, size = 30) {
  ctx.font = `${size}px ${FONT}`; const w = ctx.measureText(s).width + 36;
  box(x - w / 2, y - size, w, size * 1.8, 18, '#ffffff');
  ctx.beginPath(); ctx.moveTo(x - 12, y + size * .8 - 2); ctx.lineTo(x + 6, y + size * .8 - 2); ctx.lineTo(x - 14, y + size * .8 + 20); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill();
  txt(s, x, y - size * .1, size, '#1b2a41');
}
function titleCard(t, big, small, note) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e3a46'); g.addColorStop(1, '#1b6f80');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  bubbles(t + 4);
  chiston(640, 220, 1, { t });
  txt(big, 640, 450 + Math.sin(t * 2) * 5, 92, '#ffd23f');
  txt(small, 640, 540, 50, '#ffffff');
  if (note) txt(note, 640, 610, 26, '#a7cdd2');
}
const fly = (a, b, k, h) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(Math.PI * k) * h, lerp(a[2] || 0, b[2] || 0, k)];

const TPJ = '#ffc2d6', TDRESS = '#ff8fb1';
function tomiris(x, y, s, o) { return kid(x, y, s * .8, Object.assign({ girl: true, shirt: TDRESS }, o, { talk: speaking('Томирис') })); }
