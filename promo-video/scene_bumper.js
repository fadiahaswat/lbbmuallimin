// LBB Mu'allimin 2027 – Official Bumper Logo Motion (9:16, 60fps)
// Theme: "Tactical Minimalism" (8.0s Slowmo, Transparent Intro, Unified Backplate,
// Radiant Solar Rays, Masked Waving Indonesian Flag MU'ALLIMIN, Gold Gleam LBB,
// Stiff Pakem Flags after entrance).
// Deterministic renderer: window.renderFrame(t) draws frame at t seconds.

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const OBS = '#0F0F0F', WHITE = '#F8F9FA', CRIMSON = '#6E0D0D', GOLD = '#D4AF37';
const L = 72, R = 1008, CW = R - L;
const DISP = 'Archivo', MONO = '"JetBrains Mono"';

const LAY = window.LOGO_LAYERS;
const VBW = LAY.vbW, VBH = LAY.vbH;
const SHIELD_CX = 9646.28, SHIELD_CY = 9189.28;

// Hero logo placement on 1080x1920 (exact symmetry axis aligned to x = 540.0)
const LW = 812, LH = LW * (VBH / VBW);
const LX = 540 - (SHIELD_CX / VBW) * LW;
const LY = 882 - LH / 2;
const sx2px = sx => LX + (sx / VBW) * LW;
const sy2py = sy => LY + (sy / VBH) * LH;

