// 3D world for «Чистон»: renderer, materials, characters, props and camera moves.
import * as THREE from 'three';
import { RoundedBoxGeometry } from './jsm/RoundedBoxGeometry.js';

export const W = 1280, H = 720;
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const lerp = (a, b, k) => a + (b - a) * k;
export const SKIN = '#f1c09a', HAIR = '#3b2418', MOMHAIR = '#5a3420';

/* ---------- renderer ---------- */
export function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false);
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  return r;
}

/* ---------- materials and primitives ---------- */
const matCache = {};
export function mat(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .62, metalness: 0 }, o));
  return matCache[key];
}
function mesh(geo, m, cast = true, recv = true) { const x = new THREE.Mesh(geo, typeof m === 'string' ? mat(m) : m); x.castShadow = cast; x.receiveShadow = recv; return x; }
export const sphere = (r, c, ws = 32) => mesh(new THREE.SphereGeometry(r, ws, Math.round(ws * .7)), c);
export const rbox = (w, h, d, c, rad = .05) => mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(rad, w / 2, h / 2, d / 2)), c);
export const capsule = (r, len, c) => mesh(new THREE.CapsuleGeometry(r, len, 8, 20), c);
export const cyl = (rt, rb, h, c, s = 32) => mesh(new THREE.CylinderGeometry(rt, rb, h, s), c);
export function at(o, x, y, z) { o.position.set(x, y, z); return o; }
export function group(...kids) { const g = new THREE.Group(); kids.forEach(k => g.add(k)); return g; }

/* canvas textures for screens and faces that change every frame */
export function canvasTex(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return { c, g: c.getContext('2d'), t };
}

/* ---------- characters live in person.js ---------- */
export { makePerson, posePerson } from './person.js';

/* ---------- Chiston: magic mirror with an animated face ---------- */
export function makeChiston() {
  const root = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.TorusGeometry(.5, .07, 20, 60), mat('#e9eff5', { roughness: .3, metalness: .4 })); frame.scale.set(1, 1.18, 1); frame.castShadow = true; root.add(frame);
  const face = canvasTex(512, 600);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(.5, 64), new THREE.MeshStandardMaterial({ map: face.t, emissive: '#8fe6f5', emissiveIntensity: .2, emissiveMap: face.t, roughness: .15 }));
  glass.scale.set(1, 1.18, 1); glass.position.z = .01; root.add(glass);
  const led = at(sphere(.035, mat('#5dff9a', { emissive: '#5dff9a', emissiveIntensity: 1 })), 0, .66, .03); root.add(led);
  const glow = new THREE.PointLight('#8fe6f5', 0, 3); glow.position.set(0, 0, .5); root.add(glow);
  return { root, face, glass, glow, set(s) { drawMirrorFace(face, s); glass.material.emissiveIntensity = .15 + (s.on ?? 1) * .6; glow.intensity = (s.on ?? 1) * 1.6; face.t.needsUpdate = true; } };
}
function drawMirrorFace(f, s) {
  const g = f.g, w = f.c.width, h = f.c.height, on = s.on ?? 1, t = s.t || 0;
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#e2fdff'); gr.addColorStop(1, '#8fe6f5');
  g.fillStyle = on > .01 ? gr : '#6d9fb3'; g.fillRect(0, 0, w, h);
  g.globalAlpha = .35; g.fillStyle = '#fff'; g.save(); g.translate(150, 150); g.rotate(-.6); g.fillRect(-90, -8, 180, 16); g.restore(); g.globalAlpha = 1;
  if (on <= .01) return;
  g.globalAlpha = on;
  const INK = '#1d4e89', blink = (t % 3.7) < .12, eh = blink ? 6 : 70;
  g.fillStyle = INK;
  [[180, 240], [332, 240]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 26, eh / 2, 0, 0, Math.PI * 2); g.fill(); });
  g.lineWidth = 12; g.lineCap = 'round'; g.strokeStyle = INK;
  g.beginPath(); g.moveTo(150, 170); g.lineTo(210, 160); g.stroke(); g.beginPath(); g.moveTo(302, 160); g.lineTo(362, 170); g.stroke();
  if (s.talk) { g.beginPath(); g.ellipse(256, 390, 52, 14 + Math.abs(Math.sin(t * 15)) * 40, 0, 0, Math.PI * 2); g.fill(); }
  else { g.beginPath(); g.arc(256, 340, 80, .2 * Math.PI, .8 * Math.PI); g.stroke(); }
  g.fillStyle = 'rgba(255,120,160,.45)'; [[110, 350], [402, 350]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 26, 0, Math.PI * 2); g.fill(); });
  g.globalAlpha = 1;
}

