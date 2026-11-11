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

  // Kalkulasi jadwal dinamis Uji Coba Lapangan (UCL) dengan perapatan slot jika ada yang berhalangan
  const dynamicTrialMap = React.useMemo(() => {
    const teamsList = (allTeams && allTeams.length > 0) ? allTeams : [currentTeam];
    return calculateDynamicTrialSchedule(teamsList, UJI_COBA_SCHEDULE);
  }, [allTeams, currentTeam]);

  const teamDynamicTrial = dynamicTrialMap[currentTeam.id];
  const autoTrialSchedule = teamDynamicTrial?.schedule || (lotIdx >= 0 ? UJI_COBA_SCHEDULE[jKey]?.[lotIdx] : null);

  const displayEstimatedTime = currentTeam.estimatedTime || autoSchedule?.startTampil || (currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : null);
  const displayBasecamp = currentTeam.basecampNumber || (currentTeam.lotNumber ? `Ruang ${String(currentTeam.lotNumber).padStart(2, '0')}` : null);

  // Format jam spesifik Uji Coba Lapangan (UCL) dari matriks resmi (dinamis sesuai slot yang terisi)
  const trialArenaTime = autoTrialSchedule?.enterArena && autoTrialSchedule?.finishArena 
    ? `${autoTrialSchedule.enterArena.replace(' WIB', '')} - ${autoTrialSchedule.finishArena.replace(' WIB', '')}`
    : autoTrialSchedule?.enterArena || null;
  const displayTrialTime = currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
    ? 'Berhalangan'
    : !settings?.trialSchedulePublished
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
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('192.168.')
  );
  const loName = currentTeam?.loName || (isLocalhost ? 'Kak Rizky Fauzi (Panitia LBB)' : null);
  const loRole = currentTeam?.loRole || (isLocalhost ? 'LO Pendamping Peleton' : null);
  const loPhoto = currentTeam?.loPhoto || (isLocalhost ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80' : null);
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
      day: '09',
      month: 'JAN',
      year: '2027',
      label: 'Technical Meeting',
      time: '13.00 WIB s.d. Selesai',
      title: 'Technical Meeting & Validasi Fisik Berkas',
      copy: 'Wajib dihadiri 1 Pembina dan 1 Danton. Agenda pengambilan nomor dada & pengundian nomor urut tampil peleton.',
      badgeClass: 'bg-purple-100 text-purple-700',
      btnClass: 'bg-purple-600 hover:bg-purple-700',
      mapsUrl: EVENT.TECHNICAL_MEETING_MAPS_URL || "https://www.google.com/maps/dir/?api=1&destination=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68+Wirobrajan"
    },
    trial: {
      number: '02',
      day: '16',
      month: 'JAN',
      year: '2027',
      label: 'Uji Coba Lapangan',
      time: '07.00 WIB s.d. 13.00 WIB',
      title: 'Uji Coba Lapangan (UCL) & Orientasi Arena',
      copy: 'Pengenalan pos arena perlombaan, pos DP 1, DP 2, dan area steril demi kesiapan teknis peleton.',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700',
      mapsUrl: VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"
    },
    competition: {
      number: '03',
      day: '24',
      month: 'JAN',
      year: '2027',
      label: 'Hari Perlombaan',
      time: '06.00 WIB s.d. 17.00 WIB',
      title: 'Hari-H Pelaksanaan LBB Mu’allimin 2027',
      copy: 'Daftar ulang mulai 06.00 WIB, dilanjutkan upacara pembukaan dan perlombaan di lapangan utama.',
      badgeClass: 'bg-red-100 text-red-700',
      btnClass: 'bg-red-600 hover:bg-red-700',
      mapsUrl: VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"
    }
  };

  const activePhase = phaseConfig[currentTab] || phaseConfig.tm;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Toast Save Survei */}
      {surveySaveToast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{surveySaveToast}</span>
        </div>
      )}

      {/* 0. COUNTDOWN BATAS ROSTER & BERKAS (H-1 TM) - ULTRA COMPACT & CLEAN */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 px-4 sm:px-5 py-3.5 text-white shadow-xs">
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          {/* Kiri: Judul, Jadwal, & Inline Progres */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-300">
                DEADLINE H-1 TECHNICAL MEETING
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">
                08 Jan 2027, 23.59 WIB
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
              Batas Melengkapi Roster & Berkas Peleton
            </h2>

            {/* Inline Progres Kelengkapan - 1 Baris Bersih */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-24 sm:w-28 h-1.5 rounded-full bg-slate-800 overflow-hidden shrink-0">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    readinessPercent >= 100 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">
                Progres:{' '}
                <strong className={readinessPercent >= 100 ? 'text-emerald-400' : 'text-amber-400'}>
                  {readinessPercent}% ({completedItems}/{totalItems} Data Terisi)
                </strong>
              </span>
            </div>
          </div>

          {/* Kanan: 4 Kotak Waktu Sederhana */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-start md:self-auto">
            {[
              { label: 'HARI', val: timeLeft.days },
              { label: 'JAM', val: timeLeft.hours },
              { label: 'MENIT', val: timeLeft.minutes },
              { label: 'DETIK', val: timeLeft.seconds }
            ].map((unit, idx, arr) => (
              <React.Fragment key={unit.label}>
                <div className="flex min-w-[52px] sm:min-w-[60px] flex-col items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/90 py-1.5 sm:py-2 px-1.5 text-center">
                  <span className="font-mono text-base sm:text-xl font-black text-white leading-tight">
                    {String(unit.val).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] sm:text-[7.5px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                    {unit.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-600 animate-pulse select-none -mx-0.5">
                    :
                  </span>
                )}
              </React.Fragment>
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
                {displayBasecamp ? 'Transit kontingen' : 'Diumumkan saat TM'}
              </p>
            </div>
            <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-red-600 transition-transform group-hover:scale-x-100" />
          </div>
        </div>
      </section>

      {/* 1.5 PAPAN PENGUMUMAN RESMI PANITIA */}
      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.045)]">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-sm">
              <Megaphone className="w-5 h-5" />
            </span>
            <div>
              <p className="section-kicker">BROADCAST BOARD</p>
              <h3 className="mt-0.5 text-base font-black tracking-tight text-slate-950">
                Papan Pengumuman Resmi Panitia
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-600 border border-slate-200/70">
            <Radio className="w-3 h-3 text-red-600 animate-pulse" />
            <span>3 Arahan Operasional</span>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {/* Pengumuman 1 */}
          <div className="p-5 flex flex-col justify-between space-y-3 transition hover:bg-slate-50/60">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[8px] font-black text-purple-700 uppercase tracking-wider">
                  TM & Undian
                </span>
                <span className="text-[9px] font-medium text-slate-400">Sabtu, 9 Jan 2027</span>
              </div>
              <h4 className="mt-2 text-xs font-black text-slate-900 leading-snug">
                Pengambilan Nomor Dada & Undian Tampil Peleton
              </h4>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-600">
                Pengundian nomor urut tampil peleton serta pembagian nomor dada resmi seragam dilaksanakan langsung saat sesi Technical Meeting di Kampus Induk Mu'allimin.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[9.5px] font-bold text-purple-700 flex items-center gap-1">
              <span>Wajib hadir: 1 Pembina & 1 Danton</span>
            </div>
          </div>

          {/* Pengumuman 2 */}
          <div className="p-5 flex flex-col justify-between space-y-3 transition hover:bg-slate-50/60">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[8px] font-black text-emerald-700 uppercase tracking-wider">
                  Administrasi
                </span>
                <span className="text-[9px] font-medium text-slate-400">Validasi Fisik</span>
              </div>
              <h4 className="mt-2 text-xs font-black text-slate-900 leading-snug">
                Pemeriksaan Fisik Berkas & Surat Rekomendasi
              </h4>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-600">
                Harap membawa hardcopy Formulir A.1 (Roster Peleton) dan Surat Rekomendasi Kepala Sekolah berstempel basah saat registrasi ulang TM demi verifikasi keabsahan peserta.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[9.5px] font-bold text-emerald-700 flex items-center gap-1">
              <span>Bawa map snelhecter berstempel sekolah</span>
            </div>
          </div>

          {/* Pengumuman 3 */}
          <div className="p-5 flex flex-col justify-between space-y-3 transition hover:bg-slate-50/60">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[8px] font-black text-blue-700 uppercase tracking-wider">
                  Fasilitas & LO
                </span>
                <span className="text-[9px] font-medium text-slate-400">Kampus Sedayu</span>
              </div>
              <h4 className="mt-2 text-xs font-black text-slate-900 leading-snug">
                Alokasi Basecamp & Pendampingan LO Kontingen
              </h4>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-600">
                Tiap ruangan kelas difungsikan untuk 2 kontingen. LO resmi peleton ({loName ? loName.split(' ')[0] + ' ' + (loName.split(' ')[1] || '') : 'Kak LO'}) siap menyambut sejak gerbang kedatangan untuk briefing alur transit & gladi.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[9.5px] font-bold text-blue-700 flex items-center gap-1">
              <span>1 Peleton didampingi 1 LO Panitia</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN GRID (Kiri: Operation Timeline, Kanan: Readiness Score & Resource Dock) */}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        
        {/* KOLOM KIRI: OPERATION TIMELINE INTERAKTIF */}
        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_46px_rgba(15,23,42,0.065)]">
          {/* Header Section */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-slate-50/80 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <Calendar className="w-5 h-5" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-600" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="section-kicker">OPERATION TIMELINE</p>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-black text-red-700 border border-red-100">
                      WAJIB
                    </span>
                  </div>
                  <h2 className="mt-0.5 text-base font-black tracking-tight text-slate-950 sm:text-lg">
                    Agenda Kontingen 2027
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-[0.12em] text-slate-500">
                  Timeline aktif · 3 tahap
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Stepper Tabs 3 Tahap dengan Garis Penghubung */}
            <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-2">
              <div className="relative grid grid-cols-3 gap-1">
                <div className="absolute left-[16%] right-[16%] top-6 hidden h-px bg-slate-200 sm:block" />
                {[
                  { key: 'tm', num: '01', label: 'Technical Meeting', date: '09 Jan', dot: 'bg-purple-600' },
                  { key: 'trial', num: '02', label: 'Uji Coba (UCL)', date: '16 Jan', dot: 'bg-emerald-600' },
                  { key: 'competition', num: '03', label: 'Hari Perlombaan', date: '24 Jan', dot: 'bg-red-600' },
                ].map(item => {
                  const isActive = currentTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setScheduleTab(item.key)}
                      className={`relative z-10 flex min-h-[66px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition sm:flex-row sm:gap-3 sm:text-left cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-950 shadow-[0_8px_22px_rgba(15,23,42,0.09)] ring-1 ring-slate-200'
                          : 'text-slate-500 hover:bg-white/70'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-black transition ${
                          isActive
                            ? `${item.dot} text-white shadow-md`
                            : 'border border-slate-200 bg-white text-slate-400'
                        }`}
                      >
                        {isActive ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.num}
                      </span>
                      <span className="mt-1 min-w-0 sm:mt-0">
                        <span
                          className={`block truncate text-[9px] font-black ${
                            isActive ? 'text-slate-950' : 'text-slate-600'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[8px] text-slate-400 font-medium">
                          {item.date} 2027
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Big Dark Hero Phase Card */}
            <div className="relative overflow-hidden rounded-[24px] bg-slate-950 text-white shadow-[0_18px_38px_rgba(15,23,42,0.2)]">
              <div
                className={`absolute inset-y-0 left-0 w-1.5 ${
                  currentTab === 'tm' ? 'bg-purple-500' : currentTab === 'trial' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <div
                className={`absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl pointer-events-none ${
                  currentTab === 'tm'
                    ? 'bg-purple-600/20'
                    : currentTab === 'trial'
                    ? 'bg-emerald-600/20'
                    : 'bg-red-600/20'
                }`}
              />
              <div className="relative grid gap-5 p-5 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center sm:p-6">
                <div className="hidden border-r border-white/10 pr-5 text-center sm:block">
                  <p className="text-[9px] font-black tracking-[0.2em] text-slate-400">{activePhase.month}</p>
                  <p className="mt-0.5 text-4xl font-black tracking-[-0.06em] text-white font-mono">{activePhase.day}</p>
                  <p className="mt-0.5 text-[8px] font-bold text-slate-500">{activePhase.year}</p>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wider ${activePhase.badgeClass}`}>
                      Tahap {activePhase.number} · {activePhase.label}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[8px] font-bold text-slate-300">
                      {activePhase.time}
                    </span>
                  </div>
                  <h3 className="mt-3 max-w-2xl text-lg font-black leading-tight tracking-tight text-white sm:text-2xl">
                    {activePhase.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-[10px] sm:text-xs leading-relaxed text-slate-400">
                    {activePhase.copy}
                  </p>
                </div>
                <a
                  href={activePhase.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex shrink-0 items-center justify-center gap-2 self-start sm:self-center rounded-xl px-4 py-2.5 text-[9px] font-black text-white shadow-lg transition-transform active:scale-95 ${activePhase.btnClass}`}
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>{currentTab === 'trial' ? 'Buka Lokasi' : 'Buka Rute Maps'}</span>
                </a>
              </div>
            </div>

            {/* TAB CONTENT DETAIL */}
            {currentTab === 'tm' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
                  {/* Undian Tampil Card */}
                  <div className="relative overflow-hidden rounded-[20px] border border-purple-100 bg-purple-50/60 p-4">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[16px] border-purple-600/[0.04] pointer-events-none" />
                    <div className="relative flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-sm font-black text-white shadow-md">
                        {currentTeam.lotNumber ? `#${currentTeam.lotNumber}` : '#'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-wider text-purple-700">
                          Hasil undian tampil
                        </p>
                        <p className="mt-0.5 text-xs font-black text-slate-900 truncate">
                          {currentTeam.lotNumber ? `Urutan #${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum melakukan undian'}
                        </p>
                        <p className="mt-0.5 text-[8px] text-slate-500">
                          {currentTeam.chestNumber ? `No. Dada: ${currentTeam.chestNumber}` : 'Nomor terbit setelah sesi TM'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Card TM */}
                  <div className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-white">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 text-purple-600">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                          Lokasi agenda
                        </p>
                        <p className="mt-0.5 text-xs font-black text-slate-900">
                          Aula Kampus Induk Mu’allimin Yogyakarta
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-500 leading-tight">
                          Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pakta Integritas Fisik Callout */}
                <div className="flex flex-col gap-3 rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                      <Shield className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.13em] text-red-700">
                        Dokumen wajib TM
                      </p>
                      <p className="mt-0.5 text-xs font-black text-slate-900">
                        Pakta Integritas Fisik (Tanda Tangan Basah)
                      </p>
                      <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">
                        Cetak, tandatangani basah, dan bawa saat registrasi TM di Kampus Induk.
                      </p>
                    </div>
                  </div>
                  {onOpenPactModal && (
                    <button
                      type="button"
                      onClick={onOpenPactModal}
                      disabled={isDownloadingPact}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-red-700 px-3.5 py-2.5 text-[9px] font-black text-white shadow-md hover:bg-red-800 transition active:scale-95 cursor-pointer disabled:opacity-50"
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

                {/* Survei Armada TM */}
                <div className="overflow-hidden rounded-[20px] border border-purple-200 bg-white">
                  <div className="flex flex-col gap-2 border-b border-purple-100 bg-purple-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
                        <Car className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-purple-800">
                          Mobilitas kontingen
                        </p>
                        <h4 className="text-xs font-black text-slate-950">
                          Estimasi Armada Kendaraan saat TM
                        </h4>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">
                      Untuk alokasi parkir Kampus Induk
                    </span>
                  </div>

                  <div className="grid gap-2 p-3 sm:grid-cols-2">
                    {[
                      { key: 'motor', label: 'Sepeda Motor', desc: 'Roda Dua (Parkir Motor)', icon: Bike },
                      { key: 'mobil', label: 'Mobil Pribadi', desc: 'Sedan / MPV / SUV', icon: Car },
                    ].map(item => {
                      const ItemIcon = item.icon;
                      const count = currentTeam.vehicleSurveys?.tm?.counts?.[item.key] || 0;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 transition hover:border-purple-200 hover:bg-white"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-2xs ring-1 ring-slate-200">
                              <ItemIcon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[10px] font-black text-slate-900">{item.label}</p>
                              <p className="truncate text-[8px] text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateVehicleCount('tm', item.key, -1)}
                              className="h-6 w-6 rounded-md text-xs font-black text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-mono text-[10px] font-black text-slate-900">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateVehicleCount('tm', item.key, 1)}
                              className="h-6 w-6 rounded-md bg-purple-600 hover:bg-purple-700 text-xs font-black text-white transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Maps TM */}
                <div className="relative h-60 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-inner">
                  <iframe
                    title="Peta Lokasi TM"
                    src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="h-full w-full border-0 block"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur">
                    <p className="text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">PETA ARENA</p>
                    <p className="text-[9px] font-black text-slate-900">Kampus Induk Wirobrajan</p>
                  </div>
                  <a
                    href={EVENT.TECHNICAL_MEETING_MAPS_URL || "https://www.google.com/maps/dir/?api=1&destination=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68+Wirobrajan"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/95 px-3 py-2 text-[8px] font-black text-white shadow-lg transition hover:bg-purple-700 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 fill-current" />
                    <span>Mulai Navigasi Rute</span>
                  </a>
                </div>
              </div>
            )}

            {currentTab === 'trial' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  {/* RSVP Card */}
                  <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 bg-emerald-50/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.13em] text-emerald-800">
                            RSVP KONTINGEN
                          </p>
                          <p className="mt-0.5 text-xs font-black text-slate-900">
                            Konfirmasi Kehadiran UCL
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[8px] font-black uppercase ${
                            currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          {currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                            ? 'HADIR'
                            : currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                            ? 'TIDAK HADIR'
                            : 'BELUM KONFIRMASI'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] leading-relaxed text-slate-500">
                        Konfirmasi maksimal <strong className="text-slate-800">10 Januari 2027, 23.59 WIB</strong> demi efisiensi slot arena.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirmTrialAttendance(true)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                            currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmTrialAttendance(false)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                            currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                              ? 'bg-red-700 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Tidak Hadir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location Card UCL */}
                  <div className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-white flex flex-col justify-center">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 text-emerald-600">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                          Lokasi arena
                        </p>
                        <p className="mt-0.5 text-xs font-black text-slate-900">
                          Kampus Terpadu Mu’allimin Sedayu
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-500 leading-tight">
                          Bandut Lor, Argorejo, Kec. Sedayu, Bantul
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Survei Armada UCL */}
                <div className="overflow-hidden rounded-[20px] border border-emerald-200 bg-white">
                  <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/60 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                        <Bus className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-emerald-800">
                          Survei armada
                        </p>
                        <h4 className="text-xs font-black text-slate-950">
                          Armada Kendaraan Menuju UCL (16 Jan 2027)
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 p-3 sm:grid-cols-2">
                    {[
                      { key: 'motor', label: 'Sepeda Motor', desc: 'Official & suporter', icon: Bike },
                      { key: 'mobil', label: 'Mobil Pribadi', desc: 'Avanza / Innova', icon: Car },
                      { key: 'elf', label: 'Minibus / Elf / HiAce', desc: 'Kapasitas 12-19 kursi', icon: Bus },
                      { key: 'bus', label: 'Big / Medium Bus', desc: 'Bus besar rombongan', icon: Bus },
                    ].map(item => {
                      const ItemIcon = item.icon;
                      const count = currentTeam.vehicleSurveys?.trial?.counts?.[item.key] || 0;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 transition hover:border-emerald-200 hover:bg-white"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-2xs ring-1 ring-slate-200">
                              <ItemIcon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[10px] font-black text-slate-900">{item.label}</p>
                              <p className="truncate text-[8px] text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateVehicleCount('trial', item.key, -1)}
                              className="h-6 w-6 rounded-md text-xs font-black text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-mono text-[10px] font-black text-slate-900">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateVehicleCount('trial', item.key, 1)}
                              className="h-6 w-6 rounded-md bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Maps Sedayu */}
                <div className="relative h-60 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-inner">
                  <iframe
                    title="Peta Lokasi UCL"
                    src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Kampus+Terpadu+Sedayu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="h-full w-full border-0 block"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur">
                    <p className="text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">PETA ARENA</p>
                    <p className="text-[9px] font-black text-slate-900">Kampus Terpadu Sedayu</p>
                  </div>
                  <a
                    href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/95 px-3 py-2 text-[8px] font-black text-white shadow-lg transition hover:bg-emerald-700 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 fill-current" />
                    <span>Mulai Navigasi Rute</span>
                  </a>
                </div>
              </div>
            )}

            {currentTab === 'competition' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  {/* Rundown Alur Tampil */}
                  <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.13em] text-red-700">
                          Competition Flow
                        </p>
                        <p className="mt-0.5 text-xs font-black text-slate-950">
                          Rundown Alur Tampil Hari-H
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[8px] font-black text-white">
                        {autoSchedule?.arena || (currentTeam.jenjang === 'SD' ? 'Arena 01' : 'Arena 02')}
                      </span>
                    </div>

                    <div className="flex items-start px-4 py-4">
                      {[
                        { num: '01', label: 'Standby Basecamp', time: autoSchedule?.readyBasecamp || '06.30' },
                        { num: '02', label: 'Pemeriksaan DP', time: autoSchedule?.checkDP1 || '07.00' },
                        { num: '03', label: 'Masuk Arena', time: autoSchedule?.enterArena || '07.30' },
                      ].map((step, idx) => (
                        <div key={step.num} className="flex flex-1 items-start">
                          <div className="min-w-0 flex-1 text-center">
                            <span
                              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[8px] font-black ${
                                idx === 0 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {step.num}
                            </span>
                            <p className="mt-1.5 text-[8px] font-bold text-slate-800 leading-tight">
                              {step.label}
                            </p>
                            <p className="text-[8px] font-mono text-slate-400 mt-0.5">
                              {step.time}
                            </p>
                          </div>
                          {idx < 2 && <span className="mt-3.5 h-px w-4 shrink-0 bg-slate-200" />}
                        </div>
                      ))}
                    </div>

                    <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[8px] font-semibold text-amber-800 border border-amber-200/60">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Alur menit detail disahkan panitia saat pengundian nomor urut TM</span>
                    </div>
                  </div>

                  {/* Location Card Hari-H */}
                  <div className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-white flex flex-col justify-center">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 text-red-600">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                          Arena Perlombaan
                        </p>
                        <p className="mt-0.5 text-xs font-black text-slate-900">
                          Kampus Terpadu Mu’allimin Sedayu
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-500 leading-tight">
                          Dusun Bandut Lor, Argorejo, Sedayu, Bantul
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Survei Armada Hari-H */}
                <div className="overflow-hidden rounded-[20px] border border-red-200 bg-white">
                  <div className="flex items-center justify-between border-b border-red-100 bg-red-50/60 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-xs">
                        <Bus className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-red-800">
                          Stiker parkir resmi
                        </p>
                        <h4 className="text-xs font-black text-slate-950">
                          Survei Jumlah Kendaraan Kontingen Hari-H (24 Jan 2027)
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 p-3 sm:grid-cols-2">
                    {[
                      { key: 'motor', label: 'Sepeda Motor', desc: 'Suporter & Official', icon: Bike },
                      { key: 'mobil', label: 'Mobil Pribadi', desc: 'Kendaraan guru & pendamping', icon: Car },
                      { key: 'elf', label: 'Minibus / Elf / HiAce', desc: 'Kapasitas 12-19 seat', icon: Bus },
                      { key: 'bus', label: 'Big / Medium Bus', desc: 'Bus besar rombongan (30-50+)', icon: Bus },
                    ].map(item => {
                      const ItemIcon = item.icon;
                      const count = currentTeam.vehicleSurveys?.competition?.counts?.[item.key] || 0;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 transition hover:border-red-200 hover:bg-white"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-2xs ring-1 ring-slate-200">
                              <ItemIcon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[10px] font-black text-slate-900">{item.label}</p>
                              <p className="truncate text-[8px] text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateVehicleCount('competition', item.key, -1)}
                              className="h-6 w-6 rounded-md text-xs font-black text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-mono text-[10px] font-black text-slate-900">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateVehicleCount('competition', item.key, 1)}
                              className="h-6 w-6 rounded-md bg-red-700 hover:bg-red-800 text-xs font-black text-white transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Maps Hari-H */}
                <div className="relative h-60 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-inner">
                  <iframe
                    title="Peta Lokasi Hari-H"
                    src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Kampus+Terpadu+Sedayu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="h-full w-full border-0 block"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur">
                    <p className="text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">PETA ARENA</p>
                    <p className="text-[9px] font-black text-slate-900">Kampus Terpadu Sedayu</p>
                  </div>
                  <a
                    href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/95 px-3 py-2 text-[8px] font-black text-white shadow-lg transition hover:bg-red-700 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 fill-current" />
                    <span>Mulai Navigasi Rute</span>
                  </a>
                </div>
              </div>
            )}
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
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-600">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Lengkap</span>
                  </span>
                </div>

                {/* Cadangan */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    Cadangan
                  </span>
                  <p className="mt-1 text-xs font-black font-mono text-slate-900">
                    {filledCadangan} <span className="text-[9px] font-normal text-slate-400">/ 3</span>
                  </p>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-600">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Lengkap</span>
                  </span>
                </div>

                {/* Berkas */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    Berkas
                  </span>
                  <p className="mt-1 text-xs font-black font-mono text-slate-900">
                    {filledDocs} <span className="text-[9px] font-normal text-slate-400">/ 4</span>
                  </p>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-600">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Lengkap</span>
                  </span>
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
          <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.055)]">
            {/* Header Card */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-red-700">
                    PENDAMPING PELETON
                  </p>
                  <h4 className="mt-0.5 text-sm font-black tracking-tight text-slate-950">
                    LO & Posko Bantuan
                  </h4>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-bold ${
                isLoAssigned ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isLoAssigned ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>{isLoAssigned ? 'Siaga Lomba' : 'Menunggu TM'}</span>
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {/* LIAISON OFFICER (LO PELETON) - STREAMLINED & ELEGANT */}
              <div className="relative overflow-hidden rounded-[20px] border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 p-4 transition-all">
                {isLoAssigned ? (
                  <div className="flex items-center gap-3.5">
                    {/* Foto LO Besar */}
                    <div className="relative shrink-0">
                      <img
                        src={loPhoto}
                        alt={loName || 'Liaison Officer'}
                        className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl object-cover object-top border-2 border-emerald-500 shadow-sm ring-4 ring-emerald-100/90"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(loName || 'Rizky Fauzi')}&background=059669&color=fff&bold=true`;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white border-2 border-white shadow-xs" title="LO Resmi Terverifikasi">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>

                    {/* Informasi LO: Bersih, Rapi & Ringkas */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>LO Resmi Peleton</span>
                      </span>

                      <h5 className="text-sm sm:text-base font-black text-slate-950 leading-snug">
                        {loName ? loName.replace(/\s*\(Panitia LBB\)/i, '') : 'Kak Rizky Fauzi'}
                      </h5>

                      <p className="text-[10px] text-slate-500 font-medium">
                        Panitia LBB • Kampus Sedayu
                      </p>

                      <p className="text-[10px] text-emerald-800/90 font-medium leading-tight pt-0.5">
                        Pendamping resmi kontingen peleton Anda.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <UserCheck className="w-6 h-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-800">
                        LIAISON OFFICER
                      </span>
                      <h5 className="text-sm font-black text-slate-950">
                        Penetapan saat TM
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        Diperkenalkan langsung saat Technical Meeting.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SEKRETARIAT & PENDAFTARAN */}
              <a
                href="https://wa.me/6281947491505"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-[18px] border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition truncate">
                      Sekretariat & Pendaftaran
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      0819-4749-1505 (Admin Tonti)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </a>

              {/* POSKO MEDIS & EVAKUASI */}
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-200/80 bg-slate-50/70 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      Posko Medis & Evakuasi
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                      PMR / KSR Siaga Ambulans
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-[8.5px] font-black text-red-700">
                  Arena Sedayu
                </span>
              </div>
            </div>

            {/* DOKUMEN RESMI - JUKNIS PDF */}
            <div className="border-t border-slate-100 p-3.5 bg-slate-50/50">
              <a
                href={DOWNLOADS?.[0]?.url || "https://drive.google.com/file/d/1owEDyb680TNB3TkFvZGVfjD_OCbagffQ/view?usp=sharing"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center gap-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 p-2.5 text-left text-white transition cursor-pointer"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
                  <FileText className="w-3.5 h-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[7.5px] font-black uppercase tracking-wider text-amber-300">
                    DOKUMEN RESMI · PDF
                  </span>
                  <span className="block truncate text-[10px] font-black text-white">
                    Petunjuk Teknis LBB 2027
                  </span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-white transition" />
              </a>
            </div>
          </article>
        </aside>

      </div>
    </div>
  );
}
