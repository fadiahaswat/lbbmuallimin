// Audio Synthesizer v4 — 3D Motion UI & Shatter Physics (STRICTLY SFX ONLY — ZERO MUSIC / NO SNARE)
// Stereo 44.1kHz 16-bit WAV synced frame-accurately to timeline_h1.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const T = (await import('./timeline_h1.js')).default;

const SR = 44100;
const N = Math.floor(T.dur * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

let seed = 202799;
const rnd = () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const nz = () => rnd() * 2 - 1;

function put(startSec, buf, gain = 1, pan = 0) {
  const i0 = Math.floor(startSec * SR);
  const p = Math.max(-1, Math.min(1, pan));
  const gl = gain * Math.cos((p + 1) * Math.PI / 4);
  const gr = gain * Math.sin((p + 1) * Math.PI / 4);
  for (let i = 0; i < buf.length; i++) {
    const k = i0 + i;
    if (k >= 0 && k < N) {
      L[k] += buf[i] * gl;
      R[k] += buf[i] * gr;
    }
  }
}

const gen = (dur, fn) => {
  const len = Math.floor(dur * SR);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) out[i] = fn(i / SR, i);
  return out;
};

function biquad(type, freq, Q = 0.707) {
  const w = 2 * Math.PI * Math.max(20, Math.min(SR * 0.45, freq)) / SR;
  const s = Math.sin(w), c = Math.cos(w), a = s / (2 * Q);
  let b0 = 0, b1 = 0, b2 = 0;
  if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
  if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
  if (type === 'bp') { b0 = a; b1 = 0; b2 = -a; }
  const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x => {
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}

/* ---------- 3D Foley & Tactile UI Instruments ---------- */

// 3D Mechanical Split-Flap Clack
function flapClack(heavy = false) {
  const bp = biquad('bp', heavy ? 1450 : 1950, 2.2);
  const lp = biquad('lp', 240, 1.0);
  return gen(0.14, t => {
    const click = bp(nz()) * Math.exp(-t * 95) * 0.9;
    const body = Math.sin(2 * Math.PI * (heavy ? 95 : 135) * t * Math.exp(-t * 14)) * Math.exp(-t * 38) * (heavy ? 0.75 : 0.45);
    return click + lp(nz()) * Math.exp(-t * 45) * 0.35 + body;
  });
}

// 3D Camera Hyper-Warp Doppler Whoosh
function warpZoom(dur = 0.46) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return gen(dur, t => {
    const p = t / dur;
    const env = Math.sin(p * Math.PI);
    const f = 140 + Math.pow(env, 1.6) * 2100;
    const w = 2 * Math.PI * f / SR, a = Math.sin(w) / 2.8, c = Math.cos(w);
    const x = nz();
    const y = (a * x - a * x2 + 2 * c * y1 - (1 - a) * y2) / (1 + a);
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    const subRush = Math.sin(2 * Math.PI * (58 + env * 45) * t) * env * 0.28;
    return y * env * 1.15 + subRush;
  });
}

// Glass / Monolith Tension Crack
function crystalCrack() {
  const hp = biquad('hp', 3200, 1.8);
  return gen(0.07, t => hp(nz()) * Math.exp(-t * 110) * 0.85);
}

// 3D Voronoi Shatter Detonation + Cascading Shards
function putShatterExplosion(t0) {
  // Primary impact fracture
  const lp = biquad('lp', 220, 0.9);
  const hp = biquad('hp', 2400, 1.2);
  const impact = gen(0.42, t => {
    const punch = Math.sin(2 * Math.PI * (120 * Math.exp(-t * 12) + 38) * t) * Math.exp(-t * 14) * 0.88;
    const burst = hp(nz()) * Math.exp(-t * 22) * 0.85;
    const rumble = lp(nz()) * Math.exp(-t * 9) * 0.55;
    return punch + burst + rumble;
  });
  put(t0, impact, 0.95, 0);

  // 22 Stereo-panned tumbling crystal/ceramic shard clinks
  for (let i = 0; i < 22; i++) {
    const delay = 0.03 + Math.pow(i / 22, 1.35) * 0.95 + rnd() * 0.05;
    const f1 = 2600 + rnd() * 4800;
    const f2 = f1 * (1.34 + rnd() * 0.25);
    const pan = (rnd() - 0.5) * 1.7;
    const shard = gen(0.085, t => {
      const env = Math.exp(-t * (55 + rnd() * 40));
      return (Math.sin(2 * Math.PI * f1 * t) * 0.6 + Math.sin(2 * Math.PI * f2 * t) * 0.4) * env;
    });
    put(t0 + delay, shard, 0.22 * (1 - i / 28), pan);
  }
}

