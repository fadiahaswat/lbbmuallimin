import React, { useState, useMemo, useEffect } from 'react';
import { appConfirm, appToast } from '../../utils/appDialog.js';
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
import { LOTTERY_CHEST_MAP, getChestNumberByLot, checkTeamVerificationEligibility } from '../../context/competitionHelpers.js';
import { HARI_H_SCHEDULE } from '../../data/scheduleMatrices.js';
import { formatImageUrl } from '../../services/sheetService.js';
import titleLogoImg from '../../assets/title-logo.png';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TechnicalMeetingView() {
  const {
    teams,
    settings,
    assignLotNumber,
    randomizeJenjangLotNumbers,
    clearJenjangLotNumbers,
    currentUser,
    role,
    isLocalhost
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canManageLottery = ['admin', 'superadmin'].includes(userRole);

  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilterTab, setTeamFilterTab] = useState('unassigned'); // 'unassigned' | 'all' | 'drawn'
  const [slotFilter, setSlotFilter] = useState('all'); // 'all' | 'empty' | 'filled'
  const [armedTeamId, setArmedTeamId] = useState(null); // Click-to-arm instant 2-click placement
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');
  const [draggedTeam, setDraggedTeam] = useState(null);
  const [dragOverLotNumber, setDragOverLotNumber] = useState(null);

  // Modal Pickers
  const [activeSlotPickerTeam, setActiveSlotPickerTeam] = useState(null);
  const [activeTeamPickerSlot, setActiveTeamPickerSlot] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

  // Reset armed team when switching jenjang or pressing Escape
  useEffect(() => {
    setArmedTeamId(null);
    setSlotFilter('all');
  }, [selectedJenjang]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setArmedTeamId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isSD = selectedJenjang === 'SD';

  // Tim yang sah untuk TM (status drawn atau verified lengkap; khusus localhost bypass kelengkapan agar semua data tampil)
  const eligibleTeams = useMemo(() => {
    if (isLocalhost) {
      return teams.filter(t => t.status !== 'rejected');
    }
    return teams.filter(t => {
      if (t.status === 'drawn') return true;
      if (t.status === 'verified') {
        const eligibility = checkTeamVerificationEligibility(t);
        return eligibility.isEligible;
      }
      return false;
    });
  }, [teams, isLocalhost]);

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
  const targetQuota = selectedJenjang === 'SD' ? (settings?.quotaSD || 18) : (settings?.quotaSMP || 18);
  const totalSlotsCount = Math.max(targetQuota, currentJenjangTeams.length);
  const percentComplete = totalCount > 0 ? Math.min(100, Math.round((drawnCount / totalCount) * 100)) : 0;

  const chestMapList = LOTTERY_CHEST_MAP[selectedJenjang] || [];
  const scheduleData = HARI_H_SCHEDULE[selectedJenjang] || [];

  const slots = useMemo(() => {
    return Array.from({ length: totalSlotsCount }, (_, i) => {
      const lotNumber = i + 1;
      const rawChestNumber = chestMapList[i] || getChestNumberByLot(selectedJenjang, lotNumber);
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
        session: sched.session || (i < 14 ? 'Sesi I (Pagi)' : 'Sesi II (Siang)')
      };
    });
  }, [totalSlotsCount, chestMapList, selectedJenjang, currentJenjangTeams, scheduleData]);

  const emptySlots = useMemo(() => slots.filter(s => !s.team), [slots]);
  const filledSlots = useMemo(() => slots.filter(s => !!s.team), [slots]);
  const armedTeam = useMemo(
    () => (armedTeamId ? currentJenjangTeams.find(t => t.id === armedTeamId && !t.lotNumber) || null : null),
    [armedTeamId, currentJenjangTeams]
  );
  const filteredSlots = useMemo(() => {
    if (slotFilter === 'empty') return emptySlots;
    if (slotFilter === 'filled') return filledSlots;
    return slots;
  }, [slots, emptySlots, filledSlots, slotFilter]);

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
      setArmedTeamId(null);
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

  const handleRandomizeCurrentJenjang = async () => {
    if (!canManageLottery) return;
    const unassignedCount = currentJenjangTeams.filter(t => !t.lotNumber).length;
    if (unassignedCount === 0) {
      appToast(`Seluruh peleton ${selectedJenjang} sudah terpasang di papan undian.`, { variant: 'info' });
      return;
    }
    const totalCount = currentJenjangTeams.length;
    const ok = await appConfirm(
      `Undi acak otomatis untuk ${unassignedCount} peleton ${selectedJenjang} yang belum terpasang?\n\n` +
      `Aturan:\n` +
      `1. Peleton yang sudah dipasang manual tetap dipertahankan\n` +
      `2. Slot diisi rapat dari #01 s.d. #${String(totalCount).padStart(2, '0')} (tanpa slot bolong)`,
      { title: 'Undi Acak Otomatis', confirmText: 'Undi Sekarang', variant: 'info' }
    );
    if (ok) {
      if (typeof randomizeJenjangLotNumbers === 'function') {
        randomizeJenjangLotNumbers(selectedJenjang);
      }
      setLotSuccessMsg(`${unassignedCount} peleton ${selectedJenjang} berhasil diundi otomatis.`);
      setTimeout(() => setLotSuccessMsg(''), 3500);
    }
  };

  const handleClearCurrentJenjang = async () => {
    if (!canManageLottery) return;
    const ok = await appConfirm(
      `Yakin ingin mengosongkan nomor undian seluruh peleton tingkat ${selectedJenjang}?`,
      { title: 'Kosongkan Papan Undian', confirmText: 'Kosongkan', variant: 'danger' }
    );
    if (ok) {
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
    <SimpaskorSidebarLayout
      activeMenu="tm"
      title="Pengundian Nomor Urut Tampil & Nomor Dada"
      subtitle="Gladi pengundian nomor tampil 36 peleton & distribusi nomor dada peserta"
      fullWidth
      hideHeader={true}
    >
      <div className="space-y-4 w-full pb-10">
        {/* MASTER HEADER + FLUSH DIVISION TABS (1 KARTU RINGKAS, TANPA BAR GANDA) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:px-6 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
            {/* Title */}
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CalendarCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                  Pengundian Nomor Urut Tampil &amp; Nomor Dada
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Technical Meeting • Tarik peleton ke slot urutan atau klik tombol pasang
                </p>
              </div>
            </div>

            {/* Right: Compact Progress + Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Compact Progress Telemetry */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
                <div className="space-y-1 min-w-[115px]">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Terpasang</span>
                    <span className="font-mono font-black text-slate-900">{drawnCount}/{totalCount}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
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
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black border ${
                  percentComplete === 100
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}>
                  {percentComplete}%
                </span>
              </div>

              {canManageLottery && unassignedTeams.length > 0 && (
                <button
                  type="button"
                  onClick={handleRandomizeCurrentJenjang}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-black transition-all active:scale-95 cursor-pointer"
                  title="Undi acak otomatis semua peleton jenjang ini"
                >
                  <Dice5 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Undi Acak</span>
                </button>
              )}

              {canManageLottery && drawnCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearCurrentJenjang}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  title="Kosongkan seluruh nomor undian peleton"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Cetak dan unduh rekapitulasi hasil undian TM ke file Excel (.csv)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>Cetak Excel</span>
              </button>
            </div>
          </div>

          {/* Dark Obsidian Division Stage Switcher: SD / MI vs SMP / MTs */}
          <div className="grid grid-cols-2 border-t border-slate-800 bg-slate-950 text-white">
            <button
              type="button"
              onClick={() => setSelectedJenjang('SD')}
              className={`relative py-3 px-4 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-r border-slate-800 ${
                selectedJenjang === 'SD'
                  ? 'bg-slate-900 text-white font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 font-bold'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${selectedJenjang === 'SD' ? 'bg-rose-500' : 'bg-slate-600'}`} />
              <span>SD / MI</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                selectedJenjang === 'SD' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {eligibleTeams.filter(t => t.jenjang === 'SD').length} Peleton
              </span>
              {selectedJenjang === 'SD' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedJenjang('SMP')}
              className={`relative py-3 px-4 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedJenjang === 'SMP'
                  ? 'bg-slate-900 text-white font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 font-bold'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${selectedJenjang === 'SMP' ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <span>SMP / MTs</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                selectedJenjang === 'SMP' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {eligibleTeams.filter(t => t.jenjang === 'SMP').length} Peleton
              </span>
              {selectedJenjang === 'SMP' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
            </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* -------------------------------------------------------- */}
          {/* LEFT COLUMN (5 COLS): POOL PELETON (ROSTER CALON UNDIAN) */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-white rounded-[24px] p-4 sm:p-5 border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.04)] space-y-3.5">
            {/* Panel Title & Count */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-[15px] font-black text-slate-900 tracking-tight">
                    Daftar Peleton
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSD
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                        : 'bg-blue-50 text-blue-700 border border-blue-200/70'
                    }`}
                  >
                    {selectedJenjang}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {canManageLottery
                    ? 'Klik peleton lalu klik slot di kanan, atau seret langsung'
                    : `Urutan validasi berkas awal (#1 – #${totalCount})`}
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F6F7F9] text-slate-600 border border-slate-200/80 whitespace-nowrap shrink-0 tabular-nums">
                <strong className="text-slate-950 font-black">{unassignedTeams.length}</strong> Sisa
              </span>
            </div>

            {/* Sub-Tabs Filter */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F6F7F9] rounded-xl border border-slate-200/60 text-xs font-semibold">
              {[
                { id: 'unassigned', label: 'Belum', fullLabel: 'Belum Diundi', count: unassignedTeams.length },
                { id: 'all', label: 'Semua', fullLabel: 'Semua', count: totalCount },
                { id: 'drawn', label: 'Sudah', fullLabel: 'Sudah Diundi', count: drawnCount },
              ].map((tab) => {
                const active = teamFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTeamFilterTab(tab.id)}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap ${
                      active
                        ? 'bg-white text-slate-950 font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="sm:hidden">{tab.label}</span>
                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        active ? 'text-slate-900 font-black' : 'text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search Field */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari sekolah, danton, atau kode registrasi..."
                className="w-full pl-9 pr-8 py-2 bg-[#F6F7F9] border border-slate-200/70 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Team Roster List */}
            <div className="space-y-1.5">
              {filteredLeftTeams.length === 0 ? (
                <div className="py-10 text-center bg-[#F6F7F9] rounded-2xl border border-dashed border-slate-200 p-5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-slate-800">
                    {teamFilterTab === 'unassigned'
                      ? 'Seluruh peleton sudah terpasang.'
                      : 'Peleton tidak ditemukan.'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {teamFilterTab === 'unassigned'
                      ? 'Periksa susunan urutan tampil pada papan di sisi kanan.'
                      : 'Coba kata kunci pencarian lain.'}
                  </p>
                </div>
              ) : (
                filteredLeftTeams.map((team) => {
                  const regIndex = sortedJenjangTeams.findIndex(t => t.id === team.id) + 1;
                  const isDrawn = !!team.lotNumber;
                  const isArmed = armedTeam?.id === team.id;
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

                  const handleCardClick = () => {
                    if (!canManageLottery || isDrawn || emptySlots.length === 0) return;
                    // On mobile (<1024px), open visual slot picker directly so user doesn't have to scroll
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setActiveSlotPickerTeam(team);
                      return;
                    }
                    setArmedTeamId(prev => (prev === team.id ? null : team.id));
                  };

                  return (
                    <div
                      key={team.id}
                      draggable={canManageLottery}
                      onDragStart={(e) => {
                        setArmedTeamId(null);
                        onDragStartTeam(e, team);
                      }}
                      onClick={handleCardClick}
                      className={`group/team px-3 py-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2.5 select-none ${
                        isArmed
                          ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-slate-950/15'
                          : isDrawn
                            ? 'bg-slate-50/70 border-slate-100 opacity-75'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                      } ${
                        canManageLottery && !isDrawn
                          ? 'cursor-pointer active:scale-[0.99]'
                          : canManageLottery
                            ? 'cursor-grab active:cursor-grabbing'
                            : 'cursor-default'
                      }`}
                    >
                      {/* Left: Drag Handle, Index, Logo & Info */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {canManageLottery && (
                          <div
                            className={`hidden sm:block shrink-0 ${
                              isArmed
                                ? 'text-slate-500'
                                : 'text-slate-300 group-hover/team:text-slate-500'
                            }`}
                            title="Seret ke slot urutan di kanan"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <span
                          className={`font-mono text-[10px] font-bold tabular-nums w-4 text-right shrink-0 ${
                            isArmed ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {String(regIndex).padStart(2, '0')}
                        </span>

                        {/* Logo / Monogram */}
                        <div
                          className={`w-9 h-9 rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden border ${
                            isArmed
                              ? 'bg-white border-white/20'
                              : 'bg-white border-slate-200/80'
                          }`}
                        >
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
                            <span className="font-black text-[11px] font-mono text-slate-700 uppercase">
                              {initials}
                            </span>
                          )}
                        </div>

                        {/* Team Details */}
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-xs sm:text-[12.5px] font-extrabold leading-snug truncate ${
                              isArmed ? 'text-white' : 'text-slate-900'
                            }`}
                            title={team.schoolName}
                          >
                            {team.schoolName}
                          </h3>
                          <p
                            className={`text-[10.5px] truncate mt-0.5 ${
                              isArmed ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {team.dantonName || 'Danton belum diisi'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Action */}
                      <div className="shrink-0 flex items-center gap-1">
                        {isDrawn ? (
                          <>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold tabular-nums text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>#{String(team.lotNumber).padStart(2, '0')}</span>
                            </span>
                            {canManageLottery && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnpairTeam(team.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Lepas peleton dari urutan tampil"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        ) : canManageLottery ? (
                          emptySlots.length === 0 ? (
                            <span className="text-[10.5px] text-slate-400 italic">Penuh</span>
                          ) : isArmed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10.5px] font-black whitespace-nowrap">
                              <span>Pilih Slot</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlotPickerTeam(team);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#F6F7F9] group-hover/team:bg-slate-900 text-slate-700 group-hover/team:text-white border border-slate-200/80 group-hover/team:border-slate-900 transition-all cursor-pointer whitespace-nowrap"
                              title="Buka grid pilihan slot urutan"
                            >
                              <LayoutGrid className="w-3 h-3 shrink-0" />
                              <span>Slot</span>
                            </button>
                          )
                        ) : null}
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
          <div className="lg:col-span-7 bg-white rounded-[24px] p-4 sm:p-5 border border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.04)] space-y-3.5">
            {/* Header & Arena Info */}
            <div className="flex flex-col gap-3 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-[15px] font-black text-slate-900 tracking-tight">
                    Papan Urutan Tampil
                  </h2>
                  <span
                    className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                      isSD
                        ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                        : 'bg-blue-50 text-blue-700 border-blue-200/80'
                    }`}
                  >
                    {isSD ? 'Arena 1 · Basket' : 'Arena 2 · Embung'}
                  </span>
                </div>

                {/* Ceremony Info Pill */}
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-800 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-full whitespace-nowrap">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>#06 – #10 Pasukan Upacara</span>
                </span>
              </div>

              {/* Slot Filter Bar + Quick Status */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1 p-1 bg-[#F6F7F9] rounded-xl border border-slate-200/60 text-[11px] font-semibold">
                  {[
                    { id: 'all', label: 'Semua', count: slots.length },
                    { id: 'empty', label: 'Kosong', count: emptySlots.length },
                    { id: 'filled', label: 'Terisi', count: filledSlots.length },
                  ].map((f) => {
                    const active = slotFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSlotFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 ${
                          active
                            ? 'bg-white text-slate-950 font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`font-mono text-[10px] tabular-nums ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                          {f.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Seret slot terisi ke slot lain untuk menukar urutan
                </span>
              </div>
            </div>

            {/* Active Armed Team Banner (Instant 1-Click Placement Mode) */}
            {armedTeam && canManageLottery && (
              <div className="rounded-xl bg-slate-950 text-white px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <p className="text-xs truncate">
                    <span className="text-slate-400">Pasang </span>
                    <strong className="font-extrabold text-white">{armedTeam.schoolName}</strong>
                    <span className="text-slate-400 hidden sm:inline"> — klik langsung slot di bawah</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setArmedTeamId(null)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-colors cursor-pointer shrink-0"
                >
                  Batal
                </button>
              </div>
            )}

            {/* 18 Slot Draw Targets */}
            <div className="space-y-1.5">
              {filteredSlots.length === 0 ? (
                <div className="py-12 text-center bg-[#F6F7F9] rounded-2xl border border-dashed border-slate-200 p-5">
                  <p className="text-xs font-bold text-slate-700">
                    {slotFilter === 'empty'
                      ? 'Seluruh slot urutan tampil sudah terisi.'
                      : 'Belum ada slot yang terisi.'}
                  </p>
                </div>
              ) : (
                filteredSlots.map((slot) => {
                  const isHovered = dragOverLotNumber === slot.lotNumber;
                  const assignedTeam = slot.team;
                  const isCeremonySlot = slot.lotNumber >= 6 && slot.lotNumber <= 10;
                  const isQuickAssignable = Boolean(canManageLottery && armedTeam);

                  const rawLogo = assignedTeam?.files?.schoolLogo?.url || assignedTeam?.file_logo_sekolah || assignedTeam?.logoUrl;
                  const logoSrc = rawLogo && rawLogo !== '#' && !rawLogo.startsWith('#')
                    ? formatImageUrl(rawLogo)
                    : null;

                  const initials = assignedTeam
                    ? assignedTeam.schoolName
                        .split(' ')
                        .filter(w => !['SD', 'MI', 'SMP', 'MTS', 'DAN', 'NEGERI', 'SWASTA'].includes(w.toUpperCase()))
                        .slice(0, 2)
                        .map(w => w[0])
                        .join('') || assignedTeam.schoolName.slice(0, 2).toUpperCase()
                    : '';

                  const handleSlotRowClick = () => {
                    if (!canManageLottery) return;
                    if (armedTeam) {
                      handlePairTeamToLot(armedTeam.id, slot.lotNumber);
                      return;
                    }
                    if (!assignedTeam && unassignedTeams.length > 0) {
                      setActiveTeamPickerSlot(slot);
                    }
                  };

                  return (
                    <div
                      key={slot.lotNumber}
                      onDragOver={(e) => onDragOverSlot(e, slot.lotNumber)}
                      onDragLeave={onDragLeaveSlot}
                      onDrop={(e) => onDropOnSlot(e, slot.lotNumber)}
                      onClick={handleSlotRowClick}
                      className={`group/slot rounded-xl border transition-all duration-150 px-3 py-2.5 flex items-center justify-between gap-3 ${
                        isCeremonySlot ? 'shadow-[inset_3px_0_0_0_#f59e0b]' : ''
                      } ${
                        isHovered
                          ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/25'
                          : isQuickAssignable && !assignedTeam
                            ? 'bg-amber-50/40 border-amber-300/80 hover:bg-amber-50 hover:border-amber-400 cursor-pointer'
                            : assignedTeam
                              ? 'bg-white border-slate-200/90 hover:border-slate-300'
                              : canManageLottery && unassignedTeams.length > 0
                                ? 'bg-[#F6F7F9]/70 border-slate-200/70 hover:bg-white hover:border-slate-300 cursor-pointer'
                                : 'bg-[#F6F7F9]/50 border-slate-200/60'
                      }`}
                    >
                      {/* Left: Integrated Lot + Bib Badge & Team/Empty Lane */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Unified Lot # + BIB Unit */}
                        <div className="inline-flex items-stretch rounded-lg overflow-hidden border border-slate-200/90 shadow-2xs shrink-0">
                          <span className="px-2.5 py-1.5 bg-slate-900 text-white font-mono font-black text-xs tabular-nums flex items-center justify-center min-w-[40px]">
                            #{String(slot.lotNumber).padStart(2, '0')}
                          </span>
                          <div className="px-2 py-1 bg-white flex flex-col items-center justify-center min-w-[44px]">
                            <span className="text-[7px] font-bold text-slate-400 font-mono tracking-wider leading-none">
                              BIB
                            </span>
                            <span className="text-[11.5px] font-mono font-black text-slate-900 tabular-nums leading-tight">
                              {slot.chestNumber}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Filled Team or Clean Empty Lane */}
                        <div className="flex-1 min-w-0">
                          {assignedTeam ? (
                            <div
                              draggable={canManageLottery}
                              onDragStart={(e) => {
                                e.stopPropagation();
                                setArmedTeamId(null);
                                onDragStartTeam(e, assignedTeam);
                              }}
                              onClick={(e) => {
                                if (!armedTeam) e.stopPropagation();
                              }}
                              className={`flex items-center gap-2.5 min-w-0 ${
                                canManageLottery ? 'cursor-grab active:cursor-grabbing' : ''
                              }`}
                            >
                              {canManageLottery && (
                                <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover/slot:text-slate-500 shrink-0 hidden sm:block" />
                              )}
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
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

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <h3
                                    className="font-extrabold text-xs sm:text-[13px] text-slate-900 leading-snug truncate"
                                    title={assignedTeam.schoolName}
                                  >
                                    {assignedTeam.schoolName}
                                  </h3>
                                  {isCeremonySlot && (
                                    <span
                                      className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 shrink-0 whitespace-nowrap"
                                      title="Wajib Mengikuti Upacara Pembukaan"
                                    >
                                      ★ Upacara
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                  {assignedTeam.dantonName || '-'}
                                  <span className="hidden sm:inline text-slate-300 mx-1.5">•</span>
                                  <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
                                    {assignedTeam.regCode}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <ArrowDownToLine
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isHovered || isQuickAssignable
                                      ? 'text-amber-600'
                                      : 'text-slate-400'
                                  }`}
                                />
                                <span
                                  className={`text-xs truncate ${
                                    isHovered
                                      ? 'font-bold text-slate-900'
                                      : isQuickAssignable
                                        ? 'font-bold text-amber-900'
                                        : 'font-medium text-slate-400 group-hover/slot:text-slate-600'
                                  }`}
                                >
                                  {isHovered
                                    ? 'Lepaskan peleton di sini'
                                    : isQuickAssignable
                                      ? `Pasang ${armedTeam.schoolName}`
                                      : 'Slot kosong'}
                                </span>
                              </div>

                              {isCeremonySlot && (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 shrink-0 whitespace-nowrap">
                                  ★ Upacara
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Time + Clean Action */}
                      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold tabular-nums text-slate-600 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-slate-400 hidden sm:inline shrink-0" />
                          <span>{slot.startTampil}</span>
                        </span>

                        {assignedTeam ? (
                          canManageLottery && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnpairTeam(assignedTeam.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Lepas peleton dari slot ini"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )
                        ) : canManageLottery && unassignedTeams.length > 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (armedTeam) {
                                handlePairTeamToLot(armedTeam.id, slot.lotNumber);
                              } else {
                                setActiveTeamPickerSlot(slot);
                              }
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                              isQuickAssignable
                                ? 'bg-slate-950 hover:bg-slate-800 text-white shadow-2xs'
                                : 'bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200/90 hover:border-slate-900'
                            }`}
                          >
                            {isQuickAssignable ? 'Pasang' : '+ Pilih'}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
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
