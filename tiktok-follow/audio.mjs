import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100;
const DUR = 18; // 18 seconds duration
const N = SR * DUR;

let cues = [];
try {
  cues = JSON.parse(fs.readFileSync(path.join(dir, 'cues.json'), 'utf8'));
} catch (e) {
  console.warn('Could not read cues.json, using defaults', e.message);
}

const mL = new Float32Array(N), mR = new Float32Array(N); // Music bus
const sL = new Float32Array(N), sR = new Float32Array(N); // SFX bus

let seed = 98765;
const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const noise = () => rnd() * 2 - 1;
const TAU = Math.PI * 2;
const saw = ph => 2 * (ph - Math.floor(ph)) - 1;
const sq = ph => ((ph - Math.floor(ph)) < 0.5 ? 1 : -1);
const tri = ph => 2 * Math.abs(2 * (ph - Math.floor(ph + 0.5))) - 1;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function put(L, R, start, len, fn, pan = 0, gain = 1) {
  const s0 = Math.floor(start * SR), n = Math.floor(len * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4);
  const gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n; i++) {
    const idx = s0 + i;
    if (idx < 0 || idx >= N) continue;
    const v = fn(i / SR, i);
    L[idx] += v * gl;
    R[idx] += v * gr;
  }
}

function svf() {
  let lo = 0, bp = 0;
  return (x, fc, q = 0.5, mode = 'lp') => {
    const f = 2 * Math.sin(Math.PI * Math.min(fc, SR * 0.45) / SR);
    lo += f * bp;
    const hi = x - lo - q * bp;
    bp += f * hi;
    return mode === 'bp' ? bp : mode === 'hp' ? hi : lo;
  };
}

