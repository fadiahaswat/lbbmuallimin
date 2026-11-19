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
  X,
  Download,
  ExternalLink,
  FileText,
  Settings,
  Check,
  AlertCircle
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { VENUE } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import { formatImageUrl } from '../../services/sheetService.js';
import { getChestNumberByLot } from '../../context/competitionHelpers.js';
import GoldConfetti from '../common/GoldConfetti.jsx';
import RankMedal from '../common/RankMedal.jsx';

// Komponen Logo Sekolah Bersih (Tanpa Wadah / Tanpa Box Inisial Berwarna)
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

  let sizeClasses = '';
  if (size === 'podium-lg') {
    sizeClasses = 'w-18 h-18 sm:w-24 sm:h-24';
  } else if (size === 'podium-md') {
    sizeClasses = 'w-14 h-14 sm:w-18 sm:h-18';
  } else {
    // table
    sizeClasses = 'w-7 h-7 sm:w-8 sm:h-8';
  }

  // Jika ada file logo resmi: render gambar logo murni transparan tanpa wadah kotak
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className={`${sizeClasses} object-contain filter drop-shadow-xs select-none shrink-0 ${!isDark ? 'mix-blend-multiply' : ''} ${className}`}
        title={name}
      />
    );
  }

  // Jika tidak ada logo:
  // 1. Pada tabel: Jangan render wadah/box inisial berwarna (tampil bersih langsung teks sekolah)
  if (size === 'table') {
    return null;
  }

  // 2. Pada podium: Tampilkan emblem minimalis transparan tanpa wadah kotak background solid
  return (
    <div
      className={`shrink-0 flex items-center justify-center select-none ${sizeClasses} ${className}`}
      title={name}
    >
      <Building2
        className={`${
          size === 'podium-lg'
            ? 'w-12 h-12 sm:w-16 sm:h-16 text-amber-500/80'
            : 'w-10 h-10 sm:w-12 sm:h-12 text-slate-400'
        } stroke-[1.5] drop-shadow-xs`}
      />
    </div>
  );
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

// Poin Juara Umum Berdasarkan Juknis Bab A Poin 7 (Juara Harapan tidak dihitung)
const PELETON_POINTS = {
  1: 10, // Juara 1 Peleton = 10 Poin
  2: 3,  // Juara 2 Peleton = 3 Poin
  3: 1,  // Juara 3 Peleton = 1 Poin
};

const DANTON_POINTS = {
  1: 5, // Juara 1 Komandan = 5 Poin
  2: 2, // Juara 2 Komandan = 2 Poin
  3: 1, // Juara 3 Komandan = 1 Poin
};