/* ---------- Pixel: the tablet character ---------- */
export function makeTablet() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const shell = at(rbox(.42, .6, .06, '#2d3142', .05), 0, .44, 0); body.add(shell);
  const scr = canvasTex(256, 360);
  const screen = at(new THREE.Mesh(new THREE.PlaneGeometry(.36, .5), new THREE.MeshStandardMaterial({ map: scr.t, emissive: '#ffffff', emissiveMap: scr.t, emissiveIntensity: .7 })), 0, .45, .032); body.add(screen);
  const legs = [-1, 1].map(s => { const p = at(new THREE.Group(), s * .1, .15, 0); p.add(at(capsule(.025, .1, '#2d3142'), 0, -.07, 0), at(rbox(.08, .04, .11, '#ff5a5f', .02), 0, -.14, .02)); body.add(p); return p; });
  const arms = [-1, 1].map(s => { const p = at(new THREE.Group(), s * .22, .45, 0); p.add(at(capsule(.022, .16, '#2d3142'), 0, -.1, 0)); body.add(p); return p; });
  return { root, body, legs, arms, scr, set(s) {
    const t = s.t || 0, w = s.walk || 0;
    legs[0].rotation.x = Math.sin(w) * .7; legs[1].rotation.x = -Math.sin(w) * .7; body.position.y = Math.abs(Math.sin(w)) * .05 + (s.jump || 0);
    const wave = s.wave ? Math.sin(t * 10) * .6 : 0; arms[0].rotation.z = -.4 - wave; arms[1].rotation.z = .4 + wave;
    const g = scr.g; const W2 = 256, H2 = 360;
    g.fillStyle = s.sleep ? '#26324a' : s.error ? '#ffd6d6' : '#c4f1ff'; g.fillRect(0, 0, W2, H2);
    const ink = s.sleep ? '#8899bb' : '#1b2a41'; g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = 10; g.lineCap = 'round';
    if (s.sleep) { [88, 168].forEach(x => { g.beginPath(); g.arc(x, 170, 22, .15 * Math.PI, .85 * Math.PI); g.stroke(); }); g.font = '48px sans-serif'; g.fillText('z', 190, 90 - (t * 20) % 30); }
    else {
      [88, 168].forEach(x => { g.beginPath(); g.ellipse(x, 170, 20, 28, 0, 0, Math.PI * 2); g.fill(); });
      if (s.mood === 'angry') { g.beginPath(); g.moveTo(60, 118); g.lineTo(110, 135); g.stroke(); g.beginPath(); g.moveTo(196, 118); g.lineTo(146, 135); g.stroke(); }
      if (s.talk) { g.beginPath(); g.ellipse(128, 260, 34, 10 + Math.abs(Math.sin(t * 16)) * 26, 0, 0, Math.PI * 2); g.fill(); }
      else { g.beginPath(); if (s.mood === 'angry') g.arc(128, 290, 36, 1.2 * Math.PI, 1.8 * Math.PI); else g.arc(128, 230, 40, .2 * Math.PI, .8 * Math.PI); g.stroke(); }
      if (s.error) { g.fillStyle = '#d62839'; g.font = 'bold 34px sans-serif'; g.textAlign = 'center'; g.fillText('ОШИБКА', 128, 60); g.textAlign = 'left'; }
    }
    if (s.smudge) { g.globalAlpha = s.smudge; g.strokeStyle = 'rgba(110,70,30,.8)'; g.lineWidth = 3; [[50, 60], [200, 300], [60, 300], [210, 70]].forEach(([x, y]) => { for (let k = 1; k < 5; k++) { g.beginPath(); g.ellipse(x, y, k * 7, k * 9, .4, 0, Math.PI * 2); g.stroke(); } }); g.globalAlpha = 1; }
    scr.t.needsUpdate = true;
  } };
}