// 3D Card 180° Air-Whip Flip + Lock Snap
function cardFlip3D() {
  const bp = biquad('bp', 1350, 1.4);
  return gen(0.38, t => {
    const whipEnv = Math.exp(-Math.pow((t - 0.14) / 0.09, 2));
    const whip = bp(nz()) * whipEnv * 0.75;
    const lockT = t - 0.30;
    const snap = lockT > 0 ? Math.sin(2 * Math.PI * 2400 * lockT) * Math.exp(-lockT * 120) * 0.55 : 0;
    return whip + snap;
  });
}

// Capacitive Touch Tap + Pneumatic Z-Lift
function touchLift() {
  const bp = biquad('bp', 2800, 2.5);
  return gen(0.22, t => {
    const tap = bp(nz()) * Math.exp(-t * 160) * 0.7 + Math.sin(2 * Math.PI * 1650 * t) * Math.exp(-t * 130) * 0.45;
    const lift = t > 0.03 ? Math.sin(2 * Math.PI * (320 + t * 1400) * (t - 0.03)) * Math.exp(-(t - 0.03) * 24) * 0.28 : 0;
    return tap + lift;
  });
}

// Micro Tick / Haptic Key Tap
function microTap(f = 3400) {
  return gen(0.028, t => Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 210) * 0.5 + nz() * Math.exp(-t * 260) * 0.25);
}

// Stylus Cursive Signature Friction on Glass
function penSignature(dur = 0.78) {
  const bp = biquad('bp', 3900, 2.6);
  return gen(dur, t => {
    const strokeMod = 0.45 + 0.55 * Math.abs(Math.sin(t * 21));
    const env = Math.min(1, t * 25) * Math.min(1, (dur - t) * 20);
    return bp(nz()) * strokeMod * env * 0.38;
  });
}

// Specular Glass Sheen Sweep (non-musical airy shimmer)
function glassSheen(dur = 0.65) {
  const hp = biquad('hp', 4800, 1.6);
  return gen(dur, t => {
    const env = Math.sin((t / dur) * Math.PI);
    return hp(nz()) * env * 0.26;
  });
}

// Mechanical Seal / Lock Confirmation
function sealLock() {
  const hp = biquad('hp', 2100, 1.4);
  return gen(0.24, t => {
    const thud = Math.sin(2 * Math.PI * (145 * Math.exp(-t * 18) + 52) * t) * Math.exp(-t * 24) * 0.72;
    const crisp = hp(nz()) * Math.exp(-t * 85) * 0.65;
    const latch = t > 0.055 ? Math.sin(2 * Math.PI * 3100 * (t - 0.055)) * Math.exp(-(t - 0.055) * 110) * 0.42 : 0;
    return thud + crisp + latch;
  });
}

/* ================= TIMELINE SOUND DESIGN PLACEMENT ================= */

// --- SCENE 0: 3D Split-Flap & Countdown ---
put(0.04, warpZoom(0.38), 0.55, 0);
put(T.s0.flap1 + 0.12, flapClack(false), 0.78, 0.15);
put(T.s0.flap2 + 0.14, flapClack(true), 0.95, 0.15);
put(T.s0.headline, sealLock(), 0.72, 0);
put(T.s0.glassCard, touchLift(), 0.68, -0.2);
put(T.s0.hookBadge, sealLock(), 0.75, 0);

// Precision chronograph ticks during Scene 0
for (let t = 1.6; t < 4.55; t += 0.25) {
  put(t, microTap(3800), 0.26, ((Math.round(t * 4) % 2) * 2 - 1) * 0.35);
}

// 3D Warp Transition S0 -> S1
put(T.cuts[0] - 0.24, warpZoom(0.48), 0.85, 0);

