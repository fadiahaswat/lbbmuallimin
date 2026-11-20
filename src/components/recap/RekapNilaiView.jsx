import React, { useState, useMemo } from 'react';
import { appPrompt, appToast } from '../../utils/appDialog.js';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Search,
  Eye,
  Lock,
  Unlock,
  X,
  Sparkles,
  ArrowRight,
  Users,
  FileEdit,
  ShieldCheck,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { getChestNumberByLot } from '../../context/competitionHelpers.js';
import { formatImageUrl, getFallbackImageUrl } from '../../services/sheetService.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import OfficialScoreRecapModal from '../scoring/OfficialScoreRecapModal.jsx';

function getSchoolInitials(name = '') {
  const clean = String(name)
    .replace(/\b(sd|mi|smp|mts|sma|smk|negeri|swasta|dan|kabupaten|kota)\b/gi, '')
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return String(name || 'SK').slice(0, 2).toUpperCase();
}

function BareSchoolLogo({ team, size = 'sm' }) {
  const [imgState, setImgState] = useState('primary');

  const rawLogo =
    team?.files?.schoolLogo?.url ||
    team?.file_logo_sekolah ||
    team?.logoUrl ||
    team?.schoolLogoUrl ||
    team?.schoolLogo?.url ||
    (typeof team?.schoolLogo === 'string' ? team.schoolLogo : null) ||
    team?.logo;

  const isSD = team?.jenjang === 'SD';
  const validRaw = rawLogo && typeof rawLogo === 'string' && rawLogo !== '#' && !rawLogo.startsWith('#');
  const src = !validRaw || imgState === 'error'
    ? null
    : imgState === 'primary'
    ? formatImageUrl(rawLogo)
    : getFallbackImageUrl(rawLogo);

  const dimClass = size === 'md' ? 'w-9 h-9' : 'w-8 h-8';

  if (src) {
    return (
      <img
        src={src}
        alt={team?.schoolName || 'Logo Sekolah'}
        className={`${dimClass} object-contain shrink-0`}
        loading="lazy"
        onError={() => {
          if (imgState === 'primary') {
            const fb = getFallbackImageUrl(rawLogo);
            if (fb && fb !== formatImageUrl(rawLogo)) {
              setImgState('fallback');
              return;
            }
          }
          setImgState('error');
        }}
      />
    );
  }

  return (
    <span className={`${dimClass} rounded-lg flex items-center justify-center font-mono font-black text-[11px] shrink-0 ${
      isSD ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
    }`}>
      {getSchoolInitials(team?.schoolName)}
    </span>
  );
}

