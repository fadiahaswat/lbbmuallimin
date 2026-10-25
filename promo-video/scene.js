// LBB Mu'allimin 2027 – Promo v2 "Tactical Minimalism"
// Deterministic canvas renderer: window.renderFrame(t) draws the full frame at time t (seconds).
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const OBS = '#0F0F0F', WHITE = '#F8F9FA', CRIMSON = '#6E0D0D', GOLD = '#D4AF37';
const L = 72, R = 1008, CW = R - L;           // safe-zone content column
const DISP = 'Archivo', MONO = '"JetBrains Mono"';

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
const E_IO = bez(.7, 0, .2, 1);       // snappy in-out (masks, wipes)
const E_OUT = bez(.16, 1, .3, 1);     // expo-out (reveals)
const E_LINE = bez(.65, 0, .35, 1);   // hairline draw-on
const rnd = (() => { let s = 1337; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
const R1 = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/* ---------- assets ---------- */
const IMG = {};
const loadImg = (k, src) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.src = src; });
let grain, logoCv;
window.ready = Promise.all([
  loadImg('logo', 'assets/logo.png'),
  document.fonts.load('900 100px Archivo'), document.fonts.load('800 100px Archivo'),
  document.fonts.load('400 40px "JetBrains Mono"'), document.fonts.load('700 40px "JetBrains Mono"'),
]).then(() => {
  // static matte grain tile
  grain = document.createElement('canvas'); grain.width = grain.height = 256;
  const g = grain.getContext('2d'), id = g.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) { const v = rnd() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 13; }
  g.putImageData(id, 0, 0);
  logoCv = document.createElement('canvas');
});

/* ---------- typography ---------- */
function setF(f, size, w, ls) {
  ctx.font = `${w || (f === 'd' ? 800 : 400)} ${size}px ${f === 'd' ? DISP : MONO}`;
  ctx.fontStretch = f === 'd' ? 'expanded' : 'normal';
  ctx.letterSpacing = (ls ?? (f === 'd' ? -size * 0.02 : 0)) + 'px';
  ctx.textBaseline = 'alphabetic';
}
function measure(s, f, size, w, ls) { ctx.save(); setF(f, size, w, ls); const m = ctx.measureText(s).width; ctx.restore(); return m; }
function fit(s, f, w, width, max = 999) { return Math.min(max, 100 * width / measure(s, f, 100, w, f === 'd' ? -2 : 0)); }
const CAP = 0.73;  // approx cap-height ratio for both faces
function text(s, x, y, o = {}) {
  ctx.save(); setF(o.f || 'm', o.size || 22, o.w, o.ls);
  ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || WHITE; ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.fillText(s, x, y); ctx.restore();
}
// masked line reveal: glyphs slide up out of a hard clip box
function reveal(s, x, y, o, t, t0, d = 0.55) {
  const p = pr(t, t0, d); if (p <= 0) return; const e = E_OUT(p), size = o.size, cap = size * CAP;
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - cap - size * 0.14, W, cap + size * 0.3); ctx.clip();
  text(s, x, y + (1 - e) * (cap + size * 0.35), o); ctx.restore();
}
// mono type-on with block cursor
function typeOn(s, x, y, o, t, t0, cps = 48) {
  const n = Math.floor((t - t0) * cps); if (n <= 0) return;
  const sub = s.slice(0, n); text(sub, x, y, o);
  if (n < s.length + 6 && Math.floor(t * 8) % 2 === 0) {
    const wd = measure(sub, 'm', o.size || 22, o.w, o.ls);
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); ctx.fillStyle = GOLD; ctx.fillRect(x + wd + 4, y - (o.size || 22) * 0.78, (o.size || 22) * 0.55, (o.size || 22) * 0.9); ctx.restore();
  }
}
/* ---------- primitives ---------- */
function hline(x0, x1, y, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(x0, Math.round(y) - (lw > 1 ? lw / 2 : 0), (x1 - x0) * p, lw); }
function vline(x, y0, y1, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(Math.round(x), y0, lw, (y1 - y0) * p); }
function dashedV(x, y0, y1, col, p, dash = 10, gap = 8) { ctx.save(); ctx.fillStyle = col; const y1p = lerp(y0, y1, p); for (let y = y0; y < y1p; y += dash + gap) ctx.fillRect(Math.round(x), y, 1, Math.min(dash, y1p - y)); ctx.restore(); }
function dashedH(x0, x1, y, col, p, dash = 10, gap = 8) { ctx.save(); ctx.fillStyle = col; const x1p = lerp(x0, x1, p); for (let x = x0; x < x1p; x += dash + gap) ctx.fillRect(x, Math.round(y), Math.min(dash, x1p - x), 1); ctx.restore(); }
function brackets(x, y, w, h, len, col, lw = 2) {
  ctx.save(); ctx.fillStyle = col;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.fillRect(sx > 0 ? cx : cx - len, sy > 0 ? cy : cy - lw, len, lw);
    ctx.fillRect(sx > 0 ? cx : cx - lw, sy > 0 ? cy : cy - len, lw, len);
  });
  ctx.restore();
}
function cross(x, y, s, col) { ctx.fillStyle = col; ctx.fillRect(x - s, Math.round(y), s * 2 + 1, 1); ctx.fillRect(Math.round(x), y - s, 1, s * 2 + 1); }
function guides(dark, a = 1) {
  const c = dark ? `rgba(248,249,250,${.05 * a})` : `rgba(15,15,15,${.06 * a})`;
  [L, 540, R].forEach(x => vline(x, 0, H, c));
  const m = dark ? `rgba(248,249,250,${.35 * a})` : `rgba(15,15,15,${.35 * a})`;
  [[L, 290], [R, 290], [L, 1540], [R, 1540]].forEach(([x, y]) => cross(x, y, 9, m));
}
function sceneLabel(s, t, t0, dark = true) { typeOn(s, L, 330, { size: 22, w: 500, ls: 2, color: dark ? WHITE : OBS, alpha: .62 }, t, t0); }
// rolling mono odometer (digit drums)
function odometer(v, digits, x, y, size, color, w = 700) {
  ctx.save(); setF('m', size, w, 0); const cw = ctx.measureText('0').width, lh = size * 1.05;
  for (let p = 0; p < digits; p++) {
    const P = Math.pow(10, p); let d;
    if (p === 0) d = v % 10; else { const lower = v % P, base = Math.floor(v / P), fr = lower > P - 1 ? lower - (P - 1) : 0; d = (base + fr) % 10; }
    const k = Math.floor(d + 1e-6), f = d - k, cx = x + (digits - 1 - p) * cw;
    ctx.save(); ctx.beginPath(); ctx.rect(cx, y - size * 0.86, cw, size * 1.0); ctx.clip();
    ctx.fillStyle = color; ctx.textAlign = 'left';
    ctx.fillText(String(k % 10), cx, y - f * lh); ctx.fillText(String((k + 1) % 10), cx, y + (1 - f) * lh);
    ctx.restore();
  }
  ctx.restore(); return cw * digits;
}

