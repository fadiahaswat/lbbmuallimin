// Deterministic canvas renderer: renderFrame(t) draws the entire promo at time t (seconds).
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const FONT = 'Bahnschrift, "Arial Narrow", Impact, sans-serif';
const GOLD = '#fbbf24', MAROON = '#7a0f0f';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, d) => clamp((t - a) / d);
const eOut = x => 1 - Math.pow(1 - x, 3);
const eExpo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const eBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const lerp = (a, b, x) => a + (b - a) * x;
const R = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const IMG = {};
const loadImg = (k, src) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.src = src; });
window.ready = Promise.all([
  loadImg('logo', 'assets/logo.png'), loadImg('tonti', 'assets/tonti.png'),
  loadImg('mangan', 'assets/mangan.png'), loadImg('muallimin', 'assets/muallimin-white.png'),
  document.fonts ? document.fonts.load('700 40px Bahnschrift') : Promise.resolve(),
]);

/* ---------- text helpers ---------- */
function setFont(size, o) {
  ctx.font = `${o.weight || 700} ${size}px ${FONT}`;
  ctx.fontStretch = o.stretch || 'condensed';
  ctx.letterSpacing = (o.ls || 0) + 'px';
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
}
function goldGrad(y, size) {
  const g = ctx.createLinearGradient(0, y - size * .5, 0, y + size * .5);
  g.addColorStop(0, '#fff7c2'); g.addColorStop(.45, '#fbbf24'); g.addColorStop(1, '#d97706'); return g;
}
function txtRaw(s, x, y, size, o) {
  setFont(size, o);
  if (o.drop) { ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillText(s, x + o.drop * .5, y + o.drop); }
  ctx.save();
  if (o.glow) { ctx.shadowColor = o.glowColor || GOLD; ctx.shadowBlur = o.glow; }
  if (o.stroke) { ctx.lineWidth = o.strokeW || 6; ctx.strokeStyle = o.stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.gold ? goldGrad(y, size) : (o.color || '#fff'); ctx.fillText(s, x, y);
  ctx.restore();
}
function txt(s, x, y, size, o = {}) {
  ctx.save(); setFont(size, o);
  const w = ctx.measureText(s).width, f = o.maxW ? Math.min(1, o.maxW / w) : 1;
  ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  const sc = o.sc || 1; ctx.scale(sc * f, sc); ctx.globalAlpha *= (o.alpha ?? 1);
  txtRaw(s, 0, 0, size, o); ctx.restore();
}
function kin(s, x, y, size, t, t0, o = {}) {
  ctx.save(); setFont(size, o);
  const w = ctx.measureText(s).width, f = o.maxW ? Math.min(1, o.maxW / w) : 1;
  ctx.translate(x, y); ctx.scale(f, 1);
  for (let i = 0; i < s.length; i++) {
    const p = pr(t, t0 + i * (o.stag ?? .03), o.dur ?? .38); if (p <= 0) continue;
    const e = eOut(p), pre = ctx.measureText(s.slice(0, i)).width, cw = ctx.measureText(s[i]).width;
    ctx.save(); ctx.translate(-w / 2 + pre + cw / 2, (1 - e) * (o.dy ?? -160));
    const sc = 1 + (1 - e) * (o.sc ?? 1.2); ctx.scale(sc, sc); ctx.rotate((1 - e) * (o.rot ?? .2) * (i % 2 ? 1 : -1));
    ctx.globalAlpha *= clamp(p * 5); txtRaw(s[i], 0, 0, size, { ...o, align: 'center' }); ctx.restore();
  }
  ctx.restore();
}
function glass(x, y, w, h, r, t, o = {}) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  const g = ctx.createLinearGradient(x, y, x + w * .3, y + h);
  g.addColorStop(0, `rgba(255,255,255,${o.a1 ?? .24})`); g.addColorStop(1, `rgba(255,255,255,${o.a2 ?? .06})`);
  ctx.fillStyle = g; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = o.lw || 2; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.4)'; ctx.stroke();
  ctx.clip();
  const sx = x + ((t * .5) % 1.6 - .3) * (w + h);
  const sg = ctx.createLinearGradient(sx - 80, y, sx + 80, y + h * .6);
  sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.14)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w, h); ctx.restore();
}
function withTilt(cx, cy, ry, rx, fn) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.transform(Math.cos(ry), -Math.sin(ry) * .12, Math.sin(rx) * .1, Math.cos(rx), 0, 0); fn(); ctx.restore();
}
function chip(s, x, y, t, t0, o = {}) {
  const p = pr(t, t0, .4); if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); const sc = eBack(p); ctx.scale(sc, sc); ctx.globalAlpha = clamp(p * 4);
  setFont(o.size || 34, { ls: 4 }); const w = ctx.measureText(s).width + (o.dot ? 90 : 60), h = 62;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 31);
  ctx.fillStyle = o.bg || 'rgba(0,0,0,.4)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = o.stroke || GOLD; ctx.stroke();
  if (o.dot) { ctx.fillStyle = Math.sin(t * 14) > 0 ? '#ff3b3b' : '#7a1b1b'; ctx.beginPath(); ctx.arc(-w / 2 + 36, 0, 10, 0, 7); ctx.fill(); }
  txtRaw(s, o.dot ? 22 : 0, 2, o.size || 34, { ls: 4, color: o.color || '#fff' }); ctx.restore();
}
function star(cx, cy, r, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  ctx.closePath();
}
const lastBefore = (arr, t) => { let v = -99; for (const a of arr) if (a <= t) v = a; return v; };