/* ---------- math / easing ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, d) => clamp((t - a) / d);
const lerp = (a, b, x) => a + (b - a) * x;

function bez(x1, y1, x2, y2) {
  const cb = (a, b, s) => 3 * a * s * (1 - s) * (1 - s) + 3 * b * s * s * (1 - s) + s * s * s;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let lo = 0, hi = 1, s = x;
    for (let i = 0; i < 24; i++) { s = (lo + hi) / 2; if (cb(x1, x2, s) < x) lo = s; else hi = s; }
    return cb(y1, y2, s);
  };
}
const E_IO   = bez(.7, 0, .2, 1);       // snappy architectural wipe
const E_OUT  = bez(.16, 1, .3, 1);      // crisp expo-out reveal
const E_LINE = bez(.65, 0, .35, 1);     // blueprint hairline draw
function E_SNAP(x) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  return 1 - Math.exp(-7.5 * x) * Math.cos(9.5 * x);
}

const rnd = (() => { let s = 1337; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();

/* ---------- rasterize SVG vector layers at 1280px super-sampled resolution ---------- */
const RAST_W = 1280, RAST_H = Math.round(RAST_W * (VBH / VBW));
function svgToImg(svgStr, name = '') {
  return new Promise((resolve, reject) => {
    const sized = svgStr.replace('<svg ', `<svg width="${RAST_W}" height="${RAST_H}" `);
    const blob = new Blob([sized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const im = new Image();
    im.onload = () => { URL.revokeObjectURL(url); resolve(im); };
    im.onerror = e => {
      console.error('svgToImg onerror on layer [' + name + '] snippet:', sized.slice(sized.indexOf('<g>'), sized.indexOf('<g>') + 300));
      URL.revokeObjectURL(url);
      reject(e);
    };
    im.src = url;
  });
}

function mkCanvas(w = W, h = H) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

// Sample closed SVG path symmetrically starting from top-most apex
function sampleSymmetricLoop(d, N = 520) {
  const ns = 'http://www.w3.org/2000/svg';
  const svgEl = document.createElementNS(ns, 'svg');
  const pEl = document.createElementNS(ns, 'path');
  pEl.setAttribute('d', d);
  svgEl.appendChild(pEl);
  document.body.appendChild(svgEl);
  const len = pEl.getTotalLength();
  const pts = [];
  let bestIdx = 0, bestScore = Infinity;
  for (let i = 0; i < N; i++) {
    const pt = pEl.getPointAtLength((i / N) * len);
    const px = sx2px(pt.x), py = sy2py(pt.y);
    pts.push([px, py]);
    const sc = py + Math.abs(px - 540) * 0.35;
    if (sc < bestScore) { bestScore = sc; bestIdx = i; }
  }
  document.body.removeChild(svgEl);
  const ord = [];
  for (let i = 0; i < N; i++) ord.push(pts[(bestIdx + i) % N]);
  return ord;
}

// Pre-bake pole-aligned local buffer for Checkered Flags so cloth strips slice perpendicular to the flagpole
const FC_BUF = 420, FC_PIV = 210;
function bakePoleAligned(im, meta) {
  const [c, g] = mkCanvas(FC_BUF, FC_BUF);
  const ptx = sx2px(meta.poleTopX), pty = sy2py(meta.poleTopY);
  g.translate(FC_PIV, FC_PIV);
  g.rotate(-meta.poleAngle);
  g.translate(-ptx, -pty);
  g.drawImage(im, LX, LY, LW, LH);
  return c;
}

const IMG = {};
let grain, corePath2D, rayPoly2D, shieldVerts = [];
let wireOuterPts, wireGoldPts, wireCorePts;
let logoCv, lctx, flagTmpCv, ftctx, muaWaveCv, mwctx, lbbGlintCv, lgctx;

window.ready = (async () => {
  await Promise.all([
    document.fonts.load('900 100px Archivo'),
    document.fonts.load('800 100px Archivo'),
    document.fonts.load('400 40px "JetBrains Mono"'),
    document.fonts.load('600 40px "JetBrains Mono"'),
    document.fonts.load('700 40px "JetBrains Mono"'),
  ]);

  IMG.shieldOuter  = await svgToImg(LAY.shieldOuterSvg, 'shieldOuter');
  IMG.shieldGold   = await svgToImg(LAY.shieldGoldSvg, 'shieldGold');
  IMG.plateShadow  = await svgToImg(LAY.plateShadowSvg, 'plateShadow');
  IMG.plateWhite   = await svgToImg(LAY.plateWhiteSvg, 'plateWhite');
  IMG.plateBlack   = await svgToImg(LAY.plateBlackSvg, 'plateBlack');
  IMG.muaFull      = await svgToImg(LAY.muaFullSvg, 'muaFull');
  IMG.lbbFull      = await svgToImg(LAY.lbbFullSvg, 'lbbFull');
  IMG.yrFull       = await svgToImg(LAY.yrFullSvg, 'yrFull');

  const loadCheck = async (meta, prefix) => {
    const [cloth, pole] = await Promise.all([
      svgToImg(meta.clothSvg, prefix + '_cloth'),
      svgToImg(meta.poleSvg, prefix + '_pole'),
    ]);
    return {
      pole,
      cLoc: bakePoleAligned(cloth, meta),
    };
  };
  IMG.fcL = await loadCheck(LAY.flagCheckL, 'fcL');
  IMG.fcR = await loadCheck(LAY.flagCheckR, 'fcR');

  IMG.mpL = await svgToImg(LAY.flagMpL.clothSvg, 'mpL');
  IMG.mpR = await svgToImg(LAY.flagMpR.clothSvg, 'mpR');

  corePath2D = new Path2D(LAY.paths.shieldCore);
  const pairs = LAY.paths.shieldRaysPts.trim().split(/\s+/).map(p => p.split(',').map(Number));
  let rayD = '';
  const np = pairs.length;
  for (let i = 0; i < np; i += 2) {
    const prevIn = pairs[(i - 1 + np) % np];
    const tip    = pairs[i];
    const nextIn = pairs[(i + 1) % np];
    rayD += `M${SHIELD_CX} ${SHIELD_CY} L${prevIn[0]} ${prevIn[1]} L${tip[0]} ${tip[1]} L${nextIn[0]} ${nextIn[1]} Z `;
  }
  rayPoly2D = new Path2D(rayD);

  wireOuterPts = sampleSymmetricLoop(LAY.paths.shieldOuter, 560);
  wireGoldPts  = sampleSymmetricLoop(LAY.paths.shieldGold, 500);
  wireCorePts  = sampleSymmetricLoop(LAY.paths.shieldCore, 460);

  shieldVerts = [
    [sx2px(9646.28), sy2py(752.1)],
    [sx2px(1443.7),  sy2py(3674.2)],
    [sx2px(17848.8), sy2py(3674.2)],
    [sx2px(3313.8),  sy2py(12755.7)],
    [sx2px(15978.7), sy2py(12755.7)],
    [sx2px(9646.28), sy2py(18258.3)],
  ];

  grain = document.createElement('canvas'); grain.width = grain.height = 256;
  const g = grain.getContext('2d'), id = g.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = rnd() * 255;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
    id.data[i + 3] = 13;
  }
  g.putImageData(id, 0, 0);

  [logoCv, lctx]         = mkCanvas(W, H);
  [flagTmpCv, ftctx]     = mkCanvas(W, H);
  [muaWaveCv, mwctx]     = mkCanvas(W, H);
  [lbbGlintCv, lgctx]     = mkCanvas(W, H);
})();

/* ---------- typography & primitives ---------- */
function setF(f, size, w, ls) {
  ctx.font = `${w || (f === 'd' ? 800 : 400)} ${size}px ${f === 'd' ? DISP : MONO}`;
  ctx.fontStretch = f === 'd' ? 'expanded' : 'normal';
  ctx.letterSpacing = (ls ?? (f === 'd' ? -size * 0.02 : 0)) + 'px';
  ctx.textBaseline = 'alphabetic';
}
function measure(s, f, size, w, ls) { ctx.save(); setF(f, size, w, ls); const m = ctx.measureText(s).width; ctx.restore(); return m; }
function text(s, x, y, o = {}) {
  ctx.save(); setF(o.f || 'm', o.size || 22, o.w, o.ls);
  ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || WHITE; ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.fillText(s, x, y); ctx.restore();
}
function typeOn(s, x, y, o, t, t0, cps = 46) {
  const n = Math.floor((t - t0) * cps); if (n <= 0) return;
  const sub = s.slice(0, n); text(sub, x, y, o);
  if (n < s.length + 5 && Math.floor(t * 8) % 2 === 0) {
    const wd = measure(sub, 'm', o.size || 22, o.w, o.ls);
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); ctx.fillStyle = GOLD;
    ctx.fillRect(x + wd + 4, y - (o.size || 22) * 0.78, (o.size || 22) * 0.55, (o.size || 22) * 0.9);
    ctx.restore();
  }
}
function hline(x0, x1, y, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(x0, Math.round(y) - (lw > 1 ? lw / 2 : 0), (x1 - x0) * p, lw); }
function vline(x, y0, y1, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(Math.round(x), y0, lw, (y1 - y0) * p); }
function dashedV(x, y0, y1, col, p, dash = 8, gap = 8) {
  if (p <= 0) return;
  ctx.save(); ctx.fillStyle = col; const y1p = lerp(y0, y1, p);
  for (let y = y0; y < y1p; y += dash + gap) ctx.fillRect(Math.round(x), y, 1, Math.min(dash, y1p - y));
  ctx.restore();
}
function brackets(x, y, w, h, len, col, lw = 1.5) {
  ctx.save(); ctx.fillStyle = col;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.fillRect(sx > 0 ? cx : cx - len, sy > 0 ? cy : cy - lw, len, lw);
    ctx.fillRect(sx > 0 ? cx : cx - lw, sy > 0 ? cy : cy - len, lw, len);
  });
  ctx.restore();
}
function cross(x, y, s, col) { ctx.fillStyle = col; ctx.fillRect(x - s, Math.round(y), s * 2 + 1, 1); ctx.fillRect(Math.round(x), y - s, 1, s * 2 + 1); }
function guides(a = 1) {
  const c = `rgba(248,249,250,${.05 * a})`;
  [L, 540, R].forEach(x => vline(x, 0, H, c));
  const m = `rgba(248,249,250,${.35 * a})`;
  [[L, 290], [R, 290], [L, 1540], [R, 1540]].forEach(([x, y]) => cross(x, y, 9, m));
}

