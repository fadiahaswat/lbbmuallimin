import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TRIAL_TIME_SLOTS, normalizeSchoolName } from '../components/trial/trialPlanGenerator.js';
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
    team.avatar ||
    ''
  );
}

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
            d[idx + 3] = 0;
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
      loadedDataUrl = await tryLoadRemoteImageToSquarePng(candidateUrl, 2600);
      if (loadedDataUrl) break;
    }

    urlCache.set(raw, loadedDataUrl);
    logoMap.set(team.id, loadedDataUrl || createMonogramDataUrl(team.schoolName, team.jenjang));
  });

  await Promise.all(tasks);
  return logoMap;
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

function buildTrialRowsForJenjang(planSlots, teamsMap, logoMap) {
  const scheduled = [];
  const schoolCounts = new Map();

  (planSlots || []).forEach((teamId, idx) => {
    if (!teamId) return;
    const team = teamsMap.get(teamId);
    if (!team) return;
    const schoolKey = normalizeSchoolName(team.schoolBaseName || team.schoolName);
    if (schoolKey) {
      schoolCounts.set(schoolKey, (schoolCounts.get(schoolKey) || 0) + 1);
    }
    scheduled.push({ team, slotIdx: idx, schoolKey });
  });

  return scheduled.map(({ team, slotIdx, schoolKey }) => {
    const slotInfo = TRIAL_TIME_SLOTS[slotIdx] || {
      index: slotIdx + 1,
      time: '-',
      checkIn: '-',
      checkOut: '-',
    };
    const isTwinSchool = schoolKey && (schoolCounts.get(schoolKey) || 0) >= 2;
    return {
      team,
      slotNumber: slotInfo.index,
      chestNumber: team.chestNumber ? String(team.chestNumber) : '-',
      dantonName: team.dantonName || team.roster?.danton?.name || '-',
      checkIn: slotInfo.checkIn || slotInfo.arrival || '-',
      waktuGladi: slotInfo.time || '-',
      checkOut: slotInfo.checkOut || '-',
      isTwinSchool,
      logoSrc: logoMap.get(team.id) || createMonogramDataUrl(team.schoolName, team.jenjang),
    };
  });
}

