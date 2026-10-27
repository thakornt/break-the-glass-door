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
    ] },
  { id: 'lcd', name: 'จอ LCD 24 นิ้ว (รุ่นเก่า มีขาตั้ง)', shape: 'monitor', mass: 5.5, feff: 0.6, w: 0.56, h: 0.48, color: '#2b2f36',
    faces: [
      { id: 'lcd-corner', label: 'มุมจอ (กรอบพลาสติก)', kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 1e-5, g: 3, pc: 60e6, hard: false, damageF: 1500, damageLabel: 'จอ LCD ข้างในแตก', mat: 'ABS', mtip: 0.4, ks: 2e6 },
      { id: 'lcd-stand', label: 'ขอบฐานขาตั้ง (เหล็กพ่นสี)', fy: 0.02, kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.003, area: 'sphere', pc: 0.6e9, hard: true, mat: 'เหล็ก', mtip: 0.8, ks: 3e6 }
    ] },
  { id: 'led', name: 'จอ LED 27 นิ้ว (บาง)', shape: 'monitor', mass: 4.6, feff: 0.6, w: 0.62, h: 0.52, color: '#1c1f24',
    faces: [
      { id: 'led-corner', label: 'มุมจอ (กรอบพลาสติก)', kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.003, area: 'corner', A0: 6e-6, g: 3, pc: 60e6, hard: false, damageF: 1200, damageLabel: 'แผงจอแตก', mat: 'ABS', mtip: 0.3, ks: 1.5e6 },
      { id: 'led-stand', label: 'ขอบฐานขาตั้ง (อะลูมิเนียม)', fy: 0.02, kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.5e9, hard: true, mat: 'อะลูมิเนียม', mtip: 0.7, ks: 3e6 }
    ] },
  { id: 'mouse', name: 'เมาส์', shape: 'mouse', mass: 0.1, feff: 0.9, w: 0.12, h: 0.04, color: '#3d434b',
    faces: [
      { id: 'mouse-nose', label: 'หัวเมาส์ (พลาสติก)', fy: 0.4, kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.015, area: 'sphere', pc: 60e6, hard: false, breakF: 1500, mat: 'ABS' }
    ] },
  { id: 'keyboard', name: 'คีย์บอร์ด (พลาสติก ฟูลไซซ์)', shape: 'keyboard', mass: 0.8, feff: 0.55, w: 0.44, h: 0.035, color: '#2f343b',
    faces: [
      { id: 'kb-corner', label: 'มุมคีย์บอร์ด', kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 6e-6, g: 3, pc: 60e6, hard: false, damageF: 900, damageLabel: 'ปุ่มหลุด / เคสร้าว', mat: 'ABS', mtip: 0.15, ks: 1.5e6 }
    ] },
  { id: 'strip', name: 'ปลั๊กพ่วง', shape: 'strip', mass: 0.55, feff: 0.85, w: 0.3, h: 0.045, color: '#ecebe6',
    faces: [
      { id: 'strip-corner', label: 'มุมรางปลั๊ก (ถือด้วยมือ)', kind: 'hertz', Eo: 2.4e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 6e-6, g: 3, pc: 70e6, hard: false, damageF: 1500, damageLabel: 'เคสปลั๊กแตก', mat: 'PC', mtip: 0.15, ks: 3e6 },
      { id: 'strip-sling', label: 'มุมรางปลั๊ก (เหวี่ยงด้วยสายไฟ)', vMult: 1.6, kind: 'hertz', Eo: 2.4e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 6e-6, g: 3, pc: 70e6, hard: false, damageF: 1500, damageLabel: 'เคสปลั๊กแตก', mat: 'PC', mtip: 0.15, ks: 3e6 }
    ] },
  // Phones: weight, size and frame material from manufacturer spec pages (Oct 2026)
  { id: 'ip18pro', name: 'iPhone 18 Pro', shape: 'phone', mass: 0.211, feff: 0.9, w: 0.150, h: 0.00875, color: '#9aa3ab',
    faces: [
      { id: 'ip18pro-corner', label: 'มุมเครื่อง (เฟรมอะลูมิเนียม)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.75e9, hard: true, damageF: 2500, damageLabel: 'กระจกหน้า/หลังร้าว', mat: 'อะลูมิเนียม' }
    ] },
  { id: 'ip18pm', name: 'iPhone 18 Pro Max', shape: 'phone', mass: 0.249, feff: 0.9, w: 0.1634, h: 0.00875, color: '#9aa3ab',
    faces: [
      { id: 'ip18pm-corner', label: 'มุมเครื่อง (เฟรมอะลูมิเนียม)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.75e9, hard: true, damageF: 2500, damageLabel: 'กระจกหน้า/หลังร้าว', mat: 'อะลูมิเนียม' }
    ] },
  { id: 's26u', name: 'Galaxy S26 Ultra', shape: 'phone', mass: 0.214, feff: 0.9, w: 0.1636, h: 0.0079, color: '#4a4f57',
    faces: [
      { id: 's26u-corner', label: 'มุมเครื่อง (Armor Aluminum)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.75e9, hard: true, damageF: 2500, damageLabel: 'กระจกหน้า/หลังร้าว', mat: 'อะลูมิเนียม' }
    ] },
  { id: 'fold8', name: 'Galaxy Z Fold8 (พับอยู่)', shape: 'fold', mass: 0.201, feff: 0.85, w: 0.1239, h: 0.0097, color: '#3b4048',
    faces: [
      { id: 'fold8-corner', label: 'มุมเครื่อง (Armor Aluminum)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.75e9, hard: true, damageF: 2000, damageLabel: 'จอนอก/บานพับเสียหาย', mat: 'อะลูมิเนียม' },
      { id: 'fold8-hinge', label: 'สันบานพับ', fy: 0.5, kind: 'hertz', Eo: 90e9, nuo: 0.32, R: 0.0048, area: 'sphere', pc: 0.9e9, hard: true, damageF: 2500, damageLabel: 'บานพับเสียหาย', mat: 'อะลูมิเนียม/เหล็ก' }
    ] },
  { id: 'ipduo', name: 'iPhone Duo (พับอยู่)', shape: 'fold', mass: 0.254, feff: 0.85, w: 0.1178, h: 0.0113, color: '#c9c2b6',
    faces: [
      { id: 'ipduo-corner', label: 'มุมเครื่อง (ไทเทเนียม เกรด 5)', kind: 'hertz', Eo: 114e9, nuo: 0.34, R: 0.004, area: 'sphere', pc: 1.3e9, hard: true, damageF: 2500, damageLabel: 'จอนอก/ฝาหลังร้าว', mat: 'ไทเทเนียม' },
      { id: 'ipduo-hinge', label: 'สันบานพับ (ไทเทเนียม)', fy: 0.5, kind: 'hertz', Eo: 114e9, nuo: 0.34, R: 0.0056, area: 'sphere', pc: 1.3e9, hard: true, damageF: 3000, damageLabel: 'บานพับเสียหาย', mat: 'ไทเทเนียม' }
    ] }
];
const NEXT = {
  'chair-base': { id: 'chair-base', label: 'ฐานอะลูมิเนียม (ล้อหักแล้ว)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.006, area: 'sphere', pc: 540e6, hard: true, gap: 0.015, mat: 'อะลูมิเนียม', mtip: 0.4, ks: 3e5 }
};
// EN 12600 pendulum (twin tyre, 50 kg) — calibration impactor
const EN12600 = { id: 'en12600', label: 'ตุ้มยาง EN 12600', kind: 'linear', K: 1.5e5, rFixed: 0.13, area: 'fixed', pc: Infinity, hard: false };
// Human limits
const HUMAN = { vLimb: 14, E: 150, mArm: 3, Fmax: 450 };
function vMaxFor(m, face) { return Math.min(25, (face && face.vMult || 1) * Math.min(HUMAN.vLimb, Math.sqrt(2 * HUMAN.E / (m + HUMAN.mArm)))); }
if (typeof module !== 'undefined') module.exports = { OBJECTS, NEXT, EN12600, HUMAN, vMaxFor };