/* ================= SCENES ================= */
// 01 HOOK ---------------------------------------------------------------
function sHook(t) {
  ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  typeOn('[01] BRIEFING — LBB MU\'ALLIMIN 2027', L, 330, { size: 22, w: 500, ls: 2, alpha: .62 }, t, 0.05);
  const lines = ['SIAPKAN', 'PELETON', 'TERBAIKMU.'];
  const sizes = lines.map(s => fit(s, 'd', 900, CW, 290));
  const caps = sizes.map(s => s * CAP), gap = 46;
  const total = caps.reduce((a, b) => a + b) + gap * 2;
  let y = 940 - total / 2; const base = [];
  caps.forEach(c => { y += c; base.push(y); y += gap; });
  // crimson structural bar behind line 2
  const bp = E_IO(pr(t, 0.42, 0.3));
  if (bp > 0) { ctx.fillStyle = CRIMSON; ctx.fillRect(0, base[1] - caps[1] - 22, W * bp, caps[1] + 44); }
  reveal('SIAPKAN', L - 4, base[0], { f: 'd', size: sizes[0], w: 900 }, t, T.hook.words[0]);
  reveal('PELETON', L - 4, base[1], { f: 'd', size: sizes[1], w: 900 }, t, T.hook.words[1]);
  reveal('TERBAIKMU', L - 4, base[2], { f: 'd', size: sizes[2], w: 900 }, t, T.hook.words[2]);
  if (t >= T.hook.dot) { const wd = measure('TERBAIKMU', 'd', sizes[2], 900, -sizes[2] * .02); text('.', L - 4 + wd, base[2], { f: 'd', size: sizes[2], w: 900, color: GOLD }); }
  const my = base[2] + 90;
  hline(L, R, my - 40, 'rgba(248,249,250,.35)', E_LINE(pr(t, T.hook.meta - .1, .5)));
  typeOn('SD/MI · SMP/MTs · SE-DIY', L, my, { size: 22, w: 500, ls: 2, color: GOLD }, t, T.hook.meta);
  if (t > T.hook.meta) text('07°48′S  110°22′E', R, my, { size: 22, w: 400, ls: 1, align: 'right', alpha: .5 * pr(t, T.hook.meta + .2, .2) });
}