function buildTrialPagesHtml({ currentPlan, teamsMap, mode, logoMap }) {
  const sections = [];

  if (mode === 'all' || mode === 'SD') {
    const sdRows = buildTrialRowsForJenjang(currentPlan?.SD?.slots, teamsMap, logoMap);
    if (sdRows.length > 0) {
      sections.push({
        key: 'SD',
        title: mode === 'all' ? 'A. ARENA 1 : SD / MI (LAPANGAN BASKET)' : 'ARENA 1 : SD / MI (LAPANGAN BASKET)',
        accentBg: '#fef2f2',
        accentBorder: '#e2e8f0',
        accentText: '#991b1b',
        rows: sdRows,
      });
    }
  }

  if (mode === 'all' || mode === 'SMP') {
    const smpRows = buildTrialRowsForJenjang(currentPlan?.SMP?.slots, teamsMap, logoMap);
    if (smpRows.length > 0) {
      sections.push({
        key: 'SMP',
        title:
          mode === 'all'
            ? sections.length > 0
              ? 'B. ARENA 2 : SMP / MTs (PELATARAN EMBUNG)'
              : 'A. ARENA 2 : SMP / MTs (PELATARAN EMBUNG)'
            : 'ARENA 2 : SMP / MTs (PELATARAN EMBUNG)',
        accentBg: '#eff6ff',
        accentBorder: '#e2e8f0',
        accentText: '#1e40af',
        rows: smpRows,
      });
    }
  }

  const tableWidth = A4_WIDTH_PX - PAD_X_PX * 2; // 710px
  const tableColumns = [
    { width: 32, lines: ['NO'], align: 'center' },
    { width: 46, lines: ['NO.', 'DADA'], align: 'center' },
    { width: 238, lines: ['PELETON / SEKOLAH'], align: 'left' },
    { width: 164, lines: ['KOMANDAN PELETON'], align: 'left' },
    { width: 64, lines: ['CHECK-IN'], align: 'center' },
    { width: 96, lines: ['WAKTU GLADI'], align: 'center' },
    { width: 70, lines: ['KETERANGAN'], align: 'center' },
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
    const { team, slotNumber, chestNumber, dantonName, checkIn, waktuGladi, isTwinSchool, logoSrc } = item;
    const bg = zebra ? '#f8fafc' : '#ffffff';

    const noteHtml = isTwinSchool
      ? '<span style="color:#92400e; font-weight:700; font-size:9.5px;">1 Sekolah</span>'
      : '<span style="color:#94a3b8; font-size:10px;">-</span>';

    return `
      <tr style="background-color: ${bg}; font-size: 10.5px; line-height: 1.25; color: #0f172a;">
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a;">${slotNumber}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a;">${escapeHtml(chestNumber)}</td>
        <td style="padding: 4px 6px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${logoSrc}" alt="" style="display: block; width: 20px; height: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0;" />
            <div style="font-weight: 700; color: #0f172a; font-size: 10px; line-height: 1.2; padding-bottom: 3px;">
              ${escapeHtml(team.schoolName || '-')}
            </div>
          </div>
        </td>
        <td style="padding: 3px 6px 8px 6px; text-align: left; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #334155; font-size: 9.5px; line-height: 1.25;">${escapeHtml(dantonName)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; color: #065f46; font-weight: 700; font-size: 9.5px;">${escapeHtml(checkIn)}</td>
        <td style="padding: 3px 3px 8px 3px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 9.5px;">${escapeHtml(waktuGladi)}</td>
        <td style="padding: 3px 4px 8px 4px; text-align: center; vertical-align: middle; border: 0.75px solid #e2e8f0;">${noteHtml}</td>
      </tr>
    `;
  };

  const docHeaderHtml = `
    <div style="text-align: center; margin-bottom: 12px;">
      <h2 style="margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.4px; color: #0f172a; text-transform: uppercase;">
        JADWAL UJI COBA LAPANGAN (UCL)
      </h2>
      <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; color: #334155;">
        LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027
      </p>
    </div>
  `;

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
    const lines = Math.max(schoolLen > 28 ? 2 : 1, dantonLen > 22 ? 2 : 1);
    return lines === 2 ? 42 : 34;
  };

  if (sections.length === 0) {
    currentHtmlParts.push(`
      <div style="padding: 36px 20px; text-align: center; border: 0.75px solid #e2e8f0; color: #64748b; font-size: 11px;">
        Belum ada peleton yang terjadwal pada Uji Coba Lapangan.
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

  if (currentHtmlParts.length > 0) {
    flushPage();
  }

  return pages;
}

/**
 * Ekspor PDF Jadwal Uji Coba Lapangan (UCL) menggunakan Kop A4 penuh (/kop-lbb-a4.png)
 *
 * @param {Object} params
 * @param {Object} params.currentPlan - Plan slot UCL { SD: { slots }, SMP: { slots } }
 * @param {Array} params.teams - Daftar tim kompetisi
 * @param {'all'|'SD'|'SMP'} params.mode - Mode arena yang diekspor
 * @param {Function} [params.onProgress] - Callback progres (opsional)
 */
export async function exportTrialSchedulePDF({
  currentPlan,
  teams = [],
  mode = 'all',
  onProgress = null,
} = {}) {
  if (onProgress) onProgress('Memuat kop surat & logo sekolah...');

  const teamsMap = new Map();
  teams.forEach((t) => teamsMap.set(t.id, t));

  const targetIds = new Set();
  if (mode === 'all' || mode === 'SD') {
    (currentPlan?.SD?.slots || []).forEach((id) => {
      if (id) targetIds.add(id);
    });
  }
  if (mode === 'all' || mode === 'SMP') {
    (currentPlan?.SMP?.slots || []).forEach((id) => {
      if (id) targetIds.add(id);
    });
  }

  const targetTeams = Array.from(targetIds)
    .map((id) => teamsMap.get(id))
    .filter(Boolean);

  if (targetTeams.length === 0) {
    throw new Error('Belum ada peleton yang terjadwal pada Uji Coba Lapangan untuk diekspor.');
  }

  const [kopDataUrl, logoMap] = await Promise.all([
    loadImageAsDataUrl(KOP_IMAGE_URL),
    preloadTeamLogos(targetTeams),
  ]);

  const pageBodies = buildTrialPagesHtml({ currentPlan, teamsMap, mode, logoMap });

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
    const scopeLabel = mode === 'SD' ? 'SD_MI' : mode === 'SMP' ? 'SMP_MTs' : 'SD_dan_SMP';
    const fileName = `Jadwal_UCL_${scopeLabel}_LBB_Muallimin_2027_${dateStamp}.pdf`;
    pdf.save(fileName);

    return { fileName, totalPages };
  } finally {
    document.body.removeChild(host);
  }
}
