import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, DUR = 30, N = SR * DUR;
const cues = JSON.parse(fs.readFileSync(path.join(dir, 'cues.json'), 'utf8'));

const mL = new Float32Array(N), mR = new Float32Array(N); // music bus
const sL = new Float32Array(N), sR = new Float32Array(N); // sfx bus

let seed = 12345;
const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const noise = () => rnd() * 2 - 1;
const TAU = Math.PI * 2;
const saw = ph => 2 * (ph - Math.floor(ph)) - 1;
const sq = ph => (ph - Math.floor(ph)) < .5 ? 1 : -1;
const tri = ph => 2 * Math.abs(2 * (ph - Math.floor(ph + .5))) - 1;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function put(L, R, start, len, fn, pan = 0, gain = 1) {
  const s0 = Math.floor(start * SR), n = Math.floor(len * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n; i++) {
    const idx = s0 + i; if (idx < 0 || idx >= N) continue;
    const v = fn(i / SR, i);
    L[idx] += v * gl; R[idx] += v * gr;
  }
}
// state-variable filter helper
function svf() {
  let lo = 0, bp = 0;
  return (x, fc, q = .5, mode = 'lp') => {
    const f = 2 * Math.sin(Math.PI * Math.min(fc, SR * .45) / SR);
    lo += f * bp; const hi = x - lo - q * bp; bp += f * hi;
    return mode === 'bp' ? bp : mode === 'hp' ? hi : lo;
  };
}

/* ================= SFX ================= */
const sfx = {
  tick(t, v, pan) {
    const f = 1100 + rnd() * 500;
    put(sL, sR, t, .05, u => (noise() * Math.exp(-u / .0025) * .5 + Math.sin(TAU * f * u) * Math.exp(-u / .012) * .25), pan, .5 * v);
  },
  click(t, v, pan) {
    put(sL, sR, t, .1, u => noise() * Math.exp(-u / .004) * .7 + Math.sin(TAU * 2400 * u) * Math.exp(-u / .018) * .45 + Math.sin(TAU * 900 * u) * Math.exp(-u / .03) * .3, pan, .75 * v);
  },
  pop(t, v, pan) {
    put(sL, sR, t, .3, u => { const ph = TAU * (260 * u + 520 * .03 * (1 - Math.exp(-u / .03))); return Math.sin(ph) * Math.exp(-u / .07) }, pan, .9 * v);
  },
  bloop(t, v, pan) {
    put(sL, sR, t, .3, u => { const f = 350 + 700 * (1 - Math.exp(-u / .06)); return Math.sin(TAU * (350 * u + 700 * (u - .06 * (1 - Math.exp(-u / .06))))) * Math.exp(-u / .09) * .8 + 0 * f }, pan, .8 * v);
    put(sL, sR, t + .08, .4, u => Math.sin(TAU * 1568 * u) * Math.exp(-u / .12) * .3, pan, .6 * v);
  },
  ding(t, v, pan) {
    put(sL, sR, t, 1, u => (Math.sin(TAU * 1568 * u) + .4 * Math.sin(TAU * 1568 * 2.76 * u) * Math.exp(-u / .1) + .5 * Math.sin(TAU * 2349 * u)) * Math.exp(-u / .22) * .45, pan, .8 * v);
  },
  sparkle(t, v, pan) {
    const f = 2500 + rnd() * 3500, p = rnd() * 2 - 1;
    put(sL, sR, t, .15, u => Math.sin(TAU * f * u) * Math.exp(-u / .03) * .4, p, .35 * v);
  },
  whoosh(t, v, pan) {
    const f = svf(), d = .75;
    put(sL, sR, t, d, (u) => {
      const k = u / d, env = Math.sin(Math.PI * Math.pow(k, .7)) ** 1.5;
      const fc = 250 * Math.pow(18, k);
      return f(noise(), fc, .35, 'bp') * env * 2.2;
    }, pan, .8 * v);
    // stereo sweep layer
    const f2 = svf();
    put(sL, sR, t + .02, d, (u) => { const k = u / d; return f2(noise(), 400 * Math.pow(12, k), .3, 'bp') * Math.sin(Math.PI * k) ** 2 * 1.6 }, -pan * .8 + 0.3 * Math.sin(t * 7), .45 * v);
  },
  riser(t, v) {
    const f = svf(), d = 1.1;
    put(sL, sR, t, d, u => { const k = u / d; return (f(noise(), 300 * Math.pow(30, k), .25, 'bp') * 2 + Math.sin(TAU * (200 + 1400 * k * k) * u) * .12) * k * k }, 0, .8 * v);
  },
  boom(t, v) {
    const f = svf();
    put(sL, sR, t, 1.6, u => Math.sin(TAU * (38 * u + 70 * .12 * (1 - Math.exp(-u / .12)))) * Math.exp(-u / .55) * 1.1 + f(noise(), 200, .6, 'lp') * Math.exp(-u / .25) * .9 + noise() * Math.exp(-u / .02) * .5, 0, .95 * v);
    put(sL, sR, t, .8, u => (noise()) * Math.exp(-u / .25) * .12, 0, v); // air crash
  },
  chime(t, v) {
    const notes = [1046.5, 1318.5, 1568, 2093];
    notes.forEach((fr, i) => put(sL, sR, t + i * .075, 1.6, u => (Math.sin(TAU * fr * u) + .35 * Math.sin(TAU * fr * 2.76 * u) * Math.exp(-u / .08) + .2 * Math.sin(TAU * fr * 4.2 * u) * Math.exp(-u / .04)) * Math.exp(-u / .5) * .4, (i - 1.5) * .3, .8 * v));
  },
  confetti(t, v) {
    const f = svf();
    put(sL, sR, t, .6, u => f(noise(), 3500, .3, 'hp') * Math.exp(-u / .1) * 1.2 + noise() * Math.exp(-u / .01) * .6, 0, .7 * v);
    for (let i = 0; i < 18; i++) { const tt = t + .05 + rnd() * .5, p = rnd() * 2 - 1; put(sL, sR, tt, .03, u => noise() * Math.exp(-u / .004), p, .25 * v) }
    put(sL, sR, t, .5, u => Math.sin(TAU * (180 * u + 900 * .04 * (1 - Math.exp(-u / .04)))) * Math.exp(-u / .08) * .6, 0, .7 * v);
  },
  scribble(t, v) {
    const f = svf();
    put(sL, sR, t, 1.35, u => f(noise(), 1800 + 900 * Math.sin(u * 22), .5, 'bp') * (.5 + .5 * Math.sin(u * 40)) * Math.min(1, u * 12) * Math.min(1, (1.35 - u) * 8) * 1.4, 0, .3 * v);
  },
};