/* ---------- background / fx ---------- */
function bg(t) {
  const pu = Math.exp(-((t / .5) % 1) * 5);
  const g = ctx.createRadialGradient(540, 760, 50, 540, 900, 1300);
  g.addColorStop(0, '#a81818'); g.addColorStop(.45, MAROON); g.addColorStop(1, '#260303');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 760); ctx.rotate(t * .08);
  for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(2400, -230); ctx.lineTo(2400, 230); ctx.fillStyle = `rgba(251,191,36,${.035 + .02 * pu})`; ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 2;
  const off = (t * 60) % 120;
  for (let i = -20; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 120 + off, 0); ctx.lineTo(i * 120 + off - 900, H); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = .09 * pu; ctx.fillStyle = GOLD; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function dust(t, n = 60) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const sp = 40 + R(i + 9) * 140, y = H - ((t * sp + R(i + 3) * H) % (H + 60)), x = R(i) * W + Math.sin(t * .8 + i) * 30;
    const s = 1.5 + R(i + 7) * 3.5; ctx.globalAlpha = (.2 + .5 * Math.abs(Math.sin(t * 3 + i))) * .8;
    ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function sparks(t, t0, cx, cy, n, speed, life = 1.3) {
  const tt = t - t0; if (tt < 0 || tt > life) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const a = R(i * 3.1 + t0) * Math.PI * 2, sp = speed * (.35 + R(i + 50) * .8);
    const x = cx + Math.cos(a) * sp * tt * (1 - tt * .25), y = cy + Math.sin(a) * sp * tt + 260 * tt * tt;
    ctx.globalAlpha = (1 - tt / life) * .95; ctx.fillStyle = i % 3 ? GOLD : '#fff';
    ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, y, 2 + R(i + 9) * 4 * (1 - tt / life), 0, 7); ctx.fill();
  }
  ctx.restore();
}
function ring(t, t0, cx, cy, maxR = 900, col = GOLD) {
  const p = pr(t, t0, .7); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - p; ctx.strokeStyle = col; ctx.lineWidth = 18 * (1 - p) + 2;
  ctx.beginPath(); ctx.arc(cx, cy, maxR * eOut(p), 0, 7); ctx.stroke(); ctx.restore();
}
function speedLines(t, t0, cy, spread = 200) {
  const tt = t - t0; if (tt < 0 || tt > .3) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) {
    const y = cy + (R(i + t0 * 7) - .5) * spread * 2, len = 300 + R(i + 4) * 600, dir = i % 2 ? 1 : -1;
    const x = (dir > 0 ? -len : W) + dir * tt * 5000 * (.6 + R(i + 2)), p = tt / .3;
    ctx.globalAlpha = (1 - p) * .8; ctx.fillStyle = i % 3 ? GOLD : '#fff'; ctx.fillRect(x, y, len, 4 + R(i) * 5);
  }
  ctx.restore();
}
function drawLogo(h, glow, sc = 1) {
  const im = IMG.logo, w = h * im.width / im.height; ctx.save();
  if (glow) { ctx.shadowColor = GOLD; ctx.shadowBlur = glow; }
  ctx.scale(sc, sc); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
}
function hud(t) {
  if (t < 5) return;
  ctx.save(); ctx.globalAlpha = .85;
  txt("LBB MU'ALLIMIN 2027", 70, 150, 30, { align: 'left', ls: 5 });
  txt('SD/MI • SMP/MTs', 1010, 150, 30, { align: 'right', ls: 3, color: GOLD });
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(70, 180, 940, 6);
  ctx.fillStyle = GOLD; ctx.fillRect(70, 180, 940 * t / T.dur, 6); ctx.restore();
}

/* ---------- scene: hook (0-2) ---------- */
function sceneHook(t) {
  const words = [['SIAPKAN', 600, 230, '#fff'], ['PELETON', 860, 260, 'gold'], ['TERBAIKMU!', 1120, 215, '#fff']];
  const z = 1 + .55 * eIO(pr(t, 1.55, .45));
  ctx.save(); ctx.translate(540, 860); ctx.scale(z, z); ctx.translate(-540, -860);
  ctx.globalAlpha = 1 - pr(t, 1.85, .15);
  words.forEach(([s, y, size, c], i) => {
    const t0 = T.hookWords[i]; if (t < t0) return;
    const o = c === 'gold' ? { gold: true, glow: 40, drop: 10 } : { color: '#fff', drop: 10, stroke: i == 2 ? MAROON : undefined, strokeW: 10 };
    kin(s, 540, y, size, t, t0, { ...o, maxW: 940, weight: 800 });
    speedLines(t, t0 + .05, y);
  });
  if (t > 1.2) txt('SD/MI • SMP/MTs • SE-DIY', 540, 1290, 44, { ls: 6, color: GOLD, sc: eBack(pr(t, 1.2, .3)) });
  ctx.restore();
  T.hookWords.forEach(w => { if (t > w && t < w + .25) { ctx.save(); ctx.globalAlpha = .3 * (1 - (t - w) / .25); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); } });
}

