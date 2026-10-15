// Shared timeline: used by the canvas scene (browser) and the audio synth (node).
(function () {
  const T = {};
  T.fps = 30; T.dur = 38; T.beat = 0.5;
  T.S = { hook: 0, logo: 2, quota: 5, squad: 9, juri: 14, trophy: 19, price: 26, cta: 31.5, end: 38 };
  T.hookWords = [0, 0.5, 1.0];
  T.cuts = [2, 2.5, 3, 3.5, 4];
  T.wipes = [5, 9, 14, 19, 26, 31.5];
  // [time, strength 1..3] accent hits: camera punch + boom + brass stab
  T.hits = [
    [0, 1], [0.5, 1], [1.0, 2], [2.0, 3], [2.5, 2], [3.0, 2], [3.5, 2], [4.0, 3],
    [5.2, 2], [7.15, 3], [7.5, 1],
    [9.45, 2], [12.6, 3],
    [14.6, 2], [15.1, 1], [15.4, 1], [16.1, 2],
    [19.6, 2], [21.0, 2], [21.4, 2], [23.0, 2], [24.2, 2],
    [26.3, 2], [27.1, 2], [28.8, 3],
    [31.8, 2], [32.3, 2], [35.6, 3],
  ];
  T.flash = [2.0, 2.5, 3.0, 3.5, 4.0, 7.15, 28.8, 35.6];

  const eq = x => 1 - (1 - x) * (1 - x);
  T.counter = (n, t0, d, ease) => { ease = ease || eq; return t => Math.round(n * ease(Math.min(1, Math.max(0, (t - t0) / d)))); };
  T.tickTimes = (n, t0, d, ease) => {
    ease = ease || eq; const out = []; let prev = 0; const steps = Math.ceil(d * 1000);
    for (let i = 0; i <= steps; i++) { const v = Math.round(n * ease(i / steps)); if (v !== prev) { out.push({ t: t0 + d * i / steps, v }); prev = v; } }
    return out;
  };
  T.Q36 = { n: 36, t0: 5.6, d: 1.5 };
  T.Q18 = { n: 18, t0: 7.6, d: 0.9 };
  T.J100 = { n: 100, t0: 16.4, d: 1.5 };
  T.sq = { danton: 9.45, inti0: 9.95, step: 0.05, cad: [11.9, 12.05, 12.2], ripple: 12.8, land: 0.4 };
  T.scan = { start: 33.0, passes: [[33.0, 33.9], [33.9, 34.8], [34.8, 35.5]], lock: 35.6 };
  T.stamp = 28.8;
  T.trophy = { show: 19.2, title: 19.6, cards: [21.0, 21.4], bars: [23.0, 24.2] };
  T.price = { cards: [26.3, 27.1], stamp: 28.8 };
  T.juri = { medal: 14.2, title: 14.6, badges: [15.1, 15.4], panel: 16.1 };

  if (typeof module !== 'undefined') module.exports = T; else window.T = T;
})();