function drawBilateralTrace(pts, p, strokeCol, lw, showTip = true, fadeAlpha = 1) {
  if (p <= 0 || fadeAlpha <= 0) return;
  const half = Math.floor(pts.length / 2);
  const steps = Math.max(1, Math.floor(half * p));
  ctx.save();
  ctx.globalAlpha = fadeAlpha;
  ctx.strokeStyle = strokeCol;
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= steps; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= steps; i++) {
    const idx = (pts.length - i) % pts.length;
    ctx.lineTo(pts[idx][0], pts[idx][1]);
  }
  ctx.stroke();

  if (showTip && p < 0.995) {
    const rTip = pts[steps];
    const lTip = pts[(pts.length - steps) % pts.length];
    [rTip, lTip].forEach(([tx, ty]) => {
      ctx.fillStyle = GOLD;
      ctx.fillRect(tx - 4, ty - 4, 8, 8);
      ctx.strokeStyle = 'rgba(212,175,55,0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx - 11, ty - 11, 22, 22);
    });
  }
  ctx.restore();
}

function drawLayerOn(targetCtx, im, pivSvgX, pivSvgY, o = {}) {
  const alpha = o.alpha ?? 1;
  if (alpha <= 0.001) return;
  const px = sx2px(pivSvgX), py = sy2py(pivSvgY);
  const dx = o.dx || 0, dy = o.dy || 0;
  const sx = o.sx ?? o.sc ?? 1, sy = o.sy ?? o.sc ?? 1;
  const rot = o.rot || 0;

  targetCtx.save();
  if (o.clipRect) {
    targetCtx.beginPath();
    targetCtx.rect(o.clipRect[0], o.clipRect[1], o.clipRect[2], o.clipRect[3]);
    targetCtx.clip();
  }
  targetCtx.globalAlpha = alpha;
  targetCtx.translate(px + dx, py + dy);
  if (rot) targetCtx.rotate(rot);
  if (sx !== 1 || sy !== 1) targetCtx.scale(sx, sy);
  targetCtx.translate(-px, -py);
  targetCtx.drawImage(im, LX, LY, LW, LH);
  targetCtx.restore();
}

function snapFlash(x, y, age, size = 24, col = GOLD) {
  if (age < 0 || age > 0.24) return;
  const u = age / 0.24;
  ctx.save();
  ctx.globalAlpha = (1 - u) * 0.75;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1;
  const r = size + u * 34;
  ctx.strokeRect(x - r / 2, y - r / 2, r, r);
  if (age < 0.14) {
    ctx.globalAlpha = (1 - age / 0.14) * 0.45;
    hline(x - 65, x + 65, y, GOLD, 1, 1);
    vline(x, y - 65, y + 65, GOLD, 1, 1);
  }
  ctx.restore();
}

/* =========================================================================
   ELEMENT ANIMATIONS (Waving Checkered Flags, Masked MU'ALLIMIN, Gold LBB)
   ========================================================================= */

// 1. Checkered Flags: Diayunkan naik, berombak sesaat lalu PAKEM kaku
function drawCheckeredFlag(targetCtx, checkObj, meta, t) {
  if (t < T.flagCheck) return;
  const age = t - T.flagCheck;
  const swingP = pr(t, T.flagCheck, 0.58);
  const swingE = E_SNAP(swingP);
  const eo = E_OUT(swingP);
  // Gelombang kain HANYA aktif saat diayunkan naik, setelah T.flagCheckSettle bernilai 0 (PAKEM total!)
  const waveDecay = clamp(1 - pr(t, T.flagCheck + 0.15, T.flagCheckSettle - (T.flagCheck + 0.15)));
  const amp = (6.8 * Math.exp(-age * 2.8)) * waveDecay;

  const basePx = sx2px(meta.baseX), basePy = sy2py(meta.baseY);
  const ptx = sx2px(meta.poleTopX), pty = sy2py(meta.poleTopY);
  const swingRot = -meta.side * (1 - swingE) * 0.50;
  const slidePx = (1 - eo) * 24;

  targetCtx.save();
  targetCtx.globalAlpha = clamp(swingP * 4.5);

  // Rigid flagpole
  targetCtx.save();
  targetCtx.translate(basePx + Math.sin(meta.poleAngle) * slidePx, basePy + Math.cos(meta.poleAngle) * slidePx);
  targetCtx.rotate(swingRot);
  targetCtx.translate(-basePx, -basePy);
  targetCtx.drawImage(checkObj.pole, LX, LY, LW, LH);
  targetCtx.restore();

  // Cloth strips
  if (amp <= 0.01) {
    // Settle sempurna: gambar utuh tanpa potong strip
    targetCtx.translate(basePx + Math.sin(meta.poleAngle) * slidePx, basePy + Math.cos(meta.poleAngle) * slidePx);
    targetCtx.rotate(swingRot);
    targetCtx.translate(ptx - basePx, pty - basePy);
    targetCtx.rotate(meta.poleAngle);
    targetCtx.translate(-FC_PIV, -FC_PIV);
    targetCtx.drawImage(checkObj.cLoc, 0, 0);
  } else {
    // Saat naik berombak:
    const spanPx = (meta.flySpanSvg / VBW) * LW;
    const N = 40;
    ftctx.setTransform(1, 0, 0, 1, 0, 0);
    ftctx.globalCompositeOperation = 'source-over';
    ftctx.clearRect(0, 0, FC_BUF, FC_BUF);

    if (meta.side < 0) {
      ftctx.drawImage(checkObj.cLoc, FC_PIV - 1, 0, FC_BUF - (FC_PIV - 1), FC_BUF, FC_PIV - 1, 0, FC_BUF - (FC_PIV - 1), FC_BUF);
    } else {
      ftctx.drawImage(checkObj.cLoc, 0, 0, FC_PIV + 1, FC_BUF, 0, 0, FC_PIV + 1, FC_BUF);
    }

    for (let s = 0; s < N; s++) {
      const u0 = s / N, u1 = (s + 1) / N, um = (u0 + u1) * 0.5;
      const env = Math.pow(um, 1.25);
      const ph  = um * 5.2 - t * 13.0 + (meta.side > 0 ? 0.42 : 0);
      const dV  = amp * env * Math.sin(ph);
      const dU  = -meta.side * amp * 0.18 * env * (0.5 + 0.5 * Math.cos(ph));

      let sx, sw;
      if (meta.side < 0) {
        const xA = FC_PIV - u1 * spanPx, xB = FC_PIV - u0 * spanPx + 0.8;
        sx = xA; sw = Math.max(0.5, xB - xA);
      } else {
        const xA = FC_PIV + u0 * spanPx - 0.8, xB = FC_PIV + u1 * spanPx;
        sx = xA; sw = Math.max(0.5, xB - xA);
      }
      ftctx.drawImage(checkObj.cLoc, sx, 0, sw, FC_BUF, sx + dU, dV, sw, FC_BUF);
    }

    targetCtx.translate(basePx + Math.sin(meta.poleAngle) * slidePx, basePy + Math.cos(meta.poleAngle) * slidePx);
    targetCtx.rotate(swingRot);
    targetCtx.translate(ptx - basePx, pty - basePy);
    targetCtx.rotate(meta.poleAngle);
    targetCtx.translate(-FC_PIV, -FC_PIV);
    targetCtx.drawImage(flagTmpCv, 0, 0, FC_BUF, FC_BUF, 0, 0, FC_BUF, FC_BUF);
  }
  targetCtx.restore();
}

