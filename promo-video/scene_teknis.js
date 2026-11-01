// LBB Mu'allimin 2027 – "Panduan Teknis Lapangan & Aturan Main" (Tactical Minimalism, 50s)
// Deterministic canvas renderer: window.renderFrame(t).
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const OBS = '#0F0F0F', WHITE = '#F8F9FA', CRIMSON = '#6E0D0D', ALERT = '#C92A2A', GOLD = '#D4AF37', GREEN = '#16A34A', CYAN = '#38BDF8', CARD = '#161616';
const L = 72, R = 1008, CW = R - L;
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
const E_IO = bez(.7, 0, .2, 1), E_OUT = bez(.16, 1, .3, 1), E_LINE = bez(.65, 0, .35, 1);
const rnd = (() => { let s = 202705; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();

/* ---------- assets ---------- */
const IMG = {};
const loadImg = (k, src) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.onerror = () => { console.log('IMG FAIL ' + src); r(); }; im.src = src; });
let grain;
window.ready = Promise.all([
  loadImg('logo', 'assets/logo.png'),
  loadImg('tonti', 'assets/tonti-muallimin.png'),
  document.fonts.load('900 100px Archivo'), document.fonts.load('800 100px Archivo'),
  document.fonts.load('400 40px "JetBrains Mono"'), document.fonts.load('700 40px "JetBrains Mono"'),
]).then(() => {
  grain = document.createElement('canvas'); grain.width = grain.height = 256;
  const g = grain.getContext('2d'), id = g.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) { const v = rnd() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 13; }
  g.putImageData(id, 0, 0);
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
const CAP = 0.73;
function text(s, x, y, o = {}) {
  ctx.save(); setF(o.f || 'm', o.size || 22, o.w, o.ls);
  ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || WHITE; ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.fillText(s, x, y); ctx.restore();
}
function reveal(s, x, y, o, t, t0, d = 0.5) {
  const p = pr(t, t0, d); if (p <= 0) return; const e = E_OUT(p), size = o.size, cap = size * CAP;
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - cap - size * 0.16, W, cap + size * 0.34); ctx.clip();
  text(s, x, y + (1 - e) * (cap + size * 0.35), o); ctx.restore();
}
function typeOn(s, x, y, o, t, t0, cps = 52) {
  const n = Math.floor((t - t0) * cps); if (n <= 0) return;
  const sub = s.slice(0, n); text(sub, x, y, o);
  if (n < s.length + 5 && Math.floor(t * 8) % 2 === 0) {
    const sz = o.size || 22, wd = measure(sub, 'm', sz, o.w, o.ls);
    const base = o.align === 'center' ? x + wd / 2 : (o.align === 'right' ? x : x + wd);
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); ctx.fillStyle = o.cursor || GOLD; ctx.fillRect(base + 4, y - sz * 0.78, sz * 0.52, sz * 0.88); ctx.restore();
  }
}

/* ---------- primitives ---------- */
function hline(x0, x1, y, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(x0, Math.round(y) - (lw > 1 ? lw / 2 : 0), (x1 - x0) * p, lw); }
function vline(x, y0, y1, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(Math.round(x), y0, lw, (y1 - y0) * p); }
function dashedH(x0, x1, y, col, p = 1, dash = 10, gap = 8) { ctx.fillStyle = col; const x1p = lerp(x0, x1, p); for (let x = x0; x < x1p; x += dash + gap) ctx.fillRect(x, Math.round(y), Math.min(dash, x1p - x), 1.5); }
function strokeR(x, y, w, h, col, lw = 1) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.strokeRect(x + .5, y + .5, w, h); }
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
  [[L, 286], [R, 286], [L, 1545], [R, 1545]].forEach(([x, y]) => cross(x, y, 9, m));
}
function sceneLabel(s, t, t0, dark = true) { typeOn(s, L, 326, { size: 21, w: 600, ls: 2, color: dark ? GOLD : CRIMSON, alpha: .9 }, t, t0); }
function check(x, y, s, col, lw = 3) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'square'; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .8); ctx.stroke(); ctx.restore(); }
function drawImgH(im, cx, cy, h, alpha = 1) { if (!im) return; const w = h * im.width / im.height; ctx.save(); ctx.globalAlpha *= alpha; ctx.drawImage(im, cx - w / 2, cy - h / 2, w, h); ctx.restore(); return w; }

function drawBootSole(cx, cy, scale = 1, col = WHITE, fillAlpha = 0.18) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.beginPath();
  // Tactical combat boot sole silhouette (vertical, toe pointing UP)
  ctx.moveTo(-24, -68);
  ctx.bezierCurveTo(-12, -88, 12, -88, 24, -68); // toe tip
  ctx.bezierCurveTo(34, -44, 32, -14, 24, 10);  // outer midfoot
  ctx.bezierCurveTo(20, 26, 26, 48, 24, 66);    // outer heel
  ctx.bezierCurveTo(16, 82, -16, 82, -24, 66);  // heel cup
  ctx.bezierCurveTo(-26, 48, -18, 26, -22, 10); // arch
  ctx.bezierCurveTo(-30, -14, -34, -44, -24, -68);
  ctx.closePath();
  ctx.fillStyle = col;
  ctx.globalAlpha *= fillAlpha;
  ctx.fill();
  ctx.globalAlpha /= fillAlpha;
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.stroke();
  // Sole treads
  ctx.lineWidth = 2;
  [-50, -32, -14, 34, 52].forEach(yy => {
    ctx.beginPath(); ctx.moveTo(-16, yy); ctx.lineTo(16, yy); ctx.stroke();
  });
  ctx.restore();
}

