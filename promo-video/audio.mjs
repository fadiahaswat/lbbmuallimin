// v2 audio: dry acoustic marching snare cadence + minimal sub-bass pulse + tactile UI SFX.
// Fully synced to timeline.js. No pads, brass, lasers or big cinematic hits.
import fs from 'fs';
const T = (await import('./timeline.js')).default;
const SR = 44100, N = Math.floor(T.dur * SR);
const mk = () => new Float32Array(N);
const bus = { snare: [mk(), mk()], sub: [mk(), mk()], fx: [mk(), mk()] };
let seed = 2027;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const nz = () => rnd() * 2 - 1;

function put(b, start, s, gain = 1, pan = 0) {
  const i0 = Math.floor(start * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < s.length; i++) { const k = i0 + i; if (k < 0 || k >= N) continue; b[0][k] += s[i] * gl; b[1][k] += s[i] * gr; }
}
const gen = (dur, fn) => { const n = Math.floor(dur * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = fn(i / SR, i); return o; };
// RBJ biquad
function biquad(type, f, Q = 0.707) {
  const w = 2 * Math.PI * f / SR, a = Math.sin(w) / (2 * Q), c = Math.cos(w); let b0, b1, b2, a0, a1, a2;
  if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
  if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
  if (type === 'bp') { b0 = a; b1 = 0; b2 = -a; }
  a0 = 1 + a; a1 = -2 * c; a2 = 1 - a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x => { const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}

/* ---------- instruments ---------- */
// dry acoustic field snare: tuned shell + wire buzz + stick transient
function snare(v = 1) {
  const hp = biquad('hp', 1800), bp = biquad('bp', 5200, 0.6), lp = biquad('lp', 11000);
  let p1 = 0, p2 = 0; const tone = 0.9 + 0.2 * rnd();
  return gen(0.32, t => {
    const f1 = (185 + 70 * Math.exp(-t * 90)) * tone; p1 += 2 * Math.PI * f1 / SR; p2 += 2 * Math.PI * 332 * tone / SR;
    const body = Math.sin(p1) * Math.exp(-t * 26) * 0.55 + Math.sin(p2) * Math.exp(-t * 40) * 0.22;
    const n = nz(), wires = lp(bp(hp(n)) * 1.6 + hp(n) * 0.25) * Math.exp(-t * (13 + (1 - v) * 10));
    const stick = t < 0.0025 ? nz() * 0.9 : 0;
    return (body * (0.6 + 0.4 * v) + wires * 1.1 + stick * v) * v;
  });
}
const SN = []; for (let i = 0; i < 24; i++) SN.push(snare(1));   // pre-rendered variations (velocity by gain)
const snareAt = (t, v, pan = 0) => put(bus.snare, t, SN[Math.floor(rnd() * SN.length)], v * (0.85 + 0.15 * rnd()), pan + (rnd() - .5) * .1);
const ghostAt = (t, v) => put(bus.snare, t, snare(Math.max(.15, v)), v * .7, (rnd() - .5) * .2);
function hitAt(t, v = 1, flam = true) { if (flam) ghostAt(t - 0.018, .3 * v); snareAt(t, v); }
function rollTo(tb, dur = 0.5, v0 = .2, v1 = .85) {
  const n = Math.round(dur / 0.03125); for (let i = 0; i < n; i++) { const p = i / n; ghostAt(tb - dur + i * 0.03125 + (rnd() - .5) * .003, v0 + (v1 - v0) * p * p); }
}
// sub-bass pulse
function sub(v = 1, len = 0.7) { let ph = 0; return gen(len, t => { ph += 2 * Math.PI * (44 + 16 * Math.exp(-t * 30)) / SR; return Math.sin(ph) * Math.min(1, t / 0.006) * Math.exp(-t * 5.2) * v; }); }
const subAt = (t, v = 1, len) => put(bus.sub, t, sub(1, len), v);
// tactile UI
function shutter(v = 1) {
  const hpA = biquad('hp', 2500), hpB = biquad('hp', 3200); let ph = 0;
  return gen(0.12, t => {
    let s = 0;
    if (t < 0.008) s += hpA(nz()) * Math.exp(-t * 500) * 1.1;
    if (t > 0.046 && t < 0.056) s += hpB(nz()) * Math.exp(-(t - 0.046) * 600) * 0.8;
    ph += 2 * Math.PI * 140 / SR; s += Math.sin(ph) * Math.exp(-t * 90) * 0.35 * (t < 0.04 ? 1 : 0);
    return s * v;
  });
}
function paper(dur = 0.24, v = 1) { const bp = biquad('bp', 2600, 0.7), lp = biquad('lp', 6000); return gen(dur, t => { const p = t / dur; return lp(bp(nz())) * Math.pow(Math.sin(Math.PI * p), 1.5) * (1 - p * .4) * v * 2.2; }); }
function tick(f = 2300, v = 1) { return gen(0.03, t => (Math.sin(2 * Math.PI * f * t) * .8 + Math.sin(2 * Math.PI * f * 2.02 * t) * .2) * Math.exp(-t * 260) * v); }

/* ---------- arrangement ---------- */
// HOOK (0–2.5): word hits with sub, roll into the first mask cut
T.hook.words.forEach((t, i) => { hitAt(t, .85 + i * .05); subAt(t, .8); });
snareAt(T.hook.dot, .45);
rollTo(2.5, 0.5, .15, .8);
// IDENT (2.5–5): sparse — accent on the cut, sub on each beat 1 & 3, light ghosts
hitAt(2.5, 1); subAt(2.5, 1, 1.0);
[3.5, 4.0].forEach(t => subAt(t, .45));
[3.0, 3.5, 4.0].forEach(t => ghostAt(t + .25, .22));
rollTo(5.0, 0.5, .15, .8);
// MAIN CADENCE (5–35): 2-bar street beat at 120 BPM, 16ths
const PAT = [1, 0, .28, .28, .7, 0, .3, 0, .9, 0, .28, .28, .7, .3, .5, .3];
const FILL = [.8, .3, .5, .3, .9, .4, .6, .4, 1, .45, .65, .45, .8, .5, .7, .55];
for (let bar = 0; bar < 15; bar++) {
  const t0 = 5 + bar * 2, nextCut = T.cuts.find(c => c > t0 && c <= t0 + 2.0001);
  for (let s = 0; s < 16; s++) {
    const t = t0 + s * 0.125;
    if (nextCut && t >= nextCut - 0.5) continue;                 // leave room for the pre-cut roll
    const v = (bar % 4 === 3 && s >= 8 ? FILL : PAT)[s]; if (!v) continue;
    if (s === 0 || s === 8) hitAt(t, v, true); else if (v >= .6) snareAt(t, v, s % 2 ? .15 : -.15); else ghostAt(t, v);
  }
  for (let b = 0; b < 4; b += 2) subAt(t0 + b * 0.5, T.cuts.includes(t0 + b * .5) ? 1 : .6);
  if (nextCut) rollTo(nextCut, 0.5, .18, .85);
}
T.cuts.slice(1).forEach(c => hitAt(c, 1));
// CTA (35–40): cadence drops out — accent, then sub pulse and a single closing rimshot
subAt(35, 1.1, 1.2);
[36, 37, 38].forEach(t => subAt(t, .4));
ghostAt(37.5, .25); ghostAt(38.5, .25);
hitAt(39.0, .9); subAt(39.0, .9, 1.0);

/* ---------- tactile SFX ---------- */
T.shutters.forEach((t, i) => put(bus.fx, t - 0.005, shutter(i === T.shutters.length - 1 ? 1 : .8), .55, (i % 2 ? .25 : -.25)));
T.slides.forEach((t, i) => put(bus.fx, t - 0.04, paper(0.26, 1), .35, (i % 2 ? .3 : -.3)));
// odometer ticks
T.tickTimes(36, T.quota.Q36.t0, T.quota.Q36.d).forEach(({ t, v }) => put(bus.fx, t, tick(2000 + v * 12, .8), .16, 0));
T.tickTimes(18, T.quota.Q18.t0, T.quota.Q18.d).forEach(({ t, v }) => { put(bus.fx, t, tick(2200, .7), .12, -.3); put(bus.fx, t + .01, tick(2250, .7), .12, .3); });
T.tickTimes(100, T.juri.pct.t0, T.juri.pct.d).forEach(({ t, v }) => { if (v % 4 === 0) put(bus.fx, t, tick(2600, .6), .1, 0); });
// formation snaps (muted digital ticks, panned by column)
T.snaps.forEach((t, i) => put(bus.fx, t, tick(i === 0 ? 1500 : 1900 + (i % 3) * 120, 1), .22, i === 0 ? 0 : ((i - 1) % 3 - 1) * .45));
T.cadSnaps.forEach((t, i) => put(bus.fx, t, tick(1300, 1), .2, (i - 1) * .45));
T.cellTicks.forEach((t, i) => put(bus.fx, t, tick(2400 + (i % 4) * 100, .8), .14, ((i % 4) - 1.5) * .25));
T.rowTicks.forEach((t, i) => put(bus.fx, t, tick(1700, .8), .15, (i % 2 ? .2 : -.2)));
for (let r = 0; r < 10; r++) put(bus.fx, T.cta.qr[0] + r * (T.cta.qr[1] - T.cta.qr[0]) / 10, tick(2100 + r * 30, .7), .12, 0);

/* ---------- mix ---------- */
// tiny dry room on the snare bus only (early reflections)
const ER = [[0.0113, .16], [0.0171, .12], [0.0237, .09], [0.0311, .06]];
const room = [mk(), mk()];
for (let ch = 0; ch < 2; ch++) { const lp = biquad('lp', 5000); for (let i = 0; i < N; i++) { let s = 0; ER.forEach(([d, g], k) => { const j = i - Math.floor((d + (ch ? .0013 * k : 0)) * SR); if (j >= 0) s += bus.snare[ch][j] * g; }); room[ch][i] = lp(s); } }
const subLP = [biquad('lp', 120), biquad('lp', 120)];
const out = [mk(), mk()];
for (let i = 0; i < N; i++) {
  const t = i / SR, fade = Math.min(1, Math.max(0, (T.dur - t) / 0.5)), fin = Math.min(1, t / 0.01);
  for (let ch = 0; ch < 2; ch++) {
    const x = bus.snare[ch][i] * .9 + room[ch][i] + subLP[ch](bus.sub[ch][i]) * 1.25 + bus.fx[ch][i];
    out[ch][i] = Math.tanh(x * .4) * fade * fin;
  }
}
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[0][i]), Math.abs(out[1][i]));
const g = .89 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(out[0][i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(out[1][i] * g * 32767), 46 + i * 4); }
fs.writeFileSync(new URL('./audio.wav', import.meta.url), buf);
console.log('audio.wav written:', T.dur + 's', 'peak before norm', peak.toFixed(2));
