// The family, as in their photos: stylised 3D likenesses.
import { makePerson } from './world.js';
const SKIN_KID = '#ecbd98', SKIN_MOM = '#f0c8ad', SKIN_PAPA = '#ddae8a';
export const makeDilshod = (o = {}) => makePerson(Object.assign({ kind: 'boy', style: 'mop', hair: '#1e1410', skin: SKIN_KID, eye: '#2b1a12', shirt: '#2fb5a0', pants: '#2b3f73', shoes: '#ffffff', blinkOff: 0 }, o));
export const makeTomiris = (o = {}) => makePerson(Object.assign({ kind: 'girl', style: 'bob', hair: '#22160f', skin: SKIN_KID, eye: '#2b1a12', earrings: true, shirt: '#e64980', flowers: true, collar: true, belt: true, tights: '#ffffff', shoes: '#d6336c', scale: .86, blinkOff: 1.3 }, o));
export const makeMom = (o = {}) => makePerson(Object.assign({ kind: 'mom', style: 'long', hair: '#1a110c', skin: SKIN_MOM, eye: '#22140e', browW: 1.15, brow: '#1a110c', lips: '#c0656b', shirt: '#fbf7f4', geo: true, shoes: '#8a6a5a', blinkOff: .6 }, o));
export const makePapa = (o = {}) => makePerson(Object.assign({ kind: 'papa', style: 'short', hair: '#1a120d', skin: SKIN_PAPA, eye: '#4a3522', stubble: true, shirt: '#3fae6a', polo: '#1f2a44', pants: '#2d3142', shoes: '#3b2a1e', blinkOff: .9 }, o));