// 01b LOGO --------------------------------------------------------------
function sLogo(t) {
  ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H);
  const rg = ctx.createRadialGradient(540, 880, 50, 540, 880, 900); rg.addColorStop(0, 'rgba(248,249,250,.045)'); rg.addColorStop(1, 'rgba(248,249,250,0)');
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); guides(true, .7);
  typeOn('OFFICIAL IDENT / LBB-27', L, 330, { size: 22, w: 500, ls: 2, alpha: .62 }, t, 2.55);
  const im = IMG.logo, h = 600, w = h * im.width / im.height, cx = 540, cy = 880;
  const p = pr(t, T.logo.in, .6), e = E_OUT(p), sc = 1.035 - .035 * e;
  if (logoCv.width !== Math.ceil(w)) { logoCv.width = Math.ceil(w); logoCv.height = h; }
  const lc = logoCv.getContext('2d'); lc.globalCompositeOperation = 'source-over'; lc.clearRect(0, 0, logoCv.width, h); lc.drawImage(im, 0, 0, w, h);
  const sp = pr(t, T.logo.sweep[0], T.logo.sweep[1] - T.logo.sweep[0]);
  if (sp > 0 && sp < 1) {
    const sx = lerp(-w * .6, w * 1.6, E_IO(sp)); lc.globalCompositeOperation = 'source-atop';
    const g = lc.createLinearGradient(sx - 110, 0, sx + 110, h * .35); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.26)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    lc.fillStyle = g; lc.fillRect(0, 0, w, h);
  }
  ctx.save(); ctx.globalAlpha = clamp(p * 2.5); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.drawImage(logoCv, -w / 2, -h / 2); ctx.restore();
  const fp = E_OUT(pr(t, 2.8, .5)), pad = 56 + (1 - fp) * 40;
  if (fp > 0) { ctx.save(); ctx.globalAlpha = .5 * fp; brackets(cx - w / 2 - pad, cy - h / 2 - pad, w + pad * 2, h + pad * 2, 36, WHITE, 1); ctx.restore(); }
  const cyb = 1330;
  hline(L, R, cyb - 44, 'rgba(248,249,250,.35)', E_LINE(pr(t, T.logo.caption - .15, .5)));
  typeOn('LOMBA BARIS-BERBARIS', L, cyb, { size: 24, w: 600, ls: 2 }, t, T.logo.caption);
  typeOn("MU'ALLIMIN · 2027", R - measure("MU'ALLIMIN · 2027", 'm', 24, 600, 2), cyb, { size: 24, w: 600, ls: 2, alpha: .6 }, t, T.logo.caption + .15);
  typeOn('SD/MI — SMP/MTs — SE-DIY', L, cyb + 46, { size: 22, w: 500, ls: 2, color: GOLD }, t, T.logo.caption + .4);
}

// 02 QUOTA --------------------------------------------------------------
function sQuota(t) {
  const Q = T.quota; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('02 — KUOTA PESERTA', t, Q.l1);
  const s1 = fit('KUOTA', 'd', 900, CW, 210), s2 = fit('TERBATAS:', 'd', 900, CW);
  const y1 = 380 + s1 * CAP, y2 = y1 + 30 + s2 * CAP;
  reveal('KUOTA', L - 4, y1, { f: 'd', size: s1, w: 900 }, t, Q.l1);
  reveal('TERBATAS:', L - 4, y2, { f: 'd', size: s2, w: 900, color: WHITE }, t, Q.l2);
  const gy = y2 + 76, ha = 300, hb = 330, col = 'rgba(248,249,250,.55)';
  const lp = i => E_LINE(pr(t, Q.grid + i * .08, .5));
  hline(L, R, gy, col, lp(0)); hline(L, R, gy + ha, col, lp(1)); hline(L, R, gy + ha + hb, col, lp(2));
  vline(L, gy, gy + ha + hb, col, lp(1)); vline(R, gy, gy + ha + hb, col, lp(2));
  vline(540, gy + ha, gy + ha + hb, col, E_LINE(pr(t, Q.split, .4)));
  if (t > Q.grid + .5) [[L, gy], [R, gy], [L, gy + ha], [R, gy + ha], [L, gy + ha + hb], [R, gy + ha + hb], [540, gy + ha], [540, gy + ha + hb]].forEach(([x, y], i) => {
    if (i >= 6 && t < Q.split + .3) return; ctx.fillStyle = GOLD; ctx.fillRect(x - 3, y - 3, 7, 7);
  });
  // row A — total odometer
  if (t > Q.grid + .1) {
    typeOn('TOTAL KUOTA', L + 28, gy + 46, { size: 20, w: 500, ls: 2, alpha: .6 }, t, Q.grid + .1);
    typeOn('MAX / 36', R - 28 - measure('MAX / 36', 'm', 20, 500, 2), gy + 46, { size: 20, w: 500, ls: 2, alpha: .6 }, t, Q.grid + .2);
  }
  if (t > Q.Q36.t0 - .1) odometer(T.odo(36, Q.Q36.t0, Q.Q36.d)(t), 2, L + 24, gy + ha - 36, 250, GOLD);
  reveal('PELETON', R - 28, gy + ha - 40, { f: 'd', size: 70, w: 800, align: 'right' }, t, Q.Q36.t0 + Q.Q36.d - .1);
  // row B — split 18 / 18
  [['KATEGORI A', 'SD/MI', L], ['KATEGORI B', 'SMP/MTs', 540]].forEach(([lab, name, x0], i) => {
    const t0 = Q.split + i * .12; if (t < t0) return;
    const x = x0 + 28, top = gy + ha, w = 468 - 56;
    typeOn(lab, x, top + 46, { size: 20, w: 500, ls: 2, alpha: .6 }, t, t0);
    reveal(name, x - 2, top + 116, { f: 'd', size: fit(name, 'd', 800, w, 48), w: 800 }, t, t0 + .05);
    const v = T.odo(18, Q.Q18.t0, Q.Q18.d)(t);
    odometer(v, 2, x - 4, top + hb - 34, 150, GOLD);
    const n = Math.floor(v + 1e-6), sq = 14, gp = 7, sx = x0 + 468 - 40 - 6 * (sq + gp) + gp, sy = top + hb - 34 - 3 * (sq + gp) + gp;
    for (let k = 0; k < 18; k++) {
      const cx = sx + (k % 6) * (sq + gp), cy = sy + Math.floor(k / 6) * (sq + gp);
      if (k < n) { ctx.fillStyle = WHITE; ctx.fillRect(cx, cy, sq, sq); } else { ctx.strokeStyle = 'rgba(248,249,250,.35)'; ctx.lineWidth = 1; ctx.strokeRect(cx + .5, cy + .5, sq - 1, sq - 1); }
    }
  });
}