function drawFlagIcon(x, y, s, col, wave = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(0, s); ctx.lineTo(0, -s); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.7, -s + Math.sin(wave) * 6, s * 1.35, -s * 0.65);
  ctx.lineTo(s * 1.35, -s * 0.05);
  ctx.quadraticCurveTo(s * 0.7, -s * 0.35 + Math.sin(wave) * 6, 0, -s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWhistleIcon(x, y, s, col) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(-4, 4, s * 0.48, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(-4, 4, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(0, -s * 0.38, s * 0.85, s * 0.36);
  ctx.restore();
}

/* ================= SCENES ================= */

// 01 HOOK (0 - 5s) ----------------------------------------------------------
function sHook(t) {
  const K = T.hook; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  typeOn('[!] JUKNIS LAPANGAN & PROTOKOL PENILAIAN', L, 326, { size: 20, w: 600, ls: 2, color: GOLD }, t, K.tag);

  // Official Logo top-right subtle badge or centered
  const lp = pr(t, K.logo, .45);
  if (lp > 0) {
    drawImgH(IMG.logo, 540, 485, 220 * (1.04 - .04 * E_OUT(lp)), clamp(lp * 2.2));
  }

  const s1 = fit('ATURAN ARENA.', 'd', 900, CW);
  const y1 = 640 + s1 * CAP, y2 = y1 + 22 + s1 * CAP;
  reveal('ATURAN', L - 4, y1, { f: 'd', size: s1, w: 900 }, t, K.l[0]);
  reveal('ARENA', L - 4, y2, { f: 'd', size: s1, w: 900 }, t, K.l[1]);
  if (t > K.l[1] + .28) text('.', L - 4 + measure('ARENA', 'd', s1, 900, -s1 * .02), y2, { f: 'd', size: s1, w: 900, color: GOLD });

  // Crimson tactical block
  const s3 = fit('MENENTUKAN NILAI.', 'd', 900, CW);
  const by = y2 + 54, bh = s3 * CAP * 2 + 26 + 86, bp = E_IO(pr(t, K.l[2] - .08, .3));
  if (bp > 0) { ctx.fillStyle = CRIMSON; ctx.fillRect(0, by, W * bp, bh); }
  const y3 = by + 42 + s3 * CAP, y4 = y3 + 24 + s3 * CAP;
  reveal('SATU LANGKAH', L - 4, y3, { f: 'd', size: s3, w: 900 }, t, K.l[2]);
  reveal('MENENTUKAN NILAI', L - 4, y4, { f: 'd', size: s3, w: 900, color: WHITE }, t, K.l[3]);
  if (t > K.l[3] + .28) text('.', L - 4 + measure('MENENTUKAN NILAI', 'd', s3, 900, -s3 * .02), y4, { f: 'd', size: s3, w: 900, color: GOLD });

  const my = by + bh + 68;
  hline(L, R, my - 40, 'rgba(248,249,250,.3)', E_LINE(pr(t, K.sub - .1, .45)));
  typeOn('WAJIB DIPAHAMI DANTON, OFFICIAL & PELATIH.', L, my, { size: 24, w: 700, ls: 1.5, color: GOLD }, t, K.sub, 46);
  if (t > K.sub + .5) {
    brackets(L, my + 34, CW, 76, 18, 'rgba(248,249,250,.35)', 1.5);
    text('KAMPUS TERPADU SEDAYU · 2 ARENA SIMULTAN', 540, my + 80, { size: 19, w: 600, ls: 2, align: 'center', alpha: .75 * pr(t, K.sub + .5, .3) });
  }
}

// 02 SPESIFIKASI 2 ARENA (5 - 13s) ------------------------------------------
function drawArenaCard(t, y, cfg) {
  const p = E_OUT(pr(t, cfg.tCard, .45)); if (p <= 0) return;
  const h = 490;
  ctx.save();
  ctx.beginPath(); ctx.rect(L - 2, y - 2, CW + 4, h * p + 4); ctx.clip();
  ctx.fillStyle = CARD; ctx.fillRect(L, y, CW, h);
  strokeR(L, y, CW, h, 'rgba(248,249,250,.32)');
  ctx.fillStyle = cfg.accent; ctx.fillRect(L, y, CW + 1, 56);
  text(cfg.header, L + 24, y + 37, { size: 20, w: 700, ls: 2.5, color: cfg.headerFg || WHITE });
  text(cfg.venue, R - 24, y + 37, { size: 17, w: 600, ls: 1.5, align: 'right', color: cfg.headerFg || WHITE, alpha: .9 });

  // Left: Top-down Blueprint Arena Diagram
  const gp = E_IO(pr(t, cfg.tGrid, .5));
  const gx = L + 34, gy = y + 96, gw = 430, gh = 260;
  if (gp > 0) {
    ctx.save(); ctx.globalAlpha *= gp;
    ctx.fillStyle = '#101418'; ctx.fillRect(gx, gy, gw, gh);
    // Subtle blueprint grid
    for (let i = 1; i < 8; i++) vline(gx + i * (gw / 8), gy, gy + gh, 'rgba(56,189,248,.1)');
    for (let j = 1; j < 5; j++) hline(gx, gx + gw, gy + j * (gh / 5), 'rgba(56,189,248,.1)');
    strokeR(gx, gy, gw, gh, WHITE, 2);
    brackets(gx - 8, gy - 8, gw + 16, gh + 16, 14, GOLD, 2);

    // Meja Juri (Top outside)
    ctx.fillStyle = GOLD; ctx.fillRect(gx + gw / 2 - 58, gy - 20, 116, 12);
    text('MEJA JURI', gx + gw / 2, gy - 26, { size: 11, w: 700, ls: 2, align: 'center', color: GOLD });

    // Kotak Danton inside top boundary (1.5 x 1.5m)
    const kx = gx + gw / 2 - 18, ky = gy + 8;
    strokeR(kx, ky, 36, 36, ALERT, 2);
    ctx.fillStyle = ALERT; ctx.beginPath(); ctx.arc(gx + gw / 2, ky + 18, 5, 0, 7); ctx.fill();

    // 3x7 formation dots in center
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        ctx.fillStyle = 'rgba(248,249,250,.78)';
        ctx.beginPath(); ctx.arc(gx + 106 + c * 36, gy + 112 + r * 34, 4.2, 0, 7); ctx.fill();
      }
    }

    // Dimension labels on blueprint
    text(cfg.wLabel, gx + gw / 2, gy + gh + 28, { size: 16, w: 700, ls: 2, align: 'center', color: CYAN });
    ctx.save(); ctx.translate(gx - 16, gy + gh / 2); ctx.rotate(-Math.PI / 2);
    text(cfg.hLabel, 0, 0, { size: 16, w: 700, ls: 2, align: 'center', color: CYAN });
    ctx.restore();
    ctx.restore();
  }

  // Right: Specs & Duration
  const rx = L + 505;
  if (t > cfg.tDim) {
    text('UKURAN ARENA RESMI', rx, y + 114, { size: 15, w: 600, ls: 2, alpha: .55 });
    reveal(cfg.dimText, rx, y + 180, { f: 'd', size: 62, w: 900, color: WHITE }, t, cfg.tDim, .4);
    hline(rx, R - 32, y + 206, 'rgba(248,249,250,.22)', E_LINE(pr(t, cfg.tDim + .1, .35)));
  }
  if (t > cfg.tDur) {
    text('DURASI TAMPIL MAKSIMAL', rx, y + 250, { size: 15, w: 600, ls: 2, alpha: .55 });
    const dp = pr(t, cfg.tDur, .4);
    reveal(cfg.durText, rx, y + 324, { f: 'd', size: 68, w: 900, color: GOLD }, t, cfg.tDur, .4);
    if (dp > .5) {
      ctx.fillStyle = 'rgba(212,175,55,.14)'; ctx.fillRect(rx, y + 348, R - 32 - rx, 44);
      ctx.fillStyle = GOLD; ctx.fillRect(rx, y + 348, 5, 44);
      text(cfg.warnText, rx + 16, y + 376, { size: 16, w: 700, ls: 1, color: GOLD });
    }
  }
  text(cfg.footNote, L + 34, y + 448, { size: 16, w: 500, ls: 1, alpha: .65 * pr(t, cfg.tDur + .2, .3) });
  ctx.restore();
}

