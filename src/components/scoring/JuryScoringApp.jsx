import React, { useState, useMemo } from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  Users,
  Printer,
  ChevronDown,
  ShieldCheck,
  Lock,
  Clock,
  AlertCircle,
  Circle,
  FileEdit,
  Search,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import {
  MATERIALS,
  JURY_POSTS,
  DANTON_CRITERIA,
  parseMaterialsList
} from '../../config.js';
import {
  calculatePenalties,
  calculateDantonScoreFromRubric,
  calculatePeletonScoreFromRubric
} from '../../context/scoringActions.js';
import { getChestNumberByLot } from '../../context/competitionHelpers.js';
import { formatImageUrl, getFallbackImageUrl } from '../../services/sheetService.js';
import { appToast } from '../../utils/appDialog.js';
import OfficialScoreRecapModal from './OfficialScoreRecapModal.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

// Subcomponents
import PbbScoringTable from './components/PbbScoringTable.jsx';
import DantonScoringTable from './components/DantonScoringTable.jsx';
import PenaltiesSection from './components/PenaltiesSection.jsx';
import ScrutineeringActionsBar from './components/ScrutineeringActionsBar.jsx';
import TeamSelectorModal from './components/TeamSelectorModal.jsx';
import LeaderboardView from './components/LeaderboardView.jsx';

// Helper membuat initial rubrik state untuk materi peleton (mencakup seluruh sub-gerakan)
function getInitialRubricScores(materialsList) {
  const initial = {};
  const parsed = parseMaterialsList(materialsList);
  parsed.forEach(item => {
    item.movements.forEach(m => {
      initial[m.key] = null;
    });
  });
  return initial;
}