/* ---------- scene: logo fast cuts (2-5) ---------- */
function sceneLogo(t) {
  const shots = [
    { a: 2.0, f: [.5, .5], k: 1, rot: -.1 }, { a: 2.5, f: [.5, .3], k: 1.9, rot: .05 },
    { a: 3.0, f: [.5, .62], k: 1.75, rot: -.06 }, { a: 3.5, f: [.5, .79], k: 2.1, rot: .05 },
    { a: 4.0, f: [.5, .5], k: 1, rot: 0 },
  ];
  let si = 0; shots.forEach((s, i) => { if (t >= s.a) si = i; });
  const s = shots[si], lt = t - s.a, h = 800, w = h * IMG.logo.width / IMG.logo.height;
  const slam = si === 0 || si === 4 ? 1 + 2.2 * (1 - eExpo(pr(lt, 0, .35))) : 1;
  const push = 1 + .07 * pr(lt, 0, .5), float = si === 4 ? Math.sin(t * 3) * 10 : 0;
  ctx.save(); ctx.translate(540, 840 + float); ctx.rotate(s.rot * (1 - pr(lt, 0, .4) * (si === 4 ? 1 : .4)));
  ctx.scale(s.k * slam * push, s.k * slam * push); ctx.translate(-(s.f[0] - .5) * w, -(s.f[1] - .5) * h);
  const pu = Math.exp(-((t / .5) % 1) * 5);
  drawLogo(h, 50 + 70 * pu); ctx.restore();
  // orbiting gold particles on final shot / all shots
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) {
    const a = t * (.8 + R(i) * .8) + R(i + 1) * 6.28, rr = 380 + R(i + 2) * 200, x = 540 + Math.cos(a) * rr * 1.1, y = 840 + Math.sin(a) * rr * .85;
    ctx.globalAlpha = .6; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(x, y, 2 + R(i + 3) * 4, 0, 7); ctx.fill();
  }
  ctx.restore();
  T.cuts.forEach(c => { sparks(t, c, 540, 840, c === 2 || c === 4 ? 90 : 45, 900); ring(t, c, 540, 840, c === 2 || c === 4 ? 1000 : 700); });
  const label = ['', 'LOMBA BARIS-BERBARIS', 'SD/MI & SMP/MTs', 'SE-DIY', 'LOMBA BARIS-BERBARIS'];
  if (si >= 1) kin(label[si], 540, 330, si === 4 ? 70 : 90, t, s.a + .02, { gold: true, drop: 6, maxW: 900, stag: .02, glow: 20 });
  if (si === 4) {
    ['SD/MI', 'SMP/MTs', 'SE-DIY'].forEach((c, i) => chip(c, 540 + (i - 1) * 270, 1380, t, 4.15 + i * .1, { size: 36, bg: 'rgba(0,0,0,.45)' }));
    txt('2027', 540, 1500, 1, { alpha: 0 });
  }
}

/* ---------- scene: quota (5-9) ---------- */
const ticks36 = T.tickTimes(T.Q36.n, T.Q36.t0, T.Q36.d).map(a => a.t);
const ticks18 = T.tickTimes(T.Q18.n, T.Q18.t0, T.Q18.d).map(a => a.t);
function sceneQuota(t) {
  const c36 = T.counter(T.Q36.n, T.Q36.t0, T.Q36.d)(t), c18 = T.counter(T.Q18.n, T.Q18.t0, T.Q18.d)(t);
  chip('KUOTA TERBATAS!', 540, 300, t, 5.05, { dot: true, size: 32 });
  kin('HANYA', 540, 470, 150, t, 5.2, { drop: 8, weight: 800 });
  const jt = Math.exp(-(t - lastBefore(ticks36, t)) * 25) * .05;
  if (t > 5.5) {
    const p = eBack(pr(t, 5.5, .4)), done = t > 7.1 ? 1 : 0, pu = Math.exp(-((t / .5) % 1) * 5);
    txt(String(c36), 540, 800, 470, { gold: true, glow: 50 + 40 * done * pu, drop: 14, sc: p * (1 + jt), weight: 800 });
  }
  kin('PELETON!', 540, 1030, 175, t, 7.15, { drop: 8, weight: 800, stroke: MAROON, strokeW: 8 });
  ring(t, 7.15, 540, 800, 900);
  sparks(t, 7.15, 540, 900, 70, 800);
  // 36 pips
  for (let i = 0; i < 36; i++) {
    const row = i < 18 ? 0 : 1, x = 540 + ((i % 18) - 8.5) * 46, y = 1125 + row * 48, on = i < c36;
    const age = t - (ticks36[i] ?? 99), pp = on ? 1 + .6 * Math.exp(-Math.max(0, age) * 12) : 1;
    ctx.save(); ctx.globalAlpha = pr(t, 5.5 + i * .01, .2);
    ctx.fillStyle = on ? (row ? '#fff' : GOLD) : 'rgba(255,255,255,.15)';
    if (on) { ctx.shadowColor = row ? '#fff' : GOLD; ctx.shadowBlur = 14; }
    ctx.beginPath(); ctx.arc(x, y, 15 * pp, 0, 7); ctx.fill(); ctx.restore();
  }
  // category cards
  [['SD/MI', 120, -1], ['SMP/MTs', 550, 1]].forEach(([lab, x, dir], i) => {
    const t0 = 7.5 + i * .15, p = pr(t, t0, .55); if (p <= 0) return;
    const e = eExpo(p), ry = dir * (1 - e) * .9 + dir * .08 * Math.sin(t * 1.6);
    ctx.save(); ctx.globalAlpha = clamp(p * 3);
    withTilt(x + 205 + dir * (1 - e) * 500, 1335, ry, 0, () => {
      glass(-205, -95, 410, 190, 28, t, { stroke: i ? 'rgba(255,255,255,.6)' : GOLD });
      txt(lab, -190, -52, 44, { align: 'left', ls: 3, color: i ? '#fff' : GOLD });
      txt(String(c18), -190, 20, 120, { align: 'left', gold: !i, color: '#fff', weight: 800 });
      txt('PELETON', 190, 52, 40, { align: 'right', ls: 3, alpha: .9 });
      const fillp = c18 / 18; ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-190, 78, 380, 8);
      ctx.fillStyle = i ? '#fff' : GOLD; ctx.fillRect(-190, 78, 380 * fillp, 8);
    });
    ctx.restore();
  });
}

