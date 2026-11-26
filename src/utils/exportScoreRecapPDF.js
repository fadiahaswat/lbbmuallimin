import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getChestNumberByLot, isTestingTeam } from '../context/competitionHelpers.js';
import { getImageCandidateUrls, extractGoogleDriveFileId } from '../services/sheetService.js';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const KOP_IMAGE_URL = '/kop-lbb-a4.png';
const PDF_FONT_FAMILY = "'Arial Narrow', Arial, Helvetica, sans-serif";

// Safe area berdasarkan pengukuran KOP LBB.png (2481x3508 = 210x297mm)
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

function getSchoolInitials(name) {
  const clean = String(name || 'LB')
    .replace(/^(SDN|SDIT|SD|SMPN|SMPIT|SMP|MTsN|MTs|MIN|MI)\s+/i, '')
    .trim();
  const words = (clean || String(name || 'LB')).split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
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

function createSectionBannerImg({ text, width = 710, height = 22, fontSize = 12 }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <text x="0" y="${height / 2 + 0.5}" text-anchor="start" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="0.2" fill="#0f172a">${escapeXml(text)}</text>
  </svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="${escapeHtml(text)}" style="display:block; width:100%; height:${height}px; margin-bottom:2px;" />`;
}

function createTableHeaderBarImg(columns, { width = 710, height = 30, fontSize = 9.5 } = {}) {
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
    team.schoolLogoUrl ||
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
        const size = 96;
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
      candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w400`);
      candidates.push(`https://lh3.googleusercontent.com/d/${driveId}=s256`);
      candidates.push(`https://lh3.googleusercontent.com/d/${driveId}`);
    }
    getImageCandidateUrls(raw).forEach((u) => {
      if (u && !candidates.includes(u)) candidates.push(u);
    });

    let loadedDataUrl = null;
    for (const candidateUrl of candidates) {
      loadedDataUrl = await tryLoadSquareLogoPng(candidateUrl, 2600);
      if (loadedDataUrl) break;
    }

    urlCache.set(raw, loadedDataUrl);
    logoMap.set(team.id, loadedDataUrl || createMonogramDataUrl(team.schoolName, team.jenjang));
  });

  await Promise.all(tasks);
  return logoMap;
}

function extractScoreMetrics(teamId, scores = {}) {
  const sc = scores[teamId];
  if (!sc) {
    return {
      hasScore: false,
      j1Peleton: 0,
      j2Peleton: 0,
      j3Peleton: 0,
      nilaiMurniPeleton: 0,
      peletonPenalty: 0,
      nilaiAkhirPeleton: 0,
      j1Danton: 0,
      j2Danton: 0,
      j3Danton: 0,
      nilaiMurniDanton: 0,
      dantonPenalty: 0,
      nilaiAkhirDanton: 0,
      dantonMateri: 0,
      dantonVokal: 0,
    };
  }

  const juries = sc.juries || {};
  const j1Peleton = Number(juries.pos1?.peletonTotal ?? juries.pos1?.total ?? sc.pbb?.j1 ?? 0);
  const j2Peleton = Number(juries.pos2?.peletonTotal ?? juries.pos2?.total ?? sc.pbb?.j2 ?? 0);
  const j3Peleton = Number(juries.pos3?.peletonTotal ?? sc.pbb?.j3 ?? 0);

  const j1Danton = Number(juries.pos1?.dantonTotal ?? sc.danton?.j1 ?? 0);
  const j2Danton = Number(juries.pos2?.dantonTotal ?? sc.danton?.j2 ?? 0);
  const j3Danton = Number(juries.pos3?.dantonTotal ?? sc.danton?.j3 ?? 0);

  const j1Mat = Number(juries.pos1?.dantonRubricScores?.materi ?? 0);
  const j2Mat = Number(juries.pos2?.dantonRubricScores?.materi ?? 0);
  const j3Mat = Number(juries.pos3?.dantonRubricScores?.materi ?? 0);
  const dantonMateri = (j1Mat + j2Mat + j3Mat) > 0 ? (j1Mat + j2Mat + j3Mat) : Number(sc.danton?.rubricScores?.materi ?? 0);

  const j1Vok = Number(juries.pos1?.dantonRubricScores?.vokal ?? 0);
  const j2Vok = Number(juries.pos2?.dantonRubricScores?.vokal ?? 0);
  const j3Vok = Number(juries.pos3?.dantonRubricScores?.vokal ?? 0);
  const dantonVokal = (j1Vok + j2Vok + j3Vok) > 0 ? (j1Vok + j2Vok + j3Vok) : Number(sc.danton?.rubricScores?.vokal ?? 0);

  const nilaiMurniPeleton = Number(sc.nilaiMurniPeleton ?? sc.pbbTotal ?? sc.pbb?.total ?? (j1Peleton + j2Peleton + j3Peleton));
  const peletonPenalty = Number(sc.penalties?.peletonPenalty ?? sc.penaltiesTotal ?? sc.penalties?.totalPenalty ?? 0);
  const nilaiAkhirPeleton = Number(sc.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2))));

  const nilaiMurniDanton = Number(sc.nilaiMurniDanton ?? sc.dantonTotal ?? sc.danton?.total ?? parseFloat((j1Danton + j2Danton + j3Danton).toFixed(2)));
  const dantonPenalty = Number(sc.penalties?.dantonPenalty ?? 0);
  const nilaiAkhirDanton = Number(sc.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2))));

  return {
    hasScore: true,
    j1Peleton,
    j2Peleton,
    j3Peleton,
    nilaiMurniPeleton,
    peletonPenalty,
    nilaiAkhirPeleton,
    j1Danton,
    j2Danton,
    j3Danton,
    nilaiMurniDanton,
    dantonPenalty,
    nilaiAkhirDanton,
    dantonMateri,
    dantonVokal,
  };
}

