import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LogIn,
  LogOut,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  Camera,
  DoorOpen,
  Sparkles,
  X,
  MapPin,
  FileCheck,
  Unlock,
  Wand2,
  Table2,
  Map as MapIcon,
  RotateCcw
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { formatImageUrl } from '../../services/sheetService.js';
import { appAlert, appConfirm } from '../../utils/appDialog.js';
import { FLOORS_CONFIG, getAllRoomsFlat } from '../../data/basecampFloorplanData.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import QRScannerModal from '../common/QRScannerModal.jsx';
import InteractiveBasecampMap from './components/InteractiveBasecampMap.jsx';

export default function BasecampCheckInView({ initialTab = 'checkin' }) {
  const {
    teams,
    staging,
    settings,
    updateSettings,
    updateTeamStaging,
    bulkUpdateTeamStaging,
    checkInBasecamp,
    checkOutBasecamp,
    currentUser,
    role,
    isLocalhost
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canProcess = ['checkin', 'admin', 'superadmin'].includes(userRole);
  const canManagePlacement = ['admin', 'superadmin', 'checkin'].includes(userRole);

  // 3 Tab Utama Sejajar: 'placement' | 'checkin' | 'checkout'
  const [activeTab, setActiveTab] = useState(initialTab === 'checkout' ? 'checkout' : initialTab === 'placement' ? 'placement' : 'checkin');
  const [placementViewMode, setPlacementViewMode] = useState('table'); // 'table' | 'map'
  const [activeJenjang, setActiveJenjang] = useState('SD'); // 'SD' | 'SMP'

  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [modalTeamId, setModalTeamId] = useState(null);
  const [modalMode, setModalMode] = useState('checkin'); // 'checkin' | 'checkout'

  // Filter status per tab
  const [statusFilterPlacement, setStatusFilterPlacement] = useState('all'); // 'all' | 'unassigned' | 'assigned'
  const [statusFilterCheckIn, setStatusFilterCheckIn] = useState('all'); // 'all' | 'pending' | 'checkedin'
  const [statusFilterCheckOut, setStatusFilterCheckOut] = useState('in_venue'); // 'in_venue' | 'checkedout' | 'all'

  // Form State: Check-In
  const [ktpOfficialName, setKtpOfficialName] = useState('');
  const [ktpType, setKtpType] = useState('KTP Fisik');
  const [logisticsChecklist, setLogisticsChecklist] = useState({
    waterBox: true,
    chestNumber: true,
    cocardOfficial: true,
    trashBag: true,
  });

  // Form State: Check-Out
  const [checkoutChecklist, setCheckoutChecklist] = useState({
    roomCleanChecked: true,
    sortedTrashReturned: true,
    ktpReturned: true,
  });

  const [toastMsg, setToastMsg] = useState('');
  const toastTimerRef = useRef(null);

  useEffect(() => {
    if (initialTab === 'checkout') {
      setActiveTab('checkout');
    } else if (initialTab === 'placement') {
      setActiveTab('placement');
    } else if (initialTab === 'checkin') {
      setActiveTab('checkin');
    }
  }, [initialTab]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
      toastTimerRef.current = null;
    }, 3200);
  };

  // Semua peleton yang sah terdaftar (khusus localhost: bypass kelengkapan, tampilkan semua non-rejected)
  const competitionTeams = useMemo(() => {
    return teams
      .filter(t => isLocalhost ? t.status !== 'rejected' : (['registered', 'verified', 'drawn'].includes(t.status) || Boolean(t.lotNumber)))
      .sort((a, b) => {
        const parseChest = (val) => {
          if (val === undefined || val === null || val === '') return Number.MAX_SAFE_INTEGER;
          const num = parseInt(String(val).replace(/[^\d]/g, ''), 10);
          return Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER;
        };
        const chestA = parseChest(a.chestNumber);
        const chestB = parseChest(b.chestNumber);
        if (chestA !== chestB) return chestA - chestB;
        const lotA = a.lotNumber ? Number(a.lotNumber) : 999;
        const lotB = b.lotNumber ? Number(b.lotNumber) : 999;
        if (lotA !== lotB) return lotA - lotB;
        return (a.schoolName || '').localeCompare(b.schoolName || '');
      });
  }, [teams, isLocalhost]);

  // Daftar semua ruang kandidat basecamp dari floorplan
  const candidateRooms = useMemo(() => {
    return getAllRoomsFlat().filter(r => r.isBasecampCandidate);
  }, []);

  const getTeamStaging = (teamId) => staging?.[teamId] || staging?.basecamp?.[teamId] || null;

  const getTeamRoomCode = (team) => {
    if (!team) return '';
    const st = getTeamStaging(team.id);
    const raw = (
      st?.basecamp?.roomName ||
      st?.roomName ||
      st?.basecampRoom ||
      st?.room ||
      team.basecampRoom ||
      team.basecampNumber ||
      ''
    ).trim();
    if (!raw) return '';
    // Abaikan ruang non-basecamp (misal RB-1, RKB-1, RKB-2) jika pernah terplot sebelumnya
    const matchedCandidate = candidateRooms.find(
      r => r.code.toUpperCase() === raw.toUpperCase() || r.name.toUpperCase() === raw.toUpperCase()
    );
    return matchedCandidate ? matchedCandidate.code : '';
  };

  const getRoomMetaByCode = (code) => {
    if (!code) return null;
    const upper = code.trim().toUpperCase();
    return (
      candidateRooms.find(
        r => r.code.toUpperCase() === upper || r.name.toUpperCase() === upper
      ) || null
    );
  };

  const isTeamCheckedIn = (teamId) => {
    const st = getTeamStaging(teamId);
    return Boolean(st?.checkedIn || st?.basecampLogistics?.ktpDeposited || (st?.stage && st.stage !== 'waiting'));
  };

  const isTeamCheckedOut = (teamId) => {
    const st = getTeamStaging(teamId);
    return Boolean(st?.checkedOut || st?.stage === 'checkout' || st?.basecampLogistics?.ktpReturned);
  };

  const getTeamCheckInTime = (teamId) => {
    const st = getTeamStaging(teamId);
    return st?.checkedInAt || st?.basecampLogistics?.checkedInAt || 'Hadir';
  };

  const getTeamCheckOutTime = (teamId) => {
    const st = getTeamStaging(teamId);
    return st?.checkedOutAt || st?.basecampLogistics?.checkedOutAt || 'Selesai';
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

  // Map ruang yang sudah terisi (roomCode -> team[]) — mendukung 2 peleton dari 1 sekolah dalam 1 ruang
  const roomOccupancyMap = useMemo(() => {
    const map = new Map();
    competitionTeams.forEach(t => {
      const code = getTeamRoomCode(t);
      if (code) {
        const key = code.toUpperCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(t);
      }
    });
    return map;
  }, [competitionTeams, staging]);

  // Global stats untuk badge tab utama
  const globalStats = useMemo(() => {
    const total = competitionTeams.length;
    const assigned = competitionTeams.filter(t => Boolean(getTeamRoomCode(t))).length;
    const checkedIn = competitionTeams.filter(t => isTeamCheckedIn(t.id)).length;
    const checkedOut = competitionTeams.filter(t => isTeamCheckedOut(t.id)).length;
    const inVenue = competitionTeams.filter(t => isTeamCheckedIn(t.id) && !isTeamCheckedOut(t.id)).length;
    const sdTotal = competitionTeams.filter(t => t.jenjang === 'SD').length;
    const smpTotal = competitionTeams.filter(t => t.jenjang === 'SMP').length;
    return {
      total,
      assigned,
      unassigned: Math.max(0, total - assigned),
      checkedIn,
      pendingCheckIn: Math.max(0, total - checkedIn),
      checkedOut,
      inVenue,
      sdTotal,
      smpTotal,
    };
  }, [competitionTeams, staging]);

  // Stats khusus jenjang aktif (SD atau SMP)
  const jenjangTeams = useMemo(() => {
    return competitionTeams.filter(t => t.jenjang === activeJenjang);
  }, [competitionTeams, activeJenjang]);

  const jenjangStats = useMemo(() => {
    const total = jenjangTeams.length;
    const assigned = jenjangTeams.filter(t => Boolean(getTeamRoomCode(t))).length;
    const checkedIn = jenjangTeams.filter(t => isTeamCheckedIn(t.id)).length;
    const checkedOut = jenjangTeams.filter(t => isTeamCheckedOut(t.id)).length;
    const inVenue = jenjangTeams.filter(t => isTeamCheckedIn(t.id) && !isTeamCheckedOut(t.id)).length;
    return {
      total,
      assigned,
      unassigned: Math.max(0, total - assigned),
      checkedIn,
      pendingCheckIn: Math.max(0, total - checkedIn),
      checkedOut,
      inVenue,
    };
  }, [jenjangTeams, staging]);

  // Filtered teams untuk tabel aktif
  const visibleTeams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jenjangTeams.filter(team => {
      if (q) {
        const roomCode = getTeamRoomCode(team).toLowerCase();
        const matches =
          (team.schoolName && team.schoolName.toLowerCase().includes(q)) ||
          (team.schoolBaseName && team.schoolBaseName.toLowerCase().includes(q)) ||
          (team.platoonName && team.platoonName.toLowerCase().includes(q)) ||
          (team.dantonName && team.dantonName.toLowerCase().includes(q)) ||
          (team.officialName && team.officialName.toLowerCase().includes(q)) ||
          (team.regCode && team.regCode.toLowerCase().includes(q)) ||
          (team.chestNumber && String(team.chestNumber).toLowerCase().includes(q)) ||
          (team.lotNumber && String(team.lotNumber) === q) ||
          (roomCode && roomCode.includes(q));
        if (!matches) return false;
      }

      if (activeTab === 'placement') {
        const hasRoom = Boolean(getTeamRoomCode(team));
        if (statusFilterPlacement === 'assigned') return hasRoom;
        if (statusFilterPlacement === 'unassigned') return !hasRoom;
        return true;
      }

      if (activeTab === 'checkin') {
        const inFlag = isTeamCheckedIn(team.id);
        if (statusFilterCheckIn === 'pending') return !inFlag;
        if (statusFilterCheckIn === 'checkedin') return inFlag;
        return true;
      }

      if (activeTab === 'checkout') {
        const inFlag = isTeamCheckedIn(team.id);
        const outFlag = isTeamCheckedOut(team.id);
        if (statusFilterCheckOut === 'in_venue') return inFlag && !outFlag;
        if (statusFilterCheckOut === 'checkedout') return outFlag;
        return true;
      }

      return true;
    });
  }, [
    jenjangTeams,
    searchQuery,
    activeTab,
    statusFilterPlacement,
    statusFilterCheckIn,
    statusFilterCheckOut,
    staging
  ]);

  // Status pengesahan Denah Basecamp
  const isBasecampPublished = Boolean(settings?.basecampPublished && settings?.basecampRatifiedAt);

  const handleTogglePublishBasecamp = async () => {
    if (!canManagePlacement) return;
    if (isBasecampPublished) {
      const ok = await appConfirm('Buka kunci & tarik publikasi denah basecamp ke status DRAFT?', {
        title: 'Buka Kunci Denah',
        confirmText: 'Buka Kunci',
        variant: 'danger',
      });
      if (!ok) return;
      updateSettings({ basecampPublished: false, basecampRatifiedAt: null });
      showToast('Status denah basecamp dikembalikan ke DRAFT.');
    } else {
      const ok = await appConfirm('Sahkan & tayangkan alokasi ruang basecamp agar dapat dilihat oleh seluruh peserta di Portal Peserta?', {
        title: 'Sahkan Denah Basecamp',
        confirmText: 'Sahkan & Tayangkan',
        variant: 'success',
      });
      if (!ok) return;
      updateSettings({
        basecampPublished: true,
        basecampRatifiedAt: new Date().toISOString(),
      });
      showToast('Alokasi Basecamp resmi DISAHKAN & ditayangkan ke Portal Peserta!');
    }
  };

  // Assign satu ruang basecamp ke satu peleton
  const handleAssignRoom = (team, roomCode) => {
    if (!canManagePlacement || !team) return;
    const cleanCode = (roomCode || '').trim();
    const roomMeta = getRoomMetaByCode(cleanCode);
    const existing = getTeamStaging(team.id);
    const currentStage = existing?.stage || 'waiting';

    updateTeamStaging(team.id, currentStage, {
      roomName: cleanCode,
      basecampRoom: cleanCode,
      room: cleanCode,
      basecamp: {
        ...(existing?.basecamp || {}),
        roomName: cleanCode,
        roomLabel: roomMeta?.name || '',
        floor: roomMeta?.floor || null,
      },
    });

    if (cleanCode) {
      showToast(`Ruang ${cleanCode} ditetapkan untuk ${team.schoolName}.`);
    } else {
      showToast(`Penempatan ruang ${team.schoolName} dikosongkan.`);
    }
  };

  // Normalisasi nama sekolah dasar untuk mendeteksi 2 peleton dari 1 sekolah (misal "... A" & "... B")
  const getNormalizedSchoolKey = (team) => {
    const raw = (team?.schoolBaseName || team?.schoolName || '').trim().toUpperCase();
    return raw
      .replace(/\s+(TIM|PELETON|REGU|PASUKAN)?\s*(A|B|C|D|1|2|3|I|II|III|PUTRA|PUTRI|PA|PI)$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Deteksi sekolah yang mengirim >= 2 peleton pada jenjang aktif (untuk penanda "1 Sekolah")
  const twinSchoolKeys = useMemo(() => {
    const counts = new Map();
    jenjangTeams.forEach((t) => {
      const key = getNormalizedSchoolKey(t);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });
    const set = new Set();
    counts.forEach((cnt, key) => {
      if (cnt >= 2) set.add(key);
    });
    return set;
  }, [jenjangTeams]);

  // Warna pill ruang berdasarkan lantai (subtle & informatif)
  const getFloorBadgeTone = (floor) => {
    switch (Number(floor)) {
      case 1:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/90';
      case 2:
        return 'bg-blue-50 text-blue-800 border-blue-200/90';
      case 3:
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/90';
      case 4:
        return 'bg-amber-50 text-amber-800 border-amber-200/90';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Daftar ruang kandidat terurut dari Lantai 1 -> 2 -> 3 -> 4 (Lantai 4 prioritas terakhir) beserta metadata koridor fisik
  const orderedCandidateRooms = useMemo(() => {
    const rooms = [];
    const sortedFloors = [...FLOORS_CONFIG].sort((a, b) => a.floor - b.floor);
    sortedFloors.forEach(fl => {
      fl.zones.forEach(zn => {
        let orderInZone = 0;
        zn.rooms.forEach(rm => {
          if (rm.isBasecampCandidate) {
            rooms.push({
              ...rm,
              floor: fl.floor,
              zoneId: zn.id,
              orderInZone,
            });
            orderInZone++;
          }
        });
      });
    });
    return rooms;
  }, []);

  // Auto-Alokasi Cerdas sesuai 4 Prioritas:
  // 1. Sekolah yang mengirim 2 peleton digabung dalam 1 ruang basecamp yang sama
  // 2. Isi dari lantai bawah (Lantai 1 -> 2 -> 3) dengan SD diprioritaskan terlebih dahulu
  // 3. Diurutkan berdasarkan No. Dada (dari kecil ke besar)
  // 4. Lantai 4 prioritas terakhir (hanya dipakai jika Lantai 1-3 sudah penuh)
  const handleAutoAssignSmart = async () => {
    if (!canManagePlacement) return;

    const unassignedAll = competitionTeams.filter(t => !getTeamRoomCode(t));
    if (unassignedAll.length === 0) {
      showToast('Semua peleton (SD & SMP) sudah memiliki ruang basecamp.');
      return;
    }

    const occupied = new Set(roomOccupancyMap.keys());
    const availableCount = orderedCandidateRooms.filter(r => !occupied.has(r.code.toUpperCase())).length;

    const unassignedSdCount = unassignedAll.filter(t => t.jenjang === 'SD').length;
    const unassignedSmpCount = unassignedAll.filter(t => t.jenjang === 'SMP').length;

    // Hitung apakah masih ada ruang kosong ATAU kembaran sekolah sudah punya ruang
    const existingSchoolRoomMap = new Map(); // `${jenjang}::${schoolKey}` -> room
    competitionTeams.forEach(t => {
      const code = getTeamRoomCode(t);
      if (code) {
        const meta = orderedCandidateRooms.find(r => r.code.toUpperCase() === code.toUpperCase());
        if (meta) {
          existingSchoolRoomMap.set(`${t.jenjang}::${getNormalizedSchoolKey(t)}`, meta);
        }
      }
    });

    const canShareAny = unassignedAll.some(t => existingSchoolRoomMap.has(`${t.jenjang}::${getNormalizedSchoolKey(t)}`));
    if (availableCount === 0 && !canShareAny) {
      appAlert('Tidak ada ruang basecamp kosong yang tersisa di denah.', { title: 'Ruang Penuh', variant: 'warning' });
      return;
    }

    const ok = await appConfirm(
      `Jalankan Auto-Plot Cerdas untuk ${unassignedAll.length} peleton (${unassignedSdCount} SD, ${unassignedSmpCount} SMP)?\n\n` +
      `Prioritas:\n` +
      `1. Sekolah dengan 2 peleton digabung dalam 1 ruang basecamp\n` +
      `2. Diisi dari lantai bawah (SD diprioritaskan dulu)\n` +
      `3. Diurutkan berdasarkan No. Dada\n` +
      `4. Lantai 4 prioritas terakhir`,
      { title: 'Auto-Plot Ruang Basecamp', confirmText: 'Jalankan Auto-Plot', variant: 'info' }
    );
    if (!ok) return;

    // Track ruang yang dipakai secara dinamis selama perhitungan
    const usedCodes = new Set(occupied);
    const assignedMap = new Map(); // teamId -> room

    const isFree = (room) => room && !usedCodes.has(room.code.toUpperCase());

    const takeRoom = (team, room) => {
      usedCodes.add(room.code.toUpperCase());
      assignedMap.set(team.id, room);
    };

    // Cari 1 ruang kosong terbawah (Lantai 1 -> 2 -> 3 -> 4)
    const findLowestFreeRoom = () => {
      for (const floorNum of [1, 2, 3, 4]) {
        const found = orderedCandidateRooms.find(r => r.floor === floorNum && isFree(r));
        if (found) return found;
      }
      return null;
    };

    // Helper angka No. Dada untuk mengurutkan alokasi ruang (Prioritas 3)
    const getChestSortValue = (team) => {
      if (team?.chestNumber !== undefined && team?.chestNumber !== null && team?.chestNumber !== '') {
        const num = parseInt(String(team.chestNumber).replace(/[^\d]/g, ''), 10);
        if (Number.isFinite(num)) return num;
      }
      return team?.lotNumber ? 100000 + Number(team.lotNumber) : Number.MAX_SAFE_INTEGER;
    };

    // Proses jenjang berurutan: SD DULU, baru SMP (Prioritas 2)
    ['SD', 'SMP'].forEach(jenjangKey => {
      const jenjangUnassigned = unassignedAll
        .filter(t => t.jenjang === jenjangKey)
        .sort((a, b) => {
          const ca = getChestSortValue(a);
          const cb = getChestSortValue(b);
          if (ca !== cb) return ca - cb;
          return (a.schoolName || '').localeCompare(b.schoolName || '');
        });
      if (jenjangUnassigned.length === 0) return;

      // Kelompokkan per sekolah (tetap terurut No. Dada di dalam grup)
      const schoolGroups = new Map();
      jenjangUnassigned.forEach(team => {
        const key = getNormalizedSchoolKey(team) || team.id;
        if (!schoolGroups.has(key)) schoolGroups.set(key, []);
        schoolGroups.get(key).push(team);
      });

      const withExistingRoom = [];
      const orderedUnits = [];

      schoolGroups.forEach((group, key) => {
        const existingRoom = existingSchoolRoomMap.get(`${jenjangKey}::${key}`);
        if (existingRoom) {
          withExistingRoom.push({ key, teams: group, refRoom: existingRoom });
        } else {
          const minChest = Math.min(...group.map(getChestSortValue));
          orderedUnits.push({ key, teams: group, minChest });
        }
      });

      // Urutkan unit sekolah berdasarkan No. Dada terkecil (Prioritas 3)
      orderedUnits.sort((a, b) => {
        if (a.minChest !== b.minChest) return a.minChest - b.minChest;
        return a.key.localeCompare(b.key);
      });

      // 1A. Peleton yang kembaran sekolahnya sudah terplot -> gabung di ruang yang sama
      withExistingRoom.forEach(({ teams: group, refRoom }) => {
        group.forEach(team => takeRoom(team, refRoom));
      });

      // 1B. Plot 1 ruang per sekolah sesuai urutan No. Dada dari lantai bawah (2 peleton 1 sekolah = 1 ruang)
      orderedUnits.forEach(({ teams: group }) => {
        const room = findLowestFreeRoom();
        if (room) {
          group.forEach(team => takeRoom(team, room));
        }
      });
    });

    // Simpan semua hasil plot ke staging & cloud database dalam 1 transaksi bulk
    const batchUpdates = [];
    assignedMap.forEach((room, teamId) => {
      const existing = getTeamStaging(teamId);
      const currentStage = existing?.stage || 'waiting';
      batchUpdates.push({
        teamId,
        newStage: currentStage,
        updates: {
          roomName: room.code,
          basecampRoom: room.code,
          room: room.code,
          basecamp: {
            ...(existing?.basecamp || {}),
            roomName: room.code,
            roomLabel: room.name,
            floor: room.floor,
          },
        },
      });
    });

    if (typeof bulkUpdateTeamStaging === 'function') {
      bulkUpdateTeamStaging(batchUpdates);
    } else {
      batchUpdates.forEach(({ teamId, newStage, updates }) => updateTeamStaging(teamId, newStage, updates));
    }

    showToast(`Auto-Plot selesai! ${assignedMap.size} peleton ditempatkan (1 sekolah = 1 basecamp, SD lantai bawah, urut No. Dada).`);
  };

  // Reset semua penempatan ruang basecamp
  const handleResetAllPlacement = async () => {
    if (!canManagePlacement) return;
    const assignedList = competitionTeams.filter(t => Boolean(getTeamRoomCode(t)));
    if (assignedList.length === 0) return;
    const ok = await appConfirm(
      `Kosongkan penempatan ruang basecamp untuk seluruh ${assignedList.length} peleton agar bisa diplot ulang dari awal?`,
      { title: 'Reset Penempatan Ruang', confirmText: 'Kosongkan Semua', variant: 'danger' }
    );
    if (!ok) return;
    const batchReset = assignedList.map(team => {
      const existing = getTeamStaging(team.id);
      const currentStage = existing?.stage || 'waiting';
      return {
        teamId: team.id,
        newStage: currentStage,
        updates: {
          roomName: '',
          basecampRoom: '',
          room: '',
          basecamp: {
            ...(existing?.basecamp || {}),
            roomName: '',
            roomLabel: '',
            floor: null,
          },
        },
      };
    });
    if (typeof bulkUpdateTeamStaging === 'function') {
      bulkUpdateTeamStaging(batchReset);
    } else {
      batchReset.forEach(({ teamId, newStage, updates }) => updateTeamStaging(teamId, newStage, updates));
    }
    showToast(`Seluruh penempatan ruang basecamp (${assignedList.length} peleton) telah dikosongkan.`);
  };

  // Buka Modal Check-In / Check-Out
  const openActionModal = (team, mode) => {
    if (!team) return;
    setModalTeamId(team.id);
    setModalMode(mode);
    if (mode === 'checkin') {
      const st = getTeamStaging(team.id);
      setKtpOfficialName(st?.basecampLogistics?.ktpOfficialName || team.officialName || team.coachName || '');
      setKtpType(st?.basecampLogistics?.ktpType || 'KTP Fisik');
      setLogisticsChecklist({
        waterBox: true,
        chestNumber: true,
        cocardOfficial: true,
        trashBag: true,
      });
    } else {
      setCheckoutChecklist({
        roomCleanChecked: true,
        sortedTrashReturned: true,
        ktpReturned: true,
      });
    }
  };

  const handleProcessCheckIn = (e) => {
    e.preventDefault();
    if (!canProcess || !modalTeamId) return;
    if (!ktpOfficialName.trim()) {
      appAlert('Nama pemilik identitas (KTP Pembina) wajib diisi!', { title: 'Data Belum Lengkap', variant: 'warning' });
      return;
    }

    checkInBasecamp(modalTeamId, {
      ktpOfficialName: ktpOfficialName.trim(),
      ktpType,
      logistics: logisticsChecklist,
      checkedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    const targetTeam = teams.find(t => t.id === modalTeamId);
    showToast(`Check-In berhasil: ${targetTeam?.schoolName || ''} telah tercatat hadir & menerima logistik!`);
    setModalTeamId(null);
    setKtpOfficialName('');
  };

  const handleProcessCheckOut = async (e) => {
    e.preventDefault();
    if (!canProcess || !modalTeamId) return;

    if (!checkoutChecklist.roomCleanChecked || !checkoutChecklist.sortedTrashReturned || !checkoutChecklist.ktpReturned) {
      const ok = await appConfirm('Beberapa checklist kliring/pengembalian KTP belum dicentang. Tetap lanjutkan Check-Out?', {
        title: 'Checklist Belum Lengkap',
        confirmText: 'Tetap Check-Out',
        variant: 'warning',
      });
      if (!ok) return;
    }

    checkOutBasecamp(modalTeamId, {
      ...checkoutChecklist,
      checkedOutAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    const targetTeam = teams.find(t => t.id === modalTeamId);
    showToast(`Check-Out selesai: ${targetTeam?.schoolName || ''} telah kliring & KTP dikembalikan!`);
    setModalTeamId(null);
  };

  // Scan QR -> langsung deteksi & buka modal sesuai tab aktif (atau pilih jenjangnya di placement)
  const handleQRScanResult = (scannedText) => {
    let q = (scannedText || '').trim();
    if (!q) return;

    if (q.includes('?reg=')) {
      try {
        const urlObj = new URL(q.startsWith('http') ? q : `https://${q}`);
        const regParam = urlObj.searchParams.get('reg');
        if (regParam) q = regParam;
      } catch {
        const match = q.match(/[?&]reg=([^&#]+)/);
        if (match && match[1]) q = decodeURIComponent(match[1]);
      }
    }

    const qLower = q.toLowerCase();
    const matched = competitionTeams.find(t =>
      (t.regCode && t.regCode.toLowerCase() === qLower) ||
      (t.id && t.id.toLowerCase() === qLower) ||
      (t.lotNumber && String(t.lotNumber) === qLower) ||
      (t.schoolName && t.schoolName.toLowerCase().includes(qLower)) ||
      (t.dantonName && t.dantonName.toLowerCase().includes(qLower))
    );

    if (matched) {
      if (matched.jenjang === 'SD' || matched.jenjang === 'SMP') {
        setActiveJenjang(matched.jenjang);
      }
      if (activeTab === 'checkout') {
        openActionModal(matched, 'checkout');
      } else {
        openActionModal(matched, 'checkin');
      }
    } else {
      appAlert(`Peleton dengan kode/nama "${scannedText}" tidak ditemukan.`, { title: 'Tidak Ditemukan', variant: 'warning' });
    }
  };

  const modalTeam = modalTeamId ? teams.find(t => t.id === modalTeamId) : null;
  const modalTeamRoom = modalTeam ? getTeamRoomCode(modalTeam) : '';

  return (
    <SimpaskorSidebarLayout
      activeMenu={activeTab === 'checkout' ? 'checkout' : 'checkin'}
      title="Manajemen Basecamp & Check-In/Out"
      subtitle="Penempatan ruang transit peleton, presensi kedatangan hari-H, logistik, dan kliring kepulangan"
      hideHeader={true}
    >
      <div className="space-y-4 sm:space-y-5">

        {/* Floating Toast Notification (pojok kanan bawah, tanpa menggeser layout) */}
        {toastMsg && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] sm:w-auto bg-white text-slate-800 pl-3 pr-2.5 py-2.5 rounded-xl border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.12)] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 leading-snug pr-1">
              {toastMsg}
            </span>
            <button
              type="button"
              onClick={() => setToastMsg('')}
              aria-label="Tutup notifikasi"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* MASTER PANEL: 1 NAVIGASI UTAMA 3 LANGKAH (ZERO CONFUSION)      */}
        {/* ============================================================== */}
        <section className="w-full max-w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden">

          {/* 1. Header Judul + Status Ringkas */}
          <div className="px-4 py-4 sm:px-5 sm:py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                {activeTab === 'placement' ? (
                  <Building2 className="w-4.5 h-4.5 text-amber-400" />
                ) : activeTab === 'checkin' ? (
                  <LogIn className="w-4.5 h-4.5 text-emerald-400" />
                ) : (
                  <LogOut className="w-4.5 h-4.5 text-rose-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[15px] sm:text-base font-black uppercase tracking-tight text-slate-950 leading-tight">
                    Manajemen Basecamp &amp; Presensi Hari-H
                  </h1>
                  {activeTab === 'placement' && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      isBasecampPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isBasecampPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{isBasecampPublished ? 'Denah Sah' : 'Denah Draft'}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  {activeTab === 'placement'
                    ? 'Langkah 1: Atur penempatan ruang kelas basecamp untuk setiap peleton & sahkan denah.'
                    : activeTab === 'checkin'
                    ? 'Langkah 2: Catat kedatangan peleton, terima KTP jaminan pembina, dan serahkan paket logistik.'
                    : 'Langkah 3: Cek kebersihan ruang transit, setoran sampah terpilah, dan kembalikan KTP pembina.'}
                </p>
              </div>
            </div>

            {/* KPI Ringkas Sesuai Tab Aktif */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {activeTab === 'placement' ? (
                <>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Terplot</span>
                    <span className="text-xs font-black font-mono text-slate-900">{globalStats.assigned}/{globalStats.total}</span>
                  </div>
                  {canManagePlacement && (
                    <button
                      type="button"
                      onClick={handleTogglePublishBasecamp}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                        isBasecampPublished
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      {isBasecampPublished ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Buka Kunci</span>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Sahkan Denah</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : activeTab === 'checkin' ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Tiba</span>
                    <span className="text-xs font-black font-mono text-emerald-900">{globalStats.checkedIn}/{globalStats.total}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-700">Belum</span>
                    <span className="text-xs font-black font-mono text-amber-900">{globalStats.pendingCheckIn}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-700">Di Lokasi</span>
                    <span className="text-xs font-black font-mono text-amber-900">{globalStats.inVenue}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-700">Pulang</span>
                    <span className="text-xs font-black font-mono text-blue-900">{globalStats.checkedOut}/{globalStats.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Dark Obsidian 3-Step Workflow Bar */}
          <div className="grid grid-cols-3 bg-slate-950 text-white border-t border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('placement')}
              className={`relative py-3 px-2 sm:px-4 text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border-r border-slate-800 ${
                activeTab === 'placement'
                  ? 'bg-slate-900 text-white font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'placement' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="truncate">1. Penempatan<span className="hidden md:inline"> Basecamp</span></span>
              <span className={`hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'placement' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/25' : 'bg-slate-800 text-slate-400'
              }`}>
                {globalStats.assigned}/{globalStats.total}
              </span>
              {activeTab === 'placement' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checkin')}
              className={`relative py-3 px-2 sm:px-4 text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border-r border-slate-800 ${
                activeTab === 'checkin'
                  ? 'bg-slate-900 text-white font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold'
              }`}
            >
              <LogIn className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'checkin' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="truncate">2. Check-In<span className="hidden md:inline"> Kedatangan</span></span>
              <span className={`hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'checkin' ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/25' : 'bg-slate-800 text-slate-400'
              }`}>
                {globalStats.checkedIn}/{globalStats.total}
              </span>
              {activeTab === 'checkin' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checkout')}
              className={`relative py-3 px-2 sm:px-4 text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'checkout'
                  ? 'bg-slate-900 text-white font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold'
              }`}
            >
              <LogOut className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'checkout' ? 'text-rose-400' : 'text-slate-500'}`} />
              <span className="truncate">3. Check-Out<span className="hidden md:inline"> Kepulangan</span></span>
              <span className={`hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'checkout' ? 'bg-rose-400/15 text-rose-300 border border-rose-400/25' : 'bg-slate-800 text-slate-400'
              }`}>
                {globalStats.checkedOut}/{globalStats.total}
              </span>
              {activeTab === 'checkout' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
            </button>
          </div>

          {/* 3. Body Konten */}
          <div className="p-4 sm:p-5 space-y-3.5">

            {/* Toolbar Pencarian + Aksi Kontekstual */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1 min-w-0 lg:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'placement'
                      ? 'Cari sekolah, danton, atau kode ruang...'
                      : 'Cari sekolah, danton, no. dada, atau kode reg...'
                  }
                  className="w-full pl-9 pr-8 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Aksi Kanan Sesuai Tab */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {activeTab === 'placement' ? (
                  <>
                    {canManagePlacement && globalStats.unassigned > 0 && (
                      <button
                        type="button"
                        onClick={handleAutoAssignSmart}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                        title="Prioritas: 1) Sekolah dengan 2 peleton digabung 1 ruang, 2) Lantai bawah diprioritaskan SD, 3) Diurutkan berdasarkan No. Dada, 4) Lantai 4 terakhir"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Auto-Plot ({globalStats.unassigned})</span>
                      </button>
                    )}

                    {canManagePlacement && globalStats.assigned > 0 && (
                      <button
                        type="button"
                        onClick={handleResetAllPlacement}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                        title="Kosongkan semua plot ruang basecamp"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}

                    <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/90 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setPlacementViewMode('table')}
                        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          placementViewMode === 'table'
                            ? 'bg-white text-slate-900 font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Table2 className="w-3.5 h-3.5" />
                        <span>Tabel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlacementViewMode('map')}
                        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          placementViewMode === 'map'
                            ? 'bg-white text-slate-900 font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span>Peta Denah</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="w-full sm:w-auto px-3.5 py-2 bg-slate-950 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Scan QR Peleton</span>
                  </button>
                )}
              </div>
            </div>

            {/* Jika di Tab Penempatan & Mode Peta Denah */}
            {activeTab === 'placement' && placementViewMode === 'map' ? (
              <div className="pt-1">
                <InteractiveBasecampMap
                  teams={competitionTeams}
                  staging={staging}
                  selectedTeamId={modalTeamId}
                  searchQuery={searchQuery}
                  onActionTeam={(team, mode) => {
                    if (team) openActionModal(team, mode);
                  }}
                />
              </div>
            ) : (
              <>
                {/* Bar Filter Jenjang (SD / SMP) + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
                  {/* Switcher SD / SMP */}
                  <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 gap-1 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveJenjang('SD')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeJenjang === 'SD'
                          ? 'bg-red-600 text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      <span>SD / MI</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ${
                        activeJenjang === 'SD' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {globalStats.sdTotal}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveJenjang('SMP')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeJenjang === 'SMP'
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      <span>SMP / MTs</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ${
                        activeJenjang === 'SMP' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {globalStats.smpTotal}
                      </span>
                    </button>
                  </div>

                  {/* Filter Status Sekunder */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold">
                    {activeTab === 'placement' ? (
                      <>
                        {[
                          { id: 'all', label: `Semua (${jenjangStats.total})` },
                          { id: 'unassigned', label: `Belum (${jenjangStats.unassigned})` },
                          { id: 'assigned', label: `Terplot (${jenjangStats.assigned})` },
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setStatusFilterPlacement(f.id)}
                            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                              statusFilterPlacement === f.id
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </>
                    ) : activeTab === 'checkin' ? (
                      <>
                        {[
                          { id: 'all', label: `Semua (${jenjangStats.total})` },
                          { id: 'pending', label: `Belum Tiba (${jenjangStats.pendingCheckIn})` },
                          { id: 'checkedin', label: `Sudah Tiba (${jenjangStats.checkedIn})` },
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setStatusFilterCheckIn(f.id)}
                            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                              statusFilterCheckIn === f.id
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          { id: 'in_venue', label: `Di Lokasi (${jenjangStats.inVenue})` },
                          { id: 'checkedout', label: `Sudah Pulang (${jenjangStats.checkedOut})` },
                          { id: 'all', label: `Semua (${jenjangStats.total})` },
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setStatusFilterCheckOut(f.id)}
                            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                              statusFilterCheckOut === f.id
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Tabel Terstruktur By Content */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse table-auto">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200/90">
                          <th className="py-2.5 px-3 text-center w-[1%] whitespace-nowrap">No. Dada</th>
                          <th className="py-2.5 px-3">Peleton / Sekolah</th>
                          <th className="py-2.5 px-3 hidden lg:table-cell whitespace-nowrap">Danton</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">
                            {activeTab === 'placement' ? 'Ruang Basecamp' : 'Ruang Basecamp'}
                          </th>
                          <th className="py-2.5 px-3 text-right w-[1%] whitespace-nowrap">
                            {activeTab === 'placement' ? 'Status' : 'Aksi'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleTeams.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-xs text-slate-400 font-medium">
                              Tidak ada peleton {activeJenjang} yang cocok dengan filter saat ini.
                            </td>
                          </tr>
                        ) : (
                          visibleTeams.map((team, idx) => {
                            const roomCode = getTeamRoomCode(team);
                            const roomMeta = getRoomMetaByCode(roomCode);
                            const checkedIn = isTeamCheckedIn(team.id);
                            const checkedOut = isTeamCheckedOut(team.id);
                            const dantonName = team.dantonName || team.roster?.danton?.name || '-';
                            const st = getTeamStaging(team.id);
                            const ktpHolder = st?.basecampLogistics?.ktpOfficialName || '';
                            const checkInTime = getTeamCheckInTime(team.id);

                            return (
                              <tr key={team.id} className="hover:bg-slate-50/70 transition-colors">
                                {/* No. Dada */}
                                <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 text-xs whitespace-nowrap align-middle">
                                  {team.chestNumber ? (
                                    <span className="inline-flex items-center justify-center min-w-[36px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 text-[11px] font-bold">
                                      {team.chestNumber}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">
                                      {team.lotNumber ? `#${String(team.lotNumber).padStart(2, '0')}` : '—'}
                                    </span>
                                  )}
                                </td>

                                {/* Peleton / Sekolah */}
                                <td className="py-2 px-3 align-middle">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                                      <img
                                        src={getTeamLogo(team)}
                                        alt={team.schoolName}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = getFallbackAvatar(team);
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug truncate">
                                        {team.schoolName}
                                      </div>
                                      <div className="lg:hidden text-[10.5px] text-slate-400 truncate">
                                        {dantonName}
                                      </div>
                                      {activeTab === 'checkout' && checkedIn && (ktpHolder || checkInTime) && (
                                        <div className="text-[10.5px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                          {ktpHolder && (
                                            <span className="font-semibold text-slate-700">KTP: {ktpHolder}</span>
                                          )}
                                          {checkInTime && (
                                            <span className="text-slate-400">· Masuk {checkInTime}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Danton */}
                                <td className="py-2 px-3 hidden lg:table-cell align-middle">
                                  <div className="text-[11.5px] font-semibold text-slate-800 leading-snug">
                                    {dantonName}
                                  </div>
                                </td>

                                {/* Ruang Basecamp */}
                                <td className="py-2 px-3 align-middle whitespace-nowrap">
                                  {activeTab === 'placement' ? (
                                    <select
                                      value={roomCode}
                                      disabled={!canManagePlacement}
                                      onChange={(e) => handleAssignRoom(team, e.target.value)}
                                      className={`w-44 sm:w-52 max-w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-all cursor-pointer ${
                                        roomCode
                                          ? getFloorBadgeTone(roomMeta?.floor)
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                      }`}
                                    >
                                      <option value="">— Belum Diplot —</option>
                                      {candidateRooms.map(room => {
                                        const occupants = roomOccupancyMap.get(room.code.toUpperCase()) || [];
                                        const otherOccupants = occupants.filter(o => o.id !== team.id);
                                        const teamSchoolKey = getNormalizedSchoolKey(team);
                                        const hasDifferentSchool = otherOccupants.some(
                                          o => o.jenjang !== team.jenjang || getNormalizedSchoolKey(o) !== teamSchoolKey
                                        );
                                        const hasSameSchool = otherOccupants.length > 0 && !hasDifferentSchool;
                                        return (
                                          <option key={room.id} value={room.code} disabled={hasDifferentSchool}>
                                            {room.code} · {room.name} (Lt.{room.floor})
                                            {hasDifferentSchool ? ' [Dipakai]' : hasSameSchool ? ' [1 Sekolah]' : ''}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  ) : roomCode ? (
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${getFloorBadgeTone(roomMeta?.floor)}`}>
                                      <DoorOpen className="w-3.5 h-3.5 opacity-75" />
                                      <span>{roomCode}{roomMeta?.floor ? ` · Lt.${roomMeta.floor}` : ''}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-medium text-slate-400 italic">
                                      Belum diplot
                                    </span>
                                  )}
                                </td>

                                {/* Status / Aksi */}
                                <td className="py-2 px-3 text-right whitespace-nowrap align-middle">
                                  {activeTab === 'placement' ? (
                                    roomCode ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Terplot</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/90">
                                        <Clock className="w-3 h-3" />
                                        <span>Belum</span>
                                      </span>
                                    )
                                  ) : activeTab === 'checkin' ? (
                                    checkedIn ? (
                                      <div className="inline-flex items-center gap-1.5">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90">
                                          <CheckCircle2 className="w-3 h-3" />
                                          <span>Tiba {checkInTime}</span>
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => openActionModal(team, 'checkin')}
                                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer transition-colors"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled={!canProcess}
                                        onClick={() => openActionModal(team, 'checkin')}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                                      >
                                        <LogIn className="w-3.5 h-3.5" />
                                        <span>Check-In</span>
                                      </button>
                                    )
                                  ) : checkedOut ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/90">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Pulang {getTeamCheckOutTime(team.id)}</span>
                                    </span>
                                  ) : checkedIn ? (
                                    <button
                                      type="button"
                                      disabled={!canProcess}
                                      onClick={() => openActionModal(team, 'checkout')}
                                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                                    >
                                      <LogOut className="w-3.5 h-3.5" />
                                      <span>Check-Out</span>
                                    </button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/90">
                                      <span>Belum Tiba</span>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* MODAL FOKUS: FORMULIR CHECK-IN / CHECK-OUT                     */}
      {/* ============================================================== */}
      {modalTeam && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setModalTeamId(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={getTeamLogo(modalTeam)}
                    alt={modalTeam.schoolName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackAvatar(modalTeam);
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      modalMode === 'checkin'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {modalMode === 'checkin' ? 'Formulir Check-In' : 'Formulir Check-Out'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {modalTeam.regCode}
                    </span>
                    {modalTeamRoom && (
                      <span className="font-mono text-[10px] font-bold bg-slate-200/80 text-slate-800 px-1.5 py-0.5 rounded">
                        Ruang {modalTeamRoom}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5">
                    {modalTeam.schoolName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalTeamId(null)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto">
              {modalMode === 'checkin' ? (
                <form onSubmit={handleProcessCheckIn} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider block">
                        1. Identitas Jaminan Pembina (KTP)
                      </label>
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          Nama Lengkap Sesuai Identitas:
                        </span>
                        <input
                          type="text"
                          value={ktpOfficialName}
                          onChange={e => setKtpOfficialName(e.target.value)}
                          placeholder="Contoh: Budi Santoso, S.Pd."
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          Jenis Kartu Identitas:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {['KTP Fisik', 'SIM'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setKtpType(type)}
                              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                ktpType === type
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider block">
                        2. Serah Terima Paket Logistik
                      </label>
                      <div className="space-y-2 text-xs">
                        {[
                          { key: 'waterBox', label: '1 Dus Air Minum Kemasan Botol' },
                          { key: 'chestNumber', label: '1 Nomor Dada Peleton (Dipasang di S2B1, Souvenir)' },
                          { key: 'cocardOfficial', label: '3 ID Card Resmi (1 Official + 2 Pendukung Resmi)' },
                          { key: 'trashBag', label: '2 Kantong Sampah Terpilah (Organik & Anorganik)' },
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={logisticsChecklist[item.key]}
                              onChange={e => setLogisticsChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-bold text-slate-800">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalTeamId(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!canProcess}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      Konfirmasi Check-In &amp; Terima KTP
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleProcessCheckOut} className="space-y-4">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                    <strong>Pemeriksaan Kliring (Batas 15.00 WIB):</strong> Pastikan ruang basecamp bersih &amp; fasilitas utuh (kerusakan aset dikenai ganti rugi + denda Rp 500.000), 2 kantong sampah terpilah disetorkan ke pos kebersihan, dan KTP/SIM jaminan dikembalikan ke Official.
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'roomCleanChecked', label: '1. Ruang Basecamp Bersih, Rapi & Inventaris/Fasilitas Kelas Utuh' },
                      { key: 'sortedTrashReturned', label: '2. 2 Kantong Sampah Terpilah (Organik & Anorganik) Disetorkan ke Pos Checkout' },
                      { key: 'ktpReturned', label: '3. Bukti Lolos Verifikasi Diterbitkan & KTP/SIM Asli Diserahkan Kembali ke Official' },
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checkoutChecklist[item.key]}
                          onChange={e => setCheckoutChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span className="font-bold text-slate-900">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalTeamId(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!canProcess}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      Konfirmasi Check-Out &amp; Kembalikan KTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Fullscreen Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanResult}
      />
    </SimpaskorSidebarLayout>
  );
}
