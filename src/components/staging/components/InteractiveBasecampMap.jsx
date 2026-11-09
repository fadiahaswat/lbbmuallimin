import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  DoorOpen,
  X,
  Search,
  Layers,
  TreeDeciduous,
  ArrowUpDown,
  Lock,
  Sparkles,
  Users,
  Droplets,
  Coffee,
  FlaskConical,
  Briefcase
} from 'lucide-react';
import { FLOORS_CONFIG, getAllRoomsFlat } from '../../../data/basecampFloorplanData.js';

export default function InteractiveBasecampMap({
  teams = [],
  staging = {},
  selectedTeamId = null,
  onSelectTeam = null,
  defaultFloor = 1,
  isPublicView = false
}) {
  const [selectedFloorNum, setSelectedFloorNum] = useState(defaultFloor);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Active Floor Data
  const currentFloor = useMemo(() => {
    return FLOORS_CONFIG.find(f => f.floor === selectedFloorNum) || FLOORS_CONFIG[0];
  }, [selectedFloorNum]);

  // Helper cek status peleton dari staging
  const getTeamStaging = (teamId) => staging?.[teamId] || staging?.basecamp?.[teamId] || null;

  const isCheckedIn = (teamId) => {
    const st = getTeamStaging(teamId);
    return Boolean(st?.checkedIn || st?.basecampLogistics?.ktpDeposited || (st?.stage && st.stage !== 'waiting'));
  };

  const isCheckedOut = (teamId) => {
    const st = getTeamStaging(teamId);
    return Boolean(st?.checkedOut || st?.stage === 'checkout' || st?.basecampLogistics?.ktpReturned);
  };

  const getCheckInTime = (teamId) => {
    const st = getTeamStaging(teamId);
    return st?.checkedInAt || st?.basecampLogistics?.checkedInAt || '06.30 WIB';
  };

  const sdTeams = useMemo(() => teams.filter(t => t.jenjang === 'SD'), [teams]);
  const smpTeams = useMemo(() => teams.filter(t => t.jenjang === 'SMP'), [teams]);

  // Map semua ruangan dengan status tim
  const roomsWithMetadata = useMemo(() => {
    let classBasecampIndex = 0;

    return getAllRoomsFlat().map(room => {
      let assignedTeam = null;

      if (room.isBasecampCandidate) {
        assignedTeam = teams.find(t => {
          const st = getTeamStaging(t.id);
          const rName = st?.basecamp?.roomName || st?.roomName || t.basecampNumber || '';
          return rName && (
            rName.trim().toUpperCase() === room.code.toUpperCase() ||
            rName.trim().toUpperCase() === room.name.toUpperCase() ||
            rName.trim().toUpperCase().includes(room.code.toUpperCase())
          );
        });

        if (!assignedTeam && teams.length > 0) {
          if (room.floor === 1 && sdTeams[classBasecampIndex % Math.max(1, sdTeams.length)]) {
            assignedTeam = sdTeams[classBasecampIndex % sdTeams.length];
          } else if (room.floor >= 2 && smpTeams[(classBasecampIndex - sdTeams.length) >= 0 ? (classBasecampIndex - sdTeams.length) % Math.max(1, smpTeams.length) : 0]) {
            assignedTeam = smpTeams[(classBasecampIndex - sdTeams.length) % Math.max(1, smpTeams.length)];
          }
        }
        classBasecampIndex++;
      }

      const teamCheckedIn = assignedTeam ? isCheckedIn(assignedTeam.id) : false;
      const teamCheckedOut = assignedTeam ? isCheckedOut(assignedTeam.id) : false;

      let status = 'empty';
      if (teamCheckedOut) status = 'cleared';
      else if (teamCheckedIn) status = 'occupied';

      return {
        ...room,
        team: assignedTeam || null,
        status,
        isCheckedIn: teamCheckedIn,
        isCheckedOut: teamCheckedOut,
        checkInTime: assignedTeam ? getCheckInTime(assignedTeam.id) : null,
      };
    });
  }, [teams, staging, sdTeams, smpTeams]);

  // Ruangan lantai saat ini
  const currentFloorRooms = useMemo(() => {
    return roomsWithMetadata.filter(r => r.floor === selectedFloorNum);
  }, [roomsWithMetadata, selectedFloorNum]);

  // Statistik okupansi lantai aktif
  const floorStats = useMemo(() => {
    const basecampRooms = currentFloorRooms.filter(r => r.isBasecampCandidate);
    let occupied = 0;
    let cleared = 0;
    let waiting = 0;

    basecampRooms.forEach(r => {
      if (r.status === 'cleared') cleared++;
      else if (r.status === 'occupied') occupied++;
      else waiting++;
    });

    return {
      totalBasecamp: basecampRooms.length,
      totalRooms: currentFloorRooms.length,
      occupied,
      cleared,
      waiting
    };
  }, [currentFloorRooms]);

  // Sinkronisasi selectedTeamId jika dipilih dari komponen luar (misal daftar peleton)
  useEffect(() => {
    if (selectedTeamId) {
      const targetRoom = roomsWithMetadata.find(r => r.team?.id === selectedTeamId);
      if (targetRoom) {
        setSelectedRoom(targetRoom);
        if (targetRoom.floor !== selectedFloorNum) {
          setSelectedFloorNum(targetRoom.floor);
        }
      }
    } else if (selectedRoom && selectedRoom.team) {
      setSelectedRoom(null);
    }
  }, [selectedTeamId]);

  // TOGGLE CLICK: Jika klik ruang yang sedang aktif -> Tutup Rincian (Deselect)
  // Jika klik ruang lain -> Buka Rincian (Select)
  const handleRoomClick = (room) => {
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
      if (onSelectTeam) {
        onSelectTeam(null);
      }
    } else {
      setSelectedRoom(room);
      if (onSelectTeam) {
        onSelectTeam(room.team || null);
      }
    }
  };

  const isRoomMatchingQuery = (room) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      room.code.toLowerCase().includes(q) ||
      room.name.toLowerCase().includes(q) ||
      (room.lbbRole && room.lbbRole.toLowerCase().includes(q)) ||
      (room.team && (
        room.team.schoolName.toLowerCase().includes(q) ||
        (room.team.platoonName && room.team.platoonName.toLowerCase().includes(q))
      ))
    );
  };

  // HELPER IKON RUANGAN (LUCIDE SVG RESMI - TANPA EMOJI)
  const getRoomIcon = (room, hasTeam) => {
    if (room.isStairs) return ArrowUpDown;
    if (room.category === 'international' || room.isInternational) return Lock;
    if (room.category === 'facility') {
      const codeOrName = (room.code + ' ' + room.name).toLowerCase();
      if (codeOrName.includes('km') || codeOrName.includes('toilet') || codeOrName.includes('kamar mandi')) {
        return Droplets;
      }
      if (codeOrName.includes('minum') || codeOrName.includes('dpr') || codeOrName.includes('dapur')) {
        return Coffee;
      }
      if (codeOrName.includes('cs') || codeOrName.includes('clean')) {
        return Sparkles;
      }
      return Building2;
    }
    if (room.category === 'lab') return FlaskConical;
    if (room.category === 'office') return Briefcase;
    if (hasTeam) return Users;
    return Building2;
  };

  // ELEGANT LIGHT MODERN THEME BOX STYLING DENGAN STATUS ACTIVE YANG KONTRAS & JELAS
  const getRoomBoxStyle = (room, isSelected) => {
    const isMatch = isRoomMatchingQuery(room);

    // Selected state (Satu-satunya Kotak Ruangan Aktif)
    if (isSelected) {
      return {
        card: 'bg-teal-700 text-white border-2 border-teal-500 ring-4 ring-teal-500/25 shadow-xl scale-[1.02] z-30',
        badge: 'bg-white text-teal-950 font-black shadow-xs',
        title: 'text-white font-black',
        sub: 'text-teal-100 font-semibold',
      };
    }

    // Search query match
    if (isMatch) {
      return {
        card: 'bg-amber-100 text-amber-950 border-2 border-amber-400 ring-2 ring-amber-300 shadow-md',
        badge: 'bg-amber-500 text-white font-black',
        title: 'text-amber-950 font-black',
        sub: 'text-amber-900 font-bold',
      };
    }

    // Kelas Internasional (Steril / Tidak Digunakan)
    if (room.category === 'international' || room.isInternational) {
      return {
        card: 'bg-slate-100/70 text-slate-400 border border-dashed border-slate-300 opacity-75 hover:opacity-100 hover:border-slate-400',
        badge: 'bg-slate-200 text-slate-500 border border-slate-300',
        title: 'text-slate-400 font-medium line-through decoration-slate-400',
        sub: 'text-amber-700 font-bold',
      };
    }

    // Tangga Akses
    if (room.isStairs) {
      return {
        card: 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs hover:border-amber-300',
        badge: 'bg-amber-500 text-white font-black',
        title: 'text-amber-950 font-bold',
        sub: 'text-amber-800 font-medium',
      };
    }

    // Fasilitas / Sanitasi / CS
    if (room.category === 'facility') {
      return {
        card: 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border border-slate-200 shadow-2xs hover:border-slate-300',
        badge: 'bg-slate-200 text-slate-700 font-mono font-bold',
        title: 'text-slate-900 font-bold',
        sub: 'text-slate-600 font-medium',
      };
    }

    // Laboratorium
    if (room.category === 'lab') {
      return {
        card: 'bg-sky-50 hover:bg-sky-100/80 text-sky-950 border border-sky-200 shadow-2xs hover:border-sky-300',
        badge: 'bg-sky-600 text-white font-black',
        title: 'text-sky-950 font-bold',
        sub: 'text-sky-800 font-medium',
      };
    }

    // Kantor Guru / MIC / BK
    if (room.category === 'office') {
      return {
        card: 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-950 border border-indigo-200 shadow-2xs hover:border-indigo-300',
        badge: 'bg-indigo-600 text-white font-black',
        title: 'text-indigo-950 font-bold',
        sub: 'text-indigo-800 font-medium',
      };
    }

    // Basecamp Terisi (Hadir)
    if (room.status === 'occupied') {
      return {
        card: 'bg-teal-50 hover:bg-teal-100/80 text-teal-950 border-2 border-teal-300 shadow-xs hover:border-teal-400',
        badge: 'bg-teal-600 text-white font-black shadow-2xs',
        title: 'text-teal-950 font-black',
        sub: 'text-teal-800 font-bold',
      };
    }

    // Basecamp Sudah Kliring
    if (room.status === 'cleared') {
      return {
        card: 'bg-purple-50 hover:bg-purple-100/80 text-purple-950 border border-purple-200 shadow-2xs hover:border-purple-300',
        badge: 'bg-purple-600 text-white font-black',
        title: 'text-purple-950 font-bold',
        sub: 'text-purple-800 font-medium',
      };
    }

    // Basecamp Reguler Siap
    return {
      card: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-teal-400 shadow-2xs',
      badge: 'bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200',
      title: 'text-slate-900 font-bold',
      sub: 'text-slate-500 font-medium',
    };
  };

  // Render individual room box (DENGAN TITLE NAMA PESERTA & TEKS TIDAK KEPOTONG)
  const renderRoomBox = (room, extraClasses = '', isCompact = false) => {
    const roomMeta = currentFloorRooms.find(r => r.id === room.id) || room;
    // PASTI HANYA 1 YANG AKTIF: Jika selectedRoom dipilih, hanya selectedRoom.id yang aktif
    const isSelected = selectedRoom
      ? selectedRoom.id === room.id
      : Boolean(selectedTeamId && roomMeta.team?.id === selectedTeamId);
    
    const style = getRoomBoxStyle(roomMeta, isSelected);
    const hasTeam = Boolean(roomMeta.team);
    const IconComponent = getRoomIcon(roomMeta, hasTeam);

    // HIERARKI JUDUL:
    // Jika terisi peleton: Judul Utama = Nama Sekolah/Peserta, Baris Kedua = Nama Ruangan
    // Jika tidak ada peleton: Judul Utama = Nama Ruangan, Baris Kedua = Peran/Fasilitas
    const primaryTitle = hasTeam ? roomMeta.team.schoolName : room.name;
    const secondaryTitle = hasTeam
      ? room.name
      : (room.isStairs ? 'Akses Tangga Sirkulasi' : (room.lbbRole || room.categoryLabel));

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => handleRoomClick(roomMeta)}
        className={`relative ${isCompact ? 'p-2 rounded-xl' : 'p-3 rounded-2xl'} text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none ${style.card} ${extraClasses}`}
        title={hasTeam ? `${roomMeta.team.schoolName} — ${room.name}` : `${room.name} (${room.categoryLabel || ''})`}
      >
        {/* Top bar: Code & Status Badge (Badge Kode Ruangan Dikembalikan, Tanpa teks Lt.) */}
        <div className={`flex items-center justify-between w-full gap-1 ${isCompact ? 'mb-1' : 'mb-2'}`}>
          {room.code ? (
            <span className={`font-mono font-black ${isCompact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'} rounded-lg leading-none ${style.badge}`}>
              {room.code}
            </span>
          ) : (
            <span />
          )}

          {room.isStairs ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
              <ArrowUpDown className="w-2.5 h-2.5" />
              <span>Tangga</span>
            </span>
          ) : (room.category === 'international' || room.isInternational) ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
              <Lock className="w-2.5 h-2.5" />
              <span>Steril</span>
            </span>
          ) : roomMeta.status === 'occupied' ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Hadir</span>
            </span>
          ) : roomMeta.status === 'cleared' ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Selesai</span>
            </span>
          ) : hasTeam ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
              <Clock className="w-2.5 h-2.5" />
              <span>Standby</span>
            </span>
          ) : null}
        </div>

        {/* Primary Title (Nama Peserta / Nama Ruangan) - Utuh & Tidak Dipotong */}
        <div className={`${isCompact ? 'my-0.5' : 'my-1'} flex-1`}>
          <div className="flex items-start gap-1.5">
            <IconComponent className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-white' : hasTeam ? 'text-teal-700' : 'text-slate-400'}`} />
            <div className={`${isCompact ? 'text-[10px] leading-tight font-black' : 'text-[11.5px] sm:text-xs font-black tracking-tight leading-snug'} break-words ${style.title}`}>
              {primaryTitle}
            </div>
          </div>
        </div>

        {/* Secondary Title (Nama Ruangan / Fungsi) - Wrap & Jelas */}
        <div className={`${isCompact ? 'mt-1 pt-1 text-[9px]' : 'mt-1.5 pt-1.5 text-[10px] sm:text-[11px]'} border-t ${isSelected ? 'border-teal-600' : 'border-slate-200'} leading-tight`}>
          {hasTeam ? (
            <div className={`flex items-center gap-1.5 font-medium break-words line-clamp-2 ${isSelected ? 'text-teal-100' : 'text-slate-600'}`}>
              <Building2 className="w-3 h-3 shrink-0 opacity-70" />
              <span>{secondaryTitle}</span>
            </div>
          ) : (room.category === 'international' || room.isInternational) ? (
            <div className="flex items-center gap-1 text-amber-700 font-semibold break-words line-clamp-2">
              <Lock className="w-2.5 h-2.5 shrink-0" />
              <span>Kelas Internasional</span>
            </div>
          ) : (
            <div className={`break-words line-clamp-2 ${isSelected ? 'text-teal-100' : style.sub}`}>
              {secondaryTitle}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 text-slate-900 font-sans">
      
      {/* ============================================================== */}
      {/* KANVAS DENAH INTERAKTIF (FULL WIDTH CANVAS) - CLEAN LIGHT      */}
      {/* ============================================================== */}
      <div className="w-full">
        <div className="bg-slate-50/70 rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden text-slate-900">
          
          {/* Header Canvas Denah: Judul di Kiri, Navigasi Lantai di Kanan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-900">
                  Denah Gedung Terpadu Huruf E &bull; {currentFloor.title.toUpperCase()}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pilih kotak ruangan untuk melihat rincian fasilitas dan penempatan kontingen.
              </p>
            </div>

            {/* SISI KANAN: Navigasi Lantai 1 - 4 (100% Fit di Semua Layar Mobile) */}
            <div className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs shrink-0">
              {FLOORS_CONFIG.map(f => {
                const isActive = f.floor === selectedFloorNum;
                return (
                  <button
                    key={f.floor}
                    type="button"
                    onClick={() => {
                      setSelectedFloorNum(f.floor);
                      setSelectedRoom(null);
                    }}
                    className={`py-1.5 px-1 sm:px-3 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 cursor-pointer text-center ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={`Lantai ${f.floor} - ${f.stats.classes} Ruang Kelas`}
                  >
                    <Layers className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="leading-none">Lt. {f.floor}</span>
                    <span className={`text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-md leading-tight ${isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-500'}`}>
                      {f.stats.classes} Kls
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEGENDA: PILLS BADGE (Horisontal Scrollable Hemat Ruang di Mobile) */}
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-0.5 select-none shrink-0">
              Legenda:
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs shrink-0 whitespace-nowrap">
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span>Ruang Kelas (Siap)</span>
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-bold bg-teal-50 border border-teal-200 text-teal-800 shadow-2xs shrink-0 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
              <span>Basecamp Terisi</span>
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-2xs shrink-0 whitespace-nowrap">
              <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
              <span>Ruang Guru / Panitia</span>
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-semibold bg-sky-50 border border-sky-200 text-sky-900 shadow-2xs shrink-0 whitespace-nowrap">
              <FlaskConical className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" />
              <span>Laboratorium</span>
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 shadow-2xs shrink-0 whitespace-nowrap">
              <Droplets className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span>Kamar Mandi / Servis</span>
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs shrink-0 whitespace-nowrap">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>Kelas Internasional (Steril)</span>
            </span>
          </div>

          {/* ============================================================== */}
          {/* TATA LETAK DENAH KOTAK BERSIH SESUAI ARSITEKTUR ASLI           */}
          {/* ============================================================== */}
          <div className="space-y-4">
            
            {/* 1. KORIDOR UTARA (Horizontal Top Spine) - SATU BARIS PENUH TANPA WRAP */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 sm:hidden px-0.5">
                <span className="font-medium text-slate-500">Koridor Ruang Kelas & Servis</span>
                <span>← Geser horizontal →</span>
              </div>
              {/* Flex Container: Selalu Cuman SATU BARIS (flex-nowrap) */}
              <div className="flex flex-nowrap items-stretch gap-2.5 w-full overflow-x-auto pb-1 scrollbar-none">
                {selectedFloorNum === 1 ? (
                  (() => {
                    const northRooms = currentFloor.zones.find(z => z.wing === 'north')?.rooms || [];
                    const kmDpr = northRooms.find(r => r.code === 'KM-DPR');
                    const rMinum = northRooms.find(r => r.code === 'R-MINUM');
                    const remainingRooms = northRooms.filter(r => r.code !== 'KM-DPR' && r.code !== 'R-MINUM');

                    return (
                      <>
                        {/* 2. KM-DPR dan R-MINUM dibuat ATAS BAWAH */}
                        {kmDpr && rMinum && (
                          <div className="flex flex-col gap-2 flex-1 min-w-[130px] sm:min-w-[145px]">
                            {renderRoomBox(kmDpr, 'flex-1 min-h-[60px]', true)}
                            {renderRoomBox(rMinum, 'flex-1 min-h-[60px]', true)}
                          </div>
                        )}
                        {/* Ruangan kelas & operasional lainnya dalam satu baris yang sama */}
                        {remainingRooms.map(room => (
                          renderRoomBox(room, 'flex-1 min-w-[150px] sm:min-w-[165px] min-h-[135px]')
                        ))}
                      </>
                    );
                  })()
                ) : (
                  /* Lantai 2, 3, 4: Seluruh Ruangan Satu Baris Flex */
                  currentFloor.zones.find(z => z.wing === 'north')?.rooms.map(room => (
                    renderRoomBox(room, 'flex-1 min-w-[150px] sm:min-w-[165px] min-h-[120px]')
                  ))
                )}
              </div>
            </div>

              {/* 2. TIGA SAYAP MENJOROK KE SELATAN + TAMAN DALAM FORMAT PROPORSIANL */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-stretch">
                
                {/* --- KOLOM 1: SAYAP BARAT (WEST WING) --- */}
                <div className="md:col-span-1 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5 flex-1 flex flex-col">
                    {currentFloor.zones.find(z => z.wing === 'west')?.rooms.map(room => (
                      renderRoomBox(room, 'w-full min-h-[105px]')
                    ))}
                  </div>
                </div>

                {/* --- KOLOM 2: TAMAN / RUANG TERBUKA 1 --- */}
                <div className="md:col-span-1 bg-emerald-50/70 rounded-2xl md:rounded-3xl border border-dashed border-emerald-300/80 p-2.5 md:p-4 flex flex-row md:flex-col items-center justify-center text-left md:text-center my-1.5 md:my-4 min-h-0 md:min-h-[200px] gap-2.5 md:gap-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-center md:mb-2 shrink-0">
                    <TreeDeciduous className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs md:text-sm text-emerald-900 uppercase tracking-wider block">
                      Taman Barat
                    </span>
                    <span className="text-[10px] md:text-[11px] text-emerald-700 font-medium max-w-[140px] md:mt-1 leading-tight block">
                      {selectedFloorNum === 1
                        ? 'Area Taman Hijau & Ruang Terbuka'
                        : 'Void Udara & Sirkulasi'}
                    </span>
                  </div>
                </div>

                {/* --- KOLOM 3: SAYAP TENGAH (CENTRAL WING) --- */}
                <div className="md:col-span-1 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5 flex-1 flex flex-col">
                    {currentFloor.zones.find(z => z.wing === 'center')?.rooms.map(room => (
                      renderRoomBox(room, 'w-full min-h-[105px]')
                    ))}
                  </div>
                </div>

                {/* --- KOLOM 4: TAMAN / RUANG TERBUKA 2 --- */}
                <div className="md:col-span-1 bg-emerald-50/70 rounded-2xl md:rounded-3xl border border-dashed border-emerald-300/80 p-2.5 md:p-4 flex flex-row md:flex-col items-center justify-center text-left md:text-center my-1.5 md:my-4 min-h-0 md:min-h-[200px] gap-2.5 md:gap-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-center md:mb-2 shrink-0">
                    <TreeDeciduous className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs md:text-sm text-emerald-900 uppercase tracking-wider block">
                      Taman Timur
                    </span>
                    <span className="text-[10px] md:text-[11px] text-emerald-700 font-medium max-w-[140px] md:mt-1 leading-tight block">
                      {selectedFloorNum === 1
                        ? 'Area Taman Hijau & Ruang Terbuka'
                        : 'Void Udara & Sirkulasi'}
                    </span>
                  </div>
                </div>

                {/* --- KOLOM 5: SAYAP TIMUR (EAST WING) --- */}
                <div className="md:col-span-1 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5 flex-1 flex flex-col">
                    {currentFloor.zones.find(z => z.wing === 'east')?.rooms.map(room => (
                      renderRoomBox(room, 'w-full min-h-[105px]')
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Rincian Ruangan Terpilih (Floating Card di Bawah Denah - Light Theme) */}
            {selectedRoom && (
              <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-white border-2 border-teal-600 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3.5">
                  {selectedRoom.code ? (
                    <span className="font-mono font-black text-sm px-3 py-1.5 rounded-xl bg-teal-700 text-white shrink-0 shadow-xs">
                      {selectedRoom.code}
                    </span>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    {/* Primary Title: Nama Peserta jika ada, jika tidak nama ruangan */}
                    <h5 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
                      {selectedRoom.team ? (
                        <>
                          <Users className="w-4 h-4 text-teal-700 shrink-0" />
                          <span>{selectedRoom.team.schoolName}</span>
                        </>
                      ) : (
                        <span>{selectedRoom.name}</span>
                      )}
                    </h5>

                    {/* Subtitle: Nama Ruangan jika ada peserta */}
                    <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                      {selectedRoom.team && (
                        <span className="font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {selectedRoom.name}
                        </span>
                      )}
                      <span>{selectedRoom.wingLabel}</span>
                      <span>&bull;</span>
                      <span>Lt. {selectedRoom.floor}</span>
                      <span>&bull;</span>
                      <span><strong>Fungsi:</strong> {selectedRoom.lbbRole || selectedRoom.categoryLabel}</span>
                    </p>

                    {(selectedRoom.category === 'international' || selectedRoom.isInternational) ? (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><strong>Status Steril:</strong> Kelas Internasional tidak digunakan untuk basecamp peserta LBB 2027.</span>
                      </div>
                    ) : selectedRoom.team ? (
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Status: {selectedRoom.status === 'occupied' ? 'Hadir di Lokasi' : selectedRoom.status === 'cleared' ? 'Selesai Kliring' : 'Menunggu Check-In'}</span>
                        </span>
                        <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-mono">
                          Reg: {selectedRoom.team.regCode} &bull; Jenjang: {selectedRoom.team.jenjang}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoom(null);
                    if (onSelectTeam) onSelectTeam(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer self-end md:self-center flex items-center gap-1.5 shadow-xs active:scale-95"
                >
                  <X className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Tutup Rincian</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
  );
}
