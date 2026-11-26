import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getChestNumberByLot } from '../context/competitionHelpers.js';
import { getImageCandidateUrls, extractGoogleDriveFileId } from '../services/sheetService.js';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const KOP_IMAGE_URL = '/kop-lbb-header.png';
const PDF_FONT_FAMILY = "'Arial Narrow', Arial, Helvetica, sans-serif";

// Safe area berdasarkan pengukuran KOP LBB HEADER.png (2481x3508 = 210x297mm, tanpa footer):
// Header berakhir di ~28.1mm (~106px), bawah bebas tanpa ornamen footer.
const PAD_TOP_PX = 122;
const PAD_BOTTOM_PX = 34;
const PAD_X_PX = 40;

function escapeHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getPersonnelAliasKeys(idStr) {
  const s = String(idStr || '');
  if (s === 'danton' || s === 'p-danton') return ['danton', 'p-danton'];
  const pMatch = s.match(/^(?:p|pasukan)-(\d+)$/);
  if (pMatch) return [`p-${pMatch[1]}`, `pasukan-${pMatch[1]}`];
  const cMatch = s.match(/^(?:c|cadangan)-(\d+)$/);
  if (cMatch) return [`c-${cMatch[1]}`, `cadangan-${cMatch[1]}`];
  return [s];
}

