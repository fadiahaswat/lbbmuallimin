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
  Moon,
  FileSpreadsheet,
  ShieldCheck,
  User,
  X
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
    sizeClasses = 'w-full h-full';
    fontClasses = `text-lg sm:text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-900'}`;
  } else if (size === 'podium-md') {
    sizeClasses = 'w-full h-full';
    fontClasses = `text-sm sm:text-xl font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
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
      className={`${sizeClasses} rounded-2xl shrink-0 flex items-center justify-center font-black select-none shadow-xs transition-all ${
        isDark
          ? 'bg-gradient-to-br from-slate-800 to-slate-950 text-amber-300 border border-slate-700/80 shadow-inner'
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-200/50 shadow-sm'
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
      const j1Mat = Number(juries.pos1?.dantonRubricScores?.materi || 0);
      const j2Mat = Number(juries.pos2?.dantonRubricScores?.materi || 0);
      const j3Mat = Number(juries.pos3?.dantonRubricScores?.materi || 0);
      const dantonMateri = (j1Mat + j2Mat + j3Mat) > 0
        ? (j1Mat + j2Mat + j3Mat)
        : Number(s.danton?.rubricScores?.materi ?? 0);

      const j1Vok = Number(juries.pos1?.dantonRubricScores?.vokal || 0);
      const j2Vok = Number(juries.pos2?.dantonRubricScores?.vokal || 0);
      const j3Vok = Number(juries.pos3?.dantonRubricScores?.vokal || 0);
      const dantonVokal = (j1Vok + j2Vok + j3Vok) > 0
        ? (j1Vok + j2Vok + j3Vok)
        : Number(s.danton?.rubricScores?.vokal ?? 0);

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

      // Juknis Bab A.8: Tie-breaker Juara Umum mengacu pada peleton terbaik milik sekolah tersebut
      const isBetterPlatoon =
        !sch.bestPlatoon ||
        item.nilaiAkhirPeleton > sch.bestPlatoon.nilaiAkhirPeleton ||
        (item.nilaiAkhirPeleton === sch.bestPlatoon.nilaiAkhirPeleton && item.nilaiMurniPeleton > sch.bestPlatoon.nilaiMurniPeleton) ||
        (item.nilaiAkhirPeleton === sch.bestPlatoon.nilaiAkhirPeleton && item.nilaiMurniPeleton === sch.bestPlatoon.nilaiMurniPeleton && item.peletonPenalty < sch.bestPlatoon.peletonPenalty);

      if (isBetterPlatoon) {
        sch.bestPlatoon = item;
        sch.bestMurniPeleton = item.nilaiMurniPeleton;
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

  const currentHarapanPodiumData = useMemo(() => {
    // Podium Juara Harapan hanya berlaku untuk Kategori Peleton (PBB)
    if (activeCategory !== 'peleton') return [];
    return currentRankingList.slice(3, 6);
  }, [currentRankingList, activeCategory]);

  const remainingRankingList = useMemo(() => {
    if (viewMode === 'podium' && activeCategory === 'peleton' && currentRankingList.length >= 6 && !searchQuery) {
      return currentRankingList.slice(6);
    }
    return currentRankingList.slice(3);
  }, [currentRankingList, viewMode, searchQuery, activeCategory]);

  const headerActions = (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      {/* Tombol Info Kriteria Juara Resmi (Bisa diakses oleh semua: Peserta, Publik & Panitia) */}
      <button
        type="button"
        onClick={() => setShowJuknisInfo(!showJuknisInfo)}
        className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-2xs border ${
          showJuknisInfo
            ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/90'
        }`}
        title="Buka / Tutup Ringkasan Regulasi & Kriteria Juara Juknis 2027"
      >
        <Award className={`w-3.5 h-3.5 ${showJuknisInfo ? 'text-white' : 'text-amber-500'}`} />
        <span>Kriteria Juara</span>
        {showJuknisInfo ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-80" />}
      </button>

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
        className={`p-4 sm:p-5 rounded-[24px] border shadow-[0_12px_32px_rgba(15,23,42,0.04)] space-y-3.5 transition-colors ${
          effectiveDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
          {/* Kiri: Switch Kategori Kejuaraan (Peleton, Danton, Juara Umum) */}
          <div className={`inline-flex p-1 rounded-2xl border gap-1 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] max-w-full ${
            effectiveDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-200/80'
          }`}>
            <button
              type="button"
              onClick={() => setActiveCategory('peleton')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'peleton'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xs'
                  : effectiveDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>Kategori Peleton (PBB)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('danton')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'danton'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                  : effectiveDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>Danton Terbaik</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('juara_umum')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'juara_umum'
                  ? effectiveDark
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-950 text-white shadow-xs'
                  : effectiveDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span>Klasemen Juara Umum</span>
            </button>
          </div>

          {/* Kanan: Switch Jenjang + View Mode + Search Box */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              {/* Switch Jenjang Khusus: SD/MI & SMP/MTs */}
              <div
                className={`flex items-center justify-center gap-1 p-1 rounded-xl border ${
                  effectiveDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-slate-100 border-slate-200/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedJenjang('SD')}
                  className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    selectedJenjang === 'SD'
                      ? effectiveDark
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : effectiveDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selectedJenjang === 'SD' ? 'bg-red-600' : 'bg-slate-400'}`} />
                  <span>SD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedJenjang('SMP')}
                  className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    selectedJenjang === 'SMP'
                      ? effectiveDark
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : effectiveDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selectedJenjang === 'SMP' ? 'bg-blue-600' : 'bg-slate-400'}`} />
                  <span>SMP</span>
                </button>
              </div>

              {/* View Mode Toggle: Podium Juara vs Tabel Juknis */}
              <div
                className={`flex items-center justify-center gap-1 p-1 rounded-xl border ${
                  effectiveDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-slate-100 border-slate-200/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('podium')}
                  className={`flex-1 sm:flex-none justify-center px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                    viewMode === 'podium'
                      ? effectiveDark
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : effectiveDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilan Podium Juara & Peringkat"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Podium</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex-1 sm:flex-none justify-center px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                    viewMode === 'table'
                      ? effectiveDark
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : effectiveDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilan Tabel Juknis Lengkap"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tabel</span>
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-auto min-w-[200px] flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari sekolah / danton..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                  effectiveDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                    : 'bg-slate-50 border-slate-200/90 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
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

            {/* 5. GRAND CHAMPIONSHIP PODIUM STAGE */}
      {isOfficialScoreVisible && currentPodiumData.length >= 3 && viewMode === 'podium' && (
        <div className="space-y-6">
          {/* STAGE PODIUM JUARA */}
          <div className={`relative w-full rounded-[28px] border p-3 sm:p-7 md:p-9 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all ${
            effectiveDark
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800'
              : 'bg-gradient-to-b from-amber-50/50 via-white to-slate-50 border-slate-200/90'
          }`}>
            {/* Radial ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/25 via-amber-100/10 to-transparent pointer-events-none" />

            {/* Championship Kicker */}
            <div className="text-center relative z-10 mb-4 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] bg-amber-100/80 text-amber-900 border border-amber-300/80 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>PODIUM UTAMA KEJUARAAN • JENJANG {selectedJenjang}</span>
              </span>
              <h3 className={`mt-1.5 sm:mt-2 text-base sm:text-2xl font-black uppercase tracking-tight ${
                effectiveDark ? 'text-white' : 'text-slate-950'
              }`}>
                {activeCategory === 'peleton' && 'Peleton Terbaik'}
                {activeCategory === 'danton' && 'Komandan Peleton (Danton) Terbaik'}
                {activeCategory === 'juara_umum' && 'Klasemen Juara Umum Bergilir'}
              </h3>
            </div>

            {/* 3 Pedestal Stage */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-5 max-w-3xl mx-auto items-end pt-3 sm:pt-6 relative z-10">

              {/* ========================================= */}
              {/* RANK 2: PERAK / PLATINUM (KIRI)           */}
              {/* ========================================= */}
              <div className="flex flex-col items-center">
                {/* Top Avatar & Identity */}
                <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mb-1.5 sm:mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                    <SchoolLogo team={currentPodiumData[1].team} schoolName={currentPodiumData[1].schoolName} size="podium-md" />
                  </div>

                  <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 min-h-[2.4em] leading-tight w-full px-0.5 break-words ${
                    effectiveDark ? 'text-white' : 'text-slate-900'
                  }`} title={currentPodiumData[1].mainTitle}>
                    {currentPodiumData[1].mainTitle}
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 truncate w-full px-0.5 mt-0.5">
                    {currentPodiumData[1].subTitle}
                  </p>

                  <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900 text-white shadow-xs border border-slate-400/30">
                    <span className="text-[10.5px] sm:text-xs font-mono font-black text-slate-200">{currentPodiumData[1].score}</span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                  </div>
                </div>

                {/* Architectural Pedestal #2 */}
                <div className="w-full h-32 sm:h-48 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-t-4 border-white shadow-[0_16px_36px_rgba(148,163,184,0.35)] flex flex-col items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <span className="text-[8px] sm:text-[10px] tracking-widest text-slate-600 font-black">★★</span>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-6xl font-black font-sans text-white tracking-tight drop-shadow-[0_2px_4px_rgba(71,85,105,0.4)]">
                      2
                    </span>
                    <span className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-800 bg-white/90 px-1.5 sm:px-2.5 py-0.5 rounded-full mt-0.5 sm:mt-1 shadow-2xs whitespace-nowrap">
                      JUARA 2
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================= */}
              {/* RANK 1: EMAS / GOLD CHAMPION (TENGAH)     */}
              {/* ========================================= */}
              <div className="flex flex-col items-center -mt-3 sm:-mt-6">
                {/* Top Avatar & Identity */}
                <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                  <div className="w-18 h-18 sm:w-26 sm:h-26 mb-1.5 sm:mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                    <SchoolLogo team={currentPodiumData[0].team} schoolName={currentPodiumData[0].schoolName} size="podium-lg" />
                  </div>

                  <h4 className={`font-black text-xs sm:text-sm md:text-base line-clamp-2 min-h-[2.4em] leading-tight w-full px-0.5 break-words ${
                    effectiveDark ? 'text-white' : 'text-slate-950'
                  }`} title={currentPodiumData[0].mainTitle}>
                    {currentPodiumData[0].mainTitle}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-1 truncate w-full px-0.5 mt-0.5">
                    {currentPodiumData[0].subTitle}
                  </p>

                  <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-slate-950 text-white shadow-md border border-amber-400/50">
                    <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                    <span className="text-[11px] sm:text-sm font-mono font-black text-amber-300">{currentPodiumData[0].score}</span>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-300">Poin</span>
                  </div>
                </div>

                {/* Architectural Pedestal #1 (Tertinggi) */}
                <div className="w-full h-44 sm:h-64 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-t-4 border-amber-100 shadow-[0_20px_50px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 p-2 sm:p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                  <span className="text-[9px] sm:text-xs tracking-widest text-amber-950/80 font-black">★★★</span>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-7xl font-black font-sans text-white tracking-tight drop-shadow-[0_4px_8px_rgba(180,83,9,0.5)]">
                      1
                    </span>
                    <span className="text-[8px] sm:text-[11px] font-black uppercase tracking-wider text-slate-950 bg-white/95 px-2 sm:px-3 py-0.5 rounded-full mt-0.5 sm:mt-1 shadow-xs whitespace-nowrap">
                      JUARA 1 UTAMA
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================= */}
              {/* RANK 3: PERUNGGU / BRONZE (KANAN)         */}
              {/* ========================================= */}
              <div className="flex flex-col items-center">
                {/* Top Avatar & Identity */}
                <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mb-1.5 sm:mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                    <SchoolLogo team={currentPodiumData[2].team} schoolName={currentPodiumData[2].schoolName} size="podium-md" />
                  </div>

                  <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 min-h-[2.4em] leading-tight w-full px-0.5 break-words ${
                    effectiveDark ? 'text-white' : 'text-slate-900'
                  }`} title={currentPodiumData[2].mainTitle}>
                    {currentPodiumData[2].mainTitle}
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 truncate w-full px-0.5 mt-0.5">
                    {currentPodiumData[2].subTitle}
                  </p>

                  <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900 text-white shadow-xs border border-amber-600/40">
                    <span className="text-[10.5px] sm:text-xs font-mono font-black text-amber-300">{currentPodiumData[2].score}</span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                  </div>
                </div>

                {/* Architectural Pedestal #3 */}
                <div className="w-full h-28 sm:h-40 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-amber-600 via-orange-500 to-amber-700 border-t-4 border-orange-300/90 shadow-[0_14px_35px_rgba(194,65,12,0.3)] flex flex-col items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <span className="text-[8px] sm:text-[10px] tracking-widest text-amber-200 font-black">★</span>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-6xl font-black font-sans text-white tracking-tight drop-shadow-[0_2px_4px_rgba(154,52,18,0.4)]">
                      3
                    </span>
                    <span className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-200 px-1.5 sm:px-2.5 py-0.5 rounded-full mt-0.5 sm:mt-1 shadow-2xs whitespace-nowrap">
                      JUARA 3
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Stage Base Plinth */}
            <div className={`max-w-3xl mx-auto h-2.5 sm:h-3.5 rounded-b-xl sm:rounded-b-2xl shadow-xs border-t ${
              effectiveDark
                ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-slate-700/60'
                : 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 border-slate-300/60'
            }`} />

            {/* Status Timestamp Footer Badge */}
            <div className="flex items-center justify-center pt-4 sm:pt-5">
              <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border shadow-2xs transition-colors ${
                effectiveDark
                  ? 'bg-slate-900/80 text-slate-400 border-slate-800'
                  : 'bg-white/80 text-slate-500 border-slate-200/80'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-center leading-tight">
                  Papan Klasemen Sah Berdasarkan Berita Acara Rekapitulasi Dewan Juri LBB 2027
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STAGE PODIUM JUARA HARAPAN (HARAPAN 1, 2, 3 - RANK 4, 5, 6) */}
          {/* ======================================================== */}
          {isOfficialScoreVisible && currentHarapanPodiumData.length === 3 && viewMode === 'podium' && !searchQuery && (
            <div className={`relative w-full rounded-[26px] border p-3.5 sm:p-6 md:p-8 overflow-hidden shadow-xs transition-all ${
              effectiveDark
                ? 'bg-gradient-to-b from-slate-900/90 via-slate-900 to-slate-950 border-slate-800'
                : 'bg-gradient-to-b from-sky-50/40 via-white to-slate-50 border-slate-200/90'
            }`}>
              {/* Radial ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/15 via-blue-200/5 to-transparent pointer-events-none" />

              {/* Championship Kicker */}
              <div className="text-center relative z-10 mb-3 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.18em] bg-sky-100/90 text-sky-900 border border-sky-200 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>PODIUM JUARA HARAPAN • JENJANG {selectedJenjang}</span>
                </span>
                <h3 className={`mt-1.5 text-base sm:text-xl font-black uppercase tracking-tight ${
                  effectiveDark ? 'text-white' : 'text-slate-950'
                }`}>
                  Juara Harapan 1, 2, & 3
                </h3>
              </div>

              {/* 3 Pedestal Stage for Harapan */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-4 max-w-2xl mx-auto items-end pt-2 sm:pt-4 relative z-10">
                {/* HARAPAN 2 (#5) - KIRI */}
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2 sm:mb-2.5 text-center w-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-1.5 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentHarapanPodiumData[1].team} schoolName={currentHarapanPodiumData[1].schoolName} size="table" isDark={effectiveDark} />
                    </div>
                    <h4 className={`font-black text-[10.5px] sm:text-xs line-clamp-2 min-h-[2.4em] leading-tight w-full px-0.5 break-words ${
                      effectiveDark ? 'text-white' : 'text-slate-900'
                    }`} title={currentHarapanPodiumData[1].mainTitle}>
                      {currentHarapanPodiumData[1].mainTitle}
                    </h4>
                    <p className="text-[9px] sm:text-[10.5px] text-slate-500 line-clamp-1 truncate w-full px-0.5 mt-0.5 font-medium">
                      {currentHarapanPodiumData[1].subTitle}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs border border-slate-700">
                      <span className="text-[10px] sm:text-[11px] font-mono font-black text-slate-200">{currentHarapanPodiumData[1].score}</span>
                      <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                    </div>
                  </div>

                  {/* Pedestal Harapan 2 (#5) */}
                  <div className="w-full h-28 sm:h-38 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-t-3 border-white shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1.5 sm:p-2.5 relative overflow-hidden">
                    <span className="text-2xl sm:text-4xl font-black font-sans text-white tracking-tight drop-shadow-[0_2px_4px_rgba(71,85,105,0.4)]">
                      5
                    </span>
                    <span className="text-[7.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-slate-800 bg-white/95 px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                      HARAPAN 2
                    </span>
                  </div>
                </div>

                {/* HARAPAN 1 (#4) - TENGAH (Tertinggi di Harapan) */}
                <div className="flex flex-col items-center -mt-2 sm:-mt-4">
                  <div className="flex flex-col items-center mb-2 sm:mb-2.5 text-center w-full">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 mb-1 sm:mb-1.5 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentHarapanPodiumData[0].team} schoolName={currentHarapanPodiumData[0].schoolName} size="podium-md" isDark={effectiveDark} />
                    </div>
                    <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 min-h-[2.4em] leading-tight w-full px-0.5 break-words ${
                      effectiveDark ? 'text-white' : 'text-slate-950'
                    }`} title={currentHarapanPodiumData[0].mainTitle}>
                      {currentHarapanPodiumData[0].mainTitle}
                    </h4>
                    <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 truncate w-full px-0.5 mt-0.5 font-medium">
                      {currentHarapanPodiumData[0].subTitle}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950 text-white shadow-xs border border-sky-400/40">
                      <Award className="w-3 h-3 text-sky-400" />
                      <span className="text-[10.5px] sm:text-xs font-mono font-black text-sky-300">{currentHarapanPodiumData[0].score}</span>
                      <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-slate-300">Poin</span>
                    </div>
                  </div>

                  {/* Pedestal Harapan 1 (#4) */}
                  <div className="w-full h-36 sm:h-48 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 border-t-4 border-sky-200 shadow-md flex flex-col items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    <span className="text-3xl sm:text-5xl font-black font-sans text-white tracking-tight drop-shadow-[0_2px_4px_rgba(30,58,138,0.5)]">
                      4
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-indigo-950 bg-white/95 px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      HARAPAN 1
                    </span>
                  </div>
                </div>

                {/* HARAPAN 3 (#6) - KANAN */}
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2 sm:mb-2.5 text-center w-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-1.5 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentHarapanPodiumData[2].team} schoolName={currentHarapanPodiumData[2].schoolName} size="table" isDark={effectiveDark} />
                    </div>
                    <h4 className={`font-black text-[10.5px] sm:text-xs line-clamp-2 min-h-[2.4em] leading-tight w-full px-0.5 break-words ${
                      effectiveDark ? 'text-white' : 'text-slate-900'
                    }`} title={currentHarapanPodiumData[2].mainTitle}>
                      {currentHarapanPodiumData[2].mainTitle}
                    </h4>
                    <p className="text-[9px] sm:text-[10.5px] text-slate-500 line-clamp-1 truncate w-full px-0.5 mt-0.5 font-medium">
                      {currentHarapanPodiumData[2].subTitle}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs border border-slate-700">
                      <span className="text-[10px] sm:text-[11px] font-mono font-black text-slate-200">{currentHarapanPodiumData[2].score}</span>
                      <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                    </div>
                  </div>

                  {/* Pedestal Harapan 3 (#6) */}
                  <div className="w-full h-25 sm:h-34 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 border-t-3 border-stone-200 shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1.5 sm:p-2.5 relative overflow-hidden">
                    <span className="text-2xl sm:text-4xl font-black font-sans text-white tracking-tight drop-shadow-[0_2px_4px_rgba(87,83,78,0.4)]">
                      6
                    </span>
                    <span className="text-[7.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-stone-900 bg-white/95 px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                      HARAPAN 3
                    </span>
                  </div>
                </div>
              </div>

              {/* Base Deck for Harapan */}
              <div className={`max-w-2xl mx-auto h-2 sm:h-3 rounded-b-xl shadow-xs border-t ${
                effectiveDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-200 border-slate-300'
              }`} />
            </div>
          )}

          {/* LIST KARTU SKOR (RANK SETELAH PODIUM ATAU HASIL PENCARIAN) */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="flex items-start sm:items-center justify-between gap-2.5 px-2 text-xs font-semibold">
              <div className={`flex items-start sm:items-center gap-2 font-bold min-w-0 flex-1 ${
                effectiveDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Trophy className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <span className="block sm:inline font-bold leading-snug">
                    {searchQuery
                      ? `Hasil Pencarian`
                      : (currentHarapanPodiumData.length === 3 && viewMode === 'podium')
                      ? `Peringkat Kontingen Lainnya`
                      : `Peringkat Harapan & Kontingen Lainnya`}
                  </span>
                  <span className="text-[10.5px] sm:text-xs font-normal text-slate-400 block sm:inline sm:ml-1.5">
                    {searchQuery
                      ? `(${currentRankingList.length} Kontingen)`
                      : (currentHarapanPodiumData.length === 3 && viewMode === 'podium')
                      ? `(#7 s.d. Selesai)`
                      : `(#4 s.d. Selesai)`}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] sm:text-[11px] font-bold font-mono shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full border shadow-2xs ${
                effectiveDark 
                  ? 'bg-slate-800 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 text-slate-600 border-slate-200/80'
              }`}>
                {searchQuery ? currentRankingList.length : remainingRankingList.length} Kontingen
              </span>
            </div>

            {(searchQuery ? currentRankingList : remainingRankingList).length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border ${
                effectiveDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}>
                Tidak ada kontingen yang cocok dengan kriteria filter atau pencarian.
              </div>
            ) : (
              (searchQuery ? currentRankingList : remainingRankingList).map((item) => {
                const isMyTeam = (currentTeam?.id && item.team?.id === currentTeam.id) || (currentUser?.teamId && item.team?.id === currentUser.teamId);

                return (
                  <div
                    key={item.team?.id || item.schoolName}
                    className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-2.5 sm:gap-4 shadow-2xs hover:shadow-xs ${
                      isMyTeam
                        ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xs'
                        : effectiveDark
                        ? 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/80'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
                      {/* Rank Number Badge */}
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-sm shrink-0 shadow-2xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : item.rank === 3
                          ? 'bg-amber-600 text-white'
                          : effectiveDark
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        #{String(item.rank).padStart(2, '0')}
                      </div>

                      {/* School Logo */}
                      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border shadow-2xs p-1 flex items-center justify-center shrink-0 overflow-hidden ${
                        effectiveDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
                      }`}>
                        <SchoolLogo team={item.team} schoolName={item.schoolName} size="table" isDark={effectiveDark} />
                      </div>

                      {/* Info Tim & Sekolah */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className={`font-black text-xs sm:text-sm leading-snug break-words ${
                            effectiveDark ? 'text-white' : 'text-slate-950'
                          }`}>
                            {item.mainTitle || item.team?.schoolName || item.schoolName}
                          </h4>
                          {isMyTeam && (
                            <span className="px-1.5 py-0.5 rounded-full font-black text-[8.5px] sm:text-[9px] bg-emerald-600 text-white shadow-2xs shrink-0 uppercase tracking-wider">
                              Peleton Anda
                            </span>
                          )}
                          {item.team?.lotNumber && (
                            <span className="px-1.5 py-0.5 rounded-md font-mono font-bold text-[8.5px] sm:text-[9px] bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
                              TM #{String(item.team.lotNumber).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        {item.subTitle && (
                          <p className="text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5 font-medium leading-tight break-words">
                            {item.subTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Nilai Akhir / Poin di Sisi Kanan */}
                    <div className="text-right shrink-0 flex flex-col justify-center items-end">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`font-mono font-black text-sm sm:text-xl leading-none ${
                          effectiveDark ? 'text-white' : 'text-slate-950'
                        }`}>
                          {item.score}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Poin
                        </span>
                      </div>
                      {item.subScore ? (
                        <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-end sm:gap-1.5 leading-tight">
                          {item.subScore.includes(' | ') ? (
                            item.subScore.split(' | ').map((part, pIdx) => (
                              <span key={pIdx} className="whitespace-nowrap">
                                {part}
                                {pIdx === 0 && <span className="hidden sm:inline text-slate-300 dark:text-slate-600 ml-1.5">|</span>}
                              </span>
                            ))
                          ) : (
                            <span className="whitespace-nowrap">{item.subScore}</span>
                          )}
                        </div>
                      ) : item.scoreLabel ? (
                        <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.scoreLabel}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 6. TABEL HASIL & KLASEMEN RESMI (Tampil saat viewMode === 'table') */}
      {viewMode === 'table' && (
      <div
        className={`rounded-xl border overflow-hidden transition-colors ${
          effectiveDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        {/* Simple & Clean Header Bar */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
            effectiveDark
              ? 'bg-slate-950 border-slate-800'
              : 'bg-slate-50/80 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {activeCategory === 'peleton' && 'Klasemen Kategori Peleton (PBB Murni & Akhir)'}
              {activeCategory === 'danton' && 'Klasemen Kategori Komandan Peleton Terbaik'}
              {activeCategory === 'juara_umum' && 'Klasemen Juara Umum (Akumulasi Poin Sekolah)'}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Jenjang: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{selectedJenjang === 'SD' ? 'SD/MI (Arena 1)' : 'SMP/MTs (Arena 2)'}</strong>
          </span>
        </div>

        <div className="leaderboard-table-scroll overflow-x-auto">
          {/* TAB 1: KATEGORI PELETON */}
          {activeCategory === 'peleton' && (
            <table className="leaderboard-table w-full min-w-[900px] text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`uppercase text-[11px] font-bold border-b transition-colors tracking-wider ${
                    effectiveDark
                      ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {isOfficialScoreVisible && <th className="py-3 px-3 text-center w-28">Peringkat & Gelar</th>}
                  <th className="py-3 px-3 text-center w-20">No. Dada</th>
                  <th className="py-3 px-4 min-w-[220px]">Peleton & Pangkalan Sekolah</th>
                  {isOfficialScoreVisible ? (
                    <>
                      <th className="py-3 px-2 text-center w-16">Juri 1</th>
                      <th className="py-3 px-2 text-center w-16">Juri 2</th>
                      <th className="py-3 px-2 text-center w-16">Juri 3</th>
                      <th
                        className={`py-3 px-3 text-center w-24 font-bold ${
                          effectiveDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-200 text-slate-900'
                        }`}
                      >
                        Nilai Murni
                      </th>
                      <th className="py-3 px-2 text-center w-20 text-rose-600 dark:text-rose-400 font-bold">
                        Penalti
                      </th>
                      <th
                        className={`py-3 px-3 text-center w-28 font-bold ${
                          effectiveDark
                            ? 'bg-amber-950/30 text-amber-300 border-l border-slate-800'
                            : 'bg-amber-50 text-amber-950 border-l border-slate-200/80'
                        }`}
                      >
                        Nilai Akhir Peleton
                      </th>
                    </>
                  ) : (
                    <th className="py-3 px-4 text-center w-36">Status Tampil</th>
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y transition-colors ${
                  effectiveDark ? 'divide-slate-800/60' : 'divide-slate-100'
                }`}
              >
                {finalFilteredPeleton.length === 0 ? (
                  <tr>
                    <td colSpan={isOfficialScoreVisible ? 9 : 3} className="py-10 text-center text-slate-400">
                      Belum ada peleton pada filter ini.
                    </td>
                  </tr>
                ) : (
                  finalFilteredPeleton.map(item => {
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
                              ? 'bg-emerald-950/30 font-bold'
                              : 'bg-emerald-50/70 border-l-3 border-l-emerald-600 font-bold'
                            : item.rank === 1
                            ? effectiveDark
                              ? 'bg-amber-950/20 hover:bg-amber-950/30'
                              : 'bg-amber-50/40 hover:bg-amber-50/70'
                            : effectiveDark
                            ? 'hover:bg-slate-800/40 text-slate-200'
                            : 'hover:bg-slate-50/80 text-slate-800'
                        }`}
                      >
                        {isOfficialScoreVisible && (
                          <td className="py-2.5 px-3 text-center">
                            {item.rank === 1 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                  1
                                </span>
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 2 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                  2
                                </span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank === 3 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                  3
                                </span>
                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank >= 4 && item.rank <= 6 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px] inline-flex items-center justify-center">
                                  {item.rank}
                                </span>
                                <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5 whitespace-nowrap">
                                  {item.shortTitle}
                                </span>
                              </div>
                            )}
                            {item.rank > 6 && (
                              <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                {item.rank}
                              </span>
                            )}
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-semibold text-xs text-slate-700 dark:text-slate-300">
                            {chestNumber}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <SchoolLogo
                              team={item.team}
                              schoolName={item.team.schoolName}
                              size="table"
                              isDark={effectiveDark}
                              className="w-8 h-8 rounded-lg shrink-0"
                            />
                            <div className="min-w-0">
                              <div
                                className={`font-semibold text-xs sm:text-sm flex items-center gap-1.5 ${
                                  effectiveDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                <span className="truncate">{item.team.schoolName}</span>
                                {isMyTeam && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold shrink-0">
                                    Peleton Anda
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                                {item.team.platoonName ? `${item.team.platoonName} • ` : ''}Danton: {item.team.dantonName || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        {isOfficialScoreVisible ? (
                          <>
                            <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {j1}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {j2}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {j3}
                            </td>
                            <td className={`py-2.5 px-3 text-center font-mono font-medium text-xs text-slate-700 dark:text-slate-300 ${
                              effectiveDark ? 'bg-slate-800/70' : 'bg-slate-100'
                            }`}>
                              {murni}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs">
                              {penalty > 0 ? (
                                <span className="text-rose-600 dark:text-rose-400 font-bold">-{penalty}</span>
                              ) : (
                                <span className="text-slate-600 dark:text-slate-300">0</span>
                              )}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-mono font-bold text-sm ${
                                effectiveDark
                                  ? 'bg-amber-950/20 text-amber-300 border-l border-slate-800'
                                  : 'bg-amber-50 text-amber-950 border-l border-slate-200/80'
                              }`}
                            >
                              {akhir}
                            </td>
                          </>
                        ) : (
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                item.hasScore
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.hasScore ? 'Sudah Terekap' : 'Menunggu Giliran'}
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
            <table className="leaderboard-table w-full min-w-[1040px] text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`uppercase text-[11px] font-bold border-b transition-colors tracking-wider ${
                    effectiveDark
                      ? 'bg-slate-950 text-slate-200 border-slate-800'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {isOfficialScoreVisible && <th className="py-3 px-3 text-center w-28">Peringkat & Gelar</th>}
                  <th className="py-3 px-3 text-center w-20">No. Dada</th>
                  <th className="py-3 px-4 min-w-[180px]">Nama Komandan (Danton)</th>
                  <th className="py-3 px-4 min-w-[200px]">Pangkalan Sekolah & Peleton</th>
                  {isOfficialScoreVisible ? (
                    <>
                      <th className="py-3 px-2 text-center w-16">Juri 1</th>
                      <th className="py-3 px-2 text-center w-16">Juri 2</th>
                      <th className="py-3 px-2 text-center w-16">Juri 3</th>
                      <th
                        className={`py-3 px-3 text-center w-24 font-bold ${
                          effectiveDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-200 text-slate-900'
                        }`}
                      >
                        Nilai Murni
                      </th>
                      <th className="py-3 px-2 text-center w-20 text-rose-600 dark:text-rose-400 font-bold">
                        Penalti
                      </th>
                      <th
                        className={`py-3 px-3 text-center w-28 font-bold ${
                          effectiveDark
                            ? 'bg-amber-950/30 text-amber-300 border-l border-slate-800'
                            : 'bg-amber-50 text-amber-950 border-l border-slate-200/80'
                        }`}
                      >
                        Nilai Akhir Danton
                      </th>
                    </>
                  ) : (
                    <th className="py-3 px-4 text-center w-36">Status Tampil</th>
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y transition-colors ${
                  effectiveDark ? 'divide-slate-800/60' : 'divide-slate-100'
                }`}
              >
                {finalFilteredDanton.length === 0 ? (
                  <tr>
                    <td colSpan={isOfficialScoreVisible ? 10 : 4} className="py-10 text-center text-slate-400">
                      Belum ada data danton pada filter ini.
                    </td>
                  </tr>
                ) : (
                  finalFilteredDanton.map(item => {
                    const isMyTeam = (currentTeam?.id && item.team.id === currentTeam.id) || (currentUser?.teamId && item.team.id === currentUser.teamId);
                    const j1 = item.j1Danton > 0 ? Number(item.j1Danton).toFixed(1) : '-';
                    const j2 = item.j2Danton > 0 ? Number(item.j2Danton).toFixed(1) : '-';
                    const j3 = item.j3Danton > 0 ? Number(item.j3Danton).toFixed(1) : '-';
                    const murni = item.nilaiMurniDanton > 0 ? Number(item.nilaiMurniDanton).toFixed(1) : '-';
                    const akhir = item.nilaiAkhirDanton > 0 ? Number(item.nilaiAkhirDanton).toFixed(1) : '-';
                    const penalty = item.dantonPenalty || 0;
                    const chestNumber = item.team.chestNumber || (item.team.lotNumber ? getChestNumberByLot(item.team.jenjang, item.team.lotNumber) : '') || '--';

                    return (
                      <tr
                        key={item.team.id}
                        className={`transition-colors ${
                          isMyTeam
                            ? effectiveDark
                              ? 'bg-emerald-950/30 font-bold'
                              : 'bg-emerald-50/70 border-l-3 border-l-emerald-600 font-bold'
                            : item.rank === 1
                            ? effectiveDark
                              ? 'bg-amber-950/20 hover:bg-amber-950/30'
                              : 'bg-amber-50/40 hover:bg-amber-50/70'
                            : effectiveDark
                            ? 'hover:bg-slate-800/40 text-slate-200'
                            : 'hover:bg-slate-50/80 text-slate-800'
                        }`}
                      >
                        {isOfficialScoreVisible && (
                          <td className="py-2.5 px-3 text-center">
                            {item.rank === 1 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                  1
                                </span>
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  Danton 1
                                </span>
                              </div>
                            )}
                            {item.rank === 2 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                  2
                                </span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                                  Danton 2
                                </span>
                              </div>
                            )}
                            {item.rank === 3 && (
                              <div className="inline-flex flex-col items-center">
                                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                  3
                                </span>
                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                  Danton 3
                                </span>
                              </div>
                            )}
                            {item.rank > 3 && (
                              <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                {item.rank}
                              </span>
                            )}
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-semibold text-xs text-slate-700 dark:text-slate-300">
                            {chestNumber}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div
                            className={`font-semibold text-xs sm:text-sm ${
                              effectiveDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {item.team.dantonName || 'Komandan Peleton'}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                            {item.team.platoonName || 'Peleton'}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <SchoolLogo
                              team={item.team}
                              schoolName={item.team.schoolName}
                              size="table"
                              isDark={effectiveDark}
                              className="w-7 h-7 rounded-md shrink-0"
                            />
                            <span
                              className={`font-medium text-xs ${
                                effectiveDark ? 'text-slate-200' : 'text-slate-800'
                              }`}
                            >
                              {item.team.schoolName}
                            </span>
                          </div>
                        </td>
                        {isOfficialScoreVisible ? (
                          <>
                            <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {j1}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {j2}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {j3}
                            </td>
                            <td className={`py-2.5 px-3 text-center font-mono font-medium text-xs text-slate-700 dark:text-slate-300 ${
                              effectiveDark ? 'bg-slate-800/70' : 'bg-slate-100'
                            }`}>
                              {murni}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs">
                              {penalty > 0 ? (
                                <span className="text-rose-600 dark:text-rose-400 font-bold">-{penalty}</span>
                              ) : (
                                <span className="text-slate-600 dark:text-slate-300">0</span>
                              )}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-mono font-bold text-sm ${
                                effectiveDark
                                  ? 'bg-amber-950/20 text-amber-300 border-l border-slate-800'
                                  : 'bg-amber-50 text-amber-950 border-l border-slate-200/80'
                              }`}
                            >
                              {akhir}
                            </td>
                          </>
                        ) : (
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                item.hasScore
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.hasScore ? 'Sudah Terekap' : 'Menunggu Giliran'}
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
            <table className="leaderboard-table w-full min-w-[920px] text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`uppercase text-[11px] font-bold border-b transition-colors tracking-wider ${
                    effectiveDark
                      ? 'bg-slate-950 text-slate-200 border-slate-800'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <th className="py-3 px-3 text-center w-28">Peringkat & Gelar</th>
                  <th className="py-3 px-4 min-w-[200px]">Pangkalan Sekolah</th>
                  <th className="py-3 px-4 min-w-[220px]">Prestasi Peleton (Poin Juknis)</th>
                  <th className="py-3 px-4 min-w-[220px]">Prestasi Danton (Poin Juknis)</th>
                  <th
                    className={`py-3 px-3 text-center w-28 font-bold ${
                      effectiveDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-200 text-slate-900'
                    }`}
                  >
                    Murni Tie-Breaker
                  </th>
                  <th
                    className={`py-3 px-4 text-center w-36 font-bold ${
                      effectiveDark
                        ? 'bg-amber-950/30 text-amber-300 border-l border-slate-800'
                        : 'bg-amber-50 text-amber-950 border-l border-slate-200/80'
                    }`}
                  >
                    Total Poin Juara Umum
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y transition-colors ${
                  effectiveDark ? 'divide-slate-800/60' : 'divide-slate-100'
                }`}
              >
                {finalFilteredJuaraUmum.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Belum ada data akumulasi poin sekolah.
                    </td>
                  </tr>
                ) : (
                  finalFilteredJuaraUmum.map(sch => {
                    const isChampion = sch.rank === 1;
                    const isRunnerUp1 = sch.rank === 2;
                    const isRunnerUp2 = sch.rank === 3;
                    const isMySchool = currentTeam?.schoolName && sch.schoolName?.toLowerCase() === currentTeam.schoolName?.toLowerCase();

                    return (
                      <tr
                        key={`${sch.jenjang}_${sch.schoolName}`}
                        className={`transition-colors ${
                          isMySchool
                            ? effectiveDark
                              ? 'bg-emerald-950/30 font-bold'
                              : 'bg-emerald-50/70 border-l-3 border-l-emerald-600 font-bold'
                            : isChampion
                            ? effectiveDark
                              ? 'bg-amber-950/20 hover:bg-amber-950/30 font-semibold'
                              : 'bg-amber-50/50 hover:bg-amber-50 font-semibold'
                            : effectiveDark
                            ? 'hover:bg-slate-800/40 text-slate-200'
                            : 'hover:bg-slate-50/80 text-slate-800'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          {isChampion && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                1
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                Juara Umum
                              </span>
                            </div>
                          )}
                          {isRunnerUp1 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                2
                              </span>
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                                Runner-Up 1
                              </span>
                            </div>
                          )}
                          {isRunnerUp2 && (
                            <div className="inline-flex flex-col items-center">
                              <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs inline-flex items-center justify-center shadow-2xs">
                                3
                              </span>
                              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 whitespace-nowrap">
                                Runner-Up 2
                              </span>
                            </div>
                          )}
                          {!isChampion && !isRunnerUp1 && !isRunnerUp2 && (
                            <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold">
                              {sch.rank}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <SchoolLogo
                              team={sch.team || sch.teams?.[0]?.team}
                              schoolName={sch.schoolName}
                              size="table"
                              isDark={effectiveDark}
                              className="w-8 h-8 rounded-lg shrink-0"
                            />
                            <div className="min-w-0">
                              <div
                                className={`font-semibold text-xs sm:text-sm ${
                                  effectiveDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {sch.schoolName}
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                Perwakilan: {sch.teams.length} Peleton
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          {sch.peletonAchievements.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {sch.peletonAchievements.map((ach, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    effectiveDark
                                      ? 'bg-slate-800 border-slate-700 text-slate-300'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span>{ach.platoonName}</span>
                                  <span className="text-slate-600 dark:text-slate-300">({ach.shortTitle})</span>
                                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">+{ach.points} pt</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-300 font-mono text-xs">-</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {sch.dantonAchievements.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {sch.dantonAchievements.map((ach, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    effectiveDark
                                      ? 'bg-slate-800 border-slate-700 text-slate-300'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span>{ach.dantonName}</span>
                                  <span className="text-slate-600 dark:text-slate-300">({ach.shortTitle})</span>
                                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">+{ach.points} pt</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-300 font-mono text-xs">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                          {sch.bestMurniPeleton > 0 ? sch.bestMurniPeleton : '-'}
                        </td>
                        <td
                          className={`py-2.5 px-4 text-center font-mono font-bold text-sm ${
                            effectiveDark
                              ? 'bg-amber-950/20 text-amber-300 border-l border-slate-800'
                              : 'bg-amber-50 text-amber-950 border-l border-slate-200/80'
                          }`}
                        >
                          {sch.totalPoints} <span className="text-xs font-medium text-amber-800 dark:text-amber-200">Poin</span>
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
      title="Papan Klasemen & Hasil Lomba"
      subtitle="Papan Peringkat Resmi Dewan Juri Realtime (Penentuan Juara Peleton, Danton & Juara Umum)"
      rightActions={headerActions}
    >
      {/* Wrapper Utama */}
      <div className={isPeserta ? "max-w-6xl mx-auto space-y-4 sm:space-y-6" : ""}>
        <div className={effectiveDark ? 'bg-slate-950 text-slate-100 rounded-2xl p-4 sm:p-6 transition-colors' : ''}>
          {content}
        </div>
      </div>
    </SimpaskorSidebarLayout>
  );
}
