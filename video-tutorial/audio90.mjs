import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, DUR = 90, N = SR * DUR;
const cues = JSON.parse(fs.readFileSync(path.join(dir, 'cues90.json'), 'utf8'));

const mL = new Float32Array(N), mR = new Float32Array(N); // music bus
const sL = new Float32Array(N), sR = new Float32Array(N); // sfx bus

let seed = 98765;
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
    const f = 1200 + rnd() * 400;
    put(sL, sR, t, .05, u => (noise() * Math.exp(-u / .0025) * .5 + Math.sin(TAU * f * u) * Math.exp(-u / .012) * .3), pan, .5 * v);
  },
  clocktick(t, v, pan) {
    put(sL, sR, t, .04, u => noise() * Math.exp(-u / .003) * .6 + Math.sin(TAU * 1800 * u) * Math.exp(-u / .01) * .4, pan, .4 * v);
  },
  click(t, v, pan) {
    put(sL, sR, t, .08, u => noise() * Math.exp(-u / .004) * .7 + Math.sin(TAU * 2400 * u) * Math.exp(-u / .018) * .4, pan, .7 * v);
  },
  pop(t, v, pan) {
    put(sL, sR, t, .25, u => Math.sin(TAU * (280 * u + 500 * .03 * (1 - Math.exp(-u / .03)))) * Math.exp(-u / .06), pan, .85 * v);
  },
  stomp(t, v, pan) {
    // Boot stomp / military step
    const f = svf();
    put(sL, sR, t, .3, u => f(noise(), 180, .7, 'lp') * Math.exp(-u / .08) * 1.6 + Math.sin(TAU * (65 * u)) * Math.exp(-u / .12) * 1.2, pan, 1.0 * v);
  },
  whistle(t, v, pan) {
    // Short referee/military whistle
    put(sL, sR, t, .22, u => {
      const f1 = 2800 + 120 * Math.sin(TAU * 35 * u);
      const f2 = 3100 + 100 * Math.cos(TAU * 35 * u);
      return (Math.sin(TAU * f1 * u) + Math.sin(TAU * f2 * u) + noise() * .15) * Math.min(1, u / .02) * Math.exp(-u / .15);
    }, pan, .6 * v);
  },
  beep(t, v, pan) {
    put(sL, sR, t, .12, u => Math.sin(TAU * 1850 * u) * Math.exp(-u / .06) * .5, pan, .6 * v);
  },
  tech(t, v, pan) {
    put(sL, sR, t, .2, u => (Math.sin(TAU * 1760 * u) + Math.sin(TAU * 2637 * u) * .5) * Math.exp(-u / .08) * .5, pan, .7 * v);
  },
  stamp(t, v, pan) {
    const f = svf();
    put(sL, sR, t, .35, u => f(noise(), 350, .6, 'lp') * Math.exp(-u / .06) * 1.5 + Math.sin(TAU * 90 * u) * Math.exp(-u / .12) * 1.2, pan, .9 * v);
  },
  paper(t, v, pan) {
    const f = svf();
    put(sL, sR, t, .28, u => f(noise(), 1600 + 800 * u, .4, 'bp') * Math.sin(Math.PI * Math.min(1, u / .28)) * .8, pan, .6 * v);
  },
  ding(t, v, pan) {
    put(sL, sR, t, .8, u => (Math.sin(TAU * 1568 * u) + .4 * Math.sin(TAU * 3136 * u) * Math.exp(-u / .1)) * Math.exp(-u / .2) * .4, pan, .75 * v);
  },
  pin(t, v, pan) {
    put(sL, sR, t, .25, u => Math.sin(TAU * (880 + 440 * Math.exp(-u / .05)) * u) * Math.exp(-u / .08) * .7, pan, .8 * v);
  },
  cash(t, v, pan) {
    put(sL, sR, t, .4, u => (Math.sin(TAU * 2093 * u) + Math.sin(TAU * 2793 * u) * .7) * Math.exp(-u / .12) * .5 + noise() * Math.exp(-u / .01) * .2, pan, .75 * v);
  },
  sparkle(t, v, pan) {
    const f = 2400 + rnd() * 2600;
    put(sL, sR, t, .18, u => Math.sin(TAU * f * u) * Math.exp(-u / .03) * .4, rnd() * 2 - 1, .4 * v);
  },
  sparkleBell(t, v, pan) {
    [2093, 2637, 3136, 4186].forEach((fr, i) => put(sL, sR, t + i * .05, .8, u => Math.sin(TAU * fr * u) * Math.exp(-u / .25) * .35, (i - 1.5) * .4, v));
  },
  brass(t, v, pan) {
    // Powerful brass stab chord
    const chord = [220, 277.18, 329.63, 440, 554.37];
    chord.forEach((fr, i) => {
      const fl = svf();
      put(sL, sR, t, 1.4, u => {
        const env = Math.min(1, u / .03) * Math.exp(-u / .5);
        return fl(saw(fr * u) * .5 + sq(fr * 1.003 * u) * .3, 1800 * Math.exp(-u / .4) + 600, .6, 'lp') * env * .25;
      }, (i - 2) * .2, v);
    });
  },
  snareroll(t, v, pan) {
    // Military snare roll
    const len = 1.0;
    for (let st = 0; st < len; st += .045) {
      const f = svf(), dynamic = Math.min(1, (st / len) ** 1.3);
      put(sL, sR, t + st, .06, u => f(noise(), 3200, .4, 'hp') * Math.exp(-u / .015) * 1.1 + Math.sin(TAU * 210 * u) * Math.exp(-u / .02) * .6, (rnd() - .5) * .3, dynamic * v * .8);
    }
  },
  whoosh(t, v, pan) {
    const f = svf(), d = .75;
    put(sL, sR, t, d, (u) => {
      const k = u / d, env = Math.sin(Math.PI * Math.pow(k, .7)) ** 1.5;
      return f(noise(), 250 * Math.pow(18, k), .35, 'bp') * env * 2.2;
    }, pan, .85 * v);
  },
  riser(t, v) {
    const f = svf(), d = 1.3;
    put(sL, sR, t, d, u => { const k = u / d; return (f(noise(), 300 * Math.pow(30, k), .25, 'bp') * 2) * k * k }, 0, .85 * v);
  },
  boom(t, v) {
    const f = svf();
    put(sL, sR, t, 1.8, u => Math.sin(TAU * (36 * u + 70 * .12 * (1 - Math.exp(-u / .12)))) * Math.exp(-u / .55) * 1.3 + f(noise(), 220, .6, 'lp') * Math.exp(-u / .25) * .9, 0, 1.0 * v);
  },
  glitch(t, v) {
    const f = svf();
    for (let k = 0; k < 6; k++) {
      put(sL, sR, t + k * .04, .03, u => f(noise(), 2000 + rnd() * 4000, .2, 'bp') * Math.exp(-u / .008) * 1.5, (rnd() - .5) * .8, .7 * v);
    }
  },
  chime(t, v) {
    const notes = [1046.5, 1318.5, 1568, 2093];
    notes.forEach((fr, i) => put(sL, sR, t + i * .075, 1.6, u => Math.sin(TAU * fr * u) * Math.exp(-u / .4) * .35, (i - 1.5) * .3, .8 * v));
  }
};

