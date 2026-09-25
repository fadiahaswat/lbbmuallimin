import React, { useState } from 'react';
import {
  Shield,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Shuffle,
  Trophy
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import TeamInspectionPage from './components/TeamInspectionPage.jsx';
import RegistrationTab from './tabs/RegistrationTab.jsx';
import VerificationTab from './tabs/VerificationTab.jsx';
import LotteryTab from './tabs/LotteryTab.jsx';
import RecapTab from './tabs/RecapTab.jsx';

export default function AdminDashboard() {
  const {
    teams,
    scores,
    verifyTeam,
    updateTeamDraw,
    randomizeLotNumbers,
    deleteTeam,
    exportTeamsCSV,
    openModal,
    setActiveView,
    pullFromGoogleSheet,
    adminActiveTab,
    setAdminActiveTab
  } = useCompetition();

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

  // Filtered teams with strict pipeline gate per stage tab
  const filteredTeams = teams.filter(team => {
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
      // Tahap 3: HANYA peleton yang sudah SAH terverifikasi (verified atau drawn)
      if (!['verified', 'drawn'].includes(team.status)) {
        return false;
      }
    }

    const matchesJenjang = selectedJenjang === 'ALL' || team.jenjang === selectedJenjang;
    const matchesStatus = selectedStatus === 'ALL' || team.status === selectedStatus;
    const matchesSearch =
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.platoonName && team.platoonName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJenjang && matchesStatus && matchesSearch;
  });

  // Statistics
  const countSD = teams.filter(t => t.jenjang === 'SD').length;
  const countSMP = teams.filter(t => t.jenjang === 'SMP').length;
  const totalRevenue = teams
    .filter(t => t.status === 'verified' || t.paymentStatus === 'paid')
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

  function handleRandomize(jenjang) {
    const count = randomizeLotNumbers(jenjang);
    setLotSuccessMsg(`Berhasil mengocok ${count} nomor undian untuk jenjang ${jenjang}!`);
    setTimeout(() => setLotSuccessMsg(''), 4000);
  }

  if (inspectingTeam) {
    const liveTeam = teams.find(t => t.id === inspectingTeam.id) || inspectingTeam;
    return (
      <TeamInspectionPage
        team={liveTeam}
        inspectionStage={inspectingStage}
        onBack={() => setInspectingTeam(null)}
        onVerify={handleQuickVerify}
        openModal={openModal}
        deleteTeam={deleteTeam}
      />
    );
  }

  const currentActiveMenu =
    activeTab === 'lottery'
      ? 'tm'
      : activeTab === 'recap'
      ? 'rekap_nilai'
      : 'pendaftaran';

  return (
    <SimpaskorSidebarLayout
      activeMenu={currentActiveMenu}
      title="Sekretariat & Rekapitulasi"
      subtitle="Manajemen pendaftaran, verifikasi berkas, kuota peleton & undian nomor tampil"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={exportTeamsCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
            title="Ekspor Data Rekap Tim ke format CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Ekspor Data</span>
            <span>Excel (CSV)</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Page Title & Subtitle banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-400/20">
                  Panel Sekretariat
                </span>
                <span className="text-xs text-slate-400">Admin Manajemen LBB 2026</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-white mt-0.5">
                Dashboard Manajemen & Rekapitulasi
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Sinkronisasi Otomatis Cloud & Spreadsheet</span>
          </div>
        </div>

        {/* Quota & Key Metrics Grid (Compact & Professional) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* SD Quota */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Kuota SD / MI</span>
              <span className="text-[10px] font-black text-red-700 bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded">Target 18</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 leading-none">{countSD}</span>
              <span className="text-[11px] text-slate-400 font-bold">/ 18 Peleton</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((countSD / 18) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* SMP Quota */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Kuota SMP / MTs</span>
              <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.2 rounded">Target 18</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 leading-none">{countSMP}</span>
              <span className="text-[11px] text-slate-400 font-bold">/ 18 Peleton</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((countSMP / 18) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Perlu Tindakan</span>
              {stage1PendingCount + stage2PendingCount > 0 ? (
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded animate-pulse">
                  {stage1PendingCount + stage2PendingCount} Antrean
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Bersih
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 leading-none">
                {stage1PendingCount + stage2PendingCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Berkas Masuk</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {stage1PendingCount} pendaftaran • {stage2PendingCount} verifikasi
            </p>
          </div>

          {/* Total Dana Masuk */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Penerimaan Dana</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">BRI Valid</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 leading-none my-0.5">
              Rp{(totalRevenue / 1000).toLocaleString('id-ID')}k
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              Akumulasi gelombang 1 & 2
            </p>
          </div>
        </div>

        {/* Tab Selection: Khusus Tahap 1 Pendaftaran & Verifikasi Berkas */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: 'registration',
                step: '01',
                title: 'Pendaftaran',
                subtitle: 'Cek Berkas & Bayar',
                icon: FileText,
                badge: stage1PendingCount > 0 ? `${stage1PendingCount} Baru` : null,
                activeGradient: 'from-blue-600 via-blue-700 to-indigo-800 text-white shadow-blue-500/25',
                activeRing: 'ring-blue-500/30',
                stepBadge: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
                idleBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                isExternal: false,
              },
              {
                id: 'verification',
                step: '02',
                title: 'Verifikasi',
                subtitle: 'Roster 25 & Rekom',
                icon: ShieldCheck,
                badge: stage2PendingCount > 0 ? `${stage2PendingCount} Perlu ACC` : null,
                activeGradient: 'from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-emerald-500/25',
                activeRing: 'ring-emerald-500/30',
                stepBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
                idleBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                isExternal: false,
              },
              {
                id: 'tm_link',
                step: '03',
                title: 'Technical Meeting',
                subtitle: 'Menu Khusus TM ➔',
                icon: Shuffle,
                badge: '1 Fitur 1 Menu',
                activeGradient: 'from-purple-600 via-purple-700 to-violet-800 text-white shadow-purple-500/25',
                activeRing: 'ring-purple-500/30',
                stepBadge: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
                idleBadge: 'bg-purple-50 text-purple-700 border-purple-200',
                isExternal: true,
                targetView: 'tm',
              },
              {
                id: 'recap_link',
                step: '04',
                title: 'Rekap Nilai',
                subtitle: 'Menu Khusus Rekap ➔',
                icon: Trophy,
                badge: '1 Fitur 1 Menu',
                activeGradient: 'from-amber-500 via-amber-600 to-orange-700 text-white shadow-amber-500/25',
                activeRing: 'ring-amber-500/30',
                stepBadge: 'bg-amber-500/20 text-amber-100 border-amber-300/30',
                idleBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                isExternal: true,
                targetView: 'rekap_nilai',
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.isExternal && tab.targetView) {
                      setActiveView(tab.targetView);
                    } else {
                      setActiveTab(tab.id);
                      setSelectedStatus('ALL');
                    }
                  }}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl transition-all duration-200 text-left cursor-pointer border overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${tab.activeGradient} shadow-lg ring-2 ${tab.activeRing} border-transparent translate-y-[-1px]`
                      : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                          isActive
                            ? tab.stepBadge
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        Tahap {tab.step}
                      </span>
                    </div>

                    {tab.badge && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tight shadow-xs ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30 backdrop-blur-xs'
                            : tab.idleBadge
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-inner ${
                        isActive
                          ? 'bg-white/15 text-white backdrop-blur-xs'
                          : 'bg-white text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4
                        className={`font-black text-sm uppercase tracking-tight leading-tight truncate ${
                          isActive ? 'text-white' : 'text-slate-900 group-hover:text-slate-950'
                        }`}
                      >
                        {tab.title}
                      </h4>
                      <p
                        className={`text-[11px] truncate leading-tight mt-0.5 ${
                          isActive ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {tab.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Active bottom subtle glow line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 rounded-full mx-4" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: PENDAFTARAN (CEK BERKAS PENDAFTARAN) */}
        {activeTab === 'registration' && (
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
        )}

        {/* TAB 2: VERIFIKASI (BIODATA 25 PERSONEL & SURAT REKOMENDASI) */}
        {activeTab === 'verification' && (
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

        {/* TAB 3: UNDIAN NOMOR URUT TAMPIL (TECHNICAL MEETING) */}
        {activeTab === 'lottery' && (
          <LotteryTab
            teams={teams}
            handleRandomize={handleRandomize}
            lotSuccessMsg={lotSuccessMsg}
            updateTeamDraw={updateTeamDraw}
          />
        )}

        {/* TAB 4: REKAPITULASI NILAI & KEJUARAAN */}
        {activeTab === 'recap' && (
          <RecapTab
            teams={teams}
            scores={scores}
            selectedJenjang={selectedJenjang}
            setSelectedJenjang={setSelectedJenjang}
            totalRevenue={totalRevenue}
            openModal={openModal}
            setActiveView={setActiveView}
          />
        )}
      </div>
    </SimpaskorSidebarLayout>
  );
}
