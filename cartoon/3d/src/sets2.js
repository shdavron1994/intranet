// More 3D sets for episodes 2–8: kitchen, living room, yard, street, park «Лимпопо», plus props.
import * as THREE from 'three';
import { mat, rbox, sphere, cyl, capsule, at, canvasTex, group } from './world.js';

const TAU = Math.PI * 2;
function plane(w, h, m) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), typeof m === 'string' ? mat(m) : m); p.receiveShadow = true; return p; }
function texMat(draw, w = 256, h = 256, rep = [1, 1], o = {}) {
  const t = canvasTex(w, h); draw(t.g, w, h); t.t.wrapS = t.t.wrapT = THREE.RepeatWrapping; t.t.repeat.set(...rep);
  return new THREE.MeshStandardMaterial(Object.assign({ map: t.t, roughness: .8 }, o));
}
const planks = (a, b) => (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(0, i * h / 16, w, h / 16 - 2); } };
const checker = (a, b, n = 8) => (g, w, h) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * w / n, y * h / n, w / n, h / n); } };
const dotsPaper = (a, b) => (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h); g.fillStyle = b; for (let y = 0; y < h; y += 64) for (let x = (y / 64 % 2) * 32; x < w; x += 64) { g.beginPath(); g.arc(x + 16, y + 16, 6, 0, 7); g.fill(); } };

/* a box room: floor, 4 walls, ceiling; returns group */
function roomShell(floorM, wallM, w = 10, d = 8) {
  const g = new THREE.Group();
  const f = plane(w, d, floorM); f.rotation.x = -Math.PI / 2; f.position.z = 1; g.add(f);
  const back = plane(w, 3.2, wallM); back.position.set(0, 1.6, -3); g.add(back);
  const fr = plane(w, 3.2, wallM); fr.rotation.y = Math.PI; fr.position.set(0, 1.6, 5); g.add(fr);
  const l = plane(d, 3.2, wallM); l.rotation.y = Math.PI / 2; l.position.set(-w / 2, 1.6, 1); g.add(l);
  const r = plane(d, 3.2, wallM); r.rotation.y = -Math.PI / 2; r.position.set(w / 2, 1.6, 1); g.add(r);
  const c = plane(w, d, '#fbfdff'); c.rotation.x = Math.PI / 2; c.position.set(0, 3.2, 1); g.add(c);
  g.add(at(rbox(w, .12, .05, '#ffffff', .02), 0, .06, -2.97));
  return g;
}
export function skyTex(night = false) {
  const t = canvasTex(512, 384), g = t.g, gr = g.createLinearGradient(0, 0, 0, 384);
  if (night) { gr.addColorStop(0, '#0b1640'); gr.addColorStop(1, '#2b3a78'); g.fillStyle = gr; g.fillRect(0, 0, 512, 384); g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(380, 90, 40, 0, 7); g.fill(); g.fillStyle = '#0b1640'; g.beginPath(); g.arc(398, 78, 36, 0, 7); g.fill(); g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { g.globalAlpha = .4 + (i % 3) * .2; g.fillRect((i * 97) % 512, (i * 53) % 260, 3, 3); } g.globalAlpha = 1; }
  else { gr.addColorStop(0, '#6fc0ff'); gr.addColorStop(1, '#d8f1ff'); g.fillStyle = gr; g.fillRect(0, 0, 512, 384); g.fillStyle = '#ffe066'; g.beginPath(); g.arc(400, 80, 36, 0, 7); g.fill(); g.fillStyle = '#fff'; [[110, 90], [260, 130]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 60, 20, 0, 0, 7); g.fill(); }); g.fillStyle = '#6fcf7a'; g.fillRect(0, 300, 512, 84); g.fillStyle = '#4caf62'; [[60, 300], [180, 290], [420, 296]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 40, 0, 7); g.fill(); }); }
  return t.t;
}
export function windowOn(g, x, y, z, ry = 0, w = 1.5, h = 1.2, night = false) {
  const wg = new THREE.Group(); wg.position.set(x, y, z); wg.rotation.y = ry;
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: skyTex(night) })); glass.position.z = .02; wg.add(glass);
  wg.add(at(rbox(w + .15, .1, .12, '#ffffff', .03), 0, h / 2, .04), at(rbox(w + .15, .1, .18, '#ffffff', .03), 0, -h / 2, .06), at(rbox(.1, h + .1, .12, '#ffffff', .03), -w / 2, 0, .04), at(rbox(.1, h + .1, .12, '#ffffff', .03), w / 2, 0, .04), at(rbox(.06, h, .1, '#ffffff', .02), 0, 0, .04));
  g.add(wg); wg.userData.glass = glass; wg.userData.day = glass.material.map; wg.userData.night = skyTex(true); return wg;
}

