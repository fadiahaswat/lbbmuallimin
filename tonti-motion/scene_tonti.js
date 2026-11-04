// scene_tonti.js
// Logo Tonti Mu'allimin – Official Motion Logo (9:16, 60fps, 8.0s)
// Updated with User Feedback:
// 1. Zero initial pendar cahaya (clean obsidian stage / pure transparent)
// 2. Exact flag placement & unified unfurl
// 3. Swords rendered IN FRONT OF shield
// 4. 5 Stars ignite individually in sequence
// 5. Swords animate with dynamic Clash before settling
// 6. Curved text reveals circularly along their tracks
// 7. Full Motion In and Motion Out cycle

const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const W = 1080, H = 1920;

const T = window.TONTI_TIMELINE;
const LAY = window.TONTI_LAYERS;
const CX = LAY.cx, CY = LAY.cy; // (4572, 8127.99) -> (540, 960)

/* ---------- math / easing ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, d) => clamp((t - a) / d);
const lerp = (a, b, x) => a + (b - a) * x;

function bez(x1, y1, x2, y2) {
  const cb = (a, b, s) => 3 * a * s * (1 - s) * (1 - s) + 3 * b * s * s * (1 - s) + s * s * s;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let lo = 0, hi = 1, s = x;
    for (let i = 0; i < 24; i++) {
      s = (lo + hi) / 2;
      if (cb(x1, x2, s) < x) lo = s; else hi = s;
    }
    return cb(y1, y2, s);
  };
}
const E_IO  = bez(.7, 0, .2, 1);
const E_IN  = bez(.7, 0, 1, 1);
const E_OUT = bez(.16, 1, .3, 1);
function E_SNAP(x) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  return 1 - Math.exp(-7.5 * x) * Math.cos(9.5 * x);
}

/* ---------- SVG Rasterization ---------- */
const RAST_W = 1440;
const RAST_H = Math.round(RAST_W * (LAY.vbH / LAY.vbW));

