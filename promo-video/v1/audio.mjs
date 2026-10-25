// Offline synth: military snare cadence + electronic cinematic beat + SFX, synced to timeline.js
import fs from 'fs';
const T = (await import('./timeline.js')).default;
const SR = 44100, N = Math.floor(T.dur * SR);
const mk = () => new Float32Array(N);
const bus = { drums: [mk(), mk()], bass: [mk(), mk()], music: [mk(), mk()], fx: [mk(), mk()], send: mk() };
let seed = 12345;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const nz = () => rnd() * 2 - 1;
const lpCoef = fc => 1 - Math.exp(-2 * Math.PI * fc / SR);
const note = n => 440 * Math.pow(2, (n - 69) / 12);

function put(b, start, s, gain = 1, pan = 0, send = 0) {
  const i0 = Math.floor(start * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < s.length; i++) { const k = i0 + i; if (k < 0 || k >= N) continue; b[0][k] += s[i] * gl; b[1][k] += s[i] * gr; if (send) bus.send[k] += s[i] * send * gain; }
}
const gen = (dur, fn) => { const n = Math.floor(dur * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = fn(i / SR, i); return o; };

const kick = () => { let ph = 0; return gen(.45, (t) => { ph += 2 * Math.PI * (42 + 120 * Math.exp(-t * 28)) / SR; return Math.tanh(1.6 * Math.sin(ph)) * Math.exp(-t * 7) + (t < .004 ? nz() * .5 : 0); }); };
const snare = (v = 1) => { let p = 0, p2 = 0; return gen(.22, (t) => { const x = nz(), hp = x - p; p = x; const hp2 = hp - p2; p2 = hp; return (hp * .55 * Math.exp(-t * 22) + hp2 * .25 * Math.exp(-t * 11) + Math.sin(2 * Math.PI * 190 * t) * .45 * Math.exp(-t * 32)) * v; }); };
const rim = (v = 1) => gen(.06, t => (Math.sin(2 * Math.PI * 1700 * t) * .3 + nz() * .3) * Math.exp(-t * 90) * v);
const clap = (v = 1) => { let p = 0; return gen(.3, t => { const x = nz(), hp = x - p; p = x; const e = Math.exp(-t * 14) * (1 + .8 * Math.sin(t * 190) * Math.exp(-t * 60)); return hp * .5 * e * v; }); };
const hat = (open, v = 1) => { let p = 0, p2 = 0; return gen(open ? .25 : .05, t => { const x = nz(), hp = x - p; p = x; const h2 = hp - p2; p2 = hp; return h2 * .5 * Math.exp(-t * (open ? 16 : 70)) * v; }); };
const crash = (dur = 1.6, v = 1) => { let p = 0, p2 = 0; return gen(dur, t => { const x = nz(), hp = x - p; p = x; const h2 = hp - p2; p2 = hp; return h2 * .5 * Math.exp(-t * 2.8) * v; }); };
const impact = () => { let ph = 0; return gen(1.4, t => { ph += 2 * Math.PI * (34 + 40 * Math.exp(-t * 6)) / SR; return Math.sin(ph) * Math.exp(-t * 2.8) * .9; }); };
const tick = (f, v = 1) => gen(.05, t => (Math.sin(2 * Math.PI * f * t) + .4 * Math.sin(2 * Math.PI * f * 2.01 * t)) * Math.exp(-t * 90) * v);
const bell = (f, v = 1, d = .9) => gen(d, t => (Math.sin(2 * Math.PI * f * t) + .5 * Math.sin(2 * Math.PI * f * 2.76 * t) + .3 * Math.sin(2 * Math.PI * f * 5.4 * t)) * Math.exp(-t * (5 / d * 1.4)) * v * .5);
function whoosh(dur, up, v = 1) {
  let lo = 0, bd = 0; const n = Math.floor(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = i / n, q = up ? p : 1 - p, fc = 220 * Math.pow(26, q), f = 2 * Math.sin(Math.PI * Math.min(fc, 9000) / SR);
    const x = nz(), hi = x - lo - .35 * bd; bd += f * hi; lo += f * bd;
    const env = up ? Math.pow(p, 1.6) : Math.pow(1 - p, 1.6); o[i] = bd * env * v * 1.4;
  } return o;
}
function riser(dur, v = 1) { let ph = 0; const w = whoosh(dur, true, v * .6); for (let i = 0; i < w.length; i++) { const p = i / w.length; ph += 2 * Math.PI * (180 + 900 * p * p) / SR; w[i] += Math.sin(ph) * p * p * .12 * v; } return w; }
function brass(freqs, dur, v = 1) {
  const n = Math.floor((dur + .25) * SR), o = new Float32Array(n);
  freqs.forEach(f => [-.006, 0, .006].forEach(dt => {
    const ff = f * (1 + dt); let y1 = 0, y2 = 0, ph = Math.random();
    for (let i = 0; i < n; i++) {
      const t = i / SR, att = Math.min(1, t / .035), rel = t > dur ? Math.exp(-(t - dur) * 14) : 1, ex = Math.exp(-t * 2.2) * .5 + .5;
      const fc = 500 + 3200 * Math.exp(-t * 7) + 600, a = lpCoef(fc); ph += ff / SR; ph -= Math.floor(ph);
      const x = (ph * 2 - 1) + .3 * Math.sin(2 * Math.PI * ph * 2); y1 += a * (x - y1); y2 += a * (y1 - y2);
      o[i] += y2 * att * rel * ex * .11 * v / Math.sqrt(freqs.length);
    }
  })); return o;
}
function pad(freqs, dur, v = 1) {
  const n = Math.floor(dur * SR), o = new Float32Array(n);
  freqs.forEach(f => { let y = 0, ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += f * (1 + .002 * Math.sin(t * 4)) / SR; ph -= Math.floor(ph); y += lpCoef(900) * ((ph * 2 - 1) - y); o[i] += y * Math.min(1, t / .3) * Math.min(1, (dur - t) / .3) * .07 * v; } }); return o;
}
function bassNote(f, dur, v = 1) {
  let y = 0, ph = 0, ph2 = 0; return gen(dur, (t) => { ph += f / SR; ph -= Math.floor(ph); ph2 += f / 2 / SR; y += lpCoef(320 + 700 * Math.exp(-t * 14)) * ((ph * 2 - 1) - y); return (y * .7 + Math.sin(2 * Math.PI * ph2) * .5) * Math.min(1, t / .005) * Math.exp(-t * 3) * v * .8; });
}
function pluck(f, v = 1) { let y = 0, ph = 0; return gen(.22, t => { ph += f / SR; ph -= Math.floor(ph); y += lpCoef(300 + 5000 * Math.exp(-t * 24)) * ((ph * 2 - 1) - y); return y * Math.exp(-t * 14) * v * .5; }); }
function laser(a, b, up) {
  let ph = 0; return gen(b - a, (t) => { const p = t / (b - a), q = up ? 1 - p : p, f = 900 + 2600 * q + 60 * Math.sin(t * 60); ph += 2 * Math.PI * f / SR; return (Math.sin(ph + 1.5 * Math.sin(ph * 2.01)) * .5) * Math.min(1, t / .02) * Math.min(1, (b - a - t) / .05); });
}

