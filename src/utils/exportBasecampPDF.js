import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FLOORS_CONFIG, getAllRoomsFlat } from '../data/basecampFloorplanData.js';
import { getImageCandidateUrls, extractGoogleDriveFileId } from '../services/sheetService.js';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const KOP_IMAGE_URL = '/kop-lbb-a4.png';
const PDF_FONT_FAMILY = "'Arial Narrow', Arial, Helvetica, sans-serif";

// Safe area berdasarkan pengukuran langsung KOP LBB.png (2481x3508 = 210x297mm)
const PAD_TOP_PX = 116;
const PAD_BOTTOM_PX = 196;
const PAD_X_PX = 42;
const SAFE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAD_TOP_PX - PAD_BOTTOM_PX; // 811px

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

function truncateText(str, maxLen) {
  const s = String(str || '').trim();
  if (!s) return '';
  if (s.length <= maxLen) return s;
  return `${s.slice(0, Math.max(1, maxLen - 1)).trim()}…`;
}

function getSchoolInitials(name) {
  const clean = String(name || 'LB')
    .replace(/^(SDN|SDIT|SD|SMPN|SMPIT|SMP|MTsN|MTs|MIN|MI)\s+/i, '')
    .trim();
  const words = (clean || String(name || 'LB')).split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
  }
  return (words[0] || 'LB').slice(0, 2).toUpperCase();
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

/**
 * Buat badge/pill SVG sebagai data-URL <img> agar html2canvas merender teks
 * 100% center vertikal & horizontal tanpa pergeseran baseline.
 */
function createSvgBadgeImg({
  text,
  bg = '#0f172a',
  color = '#ffffff',
  border = 'none',
  fontSize = 10,
  height = 18,
  minWidth = 28,
  padX = 7,
  radius = 3,
  bold = true,
}) {
  const str = String(text ?? '');
  const estTextW = Math.ceil(str.length * fontSize * 0.56);
  const width = Math.max(minWidth, estTextW + padX * 2);
  const strokeAttr = border && border !== 'none' ? `stroke="${border}" stroke-width="1"` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="${bg}" ${strokeAttr}/>
    <text x="${width / 2}" y="${height / 2 + 0.5}" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="${bold ? '700' : '400'}" font-size="${fontSize}" fill="${color}">${escapeXml(str)}</text>
  </svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="${escapeHtml(str)}" style="display:inline-block; width:${width}px; height:${height}px; vertical-align:middle; flex-shrink:0;" />`;
}

/**
 * Buat judul seksi polos (A. JENJANG SD / MI, B. JENJANG SMP / MTs) tanpa kotak/background.
 */
function createSectionBannerImg({ text, width = 710, height = 22, fontSize = 12 }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <text x="0" y="${height / 2 + 0.5}" text-anchor="start" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="0.2" fill="#0f172a">${escapeXml(text)}</text>
  </svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="${escapeHtml(text)}" style="display:block; width:100%; height:${height}px; margin-bottom:2px;" />`;
}

/**
 * Render baris header tabel gelap via SVG agar teks 100% rata tengah vertikal tanpa melorot di html2canvas
 */
