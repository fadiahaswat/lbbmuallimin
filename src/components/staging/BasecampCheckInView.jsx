import React, { useState, useEffect } from 'react';
import {
  LogIn,
  LogOut,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Users,
  CreditCard,
  Droplets,
  PackageCheck,
  Printer,
  ShieldCheck,
  Building2,
  ExternalLink,
  Trash2,
  Tag,
  Camera,
  DoorOpen,
  Sparkles,
  X
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import QRScannerModal from '../common/QRScannerModal.jsx';

export default function BasecampCheckInView({ initialTab = 'checkin' }) {
  const {
    teams,
    staging,
    checkInBasecamp,
    checkOutBasecamp,
    currentUser,
    role
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  // Hanya Petugas Khusus Basecamp (checkin@lbbmuallimin.com) dan Superadmin
  const canProcess = ['checkin', 'superadmin'].includes(userRole);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [qrInput, setQrInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

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
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilterCheckIn, setStatusFilterCheckIn] = useState('all'); // 'all', 'pending', 'checkedin'
  const [statusFilterCheckOut, setStatusFilterCheckOut] = useState('in_venue'); // 'in_venue', 'checkedout', 'all'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Eligible teams (drawn or verified)
  const competitionTeams = teams.filter(t => ['verified', 'drawn'].includes(t.status) || t.lotNumber);

  const getTeamStaging = (teamId) => staging?.[teamId] || staging?.basecamp?.[teamId] || null;

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

  // Stats
  const checkedInTeams = competitionTeams.filter(t => isTeamCheckedIn(t.id));
  const pendingTeams = competitionTeams.filter(t => !isTeamCheckedIn(t.id));
  const checkedOutTeams = competitionTeams.filter(t => isTeamCheckedOut(t.id));
  const activeInVenueTeams = checkedInTeams.filter(t => !isTeamCheckedOut(t.id));

  const handleSelectTeam = (team) => {
    setSelectedTeamId(team.id);
    if (activeTab === 'checkin') {
      setKtpOfficialName(team.officialName || team.coachName || '');
    }
  };

  const handleProcessCheckIn = (e) => {
    e.preventDefault();
    if (!canProcess) return;
    if (!selectedTeamId) {
      alert('Pilih peleton yang akan di-check in terlebih dahulu!');
      return;
    }
    if (!ktpOfficialName.trim()) {
      alert('Nama pemilik identitas (KTP Pembina) wajib diisi!');
      return;
    }

    checkInBasecamp(selectedTeamId, {
      ktpOfficialName: ktpOfficialName.trim(),
      ktpType,
      logistics: logisticsChecklist,
      checkedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    const targetTeam = teams.find(t => t.id === selectedTeamId);
    setToastMsg(`Peleton ${targetTeam?.schoolName || ''} berhasil Check-In Basecamp & menerima logistik!`);
    setSelectedTeamId(null);
    setKtpOfficialName('');
    setQrInput('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleProcessCheckOut = (e) => {
    e.preventDefault();
    if (!canProcess || !selectedTeamId) return;

    if (!checkoutChecklist.roomCleanChecked || !checkoutChecklist.sortedTrashReturned || !checkoutChecklist.ktpReturned) {
      if (!window.confirm('Semua checklist kebersihan dan pengembalian KTP belum dicentang. Tetap lanjutkan Check-Out?')) {
        return;
      }
    }

    checkOutBasecamp(selectedTeamId, {
      ...checkoutChecklist,
      checkedOutAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    const targetTeam = teams.find(t => t.id === selectedTeamId);
    setToastMsg(`Peleton ${targetTeam?.schoolName || ''} berhasil Check-Out & KTP jaminan dikembalikan!`);
    setSelectedTeamId(null);
    setQrInput('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleQRScanResult = (scannedText) => {
    let q = (scannedText || '').trim();
    if (!q) return;

    // Support scanning direct URL like https://lbb.tontimuallimin.com/?reg=LBB27-...
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
      (t.schoolName && t.schoolName.toLowerCase().includes(qLower))
    );

    if (matched) {
      handleSelectTeam(matched);
      setToastMsg(`Peleton ${matched.schoolName} (${matched.regCode}) berhasil terdeteksi!`);
      setTimeout(() => setToastMsg(''), 4000);
    } else {
      alert(`Peleton dengan kode / nomor undian "${scannedText}" tidak ditemukan dalam daftar peserta.`);
    }
  };

  const handleSearchQR = (e) => {
    if (e) e.preventDefault();
    if (!qrInput.trim()) return;
    handleQRScanResult(qrInput);
  };

  const selectedTeamData = teams.find(t => t.id === selectedTeamId);
  const selectedTeamStaging = selectedTeamId ? getTeamStaging(selectedTeamId) : null;

  // Filtered teams for Check-In right column
  const filteredTeamsCheckIn = competitionTeams.filter(team => {
    const matchesSearch = !searchFilter.trim() ||
      (team.schoolName && team.schoolName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (team.regCode && team.regCode.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (team.lotNumber && String(team.lotNumber) === searchFilter.trim());

    if (!matchesSearch) return false;

    if (statusFilterCheckIn === 'pending') return !isTeamCheckedIn(team.id);
    if (statusFilterCheckIn === 'checkedin') return isTeamCheckedIn(team.id);
    return true;
  });

  // Filtered teams for Check-Out right column
  const filteredTeamsCheckOut = competitionTeams.filter(team => {
    const matchesSearch = !searchFilter.trim() ||
      (team.schoolName && team.schoolName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (team.regCode && team.regCode.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (team.lotNumber && String(team.lotNumber) === searchFilter.trim());

    if (!matchesSearch) return false;

    if (statusFilterCheckOut === 'in_venue') return isTeamCheckedIn(team.id) && !isTeamCheckedOut(team.id);
    if (statusFilterCheckOut === 'checkedout') return isTeamCheckedOut(team.id);
    return true;
  });

  return (
    <SimpaskorSidebarLayout
      activeMenu="checkin"
      title={activeTab === 'checkin' ? "Check-In Basecamp & Logistik" : "Check-Out Basecamp & Kliring"}
      subtitle={activeTab === 'checkin' ? "Registrasi kedatangan peleton hari-H, serah terima KTP jaminan, & distribusi paket logistik" : "Inspeksi kebersihan ruang transit basecamp, pembuangan sampah terpilah, & pengembalian KTP fisik"}
    >
      <div className="space-y-4 sm:space-y-6">

        {/* Unified Mode Switcher: Check-In vs Check-Out (Segmen Tab Terpadu) */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-2xs max-w-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('checkin');
              setSelectedTeamId(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-98 ${
              activeTab === 'checkin'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>Check-In Kedatangan</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'checkin' ? 'bg-teal-900/60 text-teal-200' : 'bg-slate-300 text-slate-700'
            }`}>
              {checkedInTeams.length}/{competitionTeams.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('checkout');
              setSelectedTeamId(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-98 ${
              activeTab === 'checkout'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Check-Out Kepulangan</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'checkout' ? 'bg-rose-900/60 text-rose-200' : 'bg-slate-300 text-slate-700'
            }`}>
              {checkedOutTeams.length}/{competitionTeams.length}
            </span>
          </button>
        </div>

        {/* Dynamic Header Card Based on Active Tab */}
        {activeTab === 'checkin' ? (
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-teal-900/40 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Tahap 4: Pos Kedatangan Kontingen</span>
                </div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                  Check-In Basecamp & Logistik Lomba
                </h1>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Pencatatan kedatangan resmi peleton, penyerahan identitas KTP Pembina/Pelatih sebagai jaminan fasilitas transit, serta serah terima nomor dada & air mineral.
                </p>
              </div>

              {/* Micro Stat Cards */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 shrink-0 pt-1 md:pt-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center min-w-0 sm:min-w-[110px]">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-teal-300 block truncate">Tiba di Lokasi</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">{checkedInTeams.length} Tim</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center min-w-0 sm:min-w-[110px]">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-300 block truncate">Belum Tiba</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">{pendingTeams.length} Tim</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-rose-900/40 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Tahap 9: Pos Kepulangan & Kliring</span>
                </div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                  Check-Out Basecamp & Pengembalian Jaminan
                </h1>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Pemeriksaan kebersihan ruang transit peleton, verifikasi pengembalian 2 kantong sampah terpilah, pengembalian KTP Pembina, serta pelepasan resmi kontingen.
                </p>
              </div>

              {/* Micro Stat Cards */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 shrink-0 pt-1 md:pt-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center min-w-0 sm:min-w-[110px]">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-300 block truncate">Masih di Lokasi</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">{activeInVenueTeams.length} Tim</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center min-w-0 sm:min-w-[110px]">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-300 block truncate">Sudah Pulang</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">{checkedOutTeams.length} Tim</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Notification Toast */}
        {toastMsg && (
          <div className={`${activeTab === 'checkin' ? 'bg-teal-600' : 'bg-emerald-600'} text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in`}>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="leading-snug">{toastMsg}</span>
          </div>
        )}

        {/* 2 Column: Left Scanner & Form, Right Team List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

          {/* Left Column: Scanner & Action Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">

            {/* Quick QR Search Box (Berfungsi untuk Check-In & Check-Out) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${activeTab === 'checkin' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-rose-50 border-rose-200 text-rose-700'} border flex items-center justify-center font-bold shrink-0`}>
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase truncate">
                      Pindai / Cari Peleton Cepat
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      Scan QR Code ID Card atau ketik kode pendaftaran
                    </p>
                  </div>
                </div>

                {/* Desktop shortcut button */}
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 ${activeTab === 'checkin' ? 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700' : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'} border text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shrink-0`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Kamera QR</span>
                </button>
              </div>

              {/* Action Bar: Pindai (Buka Modal Kamera) + Pencarian Teks */}
              <div className="space-y-2 pt-0.5">
                <div className="flex gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    <input
                      type="text"
                      value={qrInput}
                      onChange={e => setQrInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchQR(e);
                        }
                      }}
                      placeholder="Ketik kode LBB / No Tampil..."
                      className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white ${activeTab === 'checkin' ? 'focus:border-teal-600' : 'focus:border-rose-600'} outline-none transition-all shadow-2xs`}
                    />
                  </div>

                  {/* Tombol Pindai: Membuka modal kamera fullscreen scanner */}
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className={`px-3.5 sm:px-5 py-2 sm:py-2.5 ${activeTab === 'checkin' ? 'bg-teal-600 hover:bg-teal-500' : 'bg-rose-600 hover:bg-rose-500'} active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0`}
                    title="Buka Kamera Pemindai QR Code"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Pindai</span>
                  </button>

                  {/* Tombol Cari manual */}
                  {qrInput.trim() && (
                    <button
                      type="button"
                      onClick={handleSearchQR}
                      className="px-3.5 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                      title="Cari data manual"
                    >
                      Cari
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-tight">
                  Ketuk <strong>Pindai</strong> untuk scan QR via kamera HP / webcam, atau ketik kode peleton.
                </p>
              </div>
            </div>

            {/* ACTION FORM: TAMPIL SESUAI TAB (CHECK-IN vs CHECK-OUT) */}
            {activeTab === 'checkin' ? (
              /* TAB 1: FORM CHECK-IN KEDATANGAN */
              selectedTeamData ? (
                <form onSubmit={handleProcessCheckIn} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-teal-500 shadow-lg space-y-4 sm:space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-600 text-white font-mono font-black text-sm sm:text-base flex items-center justify-center shadow-md shadow-teal-600/30 shrink-0">
                        {selectedTeamData.lotNumber ? String(selectedTeamData.lotNumber).padStart(2, '0') : '#'}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">{selectedTeamData.schoolName}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-mono truncate">{selectedTeamData.regCode} • Jenjang {selectedTeamData.jenjang}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTeamId(null)}
                      className="text-xs text-slate-400 hover:text-rose-600 font-bold shrink-0 ml-2 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  {/* KTP Pembina Section */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-teal-600" />
                      <span>Jaminan Identitas Pembina / Official</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">Nama Pemilik Identitas:</span>
                        <input
                          type="text"
                          required
                          value={ktpOfficialName}
                          onChange={e => setKtpOfficialName(e.target.value)}
                          placeholder="Nama Pembina / Guru Pendamping"
                          className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-teal-600 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">Jenis Kartu Identitas:</span>
                        <select
                          value={ktpType}
                          onChange={e => setKtpType(e.target.value)}
                          className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-teal-600 outline-none"
                        >
                          <option value="KTP Fisik">KTP Asli Fisik</option>
                          <option value="SIM">SIM Asli</option>
                          <option value="KTA Guru">KTA Pegawai / Guru</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Checklist */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-teal-600" />
                      <span>Serah Terima Paket Logistik LBB:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.waterBox}
                          onChange={e => setLogisticsChecklist(prev => ({ ...prev, waterBox: e.target.checked }))}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-bold text-slate-800">1 Box Air Mineral (24 Botol)</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.chestNumber}
                          onChange={e => setLogisticsChecklist(prev => ({ ...prev, chestNumber: e.target.checked }))}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-bold text-slate-800">Nomor Dada Tampil Peleton</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.cocardOfficial}
                          onChange={e => setLogisticsChecklist(prev => ({ ...prev, cocardOfficial: e.target.checked }))}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-bold text-slate-800">Cocard Pendamping Peleton (3 Pcs)</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.trashBag}
                          onChange={e => setLogisticsChecklist(prev => ({ ...prev, trashBag: e.target.checked }))}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-bold text-slate-800">Kantong Sampah Terpilah (2 Pcs)</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canProcess}
                    className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg shadow-teal-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    Konfirmasi Check-In & Serahkan Logistik
                  </button>
                </form>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-2 sm:space-y-3">
                  <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-700">Pilih Peleton untuk Check-In</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm mx-auto">
                    Silakan scan QR code peleton dengan tombol <strong>Pindai</strong> di atas atau pilih salah satu tim dari daftar di sebelah kanan.
                  </p>
                </div>
              )
            ) : (
              /* TAB 2: FORM CHECK-OUT KEPULANGAN */
              selectedTeamData ? (
                <form onSubmit={handleProcessCheckOut} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-rose-500 shadow-lg space-y-4 sm:space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-rose-600 text-white font-mono font-black text-sm sm:text-base flex items-center justify-center shadow-md shadow-rose-600/30 shrink-0">
                        {selectedTeamData.lotNumber ? String(selectedTeamData.lotNumber).padStart(2, '0') : '#'}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">{selectedTeamData.schoolName}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-mono truncate">
                          {selectedTeamData.regCode} • Check-In: {selectedTeamStaging?.checkedInAt || selectedTeamStaging?.basecampLogistics?.checkedInAt || '-'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTeamId(null)}
                      className="text-xs text-slate-400 hover:text-slate-700 font-bold shrink-0 ml-2 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  {/* KTP Info Yang Ditahan */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Jaminan Identitas Yang Ditahan Saat Check-In:
                    </span>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {selectedTeamStaging?.ktpOfficialName || selectedTeamStaging?.basecampLogistics?.ktpHolderName || selectedTeamData.officialName || selectedTeamData.coachName || 'Pembina Resmi Peleton'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">
                          {selectedTeamStaging?.ktpType || selectedTeamStaging?.basecampLogistics?.ktpType || 'KTP Asli Fisik'} • Wajib dikembalikan kepada pembina bersangkutan
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Clearance Ruang Transit */}
                  <div className="space-y-3 pt-1">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>Verifikasi Kliring & Kebersihan Ruang Transit:</span>
                    </label>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checkoutChecklist.roomCleanChecked}
                          onChange={e => setCheckoutChecklist(prev => ({ ...prev, roomCleanChecked: e.target.checked }))}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">Ruang Transit Bersih & Rapih</span>
                          <span className="text-[11px] text-slate-500">Tidak ada sampah, botol minuman, atau barang tertinggal di area kelas/selasar</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checkoutChecklist.sortedTrashReturned}
                          onChange={e => setCheckoutChecklist(prev => ({ ...prev, sortedTrashReturned: e.target.checked }))}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">Kantong Sampah Terpilah Dibuang ke Posko Sampah</span>
                          <span className="text-[11px] text-slate-500">2 kantong sampah terpilah telah disetorkan ke pos kebersihan</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checkoutChecklist.ktpReturned}
                          onChange={e => setCheckoutChecklist(prev => ({ ...prev, ktpReturned: e.target.checked }))}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">KTP Fisik Telah Diserahkan Kembali ke Pembina</span>
                          <span className="text-[11px] text-slate-500">Jaminan KTP diserahkan langsung kepada pembina yang bersangkutan</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Check-Out Button */}
                  <button
                    type="submit"
                    disabled={!canProcess}
                    className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    Konfirmasi Check-Out & Kembalikan KTP
                  </button>
                </form>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-2 sm:space-y-3">
                  <DoorOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-700">Pilih Peleton yang Hendak Check-Out</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm mx-auto">
                    Pilih peleton dari daftar di sebelah kanan saat pembina mengajukan kepulangan kontingen dan meminta pengembalian KTP jaminan.
                  </p>
                </div>
              )
            )}

          </div>

          {/* Right Column: Dynamic Team List Based on Active Tab (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                  {activeTab === 'checkin' ? 'Status Kedatangan Peleton' : 'Status Kepulangan Peleton'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeTab === 'checkin' ? 'Klik tim untuk proses Check-In kedatangan' : 'Klik tim untuk inspeksi & Check-Out'}
                </p>
              </div>
              <span className={`text-xs font-mono font-bold ${activeTab === 'checkin' ? 'text-teal-700 bg-teal-50' : 'text-rose-700 bg-rose-50'} px-2.5 py-1 rounded-lg`}>
                {activeTab === 'checkin'
                  ? `${checkedInTeams.length} / ${competitionTeams.length}`
                  : `${checkedOutTeams.length} / ${competitionTeams.length}`
                }
              </span>
            </div>

            {/* Search Filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Cari nama sekolah / kode..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>

            {/* Quick Status Filter Pills */}
            {activeTab === 'checkin' ? (
              <div className="flex gap-1.5 text-xs font-bold overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStatusFilterCheckIn('all')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    statusFilterCheckIn === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({competitionTeams.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilterCheckIn('pending')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    statusFilterCheckIn === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Belum Tiba ({pendingTeams.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilterCheckIn('checkedin')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    statusFilterCheckIn === 'checkedin' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                  }`}
                >
                  Tiba ({checkedInTeams.length})
                </button>
              </div>
            ) : (
              <div className="flex gap-1.5 text-xs font-bold overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStatusFilterCheckOut('in_venue')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    statusFilterCheckOut === 'in_venue' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Di Lokasi ({activeInVenueTeams.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilterCheckOut('checkedout')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    statusFilterCheckOut === 'checkedout' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Sudah Pulang ({checkedOutTeams.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilterCheckOut('all')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    statusFilterCheckOut === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({competitionTeams.length})
                </button>
              </div>
            )}

            {/* List Peleton */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {(activeTab === 'checkin' ? filteredTeamsCheckIn : filteredTeamsCheckOut).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Tidak ada data peleton yang sesuai filter.
                </div>
              ) : (
                (activeTab === 'checkin' ? filteredTeamsCheckIn : filteredTeamsCheckOut).map(team => {
                  const isCheckedIn = isTeamCheckedIn(team.id);
                  const isCheckedOut = isTeamCheckedOut(team.id);
                  const isSelected = team.id === selectedTeamId;

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleSelectTeam(team)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? (activeTab === 'checkin' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20')
                          : 'bg-slate-50 hover:bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '#'}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 truncate">{team.schoolName}</h4>
                          <p className="text-[10px] text-slate-500 font-mono truncate">
                            {team.regCode} • {team.jenjang}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {activeTab === 'checkin' ? (
                          isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{getTeamCheckInTime(team.id)}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" />
                              <span>Belum Tiba</span>
                            </span>
                          )
                        ) : (
                          isCheckedOut ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{getTeamCheckOutTime(team.id)}</span>
                            </span>
                          ) : isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                              <DoorOpen className="w-3 h-3" />
                              <span>Di Lokasi</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                              <span>Belum Tiba</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* QR Scanner Fullscreen Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanResult}
      />
    </SimpaskorSidebarLayout>
  );
}