const bar = 2, chords = [[62, 65, 69], [58, 62, 65], [65, 69, 72], [60, 64, 67]], roots = [38, 34, 41, 36];
const chordAt = t => Math.floor(t / bar) % 4;
const duck = [];
const kickTimes = []; for (let t = 0; t < T.dur - .4; t += T.beat) kickTimes.push(t);
const K = kick(); kickTimes.forEach(t => put(bus.drums, t, K, .95, 0));

// hook: ticking rim ramp + riser + snare roll into 2.0
put(bus.fx, 0, riser(2.0, 1), .5, 0, .1);
for (let t = 0; t < 1.5; t += .25) put(bus.drums, t, rim(.5 + t * .3), .5, (t * 4 % 2 ? .3 : -.3));
for (let i = 0; i < 24; i++) { const t = 1.5 + i * (.5 / 24); put(bus.drums, t, snare(.35 + .65 * i / 24), .7, 0, .05); }

// grooves from the first cut
const cad = [.9, 0, .4, .5, .8, 0, .4, .5, .9, 0, .4, .5, .8, .4, .6, .7];
for (let b = 1; b < T.dur / bar; b++) {
  const t0 = b * bar, ci = chordAt(t0);
  for (let s = 0; s < 16; s++) {
    const t = t0 + s * .125; if (t >= T.dur - .4) break;
    if (cad[s]) put(bus.drums, t, snare(cad[s] * .8), .6, (s % 2 ? .25 : -.25), .08);
    if (s % 4 === 2) put(bus.drums, t, hat(true, .5), .35, .3);
    else put(bus.drums, t, hat(false, .35 + (s % 2) * .2), .3, -.2);
    if (s === 4 || s === 12) put(bus.drums, t, clap(.8), .5, 0, .15);
    if (s % 2 === 0) put(bus.bass, t, bassNote(note(roots[ci] + (s % 8 === 6 ? 12 : 0)), .22, s % 4 === 0 ? 1 : .75), .8, 0);
    if (t0 >= 5 && s % 2 === 1) { const ch = chords[ci], nn = ch[(s >> 1) % 3] + 24 + ((s >> 3) % 2 ? 12 : 0); put(bus.music, t, pluck(note(nn), .8), .22, (s % 4 === 1 ? -.5 : .5), .2); }
  }
  put(bus.music, t0, pad(chords[ci].map(n => note(n)), bar + .1, 1), 1, 0, .2);
}
// pre-wipe snare rolls and risers + whoosh sweeps
T.wipes.forEach(tb => {
  for (let i = 0; i < 16; i++) { const t = tb - .5 + i * (.5 / 16) - .02; put(bus.drums, t, snare(.3 + .7 * i / 16), .6, 0, .05); }
  put(bus.fx, tb - .45, whoosh(.5, true, 1), .55, -.2, .15); put(bus.fx, tb, whoosh(.45, false, .8), .45, .3, .15);
  put(bus.fx, tb - .02, crash(1.0, .8), .3, 0, .1);
});
// accent hits: boom + brass stab + short whoosh
T.hits.forEach(([t, s]) => {
  const ci = chordAt(t), ch = chords[ci], big = s >= 3;
  put(bus.fx, t, impact(), .35 + .2 * s, 0, .1);
  put(bus.music, t, brass(ch.map(n => note(n)).concat(big ? ch.map(n => note(n + 12)) : []), big ? .9 : (s === 2 ? .3 : .18), .6 + s * .25), .8, 0, .25);
  if (big) put(bus.fx, t, crash(2.2, 1), .45, 0, .2);
  if (!T.cuts.includes(t) && t >= .3) put(bus.fx, t - .28, whoosh(.3, true, .8), .4, (Math.round(t * 10) % 2 ? .5 : -.5));
});
// counters / ticks
T.tickTimes(T.Q36.n, T.Q36.t0, T.Q36.d).forEach(({ t, v }) => put(bus.fx, t, tick(900 + v * 28, .9), .3, 0, .05));
T.tickTimes(T.Q18.n, T.Q18.t0, T.Q18.d).forEach(({ t, v }) => put(bus.fx, t, tick(1500 + v * 40, .8), .26, 0, .05));
T.tickTimes(T.J100.n, T.J100.t0, T.J100.d).forEach(({ t, v }) => { if (v % 2 === 0) put(bus.fx, t, tick(1800 + v * 8, .7), .2, 0, .05); });
for (let i = 0; i < 22; i++) put(bus.fx, T.sq.inti0 + i * T.sq.step + T.sq.land * .9, tick(700 + i * 55, .9), .25, (i % 3 - 1) * .4, .05);
T.sq.cad.forEach(t => put(bus.fx, t + T.sq.land * .9, tick(520, 1), .3, 0, .1));
put(bus.fx, T.sq.danton + T.sq.land * .9, bell(1568, .8, .6), .3, 0, .3);
// judging bleeps
const pent = [74, 77, 79, 81, 84, 86];
for (let t = 16.4, i = 0; t < 19; t += .125, i++) put(bus.fx, t, tick(note(pent[Math.floor(R(i) * 6)] + 12), .6), .12, (i % 2 ? .6 : -.6), .3);
function R(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
// trophy sparkle + fanfare
[86, 89, 93, 98].forEach((n, i) => put(bus.fx, 19.4 + i * .08, bell(note(n), .8, 1.2), .3, (i - 1.5) * .4, .5));
[[62, 0], [65, .14], [69, .28], [74, .42]].forEach(([n, d]) => put(bus.music, 24.9 + d, brass([note(n), note(n + 12)], n === 74 ? 1.0 : .13, 1), .9, 0, .3));
put(bus.fx, 25.4, crash(2, 1), .35, 0, .2);
// price dings
[26.3, 27.1].forEach(t => { put(bus.fx, t + .05, bell(2093, .9, .7), .35, 0, .3); put(bus.fx, t + .1, bell(3136, .6, .5), .3, 0, .3); });
[0, .1, .2].forEach((d, i) => put(bus.fx, T.stamp + d, bell(note(81 + i * 4), 1, 1.4), .35, 0, .5));
// laser scans
T.scan.passes.forEach(([a, b], i) => put(bus.fx, a, laser(a, b, i % 2 === 1), .22, i % 2 ? .4 : -.4, .25));
[0, .1, .2, .3].forEach((d, i) => put(bus.fx, T.scan.lock + d, bell(note(74 + [0, 4, 7, 12][i]), 1, 1.8), .35, (i - 1.5) * .4, .6));
put(bus.music, T.scan.lock, brass([note(50), note(57), note(62), note(65), note(69), note(74)], 1.6, 1.1), .9, 0, .35);

// reverb on send bus (stereo comb/allpass)
function reverb(src, delays, fb) {
  const out = new Float32Array(N);
  delays.forEach(d => { const buf = new Float32Array(d); let idx = 0, damp = 0; for (let i = 0; i < N; i++) { const y = buf[idx]; damp += .4 * (y - damp); buf[idx] = src[i] + damp * fb; out[i] += y; idx = (idx + 1) % d; } });
  [225, 556].forEach(d => { const buf = new Float32Array(d); let idx = 0; for (let i = 0; i < N; i++) { const y = buf[idx], x = out[i] - .5 * y; buf[idx] = x; out[i] = y + .5 * x; idx = (idx + 1) % d; } });
  return out;
}
const revL = reverb(bus.send, [1557, 1617, 1491, 1422, 1277, 1356], .84), revR = reverb(bus.send, [1580, 1640, 1514, 1445, 1300, 1379], .84);

// sidechain duck on bass+music, then master
const L = new Float32Array(N), Rr = new Float32Array(N);
const duckEnv = new Float32Array(N).fill(1);
kickTimes.forEach(t => { const i0 = Math.floor(t * SR); for (let i = 0; i < SR * .35 && i0 + i < N; i++) duckEnv[i0 + i] = Math.min(duckEnv[i0 + i], 1 - .55 * Math.exp(-i / SR * 9)); });
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let l = bus.drums[0][i] + bus.fx[0][i] + (bus.bass[0][i] * 1.1 + bus.music[0][i]) * duckEnv[i] + revL[i] * .35;
  let r = bus.drums[1][i] + bus.fx[1][i] + (bus.bass[1][i] * 1.1 + bus.music[1][i]) * duckEnv[i] + revR[i] * .35;
  const fade = Math.min(1, Math.max(0, (T.dur - t) / .6)), fin = Math.min(1, t / .02);
  L[i] = Math.tanh(l * .75) * fade * fin; Rr[i] = Math.tanh(r * .75) * fade * fin;
}
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(Rr[i]));
const g = .89 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Rr[i] * g * 32767), 46 + i * 4); }
fs.writeFileSync(new URL('./audio.wav', import.meta.url), buf);
console.log('audio.wav written, peak before norm', peak.toFixed(2));
