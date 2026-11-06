// LBB Mu'allimin 2027 – Kinetic Motion Poster v3 ("H-2 Gelombang 1 & Keunggulan")
// ZERO BORING FORM CARDS. Full-bleed Swiss Kinetic Typography, Giant Odometers, Sliced Text Physics,
// Live Top-Down Radar Marching, Orbiting Roster Swaps, Live Leaderboard Overtake, Diagonal Shutter Wipes.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const OBS = '#0D0D0D', WHITE = '#F8F9FA', CRIMSON = '#7A0E0E', RED = '#DC2626', GOLD = '#E5B83B', GREEN = '#16A34A', CYAN = '#38BDF8';
const L = 72, R = 1008, CW = R - L;
const DISP = 'Archivo', MONO = '"JetBrains Mono"';

/* ---------- math / physics ---------- */
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
const E_IO = bez(.72, 0, .18, 1), E_OUT = bez(.14, 1, .28, 1);
const E_SPRING = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-7 * x) * Math.cos(10 * x);
const rnd = (() => { let s = 9091; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
const R1 = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/* ---------- assets ---------- */
const IMG = {};
const loadImg = (k, src) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.onerror = () => r(); im.src = src; });
let grain;
window.ready = Promise.all([
  loadImg('logo', 'assets/logo.png'),
  document.fonts.load('900 120px Archivo'), document.fonts.load('800 100px Archivo'),
  document.fonts.load('400 40px "JetBrains Mono"'), document.fonts.load('800 60px "JetBrains Mono"'),
]).then(() => {
  grain = document.createElement('canvas'); grain.width = grain.height = 256;
  const g = grain.getContext('2d'), id = g.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) { const v = rnd() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 14; }
  g.putImageData(id, 0, 0);
});

/* ---------- typography & kinetic text ---------- */
function setF(f, size, w, ls) {
  ctx.font = `${w || (f === 'd' ? 900 : 600)} ${size}px ${f === 'd' ? DISP : MONO}`;
  ctx.fontStretch = f === 'd' ? 'expanded' : 'normal';
  ctx.letterSpacing = (ls ?? (f === 'd' ? -size * 0.025 : 0)) + 'px';
  ctx.textBaseline = 'alphabetic';
}
function measure(s, f, size, w, ls) { ctx.save(); setF(f, size, w, ls); const m = ctx.measureText(s).width; ctx.restore(); return m; }
function fit(s, f, w, width, max = 999) { return Math.min(max, 100 * width / measure(s, f, 100, w, f === 'd' ? -2.5 : 0)); }
const CAP = 0.73;

function text(s, x, y, o = {}) {
  ctx.save(); setF(o.f || 'm', o.size || 24, o.w, o.ls);
  ctx.textAlign = o.align || 'left';
  if (o.stroke) {
    ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 2.5;
    ctx.globalAlpha *= (o.alpha ?? 1);
    ctx.strokeText(s, x, y);
  } else {
    ctx.fillStyle = o.color || WHITE; ctx.globalAlpha *= (o.alpha ?? 1);
    ctx.fillText(s, x, y);
  }
  ctx.restore();
}

function reveal(s, x, y, o, t, t0, d = 0.42) {
  const p = pr(t, t0, d); if (p <= 0) return;
  const e = E_OUT(p), size = o.size, cap = size * CAP;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, y - cap - size * 0.18, W, cap + size * 0.38); ctx.clip();
  text(s, x, y + (1 - e) * (cap + size * 0.4), o);
  ctx.restore();
}

function odometer(v, digits, x, y, size, color, w = 800) {
  ctx.save(); setF('m', size, w, 0);
  const cw = ctx.measureText('0').width, lh = size * 1.02;
  for (let p = 0; p < digits; p++) {
    const P = Math.pow(10, p), val = Math.max(0, v);
    let d = p === 0 ? val % 10 : ((Math.floor(val / P) + (val % P > P - 1 ? val % P - (P - 1) : 0)) % 10);
    const k = Math.floor(d + 1e-6), frac = d - k, cx = x + (digits - 1 - p) * cw;
    ctx.save();
    ctx.beginPath(); ctx.rect(cx - 4, y - size * 0.88, cw + 8, size * 1.05); ctx.clip();
    ctx.fillStyle = color; ctx.textAlign = 'left';
    ctx.fillText(String(k % 10), cx, y - frac * lh);
    ctx.fillText(String((k + 1) % 10), cx, y + (1 - frac) * lh);
    ctx.restore();
  }
  ctx.restore();
  return cw * digits;
}

// Kinetic Scrolling Marquee Ticker Tape
function marqueeBand(t, y, h, bg, fg, phrase, speed = 220, tilt = 0) {
  ctx.save();
  ctx.translate(W / 2, y + h / 2);
  if (tilt) ctx.rotate(tilt);
  ctx.fillStyle = bg; ctx.fillRect(-W, -h / 2, W * 2, h);
  setF('m', Math.round(h * 0.52), 800, 3);
  const unit = phrase + '   ///   ';
  const uw = ctx.measureText(unit).width;
  const off = -((t * speed) % uw);
  ctx.fillStyle = fg;
  for (let x = -W + off; x < W; x += uw) ctx.fillText(unit, x, h * 0.19);
  ctx.restore();
}

