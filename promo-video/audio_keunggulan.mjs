// Audio Synthesizer v3 (Kinetic Tactile SFX ONLY — ZERO MUSIC / NO SNARE)
// Punchy, high-energy non-musical sound effects synced to every visual slam, blade slice,
// odometer roll, radar sweep, marching step, roster swap, and leaderboard overtake!
import fs from 'fs';
const T = (await import('./timeline_keunggulan.js')).default;
const SR = 44100, N = Math.floor(T.dur * SR);
const mk = () => new Float32Array(N);
const fx = [mk(), mk()];

let seed = 202733;
const rnd = () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const nz = () => rnd() * 2 - 1;

function put(start, s, gain = 1, pan = 0) {
  const i0 = Math.floor(start * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4);
  const gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < s.length; i++) {
    const k = i0 + i;
    if (k < 0 || k >= N) continue;
    fx[0][k] += s[i] * gl;
    fx[1][k] += s[i] * gr;
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

/* ---------- Kinetic SFX Instruments ---------- */

// Heavy Mechanical Stamp / Shutter Thud
function slamShutter(v = 1) {
  const hp = biquad('hp', 2200), lp = biquad('lp', 280);
  let ph = 0;
  return gen(0.18, t => {
    ph += 2 * Math.PI * (68 + 90 * Math.exp(-t * 55)) / SR;
    const thud = Math.sin(ph) * Math.exp(-t * 24) * 0.75 + lp(nz()) * Math.exp(-t * 30) * 0.4;
    const click = (t < 0.01 ? hp(nz()) * Math.exp(-t * 450) * 1.1 : 0) +
                  (t > 0.038 && t < 0.052 ? hp(nz()) * Math.exp(-(t - 0.038) * 550) * 0.75 : 0);
    return (thud + click) * v;
  });
}

// Diagonal Transition Swoosh
function transitionWhoosh(dur = 0.34, v = 1) {
  return gen(dur, t => {
    const p = t / dur;
    const f = 500 + 2800 * Math.sin(Math.PI * p);
    const bp = Math.sin(2 * Math.PI * f * t * 0.05);
    return nz() * Math.pow(Math.sin(Math.PI * p), 1.8) * (0.65 + 0.35 * bp) * v * 0.55;
  });
}

// Razor Blade Slice SFX (for slicing "PRINT BERKAS / CETAK FOTO / TEMPEL FOTO")
function bladeSlice(v = 1) {
  const hp = biquad('hp', 2600), bp = biquad('bp', 4400, 1.8);
  let ph = 0;
  return gen(0.24, t => {
    const p = t / 0.24;
    ph += 2 * Math.PI * (3400 - 1800 * p) / SR;
    const zing = Math.sin(ph) * Math.exp(-t * 22) * 0.45;
    const air = (hp(nz()) * 0.5 + bp(nz()) * 1.2) * Math.sin(Math.PI * Math.min(1, t / 0.16)) * Math.exp(-t * 9);
    return (zing + air) * v;
  });
}

// Card / Kinetic Slide
function slideSwish(dur = 0.2, v = 1) {
  const bp = biquad('bp', 2400, 0.8), lp = biquad('lp', 6500);
  return gen(dur, t => {
    const p = t / dur;
    return lp(bp(nz())) * Math.pow(Math.sin(Math.PI * p), 1.4) * v * 1.9;
  });
}

// Elastic Swap Zip (Roster rotation & Leaderboard overtake)
function swapZip(v = 1) {
  let ph = 0;
  return gen(0.26, t => {
    const f = 520 + 1350 * Math.pow(t / 0.26, 1.5);
    ph += 2 * Math.PI * f / SR;
    return Math.sin(ph) * Math.sin(Math.PI * (t / 0.26)) * 0.38 * v;
  });
}

// Crisp Mechanical Odometer / Pop Tick
function tick(f = 2400, v = 1) {
  return gen(0.03, t =>
    (Math.sin(2 * Math.PI * f * t) * 0.8 + Math.sin(2 * Math.PI * f * 2.03 * t) * 0.2) *
    Math.exp(-t * 260) * v
  );
}

// Boot Step on Field Trial Blueprint
function bootStep(v = 1) {
  const lp = biquad('lp', 450), bp = biquad('bp', 1600, 1.2);
  let ph = 0;
  return gen(0.12, t => {
    ph += 2 * Math.PI * (82 + 40 * Math.exp(-t * 65)) / SR;
    return (Math.sin(ph) * Math.exp(-t * 38) * 0.55 + bp(nz()) * Math.exp(-t * 80) * 0.4 + lp(nz()) * Math.exp(-t * 45) * 0.25) * v;
  });
}

// Confirmation Chime / Trophy Ding
function ding(f = 3100, v = 1) {
  return gen(0.32, t =>
    (Math.sin(2 * Math.PI * f * t) * 0.72 + Math.sin(2 * Math.PI * (f * 1.5) * t) * 0.28) *
    Math.exp(-t * 15) * v
  );
}

/* ---------- Sync SFX to v3 Timeline ---------- */

// 1. Diagonal Cut Whooshes + Shutters
T.cuts.forEach((c, i) => put(c - 0.04, transitionWhoosh(0.34, 1), 0.42, i % 2 ? 0.25 : -0.25));
T.shutters.forEach((t, i) => put(t - 0.005, slamShutter(0.95), 0.55, i % 2 ? 0.2 : -0.2));

// 2. Kinetic Slides
T.slides.forEach((t, i) => put(t - 0.02, slideSwish(0.2, 1), 0.34, i % 2 ? 0.3 : -0.3));

// 3. Razor Blade Slices (Price slash + Paperless word slices)
T.slashes.forEach((t, i) => put(t, bladeSlice(1), 0.52, i % 2 ? 0.25 : -0.25));

// 4. Roster & Leaderboard Overtake Zips
T.swaps.forEach((t, i) => put(t, swapZip(1), 0.44, i % 2 ? -0.25 : 0.25));

// 5. Odometer Drum Ticks
T.odoTicks.forEach((t, i) => put(t, tick(1900 + (i % 12) * 90, 0.85), 0.18, 0));

// 6. Countdown Bomb Ticks in Scene 0 (1.6s -> 3.9s)
for (let t = T.s0.timer; t < 3.9; t += 0.25) {
  put(t, tick(2950, 0.7), 0.14, 0);
}

// 7. Radar Ping + Marching Cadence Steps in Scene 3 (13.3s -> 15.6s)
put(13.2, ding(2400, 0.7), 0.2, -0.2);
put(14.6, ding(2400, 0.7), 0.2, 0.2);
T.marchSteps.forEach((t, i) => put(t, bootStep(0.9), 0.36, i % 2 ? 0.18 : -0.18));

// 8. Pop-in Ticks (Trophies, Score Cells, Contact Rows)
T.popTicks.forEach((t, i) => put(t, tick(2100 + (i % 6) * 140, 0.9), 0.2, (i % 3 - 1) * 0.22));

// 9. Upload Progress Ticks in Scene 5
[0, 1, 2].forEach(i => {
  const t0 = T.s5.phone + 0.18 + i * 0.22;
  for (let k = 0; k < 5; k++) put(t0 + k * 0.06, tick(2600 + k * 180, 0.6), 0.12, 0);
});

// 10. Trophy & Stamp Dings
T.dings.forEach(t => {
  put(t, ding(3050, 1), 0.26, 0);
  put(t + 0.045, ding(4200, 0.65), 0.16, 0);
});

// 11. QR Matrix Scan Ticks
for (let r = 0; r < 10; r++) {
  put(T.s7.qr[0] + r * (T.s7.qr[1] - T.s7.qr[0]) / 10, tick(2200 + r * 50, 0.75), 0.14, 0);
}

/* ---------- Master Output (WAV 16-bit Stereo 44.1kHz) ---------- */
const out = [mk(), mk()];
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, Math.max(0, (T.dur - t) / 0.4));
  const fin = Math.min(1, t / 0.01);
  for (let ch = 0; ch < 2; ch++) {
    const x = fx[ch][i] * 1.5;
    out[ch][i] = Math.tanh(x * 0.78) * fade * fin;
  }
}

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[0][i]), Math.abs(out[1][i]));
const g = peak > 0 ? 0.89 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(out[0][i] * g * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(out[1][i] * g * 32767), 46 + i * 4);
}
fs.writeFileSync(new URL('./audio_keunggulan.wav', import.meta.url), buf);
console.log('audio_keunggulan.wav v3 written:', T.dur + 's (SFX Only)', 'peak before norm:', peak.toFixed(2));
