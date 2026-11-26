import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getChestNumberByLot, isTestingTeam } from '../context/competitionHelpers.js';
import { getImageCandidateUrls, extractGoogleDriveFileId } from '../services/sheetService.js';
import { EVENT, VENUE } from '../config.js';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const KOP_IMAGE_URL = '/kop-lbb-a4.png';
const PDF_FONT_FAMILY = "'Arial Narrow', Arial, Helvetica, sans-serif";

// Safe area berdasarkan pengukuran KOP LBB.png (2481x3508 = 210x297mm)
// Margin kiri-kanan normal 2,54 cm (25,4 mm = 96px pada kanvas 794px)
const PAD_TOP_PX = 116;
const PAD_BOTTOM_PX = 196;
const PAD_X_PX = 96;
const SAFE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAD_TOP_PX - PAD_BOTTOM_PX; // 811px

// Poin Juara Umum Berdasarkan Juknis Bab A Poin 7 (Juara Harapan tidak dihitung)
const PELETON_POINTS = { 1: 10, 2: 3, 3: 1 };
const DANTON_POINTS = { 1: 5, 2: 2, 3: 1 };

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

function createSectionHeadingImg({ text, width = 710, height = 20, fontSize = 11.5 }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <text x="0" y="${height / 2 + 0.5}" text-anchor="start" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="0.2" fill="#0f172a">${escapeXml(text)}</text>
  </svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="${escapeHtml(text)}" style="display:block; width:100%; height:${height}px; margin-bottom:2px;" />`;
}

function createTableHeaderBarImg(columns, { width = 710, height = 26, fontSize = 9.2 } = {}) {
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
          `<text x="${textX}" y="${startY + li * lineGap}" text-anchor="${anchor}" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="0.25" fill="#ffffff">${escapeXml(ln)}</text>`
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
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal memuat aset gambar: ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getRawTeamLogoUrl(team) {
  const raw =
    team?.files?.schoolLogo?.url ||
    team?.file_logo_sekolah ||
    team?.logoUrl ||
    team?.schoolLogoUrl ||
    team?.schoolLogo?.url ||
    (typeof team?.schoolLogo === 'string' ? team.schoolLogo : null) ||
    team?.logo ||
    team?.avatar ||
    null;
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('#')) return null;
  return trimmed;
}

function getSchoolInitials(name = '') {
  const clean = String(name)
    .replace(/\b(sd|mi|smp|mts|sma|smk|negeri|swasta|dan|kabupaten|kota)\b/gi, '')
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return String(name || 'SK').slice(0, 2).toUpperCase();
}

function createMonogramDataUrl(name, jenjang) {
  const initials = getSchoolInitials(name);
  const bg = jenjang === 'SD' ? '#fee2e2' : '#dbeafe';
  const fg = jenjang === 'SD' ? '#b91c1c' : '#1d4ed8';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect x="2" y="2" width="60" height="60" rx="14" fill="${bg}"/>
    <text x="32" y="34" text-anchor="middle" dominant-baseline="central" font-family="'Arial Narrow', Arial, Helvetica, sans-serif" font-weight="700" font-size="24" fill="${fg}">${escapeXml(initials)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function tryLoadSquareLogoPng(url, timeoutMs = 2800) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (val) => {
      if (settled) return;
      settled = true;
      resolve(val);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      clearTimeout(timer);
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) {
          finish(null);
          return;
        }
        const BOX = 96;
        const PAD = 4;
        const inner = BOX - PAD * 2;
        const scale = Math.min(inner / w, inner / h);
        const dw = Math.max(1, Math.round(w * scale));
        const dh = Math.max(1, Math.round(h * scale));
        const dx = Math.floor((BOX - dw) / 2);
        const dy = Math.floor((BOX - dh) / 2);

        const canvas = document.createElement('canvas');
        canvas.width = BOX;
        canvas.height = BOX;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, BOX, BOX);
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

function getBaseSchoolName(rawName = '') {
  return String(rawName || '')
    .trim()
    .replace(/\s*\((?:tim|peleton|regu|pasukan)?\s*(?:putra|putri|pa|pi|[a-d])\)$/i, '')
    .replace(/\s+(?:tim|peleton|regu|pasukan)\s+(?:putra|putri|pa|pi|[a-d])$/i, '')
    .replace(/\s+(?:putra|putri|[a-d])$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getNormalizedSchoolKey(jenjang, rawName = '') {
  const base = getBaseSchoolName(rawName)
    .toLowerCase()
    .replace(/\bsmpn\b/g, 'smp negeri')
    .replace(/\bsdn\b/g, 'sd negeri')
    .replace(/\bmtsn\b/g, 'mts negeri')
    .replace(/\bmin\b/g, 'mi negeri')
    .replace(/\s+/g, ' ')
    .trim();
  return `${jenjang}_${base}`;
}

function getPlatoonSuffix(rawName = '') {
  const m = String(rawName || '').trim().match(/(?:\s+|\()(?:(?:tim|peleton|regu|pasukan)\s+)?(putra|putri|pa|pi|[a-d])\)?$/i);
  return m ? m[1].toUpperCase() : '';
}

function getChestNumStr(team) {
  const raw = team?.chestNumber || getChestNumberByLot(team?.jenjang, team?.lotNumber);
  return raw ? String(raw) : '-';
}

function extractScoreMetrics(teamId, scores = {}) {
  const sc = scores[teamId];
  if (!sc) {
    return {
      hasScore: false,
      nilaiMurniPeleton: 0,
      peletonPenalty: 0,
      nilaiAkhirPeleton: 0,
      nilaiMurniDanton: 0,
      dantonPenalty: 0,
      nilaiAkhirDanton: 0,
      dantonMateri: 0,
      dantonVokal: 0,
    };
  }

  const juries = sc.juries || {};
  const j1P = Number(juries.pos1?.peletonTotal ?? juries.pos1?.total ?? sc.pbb?.j1 ?? 0);
  const j2P = Number(juries.pos2?.peletonTotal ?? juries.pos2?.total ?? sc.pbb?.j2 ?? 0);
  const j3P = Number(juries.pos3?.peletonTotal ?? sc.pbb?.j3 ?? 0);

  const j1D = Number(juries.pos1?.dantonTotal ?? 0);
  const j2D = Number(juries.pos2?.dantonTotal ?? 0);
  const j3D = Number(juries.pos3?.dantonTotal ?? 0);

  const j1Mat = Number(juries.pos1?.dantonRubricScores?.materi ?? 0);
  const j2Mat = Number(juries.pos2?.dantonRubricScores?.materi ?? 0);
  const j3Mat = Number(juries.pos3?.dantonRubricScores?.materi ?? 0);
  const dantonMateri = (j1Mat + j2Mat + j3Mat) > 0
    ? (j1Mat + j2Mat + j3Mat)
    : Number(sc.danton?.rubricScores?.materi ?? 0);

  const j1Vok = Number(juries.pos1?.dantonRubricScores?.vokal ?? 0);
  const j2Vok = Number(juries.pos2?.dantonRubricScores?.vokal ?? 0);
  const j3Vok = Number(juries.pos3?.dantonRubricScores?.vokal ?? 0);
  const dantonVokal = (j1Vok + j2Vok + j3Vok) > 0
    ? (j1Vok + j2Vok + j3Vok)
    : Number(sc.danton?.rubricScores?.vokal ?? 0);

  const nilaiMurniPeleton = Number(
    sc.nilaiMurniPeleton ?? sc.pbbTotal ?? sc.pbb?.total ?? parseFloat((j1P + j2P + j3P).toFixed(2))
  );
  const peletonPenalty = Number(
    sc.penalties?.peletonPenalty ?? sc.penaltiesTotal ?? sc.penalties?.totalPenalty ?? 0
  );
  const nilaiAkhirPeleton = Number(
    sc.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)))
  );

  const nilaiMurniDanton = Number(
    sc.nilaiMurniDanton ?? sc.dantonTotal ?? sc.danton?.total ?? parseFloat((j1D + j2D + j3D).toFixed(2))
  );
  const dantonPenalty = Number(sc.penalties?.dantonPenalty ?? 0);
  const nilaiAkhirDanton = Number(
    sc.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)))
  );

  const hasScore = Boolean(nilaiMurniPeleton > 0 || nilaiMurniDanton > 0 || sc.scoredAt || sc.status);

  return {
    hasScore,
    nilaiMurniPeleton,
    peletonPenalty,
    nilaiAkhirPeleton,
    nilaiMurniDanton,
    dantonPenalty,
    nilaiAkhirDanton,
    dantonMateri,
    dantonVokal,
  };
}

function fmtNum(val) {
  const num = Number(val);
  if (!Number.isFinite(num)) return '-';
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

function fmtPenalty(val) {
  const num = Number(val);
  if (!Number.isFinite(num) || num === 0) return '0';
  return `-${Number.isInteger(num) ? String(num) : num.toFixed(2)}`;
}

function computeJenjangWinners(jenjangTeams, scores, logoMap) {
  const enriched = jenjangTeams.map((team) => ({
    team,
    chestNumber: getChestNumStr(team),
    dantonName: team.roster?.danton?.name || team.dantonName || '-',
    metrics: extractScoreMetrics(team.id, scores),
    logoSrc: logoMap.get(team.id) || createMonogramDataUrl(team.schoolName, team.jenjang),
  }));

  const scoredOnly = enriched.filter((e) => e.metrics.hasScore);

  // 1. Peleton Terbaik (Juara Utama 1-3 & Harapan 1-3)
  const peletonRanked = [...scoredOnly].sort((a, b) => {
    if (b.metrics.nilaiAkhirPeleton !== a.metrics.nilaiAkhirPeleton) return b.metrics.nilaiAkhirPeleton - a.metrics.nilaiAkhirPeleton;
    if (b.metrics.nilaiMurniPeleton !== a.metrics.nilaiMurniPeleton) return b.metrics.nilaiMurniPeleton - a.metrics.nilaiMurniPeleton;
    if (a.metrics.peletonPenalty !== b.metrics.peletonPenalty) return a.metrics.peletonPenalty - b.metrics.peletonPenalty;
    return b.metrics.nilaiMurniDanton - a.metrics.nilaiMurniDanton;
  });

  // 2. Komandan Peleton (Danton) Terbaik (Juara 1-3)
  const dantonRanked = [...scoredOnly].sort((a, b) => {
    if (b.metrics.nilaiAkhirDanton !== a.metrics.nilaiAkhirDanton) return b.metrics.nilaiAkhirDanton - a.metrics.nilaiAkhirDanton;
    if (b.metrics.nilaiMurniDanton !== a.metrics.nilaiMurniDanton) return b.metrics.nilaiMurniDanton - a.metrics.nilaiMurniDanton;
    if (a.metrics.dantonPenalty !== b.metrics.dantonPenalty) return a.metrics.dantonPenalty - b.metrics.dantonPenalty;
    if (b.metrics.dantonMateri !== a.metrics.dantonMateri) return b.metrics.dantonMateri - a.metrics.dantonMateri;
    return b.metrics.dantonVokal - a.metrics.dantonVokal;
  });

  // 3. Juara Umum (Akumulasi Poin Sekolah per Juknis Bab A.7 & A.8)
  const peletonRankMap = new Map();
  peletonRanked.forEach((item, idx) => {
    const rank = idx + 1;
    peletonRankMap.set(item.team.id, { rank, points: PELETON_POINTS[rank] || 0 });
  });

  const dantonRankMap = new Map();
  dantonRanked.forEach((item, idx) => {
    const rank = idx + 1;
    dantonRankMap.set(item.team.id, { rank, points: DANTON_POINTS[rank] || 0 });
  });

  const schoolMap = new Map();
  scoredOnly.forEach((item) => {
    const baseName = getBaseSchoolName(item.team.schoolName) || item.team.schoolName;
    const key = getNormalizedSchoolKey(item.team.jenjang, item.team.schoolName);
    const suffix = getPlatoonSuffix(item.team.schoolName);
    const pInfo = peletonRankMap.get(item.team.id) || { rank: 99, points: 0 };
    const dInfo = dantonRankMap.get(item.team.id) || { rank: 99, points: 0 };

    if (!schoolMap.has(key)) {
      schoolMap.set(key, {
        schoolName: baseName,
        logoSrc: item.logoSrc,
        totalPoints: 0,
        achievements: [],
        bestPlatoon: null,
        bestMurniPeleton: 0,
        leastPeletonPenalty: 9999,
        bestMurniDanton: 0,
      });
    }

    const sch = schoolMap.get(key);
    sch.totalPoints += pInfo.points + dInfo.points;

    if (pInfo.rank >= 1 && pInfo.rank <= 3) {
      sch.achievements.push(`Juara ${pInfo.rank} Peleton${suffix ? ` ${suffix}` : ''} (${pInfo.points} poin)`);
    }
    if (dInfo.rank >= 1 && dInfo.rank <= 3) {
      sch.achievements.push(`Juara ${dInfo.rank} Komandan${suffix ? ` ${suffix}` : ''} (${dInfo.points} poin)`);
    }

    const isBetter =
      !sch.bestPlatoon ||
      item.metrics.nilaiAkhirPeleton > sch.bestPlatoon.metrics.nilaiAkhirPeleton ||
      (item.metrics.nilaiAkhirPeleton === sch.bestPlatoon.metrics.nilaiAkhirPeleton &&
        item.metrics.nilaiMurniPeleton > sch.bestPlatoon.metrics.nilaiMurniPeleton) ||
      (item.metrics.nilaiAkhirPeleton === sch.bestPlatoon.metrics.nilaiAkhirPeleton &&
        item.metrics.nilaiMurniPeleton === sch.bestPlatoon.metrics.nilaiMurniPeleton &&
        item.metrics.peletonPenalty < sch.bestPlatoon.metrics.peletonPenalty);

    if (isBetter) {
      sch.bestPlatoon = item;
      sch.bestMurniPeleton = item.metrics.nilaiMurniPeleton;
      sch.leastPeletonPenalty = item.metrics.peletonPenalty;
    }
    if (item.metrics.nilaiMurniDanton > sch.bestMurniDanton) {
      sch.bestMurniDanton = item.metrics.nilaiMurniDanton;
    }
  });

  const juaraUmumRanked = Array.from(schoolMap.values())
    .filter((s) => s.totalPoints > 0)
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.bestMurniPeleton !== a.bestMurniPeleton) return b.bestMurniPeleton - a.bestMurniPeleton;
      if (a.leastPeletonPenalty !== b.leastPeletonPenalty) return a.leastPeletonPenalty - b.leastPeletonPenalty;
      return b.bestMurniDanton - a.bestMurniDanton;
    });

  return {
    totalParticipants: enriched.length,
    scoredCount: scoredOnly.length,
    peletonTop6: peletonRanked.slice(0, 6),
    dantonTop3: dantonRanked.slice(0, 3),
    juaraUmumTop3: juaraUmumRanked.slice(0, 3),
  };
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

function buildPeletonTableSectionHtml({ heading, itemsWithLabels, tableWidth }) {
  const cols = [
    { width: 88, lines: ['PREDIKAT'], align: 'left' },
    { width: 48, lines: ['NO. DADA'], align: 'center' },
    { width: 268, lines: ['PELETON / SEKOLAH'], align: 'left' },
    { width: 66, lines: ['NILAI MURNI'], align: 'center' },
    { width: 62, lines: ['PENALTI'], align: 'center' },
    { width: 70, lines: ['NILAI AKHIR'], align: 'center' },
  ];
  const colgroup = `<colgroup>${cols.map((c) => `<col style="width:${c.width}px;" />`).join('')}</colgroup>`;
  const headerImg = createTableHeaderBarImg(cols, { width: tableWidth, height: 23, fontSize: 9.2 });

  const rowsHtml = itemsWithLabels
    .map(({ label, item }, idx) => {
      const isAlt = idx % 2 === 1;
      const bg = isAlt ? '#f8fafc' : '#ffffff';
      const penColor = item && item.metrics.peletonPenalty > 0 ? '#dc2626' : '#475569';

      const schoolCell = item
        ? `<div style="display: flex; align-items: center; gap: 7px;">
            <img src="${item.logoSrc}" alt="" style="width: 18px; height: 18px; min-width: 18px; max-width: 18px; flex-shrink: 0; display: block;" />
            <div style="font-size: 10.5px; font-weight: 700; color: #0f172a; line-height: 1.2;">${escapeHtml(item.team.schoolName)}</div>
          </div>`
        : `<span style="color: #94a3b8;">-</span>`;

      return `
        <tr style="background-color: ${bg};">
          <td style="padding: 3px 6px 6px 8px; border: 0.75px solid #e2e8f0; font-size: 10px; font-weight: 700; color: #0f172a; vertical-align: middle;">${label}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10px; font-weight: 700; color: #0f172a; vertical-align: middle;">${item ? escapeHtml(item.chestNumber) : '-'}</td>
          <td style="padding: 3px 8px 6px 8px; border: 0.75px solid #e2e8f0; vertical-align: middle;">${schoolCell}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10px; font-weight: 400; color: #1e293b; vertical-align: middle;">${item ? fmtNum(item.metrics.nilaiMurniPeleton) : '-'}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10px; font-weight: 700; color: ${penColor}; vertical-align: middle;">${item ? fmtPenalty(item.metrics.peletonPenalty) : '-'}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10.5px; font-weight: 700; color: #0f172a; background-color: ${isAlt ? '#f1f5f9' : '#f8fafc'}; vertical-align: middle;">${item ? fmtNum(item.metrics.nilaiAkhirPeleton) : '-'}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="margin-bottom: 10px;">
      ${createSectionHeadingImg({ text: heading, width: tableWidth, height: 19, fontSize: 11 })}
      ${headerImg}
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        ${colgroup}
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

function buildDantonTableSectionHtml({ heading, itemsWithLabels, tableWidth }) {
  const cols = [
    { width: 84, lines: ['PREDIKAT'], align: 'left' },
    { width: 46, lines: ['NO. DADA'], align: 'center' },
    { width: 162, lines: ['KOMANDAN PELETON'], align: 'left' },
    { width: 178, lines: ['PELETON / SEKOLAH'], align: 'left' },
    { width: 62, lines: ['PENALTI'], align: 'center' },
    { width: 70, lines: ['NILAI AKHIR'], align: 'center' },
  ];
  const colgroup = `<colgroup>${cols.map((c) => `<col style="width:${c.width}px;" />`).join('')}</colgroup>`;
  const headerImg = createTableHeaderBarImg(cols, { width: tableWidth, height: 23, fontSize: 9.2 });

  const rowsHtml = itemsWithLabels
    .map(({ label, item }, idx) => {
      const isAlt = idx % 2 === 1;
      const bg = isAlt ? '#f8fafc' : '#ffffff';
      const penColor = item && item.metrics.dantonPenalty > 0 ? '#dc2626' : '#475569';

      const schoolCell = item
        ? `<div style="display: flex; align-items: center; gap: 6px;">
            <img src="${item.logoSrc}" alt="" style="width: 16px; height: 16px; min-width: 16px; max-width: 16px; flex-shrink: 0; display: block;" />
            <div style="font-size: 10px; font-weight: 700; color: #334155; line-height: 1.2;">${escapeHtml(item.team.schoolName)}</div>
          </div>`
        : `<span style="color: #94a3b8;">-</span>`;

      return `
        <tr style="background-color: ${bg};">
          <td style="padding: 3px 6px 6px 8px; border: 0.75px solid #e2e8f0; font-size: 10px; font-weight: 700; color: #0f172a; vertical-align: middle;">${label}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10px; font-weight: 700; color: #0f172a; vertical-align: middle;">${item ? escapeHtml(item.chestNumber) : '-'}</td>
          <td style="padding: 3px 8px 6px 8px; border: 0.75px solid #e2e8f0; font-size: 10.5px; font-weight: 700; color: #0f172a; line-height: 1.2; vertical-align: middle;">${item ? escapeHtml(item.dantonName) : '<span style="color:#94a3b8;">-</span>'}</td>
          <td style="padding: 3px 8px 6px 8px; border: 0.75px solid #e2e8f0; vertical-align: middle;">${schoolCell}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10px; font-weight: 700; color: ${penColor}; vertical-align: middle;">${item ? fmtPenalty(item.metrics.dantonPenalty) : '-'}</td>
          <td style="padding: 3px 4px 6px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10.5px; font-weight: 700; color: #0f172a; background-color: ${isAlt ? '#f1f5f9' : '#f8fafc'}; vertical-align: middle;">${item ? fmtNum(item.metrics.nilaiAkhirDanton) : '-'}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="margin-bottom: 12px;">
      ${createSectionHeadingImg({ text: heading, width: tableWidth, height: 19, fontSize: 11 })}
      ${headerImg}
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        ${colgroup}
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

function buildJuaraUmumTableSectionHtml({ sdWinner, smpWinner, tableWidth }) {
  const cols = [
    { width: 118, lines: ['PREDIKAT'], align: 'left' },
    { width: 184, lines: ['SEKOLAH / INSTANSI'], align: 'left' },
    { width: 228, lines: ['RINCIAN PEROLEHAN POIN'], align: 'left' },
    { width: 72, lines: ['TOTAL POIN'], align: 'center' },
  ];
  const colgroup = `<colgroup>${cols.map((c) => `<col style="width:${c.width}px;" />`).join('')}</colgroup>`;
  const headerImg = createTableHeaderBarImg(cols, { width: tableWidth, height: 23, fontSize: 9.2 });

  const entries = [
    { label: 'Juara Umum SD / MI', winner: sdWinner },
    { label: 'Juara Umum SMP / MTs', winner: smpWinner },
  ];

  const rowsHtml = entries
    .map(({ label, winner }, idx) => {
      const isAlt = idx % 2 === 1;
      const bg = isAlt ? '#f8fafc' : '#ffffff';
      const schoolCell = winner
        ? `<div style="display: flex; align-items: center; gap: 7px;">
            <img src="${winner.logoSrc}" alt="" style="width: 18px; height: 18px; min-width: 18px; max-width: 18px; flex-shrink: 0; display: block;" />
            <div style="font-size: 10.5px; font-weight: 700; color: #0f172a; line-height: 1.2;">${escapeHtml(winner.schoolName)}</div>
          </div>`
        : `<span style="color: #94a3b8;">-</span>`;

      const achievementsHtml = winner
        ? winner.achievements
            .map((ach) => `<div style="line-height: 1.35;">&bull; ${escapeHtml(ach)}</div>`)
            .join('')
        : '<span style="color:#94a3b8;">-</span>';

      return `
        <tr style="background-color: ${bg};">
          <td style="padding: 3px 6px 8px 8px; border: 0.75px solid #e2e8f0; font-size: 10px; font-weight: 700; color: #0f172a; vertical-align: middle;">${label}</td>
          <td style="padding: 3px 8px 8px 8px; border: 0.75px solid #e2e8f0; vertical-align: middle;">${schoolCell}</td>
          <td style="padding: 3px 8px 8px 8px; border: 0.75px solid #e2e8f0; font-size: 9.5px; color: #334155; vertical-align: middle;">${achievementsHtml}</td>
          <td style="padding: 3px 4px 8px 4px; border: 0.75px solid #e2e8f0; text-align: center; font-size: 10.5px; font-weight: 700; color: #0f172a; background-color: ${isAlt ? '#f1f5f9' : '#f8fafc'}; vertical-align: middle;">${winner ? `${winner.totalPoints} Poin` : '-'}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="margin-bottom: 14px;">
      ${createSectionHeadingImg({ text: 'G. JUARA UMUM (PIALA BERGILIR)', width: tableWidth, height: 19, fontSize: 11 })}
      ${headerImg}
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        ${colgroup}
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

function buildSignatureBlockHtml({ showPlaceDate = false } = {}) {
  const placeDateHtml = showPlaceDate
    ? `
      <div style="display: flex; justify-content: flex-end; margin-top: 8px; margin-bottom: 8px; font-size: 9.8px; color: #0f172a;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="padding: 1px 6px 1px 0;">Ditetapkan di</td>
            <td style="padding: 1px 4px;">:</td>
            <td style="padding: 1px 0; font-weight: 700;">Yogyakarta</td>
          </tr>
          <tr>
            <td style="padding: 1px 6px 1px 0;">Pada tanggal</td>
            <td style="padding: 1px 4px;">:</td>
            <td style="padding: 1px 0; font-weight: 700;">24 Januari 2027</td>
          </tr>
        </table>
      </div>
    `
    : '';

  return `
    ${placeDateHtml}
    <table style="width: 100%; border-collapse: collapse; margin-top: 4px; text-align: center; font-size: 9.6px; color: #0f172a;">
      <tr>
        <td style="width: 33.33%; vertical-align: top; padding: 0 6px;">
          <div style="color: #334155;">Mengetahui,</div>
          <div style="font-weight: 700; margin-top: 1px;">Koordinator Panitia LBB</div>
          <div style="height: 40px;"></div>
          <div style="border-top: 0.75px solid #94a3b8; padding-top: 3px; font-weight: 700; color: #334155;">( .............................. )</div>
        </td>
        <td style="width: 33.33%; vertical-align: top; padding: 0 6px;">
          <div style="color: #334155;">Diperiksa Oleh,</div>
          <div style="font-weight: 700; margin-top: 1px;">Koordinator Bid. Juri dan Penilaian</div>
          <div style="height: 40px;"></div>
          <div style="border-top: 0.75px solid #94a3b8; padding-top: 3px; font-weight: 700; color: #334155;">( .............................. )</div>
        </td>
        <td style="width: 33.33%; vertical-align: top; padding: 0 6px;">
          <div style="color: #334155;">Disahkan Oleh,</div>
          <div style="font-weight: 700; margin-top: 1px;">Koordinator Dewan Juri</div>
          <div style="height: 40px;"></div>
          <div style="border-top: 0.75px solid #94a3b8; padding-top: 3px; font-weight: 700; color: #334155;">( .............................. )</div>
        </td>
      </tr>
    </table>
  `;
}

function buildUnifiedBeritaAcaraPages({ sdTeams, smpTeams, scores, logoMap }) {
  const tableWidth = A4_WIDTH_PX - PAD_X_PX * 2; // 602px (margin kiri-kanan 2,54 cm)
  const sdData = computeJenjangWinners(sdTeams, scores, logoMap);
  const smpData = computeJenjangWinners(smpTeams, scores, logoMap);
  const totalAll = sdData.totalParticipants + smpData.totalParticipants;

  // --- HALAMAN 1: NASKAH SURAT KEPUTUSAN (SK) ---
  const skTitleHtml = `
    <div style="text-align: center; margin-bottom: 10px; line-height: 1.28;">
      <div style="display: inline-block; font-size: 13.5px; font-weight: 700; letter-spacing: 0.4px; color: #0f172a; border-bottom: 1.5px solid #0f172a; padding-bottom: 1px;">
        SURAT KEPUTUSAN
      </div>
      <div style="font-size: 10.5px; font-weight: 700; color: #0f172a; margin-top: 1px;">
        Nomor : SK.001/LBB-MLM/I/2027
      </div>
      <div style="font-size: 10.5px; font-weight: 700; color: #0f172a; margin-top: 4px;">
        TENTANG
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 2px;">
        PENETAPAN PEMENANG LOMBA BARIS-BERBARIS MU'ALLIMIN<br/>
        TAHUN 2027
      </div>
      <div style="font-size: 10px; font-weight: 700; color: #0f172a; margin-top: 6px;">
        DEWAN JURI DAN PANITIA LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027
      </div>
    </div>
  `;

  const skBodyHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 9.7px; line-height: 1.38; color: #0f172a; text-align: justify;">
      <tr>
        <td style="width: 96px; vertical-align: top; font-weight: 700; padding: 2px 0;">MENIMBANG</td>
        <td style="width: 12px; vertical-align: top; padding: 2px 0;">:</td>
        <td style="vertical-align: top; padding: 2px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 3px;">a.</td>
              <td style="vertical-align: top; padding-bottom: 3px;">bahwa dalam rangka pelaksanaan Lomba Baris-Berbaris Mu'allimin Tahun 2027 tingkat SD/MI (${sdData.totalParticipants} peleton) dan SMP/MTs (${smpData.totalParticipants} peleton) dengan total ${totalAll} peleton se-Daerah Istimewa Yogyakarta, telah dilaksanakan penilaian secara objektif dan transparan oleh Dewan Juri;</td>
            </tr>
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 3px;">b.</td>
              <td style="vertical-align: top; padding-bottom: 3px;">bahwa berdasarkan hasil rekapitulasi penilaian Dewan Juri pada hari ${escapeHtml(EVENT.COMPETITION_DATE)} bertempat di ${escapeHtml(VENUE.NAME)} (${escapeHtml(VENUE.SHORT_ADDRESS)}), telah diperoleh peringkat resmi peserta pada seluruh kategori kejuaraan;</td>
            </tr>
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 4px;">c.</td>
              <td style="vertical-align: top; padding-bottom: 4px;">bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a dan huruf b di atas, perlu ditetapkan Surat Keputusan tentang Penetapan Pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027;</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0;">MENGINGAT</td>
        <td style="vertical-align: top; padding: 2px 0;">:</td>
        <td style="vertical-align: top; padding: 2px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 2px;">1.</td>
              <td style="vertical-align: top; padding-bottom: 2px;">Petunjuk Pelaksanaan dan Petunjuk Teknis (Juknis) Lomba Baris-Berbaris Mu'allimin Tahun 2027;</td>
            </tr>
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 2px;">2.</td>
              <td style="vertical-align: top; padding-bottom: 2px;">Peraturan Panglima TNI Nomor 58 Tahun 2018 tentang Peraturan Baris-Berbaris (PBB);</td>
            </tr>
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 4px;">3.</td>
              <td style="vertical-align: top; padding-bottom: 4px;">Hasil Technical Meeting Peserta Lomba Baris-Berbaris Mu'allimin Tahun 2027 tanggal ${escapeHtml(EVENT.TECHNICAL_MEETING_DATE)}.</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0;">MEMPERHATIKAN</td>
        <td style="vertical-align: top; padding: 2px 0;">:</td>
        <td style="vertical-align: top; padding: 2px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 2px;">1.</td>
              <td style="vertical-align: top; padding-bottom: 2px;">Berita Acara Rekapitulasi Nilai Lomba Baris-Berbaris Mu'allimin Tahun 2027 Nomor: BA.001/LBB-MLM/I/2027 tanggal 24 Januari 2027;</td>
            </tr>
            <tr>
              <td style="width: 16px; vertical-align: top; padding-bottom: 4px;">2.</td>
              <td style="vertical-align: top; padding-bottom: 4px;">Hasil Sidang Pleno Dewan Juri dan Panitia Bidang Juri dan Penilaian Lomba Baris-Berbaris Mu'allimin Tahun 2027.</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: center; font-weight: 700; font-size: 10.2px; padding: 6px 0 4px 0; letter-spacing: 0.4px;">
          MEMUTUSKAN
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0 4px 0;">MENETAPKAN</td>
        <td style="vertical-align: top; padding: 2px 0 4px 0;">:</td>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0 4px 0;">
          KEPUTUSAN DEWAN JURI DAN PANITIA LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027 TENTANG PENETAPAN PEMENANG LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027;
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0 4px 0;">KESATU</td>
        <td style="vertical-align: top; padding: 2px 0 4px 0;">:</td>
        <td style="vertical-align: top; padding: 2px 0 4px 0;">
          Mengesahkan dan menetapkan para pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027 tingkat SD/MI dan SMP/MTs sebagaimana tercantum dalam Lampiran yang merupakan bagian tidak terpisahkan dari Surat Keputusan ini;
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0 4px 0;">KEDUA</td>
        <td style="vertical-align: top; padding: 2px 0 4px 0;">:</td>
        <td style="vertical-align: top; padding: 2px 0 4px 0;">
          Keputusan Dewan Juri dan Panitia Lomba Baris-Berbaris Mu'allimin Tahun 2027 ini bersifat mutlak dan tidak dapat diganggu gugat;
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; font-weight: 700; padding: 2px 0 2px 0;">KETIGA</td>
        <td style="vertical-align: top; padding: 2px 0 2px 0;">:</td>
        <td style="vertical-align: top; padding: 2px 0 2px 0;">
          Keputusan ini mulai berlaku sejak tanggal ditetapkan, dan apabila di kemudian hari diketahui terdapat kekeliruan pada Surat Keputusan ini, maka akan dilaksanakan perbaikan sebagaimana mestinya.
        </td>
      </tr>
    </table>
  `;

  const page1SkHtml = `${skTitleHtml}${skBodyHtml}${buildSignatureBlockHtml({ showPlaceDate: true })}`;

  // --- HALAMAN 2 & 3: LAMPIRAN DAFTAR PEMENANG ---
  const lampiranMetaHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; line-height: 1.35; color: #0f172a; margin-bottom: 10px;">
      <tr>
        <td style="width: 72px; font-weight: 700; vertical-align: top;">LAMPIRAN</td>
        <td style="width: 10px; vertical-align: top;">:</td>
        <td style="font-weight: 700; vertical-align: top;">SURAT KEPUTUSAN DEWAN JURI DAN PANITIA LBB MU'ALLIMIN TAHUN 2027</td>
      </tr>
      <tr>
        <td style="vertical-align: top;">Nomor</td>
        <td style="vertical-align: top;">:</td>
        <td style="vertical-align: top;">SK.001/LBB-MLM/I/2027</td>
      </tr>
      <tr>
        <td style="vertical-align: top;">Tanggal</td>
        <td style="vertical-align: top;">:</td>
        <td style="vertical-align: top;">24 Januari 2027</td>
      </tr>
      <tr>
        <td style="vertical-align: top;">Tentang</td>
        <td style="vertical-align: top;">:</td>
        <td style="vertical-align: top;">Penetapan Pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027</td>
      </tr>
    </table>
    <div style="text-align: center; margin-bottom: 10px;">
      <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.35px; color: #0f172a; line-height: 1.25;">
        DAFTAR PEMENANG LOMBA BARIS-BERBARIS MU'ALLIMIN<br/>
        TAHUN 2027
      </div>
    </div>
  `;

  // Urutan pembacaan resmi: Harapan Peleton SD (3,2,1) -> Harapan Peleton SMP (3,2,1) ->
  // Utama Peleton SD (3,2,1) -> Utama Peleton SMP (3,2,1) ->
  // Komandan SD (3,2,1) -> Komandan SMP (3,2,1) -> Juara Umum SD & SMP
  const harapanSdHtml = buildPeletonTableSectionHtml({
    heading: 'A. JUARA HARAPAN PELETON SD / MI',
    tableWidth,
    itemsWithLabels: [
      { label: 'Harapan 3', item: sdData.peletonTop6[5] || null },
      { label: 'Harapan 2', item: sdData.peletonTop6[4] || null },
      { label: 'Harapan 1', item: sdData.peletonTop6[3] || null },
    ],
  });

  const harapanSmpHtml = buildPeletonTableSectionHtml({
    heading: 'B. JUARA HARAPAN PELETON SMP / MTs',
    tableWidth,
    itemsWithLabels: [
      { label: 'Harapan 3', item: smpData.peletonTop6[5] || null },
      { label: 'Harapan 2', item: smpData.peletonTop6[4] || null },
      { label: 'Harapan 1', item: smpData.peletonTop6[3] || null },
    ],
  });

  const utamaSdHtml = buildPeletonTableSectionHtml({
    heading: 'C. JUARA UTAMA PELETON SD / MI',
    tableWidth,
    itemsWithLabels: [
      { label: 'Juara 3', item: sdData.peletonTop6[2] || null },
      { label: 'Juara 2', item: sdData.peletonTop6[1] || null },
      { label: 'Juara 1', item: sdData.peletonTop6[0] || null },
    ],
  });

  const utamaSmpHtml = buildPeletonTableSectionHtml({
    heading: 'D. JUARA UTAMA PELETON SMP / MTs',
    tableWidth,
    itemsWithLabels: [
      { label: 'Juara 3', item: smpData.peletonTop6[2] || null },
      { label: 'Juara 2', item: smpData.peletonTop6[1] || null },
      { label: 'Juara 1', item: smpData.peletonTop6[0] || null },
    ],
  });

  const dantonSdHtml = buildDantonTableSectionHtml({
    heading: 'E. JUARA KOMANDAN PELETON (DANTON) SD / MI',
    tableWidth,
    itemsWithLabels: [
      { label: 'Juara 3', item: sdData.dantonTop3[2] || null },
      { label: 'Juara 2', item: sdData.dantonTop3[1] || null },
      { label: 'Juara 1', item: sdData.dantonTop3[0] || null },
    ],
  });

  const dantonSmpHtml = buildDantonTableSectionHtml({
    heading: 'F. JUARA KOMANDAN PELETON (DANTON) SMP / MTs',
    tableWidth,
    itemsWithLabels: [
      { label: 'Juara 3', item: smpData.dantonTop3[2] || null },
      { label: 'Juara 2', item: smpData.dantonTop3[1] || null },
      { label: 'Juara 1', item: smpData.dantonTop3[0] || null },
    ],
  });

  const juaraUmumHtml = buildJuaraUmumTableSectionHtml({
    sdWinner: sdData.juaraUmumTop3[0] || null,
    smpWinner: smpData.juaraUmumTop3[0] || null,
    tableWidth,
  });

  const page2LampiranHtml = `${lampiranMetaHtml}${harapanSdHtml}${harapanSmpHtml}${utamaSdHtml}${utamaSmpHtml}`;
  const page3LampiranHtml = `${dantonSdHtml}${dantonSmpHtml}${juaraUmumHtml}${buildSignatureBlockHtml({ showPlaceDate: false })}`;

  return [page1SkHtml, page2LampiranHtml, page3LampiranHtml];
}

/**
 * Ekspor PDF Berita Acara Keputusan Dewan Juri Resmi (Gabungan SD / MI & SMP / MTs, Kop A4 penuh)
 *
 * @param {Object} params
 * @param {Array} params.teams - Daftar tim kompetisi
 * @param {Object} params.scores - Peta skor per teamId
 * @param {Function} [params.onProgress] - Callback progres
 */
export async function exportBeritaAcaraPDF({
  teams = [],
  scores = {},
  onProgress = null,
} = {}) {
  const cleanTeams = (teams || []).filter((t) => !isTestingTeam(t));
  const sdTeams = cleanTeams.filter((t) => t.jenjang === 'SD');
  const smpTeams = cleanTeams.filter((t) => t.jenjang === 'SMP');
  const targetTeams = [...sdTeams, ...smpTeams];

  if (targetTeams.length === 0) {
    throw new Error('Tidak ada data peleton untuk dibuatkan Berita Acara.');
  }

  if (onProgress) onProgress('Memuat kop surat & logo sekolah...');
  const [kopDataUrl, logoMap] = await Promise.all([
    loadImageAsDataUrl(KOP_IMAGE_URL),
    preloadTeamLogos(targetTeams),
  ]);

  const pageBodies = buildUnifiedBeritaAcaraPages({
    sdTeams,
    smpTeams,
    scores,
    logoMap,
  });

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
        onProgress(`Menyusun Berita Acara halaman ${i + 1} dari ${totalPages}...`);
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
    const fileName = `SK_001_Penetapan_Pemenang_LBB_Muallimin_2027_${dateStamp}.pdf`;
    pdf.save(fileName);

    return { fileName, totalPages };
  } finally {
    document.body.removeChild(host);
  }
}