/* ---------- scene: squad (9-14) ---------- */
const SQ = [];
SQ.push({ k: 'D', x: 380, y: 690, t0: T.sq.danton, i: 0 });
for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) { const i = r * 3 + c; SQ.push({ k: 'I', x: 260 + c * 120, y: 810 + r * 74, t0: T.sq.inti0 + i * T.sq.step, i: i + 1, r, c }); }
for (let i = 0; i < 3; i++) SQ.push({ k: 'C', x: 260 + i * 120, y: 1370, t0: T.sq.cad[i], i: 22 + i });
function sceneSquad(t) {
  chip('SUSUNAN PELETON', 540, 300, t, 9.05, { size: 32 });
  const landed = SQ.filter(d => t >= d.t0 + T.sq.land).length;
  const pp = eBack(pr(t, 9.2, .4)), pu = Math.exp(-((t / .5) % 1) * 5), all = t > 12.6 ? 1 : 0;
  txt(String(landed), 300, 485, 250, { gold: true, glow: 30 + 40 * all * pu, drop: 10, sc: pp, weight: 800 });
  txt('PERSONEL', 460, 450, 100, { align: 'left', drop: 6, sc: pp, weight: 800, maxW: 500 });
  txt('PER PELETON', 460, 530, 44, { align: 'left', ls: 4, color: GOLD, sc: pp });
  // connection lines
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2;
  const by = {}; SQ.forEach(d => by[d.r + ',' + d.c] = d);
  SQ.filter(d => d.k === 'I').forEach(d => {
    [[1, 0], [0, 1]].forEach(([dr, dc]) => { const n = by[(d.r + dr) + ',' + (d.c + dc)]; if (n && t > Math.max(d.t0, n.t0) + .4) { ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(n.x, n.y); ctx.stroke(); } });
  });
  const d0 = SQ[0]; if (t > d0.t0 + .4) SQ.filter(d => d.k === 'I' && d.r === 0).forEach(d => { ctx.beginPath(); ctx.moveTo(d0.x, d0.y); ctx.lineTo(d.x, d.y); ctx.stroke(); });
  ctx.restore();
  SQ.forEach(d => {
    const p = pr(t, d.t0, T.sq.land); if (p <= 0) return;
    const e = eExpo(p), sx = R(d.i * 3 + 1) * W, sy = R(d.i * 5 + 2) > .5 ? -150 : 1750;
    let x = lerp(sx, d.x, e), y = lerp(sy, d.y, e), sc = 1;
    if (p >= 1) {
      const age = t - d.t0 - T.sq.land;
      if (t > T.sq.ripple) { const dist = Math.hypot(d.x - 380, d.y - 690); sc += .35 * Math.max(0, Math.sin((t - T.sq.ripple) * 12.57 - dist * .012)) * Math.min(1, (t - T.sq.ripple)); }
      sc += .8 * Math.exp(-age * 10);
      ctx.save(); ctx.globalAlpha = Math.exp(-age * 5) * .8; ctx.strokeStyle = d.k === 'D' ? GOLD : '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(d.x, d.y, 20 + age * 140, 0, 7); ctx.stroke(); ctx.restore();
    } else { ctx.save(); ctx.globalAlpha = .3 * (1 - e); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(sx, d.x, Math.max(0, e - .25)), lerp(sy, d.y, Math.max(0, e - .25))); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    if (d.k === 'D') {
      ctx.shadowColor = GOLD; ctx.shadowBlur = 36; ctx.fillStyle = goldGrad(0, 70); ctx.beginPath(); ctx.arc(0, 0, 32, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.setLineDash([10, 12]); ctx.rotate(t * 1.5); ctx.beginPath(); ctx.arc(0, 0, 52, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.rotate(-t * 1.5);
      ctx.fillStyle = MAROON; star(0, 0, 18); ctx.fill();
    } else if (d.k === 'I') {
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 16; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.setLineDash([7, 7]); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  });
  // labels
  const lab = (t0, y, big, l1, l2, col) => {
    const p = pr(t, t0, .45); if (p <= 0) return; const e = eExpo(p);
    ctx.save(); ctx.globalAlpha = clamp(p * 3); ctx.translate((1 - e) * 120, 0);
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(570, y); ctx.lineTo(620, y); ctx.stroke();
    txt(big, 640, y, 130, { align: 'left', gold: col === GOLD, color: '#fff', weight: 800, drop: 6 });
    const bw = String(big).length * 62 + 20;
    txt(l1, 640 + bw, y - 24, 40, { align: 'left', ls: 2, maxW: 960 - 640 - bw });
    txt(l2, 640 + bw, y + 22, 34, { align: 'left', ls: 2, color: col, maxW: 960 - 640 - bw });
    ctx.restore();
  };
  lab(T.sq.danton + .1, 690, '1', 'DANTON', 'KOMANDAN', GOLD);
  lab(T.sq.inti0 + 1.0, 1000, '21', 'PELETON INTI', 'FORMASI 3×7', '#fff');
  lab(T.sq.cad[0] + .1, 1370, '3', 'PELETON', 'CADANGAN', 'rgba(255,255,255,.8)');
  if (t > 12.6) { ring(t, 12.6, 380, 900, 800); sparks(t, 12.6, 380, 900, 60, 700); }
}

/* ---------- scene: judges (14-19) ---------- */
const ticks100 = T.tickTimes(T.J100.n, T.J100.t0, T.J100.d).map(a => a.t);
function sceneJuri(t) {
  chip('KREDIBILITAS', 540, 300, t, 14.05, { size: 32 });
  // medallion
  const mp = pr(t, T.juri.medal, .6);
  if (mp > 0) {
    ctx.save(); ctx.translate(540, 590); const sc = eBack(mp); ctx.scale(sc, sc);
    ctx.shadowColor = GOLD; ctx.shadowBlur = 50; ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.setLineDash([60, 24]); ctx.rotate(t * .9); ctx.beginPath(); ctx.arc(0, 0, 185, 0, 7); ctx.stroke(); ctx.rotate(-t * .9);
    ctx.setLineDash([]); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 165, 0, 7); ctx.stroke();
    const im = IMG.mangan, hh = 250, ww = hh * im.width / im.height; ctx.drawImage(im, -ww / 2, -hh / 2, ww, hh); ctx.restore();
  }
  kin('DEWAN JURI', 540, 905, 165, t, T.juri.title, { gold: true, drop: 8, glow: 24, maxW: 900, weight: 800 });
  // badges
  const badge = (label, cx, t0, gold, ic) => {
    const p = pr(t, t0, .5); if (p <= 0) return; const e = eBack(p);
    ctx.save(); ctx.translate(cx, 1035); ctx.scale(e, e); ctx.rotate((1 - p) * -.3); ctx.globalAlpha = clamp(p * 3);
    ctx.shadowColor = gold ? GOLD : '#fff'; ctx.shadowBlur = 26; ctx.beginPath(); ctx.roundRect(-190, -52, 380, 104, 52);
    ctx.fillStyle = gold ? goldGrad(0, 104) : '#fff'; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = MAROON;
    if (ic) { star(-135, 0, 24); ctx.fill(); } else { ctx.beginPath(); ctx.arc(-135, 0, 24, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-146, 0); ctx.lineTo(-136, 10); ctx.lineTo(-122, -9); ctx.stroke(); }
    txt(label, 45, 3, 50, { color: MAROON, ls: 2, weight: 800, maxW: 245 }); ctx.restore();
  };
  badge('TNI / POLRI', 320, T.juri.badges[0], true, true);
  if (t > T.juri.badges[1]) txt('&', 540, 1035, 70, { gold: true, sc: eBack(pr(t, T.juri.badges[1], .3)) });
  badge('PROFESSIONAL', 760, T.juri.badges[1], false, false);
  // scoring panel
  const pp = pr(t, T.juri.panel, .5);
  if (pp > 0) {
    const c = T.counter(T.J100.n, T.J100.t0, T.J100.d)(t), e = eExpo(pp);
    ctx.save(); ctx.globalAlpha = clamp(pp * 3); ctx.translate(0, (1 - e) * 200);
    glass(120, 1150, 840, 330, 36, t, { stroke: GOLD });
    txt(c + '%', 330, 1265, 175, { gold: true, glow: 20, weight: 800, maxW: 380, drop: 6 });
    txt('REALTIME', 700, 1230, 64, { ls: 3, weight: 800 }); txt('DIGITAL SCORING', 700, 1295, 52, { ls: 2, color: GOLD, maxW: 400 });
    ctx.fillStyle = Math.sin(t * 12) > 0 ? '#ff3b3b' : '#7a1b1b'; ctx.beginPath(); ctx.arc(840, 1190, 9, 0, 7); ctx.fill(); txt('LIVE', 910, 1191, 26, { ls: 3 });
    for (let i = 0; i < 28; i++) {
      const hgt = 14 + 70 * Math.abs(Math.sin(t * 4 + i * .7) * Math.cos(t * 2.3 + i * .35)) * (t > T.J100.t0 ? 1 : .2);
      ctx.fillStyle = i % 4 === 0 ? GOLD : 'rgba(255,255,255,.7)'; ctx.fillRect(160 + i * 27.5, 1450 - hgt, 16, hgt);
    }
    ctx.restore();
  }
}

/* ---------- scene: trophy (19-26) ---------- */
function drawTrophy(h, t) {
  const u = h / 100; ctx.save(); ctx.translate(0, -h / 2); ctx.scale(u, u);
  const g = ctx.createLinearGradient(-35, 0, 35, 0);
  g.addColorStop(0, '#b45309'); g.addColorStop(.3, '#fde68a'); g.addColorStop(.55, '#fbbf24'); g.addColorStop(1, '#92400e');
  ctx.fillStyle = g; ctx.strokeStyle = g; ctx.shadowColor = GOLD; ctx.shadowBlur = 30;
  ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-31, 26, 14, Math.PI * .5, Math.PI * 1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(31, 26, 14, -Math.PI * .5, Math.PI * .5); ctx.stroke();
  const cup = new Path2D(); cup.moveTo(-32, 8); cup.lineTo(32, 8); cup.bezierCurveTo(32, 46, 18, 64, 6, 70); cup.lineTo(-6, 70); cup.bezierCurveTo(-18, 64, -32, 46, -32, 8); cup.closePath();
  ctx.fill(cup); ctx.shadowBlur = 0;
  ctx.fillRect(-6, 68, 12, 14); ctx.beginPath(); ctx.roundRect(-18, 80, 36, 8, 3); ctx.fill(); ctx.beginPath(); ctx.roundRect(-26, 87, 52, 11, 4); ctx.fill();
  ctx.save(); ctx.clip(cup); const sx = -80 + ((t * .6) % 1.5) * 140;
  const sg = ctx.createLinearGradient(sx - 14, 0, sx + 14, 40); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.75)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sg; ctx.fillRect(-40, 0, 80, 80); ctx.restore();
  ctx.fillStyle = MAROON; star(0, 36, 14); ctx.fill(); ctx.restore();
}
function sceneTrophy(t) {
  const tp = pr(t, T.trophy.show, .7);
  chip('PEREBUTAN', 540, 300, t, 19.05, { size: 32 });
  if (tp > 0) {
    ctx.save(); ctx.translate(540, 500); ctx.globalAlpha = clamp(tp * 3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.rotate(t * .4);
    for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(500, -45); ctx.lineTo(500, 45); ctx.fillStyle = 'rgba(251,191,36,.13)'; ctx.fill(); }
    ctx.restore();
    const sc = eBack(tp) * (1 + .02 * Math.sin(t * 3)); ctx.scale(sc, sc); ctx.rotate((1 - tp) * .6); drawTrophy(300, t); ctx.restore();
    sparks(t, T.trophy.show + .3, 540, 470, 60, 600);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) { const a = Math.sin(t * 5 + i * 2) * .5 + .5, x = 540 + (R(i + 4) - .5) * 300, y = 360 + R(i + 8) * 250; ctx.globalAlpha = a; ctx.fillStyle = '#fff'; star(x, y, 10 + a * 12, t); ctx.fill(); }
    ctx.restore();
  }
  kin('PIALA BERGILIR', 540, 700, 95, t, T.trophy.title, { drop: 6, weight: 800, maxW: 900 });
  kin('GUBERNUR', 540, 795, 120, t, T.trophy.title + .2, { gold: true, drop: 6, glow: 20, weight: 800, maxW: 900 });
  [['SD/MI', 120, -1], ['SMP/MTs', 550, 1]].forEach(([lab, x, dir], i) => {
    const p = pr(t, T.trophy.cards[i], .55); if (p <= 0) return; const e = eExpo(p);
    ctx.save(); ctx.globalAlpha = clamp(p * 3);
    withTilt(x + 205, 925 + (1 - e) * 120, dir * (1 - e) * 1.0 - dir * .1 * Math.sin(t * 1.5), (1 - e) * .5, () => {
      glass(-205, -75, 410, 150, 26, t, { stroke: GOLD, a1: .3 });
      txt('JUARA UMUM', 0, -40, 36, { ls: 5, color: GOLD });
      txt(lab, 0, 22, 82, { weight: 800, drop: 5, maxW: 370 });
    });
    ctx.restore();
  });
  // Juara Peleton panel
  const bp = pr(t, T.trophy.bars[0], .5);
  if (bp > 0) {
    const e = eExpo(bp); ctx.save(); ctx.globalAlpha = clamp(bp * 3); ctx.translate((1 - e) * -700, 0);
    glass(120, 1030, 840, 250, 28, t, { stroke: GOLD });
    txt('JUARA PELETON', 540, 1072, 48, { gold: true, ls: 4, weight: 800 });
    ['JUARA 1', 'JUARA 2', 'JUARA 3', 'HARAPAN 1', 'HARAPAN 2', 'HARAPAN 3'].forEach((l, i) => {
      const x = 150 + (i % 3) * 270 + 120, y = 1150 + Math.floor(i / 3) * 78, p = pr(t, T.trophy.bars[0] + .25 + i * .1, .35);
      if (p <= 0) return; const s = eBack(p);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.roundRect(-120, -32, 240, 64, 32);
      ctx.fillStyle = i < 3 ? goldGrad(0, 64) : 'rgba(255,255,255,.9)'; ctx.fill();
      txt(l, 0, 3, 36, { color: MAROON, ls: 2, weight: 800 }); ctx.restore();
    });
    ctx.restore();
  }
  const dp = pr(t, T.trophy.bars[1], .5);
  if (dp > 0) {
    const e = eExpo(dp); ctx.save(); ctx.globalAlpha = clamp(dp * 3); ctx.translate((1 - e) * 700, 0);
    glass(120, 1310, 840, 130, 28, t, { stroke: 'rgba(255,255,255,.6)' });
    [['#fbbf24', '1'], ['#e5e7eb', '2'], ['#d9904f', '3']].forEach(([c, n], i) => {
      const x = 190 + i * 80, hop = Math.max(0, Math.sin((t - T.trophy.bars[1] - .3 - i * .12) * 9)) * (t < T.trophy.bars[1] + .9 ? 14 : 0);
      ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 18; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 1375 - hop, 32, 0, 7); ctx.fill(); ctx.restore();
      txt(n, x, 1378 - hop, 40, { color: MAROON, weight: 800 });
    });
    txt('JUARA DANTON 1, 2, & 3', 440, 1377, 52, { align: 'left', weight: 800, maxW: 500 });
    ctx.restore();
  }
}

