// LBB Mu'allimin 2027 – Bumper Logo Motion Audio ("Tactical Minimalism" Slowmo Edition)
// Synced to 6 new user cues:
// - Radiant Solar Light Burst
// - Unified Backplate Impact Slam
// - Waving Indonesian Flag MASK for MU'ALLIMIN
// - Specular Gold Gleam for LBB
// - Stiff Pakem Lock for Flags
// - Master Lock & Tail
import fs from 'fs';
const T = (await import('./timeline_bumper.js')).default;

const SR = 44100, N = Math.floor(T.dur * SR);
const mk = () => new Float32Array(N);
const bus = { snare: [mk(), mk()], sub: [mk(), mk()], fx: [mk(), mk()] };

let seed = 2027;
const rnd = () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const nz = () => rnd() * 2 - 1;

function put(b, start, s, gain = 1, pan = 0) {
  const i0 = Math.floor(start * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4);
  const gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < s.length; i++) {
    const k = i0 + i;
    if (k < 0 || k >= N) continue;
    b[0][k] += s[i] * gl;
    b[1][k] += s[i] * gr;
  }
}
const gen = (dur, fn) => {
  const n = Math.floor(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) o[i] = fn(i / SR, i);
  return o;
};

function biquad(type, f, Q = 0.707) {
  const w = 2 * Math.PI * f / SR, a = Math.sin(w) / (2 * Q), c = Math.cos(w);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
  if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
  if (type === 'bp') { b0 = a; b1 = 0; b2 = -a; }
  a0 = 1 + a; a1 = -2 * c; a2 = 1 - a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x => {
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}

/* ---------- instruments ---------- */
function snare(v = 1) {
  const hp = biquad('hp', 1800), bp = biquad('bp', 5200, 0.6), lp = biquad('lp', 11000);
  let p1 = 0, p2 = 0; const tone = 0.92 + 0.16 * rnd();
  return gen(0.36, t => {
    const f1 = (188 + 72 * Math.exp(-t * 90)) * tone;
    p1 += 2 * Math.PI * f1 / SR;
    p2 += 2 * Math.PI * 334 * tone / SR;
    const body = Math.sin(p1) * Math.exp(-t * 24) * 0.55 + Math.sin(p2) * Math.exp(-t * 36) * 0.22;
    const n = nz(), wires = lp(bp(hp(n)) * 1.6 + hp(n) * 0.25) * Math.exp(-t * (12 + (1 - v) * 10));
    const stick = t < 0.0025 ? nz() * 0.9 : 0;
    return (body * (0.6 + 0.4 * v) + wires * 1.1 + stick * v) * v;
  });
}
const SN = []; for (let i = 0; i < 24; i++) SN.push(snare(1));
const snareAt = (t, v, pan = 0) => put(bus.snare, t, SN[Math.floor(rnd() * SN.length)], v * (0.88 + 0.12 * rnd()), pan + (rnd() - .5) * .08);
const ghostAt = (t, v, pan = 0) => put(bus.snare, t, snare(Math.max(.15, v)), v * .72, pan + (rnd() - .5) * .15);
function hitAt(t, v = 1, flam = true) { if (flam) ghostAt(t - 0.022, .32 * v); snareAt(t, v); }
function rollTo(tb, dur = 0.72, v0 = .18, v1 = .9) {
  const step = 0.032;
  const n = Math.round(dur / step);
  for (let i = 0; i < n; i++) {
    const p = i / n;
    ghostAt(tb - dur + i * step + (rnd() - .5) * .002, v0 + (v1 - v0) * p * p, (i % 2 ? 0.12 : -0.12));
  }
}

function sub(v = 1, len = 0.95) {
  let ph = 0;
  return gen(len, t => {
    ph += 2 * Math.PI * (45 + 18 * Math.exp(-t * 26)) / SR;
    return Math.sin(ph) * Math.min(1, t / 0.008) * Math.exp(-t * 3.8) * v;
  });
}
const subAt = (t, v = 1, len) => put(bus.sub, t, sub(1, len), v);

function shutter(v = 1) {
  const hpA = biquad('hp', 2400), hpB = biquad('hp', 3300); let ph = 0;
  return gen(0.14, t => {
    let s = 0;
    if (t < 0.008) s += hpA(nz()) * Math.exp(-t * 500) * 1.1;
    if (t > 0.044 && t < 0.054) s += hpB(nz()) * Math.exp(-(t - 0.044) * 600) * 0.8;
    ph += 2 * Math.PI * 145 / SR;
    s += Math.sin(ph) * Math.exp(-t * 80) * 0.35 * (t < 0.04 ? 1 : 0);
    return s * v;
  });
}

function cloth(dur = 0.26, f0 = 2400, v = 1) {
  const bp = biquad('bp', f0, 0.8), lp = biquad('lp', 6500);
  return gen(dur, t => {
    const p = t / dur;
    return lp(bp(nz())) * Math.pow(Math.sin(Math.PI * p), 1.4) * (1 - p * .35) * v * 2.1;
  });
}

// Sinar Cahaya Optical Radiant Flare Sound (airy crystalline shimmer)
function solarRayBurst(dur = 0.70, v = 1) {
  const bpHigh = biquad('bp', 4200, 1.8);
  const hpAir  = biquad('hp', 6000);
  let ph = 0;
  return gen(dur, t => {
    const p = t / dur;
    const n = nz();
    ph += 2 * Math.PI * (520 + 260 * Math.exp(-t * 8)) / SR;
    const chime = Math.sin(ph) * Math.exp(-t * 6.5) * 0.25;
    const shimmer = bpHigh(n) * Math.pow(Math.sin(Math.PI * p), 1.2) * 1.5;
    const sparkle = hpAir(n) * (t < 0.12 ? 0.8 : 0.15) * Math.exp(-t * 5);
    return (chime + shimmer + sparkle) * v;
  });
}

// Gold Specular Gleam Bell / Chime Sound for LBB
function goldGleamSfx(dur = 0.45, v = 1) {
  let p1 = 0, p2 = 0;
  return gen(dur, t => {
    p1 += 2 * Math.PI * 2640 / SR;
    p2 += 2 * Math.PI * 5280 / SR;
    const bell = (Math.sin(p1) * 0.7 + Math.sin(p2) * 0.3) * Math.exp(-t * 9.5);
    return bell * v;
  });
}

function flagWaveSfx(dur = 0.52, fAir = 950, v = 1) {
  const bpLow  = biquad('bp', fAir, 0.75);
  const bpSnap = biquad('bp', 2600, 1.1);
  const lp     = biquad('lp', 5800);
  let thumpPh = 0;
  return gen(dur, t => {
    const p = t / dur;
    const n = nz();
    const flutter = 0.58 + 0.42 * Math.sin(t * 24.0);
    const windEnv = Math.pow(Math.sin(Math.PI * p), 1.15) * (1 - p * 0.3) * flutter;
    const snapDt = t - dur * 0.26;
    const snap = snapDt > 0 && snapDt < 0.055
      ? bpSnap(n) * Math.exp(-snapDt * 68) * 1.35
      : 0;
    thumpPh += 2 * Math.PI * (115 + 50 * Math.exp(-t * 22)) / SR;
    const body = Math.sin(thumpPh) * Math.exp(-t * 18) * 0.28;
    return (lp(bpLow(n) * 1.9 * windEnv + snap) + body) * v;
  });
}

function tick(f = 2200, v = 1) {
  return gen(0.036, t => (Math.sin(2 * Math.PI * f * t) * .8 + Math.sin(2 * Math.PI * f * 2.02 * t) * .2) * Math.exp(-t * 220) * v);
}

function sheenSweep(t0, dur) {
  const n = Math.floor(dur * SR);
  const bp1 = biquad('bp', 3800, 1.4), bp2 = biquad('bp', 6200, 1.8);
  const i0 = Math.floor(t0 * SR);
  for (let i = 0; i < n; i++) {
    const k = i0 + i; if (k < 0 || k >= N) continue;
    const p = i / n;
    const env = Math.pow(Math.sin(Math.PI * p), 1.8) * 0.16;
    const pan = -0.55 + 1.1 * p;
    const x = (bp1(nz()) * 0.7 + bp2(nz()) * 0.45) * env;
    bus.fx[0][k] += x * Math.cos((pan + 1) * Math.PI / 4);
    bus.fx[1][k] += x * Math.sin((pan + 1) * Math.PI / 4);
  }
}

/* ---------- arrangement synced to timeline_bumper.js ---------- */
// Minimalist, spacious sound design (tidak rame / tidak bising)
// Only high-impact key moments are accented with clean, tactical, organic audio cues.

// Stage 1: Blueprint wireframe draw (subtle airy whisper)
put(bus.fx, T.wireOuter, cloth(0.55, 2600, 0.40), 0.25, 0);

// Stage 2: Shield Assembly & Star Zoom-In
put(bus.fx, T.shOuter, shutter(0.70), 0.35, 0);
subAt(T.shCore, 0.50, 0.65);
// Bintang tameng zoom-in (subtle airy vector reveal)
put(bus.fx, T.shRays, cloth(0.35, 1900, 0.45), 0.30, 0);

// Stage 3: SATU KESATUAN LATAR HITAM (Unified Backplate Impact Slam)
// One solid, grounded tactical latch
put(bus.fx, T.plateUnified, shutter(0.90), 0.55, 0);
subAt(T.plateUnified, 0.65, 0.55);

// Stage 4: Tulisan MU'ALLIMIN — Kibaran bendera merah-putih (smooth single cloth flutter)
put(bus.fx, T.muaWaveIn, flagWaveSfx(0.60, 950, 0.85), 0.45, 0);

// Stage 5: Tulisan LBB Emas — Single solid snap + pristine gold gleam shimmer
put(bus.fx, T.lbb[0], shutter(0.75), 0.45, 0);
subAt(T.lbb[0], 0.40, 0.35);
put(bus.fx, T.lbbGlint[0] + 0.12, goldGleamSfx(0.55, 0.65), 0.40, 0);

// Stage 6: Crossed Checkered Flags — Subtle cloth wave on entrance
put(bus.fx, T.flagCheck, flagWaveSfx(0.42, 1100, 0.70), 0.35, 0);

// Stage 7: "2027" — Soft clean metallic snap
put(bus.fx, T.year[0], tick(1800, 0.75), 0.22, 0);

// Stage 8: Bendera Merah Putih — Smooth unfurl into crisp pakem stop
put(bus.fx, T.flagMp, flagWaveSfx(0.52, 900, 0.80), 0.45, 0);
put(bus.fx, T.flagMpSettle, tick(1600, 0.60), 0.18, 0);

// Clean cinematic riser (low-frequency tension swell instead of noisy snare roll)
const riserDur = 0.60;
const riserStart = T.lock - riserDur;
const riserN = Math.floor(riserDur * SR);
const rlp = biquad('lp', 380);
for (let i = 0; i < riserN; i++) {
  const p = i / riserN;
  const env = Math.pow(p, 2.2) * 0.28;
  const k = Math.floor(riserStart * SR) + i;
  if (k >= 0 && k < N) {
    const s = rlp(nz()) * env;
    bus.sub[0][k] += s;
    bus.sub[1][k] += s;
  }
}

// Stage 9: MASTER IDENT LOCK (4.90s) — Authoritative, crisp, heroic tactical hit
hitAt(T.lock, 0.90, false);
subAt(T.lock, 1.10, 1.20);
sheenSweep(T.sweep[0], 1.20);

// Outro Hit at 7.10s
put(bus.fx, T.outroHit, tick(1400, 0.50), 0.18, 0);
subAt(T.outroHit, 0.35, 0.45);
put(bus.fx, T.brackets, shutter(1.0), 0.62, 0);

sheenSweep(T.sweep[0], T.sweep[1] - T.sweep[0]);

[5.60, 6.40].forEach(t => subAt(t, 0.42, 0.65));
ghostAt(5.60, 0.24, -0.1);
ghostAt(6.00, 0.20, 0.1);
ghostAt(6.40, 0.26, -0.1);
for (let i = 0; i < 16; i++) {
  put(bus.fx, T.caption + i * 0.055, tick(2450 + (i % 3) * 80, 0.55), 0.08, (i % 2 ? 0.18 : -0.18));
}

// Closing authoritative rim/sub accent before fade-out
hitAt(T.outroHit, 0.85, true);
subAt(T.outroHit, 0.88, 0.75);

/* ---------- mix & master ---------- */
const ER = [[0.0113, .16], [0.0171, .12], [0.0237, .09], [0.0311, .06]];
const room = [mk(), mk()];
for (let ch = 0; ch < 2; ch++) {
  const lp = biquad('lp', 5000);
  for (let i = 0; i < N; i++) {
    let s = 0;
    ER.forEach(([d, g], k) => {
      const j = i - Math.floor((d + (ch ? .0013 * k : 0)) * SR);
      if (j >= 0) s += bus.snare[ch][j] * g;
    });
    room[ch][i] = lp(s);
  }
}

const subLP = [biquad('lp', 120), biquad('lp', 120)];
const out = [mk(), mk()];
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, Math.max(0, (T.dur - t) / 0.50));
  const fin = Math.min(1, t / 0.02);
  for (let ch = 0; ch < 2; ch++) {
    const x = bus.snare[ch][i] * .92 + room[ch][i] + subLP[ch](bus.sub[ch][i]) * 1.25 + bus.fx[ch][i];
    out[ch][i] = Math.tanh(x * .44) * fade * fin;
  }
}

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[0][i]), Math.abs(out[1][i]));
const g = .90 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(out[0][i] * g * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(out[1][i] * g * 32767), 46 + i * 4);
}
fs.writeFileSync(new URL('./audio_bumper.wav', import.meta.url), buf);
console.log('audio_bumper.wav written:', T.dur + 's', 'peak before norm', peak.toFixed(2));
