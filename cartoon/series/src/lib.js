const W = 1280, H = 720, TAU = Math.PI * 2;
const FONT = '"Pangolin","Comic Sans MS","Chalkboard SE",cursive';
const SKIN = '#f3c6a0', HAIR = '#4a2f22', INK = '#1d4e89', MOUTH = '#7a2b2b';
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');

/* ---------- helpers ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
const lerp = (a, b, k) => a + (b - a) * k;
function rr(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function box(x, y, w, h, r, c) { rr(x, y, w, h, r); ctx.fillStyle = c; ctx.fill(); }
function circ(x, y, r, c) { ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0), 0, TAU); ctx.fillStyle = c; ctx.fill(); }
function ell(x, y, rx, ry, c) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(rx, 0), Math.max(ry, 0), 0, 0, TAU); ctx.fillStyle = c; ctx.fill(); }
function line(x1, y1, x2, y2, c, w) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.stroke(); }
function txt(s, x, y, size, c, align = 'center') {
  ctx.font = `${size}px ${FONT}`; ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y);
}
function pill(x, y, s, size, bg, fg, anchor = 'left') {
  ctx.font = `${size}px ${FONT}`;
  const w = ctx.measureText(s).width + size * 1.3, h = size * 1.75;
  const left = anchor === 'left' ? x : anchor === 'right' ? x - w : x - w / 2;
  box(left, y, w, h, h / 2, bg); txt(s, left + w / 2, y + h / 2 + 1, size, fg);
}
function star(cx, cy, r1, r2, c) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? r2 : r1, a = -Math.PI / 2 + i * Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath(); ctx.fillStyle = c; ctx.fill();
}

/* ---------- characters ---------- */
function arm(a, b, sleeve) {
  line(a[0], a[1], b[0], b[1], SKIN, 17);
  line(a[0], a[1], lerp(a[0], b[0], .4), lerp(a[1], b[1], .4), sleeve, 26);
  circ(b[0], b[1], 14, SKIN);
}
function brush(h, to, handle) {
  const ang = Math.atan2(to[1] - h[1], to[0] - h[0]);
  const len = Math.max(30, Math.hypot(to[0] - h[0], to[1] - h[1]));
  ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(ang);
  box(-14, -5, len + 14, 10, 5, handle);
  box(len - 18, -14, 22, 10, 3, '#ffffff');
  ctx.restore();
  circ(h[0], h[1], 14, SKIN);
}
function kid(x, y, s, o) {
  o = Object.assign({ girl: false, dirty: 0, dirtyHands: null, mood: 'happy', talk: false, armL: .2, armR: .2,
    handL: null, handR: null, shirt: '#3b8beb', hold: null, brushTo: null, glasses: false, badge: 0, t: 0,
    pants: null, redEyes: 0, look: [0, 0], squat: 0, tilt: 0, pajama: false, full: false, closed: false, spoonTo: null, glow: null }, o);
  const LL = 100 * (1 - .45 * o.squat);
  const dh = o.dirtyHands == null ? o.dirty : o.dirtyHands;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt); ctx.scale(s, s);
  ell(0, 0, 62, 11, 'rgba(0,0,0,.16)');
  const legC = o.pants || (o.girl ? SKIN : '#2b3f73');
  box(-34, -LL, 26, LL, 12, legC); box(8, -LL, 26, LL, 12, legC);
  const shoe = o.girl ? '#ff7aa2' : '#ffffff';
  ell(-22, -6, 22, 10, shoe); ell(22, -6, 22, 10, shoe);
  ctx.translate(0, 100 - LL);
  if (o.girl) {
    ctx.beginPath(); ctx.moveTo(-34, -205); ctx.lineTo(34, -205); ctx.lineTo(64, -90);
    ctx.quadraticCurveTo(0, -78, -64, -90); ctx.closePath(); ctx.fillStyle = o.shirt; ctx.fill();
    [[-25, -130], [18, -160], [30, -110], [-8, -105], [-14, -175]].forEach(p => circ(p[0], p[1], 6, 'rgba(255,255,255,.7)'));
  } else {
    box(-52, -210, 104, 125, 30, o.shirt);
    if (o.pajama) { ctx.save(); rr(-52, -210, 104, 125, 30); ctx.clip(); for (let yy = -200; yy < -85; yy += 22) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-52, yy, 104, 8); } ctx.restore(); } else {
    const rows = ['.X.X.', 'XXXXX', '.XXX.', '..X..'];
    ctx.fillStyle = '#ffd23f';
    rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === 'X') ctx.fillRect(-18 + i * 7, -178 + j * 7, 7, 7); }));
    }
  }
  const hl = o.handL || [-46 - Math.sin(o.armL) * 86, -192 + Math.cos(o.armL) * 86];
  const hr = o.handR || [46 + Math.sin(o.armR) * 86, -192 + Math.cos(o.armR) * 86];
  arm([-46, -192], hl, o.shirt); arm([46, -192], hr, o.shirt);
  if (o.badge > 0) {
    ctx.save(); ctx.translate(0, -150); ctx.scale(o.badge, o.badge);
    circ(0, 0, 20, '#ffd23f'); star(0, 0, 13, 6, '#ff7a1a'); ctx.restore();
  }
  // head
  circ(-62, -265, 13, SKIN); circ(62, -265, 13, SKIN);
  circ(0, -268, 64, SKIN);
  ctx.fillStyle = HAIR;
  if (o.girl) {
    circ(-70, -295, 26, HAIR); circ(70, -295, 26, HAIR);
    ctx.beginPath(); ctx.arc(0, -268, 66, Math.PI, TAU); ctx.lineTo(52, -284);
    ctx.quadraticCurveTo(0, -310, -52, -284); ctx.closePath(); ctx.fillStyle = HAIR; ctx.fill();
    [[-70, -322], [70, -322]].forEach(p => { ell(p[0] - 10, p[1], 12, 8, '#ff4f8b'); ell(p[0] + 10, p[1], 12, 8, '#ff4f8b'); circ(p[0], p[1], 5, '#ff4f8b'); });
  } else {
    ctx.beginPath(); ctx.moveTo(-64, -262);
    ctx.quadraticCurveTo(-66, -345, 0, -342); ctx.quadraticCurveTo(66, -345, 64, -262);
    ctx.lineTo(46, -298); ctx.lineTo(30, -284); ctx.lineTo(12, -302); ctx.lineTo(-8, -286);
    ctx.lineTo(-28, -302); ctx.lineTo(-46, -288); ctx.closePath(); ctx.fill();
  }
  // eyes
  const blink = (o.t % 3.3) < .12;
  [-23, 23].forEach(ex => {
    if (o.mood === 'sleepy' || blink || o.closed) {
      ctx.beginPath(); ctx.arc(ex, -272, 10, .15 * Math.PI, .85 * Math.PI);
      ctx.strokeStyle = '#2a1c16'; ctx.lineWidth = 4; ctx.stroke();
    } else {
      const big = o.mood === 'wow';
      ell(ex, -270, big ? 15 : 12, big ? 18 : 15, '#fff');
      if (o.redEyes > 0) ell(ex, -270, big ? 15 : 12, big ? 18 : 15, `rgba(255,70,70,${.5 * o.redEyes})`);
      circ(ex + (o.girl ? 0 : 1) + o.look[0] * 5, -267 + o.look[1] * 6, big ? 6 : 7, '#2a1c16');
      circ(ex + 3 + o.look[0] * 5, -271 + o.look[1] * 6, 2.4, '#fff');
      if (o.mood === 'bored') box(ex - 15, -290, 30, 19, 6, SKIN);
    }
  });
  if (o.mood === 'sad') { line(-34, -296, -12, -290, '#2a1c16', 4); line(34, -296, 12, -290, '#2a1c16', 4); }
  if (o.glasses) {
    ctx.lineWidth = 4; ctx.strokeStyle = '#25e3ff';
    [-23, 23].forEach(ex => { rr(ex - 20, -288, 40, 34, 10); ctx.fillStyle = 'rgba(60,230,255,.22)'; ctx.fill(); ctx.stroke(); });
    line(-3, -272, 3, -272, '#25e3ff', 4);
  }
  circ(-42, -240, 10, 'rgba(255,110,140,.35)'); circ(42, -240, 10, 'rgba(255,110,140,.35)');
  if (o.full) { circ(-34, -238, 18, SKIN); circ(34, -238, 18, SKIN); circ(-36, -238, 10, 'rgba(255,110,140,.4)'); circ(36, -238, 10, 'rgba(255,110,140,.4)'); }
  // mouth
  if (o.talk) ell(0, -232, 13, 4 + Math.abs(Math.sin(o.t * 17)) * 10, MOUTH);
  else if (o.mood === 'wow') ell(0, -230, 9, 12, MOUTH);
  else if (o.mood === 'sleepy') ell(0, -232, 7, 6, MOUTH);
  else if (o.mood === 'bored') line(-12, -230, 12, -230, MOUTH, 5);
  else if (o.mood === 'sad') { ctx.beginPath(); ctx.arc(0, -218, 16, 1.2 * Math.PI, 1.8 * Math.PI); ctx.strokeStyle = MOUTH; ctx.lineWidth = 5; ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(0, -244, 18, .2 * Math.PI, .8 * Math.PI); ctx.strokeStyle = MOUTH; ctx.lineWidth = 5; ctx.stroke(); }
  // dirt
  if (o.dirty > 0) {
    ctx.globalAlpha = o.dirty;
    [[-34, -246, 10], [30, -302, 8], [20, -222, 6], [-24, -160, 13], [26, -122, 10], [2, -150, 7]].forEach(p => circ(p[0], p[1], p[2], '#7a5230'));
    [[-10, -120], [14, -190], [-36, -135]].forEach(p => circ(p[0], p[1], 3.5, '#f0b73c'));
    ctx.globalAlpha = 1;
  }
  if (dh > 0) { ctx.globalAlpha = dh; circ(hl[0] + 4, hl[1] + 2, 8, '#7a5230'); circ(hr[0] - 4, hr[1] + 3, 8, '#7a5230'); ctx.globalAlpha = 1; }
  if (o.hold === 'brush') brush(hr, o.brushTo || [hr[0] - 15, hr[1] - 60], o.girl ? '#ff7aa2' : '#4cc3ff');
  if (o.hold === 'phone') {
    if (o.glow) { ctx.save(); ctx.globalAlpha = .07; circ(0, -262, 70, o.glow); ctx.restore(); }
    ctx.save(); ctx.translate(hr[0], hr[1]); ctx.rotate(-.3); box(-20, -66, 40, 72, 8, '#1f2430'); box(-16, -60, 32, 58, 5, o.glow || '#7fe3ff');
    circ(-4, -36, 6, '#ffd23f'); circ(8, -24, 5, '#ff7aa2'); ctx.restore(); circ(hr[0], hr[1], 14, SKIN);
  }
  if (o.hold === 'spoon') {
    const to = o.spoonTo || [hr[0] - 10, hr[1] - 50];
    line(hr[0], hr[1], to[0], to[1], '#c9d4de', 7); ell(to[0], to[1], 13, 8, '#c9d4de'); ell(to[0], to[1] - 2, 9, 5, '#f3e2b8');
    circ(hr[0], hr[1], 14, SKIN);
  }
  ctx.restore();
  const yy = y + (100 - LL) * s;
  return { hl: [x + hl[0] * s, yy + hl[1] * s], hr: [x + hr[0] * s, yy + hr[1] * s], mouth: [x, yy - 232 * s], face: [x, yy - 268 * s] };
}