/* ---------- scene: price (26-31.5) ---------- */
function priceText(x, y, t, big) {
  const s1 = 'Rp 350.', s2 = '108', s3 = ',-';
  ctx.save(); const o = { align: 'left', weight: 800 }; setFont(big, o);
  const w1 = ctx.measureText(s1).width, w2 = ctx.measureText(s2).width;
  return { w1, w2, draw: (a, b, cc) => { } };
}
function voucher(t, cx, cy, price, lab, d1, d2, d3, light) {
  const w = 840, h = 300, x = -w / 2, y = -h / 2, nx = x + w * .68;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 28); ctx.moveTo(nx + 26, y); ctx.arc(nx, y, 26, 0, 7); ctx.moveTo(nx + 26, y + h); ctx.arc(nx, y + h, 26, 0, 7);
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  if (light) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ece6dc'); } else { g.addColorStop(0, '#fff1b8'); g.addColorStop(.5, '#fbbf24'); g.addColorStop(1, '#e8960c'); }
  ctx.fillStyle = g; ctx.fill('evenodd'); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(122,15,15,.45)'; ctx.lineWidth = 3; ctx.setLineDash([12, 12]); ctx.beginPath(); ctx.moveTo(nx, y + 30); ctx.lineTo(nx, y + h - 30); ctx.stroke(); ctx.restore();
  // label chip
  ctx.beginPath(); ctx.roundRect(x + 36, y + 32, 240, 62, 31); ctx.fillStyle = MAROON; ctx.fill();
  txt(lab, x + 156, y + 64, 40, { ls: 5, weight: 800, color: light ? GOLD : '#fff' });
  // price with highlighted 108
  const big = 104, parts = [['Rp ', 0], [price.slice(0, -3), 0], ['108', 1], [',-', 0]];
  ctx.save(); setFont(big, { align: 'left', weight: 800 });
  let tw = 0; parts.forEach(p => tw += ctx.measureText(p[0]).width); const f = Math.min(1, 520 / tw);
  ctx.translate(x + 36, y + 190); ctx.scale(f, 1); let px = 0;
  parts.forEach(([s, hl]) => {
    const pw = ctx.measureText(s).width; if (hl) px += 10;
    if (hl) { const pu = .6 + .4 * Math.sin(t * 6); ctx.fillStyle = MAROON; ctx.beginPath(); ctx.roundRect(px - 8, -62, pw + 16, 112, 16); ctx.fill(); ctx.save(); ctx.shadowColor = GOLD; ctx.shadowBlur = 30 * pu; setFont(big, { align: 'left', weight: 800 }); ctx.fillStyle = GOLD; ctx.fillText(s, px, 0); ctx.restore(); }
    else { setFont(big, { align: 'left', weight: 800 }); ctx.fillStyle = MAROON; ctx.fillText(s, px, 0); }
    px += pw + (hl ? 18 : 0);
  });
  ctx.restore();
  txt('+ KODE UNIK 108', x + 36 + 0, y + 262, 30, { align: 'left', ls: 4, color: MAROON, alpha: .8 });
  // stub
  txt('PERIODE', nx + (w - (nx - x)) / 2 - 0, y + 50, 28, { ls: 5, color: MAROON, alpha: .7 });
  txt(d1, nx + 135, y + 110, 62, { color: MAROON, weight: 800 }); txt('s.d.', nx + 135, y + 160, 30, { color: MAROON, alpha: .7 });
  txt(d2, nx + 135, y + 210, 62, { color: MAROON, weight: 800 }); txt(d3, nx + 135, y + 262, 26, { color: MAROON, ls: 3, alpha: .7 });
}
function scenePrice(t) {
  chip('PENDAFTARAN', 540, 300, t, 26.05, { size: 32 });
  kin('PILIH GELOMBANGMU', 540, 380, 84, t, 26.1, { gold: true, drop: 6, maxW: 900, weight: 800, stag: .02 });
  [['350.108', 'PRESALE', '26 OKT', '8 NOV', '2026', true, 600, -1], ['400.108', 'WAVE 2', '9 NOV', '22 NOV', '2026', false, 960, 1]].forEach(([p, lab, d1, d2, yr, light, y, dir], i) => {
    const p0 = T.price.cards[i], pp = pr(t, p0, .6); if (pp <= 0) return; const e = eExpo(pp);
    withTilt(540 + dir * (1 - e) * 900, y, dir * (1 - e) * 1.0 + dir * .07 * Math.sin(t * 1.7), -.04 * Math.sin(t * 1.3), () => voucher(t, 0, 0, `Rp ${p}`.replace('Rp ', ''), lab, d1, d2, '', light));
  });
  // fix: voucher price strings are rendered with 'Rp ' prefix inside; stamp below
  const sp = pr(t, T.price.stamp, .55);
  if (sp > 0) {
    const s = eBack(sp);
    ctx.save(); ctx.translate(260, 1330); ctx.scale(s, s); ctx.rotate((1 - sp) * -1.2);
    ctx.shadowColor = GOLD; ctx.shadowBlur = 50; const rg = ctx.createRadialGradient(-20, -20, 10, 0, 0, 120); rg.addColorStop(0, '#fff3b0'); rg.addColorStop(1, '#e8960c');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, 112, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = MAROON; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.rotate(t * .8); ctx.beginPath(); ctx.arc(0, 0, 96, 0, 7); ctx.stroke(); ctx.restore();
    txt('108', 260, 1335, 128, { color: MAROON, weight: 800, sc: s * (1 + .04 * Math.exp(-((t / .5) % 1) * 5)) });
    ring(t, T.price.stamp, 260, 1330, 700); sparks(t, T.price.stamp, 260, 1330, 70, 700);
    kin('KODE UNIK', 640, 1280, 92, t, T.price.stamp + .35, { drop: 6, weight: 800, maxW: 560 });
    kin('WAJIB!', 640, 1385, 110, t, T.price.stamp + .55, { gold: true, drop: 6, glow: 24, weight: 800, maxW: 560 });
  }
}