export default function RekapNilaiView() {
  const {
    teams,
    scores,
    verifyScore,
    finalizeScore,
    unlockScore,
    currentUser,
    role,
    settings,
    updateSettings,
    setActiveView,
    openAuthModal,
    isLocalhost
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';

  // Jika akun Peserta masuk ke view rekap_nilai, arahkan otomatis ke Dasbor Peserta tab Rekap Nilai resmi
  React.useEffect(() => {
    if (userRole === 'peserta') {
      try {
        localStorage.setItem('lbb_participant_active_tab', 'scores');
      } catch {}
      setActiveView('peserta_dashboard');
    }
  }, [userRole, setActiveView]);

  const isVerifikator = userRole === 'verifikator' || userRole === 'superadmin';
  const isFinalisator = userRole === 'finalisator' || userRole === 'superadmin';

  const [selectedJenjang, setSelectedJenjang] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNSCORED' | 'DRAFT' | 'VERIFIED' | 'FINAL'
  const [sortMode, setSortMode] = useState('peleton'); // 'peleton' | 'danton' | 'chest'
  const [searchQuery, setSearchQuery] = useState('');
  const [detailTeamId, setDetailTeamId] = useState(null);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  const hasAccess = ['superadmin', 'admin', 'finalisator', 'verifikator', 'penginput', 'juri'].includes(userRole);

  // Eligible teams
  const competitionTeams = useMemo(() => {
    return teams.filter(t =>
      isLocalhost ? t.status !== 'rejected' : (['verified', 'drawn'].includes(t.status) || t.lotNumber)
    );
  }, [teams, isLocalhost]);

  // Helper nilai resmi sesuai Juknis Bab A.3.c & Bab A.5
  const getScoreMetrics = (teamId) => {
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
        totalPenalty: 0,
        j1Peleton: 0,
        j2Peleton: 0,
        j3Peleton: 0,
        j1Danton: 0,
        j2Danton: 0,
        j3Danton: 0,
        durationLabel: null,
      };
    }

    const juries = sc.juries || {};
    const j1Peleton = Number(juries.pos1?.peletonTotal ?? juries.pos1?.total ?? sc.pbb?.j1 ?? 0);
    const j2Peleton = Number(juries.pos2?.peletonTotal ?? juries.pos2?.total ?? sc.pbb?.j2 ?? 0);
    const j3Peleton = Number(juries.pos3?.peletonTotal ?? sc.pbb?.j3 ?? 0);

    const j1Danton = Number(juries.pos1?.dantonTotal ?? 0);
    const j2Danton = Number(juries.pos2?.dantonTotal ?? 0);
    const j3Danton = Number(juries.pos3?.dantonTotal ?? 0);

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

    const nilaiMurniPeleton = Number(sc.nilaiMurniPeleton ?? sc.pbbTotal ?? sc.pbb?.total ?? (j1Peleton + j2Peleton + j3Peleton));
    const peletonPenalty = Number(sc.penalties?.peletonPenalty ?? sc.penaltiesTotal ?? sc.penalties?.totalPenalty ?? 0);
    const nilaiAkhirPeleton = Number(sc.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2))));

    const nilaiMurniDanton = Number(sc.nilaiMurniDanton ?? sc.dantonTotal ?? sc.danton?.total ?? parseFloat((j1Danton + j2Danton + j3Danton).toFixed(2)));
    const dantonPenalty = Number(sc.penalties?.dantonPenalty ?? 0);
    const nilaiAkhirDanton = Number(sc.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2))));

    const totalPenalty = Number(sc.penalties?.totalPenalty ?? (peletonPenalty + dantonPenalty));
    const durationLabel = sc.performanceDuration || (Number.isFinite(sc.durationSeconds) && sc.durationSeconds > 0
      ? `${String(Math.floor(sc.durationSeconds / 60)).padStart(2, '0')}:${String(sc.durationSeconds % 60).padStart(2, '0')}`
      : null);

    return {
      hasScore: true,
      nilaiMurniPeleton,
      peletonPenalty,
      nilaiAkhirPeleton,
      nilaiMurniDanton,
      dantonPenalty,
      nilaiAkhirDanton,
      totalPenalty,
      j1Peleton,
      j2Peleton,
      j3Peleton,
      j1Danton,
      j2Danton,
      j3Danton,
      dantonMateri,
      dantonVokal,
      durationLabel,
    };
  };

  const getTeamStage = (teamId) => {
    const sc = scores[teamId];
    if (!sc) return 'UNSCORED';
    if (sc.isLocked || sc.status === 'finalized') return 'FINAL';
    if (sc.isVerified || sc.status === 'verified') return 'VERIFIED';
    return 'DRAFT';
  };

  const getChestNum = (team) => {
    const raw = team?.chestNumber || getChestNumberByLot(team?.jenjang, team?.lotNumber);
    return raw ? String(raw) : '';
  };

  const comparePeletonJuknis = (a, b) => {
    const mA = getScoreMetrics(a.id);
    const mB = getScoreMetrics(b.id);
    if (mB.hasScore !== mA.hasScore) return mB.hasScore ? 1 : -1;
    if (mA.hasScore && mB.hasScore) {
      if (mB.nilaiAkhirPeleton !== mA.nilaiAkhirPeleton) return mB.nilaiAkhirPeleton - mA.nilaiAkhirPeleton;
      if (mB.nilaiMurniPeleton !== mA.nilaiMurniPeleton) return mB.nilaiMurniPeleton - mA.nilaiMurniPeleton;
      if (mA.peletonPenalty !== mB.peletonPenalty) return mA.peletonPenalty - mB.peletonPenalty;
      if (mB.nilaiMurniDanton !== mA.nilaiMurniDanton) return mB.nilaiMurniDanton - mA.nilaiMurniDanton;
    }
    const chestA = parseInt(getChestNum(a) || '9999', 10);
    const chestB = parseInt(getChestNum(b) || '9999', 10);
    if (chestA !== chestB) return chestA - chestB;
    return (a.schoolName || '').localeCompare(b.schoolName || '');
  };

  const compareDantonJuknis = (a, b) => {
    const mA = getScoreMetrics(a.id);
    const mB = getScoreMetrics(b.id);
    if (mB.hasScore !== mA.hasScore) return mB.hasScore ? 1 : -1;
    if (mA.hasScore && mB.hasScore) {
      if (mB.nilaiAkhirDanton !== mA.nilaiAkhirDanton) return mB.nilaiAkhirDanton - mA.nilaiAkhirDanton;
      if (mB.nilaiMurniDanton !== mA.nilaiMurniDanton) return mB.nilaiMurniDanton - mA.nilaiMurniDanton;
      if (mB.dantonMateri !== mA.dantonMateri) return mB.dantonMateri - mA.dantonMateri;
      if (mB.dantonVokal !== mA.dantonVokal) return mB.dantonVokal - mA.dantonVokal;
    }
    const chestA = parseInt(getChestNum(a) || '9999', 10);
    const chestB = parseInt(getChestNum(b) || '9999', 10);
    return chestA - chestB;
  };

  // Peringkat resmi per jenjang (berdasar mode Peleton atau Danton, hanya tim yang sudah dinilai)
  const jenjangRankMap = useMemo(() => {
    const map = {};
    const comparator = sortMode === 'danton' ? compareDantonJuknis : comparePeletonJuknis;
    ['SD', 'SMP'].forEach(jKey => {
      const jTeams = competitionTeams.filter(t => t.jenjang === jKey && scores[t.id]).sort(comparator);
      jTeams.forEach((t, i) => {
        map[t.id] = i + 1;
      });
    });
    return map;
  }, [competitionTeams, scores, sortMode]);

  const divisionTeams = useMemo(() => {
    return competitionTeams.filter(t => selectedJenjang === 'ALL' || t.jenjang === selectedJenjang);
  }, [competitionTeams, selectedJenjang]);

  const totalTeamsCount = divisionTeams.length;
  const sdTotalCount = competitionTeams.filter(t => t.jenjang === 'SD').length;
  const smpTotalCount = competitionTeams.filter(t => t.jenjang === 'SMP').length;
  const draftOnlyCount = divisionTeams.filter(t => getTeamStage(t.id) === 'DRAFT').length;
  const verifiedOnlyCount = divisionTeams.filter(t => getTeamStage(t.id) === 'VERIFIED').length;
  const finalizedCount = divisionTeams.filter(t => getTeamStage(t.id) === 'FINAL').length;
  const unscoredCount = divisionTeams.filter(t => getTeamStage(t.id) === 'UNSCORED').length;

  const rankedTeams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return divisionTeams
      .filter(team => {
        if (statusFilter !== 'ALL' && getTeamStage(team.id) !== statusFilter) return false;
        if (!q) return true;
        const chestStr = getChestNum(team).toLowerCase();
        const danton = (team.roster?.danton?.name || team.dantonName || '').toLowerCase();
        return (
          team.schoolName?.toLowerCase().includes(q) ||
          danton.includes(q) ||
          chestStr.includes(q)
        );
      })
      .sort((a, b) => {
        if (selectedJenjang === 'ALL' && a.jenjang !== b.jenjang) {
          return a.jenjang === 'SD' ? -1 : 1;
        }
        if (sortMode === 'chest') {
          const cA = parseInt(getChestNum(a) || '9999', 10);
          const cB = parseInt(getChestNum(b) || '9999', 10);
          if (cA !== cB) return cA - cB;
          return (a.schoolName || '').localeCompare(b.schoolName || '');
        }
        if (sortMode === 'danton') return compareDantonJuknis(a, b);
        return comparePeletonJuknis(a, b);
      });
  }, [divisionTeams, statusFilter, searchQuery, selectedJenjang, sortMode, scores]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Akses Ditolak
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              Rekapitulasi Nilai Terkunci
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini bersifat rahasia dan hanya dapat diakses oleh Panitia Terotorisasi: Penginput, Verifikator, Finalisator Dewan Juri, atau Superadmin.
            </p>
          </div>
          <div className="space-y-2.5 pt-2 w-full">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('lbb_muallimin_active_view_v1', 'landing');
                } catch {}
                setActiveView('landing');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Kembali ke Beranda
            </button>
            <button
              type="button"
              onClick={() => openAuthModal?.()}
              className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-red-950/40"
            >
              Masuk Akun Panitia
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = (teamId) => {
    if (!isVerifikator) return;
    verifyScore(teamId, true, `Diverifikasi oleh ${currentUser?.name || 'Verifikator'}`);
    appToast('Nilai peleton berhasil diverifikasi & disetujui!', { variant: 'success' });
  };

  const handleRejectScore = async (teamId) => {
    if (!isVerifikator) return;
    const reason = await appPrompt(
      'Masukkan catatan koreksi untuk Operator Penginput:',
      'Terdapat selisih angka input juri',
      { title: 'Kembalikan ke Draft', confirmText: 'Kembalikan', variant: 'warning' }
    );
    if (reason === null) return;
    verifyScore(teamId, false, reason || 'Dikembalikan ke draft oleh Verifikator');
    appToast('Nilai dikembalikan ke status Draft untuk diperbaiki.', { variant: 'warning' });
  };

  const handleFinalize = (teamId) => {
    if (!isFinalisator) return;
    finalizeScore(teamId, currentUser?.name || 'Finalisator');
    appToast('Nilai peleton berhasil dikunci permanen (Final)!', { variant: 'success' });
  };

  const handleUnlock = (teamId) => {
    if (userRole !== 'superadmin') return;
    unlockScore(teamId);
    appToast('Kunci nilai dibuka kembali oleh Superadmin.', { variant: 'info' });
  };

  const handleTogglePublishLeaderboard = () => {
    if (!isFinalisator) return;
    const current = settings?.announcementPublished;
    updateSettings({ announcementPublished: !current });
    appToast(
      current ? 'Klasemen publik resmi ditutup kembali.' : 'Klasemen resmi berhasil DIPUBLIKASIKAN untuk publik!',
      { variant: current ? 'info' : 'success' }
    );
  };

  const openTeamInScoring = (teamId) => {
    try {
      sessionStorage.setItem('lbb_scoring_target_team_id', teamId);
    } catch {}
    setActiveView('juri');
  };

  const detailTeam = detailTeamId ? competitionTeams.find(t => t.id === detailTeamId) : null;
  const detailScore = detailTeamId ? scores[detailTeamId] : null;
  const detailMetrics = detailTeamId ? getScoreMetrics(detailTeamId) : null;
  const detailStage = detailTeamId ? getTeamStage(detailTeamId) : 'UNSCORED';

  const scoredCount = totalTeamsCount - unscoredCount;
  const scoredPct = totalTeamsCount > 0 ? Math.round((scoredCount / totalTeamsCount) * 100) : 0;
  const draftPct = totalTeamsCount > 0 ? Math.round((draftOnlyCount / totalTeamsCount) * 100) : 0;
  const verifiedPct = totalTeamsCount > 0 ? Math.round((verifiedOnlyCount / totalTeamsCount) * 100) : 0;
  const finalPct = totalTeamsCount > 0 ? Math.round((finalizedCount / totalTeamsCount) * 100) : 0;

  const summaryMetrics = [
    {
      id: 'ALL',
      label: 'Peleton Ternilai',
      val: String(scoredCount).padStart(2, '0'),
      max: String(totalTeamsCount).padStart(2, '0'),
      pct: scoredPct,
      note: unscoredCount > 0 ? `${unscoredCount} Belum Dinilai` : 'Semua Sudah Dinilai',
      statusColor: unscoredCount === 0 && totalTeamsCount > 0 ? 'text-emerald-400' : 'text-amber-400',
      dotColor: unscoredCount === 0 && totalTeamsCount > 0 ? 'bg-emerald-400' : 'bg-rose-500',
      barColor: unscoredCount === 0 && totalTeamsCount > 0 ? 'bg-emerald-400' : 'bg-rose-500',
    },
    {
      id: 'DRAFT',
      label: '1. Draft Input',
      val: String(draftOnlyCount).padStart(2, '0'),
      max: String(totalTeamsCount).padStart(2, '0'),
      pct: draftPct,
      note: draftOnlyCount > 0 ? 'Menunggu Verifikasi' : 'Antrean Bersih',
      statusColor: draftOnlyCount > 0 ? 'text-amber-400' : 'text-slate-400',
      dotColor: draftOnlyCount > 0 ? 'bg-amber-400' : 'bg-slate-600',
      barColor: 'bg-amber-400',
    },
    {
      id: 'VERIFIED',
      label: '2. Terverifikasi',
      val: String(verifiedOnlyCount).padStart(2, '0'),
      max: String(totalTeamsCount).padStart(2, '0'),
      pct: verifiedPct,
      note: verifiedOnlyCount > 0 ? 'Siap Dikunci Final' : 'Belum Ada Antrean',
      statusColor: verifiedOnlyCount > 0 ? 'text-blue-400' : 'text-slate-400',
      dotColor: verifiedOnlyCount > 0 ? 'bg-blue-400' : 'bg-slate-600',
      barColor: 'bg-blue-400',
    },
    {
      id: 'FINAL',
      label: '3. Final Terkunci',
      val: String(finalizedCount).padStart(2, '0'),
      max: String(totalTeamsCount).padStart(2, '0'),
      pct: finalPct,
      note: finalizedCount === totalTeamsCount && totalTeamsCount > 0 ? 'Semua Terkunci' : `${totalTeamsCount - finalizedCount} Belum Final`,
      statusColor: finalizedCount > 0 ? 'text-emerald-400' : 'text-slate-400',
      dotColor: finalizedCount > 0 ? 'bg-emerald-400' : 'bg-slate-600',
      barColor: 'bg-emerald-400',
    },
  ];

  return (
    <SimpaskorSidebarLayout
      activeMenu="rekap_nilai"
      title="Rekapitulasi Nilai & Scrutineering"
      subtitle="Audit nilai 3 dewan juri, validasi penalti & durasi, penguncian skor resmi, serta berita acara"
      hideHeader={true}
    >
      <div className="space-y-4">
        {/* Unified Dark Obsidian Command Header + 4-Column Interactive Telemetry Strip */}
        <section className="rounded-2xl bg-slate-950 text-white border border-slate-800/90 overflow-hidden shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
          {/* Top Header Row */}
          <div className="px-4 py-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-amber-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
                  Rekapitulasi Nilai &amp; Scrutineering
                </h1>
                <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">
                  Audit nilai 3 dewan juri, validasi penalti &amp; durasi, penguncian skor resmi, serta berita acara
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {isFinalisator && (
                <button
                  type="button"
                  onClick={handleTogglePublishLeaderboard}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    settings?.announcementPublished
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-400/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-xs'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{settings?.announcementPublished ? 'Tutup Publikasi' : 'Publikasikan Klasemen'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsRecapModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Buka & Cetak Berita Acara Rekapitulasi Resmi PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Berita Acara PDF</span>
              </button>
            </div>
          </div>

          {/* Integrated 4-Column Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800/80 border-t border-slate-800">
            {summaryMetrics.map(m => {
              const isSelected = statusFilter === m.id && m.id !== 'ALL';
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setStatusFilter(prev => (m.id === 'ALL' ? 'ALL' : prev === m.id ? 'ALL' : m.id))}
                  className={`text-left px-4 py-3.5 text-white flex flex-col justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-900' : 'bg-slate-950 hover:bg-slate-900/80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline">
                        <p className="text-xl sm:text-2xl font-black tracking-tight font-mono">{m.val}</p>
                        {m.max && (
                          <span className="text-[11px] font-mono font-bold text-slate-500 ml-1">/{m.max}</span>
                        )}
                      </div>
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${m.dotColor}`} />
                    </div>
                    <p className="mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                      {m.label}
                    </p>
                  </div>

                  <div className="mt-2.5">
                    <div className="w-full bg-slate-800/90 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${m.barColor}`}
                        style={{ width: `${Math.min(100, Math.max(0, m.pct))}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[8px] sm:text-[9px]">
                      <span className={`font-semibold transition-colors truncate mr-1 ${m.statusColor}`}>{m.note}</span>
                      <span className="text-slate-400 font-mono text-[8px] font-bold shrink-0">{m.pct}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Table Surface */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Flush Underline Division Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/60">
            {[
              { id: 'ALL', label: 'Semua', count: competitionTeams.length, dot: null, activeText: 'text-slate-950', bar: 'bg-slate-950', badge: 'bg-slate-900 text-white' },
              { id: 'SD', label: 'SD / MI', count: sdTotalCount, dot: 'bg-red-600', activeText: 'text-red-700', bar: 'bg-red-600', badge: 'bg-red-100 text-red-700' },
              { id: 'SMP', label: 'SMP / MTs', count: smpTotalCount, dot: 'bg-blue-600', activeText: 'text-blue-700', bar: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700' },
            ].map((tab, i) => {
              const isActive = selectedJenjang === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedJenjang(tab.id)}
                  className={`relative py-2.5 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    i < 2 ? 'border-r border-slate-200/80' : ''
                  } ${
                    isActive
                      ? `bg-white ${tab.activeText} font-extrabold`
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-semibold'
                  }`}
                >
                  {tab.dot && <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? tab.dot : 'bg-slate-300'}`} />}
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ${
                    isActive ? tab.badge : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                  {isActive && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bar}`} />}
                </button>
              );
            })}
          </div>

          {/* Search, Sort & Status Filter Toolbar */}
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari No. Dada, sekolah, atau danton..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Segmented Control */}
              <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/80 text-[11px] font-bold self-start sm:self-auto">
                <span className="px-2 text-slate-400 inline-flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                </span>
                {[
                  { id: 'peleton', label: 'Peleton' },
                  { id: 'danton', label: 'Danton' },
                  { id: 'chest', label: 'No. Dada' },
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortMode(s.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      sortMode === s.id
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
              {[
                { id: 'ALL', label: `Semua (${totalTeamsCount})` },
                { id: 'UNSCORED', label: `Belum (${unscoredCount})` },
                { id: 'DRAFT', label: `Draft (${draftOnlyCount})` },
                { id: 'VERIFIED', label: `Verif (${verifiedOnlyCount})` },
                { id: 'FINAL', label: `Final (${finalizedCount})` },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[9.5px] tracking-wider">
                  <th rowSpan={2} className="py-2.5 px-3 w-20 text-center border-r border-slate-200/70">
                    No. Dada
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3.5 min-w-[230px] border-r border-slate-200/70">
                    Peleton
                  </th>
                  <th
                    colSpan={3}
                    className={`py-1.5 px-2 text-center border-r border-slate-200/70 border-b border-slate-200/70 ${
                      sortMode === 'peleton' ? 'text-slate-900 bg-slate-100/70' : 'text-slate-600'
                    }`}
                  >
                    Nilai Peleton
                  </th>
                  <th
                    colSpan={3}
                    className={`py-1.5 px-2 text-center border-r border-slate-200/70 border-b border-slate-200/70 ${
                      sortMode === 'danton' ? 'text-slate-900 bg-slate-100/70' : 'text-slate-600'
                    }`}
                  >
                    Nilai Danton
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3 text-center w-28 border-r border-slate-200/70">
                    Status
                  </th>
                  <th rowSpan={2} className="py-2.5 px-4 text-center min-w-[155px]">
                    Aksi
                  </th>
                </tr>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 font-bold uppercase text-[9.5px] tracking-wider">
                  <th className="py-1.5 px-2 text-center w-[74px]">Murni</th>
                  <th className="py-1.5 px-2 text-center w-[74px]">Penalti</th>
                  <th className="py-1.5 px-2 text-center w-[74px] text-slate-700 border-r border-slate-200/70">Akhir</th>
                  <th className="py-1.5 px-2 text-center w-[74px]">Murni</th>
                  <th className="py-1.5 px-2 text-center w-[74px]">Penalti</th>
                  <th className="py-1.5 px-2 text-center w-[74px] text-slate-700 border-r border-slate-200/70">Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rankedTeams.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-xs text-slate-400 font-medium">
                      Tidak ada peleton yang sesuai dengan filter saat ini.
                    </td>
                  </tr>
                ) : rankedTeams.map((team) => {
                  const sc = scores[team.id];
                  const m = getScoreMetrics(team.id);
                  const stage = getTeamStage(team.id);
                  const chestNum = getChestNum(team);
                  const dantonName = team.roster?.danton?.name || team.dantonName || '-';
                  const isSD = team.jenjang === 'SD';

                  return (
                    <tr key={team.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* No. Dada */}
                      <td className="py-3 px-3 text-center border-r border-slate-100">
                        {chestNum ? (
                          <span className={`inline-flex items-center justify-center min-w-[46px] h-7 px-2 rounded-lg font-mono font-black text-xs text-white shadow-2xs ${
                            isSD ? 'bg-red-600' : 'bg-blue-600'
                          }`}>
                            {chestNum}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center min-w-[46px] h-7 px-2 rounded-lg font-mono font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200/80">
                            —
                          </span>
                        )}
                      </td>

                      {/* Peleton (Logo tanpa wadah + School + Danton tanpa prefix) */}
                      <td className="py-3 px-3.5 border-r border-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                          <BareSchoolLogo team={team} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 truncate">{team.schoolName}</span>
                              {selectedJenjang === 'ALL' && (
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border leading-none shrink-0 ${
                                  isSD
                                    ? 'bg-red-50 text-red-700 border-red-200/80'
                                    : 'bg-blue-50 text-blue-700 border-blue-200/80'
                                }`}>
                                  {team.jenjang}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">{dantonName}</div>
                          </div>
                        </div>
                      </td>

                      {/* Nilai Peleton: Murni | Penalti | Akhir */}
                      <td className="py-3 px-2 text-center font-mono tabular-nums whitespace-nowrap">
                        {m.hasScore ? (
                          <span className="font-semibold text-slate-600">{m.nilaiMurniPeleton}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums whitespace-nowrap">
                        {m.hasScore ? (
                          <span className={m.peletonPenalty > 0 ? 'font-bold text-rose-600' : 'text-slate-400'}>
                            {m.peletonPenalty > 0 ? `-${m.peletonPenalty}` : '0'}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums whitespace-nowrap border-r border-slate-100 bg-slate-50/35">
                        {m.hasScore ? (
                          <span className="font-black text-sm text-slate-950">{m.nilaiAkhirPeleton}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Nilai Danton: Murni | Penalti | Akhir */}
                      <td className="py-3 px-2 text-center font-mono tabular-nums whitespace-nowrap">
                        {m.hasScore ? (
                          <span className="font-semibold text-slate-600">{m.nilaiMurniDanton}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums whitespace-nowrap">
                        {m.hasScore ? (
                          <span className={m.dantonPenalty > 0 ? 'font-bold text-rose-600' : 'text-slate-400'}>
                            {m.dantonPenalty > 0 ? `-${m.dantonPenalty}` : '0'}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums whitespace-nowrap border-r border-slate-100 bg-slate-50/35">
                        {m.hasScore ? (
                          <span className="font-black text-sm text-slate-950">{m.nilaiAkhirDanton}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {stage === 'FINAL' ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Final
                          </span>
                        ) : stage === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Terverifikasi
                          </span>
                        ) : sc?.status === 'rejected_to_draft' ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Revisi
                          </span>
                        ) : stage === 'DRAFT' ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10.5px] font-semibold text-slate-400 bg-slate-100/80 px-2.5 py-0.5 rounded-full">
                            Belum Dinilai
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          {m.hasScore ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setDetailTeamId(team.id)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Lihat rincian nilai 3 Juri & Penalti"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {isVerifikator && stage === 'DRAFT' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleVerify(team.id)}
                                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Verifikasi
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectScore(team.id)}
                                    className="px-2 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer"
                                    title="Kembalikan ke Draft untuk diperbaiki"
                                  >
                                    Tolak
                                  </button>
                                </>
                              )}

                              {isVerifikator && stage === 'VERIFIED' && (
                                <button
                                  type="button"
                                  onClick={() => handleRejectScore(team.id)}
                                  className="px-2 py-1.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer"
                                  title="Batalkan verifikasi dan kembalikan ke Draft"
                                >
                                  Batal
                                </button>
                              )}

                              {isFinalisator && stage === 'VERIFIED' && (
                                <button
                                  type="button"
                                  onClick={() => handleFinalize(team.id)}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Kunci</span>
                                </button>
                              )}

                              {userRole === 'superadmin' && stage === 'FINAL' && (
                                <button
                                  type="button"
                                  onClick={() => handleUnlock(team.id)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[10.5px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  title="Buka kunci skor (Superadmin)"
                                >
                                  <Unlock className="w-3 h-3" />
                                  <span>Buka</span>
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openTeamInScoring(team.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 hover:border-slate-900 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <span>Input Nilai</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Rincian Audit Skor 3 Juri */}
        {detailTeam && detailScore && detailMetrics && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setDetailTeamId(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {getChestNum(detailTeam) ? (
                    <span className={`min-w-[44px] h-9 px-2 rounded-xl font-mono font-black text-sm text-white flex items-center justify-center shrink-0 ${
                      detailTeam.jenjang === 'SD' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      {getChestNum(detailTeam)}
                    </span>
                  ) : null}
                  <BareSchoolLogo team={detailTeam} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-950 uppercase truncate">{detailTeam.schoolName}</h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {detailTeam.roster?.danton?.name || detailTeam.dantonName || '-'}
                      {detailMetrics.durationLabel ? ` · Durasi ${detailMetrics.durationLabel}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailTeamId(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Nilai Akhir Peleton
                    </span>
                    <div className="text-2xl font-mono font-black text-slate-950 mt-1 leading-none">
                      {detailMetrics.nilaiAkhirPeleton}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1.5">
                      Murni {detailMetrics.nilaiMurniPeleton} · Penalti{' '}
                      <span className={detailMetrics.peletonPenalty > 0 ? 'text-rose-600 font-bold' : ''}>
                        {detailMetrics.peletonPenalty > 0 ? `-${detailMetrics.peletonPenalty}` : '0'}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Nilai Akhir Danton
                    </span>
                    <div className="text-2xl font-mono font-black text-slate-950 mt-1 leading-none">
                      {detailMetrics.nilaiAkhirDanton}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1.5">
                      Murni {detailMetrics.nilaiMurniDanton} · Penalti{' '}
                      <span className={detailMetrics.dantonPenalty > 0 ? 'text-rose-600 font-bold' : ''}>
                        {detailMetrics.dantonPenalty > 0 ? `-${detailMetrics.dantonPenalty}` : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Breakdown 3 Dewan Juri */}
                <div className="rounded-xl border border-slate-200/80 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                        <th className="py-2 px-3">Dewan Juri</th>
                        <th className="py-2 px-3 text-right">Peleton</th>
                        <th className="py-2 px-3 text-right">Danton</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-700">Juri 1</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{detailMetrics.j1Peleton}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{detailMetrics.j1Danton}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-700">Juri 2</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{detailMetrics.j2Peleton}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{detailMetrics.j2Danton}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-700">Juri 3</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{detailMetrics.j3Peleton}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{detailMetrics.j3Danton}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {detailScore.notes && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs text-slate-600">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Catatan Juri</span>
                    {detailScore.notes}
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openTeamInScoring(detailTeam.id)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Buka di E-Scoring
                </button>
                <div className="flex items-center gap-2">
                  {isVerifikator && detailStage === 'DRAFT' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRejectScore(detailTeam.id)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerify(detailTeam.id)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Verifikasi Sah
                      </button>
                    </>
                  )}
                  {isFinalisator && detailStage === 'VERIFIED' && (
                    <button
                      type="button"
                      onClick={() => handleFinalize(detailTeam.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Kunci &amp; Sahkan</span>
                    </button>
                  )}
                  {userRole === 'superadmin' && detailStage === 'FINAL' && (
                    <button
                      type="button"
                      onClick={() => handleUnlock(detailTeam.id)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Buka Kunci</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Berita Acara Rekapitulasi Resmi PDF */}
        <OfficialScoreRecapModal
          isOpen={isRecapModalOpen}
          onClose={() => setIsRecapModalOpen(false)}
          initialJenjang={selectedJenjang}
        />
      </div>
    </SimpaskorSidebarLayout>
  );
}
