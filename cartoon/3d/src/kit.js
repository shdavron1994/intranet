// Shared stage for 3D episodes 2–8: renderer, lights, cast, set switching and staging helpers.
import * as THREE from 'three';
import { makeDilshod, makeTomiris, makeMom, makePapa } from './cast.js';
import { makePerson, W, H, seg, ease, lerp, makeRenderer, makeBedroom, camAt } from './world.js';
import { makeBathroom } from './sets.js';
import { state } from './eng3d.js';
import { makeKitchen, makeLiving, makeYard, makeStreet, makePark, makeCar, bathtub, skyTex } from './sets2.js';

export function makeKit(want = []) {
  const gl = document.getElementById('gl');
  const renderer = makeRenderer(gl);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#9fd4ff');
  const cam = new THREE.PerspectiveCamera(38, W / H, .05, 120);
  const hemi = new THREE.HemisphereLight('#e3f2ff', '#c99a6b', .7); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff1d6', .8); sun.position.set(-3, 7, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0005;
  scene.add(sun, sun.target);
  const K = { gl, renderer, scene, camObj: cam, hemi, sun, sets: {} };
  const add = (k, s) => { K.sets[k] = s; s.group.visible = false; scene.add(s.group); return s; };
  if (want.includes('kitchen')) K.kitchen = add('kitchen', makeKitchen());
  if (want.includes('living')) K.living = add('living', makeLiving());
  if (want.includes('yard')) K.yard = add('yard', makeYard());
  if (want.includes('street')) { K.street = add('street', makeStreet()); K.car = makeCar(); K.street.group.add(K.car.root); }
  if (want.includes('park')) K.park = add('park', makePark());
  if (want.includes('bedroom')) K.bedroom = add('bedroom', makeBedroom());
  if (want.includes('bathroom')) { K.bathroom = add('bathroom', makeBathroom()); if (want.includes('tub')) { K.tub = bathtub(); K.tub.root.position.set(-3.2, 0, -2.4); K.bathroom.group.add(K.tub.root); } }
  const bathLight = new THREE.PointLight('#fff4e0', 0, 9); bathLight.position.set(0, 2.8, -.5); bathLight.castShadow = true; scene.add(bathLight);
  const lamp = new THREE.PointLight('#ffd9a0', 0, 7); lamp.castShadow = true; scene.add(lamp);

  // cast: day clothes, pajamas, grown-ups, neighbours
  K.D = makeDilshod(); K.T = makeTomiris(); K.M = makeMom(); K.Ma = makeMom({ apron: true }); K.P = makePapa();
  if (want.includes('pajama')) { K.Dp = makeDilshod({ shirt: '#9fc3ff', pants: '#9fc3ff', pajama: true }); K.Tp = makeTomiris({ shirt: '#ffc2d6', pants: '#ffc2d6', pajama: true, flowers: false, collar: false, belt: false, shoes: '#ff9fbd' }); }
  if (want.includes('friends')) { K.Boy = makePerson({ kind: 'boy', style: 'spiky', hair: '#6b4226', skin: '#e8b48e', eye: '#3a2a1a', shirt: '#ffb703', pants: '#3a5a40', shoes: '#ff5a5f', blinkOff: 2.1 }); K.Girl = makePerson({ kind: 'girl', style: 'ponytail', hair: '#3b2418', skin: '#f2c8a6', eye: '#2b1a12', shirt: '#7c5cff', tights: '#ffffff', shoes: '#7c5cff', scale: .9, blinkOff: .4 }); }
  K.people = ['D', 'T', 'M', 'Ma', 'P', 'Dp', 'Tp', 'Boy', 'Girl'].map(k => K[k]).filter(Boolean);
  K.people.forEach(P => scene.add(P.root));

  K.env = (name, mode = 'day') => {
    Object.entries(K.sets).forEach(([k, s]) => s.group.visible = k === name);
    const outdoor = ['yard', 'street', 'park'].includes(name);
    bathLight.intensity = 0; lamp.intensity = 0;
    if (outdoor) {
      scene.background = new THREE.Color(mode === 'evening' ? '#ffcf9f' : '#8fd0ff'); scene.fog = new THREE.Fog(scene.background, 25, 70);
      hemi.color.set('#e3f2ff'); hemi.groundColor.set('#7a9a5a'); hemi.intensity = 1.0; sun.intensity = mode === 'evening' ? 1.6 : 2.3; sun.color.set(mode === 'evening' ? '#ffc48a' : '#fff1d6');
      Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -8, far: 60 }); sun.position.set(-8, 14, 10);
    } else {
      scene.fog = null; scene.background = new THREE.Color('#0e3a46');
      hemi.color.set('#e3f2ff'); hemi.groundColor.set('#c99a6b');
      Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 5, bottom: -3, far: 30 }); sun.position.set(-3, 7, 5);
      if (mode === 'night') { hemi.intensity = .28; hemi.color.set('#8aa0ff'); sun.intensity = .05; lamp.intensity = 5; }
      else if (name === 'bathroom') { hemi.intensity = .7; sun.intensity = .35; bathLight.intensity = 8; }
      else { hemi.intensity = .75; sun.intensity = .9; }
      const set = K.sets[name]; if (set && set.lamp) set.lamp.intensity = mode === 'night' ? 0 : 5;
    }
    sun.shadow.camera.updateProjectionMatrix();
    if (K.living) K.living.win.userData.glass.material.map = mode === 'night' || mode === 'evening2' ? K.living.win.userData.night : K.living.win.userData.day;
    if (K.bedroom) { K.daySky = K.daySky || K.bedroom.win.material.map; K.nightSky = K.nightSky || skyTex(true); K.bedroom.win.material.map = mode === 'night' ? K.nightSky : K.daySky; }
  };
  K.lampAt = (x, y, z, i = 5) => { lamp.position.set(x, y, z); lamp.intensity = i; };
  K.fov = f => { if (cam.fov !== f) { cam.fov = f; cam.updateProjectionMatrix(); } };
  K.cast = (...on) => K.people.forEach(P => P.root.visible = on.includes(P));
  K.place = (P, x, z, ry = 0, y = 0) => { P.body.rotation.set(0, 0, 0); P.root.position.set(x, y, z); P.root.rotation.set(0, ry, 0); };
  K.sit = (P, seat, dy = 0) => { const hip = (P.o.kind === 'mom' || P.o.kind === 'papa' ? .84 : .4) * (P.o.scale || 1); K.place(P, seat.x, seat.z, seat.ry, seat.y - hip + dy); };
  K.walk = (P, from, to, t0, t1, t, face) => {
    const k = ease(seg(t, t0, t1)); P.root.position.set(lerp(from[0], to[0], k), P.root.position.y, lerp(from[1], to[1], k));
    const moving = t > t0 && t < t1; P.root.rotation.y = moving ? Math.atan2(to[0] - from[0], to[1] - from[1]) : (face ?? P.root.rotation.y);
    return moving ? (t - t0) * 9 : 0;
  };
  K.cam = (t, keys, drift = 1) => camAt(cam, t, keys, drift);
  K.hold = (P, obj, hand = 1) => { P.arms[hand].userData.hand.add(obj); return obj; };
  // 2D explainer screens: draw with the 2D library onto #cv, then use it full-screen or on a 3D TV
  K.draw2D = fn => { window.setCur(state.CUR); fn(); return document.getElementById('cv'); };
  K.tv2D = (tv, fn) => tv.set(g => g.drawImage(K.draw2D(fn), 0, 0, 640, 360));
  // eating with a spoon: k in 0..1 lifts the spoon to the mouth
  K.eat = (P, k) => ({ armRx: .55 + k * .75, elbowR: .9 + k * 1.1, armR: .15 });
  return K;
}
