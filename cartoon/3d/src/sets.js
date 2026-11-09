// 3D sets and props shared by the episodes.
import * as THREE from 'three';
import { mat, rbox, sphere, cyl, capsule, at, canvasTex, makeChiston } from './world.js';

function tiles(base, line, n = 8) {
  const t = canvasTex(256, 256), g = t.g; g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = line; g.lineWidth = 4; for (let i = 0; i <= 256; i += 256 / n) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
  t.t.wrapS = t.t.wrapT = THREE.RepeatWrapping; return t.t;
}
function plane(w, h, m) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.receiveShadow = true; return p; }

/* ---------- bathroom: sink in the middle of the back wall, Chiston above it ---------- */
export function makeBathroom() {
  const g = new THREE.Group();
  const ft = tiles('#8dc3cf', '#79b2bf', 6); ft.repeat.set(5, 4);
  const floor = plane(10, 8, new THREE.MeshStandardMaterial({ map: ft, roughness: .5 })); floor.rotation.x = -Math.PI / 2; g.add(floor);
  const wt = tiles('#e4f6f3', '#c4e4df', 8); wt.repeat.set(5, 2);
  const wm = new THREE.MeshStandardMaterial({ map: wt, roughness: .35 });
  const back = plane(10, 3.2, wm); back.position.set(0, 1.6, -3); g.add(back);
  const left = plane(8, 3.2, wm); left.rotation.y = Math.PI / 2; left.position.set(-5, 1.6, 1); g.add(left);
  const right = plane(8, 3.2, wm); right.rotation.y = -Math.PI / 2; right.position.set(5, 1.6, 1); g.add(right);
  const ceil = plane(10, 8, mat('#fbfdff')); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 3.2, 1); g.add(ceil);
  const front = plane(10, 3.2, wm); front.rotation.y = Math.PI; front.position.set(0, 1.6, 4.9); g.add(front);
  // vanity with basin and tap
  g.add(at(rbox(1.9, .78, .7, '#ffffff', .06), 0, .39, -2.62), at(rbox(.02, .6, .02, '#d9e4ea', .01), 0, .4, -2.26));
  [[-.45, .4], [.45, .4]].forEach(([x]) => g.add(at(sphere(.03, '#9fb6c9', 12), x, .5, -2.26)));
  g.add(at(rbox(2.05, .08, .82, '#f4f7fa', .03), 0, .82, -2.6));
  const basin = at(cyl(.38, .3, .06, '#d9e4ea', 40), 0, .845, -2.58); basin.scale.z = .7; g.add(basin);
  g.add(at(cyl(.04, .05, .22, '#b7c6d3'), 0, .95, -2.88));
  const spout = at(rbox(.06, .05, .22, '#b7c6d3', .02), 0, 1.04, -2.8); g.add(spout);
  const water = at(cyl(.022, .022, .17, mat('#8fd3ff', { transparent: true, opacity: .65 })), 0, .95, -2.7); water.visible = false; g.add(water);
  // cup with brushes, towel, step stool, rug
  g.add(at(cyl(.07, .06, .16, '#ff9fbd'), -.75, .94, -2.75));
  [['#4cc3ff', -.02], ['#ff7aa2', .03]].forEach(([c, dx]) => { const b = at(cyl(.012, .012, .22, c), -.75 + dx, 1.04, -2.75); b.rotation.z = dx * 6; g.add(b); });
  g.add(at(rbox(.6, .9, .06, '#ffd23f', .05), 2.4, 1.35, -2.94), at(cyl(.02, .02, .8, '#9fb6c9'), 2.4, 1.82, -2.92));
  g.children[g.children.length - 1].rotation.z = Math.PI / 2;
  const stool = at(rbox(.5, .18, .35, '#3b8beb', .05), .42, .09, -2.05); g.add(stool);
  const rug = at(cyl(.8, .8, .02, '#ffffff', 40), 0, .01, -1.6); rug.scale.z = .55; g.add(rug);
  const mirror = makeChiston(); mirror.root.position.set(0, 1.85, -2.94); mirror.root.scale.setScalar(.72); g.add(mirror.root);
  return { group: g, mirror, water, stool };
}

/* ---------- props ---------- */
export function toothbrush(color) {
  const g = new THREE.Group();
  g.add(at(rbox(.03, .24, .03, color, .012), 0, .1, 0));
  g.add(at(rbox(.04, .06, .03, '#ffffff', .01), 0, .24, .025));
  return g;
}
export function foam(n = 10) {
  const g = new THREE.Group(); const m = mat('#ffffff', { roughness: .3, transparent: true, opacity: .95 });
  for (let i = 0; i < n; i++) { const b = sphere(.03 + (i % 3) * .015, m, 12); b.castShadow = false; b.userData.i = i; g.add(b); }
  g.userData.update = (t, k) => g.children.forEach(b => { const i = b.userData.i, a = i * 2.1 + t * 2; b.position.set(Math.cos(a) * .09, Math.sin(i * 1.7 + t * 3) * .04, Math.sin(a) * .07); b.scale.setScalar(Math.max(.001, k)); });
  return g;
}
export function sparkles() {
  const g = new THREE.Group(); const m = mat('#ffe066', { emissive: '#ffd23f', emissiveIntensity: 1 });
  for (let i = 0; i < 14; i++) { const s = sphere(.03, m, 8); s.castShadow = false; g.add(s); }
  g.userData.update = k => g.children.forEach((s, i) => { const a = i / 14 * Math.PI * 2; s.position.set(Math.cos(a) * k * .7, .6 + Math.sin(a * 2) * .3 + k * .2, Math.sin(a) * k * .7); s.scale.setScalar(Math.max(.001, 1 - k)); });
  return g;
}
export function hook() { const g = new THREE.Group(); g.add(at(rbox(.3, .06, .04, '#a0643c', .02), 0, 0, 0), at(cyl(.015, .015, .1, '#7a4b25'), 0, -.03, .05)); g.children[1].rotation.x = Math.PI / 2; return g; }
export function foldedClothes(color) { return at(rbox(.36, .08, .26, color, .03), 0, .04, 0); }
