// Office objects: mass, effective mass fraction, strike faces (contact laws)
const OBJECTS = [
  { id: 'teak', name: 'โต๊ะไม้สักตัน', mass: 32, feff: 0.75, w: 1.2, h: 0.75, color: '#8a5a2b',
    faces: [
      { id: 'teak-corner', label: 'มุมท็อปโต๊ะ', kind: 'hertz', Eo: 4e9, nuo: 0.3, R: 0.003, area: 'corner', A0: 4e-6, g: 2.5, pc: 35e6, hard: false, mat: 'ไม้สัก', mtip: 2, ks: 2e7 },
      { id: 'teak-leg', label: 'ปลายขาโต๊ะ (หน้าตัด 5×5 ซม.)', kind: 'hertz', Eo: 4e9, nuo: 0.3, R: 0.008, area: 'corner', A0: 3e-5, g: 1.5, pc: 35e6, hard: false, mat: 'ไม้สัก', mtip: 1.5, ks: 5e6 }
    ] },
  { id: 'ply', name: 'โต๊ะไม้อัด (plywood)', mass: 25, feff: 0.65, w: 1.2, h: 0.75, color: '#b98b50',
    faces: [
      { id: 'ply-corner', label: 'มุมท็อปโต๊ะ', kind: 'hertz', Eo: 6e9, nuo: 0.3, R: 0.003, area: 'corner', A0: 4e-6, g: 2.5, pc: 25e6, hard: false, mat: 'ไม้อัด', mtip: 1.8, ks: 1e7 }
    ] },
  { id: 'mdf', name: 'โต๊ะปาร์ติเคิลบอร์ด / MDF', mass: 22, feff: 0.5, w: 1.2, h: 0.75, color: '#c9a873',
    faces: [
      { id: 'mdf-corner', label: 'มุมท็อปโต๊ะ', kind: 'hertz', Eo: 2.5e9, nuo: 0.3, R: 0.004, area: 'corner', A0: 6e-6, g: 3, pc: 9e6, hard: false, mat: 'ไม้อัด', mtip: 1.5, ks: 5e6 }
    ] },
  { id: 'chair', name: 'เก้าอี้ออฟฟิศ (ฐานอะลูมิเนียม)', mass: 13, feff: 0.3, w: 0.65, h: 1.0, color: '#3a3f47',
    faces: [
      { id: 'chair-caster', label: 'ปลายขา (ล้อไนลอน)', kind: 'hertz', Eo: 2.8e9, nuo: 0.4, R: 0.025, area: 'sphere', pc: 70e6, hard: false, breakF: 3500, next: 'chair-base', mat: 'ล้อไนลอน', mtip: 0.4, ks: 3e5 },
      { id: 'chair-back', label: 'พนักพิง / เบาะ', kind: 'linear', K: 2.5e4, rFixed: 0.15, area: 'fixed', pc: Infinity, hard: false, mat: 'โฟม' }
    ] },
  { id: 'ext', name: 'ถังดับเพลิง (ผงเคมี 6 kg)', mass: 10, feff: 0.95, w: 0.55, h: 0.17, color: '#c8312b',
    faces: [
      { id: 'ext-rim', label: 'ขอบก้นถัง (เหล็ก)', kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.004, area: 'sphere', pc: 1.05e9, hard: true, mat: 'เหล็ก', mtip: 0.6, ks: 1.5e7 },
      { id: 'ext-side', label: 'ด้านข้างตัวถัง', kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.08, area: 'sphere', pc: 1.05e9, hard: true, mat: 'เหล็ก', mtip: 0.8, ks: 1e7 }
    ] },
  { id: 'paper', name: 'แพ็คกระดาษ A4 (500 แผ่น)', mass: 2.5, feff: 0.7, w: 0.3, h: 0.055, color: '#e9e6dc',
    faces: [
      { id: 'paper-corner', label: 'มุมแพ็ค', kind: 'hertz', Eo: 0.3e9, nuo: 0.2, R: 0.003, area: 'corner', A0: 4e-6, g: 10, pc: 0.6e6, hard: false, mat: 'กระดาษ' }
    ] },
  { id: 'mug', name: 'แก้วกาแฟเซรามิก', mass: 0.35, feff: 1, w: 0.1, h: 0.1, color: '#f2f2ee',
    faces: [
      { id: 'mug-rim', label: 'ขอบแก้ว', kind: 'hertz', Eo: 70e9, nuo: 0.22, R: 0.003, area: 'sphere', pc: Infinity, hard: true, breakF: 1800, mat: 'เซรามิก' }
    ] },
  { id: 'stapler', name: 'ที่เย็บกระดาษเหล็ก', mass: 0.45, feff: 0.9, w: 0.18, h: 0.06, color: '#5b6470',
    faces: [
      { id: 'stapler-corner', label: 'มุมเหล็ก', kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.0015, area: 'sphere', pc: 0.9e9, hard: true, mat: 'เหล็ก' }
    ] }
];
const NEXT = {
  'chair-base': { id: 'chair-base', label: 'ฐานอะลูมิเนียม (ล้อหักแล้ว)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.006, area: 'sphere', pc: 540e6, hard: true, gap: 0.015, mat: 'อะลูมิเนียม', mtip: 0.4, ks: 3e5 }
};
// EN 12600 pendulum (twin tyre, 50 kg) — calibration impactor
const EN12600 = { id: 'en12600', label: 'ตุ้มยาง EN 12600', kind: 'linear', K: 1.5e5, rFixed: 0.13, area: 'fixed', pc: Infinity, hard: false };
// Human limits
const HUMAN = { vLimb: 14, E: 150, mArm: 3, Fmax: 450 };
function vMaxFor(m) { return Math.min(HUMAN.vLimb, Math.sqrt(2 * HUMAN.E / (m + HUMAN.mArm))); }
if (typeof module !== 'undefined') module.exports = { OBJECTS, NEXT, EN12600, HUMAN, vMaxFor };