// --- SCENE 1: Crack + Voronoi Shatter + Hero Titanium Price Card ---
put(T.s1.slabIn, sealLock(), 0.62, 0);
// Creeping magma fissures
[5.60, 5.74, 5.86, 5.96, 6.05, 6.13, 6.18].forEach((ct, i) => {
  put(ct, crystalCrack(), 0.42 + i * 0.07, (i % 2 === 0 ? -0.35 : 0.35));
});
// BOOM! 3D Shatter Detonation
putShatterExplosion(T.s1.shatter);
// Hero Price Card rockets forward + Sheen + Savings Badge
put(T.s1.heroCard + 0.08, warpZoom(0.36), 0.65, 0);
put(T.s1.saveBadge, sealLock(), 0.88, 0);
put(T.s1.sheen, glassSheen(0.75), 0.55, 0.3);

// 3D Warp Transition S1 -> S2
put(T.cuts[1] - 0.24, warpZoom(0.48), 0.85, 0);

// --- SCENE 2: "DAFTAR DULU, NAMA-NAMA FLEKSIBEL!" + 3D Card Flips ---
put(T.s2.title1, touchLift(), 0.68, -0.2);
put(T.s2.title2, sealLock(), 0.78, 0.2);
put(T.s2.cardsIn, warpZoom(0.32), 0.50, 0);
put(T.s2.flip1, cardFlip3D(), 0.85, -0.55);
put(T.s2.flip2, cardFlip3D(), 0.92, 0.0);
put(T.s2.flip3, cardFlip3D(), 0.85, 0.55);
put(T.s2.tmDock, sealLock(), 0.82, 0);

// 3D Warp Transition S2 -> S3
put(T.cuts[2] - 0.24, warpZoom(0.48), 0.85, 0);

// --- SCENE 3: 3D Smartphone — 4 Quick Inputs + Live Signature ---
put(T.s3.phoneIn, warpZoom(0.38), 0.58, -0.2);
put(T.s3.tap1, touchLift(), 0.82, -0.25);
put(T.s3.tap2, touchLift(), 0.82, 0.2);
put(T.s3.tap2 + 0.45, microTap(4200), 0.48, 0.2);

put(T.s3.tap3, touchLift(), 0.82, -0.2);
for (let i = 0; i < 10; i++) {
  put(T.s3.tap3 + 0.08 + i * 0.055, microTap(2900 + (i % 3) * 400), 0.34, (i % 2 === 0 ? -0.2 : 0.2));
}

put(T.s3.tap4, touchLift(), 0.82, 0.25);
put(T.s3.sigDraw[0], penSignature(T.s3.sigDraw[1] - T.s3.sigDraw[0]), 0.85, 0.15);
put(T.s3.lockBadge, sealLock(), 0.92, 0);

// 3D Warp Transition S3 -> S4
put(T.cuts[3] - 0.24, warpZoom(0.48), 0.85, 0);

// --- SCENE 4: Grand 3D Portal Finale ---
put(T.s4.logoIn, touchLift(), 0.65, 0);
put(T.s4.headline, sealLock(), 0.72, 0);
put(T.s4.qrIn, warpZoom(0.34), 0.55, 0);
put(T.s4.lockBrackets, microTap(3600), 0.55, -0.3);
put(T.s4.lockBrackets + 0.07, microTap(4400), 0.65, 0.3);
put(T.s4.ctaDock, sealLock(), 0.82, 0);
put(T.s4.shine, glassSheen(0.8), 0.5, 0);

/* ---------- Normalize & Write 16-bit Stereo WAV ---------- */
let peak = 0;
for (let i = 0; i < N; i++) {
  const m = Math.max(Math.abs(L[i]), Math.abs(R[i]));
  if (m > peak) peak = m;
}
const norm = peak > 0.001 ? 0.88 / peak : 1;

const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + N * 4, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(N * 4, 40);

let off = 44;
for (let i = 0; i < N; i++) {
  const sl = Math.max(-1, Math.min(1, L[i] * norm));
  const sr = Math.max(-1, Math.min(1, R[i] * norm));
  wav.writeInt16LE(Math.round(sl * 32767), off);
  wav.writeInt16LE(Math.round(sr * 32767), off + 2);
  off += 4;
}

const outPath = path.join(dir, 'audio_h1.wav');
fs.writeFileSync(outPath, wav);
console.log(`audio_h1.wav v4 written: ${T.dur}s (3D SFX Only), peak before norm: ${peak.toFixed(2)}`);
