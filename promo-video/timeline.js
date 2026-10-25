// Shared timeline (v2 "Tactical Minimalism"): used by scene.js (browser) and audio.mjs (node).
// 120 BPM -> beat = 0.5 s, 16th = 0.125 s. Every scene boundary lands on a downbeat.
(function () {
  const T = {};
  T.fps = 30; T.dur = 40; T.beat = 0.5; T.bpm = 120;
  T.S = { hook: 0, logo: 2.5, quota: 5, form: 10, juri: 17, juara: 22, ticket: 29, cta: 35, end: 40 };
  T.cuts = [2.5, 5, 10, 17, 22, 29, 35];          // architectural column-mask transitions
  T.order = ['hook', 'logo', 'quota', 'form', 'juri', 'juara', 'ticket', 'cta'];

  // easing used for counters (decelerating odometer)
  const eOut3 = x => 1 - Math.pow(1 - x, 3);
  T.odo = (n, t0, d) => t => n * eOut3(Math.min(1, Math.max(0, (t - t0) / d)));
  T.tickTimes = (n, t0, d) => {
    const f = T.odo(n, t0, d), out = []; let prev = 0;
    for (let i = 0; i <= 2000; i++) { const t = t0 + d * i / 2000, v = Math.floor(f(t) + 1e-6); if (v !== prev) { out.push({ t, v }); prev = v; } }
    return out;
  };

  // --- scene events ---
  T.hook = { words: [0, 0.5, 1.0], dot: 1.5, meta: 1.75 };
  T.logo = { in: 2.6, sweep: [3.25, 4.25], caption: 3.5 };
  T.quota = { l1: 5.0, l2: 5.5, grid: 5.75, Q36: { n: 36, t0: 6.0, d: 1.5 }, split: 8.0, Q18: { n: 18, t0: 8.25, d: 1.0 } };
  T.form = { grid: 10.0, title: 10.25, danton: 11.0, inti0: 11.5, step: 0.125, cad: [14.5, 14.75, 15.0], dims: 14.25, axis: 15.5, total: 15.5 };
  T.juri = { panel: 17.0, rows: [17.75, 18.25], dash: 18.5, pct: { n: 100, t0: 19.0, d: 1.5 }, cells0: 19.0, cellStep: 0.125 };
  T.juara = { title: 22.0, plates: [22.5, 23.0], peleton0: 24.0, danton0: 25.75, step: 0.25 };
  T.ticket = { title: 29.0, cards: [29.5, 30.0], hl: [31.0, 31.5], note: 32.0 };
  T.cta = { title: 35.0, qr: [35.5, 36.1], lock: 36.5, rows: [37.0, 37.25, 37.5] };

  // derived event lists (for SFX)
  T.snaps = [T.form.danton];
  for (let i = 0; i < 21; i++) T.snaps.push(T.form.inti0 + i * T.form.step);
  T.cadSnaps = T.form.cad.slice();
  T.slides = [T.juri.panel, T.juri.dash, ...T.juara.plates, ...T.ticket.cards];
  T.shutters = [...T.cuts, T.cta.lock];
  T.rowTicks = [...T.quota.split ? [T.quota.split] : [], ...T.juri.rows,
    ...[0, 1, 2, 3, 4, 5].map(i => T.juara.peleton0 + i * T.juara.step),
    ...[0, 1, 2].map(i => T.juara.danton0 + i * T.juara.step),
    ...T.ticket.hl, ...T.cta.rows];
  T.cellTicks = []; for (let i = 0; i < 16; i++) T.cellTicks.push(T.juri.cells0 + i * T.juri.cellStep);

  if (typeof module !== 'undefined') module.exports = T; else window.T = T;
})();