// Camera Impact Shake + Slam Stamp (auto-fitted text so it NEVER overflows!)
function impactStamp(t, t0, cx, cy, w, h, bg, fg, txt, sz = 38, tilt = -0.035) {
  const age = t - t0; if (age < 0) return;
  const p = E_OUT(pr(age, 0, 0.18));
  const sc = 2.4 - 1.4 * p;
  const fsz = fit(txt, 'd', 900, w - 56, sz);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt * p);
  ctx.scale(sc, sc);
  ctx.globalAlpha = clamp(age * 14);
  ctx.fillStyle = bg; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = fg; ctx.lineWidth = 3; ctx.strokeRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16);
  text(txt, 0, fsz * 0.35, { f: 'd', size: fsz, w: 900, align: 'center', color: fg });
  ctx.restore();
  if (age < 0.32) {
    const sp = age / 0.32;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt);
    ctx.strokeStyle = bg; ctx.lineWidth = 4 * (1 - sp); ctx.globalAlpha = 1 - sp;
    ctx.strokeRect(-w / 2 - sp * 70, -h / 2 - sp * 40, w + sp * 140, h + sp * 80);
    ctx.restore();
  }
}

function hline(x0, x1, y, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(x0, Math.round(y) - lw / 2, (x1 - x0) * p, lw); }
function vline(x, y0, y1, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(Math.round(x), y0, lw, (y1 - y0) * p); }
function brackets(x, y, w, h, len, col, lw = 3) {
  ctx.fillStyle = col;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.fillRect(sx > 0 ? cx : cx - len, sy > 0 ? cy : cy - lw, len, lw);
    ctx.fillRect(sx > 0 ? cx : cx - lw, sy > 0 ? cy : cy - len, lw, len);
  });
}

// Kinetic ghost background typography (giant outlined moving words for visual depth)
function bgKineticWord(word, y, size, t, speed, dark = true) {
  const w = measure(word, 'd', size, 900);
  const x = -((t * speed) % (w + 120));
  const col = dark ? 'rgba(248,249,250,0.045)' : 'rgba(13,13,13,0.055)';
  for (let xx = x; xx < W + w; xx += w + 120) {
    text(word, xx, y, { f: 'd', size, w: 900, stroke: col, lw: 2 });
  }
}

/* ================= SCENE 0: HOOK "02 HARI LAGI!" (0.0 - 4.0s) ================= */
function s0Hook(t) {
  const S = T.s0;
  // Shake screen on slam!
  const shk = (t >= S.slam && t < S.slam + 0.22) ? Math.sin((t - S.slam) * 110) * 14 * (1 - (t - S.slam) / 0.22) : 0;
  ctx.save(); ctx.translate(shk, shk * 0.6);

  ctx.fillStyle = OBS; ctx.fillRect(-30, -30, W + 60, H + 60);
  bgKineticWord('URGENT · GELOMBANG 1 ·', 560, 220, t, 140, true);
  bgKineticWord('DEADLINE 8 NOV 2026 ·', 1380, 220, t + 2, -140, true);

  // Top live warning ticker
  marqueeBand(t, 285, 52, RED, WHITE, 'PERINGATAN KUOTA  ·  PENDAFTARAN GELOMBANG 1 SEGERA DITUTUP', 260, 0);

  // MASSIVE "02" Odometer + "HARI LAGI!"
  const val = T.odo(14, 2, S.odo[0], S.odo[1])(t);
  const odoW = odometer(val, 2, L - 12, 740, 390, GOLD, 800);
  reveal('HARI', L + odoW + 24, 575, { f: 'd', size: 132, w: 900, color: WHITE }, t, S.w1);
  reveal('LAGI!', L + odoW + 24, 730, { f: 'd', size: 132, w: 900, color: RED }, t, S.w1 + 0.14);

  // Diagonal Full-Bleed Hazard Slam Banner
  if (t >= S.slam) {
    const p = E_OUT(pr(t, S.slam, 0.24));
    ctx.save();
    ctx.translate(540, 915);
    ctx.rotate(-0.045);
    ctx.scale(1, p);
    ctx.fillStyle = WHITE; ctx.fillRect(-620, -95, 1240, 190);
    ctx.fillStyle = CRIMSON; ctx.fillRect(-620, -95, 1240, 16);
    ctx.fillRect(-620, 79, 1240, 16);
    text('GELOMBANG 1', 0, -8, { f: 'd', size: 96, w: 900, align: 'center', color: OBS });
    text('RESMI DITUTUP!', 0, 68, { f: 'd', size: 78, w: 900, align: 'center', color: CRIMSON });
    ctx.restore();
  }

  // Live Millisecond Ticking Bomb Bar
  if (t >= S.timer) {
    const tp = E_OUT(pr(t, S.timer, 0.35));
    const ty = 1130;
    ctx.save(); ctx.globalAlpha = tp;
    brackets(L, ty, CW, 210, 32, GOLD, 3);
    text('BATAS WAKTU: MINGGU, 8 NOV 2026 · 23:59 WIB', 540, ty + 52, { size: 22, w: 800, ls: 2, align: 'center', color: GOLD });
    const sec = Math.max(0, 59.99 - t * 4.3);
    const sStr = '47 : 59 : ' + String(Math.floor(sec)).padStart(2, '0') + '.' + String(Math.floor((sec % 1) * 100)).padStart(2, '0');
    text(sStr, 540, ty + 158, { size: 86, w: 800, align: 'center', color: WHITE });
    ctx.restore();
  }

  if (t >= S.sub) {
    reveal('KENAPA WAJIB DAFTAR SEKARANG?', 540, 1445, { f: 'd', size: 46, w: 900, align: 'center', color: GOLD }, t, S.sub);
    text('SIMAK 5 KEUNGGULAN UTAMA LBB MU\'ALLIMIN 2027 ▼', 540, 1500, { size: 22, w: 700, align: 'center', color: WHITE, alpha: pr(t, S.sub + 0.2, 0.25) });
  }
  ctx.restore();
}