/* ================= SFX IMPLEMENTATION ================= */
const sfx = {
  glitch(t, v = 1, pan = 0) {
    const d = 0.35;
    const fl = svf();
    put(sL, sR, t, d, u => {
      const g = (noise() > 0.3 ? 1 : -1) * (saw(u * 1200) * 0.5);
      return fl(g, 2200 + 1500 * Math.sin(u * 80), 0.7, 'bp') * Math.exp(-u / 0.12);
    }, pan, 0.9 * v);
  },
  bassdrop(t, v = 1, pan = 0) {
    put(sL, sR, t, 1.4, u => {
      const f = 110 * Math.exp(-u / 0.35) + 38;
      const ph = TAU * (38 * u + 110 * 0.35 * (1 - Math.exp(-u / 0.35)));
      return (Math.sin(ph) * 1.2 + Math.sin(ph * 0.5) * 0.6) * Math.exp(-u / 0.55);
    }, pan, 1.1 * v);
    // Sub rumble layer
    const fl = svf();
    put(sL, sR, t, 0.8, u => fl(noise(), 90, 0.8, 'lp') * Math.exp(-u / 0.28), pan, 0.8 * v);
  },
  slam(t, v = 1, pan = 0) {
    const fl = svf();
    put(sL, sR, t, 0.6, u => {
      const kick = Math.sin(TAU * (140 * Math.exp(-u / 0.05) + 45) * u) * Math.exp(-u / 0.12);
      const impact = fl(noise(), 1200, 0.5, 'bp') * Math.exp(-u / 0.06);
      return (kick * 1.0 + impact * 0.8) * Math.exp(-u / 0.25);
    }, pan, 1.0 * v);
  },
  tick(t, v = 1, pan = 0) {
    const f = 1300 + rnd() * 400;
    put(sL, sR, t, 0.04, u => (noise() * Math.exp(-u / 0.003) * 0.5 + Math.sin(TAU * f * u) * Math.exp(-u / 0.01) * 0.3), pan, 0.6 * v);
  },
  riser(t, v = 1) {
    const fl = svf(), d = 1.0;
    put(sL, sR, t, d, u => {
      const k = u / d;
      const fc = 300 * Math.pow(25, k);
      return (fl(noise(), fc, 0.3, 'bp') * 1.8 + Math.sin(TAU * (180 + 1200 * k * k) * u) * 0.15) * (k * k);
    }, 0, 0.85 * v);
  },
  whoosh(t, v = 1, pan = 0) {
    const fl = svf(), d = 0.55;
    put(sL, sR, t, d, u => {
      const k = u / d;
      const env = Math.sin(Math.PI * Math.pow(k, 0.7)) ** 1.6;
      const fc = 350 * Math.pow(15, k);
      return fl(noise(), fc, 0.4, 'bp') * env * 2.4;
    }, pan, 0.85 * v);
  },
  shutter(t, v = 1, pan = 0) {
    // Camera shutter click + spring
    put(sL, sR, t, 0.04, u => noise() * Math.exp(-u / 0.005) * 0.9, pan - 0.2, 0.9 * v);
    put(sL, sR, t + 0.06, 0.05, u => noise() * Math.exp(-u / 0.006) * 0.8, pan + 0.2, 0.85 * v);
    put(sL, sR, t + 0.02, 0.15, u => Math.sin(TAU * 1800 * u) * Math.exp(-u / 0.03) * 0.35, pan, 0.6 * v);
  },
  pop(t, v = 1, pan = 0) {
    put(sL, sR, t, 0.25, u => {
      const ph = TAU * (280 * u + 560 * 0.03 * (1 - Math.exp(-u / 0.03)));
      return Math.sin(ph) * Math.exp(-u / 0.065);
    }, pan, 0.85 * v);
  },
  sparkle(t, v = 1, pan = 0) {
    const f = 2600 + rnd() * 2200, p = rnd() * 2 - 1;
    put(sL, sR, t, 0.18, u => Math.sin(TAU * f * u) * Math.exp(-u / 0.04) * 0.4, p, 0.45 * v);
  },
  tap(t, v = 1, pan = 0) {
    // Crisp tactile haptic tap
    put(sL, sR, t, 0.06, u => (noise() * Math.exp(-u / 0.003) * 0.8 + Math.sin(TAU * 220 * u) * Math.exp(-u / 0.015) * 0.6), pan, 1.1 * v);
  },
  ding(t, v = 1, pan = 0) {
    // Cheerful chime ding on follow success
    const notes = [1568, 2093, 2793]; // G6, C7, F7
    notes.forEach((f, i) => {
      put(sL, sR, t + i * 0.04, 0.8, u => (Math.sin(TAU * f * u) + 0.3 * Math.sin(TAU * f * 2.01 * u)) * Math.exp(-u / 0.22) * 0.4, pan + (i - 1) * 0.2, 0.85 * v);
    });
  },
  confetti(t, v = 1, pan = 0) {
    const fl = svf();
    put(sL, sR, t, 0.5, u => fl(noise(), 4000, 0.3, 'hp') * Math.exp(-u / 0.08) * 1.1, pan, 0.8 * v);
    for (let i = 0; i < 20; i++) {
      const tt = t + 0.02 + rnd() * 0.4;
      const p = rnd() * 2 - 1;
      put(sL, sR, tt, 0.03, u => noise() * Math.exp(-u / 0.003) * 0.3, p, 0.25 * v);
    }
  },
  lens(t, v = 1, pan = 0) {
    // Elegant magnifying chime
    const f = 1760; // A6
    put(sL, sR, t, 0.5, u => (Math.sin(TAU * f * u) + 0.4 * Math.sin(TAU * f * 2.76 * u) * Math.exp(-u / 0.06)) * Math.exp(-u / 0.16) * 0.45, pan, 0.7 * v);
  },
  bell(t, v = 1, pan = 0) {
    // Realistic resonant brass notification bell
    const base = 1200;
    put(sL, sR, t, 0.9, u => {
      return (Math.sin(TAU * base * u) * 0.7 +
              Math.sin(TAU * base * 1.51 * u) * 0.45 +
              Math.sin(TAU * base * 2.42 * u) * 0.35 +
              Math.sin(TAU * base * 3.84 * u) * 0.2) * Math.exp(-u / 0.28);
    }, pan, 0.95 * v);
  },
  stinger(t, v = 1) {
    // Energetic marching snare crescendo + crash hit
    const fl = svf();
    // 8-beat snare crescendo rolls up to t
    const rollDur = 1.2;
    const startRoll = Math.max(0, t - rollDur);
    for (let i = 0; i < 32; i++) {
      const rt = startRoll + i * (rollDur / 32);
      const prog = (i + 1) / 32;
      put(sL, sR, rt, 0.06, u => {
        const snareNoise = fl(noise(), 1800 + prog * 1500, 0.4, 'bp') * Math.exp(-u / 0.025);
        const snareBody = Math.sin(TAU * 220 * u) * Math.exp(-u / 0.015);
        return (snareNoise * 0.8 + snareBody * 0.4) * (prog ** 1.8);
      }, (i % 2 === 0 ? -0.2 : 0.2), 0.75 * v);
    }
    // Big Crash hit at t
    put(sL, sR, t, 1.8, u => fl(noise(), 7500, 0.35, 'hp') * Math.exp(-u / 0.45) * 0.9, 0, 0.95 * v);
    put(sL, sR, t, 1.0, u => Math.sin(TAU * (60 * Math.exp(-u / 0.08) + 42) * u) * Math.exp(-u / 0.35) * 1.2, 0, 1.1 * v);
  }
};

