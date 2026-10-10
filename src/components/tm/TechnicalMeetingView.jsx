import React, { useState } from 'react';
import {
  CalendarCheck,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  Download,
  Search,
  ExternalLink,
  Shield,
  Crown,
  FileText,
  MapPin,
  Sparkles,
  GripVertical,
  XCircle,
  Hash,
  Tag,
  LayoutGrid,
  Table as TableIcon,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE_INDUK, DOWNLOADS } from '../../config.js';
import { LOTTERY_CHEST_MAP, getChestNumberByLot } from '../../context/competitionHelpers.js';
import { HARI_H_SCHEDULE } from '../../data/scheduleMatrices.js';
import { formatImageUrl } from '../../services/sheetService.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TechnicalMeetingView() {
  const {
    teams,
    assignLotNumber,
    currentUser,
    role,
    setActiveView
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canManageLottery = ['admin', 'superadmin'].includes(userRole);

  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');
  const [draggedTeam, setDraggedTeam] = useState(null); // team being dragged
  const [dragOverLotNumber, setDragOverLotNumber] = useState(null); // slot being hovered

  // Teams eligible for TM (terdaftar & terverifikasi)
  const eligibleTeams = teams.filter(t => ['registered', 'verified', 'drawn'].includes(t.status));
  const currentJenjangTeams = eligibleTeams.filter(t => t.jenjang === selectedJenjang);

  // Tim yang belum mendapatkan nomor undian
  const unassignedTeams = currentJenjangTeams.filter(t => !t.lotNumber && (
    t.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.dantonName && t.dantonName.toLowerCase().includes(searchQuery.toLowerCase()))
  ));

  const drawnCount = currentJenjangTeams.filter(t => t.lotNumber).length;
  const totalCount = currentJenjangTeams.length;

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Daftar total slot nomor undian & dada resmi (kuota 18 per jenjang)
  const totalSlotsCount = Math.max(18, currentJenjangTeams.length);
  const chestMapList = LOTTERY_CHEST_MAP[selectedJenjang] || [];
  const scheduleData = HARI_H_SCHEDULE[selectedJenjang] || [];

  const slots = Array.from({ length: totalSlotsCount }, (_, i) => {
    const lotNumber = i + 1;
    const rawChestNumber = chestMapList[i] || `${selectedJenjang === 'SD' ? 100 + lotNumber : 200 + lotNumber}`;
    const chestNumber = rawChestNumber;
    const assignedTeam = currentJenjangTeams.find(t => Number(t.lotNumber) === lotNumber);
    const sched = scheduleData[i] || {};

    return {
      lotNumber,
      chestNumber,
      rawChestNumber,
      team: assignedTeam || null,
      category: sched.category || (selectedJenjang === 'SD' ? 'SD/MI Sederajat' : 'SMP/MTs Sederajat'),
      arena: sched.arena || (selectedJenjang === 'SD' ? 'Arena 1 (Lap. Basket)' : 'Arena 2 (Pelataran Embung)'),
      readyBasecamp: sched.readyBasecamp || '-',
      callDP1: sched.callDP1 || '-',
      checkDP1: sched.checkDP1 || '-',
      enterDP2: sched.enterDP2 || '-',
      enterArena: sched.enterArena || '-',
      startTampil: sched.startTampil || '-',
      warningPeluit: sched.warningPeluit || '-',
      stopPeluit: sched.stopPeluit || '-',
      exitArena: sched.exitArena || '-',
      returnBadge: sched.returnBadge || '-',
      session: sched.session || (i < 13 ? 'Sesi I (Pagi)' : 'Sesi II (Siang)')
    };
  });

  const handlePairTeamToLot = (teamId, targetLotNumber) => {
    if (!canManageLottery) return;
    const num = parseInt(targetLotNumber, 10);
    if (!isNaN(num) && num > 0) {
      // Jika slot target sudah ada tim lain, kita tukar atau lepas tim lama
      const currentAssignedToTarget = currentJenjangTeams.find(t => Number(t.lotNumber) === num && t.id !== teamId);
      const movingTeam = currentJenjangTeams.find(t => t.id === teamId);
      const oldLotOfMovingTeam = movingTeam?.lotNumber ? Number(movingTeam.lotNumber) : null;

      if (currentAssignedToTarget) {
        // Swap jika moving team sudah punya lot
        if (oldLotOfMovingTeam) {
          assignLotNumber(currentAssignedToTarget.id, oldLotOfMovingTeam);
        } else {
          assignLotNumber(currentAssignedToTarget.id, null);
        }
      }
      assignLotNumber(teamId, num);
      setLotSuccessMsg(`Berhasil memasangkan peleton ke Urutan #${String(num).padStart(2, '0')}!`);
      setTimeout(() => setLotSuccessMsg(''), 3000);
    }
  };

  const handleUnpairTeam = (teamId) => {
    if (!canManageLottery) return;
    assignLotNumber(teamId, null);
    setLotSuccessMsg(`Peleton berhasil dicopot dari urutan tampil.`);
    setTimeout(() => setLotSuccessMsg(''), 2500);
  };

  // Drag and drop event handlers (dragging a school / team)
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

  const handlePrintBeritaAcaraTM = () => {
    window.print();
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="tm"
      title="Technical Meeting & Undian Tampil"
      subtitle="Manajemen pengundian nomor urut tampil peleton & slot waktu uji coba lapangan"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintBeritaAcaraTM}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Rekap Hasil Pengundian TM"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Rekap Undian</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Info Banner TM */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-wider">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Tahap 2: Pertemuan Teknis & Undian</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Technical Meeting & Pengundian Nomor Tampil
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Penetapan nomor dada, urutan tampil arena, validasi fisik berkas, serta pengesahan kesepakatan tata tertib lomba LBB Mu'allimin 2027.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Clock className="w-4 h-4" />
                <span>{EVENT.TECHNICAL_MEETING_FULL_DATE} • {EVENT.TECHNICAL_MEETING_TIME_RANGE}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate max-w-[220px]">{VENUE_INDUK.NAME}</span>
              </div>
              <a
                href={EVENT.TECHNICAL_MEETING_MAPS_URL || "https://maps.app.goo.gl/8tSQHpribqPXTSA79"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-300 hover:text-white underline pt-1"
              >
                <span>Buka Petunjuk Rute Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {lotSuccessMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{lotSuccessMsg}</span>
          </div>
        )}

        {/* Jenjang Selector & Lottery Control Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Tab SD vs SMP */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setSelectedJenjang('SD')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SD'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SD / MI ({eligibleTeams.filter(t => t.jenjang === 'SD').length} Peleton)
              </button>
              <button
                type="button"
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SMP'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SMP / MTs ({eligibleTeams.filter(t => t.jenjang === 'SMP').length} Peleton)
              </button>
            </div>

            {!canManageLottery && (
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                Mode Pantau Undian (Read-Only)
              </span>
            )}
          </div>

          {/* Progress Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Peleton Lolos</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{totalCount} Tim</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Sudah Dapat Nomor</span>
              <span className="text-2xl font-black text-purple-900 font-mono">{drawnCount} Tim</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Status Pengundian</span>
              <span className="text-sm font-black text-emerald-900 block mt-1">
                {drawnCount === totalCount && totalCount > 0 ? 'Lengkap & Sah' : 'Menunggu Pengundian'}
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari sekolah, nama komandan (danton), atau kode pendaftaran..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none transition-all"
            />
          </div>

          {/* STACKED DUAL BOARD: 1. ATAS = DAFTAR PELETON BELUM TAMPIL, 2. BAWAH = MATRIKS JADWAL RESMI */}
          <div className="space-y-6 pt-2">
            
            {/* 1. DOCK / DAFTAR SEKOLAH YANG BELUM MENDAPATKAN NOMOR (BAGIAN ATAS) */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                      Peleton Belum Tampil
                    </h3>
                    <p className="text-[10px] text-slate-400">Tarik kartu sekolah ke baris slot nomor di tabel jadwal bawah</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {unassignedTeams.length} Tim Tersisa
                </span>
              </div>

              {/* Grid Peleton Draggable Cards */}
              {unassignedTeams.length === 0 ? (
                <div className="p-4 sm:p-5 text-center bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-800">Semua Peleton Terpasang!</p>
                    <p className="text-[10px] text-slate-500">Seluruh tim {selectedJenjang} sudah memiliki urutan tampil & nomor dada di matriks jadwal.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                  {unassignedTeams.map(team => {
                    const rawLogo = team.files?.schoolLogo?.url || team.file_logo_sekolah || team.logoUrl;
                    const logoSrc = rawLogo && rawLogo !== '#' && !rawLogo.startsWith('#')
                      ? formatImageUrl(rawLogo)
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=0b63ce&color=fff&bold=true`;

                    return (
                      <div
                        key={team.id}
                        draggable={canManageLottery}
                        onDragStart={(e) => onDragStartTeam(e, team)}
                        className={`p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all select-none flex flex-col justify-between gap-3 ${
                          canManageLottery
                            ? 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5'
                            : 'cursor-default'
                        }`}
                      >
                        {/* Baris 1: Logo, Nama Peleton & Danton */}
                        <div className="flex items-start gap-3">
                          {canManageLottery && (
                            <div className="text-slate-300 hover:text-blue-600 shrink-0 cursor-grab active:cursor-grabbing mt-1" title="Tarik kartu ke tabel jadwal di bawah">
                              <GripVertical className="w-4 h-4" />
                            </div>
                          )}

                          {/* Logo Sekolah */}
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                            <img
                              src={logoSrc}
                              alt={team.schoolName}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=0b63ce&color=fff&bold=true`;
                              }}
                            />
                          </div>

                          {/* Info Nama Sekolah & Danton */}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-slate-900 truncate tracking-tight" title={team.schoolName}>
                              {team.schoolName}
                            </h4>
                            
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200/70 text-[11px] font-bold">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="text-[10px] uppercase font-bold text-blue-700">Danton:</span>
                                <span className="font-black text-slate-900 truncate max-w-[130px] sm:max-w-[170px]">
                                  {team.dantonName || '-'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Baris 2: Dropdown Urutan Tampil (Rapi, Terpisah & Mudah) */}
                        {canManageLottery && (
                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-500 shrink-0">
                              Urutan Tampil:
                            </span>

                            <div
                              className="relative flex-1 max-w-[170px]"
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <select
                                defaultValue=""
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val >= 1 && val <= totalSlotsCount) {
                                    handlePairTeamToLot(team.id, val);
                                  }
                                }}
                                className="w-full h-8 pl-2.5 pr-7 bg-blue-50/70 hover:bg-blue-100/70 focus:bg-white text-blue-950 font-black text-xs border border-blue-200 hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none cursor-pointer transition-all shadow-2xs appearance-none truncate"
                                title="Pilih nomor urutan tampil"
                              >
                                <option value="" disabled>Pilih Urutan...</option>
                                {slots.map((s) => (
                                  <option key={s.lotNumber} value={s.lotNumber}>
                                    Urutan {s.lotNumber} (No. {s.chestNumber}){s.team ? ` - Terisi: ${s.team.schoolName}` : ''}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-blue-600 absolute right-2 top-2 pointer-events-none" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. DAFTAR URUTAN TAMPIL & NOMOR DADA (BAGIAN BAWAH - FULL WIDTH) */}
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                      Matriks Jadwal & Urutan Tampil Resmi
                    </h3>
                    <p className="text-[10px] text-slate-400">Tarik sekolah dari daftar di atas dan lepaskan ke baris nomor dada di bawah</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                    {drawnCount} / {totalSlotsCount} Peleton Terpasang
                  </span>
                </div>
              </div>

              {/* TABLE VIEW (PERSIS SESUAI MASTER SPREADSHEET USER) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto max-h-[680px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#0b63ce] text-white select-none">
                      <tr className="text-[11px] font-black uppercase tracking-tight divide-x divide-blue-500/40 border-b border-blue-600">
                        <th className="py-3 px-3 min-w-[120px] text-center whitespace-nowrap">No Urut Dada</th>
                        <th className="py-3 px-3 min-w-[180px] whitespace-nowrap">Sekolah / Peleton</th>
                        <th className="py-3 px-3 min-w-[110px] text-center whitespace-nowrap">Kesiapan di Basecamp</th>
                        <th className="py-3 px-3 min-w-[110px] text-center whitespace-nowrap">Panggilan Masuk DP 1</th>
                        <th className="py-3 px-3 min-w-[130px] text-center whitespace-nowrap">Pemeriksaan Fisik DP 1</th>
                        <th className="py-3 px-3 min-w-[130px] text-center whitespace-nowrap">Masuk DP 2 (Holding Area)</th>
                        <th className="py-3 px-3 min-w-[100px] text-center whitespace-nowrap">Masuk Arena Lomba</th>
                        <th className="py-3 px-3 min-w-[120px] text-center whitespace-nowrap">Penghormatan Awal (Start Lomba)</th>
                        <th className="py-3 px-3 min-w-[130px] text-center whitespace-nowrap">Peluit Peringatan (Mnt ke-8)</th>
                        <th className="py-3 px-3 min-w-[130px] text-center whitespace-nowrap">Maks Tampil (Stop Peluit 2x)</th>
                        <th className="py-3 px-3 min-w-[100px] text-center whitespace-nowrap">Keluar Arena Lomba</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {slots.map((slot) => {
                        const isHovered = dragOverLotNumber === slot.lotNumber;
                        const assignedTeam = slot.team;

                        return (
                          <tr
                            key={slot.lotNumber}
                            onDragOver={(e) => onDragOverSlot(e, slot.lotNumber)}
                            onDragLeave={onDragLeaveSlot}
                            onDrop={(e) => onDropOnSlot(e, slot.lotNumber)}
                            className={`transition-all divide-x divide-slate-100 ${
                              isHovered
                                ? 'bg-blue-100/90 ring-2 ring-blue-500 font-bold'
                                : assignedTeam
                                ? 'bg-blue-50/20 hover:bg-blue-50/50'
                                : 'hover:bg-slate-50/80'
                            }`}
                          >
                            {/* 1. No Urut Dada */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span className="inline-flex items-center justify-center font-mono font-black text-base sm:text-lg px-3.5 py-1 rounded-xl bg-blue-50 text-blue-900 border-2 border-blue-300 shadow-2xs">
                                {slot.chestNumber}
                              </span>
                            </td>

                            {/* 2. Sekolah / Peleton (Dropzone & Drag Target) */}
                            <td className="py-2 px-3 min-w-[210px]">
                              {assignedTeam ? (
                                <div
                                  draggable={canManageLottery}
                                  onDragStart={(e) => onDragStartTeam(e, assignedTeam)}
                                  className="flex items-center justify-between gap-2 p-1.5 bg-white border border-blue-200 rounded-xl shadow-2xs group"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {canManageLottery && (
                                      <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 cursor-grab active:cursor-grabbing" />
                                    )}
                                    {/* Logo Peleton */}
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                                      <img
                                        src={
                                          (assignedTeam.files?.schoolLogo?.url || assignedTeam.file_logo_sekolah || assignedTeam.logoUrl)
                                            ? formatImageUrl(assignedTeam.files?.schoolLogo?.url || assignedTeam.file_logo_sekolah || assignedTeam.logoUrl)
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedTeam.schoolName)}&background=0b63ce&color=fff&bold=true`
                                        }
                                        alt={assignedTeam.schoolName}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedTeam.schoolName)}&background=0b63ce&color=fff&bold=true`;
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-black text-slate-900 text-xs truncate" title={assignedTeam.schoolName}>
                                        {assignedTeam.schoolName}
                                      </div>
                                      <div className="text-[10px] text-blue-900 font-bold truncate">
                                        Danton: <span className="font-black text-slate-900">{assignedTeam.dantonName || '-'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {canManageLottery && (
                                    <button
                                      type="button"
                                      onClick={() => handleUnpairTeam(assignedTeam.id)}
                                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                                      title="Copot dari urutan ini"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className={`py-2 px-2.5 rounded-xl border-2 border-dashed text-center transition-all ${
                                  isHovered
                                    ? 'border-blue-600 bg-blue-100 text-blue-900 font-bold scale-[1.02]'
                                    : 'border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600'
                                }`}>
                                  <span className="text-[10px] font-bold">
                                    {isHovered ? '⚡ Drop Peleton Di Sini!' : '+ Tarik Peleton ke Sini'}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* 3. Kesiapan di Basecamp */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {slot.readyBasecamp}
                            </td>

                            {/* 6. Panggilan Masuk DP 1 */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {slot.callDP1}
                            </td>

                            {/* 7. Pemeriksaan Fisik DP 1 */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {slot.checkDP1}
                            </td>

                            {/* 8. Masuk DP 2 (Holding Area) */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {slot.enterDP2}
                            </td>

                            {/* 9. Masuk Arena Lomba */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] font-bold text-slate-800">
                              {slot.enterArena}
                            </td>

                            {/* 10. Penghormatan Awal (Start Lomba) */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] font-bold text-slate-800">
                              {slot.startTampil}
                            </td>

                            {/* 11. Peluit Peringatan */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-amber-700 font-semibold">
                              {slot.warningPeluit}
                            </td>

                            {/* 12. Maks Tampil (Stop Peluit 2x) */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-rose-700 font-black">
                              {slot.stopPeluit}
                            </td>

                            {/* 11. Keluar Arena Lomba */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {slot.exitArena}
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
        </div>

        {/* Berkas & Regulasi Hasil TM */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Dokumen Hasil Kesepakatan Technical Meeting
              </h3>
              <p className="text-xs text-slate-500">
                Dokumen resmi yang disepakati oleh seluruh perwakilan pembina dan official kontingen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {DOWNLOADS.map(doc => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-700 font-bold shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{doc.size}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
