// LBB Mu'allimin 2027 – "Alur Pendaftaran" (Tactical Minimalism)
// Deterministic canvas renderer: window.renderFrame(t).
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const OBS = '#0F0F0F', WHITE = '#F8F9FA', CRIMSON = '#6E0D0D', GOLD = '#D4AF37', CARD = '#171717';
const PHOTO_RED = '#B3261E', PHOTO_BLUE = '#1F4E9C';
const L = 72, R = 1008, CW = R - L;
const DISP = 'Archivo', MONO = '"JetBrains Mono"';

/* ---------- math / easing ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, d) => clamp((t - a) / d);
const lerp = (a, b, x) => a + (b - a) * x;
function bez(x1, y1, x2, y2) {
  const cb = (a, b, s) => 3 * a * s * (1 - s) * (1 - s) + 3 * b * s * s * (1 - s) + s * s * s;
  return x => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1, s = x; for (let i = 0; i < 24; i++) { s = (lo + hi) / 2; if (cb(x1, x2, s) < x) lo = s; else hi = s; } return cb(y1, y2, s); };
}
const E_IO = bez(.7, 0, .2, 1), E_OUT = bez(.16, 1, .3, 1), E_LINE = bez(.65, 0, .35, 1);
const rnd = (() => { let s = 4242; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();

/* ---------- assets ---------- */
const IMG = {};
const loadImg = (k, src) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.onerror = () => { console.log('IMG FAIL ' + src); r(); }; im.src = src; });
let grain;
window.ready = Promise.all([
  loadImg('logo', 'assets/logo.png'), loadImg('tonti', 'assets/tonti-muallimin.png'), loadImg('bsi', 'assets/bsi-white.svg'),
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
function reveal(s, x, y, o, t, t0, d = 0.55) {
  const p = pr(t, t0, d); if (p <= 0) return; const e = E_OUT(p), size = o.size, cap = size * CAP;
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - cap - size * 0.14, W, cap + size * 0.3); ctx.clip();
  text(s, x, y + (1 - e) * (cap + size * 0.35), o); ctx.restore();
}
function typeOn(s, x, y, o, t, t0, cps = 48) {
  const n = Math.floor((t - t0) * cps); if (n <= 0) return;
  const sub = s.slice(0, n); text(sub, x, y, o);
  if (n < s.length + 6 && Math.floor(t * 8) % 2 === 0) {
    const sz = o.size || 22, wd = measure(sub, 'm', sz, o.w, o.ls);
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); ctx.fillStyle = o.cursor || GOLD; ctx.fillRect(x + wd + 4, y - sz * 0.78, sz * 0.55, sz * 0.9); ctx.restore();
  }
}
/* ---------- primitives ---------- */
function hline(x0, x1, y, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(x0, Math.round(y) - (lw > 1 ? lw / 2 : 0), (x1 - x0) * p, lw); }
function vline(x, y0, y1, col, p = 1, lw = 1) { if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(Math.round(x), y0, lw, (y1 - y0) * p); }
function dashedH(x0, x1, y, col, p = 1, dash = 10, gap = 8) { ctx.fillStyle = col; const x1p = lerp(x0, x1, p); for (let x = x0; x < x1p; x += dash + gap) ctx.fillRect(x, Math.round(y), Math.min(dash, x1p - x), 1); }
function dashedRect(x, y, w, h, col) { dashedH(x, x + w, y, col); dashedH(x, x + w, y + h, col); ctx.fillStyle = col; for (let yy = y; yy < y + h; yy += 18) { ctx.fillRect(x, yy, 1, Math.min(10, y + h - yy)); ctx.fillRect(x + w, yy, 1, Math.min(10, y + h - yy)); } }
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
  [[L, 290], [R, 290], [L, 1540], [R, 1540]].forEach(([x, y]) => cross(x, y, 9, m));
}
function sceneLabel(s, t, t0, dark = true) { typeOn(s, L, 330, { size: 22, w: 500, ls: 2, color: dark ? WHITE : OBS, alpha: .62 }, t, t0); }
function check(x, y, s, col, lw = 3) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'square'; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .8); ctx.stroke(); ctx.restore(); }
function drawImgH(im, cx, cy, h, alpha = 1) { if (!im) return; const w = h * im.width / im.height; ctx.save(); ctx.globalAlpha *= alpha; ctx.drawImage(im, cx - w / 2, cy - h / 2, w, h); ctx.restore(); return w; }
// form field: label + box + typed value
function field(x, y, w, label, value, t, t0, o = {}) {
  const p = pr(t, t0 - .15, .3); if (p <= 0) return;
  const dark = o.dark, fg = dark ? WHITE : OBS, h = o.h || 58;
  ctx.save(); ctx.globalAlpha *= clamp(p * 2);
  text(label, x, y - 12, { size: 15, w: 600, ls: 2, color: fg, alpha: .55 });
  strokeR(x, y, w, h, dark ? 'rgba(248,249,250,.4)' : 'rgba(15,15,15,.45)');
  typeOn(value, x + 18, y + h / 2 + 9, { size: o.size || 24, w: 500, color: o.valColor || fg, cursor: o.cursorCol || (dark ? GOLD : CRIMSON) }, t, t0);
  if (o.tag && t > t0 + value.length / 48 + .1) {
    const tw = measure(o.tag, 'm', 13, 700, 2) + 20, tx = x + w - tw - 10, ty = y + (h - 26) / 2;
    ctx.fillStyle = o.tagBg || GOLD; ctx.fillRect(tx, ty, tw, 26); text(o.tag, tx + 10, ty + 18, { size: 13, w: 700, ls: 2, color: o.tagFg || OBS });
  }
  ctx.restore();
}
// upload progress row
function upload(x, y, w, t, [a, b], o = {}) {
  const p = pr(t, a, b - a), fg = o.dark ? WHITE : OBS; if (t < a - .15) return;
  hline(x, x + w, y, o.dark ? 'rgba(248,249,250,.2)' : 'rgba(15,15,15,.15)', 1, 4);
  hline(x, x + w, y, p >= 1 ? GOLD : (o.dark ? WHITE : CRIMSON), E_IO(p), 4);
  const lab = p >= 1 ? 'TERUNGGAH' : `UNGGAH ${String(Math.floor(p * 100)).padStart(3, '0')}%`;
  text(lab, x + w, y + 26, { size: 14, w: 700, ls: 2, color: p >= 1 ? (o.dark ? GOLD : CRIMSON) : fg, alpha: p >= 1 ? 1 : .6, align: 'right' });
  if (p >= 1) check(x + w - measure(lab, 'm', 14, 700, 2) - 20, y + 20, 7, o.dark ? GOLD : CRIMSON, 2.5);
  if (o.meta) text(o.meta, x, y + 26, { size: 14, w: 500, ls: 1, color: fg, alpha: .55 });
}
function lockIcon(x, y, s, col) { ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .16; ctx.beginPath(); ctx.arc(x, y - s * .25, s * .32, Math.PI, 0); ctx.stroke(); ctx.fillRect(x - s * .5, y - s * .25, s, s * .75); ctx.restore(); }

