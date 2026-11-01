// Audio Synthesizer: "Panduan Teknis Lapangan & Aturan Main" (SFX ONLY — ZERO MUSIC / NO SNARE)
// Synthesizes authentic referee pea whistle (1x & 2x long), stopwatch ticks, camera shutters,
// paper slides, tactical footsteps, warning buzz + flag swoosh, and UI ticks.
import fs from 'fs';
const T = (await import('./timeline_teknis.js')).default;
const SR = 44100, N = Math.floor(T.dur * SR);
const mk = () => new Float32Array(N);
const fx = [mk(), mk()];

let seed = 202709;
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

/* ---------- SFX Generators ---------- */

// Camera / Mechanical Shutter Click
function shutter(v = 1) {
  const hpA = biquad('hp', 2400), hpB = biquad('hp', 3100);
  let ph = 0;
  return gen(0.12, t => {
    let s = 0;
    if (t < 0.008) s += hpA(nz()) * Math.exp(-t * 500) * 1.1;
    if (t > 0.044 && t < 0.055) s += hpB(nz()) * Math.exp(-(t - 0.044) * 600) * 0.8;
    ph += 2 * Math.PI * 145 / SR;
    s += Math.sin(ph) * Math.exp(-t * 95) * 0.32 * (t < 0.04 ? 1 : 0);
    return s * v;
  });
}

// Card / Paper Slide
function paper(dur = 0.25, v = 1) {
  const bp = biquad('bp', 2600, 0.75), lp = biquad('lp', 6200);
  return gen(dur, t => {
    const p = t / dur;
    return lp(bp(nz())) * Math.pow(Math.sin(Math.PI * p), 1.5) * (1 - p * 0.35) * v * 2.1;
  });
}

// Crisp Digital UI Tick
function tick(f = 2300, v = 1) {
  return gen(0.032, t =>
    (Math.sin(2 * Math.PI * f * t) * 0.8 + Math.sin(2 * Math.PI * f * 2.02 * t) * 0.2) *
    Math.exp(-t * 250) * v
  );
}

// Authentic Timekeeper Referee Pea Whistle (dual chamber + pea trill + air breath)
function whistle(dur = 1.0, v = 1) {
  const airBP = biquad('bp', 3100, 2.2);
  let p1 = 0, p2 = 0, peaPh = 0;
  return gen(dur, t => {
    const atk = Math.min(1, t / 0.028);
    const rel = t > dur - 0.07 ? Math.max(0, (dur - t) / 0.07) : 1;
    const env = atk * rel;
    // Pea trill (~36 Hz rotation inside whistle chamber)
    peaPh += 2 * Math.PI * (35 + 4 * Math.sin(t * 9)) / SR;
    const trill = 0.72 + 0.28 * Math.sin(peaPh);
    const bend = 1 + 0.022 * (1 - Math.exp(-t * 22)) - (t > dur - 0.07 ? 0.015 * ((t - (dur - 0.07)) / 0.07) : 0);
    const f1 = 2780 * bend + 18 * Math.sin(peaPh);
    const f2 = 3045 * bend - 14 * Math.cos(peaPh);
    p1 += 2 * Math.PI * f1 / SR;
    p2 += 2 * Math.PI * f2 / SR;
    const tone = (Math.sin(p1) * 0.58 + Math.sin(p2) * 0.42 + Math.sin(p1 * 2) * 0.08) * trill;
    const breath = airBP(nz()) * 0.28;
    return (tone + breath) * env * v;
  });
}

// Tactical Boot Footstep Thud
function footstep(v = 1) {
  const lp = biquad('lp', 420), bp = biquad('bp', 1500, 1.1);
  let ph = 0;
  return gen(0.14, t => {
    ph += 2 * Math.PI * (78 + 45 * Math.exp(-t * 60)) / SR;
    const heel = Math.sin(ph) * Math.exp(-t * 36) * 0.65;
    const sole = bp(nz()) * Math.exp(-t * 75) * 0.45 + lp(nz()) * Math.exp(-t * 45) * 0.3;
    return (heel + sole) * v;
  });
}

