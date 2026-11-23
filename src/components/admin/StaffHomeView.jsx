import React, { useState, useEffect, useMemo } from 'react';
import {
  Timer,
  RefreshCw,
  ClipboardList,
  CalendarCheck,
  Compass,
  Building2,
  Clock,
  Award,
  FileSpreadsheet,
  Trophy,
  Crown,
  CheckCircle2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

const MILESTONES = [
  {
    id: 'deadline_berkas',
    label: 'Batas Berkas & Roster',
    tag: 'H-1 TM',
    dateText: '08 Jan 2027 · 23.59 WIB',
    targetIso: '2027-01-08T23:59:59+07:00',
  },
  {
    id: 'tm',
    label: 'Technical Meeting',
    tag: 'TM',
    dateText: '09 Jan 2027 · 12.30 WIB',
    targetIso: '2027-01-09T12:30:00+07:00',
  },
  {
    id: 'ucl',
    label: 'Uji Coba Lapangan',
    tag: 'UCL',
    dateText: '16 Jan 2027 · 07.00 WIB',
    targetIso: '2027-01-16T07:00:00+07:00',
  },
  {
    id: 'hari_h',
    label: 'Hari-H LBB Mu’allimin 2027',
    tag: 'Hari-H',
    dateText: '24 Jan 2027 · 06.00 WIB',
    targetIso: '2027-01-24T06:00:00+07:00',
  },
];

function computeTimeLeft(targetIso) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function StaffHomeView() {
  const {
    teams = [],
    scores = {},
    staging = {},
    settings = {},
    currentUser,
    role,
    canAccessStage,
    navigateToStage,
    setActiveView,
    setAdminActiveTab,
    pullFromGoogleSheet,
  } = useCompetition();

  const userRole = currentUser?.role || role || 'admin';
  const [isRefreshing, setIsRefreshing] = useState(false);

  const nextMilestone = useMemo(() => {
    const now = Date.now();
    return MILESTONES.find(m => new Date(m.targetIso).getTime() > now) || MILESTONES[MILESTONES.length - 1];
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(nextMilestone.targetIso));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(nextMilestone.targetIso));
    }, 1000);
    return () => clearInterval(timer);
  }, [nextMilestone.targetIso]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (pullFromGoogleSheet) await pullFromGoogleSheet();
    } catch (err) {
      console.warn('Gagal menyegarkan data:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // --- Ringkasan Metrik Lintas Tahap ---
  const metrics = useMemo(() => {
    const quotaSD = Number(settings?.quotaSD) || 18;
    const quotaSMP = Number(settings?.quotaSMP) || 18;
    const totalQuota = quotaSD + quotaSMP;

    const activeTeams = teams.filter(t => t && t.status !== 'rejected');
    const countSD = activeTeams.filter(t => t.jenjang === 'SD').length;
    const countSMP = activeTeams.filter(t => t.jenjang === 'SMP').length;
    const totalFilled = activeTeams.length;

    const stage1Pending = activeTeams.filter(t => t.status === 'pending').length;
    const stage2Pending = activeTeams.filter(t => ['registered', 'revision'].includes(t.status)).length;
    const verifiedCount = activeTeams.filter(t => ['verified', 'drawn'].includes(t.status)).length;
    const drawnCount = activeTeams.filter(t => Boolean(t.lotNumber)).length;
    const plottedBasecampCount = activeTeams.filter(t => Boolean(t.basecampNumber)).length;

    // Alur lapangan Hari-H
    let checkedInCount = 0;
    let dpCount = 0;
    let arenaCount = 0;
    let scoredCount = 0;
    let lockedScoreCount = 0;

    activeTeams.forEach(t => {
      const st = staging?.[t.id];
      const stage = st?.stage || st?.status || '';
      if (st?.checkInTime || ['checked_in', 'dp1', 'dp2', 'arena', 'finished', 'checked_out'].includes(stage)) {
        checkedInCount += 1;
      }
      if (['dp1', 'dp2'].includes(stage)) {
        dpCount += 1;
      }
      if (stage === 'arena') {
        arenaCount += 1;
      }

      const sc = scores?.[t.id];
      const hasScore = Boolean(
        sc && (
          sc.isFinalized ||
          sc.locked ||
          Number(sc.totalScore) > 0 ||
          Number(sc.peletonFinalScore) > 0 ||
          (sc.judges && Object.keys(sc.judges).length > 0)
        )
      );
      if (hasScore) scoredCount += 1;
      if (sc?.isFinalized || sc?.locked) lockedScoreCount += 1;
    });

    return {
      quotaSD,
      quotaSMP,
      totalQuota,
      countSD,
      countSMP,
      totalFilled,
      stage1Pending,
      stage2Pending,
      verifiedCount,
      drawnCount,
      undrawnCount: Math.max(0, totalFilled - drawnCount),
      plottedBasecampCount,
      unplottedBasecampCount: Math.max(0, totalFilled - plottedBasecampCount),
      checkedInCount,
      dpCount,
      arenaCount,
      scoredCount,
      lockedScoreCount,
    };
  }, [teams, scores, staging, settings]);

  const canAccess = (stage) => {
    if (!canAccessStage) return true;
    return canAccessStage(stage, userRole);
  };

  // --- Fokus Tindakan Kontekstual (maks. 4 item) ---
  const actionItems = useMemo(() => {
    const items = [];

    if (metrics.stage1Pending > 0 && canAccess('pendaftaran')) {
      items.push({
        id: 'acc_daftar',
        title: `${metrics.stage1Pending} peleton menunggu ACC berkas awal`,
        actionLabel: 'Periksa',
        tone: 'amber',
        onClick: () => {
          if (setAdminActiveTab) setAdminActiveTab('registration');
          navigateToStage ? navigateToStage('pendaftaran') : setActiveView('admin');
        },
      });
    }

    if (metrics.stage2Pending > 0 && canAccess('pendaftaran')) {
      items.push({
        id: 'acc_roster',
        title: `${metrics.stage2Pending} peleton menunggu verifikasi roster & rekomendasi`,
        actionLabel: 'Verifikasi',
        tone: 'amber',
        onClick: () => {
          if (setAdminActiveTab) setAdminActiveTab('verification');
          navigateToStage ? navigateToStage('pendaftaran') : setActiveView('admin');
        },
      });
    }

    if (metrics.undrawnCount > 0 && canAccess('tm')) {
      items.push({
        id: 'undian_tm',
        title: `${metrics.undrawnCount} peleton belum mendapat nomor undian TM`,
        actionLabel: 'Buka TM',
        tone: 'blue',
        onClick: () => (navigateToStage ? navigateToStage('tm') : setActiveView('tm')),
      });
    }

    if (metrics.unplottedBasecampCount > 0 && canAccess('checkin')) {
      items.push({
        id: 'plot_basecamp',
        title: `${metrics.unplottedBasecampCount} peleton belum diplot ke ruang basecamp`,
        actionLabel: 'Atur Ruang',
        tone: 'slate',
        onClick: () => (navigateToStage ? navigateToStage('checkin') : setActiveView('checkin')),
      });
    }

    if (!settings?.trialSchedulePublished && canAccess('uji_coba')) {
      items.push({
        id: 'ucl_draft',
        title: 'Jadwal Uji Coba Lapangan masih berstatus Draft',
        actionLabel: 'Cek UCL',
        tone: 'slate',
        onClick: () => (navigateToStage ? navigateToStage('uji_coba') : setActiveView('field_trial')),
      });
    }

    if (!settings?.announcementPublished && canAccess('klasemen')) {
      items.push({
        id: 'klasemen_preview',
        title: 'Papan Klasemen masih dalam mode Preview panitia',
        actionLabel: 'Lihat',
        tone: 'slate',
        onClick: () => (navigateToStage ? navigateToStage('klasemen') : setActiveView('live_leaderboard')),
      });
    }

    return items.slice(0, 4);
  }, [metrics, settings, userRole]);

  // --- Pintasan Cepat Modul ---
  const quickModules = useMemo(() => {
    const all = [
      { id: 'pendaftaran', label: 'Berkas Registrasi', sub: `${metrics.stage1Pending + metrics.stage2Pending} antrean`, icon: ClipboardList, stage: 'pendaftaran', color: 'text-blue-600 bg-blue-50' },
      { id: 'tm', label: 'Technical Meeting', sub: `${metrics.drawnCount}/${metrics.totalFilled} diundi`, icon: CalendarCheck, stage: 'tm', color: 'text-amber-600 bg-amber-50' },
      { id: 'uji_coba', label: 'Uji Coba Lapangan', sub: settings?.trialSchedulePublished ? 'Jadwal sah' : 'Draft', icon: Compass, stage: 'uji_coba', color: 'text-cyan-600 bg-cyan-50' },
      { id: 'checkin', label: 'Basecamp', sub: `${metrics.plottedBasecampCount}/${metrics.totalFilled} terplot`, icon: Building2, stage: 'checkin', color: 'text-emerald-600 bg-emerald-50' },
      { id: 'dp', label: 'Daerah Persiapan', sub: `${metrics.dpCount} antre DP`, icon: Clock, stage: 'dp', color: 'text-violet-600 bg-violet-50' },
      { id: 'penjurian', label: 'Penjurian Lapangan', sub: `${metrics.scoredCount}/${metrics.totalFilled} ternilai`, icon: Award, stage: 'penjurian', color: 'text-rose-600 bg-rose-50' },
      { id: 'rekap_nilai', label: 'Rekap Nilai', sub: `${metrics.lockedScoreCount} dikunci`, icon: FileSpreadsheet, stage: 'rekap_nilai', color: 'text-orange-600 bg-orange-50' },
      { id: 'klasemen', label: 'Klasemen', sub: settings?.announcementPublished ? 'Publik' : 'Preview', icon: Trophy, stage: 'klasemen', color: 'text-amber-600 bg-amber-50' },
    ].filter(m => canAccess(m.stage));

    if (userRole === 'superadmin') {
      all.push({
        id: 'superadmin',
        label: 'Master System',
        sub: 'Kontrol sistem',
        icon: Crown,
        view: 'superadmin',
        color: 'text-purple-600 bg-purple-50',
      });
    }

    return all;
  }, [metrics, settings, userRole]);

  const kpiCards = [
    {
      label: 'Kuota Peleton',
      val: String(metrics.totalFilled).padStart(2, '0'),
      max: String(metrics.totalQuota).padStart(2, '0'),
      pct: metrics.totalQuota > 0 ? Math.round((metrics.totalFilled / metrics.totalQuota) * 100) : 0,
      note: `SD ${metrics.countSD}/${metrics.quotaSD} · SMP ${metrics.countSMP}/${metrics.quotaSMP}`,
      barColor: metrics.totalFilled >= metrics.totalQuota ? 'bg-emerald-400' : 'bg-rose-500',
      dotColor: metrics.totalFilled >= metrics.totalQuota ? 'bg-emerald-400' : 'bg-rose-500',
    },
    {
      label: 'Verifikasi Sah',
      val: String(metrics.verifiedCount).padStart(2, '0'),
      max: String(metrics.totalFilled || metrics.totalQuota).padStart(2, '0'),
      pct: metrics.totalFilled > 0 ? Math.round((metrics.verifiedCount / metrics.totalFilled) * 100) : 0,
      note: `${metrics.stage1Pending} daftar · ${metrics.stage2Pending} roster`,
      barColor: 'bg-amber-400',
      dotColor: metrics.stage1Pending + metrics.stage2Pending > 0 ? 'bg-amber-400' : 'bg-emerald-400',
    },
    {
      label: 'Undian & Basecamp',
      val: String(metrics.drawnCount).padStart(2, '0'),
      max: String(metrics.totalFilled || metrics.totalQuota).padStart(2, '0'),
      pct: metrics.totalFilled > 0 ? Math.round((metrics.drawnCount / metrics.totalFilled) * 100) : 0,
      note: `${metrics.plottedBasecampCount} ruang basecamp`,
      barColor: 'bg-sky-400',
      dotColor: 'bg-sky-400',
    },
    {
      label: 'Progres Penilaian',
      val: String(metrics.scoredCount).padStart(2, '0'),
      max: String(metrics.totalFilled || metrics.totalQuota).padStart(2, '0'),
      pct: metrics.totalFilled > 0 ? Math.round((metrics.scoredCount / metrics.totalFilled) * 100) : 0,
      note: metrics.lockedScoreCount > 0 ? `${metrics.lockedScoreCount} skor dikunci` : 'Menunggu hari-H',
      barColor: 'bg-emerald-400',
      dotColor: metrics.scoredCount > 0 ? 'bg-emerald-400' : 'bg-slate-500',
    },
  ];

  const isQuotaFull = metrics.totalFilled >= metrics.totalQuota;

  return (
    <SimpaskorSidebarLayout
      activeMenu="staff_home"
      title="Beranda Panitia"
      subtitle="Ringkasan status pendaftaran, persiapan, dan operasional lapangan LBB Mu'allimin 2027"
      hideHeader={true}
    >
      <div className="space-y-4 sm:space-y-5">
        {/* 1. BANNER AGENDA TERDEKAT & STATUS SISTEM */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-950 via-[#0d1323] to-slate-950 px-4 py-4 sm:px-6 sm:py-5 text-white shadow-[0_14px_34px_rgba(2,6,23,0.16)] ring-1 ring-inset ring-white/[0.05]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="pointer-events-none absolute -top-12 -left-10 h-32 w-48 rounded-full bg-amber-500/12 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 -right-8 h-32 w-56 rounded-full bg-rose-600/12 blur-2xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-gradient-to-br from-amber-400/20 to-amber-500/5 text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <Timer className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                    {nextMilestone.label}
                  </h1>
                  <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-300">
                    {nextMilestone.tag}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-slate-400 tabular-nums">
                  {nextMilestone.dateText}
                </p>

                {/* Status Ringkas Sistem */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[10.5px]">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                    isQuotaFull ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.07] text-slate-300'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isQuotaFull ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    Pendaftaran {isQuotaFull ? 'Penuh' : 'Buka'}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                    settings?.trialSchedulePublished ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.07] text-slate-300'
                  }`}>
                    UCL {settings?.trialSchedulePublished ? 'Sah' : 'Draft'}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                    settings?.announcementPublished ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.07] text-slate-300'
                  }`}>
                    Klasemen {settings?.announcementPublished ? 'Publik' : 'Preview'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-2 flex-1 sm:flex-none">
                {[
                  { label: 'Hari', val: timeLeft.days, accent: true },
                  { label: 'Jam', val: timeLeft.hours, accent: false },
                  { label: 'Menit', val: timeLeft.minutes, accent: false },
                  { label: 'Detik', val: timeLeft.seconds, accent: false },
                ].map(unit => (
                  <div
                    key={unit.label}
                    className={`flex sm:min-w-[60px] flex-col items-center justify-center rounded-xl border py-2 px-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                      unit.accent
                        ? 'border-amber-400/25 bg-gradient-to-b from-amber-400/15 to-slate-900/90'
                        : 'border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-slate-900/90'
                    }`}
                  >
                    <span className={`font-mono text-base sm:text-xl font-black leading-none tabular-nums ${
                      unit.accent ? 'text-amber-300' : 'text-white'
                    }`}>
                      {String(unit.val).padStart(2, '0')}
                    </span>
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Segarkan Data"
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* 2. RINGKASAN 4 ANGKA LINTAS TAHAP */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl bg-slate-800 p-px shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          {kpiCards.map(m => (
            <div key={m.label} className="bg-slate-950 px-3.5 sm:px-4 py-3.5 text-white flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-baseline min-w-0">
                    <p className="text-lg sm:text-2xl font-black tracking-tight font-mono truncate">{m.val}</p>
                    <span className="text-[11px] font-mono font-bold text-slate-500 ml-1 shrink-0">/{m.max}</span>
                  </div>
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${m.dotColor}`} />
                </div>
                <p className="mt-1 text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 truncate">
                  {m.label}
                </p>
              </div>
              <div className="mt-2.5">
                <div className="w-full bg-slate-800/90 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${m.barColor}`}
                    style={{ width: `${Math.min(100, Math.max(0, m.pct))}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[9px] sm:text-[10px] gap-1">
                  <span className="text-slate-300 font-medium truncate">{m.note}</span>
                  <span className="text-slate-400 font-mono font-bold shrink-0">{m.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 3. FOKUS TINDAKAN & ALUR LAPANGAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Kiri: Fokus Tindakan Saat Ini */}
          <section className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Fokus Tindakan
              </h2>
              {actionItems.length > 0 && (
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {actionItems.length} item
                </span>
              )}
            </div>

            {actionItems.length === 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3.5 py-3 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Semua tahapan saat ini sudah beres.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {actionItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className="w-full py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertCircle className={`w-4 h-4 shrink-0 ${
                        item.tone === 'amber'
                          ? 'text-amber-500'
                          : item.tone === 'blue'
                            ? 'text-blue-500'
                            : 'text-slate-400'
                      }`} />
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-700 group-hover:text-slate-950 leading-snug">
                        {item.title}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-slate-500 group-hover:text-red-700 shrink-0 transition-colors">
                      <span>{item.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Kanan: Ringkasan Alur Lapangan Hari-H */}
          <section className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Alur Lapangan Hari-H
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Live</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Check-In', val: metrics.checkedInCount, accent: 'text-emerald-700 bg-emerald-50 border-emerald-200/70' },
                { label: 'DP 1–2', val: metrics.dpCount, accent: 'text-violet-700 bg-violet-50 border-violet-200/70' },
                { label: 'Arena', val: metrics.arenaCount, accent: 'text-rose-700 bg-rose-50 border-rose-200/70' },
                { label: 'Ternilai', val: metrics.scoredCount, accent: 'text-amber-700 bg-amber-50 border-amber-200/70' },
              ].map(step => (
                <div
                  key={step.label}
                  className={`rounded-xl border px-2 py-2.5 text-center ${step.accent}`}
                >
                  <p className="font-mono text-lg sm:text-xl font-black leading-none tabular-nums">
                    {step.val}
                  </p>
                  <p className="mt-1 text-[10px] font-bold leading-tight truncate">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Pembaruan otomatis dari pos Check-In, Daerah Persiapan, dan Dewan Juri.
            </p>
          </section>
        </div>

        {/* 4. PINTASAN CEPAT MODUL */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
            Akses Cepat Modul
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {quickModules.map(mod => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    if (mod.stage && navigateToStage) navigateToStage(mod.stage);
                    else if (mod.view) setActiveView(mod.view);
                  }}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs p-3 text-left transition-all cursor-pointer active:scale-[0.98] min-w-0"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${mod.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                      {mod.label}
                    </p>
                    <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                      {mod.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </SimpaskorSidebarLayout>
  );
}