/* ---------- toon face drawn on a canvas (kettle, TV, mirror in the car) ---------- */
export function drawToonFace(g, w, h, s, bg = ['#e2fdff', '#8fe6f5']) {
  const t = s.t || 0, gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, bg[0]); gr.addColorStop(1, bg[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const k = Math.min(w, h) / 512, cx = w / 2, cy = h / 2, INK = '#1d4e89', blink = (t % 3.7) < .12;
  g.save(); g.translate(cx, cy); g.scale(k, k); g.fillStyle = INK; g.strokeStyle = INK; g.lineCap = 'round';
  [-76, 76].forEach(x => { g.beginPath(); g.ellipse(x, -40, 26, blink ? 3 : 35, 0, 0, TAU); g.fill(); });
  g.lineWidth = 12; g.beginPath(); g.moveTo(-106, -110); g.lineTo(-46, -120); g.stroke(); g.beginPath(); g.moveTo(46, -120); g.lineTo(106, -110); g.stroke();
  if (s.talk) { g.beginPath(); g.ellipse(0, 90, 52, 14 + Math.abs(Math.sin(t * 15)) * 40, 0, 0, TAU); g.fill(); }
  else { g.beginPath(); g.arc(0, 50, 80, .2 * Math.PI, .8 * Math.PI); g.stroke(); }
  g.fillStyle = 'rgba(255,120,160,.45)'; [-146, 146].forEach(x => { g.beginPath(); g.arc(x, 60, 26, 0, TAU); g.fill(); });
  g.restore();
}

/* ---------- kettle with Chiston's face ---------- */
export function makeKettle() {
  const root = new THREE.Group();
  const pts = [[0, 0], [.2, 0], [.26, .08], [.27, .18], [.22, .3], [.12, .36], [0, .37]].map(([r, y]) => new THREE.Vector2(r, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), mat('#e9eff5', { roughness: .25, metalness: .5 })); body.castShadow = true; root.add(body);
  root.add(at(sphere(.04, '#ff5a5f', 16), 0, .39, 0));
  const spout = at(cyl(.025, .045, .22, '#e9eff5'), .28, .2, 0); spout.rotation.z = -.9; root.add(spout);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.12, .02, 10, 24, Math.PI), mat('#2d3142')); handle.position.set(-.26, .2, 0); handle.rotation.z = Math.PI / 2; root.add(handle);
  const face = canvasTex(256, 256);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(.15, 40), new THREE.MeshStandardMaterial({ map: face.t, emissive: '#ffffff', emissiveMap: face.t, emissiveIntensity: .4, roughness: .3 }));
  disc.position.set(0, .17, .268); root.add(disc);
  const glow = new THREE.PointLight('#8fe6f5', 0, 2.2); glow.position.set(0, .2, .5); root.add(glow);
  return { root, set(s) { const on = s.on ?? 1; if (on > .02) drawToonFace(face.g, 256, 256, s); else { face.g.fillStyle = '#c9d4de'; face.g.fillRect(0, 0, 256, 256); } disc.material.emissiveIntensity = .15 + on * .5; glow.intensity = on * 1.2; face.t.needsUpdate = true; } };
}

/* ---------- flat TV; content drawn by a callback each frame ---------- */
export function makeTV(w = 1.6, h = .9) {
  const root = new THREE.Group();
  root.add(at(rbox(w + .1, h + .1, .08, '#1f2430', .03), 0, 0, 0));
  const scr = canvasTex(640, 360);
  const m = new THREE.MeshStandardMaterial({ map: scr.t, emissive: '#ffffff', emissiveMap: scr.t, emissiveIntensity: .85, roughness: .3 });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); screen.position.z = .045; root.add(screen);
  const light = new THREE.PointLight('#bfe8ff', 0, 4); light.position.set(0, 0, .8); root.add(light);
  return { root, scr, set(draw) { const g = scr.g; if (!draw) { g.fillStyle = '#10141c'; g.fillRect(0, 0, 640, 360); m.emissiveIntensity = .05; light.intensity = 0; } else { draw(g, 640, 360); m.emissiveIntensity = .85; light.intensity = 1.2; } scr.t.needsUpdate = true; } };
}

/* ---------- furniture and tableware ---------- */
export function chair(kid = false) {
  const g = new THREE.Group(), h = kid ? .62 : .48, c = '#b07446';
  g.add(at(rbox(.46, .06, .44, c, .03), 0, h, 0), at(rbox(.46, .5, .05, c, .03), 0, h + .28, -.2));
  [[-.19, -.18], [.19, -.18], [-.19, .18], [.19, .18]].forEach(([x, z]) => g.add(at(cyl(.025, .025, h, '#8a5a32', 10), x, h / 2, z)));
  if (kid) g.add(at(rbox(.42, .04, .2, c, .02), 0, .2, .24));
  g.userData.seat = h + .03; return g;
}
export function bowl(color = '#ffffff') {
  const g = new THREE.Group();
  const pts = [[0, 0], [.06, 0], [.1, .03], [.12, .07], [.115, .075]].map(([r, y]) => new THREE.Vector2(r, y));
  const b = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), mat(color, { side: THREE.DoubleSide, roughness: .3 })); b.castShadow = true; g.add(b);
  const food = at(cyl(.105, .105, .01, '#f3e2b8', 28), 0, .06, 0); g.add(food); g.userData.food = food; return g;
}
export function plate() { return at(cyl(.15, .12, .02, '#ffffff', 32), 0, .01, 0); }
export function spoon() { const g = new THREE.Group(); g.add(at(rbox(.015, .005, .14, '#c9d4de', .002), 0, 0, 0)); const s = at(sphere(.025, '#c9d4de', 12), 0, 0, .08); s.scale.y = .3; g.add(s); return g; }
export function cup(color = '#ffd23f') { return at(cyl(.045, .04, .1, color, 20), 0, .05, 0); }
export function phone() {
  // big enough to read in a wide shot: orange case, bright game on the screen
  const g = new THREE.Group(); g.add(rbox(.13, .22, .018, '#ff7a1a', .02));
  const t = canvasTex(128, 224), c = t.g; const gr = c.createLinearGradient(0, 0, 0, 224); gr.addColorStop(0, '#5fd0ff'); gr.addColorStop(1, '#7c5cff'); c.fillStyle = gr; c.fillRect(0, 0, 128, 224);
  ['#ffd23f', '#ff5a5f', '#5dff9a', '#ffffff'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(30 + (i % 2) * 64, 60 + i * 38, 16, 0, 7); c.fill(); }); c.fillStyle = '#ffffff'; c.fillRect(20, 196, 88, 10);
  const s = at(new THREE.Mesh(new THREE.PlaneGeometry(.115, .2), new THREE.MeshStandardMaterial({ map: t.t, emissive: '#ffffff', emissiveMap: t.t, emissiveIntensity: .9 })), 0, 0, .0101); g.add(s); g.userData.screen = s; return g;
}
export function ball(a = '#ff5a5f', b = '#ffffff') { return new THREE.Mesh(new THREE.SphereGeometry(.13, 24, 18), texMat((g, w, h) => { for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * w / 6, 0, w / 6, h); } }, 256, 128, [1, 1], { roughness: .4 })); }
export function block(color) { return rbox(.12, .12, .12, color, .02); }
export function coin() { const c = cyl(.05, .05, .012, mat('#ffd23f', { metalness: .7, roughness: .25 }), 24); c.rotation.x = Math.PI / 2; return c; }
export function duck() { const g = new THREE.Group(); const b = sphere(.09, '#ffd23f', 20); b.scale.set(1.3, .8, 1); g.add(b, at(sphere(.06, '#ffd23f', 16), .08, .08, 0), at(sphere(.012, '#1b2a41', 8), .12, .1, .04)); const bk = at(new THREE.Mesh(new THREE.ConeGeometry(.025, .06, 10), mat('#ff9f1c')), .15, .08, 0); bk.rotation.z = -Math.PI / 2; g.add(bk); return g; }
export function iceCream(c = '#ffb3c1') { const g = new THREE.Group(); const cone = at(new THREE.Mesh(new THREE.ConeGeometry(.04, .13, 16), mat('#d9a05b')), 0, -.065, 0); cone.rotation.x = Math.PI; g.add(cone, at(sphere(.048, c, 16), 0, .02, 0)); return g; }

