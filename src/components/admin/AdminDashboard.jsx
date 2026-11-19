import React, { useState, useMemo } from 'react';
import {
  Shield,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Shuffle,
  Trophy,
  Lock,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import TeamInspectionPage from './components/TeamInspectionPage.jsx';
import RegistrationTab from './tabs/RegistrationTab.jsx';
import VerificationTab from './tabs/VerificationTab.jsx';

export default function AdminDashboard() {
  const {
    teams,
    verifyTeam,
    deleteTeam,
    exportTeamsCSV,
    setActiveView,
    pullFromGoogleSheet,
    adminActiveTab,
    setAdminActiveTab,
    currentUser,
    role,
    settings,
    openAuthModal,
    isLocalhost
  } = useCompetition();

  const userRole = currentUser?.role || role;
  if (!['admin', 'superadmin'].includes(userRole)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Akses Ditolak
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              Dashboard Sekretariat Terkunci
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini diperuntukkan khusus bagi Panitia Sekretariat & Administrasi (Admin) atau Superadmin.
            </p>
          </div>
          <div className="space-y-2.5 pt-2 w-full">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('lbb_muallimin_active_view_v1', 'landing');
                } catch {}
                setActiveView('landing');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Kembali ke Beranda
            </button>
            <button
              type="button"
              onClick={() => {
                if (openAuthModal) openAuthModal();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-blue-950/40"
            >
              Masuk Akun Sekretariat (Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefreshData() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (pullFromGoogleSheet) {
        await pullFromGoogleSheet();
      }
    } catch (err) {
      console.warn('Gagal memuat ulang data dari spreadsheet:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }

  // 4 Tahapan: 
  // 1. 'registration' (Cek Berkas Pendaftaran & ACC Daftar)
  // 2. 'verification' (Cek Biodata Peleton, Surat Rekomendasi & ACC Sah)
  // 3. 'lottery' (Pengundian Nomor Tampil TM)
  // 4. 'recap' (Rekapitulasi Nilai & Kejuaraan LBB)
  const activeTab = adminActiveTab || 'registration';
  const setActiveTab = setAdminActiveTab || (() => {});
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // 'ALL' | 'pending' | 'verified' | 'revision' | etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Inspector Modal state
  const [inspectingTeam, setInspectingTeam] = useState(null);
  const [inspectingStage, setInspectingStage] = useState('registration'); // 'registration' | 'verification'
  const [, setRevisionNoteInput] = useState('');
  const [, setShowRevisionBox] = useState(false);

  // Lot assignment state
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');

  // Filtered teams with strict pipeline gate per stage tab (Paling atas adalah yang paling terbaru / Newest First)
  const filteredTeams = useMemo(() => {
    // Helper index asli untuk tim tanpa timestamp (urutan pendaftaran)
    const teamIndexMap = new Map();
    teams.forEach((t, idx) => teamIndexMap.set(t.id, idx));

    const getTeamTimestamp = (t) => {
      const raw = t.registeredAt || t.createdAt || t.registrationDate || t.timestamp || t.updatedAt;
      if (raw) {
        const time = new Date(raw).getTime();
        if (!isNaN(time) && time > 0) return time;
      }
      if (typeof t.id === 'string') {
        const m = t.id.match(/\d+/g);
        if (m && m.length > 0) {
          const num = Number(m[m.length - 1]);
          if (!isNaN(num)) return num;
        }
      }
      return teamIndexMap.get(t.id) ?? 0;
    };

    return teams
      .filter(team => {
        // 1. Stage Gating: peleton hanya boleh masuk tahap selanjutnya setelah lolos tahap sebelumnya
        if (activeTab === 'registration') {
          // Tahap 1 hanya untuk pendaftaran awal: pending (baru), registered (sudah di-ACC), atau revision
          if (!['pending', 'registered', 'revision'].includes(team.status)) {
            return false;
          }
        } else if (activeTab === 'verification') {
          // Tahap 2: HANYA peleton yang sudah LOLOS Tahap 1 (status: registered, revision, verified, drawn)
          // Peleton dengan status 'pending' (belum di-ACC berkas/pembayarannya) TIDAK BOLEH masuk ke tahap verifikasi ini!
          if (!['registered', 'revision', 'verified', 'drawn'].includes(team.status)) {
            return false;
          }
        } else if (activeTab === 'lottery') {
          // Tahap 3: HANYA peleton yang sudah SAH terverifikasi (khusus localhost: bypass kelengkapan)
          if (!isLocalhost && !['verified', 'drawn'].includes(team.status)) {
            return false;
          }
        }

        const matchesJenjang = selectedJenjang === 'ALL' || team.jenjang === selectedJenjang;
        const matchesStatus =
          selectedStatus === 'ALL' ||
          team.status === selectedStatus ||
          (selectedStatus === 'pending_verification' && (team.status === 'registered' || team.status === 'pending_verification'));
        const matchesSearch =
          team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (team.officialName || team.coachName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (team.platoonName && team.platoonName.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesJenjang && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        // 1. Prioritaskan jika ada status 'pending' yang butuh tindakan segera
        const aPending = a.status === 'pending';
        const bPending = b.status === 'pending';
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;

        // 2. Urutkan berdasarkan waktu pendaftaran terbaru di paling atas (Newest First)
        const timeA = getTeamTimestamp(a);
        const timeB = getTeamTimestamp(b);
        if (timeA !== timeB) return timeB - timeA;

        // 3. Fallback jika waktu sama: urutan pendaftaran terbalik (item terakhir di atas)
        const idxA = teamIndexMap.get(a.id) ?? 0;
        const idxB = teamIndexMap.get(b.id) ?? 0;
        if (idxA !== idxB) return idxB - idxA;

        return (b.id || '').localeCompare(a.id || '');
      });
  }, [teams, activeTab, selectedJenjang, selectedStatus, searchQuery]);

  // Statistics
  const targetQuotaSD = settings?.quotaSD || 18;
  const targetQuotaSMP = settings?.quotaSMP || 18;
  const countSD = teams.filter(t => t.jenjang === 'SD' && t.status !== 'rejected').length;
  const countSMP = teams.filter(t => t.jenjang === 'SMP' && t.status !== 'rejected').length;
  const totalRevenue = teams
    .filter(t => ['registered', 'verified', 'drawn'].includes(t.status) || t.paymentStatus === 'paid')
    .reduce((sum, t) => sum + (t.feeAmount || 350000), 0);

  // Detailed stats for 4 stages:
  const stage1PendingCount = teams.filter(t => t.status === 'pending').length; // Butuh dicek pendaftarannya
  const stage1AccCount = teams.filter(t => ['registered', 'revision', 'verified', 'drawn'].includes(t.status)).length;
  const stage2PendingCount = teams.filter(t => t.status === 'registered' || t.status === 'revision').length; // Butuh dicek peleton & rekomendasi
  const stage2VerifiedCount = teams.filter(t => ['verified', 'drawn'].includes(t.status)).length;

  function handleQuickVerify(teamId, status, note = '') {
    verifyTeam(teamId, status, note);
    if (inspectingTeam && inspectingTeam.id === teamId) {
      setInspectingTeam(prev => ({ ...prev, status, revisionNote: note }));
    }
  }

  if (inspectingTeam) {
    const liveTeam = teams.find(t => t.id === inspectingTeam.id) || inspectingTeam;
    return (
      <SimpaskorSidebarLayout activeMenu="pendaftaran" setActiveView={setActiveView} hideHeader={true}>
        <TeamInspectionPage
          team={liveTeam}
          teamsList={filteredTeams}
          onSelectTeam={(t) => setInspectingTeam(t)}
          inspectionStage={inspectingStage}
          onBack={() => setInspectingTeam(null)}
          onVerify={handleQuickVerify}
          deleteTeam={deleteTeam}
        />
      </SimpaskorSidebarLayout>
    );
  }

  const currentActiveMenu = 'pendaftaran';

  const totalQuota = targetQuotaSD + targetQuotaSMP;
  const totalFilled = countSD + countSMP;
  const quotaPercent = totalQuota > 0 ? Math.min(100, Math.round((totalFilled / totalQuota) * 100)) : 0;
  const totalPending = stage1PendingCount + stage2PendingCount;

  const sdPct = targetQuotaSD > 0 ? Math.min(100, Math.round((countSD / targetQuotaSD) * 100)) : 0;
  const smpPct = targetQuotaSMP > 0 ? Math.min(100, Math.round((countSMP / targetQuotaSMP) * 100)) : 0;
  const verifiedTotalPct = totalFilled > 0 ? Math.min(100, Math.round((stage2VerifiedCount / totalFilled) * 100)) : 0;

  const summaryMetrics = [
    {
      label: 'Kuota SD / MI',
      val: String(countSD).padStart(2, '0'),
      max: String(targetQuotaSD).padStart(2, '0'),
      pct: sdPct,
      note: countSD >= targetQuotaSD ? 'Kuota Penuh' : `${targetQuotaSD - countSD} Slot Tersisa`,
      statusColor: countSD >= targetQuotaSD ? 'text-emerald-400' : countSD > 0 ? 'text-amber-400' : 'text-slate-400',
      dotColor: countSD >= targetQuotaSD ? 'bg-emerald-400' : 'bg-rose-500',
      barColor: countSD >= targetQuotaSD ? 'bg-emerald-400' : 'bg-rose-500',
    },
    {
      label: 'Kuota SMP / MTs',
      val: String(countSMP).padStart(2, '0'),
      max: String(targetQuotaSMP).padStart(2, '0'),
      pct: smpPct,
      note: countSMP >= targetQuotaSMP ? 'Kuota Penuh' : `${targetQuotaSMP - countSMP} Slot Tersisa`,
      statusColor: countSMP >= targetQuotaSMP ? 'text-emerald-400' : countSMP > 0 ? 'text-blue-400' : 'text-slate-400',
      dotColor: countSMP >= targetQuotaSMP ? 'bg-emerald-400' : 'bg-blue-500',
      barColor: countSMP >= targetQuotaSMP ? 'bg-emerald-400' : 'bg-blue-500',
    },
    {
      label: 'Antrean Verifikasi',
      val: String(totalPending).padStart(2, '0'),
      max: String(totalFilled || totalQuota).padStart(2, '0'),
      pct: verifiedTotalPct,
      note: totalPending > 0 ? `${stage1PendingCount} Daftar · ${stage2PendingCount} Roster` : 'Semua Terverifikasi',
      statusColor: totalPending > 0 ? 'text-amber-400' : 'text-emerald-400',
      dotColor: totalPending > 0 ? 'bg-amber-400' : 'bg-emerald-400',
      barColor: totalPending > 0 ? 'bg-amber-400' : 'bg-emerald-400',
    },
    {
      label: 'Penerimaan Dana',
      val: `Rp${(totalRevenue / 1000).toLocaleString('id-ID')}k`,
      max: null,
      pct: quotaPercent,
      note: `${stage1AccCount} Peleton Lunas`,
      statusColor: stage1AccCount > 0 ? 'text-emerald-400' : 'text-slate-400',
      dotColor: stage1AccCount > 0 ? 'bg-emerald-400' : 'bg-slate-500',
      barColor: 'bg-emerald-400',
    },
  ];

  return (
    <SimpaskorSidebarLayout
      activeMenu={currentActiveMenu}
      title="Sekretariat & Rekapitulasi"
      subtitle="Manajemen pendaftaran, verifikasi berkas, kuota peleton & undian nomor tampil"
      hideHeader={true}
    >
      <section className="rounded-2xl sm:rounded-[26px] border border-slate-200/80 bg-white p-4 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-5 sm:space-y-6">
          {/* 1. Panel Header (Dark Squircle Icon + Title + Segmented Sub-Tab Switcher) */}
          <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                {activeTab === 'registration' ? (
                  <FileText className="w-5 h-5 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-950 uppercase leading-snug">
                    Sekretariat &amp; Verifikasi Peleton
                  </h1>
                  {totalPending > 0 ? (
                    <span className="text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md shrink-0">
                      {totalPending} Perlu Tindakan
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      Antrean Bersih
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                  {activeTab === 'registration'
                    ? 'Tahap 1: Pemeriksaan bukti transfer BSI, kartu pelajar danton, logo sekolah, dan pakta integritas.'
                    : 'Tahap 2: Pemeriksaan kelengkapan 25 personel peleton (1 danton, 21 inti, 3 cadangan) & surat rekomendasi.'}
                </p>
              </div>
            </div>

            {/* Sisi Kanan: Segmented Sub-Tab Switcher (Gaya DocumentsTab) + Aksi */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <div className="grid grid-cols-2 sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('registration');
                    setSelectedStatus('ALL');
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'registration'
                      ? 'bg-white text-slate-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>Berkas Awal</span>
                  {stage1PendingCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300/80">
                      {stage1PendingCount} Belum
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('verification');
                    setSelectedStatus('ALL');
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'verification'
                      ? 'bg-white text-slate-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Roster &amp; Rekom</span>
                  {stage2PendingCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300/80">
                      {stage2PendingCount} Belum
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                  title="Segarkan Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={exportTeamsCSV}
                  className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 whitespace-nowrap"
                  title="Ekspor Data Rekap Tim ke format CSV / Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                  <span>Ekspor CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. 4-Item Dark Divided Summary Metric Strip (Identik dengan RosterTab di Portal Peserta) */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-slate-800 p-px shadow-[0_14px_32px_rgba(15,23,42,0.12)] sm:grid-cols-4">
            {summaryMetrics.map(m => (
              <div key={m.label} className="bg-slate-950 px-4 py-3.5 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-baseline">
                      <p className="text-xl sm:text-2xl font-black tracking-tight font-mono">{m.val}</p>
                      {m.max && (
                        <span className="text-[11px] font-mono font-bold text-slate-500 ml-1">/{m.max}</span>
                      )}
                    </div>
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${m.dotColor}`} />
                  </div>
                  <p className="mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
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
                  <div className="mt-1.5 flex items-center justify-between text-[8px] sm:text-[9px]">
                    <span className={`font-semibold transition-colors truncate mr-1 ${m.statusColor}`}>{m.note}</span>
                    <span className="text-slate-400 font-mono text-[8px] font-bold shrink-0">{m.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Sub-Container Tabel & Daftar Verifikasi */}
          {activeTab === 'registration' ? (
            <RegistrationTab
              filteredTeams={filteredTeams}
              stage1PendingCount={stage1PendingCount}
              stage1AccCount={stage1AccCount}
              isRefreshing={isRefreshing}
              handleRefreshData={handleRefreshData}
              selectedJenjang={selectedJenjang}
              setSelectedJenjang={setSelectedJenjang}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setInspectingTeam={setInspectingTeam}
              setInspectingStage={setInspectingStage}
              setRevisionNoteInput={setRevisionNoteInput}
              setShowRevisionBox={setShowRevisionBox}
              handleQuickVerify={handleQuickVerify}
              deleteTeam={deleteTeam}
            />
          ) : (
            <VerificationTab
              filteredTeams={filteredTeams}
              stage2PendingCount={stage2PendingCount}
              stage2VerifiedCount={stage2VerifiedCount}
              isRefreshing={isRefreshing}
              handleRefreshData={handleRefreshData}
              selectedJenjang={selectedJenjang}
              setSelectedJenjang={setSelectedJenjang}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setInspectingTeam={setInspectingTeam}
              setInspectingStage={setInspectingStage}
              setRevisionNoteInput={setRevisionNoteInput}
              setShowRevisionBox={setShowRevisionBox}
              handleQuickVerify={handleQuickVerify}
            />
          )}
        </section>
    </SimpaskorSidebarLayout>
  );
}