/* ================= SCENE 1: PRICE SLASH & HEMAT 50RB (4.0 - 8.0s) ================= */
function s1Price(t) {
  const S = T.s1;
  // Split screen kinetic wipe: Top White (Gelombang 1), Bottom Obsidian (Gelombang 2)
  ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, 980);
  ctx.fillStyle = OBS; ctx.fillRect(0, 980, W, H - 980);
  bgKineticWord('PRESALE · GELOMBANG 1 ·', 520, 190, t, 110, false);

  // Top: GELOMBANG 1 HUGE PRICE
  const p1 = E_SPRING(pr(t, S.t1, 0.45));
  if (p1 > 0) {
    ctx.save(); ctx.translate(0, -(1 - p1) * 90);
    ctx.fillStyle = GREEN; ctx.fillRect(L, 320, 410, 54);
    text('● GELOMBANG 1 · AKTIF', L + 22, 356, { size: 22, w: 800, ls: 2, color: OBS });
    text('26 OKT – 8 NOV 2026', R, 356, { size: 22, w: 700, align: 'right', color: OBS });

    const hp = pr(t, S.hl108, 0.3);
    text('Rp', L, 505, { f: 'd', size: 62, w: 900, color: OBS });
    const w350 = measure('350', 'd', 190, 900);
    text('350', L + 115, 615, { f: 'd', size: 190, w: 900, color: OBS });
    text('.108', L + 118 + w350, 615, { f: 'd', size: 118, w: 900, color: hp > 0 ? CRIMSON : OBS });
    if (hp > 0) {
      hline(L + 118 + w350, R, 638, CRIMSON, E_OUT(hp), 10);
      text('WAJIB KODE UNIK .108', R, 688, { size: 22, w: 800, ls: 2, align: 'right', color: CRIMSON });
    }
    text('PER PELETON', L, 695, { size: 26, w: 800, ls: 3, color: '#444' });
    ctx.restore();
  }

  // Bottom: GELOMBANG 2 NAIK HARGA
  const p2 = E_OUT(pr(t, S.t2, 0.4));
  if (p2 > 0) {
    ctx.save(); ctx.globalAlpha = p2;
    text('MULAI 9 NOVEMBER (GELOMBANG 2) NAIK JADI:', 540, 1085, { size: 22, w: 700, ls: 2, align: 'center', color: '#AAA' });
    text('Rp 400.108,-', 540, 1235, { f: 'd', size: 128, w: 900, align: 'center', color: '#777' });
    const sl = E_IO(pr(t, S.slash400, 0.25));
    if (sl > 0) {
      ctx.save(); ctx.translate(540, 1190); ctx.rotate(-0.08);
      ctx.fillStyle = RED; ctx.fillRect(-420, -8, 840 * sl, 16);
      ctx.restore();
    }
    ctx.restore();
  }

  // Giant Center Overlapping Stamp: HEMAT Rp 50.000!
  impactStamp(t, S.stamp, 540, 945, 920, 150, GOLD, OBS, 'HEMAT Rp 50.000 / PELETON!', 50, -0.03);

  if (t > S.stamp + 0.2) {
    marqueeBand(t, 1390, 64, CRIMSON, WHITE, 'AMANKAN HARGA GELOMBANG 1 SEKARANG  ·  KUOTA HANYA 36 PELETON', 240, 0);
  }
}

/* ================= SCENE 2: 20 PIALA & JUARA UMUM (8.0 - 13.0s) ================= */
function drawBigTrophy(cx, cy, sc, col, t) {
  ctx.save();
  ctx.translate(cx, cy + Math.sin(t * 5) * 6);
  ctx.scale(sc, sc);
  ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-58, -68); ctx.lineTo(58, -68);
  ctx.lineTo(46, 4); ctx.quadraticCurveTo(0, 56, -46, 4); ctx.closePath(); ctx.fill();
  ctx.fillRect(-14, 40, 28, 36);
  ctx.fillRect(-48, 74, 96, 16);
  ctx.beginPath(); ctx.arc(-60, -30, 26, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(60, -30, 26, Math.PI * 1.5, Math.PI * 0.5); ctx.stroke();
  // Specular sparkle
  const sp = 0.5 + 0.5 * Math.sin(t * 9);
  ctx.fillStyle = WHITE;
  ctx.fillRect(36 - sp * 8, -58, 16 * sp + 4, 3);
  ctx.fillRect(36, -58 - sp * 8, 3, 16 * sp + 4);
  ctx.restore();
}