// Dispatch all cues from cues.json
for (const c of cues) {
  if (sfx[c.type]) {
    sfx[c.type](c.t, c.vol ?? 1, c.pan ?? 0);
  } else {
    console.warn('Unknown SFX type in cues:', c.type);
  }
}

/* ================= UPBEAT INSPIRING MODERN MUSIC TRACK ================= */
// Tempo: 128 BPM
// Key: D Major / B Minor driving modern heroic progression (Bm - G - D - A)
const BPM = 128;
const beat = 60 / BPM; // 0.46875s
const bar = beat * 4;  // 1.875s
const totalBars = Math.ceil(DUR / bar); // ~10 bars for 18s

const progression = [
  { root: 47, tones: [59, 62, 66] }, // Bm
  { root: 43, tones: [55, 59, 62] }, // G
  { root: 45, tones: [57, 60, 64] }, // A
  { root: 50, tones: [57, 62, 66] }, // D
  { root: 47, tones: [59, 62, 66] }, // Bm
  { root: 43, tones: [55, 59, 62] }, // G
  { root: 45, tones: [57, 62, 66] }, // D/F#
  { root: 45, tones: [57, 60, 64] }, // A
  { root: 47, tones: [59, 62, 66] }, // Bm
  { root: 50, tones: [57, 62, 66] }, // D
];

const duck = t => {
  const ph = t % beat;
  return 1 - 0.65 * Math.exp(-ph / 0.12);
};

// 1. Heavy Kick (Four-on-the-floor + military rhythm bursts)
for (let b = 0; b < totalBars * 4; b++) {
  const t = b * beat;
  if (t > DUR - 0.3) break;
  // Intro has double kick on beat 1 and 3, full kick in main section
  put(mL, mR, t, 0.28, u => {
    const ph = TAU * (50 * u + 115 * 0.035 * (1 - Math.exp(-u / 0.035)));
    return (Math.sin(ph) * 1.1 + noise() * Math.exp(-u / 0.004) * 0.16) * Math.exp(-u / 0.14);
  }, 0, 0.95);

  // Syncopated double kick before bar change
  if (b % 4 === 3) {
    put(mL, mR, t + beat * 0.5, 0.18, u => {
      const ph = TAU * (54 * u + 90 * 0.03 * (1 - Math.exp(-u / 0.03)));
      return Math.sin(ph) * Math.exp(-u / 0.09) * 0.75;
    }, 0, 0.7);
  }
}

// 2. Marching Snare & Crisp Claps
for (let b = 0; b < totalBars * 4; b++) {
  const t = b * beat;
  if (t > DUR - 0.3) break;

  // Snare / Clap on beat 2 & 4
  if (b % 2 === 1) {
    const fl = svf();
    put(mL, mR, t, 0.24, u => {
      const burst = Math.exp(-((u % 0.01)) / 0.003) * (u < 0.03 ? 1 : 0.25);
      return fl(noise(), 1700, 0.45, 'bp') * (burst * 0.6 + Math.exp(-u / 0.07) * 0.6) * 1.2;
    }, 0, 0.6);
  }

  // Driving 16th-note military marching snare ghost notes
  if (b >= 4) {
    for (const o of [0.25, 0.5, 0.75]) {
      const fl = svf();
      put(mL, mR, t + o * beat, 0.05, u => {
        return fl(noise(), 3200, 0.4, 'hp') * Math.exp(-u / 0.016) * 0.32;
      }, (rnd() - 0.5) * 0.3, 0.32);
    }
  }
}

