// ===== Glass impact physics core (SI units) =====
const G = {
  E: 70e9, nu: 0.22, rho: 2500, KIC: 0.75e6, Y: 1.12,
  wm: 7, ws0: 68.8e6,          // Weibull: 5% fractile = 45 MPa (EN 572 annealed characteristic)
  beta: 0.43,                  // Roark rectangular plate, concentrated load
  gamma: 0.2,                  // large-deflection stiffening (assumption, framed panel)
  cm: 0.25,                    // membrane stress coefficient (assumption)
  zeta: 0.03,                  // plate damping ratio
  chi: 0.04,                   // Roesler cone-crack constant (tuned, literature range)
  Aaub: 1.5e5,                 // Auerbach constant N/m (cone crack threshold F = A*R)
  frontFactor: 0.4,            // front-face flaw sees rebound tension (assumption)
  fatigue: 0.25,               // contact-fatigue growth per repeat hard hit (assumption)
  coneSin: 0.375,              // cone crack runs ~22° to surface -> depth = 0.375 * length
  Aref: 0.2, sizeCap: 2.0,     // Weibull size effect: strength x (Aref/Aeff)^(1/m), capped
  kdMin: 0.22, kdTau: 5e-4       // short-pulse stress factor: kd = kdMin + (1-kdMin)(1-e^(-τ/kdTau)) (calibrated to ECE R43)
};
const PANEL = { a: 0.9, b: 2.1, y0: 0.06 };

function plateProps(t) {
  const D = G.E * t ** 3 / (12 * (1 - G.nu ** 2));
  const alpha = 0.0167; // Timoshenko, simply supported, b/a ~ 2.3
  const Kc = D / (alpha * PANEL.a ** 2);
  const w1 = Math.PI ** 2 * (1 / PANEL.a ** 2 + 1 / PANEL.b ** 2) * Math.sqrt(D / (G.rho * t));
  const sqrtDrh = Math.sqrt(D / (G.rho * t));
  const Z = 8 * Math.sqrt(D * G.rho * t);           // infinite-plate point impedance
  const tauR = (PANEL.a / 2) ** 2 / sqrtDrh / 4;      // time for flexural wave to feel the frame
  return { D, Kc, Mc: Kc / (w1 * w1), w1, sqrtDrh, Z, tauR };
}
function phi2(u, v) { return Math.max(0.04, Math.sin(Math.PI * u) ** 2 * Math.sin(Math.PI * v) ** 2); }
function edgeDist(u, v) { return Math.min(u * PANEL.a, (1 - u) * PANEL.a, v * PANEL.b, (1 - v) * PANEL.b); }
function sigmaCeff(sc, d) { return sc * (0.7 + 0.3 * Math.min(1, d / 0.08)); } // edge weakening (assumption)
function hertzK(E2, nu2, R) { const Es = 1 / ((1 - G.nu ** 2) / G.E + (1 - nu2 ** 2) / E2); return 4 / 3 * Es * Math.sqrt(R); }