/* ---------- small props ---------- */
export function sneaker(color = '#ff5a5f') {
  const g = new THREE.Group();
  g.add(at(rbox(.16, .1, .3, color, .05), 0, .08, 0), at(rbox(.17, .04, .32, '#ffffff', .02), 0, .02, 0));
  [-1, 1].forEach(s => { const e = at(sphere(.025, '#ffffff', 12), s * .04, .1, .14); g.add(e); g.add(at(sphere(.013, '#1b2a41', 8), s * .04, .1, .16)); });
  return g;
}
export function sock() { const g = new THREE.Group(); g.add(at(capsule(.04, .14, '#ffffff'), 0, .12, 0), at(capsule(.04, .08, '#ffffff'), 0, .04, .05)); g.children[1].rotation.x = Math.PI / 2; g.add(at(cyl(.045, .045, .03, '#ff5a5f'), 0, .2, 0)); return g; }
export function toyCar(color) {
  const g = new THREE.Group();
  g.add(at(rbox(.26, .08, .14, color, .03), 0, .07, 0), at(rbox(.13, .07, .12, color, .03), -.02, .14, 0));
  [[-.08, .07], [.08, .07], [-.08, -.07], [.08, -.07]].forEach(([x, z]) => { const w = at(cyl(.035, .035, .03, '#2d3142', 16), x, .035, z); w.rotation.x = Math.PI / 2; g.add(w); });
  return g;
}
export function backpack() { const g = new THREE.Group(); g.add(at(rbox(.3, .38, .16, '#ff9f1c', .07), 0, .19, 0), at(rbox(.22, .16, .06, '#ffbf5c', .04), 0, .14, .09)); return g; }

