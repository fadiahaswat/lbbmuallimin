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
  ArrowLeft
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import {
  MATERIALS,
  SCORING,
  PENALTIES,
  JURY_POSTS,
  RUBRIC_SCALE_TEMPLATES,
  DANTON_CRITERIA,
  getScaleTemplateForMaterial
} from '../../config.js';
import OfficialScoreRecapModal from './OfficialScoreRecapModal.jsx';

// Helper membuat initial rubrik state untuk materi tertentu
function getInitialRubricScores(materialsList) {
  const initial = {};
  materialsList.forEach((m, idx) => {
    const templateKey = getScaleTemplateForMaterial(m);
    const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
    // Default pilih opsi nilai predikat 'B' (Baik) pertama
    const defaultOption = template.find(t => t.grade === 'B') || template[Math.floor(template.length / 2)];
    initial[idx] = defaultOption.val;
  });
  return initial;
}

// Helper initial danton rubrik
function getInitialDantonRubric() {
  const initial = {};
  DANTON_CRITERIA.forEach(c => {
    initial[c.id] = c.defaultScore;
  });
  return initial;
}

export default function JuryScoringApp() {
  const { teams, scores, saveScore, saveJuryPostScore, setActiveView, openModal } = useCompetition();

  const [activeTab, setActiveTab] = useState('scoring'); // 'scoring' | 'leaderboard'
  const [activeJuryPost, setActiveJuryPost] = useState('all'); // 'all' | 'pos1' | 'pos2' | 'pos3'
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

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

  // Rubrik PBB Juri 1 (Key: index materi -> value: angka terpilih)
  const [pbb1RubricScores, setPbb1RubricScores] = useState(() => getInitialRubricScores(materialsList));

  // Rubrik PBB Juri 2 (Key: index materi -> value: angka terpilih)
  const [pbb2RubricScores, setPbb2RubricScores] = useState(() => getInitialRubricScores(materialsList));

  // Rubrik Danton Juri 3 (Key: danton criteria id -> value: angka terpilih)
  const [dantonRubricScores, setDantonRubricScores] = useState(getInitialDantonRubric);

  // Penalties
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

      // Load rubrik PBB Juri 2
      if (juries.pos2?.rubricScores) {
        setPbb2RubricScores(juries.pos2.rubricScores);
      } else {
        setPbb2RubricScores(getInitialRubricScores(mList));
      }

      // Load rubrik Danton Juri 3
      if (juries.pos3?.rubricScores) {
        setDantonRubricScores(juries.pos3.rubricScores);
      } else if (score.danton?.rubricScores) {
        setDantonRubricScores(score.danton.rubricScores);
      } else if (score.danton) {
        setDantonRubricScores({
          sikap: score.danton.sikap || 16,
          penguasaanMateri: score.danton.penguasaanMateri || score.danton.penguasaan || 16,
          penguasaanLapangan: score.danton.penguasaanLapangan || score.danton.lapangan || 16,
          ikit: score.danton.ikit || 26,
          volumeSuara: score.danton.volumeSuara || score.danton.vokal || 16,
        });
      } else {
        setDantonRubricScores(getInitialDantonRubric());
      }

      setPenalties(score.penalties || { upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes(score.notes || '');
    } else {
      setPbb1RubricScores(getInitialRubricScores(mList));
      setPbb2RubricScores(getInitialRubricScores(mList));
      setDantonRubricScores(getInitialDantonRubric());
      setPenalties({ upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes('');
    }
  }

  // Hitung total skor PBB Juri 1
  const pbb1Total = useMemo(() => {
    return Object.values(pbb1RubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [pbb1RubricScores]);

  // Hitung total skor PBB Juri 2
  const pbb2Total = useMemo(() => {
    return Object.values(pbb2RubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [pbb2RubricScores]);

  // Rata-rata PBB (Juri 1 & Juri 2)
  const pbbAverage = useMemo(() => {
    if (activeJuryPost === 'pos1') return pbb1Total;
    if (activeJuryPost === 'pos2') return pbb2Total;
    return parseFloat(((pbb1Total + pbb2Total) / 2).toFixed(2));
  }, [pbb1Total, pbb2Total, activeJuryPost]);

  // Hitung total skor Danton Juri 3 dari rubrik kriteria
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

  // Skor berjalan sesuai view aktif
  const totalCalculatedScore = useMemo(() => {
    if (activeJuryPost === 'pos1') return Math.max(0, pbb1Total - penaltyDeduction);
    if (activeJuryPost === 'pos2') return Math.max(0, pbb2Total - penaltyDeduction);
    if (activeJuryPost === 'pos3') return Math.max(0, dantonTotal - penaltyDeduction);
    // All (Full Overview): Rata-rata PBB + Danton - Penalti
    return parseFloat(Math.max(0, pbbAverage + dantonTotal - penaltyDeduction).toFixed(2));
  }, [activeJuryPost, pbb1Total, pbb2Total, pbbAverage, dantonTotal, penaltyDeduction]);

  function handleSaveScore(e) {
    e.preventDefault();
    if (!selectedTeam) return;

    const dantonPayload = {
      ...dantonRubricScores,
      rubricScores: dantonRubricScores,
      total: dantonTotal,
    };

    const pbb1Payload = {
      rubricScores: pbb1RubricScores,
      total: pbb1Total,
    };

    const pbb2Payload = {
      rubricScores: pbb2RubricScores,
      total: pbb2Total,
    };

    if (activeJuryPost !== 'all') {
      let postPayload = {
        juryName: JURY_POSTS[activeJuryPost]?.defaultName || juryName,
        juryRole: JURY_POSTS[activeJuryPost]?.title || juryRole,
        penalties: { ...penalties, totalPenalty: penaltyDeduction },
        notes: juryNotes,
      };

      if (activeJuryPost === 'pos1') {
        postPayload = { ...postPayload, ...pbb1Payload };
      } else if (activeJuryPost === 'pos2') {
        postPayload = { ...postPayload, ...pbb2Payload };
      } else if (activeJuryPost === 'pos3') {
        postPayload = { ...postPayload, ...dantonPayload };
      }

      saveJuryPostScore(selectedTeam.id, activeJuryPost, postPayload);
    } else {
      // Simpan semua juri
      const mergedJuries = {
        ...(existingScore?.juries || {}),
        pos1: {
          juryName: JURY_POSTS.pos1.defaultName,
          juryRole: JURY_POSTS.pos1.title,
          ...pbb1Payload,
        },
        pos2: {
          juryName: JURY_POSTS.pos2.defaultName,
          juryRole: JURY_POSTS.pos2.title,
          ...pbb2Payload,
        },
        pos3: {
          juryName: JURY_POSTS.pos3.defaultName,
          juryRole: JURY_POSTS.pos3.title,
          ...dantonPayload,
        },
      };

      saveScore(selectedTeam.id, {
        juryName,
        juryRole,
        juries: mergedJuries,
        danton: dantonPayload,
        pbb: {
          rubricScores: pbb1RubricScores,
          total: pbbAverage,
        },
        penalties: { ...penalties, totalPenalty: penaltyDeduction },
        notes: juryNotes,
      });
    }

    setSaveSuccessMsg(`Nilai untuk ${selectedTeam.schoolName} (${selectedTeam.jenjang}) berhasil disimpan!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  }

  // Teams eligible for scoring (status verified or drawn)
  const verifiedTeams = teams
    .filter(t => t.status === 'verified' || t.status === 'drawn')
    .sort((a, b) => (a.lotNumber || 999) - (b.lotNumber || 999));

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Aplikasi Penilaian Digital
                </span>
                <span className="text-xs text-slate-400">Dewan Juri LBB Mu'allimin 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-0.5">
                E-Scoring & Rekapitulasi Nilai
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Berita Acara Resmi (PDF)</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'scoring' ? 'leaderboard' : 'scoring')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>{activeTab === 'scoring' ? 'Lihat Klasemen Juara' : 'Input Nilai Juri'}</span>
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Beranda
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-2 py-1.5 shadow-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('scoring')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'scoring' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Formulir Penilaian Peleton</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Rekapitulasi Nilai & Papan Juara</span>
          </button>
        </div>

        {/* Pos Juri Selector Bar (1 Pos Terpadu, 3 Dewan Juri) */}
        {activeTab === 'scoring' && (
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Dewan Juri:</span>
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('all');
                    setJuryName('Dewan Juri Utama LBB');
                    setJuryRole('Dewan Juri Utama');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeJuryPost === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Juri (Full)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('pos1');
                    setJuryName(JURY_POSTS.pos1.defaultName);
                    setJuryRole(JURY_POSTS.pos1.title);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeJuryPost === 'pos1'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Juri 1: PBB Pasukan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('pos2');
                    setJuryName(JURY_POSTS.pos2.defaultName);
                    setJuryRole(JURY_POSTS.pos2.title);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeJuryPost === 'pos2'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Juri 2: PBB Pasukan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('pos3');
                    setJuryName(JURY_POSTS.pos3.defaultName);
                    setJuryRole(JURY_POSTS.pos3.title);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeJuryPost === 'pos3'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Juri 3: Komandan (Danton)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Offline-First (Tersimpan Lokal)</span>
            </div>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* TAB 1: FORMULIR PENILAIAN */}
        {activeTab === 'scoring' && (
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left 4 Cols: Platoon Selector List */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  Daftar Tampil Peleton
                </span>
                <h4 className="font-black text-base text-slate-900 uppercase">
                  Pilih Peleton yang Dinilai
                </h4>
              </div>

              <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
                {verifiedTeams.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    Belum ada tim yang berstatus terverifikasi.
                  </p>
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
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-2 ring-emerald-200'
                            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-yellow-400'
                          }`}>
                            {team.lotNumber ? `#${String(team.lotNumber).padStart(2, '0')}` : team.jenjang}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{team.schoolName}</span>
                            <span className="text-[10px] text-slate-500">
                              {team.jenjang} • Danton: {team.roster?.danton?.name || team.dantonName || '-'}
                            </span>
                            
                            {/* Live Juri Indicators (J1, J2, J3) */}
                            <div className="flex items-center gap-1 mt-1">
                              <span
                                title="Juri 1: PBB Pasukan"
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                                  hasJuri1 ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                J1 (PBB): {hasJuri1 ? '✓' : '...'}
                              </span>
                              <span
                                title="Juri 2: PBB Pasukan"
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                                  hasJuri2 ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                J2 (PBB): {hasJuri2 ? '✓' : '...'}
                              </span>
                              <span
                                title="Juri 3: Komandan (Danton)"
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                                  hasJuri3 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                J3 (Danton): {hasJuri3 ? '✓' : '...'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {isComplete ? (
                            <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded block">
                              {teamScore?.finalScore ?? 0} pt
                            </span>
                          ) : hasAny ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded block">
                              Parsial
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded block">
                              Belum Dinilai
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
                <form onSubmit={handleSaveScore} className="space-y-6">
                  
                  {/* Active Platoon Card */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-yellow-400 bg-yellow-400/15 px-2 py-0.5 rounded">
                          {selectedTeam.regCode}
                        </span>
                        <span className="text-xs text-slate-300 font-bold">
                          Nomor Tampil: #{selectedTeam.lotNumber || '-'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">({selectedTeam.jenjang})</span>
                      </div>
                      <h3 className="font-black text-xl text-white uppercase italic">{selectedTeam.schoolName}</h3>
                      <p className="text-xs text-slate-300">
                        {selectedTeam.platoonName} • Komandan Peleton: <strong className="text-yellow-400">{selectedTeam.roster?.danton?.name || selectedTeam.dantonName || '-'}</strong>
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-400">
                        <span>J1 PBB: <strong className="text-blue-400">{pbb1Total}</strong></span>
                        <span>•</span>
                        <span>J2 PBB: <strong className="text-indigo-400">{pbb2Total}</strong></span>
                        <span>•</span>
                        <span>Rata-rata PBB: <strong className="text-emerald-400">{pbbAverage}</strong></span>
                        <span>•</span>
                        <span>J3 Danton: <strong className="text-red-400">{dantonTotal}</strong></span>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {activeJuryPost === 'all' ? 'Total Nilai Berjalan (Rata-rata PBB + Danton - Penalti)' : 'Nilai Juri Berjalan'}
                      </span>
                      <span className="text-3xl font-black text-yellow-400 font-mono">
                        {totalCalculatedScore} <span className="text-xs text-white font-normal">Poin</span>
                      </span>
                    </div>
                  </div>

                  {/* JURI 1: Penilaian Gerakan Materi PBB Pasukan */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos1') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                              Dewan Juri 1 • PBB Pasukan
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              Materi Resmi ({selectedTeam.jenjang}) • {materialsList.length} Gerakan
                            </span>
                          </div>
                          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
                            A - D. Penilaian Gerakan Materi PBB Pasukan (Juri 1)
                          </h4>
                        </div>
                        <div className="text-right bg-blue-50/80 border border-blue-200 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-blue-600 font-bold uppercase block">Subtotal Juri 1 (PBB)</span>
                          <span className="font-mono font-black text-xl text-blue-700">{pbb1Total} <span className="text-xs font-normal text-slate-500">Poin</span></span>
                        </div>
                      </div>

                      {/* Petunjuk Coret Nilai */}
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Skala Predikat:</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">K (Kurang)</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">C (Cukup)</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">B (Baik)</span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">BS (Baik Sekali)</span>
                        </div>
                        <span className="text-slate-400 italic">Tap angka untuk memberi nilai gerakan Juri 1</span>
                      </div>

                      {/* Tabel Checklist Materi Gerakan PBB Juri 1 */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[480px] overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="sticky top-0 z-10 bg-slate-900 text-white font-bold text-[11px] uppercase">
                            <tr>
                              <th className="py-2.5 px-3 w-10 text-center">No</th>
                              <th className="py-2.5 px-3">Materi Gerakan Lomba</th>
                              <th className="py-2.5 px-3 text-center w-72">Rentang Nilai (K - C - B - BS)</th>
                              <th className="py-2.5 px-3 text-center w-16">Skor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {materialsList.map((materiText, idx) => {
                              const templateKey = getScaleTemplateForMaterial(materiText);
                              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
                              const selectedVal = pbb1RubricScores[idx];

                              return (
                                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                                  <td className="py-2 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                  <td className="py-2 px-3 font-semibold text-slate-800">
                                    <div>{materiText}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">
                                      Kategori: {templateKey.replace('_', ' ')}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex items-center justify-center gap-1 flex-wrap">
                                      {template.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            onClick={() => setPbb1RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                              isChosen
                                                ? 'bg-blue-700 text-white shadow-md ring-2 ring-blue-300 scale-105'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                                            }`}
                                            title={`Predikat: ${opt.grade} (${opt.val})`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-center font-mono font-black text-sm text-blue-700 bg-blue-50/30">
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

                  {/* JURI 2: Penilaian Gerakan Materi PBB Pasukan */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos2') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                              Dewan Juri 2 • PBB Pasukan
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              Materi Resmi ({selectedTeam.jenjang}) • {materialsList.length} Gerakan
                            </span>
                          </div>
                          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
                            A - D. Penilaian Gerakan Materi PBB Pasukan (Juri 2)
                          </h4>
                        </div>
                        <div className="text-right bg-indigo-50/80 border border-indigo-200 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-indigo-600 font-bold uppercase block">Subtotal Juri 2 (PBB)</span>
                          <span className="font-mono font-black text-xl text-indigo-700">{pbb2Total} <span className="text-xs font-normal text-slate-500">Poin</span></span>
                        </div>
                      </div>

                      {/* Petunjuk Coret Nilai Juri 2 */}
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Skala Predikat:</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">K (Kurang)</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">C (Cukup)</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">B (Baik)</span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">BS (Baik Sekali)</span>
                        </div>
                        <span className="text-slate-400 italic">Tap angka untuk memberi nilai gerakan Juri 2</span>
                      </div>

                      {/* Tabel Checklist Materi Gerakan PBB Juri 2 */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[480px] overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="sticky top-0 z-10 bg-slate-900 text-white font-bold text-[11px] uppercase">
                            <tr>
                              <th className="py-2.5 px-3 w-10 text-center">No</th>
                              <th className="py-2.5 px-3">Materi Gerakan Lomba</th>
                              <th className="py-2.5 px-3 text-center w-72">Rentang Nilai (K - C - B - BS)</th>
                              <th className="py-2.5 px-3 text-center w-16">Skor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {materialsList.map((materiText, idx) => {
                              const templateKey = getScaleTemplateForMaterial(materiText);
                              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
                              const selectedVal = pbb2RubricScores[idx];

                              return (
                                <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                                  <td className="py-2 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                  <td className="py-2 px-3 font-semibold text-slate-800">
                                    <div>{materiText}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">
                                      Kategori: {templateKey.replace('_', ' ')}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex items-center justify-center gap-1 flex-wrap">
                                      {template.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            onClick={() => setPbb2RubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                                            className={`min-w-8 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                              isChosen
                                                ? 'bg-indigo-700 text-white shadow-md ring-2 ring-indigo-300 scale-105'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                                            }`}
                                            title={`Predikat: ${opt.grade} (${opt.val})`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-center font-mono font-black text-sm text-indigo-700 bg-indigo-50/30">
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

                  {/* JURI 3: Penilaian Komandan Peleton (Danton) */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos3') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-red-700 tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                              Dewan Juri 3 • Komandan Peleton
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">Standar Rubrik K / C / B / BS</span>
                          </div>
                          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
                            E. Penilaian Komandan Pasukan (Danton)
                          </h4>
                        </div>
                        <div className="text-right bg-red-50/80 border border-red-200 px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-[10px] text-red-600 font-bold uppercase block">Subtotal Danton (Juri 3)</span>
                          <span className="font-mono font-black text-xl text-red-700">{dantonTotal} <span className="text-xs font-normal text-slate-500">Poin</span></span>
                        </div>
                      </div>

                      {/* Tabel Checklist Danton Juri 3 */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase">
                              <th className="py-2.5 px-3 w-8 text-center">No</th>
                              <th className="py-2.5 px-3">Kriteria Penilaian Danton</th>
                              <th className="py-2.5 px-3 text-center w-72">Pilihan Nilai (Coret / Klik Nilai)</th>
                              <th className="py-2.5 px-3 text-center w-16">Skor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {DANTON_CRITERIA.map((crit, idx) => {
                              const template = RUBRIC_SCALE_TEMPLATES[crit.template] || RUBRIC_SCALE_TEMPLATES.DANTON_UMUM;
                              const selectedVal = dantonRubricScores[crit.id];

                              return (
                                <tr key={crit.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-800">{crit.name}</td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center justify-center gap-1 flex-wrap">
                                      {template.map((opt, oIdx) => {
                                        const isChosen = selectedVal === opt.val;
                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                                            className={`min-w-8 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                              isChosen
                                                ? 'bg-red-700 text-white shadow-md ring-2 ring-red-300 scale-105'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                                            }`}
                                            title={`Predikat: ${opt.grade} (${opt.val})`}
                                          >
                                            {opt.val}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-red-700 bg-red-50/30">
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

                  {/* 3. Pengurangan Nilai (Penalties / Sanksi) */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">
                          Sanksi & Pelanggaran
                        </span>
                        <h4 className="font-black text-base text-slate-900 uppercase">
                          Kalkulator Pengurangan Nilai (Penalti)
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block">Total Pengurangan</span>
                        <span className="font-mono font-black text-base text-rose-700">-{penaltyDeduction} Poin</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {/* Injak Garis */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">Injak Garis / Batas</span>
                          <span className="text-[10px] font-bold text-rose-700">-50 / kejadian</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, injakGarisCount: Math.max(0, p.injakGarisCount - 1) }))}
                            className="w-7 h-7 bg-slate-200 rounded font-black"
                          >-</button>
                          <span className="font-mono font-bold text-sm w-8 text-center">{penalties.injakGarisCount}</span>
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, injakGarisCount: p.injakGarisCount + 1 }))}
                            className="w-7 h-7 bg-red-700 text-white rounded font-black"
                          >+</button>
                        </div>
                      </div>

                      {/* Kelebihan Waktu */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">Kelebihan Waktu</span>
                          <span className="text-[10px] font-bold text-rose-700">-50 / 30 detik</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: Math.max(0, p.overTimeBlocks - 1) }))}
                            className="w-7 h-7 bg-slate-200 rounded font-black"
                          >-</button>
                          <span className="font-mono font-bold text-sm w-8 text-center">{penalties.overTimeBlocks}</span>
                          <button
                            type="button"
                            onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: p.overTimeBlocks + 1 }))}
                            className="w-7 h-7 bg-red-700 text-white rounded font-black"
                          >+</button>
                        </div>
                      </div>

                      {/* Personel Kurang */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-slate-800 block">Personel Kurang (&lt; 22)</span>
                          <span className="text-[10px] text-rose-700 font-bold">-75 Poin</span>
                        </div>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={penalties.personelKurang}
                            onChange={e => setPenalties({ ...penalties, personelKurang: e.target.checked })}
                            className="w-4 h-4 text-red-700 rounded"
                          />
                          <span className="text-[11px] font-bold text-slate-600">Pelanggaran</span>
                        </label>
                      </div>

                      {/* Terlambat DP 1 */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-slate-800 block">Tidak Hadir DP 1 (3x Panggilan)</span>
                          <span className="text-[10px] text-rose-700 font-bold">-100 Poin</span>
                        </div>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={penalties.dp1}
                            onChange={e => setPenalties({ ...penalties, dp1: e.target.checked })}
                            className="w-4 h-4 text-red-700 rounded"
                          />
                          <span className="text-[11px] font-bold text-slate-600">Pelanggaran</span>
                        </label>
                      </div>

                      {/* Tidak Ikut Upacara */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between sm:col-span-2">
                        <div>
                          <span className="font-bold text-slate-800 block">Tidak Ikut Upacara Pembukaan</span>
                          <span className="text-[10px] text-rose-700 font-bold">-150 Poin</span>
                        </div>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={penalties.upacara}
                            onChange={e => setPenalties({ ...penalties, upacara: e.target.checked })}
                            className="w-4 h-4 text-red-700 rounded"
                          />
                          <span className="text-[11px] font-bold text-slate-600">Tidak Mengikuti Upacara</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. Catatan & Tanda Tangan Juri */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <h4 className="font-black text-base text-slate-900 uppercase">
                      Catatan Evaluasi & Pengesahan Juri
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Dewan Juri</label>
                        <input
                          type="text"
                          required
                          value={juryName}
                          onChange={e => setJuryName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Jabatan / Instansi Juri</label>
                        <input
                          type="text"
                          value={juryRole}
                          onChange={e => setJuryRole(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Catatan Khusus Penampilan</label>
                      <textarea
                        rows={2}
                        value={juryNotes}
                        onChange={e => setJuryNotes(e.target.value)}
                        placeholder="Contoh: Artikulasi danton sangat lantang, kerapian saf 2 terjaga baik..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/30 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan & Kunci Nilai Peleton</span>
                      </button>
                    </div>
                  </div>

                </form>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                  <p className="text-slate-400">Pilih salah satu peleton di sisi kiri untuk memulai penilaian.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LIVE LEADERBOARD & REKAP JUARA */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-black text-xl text-slate-900 uppercase italic">
                    Rekapitulasi Nilai & Klasemen Dewan Juri
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Urutan peringkat resmi berdasarkan akumulasi nilai Danton dan PBB setelah pengurangan penalti.
                  </p>
                </div>

                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
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
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-lg text-slate-900 uppercase">
                          Klasemen Tingkat {jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}
                        </h4>
                        <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {rankedTeams.length} Tim Dinilai
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {rankedTeams.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-6 text-center">
                            Belum ada tim {jenjang} yang selesai dinilai juri.
                          </p>
                        ) : (
                          rankedTeams.map((team, idx) => {
                            const isPodium = idx < 3;
                            return (
                              <div
                                key={team.id}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                  idx === 0
                                    ? 'bg-amber-50 border-amber-300 shadow-sm'
                                    : idx === 1
                                    ? 'bg-slate-100/90 border-slate-300'
                                    : idx === 2
                                    ? 'bg-orange-50/60 border-orange-200'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                                    idx === 0 ? 'bg-yellow-400 text-slate-950 font-black' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-black text-slate-900 text-xs">{team.schoolName}</span>
                                      {idx === 0 && (
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded">
                                          Juara 1
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-500">
                                      PBB (Rata-rata): {team.scoreData.pbb?.total ?? 0} {team.scoreData.pbb?.j1 !== undefined && team.scoreData.pbb?.j2 !== undefined ? `[J1: ${team.scoreData.pbb.j1} | J2: ${team.scoreData.pbb.j2}]` : ''} • Danton: {team.scoreData.danton?.total ?? 0} • Penalti: -{team.scoreData.penalties?.totalPenalty ?? 0}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-mono font-black text-lg text-slate-900 block">
                                    {team.finalScore}
                                  </span>
                                  <span className="text-[10px] text-slate-400">Total Poin</span>
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
