// audio_tonti.mjs
// Clean, majestic, minimalist sound design for Logo Tonti Mu'allimin motion logo.
// Strictly non-cluttered ("jangan terlalu rame"), high-impact cinematic audio.
// Updated with:
// - Sword Clash strike impact at T.swordsClash
// - 5 individual crystalline star pings matching the 5-star cadence
// - Curved text circular reveal clicks
// - Unified organic flag whoosh
// - Zero unwanted initial loud bursts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const T = (await import('./timeline_tonti.js')).default;

const SR = 44100;
const N = Math.floor(T.dur * SR);
const mk = () => new Float32Array(N);
const bus = { main: [mk(), mk()], sub: [mk(), mk()] };

let seed = 1918;
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
    if (k >= 0 && k < N) {
      b[0][k] += s[i] * gl;
      b[1][k] += s[i] * gr;
    }
  }
}

function biquad(type, f0, Q = 1.0) {
  const w0 = 2 * Math.PI * f0 / SR;
  const alpha = Math.sin(w0) / (2 * Q);
  const cos = Math.cos(w0);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'lp') {
    b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = (1 - cos) / 2;
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  } else if (type === 'hp') {
    b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2;
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  } else { // bp
    b0 = alpha; b1 = 0; b2 = -alpha;
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  }
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x => {
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}

const gen = (dur, fn) => {
  const len = Math.floor(dur * SR);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) out[i] = fn(i / SR, i, len);
  return out;
};

// Pure, clear bell tone
function bellTone(freq = 880, dur = 0.6, v = 1) {
  let ph1 = 0, ph2 = 0;
  return gen(dur, t => {
    ph1 += 2 * Math.PI * freq / SR;
    ph2 += 2 * Math.PI * (freq * 2.76) / SR;
    const body = Math.sin(ph1) * Math.exp(-t * 6.5);
    const chime = Math.sin(ph2) * Math.exp(-t * 18.0) * 0.35;
    return (body + chime) * v;
  });
}

// Low mechanical latch
function latchThud(dur = 0.28, v = 1) {
  const lp = biquad('lp', 280, 1.2);
  let p = 0;
  return gen(dur, t => {
    p += 2 * Math.PI * (110 * Math.exp(-t * 28)) / SR;
    const click = nz() * Math.exp(-t * 85) * 0.45;
    return (lp(click) + Math.sin(p) * Math.exp(-t * 16) * 0.8) * v;
  });
}

// Powerful Metallic Sword Clash (CLANG! with steel ring)
function swordClash(dur = 0.75, v = 1) {
  const bpSteel = biquad('bp', 3400, 3.2);
  const bpRing2 = biquad('bp', 4850, 4.0);
  let pRing1 = 0, pRing2 = 0, pBody = 0;
  return gen(dur, t => {
    const strike = nz() * Math.exp(-t * 120) * 0.7;
    const steel = (bpSteel(nz()) + bpRing2(nz())) * Math.exp(-t * 35) * 0.55;

    pRing1 += 2 * Math.PI * 3380 / SR;
    pRing2 += 2 * Math.PI * 4620 / SR;
    pBody  += 2 * Math.PI * (280 * Math.exp(-t * 22)) / SR;

    const ring = (Math.sin(pRing1) * 0.6 + Math.sin(pRing2) * 0.4) * Math.exp(-t * 5.8);
    const body = Math.sin(pBody) * Math.exp(-t * 14) * 0.4;

    return (strike + steel + ring + body) * v;
  });
}

// Blade slide whoosh before clash
function bladeSwish(dur = 0.35, v = 1) {
  const bp = biquad('bp', 2800, 1.8);
  return gen(dur, t => {
    const p = t / dur;
    const env = Math.pow(Math.sin(Math.PI * p), 2);
    return bp(nz()) * env * 0.8 * v;
  });
}

// Smooth Fabric Flutter (for Indonesian Flag)
function flagWhoosh(dur = 0.70, v = 1) {
  const bp = biquad('bp', 880, 0.9), lp = biquad('lp', 4200);
  let thPh = 0;
  return gen(dur, t => {
    const p = t / dur;
    const flutter = 0.6 + 0.4 * Math.sin(t * 16.0);
    const wind = bp(nz()) * Math.pow(Math.sin(Math.PI * p), 1.2) * flutter * 1.5;
    thPh += 2 * Math.PI * (110 + 35 * Math.exp(-t * 16)) / SR;
    const body = Math.sin(thPh) * Math.exp(-t * 12) * 0.25;
    return (lp(wind) + body) * v;
  });
}

// Sub Bass Boom
function subPunch(dur = 1.0, v = 1) {
  let ph = 0;
  return gen(dur, t => {
    ph += 2 * Math.PI * (50 + 15 * Math.exp(-t * 20)) / SR;
    return Math.sin(ph) * Math.min(1, t / 0.008) * Math.exp(-t * 3.6) * v;
  });
}

// Crisp Text Stamp Click
function stampClick(f = 1750, v = 1) {
  return gen(0.040, t => (Math.sin(2 * Math.PI * f * t) * 0.8 + Math.sin(2 * Math.PI * f * 2.05 * t) * 0.2) * Math.exp(-t * 220) * v);
}

