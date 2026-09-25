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
  Clock
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import {
  MATERIALS,
  JURY_POSTS,
  DANTON_CRITERIA
} from '../../config.js';
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

// Helper membuat initial rubrik state untuk materi tertentu
function getInitialRubricScores(materialsList) {
  const initial = {};
  materialsList.forEach((_m, idx) => {
    initial[idx] = null;
  });
  return initial;
}

// Helper initial danton rubrik
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
              Halaman ini diperuntukkan bagi 3 Petugas Resmi: Petugas Penginput Nilai Kertas, Verifikator, dan Finalisator (Ketua Dewan Juri).
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

  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    const first = teams.find(t => t.status === 'verified' || t.status === 'drawn');
    return first ? first.id : (teams[0]?.id || '');
  });

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;
  const existingScore = selectedTeam ? scores[selectedTeam.id] : null;

  // Active materials list for selected team
  const materialsList = selectedTeam && selectedTeam.jenjang === 'SD' ? MATERIALS.SD : MATERIALS.SMP;

  // Jury Form State
  const [, setJuryName] = useState(JURY_POSTS.pos1.defaultName);
  const [, setJuryRole] = useState(JURY_POSTS.pos1.title);

  // Rubrik Juri 1: Kebenaran Teknik PBB
  const [pbb1RubricScores, setPbb1RubricScores] = useState(() => getInitialRubricScores(materialsList));

  // Rubrik Juri 2: Kekompakan Peleton
  const [pbb2RubricScores, setPbb2RubricScores] = useState(() => getInitialRubricScores(materialsList));

  // Rubrik Juri 3: Komandan Peleton (Danton)
  const [dantonRubricScores, setDantonRubricScores] = useState(getInitialDantonRubric);

  // Upload Foto Lembar Fisik Kertas Juri
  const [paperEvidenceUrl, setPaperEvidenceUrl] = useState('');
  const [verificationNoteInput, setVerificationNoteInput] = useState('');

  // Penalties (Hakim Garis & Timer)
  const [penalties, setPenalties] = useState({
    upacara: false,
    dp1: false,
    personelKurang: false,
    overTimeBlocks: 0,
    injakGarisCount: 0,
    penyesuaianCount: 0,
  });

  const [juryNotes, setJuryNotes] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Update rubrik jika tim berubah atau jenjang berbeda
  function handleSelectTeam(teamId) {
    setSelectedTeamId(teamId);
    const targetTeam = teams.find(t => t.id === teamId);
    const mList = targetTeam && targetTeam.jenjang === 'SD' ? MATERIALS.SD : MATERIALS.SMP;
    const score = scores[teamId];
    const juries = score?.juries || {};

    if (score) {
      if (activeJuryPost !== 'all') {
        setJuryName(juries[activeJuryPost]?.juryName || JURY_POSTS[activeJuryPost]?.defaultName || 'Dewan Juri LBB');
        setJuryRole(juries[activeJuryPost]?.juryRole || JURY_POSTS[activeJuryPost]?.title || 'Dewan Juri');
      } else {
        setJuryName(score.juryName || 'Dewan Juri Utama LBB');
        setJuryRole(score.juryRole || 'Dewan Juri Utama');
      }

      // Load rubrik PBB Juri 1 (Teknik)
      if (juries.pos1?.rubricScores) {
        setPbb1RubricScores(juries.pos1.rubricScores);
      } else if (score.pbb?.rubricScores) {
        setPbb1RubricScores(score.pbb.rubricScores);
      } else {
        setPbb1RubricScores(getInitialRubricScores(mList));
      }

      // Load rubrik PBB Juri 2 (Kekompakan)
      if (juries.pos2?.rubricScores) {
        setPbb2RubricScores(juries.pos2.rubricScores);
      } else if (score.kekompakan?.rubricScores) {
        setPbb2RubricScores(score.kekompakan.rubricScores);
      } else {
        setPbb2RubricScores(getInitialRubricScores(mList));
      }

      // Load rubrik Danton Juri 3
      if (juries.pos3?.rubricScores) {
        setDantonRubricScores(juries.pos3.rubricScores);
      } else if (score.danton?.rubricScores) {
        setDantonRubricScores(score.danton.rubricScores);
      } else {
        setDantonRubricScores(getInitialDantonRubric());
      }

      setPaperEvidenceUrl(score.paperEvidenceUrl || '');
      setVerificationNoteInput(score.verificationNotes || '');
      setPenalties(score.penalties || { upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes(score.notes || '');
    } else {
      setPbb1RubricScores(getInitialRubricScores(mList));
      setPbb2RubricScores(getInitialRubricScores(mList));
      setDantonRubricScores(getInitialDantonRubric());
      setPaperEvidenceUrl('');
      setVerificationNoteInput('');
      setPenalties({ upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes('');
    }
  }

  // Hitung total skor PBB Juri 1 (Teknik)
  const pbb1Total = useMemo(() => {
    return Object.values(pbb1RubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [pbb1RubricScores]);

  // Hitung total skor PBB Juri 2 (Kekompakan)
  const pbb2Total = useMemo(() => {
    return Object.values(pbb2RubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [pbb2RubricScores]);

  // Hitung total skor Danton Juri 3
  const dantonTotal = useMemo(() => {
    return Object.values(dantonRubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [dantonRubricScores]);

  let penaltyDeduction = 0;
  if (penalties.upacara) penaltyDeduction += 150;
  if (penalties.dp1) penaltyDeduction += 100;
  if (penalties.personelKurang) penaltyDeduction += 75;
  penaltyDeduction += (penalties.overTimeBlocks || 0) * 50;
  penaltyDeduction += (penalties.injakGarisCount || 0) * 50;
  if ((penalties.penyesuaianCount || 0) > 3) penaltyDeduction += 25;

  const peletonCombinedScore = useMemo(() => {
    if (pbb1Total > 0 && pbb2Total > 0) {
      return parseFloat((pbb1Total * 0.7 + pbb2Total * 0.3).toFixed(2));
    }
    return pbb1Total || pbb2Total || 0;
  }, [pbb1Total, pbb2Total]);

  const totalCalculatedScore = useMemo(() => {
    if (activeJuryPost === 'pos1') return Math.max(0, pbb1Total - penaltyDeduction);
    if (activeJuryPost === 'pos2') return Math.max(0, pbb2Total - penaltyDeduction);
    if (activeJuryPost === 'pos3') return Math.max(0, dantonTotal - penaltyDeduction);
    return parseFloat(Math.max(0, peletonCombinedScore + dantonTotal - penaltyDeduction).toFixed(2));
  }, [activeJuryPost, pbb1Total, pbb2Total, dantonTotal, peletonCombinedScore, penaltyDeduction]);

  // Handler Upload Foto Lembar Kertas Fisik Juri
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
      pbb: { total: pbb1Total, rubricScores: pbb1RubricScores },
      kekompakan: { total: pbb2Total, rubricScores: pbb2RubricScores },
      danton: { total: dantonTotal, rubricScores: dantonRubricScores },
      juries: {
        pos1: { total: pbb1Total, rubricScores: pbb1RubricScores, title: 'Juri 1: Kebenaran Teknik PBB' },
        pos2: { total: pbb2Total, rubricScores: pbb2RubricScores, title: 'Juri 2: Kekompakan Peleton' },
        pos3: { total: dantonTotal, rubricScores: dantonRubricScores, title: 'Juri 3: Komandan Peleton (Danton)' },
      },
      penalties: { ...penalties, totalPenalty: penaltyDeduction },
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

  // Helper: apakah tim sudah check-in
  const isTeamCheckedIn = (teamId) => {
    const s = staging[teamId];
    if (!s) return false;
    return !!(s.basecampLogistics?.checkInTime || (s.stage && s.stage !== 'waiting'));
  };

  // Teams eligible for scoring
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
      subtitle="Input Nilai PBB, Kekompakan, Danton & Bukti Blangko Fisik"
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
                    E-SCORING DEWAN JURI
                  </span>
                  <span className="text-xs text-slate-500 font-medium">LBB Mu'allimin 2026 • 1 Pos Arena</span>
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
                  E-Scoring & Rekap Nilai
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
                <span>{activeTab === 'scoring' ? 'Lihat Klasemen Juara' : 'Input Nilai Juri'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Kategori Penilaian Bersih Bergaya Simpaskor */}
        {activeTab === 'scoring' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Tab 1: PBB Teknik */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos1')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'pos1'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>PBB TEKNIK</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  activeJuryPost === 'pos1' ? 'bg-blue-800 text-white' : 'bg-white text-blue-600 border border-slate-200'
                }`}>
                  {materialsList.length}
                </span>
              </button>

              {/* Tab 2: Juri 2 - Kekompakan Peleton */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos2')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'pos2'
                    ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>KEKOMPAKAN</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  activeJuryPost === 'pos2' ? 'bg-purple-800 text-white' : 'bg-white text-purple-600 border border-slate-200'
                }`}>
                  {materialsList.length}
                </span>
              </button>

              {/* Tab 3: Juri 3 - Komandan Peleton (Danton) */}
              <button
                type="button"
                onClick={() => setActiveJuryPost('pos3')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeJuryPost === 'pos3'
                    ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>DANTON</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  activeJuryPost === 'pos3' ? 'bg-red-800 text-white' : 'bg-white text-red-600 border border-slate-200'
                }`}>
                  {DANTON_CRITERIA.length}
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
                {penaltyDeduction > 0 ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    -{penaltyDeduction}
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

            {/* Tombol Pemilih Peleton Cepat & Status */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-slate-800 transition-all shadow-xs group cursor-pointer"
                title="Klik untuk memilih atau mengganti peleton yang dinilai"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-bold text-emerald-800 leading-none">
                    Peleton Dinilai:
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
                
                {/* Active Platoon Hero Card */}
                <div className="relative overflow-hidden bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="relative space-y-1.5">
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

                    {/* Realtime Breakdown Badges for 3 Juries */}
                    <div className="flex items-center gap-2 pt-1.5 flex-wrap text-xs font-mono">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                        J1 (Teknik): <strong className="text-slate-900">{existingScore ? pbb1Total : '-'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800">
                        J2 (Kekompakan): <strong className="text-slate-900">{existingScore ? pbb2Total : '-'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-red-50 border border-red-200 text-red-800">
                        J3 (Danton): <strong className="text-slate-900">{existingScore ? dantonTotal : '-'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                        Peleton (70:30): <strong className="text-slate-900">{existingScore ? peletonCombinedScore : '-'}</strong>
                      </span>
                      {penaltyDeduction > 0 && (
                        <span className="px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold">
                          Penalti: -{penaltyDeduction}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total Running Score Badge & Ganti Peleton Trigger */}
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

                    <div className="relative bg-slate-50 rounded-2xl p-3.5 text-right border border-slate-200 shadow-xs min-w-[130px]">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">
                        {activeJuryPost === 'all' ? 'Total Skor Akhir' : 'Subtotal Juri Aktif'}
                      </span>
                      {existingScore ? (
                        <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight block">
                          {totalCalculatedScore}
                        </span>
                      ) : (
                        <span className="text-xl sm:text-2xl font-black text-slate-400 font-mono tracking-tight block">
                          -
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {existingScore ? 'Poin Lapangan' : 'Belum Diinput'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TAB 1: Penilaian Gerakan Materi PBB Pasukan (Juri 1 - Teknik) */}
                {activeJuryPost === 'pos1' && (
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={pbb1RubricScores}
                    setRubricScores={setPbb1RubricScores}
                    isInputDisabled={isInputDisabled}
                    juryPost="pos1"
                  />
                )}

                {/* TAB 2: Penilaian Kekompakan Peleton (Juri 2 - Kekompakan) */}
                {activeJuryPost === 'pos2' && (
                  <PbbScoringTable
                    materialsList={materialsList}
                    rubricScores={pbb2RubricScores}
                    setRubricScores={setPbb2RubricScores}
                    isInputDisabled={isInputDisabled}
                    juryPost="pos2"
                  />
                )}

                {/* TAB 3: Penilaian Komandan Peleton (Juri 3 - Danton) */}
                {activeJuryPost === 'pos3' && (
                  <DantonScoringTable
                    dantonRubricScores={dantonRubricScores}
                    setDantonRubricScores={setDantonRubricScores}
                    isInputDisabled={isInputDisabled}
                    dantonTotal={dantonTotal}
                  />
                )}

                {/* TAB 4: Pengurangan Nilai (Hakim Garis & Timer) */}
                {activeJuryPost === 'penalti' && (
                  <PenaltiesSection
                    penalties={penalties}
                    setPenalties={setPenalties}
                    selectedTeam={selectedTeam}
                    penaltyDeduction={penaltyDeduction}
                  />
                )}

                {/* TAB 5: BUKTI FISIK BLANGKO KERTAS JURI */}
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

                {/* 4. Catatan Evaluasi & Pengesahan Juri (Progressive Step UX) */}
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
                    Pilih peleton yang siap dinilai untuk membuka formulir lembar penilaian juri secara penuh.
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
