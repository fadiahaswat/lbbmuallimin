// Timeline v4 — 3D Motion UI & Shatter Physics: "H-1 Besok Terakhir — Daftar Dulu, Nama Fleksibel!"
// 28.0s @ 30fps (840 frames). Strictly SFX-synced 3D camera & physics cues.
(function () {
  const T = {};
  T.fps = 30;
  T.dur = 28;

  // 5 Seamless 3D Camera Scenes connected by Z-Axis Warp Zooms:
  // S0 [0.00 - 5.00s]  3D Split-Flap Countdown (H-3 -> H-2 -> H-1) + Besok Terakhir + 3D Glass Deadline Card
  // S1 [5.00 - 9.80s]  Voronoi 3D Shatter Physics (Rp 400.108 explodes -> 3D Titanium Gold Rp 350.108 Card)
  // S2 [9.80 - 16.00s] "DAFTAR DULU, NAMA-NAMA FLEKSIBEL!" + 3D Carousel Roster Cards 180° Flip & Orbit Swap
  // S3 [16.00 - 22.80s] 3D Isometric Smartphone — Live Tap, Upload, Auto-Type & Cursive Signature (4 Data, 3 Menit)
  // S4 [22.80 - 28.00s] Grand 3D Finale — Official Emblem + Floating 3D Glass QR Scanner + Glossy Portal CTA
  T.cuts = [5.0, 9.8, 16.0, 22.8];
  T.warpDur = 0.48; // 3D camera fly-through transition window around each cut

  // Scene 0: 3D Mechanical Flip-Clock & Urgent Hook
  T.s0 = {
    camIn: 0.0,
    flap1: 0.28,   // H-03 -> H-02
    flap2: 0.62,   // H-02 -> H-01 (Heavy lock!)
    headline: 0.95,
    glassCard: 1.45,
    hookBadge: 2.45,
    warpOut: 4.65
  };

  // Scene 1: 3D Crack & Voronoi Shatter Physics -> Rp 350.108 Titanium Card
  T.s1 = {
    slabIn: 5.05,
    crackStart: 5.58,
    shatter: 6.22,    // BOOM! 56 3D triangles explode outward
    heroCard: 6.38,   // Rp 350.108 3D Gold/Emerald Card rockets forward
    saveBadge: 7.05,  // Floating Z+80px "HEMAT Rp 50.000 / PELETON!"
    sheen: 7.55,
    warpOut: 9.45
  };

  // Scene 2: 3D Roster ID Cards 180° Flip & Swap ("DAFTAR DULU, NAMA-NAMA FLEKSIBEL!")
  T.s2 = {
    title1: 9.90,
    title2: 10.18,
    cardsIn: 10.55,
    flip1: 11.45,     // Card #1 flips 180°: [BELUM FIX?] -> RIZKY PRATAMA
    flip2: 12.25,     // Card #2 swaps & flips 180°: [CADANGAN] -> NADIA PUTRI
    flip3: 13.05,     // Card #3 flips 180°: [SUSUNAN AWAL] -> 25 PERSONIL SIAP
    tmDock: 13.75,    // Floating 3D Glass Dock: Bebas ubah s.d. H-1 TM (8 Jan 2027)
    warpOut: 15.65
  };

  // Scene 3: 3D Floating Smartphone — 4 Quick Inputs in 3 Minutes
  T.s3 = {
    header: 16.10,
    phoneIn: 16.20,
    tap1: 16.65,      // 01 Kategori Lomba (SD/SMP)
    tap2: 17.70,      // 02 Akun Google & Logo PNG
    tap3: 18.75,      // 03 Data Danton & WA Official
    tap4: 19.80,      // 04 Transfer BSI Rp 350.108 + Live Signature
    sigDraw: [20.05, 20.85],
    lockBadge: 21.10, // Slot Terkunci Resmi!
    warpOut: 22.45
  };

  // Scene 4: 3D Championship Portal Finale
  T.s4 = {
    logoIn: 22.90,
    headline: 23.15,
    qrIn: 23.45,
    lockBrackets: 24.20,
    ctaDock: 24.55,
    shine: 25.40
  };

  if (typeof module !== 'undefined') module.exports = T;
  if (typeof window !== 'undefined') window.T = T;
})();
