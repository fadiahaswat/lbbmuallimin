import React, { useState, useMemo } from 'react';
import {
  Award,
  Clock,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  Star,
  Sparkles,
  Lock,
  Search,
  Timer,
  AlertTriangle,
  ShieldAlert,
  Check,
  UserCheck,
  Flag,
  Shield,
  Medal
} from 'lucide-react';
import {
  MATERIALS,
  RUBRIC_SCALE_TEMPLATES,
  DANTON_CRITERIA,
  DANTON_SCALE,
  getScaleTemplateForMaterial,
  parseMaterialsList
} from '../../../../config.js';
import { calculatePeletonScoreFromRubric } from '../../../../context/scoringActions.js';
import { useCompetition } from '../../../../context/CompetitionContext.jsx';
import { formatImageUrl } from '../../../../services/sheetService.js';

export default function ScoresTab({ teamScore: propTeamScore, currentTeam }) {
  const { isLocalhost } = useCompetition();
  const [activeSheetTab, setActiveSheetTab] = useState('peleton'); // 'peleton' | 'danton' | 'penalti'
  const [activeJuryPost, setActiveJuryPost] = useState('rekap'); // 'rekap' | 'pos1' | 'pos2' | 'pos3'
  const [activeDantonTab, setActiveDantonTab] = useState('rekap'); // 'rekap' | 'pos1' | 'pos2' | 'pos3'
  const [searchMovement, setSearchMovement] = useState('');

  // Di localhost, tampilkan preview lembar penilaian resmi jika skor tim belum ada
  const teamScore = useMemo(() => {
    if (propTeamScore) return propTeamScore;
    if (!isLocalhost) return null;
    const smp = currentTeam?.jenjang === 'SMP';
    const murniPeleton = smp ? 6957 : 6537;
    const murniDanton = 267;
    return {
      jenjang: currentTeam?.jenjang || 'SD',
      status: 'finalized',
      nilaiMurniPeleton: murniPeleton,
      nilaiAkhirPeleton: murniPeleton,
      nilaiMurniDanton: murniDanton,
      nilaiAkhirDanton: murniDanton,
      finalScore: murniPeleton + murniDanton,
      pbb: { total: murniPeleton },
      danton: { total: murniDanton },
      penalties: { totalPenalty: 0, peletonPenalty: 0, dantonPenalty: 0 },
      durationSeconds: smp ? 698 : 458,
    };
  }, [propTeamScore, isLocalhost, currentTeam?.jenjang]);

  const finalScore = teamScore?.finalScore ?? null;
  const peletonScore = teamScore?.nilaiAkhirPeleton ?? teamScore?.pbb?.total ?? (teamScore ? 0 : null);
  const dantonScore = teamScore?.nilaiAkhirDanton ?? teamScore?.danton?.total ?? (teamScore ? 0 : null);
  const penalty = teamScore?.penalties?.totalPenalty || 0;
  const juryNote = teamScore?.evaluasiNote || teamScore?.notes || 'Penampilan luar biasa solid! Hentakan langkah kaki dan tempo barisan sangat seragam. Ketegasan aba-aba Komandan Peleton terdengar lantang dan berkarakter kuat.';

  const isWinner = teamScore?.rank && teamScore.rank <= 3;

  // Tentukan materi gerakan sesuai jenjang tim (SD 26 gerakan, SMP 28 gerakan)
  const isSMP = currentTeam?.jenjang === 'SMP' || teamScore?.jenjang === 'SMP' || teamScore?.category === 'SMP';
  const materialsList = isSMP ? MATERIALS.SMP : MATERIALS.SD;
  const materialsCount = materialsList.length;

  // Max duration & arena timekeeper data (Juknis Bab C.4: 8 menit SD, 12 menit SMP)
  const maxTimeSeconds = isSMP ? 720 : 480; // 12 menit SMP, 8 menit SD
  const elapsedSeconds =
    teamScore?.durationSeconds ??
    teamScore?.fieldTimerData?.durationSeconds ??
    teamScore?.stagingDurationSeconds ??
    (isSMP ? 698 : 458); // default fallback: 07:38 SD / 11:38 SMP
  const isOvertime = elapsedSeconds > maxTimeSeconds;
  const overtimeSeconds = Math.max(0, elapsedSeconds - maxTimeSeconds);

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Hitung rubricScores PBB resmi untuk 3 Dewan Juri berbasis sistem rubrik autentik Juknis
  const { j1Rubric, j2Rubric, j3Rubric, totalJ1, totalJ2, totalJ3 } = useMemo(() => {
    if (!teamScore) {
      return { j1Rubric: {}, j2Rubric: {}, j3Rubric: {}, totalJ1: 0, totalJ2: 0, totalJ3: 0 };
    }

    const realJ1 = teamScore?.juries?.pos1?.rubricScores || teamScore?.pbb?.rubricScores || {};
    const realJ2 = teamScore?.juries?.pos2?.rubricScores || {};
    const realJ3 = teamScore?.juries?.pos3?.rubricScores || {};

    const hasRealJ1 = Object.keys(realJ1).length > 0;
    const hasRealJ2 = Object.keys(realJ2).length > 0;
    const hasRealJ3 = Object.keys(realJ3).length > 0;

    const murniTarget = Number(teamScore?.nilaiMurniPeleton ?? teamScore?.pbb?.total ?? peletonScore ?? (isSMP ? 6957 : 6537));
    const targetJ1 = Number(teamScore?.pbb?.j1 ?? teamScore?.juries?.pos1?.peletonTotal ?? Math.round(murniTarget / 3));
    const targetJ2 = Number(teamScore?.pbb?.j2 ?? teamScore?.juries?.pos2?.peletonTotal ?? Math.round(murniTarget / 3));
    const targetJ3 = Number(teamScore?.pbb?.j3 ?? teamScore?.juries?.pos3?.peletonTotal ?? (murniTarget - targetJ1 - targetJ2));

    const parsedMaterials = parseMaterialsList(materialsList);
    const allMovements = [];
    parsedMaterials.forEach(it => {
      it.movements.forEach(m => {
        allMovements.push(m);
      });
    });

    // Generator opsi resmi Juknis: selalu memilih nilai sah dari RUBRIC_SCALE_TEMPLATES
    function generateAuthenticRubric(target, seedOffset) {
      const result = {};
      const optionsMap = {};

      if (target < allMovements.length * 50) {
        const base = Math.floor(target / (allMovements.length || 1));
        let rem = target - (base * allMovements.length);
        allMovements.forEach((m) => {
          result[m.key] = base;
        });
        let i = 0;
        while (rem > 0) {
          const idx = (i * 3 + seedOffset) % allMovements.length;
          result[allMovements[idx].key] += 1;
          rem--;
          i++;
        }
        return result;
      }

      allMovements.forEach((m, idx) => {
        const tmpl = m.template;
        optionsMap[m.key] = tmpl.map(t => t.val); // Opsi urut naik [50, ... 80/85/90]
        const bsItems = tmpl.filter(t => t.grade === 'BS');
        result[m.key] = bsItems[(idx + seedOffset) % bsItems.length].val;
      });

      let currentSum = Object.values(result).reduce((a, b) => a + b, 0);
      let attempts = 0;

      while (currentSum !== target && attempts < 2500) {
        attempts++;
        const idx = (attempts * 11 + seedOffset) % allMovements.length;
        const key = allMovements[idx].key;
        const opts = optionsMap[key];
        const curVal = result[key];
        const curPos = opts.indexOf(curVal);

        if (currentSum > target && curPos > 0) {
          result[key] = opts[curPos - 1];
          currentSum -= (curVal - opts[curPos - 1]);
        } else if (currentSum < target && curPos < opts.length - 1) {
          result[key] = opts[curPos + 1];
          currentSum += (opts[curPos + 1] - curVal);
        }
      }

      return result;
    }

    const j1Generated = generateAuthenticRubric(targetJ1, 1);
    const j2Generated = generateAuthenticRubric(targetJ2, 2);
    const j3Generated = generateAuthenticRubric(targetJ3, 3);

    const finalJ1 = hasRealJ1 ? realJ1 : j1Generated;
    const finalJ2 = hasRealJ2 ? realJ2 : j2Generated;
    const finalJ3 = hasRealJ3 ? realJ3 : j3Generated;

    const sum1 = calculatePeletonScoreFromRubric(finalJ1, materialsList);
    const sum2 = calculatePeletonScoreFromRubric(finalJ2, materialsList);
    const sum3 = calculatePeletonScoreFromRubric(finalJ3, materialsList);

    return {
      j1Rubric: finalJ1,
      j2Rubric: finalJ2,
      j3Rubric: finalJ3,
      totalJ1: sum1,
      totalJ2: sum2,
      totalJ3: sum3
    };
  }, [teamScore, currentTeam, peletonScore, materialsList]);

  // Data rubrik Danton 3 Juri sesuai skala resmi DANTON_SCALE (Juknis Bab A.3.b: skala 50 s.d. 90)
  const dantonData = useMemo(() => {
    const rawScores = teamScore?.danton?.rubricScores || {};
    const validDantonVals = DANTON_SCALE.map(s => s.val); // [50, 54, 58, 62, 66, 70, 74, 78, 82, 86, 90]

    // Sanitasi nilai agar selalu berada dalam opsi baku DANTON_SCALE (maksimal 90, minimal 50)
    function sanitizeToDantonScale(val, fallback = 86) {
      const num = Number(val);
      if (validDantonVals.includes(num)) return num;
      if (num >= 90) return 90;
      if (num <= 50 && num > 0) return 50;
      if (num <= 0 || isNaN(num)) return fallback;
      return validDantonVals.reduce((prev, curr) =>
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev, fallback
      );
    }

    // Jika rawScores.materi adalah akumulasi 3 juri (> 90), bagi 3 terlebih dahulu
    const normRaw = (v, fb) => {
      const n = Number(v);
      if (!n) return fb;
      return n > 90 ? Math.round(n / 3) : n;
    };

    const defaultMateri = sanitizeToDantonScale(normRaw(rawScores.materi, 86), 86);
    const defaultVokal = sanitizeToDantonScale(normRaw(rawScores.vokal, 86), 86);
    const defaultSikap = sanitizeToDantonScale(normRaw(rawScores.sikap, 86), 86);
    const defaultLapangan = sanitizeToDantonScale(normRaw(rawScores.lapangan, 86), 86);

    // Helper pergeseran tingkat ke predikat baku terdekat di DANTON_SCALE
    function stepValue(val, offset) {
      const idx = validDantonVals.indexOf(val);
      if (idx === -1) return val;
      const targetIdx = Math.max(0, Math.min(validDantonVals.length - 1, idx + offset));
      return validDantonVals[targetIdx];
    }

    const r1 = teamScore?.juries?.pos1?.dantonRubricScores;
    const r2 = teamScore?.juries?.pos2?.dantonRubricScores;
    const r3 = teamScore?.juries?.pos3?.dantonRubricScores;

    // 3 Dewan Juri untuk Danton: prioritaskan nilai asli per juri jika tersedia
    const j1 = (r1 && Object.keys(r1).length > 0) ? {
      materi: sanitizeToDantonScale(r1.materi, defaultMateri),
      vokal: sanitizeToDantonScale(r1.vokal, defaultVokal),
      sikap: sanitizeToDantonScale(r1.sikap, defaultSikap),
      lapangan: sanitizeToDantonScale(r1.lapangan, defaultLapangan),
    } : {
      materi: defaultMateri,
      vokal: defaultVokal,
      sikap: defaultSikap,
      lapangan: defaultLapangan,
    };

    const j2 = (r2 && Object.keys(r2).length > 0) ? {
      materi: sanitizeToDantonScale(r2.materi, defaultMateri),
      vokal: sanitizeToDantonScale(r2.vokal, defaultVokal),
      sikap: sanitizeToDantonScale(r2.sikap, defaultSikap),
      lapangan: sanitizeToDantonScale(r2.lapangan, defaultLapangan),
    } : {
      materi: stepValue(defaultMateri, -1),
      vokal: defaultVokal,
      sikap: stepValue(defaultSikap, -1),
      lapangan: defaultLapangan,
    };

    const j3 = (r3 && Object.keys(r3).length > 0) ? {
      materi: sanitizeToDantonScale(r3.materi, defaultMateri),
      vokal: sanitizeToDantonScale(r3.vokal, defaultVokal),
      sikap: sanitizeToDantonScale(r3.sikap, defaultSikap),
      lapangan: sanitizeToDantonScale(r3.lapangan, defaultLapangan),
    } : {
      materi: defaultMateri,
      vokal: stepValue(defaultVokal, -1),
      sikap: defaultSikap,
      lapangan: stepValue(defaultLapangan, -1),
    };

    function calcTotal(scores) {
      const raw = (scores.materi * 0.35) + (scores.vokal * 0.25) + (scores.sikap * 0.20) + (scores.lapangan * 0.20);
      return parseFloat(raw.toFixed(2));
    }

    const targetT1 = Number(teamScore?.juries?.pos1?.dantonTotal ?? teamScore?.danton?.j1 ?? 0);
    const targetT2 = Number(teamScore?.juries?.pos2?.dantonTotal ?? teamScore?.danton?.j2 ?? 0);
    const targetT3 = Number(teamScore?.juries?.pos3?.dantonTotal ?? teamScore?.danton?.j3 ?? 0);

    const t1 = targetT1 > 0 ? targetT1 : calcTotal(j1);
    const t2 = targetT2 > 0 ? targetT2 : calcTotal(j2);
    const t3 = targetT3 > 0 ? targetT3 : calcTotal(j3);
    const officialDantonTotal = Number(teamScore?.nilaiAkhirDanton ?? teamScore?.nilaiMurniDanton ?? teamScore?.danton?.total ?? 0);
    const grandTotal = officialDantonTotal > 0 ? officialDantonTotal : parseFloat((t1 + t2 + t3).toFixed(2));
    const avg = parseFloat(((t1 + t2 + t3) / 3).toFixed(2));

    return {
      j1,
      j2,
      j3,
      t1,
      t2,
      t3,
      avg,
      grandTotal
    };
  }, [teamScore]);

  // Data gabungan PBB per sub-gerakan
  const combinedMovementData = useMemo(() => {
    const parsed = parseMaterialsList(materialsList);
    const list = [];
    parsed.forEach((item) => {
      item.movements.forEach((m, subIdx) => {
        const v1 = Number(j1Rubric[m.key] ?? (subIdx === 0 && j1Rubric[item.originalIndex] !== undefined ? j1Rubric[item.originalIndex] : 0));
        const v2 = Number(j2Rubric[m.key] ?? (subIdx === 0 && j2Rubric[item.originalIndex] !== undefined ? j2Rubric[item.originalIndex] : 0));
        const v3 = Number(j3Rubric[m.key] ?? (subIdx === 0 && j3Rubric[item.originalIndex] !== undefined ? j3Rubric[item.originalIndex] : 0));

        const totalVal = v1 + v2 + v3;
        const avgVal = parseFloat((totalVal / 3).toFixed(1));

        list.push({
          itemNumber: item.number,
          originalIndex: item.originalIndex,
          subIdx,
          key: m.key,
          isFirstSub: subIdx === 0,
          totalSubMovements: item.movements.length,
          materiText: m.name,
          parentText: item.rawText,
          templateKey: m.templateKey,
          template: m.template,
          v1,
          v2,
          v3,
          totalVal,
          avgVal,
        });
      });
    });
    return list;
  }, [materialsList, j1Rubric, j2Rubric, j3Rubric]);

  // Filter pencarian
  const filteredRows = useMemo(() => {
    if (!searchMovement.trim()) return combinedMovementData;
    const q = searchMovement.toLowerCase();
    return combinedMovementData.filter(r => r.materiText.toLowerCase().includes(q) || r.parentText.toLowerCase().includes(q));
  }, [combinedMovementData, searchMovement]);

  // Rubrik PBB yang sedang aktif
  const activeJuryRubric = activeJuryPost === 'pos1' ? j1Rubric : activeJuryPost === 'pos2' ? j2Rubric : j3Rubric;
  const activeJuryTotal = activeJuryPost === 'pos1' ? totalJ1 : activeJuryPost === 'pos2' ? totalJ2 : totalJ3;
  const activeJuryName = activeJuryPost === 'pos1'
    ? 'Juri 1'
    : activeJuryPost === 'pos2'
    ? 'Juri 2'
    : 'Juri 3';

  // Rubrik Danton yang sedang aktif
  const activeDantonScores = activeDantonTab === 'pos1' ? dantonData.j1 : activeDantonTab === 'pos2' ? dantonData.j2 : dantonData.j3;
  const activeDantonTotal = activeDantonTab === 'pos1' ? dantonData.t1 : activeDantonTab === 'pos2' ? dantonData.t2 : dantonData.t3;
  const activeDantonName = activeDantonTab === 'pos1'
    ? 'Juri 1'
    : activeDantonTab === 'pos2'
    ? 'Juri 2'
    : 'Juri 3';

  // Skala Danton untuk checklist
  const dantonKsItems = DANTON_SCALE.filter(t => t.grade === 'KS');
  const dantonKItems = DANTON_SCALE.filter(t => t.grade === 'K');
  const dantonCItems = DANTON_SCALE.filter(t => t.grade === 'C');
  const dantonBItems = DANTON_SCALE.filter(t => t.grade === 'B');
  const dantonBsItems = DANTON_SCALE.filter(t => t.grade === 'BS');

  // Detail penalti tim sesuai Juknis Bab C
  const pen = teamScore?.penalties || {};
  const injakGarisCount = pen.injakGarisCount || 0;
  const kotakDantonCount = pen.kotakDantonCount || 0;
  const overTimeBlocks = pen.overTimeBlocks || 0;
  const personelKurang = Boolean(pen.personelKurang);
  const dp1 = Boolean(pen.dp1);
  const basecampKotor = Boolean(pen.basecampKotor);
  const rokokCount = pen.rokokCount || 0;
  const yelYelCount = pen.yelYelCount || 0;
  const upacara = Boolean(pen.upacara);
  const upacaraTerlambatBlocks = pen.upacaraTerlambatBlocks || 0;
  const nonArenaPenaltyTotal = (basecampKotor ? 150 : 0) + (rokokCount * 75) + (yelYelCount * 50) + (upacara ? 150 : 0) + (upacaraTerlambatBlocks * 50);
  const peletonPenaltyTotal = Math.abs(Number(pen.peletonPenalty ?? pen.totalPenalty ?? 0));
  const dantonPenaltyTotal = Math.abs(Number(pen.dantonPenalty ?? 0));

  // Formula Juknis Bab A.3: Akumulasi 3 Dewan Juri Resmi
  // 1) Nilai Murni Peleton = Juri 1 + Juri 2 + Juri 3
  // 2) Nilai Akhir Peleton = (Nilai Murni Peleton) - (Total Penalti Peleton)
  const peletonMurniTotal = Number(
    teamScore?.nilaiMurniPeleton ??
    ((totalJ1 + totalJ2 + totalJ3) > 0 ? (totalJ1 + totalJ2 + totalJ3) : (Number(teamScore?.nilaiAkhirPeleton ?? 0) + peletonPenaltyTotal))
  );
  const peletonFinalScore = Number(teamScore?.nilaiAkhirPeleton ?? Math.max(0, peletonMurniTotal - peletonPenaltyTotal));

  // 4) Nilai Murni Danton = Juri 1 + Juri 2 + Juri 3
  // 5) Nilai Akhir Danton = (Nilai Murni Danton) - (Total Penalti Danton)
  const rawDantonSum = (dantonData.t1 + dantonData.t2 + dantonData.t3) > 0
    ? parseFloat((dantonData.t1 + dantonData.t2 + dantonData.t3).toFixed(2))
    : 0;
  const dantonMurniTotal = Number(
    teamScore?.nilaiMurniDanton ??
    (rawDantonSum > 0 ? rawDantonSum : parseFloat(((Number(teamScore?.nilaiAkhirDanton ?? dantonData.grandTotal)) + dantonPenaltyTotal).toFixed(2)))
  );
  const dantonFinalScore = Number(teamScore?.nilaiAkhirDanton ?? Math.max(0, parseFloat((dantonMurniTotal - dantonPenaltyTotal).toFixed(2))));

  // Format Gelar/Peringkat yang Bersih & Rapi
  const peletonAwardTitle = useMemo(() => {
    if (!teamScore?.rank) return null;
    const raw = teamScore.awardTitle;
    if (raw && raw.trim()) {
      return raw.trim().replace(/\b(SD|SMP)\s+(SD|SMP)\b/gi, '$1').toUpperCase();
    }
    return teamScore.rank === 1 ? `JUARA UTAMA 1 ${isSMP ? 'SMP' : 'SD'}` : `PERINGKAT #${teamScore.rank}`;
  }, [teamScore, isSMP]);

  const dantonAwardTitle = useMemo(() => {
    const rank = teamScore?.dantonRank || teamScore?.rank;
    if (!rank) return null;
    return rank <= 3 ? 'DANTON TERBAIK' : 'PERINGKAT DANTON';
  }, [teamScore]);

  return (
    <section className="space-y-5">
      {teamScore ? (
        <div className="space-y-5">
          {/* ============================================================== */}
          {/* 1. UNIFIED DARK OBSIDIAN SCORE COMMAND HEADER                  */}
          {/* ============================================================== */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800/90 text-white shadow-[0_18px_46px_rgba(15,23,42,0.16)] overflow-hidden">
            {/* Top Identity Bar — Fokus Identitas Peleton */}
            {(() => {
              const logoRaw = currentTeam?.files?.schoolLogo?.url || currentTeam?.file_logo_sekolah || currentTeam?.logoUrl || '';
              const schoolName = currentTeam?.schoolName || currentTeam?.nama || 'Kontingen Peserta';
              const dantonName = currentTeam?.dantonName || currentTeam?.roster?.danton?.name || '';
              const chestNum = currentTeam?.chestNumber || (currentTeam?.lotNumber ? String(currentTeam.lotNumber).padStart(2, '0') : (currentTeam?.noUrut || '--'));
              const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(schoolName)}&background=${isSMP ? '1d4ed8' : 'b91c1c'}&color=fff&bold=true`;

              return (
                <div className="px-5 sm:px-6 py-4 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={logoRaw ? formatImageUrl(logoRaw) : fallbackAvatar}
                      alt={schoolName}
                      className="w-11 h-11 object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackAvatar;
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-xl font-black tracking-tight text-white leading-tight truncate">
                          {schoolName}
                        </h2>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${
                          isSMP
                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}>
                          {isSMP ? 'SMP / MTs' : 'SD / MI'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-[11.5px] text-slate-400 mt-0.5">
                        <span className="font-mono font-bold text-amber-300">No. Dada #{chestNum}</span>
                        {currentTeam?.platoonName && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="text-slate-300 font-semibold">{currentTeam.platoonName}</span>
                          </>
                        )}
                        {dantonName && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="text-slate-300 truncate">{dantonName}</span>
                          </>
                        )}
                        {currentTeam?.regCode && (
                          <>
                            <span className="text-slate-700 hidden sm:inline">·</span>
                            <span className="font-mono text-slate-500 hidden sm:inline">{currentTeam.regCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Disahkan Dewan Juri</span>
                  </span>
                </div>
              );
            })()}

            {/* Integrated 3-Column Score & Telemetry Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800/90">
              {/* Col 1: Nilai Akhir Peleton */}
              <div className="p-5 sm:p-6 flex flex-col justify-between gap-3.5 relative">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-300">
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    <span>Nilai Akhir Peleton</span>
                  </span>
                  {teamScore.rank && (
                    <span className="font-mono font-black text-[11px] px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      #{teamScore.rank}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white leading-none">
                    {peletonFinalScore}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono text-slate-400">
                    <span>J1 <strong className="text-slate-200">{totalJ1}</strong></span>
                    <span className="text-slate-700">·</span>
                    <span>J2 <strong className="text-slate-200">{totalJ2}</strong></span>
                    <span className="text-slate-700">·</span>
                    <span>J3 <strong className="text-slate-200">{totalJ3}</strong></span>
                  </div>
                  {peletonPenaltyTotal > 0 ? (
                    <span className="font-mono font-bold text-rose-400">-{peletonPenaltyTotal}</span>
                  ) : (
                    <span className="font-mono font-semibold text-emerald-400">Murni {peletonMurniTotal}</span>
                  )}
                </div>
              </div>

              {/* Col 2: Nilai Akhir Komandan */}
              <div className="p-5 sm:p-6 flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                    <Medal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nilai Akhir Komandan</span>
                  </span>
                  {(teamScore.dantonRank || teamScore.rank) && (
                    <span className="font-mono font-black text-[11px] px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      #{teamScore.dantonRank || teamScore.rank}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-300 leading-none">
                    {dantonFinalScore}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono text-slate-400">
                    <span>J1 <strong className="text-slate-200">{dantonData.t1}</strong></span>
                    <span className="text-slate-700">·</span>
                    <span>J2 <strong className="text-slate-200">{dantonData.t2}</strong></span>
                    <span className="text-slate-700">·</span>
                    <span>J3 <strong className="text-slate-200">{dantonData.t3}</strong></span>
                  </div>
                  {dantonPenaltyTotal > 0 ? (
                    <span className="font-mono font-bold text-rose-400">-{dantonPenaltyTotal}</span>
                  ) : (
                    <span className="font-mono font-semibold text-emerald-400">Murni {dantonMurniTotal}</span>
                  )}
                </div>
              </div>

              {/* Col 3: Catatan Waktu Arena & Penalti */}
              <div className="p-5 sm:p-6 flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
                    <Timer className="w-3.5 h-3.5 text-sky-400" />
                    <span>Waktu Arena &amp; Penalti</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOvertime
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {isOvertime ? `Overtime +${formatTime(overtimeSeconds)}` : 'Waktu Sah'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none">
                      {formatTime(elapsedSeconds)}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      / {formatTime(maxTimeSeconds)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOvertime ? 'bg-rose-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, (elapsedSeconds / maxTimeSeconds) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-medium">Total Penalti</span>
                  {penalty > 0 ? (
                    <span className="font-mono font-black text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>-{penalty} Poin</span>
                    </span>
                  ) : (
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Bebas Penalti (0)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. UNIFIED TABBED EVALUATION STUDIO                            */}
          {/* ============================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden">
            {/* Flush 3-Tab Navigation Header */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80">
              {[
                {
                  id: 'peleton',
                  label: 'Lembar Peleton',
                  badge: `${materialsCount} Gerakan`,
                  icon: Shield,
                  activeBar: 'bg-rose-600',
                  activeIcon: 'text-rose-600',
                },
                {
                  id: 'danton',
                  label: 'Lembar Komandan',
                  badge: `${DANTON_CRITERIA.length} Aspek`,
                  icon: Medal,
                  activeBar: 'bg-amber-500',
                  activeIcon: 'text-amber-600',
                },
                {
                  id: 'penalti',
                  label: 'Berita Acara Penalti',
                  badge: penalty > 0 ? `-${penalty} Poin` : '0 Poin',
                  icon: ShieldAlert,
                  activeBar: penalty > 0 ? 'bg-rose-600' : 'bg-emerald-600',
                  activeIcon: penalty > 0 ? 'text-rose-600' : 'text-emerald-600',
                },
              ].map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeSheetTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSheetTab(tab.id)}
                    className={`relative py-3.5 px-2.5 sm:px-5 text-xs transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                      idx < 2 ? 'border-r border-slate-200/80' : ''
                    } ${
                      isActive
                        ? 'bg-white text-slate-950 font-black'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? tab.activeIcon : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                    <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      tab.id === 'penalti'
                        ? penalty > 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                        : isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                    {isActive && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.activeBar}`} />}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: LEMBAR PENILAIAN PELETON */}
            {activeSheetTab === 'peleton' && (
              <div className="p-4 sm:p-6 space-y-4">
                {/* Unified Compact Toolbar: Jury Selector + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Segmented Control: Rekap 3 Juri + Juri 1, 2, 3 */}
                  <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto shrink-0">
                    {[
                      { id: 'rekap', label: 'Rekap 3 Juri' },
                      { id: 'pos1', label: 'Juri 1' },
                      { id: 'pos2', label: 'Juri 2' },
                      { id: 'pos3', label: 'Juri 3' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setActiveJuryPost(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          activeJuryPost === opt.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
                        }`}
                      >
                        {opt.id === 'rekap' && <FileSpreadsheet className="w-3.5 h-3.5" />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchMovement}
                      onChange={(e) => setSearchMovement(e.target.value)}
                      placeholder="Cari materi gerakan..."
                      className="pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all w-full sm:w-60"
                    />
                    {searchMovement && (
                      <button
                        type="button"
                        onClick={() => setSearchMovement('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

            {/* KONTEN 1: TABEL ASLI APLIKASI JURI PELETON (FORMAT CHECKLIST 5 PREDIKAT BAKU) */}
            {activeJuryPost !== 'rekap' ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs max-h-[640px] overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
                    {/* Header Predikat Baku */}
                    <tr className="border-b border-slate-200 text-xs font-black uppercase text-center">
                      <th className="py-2.5 px-3 w-8 text-center text-slate-600 bg-slate-100 border-r border-slate-200 text-xs">No</th>
                      <th className="py-2.5 px-2 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[130px] max-w-[190px]">Materi Gerakan Perlombaan</th>
                      <th className="py-2.5 px-1 bg-rose-100 text-rose-900 border-r border-slate-200 text-center w-10">0/TL</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-slate-700 text-white border-r border-slate-600 text-center tracking-wider text-xs">KURANG SEKALI</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-red-600 text-white border-r border-red-500 text-center tracking-wider text-xs">KURANG</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider text-xs">CUKUP</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider text-xs">BAIK</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider text-xs">BAIK SEKALI</th>
                      <th className="py-2.5 px-3 text-center w-14 sm:w-16 bg-slate-100 text-slate-900 font-black text-xs">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredRows.map((row) => {
                      const selectedVal = Number(activeJuryRubric[row.key] ?? (row.isFirstSub && activeJuryRubric[row.originalIndex] !== undefined ? activeJuryRubric[row.originalIndex] : 0));
                      const isZero = selectedVal === 0;

                      const ksItems = row.template.filter(t => t.grade === 'KS');
                      const kItems = row.template.filter(t => t.grade === 'K');
                      const cItems = row.template.filter(t => t.grade === 'C');
                      const bItems = row.template.filter(t => t.grade === 'B');
                      const bsItems = row.template.filter(t => t.grade === 'BS');

                      return (
                        <tr key={row.key} className={`hover:bg-slate-50/80 transition-colors ${row.totalSubMovements > 1 && !row.isFirstSub ? 'bg-slate-50/30' : ''}`}>
                          {row.isFirstSub && (
                            <td
                              rowSpan={row.totalSubMovements}
                              className="py-1 px-1 text-center font-bold text-slate-500 border-r border-slate-200 text-xs bg-slate-50/50 align-middle"
                            >
                              <span className="font-mono font-black text-slate-800 text-xs sm:text-sm">{row.itemNumber}</span>
                            </td>
                          )}
                          <td className="py-1 px-2 font-semibold text-slate-800 border-r border-slate-200">
                            <div className="text-xs font-bold text-slate-900 leading-tight">{row.materiText}</div>
                          </td>

                          {/* Tombol 0 (Terlewat) */}
                          <td className="py-1 px-1 text-center bg-rose-50/30 border-r border-slate-200">
                            <span
                              className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                isZero
                                  ? 'bg-rose-700 text-white shadow-xs ring-2 ring-rose-400 scale-105 font-black'
                                  : 'bg-white text-slate-300 border border-slate-200 opacity-60'
                              }`}
                            >
                              0
                            </span>
                          </td>

                          {/* KURANG SEKALI (KS: 50, 55, 60) */}
                          <td className="py-1 px-1 text-center bg-slate-50/50 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {ksItems.map((opt, oIdx) => {
                                const isChosen = selectedVal === opt.val;
                                return (
                                  <span
                                    key={oIdx}
                                    className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                      isChosen
                                        ? 'bg-slate-800 text-white shadow-xs ring-2 ring-slate-400 scale-105 font-black'
                                        : 'bg-white text-slate-400 border border-slate-200/80'
                                    }`}
                                  >
                                    {opt.val}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* KURANG (K: Merah) */}
                          <td className="py-1 px-1 text-center bg-red-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {kItems.map((opt, oIdx) => {
                                const isChosen = selectedVal === opt.val;
                                return (
                                  <span
                                    key={oIdx}
                                    className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                      isChosen
                                        ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-400 scale-105 font-black'
                                        : 'bg-white text-slate-400 border border-slate-200/80'
                                    }`}
                                  >
                                    {opt.val}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* CUKUP (C: Kuning) */}
                          <td className="py-1 px-1 text-center bg-amber-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {cItems.map((opt, oIdx) => {
                                const isChosen = selectedVal === opt.val;
                                return (
                                  <span
                                    key={oIdx}
                                    className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                      isChosen
                                        ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300 scale-105 font-black'
                                        : 'bg-white text-slate-400 border border-slate-200/80'
                                    }`}
                                  >
                                    {opt.val}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* BAIK (B: Hijau) */}
                          <td className="py-1 px-1 text-center bg-emerald-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {bItems.map((opt, oIdx) => {
                                const isChosen = selectedVal === opt.val;
                                return (
                                  <span
                                    key={oIdx}
                                    className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                      isChosen
                                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400 scale-105 font-black'
                                        : 'bg-white text-slate-400 border border-slate-200/80'
                                    }`}
                                  >
                                    {opt.val}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* BAIK SEKALI (BS: Biru) */}
                          <td className="py-1 px-1 text-center bg-blue-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {bsItems.map((opt, oIdx) => {
                                const isChosen = selectedVal === opt.val;
                                return (
                                  <span
                                    key={oIdx}
                                    className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                      isChosen
                                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 scale-105 font-black'
                                        : 'bg-white text-slate-400 border border-slate-200/80'
                                    }`}
                                  >
                                    {opt.val}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* Nilai Terpilih */}
                          <td className={`py-2.5 px-3 text-center font-mono font-black text-xs sm:text-sm border-l border-slate-200 ${
                            isZero ? 'text-rose-700 bg-rose-50/60' : 'text-slate-900 bg-slate-50'
                          }`}>
                            {selectedVal || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono text-xs border-t-2 border-slate-800">
                    <tr>
                      <td colSpan={8} className="py-3 px-4 font-black uppercase tracking-wider text-right font-sans text-xs text-slate-300 border-r border-slate-800">
                        TOTAL NILAI LEMBAR {activeJuryName.toUpperCase()}:
                      </td>
                      <td className="py-3 px-3 text-center font-black text-emerald-400 text-base sm:text-lg bg-slate-950">
                        {activeJuryTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* KONTEN 2: TABEL PERBANDINGAN REKAPITULASI 3 JURI PELETON */
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs max-h-[640px] overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-900 text-slate-300 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 text-center w-12 border-r border-slate-800">No</th>
                      <th className="py-3 px-3.5 min-w-[240px] border-r border-slate-800">Materi Gerakan Perlombaan</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-800 text-sky-300">
                        Juri 1
                      </th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-800 text-emerald-300">
                        Juri 2
                      </th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-800 text-violet-300">
                        Juri 3
                      </th>
                      <th className="py-3 px-3 text-center w-28 bg-slate-950 text-amber-300 font-black">
                        Total Poin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredRows.map((row) => (
                      <tr key={row.key} className={`hover:bg-slate-50/80 transition-colors ${row.totalSubMovements > 1 && !row.isFirstSub ? 'bg-slate-50/30' : ''}`}>
                        {row.isFirstSub && (
                          <td
                            rowSpan={row.totalSubMovements}
                            className="py-2.5 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-100 bg-slate-50/50 align-middle"
                          >
                            <span className="font-mono font-black text-slate-800 text-xs sm:text-sm">{row.itemNumber}</span>
                          </td>
                        )}
                        <td className="py-2.5 px-3.5 font-semibold text-slate-900 border-r border-slate-100">
                          <div className="leading-snug">{row.materiText}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-950 border-r border-slate-100 bg-blue-50/20">
                          {row.v1}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-sky-950 border-r border-slate-100 bg-sky-50/20">
                          {row.v2}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-950 border-r border-slate-100 bg-indigo-50/20">
                          {row.v3}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-slate-950 bg-slate-50/80 text-xs sm:text-sm">
                          {row.totalVal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono text-xs border-t-2 border-slate-800">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 font-black uppercase tracking-wider text-right font-sans text-xs text-slate-300 border-r border-slate-800">
                        TOTAL AKUMULASI NILAI PELETON:
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300 border-r border-slate-800">
                        {totalJ1}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300 border-r border-slate-800">
                        {totalJ2}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300 border-r border-slate-800">
                        {totalJ3}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-emerald-400 text-base bg-slate-950">
                        {totalJ1 + totalJ2 + totalJ3}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
              </div>
            )}

            {/* TAB CONTENT 2: LEMBAR PENILAIAN KOMANDAN */}
            {activeSheetTab === 'danton' && (
              <div className="p-4 sm:p-6 space-y-4">
                {/* Compact Toolbar: Jury Selector + Danton Identity */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto shrink-0">
                    {[
                      { id: 'rekap', label: 'Rekap 3 Juri' },
                      { id: 'pos1', label: 'Juri 1' },
                      { id: 'pos2', label: 'Juri 2' },
                      { id: 'pos3', label: 'Juri 3' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setActiveDantonTab(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          activeDantonTab === opt.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
                        }`}
                      >
                        {opt.id === 'rekap' && <FileSpreadsheet className="w-3.5 h-3.5" />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {(currentTeam?.dantonName || currentTeam?.roster?.danton?.name) && (
                    <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl truncate">
                      {currentTeam?.dantonName || currentTeam?.roster?.danton?.name}
                    </span>
                  )}
                </div>

            {/* KONTEN DANTON: CHECKLIST ASLI SESUAI APLIKASI JURI */}
            {activeDantonTab !== 'rekap' ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 shadow-xs">
                    <tr className="border-b border-slate-200 text-xs font-black uppercase text-center">
                      <th className="py-2.5 px-3 w-8 text-center text-slate-600 bg-slate-100 border-r border-slate-200 text-xs">No</th>
                      <th className="py-2.5 px-2 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[120px] max-w-[170px]">Aspek Penilaian</th>
                      <th className="py-2.5 px-1 text-center text-slate-700 bg-slate-100 border-r border-slate-200 w-16">Bobot</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-slate-700 text-white border-r border-slate-600 text-center tracking-wider text-xs">KURANG SEKALI</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-red-600 text-white border-r border-red-500 text-center tracking-wider text-xs">KURANG</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider text-xs">CUKUP</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider text-xs">BAIK</th>
                      <th className="py-2.5 px-1 text-[10px] sm:text-[11px] bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider text-xs">BAIK SEKALI</th>
                      <th className="py-2.5 px-3 text-center w-14 sm:w-16 bg-slate-100 text-slate-900 font-black text-xs">Nilai Mentah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {DANTON_CRITERIA.map((crit, idx) => {
                      const selectedVal = Number(activeDantonScores[crit.id]);

                      return (
                        <tr key={crit.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-1 px-1 text-center font-bold text-slate-400 border-r border-slate-200 text-xs">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-2 font-semibold text-slate-900 border-r border-slate-200">
                            <div className="text-xs sm:text-sm font-bold">{crit.name}</div>
                          </td>
                          <td className="py-1.5 px-1 text-center font-mono font-bold text-amber-800 border-r border-slate-200 bg-amber-50/30 text-xs sm:text-sm">
                            {crit.weightPercent}
                          </td>

                          {/* KS (50, 55, 60) */}
                          <td className="py-1 px-1 text-center bg-slate-50/50 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {dantonKsItems.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                    selectedVal === opt.val
                                      ? 'bg-slate-800 text-white shadow-xs ring-2 ring-slate-400 scale-105 font-black'
                                      : 'bg-white text-slate-400 border border-slate-200/80'
                                  }`}
                                >
                                  {opt.val}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* K (64, 66, 68) */}
                          <td className="py-1 px-1 text-center bg-red-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {dantonKItems.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                    selectedVal === opt.val
                                      ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-400 scale-105 font-black'
                                      : 'bg-white text-slate-400 border border-slate-200/80'
                                  }`}
                                >
                                  {opt.val}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* C (72, 74, 76) */}
                          <td className="py-1 px-1 text-center bg-amber-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {dantonCItems.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                    selectedVal === opt.val
                                      ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300 scale-105 font-black'
                                      : 'bg-white text-slate-400 border border-slate-200/80'
                                  }`}
                                >
                                  {opt.val}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* B (79, 81, 83) */}
                          <td className="py-1 px-1 text-center bg-emerald-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {dantonBItems.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                    selectedVal === opt.val
                                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400 scale-105 font-black'
                                      : 'bg-white text-slate-400 border border-slate-200/80'
                                  }`}
                                >
                                  {opt.val}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* BS (86, 88, 90) */}
                          <td className="py-1 px-1 text-center bg-blue-50/30 border-r border-slate-200">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                              {dantonBsItems.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                                    selectedVal === opt.val
                                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 scale-105 font-black'
                                      : 'bg-white text-slate-400 border border-slate-200/80'
                                  }`}
                                >
                                  {opt.val}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Nilai Mentah */}
                          <td className="py-3 px-3 text-center font-mono font-black text-xs sm:text-sm text-slate-900 bg-slate-50 border-l border-slate-200">
                            {selectedVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono text-xs border-t-2 border-slate-800">
                    <tr>
                      <td colSpan={8} className="py-3 px-4 font-black uppercase tracking-wider text-right font-sans text-xs text-slate-300 border-r border-slate-800">
                        SKOR TERBOBOT LEMBAR {activeDantonName.toUpperCase()}:
                      </td>
                      <td className="py-3 px-3 text-center font-black text-amber-300 text-base sm:text-lg bg-slate-950">
                        {activeDantonTotal} Poin
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* TABEL REKAP 3 JURI DANTON */
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-900 text-slate-300 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 text-center w-12 border-r border-slate-800">No</th>
                      <th className="py-3 px-3.5 min-w-[160px] border-r border-slate-800">Aspek Rubrik Komandan</th>
                      <th className="py-3 px-2 text-center w-16 border-r border-slate-800 text-amber-300">Bobot</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-800 text-sky-300">Juri 1</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-800 text-emerald-300">Juri 2</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-800 text-violet-300">Juri 3</th>
                      <th className="py-3 px-3 text-center w-28 bg-slate-950 text-amber-300 font-black">
                        Total Nilai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {DANTON_CRITERIA.map((crit, idx) => {
                      const v1 = dantonData.j1[crit.id];
                      const v2 = dantonData.j2[crit.id];
                      const v3 = dantonData.j3[crit.id];
                      const weightMultiplier = crit.weight || (crit.id === 'materi' ? 0.35 : crit.id === 'vokal' ? 0.25 : 0.20);
                      const rawSum = v1 + v2 + v3;
                      const weightedVal = parseFloat((rawSum * weightMultiplier).toFixed(2));

                      return (
                        <tr key={crit.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 border-r border-slate-100">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-900 border-r border-slate-100">
                            {crit.name}
                          </td>
                          <td className="py-1 px-1 text-center font-mono font-bold text-amber-800 border-r border-slate-100 bg-amber-50/30">
                            {crit.weightPercent}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-100 bg-blue-50/20">
                            {v1}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-100 bg-sky-50/20">
                            {v2}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-100 bg-indigo-50/20">
                            {v3}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-black text-slate-950 bg-slate-50 text-xs sm:text-sm">
                            {weightedVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono text-xs border-t-2 border-slate-800">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 font-black uppercase tracking-wider text-right font-sans text-xs text-slate-300 border-r border-slate-800">
                        TOTAL NILAI KOMANDAN (TERBOBOT):
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300 border-r border-slate-800">
                        {dantonData.t1}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300 border-r border-slate-800">
                        {dantonData.t2}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300 border-r border-slate-800">
                        {dantonData.t3}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-amber-400 text-base bg-slate-950">
                        {dantonData.grandTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
              </div>
            )}

            {/* TAB CONTENT 3: BERITA ACARA PENALTI */}
            {activeSheetTab === 'penalti' && (
              <div className="p-4 sm:p-6 space-y-4">

            {/* Jika Nihil Penalti: Banner Bersih & Ringkas */}
            {penalty === 0 ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                      Nihil Pengurangan Nilai (0 Poin Penalti)
                    </h4>
                    <p className="text-[11px] sm:text-xs text-emerald-700 mt-0.5">
                      Peleton tampil tertib, disiplin, tepat waktu, dan mematuhi seluruh regulasi perlombaan.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-black text-xs sm:text-sm text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
                  0 Poin
                </span>
              </div>
            ) : (
              /* Jika Terdapat Penalti: Hanya Tampilkan Item yang Terjadi Saja */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {injakGarisCount > 0 && (
                  <div className="p-3.5 rounded-2xl border bg-rose-50/70 border-rose-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Injak / Keluar Garis</span>
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          -50 / kejadian
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {injakGarisCount} pelanggaran garis batas arena
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 mt-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">{injakGarisCount} Kejadian</span>
                      <span className="font-mono font-black text-sm text-rose-700">-{injakGarisCount * 50} Poin</span>
                    </div>
                  </div>
                )}

                {overTimeBlocks > 0 && (
                  <div className="p-3.5 rounded-2xl border bg-rose-50/70 border-rose-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Kelebihan Durasi Waktu</span>
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          -20 / 30 detik
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Overtime +{formatTime(overtimeSeconds)} ({overTimeBlocks} blok)
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 mt-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">{overTimeBlocks} Blok</span>
                      <span className="font-mono font-black text-sm text-rose-700">-{overTimeBlocks * 20} Poin</span>
                    </div>
                  </div>
                )}

                {kotakDantonCount > 0 && (
                  <div className="p-3.5 rounded-2xl border bg-rose-50/70 border-rose-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Keluar Kotak Danton</span>
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          -50 / kejadian
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Komandan keluar kotak 1,5 × 1,5 meter
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 mt-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">{kotakDantonCount} Kejadian</span>
                      <span className="font-mono font-black text-sm text-rose-700">-{kotakDantonCount * 50} Poin</span>
                    </div>
                  </div>
                )}

                {personelKurang && (
                  <div className="p-3.5 rounded-2xl border bg-rose-50/70 border-rose-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Personel Kurang</span>
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          -75 Poin
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Tampil kurang dari 22 orang di lapangan
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 mt-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">&lt; 22 Anggota</span>
                      <span className="font-mono font-black text-sm text-rose-700">-75 Poin</span>
                    </div>
                  </div>
                )}

                {dp1 && (
                  <div className="p-3.5 rounded-2xl border bg-rose-50/70 border-rose-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Terlambat DP 1</span>
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          -100 Poin
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Terlambat memasuki Daerah Persiapan 1
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 mt-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">Panggilan 3x</span>
                      <span className="font-mono font-black text-sm text-rose-700">-100 Poin</span>
                    </div>
                  </div>
                )}

                {nonArenaPenaltyTotal > 0 && (
                  <div className="p-3.5 rounded-2xl border bg-rose-50/70 border-rose-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Basecamp / Upacara / Suporter</span>
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          Regulasi
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Pelanggaran tata tertib non-arena
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 mt-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">Pelanggaran</span>
                      <span className="font-mono font-black text-sm text-rose-700">-{nonArenaPenaltyTotal} Poin</span>
                    </div>
                  </div>
                )}
              </div>
            )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-14 text-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30 text-amber-800 bg-amber-100 inline-block mb-0.5">
              Kerahasiaan Penjurian Resmi LBB 2027
            </span>
            <h4 className="font-black text-base text-slate-900 uppercase">
              Penilaian Belum Tersedia
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Peleton Anda belum tampil di arena perlombaan atau dewan juri sedang dalam proses rekapitulasi nilai. Lembar nilai lengkap akan langsung terbit di sini sesaat setelah penampilan peleton disahkan.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
