/* ---------- style 2: heads in the look of the approved family drawing ---------- */
const HAIR2 = { boy: '#1d1410', girl: '#2a1912', mom: '#24160f', papa: '#1a120d' };
const SKIN2 = { boy: ['#f6d2b6', '#e2ab86'], girl: ['#f8d6bd', '#e6b08f'], mom: ['#f7d6c0', '#e3ad8f'], papa: ['#ecc3a2', '#cf9673'] };
function hairPath(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let i = 1; for (; i + 2 < pts.length; i += 3) ctx.bezierCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pts[i + 2][0], pts[i + 2][1]); for (; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }
function hairFill(cx, cy, r, col) { const g = ctx.createLinearGradient(cx - r, cy - r, cx + r * .6, cy + r); g.addColorStop(0, '#4a3226'); g.addColorStop(.35, col); g.addColorStop(1, col); ctx.fillStyle = g; ctx.fill(); }
function sheen(cx, cy, r) { ctx.save(); ctx.globalAlpha = .22; ctx.strokeStyle = '#c99a78'; ctx.lineWidth = r * .08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx - r * .1, cy - r * .1, r * .78, 1.15 * Math.PI, 1.45 * Math.PI); ctx.stroke(); ctx.restore(); }
// long hair that falls behind the shoulders (drawn before the face)
function backHair(cx, cy, r, kind, t) {
  if (kind !== 'girl' && kind !== 'mom') return;
  const L = kind === 'mom' ? 1.75 : 1.3, sw = Math.sin(t * 1.4) * r * .03;
  hairPath([[cx - r * 1.02, cy - r * .2], [cx - r * 1.22, cy + r * .4], [cx - r * 1.1 + sw, cy + r * L * .75], [cx - r * .78 + sw, cy + r * L],
    [cx - r * .45, cy + r * L * .92], [cx + r * .45, cy + r * L * .92], [cx + r * .78 + sw, cy + r * L],
    [cx + r * 1.1 + sw, cy + r * L * .75], [cx + r * 1.22, cy + r * .4], [cx + r * 1.02, cy - r * .2]]);
  hairFill(cx, cy, r * 1.4, HAIR2[kind]);
  ctx.save(); ctx.clip(); ctx.globalAlpha = .22; ctx.strokeStyle = '#000'; ctx.lineWidth = r * .035;
  [-1, 1].forEach(s => { for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(cx + s * r * (.75 + k * .12), cy + r * .2); ctx.bezierCurveTo(cx + s * r * (1.0 + k * .04), cy + r * .6, cx + s * r * (.8 + k * .08), cy + r * .95, cx + s * r * (.85 + k * .06) + sw, cy + r * L * .95); ctx.stroke(); } });
  ctx.restore();
}
function head2(cx, cy, r, o, kind) {
  const t = o.t || 0, adult = kind === 'mom' || kind === 'papa', girlish = kind === 'girl' || kind === 'mom';
  const talk = typeof o.talk === 'number' ? o.talk : o.talk ? .4 + Math.abs(Math.sin(t * 15)) * .6 : 0;
  backHair(cx, cy, r, kind, t);
  // ears
  [-1, 1].forEach(s => { ell(cx + s * r * .97, cy + r * .02, r * .17, r * .23, SKIN2[kind][1]); ell(cx + s * r * .96, cy + r * .02, r * .1, r * .15, SKIN2[kind][0]); });
  if (o.earrings || kind === 'girl' || kind === 'mom') [-1, 1].forEach(s => circ(cx + s * r * .98, cy + r * .26, r * .06, '#e6b800'));
  // face: soft oval, narrower chin, gradient shading and a thin outline
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.bezierCurveTo(cx + r * .62, cy - r, cx + r, cy - r * .55, cx + r, cy - r * .05);
  ctx.bezierCurveTo(cx + r, cy + r * (adult ? .55 : .5), cx + r * .55, cy + r * (adult ? 1.02 : .95), cx, cy + r * (adult ? 1.04 : .97));
  ctx.bezierCurveTo(cx - r * .55, cy + r * (adult ? 1.02 : .95), cx - r, cy + r * (adult ? .55 : .5), cx - r, cy - r * .05);
  ctx.bezierCurveTo(cx - r, cy - r * .55, cx - r * .62, cy - r, cx, cy - r); ctx.closePath();
  const fg = ctx.createRadialGradient(cx - r * .3, cy - r * .35, r * .1, cx, cy, r * 1.15); fg.addColorStop(0, SKIN2[kind][0]); fg.addColorStop(.75, SKIN2[kind][0]); fg.addColorStop(1, SKIN2[kind][1]);
  ctx.fillStyle = fg; ctx.fill(); ctx.strokeStyle = 'rgba(120,60,35,.35)'; ctx.lineWidth = r * .025; ctx.stroke();
  // soft rosy cheeks (gentle, not round balls)
  [-1, 1].forEach(s => { const g = ctx.createRadialGradient(cx + s * r * .52, cy + r * .32, 0, cx + s * r * .52, cy + r * .32, r * .26); g.addColorStop(0, 'rgba(240,120,110,.28)'); g.addColorStop(1, 'rgba(240,120,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx + s * r * .52, cy + r * .32, r * .26, 0, TAU); ctx.fill(); });
  if (kind === 'papa') { ctx.save(); ctx.beginPath(); ctx.moveTo(cx - r * .95, cy + r * .1); ctx.bezierCurveTo(cx - r * .9, cy + r * .75, cx - r * .4, cy + r * 1.03, cx, cy + r * 1.05); ctx.bezierCurveTo(cx + r * .4, cy + r * 1.03, cx + r * .9, cy + r * .75, cx + r * .95, cy + r * .1);
    ctx.bezierCurveTo(cx + r * .6, cy + r * .45, cx + r * .3, cy + r * .4, cx, cy + r * .42); ctx.bezierCurveTo(cx - r * .3, cy + r * .4, cx - r * .6, cy + r * .45, cx - r * .95, cy + r * .1); ctx.fillStyle = 'rgba(40,25,18,.26)'; ctx.fill();
    ell(cx, cy + r * .42, r * .3, r * .06, 'rgba(40,25,18,.45)'); ctx.restore(); }
  // eyes: almond whites, warm brown irises, two highlights, a dark lash line
  const ex = r * (adult ? .36 : .38), ey = cy + r * (adult ? .02 : .05), ew = r * (adult ? .2 : .24), eh = r * (adult ? .15 : .21);
  const blink = o.closed || o.mood === 'sleepy' || ((t + (kind.length * .7)) % 3.4) < .12;
  const look = o.look || [0, 0], wow = o.mood === 'wow';
  [-1, 1].forEach(s => {
    const x = cx + s * ex;
    if (blink) { ctx.beginPath(); ctx.arc(x, ey - eh * .2, ew * .9, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = '#2a1810'; ctx.lineWidth = r * .045; ctx.lineCap = 'round'; ctx.stroke(); }
    else {
      const h = eh * (wow ? 1.15 : o.mood === 'bored' ? .65 : 1);
      ctx.save(); ctx.beginPath(); ctx.moveTo(x - ew, ey); ctx.bezierCurveTo(x - ew * .6, ey - h * 1.2, x + ew * .6, ey - h * 1.2, x + ew, ey - h * .1); ctx.bezierCurveTo(x + ew * .6, ey + h * 1.05, x - ew * .6, ey + h * 1.05, x - ew, ey); ctx.closePath();
      ctx.fillStyle = '#fbf7f2'; ctx.fill(); ctx.clip();
      const ix = x + look[0] * ew * .35, iy = ey + look[1] * h * .25 + h * .05, ir = h * .9;
      const ig = ctx.createRadialGradient(ix, iy - ir * .35, ir * .1, ix, iy, ir); ig.addColorStop(0, '#9a6640'); ig.addColorStop(.55, '#5a3420'); ig.addColorStop(1, '#22140c');
      ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, TAU); ctx.fill();
      circ(ix, iy, ir * .45, '#0e0806'); circ(ix + ir * .35, iy - ir * .4, ir * .28, '#ffffff'); circ(ix - ir * .35, iy + ir * .35, ir * .12, '#ffffff');
      if (o.redEyes > 0) { ctx.fillStyle = `rgba(255,70,70,${.35 * o.redEyes})`; ctx.fillRect(x - ew, ey - h * 1.2, ew * 2, h * 2.4); }
      ctx.restore();
      ctx.strokeStyle = '#2a1810'; ctx.lineCap = 'round'; ctx.lineWidth = r * (girlish ? .05 : .038);
      ctx.beginPath(); ctx.moveTo(x - ew * 1.02, ey + r * .01); ctx.bezierCurveTo(x - ew * .6, ey - h * 1.22, x + ew * .6, ey - h * 1.22, x + ew * 1.04, ey - h * .14); ctx.stroke();
      if (girlish) { ctx.lineWidth = r * .03; ctx.beginPath(); ctx.moveTo(x + s * ew * .95, ey - h * .25); ctx.lineTo(x + s * ew * 1.25, ey - h * .6); ctx.stroke(); }
    }
    // brows
    const by = ey - eh - r * (wow ? .2 : .14), tilt = o.mood === 'sad' ? .25 : o.mood === 'angry' ? -.3 : 0;
    ctx.save(); ctx.translate(x, by); ctx.scale(s, 1); ctx.rotate(tilt); ctx.fillStyle = HAIR2[kind];
    ctx.beginPath(); ctx.moveTo(-ew * .9, ew * .12); ctx.quadraticCurveTo(-ew * .1, -ew * (adult ? .45 : .38), ew * 1.0, -ew * .02); ctx.quadraticCurveTo(-ew * .1, -ew * (adult ? .26 : .2), -ew * .9, ew * .24); ctx.fill(); ctx.restore();
  });
  if (o.glasses) { ctx.lineWidth = r * .06; ctx.strokeStyle = '#25e3ff'; [-1, 1].forEach(s => { rr(cx + s * ex - r * .3, ey - r * .26, r * .6, r * .5, r * .14); ctx.fillStyle = 'rgba(60,230,255,.22)'; ctx.fill(); ctx.stroke(); }); }
  // nose: a small curve with soft shade
  ctx.strokeStyle = 'rgba(150,80,50,.55)'; ctx.lineWidth = r * .03; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - r * .07, cy + r * .26); ctx.quadraticCurveTo(cx, cy + r * .32, cx + r * .07, cy + r * .26); ctx.stroke();
  // mouth: lip-synced when talking, gentle smile otherwise
  const my = cy + r * (adult ? .55 : .52), mw = r * (adult ? .24 : .22), lip = kind === 'mom' ? '#c0606a' : kind === 'girl' ? '#c76d6d' : '#b5655c';
  if (o.full) [-1, 1].forEach(s => { const g = ctx.createRadialGradient(cx + s * r * .5, cy + r * .4, 0, cx + s * r * .5, cy + r * .4, r * .32); g.addColorStop(0, SKIN2[kind][0]); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx + s * r * .5, cy + r * .4, r * .32, 0, TAU); ctx.fill(); });
  if (talk > .03 || wow) {
    const oh = r * (.05 + (wow && talk < .05 ? .5 : talk) * .2);
    ctx.beginPath(); ctx.moveTo(cx - mw, my - oh * .15); ctx.quadraticCurveTo(cx, my - oh * .5, cx + mw, my - oh * .15); ctx.quadraticCurveTo(cx + mw * .6, my + oh * 1.1, cx, my + oh * 1.15); ctx.quadraticCurveTo(cx - mw * .6, my + oh * 1.1, cx - mw, my - oh * .15);
    ctx.fillStyle = '#5b1d1f'; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(cx - mw, my - oh * .55, mw * 2, oh * .4); ell(cx, my + oh * 1.0, mw * .55, oh * .45, '#e8737f'); ctx.restore();
    ctx.strokeStyle = lip; ctx.lineWidth = r * .03; ctx.stroke();
  } else if (o.mood === 'sad') { ctx.beginPath(); ctx.moveTo(cx - mw * .7, my + r * .05); ctx.quadraticCurveTo(cx, my - r * .05, cx + mw * .7, my + r * .05); ctx.strokeStyle = lip; ctx.lineWidth = r * .04; ctx.stroke(); }
  else if (o.mood === 'bored') line(cx - mw * .6, my, cx + mw * .6, my, lip, r * .04);
  else { ctx.beginPath(); ctx.moveTo(cx - mw, my - r * .02); ctx.quadraticCurveTo(cx, my + r * .11, cx + mw, my - r * .02); ctx.strokeStyle = '#7a3a33'; ctx.lineWidth = r * .035; ctx.lineCap = 'round'; ctx.stroke();
    if (girlish) ell(cx, my + r * .08, mw * .4, r * .035, lip); }
  // front hair
  const hc = HAIR2[kind];
  if (kind === 'boy') {
    hairPath([[cx - r * 1.04, cy + r * .05], [cx - r * 1.15, cy - r * .9], [cx - r * .5, cy - r * 1.25], [cx + r * .1, cy - r * 1.2], [cx + r * .8, cy - r * 1.18], [cx + r * 1.15, cy - r * .8], [cx + r * 1.04, cy + r * .05],
      [cx + r * .98, cy - r * .3], [cx + r * .85, cy - r * .45], [cx + r * .6, cy - r * .42], [cx + r * .3, cy - r * .5], [cx, cy - r * .38], [cx - r * .2, cy - r * .48], [cx - r * .5, cy - r * .42], [cx - r * .8, cy - r * .5], [cx - r * .98, cy - r * .3], [cx - r * 1.04, cy + r * .05]]);
    hairFill(cx, cy - r * .6, r, hc); sheen(cx, cy - r * .2, r);
    ctx.fillStyle = hc; for (let i = 0; i < 7; i++) { const x = cx - r * .72 + i * r * .24, y = cy - r * .5 + Math.abs(i - 3) * r * .03; ctx.beginPath(); ctx.moveTo(x - r * .13, y - r * .1); ctx.quadraticCurveTo(x + r * .02, y + r * .02, x + r * .05, y + r * .2); ctx.quadraticCurveTo(x + r * .08, y + r * .02, x + r * .13, y - r * .1); ctx.fill(); }
  } else if (kind === 'girl') {
    hairPath([[cx - r * 1.08, cy + r * .4], [cx - r * 1.2, cy - r * .9], [cx - r * .4, cy - r * 1.22], [cx + r * .2, cy - r * 1.2], [cx + r * .9, cy - r * 1.15], [cx + r * 1.2, cy - r * .7], [cx + r * 1.08, cy + r * .4],
      [cx + r * .95, cy - r * .1], [cx + r * .8, cy - r * .4], [cx + r * .5, cy - r * .45], [cx + r * .2, cy - r * .5], [cx - r * .1, cy - r * .38], [cx - r * .35, cy - r * .5], [cx - r * .7, cy - r * .5], [cx - r * .9, cy - r * .15], [cx - r * 1.08, cy + r * .4]]);
    hairFill(cx, cy - r * .5, r, hc); sheen(cx, cy - r * .2, r);
    // pink clip
    ctx.save(); ctx.translate(cx + r * .62, cy - r * .62); ctx.rotate(.4); [-1, 1].forEach(s => ell(s * r * .13, 0, r * .14, r * .1, '#ff7aa2')); circ(0, 0, r * .07, '#ff4f8b'); ctx.restore();
  } else if (kind === 'mom') {
    hairPath([[cx - r * 1.1, cy + r * .6], [cx - r * 1.2, cy - r * .9], [cx - r * .5, cy - r * 1.25], [cx, cy - r * 1.18], [cx + r * .5, cy - r * 1.25], [cx + r * 1.2, cy - r * .9], [cx + r * 1.1, cy + r * .6],
      [cx + r * .95, cy + r * .1], [cx + r * .85, cy - r * .55], [cx + r * .05, cy - r * .95], [cx - r * .85, cy - r * .55], [cx - r * .95, cy + r * .1], [cx - r * 1.1, cy + r * .6]]);
    hairFill(cx, cy - r * .5, r, hc); sheen(cx, cy - r * .3, r);
  } else {
    hairPath([[cx - r * 1.0, cy - r * .2], [cx - r * 1.1, cy - r * 1.1], [cx - r * .2, cy - r * 1.35], [cx + r * .3, cy - r * 1.3], [cx + r * 1.0, cy - r * 1.25], [cx + r * 1.1, cy - r * .7], [cx + r * 1.0, cy - r * .2],
      [cx + r * .9, cy - r * .5], [cx + r * .7, cy - r * .62], [cx + r * .3, cy - r * .6], [cx, cy - r * .58], [cx - r * .5, cy - r * .62], [cx - r * .9, cy - r * .5], [cx - r * 1.0, cy - r * .2]]);
    hairFill(cx, cy - r * .7, r, hc); sheen(cx, cy - r * .35, r);
  }
}

function kid(x, y, s, o) {
  o = Object.assign({ girl: false, dirty: 0, dirtyHands: null, mood: 'happy', talk: false, armL: .2, armR: .2,
    handL: null, handR: null, shirt: '#3b8beb', hold: null, brushTo: null, glasses: false, badge: 0, t: 0,
    pants: null, redEyes: 0, look: [0, 0], squat: 0, tilt: 0, pajama: false, full: false, closed: false, spoonTo: null, glow: null }, o);
  const LL = 100 * (1 - .45 * o.squat);
  const dh = o.dirtyHands == null ? o.dirty : o.dirtyHands;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt); ctx.scale(s, s);
  ell(0, 0, 62, 11, 'rgba(0,0,0,.16)');
  const legC = o.pants || (o.dressy ? '#ffffff' : o.girl ? SKIN : '#2b3f73');
  box(-34, -LL, 26, LL, 12, legC); box(8, -LL, 26, LL, 12, legC);
  const shoe = o.dressy ? '#d6336c' : o.girl ? '#ff7aa2' : '#ffffff';
  ell(-22, -6, 22, 10, shoe); ell(22, -6, 22, 10, shoe);
  ctx.translate(0, 100 - LL);
  if (o.girl) {
    ctx.beginPath(); ctx.moveTo(-34, -205); ctx.lineTo(34, -205); ctx.lineTo(64, -90);
    ctx.quadraticCurveTo(0, -78, -64, -90); ctx.closePath(); ctx.fillStyle = o.shirt; ctx.fill();
    if (o.dressy) {
      // day dress: white collar, yellow belt, little flowers
      ell(-14, -200, 18, 10, '#ffffff'); ell(14, -200, 18, 10, '#ffffff');
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(-42, -160, 84, 12); circ(0, -154, 9, '#ffd23f');
      [[-28, -122], [22, -130], [36, -104], [-6, -100], [-40, -100], [8, -118]].forEach(p => { for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circ(p[0] + Math.cos(a) * 4.5, p[1] + Math.sin(a) * 4.5, 3.4, '#ffffff'); } circ(p[0], p[1], 2.6, '#ffd23f'); });
    } else [[-25, -130], [18, -160], [30, -110], [-8, -105], [-14, -175]].forEach(p => circ(p[0], p[1], 6, 'rgba(255,255,255,.7)'));
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
  head2(0, -254, 50, o, o.girl ? 'girl' : 'boy');
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
  head2(0, -364, 56, o, 'mom');
  ctx.restore();
  return { hl: [x + hl[0] * s, y + hl[1] * s], hr: [x + hr[0] * s, y + hr[1] * s] };
}
function papa(x, y, s, o) {
  o = Object.assign({ talk: false, t: 0, armL: .15, armR: .15, handL: null, handR: null, bag: false, mood: 'happy', jacket: false }, o);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 0, 76, 12, 'rgba(0,0,0,.16)');
  box(-36, -150, 30, 150, 12, '#3a3f5c'); box(6, -150, 30, 150, 12, '#3a3f5c');
  ell(-22, -6, 26, 10, '#2d2a26'); ell(24, -6, 26, 10, '#2d2a26');
  box(-58, -330, 116, 196, 30, '#2f3b52');
  if (o.jacket) { box(-58, -330, 46, 196, 24, '#5a6b7d'); box(12, -330, 46, 196, 24, '#5a6b7d'); }
  ellipse_collar: { ctx.beginPath(); ctx.ellipse(0, -326, 24, 9, 0, 0, Math.PI); ctx.fillStyle = '#26314a'; ctx.fill(); }
  const sl = o.jacket ? '#5a6b7d' : '#2f3b52';
  const hl = o.handL || [-50 - Math.sin(o.armL) * 110, -314 + Math.cos(o.armL) * 110];
  const hr = o.handR || [50 + Math.sin(o.armR) * 110, -314 + Math.cos(o.armR) * 110];
  arm([-50, -314], hl, sl); arm([50, -314], hr, sl);
  if (o.bag) { box(hr[0] - 34, hr[1] + 6, 68, 50, 8, '#7a4b25'); box(hr[0] - 12, hr[1] - 4, 24, 12, 4, '#7a4b25'); circ(hr[0], hr[1], 14, SKIN); }
  box(-14, -352, 28, 30, 8, SKIN);
  head2(0, -394, 60, o, 'papa');
  ctx.restore();
  return { hl: [x + hl[0] * s, y + hl[1] * s], hr: [x + hr[0] * s, y + hr[1] * s] };
}

