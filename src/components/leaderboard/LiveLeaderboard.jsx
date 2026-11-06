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
import { formatImageUrl } from '../../services/sheetService.js';
import { getChestNumberByLot } from '../../context/competitionHelpers.js';

// Komponen Badge Logo Sekolah dengan Fallback Monogram Inisial
function SchoolLogo({ team, schoolName, size = 'table', className = '', isDark = false }) {
  const [hasError, setHasError] = useState(false);

  const rawLogo =
    team?.files?.schoolLogo?.url ||
    team?.file_logo_sekolah ||
    team?.logoUrl ||
    team?.schoolLogo?.url ||
    (typeof team?.schoolLogo === 'string' ? team.schoolLogo : null) ||
    team?.logo ||
    team?.avatar;

  const name = schoolName || team?.schoolName || 'Sekolah';
  const validUrl = !hasError && rawLogo && rawLogo !== '#' && !rawLogo.startsWith('#');
  const logoUrl = validUrl ? formatImageUrl(rawLogo) : null;

  const initials = useMemo(() => {
    if (!name) return 'LK';
    const clean = name
      .replace(/\b(sd|mi|smp|mts|sma|smk|negeri|swasta|dan|kabupaten|kota)\b/gi, '')
      .trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    if (words.length === 1 && words[0].length >= 2) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  let sizeClasses = '';
  let fontClasses = '';

  if (size === 'podium-lg') {
    sizeClasses = 'w-20 h-20 sm:w-24 sm:h-24';
    fontClasses = `text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-900'}`;
  } else if (size === 'podium-md') {
    sizeClasses = 'w-16 h-16 sm:w-18 sm:h-18';
    fontClasses = `text-xl font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  } else {
    // table
    sizeClasses = 'w-9 h-9';
    fontClasses = `text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className={`${sizeClasses} object-contain filter drop-shadow-sm select-none shrink-0 ${className}`}
        title={name}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-xl shrink-0 flex items-center justify-center font-mono select-none ${
        isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
      } ${className}`}
      title={name}
    >
      <span className={fontClasses}>{initials}</span>
    </div>
  );
}

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
  const { teams, scores, role, currentUser, currentTeam, settings, setActiveView } = useCompetition();

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
  const [viewMode, setViewMode] = useState('podium'); // 'podium' (Modern Visual) | 'table' (Matriks Juknis)

  // Status visual efektif (Stage Mode selalu menggunakan dark theme)
  const effectiveDark = isStageMode || isDarkMode;

  // Otoritas & Publikasi
  const userRole = currentUser?.role || (currentTeam ? 'peserta' : (role || 'publik'));
  const isPeserta = userRole === 'peserta';
  const isStaffOrJury = !isPeserta && userRole !== 'publik' && ['admin', 'juri', 'superadmin', 'penginput', 'verifikator', 'finalisator'].includes(userRole);
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
          team: item.team,
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

  // Unified Ranking List untuk Podium 3D & Kartu Skor
  const currentRankingList = useMemo(() => {
    if (activeCategory === 'peleton') {
      return finalFilteredPeleton.map(item => ({
        rank: item.rank,
        title: item.title,
        team: item.team,
        schoolName: item.team.schoolName,
        mainTitle: item.team.schoolName,
        subTitle: item.team.dantonName ? `Danton: ${item.team.dantonName}` : (item.team.platoonName || 'Peleton PBB'),
        score: item.nilaiAkhirPeleton,
        scoreLabel: 'Nilai Akhir',
        subScore: `Murni: ${item.nilaiMurniPeleton} | Penalti: ${item.peletonPenalty}`
      }));
    } else if (activeCategory === 'danton') {
      return finalFilteredDanton.map(item => ({
        rank: item.rank,
        title: item.title,
        team: item.team,
        schoolName: item.team.schoolName,
        mainTitle: item.team.dantonName || 'Komandan Peleton',
        subTitle: item.team.schoolName,
        score: item.nilaiAkhirDanton,
        scoreLabel: 'Nilai Danton',
        subScore: `Murni: ${item.nilaiMurniDanton} | Penalti: ${item.dantonPenalty}`
      }));
    } else {
      return finalFilteredJuaraUmum.map((item, idx) => ({
        rank: item.rank || idx + 1,
        title: item.title,
        team: item.team || item.teams?.[0]?.team,
        schoolName: item.schoolName,
        mainTitle: item.schoolName,
        subTitle: `${item.teams?.length || 1} Peleton Kontingen`,
        score: item.totalPoints,
        scoreLabel: 'Poin Prestasi',
        subScore: `Peleton: ${item.totalPeletonPoints} pt | Danton: ${item.totalDantonPoints} pt`
      }));
    }
  }, [activeCategory, finalFilteredPeleton, finalFilteredDanton, finalFilteredJuaraUmum]);

  const currentPodiumData = useMemo(() => {
    return currentRankingList.slice(0, 3);
  }, [currentRankingList]);

  const remainingRankingList = useMemo(() => {
    return currentRankingList.slice(3);
  }, [currentRankingList]);

  const headerActions = (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      {/* Tombol Mode Layar Panggung (Khusus Panitia & Juri) */}
      {isStaffOrJury && (
        <button
          type="button"
          onClick={toggleStageMode}
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Layar Panggung</span>
        </button>
      )}

      {/* Tombol Regulasi Juknis */}
      <button
        type="button"
        onClick={() => setShowJuknisInfo(!showJuknisInfo)}
        className="px-3 py-1.5 sm:px-3 sm:py-2 border active:scale-95 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs bg-slate-100 hover:bg-slate-200/80 border-slate-200/80 text-slate-700 whitespace-nowrap"
      >
        <Info className="w-3.5 h-3.5 text-amber-600" />
        <span>Juknis</span>
        {showJuknisInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Tombol Toggle Dark / Light Mode */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className="px-2.5 sm:px-3 py-1.5 sm:py-2 border active:scale-95 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs bg-slate-100 hover:bg-slate-200/80 border-slate-200/80 text-slate-700 whitespace-nowrap"
        title={effectiveDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
      >
        {effectiveDark ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        <span className="hidden sm:inline">{effectiveDark ? 'Terang' : 'Gelap'}</span>
      </button>
    </div>
  );

  const stageHeaderBanner = (
    <div
      className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 transition-all ${
        effectiveDark
          ? 'bg-slate-900 border-slate-800 text-white shadow-lg'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${
          effectiveDark
            ? 'bg-white/10 border-white/20 text-amber-300 shadow-inner'
            : 'bg-amber-50 border-amber-200 text-amber-600 shadow-xs'
        }`}>
          <Trophy className="w-6 h-6 sm:w-9 sm:h-9" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
              effectiveDark
                ? 'text-amber-300 bg-amber-400/20 border-amber-300/30'
                : 'text-amber-800 bg-amber-50 border-amber-200 font-bold'
            }`}>
              Live Scoreboard Resmi
            </span>
            <span className={`text-[11px] sm:text-xs font-medium truncate ${
              effectiveDark ? 'text-white/80' : 'text-slate-500'
            }`}>{VENUE.NAME}</span>
          </div>
          <h1 className={`text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight mt-0.5 sm:mt-1 leading-tight ${
            effectiveDark ? 'text-white' : 'text-slate-900'
          }`}>
            Papan Klasemen &amp; Hasil Lomba
          </h1>
          <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none ${
            effectiveDark ? 'text-slate-300' : 'text-slate-500'
          }`}>
            Sistem penetapan Juara Utama, Harapan, Danton Terbaik &amp; Juara Umum mengacu pada Petunjuk Teknis Penilaian &amp; Kejuaraan LBB Mu'allimin 2027 (Bab A).
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-0.5 md:pt-0">
        <button
          type="button"
          onClick={toggleStageMode}
          className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs cursor-pointer active:scale-95 bg-amber-400 text-slate-950 hover:bg-amber-300"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>

        <button
          type="button"
          onClick={() => setShowJuknisInfo(!showJuknisInfo)}
          className="px-3 py-1.5 sm:px-3.5 sm:py-2.5 border active:scale-95 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-white/15 hover:bg-white/25 border-white/15 text-white"
        >
          <Info className="w-3.5 h-3.5 text-amber-300" />
          <span>Juknis</span>
          {showJuknisInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );

  const content = (
    <div className={`space-y-4 sm:space-y-5 ${effectiveDark ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* 1. Header Banner Khusus Mode Layar Panggung Fullscreen */}
      {isStageMode && stageHeaderBanner}

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
            <Award className={`w-5 h-5 ${effectiveDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <h3 className={`text-sm font-black uppercase tracking-wide ${effectiveDark ? 'text-amber-300' : 'text-amber-800'}`}>
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
              <div className={`font-bold flex items-center gap-1.5 ${effectiveDark ? 'text-amber-400' : 'text-amber-700'}`}>
                <Shield className={`w-4 h-4 ${effectiveDark ? 'text-red-400' : 'text-red-600'}`} />
                <span>1. Kejuaraan Peleton (Bab A.5)</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${effectiveDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
              <div className={`font-bold flex items-center gap-1.5 ${effectiveDark ? 'text-amber-400' : 'text-amber-700'}`}>
                <Medal className={`w-4 h-4 ${effectiveDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <span>2. Komandan Terbaik (Bab A.6)</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${effectiveDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
              <div className={`font-bold flex items-center gap-1.5 ${effectiveDark ? 'text-amber-400' : 'text-amber-700'}`}>
                <Crown className="w-4 h-4 text-amber-500" />
                <span>3. Piala Bergilir Juara Umum (Bab A.7 & 8)</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${effectiveDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Dihitung dari akumulasi poin prestasi per sekolah pada jenjang terkait:
              </p>
              <div
                className={`text-[10px] p-2 rounded-lg space-y-1 ${
                  effectiveDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <div><strong>Peleton:</strong> Juara 1=6 pt, 2=5 pt, 3=4 pt, H1=3 pt, H2=2 pt, H3=1 pt.</div>
                <div><strong>Danton:</strong> Juara 1=3 pt, 2=2 pt, 3=1 pt.</div>
                <div className={`font-bold ${effectiveDark ? 'text-amber-400' : 'text-amber-700'}`}>Total Poin = Poin Peleton + Poin Danton.</div>
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

          {/* View Mode Toggle: Podium 3D (Refrensi) vs Tabel Juknis */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              effectiveDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setViewMode('podium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'podium'
                  ? effectiveDark
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : effectiveDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Podium 3D & Kartu Skor"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Podium 3D</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? effectiveDark
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : effectiveDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Tabel Matriks Nilai Juknis"
            >
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span>Tabel Juknis</span>
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
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30 ${
              effectiveDark ? 'text-amber-400 bg-amber-500/15' : 'text-amber-800 bg-amber-100'
            }`}>
              Kerahasiaan Penjurian Resmi LBB 2027
            </span>
            <h3 className={`text-lg sm:text-xl font-black uppercase tracking-tight ${
              effectiveDark ? 'text-white' : 'text-slate-900'
            }`}>
              Hasil Klasemen & Skor Sementara Sedang Direkap
            </h3>
            <p className={`text-xs leading-relaxed ${
              effectiveDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Sesuai Juknis Bab A.9 & A.10, perolehan nilai sedang diverifikasi dalam Sidang Pleno Dewan Juri. Skor resmi akan ditampilkan secara transparan setelah penandatanganan Berita Acara Kejuaraan.
            </p>
          </div>
        </div>
      )}

            {/* 5. PODIUM 3D ISOMETRIK (Sesuai Referensi Gambar dengan Logo Sekolah) */}
      {isOfficialScoreVisible && currentPodiumData.length >= 3 && viewMode === 'podium' && (
        <div className="space-y-6">
          {/* STAGE PODIUM 3D */}
          <div className={`relative w-full rounded-3xl border p-4 sm:p-8 overflow-hidden shadow-xs transition-colors ${
            effectiveDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-slate-200/80'
          }`}>
            {/* Background Halo Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

            {/* SVG Linear Gradients untuk Top Face Isometrik */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
              <defs>
                <linearGradient id="goldTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="blueTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#eff6ff" />
                  <stop offset="50%" stopColor="#bfdbfe" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
                <linearGradient id="coralTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fff1f2" />
                  <stop offset="50%" stopColor="#fecdd3" />
                  <stop offset="100%" stopColor="#fda4af" />
                </linearGradient>
              </defs>
            </svg>

            {/* 3 Pillar Podium Stage */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-2xl mx-auto pt-6 pb-2 relative z-10">
              
              {/* RANK 2 (Perak / Soft Blue) - Kiri */}
              <div className="flex-1 max-w-[170px] flex flex-col items-center">
                {/* Floating Squircle Logo & Info */}
                <div className="flex flex-col items-center mb-2.5 text-center w-full">
                  <div className="relative mb-2">
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white shadow-md border border-slate-200/90 p-2 flex items-center justify-center relative hover:scale-105 transition-transform">
                      <SchoolLogo team={currentPodiumData[1].team} schoolName={currentPodiumData[1].schoolName} size="podium-md" />
                    </div>
                    <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-slate-300 text-slate-800 font-black text-[10px] shadow-xs flex items-center justify-center border-2 border-white">
                      2
                    </div>
                  </div>

                  <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 truncate w-full px-1" title={currentPodiumData[1].mainTitle}>
                    {currentPodiumData[1].mainTitle}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate w-full px-1 mt-0.5">
                    {currentPodiumData[1].subTitle}
                  </p>

                  <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-black font-mono shadow-2xs">
                    <span className="text-[10px]">💎</span>
                    <span>{currentPodiumData[1].score}</span>
                  </div>
                </div>

                {/* 3D Isometric Pillar 2 */}
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 100 24" className="w-full h-5 sm:h-7 block -mb-0.5" preserveAspectRatio="none">
                    <polygon points="12,0 88,0 100,24 0,24" fill="url(#blueTopGrad)" />
                  </svg>
                  <div className="w-full h-36 sm:h-44 bg-gradient-to-b from-blue-300 via-indigo-300 to-blue-400 rounded-b-2xl shadow-md border-x border-b border-blue-300/80 flex flex-col items-center justify-center text-white p-2">
                    <span className="text-[10px] tracking-widest text-white/90 font-mono mb-0.5">★★</span>
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 24 36" className="w-5 h-8 sm:w-6 sm:h-9 text-white/90 drop-shadow-sm" fill="currentColor">
                        <path d="M12 2C9 7 5 13 3 20c2 1 5 0 7-3-2 5-1 9 1 13 2-3 4-8 4-13-1-3-2-6-4-17z" />
                        <path d="M17 12c-2 4-5 8-7 12 2 1 4 0 5-2-1 3-1 6 1 9 1-2 3-5 3-8 0-2-1-4-2-11z" opacity="0.7" />
                      </svg>
                      <span className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white px-1 drop-shadow-md">
                        2
                      </span>
                      <svg viewBox="0 0 24 36" className="w-5 h-8 sm:w-6 sm:h-9 text-white/90 drop-shadow-sm scale-x-[-1]" fill="currentColor">
                        <path d="M12 2C9 7 5 13 3 20c2 1 5 0 7-3-2 5-1 9 1 13 2-3 4-8 4-13-1-3-2-6-4-17z" />
                        <path d="M17 12c-2 4-5 8-7 12 2 1 4 0 5-2-1 3-1 6 1 9 1-2 3-5 3-8 0-2-1-4-2-11z" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* RANK 1 (Emas / Juara 1) - Tengah (Tertinggi) */}
              <div className="flex-1 max-w-[210px] flex flex-col items-center">
                {/* Floating Squircle Logo & Info */}
                <div className="flex flex-col items-center mb-3 text-center w-full">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-2xl bg-white shadow-xl border-2 border-amber-300 p-2 flex items-center justify-center relative hover:scale-105 transition-transform">
                      <SchoolLogo team={currentPodiumData[0].team} schoolName={currentPodiumData[0].schoolName} size="podium-lg" />
                    </div>
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-md flex items-center gap-1 border-2 border-white">
                      <Crown className="w-3 h-3 text-slate-950" />
                      <span>JUARA 1</span>
                    </div>
                  </div>

                  <h4 className="font-black text-sm sm:text-base text-slate-900 truncate w-full px-1" title={currentPodiumData[0].mainTitle}>
                    {currentPodiumData[0].mainTitle}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 font-medium truncate w-full px-1 mt-0.5">
                    {currentPodiumData[0].subTitle}
                  </p>

                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs sm:text-sm font-black font-mono shadow-sm border border-amber-300">
                    <span>💎</span>
                    <span>{currentPodiumData[0].score}</span>
                  </div>
                </div>

                {/* 3D Isometric Pillar 1 */}
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 100 24" className="w-full h-6 sm:h-8 block -mb-0.5" preserveAspectRatio="none">
                    <polygon points="12,0 88,0 100,24 0,24" fill="url(#goldTopGrad)" />
                  </svg>
                  <div className="w-full h-48 sm:h-60 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-2xl shadow-xl border-x border-b border-amber-400/80 flex flex-col items-center justify-center text-white p-2">
                    <span className="text-xs tracking-widest text-amber-100 font-mono mb-0.5">★★★</span>
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 24 36" className="w-6 h-9 sm:w-7 sm:h-11 text-white/95 drop-shadow-sm" fill="currentColor">
                        <path d="M12 2C9 7 5 13 3 20c2 1 5 0 7-3-2 5-1 9 1 13 2-3 4-8 4-13-1-3-2-6-4-17z" />
                        <path d="M17 12c-2 4-5 8-7 12 2 1 4 0 5-2-1 3-1 6 1 9 1-2 3-5 3-8 0-2-1-4-2-11z" opacity="0.7" />
                      </svg>
                      <span className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white px-1 sm:px-2 drop-shadow-lg">
                        1
                      </span>
                      <svg viewBox="0 0 24 36" className="w-6 h-9 sm:w-7 sm:h-11 text-white/95 drop-shadow-sm scale-x-[-1]" fill="currentColor">
                        <path d="M12 2C9 7 5 13 3 20c2 1 5 0 7-3-2 5-1 9 1 13 2-3 4-8 4-13-1-3-2-6-4-17z" />
                        <path d="M17 12c-2 4-5 8-7 12 2 1 4 0 5-2-1 3-1 6 1 9 1-2 3-5 3-8 0-2-1-4-2-11z" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* RANK 3 (Perunggu / Soft Coral) - Kanan */}
              <div className="flex-1 max-w-[170px] flex flex-col items-center">
                {/* Floating Squircle Logo & Info */}
                <div className="flex flex-col items-center mb-2.5 text-center w-full">
                  <div className="relative mb-2">
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white shadow-md border border-slate-200/90 p-2 flex items-center justify-center relative hover:scale-105 transition-transform">
                      <SchoolLogo team={currentPodiumData[2].team} schoolName={currentPodiumData[2].schoolName} size="podium-md" />
                    </div>
                    <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-rose-400 text-white font-black text-[10px] shadow-xs flex items-center justify-center border-2 border-white">
                      3
                    </div>
                  </div>

                  <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 truncate w-full px-1" title={currentPodiumData[2].mainTitle}>
                    {currentPodiumData[2].mainTitle}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate w-full px-1 mt-0.5">
                    {currentPodiumData[2].subTitle}
                  </p>

                  <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-black font-mono shadow-2xs">
                    <span className="text-[10px]">💎</span>
                    <span>{currentPodiumData[2].score}</span>
                  </div>
                </div>

                {/* 3D Isometric Pillar 3 */}
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 100 24" className="w-full h-4 sm:h-6 block -mb-0.5" preserveAspectRatio="none">
                    <polygon points="12,0 88,0 100,24 0,24" fill="url(#coralTopGrad)" />
                  </svg>
                  <div className="w-full h-28 sm:h-36 bg-gradient-to-b from-orange-300 via-rose-300 to-amber-500 rounded-b-2xl shadow-md border-x border-b border-orange-300/80 flex flex-col items-center justify-center text-white p-2">
                    <span className="text-[10px] tracking-widest text-white/90 font-mono mb-0.5">★</span>
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 24 36" className="w-5 h-8 sm:w-6 sm:h-9 text-white/90 drop-shadow-sm" fill="currentColor">
                        <path d="M12 2C9 7 5 13 3 20c2 1 5 0 7-3-2 5-1 9 1 13 2-3 4-8 4-13-1-3-2-6-4-17z" />
                        <path d="M17 12c-2 4-5 8-7 12 2 1 4 0 5-2-1 3-1 6 1 9 1-2 3-5 3-8 0-2-1-4-2-11z" opacity="0.7" />
                      </svg>
                      <span className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white px-1 drop-shadow-md">
                        3
                      </span>
                      <svg viewBox="0 0 24 36" className="w-5 h-8 sm:w-6 sm:h-9 text-white/90 drop-shadow-sm scale-x-[-1]" fill="currentColor">
                        <path d="M12 2C9 7 5 13 3 20c2 1 5 0 7-3-2 5-1 9 1 13 2-3 4-8 4-13-1-3-2-6-4-17z" />
                        <path d="M17 12c-2 4-5 8-7 12 2 1 4 0 5-2-1 3-1 6 1 9 1-2 3-5 3-8 0-2-1-4-2-11z" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Status Timestamp Pill (persis Image 1) */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100/80 mt-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Papan Klasemen Resmi • Rekapitulasi Berita Acara Dewan Juri Realtime</span>
            </div>
          </div>

          {/* LIST KARTU SKOR (RANK 4 KE BAWAH - SESUAI GAMBAR 1 & GAMBAR 2) */}
          <div className="space-y-2.5 max-w-3xl mx-auto">
            <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Papan Peringkat Lengkap</span>
              </span>
              <span>{currentRankingList.length} Kontingen Terdata</span>
            </div>

            {currentRankingList.map((item) => {
              const isMyTeam = (currentTeam?.id && item.team?.id === currentTeam.id) || (currentUser?.teamId && item.team?.id === currentUser.teamId);
              const isTop3 = item.rank <= 3;

              return (
                <div
                  key={item.team?.id || item.schoolName}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                    isMyTeam
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/50 shadow-xs'
                      : item.rank === 1
                      ? 'bg-gradient-to-r from-amber-50/70 via-yellow-50/40 to-white border-amber-300'
                      : item.rank === 2
                      ? 'bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border-blue-200'
                      : item.rank === 3
                      ? 'bg-gradient-to-r from-orange-50/70 via-rose-50/40 to-white border-orange-200'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Rank Number Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-2xs'
                        : item.rank === 2
                        ? 'bg-slate-300 text-slate-900 shadow-2xs'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isTop3 ? (
                        item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        item.rank
                      )}
                    </div>

                    {/* School Logo Squircle (Menggantikan Memoji persis instruksi) */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <SchoolLogo team={item.team} schoolName={item.schoolName} size="table" />
                    </div>

                    {/* Info Tim & Sekolah */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                          {item.mainTitle || item.team?.schoolName || item.schoolName}
                        </h4>
                        {isMyTeam && (
                          <span className="px-1.5 py-0.2 rounded font-black text-[9px] bg-emerald-600 text-white shadow-xs shrink-0 uppercase tracking-wider">
                            Peleton Anda
                          </span>
                        )}
                        {item.team?.lotNumber && (
                          <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                            TM #{String(item.team.lotNumber).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subTitle}
                      </p>
                    </div>
                  </div>

                  {/* Nilai Akhir / Poin di Sisi Kanan (Font Besar Sesuai Gambar 1 & 2) */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 font-mono font-black text-base sm:text-lg text-slate-900">
                      <span className="text-amber-500 text-xs">💎</span>
                      <span>{item.score}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.subScore || item.scoreLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TABEL HASIL & KLASEMEN RESMI (Tampil saat viewMode === 'table') */}
      {viewMode === 'table' && (
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
                  <th className="py-3.5 px-3 text-center w-20">No. Dada</th>
                  <th className="py-3.5 px-4">Peleton & Pangkalan Sekolah</th>
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
                      <th className={`py-3.5 px-3 text-center w-20 font-bold ${
                        effectiveDark ? 'text-rose-400' : 'text-rose-600'
                      }`}>Penalti</th>
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
                    <td colSpan={isOfficialScoreVisible ? 9 : 3} className="py-8 text-center text-slate-400">
                      Belum ada peleton pada filter ini.
                    </td>
                  </tr>
                ) : (
                  finalFilteredPeleton.map(item => {
                    const isTop3 = isOfficialScoreVisible && item.rank <= 3;
                    const isMyTeam = (currentTeam?.id && item.team.id === currentTeam.id) || (currentUser?.teamId && item.team.id === currentUser.teamId);
                    const j1 = item.j1Peleton > 0 ? item.j1Peleton : '-';
                    const j2 = item.j2Peleton > 0 ? item.j2Peleton : '-';
                    const j3 = item.j3Peleton > 0 ? item.j3Peleton : '-';
                    const murni = item.nilaiMurniPeleton > 0 ? item.nilaiMurniPeleton : '-';
                    const akhir = item.nilaiAkhirPeleton > 0 ? item.nilaiAkhirPeleton : '-';
                    const penalty = item.peletonPenalty || 0;
                    const chestNumber = item.team.chestNumber || (item.team.lotNumber ? getChestNumberByLot(item.team.jenjang, item.team.lotNumber) : '') || '--';

                    return (
                      <tr
                        key={item.team.id}
                        className={`transition-colors ${
                          isMyTeam
                            ? effectiveDark
                              ? 'bg-emerald-950/40 ring-1 ring-emerald-500/50 hover:bg-emerald-950/50 font-bold'
                              : 'bg-emerald-50/70 border-l-4 border-l-emerald-600 hover:bg-emerald-50 font-bold'
                            : isTop3
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
                                <span className={`text-[10px] font-black mt-0.5 whitespace-nowrap ${
                                  effectiveDark ? 'text-amber-400' : 'text-amber-700'
                                }`}>
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 2 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  2
                                </span>
                                <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${
                                  effectiveDark ? 'text-slate-200' : 'text-slate-800'
                                }`}>
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 3 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  3
                                </span>
                                <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${
                                  effectiveDark ? 'text-amber-400' : 'text-amber-800'
                                }`}>
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 3 && (
                              item.shortTitle ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className={`w-5 h-5 rounded-full font-bold text-[11px] inline-flex items-center justify-center ${
                                    effectiveDark
                                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}>
                                    {item.rank}
                                  </span>
                                  <span className={`text-[9px] font-bold mt-0.5 whitespace-nowrap ${
                                    effectiveDark ? 'text-emerald-400' : 'text-emerald-800'
                                  }`}>
                                    {item.shortTitle}
                                  </span>
                                </div>
                              ) : (
                                <span className={`font-mono font-bold text-xs ${
                                  effectiveDark ? 'text-slate-500' : 'text-slate-400'
                                }`}>
                                  {item.rank}
                                </span>
                              )
                            )}
                          </td>
                        )}
                        <td
                          className={`py-3.5 px-3 text-center font-mono font-bold ${
                            effectiveDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {chestNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <SchoolLogo
                              team={item.team}
                              schoolName={item.team.schoolName}
                              size="table"
                              isDark={effectiveDark}
                            />
                            <div className="min-w-0">
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
                                Danton: {item.team.dantonName || '-'}
                              </div>
                            </div>
                          </div>
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
                            <td className={`py-3.5 px-3 text-center font-mono font-bold ${
                              effectiveDark ? 'text-rose-400' : 'text-rose-600'
                            }`}>
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
                  <th className="py-3.5 px-3 text-center w-20">No. Dada</th>
                  <th className="py-3.5 px-4">Nama Komandan (Danton)</th>
                  <th className="py-3.5 px-4">Pangkalan Sekolah</th>
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
                      <th className={`py-3.5 px-3 text-center w-20 font-bold ${
                        effectiveDark ? 'text-rose-400' : 'text-rose-600'
                      }`}>Penalti</th>
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
                    <td colSpan={isOfficialScoreVisible ? 10 : 4} className="py-8 text-center text-slate-400">
                      Belum ada data danton pada filter ini.
                    </td>
                  </tr>
                ) : (
                  finalFilteredDanton.map(item => {
                    const isTop3 = isOfficialScoreVisible && item.rank <= 3;
                    const isMyTeam = (currentTeam?.id && item.team.id === currentTeam.id) || (currentUser?.teamId && item.team.id === currentUser.teamId);
                    const j1 = item.j1Danton > 0 ? item.j1Danton : '-';
                    const j2 = item.j2Danton > 0 ? item.j2Danton : '-';
                    const j3 = item.j3Danton > 0 ? item.j3Danton : '-';
                    const murni = item.nilaiMurniDanton > 0 ? item.nilaiMurniDanton : '-';
                    const akhir = item.nilaiAkhirDanton > 0 ? item.nilaiAkhirDanton : '-';
                    const penalty = item.dantonPenalty || 0;
                    const chestNumber = item.team.chestNumber || (item.team.lotNumber ? getChestNumberByLot(item.team.jenjang, item.team.lotNumber) : '') || '--';

                    return (
                      <tr
                        key={item.team.id}
                        className={`transition-colors ${
                          isMyTeam
                            ? effectiveDark
                              ? 'bg-emerald-950/40 ring-1 ring-emerald-500/50 hover:bg-emerald-950/50 font-bold'
                              : 'bg-emerald-50/70 border-l-4 border-l-emerald-600 hover:bg-emerald-50 font-bold'
                            : isTop3
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
                                <span className={`text-[10px] font-black mt-0.5 whitespace-nowrap ${
                                  effectiveDark ? 'text-amber-400' : 'text-amber-700'
                                }`}>
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 2 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  2
                                </span>
                                <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${
                                  effectiveDark ? 'text-slate-200' : 'text-slate-800'
                                }`}>
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 3 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                                  3
                                </span>
                                <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${
                                  effectiveDark ? 'text-amber-400' : 'text-amber-800'
                                }`}>
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 3 && (
                              item.shortTitle ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className={`w-5 h-5 rounded-full font-bold text-[11px] inline-flex items-center justify-center ${
                                    effectiveDark
                                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}>
                                    {item.rank}
                                  </span>
                                  <span className={`text-[9px] font-bold mt-0.5 whitespace-nowrap ${
                                    effectiveDark ? 'text-emerald-400' : 'text-emerald-800'
                                  }`}>
                                    {item.shortTitle}
                                  </span>
                                </div>
                              ) : (
                                <span className={`font-mono font-bold text-xs ${
                                  effectiveDark ? 'text-slate-500' : 'text-slate-400'
                                }`}>
                                  {item.rank}
                                </span>
                              )
                            )}
                          </td>
                        )}
                        <td
                          className={`py-3.5 px-3 text-center font-mono font-bold ${
                            effectiveDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {chestNumber}
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
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <SchoolLogo
                              team={item.team}
                              schoolName={item.team.schoolName}
                              size="table"
                              isDark={effectiveDark}
                            />
                            <span
                              className={`font-semibold ${
                                effectiveDark ? 'text-slate-200' : 'text-slate-800'
                              }`}
                            >
                              {item.team.schoolName}
                            </span>
                          </div>
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
                            <td className={`py-3.5 px-3 text-center font-mono font-bold ${
                              effectiveDark ? 'text-rose-400' : 'text-rose-600'
                            }`}>
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
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada data akumulasi poin sekolah.
                    </td>
                  </tr>
                ) : (
                  finalFilteredJuaraUmum.map(sch => {
                    const isChampion = sch.rank === 1;
                    const isMySchool = currentTeam?.schoolName && sch.schoolName?.toLowerCase() === currentTeam.schoolName?.toLowerCase();

                    return (
                      <tr
                        key={`${sch.jenjang}_${sch.schoolName}`}
                        className={`transition-colors ${
                          isMySchool
                            ? effectiveDark
                              ? 'bg-emerald-950/40 ring-1 ring-emerald-500/50 hover:bg-emerald-950/50 font-bold'
                              : 'bg-emerald-50/70 border-l-4 border-l-emerald-600 hover:bg-emerald-50 font-bold'
                            : isChampion
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
                              <span className={`text-[10px] font-black mt-0.5 whitespace-nowrap ${
                                effectiveDark ? 'text-amber-400' : 'text-amber-700'
                              }`}>
                                Juara Umum
                              </span>
                            </div>
                          )}
                          {sch.rank === 2 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                                2
                              </span>
                              <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${
                                effectiveDark ? 'text-slate-200' : 'text-slate-800'
                              }`}>
                                Runner-Up 1
                              </span>
                            </div>
                          )}
                          {sch.rank === 3 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                                3
                              </span>
                              <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${
                                effectiveDark ? 'text-amber-400' : 'text-amber-800'
                              }`}>
                                Runner-Up 2
                              </span>
                            </div>
                          )}
                          {sch.rank > 3 && (
                            <span className={`font-mono font-bold text-xs ${
                              effectiveDark ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {sch.rank}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <SchoolLogo
                              team={sch.team || sch.teams?.[0]?.team}
                              schoolName={sch.schoolName}
                              size="table"
                              isDark={effectiveDark}
                            />
                            <div className="min-w-0">
                              <div
                                className={`font-bold text-sm ${
                                  effectiveDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {sch.schoolName}
                              </div>
                              <div
                                className={`text-[11px] font-normal ${
                                  effectiveDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                Perwakilan: {sch.teams.length} Peleton
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          {sch.peletonAchievements.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {sch.peletonAchievements.map((ach, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${
                                    effectiveDark
                                      ? 'bg-slate-800/90 border-slate-700 text-slate-200'
                                      : 'bg-white border-slate-200 shadow-2xs text-slate-800'
                                  }`}
                                >
                                  <Shield className={`w-3.5 h-3.5 shrink-0 ${effectiveDark ? 'text-red-400' : 'text-red-600'}`} />
                                  <span className="font-bold">{ach.platoonName}</span>
                                  <span className={`font-medium ${effectiveDark ? 'text-slate-400' : 'text-slate-500'}`}>({ach.shortTitle})</span>
                                  <span className={`font-mono font-black text-[10px] px-1.5 py-0.5 rounded border ${
                                    effectiveDark ? 'text-amber-300 bg-amber-400/20 border-amber-400/30' : 'text-amber-800 bg-amber-100 border-amber-300'
                                  }`}>
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
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${
                                    effectiveDark
                                      ? 'bg-slate-800/90 border-slate-700 text-slate-200'
                                      : 'bg-white border-slate-200 shadow-2xs text-slate-800'
                                  }`}
                                >
                                  <Medal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span className="font-bold">{ach.dantonName}</span>
                                  <span className={`font-medium ${effectiveDark ? 'text-slate-400' : 'text-slate-500'}`}>({ach.shortTitle})</span>
                                  <span className={`font-mono font-black text-[10px] px-1.5 py-0.5 rounded border ${
                                    effectiveDark ? 'text-amber-300 bg-amber-400/20 border-amber-400/30' : 'text-amber-800 bg-amber-100 border-amber-300'
                                  }`}>
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
      )}
    </div>
  );

  // Jika Mode Layar Panggung (Fullscreen)
  if (isStageMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 lg:p-12 font-sans">
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
      rightActions={headerActions}
    >
      <div className={effectiveDark ? 'bg-slate-950 text-slate-100 rounded-2xl p-4 sm:p-6 transition-colors' : ''}>
        {content}
      </div>
    </SimpaskorSidebarLayout>
  );
}
