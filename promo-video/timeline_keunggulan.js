// Timeline v3 (HOOK-FIRST, BIG KINETIC TYPOGRAPHY, FAST REELS PACING)
// Duration: 36s @ 30fps (1080 frames) — Punchy, zero boring boxes, every 3-4s a dramatic visual shift!
// SFX ONLY (Zero music/snare).
(function () {
  const T = {};
  T.fps = 30;
  T.dur = 36;

  // 8 Fast, Dramatic Scenes:
  // 0 [0.0 - 4.0s]  HOOK: Giant Rolling Countdown "02 HARI LAGI" + Diagonal Hazard Slam "GELOMBANG 1 TUTUP!"
  // 1 [4.0 - 8.0s]  PRICE DROP/HIKE: Giant Rp 350.108 vs Rp 400.108 Ticket Tear + "HEMAT 50 RIBU!"
  // 2 [8.0 - 13.0s] TROPHY RAIN / MEGA PRIZE: JUARA UMUM SD & SMP + 6 Peleton Trophies + 3 Danton = "20 PIALA!"
  // 3 [13.0 - 17.5s] UJI COBA LAPANGAN: Full-bleed Radar Arena Blueprint + Live Marching Platoon + "LANGSUNG DI LOKASI!"
  // 4 [17.5 - 22.0s] FLEKSIBEL ROSTER: Live 25-Dot Formation Orbit Swap + "BEBAS GANTI PERSONEL S.D. H-1 TM!"
  // 5 [22.0 - 27.0s] ANTI-RIBET SLASH: Giant Typography "NGEPRINT / CETAK FOTO / TEMPEL" Sliced in Half -> "100% DARI HP!"
  // 6 [27.0 - 31.5s] LIVE DIGITAL SCORING: Giant Rolling Score + Live Rank #1 Overtake + TNI/Polri Badge
  // 7 [31.5 - 36.0s] URGENT CTA: "KUNCI SLOTMU SEBELUM 8 NOV!" + Laser QR Lock
  T.cuts = [4.0, 8.0, 13.0, 17.5, 22.0, 27.0, 31.5];

  const eOut3 = x => 1 - Math.pow(1 - x, 3);
  T.odo = (n0, n1, t0, d) => t => n0 + (n1 - n0) * eOut3(Math.min(1, Math.max(0, (t - t0) / d)));

  T.s0 = { odo: [0.1, 0.75], w1: 0.35, slam: 1.15, timer: 1.6, sub: 2.3 };
  T.s1 = { t1: 4.15, t2: 4.55, slash400: 5.2, hl108: 5.65, stamp: 6.15 };
  T.s2 = { um1: 8.15, um2: 8.45, pel0: 9.0, pelStep: 0.16, dan0: 10.2, danStep: 0.18, big20: 11.1 };
  T.s3 = { grid: 13.1, march: [13.3, 15.6], stamp: 15.0, dims: 15.8 };
  T.s4 = { form: 17.6, swapA: [18.1, 19.0], swapB: [19.1, 20.0], stamp: 20.3 };
  T.s5 = { w1: 22.15, cut1: 22.65, w2: 23.0, cut2: 23.5, w3: 23.85, cut3: 24.35, phone: 24.85, done: 25.8 };
  T.s6 = { juri: 27.15, odo: [27.6, 0.9], cells0: 28.0, step: 0.1, overtake: 29.6, lock: 30.3 };
  T.s7 = { l1: 31.6, l2: 31.9, qr: [32.3, 32.85], lock: 33.15, rows: [33.5, 33.75, 34.0] };

  // SFX Cues (SFX ONLY — Crisp, Punchy, Tactile)
  T.shutters = [0.1, T.s0.slam, ...T.cuts, T.s1.stamp, T.s2.big20, T.s3.stamp, T.s4.stamp, T.s5.phone, T.s5.done, T.s6.overtake, T.s7.lock];
  T.slides = [T.s1.t1, T.s1.t2, T.s2.um1, T.s2.um2, T.s3.grid, T.s4.form, T.s5.w1, T.s5.w2, T.s5.w3, T.s6.juri];
  T.slashes = [T.s1.slash400, T.s5.cut1, T.s5.cut2, T.s5.cut3];
  T.swaps = [T.s4.swapA[0], T.s4.swapB[0], T.s6.overtake];
  T.dings = [T.s1.hl108, T.s1.stamp + 0.05, T.s2.um1 + 0.2, T.s2.um2 + 0.2, T.s2.big20 + 0.06, T.s3.stamp + 0.05, T.s4.stamp + 0.05, T.s5.done + 0.05, T.s6.lock];

  T.odoTicks = [];
  for (let i = 0; i < 12; i++) T.odoTicks.push(T.s0.odo[0] + i * (T.s0.odo[1] / 12));
  for (let i = 0; i < 12; i++) T.odoTicks.push(T.s6.odo[0] + i * (T.s6.odo[1] / 12));

  T.marchSteps = [];
  for (let t = T.s3.march[0]; t < T.s3.march[1]; t += 0.28) T.marchSteps.push(t);

  T.popTicks = [];
  for (let i = 0; i < 6; i++) T.popTicks.push(T.s2.pel0 + i * T.s2.pelStep);
  for (let i = 0; i < 3; i++) T.popTicks.push(T.s2.dan0 + i * T.s2.danStep);
  for (let i = 0; i < 12; i++) T.popTicks.push(T.s6.cells0 + i * T.s6.step);
  T.s7.rows.forEach(t => T.popTicks.push(t));

  if (typeof module !== 'undefined') module.exports = T; else window.T = T;
})();