function buildTeamPersonnelsStructured(team) {
  if (!team) return { danton: null, banjars: [], cadangan: [], all: [] };
  const r = team.roster || {};

  // 1. Komandan Peleton (Danton)
  const dantonObj = r.danton || {};
  const dantonId = dantonObj.id || 'p-danton';
  const danton = {
    id: dantonId,
    aliasKeys: getPersonnelAliasKeys(dantonId),
    code: 'DAN',
    roleType: 'danton',
    name: dantonObj.name || team.dantonName || 'Komandan Peleton',
    photo: dantonObj.photo || null,
  };

  // 2. 21 Pasukan Inti (3 Saf x 7 Banjar)
  const pasukanArr = Array.isArray(r.pasukan) ? r.pasukan : [];
  const pasukanList = [];
  for (let i = 0; i < 21; i++) {
    const p = pasukanArr[i] || {};
    const num = i + 1;
    const pid = p.id || `p-${num}`;
    const saf = p.safNumber || Math.ceil(num / 7);
    const banjar = p.banjarNumber || ((num - 1) % 7) + 1;
    pasukanList.push({
      id: pid,
      aliasKeys: getPersonnelAliasKeys(pid),
      code: `P${num}`,
      roleType: 'pasukan',
      saf,
      banjar,
      name: p.name || `Anggota Pasukan ${num}`,
      photo: p.photo || null,
    });
  }

  // Kelompokkan per Banjar (Banjar 1..7, masing-masing 3 personel: Saf 1, Saf 2, Saf 3)
  const banjars = [];
  for (let b = 1; b <= 7; b++) {
    const members = pasukanList
      .filter((p) => Number(p.banjar) === b)
      .sort((a, c) => Number(a.saf) - Number(c.saf));
    banjars.push({ banjarNumber: b, members });
  }

  // 3. Cadangan yang benar-benar didaftarkan (maks 3)
  const cadanganArr = Array.isArray(r.cadangan) ? r.cadangan : [];
  const cadangan = [];
  cadanganArr.forEach((c, i) => {
    if (!c || typeof c !== 'object') return;
    const cleanName = String(c.name || '').trim();
    const hasRealName = Boolean(cleanName && cleanName !== '-' && !/^cadangan\s*\d+$/i.test(cleanName));
    const hasRealNisn = Boolean(c.nisn && String(c.nisn).trim() !== '' && String(c.nisn).trim() !== '-');
    const hasRealPhoto = Boolean(c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#'));
    if (!hasRealName && !hasRealNisn && !hasRealPhoto) return;

    const num = i + 1;
    const cid = c.id || `c-${num}`;
    cadangan.push({
      id: cid,
      aliasKeys: getPersonnelAliasKeys(cid),
      code: `C${num}`,
      roleType: 'cadangan',
      name: cleanName || `Cadangan ${num}`,
      photo: c.photo || null,
    });
  });

  const all = [danton, ...pasukanList, ...cadangan];
  return { danton, banjars, cadangan, all };
}

function getSchoolInitials(name) {
  const clean = String(name || 'LB')
    .replace(/^(SDN|SDIT|SD|SMPN|SMPIT|SMP|MTsN|MTs|MIN|MI)\s+/i, '')
    .trim();
  const words = (clean || String(name || 'LB')).split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
  return (words[0] || 'LB').slice(0, 2).toUpperCase();
}

function getPersonInitials(name, fallbackCode = 'P') {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return fallbackCode;
}

function createMonogramDataUrl(schoolName, jenjang) {
  const bg = jenjang === 'SD' ? '#b91c1c' : '#1d4ed8';
  const initials = escapeXml(getSchoolInitials(schoolName));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <rect x="4" y="4" width="88" height="88" rx="18" fill="${bg}"/>
    <text x="48" y="50" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="38" fill="#ffffff">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createPersonPlaceholderDataUrl(name, code) {
  const initials = escapeXml(getPersonInitials(name, code));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="216" height="288" viewBox="0 0 216 288">
    <rect x="0" y="0" width="216" height="288" fill="#f1f5f9"/>
    <circle cx="108" cy="96" r="42" fill="#cbd5e1"/>
    <path d="M34 268 C34 196 66 168 108 168 C150 168 182 196 182 268 Z" fill="#cbd5e1"/>
    <text x="108" y="98" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="34" fill="#475569">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Buat blok NO. DADA menonjol dengan angka besar (misal 282) via SVG
 */
function createBigChestBadgeImg(chestNum, { bg = '#0f172a', width = 68, height = 42 } = {}) {
  const numStr = String(chestNum ?? '-');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect x="0" y="0" width="${width}" height="${height}" rx="3" fill="${bg}"/>
    <text x="${width / 2}" y="11" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="8" letter-spacing="0.8" fill="#cbd5e1">NO. DADA</text>
    <text x="${width / 2}" y="28.5" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="22" letter-spacing="0.4" fill="#ffffff">${escapeXml(numStr)}</text>
  </svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="No. Dada ${escapeHtml(numStr)}" style="display:block; width:${width}px; height:${height}px; flex-shrink:0;" />`;
}

/**
 * Strip 3 kolom checkbox besar (18x18px) sejajar rapi agar mudah dicentang/dicoret dengan pena
 */
function createCheckStackSvgImg(status = 'pending', { width = 104, height = 38 } = {}) {
  const items = [
    { key: 'verified', label: 'Cocok', cx: 17, activeColor: '#059669' },
    { key: 'excused', label: 'Izin', cx: 52, activeColor: '#d97706' },
    { key: 'flagged', label: 'Tidak', cx: 87, activeColor: '#dc2626' },
  ];

  const parts = [];
  const box = 18;
  const labelY = 7;
  const boxY = 16;

  items.forEach((it) => {
    const isChecked = status === it.key;
    const bx = it.cx - box / 2;
    parts.push(
      `<text x="${it.cx}" y="${labelY}" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="8.5" fill="${isChecked ? it.activeColor : '#334155'}">${it.label}</text>`
    );
    if (isChecked) {
      parts.push(`<rect x="${bx}" y="${boxY}" width="${box}" height="${box}" rx="2" fill="${it.activeColor}"/>`);
      parts.push(
        `<path d="M${bx + 4} ${boxY + 9.2} L${bx + 7.5} ${boxY + 12.8} L${bx + 14} ${boxY + 5.4}" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>`
      );
    } else {
      parts.push(`<rect x="${bx + 0.6}" y="${boxY + 0.6}" width="${box - 1.2}" height="${box - 1.2}" rx="2" fill="#ffffff" stroke="#64748b" stroke-width="1.2"/>`);
    }
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="Checklist" style="display:block; width:${width}px; height:${height}px;" />`;
}

async function loadImageAsDataUrl(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Gagal memuat aset kop (${res.status})`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getRawTeamLogoUrl(team) {
  if (!team) return '';
  return (
    (team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? team.files.schoolLogo.url : '') ||
    (typeof team.files?.schoolLogo === 'string' && team.files.schoolLogo.length > 5 ? team.files.schoolLogo : '') ||
    team.file_logo_sekolah ||
    team.logoUrl ||
    team.avatar ||
    ''
  );
}

function tryLoadSquareLogoPng(url, timeoutMs = 2800) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    let done = false;
    const finish = (val) => {
      if (done) return;
      done = true;
      resolve(val);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      clearTimeout(timer);
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return finish(null);
        const size = 128;
        const pad = 2;
        const scale = Math.min((size - pad * 2) / w, (size - pad * 2) / h);
        const dw = Math.max(1, Math.round(w * scale));
        const dh = Math.max(1, Math.round(h * scale));
        const dx = Math.round((size - dw) / 2);
        const dy = Math.round((size - dh) / 2);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, dx, dy, dw, dh);

        const imgData = ctx.getImageData(dx, dy, dw, dh);
        const d = imgData.data;
        const isBlack = (px, py) => {
          const i = (py * dw + px) * 4;
          return d[i + 3] > 240 && d[i] < 16 && d[i + 1] < 16 && d[i + 2] < 16;
        };
        const corners = [[0, 0], [dw - 1, 0], [0, dh - 1], [dw - 1, dh - 1]];
        if (corners.filter(([cx, cy]) => isBlack(cx, cy)).length >= 3) {
          const visited = new Uint8Array(dw * dh);
          const queue = [];
          const enqueue = (x, y) => {
            if (x < 0 || x >= dw || y < 0 || y >= dh) return;
            const pos = y * dw + x;
            if (visited[pos]) return;
            const idx = pos * 4;
            if (d[idx + 3] > 200 && d[idx] < 28 && d[idx + 1] < 28 && d[idx + 2] < 28) {
              visited[pos] = 1;
              queue.push(pos);
            }
          };
          for (let x = 0; x < dw; x++) { enqueue(x, 0); enqueue(x, dh - 1); }
          for (let y = 0; y < dh; y++) { enqueue(0, y); enqueue(dw - 1, y); }
          let head = 0;
          while (head < queue.length) {
            const pos = queue[head++];
            d[pos * 4 + 3] = 0;
            const x = pos % dw;
            const y = (pos - x) / dw;
            enqueue(x + 1, y); enqueue(x - 1, y); enqueue(x, y + 1); enqueue(x, y - 1);
          }
          ctx.putImageData(imgData, dx, dy);
        }
        finish(canvas.toDataURL('image/png'));
      } catch {
        finish(null);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    img.src = url;
  });
}

/**
 * Muat pasfoto personel ke rasio 3:4 HD (216x288px) untuk cetakan seukuran foto 3x4 cm asli
 */
function tryLoadPortraitPhotoJpg(url, timeoutMs = 3000) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || url === '#' || url.startsWith('#')) return resolve(null);
    let done = false;
    const finish = (val) => {
      if (done) return;
      done = true;
      resolve(val);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      clearTimeout(timer);
      try {
        const sw = img.naturalWidth;
        const sh = img.naturalHeight;
        if (!sw || !sh) return finish(null);

        const targetW = 216;
        const targetH = 288; // rasio 3:4 HD
        const targetRatio = targetW / targetH;
        const srcRatio = sw / sh;

        let sx = 0;
        let sy = 0;
        let cropW = sw;
        let cropH = sh;

        if (srcRatio > targetRatio) {
          cropW = sh * targetRatio;
          sx = (sw - cropW) / 2;
        } else {
          cropH = sw / targetRatio;
          sy = Math.max(0, (sh - cropH) * 0.12);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, targetW, targetH);

        finish(canvas.toDataURL('image/jpeg', 0.92));
      } catch {
        finish(null);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    img.src = url;
  });
}

async function resolveRemoteImage(rawUrl, loaderFn) {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl === '#' || rawUrl.startsWith('#')) return null;
  if (rawUrl.startsWith('data:')) return loaderFn(rawUrl, 2000);

  const candidates = [];
  const driveId = extractGoogleDriveFileId(rawUrl);
  if (driveId) {
    candidates.push(`https://lh3.googleusercontent.com/d/${driveId}=w400`);
    candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w400`);
    candidates.push(`https://lh3.googleusercontent.com/d/${driveId}`);
  }
  getImageCandidateUrls(rawUrl).forEach((u) => {
    if (u && !candidates.includes(u)) candidates.push(u);
  });

  for (const c of candidates) {
    const res = await loaderFn(c, 2600);
    if (res) return res;
  }
  return null;
}

async function runWithConcurrency(items, concurrency, worker) {
  let idx = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (idx < items.length) {
      const current = idx++;
      await worker(items[current], current);
    }
  });
  await Promise.all(runners);
}

