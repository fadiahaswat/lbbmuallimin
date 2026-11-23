import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw,
  ClipboardList,
  CalendarCheck,
  ShieldCheck,
  Trophy,
  Search,
  ArrowUpRight,
  Building2,
  Download,
  CheckCircle2,
  Sparkles,
  FileCheck2,
  Radio,
  ChevronRight
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { formatImageUrl } from '../../services/sheetService.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

const MILESTONES = [
  {
    id: 'deadline_berkas',
    label: 'Batas Berkas & Roster',
    short: 'Batas Berkas',
    dateShort: '08 Jan 2027',
    targetIso: '2027-01-08T23:59:59+07:00',
    totalWindowDays: 75,
  },
  {
    id: 'tm',
    label: 'Technical Meeting',
    short: 'TM Peserta',
    dateShort: '09 Jan 2027',
    targetIso: '2027-01-09T12:30:00+07:00',
    totalWindowDays: 76,
  },
  {
    id: 'ucl',
    label: 'Uji Coba Lapangan',
    short: 'Uji Coba (UCL)',
    dateShort: '16 Jan 2027',
    targetIso: '2027-01-16T07:00:00+07:00',
    totalWindowDays: 83,
  },
  {
    id: 'hari_h',
    label: 'Hari-H LBB Mu’allimin 2027',
    short: 'Hari-H LBB',
    dateShort: '24 Jan 2027',
    targetIso: '2027-01-24T06:00:00+07:00',
    totalWindowDays: 91,
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

function formatCompactRp(amount) {
  if (amount >= 1_000_000) {
    return `Rp${(amount / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}jt`;
  }
  if (amount >= 1_000) {
    return `Rp${Math.round(amount / 1_000).toLocaleString('id-ID')}rb`;
  }
  return `Rp${amount.toLocaleString('id-ID')}`;
}

function hasValidFile(fileObj, legacyUrl) {
  const url = fileObj?.url || legacyUrl || '';
  return Boolean(url && url !== '#' && String(url).trim().length > 4);
}

function getTeamDocScore(team) {
  const f = team?.files || {};
  const checks = [
    hasValidFile(f.paymentProof, team?.file_bukti_bayar),
    hasValidFile(f.dantonIdCard, team?.file_kartu_danton),
    hasValidFile(f.schoolLogo, team?.file_logo_sekolah),
    hasValidFile(f.integrityPact, team?.file_pakta_integritas),
  ];
  return {
    done: checks.filter(Boolean).length,
    total: 4,
    checks,
  };
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
    exportTeamsCSV,
  } = useCompetition();

  const userRole = currentUser?.role || role || 'admin';
  const firstName = (currentUser?.name || 'Panitia').split(' ')[0];

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [jenjangFilter, setJenjangFilter] = useState('ALL'); // ALL | SD | SMP
  const [chartTab, setChartTab] = useState('tahapan'); // tahapan | berkas
  const [hoveredBarIdx, setHoveredBarIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const defaultMilestoneIndex = useMemo(() => {
    const now = Date.now();
    const idx = MILESTONES.findIndex(m => new Date(m.targetIso).getTime() > now);
    return idx === -1 ? MILESTONES.length - 1 : idx;
  }, []);

  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState(defaultMilestoneIndex);
  const activeMilestone = MILESTONES[selectedMilestoneIdx] || MILESTONES[0];
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(activeMilestone.targetIso));

  useEffect(() => {
    setTimeLeft(computeTimeLeft(activeMilestone.targetIso));
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(activeMilestone.targetIso));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeMilestone.targetIso]);

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

  const canAccess = (stage) => {
    if (!canAccessStage) return true;
    return canAccessStage(stage, userRole);
  };

  const goStage = (stage, fallbackView) => {
    if (navigateToStage && stage) navigateToStage(stage);
    else if (fallbackView) setActiveView(fallbackView);
  };

  // --- Ringkasan Metrik Real (Responsif terhadap filter jenjang) ---
  const metrics = useMemo(() => {
    const quotaSD = Number(settings?.quotaSD) || 18;
    const quotaSMP = Number(settings?.quotaSMP) || 18;
    const totalQuotaAll = quotaSD + quotaSMP;
    const activeQuota = jenjangFilter === 'SD' ? quotaSD : jenjangFilter === 'SMP' ? quotaSMP : totalQuotaAll;

    const allActiveTeams = teams.filter(t => t && t.status !== 'rejected');
    const countSD = allActiveTeams.filter(t => t.jenjang === 'SD').length;
    const countSMP = allActiveTeams.filter(t => t.jenjang === 'SMP').length;

    const scopedTeams = jenjangFilter === 'ALL'
      ? allActiveTeams
      : allActiveTeams.filter(t => t.jenjang === jenjangFilter);

    const totalFilled = scopedTeams.length;
    const stage1Pending = scopedTeams.filter(t => t.status === 'pending').length;
    const stage2Pending = scopedTeams.filter(t => ['registered', 'revision'].includes(t.status)).length;
    const verifiedCount = scopedTeams.filter(t => ['verified', 'drawn'].includes(t.status)).length;
    const drawnCount = scopedTeams.filter(t => Boolean(t.lotNumber)).length;
    const plottedBasecampCount = scopedTeams.filter(t => Boolean(t.basecampNumber)).length;

    const paidTeams = scopedTeams.filter(t => t.status !== 'pending');
    const totalRevenue = paidTeams.reduce((acc, t) => {
      const fee = Number(String(t.feeAmount || '').replace(/\D/g, '')) || 400108;
      return acc + fee;
    }, 0);
    const targetRevenue = activeQuota * 400108;

    let checkedInCount = 0;
    let dpCount = 0;
    let arenaCount = 0;
    let scoredCount = 0;
    let lockedScoreCount = 0;

    let docTransfer = 0;
    let docDanton = 0;
    let docLogo = 0;
    let docPakta = 0;

    const scoredList = [];

    scopedTeams.forEach(t => {
      const st = staging?.[t.id];
      const stage = st?.stage || st?.status || '';
      if (st?.checkInTime || ['checked_in', 'dp1', 'dp2', 'arena', 'finished', 'checked_out'].includes(stage)) {
        checkedInCount += 1;
      }
      if (['dp1', 'dp2'].includes(stage)) dpCount += 1;
      if (stage === 'arena') arenaCount += 1;

      const docs = getTeamDocScore(t);
      if (docs.checks[0]) docTransfer += 1;
      if (docs.checks[1]) docDanton += 1;
      if (docs.checks[2]) docLogo += 1;
      if (docs.checks[3]) docPakta += 1;

      const sc = scores?.[t.id];
      const numericScore = Number(sc?.peletonFinalScore || sc?.totalScore || 0);
      const hasScore = Boolean(
        sc && (
          sc.isFinalized ||
          sc.locked ||
          numericScore > 0 ||
          (sc.judges && Object.keys(sc.judges).length > 0)
        )
      );
      if (hasScore) {
        scoredCount += 1;
        scoredList.push({
          id: t.id,
          schoolName: t.schoolName,
          jenjang: t.jenjang,
          score: numericScore,
          logoUrl: t.files?.schoolLogo?.url,
        });
      }
      if (sc?.isFinalized || sc?.locked) lockedScoreCount += 1;
    });

    scoredList.sort((a, b) => b.score - a.score);

    const pctOf = (n, denom) => (denom > 0 ? Math.min(100, Math.round((n / denom) * 100)) : 0);

    return {
      quotaSD,
      quotaSMP,
      activeQuota,
      countSD,
      countSMP,
      totalFilled,
      totalRevenue,
      targetRevenue,
      revenuePct: pctOf(totalRevenue, targetRevenue),
      paidCount: paidTeams.length,
      stage1Pending,
      stage2Pending,
      totalPending: stage1Pending + stage2Pending,
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
      topThree: scoredList.slice(0, 3),
      quotaPct: pctOf(totalFilled, activeQuota),
      sdPct: pctOf(countSD, quotaSD),
      smpPct: pctOf(countSMP, quotaSMP),
      verifiedPct: pctOf(verifiedCount, totalFilled),
      drawnPct: pctOf(drawnCount, totalFilled),
      basecampPct: pctOf(plottedBasecampCount, totalFilled),
      scoredPct: pctOf(scoredCount, totalFilled),
      docBars: [
        { label: 'Transfer', pct: pctOf(docTransfer, totalFilled), detail: `${docTransfer}/${totalFilled} tim` },
        { label: 'Kartu', pct: pctOf(docDanton, totalFilled), detail: `${docDanton}/${totalFilled} tim` },
        { label: 'Logo', pct: pctOf(docLogo, totalFilled), detail: `${docLogo}/${totalFilled} tim` },
        { label: 'Pakta', pct: pctOf(docPakta, totalFilled), detail: `${docPakta}/${totalFilled} tim` },
      ],
    };
  }, [teams, scores, staging, settings, jenjangFilter]);

  const tahapanBars = [
    { label: 'Kuota', pct: metrics.quotaPct, detail: `${metrics.totalFilled}/${metrics.activeQuota} tim`, highlight: true },
    { label: 'Sah', pct: metrics.verifiedPct, detail: `${metrics.verifiedCount}/${metrics.totalFilled} tim`, highlight: false },
    { label: 'Undi', pct: metrics.drawnPct, detail: `${metrics.drawnCount}/${metrics.totalFilled} tim`, highlight: false },
    { label: 'Barak', pct: metrics.basecampPct, detail: `${metrics.plottedBasecampCount}/${metrics.totalFilled} tim`, highlight: false },
    { label: 'Nilai', pct: metrics.scoredPct, detail: `${metrics.scoredCount}/${metrics.totalFilled} tim`, highlight: false },
  ];

  const activeBars = chartTab === 'tahapan' ? tahapanBars : metrics.docBars;
  const activeBar = activeBars[hoveredBarIdx] || activeBars[0];

  // --- Fokus Tindakan Kontekstual ---
  const actionItems = useMemo(() => {
    const items = [];
    if (metrics.stage1Pending > 0 && canAccess('pendaftaran')) {
      items.push({
        id: 'acc_daftar',
        label: 'ACC berkas pendaftaran awal',
        count: `${metrics.stage1Pending} tim`,
        dot: 'bg-amber-500',
        onClick: () => {
          if (setAdminActiveTab) setAdminActiveTab('registration');
          goStage('pendaftaran', 'admin');
        },
      });
    }
    if (metrics.stage2Pending > 0 && canAccess('pendaftaran')) {
      items.push({
        id: 'acc_roster',
        label: 'Verifikasi roster & rekomendasi',
        count: `${metrics.stage2Pending} tim`,
        dot: 'bg-rose-500',
        onClick: () => {
          if (setAdminActiveTab) setAdminActiveTab('verification');
          goStage('pendaftaran', 'admin');
        },
      });
    }
    if (metrics.undrawnCount > 0 && canAccess('tm')) {
      items.push({
        id: 'undian_tm',
        label: 'Undian nomor tampil TM',
        count: `${metrics.undrawnCount} belum`,
        dot: 'bg-blue-500',
        onClick: () => goStage('tm', 'tm'),
      });
    }
    if (metrics.unplottedBasecampCount > 0 && canAccess('checkin')) {
      items.push({
        id: 'plot_basecamp',
        label: 'Plot ruang basecamp',
        count: `${metrics.unplottedBasecampCount} belum`,
        dot: 'bg-emerald-500',
        onClick: () => goStage('checkin', 'checkin'),
      });
    }
    return items.slice(0, 4);
  }, [metrics, userRole]);

  // --- Tabel Pendaftar Terbaru (paling baru / terakhir di paling atas) ---
  const recentTeams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return teams
      .map((t, idx) => ({ team: t, origIdx: idx }))
      .filter(({ team: t }) => t && t.status !== 'rejected')
      .filter(({ team: t }) => (jenjangFilter === 'ALL' ? true : t.jenjang === jenjangFilter))
      .filter(({ team: t }) => {
        if (statusFilter === 'PENDING') return ['pending', 'registered', 'revision'].includes(t.status);
        if (statusFilter === 'SAH') return ['verified', 'drawn'].includes(t.status);
        return true;
      })
      .filter(({ team: t }) => {
        if (!q) return true;
        return (
          (t.schoolName || '').toLowerCase().includes(q) ||
          (t.regCode || '').toLowerCase().includes(q) ||
          (t.dantonName || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const tsA = new Date(a.team.registeredAt || a.team.createdAt || 0).getTime() || 0;
        const tsB = new Date(b.team.registeredAt || b.team.createdAt || 0).getTime() || 0;
        if (tsB !== tsA) return tsB - tsA;
        return b.origIdx - a.origIdx;
      })
      .map(({ team }) => team)
      .slice(0, 6);
  }, [teams, jenjangFilter, searchQuery, statusFilter]);

  // Semi-circle gauge SVG calculation
  const countdownProgress = Math.max(
    8,
    Math.min(100, Math.round(((activeMilestone.totalWindowDays - timeLeft.days) / activeMilestone.totalWindowDays) * 100))
  );
  const arcRadius = 92;
  const arcCircumference = Math.PI * arcRadius;
  const arcOffset = arcCircumference * (1 - countdownProgress / 100);

  return (
    <SimpaskorSidebarLayout
      activeMenu="staff_home"
      title="Beranda"
      subtitle="Ringkasan operasional LBB Mu'allimin 2027"
      hideHeader={true}
    >
      <div className="space-y-5">
        {/* 1. HEADER BAR + GLOBAL JENJANG FILTER (Finexy / Fingoals Style) */}
        <header className="flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 leading-tight">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau progres kuota, kelengkapan berkas, dan kesiapan operasional LBB Mu’allimin 2027.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Global Jenjang Filter Pill */}
            <div className="inline-flex items-center rounded-full bg-white p-1 shadow-[0_2px_10px_rgba(15,23,42,0.04)] border border-slate-100 text-xs font-semibold">
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'SD', label: 'SD / MI' },
                { id: 'SMP', label: 'SMP / MTs' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setJenjangFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    jenjangFilter === opt.id
                      ? 'bg-[#0d1421] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {exportTeamsCSV && (
              <button
                type="button"
                onClick={exportTeamsCSV}
                className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.04)] border border-slate-100 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Ekspor</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.04)] border border-slate-100 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
              <span>Segarkan</span>
            </button>
          </div>
        </header>

        {/* 2. ROW 1: 3-COLUMN HERO BENTO (Finexy + Fingoals Signature) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* COL 1 (4 cols): Penerimaan Dana & Kuota Wallet */}
          <div className="lg:col-span-4 rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">Penerimaan Dana</span>
                <span className="rounded-full bg-[#F6F7F9] px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  Target {formatCompactRp(metrics.targetRevenue)}
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
                <p
                  className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums"
                  title={`Rp${metrics.totalRevenue.toLocaleString('id-ID')}`}
                >
                  {formatCompactRp(metrics.totalRevenue)}
                </p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  {metrics.paidCount} lunas
                </span>
              </div>

              {/* Dual Pill CTA Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => canAccess('pendaftaran') && goStage('pendaftaran', 'admin')}
                  className="rounded-full bg-[#8B0000] hover:bg-[#6d0a0a] text-white py-2.5 px-3 text-xs font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(139,0,0,0.22)]"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Cek Berkas</span>
                </button>
                <button
                  type="button"
                  onClick={() => canAccess('tm') && goStage('tm', 'tm')}
                  className="rounded-full bg-[#0d1421] hover:bg-slate-800 text-white py-2.5 px-3 text-xs font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Undian TM</span>
                </button>
              </div>
            </div>

            {/* Nested Mini Quota Cards + Hatched Progress Bar */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setJenjangFilter(prev => (prev === 'SD' ? 'ALL' : 'SD'))}
                  className={`rounded-2xl p-3 text-left transition-all cursor-pointer border ${
                    jenjangFilter === 'SD'
                      ? 'bg-rose-50/70 border-rose-200'
                      : 'bg-[#F6F7F9] border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">SD / MI</span>
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-slate-900 tabular-nums leading-none">
                    {metrics.countSD}<span className="text-xs font-medium text-slate-400">/{metrics.quotaSD}</span>
                  </p>
                  <p className={`mt-1 text-[10.5px] font-semibold ${metrics.countSD >= metrics.quotaSD ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {metrics.countSD >= metrics.quotaSD ? 'Kuota Penuh' : `Sisa ${metrics.quotaSD - metrics.countSD} slot`}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setJenjangFilter(prev => (prev === 'SMP' ? 'ALL' : 'SMP'))}
                  className={`rounded-2xl p-3 text-left transition-all cursor-pointer border ${
                    jenjangFilter === 'SMP'
                      ? 'bg-blue-50/70 border-blue-200'
                      : 'bg-[#F6F7F9] border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">SMP / MTs</span>
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-slate-900 tabular-nums leading-none">
                    {metrics.countSMP}<span className="text-xs font-medium text-slate-400">/{metrics.quotaSMP}</span>
                  </p>
                  <p className={`mt-1 text-[10.5px] font-semibold ${metrics.countSMP >= metrics.quotaSMP ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {metrics.countSMP >= metrics.quotaSMP ? 'Kuota Penuh' : `Sisa ${metrics.quotaSMP - metrics.countSMP} slot`}
                  </p>
                </button>
              </div>

              <div className="space-y-1.5">
                <div
                  className="h-2.5 w-full rounded-full overflow-hidden"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #f1f5f9, #f1f5f9 5px, #e2e8f0 5px, #e2e8f0 10px)',
                  }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8B0000] via-[#b91c1c] to-[#dc2626] transition-all duration-500"
                    style={{ width: `${metrics.quotaPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    <strong className="text-slate-900 tabular-nums">{metrics.totalFilled}</strong> / {metrics.activeQuota} peleton terisi
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">{metrics.quotaPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2 (4 cols): 2x2 Metric Cluster */}
          <div className="lg:col-span-4 rounded-[24px] bg-white p-4 sm:p-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 grid grid-cols-2 gap-3">
            {/* Tile 1: Brand Crimson Hero Tile */}
            <button
              type="button"
              onClick={() => canAccess('pendaftaran') && goStage('pendaftaran', 'admin')}
              className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#8B0000] via-[#a30c0c] to-[#6d0a0a] p-4 text-left text-white flex flex-col justify-between shadow-[0_12px_28px_rgba(139,0,0,0.28)] hover:brightness-110 transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="pointer-events-none absolute -right-5 -bottom-5 h-20 w-20 rounded-full bg-[#FFD700]/10" />
              <div className="flex items-center justify-between gap-2 relative">
                <span className="text-xs font-medium text-white/90">Antrean Cek</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-[#FFD700]/30">
                  <ClipboardList className="w-4 h-4 text-[#FFD700]" />
                </span>
              </div>
              <div className="mt-4 relative">
                <p className="text-3xl font-bold tracking-tight tabular-nums leading-none">
                  {metrics.totalPending}
                </p>
                <p className="mt-2 inline-flex items-center rounded-full bg-black/20 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#fef08a]">
                  {metrics.stage1Pending} daftar · {metrics.stage2Pending} roster
                </p>
              </div>
            </button>

            {/* Tile 2: Verifikasi Sah */}
            <button
              type="button"
              onClick={() => {
                if (setAdminActiveTab) setAdminActiveTab('verification');
                canAccess('pendaftaran') && goStage('pendaftaran', 'admin');
              }}
              className="rounded-[20px] bg-[#F6F7F9] hover:bg-slate-100 p-4 text-left flex flex-col justify-between transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">Verifikasi Sah</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">
                  {metrics.verifiedCount}
                </p>
                <p className="mt-2 inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {metrics.verifiedPct}% dari total
                </p>
              </div>
            </button>

            {/* Tile 3: Basecamp */}
            <button
              type="button"
              onClick={() => canAccess('checkin') && goStage('checkin', 'checkin')}
              className="rounded-[20px] bg-[#F6F7F9] hover:bg-slate-100 p-4 text-left flex flex-col justify-between transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">Basecamp</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-2xs">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">
                  {metrics.plottedBasecampCount}
                </p>
                <p className="mt-2 inline-flex items-center rounded-full bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  {metrics.checkedInCount} check-in
                </p>
              </div>
            </button>

            {/* Tile 4: Skor Ternilai */}
            <button
              type="button"
              onClick={() => canAccess('rekap_nilai') && goStage('rekap_nilai', 'rekap_nilai')}
              className="rounded-[20px] bg-[#F6F7F9] hover:bg-slate-100 p-4 text-left flex flex-col justify-between transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">Ternilai</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-2xs">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">
                  {metrics.scoredCount}
                </p>
                <p className="mt-2 inline-flex items-center rounded-full bg-amber-100/80 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  {metrics.lockedScoreCount} terkunci
                </p>
              </div>
            </button>
          </div>

          {/* COL 3 (4 cols): Interactive Bar Chart with Toggle + Dark Pill Tooltip */}
          <div className="lg:col-span-4 rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {chartTab === 'tahapan' ? 'Progres Tahapan' : 'Kelengkapan Berkas'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeBar ? `${activeBar.label}: ${activeBar.detail} (${activeBar.pct}%)` : 'Capaian kesiapan peleton'}
                </p>
              </div>

              <div className="inline-flex items-center rounded-full bg-[#F6F7F9] p-0.5 text-[10.5px] font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setChartTab('tahapan');
                    setHoveredBarIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    chartTab === 'tahapan' ? 'bg-[#0d1421] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tahap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChartTab('berkas');
                    setHoveredBarIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    chartTab === 'berkas' ? 'bg-[#0d1421] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Berkas
                </button>
              </div>
            </div>

            {/* Vertical Rounded Bar Chart */}
            <div
              className={`mt-4 grid gap-2.5 items-end h-44 pt-4 ${
                activeBars.length === 4 ? 'grid-cols-4' : 'grid-cols-5'
              }`}
            >
              {activeBars.map((bar, idx) => {
                const isFocused = idx === hoveredBarIdx;
                const barHeight = Math.max(12, bar.pct);
                return (
                  <button
                    key={bar.label}
                    type="button"
                    onMouseEnter={() => setHoveredBarIdx(idx)}
                    onClick={() => setHoveredBarIdx(idx)}
                    className="flex flex-col items-center h-full justify-end gap-1.5 cursor-pointer group"
                  >
                    <span
                      className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-md transition-all ${
                        isFocused
                          ? 'bg-[#0d1421] text-[#FFD700] shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      {bar.pct}%
                    </span>
                    <div
                      className="w-full max-w-[40px] flex-1 rounded-xl overflow-hidden flex items-end p-0.5"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(-45deg, #f8fafc, #f8fafc 4px, #f1f5f9 4px, #f1f5f9 8px)',
                      }}
                    >
                      <div
                        className={`w-full rounded-[10px] transition-all duration-500 ${
                          isFocused
                            ? 'bg-gradient-to-t from-[#8B0000] to-[#dc2626]'
                            : 'bg-[#0d1421]/85 group-hover:bg-[#0d1421]'
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-medium truncate max-w-full ${isFocused ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                      {bar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. ROW 2: 3-COLUMN OPERATIONAL INSIGHTS (Target Gauge | Fokus Tindakan | Alur & Top 3) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* COL 1 (4 cols): Interactive Dark Target Countdown Gauge (Moneed Style) */}
          <div className="lg:col-span-4 rounded-[24px] bg-white p-3.5 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col justify-between gap-3">
            <div className="rounded-[20px] bg-[#0d1421] p-5 text-white relative overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {activeMilestone.label}
                </span>
                <span className="rounded-full bg-[#FFD700]/15 border border-[#FFD700]/25 px-2.5 py-0.5 text-[10px] font-semibold text-[#FFD700] shrink-0">
                  {activeMilestone.dateShort}
                </span>
              </div>

              <div className="mt-4 flex flex-col items-center">
                <div className="relative w-[216px] h-[118px] flex items-end justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 220 120">
                    <defs>
                      <linearGradient id="lbbArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B0000" />
                        <stop offset="55%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#FFD700" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 18 108 A 92 92 0 0 1 202 108"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 18 108 A 92 92 0 0 1 202 108"
                      fill="none"
                      stroke="url(#lbbArcGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={arcCircumference}
                      strokeDashoffset={arcOffset}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute bottom-1 text-center">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-4xl font-black tracking-tight text-white tabular-nums leading-none">
                        {timeLeft.days}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFD700]">
                        Hari
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 tabular-nums mt-1.5">
                      {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clickable Agenda Switcher */}
            <div className="grid grid-cols-2 gap-1.5 px-0.5">
              {MILESTONES.map((ms, idx) => {
                const isSelected = idx === selectedMilestoneIdx;
                return (
                  <button
                    key={ms.id}
                    type="button"
                    onClick={() => setSelectedMilestoneIdx(idx)}
                    className={`rounded-xl px-3 py-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0d1421] text-white shadow-2xs ring-1 ring-[#FFD700]/30'
                        : 'bg-[#F6F7F9] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-[11px] font-semibold truncate">{ms.short}</p>
                    <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-[#FFD700]' : 'text-slate-400'}`}>
                      {ms.dateShort}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COL 2 (4 cols): Fokus Tindakan & Status Publikasi */}
          <div className="lg:col-span-4 rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B0000]" />
                  <h2 className="text-base font-bold text-slate-900">Fokus Tindakan</h2>
                </div>
                {actionItems.length > 0 && (
                  <span className="rounded-full bg-[#fff1f2] border border-[#fecdd3] px-2.5 py-0.5 text-[11px] font-semibold text-[#8B0000]">
                    {actionItems.length} item
                  </span>
                )}
              </div>

              {actionItems.length === 0 ? (
                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-4 flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Semua tahapan saat ini sudah beres.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {actionItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className="w-full rounded-2xl bg-[#F6F7F9] hover:bg-slate-100 px-3.5 py-2.5 flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-semibold text-slate-600 shadow-2xs">
                          {item.count}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compact System Publication Status Strip */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => canAccess('uji_coba') && goStage('uji_coba', 'field_trial')}
                className="rounded-xl bg-[#F6F7F9] hover:bg-slate-100 px-3 py-2 flex items-center justify-between text-[11px] cursor-pointer transition-colors"
              >
                <span className="font-medium text-slate-500">Jadwal UCL</span>
                <span className={`font-bold ${settings?.trialSchedulePublished ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {settings?.trialSchedulePublished ? 'Sah' : 'Draft'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => canAccess('klasemen') && goStage('klasemen', 'live_leaderboard')}
                className="rounded-xl bg-[#F6F7F9] hover:bg-slate-100 px-3 py-2 flex items-center justify-between text-[11px] cursor-pointer transition-colors"
              >
                <span className="font-medium text-slate-500">Klasemen</span>
                <span className={`font-bold ${settings?.announcementPublished ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {settings?.announcementPublished ? 'Publik' : 'Preview'}
                </span>
              </button>
            </div>
          </div>

          {/* COL 3 (4 cols): Alur Hari-H + Top 3 Klasemen Sementara */}
          <div className="lg:col-span-4 rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col justify-between gap-4">
            {/* Live Field Pipeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-base font-bold text-slate-900">Alur Hari-H</h2>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Live</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Check-In', val: metrics.checkedInCount },
                  { label: 'DP 1–2', val: metrics.dpCount },
                  { label: 'Arena', val: metrics.arenaCount },
                  { label: 'Ternilai', val: metrics.scoredCount },
                ].map(step => (
                  <div key={step.label} className="rounded-2xl bg-[#F6F7F9] py-2.5 px-1.5 text-center">
                    <p className="text-lg font-bold text-slate-900 tabular-nums leading-none">
                      {step.val}
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-slate-500 truncate">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Klasemen Preview */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Top 3 Sementara</span>
                <button
                  type="button"
                  onClick={() => canAccess('klasemen') && goStage('klasemen', 'live_leaderboard')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Klasemen</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {metrics.topThree.length === 0 ? (
                <div className="rounded-2xl bg-[#F6F7F9] px-3.5 py-3 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Belum ada nilai juri masuk.</span>
                  <button
                    type="button"
                    onClick={() => canAccess('penjurian') && goStage('penjurian', 'juri')}
                    className="font-semibold text-slate-800 hover:text-red-600 cursor-pointer shrink-0 ml-2"
                  >
                    Buka Juri →
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {metrics.topThree.map((t, idx) => (
                    <div
                      key={t.id}
                      className="rounded-xl bg-[#F6F7F9] px-3 py-2 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          idx === 0 ? 'bg-[#FFD700] text-[#0d1421]' : 'bg-white text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">{t.schoolName}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0 tabular-nums">
                        {t.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. ROW 3: FULL-WIDTH RECENT TEAMS & DOCUMENT READINESS TABLE (Finexy / Moneed Style) */}
        <section className="rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] border border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F6F7F9] text-slate-700">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Pendaftar &amp; Kelengkapan Berkas</h2>
                <p className="text-xs text-slate-400">Menampilkan {recentTeams.length} peleton terbaru</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari sekolah atau kode..."
                  className="w-full rounded-full bg-[#F6F7F9] pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="inline-flex items-center rounded-full bg-[#F6F7F9] p-0.5 text-[11px] font-semibold">
                {[
                  { id: 'ALL', label: 'Semua' },
                  { id: 'PENDING', label: 'Antrean' },
                  { id: 'SAH', label: 'Sah' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-[#0d1421] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            {recentTeams.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Tidak ada peleton yang cocok dengan filter ini.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F7F9] text-[11px] font-semibold text-slate-500">
                    <th className="py-2.5 pl-3.5 pr-2 rounded-l-xl">Sekolah</th>
                    <th className="py-2.5 px-2 hidden sm:table-cell">Jenjang</th>
                    <th className="py-2.5 px-2 hidden md:table-cell">Berkas Awal</th>
                    <th className="py-2.5 px-2 hidden lg:table-cell">Slot / Basecamp</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 pl-2 pr-3.5 text-right rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentTeams.map(team => {
                    const isSah = ['verified', 'drawn'].includes(team.status);
                    const isPending = team.status === 'pending';
                    const logoUrl = team.files?.schoolLogo?.url;
                    const docScore = getTeamDocScore(team);

                    return (
                      <tr
                        key={team.id}
                        onClick={() => canAccess('pendaftaran') && goStage('pendaftaran', 'admin')}
                        className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="py-3 pl-3.5 pr-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {logoUrl && logoUrl !== '#' ? (
                              <img
                                src={formatImageUrl(logoUrl)}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-xl bg-white border border-slate-100 p-0.5 object-contain shrink-0"
                              />
                            ) : (
                              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                {team.jenjang}
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 leading-snug break-words">
                                {team.schoolName}
                              </p>
                              <p className="text-[10.5px] font-mono text-slate-400">
                                {team.regCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                            team.jenjang === 'SD' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {team.jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}
                          </span>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="flex items-center gap-1">
                              {docScore.checks.map((ok, i) => (
                                <span
                                  key={i}
                                  className={`h-2 w-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[11px] font-semibold text-slate-600">
                              {docScore.done}/{docScore.total}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell whitespace-nowrap font-mono text-[11px] text-slate-600">
                          {team.lotNumber ? `#${String(team.lotNumber).padStart(2, '0')}` : '—'}
                          <span className="text-slate-300 mx-1.5">·</span>
                          {team.basecampNumber ? `R.${team.basecampNumber}` : 'Belum plot'}
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              isSah ? 'bg-emerald-500' : isPending ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            {isSah ? 'Sah' : isPending ? 'Pending' : team.status === 'revision' ? 'Revisi' : 'Terdaftar'}
                          </span>
                        </td>
                        <td className="py-3 pl-2 pr-3.5 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F7F9] group-hover:bg-[#8B0000] group-hover:text-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors">
                            <span>Cek</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </SimpaskorSidebarLayout>
  );
}
