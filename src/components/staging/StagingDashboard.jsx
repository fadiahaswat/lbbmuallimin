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
    setActiveView
  } = useCompetition();

  // Navigation tab pada Staging Dashboard:
  // 'pipeline' (Alur Keseluruhan), 'basecamp' (Registrasi & Logistik QR), 'dp1' (Inspeksi Tab/iPad)
  const [activeViewMode, setActiveViewMode] = useState('pipeline');
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Tab Basecamp QR
  const [qrInput, setQrInput] = useState('');
  const [selectedBasecampTeamId, setSelectedBasecampTeamId] = useState(null);
  const [basecampActionType, setBasecampActionType] = useState('checkin'); // 'checkin' | 'checkout'
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
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-950/70 border border-rose-500/30 px-3 py-1 rounded-full">
              Akses Dibatasi
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mt-3">
              Operasional Panitia Lapangan
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Halaman Staging Area, Basecamp QR, dan Inspeksi DP 1 ini hanya dapat diakses oleh Panitia Lapangan, Operator, atau Administrator resmi.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openModal('auth')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
            >
              Masuk Akun Panitia
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-3 sm:p-6 lg:p-8">
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
                  SOP HARI-H PERLOMBAAN
                </span>
                <span className="text-xs text-slate-400">{TIMELINE.COMPETITION_DATE}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-0.5">
                Staging Area & Operasional Lapangan
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Basecamp (QR & Logistik), DP 1 (Inspeksi Tab/iPad), DP 2 (Tunggu Steril), DP 3, dan Kotak Lomba.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveViewMode('pipeline')}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'pipeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Antrean DP</span>
              </button>

              <button
                onClick={() => setActiveViewMode('basecamp')}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'basecamp' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Basecamp QR</span>
              </button>

              <button
                onClick={() => setActiveViewMode('dp1')}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'dp1' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>DP 1 (Tab/iPad)</span>
              </button>
            </div>

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
                SMP
              </button>
              <button
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                SD
              </button>
            </div>

            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Kembali
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
                    Peleton: <strong>{activeArenaTeam.platoonName}</strong> • Danton: <strong>{activeArenaTeam.roster?.danton?.name || activeArenaTeam.dantonName || '-'}</strong>
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

        {/* Counter Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {STAGING_CONFIG.STAGES.map(st => {
            const count = stageCounts[st.id] || 0;
            return (
              <div
                key={st.id}
                className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-sm text-center space-y-1"
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
                  {st.shortLabel}
                </span>
                <div className="text-xl font-black font-mono text-white">
                  {count} <span className="text-[10px] text-slate-500 font-normal">Tim</span>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
                    Pos Meja Registrasi Basecamp
                  </span>
                  <h2 className="text-xl font-black uppercase text-white mt-1">
                    Check-in & Check-out Basecamp Kontingen
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scan kode QR dari ID Card / Tiket peleton atau ketik kode pendaftaran untuk proses serah terima logistik.
                  </p>
                </div>

                {/* Mode Checkin vs Checkout Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setBasecampActionType('checkin')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      basecampActionType === 'checkin' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Check-in (Tiba)
                  </button>
                  <button
                    onClick={() => setBasecampActionType('checkout')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      basecampActionType === 'checkout' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm font-mono focus:border-teal-400 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari / Scan</span>
                </button>
              </form>

              {basecampToast && (
                <div className="p-3 bg-teal-950 border border-teal-500 text-teal-300 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{basecampToast}</span>
                </div>
              )}

              {/* Form Interaksi Basecamp jika Peleton Terpilih */}
              {selectedBasecampTeam ? (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
                  {/* Info Peleton */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          {selectedBasecampTeam.regCode}
                        </span>
                        <span className="text-xs text-slate-400">
                          No. Undi: <strong className="text-white">#{selectedBasecampTeam.lotNumber || '-'}</strong>
                        </span>
                        <span className="text-xs text-slate-400">
                          Tingkat: <strong className="text-white">{selectedBasecampTeam.jenjang}</strong>
                        </span>
                      </div>
                      <h3 className="text-2xl font-black uppercase text-white mt-1">
                        {selectedBasecampTeam.schoolName}
                      </h3>
                      <p className="text-xs text-slate-300">{selectedBasecampTeam.platoonName}</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ruang Basecamp</span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {selectedBasecampTeam.basecampNumber ? `Ruang ${selectedBasecampTeam.basecampNumber}` : 'Belum Ditentukan'}
                      </span>
                    </div>
                  </div>

                  {/* FORM CHECKIN */}
                  {basecampActionType === 'checkin' && (
                    <div className="space-y-6">
                      <div className="bg-teal-950/40 border border-teal-500/30 p-4 rounded-2xl space-y-1">
                        <h4 className="font-black text-sm uppercase text-teal-300 flex items-center gap-2">
                          <PackageCheck className="w-4 h-4 text-teal-400" />
                          <span>SOP Check-in Kedatangan Peleton</span>
                        </h4>
                        <p className="text-xs text-slate-300">
                          Pastikan official menyerahkan jaminan identitas (KTP/SIM fisik) dan menerima seluruh paket logistik resmi panitia.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Identitas KTP/SIM Fisik */}
                        <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                          <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-amber-400" />
                            <span>Jaminan Identitas Fisik (Titip 1 KTP / SIM)</span>
                          </label>
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Nama Pemilik Identitas:</span>
                              <input
                                type="text"
                                value={ktpOfficialName}
                                onChange={(e) => setKtpOfficialName(e.target.value)}
                                placeholder="Nama Official / Pembina..."
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Jenis Kartu:</span>
                              <select
                                value={ktpType}
                                onChange={(e) => setKtpType(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                              >
                                <option value="KTP Fisik">KTP Fisik Asli</option>
                                <option value="SIM Fisik">SIM Fisik Asli</option>
                                <option value="Kartu Pegawai">Kartu Pegawai / Guru Asli</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Serah Terima Paket Logistik */}
                        <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                          <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                            <Droplets className="w-4 h-4 text-cyan-400" />
                            <span>Serah Terima Logistik Resmi Panitia</span>
                          </label>
                          <div className="space-y-2 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.waterBox}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, waterBox: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-500"
                              />
                              <span>1 Dus Air Minum Mineral (24 botol / cup)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.chestNumber}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, chestNumber: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-500"
                              />
                              <span>Nomor Dada Peleton (Sesuai Undian)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.cocardOfficial}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, cocardOfficial: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-500"
                              />
                              <span>Cocard ID Card Official / Pembina Lapangan</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                              <input
                                type="checkbox"
                                checked={logisticsChecklist.trashBag}
                                onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, trashBag: e.target.checked })}
                                className="w-4 h-4 rounded accent-teal-500"
                              />
                              <span>Karung Sampah untuk Pemilahan Sampah Basecamp</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={handleSubmitCheckin}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
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
                      <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-1">
                        <h4 className="font-black text-sm uppercase text-amber-300 flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-amber-400" />
                          <span>SOP Check-out Kepulangan Peleton</span>
                        </h4>
                        <p className="text-xs text-slate-300">
                          Sebelum mengembalikan KTP/SIM, panitia wajib memeriksa kebersihan ruangan basecamp dan memastikan sampah telah dipilah ke karung sampah.
                        </p>
                      </div>

                      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="space-y-2.5 text-xs">
                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-200">
                            <input
                              type="checkbox"
                              checked={checkoutChecklist.roomCleanChecked}
                              onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, roomCleanChecked: e.target.checked })}
                              className="w-4 h-4 rounded accent-amber-500"
                            />
                            <span className="font-bold">1. Kebersihan Basecamp Telah Diperiksa & Bersih</span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-200">
                            <input
                              type="checkbox"
                              checked={checkoutChecklist.sortedTrashReturned}
                              onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, sortedTrashReturned: e.target.checked })}
                              className="w-4 h-4 rounded accent-amber-500"
                            />
                            <span className="font-bold">2. Karung Sampah Terpilah Telah Dikembalikan ke Panitia</span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-200">
                            <input
                              type="checkbox"
                              checked={checkoutChecklist.ktpReturned}
                              onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, ktpReturned: e.target.checked })}
                              className="w-4 h-4 rounded accent-amber-500"
                            />
                            <span className="font-bold">3. KTP/SIM Fisik Official Siap Diserahkan Kembali</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={handleSubmitCheckout}
                          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Konfirmasi Check-out & Kembalikan KTP</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-950/60 rounded-3xl border border-slate-800 text-slate-400">
                  <QrCode className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold">Belum Ada Peleton yang Dipilih</p>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      DP 1: INSPEKSI FOTO TAB / IPAD
                    </span>
                    <span className="text-xs text-slate-400">Verifikasi 25 Personel Peleton</span>
                  </div>
                  <h2 className="text-xl font-black uppercase text-white mt-1">
                    Pemeriksaan Wajah & Personel Lapangan
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cocokkan pasfoto pendaftaran dengan fisik siswa di lapangan sebelum meloloskan ke DP 2 (Ruang Tunggu Steril).
                  </p>
                </div>

                {/* Pilih Peleton yang Sedang Di DP 1 */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDP1Team?.id || ''}
                    onChange={(e) => setSelectedDP1TeamId(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white max-w-xs"
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
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-yellow-400">
                        {selectedDP1Team.regCode} • No. Undi #{selectedDP1Team.lotNumber || '-'}
                      </span>
                      <h3 className="text-lg font-black text-white uppercase">{selectedDP1Team.schoolName}</h3>
                      <p className="text-xs text-slate-400">{selectedDP1Team.platoonName}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Terverifikasi</span>
                        <span className="text-sm font-mono font-black text-emerald-400">
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
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
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
                              ? 'bg-emerald-950/20 border-emerald-500/40'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Pasfoto */}
                            <div className="w-16 h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shrink-0 flex items-center justify-center">
                              {person.photo ? (
                                <img
                                  src={person.photo}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="w-6 h-6 text-slate-600" />
                              )}
                            </div>

                            {/* Biodata */}
                            <div className="flex-1 min-w-0">
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded block w-fit mb-1 ${
                                person.isDanton ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {person.role}
                              </span>
                              <h4 className="font-bold text-xs text-white truncate" title={person.name}>
                                {person.name}
                              </h4>
                              <p className="text-[10px] text-slate-400">NISN: {person.nisn}</p>
                              <p className="text-[10px] text-slate-400">Kelas: {person.class}</p>

                              {/* Toggle Hadir / Sesuai Wajah */}
                              <div className="mt-2 flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateDP1PersonnelInspection(selectedDP1Team.id, person.id, !verified)}
                                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                    verified
                                      ? 'bg-emerald-500 text-slate-950 font-black'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-white">DP 1: Inspeksi Foto</h3>
                    <span className="text-[10px] text-slate-400">Verifikasi 25 personel via Tab</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                  {stageCounts['dp1'] || 0}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp1' || (staging[t.id]?.stage || 'waiting') === 'waiting' || (staging[t.id]?.stage || 'waiting') === 'basecamp').map(team => {
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
                          {currentStage === 'dp1' ? 'Di DP 1' : (currentStage === 'basecamp' ? 'Basecamp' : 'Standby')}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                        {currentStage !== 'dp1' ? (
                          <button
                            onClick={() => handleMoveStage(team, 'dp1')}
                            className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
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
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer"
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-white">DP 2: Ruang Tunggu Steril</h3>
                    <span className="text-[10px] text-slate-400">Peleton steril menunggu giliran tampil</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  {stageCounts['dp2'] || 0}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp2').map(team => {
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
                          Tunggu Steril
                        </span>
                      </div>

                      <div className="p-2.5 bg-amber-950/20 rounded-xl border border-amber-500/20 text-[11px] text-amber-300">
                        Personel lengkap & terverifikasi di DP 1. Menunggu dipanggil ke DP 3.
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                        <button
                          onClick={() => handleMoveStage(team, 'dp3')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-md"
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
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp3').map(team => {
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
        )}

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
                {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'finished' || (staging[t.id]?.stage || 'waiting') === 'checkout').map(team => {
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
    </div>
  );
}

