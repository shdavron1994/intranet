// Soft, child-like cartoon people: big heads, round bellies, bending elbows and knees, expressive faces.
import * as THREE from 'three';

const V2 = THREE.Vector2;
const cache = {};
function skinMat(c) { return cache['s' + c] || (cache['s' + c] = new THREE.MeshPhysicalMaterial({ color: c, roughness: .55, sheen: .6, sheenColor: new THREE.Color('#ffb8a0'), sheenRoughness: .6 })); }
function cloth(c, map) { const k = 'c' + c + (map ? map.uuid : ''); return cache[k] || (cache[k] = new THREE.MeshStandardMaterial({ color: map ? '#ffffff' : c, map: map || null, roughness: .88 })); }
function plain(c, o = {}) { const k = 'p' + c + JSON.stringify(o); return cache[k] || (cache[k] = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .5 }, o))); }
function hairTex(c) {
  // fine combed strands so hair reads as hair, not plastic
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const g = cv.getContext('2d');
  g.fillStyle = c; g.fillRect(0, 0, 256, 64);
  for (let i = 0; i < 90; i++) { const x = (i * 37) % 256; g.strokeStyle = i % 3 ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.10)'; g.lineWidth = 1 + (i % 2); g.beginPath(); g.moveTo(x, 0); g.lineTo(x + Math.sin(i) * 6, 64); g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); return t;
}
function hairMat(c) { return cache['h' + c] || (cache['h' + c] = new THREE.MeshPhysicalMaterial({ color: '#ffffff', map: hairTex(c), roughness: .78, sheen: .25, sheenColor: new THREE.Color('#6b4a33') })); }
function M(geo, m, cast = true) { const x = new THREE.Mesh(geo, m); x.castShadow = cast; x.receiveShadow = true; return x; }
const sph = (r, m, s = 32) => M(new THREE.SphereGeometry(r, s, Math.round(s * .75)), m);
const cap = (r, l, m) => M(new THREE.CapsuleGeometry(r, l, 8, 20), m);
const put = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const lathe = (pts, m) => M(new THREE.LatheGeometry(pts.map(([r, y]) => new V2(r, y)), 40), m);

function stripes(base, line) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 64, 256); g.fillStyle = line; for (let y = 0; y < 256; y += 32) g.fillRect(0, y, 64, 12);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 1); return t;
}
function dots(base, dot) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 128, 128); g.fillStyle = dot;
  for (let y = 16; y < 128; y += 32) for (let x = (y / 32 % 2) * 16 + 8; x < 128; x += 32) { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 3.6, 0, 7); g.fill(); } g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill(); g.fillStyle = dot; }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 2); return t;
}

function geoPattern() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#fbf7f4'; g.fillRect(0, 0, 256, 256);
  [['#f0c9b8', 0], ['#c9ccd6', 80], ['#e7b9b0', 160]].forEach(([col, y]) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, y); g.lineTo(256, y + 40); g.lineTo(256, y + 70); g.lineTo(0, y + 30); g.fill(); });
  g.strokeStyle = '#7a7a86'; g.lineWidth = 4; g.beginPath(); for (let i = 0; i < 9; i++) g.lineTo(150 + (i % 2) * 14, i * 30); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); return t;
}
const DIMS = {
  kid: { R: .27, hipY: .4, thigh: .12, shin: .12, legR: .058, torso: .34, sh: .155, armU: .11, armF: .1, armR: .045, neck: .05 },
  adult: { R: .23, hipY: .84, thigh: .35, shin: .33, legR: .075, torso: .58, sh: .23, armU: .25, armF: .23, armR: .065, neck: .05 }
};