function s2Juara(t) {
  const S = T.s2;
  ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H);
  bgKineticWord('CHAMPIONS · JUARA UMUM ·', 480, 180, t, 120, true);

  // Dual Hero Trophy Cards: JUARA UMUM SD & JUARA UMUM SMP
  const wCard = (CW - 24) / 2;
  [['SD / MI', L, S.um1, GOLD, '#231C0C'], ['SMP / MTs', L + wCard + 24, S.um2, CYAN, '#0C1B26']].forEach(([lab, x, t0, col, bg], i) => {
    const p = E_SPRING(pr(t, t0, 0.5)); if (p <= 0) return;
    ctx.save();
    ctx.translate(x + wCard / 2, 495 + (1 - p) * 120);
    ctx.scale(p, p);
    ctx.fillStyle = bg; ctx.fillRect(-wCard / 2, -185, wCard, 370);
    ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.strokeRect(-wCard / 2, -185, wCard, 370);
    ctx.fillStyle = col; ctx.fillRect(-wCard / 2, -185, wCard, 48);
    text('PIALA BERGILIR', 0, -152, { size: 19, w: 800, ls: 3, align: 'center', color: OBS });
    drawBigTrophy(0, -32, 1.05, col, t + i * 1.5);
    text('JUARA UMUM', 0, 108, { f: 'd', size: 42, w: 900, align: 'center', color: WHITE });
    text(lab, 0, 156, { f: 'd', size: 38, w: 900, align: 'center', color: col });

    // Light shimmer sweep
    const sw = ((t - t0) % 2.0) / 0.9;
    if (sw > 0 && sw < 1) {
      const sx = lerp(-wCard, wCard, sw);
      const g = ctx.createLinearGradient(sx - 60, -185, sx + 60, 185);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(-wCard / 2, -185, wCard, 370);
    }
    ctx.restore();
  });

  // Pop-in Kinetic Pill Grid: JUARA PELETON 1 - HARAPAN 3 (3x2 grid)
  const pelLabels = ['JUARA 1', 'JUARA 2', 'JUARA 3', 'HARAPAN 1', 'HARAPAN 2', 'HARAPAN 3'];
  if (t >= S.pel0 - 0.1) text('JUARA PELETON S.D. HARAPAN 3!', L, 742, { f: 'd', size: 38, w: 900, color: GOLD });
  const pw = (CW - 24) / 3, ph = 98;
  pelLabels.forEach((lb, i) => {
    const t0 = S.pel0 + i * S.pelStep, p = E_SPRING(pr(t, t0, 0.38)); if (p <= 0) return;
    const c = i % 3, r = Math.floor(i / 3);
    const cx = L + c * (pw + 12) + pw / 2, cy = 772 + r * (ph + 14) + ph / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p);
    ctx.fillStyle = i < 3 ? CRIMSON : '#1F1F1F';
    ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    ctx.strokeStyle = i < 3 ? GOLD : 'rgba(248,249,250,.35)'; ctx.lineWidth = 2.5;
    ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
    text(lb, 0, 12, { f: 'd', size: 32, w: 900, align: 'center', color: i < 3 ? GOLD : WHITE });
    ctx.restore();
  });

  // Pop-in DANTON 1, 2, 3 Row
  if (t >= S.dan0 - 0.1) text('JUARA DANTON TERBAIK 1, 2, 3!', L, 1052, { f: 'd', size: 38, w: 900, color: WHITE });
  ['DANTON 1', 'DANTON 2', 'DANTON 3'].forEach((lb, i) => {
    const t0 = S.dan0 + i * S.danStep, p = E_SPRING(pr(t, t0, 0.38)); if (p <= 0) return;
    const cx = L + i * (pw + 12) + pw / 2, cy = 1126;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p);
    ctx.fillStyle = WHITE; ctx.fillRect(-pw / 2, -44, pw, 88);
    ctx.fillStyle = CRIMSON; ctx.fillRect(-pw / 2, -44, 12, 88);
    text('★ ' + lb, 4, 11, { f: 'd', size: 29, w: 900, align: 'center', color: OBS });
    ctx.restore();
  });

  // Giant Climax Stamp
  impactStamp(t, S.big20, 540, 1365, CW, 170, GOLD, OBS, 'PELUANG JUARA SUPER BESAR!', 50, -0.02);
}

/* ================= SCENE 3: UJI COBA LAPANGAN DI LOKASI (13.0 - 17.5s) ================= */
function s3Trial(t) {
  const S = T.s3;
  // Full-screen Tactical Radar Blueprint!
  ctx.fillStyle = '#07111A'; ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 60) vline(x, 0, H, 'rgba(56,189,248,0.08)');
  for (let y = 0; y < H; y += 60) hline(0, W, y, 'rgba(56,189,248,0.08)');

  // Rotating Radar Sweep Beam in Arena Center
  const rCx = 540, rCy = 960, ang = t * 2.6;
  ctx.save();
  ctx.translate(rCx, rCy);
  ctx.strokeStyle = 'rgba(56,189,248,0.22)'; ctx.lineWidth = 2;
  [180, 320, 440].forEach(rad => { ctx.beginPath(); ctx.arc(0, 0, rad, 0, 7); ctx.stroke(); });
  ctx.rotate(ang);
  const grad = ctx.createLinearGradient(0, 0, 420, 0);
  grad.addColorStop(0, 'rgba(56,189,248,0.45)'); grad.addColorStop(1, 'rgba(56,189,248,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 440, -0.45, 0); ctx.closePath(); ctx.fill();
  ctx.restore();

  // Giant Headline Top
  reveal('ADA UJI COBA', L - 4, 395, { f: 'd', size: fit('ADA UJI COBA', 'd', 900, CW), w: 900, color: WHITE }, t, S.grid);
  reveal('LAPANGAN!', L - 4, 515, { f: 'd', size: fit('LAPANGAN!', 'd', 900, CW), w: 900, color: CYAN }, t, S.grid + 0.12);

  // Arena Field Boundary + Live 22 Marching Dots Moving Into Center Formation
  const fx = 130, fy = 620, fw = W - 260, fh = 620;
  ctx.strokeStyle = WHITE; ctx.lineWidth = 4; ctx.strokeRect(fx, fy, fw, fh);
  brackets(fx - 18, fy - 18, fw + 36, fh + 36, 36, GOLD, 4);
  ctx.fillStyle = GOLD; ctx.fillRect(540 - 110, fy - 42, 220, 28);
  text('MEJA JURI', 540, fy - 21, { size: 17, w: 800, ls: 3, align: 'center', color: OBS });
  // Kotak Danton
  ctx.strokeStyle = RED; ctx.lineWidth = 3.5; ctx.strokeRect(540 - 34, fy + 16, 68, 68);

  const mp = E_IO(pr(t, S.march[0], S.march[1] - S.march[0]));
  // Danton walks to Kotak
  const dx = lerp(fx + fw - 80, 540, mp), dy = lerp(fy + fh - 80, fy + 50, mp);
  ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(dx, dy, 14, 0, 7); ctx.fill();
  ctx.strokeStyle = WHITE; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(dx, dy, 22 + Math.sin(t * 12) * 3, 0, 7); ctx.stroke();

  // 21 Pasukan Inti marching in crisp 3x7 formation with step bounce & trails
  const bob = mp < 1 ? Math.sin(t * 22) * 4.5 : 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      const tx = 540 + (c - 3) * 88, ty = fy + 245 + r * 92;
      const sx = tx + 240, sy = ty + 210;
      const pDot = E_IO(clamp(mp * 1.25 - c * 0.03 - r * 0.04));
      const x = lerp(sx, tx, pDot), y = lerp(sy, ty, pDot) + ((r + c) % 2 ? bob : -bob);
      if (pDot < 0.98) {
        ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x + 28, y + 24); ctx.lineTo(x, y); ctx.stroke();
      }
      ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fill();
    }
  }

  // Slam Stamp right across bottom of arena
  impactStamp(t, S.stamp, 540, 1245, CW, 128, GOLD, OBS, 'LANGSUNG DI LOKASI LOMBA!', 48, -0.025);

  if (t >= S.dims) {
    const dp = E_OUT(pr(t, S.dims, 0.35));
    ctx.save(); ctx.globalAlpha = dp;
    text('KAMPUS TERPADU MU\'ALLIMIN SEDAYU', 540, 1405, { f: 'd', size: 34, w: 900, align: 'center', color: WHITE });
    text('SD/MI: 25×14 M (BASKET)   ·   SMP/MTs: 26×15 M (EMBUNG)', 540, 1458, { size: 22, w: 700, align: 'center', color: CYAN });
    ctx.restore();
  }
}