// Specular Crystalline Shimmer
function sheenSweep(t0, dur) {
  const n = Math.floor(dur * SR);
  const bp = biquad('bp', 4400, 1.8);
  const i0 = Math.floor(t0 * SR);
  for (let i = 0; i < n; i++) {
    const k = i0 + i; if (k < 0 || k >= N) continue;
    const p = i / n;
    const env = Math.pow(Math.sin(Math.PI * p), 1.8) * 0.12;
    const pan = -0.5 + p;
    const s = bp(nz()) * env;
    bus.main[0][k] += s * Math.cos((pan + 1) * Math.PI / 4);
    bus.main[1][k] += s * Math.sin((pan + 1) * Math.PI / 4);
  }
}

/* ---------- Arrangement (Pure, Spacious, Minimal) ---------- */
// 1. Monogram HW Reveal (Subtle chime)
put(bus.main, T.monogramIn, bellTone(880, 0.55, 0.35), 0.35, 0);

// 2. Tameng Assembly
put(bus.main, T.shieldIn, latchThud(0.24, 0.80), 0.40, 0);
put(bus.sub,  T.shieldIn, subPunch(0.40, 0.35), 0.30, 0);

// 3. Swords Entry & Dynamic CLASH!
put(bus.main, T.swordsIn, bladeSwish(0.28, 0.60), 0.35, -0.2);
put(bus.main, T.swordsClash, swordClash(0.70, 0.95), 0.65, 0);
put(bus.sub,  T.swordsClash, subPunch(0.45, 0.60), 0.40, 0);

// 4. 5 Stars Ignition Cadence (Individual melodic pings)
const starPitches = [1480, 1660, 1980, 1760, 1520];
T.stars.forEach((tSt, i) => {
  const pan = (i - 2) * 0.25;
  put(bus.main, tSt, bellTone(starPitches[i], 0.32, 0.45), 0.32, pan);
});

// 5. Concentric Rings Pulse
put(bus.sub,  T.ringsIn, subPunch(0.50, 0.45), 0.32, 0);
put(bus.main, T.ringsIn, stampClick(1350, 0.45), 0.20, 0);

// 6. Typography Circular Sweep
put(bus.main, T.textCarakaIn, stampClick(1850, 0.55), 0.26, -0.3);
put(bus.main, T.textCarakaIn + 0.35, stampClick(2050, 0.50), 0.24, 0);
put(bus.main, T.textTontiIn,  stampClick(1650, 0.60), 0.28, -0.15);
put(bus.main, T.textTontiIn + 0.30, stampClick(1750, 0.55), 0.26, 0.25);

// 7. Bendera Merah Putih Unfurl
put(bus.main, T.flagIn, flagWhoosh(0.70, 0.85), 0.45, 0);
put(bus.main, T.flagSettle, stampClick(1200, 0.40), 0.18, 0);

// 8. Master Emblem Lock & Shimmer
put(bus.main, T.lock, latchThud(0.32, 1.0), 0.55, 0);
put(bus.sub,  T.lock, subPunch(1.15, 1.0), 0.58, 0);
sheenSweep(T.shimmer[0], 1.05);

// 9. Motion Out Deconstruction
put(bus.main, T.outroStart, flagWhoosh(0.60, 0.45), 0.30, 0);
put(bus.main, T.outroHw, bellTone(1320, 0.30, 0.30), 0.20, 0);

/* ---------- Output WAV ---------- */
const outL = new Float32Array(N);
const outR = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  outL[i] = bus.main[0][i] + bus.sub[0][i];
  outR[i] = bus.main[1][i] + bus.sub[1][i];
  const a = Math.max(Math.abs(outL[i]), Math.abs(outR[i]));
  if (a > peak) peak = a;
}

const norm = peak > 0 ? (0.88 / peak) : 1;
const wavBuf = Buffer.alloc(44 + N * 4);
wavBuf.write('RIFF', 0);
wavBuf.writeUInt32LE(36 + N * 4, 4);
wavBuf.write('WAVE', 8);
wavBuf.write('fmt ', 12);
wavBuf.writeUInt32LE(16, 16);
wavBuf.writeUInt16LE(1, 20); // PCM
wavBuf.writeUInt16LE(2, 22); // Stereo
wavBuf.writeUInt32LE(SR, 24);
wavBuf.writeUInt32LE(SR * 4, 28);
wavBuf.writeUInt16LE(4, 32);
wavBuf.writeUInt16LE(16, 34);
wavBuf.write('data', 36);
wavBuf.writeUInt32LE(N * 4, 40);

for (let i = 0; i < N; i++) {
  const sl = Math.max(-1, Math.min(1, outL[i] * norm));
  const sr = Math.max(-1, Math.min(1, outR[i] * norm));
  wavBuf.writeInt16LE(Math.round(sl * 32767), 44 + i * 4);
  wavBuf.writeInt16LE(Math.round(sr * 32767), 44 + i * 4 + 2);
}

const outWav = path.join(dir, 'audio_tonti.wav');
fs.writeFileSync(outWav, wavBuf);
console.log('audio_tonti.wav written (8.0s, peak normalized to 0.88)');