export default function LiveLeaderboard() {
  const { teams, scores, role, currentUser, currentTeam, settings, updateSettings, setActiveView, isLocalhost } = useCompetition();

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
  const isSuperOrAdmin = ['admin', 'superadmin'].includes(userRole);
  const isStaffOrJury = !isPeserta && userRole !== 'publik' && ['admin', 'juri', 'superadmin', 'penginput', 'verifikator', 'finalisator'].includes(userRole);
  const isOfficialScoreVisible = isStaffOrJury || Boolean(settings?.announcementPublished);

  // State Modal & Link Berita Acara (Google Drive)
  const [isBeritaAcaraModalOpen, setIsBeritaAcaraModalOpen] = useState(false);
  const [beritaAcaraForm, setBeritaAcaraForm] = useState({
    sd: settings?.beritaAcaraUrlSD || '',
    smp: settings?.beritaAcaraUrlSMP || ''
  });
  const [isSavingBeritaAcara, setIsSavingBeritaAcara] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Link aktif sesuai jenjang yang dipilih
  const currentBeritaAcaraUrl = useMemo(() => {
    if (selectedJenjang === 'SD') {
      return settings?.beritaAcaraUrlSD || settings?.beritaAcaraUrl || '';
    } else {
      return settings?.beritaAcaraUrlSMP || settings?.beritaAcaraUrl || '';
    }
  }, [settings, selectedJenjang]);

  const openBeritaAcaraModal = () => {
    setBeritaAcaraForm({
      sd: settings?.beritaAcaraUrlSD || settings?.beritaAcaraUrl || '',
      smp: settings?.beritaAcaraUrlSMP || settings?.beritaAcaraUrl || ''
    });
    setSaveSuccessNotice(false);
    setIsBeritaAcaraModalOpen(true);
  };

  const handleBeritaAcaraClick = () => {
    if (currentBeritaAcaraUrl && currentBeritaAcaraUrl.trim() !== '') {
      window.open(currentBeritaAcaraUrl.trim(), '_blank', 'noopener,noreferrer');
    } else {
      openBeritaAcaraModal();
    }
  };

  const handleSaveBeritaAcara = async (e) => {
    e?.preventDefault();
    setIsSavingBeritaAcara(true);
    try {
      if (typeof updateSettings === 'function') {
        updateSettings({
          beritaAcaraUrlSD: beritaAcaraForm.sd.trim(),
          beritaAcaraUrlSMP: beritaAcaraForm.smp.trim(),
          beritaAcaraUrl: (beritaAcaraForm.sd.trim() || beritaAcaraForm.smp.trim())
        });
      }
      setSaveSuccessNotice(true);
      setTimeout(() => {
        setIsBeritaAcaraModalOpen(false);
        setSaveSuccessNotice(false);
      }, 800);
    } catch (err) {
      console.error('Gagal menyimpan link berita acara:', err);
    } finally {
      setIsSavingBeritaAcara(false);
    }
  };

  // Filter tim terverifikasi/terundi (khusus localhost: bypass kelengkapan, tampilkan semua non-rejected)
  const verifiedTeams = useMemo(() => {
    return teams.filter(t => isLocalhost ? t.status !== 'rejected' : (t.status === 'verified' || t.status === 'drawn' || t.lotNumber));
  }, [teams, isLocalhost]);

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
      const baseSchoolName = getBaseSchoolName(item.team.schoolName);
      const schoolKey = getNormalizedSchoolKey(item.team.jenjang, item.team.schoolName);
      const suffix = getPlatoonSuffix(item.team.schoolName);
      const pInfo = peletonPointsMap.get(item.team.id) || { rank: 99, title: '-', shortTitle: '', points: 0 };
      const dInfo = dantonPointsMap.get(item.team.id) || { rank: 99, title: '-', shortTitle: '', points: 0 };

      if (!schoolMap.has(schoolKey)) {
        schoolMap.set(schoolKey, {
          schoolName: baseSchoolName || item.team.schoolName,
          jenjang: item.team.jenjang,
          team: item.team,
          teams: [],
          medals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
          totalMedals: 0,
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

      if (pInfo.rank >= 1 && pInfo.rank <= 3) {
        sch.medals[pInfo.rank] += 1;
        sch.totalMedals += 1;
        sch.peletonAchievements.push({
          rank: pInfo.rank,
          platoonName: item.team.platoonName || 'Peleton',
          suffix,
          title: pInfo.title,
          shortTitle: pInfo.shortTitle || pInfo.title,
          points: pInfo.points
        });
      }
      if (dInfo.rank >= 1 && dInfo.rank <= 3) {
        sch.medals[dInfo.rank] += 1;
        sch.totalMedals += 1;
        sch.dantonAchievements.push({
          rank: dInfo.rank,
          dantonName: item.team.dantonName || 'Danton',
          suffix,
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
        subTitle: '',
        score: item.nilaiAkhirPeleton,
        scoreLabel: '',
        subScore: ''
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
        scoreLabel: '',
        subScore: ''
      }));
    } else {
      return finalFilteredJuaraUmum.map((item, idx) => ({
        rank: item.rank || idx + 1,
        title: item.title,
        team: item.team || item.teams?.[0]?.team,
        schoolName: item.schoolName,
        mainTitle: item.schoolName,
        subTitle: '',
        medals: item.medals,
        totalMedals: item.totalMedals,
        score: item.totalPoints,
        scoreLabel: 'Poin',
        subScore: ''
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
    if (viewMode === 'podium') {
      if (activeCategory === 'peleton' && currentRankingList.length >= 6) {
        return currentRankingList.slice(6);
      }
      if (activeCategory === 'juara_umum' && currentRankingList.length >= 1) {
        return currentRankingList.slice(1);
      }
    }
    return currentRankingList.slice(3);
  }, [currentRankingList, viewMode, activeCategory]);

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
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
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
                Dihitung dari akumulasi poin prestasi per sekolah pada jenjang terkait (Juara Harapan tidak dihitung):
              </p>
              <div
                className={`text-[10px] p-2 rounded-lg space-y-1 ${
                  effectiveDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <div><strong>Peleton:</strong> Juara 1 = 10 pt, Juara 2 = 3 pt, Juara 3 = 1 pt.</div>
                <div><strong>Komandan (Danton):</strong> Juara 1 = 5 pt, Juara 2 = 2 pt, Juara 3 = 1 pt.</div>
                <div className={`font-bold ${effectiveDark ? 'text-amber-400' : 'text-amber-700'}`}>Total Poin = Poin Peleton + Poin Komandan.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Dark Broadcast Control Deck: Kategori Kejuaraan, Jenjang, Telemetry & Aksi */}
      {(() => {
        const sdAll = teamsWithScores.filter(i => i.team.jenjang === 'SD');
        const smpAll = teamsWithScores.filter(i => i.team.jenjang === 'SMP');
        const activeDivAll = selectedJenjang === 'SD' ? sdAll : smpAll;
        const activeDivScored = activeDivAll.filter(i => i.hasScore).length;
        const isSD = selectedJenjang === 'SD';

        return (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.16)] overflow-hidden">
            {/* Tier 1: Dark Flush Underline Category Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-800/90 bg-slate-900/60">
              {[
                {
                  id: 'peleton',
                  label: 'Peleton',
                  sub: 'PBB Murni',
                  icon: Shield,
                  activeIcon: isSD ? 'text-rose-400' : 'text-blue-400',
                  activeBar: isSD ? 'bg-rose-500' : 'bg-blue-500',
                },
                {
                  id: 'danton',
                  label: 'Danton',
                  sub: 'Komandan Terbaik',
                  icon: Medal,
                  activeIcon: 'text-amber-400',
                  activeBar: 'bg-amber-400',
                },
                {
                  id: 'juara_umum',
                  label: 'Juara Umum',
                  sub: 'Piala Bergilir',
                  icon: Crown,
                  activeIcon: 'text-amber-400',
                  activeBar: 'bg-amber-400',
                },
              ].map((cat, idx) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative py-3.5 px-2 sm:px-4 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                      idx < 2 ? 'border-r border-slate-800/80' : ''
                    } ${
                      isActive
                        ? 'bg-slate-950 text-white font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80 font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? cat.activeIcon : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                    <span className={`hidden md:inline text-[10px] font-medium ${
                      isActive ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      · {cat.sub}
                    </span>
                    {isActive && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${cat.activeBar}`} />}
                  </button>
                );
              })}
            </div>

            {/* Tier 2: Balanced Dark Sub-Toolbar */}
            <div className="px-3.5 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Left Group: Jenjang Switcher + Live Telemetry */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center p-0.5 rounded-xl border border-slate-800 bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setSelectedJenjang('SD')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      selectedJenjang === 'SD'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedJenjang === 'SD' ? 'bg-white' : 'bg-rose-500'}`} />
                    <span>SD / MI</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md leading-none ${
                      selectedJenjang === 'SD' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sdAll.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJenjang('SMP')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      selectedJenjang === 'SMP'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedJenjang === 'SMP' ? 'bg-white' : 'bg-blue-500'}`} />
                    <span>SMP / MTs</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md leading-none ${
                      selectedJenjang === 'SMP' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {smpAll.length}
                    </span>
                  </button>
                </div>

                {/* Live Telemetry Chip */}
                <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    settings?.announcementPublished ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span>
                    <strong className="font-mono font-black text-white">
                      {activeDivScored}/{activeDivAll.length}
                    </strong>{' '}
                    ternilai
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className={settings?.announcementPublished ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {settings?.announcementPublished ? 'Publik' : 'Preview'}
                  </span>
                </div>
              </div>

              {/* Right Group: View Mode + Split Berita Acara */}
              <div className="flex items-center gap-2 flex-wrap ml-auto">
                {/* View Mode Toggle: Podium vs Tabel */}
                <div className="inline-flex items-center p-0.5 rounded-xl border border-slate-800 bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setViewMode('podium')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      viewMode === 'podium'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tampilan Podium Juara & Peringkat"
                  >
                    <Trophy className={`w-3.5 h-3.5 shrink-0 ${viewMode === 'podium' ? 'text-amber-500' : 'text-slate-500'}`} />
                    <span>Podium</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      viewMode === 'table'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tampilan Tabel Juknis Lengkap"
                  >
                    <FileSpreadsheet className={`w-3.5 h-3.5 shrink-0 ${viewMode === 'table' ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span>Tabel</span>
                  </button>
                </div>

                {/* Unified Split Berita Acara Button */}
                <div className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900 overflow-hidden divide-x divide-slate-800">
                  <button
                    type="button"
                    onClick={handleBeritaAcaraClick}
                    className="px-3 py-1.5 text-xs font-bold text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    title={`Unduh Berita Acara Resmi Jenjang ${selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}`}
                  >
                    <Download className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Berita Acara</span>
                    <span className="hidden sm:inline font-mono text-[10.5px] font-semibold text-slate-400">
                      {selectedJenjang}
                    </span>
                  </button>

                  {isSuperOrAdmin && (
                    <button
                      type="button"
                      onClick={openBeritaAcaraModal}
                      className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                      title="Kelola Link Google Drive Berita Acara (Admin / Superadmin)"
                    >
                      <Settings className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
      {isOfficialScoreVisible && viewMode === 'podium' && (
        (activeCategory === 'juara_umum' ? currentRankingList.length >= 1 : currentPodiumData.length >= 3)
      ) && (
        <div className="space-y-6">
          {/* STAGE PODIUM JUARA */}
          <div className={`relative w-full rounded-[28px] border p-3 sm:p-7 md:p-9 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all ${
            effectiveDark
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800'
              : 'bg-gradient-to-b from-amber-50/50 via-white to-slate-50 border-slate-200/90'
          }`}>
            {/* Radial ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/25 via-amber-100/10 to-transparent pointer-events-none" />

            {/* Efek Animasi Golden Confetti Hujan Khusus Wadah Podium Utama (15 Detik) */}
            <GoldConfetti
              key={`gold-confetti-${activeCategory}-${selectedJenjang}`}
              variant="gold"
              duration={15000}
              autoFire={true}
            />

            {/* Championship Kicker */}
            <div className="text-center relative z-10 mb-4 sm:mb-8">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-2xs whitespace-nowrap ${
                effectiveDark
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                  : activeCategory === 'juara_umum'
                  ? 'bg-amber-400/20 text-amber-900 border border-amber-400/60'
                  : 'bg-amber-100/80 text-amber-900 border border-amber-300/80'
              }`}>
                {activeCategory === 'peleton' && <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                {activeCategory === 'danton' && <Medal className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                {activeCategory === 'juara_umum' && <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                <span>
                  {activeCategory === 'peleton' && (
                    <>
                      <span>PODIUM UTAMA</span>
                      <span className="hidden sm:inline"> KEJUARAAN</span>
                      <span> • </span>
                      <span className="sm:hidden">{selectedJenjang}</span>
                      <span className="hidden sm:inline">JENJANG {selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}</span>
                    </>
                  )}
                  {activeCategory === 'danton' && (
                    <>
                      <span>PODIUM DANTON</span>
                      <span className="hidden sm:inline"> TERBAIK</span>
                      <span> • </span>
                      <span className="sm:hidden">{selectedJenjang}</span>
                      <span className="hidden sm:inline">JENJANG {selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}</span>
                    </>
                  )}
                  {activeCategory === 'juara_umum' && (
                    <>
                      <span>PIALA BERGILIR</span>
                      <span className="hidden sm:inline"> JUARA UMUM</span>
                      <span> • </span>
                      <span className="sm:hidden">{selectedJenjang}</span>
                      <span className="hidden sm:inline">JENJANG {selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}</span>
                    </>
                  )}
                </span>
              </span>
              <h3 className={`mt-1.5 sm:mt-2 text-base sm:text-2xl font-black uppercase tracking-tight ${
                effectiveDark ? 'text-white' : 'text-slate-950'
              }`}>
                {activeCategory === 'peleton' && 'Juara Utama Peleton 1, 2, & 3'}
                {activeCategory === 'danton' && 'Komandan Peleton Terbaik 1, 2, & 3'}
                {activeCategory === 'juara_umum' && `Juara Umum Jenjang ${selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}`}
              </h3>
            </div>

            {activeCategory === 'juara_umum' ? (
              /* ======================================================== */
              /* SINGLE JUARA UMUM SHOWCASE (HANYA 1 JUARA UMUM PER JENJANG) */
              /* ======================================================== */
              <div className="flex flex-col items-center max-w-md mx-auto pt-3 sm:pt-6 relative z-10">
                {/* Top Avatar & Identity */}
                <div className="flex flex-col items-center mb-3 sm:mb-4 text-center w-full">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                    <SchoolLogo team={currentRankingList[0].team} schoolName={currentRankingList[0].schoolName} size="podium-lg" isDark={effectiveDark} />
                  </div>

                  <h4 className={`font-black text-base sm:text-xl md:text-2xl leading-tight w-full px-2 break-words ${
                    effectiveDark ? 'text-white' : 'text-slate-950'
                  }`} title={currentRankingList[0].mainTitle}>
                    {currentRankingList[0].mainTitle}
                  </h4>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-950 text-white shadow-xs border border-amber-400/40">
                    <span className="text-sm sm:text-base font-mono font-black text-amber-300">{currentRankingList[0].score}</span>
                    <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-slate-300">Poin</span>
                  </div>
                </div>

                {/* Single Architectural Pedestal for Juara Umum */}
                <div className="w-full h-36 sm:h-52 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-t-4 border-amber-100 shadow-[0_20px_50px_rgba(245,158,11,0.35)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                  <div className="flex flex-col items-center text-center">
                    <RankMedal rank={1} className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-[0_6px_12px_rgba(120,53,15,0.45)]" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-950 bg-white/95 px-4 sm:px-6 py-1 rounded-full shadow-xs whitespace-nowrap">
                      JUARA UMUM
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================= */
              /* 3 PEDESTAL STAGE (PELETON & DANTON)       */
              /* ========================================= */
              <div className="grid grid-cols-3 gap-1.5 sm:gap-5 max-w-3xl mx-auto items-end pt-3 sm:pt-6 relative z-10">

                {/* ========================================= */}
                {/* RANK 2: PERAK / PLATINUM (KIRI)           */}
                {/* ========================================= */}
                <div className="flex flex-col items-center">
                  {/* Top Avatar & Identity */}
                  <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentPodiumData[1].team} schoolName={currentPodiumData[1].schoolName} size="podium-md" isDark={effectiveDark} />
                    </div>

                    <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-snug w-full px-1 break-words ${
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

                  {/* Architectural Pedestal #2 — Pure Brushed Metallic Silver */}
                  <div className="w-full h-32 sm:h-48 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-[#d9d9dd] via-[#b5b6bb] to-[#888a90] border-t-4 border-[#f4f4f5] shadow-[0_16px_36px_rgba(113,113,122,0.32)] flex flex-col items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                    <div className="flex flex-col items-center relative z-10">
                      <RankMedal rank={2} className="w-14 h-14 sm:w-20 sm:h-20 drop-shadow-[0_6px_12px_rgba(39,39,42,0.45)]" />
                      <span className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider text-zinc-900 bg-white/95 px-1.5 sm:px-2.5 py-0.5 rounded-full mt-1 sm:mt-1.5 shadow-2xs whitespace-nowrap">
                        {activeCategory === 'peleton' ? 'JUARA 2 UTAMA' : 'DANTON TERBAIK 2'}
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
                    <div className="w-18 h-18 sm:w-24 sm:h-24 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentPodiumData[0].team} schoolName={currentPodiumData[0].schoolName} size="podium-lg" isDark={effectiveDark} />
                    </div>

                    <h4 className={`font-black text-xs sm:text-sm md:text-base line-clamp-2 leading-snug w-full px-1 break-words ${
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
                    <div className="flex flex-col items-center">
                      <RankMedal rank={1} className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_8px_16px_rgba(120,53,15,0.45)]" />
                      <span className="text-[8px] sm:text-[11px] font-black uppercase tracking-wider text-slate-950 bg-white/95 px-2 sm:px-3 py-0.5 rounded-full mt-1.5 sm:mt-2 shadow-xs whitespace-nowrap">
                        {activeCategory === 'peleton' ? 'JUARA 1 UTAMA' : 'DANTON TERBAIK 1'}
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
                    <div className="w-14 h-14 sm:w-20 sm:h-20 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentPodiumData[2].team} schoolName={currentPodiumData[2].schoolName} size="podium-md" isDark={effectiveDark} />
                    </div>

                    <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-snug w-full px-1 break-words ${
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

                  {/* Architectural Pedestal #3 — Burnished Metallic Bronze */}
                  <div className="w-full h-28 sm:h-40 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-[#b88158] via-[#925c36] to-[#633b1f] border-t-4 border-[#e0b899]/90 shadow-[0_14px_35px_rgba(99,59,31,0.32)] flex flex-col items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                    <div className="flex flex-col items-center relative z-10">
                      <RankMedal rank={3} className="w-12 h-12 sm:w-18 sm:h-18 drop-shadow-[0_6px_12px_rgba(45,22,8,0.5)]" />
                      <span className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#4a2b14] bg-white/95 px-1.5 sm:px-2.5 py-0.5 rounded-full mt-1 sm:mt-1.5 shadow-2xs whitespace-nowrap">
                        {activeCategory === 'peleton' ? 'JUARA 3 UTAMA' : 'DANTON TERBAIK 3'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Stage Base Plinth */}
            <div className={`max-w-3xl mx-auto h-2.5 sm:h-3.5 rounded-b-xl sm:rounded-b-2xl shadow-xs border-t ${
              effectiveDark
                ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-slate-700/60'
                : 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 border-slate-300/60'
            }`} />
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

              {/* Efek Animasi Silver Confetti Hujan Khusus Wadah Podium Harapan (15 Detik) */}
              <GoldConfetti
                key={`silver-confetti-${activeCategory}-${selectedJenjang}`}
                variant="silver"
                duration={15000}
                autoFire={true}
              />

              {/* Championship Kicker */}
              <div className="text-center relative z-10 mb-3 sm:mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-2xs whitespace-nowrap ${
                  effectiveDark
                    ? 'bg-sky-950 text-sky-300 border border-sky-800'
                    : 'bg-sky-100/90 text-sky-900 border border-sky-200'
                }`}>
                  <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>
                    <span>PODIUM JUARA HARAPAN</span>
                    <span> • </span>
                    <span className="sm:hidden">{selectedJenjang}</span>
                    <span className="hidden sm:inline">JENJANG {selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}</span>
                  </span>
                </span>
                <h3 className={`mt-1.5 text-base sm:text-xl font-black uppercase tracking-tight ${
                  effectiveDark ? 'text-white' : 'text-slate-950'
                }`}>
                  Juara Harapan 1, 2, & 3
                </h3>
              </div>

              {/* 3 Pedestal Stage for Harapan (Proporsi & Ukuran Logo Seimbang dengan Podium Utama) */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-5 max-w-3xl mx-auto items-end pt-3 sm:pt-5 relative z-10">
                {/* HARAPAN 2 (#5) - KIRI */}
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentHarapanPodiumData[1].team} schoolName={currentHarapanPodiumData[1].schoolName} size="podium-md" isDark={effectiveDark} />
                    </div>
                    <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-snug w-full px-1 break-words ${
                      effectiveDark ? 'text-white' : 'text-slate-900'
                    }`} title={currentHarapanPodiumData[1].mainTitle}>
                      {currentHarapanPodiumData[1].mainTitle}
                    </h4>
                    <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 truncate w-full px-1 mt-0.5 font-medium">
                      {currentHarapanPodiumData[1].subTitle}
                    </p>
                    <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900 text-white shadow-2xs border border-slate-700">
                      <span className="text-[10.5px] sm:text-xs font-mono font-black text-slate-200">{currentHarapanPodiumData[1].score}</span>
                      <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                    </div>
                  </div>

                  {/* Pedestal Harapan 2 (#5) — Tema Besi / Forged Steel */}
                  <div className="w-full h-28 sm:h-40 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-slate-500 via-slate-700 to-slate-900 border-t-4 border-slate-400/80 shadow-[0_12px_28px_rgba(15,23,42,0.32)] flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-white/10 to-transparent pointer-events-none" />
                    <RankMedal rank={5} className="w-12 h-12 sm:w-18 sm:h-18 relative z-10 drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)]" />
                    <span className="relative z-10 text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-900 bg-slate-100/95 px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                      HARAPAN 2
                    </span>
                  </div>
                </div>

                {/* HARAPAN 1 (#4) - TENGAH (Tertinggi di Harapan) */}
                <div className="flex flex-col items-center -mt-2 sm:-mt-5">
                  <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                    <div className="w-18 h-18 sm:w-24 sm:h-24 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentHarapanPodiumData[0].team} schoolName={currentHarapanPodiumData[0].schoolName} size="podium-lg" isDark={effectiveDark} />
                    </div>
                    <h4 className={`font-black text-xs sm:text-sm md:text-base line-clamp-2 leading-snug w-full px-1 break-words ${
                      effectiveDark ? 'text-white' : 'text-slate-950'
                    }`} title={currentHarapanPodiumData[0].mainTitle}>
                      {currentHarapanPodiumData[0].mainTitle}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 truncate w-full px-1 mt-0.5 font-medium">
                      {currentHarapanPodiumData[0].subTitle}
                    </p>
                    <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-slate-950 text-white shadow-xs border border-white/25">
                      <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-200" />
                      <span className="text-[11px] sm:text-sm font-mono font-black text-white">{currentHarapanPodiumData[0].score}</span>
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-300">Poin</span>
                    </div>
                  </div>

                  {/* Pedestal Harapan 1 (#4) — Tema Kaca Kristal / Smoky Frosted Glass */}
                  <div className="w-full h-36 sm:h-52 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-[#d8e1ea] via-[#bcc9d6] to-[#98a9ba] border-t-4 border-white/95 border-x border-[#b2c0cf] shadow-[0_14px_34px_rgba(71,85,105,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 p-2 sm:p-3.5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-white/10 pointer-events-none" />
                    <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/45 rounded-full blur-2xl pointer-events-none" />
                    <RankMedal rank={4} className="w-14 h-14 sm:w-22 sm:h-22 relative z-10 drop-shadow-[0_6px_14px_rgba(30,41,59,0.42)]" />
                    <span className="relative z-10 text-[8px] sm:text-[10.5px] font-black uppercase tracking-wider text-slate-900 bg-white/95 border border-white px-2.5 sm:px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      HARAPAN 1
                    </span>
                  </div>
                </div>

                {/* HARAPAN 3 (#6) - KANAN */}
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2.5 sm:mb-3 text-center w-full">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 mb-2 flex items-center justify-center hover:scale-105 transition-transform">
                      <SchoolLogo team={currentHarapanPodiumData[2].team} schoolName={currentHarapanPodiumData[2].schoolName} size="podium-md" isDark={effectiveDark} />
                    </div>
                    <h4 className={`font-black text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-snug w-full px-1 break-words ${
                      effectiveDark ? 'text-white' : 'text-slate-900'
                    }`} title={currentHarapanPodiumData[2].mainTitle}>
                      {currentHarapanPodiumData[2].mainTitle}
                    </h4>
                    <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 truncate w-full px-1 mt-0.5 font-medium">
                      {currentHarapanPodiumData[2].subTitle}
                    </p>
                    <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900 text-white shadow-2xs border border-slate-700">
                      <span className="text-[10.5px] sm:text-xs font-mono font-black text-slate-200">{currentHarapanPodiumData[2].score}</span>
                      <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-slate-400">Poin</span>
                    </div>
                  </div>

                  {/* Pedestal Harapan 3 (#6) — Tema Kayu / Warm Carved Wood */}
                  <div className="w-full h-24 sm:h-36 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-[#a46a3e] via-[#7c4926] to-[#4f2d16] border-t-4 border-[#d4a373]/90 shadow-[0_12px_26px_rgba(92,51,23,0.3)] flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-amber-200/10 to-black/20 pointer-events-none" />
                    <RankMedal rank={6} className="w-11 h-11 sm:w-16 sm:h-16 relative z-10 drop-shadow-[0_6px_12px_rgba(38,19,8,0.55)]" />
                    <span className="relative z-10 text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-100/95 px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                      HARAPAN 3
                    </span>
                  </div>
                </div>
              </div>

              {/* Base Deck for Harapan */}
              <div className={`max-w-3xl mx-auto h-2.5 sm:h-3.5 rounded-b-xl sm:rounded-b-2xl shadow-xs border-t ${
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
                      : activeCategory === 'juara_umum'
                      ? `Klasemen Akumulasi Poin Sekolah Lainnya`
                      : (currentHarapanPodiumData.length === 3 && viewMode === 'podium')
                      ? `Peringkat Kontingen Peleton Lainnya`
                      : `Peringkat Kontingen Lainnya`}
                  </span>
                  <span className="text-[10.5px] sm:text-xs font-normal text-slate-400 block sm:inline sm:ml-1.5">
                    {searchQuery
                      ? `(${currentRankingList.length} Kontingen)`
                      : activeCategory === 'juara_umum'
                      ? `(#2 s.d. Selesai)`
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
                const chestNumber = item.team?.chestNumber || (item.team?.lotNumber ? getChestNumberByLot(item.team.jenjang, item.team.lotNumber) : '') || '';

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
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {/* Rank Number / Medal Emblem */}
                      {(item.rank <= 3 || (activeCategory === 'peleton' && item.rank <= 6)) ? (
                        <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
                          <RankMedal rank={item.rank} className="w-9 h-9 sm:w-11 sm:h-11" />
                        </div>
                      ) : (
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-sm shrink-0 shadow-2xs ${
                          effectiveDark
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-100 text-slate-900 border border-slate-200'
                        }`}>
                          #{String(item.rank).padStart(2, '0')}
                        </div>
                      )}

                      {/* No. Dada (Di Sebelah Kanan Peringkat Tanpa Label) */}
                      {chestNumber && (
                        <div
                          className={`h-8 sm:h-10 px-2 sm:px-2.5 rounded-xl border flex items-center justify-center font-mono font-black text-[11px] sm:text-sm shrink-0 shadow-2xs ${
                            effectiveDark
                              ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                              : 'bg-slate-100/90 border-slate-200 text-slate-950'
                          }`}
                          title={`Nomor Dada: ${chestNumber}`}
                        >
                          {chestNumber}
                        </div>
                      )}

                      {/* School Logo (Tanpa Wadah) */}
                      <SchoolLogo
                        team={item.team}
                        schoolName={item.schoolName}
                        size="table"
                        isDark={effectiveDark}
                        className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
                      />

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
                  <th className="py-3 px-4 min-w-[220px]">Pangkalan Sekolah</th>
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
                      <th className="py-3 px-2 text-center w-20 text-rose-600 font-bold">
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
                            {item.rank <= 3 && (
                              <div className="inline-flex items-center justify-center">
                                <RankMedal rank={item.rank} className="w-10 h-10" />
                              </div>
                            )}
                            {item.rank >= 4 && item.rank <= 6 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 text-[10.5px] font-bold whitespace-nowrap">
                                {item.shortTitle}
                              </span>
                            )}
                            {item.rank > 6 && (
                              <span className={`font-mono text-xs font-bold ${effectiveDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                {item.rank}
                              </span>
                            )}
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-mono font-bold text-xs ${effectiveDark ? 'text-slate-200' : 'text-slate-900'}`}>
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
                            </div>
                          </div>
                        </td>
                        {isOfficialScoreVisible ? (
                          <>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold text-xs ${effectiveDark ? 'text-white' : 'text-slate-950'}`}>
                              {j1}
                            </td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold text-xs ${effectiveDark ? 'text-white' : 'text-slate-950'}`}>
                              {j2}
                            </td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold text-xs ${effectiveDark ? 'text-white' : 'text-slate-950'}`}>
                              {j3}
                            </td>
                            <td className={`py-2.5 px-3 text-center font-mono font-black text-xs ${
                              effectiveDark ? 'bg-slate-800 text-white' : 'bg-slate-200/80 text-slate-950'
                            }`}>
                              {murni}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs">
                              {penalty > 0 ? (
                                <span className="text-rose-600 font-black">-{penalty}</span>
                              ) : (
                                <span className={`font-bold ${effectiveDark ? 'text-slate-400' : 'text-slate-950'}`}>0</span>
                              )}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-mono font-black text-sm ${
                                effectiveDark
                                  ? 'bg-amber-950/30 text-amber-300 border-l border-slate-800'
                                  : 'bg-amber-100/70 text-amber-950 border-l border-slate-300'
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
                  <th className="py-3 px-4 min-w-[180px]">Nama Komandan Peleton</th>
                  <th className="py-3 px-4 min-w-[200px]">Pangkalan Sekolah</th>
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
                      <th className="py-3 px-2 text-center w-20 text-rose-600 font-bold">
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
                            {item.rank <= 3 && (
                              <div className="inline-flex items-center justify-center">
                                <RankMedal rank={item.rank} className="w-10 h-10" />
                              </div>
                            )}
                            {item.rank > 3 && (
                              <span className={`font-mono text-xs font-bold ${effectiveDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                {item.rank}
                              </span>
                            )}
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-mono font-bold text-xs ${effectiveDark ? 'text-slate-200' : 'text-slate-900'}`}>
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
                            <td className={`py-2.5 px-2 text-center font-mono font-bold text-xs ${effectiveDark ? 'text-white' : 'text-slate-950'}`}>
                              {j1}
                            </td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold text-xs ${effectiveDark ? 'text-white' : 'text-slate-950'}`}>
                              {j2}
                            </td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold text-xs ${effectiveDark ? 'text-white' : 'text-slate-950'}`}>
                              {j3}
                            </td>
                            <td className={`py-2.5 px-3 text-center font-mono font-black text-xs ${
                              effectiveDark ? 'bg-slate-800 text-white' : 'bg-slate-200/80 text-slate-950'
                            }`}>
                              {murni}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs">
                              {penalty > 0 ? (
                                <span className="text-rose-600 font-black">-{penalty}</span>
                              ) : (
                                <span className={`font-bold ${effectiveDark ? 'text-slate-400' : 'text-slate-950'}`}>0</span>
                              )}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-mono font-black text-sm ${
                                effectiveDark
                                  ? 'bg-amber-950/30 text-amber-300 border-l border-slate-800'
                                  : 'bg-amber-100/70 text-amber-950 border-l border-slate-300'
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
          {activeCategory === 'juara_umum' && (() => {
            const maxPoints = Math.max(1, ...finalFilteredJuaraUmum.map(s => Number(s.totalPoints) || 0));
            return (
              <table className="leaderboard-table w-full min-w-[820px] text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`uppercase text-[10px] font-extrabold border-b transition-colors tracking-wider ${
                      effectiveDark
                        ? 'bg-slate-950 text-slate-400 border-slate-800'
                        : 'bg-slate-50/90 text-slate-500 border-slate-200'
                    }`}
                  >
                    <th className="py-3 px-4 text-center w-16">#</th>
                    <th className="py-3 px-4 min-w-[220px]">Pangkalan Sekolah</th>
                    <th className="py-3 px-4 min-w-[170px]">Prestasi Peleton</th>
                    <th className="py-3 px-4 min-w-[240px]">Prestasi Danton</th>
                    <th className="py-3 px-3 text-center w-24">Tie-Breaker</th>
                    <th className="py-3 px-5 text-right w-40">Total Poin</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y transition-colors ${
                    effectiveDark ? 'divide-slate-800/60' : 'divide-slate-100'
                  }`}
                >
                  {finalFilteredJuaraUmum.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Belum ada data akumulasi poin sekolah.
                      </td>
                    </tr>
                  ) : (
                    finalFilteredJuaraUmum.map(sch => {
                      const isChampion = sch.rank === 1;
                      const isRunnerUp1 = sch.rank === 2;
                      const isRunnerUp2 = sch.rank === 3;
                      const isMySchool = currentTeam?.schoolName &&
                        getNormalizedSchoolKey(currentTeam.jenjang, currentTeam.schoolName) === getNormalizedSchoolKey(sch.jenjang, sch.schoolName);
                      const barPct = Math.round(((Number(sch.totalPoints) || 0) / maxPoints) * 100);

                      return (
                        <tr
                          key={`${sch.jenjang}_${sch.schoolName}`}
                          className={`transition-colors ${
                            isMySchool
                              ? effectiveDark
                                ? 'bg-emerald-950/30'
                                : 'bg-emerald-50/60'
                              : isChampion
                              ? effectiveDark
                                ? 'bg-amber-950/20 hover:bg-amber-950/30'
                                : 'bg-amber-50/45 hover:bg-amber-50/80'
                              : effectiveDark
                              ? 'hover:bg-slate-800/40 text-slate-200'
                              : 'hover:bg-slate-50/80 text-slate-800'
                          }`}
                        >
                          {/* Rank */}
                          <td className="py-3.5 px-4 text-center align-middle">
                            {isChampion ? (
                              <div className="inline-flex items-center justify-center">
                                <RankMedal rank={1} className="w-10 h-10" title="Juara Umum" />
                              </div>
                            ) : (
                              <span className={`font-mono text-xs font-bold ${effectiveDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {sch.rank}
                              </span>
                            )}
                          </td>

                          {/* Pangkalan Sekolah */}
                          <td className="py-3.5 px-4 align-middle">
                            <div className="flex items-center gap-3">
                              <SchoolLogo
                                team={sch.team || sch.teams?.[0]?.team}
                                schoolName={sch.schoolName}
                                size="table"
                                isDark={effectiveDark}
                                className="w-8 h-8 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`font-extrabold text-[13px] leading-snug ${
                                      effectiveDark ? 'text-white' : 'text-slate-900'
                                    }`}
                                  >
                                    {sch.schoolName}
                                  </span>
                                </div>
                                <div className={`text-[10.5px] mt-0.5 ${effectiveDark ? 'text-slate-400' : 'text-slate-400'}`}>
                                  {sch.teams.length} Peleton
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Prestasi Peleton */}
                          <td className="py-3.5 px-4 align-middle">
                            {sch.peletonAchievements.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-2">
                                {sch.peletonAchievements.map((ach, i) => (
                                  <RankMedal
                                    key={i}
                                    rank={ach.rank}
                                    className="w-8 h-8"
                                    title={`${ach.shortTitle}${sch.teams.length > 1 && ach.suffix ? ` (Peleton ${ach.suffix})` : ''} • +${ach.points} Poin`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono">—</span>
                            )}
                          </td>

                          {/* Prestasi Danton */}
                          <td className="py-3.5 px-4 align-middle">
                            {sch.dantonAchievements.length > 0 ? (
                              <div className="space-y-1.5">
                                {sch.dantonAchievements.map((ach, i) => (
                                  <div key={i} className="flex items-center gap-2 min-w-0">
                                    <RankMedal
                                      rank={ach.rank}
                                      className="w-7 h-7"
                                      title={`${ach.shortTitle}${sch.teams.length > 1 && ach.suffix ? ` (Peleton ${ach.suffix})` : ''} • +${ach.points} Poin`}
                                    />
                                    <span
                                      className={`text-[11.5px] font-semibold truncate max-w-[200px] ${
                                        effectiveDark ? 'text-slate-300' : 'text-slate-700'
                                      }`}
                                      title={`${ach.dantonName} (${ach.shortTitle} • +${ach.points} Poin)`}
                                    >
                                      {ach.dantonName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono">—</span>
                            )}
                          </td>

                          {/* Tie-Breaker */}
                          <td className={`py-3.5 px-3 text-center align-middle font-mono text-xs ${effectiveDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {sch.bestMurniPeleton > 0 ? (
                              <span className="font-bold text-slate-800 dark:text-slate-200">{sch.bestMurniPeleton}</span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>

                          {/* Total Poin + Mini Visual Bar */}
                          <td className="py-3.5 px-5 text-right align-middle">
                            <div className="inline-flex flex-col items-end gap-1 min-w-[96px]">
                              <div className="flex items-baseline gap-1">
                                <span
                                  className={`font-mono font-black text-base leading-none ${
                                    isChampion
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : effectiveDark
                                      ? 'text-white'
                                      : 'text-slate-950'
                                  }`}
                                >
                                  {sch.totalPoints}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Poin
                                </span>
                              </div>
                              <div className={`w-24 h-1.5 rounded-full overflow-hidden ${effectiveDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isChampion ? 'bg-amber-400' : isRunnerUp1 ? 'bg-slate-400' : isRunnerUp2 ? 'bg-amber-700/80' : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>
      )}

      {/* Modal Kelola / Unduh Berita Acara */}
      {isBeritaAcaraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 sm:p-7 shadow-2xl relative transition-all ${
              effectiveDark
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                    Berita Acara Resmi Dewan Juri
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    LBB Mu'allimin 2027 • Dokumen Keputusan Sah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBeritaAcaraModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Modal: Form untuk Admin/Superadmin */}
            {isSuperOrAdmin ? (
              <form onSubmit={handleSaveBeritaAcara} className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <span className="font-bold block mb-0.5">ℹ️ Pengaturan Link Google Drive Berita Acara</span>
                  Masukkan link Google Drive Berita Acara resmi yang telah ditandatangani panitia/dewan juri. Pastikan akses sharing disetel ke <strong>"Anyone with the link can view"</strong>.
                </div>

                {/* Input Link SD/MI */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider block text-slate-700 dark:text-slate-300">
                    Link Google Drive — Jenjang SD/MI
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/... atau link folder"
                      value={beritaAcaraForm.sd}
                      onChange={(e) => setBeritaAcaraForm(prev => ({ ...prev, sd: e.target.value }))}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                        effectiveDark
                          ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:border-red-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:bg-white'
                      }`}
                    />
                    {beritaAcaraForm.sd && (
                      <a
                        href={beritaAcaraForm.sd}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2.5 top-2.5 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-sans font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tes Link</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Input Link SMP/MTs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider block text-slate-700 dark:text-slate-300">
                    Link Google Drive — Jenjang SMP/MTs
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/... atau link folder"
                      value={beritaAcaraForm.smp}
                      onChange={(e) => setBeritaAcaraForm(prev => ({ ...prev, smp: e.target.value }))}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                        effectiveDark
                          ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:border-red-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:bg-white'
                      }`}
                    />
                    {beritaAcaraForm.smp && (
                      <a
                        href={beritaAcaraForm.smp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2.5 top-2.5 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-sans font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tes Link</span>
                      </a>
                    )}
                  </div>
                </div>

                {saveSuccessNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Link Google Drive Berita Acara berhasil disimpan dan diperbarui!</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBeritaAcaraModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingBeritaAcara}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSavingBeritaAcara ? 'Menyimpan...' : 'Simpan Link Berita Acara'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Tampilan untuk Publik / Peserta */
              <div className="space-y-4">
                {(settings?.beritaAcaraUrlSD || settings?.beritaAcaraUrlSMP || settings?.beritaAcaraUrl) ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Dokumen Berita Acara Resmi Keputusan Dewan Juri telah dipublikasikan. Silakan klik jenjang untuk mengunduh:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(settings?.beritaAcaraUrlSD || settings?.beritaAcaraUrl) && (
                        <a
                          href={settings?.beritaAcaraUrlSD || settings?.beritaAcaraUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 rounded-2xl border border-red-500/30 bg-red-50/50 dark:bg-red-950/20 hover:border-red-500 transition-all flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-[10px] font-black uppercase text-red-600 block">Jenjang SD/MI</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">Unduh Dokumen</span>
                          </div>
                          <Download className="w-4 h-4 text-red-600" />
                        </a>
                      )}
                      {(settings?.beritaAcaraUrlSMP || settings?.beritaAcaraUrl) && (
                        <a
                          href={settings?.beritaAcaraUrlSMP || settings?.beritaAcaraUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-500 transition-all flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-[10px] font-black uppercase text-blue-600 block">Jenjang SMP/MTs</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">Unduh Dokumen</span>
                          </div>
                          <Download className="w-4 h-4 text-blue-600" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">
                        Dokumen Belum Tersedia
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Berita Acara Resmi keputusan dewan juri untuk jenjang {selectedJenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'} sedang dalam proses finalisasi pengesahan dan belum diunggah ke Google Drive.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsBeritaAcaraModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
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
      subtitle="Peringkat resmi Peleton, Komandan Terbaik, dan Juara Umum LBB Mu'allimin 2027"
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