/* ================= SCENE 4: BEBAS GANTI PERSONEL & FORMASI (17.5 - 22.0s) ================= */
function s4Roster(t) {
  const S = T.s4;
  ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H);
  bgKineticWord('FLEXIBLE ROSTER · NO WORRIES ·', 520, 175, t, 130, false);

  reveal('BEBAS GANTI', L - 4, 398, { f: 'd', size: fit('BEBAS GANTI', 'd', 900, CW), w: 900, color: OBS }, t, S.form);
  reveal('PERSONEL & FORMASI!', L - 4, 492, { f: 'd', size: fit('PERSONEL & FORMASI!', 'd', 900, CW), w: 900, color: CRIMSON }, t, S.form + 0.12);

  // Giant Interactive Formation Stage
  const bx = L, by = 540, bw = CW, bh = 640;
  ctx.fillStyle = OBS; ctx.fillRect(bx, by, bw, bh);
  brackets(bx + 18, by + 18, bw - 36, bh - 36, 28, GREEN, 3);
  text('TANPA NOMOR ANGGOTA KAKU · ROTASI BEBAS DI DASHBOARD', 540, by + 62, { size: 20, w: 800, ls: 1.5, align: 'center', color: GOLD });

  const swA = E_IO(pr(t, S.swapA[0], S.swapA[1] - S.swapA[0]));
  const swB = E_IO(pr(t, S.swapB[0], S.swapB[1] - S.swapB[0]));

  const gx0 = bx + 115, gy0 = by + 195, dx = 94, dy = 110;
  const cadX = bx + bw - 125;

  // Curved glowing swap trajectories
  if (swA > 0) {
    ctx.save(); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(gx0 + 2 * dx, gy0 + dy); ctx.quadraticCurveTo(540, gy0 - 95, cadX, gy0); ctx.stroke();
    ctx.restore();
  }
  if (swB > 0) {
    ctx.save(); ctx.strokeStyle = CYAN; ctx.lineWidth = 4; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(gx0 + 4 * dx, gy0); ctx.quadraticCurveTo(gx0 + 4 * dx + 85, gy0 + dy, gx0 + 4 * dx, gy0 + 2 * dy); ctx.stroke();
    ctx.restore();
  }

  // 21 Inti Nodes
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      let x = gx0 + c * dx, y = gy0 + r * dy, col = WHITE, rad = 20;
      if (r === 1 && c === 2) {
        x = lerp(gx0 + 2 * dx, cadX, swA);
        y = lerp(gy0 + dy, gy0, swA) + Math.sin(swA * Math.PI) * 90;
        col = swA > 0 ? '#FF6B6B' : WHITE;
      } else if (r === 0 && c === 4) {
        x += Math.sin(swB * Math.PI) * 65;
        y = lerp(gy0, gy0 + 2 * dy, swB);
        col = swB > 0 ? CYAN : WHITE; rad = 24;
      } else if (r === 2 && c === 4) {
        x -= Math.sin(swB * Math.PI) * 65;
        y = lerp(gy0 + 2 * dy, gy0, swB);
        col = swB > 0 ? CYAN : WHITE; rad = 24;
      }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    }
  }

  // Cadangan Column swapping IN!
  text('PENGGANTI', cadX, gy0 - 52, { size: 15, w: 800, ls: 2, align: 'center', color: GOLD });
  for (let i = 0; i < 3; i++) {
    let x = cadX, y = gy0 + i * dy, col = GOLD;
    if (i === 0) {
      x = lerp(cadX, gx0 + 2 * dx, swA);
      y = lerp(gy0, gy0 + dy, swA) - Math.sin(swA * Math.PI) * 95;
      col = swA > 0.8 ? GREEN : GOLD;
    }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.fill();
  }

  // Status pills inside stage bottom
  ctx.fillStyle = '#1B2820'; ctx.fillRect(bx + 36, by + 505, bw - 72, 96);
  text('✔ SISWA SAKIT / BERHALANGAN? BEBAS GANTI PERSONEL & NAMA!', 540, by + 564, { size: 22, w: 800, align: 'center', color: GREEN });

  // Slam Deadline Stamp
  impactStamp(t, S.stamp, 540, 1340, CW, 148, CRIMSON, WHITE, 'SAMPAI H-1 TM (8 JAN 2027)!', 48, -0.025);
  if (t > S.stamp + 0.15) {
    text('Cukup sesuaikan Surat Tugas Kepala Sekolah saat Technical Meeting.', 540, 1475, { size: 21, w: 700, align: 'center', color: OBS });
  }
}