function getChestNumStr(team) {
  const raw = team?.chestNumber || getChestNumberByLot(team?.jenjang, team?.lotNumber);
  return raw ? String(raw) : '-';
}

function fmtScoreVal(val, hasScore) {
  if (!hasScore) return '-';
  const num = Number(val);
  if (!Number.isFinite(num)) return '-';
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

function fmtPenaltyVal(val, hasScore) {
  if (!hasScore) return '-';
  const num = Number(val);
  if (!Number.isFinite(num) || num === 0) return '0';
  return `-${Number.isInteger(num) ? String(num) : num.toFixed(2)}`;
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
 * Bangun halaman untuk 1 kategori penilaian ('peleton' atau 'danton') secara terpisah
 */
function buildCategoryPages({
  categoryType,
  teams,
  scores,
  jenjangScope,
  logoMap,
  includeBaOpening = false,
  partPrefix = '',
  includeSignatureAtEnd = false,
}) {
  const comparePeleton = (a, b) => {
    const mA = a.metrics;
    const mB = b.metrics;
    if (mB.hasScore !== mA.hasScore) return mB.hasScore ? 1 : -1;
    if (mA.hasScore && mB.hasScore) {
      if (mB.nilaiAkhirPeleton !== mA.nilaiAkhirPeleton) return mB.nilaiAkhirPeleton - mA.nilaiAkhirPeleton;
      if (mB.nilaiMurniPeleton !== mA.nilaiMurniPeleton) return mB.nilaiMurniPeleton - mA.nilaiMurniPeleton;
      if (mA.peletonPenalty !== mB.peletonPenalty) return mA.peletonPenalty - mB.peletonPenalty;
      if (mB.nilaiMurniDanton !== mA.nilaiMurniDanton) return mB.nilaiMurniDanton - mA.nilaiMurniDanton;
    }
    const cA = parseInt(a.chestNumber, 10) || 9999;
    const cB = parseInt(b.chestNumber, 10) || 9999;
    if (cA !== cB) return cA - cB;
    return (a.team.schoolName || '').localeCompare(b.team.schoolName || '');
  };

  const compareDanton = (a, b) => {
    const mA = a.metrics;
    const mB = b.metrics;
    if (mB.hasScore !== mA.hasScore) return mB.hasScore ? 1 : -1;
    if (mA.hasScore && mB.hasScore) {
      if (mB.nilaiAkhirDanton !== mA.nilaiAkhirDanton) return mB.nilaiAkhirDanton - mA.nilaiAkhirDanton;
      if (mB.nilaiMurniDanton !== mA.nilaiMurniDanton) return mB.nilaiMurniDanton - mA.nilaiMurniDanton;
      if (mB.dantonMateri !== mA.dantonMateri) return mB.dantonMateri - mA.dantonMateri;
      if (mB.dantonVokal !== mA.dantonVokal) return mB.dantonVokal - mA.dantonVokal;
    }
    const cA = parseInt(a.chestNumber, 10) || 9999;
    const cB = parseInt(b.chestNumber, 10) || 9999;
    return cA - cB;
  };

  const isDanton = categoryType === 'danton';
  const comparator = isDanton ? compareDanton : comparePeleton;

  const compareByChestNumber = (a, b) => {
    const cA = parseInt(a.chestNumber, 10);
    const cB = parseInt(b.chestNumber, 10);
    const numA = Number.isFinite(cA) ? cA : 9999;
    const numB = Number.isFinite(cB) ? cB : 9999;
    if (numA !== numB) return numA - numB;
    return (a.team.schoolName || '').localeCompare(b.team.schoolName || '');
  };

  const buildJenjangRows = (jKey) =>
    teams
      .filter((t) => t.jenjang === jKey)
      .map((team) => ({
        team,
        chestNumber: getChestNumStr(team),
        dantonName: team.roster?.danton?.name || team.dantonName || '-',
        metrics: extractScoreMetrics(team.id, scores),
        logoSrc: logoMap.get(team.id) || createMonogramDataUrl(team.schoolName, team.jenjang),
      }))
      .sort(comparator)
      .map((item, idx) => ({
        ...item,
        rank: item.metrics.hasScore ? idx + 1 : null,
      }))
      .sort(compareByChestNumber);

  const sections = [];
  if (jenjangScope === 'all' || jenjangScope === 'SD') {
    const sdRows = buildJenjangRows('SD');
    if (sdRows.length > 0) {
      sections.push({
        key: 'SD',
        title: jenjangScope === 'all' ? 'A. JENJANG SD / MI' : 'JENJANG SD / MI',
        accentBg: '#fef2f2',
        accentBorder: '#e2e8f0',
        accentText: '#991b1b',
        rows: sdRows,
      });
    }
  }
  if (jenjangScope === 'all' || jenjangScope === 'SMP') {
    const smpRows = buildJenjangRows('SMP');
    if (smpRows.length > 0) {
      sections.push({
        key: 'SMP',
        title:
          jenjangScope === 'all'
            ? sections.length > 0
              ? 'B. JENJANG SMP / MTs'
              : 'A. JENJANG SMP / MTs'
            : 'JENJANG SMP / MTs',
        accentBg: '#eff6ff',
        accentBorder: '#e2e8f0',
        accentText: '#1e40af',
        rows: smpRows,
      });
    }
  }

  const tableWidth = A4_WIDTH_PX - PAD_X_PX * 2; // 710px

  // Kolom khusus Peleton (total 710px) vs khusus Danton (total 710px), keduanya lengkap Juri 1-3, Murni, Penalti, Akhir
  const tableColumns = isDanton
    ? [
        { width: 36, lines: ['RANK'], align: 'center' },
        { width: 46, lines: ['NO.', 'DADA'], align: 'center' },
        { width: 152, lines: ['KOMANDAN PELETON'], align: 'left' },
        { width: 172, lines: ['PELETON / SEKOLAH'], align: 'left' },
        { width: 48, lines: ['JURI 1'], align: 'center' },
        { width: 48, lines: ['JURI 2'], align: 'center' },
        { width: 48, lines: ['JURI 3'], align: 'center' },
        { width: 54, lines: ['NILAI', 'MURNI'], align: 'center' },
        { width: 50, lines: ['PENALTI'], align: 'center' },
        { width: 56, lines: ['NILAI', 'AKHIR'], align: 'center' },
      ]
    : [
        { width: 38, lines: ['RANK'], align: 'center' },
        { width: 50, lines: ['NO.', 'DADA'], align: 'center' },
        { width: 256, lines: ['PELETON / SEKOLAH'], align: 'left' },
        { width: 54, lines: ['JURI 1'], align: 'center' },
        { width: 54, lines: ['JURI 2'], align: 'center' },
        { width: 54, lines: ['JURI 3'], align: 'center' },
        { width: 68, lines: ['NILAI', 'MURNI'], align: 'center' },
        { width: 62, lines: ['PENALTI'], align: 'center' },
        { width: 74, lines: ['NILAI', 'AKHIR'], align: 'center' },
      ];

  const tableHeaderImg = createTableHeaderBarImg(tableColumns, {
    width: tableWidth,
    height: 30,
    fontSize: 9.5,
  });

  const colgroupHtml = `
    <colgroup>
      ${tableColumns.map((c) => `<col style="width: ${c.width}px;" />`).join('')}
    </colgroup>
  `;

  const renderRow = (item, zebra) => {
    const { team, chestNumber, dantonName, metrics, logoSrc, rank } = item;
    const bg = zebra ? '#f8fafc' : '#ffffff';
    const akhirBg = zebra ? '#f1f5f9' : '#f8fafc';

    if (isDanton) {
      const penColor = metrics.hasScore && metrics.dantonPenalty > 0 ? '#dc2626' : '#64748b';
      return `
        <tr style="background-color: ${bg}; font-size: 10px; line-height: 1.25; color: #0f172a;">
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: ${rank ? '#0f172a' : '#94a3b8'};">${rank || '-'}</td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a;">${escapeHtml(chestNumber)}</td>
          <td style="padding: 3px 6px 8px 6px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 9.5px; line-height: 1.25;">${escapeHtml(dantonName)}</td>
          <td style="padding: 4px 6px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <img src="${logoSrc}" alt="" style="display: block; width: 18px; height: 18px; min-width: 18px; max-width: 18px; flex-shrink: 0;" />
              <div style="color: #334155; font-size: 9.5px; line-height: 1.2; padding-bottom: 3px;">
                ${escapeHtml(team.schoolName || '-')}
              </div>
            </div>
          </td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569;">${fmtScoreVal(metrics.j1Danton, metrics.hasScore)}</td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569;">${fmtScoreVal(metrics.j2Danton, metrics.hasScore)}</td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569;">${fmtScoreVal(metrics.j3Danton, metrics.hasScore)}</td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #1e293b; font-weight: 400;">${fmtScoreVal(metrics.nilaiMurniDanton, metrics.hasScore)}</td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: ${penColor}; font-weight: ${metrics.dantonPenalty > 0 ? '700' : '400'};">${fmtPenaltyVal(metrics.dantonPenalty, metrics.hasScore)}</td>
          <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; background: ${akhirBg}; font-weight: 700; color: #0f172a;">${fmtScoreVal(metrics.nilaiAkhirDanton, metrics.hasScore)}</td>
        </tr>
      `;
    }

    const penColor = metrics.hasScore && metrics.peletonPenalty > 0 ? '#dc2626' : '#64748b';
    return `
      <tr style="background-color: ${bg}; font-size: 10.5px; line-height: 1.25; color: #0f172a;">
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: ${rank ? '#0f172a' : '#94a3b8'};">${rank || '-'}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a;">${escapeHtml(chestNumber)}</td>
        <td style="padding: 4px 7px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <img src="${logoSrc}" alt="" style="display: block; width: 20px; height: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0;" />
            <div style="font-weight: 700; color: #0f172a; font-size: 10.5px; line-height: 1.2; padding-bottom: 3px;">
              ${escapeHtml(team.schoolName || '-')}
            </div>
          </div>
        </td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569;">${fmtScoreVal(metrics.j1Peleton, metrics.hasScore)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569;">${fmtScoreVal(metrics.j2Peleton, metrics.hasScore)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #475569;">${fmtScoreVal(metrics.j3Peleton, metrics.hasScore)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #1e293b; font-weight: 400;">${fmtScoreVal(metrics.nilaiMurniPeleton, metrics.hasScore)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: ${penColor}; font-weight: ${metrics.peletonPenalty > 0 ? '700' : '400'};">${fmtPenaltyVal(metrics.peletonPenalty, metrics.hasScore)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; background: ${akhirBg}; font-weight: 700; color: #0f172a;">${fmtScoreVal(metrics.nilaiAkhirPeleton, metrics.hasScore)}</td>
      </tr>
    `;
  };

  const baseTitle = isDanton
    ? 'REKAPITULASI NILAI KOMANDAN PELETON (DANTON)'
    : 'REKAPITULASI NILAI PELETON';
  const docTitle = partPrefix ? `${partPrefix} ${baseTitle}` : baseTitle;

  const baOpeningHtml = includeBaOpening
    ? `
      <div style="text-align: center; margin-bottom: 10px; line-height: 1.28;">
        <div style="display: inline-block; font-size: 14px; font-weight: 700; letter-spacing: 0.4px; color: #0f172a; border-bottom: 1.5px solid #0f172a; padding-bottom: 1px;">
          BERITA ACARA REKAPITULASI NILAI
        </div>
        <div style="font-size: 10.5px; font-weight: 700; color: #0f172a; margin-top: 2px;">
          Nomor : BA.001/LBB-MLM/I/2027
        </div>
      </div>
      <p style="margin: 0 0 6px 0; font-size: 10px; line-height: 1.42; color: #0f172a; text-align: justify;">
        Pada hari ini, <strong>Ahad tanggal 24 Januari 2027</strong> (<em>dua puluh empat bulan Januari tahun dua ribu dua puluh tujuh</em>),
        bertempat di <strong>Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta</strong>, Dewan Juri bersama Panitia Bidang Juri
        dan Penilaian telah melaksanakan rekapitulasi hasil penilaian <strong>Lomba Baris-Berbaris Mu'allimin Tahun 2027</strong>.
      </p>
      <p style="margin: 0 0 10px 0; font-size: 10px; line-height: 1.42; color: #0f172a; text-align: justify;">
        Proses penilaian dan tabulasi nilai dilaksanakan secara terbuka, objektif, dan berjenjang berdasarkan hasil penilaian 3 (tiga)
        Dewan Juri, validasi penalti, serta verifikasi durasi tampil sesuai Petunjuk Teknis LBB Mu'allimin Tahun 2027. Adapun rincian
        rekapitulasi nilai yang menjadi dasar penerbitan Surat Keputusan Penetapan Pemenang adalah sebagai berikut:
      </p>
      <div style="margin-bottom: 6px; font-size: 12px; font-weight: 700; color: #0f172a; letter-spacing: 0.3px;">
        ${docTitle}
      </div>
    `
    : `
      <div style="text-align: center; margin-bottom: 10px;">
        <h2 style="margin: 0; font-size: 14px; font-weight: 700; letter-spacing: 0.35px; color: #0f172a; text-transform: uppercase;">
          ${docTitle}
        </h2>
        <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; color: #334155;">
          LAMPIRAN BERITA ACARA NOMOR : BA.001/LBB-MLM/I/2027
        </p>
      </div>
    `;

  const MAX_BUDGET_PX = SAFE_CONTENT_HEIGHT_PX - 26;
  const pages = [];
  let currentHtmlParts = [baOpeningHtml];
  let currentHeight = includeBaOpening ? 168 : 48;

  const flushPage = () => {
    pages.push(currentHtmlParts.join(''));
    currentHtmlParts = [];
    currentHeight = 0;
  };

  const estimateRowHeight = (item) => {
    const schoolLen = (item.team.schoolName || '').length;
    const dantonLen = (item.dantonName || '').length;
    const lines = isDanton
      ? Math.max(schoolLen > 24 ? 2 : 1, dantonLen > 22 ? 2 : 1)
      : schoolLen > 36
      ? 2
      : 1;
    return lines === 2 ? 42 : 34;
  };

  if (sections.length === 0) {
    currentHtmlParts.push(`
      <div style="padding: 36px 20px; text-align: center; border: 0.75px solid #e2e8f0; color: #64748b; font-size: 11px;">
        Belum ada data peleton untuk direkapitulasi.
      </div>
    `);
    flushPage();
    return pages;
  }

  sections.forEach((sec, secIdx) => {
    let rowIndex = 0;
    let isContinuation = false;

    while (rowIndex < sec.rows.length) {
      const sectionHeaderH = 24;
      const tableHeadH = 30;
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
        chunkRowsHtml.push(renderRow(item, rowIndex % 2 === 1));
        currentHeight += rH;
        rowIndex++;
      }

      const sectionBanner = createSectionBannerImg({
        text: `${sec.title}${titleSuffix}`,
        bg: sec.accentBg,
        border: sec.accentBorder,
        color: sec.accentText,
        width: tableWidth,
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

  if (includeSignatureAtEnd) {
    const signatureBlockH = 158;
    const signatureHtml = `
      <p style="margin: 14px 0 10px 0; font-size: 10px; line-height: 1.44; color: #0f172a; text-align: justify;">
        Demikian Berita Acara Rekapitulasi Nilai ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagai dasar penerbitan
        Surat Keputusan Penetapan Pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027 serta kelengkapan administrasi kepanitiaan.
      </p>
      <div style="text-align: right; font-size: 10px; font-weight: 400; color: #0f172a; margin-bottom: 8px;">
        Yogyakarta, 24 Januari 2027
      </div>
      <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 10px; color: #0f172a;">
        <tr>
          <td style="width: 33.33%; vertical-align: top; padding: 0 10px;">
            <div style="color: #475569;">Mengetahui,</div>
            <div style="font-weight: 700; margin-top: 2px;">Koordinator Panitia LBB</div>
            <div style="height: 46px;"></div>
            <div style="border-top: 0.75px solid #94a3b8; padding-top: 3px; font-weight: 700; color: #334155;">( ........................................ )</div>
          </td>
          <td style="width: 33.33%; vertical-align: top; padding: 0 10px;">
            <div style="color: #475569;">Diperiksa Oleh,</div>
            <div style="font-weight: 700; margin-top: 2px;">Koordinator Bid. Juri dan Penilaian</div>
            <div style="height: 46px;"></div>
            <div style="border-top: 0.75px solid #94a3b8; padding-top: 3px; font-weight: 700; color: #334155;">( ........................................ )</div>
          </td>
          <td style="width: 33.33%; vertical-align: top; padding: 0 10px;">
            <div style="color: #475569;">Disahkan Oleh,</div>
            <div style="font-weight: 700; margin-top: 2px;">Koordinator Dewan Juri</div>
            <div style="height: 46px;"></div>
            <div style="border-top: 0.75px solid #94a3b8; padding-top: 3px; font-weight: 700; color: #334155;">( ........................................ )</div>
          </td>
        </tr>
      </table>
    `;

    if (currentHeight + signatureBlockH > MAX_BUDGET_PX) {
      flushPage();
    }
    currentHtmlParts.push(signatureHtml);
  }

  if (currentHtmlParts.length > 0) {
    flushPage();
  }

  return pages;
}

/**
 * Ekspor PDF Rekapitulasi Nilai — Dipisah: Bagian Atas Khusus Peleton, Bagian Akhir Khusus Danton
 * Keduanya dilengkapi kolom Juri 1, Juri 2, Juri 3, Nilai Murni, Penalti, dan Nilai Akhir.
 *
 * @param {Object} params
 * @param {Array} params.teams - Daftar tim kompetisi
 * @param {Object} params.scores - Peta skor per teamId
 * @param {'all'|'SD'|'SMP'} [params.jenjangScope='all'] - Cakupan jenjang
 * @param {'both'|'peleton'|'danton'} [params.sectionMode='both'] - Bagian yang diekspor (default: Peleton lalu Danton)
 * @param {Function} [params.onProgress] - Callback progres
 */
export async function exportScoreRecapPDF({
  teams = [],
  scores = {},
  jenjangScope = 'all',
  sectionMode = 'both',
  onProgress = null,
} = {}) {
  const cleanTeams = (teams || []).filter((t) => !isTestingTeam(t));
  const targetTeams =
    jenjangScope === 'SD'
      ? cleanTeams.filter((t) => t.jenjang === 'SD')
      : jenjangScope === 'SMP'
      ? cleanTeams.filter((t) => t.jenjang === 'SMP')
      : cleanTeams;

  if (targetTeams.length === 0) {
    throw new Error('Tidak ada peleton yang tersedia untuk diekspor.');
  }

  if (onProgress) onProgress('Memuat kop surat & logo sekolah...');
  const [kopDataUrl, logoMap] = await Promise.all([
    loadImageAsDataUrl(KOP_IMAGE_URL),
    preloadTeamLogos(targetTeams),
  ]);

  const pageBodies = [];

  if (sectionMode === 'both' || sectionMode === 'peleton') {
    const peletonPages = buildCategoryPages({
      categoryType: 'peleton',
      teams: targetTeams,
      scores,
      jenjangScope,
      logoMap,
      includeBaOpening: true,
      partPrefix: sectionMode === 'both' ? 'BAGIAN I :' : '',
      includeSignatureAtEnd: sectionMode === 'peleton',
    });
    pageBodies.push(...peletonPages);
  }

  if (sectionMode === 'both' || sectionMode === 'danton') {
    const dantonPages = buildCategoryPages({
      categoryType: 'danton',
      teams: targetTeams,
      scores,
      jenjangScope,
      logoMap,
      includeBaOpening: sectionMode === 'danton',
      partPrefix: sectionMode === 'both' ? 'BAGIAN II :' : '',
      includeSignatureAtEnd: true,
    });
    pageBodies.push(...dantonPages);
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
        bodyHtml: pageBodies[i],
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
    const scopeLabel = jenjangScope === 'SD' ? 'SD_MI' : jenjangScope === 'SMP' ? 'SMP_MTs' : 'SD_dan_SMP';
    const typeLabel =
      sectionMode === 'danton' ? 'Danton' : sectionMode === 'peleton' ? 'Peleton' : 'Peleton_dan_Danton';
    const fileName = `BA_001_Rekapitulasi_Nilai_${typeLabel}_${scopeLabel}_LBB_Muallimin_2027_${dateStamp}.pdf`;
    pdf.save(fileName);

    return { fileName, totalPages };
  } finally {
    document.body.removeChild(host);
  }
}