function sArena(t) {
  const A = T.arena; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true, .75);
  sceneLabel('01 — SPESIFIKASI DIMENSI & DURASI ARENA', t, A.label);

  drawArenaCard(t, 360, {
    tCard: A.card1, tGrid: A.grid1, tDim: A.dim1, tDur: A.dur1,
    accent: CRIMSON,
    header: 'ARENA 1 · TINGKAT SD / MI',
    venue: 'LAPANGAN BASKET',
    wLabel: '25 METER', hLabel: '14 METER',
    dimText: '25 × 14 M',
    durText: '08 MENIT',
    warnText: 'PELUIT 1×: MNT 7 · HABIS: MNT 8',
    footNote: '• LOKASI: KAMPUS TERPADU SEDAYU (ARENA 1)'
  });

  drawArenaCard(t, 886, {
    tCard: A.card2, tGrid: A.grid2, tDim: A.dim2, tDur: A.dur2,
    accent: '#1F4E9C',
    header: 'ARENA 2 · TINGKAT SMP / MTs',
    venue: 'PELATARAN EMBUNG',
    wLabel: '26 METER', hLabel: '15 METER',
    dimText: '26 × 15 M',
    durText: '12 MENIT',
    warnText: 'PELUIT 1×: MNT 11 · HABIS: MNT 12',
    footNote: '• LOKASI: KAMPUS TERPADU SEDAYU (ARENA 2)'
  });

  const np = E_IO(pr(t, A.note, .35));
  if (np > 0) {
    const ny = 1412;
    ctx.fillStyle = 'rgba(248,249,250,.07)'; ctx.fillRect(L, ny, CW * np, 96);
    ctx.fillStyle = GOLD; ctx.fillRect(L, ny, 6, 96 * np);
    if (np > .6) {
      typeOn('PERLOMBAAN DILAKSANAKAN TERPISAH & SIMULTAN', L + 24, ny + 40, { size: 20, w: 700, ls: 1.5, color: GOLD }, t, A.note + .1, 65);
      typeOn('PASTIKAN PELETON BERADA DI ARENA SESUAI JENJANG.', L + 24, ny + 74, { size: 17, w: 500, ls: 1, alpha: .8 }, t, A.note + .35, 70);
    }
  }
}

