import React, { useState } from 'react';
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
import { MATERIALS, SCORING, PENALTIES, JURY_POSTS } from '../../config.js';
import OfficialScoreRecapModal from './OfficialScoreRecapModal.jsx';

export default function JuryScoringApp() {
  const { teams, scores, saveScore, saveJuryPostScore, setActiveView, openModal } = useCompetition();

  const [activeTab, setActiveTab] = useState('scoring'); // 'scoring' | 'leaderboard'
  const [activeJuryPost, setActiveJuryPost] = useState('all'); // 'all' | 'pos1' | 'pos2' | 'pos3'
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    // Default to first verified team
    const first = teams.find(t => t.status === 'verified');
    return first ? first.id : (teams[0]?.id || '');
  });

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;
  const existingScore = selectedTeam ? scores[selectedTeam.id] : null;

  // Jury Form State
  const [juryName, setJuryName] = useState('Mayor (Mar) Bambang S., S.E.');
  const [juryRole, setJuryRole] = useState('Dewan Juri Utama (TNI/Polri)');

  // Pos 3: Danton (range 50-90, interval 2)
  const [dantonScores, setDantonScores] = useState({
    penguasaan: 86,
    vokal: 84,
    sikap: 86,
    lapangan: 84,
  });

  // Pos 1: PBB (Teknik 70%, Kekompakan 30%)
  const [pbbScores, setPbbScores] = useState({
    teknik: 86,
    kekompakan: 84,
  });

  // Pos 2: Variasi, Formasi & Kostum (Kreativitas 40%, Keindahan 35%, Kostum 25%)
  const [vaforScores, setVaforScores] = useState({
    kreativitas: 85,
    keindahan: 84,
    kostum: 86,
  });

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

  // Load existing scores when selecting a team
  function handleSelectTeam(teamId) {
    setSelectedTeamId(teamId);
    const score = scores[teamId];
    if (score) {
      setJuryName(score.juryName || JURY_POSTS[activeJuryPost]?.defaultName || 'Dewan Juri LBB');
      setJuryRole(score.juryRole || JURY_POSTS[activeJuryPost]?.title || 'Dewan Juri');
      setDantonScores(score.danton || { penguasaan: 86, vokal: 84, sikap: 86, lapangan: 84 });
      setPbbScores(score.pbb || { teknik: 86, kekompakan: 84 });
      setVaforScores(score.vafor || { kreativitas: 85, keindahan: 84, kostum: 86 });
      setPenalties(score.penalties || { upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes(score.notes || '');
    } else {
      // Default standard values
      setDantonScores({ penguasaan: 84, vokal: 84, sikap: 84, lapangan: 84 });
      setPbbScores({ teknik: 84, kekompakan: 84 });
      setVaforScores({ kreativitas: 84, keindahan: 84, kostum: 84 });
      setPenalties({ upacara: false, dp1: false, personelKurang: false, overTimeBlocks: 0, injakGarisCount: 0, penyesuaianCount: 0 });
      setJuryNotes('');
    }
  }

  // Calculations
  const dantonTotal = parseFloat(
    (
      dantonScores.penguasaan * 0.35 +
      dantonScores.vokal * 0.25 +
      dantonScores.sikap * 0.20 +
      dantonScores.lapangan * 0.20
    ).toFixed(2)
  );

  const pbbTotal = parseFloat(
    (pbbScores.teknik * 0.70 + pbbScores.kekompakan * 0.30).toFixed(2)
  );

  const vaforTotal = parseFloat(
    (
      vaforScores.kreativitas * 0.40 +
      vaforScores.keindahan * 0.35 +
      vaforScores.kostum * 0.25
    ).toFixed(2)
  );

  let penaltyDeduction = 0;
  if (penalties.upacara) penaltyDeduction += 150;
  if (penalties.dp1) penaltyDeduction += 100;
  if (penalties.personelKurang) penaltyDeduction += 75;
  penaltyDeduction += (penalties.overTimeBlocks || 0) * 50;
  penaltyDeduction += (penalties.injakGarisCount || 0) * 50;
  if ((penalties.penyesuaianCount || 0) > 3) penaltyDeduction += 25;

  const totalCalculatedScore = parseFloat(
    Math.max(0, dantonTotal + pbbTotal + vaforTotal - penaltyDeduction).toFixed(2)
  );

  function handleSaveScore(e) {
    e.preventDefault();
    if (!selectedTeam) return;

    if (activeJuryPost !== 'all') {
      let postPayload = {
        juryName: JURY_POSTS[activeJuryPost]?.defaultName || juryName,
        juryRole: JURY_POSTS[activeJuryPost]?.title || juryRole,
        penalties: { ...penalties, totalPenalty: penaltyDeduction },
        notes: juryNotes,
      };

      if (activeJuryPost === 'pos1') {
        postPayload = { ...postPayload, ...pbbScores, total: pbbTotal };
      } else if (activeJuryPost === 'pos2') {
        postPayload = { ...postPayload, ...vaforScores, total: vaforTotal };
      } else if (activeJuryPost === 'pos3') {
        postPayload = { ...postPayload, ...dantonScores, total: dantonTotal };
      }

      saveJuryPostScore(selectedTeam.id, activeJuryPost, postPayload);
    } else {
      saveScore(selectedTeam.id, {
        juryName,
        juryRole,
        danton: { ...dantonScores, total: dantonTotal },
        pbb: { ...pbbScores, total: pbbTotal },
        vafor: { ...vaforScores, total: vaforTotal },
        penalties: { ...penalties, totalPenalty: penaltyDeduction },
        notes: juryNotes,
      });
    }

    setSaveSuccessMsg(`Nilai untuk ${selectedTeam.schoolName} berhasil disimpan & disinkronkan ke Rekapitulasi!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  }

  // Verified teams
  const verifiedTeams = teams.filter(t => t.status === 'verified');
  const materialsList = selectedTeam && selectedTeam.jenjang === 'SD' ? MATERIALS.SD : MATERIALS.SMP;

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

        {/* Pos Juri Selector Bar (Fase 1: Multi-Jury Engine) */}
        {activeTab === 'scoring' && (
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Pos Juri:</span>
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveJuryPost('all');
                    setJuryName('Mayor (Mar) Bambang S., S.E.');
                    setJuryRole('Dewan Juri Utama');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeJuryPost === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Pos (Full)
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
                  Pos 1: PBB Dasar
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
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pos 2: Vafor & Kostum
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
                  Pos 3: Komandan (Danton)
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
                    const hasScore = !!scores[team.id];
                    return (
                      <div
                        key={team.id}
                        onClick={() => handleSelectTeam(team.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
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
                              {team.jenjang} • Danton: {team.roster.danton.name}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {hasScore ? (
                            <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded block">
                              {scores[team.id].finalScore} pt
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
                        {selectedTeam.platoonName} • Komandan Peleton: <strong className="text-yellow-400">{selectedTeam.roster.danton.name}</strong>
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Nilai Berjalan</span>
                      <span className="text-3xl font-black text-yellow-400 font-mono">
                        {totalCalculatedScore} <span className="text-xs text-white font-normal">Poin</span>
                      </span>
                    </div>
                  </div>

                  {/* Pos 3: Penilaian Danton (Bobot: 35%, 25%, 20%, 20%) */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos3') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-red-700 tracking-wider block">
                            Pos 3 • Wewenang Juri Danton
                          </span>
                          <h4 className="font-black text-base text-slate-900 uppercase">
                            Penilaian Komandan Peleton (Danton)
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase block">Subtotal Danton</span>
                          <span className="font-mono font-black text-base text-red-700">{dantonTotal}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Penguasaan Materi (35%) */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-800">Penguasaan Materi (35%)</label>
                            <span className="font-mono font-black text-sm text-red-700">{dantonScores.penguasaan}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={dantonScores.penguasaan}
                            onChange={e => setDantonScores({ ...dantonScores, penguasaan: parseInt(e.target.value, 10) })}
                            className="w-full accent-red-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>

                        {/* Vokal / Aba-aba (25%) */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-800">Vokal & Kejelasan Aba-aba (25%)</label>
                            <span className="font-mono font-black text-sm text-red-700">{dantonScores.vokal}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={dantonScores.vokal}
                            onChange={e => setDantonScores({ ...dantonScores, vokal: parseInt(e.target.value, 10) })}
                            className="w-full accent-red-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>

                        {/* Sikap Tampang (20%) */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-800">Sikap Tampang & Kerapian (20%)</label>
                            <span className="font-mono font-black text-sm text-red-700">{dantonScores.sikap}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={dantonScores.sikap}
                            onChange={e => setDantonScores({ ...dantonScores, sikap: parseInt(e.target.value, 10) })}
                            className="w-full accent-red-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>

                        {/* Penguasaan Lapangan (20%) */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-800">Penguasaan & Penempatan Lapangan (20%)</label>
                            <span className="font-mono font-black text-sm text-red-700">{dantonScores.lapangan}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={dantonScores.lapangan}
                            onChange={e => setDantonScores({ ...dantonScores, lapangan: parseInt(e.target.value, 10) })}
                            className="w-full accent-red-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pos 1: Penilaian Gerakan PBB Pasukan (Teknik 70%, Kekompakan 30%) */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos1') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block">
                            Pos 1 • Wewenang Juri PBB
                          </span>
                          <h4 className="font-black text-base text-slate-900 uppercase">
                            Penilaian Gerakan PBB Pasukan
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase block">Subtotal PBB</span>
                          <span className="font-mono font-black text-base text-blue-700">{pbbTotal}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Teknik Gerakan (70%) */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <label className="text-xs font-bold text-slate-800 block">Teknik Gerakan (70%)</label>
                              <span className="text-[10px] text-slate-500">Kesesuaian dengan PBB TNI/Polri</span>
                            </div>
                            <span className="font-mono font-black text-base text-blue-700">{pbbScores.teknik}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={pbbScores.teknik}
                            onChange={e => setPbbScores({ ...pbbScores, teknik: parseInt(e.target.value, 10) })}
                            className="w-full accent-blue-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>

                        {/* Kekompakan (30%) */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <label className="text-xs font-bold text-slate-800 block">Kekompakan & Keselarasan (30%)</label>
                              <span className="text-[10px] text-slate-500">Irama langkah & keseragaman</span>
                            </div>
                            <span className="font-mono font-black text-base text-blue-700">{pbbScores.kekompakan}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={pbbScores.kekompakan}
                            onChange={e => setPbbScores({ ...pbbScores, kekompakan: parseInt(e.target.value, 10) })}
                            className="w-full accent-blue-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>
                      </div>

                      {/* Materi Gerakan List Accordion */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <span className="text-xs font-bold uppercase text-slate-700 block mb-2">
                          Daftar Materi Gerakan Wajib ({selectedTeam.jenjang} - {materialsList.length} Gerakan):
                        </span>
                        <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                          {materialsList.map((m, idx) => (
                            <div key={idx} className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                              <span><strong>#{idx + 1}.</strong> {m}</span>
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Terekam</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pos 2: Penilaian Variasi, Formasi & Kerapian (Fase 1: Multi-Jury) */}
                  {(activeJuryPost === 'all' || activeJuryPost === 'pos2') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">
                            Pos 2 • Wewenang Juri Variasi, Formasi & Kostum
                          </span>
                          <h4 className="font-black text-base text-slate-900 uppercase">
                            Penilaian Variasi, Formasi & Seragam
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase block">Subtotal Vafor</span>
                          <span className="font-mono font-black text-base text-purple-700">{vaforTotal}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        {/* Kreativitas & Tingkat Kesulitan (40%) */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <label className="text-xs font-bold text-slate-800 block">Kreativitas (40%)</label>
                              <span className="text-[10px] text-slate-500">Tingkat kesulitan & orisinalitas</span>
                            </div>
                            <span className="font-mono font-black text-base text-purple-700">{vaforScores.kreativitas}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={vaforScores.kreativitas}
                            onChange={e => setVaforScores({ ...vaforScores, kreativitas: parseInt(e.target.value, 10) })}
                            className="w-full accent-purple-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>

                        {/* Keindahan Formasi (35%) */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <label className="text-xs font-bold text-slate-800 block">Keindahan Formasi (35%)</label>
                              <span className="text-[10px] text-slate-500">Transisi bentuk & estetika</span>
                            </div>
                            <span className="font-mono font-black text-base text-purple-700">{vaforScores.keindahan}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={vaforScores.keindahan}
                            onChange={e => setVaforScores({ ...vaforScores, keindahan: parseInt(e.target.value, 10) })}
                            className="w-full accent-purple-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>

                        {/* Kerapian Kostum & Seragam (25%) */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <label className="text-xs font-bold text-slate-800 block">Kerapian Kostum (25%)</label>
                              <span className="text-[10px] text-slate-500">Atribut & keseragaman pakaian</span>
                            </div>
                            <span className="font-mono font-black text-base text-purple-700">{vaforScores.kostum}</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={90}
                            step={2}
                            value={vaforScores.kostum}
                            onChange={e => setVaforScores({ ...vaforScores, kostum: parseInt(e.target.value, 10) })}
                            className="w-full accent-purple-700"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>50</span><span>70</span><span>90</span>
                          </div>
                        </div>
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
                                      Danton: {team.scoreData.danton.total} • PBB: {team.scoreData.pbb.total} • Penalti: -{team.scoreData.penalties.totalPenalty}
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