// 2. Waving Indonesian Flags: Masuk berkibar, setelah sampai di posisi langsung PAKEM
function drawIndonesianFlag(targetCtx, srcImg, meta, t) {
  if (t < T.flagMp) return;
  const age = t - T.flagMp;
  const unfurlP = E_OUT(pr(t, T.flagMp, 0.48));
  // Berhenti berkibar dan pakem begitu unfurl selesai (T.flagMpSettle):
  const waveDecay = clamp(1 - pr(t, T.flagMp + 0.20, T.flagMpSettle - (T.flagMp + 0.20)));
  const amp = (8.5 * Math.exp(-age * 2.6)) * waveDecay;

  const anchorPx = sx2px(meta.anchorX);
  const outerPx  = sx2px(meta.outerX);
  const spanPx   = Math.abs(outerPx - anchorPx);
  const yTopPx   = sy2py(10900), yBotPx = sy2py(15100), hPx = yBotPx - yTopPx;
  const sySrc    = ((yTopPx - LY) / LH) * RAST_H;
  const shSrc    = (hPx / LH) * RAST_H;
  const pxToRast = RAST_W / LW;

  targetCtx.save();
  targetCtx.globalAlpha = clamp(pr(t, T.flagMp, 0.12));

  if (amp <= 0.01 && unfurlP >= 0.999) {
    // 100% PAKEM — render utuh tanpa slicing
    targetCtx.drawImage(srcImg, LX, LY, LW, LH);
  } else {
    const N = 44;
    ftctx.setTransform(1, 0, 0, 1, 0, 0);
    ftctx.globalCompositeOperation = 'source-over';
    ftctx.clearRect(0, 0, W, H);

    // Inner edge overlap
    const inPad = 6;
    const inX = meta.side < 0 ? anchorPx - 0.5 : anchorPx - inPad;
    ftctx.drawImage(srcImg, (inX - LX) * pxToRast, sySrc, (inPad + 0.5) * pxToRast, shSrc, inX, yTopPx, inPad + 0.5, hPx);

    for (let s = 0; s < N; s++) {
      const u0 = s / N;
      if (u0 >= unfurlP) break;
      const u1 = Math.min((s + 1) / N, unfurlP);
      const um = (u0 + u1) * 0.5;

      const env = Math.pow(um, 1.32);
      const ph  = um * 5.8 - t * 11.4 + (meta.side > 0 ? 0.38 : 0);
      const dy  = amp * env * Math.sin(ph);
      const dx  = -meta.side * amp * 0.20 * env * (0.5 + 0.5 * Math.cos(ph))
                - meta.side * (1 - unfurlP) * 14 * um;

      let xA, xB;
      if (meta.side < 0) {
        xA = anchorPx - u1 * spanPx;
        xB = anchorPx - u0 * spanPx + 0.85;
      } else {
        xA = anchorPx + u0 * spanPx - 0.85;
        xB = anchorPx + u1 * spanPx;
      }
      const wStrip = Math.max(0.5, xB - xA);
      const sxSrc  = (xA - LX) * pxToRast;
      const swSrc  = wStrip * pxToRast;

      ftctx.drawImage(srcImg, sxSrc, sySrc, swSrc, shSrc, xA + dx, yTopPx + dy, wStrip, hPx);
    }
    targetCtx.drawImage(flagTmpCv, 0, 0);
  }
  targetCtx.restore();
}