/* ================= SCENE 5: PAPERLESS SWORD-SLICE TYPOGRAPHY (22.0 - 27.0s) ================= */
// Renders a giant word that physically SLICES in half horizontally and drifts apart when slashed!
function slicedWord(word, y, size, t, tIn, tCut) {
  const p = E_OUT(pr(t, tIn, 0.3)); if (p <= 0) return;
  const cp = E_OUT(pr(t, tCut, 0.35));
  const shift = cp * 55;
  const col = cp > 0 ? '#666' : WHITE;

  ctx.save();
  ctx.translate((1 - p) * 120, 0);
  // Top half of glyphs
  ctx.save();
  ctx.beginPath(); ctx.rect(0, y - size, W, size * 0.62); ctx.clip();
  text(word, L, y - cp * 8, { f: 'd', size, w: 900, color: col });
  ctx.restore();

  // Bottom half of glyphs sliding opposite way!
  ctx.save();
  ctx.beginPath(); ctx.rect(0, y - size * 0.38, W, size * 0.65); ctx.clip();
  text(word, L - shift, y + cp * 10, { f: 'd', size, w: 900, color: col });
  ctx.restore();

  // Razor-sharp Red Laser Slash Line
  if (cp > 0) {
    const slashX = E_IO(pr(t, tCut, 0.18));
    ctx.fillStyle = RED;
    ctx.fillRect(L - 20, y - size * 0.38 - 4, (CW + 40) * slashX, 12);
    if (slashX > 0.8) {
      ctx.fillStyle = RED; ctx.fillRect(R - 190, y - size * 0.72, 190, 52);
      text('✕ TIDAK PERLU!', R - 95, y - size * 0.72 + 35, { size: 19, w: 800, align: 'center', color: WHITE });
    }
  }
  ctx.restore();
}

function s5Paperless(t) {
  const S = T.s5;
  ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H);
  bgKineticWord('ZERO PAPER · ANTI RIBET ·', 460, 190, t, 140, true);

  marqueeBand(t, 285, 50, GOLD, OBS, 'ADMINISTRASI 100% DIGITAL  ·  TANPA BERKAS FISIK', 230, 0);

  // 3 Giant Sliced Words!
  slicedWord('PRINT BERKAS', 520, 102, t, S.w1, S.cut1);
  slicedWord('CETAK FOTO', 700, 108, t, S.w2, S.cut2);
  slicedWord('TEMPEL FOTO', 880, 104, t, S.w3, S.cut3);

  // Glowing Green Smartphone/Dashboard Card Springs Up Over Bottom Half!
  const pp = E_SPRING(pr(t, S.phone, 0.5));
  if (pp > 0) {
    const py = 965 + (1 - pp) * 320, ph = 525;
    ctx.save();
    ctx.fillStyle = GREEN; ctx.fillRect(L - 8, py - 8, CW + 16, ph + 16);
    ctx.fillStyle = '#0D1912'; ctx.fillRect(L, py, CW, ph);
    ctx.fillStyle = GREEN; ctx.fillRect(L, py, CW, 74);
    const hdrTxt = '✓ SEMUA CUKUP UPLOAD DARI HP / LAPTOP!';
    text(hdrTxt, 540, py + 48, { f: 'd', size: fit(hdrTxt, 'd', 900, CW - 48, 30), w: 900, align: 'center', color: OBS });

    const perks = [
      'Upload Pasfoto 3×4 File Digital (Tanpa Cetak)',
      'Input Biodata & Upload Logo PNG Transparan',
      'Tanda Tangan Pakta Integritas Langsung di Layar'
    ];
    perks.forEach((pk, i) => {
      const up = clamp((t - (S.phone + 0.18 + i * 0.22)) / 0.35);
      const ry = py + 115 + i * 96;
      ctx.fillStyle = 'rgba(22,163,74,0.16)'; ctx.fillRect(L + 32, ry, (CW - 64) * E_OUT(up), 74);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.strokeRect(L + 32, ry, CW - 64, 74);
      text('✓  ' + pk, L + 58, ry + 47, { size: 24, w: 700, color: WHITE, alpha: up });
    });

    impactStamp(t, S.done, 540, py + ph - 52, CW - 80, 92, GOLD, OBS, '100% PAPERLESS · HEMAT WAKTU & BIAYA!', 34, -0.015);
    ctx.restore();
  }
}