// 03 FORMATION ----------------------------------------------------------
const FX = [270, 400, 530], FY0 = 800, FDY = 92, DANTON = [400, 690], CADY = 1470;
function sForm(t) {
  const F = T.form; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H);
  // blueprint grid
  const gp = E_LINE(pr(t, F.grid, .7));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 280, W, (1545 - 280) * gp); ctx.clip();
  for (let x = 40; x < W; x += 40) vline(x, 280, 1545, x % 200 === 0 ? 'rgba(248,249,250,.075)' : 'rgba(248,249,250,.03)');
  for (let y = 280; y <= 1545; y += 40) hline(0, W, y, (y - 280) % 200 === 0 ? 'rgba(248,249,250,.075)' : 'rgba(248,249,250,.03)');
  ctx.restore(); guides(true, .6);
  sceneLabel('03 — FORMASI RESMI / TOP VIEW · 1:50', t, F.grid);
  // headline: live count + PERSONEL
  const landed = (t >= F.danton ? 1 : 0) + T.snaps.slice(1).filter(s => t >= s).length + F.cad.filter(s => t >= s).length;
  if (t > F.title) {
    const a = pr(t, F.title, .2);
    ctx.save(); ctx.globalAlpha = a; setF('m', 200, 700, 0); ctx.fillStyle = landed === 25 ? GOLD : WHITE; ctx.fillText(String(landed).padStart(2, '0'), L - 8, 560); ctx.restore();
  }
  reveal('PERSONEL', L + 300, 478, { f: 'd', size: 74, w: 900 }, t, F.title + .1);
  typeOn('RESMI PER PELETON', L + 302, 530, { size: 22, w: 500, ls: 2, alpha: .6 }, t, F.title + .3);
  if (t > F.total) { hline(L + 302, R, 556, GOLD, E_LINE(pr(t, F.total, .4)), 2); typeOn('= 01 + 21 + 03', L + 302 + measure('RESMI PER PELETON', 'm', 22, 500, 2) + 24, 530, { size: 22, w: 600, ls: 2, color: GOLD }, t, F.total + .1); }
  // area frame
  const ap = E_OUT(pr(t, F.grid + .3, .5)); if (ap > 0) { ctx.save(); ctx.globalAlpha = .45 * ap; brackets(190, 630, 420, 890, 28, WHITE, 1); ctx.restore(); }
  // dims (3 banjar / 7 saf)
  const dp = E_LINE(pr(t, F.dims, .5));
  if (dp > 0) {
    const c = 'rgba(248,249,250,.6)';
    hline(FX[0], lerp(FX[0], FX[2], dp) , 755, c); [FX[0], FX[1], FX[2]].forEach(x => { if (x <= lerp(FX[0], FX[2], dp) + 1) vline(x, 749, 762, c); });
    vline(222, FY0, lerp(FY0, FY0 + 6 * FDY, dp), c); for (let r = 0; r < 7; r++) if (FY0 + r * FDY <= lerp(FY0, FY0 + 6 * FDY, dp) + 1) hline(216, 229, FY0 + r * FDY, c);
    text('3 BANJAR', FX[2] + 14, 760, { size: 16, w: 500, ls: 2, alpha: .7 * dp });
    ctx.save(); ctx.translate(205, FY0 + 3 * FDY); ctx.rotate(-Math.PI / 2); text('7 SAF', 0, 0, { size: 16, w: 500, ls: 2, align: 'center', alpha: .7 * dp }); ctx.restore();
  }
  // cadangan zone separator
  dashedH(200, 600, 1418, 'rgba(248,249,250,.35)', E_LINE(pr(t, F.cad[0] - .3, .4)));
  // symmetry axis
  if (t > F.axis) { dashedV(400, 640, 1510, GOLD, E_LINE(pr(t, F.axis, .5)), 8, 8); text('AXIS', 412, 1508, { size: 14, w: 600, ls: 2, color: GOLD, alpha: pr(t, F.axis + .3, .2) }); }
  // dots
  const dots = [{ k: 'D', x: DANTON[0], y: DANTON[1], t0: F.danton, lab: 'DNT' }];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) dots.push({ k: 'I', x: FX[c], y: FY0 + r * FDY, t0: F.inti0 + (r * 3 + c) * F.step, lab: 'ABC'[c] + (r + 1) });
  F.cad.forEach((t0, i) => dots.push({ k: 'C', x: FX[i], y: CADY, t0, lab: 'CAD' + (i + 1) }));
  dots.forEach(d => {
    const age = t - d.t0; if (age < 0) return;
    if (age < .25) { ctx.save(); ctx.globalAlpha = .7 * (1 - age / .25); hline(190, 610, d.y, GOLD); vline(d.x, 630, 1520, GOLD); ctx.restore(); }
    const sc = 1 + .3 * (1 - E_OUT(pr(age, 0, .18)));
    ctx.save(); ctx.translate(d.x, d.y); ctx.scale(sc, sc);
    if (d.k === 'D') { ctx.fillStyle = CRIMSON; ctx.beginPath(); ctx.arc(0, 0, 20, 0, 7); ctx.fill(); ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 29, 0, 7); ctx.stroke(); }
    else if (d.k === 'I') { ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fill(); }
    else { ctx.strokeStyle = WHITE; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.stroke(); }
    ctx.restore();
    if (age < .2) { ctx.save(); ctx.globalAlpha = 1 - age / .2; ctx.strokeStyle = WHITE; ctx.lineWidth = 1; ctx.strokeRect(d.x - 26 - age * 40, d.y - 26 - age * 40, 52 + age * 80, 52 + age * 80); ctx.restore(); }
    text(d.lab, d.x + 20, d.y - 18, { size: 13, w: 500, ls: 1, alpha: .5 * pr(age, .1, .2) });
  });
  // callouts
  const call = (t0, y, fromX, num, l1, l2) => {
    const p = pr(t, t0, .4); if (p <= 0) return;
    hline(fromX, lerp(fromX, 640, E_LINE(p)), y, 'rgba(248,249,250,.6)'); if (p > .6) { ctx.fillStyle = GOLD; ctx.fillRect(637, y - 3, 7, 7); }
    reveal(num, 660, y + 22, { size: 58, w: 700, color: GOLD, ls: 0 }, t, t0 + .1, .45);
    typeOn(l1, 750, y - 2, { size: 22, w: 600, ls: 2 }, t, t0 + .15);
    typeOn(l2, 750, y + 24, { size: 16, w: 500, ls: 2, alpha: .5 }, t, t0 + .3);
  };
  call(F.danton + .1, DANTON[1], 432, '01', 'DANTON', 'KOMANDAN PELETON');
  call(F.inti0 + 20 * F.step + .1, FY0 + 3 * FDY, 560, '21', 'PASUKAN INTI', 'MATRIX 3 × 7');
  call(F.cad[2] + .1, CADY, 560, '03', 'CADANGAN', 'RESERVE');
}

