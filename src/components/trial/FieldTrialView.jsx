import React, { useState, useMemo, useEffect } from 'react';
import { appConfirm } from '../../utils/appDialog.js';
import {
  Compass,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  X,
  Zap,
  Unlock,
  FileCheck,
  AlertCircle,
  LogIn,
  LogOut,
  Search,
  Filter,
  Edit3,
  Printer,
  Users,
  RotateCcw,
  FileSpreadsheet,
  Check,
  CalendarCheck,
  Layers,
  ArrowRight,
  Info,
  Activity,
  UserCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE } from '../../config.js';
import { formatImageUrl } from '../../services/sheetService.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import {
  generateSmartTrialPlan,
  TRIAL_TIME_SLOTS,
  normalizeSchoolName,
  isTeamWillingToTrial
} from './trialPlanGenerator.js';

export default function FieldTrialView() {
  const { teams, settings, updateSettings, role, currentUser, currentTeam } = useCompetition();

  // Role permissions
  const userRole = currentUser?.role || (currentTeam ? 'peserta' : (role || 'publik'));
  const isPeserta = userRole === 'peserta';
  const isStaff = userRole === 'panitia' || userRole === 'admin' || userRole === 'superadmin';
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('172.') ||
    window.location.hostname.startsWith('10.')
  );
  const isPublished = Boolean((settings?.trialSchedulePublished && settings?.trialScheduleRatifiedAt) || isLocalhost);

  // Interactive Swap & Team Assign state for Panitia
  const [swapSource, setSwapSource] = useState(null); // { jenjang: 'SD'|'SMP', slotIdx: number, teamId: string }
  const [teamPickerTarget, setTeamPickerTarget] = useState(null); // { jenjang: 'SD'|'SMP', slotIdx: number }
  const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [mobileArenaFilter, setMobileArenaFilter] = useState(() => {
    const raw = currentTeam?.jenjang || currentUser?.jenjang;
    if (raw) {
      const u = String(raw).toUpperCase();
      if (u.includes('SD') || u.includes('MI')) return 'SD';
      if (u.includes('SMP') || u.includes('MTS')) return 'SMP';
    }
    const name = currentTeam?.schoolName || currentUser?.schoolName || '';
    if (name) {
      const u = name.toUpperCase();
      if (/\b(SD|MI)\b/i.test(u)) return 'SD';
      if (/\b(SMP|MTS)\b/i.test(u)) return 'SMP';
    }
    return 'SD';
  });

  // Attendance management state (KIRI: Pos Presensi & Aksi)
  const [leftAttendanceTab, setLeftAttendanceTab] = useState('not_arrived'); // 'not_arrived' | 'checked_in' | 'checked_out'
  const [activeSelectedTeam, setActiveSelectedTeam] = useState(null); // { team, slotInfo, jenjang, slotIdx }
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedAttendanceTeam, setSelectedAttendanceTeam] = useState(null);
  const [showRecapModal, setShowRecapModal] = useState(false);

  // Attendance form inputs inside modal
  const [customCheckInTime, setCustomCheckInTime] = useState('');
  const [customCheckOutTime, setCustomCheckOutTime] = useState('');
  const [attendanceNotes, setAttendanceNotes] = useState('');

  const showToast = (msg, duration = 3000) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), duration);
  };

  // Helper map: teamId -> team object
  const teamsMap = useMemo(() => {
    const map = new Map();
    teams.forEach(t => map.set(t.id, t));
    return map;
  }, [teams]);

  // Signature hasil lotting TM saat ini agar jadwal UCL otomatis sinkron saat nomor undian TM berubah
  const currentTmLotSignature = useMemo(() => {
    return teams
      .filter(t => t.lotNumber)
      .map(t => `${t.id}:${t.lotNumber}`)
      .sort()
      .join('|');
  }, [teams]);

  // Current active plan: otomatis mengikuti hasil lotting TM (1 sekolah berdekatan) jika belum disesuaikan manual untuk lotting TM saat ini
  const currentPlan = useMemo(() => {
    const savedPlan = settings?.trialPlan;
    const hasValidSd = savedPlan?.SD?.slots?.some(Boolean);
    const hasValidSmp = savedPlan?.SMP?.slots?.some(Boolean);

    if ((hasValidSd || hasValidSmp) && savedPlan?.tmLotSignature === currentTmLotSignature) {
      return savedPlan;
    }
    return generateSmartTrialPlan(teams);
  }, [settings?.trialPlan, currentTmLotSignature, teams]);

  // Active attendance data from settings
  const trialAttendance = useMemo(() => {
    return settings?.trialAttendance || {};
  }, [settings?.trialAttendance]);

  // Slot Peleton Anda (Khusus Role Peserta)
  const myTeamTrialSlot = useMemo(() => {
    if (!currentTeam?.id) return null;
    const sdSlots = currentPlan?.SD?.slots || [];
    const smpSlots = currentPlan?.SMP?.slots || [];
    for (let i = 0; i < sdSlots.length; i++) {
      if (sdSlots[i] === currentTeam.id) {
        return {
          jenjang: 'SD',
          slotIdx: i,
          slotInfo: TRIAL_TIME_SLOTS[i] || { index: i + 1, time: '-' },
          attendance: trialAttendance[currentTeam.id] || null
        };
      }
    }
    for (let i = 0; i < smpSlots.length; i++) {
      if (smpSlots[i] === currentTeam.id) {
        return {
          jenjang: 'SMP',
          slotIdx: i,
          slotInfo: TRIAL_TIME_SLOTS[i] || { index: i + 1, time: '-' },
          attendance: trialAttendance[currentTeam.id] || null
        };
      }
    }
    return null;
  }, [currentTeam?.id, currentPlan, trialAttendance]);

  // Deteksi Jenjang Akun Peserta (SD atau SMP)
  const participantJenjang = useMemo(() => {
    if (myTeamTrialSlot?.jenjang) return myTeamTrialSlot.jenjang;
    if (currentTeam?.jenjang) {
      const j = String(currentTeam.jenjang).trim().toUpperCase();
      if (j.includes('SD') || j.includes('MI')) return 'SD';
      if (j.includes('SMP') || j.includes('MTS')) return 'SMP';
    }
    if (currentUser?.jenjang) {
      const j = String(currentUser.jenjang).trim().toUpperCase();
      if (j.includes('SD') || j.includes('MI')) return 'SD';
      if (j.includes('SMP') || j.includes('MTS')) return 'SMP';
    }
    const schoolName = currentTeam?.schoolName || currentUser?.schoolName || '';
    if (schoolName) {
      const upper = schoolName.toUpperCase();
      if (/\b(SD|MI)\b/i.test(upper) || upper.includes('SD ') || upper.includes('MI ')) return 'SD';
      if (/\b(SMP|MTS)\b/i.test(upper) || upper.includes('SMP ') || upper.includes('MTS ')) return 'SMP';
    }
    const teamId = currentTeam?.id || currentUser?.teamId || '';
    if (teamId) {
      const lower = teamId.toLowerCase();
      if (lower.includes('sd')) return 'SD';
      if (lower.includes('smp')) return 'SMP';
    }
    return null;
  }, [myTeamTrialSlot, currentTeam, currentUser]);

  // Jika akun adalah peserta SD / SMP, kunci arena matriks jadwal ke jenjang yang bersangkutan
  useEffect(() => {
    if (isPeserta && participantJenjang) {
      setMobileArenaFilter(participantJenjang);
    }
  }, [isPeserta, participantJenjang]);

  // Priority 1: Declined teams
  const declinedTeams = useMemo(() => {
    return teams.filter(t => !isTeamWillingToTrial(t));
  }, [teams]);

  // Format Jam Sekarang WIB (HH.mm WIB)
  const formatCurrentTimeWIB = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}.${mm} WIB`;
  };

  // Attendance Statistics (Global & Per Jenjang)
  const attendanceStats = useMemo(() => {
    const calcForSlots = (slots = []) => {
      let totalScheduled = 0;
      let checkedIn = 0;
      let checkedOut = 0;
      slots.forEach((teamId) => {
        if (!teamId) return;
        totalScheduled++;
        const att = trialAttendance[teamId];
        if (att?.status === 'checked_out') {
          checkedOut++;
        } else if (att?.status === 'checked_in') {
          checkedIn++;
        }
      });
      const notArrived = Math.max(0, totalScheduled - checkedIn - checkedOut);
      const percentDone = totalScheduled > 0 ? Math.round(((checkedIn + checkedOut) / totalScheduled) * 100) : 0;
      return { totalScheduled, checkedIn, checkedOut, notArrived, percentDone };
    };

    const sd = calcForSlots(currentPlan.SD?.slots);
    const smp = calcForSlots(currentPlan.SMP?.slots);
    const totalScheduled = sd.totalScheduled + smp.totalScheduled;
    const checkedIn = sd.checkedIn + smp.checkedIn;
    const checkedOut = sd.checkedOut + smp.checkedOut;
    const notArrived = Math.max(0, totalScheduled - checkedIn - checkedOut);
    const percentDone = totalScheduled > 0 ? Math.round(((checkedIn + checkedOut) / totalScheduled) * 100) : 0;

    return { totalScheduled, checkedIn, checkedOut, notArrived, percentDone, SD: sd, SMP: smp };
  }, [currentPlan, trialAttendance]);

  const activeJenjang = mobileArenaFilter === 'SMP' ? 'SMP' : 'SD';
  const activeAttendanceStats = attendanceStats[activeJenjang] || attendanceStats;

  const handleSelectJenjangTab = (jenjang) => {
    setMobileArenaFilter(jenjang);
    if (activeSelectedTeam && activeSelectedTeam.jenjang !== jenjang) {
      setActiveSelectedTeam(null);
    }
  };

  // Daftar Flat Seluruh Peleton Terjadwal untuk Panel Kiri
  const scheduledTeamsList = useMemo(() => {
    const list = [];
    TRIAL_TIME_SLOTS.forEach((slotInfo, slotIdx) => {
      const sdId = currentPlan.SD?.slots?.[slotIdx];
      const smpId = currentPlan.SMP?.slots?.[slotIdx];
      if (sdId && teamsMap.get(sdId)) {
        list.push({
          team: teamsMap.get(sdId),
          slotInfo,
          slotIdx,
          jenjang: 'SD',
          arenaName: 'Arena 1 (SD)'
        });
      }
      if (smpId && teamsMap.get(smpId)) {
        list.push({
          team: teamsMap.get(smpId),
          slotInfo,
          slotIdx,
          jenjang: 'SMP',
          arenaName: 'Arena 2 (SMP)'
        });
      }
    });
    return list;
  }, [currentPlan, teamsMap]);

  // Filter list untuk antrean aksi di panel kiri (dipisah per tab SD / SMP)
  const filteredActionList = useMemo(() => {
    return scheduledTeamsList.filter(item => {
      if (item.jenjang !== activeJenjang) return false;

      const att = trialAttendance[item.team.id];
      const status = att?.status;

      if (leftAttendanceTab === 'not_arrived') {
        if (status === 'checked_in' || status === 'checked_out') return false;
      } else if (leftAttendanceTab === 'checked_in') {
        if (status !== 'checked_in') return false;
      } else if (leftAttendanceTab === 'checked_out') {
        if (status !== 'checked_out') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.team.schoolName?.toLowerCase().includes(q);
        const matchPlatoon = item.team.platoonName?.toLowerCase().includes(q);
        const matchDanton = (item.team.dantonName || item.team.roster?.danton?.name || '')?.toLowerCase().includes(q);
        if (!matchName && !matchPlatoon && !matchDanton) return false;
      }

      return true;
    });
  }, [scheduledTeamsList, activeJenjang, trialAttendance, leftAttendanceTab, searchQuery]);

  // Quick Action: 1-Click Check-In (KIRI)
  const handleQuickCheckIn = (team, slotInfo) => {
    const timeNow = formatCurrentTimeWIB();
    const nextAttendance = {
      ...trialAttendance,
      [team.id]: {
        ...(trialAttendance[team.id] || {}),
        teamId: team.id,
        schoolName: team.schoolName,
        jenjang: team.jenjang,
        slotIndex: slotInfo.index,
        scheduledIn: slotInfo.checkIn || slotInfo.arrival,
        scheduledOut: slotInfo.checkOut,
        status: 'checked_in',
        checkInTime: timeNow,
        checkInTimestamp: new Date().toISOString(),
        checkedInBy: currentUser?.name || 'Panitia Uji Coba',
      }
    };
    updateSettings({ trialAttendance: nextAttendance });
    showToast(`✓ Check-In berhasil: ${team.schoolName} (${timeNow})`);
  };

  // Quick Action: 1-Click Check-Out (KIRI)
  const handleQuickCheckOut = (team, slotInfo) => {
    const timeNow = formatCurrentTimeWIB();
    const nextAttendance = {
      ...trialAttendance,
      [team.id]: {
        ...(trialAttendance[team.id] || {}),
        status: 'checked_out',
        checkOutTime: timeNow,
        checkOutTimestamp: new Date().toISOString(),
        checkedOutBy: currentUser?.name || 'Panitia Uji Coba',
      }
    };
    updateSettings({ trialAttendance: nextAttendance });
    showToast(`✓ Check-Out selesai: ${team.schoolName} (${timeNow})`);
  };

  // Open Attendance Modal for Custom Time / Notes
  const handleOpenAttendanceModal = (team, slotInfo, jenjang, slotIdx) => {
    const att = trialAttendance[team.id] || {};
    setSelectedAttendanceTeam({ team, slotInfo, jenjang, slotIdx });
    setCustomCheckInTime(att.checkInTime || slotInfo.checkIn || formatCurrentTimeWIB());
    setCustomCheckOutTime(att.checkOutTime || slotInfo.checkOut || formatCurrentTimeWIB());
    setAttendanceNotes(att.notes || '');
    setShowAttendanceModal(true);
  };

  // Save Custom Attendance from Modal
  const handleSaveAttendanceModal = (targetStatus) => {
    if (!selectedAttendanceTeam) return;
    const { team, slotInfo } = selectedAttendanceTeam;

    const currentAtt = trialAttendance[team.id] || {};
    const statusToSave = targetStatus || currentAtt.status || 'checked_in';

    const nextAttendance = {
      ...trialAttendance,
      [team.id]: {
        ...currentAtt,
        teamId: team.id,
        schoolName: team.schoolName,
        jenjang: team.jenjang,
        slotIndex: slotInfo.index,
        scheduledIn: slotInfo.checkIn || slotInfo.arrival,
        scheduledOut: slotInfo.checkOut,
        status: statusToSave,
        checkInTime: customCheckInTime || formatCurrentTimeWIB(),
        checkInTimestamp: currentAtt.checkInTimestamp || new Date().toISOString(),
        checkedInBy: currentAtt.checkedInBy || currentUser?.name || 'Panitia Uji Coba',
        checkOutTime: statusToSave === 'checked_out' ? (customCheckOutTime || formatCurrentTimeWIB()) : currentAtt.checkOutTime,
        checkOutTimestamp: statusToSave === 'checked_out' ? (currentAtt.checkOutTimestamp || new Date().toISOString()) : currentAtt.checkOutTimestamp,
        checkedOutBy: statusToSave === 'checked_out' ? (currentAtt.checkedOutBy || currentUser?.name || 'Panitia Uji Coba') : currentAtt.checkedOutBy,
        notes: attendanceNotes,
      }
    };
    updateSettings({ trialAttendance: nextAttendance });
    setShowAttendanceModal(false);
    showToast(`✓ Status presensi ${team.schoolName} diperbarui!`);
  };

  // Reset Attendance (Undo back to Belum Hadir)
  const handleResetAttendance = async (teamId) => {
    const ok = await appConfirm('Reset status presensi peleton ini kembali ke Belum Hadir?', {
      title: 'Reset Presensi',
      confirmText: 'Reset',
      variant: 'danger',
    });
    if (!ok) return;
    const nextAttendance = { ...trialAttendance };
    delete nextAttendance[teamId];
    updateSettings({ trialAttendance: nextAttendance });
    setShowAttendanceModal(false);
    showToast('Status presensi direset ke Belum Hadir.');
  };

  // Action: Auto Generate Plan based on 3 priorities
  const handleAutoGeneratePlan = () => {
    const newPlan = generateSmartTrialPlan(teams);
    updateSettings({ trialPlan: newPlan });
    setSwapSource(null);
    setTeamPickerTarget(null);
    showToast('⚡ Rencana jadwal berhasil disusun otomatis!');
  };

  // Action: Confirm Publish
  const handlePublishSchedule = () => {
    updateSettings({
      trialPlan: currentPlan,
      trialSchedulePublished: true,
      trialScheduleRatifiedAt: new Date().toISOString()
    });
    setShowConfirmPublishModal(false);
    showToast('📜 Jadwal Uji Coba Lapangan RESMI disahkan & ditayangkan ke peserta!');
  };

  // Action: Unpublish / Reopen
  const handleUnpublishSchedule = async () => {
    const ok = await appConfirm('Buka kunci jadwal untuk kembali ke mode DRAFT dan menyembunyikan jadwal dari peserta?', {
      title: 'Buka Kunci Jadwal',
      confirmText: 'Buka Kunci',
      variant: 'danger',
    });
    if (ok) {
      updateSettings({
        trialSchedulePublished: false,
        trialScheduleRatifiedAt: null
      });
      showToast('Jadwal kembali ke status DRAFT (disembunyikan dari peserta).');
    }
  };

  // Action: Swap slots
  const handleSlotClick = (jenjang, slotIdx, currentTeamId) => {
    if (!isStaff || isPublished) return;

    if (swapSource) {
      if (swapSource.jenjang === jenjang) {
        if (swapSource.slotIdx === slotIdx) {
          setSwapSource(null);
          return;
        }

        const nextPlan = JSON.parse(JSON.stringify(currentPlan));
        const temp = nextPlan[jenjang].slots[slotIdx];
        nextPlan[jenjang].slots[slotIdx] = nextPlan[jenjang].slots[swapSource.slotIdx];
        nextPlan[jenjang].slots[swapSource.slotIdx] = temp;

        updateSettings({ trialPlan: nextPlan });
        setSwapSource(null);
        showToast(`✓ Berhasil menukar posisi Slot #${swapSource.slotIdx + 1} dengan Slot #${slotIdx + 1}`);
        return;
      } else {
        setSwapSource({ jenjang, slotIdx, teamId: currentTeamId });
        return;
      }
    }

    if (!currentTeamId) {
      setTeamPickerTarget({ jenjang, slotIdx });
    } else {
      setSwapSource({ jenjang, slotIdx, teamId: currentTeamId });
    }
  };

  // Action: Remove team from slot
  const handleRemoveFromSlot = (e, jenjang, slotIdx) => {
    e.stopPropagation();
    if (!isStaff || isPublished) return;

    const nextPlan = JSON.parse(JSON.stringify(currentPlan));
    nextPlan[jenjang].slots[slotIdx] = null;
    updateSettings({ trialPlan: nextPlan });
    setSwapSource(null);
    showToast(`Peleton dicopot dari Slot #${slotIdx + 1}.`);
  };

  // Action: Assign team to empty slot
  const handleAssignTeamToSlot = (teamId) => {
    if (!teamPickerTarget) return;
    const { jenjang, slotIdx } = teamPickerTarget;

    const nextPlan = JSON.parse(JSON.stringify(currentPlan));
    nextPlan[jenjang].slots = nextPlan[jenjang].slots.map(id => id === teamId ? null : id);
    nextPlan[jenjang].slots[slotIdx] = teamId;

    updateSettings({ trialPlan: nextPlan });
    setTeamPickerTarget(null);
    showToast(`✓ Peleton berhasil ditempatkan di Slot #${slotIdx + 1}!`);
  };

  const getUnassignedTeams = (jenjang) => {
    const assignedIds = new Set(currentPlan[jenjang]?.slots?.filter(Boolean) || []);
    return teams.filter(t => t.jenjang === jenjang && !assignedIds.has(t.id));
  };

  // ========================================================
  // RENDER CARD KHUSUS JADWAL (BAGIAN KANAN: MURNI JADWAL)
  // Tampilan bersih, rapi, responsif, tanpa tombol aksi
  // ========================================================
  const renderScheduleOnlyCard = (team, jenjang, slotIdx, slotInfo, isTwin) => {
    if (!team) {
      return (
        <div
          onClick={() => isStaff && !isPublished && handleSlotClick(jenjang, slotIdx, null)}
          className={`py-2.5 sm:py-3.5 px-2 sm:px-3 rounded-xl border border-dashed text-center text-slate-400 transition-colors ${
            isStaff && !isPublished ? 'cursor-pointer hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-bold leading-tight block">
            {isStaff && !isPublished ? `+ Isi Peleton ${jenjang}` : '- Kosong -'}
          </span>
        </div>
      );
    }

    const isSwapSelected = swapSource?.jenjang === jenjang && swapSource?.slotIdx === slotIdx;
    const isTeamActiveSelected = activeSelectedTeam?.team?.id === team.id;
    const isMyTeam = (currentTeam?.id && team.id === currentTeam.id) || (currentUser?.teamId && team.id === currentUser.teamId);
    const att = trialAttendance[team.id];
    const isCheckedIn = att?.status === 'checked_in';
    const isCheckedOut = att?.status === 'checked_out';

    const themeBorder = 'border-slate-200 hover:border-slate-300';
    const themeAvatarBg = jenjang === 'SD' ? 'dc2626' : '2563eb';
    const dantonBadgeClass = jenjang === 'SD' ? 'bg-red-50 text-red-800 border-red-200/80' : 'bg-blue-50 text-blue-800 border-blue-200/80';
    const dantonLabelClass = jenjang === 'SD' ? 'text-red-600' : 'text-blue-600';

    return (
      <div
        onClick={() => {
          if (!isStaff) return;
          if (!isPublished && swapSource) {
            handleSlotClick(jenjang, slotIdx, team.id);
          } else {
            setActiveSelectedTeam({ team, slotInfo, jenjang, slotIdx });
          }
        }}
        className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between gap-1.5 shadow-2xs group transition-all relative ${
          isStaff ? 'cursor-pointer' : ''
        } ${
          isSwapSelected
            ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/50'
            : isTeamActiveSelected
            ? 'border-emerald-500 ring-2 ring-emerald-500 bg-emerald-50/20 shadow-xs'
            : isMyTeam
            ? 'border-2 border-emerald-500 ring-4 ring-emerald-400/20 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/30 shadow-md'
            : `${themeBorder} bg-white hover:bg-slate-50/40`
        }`}
        title={isStaff && !isPublished && swapSource ? 'Klik untuk menukar slot' : isStaff ? 'Klik untuk memilih di Pos Presensi Kiri' : team.schoolName}
      >
        {/* Atas: Nama Sekolah & Status / Peleton Anda */}
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 leading-snug line-clamp-2 break-words flex-1" title={team.schoolName}>
            {team.schoolName}
          </h4>

          <div className="flex items-center gap-1 shrink-0">
            {isMyTeam && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[8.5px] bg-emerald-600 text-white shadow-2xs shrink-0 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Peleton Anda</span>
              </span>
            )}

            {isCheckedOut ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Selesai ({att.checkOutTime})</span>
              </span>
            ) : isCheckedIn ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Di Lokasi ({att.checkInTime})</span>
              </span>
            ) : null}

            {/* Tombol Hapus dari Slot (Mode Draft Panitia) */}
            {isStaff && !isPublished && (
              <button
                type="button"
                onClick={(e) => handleRemoveFromSlot(e, jenjang, slotIdx)}
                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer -mt-0.5 -mr-0.5"
                title="Copot dari slot"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bawah: Nama Danton Bersih & Minimalis (Tanpa label Danton:) */}
        <div className="text-[11px] text-slate-600 truncate min-w-0 font-medium">
          {team.dantonName || team.roster?.danton?.name || '-'}
        </div>
      </div>
    );
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="uji_coba"
      title="Uji Coba Lapangan"
      subtitle="Jadwal gladi adaptasi kontur arena, alur lintasan, & orientasi lapangan LBB 2027"
      fullWidth={true}
      rightActions={
        <div className="flex items-center gap-2">
          {isStaff && (
            <button
              type="button"
              onClick={() => setShowRecapModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Lihat Rekap Presensi & Cetak"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Rekap Presensi</span>
            </button>
          )}

          <a
            href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Rute Maps</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      }
    >
      {/* Wrapper Utama */}
      <div className={isPeserta ? "max-w-6xl mx-auto space-y-4 sm:space-y-6" : ""}>

        {/* ======================================================== */}
        {/* 2 BAGIAN SPLIT: KIRI (POS AKSI PRESENSI) & KANAN (JADWAL) */}
        {/* ======================================================== */}
        <div className={`grid grid-cols-1 ${isStaff ? 'lg:grid-cols-12' : ''} gap-3.5 sm:gap-4 items-start`}>

        {/* -------------------------------------------------------- */}
        {/* BAGIAN KIRI: POS OPERASIONAL & AKSI CHECK-IN / CHECK-OUT  */}
        {/* KHUSUS ROLE STAFF / PANITIA (TIDAK TAMPIL UNTUK PESERTA) */}
        {/* -------------------------------------------------------- */}
        {isStaff && (
          <div className="lg:col-span-4 xl:col-span-4 space-y-3.5 lg:sticky lg:top-4">

          {/* MASTER CARD: POS PRESENSI & KONTROL GLADI */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Dark Obsidian Header + Embedded Jenjang Switcher */}
            <div className="bg-slate-950 text-white">
              <div className="px-4 py-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-400 border border-white/10 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-xs sm:text-sm uppercase tracking-tight text-white leading-tight truncate">
                      Pos Presensi Gladi
                    </h3>
                    <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                      {EVENT.FIELD_TRIAL_FULL_DATE || 'Sabtu, 16 Jan 2027'} · 06.30 WIB
                    </p>
                  </div>
                </div>

                {/* Status Gladi & Tombol Kunci/Sahkan */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isPublished ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Sah</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Draft</span>
                    </span>
                  )}

                  {isStaff && (
                    isPublished ? (
                      <button
                        type="button"
                        onClick={handleUnpublishSchedule}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Buka Kunci (Revisi Jadwal)"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPublishModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                        title="Sahkan Jadwal Resmi"
                      >
                        <FileCheck className="w-3 h-3" />
                        <span>Sahkan</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Embedded Dark Jenjang Tabs */}
              <div className="grid grid-cols-2 border-t border-slate-800 bg-slate-900/70">
                <button
                  type="button"
                  onClick={() => handleSelectJenjangTab('SD')}
                  className={`relative py-2.5 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-r border-slate-800 ${
                    activeJenjang === 'SD'
                      ? 'bg-slate-950 text-white font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 font-bold'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeJenjang === 'SD' ? 'bg-rose-500' : 'bg-slate-600'}`} />
                  <span>SD / MI</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none shrink-0 ${
                    activeJenjang === 'SD' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {attendanceStats.SD.totalScheduled}
                  </span>
                  {activeJenjang === 'SD' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectJenjangTab('SMP')}
                  className={`relative py-2.5 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeJenjang === 'SMP'
                      ? 'bg-slate-950 text-white font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 font-bold'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeJenjang === 'SMP' ? 'bg-blue-500' : 'bg-slate-600'}`} />
                  <span>SMP / MTs</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none shrink-0 ${
                    activeJenjang === 'SMP' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {attendanceStats.SMP.totalScheduled}
                  </span>
                  {activeJenjang === 'SMP' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Clean Flush Underline Status Tabs (No Bulky Gray Tray) */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold">
              {[
                { id: 'not_arrived', label: 'Belum', count: activeAttendanceStats.notArrived, dot: 'bg-amber-500', bar: 'bg-amber-500', activeText: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
                { id: 'checked_in', label: 'Di Lokasi', count: activeAttendanceStats.checkedIn, dot: 'bg-emerald-500 animate-pulse', bar: 'bg-emerald-600', activeText: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
                { id: 'checked_out', label: 'Selesai', count: activeAttendanceStats.checkedOut, dot: 'bg-blue-500', bar: 'bg-blue-600', activeText: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
              ].map((st, idx) => {
                const isActive = leftAttendanceTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setLeftAttendanceTab(st.id)}
                    className={`relative py-2.5 px-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      idx < 2 ? 'border-r border-slate-200/80' : ''
                    } ${
                      isActive ? `bg-white ${st.activeText} font-black` : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? st.dot : 'bg-slate-300'}`} />
                    <span className="truncate">{st.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-black leading-none shrink-0 ${
                      isActive ? st.badge : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {st.count}
                    </span>
                    {isActive && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${st.bar}`} />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 space-y-2.5">

              {/* Toolbar: Pencarian Peleton (Full Width, Icon Rapi) */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari peleton atau danton..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* BANNER AKSI CEPAT (JIKA ADA PELETON TERPILIH - RINGKAS 38px) */}
              {activeSelectedTeam && (
                <div className="p-2 sm:px-3 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0">
                      #{String(activeSelectedTeam.slotInfo?.index).padStart(2, '0')}
                    </span>
                    <span className={`text-[8.5px] font-black uppercase px-1 py-0.2 rounded shrink-0 ${
                      activeSelectedTeam.jenjang === 'SD' ? 'bg-red-900/80 text-red-200' : 'bg-blue-900/80 text-blue-200'
                    }`}>
                      {activeSelectedTeam.jenjang}
                    </span>
                    <span className="font-bold text-xs text-white truncate" title={activeSelectedTeam.team.schoolName}>
                      {activeSelectedTeam.team.schoolName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Jika Belum Hadir -> Check-In */}
                    {(!trialAttendance[activeSelectedTeam.team.id]?.status || 
                      trialAttendance[activeSelectedTeam.team.id]?.status === 'not_arrived') && (
                      <button
                        type="button"
                        onClick={() => handleQuickCheckIn(activeSelectedTeam.team, activeSelectedTeam.slotInfo)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Check-In</span>
                      </button>
                    )}

                    {/* Jika Di Lokasi -> Check-Out */}
                    {trialAttendance[activeSelectedTeam.team.id]?.status === 'checked_in' && (
                      <button
                        type="button"
                        onClick={() => handleQuickCheckOut(activeSelectedTeam.team, activeSelectedTeam.slotInfo)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Check-Out</span>
                      </button>
                    )}

                    {/* Edit Modal */}
                    <button
                      type="button"
                      onClick={() => handleOpenAttendanceModal(
                        activeSelectedTeam.team,
                        activeSelectedTeam.slotInfo,
                        activeSelectedTeam.jenjang,
                        activeSelectedTeam.slotIdx
                      )}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white cursor-pointer"
                      title="Edit Jam Manual / Catatan"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>

                    {/* Tutup Pilihan */}
                    <button
                      type="button"
                      onClick={() => setActiveSelectedTeam(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                      title="Tutup pilihan"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* DAFTAR PELETON 1 KOLOM (NAMA SEKOLAH & DANTON TAMPIL PENUH) */}
              <div className="overflow-y-auto pr-1 max-h-[calc(100vh-250px)] min-h-[300px]">
                {filteredActionList.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Tidak ada peleton {activeJenjang} dalam antrean ini.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {filteredActionList.map((item) => {
                      const att = trialAttendance[item.team.id];
                      const isItemActive = activeSelectedTeam?.team?.id === item.team.id;

                      return (
                        <div
                          key={`${item.jenjang}-${item.slotIdx}`}
                          onClick={() => setActiveSelectedTeam(item)}
                          className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 cursor-pointer h-auto ${
                            isItemActive
                              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/50 shadow-xs'
                              : 'bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200 shadow-2xs'
                          }`}
                        >
                          {/* Header Kotak: Slot & Jenjang & Waktu Target */}
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono text-[9.5px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                #{String(item.slotInfo.index).padStart(2, '0')}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${
                                item.jenjang === 'SD' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {item.jenjang}
                              </span>
                            </div>

                            <span className="font-mono font-bold text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 truncate shrink-0">
                              {leftAttendanceTab === 'not_arrived'
                                ? (item.slotInfo.checkIn || item.slotInfo.arrival)
                                : leftAttendanceTab === 'checked_in'
                                ? (att?.checkInTime || '-')
                                : (att?.checkOutTime || '-')}
                            </span>
                          </div>

                          {/* Body Kotak: Logo Sekolah + Nama Sekolah & Danton */}
                          <div className="flex items-center gap-2.5 min-w-0 my-0.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                              <img
                                src={
                                  (item.team.files?.schoolLogo?.url || item.team.file_logo_sekolah || item.team.logoUrl)
                                    ? formatImageUrl(item.team.files?.schoolLogo?.url || item.team.file_logo_sekolah || item.team.logoUrl)
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.team.schoolName)}&background=${item.jenjang === 'SD' ? 'b91c1c' : '1d4ed8'}&color=fff&bold=true`
                                }
                                alt={item.team.schoolName}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.team.schoolName)}&background=${item.jenjang === 'SD' ? 'b91c1c' : '1d4ed8'}&color=fff&bold=true`;
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1" title={item.team.schoolName}>
                                {item.team.schoolName}
                              </h5>
                              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                Danton: <span className="font-semibold text-slate-700">{item.team.dantonName || '-'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Footer Kotak: Tombol Aksi di Bawah Kotak */}
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {leftAttendanceTab === 'not_arrived' && (
                              <button
                                type="button"
                                onClick={() => handleQuickCheckIn(item.team, item.slotInfo)}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                title="Check-In Peleton"
                              >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Check-In</span>
                              </button>
                            )}

                            {leftAttendanceTab === 'checked_in' && (
                              <button
                                type="button"
                                onClick={() => handleQuickCheckOut(item.team, item.slotInfo)}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                title="Check-Out Peleton"
                              >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Check-Out</span>
                              </button>
                            )}

                            {leftAttendanceTab === 'checked_out' && (
                              <div className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10.5px] flex items-center justify-center gap-1 truncate">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">Selesai ({att?.checkOutTime})</span>
                              </div>
                            )}

                            {/* Tombol Edit Jam Manual Langsung di Kartu */}
                            <button
                              type="button"
                              onClick={() => handleOpenAttendanceModal(item.team, item.slotInfo, item.jenjang, item.slotIdx)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                              title="Edit Jam Manual / Catatan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* PETUNJUK RINGKAS OPERASIONAL */}
          <div className="p-3 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Petunjuk Alur Gladi</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Peleton check-in di pos gerbang 30 menit sebelum slot. Durasi gladi orientasi kontur lapangan maksimal 15 menit per peleton.
            </p>
          </div>

          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* BAGIAN KANAN: KHUSUS MATRIKS JADWAL SAJA                 */}
        {/* -------------------------------------------------------- */}
        <div className={`${isStaff ? 'lg:col-span-8 xl:col-span-8' : 'w-full'} space-y-3.5`}>

          {/* TAMPILAN KHUSUS JIKA JADWAL BELUM DI-ACC / BELUM DISAHKAN PANITIA (UNTUK PESERTA & PUBLIK) */}
          {!isPublished && !isStaff ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Clock className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-black text-base text-slate-900">
                  Jadwal Gladi Belum Disahkan
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Matriks jadwal gladi adaptasi arena Uji Coba Lapangan (UCL) sedang dalam proses finalisasi oleh panitia dan akan terbit di sini segera setelah disahkan.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Alert Mode Draft untuk Staff / Panitia */}
              {isStaff && !isPublished && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                          Status: DRAFT
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          Jadwal UCL Belum Disahkan (Disembunyikan dari Peserta)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Peserta belum dapat melihat jadwal ini. Silakan atur/tukar slot dan klik "Sahkan & Terbitkan" jika sudah final.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowConfirmPublishModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition-all"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Sahkan & Terbitkan</span>
                  </button>
                </div>
              )}

              {/* BANNER JADWAL PELETON ANDA (KHUSUS ROLE PESERTA JIKA SUDAH SAH) */}
              {isPeserta && currentTeam && (() => {
            const mySlotTime = myTeamTrialSlot?.slotInfo?.time ? myTeamTrialSlot.slotInfo.time.replace(/\s*WIB/i, '') : '-';
            const mySlotIndex = myTeamTrialSlot?.slotInfo?.index || (myTeamTrialSlot ? myTeamTrialSlot.slotIdx + 1 : '-');
            const myCheckInTime = myTeamTrialSlot?.slotInfo?.checkIn || myTeamTrialSlot?.slotInfo?.arrival || '06.30 WIB';

            return (
              <div className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
                {/* Header Card */}
                <div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md mt-0.5 sm:mt-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-emerald-700 shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Peleton Anda
                        </span>
                        {currentTeam.jenjang && (
                          <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase border shrink-0 ${
                            currentTeam.jenjang === 'SD'
                              ? 'bg-red-50 text-red-700 border-red-200/80'
                              : 'bg-blue-50 text-blue-700 border-blue-200/80'
                          }`}>
                            Jenjang {currentTeam.jenjang}
                          </span>
                        )}
                        {currentTeam.lotNumber && (
                          <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[8.5px] font-mono font-bold text-slate-700 shrink-0">
                            TM #{String(currentTeam.lotNumber).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-950 leading-snug break-words">
                        {currentTeam.schoolName}
                      </h3>
                    </div>
                  </div>

                  {/* Status Presensi Peleton */}
                  <div className="shrink-0 w-full sm:w-auto">
                    {myTeamTrialSlot?.attendance?.status === 'checked_out' ? (
                      <span className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Gladi Selesai ({myTeamTrialSlot.attendance.checkOutTime})</span>
                      </span>
                    ) : myTeamTrialSlot?.attendance?.status === 'checked_in' ? (
                      <span className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-800 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Standby di Lokasi ({myTeamTrialSlot.attendance.checkInTime})</span>
                      </span>
                    ) : (
                      <span className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800 shadow-2xs">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Belum Tiba (Standby 30 mnt sebelumnya)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 3 Detail Quadrant Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-700 border border-red-100">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">
                        Arena Lapangan
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-slate-900">
                        {myTeamTrialSlot ? `Arena ${myTeamTrialSlot.jenjang} (${myTeamTrialSlot.jenjang === 'SD' ? 'Lapangan Basket' : 'Lapangan Embung'})` : (isTeamWillingToTrial(currentTeam) ? 'Sedang Dijadwalkan' : 'Menolak Gladi')}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                        Kampus Terpadu Sedayu
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">
                        Waktu & Slot Giliran
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                        {myTeamTrialSlot ? `${mySlotTime} WIB` : '-'}
                      </p>
                      <p className="text-[10px] font-bold text-amber-700 mt-0.5">
                        {myTeamTrialSlot ? `Slot #${String(mySlotIndex).padStart(2, '0')} · Durasi 15 Menit` : 'Belum Terjadwal'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <LogIn className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">
                        Target Kedatangan
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                        {myTeamTrialSlot ? `${myCheckInTime}` : '06.30 WIB'}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-700 mt-0.5">
                        Wajib Presensi di Pos Gerbang
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advisory note */}
                <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 flex items-start gap-2.5 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Orientasi kontur lapangan maksimal <strong>15 menit</strong>. Danton & pendamping wajib melapor ke <strong>Pos Presensi Kedatangan</strong> saat tiba di lokasi untuk validasi ID Card.
                  </p>
                </div>
              </div>
            );
          })()}


          {/* Hint Swap Sedang Aktif */}
          {swapSource && (
            <div className="bg-amber-100 border border-amber-300 p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-amber-900 shadow-2xs">
              <span>
                ⚡ Mode Tukar: Klik slot lain di tabel untuk menukar posisi <strong>Slot #{swapSource.slotIdx + 1} ({swapSource.jenjang})</strong>.
              </span>
              <button
                type="button"
                onClick={() => setSwapSource(null)}
                className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}

          {/* MATRIKS JADWAL ARENA PARALEL (KHUSUS JADWAL SAJA) */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
            
            {/* Header Matriks Jadwal */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 sm:px-5 py-3.5 sm:py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-2xs">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8.5px] font-black uppercase tracking-[0.16em] text-red-600">
                    MATRIKS JADWAL ARENA PARALEL
                  </p>
                  <h3 className="mt-0.5 text-sm sm:text-base font-black tracking-tight text-slate-950 truncate">
                    Gladi Adaptasi Kontur Lapangan
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 truncate">
                    {EVENT.FIELD_TRIAL_FULL_DATE || 'Sabtu, 16 Januari 2027'} • 07.00 – 11.30 WIB
                  </p>
                </div>
              </div>

              {/* Filter Arena Tab Selector (Khusus Panitia/Admin/Umum; Untuk Peserta tampilkan badge jenjangnya) */}
              {isPeserta && participantJenjang ? (
                <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-2xs ${
                  participantJenjang === 'SD'
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : 'border-blue-200 bg-blue-50 text-blue-900'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
                    participantJenjang === 'SD' ? 'bg-red-600' : 'bg-blue-600'
                  }`} />
                  <span className="font-black uppercase tracking-wider text-[11px]">
                    {participantJenjang === 'SD' ? 'Jadwal Arena 1: SD / MI' : 'Jadwal Arena 2: SMP / MTs'}
                  </span>
                  <span className={`text-[10px] font-medium hidden sm:inline ${
                    participantJenjang === 'SD' ? 'text-red-700/80' : 'text-blue-700/80'
                  }`}>
                    • {participantJenjang === 'SD' ? 'Lapangan Basket' : 'Lapangan Embung'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  {isStaff && (
                    <button
                      type="button"
                      onClick={handleAutoGeneratePlan}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-[11px] font-black transition-all cursor-pointer active:scale-95"
                      title="Susun ulang jadwal UCL mengikuti urutan hasil lotting TM terbaru (2 peleton 1 sekolah otomatis berdekatan)"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sinkron Hasil TM</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 text-[10px] font-black uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => handleSelectJenjangTab('SD')}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                        activeJenjang === 'SD'
                          ? 'bg-red-600 text-white shadow-xs font-black'
                          : 'text-red-700 hover:bg-red-50'
                      }`}
                      title="Tampilkan Arena 1 (SD / MI)"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${activeJenjang === 'SD' ? 'bg-red-200' : 'bg-red-500'}`} />
                      <span>Arena 1 (SD)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectJenjangTab('SMP')}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                        activeJenjang === 'SMP'
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : 'text-blue-700 hover:bg-blue-50'
                      }`}
                      title="Tampilkan Arena 2 (SMP / MTs)"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${activeJenjang === 'SMP' ? 'bg-blue-200' : 'bg-blue-500'}`} />
                      <span>Arena 2 (SMP)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2.5 sm:p-4">
              {/* Tabel Jadwal Terstruktur By Content (1 Arena Aktif: SD atau SMP) */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                {/* Banner Arena Aktif */}
                <div className={`px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2 text-white ${
                  activeJenjang === 'SD'
                    ? 'bg-gradient-to-r from-red-600 to-red-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider truncate">
                      {activeJenjang === 'SD' ? 'Arena 1: SD / MI' : 'Arena 2: SMP / MTs'}
                    </span>
                    <span className="text-[9.5px] font-bold rounded-full bg-white/20 px-2 py-0.5 shrink-0 hidden sm:inline">
                      {activeJenjang === 'SD' ? 'Lapangan Basket' : 'Lapangan Embung'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-black/20 px-2.5 py-0.5 rounded-full shrink-0">
                    {activeAttendanceStats.totalScheduled} / {TRIAL_TIME_SLOTS.length} Slot Terisi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse table-auto">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 uppercase text-[9.5px] tracking-wider font-black border-b border-slate-800">
                        <th className="py-2.5 px-2.5 text-center w-[1%] whitespace-nowrap">#</th>
                        <th className="py-2.5 px-3 w-[1%] whitespace-nowrap">Waktu Gladi</th>
                        <th className="py-2.5 px-3">Peleton / Sekolah</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell whitespace-nowrap">Danton</th>
                        <th className="py-2.5 px-3 text-right w-[1%] whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {TRIAL_TIME_SLOTS.map((slotInfo, slotIdx) => {
                        const teamId = currentPlan[activeJenjang]?.slots?.[slotIdx];
                        const team = teamId ? teamsMap.get(teamId) : null;
                        const isSwapSelected = swapSource?.jenjang === activeJenjang && swapSource?.slotIdx === slotIdx;
                        const isTeamActiveSelected = team && activeSelectedTeam?.team?.id === team.id;
                        const isMyTeam = team && ((currentTeam?.id && team.id === currentTeam.id) || (currentUser?.teamId && team.id === currentUser.teamId));
                        const att = team ? trialAttendance[team.id] : null;
                        const isCheckedIn = att?.status === 'checked_in';
                        const isCheckedOut = att?.status === 'checked_out';
                        const dantonName = team ? (team.dantonName || team.roster?.danton?.name || '-') : '';
                        const logoRaw = team ? (team.files?.schoolLogo?.url || team.file_logo_sekolah || team.logoUrl) : '';
                        const fallbackAvatar = team
                          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=${activeJenjang === 'SD' ? 'b91c1c' : '1d4ed8'}&color=fff&bold=true`
                          : '';

                        const handleRowClick = () => {
                          if (!isStaff) return;
                          if (!team) {
                            if (!isPublished) handleSlotClick(activeJenjang, slotIdx, null);
                            return;
                          }
                          if (!isPublished && swapSource) {
                            handleSlotClick(activeJenjang, slotIdx, team.id);
                          } else {
                            setActiveSelectedTeam({ team, slotInfo, jenjang: activeJenjang, slotIdx });
                          }
                        };

                        return (
                          <tr
                            key={slotInfo.index}
                            onClick={handleRowClick}
                            className={`transition-colors ${
                              isStaff && (team || !isPublished) ? 'cursor-pointer' : ''
                            } ${
                              isSwapSelected
                                ? 'bg-amber-50 ring-1 ring-inset ring-amber-400'
                                : isTeamActiveSelected
                                ? 'bg-emerald-50/70'
                                : isMyTeam
                                ? 'bg-emerald-50/50'
                                : !team
                                ? 'bg-slate-50/40 hover:bg-slate-50'
                                : 'bg-white hover:bg-slate-50/90'
                            }`}
                          >
                            {/* Kolom 1: Slot # */}
                            <td className="py-2.5 px-2.5 text-center font-mono font-black text-slate-500 text-[11px] whitespace-nowrap align-middle">
                              #{String(slotInfo.index).padStart(2, '0')}
                            </td>

                            {/* Kolom 2: Waktu Gladi (In & Out Ringkas) */}
                            <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                              <div className="font-mono font-black text-slate-900 text-[11.5px] leading-tight">
                                {slotInfo.time.replace(/\s*WIB/i, '')} <span className="text-[9.5px] font-bold text-slate-400">WIB</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 font-mono text-[9px]">
                                <span className="inline-flex items-center gap-0.5 text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
                                  <span className="font-black text-emerald-600">IN</span>
                                  <span className="font-bold">{(slotInfo.checkIn || slotInfo.arrival || '').replace(/\s*WIB/i, '')}</span>
                                </span>
                                <span className="inline-flex items-center gap-0.5 text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/70">
                                  <span className="font-black text-slate-500">OUT</span>
                                  <span className="font-bold">{(slotInfo.checkOut || '15m').replace(/\s*WIB/i, '')}</span>
                                </span>
                              </div>
                            </td>

                            {!team ? (
                              <td colSpan={3} className="py-3 px-3 align-middle">
                                <div className={`py-2 px-3 rounded-xl border border-dashed text-center text-[11px] font-bold transition-colors ${
                                  isStaff && !isPublished
                                    ? 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-800 hover:bg-white'
                                    : 'border-slate-200 text-slate-400 bg-white/50'
                                }`}>
                                  {isStaff && !isPublished ? `+ Isi Peleton ${activeJenjang} di Slot #${String(slotInfo.index).padStart(2, '0')}` : '— Slot Kosong —'}
                                </div>
                              </td>
                            ) : (
                              <>
                                {/* Kolom 3: Peleton / Sekolah */}
                                <td className="py-2.5 px-3 align-middle">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                      <img
                                        src={logoRaw ? formatImageUrl(logoRaw) : fallbackAvatar}
                                        alt={team.schoolName}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = fallbackAvatar;
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-extrabold text-xs sm:text-[13px] text-slate-900 leading-snug">
                                          {team.schoolName}
                                        </span>
                                        {team.lotNumber && (
                                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono text-[9.5px] font-bold shrink-0">
                                            TM #{String(team.lotNumber).padStart(2, '0')}
                                          </span>
                                        )}
                                        {(() => {
                                          const prevId = slotIdx > 0 ? currentPlan[activeJenjang]?.slots?.[slotIdx - 1] : null;
                                          const nextId = slotIdx < 17 ? currentPlan[activeJenjang]?.slots?.[slotIdx + 1] : null;
                                          const baseName = normalizeSchoolName(team.schoolBaseName || team.schoolName);
                                          const isTwinAdj =
                                            (prevId && normalizeSchoolName(teamsMap.get(prevId)?.schoolBaseName || teamsMap.get(prevId)?.schoolName) === baseName) ||
                                            (nextId && normalizeSchoolName(teamsMap.get(nextId)?.schoolBaseName || teamsMap.get(nextId)?.schoolName) === baseName);
                                          return isTwinAdj ? (
                                            <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black uppercase shrink-0">
                                              1 Sekolah
                                            </span>
                                          ) : null;
                                        })()}
                                        {isMyTeam && (
                                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-black text-[8.5px] bg-emerald-600 text-white uppercase tracking-wider shrink-0">
                                            <Sparkles className="w-2.5 h-2.5" />
                                            <span>Peleton Anda</span>
                                          </span>
                                        )}
                                      </div>
                                      {/* Danton tampil di bawah nama sekolah khusus layar mobile */}
                                      <div className="text-[10.5px] text-slate-500 font-medium mt-0.5 sm:hidden truncate">
                                        Danton: <span className="text-slate-700 font-semibold">{dantonName}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Kolom 4: Danton (Desktop) */}
                                <td className="py-2.5 px-3 hidden sm:table-cell align-middle">
                                  <span className="text-[11.5px] font-semibold text-slate-700 leading-snug block">
                                    {dantonName}
                                  </span>
                                </td>

                                {/* Kolom 5: Status Presensi & Aksi Draft */}
                                <td className="py-2.5 px-3 text-right whitespace-nowrap align-middle">
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    {isCheckedOut ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                        <span>Selesai {att.checkOutTime?.replace(/\s*WIB/i, '')}</span>
                                      </span>
                                    ) : isCheckedIn ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Di Lokasi {att.checkInTime?.replace(/\s*WIB/i, '')}</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span>Belum Tiba</span>
                                      </span>
                                    )}

                                    {isStaff && !isPublished && (
                                      <button
                                        type="button"
                                        onClick={(e) => handleRemoveFromSlot(e, activeJenjang, slotIdx)}
                                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Copot dari slot"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
        </>
      )}

        </div>

      </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: DETAIL / KONTROL PRESENSI (CHECK-IN & CHECK-OUT) */}
      {/* ======================================================== */}
      {showAttendanceModal && selectedAttendanceTeam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className={`p-4 text-white flex items-center justify-between ${
              selectedAttendanceTeam.jenjang === 'SD' ? 'bg-red-700' : 'bg-blue-700'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  Presensi Uji Coba Lapangan • Slot #{selectedAttendanceTeam.slotInfo?.index}
                </span>
                <h3 className="font-black text-sm uppercase tracking-tight truncate max-w-xs">
                  {selectedAttendanceTeam.team?.schoolName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAttendanceModal(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              {/* Ringkasan Peleton */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Danton:</span>
                  <span className="font-bold text-slate-800">
                    {selectedAttendanceTeam.team?.dantonName || selectedAttendanceTeam.team?.roster?.danton?.name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jadwal Gladi:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAttendanceTeam.slotInfo?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Tiba:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedAttendanceTeam.slotInfo?.checkIn || selectedAttendanceTeam.slotInfo?.arrival}</span>
                </div>
              </div>

              {/* Status Saat Ini */}
              <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-600 font-bold">Status Presensi:</span>
                {trialAttendance[selectedAttendanceTeam.team?.id]?.status === 'checked_out' ? (
                  <span className="px-2 py-0.5 rounded-md font-black text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                    Selesai (Check-Out)
                  </span>
                ) : trialAttendance[selectedAttendanceTeam.team?.id]?.status === 'checked_in' ? (
                  <span className="px-2 py-0.5 rounded-md font-black text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Sudah Check-In (Di Lokasi)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md font-black text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                    Belum Hadir
                  </span>
                )}
              </div>

              {/* Input Jam Check-In */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex justify-between">
                  <span>Waktu Check-In (Kedatangan):</span>
                  <button
                    type="button"
                    onClick={() => setCustomCheckInTime(formatCurrentTimeWIB())}
                    className="text-[10px] text-emerald-600 hover:underline font-bold cursor-pointer"
                  >
                    Set Jam Sekarang
                  </button>
                </label>
                <input
                  type="text"
                  value={customCheckInTime}
                  onChange={(e) => setCustomCheckInTime(e.target.value)}
                  placeholder="Contoh: 06.32 WIB"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Input Jam Check-Out */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex justify-between">
                  <span>Waktu Check-Out (Selesai Gladi):</span>
                  <button
                    type="button"
                    onClick={() => setCustomCheckOutTime(formatCurrentTimeWIB())}
                    className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Set Jam Sekarang
                  </button>
                </label>
                <input
                  type="text"
                  value={customCheckOutTime}
                  onChange={(e) => setCustomCheckOutTime(e.target.value)}
                  placeholder="Contoh: 07.15 WIB"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Input Catatan Petugas */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Petugas (Opsional):</label>
                <textarea
                  value={attendanceNotes}
                  onChange={(e) => setAttendanceNotes(e.target.value)}
                  placeholder="Catatan kedatangan, personil, atau official pendamping..."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              {/* Tombol Reset */}
              {trialAttendance[selectedAttendanceTeam.team?.id] && (
                <button
                  type="button"
                  onClick={() => handleResetAttendance(selectedAttendanceTeam.team?.id)}
                  className="px-2.5 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  title="Batalkan presensi dan kembalikan ke Belum Hadir"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => handleSaveAttendanceModal('checked_in')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Simpan Check-In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveAttendanceModal('checked_out')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Selesaikan Check-Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REKAP PRESENSI UJI COBA (CETAK / PRINT VIEW)      */}
      {/* ======================================================== */}
      {isStaff && showRecapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in print:static print:inset-auto print:bg-white print:p-0">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #ucl-recap-print-area, #ucl-recap-print-area * { visibility: visible; }
              #ucl-recap-print-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-height: none !important;
                overflow: visible !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
              }
            }
          `}</style>
          <div id="ucl-recap-print-area" className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:overflow-visible">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:bg-white print:text-slate-900 print:border-b print:border-slate-300">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 print:hidden" />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">
                    Rekapitulasi Presensi Uji Coba Lapangan
                  </h3>
                  <p className="text-[11px] text-slate-300 print:text-slate-600">
                    LBB Mu'allimin 2027 • Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Presensi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecapModal(false)}
                  className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Total</span>
                  <span className="text-sm font-black text-slate-900">{attendanceStats.totalScheduled}</span>
                </div>
                <div>
                  <span className="text-amber-600 text-[10px] uppercase font-bold block">Belum Hadir</span>
                  <span className="text-sm font-black text-amber-800">{attendanceStats.notArrived}</span>
                </div>
                <div>
                  <span className="text-emerald-600 text-[10px] uppercase font-bold block">Check-In</span>
                  <span className="text-sm font-black text-emerald-800">{attendanceStats.checkedIn}</span>
                </div>
                <div>
                  <span className="text-blue-600 text-[10px] uppercase font-bold block">Check-Out</span>
                  <span className="text-sm font-black text-blue-800">{attendanceStats.checkedOut}</span>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                    <th className="p-2 border border-slate-200 text-center w-10">Slot</th>
                    <th className="p-2 border border-slate-200 w-16">Arena</th>
                    <th className="p-2 border border-slate-200">Nama Sekolah & Peleton</th>
                    <th className="p-2 border border-slate-200 w-24">Target Tiba</th>
                    <th className="p-2 border border-slate-200 w-24">Waktu Check-In</th>
                    <th className="p-2 border border-slate-200 w-24">Waktu Check-Out</th>
                    <th className="p-2 border border-slate-200 w-28 text-center">Status</th>
                    <th className="p-2 border border-slate-200">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {TRIAL_TIME_SLOTS.map((slotInfo, slotIdx) => {
                    const sdTeam = currentPlan.SD?.slots?.[slotIdx] ? teamsMap.get(currentPlan.SD?.slots?.[slotIdx]) : null;
                    const smpTeam = currentPlan.SMP?.slots?.[slotIdx] ? teamsMap.get(currentPlan.SMP?.slots?.[slotIdx]) : null;

                    const renderRow = (team, arenaName, jenjang) => {
                      if (!team) return null;
                      const att = trialAttendance[team.id];
                      return (
                        <tr key={`${jenjang}-${slotIdx}`} className="hover:bg-slate-50">
                          <td className="p-2 border border-slate-200 text-center font-mono font-bold">#{slotInfo.index}</td>
                          <td className="p-2 border border-slate-200 font-bold">{arenaName}</td>
                          <td className="p-2 border border-slate-200">
                            <div className="font-bold text-slate-900">{team.schoolName}</div>
                            <div className="text-[10px] text-slate-500">Danton: {team.dantonName || '-'}</div>
                          </td>
                          <td className="p-2 border border-slate-200 font-mono text-slate-600">{slotInfo.checkIn || slotInfo.arrival}</td>
                          <td className="p-2 border border-slate-200 font-mono font-bold text-emerald-800">
                            {att?.checkInTime || '-'}
                          </td>
                          <td className="p-2 border border-slate-200 font-mono font-bold text-blue-800">
                            {att?.checkOutTime || '-'}
                          </td>
                          <td className="p-2 border border-slate-200 text-center">
                            {att?.status === 'checked_out' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                                Selesai
                              </span>
                            ) : att?.status === 'checked_in' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                                Di Lokasi
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                Belum Hadir
                              </span>
                            )}
                          </td>
                          <td className="p-2 border border-slate-200 text-slate-500 text-[10px] italic">
                            {att?.notes || '-'}
                          </td>
                        </tr>
                      );
                    };

                    return (
                      <React.Fragment key={slotIdx}>
                        {renderRow(sdTeam, 'Arena 1 (SD)', 'SD')}
                        {renderRow(smpTeam, 'Arena 2 (SMP)', 'SMP')}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRecapModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SAHKAN JADWAL RESMI                               */}
      {/* ======================================================== */}
      {isStaff && showConfirmPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-200" />
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Sahkan Jadwal Uji Coba Lapangan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPublishModal(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">
                Sahkan rencana ini dan bagikan jadwal resmi ke seluruh peserta?
              </p>
              <p className="text-slate-500 leading-relaxed">
                Jadwal jam masuk arena akan langsung tayang resmi di portal masing-masing peleton. Anda tetap dapat membuka kunci (revisi) kapan saja jika diperlukan.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmPublishModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handlePublishSchedule}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs cursor-pointer"
              >
                Ya, Sahkan & Bagikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PILIH PELETON UNTUK SLOT KOSONG                   */}
      {/* ======================================================== */}
      {isStaff && teamPickerTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className={`p-4 text-white flex items-center justify-between ${
              teamPickerTarget.jenjang === 'SD' ? 'bg-red-700' : 'bg-blue-700'
            }`}>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Pilih Peleton: Slot #{teamPickerTarget.slotIdx + 1} ({teamPickerTarget.jenjang})
                </h3>
                <p className="text-xs text-white/90 font-mono">
                  {TRIAL_TIME_SLOTS[teamPickerTarget.slotIdx]?.time}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTeamPickerTarget(null)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {getUnassignedTeams(teamPickerTarget.jenjang).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Seluruh peleton {teamPickerTarget.jenjang} sudah terjadwal.
                </div>
              ) : (
                getUnassignedTeams(teamPickerTarget.jenjang).map(team => (
                  <div
                    key={team.id}
                    onClick={() => handleAssignTeamToSlot(team.id)}
                    className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 cursor-pointer shadow-2xs group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Logo */}
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        <img
                          src={
                            (team.files?.schoolLogo?.url || team.file_logo_sekolah || team.logoUrl)
                              ? formatImageUrl(team.files?.schoolLogo?.url || team.file_logo_sekolah || team.logoUrl)
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=${teamPickerTarget.jenjang === 'SD' ? 'dc2626' : '2563eb'}&color=fff&bold=true`
                          }
                          alt={team.schoolName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=${teamPickerTarget.jenjang === 'SD' ? 'dc2626' : '2563eb'}&color=fff&bold=true`;
                          }}
                        />
                      </div>

                      {/* Info Tim & Danton */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-xs sm:text-[13px] text-slate-900 truncate">
                            {team.schoolName}
                          </span>
                          {team.lotNumber && (
                            <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                              TM #{String(team.lotNumber).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                          Danton: <span className="font-black text-slate-900">{team.dantonName || team.roster?.danton?.name || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shrink-0 shadow-xs"
                    >
                      Pilih
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setTeamPickerTarget(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FLOATING TOAST NOTIFICATION                              */}
      {/* ======================================================== */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-auto transition-all transform animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xl border border-slate-700/80">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="flex-1 leading-snug">{toastMsg}</span>
            <button
              type="button"
              onClick={() => setToastMsg('')}
              className="text-slate-400 hover:text-white p-0.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </SimpaskorSidebarLayout>
  );
}