/* ---------- bedroom ---------- */
export function makeBedroom() {
  const g = new THREE.Group();
  const wood = canvasTex(512, 512); { const c = wood.g; c.fillStyle = '#e3b07a'; c.fillRect(0, 0, 512, 512); for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#d9a46c' : '#e8b984'; c.fillRect(0, i * 32, 512, 30); } }
  wood.t.wrapS = wood.t.wrapT = THREE.RepeatWrapping; wood.t.repeat.set(3, 3);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshStandardMaterial({ map: wood.t, roughness: .7 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
  const wallpaper = canvasTex(256, 256); { const c = wallpaper.g; c.fillStyle = '#cfe8ff'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#e4f2ff'; for (let y = 0; y < 256; y += 64) for (let x = (y / 64 % 2) * 32; x < 256; x += 64) { c.beginPath(); c.arc(x + 16, y + 16, 7, 0, 7); c.fill(); } }
  wallpaper.t.wrapS = wallpaper.t.wrapT = THREE.RepeatWrapping; wallpaper.t.repeat.set(5, 2);
  const wm = new THREE.MeshStandardMaterial({ map: wallpaper.t, roughness: .9 });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.2), wm); back.position.set(0, 1.6, -3); back.receiveShadow = true; g.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.2), wm); left.rotation.y = Math.PI / 2; left.position.set(-5, 1.6, 1); left.receiveShadow = true; g.add(left);
  g.add(at(rbox(10, .12, .06, '#ffffff', .02), 0, .06, -2.97));
  const right = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.2), wm); right.rotation.y = -Math.PI / 2; right.position.set(5, 1.6, 1); right.receiveShadow = true; g.add(right);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), mat('#fbfdff')); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 3.2, 1); g.add(ceil);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.2), wm); front.rotation.y = Math.PI; front.position.set(0, 1.6, 4.9); front.receiveShadow = true; g.add(front);
  // window with sky
  const sky = canvasTex(256, 256); { const c = sky.g; const gr = c.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#7cc8ff'); gr.addColorStop(1, '#d8f1ff'); c.fillStyle = gr; c.fillRect(0, 0, 256, 256); c.fillStyle = '#ffe066'; c.beginPath(); c.arc(180, 70, 30, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(80, 160, 50, 18, 0, 0, 7); c.fill(); c.fillStyle = '#6fcf7a'; c.beginPath(); c.arc(60, 260, 60, 0, 7); c.fill(); }
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), new THREE.MeshBasicMaterial({ map: sky.t })); win.position.set(1.6, 1.75, -2.98); g.add(win);
  [[0, .7, 1.75, .08], [0, -.7, 1.75, .08]].forEach(() => {});
  g.add(at(rbox(1.75, .1, .1, '#ffffff', .03), 1.6, 2.42, -2.94), at(rbox(1.75, .1, .14, '#ffffff', .03), 1.6, 1.08, -2.92), at(rbox(.08, 1.3, .08, '#ffffff', .02), 1.6, 1.75, -2.94), at(rbox(.1, 1.4, .1, '#ffffff', .03), .78, 1.75, -2.94), at(rbox(.1, 1.4, .1, '#ffffff', .03), 2.42, 1.75, -2.94));
  const curtL = at(rbox(.9, 1.6, .05, '#ff8f8f', .02), 1.15, 1.72, -2.86), curtR = at(rbox(.9, 1.6, .05, '#ff8f8f', .02), 2.05, 1.72, -2.86);
  g.add(curtL, curtR, at(cyl(.025, .025, 2.2, '#a0643c'), 1.6, 2.55, -2.86)); g.children[g.children.length - 1].rotation.z = Math.PI / 2;
  // beds along the back-left
  const beds = [[-3.4, '#7c5cff'], [-1.7, '#ff8fb1']].map(([x, col]) => {
    const b = new THREE.Group(); b.position.set(x, 0, -1.9);
    b.add(at(rbox(1.25, .35, 2, '#b07446', .06), 0, .18, 0), at(rbox(1.15, .2, 1.9, '#ffffff', .08), 0, .45, 0), at(rbox(1.3, 1.1, .12, '#9a6038', .05), 0, .55, -1));
    b.add(at(rbox(.6, .14, .35, '#ffffff', .07), 0, .62, -.72));
    const blanket = at(rbox(1.18, .16, 1.25, col, .07), 0, .58, .3); b.add(blanket); b.userData.blanket = blanket;
    g.add(b); return b;
  });
  // dresser, toy box, lamp, rug, door
  g.add(at(rbox(1, .9, .5, '#d39b62', .05), 3.6, .45, -2.7), at(rbox(.9, .35, .05, '#e8b77a', .03), 3.6, .65, -2.44), at(rbox(.9, .35, .05, '#e8b77a', .03), 3.6, .25, -2.44));
  g.add(at(rbox(.7, .45, .45, '#3b8beb', .06), .8, .23, -2.5));
  const rug = at(cyl(1.3, 1.3, .02, '#ffb3c1', 48), .3, .01, .2); rug.scale.z = .7; g.add(rug);
  const door = new THREE.Group(); door.position.set(4.6, 0, -2.95); const leaf = at(rbox(1, 2.2, .08, '#c98b55', .03), -.5, 1.1, 0); door.add(leaf, at(sphere(.05, '#ffd23f', 12), -.88, 1.05, .07)); g.add(door, at(rbox(1.15, 2.3, .04, '#3b2a1e', .02), 4.1, 1.15, -2.99));
  const lamp = new THREE.Group(); lamp.add(at(cyl(.01, .01, .6, '#555'), 0, 2.9, 0), at(cyl(.15, .35, .3, '#ffd23f'), 0, 2.5, 0)); lamp.position.set(.3, 0, -.5); g.add(lamp);
  const lampLight = new THREE.PointLight('#ffd9a0', 0, 6); lampLight.position.set(.3, 2.3, -.5); g.add(lampLight);
  return { group: g, beds, curtL, curtR, door, win, lampLight };
}

/* ---------- camera rig ---------- */
// keys: [[time, [x,y,z], [tx,ty,tz]], ...]; smooth between keys, with a gentle handheld drift
export function camAt(cam, t, keys, drift = 1) {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const k = b === a ? 0 : ease(seg(t, a[0], b[0]));
  const p = a[1].map((v, j) => lerp(v, b[1][j], k)), q = a[2].map((v, j) => lerp(v, b[2][j], k));
  cam.position.set(p[0] + Math.sin(t * .7) * .03 * drift, p[1] + Math.sin(t * .9) * .02 * drift, p[2]);
  cam.lookAt(q[0], q[1], q[2]);
}