function createTableHeaderBarImg(columns, { width = 710, height = 28, fontSize = 10 } = {}) {
  let x = 0;
  const parts = [`<rect x="0" y="0" width="${width}" height="${height}" fill="#0f172a"/>`];
  columns.forEach((col, idx) => {
    const colW = col.width;
    if (idx > 0) {
      parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`);
    }
    const lines = Array.isArray(col.lines) ? col.lines : [col.label || ''];
    const align = col.align || 'center';
    const textX = align === 'left' ? x + 8 : x + colW / 2;
    const anchor = align === 'left' ? 'start' : 'middle';

    if (lines.length === 1) {
      parts.push(
        `<text x="${textX}" y="${height / 2 + 0.5}" text-anchor="${anchor}" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="0.3" fill="#ffffff">${escapeXml(lines[0])}</text>`
      );
    } else {
      const lineGap = fontSize + 1.5;
      const startY = height / 2 - ((lines.length - 1) * lineGap) / 2 + 0.5;
      lines.forEach((ln, li) => {
        parts.push(
          `<text x="${textX}" y="${startY + li * lineGap}" text-anchor="${anchor}" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="0.3" fill="#ffffff">${escapeXml(ln)}</text>`
        );
      });
    }
    x += colW;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="Header Tabel" style="display:block; width:100%; height:${height}px;" />`;
}

/**
 * Buat legenda warna denah tanpa wadah/kotak pembungkus, memakai SVG agar kotak warna & teks sejajar sempurna
 */
function createDenahLegendImg({ width = 710, height = 18 } = {}) {
  const items = [
    { label: 'Basecamp SD / MI', fill: '#dc2626', stroke: 'none', dash: '', bold: true },
    { label: 'Basecamp SMP / MTs', fill: '#2563eb', stroke: 'none', dash: '', bold: true },
    { label: 'Kelas Kosong', fill: '#ffffff', stroke: '#94a3b8', dash: '', bold: false },
    { label: 'Fasilitas / Steril', fill: '#e2e8f0', stroke: '#94a3b8', dash: '2,1.5', bold: false },
  ];
  const fontSize = 10;
  const boxSize = 9;
  const gapBoxText = 5;
  const gapItems = 20;

  const measured = items.map((it) => {
    const textW = Math.ceil(it.label.length * fontSize * 0.53);
    return { ...it, textW, totalW: boxSize + gapBoxText + textW };
  });
  const totalWidth =
    measured.reduce((acc, m) => acc + m.totalW, 0) + gapItems * (measured.length - 1);
  let x = Math.round((width - totalWidth) / 2);
  const cy = height / 2;

  const parts = [];
  measured.forEach((m) => {
    const strokeAttr = m.stroke !== 'none' ? `stroke="${m.stroke}" stroke-width="1"` : '';
    const dashAttr = m.dash ? `stroke-dasharray="${m.dash}"` : '';
    parts.push(
      `<rect x="${x}" y="${cy - boxSize / 2}" width="${boxSize}" height="${boxSize}" fill="${m.fill}" ${strokeAttr} ${dashAttr}/>`
    );
    parts.push(
      `<text x="${x + boxSize + gapBoxText}" y="${cy + 0.5}" text-anchor="start" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="${m.bold ? '700' : '400'}" font-size="${fontSize}" fill="#334155">${escapeXml(m.label)}</text>`
    );
    x += m.totalW + gapItems;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="Legenda Denah" style="display:block; width:100%; height:${height}px;" />`;
}

/**
 * Buat label vertikal (Taman Barat / Void Timur) memakai SVG agar lurus & tajam
 */
function createVerticalLabelImg(text, { color = '#047857', width = 22, height = 180, fontSize = 10.5 } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${width / 2} ${height / 2})" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="1.4" fill="${color}">${escapeXml(String(text || '').toUpperCase())}</text>
  </svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="${escapeHtml(text)}" style="display:block; width:${width}px; height:${height}px;" />`;
}

function getDisplaySchoolNameForRoom(roomTeams) {
  if (!roomTeams || roomTeams.length === 0) return '';
  const primary = roomTeams[0];
  if (roomTeams.length >= 2) {
    const base = (primary.schoolBaseName || primary.schoolName || '')
      .replace(/\s+(TIM|PELETON|REGU|PASUKAN)?\s*(A|B|C|D|1|2|3|I|II|III|PUTRA|PUTRI|PA|PI)$/i, '')
      .trim();
    return base || primary.schoolName || '-';
  }
  return primary.schoolName || '-';
}

function getShortNonBasecampLabel(room) {
  if (room.isStairs) return 'Tangga';
  if (room.category === 'international' || room.isInternational) return 'Kelas Internasional';
  return String(room.name || '')
    .replace(/^Ruang Kelas Baru\s*/i, 'R. Baru ')
    .replace(/^Ruangan Baru\s*/i, 'R. Baru ')
    .replace(/^Ruang Cleaning Service$/i, 'Cleaning Service')
    .replace(/^Ruang Organisasi Santri$/i, 'R. Organisasi')
    .replace(/^Kamar Mandi & Ruang Pegawai Dapur$/i, 'KM & Dapur')
    .replace(/^Kamar Mandi Sayap Tengah$/i, 'Kamar Mandi')
    .replace(/^Kamar Mandi & Cleaning Service Barat$/i, 'KM & CS Barat')
    .replace(/^Kamar Mandi & Ruang Cleaning Service Barat$/i, 'KM & CS Barat')
    .replace(/^Ruang Cleaning Service & Kamar Mandi Timur$/i, 'CS & KM Timur')
    .replace(/^Ruang Minum$/i, 'Air Minum')
    .replace(/^Ruang Informasi Panitia & Daftar Ulang$/i, 'Info Panitia & Daftar Ulang')
    .replace(/^MIC Office \(Muallimin International Center\)$/i, 'MIC Office')
    .replace(/^Ruang Bimbingan Konseling \(BK\)$/i, 'Ruang BK')
    .replace(/^Ruang Guru Utama \(Besar\)$/i, 'Ruang Guru Utama')
    .replace(/^Ruang Transit Guru & Kamar Mandi$/i, 'Transit Guru & KM');
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

/**
 * Muat gambar logo sekolah ke kanvas persegi transparan 96x96 dengan proporsi asli terjaga
 * (mencegah distorsi/penyet karena html2canvas tidak mendukung CSS object-fit: contain).
 * Juga mendeteksi & membersihkan latar hitam polos hasil konversi thumbnail JPEG Google Drive.
 */
function tryLoadRemoteImageToSquarePng(url, timeoutMs = 3000) {
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

        const size = 96;
        const pad = 2;
        const maxDraw = size - pad * 2;
        const scale = Math.min(maxDraw / w, maxDraw / h);
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

        // Deteksi apakah thumbnail mengembalikan latar belakang hitam pekat di keempat sudut gambar
        const imgData = ctx.getImageData(dx, dy, dw, dh);
        const d = imgData.data;
        const isBlackPixel = (px, py) => {
          const i = (py * dw + px) * 4;
          return d[i + 3] > 240 && d[i] < 16 && d[i + 1] < 16 && d[i + 2] < 16;
        };

        const corners = [
          [0, 0],
          [dw - 1, 0],
          [0, dh - 1],
          [dw - 1, dh - 1],
        ];
        const blackCornerCount = corners.filter(([cx, cy]) => isBlackPixel(cx, cy)).length;

        // Jika >= 3 sudut adalah hitam pekat (khas PNG transparan yang dijadikan JPEG oleh thumbnail Drive),
        // lakukan flood-fill dari tepi luar untuk mengembalikan transparansi latar belakang saja.
        if (blackCornerCount >= 3) {
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

          for (let x = 0; x < dw; x++) {
            enqueue(x, 0);
            enqueue(x, dh - 1);
          }
          for (let y = 0; y < dh; y++) {
            enqueue(0, y);
            enqueue(dw - 1, y);
          }

          let head = 0;
          while (head < queue.length) {
            const pos = queue[head++];
            const idx = pos * 4;
            d[idx + 3] = 0; // jadikan transparan
            const x = pos % dw;
            const y = (pos - x) / dw;
            enqueue(x + 1, y);
            enqueue(x - 1, y);
            enqueue(x, y + 1);
            enqueue(x, y - 1);
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
 * Preload seluruh logo sekolah menjadi PNG persegi proporsional & transparan
 */
async function preloadTeamLogos(teams) {
  const logoMap = new Map();
  const urlCache = new Map();

  const tasks = teams.map(async (team) => {
    const raw = getRawTeamLogoUrl(team);
    if (!raw) {
      logoMap.set(team.id, createMonogramDataUrl(team.schoolName, team.jenjang));
      return;
    }

    if (urlCache.has(raw)) {
      const cached = urlCache.get(raw);
      logoMap.set(team.id, cached || createMonogramDataUrl(team.schoolName, team.jenjang));
      return;
    }

    const candidates = [];
    const driveId = extractGoogleDriveFileId(raw);
    if (driveId) {
      // Gunakan thumbnail PNG/original yang mempertahankan transparansi lebih baik
      candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w400`);
      candidates.push(`https://lh3.googleusercontent.com/d/${driveId}=s256`);
      candidates.push(`https://lh3.googleusercontent.com/d/${driveId}`);
    }
    getImageCandidateUrls(raw).forEach((u) => {
      if (u && !candidates.includes(u)) candidates.push(u);
    });

    let loadedDataUrl = null;
    for (const candidateUrl of candidates) {
      loadedDataUrl = await tryLoadRemoteImageToSquarePng(candidateUrl, 2600);
      if (loadedDataUrl) break;
    }

    urlCache.set(raw, loadedDataUrl);
    logoMap.set(team.id, loadedDataUrl || createMonogramDataUrl(team.schoolName, team.jenjang));
  });

  await Promise.all(tasks);
  return logoMap;
}

function resolveTeamRoomCode(team, staging, candidateRooms) {
  if (!team) return '';
  const st = staging?.[team.id] || staging?.basecamp?.[team.id] || null;
  const raw = (
    st?.basecamp?.roomName ||
    st?.roomName ||
    st?.basecampRoom ||
    st?.room ||
    team.basecampRoom ||
    team.basecampNumber ||
    ''
  ).trim();
  if (!raw) return '';
  const matched = candidateRooms.find(
    (r) => r.code.toUpperCase() === raw.toUpperCase() || r.name.toUpperCase() === raw.toUpperCase()
  );
  return matched ? matched.code : '';
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

      <!-- Area Konten Aman di antara Header & Footer Kop -->
      <div style="position: relative; z-index: 2; width: 100%; height: 100%; box-sizing: border-box; padding: ${PAD_TOP_PX}px ${PAD_X_PX}px ${PAD_BOTTOM_PX}px ${PAD_X_PX}px; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="flex: 1; min-height: 0;">
          ${bodyHtml}
        </div>

        <!-- Nomor Halaman Minimalis -->
        <div style="margin-top: 6px; text-align: right; font-size: 9.5px; font-weight: 700; color: #475569;">
          Halaman ${pageNumber} dari ${totalPages}
        </div>
      </div>
    </div>
  `;
}

/**
 * Bangun halaman HTML untuk Daftar Lokasi Basecamp (SD/MI & SMP/MTs) — bersih & formal
 */
function buildLocationPagesHtml({ teams, staging, logoMap }) {
  const allRooms = getAllRoomsFlat();
  const candidateRooms = allRooms.filter((r) => r.isBasecampCandidate);

  const roomMapByCode = new Map();
  candidateRooms.forEach((r) => roomMapByCode.set(r.code.toUpperCase(), r));

  // Hitung jumlah tim per ruang (deteksi 1 sekolah 2 peleton)
  const roomCounts = new Map();
  const enriched = teams.map((team) => {
    const roomCode = resolveTeamRoomCode(team, staging, candidateRooms);
    const roomMeta = roomCode ? roomMapByCode.get(roomCode.toUpperCase()) || null : null;
    if (roomCode) {
      const k = roomCode.toUpperCase();
      roomCounts.set(k, (roomCounts.get(k) || 0) + 1);
    }
    return {
      team,
      roomCode,
      roomMeta,
      logoSrc: logoMap.get(team.id) || createMonogramDataUrl(team.schoolName, team.jenjang),
      dantonName: team.dantonName || team.roster?.danton?.name || '-',
      chestNumber: team.chestNumber ? String(team.chestNumber) : '-',
    };
  });

  const sdRows = enriched.filter((e) => e.team.jenjang === 'SD');
  const smpRows = enriched.filter((e) => e.team.jenjang === 'SMP');
  const otherRows = enriched.filter((e) => e.team.jenjang !== 'SD' && e.team.jenjang !== 'SMP');

  const sections = [];
  if (sdRows.length > 0) {
    sections.push({
      key: 'SD',
      title: 'A. JENJANG SD / MI',
      accentBg: '#fef2f2',
      accentBorder: '#e2e8f0',
      accentText: '#991b1b',
      rows: sdRows,
    });
  }
  if (smpRows.length > 0) {
    sections.push({
      key: 'SMP',
      title: sections.length > 0 ? 'B. JENJANG SMP / MTs' : 'A. JENJANG SMP / MTs',
      accentBg: '#eff6ff',
      accentBorder: '#e2e8f0',
      accentText: '#1e40af',
      rows: smpRows,
    });
  }
  if (otherRows.length > 0) {
    sections.push({
      key: 'LAINNYA',
      title: 'KONTINGEN LAINNYA',
      accentBg: '#f8fafc',
      accentBorder: '#e2e8f0',
      accentText: '#334155',
      rows: otherRows,
    });
  }

  const getFloorBadgeColors = (floor) => {
    switch (Number(floor)) {
      case 1:
        return { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7' };
      case 2:
        return { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' };
      case 3:
        return { bg: '#eef2ff', color: '#3730a3', border: '#a5b4fc' };
      case 4:
        return { bg: '#fffbeb', color: '#92400e', border: '#fcd34d' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
    }
  };

  const tableWidth = A4_WIDTH_PX - PAD_X_PX * 2; // 710px
  const tableColumns = [
    { width: 30, lines: ['NO'], align: 'center' },
    { width: 52, lines: ['NO. DADA'], align: 'center' },
    { width: 256, lines: ['PELETON / SEKOLAH'], align: 'left' },
    { width: 172, lines: ['KOMANDAN PELETON'], align: 'left' },
    { width: 58, lines: ['RUANG'], align: 'center' },
    { width: 54, lines: ['LANTAI'], align: 'center' },
    { width: 88, lines: ['KETERANGAN'], align: 'center' },
  ];

  const tableHeaderImg = createTableHeaderBarImg(tableColumns, {
    width: tableWidth,
    height: 28,
    fontSize: 10,
  });

  const colgroupHtml = `
    <colgroup>
      ${tableColumns.map((c) => `<col style="width: ${c.width}px;" />`).join('')}
    </colgroup>
  `;

  const renderRow = (item, rowNumber, zebra) => {
    const { team, roomCode, roomMeta, logoSrc, dantonName, chestNumber } = item;
    const sharedCount = roomCode ? roomCounts.get(roomCode.toUpperCase()) || 1 : 0;
    const bg = zebra ? '#f8fafc' : '#ffffff';

    let noteHtml = '<span style="color:#94a3b8;">-</span>';
    if (roomCode) {
      if (sharedCount >= 2) {
        noteHtml = '<span style="color:#92400e; font-weight:700; font-size:10px;">1 Sekolah</span>';
      } else {
        const wingShort =
          roomMeta?.wing === 'north'
            ? 'Koridor Utara'
            : roomMeta?.wing === 'west'
            ? 'Sayap Barat'
            : roomMeta?.wing === 'center'
            ? 'Sayap Tengah'
            : roomMeta?.wing === 'east'
            ? 'Sayap Timur'
            : '-';
        noteHtml = `<span style="color:#475569; font-size:10px;">${escapeHtml(wingShort)}</span>`;
      }
    }

    const roomBadge = roomCode
      ? createSvgBadgeImg({
          text: roomCode,
          bg: '#0f172a',
          color: '#ffffff',
          border: 'none',
          fontSize: 10.5,
          height: 19,
          minWidth: 34,
          padX: 7,
          radius: 2,
        })
      : '<span style="color:#cbd5e1;">-</span>';

    const floorBadge = roomMeta?.floor
      ? createSvgBadgeImg({
          text: `Lt. ${roomMeta.floor}`,
          ...getFloorBadgeColors(roomMeta.floor),
          fontSize: 9.5,
          height: 18,
          minWidth: 36,
          padX: 6,
          radius: 2,
        })
      : '<span style="color:#cbd5e1;">-</span>';

    return `
      <tr style="background-color: ${bg}; font-size: 10.5px; line-height: 1.25; color: #0f172a;">
        <td style="padding: 3px 4px 8px 4px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569; font-weight: 700;">${rowNumber}</td>
        <td style="padding: 3px 4px 8px 4px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a;">${escapeHtml(chestNumber)}</td>
        <td style="padding: 4px 7px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <img src="${logoSrc}" alt="" style="display: block; width: 20px; height: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0;" />
            <div style="font-weight: 700; color: #0f172a; font-size: 10.5px; line-height: 1.2; padding-bottom: 3px;">
              ${escapeHtml(team.schoolName || '-')}
            </div>
          </div>
        </td>
        <td style="padding: 3px 7px 8px 7px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #334155; font-size: 10px; line-height: 1.25;">${escapeHtml(dantonName)}</td>
        <td style="padding: 4px 4px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0;">${roomBadge}</td>
        <td style="padding: 4px 4px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0;">${floorBadge}</td>
        <td style="padding: 3px 6px 8px 6px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0;">${noteHtml}</td>
      </tr>
    `;
  };

  const docHeaderHtml = `
    <div style="text-align: center; margin-bottom: 12px;">
      <h2 style="margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.4px; color: #0f172a; text-transform: uppercase;">
        DAFTAR PENEMPATAN RUANG BASECAMP PESERTA
      </h2>
      <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: #334155;">
        LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027
      </p>
    </div>
  `;

  // Paginasi berbasis anggaran tinggi konten agar tidak menabrak footer KOP
  const MAX_BUDGET_PX = SAFE_CONTENT_HEIGHT_PX - 26;
  const pages = [];
  let currentHtmlParts = [docHeaderHtml];
  let currentHeight = 52;

  const flushPage = () => {
    pages.push(currentHtmlParts.join(''));
    currentHtmlParts = [];
    currentHeight = 0;
  };

  const estimateRowHeight = (item) => {
    const schoolLen = (item.team.schoolName || '').length;
    const dantonLen = (item.dantonName || '').length;
    const lines = Math.max(schoolLen > 34 ? 2 : 1, dantonLen > 28 ? 2 : 1);
    return lines === 2 ? 42 : 34;
  };

  if (sections.length === 0) {
    currentHtmlParts.push(`
      <div style="padding: 36px 20px; text-align: center; border: 1px solid #cbd5e1; color: #64748b; font-size: 11px;">
        Belum ada data peleton yang terdaftar untuk ditampilkan.
      </div>
    `);
    flushPage();
    return pages;
  }

  sections.forEach((sec, secIdx) => {
    let rowIndex = 0;
    let isContinuation = false;

    while (rowIndex < sec.rows.length) {
      const sectionHeaderH = 26;
      const tableHeadH = 26;
      const firstRowH = estimateRowHeight(sec.rows[rowIndex]);
      const neededMin = (secIdx > 0 && currentHeight > 0 ? 12 : 0) + sectionHeaderH + tableHeadH + firstRowH + 8;

      if (currentHeight > 0 && currentHeight + neededMin > MAX_BUDGET_PX) {
        flushPage();
      }

      const marginTop = currentHeight > 0 ? 12 : 0;
      const titleSuffix = isContinuation ? ' (Lanjutan)' : '';

      const chunkRowsHtml = [];
      currentHeight += marginTop + sectionHeaderH + tableHeadH + 4;

      while (rowIndex < sec.rows.length) {
        const item = sec.rows[rowIndex];
        const rH = estimateRowHeight(item);
        if (chunkRowsHtml.length > 0 && currentHeight + rH > MAX_BUDGET_PX) {
          break;
        }
        chunkRowsHtml.push(renderRow(item, rowIndex + 1, rowIndex % 2 === 1));
        currentHeight += rH;
        rowIndex++;
      }

      // Ujung tabel tegas tanpa rounded corner, judul seksi SVG dead-center vertikal & horizontal
      const sectionBanner = createSectionBannerImg({
        text: `${sec.title}${titleSuffix}`,
        bg: sec.accentBg,
        border: sec.accentBorder,
        color: sec.accentText,
        width: A4_WIDTH_PX - PAD_X_PX * 2,
        height: 24,
        fontSize: 11.5,
      });

      currentHtmlParts.push(`
        <div style="margin-top: ${marginTop}px;">
          ${sectionBanner}
          ${tableHeaderImg}
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
            ${colgroupHtml}
            <tbody>
              ${chunkRowsHtml.join('')}
            </tbody>
          </table>
        </div>
      `);

      isContinuation = true;
      if (rowIndex < sec.rows.length) {
        flushPage();
      }
    }
  });

  if (currentHtmlParts.length > 0) {
    flushPage();
  }

  return pages;
}

/**
 * Bangun halaman HTML untuk Denah Basecamp per Lantai (Lantai 1 sampai Lantai 4) — bersih tanpa elemen tidak penting
 */
function buildFloorplanPagesHtml({ teams, staging, logoMap }) {
  const allRooms = getAllRoomsFlat();

  const roomTeamsMap = new Map();
  allRooms.forEach((room) => {
    if (!room.isBasecampCandidate) return;
    const assigned = teams.filter((t) => {
      const st = staging?.[t.id] || staging?.basecamp?.[t.id] || null;
      const rName = (
        st?.basecamp?.roomName ||
        st?.roomName ||
        st?.basecampRoom ||
        st?.room ||
        t.basecampRoom ||
        t.basecampNumber ||
        ''
      ).trim();
      if (!rName) return false;
      const clean = rName.toUpperCase();
      return clean === room.code.toUpperCase() || clean === room.name.toUpperCase();
    });
    roomTeamsMap.set(room.id, assigned);
  });

  const renderRoomCard = (room, { compact = false } = {}) => {
    const assignedTeams = roomTeamsMap.get(room.id) || [];

    // 1. NON-BASECAMP ROOM
    if (!room.isBasecampCandidate) {
      const isSteril = Boolean(room.category === 'international' || room.isInternational);
      const bg = isSteril ? '#f8fafc' : '#f1f5f9';
      const border = isSteril ? '1px dashed #cbd5e1' : '1px solid #cbd5e1';
      const labelColor = isSteril ? '#94a3b8' : '#334155';
      const shortLabel = getShortNonBasecampLabel(room);

      const codeBadge = createSvgBadgeImg({
        text: room.code || '-',
        bg: '#ffffff',
        color: '#64748b',
        border: '#cbd5e1',
        fontSize: compact ? 8 : 8.5,
        height: compact ? 15 : 16,
        minWidth: 26,
        padX: 4,
        radius: 2,
      });

      const sterilBadge = isSteril
        ? createSvgBadgeImg({
            text: 'STERIL',
            bg: '#f1f5f9',
            color: '#94a3b8',
            border: '#cbd5e1',
            fontSize: 7.5,
            height: 15,
            minWidth: 34,
            padX: 4,
            radius: 2,
          })
        : '';

      return `
        <div style="background: ${bg}; border: ${border}; border-radius: 4px; padding: ${compact ? '6px 5px 10px 5px' : '9px 9px 13px 9px'}; display: flex; flex-direction: column; justify-content: center; gap: ${compact ? '4px' : '6px'}; min-height: ${compact ? '44px' : '54px'}; box-sizing: border-box;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
            ${codeBadge}
            ${sterilBadge}
          </div>
          <div style="font-size: ${compact ? '9px' : '10px'}; font-weight: 700; color: ${labelColor}; line-height: 1.2;">
            ${escapeHtml(shortLabel)}
          </div>
        </div>
      `;
    }

    // 2. BASECAMP CANDIDATE ROOM
    const hasTeam = assignedTeams.length > 0;
    const primary = assignedTeams[0] || null;
    const isShared = assignedTeams.length >= 2;
    const isSD = primary?.jenjang === 'SD';
    const schoolDisplay = hasTeam ? getDisplaySchoolNameForRoom(assignedTeams) : '';
    const chestList = assignedTeams.map((t) => t.chestNumber).filter(Boolean);
    const logoSrc = primary
      ? logoMap.get(primary.id) || createMonogramDataUrl(primary.schoolName, primary.jenjang)
      : '';

    const cardBg = !hasTeam ? '#ffffff' : isSD ? '#fef2f2' : '#eff6ff';
    const cardBorder = !hasTeam
      ? '1px solid #cbd5e1'
      : isSD
      ? '1.5px solid #fca5a5'
      : '1.5px solid #93c5fd';
    const codeBg = !hasTeam ? '#e2e8f0' : isSD ? '#dc2626' : '#2563eb';
    const codeColor = !hasTeam ? '#334155' : '#ffffff';

    const roomCodeBadge = createSvgBadgeImg({
      text: room.code,
      bg: codeBg,
      color: codeColor,
      border: 'none',
      fontSize: compact ? 9 : 10,
      height: compact ? 16 : 18,
      minWidth: compact ? 22 : 26,
      padX: 5,
      radius: 2,
    });

    const rightBadge = hasTeam
      ? createSvgBadgeImg({
          text: compact ? primary.jenjang || '' : isShared ? `1 SEKOLAH · ${primary.jenjang}` : primary.jenjang || '',
          bg: isSD ? '#fee2e2' : '#dbeafe',
          color: isSD ? '#991b1b' : '#1e40af',
          border: isSD ? '#fca5a5' : '#93c5fd',
          fontSize: compact ? 8 : 8.5,
          height: compact ? 15 : 17,
          minWidth: compact ? 22 : 26,
          padX: compact ? 4 : 5,
          radius: 2,
        })
      : createSvgBadgeImg({
          text: 'KOSONG',
          bg: '#f1f5f9',
          color: '#94a3b8',
          border: '#e2e8f0',
          fontSize: 7.5,
          height: 15,
          minWidth: 36,
          padX: 4,
          radius: 2,
        });

    const dantonText = !compact && !isShared && primary?.dantonName
      ? truncateText(primary.dantonName, 22)
      : '';

    return `
      <div style="background: ${cardBg}; border: ${cardBorder}; border-radius: 4px; padding: ${compact ? '6px 5px 7px 5px' : '7px 8px 8px 8px'}; display: flex; flex-direction: column; justify-content: space-between; gap: 5px; min-height: ${compact ? '106px' : '86px'}; box-sizing: border-box;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 3px;">
          ${roomCodeBadge}
          ${rightBadge}
        </div>

        ${
          hasTeam
            ? compact
              ? `
                <!-- Koridor Utara: Logo persegi di atas teks (rata tengah) agar tidak pernah kepenyet -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; flex: 1;">
                  <img src="${logoSrc}" alt="" style="display: block; width: 22px; height: 22px; min-width: 22px; max-width: 22px; flex-shrink: 0;" />
                  <div style="font-size: 8.5px; font-weight: 700; color: #0f172a; line-height: 1.18; padding-bottom: 2px;">
                    ${escapeHtml(schoolDisplay)}
                  </div>
                </div>

                <div style="text-align: center; border-top: 1px solid rgba(15,23,42,0.09); padding-top: 2px; padding-bottom: 2px; font-size: 8.5px; font-weight: 700; color: #334155;">
                  ${chestList.length > 0 ? chestList.map((n) => `#${escapeHtml(n)}`).join(' · ') : 'No. Dada: -'}
                </div>
              `
              : `
                <!-- Sayap: Logo persegi proporsional di kiri + nama sekolah -->
                <div style="display: flex; align-items: center; gap: 7px; flex: 1;">
                  <img src="${logoSrc}" alt="" style="display: block; width: 24px; height: 24px; min-width: 24px; max-width: 24px; flex-shrink: 0;" />
                  <div style="font-size: 10.5px; font-weight: 700; color: #0f172a; line-height: 1.2; padding-bottom: 2px;">
                    ${escapeHtml(schoolDisplay)}
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; border-top: 1px solid rgba(15,23,42,0.09); padding-top: 2px; padding-bottom: 2px;">
                  <span style="font-size: 9.5px; font-weight: 700; color: #334155;">
                    ${chestList.length > 0 ? chestList.map((n) => `#${escapeHtml(n)}`).join(' · ') : 'No. Dada: -'}
                  </span>
                  ${
                    dantonText
                      ? `<span style="font-size: 8.5px; color: #475569; text-align: right;">${escapeHtml(dantonText)}</span>`
                      : ''
                  }
                </div>
              `
            : `
              <div style="flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding-bottom: 4px;">
                <span style="font-size: 9.5px; font-weight: 400; color: #94a3b8;">${escapeHtml(room.name)}</span>
              </div>
            `
        }
      </div>
    `;
  };

  // Tentukan lantai tertinggi yang terisi basecamp; jika hanya sampai Lantai 3, jangan sertakan Lantai 4
  let maxUsedFloor = 0;
  allRooms.forEach((room) => {
    if (room.isBasecampCandidate && (roomTeamsMap.get(room.id)?.length || 0) > 0) {
      if (room.floor > maxUsedFloor) maxUsedFloor = room.floor;
    }
  });
  const floorsToExport = FLOORS_CONFIG.filter((f) =>
    maxUsedFloor > 0 ? f.floor <= maxUsedFloor : f.floor <= 3
  );

  return floorsToExport.map((floorCfg) => {
    const northZone = floorCfg.zones.find((z) => z.wing === 'north');
    const westZone = floorCfg.zones.find((z) => z.wing === 'west');
    const centerZone = floorCfg.zones.find((z) => z.wing === 'center');
    const eastZone = floorCfg.zones.find((z) => z.wing === 'east');

    const northRooms = northZone?.rooms || [];
    const westRooms = westZone?.rooms || [];
    const centerRooms = centerZone?.rooms || [];
    const eastRooms = eastZone?.rooms || [];

    // Susun Koridor Utara (khusus Lantai 1: KM-DPR & R-MINUM ditumpuk di kolom pertama)
    let northGridHtml = '';
    if (floorCfg.floor === 1) {
      const kmDpr = northRooms.find((r) => r.code === 'KM-DPR');
      const rMinum = northRooms.find((r) => r.code === 'R-MINUM');
      const remaining = northRooms.filter((r) => r.code !== 'KM-DPR' && r.code !== 'R-MINUM');
      const colCount = remaining.length + (kmDpr && rMinum ? 1 : 0);
      northGridHtml = `
        <div style="display: grid; grid-template-columns: repeat(${colCount}, minmax(0, 1fr)); gap: 5px; align-items: stretch;">
          ${
            kmDpr && rMinum
              ? `<div style="display: flex; flex-direction: column; gap: 5px;">
                   ${renderRoomCard(kmDpr, { compact: true })}
                   ${renderRoomCard(rMinum, { compact: true })}
                 </div>`
              : ''
          }
          ${remaining.map((r) => renderRoomCard(r, { compact: true })).join('')}
        </div>
      `;
    } else {
      const colCount = Math.max(1, northRooms.length);
      northGridHtml = `
        <div style="display: grid; grid-template-columns: repeat(${colCount}, minmax(0, 1fr)); gap: 5px; align-items: stretch;">
          ${northRooms.map((r) => renderRoomCard(r, { compact: true })).join('')}
        </div>
      `;
    }

    const renderWingColumn = (label, rooms) => `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 7px; display: flex; flex-direction: column; gap: 6px;">
        <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #334155; text-align: center; padding: 1px 0 7px 0; border-bottom: 1px solid #cbd5e1;">
          ${escapeHtml(label)}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
          ${rooms.map((r) => renderRoomCard(r, { compact: false })).join('')}
        </div>
      </div>
    `;

    const renderGardenStrip = (label) => `
      <div style="background: #ecfdf5; border: 1px dashed #6ee7b7; display: flex; align-items: center; justify-content: center; padding: 4px 0;">
        ${createVerticalLabelImg(label, { color: '#047857', width: 22, height: 180, fontSize: 10.5 })}
      </div>
    `;

    return `
      <!-- Header Halaman Denah Bersih -->
      <div style="text-align: center; margin-bottom: 6px;">
        <h2 style="margin: 0; font-size: 17px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.4px;">
          DENAH BASECAMP LANTAI ${floorCfg.floor}
        </h2>
      </div>

      <!-- Legenda Warna Tanpa Wadah -->
      <div style="margin-bottom: 10px;">
        ${createDenahLegendImg({ width: A4_WIDTH_PX - PAD_X_PX * 2, height: 18 })}
      </div>

      <!-- 1. KORIDOR UTARA -->
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; margin-bottom: 10px;">
        <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; text-align: center; padding: 1px 0 7px 0; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1;">
          Koridor Utara · Lantai ${floorCfg.floor}
        </div>
        ${northGridHtml}
      </div>

      <!-- 2. TIGA SAYAP SELATAN + 2 JALUR TAMAN/VOID -->
      <div style="display: grid; grid-template-columns: 1fr 30px 1fr 30px 1fr; gap: 7px; align-items: stretch;">
        ${renderWingColumn('Sayap Barat', westRooms)}
        ${renderGardenStrip(floorCfg.floor === 1 ? 'Taman Barat' : 'Void Barat')}
        ${renderWingColumn('Sayap Tengah', centerRooms)}
        ${renderGardenStrip(floorCfg.floor === 1 ? 'Taman Timur' : 'Void Timur')}
        ${renderWingColumn('Sayap Timur', eastRooms)}
      </div>
    `;
  });
}

/**
 * Ekspor PDF Lokasi Basecamp & Denah Basecamp menggunakan Kop A4 penuh (/kop-lbb-a4.png)
 */
export async function exportBasecampPDF({
  teams = [],
  staging = {},
  isPublished = false,
  mode = 'all',
  onProgress = null,
} = {}) {
  if (onProgress) onProgress('Memuat kop surat & logo sekolah...');
  const [kopDataUrl, logoMap] = await Promise.all([
    loadImageAsDataUrl(KOP_IMAGE_URL),
    preloadTeamLogos(teams),
  ]);

  const pageBodies = [];
  if (mode === 'all' || mode === 'locations') {
    const locPages = buildLocationPagesHtml({ teams, staging, logoMap });
    locPages.forEach((html) => pageBodies.push({ bodyHtml: html }));
  }

  if (mode === 'all' || mode === 'floorplan') {
    const mapPages = buildFloorplanPagesHtml({ teams, staging, logoMap });
    mapPages.forEach((html) => pageBodies.push({ bodyHtml: html }));
  }

  if (pageBodies.length === 0) {
    throw new Error('Tidak ada halaman yang dapat diekspor.');
  }

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
    const totalPages = pageBodies.length;

    for (let i = 0; i < totalPages; i++) {
      if (onProgress) {
        onProgress(`Menyusun halaman ${i + 1} dari ${totalPages}...`);
      }

      host.innerHTML = wrapPageHtml({
        kopDataUrl,
        bodyHtml: pageBodies[i].bodyHtml,
        pageNumber: i + 1,
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

      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      if (i > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    const dateStamp = new Date().toISOString().slice(0, 10);
    const filePrefix =
      mode === 'locations'
        ? 'Daftar_Lokasi_Basecamp'
        : mode === 'floorplan'
        ? 'Denah_Basecamp'
        : 'Basecamp_dan_Denah_Lengkap';

    const fileName = `${filePrefix}_LBB_Muallimin_2027_${dateStamp}.pdf`;
    pdf.save(fileName);

    return { fileName, totalPages };
  } finally {
    document.body.removeChild(host);
  }
}