/* ================= SCENE 6: LIVE DIGITAL SCORING OVERTAKE (27.0 - 31.5s) ================= */
const BOARD = [
  { name: 'PELETON 04', pbb: 91.5, dan: 89.0, tot: 272.5 },
  { name: 'PELETON 09', pbb: 88.0, dan: 87.5, tot: 264.0 },
  { name: 'PELETON 12', pbb: 94.2, dan: 92.8, tot: 281.4 } // Overtakes #1!
];
function s6Scoring(t) {
  const S = T.s6;
  ctx.fillStyle = CRIMSON; ctx.fillRect(0, 0, W, 680);
  ctx.fillStyle = OBS; ctx.fillRect(0, 680, W, H - 680);

  // Top: Dewan Juri + Giant 100% Odometer
  const jp = E_OUT(pr(t, S.juri, 0.35));
  if (jp > 0) {
    ctx.fillStyle = GOLD; ctx.fillRect(L, 305, 520, 48);
    text('JURI TNI / POLRI & PROFESIONAL', L + 20, 338, { size: 21, w: 800, ls: 1.5, color: OBS });
  }
  const pv = T.odo(0, 100, S.odo[0], S.odo[1])(t);
  const ow = odometer(pv, 3, L - 8, 558, 200, WHITE, 800);
  text('%', L + ow + 6, 558, { f: 'd', size: 124, w: 900, color: GOLD });
  const lsSz = fit('LIVE DIGITAL SCORING!', 'd', 900, CW);
  const wLive = measure('LIVE DIGITAL ', 'd', lsSz, 900);
  reveal('LIVE DIGITAL', L, 642, { f: 'd', size: lsSz, w: 900, color: GOLD }, t, S.juri + 0.15);
  reveal('SCORING!', L + wLive, 642, { f: 'd', size: lsSz, w: 900, color: WHITE }, t, S.juri + 0.25);

  // Live Scoreboard with Rapid Ticking Numbers + Dramatic Rank #1 Overtake!
  const by = 735;
  // Blinking LIVE badge + Waveform
  if (Math.floor(t * 6) % 2 === 0) { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(L + 20, by + 22, 12, 0, 7); ctx.fill(); }
  text('REAL-TIME LEADERBOARD · TERPANTAU LANGSUNG', L + 48, by + 30, { size: 21, w: 800, ls: 1.5, color: WHITE });

  const ov = E_SPRING(pr(t, S.overtake, 0.55));
  const slots = [lerp(0, 1, ov), lerp(1, 2, ov), lerp(2, 0, ov)]; // Row 2 rockets to #1!

  BOARD.forEach((b, r) => {
    const y = by + 76 + slots[r] * 165;
    const isWinner = r === 2 && ov > 0.4;
    ctx.save();
    if (isWinner) {
      const sc = 1 + 0.03 * Math.sin((t - S.overtake) * 10);
      ctx.translate(540, y + 68); ctx.scale(sc, sc); ctx.translate(-540, -(y + 68));
    }
    ctx.fillStyle = isWinner ? '#132A1B' : '#181818';
    ctx.fillRect(L, y, CW, 142);
    ctx.strokeStyle = isWinner ? GREEN : 'rgba(248,249,250,.25)';
    ctx.lineWidth = isWinner ? 4 : 1.5;
    ctx.strokeRect(L, y, CW, 142);

    // Rank badge
    const rk = isWinner ? '#1' : '#' + Math.round(slots[r] + 1);
    ctx.fillStyle = isWinner ? GOLD : '#2C2C2C';
    ctx.fillRect(L, y, 108, 142);
    text(rk, L + 54, y + 88, { f: 'd', size: 48, w: 900, align: 'center', color: isWinner ? OBS : WHITE });

    text(b.name, L + 136, y + 62, { f: 'd', size: 36, w: 900, color: WHITE });
    const c1 = t >= S.cells0 + r * 3 * S.step;
    const c2 = t >= S.cells0 + (r * 3 + 1) * S.step;
    const c3 = t >= S.cells0 + (r * 3 + 2) * S.step;
    text(`PBB: ${c1 ? b.pbb.toFixed(1) : '--'}   ·   DANTON: ${c2 ? b.dan.toFixed(1) : '--'}`, L + 136, y + 108, { size: 21, w: 600, color: GOLD });
    text(c3 ? b.tot.toFixed(1) : '---', R - 32, y + 92, { f: 'd', size: 64, w: 900, align: 'right', color: isWinner ? GREEN : WHITE });
    ctx.restore();
  });

  impactStamp(t, S.lock, 540, 1385, CW, 118, WHITE, OBS, 'TRANSPARAN · 0% REKAYASA · AKURAT!', 42, 0.018);
}