// 03 KOTAK DANTON & ASAS GARIS SEBAGAI GARIS (13 - 22s) ---------------------
function sKotak(t) {
  const K = T.kotak; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); guides(false);
  sceneLabel('02 — KOTAK DANTON & PRINSIP GARIS BATAS', t, K.label, false);

  // Module Top: Kotak Danton 1.5 x 1.5m & Pergerakan
  const my = 358, mh = 475, mp = E_OUT(pr(t, K.map, .45));
  if (mp > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(L - 2, my - 2, CW + 4, mh * mp + 4); ctx.clip();
    strokeR(L, my, CW, mh, OBS, 1.5);
    ctx.fillStyle = OBS; ctx.fillRect(L, my, CW + 1, 54);
    text('KOTAK DANTON · 1,5 × 1,5 METER', L + 24, my + 36, { size: 20, w: 700, ls: 2.5, color: WHITE });
    text('BATAS DEPAN ARENA', R - 24, my + 36, { size: 16, w: 600, ls: 2, color: GOLD, align: 'right' });

    // Left diagram: Juri at top, Kotak Danton, Peleton below, Danton moving from center to box
    const dx = L + 28, dy = my + 82, dw = 390, dh = 360;
    ctx.fillStyle = '#F1F3F5'; ctx.fillRect(dx, dy, dw, dh);
    strokeR(dx, dy, dw, dh, 'rgba(15,15,15,.4)', 1.5);
    // Meja Juri bar at top
    ctx.fillStyle = OBS; ctx.fillRect(dx + dw / 2 - 75, dy + 14, 150, 24);
    text('MEJA DEWAN JURI', dx + dw / 2, dy + 31, { size: 12, w: 700, ls: 1.5, align: 'center', color: GOLD });

    // Arena front line
    hline(dx + 20, dx + dw - 20, dy + 62, OBS, 1, 2.5);
    // Kotak Danton (1.5 x 1.5m)
    const bx = dx + dw / 2 - 42, by = dy + 62;
    ctx.fillStyle = 'rgba(110,13,13,.1)'; ctx.fillRect(bx, by, 84, 84);
    strokeR(bx, by, 84, 84, CRIMSON, 2.5);
    text('1,5 × 1,5m', dx + dw / 2, by + 104, { size: 13, w: 700, align: 'center', color: CRIMSON });

    // Peleton rows below
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        ctx.fillStyle = OBS;
        ctx.beginPath(); ctx.arc(dx + 69 + c * 42, dy + 235 + r * 36, 5.5, 0, 7); ctx.fill();
      }
    }
    text('FORMASI PELETON', dx + dw / 2, dy + 342, { size: 13, w: 700, ls: 2, align: 'center', color: OBS, alpha: .55 });

    // Animated Danton dot moving from center report (dy+185) into Kotak Danton (by+42)
    const mv = E_IO(pr(t, K.dantonMove[0], K.dantonMove[1] - K.dantonMove[0]));
    const dantonY = lerp(dy + 185, by + 42, mv);
    if (mv > 0 && mv < 1) dashedH(dx + dw / 2 - 2, dx + dw / 2 + 2, by + 42, CRIMSON);
    ctx.fillStyle = CRIMSON; ctx.beginPath(); ctx.arc(dx + dw / 2, dantonY, 10, 0, 7); ctx.fill();
    // Facing arrow (pointing DOWN towards peleton when inside box)
    if (mv >= 0.8) {
      ctx.strokeStyle = CRIMSON; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(dx + dw / 2, dantonY + 12); ctx.lineTo(dx + dw / 2, dantonY + 28);
      ctx.lineTo(dx + dw / 2 - 6, dantonY + 21); ctx.moveTo(dx + dw / 2, dantonY + 28); ctx.lineTo(dx + dw / 2 + 6, dantonY + 21);
      ctx.stroke();
    }

    // Right bullet rules
    const rx = L + 446, rw = CW - 474;
    if (t > K.rules[0]) {
      ctx.fillStyle = OBS; ctx.fillRect(rx, my + 88, rw, 114);
      text('POSISI WAJIB DANTON', rx + 20, my + 118, { size: 15, w: 700, ls: 2, color: GOLD });
      text('MENGHADAP PELETON', rx + 20, my + 154, { f: 'd', size: fit('MENGHADAP PELETON', 'd', 900, rw - 40, 28), w: 900, color: WHITE });
      text('DILARANG KERAS MEMBELAKANGI JURI!', rx + 20, my + 186, { size: 14, w: 700, ls: 0.8, color: '#FF6B6B' });
    }
    if (t > K.rules[1]) {
      strokeR(rx, my + 220, CW - 474, 222, OBS, 1.5);
      text('ALUR PERGERAKAN', rx + 20, my + 252, { size: 15, w: 700, ls: 2, color: CRIMSON });
      text('1. Awal: Lapor & Hormat di Tengah', rx + 20, my + 286, { size: 17, w: 600, color: OBS });
      text('2. Masuk Kotak memimpin materi', rx + 20, my + 318, { size: 17, w: 600, color: OBS });
      text('3. Dilarang injak / keluar garis kotak', rx + 20, my + 350, { size: 17, w: 700, color: CRIMSON });
      hline(rx + 20, R - 48, my + 370, 'rgba(15,15,15,.15)');
      text('*Kecuali: Bubar, Berhimpun, Berkumpul,', rx + 20, my + 398, { size: 15, w: 600, color: OBS, alpha: .75 });
      text(' Perhatian Istirahat & Laporan Akhir.', rx + 20, my + 422, { size: 15, w: 600, color: OBS, alpha: .75 });
    }
    ctx.restore();
  }

  // Module Bottom: ASAS "GARIS SEBAGAI GARIS"
  const ay = 864, ah = 640, ap = E_OUT(pr(t, K.divider, .4));
  if (ap > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(L - 2, ay - 2, CW + 4, ah * ap + 4); ctx.clip();
    ctx.fillStyle = OBS; ctx.fillRect(L, ay, CW, ah);
    ctx.fillStyle = CRIMSON; ctx.fillRect(L, ay, CW, 58);
    text('ASAS "GARIS SEBAGAI GARIS"', L + 24, ay + 38, { f: 'd', size: 28, w: 900, color: WHITE });
    text('KONTAK FISIK / PIJAKAN', R - 24, ay + 37, { size: 16, w: 700, ls: 2, color: GOLD, align: 'right' });

    text('BUKAN DINDING IMAJINER DI UDARA — DIHITUNG SAAT MENYENTUH GARIS', L + 28, ay + 96, { size: 17, w: 600, ls: 1, color: GOLD });

    // Split visual: Left = AMAN (Di Dalam Garis), Right = PELANGGARAN (Menginjak/Luar Garis)
    const cw2 = (CW - 76) / 2, cy = ay + 124, ch2 = 340;

    // Panel 1: SAH / AMAN
    const p1 = pr(t, K.bootLegal, .35);
    if (p1 > 0) {
      ctx.save(); ctx.globalAlpha *= p1;
      const x1 = L + 28;
      ctx.fillStyle = '#141B17'; ctx.fillRect(x1, cy, cw2, ch2);
      strokeR(x1, cy, cw2, ch2, GREEN, 2);
      // White boundary line near top of box
      ctx.fillStyle = WHITE; ctx.fillRect(x1, cy + 78, cw2, 10);
      text('GARIS BATAS ARENA / KOTAK', x1 + 16, cy + 64, { size: 13, w: 700, ls: 1.5, alpha: .6 });
      // Boot well inside below the line
      drawBootSole(x1 + cw2 / 2, cy + 195, 0.92, GREEN, 0.22);
      ctx.fillStyle = GREEN; ctx.fillRect(x1, cy + ch2 - 52, cw2, 52);
      text('AMAN · TIDAK MENYENTUH GARIS', x1 + cw2 / 2, cy + ch2 - 19, { size: 17, w: 800, ls: 1.5, align: 'center', color: OBS });
      ctx.restore();
    }

    // Panel 2: PELANGGARAN (Boot steps onto line + Hakim Garis Flag)
    const p2 = pr(t, K.bootStep[0] - .2, .35);
    if (p2 > 0) {
      ctx.save(); ctx.globalAlpha *= p2;
      const x2 = L + 28 + cw2 + 20;
      const stepP = E_IO(pr(t, K.bootStep[0], K.bootStep[1] - K.bootStep[0]));
      const violated = t >= K.flag;
      ctx.fillStyle = violated ? '#241010' : '#181818'; ctx.fillRect(x2, cy, cw2, ch2);
      strokeR(x2, cy, cw2, ch2, violated ? ALERT : 'rgba(248,249,250,.35)', 2.5);
      // Boundary line
      ctx.fillStyle = violated ? ALERT : WHITE; ctx.fillRect(x2, cy + 118, cw2, 12);
      text('GARIS BATAS ARENA / KOTAK', x2 + 16, cy + 56, { size: 13, w: 700, ls: 1.5, alpha: .7 });

      // Boot steps UP onto the line
      const bootY = lerp(cy + 220, cy + 158, stepP);
      drawBootSole(x2 + cw2 / 2 - 36, bootY, 0.9, violated ? ALERT : WHITE, violated ? 0.32 : 0.15);

      // Flag animation on violation
      if (violated) {
        const fa = pr(t, K.flag, .25);
        ctx.save(); ctx.globalAlpha *= fa;
        drawFlagIcon(x2 + cw2 - 95, cy + 205, 44, GOLD, (t - K.flag) * 18);
        text('BENDERA!', x2 + cw2 - 68, cy + 268, { size: 15, w: 800, ls: 1, align: 'center', color: GOLD });
        ctx.restore();
      }

      ctx.fillStyle = violated ? ALERT : '#333'; ctx.fillRect(x2, cy + ch2 - 52, cw2, 52);
      text(violated ? 'INJAK / LEWAT GARIS = PENALTI!' : 'MENDEKATI GARIS...', x2 + cw2 / 2, cy + ch2 - 19, { size: 17, w: 800, ls: 1, align: 'center', color: WHITE });
      ctx.restore();
    }

    // Bottom bar inside dark card: Hakim Garis info
    if (t > K.exc - .3) {
      const fy = cy + ch2 + 26;
      ctx.fillStyle = 'rgba(212,175,55,.14)'; ctx.fillRect(L + 28, fy, CW - 56, 122);
      ctx.fillStyle = GOLD; ctx.fillRect(L + 28, fy, 6, 122);
      typeOn('SINYAL HAKIM GARIS: KIBASAN BENDERA = POTONGAN NILAI REKAP', L + 50, fy + 44, { size: 19, w: 700, ls: 1, color: GOLD }, t, K.exc - .2, 65);
      typeOn('ALAS KAKI / BAGIAN TUBUH MENYENTUH GARIS DINYATAKAN SAH MELANGGAR.', L + 50, fy + 86, { size: 16, w: 500, ls: 1, color: WHITE, alpha: .85 }, t, K.exc + .15, 70);
    }
    ctx.restore();
  }
}