export function piggyBank() {
  const g = new THREE.Group(), pink = mat('#ff9fbd', { roughness: .35 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(.2, 32, 24), pink); b.scale.set(1.25, 1, 1); b.position.y = .24; b.castShadow = true; g.add(b);
  const sn = at(cyl(.07, .07, .06, '#ff7aa2', 20), .25, .25, 0); sn.rotation.z = Math.PI / 2; g.add(sn);
  [-.03, .03].forEach(z => g.add(at(sphere(.012, '#b03060', 8), .285, .25, z)));
  [-.08, .08].forEach(z => { g.add(at(sphere(.022, '#1b2a41', 10), .19, .33, z)); const e = at(new THREE.Mesh(new THREE.ConeGeometry(.05, .08, 12), pink), .1, .42, z * 1.4); g.add(e); });
  [[-.12, -.1], [-.12, .1], [.12, -.1], [.12, .1]].forEach(([x, z]) => g.add(at(cyl(.035, .035, .1, '#ff7aa2', 12), x, .05, z)));
  g.add(at(rbox(.12, .01, .02, '#7a2b4a', .004), 0, .44, 0));
  return g;
}

export function starChart() {
  const t = canvasTex(256, 320);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(.42, .52), new THREE.MeshStandardMaterial({ map: t.t, roughness: .8 }));
  m.userData.set = (n, pop = 1) => { const g = t.g; g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 320); g.fillStyle = '#0e3a46'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.fillText('Звёздочки', 128, 42);
    for (let i = 0; i < 7; i++) { const x = 52 + (i % 3) * 76, y = 100 + Math.floor(i / 3) * 80, k = i < n ? (i === n - 1 ? pop : 1) : 0; g.save(); g.translate(x, y); g.beginPath(); for (let j = 0; j < 10; j++) { const r = (j % 2 ? 13 : 30) * (k ? .4 + .6 * k : 1), a = -Math.PI / 2 + j * Math.PI / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); if (k) { g.fillStyle = '#ffc61a'; g.fill(); } else { g.strokeStyle = '#c9d4de'; g.lineWidth = 4; g.stroke(); } g.restore(); }
    t.t.needsUpdate = true; };
  m.userData.set(0); return m;
}