/* ---------- scene: CTA (31.5-38) ---------- */
function ctaIcon(kind, x, y) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = MAROON; ctx.fillStyle = MAROON; ctx.lineWidth = 5;
  if (kind === 'web') { ctx.beginPath(); ctx.arc(0, 0, 20, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 9, 20, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke(); }
  if (kind === 'wa') { ctx.beginPath(); ctx.arc(0, 0, 20, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-18, 20); ctx.lineTo(-14, 9); ctx.lineTo(-6, 16); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 7, .6, 3.6); ctx.stroke(); }
  if (kind === 'ig') { ctx.beginPath(); ctx.roundRect(-20, -20, 40, 40, 12); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(12, -12, 3, 0, 7); ctx.fill(); }
  ctx.restore();
}
function sceneCta(t) {
  const lp = pr(t, 31.8, .5);
  if (lp > 0) { ctx.save(); ctx.translate(540, 390); drawLogo(190, 30 + 30 * Math.exp(-((t / .5) % 1) * 5), eBack(lp)); ctx.restore(); }
  kin('DAFTAR SEKARANG!', 540, 560, 104, t, 31.9, { gold: true, drop: 6, glow: 24, maxW: 900, weight: 800, stag: .02 });
  // QR card
  const qp = pr(t, 32.3, .6);
  const qx = 540, qy = 860, S = 380;
  if (qp > 0) {
    const e = eBack(qp); ctx.save(); ctx.translate(qx, qy); ctx.scale(e, e); ctx.globalAlpha = clamp(qp * 3);
    ctx.shadowColor = GOLD; ctx.shadowBlur = 40; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-S / 2 - 24, -S / 2 - 24, S + 48, S + 48, 28); ctx.fill(); ctx.shadowBlur = 0;
    const M = window.QRM, n = M.length, ms = S / n;
    // laser position
    let ly = null, passIdx = -1;
    T.scan.passes.forEach(([a, b], i) => { if (t >= a && t <= b) { passIdx = i; const p = (t - a) / (b - a); ly = (i % 2 === 0 ? p : 1 - p) * S - S / 2; } });
    const revealed = t > T.scan.passes[0][1] ? 1 : (passIdx === 0 ? (ly + S / 2) / S : 0);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const mx = -S / 2 + c * ms, my = -S / 2 + r * ms, ry = (r + .5) / n;
      if (M[r][c] === '1') {
        if (ry <= revealed) {
          let col = MAROON; if (ly !== null && passIdx > 0 && Math.abs(my + ms / 2 - ly) < 50) col = '#d97706';
          if (t > T.scan.lock) col = MAROON; ctx.fillStyle = col; ctx.fillRect(mx, my, ms + .6, ms + .6);
        } else if (R(r * 99 + c + Math.floor(t * 10)) > .86) { ctx.fillStyle = 'rgba(122,15,15,.18)'; ctx.fillRect(mx, my, ms, ms); }
      }
    }
    if (ly !== null) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, ly - 60, 0, ly + 60);
      lg.addColorStop(0, 'rgba(251,191,36,0)'); lg.addColorStop(.5, 'rgba(255,90,60,.55)'); lg.addColorStop(1, 'rgba(251,191,36,0)');
      ctx.fillStyle = lg; ctx.fillRect(-S / 2 - 24, ly - 60, S + 48, 120);
      ctx.shadowColor = '#ff3b3b'; ctx.shadowBlur = 30; ctx.fillStyle = '#fff'; ctx.fillRect(-S / 2 - 24, ly - 3, S + 48, 6); ctx.restore();
    }
    // corner brackets
    const lk = pr(t, T.scan.lock, .25), bs = 60, off = S / 2 + 44 - (t < T.scan.lock ? 6 * Math.sin(t * 8) : 14 * (1 - eBack(lk)));
    ctx.strokeStyle = t >= T.scan.lock ? GOLD : '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round';
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(sx * off, sy * (off - bs)); ctx.lineTo(sx * off, sy * off); ctx.lineTo(sx * (off - bs), sy * off); ctx.stroke(); });
    ctx.restore();
    ring(t, T.scan.lock, qx, qy, 800); sparks(t, T.scan.lock, qx, qy, 90, 900);
    if (t > T.scan.lock) { const ck = eBack(pr(t, T.scan.lock + .1, .3)); ctx.save(); ctx.translate(qx + 215, qy + 215); ctx.scale(ck, ck); ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 0, 36, 0, 7); ctx.fill(); ctx.strokeStyle = MAROON; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore(); }
  }
  // contact rows
  const rows = [['web', 'https://lbb.tontimuallimin.com/', 1150, 32.9], ['wa', 'WA: 0819-4749-1505', 1240, 33.2], ['ig', 'IG: @lbbmuin', 1330, 33.5]];
  rows.forEach(([ic, s, y, t0]) => {
    const p = pr(t, t0, .5); if (p <= 0) return; const e = eExpo(p);
    ctx.save(); ctx.globalAlpha = clamp(p * 3); ctx.translate((1 - e) * 600 * (y % 180 ? 1 : -1), 0);
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.roundRect(120, y - 38, 840, 76, 38);
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0; ctx.beginPath(); ctx.arc(172, y, 28, 0, 7); ctx.fillStyle = GOLD; ctx.fill();
    ctaIcon(ic, 172, y); txt(s, 225, y + 2, 44, { align: 'left', color: MAROON, weight: 800, ls: 1, maxW: 700 }); ctx.restore();
  });
  // white organizer logos
  const lg = [['tonti', 84], ['mangan', 84], ['muallimin', 66]], p = pr(t, 34.0, .5);
  if (p > 0) {
    const ws = lg.map(([k, h]) => h * IMG[k].width / IMG[k].height), gap = 56, tot = ws.reduce((a, b) => a + b) + gap * 2;
    let x = 540 - tot / 2; ctx.save(); ctx.globalAlpha = clamp(p) * .95;
    lg.forEach(([k, h], i) => { const sc = eBack(pr(t, 34 + i * .12, .4)); ctx.save(); ctx.translate(x + ws[i] / 2, 1440); ctx.scale(sc, sc); ctx.drawImage(IMG[k], -ws[i] / 2, -h / 2, ws[i], h); ctx.restore(); x += ws[i] + gap; });
    ctx.restore();
  }
}