/* ---------- lip sync from Silero loudness envelopes ---------- */
function speaking(name) {
  if (!CUR) return false;
  const ci = CUR.sc.cues.findIndex(c => CUR.t >= c[0] && CUR.t < c[1]); if (ci < 0) return false;
  const c = CUR.sc.cues[ci], kids = ['Дилшод', 'Томирис', 'Тимур'];
  const mine = c[2] === name || ((c[2] === 'Дети' || c[2] === 'Песня') && kids.includes(name)) || (c[2] === 'Все' && [...kids, 'Мама', 'Папа', 'Чистон'].includes(name));
  if (!mine) return false;
  const e = typeof ENV2 !== 'undefined' && ENV2[SCENES.indexOf(CUR.sc) + '_' + ci]; if (!e) return true;
  const i = Math.floor((CUR.t - c[0]) * 24); return i >= 0 && i < e.length ? Math.max(.001, e[i]) : .001;
}
/* ---------- gentle camera: slow push-in / pull-out per scene with a little drift ---------- */
function camera2(sc, t) {
  const i = SCENES.indexOf(sc); if (i <= 0 || i === SCENES.length - 1) return;
  const k = ease(seg(t, 0, sc.dur)), z = 1 + .08 * (i % 2 ? k : 1 - k) + .012 * Math.sin(t * .8);
  const fx = 640 + (((i * 137) % 5) - 2) * 70, fy = 330 + Math.sin(t * .5) * 8;
  ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy);
}
/* ---------- sleeping heads on the pillow in the new style ---------- */
function sleepyHead(x, y, t, girl, awake) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.35);
  head2(0, 0, girl ? 40 : 44, { t, closed: !awake, mood: awake ? 'happy' : 'sleepy', talk: awake ? speaking(girl ? 'Томирис' : 'Дилшод') : 0 }, girl ? 'girl' : 'boy');
  ctx.restore();
  if (!awake) for (let i = 0; i < 3; i++) {
    const k = ((t * .5 + i / 3) % 1);
    ctx.globalAlpha = 1 - k; txt('z', x + 50 + k * 40, y - 60 - k * 90, 26 + i * 6, '#5b6fb5'); ctx.globalAlpha = 1;
  }
}