export function makePerson(o) {
  o = Object.assign({ kind: 'boy', shirt: '#3b8beb', pants: '#2b3f73', shoes: '#ffffff', skin: '#f1c09a', hair: '#3b2418', scale: 1, pajama: false, eye: '#5a3a22' }, o);
  const adult = o.kind === 'mom' || o.kind === 'papa', girl = o.kind === 'girl' || o.kind === 'mom';
  const d = DIMS[adult ? 'adult' : 'kid'], R = d.R;
  const SK = skinMat(o.skin);
  const shirtMap = o.pajama ? stripes(o.shirt, '#ffffff') : o.flowers ? dots(o.shirt, '#ffffff') : o.geo ? geoPattern() : null;
  const SH = cloth(o.shirt, shirtMap), PA = cloth(o.pants, o.pajama ? shirtMap : null);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const hips = put(new THREE.Group(), 0, d.hipY, 0); body.add(hips);

  // legs: hip -> knee -> foot
  const legs = [-1, 1].map(s => {
    const hip = put(new THREE.Group(), s * (adult ? .1 : .07), 0, 0); hips.add(hip);
    const legMat = girl && !o.pajama ? (o.tights ? cloth(o.tights) : SK) : PA;
    hip.add(put(cap(d.legR, d.thigh * .7, legMat), 0, -d.thigh / 2, 0));
    const knee = put(new THREE.Group(), 0, -d.thigh, 0); hip.add(knee);
    knee.add(put(cap(d.legR * .92, d.shin * .7, legMat), 0, -d.shin / 2, 0));
    const foot = put(new THREE.Group(), 0, -d.shin - d.legR * .7, .03); knee.add(foot);
    const shoe = sph(d.legR * 1.35, plain(o.shoes, { roughness: .4 }), 24); shoe.scale.set(1, .62, 1.55); foot.add(shoe);
    hip.userData.knee = knee; return hip;
  });

  // torso: a pear-shaped lathe (round tummy), or a dress for girls
  const torso = new THREE.Group(); hips.add(torso);
  const T = d.torso;
  let tp;
  if (girl && !o.pajama) tp = [[0, -T * .2], [R * (adult ? 1.9 : 1.05), -T * .22], [R * (adult ? 1.7 : .95), -T * .08], [R * (adult ? 1.15 : .66), T * .25], [R * (adult ? 1.05 : .6), T * .55], [R * (adult ? 1.1 : .58), T * .82], [R * .4, T * .98], [0, T]];
  else tp = [[0, -.02], [R * (adult ? 1.0 : .55), 0], [R * (adult ? 1.15 : .66), T * .18], [R * (adult ? 1.2 : .68), T * .45], [R * (adult ? 1.25 : .6), T * .78], [R * .5, T * .95], [0, T]];
  const tm = lathe(tp, SH); torso.add(tm);
  if (o.collar) { const c = M(new THREE.TorusGeometry(R * .42, R * .1, 10, 30), plain('#ffffff')); c.rotation.x = Math.PI / 2; put(c, 0, T * .96, 0); torso.add(c); }
  if (o.belt) { const b = M(new THREE.TorusGeometry(R * .62, R * .07, 10, 40), plain('#ffd23f')); b.rotation.x = Math.PI / 2; put(b, 0, T * .3, 0); torso.add(b); }
  if (o.apron) { const a = M(new THREE.CylinderGeometry(R * 1.2, R * 1.75, T * .9, 32, 1, true, -.9, 1.8), plain('#ffffff', { side: THREE.DoubleSide, roughness: .9 })); put(a, 0, T * .1, .01); torso.add(a); }
  if (o.jacket) [-1, 1].forEach(s => { const j = M(new THREE.CylinderGeometry(R * 1.28, R * 1.12, T * .95, 24, 1, true, s > 0 ? .35 : Math.PI + .35, Math.PI - .7), plain(o.jacket, { side: THREE.DoubleSide, roughness: .8 })); put(j, 0, T * .5, 0); torso.add(j); });
  if (o.tie) { const ti = M(new THREE.ConeGeometry(R * .14, T * .5, 4), plain('#3b8beb')); ti.rotation.x = Math.PI; put(ti, 0, T * .62, R * 1.22); torso.add(ti); }
  if (o.polo) { const pc = M(new THREE.CylinderGeometry(R * .62, R * .9, T * .12, 32, 1, true), plain(o.polo, { side: THREE.DoubleSide })); put(pc, 0, T * .95, 0); torso.add(pc); const pl = M(new THREE.BoxGeometry(R * .2, T * .3, R * .05), plain(o.polo)); put(pl, 0, T * .78, R * 1.18); torso.add(pl); }
  if (o.logo) { const l = sph(R * .16, plain('#ffd23f'), 16); l.scale.set(1, 1, .35); put(l, 0, T * .55, R * .66); torso.add(l); }

  // arms: shoulder -> elbow -> hand (mitten with a thumb)
  const shY = T * (adult ? .86 : .82);
  const arms = [-1, 1].map(s => {
    const sh = put(new THREE.Group(), s * d.sh, shY, 0); torso.add(sh);
    const sleeveMat = o.jacket ? plain(o.jacket, { roughness: .8 }) : SH;
    sh.add(put(cap(d.armR, d.armU * .75, sleeveMat), 0, -d.armU / 2, 0));
    const el = put(new THREE.Group(), 0, -d.armU, 0); sh.add(el);
    el.add(put(cap(d.armR * .88, d.armF * .7, o.pajama || adult ? sleeveMat : SK), 0, -d.armF / 2, 0));
    const hand = put(new THREE.Group(), 0, -d.armF - d.armR * .6, 0); el.add(hand);
    const palm = sph(d.armR * 1.25, SK, 20); palm.scale.set(1, 1.1, .8); hand.add(palm);
    hand.add(put(sph(d.armR * .5, SK, 12), s * -d.armR * .9, d.armR * .3, d.armR * .3));
    sh.userData = { el, hand }; return sh;
  });

  // head
  const head = put(new THREE.Group(), 0, T + d.neck + R * .82, 0); torso.add(head);
  torso.add(put(cap(R * .28, d.neck, SK), 0, T + d.neck * .3, 0));
  const skull = sph(R, SK, 56); if (adult) skull.scale.set(.96, 1.12, .98); else skull.scale.set(1.04, .97, 1); head.add(skull);
  [-1, 1].forEach(s => { const ear = sph(R * .2, SK, 16); ear.scale.set(.6, 1, .8); put(ear, s * R * 1.0, 0, 0); head.add(ear); });
  const blush = plain('#ff8fa3', { transparent: true, opacity: .32, roughness: .9 });
  const nose = sph(R * (adult ? .11 : .09), SK, 16); put(nose, 0, -R * .12, R * .99); head.add(nose);

  // eyes with iris, pupil, two highlights and a lid
  const eyes = [-1, 1].map(s => {
    const g = put(new THREE.Group(), s * R * .36, R * .03, R * .82); head.add(g);
    g.rotation.y = s * .28;
    const white = sph(R * .23, plain('#ffffff', { roughness: .15 }), 32); white.scale.set(1, 1.12, .62); g.add(white);
    const iris = put(sph(R * .155, plain(o.eye, { roughness: .2 }), 24), 0, -R * .015, R * .1); iris.scale.set(1, 1.1, .45); g.add(iris);
    const pupil = put(sph(R * .085, plain('#120a06', { roughness: .1 }), 16), 0, -R * .015, R * .145); pupil.scale.set(1, 1.1, .4); g.add(pupil);
    const h1 = put(sph(R * .045, plain('#ffffff', { emissive: '#ffffff', emissiveIntensity: .6 }), 10), R * .06, R * .07, R * .18); g.add(h1);
    const h2 = put(sph(R * .022, plain('#ffffff', { emissive: '#ffffff', emissiveIntensity: .6 }), 8), -R * .05, -R * .06, R * .18); g.add(h2);
    const lid = M(new THREE.SphereGeometry(R * .245, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), SK); lid.scale.set(1.03, 1.14, .66); g.add(lid);
    let lash = null;
    if (girl) { lash = M(new THREE.TorusGeometry(R * .2, R * .022, 6, 20, Math.PI * .8), plain('#1b120c')); lash.rotation.z = Math.PI * .1; put(lash, 0, R * .04, R * .1); g.add(lash); }
    g.userData = { iris, pupil, h1, h2, lid, lash }; return g;
  });
  const brows = [-1, 1].map(s => { const b = M(new THREE.TorusGeometry(R * .16, R * .028 * (o.browW || 1), 8, 18, Math.PI * .55), hairMat(o.brow || o.hair)); b.rotation.z = Math.PI * .22; put(b, s * R * .36, R * .3, R * .9); b.userData.base = b.position.y; head.add(b); return b; });

  // mouth: a smile line when closed, an open mouth with teeth and tongue when talking
  const mouth = put(new THREE.Group(), 0, -R * .43, R * .9); mouth.rotation.x = -.35; head.add(mouth);
  const smile = M(new THREE.TorusGeometry(R * .17, R * .03 * (o.lips ? 1.6 : 1), 8, 24, Math.PI), plain(o.lips || '#8a3030')); smile.rotation.z = Math.PI; mouth.add(smile);
  const open = new THREE.Group(); mouth.add(open);
  const cavity = sph(R * .2, plain('#5a1a1a', { roughness: .8 }), 20); cavity.scale.set(1, .6, .3); open.add(cavity);
  const teeth = put(M(new THREE.BoxGeometry(R * .22, R * .05, R * .05), plain('#ffffff')), 0, R * .085, R * .03); open.add(teeth);
  const tongue = put(sph(R * .11, plain('#ff7a8a'), 16), 0, -R * .06, R * .02); tongue.scale.set(1.2, .5, .6); open.add(tongue);

  // hair
  const HM = hairMat(o.hair);
  const capM = M(new THREE.SphereGeometry(R * 1.06, 48, 24, 0, Math.PI * 2, 0, Math.PI * .5), HM); capM.rotation.x = -.42; put(capM, 0, R * .04, -R * .03); head.add(capM);
  if (o.style === 'spiky') {
    // short crew cut with a little fringe
    capM.scale.set(1, .95, 1);
    for (let i = 0; i < 26; i++) { const a = i * 2.399, rr = Math.sqrt((i + .5) / 26); const x = Math.cos(a) * rr * .85, z = Math.sin(a) * rr * .85 - .05; const y = Math.sqrt(Math.max(0, 1 - x * x - z * z)) * .95 + .05;
      const sp = M(new THREE.ConeGeometry(R * .12, R * .17, 8), HM); put(sp, x * R * .99, y * R * .99, z * R * .99); sp.lookAt(x * R * 3, y * R * 3 + R, z * R * 3); sp.rotateX(Math.PI / 2); head.add(sp); }
    for (let i = 0; i < 8; i++) { const x = (i - 3.5) * .12; const st = cap(R * .055, R * .2, HM); put(st, x * R, R * (.66 - Math.abs(x) * .35), R * (.8 - Math.abs(x) * .25)); st.rotation.set(-.9, 0, -x * .6); head.add(st); }
  } else if (o.style === 'bob') {
    // short bob with a side-swept fringe
    const bob = M(new THREE.SphereGeometry(R * 1.08, 48, 24, 0, Math.PI * 2, 0, Math.PI * .64), HM); bob.rotation.x = -.85; put(bob, 0, -R * .02, -R * .08); bob.scale.set(1.04, 1, 1.02); head.add(bob);
    for (let i = 0; i < 10; i++) { const x = (i - 4.5) * .11; const st = cap(R * .065, R * .32, HM); put(st, x * R + R * .05, R * (.6 - Math.abs(x) * .3), R * (.82 - Math.abs(x) * .28)); st.rotation.set(-.75, 0, -.55 - x * .3); head.add(st); }
    [-1, 1].forEach(s => { const side = sph(R * .42, HM, 24); side.scale.set(.55, 1.05, .9); put(side, s * R * .92, -R * .15, R * .05); head.add(side); });
  } else if (o.style === 'ponytail') {
    // sleek hair pulled back into a low ponytail
    capM.scale.set(1.01, 1.02, 1.03);
    const tie = M(new THREE.TorusGeometry(R * .14, R * .05, 8, 20), HM); put(tie, 0, -R * .2, -R * .98); head.add(tie);
    const tail = cap(R * .2, R * 1.4, HM); put(tail, 0, -R * 1.0, -R * 1.02); tail.rotation.x = .1; head.add(tail); const tip = sph(R * .22, HM, 16); put(tip, 0, -R * 1.8, -R * .98); head.add(tip);
  } else if (o.style === 'short') {
    capM.scale.set(1.02, 1.06, 1.02);
    for (let i = 0; i < 9; i++) { const x = (i - 4) * .12; const st = cap(R * .07, R * .24, HM); put(st, x * R, R * (.8 - Math.abs(x) * .3), R * (.6 - Math.abs(x) * .2)); st.rotation.set(-1.2, 0, -x * .5); head.add(st); }
  } else if (o.kind === 'boy' || o.kind === 'papa') {
    const tufts = [[-.45, .78, .5, .34], [-.12, .9, .52, .36], [.22, .86, .5, .35], [.5, .7, .42, .3], [-.65, .55, .25, .3], [.66, .5, .2, .28], [0, .98, .1, .38], [-.3, .9, -.2, .36], [.3, .9, -.25, .36]];
    tufts.forEach(([x, y, z, r]) => { const tf = sph(R * r, HM, 20); tf.scale.set(1.1, .7, 1); put(tf, x * R, y * R, z * R); head.add(tf); });
  }
  if (o.stubble) { const st = sph(R * .66, plain('#2a1d14', { transparent: true, opacity: .28 }), 24); st.scale.set(1.12, .62, .72); put(st, 0, -R * .52, R * .36); head.add(st); const mu = sph(R * .2, plain('#2a1d14', { transparent: true, opacity: .45 }), 16); mu.scale.set(1.6, .35, .5); put(mu, 0, -R * .3, R * .92); head.add(mu); }
  if (o.earrings) [-1, 1].forEach(s => head.add(put(sph(R * .05, plain('#e6b800', { metalness: .9, roughness: .25 }), 12), s * R * 1.0, -R * .22, R * .05)));
  if (o.style || o.kind === 'boy' || o.kind === 'papa') {
    // hair already built above
  } else {
    const bang = sph(R * .72, HM, 32); bang.scale.set(1.25, .38, .6); put(bang, 0, R * .7, R * .55); head.add(bang);
    if (o.kind === 'girl') [-1, 1].forEach(s => { const pt = sph(R * .38, HM, 24); pt.scale.set(.9, 1.15, .9); put(pt, s * R * 1.12, R * .1, -R * .1); head.add(pt); const tie = M(new THREE.TorusGeometry(R * .14, R * .05, 8, 20), plain('#ff4f8b')); tie.rotation.y = Math.PI / 2; put(tie, s * R * .98, R * .38, -R * .06); head.add(tie); const bow = sph(R * .13, plain('#ff4f8b'), 14); bow.scale.set(1.7, .8, .8); put(bow, s * R * .9, R * .55, R * .05); head.add(bow); });
    else { const bun = sph(R * .5, HM, 28); put(bun, 0, R * 1.05, -R * .35); head.add(bun); [-1, 1].forEach(s => { const lk = cap(R * .25, R * .9, HM); put(lk, s * R * .95, -R * .3, -R * .15); head.add(lk); }); }
  }

  root.scale.setScalar(o.scale);
  const P = { root, body, hips, torso, head, legs, arms, eyes, brows, mouth, smile, open, o, R };
  P.set = s => posePerson(P, s);
  P.set({});
  return P;
}

