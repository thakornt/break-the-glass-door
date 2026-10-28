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
  { id: 'paper', name: 'กองกระดาษ A4', mass: 2.5, feff: 0.7, w: 0.3, h: 0.05, color: '#e9e6dc',
    faces: [
      { id: 'paper-500', label: '500 แผ่น (1 รีม · 2.5 kg)', mass: 2.5, feff: 0.7, h: 0.05, kind: 'hertz', Eo: 0.3e9, nuo: 0.2, R: 0.003, area: 'corner', A0: 4e-6, g: 10, pc: 0.6e6, hard: false, mat: 'กระดาษ' },
      { id: 'paper-1000', label: '1,000 แผ่น (2 รีม · 5 kg)', mass: 5, feff: 0.65, h: 0.10, kind: 'hertz', Eo: 0.3e9, nuo: 0.2, R: 0.003, area: 'corner', A0: 4e-6, g: 10, pc: 0.6e6, hard: false, mat: 'กระดาษ' },
      { id: 'paper-2000', label: '2,000 แผ่น (4 รีม · 10 kg)', mass: 10, feff: 0.6, h: 0.20, kind: 'hertz', Eo: 0.3e9, nuo: 0.2, R: 0.003, area: 'corner', A0: 4e-6, g: 10, pc: 0.6e6, hard: false, mat: 'กระดาษ' },
      { id: 'paper-5000', label: '5,000 แผ่น (10 รีม · 25 kg)', mass: 25, feff: 0.55, h: 0.50, kind: 'hertz', Eo: 0.3e9, nuo: 0.2, R: 0.003, area: 'corner', A0: 4e-6, g: 10, pc: 0.6e6, hard: false, mat: 'กระดาษ' }
    ] },
  { id: 'mug', name: 'แก้วกาแฟเซรามิก', mass: 0.35, feff: 1, w: 0.1, h: 0.1, color: '#f2f2ee',
    faces: [
      { id: 'mug-rim', label: 'ขอบปากแก้ว', kind: 'hertz', Eo: 70e9, nuo: 0.22, R: 0.003, area: 'sphere', pc: Infinity, hard: true, breakF: 1800, mat: 'เซรามิก' },
      { id: 'mug-base', label: 'ก้นแก้ว (ขอบฐานหนา)', fy: 0.05, kind: 'hertz', Eo: 70e9, nuo: 0.22, R: 0.005, area: 'sphere', pc: Infinity, hard: true, breakF: 4000, mat: 'เซรามิก' }
    ] },
  { id: 'stapler', name: 'ที่เย็บกระดาษเหล็ก', mass: 0.45, feff: 0.9, w: 0.18, h: 0.06, color: '#5b6470',
    faces: [
      { id: 'stapler-corner', label: 'มุมเหล็ก', kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.0015, area: 'sphere', pc: 0.9e9, hard: true, mat: 'เหล็ก' }
    ] },
  { id: 'lcd', name: 'จอ LCD 24 นิ้ว (รุ่นเก่า มีขาตั้ง)', shape: 'monitor', style: 'lcd', mass: 5.5, feff: 0.6, w: 0.56, h: 0.48, color: '#2b2f36',
    faces: [
      { id: 'lcd-corner', label: 'มุมจอ (กรอบพลาสติก)', kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 1e-5, g: 3, pc: 60e6, hard: false, wreckE: 95, stages: [[0.0001, 'กรอบถลอก'], [0.2, 'จอร้าวที่มุม'], [0.4, 'จอร้าวลาม มีเส้นสีขึ้น'], [0.65, 'สีเพี้ยน หมึกจอไหลเป็นปื้น'], [0.85, 'ภาพกระพริบ ครึ่งจอดับ'], [1, 'จอดับสนิท กรอบแตก']], mat: 'ABS', mtip: 0.4, ks: 2e6 },
      { id: 'lcd-stand', label: 'ขอบฐานขาตั้ง (เหล็กพ่นสี)', fy: 0.03, fx: 0.75, wreckE: 140, stages: [[0.0001, 'กรอบถลอก'], [0.2, 'จอร้าวที่มุม'], [0.4, 'จอร้าวลาม มีเส้นสีขึ้น'], [0.65, 'สีเพี้ยน หมึกจอไหลเป็นปื้น'], [0.85, 'ภาพกระพริบ ครึ่งจอดับ'], [1, 'จอดับสนิท กรอบแตก']], kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.003, area: 'sphere', pc: 0.6e9, hard: true, mat: 'เหล็ก', mtip: 0.8, ks: 3e6 }
    ] },
  { id: 'led', name: 'จอ LED 27 นิ้ว (บาง)', shape: 'monitor', style: 'led', mass: 4.6, feff: 0.6, w: 0.62, h: 0.52, color: '#1c1f24',
    faces: [
      { id: 'led-corner', label: 'มุมจอ (กรอบพลาสติก)', kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.003, area: 'corner', A0: 6e-6, g: 3, pc: 60e6, hard: false, wreckE: 75, stages: [[0.0001, 'กรอบถลอก'], [0.2, 'จอร้าวที่มุม'], [0.4, 'จอร้าวลาม มีเส้นสีขึ้น'], [0.65, 'สีเพี้ยน หมึกจอไหลเป็นปื้น'], [0.85, 'ภาพกระพริบ ครึ่งจอดับ'], [1, 'จอดับสนิท กรอบแตก']], mat: 'ABS', mtip: 0.3, ks: 1.5e6 },
      { id: 'led-stand', label: 'ขอบฐานขาตั้ง (อะลูมิเนียม)', fy: 0.015, fx: 0.71, wreckE: 110, stages: [[0.0001, 'กรอบถลอก'], [0.2, 'จอร้าวที่มุม'], [0.4, 'จอร้าวลาม มีเส้นสีขึ้น'], [0.65, 'สีเพี้ยน หมึกจอไหลเป็นปื้น'], [0.85, 'ภาพกระพริบ ครึ่งจอดับ'], [1, 'จอดับสนิท กรอบแตก']], kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.5e9, hard: true, mat: 'อะลูมิเนียม', mtip: 0.7, ks: 3e6 }
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
      { id: 'strip-corner', label: 'มุมรางปลั๊ก (ถือด้วยมือ)', kind: 'hertz', Eo: 2.4e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 6e-6, g: 3, pc: 25e6, hard: false, wreckE: 60, stages: [[0.0001, 'มุมเคสถลอก'], [0.25, 'มุมเคสบิ่น'], [0.5, 'เคสร้าว ฝาเริ่มแยก'], [0.75, 'เคสแตก ฝาหลุดบางส่วน'], [1, 'เคสแตกกระจาย เห็นแผงทองแดงข้างใน']], mat: 'PC (เคสกลวง)', mtip: 0.15, ks: 3e6 },
      { id: 'strip-sling', label: 'มุมรางปลั๊ก (เหวี่ยงด้วยสายไฟ)', vMult: 1.6, kind: 'hertz', Eo: 2.4e9, nuo: 0.37, R: 0.004, area: 'corner', A0: 6e-6, g: 3, pc: 25e6, hard: false, wreckE: 60, stages: [[0.0001, 'มุมเคสถลอก'], [0.25, 'มุมเคสบิ่น'], [0.5, 'เคสร้าว ฝาเริ่มแยก'], [0.75, 'เคสแตก ฝาหลุดบางส่วน'], [1, 'เคสแตกกระจาย เห็นแผงทองแดงข้างใน']], mat: 'PC (เคสกลวง)', mtip: 0.15, ks: 3e6 }
    ] },
  { id: 'dumbbell', name: 'ดัมบ์เบลล์', shape: 'dumbbell', mass: 10, feff: 0.95, w: 0.29, h: 0.1, color: '#3b3f45', vi: 9,
    variants: [{ label: '1 kg', mass: 1, w: 0.197, h: 0.042 }, { label: '2 kg', mass: 2, w: 0.221, h: 0.057 }, { label: '3 kg', mass: 3, w: 0.236, h: 0.066 }, { label: '4 kg', mass: 4, w: 0.248, h: 0.074 }, { label: '5 kg', mass: 5, w: 0.258, h: 0.080 }, { label: '6 kg', mass: 6, w: 0.267, h: 0.085 }, { label: '7 kg', mass: 7, w: 0.274, h: 0.090 }, { label: '8 kg', mass: 8, w: 0.281, h: 0.095 }, { label: '9 kg', mass: 9, w: 0.288, h: 0.099 }, { label: '10 kg', mass: 10, w: 0.294, h: 0.102 }, { label: '11 kg', mass: 11, w: 0.299, h: 0.106 }, { label: '12 kg', mass: 12, w: 0.304, h: 0.109 }, { label: '13 kg', mass: 13, w: 0.309, h: 0.112 }, { label: '14 kg', mass: 14, w: 0.314, h: 0.115 }, { label: '15 kg', mass: 15, w: 0.318, h: 0.117 }, { label: '16 kg', mass: 16, w: 0.322, h: 0.120 }, { label: '17 kg', mass: 17, w: 0.326, h: 0.123 }, { label: '18 kg', mass: 18, w: 0.330, h: 0.125 }, { label: '19 kg', mass: 19, w: 0.334, h: 0.127 }, { label: '20 kg', mass: 20, w: 0.337, h: 0.130 }],
    faces: [
      { id: 'db-iron', label: 'ขอบหัวเหล็กหล่อ (หกเหลี่ยม)', fy: 0.85, kind: 'hertz', Eo: 170e9, nuo: 0.26, R: 0.003, area: 'sphere', pc: 1.0e9, hard: true, mat: 'เหล็กหล่อ' },
      { id: 'db-rubber', label: 'หัวหุ้มยาง', fy: 0.85, kind: 'hertz', Eo: 0.2e9, nuo: 0.45, R: 0.03, area: 'sphere', pc: Infinity, hard: false, mat: 'ยาง (หุ้มเหล็ก)' }
    ] },
  { id: 'squishy', name: 'ตุ๊กตาสกุชชี่', shape: 'squishy', mass: 0.08, feff: 0.6, w: 0.11, h: 0.09, color: '#f3b6c8',
    faces: [
      { id: 'squishy-body', label: 'ตัวตุ๊กตา (โฟม PU คืนตัวช้า)', fy: 0.5, kind: 'linear', K: 2.5e3, rFixed: 0.045, area: 'fixed', pc: Infinity, hard: false, mat: 'โฟม PU' }
    ] },
  // Laptops: weight and size from Apple tech specs (MacBook Pro M5 / MacBook Air M5, 2026)
  { id: 'mbp', name: 'MacBook Pro (M5, 2026)', shape: 'laptop', screen: 'led', color: '#2f3136', mass: 1.55, feff: 0.85, w: 0.3126, h: 0.2212, vi: 0, variantLabel: 'รุ่น',
    variants: [{ label: '14 นิ้ว M5 · 1.55 kg', mass: 1.55, w: 0.3126, h: 0.2212, t: 0.0155 }, { label: '14 นิ้ว M5 Pro · 1.60 kg', mass: 1.6, w: 0.3126, h: 0.2212, t: 0.0155 }, { label: '14 นิ้ว M5 Max · 1.62 kg', mass: 1.62, w: 0.3126, h: 0.2212, t: 0.0155 }, { label: '16 นิ้ว M5 Pro · 2.14 kg', mass: 2.14, w: 0.3557, h: 0.2481, t: 0.0168 }, { label: '16 นิ้ว M5 Max · 2.15 kg', mass: 2.15, w: 0.3557, h: 0.2481, t: 0.0168 }],
    faces: [
      { id: 'mbp-open', label: 'กางจอ · ฟาดด้วยมุมฝาจอ', pose: 'open', feff: 0.35, kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.3e9, hard: true, wreckE: 40, stages: [[0.0001, 'ฝาจอบุบที่มุม'], [0.2, 'จอร้าวจากมุม'], [0.4, 'จอร้าวลาม มีเส้นสีขึ้น'], [0.65, 'ปื้นดำลามจากมุม แสงไฟหลังรั่ว'], [0.85, 'ครึ่งจอดับ บานพับหลวม'], [1, 'จอดับสนิท ฝาจองอ']], mat: 'อะลูมิเนียม (ฝาจอ)', mtip: 0.15, ks: 1e6 },
      { id: 'mbp-closed', label: 'พับเครื่อง · ฟาดด้วยมุมเครื่อง', pose: 'closed', feff: 0.85, kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.007, area: 'sphere', pc: 0.12e9, hard: true, wreckE: 80, stages: [[0.0001, 'มุมเครื่องบุบ'], [0.25, 'ฝาบิด ปิดไม่สนิท'], [0.5, 'จอด้านในร้าว'], [0.75, 'ตัวเครื่องงอ จอด้านในแตก'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม unibody', mtip: 0.3, ks: 2e6 }
    ] },
  { id: 'mba', name: 'MacBook Air (M5, 2026)', shape: 'laptop', screen: 'led', color: '#c3c9d1', mass: 1.23, feff: 0.85, w: 0.3041, h: 0.215, vi: 0, variantLabel: 'รุ่น',
    variants: [{ label: '13 นิ้ว M5 · 1.23 kg', mass: 1.23, w: 0.3041, h: 0.215, t: 0.0113 }, { label: '15 นิ้ว M5 · 1.51 kg', mass: 1.51, w: 0.3404, h: 0.2376, t: 0.0115 }],
    faces: [
      { id: 'mba-open', label: 'กางจอ · ฟาดด้วยมุมฝาจอ', pose: 'open', feff: 0.35, kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.3e9, hard: true, wreckE: 32, stages: [[0.0001, 'ฝาจอบุบที่มุม'], [0.2, 'จอร้าวจากมุม'], [0.4, 'จอร้าวลาม มีเส้นสีขึ้น'], [0.65, 'ปื้นดำลามจากมุม แสงไฟหลังรั่ว'], [0.85, 'ครึ่งจอดับ บานพับหลวม'], [1, 'จอดับสนิท ฝาจองอ']], mat: 'อะลูมิเนียม (ฝาจอ)', mtip: 0.15, ks: 1e6 },
      { id: 'mba-closed', label: 'พับเครื่อง · ฟาดด้วยมุมเครื่อง', pose: 'closed', feff: 0.85, kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.007, area: 'sphere', pc: 0.12e9, hard: true, wreckE: 64, stages: [[0.0001, 'มุมเครื่องบุบ'], [0.25, 'ฝาบิด ปิดไม่สนิท'], [0.5, 'จอด้านในร้าว'], [0.75, 'ตัวเครื่องงอ จอด้านในแตก'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม unibody', mtip: 0.3, ks: 2e6 }
    ] },
  // Phones: weight, size and frame material from manufacturer spec pages (Oct 2026)
  { id: 'ip18pro', name: 'iPhone 18 Pro', shape: 'phone', screen: 'oled', mass: 0.211, feff: 0.9, w: 0.150, h: 0.0719, color: '#9aa3ab',
    faces: [
      { id: 'ip18pro-corner', label: 'มุมเครื่อง (เฟรมอะลูมิเนียม)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.3e9, hard: true, wreckE: 30, stages: [[0.0001, 'กระจกหลังร้าว'], [0.25, 'มุมเฟรมบุบ จอร้าวลาม'], [0.5, 'เฟรมยุบ จอแตกละเอียด'], [0.75, 'ตัวเครื่องงอ จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม' }
    ] },
  { id: 'ip18pm', name: 'iPhone 18 Pro Max', shape: 'phone', screen: 'oled', mass: 0.249, feff: 0.9, w: 0.1634, h: 0.078, color: '#9aa3ab',
    faces: [
      { id: 'ip18pm-corner', label: 'มุมเครื่อง (เฟรมอะลูมิเนียม)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.3e9, hard: true, wreckE: 30, stages: [[0.0001, 'กระจกหลังร้าว'], [0.25, 'มุมเฟรมบุบ จอร้าวลาม'], [0.5, 'เฟรมยุบ จอแตกละเอียด'], [0.75, 'ตัวเครื่องงอ จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม' }
    ] },
  { id: 's26u', name: 'Galaxy S26 Ultra', shape: 'phone', screen: 'oled', mass: 0.214, feff: 0.9, w: 0.1636, h: 0.0781, color: '#4a4f57',
    faces: [
      { id: 's26u-corner', label: 'มุมเครื่อง (Armor Aluminum)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.3e9, hard: true, wreckE: 30, stages: [[0.0001, 'กระจกหลังร้าว'], [0.25, 'มุมเฟรมบุบ จอร้าวลาม'], [0.5, 'เฟรมยุบ จอแตกละเอียด'], [0.75, 'ตัวเครื่องงอ จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม' }
    ] },
  { id: 'fold8', name: 'Galaxy Z Fold8 (พับอยู่)', shape: 'fold', screen: 'oled', mass: 0.201, feff: 0.85, w: 0.1239, h: 0.0819, color: '#3b4048',
    faces: [
      { id: 'fold8-corner', label: 'มุมเครื่อง (Armor Aluminum)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.3e9, hard: true, wreckE: 26, stages: [[0.0001, 'จอนอกร้าว'], [0.25, 'มุมเฟรมบุบ บานพับฝืด'], [0.5, 'บานพับคลอน จอในย่น'], [0.75, 'เครื่องบิด จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม' },
      { id: 'fold8-hinge', label: 'สันบานพับ', fy: 0.5, kind: 'hertz', Eo: 90e9, nuo: 0.32, R: 0.0048, area: 'sphere', pc: 0.4e9, hard: true, wreckE: 26, stages: [[0.0001, 'จอนอกร้าว'], [0.25, 'มุมเฟรมบุบ บานพับฝืด'], [0.5, 'บานพับคลอน จอในย่น'], [0.75, 'เครื่องบิด จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'อะลูมิเนียม/เหล็ก' }
    ] },
  { id: 'ipduo', name: 'iPhone Duo (พับอยู่)', shape: 'fold', screen: 'oled', mass: 0.254, feff: 0.85, w: 0.1178, h: 0.0841, color: '#c9c2b6',
    faces: [
      { id: 'ipduo-corner', label: 'มุมเครื่อง (ไทเทเนียม เกรด 5)', kind: 'hertz', Eo: 114e9, nuo: 0.34, R: 0.004, area: 'sphere', pc: 0.5e9, hard: true, wreckE: 30, stages: [[0.0001, 'จอนอกร้าว'], [0.25, 'มุมเฟรมบุบ บานพับฝืด'], [0.5, 'บานพับคลอน จอในย่น'], [0.75, 'เครื่องบิด จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'ไทเทเนียม' },
      { id: 'ipduo-hinge', label: 'สันบานพับ (ไทเทเนียม)', fy: 0.5, kind: 'hertz', Eo: 114e9, nuo: 0.34, R: 0.0056, area: 'sphere', pc: 0.6e9, hard: true, wreckE: 32, stages: [[0.0001, 'จอนอกร้าว'], [0.25, 'มุมเฟรมบุบ บานพับฝืด'], [0.5, 'บานพับคลอน จอในย่น'], [0.75, 'เครื่องบิด จอดับ'], [1, 'พังยับ ใช้งานไม่ได้']], mat: 'ไทเทเนียม' }
    ] }
];

// ===== Underside that meets the floor (ceramic tile on concrete) =====
// cor: coefficient of restitution on tile, mu: friction against tile during the hit.
// Values are typical engineering figures for each material pair (assumptions, not measured).
// Chair: all five casters share the load on the floor, so stiffness and break load are 5x one caster.
const FLOOR_SPECS = {
  teak:     { label: 'ปลายขาไม้สัก 4 ขา', kind: 'hertz', Eo: 10e9, nuo: 0.3, R: 0.02, area: 'flat', A0: 0.01, pc: 35e6, cor: 0.30, mu: 0.45, feff: 1.0 },
  ply:      { label: 'ปลายขาไม้อัด 4 ขา', kind: 'hertz', Eo: 6e9, nuo: 0.3, R: 0.02, area: 'flat', A0: 0.008, pc: 25e6, cor: 0.28, mu: 0.45, feff: 1.0 },
  mdf:      { label: 'ขอบขาแผ่น MDF', kind: 'hertz', Eo: 2.5e9, nuo: 0.3, R: 0.01, area: 'flat', A0: 0.003, pc: 9e6, cor: 0.22, mu: 0.45, feff: 0.9 },
  chair:    { label: 'ล้อไนลอน 5 ล้อ (กลิ้งได้)', kind: 'hertz', Eo: 14e9, nuo: 0.4, R: 0.025, area: 'sphere', pc: 70e6, breakF: 17500, onBreak: 'caster', cor: 0.35, mu: 0.05, feff: 0.6, mtip: 0.4, ks: 3e5 },
  ext:      { label: 'ขอบก้นถังเหล็ก', kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.004, area: 'sphere', pc: 1.05e9, cor: 0.45, mu: 0.35, feff: 0.95 },
  paper:    { label: 'ก้นกองกระดาษ (หน้าแบน)', kind: 'hertz', Eo: 0.3e9, nuo: 0.2, R: 0.05, area: 'flat', A0: 0.06, pc: 0.6e6, cor: 0.10, mu: 0.45, feff: 0.9 },
  mug:      { label: 'ขอบก้นแก้วเซรามิก', kind: 'hertz', Eo: 70e9, nuo: 0.22, R: 0.005, area: 'sphere', pc: Infinity, breakF: 4000, cor: 0.50, mu: 0.40, feff: 1.0 },
  stapler:  { label: 'ยางรองใต้ที่เย็บ', kind: 'hertz', Eo: 0.01e9, nuo: 0.49, R: 0.008, area: 'sphere', pc: Infinity, cor: 0.40, mu: 0.70, feff: 0.9 },
  lcd:      { label: 'ยางรองใต้ฐานขาตั้ง', kind: 'hertz', Eo: 0.02e9, nuo: 0.49, R: 0.01, area: 'sphere', pc: Infinity, cor: 0.15, mu: 0.60, feff: 0.6, mtip: 0.8, ks: 3e6 },
  led:      { label: 'ยางรองใต้ฐานขาตั้ง', kind: 'hertz', Eo: 0.02e9, nuo: 0.49, R: 0.01, area: 'sphere', pc: Infinity, cor: 0.15, mu: 0.60, feff: 0.6, mtip: 0.7, ks: 3e6 },
  mouse:    { label: 'ฐานเมาส์ (ขา PTFE ลื่น)', kind: 'hertz', Eo: 2.3e9, nuo: 0.37, R: 0.02, area: 'sphere', pc: 60e6, breakF: 1500, cor: 0.35, mu: 0.15, feff: 0.9 },
  keyboard: { label: 'ยางรองใต้คีย์บอร์ด', kind: 'hertz', Eo: 0.02e9, nuo: 0.49, R: 0.01, area: 'sphere', pc: Infinity, damageF: 900, damageLabel: 'ปุ่มหลุด / เคสร้าว', cor: 0.20, mu: 0.60, feff: 0.55 },
  strip:    { label: 'ก้นรางปลั๊ก (เคส PC)', kind: 'hertz', Eo: 2.4e9, nuo: 0.37, R: 0.01, area: 'sphere', pc: 25e6, cor: 0.30, mu: 0.40, feff: 0.85 },
  dumbbell: { label: 'หน้าหกเหลี่ยมเหล็กหล่อ', kind: 'hertz', Eo: 170e9, nuo: 0.26, R: 0.01, area: 'sphere', pc: 1.0e9, cor: 0.30, mu: 0.35, feff: 0.95 },
  squishy:  { label: 'ตัวตุ๊กตาโฟม PU', kind: 'linear', K: 2.5e3, rFixed: 0.045, area: 'fixed', pc: Infinity, cor: 0.10, mu: 0.90, feff: 0.6 },
  ip18pro:  { label: 'ขอบเฟรมอะลูมิเนียม', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.3e9, cor: 0.35, mu: 0.35, feff: 0.9 },
  ip18pm:   { label: 'ขอบเฟรมอะลูมิเนียม', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.004, area: 'sphere', pc: 0.3e9, cor: 0.35, mu: 0.35, feff: 0.9 },
  s26u:     { label: 'ขอบเฟรม Armor Aluminum', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.3e9, cor: 0.35, mu: 0.35, feff: 0.9 },
  fold8:    { label: 'ขอบเฟรม Armor Aluminum', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.003, area: 'sphere', pc: 0.3e9, cor: 0.33, mu: 0.35, feff: 0.85 },
  ipduo:    { label: 'ขอบเฟรมไทเทเนียม', kind: 'hertz', Eo: 114e9, nuo: 0.34, R: 0.004, area: 'sphere', pc: 0.5e9, cor: 0.38, mu: 0.35, feff: 0.85 },
  mbp:      { label: 'ขอบล่างตัวเครื่องอะลูมิเนียม', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.007, area: 'sphere', pc: 0.12e9, cor: 0.20, mu: 0.50, feff: 0.85, mtip: 0.3, ks: 2e6 },
  mba:      { label: 'ขอบล่างตัวเครื่องอะลูมิเนียม', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.007, area: 'sphere', pc: 0.12e9, cor: 0.20, mu: 0.50, feff: 0.85, mtip: 0.3, ks: 2e6 }
};
const FLOOR_FACE = { // strike faces that change what lands on the floor
  'db-rubber': { label: 'หัวหุ้มยาง', kind: 'hertz', Eo: 0.2e9, nuo: 0.45, R: 0.05, area: 'sphere', pc: Infinity, cor: 0.55, mu: 0.80, feff: 0.95 }
};
const FLOOR_NEXT = { chair: { label: 'ฐานอะลูมิเนียม (ล้อหักแล้ว)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.006, area: 'sphere', pc: 0.54e9, cor: 0.30, mu: 0.40, feff: 0.6, mtip: 0.4, ks: 3e5 } };
function floorSpecFor(def, face, st) {
  if (st && st.casterBroken && FLOOR_NEXT[def.id]) return FLOOR_NEXT[def.id];
  return (face && FLOOR_FACE[face.id]) || FLOOR_SPECS[def.id];
}
const NEXT = {
  'chair-base': { id: 'chair-base', label: 'ฐานอะลูมิเนียม (ล้อหักแล้ว)', kind: 'hertz', Eo: 70e9, nuo: 0.33, R: 0.006, area: 'sphere', pc: 540e6, hard: true, gap: 0.015, mat: 'อะลูมิเนียม', mtip: 0.4, ks: 3e5 }
};
// EN 12600 pendulum (twin tyre, 50 kg) — calibration impactor
const EN12600 = { id: 'en12600', label: 'ตุ้มยาง EN 12600', kind: 'linear', K: 1.5e5, rFixed: 0.13, area: 'fixed', pc: Infinity, hard: false };
// Human limits
const HUMAN = { vLimb: 14, E: 150, mArm: 3, Fmax: 450 };
function vMaxFor(m, face) { return Math.min(25, (face && face.vMult || 1) * Math.min(HUMAN.vLimb, Math.sqrt(2 * HUMAN.E / (m + HUMAN.mArm)))); }
if (typeof module !== 'undefined') module.exports = { FLOOR_SPECS, floorSpecFor, OBJECTS, NEXT, EN12600, HUMAN, vMaxFor };
