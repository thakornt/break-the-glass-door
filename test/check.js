// CI guard: the model must still agree with the standards it was calibrated against.
const C = require('../src/core.js'), O = require('../src/objects.js');
const ball = { id: 'ball', kind: 'hertz', Eo: 200e9, nuo: 0.3, R: 0.019, area: 'sphere', pc: 2e9, hard: true };
const face = id => { const o = O.OBJECTS.find(o => o.faces.some(f => f.id === id)); return [o, o.faces.find(f => f.id === id)]; };
function rate(me, v, spec, type, t, N = 60) {
  let b = 0;
  for (let i = 0; i < N; i++) {
    const r = C.simulateImpact({ me, v0: v, spec, next: O.NEXT, objState: {}, glass: { type, t, flaws: [] }, hidden: C.sampleGlassStrength(type), u: 0.5, v: 0.45 });
    if (r.glassBroken) b++;
  }
  return b / N;
}
const [teak, teakF] = face('teak-corner'), [paper, paperF] = face('paper-corner');
const checks = [
  ['ECE R43: tempered 5 mm survives 227 g ball from 2 m', () => rate(0.227, Math.sqrt(2 * 9.81 * 2), ball, 'tempered', 0.005), p => p < 0.1],
  ['ECE R43: annealed 4 mm breaks under 227 g ball from 2 m', () => rate(0.227, Math.sqrt(2 * 9.81 * 2), ball, 'annealed', 0.004), p => p > 0.9],
  ['EN 12600: tempered 10 mm mostly survives 1,200 mm drop', () => rate(50, Math.sqrt(2 * 9.81 * 1.2), O.EN12600, 'tempered', 0.010), p => p < 0.2],
  ['Paper ream does not break tempered 10 mm', () => rate(paper.mass * paper.feff, O.vMaxFor(paper.mass), paperF, 'tempered', 0.010), p => p < 0.05],
  ['Solid teak corner at full swing can break tempered 10 mm, not always', () => rate(teak.mass * teak.feff, O.vMaxFor(teak.mass), teakF, 'tempered', 0.010, 100), p => p > 0.03 && p < 0.7],
];
let fail = 0;
for (const [name, run, ok] of checks) {
  const p = run(); const pass = ok(p);
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  (break rate ${(p * 100).toFixed(0)}%)`);
  if (!pass) fail++;
}
process.exit(fail ? 1 : 0);