/* ---------- wipes + master ---------- */
function wipe(t, tb) {
  const p = (t - (tb - .25)) / .5; if (p < 0 || p > 1) return;
  const cx = lerp(-1500, W + 1500, eIO(p));
  ctx.save(); ctx.translate(cx, H / 2); ctx.transform(1, 0, -.3, 1, 0, 0);
  ctx.fillStyle = '#fff'; ctx.fillRect(-980, -1500, 40, 3000);
  const g = ctx.createLinearGradient(-950, 0, 950, 0); g.addColorStop(0, '#fff3b0'); g.addColorStop(.15, GOLD); g.addColorStop(.85, '#a81818'); g.addColorStop(1, '#4a0707');
  ctx.fillStyle = g; ctx.fillRect(-940, -1500, 1880, 3000); ctx.restore();
}
window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const hit = T.hits.reduce((m, [h, s]) => (h <= t && t - h < m[0] ? [t - h, s] : m), [99, 0]);
  const punch = 1 + .02 * hit[1] * Math.exp(-hit[0] * 10), sh = hit[1] * 4 * Math.exp(-hit[0] * 14);
  ctx.save(); ctx.translate(540 + Math.sin(t * 90) * sh, 960 + Math.cos(t * 77) * sh); ctx.scale(punch, punch); ctx.translate(-540, -960);
  bg(t); dust(t);
  if (t < 2) sceneHook(t); else if (t < 5) sceneLogo(t); else if (t < 9) sceneQuota(t);
  else if (t < 14) sceneSquad(t); else if (t < 19) sceneJuri(t); else if (t < 26) sceneTrophy(t);
  else if (t < 31.5) scenePrice(t); else sceneCta(t);
  hud(t); ctx.restore();
  T.wipes.forEach(w => wipe(t, w));
  T.flash.forEach(f => { const d = t - f; if (d >= 0 && d < .2) { ctx.save(); ctx.globalAlpha = .55 * Math.exp(-d * 20); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); } });
  const vg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1300); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  const fo = pr(t, T.dur - .4, .4); if (fo > 0) { ctx.fillStyle = `rgba(30,3,3,${fo})`; ctx.fillRect(0, 0, W, H); }
};
