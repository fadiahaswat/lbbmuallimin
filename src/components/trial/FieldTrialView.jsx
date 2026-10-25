import React, { useState, useMemo } from 'react';
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
  AlertCircle
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
  const { teams, settings, updateSettings, role, currentUser } = useCompetition();

  // Role permissions
  const isStaff = ['admin', 'superadmin'].includes(role) || ['admin', 'superadmin'].includes(currentUser?.role);
  const isPublished = Boolean(settings?.trialSchedulePublished);

  // Interactive Swap & Team Assign state for Panitia
  const [swapSource, setSwapSource] = useState(null); // { jenjang: 'SD'|'SMP', slotIdx: number, teamId: string }
  const [teamPickerTarget, setTeamPickerTarget] = useState(null); // { jenjang: 'SD'|'SMP', slotIdx: number }
  const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

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

  // Current active plan: MUST ALWAYS BE POPULATED (Never empty 18 nulls by default)
  const currentPlan = useMemo(() => {
    const hasValidSd = settings?.trialPlan?.SD?.slots?.some(Boolean);
    const hasValidSmp = settings?.trialPlan?.SMP?.slots?.some(Boolean);

    if (hasValidSd || hasValidSmp) {
      return settings.trialPlan;
    }
    // Auto-generate plan according to 3 Priorities
    return generateSmartTrialPlan(teams);
  }, [settings?.trialPlan, teams]);

  // Priority 1: Declined teams
  const declinedTeams = useMemo(() => {
    return teams.filter(t => !isTeamWillingToTrial(t));
  }, [teams]);

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
      trialSchedulePublished: true
    });
    setShowConfirmPublishModal(false);
    showToast('📜 Jadwal Uji Coba Lapangan RESMI disahkan!');
  };

  // Action: Unpublish / Reopen
  const handleUnpublishSchedule = () => {
    if (window.confirm('Buka kunci jadwal untuk kembali ke mode DRAFT dan mengedit rencana?')) {
      updateSettings({ trialSchedulePublished: false });
      showToast('Jadwal kembali ke status DRAFT.');
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

  return (
    <SimpaskorSidebarLayout
      activeMenu="uji_coba"
      title="Uji Coba Lapangan"
      subtitle="Jadwal gladi adaptasi kontur arena, alur lintasan, & orientasi lapangan LBB 2027"
      rightActions={
        <div className="flex items-center gap-2">
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
      <div className="space-y-4">

        {/* ======================================================== */}
        {/* HEADER TERPADU: JUDUL + STATUS + KONTROL PANITIA         */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-2xs text-white ${
              isPublished ? 'bg-emerald-600' : 'bg-amber-500'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  Uji Coba Lapangan (UCL)
                </h1>
                {/* Status Badge Ringkas */}
                {isPublished ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Jadwal Resmi Sah</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>Rencana (Draft)</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{EVENT.FIELD_TRIAL_FULL_DATE || 'Sabtu, 16 Jan 2027'}</span>
                <span className="mx-1.5">•</span>
                <span>06.30 – 12.00 WIB</span>
                <span className="mx-1.5">•</span>
                <span>{VENUE.NAME}</span>
                <span className="mx-1.5">•</span>
                <span className="font-bold text-slate-700">15 Mnt / Tim</span>
              </p>
            </div>
          </div>

          {/* Tombol Kontrol Panitia Ringkas */}
          {isStaff && (
            <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
              {!isPublished ? (
                <>
                  <button
                    type="button"
                    onClick={handleAutoGeneratePlan}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Susun ulang rencana otomatis berdasarkan 3 Prioritas (Survei, 1 Sekolah Berdampingan, Hasil TM)"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Susun Ulang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowConfirmPublishModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Sahkan rencana jadwal ini dan bagikan ke peserta"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Sahkan Jadwal</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleUnpublishSchedule}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Buka kunci kembali untuk merevisi jadwal"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Buka Kunci (Revisi)</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hint Swap Sedang Aktif */}
        {swapSource && (
          <div className="bg-amber-100 border border-amber-300 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900 shadow-2xs">
            <span>
              ⚡ Klik slot lain di tabel untuk menukar posisi <strong>Slot #{swapSource.slotIdx + 1} ({swapSource.jenjang})</strong>.
            </span>
            <button
              type="button"
              onClick={() => setSwapSource(null)}
              className="px-2 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}

        {/* Pesan untuk Peserta Saat Status Masih Draft */}
        {!isStaff && !isPublished && (
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Rencana jadwal Uji Coba Lapangan sedang disusun oleh panitia. Jadwal resmi akan berlaku setelah disahkan panitia.
            </span>
          </div>
        )}

        {/* ======================================================== */}
        {/* MATRIKS JADWAL 2 ARENA PARALEL                           */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
            <span className="text-xs font-black uppercase text-slate-800 tracking-tight">
              Matriks Jadwal 2 Arena Paralel (07.00 – 11.30 WIB)
            </span>
            {isStaff && !isPublished && (
              <span className="text-[11px] text-slate-400 italic">
                Tip: Klik nama tim untuk menukar posisi slot
              </span>
            )}
          </div>

          {/* Tabel Matriks */}
          <div className="rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="uppercase text-[10px] tracking-wider font-black">
                  <th className="py-2.5 px-3 text-center w-12 bg-slate-900 text-white">Slot</th>
                  <th className="py-2.5 px-3 w-40 bg-slate-900 text-white">Waktu (WIB) • In / Out</th>
                  <th className="py-2.5 px-3 bg-red-700 text-white border-r border-red-800">
                    Arena 1: SD / MI (Lapangan Basket)
                  </th>
                  <th className="py-2.5 px-3 bg-blue-700 text-white">
                    Arena 2: SMP / MTs (Pelataran Embung)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TRIAL_TIME_SLOTS.map((slotInfo, slotIdx) => {
                  const sdTeamId = currentPlan.SD?.slots?.[slotIdx];
                  const smpTeamId = currentPlan.SMP?.slots?.[slotIdx];
                  const sdTeam = sdTeamId ? teamsMap.get(sdTeamId) : null;
                  const smpTeam = smpTeamId ? teamsMap.get(smpTeamId) : null;

                  // Priority 2: Detect twin neighbor from the same school
                  const isSdTwin = sdTeam && (
                    (slotIdx > 0 && normalizeSchoolName(teamsMap.get(currentPlan.SD?.slots?.[slotIdx - 1])?.schoolName) === normalizeSchoolName(sdTeam.schoolName)) ||
                    (slotIdx < 17 && normalizeSchoolName(teamsMap.get(currentPlan.SD?.slots?.[slotIdx + 1])?.schoolName) === normalizeSchoolName(sdTeam.schoolName))
                  );

                  const isSmpTwin = smpTeam && (
                    (slotIdx > 0 && normalizeSchoolName(teamsMap.get(currentPlan.SMP?.slots?.[slotIdx - 1])?.schoolName) === normalizeSchoolName(smpTeam.schoolName)) ||
                    (slotIdx < 17 && normalizeSchoolName(teamsMap.get(currentPlan.SMP?.slots?.[slotIdx + 1])?.schoolName) === normalizeSchoolName(smpTeam.schoolName))
                  );

                  const isSdSwapSelected = swapSource?.jenjang === 'SD' && swapSource?.slotIdx === slotIdx;
                  const isSmpSwapSelected = swapSource?.jenjang === 'SMP' && swapSource?.slotIdx === slotIdx;

                  return (
                    <tr key={slotInfo.index} className="hover:bg-slate-50/70 transition-colors divide-x divide-slate-100">
                      {/* Slot # */}
                      <td className="py-2.5 px-3 text-center font-mono font-black text-slate-500 text-xs">
                        #{String(slotInfo.index).padStart(2, '0')}
                      </td>

                      {/* Waktu (WIB): Jam Gladi, Check-In Kedatangan, & Check-Out */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono font-black text-slate-900 text-xs">
                          {slotInfo.time}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1 font-mono text-[9.5px]">
                          <div className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/80 w-fit">
                            <span className="text-[8.5px] uppercase font-black text-emerald-600">In / Tiba:</span>
                            <span className="font-bold">{slotInfo.checkIn || slotInfo.arrival}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60 w-fit">
                            <span className="text-[8.5px] uppercase font-black text-slate-500">Out / Keluar:</span>
                            <span className="font-bold">{slotInfo.checkOut || '15 Mnt'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Kolom Arena 1 (SD) */}
                      <td className={`py-1.5 px-2.5 transition-colors ${
                        isSdSwapSelected ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-red-50/10'
                      }`}>
                        {sdTeam ? (
                          <div
                            onClick={() => handleSlotClick('SD', slotIdx, sdTeam.id)}
                            className={`p-2.5 bg-white rounded-xl border flex items-center justify-between gap-3 shadow-2xs group transition-all ${
                              isSdSwapSelected
                                ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/50'
                                : 'border-red-200 hover:border-red-300'
                            } ${isStaff && !isPublished ? 'cursor-pointer hover:shadow-xs' : ''}`}
                            title={isStaff && !isPublished ? 'Klik untuk menukar posisi slot' : undefined}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* 1. LOGO SEKOLAH (MENONJOL) */}
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                                <img
                                  src={
                                    (sdTeam.files?.schoolLogo?.url || sdTeam.file_logo_sekolah || sdTeam.logoUrl)
                                      ? formatImageUrl(sdTeam.files?.schoolLogo?.url || sdTeam.file_logo_sekolah || sdTeam.logoUrl)
                                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(sdTeam.schoolName)}&background=dc2626&color=fff&bold=true`
                                  }
                                  alt={sdTeam.schoolName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sdTeam.schoolName)}&background=dc2626&color=fff&bold=true`;
                                  }}
                                />
                              </div>

                              {/* 2. NAMA PELETON & NAMA DANTON (MENONJOL) */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-black text-xs sm:text-[13.5px] text-slate-900 truncate leading-snug" title={sdTeam.schoolName}>
                                    {sdTeam.schoolName}
                                  </h4>
                                  {sdTeam.platoonName && 
                                   sdTeam.platoonName.trim().toLowerCase() !== sdTeam.schoolName.trim().toLowerCase() && 
                                   !sdTeam.platoonName.trim().toLowerCase().startsWith(`pleton ${sdTeam.schoolName.trim().toLowerCase()}`) && (
                                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                      {sdTeam.platoonName}
                                    </span>
                                  )}
                                  {sdTeam.lotNumber && (
                                    <span className="px-1.5 py-0.2 rounded font-mono font-black text-[9px] bg-red-100 text-red-900 border border-red-300 shrink-0">
                                      TM #{String(sdTeam.lotNumber).padStart(2, '0')}
                                    </span>
                                  )}
                                  {isSdTwin && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200 shrink-0">
                                      ★ 1 Sekolah
                                    </span>
                                  )}
                                </div>

                                <div className="mt-1 flex items-center">
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-800 border border-red-200/80 truncate max-w-full">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-red-600 shrink-0">Danton:</span>
                                    <span className="font-black text-slate-900 truncate">{sdTeam.dantonName || sdTeam.roster?.danton?.name || '-'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isStaff && !isPublished && (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveFromSlot(e, 'SD', slotIdx)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                title="Copot dari slot"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={() => handleSlotClick('SD', slotIdx, null)}
                            className={`py-2 px-3 rounded-xl border border-dashed text-center text-slate-400 transition-colors ${
                              isStaff && !isPublished ? 'cursor-pointer hover:border-red-400 hover:text-red-700 hover:bg-red-50/30' : ''
                            }`}
                          >
                            <span className="text-[11px] font-bold">
                              {isStaff && !isPublished ? '+ Isi Peleton SD' : '- Kosong -'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Kolom Arena 2 (SMP) */}
                      <td className={`py-1.5 px-2.5 transition-colors ${
                        isSmpSwapSelected ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-blue-50/10'
                      }`}>
                        {smpTeam ? (
                          <div
                            onClick={() => handleSlotClick('SMP', slotIdx, smpTeam.id)}
                            className={`p-2.5 bg-white rounded-xl border flex items-center justify-between gap-3 shadow-2xs group transition-all ${
                              isSmpSwapSelected
                                ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/50'
                                : 'border-blue-200 hover:border-blue-300'
                            } ${isStaff && !isPublished ? 'cursor-pointer hover:shadow-xs' : ''}`}
                            title={isStaff && !isPublished ? 'Klik untuk menukar posisi slot' : undefined}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* 1. LOGO SEKOLAH (MENONJOL) */}
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                                <img
                                  src={
                                    (smpTeam.files?.schoolLogo?.url || smpTeam.file_logo_sekolah || smpTeam.logoUrl)
                                      ? formatImageUrl(smpTeam.files?.schoolLogo?.url || smpTeam.file_logo_sekolah || smpTeam.logoUrl)
                                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(smpTeam.schoolName)}&background=2563eb&color=fff&bold=true`
                                  }
                                  alt={smpTeam.schoolName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(smpTeam.schoolName)}&background=2563eb&color=fff&bold=true`;
                                  }}
                                />
                              </div>

                              {/* 2. NAMA PELETON & NAMA DANTON (MENONJOL) */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-black text-xs sm:text-[13.5px] text-slate-900 truncate leading-snug" title={smpTeam.schoolName}>
                                    {smpTeam.schoolName}
                                  </h4>
                                  {smpTeam.platoonName && 
                                   smpTeam.platoonName.trim().toLowerCase() !== smpTeam.schoolName.trim().toLowerCase() && 
                                   !smpTeam.platoonName.trim().toLowerCase().startsWith(`pleton ${smpTeam.schoolName.trim().toLowerCase()}`) && (
                                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                      {smpTeam.platoonName}
                                    </span>
                                  )}
                                  {smpTeam.lotNumber && (
                                    <span className="px-1.5 py-0.2 rounded font-mono font-black text-[9px] bg-blue-100 text-blue-900 border border-blue-300 shrink-0">
                                      TM #{String(smpTeam.lotNumber).padStart(2, '0')}
                                    </span>
                                  )}
                                  {isSmpTwin && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200 shrink-0">
                                      ★ 1 Sekolah
                                    </span>
                                  )}
                                </div>

                                <div className="mt-1 flex items-center">
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/80 truncate max-w-full">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-blue-600 shrink-0">Danton:</span>
                                    <span className="font-black text-slate-900 truncate">{smpTeam.dantonName || smpTeam.roster?.danton?.name || '-'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isStaff && !isPublished && (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveFromSlot(e, 'SMP', slotIdx)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                title="Copot dari slot"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={() => handleSlotClick('SMP', slotIdx, null)}
                            className={`py-2 px-3 rounded-xl border border-dashed text-center text-slate-400 transition-colors ${
                              isStaff && !isPublished ? 'cursor-pointer hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/30' : ''
                            }`}
                          >
                            <span className="text-[11px] font-bold">
                              {isStaff && !isPublished ? '+ Isi Peleton SMP' : '- Kosong -'}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tim Tidak Mengikuti UCL (Hanya jika ada yang konfirmasi tidak hadir) */}
        {declinedTeams.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Peleton Konfirmasi Tidak Hadir Uji Coba Lapangan ({declinedTeams.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {declinedTeams.map(t => (
                <div key={t.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate">{t.schoolName}</span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 shrink-0">
                    {t.jenjang}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: SAHKAN JADWAL RESMI                               */}
      {/* ======================================================== */}
      {showConfirmPublishModal && (
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
      {teamPickerTarget && (
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