/* ---------- kitchen: table in the middle, counter + stove at the back, fridge right ---------- */
export function makeKitchen() {
  const g = roomShell(texMat(checker('#f4efe6', '#e2d6c3', 8), 256, 256, [5, 4], { roughness: .5 }), texMat(dotsPaper('#fff1d6', '#ffe3ad'), 256, 256, [5, 2], { roughness: .9 }));
  const win = windowOn(g, -1.6, 1.85, -2.98);
  // counter along the back wall, stove and pot, hanging cabinets
  g.add(at(rbox(3.2, .9, .6, '#7cc6b8', .04), 2.2, .45, -2.68), at(rbox(3.3, .06, .66, '#f4f7fa', .02), 2.2, .92, -2.66));
  g.add(at(rbox(.7, .02, .5, '#2d3142', .01), 2.9, .955, -2.66));
  [[2.75, -2.55], [3.05, -2.8]].forEach(([x, z]) => g.add(at(cyl(.1, .1, .01, '#555', 20), x, .97, z)));
  const pot = at(cyl(.17, .15, .2, '#ff7a59', 28), 2.75, 1.07, -2.55); g.add(pot, at(cyl(.18, .18, .02, '#ff9a7f', 28), 2.75, 1.18, -2.55));
  g.add(at(rbox(3.2, .7, .35, '#9ad6c9', .04), 2.2, 2.35, -2.8));
  // fridge in the corner with the star chart
  g.add(at(rbox(.85, 2, .75, '#f4f7fa', .08), 4.3, 1, -2.5), at(rbox(.04, .5, .04, '#c9d4de', .01), 3.92, 1.35, -2.1));
  const chart = starChart(); chart.position.set(4.3, 1.35, -2.115); g.add(chart);
  // table and chairs: two kids' chairs behind the table facing +z, grown-ups at the ends
  g.add(at(rbox(1.9, .06, 1.0, '#d39b62', .03), 0, .74, -.7));
  [[-.85, -1.1], [.85, -1.1], [-.85, -.3], [.85, -.3]].forEach(([x, z]) => g.add(at(cyl(.035, .035, .74, '#a86a3a', 12), x, .37, z)));
  g.add(at(rbox(1.7, .01, .8, '#ffffff', .005), 0, .775, -.7));
  const seats = {};
  [['D', -.42, -1.45, 0, true], ['T', .42, -1.45, 0, true], ['M', 1.25, -.7, -Math.PI / 2, false], ['P', -1.25, -.7, Math.PI / 2, false]].forEach(([k, x, z, ry, kid]) => { const c = chair(kid); c.position.set(x, 0, z); c.rotation.y = ry; g.add(c); seats[k] = { x, z, ry, y: c.userData.seat, chair: c }; });
  // kitchen sink with a tap on the counter
  g.add(at(rbox(.55, .03, .4, '#9fb0bf', .02), 1.75, .94, -2.62), at(rbox(.48, .02, .33, '#7f93a6', .01), 1.75, .93, -2.62));
  g.add(at(cyl(.025, .03, .2, '#c9d4de', 12), 1.75, 1.04, -2.86), at(rbox(.04, .035, .16, '#c9d4de', .015), 1.75, 1.13, -2.79));
  const water = at(cyl(.014, .014, .17, mat('#8fd3ff', { transparent: true, opacity: .7 }), 10), 1.75, 1.04, -2.72); water.visible = false; g.add(water);
  g.add(at(rbox(.5, .24, .32, '#3b8beb', .04), 1.75, .12, -2.1)); // step stool at the sink
  const kettle = makeKettle(); kettle.root.position.set(.85, .95, -2.6); kettle.root.rotation.y = -.25; g.add(kettle.root);
  const tv = makeTV(1.2, .68); tv.root.position.set(-4.95, 1.75, -.9); tv.root.rotation.y = Math.PI / 2; g.add(tv.root);
  const lamp = new THREE.PointLight('#fff1d6', 0, 9); lamp.position.set(0, 2.9, -.5); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); g.add(lamp);
  g.add(at(cyl(.3, .3, .06, '#ffe8a3', 24), 0, 3.15, -.7));
  return { group: g, win, kettle, tv, chart, seats, lamp, pot, water };
}

/* ---------- living room: TV on the back wall, sofa facing it, window behind the sofa, door on the right ---------- */
export function makeLiving() {
  const g = roomShell(texMat(planks('#d8a873', '#cf9d66'), 512, 512, [3, 3], { roughness: .7 }), texMat(dotsPaper('#e3f4e8', '#cfeedd'), 256, 256, [5, 2], { roughness: .9 }));
  const tv = makeTV(1.7, .96); tv.root.position.set(0, 1.45, -2.93); g.add(tv.root);
  g.add(at(rbox(2.4, .5, .45, '#8a5a32', .05), 0, .25, -2.72));
  // sofa at z = 1.4 facing the TV (-z)
  const sofa = new THREE.Group(); sofa.position.set(0, 0, 1.4); sofa.rotation.y = Math.PI;
  sofa.add(at(rbox(2.4, .42, .9, '#4fb3a9', .1), 0, .21, 0), at(rbox(2.4, .7, .25, '#3f9a91', .1), 0, .6, -.36), at(rbox(.25, .6, .9, '#3f9a91', .1), -1.2, .35, 0), at(rbox(.25, .6, .9, '#3f9a91', .1), 1.2, .35, 0));
  [-.55, .55].forEach(x => sofa.add(at(rbox(1, .14, .7, '#5cc4b9', .06), x, .48, .05)));
  g.add(sofa);
  const win = windowOn(g, 0, 1.85, 4.98, Math.PI, 2, 1.3);
  // rug, plant, shelf, toy box, door
  const rug = at(cyl(1.5, 1.5, .02, '#ffd6a5', 48), 0, .01, -.4); rug.scale.z = .6; g.add(rug);
  g.add(at(cyl(.18, .14, .35, '#d9734e', 16), -3.6, .17, -2.5), at(sphere(.35, '#4caf62', 18), -3.6, .62, -2.5));
  g.add(at(rbox(1.2, .08, .3, '#a86a3a', .02), 2.6, 1.6, -2.85), at(rbox(.18, .26, .2, '#ff5a5f', .02), 2.2, 1.77, -2.85), at(rbox(.18, .3, .2, '#3b8beb', .02), 2.45, 1.79, -2.85), at(rbox(.18, .22, .2, '#ffd23f', .02), 2.7, 1.75, -2.85));
  const toyBox = at(rbox(.8, .45, .5, '#3b8beb', .06), -3.2, .23, -.4); g.add(toyBox);
  const door = new THREE.Group(); door.position.set(4.95, 0, 2.6); door.rotation.y = -Math.PI / 2;
  const leaf = at(rbox(1, 2.2, .08, '#c98b55', .03), -.5, 1.1, 0); door.add(leaf, at(sphere(.05, '#ffd23f', 12), -.88, 1.05, .07)); g.add(door, at(rbox(.04, 2.3, 1.15, '#3b2a1e', .02), 4.99, 1.15, 2.1));
  g.add(at(rbox(.9, .3, .4, '#a86a3a', .03), 4.5, .15, .9));
  const pots = [-.5, 0, .5].map((x, i) => { const p = new THREE.Group(); p.position.set(x, 1.27, 4.85); p.add(at(cyl(.1, .08, .16, '#d9734e', 14), 0, .08, 0), at(cyl(.008, .008, .25, '#3c9a4f', 6), 0, .28, 0)); const head = new THREE.Group(); head.position.y = .4; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU, pet = at(sphere(.045, ['#ff7aa2', '#ffd23f', '#b197fc'][i], 10), Math.cos(a) * .06, Math.sin(a) * .06, 0); pet.scale.set(1, .6, .4); head.add(pet); } head.add(at(sphere(.035, '#ffb703', 10), 0, 0, .01)); p.add(head); p.userData.head = head; g.add(p); return p; });
  const lamp = new THREE.PointLight('#fff1d6', 0, 10); lamp.position.set(0, 2.9, .5); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); g.add(lamp);
  return { group: g, tv, sofa, win, door, toyBox, pots, lamp };
}