function chiston(cx, cy, on, o) {
  o = Object.assign({ talk: false, t: 0 }, o);
  ctx.save();
  if (on > 0) { ctx.shadowColor = `rgba(120,240,255,${.8 * on})`; ctx.shadowBlur = 45 * on; }
  ell(cx, cy, 135, 155, '#e9eff5');
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(cx, cy, 135, 155, 0, 0, TAU); ctx.strokeStyle = '#9fb6c9'; ctx.lineWidth = 8; ctx.stroke();
  const gOff = ctx.createLinearGradient(cx - 110, cy - 130, cx + 110, cy + 130);
  gOff.addColorStop(0, '#a9cfdc'); gOff.addColorStop(1, '#6d9fb3');
  ell(cx, cy, 115, 135, gOff);
  if (on > 0) {
    const gOn = ctx.createLinearGradient(cx - 110, cy - 130, cx + 110, cy + 130);
    gOn.addColorStop(0, '#e2fdff'); gOn.addColorStop(1, '#8fe6f5');
    ctx.globalAlpha = on; ell(cx, cy, 115, 135, gOn); ctx.globalAlpha = 1;
  }
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 115, 135, 0, 0, TAU); ctx.clip();
  ctx.globalAlpha = .35; ctx.translate(cx - 60, cy - 70); ctx.rotate(-.6);
  box(-80, -6, 160, 12, 6, '#fff'); box(-60, 18, 120, 6, 3, '#fff');
  ctx.restore();
  circ(cx, cy - 150, 7, on > .5 ? '#5dff9a' : '#556677');
  if (on > 0) {
    ctx.globalAlpha = on;
    const blink = (o.t % 3.7) < .12, eh = blink ? 4 : 30;
    box(cx - 54, cy - 38 - eh / 2, 24, eh, 11, INK); box(cx + 30, cy - 38 - eh / 2, 24, eh, 11, INK);
    line(cx - 60, cy - 72, cx - 26, cy - 78, INK, 6); line(cx + 26, cy - 78, cx + 60, cy - 72, INK, 6);
    if (o.talk) ell(cx, cy + 42, 28, 6 + Math.abs(Math.sin(o.t * 15)) * 18, INK);
    else { ctx.beginPath(); ctx.arc(cx, cy + 18, 40, .18 * Math.PI, .82 * Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.stroke(); }
    circ(cx - 72, cy + 18, 13, 'rgba(255,120,160,.45)'); circ(cx + 72, cy + 18, 13, 'rgba(255,120,160,.45)');
    ctx.globalAlpha = 1;
  }
}

