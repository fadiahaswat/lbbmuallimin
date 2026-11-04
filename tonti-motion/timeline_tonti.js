// timeline_tonti.js
// Precise keyframe timeline for LOGO TONTI MU'ALLIMIN (9:16, 60fps, 8.0s)
// Updated with:
// 1. Zero initial pendar cahaya (100% clean transparent/obsidian)
// 2. Sword Clash at center prior to resting in front of shield
// 3. 5 Stars ignite individually in sequence (1 -> 5)
// 4. Crossed swords positioned IN FRONT of shield
// 5. Circular track reveal for curved text ("Caraka" & "Tonti")
// 6. Unified mathematical alignment for background & ring flag
// 7. Full Motion In & Motion Out cycle

(function () {
  const T = {};
  T.fps = 60;
  T.dur = 8.0;

  // ===== MOTION IN =====
  // 1. Monogram HW (Centerpiece reveals with pure crispness, zero pendar)
  T.monogramIn     = 0.40;
  T.monogramLock   = 1.05;

  // 2. Tameng (3-tier shield assembly slides up and frames monogram)
  T.shieldIn       = 1.15;
  T.shieldLock     = 1.75;

  // 3. Pedang & 5 Bintang
  // Swords swing in from opposing sides, CLASH at center, then settle in FRONT of shield!
  T.swordsIn       = 1.88;
  T.swordsClash    = 2.18; // Epic metallic strike impact!
  T.swordsLock     = 2.52; // Settles crossed in front of shield

  // 5 Stars ignite individually in rhythmic cadence
  T.stars          = [2.58, 2.70, 2.82, 2.94, 3.06]; // Star 1 to 5 (Left to Right)
  T.starsLock      = 3.22;

  // 4. Beberapa Layer Lingkaran (Concentric Rings expand outward)
  T.ringsIn        = 3.30;
  T.ringsLock      = 3.95;

  // 5. Tulisan Caraka dan Tonti (Circular track reveal along arcs)
  T.textCarakaIn   = 4.05; // Sweeps clockwise along top arc (-176° to -4°)
  T.textCarakaEnd  = 4.75;
  T.textTontiIn    = 4.35; // Sweeps along bottom arc (153° to 27°)
  T.textTontiEnd   = 4.98;
  T.textLock       = 5.08;

  // 6. Bendera Merah Putih (Unified background & ring flag unfurl in exact sync)
  T.flagIn         = 5.15;
  T.flagSettle     = 5.95; // 100% Pakem total

  // ===== MASTER IDENT LOCK & GLINT HOLD =====
  T.lock           = 6.05;
  T.shimmer        = [6.15, 6.75];

  // ===== MOTION OUT (Deconstruction) =====
  T.outroStart     = 6.85;
  T.outroRings     = 6.85; // Rings expand outward and dissolve
  T.outroText      = 6.95; // Typography lifts away
  T.outroSwords    = 7.10; // Swords retract along blade diagonals
  T.outroFlag      = 7.25; // Flag sweeps away
  T.outroShield    = 7.40; // Shield collapses
  T.outroHw        = 7.55; // Monogram HW shrinks to center point
  T.outroEnd       = 7.92; // Clean return to transparent

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
  else if (typeof window !== 'undefined') window.TONTI_TIMELINE = T;
})();