/* ---------- outdoors helpers ---------- */
export function tree(s = 1, c = '#4caf62') { const g = new THREE.Group(); g.add(at(cyl(.08 * s, .12 * s, 1.2 * s, '#8a5a32', 10), 0, .6 * s, 0)); [[0, 1.5, 0, .6], [.35, 1.3, .1, .45], [-.35, 1.3, -.1, .45], [0, 1.9, 0, .4]].forEach(([x, y, z, r]) => g.add(at(sphere(r * s, c, 16), x * s, y * s, z * s))); return g; }
export function palm(s = 1) { const g = new THREE.Group(); for (let i = 0; i < 6; i++) { const seg = at(cyl(.07 * s, .09 * s, .32 * s, '#a0743c', 10), Math.sin(i * .4) * .05 * s, (.16 + i * .3) * s, 0); g.add(seg); } for (let k = 0; k < 7; k++) { const leaf = at(rbox(.9 * s, .02, .18 * s, '#3c9a4f', .02), 0, 1.9 * s, 0); leaf.geometry.translate(.45 * s, 0, 0); leaf.rotation.set(0, k / 7 * TAU, -.4); g.add(leaf); } return g; }
function grass(w, d) { const f = plane(w, d, texMat((g, W, H) => { g.fillStyle = '#7fcf6a'; g.fillRect(0, 0, W, H); for (let i = 0; i < 500; i++) { g.fillStyle = i % 2 ? '#74c45f' : '#8bd877'; g.fillRect((i * 53) % W, (i * 97) % H, 3, 7); } }, 256, 256, [w / 3, d / 3], { roughness: .95 })); f.rotation.x = -Math.PI / 2; return f; }
function building(w, h, d, c) {
  const m = texMat((g, W, H) => { g.fillStyle = c; g.fillRect(0, 0, W, H); for (let y = 16; y < H; y += 64) for (let x = 16; x < W; x += 64) { g.fillStyle = '#bfe3ff'; g.fillRect(x, y, 34, 40); g.fillStyle = '#ffffff'; g.fillRect(x + 15, y, 4, 40); } }, 256, 256, [w / 2, h / 2]);
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.y = h / 2; b.receiveShadow = true; return b;
}

/* ---------- yard: playground in front of the apartment block ---------- */
export function makeYard() {
  const g = new THREE.Group();
  g.add(grass(40, 30));
  const bld = building(16, 9, 2, '#f2d0a9'); bld.position.z = -9; g.add(bld);
  [[-7, -5], [7, -5.5], [-9, 2], [9, 1], [-4, -7], [5, -7]].forEach(([x, z], i) => { const t = tree(1 + (i % 3) * .2); t.position.set(x, 0, z); g.add(t); });
  // swing
  const swing = new THREE.Group(); swing.position.set(-2.5, 0, -1.5);
  [[-0.9, -.4], [-0.9, .4], [.9, -.4], [.9, .4]].forEach(([x, z]) => { const p = at(cyl(.04, .04, 2.3, '#3b8beb', 10), x, 1.1, z * .5); p.rotation.x = z > 0 ? -.2 : .2; swing.add(p); });
  swing.add(at(cyl(.05, .05, 1.9, '#3b8beb', 10), 0, 2.2, 0)); swing.children[swing.children.length - 1].rotation.z = Math.PI / 2;
  const seatPivot = at(new THREE.Group(), 0, 2.2, 0); swing.add(seatPivot);
  seatPivot.add(at(cyl(.01, .01, 1.7, '#555', 6), -.22, -.85, 0), at(cyl(.01, .01, 1.7, '#555', 6), .22, -.85, 0), at(rbox(.55, .05, .25, '#ff5a5f', .02), 0, -1.7, 0));
  g.add(swing);
  // slide
  const slide = new THREE.Group(); slide.position.set(2.8, 0, -2.2);
  slide.add(at(rbox(.8, .06, .8, '#ffd23f', .02), 0, 1.4, 0)); [[-.35, -.35], [.35, -.35], [-.35, .35], [.35, .35]].forEach(([x, z]) => slide.add(at(cyl(.035, .035, 1.4, '#ff5a5f', 8), x, .7, z)));
  const ramp = at(rbox(.7, .05, 2, '#ff9f1c', .02), 0, .72, 1.25); ramp.rotation.x = .78; slide.add(ramp);
  for (let i = 0; i < 5; i++) slide.add(at(rbox(.6, .04, .08, '#3b8beb', .01), 0, .25 + i * .26, -.6 - i * .02));
  g.add(slide);
  const sand = at(rbox(1.6, .2, 1.6, '#c98b55', .04), -.2, .1, -4); g.add(sand, at(rbox(1.4, .05, 1.4, '#f4d58d', .02), -.2, .19, -4));
  const bench = new THREE.Group(); bench.position.set(-5, 0, .5); bench.add(at(rbox(1.4, .06, .4, '#a86a3a', .02), 0, .45, 0), at(rbox(1.4, .3, .05, '#a86a3a', .02), 0, .7, -.18), at(cyl(.03, .03, .45, '#555', 8), -.6, .22, 0), at(cyl(.03, .03, .45, '#555', 8), .6, .22, 0)); g.add(bench);
  return { group: g, swing: seatPivot, slide, bld };
}