function pixel(cx, fy, s, o) {
  o = Object.assign({ smudge: 0, mood: 'happy', walk: 0, sleep: false, error: false, talk: false, t: 0, tilt: 0, wave: false }, o);
  ctx.save(); ctx.translate(cx, fy); ctx.rotate(o.tilt); ctx.scale(s, s);
  const sw = Math.sin(o.walk) * 16;
  line(-24, -24, -24 + sw, -6, '#2d3142', 8); line(24, -24, 24 - sw, -6, '#2d3142', 8);
  ell(-24 + sw, -4, 13, 6, '#ff5a5f'); ell(24 - sw, -4, 13, 6, '#ff5a5f');
  const wv = o.wave ? Math.sin(o.t * 12) * 30 : 0;
  line(-60, -120, -88, -95 - wv, '#2d3142', 8); line(60, -120, 88, -95 + wv, '#2d3142', 8);
  box(-62, -210, 124, 190, 20, '#2d3142');
  box(-52, -200, 104, 158, 12, o.error ? '#ffd6d6' : '#c4f1ff');
  circ(0, -31, 6, '#555b70');
  if (o.sleep) {
    [-22, 22].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -142, 9, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = '#1b2a41'; ctx.lineWidth = 4; ctx.stroke(); });
    const zy = (o.t * 30) % 50;
    ctx.globalAlpha = 1 - zy / 50; txt('z', 60, -230 - zy, 34, '#ffffff'); ctx.globalAlpha = 1;
  } else {
    [-22, 22].forEach(ex => { ell(ex, -140, 10, 13, '#1b2a41'); circ(ex + 3, -144, 3, '#fff'); });
    if (o.mood === 'angry') { line(-34, -164, -12, -156, '#1b2a41', 5); line(34, -164, 12, -156, '#1b2a41', 5); }
    if (o.talk) ell(0, -100, 14, 4 + Math.abs(Math.sin(o.t * 17)) * 9, '#1b2a41');
    else {
      ctx.beginPath();
      if (o.mood === 'angry') ctx.arc(0, -88, 15, 1.2 * Math.PI, 1.8 * Math.PI); else ctx.arc(0, -112, 16, .2 * Math.PI, .8 * Math.PI);
      ctx.strokeStyle = '#1b2a41'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
    }
  }
  if (o.error) txt('ОШИБКА', 0, -180, 20, '#d62839');
  if (o.smudge > 0) {
    ctx.globalAlpha = o.smudge; ctx.strokeStyle = 'rgba(120,75,35,.75)'; ctx.lineWidth = 2;
    [[-30, -168], [30, -60], [-28, -70], [34, -176]].forEach(p => {
      for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.ellipse(p[0], p[1], k * 3.5, k * 4.5, .4, 0, TAU); ctx.stroke(); }
    });
    ell(-36, -110, 9, 6, 'rgba(110,60,25,.8)');
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function sneaker(x, y, s, flip, look = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s);
  ell(0, 2, 46, 6, 'rgba(0,0,0,.15)');
  ctx.beginPath(); ctx.moveTo(-42, -2); ctx.lineTo(46, -2); ctx.quadraticCurveTo(58, -4, 52, -16);
  ctx.quadraticCurveTo(40, -26, 16, -30); ctx.lineTo(4, -50); ctx.lineTo(-36, -50);
  ctx.quadraticCurveTo(-48, -30, -42, -2); ctx.closePath(); ctx.fillStyle = '#ff5a5f'; ctx.fill();
  box(-46, -9, 104, 10, 5, '#ffffff');
  line(-6, -42, 10, -36, '#fff', 3); line(-10, -34, 8, -28, '#fff', 3);
  circ(32, -16, 7, '#fff'); circ(33 + look, -16, 3.5, '#1b2a41');
  ctx.restore();
}