function getPersonStatusFromInspections(person, inspections = {}) {
  for (const key of person.aliasKeys || [person.id]) {
    const entry = inspections[key];
    if (entry !== undefined) {
      if (entry?.verified === true) return 'verified';
      if (entry?.verified === false && entry?.inspectedAt) {
        if (/sakit|izin/i.test(entry?.note || '')) return 'excused';
        return 'flagged';
      }
      return 'pending';
    }
  }
  return 'pending';
}

function wrapPageHtml({ kopDataUrl, bodyHtml, pageNumber, totalPages }) {
  return `
    <div class="lbb-pdf-page" style="position: relative; width: ${A4_WIDTH_PX}px; height: ${A4_HEIGHT_PX}px; box-sizing: border-box; overflow: hidden; background-color: #ffffff; font-family: ${PDF_FONT_FAMILY}; color: #0f172a;">
      <style>
        .lbb-pdf-page, .lbb-pdf-page * {
          font-family: 'Arial Narrow', Arial, Helvetica, sans-serif !important;
        }
      </style>
      <!-- Kop A4 Full Bleed -->
      <img
        src="${kopDataUrl}"
        alt="Kop LBB Mu'allimin 2027"
        style="position: absolute; left: 0; top: 0; width: ${A4_WIDTH_PX}px; height: ${A4_HEIGHT_PX}px; object-fit: fill; z-index: 1; pointer-events: none;"
      />

      <!-- Area Konten Aman -->
      <div style="position: relative; z-index: 2; width: 100%; height: 100%; box-sizing: border-box; padding: ${PAD_TOP_PX}px ${PAD_X_PX}px ${PAD_BOTTOM_PX}px ${PAD_X_PX}px; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="flex: 1; min-height: 0; display: flex; flex-direction: column;">
          ${bodyHtml}
        </div>

        <!-- Nomor Halaman Minimalis -->
        <div style="margin-top: 4px; text-align: right; font-size: 9px; font-weight: 700; color: #475569;">
          Halaman ${pageNumber} dari ${totalPages}
        </div>
      </div>
    </div>
  `;
}