/* ---------- street with a car ---------- */
export function makeCar(color = '#3b8beb') {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  body.add(at(rbox(2.2, .5, 1.1, color, .15), 0, .5, 0), at(rbox(1.3, .45, 1.0, color, .15), -.15, .95, 0));
  const glass = mat('#bfe8ff', { roughness: .1, metalness: .3 });
  body.add(at(rbox(1.2, .34, 1.02, glass, .1), -.15, .97, 0));
  body.add(at(rbox(.1, .12, .3, '#fff6c8', .03), 1.08, .55, .35), at(rbox(.1, .12, .3, '#fff6c8', .03), 1.08, .55, -.35));
  const wheels = [[.7, .55], [-.7, .55], [.7, -.55], [-.7, -.55]].map(([x, z]) => { const w = at(cyl(.22, .22, .16, '#2d3142', 20), x, .22, z); w.rotation.x = Math.PI / 2; root.add(w); return w; });
  const mirror = new THREE.Group(); mirror.position.set(.48, 1.08, 0); mirror.rotation.y = Math.PI / 2; body.add(mirror);
  mirror.add(at(rbox(.36, .14, .04, '#2d3142', .03), 0, 0, 0));
  const face = canvasTex(360, 140), fm = new THREE.MeshStandardMaterial({ map: face.t, emissive: '#ffffff', emissiveMap: face.t, emissiveIntensity: .5 });
  const fp = at(new THREE.Mesh(new THREE.PlaneGeometry(.32, .11), fm), 0, 0, .025); mirror.add(fp);
  return { root, body, wheels, mirror, set(s) { const t = s.t || 0; wheels.forEach(w => w.rotation.y = -(s.dist || 0) / .22); body.position.y = s.moving ? Math.abs(Math.sin(t * 9)) * .015 : 0; drawToonFace(face.g, 360, 140, { t, talk: s.talk }); face.t.needsUpdate = true; } };
}
export function makeStreet() {
  const g = new THREE.Group();
  g.add(grass(80, 30));
  const road = plane(80, 4, texMat((c, W, H) => { c.fillStyle = '#5b6170'; c.fillRect(0, 0, W, H); c.fillStyle = '#ffffff'; for (let x = 0; x < W; x += 64) c.fillRect(x, H / 2 - 3, 36, 6); }, 512, 64, [10, 1], { roughness: .9 })); road.rotation.x = -Math.PI / 2; road.position.y = .01; g.add(road);
  const walk = plane(80, 1.6, '#d9d4cc'); walk.rotation.x = -Math.PI / 2; walk.position.set(0, .02, -2.8); g.add(walk);
  ['#f2d0a9', '#bde0fe', '#ffc8dd', '#cdeac0', '#ffe5a5'].forEach((c, i) => { for (let k = 0; k < 3; k++) { const b = building(5, 5 + ((i + k) % 3) * 2, 3, c); b.position.set(-30 + i * 6 + k * 30, 0, -6); g.add(b); } });
  for (let x = -36; x < 40; x += 7) { const t = tree(.9); t.position.set(x, 0, -3.8); g.add(t); }
  const kg = new THREE.Group(); kg.position.set(26, 0, -5); kg.add(at(rbox(6, 3, 3, '#fff3b0', .1), 0, 1.5, 0), at(rbox(2.6, .5, .1, '#ff7aa2', .05), 0, 2.6, 1.55));
  const sign = canvasTex(512, 96); sign.g.fillStyle = '#ff7aa2'; sign.g.fillRect(0, 0, 512, 96); sign.g.fillStyle = '#fff'; sign.g.font = 'bold 60px sans-serif'; sign.g.textAlign = 'center'; sign.g.fillText('ДЕТСКИЙ САД', 256, 70);
  kg.add(at(new THREE.Mesh(new THREE.PlaneGeometry(2.5, .45), new THREE.MeshBasicMaterial({ map: sign.t })), 0, 2.6, 1.61)); g.add(kg);
  return { group: g };
}

