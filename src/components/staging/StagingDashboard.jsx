import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ClipboardCheck,
  DoorOpen,
  Users,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Timer,
  AlertTriangle,
  Sparkles,
  FileCheck2,
  Check,
  X
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { STAGING_CONFIG, COMPETITION, TIMELINE, VENUE } from '../../config.js';

export default function StagingDashboard() {
  const {
    teams,
    staging,
    updateTeamStaging,
    fieldTimer,
    startFieldTimer,
    pauseFieldTimer,
    resumeFieldTimer,
    resetFieldTimer,
    stopAndSaveFieldTimer,
    setActiveView
  } = useCompetition();

  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [activeChecklistTeamId, setActiveChecklistTeamId] = useState(null);

  // Filter verified teams
  const verifiedTeams = teams
    .filter(t => t.status === 'verified')
    .filter(t => selectedJenjang === 'ALL' || t.jenjang === selectedJenjang)
    .sort((a, b) => (a.lotNumber || 99) - (b.lotNumber || 99));

  // Active playing team in arena
  const activeArenaTeam = teams.find(t => t.id === fieldTimer.activeTeamId) ||
    teams.find(t => staging[t.id]?.stage === 'arena') || null;

  // Compute timer metrics
  const maxDuration = activeArenaTeam?.jenjang === 'SD'
    ? STAGING_CONFIG.DURATIONS.SD
    : STAGING_CONFIG.DURATIONS.SMP;

  const elapsed = fieldTimer.elapsedSeconds;
  const remaining = Math.max(0, maxDuration - elapsed);
  const isOvertime = elapsed > maxDuration;
  const overtimeSeconds = isOvertime ? elapsed - maxDuration : 0;
  const overtimeBlocks = isOvertime ? Math.ceil(overtimeSeconds / 30) : 0;
  const overtimePenalty = overtimeBlocks * STAGING_CONFIG.PENALTY_OVERTIME_PER_30_SEC;

  // Time format helper (MM:SS)
  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Count teams per stage
  const stageCounts = STAGING_CONFIG.STAGES.reduce((acc, st) => {
    acc[st.id] = verifiedTeams.filter(t => {
      const currentStage = staging[t.id]?.stage || 'waiting';
      return currentStage === st.id;
    }).length;
    return acc;
  }, {});

  // Progress Bar percentage
  const progressPct = Math.min(100, Math.round((elapsed / maxDuration) * 100));

  // Timer status theme
  let timerTheme = 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400';
  let progressColor = 'bg-emerald-500';
  if (isOvertime) {
    timerTheme = 'border-rose-500 bg-rose-950/60 text-rose-400 animate-pulse';
    progressColor = 'bg-rose-500';
  } else if (remaining <= STAGING_CONFIG.WARNING_TIMES.RED_REMAINING) {
    timerTheme = 'border-rose-500/60 bg-rose-950/40 text-rose-400';
    progressColor = 'bg-rose-500';
  } else if (remaining <= STAGING_CONFIG.WARNING_TIMES.YELLOW_REMAINING) {
    timerTheme = 'border-amber-500/60 bg-amber-950/40 text-amber-400';
    progressColor = 'bg-amber-500';
  }

  // Handle stage transition
  function handleMoveStage(team, nextStageId) {
    if (nextStageId === 'arena') {
      startFieldTimer(team.id);
    } else if (nextStageId === 'finished' && fieldTimer.activeTeamId === team.id) {
      stopAndSaveFieldTimer(team.id, team.jenjang);
    } else {
      updateTeamStaging(team.id, nextStageId);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Operasional Lapangan
                </span>
                <span className="text-xs text-slate-400">Hari-H Perlombaan • {TIMELINE.COMPETITION_DATE}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-0.5">
                Staging Area & Antrean Lapangan
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Kendali DP 1 (Absensi), DP 2 (Pemeriksaan), DP 3 (Pintu Masuk), dan Timer Kotak Lomba.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Jenjang */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setSelectedJenjang('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SMP' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                SMP/MTs
              </button>
              <button
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                SD/MI
              </button>
            </div>

            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Kembali ke Web
            </button>
          </div>
        </div>

        {/* Live Arena Stopwatch Bar */}
        <div className={`rounded-3xl p-6 border shadow-2xl transition-all ${timerTheme}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Active Team Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  KOTAK LOMBA SEDANG AKTIF
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Maksimal: {Math.floor(maxDuration / 60)} Menit ({activeArenaTeam?.jenjang || 'SMP'})
                </span>
              </div>

              {activeArenaTeam ? (
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-yellow-400 text-slate-950 font-mono font-black text-sm rounded-lg">
                      No. {activeArenaTeam.lotNumber ? String(activeArenaTeam.lotNumber).padStart(2, '0') : '--'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {activeArenaTeam.schoolName}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Peleton: <strong>{activeArenaTeam.platoonName}</strong> • Komandan: <strong>{activeArenaTeam.dantonName || 'Danton Utama'}</strong>
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-slate-400 italic">
                    Belum ada peleton yang sedang tampil di arena.
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih peleton dari DP 3 dan klik "Mulai Tampil (Masuk Arena)" di bawah.
                  </p>
                </div>
              )}
            </div>

            {/* Center: Big Digital Clock */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="font-mono font-black text-5xl sm:text-6xl tracking-tight drop-shadow-md text-white">
                {formatTime(elapsed)}
              </div>
              <div className="flex items-center gap-4 text-xs mt-2 font-mono">
                <span className="text-slate-300">
                  Sisa: <strong className="text-white">{formatTime(remaining)}</strong>
                </span>
                {isOvertime && (
                  <span className="text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-600 animate-bounce">
                    OVERTIME +{formatTime(overtimeSeconds)} (-{overtimePenalty} Poin)
                  </span>
                )}
              </div>
            </div>

            {/* Right: Stopwatch Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {!fieldTimer.isRunning ? (
                <button
                  disabled={!activeArenaTeam}
                  onClick={() => {
                    if (activeArenaTeam) {
                      if (fieldTimer.elapsedSeconds > 0) resumeFieldTimer();
                      else startFieldTimer(activeArenaTeam.id);
                    }
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{fieldTimer.elapsedSeconds > 0 ? 'Lanjutkan Timer' : 'Mulai Tampil'}</span>
                </button>
              ) : (
                <button
                  onClick={pauseFieldTimer}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Jeda Sementara</span>
                </button>
              )}

              <button
                disabled={!activeArenaTeam}
                onClick={() => {
                  if (activeArenaTeam && window.confirm(`Konfirmasi selesai tampil untuk ${activeArenaTeam.schoolName}? Waktu akhir ${formatTime(elapsed)} akan dikunci.`)) {
                    stopAndSaveFieldTimer(activeArenaTeam.id, activeArenaTeam.jenjang);
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Kunci Waktu</span>
              </button>

              <button
                onClick={resetFieldTimer}
                title="Reset Timer"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Stage Status Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGING_CONFIG.STAGES.map(st => {
            const count = stageCounts[st.id] || 0;
            return (
              <div
                key={st.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {st.shortLabel}
                </span>
                <div className="text-2xl font-black font-mono text-white">
                  {count} <span className="text-xs text-slate-500 font-normal">Tim</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kanban / Pipeline Staging Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* COLUMN 1: DP 1 (Absensi & Berkas) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-white">DP 1: Absensi & Berkas</h3>
                  <span className="text-[10px] text-slate-400">Verifikasi kehadiran & nomor undi</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                {stageCounts['dp1'] || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {verifiedTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp1' || (staging[t.id]?.stage || 'waiting') === 'waiting').map(team => {
                const currentStage = staging[team.id]?.stage || 'waiting';
                return (
                  <div
                    key={team.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                          No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                        </span>
                        <h4 className="font-black text-sm text-white mt-1.5">{team.schoolName}</h4>
                        <p className="text-xs text-slate-400">{team.platoonName}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        currentStage === 'dp1' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {currentStage === 'dp1' ? 'Tiba di DP 1' : 'Standby'}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                      {currentStage === 'waiting' && (
                        <button
                          onClick={() => handleMoveStage(team, 'dp1')}
                          className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Panggil ke DP 1</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {currentStage === 'dp1' && (
                        <button
                          onClick={() => handleMoveStage(team, 'dp2')}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Kirim ke DP 2</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: DP 2 (Pemeriksaan Kerapian & Personel) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-white">DP 2: Kerapian & Personel</h3>
                  <span className="text-[10px] text-slate-400">Pemeriksaan atribut & kelengkapan</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                {stageCounts['dp2'] || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {verifiedTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp2').map(team => {
                const teamChecklist = staging[team.id]?.checklist || {};
                const passedCount = STAGING_CONFIG.DP2_CHECKLIST.filter(c => teamChecklist[c.id]).length;
                const isAllChecked = passedCount === STAGING_CONFIG.DP2_CHECKLIST.length;

                return (
                  <div
                    key={team.id}
                    className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                          No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                        </span>
                        <h4 className="font-black text-sm text-white mt-1.5">{team.schoolName}</h4>
                        <p className="text-xs text-slate-400">{team.platoonName}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {passedCount}/{STAGING_CONFIG.DP2_CHECKLIST.length} Ceklis
                      </span>
                    </div>

                    {/* Quick Checklist Toggle List */}
                    <div className="bg-slate-900/90 p-3 rounded-xl space-y-2 border border-slate-800 text-xs">
                      {STAGING_CONFIG.DP2_CHECKLIST.map(item => {
                        const checked = Boolean(teamChecklist[item.id]);
                        return (
                          <label
                            key={item.id}
                            onClick={() => {
                              updateTeamStaging(team.id, 'dp2', {
                                checklist: { [item.id]: !checked }
                              });
                            }}
                            className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              className="w-4 h-4 rounded accent-amber-500"
                            />
                            <span className={checked ? 'line-through text-slate-500' : ''}>
                              {item.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => handleMoveStage(team, 'dp3')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                          isAllChecked
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Lolos ke DP 3</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: DP 3 (Pintu Masuk Lapangan) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-white">DP 3: Pintu Masuk</h3>
                  <span className="text-[10px] text-slate-400">Siap melangkah ke kotak arena</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                {stageCounts['dp3'] || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {verifiedTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp3').map(team => {
                return (
                  <div
                    key={team.id}
                    className="bg-slate-950 border border-indigo-500/40 p-4 rounded-2xl space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                          No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                        </span>
                        <h4 className="font-black text-sm text-white mt-1.5">{team.schoolName}</h4>
                        <p className="text-xs text-slate-400">{team.platoonName}</p>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Siap Tampil
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => handleMoveStage(team, 'arena')}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Mulai Tampil (Masuk Arena)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Finished Teams Table Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-base uppercase text-white">Riwayat Peleton yang Selesai Tampil</h3>
              <p className="text-xs text-slate-400">Data durasi tampil dan penalti kelebihan waktu lapangan</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/20">
              {stageCounts['finished'] || 0} Peleton Selesai
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2 px-3">No. Undi</th>
                  <th className="py-2 px-3">Peleton & Sekolah</th>
                  <th className="py-2 px-3">Jenjang</th>
                  <th className="py-2 px-3">Durasi Tampil</th>
                  <th className="py-2 px-3">Status Waktu</th>
                  <th className="py-2 px-3">Penalti Overtime</th>
                  <th className="py-2 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {verifiedTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'finished').map(team => {
                  const s = staging[team.id] || {};
                  const duration = s.durationSeconds || 0;
                  const otBlocks = s.overtimePenaltyBlocks || 0;
                  const penaltyPoints = otBlocks * STAGING_CONFIG.PENALTY_OVERTIME_PER_30_SEC;

                  return (
                    <tr key={team.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-yellow-400">
                        {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{team.schoolName}</div>
                        <div className="text-[10px] text-slate-500">{team.platoonName}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-bold">{team.jenjang}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-200">
                        {formatTime(duration)}
                      </td>
                      <td className="py-3 px-3">
                        {otBlocks > 0 ? (
                          <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                            Overtime (+{otBlocks * 30}s)
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            Tepat Waktu
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-rose-400">
                        {penaltyPoints > 0 ? `-${penaltyPoints} Poin` : '0 Poin'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleMoveStage(team, 'dp3')}
                          className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Ulangi / Kembalikan ke DP3
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