// 3. Tulisan MU'ALLIMIN: Masuk bagaikan kibaran bendera merah putih yang di-masking
function drawMaskedMuallimin(targetCtx, t) {
  if (t < T.muaWaveIn) return;
  const age = t - T.muaWaveIn;
  const inP = E_OUT(pr(t, T.muaWaveIn, 0.65));
  // Wave ripple dampens as it settles (pakem by T.muaSettle):
  const waveDecay = clamp(1 - pr(t, T.muaWaveIn + 0.25, T.muaSettle - (T.muaWaveIn + 0.25)));
  const amp = (7.5 * Math.exp(-age * 2.2)) * waveDecay;

  // Render the full intact MUALLIMIN graphic inside mwctx
  mwctx.setTransform(1, 0, 0, 1, 0, 0);
  mwctx.globalCompositeOperation = 'source-over';
  mwctx.globalAlpha = 1;
  mwctx.clearRect(0, 0, W, H);
  mwctx.drawImage(IMG.muaFull, LX, LY, LW, LH);

  targetCtx.save();
  targetCtx.globalAlpha = clamp(inP * 4.0);

  if (amp <= 0.01 && inP >= 0.999) {
    // Sudah pakem dan terkunci rapi
    targetCtx.drawImage(mwctx.canvas, 0, 0);
  } else {
    // Slicing waving flag cloth ripple while entering
    const muaX0 = sx2px(550), muaX1 = sx2px(18750), muaW = muaX1 - muaX0;
    const muaY0 = sy2py(7100), muaY1 = sy2py(12800), muaH = muaY1 - muaY0;
    const N = 48;

    ftctx.setTransform(1, 0, 0, 1, 0, 0);
    ftctx.globalCompositeOperation = 'source-over';
    ftctx.clearRect(0, 0, W, H);

    for (let s = 0; s < N; s++) {
      const u0 = s / N, u1 = (s + 1) / N, um = (u0 + u1) * 0.5;
      // Symmetrical unfurl wave from center (u: 0.5) outward to left & right
      const distFromCenter = Math.abs(um - 0.5) * 2; // 0 at center, 1 at ends
      if (distFromCenter > inP) continue;

      const ph = um * 12.0 - t * 14.0;
      const dy = amp * Math.sin(ph) * (1 - distFromCenter * 0.35);
      const xA = muaX0 + u0 * muaW - 0.5;
      const xB = muaX0 + u1 * muaW + 0.5;
      const sw = xB - xA;

      ftctx.drawImage(mwctx.canvas, xA, muaY0, sw, muaH, xA, muaY0 + dy, sw, muaH);

      // Subtle traveling fabric shine crest on wave
      const crest = Math.cos(ph) * waveDecay;
      if (crest > 0.35) {
        ftctx.save();
        ftctx.globalCompositeOperation = 'source-atop';
        ftctx.fillStyle = `rgba(255,255,255,${((crest - 0.35) * 0.22).toFixed(3)})`;
        ftctx.fillRect(xA, muaY0 + dy, sw, muaH);
        ftctx.restore();
      }
    }
    targetCtx.drawImage(flagTmpCv, 0, 0);
  }
  targetCtx.restore();
}

