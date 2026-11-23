import React, { useState } from 'react';
import {
  Tag,
  Timer,
  Home,
  Calendar,
  MapPin,
  ExternalLink,
  Navigation,
  FileText,
  HelpCircle,
  Phone,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Bus,
  Car,
  Bike,
  Check,
  Clock,
  AlertCircle,
  Shield,
  Printer,
  Download,
  Loader2,
  BookOpen,
  ArrowRight,
  UserCheck,
  Users,
  ShieldCheck,
  Megaphone,
  Bell,
  HeartPulse,
  MessageCircle,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { EVENT, VENUE, DOWNLOADS } from '../../../../config.js';
import { HARI_H_SCHEDULE, UJI_COBA_SCHEDULE } from '../../../../data/scheduleMatrices.js';
import { calculateDynamicTrialSchedule } from '../../../../context/competitionHelpers.js';
import { generateSmartTrialPlan, TRIAL_TIME_SLOTS } from '../../../trial/trialPlanGenerator.js';

export default function OverviewTab({
  currentTeam,
  allTeams = [],
  settings = {},
  scheduleTab,
  setScheduleTab,
  tmDate,
  tmTime,
  trialDate,
  trialTime,
  compDate,
  compTime,
  setActiveTab,
  updateTeamVehicleSurvey,
  stagingInfo,
  onOpenPactModal,
  isDownloadingPact
}) {
  const allPasukan = Array.isArray(currentTeam.roster?.pasukan) ? currentTeam.roster.pasukan : [];
  const allCadangan = Array.isArray(currentTeam.roster?.cadangan) ? currentTeam.roster.cadangan : [];

  const filledPasukan = allPasukan.filter(p => p?.name && p.name !== '-' && p.name.trim() !== '').length;
  const filledCadangan = allCadangan.filter(c => c?.name && c.name !== '-' && c.name.trim() !== '').length;

  const danton = currentTeam.roster?.danton;
  const dantonName = danton?.name || currentTeam.dantonName || '';
  const hasDanton = Boolean(dantonName && dantonName.trim() !== '' && dantonName !== '-');

  // Count uploaded files
  const fileKeys = ['schoolLogo', 'recommendationLetter', 'paymentProof', 'dantonCard'];
  const filledDocs = fileKeys.filter(k => {
    const file = currentTeam.files?.[k];
    return file?.url && file.url !== '#' && !file.url.startsWith('#');
  }).length;

  // Total readiness score calculation (100% scale)
  const totalItems = 1 + 21 + 3 + 4; // 29 items total
  const completedItems = (hasDanton ? 1 : 0) + filledPasukan + filledCadangan + filledDocs;
  const readinessPercent = Math.min(100, Math.round((completedItems / totalItems) * 100));

  // Lookup jadwal hari-H berdasarkan nomor undian (lotNumber)
  const lotIdx = currentTeam.lotNumber ? parseInt(currentTeam.lotNumber, 10) - 1 : -1;
  const jKey = String(currentTeam.jenjang || '').toUpperCase().includes('SD') ? 'SD' : 'SMP';
  const autoSchedule = (lotIdx >= 0 && HARI_H_SCHEDULE[jKey]?.[lotIdx]) ? HARI_H_SCHEDULE[jKey][lotIdx] : null;

  // Single Source of Truth Jadwal Uji Coba Lapangan (UCL): Sinkron 100% dengan FieldTrialView Panitia
  const currentTmLotSignature = React.useMemo(() => {
    const teamsList = (allTeams && allTeams.length > 0) ? allTeams : [currentTeam];
    return teamsList
      .filter(t => t?.lotNumber)
      .map(t => `${t.id}:${t.lotNumber}`)
      .sort()
      .join('|');
  }, [allTeams, currentTeam]);

  const activeTrialPlan = React.useMemo(() => {
    const teamsList = (allTeams && allTeams.length > 0) ? allTeams : [currentTeam];
    const savedPlan = settings?.trialPlan;
    const hasValidSd = savedPlan?.SD?.slots?.some(Boolean);
    const hasValidSmp = savedPlan?.SMP?.slots?.some(Boolean);
    if ((hasValidSd || hasValidSmp) && savedPlan?.tmLotSignature === currentTmLotSignature) {
      return savedPlan;
    }
    return generateSmartTrialPlan(teamsList);
  }, [settings?.trialPlan, currentTmLotSignature, allTeams, currentTeam]);

  const myTrialSlotMeta = React.useMemo(() => {
    if (!currentTeam?.id || !activeTrialPlan) return null;
    const jSlots = activeTrialPlan[jKey]?.slots || [];
    const sIdx = jSlots.findIndex(id => id === currentTeam.id);
    if (sIdx === -1) return null;
    return {
      slotIdx: sIdx,
      slotInfo: TRIAL_TIME_SLOTS[sIdx] || null,
      attendance: settings?.trialAttendance?.[currentTeam.id] || null,
    };
  }, [currentTeam?.id, activeTrialPlan, jKey, settings?.trialAttendance]);

  // Fallback matriks jadwal UCL jika diperlukan
  const dynamicTrialMap = React.useMemo(() => {
    const teamsList = (allTeams && allTeams.length > 0) ? allTeams : [currentTeam];
    return calculateDynamicTrialSchedule(teamsList, UJI_COBA_SCHEDULE);
  }, [allTeams, currentTeam]);

  const teamDynamicTrial = dynamicTrialMap[currentTeam.id];
  const autoTrialSchedule = teamDynamicTrial?.schedule || (lotIdx >= 0 ? UJI_COBA_SCHEDULE[jKey]?.[lotIdx] : null);

  const displayEstimatedTime = currentTeam.estimatedTime || autoSchedule?.startTampil || (currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : null);
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('192.168.')
  );
  const isBasecampRatified = Boolean((settings?.basecampPublished && settings?.basecampRatifiedAt) || isLocalhost);
  const resolvedBasecampCode =
    stagingInfo?.basecamp?.roomName ||
    stagingInfo?.roomName ||
    stagingInfo?.basecampRoom ||
    stagingInfo?.room ||
    currentTeam.basecampNumber ||
    currentTeam.basecampRoom ||
    null;
  const displayBasecamp = isBasecampRatified
    ? (resolvedBasecampCode || (currentTeam.lotNumber ? `Ruang ${String(currentTeam.lotNumber).padStart(2, '0')}` : null))
    : null;

  // Format jam spesifik Uji Coba Lapangan (UCL) dari trialPlan resmi panitia (atau matriks dinamis)
  const trialArenaTime = myTrialSlotMeta?.slotInfo?.time
    ? myTrialSlotMeta.slotInfo.time.replace(' WIB', '')
    : (autoTrialSchedule?.enterArena && autoTrialSchedule?.finishArena
      ? `${autoTrialSchedule.enterArena.replace(' WIB', '')} - ${autoTrialSchedule.finishArena.replace(' WIB', '')}`
      : autoTrialSchedule?.enterArena || null);
  const isTrialRatified = Boolean((settings?.trialSchedulePublished && settings?.trialScheduleRatifiedAt) || isLocalhost);
  const displayTrialTime = currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
    ? 'Berhalangan'
    : !isTrialRatified
    ? 'Menunggu Pengesahan'
    : (currentTeam.trialSpecificTime || trialArenaTime || (currentTeam.lotNumber ? '16 Jan 2027' : null));

  const [surveySaveToast, setSurveySaveToast] = useState('');

  // Helper untuk menyimpan survei kesediaan hadir UCL
  const handleConfirmTrialAttendance = (isAttending) => {
    if (!updateTeamVehicleSurvey) return;
    updateTeamVehicleSurvey(currentTeam.id, 'trialAttendance', {
      status: isAttending ? 'confirmed' : 'declined',
      confirmedAt: new Date().toISOString()
    });
    setSurveySaveToast(isAttending ? '✓ Kesediaan hadir Uji Coba Lapangan berhasil dikonfirmasi!' : 'Konfirmasi ketidakhadiran Uji Coba Lapangan telah dicatat.');
    setTimeout(() => setSurveySaveToast(''), 3500);
  };

  // Helper untuk update jumlah kendaraan spesifik (motor, mobil, elf, bus)
  const handleUpdateVehicleCount = (agendaKey, vehicleKey, delta) => {
    if (!updateTeamVehicleSurvey) return;
    const currentCounts = currentTeam.vehicleSurveys?.[agendaKey]?.counts || {};
    const curVal = currentCounts[vehicleKey] || 0;
    const nextVal = Math.max(0, curVal + delta);

    const updatedCounts = {
      ...currentCounts,
      [vehicleKey]: nextVal
    };

    updateTeamVehicleSurvey(currentTeam.id, agendaKey, {
      counts: updatedCounts
    });
    setSurveySaveToast(`Jumlah armada diperbarui!`);
    setTimeout(() => setSurveySaveToast(''), 2500);
  };

  // LO State & Fallback logic (terhubung dummy/localStorage, selalu tampil ditetapkan di localhost)
  const loName = currentTeam?.loName || (isLocalhost ? 'Kak Rizky Fauzi (Panitia LBB)' : null);
  const loDisplayName = loName ? loName.replace(/\s*\(Panitia LBB\)/i, '').trim() : 'Kak Rizky Fauzi';
  const loInitials = loDisplayName
    .replace(/^Kak\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('') || 'LO';
  const loRole = currentTeam?.loRole || (isLocalhost ? 'LO Pendamping Peleton' : null);
  const loPhoto = currentTeam?.loPhoto || null;
  const isLoAssigned = Boolean(loName);

  // Agenda Countdown Timer Logic (Deadline Identitas Peleton H-1 TM -> TM -> UCL -> Hari-H)
  const AGENDA_TARGETS = React.useMemo(() => [
    {
      id: 'deadline',
      label: 'Batas Kelengkapan Roster & Berkas (H-1 TM)',
      shortLabel: 'H-1 TM (8 Jan)',
      dateText: '08 Jan 2027 • 23.59 WIB',
      location: 'Portal Online Peleton',
      targetMs: new Date('2027-01-08T23:59:59+07:00').getTime(),
      badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      accentColor: 'amber',
      glowColor: 'from-amber-600/20',
      indicatorColor: 'bg-amber-500',
      isDeadline: true
    },
    {
      id: 'tm',
      label: 'Technical Meeting & Pengundian',
      shortLabel: 'TM (9 Jan)',
      dateText: '09 Jan 2027 • 13.00 WIB',
      location: "Kampus Induk Mu'allimin",
      targetMs: new Date('2027-01-09T13:00:00+07:00').getTime(),
      badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      accentColor: 'purple',
      glowColor: 'from-purple-600/20',
      indicatorColor: 'bg-purple-500'
    },
    {
      id: 'trial',
      label: 'Uji Coba Lapangan (UCL)',
      shortLabel: 'UCL (16 Jan)',
      dateText: '16 Jan 2027 • 07.00 WIB',
      location: 'Kampus Terpadu Sedayu',
      targetMs: new Date('2027-01-16T07:00:00+07:00').getTime(),
      badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      accentColor: 'emerald',
      glowColor: 'from-emerald-600/20',
      indicatorColor: 'bg-emerald-500'
    },
    {
      id: 'competition',
      label: 'Hari Perlombaan (Hari-H)',
      shortLabel: 'Hari-H (24 Jan)',
      dateText: '24 Jan 2027 • 06.00 WIB',
      location: 'Arena Sedayu',
      targetMs: new Date('2027-01-24T06:00:00+07:00').getTime(),
      badgeClass: 'bg-red-500/10 text-red-300 border-red-500/30',
      accentColor: 'red',
      glowColor: 'from-red-600/20',
      indicatorColor: 'bg-red-500'
    }
  ], []);

  const [selectedCountdownId, setSelectedCountdownId] = useState('deadline');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const activeTarget = AGENDA_TARGETS.find(a => a.id === selectedCountdownId) || AGENDA_TARGETS[0];

  React.useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, activeTarget.targetMs - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeTarget]);

  const currentTab = scheduleTab || 'tm';

  const phaseConfig = {
    tm: {
      number: '01',
      day: (tmDate && tmDate.match(/\d+/)) ? String(tmDate.match(/\d+/)[0]).padStart(2, '0') : '09',
      month: 'JAN',
      year: '2027',
      label: 'Technical Meeting',
      shortLabel: 'Technical Meeting',
      time: tmTime || '13.00 – 16.30 WIB',
      title: 'Technical Meeting & Validasi Fisik Berkas',
      copy: 'Registrasi 12.30–13.00 WIB. Maks. 2 perwakilan per sekolah (Official dan/atau Danton). Bawa Surat Tugas asli stempel basah & Pakta Integritas ttd basah Official. Agenda: pemaparan juknis & pengundian nomor urut tampil.',
      venueName: 'Aula Kampus Induk Mu’allimin Yogyakarta',
      venueAddress: 'Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta',
      mapLabel: 'Kampus Induk Wirobrajan',
      embedUrl: "https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68&t=&z=16&ie=UTF8&iwloc=&output=embed",
      mapsUrl: EVENT.TECHNICAL_MEETING_MAPS_URL || "https://www.google.com/maps/dir/?api=1&destination=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68+Wirobrajan"
    },
    trial: {
      number: '02',
      day: (trialDate && trialDate.match(/\d+/)) ? String(trialDate.match(/\d+/)[0]).padStart(2, '0') : '16',
      month: 'JAN',
      year: '2027',
      label: 'Uji Coba Lapangan',
      shortLabel: 'Uji Coba (UCL)',
      time: trialTime || '07.00 – 13.00 WIB',
      title: 'Uji Coba Lapangan (UCL) & Orientasi Arena',
      copy: 'Pengenalan pos arena perlombaan, pos DP 1, DP 2, dan area steril demi kesiapan teknis peleton sebelum Hari-H.',
      venueName: 'Kampus Terpadu Mu’allimin Sedayu',
      venueAddress: 'Dusun Bandut Lor, Argorejo, Kec. Sedayu, Bantul',
      mapLabel: 'Kampus Terpadu Sedayu',
      embedUrl: "https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Kampus+Terpadu+Sedayu&t=&z=15&ie=UTF8&iwloc=&output=embed",
      mapsUrl: VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"
    },
    competition: {
      number: '03',
      day: (compDate && compDate.match(/\d+/)) ? String(compDate.match(/\d+/)[0]).padStart(2, '0') : '24',
      month: 'JAN',
      year: '2027',
      label: 'Hari Perlombaan',
      shortLabel: 'Hari Perlombaan',
      time: compTime || '06.00 – 17.00 WIB',
      title: 'Hari-H Pelaksanaan LBB Mu’allimin 2027',
      copy: 'Daftar ulang mulai 06.00 WIB dengan pembagian nomor dada resmi, dilanjutkan upacara pembukaan dan perlombaan di lapangan utama.',
      venueName: 'Kampus Terpadu Mu’allimin Sedayu',
      venueAddress: 'Dusun Bandut Lor, Argorejo, Kec. Sedayu, Bantul',
      mapLabel: 'Kampus Terpadu Sedayu',
      embedUrl: "https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Kampus+Terpadu+Sedayu&t=&z=15&ie=UTF8&iwloc=&output=embed",
      mapsUrl: VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"
    }
  };

  const activePhase = phaseConfig[currentTab] || phaseConfig.tm;

  const VEHICLE_SURVEY_META = {
    tm: {
      title: 'Estimasi Armada Kendaraan saat TM',
      subtitle: 'Untuk alokasi parkir Kampus Induk',
      items: [
        { key: 'motor', label: 'Sepeda Motor', desc: 'Roda dua · Parkir motor', icon: Bike },
        { key: 'mobil', label: 'Mobil Pribadi', desc: 'Sedan / MPV / SUV', icon: Car },
      ]
    },
    trial: {
      title: 'Armada Kendaraan Menuju UCL (16 Jan 2027)',
      subtitle: 'Untuk manajemen kantong parkir Sedayu',
      items: [
        { key: 'motor', label: 'Sepeda Motor', desc: 'Official & suporter', icon: Bike },
        { key: 'mobil', label: 'Mobil Pribadi', desc: 'Avanza / Innova / sejenis', icon: Car },
        { key: 'elf', label: 'Minibus / Elf / HiAce', desc: 'Kapasitas 12–19 kursi', icon: Bus },
        { key: 'bus', label: 'Big / Medium Bus', desc: 'Bus besar rombongan', icon: Bus },
      ]
    },
    competition: {
      title: 'Armada Kendaraan Kontingen Hari-H (24 Jan 2027)',
      subtitle: 'Pendataan stiker parkir resmi arena',
      items: [
        { key: 'motor', label: 'Sepeda Motor', desc: 'Suporter & Official', icon: Bike },
        { key: 'mobil', label: 'Mobil Pribadi', desc: 'Kendaraan guru & pendamping', icon: Car },
        { key: 'elf', label: 'Minibus / Elf / HiAce', desc: 'Kapasitas 12–19 kursi', icon: Bus },
        { key: 'bus', label: 'Big / Medium Bus', desc: 'Bus rombongan (30–50+)', icon: Bus },
      ]
    }
  };

  const activeVehicleMeta = VEHICLE_SURVEY_META[currentTab] || VEHICLE_SURVEY_META.tm;
  const activeVehicleCounts = currentTeam.vehicleSurveys?.[currentTab]?.counts || {};
  const activeVehicleTotal = activeVehicleMeta.items.reduce(
    (sum, item) => sum + (Number(activeVehicleCounts[item.key]) || 0),
    0
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Toast Save Survei */}
      {surveySaveToast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{surveySaveToast}</span>
        </div>
      )}

      {/* 0. COUNTDOWN BATAS ROSTER & BERKAS (H-1 TM) */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-950 via-[#0d1323] to-slate-950 px-4 py-4 sm:px-6 text-white shadow-[0_12px_32px_rgba(2,6,23,0.18)] ring-1 ring-inset ring-white/[0.05]">
        {/* Ambient Glow & Top Hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="pointer-events-none absolute -top-12 -left-10 h-32 w-48 rounded-full bg-amber-500/12 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -right-8 h-32 w-56 rounded-full bg-rose-600/12 blur-2xl" />

        <div className="relative flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          {/* Kiri: Ikon + Judul + Jadwal */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-gradient-to-br from-amber-400/20 to-amber-500/5 text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Timer className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  Batas Berkas &amp; Roster
                </h2>
                <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-300">
                  H-1 TM
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-slate-400 tabular-nums">
                08 Jan 2027 · 23.59 WIB
              </p>
            </div>
          </div>

          {/* Kanan: 4 Tile Countdown */}
          <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-2.5 shrink-0">
            {[
              { label: 'Hari', val: timeLeft.days, accent: true },
              { label: 'Jam', val: timeLeft.hours, accent: false },
              { label: 'Menit', val: timeLeft.minutes, accent: false },
              { label: 'Detik', val: timeLeft.seconds, accent: false }
            ].map((unit) => (
              <div
                key={unit.label}
                className={`flex sm:min-w-[64px] flex-col items-center justify-center rounded-xl border py-2 px-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                  unit.accent
                    ? 'border-amber-400/25 bg-gradient-to-b from-amber-400/15 to-slate-900/90'
                    : 'border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-slate-900/90'
                }`}
              >
                <span
                  className={`font-mono text-lg sm:text-xl font-black leading-none tabular-nums ${
                    unit.accent ? 'text-amber-300' : 'text-white'
                  }`}
                >
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. RACE CONTROL - STATUS KOMPETISI (Figma Make Signature Style) */}
      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.045)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="section-kicker">RACE CONTROL</p>
            <h2 className="mt-0.5 text-base font-black tracking-tight text-slate-950">
              Status Kompetisi Peleton
            </h2>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-amber-700 border border-amber-200/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            <span>
              {currentTeam.status === 'verified' ? 'Kontingen Terverifikasi' : 'Menunggu Technical Meeting'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 xl:grid-cols-4 xl:divide-y-0">
          {/* Card 1: Nomor Dada */}
          <div className="group relative min-h-[140px] p-4 transition hover:bg-slate-50/70 sm:p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Tag className="w-4 h-4" />
              </span>
              <span className="text-[9px] font-black tracking-[0.14em] text-slate-300">01</span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
                Nomor Dada
              </p>
              <p className="mt-1 text-base sm:text-xl font-mono font-black text-slate-900 truncate">
                {currentTeam.chestNumber || '—'}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
                {currentTeam.chestNumber ? 'Seragam peleton' : 'Ditetapkan saat TM'}
              </p>
            </div>
            <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-red-600 transition-transform group-hover:scale-x-100" />
          </div>

          {/* Card 2: Jadwal UCL */}
          <div className="group relative min-h-[140px] p-4 transition hover:bg-slate-50/70 sm:p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-[9px] font-black tracking-[0.14em] text-slate-300">02</span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
                Jadwal UCL
              </p>
              <p className="mt-1 text-xs sm:text-base font-mono font-black text-slate-900 truncate">
                {displayTrialTime || 'Belum Terbit'}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
                {displayTrialTime ? '16 Jan (Sedayu)' : 'Menunggu publikasi'}
              </p>
            </div>
            <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-red-600 transition-transform group-hover:scale-x-100" />
          </div>

          {/* Card 3: Estimasi Tampil */}
          <div className="group relative min-h-[140px] p-4 transition hover:bg-slate-50/70 sm:p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Timer className="w-4 h-4" />
              </span>
              <span className="text-[9px] font-black tracking-[0.14em] text-slate-300">03</span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
                Estimasi Tampil
              </p>
              <p className="mt-1 text-xs sm:text-base font-mono font-black text-slate-900 truncate">
                {displayEstimatedTime || 'Belum Tersedia'}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
                {displayEstimatedTime ? (autoSchedule?.arena ? autoSchedule.arena.split(' ')[0] : 'Arena Utama') : 'Menunggu hasil undian'}
              </p>
            </div>
            <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-red-600 transition-transform group-hover:scale-x-100" />
          </div>

          {/* Card 4: Basecamp */}
          <div className="group relative min-h-[140px] p-4 transition hover:bg-slate-50/70 sm:p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Home className="w-4 h-4" />
              </span>
              <span className="text-[9px] font-black tracking-[0.14em] text-slate-300">04</span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">
                Basecamp
              </p>
              <p className="mt-1 text-xs sm:text-base font-mono font-black text-slate-900 truncate">
                {displayBasecamp || 'Belum Ditetapkan'}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
                {displayBasecamp ? 'Transit kontingen' : 'Diumumkan setelah UCL'}
              </p>
            </div>
            <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-red-600 transition-transform group-hover:scale-x-100" />
          </div>
        </div>
      </section>

      {/* 2. MAIN GRID (Kiri: Operation Timeline, Kanan: Readiness Score & Resource Dock) */}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        
        {/* KOLOM KIRI: AGENDA KONTINGEN 2027 */}
        <section className="overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.055)]">
          {/* Header Section */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                <Calendar className="w-4.5 h-4.5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-700">
                  Jadwal Resmi · 3 Tahap
                </p>
                <h2 className="mt-0.5 text-base font-black tracking-tight text-slate-950 sm:text-lg">
                  Agenda Kontingen 2027
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Timeline Aktif</span>
            </span>
          </div>

          {/* Flush 3-Stage Step Bar */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/60">
            {[
              { key: 'tm', num: '01', label: 'Technical Meeting', date: `${phaseConfig.tm.day} Jan 2027` },
              { key: 'trial', num: '02', label: 'Uji Coba (UCL)', date: `${phaseConfig.trial.day} Jan 2027` },
              { key: 'competition', num: '03', label: 'Hari Perlombaan', date: `${phaseConfig.competition.day} Jan 2027` },
            ].map(item => {
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setScheduleTab(item.key)}
                  className={`group relative flex flex-col items-center gap-1 px-2.5 py-3.5 text-center transition sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:text-left cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-black transition ${
                      isActive
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-slate-200/70 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.num}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-[11px] sm:text-xs font-extrabold ${isActive ? 'text-slate-950' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-slate-400 tabular-nums">
                      {item.date}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Stage Body */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Unified Dark Obsidian Stage Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-[#0d1323] to-slate-950 text-white shadow-[0_14px_32px_rgba(2,6,23,0.18)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/45 to-transparent" />
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-red-600/15 blur-3xl" />

              <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                {/* Date Calendar Block */}
                <div className="flex items-center gap-3 sm:block sm:w-20 sm:shrink-0 sm:border-r sm:border-white/10 sm:pr-5 sm:text-center">
                  <div className="flex h-12 w-12 sm:h-auto sm:w-auto flex-col items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 sm:border-0 sm:bg-transparent">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300 sm:text-[10px]">
                      {activePhase.month}
                    </span>
                    <span className="font-mono text-xl sm:text-4xl font-black leading-none tracking-tight text-white sm:mt-0.5">
                      {activePhase.day}
                    </span>
                  </div>
                  <div className="sm:hidden min-w-0">
                    <span className="inline-flex items-center rounded-md bg-red-500/15 border border-red-400/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-200">
                      Tahap {activePhase.number} · {activePhase.label}
                    </span>
                    <p className="mt-1 text-[11px] font-semibold text-slate-300 tabular-nums">
                      {activePhase.time}
                    </p>
                  </div>
                  <p className="hidden sm:block mt-1 text-[10px] font-bold text-slate-400 tabular-nums">
                    {activePhase.year}
                  </p>
                </div>

                {/* Title & Copy */}
                <div className="min-w-0 flex-1">
                  <div className="hidden sm:flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-red-500/15 border border-red-400/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-200">
                      Tahap {activePhase.number} · {activePhase.label}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-slate-300 tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {activePhase.time}
                    </span>
                  </div>
                  <h3 className="sm:mt-2.5 text-lg sm:text-xl font-black leading-snug tracking-tight text-white">
                    {activePhase.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-300/90">
                    {activePhase.copy}
                  </p>
                </div>

                {/* Primary Maps Action */}
                <a
                  href={activePhase.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start sm:self-center rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-sm transition hover:bg-slate-100 active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-700" />
                  <span>Buka Rute Maps</span>
                </a>
              </div>
            </div>

            {/* Stage-Specific Operational Grid */}
            {currentTab === 'tm' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="grid gap-3.5 md:grid-cols-2">
                  {/* Hasil Undian Tampil */}
                  <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-mono text-sm font-black text-white shadow-xs">
                      {currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : '#'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Hasil Undian Tampil
                      </p>
                      <p className="mt-0.5 text-sm font-black text-slate-950 truncate">
                        {currentTeam.lotNumber ? `Urutan #${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum melakukan undian'}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                        {currentTeam.chestNumber ? `No. Dada: ${currentTeam.chestNumber}` : 'Nomor terbit setelah sesi TM'}
                      </p>
                    </div>
                  </div>

                  {/* Lokasi Agenda TM */}
                  <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-700 ring-1 ring-slate-200/80">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Lokasi Agenda
                      </p>
                      <p className="mt-0.5 text-sm font-black text-slate-950 leading-snug">
                        {activePhase.venueName}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-snug">
                        {activePhase.venueAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dokumen Wajib TM */}
                <div className="flex flex-col gap-3.5 rounded-2xl border border-slate-200/90 border-l-4 border-l-red-700 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                      <Shield className="w-4.5 h-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-700">
                        Dokumen Wajib TM · Registrasi 12.30–13.00 WIB
                      </p>
                      <p className="mt-0.5 text-sm font-black text-slate-950">
                        Berkas Fisik Asli Technical Meeting
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        Bawa <strong className="text-slate-900">Surat Tugas/Rekomendasi Kepala Sekolah asli stempel basah</strong> &amp; <strong className="text-slate-900">Pakta Integritas Fisik (TTD basah Official)</strong> saat registrasi di Aula Kampus Induk.
                      </p>
                    </div>
                  </div>
                  {onOpenPactModal && (
                    <button
                      type="button"
                      onClick={onOpenPactModal}
                      disabled={isDownloadingPact}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-red-800 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isDownloadingPact ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengunduh...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Pakta A4</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentTab === 'trial' && (
              <div className="grid gap-3.5 md:grid-cols-[1.15fr_0.85fr] animate-in fade-in duration-200">
                {/* RSVP Kehadiran UCL */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        RSVP Kontingen
                      </p>
                      <p className="mt-0.5 text-sm font-black text-slate-950">
                        Konfirmasi Kehadiran UCL
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                        ? 'Hadir'
                        : currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                        ? 'Tidak Hadir'
                        : 'Belum Konfirmasi'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Konfirmasi maksimal <strong className="text-slate-800">10 Januari 2027, 23.59 WIB</strong> demi efisiensi alokasi slot arena.
                  </p>
                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmTrialAttendance(true)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                        currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      {currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed' && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                      <span>Hadir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmTrialAttendance(false)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                        currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'border border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <span>Tidak Hadir</span>
                    </button>
                  </div>
                </div>

                {/* Lokasi Arena UCL */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-700 ring-1 ring-slate-200/80">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Lokasi Arena
                    </p>
                    <p className="mt-0.5 text-sm font-black text-slate-950 leading-snug">
                      {activePhase.venueName}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-snug">
                      {activePhase.venueAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'competition' && (
              <div className="grid gap-3.5 md:grid-cols-[1.2fr_0.8fr] animate-in fade-in duration-200">
                {/* Rundown Alur Tampil Hari-H */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-700">
                        Alur Tampil Hari-H
                      </p>
                      <p className="mt-0.5 text-sm font-black text-slate-950">
                        Rundown Pergerakan Peleton
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white">
                      {autoSchedule?.arena || (currentTeam.jenjang === 'SD' ? 'Arena 01' : 'Arena 02')}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { num: '01', label: 'Standby Basecamp', time: autoSchedule?.readyBasecamp || '06.30' },
                      { num: '02', label: 'Pemeriksaan DP', time: autoSchedule?.checkDP1 || '07.00' },
                      { num: '03', label: 'Masuk Arena', time: autoSchedule?.enterArena || '07.30' },
                    ].map((step, idx) => (
                      <div
                        key={step.num}
                        className="rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-3 text-center"
                      >
                        <span
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-black ${
                            idx === 0 ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {step.num}
                        </span>
                        <p className="mt-2 text-[11px] font-bold text-slate-800 leading-tight">
                          {step.label}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] font-bold text-slate-500 tabular-nums">
                          {step.time}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Alur menit detail disahkan panitia saat pengundian nomor urut TM.</span>
                  </p>
                </div>

                {/* Arena Perlombaan Hari-H */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-700 ring-1 ring-slate-200/80">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Arena Perlombaan
                    </p>
                    <p className="mt-0.5 text-sm font-black text-slate-950 leading-snug">
                      {activePhase.venueName}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-snug">
                      {activePhase.venueAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Unified Survei Armada Kendaraan */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
              <div className="flex flex-col gap-1.5 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                    {currentTab === 'tm' ? <Car className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-950 truncate">
                      {activeVehicleMeta.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 truncate">
                      {activeVehicleMeta.subtitle}
                    </p>
                  </div>
                </div>
                <span
                  className={`self-start sm:self-center shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tabular-nums ${
                    activeVehicleTotal > 0
                      ? 'bg-red-50 text-red-700 border border-red-200/70'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {activeVehicleTotal > 0 ? `Total ${activeVehicleTotal} unit` : 'Belum diisi'}
                </span>
              </div>

              <div className="grid gap-2.5 p-3.5 sm:grid-cols-2">
                {activeVehicleMeta.items.map(item => {
                  const ItemIcon = item.icon;
                  const count = Number(activeVehicleCounts[item.key]) || 0;
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition ${
                        count > 0
                          ? 'border-slate-300 bg-white shadow-2xs'
                          : 'border-slate-200/70 bg-slate-50/50 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                            count > 0
                              ? 'bg-slate-950 text-white'
                              : 'bg-white text-slate-500 ring-1 ring-slate-200'
                          }`}
                        >
                          <ItemIcon className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">{item.label}</p>
                          <p className="truncate text-[10.5px] font-medium text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateVehicleCount(currentTab, item.key, -1)}
                          disabled={count === 0}
                          aria-label={`Kurangi ${item.label}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-35 disabled:hover:bg-transparent cursor-pointer"
                        >
                          −
                        </button>
                        <span
                          className={`w-6 text-center font-mono text-xs font-black tabular-nums ${
                            count > 0 ? 'text-red-700' : 'text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateVehicleCount(currentTab, item.key, 1)}
                          aria-label={`Tambah ${item.label}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Embedded Maps Preview */}
            <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100">
              <iframe
                key={activePhase.embedUrl}
                title={`Peta Lokasi ${activePhase.label}`}
                src={activePhase.embedUrl}
                className="block h-full w-full border-0"
                loading="lazy"
              />
              <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/80 bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Peta Lokasi
                </p>
                <p className="text-xs font-black text-slate-950">{activePhase.mapLabel}</p>
              </div>
              <a
                href={activePhase.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/95 px-3.5 py-2 text-[11px] font-bold text-white shadow-lg transition hover:bg-red-700"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Mulai Navigasi</span>
              </a>
            </div>
          </div>
        </section>

        {/* KOLOM KANAN: READINESS SCORE & RESOURCE DOCK */}
        <aside className="space-y-4 xl:sticky xl:top-20">
          
          {/* READINESS SCORE CARD */}
          <article className="overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
            {/* Header: Clean & Calm Dark Obsidian */}
            <div className="relative overflow-hidden bg-slate-950 p-5 text-white">
              <div className="absolute -right-14 -top-20 h-44 w-44 rounded-full border-[28px] border-white/[0.035] pointer-events-none" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-400">
                    READINESS SCORE
                  </p>
                  <h3 className="mt-1 text-base font-black tracking-tight text-white">
                    {readinessPercent >= 100 ? 'Kontingen Siap Berlaga' : 'Kelengkapan Berkas'}
                  </h3>
                  <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                    {readinessPercent >= 100 ? 'Persyaratan utama & berkas terpenuhi sah' : 'Lengkapi personel & berkas administrasi'}
                  </p>
                </div>

                {/* Circular Progress Ring */}
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke={readinessPercent >= 100 ? '#10b981' : '#f59e0b'}
                      strokeWidth="3"
                      strokeDasharray={`${(readinessPercent / 100) * 94} 94`}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className={`text-[11px] font-black font-mono ${readinessPercent >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {readinessPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Breakdown: Clean, Calm & Balanced (No visual noise) */}
            <div className="p-4 space-y-2.5 bg-white">
              {/* Komandan (Danton) */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    Komandan (Danton)
                  </span>
                  <p className="truncate text-xs font-black text-slate-900 mt-0.5">
                    {hasDanton ? dantonName : 'Belum diisi'}
                  </p>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    hasDanton ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                  }`}
                  title={hasDanton ? 'Siap' : 'Belum diisi'}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>

              {/* 3 Balanced Metric Columns */}
              <div className="grid grid-cols-3 gap-2">
                {/* Pasukan Inti */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    Pasukan
                  </span>
                  <p className="mt-1 text-xs font-black font-mono text-slate-900">
                    {filledPasukan} <span className="text-[9px] font-normal text-slate-400">/ 21</span>
                  </p>
                  {filledPasukan >= 21 ? (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-600">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Lengkap</span>
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-amber-600">
                      <span>Belum</span>
                    </span>
                  )}
                </div>

                {/* Cadangan */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    Cadangan
                  </span>
                  <p className="mt-1 text-xs font-black font-mono text-slate-900">
                    {filledCadangan} <span className="text-[9px] font-normal text-slate-400">/ 3</span>
                  </p>
                  {filledCadangan >= 3 ? (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-600">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Lengkap</span>
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-amber-600">
                      <span>Opsional</span>
                    </span>
                  )}
                </div>

                {/* Berkas */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    Berkas
                  </span>
                  <p className="mt-1 text-xs font-black font-mono text-slate-900">
                    {filledDocs} <span className="text-[9px] font-normal text-slate-400">/ 4</span>
                  </p>
                  {filledDocs >= 4 ? (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-600">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Lengkap</span>
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-amber-600">
                      <span>Belum</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons: Clean & Elegant */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-red-700 px-3 py-2.5 text-[9.5px] font-black text-white shadow-2xs transition hover:bg-red-800 active:scale-95 cursor-pointer"
              >
                <span>Kelola Personel</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[9.5px] font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 cursor-pointer text-center"
              >
                Lihat Berkas
              </button>
            </div>
          </article>

          {/* PENDAMPING PELETON - LO & POSKO BANTUAN */}
          <article className="overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.055)]">
            {/* Header Card */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-2xs">
                <UserCheck className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-red-700">
                  Layanan Kontingen
                </p>
                <h4 className="text-sm font-black tracking-tight text-slate-950">
                  LO &amp; Posko Bantuan
                </h4>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* LIAISON OFFICER (LO PELETON) */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                {isLoAssigned ? (
                  <div className="flex items-center gap-3.5">
                    {loPhoto ? (
                      <img
                        src={loPhoto}
                        alt={loDisplayName}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover object-top ring-1 ring-slate-200"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(loDisplayName)}&background=0f172a&color=fff&bold=true`;
                        }}
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 font-mono text-sm font-black text-white shadow-xs ring-1 ring-slate-950/10">
                        {loInitials}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <span className="inline-block rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        {loRole || 'Liaison Officer'}
                      </span>
                      <h5 className="mt-1 text-sm font-black text-slate-950 leading-snug truncate">
                        {loDisplayName}
                      </h5>
                      <p className="text-[11px] font-medium text-slate-500">
                        Panitia LBB · Kampus Sedayu
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200">
                      <UserCheck className="w-4.5 h-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-black text-slate-950">
                        Penetapan saat TM
                      </h5>
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                        LO peleton diperkenalkan langsung saat Technical Meeting.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Support Channels */}
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                {/* SEKRETARIAT & PENDAFTARAN */}
                <a
                  href="https://wa.me/6281947491505"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 p-3.5 transition hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-red-700 group-hover:text-white">
                      <Phone className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-950 group-hover:text-red-700 transition">
                        Sekretariat &amp; Pendaftaran
                      </p>
                      <p className="mt-0.5 text-[11px] font-mono text-slate-500">
                        0819-4749-1505 · Admin Tonti
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-red-700" />
                </a>

                {/* POSKO MEDIS & EVAKUASI */}
                <div className="flex items-start gap-3 p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                    <HeartPulse className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-950 leading-snug">
                      Posko Medis &amp; Evakuasi
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500 leading-snug">
                      PMR / KSR Siaga Ambulans
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200/70 px-2 py-0.5 text-[10px] font-bold text-red-700">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>Arena Sedayu</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </aside>

      </div>
    </div>
  );
}