// 3. Open & Closed Hi-Hats
for (let b = 0; b < totalBars * 4; b++) {
  const t = b * beat + beat / 2;
  if (t > DUR - 0.2) break;
  const fl = svf();
  put(mL, mR, t, 0.12, u => fl(noise(), 7800, 0.3, 'hp') * Math.exp(-u / 0.045) * 0.5, 0.2, 0.4);
}

// 4. Bassline: Rolling 16th Electro-March Bass
for (let b = 2; b < totalBars * 4; b++) {
  const barIdx = Math.floor(b / 4);
  const ch = progression[barIdx % progression.length];
  for (let s = 0; s < 4; s++) {
    const t = b * beat + s * (beat / 4);
    if (t > DUR - 0.3) break;
    const note = ch.root + (s === 2 ? 7 : (s === 3 ? 12 : 0));
    const f0 = mtof(note), fl = svf();
    put(mL, mR, t, beat / 3, u => {
      const env = Math.exp(-u / 0.13) * Math.min(1, u / 0.005);
      return fl(saw(f0 * u) * 0.65 + sq(f0 * u * 1.003) * 0.3, 850, 0.65, 'lp') * env * 0.8 * duck(t + u);
    }, (s % 2 ? -0.1 : 0.1), 0.82);
  }
}

// 5. Inspiring Brass / Pad Chords
for (let barIdx = 0; barIdx < totalBars; barIdx++) {
  const ch = progression[barIdx % progression.length], t0 = barIdx * bar, len = bar + 0.1;
  if (t0 > DUR - 0.4) break;
  for (const m of ch.tones) {
    for (const det of [-0.08, 0, 0.08]) {
      const f = mtof(m + det * 0.3), fl = svf();
      put(mL, mR, t0, len, u => {
        const e = Math.min(1, u / 0.06) * Math.min(1, (len - u) / 0.1);
        return fl(saw(f * (t0 + u)) * 0.45 + tri(f * 2 * u) * 0.25, 1700 + 700 * Math.min(1, u / 0.4), 0.55, 'lp') * e * 0.09 * duck(t0 + u);
      }, det * 3, 1);
    }
  }
}

// 6. Melodic Arp & Lead
for (let s = 0; s < totalBars * 16; s++) {
  const t = s * (beat / 4);
  if (t < bar || t > DUR - 0.5) continue;
  const barIdx = Math.floor(s / 16);
  const ch = progression[barIdx % progression.length];
  const pat = [0, 1, 2, 1, 2, 0, 1, 2, 0, 2, 1, 2, 0, 1, 2, 1][s % 16];
  const m = ch.tones[pat] + 12, f = mtof(m), fl = svf();
  put(mL, mR, t, 0.24, u => {
    return fl(saw(f * u) * 0.5 + sq(f * u * 1.005) * 0.35, 2400 * Math.exp(-u / 0.08) + 900, 0.5, 'lp') * Math.exp(-u / 0.09) * 0.2 * duck(t + u);
  }, Math.sin(s * 0.8) * 0.4, 1);
}

/* ================= FINAL MASTERING MIX ================= */
const out = new Float32Array(N * 2);
const MUSIC = 0.58, SFX_VOL = 1.0;
let peak = 0;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fadeIn = Math.min(1, t / 0.05);
  const fadeOut = Math.min(1, Math.max(0, (DUR - t) / 0.8));
  let l = mL[i] * MUSIC * fadeOut + sL[i] * SFX_VOL;
  let r = mR[i] * MUSIC * fadeOut + sR[i] * SFX_VOL;

  // Soft limiter / tape saturation
  l = Math.tanh(l * 1.1) / Math.tanh(1.1);
  r = Math.tanh(r * 1.1) / Math.tanh(1.1);

  out[2 * i] = l * fadeIn;
  out[2 * i + 1] = r * fadeIn;
  peak = Math.max(peak, Math.abs(l), Math.abs(r));
}

const norm = 0.89 / Math.max(peak, 0.01);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);

for (let i = 0; i < N * 2; i++) {
  buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(out[i] * norm * 32767))), 44 + i * 2);
}

fs.writeFileSync(path.join(dir, 'audio.wav'), buf);
console.log(`audio.wav successfully written (${DUR}s, peak before norm: ${peak.toFixed(2)})`);