// 4. Tulisan LBB Emas: 1-2-3 Snare Slam + Specular Gold Glint & Gleam
function drawGoldLbb(targetCtx, t) {
  if (t < T.lbb[0]) return;
  const p = pr(t, T.lbb[0], 0.45), e = E_SNAP(p);

  // Draw full gold letters with bounce slam
  targetCtx.save();
  targetCtx.globalAlpha = clamp(p * 4.0);
  const dy = (1 - E_OUT(p)) * -48;
  const sc = lerp(1.18, 1.0, e);

  targetCtx.translate(540, sy2py(6300));
  targetCtx.scale(sc, sc);
  targetCtx.translate(-540, -sy2py(6300) + dy);
  targetCtx.drawImage(IMG.lbbFull, LX, LY, LW, LH);

  // Emas mengkilap: Specular gleam sweeps across the gold face during T.lbbGlint
  const glP = pr(t, T.lbbGlint[0], T.lbbGlint[1] - T.lbbGlint[0]);
  if (glP > 0 && glP < 1) {
    lgctx.setTransform(1, 0, 0, 1, 0, 0);
    lgctx.globalCompositeOperation = 'source-over';
    lgctx.clearRect(0, 0, W, H);
    lgctx.drawImage(IMG.lbbFull, LX, LY, LW, LH);

    lgctx.globalCompositeOperation = 'source-atop';
    const gleamX = lerp(sx2px(6000), sx2px(13300), E_IO(glP));
    const gl = lgctx.createLinearGradient(gleamX - 85, sy2py(5300), gleamX + 85, sy2py(7400));
    gl.addColorStop(0, 'rgba(255,255,255,0)');
    gl.addColorStop(0.4, 'rgba(255,248,180,0.65)');
    gl.addColorStop(0.5, 'rgba(255,255,255,0.95)');
    gl.addColorStop(0.6, 'rgba(255,248,180,0.65)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    lgctx.fillStyle = gl;
    lgctx.fillRect(LX, sy2py(5000), LW, sy2py(2600));

    // Star sparkle gleam on the gold letter peak
    const spAge = glP - 0.48;
    if (Math.abs(spAge) < 0.22) {
      const spAlpha = (1 - Math.abs(spAge) / 0.22);
      const spX = sx2px(9646), spY = sy2py(5700);
      lgctx.save();
      lgctx.fillStyle = `rgba(255,255,255,${spAlpha * 0.9})`;
      lgctx.fillRect(spX - 22, spY - 1, 45, 2);
      lgctx.fillRect(spX - 1, spY - 22, 2, 45);
      lgctx.restore();
    }

    targetCtx.drawImage(lgctx.canvas, 0, 0);
  }
  targetCtx.restore();
}

/* ---------- HUD (promo-video exact layout) ---------- */
function renderHud(t, bgAlpha) {
  if (bgAlpha < 0.01) return;
  ctx.save();
  ctx.globalAlpha = bgAlpha;
  text("LBB MU'ALLIMIN — 2027", L, 236, { size: 18, w: 600, ls: 2, color: WHITE, alpha: .82 });
  const tc = '00:' + ('0' + Math.floor(t)).slice(-2) + '.' + Math.floor((t % 1) * 10);
  const phaseLabel = t >= T.lock ? 'IDENT' : 'BUILD';
  text(`00 / ${phaseLabel}   ${tc}`, R, 236, { size: 18, w: 500, ls: 2, color: WHITE, alpha: .82, align: 'right' });
  hline(L, R, 256, 'rgba(248,249,250,.18)');
  hline(L, lerp(L, R, clamp(t / T.dur)), 256, GOLD, 1, 1.5);

  [T.shOuter, T.plateUnified, T.muaWaveIn, T.lbb[0], T.lock].forEach(cu => {
    const x = lerp(L, R, cu / T.dur);
    ctx.fillStyle = t >= cu ? GOLD : WHITE;
    ctx.globalAlpha = t >= cu ? .9 : .45;
    ctx.fillRect(Math.round(x), 252, 1.5, 9);
    ctx.globalAlpha = 1;
  });

  typeOn('OFFICIAL IDENT / LBB-27', L, 330, { size: 22, w: 500, ls: 2, alpha: .65 }, t, 0.04);

  const lockedCount = T.unitTimes.filter(ut => t >= ut).length;
  const isLocked = t >= T.lock;
  const statusStr = isLocked
    ? `[${String(T.totalUnits).padStart(2, '0')}/${T.totalUnits}] IDENT LOCKED`
    : `[${String(lockedCount).padStart(2, '0')}/${T.totalUnits}] ASSEMBLING`;
  if (t > 0.12) {
    text(statusStr, R, 330, {
      size: 20,
      w: isLocked ? 700 : 500,
      ls: 2,
      align: 'right',
      color: isLocked ? GOLD : WHITE,
      alpha: isLocked ? .95 : .58
    });
  }
  ctx.restore();
}

/* ---------- MAIN FRAME RENDERER ---------- */
window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // Clear full canvas so transparent areas remain pure transparent RGBA(0,0,0,0)
  ctx.clearRect(0, 0, W, H);

  // 1. Matte Obsidian Stage + Atmospheric Radial Glow
  // User: "fade in latarnya buat lebih slowmo lagi jadi kayak seamless gtu"
  // Smoothstep S-curve interpolation over 2.85s (2.00s -> 4.85s) for a seamless gradual blend
  const rawBgP = clamp(pr(t, T.bgFadeInStart, T.bgFadeInEnd - T.bgFadeInStart));
  const bgAlpha = rawBgP * rawBgP * (3 - 2 * rawBgP);
  if (bgAlpha > 0.001) {
    ctx.save();
    ctx.globalAlpha = bgAlpha;
    ctx.fillStyle = OBS;
    ctx.fillRect(0, 0, W, H);

    const lockGlow = (E_OUT(pr(t, T.shCore, 0.8)) * 0.6 + E_OUT(pr(t, T.lock, 0.45)) * 0.4) * bgAlpha;
    if (lockGlow > 0) {
      const rg = ctx.createRadialGradient(540, 882, 30, 540, 882, 680);
      rg.addColorStop(0, `rgba(110,13,13,${0.26 * lockGlow})`);
      rg.addColorStop(0.55, `rgba(248,249,250,${0.032 * lockGlow})`);
      rg.addColorStop(1, 'rgba(15,15,15,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  // 2. Tactical Blueprint Grid (blends in gently as background fades in)
  const gridInP = E_LINE(pr(t, T.gridIn, 0.70));
  const gridDim = lerp(1.0, 0.24, E_OUT(pr(t, T.lock, 0.55))) * bgAlpha;
  if (gridInP > 0 && bgAlpha > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 280, W, (1540 - 280) * gridInP);
    ctx.clip();
    for (let x = 40; x < W; x += 40) {
      vline(x, 280, 1540, x % 200 === 0 ? `rgba(248,249,250,${0.065 * gridDim})` : `rgba(248,249,250,${0.025 * gridDim})`);
    }
    for (let y = 280; y <= 1540; y += 40) {
      hline(0, W, y, (y - 280) % 200 === 0 ? `rgba(248,249,250,${0.065 * gridDim})` : `rgba(248,249,250,${0.025 * gridDim})`);
    }
    ctx.restore();
  }
  if (bgAlpha > 0.01) guides(lerp(0.95, 0.7, pr(t, T.lock, 0.5)) * bgAlpha);

  // Symmetry AXIS line (x = 540) during assembly
  const axisFade = (1 - E_OUT(pr(t, T.lock - 0.05, 0.4))) * bgAlpha;
  if (axisFade > 0.01) {
    const axP = E_LINE(pr(t, 0.05, 0.45));
    ctx.save();
    ctx.globalAlpha = axisFade * 0.75;
    dashedV(540, 415, 1345, GOLD, axP, 8, 8);
    if (t > 0.25) text('AXIS // 00', 552, 434, { size: 14, w: 600, ls: 2, color: GOLD, alpha: axisFade * 0.8 });
    ctx.restore();
  }

  // 3. Stage 1: Vector Shield Blueprint Wireframes
  const wireFade = 1 - E_OUT(pr(t, T.shCore + 0.15, 0.45));
  if (wireFade > 0.01) {
    drawBilateralTrace(wireOuterPts, E_IO(pr(t, T.wireOuter, 0.48)), GOLD, 2.0, true, wireFade);
    drawBilateralTrace(wireGoldPts,  E_IO(pr(t, T.wireGold,  0.44)), 'rgba(248,249,250,0.75)', 1.25, false, wireFade);
    drawBilateralTrace(wireCorePts,  E_IO(pr(t, T.wireCore,  0.40)), 'rgba(212,175,55,0.55)', 1.0, false, wireFade);
  }

  shieldVerts.forEach(([vx, vy], i) => {
    const age = t - T.verts[i];
    if (age < 0) return;
    if (wireFade > 0.02) {
      ctx.save();
      ctx.globalAlpha = wireFade * 0.9;
      ctx.fillStyle = GOLD;
      ctx.fillRect(vx - 3.5, vy - 3.5, 7, 7);
      ctx.restore();
    }
    snapFlash(vx, vy, age, 18, GOLD);
  });

  // =======================================================================
  // 4. OFFSCREEN COMPOSITE OF ALL VECTOR LOGO ELEMENTS
  // =======================================================================
  lctx.setTransform(1, 0, 0, 1, 0, 0);
  lctx.globalCompositeOperation = 'source-over';
  lctx.globalAlpha = 1;
  lctx.clearRect(0, 0, W, H);

  // [4.1] Outer 3D White/Silver Shield Plate
  if (t >= T.shOuter) {
    const p = pr(t, T.shOuter, 0.36), e = E_OUT(p);
    drawLayerOn(lctx, IMG.shieldOuter, SHIELD_CX, SHIELD_CY, {
      alpha: clamp(p * 3.2),
      sc: lerp(1.14, 1.0, e)
    });
  }

  // [4.2] Split-Gold 3D Bevel Frame & Dark Rim
  if (t >= T.shGold) {
    const p = pr(t, T.shGold, 0.34), e = E_SNAP(p);
    drawLayerOn(lctx, IMG.shieldGold, SHIELD_CX, SHIELD_CY, {
      alpha: clamp(p * 3.5),
      sc: lerp(0.87, 1.0, e)
    });
  }

  // [4.3] Deep Crimson Shield Core + Radiant Sinar Cahaya (User: "itu aslinya sinar cahaya jadi masuknya bagaikan cahaya")
  if (t >= T.shCore) {
    const p = pr(t, T.shCore, 0.38), e = E_OUT(p);
    lctx.save();
    lctx.translate(LX, LY);
    lctx.scale(LW / VBW, LH / VBH);
    if (p < 1) {
      lctx.beginPath();
      lctx.arc(SHIELD_CX, SHIELD_CY, e * 10200, 0, Math.PI * 2);
      lctx.clip();
    }
    lctx.clip(corePath2D, 'evenodd');
    lctx.fillStyle = '#88050A';
    lctx.fill(corePath2D, 'evenodd');

    // Aset Bintang Tameng Merah: Zoom-in bersih tanpa cahaya kuning
    // User: "saya agak kurang sreg sama cahaya kuning yang muncul di tameng merah gtu, buat aset bintang itu jadi zoom-in aja."
    if (t >= T.shRays) {
      const rayP = pr(t, T.shRays, 0.45), rayE = E_OUT(rayP);
      const rayAlpha = clamp(rayP * 3.5);

      lctx.save();
      lctx.globalAlpha = rayAlpha;
      lctx.translate(SHIELD_CX, SHIELD_CY);
      // Zoom-in halus dari skala 0 ke 1 terpusat di tameng
      lctx.scale(rayE, rayE);
      lctx.translate(-SHIELD_CX, -SHIELD_CY);
      lctx.fillStyle = '#6B0508'; // Warna marun asli dari vektor tameng
      lctx.fill(rayPoly2D, 'evenodd');
      lctx.restore();
    }
    lctx.restore();
  }

  // =======================================================================
  // [4.4] SATU KESATUAN LATAR HITAM (Unified Backplate)
  // User: "Latar hitam dibawah tulisan LBB, bendera hitam putih, tulisan muallimin,
  // dan bendera merahputih itu satu kesatuan, jangan dipotong2, itu muncul sebelum semua elemen di atasnya."
  // =======================================================================
  if (t >= T.plateUnified) {
    const p = pr(t, T.plateUnified, 0.52), e = E_SNAP(p), eo = E_OUT(p);
    const alpha = clamp(p * 4.0);
    const sc = lerp(0.88, 1.0, e);
    const dy = (1 - eo) * 36;

    // Symmetrical scale & slide-up from center of emblem
    const pivX = SHIELD_CX, pivY = 9600;
    const px = sx2px(pivX), py = sy2py(pivY);

    lctx.save();
    lctx.globalAlpha = alpha;
    lctx.translate(px, py + dy);
    lctx.scale(sc, sc);
    lctx.translate(-px, -py);

    // Pass 1: Drop Shadow
    lctx.drawImage(IMG.plateShadow, LX, LY, LW, LH);
    // Pass 2: White Sticker Contour
    lctx.drawImage(IMG.plateWhite, LX, LY, LW, LH);
    // Pass 3: Black Inner Keyline Armor Plate (Includes interior negative space cutouts!)
    lctx.drawImage(IMG.plateBlack, LX, LY, LW, LH);

    lctx.restore();
  }

  // =======================================================================
  // [4.5] ELEMEN-ELEMEN DI ATAS LATAR HITAM
  // (Checkered Flags, Masked MU'ALLIMIN, Gold LBB, 2027, Indonesian Flags)
  // =======================================================================

  // [4.5.1] Bendera Kotak-Kotak (Checkered Flags) — Diayunkan naik, berombak sesaat lalu PAKEM kaku
  drawCheckeredFlag(lctx, IMG.fcL, LAY.flagCheckL, t);
  drawCheckeredFlag(lctx, IMG.fcR, LAY.flagCheckR, t);

  // [4.5.2] Tulisan MU'ALLIMIN — Masuk bagaikan kibaran bendera merah putih yang di-masking
  drawMaskedMuallimin(lctx, t);

  // [4.5.3] Tulisan LBB — Emas 3D dengan efek mengkilap (specular glint & gleam)
  drawGoldLbb(lctx, t);

  // [4.5.4] Angka "2027" — 4 Digit Perak 3D
  if (t >= T.year[0]) {
    const p = pr(t, T.year[0], 0.35), e = E_SNAP(p);
    drawLayerOn(lctx, IMG.yrFull, SHIELD_CX, 12800, {
      alpha: clamp(p * 4.0),
      dy: (1 - E_OUT(p)) * 28,
      sc: lerp(1.18, 1.0, e)
    });
  }

  // [4.5.5] Bendera Merah Putih — Masuk berkibar, setelah sampai di posisi langsung PAKEM
  drawIndonesianFlag(lctx, IMG.mpL, LAY.flagMpL, t);
  drawIndonesianFlag(lctx, IMG.mpR, LAY.flagMpR, t);

  // =======================================================================
  // [4.6] MASTER LOCK SPECULAR SHIMMER (3.00s / 4.90s)
  // =======================================================================
  if (t >= T.lock && t < T.lock + 0.35) {
    const flash = (1 - E_OUT(pr(t, T.lock, 0.35))) * 0.25;
    lctx.save();
    lctx.globalCompositeOperation = 'source-atop';
    lctx.fillStyle = `rgba(255,248,225,${flash})`;
    lctx.fillRect(LX - 40, LY - 40, LW + 80, LH + 80);
    lctx.restore();
  }

  const sp = pr(t, T.sweep[0], T.sweep[1] - T.sweep[0]);
  if (sp > 0 && sp < 1) {
    const sx = lerp(LX - LW * 0.45, LX + LW * 1.45, E_IO(sp));
    lctx.save();
    lctx.globalCompositeOperation = 'source-atop';
    const g = lctx.createLinearGradient(sx - 135, LY, sx + 135, LY + LH * 0.42);
    g.addColorStop(0, 'rgba(212,175,55,0)');
    g.addColorStop(0.35, 'rgba(255,223,128,0.18)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.34)');
    g.addColorStop(0.65, 'rgba(255,223,128,0.18)');
    g.addColorStop(1, 'rgba(212,175,55,0)');
    lctx.fillStyle = g;
    lctx.fillRect(LX - 20, LY - 20, LW + 40, LH + 40);
    lctx.restore();
  }

  // =======================================================================
  // 5. COMPOSITE LOGO ONTO MAIN STAGE
  // =======================================================================
  let masterScale = 1.0;
  if (t >= T.lock) {
    const lp = pr(t, T.lock, 0.34);
    const recoil = 1 + 0.042 * (1 - E_OUT(lp));
    const breath = 1 + 0.008 * Math.sin((t - T.lock) * 1.6);
    masterScale = recoil * (lp >= 1 ? breath : lerp(1, breath, lp));
  }

  if (t >= T.lock && t < T.lock + 0.55) {
    const wp = E_OUT(pr(t, T.lock, 0.55));
    ctx.save();
    ctx.globalAlpha = (1 - wp) * 0.55;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.5;
    const pad = wp * 110;
    ctx.strokeRect(LX - pad, LY - pad, LW + pad * 2, LH + pad * 2);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(540, 882);
  ctx.scale(masterScale, masterScale);
  ctx.translate(-540, -882);
  ctx.drawImage(logoCv, 0, 0);
  ctx.restore();

  // Component lock tactical crosshair micro-flashes
  snapFlash(sx2px(LAY.flagCheckL.tipX), sy2py(LAY.flagCheckL.tipY), t - (T.flagCheck + 0.24), 22, GOLD);
  snapFlash(sx2px(LAY.flagCheckR.tipX), sy2py(LAY.flagCheckR.tipY), t - (T.flagCheck + 0.24), 22, GOLD);
  snapFlash(sx2px(LAY.flagMpL.tipX),    sy2py(LAY.flagMpL.tipY),    t - (T.flagMp + 0.28),    22, WHITE);
  snapFlash(sx2px(LAY.flagMpR.tipX),    sy2py(LAY.flagMpR.tipY),    t - (T.flagMp + 0.28),    22, WHITE);
  snapFlash(540, sy2py(6300), t - (T.lbb[1] + 0.12), 26, GOLD);
  snapFlash(540, sy2py(12800), t - (T.year[1] + 0.10), 22, WHITE);

  // 6. Clamping Tactical Corner Brackets on Master Lock
  if (t >= T.brackets) {
    const fp = E_OUT(pr(t, T.brackets, 0.48));
    const pad = 42 + (1 - fp) * 52;
    ctx.save();
    ctx.globalAlpha = 0.55 * fp;
    brackets(LX - pad, LY - pad, LW + pad * 2, LH + pad * 2, 38, WHITE, 1.5);
    ctx.restore();
  }

  // 7. Bottom Tactical Telemetry Caption
  const cyb = 1426;
  hline(L, R, cyb - 44, 'rgba(248,249,250,.35)', E_LINE(pr(t, T.caption - 0.10, 0.48)));
  typeOn('LOMBA BARIS-BERBARIS', L, cyb, { size: 24, w: 600, ls: 2, color: WHITE }, t, T.caption);
  const rightTop = "MU'ALLIMIN · 2027";
  typeOn(rightTop, R - measure(rightTop, 'm', 24, 600, 2), cyb, { size: 24, w: 600, ls: 2, alpha: .62 }, t, T.caption + 0.14);
  typeOn('SD/MI · SMP/MTs · SE-DIY', L, cyb + 46, { size: 22, w: 500, ls: 2, color: GOLD }, t, T.caption + 0.32);
  if (t > T.caption + 0.48) {
    text('07°48′S  110°22′E', R, cyb + 46, {
      size: 20, w: 400, ls: 1, align: 'right',
      alpha: 0.48 * pr(t, T.caption + 0.48, 0.25)
    });
  }

  // 8. Top HUD + Matte Film Grain + Clean Fade-Out
  renderHud(t, bgAlpha);

  if (grain && bgAlpha > 0.05) {
    ctx.save();
    ctx.globalAlpha = bgAlpha;
    ctx.fillStyle = ctx.createPattern(grain, 'repeat');
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  const fo = E_IO(pr(t, T.fadeOut, T.dur - T.fadeOut));
  if (fo > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${fo})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
};

// Interactive live preview loop when opened directly in a desktop browser
if (!navigator.webdriver) {
  window.ready.then(() => {
    let t0 = performance.now();
    const loop = now => {
      const elapsed = ((now - t0) / 1000) % T.dur;
      window.renderFrame(elapsed);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
}