/* ================= SCENES ================= */
// 00 HOOK -----------------------------------------------------------------
function sHook(t) {
  const K = T.hook; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  typeOn('[!] PERINGATAN — KUOTA 36 PELETON SE-DIY', L, 330, { size: 22, w: 500, ls: 2, alpha: .7 }, t, 0.05);
  const s1 = fit('TERBATAS.', 'd', 900, CW), s3 = fit('TERTINGGAL.', 'd', 900, CW);
  const y1 = 400 + s1 * CAP, y2 = y1 + 26 + s1 * CAP;
  reveal('KUOTA', L - 4, y1, { f: 'd', size: s1, w: 900 }, t, K.l[0]);
  reveal('TERBATAS', L - 4, y2, { f: 'd', size: s1, w: 900 }, t, K.l[1]);
  if (t > K.l[1] + .3) text('.', L - 4 + measure('TERBATAS', 'd', s1, 900, -s1 * .02), y2, { f: 'd', size: s1, w: 900, color: GOLD });
  // crimson block: JANGAN SAMPAI / TERTINGGAL.
  const by = y2 + 70, bh = s3 * CAP * 2 + 26 + 90, bp = E_IO(pr(t, K.l[2] - .08, .3));
  if (bp > 0) { ctx.fillStyle = CRIMSON; ctx.fillRect(0, by, W * bp, bh); }
  const y3 = by + 45 + s3 * CAP, y4 = y3 + 26 + s3 * CAP;
  reveal('JANGAN SAMPAI', L - 4, y3, { f: 'd', size: fit('JANGAN SAMPAI', 'd', 900, CW, s3), w: 900 }, t, K.l[2]);
  reveal('TERTINGGAL', L - 4, y4, { f: 'd', size: s3, w: 900 }, t, K.l[3]);
  if (t > K.l[3] + .3) text('.', L - 4 + measure('TERTINGGAL', 'd', s3, 900, -s3 * .02), y4, { f: 'd', size: s3, w: 900, color: GOLD });
  const my = by + bh + 80;
  hline(L, R, my - 44, 'rgba(248,249,250,.35)', E_LINE(pr(t, K.sub - .1, .5)));
  typeOn('AMANKAN TIKET PELETONMU SEKARANG.', L, my, { size: 28, w: 700, ls: 2, color: GOLD }, t, K.sub, 40);
}

