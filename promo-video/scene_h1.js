// LBB Mu'allimin 2027 — v4.1: 3D Motion UI & Voronoi Shatter Physics (Zero-Collision Flexbox + Local 3D Perspective)
(() => {
  const W = 1080, H = 1920;
  const bgCv = document.getElementById('bg'), bg = bgCv.getContext('2d');
  const fxCv = document.getElementById('fx'), fx = fxCv.getContext('2d');
  const sigCv = document.getElementById('sigCanvas'), sigCtx = sigCv.getContext('2d');
  const qrCv = document.getElementById('qrCanvas'), qrCtx = qrCv.getContext('2d');

  const $ = id => document.getElementById(id);
  const SC = [$('sc0'), $('sc1'), $('sc2'), $('sc3'), $('sc4')];

  /* ---------- Math & Easing ---------- */
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const pr = (t, t0, d) => clamp((t - t0) / d);
  const lerp = (a, b, x) => a + (b - a) * x;
  const eOut3 = x => 1 - Math.pow(1 - clamp(x), 3);
  const eOut4 = x => 1 - Math.pow(1 - clamp(x), 4);
  const eIn3 = x => Math.pow(clamp(x), 3);
  const eInOut = x => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  // Controlled damped spring (gentle <=3% overshoot so elements NEVER bounce into neighbors!)
  const eSpring = x => {
    x = clamp(x);
    if (x <= 0 || x >= 1) return x;
    return 1 - Math.exp(-7.8 * x) * Math.cos(8.5 * x);
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- 3D Particles ---------- */
  const rngBg = mulberry32(202701);
  const DUST = Array.from({ length: 70 }, () => ({
    x: (rngBg() - 0.5) * 2200,
    y: (rngBg() - 0.5) * 3200,
    z: rngBg() * 1800,
    r: 1.8 + rngBg() * 3.8,
    gold: rngBg() > 0.45
  }));

  /* ---------- Prebuild Rp 400.108 Slab Texture + 56-Triangle Shatter Mesh ---------- */
  const SW = 880, SH = 420;
  const slabTex = document.createElement('canvas');
  slabTex.width = SW; slabTex.height = SH;
  let SHARDS = [];
  let SPARKS = [];

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function buildSlabAndShards() {
    const c = slabTex.getContext('2d');
    const g = c.createLinearGradient(0, 0, SW, SH);
    g.addColorStop(0, '#271720');
    g.addColorStop(0.5, '#151621');
    g.addColorStop(1, '#2D1218');
    c.fillStyle = g;
    roundRect(c, 0, 0, SW, SH, 36);
    c.fill();

    c.lineWidth = 6;
    c.strokeStyle = 'rgba(248, 113, 113, 0.72)';
    roundRect(c, 3, 3, SW - 6, SH - 6, 34);
    c.stroke();

    c.fillStyle = 'rgba(239, 68, 68, 0.24)';
    roundRect(c, 48, 40, 526, 52, 26);
    c.fill();
    c.font = '800 22px "JetBrains Mono"';
    c.fillStyle = '#FCA5A5';
    c.fillText('⚠ BESOK (9 NOV) NAIK KE GELOMBANG 2', 74, 74);

    c.font = '900 54px Archivo';
    c.fillStyle = '#FDA4AF';
    c.fillText('Rp', 56, 234);

    c.font = '900 136px Archivo';
    c.fillStyle = '#F8FAFC';
    c.fillText('400.108,-', 148, 254);

    c.fillStyle = 'rgba(255,255,255,0.08)';
    c.fillRect(48, 316, SW - 96, 2);
    c.font = '700 23px "JetBrains Mono"';
    c.fillStyle = '#CBD5E1';
    c.fillText('LEBIH MAHAL Rp 50.000 / PELETON!', 54, 368);

    const rMesh = mulberry32(88400);
    const NX = 7, NY = 4;
    const pts = [];
    for (let j = 0; j <= NY; j++) {
      const row = [];
      for (let i = 0; i <= NX; i++) {
        let x = (i / NX) * SW;
        let y = (j / NY) * SH;
        if (i > 0 && i < NX) x += (rMesh() - 0.5) * (SW / NX) * 0.62;
        if (j > 0 && j < NY) y += (rMesh() - 0.5) * (SH / NY) * 0.62;
        row.push({ u: x, v: y });
      }
      pts.push(row);
    }

    SHARDS = [];
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const p00 = pts[j][i], p10 = pts[j][i + 1], p01 = pts[j + 1][i], p11 = pts[j + 1][i + 1];
        const tris = rMesh() > 0.5
          ? [[p00, p10, p11], [p00, p11, p01]]
          : [[p00, p10, p01], [p10, p11, p01]];

        for (const [a, b, d] of tris) {
          const cu = (a.u + b.u + d.u) / 3;
          const cv = (a.v + b.v + d.v) / 3;
          const dx = cu - SW / 2;
          const dy = cv - SH / 2;
          const dist = Math.hypot(dx, dy);
          const ang = Math.atan2(dy, dx) + (rMesh() - 0.5) * 0.45;
          const spd = 540 + (1 - clamp(dist / 500)) * 700 + rMesh() * 440;
          SHARDS.push({
            p: [
              { x: a.u - cu, y: a.v - cv, u: a.u, v: a.v },
              { x: b.u - cu, y: b.v - cv, u: b.u, v: b.v },
              { x: d.u - cu, y: d.v - cv, u: d.u, v: d.v }
            ],
            cx: dx,
            cy: dy,
            dist,
            vx: Math.cos(ang) * spd * 1.25,
            vy: Math.sin(ang) * spd - 240 - rMesh() * 220,
            vz: (rMesh() - 0.28) * 1150,
            wx: (rMesh() - 0.5) * 9.5,
            wy: (rMesh() - 0.5) * 9.5,
            wz: (rMesh() - 0.5) * 7.0,
            shimmer: rMesh()
          });
        }
      }
    }

    SPARKS = Array.from({ length: 85 }, () => {
      const a = rMesh() * Math.PI * 2;
      const s = 350 + rMesh() * 1350;
      return {
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 220,
        r: 2.5 + rMesh() * 5.5,
        gold: rMesh() > 0.35,
        life: 0.45 + rMesh() * 0.65
      };
    });
  }

  /* ---------- Build Crisp QR Code (340x340) ---------- */
  function buildQR() {
    const M = window.QRM;
    if (!M) return;
    const n = M.length, S = 340, ms = S / n;
    qrCtx.clearRect(0, 0, S, S);
    qrCtx.fillStyle = '#090D16';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (M[r][c] === '1') {
          qrCtx.fillRect(Math.floor(c * ms), Math.floor(r * ms), Math.ceil(ms), Math.ceil(ms));
        }
      }
    }
  }

  /* ---------- 3D Math Helpers ---------- */
  function rot3D(x, y, z, rx, ry, rz) {
    let y1 = y * Math.cos(rx) - z * Math.sin(rx);
    let z1 = y * Math.sin(rx) + z * Math.cos(rx);
    let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
    let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
    return { x: x3, y: y3, z: z2 };
  }

  function proj(x, y, z, cx = 540, cy = 835, fov = 1300) {
    const zz = Math.max(-fov + 120, z);
    const s = fov / (fov - zz);
    return { x: cx + x * s, y: cy + y * s, s };
  }

  function drawTexturedTri(ctx, img, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();

    const denom = u0 * (v2 - v1) - u1 * v2 + u2 * v1 + (u1 - u2) * v0;
    if (Math.abs(denom) > 1e-4) {
      const m11 = -(v0 * (x2 - x1) - v1 * x2 + v2 * x1 + (v1 - v2) * x0) / denom;
      const m12 = (v1 * y2 + v0 * (y1 - y2) - v2 * y1 + (v2 - v1) * y0) / denom;
      const m21 = (u0 * (x2 - x1) - u1 * x2 + u2 * x1 + (u1 - u2) * x0) / denom;
      const m22 = -(u1 * y2 + u0 * (y1 - y2) - u2 * y1 + (u2 - u1) * y0) / denom;
      const dx = (u0 * (v2 * x1 - v1 * x2) + v0 * (u1 * x2 - u2 * x1) + (u2 * v1 - u1 * v2) * x0) / denom;
      const dy = (u0 * (v2 * y1 - v1 * y2) + v0 * (u1 * y2 - u2 * y1) + (u2 * v1 - u1 * v2) * y0) / denom;
      ctx.transform(m11, m12, m21, m22, dx, dy);
      ctx.drawImage(img, 0, 0);
    }
    ctx.restore();
  }

  /* ---------- Background 3D Studio Space ---------- */
  const PALETTES = [
    ['rgba(239,68,68,0.34)', 'rgba(245,158,11,0.20)', '#EF4444'],
    ['rgba(16,185,129,0.30)', 'rgba(245,158,11,0.28)', '#F59E0B'],
    ['rgba(56,189,248,0.28)', 'rgba(16,185,129,0.26)', '#10B981'],
    ['rgba(59,130,246,0.28)', 'rgba(16,185,129,0.24)', '#38BDF8'],
    ['rgba(220,38,38,0.32)', 'rgba(245,158,11,0.32)', '#F59E0B']
  ];

  function drawBackground3D(t, sceneIdx, warpIntensity) {
    bg.clearRect(0, 0, W, H);
    bg.fillStyle = '#06080F';
    bg.fillRect(0, 0, W, H);

    const [c1, c2, gridCol] = PALETTES[sceneIdx];

    const sx1 = 540 + Math.sin(t * 0.9) * 140;
    const sy1 = 680 + Math.cos(t * 0.7) * 110;
    const g1 = bg.createRadialGradient(sx1, sy1, 40, sx1, sy1, 820);
    g1.addColorStop(0, c1);
    g1.addColorStop(1, 'rgba(6,8,15,0)');
    bg.fillStyle = g1;
    bg.fillRect(0, 0, W, H);

    const sx2 = 540 - Math.cos(t * 0.8) * 180;
    const sy2 = 1280 + Math.sin(t * 0.6) * 100;
    const g2 = bg.createRadialGradient(sx2, sy2, 40, sx2, sy2, 760);
    g2.addColorStop(0, c2);
    g2.addColorStop(1, 'rgba(6,8,15,0)');
    bg.fillStyle = g2;
    bg.fillRect(0, 0, W, H);

    const vpX = 540 + Math.sin(t * 0.55) * 45;
    const vpY = 960;
    bg.save();
    bg.strokeStyle = gridCol;
    for (let i = -8; i <= 8; i++) {
      const xEdge = vpX + i * 195;
      bg.globalAlpha = 0.10;
      bg.lineWidth = 1.5;
      bg.beginPath();
      bg.moveTo(vpX, vpY + 190);
      bg.lineTo(xEdge, H + 120);
      bg.moveTo(vpX, vpY - 190);
      bg.lineTo(xEdge, -120);
      bg.stroke();
    }
    const zScroll = (t * 1.45 + warpIntensity * 1.8) % 1;
    for (let k = 0; k < 9; k++) {
      const depth = (k + zScroll) / 9;
      const p = Math.pow(depth, 2.3);
      const yFloor = lerp(vpY + 190, H + 40, p);
      const yCeil = lerp(vpY - 190, -40, p);
      bg.globalAlpha = p * 0.16;
      bg.lineWidth = 1 + p * 1.5;
      bg.beginPath();
      bg.moveTo(0, yFloor); bg.lineTo(W, yFloor);
      bg.moveTo(0, yCeil); bg.lineTo(W, yCeil);
      bg.stroke();
    }
    bg.restore();

    const zTravel = t * 280;
    for (const d of DUST) {
      let zz = (d.z - zTravel) % 1800;
      if (zz < 0) zz += 1800;
      const scale = 900 / (120 + zz);
      const px = 540 + d.x * scale * 0.55;
      const py = 960 + d.y * scale * 0.55;
      if (px < -30 || px > W + 30 || py < -30 || py > H + 30) continue;
      const alpha = clamp((1 - zz / 1800) * 0.65, 0, 0.55);
      bg.fillStyle = d.gold ? `rgba(253,224,71,${alpha})` : `rgba(148,163,184,${alpha})`;
      bg.beginPath();
      bg.arc(px, py, d.r * clamp(scale * 0.6, 0.4, 2.4), 0, Math.PI * 2);
      bg.fill();
    }

    if (warpIntensity > 0.01) {
      bg.save();
      bg.translate(540, 960);
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + i * 0.37;
        const r0 = 120 + (i % 5) * 55;
        const r1 = r0 + warpIntensity * (420 + (i % 4) * 160);
        bg.strokeStyle = i % 2 === 0
          ? `rgba(253,224,71,${warpIntensity * 0.55})`
          : `rgba(248,250,252,${warpIntensity * 0.42})`;
        bg.lineWidth = 2 + (i % 3) * 1.5;
        bg.beginPath();
        bg.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        bg.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        bg.stroke();
      }
      bg.restore();
    }
  }

  /* ---------- Scene 0: 3D Split-Flap Mechanical Countdown ---------- */
  function setSplitFlap(curr, next, p) {
    $('flNextTop').textContent = next;
    $('flCurrBot').textContent = curr;
    $('flLeafTopTxt').textContent = curr;
    $('flLeafBotTxt').textContent = next;

    if (p <= 0) {
      $('flLeafTop').style.transform = 'rotateX(0deg)';
      $('flLeafTop').style.display = 'block';
      $('flLeafBot').style.display = 'none';
    } else if (p < 0.5) {
      const deg = -90 * eIn3(p * 2);
      $('flLeafTop').style.display = 'block';
      $('flLeafTop').style.transform = `rotateX(${deg.toFixed(2)}deg)`;
      $('flLeafBot').style.display = 'none';
    } else if (p < 1) {
      const deg = 90 * (1 - eOut3((p - 0.5) * 2));
      $('flLeafTop').style.display = 'none';
      $('flLeafBot').style.display = 'block';
      $('flLeafBot').style.transform = `rotateX(${deg.toFixed(2)}deg)`;
    } else {
      $('flLeafTop').style.display = 'none';
      $('flLeafBot').style.display = 'block';
      $('flLeafBot').style.transform = 'rotateX(0deg)';
      $('flCurrBot').textContent = next;
    }
  }

  function updateScene0(t) {
    const S = T.s0;
    const pIn = eSpring(pr(t, 0, 0.6));

    if (t < S.flap2) {
      setSplitFlap('02', '01', pr(t, S.flap1, 0.28));
    } else {
      setSplitFlap('01', '00', pr(t, S.flap2, 0.30));
    }

    const lockAge = t - (S.flap2 + 0.28);
    const jolt = (lockAge > 0 && lockAge < 0.20) ? Math.sin(lockAge * 95) * 6 * (1 - lockAge / 0.20) : 0;

    // Top Crest — subtle in-place reveal (never rises into #topPill!)
    const pc = eOut3(pr(t, 0.05, 0.4));
    $('s0Crest').style.opacity = pc;
    $('s0Crest').style.transform = `perspective(900px) translateY(${(1 - pc) * -14}px) scale(${0.92 + 0.08 * pc})`;

    // 3D Split-Flap Rig — rotates around its OWN local perspective center!
    const rx = lerp(22, 4, pIn) + Math.sin(t * 1.6) * 3.2;
    const ry = lerp(-20, 5, pIn) + Math.cos(t * 1.2) * 6.0;
    $('flapRig').style.transform =
      `perspective(1150px) translateY(${jolt.toFixed(1)}px) scale(${0.86 + 0.14 * pIn}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

    // 3D Headline — unfurls around its own center (zero collision with clock or glass card!)
    const ph = eSpring(pr(t, S.headline, 0.48));
    $('s0Headline').style.opacity = clamp(pr(t, S.headline, 0.18) * 2);
    $('s0Headline').style.transform =
      `perspective(950px) translateY(${(1 - ph) * 18}px) rotateX(${(1 - ph) * -45}deg) scale(${0.9 + 0.1 * ph})`;

    // 3D Glass Deadline Card
    const pg = eSpring(pr(t, S.glassCard, 0.5));
    $('s0Glass').style.opacity = clamp(pr(t, S.glassCard, 0.2) * 2);
    $('s0Glass').style.transform =
      `perspective(1050px) translateY(${(1 - pg) * 20}px) rotateX(${(1 - pg) * 32 + Math.sin(t * 1.8) * 2.2}deg) rotateY(${Math.cos(t * 1.4) * 3.5}deg)`;

    const sec = Math.max(0, 59.99 - t * 3.9);
    $('s0Timer').textContent =
      `SISA WAKTU · 11:59:${String(Math.floor(sec)).padStart(2, '0')}.${String(Math.floor((sec % 1) * 100)).padStart(2, '0')}`;
    $('s0RingArc').setAttribute('stroke-dashoffset', (45 + t * 24).toFixed(1));

    // Bottom Hook Badge — clean in-place 3D pop
    const pb = eSpring(pr(t, S.hookBadge, 0.46));
    $('s0Hook').style.opacity = clamp(pr(t, S.hookBadge, 0.16) * 2);
    $('s0Hook').style.transform =
      `perspective(1000px) translateY(${(1 - pb) * 18}px) scale(${0.88 + 0.12 * pb}) rotateX(${(1 - pb) * 25}deg)`;
  }

  /* ---------- Scene 1: Voronoi 3D Shatter -> Hero Titanium Price Card ---------- */
  function updateScene1(t) {
    const S = T.s1;
    const pc = eOut3(pr(t, 5.05, 0.38));
    $('s1Cap').style.opacity = pc;
    $('s1Cap').style.transform = `translateY(${(1 - pc) * -16}px)`;
    $('s1TitleTxt').textContent = t < S.shatter ? 'BESOK HARGA NAIK!' : 'HARGA SPESIAL GEL. 1!';

    if (t < S.heroCard) {
      $('heroPriceRig').style.opacity = '0';
      $('saveBadge3d').style.opacity = '0';
      $('s1BottomNote').style.opacity = '0';
    } else {
      const ph = eSpring(pr(t, S.heroCard, 0.65));
      const floatX = 4 + Math.sin((t - S.heroCard) * 1.8) * 3.5;
      const floatY = -6 + Math.cos((t - S.heroCard) * 1.4) * 6.5;
      $('heroPriceRig').style.opacity = clamp((t - S.heroCard) * 6);
      $('heroPriceRig').style.transform =
        `perspective(1200px) scale(${lerp(0.62, 1, ph).toFixed(3)}) rotateX(${lerp(28, floatX, ph).toFixed(2)}deg) rotateY(${lerp(-30, floatY, ph).toFixed(2)}deg)`;

      const shP = eInOut(pr(t, S.sheen, 0.95));
      $('priceSheen').style.left = `${lerp(-65, 135, shP).toFixed(1)}%`;

      // Standalone Savings Badge cleanly 40px below #heroPriceRig!
      const ps = eSpring(pr(t, S.saveBadge, 0.48));
      $('saveBadge3d').style.opacity = clamp(pr(t, S.saveBadge, 0.16) * 2);
      $('saveBadge3d').style.transform =
        `perspective(1000px) translateY(${(1 - ps) * 20}px) scale(${0.82 + 0.18 * ps}) rotateX(${(1 - ps) * 28}deg)`;

      const pn = eOut3(pr(t, S.saveBadge + 0.22, 0.38));
      $('s1BottomNote').style.opacity = pn;
      $('s1BottomNote').style.transform = `translateY(${(1 - pn) * 16}px)`;
    }

    if (t >= 5.0 && t < 8.4) {
      drawShatterSlab(t, S);
    }
  }

  function drawShatterSlab(t, S) {
    const enterP = eOut3(pr(t, S.slabIn, 0.42));
    const crackP = pr(t, S.crackStart, S.shatter - S.crackStart);
    const dt = t - S.shatter;
    const CY = 860; // Centered right in the middle slot, well clear of #s1Cap above!

    if (dt < 0) {
      const tremble = crackP > 0 ? Math.sin(t * 140) * crackP * 8 : 0;
      const baseRx = lerp(24, 6, enterP) + Math.sin(t * 3) * 2;
      const baseRy = lerp(26, -8, enterP) + crackP * 5;
      const baseZ = lerp(-380, 20, enterP);

      fx.save();
      fx.globalAlpha = enterP;
      for (const sh of SHARDS) {
        const sep = Math.pow(crackP, 3) * 9;
        const pts2d = sh.p.map(v => {
          const lx = sh.cx + v.x + (sh.cx / 250) * sep;
          const ly = sh.cy + v.y + (sh.cy / 250) * sep;
          const r3 = rot3D(lx, ly, 0, baseRx * Math.PI / 180, baseRy * Math.PI / 180, 0);
          return proj(r3.x + tremble, r3.y + tremble * 0.6, r3.z + baseZ, 540, CY, 1300);
        });
        drawTexturedTri(
          fx, slabTex,
          pts2d[0].x, pts2d[0].y, pts2d[1].x, pts2d[1].y, pts2d[2].x, pts2d[2].y,
          sh.p[0].u, sh.p[0].v, sh.p[1].u, sh.p[1].v, sh.p[2].u, sh.p[2].v
        );

        const reach = crackP * 540;
        if (crackP > 0.02 && sh.dist < reach) {
          const glow = clamp((reach - sh.dist) / 150);
          fx.save();
          fx.shadowColor = '#EF4444';
          fx.shadowBlur = 14 * glow;
          fx.strokeStyle = glow > 0.68 ? `rgba(254,240,138,${glow})` : `rgba(248,113,113,${glow * 0.92})`;
          fx.lineWidth = 1.4 + glow * 2.6;
          fx.beginPath();
          fx.moveTo(pts2d[0].x, pts2d[0].y);
          fx.lineTo(pts2d[2].x, pts2d[2].y);
          if (sh.shimmer > 0.45) fx.lineTo(pts2d[1].x, pts2d[1].y);
          fx.stroke();
          fx.restore();
        }
      }
      fx.restore();
    } else {
      const fade = 1 - clamp((dt - 0.85) / 0.75);
      if (fade <= 0) return;

      if (dt < 0.38) {
        const sp = eOut3(dt / 0.38);
        fx.save();
        if (dt < 0.09) {
          fx.fillStyle = `rgba(254,243,199,${(1 - dt / 0.09) * 0.50})`;
          fx.fillRect(0, 0, W, H);
        }
        fx.strokeStyle = `rgba(253,224,71,${(1 - sp) * 0.9})`;
        fx.lineWidth = 16 * (1 - sp) + 2;
        fx.beginPath();
        fx.arc(540, CY, 80 + sp * 660, 0, Math.PI * 2);
        fx.stroke();
        fx.restore();
      }

      const posed = SHARDS.map(sh => {
        const x = sh.cx + sh.vx * dt;
        const y = sh.cy + sh.vy * dt + 0.5 * 1480 * dt * dt;
        const z = 20 + sh.vz * dt;
        return { sh, x, y, z, rx: sh.wx * dt, ry: sh.wy * dt, rz: sh.wz * dt };
      }).sort((a, b) => a.z - b.z);

      fx.save();
      for (const item of posed) {
        if (item.z > 1080) continue;
        const { sh, x, y, z, rx, ry, rz } = item;
        const pts2d = sh.p.map(v => {
          const r3 = rot3D(v.x, v.y, 0, rx, ry, rz);
          return proj(x + r3.x, y + r3.y, z + r3.z, 540, CY, 1300);
        });
        fx.globalAlpha = fade;
        drawTexturedTri(
          fx, slabTex,
          pts2d[0].x, pts2d[0].y, pts2d[1].x, pts2d[1].y, pts2d[2].x, pts2d[2].y,
          sh.p[0].u, sh.p[0].v, sh.p[1].u, sh.p[1].v, sh.p[2].u, sh.p[2].v
        );
        const glint = Math.pow(Math.max(0, Math.cos(rx * 2 + ry + sh.shimmer * 6)), 8);
        if (glint > 0.25) {
          fx.fillStyle = `rgba(255,250,220,${glint * 0.65 * fade})`;
          fx.beginPath();
          fx.moveTo(pts2d[0].x, pts2d[0].y);
          fx.lineTo(pts2d[1].x, pts2d[1].y);
          fx.lineTo(pts2d[2].x, pts2d[2].y);
          fx.closePath();
          fx.fill();
        }
      }

      for (const spk of SPARKS) {
        if (dt > spk.life) continue;
        const lp = 1 - dt / spk.life;
        const sx = 540 + spk.vx * dt;
        const sy = CY + spk.vy * dt + 0.5 * 980 * dt * dt;
        fx.fillStyle = spk.gold ? `rgba(253,224,71,${lp})` : `rgba(248,113,113,${lp})`;
        fx.beginPath();
        fx.arc(sx, sy, spk.r * lp, 0, Math.PI * 2);
        fx.fill();
      }
      fx.restore();
    }
  }

  /* ---------- Scene 2: 3D Roster ID Cards 180° Flip (3-Column Flex with Guaranteed Air Gap) ---------- */
  function updateScene2(t) {
    const S = T.s2;
    const p1 = eSpring(pr(t, S.title1, 0.45));
    const p2 = eSpring(pr(t, S.title2, 0.48));
    $('s2Head').style.opacity = clamp(pr(t, S.title1, 0.18) * 2);
    $('s2T1').style.transform = `perspective(900px) translateY(${(1 - p1) * -16}px) rotateX(${(1 - p1) * 38}deg)`;
    $('s2T2').style.transform = `perspective(900px) translateY(${(1 - p2) * 14}px) scale(${0.88 + 0.12 * p2})`;

    const cIn = eSpring(pr(t, S.cardsIn, 0.55));
    const f1 = eInOut(pr(t, S.flip1, 0.58));
    const f2 = eInOut(pr(t, S.flip2, 0.58));
    const f3 = eInOut(pr(t, S.flip3, 0.58));

    // Each card flips in its OWN 288px Flexbox column — mid-flip scale occurs at 90deg when narrow, so ZERO overlap!
    const cards = [
      { el: $('rc1'), baseRY: 12,  flip: f1 },
      { el: $('rc2'), baseRY: 0,   flip: f2 },
      { el: $('rc3'), baseRY: -12, flip: f3 }
    ];

    cards.forEach((c, idx) => {
      const yBob = Math.sin(t * 2.1 + idx * 1.4) * 6;
      const sc = lerp(0.82, 1.0, cIn);
      const y = (1 - cIn) * 24 + yBob;
      const ry = c.baseRY * (1 - 2 * c.flip) + c.flip * 180;
      const rx = Math.sin(t * 1.6 + idx) * 2.5;
      c.el.style.opacity = clamp(pr(t, S.cardsIn + idx * 0.08, 0.24) * 2);
      c.el.style.transform =
        `perspective(1150px) translateY(${y.toFixed(1)}px) scale(${sc.toFixed(3)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });

    // Emerald pulse rings centered on each card column (540 - 316, 540, 540 + 316)
    [
      [S.flip1 + 0.32, 540 - 316, 945],
      [S.flip2 + 0.32, 540,       945],
      [S.flip3 + 0.32, 540 + 316, 945]
    ].forEach(([ft, cx, cy]) => {
      const age = t - ft;
      if (age > 0 && age < 0.42) {
        const p = eOut3(age / 0.42);
        fx.save();
        fx.strokeStyle = `rgba(52,211,153,${(1 - p) * 0.82})`;
        fx.lineWidth = 5 * (1 - p) + 1;
        fx.beginPath();
        fx.arc(cx, cy, 65 + p * 125, 0, Math.PI * 2);
        fx.stroke();
        fx.restore();
      }
    });

    const pd = eSpring(pr(t, S.tmDock, 0.5));
    $('s2Dock').style.opacity = clamp(pr(t, S.tmDock, 0.18) * 2);
    $('s2Dock').style.transform =
      `perspective(1050px) translateY(${(1 - pd) * 22}px) rotateX(${(1 - pd) * 28}deg) scale(${0.92 + 0.08 * pd})`;
  }

  /* ---------- Scene 3: 3D Floating Smartphone & Live Signature ---------- */
  const SIG_ANCHORS = [
    [22, 46], [32, 13], [48, 11], [38, 50], [62, 20], [78, 44], [96, 19],
    [114, 42], [138, 24], [156, 43], [182, 15], [198, 44], [224, 26],
    [252, 40], [295, 26], [320, 32], [210, 53], [324, 49]
  ];
  const SIG_PTS = [];
  for (let i = 0; i < SIG_ANCHORS.length - 1; i++) {
    const p0 = SIG_ANCHORS[Math.max(0, i - 1)];
    const p1 = SIG_ANCHORS[i];
    const p2 = SIG_ANCHORS[i + 1];
    const p3 = SIG_ANCHORS[Math.min(SIG_ANCHORS.length - 1, i + 2)];
    for (let s = 0; s < 6; s++) {
      const u = s / 6, u2 = u * u, u3 = u2 * u;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3);
      SIG_PTS.push([x, y]);
    }
  }

  function drawLiveSignature(p) {
    sigCtx.clearRect(0, 0, 340, 64);
    if (p <= 0) return;
    const totalSegs = SIG_PTS.length - 1;
    const exact = p * totalSegs;
    const nSeg = Math.floor(exact);
    const frac = exact - nSeg;

    sigCtx.save();
    sigCtx.strokeStyle = '#34D399';
    sigCtx.lineWidth = 4.0;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.shadowColor = '#10B981';
    sigCtx.shadowBlur = 9;
    sigCtx.beginPath();
    sigCtx.moveTo(SIG_PTS[0][0], SIG_PTS[0][1]);

    let tipX = SIG_PTS[0][0], tipY = SIG_PTS[0][1];
    for (let i = 0; i < nSeg; i++) {
      tipX = SIG_PTS[i + 1][0];
      tipY = SIG_PTS[i + 1][1];
      sigCtx.lineTo(tipX, tipY);
    }
    if (nSeg < totalSegs) {
      tipX = lerp(SIG_PTS[nSeg][0], SIG_PTS[nSeg + 1][0], frac);
      tipY = lerp(SIG_PTS[nSeg][1], SIG_PTS[nSeg + 1][1], frac);
      sigCtx.lineTo(tipX, tipY);
    }
    sigCtx.stroke();

    if (p < 1) {
      sigCtx.fillStyle = '#FDE047';
      sigCtx.beginPath();
      sigCtx.arc(tipX, tipY, 5.5, 0, Math.PI * 2);
      sigCtx.fill();
    }
    sigCtx.restore();
  }

  function updateScene3(t) {
    const S = T.s3;
    const ph = eOut3(pr(t, S.header, 0.38));
    $('s3Head').style.opacity = ph;
    $('s3Head').style.transform = `translateY(${(1 - ph) * -16}px)`;

    // Smooth 3D Smartphone Orbit around its OWN perspective center (zero collision with header or bottom badge!)
    const pIn = eSpring(pr(t, S.phoneIn, 0.58));
    const orbitP = pr(t, 16.2, 6.2);
    const rx = lerp(16, 6, pIn) - orbitP * 3.5;
    const ry = lerp(-20, -11, pIn) + orbitP * 22; // -11deg -> +11deg
    const rz = -1.2 + orbitP * 2.4;
    $('phoneRig').style.opacity = clamp(pr(t, S.phoneIn, 0.22) * 2);
    $('phoneRig').style.transform =
      `perspective(1350px) scale(${0.86 + 0.14 * pIn}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;

    // 4 Interactive Steps with controlled Z-lift (zero overlap with neighbors or Dynamic Island!)
    const taps = [
      { el: $('st1'), t0: S.tap1, tapY: 590 },
      { el: $('st2'), t0: S.tap2, tapY: 790 },
      { el: $('st3'), t0: S.tap3, tapY: 970 },
      { el: $('st4'), t0: S.tap4, tapY: 1185 }
    ];

    taps.forEach((st) => {
      const p = eSpring(pr(t, st.t0, 0.42));
      const isAct = t >= st.t0;
      st.el.classList.toggle('active', isAct);
      const zLift = isAct ? 20 * p : 0;
      st.el.style.transform = `translateZ(${zLift.toFixed(1)}px) scale(${1 + 0.014 * p})`;

      const age = t - st.t0;
      if (age > 0 && age < 0.40) {
        const rp = eOut3(age / 0.40);
        fx.save();
        fx.strokeStyle = `rgba(253,224,71,${(1 - rp) * 0.88})`;
        fx.lineWidth = 6 * (1 - rp) + 1.5;
        fx.beginPath();
        fx.arc(540, st.tapY, 16 + rp * 85, 0, Math.PI * 2);
        fx.stroke();
        fx.restore();
      }
    });

    $('st1Pill').classList.toggle('on', t >= S.tap1 + 0.08);

    const upP = eOut3(pr(t, S.tap2 + 0.08, 0.55));
    $('st2Fill').style.width = `${(upP * 100).toFixed(0)}%`;
    $('st2Desc').textContent = upP > 0.85
      ? '✓ logo_sekolah.png (100% Terupload)'
      : 'Login email aktif & upload logo PNG';

    const fullStr = '✓ Danton: M. Farhan · WA: 0812-8890-xxxx';
    if (t < S.tap3) {
      $('st3Type').textContent = 'Nama Danton, Kartu Pelajar & No. WA';
    } else {
      const tp = pr(t, S.tap3 + 0.05, 0.65);
      const chars = Math.max(1, Math.floor(tp * fullStr.length));
      $('st3Type').textContent = fullStr.slice(0, chars);
    }

    drawLiveSignature(eInOut(pr(t, S.sigDraw[0], S.sigDraw[1] - S.sigDraw[0])));

    // Standalone bottom confirmation badge cleanly 32px below #phoneRig!
    const pl = eSpring(pr(t, S.lockBadge, 0.48));
    $('phoneLockBadge').style.opacity = clamp(pr(t, S.lockBadge, 0.16) * 2);
    $('phoneLockBadge').style.transform =
      `perspective(1000px) translateY(${(1 - pl) * 18}px) scale(${0.85 + 0.15 * pl}) rotateX(${(1 - pl) * 24}deg)`;
  }

  /* ---------- Scene 4: Grand 3D Championship Portal Finale ---------- */
  function updateScene4(t) {
    const S = T.s4;
    // Logo rotates around its OWN perspective center — never drifts upward into #topPill!
    const pl = eSpring(pr(t, S.logoIn, 0.52));
    $('s4Logo').style.opacity = clamp(pr(t, S.logoIn, 0.18) * 2);
    $('s4Logo').style.transform =
      `perspective(900px) translateY(${(1 - pl) * -14}px) rotateY(${Math.sin(t * 1.8) * 12}deg) scale(${0.82 + 0.18 * pl})`;

    const ph = eSpring(pr(t, S.headline, 0.48));
    $('s4Head').style.opacity = clamp(pr(t, S.headline, 0.18) * 2);
    $('s4Head').style.transform = `perspective(950px) translateY(${(1 - ph) * 16}px) rotateX(${(1 - ph) * -28}deg)`;

    // 3D Crystal QR Stage + Built-in Viewfinder Corner Brackets (zero drift!)
    const pq = eSpring(pr(t, S.qrIn, 0.56));
    const qRx = Math.sin(t * 1.7) * 4.2;
    const qRy = Math.cos(t * 1.3) * 5.2;
    $('qrOuterStage').style.opacity = clamp(pr(t, S.qrIn, 0.2) * 2);
    $('qrOuterStage').style.transform =
      `perspective(1100px) scale(${0.78 + 0.22 * pq}) rotateX(${qRx.toFixed(2)}deg) rotateY(${qRy.toFixed(2)}deg)`;

    const scanY = 26 + ((Math.sin((t - S.qrIn) * 3.8) * 0.5 + 0.5) * 342);
    $('qrLaser').style.top = `${scanY.toFixed(1)}px`;

    // Viewfinder corner lock-in pulse (strictly contained inside #qrOuterStage!)
    const bp = eOut3(pr(t, S.lockBrackets, 0.35));
    const pulse = bp > 0 ? Math.sin(t * 6.5) * 4 : 0;
    const spread = (1 - bp) * 24 + pulse;
    ['qrC1', 'qrC2', 'qrC3', 'qrC4'].forEach((id, idx) => {
      const el = $(id);
      const sx = idx % 2 === 0 ? -1 : 1;
      const sy = idx < 2 ? -1 : 1;
      el.style.opacity = (bp * 0.95).toFixed(2);
      el.style.transform = `translate(${(sx * spread).toFixed(1)}px, ${(sy * spread).toFixed(1)}px)`;
    });

    const pd = eSpring(pr(t, S.ctaDock, 0.5));
    $('s4Dock').style.opacity = clamp(pr(t, S.ctaDock, 0.2) * 2);
    $('s4Dock').style.transform =
      `perspective(1050px) translateY(${(1 - pd) * 22}px) rotateX(${(1 - pd) * 24}deg) scale(${0.92 + 0.08 * pd})`;

    const sh = ((t - S.shine) % 2.2) / 1.1;
    $('ctaShine').style.left = sh > 0 && sh < 1 ? `${lerp(-50, 130, eInOut(sh)).toFixed(1)}%` : '-55%';
  }

  /* ---------- Master 3D Camera Compositor & Z-Axis Warp Transitions ---------- */
  const UPDATERS = [updateScene0, updateScene1, updateScene2, updateScene3, updateScene4];
  const TOP_LABELS = [
    'HARI TERAKHIR · GEL. 1',
    'HEMAT Rp 50.000',
    'NAMA-NAMA FLEKSIBEL',
    '4 DATA · 3 MENIT',
    'DAFTAR SEKARANG'
  ];

  function getActiveState(t) {
    let idx = 0;
    for (let i = 0; i < T.cuts.length; i++) {
      if (t >= T.cuts[i]) idx = i + 1;
    }
    return idx;
  }

  window.renderFrame = function (t) {
    fx.clearRect(0, 0, W, H);

    const k = getActiveState(t);
    const halfW = T.warpDur / 2;

    let warpIntensity = 0;
    let outIdx = -1, outP = 0;
    let inIdx = k, inP = 0;

    for (let i = 0; i < T.cuts.length; i++) {
      const c = T.cuts[i];
      if (t >= c - halfW && t < c + halfW) {
        const w = (t - (c - halfW)) / T.warpDur;
        warpIntensity = Math.sin(w * Math.PI);
        outIdx = i;
        outP = eIn3(clamp(w / 0.62));
        inIdx = i + 1;
        inP = eOut4(clamp((w - 0.22) / 0.78));
        break;
      }
    }

    drawBackground3D(t, k, warpIntensity);

    for (let i = 0; i < SC.length; i++) {
      SC[i].style.display = 'none';
      SC[i].style.opacity = '1';
      SC[i].style.transform = 'none';
    }

    if (outIdx >= 0 && outP < 1) {
      SC[outIdx].style.display = 'flex';
      UPDATERS[outIdx](t);
      const zFly = outP * 1180;
      const rotZ = outP * (outIdx % 2 === 0 ? 6 : -6);
      SC[outIdx].style.opacity = (1 - outP).toFixed(3);
      SC[outIdx].style.transform = `translate3d(0, 0, ${zFly.toFixed(1)}px) rotateZ(${rotZ.toFixed(2)}deg)`;
    }

    if (outIdx >= 0) {
      if (inP > 0) {
        SC[inIdx].style.display = 'flex';
        UPDATERS[inIdx](t);
        const zIn = (1 - inP) * -1350;
        const rxIn = (1 - inP) * 14;
        SC[inIdx].style.opacity = clamp(inP * 1.4).toFixed(3);
        SC[inIdx].style.transform = `translate3d(0, 0, ${zIn.toFixed(1)}px) rotateX(${rxIn.toFixed(2)}deg)`;
      }
    } else {
      SC[k].style.display = 'flex';
      UPDATERS[k](t);
    }

    $('topLabel').textContent = TOP_LABELS[k];
    $('topProgFill').style.width = `${clamp((t / T.dur) * 100, 0, 100).toFixed(1)}%`;

    const vig = fx.createRadialGradient(540, 960, 520, 540, 960, 1180);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(3,4,8,0.40)');
    fx.fillStyle = vig;
    fx.fillRect(0, 0, W, H);

    const fadeOut = pr(t, T.dur - 0.42, 0.42);
    if (fadeOut > 0) {
      fx.fillStyle = `rgba(6,7,11,${fadeOut.toFixed(3)})`;
      fx.fillRect(0, 0, W, H);
    }
  };

  window.ready = Promise.all([
    document.fonts.load('900 120px Archivo'),
    document.fonts.load('800 80px Archivo'),
    document.fonts.load('800 40px "JetBrains Mono"'),
    ...Array.from(document.images).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    )
  ]).then(() => {
    buildSlabAndShards();
    buildQR();
    window.renderFrame(0);
  });
})();