/* ---------- park «Лимпопо» ---------- */
function spotted(base, spot) { return texMat((g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); g.fillStyle = spot; for (let i = 0; i < 40; i++) { g.beginPath(); g.ellipse((i * 67) % W, (i * 41) % H, 12 + i % 3 * 4, 10, i, 0, 7); g.fill(); } }, 256, 256, [2, 2]); }
export function giraffe() {
  const g = new THREE.Group(), m = spotted('#f4c06a', '#a8652a');
  const body = new THREE.Mesh(new THREE.SphereGeometry(.5, 24, 18), m); body.scale.set(1.4, .8, .7); body.position.y = 1.5; body.castShadow = true; g.add(body);
  [[-.45, -.2], [-.45, .2], [.45, -.2], [.45, .2]].forEach(([x, z]) => g.add(at(cyl(.07, .06, 1.2, m, 10), x, .6, z)));
  const neck = new THREE.Group(); neck.position.set(.45, 1.65, 0); neck.rotation.z = -.3; g.add(neck);
  neck.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.1, .16, 1.5, 14), m), 0, .75, 0));
  const head = at(new THREE.Group(), 0, 1.55, 0); neck.add(head);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(.2, 20, 14), m); hd.scale.set(1.5, .9, .9); hd.position.x = .1; head.add(hd);
  [-.1, .1].forEach(z => { head.add(at(sphere(.04, '#ffffff', 10), .1, .1, z * 1.4), at(sphere(.022, '#1b2a41', 8), .13, .1, z * 1.55), at(cyl(.02, .02, .2, '#a8652a', 6), -.05, .25, z), at(sphere(.035, '#6b3e1a', 8), -.05, .36, z)); });
  g.userData.neck = neck; return g;
}
export function elephant() {
  const g = new THREE.Group(), gr = mat('#9aa3b5', { roughness: .8 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(.7, 28, 20), gr); b.scale.set(1.3, 1, 1); b.position.y = 1.1; b.castShadow = true; g.add(b);
  [[-.5, -.35], [-.5, .35], [.5, -.35], [.5, .35]].forEach(([x, z]) => g.add(at(cyl(.2, .22, .8, gr, 14), x, .4, z)));
  const head = at(new THREE.Group(), .9, 1.35, 0); g.add(head); head.add(new THREE.Mesh(new THREE.SphereGeometry(.45, 24, 18), gr));
  [-1, 1].forEach(s => { const ear = at(new THREE.Mesh(new THREE.SphereGeometry(.4, 20, 14), mat('#b3bccd')), -.15, .05, s * .45); ear.scale.set(.6, 1, .15); head.add(ear); head.add(at(sphere(.06, '#ffffff', 10), .32, .15, s * .18), at(sphere(.035, '#1b2a41', 8), .37, .15, s * .19)); });
  const pts = []; for (let i = 0; i <= 10; i++) { const k = i / 10; pts.push(new THREE.Vector3(.35 + k * .3, -.1 - k * .7, 0)); }
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, .1, 10), gr); head.add(trunk); g.userData.trunk = trunk; g.userData.head = head;
  return g;
}
export function hippo() {
  const g = new THREE.Group(), m = mat('#a78bba', { roughness: .7 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(.6, 24, 18), m); b.scale.set(1.4, .85, .9); b.position.y = .7; b.castShadow = true; g.add(b);
  [[-.5, -.3], [-.5, .3], [.5, -.3], [.5, .3]].forEach(([x, z]) => g.add(at(cyl(.15, .16, .4, m, 12), x, .2, z)));
  const head = at(new THREE.Group(), .85, .85, 0); g.add(head);
  const h = new THREE.Mesh(new THREE.SphereGeometry(.38, 20, 14), m); h.scale.set(1.3, .9, 1); head.add(h);
  const jaw = at(new THREE.Group(), .15, -.12, 0); head.add(jaw); const j = new THREE.Mesh(new THREE.SphereGeometry(.3, 20, 14), mat('#c3a6d6')); j.scale.set(1.2, .5, 1); jaw.add(j);
  [-1, 1].forEach(s => head.add(at(sphere(.07, '#ffffff', 10), .05, .32, s * .17), at(sphere(.04, '#1b2a41', 8), .1, .33, s * .18), at(sphere(.07, m, 10), -.15, .37, s * .25)));
  g.userData.jaw = jaw; return g;
}
export function carousel() {
  const g = new THREE.Group();
  g.add(at(cyl(2, 2.1, .25, '#ffd23f', 40), 0, .12, 0), at(cyl(.12, .12, 3, '#ff5a5f', 12), 0, 1.5, 0));
  const top = new THREE.Mesh(new THREE.ConeGeometry(2.3, 1, 16), texMat((c, W, H) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ff5a5f' : '#ffffff'; c.fillRect(i * W / 16, 0, W / 16, H); } }, 256, 64)); top.position.y = 3.3; top.castShadow = true; g.add(top);
  const spin = new THREE.Group(); g.add(spin);
  const seats = ['#7c5cff', '#4cc3ff', '#5dff9a', '#ff9fbd', '#ff9f1c', '#ffd23f'].map((c, i) => { const a = i / 6 * TAU, p = new THREE.Group(); p.position.set(Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5); p.add(at(cyl(.03, .03, 2.8, '#e9eff5', 8), 0, 1.6, 0)); const horse = at(new THREE.Group(), 0, .9, 0); const hb = rbox(.5, .25, .2, c, .1); horse.add(hb, at(rbox(.15, .3, .15, c, .06), .25, .2, 0)); p.add(horse); p.rotation.y = -a; p.userData.horse = horse; spin.add(p); return p; });
  g.userData.spin = spin; g.userData.seats = seats; return g;
}
export function makePark() {
  const g = new THREE.Group();
  g.add(grass(60, 40));
  const path = plane(3, 40, '#f4d58d'); path.rotation.x = -Math.PI / 2; path.position.set(0, .01, 0); g.add(path);
  // entrance arch with the sign
  const arch = new THREE.Group(); arch.position.set(0, 0, 6);
  arch.add(at(cyl(.18, .2, 3.4, '#ff9f1c', 14), -1.8, 1.7, 0), at(cyl(.18, .2, 3.4, '#ff9f1c', 14), 1.8, 1.7, 0), at(rbox(4.4, .8, .3, '#2fb5a0', .1), 0, 3.5, 0));
  const sign = canvasTex(1024, 192); sign.g.fillStyle = '#2fb5a0'; sign.g.fillRect(0, 0, 1024, 192); sign.g.fillStyle = '#ffd23f'; sign.g.font = 'bold 120px sans-serif'; sign.g.textAlign = 'center'; sign.g.fillText('ЛИМПОПО', 512, 140);
  arch.add(at(new THREE.Mesh(new THREE.PlaneGeometry(4.2, .72), new THREE.MeshBasicMaterial({ map: sign.t })), 0, 3.5, .16));
  const signB = at(new THREE.Mesh(new THREE.PlaneGeometry(4.2, .72), new THREE.MeshBasicMaterial({ map: sign.t })), 0, 3.5, -.16); signB.rotation.y = Math.PI; arch.add(signB);
  g.add(arch);
  [[-6, -6], [6, -8], [-9, 3], [9, 2], [-4, -12], [5, -14], [-12, -6], [12, -5]].forEach(([x, z], i) => { const p = i % 2 ? palm(1.3) : tree(1.2, '#3c9a4f'); p.position.set(x, 0, z); g.add(p); });
  // animal enclosure with a low fence on the left
  for (let i = 0; i < 12; i++) g.add(at(cyl(.05, .05, .7, '#a86a3a', 8), -2.2, .35, -9 + i * .8));
  g.add(at(rbox(.06, .06, 9, '#a86a3a', .02), -2.2, .6, -4.6), at(rbox(.06, .06, 9, '#a86a3a', .02), -2.2, .3, -4.6));
  const gir = giraffe(); gir.position.set(-5, 0, -6); gir.rotation.y = .4; g.add(gir);
  const ele = elephant(); ele.position.set(-6, 0, -1.5); ele.rotation.y = -.3; g.add(ele);
  const hip = hippo(); hip.position.set(-4, 0, -9); hip.rotation.y = .6; g.add(hip);
  const pond = at(cyl(1.6, 1.6, .03, mat('#6ec6ff', { roughness: .1 }), 32), -5, .02, -10); pond.scale.z = .6; g.add(pond);
  const car = carousel(); car.position.set(5, 0, -5); g.add(car);
  // ice-cream cart and a bench
  const cart = new THREE.Group(); cart.position.set(2.6, 0, 1.2); cart.rotation.y = -.5;
  cart.add(at(rbox(1, .8, .6, '#ffffff', .06), 0, .6, 0), at(rbox(1.02, .2, .62, '#ff9fbd', .04), 0, .9, 0), at(cyl(.02, .02, 1.4, '#555', 6), 0, 1.6, 0), at(new THREE.Mesh(new THREE.ConeGeometry(.9, .4, 12), mat('#ff7aa2')), 0, 2.3, 0));
  [[-.35, .3], [.35, .3]].forEach(([x, z]) => { const w = at(cyl(.2, .2, .06, '#2d3142', 16), x, .2, z); w.rotation.x = Math.PI / 2; cart.add(w); });
  g.add(cart);
  const bench = new THREE.Group(); bench.position.set(-.5, 0, -1.5); bench.rotation.y = Math.PI / 2; bench.add(at(rbox(1.6, .06, .45, '#a86a3a', .02), 0, .45, 0), at(rbox(1.6, .35, .05, '#a86a3a', .02), 0, .72, -.2), at(cyl(.03, .03, .45, '#555', 8), -.7, .22, 0), at(cyl(.03, .03, .45, '#555', 8), .7, .22, 0)); g.add(bench);
  const balloons = new THREE.Group(); balloons.position.set(2.2, 0, 1.4); ['#ff5a5f', '#ffd23f', '#4cc3ff', '#5dff9a'].forEach((c, i) => { balloons.add(at(sphere(.16, mat(c, { roughness: .2 }), 16), (i - 1.5) * .2, 2.2 + (i % 2) * .2, 0), at(cyl(.004, .004, 1.2, '#555', 4), (i - 1.5) * .1, 1.6, 0)); }); g.add(balloons);
  return { group: g, giraffe: gir, elephant: ele, hippo: hip, carousel: car, arch, cart };
}

/* ---------- bathtub (added to the bathroom on the left) ---------- */
export function bathtub() {
  const g = new THREE.Group();
  g.add(at(rbox(1.8, .6, .9, '#ffffff', .2), 0, .3, 0));
  const water = at(rbox(1.6, .02, .72, mat('#8fd3ff', { transparent: true, opacity: .8, roughness: .1 }), .01), 0, .55, 0); g.add(water);
  const foamG = new THREE.Group(); for (let i = 0; i < 30; i++) foamG.add(at(sphere(.05 + (i % 4) * .02, mat('#ffffff', { roughness: .3 }), 10), ((i * 37) % 150) / 100 - .75, .57, ((i * 53) % 60) / 100 - .3)); g.add(foamG);
  g.add(at(cyl(.03, .03, .25, '#b7c6d3', 10), -.8, .75, -.38));
  return { root: g, water, foam: foamG };
}
