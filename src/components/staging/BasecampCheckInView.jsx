import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Compass,
  MapPin,
  ChevronRight,
  Layers,
  ListFilter,
  CheckSquare
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import QRScannerModal from '../common/QRScannerModal.jsx';
import InteractiveBasecampMap from './components/InteractiveBasecampMap.jsx';

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
  // Petugas Khusus Basecamp, Admin Sekretariat, dan Superadmin
  const canProcess = ['checkin', 'admin', 'superadmin'].includes(userRole);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [mainViewMode, setMainViewMode] = useState('list'); // 'list' (default terbuka pertama) | 'map'
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
  const competitionTeams = useMemo(() => {
    return teams.filter(t => ['verified', 'drawn'].includes(t.status) || t.lotNumber);
  }, [teams]);

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

  // Helper resolusi logo sekolah
  const getTeamLogo = (team) => {
    if (!team) return null;
    if (team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#') {
      return team.files.schoolLogo.url;
    }
    if (typeof team.files?.schoolLogo === 'string' && team.files.schoolLogo.length > 5) {
      return team.files.schoolLogo;
    }
    if (team.avatar) return team.avatar;
    if (team.logoUrl) return team.logoUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName || 'LBB')}&background=8B0000&color=fff&bold=true`;
  };

  // Stats
  const checkedInTeams = competitionTeams.filter(t => isTeamCheckedIn(t.id));
  const pendingTeams = competitionTeams.filter(t => !isTeamCheckedIn(t.id));
  const checkedOutTeams = competitionTeams.filter(t => isTeamCheckedOut(t.id));
  const activeInVenueTeams = checkedInTeams.filter(t => !isTeamCheckedOut(t.id));

  const handleSelectTeam = (team) => {
    if (!team || team.id === selectedTeamId) {
      setSelectedTeamId(null);
      setKtpOfficialName('');
      return;
    }
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

  // Pencarian komprehensif QR / Teks
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
      (t.schoolBaseName && t.schoolBaseName.toLowerCase().includes(qLower)) ||
      (t.platoonName && t.platoonName.toLowerCase().includes(qLower)) ||
      (t.dantonName && t.dantonName.toLowerCase().includes(qLower)) ||
      (t.officialName && t.officialName.toLowerCase().includes(qLower))
    );

    if (matched) {
      handleSelectTeam(matched);
      setToastMsg(`Peleton ${matched.schoolName} (${matched.regCode}) berhasil terdeteksi!`);
      setQrInput('');
      setTimeout(() => setToastMsg(''), 4000);
    } else {
      alert(`Peleton dengan pencarian / kode "${scannedText}" tidak ditemukan dalam daftar peserta.`);
    }
  };

  const handleSearchQR = (e) => {
    if (e) e.preventDefault();
    if (!qrInput.trim()) return;
    handleQRScanResult(qrInput);
  };

  // Live match dropdown suggestions saat mengetik di box pencarian
  const searchSuggestions = useMemo(() => {
    const q = qrInput.trim().toLowerCase();
    if (q.length < 2) return [];

    return competitionTeams.filter(t =>
      (t.schoolName && t.schoolName.toLowerCase().includes(q)) ||
      (t.schoolBaseName && t.schoolBaseName.toLowerCase().includes(q)) ||
      (t.platoonName && t.platoonName.toLowerCase().includes(q)) ||
      (t.dantonName && t.dantonName.toLowerCase().includes(q)) ||
      (t.regCode && t.regCode.toLowerCase().includes(q)) ||
      (t.lotNumber && String(t.lotNumber) === q)
    ).slice(0, 5);
  }, [qrInput, competitionTeams]);

  const selectedTeamData = teams.find(t => t.id === selectedTeamId);
  const selectedTeamStaging = selectedTeamId ? getTeamStaging(selectedTeamId) : null;

  // Filtered teams for List View
  const filteredTeamsCheckIn = useMemo(() => {
    return competitionTeams.filter(team => {
      const q = searchFilter.trim().toLowerCase();
      const matchesSearch = !q ||
        (team.schoolName && team.schoolName.toLowerCase().includes(q)) ||
        (team.schoolBaseName && team.schoolBaseName.toLowerCase().includes(q)) ||
        (team.platoonName && team.platoonName.toLowerCase().includes(q)) ||
        (team.dantonName && team.dantonName.toLowerCase().includes(q)) ||
        (team.officialName && team.officialName.toLowerCase().includes(q)) ||
        (team.regCode && team.regCode.toLowerCase().includes(q)) ||
        (team.lotNumber && String(team.lotNumber) === q);

      if (!matchesSearch) return false;

      if (statusFilterCheckIn === 'pending') return !isTeamCheckedIn(team.id);
      if (statusFilterCheckIn === 'checkedin') return isTeamCheckedIn(team.id);
      return true;
    });
  }, [competitionTeams, searchFilter, statusFilterCheckIn, staging]);

  const filteredTeamsCheckOut = useMemo(() => {
    return competitionTeams.filter(team => {
      const q = searchFilter.trim().toLowerCase();
      const matchesSearch = !q ||
        (team.schoolName && team.schoolName.toLowerCase().includes(q)) ||
        (team.schoolBaseName && team.schoolBaseName.toLowerCase().includes(q)) ||
        (team.platoonName && team.platoonName.toLowerCase().includes(q)) ||
        (team.dantonName && team.dantonName.toLowerCase().includes(q)) ||
        (team.officialName && team.officialName.toLowerCase().includes(q)) ||
        (team.regCode && team.regCode.toLowerCase().includes(q)) ||
        (team.lotNumber && String(team.lotNumber) === q);

      if (!matchesSearch) return false;

      if (statusFilterCheckOut === 'in_venue') return isTeamCheckedIn(team.id) && !isTeamCheckedOut(team.id);
      if (statusFilterCheckOut === 'checkedout') return isTeamCheckedOut(team.id);
      return true;
    });
  }, [competitionTeams, searchFilter, statusFilterCheckOut, staging]);

  return (
    <SimpaskorSidebarLayout
      activeMenu={activeTab === 'checkout' ? 'checkout' : 'checkin'}
      title={activeTab === 'checkin' ? "Check-In Basecamp & Logistik" : "Check-Out Basecamp & Kliring"}
      subtitle={activeTab === 'checkin' ? "Registrasi kedatangan peleton hari-H, serah terima KTP jaminan, & distribusi paket logistik" : "Inspeksi kebersihan ruang transit basecamp, pembuangan sampah terpilah, & pengembalian KTP fisik"}
    >
      <div className="space-y-5 sm:space-y-6">

        {/* ============================================================== */}
        {/* 1. HERO HEADER: TAB CHECK-IN/OUT & STATISTIK KEDATANGAN       */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/90 relative overflow-hidden transition-all duration-300">
          {/* Top Row Switcher */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-slate-100">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('checkin');
                  setSelectedTeamId(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                  activeTab === 'checkin'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <LogIn className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'checkin' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>Check-In<span className="hidden md:inline"> Kedatangan</span></span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  activeTab === 'checkin' ? 'bg-teal-50 text-teal-800 border border-teal-200/80' : 'bg-slate-200/70 text-slate-600'
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
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                  activeTab === 'checkout'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <LogOut className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'checkout' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Check-Out<span className="hidden md:inline"> Kepulangan</span></span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  activeTab === 'checkout' ? 'bg-rose-50 text-rose-800 border border-rose-200/80' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {checkedOutTeams.length}/{competitionTeams.length}
                </span>
              </button>
            </div>

            <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
              activeTab === 'checkin'
                ? 'bg-teal-50 border-teal-200/80 text-teal-800'
                : 'bg-rose-50 border-rose-200/80 text-rose-800'
            }`}>
              {activeTab === 'checkin' ? (
                <>
                  <LogIn className="w-3 h-3" />
                  <span>Tahap 4: Pos Kedatangan Kontingen</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3 h-3" />
                  <span>Tahap 9: Pos Kepulangan & Kliring</span>
                </>
              )}
            </div>
          </div>

          {/* Banner Title & Stats */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-5">
            <div className="space-y-0.5 min-w-0">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                {activeTab === 'checkin' ? 'Check-In Basecamp & Logistik Lomba' : 'Check-Out Basecamp & Pengembalian Jaminan'}
              </h1>
              <p className="text-xs text-slate-500 max-w-xl line-clamp-2 leading-relaxed">
                {activeTab === 'checkin'
                  ? 'Pencatatan kedatangan resmi peleton, penyerahan KTP jaminan fasilitas transit, serta serah terima nomor dada & air mineral.'
                  : 'Pemeriksaan kebersihan ruang transit peleton, verifikasi pengembalian 2 kantong sampah terpilah, dan pengembalian KTP jaminan.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
              {activeTab === 'checkin' ? (
                <>
                  <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl px-3 py-2 text-center flex-1 min-w-0 sm:min-w-[105px]">
                    <span className="text-[10px] uppercase font-bold text-teal-800 block truncate">Tiba di Lokasi</span>
                    <span className="text-base sm:text-lg font-black text-teal-950 font-mono block mt-0.5">{checkedInTeams.length} Tim</span>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-2 text-center flex-1 min-w-0 sm:min-w-[105px]">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block truncate">Belum Tiba</span>
                    <span className="text-base sm:text-lg font-black text-amber-950 font-mono block mt-0.5">{pendingTeams.length} Tim</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-2 text-center flex-1 min-w-0 sm:min-w-[105px]">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block truncate">Masih di Lokasi</span>
                    <span className="text-base sm:text-lg font-black text-amber-950 font-mono block mt-0.5">{activeInVenueTeams.length} Tim</span>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-3 py-2 text-center flex-1 min-w-0 sm:min-w-[105px]">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block truncate">Sudah Pulang</span>
                    <span className="text-base sm:text-lg font-black text-emerald-950 font-mono block mt-0.5">{checkedOutTeams.length} Tim</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Alert Notification Toast */}
        {toastMsg && (
          <div className={`${activeTab === 'checkin' ? 'bg-teal-600' : 'bg-emerald-600'} text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="leading-snug">{toastMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. OPERATIONAL BAR (FULL WIDTH): PINDAI, CARI & VIEW MODE       */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Sisi Kiri: Pindai QR & Live Search Box */}
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 relative">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                placeholder="Pindai QR / ketik nama sekolah, peleton, no undian, danton..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-teal-600 outline-none transition-all shadow-2xs"
              />
              {qrInput && (
                <button
                  onClick={() => setQrInput('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Live Match Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-40 divide-y divide-slate-100 animate-in fade-in">
                  <div className="px-4 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Peleton Ditemukan (Klik untuk Pilih):
                  </div>
                  {searchSuggestions.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        handleSelectTeam(t);
                        setQrInput('');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-teal-50/80 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={getTeamLogo(t)}
                          alt=""
                          className="w-7 h-7 object-contain shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {t.schoolName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block truncate">
                            {t.regCode} • {t.platoonName || t.dantonName || t.jenjang}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full shrink-0">
                        Pilih Peleton
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Kamera QR */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Buka Kamera QR</span>
            </button>
          </div>

          {/* Sisi Kanan: Tab Switcher (Daftar Peleton di KIRI, Peta di KANAN - Full Width di Mobile) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto self-start lg:self-center shrink-0 border border-slate-200">
            <button
              type="button"
              onClick={() => setMainViewMode('list')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mainViewMode === 'list'
                  ? 'bg-teal-700 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ListFilter className={`w-3.5 h-3.5 ${mainViewMode === 'list' ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>Daftar Peleton</span>
            </button>

            <button
              type="button"
              onClick={() => setMainViewMode('map')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mainViewMode === 'map'
                  ? 'bg-teal-700 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${mainViewMode === 'map' ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>Peta Basecamp</span>
            </button>
          </div>

        </div>

        {/* ============================================================== */}
        {/* 3. DEDICATED FORM POPUP / CARD: JIKA ADA TIM TERPILIH           */}
        {/* ============================================================== */}
        {selectedTeamData && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-teal-500 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-teal-200 p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                  <img
                    src={getTeamLogo(selectedTeamData)}
                    alt={selectedTeamData.schoolName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      Formulir {activeTab === 'checkin' ? 'Check-In' : 'Check-Out'}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {selectedTeamData.regCode}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {selectedTeamData.schoolName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeamId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
                title="Tutup Formulir"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM CHECK-IN */}
            {activeTab === 'checkin' ? (
              <form onSubmit={handleProcessCheckIn} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Pembina & Jenis Identitas */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
                      1. Identitas Jaminan Pembina / Official Resmi (KTP)
                    </label>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Nama Lengkap Sesuai KTP:
                      </span>
                      <input
                        type="text"
                        value={ktpOfficialName}
                        onChange={e => setKtpOfficialName(e.target.value)}
                        placeholder="Contoh: Budi Santoso, S.Pd."
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Jenis Kartu Identitas:
                      </span>
                      <div className="flex gap-2">
                        {['KTP Fisik', 'SIM', 'KTA'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setKtpType(type)}
                            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              ktpType === type
                                ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Checklist Logistik */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
                      2. Serah Terima Paket Logistik Lomba
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        { key: 'waterBox', label: '1 Dus Air Mineral 330ml (Sponsor Resmi)' },
                        { key: 'chestNumber', label: '1 Set Nomor Dada Danton & Peleton' },
                        { key: 'cocardOfficial', label: 'ID Card / CoCard Official & Pembina' },
                        { key: 'trashBag', label: '2 Kantong Sampah Terpilah (Organik & Anorganik)' },
                      ].map(item => (
                        <label key={item.key} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={logisticsChecklist[item.key]}
                            onChange={e => setLogisticsChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span className="font-bold text-slate-800">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTeamId(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!canProcess}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-teal-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    Konfirmasi Check-In & Terima KTP
                  </button>
                </div>
              </form>
            ) : (
              /* FORM CHECK-OUT */
              <form onSubmit={handleProcessCheckOut} className="space-y-4">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                  <strong>Pemeriksaan Kliring:</strong> Pastikan ruang kelas telah dibersihkan, sampah disetorkan ke posko kebersihan, lalu serahkan kembali KTP jaminan kepada pembina.
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'roomCleanChecked', label: 'Ruang Transit Basecamp Bersih & Rapih (Tidak ada sampah tertinggal)' },
                    { key: 'sortedTrashReturned', label: 'Kantong Sampah Terpilah Disetorkan ke Pos Kebersihan' },
                    { key: 'ktpReturned', label: 'KTP Fisik Asli Telah Diserahkan Kembali ke Pembina' },
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

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTeamId(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!canProcess}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    Konfirmasi Check-Out & Kembalikan KTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. MAIN DISPLAY (FULL WIDTH DARI KIRI KE KANAN): PETA BASECAMP */}
        {/* ============================================================== */}
        {mainViewMode === 'map' ? (
          <div className="w-full">
            <InteractiveBasecampMap
              teams={teams}
              staging={staging}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
              activeTab={activeTab}
            />
          </div>
        ) : (
          /* ALTERNATIVE VIEW: DAFTAR 36 PELETON TERBAGI 2 KELOMPOK (SD & SMP MASING-MASING 2 KOLOM) */
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  Daftar Seluruh Kontingen Peleton
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total {competitionTeams.length} Peleton Terdaftar Resmi (SD/MI & SMP/MTs)
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                {activeTab === 'checkin' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatusFilterCheckIn('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilterCheckIn === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Semua ({competitionTeams.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilterCheckIn('pending')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilterCheckIn === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      Belum Tiba ({pendingTeams.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilterCheckIn('checkedin')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilterCheckIn === 'checkedin' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                      }`}
                    >
                      Tiba ({checkedInTeams.length})
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatusFilterCheckOut('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilterCheckOut === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Semua ({competitionTeams.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilterCheckOut('in_venue')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilterCheckOut === 'in_venue' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      Masih di Lokasi ({activeInVenueTeams.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilterCheckOut('checkedout')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilterCheckOut === 'checkedout' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      Sudah Pulang ({checkedOutTeams.length})
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Helper Render Kartu Peleton */}
            {(() => {
              const currentListTeams = activeTab === 'checkin' ? filteredTeamsCheckIn : filteredTeamsCheckOut;
              const sdTeams = currentListTeams.filter(t => t.jenjang === 'SD');
              const smpTeams = currentListTeams.filter(t => t.jenjang === 'SMP');

              const renderTeamCard = (team) => {
                const isCheckedIn = isTeamCheckedIn(team.id);
                const isCheckedOut = isTeamCheckedOut(team.id);
                const isSelected = team.id === selectedTeamId;
                const logoUrl = getTeamLogo(team);

                return (
                  <div
                    key={team.id}
                    onClick={() => handleSelectTeam(team)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/30 shadow-md scale-[1.01]'
                        : isCheckedIn
                        ? 'bg-teal-50/50 border-teal-200 hover:bg-teal-50 hover:border-teal-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        <img
                          src={logoUrl}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-900 truncate">
                          {team.schoolName}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                          {team.regCode} &bull; {team.jenjang}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Hadir</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>Standby</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                /* 2 KELOMPOK: KIRI KELOMPOK SD (2 KOLOM), KANAN KELOMPOK SMP (2 KOLOM) */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  
                  {/* SISI KIRI: KELOMPOK SD / MI (2 KOLOM) */}
                  <div className="bg-slate-50/60 rounded-3xl p-4 sm:p-5 border border-amber-200/60 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                        <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            Kelompok SD / MI
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Tingkat Sekolah Dasar / Madrasah Ibtidaiyah
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl text-xs font-black font-mono bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
                        {sdTeams.length} Peleton
                      </span>
                    </div>

                    {sdTeams.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        Tidak ada peleton SD/MI yang cocok dengan filter.
                      </div>
                    ) : (
                      /* 2 Kolom untuk Kelompok SD */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sdTeams.map(team => renderTeamCard(team))}
                      </div>
                    )}
                  </div>

                  {/* SISI KANAN: KELOMPOK SMP / MTs (2 KOLOM) */}
                  <div className="bg-slate-50/60 rounded-3xl p-4 sm:p-5 border border-teal-200/60 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-teal-200/80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-teal-600 shadow-xs" />
                        <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            Kelompok SMP / MTs
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Tingkat Sekolah Menengah Pertama / Madrasah Tsanawiyah
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl text-xs font-black font-mono bg-teal-100 text-teal-900 border border-teal-200 shadow-2xs">
                        {smpTeams.length} Peleton
                      </span>
                    </div>

                    {smpTeams.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        Tidak ada peleton SMP/MTs yang cocok dengan filter.
                      </div>
                    ) : (
                      /* 2 Kolom untuk Kelompok SMP */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {smpTeams.map(team => renderTeamCard(team))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>
        )}

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
