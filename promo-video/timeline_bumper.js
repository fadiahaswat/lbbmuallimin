// Shared timeline for LBB Mu'allimin 2027 — Official Bumper Logo Motion (9:16)
// Theme: "Tactical Minimalism" (Slowmo ~8.0s Edition with Transparent Intro Overlay)
(function () {
  const T = {};
  T.fps = 60;
  T.dur = 8.0;

  // Background Obsidian stage fade-in from transparent:
  // User: "awalnya itu gaada latar alias transparan nanti sebelum logonya jadi baru muncul fade-in gtu latar hitamnya"
  // "fade in latarnya buat lebih slowmo lagi jadi kayak seamless gtu"
  // Extended slowmo fade-in over 2.85s (2.00s -> 4.85s) for a buttery-smooth seamless transition!
  T.bgFadeInStart = 2.00;
  T.bgFadeInEnd   = 4.85;

  // Stage 1: Blueprint & Vector Shield Wireframes (Clean drafting on 100% transparent alpha!)
  T.gridIn     = 0.08;
  T.wireOuter  = 0.14;
  T.wireGold   = 0.28;
  T.wireCore   = 0.42;
  T.verts      = [0.20, 0.42, 0.42, 0.75, 0.75, 0.95]; // apex, L/R shoulders, L/R flanks, bottom tip

  // Stage 2: Shield Armor Plates & Radiant Light Sunburst
  T.shOuter    = 0.95;
  T.shGold     = 1.20;
  T.shCore     = 1.45;
  T.shRays     = 1.55; // Sinar cahaya memancar dari pusat tameng

  // Stage 3: Unified Backplate (Satu kesatuan utuh: drop shadow + white contour + black plate)
  // Muncul sebelum semua elemen di atasnya!
  T.plateUnified = 2.00;

  // Stage 4: "MU'ALLIMIN" Wordmark — Masuk bagaikan kibaran bendera Merah-Putih yang di-masking
  T.muaWaveIn  = 2.45;
  T.muaSettle  = 3.35; // Terkunci rapi dan pakem

  // Stage 5: "LBB" Gold Trophy Letters — Efek emas mengkilap (specular glint & gleam)
  T.lbb        = [3.10, 3.28, 3.46]; // L, B, B
  T.lbbGlint   = [3.55, 4.30];       // Sapuan kilau emas berkilau

  // Stage 6: Crossed Checkered Flags — Diayunkan naik, berombak sesaat lalu PAKEM kaku
  T.flagCheck       = 3.50;
  T.flagCheckSettle = 4.25; // Berhenti total kaku

  // Stage 7: "2027" Metallic Housing & Digits (4-Count Cadence)
  T.year       = [3.95, 4.10, 4.25, 4.40]; // 2, 0, 2, 7

  // Stage 8: Waving Indonesian Flags — Masuk berkibar, lalu setelah sampai di posisi langsung PAKEM
  T.flagMp       = 4.25;
  T.flagMpSettle = 4.88; // Pakem total, tidak berkibar terus-menerus

  // Stage 9: Master Lock, Brackets, Master Specular Shimmer & Tactical Caption
  T.lock       = 4.90;
  T.brackets   = 4.94;
  T.sweep      = [5.10, 6.60];
  T.caption    = 5.08;
  T.outroHit   = 7.10;
  T.fadeOut    = 7.40;

  // Ordered discrete component lock timestamps for live HUD telemetry
  T.unitTimes = [
    T.wireOuter, T.shOuter, T.shGold, T.shCore, T.shRays,
    T.plateUnified,
    T.muaWaveIn + 0.3,
    ...T.lbb,
    T.flagCheck, T.flagCheck + 0.12,
    ...T.year,
    T.flagMp, T.flagMp + 0.12
  ].sort((a, b) => a - b);
  T.totalUnits = T.unitTimes.length;

  if (typeof module !== 'undefined') module.exports = T; else window.T = T;
})();