function hrum(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 18, 80, 14, 'rgba(0,0,0,.18)');
  ell(0, 6, 74, 26, '#4f5d6c'); ell(0, -6, 74, 26, '#8b9bab');
  circ(0, -10, 10, '#5dff9a');
  [-22, 22].forEach(ex => { circ(ex + 30, 2, 8, '#fff'); circ(ex + 33, 3, 4, '#1b2a41'); });
  ctx.save(); ctx.translate(-62, 16);
  for (let i = 0; i < 4; i++) { const a = t * 14 + i * Math.PI / 2; line(0, 0, Math.cos(a) * 18, Math.sin(a) * 7, '#c9d4de', 3); }
  ctx.restore();
  ctx.restore();
}

function microbe(x, y, r, col, t, ph, alpha = 1) {
  if (alpha <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let i = 0; i <= 12; i++) {
    const a = i / 12 * TAU, rad = r * (1 + .13 * Math.sin(t * 5 + i * 1.7 + ph));
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  [-1, 1].forEach(d => { circ(x + d * r * .32, y - r * .15, r * .26, '#fff'); circ(x + d * r * .32 + r * .05, y - r * .12, r * .12, '#1b2a41'); });
  ctx.beginPath(); ctx.arc(x, y + r * .15, r * .3, .2 * Math.PI, .8 * Math.PI); ctx.strokeStyle = '#1b2a41'; ctx.lineWidth = Math.max(2, r * .09); ctx.stroke();
  ctx.restore();
}
const MCOL = ['#7ddc4a', '#b06bff', '#ffb238', '#4fd6c4', '#ff6fa8', '#9be36b'];

function backpack(x, y, a) {
  if (a <= 0) return;
  ctx.globalAlpha = a;
  box(x - 36, y, 72, 92, 22, '#ff9f1c'); box(x - 24, y + 46, 48, 32, 10, '#ffbf5c');
  line(x - 18, y + 4, x - 10, y - 14, '#c46f00', 6); line(x + 18, y + 4, x + 10, y - 14, '#c46f00', 6);
  ctx.globalAlpha = 1;
}
function medal(x, y, s, label) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-50, -150); ctx.lineTo(-10, -150); ctx.lineTo(10, -60); ctx.lineTo(-30, -60); ctx.closePath(); ctx.fillStyle = '#3b8beb'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(50, -150); ctx.lineTo(10, -150); ctx.lineTo(-10, -60); ctx.lineTo(30, -60); ctx.closePath(); ctx.fillStyle = '#ff5a5f'; ctx.fill();
  circ(0, 0, 84, '#ffb000'); circ(0, 0, 70, '#ffd23f'); star(0, 0, 50, 22, '#ff7a1a');
  if (label) pill(0, 100, 'Мастер чистоты', 34, '#ffffff', '#0e3a46', 'center');
  ctx.restore();
}