function randn() { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function sampleGlassStrength(type) {
  const sf0 = G.ws0 * Math.pow(-Math.log(1 - Math.random()), 1 / G.wm);
  const sc = type === 'tempered' ? Math.min(120e6, Math.max(75e6, 95e6 + 8e6 * randn())) : 0;
  return { sf0, sc };
}

// Build a contact law from spec + object strike state
function makeLaw(spec, st) {
  const L = Object.assign({}, spec);
  const crushPrev = st ? st.crush || 0 : 0;
  L.crushPrev = crushPrev;
  if (L.kind === 'hertz') {
    let R = L.R;
    if (L.area === 'corner') R = Math.max(R, Math.sqrt((L.A0 + L.g * crushPrev ** 2) / Math.PI));
    if (L.area === 'sphere') R = R + crushPrev * 0.5;
    L.Reff = R; L.K = hertzK(L.Eo, L.nuo, R); L.n = 1.5;
  } else { L.n = 1; L.Reff = L.rFixed || 0.05; }
  return L;
}
function areaOf(L, dTot) {
  if (L.area === 'corner') return L.A0 + L.g * dTot * dTot;
  if (L.area === 'sphere') return 2 * Math.PI * L.Reff * Math.max(dTot, 1e-7);
  if (L.area === 'flat') return L.A0;
  return Math.PI * (L.rFixed || 0.05) ** 2;
}

function solveCone(F, t, sc) {
  // depth c where chi*F/c^1.5 - Y*sc*sqrt(pi c) = KIC (decreasing in c)
  // c = cone length; depth = coneSin * c. residual compression acts on depth.
  const f = c => G.chi * F / c ** 1.5 - G.Y * sc * Math.sqrt(Math.PI * G.coneSin * c) - G.KIC;
  let lo = 1e-6, hi = t / G.coneSin;
  if (f(hi) > 0) return t;
  for (let i = 0; i < 60; i++) { const m = Math.sqrt(lo * hi); if (f(m) > 0) lo = m; else hi = m; }
  return Math.min(t, lo * G.coneSin);
}

/* Run one impact.
 p = { me, v0, spec, next, objState, glass:{type,t,flaws}, hidden:{sf0,sc}, u, v, dry }
 Returns detailed result; if !dry mutates glass.flaws & objState */
function simulateImpact(p) {
  const { me, v0, glass, u, v } = p;
  const t = glass.t, tempered = glass.type === 'tempered';
  const pl = plateProps(t), f = phi2(u, v);
  const K = pl.Kc / f, M = pl.Mc / f, cdamp = 2 * G.zeta * Math.sqrt(K * M), wp = Math.sqrt(K / M);
  const Rinf0 = 2 * PANEL.a / Math.PI;
  const dEdge = edgeDist(u, v);
  const st = p.objState || {};
  let law = makeLaw(p.spec, st), lawName = p.spec.id, switched = false, destroyed = false;
  let x = 0, vx = v0, w = 0, wv = 0, wl = 0, dp = 0, off = 0;
  const ks = p.spec.ks || 0, mtip = ks ? Math.min(p.spec.mtip || 0.5, me * 0.5) : 0;
  const mb = me - mtip; let xb = 0, vb = v0; // bulk mass behind structural spring
  const csd = ks ? 2 * 0.08 * Math.sqrt(ks * mtip) : 0;
  let tt = 0, tc0 = null, tEnd = null, Fmax = 0, FmaxHard = 0, sigMax = 0, wmax = 0, Eabs = 0, rAtF = 0;
  const flaws = glass.flaws;
  const near = flaws.map(fl => ({ fl, d: Math.hypot((fl.u - u) * PANEL.a, (fl.v - v) * PANEL.b), smax: 0 }));
  const dt = me < 2 ? 2.5e-7 : 1e-6;
  const crushStart = law.crushPrev;
  let maxCrushHere = 0; let dbg = null; let objDamaged = null; let tOn = null, prevOn = false; let aEffR = 0.1;
  const steps = Math.floor(0.09 / dt);
  for (let i = 0; i < steps; i++) {
    let F = 0, r = 0;
    if (!destroyed) {
      const d = x - (w + wl) - off;
      if (d > dp) {
        const de = d - dp;
        const Fel = law.K * Math.pow(de, law.n);
        F = Fel;
        if (law.pc < Infinity) {
          const A = areaOf(law, law.crushPrev + d);
          const Fc = law.pc * A;
          if (Fel > Fc) {
            F = Fc;
            const ndp = d - Math.pow(Fc / law.K, 1 / law.n);
            if (ndp > dp) { Eabs += F * (ndp - dp); dp = ndp; }
            r = Math.sqrt(A / Math.PI);
          }
        }
        if (!r) {
          const rh = law.kind === 'hertz' ? Math.sqrt(law.Reff * de) : law.rFixed;
          const rc = law.pc < Infinity && (dp > 0 || law.crushPrev > 0) ? Math.sqrt(areaOf(law, law.crushPrev + dp) / Math.PI) : 0;
          r = Math.max(rh, rc);
        }
        if (law.damageF && F > law.damageF && !objDamaged) objDamaged = law.damageLabel || 'เสียหาย';
        if (law.breakF && F > law.breakF) {
          F = law.breakF;
          if (law.next) { // e.g. caster snaps -> aluminium base
            Eabs += 0.5 * F * de; // fracture work approx
            const nx = p.next[law.next];
            law = makeLaw(nx, st.sub || {}); lawName = nx.id; switched = true;
            off = x - (w + wl) + (nx.gap || 0); dp = 0;
          } else { destroyed = true; Eabs += 0.5 * F * de; }
        }
        if (dp > maxCrushHere) maxCrushHere = dp;
      }
    }
    if (F > 0) { if (tc0 === null) tc0 = tt; if (!prevOn) tOn = tt; tEnd = tt; }
    prevOn = F > 0;
    if (F > Fmax) { Fmax = F; rAtF = r; }
    if (F > 0 && law.hard && F > FmaxHard) FmaxHard = F;
    // stresses
    const tau = tOn === null ? 0 : tt - tOn + dt;
    const Rw = 2 * Math.sqrt(tau * pl.sqrtDrh);
    const Rinf = Math.min(Rinf0, Math.max(Rw, 3 * t));
    const kd = G.kdMin + (1 - G.kdMin) * (1 - Math.exp(-tau / G.kdTau));
    const rr = r || 1e-4;
    const rp = rr < 1.7 * t ? Math.sqrt(1.6 * rr * rr + t * t) - 0.675 * t : rr;
    const pre = 3 * F / (2 * Math.PI * t * t);
    const sLoc = F > 0 ? kd * pre * Math.max(0, (1 + G.nu) * Math.log(Rinf / rp) + G.beta) : 0;
    const sMode = G.E * t / (2 * (1 - G.nu ** 2)) * Math.PI ** 2 * (1 / PANEL.a ** 2 + G.nu / PANEL.b ** 2) * Math.abs(w) / Math.sqrt(f);
    const sMem = G.cm * G.E * (w / PANEL.a) ** 2;
    const sTot = Math.max(sLoc, sMode) + sMem;
    if (sTot > sigMax) { sigMax = sTot; aEffR = sLoc >= sMode ? Math.pow(Rinf, 0.2) * Math.pow(rp, 0.8) : 0.25 * PANEL.a; dbg = { tau, F, r: rr, rp, sLoc, sMode, sMem, kd, Rinf, law: lawName }; }
    for (const n of near) {
      const rl = Math.max(rp, n.d);
      const sl = F > 0 ? kd * pre * Math.max(0, (1 + G.nu) * Math.log(Rinf / rl) + G.beta) : 0;
      const s = Math.max(sl, sMode) + sMem;
      if (s > n.smax) n.smax = s;
    }
    // dynamics (semi-implicit Euler)
    const Fp = K * w * (1 + G.gamma * (w / t) ** 2) + cdamp * wv;
    wv += (F - Fp) / M * dt; w += wv * dt;
    wl += (F / pl.Z - wl / pl.tauR) * dt;
    if (!destroyed) {
      if (ks) {
        const Fs = ks * (xb - x) + csd * (vb - vx);
        vx += (Fs - F) / mtip * dt; vb += -Fs / mb * dt;
        x += vx * dt; xb += vb * dt;
      } else { vx += -F / me * dt; x += vx * dt; }
    }
    if (Math.abs(w) > wmax) wmax = Math.abs(w);
    tt += dt;
    if (tEnd !== null && tt - tEnd > Math.PI / wp && (destroyed || (vx < wv && (!ks || vb < wv)))) break;
    if (tc0 === null && tt > 0.02) break;
  }

  // ---------- damage evaluation ----------
  const hid = p.hidden;
  const scLoc = tempered ? sigmaCeff(hid.sc, dEdge) : 0;
  const dc = 0.21 * t;
  const sizeF = Math.min(G.sizeCap, Math.max(1, Math.pow(G.Aref / (Math.PI * aEffR * aEffR), 1 / G.wm)));
  const res = {
    v0, me, Ein: 0.5 * me * v0 * v0, Fmax, sigMax, wmax, Eabs, vOut: ks ? (mtip * vx + mb * vb) / me : vx, destroyed, switched, lawName,
    crushAdd: maxCrushHere, dbg, objDamaged, contactTime: tc0 === null ? 0 : (tEnd - tc0),
    glassBroken: false, breakCause: '', newFlaw: null, flawMaxRatio: 0, coneDepth: 0, dc, tempered,
    strengthRatio: sigMax / (hid.sf0 * sizeF + scLoc), sizeF, frame: false
  };
  const R = law.Reff;
  let newFlaw = null;
  if (law.hard && FmaxHard > G.Aaub * R) {
    const c = solveCone(FmaxHard, t, scLoc) * (p.dry ? 1 : Math.exp(0.2 * randn()));
    if (c > 2e-5) {
      res.coneDepth = c; res.coneSingle = c;
      // contact fatigue: repeat hard hit near an existing flaw deepens it (assumption)
      let host = null;
      for (const n of near) if (n.d < 0.012 && n.fl.face === 'front') { if (!host || n.fl.c > host.fl.c) host = n; }
      if (host) {
        // repeat hard hit on the same spot: chipping / contact fatigue adds a fraction of this hit's own depth (assumption)
        const cOld = host.fl.c;
        const noise = Math.exp(0.3 * randn());
        const cNew = Math.min(t, Math.max(c, cOld + G.fatigue * c * noise));
        res.coneDepth = cNew;
        newFlaw = { ref: host.fl, c: cNew };
      } else newFlaw = { u, v, c, face: 'front', n: 1 };
    }
  }
  if (newFlaw) {
    const cc = newFlaw.c;
    if (tempered && cc >= dc) { res.glassBroken = true; res.breakCause = 'รอยร้าวทะลุชั้นผิวอัดแรง → แตกทั้งบาน'; }
    if (!tempered && cc >= 0.8 * t) { res.glassBroken = true; res.breakCause = 'รอยร้าวกรวยทะลุความหนา'; }
  }
  // background (back face) bending fracture
  if (!res.glassBroken && sigMax >= hid.sf0 * sizeF + scLoc) {
    res.glassBroken = true;
    res.breakCause = tempered ? 'แรงดัดเกินกำลัง (ผิวอัดแรง + เนื้อกระจก)' : 'แรงดัดเกินกำลังกระจก';
  }
  // existing flaws loaded in bending
  const checkFlaw = (fl, smax, cOverride) => {
    const c = cOverride || fl.c;
    const dE = edgeDist(fl.u, fl.v);
    const sc = tempered && c < dc ? sigmaCeff(hid.sc, dE) : 0;
    const s = smax * (fl.face === 'front' ? G.frontFactor : 1) - sc;
    const Kf = s > 0 ? G.Y * s * Math.sqrt(Math.PI * c) : 0;
    return Kf / G.KIC;
  };
  for (const n of near) {
    const ratio = checkFlaw(n.fl, n.smax, newFlaw && newFlaw.ref === n.fl ? newFlaw.c : 0);
    if (ratio > res.flawMaxRatio) res.flawMaxRatio = ratio;
  }
  if (newFlaw && !newFlaw.ref) {
    const ratio = checkFlaw(newFlaw, sigMax, 0);
    if (ratio > res.flawMaxRatio) res.flawMaxRatio = ratio;
  }
  if (!res.glassBroken && res.flawMaxRatio >= 1) {
    res.glassBroken = true;
    res.breakCause = tempered ? 'รอยตำหนิเดิมถูกแรงดัดขยาย → แตกทั้งบาน' : 'รอยร้าวเดิมลามจนแตก';
  }
  res.newFlaw = newFlaw;
  res.dEdge = dEdge; res.sizeF = sizeF;
  res.flawLoads = near.map(n => ({ c: newFlaw && newFlaw.ref === n.fl ? newFlaw.c : n.fl.c, face: n.fl.face, dE: edgeDist(n.fl.u, n.fl.v), smax: n.smax }));
  if (newFlaw && !newFlaw.ref) res.flawLoads.push({ c: newFlaw.c, face: 'front', dE: dEdge, smax: sigMax });
  if (!p.dry) {
    if (newFlaw) {
      if (newFlaw.ref) { newFlaw.ref.c = newFlaw.c; newFlaw.ref.n = (newFlaw.ref.n || 1) + 1; }
      else flaws.push(newFlaw);
    }
    if (switched) { st.casterBroken = true; st.sub = st.sub || {}; st.sub.crush = (st.sub.crush || 0) + maxCrushHere; }
    else st.crush = (st.crush || 0) + maxCrushHere;
    if (destroyed) st.destroyed = true;
    if (objDamaged) st.damaged = objDamaged;
    if (p.spec.wreckE) { // cumulative wear of the object itself (assumption: share of non-returned energy)
      const keOut = 0.5 * me * res.vOut * res.vOut;
      const work = (Eabs + 0.4 * Math.max(0, res.Ein - keOut - Eabs)) * Math.exp(0.2 * randn()); // hit-to-hit scatter
      st.wear = Math.min(1, (st.wear || 0) + work / p.spec.wreckE);
      res.wear = st.wear; res.wearAdd = work / p.spec.wreckE;
      const stg = (p.spec.stages || []).filter(s => st.wear >= s[0]).pop();
      if (stg) { st.damaged = stg[1]; res.objDamaged = stg[1]; }
      if (st.wear >= 1) st.wrecked = true;
    }
    st.hits = (st.hits || 0) + 1;
  }
  return res;
}

// Probability that the same impact breaks the glass, given glass survived all history
function flawRatioFor(fl, sc, tempered, t) {
  const dc = 0.21 * t;
  const scl = tempered && fl.c < dc ? sigmaCeff(sc, fl.dE) : 0;
  const s = fl.smax * (fl.face === 'front' ? G.frontFactor : 1) - scl;
  return s > 0 ? G.Y * s * Math.sqrt(Math.PI * fl.c) / G.KIC : 0;
}
function predictBreak(p, history, N = 4000) {
  const tempered = p.glass.type === 'tempered';
  const r0 = simulateImpact(Object.assign({}, p, { dry: true,
    objState: JSON.parse(JSON.stringify(p.objState || {})), hidden: { sf0: 1e12, sc: 95e6 } }));
  const t = p.glass.t, dc = 0.21 * t, dE = r0.dEdge;
  let kept = 0, broke = 0;
  for (let i = 0; i < N; i++) {
    const s = sampleGlassStrength(p.glass.type);
    let ok = true;
    for (const h of history) { if (h.sigMax >= s.sf0 * h.sizeF + (tempered ? sigmaCeff(s.sc, h.dEdge) : 0)) { ok = false; break; } }
    if (!ok) continue;
    kept++;
    let b = r0.sigMax >= s.sf0 * r0.sizeF + (tempered ? sigmaCeff(s.sc, dE) : 0);
    if (!b && r0.newFlaw) { const c = r0.newFlaw.c; if (tempered ? c >= dc : c >= 0.8 * t) b = true; }
    if (!b) for (const fl of r0.flawLoads) if (flawRatioFor(fl, s.sc, tempered, t) >= 1) { b = true; break; }
    if (b) broke++;
  }
  return { p: kept ? broke / kept : null, kept, sig: r0.sigMax, F: r0.Fmax };
}

if (typeof module !== 'undefined') module.exports = { G, PANEL, plateProps, simulateImpact, sampleGlassStrength, predictBreak, flawRatioFor, hertzK, edgeDist, solveCone };