// 04 TIMEKEEPER & SINYAL PELUIT (22 - 31s) ----------------------------------
function sTime(t) {
  const Tm = T.time; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('03 — STOPWATCH RESMI & SINYAL PELUIT TIMEKEEPER', t, Tm.label);

  // Big Digital Tactical Stopwatch Display
  const cy = 365, ch = 270, cp = E_OUT(pr(t, Tm.clock, .45));
  if (cp > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(L - 2, cy - 2, CW + 4, ch * cp + 4); ctx.clip();
    ctx.fillStyle = CARD; ctx.fillRect(L, cy, CW, ch);
    strokeR(L, cy, CW, ch, 'rgba(248,249,250,.35)', 1.5);
    brackets(L + 14, cy + 14, CW - 28, ch - 28, 20, GOLD, 2);

    // Simulated timer state across the scene
    let disp = '00:00.00', status = 'STANDBY', stCol = WHITE;
    if (t >= Tm.startEvt && t < Tm.w1) {
      const el = (t - Tm.startEvt) * 4.1;
      disp = '00:' + String(Math.floor(el)).padStart(2, '0') + '.' + String(Math.floor((el % 1) * 100)).padStart(2, '0');
      status = ' WAKTU BERJALAN · RUNNING '; stCol = GREEN;
    } else if (t >= Tm.w1 && t < Tm.w2) {
      const frac = clamp((t - Tm.w1) / (Tm.w2 - Tm.w1));
      const sec = Math.floor(frac * 59);
      disp = '07:' + String(sec).padStart(2, '0') + '.' + String(Math.floor(((t * 17) % 1) * 100)).padStart(2, '0');
      status = ' PERINGATAN · SISA 1 MENIT! '; stCol = GOLD;
    } else if (t >= Tm.w2 && t < Tm.stopEvt) {
      disp = '08:00.00';
      status = ' DURASI HABIS · SEGERA SELESAIKAN! '; stCol = ALERT;
    } else if (t >= Tm.stopEvt) {
      disp = '07:54.18';
      status = ' WAKTU BERHENTI · LOCKED '; stCol = CYAN;
    }

    // Status pill
    const pw = measure(status, 'm', 16, 700, 2) + 28;
    ctx.fillStyle = stCol; ctx.fillRect(540 - pw / 2, cy + 28, pw, 32);
    text(status, 540, cy + 50, { size: 16, w: 700, ls: 2, align: 'center', color: OBS });

    // Giant digits
    text(disp, 540, cy + 188, { size: 118, w: 700, ls: 4, align: 'center', color: t >= Tm.w2 && t < Tm.stopEvt ? ALERT : WHITE });
    text('SD/MI MAKS 08:00  |  SMP/MTs MAKS 12:00', 540, cy + 238, { size: 17, w: 600, ls: 2, align: 'center', alpha: .65 });
    ctx.restore();
  }

  // 4 Timeline Cards below
  const steps = [
    {
      t0: Tm.startEvt, badge: 'START', col: GREEN,
      title: 'PENGHORMATAN AWAL',
      desc1: 'Aba-aba: "Kepada Dewan Juri, Hormat = GERAK"',
      desc2: 'Stopwatch DIMULAI tepat saat hentakan "GERAK" pembuka.'
    },
    {
      t0: Tm.w1, badge: 'PELUIT 1×', col: GOLD, whistle: 1,
      title: 'SINYAL PELUIT 1× PANJANG (SISA 1 MENIT)',
      desc1: 'Menit ke-7 (Tingkat SD/MI)  ·  Menit ke-11 (Tingkat SMP/MTs)',
      desc2: 'Peringatan resmi bahwa waktu tampil tersisa 60 detik.'
    },
    {
      t0: Tm.w2, badge: 'PELUIT 2×', col: ALERT, whistle: 2,
      title: 'SINYAL PELUIT 2× PANJANG (WAKTU HABIS)',
      desc1: 'Menit ke-8 (Tingkat SD/MI)  ·  Menit ke-12 (Tingkat SMP/MTs)',
      desc2: 'Wajib segera menyelesaikan materi & meninggalkan arena!'
    },
    {
      t0: Tm.stopEvt, badge: 'STOP', col: CYAN,
      title: 'PENGHORMATAN PENUTUP',
      desc1: 'Setelah Laporan Selesai → "Kepada Dewan Juri, Hormat = GERAK"',
      desc2: 'Stopwatch BERHENTI tepat saat hentakan "GERAK" penutup.'
    }
  ];

  steps.forEach((st, i) => {
    const sy = 668 + i * 192, sp = E_OUT(pr(t, st.t0, .4));
    if (sp <= 0) return;
    ctx.save(); ctx.globalAlpha *= sp; ctx.translate((1 - sp) * 40, 0);

    // Active pulse when whistle blowing
    const blowing = (st.whistle === 1 && t >= Tm.w1 && t <= Tm.w1 + 1.1) ||
                    (st.whistle === 2 && t >= Tm.w2 && t <= Tm.w2 + 1.85);
    ctx.fillStyle = blowing ? 'rgba(212,175,55,.16)' : CARD;
    ctx.fillRect(L, sy, CW, 170);
    strokeR(L, sy, CW, 170, blowing ? st.col : 'rgba(248,249,250,.25)', blowing ? 2.5 : 1);
    ctx.fillStyle = st.col; ctx.fillRect(L, sy, 10, 170);

    // Badge
    ctx.fillStyle = st.col; ctx.fillRect(L + 28, sy + 24, 152, 38);
    text(st.badge, L + 104, sy + 49, { size: 18, w: 800, ls: 2, align: 'center', color: st.col === ALERT ? WHITE : OBS });

    if (st.whistle) {
      drawWhistleIcon(R - 54, sy + 44, 30, st.col);
      if (blowing) {
        // Sound wave arcs
        ctx.strokeStyle = st.col; ctx.lineWidth = 2.5;
        [1, 2].forEach(r => {
          ctx.beginPath(); ctx.arc(R - 54, sy + 44, 22 + r * 11 + ((t * 25) % 8), -0.7, 0.7); ctx.stroke();
        });
      }
    }

    const titleMaxW = st.whistle ? (R - 108) - (L + 198) : (R - 32) - (L + 198);
    text(st.title, L + 198, sy + 50, { f: 'd', size: fit(st.title, 'd', 800, titleMaxW, 24), w: 800, color: WHITE });
    text(st.desc1, L + 28, sy + 102, { size: 18, w: 600, color: GOLD });
    text(st.desc2, L + 28, sy + 138, { size: 17, w: 500, alpha: .82 });
    ctx.restore();
  });

  if (t > Tm.note) {
    typeOn('* LAPORAN NOMOR DADA WAJIB DIEJA PER DIGIT (CONTOH: SATU SATU SATU)', L, 1476, { size: 17, w: 700, ls: 1, color: GOLD }, t, Tm.note, 95);
  }
}