// 01 PORTAL ---------------------------------------------------------------
function sPortal(t) {
  const P = T.portal; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true, .7);
  sceneLabel('LANGKAH 01 — AKSES PORTAL & KATEGORI', t, 3.05);
  // LBB logo (official identity)
  const lp = pr(t, P.logo, .5); if (lp > 0) drawImgH(IMG.logo, 540, 545, 300 * (1.03 - .03 * E_OUT(lp)), clamp(lp * 2.5));
  // browser mockup
  const bx = L, by = 740, bw = CW, bh = 760, op = E_OUT(pr(t, P.logo + .15, .5)); if (op <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(bx - 1, by - 1, bw + 3, bh * op + 2); ctx.clip();
  ctx.fillStyle = CARD; ctx.fillRect(bx, by, bw, bh); strokeR(bx, by, bw, bh, 'rgba(248,249,250,.35)');
  ctx.fillStyle = '#222'; ctx.fillRect(bx, by, bw + 1, 60); hline(bx, bx + bw, by + 60, 'rgba(248,249,250,.25)');
  [0, 1, 2].forEach(i => strokeR(bx + 22 + i * 24, by + 23, 13, 13, 'rgba(248,249,250,.5)'));
  strokeR(bx + 110, by + 12, bw - 130, 36, 'rgba(248,249,250,.3)');
  lockIcon(bx + 132, by + 34, 14, GOLD);
  typeOn('https://lbb.tontimuallimin.com', bx + 150, by + 38, { size: 20, w: 500 }, t, P.url);
  // page content
  const cy = by + 60;
  text("LBB MU'ALLIMIN 2027 · PORTAL RESMI", bx + 40, cy + 70, { size: 16, w: 600, ls: 2, alpha: .55 });
  reveal('PENDAFTARAN', bx + 38, cy + 150, { f: 'd', size: fit('PENDAFTARAN', 'd', 900, bw - 80, 90), w: 900 }, t, P.url + .2);
  reveal('PELETON', bx + 38, cy + 235, { f: 'd', size: fit('PENDAFTARAN', 'd', 900, bw - 80, 90), w: 900, color: GOLD }, t, P.url + .35);
  // button
  const btP = E_OUT(pr(t, P.btn, .4)), clicked = t >= P.click, press = clicked ? Math.exp(-(t - P.click) * 10) : 0;
  const btx = bx + 40, bty = cy + 290, btw = 420, bth = 84;
  if (btP > 0) {
    ctx.save(); ctx.globalAlpha *= btP; ctx.translate(btx + btw / 2, bty + bth / 2); const sc = 1 - .04 * press; ctx.scale(sc, sc);
    ctx.fillStyle = clicked && t < P.click + .25 ? WHITE : CRIMSON; ctx.fillRect(-btw / 2, -bth / 2, btw, bth);
    text('DAFTAR PELETON  →', -btw / 2 + 32, 12, { f: 'd', size: 32, w: 800, color: clicked && t < P.click + .25 ? CRIMSON : WHITE });
    ctx.restore();
  }
  // cursor
  if (t > P.cursor[0] - .1 && t < P.chips + .4) {
    const cp = E_IO(pr(t, P.cursor[0], P.cursor[1] - P.cursor[0])), cx = lerp(bx + bw - 120, btx + btw - 70, cp), cyy = lerp(cy + 560, bty + bth / 2 + 6, cp);
    ctx.save(); ctx.translate(cx, cyy); ctx.fillStyle = WHITE; ctx.strokeStyle = OBS; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(9, 26); ctx.lineTo(16, 40); ctx.lineTo(22, 37); ctx.lineTo(15, 23); ctx.lineTo(26, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (clicked && t < P.click + .3) { ctx.globalAlpha = 1 - (t - P.click) / .3; ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; const r = 14 + (t - P.click) * 120; ctx.strokeRect(-r, -r, r * 2, r * 2); }
    ctx.restore();
  }
  // category chips
  const chip = (lab, x, y, w, t0, sel) => {
    const p = pr(t, t0, .3); if (p <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(p * 3);
    if (sel) { ctx.fillStyle = WHITE; ctx.fillRect(x, y, w, 54); } else strokeR(x, y, w, 54, 'rgba(248,249,250,.45)');
    text(lab, x + w / 2, y + 35, { size: 20, w: 700, ls: 2, align: 'center', color: sel ? OBS : WHITE }); ctx.restore();
  };
  const ky = cy + 420;
  if (t > P.chips) { text('JENJANG', bx + 40, ky - 14, { size: 15, w: 600, ls: 2, alpha: .55 }); text('TIPE PELETON', bx + 40, ky + 100, { size: 15, w: 600, ls: 2, alpha: .55 }); }
  chip('SD / MI', bx + 40, ky, 250, P.chips, t >= P.pick[0]); chip('SMP / MTs', bx + 306, ky, 250, P.chips + .08, false);
  chip('PUTRA', bx + 40, ky + 114, 190, P.chips + .16, false); chip('PUTRI', bx + 246, ky + 114, 190, P.chips + .22, false); chip('CAMPURAN', bx + 452, ky + 114, 240, P.chips + .28, t >= P.pick[1]);
  if (t > P.note) typeOn('* MAKS. 2 PELETON PER SEKOLAH', bx + 40, ky + 230, { size: 18, w: 600, ls: 2, color: GOLD }, t, P.note);
  ctx.restore();
}

// 02–03 AKUN, SEKOLAH, DANTON --------------------------------------------
function sAkun(t) {
  const A = T.akun; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); guides(false);
  sceneLabel('LANGKAH 02–03 — AKUN, SEKOLAH & DANTON', t, 6.55, false);
  const mod = (y, h, title, bg, t0) => {
    const p = E_OUT(pr(t, t0, .45)); if (p <= 0) return false;
    ctx.save(); ctx.beginPath(); ctx.rect(L - 1, y - 1, CW + 3, h * p + 2); ctx.clip();
    strokeR(L, y, CW, h, 'rgba(15,15,15,.7)'); ctx.fillStyle = bg; ctx.fillRect(L, y, CW + 1, 56);
    text(title, L + 24, y + 37, { size: 20, w: 700, ls: 3 }); ctx.restore(); return true;
  };
  // module A
  const ay = 380, ah = 540;
  if (mod(ay, ah, '02 — AKUN TIM & DATA SEKOLAH', OBS, A.modA)) {
    field(L + 28, ay + 110, CW - 56, 'EMAIL GOOGLE AKTIF', 'namasekolah@gmail.com', t, A.email, { tag: 'LOGIN DASHBOARD & E-NILAI' });
    field(L + 28, ay + 220, CW - 56, 'NAMA SEKOLAH / MADRASAH', "TONTI MU'ALLIMIN", t, A.school);
    if (t > A.upload[0] - .2) {
      const ux = L + 28, uy = ay + 315, uw = 200;
      text('LOGO SEKOLAH · PNG TRANSPARAN HD', ux, uy - 12, { size: 15, w: 600, ls: 2, color: OBS, alpha: .55 });
      dashedRect(ux, uy, uw, uw, 'rgba(15,15,15,.45)');
      const lp = pr(t, A.upload[1], .3); if (lp > 0) drawImgH(IMG.tonti, ux + uw / 2, uy + uw / 2, 170 * (1.08 - .08 * E_OUT(lp)), lp);
      upload(ux + uw + 30, uy + 120, CW - 56 - uw - 30, t, A.upload, { meta: 'logo-sekolah.png' });
      if (lp > .5) text('UNTUK PIAGAM & BACKDROP', ux + uw + 30, uy + 60, { size: 16, w: 600, ls: 2, color: CRIMSON, alpha: lp });
    }
  }
  // module B
  const byy = 960, bh = 560;
  if (mod(byy, bh, '03 — DANTON & OFFICIAL', CRIMSON, A.modB)) {
    field(L + 28, byy + 110, CW - 56, 'NAMA LENGKAP DANTON', 'Nama Komandan Peleton', t, A.danton);
    if (t > A.kartu[0] - .2) {
      const kx = L + 28, ky = byy + 200;
      text('KARTU PELAJAR DANTON (SAH) · MAKS. 3 MB', kx, ky - 12, { size: 15, w: 600, ls: 2, color: OBS, alpha: .55 });
      // ID card mock
      const kp = E_OUT(pr(t, A.kartu[0], .4)); ctx.save(); ctx.globalAlpha *= kp;
      strokeR(kx, ky + 4, 200, 124, OBS); ctx.fillStyle = CRIMSON; ctx.fillRect(kx, ky + 4, 201, 22);
      ctx.fillStyle = 'rgba(15,15,15,.18)'; ctx.fillRect(kx + 14, ky + 40, 54, 70);
      [0, 1, 2].forEach(i => { ctx.fillStyle = 'rgba(15,15,15,.25)'; ctx.fillRect(kx + 82, ky + 46 + i * 22, 100 - i * 20, 8); });
      ctx.restore();
      upload(kx + 230, ky + 70, CW - 56 - 230, t, A.kartu, { meta: 'kartu-pelajar-danton.jpg' });
    }
    field(L + 28, byy + 390, (CW - 56) / 2 - 12, 'OFFICIAL / PELATIH', 'Nama Official', t, A.official);
    field(L + 28 + (CW - 56) / 2 + 12, byy + 390, (CW - 56) / 2 - 12, 'WHATSAPP AKTIF', '08xx-xxxx-xxxx', t, A.wa);
    if (t > A.wa + .3) typeOn('* JALUR KOMUNIKASI HELPDESK RESMI', L + 28, byy + 500, { size: 16, w: 600, ls: 2, color: CRIMSON }, t, A.wa + .3, 70);
  }
}

// 04 PEMBAYARAN ------------------------------------------------------------
function priceRow(t, y, gel, date, base, hl, t0) {
  const p = E_OUT(pr(t, t0, .45)); if (p <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.translate(0, (1 - p) * 60);
  hline(L, R, y + 130, 'rgba(248,249,250,.3)');
  text(gel, L, y + 40, { size: 18, w: 700, ls: 3, color: GOLD });
  text(date, L, y + 80, { size: 24, w: 500 });
  text('/ PELETON', L, y + 112, { size: 14, w: 600, ls: 2, alpha: .5 });
  const size = 60; ctx.save(); setF('m', size, 700, 0); const cw = ctx.measureText('0').width; ctx.restore();
  const tot = cw * 12.5, x0 = 940 - tot, hp = pr(t, hl, .35);
  text('Rp ' + base, x0, y + 92, { size, w: 700, ls: 0 });
  text('.108', x0 + cw * 6, y + 92, { size, w: 700, ls: 0, color: hp > 0 ? GOLD : WHITE });
  text(',-', x0 + cw * 10, y + 92, { size, w: 700, ls: 0 });
  if (hp > 0) { ctx.fillStyle = GOLD; ctx.fillRect(x0 + cw * 6 + 4, y + 106, (cw * 4 - 8) * E_OUT(hp), 4); }
  ctx.restore();
}
function sBayar(t) {
  const B = T.bayar; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('LANGKAH 04 — PEMBAYARAN', t, B.title);
  const s = fit('PEMBAYARAN', 'd', 900, CW), y1 = 380 + s * CAP;
  reveal('PEMBAYARAN', L - 4, y1, { f: 'd', size: s, w: 900 }, t, B.title + .05);
  // bank card
  const cx = L, cy = y1 + 50, cw = CW, ch = 440, cp = E_OUT(pr(t, B.card, .5));
  if (cp > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(cx - 1, cy - 1, cw + 3, ch * cp + 2); ctx.clip();
    ctx.fillStyle = CARD; ctx.fillRect(cx, cy, cw, ch); strokeR(cx, cy, cw, ch, 'rgba(248,249,250,.3)');
    ctx.fillStyle = CRIMSON; ctx.fillRect(cx, cy, 8, ch);
    const lp = pr(t, B.logo, .4); if (lp > 0 && IMG.bsi) { const lh = 62, lw = lh * IMG.bsi.width / IMG.bsi.height; ctx.save(); ctx.globalAlpha *= lp; ctx.drawImage(IMG.bsi, cx + 40, cy + 34, lw, lh); ctx.restore(); }
    text('REKENING RESMI PANITIA', R - 32, cy + 74, { size: 15, w: 600, ls: 2, alpha: .55, align: 'right' });
    hline(cx + 40, R - 32, cy + 122, 'rgba(248,249,250,.2)');
    text('NO. REKENING · BANK SYARIAH INDONESIA', cx + 40, cy + 166, { size: 15, w: 600, ls: 2, alpha: .55 });
    const rek = '2600051817', n = clamp(Math.floor((t - B.rek0) / B.rekStep) + 1, 0, 10);
    ctx.save(); setF('m', 84, 700, 4); ctx.fillStyle = GOLD; ctx.fillText(rek.slice(0, n), cx + 36, cy + 252); ctx.restore();
    if (n > 0 && n < 10) { const wd = measure(rek.slice(0, n), 'm', 84, 700, 4); ctx.fillStyle = 'rgba(212,175,55,.35)'; ctx.fillRect(cx + 40 + wd, cy + 186, 46, 70); }
    text('ATAS NAMA', cx + 40, cy + 306, { size: 15, w: 600, ls: 2, alpha: .55 });
    typeOn('ADMISI HUMAS DAN KERJA SAMA', cx + 40, cy + 342, { size: 28, w: 700, ls: 1 }, t, B.an);
    text('BERITA TRANSFER (WAJIB)', cx + 40, cy + 390, { size: 15, w: 600, ls: 2, alpha: .55 });
    typeOn('NAMA SEKOLAH_JUMLAH PELETON', cx + 40, cy + 422, { size: 24, w: 600, ls: 1, color: GOLD }, t, B.berita);
    if (t > B.berita + .7) text('Contoh: MTS MUALLIMIN YK_1', R - 32, cy + 422, { size: 16, w: 500, alpha: .5 * pr(t, B.berita + .7, .2), align: 'right' });
    ctx.restore();
  }
  const ty = cy + ch + 30;
  priceRow(t, ty, 'GELOMBANG 1', '26 OKT – 8 NOV 2026', '350', B.hl[0], B.tiers[0]);
  priceRow(t, ty + 150, 'GELOMBANG 2', '9 – 22 NOV 2026', '400', B.hl[1], B.tiers[1]);
  const gp = pr(t, B.tag, .3);
  if (gp > 0) {
    const y = ty + 320; ctx.save(); ctx.globalAlpha *= gp; ctx.fillStyle = GOLD; ctx.fillRect(L, y, 420, 50);
    text('WAJIB KODE UNIK .108', L + 20, y + 33, { size: 22, w: 800, ls: 2, color: OBS }); ctx.restore();
    if (t > B.note) typeOn('NON-REFUNDABLE', L + 450, y + 33, { size: 18, w: 600, ls: 2, alpha: .6 }, t, B.note);
  }
}

// 04–05 PAKTA & VERIFIKASI -------------------------------------------------
const SIG = []; (() => { // deterministic signature polyline
  for (let i = 0; i <= 160; i++) { const u = i / 160, x = 40 + u * 560, y = Math.sin(u * 19) * 38 * Math.sin(u * 3.1 + .3) + Math.cos(u * 7) * 12 - u * 18; SIG.push([x, y]); }
})();
function sPakta(t) {
  const P = T.pakta; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); guides(false);
  sceneLabel('LANGKAH 04–05 — PAKTA & VERIFIKASI', t, 20.05, false);
  // bukti transfer
  text('BUKTI TRANSFER · JPG/PNG · MAKS. 2 MB', L, 410, { size: 16, w: 600, ls: 2, color: OBS, alpha: .6 * pr(t, 20.1, .2) });
  upload(L, 440, CW, t, P.upload, { meta: 'struk-atm / m-banking' });
  // pakta canvas
  const px = L, py = 520, pw = CW, ph = 330, op = E_OUT(pr(t, P.sign[0] - .3, .4));
  if (op > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(px - 1, py - 1, pw + 3, ph * op + 2); ctx.clip();
    strokeR(px, py, pw, ph, OBS); ctx.fillStyle = OBS; ctx.fillRect(px, py, pw + 1, 52);
    text('PAKTA INTEGRITAS DARING', px + 24, py + 35, { size: 20, w: 700, ls: 3 });
    text('TANDA TANGAN DIGITAL', px + pw - 24, py + 35, { size: 15, w: 600, ls: 2, alpha: .6, align: 'right' });
    dashedH(px + 40, px + pw - 40, py + ph - 70, 'rgba(15,15,15,.45)');
    text('×', px + 40, py + ph - 82, { size: 30, w: 700, color: CRIMSON });
    const sp = pr(t, P.sign[0], P.sign[1] - P.sign[0]), n = Math.floor(sp * (SIG.length - 1));
    if (n > 1) { ctx.save(); ctx.translate(px + 120, py + 180); ctx.strokeStyle = OBS; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); SIG.slice(0, n + 1).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
    if (t > P.sign[1]) { check(px + pw - 60, py + ph - 110, 12, CRIMSON, 3.5); }
    ctx.restore();
  }
  // registration code
  const cy = 940;
  if (t > P.code[0] - .2) {
    text('KODE REGISTRASI UNIK', L, cy, { size: 16, w: 600, ls: 2, color: OBS, alpha: .6 });
    const fin = 'LBB27-XXXX', cp = pr(t, P.code[0], P.code[1] - P.code[0]), CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const s = fin.split('').map((c, i) => (cp >= 1 || i < 6 || i / fin.length < cp * .9) && cp > i / fin.length * .9 ? c : CH[Math.floor((t * 37 + i * 7) % CH.length)]).join('');
    text(s, L - 4, cy + 86, { size: 80, w: 700, ls: 4, color: cp >= 1 ? CRIMSON : OBS });
  }
  // verification: 24 segments
  const vy = 1110;
  if (t > P.verif[0] - .2) {
    text('VERIFIKASI PANITIA', L, vy, { size: 16, w: 600, ls: 2, color: OBS, alpha: .6 });
    reveal('MAKS. 1×24 JAM', L - 4, vy + 76, { f: 'd', size: fit('MAKS. 1×24 JAM', 'd', 900, CW, 72), w: 900, color: OBS }, t, P.verif[0]);
    const vp = pr(t, P.verif[0] + .1, P.verif[1] - P.verif[0]), sw = (CW - 23 * 6) / 24;
    for (let i = 0; i < 24; i++) { const on = i < vp * 24; ctx.fillStyle = on ? OBS : 'rgba(15,15,15,.12)'; ctx.fillRect(L + i * (sw + 6), vy + 110, sw, 26); }
    text('00', L, vy + 166, { size: 14, w: 600, color: OBS, alpha: .5 }); text('24 JAM', R, vy + 166, { size: 14, w: 600, color: OBS, alpha: .5, align: 'right' });
  }
  // lock badge
  const lp = E_IO(pr(t, P.lock, .3));
  if (lp > 0) {
    const y = 1330, h = 110; ctx.fillStyle = CRIMSON; ctx.fillRect(L, y, CW * lp, h);
    if (lp > .7) { lockIcon(L + 60, y + h / 2 + 8, 40, GOLD); text('SLOT TERKUNCI', L + 110, y + 50, { f: 'd', size: 44, w: 900 }); text('KUOTA RESMI AMAN', L + 112, y + 88, { size: 20, w: 700, ls: 3, color: GOLD }); }
  }
  if (t > P.status) { ctx.fillStyle = GOLD; ctx.fillRect(L, 1478, 14, 14); typeOn('STATUS AKUN: AKTIF', L + 28, 1492, { size: 18, w: 700, ls: 2, color: OBS }, t, P.status); }
}

// DASHBOARD / ROSTER --------------------------------------------------------
function sRoster(t) {
  const Rr = T.roster; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('DASHBOARD PESERTA — ROSTER PELETON', t, 26.0);
  // headline: 25 PERSONEL
  const landed = (t >= Rr.danton ? 1 : 0) + T.snaps.slice(1).filter(s => t >= s).length + Rr.cad.filter(s => t >= s).length;
  if (t > Rr.title) { ctx.save(); ctx.globalAlpha = pr(t, Rr.title, .2); setF('m', 130, 700, 0); ctx.fillStyle = landed === 25 ? GOLD : WHITE; ctx.fillText(String(landed).padStart(2, '0'), L - 6, 486); ctx.restore(); }
  reveal('PERSONEL', L + 200, 438, { f: 'd', size: 60, w: 900 }, t, Rr.title + .1);
  typeOn('MAKS. PER PELETON', L + 202, 480, { size: 18, w: 600, ls: 2, alpha: .6 }, t, Rr.title + .3);
  // formation: 3 saf x 7 banjar (top view), danton in front
  const fx0 = 210, fdx = 110, fy0 = 640, fdy = 68, dot = (x, y, k, t0) => {
    const age = t - t0; if (age < 0) return; const sc = 1 + .4 * (1 - E_OUT(pr(age, 0, .18)));
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    if (k === 'D') { ctx.fillStyle = CRIMSON; ctx.beginPath(); ctx.arc(0, 0, 15, 0, 7); ctx.fill(); ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.stroke(); }
    else if (k === 'I') { ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 7); ctx.fill(); }
    else { ctx.strokeStyle = WHITE; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 10, 0, 7); ctx.stroke(); }
    ctx.restore();
    if (age < .2) { ctx.save(); ctx.globalAlpha = .7 * (1 - age / .2); hline(L, R, y, GOLD); ctx.restore(); }
  };
  const fp = E_OUT(pr(t, Rr.danton - .3, .4)); if (fp > 0) { ctx.save(); ctx.globalAlpha = .45 * fp; brackets(L + 40, 530, CW - 80, 380, 26, WHITE, 1); ctx.restore(); }
  dot(540, 560, 'D', Rr.danton);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) dot(fx0 + c * fdx, fy0 + r * fdy, 'I', Rr.inti0 + (r * 7 + c) * Rr.step);
  if (t > Rr.cad[0] - .2) dashedH(L + 60, R - 60, 818, 'rgba(248,249,250,.35)', E_LINE(pr(t, Rr.cad[0] - .2, .3)));
  Rr.cad.forEach((t0, i) => dot(430 + i * 110, 866, 'C', t0));
  // callouts (inline)
  const cy = 960, items = [['01', 'DANTON'], ['21', 'INTI · 3 SAF × 7 BANJAR'], ['03', 'CADANGAN']];
  let x = L; items.forEach(([n, l], i) => {
    const t0 = Rr.call + i * .12; if (t < t0) return;
    reveal(n, x, cy, { size: 34, w: 700, color: GOLD, ls: 0 }, t, t0, .4);
    typeOn(l, x + 50, cy - 4, { size: 16, w: 600, ls: 1 }, t, t0 + .05);
    x += 50 + measure(l, 'm', 16, 600, 1) + 34;
  });
  if (t > Rr.call + .45) typeOn('+3 PENDAMPING (1 OFFICIAL + 2 PENDUKUNG) · MIN. TAMPIL 22 ORANG', L, cy + 36, { size: 15, w: 600, ls: 1, alpha: .6 }, t, Rr.call + .45, 70);
  // data table
  const ty = 1030, tp = E_OUT(pr(t, Rr.table, .4));
  if (tp > 0) {
    ctx.save(); ctx.globalAlpha *= tp;
    const cols = [['NAMA LENGKAP*', L], ['NISN', 520], ['TTL', 690], ['KELAS', 880]];
    cols.forEach(([h, cx]) => text(h, cx, ty, { size: 14, w: 700, ls: 2, alpha: .55 }));
    hline(L, R, ty + 14, 'rgba(248,249,250,.4)');
    Rr.rows.forEach((t0, i) => {
      const y = ty + 26 + i * 36, p = E_IO(pr(t, t0, .35));
      [[L, 360], [520, 130], [690, 150], [880, 80]].forEach(([cx, w]) => { ctx.fillStyle = 'rgba(248,249,250,.12)'; ctx.fillRect(cx, y, w, 16); ctx.fillStyle = 'rgba(248,249,250,.7)'; ctx.fillRect(cx, y, w * p * (.6 + .4 * ((cx * 7 + i * 13) % 10) / 10), 16); });
      hline(L, R, y + 27, 'rgba(248,249,250,.1)');
    });
    text('* SESUAI AKTA LAHIR / IJAZAH TERAKHIR — DASAR PENCETAKAN SERTIFIKAT', L, ty + 150, { size: 14, w: 600, ls: 1, color: GOLD });
    ctx.restore();
  }
  // pasfoto
  const py = 1250, photo = (x, y, bg, t0) => {
    const p = E_OUT(pr(t, t0, .35)); if (p <= 0) return; const w = 84, h = 112;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, (1 - p) * 30);
    ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(248,249,250,.9)';
    ctx.beginPath(); ctx.arc(x + w / 2, y + 42, 17, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + w / 2, y + h + 4, 34, 40, 0, Math.PI, 0); ctx.fill();
    strokeR(x, y, w, h, 'rgba(248,249,250,.5)'); ctx.restore();
  };
  if (t > Rr.photos[0] - .1) {
    text('PASFOTO 3×4 · MAKS. 2 MB / FOTO', L, py - 24, { size: 15, w: 700, ls: 2, alpha: .6 });
    [0, 1, 2].forEach(i => photo(L + i * 98, py, PHOTO_RED, Rr.photos[0] + i * .06));
    [0, 1, 2].forEach(i => photo(560 + i * 98, py, PHOTO_BLUE, Rr.photos[1] + i * .06));
    reveal('MERAH · SD/MI', L, py + 144, { size: 20, w: 700, ls: 2 }, t, Rr.photos[0] + .2, .4);
    reveal('BIRU · SMP/MTs', 560, py + 144, { size: 20, w: 700, ls: 2 }, t, Rr.photos[1] + .2, .4);
  }
  // notice
  const np = E_IO(pr(t, Rr.notice, .3));
  if (np > 0) {
    const y = 1432; ctx.fillStyle = 'rgba(212,175,55,.12)'; ctx.fillRect(L, y, CW * np, 92); ctx.fillStyle = GOLD; ctx.fillRect(L, y, 6, 92 * np);
    if (np > .6) { typeOn('REVISI PERSONEL S.D. SEBELUM TM · 9 JAN 2027', L + 24, y + 38, { size: 19, w: 700, ls: 1, color: GOLD }, t, Rr.notice + .15, 90); typeOn('WAJIB SESUAI SURAT TUGAS KEPALA SEKOLAH', L + 24, y + 72, { size: 16, w: 600, ls: 1, alpha: .75 }, t, Rr.notice + .4, 90); }
  }
}