// 04 JURI + SCORING -----------------------------------------------------
const SCORES = [[86.5, 88.0, 84.2], [90.1, 87.4, 89.0], [85.0, 86.8, 88.3], [91.2, 89.5, 90.4]];
const TEAMS = ['SD-01', 'SD-02', 'SMP-01', 'SMP-02'];
function sJuri(t) {
  const J = T.juri;
  ctx.fillStyle = CRIMSON; ctx.fillRect(0, 0, W, 960); ctx.fillStyle = WHITE; ctx.fillRect(0, 960, W, 960);
  [[L, 290], [R, 290]].forEach(([x, y]) => cross(x, y, 9, 'rgba(248,249,250,.4)')); [[L, 1540], [R, 1540]].forEach(([x, y]) => cross(x, y, 9, 'rgba(15,15,15,.35)'));
  sceneLabel('04 — SISTEM PENILAIAN', t, J.panel);
  const s = fit('DEWAN JURI', 'd', 900, CW);
  reveal('DEWAN JURI', L - 4, 380 + s * CAP + 10, { f: 'd', size: s, w: 900 }, t, J.panel + .1);
  const rows = [['01', 'TNI / POLRI'], ['02', 'PROFESIONAL']], ry = [590, 730, 870];
  hline(L, R, ry[0], 'rgba(248,249,250,.4)', E_LINE(pr(t, J.rows[0] - .15, .5)));
  rows.forEach(([n, lab], i) => {
    const t0 = J.rows[i]; hline(L, R, ry[i + 1], 'rgba(248,249,250,.4)', E_LINE(pr(t, t0 - .05, .5)));
    reveal(n, L, ry[i] + 84, { size: 24, w: 700, color: GOLD }, t, t0, .4);
    reveal(lab, L + 90, ry[i] + 94, { f: 'd', size: fit(lab, 'd', 800, CW - 90, 70), w: 800 }, t, t0 + .05);
  });
  // bottom: dashboard
  const yh = 1105;
  if (t > J.dash) {
    const v = T.odo(100, J.pct.t0, J.pct.d)(t);
    ctx.save(); ctx.globalAlpha = pr(t, J.dash, .15); setF('m', 128, 700, 0); ctx.fillStyle = CRIMSON; ctx.fillText(String(Math.floor(v + 1e-6)).padStart(3, '0') + '%', L - 6, yh); ctx.restore();
  }
  reveal('REAL-TIME', 470, yh - 44, { f: 'd', size: fit('REAL-TIME', 'd', 900, R - 470, 54), w: 900, color: OBS }, t, J.dash + .1);
  typeOn('DIGITAL SCORING', 472, yh, { size: 26, w: 600, ls: 3, color: OBS }, t, J.dash + .25);
  const py = 1160, ph = 360, dpp = E_OUT(pr(t, J.dash + .1, .5));
  if (dpp > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(L, py, CW + 1, ph * dpp + 1); ctx.clip();
    ctx.strokeStyle = OBS; ctx.lineWidth = 1; ctx.strokeRect(L + .5, py + .5, CW, ph);
    ctx.fillStyle = OBS; ctx.fillRect(L, py, CW + 1, 50);
    text('LBB-27 / LIVE SCORING', L + 22, py + 33, { size: 18, w: 600, ls: 2 });
    const live = Math.floor(t * 2) % 2 === 0; ctx.fillStyle = live ? '#C0392B' : CRIMSON; ctx.beginPath(); ctx.arc(R - 210, py + 26, 6, 0, 7); ctx.fill();
    const tc = Math.max(0, t - J.dash); text('LIVE  ' + ('0' + Math.floor(tc / 60)).slice(-2) + ':' + ('0' + Math.floor(tc % 60)).slice(-2) + '.' + Math.floor((tc % 1) * 10), R - 194, py + 33, { size: 18, w: 600, ls: 2 });
    const cx = [L + 22, 420, 560, 700, 930], hdr = ['PELETON', 'PBB', 'VAR', 'FORMASI', 'TOTAL'];
    hdr.forEach((h, i) => text(h, cx[i], py + 84, { size: 15, w: 600, ls: 2, color: OBS, alpha: .5, align: i === 4 ? 'right' : 'left' }));
    hline(L, R, py + 100, 'rgba(15,15,15,.25)');
    TEAMS.forEach((tm, r) => {
      const y = py + 100 + r * 62; text(tm, cx[0], y + 41, { size: 22, w: 600, color: OBS });
      hline(L, R, y + 62, 'rgba(15,15,15,.12)');
      for (let c = 0; c < 4; c++) {
        const tk = J.cells0 + (r * 4 + c) * J.cellStep, age = t - tk, last = c === 3;
        const val = last ? (SCORES[r].reduce((a, b) => a + b)).toFixed(1) : SCORES[r][c].toFixed(1);
        if (age < 0) { text('—', cx[c + 1], y + 41, { size: 22, color: OBS, alpha: .25, align: last ? 'right' : 'left' }); continue; }
        if (age < .35) { ctx.fillStyle = `rgba(110,13,13,${.12 * (1 - age / .35)})`; const bw = last ? 130 : 110; ctx.fillRect(last ? cx[c + 1] - bw + 10 : cx[c + 1] - 10, y + 12, bw, 40); }
        text(val, cx[c + 1], y + 41, { size: 22, w: last ? 700 : 500, color: last ? CRIMSON : OBS, align: last ? 'right' : 'left' });
      }
    });
    ctx.restore();
  }
}