function svgToImg(svgStr, name = '') {
  return new Promise((resolve, reject) => {
    const sized = svgStr.replace('<svg ', `<svg width="${RAST_W}" height="${RAST_H}" `);
    const blob = new Blob([sized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const im = new Image();
    im.onload = () => { URL.revokeObjectURL(url); resolve(im); };
    im.onerror = e => {
      console.error('svgToImg error on layer:', name);
      URL.revokeObjectURL(url);
      reject(e);
    };
    im.src = url;
  });
}

const IMG = {};
const imgPromises = Object.entries(LAY.layers).map(([k, svg]) =>
  svgToImg(svg, k).then(im => { IMG[k] = im; })
);

window.ready = Promise.all(imgPromises).then(() => {
  console.log('All updated Tonti vector layers rasterized successfully.');
  return true;
});

function mkCanvas(w = W, h = H) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

const [shimmerCv, sctx] = mkCanvas(W, H);

/* ---------- Layer Drawing Helper ---------- */
function drawLayer(targetCtx, img, cx = 540, cy = 960, opts = {}) {
  const alpha = opts.alpha !== undefined ? opts.alpha : 1;
  if (alpha <= 0.001) return;
  const sc = opts.sc !== undefined ? opts.sc : 1;
  const dx = opts.dx || 0;
  const dy = opts.dy || 0;
  const rot = opts.rot || 0;

  targetCtx.save();
  targetCtx.globalAlpha = clamp(alpha);
  targetCtx.translate(cx + dx, cy + dy);
  if (rot) targetCtx.rotate(rot);
  if (sc !== 1) targetCtx.scale(sc, sc);
  targetCtx.translate(-cx, -cy);
  targetCtx.drawImage(img, 0, 0, W, H);
  targetCtx.restore();
}

/* ---------- Main Frame Render Function ---------- */
window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // 100% transparent clear canvas
  ctx.clearRect(0, 0, W, H);

  // Background Obsidian stage:
  // User: "1. kenapa ada pendar cahaya di awal? hapus!"
  // PURE crisp obsidian stage, NO radial gradient glow, NO pendaran!
  const bgInP = clamp(pr(t, 0.10, 0.65));
  const bgOutP = clamp(pr(t, T.outroShield, T.outroEnd - T.outroShield));
  const bgAlpha = (bgInP * (1 - E_IN(bgOutP))) * 0.94;

  if (bgAlpha > 0.001) {
    ctx.save();
    ctx.globalAlpha = bgAlpha;
    ctx.fillStyle = '#0B0B0D';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Common Motion Out factors
  const pOutro = pr(t, T.outroStart, T.outroEnd - T.outroStart);
  const pRingsOut = pr(t, T.outroRings, 0.42), eRingsOut = E_IN(pRingsOut);
  const scRingsOut = lerp(1.0, 1.34, eRingsOut);
  const alphaRingsOut = 1 - eRingsOut;

  const pTextOut = pr(t, T.outroText, 0.38), eTextOut = E_IN(pTextOut);
  const outTextAlpha = 1 - eTextOut;
  const scTextOut = lerp(1.0, 1.15, eTextOut);

  const pSwOut = pr(t, T.outroSwords, 0.38), eSwOut = E_IN(pSwOut);
  const alphaSwOut = 1 - eSwOut;

  const pFlagOut = pr(t, T.outroFlag, 0.42), eFlagOut = E_IN(pFlagOut);
  const alphaFlagOut = 1 - eFlagOut;

  const pShOut = pr(t, T.outroShield, 0.38), eShOut = E_IN(pShOut);
  const alphaShOut = 1 - eShOut;

  // =======================================================================
  // 6. BENDERA MERAH PUTIH (Background Flag)
  // User: "2. penempatan bendera kurang pas"
  // Rendered in exact vector alignment, unfurling smoothly together
  // =======================================================================
  if (t >= T.flagIn && t <= T.outroEnd) {
    const pFlagIn = pr(t, T.flagIn, T.flagSettle - T.flagIn);
    const eFlagIn = E_OUT(pFlagIn);
    const alphaFlag = clamp(pFlagIn * 3.0) * alphaFlagOut;

    if (alphaFlag > 0.001) {
      ctx.save();
      ctx.globalAlpha = alphaFlag;

      // Clean horizontal reveal sweep from left to right matching the flag's natural flow
      if (eFlagIn < 0.999) {
        ctx.beginPath();
        ctx.rect(0, 0, W * eFlagIn, H);
        ctx.clip();
      }

      if (eFlagOut > 0.001) {
        ctx.translate(eFlagOut * 120, 0);
      }

      ctx.drawImage(IMG.flagFullSvg, 0, 0, W, H);
      ctx.restore();
    }
  }

  // =======================================================================
  // 4. BEBERAPA LAYER LINGKARAN (Concentric Rings)
  // Enters at T.ringsIn, wraps around the center
  // =======================================================================
  if (t >= T.ringsIn && t <= T.outroEnd) {
    const pRingsIn  = pr(t, T.ringsIn, 0.45), eRingsIn = E_SNAP(pRingsIn);
    const scRings = lerp(0.85, 1.0, eRingsIn) * scRingsOut;
    const alphaRings = clamp(pRingsIn * 3.5) * alphaRingsOut;

    // Outer white & black rings
    drawLayer(ctx, IMG.circleOuterWhiteSvg, 540, 960, { sc: scRings, alpha: alphaRings });
    drawLayer(ctx, IMG.circleOuterBlackSvg, 540, 960, { sc: scRings, alpha: alphaRings });
    drawLayer(ctx, IMG.circleInnerWhiteSvg, 540, 960, { sc: scRings, alpha: alphaRings });

    // Inner circle flag section (clipped to id1)
    // Synchronized in 100% vector alignment with background flag and dissolves with rings
    if (t >= T.flagIn) {
      const pFlagIn = pr(t, T.flagIn, T.flagSettle - T.flagIn);
      const eFlagIn = E_OUT(pFlagIn);
      const alphaFlag = clamp(pFlagIn * 3.0) * alphaRings;

      if (alphaFlag > 0.001) {
        ctx.save();
        ctx.globalAlpha = alphaFlag;
        if (eFlagIn < 0.999) {
          ctx.beginPath();
          ctx.rect(0, 0, W * eFlagIn, H);
          ctx.clip();
        }
        drawLayer(ctx, IMG.flagCircleSvg, 540, 960, { sc: scRings, alpha: alphaFlag });
        ctx.restore();
      }
    }

    // Inner rings band
    drawLayer(ctx, IMG.circleBandBlackSvg, 540, 960, { sc: scRings, alpha: alphaRings });
    drawLayer(ctx, IMG.circleBandWhiteSvg, 540, 960, { sc: scRings, alpha: alphaRings });
    drawLayer(ctx, IMG.circleCoreBlackSvg, 540, 960, { sc: scRings, alpha: alphaRings });
  }

  // =======================================================================
  // 5. TULISAN CARAKA DAN TONTI (Circular Track Reveal along the arcs)
  // User: "6. Tulisan teks itu muncul secara lingkaran sesuai jalurnya"
  // =======================================================================
  const rIn = 220, rOut = 390; // Circular band limits

  // 5a. "CARAKA BHASKARA MUDA" (Top arch: sweeps clockwise from ~-176° to ~-4°)
  if (t >= T.textCarakaIn && t <= T.outroEnd) {
    const pCaraka = pr(t, T.textCarakaIn, T.textCarakaEnd - T.textCarakaIn);
    const eCaraka = E_IO(pCaraka);
    const a0 = -Math.PI * 0.98;
    const a1 = -Math.PI * 0.02;
    const aCur = lerp(a0, a1, eCaraka);

    ctx.save();
    if (eCaraka < 0.999) {
      ctx.beginPath();
      ctx.arc(540, 960, rOut, a0, aCur, false);
      ctx.arc(540, 960, rIn, aCur, a0, true);
      ctx.closePath();
      ctx.clip();
    }
    drawLayer(ctx, IMG.textCarakaSvg, 540, 960, {
      alpha: outTextAlpha,
      sc: scTextOut
    });
    ctx.restore();
  }

  // 5b. "TONTI MU'ALLIMIN" (Bottom arch: sweeps clockwise from ~153° to ~27°)
  if (t >= T.textTontiIn && t <= T.outroEnd) {
    const pTonti = pr(t, T.textTontiIn, T.textTontiEnd - T.textTontiIn);
    const eTonti = E_IO(pTonti);
    const a0 = Math.PI * 0.85;
    const a1 = Math.PI * 0.15;
    const aCur = lerp(a0, a1, eTonti);

    ctx.save();
    if (eTonti < 0.999) {
      ctx.beginPath();
      // In canvas (y down), decreasing angle sweeps clockwise!
      ctx.arc(540, 960, rOut, a0, aCur, true);
      ctx.arc(540, 960, rIn, aCur, a0, false);
      ctx.closePath();
      ctx.clip();
    }
    drawLayer(ctx, IMG.textTontiSvg, 540, 960, {
      alpha: outTextAlpha,
      sc: scTextOut
    });
    ctx.restore();
  }

  // =======================================================================
  // 2. TAMENG (Shield)
  // User: "3. Pedang seharusnya di depan tameng"
  // SHIELD IS DRAWN FIRST, THEN SWORDS ARE DRAWN ON TOP!
  // =======================================================================
  if (t >= T.shieldIn && t <= T.outroEnd) {
    const pShIn = pr(t, T.shieldIn, 0.48), eShIn = E_SNAP(pShIn);
    const scSh = lerp(0.86, 1.0, eShIn) * lerp(1.0, 0.60, eShOut);
    const dySh = (1 - E_OUT(pShIn)) * 38 + eShOut * 45;
    const alphaSh = clamp(pShIn * 3.5) * alphaShOut;

    drawLayer(ctx, IMG.shieldFullSvg, 540, 960, {
      dy: dySh,
      sc: scSh,
      alpha: alphaSh
    });
  }

  // =======================================================================
  // 3a. DUA PEDANG (Crossed Swords with Dynamic CLASH)
  // User: "5. Pedang juga harusnya animasinya clash gtu sebelum tempatnya"
  // User: "3. Pedang seharusnya di depan tameng"
  // =======================================================================
  if (t >= T.swordsIn && t <= T.outroEnd) {
    const tClash = T.swordsClash; // 2.18s
    let dxL = 0, dyL = 0, rotL = 0, scL = 1;
    let dxR = 0, dyR = 0, rotR = 0, scR = 1;
    let alphaSw = 1;

    if (t < tClash) {
      // Approach phase: swinging violently in towards center
      const pIn = pr(t, T.swordsIn, tClash - T.swordsIn);
      const eIn = E_IO(pIn);
      alphaSw = clamp(pIn * 3.0);

      // Left sword descends from top-left
      dxL = lerp(-220, 0, eIn);
      dyL = lerp(-140, -10, eIn);
      rotL = lerp(-0.35, -0.04, eIn);

      // Right sword descends from top-right
      dxR = lerp(220, 0, eIn);
      dyR = lerp(-140, -10, eIn);
      rotR = lerp(0.35, 0.04, eIn);
    } else if (t < T.swordsLock) {
      // Recoil & lock phase after clash: blades bounce back slightly then lock into place
      const pSettle = pr(t, tClash, T.swordsLock - tClash);
      const eSettle = E_SNAP(pSettle);

      dxL = lerp(0, 0, eSettle);
      dyL = lerp(-18, 0, eSettle);
      rotL = lerp(-0.06, 0, eSettle);

      dxR = lerp(0, 0, eSettle);
      dyR = lerp(-18, 0, eSettle);
      rotR = lerp(0.06, 0, eSettle);
    } else {
      // Resting lock & Motion Out retraction
      dxL = -eSwOut * 180;
      dyL = eSwOut * 120;
      rotL = -eSwOut * 0.25;

      dxR = eSwOut * 180;
      dyR = eSwOut * 120;
      rotR = eSwOut * 0.25;
      alphaSw = alphaSwOut;
    }

    // Draw Left & Right Swords proudly IN FRONT of shield!
    drawLayer(ctx, IMG.swordLeftSvg, 540, 960, {
      dx: dxL, dy: dyL, rot: rotL, sc: scL, alpha: alphaSw
    });
    drawLayer(ctx, IMG.swordRightSvg, 540, 960, {
      dx: dxR, dy: dyR, rot: rotR, sc: scR, alpha: alphaSw
    });

    // Momentary Clash Spark at the exact strike moment
    const clashAge = t - tClash;
    if (clashAge >= 0 && clashAge <= 0.09) {
      const spP = 1 - clashAge / 0.09;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = spP * 0.95;

      // Starburst strike flash at center sword intersection
      const spX = 540, spY = 932;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(spX, spY, 12 * spP, 0, Math.PI * 2);
      ctx.fill();

      // Sharp diagonal glint streaks
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.5 * spP;
      ctx.beginPath();
      ctx.moveTo(spX - 45 * spP, spY - 30 * spP);
      ctx.lineTo(spX + 45 * spP, spY + 30 * spP);
      ctx.moveTo(spX + 40 * spP, spY - 25 * spP);
      ctx.lineTo(spX - 40 * spP, spY + 25 * spP);
      ctx.stroke();
      ctx.restore();
    }
  }

  // =======================================================================
  // 1. MONOGRAM HW (Centerpiece)
  // Reveals first, scales down with crisp pure white outline, zero pendar
  // =======================================================================
  if (t >= T.monogramIn && t <= T.outroEnd) {
    const pHwIn = pr(t, T.monogramIn, 0.48), eHwIn = E_SNAP(pHwIn);
    const pHwOut = pr(t, T.outroHw, 0.35), eHwOut = E_IN(pHwOut);

    const scHw = lerp(1.22, 1.0, eHwIn) * lerp(1.0, 0.05, eHwOut);
    const alphaHw = clamp(pHwIn * 3.5) * (1 - pHwOut);

    drawLayer(ctx, IMG.monogramHwSvg, 540, 960, {
      sc: scHw,
      alpha: alphaHw
    });

    // Final flash on Monogram HW during exit
    if (pHwOut > 0 && pHwOut < 1) {
      const flashA = Math.sin(pHwOut * Math.PI) * 0.85;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = flashA;
      drawLayer(ctx, IMG.monogramHwSvg, 540, 960, { sc: scHw * 1.15 });
      ctx.restore();
    }
  }

  // =======================================================================
  // 3b. 5 BINTANG (Ignite Individually!)
  // User: "4. ada 5 bintang tuh sendiri2"
  // Each star pops in sequentially from Star 1 to Star 5
  // =======================================================================
  const starsMeta = LAY.starsMeta;
  for (let i = 0; i < 5; i++) {
    const tStar = T.stars[i];
    if (t >= tStar && t <= T.outroEnd) {
      const pStIn = pr(t, tStar, 0.28);
      const eStIn = E_SNAP(pStIn);
      const pStOut = pr(t, T.outroSwords, 0.35);
      const eStOut = E_IN(pStOut);

      const scStar = lerp(1.85, 1.0, eStIn) * lerp(1.0, 1.45, eStOut);
      const aStar = clamp(pStIn * 4.0) * (1 - eStOut);

      const meta = starsMeta[i];
      drawLayer(ctx, IMG[`star${i + 1}Svg`], meta.canvasCx, meta.canvasCy, {
        sc: scStar,
        alpha: aStar
      });
    }
  }

  // =======================================================================
  // 7. SPECULAR SHIMMER SWEEP (Across Monogram HW & 5 Stars only)
  // Clean, focused glint without covering the shield
  // =======================================================================
  const shP = pr(t, T.shimmer[0], T.shimmer[1] - T.shimmer[0]);
  if (shP > 0 && shP < 1) {
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, W, H);

    sctx.drawImage(IMG.monogramHwSvg, 0, 0, W, H);
    sctx.drawImage(IMG.starsSvg, 0, 0, W, H);

    sctx.globalCompositeOperation = 'source-atop';
    const gleamX = lerp(220, 860, E_IO(shP));
    const gl = sctx.createLinearGradient(gleamX - 100, 620, gleamX + 100, 1300);
    gl.addColorStop(0, 'rgba(255,255,255,0)');
    gl.addColorStop(0.45, 'rgba(255,255,255,0.75)');
    gl.addColorStop(0.5, 'rgba(255,255,255,0.98)');
    gl.addColorStop(0.55, 'rgba(255,255,255,0.75)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    sctx.fillStyle = gl;
    sctx.fillRect(0, 620, W, 700);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.90;
    ctx.drawImage(shimmerCv, 0, 0);
    ctx.restore();
  }

  // Master Lock flash at T.lock (subtle 0.12 opacity)
  if (t >= T.lock && t < T.lock + 0.25) {
    const pulseP = 1 - (t - T.lock) / 0.25;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = pulseP * 0.12;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
};