// 05 REGULASI KRITIS BEBAS PENALTI (31 - 40s) -------------------------------
function sFree(t) {
  const F = T.free; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); guides(false);
  sceneLabel('04 — REGULASI KRITIS & KETENTUAN TANPA PENALTI', t, F.label, false);

  const cards = [
    {
      t0: F.c1, tBadge: F.c1Badge,
      num: '01',
      title: 'GERAKAN PENYESUAIAN',
      badge: 'BEBAS · 0 PENALTI',
      badgeCol: GREEN,
      line1: 'HANYA: Hadap (Kanan/Kiri/Serong), Balik Kanan, Langkah Terbatas.',
      line2: 'Jumlah TIDAK DIBATASI (tanpa potongan angka).',
      line3: 'Berpengaruh pada nilai Penguasaan Lapangan Danton.'
    },
    {
      t0: F.c2, tBadge: F.c2Badge,
      num: '02',
      title: 'ATRIBUT PESERTA TERJATUH',
      badge: 'TIDAK DIPOTONG NILAI',
      badgeCol: GREEN,
      line1: 'Topi/peci, dasi, pin, sabuk, atau sarung tangan jatuh di arena:',
      line2: 'TIDAK DIKENAKAN PENALTI PENGURANGAN NILAI.',
      line3: 'DILARANG memungut atribut hingga peleton keluar arena!'
    },
    {
      t0: F.c3, tBadge: F.c3Badge,
      num: '03',
      title: 'JEDA PERGANTIAN PEMAIN RESMI',
      badge: 'SAAT MATERI "BUBAR"',
      badgeCol: GOLD,
      line1: 'SD/MI: Antara Materi 16 & 17  |  SMP/MTs: Antara Materi 19 & 20.',
      line2: 'Keluar-masuk cadangan resmi BEBAS PENALTI GARIS.',
      line3: 'Stopwatch tetap berjalan normal tanpa jeda waktu tambahan.'
    }
  ];

  cards.forEach((c, idx) => {
    const y = 362 + idx * 336, h = 310, p = E_OUT(pr(t, c.t0, .45));
    if (p <= 0) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(L - 2, y - 2, CW + 4, h * p + 4); ctx.clip();
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(L, y, CW, h);
    strokeR(L, y, CW, h, OBS, 2);
    ctx.fillStyle = OBS; ctx.fillRect(L, y, CW + 1, 62);
    text(c.num, L + 24, y + 41, { size: 22, w: 800, color: GOLD });
    text(c.title, L + 74, y + 41, { f: 'd', size: 26, w: 900, color: WHITE });

    // Stamp badge
    const bp = E_OUT(pr(t, c.tBadge, .3));
    if (bp > 0) {
      const bw = measure(c.badge, 'm', 15, 800, 1.5) + 28;
      ctx.save(); ctx.globalAlpha *= bp;
      ctx.fillStyle = c.badgeCol;
      ctx.fillRect(R - 20 - bw, y + 13, bw, 36);
      text(c.badge, R - 20 - bw / 2, y + 37, { size: 15, w: 800, ls: 1.5, align: 'center', color: c.badgeCol === GOLD ? OBS : WHITE });
      ctx.restore();
    }

    text(c.line1, L + 28, y + 116, { size: 19, w: 600, color: OBS });
    hline(L + 28, R - 28, y + 142, 'rgba(15,15,15,.12)');
    ctx.fillStyle = CRIMSON; ctx.fillRect(L + 28, y + 164, 8, 24);
    text(c.line2, L + 48, y + 184, { size: 20, w: 800, color: CRIMSON });
    text(c.line3, L + 28, y + 236, { size: 18, w: 600, color: OBS, alpha: .8 });

    // Bottom subtle status bar
    ctx.fillStyle = '#F1F3F5'; ctx.fillRect(L + 1, y + h - 44, CW - 2, 43);
    text(idx === 2 ? 'DARURAT MEDIS BERBAHAYA: PANITIA BERWENANG HENTIKAN SEMENTARA' : 'SESUAI JUKNIS RESMI LBB MU\'ALLIMIN 2027', L + 28, y + h - 16, { size: 14, w: 700, ls: 1.5, color: OBS, alpha: .65 });
    ctx.restore();
  });

  const np = E_IO(pr(t, F.note, .35));
  if (np > 0) {
    const ny = 1384;
    ctx.fillStyle = OBS; ctx.fillRect(L, ny, CW * np, 108);
    ctx.fillStyle = GOLD; ctx.fillRect(L, ny, 8, 108 * np);
    if (np > .6) {
      typeOn('DANTON DARURAT (PINGSAN/SAKIT): DAPAT DIGANTI PERSONEL DI ARENA', L + 26, ny + 44, { size: 17, w: 700, ls: 0.8, color: GOLD }, t, F.note + .08, 105);
      typeOn('*DANTON PENGGANTI GUGUR DARI KATEGORI JUARA KOMANDAN PELETON.', L + 26, ny + 80, { size: 16, w: 600, ls: 0.8, color: WHITE, alpha: .85 }, t, F.note + .28, 105);
    }
  }
}

