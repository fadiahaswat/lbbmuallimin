import React, { useState, useMemo } from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  Users,
  Printer,
  ChevronDown,
  ShieldCheck,
  Camera,
  Lock,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import {
  MATERIALS,
  JURY_POSTS,
  DANTON_CRITERIA
} from '../../config.js';
import {
  calculatePenalties,
  calculateDantonScoreFromRubric,
  calculatePeletonScoreFromRubric
} from '../../context/scoringActions.js';
import OfficialScoreRecapModal from './OfficialScoreRecapModal.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

// Subcomponents
import PbbScoringTable from './components/PbbScoringTable.jsx';
import DantonScoringTable from './components/DantonScoringTable.jsx';
import PenaltiesSection from './components/PenaltiesSection.jsx';
import EvidenceSection from './components/EvidenceSection.jsx';
import ScrutineeringActionsBar from './components/ScrutineeringActionsBar.jsx';
import TeamSelectorModal from './components/TeamSelectorModal.jsx';
import LeaderboardView from './components/LeaderboardView.jsx';

// Helper membuat initial rubrik state untuk materi peleton
function getInitialRubricScores(materialsList) {
  const initial = {};
  materialsList.forEach((_m, idx) => {
    initial[idx] = null;
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
    openModal
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
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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
    }
  }

  // Hitung Skor Peleton per Juri
  const j1PeletonTotal = useMemo(() => calculatePeletonScoreFromRubric(j1PbbRubric), [j1PbbRubric]);
  const j2PeletonTotal = useMemo(() => calculatePeletonScoreFromRubric(j2PbbRubric), [j2PbbRubric]);
  const j3PeletonTotal = useMemo(() => calculatePeletonScoreFromRubric(j3PbbRubric), [j3PbbRubric]);

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
      paperEvidenceUrl,
      paperEvidenceName: `Lembar_Juri_${selectedTeam.regCode}.jpg`,
      notes: juryNotes,
    });

    setSaveSuccessMsg(`Draft nilai untuk ${selectedTeam.schoolName} (${selectedTeam.jenjang}) berhasil disimpan! Menunggu verifikasi.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  }

  // 2. Verifikasi Nilai oleh Verifikator
  function handleVerifyScoreAction(isApproved) {
    if (!selectedTeam) return;
    verifyScore(selectedTeam.id, isApproved, verificationNoteInput);
    setSaveSuccessMsg(
      isApproved
        ? `Nilai ${selectedTeam.schoolName} TERVERIFIKASI sah!`
        : `Nilai ${selectedTeam.schoolName} DIKEMBALIKAN ke Penginput untuk koreksi.`
    );
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  }

  // 3. Finalisasi & Penguncian Nilai oleh Finalisator (Ketua Dewan Juri)
  function handleFinalizeScoreAction() {
    if (!selectedTeam) return;
    finalizeScore(selectedTeam.id, currentUser?.name || 'Ketua Dewan Juri');
    setSaveSuccessMsg(`Nilai ${selectedTeam.schoolName} DIKUNCI PERMANEN & BERITA ACARA RESMI DISAHKAN!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  }

  // 4. Buka Kunci Nilai oleh Superadmin
  function handleUnlockScoreAction() {
    if (!selectedTeam) return;
    unlockScore(selectedTeam.id);
    setSaveSuccessMsg(`Kunci nilai ${selectedTeam.schoolName} DIBUKA kembali untuk pengeditan!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  }

  const isTeamCheckedIn = (teamId) => {
    return Boolean(staging[teamId]?.basecampCheckedIn || staging[teamId]?.status === 'arena' || staging[teamId]?.status === 'completed' || staging[teamId]?.status === 'checkout' || staging[teamId]?.status === 'dp1' || staging[teamId]?.status === 'dp2' || staging[teamId]?.status === 'dp3');
  };

  const verifiedTeams = useMemo(() => {
    return teams
      .filter(t => (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id))
      .filter(t => sidebarJenjang === 'ALL' || t.jenjang === sidebarJenjang)
      .filter(t => {
        if (!sidebarSearch.trim()) return true;
        const q = sidebarSearch.toLowerCase();
        return (
          t.schoolName?.toLowerCase().includes(q) ||
          t.platoonName?.toLowerCase().includes(q) ||
          (t.roster?.danton?.name && t.roster.danton.name.toLowerCase().includes(q)) ||
          (t.dantonName && t.dantonName.toLowerCase().includes(q)) ||
          String(t.chestNumber || '').includes(q) ||
          String(t.lotNumber || '').includes(q)
        );
      })
      .sort((a, b) => {
        const aNum = parseInt(a.chestNumber, 10);
        const bNum = parseInt(b.chestNumber, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        const aStr = String(a.chestNumber || '');
        const bStr = String(b.chestNumber || '');
        if (aStr && bStr) return aStr.localeCompare(bStr);
        return (a.lotNumber || 999) - (b.lotNumber || 999);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, staging, sidebarJenjang, sidebarSearch]);

  const totalDrawnCount = teams.filter(t => (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length;
  const scoredCount = teams.filter(t => (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id) && scores[t.id]).length;

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
      rightActions={
        <div className="flex items-center gap-2">
          {(currentUser?.role === 'finalisator' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
              title="Cetak Berita Acara Rekapitulasi Resmi"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Berita Acara</span>
              <span>(PDF)</span>
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-5 max-w-7xl mx-auto">

        {/* 1. TOP BAR KOMPAK: User Badge & Mode Switch (Scoring vs Leaderboard) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 uppercase">E-Scoring LBB Mu'allimin 2027</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Sistem 3 Juri Simultan
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Petugas: <strong className="text-slate-700">{currentUser?.email}</strong> ({currentUser?.roleLabel || currentUser?.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-500 font-medium">Ternilai:</span>
              <strong className="text-emerald-700 font-mono">{scoredCount}/{totalDrawnCount}</strong>
            </div>

            <button
              onClick={() => setActiveTab(activeTab === 'scoring' ? 'leaderboard' : 'scoring')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>{activeTab === 'scoring' ? 'Klasemen Juara' : 'Lembar Penjurian'}</span>
            </button>
          </div>
        </div>

        {/* Notifikasi Sukses Simpan */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            <span className="flex-1">{saveSuccessMsg}</span>
          </div>
        )}

        {/* 2. ALUR PENJURIAN: PILIH NOMOR DADA DULU ATAU BUKA LEMBAR NILAI */}
        {activeTab === 'scoring' && !selectedTeam && (
          /* TAMPILAN DEFAULT: WAJIB PILIH NOMOR DADA PELETON DAHULU */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Langkah 1 • Pemilihan Peleton
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-2.5">
                  Pilih Nomor Dada Peleton
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Silakan tentukan nomor dada peleton yang sedang tampil di arena untuk membuka lembar penilaian 3 Dewan Juri.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  {verifiedTeams.length} Peleton Siap Dinilai
                </span>
              </div>
            </div>

            {/* Filter Jenjang & Input Pencarian Nomor Dada */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSidebarJenjang('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    sidebarJenjang === 'ALL' ? 'bg-slate-900 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({teams.filter(t => (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length})
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarJenjang('SD')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    sidebarJenjang === 'SD' ? 'bg-red-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sidebarJenjang === 'SD' ? 'bg-white' : 'bg-red-500'}`} />
                  <span>SD / MI ({teams.filter(t => t.jenjang === 'SD' && (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarJenjang('SMP')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    sidebarJenjang === 'SMP' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sidebarJenjang === 'SMP' ? 'bg-white' : 'bg-blue-500'}`} />
                  <span>SMP / MTs ({teams.filter(t => t.jenjang === 'SMP' && (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length})</span>
                </button>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={e => setSidebarSearch(e.target.value)}
                  placeholder="Cari Nomor Dada (#01), nama sekolah, komandan..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Grid Kartu Peleton Berdasarkan Nomor Dada */}
            {verifiedTeams.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  Tidak ada peleton yang cocok dengan filter / pencarian.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pastikan peleton sudah melakukan check-in Basecamp atau terverifikasi pada sistem staging.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedTeams.map(team => {
                  const teamScore = scores[team.id];
                  const isFinal = teamScore?.isLocked || teamScore?.status === 'finalized';
                  const isDraft = teamScore?.status === 'draft';
                  const isVerified = teamScore?.status === 'verified';
                  const isSD = team.jenjang === 'SD';

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleSelectTeam(team.id)}
                      className={`bg-white border-2 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between gap-3 group ${
                        isSD
                          ? 'border-slate-200 hover:border-red-400 hover:bg-red-50/20'
                          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/20'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-12 h-12 rounded-xl text-white font-mono font-black text-base flex items-center justify-center shadow-xs ${
                              isSD
                                ? 'bg-red-600 group-hover:bg-red-700'
                                : 'bg-blue-600 group-hover:bg-blue-700'
                            }`}>
                              #{team.chestNumber || '-'}
                            </span>
                            <div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                                Undian #{team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '-'}
                              </span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                isSD
                                  ? 'text-red-700 bg-red-50 border-red-200'
                                  : 'text-blue-700 bg-blue-50 border-blue-200'
                              }`}>
                                {isSD ? 'SD / MI' : 'SMP / MTs'}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {isFinal ? (
                            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md">
                              Final
                            </span>
                          ) : isVerified ? (
                            <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-md">
                              Verif
                            </span>
                          ) : isDraft ? (
                            <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md">
                              Draft
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              Belum Dinilai
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-slate-900 uppercase group-hover:text-emerald-900 transition-colors leading-snug">
                            {team.schoolName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Komandan: <strong className="text-slate-800">{team.roster?.danton?.name || team.dantonName || '-'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                        <span>Pilih & Mulai Penilaian</span>
                        <span>→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* KONTEN LEMBAR PENJURIAN SAAT PELETON SUDAH DIPILIH */}
        {activeTab === 'scoring' && selectedTeam && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            {/* Header Profil Tim */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTeam?.chestNumber && (
                    <span className={`text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg ${
                      selectedTeam.jenjang === 'SD' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      No. Dada #{selectedTeam.chestNumber}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    Undian #{selectedTeam?.lotNumber ? String(selectedTeam.lotNumber).padStart(2, '0') : '-'}
                  </span>
                  <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-lg border ${
                    selectedTeam?.jenjang === 'SD'
                      ? 'text-red-700 bg-red-50 border-red-200'
                      : 'text-blue-700 bg-blue-50 border-blue-200'
                  }`}>
                    Tingkat {selectedTeam?.jenjang || 'SD'}
                  </span>

                  {/* Status Status Badge */}
                  {existingScore?.isLocked || existingScore?.status === 'finalized' ? (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>FINAL (Terkunci)</span>
                    </span>
                  ) : existingScore?.status === 'verified' ? (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>TERVERIFIKASI</span>
                    </span>
                  ) : existingScore?.status === 'draft' ? (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>DRAFT PENGINPUT</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      Belum Dinilai
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {selectedTeam.schoolName}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedTeam?.platoonName} • Komandan: <strong className="text-slate-800">{selectedTeam?.roster?.danton?.name || selectedTeam?.dantonName || '-'}</strong>
                </p>
              </div>

              {/* Tombol Ganti Peleton */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedTeamId('')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  title="Kembali ke halaman pemilihan nomor dada"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Ganti No. Dada</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>

            {/* 3 Kotak Ringkasan Nilai Resmi (Bersih & Mudah Dipahami) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* 1. Nilai Peleton */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    A. Nilai Peleton (J1+J2+J3)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-mono font-black text-slate-900">
                      {nilaiAkhirPeleton}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Poin</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-1.5 mt-2 flex justify-between">
                  <span>Murni: <strong>{nilaiMurniPeleton}</strong></span>
                  <span className="text-rose-600 font-bold">Penalti: -{peletonPenalty}</span>
                </div>
              </div>

              {/* 2. Nilai Danton */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    B. Nilai Komandan (J1+J2+J3)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-mono font-black text-red-700">
                      {nilaiAkhirDanton}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Poin</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-1.5 mt-2 flex justify-between">
                  <span>Murni: <strong>{nilaiMurniDanton}</strong></span>
                  <span className="text-rose-600 font-bold">Penalti: -{dantonPenalty}</span>
                </div>
              </div>

              {/* 3. Total Nilai Akhir (Penentu Juara Umum) */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block">
                    Total Skor Akhir (A + B)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-mono font-black text-emerald-900">
                      {totalCombinedScore}
                    </span>
                    <span className="text-xs text-emerald-700 font-mono font-bold">Poin</span>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-800 border-t border-emerald-200 pt-1.5 mt-2 font-medium">
                  Penentu Juara Umum (Piala Bergilir)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FORMULIR PENJURIAN (HANYA DITAMPILKAN JIKA PELETON SUDAH DIPILIH) */}
        {activeTab === 'scoring' && selectedTeam && (
          <div className="space-y-4">
            {/* Tab Juri Utama: 3 Juri + Penalti + Bukti Blangko */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos1')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeJuryPost === 'pos1'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>Juri 1 {selectedTeam?.jenjang || 'SD'}</span>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                  {j1PeletonTotal + j1DantonTotal > 0 ? (j1PeletonTotal + j1DantonTotal).toFixed(0) : '-'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJuryPost('pos2')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeJuryPost === 'pos2'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>Juri 2 {selectedTeam?.jenjang || 'SD'}</span>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                  {j2PeletonTotal + j2DantonTotal > 0 ? (j2PeletonTotal + j2DantonTotal).toFixed(0) : '-'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJuryPost('pos3')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeJuryPost === 'pos3'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>Juri 3 {selectedTeam?.jenjang || 'SD'}</span>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                  {j3PeletonTotal + j3DantonTotal > 0 ? (j3PeletonTotal + j3DantonTotal).toFixed(0) : '-'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJuryPost('penalti')}
                className={`min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeJuryPost === 'penalti'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span>Penalti</span>
                {totalCombinedPenalty > 0 && (
                  <span className="bg-rose-800 text-white text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                    -{totalCombinedPenalty}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveJuryPost('evidence')}
                className={`min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeJuryPost === 'evidence'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Foto Blangko</span>
                {paperEvidenceUrl && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </button>
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
                />
              )}

              {/* TAB BUKTI BLANGKO FISIK */}
              {activeJuryPost === 'evidence' && (
                <EvidenceSection
                  paperEvidenceUrl={paperEvidenceUrl}
                  existingScore={existingScore}
                  currentUser={currentUser}
                  handlePaperEvidenceUpload={handlePaperEvidenceUpload}
                  verificationNoteInput={verificationNoteInput}
                  setVerificationNoteInput={setVerificationNoteInput}
                />
              )}

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
          <LeaderboardView
            teams={teams}
            scores={scores}
            setIsRecapModalOpen={setIsRecapModalOpen}
          />
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
          allTeamsCount={teams.filter(t => (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length}
          smpTeamsCount={teams.filter(t => t.jenjang === 'SMP' && (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length}
          sdTeamsCount={teams.filter(t => t.jenjang === 'SD' && (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length}
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