// 05 KATEGORI JUARA -----------------------------------------------------
function sJuara(t) {
  const K = T.juara; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); guides(false);
  sceneLabel('05 — KATEGORI JUARA', t, K.title, false);
  const s = fit('KATEGORI', 'd', 900, CW, 200), y1 = 380 + s * CAP, y2 = y1 + 26 + s * CAP;
  reveal('KATEGORI', L - 4, y1, { f: 'd', size: s, w: 900, color: OBS }, t, K.title);
  reveal('JUARA', L - 4, y2, { f: 'd', size: s, w: 900, color: CRIMSON }, t, K.title + .25);
  const py = y2 + 60, phh = 200;
  [['SD/MI', L, '01'], ['SMP/MTs', 548, '02']].forEach(([name, x, n], i) => {
    const p = pr(t, K.plates[i], .5); if (p <= 0) return; const e = E_OUT(p), w = 460;
    ctx.save(); ctx.beginPath(); ctx.rect(x, py + phh * (1 - e), w, phh * e); ctx.clip();
    ctx.fillStyle = CRIMSON; ctx.fillRect(x, py, w, phh);
    text('JUARA UMUM', x + 26, py + 46, { size: 18, w: 600, ls: 3, alpha: .75 });
    text(n, x + w - 26, py + 46, { size: 18, w: 700, color: GOLD, align: 'right' });
    text(name, x + 24, py + phh - 34, { f: 'd', size: fit(name, 'd', 900, w - 52, 84), w: 900 });
    ctx.restore();
  });
  const ly = py + phh + 80;
  const list = (x, x1, title, items, t0) => {
    if (t < t0 - .2) return;
    typeOn(title, x, ly, { size: 20, w: 700, ls: 3, color: OBS }, t, t0 - .2);
    hline(x, x1, ly + 22, OBS, E_LINE(pr(t, t0 - .2, .5)));
    items.forEach((it, i) => {
      const t1 = t0 + i * K.step, y = ly + 22 + (i + 1) * 74;
      reveal(String(i + 1).padStart(2, '0'), x, y - 22, { size: 22, w: 700, color: CRIMSON }, t, t1, .4);
      reveal(it, x + 64, y - 20, { f: 'd', size: 38, w: 800, color: OBS }, t, t1 + .03, .45);
      hline(x, x1, y, 'rgba(15,15,15,.18)', E_LINE(pr(t, t1, .4)));
      if (i === 0 && t > t1 + .3) { ctx.fillStyle = GOLD; ctx.fillRect(x1 - 10, y - 40, 10, 10); }
    });
  };
  list(L, 520, 'JUARA PELETON', ['JUARA 1', 'JUARA 2', 'JUARA 3', 'HARAPAN 1', 'HARAPAN 2', 'HARAPAN 3'], K.peleton0);
  list(568, 940, 'JUARA DANTON', ['JUARA 1', 'JUARA 2', 'JUARA 3'], K.danton0);
}

