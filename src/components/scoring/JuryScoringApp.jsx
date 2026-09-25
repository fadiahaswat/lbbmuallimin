import React, { useState, useMemo } from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  AlertOctagon,
  Users,
  Printer,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Sparkles,
  Save,
  Check,
  RotateCcw,
  ListOrdered,
  Eye,
  Calendar,
  Clock,
  ArrowLeft,
  Search,
  ShieldCheck,
  FileCheck,
  FileCheck2,
  Camera,
  Upload,
  CheckSquare,
  XCircle,
  Lock,
  FileText
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import {
  MATERIALS,
  SCORING,
  PENALTIES,
  JURY_POSTS,
  JURY_ROLES,
  RUBRIC_GRADES,
  RUBRIC_SCALE_TEMPLATES,
  DANTON_CRITERIA,
  getScaleTemplateForMaterial
} from '../../config.js';
import OfficialScoreRecapModal from './OfficialScoreRecapModal.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

// Helper membuat initial rubrik state untuk materi tertentu (semua null = belum diinput)
function getInitialRubricScores(materialsList) {
  const initial = {};
  materialsList.forEach((_m, idx) => {
    initial[idx] = null;
  });
  return initial;
}

// Helper initial danton rubrik (semua null = belum diinput)
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
    saveScore,
    saveJuryPostScore,
    saveDraftScore,
    verifyScore,
    finalizeScore,
    setActiveView,
    openModal
  } = useCompetition();

  // Akses Terbatas Khusus: Dewan Juri Lapangan (juri@lbbmuallimin.com), Operator Penginput (penginput@lbbmuallimin.com), dan Superadmin
  // Petugas Check-In/DP/Admin umum DILARANG KERAS input nilai!
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
  const [juryName, setJuryName] = useState(JURY_POSTS.pos1.defaultName);
  const [juryRole, setJuryRole] = useState(JURY_POSTS.pos1.title);

  // Rubrik Juri 1: Kebenaran Teknik PBB
  const [pbb1RubricScores, setPbb1RubricScores] = useState(() => getInitialRubricScores(materialsList));

  // Rubrik Juri 2: Kekompakan Peleton (Formulir materi gerakan PBB yang sama persis dengan Juri 1)
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

  // Total skor 3 Dewan Juri resmi:
  // Juri 1 (Kebenaran Teknik PBB) + Juri 2 (Kekompakan Peleton) + Juri 3 (Danton) - Penalti
  // Rata-rata / Akumulasi Peleton: (Teknik * 70%) + (Kekompakan * 30%)
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

  // Helper: apakah tim sudah check-in (basecampLogistics.checkInTime atau staging stage != 'waiting')
  const isTeamCheckedIn = (teamId) => {
    const s = staging[teamId];
    if (!s) return false;
    return !!(s.basecampLogistics?.checkInTime || (s.stage && s.stage !== 'waiting'));
  };

  // Teams eligible for scoring: harus verified/drawn DAN sudah check-in, urut no dada
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
                onClick={() => {
                  setActiveJuryPost('pos1');
                  setJuryName(JURY_POSTS.pos1.defaultName);
                  setJuryRole(JURY_POSTS.pos1.title);
                }}
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
                onClick={() => {
                  setActiveJuryPost('pos2');
                  setJuryName(JURY_POSTS.pos2.defaultName);
                  setJuryRole(JURY_POSTS.pos2.title);
                }}
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
                onClick={() => {
                  setActiveJuryPost('pos3');
                  setJuryName(JURY_POSTS.pos3.defaultName);
                  setJuryRole(JURY_POSTS.pos3.title);
                }}
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

        {/* TAB 1: FORMULIR PENILAIAN (FULL WIDTH 100%) */}
        {activeTab === 'scoring' && (
          <div className="w-full space-y-6">
            {/* Scoring Inputs Form */}
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

                  {/* TAB 5: BUKTI FISIK BLANGKO KERTAS JURI */}
                  {activeJuryPost === 'evidence' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                            <Camera className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-slate-900 uppercase flex items-center gap-2">
                              <span>Foto Bukti Blangko Kertas Juri Fisik</span>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                                Wajib Scrutineering
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Juri menilai di atas kertas fisik di lapangan. Penginput mengunggah foto blangko untuk diaudit oleh Verifikator & disahkan Finalisator.
                            </p>
                          </div>
                        </div>

                        {/* File Upload Input */}
                        {(!existingScore?.isLocked && (currentUser?.role === 'penginput' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin')) && (
                          <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 shadow-sm transition-all">
                            <Upload className="w-4 h-4" />
                            <span>{paperEvidenceUrl ? 'Ganti Foto Blangko' : 'Upload Foto Blangko Kertas'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePaperEvidenceUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {paperEvidenceUrl ? (
                        <div className="space-y-3">
                          <div className="relative max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
                            <img
                              src={paperEvidenceUrl}
                              alt="Bukti Blangko Kertas Fisik Dewan Juri"
                              className="w-full max-h-96 object-contain mx-auto"
                            />
                            <div className="absolute bottom-2 right-2 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-[10px] text-white font-mono">
                              Bukti Fisik Terunggah
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                          <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-600 font-bold">
                            Belum ada foto lembar kertas dewan juri yang diunggah.
                          </p>
                          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                            Penginput nilai dapat memotret lembar kertas fisik juri menggunakan kamera HP / tablet lalu mengunggahnya ke sini sebagai arsip audit trail.
                          </p>
                        </div>
                      )}

                      {/* Verification Notes History */}
                      {existingScore?.verificationNotes && (
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center gap-2 text-slate-600 font-bold">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Catatan Verifikator / Finalisator:</span>
                          </div>
                          <p className="text-slate-700 pl-5 italic">
                            "{existingScore.verificationNotes}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 1: Penilaian Gerakan Materi PBB Pasukan */}
                  {activeJuryPost === 'pos1' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                              Dewan Juri 1 • PBB Pasukan
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              Materi Resmi ({selectedTeam.jenjang}) • {materialsList.length} Gerakan
                            </span>
                          </div>
                          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
                            A - D. Penilaian Gerakan Materi PBB Pasukan (Juri 1)
                          </h4>
                        </div>
                        <div className="text-right bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-blue-700 font-bold uppercase block">Subtotal Juri 1 (PBB)</span>
                          <span className="font-mono font-black text-2xl text-blue-700">{pbb1Total} <span className="text-xs font-normal text-slate-500">Poin</span></span>
                        </div>
                      </div>

                      {/* Petunjuk Coret Nilai Juri 1 */}
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800">Skala Predikat:</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] shadow-xs">KURANG (Merah)</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-xs">CUKUP (Kuning)</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] shadow-xs">BAIK (Hijau)</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] shadow-xs">SANGAT BAIK (Biru)</span>
                        </div>
                        <span className="text-slate-500 italic">Tap angka skor pada kolom warna untuk memilih nilai</span>
                      </div>

                      {/* Red Simpaskor Category Header Banner */}
                      <div className="bg-red-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-xs sm:text-sm tracking-wide uppercase">
                            LEMBAR PENILAIAN — PBB TEKNIK
                          </span>
                          <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
                            {materialsList.length} Materi
                          </span>
                        </div>
                        <span className="text-[11px] text-red-100 font-medium hidden sm:inline">
                          LBB Mu'allimin 2027
                        </span>
                      </div>

                      {/* Tabel Checklist Materi Gerakan PBB Juri 1 bergaya Simpaskor */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[560px] overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
                            {/* Baris 1: Header Utama Kategori Predikat Warna */}
                            <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-center">
                              <th rowSpan={2} className="py-2.5 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[220px]">Materi Penilaian</th>
                              <th className="py-1.5 px-2 bg-red-600 text-white border-r border-red-500 text-center tracking-wider">KURANG</th>
                              <th className="py-1.5 px-2 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider">CUKUP</th>
                              <th className="py-1.5 px-2 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider">BAIK</th>
                              <th className="py-1.5 px-2 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider">SANGAT BAIK</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-center w-20 bg-slate-100 text-slate-900 font-black">Skor</th>
                            </tr>
                            {/* Baris 2: Sub-info predikat */}
                            <tr className="text-[10px] font-mono border-b border-slate-200 text-center">
                              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
                              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
                              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
                              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">Taraf BS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {materialsList.map((materiText, idx) => {
                              const templateKey = getScaleTemplateForMaterial(materiText);
                              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
                              const selectedVal = pbb1RubricScores[idx];
                              const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');

                              // Kelompokkan nilai per grade: K, C, B, BS
                              const kItems = template.filter(t => t.grade === 'K');
                              const cItems = template.filter(t => t.grade === 'C');
                              const bItems = template.filter(t => t.grade === 'B');
                              const bsItems = template.filter(t => t.grade === 'BS');

                              return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-800 border-r border-slate-200">
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{materiText}</div>
                                    <div className="text-[10px] text-blue-600 font-mono font-medium mt-0.5">
                                      Kategori: {templateKey.replace('_', ' ')}
                                    </div>
                                  </td>

                                  {/* Kolom KURANG (Merah) */}
                                  <td className="py-2 px-2 text-center bg-red-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {kItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb1RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-red-600 text-white font-black shadow-sm ring-2 ring-red-400 scale-105'
                                                : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Kolom CUKUP (Kuning) */}
                                  <td className="py-2 px-2 text-center bg-amber-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {cItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb1RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-300 scale-105'
                                                : 'bg-white text-amber-800 hover:bg-amber-500 hover:text-slate-950 border border-amber-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Kolom BAIK (Hijau) */}
                                  <td className="py-2 px-2 text-center bg-emerald-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {bItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb1RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-400 scale-105'
                                                : 'bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Kolom SANGAT BAIK (Biru) */}
                                  <td className="py-2 px-2 text-center bg-blue-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {bsItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb1RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400 scale-105'
                                                : 'bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Nilai Terpilih */}
                                  <td className="py-2 px-3 text-center font-mono font-black text-base text-slate-900 bg-slate-50">
                                    {selectedVal ?? '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Penilaian Kekompakan Peleton (Juri 2 - Formulir Materi PBB yang Sama) */}
                  {activeJuryPost === 'pos2' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                              Dewan Juri 2 • Kekompakan Peleton
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              Materi Resmi ({selectedTeam.jenjang}) • {materialsList.length} Gerakan
                            </span>
                          </div>
                          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
                            A - D. Penilaian Kekompakan & Keselarasan Gerakan Peleton (Juri 2)
                          </h4>
                          <p className="text-[11px] text-purple-800/80 mt-0.5">
                            Menilai keseragaman tempo, keselarasan langkah, kerapian banjar/shaf, dan irama hentakan untuk setiap gerakan.
                          </p>
                        </div>
                        <div className="text-right bg-purple-50 border border-purple-200 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-purple-700 font-bold uppercase block">Subtotal Juri 2 (Kekompakan)</span>
                          <span className="font-mono font-black text-2xl text-purple-700">{pbb2Total} <span className="text-xs font-normal text-slate-500">Poin</span></span>
                        </div>
                      </div>

                      {/* Petunjuk Coret Nilai Juri 2 */}
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800">Skala Predikat:</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] shadow-xs">KURANG (Merah)</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-xs">CUKUP (Kuning)</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] shadow-xs">BAIK (Hijau)</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] shadow-xs">SANGAT BAIK (Biru)</span>
                        </div>
                        <span className="text-slate-500 italic">Tap angka skor pada kolom warna untuk memilih nilai kekompakan</span>
                      </div>

                      {/* Red Simpaskor Category Header Banner */}
                      <div className="bg-red-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-xs sm:text-sm tracking-wide uppercase">
                            LEMBAR PENILAIAN — KEKOMPAKAN PASUKAN
                          </span>
                          <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
                            {materialsList.length} Materi
                          </span>
                        </div>
                        <span className="text-[11px] text-red-100 font-medium hidden sm:inline">
                          LBB Mu'allimin 2027
                        </span>
                      </div>

                      {/* Tabel Checklist Materi Gerakan PBB Juri 2 (Kekompakan) bergaya Simpaskor */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[560px] overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
                            <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-center">
                              <th rowSpan={2} className="py-2.5 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[220px]">Materi Penilaian Kekompakan</th>
                              <th className="py-1.5 px-2 bg-red-600 text-white border-r border-red-500 text-center tracking-wider">KURANG</th>
                              <th className="py-1.5 px-2 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider">CUKUP</th>
                              <th className="py-1.5 px-2 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider">BAIK</th>
                              <th className="py-1.5 px-2 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider">SANGAT BAIK</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-center w-20 bg-slate-100 text-slate-900 font-black">Skor</th>
                            </tr>
                            <tr className="text-[10px] font-mono border-b border-slate-200 text-center">
                              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
                              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
                              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
                              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">Taraf BS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {materialsList.map((materiText, idx) => {
                              const templateKey = getScaleTemplateForMaterial(materiText);
                              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
                              const selectedVal = pbb2RubricScores[idx];
                              const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');

                              const kItems = template.filter(t => t.grade === 'K');
                              const cItems = template.filter(t => t.grade === 'C');
                              const bItems = template.filter(t => t.grade === 'B');
                              const bsItems = template.filter(t => t.grade === 'BS');

                              return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-800 border-r border-slate-200">
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{materiText}</div>
                                    <div className="text-[10px] text-purple-700 font-mono font-medium mt-0.5">
                                      Kategori: {templateKey.replace('_', ' ')}
                                    </div>
                                  </td>

                                  {/* Kolom KURANG (Merah) */}
                                  <td className="py-2 px-2 text-center bg-red-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {kItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb2RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-red-600 text-white font-black shadow-sm ring-2 ring-red-400 scale-105'
                                                : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Kolom CUKUP (Kuning) */}
                                  <td className="py-2 px-2 text-center bg-amber-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {cItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb2RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-300 scale-105'
                                                : 'bg-white text-amber-800 hover:bg-amber-500 hover:text-slate-950 border border-amber-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Kolom BAIK (Hijau) */}
                                  <td className="py-2 px-2 text-center bg-emerald-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {bItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb2RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-400 scale-105'
                                                : 'bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Kolom SANGAT BAIK (Biru) */}
                                  <td className="py-2 px-2 text-center bg-blue-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {bsItems.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb2RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400 scale-105'
                                                : 'bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                                            }`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>

                                  {/* Nilai Terpilih */}
                                  <td className="py-2 px-3 text-center font-mono font-black text-base text-slate-900 bg-slate-50">
                                    {selectedVal ?? '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Penilaian Komandan Peleton (Juri 3 - Danton) */}
                  {activeJuryPost === 'pos3' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-red-700 tracking-wider bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                              Dewan Juri 3 • Komandan Peleton (Danton)
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">Standar Rubrik K / C / B / BS</span>
                          </div>
                          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
                            B. Penilaian Komandan Pasukan (Danton)
                          </h4>
                          <p className="text-[11px] text-red-700/80 mt-0.5">
                            Menilai aba-aba, artikulasi vokal, ketegasan sikap, penguasaan lapangan, dan ketenangan komandan.
                          </p>
                        </div>
                        <div className="text-right bg-red-50 border border-red-200 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-red-700 font-bold uppercase block">Subtotal Danton (Juri 3)</span>
                          <span className="font-mono font-black text-2xl text-red-700">{dantonTotal} <span className="text-xs font-normal text-slate-500">Poin</span></span>
                        </div>
                      </div>

                      {/* Red Simpaskor Category Header Banner */}
                      <div className="bg-red-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-xs sm:text-sm tracking-wide uppercase">
                            LEMBAR PENILAIAN — KOMANDAN PELETON (DANTON)
                          </span>
                          <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
                            {DANTON_CRITERIA.length} Kriteria
                          </span>
                        </div>
                        <span className="text-[11px] text-red-100 font-medium hidden sm:inline">
                          LBB Mu'allimin 2027
                        </span>
                      </div>

                      {/* Tabel Checklist Danton Juri 3 bergaya Simpaskor */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
                            <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-center">
                              <th rowSpan={2} className="py-2.5 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[200px]">Kriteria Penilaian Danton</th>
                              <th className="py-1.5 px-2 bg-red-600 text-white border-r border-red-500 text-center tracking-wider">KURANG</th>
                              <th className="py-1.5 px-2 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider">CUKUP</th>
                              <th className="py-1.5 px-2 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider">BAIK</th>
                              <th className="py-1.5 px-2 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider">SANGAT BAIK</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-center w-20 bg-slate-100 text-slate-900 font-black">Skor</th>
                            </tr>
                            <tr className="text-[10px] font-mono border-b border-slate-200 text-center">
                              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
                              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
                              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
                              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">Taraf BS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {DANTON_CRITERIA.map((crit, idx) => {
                              const template = RUBRIC_SCALE_TEMPLATES[crit.template] || RUBRIC_SCALE_TEMPLATES.DANTON_UMUM;
                              const selectedVal = dantonRubricScores[crit.id];
                              const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');

                              const kItems = template.filter(t => t.grade === 'K');
                              const cItems = template.filter(t => t.grade === 'C');
                              const bItems = template.filter(t => t.grade === 'B');
                              const bsItems = template.filter(t => t.grade === 'BS');

                              return (
                                <tr key={crit.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                                    <div className="text-xs sm:text-sm font-bold">{crit.name}</div>
                                  </td>

                                  {/* KURANG */}
                                  <td className="py-2 px-2 text-center bg-red-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {kItems.map((opt, oIdx) => (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          disabled={isInputDisabled}
                                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                          } ${
                                            selectedVal === opt.val
                                              ? 'bg-red-600 text-white font-black shadow-sm ring-2 ring-red-400 scale-105'
                                              : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                                          }`}
                                        >
                                          {opt.val}
                                        </button>
                                      ))}
                                    </div>
                                  </td>

                                  {/* CUKUP */}
                                  <td className="py-2 px-2 text-center bg-amber-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {cItems.map((opt, oIdx) => (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          disabled={isInputDisabled}
                                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                          } ${
                                            selectedVal === opt.val
                                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-300 scale-105'
                                              : 'bg-white text-amber-800 hover:bg-amber-500 hover:text-slate-950 border border-amber-200'
                                          }`}
                                        >
                                          {opt.val}
                                        </button>
                                      ))}
                                    </div>
                                  </td>

                                  {/* BAIK */}
                                  <td className="py-2 px-2 text-center bg-emerald-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {bItems.map((opt, oIdx) => (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          disabled={isInputDisabled}
                                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                          } ${
                                            selectedVal === opt.val
                                              ? 'bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-400 scale-105'
                                              : 'bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                                          }`}
                                        >
                                          {opt.val}
                                        </button>
                                      ))}
                                    </div>
                                  </td>

                                  {/* SANGAT BAIK */}
                                  <td className="py-2 px-2 text-center bg-blue-50/40 border-r border-slate-200">
                                    <div className="flex items-center justify-center gap-1">
                                      {bsItems.map((opt, oIdx) => (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          disabled={isInputDisabled}
                                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                          } ${
                                            selectedVal === opt.val
                                              ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400 scale-105'
                                              : 'bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                                          }`}
                                        >
                                          {opt.val}
                                        </button>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Skor Terpilih */}
                                  <td className="py-2.5 px-3 text-center font-mono font-black text-base text-slate-900 bg-slate-50">
                                    {selectedVal ?? '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Pengurangan Nilai (Hakim Garis & Timer) */}
                  {activeJuryPost === 'penalti' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">
                            Hakim Garis & Petugas Timer Lapangan
                          </span>
                          <h4 className="font-black text-base text-slate-900 uppercase">
                            Kalkulator Pengurangan Nilai (Penalti Lapangan)
                          </h4>
                        </div>
                        <div className="text-right bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl">
                          <span className="text-[10px] text-rose-700 uppercase block font-bold">Total Pengurangan</span>
                          <span className="font-mono font-black text-2xl text-rose-700">-{penaltyDeduction} Poin</span>
                        </div>
                      </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                      {/* Injak Garis (Hakim Garis) */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900 text-sm">Hakim Garis: Injak Garis</span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-50 / kejadian</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 mb-3">Personel yang terbukti menginjak garis kotak arena lomba</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, injakGarisCount: Math.max(0, p.injakGarisCount - 1) }))}
                            className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
                          >-</button>
                          <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.injakGarisCount}</span>
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, injakGarisCount: p.injakGarisCount + 1 }))}
                            className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          >+</button>
                        </div>
                      </div>

                      {/* Kelebihan Waktu (Timer) */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900 text-sm">Timer: Kelebihan Waktu</span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-50 / 30 dtk</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 mb-3">Tiap 30 detik melebihi kuota {selectedTeam.jenjang === 'SD' ? '10' : '13'} menit</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: Math.max(0, p.overTimeBlocks - 1) }))}
                            className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
                          >-</button>
                          <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.overTimeBlocks}</span>
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: p.overTimeBlocks + 1 }))}
                            className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          >+</button>
                        </div>
                      </div>

                      {/* Personel Kurang */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-900 text-sm">Personel Kurang</span>
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-75 Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">Pasukan kurang dari 22 orang di lapangan</p>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
                          <input
                            type="checkbox"
                            checked={penalties.personelKurang}
                            onChange={e => setPenalties({ ...penalties, personelKurang: e.target.checked })}
                            className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
                        </label>
                      </div>

                      {/* Terlambat DP 1 */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-900 text-sm">Tidak Hadir DP 1</span>
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-100 Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">Tidak hadir setelah 3x pemanggilan berturut-turut</p>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
                          <input
                            type="checkbox"
                            checked={penalties.dp1}
                            onChange={e => setPenalties({ ...penalties, dp1: e.target.checked })}
                            className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
                        </label>
                      </div>

                      {/* Tidak Ikut Upacara */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between sm:col-span-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-900 text-sm">Tidak Ikut Upacara Pembukaan</span>
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-150 Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">Perwakilan peleton tidak mengikuti apel / upacara pembukaan resmi</p>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
                          <input
                            type="checkbox"
                            checked={penalties.upacara}
                            onChange={e => setPenalties({ ...penalties, upacara: e.target.checked })}
                            className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* 4. Catatan Evaluasi & Pengesahan Juri (Progressive Step UX) */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                    {/* Header & Status Stepper Visual */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                          Tahapan Scrutineering Resmi
                        </span>
                        <h4 className="font-black text-base text-slate-900 uppercase">
                          Pengesahan & Penguncian Nilai
                        </h4>
                      </div>

                      {/* Stepper Badge */}
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-[11px] font-bold">
                        <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          !existingScore || existingScore.status === 'draft' || existingScore.status === 'rejected_to_draft'
                            ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                            : 'text-slate-400'
                        }`}>
                          <span>1. Draft</span>
                        </span>
                        <span className="text-slate-300">→</span>
                        <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          existingScore?.status === 'verified'
                            ? 'bg-blue-600 text-white font-black shadow-xs'
                            : (existingScore?.isLocked ? 'text-blue-600' : 'text-slate-400')
                        }`}>
                          <span>2. Terverifikasi</span>
                        </span>
                        <span className="text-slate-300">→</span>
                        <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          existingScore?.isLocked
                            ? 'bg-emerald-600 text-white font-black shadow-xs'
                            : 'text-slate-400'
                        }`}>
                          <span>3. Final & Terkunci</span>
                        </span>
                      </div>
                    </div>

                    {/* Catatan Evaluasi Lapangan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Catatan Evaluasi Lapangan untuk Peleton
                      </label>
                      <textarea
                        rows={2}
                        disabled={existingScore?.isLocked}
                        value={juryNotes}
                        onChange={e => setJuryNotes(e.target.value)}
                        placeholder="Tuliskan evaluasi gerakan, kerapian, atau instruksi danton..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Action Bar Dinamis Berdasarkan Tahapan Status */}
                    <div className="pt-2">
                      {/* KONDISI 1: NILAI SUDAH DIKUNCI FINAL */}
                      {existingScore?.isLocked ? (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-black uppercase text-emerald-800">
                                Nilai Peleton Telah Disahkan & Dikunci Permanen
                              </div>
                              <p className="text-[11px] text-slate-600">
                                Disahkan oleh {existingScore.finalizedBy || 'Ketua Dewan Juri'}. Nilai masuk ke rekapitulasi resmi.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsRecapModalOpen(true)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Lihat Berita Acara</span>
                          </button>
                        </div>
                      ) : (
                        /* KONDISI 2: BELUM DIKUNCI - TAMPILKAN LANGKAH SESUAI STATUS */
                        <div className="space-y-3">
                          {/* JIKA STATUS MASIH DRAFT / BELUM DISIMPAN */}
                          {(!existingScore || existingScore.status === 'draft' || existingScore.status === 'rejected_to_draft') && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-amber-200">
                              <div>
                                <span className="text-xs font-bold text-amber-800 block">
                                  Langkah 1: Simpan Input Nilai Juri
                                </span>
                                <p className="text-[11px] text-slate-500">
                                  Pastikan seluruh nilai materi PBB, Danton, dan penalti telah dicocokkan dengan lembar kertas.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                              >
                                <Save className="w-4 h-4" />
                                <span>Simpan Hasil Nilai</span>
                              </button>
                            </div>
                          )}

                          {/* JIKA STATUS SUDAH TERSIMPAN (SIAP DIVERIFIKASI / DIKUNCI) */}
                          {existingScore && existingScore.status === 'draft' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-blue-200">
                              <div>
                                <span className="text-xs font-bold text-blue-800 block">
                                  Langkah 2: Verifikasi Kesesuaian Fisik (Scrutineering)
                                </span>
                                <p className="text-[11px] text-slate-500">
                                  Verifikator mencocokkan input sistem dengan foto blangko fisik dewan juri.
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleVerifyScoreAction(true)}
                                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Verifikasi Sah</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* JIKA STATUS SUDAH TERVERIFIKASI (SIAP DIKUNCI FINALISATOR) */}
                          {existingScore?.status === 'verified' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-emerald-200">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-emerald-800">
                                    Langkah 3: Pengesahan & Penguncian Final
                                  </span>
                                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono">
                                    Terverifikasi oleh {existingScore.verifiedBy || 'Verifikator'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Kunci nilai permanen agar tidak dapat diubah kembali dan terbit di Berita Acara Rekap Nilai.
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleVerifyScoreAction(false)}
                                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer"
                                  title="Kembalikan ke status Draft jika ditemukan ketidaksesuaian"
                                >
                                  <span>Batal Verifikasi</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleFinalizeScoreAction}
                                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                >
                                  <Lock className="w-4 h-4" />
                                  <span>Kunci & Sahkan Nilai</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

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

          </div>
        )}

        {/* TAB 2: LIVE LEADERBOARD & REKAP JUARA */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Rekapitulasi Nilai & Klasemen Dewan Juri</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Urutan peringkat resmi berdasarkan akumulasi nilai Danton dan Rerata PBB setelah pemotongan penalti.
                  </p>
                </div>

                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Berita Acara Rekap Nilai</span>
                </button>
              </div>

              {/* Grid 2 Jenjang: SD & SMP */}
              <div className="grid lg:grid-cols-2 gap-6">
                {['SD', 'SMP'].map(jenjang => {
                  const rankedTeams = teams
                    .filter(t => t.jenjang === jenjang && scores[t.id])
                    .map(t => ({
                      ...t,
                      scoreData: scores[t.id],
                      finalScore: scores[t.id].finalScore,
                    }))
                    .sort((a, b) => b.finalScore - a.finalScore);

                  return (
                    <div key={jenjang} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h4 className="font-black text-base text-slate-900 uppercase flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${jenjang === 'SD' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <span>Klasemen Tingkat {jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}</span>
                        </h4>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
                          {rankedTeams.length} Peleton Dinilai
                        </span>
                      </div>

                      <div className="space-y-3">
                        {rankedTeams.length === 0 ? (
                          <div className="py-10 text-center text-slate-400 text-xs italic">
                            Belum ada tim {jenjang} yang selesai dinilai juri.
                          </div>
                        ) : (
                          rankedTeams.map((team, idx) => {
                            return (
                              <div
                                key={team.id}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                  idx === 0
                                    ? 'bg-amber-50/60 border-amber-300 shadow-xs ring-1 ring-amber-400/40'
                                    : idx === 1
                                    ? 'bg-white border-slate-300 shadow-xs'
                                    : idx === 2
                                    ? 'bg-orange-50/40 border-orange-200'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-3.5">
                                  <div className={`w-9 h-9 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                                    idx === 0
                                      ? 'bg-amber-400 text-slate-950 shadow-amber-400/50'
                                      : idx === 1
                                      ? 'bg-slate-200 text-slate-800'
                                      : idx === 2
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}>
                                    #{idx + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-black text-slate-900 text-sm">{team.schoolName}</span>
                                      {idx === 0 && (
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                                          Juara 1
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                                      Rerata PBB: <span className="text-slate-800 font-bold">{team.scoreData.pbb?.total ?? 0}</span>
                                      {team.scoreData.pbb?.j1 !== undefined && team.scoreData.pbb?.j2 !== undefined ? (
                                        <span className="text-slate-400 text-[10px]"> (J1:{team.scoreData.pbb.j1} J2:{team.scoreData.pbb.j2})</span>
                                      ) : ''}
                                      {' • '}Danton: <span className="text-slate-800 font-bold">{team.scoreData.danton?.total ?? 0}</span>
                                      {team.scoreData.penalties?.totalPenalty > 0 && (
                                        <span className="text-rose-600 font-bold"> • Penalti: -{team.scoreData.penalties.totalPenalty}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-mono font-black text-xl text-slate-900 block">
                                    {team.finalScore}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">Poin</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal Pemilih Peleton Cepat (Fullscreen/Dialog) */}
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
                      Pilih Peleton yang Dinilai
                    </h3>
                    <p className="text-xs text-slate-500">
                      {verifiedTeams.length} Peleton Siap Dinilai (Check-in Basecamp)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Jenjang & Input Pencarian */}
              <div className="p-5 border-b border-slate-100 space-y-3 bg-slate-50">
                <div className="flex items-center bg-slate-200/70 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setSidebarJenjang('ALL')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      sidebarJenjang === 'ALL' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({teams.filter(t => (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarJenjang('SMP')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      sidebarJenjang === 'SMP' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SMP/MTs ({teams.filter(t => t.jenjang === 'SMP' && (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarJenjang('SD')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      sidebarJenjang === 'SD' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SD/MI ({teams.filter(t => t.jenjang === 'SD' && (t.status === 'verified' || t.status === 'drawn') && isTeamCheckedIn(t.id)).length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={e => setSidebarSearch(e.target.value)}
                    placeholder="Ketik nama sekolah, no. undi, nomor dada, danton..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Daftar Peleton Scrollable */}
              <div className="p-5 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
                {verifiedTeams.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm text-slate-700 font-bold">
                      Tidak ada peleton yang cocok dengan pencarian / siap dinilai.
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Pastikan peleton sudah melakukan <span className="text-teal-700 font-semibold">check-in Basecamp</span> pada sistem Staging Panitia.
                    </p>
                  </div>
                ) : (
                  verifiedTeams.map(team => {
                    const isSelected = selectedTeamId === team.id;
                    const teamScore = scores[team.id];
                    const juries = teamScore?.juries || {};
                    const hasJuri1 = !!juries.pos1 || (teamScore?.pbb?.j1 !== undefined && teamScore?.pbb?.j1 !== null) || (teamScore?.pbb?.total !== undefined);
                    const hasJuri2 = !!juries.pos2 || (teamScore?.pbb?.j2 !== undefined && teamScore?.pbb?.j2 !== null);
                    const hasJuri3 = !!juries.pos3 || (teamScore?.danton?.total !== undefined);
                    const isComplete = hasJuri1 && hasJuri2 && hasJuri3;
                    const hasAny = hasJuri1 || hasJuri2 || hasJuri3;

                    return (
                      <div
                        key={team.id}
                        onClick={() => {
                          handleSelectTeam(team.id);
                          setIsTeamModalOpen(false);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Nomor Dada Badge */}
                          <div className={`w-12 h-12 rounded-xl font-mono font-black text-sm flex flex-col items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                              : 'bg-slate-100 text-slate-900 border-slate-200'
                          }`}>
                            <span className="text-[8px] text-slate-500 font-sans font-bold leading-none">DADA</span>
                            <span className="leading-tight text-base">{team.chestNumber ? String(team.chestNumber).padStart(2, '0') : '-'}</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm truncate">{team.schoolName}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                                Undi: #{team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '-'}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 truncate block mt-0.5">
                              {team.platoonName} • Jenjang: <strong className="text-slate-700">{team.jenjang}</strong> • Danton: <span className="text-slate-800 font-semibold">{team.roster?.danton?.name || team.dantonName || '-'}</span>
                            </span>
                            
                            {/* Live Juri Status Badges */}
                            <div className="flex items-center gap-1.5 mt-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                  hasJuri1 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                J1 Teknik {hasJuri1 ? '✓' : '•'}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                  hasJuri2 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                J2 Kekompakan {hasJuri2 ? '✓' : '•'}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                  hasJuri3 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                J3 Danton {hasJuri3 ? '✓' : '•'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Nilai / Skor Akhir */}
                        <div className="text-right shrink-0">
                          {teamScore?.isLocked ? (
                            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl block">
                              🔒 FINAL ({teamScore.finalScore} pt)
                            </span>
                          ) : isComplete ? (
                            <span className="text-xs font-mono font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl block">
                              {teamScore?.finalScore ?? 0} <span className="text-[10px] font-normal">pt</span>
                            </span>
                          ) : hasAny ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl block">
                              Sebagian
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl block border border-slate-200">
                              Belum Dinilai
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Klik baris peleton untuk langsung membuka lembar formulir penilaian.</span>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Berita Acara Rekap Nilai Resmi (Print-Ready) */}
        <OfficialScoreRecapModal
          isOpen={isRecapModalOpen}
          onClose={() => setIsRecapModalOpen(false)}
        />

      </div>
    </SimpaskorSidebarLayout>
  );
}