// 06 DAERAH PERSIAPAN (DP), CLEAR AREA & NOMOR DADA (40 - 45s) --------------
function sDp(t) {
  const D = T.dp; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('05 — ALUR DAERAH PERSIAPAN, CLEAR AREA & SOUVENIR', t, D.label);

  // Flow Pipeline: DP 1 -> DP 2 -> ARENA
  const stages = [
    {
      t0: D.z0, code: 'DP 1', col: CRIMSON,
      title: 'POS CEK PERSONEL & VERIFIKASI FISIK',
      sub: 'DILARANG KERAS MASUK SEBELUM DIPANGGIL RESMI VIA MIC!'
    },
    {
      t0: D.z1, code: 'DP 2', col: GOLD,
      title: 'RUANG TUNGGU SIAP TAMPIL (HOLDING AREA)',
      sub: 'Area transisi steril sebelum peleton memasuki arena lomba.'
    },
    {
      t0: D.z2, code: 'CLEAR AREA', col: CYAN,
      title: 'ZONA STERIL SEKELILING ARENA LOMBA',
      sub: 'Hanya Peleton + Cadangan + 1 Official + 2 Pendukung ber-ID Card.'
    }
  ];

  stages.forEach((s, i) => {
    const y = 368 + i * 204, p = E_OUT(pr(t, s.t0, .4));
    if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, (1 - p) * 32);
    ctx.fillStyle = CARD; ctx.fillRect(L, y, CW, 174);
    strokeR(L, y, CW, 174, 'rgba(248,249,250,.28)');
    ctx.fillStyle = s.col; ctx.fillRect(L, y, 185, 174);
    text(s.code, L + 92, y + 98, { f: 'd', size: fit(s.code, 'd', 900, 152, 42), w: 900, align: 'center', color: s.col === CRIMSON ? WHITE : OBS });

    text(s.title, L + 215, y + 68, { f: 'd', size: fit(s.title, 'd', 800, CW - 245, 25), w: 800, color: WHITE });
    hline(L + 215, R - 28, y + 92, 'rgba(248,249,250,.16)');
    text(s.sub, L + 215, y + 132, { size: 17, w: 600, color: i === 0 ? '#FF8787' : GOLD });
    ctx.restore();

    if (i < 2 && p > .8) {
      text('↓', L + 92, y + 198, { size: 24, w: 800, align: 'center', color: GOLD });
    }
  });

  // Dokumentasi rule bar
  if (t > D.clear) {
    const cy = 992;
    ctx.fillStyle = 'rgba(248,249,250,.06)'; ctx.fillRect(L, cy, CW, 88);
    strokeR(L, cy, CW, 88, 'rgba(248,249,250,.22)');
    typeOn('DOKUMENTASI TIM WAJIB DI BATAS PANITIA · DILARANG SEJAJAR MEJA JURI!', L + 24, cy + 52, { size: 18, w: 700, ls: 1, color: WHITE }, t, D.clear, 75);
  }

  // Nomor Dada Souvenir Card
  const bp = E_OUT(pr(t, D.bib, .45));
  if (bp > 0) {
    const by = 1116, bh = 380;
    ctx.save(); ctx.beginPath(); ctx.rect(L - 2, by - 2, CW + 4, bh * bp + 4); ctx.clip();
    ctx.fillStyle = CARD; ctx.fillRect(L, by, CW, bh);
    strokeR(L, by, CW, bh, GOLD, 2);
    ctx.fillStyle = GOLD; ctx.fillRect(L, by, CW, 56);
    text('KEPEMILIKAN NOMOR DADA RESMI', L + 24, by + 37, { size: 20, w: 800, ls: 2, color: OBS });
    text('OFFICIAL SOUVENIR', R - 24, by + 37, { size: 16, w: 800, ls: 2, color: OBS, align: 'right' });

    // Chest Bib Illustration on left
    const bx = L + 44, bby = by + 90, bw = 220, bbh = 250;
    ctx.fillStyle = WHITE; ctx.fillRect(bx, bby, bw, bbh);
    strokeR(bx, bby, bw, bbh, OBS, 2);
    ctx.fillStyle = CRIMSON; ctx.fillRect(bx, bby, bw, 42);
    text("LBB MU'ALLIMIN", bx + bw / 2, bby + 27, { size: 14, w: 800, ls: 1.5, align: 'center', color: WHITE });
    text('111', bx + bw / 2, bby + 162, { f: 'd', size: 84, w: 900, align: 'center', color: OBS });
    ctx.fillStyle = OBS; ctx.fillRect(bx + 18, bby + bbh - 38, bw - 36, 22);
    text('PELETON PESERTA', bx + bw / 2, bby + bbh - 22, { size: 11, w: 700, ls: 2, align: 'center', color: GOLD });

    // Right explanation
    const rx = L + 302;
    reveal('HAK MILIK', rx, by + 150, { f: 'd', size: 54, w: 900, color: WHITE }, t, D.bib + .15, .4);
    reveal('PELETON.', rx, by + 212, { f: 'd', size: 54, w: 900, color: GOLD }, t, D.bib + .28, .4);
    text('TIDAK PERLU DIKEMBALIKAN KE PANITIA.', rx, by + 266, { size: 19, w: 700, color: GREEN });
    text('Menjadi cenderamata resmi bagi sekolah', rx, by + 304, { size: 18, w: 500, alpha: .8 });
    text('usai keluar arena melalui jalur steril.', rx, by + 334, { size: 18, w: 500, alpha: .8 });
    ctx.restore();
  }
}

