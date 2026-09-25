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
  X,
  QrCode,
  PackageCheck,
  Trash2,
  CreditCard,
  Droplets,
  Search,
  Tablet,
  UserCheck,
  UserX,
  Eye,
  LogOut,
  Building2,
  Home
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { STAGING_CONFIG, COMPETITION, TIMELINE, VENUE } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

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
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Tab Basecamp QR
  const [qrInput, setQrInput] = useState('');
  const [selectedBasecampTeamId, setSelectedBasecampTeamId] = useState(null);
  const basecampActionType = stagingBasecampAction || 'checkin';
  const setBasecampActionType = setStagingBasecampAction || (() => {});
  const [ktpOfficialName, setKtpOfficialName] = useState('');
  const [ktpType, setKtpType] = useState('KTP Fisik');
  const [logisticsChecklist, setLogisticsChecklist] = useState({
    waterBox: true,
    chestNumber: true,
    cocardOfficial: true,
    trashBag: true,
  });
  const [checkoutChecklist, setCheckoutChecklist] = useState({
    roomCleanChecked: true,
    sortedTrashReturned: true,
    ktpReturned: true,
  });
  const [basecampToast, setBasecampToast] = useState('');

  // State untuk Tab DP 1 (Inspeksi Tab / iPad)
  const [selectedDP1TeamId, setSelectedDP1TeamId] = useState(null);

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
    .filter(t => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.schoolName?.toLowerCase().includes(q) ||
        t.platoonName?.toLowerCase().includes(q) ||
        t.regCode?.toLowerCase().includes(q) ||
        String(t.lotNumber || '').includes(q)
      );
    })
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

  // Handler Scan QR / Cari Peleton di Basecamp
  function handleScanOrSearchBasecamp(e) {
    e?.preventDefault();
    if (!qrInput.trim()) return;
    const clean = qrInput.trim().toLowerCase();
    const found = teams.find(t =>
      t.regCode?.toLowerCase() === clean ||
      t.schoolName?.toLowerCase().includes(clean) ||
      t.platoonName?.toLowerCase().includes(clean) ||
      String(t.lotNumber || '') === clean
    );

    if (found) {
      setSelectedBasecampTeamId(found.id);
      setKtpOfficialName(found.officialName || found.coachName || '');
      const s = staging[found.id];
      if (s?.stage === 'finished' || s?.stage === 'checkout') {
        setBasecampActionType('checkout');
      } else {
        setBasecampActionType('checkin');
      }
      setBasecampToast(`Peleton ditemukan: ${found.schoolName} (${found.regCode})`);
      setTimeout(() => setBasecampToast(''), 3500);
    } else {
      alert(`Kode QR / Nama Peleton "${qrInput}" tidak ditemukan dalam database.`);
    }
  }

  // Submit Check-in Basecamp
  function handleSubmitCheckin() {
    if (!selectedBasecampTeamId) return;
    const team = teams.find(t => t.id === selectedBasecampTeamId);
    if (!team) return;

    checkInBasecamp(team.id, {
      ktpOfficialName: ktpOfficialName || team.officialName || 'Official Tim',
      ktpType,
      waterBoxGiven: logisticsChecklist.waterBox,
      chestNumberGiven: logisticsChecklist.chestNumber,
      cocardOfficialGiven: logisticsChecklist.cocardOfficial,
      trashBagGiven: logisticsChecklist.trashBag,
    });

    setBasecampToast(`Check-in Berhasil untuk ${team.schoolName}! Logistik & KTP tersimpan.`);
    setTimeout(() => setBasecampToast(''), 4000);
    setQrInput('');
  }

  // Submit Check-out Basecamp
  function handleSubmitCheckout() {
    if (!selectedBasecampTeamId) return;
    const team = teams.find(t => t.id === selectedBasecampTeamId);
    if (!team) return;

    checkOutBasecamp(team.id, {
      roomCleanChecked: checkoutChecklist.roomCleanChecked,
      sortedTrashReturned: checkoutChecklist.sortedTrashReturned,
      ktpReturned: checkoutChecklist.ktpReturned,
    });

    setBasecampToast(`Check-out Sukses! KTP/SIM ${team.schoolName} telah dikembalikan.`);
    setTimeout(() => setBasecampToast(''), 4000);
    setQrInput('');
  }

  const selectedBasecampTeam = teams.find(t => t.id === selectedBasecampTeamId) || null;
  const selectedBasecampStage = selectedBasecampTeam ? (staging[selectedBasecampTeam.id]?.stage || 'waiting') : null;
  const selectedBasecampLogistics = selectedBasecampTeam ? (staging[selectedBasecampTeam.id]?.basecampLogistics || {}) : {};

  // Tim untuk DP 1
  const selectedDP1Team = teams.find(t => t.id === selectedDP1TeamId) ||
    eligibleTeams.find(t => (staging[t.id]?.stage || 'waiting') === 'dp1') ||
    eligibleTeams[0] || null;

  const dp1TeamInspections = selectedDP1Team ? (staging[selectedDP1Team.id]?.dp1Inspections || {}) : {};

  // Susunan 25 personel DP 1: Danton + Pasukan 1-21 + Cadangan 1-3
  const dp1Personnels = [];
  if (selectedDP1Team) {
    const r = selectedDP1Team.roster || {};
    // Danton
    dp1Personnels.push({
      id: 'danton',
      role: 'Komandan (Danton)',
      name: r.danton?.name || selectedDP1Team.dantonName || 'Komandan Peleton',
      nisn: r.danton?.nisn || '-',
      class: r.danton?.class || '-',
      photo: r.danton?.photo || null,
      isDanton: true,
    });
    // 21 Pasukan
    const pasukan = Array.isArray(r.pasukan) ? r.pasukan : [];
    for (let i = 0; i < 21; i++) {
      const p = pasukan[i];
      const saf = Math.ceil((i + 1) / 7);
      const banjar = (i % 7) + 1;
      dp1Personnels.push({
        id: `pasukan-${i + 1}`,
        role: `Pasukan Inti (Saf ${saf}, Banjar ${banjar})`,
        name: p?.name || `Personel ${i + 1}`,
        nisn: p?.nisn || '-',
        class: p?.class || '-',
        photo: p?.photo || null,
        isPasukan: true,
      });
    }
    // 3 Cadangan
    const cadangan = Array.isArray(r.cadangan) ? r.cadangan : [];
    for (let i = 0; i < 3; i++) {
      const c = cadangan[i];
      dp1Personnels.push({
        id: `cadangan-${i + 1}`,
        role: `Cadangan ${i + 1}`,
        name: c?.name || `Cadangan ${i + 1}`,
        nisn: c?.nisn || '-',
        class: c?.class || '-',
        photo: c?.photo || null,
        isCadangan: true,
      });
    }
  }

  const dp1VerifiedCount = dp1Personnels.filter(p => dp1TeamInspections[p.id]?.verified).length;
  const isDP1AllVerified = dp1Personnels.length > 0 && dp1VerifiedCount >= 22; // Minimal Danton + 21 Pasukan

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
        <div className={`rounded-3xl p-6 border shadow-sm transition-all ${timerTheme}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Active Team Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  KOTAK LOMBA SEDANG AKTIF
                </span>
                <span className="text-xs text-slate-600 font-mono font-bold">
                  Maksimal: {Math.floor(maxDuration / 60)} Menit ({activeArenaTeam?.jenjang || 'SMP'})
                </span>
              </div>

              {activeArenaTeam ? (
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-mono font-black text-sm rounded-lg shadow-xs">
                      No. {activeArenaTeam.lotNumber ? String(activeArenaTeam.lotNumber).padStart(2, '0') : '--'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      {activeArenaTeam.schoolName}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Peleton: <strong className="text-slate-900">{activeArenaTeam.platoonName}</strong> • Danton: <strong className="text-slate-900">{activeArenaTeam.roster?.danton?.name || activeArenaTeam.dantonName || '-'}</strong>
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-slate-500 italic">
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
              <div className="font-mono font-black text-5xl sm:text-6xl tracking-tight text-slate-900 drop-shadow-xs">
                {formatTime(elapsed)}
              </div>
              <div className="flex items-center gap-4 text-xs mt-2 font-mono">
                <span className="text-slate-600">
                  Sisa: <strong className="text-slate-900 font-bold">{formatTime(remaining)}</strong>
                </span>
                {isOvertime && (
                  <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300 animate-bounce">
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
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{fieldTimer.elapsedSeconds > 0 ? 'Lanjutkan Timer' : 'Mulai Tampil'}</span>
                </button>
              ) : (
                <button
                  onClick={pauseFieldTimer}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
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
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Kunci Waktu</span>
              </button>

              <button
                onClick={resetFieldTimer}
                title="Reset Timer"
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Counter Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {STAGING_CONFIG.STAGES.map(st => {
            const count = stageCounts[st.id] || 0;
            return (
              <div
                key={st.id}
                className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs text-center space-y-1"
              >
                <span className="text-[9px] uppercase font-bold text-slate-500 block truncate">
                  {st.shortLabel}
                </span>
                <div className="text-xl font-black font-mono text-slate-900">
                  {count} <span className="text-[10px] text-slate-400 font-normal">Tim</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: BASECAMP SCAN QR & LOGISTIK SOP                              */}
        {/* ========================================================================= */}
        {activeViewMode === 'basecamp' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    Pos Meja Registrasi Basecamp
                  </span>
                  <h2 className="text-xl font-black uppercase text-slate-900 mt-1">
                    Check-in & Check-out Basecamp Kontingen
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan kode QR dari ID Card / Tiket peleton atau ketik kode pendaftaran untuk proses serah terima logistik.
                  </p>
                </div>

                {/* Mode Checkin vs Checkout Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setBasecampActionType('checkin')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      basecampActionType === 'checkin' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1. Check-in (Tiba)
                  </button>
                  <button
                    onClick={() => setBasecampActionType('checkout')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      basecampActionType === 'checkout' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    2. Check-out (Pulang)
                  </button>
                </div>
              </div>

              {/* QR Code Scanner / Input Bar */}
              <form onSubmit={handleScanOrSearchBasecamp} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <QrCode className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="Scan QR ID Card Peleton atau ketik Kode Registrasi (cth: LBB26-SMP-001)..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-900 text-sm font-mono focus:border-teal-500 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari / Scan</span>
                </button>
              </form>

              {basecampToast && (
                <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>{basecampToast}</span>
                </div>
              )}

              {/* Form Interaksi Basecamp jika Peleton Terpilih */}
              {selectedBasecampTeam ? (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6">
                  {/* Info Peleton */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {selectedBasecampTeam.regCode}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          No. Undi: <strong className="text-slate-900">#{selectedBasecampTeam.lotNumber || '-'}</strong>
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Tingkat: <strong className="text-slate-900">{selectedBasecampTeam.jenjang}</strong>
                        </span>
                      </div>
                      <h3 className="text-2xl font-black uppercase text-slate-900 mt-1">
                        {selectedBasecampTeam.schoolName}
                      </h3>
                      <p className="text-xs text-slate-600">{selectedBasecampTeam.platoonName}</p>
                    </div>

                    <div className="bg-white border border-slate-200 p-3 rounded-2xl text-right shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ruang Basecamp</span>
                      <span className="text-lg font-black text-amber-600 font-mono">
                        {selectedBasecampTeam.basecampNumber ? `Ruang ${selectedBasecampTeam.basecampNumber}` : 'Belum Ditentukan'}
                      </span>
                    </div>
                  </div>

                  {/* FORM CHECKIN */}
                  {basecampActionType === 'checkin' && (
                    <div className="space-y-6">
                      <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl space-y-1">
                        <h4 className="font-black text-sm uppercase text-teal-800 flex items-center gap-2">
                          <PackageCheck className="w-4 h-4 text-teal-600" />
                          <span>SOP Check-in Kedatangan Peleton</span>
                        </h4>
                        <p className="text-xs text-teal-700">
                          Pastikan official menyerahkan jaminan identitas (KTP/SIM fisik) dan menerima seluruh paket logistik resmi panitia.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Identitas KTP/SIM Fisik */}
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                          <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-amber-500" />
                            <span>Jaminan Identitas Fisik (Titip 1 KTP / SIM)</span>
                          </label>
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] text-slate-500 block mb-1">Nama Pemilik Identitas:</span>
                              <input
                                type="text"
                                value={ktpOfficialName}
                                onChange={(e) => setKtpOfficialName(e.target.value)}
                                placeholder="Nama Official / Pembina..."
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block mb-1">Jenis Kartu:</span>
                              <select
                                value={ktpType}
                                onChange={(e) => setKtpType(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 cursor-pointer"
                              >
                                <option value="KTP Fisik">KTP Fisik Asli</option>
                                <option value="SIM Fisik">SIM Fisik Asli</option>
                                <option value="Kartu Pegawai">Kartu Pegawai / Guru Asli</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Serah Terima Paket Logistik */}
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                          <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                            <Droplets className="w-4 h-4 text-cyan-600" />
                            <span>Serah Terima Logistik Resmi Panitia</span>
                          </label>
                          <div className="space-y-2 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.waterBox}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, waterBox: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                              />
                              <span>1 Dus Air Minum Mineral (24 botol / cup)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.chestNumber}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, chestNumber: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                              />
                              <span>Nomor Dada Peleton (Sesuai Undian)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.cocardOfficial}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, cocardOfficial: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                              />
                              <span>Cocard ID Pendamping (3 Pcs: 1 Official + 2 Pendukung)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.trashBag}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, trashBag: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                              />
                              <span>Karung Sampah untuk Pemilahan Sampah Basecamp</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleSubmitCheckin}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selesaikan Check-in & Masuk Basecamp</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORM CHECKOUT */}
                  {basecampActionType === 'checkout' && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                        <h4 className="font-black text-sm uppercase text-amber-800 flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-amber-600" />
                          <span>SOP Check-out Kepulangan Peleton</span>
                        </h4>
                        <p className="text-xs text-amber-700">
                          Sebelum mengembalikan KTP/SIM, panitia wajib memeriksa kebersihan ruangan basecamp dan memastikan sampah telah dipilah ke karung sampah.
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                        <div className="space-y-2.5 text-xs">
                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                            <input
                              type="checkbox"
                              checked={checkoutChecklist.roomCleanChecked}
                              onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, roomCleanChecked: e.target.checked })}
                              className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                            />
                            <span className="font-bold">1. Kebersihan Basecamp Telah Diperiksa & Bersih</span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                            <input
                              type="checkbox"
                              checked={checkoutChecklist.sortedTrashReturned}
                              onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, sortedTrashReturned: e.target.checked })}
                              className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                            />
                            <span className="font-bold">2. Karung Sampah Terpilah Telah Dikembalikan ke Panitia</span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                            <input
                              type="checkbox"
                              checked={checkoutChecklist.ktpReturned}
                              onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, ktpReturned: e.target.checked })}
                              className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                            />
                            <span className="font-bold">3. KTP/SIM Fisik Official Siap Diserahkan Kembali</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleSubmitCheckout}
                          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Konfirmasi Check-out & Kembalikan KTP</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 text-slate-600">
                  <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Belum Ada Peleton yang Dipilih</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Gunakan kolom pencarian atau klik salah satu peleton di bawah untuk memproses logistik basecamp.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: DP 1 INSPEKSI TAB / IPAD                                      */}
        {/* ========================================================================= */}
        {activeViewMode === 'dp1' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      DP 1: INSPEKSI FOTO TAB / IPAD
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Verifikasi 25 Personel Peleton</span>
                  </div>
                  <h2 className="text-xl font-black uppercase text-slate-900 mt-1">
                    Pemeriksaan Wajah & Personel Lapangan
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cocokkan pasfoto pendaftaran dengan fisik siswa di lapangan sebelum meloloskan ke DP 2 (Ruang Tunggu Steril).
                  </p>
                </div>

                {/* Pilih Peleton yang Sedang Di DP 1 */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDP1Team?.id || ''}
                    onChange={(e) => setSelectedDP1TeamId(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 max-w-xs focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
                  >
                    {eligibleTeams.map(t => (
                      <option key={t.id} value={t.id}>
                        No. {t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '--'} - {t.schoolName} ({t.jenjang})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedDP1Team && (
                <div className="space-y-6">
                  {/* Team Bar & Pass to DP 2 Button */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {selectedDP1Team.regCode} • No. Undi #{selectedDP1Team.lotNumber || '-'}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 uppercase mt-1">{selectedDP1Team.schoolName}</h3>
                      <p className="text-xs text-slate-500">{selectedDP1Team.platoonName}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Terverifikasi</span>
                        <span className="text-sm font-mono font-black text-emerald-600">
                          {dp1VerifiedCount} / {dp1Personnels.length} Personel
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          passToDP2(selectedDP1Team.id);
                          alert(`Peleton ${selectedDP1Team.schoolName} berhasil diloloskan ke DP 2 (Ruang Tunggu Steril)!`);
                        }}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                          isDP1AllVerified
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>Loloskan ke DP 2</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tablet/iPad Touch-Friendly Cards Grid (25 Personel: Danton + 21 Pasukan + 3 Cadangan) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {dp1Personnels.map((person) => {
                      const verified = Boolean(dp1TeamInspections[person.id]?.verified);
                      const note = dp1TeamInspections[person.id]?.note || '';

                      return (
                        <div
                          key={person.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            verified
                              ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Pasfoto */}
                            <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                              {person.photo ? (
                                <img
                                  src={person.photo}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="w-6 h-6 text-slate-400" />
                              )}
                            </div>

                            {/* Biodata */}
                            <div className="flex-1 min-w-0">
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded block w-fit mb-1 ${
                                person.isDanton ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {person.role}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 truncate" title={person.name}>
                                {person.name}
                              </h4>
                              <p className="text-[10px] text-slate-500">NISN: {person.nisn}</p>
                              <p className="text-[10px] text-slate-500">Kelas: {person.class}</p>

                              {/* Toggle Hadir / Sesuai Wajah */}
                              <div className="mt-2 flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateDP1PersonnelInspection(selectedDP1Team.id, person.id, !verified)}
                                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                    verified
                                      ? 'bg-emerald-600 text-white font-black shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {verified ? (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5" />
                                      <span>Sesuai</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-3.5 h-3.5" />
                                      <span>Periksa</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 3: PIPELINE STAGING KANBAN (DP 1, DP 2 STERIL, DP 3)           */}
        {/* ========================================================================= */}
        {activeViewMode === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* COLUMN 1: DP 1 (Inspeksi Personel & Absensi) */}
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-slate-900">DP 1: Inspeksi Foto</h3>
                    <span className="text-[10px] text-slate-500">Verifikasi 25 personel via Tab</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  {stageCounts['dp1'] || 0}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp1' || (staging[t.id]?.stage || 'waiting') === 'waiting' || (staging[t.id]?.stage || 'waiting') === 'basecamp').map(team => {
                  const currentStage = staging[team.id]?.stage || 'waiting';
                  return (
                    <div
                      key={team.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-2xl space-y-3 shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                          </span>
                          <h4 className="font-black text-sm text-slate-900 mt-1.5">{team.schoolName}</h4>
                          <p className="text-xs text-slate-500">{team.platoonName}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          currentStage === 'dp1' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {currentStage === 'dp1' ? 'Di DP 1' : (currentStage === 'basecamp' ? 'Basecamp' : 'Standby')}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        {currentStage !== 'dp1' ? (
                          <button
                            onClick={() => handleMoveStage(team, 'dp1')}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Panggil ke DP 1</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedDP1TeamId(team.id);
                              setActiveViewMode('dp1');
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Tablet className="w-3.5 h-3.5" />
                            <span>Buka Inspeksi Tab</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: DP 2 (Ruang Tunggu Steril) */}
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-slate-900">DP 2: Ruang Tunggu Steril</h3>
                    <span className="text-[10px] text-slate-500">Peleton steril menunggu giliran tampil</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  {stageCounts['dp2'] || 0}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp2').map(team => {
                  return (
                    <div
                      key={team.id}
                      className="bg-white border border-amber-200 p-4 rounded-2xl space-y-3 shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                          </span>
                          <h4 className="font-black text-sm text-slate-900 mt-1.5">{team.schoolName}</h4>
                          <p className="text-xs text-slate-500">{team.platoonName}</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Tunggu Steril
                        </span>
                      </div>

                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                        Personel lengkap & terverifikasi di DP 1. Menunggu dipanggil ke DP 3.
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleMoveStage(team, 'dp3')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <span>Kirim ke DP 3</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: DP 3 (Pintu Masuk Lapangan) */}
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <DoorOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-slate-900">DP 3: Pintu Masuk</h3>
                    <span className="text-[10px] text-slate-500">Siap melangkah ke kotak arena</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {stageCounts['dp3'] || 0}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp3').map(team => {
                  return (
                    <div
                      key={team.id}
                      className="bg-white border border-indigo-200 p-4 rounded-2xl space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                          </span>
                          <h4 className="font-black text-sm text-slate-900 mt-1.5">{team.schoolName}</h4>
                          <p className="text-xs text-slate-500">{team.platoonName}</p>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Siap Tampil
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleMoveStage(team, 'arena')}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
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
        )}

        {/* Finished Teams Table Summary */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-black text-base uppercase text-slate-900">Riwayat Peleton yang Selesai Tampil</h3>
              <p className="text-xs text-slate-500">Data durasi tampil dan penalti kelebihan waktu lapangan</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
              {stageCounts['finished'] || 0} Peleton Selesai
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                  <th className="py-2.5 px-3">No. Undi</th>
                  <th className="py-2.5 px-3">Peleton & Sekolah</th>
                  <th className="py-2.5 px-3">Jenjang</th>
                  <th className="py-2.5 px-3">Durasi Tampil</th>
                  <th className="py-2.5 px-3">Status Waktu</th>
                  <th className="py-2.5 px-3">Penalti Overtime</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'finished' || (staging[t.id]?.stage || 'waiting') === 'checkout').map(team => {
                  const s = staging[team.id] || {};
                  const duration = s.durationSeconds || 0;
                  const otBlocks = s.overtimePenaltyBlocks || 0;
                  const penaltyPoints = otBlocks * STAGING_CONFIG.PENALTY_OVERTIME_PER_30_SEC;

                  return (
                    <tr key={team.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-amber-700">
                        {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{team.schoolName}</div>
                        <div className="text-[10px] text-slate-500">{team.platoonName}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-bold">{team.jenjang}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {formatTime(duration)}
                      </td>
                      <td className="py-3 px-3">
                        {otBlocks > 0 ? (
                          <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Overtime (+{otBlocks * 30}s)
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Tepat Waktu
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-rose-600">
                        {penaltyPoints > 0 ? `-${penaltyPoints} Poin` : '0 Poin'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleMoveStage(team, 'dp3')}
                          className="text-[10px] text-slate-500 hover:text-indigo-600 font-medium underline cursor-pointer"
                        >
                          Kembalikan ke DP3
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
    </SimpaskorSidebarLayout>
  );
}

