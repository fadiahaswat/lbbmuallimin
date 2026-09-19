import React, { useState, useMemo } from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  AlertOctagon,
  Users,
  Printer,
  ChevronRight,
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
  RUBRIC_SCALE_TEMPLATES,
  DANTON_CRITERIA,
  VARIASI_CRITERIA,
  getScaleTemplateForMaterial
} from '../../config.js';
import OfficialScoreRecapModal from './OfficialScoreRecapModal.jsx';

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

// Helper initial variasi formasi rubrik (semua null = belum diinput)
function getInitialVariasiRubric() {
  const initial = {};
  VARIASI_CRITERIA.forEach(c => {
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

  // Akses Terbatas: Admin, Superadmin, atau 3 Petugas Resmi (Penginput, Verifikator, Finalisator) / Dewan Juri
  const hasAccess = currentUser && [
    'admin',
    'superadmin',
    'penginput',
    'verifikator',
    'finalisator',
    'juri'
  ].includes(currentUser.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/70 border border-amber-500/30 px-3 py-1 rounded-full">
              Khusus Petugas & Dewan Juri
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mt-3">
              Portal E-Scoring & Scrutineering
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Halaman ini diperuntukkan bagi 3 Petugas Resmi: Petugas Penginput Nilai Kertas, Verifikator, dan Finalisator (Ketua Dewan Juri).
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openModal('auth')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
            >
              Masuk Akun Petugas / Juri
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('scoring'); // 'scoring' | 'leaderboard'
  const [activeJuryPost, setActiveJuryPost] = useState('all'); // 'all' | 'pos1' | 'pos2' | 'pos3'
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
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

  // Rubrik Juri 1: PBB Pasukan
  const [pbb1RubricScores, setPbb1RubricScores] = useState(() => getInitialRubricScores(materialsList));

  // Rubrik Juri 2: Komandan (Danton)
  const [dantonRubricScores, setDantonRubricScores] = useState(getInitialDantonRubric);

  // Rubrik Juri 3: Variasi & Formasi
  const [variasiRubricScores, setVariasiRubricScores] = useState(getInitialVariasiRubric);

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

      // Load rubrik PBB Juri 1
      if (juries.pos1?.rubricScores) {
        setPbb1RubricScores(juries.pos1.rubricScores);
      } else if (score.pbb?.rubricScores) {
        setPbb1RubricScores(score.pbb.rubricScores);
      } else {
        setPbb1RubricScores(getInitialRubricScores(mList));
      }

      // Load rubrik Danton Juri 2
      if (juries.pos2?.rubricScores) {
        setDantonRubricScores(juries.pos2.rubricScores);
      } else if (score.danton?.rubricScores) {
        setDantonRubricScores(score.danton.rubricScores);
      } else {
        setDantonRubricScores(getInitialDantonRubric());
      }

      // Load rubrik Variasi & Formasi Juri 3
      if (juries.pos3?.rubricScores) {
        setVariasiRubricScores(juries.pos3.rubricScores);
      } else if (score.variasi?.rubricScores) {
        setVariasiRubricScores(score.variasi.rubricScores);
      } else {
        setVariasiRubricScores(getInitialVariasiRubric());
      }

      setPaperEvidenceUrl(score.paperEvidenceUrl || '');
      setVerificationNoteInput(score.verificationNotes || '');
      setPenalties(score.penalties || { upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes(score.notes || '');
    } else {
      setPbb1RubricScores(getInitialRubricScores(mList));
      setDantonRubricScores(getInitialDantonRubric());
      setVariasiRubricScores(getInitialVariasiRubric());
      setPaperEvidenceUrl('');
      setVerificationNoteInput('');
      setPenalties({ upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes('');
    }
  }

  // Hitung total skor PBB Juri 1
  const pbb1Total = useMemo(() => {
    return Object.values(pbb1RubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [pbb1RubricScores]);

  // Hitung total skor Danton Juri 2
  const dantonTotal = useMemo(() => {
    return Object.values(dantonRubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [dantonRubricScores]);

  // Hitung total skor Variasi & Formasi Juri 3
  const variasiTotal = useMemo(() => {
    return Object.values(variasiRubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [variasiRubricScores]);

  let penaltyDeduction = 0;
  if (penalties.upacara) penaltyDeduction += 150;
  if (penalties.dp1) penaltyDeduction += 100;
  if (penalties.personelKurang) penaltyDeduction += 75;
  penaltyDeduction += (penalties.overTimeBlocks || 0) * 50;
  penaltyDeduction += (penalties.injakGarisCount || 0) * 50;
  if ((penalties.penyesuaianCount || 0) > 3) penaltyDeduction += 25;

  // Total skor 3 Dewan Juri (PBB + Danton + Variasi Formasi - Penalti)
  const totalCalculatedScore = useMemo(() => {
    if (activeJuryPost === 'pos1') return Math.max(0, pbb1Total - penaltyDeduction);
    if (activeJuryPost === 'pos2') return Math.max(0, dantonTotal - penaltyDeduction);
    if (activeJuryPost === 'pos3') return Math.max(0, variasiTotal - penaltyDeduction);
    return parseFloat(Math.max(0, pbb1Total + dantonTotal + variasiTotal - penaltyDeduction).toFixed(2));
  }, [activeJuryPost, pbb1Total, dantonTotal, variasiTotal, penaltyDeduction]);

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
      danton: { total: dantonTotal, rubricScores: dantonRubricScores },
      variasi: { total: variasiTotal, rubricScores: variasiRubricScores },
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
    <div className="min-h-screen bg-slate-950 py-6 px-3 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Header Glassmorphism */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/80 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800/80 backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <Award className="w-8 h-8 drop-shadow-sm" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    E-SCORING DEWAN JURI
                  </span>
                  <span className="text-xs text-slate-400 font-medium">LBB Mu'allimin 2026 • 1 Pos Arena</span>
                  {currentUser && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-800 text-slate-200 border-slate-700 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentUser.role === 'penginput' ? 'bg-amber-400' :
                        currentUser.role === 'verifikator' ? 'bg-blue-400' :
                        currentUser.role === 'finalisator' ? 'bg-emerald-400' : 'bg-purple-400'
                      }`} />
                      <span>{currentUser.email}</span>
                      <span className="text-slate-400">({currentUser.roleLabel || currentUser.role})</span>
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1 flex items-center gap-2">
                  <span>E-Scoring & Rekap Nilai</span>
                </h1>
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-bold">Progress:</span>
                <span className="font-mono text-emerald-400 font-black">{scoredCount} / {totalDrawnCount} Dinilai</span>
              </div>

              {(currentUser?.role === 'finalisator' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Berita Acara (PDF)</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab(activeTab === 'scoring' ? 'leaderboard' : 'scoring')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>{activeTab === 'scoring' ? 'Lihat Klasemen Juara' : 'Input Nilai Juri'}</span>
              </button>

              <button
                onClick={() => setActiveView('landing')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                Beranda
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection & Jury Selector Integrated Ribbon */}
        {activeTab === 'scoring' && (
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Pos Juri Role Selector Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mode Juri:</span>
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('all');
                    setJuryName('Dewan Juri Utama LBB');
                    setJuryRole('Dewan Juri Utama');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeJuryPost === 'all'
                      ? 'bg-slate-100 text-slate-950 shadow-md ring-2 ring-white/30 scale-102'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  <span>Semua Juri (Full)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('pos1');
                    setJuryName(JURY_POSTS.pos1.defaultName);
                    setJuryRole(JURY_POSTS.pos1.title);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeJuryPost === 'pos1'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50 ring-2 ring-blue-400/50 scale-102'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Juri 1: PBB Pasukan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('pos2');
                    setJuryName(JURY_POSTS.pos2.defaultName);
                    setJuryRole(JURY_POSTS.pos2.title);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeJuryPost === 'pos2'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 ring-2 ring-red-400/50 scale-102'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Juri 2: Komandan (Danton)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('pos3');
                    setJuryName(JURY_POSTS.pos3.defaultName);
                    setJuryRole(JURY_POSTS.pos3.title);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeJuryPost === 'pos3'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 ring-2 ring-purple-400/50 scale-102'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Juri 3: Variasi & Formasi</span>
                </button>
              </div>

              {/* Status Online & System Badge */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Offline-Ready (Tersimpan Otomatis)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="bg-emerald-600/90 text-white px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-xl border border-emerald-400/30 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
            <span className="flex-1">{saveSuccessMsg}</span>
          </div>
        )}

        {/* TAB 1: FORMULIR PENILAIAN */}
        {activeTab === 'scoring' && (
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left 4 Cols: Platoon Selector Sidebar with Filter & Search */}
            <div className="lg:col-span-4 bg-slate-900/95 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                    Daftar Tampil Peleton
                  </span>
                  <h4 className="font-black text-base text-white uppercase">
                    Pilih Peleton
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl border border-slate-700">
                  {verifiedTeams.length} Peleton
                </span>
              </div>

              {/* Jenjang Filter Pill & Search Bar */}
              <div className="space-y-2">
                <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 text-xs">
                  <button
                    type="button"
                    onClick={() => setSidebarJenjang('ALL')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      sidebarJenjang === 'ALL' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarJenjang('SMP')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      sidebarJenjang === 'SMP' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SMP/MTs
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarJenjang('SD')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      sidebarJenjang === 'SD' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SD/MI
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={e => setSidebarSearch(e.target.value)}
                    placeholder="Cari sekolah, no undi, danton..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Scrollable Team List */}
              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
                {verifiedTeams.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <p className="text-xs text-slate-400 italic">
                      Tidak ada peleton yang siap dinilai.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Hanya peleton yang sudah <span className="font-mono text-teal-400">check-in Basecamp</span> dan berstatus <span className="font-mono text-emerald-400">drawn</span> yang muncul di sini.
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
                        onClick={() => handleSelectTeam(team.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                            : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Nomor Dada badge */}
                          <div className={`w-12 h-12 rounded-xl font-mono font-black text-sm flex flex-col items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : 'bg-slate-900 text-yellow-400 border-slate-700'
                          }`}>
                            <span className="text-[8px] text-slate-300 font-sans font-bold leading-none">DADA</span>
                            <span className="leading-tight text-base">{team.chestNumber ? String(team.chestNumber).padStart(2, '0') : '-'}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-black text-white text-xs truncate block">{team.schoolName}</span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {team.jenjang} • Danton: <span className="text-slate-300 font-semibold">{team.roster?.danton?.name || team.dantonName || '-'}</span>
                            </span>
                            <span className="text-[9px] text-slate-500 block">
                              No. Undi: {team.lotNumber ? `#${String(team.lotNumber).padStart(2, '0')}` : '-'}
                            </span>
                            
                            {/* Live Juri Badges (J1, J2, J3) */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span
                                title="Juri 1: PBB Pasukan"
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                  hasJuri1 ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                J1 {hasJuri1 ? '✓' : '•'}
                              </span>
                              <span
                                title="Juri 2: Komandan (Danton)"
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                  hasJuri2 ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                J2 {hasJuri2 ? '✓' : '•'}
                              </span>
                              <span
                                title="Juri 3: Variasi & Formasi"
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                  hasJuri3 ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                J3 {hasJuri3 ? '✓' : '•'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {isComplete ? (
                            <span className="text-[11px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-1 rounded-xl block">
                              {teamScore?.finalScore ?? 0} <span className="text-[9px] font-normal">pt</span>
                            </span>
                          ) : hasAny ? (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 rounded-lg block">
                              Parsial
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-lg block border border-slate-700">
                              Antre
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right 8 Cols: Scoring Inputs Form */}
            <div className="lg:col-span-8 space-y-6">
              {selectedTeam ? (
                <form onSubmit={handleSaveDraft} className="space-y-6">
                  
                  {/* Active Platoon Hero Card */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-xs text-yellow-400 bg-yellow-400/15 border border-yellow-400/30 px-2.5 py-0.5 rounded-md">
                          {selectedTeam.regCode}
                        </span>
                        {selectedTeam.chestNumber && (
                          <span className="font-mono font-black text-sm text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-0.5 rounded-md">
                            No. Dada: {selectedTeam.chestNumber}
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                          Undi: #{selectedTeam.lotNumber ? String(selectedTeam.lotNumber).padStart(2, '0') : '-'}
                        </span>
                        <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          Tingkat {selectedTeam.jenjang}
                        </span>

                        {/* Status Scrutineering Badge */}
                        {existingScore?.isLocked || existingScore?.status === 'finalized' ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>FINAL (Terkunci)</span>
                          </span>
                        ) : existingScore?.status === 'verified' ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>TERVERIFIKASI</span>
                          </span>
                        ) : existingScore?.status === 'draft' ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>DRAFT PENGINPUT</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                            Belum Diinput
                          </span>
                        )}
                      </div>

                      <h3 className="font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                        {selectedTeam.schoolName}
                      </h3>

                      <p className="text-xs text-slate-300">
                        {selectedTeam.platoonName} • Komandan: <strong className="text-yellow-400">{selectedTeam.roster?.danton?.name || selectedTeam.dantonName || '-'}</strong>
                      </p>

                      {/* Realtime Breakdown Badges for 3 Juries */}
                      <div className="flex items-center gap-2 pt-1.5 flex-wrap text-xs font-mono">
                        <span className="px-2 py-0.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300">
                          J1 (PBB): <strong className="text-white">{existingScore ? pbb1Total : '-'}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300">
                          J2 (Danton): <strong className="text-white">{existingScore ? dantonTotal : '-'}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300">
                          J3 (Variasi): <strong className="text-white">{existingScore ? variasiTotal : '-'}</strong>
                        </span>
                        {penaltyDeduction > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold">
                            Penalti: -{penaltyDeduction}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total Running Score Badge */}
                    <div className="relative bg-slate-950/80 rounded-2xl p-4 text-right shrink-0 border border-slate-700/80 shadow-inner">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                        {activeJuryPost === 'all' ? 'Total Skor Akhir' : 'Subtotal Juri Aktif'}
                      </span>
                      {existingScore ? (
                        <span className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono tracking-tight">
                          {totalCalculatedScore}
                        </span>
                      ) : (
                        <span className="text-xl sm:text-2xl font-black text-slate-500 font-mono tracking-tight">
                          -
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-bold">
                        {existingScore ? 'Poin Lapangan' : 'Belum Diinput'}
                      </span>
                    </div>
                  </div>

                  {/* UPLOAD & AUDIT FOTO BLANGKO KERTAS JURI FISIK */}
                  <div className="bg-slate-900/95 rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white uppercase flex items-center gap-2">
                            <span>Foto Bukti Blangko Kertas Juri Fisik</span>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase">
                              Wajib Scrutineering
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Juri menilai di atas kertas fisik di lapangan. Penginput mengunggah foto blangko untuk diaudit oleh Verifikator & disahkan Finalisator.
                          </p>
                        </div>
                      </div>

                      {/* File Upload Input */}
                      {(!existingScore?.isLocked && (currentUser?.role === 'penginput' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin')) && (
                        <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all">
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
                        <div className="relative max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner group">
                          <img
                            src={paperEvidenceUrl}
                            alt="Bukti Blangko Kertas Fisik Dewan Juri"
                            className="w-full max-h-72 object-contain mx-auto"
                          />
                          <div className="absolute bottom-2 right-2 px-3 py-1 bg-slate-900/90 backdrop-blur-md rounded-xl text-[10px] text-slate-300 font-mono border border-slate-700">
                            Bukti Fisik Terunggah
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-2">
                        <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-400">
                          Belum ada foto lembar kertas dewan juri yang diunggah.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Penginput nilai dapat memotret lembar kertas fisik juri menggunakan kamera HP / tab lalu mengunggahnya ke sini.
                        </p>
                      </div>
                    )}

                    {/* Verification Notes History */}
                    {existingScore?.verificationNotes && (
                      <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Catatan Verifikator / Finalisator:</span>
                        </div>
                        <p className="text-slate-200 pl-5 italic">
                          "{existingScore.verificationNotes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* JURI 1: Penilaian Gerakan Materi PBB Pasukan */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos1') && (
                    <div className="bg-slate-900/95 rounded-3xl p-6 border border-blue-500/30 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider bg-blue-950/70 border border-blue-500/40 px-2.5 py-1 rounded-lg">
                              Dewan Juri 1 • PBB Pasukan
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">
                              Materi Resmi ({selectedTeam.jenjang}) • {materialsList.length} Gerakan
                            </span>
                          </div>
                          <h4 className="font-black text-base text-white uppercase mt-1">
                            A - D. Penilaian Gerakan Materi PBB Pasukan (Juri 1)
                          </h4>
                        </div>
                        <div className="text-right bg-blue-950/60 border border-blue-500/30 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-blue-300 font-bold uppercase block">Subtotal Juri 1 (PBB)</span>
                          <span className="font-mono font-black text-2xl text-blue-400">{pbb1Total} <span className="text-xs font-normal text-slate-400">Poin</span></span>
                        </div>
                      </div>

                      {/* Petunjuk Coret Nilai Juri 1 */}
                      <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-300">Skala Predikat:</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">K (Kurang)</span>
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-[10px]">C (Cukup)</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">B (Baik)</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-[10px]">BS (Baik Sekali)</span>
                        </div>
                        <span className="text-slate-400 italic">Tap angka untuk memasukkan nilai dari lembar kertas</span>
                      </div>

                      {/* Tabel Checklist Materi Gerakan PBB Juri 1 */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-[500px] overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="sticky top-0 z-10 bg-slate-950 text-slate-300 font-bold text-[11px] uppercase border-b border-slate-800">
                            <tr>
                              <th className="py-3 px-3 w-10 text-center">No</th>
                              <th className="py-3 px-3">Materi Gerakan Lomba</th>
                              <th className="py-3 px-3 text-center w-80">Rentang Nilai (K - C - B - BS)</th>
                              <th className="py-3 px-3 text-center w-20">Skor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                            {materialsList.map((materiText, idx) => {
                              const templateKey = getScaleTemplateForMaterial(materiText);
                              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
                              const selectedVal = pbb1RubricScores[idx];

                              return (
                                <tr key={idx} className="hover:bg-blue-950/20 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                                    <div className="text-sm font-bold text-white">{materiText}</div>
                                    <div className="text-[10px] text-blue-400 font-mono font-medium">
                                      Kategori: {templateKey.replace('_', ' ')}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {template.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setPbb1RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-9 py-1.5 px-2 rounded-xl text-xs font-mono font-black transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400 scale-105'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                                            }`}
                                            title={`Predikat: ${opt.grade} (${opt.val})`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-black text-base text-blue-400 bg-blue-950/40">
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

                  {/* JURI 2: Penilaian Komandan Peleton (Danton) */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos2') && (
                    <div className="bg-slate-900/95 rounded-3xl p-6 border border-red-500/30 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-red-400 tracking-wider bg-red-950/70 border border-red-500/40 px-2.5 py-1 rounded-lg">
                              Dewan Juri 2 • Komandan Peleton (Danton)
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">Standar Rubrik K / C / B / BS</span>
                          </div>
                          <h4 className="font-black text-base text-white uppercase mt-1">
                            E. Penilaian Komandan Pasukan (Danton)
                          </h4>
                        </div>
                        <div className="text-right bg-red-950/60 border border-red-500/30 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-red-300 font-bold uppercase block">Subtotal Danton (Juri 2)</span>
                          <span className="font-mono font-black text-2xl text-red-400">{dantonTotal} <span className="text-xs font-normal text-slate-400">Poin</span></span>
                        </div>
                      </div>

                      {/* Tabel Checklist Danton Juri 2 */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-950 text-slate-300 font-bold text-[11px] uppercase border-b border-slate-800">
                              <th className="py-3 px-3 w-8 text-center">No</th>
                              <th className="py-3 px-3">Kriteria Penilaian Danton</th>
                              <th className="py-3 px-3 text-center w-80">Pilihan Nilai (Klik Nilai)</th>
                              <th className="py-3 px-3 text-center w-20">Skor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                            {DANTON_CRITERIA.map((crit, idx) => {
                              const template = RUBRIC_SCALE_TEMPLATES[crit.template] || RUBRIC_SCALE_TEMPLATES.DANTON_UMUM;
                              const selectedVal = dantonRubricScores[crit.id];

                              return (
                                <tr key={crit.id} className="hover:bg-red-950/20 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-white">{crit.name}</td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {template.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                            className={`min-w-9 py-1.5 px-2 rounded-xl text-xs font-mono font-black transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400 scale-105'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                                            }`}
                                            title={`Predikat: ${opt.grade} (${opt.val})`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-black text-base text-red-400 bg-red-950/40">
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

                  {/* JURI 3: Penilaian Variasi & Formasi */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos3') && (
                    <div className="bg-slate-900/95 rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider bg-purple-950/70 border border-purple-500/40 px-2.5 py-1 rounded-lg">
                              Dewan Juri 3 • Variasi & Formasi
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">Kreativitas, Kerapian, Kekompakan, Keindahan</span>
                          </div>
                          <h4 className="font-black text-base text-white uppercase mt-1">
                            F. Penilaian Unsur Variasi & Formasi Pasukan
                          </h4>
                        </div>
                        <div className="text-right bg-purple-950/60 border border-purple-500/30 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-purple-300 font-bold uppercase block">Subtotal Variasi (Juri 3)</span>
                          <span className="font-mono font-black text-2xl text-purple-400">{variasiTotal} <span className="text-xs font-normal text-slate-400">Poin</span></span>
                        </div>
                      </div>

                      {/* Tabel Checklist Variasi & Formasi Juri 3 */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-950 text-slate-300 font-bold text-[11px] uppercase border-b border-slate-800">
                              <th className="py-3 px-3 w-8 text-center">No</th>
                              <th className="py-3 px-3">Kriteria Variasi & Formasi</th>
                              <th className="py-3 px-3 text-center w-80">Pilihan Nilai (Klik Nilai)</th>
                              <th className="py-3 px-3 text-center w-20">Skor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                            {VARIASI_CRITERIA.map((crit, idx) => {
                              const template = RUBRIC_SCALE_TEMPLATES[crit.template] || RUBRIC_SCALE_TEMPLATES.DANTON_UMUM;
                              const selectedVal = variasiRubricScores[crit.id];

                              return (
                                <tr key={crit.id} className="hover:bg-purple-950/20 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-white">{crit.name}</td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {template.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        const isInputDisabled = existingScore?.isLocked || (currentUser?.role !== 'penginput' && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin');
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={isInputDisabled}
                                            onClick={() => setVariasiRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                            className={`min-w-9 py-1.5 px-2 rounded-xl text-xs font-mono font-black transition-all ${
                                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                              isChosen
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-400 scale-105'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                                            }`}
                                            title={`Predikat: ${opt.grade} (${opt.val})`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-black text-base text-purple-400 bg-purple-950/40">
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

                  {/* 3. Pengurangan Nilai (Hakim Garis & Timer) */}
                  <div className="bg-slate-900/95 rounded-3xl p-6 border border-rose-500/30 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider block">
                          Hakim Garis & Petugas Timer Lapangan
                        </span>
                        <h4 className="font-black text-base text-white uppercase">
                          Kalkulator Pengurangan Nilai (Penalti Lapangan)
                        </h4>
                      </div>
                      <div className="text-right bg-rose-950/60 border border-rose-500/30 px-4 py-2 rounded-2xl">
                        <span className="text-[10px] text-rose-300 uppercase block font-bold">Total Pengurangan</span>
                        <span className="font-mono font-black text-2xl text-rose-400">-{penaltyDeduction} Poin</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                      {/* Injak Garis (Hakim Garis) */}
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-white text-sm">Hakim Garis: Injak Garis</span>
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/30">-50 / kejadian</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 mb-3">Personel yang terbukti menginjak garis kotak arena lomba</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, injakGarisCount: Math.max(0, p.injakGarisCount - 1) }))}
                            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-700"
                          >-</button>
                          <span className="font-mono font-black text-base w-10 text-center text-white">{penalties.injakGarisCount}</span>
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, injakGarisCount: p.injakGarisCount + 1 }))}
                            className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-md shadow-rose-950/50"
                          >+</button>
                        </div>
                      </div>

                      {/* Kelebihan Waktu (Timer) */}
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-white text-sm">Timer: Kelebihan Waktu</span>
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/30">-50 / 30 dtk</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 mb-3">Tiap 30 detik melebihi kuota {selectedTeam.jenjang === 'SD' ? '10' : '13'} menit</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: Math.max(0, p.overTimeBlocks - 1) }))}
                            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-700"
                          >-</button>
                          <span className="font-mono font-black text-base w-10 text-center text-white">{penalties.overTimeBlocks}</span>
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: p.overTimeBlocks + 1 }))}
                            className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-md shadow-rose-950/50"
                          >+</button>
                        </div>
                      </div>

                      {/* Personel Kurang */}
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-sm">Personel Kurang</span>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/30">-75 Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Pasukan kurang dari 22 orang di lapangan</p>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-slate-900 p-2 rounded-xl border border-slate-800 hover:border-slate-700">
                          <input
                            type="checkbox"
                            checked={penalties.personelKurang}
                            onChange={e => setPenalties({ ...penalties, personelKurang: e.target.checked })}
                            className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-300">Terapkan Penalti</span>
                        </label>
                      </div>

                      {/* Terlambat DP 1 */}
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-sm">Tidak Hadir DP 1</span>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/30">-100 Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Tidak hadir setelah 3x pemanggilan berturut-turut</p>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-slate-900 p-2 rounded-xl border border-slate-800 hover:border-slate-700">
                          <input
                            type="checkbox"
                            checked={penalties.dp1}
                            onChange={e => setPenalties({ ...penalties, dp1: e.target.checked })}
                            className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-300">Terapkan Penalti</span>
                        </label>
                      </div>

                      {/* Tidak Ikut Upacara */}
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between sm:col-span-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-sm">Tidak Ikut Upacara Pembukaan</span>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/30">-150 Poin</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Perwakilan peleton tidak mengikuti apel / upacara pembukaan resmi</p>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-slate-900 p-2 rounded-xl border border-slate-800 hover:border-slate-700">
                          <input
                            type="checkbox"
                            checked={penalties.upacara}
                            onChange={e => setPenalties({ ...penalties, upacara: e.target.checked })}
                            className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-300">Terapkan Penalti</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. Catatan Evaluasi & Pengesahan Juri */}
                  <div className="bg-slate-900/95 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                    <h4 className="font-black text-base text-white uppercase">
                      Catatan Scrutineering & Pengesahan
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Petugas / Dewan Juri</label>
                        <input
                          type="text"
                          required
                          value={juryName}
                          onChange={e => setJuryName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs font-bold text-white focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Jabatan / Role</label>
                        <input
                          type="text"
                          value={juryRole}
                          onChange={e => setJuryRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-200 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Catatan Khusus Lembar Kertas / Evaluasi</label>
                      <textarea
                        rows={2}
                        value={juryNotes}
                        onChange={e => setJuryNotes(e.target.value)}
                        placeholder="Contoh: Keseluruhan gerakan rapi, aba-aba danton terdengar jelas di seluruh arena..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-200 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Input Catatan Verifikator jika Verifikator sedang mengaudit */}
                    {(currentUser?.role === 'verifikator' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                      <div>
                        <label className="block text-xs font-bold text-blue-400 uppercase mb-1">Catatan Verifikasi (Verifikator)</label>
                        <input
                          type="text"
                          value={verificationNoteInput}
                          onChange={e => setVerificationNoteInput(e.target.value)}
                          placeholder="Contoh: Skor sistem telah sesuai 100% dengan blangko fisik Juri 1, 2, dan 3."
                          className="w-full px-3.5 py-2 bg-slate-950 border border-blue-500/40 focus:border-blue-400 rounded-xl text-xs text-slate-200 focus:outline-none transition-colors"
                        />
                      </div>
                    )}

                    {/* ACTION BUTTONS BERDASARKAN ROLE USER */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">
                        Login sebagai: <strong className="text-emerald-400 uppercase">{currentUser?.role}</strong> ({currentUser?.name})
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* 1. Penginput: Simpan Draft Nilai */}
                        {(!existingScore?.isLocked && (currentUser?.role === 'penginput' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin')) && (
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>Simpan Draft Nilai</span>
                          </button>
                        )}

                        {/* 2. Verifikator: Approve / Reject ke Draft */}
                        {(!existingScore?.isLocked && (currentUser?.role === 'verifikator' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin')) && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleVerifyScoreAction(false)}
                              className="px-4 py-3 bg-rose-600/80 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all cursor-pointer border border-rose-500/50"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Kembalikan ke Draft</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerifyScoreAction(true)}
                              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-950/40 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Setujui (Verifikasi Sah)</span>
                            </button>
                          </>
                        )}

                        {/* 3. Finalisator: Kunci Permanen & Sahkan Nilai */}
                        {(currentUser?.role === 'finalisator' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                          <button
                            type="button"
                            disabled={existingScore?.isLocked}
                            onClick={handleFinalizeScoreAction}
                            className={`px-6 py-3 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                              existingScore?.isLocked
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white shadow-xl shadow-emerald-950/50'
                            }`}
                          >
                            <Lock className="w-4 h-4" />
                            <span>{existingScore?.isLocked ? 'Nilai Sudah Terkunci Permanen' : 'Kunci Permanen & Sahkan Berita Acara'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </form>
              ) : (
                <div className="text-center py-24 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500 border border-slate-700">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-white uppercase">Belum Ada Peleton Dipilih</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Pilih salah satu peleton dari daftar di sisi kiri untuk memulai penginputan rubrik penilaian juri.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LIVE LEADERBOARD & REKAP JUARA */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Rekapitulasi Nilai & Klasemen Dewan Juri</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Urutan peringkat resmi berdasarkan akumulasi nilai Danton dan Rerata PBB setelah pemotongan penalti.
                  </p>
                </div>

                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-lg shadow-blue-950/40"
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
                    <div key={jenjang} className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <h4 className="font-black text-base text-white uppercase flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${jenjang === 'SD' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <span>Klasemen Tingkat {jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}</span>
                        </h4>
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                          {rankedTeams.length} Peleton Dinilai
                        </span>
                      </div>

                      <div className="space-y-3">
                        {rankedTeams.length === 0 ? (
                          <div className="py-10 text-center text-slate-500 text-xs italic">
                            Belum ada tim {jenjang} yang selesai dinilai juri.
                          </div>
                        ) : (
                          rankedTeams.map((team, idx) => {
                            return (
                              <div
                                key={team.id}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                  idx === 0
                                    ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/30'
                                    : idx === 1
                                    ? 'bg-slate-900/90 border-slate-500/50'
                                    : idx === 2
                                    ? 'bg-orange-950/20 border-orange-500/40'
                                    : 'bg-slate-900/60 border-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-3.5">
                                  <div className={`w-9 h-9 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-inner ${
                                    idx === 0
                                      ? 'bg-amber-400 text-slate-950 shadow-amber-400/50'
                                      : idx === 1
                                      ? 'bg-slate-300 text-slate-900'
                                      : idx === 2
                                      ? 'bg-amber-700 text-white'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                                  }`}>
                                    #{idx + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-black text-white text-sm">{team.schoolName}</span>
                                      {idx === 0 && (
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                                          Juara 1
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                      Rerata PBB: <span className="text-white font-bold">{team.scoreData.pbb?.total ?? 0}</span>
                                      {team.scoreData.pbb?.j1 !== undefined && team.scoreData.pbb?.j2 !== undefined ? (
                                        <span className="text-slate-500 text-[10px]"> (J1:{team.scoreData.pbb.j1} J2:{team.scoreData.pbb.j2})</span>
                                      ) : ''}
                                      {' • '}Danton: <span className="text-white font-bold">{team.scoreData.danton?.total ?? 0}</span>
                                      {team.scoreData.penalties?.totalPenalty > 0 && (
                                        <span className="text-rose-400 font-bold"> • Penalti: -{team.scoreData.penalties.totalPenalty}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-mono font-black text-xl text-yellow-400 block">
                                    {team.finalScore}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">Poin</span>
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

        {/* Modal Berita Acara Rekap Nilai Resmi (Print-Ready) */}
        <OfficialScoreRecapModal
          isOpen={isRecapModalOpen}
          onClose={() => setIsRecapModalOpen(false)}
        />

      </div>
    </div>
  );
}
