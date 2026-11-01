// Timeline: "Panduan Teknis Lapangan & Aturan Main" (Tactical Minimalism, 50s, SFX Only)
// Shared by scene_teknis.js (browser) and audio_teknis.mjs (node).
(function () {
  const T = {};
  T.fps = 30;
  T.dur = 50;
  // Cuts: Hook (0-5) | Arena (5-13) | Kotak Danton & Garis (13-22) | Timekeeper (22-31) | Regulasi Bebas Penalti (31-40) | DP & Souvenir (40-45) | CTA (45-50)
  T.cuts = [5, 13, 22, 31, 40, 45];

  T.hook = {
    tag: 0.1,
    logo: 0.25,
    l: [0.45, 0.85, 1.35, 1.75],
    sub: 2.35
  };

  T.arena = {
    label: 5.05,
    card1: 5.4,
    grid1: 5.7,
    dim1: 6.1,
    dur1: 6.5,
    card2: 8.2,
    grid2: 8.5,
    dim2: 8.9,
    dur2: 9.3,
    note: 10.6
  };

  T.kotak = {
    label: 13.05,
    map: 13.4,
    dantonMove: [13.9, 14.8],
    rules: [15.0, 15.4],
    divider: 16.3,
    asasTitle: 16.5,
    bootLegal: 17.0,
    bootStep: [18.1, 18.7],
    flag: 18.85,
    exc: 20.1
  };

  T.time = {
    label: 22.05,
    clock: 22.35,
    startEvt: 22.8,
    w1: 24.4,       // Whistle 1x long (1.05s)
    w2: 26.6,       // Whistle 2x long
    stopEvt: 28.85,
    note: 29.4
  };

  T.free = {
    label: 31.05,
    c1: 31.4,
    c1Badge: 32.0,
    c2: 33.8,
    c2Badge: 34.4,
    c3: 36.2,
    c3Badge: 36.8,
    note: 37.9
  };

  T.dp = {
    label: 40.05,
    z0: 40.35,
    z1: 41.0,
    z2: 41.65,
    clear: 42.3,
    bib: 43.0
  };

  T.cta = {
    l1: 45.05,
    l2: 45.35,
    bar: 45.75,
    qr: [46.15, 46.7],
    lock: 47.05,
    scan: 47.25,
    rows: [47.55, 47.8, 48.05]
  };

  // Derived SFX cues (SFX ONLY - zero music/snare)
  T.shutters = [
    0.45, 1.35,
    ...T.cuts,
    T.kotak.flag,
    T.time.startEvt,
    T.time.stopEvt,
    T.dp.bib,
    T.cta.lock
  ];

  T.slides = [
    T.arena.card1, T.arena.card2,
    T.kotak.map, T.kotak.bootLegal,
    T.time.clock,
    T.free.c1, T.free.c2, T.free.c3,
    T.dp.z0, T.dp.z1, T.dp.z2, T.dp.bib
  ];

  T.typeRuns = [
    [T.hook.tag, 38],
    [T.hook.sub, 42],
    [T.arena.label, 38],
    [T.arena.note, 48],
    [T.kotak.label, 42],
    [T.kotak.exc, 52],
    [T.time.label, 40],
    [T.time.note, 46],
    [T.free.label, 42],
    [T.free.note, 48],
    [T.dp.label, 38],
    [T.dp.clear, 48],
    [T.cta.bar + 0.1, 40],
    [T.cta.scan, 38]
  ];

  T.dings = [
    T.arena.dur1, T.arena.dur2,
    T.kotak.bootLegal + 0.3,
    T.free.c1Badge, T.free.c2Badge, T.free.c3Badge,
    T.dp.bib + 0.35
  ];

  T.whistles = [
    [T.time.w1, 1.05],               // 1x Peluit Panjang
    [T.time.w2, 0.78],               // 2x Peluit Panjang (part 1)
    [T.time.w2 + 0.98, 0.85]         // 2x Peluit Panjang (part 2)
  ];

  T.warnings = [
    T.kotak.flag                     // Pelanggaran garis + kibasan bendera
  ];

  T.footsteps = [
    14.0, 14.25, 14.5, 14.75,        // Danton melangkah ke kotak
    18.35, 18.68                     // Sepatu melangkah menginjak garis
  ];

  T.rowTicks = [
    T.arena.dim1, T.arena.dim2,
    ...T.kotak.rules,
    T.kotak.asasTitle,
    ...T.cta.rows
  ];

  if (typeof module !== 'undefined') module.exports = T; else window.T = T;
})();