/**
 * Bangun halaman A4 per peleton dengan pasfoto ukuran 3x4 cm asli (108x144px):
 * - 3 personel per baris, tanpa label Banjar / P1 / Saf, font nama besar, header sekolah besar tanpa label SMP/MTs
 * - Halaman 1: Judul + Identitas + Baris 1 (Hanya Danton di tengah) + Banjar 1, 2, 3
 * - Halaman 2: Identitas ringkas + Banjar 4, 5, 6, 7 (+ Paraf jika tidak ada Cadangan)
 * - Halaman 3 (hanya jika ada Cadangan): Identitas ringkas + Cadangan + Paraf
 */
function buildTeamDP1PagesHtml({ team, staging, structured, logoSrc, photoMap }) {
  const st = staging?.[team.id] || {};
  const inspections = st.dp1Inspections || staging?.dp1?.[team.id]?.personnels || {};
  const roomName = st?.basecamp?.roomName || st?.roomName || team.basecampRoom || team.basecampNumber || '-';
  const chestNum = team.chestNumber || getChestNumberByLot(team.jenjang, team.lotNumber) || '-';

  const { danton, banjars, cadangan, all } = structured;
  const verifiedCount = all.filter((p) => getPersonStatusFromInspections(p, inspections) === 'verified').length;

  const chestBadge = createBigChestBadgeImg(chestNum, {
    bg: '#0f172a',
    width: 68,
    height: 42,
  });

  // Kartu personel: Foto ukuran pasfoto 3x4 cm (~2.86 x 3.81 cm = 108 x 144 px) + Nama besar + Checklist besar
  const renderPersonCard = (person) => {
    const status = getPersonStatusFromInspections(person, inspections);
    const photoSrc = photoMap.get(person.id) || createPersonPlaceholderDataUrl(person.name, person.code);

    const isDanton = person.roleType === 'danton';
    const cardBg = isDanton ? '#fffbeb' : '#ffffff';
    const cardBorder = isDanton ? '1px solid #f59e0b' : '0.75px solid #e2e8f0';

    const checkStackImg = createCheckStackSvgImg(status, { width: 104, height: 38 });

    return `
      <div style="background: ${cardBg}; border: ${cardBorder}; padding: 6px; display: flex; align-items: stretch; gap: 8px; height: 158px; box-sizing: border-box;">
        <!-- Kiri: Pasfoto 3x4 cm -->
        <img
          src="${photoSrc}"
          alt=""
          style="display: block; width: 108px; height: 144px; min-width: 108px; max-width: 108px; flex-shrink: 0; border: 0.75px solid #cbd5e1; align-self: center;"
        />

        <!-- Kanan: Nama Lengkap Besar + Checklist -->
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 2px 0;">
          <div style="flex: 1; display: flex; align-items: center;">
            <div style="font-size: 12.5px; font-weight: 700; color: #0f172a; line-height: 1.2; word-break: break-word; padding-bottom: 4px;">
              ${escapeHtml(person.name || '-')}
            </div>
          </div>

          <div style="border-top: 0.75px solid #e2e8f0; padding-top: 5px;">
            ${checkStackImg}
          </div>
        </div>
      </div>
    `;
  };

  // Identitas Peleton — Rapi tanpa wadah, tanpa sub-teks Danton/Basecamp, logo & nama sekolah besar
  const renderIdentityHeader = (isContinuation = false) => `
    <div style="padding: 2px 0 8px 0; margin-bottom: 9px; border-bottom: 0.75px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
        <img
          src="${logoSrc}"
          alt=""
          style="display: block; width: ${isContinuation ? '34px' : '44px'}; height: ${isContinuation ? '34px' : '44px'}; min-width: ${isContinuation ? '34px' : '44px'}; max-width: ${isContinuation ? '34px' : '44px'}; flex-shrink: 0;"
        />
        <div style="min-width: 0;">
          <div style="font-size: ${isContinuation ? '17px' : '22px'}; font-weight: 700; color: #0f172a; text-transform: uppercase; line-height: 1.1; padding-bottom: 4px;">
            ${escapeHtml(team.schoolName || '-')}${isContinuation ? ' (Lanjutan)' : ''}
          </div>
        </div>
      </div>
      <div style="flex-shrink: 0;">
        ${chestBadge}
      </div>
    </div>
  `;

  const signOffHtml = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed;">
      <tr>
        <td style="width: 44%; border: 0.75px solid #cbd5e1; padding: 4px 8px 7px 8px; vertical-align: top; height: 50px;">
          <div style="font-size: 8.5px; font-weight: 700; color: #334155; text-transform: uppercase;">Catatan Petugas DP 1:</div>
        </td>
        <td style="width: 26%; border: 0.75px solid #cbd5e1; padding: 4px 8px 7px 8px; vertical-align: top;">
          <div style="font-size: 8.5px; font-weight: 700; color: #334155; text-transform: uppercase;">Hasil Inspeksi:</div>
          <div style="font-size: 9.5px; font-weight: 700; color: #0f172a; margin-top: 4px;">
            Cocok: ${verifiedCount > 0 ? verifiedCount : '_____'} / ${all.length} Personel
          </div>
          <div style="font-size: 8.5px; color: #334155; margin-top: 3px;">
            ☐ Lolos DP 2 &nbsp;&nbsp; ☐ Kurang (&lt;22)
          </div>
        </td>
        <td style="width: 15%; border: 0.75px solid #cbd5e1; padding: 4px 6px 7px 6px; vertical-align: top; text-align: center;">
          <div style="font-size: 8px; font-weight: 700; color: #334155; text-transform: uppercase;">Petugas DP 1</div>
        </td>
        <td style="width: 15%; border: 0.75px solid #cbd5e1; padding: 4px 6px 7px 6px; vertical-align: top; text-align: center;">
          <div style="font-size: 8px; font-weight: 700; color: #334155; text-transform: uppercase;">Official Tim</div>
        </td>
      </tr>
    </table>
  `;

  // =========================================================================
  // HALAMAN 1: Judul + Identitas + Baris 1 (Hanya Danton) + Baris 2, 3, 4 (Banjar 1, 2, 3)
  // =========================================================================
  const page1Html = `
    <div style="text-align: center; margin-bottom: 7px;">
      <h2 style="margin: 0; font-size: 16.5px; font-weight: 700; letter-spacing: 0.4px; color: #0f172a; text-transform: uppercase;">
        LEMBAR INSPEKSI DAERAH PERSIAPAN 1
      </h2>
      <p style="margin: 2px 0 0 0; font-size: 10.5px; font-weight: 700; letter-spacing: 0.3px; color: #334155;">
        LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027
      </p>
    </div>

    ${renderIdentityHeader(false)}

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <!-- Baris 1: Hanya Danton di tengah -->
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
        <div></div>
        ${danton ? renderPersonCard(danton) : '<div></div>'}
        <div></div>
      </div>

      <!-- Baris 2, 3, 4: Banjar 1, 2, 3 (masing-masing 3 personel tanpa tulisan Banjar) -->
      ${banjars
        .slice(0, 3)
        .map(
          (b) => `
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
              ${b.members.map((m) => renderPersonCard(m)).join('')}
            </div>
          `
        )
        .join('')}
    </div>
  `;

  // =========================================================================
  // HALAMAN 2: Identitas Ringkas + Banjar 4, 5, 6, 7 (+ Cadangan jika ada) + Paraf
  // Tanpa footer kop, seluruh 5 baris foto 3x4 cm + kotak paraf muat pas di Halaman 2!
  // =========================================================================
  const hasCadangan = cadangan.length > 0;

  const page2Html = `
    ${renderIdentityHeader(true)}

    <div style="display: flex; flex-direction: column; gap: ${hasCadangan ? '7px' : '10px'}; flex: 1;">
      ${banjars
        .slice(3, 7)
        .map(
          (b) => `
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
              ${b.members.map((m) => renderPersonCard(m)).join('')}
            </div>
          `
        )
        .join('')}

      ${
        hasCadangan
          ? `
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
              ${cadangan.slice(0, 3).map((c) => renderPersonCard(c)).join('')}
            </div>
          `
          : ''
      }
    </div>

    ${signOffHtml}
  `;

  return [page1Html, page2Html];
}

/**
 * Ekspor PDF Lembar Inspeksi DP 1 (pasfoto ukuran 3x4 cm asli, 3 personel per baris, kop header tanpa footer)
 * 1 Peleton = Tepat 2 Halaman A4 (siap cetak bolak-balik 1 lembar per peleton)
 */
export async function exportDP1InspectionPDF({
  teams = [],
  staging = {},
  fileLabel = '',
  onProgress = null,
} = {}) {
  const validTeams = Array.isArray(teams) ? teams.filter(Boolean) : [];
  if (validTeams.length === 0) {
    throw new Error('Tidak ada peleton yang dipilih untuk diekspor.');
  }

  if (onProgress) onProgress('Memuat kop header A4...');
  const kopDataUrl = await loadImageAsDataUrl(KOP_IMAGE_URL);

  const teamPayloads = validTeams.map((team) => {
    const structured = buildTeamPersonnelsStructured(team);
    return { team, structured, pageCount: 2 };
  });
  const totalPages = teamPayloads.length * 2;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = `${A4_WIDTH_PX}px`;
  host.style.height = `${A4_HEIGHT_PX}px`;
  host.style.overflow = 'hidden';
  host.style.backgroundColor = '#ffffff';
  host.style.zIndex = '-9999';
  document.body.appendChild(host);

  try {
    let currentPageNum = 0;

    for (let i = 0; i < teamPayloads.length; i++) {
      const { team, structured } = teamPayloads[i];

      if (onProgress) {
        onProgress(
          teamPayloads.length === 1
            ? `Memuat pasfoto ${structured.all.length} personel...`
            : `Memuat foto tim ${i + 1}/${teamPayloads.length}...`
        );
      }

      const logoPromise = resolveRemoteImage(getRawTeamLogoUrl(team), tryLoadSquareLogoPng).then(
        (res) => res || createMonogramDataUrl(team.schoolName, team.jenjang)
      );

      const photoMap = new Map();
      await runWithConcurrency(structured.all, 8, async (person) => {
        if (person.photo) {
          const loaded = await resolveRemoteImage(person.photo, tryLoadPortraitPhotoJpg);
          if (loaded) {
            photoMap.set(person.id, loaded);
            return;
          }
        }
        photoMap.set(person.id, createPersonPlaceholderDataUrl(person.name, person.code));
      });

      const logoSrc = await logoPromise;

      const teamPages = buildTeamDP1PagesHtml({
        team,
        staging,
        structured,
        logoSrc,
        photoMap,
      });

      for (let pIdx = 0; pIdx < teamPages.length; pIdx++) {
        currentPageNum++;
        if (onProgress) {
          onProgress(`Menyusun halaman ${currentPageNum} dari ${totalPages}...`);
        }

        host.innerHTML = wrapPageHtml({
          kopDataUrl,
          bodyHtml: teamPages[pIdx],
          pageNumber: currentPageNum,
          totalPages,
        });

        const imgs = Array.from(host.querySelectorAll('img'));
        await Promise.all(
          imgs.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                })
          )
        );

        const canvas = await html2canvas(host, {
          scale: 2,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.94);
        if (currentPageNum > 1) pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
    }

    const dateStamp = new Date().toISOString().slice(0, 10);
    const sanitizedLabel = fileLabel
      ? String(fileLabel).replace(/[^a-zA-Z0-9_-]/g, '_')
      : validTeams.length === 1
      ? String(validTeams[0].schoolName || 'Peleton').replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Semua_Peleton';

    const fileName = `Lembar_Inspeksi_DP1_${sanitizedLabel}_LBB2027_${dateStamp}.pdf`;
    pdf.save(fileName);

    return { fileName, totalPages };
  } finally {
    document.body.removeChild(host);
  }
}