/* ---------- scenery ---------- */
const SY = 652; // Timur's feet when he stands behind the sink
const CRUMBS = [[640, 650], [700, 668], [760, 640], [820, 676], [880, 655], [300, 690], [360, 660], [1000, 690], [1150, 672], [1220, 650], [540, 700], [460, 670], [1080, 640]];
function room() {
  ctx.fillStyle = '#bfe3ff'; ctx.fillRect(0, 0, W, 540);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  for (let y = 40; y < 520; y += 80) for (let x = (y / 80 % 2) * 40 + 20; x < W; x += 80) { ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#e8b77a'; ctx.fillRect(0, 540, W, 180);
  for (let y = 570; y < H; y += 40) line(0, y, W, y, 'rgba(150,95,45,.25)', 2);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 528, W, 14);
  box(900, 80, 230, 210, 10, '#ffffff'); box(912, 92, 206, 186, 6, '#8fd3ff');
  circ(1060, 150, 34, '#ffe066'); ell(970, 230, 50, 18, '#ffffff'); ell(1010, 222, 36, 16, '#ffffff');
  line(1015, 92, 1015, 278, '#ffffff', 8); line(912, 185, 1118, 185, '#ffffff', 8);
  box(560, 110, 170, 210, 8, '#2d3142'); box(574, 124, 142, 182, 4, '#6c4cff');
  ctx.fillStyle = '#ffd23f'; [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [1, 2]].forEach(p => ctx.fillRect(614 + p[0] * 22, 170 + p[1] * 22, 22, 22));
  txt('LEVEL 99', 645, 270, 24, '#ffffff');
  ROOM_BEDS.forEach(b => bedAt(b[0], b[1], b[2]));
}
let ROOM_BEDS = [[70, 410, '#7c5cff']];
function bedAt(x, w, col) {
  box(x, 300, 30, 230, 10, '#a0643c'); box(x + 10, 410, w - 10, 110, 14, '#a0643c');
  box(x + 20, 380, w - 30, 50, 18, '#ffffff'); box(x + 30, 352, 90, 42, 16, '#ffffff');
  box(x + 100, 368, w - 110, 72, 20, col); line(x + 120, 404, x + w - 30, 404, 'rgba(255,255,255,.3)', 4);
}
function crumbs(minX = -1) {
  CRUMBS.forEach(c => { if (c[0] > minX) { circ(c[0], c[1], 6, '#e0a93b'); circ(c[0] + 2, c[1] + 1, 2.5, '#a86a1f'); } });
}
function bathroom() {
  ctx.fillStyle = '#d6f1ee'; ctx.fillRect(0, 0, W, 570);
  for (let x = 0; x <= W; x += 64) line(x, 0, x, 570, '#bde2dd', 2);
  for (let y = 0; y <= 570; y += 64) line(0, y, W, y, '#bde2dd', 2);
  for (let y = 570; y < H; y += 50) for (let x = 0; x < W; x += 50) { ctx.fillStyle = ((x + y) / 50) % 2 ? '#79b2bf' : '#8dc3cf'; ctx.fillRect(x, y, 50, 50); }
  box(960, 300, 96, 170, 14, '#ffd23f'); box(960, 430, 96, 14, 4, '#ffb000'); circ(1008, 296, 9, '#9fb6c9');
}
function sink() {
  box(470, 528, 340, 192, 10, '#ffffff'); line(640, 540, 640, 710, '#d9e4ea', 4);
  circ(620, 620, 6, '#9fb6c9'); circ(660, 620, 6, '#9fb6c9');
  box(440, 498, 400, 40, 16, '#f4f7fa'); ell(640, 506, 140, 9, '#d9e4ea');
  box(628, 472, 24, 34, 8, '#b7c6d3'); box(600, 466, 50, 14, 7, '#b7c6d3');
  box(486, 452, 34, 46, 8, '#ff9fbd'); line(496, 452, 490, 420, '#4cc3ff', 7); line(510, 452, 516, 424, '#ff7aa2', 7);
}
function bubbles(t, n = 22, a = .55) {
  for (let i = 0; i < n; i++) {
    const sp = 40 + (i % 5) * 18, r = 8 + (i % 4) * 7;
    const x = (i * 173) % W + Math.sin(t * 1.3 + i) * 20;
    const y = H + 60 - ((t * sp + i * 97) % (H + 120));
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 2.5; ctx.stroke();
    circ(x - r * .35, y - r * .35, r * .22, `rgba(255,255,255,${a + .15})`);
  }
}
function confetti(t) {
  const cols = ['#ffd23f', '#ff5a5f', '#3b8beb', '#5dff9a', '#ff7aa2', '#b06bff'];
  for (let i = 0; i < 70; i++) {
    const x = (i * 97) % W + Math.sin(t * 2 + i) * 30, y = ((t * (120 + (i % 7) * 25) + i * 61) % (H + 40)) - 20;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-6, -3, 12, 7); ctx.restore();
  }
}
function foam(cx, cy, k, t) {
  if (k <= 0) return;
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * TAU + t * .8, d = 22 + (i % 3) * 12;
    circ(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .6, (7 + (i % 4) * 3) * k, 'rgba(255,255,255,.92)');
  }
}
function timerRing(x, y, r, frac, label, sub) {
  circ(x, y, r + 14, 'rgba(14,58,70,.88)');
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 12; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(frac)); ctx.strokeStyle = '#ffd23f'; ctx.lineCap = 'round'; ctx.stroke();
  txt(label, x, y - 4, r * .5, '#ffffff');
  if (sub) txt(sub, x, y + r * .42, 17, '#a7cdd2');
}
const banner = s => pill(28, 26, s, 30, '#ffd23f', '#0e3a46');
const score = n => pill(W - 28, 26, 'Очки: ' + n, 28, 'rgba(14,58,70,.88)', '#ffffff', 'right');
const arTag = () => pill(28, 92, 'AR-режим: видны микробы', 20, 'rgba(37,227,255,.9)', '#0b2d36');
const mmss = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

/* ---------- scenes ---------- */
let CUR = null; // current scene + local time, for speaking()
function speaking(name) {
  if (!CUR) return false;
  const c = CUR.sc.cues.find(c => CUR.t >= c[0] && CUR.t < c[1]);
  if (!c) return false;
  if (c[2] === name) return true;
  const KIDS = ['Тимур', 'Лея', 'Дилшод', 'Томирис'];
  if ((c[2] === 'Песня' || c[2] === 'Дети') && KIDS.includes(name)) return true;
  if (c[2] === 'Все' && (KIDS.includes(name) || name === 'Чистон' || name === 'Мама')) return true;
  return false;
}

