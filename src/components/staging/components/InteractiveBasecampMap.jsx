import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  X,
  Layers,
  TreeDeciduous,
  ArrowUpDown,
  Lock,
  Sparkles,
  Users,
  Droplets,
  Coffee,
  FlaskConical,
  Briefcase,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  Search
} from 'lucide-react';
import { FLOORS_CONFIG, getAllRoomsFlat } from '../../../data/basecampFloorplanData.js';
import { formatImageUrl } from '../../../services/sheetService.js';

export default function InteractiveBasecampMap({
  teams = [],
  staging = {},
  selectedTeamId = null,
  onSelectTeam = null,
  onActionTeam = null,
  searchQuery: externalSearchQuery = '',
  defaultFloor = 1,
  isPublicView = false
}) {
  const [selectedFloorNum, setSelectedFloorNum] = useState(defaultFloor);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [basecampOnly, setBasecampOnly] = useState(false);

  const normalizedQuery = (externalSearchQuery || '').trim().toLowerCase();

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
    return st?.checkedInAt || st?.basecampLogistics?.checkedInAt || null;
  };

  const getTeamLogo = (team) => {
    if (!team) return '';
    const raw =
      (team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? team.files.schoolLogo.url : '') ||
      (typeof team.files?.schoolLogo === 'string' && team.files.schoolLogo.length > 5 ? team.files.schoolLogo : '') ||
      team.file_logo_sekolah ||
      team.logoUrl ||
      team.avatar ||
      '';
    if (raw) return formatImageUrl(raw);
    const bg = team.jenjang === 'SD' ? 'b91c1c' : '1d4ed8';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName || 'LBB')}&background=${bg}&color=fff&bold=true`;
  };

  const getFallbackAvatar = (team) => {
    const bg = team?.jenjang === 'SD' ? 'b91c1c' : '1d4ed8';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(team?.schoolName || 'LBB')}&background=${bg}&color=fff&bold=true`;
  };

  // Map semua ruangan dengan daftar tim yang menempatinya (mendukung 2 peleton 1 sekolah di 1 ruang)
  const roomsWithMetadata = useMemo(() => {
    return getAllRoomsFlat().map(room => {
      let assignedTeams = [];

      if (room.isBasecampCandidate) {
        assignedTeams = teams.filter(t => {
          const st = getTeamStaging(t.id);
          const rName = st?.basecamp?.roomName || st?.roomName || t.basecampRoom || t.basecampNumber || '';
          if (!rName) return false;
          const clean = rName.trim().toUpperCase();
          return clean === room.code.toUpperCase() || clean === room.name.toUpperCase();
        });
      }

      const primaryTeam = assignedTeams[0] || null;
      const anyCheckedIn = assignedTeams.some(t => isCheckedIn(t.id));
      const allCheckedOut = assignedTeams.length > 0 && assignedTeams.every(t => isCheckedOut(t.id));

      let status = 'empty';
      if (allCheckedOut) status = 'cleared';
      else if (anyCheckedIn) status = 'occupied';
      else if (assignedTeams.length > 0) status = 'assigned';

      return {
        ...room,
        teams: assignedTeams,
        team: primaryTeam,
        status,
        isCheckedIn: anyCheckedIn,
        isCheckedOut: allCheckedOut,
        checkInTime: primaryTeam ? getCheckInTime(primaryTeam.id) : null,
      };
    });
  }, [teams, staging]);

  // Statistik terisi/total per lantai (untuk badge di tab lantai)
  const floorOccupancyMap = useMemo(() => {
    const map = new Map();
    FLOORS_CONFIG.forEach(f => {
      const candidates = roomsWithMetadata.filter(r => r.floor === f.floor && r.isBasecampCandidate);
      const plotted = candidates.filter(r => (r.teams?.length || 0) > 0).length;
      map.set(f.floor, { plotted, total: candidates.length });
    });
    return map;
  }, [roomsWithMetadata]);

  // Ruangan lantai saat ini
  const currentFloorRooms = useMemo(() => {
    return roomsWithMetadata.filter(r => r.floor === selectedFloorNum);
  }, [roomsWithMetadata, selectedFloorNum]);

  // Pencocokan query pencarian lintas lantai
  const isRoomMatchingQuery = (room) => {
    if (!normalizedQuery) return false;
    const roomTeams = room.teams || (room.team ? [room.team] : []);
    return (
      (room.code && room.code.toLowerCase().includes(normalizedQuery)) ||
      (room.name && room.name.toLowerCase().includes(normalizedQuery)) ||
      roomTeams.some(t =>
        (t.schoolName && t.schoolName.toLowerCase().includes(normalizedQuery)) ||
        (t.dantonName && t.dantonName.toLowerCase().includes(normalizedQuery)) ||
        (t.chestNumber && String(t.chestNumber).toLowerCase().includes(normalizedQuery))
      )
    );
  };

  // Hitung lantai lain yang cocok pencarian agar user bisa langsung lompat
  const matchedFloors = useMemo(() => {
    if (!normalizedQuery) return [];
    const floors = new Set();
    roomsWithMetadata.forEach(r => {
      if (isRoomMatchingQuery(r)) floors.add(r.floor);
    });
    return Array.from(floors).sort((a, b) => a - b);
  }, [roomsWithMetadata, normalizedQuery]);

  // Sinkronisasi selectedTeamId dari luar (misal Portal Peserta menyorot ruangnya sendiri)
  useEffect(() => {
    if (selectedTeamId) {
      const targetRoom = roomsWithMetadata.find(r => (r.teams || []).some(t => t.id === selectedTeamId));
      if (targetRoom) {
        setSelectedRoom(targetRoom);
        if (targetRoom.floor !== selectedFloorNum) {
          setSelectedFloorNum(targetRoom.floor);
        }
      }
    } else if (selectedRoom && (selectedRoom.teams?.length || selectedRoom.team)) {
      setSelectedRoom(null);
    }
  }, [selectedTeamId]);

  const handleRoomClick = (room) => {
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
      if (onSelectTeam) onSelectTeam(null);
    } else {
      setSelectedRoom(room);
      if (onSelectTeam) onSelectTeam(room.team || null);
    }
  };

  // Ikon ringkas untuk ruang non-basecamp
  const getNonBasecampIcon = (room) => {
    if (room.isStairs) return ArrowUpDown;
    if (room.category === 'international' || room.isInternational) return Lock;
    if (room.category === 'facility') {
      const s = `${room.code} ${room.name}`.toLowerCase();
      if (s.includes('km') || s.includes('toilet') || s.includes('kamar mandi')) return Droplets;
      if (s.includes('minum') || s.includes('dpr') || s.includes('dapur')) return Coffee;
      if (s.includes('cs') || s.includes('clean')) return Sparkles;
      return Building2;
    }
    if (room.category === 'lab') return FlaskConical;
    if (room.category === 'office') return Briefcase;
    return Building2;
  };

  // Label singkat non-basecamp (menghindari teks panjang berulang)
  const getShortNonBasecampLabel = (room) => {
    if (room.isStairs) return 'Tangga';
    if (room.category === 'international' || room.isInternational) return 'Steril';
    return room.name
      .replace(/^Ruang Kelas Baru\s*/i, 'R. Baru ')
      .replace(/^Ruangan Baru\s*/i, 'R. Baru ')
      .replace(/^Ruang Cleaning Service$/i, 'Cleaning Service')
      .replace(/^Ruang Organisasi Santri$/i, 'R. Organisasi')
      .replace(/^Kamar Mandi & Ruang Dapur$/i, 'KM & Dapur')
      .replace(/^Kamar Mandi Sayap Tengah$/i, 'Kamar Mandi')
      .replace(/^Ruang Air Minum$/i, 'Air Minum');
  };

  // Render kotak ruangan: dibedakan tegas antara Basecamp Peserta (utama) vs Non-Basecamp (ringkas & tenang)
  const renderRoomBox = (room, extraClasses = '') => {
    const roomMeta = currentFloorRooms.find(r => r.id === room.id) || room;
    const isSelected = selectedRoom
      ? selectedRoom.id === room.id
      : Boolean(selectedTeamId && roomMeta.team?.id === selectedTeamId);
    const isMatch = isRoomMatchingQuery(roomMeta);
    const hasTeam = Boolean(roomMeta.team);

    // 1. NON-BASECAMP ROOM (Muted, kompak, tidak bersaing visual dengan basecamp peserta)
    if (!room.isBasecampCandidate) {
      if (basecampOnly) return null;
      const IconComp = getNonBasecampIcon(roomMeta);
      const isSteril = room.category === 'international' || room.isInternational;
      const isStairs = Boolean(room.isStairs);

      return (
        <button
          key={room.id}
          type="button"
          onClick={() => handleRoomClick(roomMeta)}
          title={`${room.code ? `[${room.code}] ` : ''}${room.name}${room.lbbRole ? ` — ${room.lbbRole}` : ''}`}
          className={`w-full px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2 min-w-0 select-none ${
            isSelected
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : isMatch
              ? 'bg-amber-50 text-amber-950 border border-amber-400 ring-1 ring-amber-300'
              : isSteril
              ? 'bg-slate-50/70 text-slate-400 border border-dashed border-slate-200 hover:border-slate-300'
              : isStairs
              ? 'bg-amber-50/50 text-amber-900 border border-amber-200/70 hover:bg-amber-50'
              : 'bg-slate-50/80 text-slate-500 border border-slate-200/70 hover:bg-slate-100/80 hover:text-slate-700'
          } ${extraClasses}`}
        >
          <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-300' : isStairs ? 'text-amber-600' : 'text-slate-400'}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {room.code && (
                <span className={`font-mono text-[9.5px] font-bold shrink-0 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {room.code}
                </span>
              )}
              <span className={`text-[10.5px] font-semibold truncate ${isSteril && !isSelected ? 'line-through decoration-slate-300' : ''}`}>
                {getShortNonBasecampLabel(roomMeta)}
              </span>
            </div>
          </div>
          {isSteril && !isSelected && (
            <span className="text-[9px] font-bold uppercase text-slate-400 shrink-0">Steril</span>
          )}
        </button>
      );
    }

    // 2. BASECAMP CANDIDATE ROOM (Fokus Utama: jelas, padat, informatif; mendukung 1 atau 2 peleton 1 sekolah)
    const roomTeams = roomMeta.teams || (roomMeta.team ? [roomMeta.team] : []);
    const team = roomTeams[0] || null;
    const isSharedRoom = roomTeams.length >= 2;
    const isSD = team?.jenjang === 'SD';

    // Untuk 2 peleton dari 1 sekolah, tampilkan nama sekolah dasarnya agar ringkas
    const displaySchoolName = team
      ? isSharedRoom
        ? (team.schoolBaseName || team.schoolName || '')
            .replace(/\s+(TIM|PELETON|REGU|PASUKAN)?\s*(A|B|C|D|1|2|3|I|II|III|PUTRA|PUTRI|PA|PI)$/i, '')
            .trim()
        : team.schoolName
      : '';
    const chestNumbers = roomTeams.map(t => t.chestNumber).filter(Boolean);

    let cardTone = 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 text-slate-800';
    let codeTone = 'bg-slate-100 text-slate-700 border-slate-200';
    let statusDot = null;

    if (isSelected) {
      cardTone = 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-900/20';
      codeTone = 'bg-white/15 text-white border-white/20';
    } else if (isMatch) {
      cardTone = 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/70 text-amber-950 shadow-xs';
      codeTone = 'bg-amber-500 text-white border-amber-500';
    } else if (roomMeta.status === 'occupied') {
      cardTone = 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-300/90 text-emerald-950';
      codeTone = 'bg-emerald-600 text-white border-emerald-600';
    } else if (roomMeta.status === 'cleared') {
      cardTone = 'bg-blue-50/60 hover:bg-blue-50 border-blue-200 text-blue-950';
      codeTone = 'bg-blue-600 text-white border-blue-600';
    } else if (hasTeam) {
      cardTone = 'bg-white hover:bg-amber-50/40 border-slate-200/90 hover:border-amber-300 text-slate-900';
      codeTone = 'bg-slate-900 text-white border-slate-900';
    }

    if (roomMeta.status === 'occupied') {
      statusDot = (
        <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded-md ${
          isSelected ? 'bg-emerald-500/25 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Hadir
        </span>
      );
    } else if (roomMeta.status === 'cleared') {
      statusDot = (
        <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded-md ${
          isSelected ? 'bg-blue-500/25 text-blue-200' : 'bg-blue-100 text-blue-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Pulang
        </span>
      );
    } else if (hasTeam) {
      statusDot = (
        <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded-md ${
          isSelected ? 'bg-amber-500/25 text-amber-200' : 'bg-amber-50 text-amber-700 border border-amber-200/80'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Standby
        </span>
      );
    } else {
      statusDot = (
        <span className={`text-[9.5px] font-medium ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
          Kosong
        </span>
      );
    }

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => handleRoomClick(roomMeta)}
        title={
          hasTeam
            ? `${room.code} — ${roomTeams.map(t => `${t.schoolName}${t.chestNumber ? ` (#${t.chestNumber})` : ''}`).join(' & ')}`
            : `${room.code} — ${room.name} (Kosong)`
        }
        className={`w-full min-h-[104px] p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 min-w-0 select-none ${cardTone} ${extraClasses}`}
      >
        {/* Top Row: Room Code + Status */}
        <div className="flex items-center justify-between gap-1 w-full">
          <div className="flex items-center gap-1">
            <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-md border leading-none ${codeTone}`}>
              {room.code}
            </span>
            {isSharedRoom && (
              <span className={`text-[9px] font-bold px-1 py-0.5 rounded leading-none ${
                isSelected ? 'bg-white/15 text-slate-200' : 'bg-amber-100 text-amber-800'
              }`}>
                {roomTeams.length} Tim
              </span>
            )}
          </div>
          {statusDot}
        </div>

        {/* Content: Logo Sekolah + Nama Sekolah + No. Dada / Jenjang */}
        {hasTeam ? (
          <div className="min-w-0 flex-1 flex flex-col justify-between gap-1.5">
            <div className="flex items-start gap-2 min-w-0">
              <img
                src={getTeamLogo(team)}
                alt={displaySchoolName}
                className="w-7 h-7 object-contain shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackAvatar(team);
                }}
              />
              <div className={`text-[11px] font-bold leading-tight line-clamp-2 min-w-0 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {displaySchoolName}
              </div>
            </div>
            <div className="flex items-center justify-between gap-1 pt-0.5">
              {chestNumbers.length > 0 ? (
                <span className={`font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded truncate ${
                  isSelected
                    ? 'bg-white/15 text-slate-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}>
                  {chestNumbers.map(n => `#${n}`).join(' · ')}
                </span>
              ) : (
                <span />
              )}
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                isSelected
                  ? 'bg-white/15 text-slate-200'
                  : isSD
                  ? 'bg-red-50 text-red-700 border border-red-200/70'
                  : 'bg-blue-50 text-blue-700 border border-blue-200/70'
              }`}>
                {team.jenjang}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <span className={`text-[11px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
              {room.name}
            </span>
          </div>
        )}
      </button>
    );
  };

  // Helper ambil rooms per wing
  const northRooms = currentFloor.zones.find(z => z.wing === 'north')?.rooms || [];
  const westRooms = currentFloor.zones.find(z => z.wing === 'west')?.rooms || [];
  const centerRooms = currentFloor.zones.find(z => z.wing === 'center')?.rooms || [];
  const eastRooms = currentFloor.zones.find(z => z.wing === 'east')?.rooms || [];

  const visibleNorthRooms = basecampOnly ? northRooms.filter(r => r.isBasecampCandidate) : northRooms;
  const visibleWestRooms = basecampOnly ? westRooms.filter(r => r.isBasecampCandidate) : westRooms;
  const visibleCenterRooms = basecampOnly ? centerRooms.filter(r => r.isBasecampCandidate) : centerRooms;
  const visibleEastRooms = basecampOnly ? eastRooms.filter(r => r.isBasecampCandidate) : eastRooms;

  const isSelectedTeamCheckedIn = selectedRoom?.team ? isCheckedIn(selectedRoom.team.id) : false;
  const isSelectedTeamCheckedOut = selectedRoom?.team ? isCheckedOut(selectedRoom.team.id) : false;

  return (
    <div className={isPublicView ? 'space-y-3.5 text-slate-900 font-sans' : 'space-y-3.5 text-slate-900 font-sans'}>

      {/* 1. Flush Underline Floor Tabs + Segmented Filter & Legenda (Zero Box-in-Box Clutter) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-slate-200">
        {/* Floor Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px">
          {FLOORS_CONFIG.map(f => {
            const isActive = f.floor === selectedFloorNum;
            const occ = floorOccupancyMap.get(f.floor) || { plotted: 0, total: f.stats.classes };
            const isFull = occ.total > 0 && occ.plotted >= occ.total;
            const hasSearchMatch = matchedFloors.includes(f.floor);
            return (
              <button
                key={f.floor}
                type="button"
                onClick={() => {
                  setSelectedFloorNum(f.floor);
                  setSelectedRoom(null);
                }}
                className={`relative py-2.5 px-3 text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-slate-950 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 font-semibold'
                }`}
              >
                <span>Lantai {f.floor}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md leading-none ${
                  isActive
                    ? isFull
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-900 text-white'
                    : isFull
                    ? 'bg-emerald-50 text-emerald-700'
                    : occ.plotted > 0
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-slate-100/70 text-slate-400'
                }`}>
                  {occ.plotted}/{occ.total}
                </span>
                {hasSearchMatch && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Kanan: Legenda Minimalis + Segmented Toggle Semua / Basecamp */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pb-2 lg:pb-1.5 text-[11px]">
          <div className="flex items-center gap-2.5 text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Hadir</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Standby</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Pulang</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white border border-slate-300" />
              <span>Kosong</span>
            </span>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-[11px] font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setBasecampOnly(false)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                !basecampOnly
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setBasecampOnly(true)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                basecampOnly
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Basecamp
            </button>
          </div>
        </div>
      </div>

      {/* Info Pintas Pencarian jika hasil ada di lantai lain */}
      {normalizedQuery && matchedFloors.length > 0 && !matchedFloors.includes(selectedFloorNum) && (
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Hasil pencarian ditemukan di lantai lain:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {matchedFloors.map(fl => (
              <button
                key={fl}
                type="button"
                onClick={() => setSelectedFloorNum(fl)}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
              >
                Lompat ke Lt. {fl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TATA LETAK DENAH BERSIH & RINGKAS (ZERO HORIZONTAL CLIPPING)   */}
      {/* ============================================================== */}
      <div className="space-y-3">

        {/* 1. KORIDOR UTARA (Responsive Grid: tidak terpotong di desktop/laptop) */}
        {visibleNorthRooms.length > 0 && (
          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Koridor Utara · Lantai {selectedFloorNum}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {visibleNorthRooms.filter(r => r.isBasecampCandidate).length} Kelas Basecamp
              </span>
            </div>

            {selectedFloorNum === 1 && !basecampOnly ? (
              (() => {
                const kmDpr = northRooms.find(r => r.code === 'KM-DPR');
                const rMinum = northRooms.find(r => r.code === 'R-MINUM');
                const remaining = northRooms.filter(r => r.code !== 'KM-DPR' && r.code !== 'R-MINUM');
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 items-stretch">
                    {kmDpr && rMinum && (
                      <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                        {renderRoomBox(kmDpr, 'flex-1')}
                        {renderRoomBox(rMinum, 'flex-1')}
                      </div>
                    )}
                    {remaining.map(room => renderRoomBox(room))}
                  </div>
                );
              })()
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(135px,1fr))] gap-2 items-stretch">
                {visibleNorthRooms.map(room => renderRoomBox(room))}
              </div>
            )}
          </div>
        )}

        {/* 2. TIGA SAYAP SELATAN + 2 JALUR TAMAN (Proporsi Sayap Mendekati Kotak & Hemat Ruang) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(56px,0.55fr)_1fr_minmax(56px,0.55fr)_1fr] gap-2.5 items-stretch">

          {/* Sayap Barat */}
          <div className="bg-slate-50/50 rounded-2xl p-2.5 border border-slate-200/80 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
              Sayap Barat
            </span>
            {visibleWestRooms.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {visibleWestRooms.map(room => renderRoomBox(room))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-6 text-[11px] text-slate-400 italic">
                Tidak ada basecamp
              </div>
            )}
          </div>

          {/* Taman Barat (Ramping) */}
          <div className="bg-emerald-50/60 rounded-xl border border-dashed border-emerald-200/90 py-2 px-2 md:py-4 flex flex-row md:flex-col items-center justify-center gap-1.5 text-emerald-700/80">
            <TreeDeciduous className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[9.5px] font-bold uppercase tracking-wider md:[writing-mode:vertical-rl] md:rotate-180 whitespace-nowrap">
              {selectedFloorNum === 1 ? 'Taman Barat' : 'Void Barat'}
            </span>
          </div>

          {/* Sayap Tengah */}
          <div className="bg-slate-50/50 rounded-2xl p-2.5 border border-slate-200/80 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
              Sayap Tengah
            </span>
            {visibleCenterRooms.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {visibleCenterRooms.map(room => renderRoomBox(room))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-6 text-[11px] text-slate-400 italic">
                Tidak ada basecamp
              </div>
            )}
          </div>

          {/* Taman Timur (Ramping) */}
          <div className="bg-emerald-50/60 rounded-xl border border-dashed border-emerald-200/90 py-2 px-2 md:py-4 flex flex-row md:flex-col items-center justify-center gap-1.5 text-emerald-700/80">
            <TreeDeciduous className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[9.5px] font-bold uppercase tracking-wider md:[writing-mode:vertical-rl] md:rotate-180 whitespace-nowrap">
              {selectedFloorNum === 1 ? 'Taman Timur' : 'Void Timur'}
            </span>
          </div>

          {/* Sayap Timur */}
          <div className="bg-slate-50/50 rounded-2xl p-2.5 border border-slate-200/80 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
              Sayap Timur
            </span>
            {visibleEastRooms.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {visibleEastRooms.map(room => renderRoomBox(room))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-6 text-[11px] text-slate-400 italic">
                Tidak ada basecamp
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. Detail Bar Ringkas saat Ruangan Diklik (mendukung 1 atau 2 peleton 1 sekolah) */}
      {selectedRoom && (() => {
        const selectedTeams = selectedRoom.teams || (selectedRoom.team ? [selectedRoom.team] : []);
        const primaryTeam = selectedTeams[0] || null;
        return (
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-3 animate-in fade-in duration-150">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {primaryTeam ? (
                  <img
                    src={getTeamLogo(primaryTeam)}
                    alt={primaryTeam.schoolName}
                    className="w-9 h-9 object-contain shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackAvatar(primaryTeam);
                    }}
                  />
                ) : (
                  <span className="font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 text-white shrink-0">
                    {selectedRoom.code || `Lt.${selectedRoom.floor}`}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {primaryTeam && selectedRoom.code && (
                      <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-white shrink-0">
                        {selectedRoom.code}
                      </span>
                    )}
                    <h5 className="font-bold text-slate-900 text-sm leading-snug">
                      {primaryTeam
                        ? selectedTeams.length >= 2
                          ? `${(primaryTeam.schoolBaseName || primaryTeam.schoolName || '').replace(/\s+(TIM|PELETON|REGU|PASUKAN)?\s*(A|B|C|D|1|2|3|I|II|III|PUTRA|PUTRI|PA|PI)$/i, '').trim()} (${selectedTeams.length} Peleton)`
                          : primaryTeam.schoolName
                        : selectedRoom.name}
                    </h5>
                    {primaryTeam?.jenjang && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        primaryTeam.jenjang === 'SD'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {primaryTeam.jenjang}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">
                    {selectedRoom.name} · Lt. {selectedRoom.floor}
                    {!primaryTeam && ` · ${selectedRoom.lbbRole || selectedRoom.categoryLabel || 'Ruang Umum'}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedRoom(null);
                  if (onSelectTeam) onSelectTeam(null);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Tutup rincian"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedTeams.length > 0 && (
              <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                {selectedTeams.map(t => {
                  const tIn = isCheckedIn(t.id);
                  const tOut = isCheckedOut(t.id);
                  const tTime = getCheckInTime(t.id);
                  return (
                    <div key={t.id} className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {t.chestNumber && (
                          <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            #{t.chestNumber}
                          </span>
                        )}
                        <span className="font-bold text-slate-800">{t.schoolName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">Danton: <strong className="text-slate-800">{t.dantonName || '-'}</strong></span>
                        <span className="text-slate-400">·</span>
                        <span className={`font-semibold ${tOut ? 'text-blue-700' : tIn ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {tOut ? 'Sudah Pulang' : tIn ? `Hadir${tTime ? ` (${tTime})` : ''}` : 'Standby'}
                        </span>
                      </div>

                      {!isPublicView && onActionTeam && !tOut && (
                        <button
                          type="button"
                          onClick={() => onActionTeam(t, tIn ? 'checkout' : 'checkin')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 text-white cursor-pointer transition-all active:scale-95 self-start sm:self-auto ${
                            tIn
                              ? 'bg-rose-600 hover:bg-rose-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {tIn ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                          <span>{tIn ? 'Check-Out' : 'Check-In'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
