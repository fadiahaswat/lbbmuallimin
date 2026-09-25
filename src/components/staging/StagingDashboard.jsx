import React, { useState } from 'react';
import {
  ShieldCheck,
  ClipboardCheck,
  QrCode,
  Tablet
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { STAGING_CONFIG, TIMELINE } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import LiveArenaTimerBar from './components/LiveArenaTimerBar.jsx';
import StageSummaryCards from './components/StageSummaryCards.jsx';
import BasecampLogisticsTab from './components/BasecampLogisticsTab.jsx';
import DP1InspectionTab from './components/DP1InspectionTab.jsx';
import PipelineKanbanView from './components/PipelineKanbanView.jsx';
import FinishedTeamsTable from './components/FinishedTeamsTable.jsx';

export default function StagingDashboard() {
  const {
    currentUser,
    openModal,
    teams,
    staging,
    updateTeamStaging,
    checkInBasecamp,
    checkOutBasecamp,
    updateDP1PersonnelInspection,
    passToDP2,
    fieldTimer,
    startFieldTimer,
    pauseFieldTimer,
    resumeFieldTimer,
    resetFieldTimer,
    stopAndSaveFieldTimer,
    setActiveView,
    stagingActiveMode,
    setStagingActiveMode,
    stagingBasecampAction,
    setStagingBasecampAction
  } = useCompetition();

  // Navigation tab pada Staging Dashboard:
  // 'pipeline' (Alur Keseluruhan), 'basecamp' (Registrasi & Logistik QR), 'dp1' (Inspeksi Tab/iPad)
  const activeViewMode = stagingActiveMode || 'pipeline';
  const setActiveViewMode = setStagingActiveMode || (() => {});
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [selectedDP1TeamId, setSelectedDP1TeamId] = useState(null);

  const basecampActionType = stagingBasecampAction || 'checkin';
  const setBasecampActionType = setStagingBasecampAction || (() => {});

  // Akses Terbatas: Admin, Superadmin, atau Penginput/Verifikator/Finalisator/Juri
  const hasAccess = currentUser && ['admin', 'superadmin', 'penginput', 'verifikator', 'finalisator', 'juri'].includes(currentUser.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full">
              Akses Dibatasi
            </span>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-3">
              Operasional Panitia Lapangan
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Halaman Staging Area, Basecamp QR, dan Inspeksi DP 1 ini hanya dapat diakses oleh Panitia Lapangan, Operator, atau Administrator resmi.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openModal('auth')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              Masuk Akun Panitia
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter verified & drawn teams
  const eligibleTeams = teams
    .filter(t => t.status === 'verified' || t.status === 'drawn')
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
    acc[st.id] = eligibleTeams.filter(t => {
      const currentStage = staging[t.id]?.stage || 'waiting';
      return currentStage === st.id;
    }).length;
    return acc;
  }, {});

  // Progress Bar percentage
  const progressPct = Math.min(100, Math.round((elapsed / maxDuration) * 100));

  // Timer status theme
  let timerTheme = 'border-emerald-200 bg-emerald-50/90 text-emerald-950 shadow-sm';
  let progressColor = 'bg-emerald-500';
  if (isOvertime) {
    timerTheme = 'border-rose-300 bg-rose-50 text-rose-950 shadow-sm animate-pulse';
    progressColor = 'bg-rose-500';
  } else if (remaining <= STAGING_CONFIG.WARNING_TIMES.RED_REMAINING) {
    timerTheme = 'border-rose-200 bg-rose-50 text-rose-950 shadow-sm';
    progressColor = 'bg-rose-500';
  } else if (remaining <= STAGING_CONFIG.WARNING_TIMES.YELLOW_REMAINING) {
    timerTheme = 'border-amber-200 bg-amber-50 text-amber-950 shadow-sm';
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

  const currentActiveMenu =
    activeViewMode === 'basecamp'
      ? (basecampActionType === 'checkout' ? 'checkout' : 'checkin')
      : 'dp';

  return (
    <SimpaskorSidebarLayout
      activeMenu={currentActiveMenu}
      title="Staging Area & Lapangan"
      subtitle="Manajemen Basecamp QR, Antrean DP 1-3 & Kotak Lomba"
    >
      <div className="space-y-6">

        {/* Sub Header & Staging Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  SOP HARI-H PERLOMBAAN
                </span>
                <span className="text-xs text-slate-500 font-medium">{TIMELINE.COMPETITION_DATE}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-slate-900 mt-0.5">
                Staging Area & Operasional Lapangan
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Basecamp (QR & Logistik), DP 1 (Inspeksi Tab/iPad), DP 2 (Tunggu Steril), DP 3, dan Kotak Lomba.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveViewMode('pipeline')}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'pipeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Antrean DP</span>
              </button>

              <button
                onClick={() => setActiveViewMode('basecamp')}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'basecamp' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Basecamp QR</span>
              </button>

              <button
                onClick={() => setActiveViewMode('dp1')}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'dp1' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>DP 1 (Tab/iPad)</span>
              </button>
            </div>

            {/* Filter Jenjang */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setSelectedJenjang('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'ALL' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SMP' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SMP
              </button>
              <button
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SD' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SD
              </button>
            </div>
          </div>
        </div>

        {/* Live Arena Stopwatch Bar */}
        <LiveArenaTimerBar
          activeArenaTeam={activeArenaTeam}
          fieldTimer={fieldTimer}
          maxDuration={maxDuration}
          elapsed={elapsed}
          remaining={remaining}
          isOvertime={isOvertime}
          overtimeSeconds={overtimeSeconds}
          overtimePenalty={overtimePenalty}
          progressPct={progressPct}
          timerTheme={timerTheme}
          progressColor={progressColor}
          formatTime={formatTime}
          resumeFieldTimer={resumeFieldTimer}
          startFieldTimer={startFieldTimer}
          pauseFieldTimer={pauseFieldTimer}
          stopAndSaveFieldTimer={stopAndSaveFieldTimer}
          resetFieldTimer={resetFieldTimer}
        />

        {/* Counter Summary Cards */}
        <StageSummaryCards
          stages={STAGING_CONFIG.STAGES}
          stageCounts={stageCounts}
        />

        {/* VIEW MODE 1: BASECAMP SCAN QR & LOGISTIK SOP */}
        {activeViewMode === 'basecamp' && (
          <BasecampLogisticsTab
            teams={teams}
            staging={staging}
            checkInBasecamp={checkInBasecamp}
            checkOutBasecamp={checkOutBasecamp}
            basecampActionType={basecampActionType}
            setBasecampActionType={setBasecampActionType}
          />
        )}

        {/* VIEW MODE 2: DP 1 INSPEKSI TAB / IPAD */}
        {activeViewMode === 'dp1' && (
          <DP1InspectionTab
            eligibleTeams={eligibleTeams}
            staging={staging}
            updateDP1PersonnelInspection={updateDP1PersonnelInspection}
            passToDP2={passToDP2}
            initialSelectedTeamId={selectedDP1TeamId}
          />
        )}

        {/* VIEW MODE 3: PIPELINE STAGING KANBAN */}
        {activeViewMode === 'pipeline' && (
          <PipelineKanbanView
            eligibleTeams={eligibleTeams}
            staging={staging}
            stageCounts={stageCounts}
            handleMoveStage={handleMoveStage}
            setSelectedDP1TeamId={setSelectedDP1TeamId}
            setActiveViewMode={setActiveViewMode}
          />
        )}

        {/* Finished Teams Table Summary */}
        <FinishedTeamsTable
          eligibleTeams={eligibleTeams}
          staging={staging}
          stageCounts={stageCounts}
          formatTime={formatTime}
          handleMoveStage={handleMoveStage}
        />

      </div>
    </SimpaskorSidebarLayout>
  );
}