// CTA -----------------------------------------------------------------------
function sCta(t) {
  const C = T.cta; ctx.fillStyle = OBS; ctx.fillRect(0, 0, W, H); guides(true);
  sceneLabel('REGISTRASI — lbb.tontimuallimin.com', t, C.l1);
  const s = fit('JANGAN TUNGGU', 'd', 900, CW), s2 = Math.min(s, fit('HARI TERAKHIR.', 'd', 900, CW));
  const y1 = 380 + s * CAP, y2 = y1 + 22 + s2 * CAP;
  reveal('JANGAN TUNGGU', L - 4, y1, { f: 'd', size: s, w: 900 }, t, C.l1);
  reveal('HARI TERAKHIR', L - 4, y2, { f: 'd', size: s2, w: 900 }, t, C.l2);
  if (t > C.l2 + .3) text('.', L - 4 + measure('HARI TERAKHIR', 'd', s2, 900, -s2 * .02), y2, { f: 'd', size: s2, w: 900, color: GOLD });
  const bp = E_IO(pr(t, C.bar, .3)), by = y2 + 40;
  if (bp > 0) { ctx.fillStyle = CRIMSON; ctx.fillRect(0, by, W * bp, 66); if (bp > .6) typeOn('KUOTA 36 PELETON AKAN SEGERA TERKUNCI.', L, by + 43, { size: 24, w: 700, ls: 1 }, t, C.bar + .1, 60); }
  // QR
  const M = window.QRM, n = M.length, S = 330, pad = 24, box = S + pad * 2, bx = 540 - box / 2, qy = by + 120;
  if (t > C.qr[0]) {
    ctx.fillStyle = WHITE; ctx.fillRect(bx, qy, box, box);
    const rows = Math.floor(n * pr(t, C.qr[0], C.qr[1] - C.qr[0])), ms = S / n; ctx.fillStyle = OBS;
    for (let r = 0; r < rows; r++) for (let c = 0; c < n; c++) if (M[r][c] === '1') ctx.fillRect(Math.floor(bx + pad + c * ms), Math.floor(qy + pad + r * ms), Math.ceil(ms), Math.ceil(ms));
    if (rows < n) hline(bx, bx + box, qy + pad + rows * ms, GOLD, 1, 2);
    const lp = E_OUT(pr(t, C.lock - .2, .3)), off = 22 + (1 - lp) * 60;
    if (lp > 0) { ctx.save(); ctx.globalAlpha = lp; brackets(bx - off, qy - off, box + off * 2, box + off * 2, 46, WHITE, 3); ctx.restore(); }
  }
  if (t > C.scan) typeOn('SCAN & DAFTARKAN PELETONMU SEKARANG!', 540 - measure('SCAN & DAFTARKAN PELETONMU SEKARANG!', 'm', 22, 800, 1) / 2, qy + box + 66, { size: 22, w: 800, ls: 1, color: GOLD }, t, C.scan, 60);
  const ry = qy + box + 150;
  [['WEB', 'lbb.tontimuallimin.com'], ['WHATSAPP', '0819-4749-1505'], ['INSTAGRAM', '@lbbmuin']].forEach(([k, v], i) => {
    const t0 = C.rows[i], y = ry + i * 64;
    hline(L, R, y - 40, 'rgba(248,249,250,.3)', E_LINE(pr(t, t0 - .1, .45)));
    typeOn(k, L, y, { size: 16, w: 700, ls: 3, color: GOLD }, t, t0);
    reveal(v, L + 220, y + 2, { size: 32, w: 600, ls: 0 }, t, t0 + .05, .45);
    if (i === 2) hline(L, R, y + 24, 'rgba(248,249,250,.3)', E_LINE(pr(t, t0, .45)));
  });
}

