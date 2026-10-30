import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  Maximize2,
  Minimize2,
  Search,
  Lock,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  Sun,
  Moon
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { VENUE } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

// Poin Juara Umum Berdasarkan Juknis Bab A Poin 7
const PELETON_POINTS = {
  1: 6, // Juara 1 Peleton = 6 Poin
  2: 5, // Juara 2 Peleton = 5 Poin
  3: 4, // Juara 3 Peleton = 4 Poin
  4: 3, // Juara Harapan 1 Peleton = 3 Poin
  5: 2, // Juara Harapan 2 Peleton = 2 Poin
  6: 1, // Juara Harapan 3 Peleton = 1 Poin
};

const DANTON_POINTS = {
  1: 3, // Juara 1 Komandan = 3 Poin
  2: 2, // Juara 2 Komandan = 2 Poin
  3: 1, // Juara 3 Komandan = 1 Poin
};

export default function LiveLeaderboard() {
  const { teams, scores, role, settings, setActiveView } = useCompetition();

  // Mode Tema (Light vs Dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('leaderboard_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('leaderboard_theme', next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  };

  // Filter State: Jenjang & Kategori Kejuaraan Sesuai Juknis
  const [selectedJenjang, setSelectedJenjang] = useState('SMP'); // 'SMP' | 'SD' | 'ALL'
  const [activeCategory, setActiveCategory] = useState('peleton'); // 'peleton' | 'danton' | 'juara_umum'
  const [searchQuery, setSearchQuery] = useState('');
  const [isStageMode, setIsStageMode] = useState(false);
  const [showJuknisInfo, setShowJuknisInfo] = useState(false);

  // Status visual efektif (Stage Mode selalu menggunakan dark theme)
  const effectiveDark = isStageMode || isDarkMode;

  // Otoritas & Publikasi
  const isStaffOrJury = ['admin', 'juri', 'superadmin', 'penginput', 'verifikator', 'finalisator'].includes(role);
  const isOfficialScoreVisible = isStaffOrJury || Boolean(settings?.announcementPublished);

  // Filter tim terverifikasi/terundi
  const verifiedTeams = useMemo(() => {
    return teams.filter(t => t.status === 'verified' || t.status === 'drawn' || t.lotNumber);
  }, [teams]);

  // Ekstraksi data nilai murni, penalti, dan nilai akhir per tim sesuai Formula Juknis Bab A.3
  const teamsWithScores = useMemo(() => {
    return verifiedTeams.map(team => {
      const s = scores[team.id] || {};
      const juries = s.juries || {};

      // 1. Aspek Peleton (PBB)
      const j1P = Number(juries.pos1?.peletonTotal ?? juries.pos1?.total ?? s.pbb?.j1 ?? 0);
      const j2P = Number(juries.pos2?.peletonTotal ?? juries.pos2?.total ?? s.pbb?.j2 ?? 0);
      const j3P = Number(juries.pos3?.peletonTotal ?? s.pbb?.j3 ?? 0);
      const nilaiMurniPeleton = Number(
        s.nilaiMurniPeleton ?? ((j1P + j2P + j3P) || Number(s.pbb?.total || 0))
      );
      const peletonPenalty = Number(s.penalties?.peletonPenalty ?? s.penalties?.totalPenalty ?? 0);
      const nilaiAkhirPeleton = Number(
        s.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)))
      );

      // 2. Aspek Komandan Peleton (Danton)
      const j1D = Number(juries.pos1?.dantonTotal ?? 0);
      const j2D = Number(juries.pos2?.dantonTotal ?? 0);
      const j3D = Number(juries.pos3?.dantonTotal ?? juries.pos3?.total ?? s.danton?.total ?? 0);
      const nilaiMurniDanton = Number(
        s.nilaiMurniDanton ?? parseFloat((j1D + j2D + j3D).toFixed(2))
      );
      const dantonPenalty = Number(s.penalties?.dantonPenalty ?? 0);
      const nilaiAkhirDanton = Number(
        s.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)))
      );

      // Rubrik Danton untuk tie-breaker (Bab A.6: Materi 35%, Vokal 25%)
      const dantonMateri = Number(s.danton?.rubricScores?.materi ?? 0);
      const dantonVokal = Number(s.danton?.rubricScores?.vokal ?? 0);

      const penaltyTotal = Number(s.penalties?.totalPenalty ?? (peletonPenalty + dantonPenalty));
      const hasScore = Boolean(s && (nilaiMurniPeleton > 0 || nilaiMurniDanton > 0 || s.scoredAt));

      return {
        team,
        scoreData: s,
        j1Peleton: j1P,
        j2Peleton: j2P,
        j3Peleton: j3P,
        nilaiMurniPeleton,
        peletonPenalty,
        nilaiAkhirPeleton,
        j1Danton: j1D,
        j2Danton: j2D,
        j3Danton: j3D,
        nilaiMurniDanton,
        dantonPenalty,
        nilaiAkhirDanton,
        dantonMateri,
        dantonVokal,
        penaltyTotal,
        hasScore
      };
    });
  }, [verifiedTeams, scores]);

  // Saring berdasarkan Jenjang yang dipilih
  const jenjangFilteredTeams = useMemo(() => {
    return teamsWithScores.filter(item => {
      if (selectedJenjang === 'ALL') return true;
      return item.team.jenjang === selectedJenjang;
    });
  }, [teamsWithScores, selectedJenjang]);

  // 1. KLASEMEN PELETON (Sesuai Juknis Bab A Poin 5)
  const rankedPeletonTeams = useMemo(() => {
    const list = [...jenjangFilteredTeams].sort((a, b) => {
      if (b.nilaiAkhirPeleton !== a.nilaiAkhirPeleton) return b.nilaiAkhirPeleton - a.nilaiAkhirPeleton;
      if (b.nilaiMurniPeleton !== a.nilaiMurniPeleton) return b.nilaiMurniPeleton - a.nilaiMurniPeleton;
      if (a.peletonPenalty !== b.peletonPenalty) return a.peletonPenalty - b.peletonPenalty;
      return b.nilaiMurniDanton - a.nilaiMurniDanton;
    });

    return list.map((item, idx) => {
      const rank = idx + 1;
      let title = `Peringkat ${rank}`;
      let shortTitle = '';

      if (rank === 1) {
        title = 'Juara Utama 1';
        shortTitle = 'Utama 1';
      } else if (rank === 2) {
        title = 'Juara Utama 2';
        shortTitle = 'Utama 2';
      } else if (rank === 3) {
        title = 'Juara Utama 3';
        shortTitle = 'Utama 3';
      } else if (rank === 4) {
        title = 'Juara Harapan 1';
        shortTitle = 'Harapan 1';
      } else if (rank === 5) {
        title = 'Juara Harapan 2';
        shortTitle = 'Harapan 2';
      } else if (rank === 6) {
        title = 'Juara Harapan 3';
        shortTitle = 'Harapan 3';
      }

      return {
        ...item,
        rank,
        title,
        shortTitle,
        points: PELETON_POINTS[rank] || 0
      };
    });
  }, [jenjangFilteredTeams]);

  // 2. KLASEMEN KOMANDAN PELETON / DANTON (Sesuai Juknis Bab A Poin 6)
  const rankedDantonTeams = useMemo(() => {
    const list = [...jenjangFilteredTeams].sort((a, b) => {
      if (b.nilaiAkhirDanton !== a.nilaiAkhirDanton) return b.nilaiAkhirDanton - a.nilaiAkhirDanton;
      if (b.nilaiMurniDanton !== a.nilaiMurniDanton) return b.nilaiMurniDanton - a.nilaiMurniDanton;
      if (a.dantonPenalty !== b.dantonPenalty) return a.dantonPenalty - b.dantonPenalty;
      if (b.dantonMateri !== a.dantonMateri) return b.dantonMateri - a.dantonMateri;
      return b.dantonVokal - a.dantonVokal;
    });

    return list.map((item, idx) => {
      const rank = idx + 1;
      let title = `Peringkat ${rank}`;
      let shortTitle = '';

      if (rank === 1) {
        title = 'Juara 1 Danton';
        shortTitle = 'Danton 1';
      } else if (rank === 2) {
        title = 'Juara 2 Danton';
        shortTitle = 'Danton 2';
      } else if (rank === 3) {
        title = 'Juara 3 Danton';
        shortTitle = 'Danton 3';
      }

      return {
        ...item,
        rank,
        title,
        shortTitle,
        points: DANTON_POINTS[rank] || 0
      };
    });
  }, [jenjangFilteredTeams]);

  // 3. KLASEMEN JUARA UMUM SEKOLAH (Sesuai Juknis Bab A Poin 7 & 8)
  const rankedJuaraUmum = useMemo(() => {
    const peletonPointsMap = new Map();
    const dantonPointsMap = new Map();

    rankedPeletonTeams.forEach(item => {
      peletonPointsMap.set(item.team.id, {
        rank: item.rank,
        title: item.title,
        shortTitle: item.shortTitle,
        points: item.points
      });
    });

    rankedDantonTeams.forEach(item => {
      dantonPointsMap.set(item.team.id, {
        rank: item.rank,
        title: item.title,
        shortTitle: item.shortTitle,
        points: item.points
      });
    });

    const schoolMap = new Map();

    jenjangFilteredTeams.forEach(item => {
      const schoolKey = `${item.team.jenjang}_${item.team.schoolName}`;
      const pInfo = peletonPointsMap.get(item.team.id) || { rank: 99, title: '-', shortTitle: '', points: 0 };
      const dInfo = dantonPointsMap.get(item.team.id) || { rank: 99, title: '-', shortTitle: '', points: 0 };

      if (!schoolMap.has(schoolKey)) {
        schoolMap.set(schoolKey, {
          schoolName: item.team.schoolName,
          jenjang: item.team.jenjang,
          teams: [],
          totalPeletonPoints: 0,
          totalDantonPoints: 0,
          totalPoints: 0,
          bestMurniPeleton: 0,
          leastPeletonPenalty: 9999,
          bestMurniDanton: 0,
          peletonAchievements: [],
          dantonAchievements: []
        });
      }

      const sch = schoolMap.get(schoolKey);
      sch.teams.push(item);
      sch.totalPeletonPoints += pInfo.points;
      sch.totalDantonPoints += dInfo.points;
      sch.totalPoints += (pInfo.points + dInfo.points);

      if (pInfo.points > 0) {
        sch.peletonAchievements.push({
          platoonName: item.team.platoonName || 'Peleton',
          title: pInfo.title,
          shortTitle: pInfo.shortTitle || pInfo.title,
          points: pInfo.points
        });
      }
      if (dInfo.points > 0) {
        sch.dantonAchievements.push({
          dantonName: item.team.dantonName || 'Danton',
          title: dInfo.title,
          shortTitle: dInfo.shortTitle || dInfo.title,
          points: dInfo.points
        });
      }

      if (item.nilaiMurniPeleton > sch.bestMurniPeleton) {
        sch.bestMurniPeleton = item.nilaiMurniPeleton;
      }
      if (item.peletonPenalty < sch.leastPeletonPenalty) {
        sch.leastPeletonPenalty = item.peletonPenalty;
      }
      if (item.nilaiMurniDanton > sch.bestMurniDanton) {
        sch.bestMurniDanton = item.nilaiMurniDanton;
      }
    });

    const list = Array.from(schoolMap.values()).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.bestMurniPeleton !== a.bestMurniPeleton) return b.bestMurniPeleton - a.bestMurniPeleton;
      if (a.leastPeletonPenalty !== b.leastPeletonPenalty) return a.leastPeletonPenalty - b.leastPeletonPenalty;
      return b.bestMurniDanton - a.bestMurniDanton;
    });

    return list.map((sch, idx) => {
      const rank = idx + 1;
      let title = `Peringkat ${rank}`;
      let shortTitle = '';

      if (rank === 1) {
        title = '🏆 JUARA UMUM (PIALA BERGILIR)';
        shortTitle = 'Juara Umum';
      } else if (rank === 2) {
        title = 'Runner-Up 1 Juara Umum';
        shortTitle = 'Runner-Up 1';
      } else if (rank === 3) {
        title = 'Runner-Up 2 Juara Umum';
        shortTitle = 'Runner-Up 2';
      }

      return {
        ...sch,
        rank,
        title,
        shortTitle
      };
    });
  }, [jenjangFilteredTeams, rankedPeletonTeams, rankedDantonTeams]);

  // Filter pencarian teks
  const finalFilteredPeleton = useMemo(() => {
    if (!searchQuery) return rankedPeletonTeams;
    const q = searchQuery.toLowerCase();
    return rankedPeletonTeams.filter(
      item =>
        item.team.schoolName.toLowerCase().includes(q) ||
        (item.team.platoonName && item.team.platoonName.toLowerCase().includes(q)) ||
        (item.team.dantonName && item.team.dantonName.toLowerCase().includes(q))
    );
  }, [rankedPeletonTeams, searchQuery]);

  const finalFilteredDanton = useMemo(() => {
    if (!searchQuery) return rankedDantonTeams;
    const q = searchQuery.toLowerCase();
    return rankedDantonTeams.filter(
      item =>
        item.team.schoolName.toLowerCase().includes(q) ||
        (item.team.dantonName && item.team.dantonName.toLowerCase().includes(q)) ||
        (item.team.platoonName && item.team.platoonName.toLowerCase().includes(q))
    );
  }, [rankedDantonTeams, searchQuery]);

  const finalFilteredJuaraUmum = useMemo(() => {
    if (!searchQuery) return rankedJuaraUmum;
    const q = searchQuery.toLowerCase();
    return rankedJuaraUmum.filter(item => item.schoolName.toLowerCase().includes(q));
  }, [rankedJuaraUmum, searchQuery]);

  // Toggle fullscreen mode
  function toggleStageMode() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsStageMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsStageMode(false);
    }
  }

  // Data podium sesuai tab yang aktif
  const currentPodiumData = useMemo(() => {
    if (activeCategory === 'peleton') {
      return finalFilteredPeleton.slice(0, 3).map(item => ({
        rank: item.rank,
        title: item.title,
        mainTitle: item.team.schoolName,
        subTitle: item.team.platoonName || 'Peleton PBB',
        score: item.nilaiAkhirPeleton,
        scoreLabel: 'Nilai Akhir',
        subScore: `Murni: ${item.nilaiMurniPeleton} | Penalti: ${item.peletonPenalty}`,
        badgeColorLight: item.badgeColorLight,
        badgeColorDark: item.badgeColorDark
      }));
    } else if (activeCategory === 'danton') {
      return finalFilteredDanton.slice(0, 3).map(item => ({
        rank: item.rank,
        title: item.title,
        mainTitle: item.team.dantonName || 'Komandan Peleton',
        subTitle: item.team.schoolName,
        score: item.nilaiAkhirDanton,
        scoreLabel: 'Nilai Danton',
        subScore: `Murni: ${item.nilaiMurniDanton} | Penalti: ${item.dantonPenalty}`,
        badgeColorLight: item.badgeColorLight,
        badgeColorDark: item.badgeColorDark
      }));
    } else {
      return finalFilteredJuaraUmum.slice(0, 3).map(item => ({
        rank: item.rank,
        title: item.title,
        mainTitle: item.schoolName,
        subTitle: `Jenjang ${item.jenjang}`,
        score: item.totalPoints,
        scoreLabel: 'Poin Prestasi',
        subScore: `Peleton: ${item.totalPeletonPoints} Poin | Danton: ${item.totalDantonPoints} Poin`,
        badgeColorLight: item.badgeColorLight,
        badgeColorDark: item.badgeColorDark
      }));
    }
  }, [activeCategory, finalFilteredPeleton, finalFilteredDanton, finalFilteredJuaraUmum]);

  const content = (
    <div className={`space-y-6 ${effectiveDark ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* 1. Header Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
          effectiveDark
            ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-red-950/80 border-slate-800 text-white'
            : 'bg-gradient-to-r from-[#8B0000] via-[#780606] to-[#540404] border-red-950/20 text-white'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center shadow-inner shrink-0">
            <Trophy className="w-9 h-9" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-300/30">
                Live Scoreboard Resmi
              </span>
              <span className="text-xs text-white/80 font-medium">{VENUE.NAME}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              Papan Klasemen & Hasil Lomba
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
              Sistem penetapan Juara Utama, Harapan, Danton Terbaik & Juara Umum mengacu pada Petunjuk Teknis Penilaian & Kejuaraan LBB Mu'allimin 2027 (Bab A).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tombol Toggle Dark / Light Mode */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title={effectiveDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          >
            {effectiveDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-100" />}
            <span>{effectiveDark ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>

          {/* Tombol Regulasi Juknis */}
          <button
            type="button"
            onClick={() => setShowJuknisInfo(!showJuknisInfo)}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Info className="w-4 h-4 text-amber-300" />
            <span>Regulasi Juknis</span>
            {showJuknisInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Tombol Mode Layar Panggung */}
          <button
            type="button"
            onClick={toggleStageMode}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 ${
              isStageMode
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            {isStageMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isStageMode ? 'Keluar Layar' : 'Layar Panggung'}</span>
          </button>

          {!isStageMode && (
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Beranda
            </button>
          )}
        </div>
      </div>

      {/* 2. Informasi Regulasi Resmi Juknis (Collapsible) */}
      {showJuknisInfo && (
        <div
          className={`rounded-2xl p-5 border text-xs space-y-4 shadow-sm transition-all ${
            effectiveDark
              ? 'bg-slate-900 border-amber-500/30 text-slate-200'
              : 'bg-amber-50/90 border-amber-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/20">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wide text-amber-800 dark:text-amber-300">
              Rujukan Resmi: Petunjuk Teknis Penilaian & Kejuaraan LBB Mu'allimin 2027
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Box 1: Peleton */}
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                effectiveDark
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-white border-amber-200/80 shadow-2xs'
              }`}
            >
              <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>1. Kejuaraan Peleton (Bab A.5)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Diurutkan berdasarkan <strong>Nilai Akhir Peleton</strong> (Nilai Murni 3 Juri dikurangi Penalti Peleton).
              </p>
              <div
                className={`text-[10px] p-2 rounded-lg ${
                  effectiveDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <strong>Prioritas Tie-Breaker:</strong>
                <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                  <li>Nilai Murni Peleton Tertinggi</li>
                  <li>Penalti Peleton Paling Sedikit</li>
                  <li>Nilai Murni Danton Tertinggi</li>
                  <li>Sidang Pleno Dewan Juri</li>
                </ol>
              </div>
            </div>

            {/* Box 2: Danton */}
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                effectiveDark
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-white border-amber-200/80 shadow-2xs'
              }`}
            >
              <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>2. Komandan Terbaik (Bab A.6)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Diurutkan berdasarkan <strong>Nilai Akhir Danton</strong> (Nilai Murni 3 Juri dikurangi Penalti Danton).
              </p>
              <div
                className={`text-[10px] p-2 rounded-lg ${
                  effectiveDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <strong>Prioritas Tie-Breaker:</strong>
                <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                  <li>Nilai Murni Danton Tertinggi</li>
                  <li>Penalti Danton Paling Sedikit</li>
                  <li>Skor Materi Lomba (Bobot 35%)</li>
                  <li>Skor Kualitas Vokal (Bobot 25%)</li>
                </ol>
              </div>
            </div>

            {/* Box 3: Juara Umum */}
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                effectiveDark
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-white border-amber-200/80 shadow-2xs'
              }`}
            >
              <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>3. Piala Bergilir Juara Umum (Bab A.7 & 8)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Dihitung dari akumulasi poin prestasi per sekolah pada jenjang terkait:
              </p>
              <div
                className={`text-[10px] p-2 rounded-lg space-y-1 ${
                  effectiveDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <div><strong>Peleton:</strong> Juara 1=6 pt, 2=5 pt, 3=4 pt, H1=3 pt, H2=2 pt, H3=1 pt.</div>
                <div><strong>Danton:</strong> Juara 1=3 pt, 2=2 pt, 3=1 pt.</div>
                <div className="font-bold text-amber-700 dark:text-amber-400">Total Poin = Poin Peleton + Poin Danton.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Toolbar Filter: Jenjang & Kategori Kejuaraan */}
      <div
        className={`p-3.5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-xs transition-colors ${
          effectiveDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200/90'
        }`}
      >
        {/* Kiri: Switch Kategori Kejuaraan */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory('peleton')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'peleton'
                ? effectiveDark
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-red-800 text-white shadow-xs'
                : effectiveDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Kategori Peleton (PBB)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('danton')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'danton'
                ? effectiveDark
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-600 text-white shadow-xs'
                : effectiveDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Medal className="w-4 h-4 text-amber-300" />
            <span>Danton Terbaik</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('juara_umum')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'juara_umum'
                ? effectiveDark
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-900 text-white shadow-xs'
                : effectiveDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Klasemen Juara Umum</span>
          </button>
        </div>

        {/* Kanan: Switch Jenjang (SMP/MTs vs SD/MI tanpa pilihan 'Semua') & Search Box */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Jenjang Khusus: SMP/MTs & SD/MI Terpisah */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              effectiveDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setSelectedJenjang('SD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedJenjang === 'SD'
                  ? effectiveDark
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : effectiveDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedJenjang === 'SD' ? 'bg-red-500' : 'bg-slate-400'}`} />
              <span>SD/MI</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedJenjang('SMP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedJenjang === 'SMP'
                  ? effectiveDark
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : effectiveDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedJenjang === 'SMP' ? 'bg-blue-500' : 'bg-slate-400'}`} />
              <span>SMP/MTs</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari sekolah/peleton/danton..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                effectiveDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4. Banner Kerahasiaan Jika Skor Belum Dipublikasikan Resmi */}
      {!isOfficialScoreVisible && (
        <div
          className={`border rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xs transition-colors ${
            effectiveDark
              ? 'bg-amber-950/20 border-amber-500/30 text-slate-200'
              : 'bg-amber-50 border-amber-200 text-slate-800'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="max-w-xl mx-auto space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              Kerahasiaan Penjurian Resmi LBB 2027
            </span>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Hasil Klasemen & Skor Sementara Sedang Direkap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sesuai Juknis Bab A.9 & A.10, perolehan nilai sedang diverifikasi dalam Sidang Pleno Dewan Juri. Skor resmi akan ditampilkan secara transparan setelah penandatanganan Berita Acara Kejuaraan.
            </p>
          </div>
        </div>
      )}

      {/* 5. Podium Display for Top 3 */}
      {isOfficialScoreVisible && currentPodiumData.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* PODIUM #2 (Perak) */}
          <div
            className={`p-6 rounded-3xl border flex flex-col items-center justify-between text-center relative order-2 md:order-1 transition-all ${
              effectiveDark
                ? 'bg-slate-900 border-slate-800 shadow-md text-white'
                : 'bg-white border-slate-200/90 shadow-xs text-slate-900'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl font-black text-lg flex items-center justify-center shadow-inner mb-3 ${
                effectiveDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              #2
            </div>
            <span
              className={`text-[11px] uppercase font-black tracking-wider ${
                effectiveDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {currentPodiumData[1].title}
            </span>
            <h3
              className={`font-black text-lg mt-1.5 leading-snug ${
                effectiveDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {currentPodiumData[1].mainTitle}
            </h3>
            <p
              className={`text-xs font-medium mt-0.5 ${
                effectiveDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {currentPodiumData[1].subTitle}
            </p>
            <div
              className={`mt-4 pt-3 border-t w-full ${
                effectiveDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div
                className={`font-mono font-black text-2xl ${
                  effectiveDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {currentPodiumData[1].score}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {currentPodiumData[1].scoreLabel}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {currentPodiumData[1].subScore}
              </div>
            </div>
          </div>

          {/* PODIUM #1 (Emas / Champion) */}
          <div
            className={`p-7 rounded-3xl border-2 flex flex-col items-center justify-between text-center relative order-1 md:order-2 transform md:-translate-y-2 transition-all ${
              effectiveDark
                ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-400/90 text-white shadow-xl shadow-amber-950/30'
                : 'bg-gradient-to-b from-amber-50/90 via-yellow-50/40 to-white border-amber-300 shadow-md text-slate-900'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md mb-3">
              <Crown className="w-8 h-8 fill-current" />
            </div>
            <span
              className={`text-xs uppercase font-black tracking-widest px-3 py-1 rounded-full border ${
                effectiveDark
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {currentPodiumData[0].title}
            </span>
            <h3
              className={`font-black text-xl mt-2 leading-snug ${
                effectiveDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {currentPodiumData[0].mainTitle}
            </h3>
            <p
              className={`text-xs font-semibold mt-0.5 ${
                effectiveDark ? 'text-amber-300' : 'text-amber-800'
              }`}
            >
              {currentPodiumData[0].subTitle}
            </p>
            <div
              className={`mt-4 pt-3 border-t w-full ${
                effectiveDark ? 'border-amber-900/40' : 'border-amber-200/80'
              }`}
            >
              <div className="font-mono font-black text-3xl text-amber-600 dark:text-amber-400">
                {currentPodiumData[0].score}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {currentPodiumData[0].scoreLabel}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {currentPodiumData[0].subScore}
              </div>
            </div>
          </div>

          {/* PODIUM #3 (Perunggu) */}
          <div
            className={`p-6 rounded-3xl border flex flex-col items-center justify-between text-center relative order-3 transition-all ${
              effectiveDark
                ? 'bg-slate-900 border-slate-800 shadow-md text-white'
                : 'bg-white border-slate-200/90 shadow-xs text-slate-900'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl font-black text-lg flex items-center justify-center shadow-inner mb-3 ${
                effectiveDark ? 'bg-orange-950/40 text-orange-300' : 'bg-orange-50 text-orange-800'
              }`}
            >
              #3
            </div>
            <span
              className={`text-[11px] uppercase font-black tracking-wider ${
                effectiveDark ? 'text-orange-400' : 'text-orange-800'
              }`}
            >
              {currentPodiumData[2].title}
            </span>
            <h3
              className={`font-black text-lg mt-1.5 leading-snug ${
                effectiveDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {currentPodiumData[2].mainTitle}
            </h3>
            <p
              className={`text-xs font-medium mt-0.5 ${
                effectiveDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {currentPodiumData[2].subTitle}
            </p>
            <div
              className={`mt-4 pt-3 border-t w-full ${
                effectiveDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div
                className={`font-mono font-black text-2xl ${
                  effectiveDark ? 'text-orange-400' : 'text-amber-800'
                }`}
              >
                {currentPodiumData[2].score}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {currentPodiumData[2].scoreLabel}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {currentPodiumData[2].subScore}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TABEL HASIL & KLASEMEN RESMI */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          effectiveDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200/90'
        }`}
      >
        {/* Section Header Bar */}
        <div
          className={`p-3.5 px-4 border-b flex items-center justify-between transition-colors ${
            effectiveDark
              ? 'bg-slate-950 border-slate-800 text-amber-400'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider">
              {activeCategory === 'peleton' && 'Klasemen Kategori Peleton (PBB Murni & Akhir)'}
              {activeCategory === 'danton' && 'Klasemen Kategori Komandan Peleton Terbaik'}
              {activeCategory === 'juara_umum' && 'Klasemen Juara Umum (Akumulasi Poin Sekolah)'}
            </span>
          </div>
          <span
            className={`text-[11px] font-mono font-semibold ${
              effectiveDark ? 'text-amber-400' : 'text-slate-600'
            }`}
          >
            Jenjang: {selectedJenjang === 'SD' ? 'SD/MI (Arena 1)' : 'SMP/MTs (Arena 2)'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* TAB 1: KATEGORI PELETON */}
          {activeCategory === 'peleton' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className={`uppercase text-[11px] font-black border-b transition-colors ${
                    effectiveDark
                      ? 'bg-slate-950/80 text-slate-300 border-slate-800'
                      : 'bg-slate-100/90 text-slate-700 border-slate-200'
                  }`}
                >
                  {isOfficialScoreVisible && <th className="py-3.5 px-4 text-center w-28">Peringkat & Gelar</th>}
                  <th className="py-3.5 px-3 text-center w-16">No. Undi</th>
                  <th className="py-3.5 px-4">Peleton & Pangkalan Sekolah</th>
                  <th className="py-3.5 px-3 text-center w-20">Jenjang</th>
                  {isOfficialScoreVisible ? (
                    <>
                      <th className="py-3.5 px-3 text-center w-16">Juri 1</th>
                      <th className="py-3.5 px-3 text-center w-16">Juri 2</th>
                      <th className="py-3.5 px-3 text-center w-16">Juri 3</th>
                      <th
                        className={`py-3.5 px-3 text-center w-24 ${
                          effectiveDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/60 text-slate-800'
                        }`}
                      >
                        Nilai Murni
                      </th>
                      <th className="py-3.5 px-3 text-center w-20 text-rose-600 dark:text-rose-400">Penalti</th>
                      <th
                        className={`py-3.5 px-3 text-center w-28 ${
                          effectiveDark
                            ? 'bg-amber-950/40 text-amber-300'
                            : 'bg-amber-100/60 text-amber-900'
                        }`}
                      >
                        Nilai Akhir Peleton
                      </th>
                    </>
                  ) : (
                    <th className="py-3.5 px-4 text-center w-36">Status Tampil</th>
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y font-medium transition-colors ${
                  effectiveDark ? 'divide-slate-800' : 'divide-slate-100'
                }`}
              >
                {finalFilteredPeleton.length === 0 ? (
                  <tr>
                    <td colSpan={isOfficialScoreVisible ? 10 : 4} className="py-8 text-center text-slate-400">
                      Belum ada peleton pada filter ini.
                    </td>
                  </tr>
                ) : (
                  finalFilteredPeleton.map(item => {
                    const isTop3 = isOfficialScoreVisible && item.rank <= 3;
                    const j1 = item.j1Peleton > 0 ? item.j1Peleton : '-';
                    const j2 = item.j2Peleton > 0 ? item.j2Peleton : '-';
                    const j3 = item.j3Peleton > 0 ? item.j3Peleton : '-';
                    const murni = item.nilaiMurniPeleton > 0 ? item.nilaiMurniPeleton : '-';
                    const akhir = item.nilaiAkhirPeleton > 0 ? item.nilaiAkhirPeleton : '-';
                    const penalty = item.peletonPenalty || 0;

                    return (
                      <tr
                        key={item.team.id}
                        className={`transition-colors ${
                          isTop3
                            ? effectiveDark
                              ? 'bg-amber-950/20 hover:bg-amber-950/30'
                              : 'bg-amber-50/50 hover:bg-amber-50/80 font-semibold'
                            : effectiveDark
                            ? 'hover:bg-slate-800/50 text-slate-200'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {isOfficialScoreVisible && (
                          <td className="py-2.5 px-3 text-center">
                            {item.rank === 1 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  1
                                </span>
                                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 2 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  2
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 3 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  3
                                </span>
                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 3 && item.shortTitle && (
                              <div className="inline-flex flex-col items-center">
                                <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                                  {item.rank}
                                </span>
                                <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 6 && (
                              <span className="font-mono font-bold text-xs text-slate-400 dark:text-slate-500">
                                {item.rank}
                              </span>
                            )}
                          </td>
                        )}
                        <td
                          className={`py-3.5 px-3 text-center font-mono font-bold ${
                            effectiveDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {item.team.lotNumber ? String(item.team.lotNumber).padStart(2, '0') : '--'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div
                            className={`font-bold text-sm ${
                              effectiveDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {item.team.schoolName}
                          </div>
                          <div
                            className={`text-[11px] font-medium ${
                              effectiveDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {item.team.platoonName || 'Peleton'} (Danton: {item.team.dantonName || '-'})
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`font-bold text-xs px-2 py-0.5 rounded border ${
                              effectiveDark
                                ? 'bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.team.jenjang}
                          </span>
                        </td>
                        {isOfficialScoreVisible ? (
                          <>
                            <td
                              className={`py-3.5 px-3 text-center font-mono ${
                                effectiveDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {j1}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono ${
                                effectiveDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {j2}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono ${
                                effectiveDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {j3}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono font-semibold ${
                                effectiveDark
                                  ? 'bg-slate-800/40 text-slate-200'
                                  : 'bg-slate-100/60 text-slate-800'
                              }`}
                            >
                              {murni}
                            </td>
                            <td className="py-3.5 px-3 text-center font-mono text-rose-600 dark:text-rose-400 font-bold">
                              {penalty > 0 ? `-${penalty}` : '0'}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono font-black ${
                                effectiveDark
                                  ? 'bg-amber-950/40 text-amber-300'
                                  : 'bg-amber-100/60 text-amber-900'
                              }`}
                            >
                              {akhir}
                            </td>
                          </>
                        ) : (
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                item.hasScore
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : effectiveDark
                                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.hasScore ? 'Sudah Tampil (Terekap)' : 'Menunggu Giliran'}
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: KATEGORI DANTON TERBAIK */}
          {activeCategory === 'danton' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className={`uppercase text-[11px] font-black border-b transition-colors ${
                    effectiveDark
                      ? 'bg-slate-950/80 text-slate-300 border-slate-800'
                      : 'bg-slate-100/90 text-slate-700 border-slate-200'
                  }`}
                >
                  {isOfficialScoreVisible && <th className="py-3.5 px-4 text-center w-28">Peringkat & Gelar</th>}
                  <th className="py-3.5 px-3 text-center w-16">No. Undi</th>
                  <th className="py-3.5 px-4">Nama Komandan (Danton)</th>
                  <th className="py-3.5 px-4">Pangkalan Sekolah</th>
                  <th className="py-3.5 px-3 text-center w-20">Jenjang</th>
                  {isOfficialScoreVisible ? (
                    <>
                      <th className="py-3.5 px-3 text-center w-16">Juri 1</th>
                      <th className="py-3.5 px-3 text-center w-16">Juri 2</th>
                      <th className="py-3.5 px-3 text-center w-16">Juri 3</th>
                      <th
                        className={`py-3.5 px-3 text-center w-24 ${
                          effectiveDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/60 text-slate-800'
                        }`}
                      >
                        Nilai Murni
                      </th>
                      <th className="py-3.5 px-3 text-center w-20 text-rose-600 dark:text-rose-400">Penalti</th>
                      <th
                        className={`py-3.5 px-3 text-center w-28 ${
                          effectiveDark
                            ? 'bg-amber-950/40 text-amber-300'
                            : 'bg-amber-100/60 text-amber-900'
                        }`}
                      >
                        Nilai Akhir Danton
                      </th>
                    </>
                  ) : (
                    <th className="py-3.5 px-4 text-center w-36">Status Tampil</th>
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y font-medium transition-colors ${
                  effectiveDark ? 'divide-slate-800' : 'divide-slate-100'
                }`}
              >
                {finalFilteredDanton.length === 0 ? (
                  <tr>
                    <td colSpan={isOfficialScoreVisible ? 11 : 5} className="py-8 text-center text-slate-400">
                      Belum ada data danton pada filter ini.
                    </td>
                  </tr>
                ) : (
                  finalFilteredDanton.map(item => {
                    const isTop3 = isOfficialScoreVisible && item.rank <= 3;
                    const j1 = item.j1Danton > 0 ? item.j1Danton : '-';
                    const j2 = item.j2Danton > 0 ? item.j2Danton : '-';
                    const j3 = item.j3Danton > 0 ? item.j3Danton : '-';
                    const murni = item.nilaiMurniDanton > 0 ? item.nilaiMurniDanton : '-';
                    const akhir = item.nilaiAkhirDanton > 0 ? item.nilaiAkhirDanton : '-';
                    const penalty = item.dantonPenalty || 0;

                    return (
                      <tr
                        key={item.team.id}
                        className={`transition-colors ${
                          isTop3
                            ? effectiveDark
                              ? 'bg-amber-950/20 hover:bg-amber-950/30'
                              : 'bg-amber-50/50 hover:bg-amber-50/80 font-semibold'
                            : effectiveDark
                            ? 'hover:bg-slate-800/50 text-slate-200'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {isOfficialScoreVisible && (
                          <td className="py-2.5 px-3 text-center">
                            {item.rank === 1 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  1
                                </span>
                                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 2 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  2
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 3 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  3
                                </span>
                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 3 && item.shortTitle && (
                              <div className="inline-flex flex-col items-center">
                                <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                                  {item.rank}
                                </span>
                                <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 6 && (
                              <span className="font-mono font-bold text-xs text-slate-400 dark:text-slate-500">
                                {item.rank}
                              </span>
                            )}
                          </td>
                        )}
                        <td
                          className={`py-3.5 px-3 text-center font-mono font-bold ${
                            effectiveDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {item.team.lotNumber ? String(item.team.lotNumber).padStart(2, '0') : '--'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div
                            className={`font-bold text-sm ${
                              effectiveDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {item.team.dantonName || 'Komandan Peleton'}
                          </div>
                          <div
                            className={`text-[11px] font-medium ${
                              effectiveDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {item.team.platoonName || 'Peleton'}
                          </div>
                        </td>
                        <td
                          className={`py-3.5 px-4 font-semibold ${
                            effectiveDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {item.team.schoolName}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`font-bold text-xs px-2 py-0.5 rounded border ${
                              effectiveDark
                                ? 'bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.team.jenjang}
                          </span>
                        </td>
                        {isOfficialScoreVisible ? (
                          <>
                            <td
                              className={`py-3.5 px-3 text-center font-mono ${
                                effectiveDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {j1}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono ${
                                effectiveDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {j2}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono ${
                                effectiveDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {j3}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono font-semibold ${
                                effectiveDark
                                  ? 'bg-slate-800/40 text-slate-200'
                                  : 'bg-slate-100/60 text-slate-800'
                              }`}
                            >
                              {murni}
                            </td>
                            <td className="py-3.5 px-3 text-center font-mono text-rose-600 dark:text-rose-400 font-bold">
                              {penalty > 0 ? `-${penalty}` : '0'}
                            </td>
                            <td
                              className={`py-3.5 px-3 text-center font-mono font-black ${
                                effectiveDark
                                  ? 'bg-amber-950/40 text-amber-300'
                                  : 'bg-amber-100/60 text-amber-900'
                              }`}
                            >
                              {akhir}
                            </td>
                          </>
                        ) : (
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                item.hasScore
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : effectiveDark
                                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.hasScore ? 'Sudah Tampil (Terekap)' : 'Menunggu Giliran'}
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: KLASEMEN JUARA UMUM SEKOLAH */}
          {activeCategory === 'juara_umum' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className={`uppercase text-[11px] font-black border-b transition-colors ${
                    effectiveDark
                      ? 'bg-slate-950/80 text-slate-300 border-slate-800'
                      : 'bg-slate-100/90 text-slate-700 border-slate-200'
                  }`}
                >
                  <th className="py-3.5 px-4 text-center w-28">Peringkat & Gelar</th>
                  <th className="py-3.5 px-4">Pangkalan Sekolah</th>
                  <th className="py-3.5 px-3 text-center w-20">Jenjang</th>
                  <th className="py-3.5 px-4">Prestasi Peleton (Poin Juknis)</th>
                  <th className="py-3.5 px-4">Prestasi Danton (Poin Juknis)</th>
                  <th
                    className={`py-3.5 px-3 text-center w-28 ${
                      effectiveDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/60 text-slate-800'
                    }`}
                  >
                    Murni Tie-Breaker
                  </th>
                  <th
                    className={`py-3.5 px-4 text-center w-36 font-black ${
                      effectiveDark
                        ? 'bg-amber-950/40 text-amber-300'
                        : 'bg-amber-100/60 text-amber-900'
                    }`}
                  >
                    Total Poin Juara Umum
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y font-medium transition-colors ${
                  effectiveDark ? 'divide-slate-800' : 'divide-slate-100'
                }`}
              >
                {finalFilteredJuaraUmum.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada data akumulasi poin sekolah.
                    </td>
                  </tr>
                ) : (
                  finalFilteredJuaraUmum.map(sch => {
                    const isChampion = sch.rank === 1;

                    return (
                      <tr
                        key={`${sch.jenjang}_${sch.schoolName}`}
                        className={`transition-colors ${
                          isChampion
                            ? effectiveDark
                              ? 'bg-amber-950/30 hover:bg-amber-950/40 font-bold'
                              : 'bg-amber-50/70 hover:bg-amber-50 font-bold'
                            : effectiveDark
                            ? 'hover:bg-slate-800/50 text-slate-200'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          {sch.rank === 1 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                1
                              </span>
                              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                Juara Umum
                              </span>
                            </div>
                          )}
                          {sch.rank === 2 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                2
                              </span>
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                                Runner-Up 1
                              </span>
                            </div>
                          )}
                          {sch.rank === 3 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                                3
                              </span>
                              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                Runner-Up 2
                              </span>
                            </div>
                          )}
                          {sch.rank > 3 && (
                            <span className="font-mono font-bold text-xs text-slate-400 dark:text-slate-500">
                              {sch.rank}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div
                            className={`font-bold text-sm flex items-center gap-1.5 ${
                              effectiveDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            <Building2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{sch.schoolName}</span>
                          </div>
                          <div
                            className={`text-[11px] font-normal ${
                              effectiveDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            Perwakilan: {sch.teams.length} Peleton
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`font-bold text-xs px-2 py-0.5 rounded border ${
                              effectiveDark
                                ? 'bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {sch.jenjang}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          {sch.peletonAchievements.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {sch.peletonAchievements.map((ach, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                    effectiveDark
                                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                                      : 'bg-slate-50 border-slate-200/90 text-slate-800'
                                  }`}
                                >
                                  <Shield className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                                  <span className="font-semibold">{ach.platoonName}</span>
                                  <span className="text-slate-400">·</span>
                                  <span className="text-slate-600 dark:text-slate-300">{ach.shortTitle}</span>
                                  <span className="font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                                    +{ach.points} pt
                                  </span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-xs">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {sch.dantonAchievements.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {sch.dantonAchievements.map((ach, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                    effectiveDark
                                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                                      : 'bg-slate-50 border-slate-200/90 text-slate-800'
                                  }`}
                                >
                                  <Medal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span className="font-semibold">{ach.dantonName}</span>
                                  <span className="text-slate-400">·</span>
                                  <span className="text-slate-600 dark:text-slate-300">{ach.shortTitle}</span>
                                  <span className="font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                                    +{ach.points} pt
                                  </span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-xs">-</span>
                          )}
                        </td>
                        <td
                          className={`py-3.5 px-3 text-center font-mono ${
                            effectiveDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {sch.bestMurniPeleton > 0 ? sch.bestMurniPeleton : '-'}
                        </td>
                        <td
                          className={`py-3.5 px-4 text-center font-mono font-black text-base ${
                            effectiveDark
                              ? 'bg-amber-950/40 text-amber-300'
                              : 'bg-amber-100/60 text-amber-900'
                          }`}
                        >
                          {sch.totalPoints} <span className="text-xs font-normal text-slate-500">Poin</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  // Jika Mode Layar Panggung (Fullscreen)
  if (isStageMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 font-sans">
        <div className="max-w-7xl mx-auto">{content}</div>
      </div>
    );
  }

  // Tampilan Standar dalam Simpaskor Layout
  return (
    <SimpaskorSidebarLayout
      activeMenu="klasemen"
      title="Klasemen & Hasil Live"
      subtitle="Papan Peringkat Resmi Dewan Juri Realtime"
    >
      <div
        className={`rounded-3xl p-4 sm:p-6 transition-colors ${
          effectiveDark ? 'bg-slate-950 text-slate-100' : 'bg-transparent text-slate-800'
        }`}
      >
        {content}
      </div>
    </SimpaskorSidebarLayout>
  );
}