/* ================= SCENE 7: URGENT CTA & QR LOCK (31.5 - 36.0s) ================= */
function s7Cta(t) {
  const C = T.s7;
  ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H);
  bgKineticWord('DAFTAR SEKARANG · H-2 ·', 520, 200, t, 140, true);

  marqueeBand(t, 280, 50, CRIMSON, WHITE, 'PENUTUPAN GELOMBANG 1: 8 NOVEMBER 2026 PUKUL 23.59 WIB', 240, 0);

  const s1 = fit('AMANKAN SLOT', 'd', 900, CW), s2 = fit('SEBELUM 8 NOV!', 'd', 900, CW);
  reveal('AMANKAN SLOT', L - 4, 365 + s1 * CAP, { f: 'd', size: s1, w: 900, color: WHITE }, t, C.l1);
  reveal('SEBELUM 8 NOV!', L - 4, 385 + s1 * CAP + s2 * CAP, { f: 'd', size: s2, w: 900, color: GOLD }, t, C.l2);

  // QR Code with Laser Sweep & Animated Lock Brackets
  const M = window.QRM, n = M ? M.length : 33, S = 330, pad = 26, box = S + pad * 2, bx = 540 - box / 2, qy = 635;
  if (t >= C.qr[0] && M) {
    const qp = E_SPRING(pr(t, C.qr[0], 0.45));
    ctx.save(); ctx.translate(540, qy + box / 2); ctx.scale(qp, qp); ctx.translate(-540, -(qy + box / 2));
    ctx.fillStyle = WHITE; ctx.fillRect(bx, qy, box, box);
    const rows = Math.floor(n * pr(t, C.qr[0], C.qr[1] - C.qr[0])), ms = S / n;
    ctx.fillStyle = OBS;
    for (let r = 0; r < rows; r++) for (let c = 0; c < n; c++) if (M[r][c] === '1') ctx.fillRect(Math.floor(bx + pad + c * ms), Math.floor(qy + pad + r * ms), Math.ceil(ms), Math.ceil(ms));

    const beamY = qy + pad + (((t - C.qr[0]) * 240) % S);
    hline(bx, bx + box, beamY, RED, 1, 5);
    ctx.restore();

    const lp = E_OUT(pr(t, C.lock - 0.15, 0.3));
    const pulse = Math.sin(t * 8) * 5;
    const off = 22 + (1 - lp) * 70 + pulse;
    if (lp > 0) brackets(bx - off, qy - off, box + off * 2, box + off * 2, 48, GOLD, 5);
  }

  text('SCAN ATAU KLIK PORTAL RESMI:', 540, qy + box + 68, { size: 22, w: 800, ls: 2, align: 'center', color: GOLD, alpha: pr(t, C.lock, 0.25) });

  const ry = qy + box + 138;
  [['PORTAL WEB', 'lbb.tontimuallimin.com'], ['WHATSAPP', '0819-4749-1505'], ['INSTAGRAM', '@lbbmuin']].forEach(([k, v], i) => {
    const t0 = C.rows[i], p = E_OUT(pr(t, t0, 0.35)); if (p <= 0) return;
    const y = ry + i * 74;
    ctx.save(); ctx.globalAlpha = p; ctx.translate((1 - p) * 45, 0);
    ctx.fillStyle = '#181818'; ctx.fillRect(L, y - 44, CW, 62);
    ctx.fillStyle = GOLD; ctx.fillRect(L, y - 44, 10, 62);
    text(k, L + 28, y - 5, { size: 19, w: 800, ls: 2, color: GOLD });
    text(v, R - 28, y - 3, { size: 32, w: 700, align: 'right', color: WHITE });
    ctx.restore();
  });
}

/* ================= MASTER COMPOSITOR + DIAGONAL SHUTTER WIPE ================= */
const SCENES = [s0Hook, s1Price, s2Juara, s3Trial, s4Roster, s5Paperless, s6Scoring, s7Cta];
const THEME = ['d', 'l', 'd', 'd', 'l', 'd', 'd', 'd'];
const LABELS = ['H-2 TUTUP', 'HEMAT 50RB', '20 PIALA', 'UJI ARENA', 'ROSTER BEBAS', 'PAPERLESS', 'LIVE SCORE', 'DAFTAR'];
const sceneIndex = t => { let k = 0; T.cuts.forEach((c, i) => { if (t >= c) k = i + 1; }); return k; };

function hud(t, k) {
  const dark = THEME[k] !== 'l', c = dark ? WHITE : OBS;
  text("LBB MU'ALLIMIN 2027", L, 234, { size: 19, w: 800, ls: 2, color: c });
  const tc = '00:' + ('0' + Math.floor(t)).slice(-2) + '.' + Math.floor((t % 1) * 10);
  text(`${LABELS[k]}  ·  ${tc}`, R, 234, { size: 19, w: 700, ls: 2, color: c, align: 'right' });
  hline(L, R, 254, dark ? 'rgba(248,249,250,.22)' : 'rgba(13,13,13,.22)', 1, 3);
  hline(L, lerp(L, R, t / T.dur), 254, GOLD, 1, 4);
}

// Fast kinetic diagonal slash shutter transition (0.38s)
window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const k = sceneIndex(t), tb = k > 0 ? T.cuts[k - 1] : -9, trDur = 0.38, inTr = k > 0 && t < tb + trDur;
  if (!inTr) {
    SCENES[k](t);
  } else {
    SCENES[k - 1](t);
    const p = E_IO((t - tb) / trDur);
    // Gold + Crimson leading diagonal razor blade wipe
    const sweep = lerp(-600, W + 600, p);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-600, 0); ctx.lineTo(sweep + 180, 0); ctx.lineTo(sweep - 180, H); ctx.lineTo(-600, H);
    ctx.closePath();
    ctx.fillStyle = CRIMSON; ctx.fill();
    ctx.restore();

    const p2 = E_IO(clamp((t - tb - 0.05) / (trDur - 0.05)));
    const sweep2 = lerp(-600, W + 600, p2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-600, 0); ctx.lineTo(sweep2 + 180, 0); ctx.lineTo(sweep2 - 180, H); ctx.lineTo(-600, H);
    ctx.closePath();
    ctx.clip();
    SCENES[k](t);
    ctx.restore();
  }
  hud(t, inTr && t < tb + 0.19 ? k - 1 : k);
  if (grain) { ctx.save(); ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fo = pr(t, T.dur - 0.4, 0.4); if (fo > 0) { ctx.fillStyle = `rgba(13,13,13,${fo})`; ctx.fillRect(0, 0, W, H); }
};