// 06 TICKETS ------------------------------------------------------------
function ticket(t, x, y, o) {
  const w = 452, h = 780, perf = 548, light = o.light, fg = light ? OBS : WHITE, bg = light ? WHITE : CRIMSON;
  ctx.save(); ctx.translate(x, y);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.moveTo(18, perf); ctx.arc(0, perf, 18, 0, 7); ctx.moveTo(w + 18, perf); ctx.arc(w, perf, 18, 0, 7);
  ctx.fillStyle = bg; ctx.fill('evenodd'); ctx.restore();
  text(o.tier, 30, 50, { size: 17, w: 600, ls: 3, color: fg, alpha: .6 });
  text('LBB-27', w - 30, 50, { size: 17, w: 600, ls: 3, color: fg, alpha: .6, align: 'right' });
  text(o.name, 28, 150, { f: 'd', size: fit(o.name, 'd', 900, w - 60, 74), w: 900, color: fg });
  text('PERIODE', 30, 222, { size: 16, w: 500, ls: 3, color: fg, alpha: .55 });
  text(o.date, 30, 262, { size: 30, w: 600, ls: 0, color: fg });
  hline(30, w - 30, 302, light ? 'rgba(15,15,15,.25)' : 'rgba(248,249,250,.3)');
  text('BIAYA / PELETON', 30, 352, { size: 16, w: 500, ls: 3, color: fg, alpha: .55 });
  text('Rp', 30, 398, { size: 26, w: 500, color: fg });
  // price with .108 highlight
  const size = 70; ctx.save(); setF('m', size, 700, 0); const cw = ctx.measureText('0').width; ctx.restore();
  const px = 26, py = 486, hp = pr(t, o.hl, .35), hc = light ? CRIMSON : GOLD;
  text(o.price, px, py, { size, w: 700, color: fg, ls: 0 });
  text('.108', px + cw * 3, py, { size, w: 700, color: hp > 0 ? hc : fg, ls: 0 });
  text(',-', px + cw * 7, py, { size, w: 700, color: fg, ls: 0 });
  if (hp > 0) { ctx.fillStyle = GOLD; ctx.fillRect(px + cw * 3 + 4, py + 16, (cw * 4 - 8) * E_OUT(hp), 4); text('KODE UNIK', px + cw * 3 + 4, py + 46, { size: 14, w: 700, ls: 3, color: hc, alpha: pr(t, o.hl + .1, .2) }); }
  // perforation
  for (let xx = 30; xx < w - 30; xx += 14) { ctx.fillStyle = light ? 'rgba(15,15,15,.35)' : 'rgba(248,249,250,.4)'; ctx.fillRect(xx, perf, 7, 1); }
  // stub: barcode + serial
  for (let i = 0, bx = 30; bx < w - 30; i++) { const bw = 1 + Math.floor(R1(i + o.seed) * 4); if (R1(i * 3 + o.seed) > .35) { ctx.fillStyle = fg; ctx.fillRect(bx, perf + 50, bw, 86); } bx += bw + 2; }
  text(o.serial, 30, perf + 172, { size: 16, w: 500, ls: 3, color: fg, alpha: .6 });
  text('.108', w - 30, perf + 172, { size: 16, w: 700, ls: 2, color: light ? CRIMSON : GOLD, align: 'right' });
  ctx.restore();
}
function sTicket(t) {
  const K = T.ticket; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('06 — PENDAFTARAN', t, K.title);
  const s = fit('PENDAFTARAN', 'd', 900, CW), y1 = 380 + s * CAP;
  reveal('PENDAFTARAN', L - 4, y1, { f: 'd', size: s, w: 900 }, t, K.title);
  const cy = 590;
  [{ tier: 'TIER 01', name: 'PRESALE', date: '26 OKT — 8 NOV', price: '350', light: true, hl: K.hl[0], serial: 'LBB27-PS', seed: 11 },
  { tier: 'TIER 02', name: 'WAVE 2', date: '9 — 22 NOV', price: '400', light: false, hl: K.hl[1], serial: 'LBB27-W2', seed: 47 }].forEach((o, i) => {
    const p = pr(t, K.cards[i], .55); if (p <= 0) return; const e = E_OUT(p);
    ctx.save(); ctx.globalAlpha = clamp(p * 4); ticket(t, L + i * (452 + 32), cy + (1 - e) * 160, o); ctx.restore();
  });
  const ny = cy + 780 + 64;
  typeOn('* KODE UNIK', L, ny, { size: 20, w: 600, ls: 2, alpha: .7 }, t, K.note);
  if (t > K.note + .25) text('.108', L + measure('* KODE UNIK ', 'm', 20, 600, 2), ny, { size: 20, w: 700, ls: 2, color: GOLD });
  typeOn('WAJIB PADA NOMINAL TRANSFER', L, ny + 32, { size: 20, w: 600, ls: 2, alpha: .7 }, t, K.note + .35);
}