// Flag Flutter + Tactical Violation Alert Beep
function flagViolation(v = 1) {
  const bp = biquad('bp', 1400, 0.85);
  return gen(0.42, t => {
    // Fabric snap swoosh
    const snap = bp(nz()) * Math.exp(-Math.pow((t - 0.07) / 0.06, 2)) * 1.4;
    // Double tactical alert beep (non-musical crisp warning)
    const b1 = t < 0.11 ? Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 18) * 0.45 : 0;
    const b2 = (t > 0.14 && t < 0.28) ? Math.sin(2 * Math.PI * 660 * (t - 0.14)) * Math.exp(-(t - 0.14) * 16) * 0.45 : 0;
    return (snap + b1 + b2) * v;
  });
}

// Blueprint Grid Scan Sweep (subtle data tick train)
function gridScan(t0, dur = 0.38) {
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    put(t0 + (i / steps) * dur, tick(1600 + i * 140, 0.55), 0.11, (i / steps - 0.5) * 0.4);
  }
}

/* ---------- Arrange SFX Timeline ---------- */

// 1. Shutters on cuts & locks
T.shutters.forEach((t, i) => put(t - 0.005, shutter(0.85), 0.52, (i % 2 ? 0.22 : -0.22)));

// 2. Card / Module slides
T.slides.forEach((t, i) => put(t - 0.03, paper(0.24, 1), 0.32, (i % 2 ? 0.28 : -0.28)));

// 3. Blueprint grid scans
gridScan(T.arena.grid1, 0.35);
gridScan(T.arena.grid2, 0.35);

// 4. Typing ticks
T.typeRuns.forEach(([t0, n]) => {
  for (let k = 0; k < n; k += 2) {
    put(t0 + k / 52, tick(2550 + (k % 6) * 85, 0.5), 0.075, ((k % 4) - 1.5) * 0.18);
  }
});

// 5. Footsteps (Danton moving to box + Boot stepping on line)
T.footsteps.forEach((t, i) => put(t, footstep(0.95), 0.38, (i % 2 ? 0.15 : -0.15)));

// 6. Line Violation + Hakim Garis Flag
T.warnings.forEach(t => put(t, flagViolation(1), 0.48, 0.18));

// 7. Stopwatch Ticks (during Scene 4 Timekeeper: 22.8s to 29.2s)
for (let t = T.time.startEvt; t < T.time.stopEvt; t += 0.25) {
  const fast = t >= T.time.w1;
  put(t, tick(fast ? 2900 : 2100, 0.65), 0.11, 0);
  if (fast && t + 0.125 < T.time.stopEvt) {
    put(t + 0.125, tick(2400, 0.45), 0.07, 0);
  }
}

// 8. Timekeeper Referee Whistles (1x Long & 2x Long)
T.whistles.forEach(([t0, dur]) => {
  put(t0, whistle(dur, 1), 0.34, 0.05);
});

// 9. Confirmation Dings (Badges, Free-Penalty Rules, Souvenir)
T.dings.forEach(t => {
  put(t + 0.01, tick(3100, 1), 0.24, 0);
  put(t + 0.055, tick(4150, 0.65), 0.15, 0);
});

// 10. Row & Rule Ticks
T.rowTicks.forEach((t, i) => put(t, tick(1750, 0.8), 0.15, (i % 2 ? 0.2 : -0.2)));

// 11. QR Scan Matrix Ticks
for (let r = 0; r < 10; r++) {
  put(T.cta.qr[0] + r * (T.cta.qr[1] - T.cta.qr[0]) / 10, tick(2100 + r * 35, 0.7), 0.12, 0);
}

/* ---------- Master Output (WAV 16-bit Stereo 44.1kHz) ---------- */
const out = [mk(), mk()];
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, Math.max(0, (T.dur - t) / 0.5));
  const fin = Math.min(1, t / 0.01);
  for (let ch = 0; ch < 2; ch++) {
    const x = fx[ch][i] * 1.55;
    out[ch][i] = Math.tanh(x * 0.75) * fade * fin;
  }
}

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[0][i]), Math.abs(out[1][i]));
const g = peak > 0 ? 0.88 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(out[0][i] * g * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(out[1][i] * g * 32767), 46 + i * 4);
}
fs.writeFileSync(new URL('./audio_teknis.wav', import.meta.url), buf);
console.log('audio_teknis.wav written:', T.dur + 's (SFX Only)', 'peak before norm:', peak.toFixed(2));
