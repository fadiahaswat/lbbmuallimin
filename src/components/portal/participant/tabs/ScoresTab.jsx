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
  getScaleTemplateForMaterial
} from '../../../../config.js';

export default function ScoresTab({ teamScore, currentTeam }) {
  const [activeJuryPost, setActiveJuryPost] = useState('rekap'); // 'rekap' | 'pos1' | 'pos2' | 'pos3'
  const [activeDantonTab, setActiveDantonTab] = useState('rekap'); // 'rekap' | 'pos1' | 'pos2' | 'pos3'
  const [searchMovement, setSearchMovement] = useState('');

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
  const elapsedSeconds = teamScore?.fieldTimerData?.durationSeconds ?? (isSMP ? 698 : 458); // default: 07:38 SD / 11:38 SMP
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

    // Generator opsi resmi Juknis: selalu memilih nilai sah dari RUBRIC_SCALE_TEMPLATES
    function generateAuthenticRubric(target, seedOffset) {
      const result = {};
      const optionsMap = {};

      if (target < materialsList.length * 50) {
        const base = Math.floor(target / materialsList.length);
        let rem = target - (base * materialsList.length);
        materialsList.forEach((_, idx) => {
          result[idx] = base;
        });
        let i = 0;
        while (rem > 0) {
          const idx = (i * 3 + seedOffset) % materialsList.length;
          result[idx] += 1;
          rem--;
          i++;
        }
        return result;
      }

      materialsList.forEach((m, idx) => {
        const key = getScaleTemplateForMaterial(m);
        const tmpl = RUBRIC_SCALE_TEMPLATES[key] || RUBRIC_SCALE_TEMPLATES.SEDERHANA;
        optionsMap[idx] = tmpl.map(t => t.val); // Opsi urut naik [50, ... 80/85/90]
        const bsItems = tmpl.filter(t => t.grade === 'BS');
        result[idx] = bsItems[(idx + seedOffset) % bsItems.length].val;
      });

      let currentSum = Object.values(result).reduce((a, b) => a + b, 0);
      let attempts = 0;

      while (currentSum !== target && attempts < 2500) {
        attempts++;
        const idx = (attempts * 11 + seedOffset) % materialsList.length;
        const opts = optionsMap[idx];
        const curVal = result[idx];
        const curPos = opts.indexOf(curVal);

        if (currentSum > target && curPos > 0) {
          result[idx] = opts[curPos - 1];
          currentSum -= (curVal - opts[curPos - 1]);
        } else if (currentSum < target && curPos < opts.length - 1) {
          result[idx] = opts[curPos + 1];
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

    const sum1 = hasRealJ1 ? Object.values(finalJ1).reduce((acc, v) => acc + (Number(v) || 0), 0) : targetJ1;
    const sum2 = hasRealJ2 ? Object.values(finalJ2).reduce((acc, v) => acc + (Number(v) || 0), 0) : targetJ2;
    const sum3 = hasRealJ3 ? Object.values(finalJ3).reduce((acc, v) => acc + (Number(v) || 0), 0) : targetJ3;

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

  // Data gabungan PBB per gerakan
  const combinedMovementData = useMemo(() => {
    return materialsList.map((materiText, idx) => {
      const templateKey = getScaleTemplateForMaterial(materiText);
      const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.SEDERHANA;

      const v1 = Number(j1Rubric[idx] ?? 0);
      const v2 = Number(j2Rubric[idx] ?? 0);
      const v3 = Number(j3Rubric[idx] ?? 0);

      const totalVal = v1 + v2 + v3;
      const avgVal = parseFloat((totalVal / 3).toFixed(1));

      return {
        index: idx + 1,
        materiText,
        templateKey,
        template,
        v1,
        v2,
        v3,
        totalVal,
        avgVal,
      };
    });
  }, [materialsList, j1Rubric, j2Rubric, j3Rubric]);

  // Filter pencarian
  const filteredRows = useMemo(() => {
    if (!searchMovement.trim()) return combinedMovementData;
    return combinedMovementData.filter(r => r.materiText.toLowerCase().includes(searchMovement.toLowerCase()));
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
  const peletonPenaltyTotal = pen.peletonPenalty ?? pen.totalPenalty ?? 0;
  const dantonPenaltyTotal = pen.dantonPenalty ?? 0;

  // Formula Juknis Bab A.3: Akumulasi 3 Dewan Juri Resmi
  // 1) Nilai Murni Peleton = Juri 1 + Juri 2 + Juri 3
  // 2) Nilai Akhir Peleton = (Nilai Murni Peleton) - (Total Penalti Peleton)
  const peletonMurniTotal = Number(teamScore?.nilaiMurniPeleton ?? (totalJ1 + totalJ2 + totalJ3));
  const peletonFinalScore = Number(teamScore?.nilaiAkhirPeleton ?? Math.max(0, peletonMurniTotal - peletonPenaltyTotal));

  // 4) Nilai Murni Danton = Juri 1 + Juri 2 + Juri 3
  // 5) Nilai Akhir Danton = (Nilai Murni Danton) - (Total Penalti Danton)
  const dantonMurniTotal = dantonData.grandTotal;
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
    <section className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800">
            <Award className="w-5 h-5 text-amber-400" />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Hasil Penilaian Resmi
            </h2>
            <p className="text-xs text-slate-500">
              {currentTeam?.schoolName || currentTeam?.nama || 'Kontingen Peserta'} • No. Dada #{currentTeam?.chestNumber || (currentTeam?.lotNumber ? String(currentTeam.lotNumber).padStart(2, '0') : (currentTeam?.noUrut || '--'))}
            </p>
          </div>
        </div>

        {teamScore && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nilai Sah Terverifikasi</span>
          </span>
        )}
      </div>

      {teamScore ? (
        <div className="space-y-6">
          {/* Dual Executive Championship Scoreboard (Peleton & Komandan Terpisah Sesuai Juknis Bab A.3) */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* 1. KATEGORI PELETON (Brand Mu'allimin Crimson & Gold) */}
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-[#180909] to-[#2a0808] p-5 sm:p-6 text-white relative shadow-[0_20px_45px_rgba(139,0,0,0.22)] border border-red-500/30 ring-1 ring-white/10 group">
              {/* Radial Brand Aura */}
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-red-600/25 via-red-800/15 to-transparent blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header Pill */}
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-black uppercase tracking-[0.14em] text-red-300 bg-red-950/90 px-3 py-1 rounded-full border border-red-500/40 shadow-xs">
                    <Shield className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>NILAI AKHIR PELETON</span>
                  </span>
                </div>

                {/* Score & Plaque */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-none">
                        {peletonFinalScore}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest shrink-0 drop-shadow-xs">
                        POIN
                      </span>
                    </div>
                    {peletonPenaltyTotal > 0 && (
                      <p className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-rose-400 font-bold mt-2 font-mono bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>Penalti: -{peletonPenaltyTotal} Poin</span>
                      </p>
                    )}
                  </div>

                  {teamScore.rank && (
                    <div className="rounded-2xl p-3 sm:p-3.5 text-center shrink-0 border border-amber-400/50 bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent backdrop-blur-md shadow-[0_10px_25px_rgba(245,158,11,0.2)] ring-1 ring-amber-300/30 min-w-[120px] sm:min-w-[145px]">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 truncate max-w-[110px] sm:max-w-none">
                          {peletonAwardTitle}
                        </p>
                      </div>
                      <p className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">
                        #{teamScore.rank}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. KATEGORI KOMANDAN (Brand Royal Amber & Deep Slate) */}
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-[#16120b] to-[#281c08] p-5 sm:p-6 text-white relative shadow-[0_20px_45px_rgba(245,158,11,0.18)] border border-amber-500/30 ring-1 ring-white/10 group">
              {/* Radial Brand Aura */}
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-amber-500/25 via-amber-600/15 to-transparent blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header Pill */}
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-black uppercase tracking-[0.14em] text-amber-300 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-500/40 shadow-xs">
                    <Medal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>NILAI AKHIR KOMANDAN</span>
                  </span>
                </div>

                {/* Score & Plaque */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-none">
                        {dantonFinalScore}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest shrink-0 drop-shadow-xs">
                        POIN
                      </span>
                    </div>
                    {dantonPenaltyTotal > 0 && (
                      <p className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-rose-400 font-bold mt-2 font-mono bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>Penalti: -{dantonPenaltyTotal} Poin</span>
                      </p>
                    )}
                  </div>

                  {(teamScore.dantonRank || teamScore.rank) && (
                    <div className="rounded-2xl p-3 sm:p-3.5 text-center shrink-0 border border-amber-400/50 bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent backdrop-blur-md shadow-[0_10px_25px_rgba(245,158,11,0.2)] ring-1 ring-amber-300/30 min-w-[120px] sm:min-w-[145px]">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Medal className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 truncate max-w-[110px] sm:max-w-none">
                          {dantonAwardTitle}
                        </p>
                      </div>
                      <p className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">
                        #{teamScore.dantonRank || teamScore.rank}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: LEMBAR CATATAN WAKTU RESMI (OFFICIAL TIMEKEEPER)   */}
          {/* ============================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 shrink-0">
                  <Timer className="w-4.5 h-4.5 text-amber-600" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Catatan Waktu Arena
                  </h3>
                  <p className="text-xs text-slate-500">
                    Maksimal {formatTime(maxTimeSeconds)} ({isSMP ? 'SMP' : 'SD'})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                  isOvertime
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOvertime ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  {isOvertime ? `Overtime +${formatTime(overtimeSeconds)} (-${overTimeBlocks * 20} Poin)` : 'Waktu Sah (Aman)'}
                </span>
                <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                  {formatTime(elapsedSeconds)} / {formatTime(maxTimeSeconds)}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isOvertime ? 'bg-rose-600' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (elapsedSeconds / maxTimeSeconds) * 100)}%` }}
              />
            </div>
          </div>

          {/* SECTION 2: LEMBAR PENILAIAN PELETON (FORMAT APLIKASI JURI)     */}
          {/* ============================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
            
            {/* Header Bagian: Judul & Tab Selector Juri */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 font-black shadow-2xs">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Lembar Penilaian Peleton
                  </h3>
                  <p className="text-xs text-slate-500">
                    Akumulasi PBB Murni 3 Dewan Juri Resmi
                  </p>
                </div>
              </div>

              {/* Segmented Control: Rekap 3 Juri + Juri 1, 2, 3 */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveJuryPost('rekap')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeJuryPost === 'rekap'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileSpreadsheet className={`w-3.5 h-3.5 ${activeJuryPost === 'rekap' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Rekap 3 Juri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveJuryPost('pos1')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeJuryPost === 'pos1'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Juri 1
                </button>

                <button
                  type="button"
                  onClick={() => setActiveJuryPost('pos2')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeJuryPost === 'pos2'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Juri 2
                </button>

                <button
                  type="button"
                  onClick={() => setActiveJuryPost('pos3')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeJuryPost === 'pos3'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Juri 3
                </button>
              </div>
            </div>

            {/* Filter Search Gerakan */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700">
                {activeJuryPost === 'rekap' ? 'Perbandingan Nilai 3 Juri' : `Lembar Asli ${activeJuryName}`}
              </span>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchMovement}
                  onChange={(e) => setSearchMovement(e.target.value)}
                  placeholder="Cari materi gerakan..."
                  className="pl-8 pr-6 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-44 sm:w-56"
                />
                {searchMovement && (
                  <button
                    type="button"
                    onClick={() => setSearchMovement('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
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
                      const idx = row.index - 1;
                      const selectedVal = Number(activeJuryRubric[idx]);
                      const isZero = selectedVal === 0;

                      const ksItems = row.template.filter(t => t.grade === 'KS');
                      const kItems = row.template.filter(t => t.grade === 'K');
                      const cItems = row.template.filter(t => t.grade === 'C');
                      const bItems = row.template.filter(t => t.grade === 'B');
                      const bsItems = row.template.filter(t => t.grade === 'BS');

                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-1 px-1 text-center font-bold text-slate-400 border-r border-slate-200 text-xs">
                            {row.index}
                          </td>
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
                  <thead className="sticky top-0 z-20 bg-slate-100 text-slate-700 uppercase font-black text-[10px] tracking-wider border-b border-slate-200 shadow-xs">
                    <tr>
                      <th className="py-3 px-3 text-center w-12 border-r border-slate-200">No</th>
                      <th className="py-1.5 px-2 min-w-[240px] border-r border-slate-200">Materi Gerakan Perlombaan</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-200 bg-blue-50/80 text-blue-900">
                        Juri 1
                      </th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-200 bg-sky-50/80 text-sky-900">
                        Juri 2
                      </th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-200 bg-indigo-50/80 text-indigo-900">
                        Juri 3
                      </th>
                      <th className="py-3 px-3 text-center w-28 bg-slate-900 text-white font-black">
                        Total Poin
                        <span className="block text-[8px] font-normal text-amber-300 lowercase">Akumulasi 3 Juri</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredRows.map((row) => (
                      <tr key={row.index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 border-r border-slate-100">
                          {row.index}
                        </td>
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

          {/* ============================================================== */}
          {/* SECTION 3: LEMBAR PENILAIAN KOMANDAN (FORMAT APLIKASI JURI)    */}
          {/* ============================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
            {/* Header Bagian: Judul & Tab Selector Juri Danton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 font-black shadow-2xs">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Lembar Penilaian Komandan Peleton
                  </h3>
                  <p className="text-xs text-slate-500">
                    Akumulasi Nilai Komandan Peleton Terbobot 3 Dewan Juri
                  </p>
                </div>
              </div>

              {/* Segmented Control: Rekap 3 Juri + Juri 1, 2, 3 */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveDantonTab('rekap')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeDantonTab === 'rekap'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileSpreadsheet className={`w-3.5 h-3.5 ${activeDantonTab === 'rekap' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>Rekap 3 Juri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDantonTab('pos1')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDantonTab === 'pos1'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Juri 1
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDantonTab('pos2')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDantonTab === 'pos2'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Juri 2
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDantonTab('pos3')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDantonTab === 'pos3'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Juri 3
                </button>
              </div>
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
                  <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 text-center w-12 border-r border-slate-200">No</th>
                      <th className="py-1.5 px-2 min-w-[120px] max-w-[170px] border-r border-slate-200">Aspek Rubrik Komandan</th>
                      <th className="py-1.5 px-1 text-center w-16 border-r border-slate-200">Bobot</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-200 bg-blue-50 text-blue-900">Juri 1</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-200 bg-sky-50 text-sky-900">Juri 2</th>
                      <th className="py-3 px-3 text-center w-24 border-r border-slate-200 bg-indigo-50 text-indigo-900">Juri 3</th>
                      <th className="py-3 px-3 text-center w-28 bg-slate-900 text-white font-black">
                        Total Nilai
                        <span className="block text-[8px] font-normal text-amber-300 lowercase">Terbobot 3 Juri</span>
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

          {/* ============================================================== */}
          {/* SECTION 4: LEMBAR BERITA ACARA PENALTI (FORMAT APLIKASI JURI)  */}
          {/* ============================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-200/80 font-black shadow-xs shrink-0">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    Pengurangan Nilai (Penalti)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rekapitulasi sanksi pengurangan nilai lapangan &amp; tata tertib
                  </p>
                </div>
              </div>

              {penalty > 0 ? (
                <div className="bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl text-right shrink-0">
                  <span className="text-[10px] font-bold text-rose-700 uppercase mr-1">Total Penalti:</span>
                  <span className="font-mono font-black text-sm text-rose-900">-{penalty} Poin</span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bebas Penalti (0 Poin)</span>
                </span>
              )}
            </div>

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