// 07 CTA ----------------------------------------------------------------
function sCta(t) {
  const C = T.cta; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('07 — REGISTRASI', t, C.title);
  const s = fit('SEKARANG.', 'd', 900, CW), y1 = 380 + s * CAP, y2 = y1 + 22 + s * CAP;
  reveal('DAFTAR', L - 4, y1, { f: 'd', size: s, w: 900 }, t, C.title);
  reveal('SEKARANG', L - 4, y2, { f: 'd', size: s, w: 900 }, t, C.title + .2);
  if (t > C.title + .45) text('.', L - 4 + measure('SEKARANG', 'd', s, 900, -s * .02), y2, { f: 'd', size: s, w: 900, color: GOLD });
  // QR
  const M = window.QRM, n = M.length, S = 406, pad = 30, box = S + pad * 2, bx = 540 - box / 2, by = y2 + 70;
  if (t > C.qr[0]) {
    ctx.fillStyle = WHITE; ctx.fillRect(bx, by, box, box);
    const rows = Math.floor(n * pr(t, C.qr[0], C.qr[1] - C.qr[0])), ms = S / n;
    ctx.fillStyle = OBS;
    for (let r = 0; r < rows; r++) for (let c = 0; c < n; c++) if (M[r][c] === '1') ctx.fillRect(Math.floor(bx + pad + c * ms), Math.floor(by + pad + r * ms), Math.ceil(ms), Math.ceil(ms));
    if (rows < n) hline(bx, bx + box, by + pad + rows * ms, GOLD, 1, 2);
    const lp = E_OUT(pr(t, C.lock - .2, .3)), off = 26 + (1 - lp) * 70;
    if (lp > 0) { ctx.save(); ctx.globalAlpha = lp; brackets(bx - off, by - off, box + off * 2, box + off * 2, 54, t >= C.lock ? WHITE : 'rgba(248,249,250,.6)', 3); ctx.restore(); }
    if (t > C.lock) text('SCAN', bx + box + 26, by + box + 26 + 24, { size: 16, w: 700, ls: 3, color: GOLD, align: 'right', alpha: pr(t, C.lock, .15) });
  }
  // contact rows
  const ry = by + box + 130;
  [['WEB', 'lbb.tontimuallimin.com'], ['WHATSAPP', '0819-4749-1505'], ['INSTAGRAM', '@lbbmuin']].forEach(([k, v], i) => {
    const t0 = C.rows[i], y = ry + i * 82;
    hline(L, R, y - 50, 'rgba(248,249,250,.3)', E_LINE(pr(t, t0 - .1, .45)));
    typeOn(k, L, y, { size: 17, w: 700, ls: 3, color: GOLD }, t, t0);
    reveal(v, L + 228, y + 3, { size: 38, w: 600, ls: 0 }, t, t0 + .05, .45);
    if (i === 2) hline(L, R, y + 32, 'rgba(248,249,250,.3)', E_LINE(pr(t, t0, .45)));
  });
}

/* ================= MASTER ================= */
const SCENES = [sHook, sLogo, sQuota, sForm, sJuri, sJuara, sTicket, sCta];
const THEME = ['d', 'd', 'd', 'd', 'c', 'l', 'd', 'd'];
const LABELS = ['HOOK', 'IDENT', 'KUOTA', 'FORMASI', 'JURI', 'JUARA', 'TIKET', 'DAFTAR'];
const sceneIndex = t => { let k = 0; T.cuts.forEach((c, i) => { if (t >= c) k = i + 1; }); return k; };
const COLS = 6, CWID = W / COLS;
function colP(t, tb, i, lag) { return E_IO(pr(t, tb + i * .03 + lag, .28)); }
function hud(t, k) {
  const dark = THEME[k] !== 'l', c = dark ? WHITE : OBS;
  text("LBB MU'ALLIMIN — 2027", L, 236, { size: 18, w: 600, ls: 2, color: c, alpha: .8 });
  const tc = '00:' + ('0' + Math.floor(t)).slice(-2) + '.' + Math.floor((t % 1) * 10);
  text(`${String([1, 1, 2, 3, 4, 5, 6, 7][k]).padStart(2, '0')} / ${LABELS[k]}   ${tc}`, R, 236, { size: 18, w: 500, ls: 2, color: c, alpha: .8, align: 'right' });
  hline(L, R, 256, dark ? 'rgba(248,249,250,.18)' : 'rgba(15,15,15,.18)');
  hline(L, lerp(L, R, t / T.dur), 256, GOLD);
  T.cuts.forEach(cu => { const x = lerp(L, R, cu / T.dur); ctx.fillStyle = c; ctx.globalAlpha = .5; ctx.fillRect(Math.round(x), 252, 1, 9); ctx.globalAlpha = 1; });
}
window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const k = sceneIndex(t), tb = k > 0 ? T.cuts[k - 1] : -9, inTr = k > 0 && t < tb + .55;
  if (!inTr) SCENES[k](t);
  else {
    SCENES[k - 1](t);
    for (let i = 0; i < COLS; i++) {           // crimson leading edge
      const p = colP(t, tb, i, 0), top = i % 2 === 0; if (p <= 0) continue;
      ctx.fillStyle = CRIMSON; ctx.fillRect(Math.floor(i * CWID), top ? 0 : H * (1 - p), Math.ceil(CWID) + 1, H * p);
    }
    ctx.save(); ctx.beginPath(); let any = false;
    for (let i = 0; i < COLS; i++) { const p = colP(t, tb, i, .08), top = i % 2 === 0; if (p <= 0) continue; any = true; ctx.rect(Math.floor(i * CWID), top ? 0 : H * (1 - p), Math.ceil(CWID) + 1, H * p); }
    if (any) { ctx.clip(); SCENES[k](t); } ctx.restore();
  }
  hud(t, inTr && t < tb + .3 ? k - 1 : k);
  if (grain) { ctx.save(); ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fo = pr(t, T.dur - .45, .45); if (fo > 0) { ctx.fillStyle = `rgba(15,15,15,${fo})`; ctx.fillRect(0, 0, W, H); }
};
