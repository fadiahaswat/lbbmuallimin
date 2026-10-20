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
  UserCheck,
  AlertTriangle
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
  const [juryAspectTab, setJuryAspectTab] = useState('peleton'); // 'peleton' | 'danton'
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [sidebarJenjang, setSidebarJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [sidebarSearch, setSidebarSearch] = useState('');

  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    const first = teams.find(t => t.status === 'verified' || t.status === 'drawn');
    return first ? first.id : (teams[0]?.id || '');
  });

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
  const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');

  return (
    <SimpaskorSidebarLayout
      activeMenu="penjurian"
      title="E-Scoring & Penjurian"
      subtitle="Penilaian Objektif 3 Dewan Juri (Peleton & Danton), Penalti & Bukti Blangko"
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
      <div className="space-y-6">

        {/* Sub Header & Scoring Status Bar */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    DEWAN JURI LBB MU'ALLIMIN 2027
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Petunjuk Teknis Bab A (Sistem 3 Dewan Juri Simultan)</span>
                  {currentUser && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentUser.role === 'penginput' ? 'bg-amber-500' :
                        currentUser.role === 'verifikator' ? 'bg-blue-500' :
                        currentUser.role === 'finalisator' ? 'bg-emerald-500' : 'bg-purple-500'
                      }`} />
                      <span>{currentUser.email}</span>
                      <span className="text-slate-400">({currentUser.roleLabel || currentUser.role})</span>
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">
                  E-Scoring & Lembar Penilaian Terpadu
                </h1>
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600 font-bold">Progress:</span>
                <span className="font-mono text-emerald-700 font-black">{scoredCount} / {totalDrawnCount} Dinilai</span>
              </div>

              <button
                onClick={() => setActiveTab(activeTab === 'scoring' ? 'leaderboard' : 'scoring')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>{activeTab === 'scoring' ? 'Lihat Klasemen Juara' : 'Input Lembar Juri'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Utama Penilaian Dewan Juri */}
        {activeTab === 'scoring' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Pos 1: Dewan Juri 1 */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos1')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'pos1'
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>JURI 1 (TNI)</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  activeJuryPost === 'pos1' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}>
                  {j1PeletonTotal + j1DantonTotal > 0 ? (j1PeletonTotal + j1DantonTotal).toFixed(1) : '-'}
                </span>
              </button>

              {/* Pos 2: Dewan Juri 2 */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos2')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'pos2'
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>JURI 2 (POLRI)</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  activeJuryPost === 'pos2' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}>
                  {j2PeletonTotal + j2DantonTotal > 0 ? (j2PeletonTotal + j2DantonTotal).toFixed(1) : '-'}
                </span>
              </button>

              {/* Pos 3: Dewan Juri 3 */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos3')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'pos3'
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>JURI 3 (PROFESIONAL)</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  activeJuryPost === 'pos3' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}>
                  {j3PeletonTotal + j3DantonTotal > 0 ? (j3PeletonTotal + j3DantonTotal).toFixed(1) : '-'}
                </span>
              </button>

              {/* Tab 4: Pengurangan Nilai (Penalti) */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('penalti')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'penalti'
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>PENALTI</span>
                {totalCombinedPenalty > 0 ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    -{totalCombinedPenalty}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white text-slate-500 border border-slate-200">
                    0
                  </span>
                )}
              </button>

              {/* Tab 5: Foto Bukti Blangko Kertas Fisik */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('evidence')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'evidence'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>BUKTI BLANGKO</span>
                {paperEvidenceUrl && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Tombol Pemilih Peleton Cepat */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-slate-800 transition-all shadow-xs group cursor-pointer"
                title="Pilih peleton yang dinilai"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-bold text-emerald-800 leading-none">
                    Peleton Tampil:
                  </div>
                  <div className="font-black text-xs text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <span className="truncate max-w-[180px] sm:max-w-[240px]">
                      {selectedTeam ? selectedTeam.schoolName : 'Pilih Peleton...'}
                    </span>
                    {selectedTeam?.chestNumber && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-teal-700 font-mono border border-slate-200">
                        #{selectedTeam.chestNumber}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-emerald-600 group-hover:translate-y-0.5 transition-transform ml-1" />
              </button>
            </div>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            <span className="flex-1">{saveSuccessMsg}</span>
          </div>
        )}

        {/* TAB 1: FORMULIR PENILAIAN */}
        {activeTab === 'scoring' && (
          <div className="w-full space-y-6">
            {selectedTeam ? (
              <form onSubmit={handleSaveDraft} className="space-y-6">
                
                {/* Active Platoon Hero Card & Breakdown Realtime Resmi Juknis */}
                <div className="relative overflow-hidden bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="relative space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                        {selectedTeam.regCode}
                      </span>
                      {selectedTeam.chestNumber && (
                        <span className="font-mono font-black text-sm text-teal-800 bg-teal-50 border border-teal-200 px-3 py-0.5 rounded-md">
                          No. Dada: {selectedTeam.chestNumber}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        Undi: #{selectedTeam.lotNumber ? String(selectedTeam.lotNumber).padStart(2, '0') : '-'}
                      </span>
                      <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Tingkat {selectedTeam.jenjang}
                      </span>

                      {/* Status Scrutineering Badge */}
                      {existingScore?.isLocked || existingScore?.status === 'finalized' ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>FINAL (Terkunci)</span>
                        </span>
                      ) : existingScore?.status === 'verified' ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>TERVERIFIKASI</span>
                        </span>
                      ) : existingScore?.status === 'draft' ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>DRAFT PENGINPUT</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          Belum Diinput
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-xl sm:text-2xl text-slate-900 uppercase tracking-tight">
                      {selectedTeam.schoolName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {selectedTeam.platoonName} • Komandan: <strong className="text-slate-800">{selectedTeam.roster?.danton?.name || selectedTeam.dantonName || '-'}</strong>
                    </p>

                    {/* Breakdown 2 Pilar Resmi: Peleton & Danton (Bab A.3.c Juknis) */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
                      {/* Pilar 1: Peleton */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 font-mono">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>A. PERFORMA PELETON (J1+J2+J3)</span>
                          <span className="text-slate-900 font-black">{nilaiMurniPeleton}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>J1:{j1PeletonTotal} • J2:{j2PeletonTotal} • J3:{j3PeletonTotal}</span>
                          <span className="text-rose-600 font-bold">Penalti: -{peletonPenalty}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-black text-blue-700 pt-1 border-t border-slate-200">
                          <span>NILAI AKHIR PELETON:</span>
                          <span>{nilaiAkhirPeleton}</span>
                        </div>
                      </div>

                      {/* Pilar 2: Komandan (Danton) */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 font-mono">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>B. KOMANDAN PELETON (J1+J2+J3)</span>
                          <span className="text-slate-900 font-black">{nilaiMurniDanton}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>J1:{j1DantonTotal} • J2:{j2DantonTotal} • J3:{j3DantonTotal}</span>
                          <span className="text-rose-600 font-bold">Penalti: -{dantonPenalty}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-black text-red-700 pt-1 border-t border-slate-200">
                          <span>NILAI AKHIR DANTON:</span>
                          <span>{nilaiAkhirDanton}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Running Score Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsTeamModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ganti Peleton</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    <div className="relative bg-slate-50 rounded-2xl p-3.5 text-right border border-slate-200 shadow-xs min-w-[140px]">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">
                        Total Skor Akhir
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight block">
                        {totalCombinedScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        Akumulasi 3 Juri - Penalti
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Toggle: Materi Peleton vs Danton (hanya aktif jika sedang di tab pos1, pos2, atau pos3) */}
                {['pos1', 'pos2', 'pos3'].includes(activeJuryPost) && (
                  <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setJuryAspectTab('peleton')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          juryAspectTab === 'peleton'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        1. Materi Gerakan Peleton ({materialsList.length} Gerakan)
                      </button>
                      <button
                        type="button"
                        onClick={() => setJuryAspectTab('danton')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          juryAspectTab === 'danton'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        2. Komandan Peleton (4 Aspek Berbobot)
                      </button>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-slate-600 pr-3 hidden sm:block">
                      {activeJuryPost === 'pos1' && 'Lembar Dewan Juri 1 (Unsur TNI)'}
                      {activeJuryPost === 'pos2' && 'Lembar Dewan Juri 2 (Unsur POLRI)'}
                      {activeJuryPost === 'pos3' && 'Lembar Dewan Juri 3 (Unsur Profesional)'}
                    </div>
                  </div>
                )}

                {/* JURI 1: MATERI PELETON & DANTON */}
                {activeJuryPost === 'pos1' && juryAspectTab === 'peleton' && (
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={j1PbbRubric}
                    setRubricScores={setJ1PbbRubric}
                    isInputDisabled={isInputDisabled}
                    juryPost="pos1"
                    juryLabel="Dewan Juri 1 (TNI)"
                  />
                )}
                {activeJuryPost === 'pos1' && juryAspectTab === 'danton' && (
                  <DantonScoringTable
                    dantonRubricScores={j1DantonRubric}
                    setDantonRubricScores={setJ1DantonRubric}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={j1DantonTotal}
                  />
                )}

                {/* JURI 2: MATERI PELETON & DANTON */}
                {activeJuryPost === 'pos2' && juryAspectTab === 'peleton' && (
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={j2PbbRubric}
                    setRubricScores={setJ2PbbRubric}
                    isInputDisabled={isInputDisabled}
                    juryPost="pos2"
                    juryLabel="Dewan Juri 2 (POLRI)"
                  />
                )}
                {activeJuryPost === 'pos2' && juryAspectTab === 'danton' && (
                  <DantonScoringTable
                    dantonRubricScores={j2DantonRubric}
                    setDantonRubricScores={setJ2DantonRubric}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={j2DantonTotal}
                  />
                )}

                {/* JURI 3: MATERI PELETON & DANTON */}
                {activeJuryPost === 'pos3' && juryAspectTab === 'peleton' && (
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={j3PbbRubric}
                    setRubricScores={setJ3PbbRubric}
                    isInputDisabled={isInputDisabled}
                    juryPost="pos3"
                    juryLabel="Dewan Juri 3 (Profesional)"
                  />
                )}
                {activeJuryPost === 'pos3' && juryAspectTab === 'danton' && (
                  <DantonScoringTable
                    dantonRubricScores={j3DantonRubric}
                    setDantonRubricScores={setJ3DantonRubric}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={j3DantonTotal}
                  />
                )}

                {/* TAB 4: PENALTI LAPANGAN */}
                {activeJuryPost === 'penalti' && (
                  <PenaltiesSection
                    penalties={penalties}
                    setPenalties={setPenalties}
                    selectedTeam={selectedTeam}
                    peletonPenalty={peletonPenalty}
                    dantonPenalty={dantonPenalty}
                  />
                )}

                {/* TAB 5: BUKTI BLANGKO FISIK */}
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

                {/* Scrutineering Actions Bar */}
                <ScrutineeringActionsBar
                  existingScore={existingScore}
                  currentUser={currentUser}
                  juryNotes={juryNotes}
                  setJuryNotes={setJuryNotes}
                  handleSaveDraft={handleSaveDraft}
                  handleVerifyScoreAction={handleVerifyScoreAction}
                  handleFinalizeScoreAction={handleFinalizeScoreAction}
                  setIsRecapModalOpen={setIsRecapModalOpen}
                />

              </form>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-emerald-600 border border-slate-200">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 uppercase">Belum Ada Peleton Dipilih</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Pilih peleton yang siap dinilai untuk membuka formulir lembar penilaian dewan juri secara penuh.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Pilih Peleton Sekarang</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE LEADERBOARD & REKAP JUARA */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            teams={teams}
            scores={scores}
            setIsRecapModalOpen={setIsRecapModalOpen}
          />
        )}

        {/* Modal Pemilih Peleton Cepat */}
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