for (const c of cues) {
  if (sfx[c.type]) sfx[c.type](c.t, c.vol ?? 1, c.pan ?? 0);
}

/* ================= MUSIC (128 BPM, 90s = 48 Bars) =================
   Military March meets Modern Electronic Percussion
   Key: D minor (Dm - Bb - F - C / Dm - Gm - A7 - Dm)
===================================================================== */
const BPM = 128, beat = 60 / BPM, bar = beat * 4; // bar = 1.875s -> 48 bars = 90s
const progression = [
  { root: 50, tones: [62, 65, 69] }, // Dm
  { root: 46, tones: [58, 62, 65] }, // Bb
  { root: 41, tones: [57, 60, 65] }, // F
  { root: 48, tones: [60, 64, 67] }, // C
  { root: 50, tones: [62, 65, 69] }, // Dm
  { root: 43, tones: [58, 62, 67] }, // Gm
  { root: 45, tones: [57, 61, 64] }, // A
  { root: 50, tones: [62, 65, 69] }, // Dm
];

const totalBars = 48;
const duck = t => { const ph = (t % beat); return 1 - .65 * Math.exp(-ph / .13) };

// 1. Kick (Four on the floor + military double-taps on phrase ends)
for (let b = 0; b < totalBars * 4; b++) {
  const t = b * beat; if (t > 89.2) break;
  // Intro has sparser kick (bars 0-1)
  if (b < 8 && b % 2 !== 0) continue;
  put(mL, mR, t, .28, u => Math.sin(TAU * (52 * u + 120 * .035 * (1 - Math.exp(-u / .035)))) * Math.exp(-u / .12) * 1.1 + noise() * Math.exp(-u / .004) * .18, 0, .95);
  // Snappy double-kick fill every 8 beats
  if (b % 8 === 7) {
    put(mL, mR, t + beat * .5, .2, u => Math.sin(TAU * 55 * u) * Math.exp(-u / .08) * .8, 0, .7);
  }
}

