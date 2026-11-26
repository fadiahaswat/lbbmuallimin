import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { getChestNumberByLot, isTestingTeam } from '../context/competitionHelpers.js';
import { EVENT, VENUE } from '../config.js';
import { HARI_H_SCHEDULE } from '../data/scheduleMatrices.js';

function getFloorLabel(roomCode = '') {
  const m = String(roomCode || '').trim().match(/^([1-4])/);
  return m ? `Lantai ${m[1]}` : '-';
}

const PELETON_POINTS = { 1: 10, 2: 3, 3: 1 };
const DANTON_POINTS = { 1: 5, 2: 2, 3: 1 };

function triggerBlobDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Muat file template .docx terbaru dari public/templates/ (tanpa cache)
 * lalu isi seluruh placeholder dan unduh sebagai file .docx siap pakai.
 */
export async function renderDocxFromTemplate({ templatePath, data, fileName }) {
  const bustUrl = `${templatePath}${templatePath.includes('?') ? '&' : '?'}t=${Date.now()}`;
  const res = await fetch(bustUrl, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Template Word tidak ditemukan: ${templatePath} (HTTP ${res.status})`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '-',
  });

  doc.render(data);

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  triggerBlobDownload(blob, fileName);
  return { fileName, templatePath };
}

function getChestNumStr(team) {
  const raw = team?.chestNumber || getChestNumberByLot(team?.jenjang, team?.lotNumber);
  return raw ? String(raw) : '-';
}

function compareByChest(a, b) {
  const cA = parseInt(getChestNumStr(a), 10);
  const cB = parseInt(getChestNumStr(b), 10);
  const nA = Number.isFinite(cA) ? cA : 9999;
  const nB = Number.isFinite(cB) ? cB : 9999;
  if (nA !== nB) return nA - nB;
  return (a?.schoolName || '').localeCompare(b?.schoolName || '');
}

function fmtNum(val, hasScore = true) {
  if (!hasScore) return '-';
  const num = Number(val);
  if (!Number.isFinite(num)) return '-';
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

function fmtPenalty(val, hasScore = true) {
  if (!hasScore) return '-';
  const num = Number(val);
  if (!Number.isFinite(num) || num === 0) return '0';
  return `-${Number.isInteger(num) ? String(num) : num.toFixed(2)}`;
}

function extractScoreMetrics(teamId, scores = {}) {
  const sc = scores[teamId];
  if (!sc) {
    return {
      hasScore: false,
      j1P: 0, j2P: 0, j3P: 0,
      nilaiMurniPeleton: 0, peletonPenalty: 0, nilaiAkhirPeleton: 0,
      j1D: 0, j2D: 0, j3D: 0,
      nilaiMurniDanton: 0, dantonPenalty: 0, nilaiAkhirDanton: 0,
      dantonMateri: 0, dantonVokal: 0,
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
  const dantonMateri = (j1Mat + j2Mat + j3Mat) > 0 ? (j1Mat + j2Mat + j3Mat) : Number(sc.danton?.rubricScores?.materi ?? 0);

  const j1Vok = Number(juries.pos1?.dantonRubricScores?.vokal ?? 0);
  const j2Vok = Number(juries.pos2?.dantonRubricScores?.vokal ?? 0);
  const j3Vok = Number(juries.pos3?.dantonRubricScores?.vokal ?? 0);
  const dantonVokal = (j1Vok + j2Vok + j3Vok) > 0 ? (j1Vok + j2Vok + j3Vok) : Number(sc.danton?.rubricScores?.vokal ?? 0);

  const nilaiMurniPeleton = Number(sc.nilaiMurniPeleton ?? sc.pbbTotal ?? sc.pbb?.total ?? parseFloat((j1P + j2P + j3P).toFixed(2)));
  const peletonPenalty = Number(sc.penalties?.peletonPenalty ?? sc.penaltiesTotal ?? sc.penalties?.totalPenalty ?? 0);
  const nilaiAkhirPeleton = Number(sc.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2))));

  const nilaiMurniDanton = Number(sc.nilaiMurniDanton ?? sc.dantonTotal ?? sc.danton?.total ?? parseFloat((j1D + j2D + j3D).toFixed(2)));
  const dantonPenalty = Number(sc.penalties?.dantonPenalty ?? 0);
  const nilaiAkhirDanton = Number(sc.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2))));

  const hasScore = Boolean(nilaiMurniPeleton > 0 || nilaiMurniDanton > 0 || sc.scoredAt || sc.status);
  return {
    hasScore,
    j1P, j2P, j3P,
    nilaiMurniPeleton, peletonPenalty, nilaiAkhirPeleton,
    j1D, j2D, j3D,
    nilaiMurniDanton, dantonPenalty, nilaiAkhirDanton,
    dantonMateri, dantonVokal,
  };
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

// =========================================================================
// 1. EKSPOR WORD: DAFTAR LOKASI BASECAMP
// =========================================================================
export async function exportBasecampDOCX({ teams = [] } = {}) {
  const clean = teams.filter((t) => t && t.status !== 'rejected' && !isTestingTeam(t));
  const mapRows = (jKey) =>
    clean
      .filter((t) => t.jenjang === jKey)
      .sort(compareByChest)
      .map((t, idx) => {
        const roomCode = t.basecampRoom || t.basecampNumber || '-';
        return {
          no: String(idx + 1),
          noDada: getChestNumStr(t),
          sekolah: t.schoolName || '-',
          ruang: roomCode,
          lantai: roomCode !== '-' ? getFloorLabel(roomCode) : '-',
        };
      });

  const dateStamp = new Date().toISOString().slice(0, 10);
  return renderDocxFromTemplate({
    templatePath: '/templates/01_Daftar_Basecamp.docx',
    data: {
      sdRows: mapRows('SD'),
      smpRows: mapRows('SMP'),
    },
    fileName: `Daftar_Basecamp_LBB_Muallimin_2027_${dateStamp}.docx`,
  });
}

// =========================================================================
// 2. EKSPOR WORD: HASIL UNDIAN NO. URUT & NO. DADA
// =========================================================================
export async function exportLotteryDOCX({ teams = [] } = {}) {
  const clean = teams.filter((t) => t && t.status !== 'rejected' && !isTestingTeam(t));
  const mapRows = (jKey) => {
    const matrix = HARI_H_SCHEDULE[jKey] || [];
    return clean
      .filter((t) => t.jenjang === jKey)
      .sort((a, b) => (Number(a.lotNumber) || 999) - (Number(b.lotNumber) || 999) || compareByChest(a, b))
      .map((t, idx) => {
        const lot = Number(t.lotNumber) || null;
        const slot = lot ? matrix[lot - 1] : null;
        return {
          noUrut: lot ? String(lot).padStart(2, '0') : String(idx + 1).padStart(2, '0'),
          noDada: getChestNumStr(t),
          sekolah: t.schoolName || '-',
          basecamp: t.basecampRoom || t.basecampNumber || '-',
          masukDp1: slot?.callDP1 || '-',
          jamTampil: slot?.startTampil || '-',
        };
      });
  };

  const dateStamp = new Date().toISOString().slice(0, 10);
  return renderDocxFromTemplate({
    templatePath: '/templates/02_Hasil_Undian_No_Dada.docx',
    data: {
      sdRows: mapRows('SD'),
      smpRows: mapRows('SMP'),
    },
    fileName: `Hasil_Undian_No_Dada_LBB_Muallimin_2027_${dateStamp}.docx`,
  });
}

// =========================================================================
// 3. EKSPOR WORD: JADWAL UJI COBA LAPANGAN (UCL)
// =========================================================================
export async function exportTrialScheduleDOCX({ teams = [], trialPlan = null } = {}) {
  const clean = teams.filter((t) => t && t.status !== 'rejected' && !isTestingTeam(t));
  const teamMap = new Map(clean.map((t) => [t.id, t]));

  const buildFromSlots = (slots = [], jKey) => {
    if (Array.isArray(slots) && slots.length > 0) {
      return slots
        .map((s, idx) => {
          const team = s.teamId ? teamMap.get(s.teamId) : null;
          if (team && isTestingTeam(team)) return null;
          return {
            slot: String(s.slotNumber || idx + 1).padStart(2, '0'),
            waktu: s.timeRange || s.time || `${s.startTime || '-'} - ${s.endTime || '-'}`,
            noDada: team ? getChestNumStr(team) : s.chestNumber || '-',
            sekolah: team?.schoolName || s.schoolName || '(Slot Kosong)',
            lapangan: s.fieldLabel || (jKey === 'SD' ? 'Lapangan SD' : 'Lapangan SMP'),
          };
        })
        .filter(Boolean);
    }
    return clean
      .filter((t) => t.jenjang === jKey)
      .sort(compareByChest)
      .map((t, idx) => ({
        slot: String(idx + 1).padStart(2, '0'),
        waktu: '-',
        noDada: getChestNumStr(t),
        sekolah: t.schoolName || '-',
        lapangan: jKey === 'SD' ? 'Lapangan SD' : 'Lapangan SMP',
      }));
  };

  const dateStamp = new Date().toISOString().slice(0, 10);
  return renderDocxFromTemplate({
    templatePath: '/templates/03_Jadwal_Uji_Coba_Lapangan.docx',
    data: {
      tanggalUcl: `${EVENT.FIELD_TRIAL_FULL_DATE} (${EVENT.FIELD_TRIAL_TIME_RANGE}) — ${VENUE.NAME}`,
      sdRows: buildFromSlots(trialPlan?.sdSlots || trialPlan?.SD, 'SD'),
      smpRows: buildFromSlots(trialPlan?.smpSlots || trialPlan?.SMP, 'SMP'),
    },
    fileName: `Jadwal_UCL_LBB_Muallimin_2027_${dateStamp}.docx`,
  });
}

// =========================================================================
// 4. EKSPOR WORD: LEMBAR INSPEKSI DP 1 (PER PELETON)
// =========================================================================
export async function exportDP1InspectionDOCX({ team, stagingEntry = null } = {}) {
  if (!team) throw new Error('Data peleton tidak ditemukan.');

  const roster = team.roster || {};
  const list = [];

  if (roster.danton?.name || team.dantonName) {
    list.push({ id: 'danton', posisi: 'Danton', nama: roster.danton?.name || team.dantonName || '-' });
  }
  const members = Array.isArray(roster.members) ? roster.members : [];
  members.forEach((m, idx) => {
    const saf = Math.floor(idx / 7) + 1;
    const banjar = (idx % 7) + 1;
    list.push({
      id: m.id || `p${idx + 1}`,
      posisi: `P${idx + 1} (S${saf}·B${banjar})`,
      nama: m.name || m.nama || '-',
    });
  });
  const reserves = Array.isArray(roster.reserves) ? roster.reserves : [];
  reserves.forEach((r, idx) => {
    list.push({
      id: r.id || `c${idx + 1}`,
      posisi: `Cadangan ${idx + 1}`,
      nama: r.name || r.nama || '-',
    });
  });

  const checks = stagingEntry?.dp1Checks || {};
  const personelRows = list.map((p, idx) => {
    const st = checks[p.id];
    return {
      no: String(idx + 1),
      posisi: p.posisi,
      nama: p.nama,
      cekCocok: st === 'matched' ? '☑' : '☐',
      cekIzin: st === 'excused' ? '☑' : '☐',
      cekTidak: st === 'flagged' ? '☑' : '☐',
    };
  });

  const safeSchool = String(team.schoolName || 'Peleton').replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 40);
  return renderDocxFromTemplate({
    templatePath: '/templates/04_Lembar_Inspeksi_DP1.docx',
    data: {
      sekolah: team.schoolName || '-',
      jenjang: team.jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs',
      basecamp: team.basecampRoom || team.basecampNumber || '-',
      totalPersonel: `${personelRows.length} Orang`,
      noDada: getChestNumStr(team),
      personelRows,
    },
    fileName: `Lembar_Inspeksi_DP1_${getChestNumStr(team)}_${safeSchool}.docx`,
  });
}

// =========================================================================
// 5. EKSPOR WORD: BERITA ACARA REKAPITULASI NILAI (BA.001)
// =========================================================================
export async function exportBARekapNilaiDOCX({ teams = [], scores = {} } = {}) {
  const clean = teams.filter((t) => t && t.status !== 'rejected' && !isTestingTeam(t));

  const buildRows = (jKey, isDanton) => {
    const enriched = clean
      .filter((t) => t.jenjang === jKey)
      .map((team) => ({
        team,
        chestNumber: getChestNumStr(team),
        dantonName: team.roster?.danton?.name || team.dantonName || '-',
        metrics: extractScoreMetrics(team.id, scores),
      }));

    // Hitung rank resmi sesuai Juknis
    const ranked = [...enriched].sort((a, b) => {
      if (b.metrics.hasScore !== a.metrics.hasScore) return b.metrics.hasScore ? 1 : -1;
      if (isDanton) {
        if (b.metrics.nilaiAkhirDanton !== a.metrics.nilaiAkhirDanton) return b.metrics.nilaiAkhirDanton - a.metrics.nilaiAkhirDanton;
        if (b.metrics.nilaiMurniDanton !== a.metrics.nilaiMurniDanton) return b.metrics.nilaiMurniDanton - a.metrics.nilaiMurniDanton;
        if (b.metrics.dantonMateri !== a.metrics.dantonMateri) return b.metrics.dantonMateri - a.metrics.dantonMateri;
        return b.metrics.dantonVokal - a.metrics.dantonVokal;
      }
      if (b.metrics.nilaiAkhirPeleton !== a.metrics.nilaiAkhirPeleton) return b.metrics.nilaiAkhirPeleton - a.metrics.nilaiAkhirPeleton;
      if (b.metrics.nilaiMurniPeleton !== a.metrics.nilaiMurniPeleton) return b.metrics.nilaiMurniPeleton - a.metrics.nilaiMurniPeleton;
      if (a.metrics.peletonPenalty !== b.metrics.peletonPenalty) return a.metrics.peletonPenalty - b.metrics.peletonPenalty;
      return b.metrics.nilaiMurniDanton - a.metrics.nilaiMurniDanton;
    });
    const rankMap = new Map();
    ranked.forEach((item, idx) => {
      rankMap.set(item.team.id, item.metrics.hasScore ? String(idx + 1) : '-');
    });

    // Tampilkan urut No. Dada
    return enriched
      .sort((a, b) => compareByChest(a.team, b.team))
      .map((item) => {
        const m = item.metrics;
        if (isDanton) {
          return {
            rank: rankMap.get(item.team.id) || '-',
            noDada: item.chestNumber,
            danton: item.dantonName,
            sekolah: item.team.schoolName || '-',
            juri1: fmtNum(m.j1D, m.hasScore),
            juri2: fmtNum(m.j2D, m.hasScore),
            juri3: fmtNum(m.j3D, m.hasScore),
            nilaiMurni: fmtNum(m.nilaiMurniDanton, m.hasScore),
            penalti: fmtPenalty(m.dantonPenalty, m.hasScore),
            nilaiAkhir: fmtNum(m.nilaiAkhirDanton, m.hasScore),
          };
        }
        return {
          rank: rankMap.get(item.team.id) || '-',
          noDada: item.chestNumber,
          sekolah: item.team.schoolName || '-',
          juri1: fmtNum(m.j1P, m.hasScore),
          juri2: fmtNum(m.j2P, m.hasScore),
          juri3: fmtNum(m.j3P, m.hasScore),
          nilaiMurni: fmtNum(m.nilaiMurniPeleton, m.hasScore),
          penalti: fmtPenalty(m.peletonPenalty, m.hasScore),
          nilaiAkhir: fmtNum(m.nilaiAkhirPeleton, m.hasScore),
        };
      });
  };

  const dateStamp = new Date().toISOString().slice(0, 10);
  return renderDocxFromTemplate({
    templatePath: '/templates/05_BA_Rekapitulasi_Nilai.docx',
    data: {
      nomorBA: 'BA.001/LBB-MLM/I/2027',
      hariTanggal: 'Ahad tanggal 24 Januari 2027',
      tanggalTerbilang: 'dua puluh empat bulan Januari tahun dua ribu dua puluh tujuh',
      tempat: VENUE.NAME,
      tanggalPendek: '24 Januari 2027',
      peletonSdRows: buildRows('SD', false),
      peletonSmpRows: buildRows('SMP', false),
      dantonSdRows: buildRows('SD', true),
      dantonSmpRows: buildRows('SMP', true),
    },
    fileName: `BA_001_Rekapitulasi_Nilai_LBB_Muallimin_2027_${dateStamp}.docx`,
  });
}

// =========================================================================
// 6. EKSPOR WORD: SURAT KEPUTUSAN PENETAPAN PEMENANG (SK.001)
// =========================================================================
export async function exportSKPemenangDOCX({ teams = [], scores = {} } = {}) {
  const clean = teams.filter((t) => t && t.status !== 'rejected' && !isTestingTeam(t));

  const computeJenjang = (jKey) => {
    const jTeams = clean.filter((t) => t.jenjang === jKey);
    const enriched = jTeams.map((team) => ({
      team,
      chestNumber: getChestNumStr(team),
      dantonName: team.roster?.danton?.name || team.dantonName || '-',
      metrics: extractScoreMetrics(team.id, scores),
    }));
    const scored = enriched.filter((e) => e.metrics.hasScore);

    const peletonRanked = [...scored].sort((a, b) => {
      if (b.metrics.nilaiAkhirPeleton !== a.metrics.nilaiAkhirPeleton) return b.metrics.nilaiAkhirPeleton - a.metrics.nilaiAkhirPeleton;
      if (b.metrics.nilaiMurniPeleton !== a.metrics.nilaiMurniPeleton) return b.metrics.nilaiMurniPeleton - a.metrics.nilaiMurniPeleton;
      if (a.metrics.peletonPenalty !== b.metrics.peletonPenalty) return a.metrics.peletonPenalty - b.metrics.peletonPenalty;
      return b.metrics.nilaiMurniDanton - a.metrics.nilaiMurniDanton;
    });

    const dantonRanked = [...scored].sort((a, b) => {
      if (b.metrics.nilaiAkhirDanton !== a.metrics.nilaiAkhirDanton) return b.metrics.nilaiAkhirDanton - a.metrics.nilaiAkhirDanton;
      if (b.metrics.nilaiMurniDanton !== a.metrics.nilaiMurniDanton) return b.metrics.nilaiMurniDanton - a.metrics.nilaiMurniDanton;
      if (a.metrics.dantonPenalty !== b.metrics.dantonPenalty) return a.metrics.dantonPenalty - b.metrics.dantonPenalty;
      if (b.metrics.dantonMateri !== a.metrics.dantonMateri) return b.metrics.dantonMateri - a.metrics.dantonMateri;
      return b.metrics.dantonVokal - a.metrics.dantonVokal;
    });

    const pRankMap = new Map();
    peletonRanked.forEach((item, idx) => pRankMap.set(item.team.id, { rank: idx + 1, points: PELETON_POINTS[idx + 1] || 0 }));
    const dRankMap = new Map();
    dantonRanked.forEach((item, idx) => dRankMap.set(item.team.id, { rank: idx + 1, points: DANTON_POINTS[idx + 1] || 0 }));

    const schoolMap = new Map();
    scored.forEach((item) => {
      const baseName = getBaseSchoolName(item.team.schoolName) || item.team.schoolName;
      const key = getNormalizedSchoolKey(item.team.jenjang, item.team.schoolName);
      const suffix = getPlatoonSuffix(item.team.schoolName);
      const pInfo = pRankMap.get(item.team.id) || { rank: 99, points: 0 };
      const dInfo = dRankMap.get(item.team.id) || { rank: 99, points: 0 };

      if (!schoolMap.has(key)) {
        schoolMap.set(key, {
          schoolName: baseName,
          totalPoints: 0,
          achievements: [],
          bestMurniPeleton: 0,
          leastPeletonPenalty: 9999,
          bestMurniDanton: 0,
        });
      }
      const sch = schoolMap.get(key);
      sch.totalPoints += pInfo.points + dInfo.points;
      if (pInfo.rank >= 1 && pInfo.rank <= 3) {
        sch.achievements.push(`• Juara ${pInfo.rank} Peleton${suffix ? ` ${suffix}` : ''} (${pInfo.points} poin)`);
      }
      if (dInfo.rank >= 1 && dInfo.rank <= 3) {
        sch.achievements.push(`• Juara ${dInfo.rank} Komandan${suffix ? ` ${suffix}` : ''} (${dInfo.points} poin)`);
      }
      if (item.metrics.nilaiMurniPeleton > sch.bestMurniPeleton) {
        sch.bestMurniPeleton = item.metrics.nilaiMurniPeleton;
        sch.leastPeletonPenalty = item.metrics.peletonPenalty;
      }
      if (item.metrics.nilaiMurniDanton > sch.bestMurniDanton) {
        sch.bestMurniDanton = item.metrics.nilaiMurniDanton;
      }
    });

    const umumRanked = Array.from(schoolMap.values())
      .filter((s) => s.totalPoints > 0)
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.bestMurniPeleton !== a.bestMurniPeleton) return b.bestMurniPeleton - a.bestMurniPeleton;
        if (a.leastPeletonPenalty !== b.leastPeletonPenalty) return a.leastPeletonPenalty - b.leastPeletonPenalty;
        return b.bestMurniDanton - a.bestMurniDanton;
      });

    return {
      total: jTeams.length,
      peletonTop6: peletonRanked.slice(0, 6),
      dantonTop3: dantonRanked.slice(0, 3),
      juaraUmum: umumRanked[0] || null,
    };
  };

  const sd = computeJenjang('SD');
  const smp = computeJenjang('SMP');

  const mapPeletonRow = (predikat, item) => ({
    predikat,
    noDada: item ? item.chestNumber : '-',
    sekolah: item ? item.team.schoolName : '-',
    nilaiMurni: item ? fmtNum(item.metrics.nilaiMurniPeleton) : '-',
    penalti: item ? fmtPenalty(item.metrics.peletonPenalty) : '-',
    nilaiAkhir: item ? fmtNum(item.metrics.nilaiAkhirPeleton) : '-',
  });

  const mapDantonRow = (predikat, item) => ({
    predikat,
    noDada: item ? item.chestNumber : '-',
    danton: item ? item.dantonName : '-',
    sekolah: item ? item.team.schoolName : '-',
    penalti: item ? fmtPenalty(item.metrics.dantonPenalty) : '-',
    nilaiAkhir: item ? fmtNum(item.metrics.nilaiAkhirDanton) : '-',
  });

  const dateStamp = new Date().toISOString().slice(0, 10);
  return renderDocxFromTemplate({
    templatePath: '/templates/06_SK_Penetapan_Pemenang.docx',
    data: {
      nomorSK: 'SK.001/LBB-MLM/I/2027',
      nomorBA: 'BA.001/LBB-MLM/I/2027',
      jumlahSd: String(sd.total),
      jumlahSmp: String(smp.total),
      totalPeleton: String(sd.total + smp.total),
      hariTanggal: EVENT.COMPETITION_DATE,
      tempat: `${VENUE.NAME} (${VENUE.SHORT_ADDRESS})`,
      tanggalTM: EVENT.TECHNICAL_MEETING_DATE,
      tanggalPendek: '24 Januari 2027',
      harapanSdRows: [
        mapPeletonRow('Harapan 3', sd.peletonTop6[5]),
        mapPeletonRow('Harapan 2', sd.peletonTop6[4]),
        mapPeletonRow('Harapan 1', sd.peletonTop6[3]),
      ],
      harapanSmpRows: [
        mapPeletonRow('Harapan 3', smp.peletonTop6[5]),
        mapPeletonRow('Harapan 2', smp.peletonTop6[4]),
        mapPeletonRow('Harapan 1', smp.peletonTop6[3]),
      ],
      utamaSdRows: [
        mapPeletonRow('Juara 3', sd.peletonTop6[2]),
        mapPeletonRow('Juara 2', sd.peletonTop6[1]),
        mapPeletonRow('Juara 1', sd.peletonTop6[0]),
      ],
      utamaSmpRows: [
        mapPeletonRow('Juara 3', smp.peletonTop6[2]),
        mapPeletonRow('Juara 2', smp.peletonTop6[1]),
        mapPeletonRow('Juara 1', smp.peletonTop6[0]),
      ],
      dantonSdRows: [
        mapDantonRow('Juara 3', sd.dantonTop3[2]),
        mapDantonRow('Juara 2', sd.dantonTop3[1]),
        mapDantonRow('Juara 1', sd.dantonTop3[0]),
      ],
      dantonSmpRows: [
        mapDantonRow('Juara 3', smp.dantonTop3[2]),
        mapDantonRow('Juara 2', smp.dantonTop3[1]),
        mapDantonRow('Juara 1', smp.dantonTop3[0]),
      ],
      juaraUmumRows: [
        {
          predikat: 'Juara Umum SD / MI',
          sekolah: sd.juaraUmum ? sd.juaraUmum.schoolName : '-',
          rincian: sd.juaraUmum ? sd.juaraUmum.achievements.join('\n') : '-',
          totalPoin: sd.juaraUmum ? `${sd.juaraUmum.totalPoints} Poin` : '-',
        },
        {
          predikat: 'Juara Umum SMP / MTs',
          sekolah: smp.juaraUmum ? smp.juaraUmum.schoolName : '-',
          rincian: smp.juaraUmum ? smp.juaraUmum.achievements.join('\n') : '-',
          totalPoin: smp.juaraUmum ? `${smp.juaraUmum.totalPoints} Poin` : '-',
        },
      ],
    },
    fileName: `SK_001_Penetapan_Pemenang_LBB_Muallimin_2027_${dateStamp}.docx`,
  });
}