/* ================= MASTER ================= */
const SCENES = [sHook, sPortal, sAkun, sBayar, sPakta, sRoster, sCta];
const THEME = ['d', 'd', 'l', 'd', 'l', 'd', 'd'];
const LABELS = ['00 / INTRO', '01 / AKSES', '02–03 / DATA', '04 / BAYAR', '05 / VERIFIKASI', 'DASHBOARD', 'DAFTAR'];
const sceneIndex = t => { let k = 0; T.cuts.forEach((c, i) => { if (t >= c) k = i + 1; }); return k; };
const COLS = 6, CWID = W / COLS;
const colP = (t, tb, i, lag) => E_IO(pr(t, tb + i * .03 + lag, .28));
function hud(t, k) {
  const dark = THEME[k] !== 'l', c = dark ? WHITE : OBS;
  text("LBB MU'ALLIMIN — 2027", L, 236, { size: 18, w: 600, ls: 2, color: c, alpha: .8 });
  const tc = '00:' + ('0' + Math.floor(t)).slice(-2) + '.' + Math.floor((t % 1) * 10);
  text(`${LABELS[k]}   ${tc}`, R, 236, { size: 18, w: 500, ls: 2, color: c, alpha: .8, align: 'right' });
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
    for (let i = 0; i < COLS; i++) { const p = colP(t, tb, i, 0), top = i % 2 === 0; if (p <= 0) continue; ctx.fillStyle = CRIMSON; ctx.fillRect(Math.floor(i * CWID), top ? 0 : H * (1 - p), Math.ceil(CWID) + 1, H * p); }
    ctx.save(); ctx.beginPath(); let any = false;
    for (let i = 0; i < COLS; i++) { const p = colP(t, tb, i, .08), top = i % 2 === 0; if (p <= 0) continue; any = true; ctx.rect(Math.floor(i * CWID), top ? 0 : H * (1 - p), Math.ceil(CWID) + 1, H * p); }
    if (any) { ctx.clip(); SCENES[k](t); } ctx.restore();
  }
  hud(t, inTr && t < tb + .3 ? k - 1 : k);
  if (grain) { ctx.save(); ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fo = pr(t, T.dur - .45, .45); if (fo > 0) { ctx.fillStyle = `rgba(15,15,15,${fo})`; ctx.fillRect(0, 0, W, H); }
};