// Helper initial rubrik danton (4 aspek resmi)
function getInitialDantonRubric() {
  const initial = {};
  DANTON_CRITERIA.forEach(c => {
    initial[c.id] = null;
  });
  return initial;
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

function TeamSchoolLogo({ team, size = 'card', bare = false }) {
  const [imgState, setImgState] = useState('primary');

  const rawLogo =
    team?.files?.schoolLogo?.url ||
    team?.file_logo_sekolah ||
    team?.logoUrl ||
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

  if (bare) {
    const bareSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
    return src ? (
      <img
        src={src}
        alt={team?.schoolName || 'Logo Sekolah'}
        className={`${bareSize} object-contain shrink-0`}
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
    ) : (
      <span className={`${bareSize} rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
        isSD ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
      }`}>
        {getSchoolInitials(team?.schoolName)}
      </span>
    );
  }

  const boxSize = size === 'header' ? 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl';

  return (
    <div className={`${boxSize} bg-white border border-slate-200/90 shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1.5`}>
      {src ? (
        <img
          src={src}
          alt={team?.schoolName || 'Logo Sekolah'}
          className="w-full h-full object-contain"
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
      ) : (
        <span className={`font-black text-sm tracking-tight ${isSD ? 'text-red-700' : 'text-blue-700'}`}>
          {getSchoolInitials(team?.schoolName)}
        </span>
      )}
    </div>
  );
}

export default function JuryScoringApp() {
  const {
    currentUser,
    teams,
    scores,
    staging,
    saveDraftScore,
    verifyScore,
    finalizeScore,
    unlockScore,
    setActiveView,
    openModal,
    isLocalhost
  } = useCompetition();

  // Akses Terbatas Khusus: Dewan Juri Lapangan, Operator Penginput, Superadmin
  const hasAccess = currentUser && [
    'juri',
    'penginput',
    'verifikator',
    'finalisator',
    'admin',
    'superadmin'
  ].includes(currentUser.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              Khusus Petugas & Dewan Juri
            </span>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-3">
              Portal E-Scoring & Scrutineering
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Halaman ini diperuntukkan bagi Petugas Penginput Nilai Kertas, Verifikator, dan Finalisator (Ketua Dewan Juri) LBB Mu'allimin 2027.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openModal('auth')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              Masuk Akun Petugas / Juri
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('scoring'); // 'scoring' | 'leaderboard'
  const [activeJuryPost, setActiveJuryPost] = useState('pos1'); // 'pos1' | 'pos2' | 'pos3' | 'penalti' | 'evidence'
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [sidebarJenjang, setSidebarJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Default: Belum memilih peleton (alur wajib pilih nomor dada terlebih dahulu)
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;
  const existingScore = selectedTeam ? scores[selectedTeam.id] : null;

  // Active materials list for selected team (SD: 26 gerakan, SMP: 28 gerakan)
  const materialsList = selectedTeam && selectedTeam.jenjang === 'SD' ? MATERIALS.SD : MATERIALS.SMP;

  // State Nilai 3 Dewan Juri (Peleton & Danton)
  const [j1PbbRubric, setJ1PbbRubric] = useState(() => getInitialRubricScores(materialsList));
  const [j1DantonRubric, setJ1DantonRubric] = useState(getInitialDantonRubric);

  const [j2PbbRubric, setJ2PbbRubric] = useState(() => getInitialRubricScores(materialsList));
  const [j2DantonRubric, setJ2DantonRubric] = useState(getInitialDantonRubric);

  const [j3PbbRubric, setJ3PbbRubric] = useState(() => getInitialRubricScores(materialsList));
  const [j3DantonRubric, setJ3DantonRubric] = useState(getInitialDantonRubric);

  // Upload Foto Lembar Fisik Kertas Juri
  const [paperEvidenceUrl, setPaperEvidenceUrl] = useState('');
  const [verificationNoteInput, setVerificationNoteInput] = useState('');

  // Penalties (Hakim Garis, Timer & Panitia)
  const [penalties, setPenalties] = useState({
    upacara: false,
    upacaraTerlambatBlocks: 0,
    dp1: false,
    personelKurang: false,
    overTimeBlocks: 0,
    injakGarisCount: 0,
    kotakDantonCount: 0,
    penyesuaianCount: 0,
    yelYelCount: 0,
    rokokCount: 0,
    basecampKotor: false,
  });

  const [juryNotes, setJuryNotes] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [durationSecondsPart, setDurationSecondsPart] = useState('');

  // Helper ubah durasi waktu tampil manual -> otomatis hitung overTimeBlocks sesuai batas SD (8 mnt) / SMP (12 mnt)
  function handleDurationChange(nextMinRaw, nextSecRaw) {
    const cleanMin = nextMinRaw === '' ? '' : String(Math.max(0, Math.min(59, parseInt(nextMinRaw, 10) || 0)));
    const cleanSec = nextSecRaw === '' ? '' : String(Math.max(0, Math.min(59, parseInt(nextSecRaw, 10) || 0)));
    setDurationMinutes(cleanMin);
    setDurationSecondsPart(cleanSec);

    if (cleanMin === '' && cleanSec === '') {
      setPenalties(prev => ({ ...prev, overTimeBlocks: 0 }));
      return;
    }

    const totalSec = (parseInt(cleanMin, 10) || 0) * 60 + (parseInt(cleanSec, 10) || 0);
    const maxSec = selectedTeam?.jenjang === 'SD' ? 8 * 60 : 12 * 60;
    const overtimeSec = Math.max(0, totalSec - maxSec);
    const blocks = overtimeSec > 0 ? Math.ceil(overtimeSec / 30) : 0;
    setPenalties(prev => ({ ...prev, overTimeBlocks: blocks }));
  }

  // Sinkronisasi penalti otomatis dari Field Timer, DP, atau Basecamp ke state lokal saat tim sedang dipilih
  React.useEffect(() => {
    if (!existingScore?.penalties) return;
    setPenalties(prev => ({
      ...prev,
      overTimeBlocks: existingScore.penalties.overTimeBlocks ?? prev.overTimeBlocks ?? 0,
      personelKurang: existingScore.penalties.personelKurang ?? prev.personelKurang ?? false,
      basecampKotor: existingScore.penalties.basecampKotor ?? prev.basecampKotor ?? false,
    }));
  }, [
    existingScore?.penalties?.overTimeBlocks,
    existingScore?.penalties?.personelKurang,
    existingScore?.penalties?.basecampKotor
  ]);

  // Sinkronisasi data saat memilih tim
  function handleSelectTeam(teamId) {
    setSelectedTeamId(teamId);
    const targetTeam = teams.find(t => t.id === teamId);
    const mList = targetTeam && targetTeam.jenjang === 'SD' ? MATERIALS.SD : MATERIALS.SMP;
    const score = scores[teamId];
    const juries = score?.juries || {};

    if (score) {
      // Juri 1
      setJ1PbbRubric(juries.pos1?.rubricScores || score.pbb?.rubricScores || getInitialRubricScores(mList));
      setJ1DantonRubric(juries.pos1?.dantonRubricScores || getInitialDantonRubric());

      // Juri 2
      setJ2PbbRubric(juries.pos2?.rubricScores || score.kekompakan?.rubricScores || getInitialRubricScores(mList));
      setJ2DantonRubric(juries.pos2?.dantonRubricScores || getInitialDantonRubric());

      // Juri 3
      setJ3PbbRubric(juries.pos3?.rubricScores || getInitialRubricScores(mList));
      setJ3DantonRubric(juries.pos3?.dantonRubricScores || score.danton?.rubricScores || getInitialDantonRubric());

      setPaperEvidenceUrl(score.paperEvidenceUrl || '');
      setVerificationNoteInput(score.verificationNotes || '');
      setPenalties(score.penalties || {
        upacara: false,
        upacaraTerlambatBlocks: 0,
        dp1: false,
        personelKurang: false,
        overTimeBlocks: 0,
        injakGarisCount: 0,
        kotakDantonCount: 0,
        penyesuaianCount: 0,
        yelYelCount: 0,
        rokokCount: 0,
        basecampKotor: false,
      });
      setJuryNotes(score.notes || '');
      const savedDurSec = score.durationSeconds ?? score.fieldTimerData?.durationSeconds ?? null;
      if (Number.isFinite(savedDurSec) && savedDurSec > 0) {
        setDurationMinutes(String(Math.floor(savedDurSec / 60)));
        setDurationSecondsPart(String(savedDurSec % 60).padStart(2, '0'));
      } else if (score.performanceDuration && score.performanceDuration.includes(':')) {
        const [mm, ss] = score.performanceDuration.split(':');
        setDurationMinutes(String(parseInt(mm, 10) || 0));
        setDurationSecondsPart(String(parseInt(ss, 10) || 0).padStart(2, '0'));
      } else {
        setDurationMinutes('');
        setDurationSecondsPart('');
      }
    } else {
      setJ1PbbRubric(getInitialRubricScores(mList));
      setJ1DantonRubric(getInitialDantonRubric());
      setJ2PbbRubric(getInitialRubricScores(mList));
      setJ2DantonRubric(getInitialDantonRubric());
      setJ3PbbRubric(getInitialRubricScores(mList));
      setJ3DantonRubric(getInitialDantonRubric());
      setPaperEvidenceUrl('');
      setVerificationNoteInput('');
      setPenalties({
        upacara: false,
        upacaraTerlambatBlocks: 0,
        dp1: false,
        personelKurang: false,
        overTimeBlocks: 0,
        injakGarisCount: 0,
        kotakDantonCount: 0,
        penyesuaianCount: 0,
        yelYelCount: 0,
        rokokCount: 0,
        basecampKotor: false,
      });
      setJuryNotes('');
      setDurationMinutes('');
      setDurationSecondsPart('');
    }
  }

  // Jika diarahkan dari Rekap Nilai dengan target peleton tertentu, langsung buka lembar nilainya
  React.useEffect(() => {
    try {
      const targetId = sessionStorage.getItem('lbb_scoring_target_team_id');
      if (targetId && teams.some(t => t.id === targetId)) {
        sessionStorage.removeItem('lbb_scoring_target_team_id');
        handleSelectTeam(targetId);
      }
    } catch {}
  }, [teams]);

  // Hitung Skor Peleton per Juri (berdasarkan akumulasi sub-gerakan sah)
  const j1PeletonTotal = useMemo(() => calculatePeletonScoreFromRubric(j1PbbRubric, materialsList), [j1PbbRubric, materialsList]);
  const j2PeletonTotal = useMemo(() => calculatePeletonScoreFromRubric(j2PbbRubric, materialsList), [j2PbbRubric, materialsList]);
  const j3PeletonTotal = useMemo(() => calculatePeletonScoreFromRubric(j3PbbRubric, materialsList), [j3PbbRubric, materialsList]);

  // Hitung Skor Danton per Juri (Bobot: Materi 35%, Vokal 25%, Sikap 20%, Lapangan 20%)
  const j1DantonTotal = useMemo(() => calculateDantonScoreFromRubric(j1DantonRubric), [j1DantonRubric]);
  const j2DantonTotal = useMemo(() => calculateDantonScoreFromRubric(j2DantonRubric), [j2DantonRubric]);
  const j3DantonTotal = useMemo(() => calculateDantonScoreFromRubric(j3DantonRubric), [j3DantonRubric]);

  // Kalkulasi Penalti Resmi (Peleton vs Danton)
  const penaltyCalc = useMemo(() => calculatePenalties(penalties), [penalties]);
  const peletonPenalty = penaltyCalc.peletonPenalty;
  const dantonPenalty = penaltyCalc.dantonPenalty;
  const totalCombinedPenalty = penaltyCalc.totalPenalty;

  // Nilai Murni & Nilai Akhir Peleton (Bab A.3.c Juknis)
  const nilaiMurniPeleton = useMemo(() => {
    return j1PeletonTotal + j2PeletonTotal + j3PeletonTotal;
  }, [j1PeletonTotal, j2PeletonTotal, j3PeletonTotal]);

  const nilaiAkhirPeleton = useMemo(() => {
    return Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)));
  }, [nilaiMurniPeleton, peletonPenalty]);

  // Nilai Murni & Nilai Akhir Danton (Bab A.3.c Juknis)
  const nilaiMurniDanton = useMemo(() => {
    return parseFloat((j1DantonTotal + j2DantonTotal + j3DantonTotal).toFixed(2));
  }, [j1DantonTotal, j2DantonTotal, j3DantonTotal]);

  const nilaiAkhirDanton = useMemo(() => {
    return Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)));
  }, [nilaiMurniDanton, dantonPenalty]);

  // Total Skor Gabungan (Peleton + Danton)
  const totalCombinedScore = useMemo(() => {
    return parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2));
  }, [nilaiAkhirPeleton, nilaiAkhirDanton]);

  // Upload Foto Lembar Kertas Fisik Juri
  function handlePaperEvidenceUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        setPaperEvidenceUrl(uploadEvt.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // 1. Simpan Draft Nilai oleh Penginput
  function handleSaveDraft(e) {
    e?.preventDefault();
    if (!selectedTeam) return;

    const hasDur = durationMinutes !== '' || durationSecondsPart !== '';
    const durMinNum = Math.max(0, parseInt(durationMinutes, 10) || 0);
    const durSecNum = Math.min(59, Math.max(0, parseInt(durationSecondsPart, 10) || 0));
    const totalDurationSeconds = hasDur ? (durMinNum * 60 + durSecNum) : null;
    const formattedDuration = hasDur
      ? `${String(durMinNum).padStart(2, '0')}:${String(durSecNum).padStart(2, '0')}`
      : '';

    saveDraftScore(selectedTeam.id, {
      juries: {
        pos1: {
          title: 'Dewan Juri 1',
          peletonTotal: j1PeletonTotal,
          dantonTotal: j1DantonTotal,
          rubricScores: j1PbbRubric,
          dantonRubricScores: j1DantonRubric,
        },
        pos2: {
          title: 'Dewan Juri 2',
          peletonTotal: j2PeletonTotal,
          dantonTotal: j2DantonTotal,
          rubricScores: j2PbbRubric,
          dantonRubricScores: j2DantonRubric,
        },
        pos3: {
          title: 'Dewan Juri 3',
          peletonTotal: j3PeletonTotal,
          dantonTotal: j3DantonTotal,
          rubricScores: j3PbbRubric,
          dantonRubricScores: j3DantonRubric,
        },
      },
      penalties: penaltyCalc,
      durationSeconds: totalDurationSeconds,
      performanceDuration: formattedDuration,
      paperEvidenceUrl,
      paperEvidenceName: `Lembar_Juri_${selectedTeam.regCode}.jpg`,
      notes: juryNotes,
    });

    const chestLabel = selectedTeam.chestNumber || getChestNumberByLot(selectedTeam.jenjang, selectedTeam.lotNumber) || selectedTeam.lotNumber || '';
    appToast(`Draft nilai Peleton #${chestLabel} (${selectedTeam.jenjang}) berhasil disimpan!`, { variant: 'success' });
  }

  // 2. Verifikasi Nilai oleh Verifikator
  function handleVerifyScoreAction(isApproved) {
    if (!selectedTeam) return;
    verifyScore(selectedTeam.id, isApproved, verificationNoteInput);
    appToast(
      isApproved
        ? `Nilai ${selectedTeam.schoolName} TERVERIFIKASI sah!`
        : `Nilai ${selectedTeam.schoolName} dikembalikan ke Draft untuk koreksi.`,
      { variant: isApproved ? 'success' : 'warning' }
    );
  }

  // 3. Finalisasi & Penguncian Nilai oleh Finalisator (Ketua Dewan Juri)
  function handleFinalizeScoreAction() {
    if (!selectedTeam) return;
    finalizeScore(selectedTeam.id, currentUser?.name || 'Ketua Dewan Juri');
    appToast(`Nilai ${selectedTeam.schoolName} dikunci permanen & Berita Acara resmi disahkan!`, { variant: 'success' });
  }

  // 4. Buka Kunci Nilai oleh Superadmin
  function handleUnlockScoreAction() {
    if (!selectedTeam) return;
    unlockScore(selectedTeam.id);
    appToast(`Kunci nilai ${selectedTeam.schoolName} dibuka kembali untuk pengeditan.`, { variant: 'info' });
  }

  const isTeamCheckedIn = (teamId) => {
    const st = staging?.[teamId];
    if (scores?.[teamId]) return true;
    if (!st) return false;
    return Boolean(
      st.dp1Passed ||
      st.readyForScoring ||
      st.checklist?.dp1Verification ||
      ['dp2', 'arena', 'finished', 'checkout'].includes(st.stage) ||
      ['dp2', 'dp3', 'arena', 'completed', 'checkout'].includes(st.status)
    );
  };

  const [scoreStatusFilter, setScoreStatusFilter] = useState('ALL'); // 'ALL' | 'UNSCORED' | 'SCORED'

  const isEligibleForScoring = (t) => {
    if (isLocalhost) return t.status !== 'rejected';
    return (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id);
  };

  const sortByChestAndLot = (a, b) => {
    const aLot = Number(a.lotNumber) || 999;
    const bLot = Number(b.lotNumber) || 999;
    if (aLot !== bLot) return aLot - bLot;
    const aJenjang = a.jenjang === 'SD' ? 0 : 1;
    const bJenjang = b.jenjang === 'SD' ? 0 : 1;
    if (aJenjang !== bJenjang) return aJenjang - bJenjang;
    const aChestRaw = a.chestNumber || getChestNumberByLot(a.jenjang, a.lotNumber);
    const bChestRaw = b.chestNumber || getChestNumberByLot(b.jenjang, b.lotNumber);
    const aNum = parseInt(aChestRaw, 10);
    const bNum = parseInt(bChestRaw, 10);
    if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) return aNum - bNum;
    return String(a.schoolName || '').localeCompare(String(b.schoolName || ''));
  };

  const jenjangEligibleTeams = useMemo(() => {
    return teams
      .filter(isEligibleForScoring)
      .filter(t => sidebarJenjang === 'ALL' || t.jenjang === sidebarJenjang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, staging, scores, sidebarJenjang, isLocalhost]);

  const isTeamIdentityRevealed = (teamId) => {
    const sc = scores[teamId];
    if (!sc) return false;
    return Boolean(sc.isLocked || sc.status === 'finalized' || sc.status === 'verified');
  };

  const verifiedTeams = useMemo(() => {
    return jenjangEligibleTeams
      .filter(t => {
        if (scoreStatusFilter === 'UNSCORED') return !scores[t.id];
        if (scoreStatusFilter === 'SCORED') return Boolean(scores[t.id]);
        return true;
      })
      .filter(t => {
        if (!sidebarSearch.trim()) return true;
        const q = sidebarSearch.toLowerCase().replace(/^#/, '');
        const chest = String(t.chestNumber || getChestNumberByLot(t.jenjang, t.lotNumber) || '');
        const lotStr = t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '';
        if (chest.includes(q) || lotStr.includes(q) || String(t.lotNumber || '').includes(q)) return true;
        // Identitas sekolah/danton hanya bisa dicari jika sudah selesai dinilai (Anti-Bias)
        if (!isTeamIdentityRevealed(t.id)) return false;
        return (
          t.schoolName?.toLowerCase().includes(q) ||
          t.platoonName?.toLowerCase().includes(q) ||
          (t.roster?.danton?.name && t.roster.danton.name.toLowerCase().includes(q)) ||
          (t.dantonName && t.dantonName.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const aScored = Boolean(scores[a.id]) ? 1 : 0;
        const bScored = Boolean(scores[b.id]) ? 1 : 0;
        if (aScored !== bScored) return aScored - bScored;
        return sortByChestAndLot(a, b);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenjangEligibleTeams, scores, scoreStatusFilter, sidebarSearch]);

  const unscoredTeamsList = useMemo(
    () => verifiedTeams.filter(t => !scores[t.id]),
    [verifiedTeams, scores]
  );
  const scoredTeamsList = useMemo(
    () => verifiedTeams.filter(t => Boolean(scores[t.id])),
    [verifiedTeams, scores]
  );

  const totalDrawnCount = jenjangEligibleTeams.length;
  const scoredCount = jenjangEligibleTeams.filter(t => Boolean(scores[t.id])).length;
  const unscoredCount = Math.max(0, totalDrawnCount - scoredCount);

  // Hitung progres input per Juri (jumlah gerakan terisi) untuk indikator di tab Juri 1/2/3
  const parsedMaterialsForProgress = useMemo(() => parseMaterialsList(materialsList), [materialsList]);
  const totalMovementsCount = useMemo(
    () => parsedMaterialsForProgress.reduce((acc, it) => acc + it.movements.length, 0),
    [parsedMaterialsForProgress]
  );

  const countFilledMovements = (rubric) => {
    let count = 0;
    parsedMaterialsForProgress.forEach(it => {
      it.movements.forEach(m => {
        const val = rubric?.[m.key] !== undefined && rubric?.[m.key] !== null
          ? rubric[m.key]
          : (m.subIndex === 0 && rubric?.[it.originalIndex] !== undefined && rubric?.[it.originalIndex] !== null
              ? rubric[it.originalIndex]
              : null);
        if (val !== null && val !== undefined) count++;
      });
    });
    return count;
  };

  const j1FilledCount = useMemo(() => countFilledMovements(j1PbbRubric), [parsedMaterialsForProgress, j1PbbRubric]);
  const j2FilledCount = useMemo(() => countFilledMovements(j2PbbRubric), [parsedMaterialsForProgress, j2PbbRubric]);
  const j3FilledCount = useMemo(() => countFilledMovements(j3PbbRubric), [parsedMaterialsForProgress, j3PbbRubric]);

  const handleCycleScoringTeam = (delta) => {
    const pool = teams.filter(isEligibleForScoring);
    if (pool.length <= 1 || !selectedTeam) return;
    const idx = pool.findIndex(t => t.id === selectedTeam.id);
    const nextIdx = idx < 0 ? 0 : (idx + delta + pool.length) % pool.length;
    handleSelectTeam(pool[nextIdx].id);
  };

  // Hak Akses Input Nilai:
  // - Superadmin selalu dapat mengedit (bahkan jika terkunci/final)
  // - Juri, Penginput, Admin, Finalisator, Verifikator dapat mengisi nilai selama belum dikunci permanen
  const isSuperadmin = currentUser?.role === 'superadmin';
  const isScoreLocked = Boolean(existingScore?.isLocked || existingScore?.status === 'finalized');
  const isInputDisabled = !isSuperadmin && isScoreLocked;

  return (
    <SimpaskorSidebarLayout
      activeMenu="penjurian"
      title="E-Scoring & Penjurian"
      subtitle="Input Lembar 3 Dewan Juri (Peleton & Danton), Penalti & Pengesahan Nilai"
      hideHeader={true}
    >
      <div className="space-y-4 max-w-7xl mx-auto pb-10">

        {/* 1. ALUR PENJURIAN: SCREEN 1 (PILIH PELETON — 1 KARTU TERPADU, TANPA 3 HEADER BERTUMPUK) */}
        {activeTab === 'scoring' && !selectedTeam && (
          <section className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden">
            {/* Dark Obsidian Command Header Banner */}
            <div className="bg-slate-950 text-white px-4 py-4 sm:px-6 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[15px] sm:text-base font-black uppercase tracking-tight text-white leading-tight">
                      E-Scoring &amp; Penjurian Lapangan
                    </h1>
                  </div>
                  <p className="text-[11.5px] text-slate-400 mt-1 truncate">
                    Pilih peleton sesuai No. Dada · Petugas: <strong className="text-slate-200">{currentUser?.email}</strong>
                  </p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveView('live_leaderboard')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 active:scale-95 text-white border border-white/15 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Buka Papan Klasemen & Hasil Lomba"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Klasemen</span>
                </button>

                {(currentUser?.role === 'finalisator' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                  <button
                    type="button"
                    onClick={() => setIsRecapModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 active:scale-95 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Cetak Berita Acara Rekapitulasi Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Berita Acara PDF</span>
                  </button>
                )}
              </div>
            </div>

            {/* Slim Progress Strip */}
            <div className="h-1 w-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${totalDrawnCount > 0 ? Math.round((scoredCount / totalDrawnCount) * 100) : 0}%` }}
              />
            </div>

            {/* Flush Underline Division Tabs: Semua | SD / MI | SMP / MTs */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70">
              <button
                type="button"
                onClick={() => setSidebarJenjang('ALL')}
                className={`relative py-2.5 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-r border-slate-200/80 ${
                  sidebarJenjang === 'ALL'
                    ? 'bg-white text-slate-950 font-black'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-bold'
                }`}
              >
                <span>Semua</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                  sidebarJenjang === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {teams.filter(isEligibleForScoring).length}
                </span>
                {sidebarJenjang === 'ALL' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950" />}
              </button>

              <button
                type="button"
                onClick={() => setSidebarJenjang('SD')}
                className={`relative py-2.5 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-r border-slate-200/80 ${
                  sidebarJenjang === 'SD'
                    ? 'bg-white text-red-700 font-black'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-bold'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${sidebarJenjang === 'SD' ? 'bg-red-600' : 'bg-slate-300'}`} />
                <span>SD / MI</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                  sidebarJenjang === 'SD' ? 'bg-red-100 text-red-700' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {teams.filter(t => t.jenjang === 'SD' && isEligibleForScoring(t)).length}
                </span>
                {sidebarJenjang === 'SD' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
              </button>

              <button
                type="button"
                onClick={() => setSidebarJenjang('SMP')}
                className={`relative py-2.5 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  sidebarJenjang === 'SMP'
                    ? 'bg-white text-blue-700 font-black'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-bold'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${sidebarJenjang === 'SMP' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span>SMP / MTs</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                  sidebarJenjang === 'SMP' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {teams.filter(t => t.jenjang === 'SMP' && isEligibleForScoring(t)).length}
                </span>
                {sidebarJenjang === 'SMP' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            </div>

            {/* Body: Search + Status Filter + Grid Peleton */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={e => setSidebarSearch(e.target.value)}
                    placeholder="Cari Nomor Dada (#111) atau No. Urut (#01)..."
                    className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 outline-none transition-colors"
                  />
                  {sidebarSearch && (
                    <button
                      type="button"
                      onClick={() => setSidebarSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
                  {[
                    { id: 'ALL', label: `Semua (${totalDrawnCount})` },
                    { id: 'UNSCORED', label: `Belum Dinilai (${unscoredCount})` },
                    { id: 'SCORED', label: `Sudah Dinilai (${scoredCount})` },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setScoreStatusFilter(f.id)}
                      className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        scoreStatusFilter === f.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Kartu Peleton (Urut No. Dada · Yang Sudah Dinilai Otomatis di Bawah) */}
              {verifiedTeams.length === 0 ? (
                <div className="py-14 text-center space-y-2.5 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                  <Users className="w-9 h-9 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">
                    Tidak ada peleton yang cocok dengan filter / pencarian.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Peleton akan otomatis masuk ke daftar siap dinilai setelah lolos inspeksi personel di Pos DP 1.
                  </p>
                </div>
              ) : (() => {
                const renderTeamCard = (team) => {
                  const teamScore = scores[team.id];
                  const isFinal = teamScore?.isLocked || teamScore?.status === 'finalized';
                  const isDraft = teamScore?.status === 'draft';
                  const isVerified = teamScore?.status === 'verified';
                  const isSD = team.jenjang === 'SD';
                  const chestNum = team.chestNumber || getChestNumberByLot(team.jenjang, team.lotNumber);
                  const totalPts = Number(teamScore?.finalScore || 0);
                  const revealed = isTeamIdentityRevealed(team.id);

                  const juries = teamScore?.juries || {};
                  const j1Done = Boolean((juries.pos1?.peletonTotal || 0) > 0 || (juries.pos1?.dantonTotal || 0) > 0);
                  const j2Done = Boolean((juries.pos2?.peletonTotal || 0) > 0 || (juries.pos2?.dantonTotal || 0) > 0);
                  const j3Done = Boolean((juries.pos3?.peletonTotal || 0) > 0 || (juries.pos3?.dantonTotal || 0) > 0);
                  const hasPen = Boolean((teamScore?.penalties?.totalPenalty || 0) > 0);

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleSelectTeam(team.id)}
                      className={`bg-white border rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between gap-3 group ${
                        isFinal
                          ? 'border-emerald-200/90 bg-emerald-50/15 hover:border-emerald-400'
                          : isVerified
                          ? 'border-blue-200/90 hover:border-blue-400'
                          : isDraft
                          ? 'border-amber-200/90 hover:border-amber-400'
                          : isSD
                          ? 'border-slate-200 hover:border-red-400 hover:bg-red-50/15'
                          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Blok No. Dada Menonjol */}
                        <div className={`min-w-[66px] h-14 px-2 rounded-xl flex flex-col items-center justify-center shrink-0 text-white shadow-xs ${
                          isFinal
                            ? 'bg-emerald-600'
                            : isSD
                            ? 'bg-red-600'
                            : 'bg-blue-600'
                        }`}>
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 leading-none">
                            No. Dada
                          </span>
                          <span className="text-2xl font-mono font-black leading-none tracking-tight mt-0.5">
                            {chestNum || '-'}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded-md border leading-none ${
                                isSD
                                  ? 'text-red-700 bg-red-50 border-red-200'
                                  : 'text-blue-700 bg-blue-50 border-blue-200'
                              }`}>
                                {isSD ? 'SD' : 'SMP'}
                              </span>
                              {team.lotNumber && (
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                  Urut #{String(team.lotNumber).padStart(2, '0')}
                                </span>
                              )}
                            </div>

                            {/* Status Badge dengan Ikon Progres */}
                            {isFinal ? (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Final</span>
                              </span>
                            ) : isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full shrink-0">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Verif</span>
                              </span>
                            ) : isDraft ? (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                                <FileEdit className="w-2.5 h-2.5" />
                                <span>Draft</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                                <Clock className="w-2.5 h-2.5 text-slate-400" />
                                <span>Belum</span>
                              </span>
                            )}
                          </div>

                          {revealed ? (
                            <>
                              <h4 className="font-black text-[13px] text-slate-900 uppercase group-hover:text-slate-950 leading-snug line-clamp-1" title={team.schoolName}>
                                {team.schoolName}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-500 truncate">
                                {team.roster?.danton?.name || team.dantonName || '-'}
                              </p>
                            </>
                          ) : (
                            <>
                              <h4 className="font-black text-[13px] text-slate-900 uppercase group-hover:text-slate-950 leading-snug line-clamp-1">
                                Peleton #{chestNum || (team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '—')}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-400 truncate">
                                {isSD ? 'Tingkat SD / MI' : 'Tingkat SMP / MTs'}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Baris Ikon Progres 3 Juri + Penalti */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          {[
                            { label: 'J1', done: j1Done },
                            { label: 'J2', done: j2Done },
                            { label: 'J3', done: j3Done },
                          ].map(j => (
                            <span
                              key={j.label}
                              title={`${j.label}: ${j.done ? 'Sudah diisi' : 'Belum diisi'}`}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                                j.done
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200/80'
                              }`}
                            >
                              {j.done ? (
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Circle className="w-2.5 h-2.5 text-slate-300" />
                              )}
                              <span>{j.label}</span>
                            </span>
                          ))}
                          {hasPen && (
                            <span
                              title={`Penalti: -${teamScore.penalties.totalPenalty} poin`}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                              <span>-{teamScore.penalties.totalPenalty}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {totalPts > 0 && (
                            <span className="font-mono font-black text-xs text-emerald-700">
                              {totalPts.toLocaleString('id-ID')}
                            </span>
                          )}
                          <span className="font-black text-[11px] text-slate-900 group-hover:text-emerald-700 inline-flex items-center gap-1 transition-colors">
                            <span>{teamScore ? 'Buka' : 'Nilai'}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <div className="space-y-5">
                    {/* Bagian 1: Antrean Belum Dinilai (Prioritas di Atas) */}
                    {unscoredTeamsList.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {unscoredTeamsList.map(renderTeamCard)}
                      </div>
                    )}

                    {/* Bagian 2: Sudah Dinilai (Otomatis Pindah ke Bawah dengan Pemisah) */}
                    {scoredTeamsList.length > 0 && (
                      <div className="space-y-3">
                        {unscoredTeamsList.length > 0 && (
                          <div className="flex items-center gap-3 pt-2">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Sudah Dinilai ({scoredTeamsList.length})</span>
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {scoredTeamsList.map(renderTeamCard)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {/* 2. SCREEN 2: LEMBAR PENJURIAN AKTIF (COMPACT COMMAND BAR + LIVE SCORE STRIP) */}
        {activeTab === 'scoring' && selectedTeam && (
          <div className="space-y-4">
            {/* Compact Sticky Team & Live Score Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_24px_rgba(15,23,42,0.04)] overflow-hidden">
              {/* Thin Top Division Accent */}
              <div className={`h-1 w-full ${selectedTeam.jenjang === 'SD' ? 'bg-red-600' : 'bg-blue-600'}`} />

              {/* Top Row: Segmented Nav + Team Identity + Lightweight Status/Duration */}
              <div className="px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Unified Segmented Navigation (Daftar + Prev/Next) */}
                  <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100/90 border border-slate-200/80 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedTeamId('')}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Kembali ke daftar pemilihan peleton"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Daftar</span>
                    </button>
                    {totalDrawnCount > 1 && (
                      <div className="hidden sm:flex items-center pl-0.5">
                        <button
                          type="button"
                          onClick={() => handleCycleScoringTeam(-1)}
                          className="w-7 h-7 rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                          title="Peleton Sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCycleScoringTeam(1)}
                          className="w-7 h-7 rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                          title="Peleton Berikutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Blok No. Dada Menonjol */}
                  <div className={`min-w-[58px] h-11 px-2.5 rounded-xl flex flex-col items-center justify-center shrink-0 text-white shadow-xs ${
                    selectedTeam.jenjang === 'SD' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    <span className="text-[7px] font-bold uppercase tracking-widest opacity-80 leading-none">
                      No. Dada
                    </span>
                    <span className="text-lg font-mono font-black leading-none tracking-tight mt-0.5">
                      {selectedTeam?.chestNumber || getChestNumberByLot(selectedTeam?.jenjang, selectedTeam?.lotNumber) || '-'}
                    </span>
                  </div>

                  {/* Logo Sekolah (Hanya tampil jika nilai sudah selesai/terverifikasi — Mode Anti-Bias) */}
                  {isTeamIdentityRevealed(selectedTeam.id) && (
                    <TeamSchoolLogo team={selectedTeam} bare={true} />
                  )}

                  {/* Identitas 2 Baris Seimbang (Blind Judging saat proses penilaian) */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight truncate leading-tight">
                        {isTeamIdentityRevealed(selectedTeam.id)
                          ? selectedTeam.schoolName
                          : `Peleton #${selectedTeam?.chestNumber || getChestNumberByLot(selectedTeam?.jenjang, selectedTeam?.lotNumber) || (selectedTeam?.lotNumber ? String(selectedTeam.lotNumber).padStart(2, '0') : '—')}`}
                      </h2>
                      <span className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border leading-none shrink-0 ${
                        selectedTeam?.jenjang === 'SD'
                          ? 'text-red-700 bg-red-50 border-red-200/80'
                          : 'text-blue-700 bg-blue-50 border-blue-200/80'
                      }`}>
                        {selectedTeam?.jenjang || 'SD'}
                      </span>
                      {selectedTeam?.lotNumber && (
                        <span className="text-[10.5px] font-mono font-bold text-slate-400 shrink-0">
                          Urut #{String(selectedTeam.lotNumber).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    {isTeamIdentityRevealed(selectedTeam.id) ? (
                      <p className="text-[11.5px] font-medium text-slate-500 truncate mt-0.5">
                        {selectedTeam?.roster?.danton?.name || selectedTeam?.dantonName || '-'}
                      </p>
                    ) : (
                      <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                        {selectedTeam?.jenjang === 'SD' ? 'Tingkat SD / MI' : 'Tingkat SMP / MTs'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Lightweight Right Meta: Durasi Tampil + Status */}
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={() => setActiveJuryPost('penalti')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      durationMinutes !== '' || durationSecondsPart !== ''
                        ? 'bg-slate-50 border-slate-200/90 text-slate-800 hover:bg-slate-100'
                        : 'bg-white border-dashed border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                    }`}
                    title="Input atau ubah durasi waktu tampil di tab Penalti"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-bold text-[11.5px]">
                      {durationMinutes !== '' || durationSecondsPart !== ''
                        ? `${String(Math.max(0, parseInt(durationMinutes, 10) || 0)).padStart(2, '0')}:${String(Math.min(59, Math.max(0, parseInt(durationSecondsPart, 10) || 0))).padStart(2, '0')}`
                        : 'Durasi --:--'}
                    </span>
                  </button>

                  {existingScore?.isLocked || existingScore?.status === 'finalized' ? (
                    <span className="text-[10.5px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 leading-none">
                      <Lock className="w-3 h-3" />
                      <span>Final</span>
                    </span>
                  ) : existingScore?.status === 'verified' ? (
                    <span className="text-[10.5px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg leading-none">
                      Terverifikasi
                    </span>
                  ) : existingScore?.status === 'draft' ? (
                    <span className="text-[10.5px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg leading-none">
                      Draft
                    </span>
                  ) : (
                    <span className="text-[10.5px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200/80 px-2.5 py-1.5 rounded-lg leading-none">
                      Belum Dinilai
                    </span>
                  )}
                </div>
              </div>

              {/* 4-Step Flush Underline Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200/90 bg-slate-50/50">
                {[
                  { id: 'pos1', label: 'Juri 1', filled: j1FilledCount, total: j1PeletonTotal + j1DantonTotal },
                  { id: 'pos2', label: 'Juri 2', filled: j2FilledCount, total: j2PeletonTotal + j2DantonTotal },
                  { id: 'pos3', label: 'Juri 3', filled: j3FilledCount, total: j3PeletonTotal + j3DantonTotal },
                ].map(j => {
                  const isDone = totalMovementsCount > 0 && j.filled >= totalMovementsCount;
                  const isActive = activeJuryPost === j.id;
                  return (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setActiveJuryPost(j.id)}
                      className={`relative py-2.5 px-2.5 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-r border-slate-200/70 ${
                        isActive
                          ? 'bg-white text-slate-950 font-extrabold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-semibold'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span>{j.label}</span>
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : j.filled > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200/70 text-slate-500'
                      }`}>
                        {isDone ? (j.total > 0 ? j.total.toFixed(0) : 'OK') : j.filled > 0 ? `${j.filled}/${totalMovementsCount}` : '—'}
                      </span>
                      {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950" />}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveJuryPost('penalti')}
                  className={`relative py-2.5 px-2.5 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeJuryPost === 'penalti'
                      ? 'bg-white text-rose-700 font-extrabold'
                      : 'text-slate-500 hover:text-rose-700 hover:bg-white/60 font-semibold'
                  }`}
                >
                  <span>Penalti</span>
                  {totalCombinedPenalty > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md leading-none font-bold bg-rose-100 text-rose-800">
                      -{totalCombinedPenalty}
                    </span>
                  )}
                  {activeJuryPost === 'penalti' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
                </button>
              </div>
            </div>

            {/* 2 Symmetrical Dark Obsidian Scoreboard Cards: Nilai Peleton & Nilai Danton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-slate-800 p-px shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
              {/* Card Peleton */}
              <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedTeam?.jenjang === 'SD' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                      Nilai Akhir Peleton
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight leading-none mt-2">
                    {nilaiAkhirPeleton}
                  </div>
                </div>

                <div className="flex items-center gap-5 border-l border-slate-800 pl-5">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block">Nilai Murni</span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-1 block">{nilaiMurniPeleton}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block">Penalti</span>
                    <span className={`text-sm font-mono font-bold mt-1 block ${peletonPenalty > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {peletonPenalty > 0 ? `-${peletonPenalty}` : '0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Danton */}
              <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                      Nilai Akhir Danton
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight leading-none mt-2">
                    {nilaiAkhirDanton}
                  </div>
                </div>

                <div className="flex items-center gap-5 border-l border-slate-800 pl-5">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block">Nilai Murni</span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-1 block">{nilaiMurniDanton}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block">Penalti</span>
                    <span className={`text-sm font-mono font-bold mt-1 block ${dantonPenalty > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {dantonPenalty > 0 ? `-${dantonPenalty}` : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Status Kunci Nilai */}
            {isScoreLocked && (
              <div className={`px-4 py-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                isSuperadmin
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-black uppercase tracking-wider">
                      {isSuperadmin ? 'Mode Override Superadmin: Nilai Terkunci' : 'Nilai Peleton Ini Telah Dikunci Permanen (Final)'}
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {isSuperadmin
                        ? 'Sebagai Superadmin, Anda dapat langsung mengedit tombol nilai di bawah atau membuka kunci peleton ini.'
                        : 'Nilai telah disahkan dan tidak dapat diubah di lapangan. Hubungi Superadmin jika butuh revisi.'}
                    </p>
                  </div>
                </div>
                {isSuperadmin && (
                  <button
                    type="button"
                    onClick={handleUnlockScoreAction}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-2xs"
                  >
                    Buka Kunci
                  </button>
                )}
              </div>
            )}

            {/* FORMULIR LEMBAR JURI TERPADU (PELETON DI ATAS, KOMANDAN DI BAWAH) */}
            <form onSubmit={handleSaveDraft} className="space-y-6">
              
              {/* LEMBAR JURI 1 (Peleton + Danton Satu Lembar Runtut) */}
              {activeJuryPost === 'pos1' && (
                <div className="space-y-6">
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={j1PbbRubric}
                    setRubricScores={setJ1PbbRubric}
                    isInputDisabled={isInputDisabled}
                    juryLabel={`Juri 1 ${selectedTeam?.jenjang || 'SD'}`}
                  />
                  <DantonScoringTable
                    dantonRubricScores={j1DantonRubric}
                    setDantonRubricScores={setJ1DantonRubric}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={j1DantonTotal}
                    juryLabel={`Juri 1 ${selectedTeam?.jenjang || 'SD'}`}
                  />
                </div>
              )}

              {/* LEMBAR JURI 2 (Peleton + Danton Satu Lembar Runtut) */}
              {activeJuryPost === 'pos2' && (
                <div className="space-y-6">
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={j2PbbRubric}
                    setRubricScores={setJ2PbbRubric}
                    isInputDisabled={isInputDisabled}
                    juryLabel={`Juri 2 ${selectedTeam?.jenjang || 'SD'}`}
                  />
                  <DantonScoringTable
                    dantonRubricScores={j2DantonRubric}
                    setDantonRubricScores={setJ2DantonRubric}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={j2DantonTotal}
                    juryLabel={`Juri 2 ${selectedTeam?.jenjang || 'SD'}`}
                  />
                </div>
              )}

              {/* LEMBAR JURI 3 (Peleton + Danton Satu Lembar Runtut) */}
              {activeJuryPost === 'pos3' && (
                <div className="space-y-6">
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={j3PbbRubric}
                    setRubricScores={setJ3PbbRubric}
                    isInputDisabled={isInputDisabled}
                    juryLabel={`Juri 3 ${selectedTeam?.jenjang || 'SD'}`}
                  />
                  <DantonScoringTable
                    dantonRubricScores={j3DantonRubric}
                    setDantonRubricScores={setJ3DantonRubric}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={j3DantonTotal}
                    juryLabel={`Juri 3 ${selectedTeam?.jenjang || 'SD'}`}
                  />
                </div>
              )}

              {/* TAB PENALTI LAPANGAN */}
              {activeJuryPost === 'penalti' && (
                <PenaltiesSection
                  penalties={penalties}
                  setPenalties={setPenalties}
                  selectedTeam={selectedTeam}
                  peletonPenalty={peletonPenalty}
                  dantonPenalty={dantonPenalty}
                  isInputDisabled={isInputDisabled}
                  durationMinutes={durationMinutes}
                  durationSecondsPart={durationSecondsPart}
                  onDurationChange={handleDurationChange}
                />
              )}

              {/* Quick Step Navigator antar Tab Juri tanpa perlu scroll balik ke atas */}
              {(() => {
                const steps = [
                  { id: 'pos1', label: 'Juri 1' },
                  { id: 'pos2', label: 'Juri 2' },
                  { id: 'pos3', label: 'Juri 3' },
                  { id: 'penalti', label: 'Penalti' },
                ];
                const curIdx = steps.findIndex(s => s.id === activeJuryPost);
                const prevStep = curIdx > 0 ? steps[curIdx - 1] : null;
                const nextStep = curIdx >= 0 && curIdx < steps.length - 1 ? steps[curIdx + 1] : null;

                return (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {prevStep ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveJuryPost(prevStep.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke {prevStep.label}</span>
                      </button>
                    ) : <div />}

                    {nextStep && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveJuryPost(nextStep.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                      >
                        <span>Lanjut ke {nextStep.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Actions & Pengesahan Juri */}
              <ScrutineeringActionsBar
                existingScore={existingScore}
                currentUser={currentUser}
                juryNotes={juryNotes}
                setJuryNotes={setJuryNotes}
                handleSaveDraft={handleSaveDraft}
                handleVerifyScoreAction={handleVerifyScoreAction}
                handleFinalizeScoreAction={handleFinalizeScoreAction}
                handleUnlockScoreAction={handleUnlockScoreAction}
                setIsRecapModalOpen={setIsRecapModalOpen}
              />
            </form>
          </div>
        )}

        {/* TAB 2: LIVE LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-3.5 sm:px-5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Klasemen Sementara Dewan Juri
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('scoring')}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Penjurian</span>
              </button>
            </div>
            <LeaderboardView
              teams={teams}
              scores={scores}
              setIsRecapModalOpen={setIsRecapModalOpen}
            />
          </div>
        )}

        {/* Modal Pemilih Peleton */}
        <TeamSelectorModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          verifiedTeams={verifiedTeams}
          selectedTeamId={selectedTeamId}
          handleSelectTeam={handleSelectTeam}
          scores={scores}
          sidebarJenjang={sidebarJenjang}
          setSidebarJenjang={setSidebarJenjang}
          sidebarSearch={sidebarSearch}
          setSidebarSearch={setSidebarSearch}
          allTeamsCount={teams.filter(isEligibleForScoring).length}
          smpTeamsCount={teams.filter(t => t.jenjang === 'SMP' && isEligibleForScoring(t)).length}
          sdTeamsCount={teams.filter(t => t.jenjang === 'SD' && isEligibleForScoring(t)).length}
        />

        {/* Modal Berita Acara Rekap Nilai Resmi (Print-Ready) */}
        <OfficialScoreRecapModal
          isOpen={isRecapModalOpen}
          onClose={() => setIsRecapModalOpen(false)}
        />

      </div>
    </SimpaskorSidebarLayout>
  );
}