// 07 CTA & PORTAL (45 - 50s) ------------------------------------------------
function sCta(t) {
  const C = T.cta; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('UNDUH JUKNIS & REGISTRASI — lbb.tontimuallimin.com', t, C.l1);

  const s = fit('KUASAI JUKNIS.', 'd', 900, CW), s2 = Math.min(s, fit('SIAPKAN PELETON.', 'd', 900, CW));
  const y1 = 376 + s * CAP, y2 = y1 + 22 + s2 * CAP;
  reveal('KUASAI JUKNIS', L - 4, y1, { f: 'd', size: s, w: 900 }, t, C.l1);
  if (t > C.l1 + .25) text('.', L - 4 + measure('KUASAI JUKNIS', 'd', s, 900, -s * .02), y1, { f: 'd', size: s, w: 900, color: GOLD });
  reveal('SIAPKAN PELETON', L - 4, y2, { f: 'd', size: s2, w: 900 }, t, C.l2);
  if (t > C.l2 + .25) text('.', L - 4 + measure('SIAPKAN PELETON', 'd', s2, 900, -s2 * .02), y2, { f: 'd', size: s2, w: 900, color: GOLD });

  const bp = E_IO(pr(t, C.bar, .3)), by = y2 + 38;
  if (bp > 0) {
    ctx.fillStyle = CRIMSON; ctx.fillRect(0, by, W * bp, 66);
    if (bp > .6) typeOn('TECHNICAL MEETING RESMI: 9 JANUARI 2027', L, by + 42, { size: 24, w: 700, ls: 1.5, color: WHITE }, t, C.bar + .1, 60);
  }

  // QR Code
  const M = window.QRM, n = M.length, S = 320, pad = 24, box = S + pad * 2, bx = 540 - box / 2, qy = by + 114;
  if (t > C.qr[0]) {
    ctx.fillStyle = WHITE; ctx.fillRect(bx, qy, box, box);
    const rows = Math.floor(n * pr(t, C.qr[0], C.qr[1] - C.qr[0])), ms = S / n;
    ctx.fillStyle = OBS;
    for (let r = 0; r < rows; r++) for (let c = 0; c < n; c++) if (M[r][c] === '1') ctx.fillRect(Math.floor(bx + pad + c * ms), Math.floor(qy + pad + r * ms), Math.ceil(ms), Math.ceil(ms));
    if (rows < n) hline(bx, bx + box, qy + pad + rows * ms, GOLD, 1, 2);
    const lp = E_OUT(pr(t, C.lock - .2, .3)), off = 22 + (1 - lp) * 60;
    if (lp > 0) { ctx.save(); ctx.globalAlpha = lp; brackets(bx - off, qy - off, box + off * 2, box + off * 2, 44, WHITE, 3); ctx.restore(); }
  }

  const scanTxt = 'SCAN PORTAL RESMI & JUKNIS LENGKAP';
  if (t > C.scan) typeOn(scanTxt, 540 - measure(scanTxt, 'm', 22, 800, 1) / 2, qy + box + 62, { size: 22, w: 800, ls: 1, color: GOLD }, t, C.scan, 60);

  const ry = qy + box + 144;
  [['PORTAL', 'lbb.tontimuallimin.com'], ['HELPDESK WA', '0819-4749-1505'], ['INSTAGRAM', '@lbbmuin']].forEach(([k, v], i) => {
    const t0 = C.rows[i], y = ry + i * 64;
    hline(L, R, y - 40, 'rgba(248,249,250,.3)', E_LINE(pr(t, t0 - .1, .45)));
    typeOn(k, L, y, { size: 16, w: 700, ls: 3, color: GOLD }, t, t0);
    reveal(v, L + 230, y + 2, { size: 32, w: 600, ls: 0 }, t, t0 + .05, .45);
    if (i === 2) hline(L, R, y + 24, 'rgba(248,249,250,.3)', E_LINE(pr(t, t0, .45)));
  });
}

/* ================= MASTER ================= */
const SCENES = [sHook, sArena, sKotak, sTime, sFree, sDp, sCta];
const THEME = ['d', 'd', 'l', 'd', 'l', 'd', 'd'];
const LABELS = ['00 / REGULASI', '01 / ARENA', '02 / GARIS', '03 / WAKTU', '04 / ATURAN', '05 / ZONA DP', 'PORTAL'];
const sceneIndex = t => { let k = 0; T.cuts.forEach((c, i) => { if (t >= c) k = i + 1; }); return k; };
const COLS = 6, CWID = W / COLS;
const colP = (t, tb, i, lag) => E_IO(pr(t, tb + i * .03 + lag, .28));

function hud(t, k) {
  const dark = THEME[k] !== 'l', c = dark ? WHITE : OBS;
  text("LBB MU'ALLIMIN — JUKNIS 2027", L, 236, { size: 18, w: 600, ls: 2, color: c, alpha: .85 });
  const tc = '00:' + ('0' + Math.floor(t)).slice(-2) + '.' + Math.floor((t % 1) * 10);
  text(`${LABELS[k]}   ${tc}`, R, 236, { size: 18, w: 500, ls: 2, color: c, alpha: .85, align: 'right' });
  hline(L, R, 256, dark ? 'rgba(248,249,250,.18)' : 'rgba(15,15,15,.18)');
  hline(L, lerp(L, R, t / T.dur), 256, GOLD, 1, 2);
  T.cuts.forEach(cu => {
    const x = lerp(L, R, cu / T.dur);
    ctx.fillStyle = c; ctx.globalAlpha = .5; ctx.fillRect(Math.round(x), 252, 1, 9); ctx.globalAlpha = 1;
  });
}

window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const k = sceneIndex(t), tb = k > 0 ? T.cuts[k - 1] : -9, inTr = k > 0 && t < tb + .55;
  if (!inTr) SCENES[k](t);
  else {
    SCENES[k - 1](t);
    for (let i = 0; i < COLS; i++) {
      const p = colP(t, tb, i, 0), top = i % 2 === 0;
      if (p <= 0) continue;
      ctx.fillStyle = CRIMSON; ctx.fillRect(Math.floor(i * CWID), top ? 0 : H * (1 - p), Math.ceil(CWID) + 1, H * p);
    }
    ctx.save(); ctx.beginPath(); let any = false;
    for (let i = 0; i < COLS; i++) {
      const p = colP(t, tb, i, .08), top = i % 2 === 0;
      if (p <= 0) continue;
      any = true; ctx.rect(Math.floor(i * CWID), top ? 0 : H * (1 - p), Math.ceil(CWID) + 1, H * p);
    }
    if (any) { ctx.clip(); SCENES[k](t); }
    ctx.restore();
  }
  hud(t, inTr && t < tb + .3 ? k - 1 : k);
  if (grain) { ctx.save(); ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fo = pr(t, T.dur - .45, .45); if (fo > 0) { ctx.fillStyle = `rgba(15,15,15,${fo})`; ctx.fillRect(0, 0, W, H); }
};