for (const c of cues) { (sfx[c.type] || (() => console.warn('no sfx', c.type)))(c.t, c.vol ?? 1, c.pan ?? 0); }

/* ================= MUSIC (128 BPM, C - G - Am - F) ================= */
const BPM = 128, beat = 60 / BPM, bar = beat * 4; // 1.875s -> 16 bars = 30s
const chords = [
  { root: 48, tones: [60, 64, 67] },  // C
  { root: 43, tones: [59, 62, 67] },  // G
  { root: 45, tones: [57, 60, 64] },  // Am
  { root: 41, tones: [57, 60, 65] },  // F
];
const kickT = []; // for sidechain
for (let b = 0; b < 16 * 4; b++) kickT.push(b * beat);
const duck = t => { const ph = (t % beat); return 1 - .65 * Math.exp(-ph / .13) };

// pad
for (let b = 0; b < 16; b++) {
  const ch = chords[b % 4], t0 = b * bar, len = bar + .15;
  for (const m of ch.tones) for (const det of [-.12, 0, .12]) {
    const f = mtof(m + det * .3), fl = svf();
    put(mL, mR, t0, len, (u) => {
      const e = Math.min(1, u / .08) * Math.min(1, (len - u) / .12);
      return fl(saw(f * (t0 + u)) * .5, 1500 + 800 * Math.min(1, u / .5), .6, 'lp') * e * .09 * duck(t0 + u);
    }, (det) * 4, 1);
  }
}
// kick
for (let b = 0; b < 16 * 4; b++) {
  const t = b * beat; if (t > 29.6) break;
  put(mL, mR, t, .3, u => Math.sin(TAU * (48 * u + 110 * .035 * (1 - Math.exp(-u / .035)))) * Math.exp(-u / .12) * 1.0 + noise() * Math.exp(-u / .003) * .15, 0, .9);
}
// hats (offbeat open + 16th closed from bar 2)
for (let b = 0; b < 16 * 4; b++) {
  const t = b * beat + beat / 2, f = svf();
  put(mL, mR, t, .12, u => f(noise(), 7000, .3, 'hp') * Math.exp(-u / .045) * .5, .2, .35);
  if (b >= 8) for (const o of [.25, .75]) { const f2 = svf(); put(mL, mR, b * beat + o * beat, .05, u => f2(noise(), 8500, .3, 'hp') * Math.exp(-u / .015) * .5, -.2, .2) }
}
// clap on 2 & 4 from bar 2
for (let b = 8; b < 16 * 4; b++) {
  if (b % 2 === 0) continue; const t = b * beat, f = svf();
  put(mL, mR, t, .25, u => { const burst = Math.exp(-((u % .012)) / .004) * (u < .036 ? 1 : .25); return f(noise(), 1500, .5, 'bp') * (burst * .6 + Math.exp(-u / .08) * .6) * 1.2 }, 0, .55);
}
// bass (from bar 1) - rolling eighths with octave pop
for (let b = 4; b < 16 * 4; b++) {
  const bi = Math.floor(b / 4), ch = chords[bi % 4];
  for (let e = 0; e < 2; e++) {
    const t = b * beat + e * beat / 2, m = ch.root + (e === 1 ? 12 : 0), f0 = mtof(m), fl = svf();
    if (t > 29.2) continue;
    put(mL, mR, t, beat / 2, u => { const env = Math.exp(-u / .18) * Math.min(1, u / .005); return fl(saw(f0 * u) * .6 + sq(f0 * u) * .3, 700, .7, 'lp') * env * .75 * (e === 1 ? .6 : 1) * duck(t + u) }, 0, .8);
  }
}
// arp (from bar 2), 16ths
for (let s = 0; s < 16 * 16; s++) {
  const t = s * beat / 4; if (t < 2 * bar || t > 29.3) continue;
  const bi = Math.floor(s / 16), ch = chords[bi % 4];
  const pat = [0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 2, 1][s % 16];
  const m = ch.tones[pat] + 12, f = mtof(m), fl = svf();
  put(mL, mR, t, .3, u => fl(saw(f * u) * .55 + sq(f * u * 1.005) * .35, 2400 + 3000 * Math.exp(-u / .06), .5, 'lp') * Math.exp(-u / .1) * .22 * duck(t + u), Math.sin(s * .9) * .5, 1);
}
// lead melody (from bar 4), 2-bar motif repeated; MIDI notes (0 = rest)
const motif = [
  [76, 0, 79, 0, 76, 74, 72, 0],  // over C
  [74, 0, 79, 0, 74, 72, 71, 0],  // over G
  [72, 0, 76, 0, 81, 79, 76, 0],  // over Am
  [77, 0, 76, 0, 72, 74, 72, 0],  // over F
];
for (let b = 4; b < 15; b++) for (let e = 0; e < 8; e++) {
  const m = motif[b % 4][e]; if (!m) continue;
  const t = b * bar + e * beat / 2, f = mtof(m), fl = svf();
  put(mL, mR, t, beat * .9, u => {
    const vib = 1 + .004 * Math.sin(TAU * 5.5 * u) * Math.min(1, u / .2);
    const env = Math.min(1, u / .01) * Math.exp(-u / .35);
    return fl(saw(f * vib * u) * .5 + tri(f * 2 * u) * .25 + sq(f * .5 * u) * .15, 3200, .5, 'lp') * env * .3;
  }, .15, 1);
}
// final stinger: chord hit + crash at bar 15 (28.125s)
const T15 = 15 * bar;
for (const m of [60, 64, 67, 72, 76]) { const f = mtof(m), fl = svf(); put(mL, mR, T15, 1.9, u => fl(saw(f * u) * .5 + saw(f * 1.003 * u) * .5, 3500, .5, 'lp') * Math.exp(-u / .9) * .22, (m % 5 - 2) * .2, 1) }
{ const f = svf(); put(mL, mR, T15, 1.5, u => f(noise(), 6000, .3, 'hp') * Math.exp(-u / .5) * .6, 0, .5) }
// swells at scene wipes
{ const f = svf(); put(mL, mR, 2.0, .85, u => f(noise(), 500 + 5500 * (u / .85) ** 2, .3, 'bp') * (u / .85) ** 2 * 1.4, 0, .5) }

/* ================= MIX ================= */
const out = new Float32Array(N * 2);
const MUSIC = .55, SFX = 1.0;
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  // music bed ducks under big sfx a little: gentle global fade in/out
  const fadeIn = Math.min(1, t / .05), fadeOut = Math.min(1, Math.max(0, (DUR - t) / .9));
  let l = mL[i] * MUSIC * fadeOut + sL[i] * SFX, r = mR[i] * MUSIC * fadeOut + sR[i] * SFX;
  l = Math.tanh(l * 1.1) / Math.tanh(1.1); r = Math.tanh(r * 1.1) / Math.tanh(1.1);
  out[2 * i] = l * fadeIn; out[2 * i + 1] = r * fadeIn;
  peak = Math.max(peak, Math.abs(l), Math.abs(r));
}
const norm = .89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N * 2; i++) buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(out[i] * norm * 32767))), 44 + i * 2);
fs.writeFileSync(path.join(dir, 'audio.wav'), buf);
console.log('audio.wav written, peak before norm', peak.toFixed(2));