// 2. Military March Snares & Claps
for (let b = 0; b < totalBars * 4; b++) {
  const t = b * beat; if (t > 89.2) break;
  // Snare on 2 and 4
  if (b % 2 === 1) {
    const f = svf();
    put(mL, mR, t, .26, u => {
      const burst = Math.exp(-((u % .012)) / .004) * (u < .036 ? 1 : .3);
      return f(noise(), 1600, .45, 'bp') * (burst * .6 + Math.exp(-u / .07) * .7) * 1.25;
    }, 0, .6);
  }
  // Marching 16th ghost notes
  if (b >= 8) {
    for (const o of [0.25, 0.5, 0.75]) {
      const f = svf();
      put(mL, mR, t + o * beat, .05, u => f(noise(), 2800, .4, 'hp') * Math.exp(-u / .018) * .35, (rnd() - .5) * .4, .3);
    }
  }
}

// 3. Hi-Hats & Ride Cymbal
for (let b = 0; b < totalBars * 4; b++) {
  const t = b * beat + beat / 2; if (t > 89.2) break;
  const f = svf();
  put(mL, mR, t, .12, u => f(noise(), 7500, .3, 'hp') * Math.exp(-u / .04) * .5, .25, .4);
}

// 4. Bass Line (Rolling 16th driving electro-march bass)
for (let b = 2; b < totalBars * 4; b++) {
  const barIdx = Math.floor(b / 4);
  const ch = progression[barIdx % 8];
  for (let s = 0; s < 4; s++) {
    const t = b * beat + s * (beat / 4); if (t > 89.0) break;
    const note = ch.root + (s === 2 ? 7 : (s === 3 ? 12 : 0));
    const f0 = mtof(note), fl = svf();
    put(mL, mR, t, beat / 3, u => {
      const env = Math.exp(-u / .14) * Math.min(1, u / .006);
      return fl(saw(f0 * u) * .65 + sq(f0 * u * 1.002) * .3, 900, .65, 'lp') * env * .8 * duck(t + u);
    }, (s % 2 ? -.1 : .1), .8);
  }
}

// 5. Epic Brass / Synth Chords
for (let barIdx = 0; barIdx < totalBars; barIdx++) {
  const ch = progression[barIdx % 8], t0 = barIdx * bar, len = bar + .1;
  if (t0 > 89.0) break;
  for (const m of ch.tones) {
    for (const det of [-.08, 0, .08]) {
      const f = mtof(m + det * .3), fl = svf();
      put(mL, mR, t0, len, (u) => {
        const e = Math.min(1, u / .06) * Math.min(1, (len - u) / .1);
        return fl(saw(f * (t0 + u)) * .45 + tri(f * 2 * u) * .2, 1600 + 600 * Math.min(1, u / .4), .55, 'lp') * e * .085 * duck(t0 + u);
      }, det * 3, 1);
    }
  }
}

// 6. Arpeggiator Lead
for (let s = 0; s < totalBars * 16; s++) {
  const t = s * (beat / 4); if (t < 2 * bar || t > 88.5) continue;
  const barIdx = Math.floor(s / 16), ch = progression[barIdx % 8];
  const pat = [0, 1, 2, 1, 2, 0, 1, 2, 0, 2, 1, 2, 0, 1, 2, 1][s % 16];
  const m = ch.tones[pat] + 12, f = mtof(m), fl = svf();
  put(mL, mR, t, .26, u => fl(saw(f * u) * .5 + sq(f * u * 1.006) * .35, 2600 * Math.exp(-u / .08) + 800, .5, 'lp') * Math.exp(-u / .09) * .18 * duck(t + u), Math.sin(s * .8) * .4, 1);
}

/* ================= FINAL MASTERING MIX ================= */
const out = new Float32Array(N * 2);
const MUSIC = .58, SFX_VOL = 1.0;
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fadeIn = Math.min(1, t / .06), fadeOut = Math.min(1, Math.max(0, (DUR - t) / 1.0));
  let l = mL[i] * MUSIC * fadeOut + sL[i] * SFX_VOL, r = mR[i] * MUSIC * fadeOut + sR[i] * SFX_VOL;
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
fs.writeFileSync(path.join(dir, 'audio90.wav'), buf);
console.log('audio90.wav written, peak before norm', peak.toFixed(2));