// pose: {t, talk, walk, armL, armR, armLx, armRx, look:[x,y], mood, sleep, jump, bob, nod, turn, tilt, lean, crouch}
export function posePerson(P, s) {
  const t = s.t || 0, walk = s.walk || 0, adult = P.o.kind === 'mom' || P.o.kind === 'papa';
  const swing = walk ? Math.sin(walk) : 0;
  // legs with knee bend on the back swing
  P.legs.forEach((hip, i) => {
    const ph = i ? -swing : swing;
    hip.rotation.x = -ph * .55 - (s.crouch || 0);
    hip.userData.knee.rotation.x = Math.max(0, ph) * (walk ? .9 : 0) + (s.crouch || 0) * 1.8;
  });
  const breathe = Math.sin(t * 2.1) * .012;
  P.body.position.y = (s.bob ?? Math.abs(Math.cos(walk)) * (walk ? .035 : 0)) + (s.jump || 0) - (s.crouch || 0) * .12;
  P.torso.scale.set(1 - breathe * .5, 1 + breathe, 1 - breathe * .5);
  P.torso.rotation.set(walk ? .06 : 0, walk ? Math.sin(walk) * .08 : Math.sin(t * .7) * .03, (s.lean || 0) + Math.sin(t * .9) * .015);
  // arms: raise sideways (armL/armR), swing forward (armLx/armRx), elbows soft unless raised
  [[0, s.armL ?? .12, s.armLx], [1, s.armR ?? .12, s.armRx]].forEach(([i, up, fwd]) => {
    const sh = P.arms[i], sgn = i ? 1 : -1;
    const sw = walk ? (i ? swing : -swing) * .45 : 0;
    sh.rotation.set(-(fwd ?? 0) - sw, 0, sgn * up);
    const elb = i ? s.elbowR : s.elbowL;
    sh.userData.el.rotation.x = elb != null ? -elb : -(.25 + (up > 1.2 ? 0 : .25) + (fwd ? .2 : 0)) + Math.sin(t * 1.3 + i) * .03;
  });
  const talkNod = s.talk ? Math.sin(t * 6.5) * .05 : 0;
  P.head.rotation.set((s.nod || 0) + talkNod + Math.sin(t * 1.3) * .025, (s.turn || 0) + Math.sin(t * .8) * .06, (s.tilt || 0) + (s.talk ? Math.sin(t * 3.1) * .04 : 0));
  P.body.rotation.z = s.lean || 0;
  // eyes and lids
  const blink = s.sleep || ((t + (P.o.blinkOff || 0)) % 3.4) < .12;
  const look = s.look || [0, 0];
  const big = s.mood === 'wow' ? 1.12 : 1;
  P.eyes.forEach(e => {
    const u = e.userData;
    u.lid.rotation.x = blink ? .5 : (s.mood === 'bored' ? -.45 : s.mood === 'sad' ? -1.25 : -1.7);
    [u.iris, u.pupil].forEach((m, k) => { m.position.x = look[0] * P.R * .07; m.position.y = -P.R * .015 + look[1] * P.R * .06; });
    u.h1.visible = u.h2.visible = !blink; if (u.lash) u.lash.visible = !blink;
    e.scale.setScalar(big * (adult ? .78 : 1));
  });
  P.brows.forEach((b, i) => {
    b.position.y = b.userData.base + (s.mood === 'wow' ? P.R * .08 : s.mood === 'sad' ? -P.R * .02 : 0);
    b.rotation.z = Math.PI * .22 + (s.mood === 'sad' ? (i ? -.3 : .3) : s.mood === 'angry' ? (i ? .35 : -.35) : 0);
  });
  // mouth
  const talking = !!s.talk, wow = s.mood === 'wow' && !talking;
  P.smile.visible = !talking && !wow && !s.sleep;
  P.smile.scale.set(s.mood === 'sad' ? .8 : 1, s.mood === 'sad' ? -.6 : 1, 1);
  P.open.visible = talking || wow || s.sleep;
  const amt = talking ? .35 + Math.abs(Math.sin(t * 15)) * .65 * (.6 + .4 * Math.abs(Math.sin(t * 4.3))) : wow ? .8 : .25;
  P.open.scale.set(wow ? .65 : s.sleep ? .45 : 1, amt, 1);
}
