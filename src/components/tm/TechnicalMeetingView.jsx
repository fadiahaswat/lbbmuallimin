import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  Search,
  MapPin,
  GripVertical,
  RotateCcw,
  Dice5,
  UserCheck,
  LayoutGrid,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  ArrowDownToLine,
  Check,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE_INDUK } from '../../config.js';
import { LOTTERY_CHEST_MAP, checkTeamVerificationEligibility } from '../../context/competitionHelpers.js';
import { HARI_H_SCHEDULE } from '../../data/scheduleMatrices.js';
import { formatImageUrl } from '../../services/sheetService.js';
import titleLogoImg from '../../assets/title-logo.png';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TechnicalMeetingView() {
  const {
    teams,
    assignLotNumber,
    randomizeJenjangLotNumbers,
    clearJenjangLotNumbers,
    currentUser,
    role
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canManageLottery = ['admin', 'superadmin'].includes(userRole);

  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilterTab, setTeamFilterTab] = useState('unassigned'); // 'unassigned' | 'all' | 'drawn'
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');
  const [draggedTeam, setDraggedTeam] = useState(null);
  const [dragOverLotNumber, setDragOverLotNumber] = useState(null);

  // Modal Pickers
  const [activeSlotPickerTeam, setActiveSlotPickerTeam] = useState(null);
  const [activeTeamPickerSlot, setActiveTeamPickerSlot] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

  const isSD = selectedJenjang === 'SD';

  // Tim yang sah untuk TM (status drawn atau verified lengkap)
  const eligibleTeams = useMemo(() => {
    return teams.filter(t => {
      if (t.status === 'drawn') return true;
      if (t.status === 'verified') {
        const eligibility = checkTeamVerificationEligibility(t);
        return eligibility.isEligible;
      }
      return false;
    });
  }, [teams]);

  const currentJenjangTeams = useMemo(() => {
    return eligibleTeams.filter(t => t.jenjang === selectedJenjang);
  }, [eligibleTeams, selectedJenjang]);

  // Helper timestamp pendaftaran
  const getRegTimestamp = (team) => {
    const raw = team.registeredAt || team.createdAt || team.registrationDate || team.timestamp;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    return 0;
  };

  // Helper format jam pendaftaran
  const formatRegTime = (raw) => {
    if (!raw) return '-';
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return String(raw);
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${hours}.${mins} WIB`;
    } catch {
      return String(raw);
    }
  };

  // Tim diurutkan dari waktu pendaftaran awal (FCFS)
  const sortedJenjangTeams = useMemo(() => {
    return [...currentJenjangTeams].sort((a, b) => {
      const timeA = getRegTimestamp(a);
      const timeB = getRegTimestamp(b);
      if (timeA !== timeB) return timeA - timeB;
      return (a.regCode || a.id).localeCompare(b.regCode || b.id);
    });
  }, [currentJenjangTeams]);

  // Filter tim di kolom kiri
  const filteredLeftTeams = useMemo(() => {
    return sortedJenjangTeams.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        t.schoolName.toLowerCase().includes(q) ||
        t.regCode.toLowerCase().includes(q) ||
        (t.dantonName && t.dantonName.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (teamFilterTab === 'unassigned') return !t.lotNumber;
      if (teamFilterTab === 'drawn') return !!t.lotNumber;
      return true;
    });
  }, [sortedJenjangTeams, searchQuery, teamFilterTab]);

  const unassignedTeams = useMemo(() => currentJenjangTeams.filter(t => !t.lotNumber), [currentJenjangTeams]);
  const drawnCount = useMemo(() => currentJenjangTeams.filter(t => t.lotNumber).length, [currentJenjangTeams]);
  const totalCount = currentJenjangTeams.length;
  const totalSlotsCount = Math.max(18, currentJenjangTeams.length);
  const percentComplete = Math.round((drawnCount / totalSlotsCount) * 100);

  const chestMapList = LOTTERY_CHEST_MAP[selectedJenjang] || [];
  const scheduleData = HARI_H_SCHEDULE[selectedJenjang] || [];

  const slots = useMemo(() => {
    return Array.from({ length: totalSlotsCount }, (_, i) => {
      const lotNumber = i + 1;
      const rawChestNumber = chestMapList[i] || (selectedJenjang === 'SD' ? `${101 + i * 2}` : `${202 + i * 2}`);
      const assignedTeam = currentJenjangTeams.find(t => Number(t.lotNumber) === lotNumber);
      const sched = scheduleData[i] || {};

      return {
        lotNumber,
        chestNumber: rawChestNumber,
        team: assignedTeam || null,
        arena: sched.arena || (selectedJenjang === 'SD' ? 'Arena 1 (Basket)' : 'Arena 2 (Embung)'),
        readyBasecamp: sched.readyBasecamp || '-',
        callDP1: sched.callDP1 || '-',
        checkDP1: sched.checkDP1 || '-',
        enterDP2: sched.enterDP2 || '-',
        enterArena: sched.enterArena || '-',
        startTampil: sched.startTampil || '-',
        warningPeluit: sched.warningPeluit || '-',
        stopPeluit: sched.stopPeluit || '-',
        exitArena: sched.exitArena || '-',
        session: sched.session || (i < 12 ? 'Sesi I (Pagi)' : 'Sesi II (Siang)')
      };
    });
  }, [totalSlotsCount, chestMapList, selectedJenjang, currentJenjangTeams, scheduleData]);

  const emptySlots = useMemo(() => slots.filter(s => !s.team), [slots]);

  // Actions
  const handlePairTeamToLot = (teamId, targetLotNumber) => {
    if (!canManageLottery) return;
    const num = parseInt(targetLotNumber, 10);
    if (!isNaN(num) && num > 0) {
      const currentAssignedToTarget = currentJenjangTeams.find(t => Number(t.lotNumber) === num && t.id !== teamId);
      const movingTeam = currentJenjangTeams.find(t => t.id === teamId);
      const oldLotOfMovingTeam = movingTeam?.lotNumber ? Number(movingTeam.lotNumber) : null;

      if (currentAssignedToTarget) {
        if (oldLotOfMovingTeam) {
          assignLotNumber(currentAssignedToTarget.id, oldLotOfMovingTeam);
        } else {
          assignLotNumber(currentAssignedToTarget.id, null);
        }
      }
      assignLotNumber(teamId, num);
      setLotSuccessMsg(`Peleton resmi dipasangkan ke Urutan #${String(num).padStart(2, '0')}`);
      setTimeout(() => setLotSuccessMsg(''), 3000);
      setActiveSlotPickerTeam(null);
      setActiveTeamPickerSlot(null);
    }
  };

  const handleUnpairTeam = (teamId) => {
    if (!canManageLottery) return;
    assignLotNumber(teamId, null);
    setLotSuccessMsg(`Peleton dilepas dari urutan undian.`);
    setTimeout(() => setLotSuccessMsg(''), 2500);
  };

  const handleRandomizeCurrentJenjang = () => {
    if (!canManageLottery) return;
    if (window.confirm(`Undi acak otomatis semua peleton tingkat ${selectedJenjang} yang belum terpasang?`)) {
      if (typeof randomizeJenjangLotNumbers === 'function') {
        randomizeJenjangLotNumbers(selectedJenjang);
      }
      setLotSuccessMsg(`Seluruh peleton ${selectedJenjang} berhasil diundi otomatis.`);
      setTimeout(() => setLotSuccessMsg(''), 3500);
    }
  };

  const handleClearCurrentJenjang = () => {
    if (!canManageLottery) return;
    if (window.confirm(`Yakin ingin mengosongkan nomor undian seluruh peleton tingkat ${selectedJenjang}?`)) {
      if (typeof clearJenjangLotNumbers === 'function') {
        clearJenjangLotNumbers(selectedJenjang);
      }
      setLotSuccessMsg(`Papan undian ${selectedJenjang} telah dikosongkan.`);
      setTimeout(() => setLotSuccessMsg(''), 3000);
    }
  };

  // Ekspor Rekapitulasi Undian ke File Excel (.csv kompatibel penuh Microsoft Excel)
  const handleExportExcel = () => {
    const arenaName = isSD ? 'Arena 1 (Lapangan Basket)' : 'Arena 2 (Pelataran Embung)';
    let csvContent = '\uFEFF'; // UTF-8 BOM untuk Microsoft Excel
    csvContent += `REKAPITULASI HASIL PENGUNDIAN NOMOR URUT TAMPIL & NOMOR DADA (TM)\n`;
    csvContent += `LOMBA BARIS-BERBARIS MU'ALLIMIN 2027\n`;
    csvContent += `Jenjang: Tingkat ${selectedJenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}\n`;
    csvContent += `Lokasi Lomba: ${arenaName} - Minggu, 24 Januari 2027\n`;
    csvContent += `Waktu Undian TM: Sabtu, 9 Januari 2027\n\n`;

    // Kolom Header
    csvContent += 'No Urut Tampil,Nomor Dada,Nama Sekolah / Peleton,Nama Danton,Kode Registrasi,Sesi,Mulai Tampil (WIB),Status Upacara,Arena\n';

    // Baris Slot
    slots.forEach((s) => {
      const team = s.team;
      const school = team ? `"${team.schoolName.replace(/"/g, '""')}"` : '"[BELUM TERISI]"';
      const danton = team?.dantonName ? `"${team.dantonName.replace(/"/g, '""')}"` : '"-"';
      const regCode = team?.regCode ? `"${team.regCode}"` : '"-"';
      const ceremony = (s.lotNumber >= 6 && s.lotNumber <= 10) ? '"Wajib Pasukan Upacara"' : '"-"';
      const session = `"${s.session}"`;
      const tampilTime = `"${s.startTampil}"`;
      const arena = `"${s.arena}"`;

      csvContent += `${s.lotNumber},${s.chestNumber},${school},${danton},${regCode},${session},${tampilTime},${ceremony},${arena}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Rekap_Undian_TM_LBB_Muallimin_2027_${selectedJenjang}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Drag and Drop
  const onDragStartTeam = (e, team) => {
    setDraggedTeam(team);
    e.dataTransfer.setData('text/plain', JSON.stringify({ teamId: team.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOverSlot = (e, lotNumber) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverLotNumber !== lotNumber) {
      setDragOverLotNumber(lotNumber);
    }
  };

  const onDragLeaveSlot = (e) => {
    e.preventDefault();
    setDragOverLotNumber(null);
  };

  const onDropOnSlot = (e, targetLotNumber) => {
    e.preventDefault();
    setDragOverLotNumber(null);
    let team = draggedTeam;
    if (!team) {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) {
          const parsed = JSON.parse(raw);
          team = currentJenjangTeams.find(t => t.id === parsed.teamId);
        }
      } catch (err) {
        // ignore
      }
    }
    if (!team || !team.id) return;

    handlePairTeamToLot(team.id, targetLotNumber);
    setDraggedTeam(null);
  };

  return (
    <SimpaskorSidebarLayout activeMenu="tm" fullWidth>
      <div className="space-y-5 w-full pb-12">

        {/* ======================================================== */}
        {/* EXECUTIVE COMMAND HEADER (NO AI SLOP, HIGH PRESTIGE)     */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Top Metadata Bar */}
          <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
              {/* 1. Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
                <CalendarCheck className="w-5 h-5 text-amber-400" />
              </div>

              {/* 2. Logo Title */}
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin 2027"
                className="h-7 sm:h-8 w-auto object-contain shrink-0"
              />

              {/* Pemisah Halus */}
              <div className="hidden sm:block h-6 w-px bg-slate-300/80 shrink-0" />

              {/* 3. Baru Judulnya */}
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                Pengundian Nomor Urut Tampil & Nomor Dada
              </h1>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              {canManageLottery && (
                <button
                  type="button"
                  onClick={handleClearCurrentJenjang}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="Kosongkan seluruh nomor undian peleton"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Cetak dan unduh rekapitulasi hasil undian TM ke file Excel (.csv)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>Cetak Rekap Excel</span>
              </button>
            </div>
          </div>

          {/* Division Selector & Live Drawing Telemetry */}
          <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Division Tabs: SD vs SMP */}
            <div className="flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 w-fit">
              <button
                type="button"
                onClick={() => setSelectedJenjang('SD')}
                className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  selectedJenjang === 'SD'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selectedJenjang === 'SD' ? 'bg-rose-600 ring-4 ring-rose-100' : 'bg-slate-400'}`} />
                <span>Tingkat SD / MI</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                  selectedJenjang === 'SD' ? 'bg-rose-50 text-rose-800 border border-rose-200/80' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {eligibleTeams.filter(t => t.jenjang === 'SD').length} Peleton
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedJenjang('SMP')}
                className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  selectedJenjang === 'SMP'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selectedJenjang === 'SMP' ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-400'}`} />
                <span>Tingkat SMP / MTs</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                  selectedJenjang === 'SMP' ? 'bg-blue-50 text-blue-800 border border-blue-200/80' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {eligibleTeams.filter(t => t.jenjang === 'SMP').length} Peleton
                </span>
              </button>
            </div>

            {/* Drawing Telemetry & Progress */}
            <div className="flex items-center gap-5 sm:gap-6 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Status Pengundian
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    <strong className="font-black text-slate-950">{drawnCount}</strong> / {totalSlotsCount} Peleton
                  </span>
                </div>
                {/* Micro Progress Bar */}
                <div className="w-48 sm:w-56 h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      percentComplete === 100
                        ? 'bg-emerald-600'
                        : isSD ? 'bg-rose-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Status Chip */}
              <div className="shrink-0">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-black border ${
                  percentComplete === 100
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-white text-slate-800 border-slate-200/90 shadow-2xs'
                }`}>
                  {percentComplete}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {lotSuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-auto transition-all transform animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 shadow-xl border border-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1 leading-snug">{lotSuccessMsg}</span>
              <button
                type="button"
                onClick={() => setLotSuccessMsg('')}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TOURNAMENT DUAL-PANE DRAW CONSOLE                        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* -------------------------------------------------------- */}
          {/* LEFT COLUMN (5 COLS): POOL PELETON (ROSTER CALON UNDIAN) */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4 sticky lg:top-4">
            {/* Panel Title & Count */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <span>Daftar Peleton ({selectedJenjang})</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Diurutkan berdasarkan validasi berkas awal (#1 – #{totalCount})
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                {unassignedTeams.length} Belum Diundi
              </span>
            </div>

            {/* Sub-Tabs Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTeamFilterTab('unassigned')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center text-xs ${
                  teamFilterTab === 'unassigned'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Diundi ({unassignedTeams.length})
              </button>
              <button
                type="button"
                onClick={() => setTeamFilterTab('all')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center text-xs ${
                  teamFilterTab === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setTeamFilterTab('drawn')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center text-xs ${
                  teamFilterTab === 'drawn'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sudah ({drawnCount})
              </button>
            </div>

            {/* Quick Search Field */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama sekolah, danton, atau no registrasi..."
                className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Team Roster List */}
            <div className="space-y-2.5 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
              {filteredLeftTeams.length === 0 ? (
                <div className="py-12 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200 p-5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-slate-700">
                    {teamFilterTab === 'unassigned'
                      ? 'Seluruh peleton telah terpasang ke nomor urutan tampil.'
                      : 'Tidak ditemukan peleton yang sesuai dengan kata kunci.'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {teamFilterTab === 'unassigned' ? 'Periksa susunan jadwal pada papan urutan di sisi kanan.' : 'Silakan gunakan kata kunci pencarian yang lain.'}
                  </p>
                </div>
              ) : (
                filteredLeftTeams.map((team) => {
                  const regIndex = sortedJenjangTeams.findIndex(t => t.id === team.id) + 1;
                  const isDrawn = !!team.lotNumber;
                  const rawLogo = team.files?.schoolLogo?.url || team.file_logo_sekolah || team.logoUrl;
                  const logoSrc = rawLogo && rawLogo !== '#' && !rawLogo.startsWith('#')
                    ? formatImageUrl(rawLogo)
                    : null;

                  // Initials fallback
                  const initials = team.schoolName
                    .split(' ')
                    .filter(w => !['SD', 'MI', 'SMP', 'MTS', 'DAN', 'NEGERI', 'SWASTA'].includes(w.toUpperCase()))
                    .slice(0, 2)
                    .map(w => w[0])
                    .join('') || team.schoolName.slice(0, 2).toUpperCase();

                  return (
                    <div
                      key={team.id}
                      draggable={canManageLottery}
                      onDragStart={(e) => onDragStartTeam(e, team)}
                      className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 select-none ${
                        isDrawn
                          ? 'bg-slate-50/70 border-slate-200/70 opacity-65'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                      } ${canManageLottery ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                    >
                      {/* Left: Drag Handle, Registration Index, School Logo & Info */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {canManageLottery && (
                          <div
                            className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing shrink-0"
                            title="Tarik peleton ke slot urutan di sisi kanan"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                        )}

                        {/* Order Index Monospace */}
                        <span className="font-mono text-[10px] font-bold text-slate-400 w-5 text-right shrink-0">
                          #{String(regIndex).padStart(2, '0')}
                        </span>

                        {/* Logo / Monogram */}
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt={team.schoolName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="font-black text-xs font-mono text-slate-700 uppercase">
                              {initials}
                            </span>
                          )}
                        </div>

                        {/* Team Details */}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug break-words" title={team.schoolName}>
                            {team.schoolName}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                              <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{team.dantonName || 'Belum diisi'}</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {team.regCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Slot Status or Pick Button */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isDrawn ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>#{String(team.lotNumber).padStart(2, '0')}</span>
                            </span>
                            {canManageLottery && (
                              <button
                                type="button"
                                onClick={() => handleUnpairTeam(team.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Lepas peleton dari urutan tampil"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : canManageLottery && (
                          emptySlots.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Penuh</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveSlotPickerTeam(team)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                              title="Pilih nomor urut tampil peleton"
                            >
                              <span>Pilih Slot</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* RIGHT COLUMN (7 COLS): PAPAN URUTAN TAMPIL & NOMOR DADA  */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            {/* Header & Arena Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Papan Urutan Tampil Resmi ({selectedJenjang})
                  </h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    isSD
                      ? 'bg-rose-50 text-rose-800 border-rose-200/80'
                      : 'bg-blue-50 text-blue-800 border-blue-200/80'
                  }`}>
                    {isSD ? 'Arena 1 (Basket)' : 'Arena 2 (Embung)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tarik peleton dari kolom kiri atau klik slot untuk menentukan urutan tampil
                </p>
              </div>

              {/* Ceremony Badge Info */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-900 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Slot #06 – #10: Pasukan Upacara</span>
              </div>
            </div>

            {/* Table Header Columns */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
              <div className="col-span-3 text-left">Urutan & Bib</div>
              <div className="col-span-6 text-left">Peleton Terpasang</div>
              <div className="col-span-2 text-right">Jadwal Tampil</div>
              <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* 18 Slot Draw Targets */}
            <div className="space-y-2 max-h-[calc(100vh-290px)] overflow-y-auto pr-1">
              {slots.map((slot) => {
                const isHovered = dragOverLotNumber === slot.lotNumber;
                const assignedTeam = slot.team;
                const isCeremonySlot = slot.lotNumber >= 6 && slot.lotNumber <= 10;

                const rawLogo = assignedTeam?.files?.schoolLogo?.url || assignedTeam?.file_logo_sekolah || assignedTeam?.logoUrl;
                const logoSrc = rawLogo && rawLogo !== '#' && !rawLogo.startsWith('#')
                  ? formatImageUrl(rawLogo)
                  : null;

                const initials = assignedTeam ? assignedTeam.schoolName
                  .split(' ')
                  .filter(w => !['SD', 'MI', 'SMP', 'MTS', 'DAN', 'NEGERI', 'SWASTA'].includes(w.toUpperCase()))
                  .slice(0, 2)
                  .map(w => w[0])
                  .join('') || assignedTeam.schoolName.slice(0, 2).toUpperCase() : '';

                return (
                  <div
                    key={slot.lotNumber}
                    onDragOver={(e) => onDragOverSlot(e, slot.lotNumber)}
                    onDragLeave={onDragLeaveSlot}
                    onDrop={(e) => onDropOnSlot(e, slot.lotNumber)}
                    className={`rounded-xl border transition-all duration-150 p-2.5 sm:p-3 flex items-center gap-3 ${
                      isHovered
                        ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-400/30'
                        : assignedTeam
                        ? 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                        : 'bg-slate-50/40 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* 1. Urutan Tampil & Chest Bib Unit (Integrated Sports Bib) */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Lot Draw Order */}
                      <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 shadow-2xs">
                        #{String(slot.lotNumber).padStart(2, '0')}
                      </div>

                      {/* Chest Bib Number Badge */}
                      <div className="flex flex-col items-center justify-center px-2 py-0.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs shrink-0 min-w-[54px]">
                        <span className="text-[8px] font-bold text-slate-400 font-mono tracking-wider leading-none">
                          BIB
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-black text-slate-900 leading-tight">
                          {slot.chestNumber}
                        </span>
                      </div>
                    </div>

                    {/* 2. Middle: Team Receptacle (Filled or Clean Empty Receptacle) */}
                    <div className="flex-1 min-w-0">
                      {assignedTeam ? (
                        <div
                          draggable={canManageLottery}
                          onDragStart={(e) => onDragStartTeam(e, assignedTeam)}
                          className={`flex items-center justify-between gap-3 min-w-0 ${
                            canManageLottery ? 'cursor-grab active:cursor-grabbing' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {canManageLottery && (
                              <GripVertical className="w-3.5 h-3.5 text-slate-300 hover:text-slate-600 shrink-0" />
                            )}
                            {/* School Logo */}
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                              {logoSrc ? (
                                <img
                                  src={logoSrc}
                                  alt={assignedTeam.schoolName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="font-black text-[10px] font-mono text-slate-700 uppercase">
                                  {initials}
                                </span>
                              )}
                            </div>

                            {/* School & Danton */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug break-words" title={assignedTeam.schoolName}>
                                  {assignedTeam.schoolName}
                                </h3>
                                {isCeremonySlot && (
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 shrink-0" title="Wajib Mengikuti Upacara Pembukaan">
                                    ★ Upacara
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="font-medium text-slate-700">Danton: {assignedTeam.dantonName || '-'}</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-mono text-[10px] text-slate-400">{assignedTeam.regCode}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            if (canManageLottery && unassignedTeams.length > 0) {
                              setActiveTeamPickerSlot(slot);
                            }
                          }}
                          className={`py-2 px-3 rounded-lg border border-dashed transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isHovered
                              ? 'border-slate-500 bg-slate-100 text-slate-900 font-bold'
                              : 'border-slate-300/80 hover:border-slate-400 bg-white/60 hover:bg-white text-slate-500'
                          }`}
                          title={canManageLottery ? "Klik untuk memilih peleton atau seret peleton ke sini" : undefined}
                        >
                          <div className="flex items-center gap-1.5 text-xs truncate">
                            <ArrowDownToLine className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {isHovered ? 'Lepaskan Peleton di Sini' : 'Slot Kosong — Pasangkan Peleton'}
                            </span>
                          </div>

                          {isCeremonySlot && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 shrink-0">
                              ★ Pasukan Upacara
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 3. Schedule Time (WIB) */}
                    <div className="text-right shrink-0 whitespace-nowrap min-w-[68px] sm:min-w-[76px]">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">
                        Mulai Tampil
                      </span>
                      <span className="font-mono font-bold text-xs text-slate-900 mt-0.5 block">
                        {slot.startTampil}
                      </span>
                    </div>

                    {/* 4. Action Button */}
                    <div className="shrink-0 flex items-center justify-end min-w-[50px]">
                      {assignedTeam ? (
                        canManageLottery && (
                          <button
                            type="button"
                            onClick={() => handleUnpairTeam(assignedTeam.id)}
                            className="px-2 py-1 rounded text-[11px] font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Lepas peleton dari slot ini"
                          >
                            Lepas
                          </button>
                        )
                      ) : (
                        canManageLottery && unassignedTeams.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setActiveTeamPickerSlot(slot)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer active:scale-95"
                            title="Pilih peleton untuk slot ini"
                          >
                            + Pasang
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-300 font-mono">-</span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: VISUAL SLOT PICKER (UNTUK PELETON MEMILIH SLOT)  */}
      {/* ======================================================== */}
      {activeSlotPickerTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    PEMILIHAN SLOT URUTAN
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">
                    JENJANG {selectedJenjang}
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base text-slate-900 mt-0.5 leading-snug break-words">
                  {activeSlotPickerTeam.schoolName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSlotPickerTeam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Header Legend */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Pilih salah satu nomor undian yang masih tersedia:
              </span>
              <span className="font-mono font-bold text-slate-700">
                {emptySlots.length} Tersedia
              </span>
            </div>

            {/* Slots Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1">
              {emptySlots.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold">
                  Seluruh slot urutan tampil sudah terisi penuh.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {emptySlots.map((s) => {
                    const isCeremony = s.lotNumber >= 6 && s.lotNumber <= 10;
                    return (
                      <button
                        key={s.lotNumber}
                        type="button"
                        onClick={() => handlePairTeamToLot(activeSlotPickerTeam.id, s.lotNumber)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/80 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs active:scale-95 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                            URUTAN
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-700 px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                            BIB: {s.chestNumber}
                          </span>
                        </div>

                        <div className="my-2 flex items-baseline justify-between">
                          <span className="font-mono font-black text-2xl text-slate-900 group-hover:text-slate-950">
                            #{String(s.lotNumber).padStart(2, '0')}
                          </span>
                          {isCeremony && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80">
                              ★ Upacara
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono border-t border-slate-100 pt-1.5 flex items-center justify-between">
                          <span>Mulai Tampil:</span>
                          <span className="font-bold text-slate-800">{s.startTampil}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSlotPickerTeam(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TEAM PICKER (UNTUK SLOT KOSONG MEMILIH PELETON)  */}
      {/* ======================================================== */}
      {activeTeamPickerSlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    PASANGKAN PELETON
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">
                    BIB {activeTeamPickerSlot.chestNumber}
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>Urutan Tampil #{String(activeTeamPickerSlot.lotNumber).padStart(2, '0')}</span>
                  {activeTeamPickerSlot.lotNumber >= 6 && activeTeamPickerSlot.lotNumber <= 10 && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      ★ Wajib Upacara
                    </span>
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTeamPickerSlot(null);
                  setModalSearch('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-3 bg-slate-50 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Ketik nama sekolah, danton, atau no registrasi..."
                  autoFocus
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 text-slate-900"
                />
              </div>
            </div>

            {/* Available Teams List */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
              {unassignedTeams
                .filter(t => !modalSearch || t.schoolName.toLowerCase().includes(modalSearch.toLowerCase()) || (t.dantonName && t.dantonName.toLowerCase().includes(modalSearch.toLowerCase())))
                .map((team) => {
                  const rawLogo = team.files?.schoolLogo?.url || team.file_logo_sekolah || team.logoUrl;
                  const logoSrc = rawLogo && rawLogo !== '#' && !rawLogo.startsWith('#')
                    ? formatImageUrl(rawLogo)
                    : null;

                  const initials = team.schoolName
                    .split(' ')
                    .filter(w => !['SD', 'MI', 'SMP', 'MTS', 'DAN', 'NEGERI', 'SWASTA'].includes(w.toUpperCase()))
                    .slice(0, 2)
                    .map(w => w[0])
                    .join('') || team.schoolName.slice(0, 2).toUpperCase();

                  return (
                    <div
                      key={team.id}
                      onClick={() => {
                        handlePairTeamToLot(team.id, activeTeamPickerSlot.lotNumber);
                        setModalSearch('');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                          {logoSrc ? (
                            <img src={logoSrc} alt={team.schoolName} className="w-full h-full object-contain" />
                          ) : (
                            <span className="font-black text-xs font-mono text-slate-700 uppercase">
                              {initials}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug break-words">{team.schoolName}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {team.regCode} • Danton: <span className="font-semibold text-slate-700">{team.dantonName || '-'}</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 shrink-0">
                        Pasangkan
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveTeamPickerSlot(null);
                  setModalSearch('');
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </SimpaskorSidebarLayout>
  );
}
